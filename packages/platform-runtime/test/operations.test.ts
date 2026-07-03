import { test } from "node:test";
import assert from "node:assert/strict";
import { buildOperations, proofUnit, sealProof, TENANT } from "./operations-harness.ts";
import { OperationsAuditLog } from "../src/control/operations/operations-audit-log.ts";
import { unitHash } from "../src/control/operations/proof-unit.ts";
import { createProofRecord } from "../src/control/operations/proof-record.ts";
import { canTransition } from "../src/control/operations/incident-lifecycle.ts";
import type { MetricPoint } from "../src/control/operations/types.ts";

function latency(value: number, at: number): MetricPoint {
  return { tenantId: TENANT, metric: "http.latency.ms", value, at };
}

// ------------------------------ Monitoring / telemetry / observability (real-time) ------------------------------

test("telemetry: metrics are ingested only for an active tenant + registered metric (deny-by-default)", async () => {
  const { ops } = await buildOperations();
  const now = Date.now();
  assert.equal(ops.observeMetric(latency(100, now)), true);
  assert.equal(ops.observeMetric({ tenantId: "unknown-tenant", metric: "http.latency.ms", value: 1, at: now }), false);
  assert.equal(ops.observeMetric({ tenantId: TENANT, metric: "not.registered", value: 1, at: now }), false);
  const stats = ops.ingest.stats();
  assert.equal(stats.acceptedMetrics, 1);
  assert.equal(stats.droppedUnknownTenant, 1);
  assert.equal(stats.droppedUnknownMetric, 1);
});

test("telemetry: ring buffer is bounded by tenant retention (backpressure via eviction)", async () => {
  const { ops, substrate } = await buildOperations();
  substrate.metadata.put("operations:tenant:small", { tenantId: "small", displayName: "s", status: "active", maxTrustLevel: 1, retention: { metricSamples: 3, spans: 3, logs: 3 } });
  substrate.metadata.put("operations:metric-def:m", { metricId: "m", kind: "gauge", unit: "x", tenantScope: "*" });
  for (let i = 0; i < 10; i++) ops.observeMetric({ tenantId: "small", metric: "m", value: i, at: Date.now() + i });
  assert.equal(ops.ingest.metrics.samples("small", "m").length, 3);
});

test("observability: percentile aggregation + snapshot payload is tenant-scoped", async () => {
  const { ops } = await buildOperations();
  const base = Date.now();
  for (let i = 1; i <= 100; i++) ops.observeMetric(latency(i, base + i));
  const p95 = ops.observability.aggregateWindow(TENANT, "http.latency.ms", "p95", 60_000, base + 101);
  assert.equal(p95, 95);
  const snap = ops.observability.snapshot(TENANT, 60_000, base + 101);
  assert.equal(snap.tenantId, TENANT);
  assert.ok(snap.metrics.some((m) => m.metric === "http.latency.ms" && m.count === 100));
});

// ------------------------------ Health monitoring ------------------------------

test("health: fail-closed unknown with no fresh sample, healthy within bounds, unhealthy over max", async () => {
  const { ops } = await buildOperations();
  const t0 = Date.now();
  assert.equal(ops.evaluateHealth(TENANT, t0).state, "unknown"); // no data => unknown (fail-closed)
  for (let i = 0; i < 20; i++) ops.observeMetric(latency(100, t0 + i));
  assert.equal(ops.evaluateHealth(TENANT, t0 + 21).state, "healthy");
  for (let i = 0; i < 20; i++) ops.observeMetric(latency(900, t0 + 100 + i));
  assert.equal(ops.evaluateHealth(TENANT, t0 + 130).state, "unhealthy");
});

// ------------------------------ SLO ------------------------------

test("slo: compliant within objective, breach recorded to audit when exceeded", async () => {
  const { ops } = await buildOperations();
  const t0 = Date.now();
  for (let i = 0; i < 50; i++) ops.observeMetric(latency(100, t0 + i));
  assert.equal(ops.evaluateSlos(TENANT, t0 + 51)[0]?.compliant, true);
  for (let i = 0; i < 50; i++) ops.observeMetric(latency(500, t0 + 100 + i));
  const breach = ops.evaluateSlos(TENANT, t0 + 160)[0];
  assert.equal(breach?.compliant, false);
  assert.ok(ops.audit.entries().some((e) => e.event === "OPS_SLO_BREACH"));
});

// ------------------------------ Alerting + auto-incident ------------------------------

test("alert: crossing the threshold fires once (edge) and auto-opens a governed incident", async () => {
  const { ops } = await buildOperations();
  const t0 = Date.now();
  for (let i = 0; i < 20; i++) ops.observeMetric(latency(100, t0 + i));
  assert.equal((await ops.evaluateAlerts(TENANT, t0 + 21)).events.length, 0); // no breach yet
  for (let i = 0; i < 20; i++) ops.observeMetric(latency(900, t0 + 100 + i));
  const fired = await ops.evaluateAlerts(TENANT, t0 + 130);
  assert.equal(fired.events[0]?.phase, "firing");
  assert.equal(fired.opened.length, 1);
  assert.equal(fired.opened[0]?.state, "open");
  // Re-evaluating while still breaching yields no duplicate edge.
  assert.equal((await ops.evaluateAlerts(TENANT, t0 + 131)).events.length, 0);
});

// ------------------------------ Operational evidence (proof plane, evolution-backed) ------------------------------

test("evidence: an attested+sealed proof persists via evolution and resolves as latest", async () => {
  const { ops, roleKeys } = await buildOperations();
  const { record, unitHash: uh } = await sealProof(ops, roleKeys, proofUnit("p1", "telemetry-snapshot", { p95: 100 }));
  const resolved = ops.queryEngine.resolveProof(TENANT, record.proofId);
  assert.equal(resolved?.unitHash, uh);
  assert.equal(resolved?.state, "sealed");
  assert.ok(ops.audit.entries().some((e) => e.event === "OPS_PROOF_SEALED" && e.subject === "p1"));
});

test("evidence: sealing to sealed requires a valid attestation and an SoD seal (fail-closed)", async () => {
  const { ops } = await buildOperations();
  const unit = proofUnit("p-nosig");
  const record = createProofRecord({ proofId: "p-nosig", version: "1.0.0", unit, trustLevel: 5, provenance: { origin: "local" }, state: "sealed" });
  await assert.rejects(() => ops.attest(record), /requires a valid proof attestation/);
});

test("evidence: attestation for a tampered unit is rejected (hash binding)", async () => {
  const { ops, roleKeys } = await buildOperations();
  const unit = proofUnit("p-tamper");
  const uh = unitHash(unit);
  const attestation = ops.attestations.issue(roleKeys.attester, { unitHash: uh, paId: "pa1" });
  const seal = ops.seals.issue(roleKeys.sealer, { unitHash: uh, paId: "psa1", attester: "alice-attester", attestationId: attestation.attestationId });
  const tampered = { ...unit, payload: { ok: false } };
  const record = createProofRecord({ proofId: "p-tamper", version: "1.0.0", unit: tampered, trustLevel: 5, provenance: { origin: "local" }, state: "sealed" });
  await assert.rejects(() => ops.attest(record, { attestation, seal }), /attestation unitHash mismatch|unitHash mismatch/);
});

// ------------------------------ Incident tracking ------------------------------

test("incident: governed lifecycle open->acknowledged->mitigated->resolved->closed, versioned + audited", async () => {
  const { ops } = await buildOperations();
  const inc = await ops.openIncident({ incidentId: "inc-1", tenantId: TENANT, title: "outage", severity: "critical", actor: "sre" });
  assert.equal(inc.state, "open");
  await ops.transitionIncident(TENANT, "inc-1", "acknowledged", "sre");
  await ops.transitionIncident(TENANT, "inc-1", "mitigated", "sre");
  await ops.transitionIncident(TENANT, "inc-1", "resolved", "sre");
  const closed = await ops.transitionIncident(TENANT, "inc-1", "closed", "sre");
  assert.equal(closed.state, "closed");
  assert.ok(closed.timeline.length >= 5);
  assert.ok(ops.audit.entries().some((e) => e.event === "OPS_INCIDENT_CLOSED"));
  const resolved = ops.queryEngine.resolveIncident(TENANT, "inc-1");
  assert.equal(resolved?.state, "closed");
});

test("incident: illegal transitions are forbidden by the lifecycle table", () => {
  assert.equal(canTransition("open", "acknowledged"), true);
  assert.equal(canTransition("resolved", "closed"), true);
  assert.equal(canTransition("closed", "open"), false);
  assert.equal(canTransition("open", "closed"), false);
});

// ------------------------------ Audit log (tamper-evident, distributed) ------------------------------

test("audit: hash chain verifies and detects tampering", async () => {
  const { ops } = await buildOperations();
  await ops.openIncident({ incidentId: "inc-a", tenantId: TENANT, title: "x", severity: "warn", actor: "sre" });
  const exported = ops.audit.export();
  assert.equal(OperationsAuditLog.verify(exported).ok, true);
  const tampered = structuredClone(exported);
  if (tampered.chain[0]) tampered.chain[0].entry.actor = "attacker";
  assert.equal(OperationsAuditLog.verify(tampered).ok, false);
});

test("audit: cross-node reconciliation flags state-hash divergence (distributed capable)", async () => {
  const a = await buildOperations();
  const b = await buildOperations();
  await a.ops.openIncident({ incidentId: "inc-x", tenantId: TENANT, title: "x", severity: "warn", actor: "sre" });
  await b.ops.openIncident({ incidentId: "inc-x", tenantId: TENANT, title: "x", severity: "warn", actor: "sre" });
  const result = OperationsAuditLog.reconcile(a.ops.audit.export(), b.ops.audit.export());
  assert.equal(result.status, "consistent"); // same subject/event with matching (empty) state cadence
  assert.equal(result.failClosed, false);
});

// ------------------------------ Multi-tenant isolation ------------------------------

test("multi-tenant: a query never crosses tenant boundaries", async () => {
  const { ops, roleKeys, substrate } = await buildOperations();
  substrate.metadata.put("operations:tenant:t2", { tenantId: "t2", displayName: "t2", status: "active", maxTrustLevel: 3, retention: { metricSamples: 100, spans: 100, logs: 100 } });
  await sealProof(ops, roleKeys, proofUnit("shared", "custom", { a: 1 }, TENANT), { proofId: "shared" });
  assert.equal(ops.queryEngine.queryProofs({ tenantId: TENANT }).length, 1);
  assert.equal(ops.queryEngine.queryProofs({ tenantId: "t2" }).length, 0);
});

test("revocation: a revoked proof is excluded from resolution (fail-closed)", async () => {
  const { ops, roleKeys } = await buildOperations();
  await sealProof(ops, roleKeys, proofUnit("p-rev"), { proofId: "p-rev" });
  assert.ok(ops.queryEngine.resolveProof(TENANT, "p-rev"));
  ops.revoke("proof", "p-rev", "auditor", TENANT);
  assert.equal(ops.queryEngine.resolveProof(TENANT, "p-rev"), undefined);
});
