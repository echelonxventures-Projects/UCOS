# B02 — Operational Proof Fabric — Implementation Package

**Program:** Implementation Program B02 (Operational Proof Fabric)
**Status:** Implemented and verified (runtime + acceptance tests green; service delivery scaffolded)
**Fabric position:** Additive control fabric over the ratified substrate (PI-2/PI-3) + control (PI-4) +
federation (PI-5) + evolution (PI-6). No substrate core dir modified; no evolution/federation behavior
changed (reuse only); no custom cryptography.

---

## 0. Objective & requirements coverage

| Objective area | Where implemented (code) | How |
| --- | --- | --- |
| Monitoring | `telemetry-ingest.ts`, `metric-store.ts` | Deny-by-default admission of metric points into bounded per-tenant ring buffers. |
| Telemetry | `telemetry-ingest.ts` | Metrics + trace spans + log events; bounded, backpressure via eviction. |
| Observability | `observability-engine.ts` | Metric aggregation windows, trace tree reconstruction, error rate, tenant observation snapshot. |
| Audit logs | `operations-audit-log.ts` | Hash-chained, tamper-evident, append-only, offline-verifiable, cross-node reconcilable. |
| Incident tracking | `incident-lifecycle.ts`, `incident-state-machine.ts`, `incident-tracker.ts` | Guarded lifecycle; versioned append-only records; each transition persisted + audited. |
| Health monitoring | `health-monitor.ts` | Registry-defined checks → per-component + rollup health; fail-closed to `unknown`. |
| Operational evidence | `proof-unit.ts`, `proof-record.ts`, `proof-authority.ts`, `operations-control.ts` | Signed (attest + SoD seal), versioned, hash-bound proof persisted via Evolution Fabric. |

| Requirement | How satisfied |
| --- | --- |
| **Registry-driven** | Tenants, metric defs, health checks, SLOs, alert rules, and proof authorities are runtime data in the Metadata runtime (`OperationsRegistry`). Zero hardcoded thresholds/tenants/authorities. |
| **Distributed-capable** | Per-node hash-chained audit; `OperationsAuditLog.verify`/`reconcile`; signed cross-node proof bundles via `OperationsFederationGuard`; partition ⇒ fail-closed. |
| **Multi-tenant** | Tenant-partitioned keyspace; deny-by-default admission; per-tenant trust clamps; queries never cross tenant boundaries. |
| **Real-time** | Bounded in-memory ring buffers with O(1) eviction; streaming aggregation; no per-signal governed mutation. |

---

## 1. Architecture

### 1.1 Two-plane design

```
                         ┌───────────────────────────── REAL-TIME PLANE (ephemeral, bounded) ─────────────────────────────┐
  emitters ──metrics──▶  TelemetryIngest ──▶ MetricStore(ring)  ──▶ ObservabilityEngine ─┐
           ──spans────▶      (deny-by-default,                       HealthMonitor        │ evaluate
           ──logs─────▶       bounded retention)                     SloEvaluator         │  ▼
                                                                     AlertEngine ─────────┴─▶ AlertEvent (edge) ──autoIncident──┐
                         └────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                                                                                 │
                         ┌───────────────────────────── PROOF PLANE (durable, governed) ─────────────────────────────────┐    │
  attest(record) ──▶ OperationsControl ──gate: attestation + SoD seal──▶ #persistViaEvolution ──▶ Evolution Fabric ──▶ Metadata SoR
  openIncident   ──▶      │                                                (snapshot → atomic apply → audited → rollback)         │
  transition     ──▶      │                                                                                                       │
  importBundle   ──▶ OperationsFederationGuard (verify + sovereignty + trust-clamp)                                               ◀┘
                         └──────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                    every governed event ─▶ OperationsAuditLog (hash chain) ─▶ event bus (OPS_*)
```

- **Real-time plane** is ephemeral by design: raw signals are never stored raw and never grow without
  bound. It answers "what is happening now" and feeds evaluation engines.
- **Proof plane** is the *proof*: it answers "prove operations were observed, evaluated, and handled"
  with signed, versioned, hash-chained records that are independently verifiable and reconcilable.
- The **only** durable mutation path is `OperationsControl.#persistViaEvolution`, which routes a
  `put-metadata` op through the ratified Evolution Fabric (`evolvableAllowlist: ["operations:"]`).
  There is **no** direct store write and **no** governor bypass.

### 1.2 Invariants (enforced, not aspirational)

- **Deny-by-default**: unknown/suspended tenant, unregistered metric, missing/invalid signature,
  out-of-boundary issuer, or partition ⇒ deny/drop.
- **Fail-closed**: health with no fresh sample ⇒ `unknown` (never silently healthy); revoked entity ⇒
  excluded from resolution; evolution rollback on any post-apply failure.
- **Separation of duties**: `sealed` proof requires attester ≠ sealer (`ProofSealAuthority.verify`).
- **Tamper-evident**: `unitHash = sha256(canonical(unit))` binds attestation/seal/bundle; audit
  `entryHash` chains every event.
- **No custom crypto**: Ed25519 sign/verify + canonicalization reused from the Federation Fabric.

### 1.3 Component map

| Concern | Modules |
| --- | --- |
| Addressing | `operations-namespace.ts` (reserved `operations:` root, tenant-partitioned keys) |
| Registry (config-driven) | `operations-registry.ts` |
| Real-time | `metric-store.ts`, `telemetry-ingest.ts`, `observability-engine.ts` |
| Evaluation | `health-monitor.ts`, `slo-evaluator.ts`, `alert-engine.ts` |
| Incidents | `incident-lifecycle.ts`, `incident-state-machine.ts`, `incident-tracker.ts` |
| Evidence | `proof-unit.ts`, `proof-record.ts`, `proof-authority.ts` |
| Durable store/query | `operations-store.ts`, `operations-query-engine.ts`, `operations-snapshot.ts` |
| Security/audit/dist. | `operations-revocation-authority.ts`, `operations-audit-log.ts`, `operations-federation-guard.ts` |
| Assembly | `operations-control.ts`, `index.ts` |

---

## 2. Services

Deployable surface: `services/platform/operational-proof/` (contract `UCOS-API-CONTRACT-OPF`).

| Service capability | Runtime entry point | Notes |
| --- | --- | --- |
| Telemetry ingest | `OperationsControl.observeMetric/observeSpan/observeLog` | Bounded, deny-by-default. |
| Observability query | `ObservabilityEngine.aggregateWindow/traceTree/snapshot` | Read-only, tenant-scoped. |
| Health | `OperationsControl.evaluateHealth` | Rollup + audit event. |
| SLO | `OperationsControl.evaluateSlos` | Compliance + error budget; audits breach. |
| Alerting | `OperationsControl.evaluateAlerts` | Edge detection; auto-incident. |
| Evidence attest/seal | `OperationsControl.attest` | Governed; evolution-persisted. |
| Incidents | `OperationsControl.openIncident/transitionIncident` | Governed; evolution-persisted. |
| Federation exchange | `OperationsControl.importBundle` | Verify + sovereignty + trust-clamp. |
| Audit | `OperationsAuditLog.export/verify/reconcile` | Distributed proof. |

Deployment: 3+ replicas (AC-1), each a distinct audit-chain node (`UCOS_NODE_ID` = pod name),
non-root/read-only rootfs/drop-ALL-caps, mTLS workload identity, deny-by-default mesh, HPA on CPU.
Secrets (DB DSN, audit signing key) by reference only (S3). See `deploy/deployment.yaml`.

---

## 3. Events

Contract `UCOS-EVT-CONTRACT-OPF` (`events/opf-events.yaml`), CloudEvents 1.0 envelope. Every governed
event is both appended to the hash-chained audit log and published for real-time consumers. Extensions
carry `tenantid`, `seq`, `entryhash` for isolation + tamper-evident correlation; per-node `seq` is
strictly monotonic.

`OPS_PROOF_ATTESTED` · `OPS_PROOF_SEALED` · `OPS_PROOF_EXCHANGED` · `OPS_INCIDENT_OPENED` ·
`OPS_INCIDENT_TRANSITIONED` · `OPS_INCIDENT_CLOSED` · `OPS_ALERT_FIRED` · `OPS_ALERT_RESOLVED` ·
`OPS_HEALTH_CHANGED` · `OPS_SLO_BREACH` · `OPS_RECONCILED` · `OPS_REVOKED`.

---

## 4. APIs

OpenAPI 3.1 realization: `services/platform/operational-proof/api/opf-api.yaml`. Every route is
tenant-scoped via `X-UCOS-Tenant` + mTLS; deny-by-default ⇒ `403`.

- **Telemetry**: `POST /telemetry/{metrics,spans,logs}`
- **Observability**: `GET /observability/metrics/{metric}/aggregate`, `GET /observability/health`,
  `GET /observability/slos`, `POST /observability/alerts/evaluate`
- **Proof**: `POST /proof` (attest/seal), `GET /proof`, `POST /proof/import`
- **Incidents**: `POST /incidents`, `GET /incidents`, `POST /incidents/{id}/transition` (`409` on
  illegal transition)
- **Audit**: `GET /audit/export`, `POST /audit/reconcile`

---

## 5. Storage

**Runtime (in-memory, real-time plane):** bounded per-`(tenant, metric)` ring buffers; per-tenant span
and log rings. Capacities from the tenant `retention` policy. O(1) append + eviction.

**System of Record (durable proof plane):** PostgreSQL schema `dom_ops`
(`migrations/V001__operational_proof_sor.sql`), forward-only, append-only:
`tenant`, `definition`, `proof_record`, `incident_record`, `audit_entry`, `revocation`. Raw telemetry
is intentionally **not** persisted (kept bounded + tamper-evident). Every durable row is tenant-scoped;
authority keys and DB credentials are references only (S3); at-rest encryption + TLS 1.3 (S4).

Metadata-runtime keying (in the platform-runtime substrate) under the reserved `operations:` root:
`operations:tenant:*`, `operations:metric-def:*`, `operations:health-check:*`, `operations:slo:*`,
`operations:alert-rule:*`, `operations:authority:*`, `operations:pa:*`, `operations:psa:*`,
`operations:proof:<tenant>:<id>@<version>`, `operations:incident:<tenant>:<id>@<version>`,
`operations:revoked:<kind>:<id>`.

---

## 6. Runtime

- Package: `@ucos/platform-runtime`; fabric at `src/control/operations/`; public surface exported as
  `operations` from `src/control/index.ts` (namespaced to avoid barrel collisions).
- Assembly: `createOperations(substrate, { nodeId, keys?, nonces?, partition? })`.
- Node ≥ 23.6 (native `.ts` type-stripping); strict TS (`verbatimModuleSyntax`, `erasableSyntaxOnly`,
  `noUncheckedIndexedAccess`).
- Durable persistence composes the Evolution Fabric with system SoD principals sharing one Ed25519 key;
  snapshot → atomic apply → audited → rollback-capable.

Minimal usage:

```ts
import { createSubstrate } from "@ucos/platform-runtime/bootstrap";
import { operations } from "@ucos/platform-runtime";

const substrate = createSubstrate();
await substrate.kernel.compose();
const ops = operations.createOperations(substrate, { nodeId: "node-1" });

ops.registry.registerTenant({ tenantId: "t1", displayName: "T1", maxTrustLevel: 7,
  retention: { metricSamples: 1000, spans: 500, logs: 500 } });
ops.registry.registerMetric({ metricId: "http.latency.ms", kind: "gauge", unit: "ms", tenantScope: "*" });

ops.observeMetric({ tenantId: "t1", metric: "http.latency.ms", value: 120, at: Date.now() });
const health = ops.evaluateHealth("t1");
```

---

## 7. Acceptance tests

`packages/platform-runtime/test/operations.test.ts` (+ `operations-harness.ts`). Run:
`npm test` (node --test). **Status: 15/15 pass; full suite 284/284 pass; typecheck clean.**

| # | Acceptance criterion | Test |
| --- | --- | --- |
| AC-1 | Deny-by-default ingest (unknown tenant / unregistered metric dropped) | telemetry deny-by-default |
| AC-2 | Bounded ring buffer (backpressure via eviction) | ring buffer bounded |
| AC-3 | Percentile aggregation + tenant-scoped snapshot | observability |
| AC-4 | Health fail-closed `unknown`; healthy/unhealthy by bounds | health |
| AC-5 | SLO compliance + breach audited | slo |
| AC-6 | Alert fires on edge once; auto-opens governed incident; no dup edge | alert |
| AC-7 | Attested+sealed proof persists via evolution; resolves as latest | evidence persist |
| AC-8 | `sealed` requires valid attestation + SoD seal (fail-closed) | evidence fail-closed |
| AC-9 | Tampered unit rejected (hash binding) | evidence tamper |
| AC-10 | Incident lifecycle open→…→closed, versioned + audited | incident lifecycle |
| AC-11 | Illegal incident transitions forbidden | incident table |
| AC-12 | Audit hash chain verifies; tamper detected | audit verify |
| AC-13 | Cross-node reconciliation (distributed) | audit reconcile |
| AC-14 | Multi-tenant query isolation | multi-tenant |
| AC-15 | Revoked proof excluded (fail-closed) | revocation |

---

## 8. Implementation backlog

**Delivered (this package):**
- [x] OPF-1 Fabric core: namespace, registry, types
- [x] OPF-2 Real-time plane: ingest, metric store, observability
- [x] OPF-3 Evaluation: health, SLO, alerting (edge + auto-incident)
- [x] OPF-4 Incident tracking: lifecycle, state machine, versioned records
- [x] OPF-5 Operational evidence: signed attest + SoD seal, evolution-backed persistence
- [x] OPF-6 Audit: hash chain, offline verify, cross-node reconcile
- [x] OPF-7 Distributed: signed proof bundles, sovereignty, trust-clamp, partition fail-closed
- [x] OPF-8 Multi-tenant isolation + revocation fail-closed
- [x] OPF-9 Service delivery scaffold: schema, SoR migration, events, OpenAPI, deploy
- [x] OPF-10 Acceptance tests (15) + full-suite regression green

**Next (service hardening — beyond fabric ratification):**
- [ ] OPF-D1 Wire the deployable service to the SoR (`dom_ops`) via a durable MetadataPort adapter
      (the runtime uses the in-memory store; the port seam is unchanged).
- [ ] OPF-D2 Persist/replay the audit chain to `dom_ops.audit_entry` with an insert-only DB role.
- [ ] OPF-D3 Event-bus publisher for `OPS_*` (CloudEvents) with at-least-once + idempotency keys.
- [ ] OPF-D4 Rate limiting / quota per tenant on ingest endpoints (protect the real-time plane).
- [ ] OPF-D5 Continuous attestation scheduler (periodic telemetry/health/SLO snapshot → sealed proof).
- [ ] OPF-D6 Federation transport for proof-bundle exchange + scheduled reconciliation jobs.
- [ ] OPF-D7 Retention/rollup policies for SoR proof volume (append-only compaction by supersession).

---

## 9. Traceability

- **Program:** B02 (Operational Proof Fabric).
- **Architecture ids:** OPF-ARCH-001/002/003/004, OPF-RT-001..006, OPF-INC-001..003, OPF-SEC-001..003,
  OPF-AUD-001, OPF-GOV-001/002, OPF-FED-001 (referenced in module headers).
- **Reused ratified fabrics:** substrate (AD-0016), control (AD-0017), federation (AD-0018), evolution
  (AD-0019). Crypto: Federation `assertions.ts` (Ed25519). Persistence: Evolution apply orchestrator.
- **Contracts:** `UCOS-API-CONTRACT-OPF`, `UCOS-EVT-CONTRACT-OPF`, `UCOS-DATA-CONTRACT-OPF`; SoR per
  ADR-005; deployment baseline per ADR-001/006.
- **Additivity guarantee:** no substrate core dir modified; evolution/federation behavior unchanged
  (reuse only); operations namespace is the sole evolvable target added to the allowlist.
