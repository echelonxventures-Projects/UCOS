/**
 * Shared test harness for the B02 Operational Proof Fabric suites. Not a test file (no ".test.ts").
 * Builds a composed substrate + wired Operational Proof Fabric with a registered tenant, registry
 * definitions (metric/health/SLO/alert), and distinct attester/sealer keys (separation of duties).
 */

import type { KeyObject } from "node:crypto";
import { createSubstrate } from "../src/bootstrap.ts";
import type { CapabilityInstance, Descriptor } from "../src/contracts/types.ts";
import { generateKeyPair } from "../src/control/federation/assertions.ts";
import { createOperations } from "../src/control/operations/operations-control.ts";
import { createProofRecord } from "../src/control/operations/proof-record.ts";
import { createUnit, unitHash } from "../src/control/operations/proof-unit.ts";
import type { ProofKind, ProofRecord, ProofUnit } from "../src/control/operations/types.ts";

const textContract: Descriptor = {
  kind: "contract",
  id: "contract.text-producer",
  version: "1.0.0",
  operations: [{ name: "produce", input: { type: "object" }, output: { type: "string" } }],
};
const shoutCapability: Descriptor = {
  kind: "capability",
  id: "cap.shout",
  version: "1.0.0",
  name: "Shout",
  contract: { id: "contract.text-producer", versionRange: "^1.0.0" },
  provider: { module: "plugin:shout", export: "create" },
};

export interface ProofRoleKeys {
  attester: KeyObject;
  sealer: KeyObject;
}

export const TENANT = "t1";

export async function buildOperations() {
  const substrate = createSubstrate();
  substrate.kernel.registerProvider("shout", (): CapabilityInstance => ({ operations: { produce: () => "OK" } }));
  substrate.kernel.loadDescriptors([textContract, shoutCapability]);
  await substrate.kernel.compose();

  const ops = createOperations(substrate, { nodeId: "node-ops" });

  // Tenant (multi-tenant; bounded real-time retention).
  ops.registry.registerTenant({ tenantId: TENANT, displayName: "Tenant One", maxTrustLevel: 7, retention: { metricSamples: 1000, spans: 500, logs: 500 } });

  // Registry-driven definitions.
  ops.registry.registerMetric({ metricId: "http.latency.ms", kind: "gauge", unit: "ms", tenantScope: "*" });
  ops.registry.registerMetric({ metricId: "http.error", kind: "counter", unit: "count", tenantScope: TENANT });
  ops.registry.registerHealthCheck({ checkId: "latency-ok", component: "api", tenantScope: "*", metric: "http.latency.ms", aggregate: "p95", windowMs: 60_000, max: 250, ttlMs: 60_000, severityOnFail: "unhealthy" });
  ops.registry.registerSlo({ sloId: "latency-slo", tenantScope: "*", metric: "http.latency.ms", aggregate: "p95", comparison: "lte", objective: 250, windowMs: 60_000, budget: 0.1 });
  ops.registry.registerAlertRule({ ruleId: "latency-high", tenantScope: "*", metric: "http.latency.ms", aggregate: "p95", comparison: "gt", threshold: 250, windowMs: 60_000, severity: "critical", autoIncident: true });

  // Distinct role keys (SoD): attester + sealer.
  const attKeys = generateKeyPair();
  const sealKeys = generateKeyPair();
  ops.keys.register("ops-att-key", attKeys.publicKeyPem);
  ops.keys.register("ops-seal-key", sealKeys.publicKeyPem);
  ops.attestations.register({ paId: "pa1", owner: "alice-attester", keyRef: "ops-att-key" });
  ops.seals.register({ paId: "psa1", owner: "sam-sealer", keyRef: "ops-seal-key" });
  // Register the attester as a scoped proof authority (attest power) for federation-issuer checks.
  ops.registry.registerAuthority({ authorityId: "alice-attester", owner: "alice-attester", powers: ["attest", "seal"], keyRef: "ops-att-key", tenantScope: "*" });

  return { substrate, ops, roleKeys: { attester: attKeys.privateKey, sealer: sealKeys.privateKey } as ProofRoleKeys };
}

export function proofUnit(id: string, kind: ProofKind = "telemetry-snapshot", payload: unknown = { ok: true }, tenantId = TENANT): ProofUnit {
  return createUnit({ unitId: id, tenantId, kind, namespace: `operations:proof:${tenantId}`, payload, capturedAt: Date.now() });
}

/** Full attest->seal of a sealed proof record. Returns the record + unitHash. */
export async function sealProof(
  ops: Awaited<ReturnType<typeof buildOperations>>["ops"],
  keys: ProofRoleKeys,
  unit: ProofUnit,
  opts: { proofId?: string; version?: string; trustLevel?: number } = {},
): Promise<{ record: ProofRecord; unitHash: string }> {
  const uh = unitHash(unit);
  const attestation = ops.attestations.issue(keys.attester, { unitHash: uh, paId: "pa1" });
  const seal = ops.seals.issue(keys.sealer, { unitHash: uh, paId: "psa1", attester: "alice-attester", attestationId: attestation.attestationId });
  const record = createProofRecord({
    proofId: opts.proofId ?? unit.unitId,
    version: opts.version ?? "1.0.0",
    unit,
    trustLevel: opts.trustLevel ?? 5,
    provenance: { origin: "local" },
    state: "sealed",
  });
  await ops.attest(record, { attestation, seal });
  return { record, unitHash: uh };
}
