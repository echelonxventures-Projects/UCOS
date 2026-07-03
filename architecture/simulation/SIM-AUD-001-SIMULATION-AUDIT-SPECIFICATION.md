# SIM-AUD-001 — UCOS Simulation Audit Specification

| Field | Value |
|-------|-------|
| Artifact | **SIM-AUD-001 — Simulation Audit Specification** |
| Workstream | FND-SIM-01 (PHASE 20 · PI-11 Simulation Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | `SIM-GOV-001/002`, `SIM-ARCH-001`, `SIM-SEC-001`, `SIM-FED-001`; PI-5 `FederatedAuditLog` (hash-chain, SHA-256); AUTH-008 (S6), `UCOS-SEC-ARCH-001` (AUD-1..7) |
| Realizes | Tamper-evident, reproducible, reconcilable simulation audit trail |
| Prohibited-dir impact | **NONE** — reuses the federation audit-chain behind the existing `AuditSink` seam |

> Every simulation act — twin binding, scenario authorization, run open/step/abort, projection emission, impact
> analysis, promotion, revocation, and federated contribution — is recorded on an **append-only, hash-chained,
> tamper-evident** audit trail. The audit is the backbone of explainability (SGP-6), reproducibility (SGP-3),
> and non-repudiation. It reuses the ratified PI-5 `FederatedAuditLog` (no new crypto, no core-dir change).

---

## 1. Audit record model

Each entry (`ChainedEntry` wrapping the base `AuditEntry`) records:
`{ seq, prevHash, hash, at, actor(principalRef+nodeId), kind, subjectRef, decision, rationaleRef?, snapshotRef?, modelId?, seed?, constraintSetId?, policyResult?, signature }`.

- **Hash chain:** `hash = SHA-256(prevHash ‖ canonical(entry))`; any tampering breaks the chain (detectable on verify).
- **Signed checkpoints:** periodic signed `{ seq, hash, at }` checkpoints anchor the chain for efficient verification.
- **Append-only:** no update/delete; corrections are new forward entries (IP-14).

## 2. Mandatory audited events

| Event | Emitting construct | Required fields |
|-------|--------------------|-----------------|
| Twin bind/refresh/stale/retire | C2 | twinId, snapshotRef, signature |
| Scenario authorize/suspend/expire | C3/C4 | scenarioId, authorizedBy, caps |
| Run open/step/complete/abort | C7 | runId, sandboxScopeId, budgets, seed, snapshotRef |
| Projection emit + constraint result | C8 | projectionId, method, modelId?, rationaleRef, classification |
| Impact analysis + recommendation | C9 | impactId, deltas summary, recommendation, rationaleRef |
| Promotion (proposal→Evolution) | pipeline | proposalRef, policyResult, certifiedBy, ratifiedBy[] |
| Revocation | C10 | target ref, revocableKind, propagation result |
| Federated contribution | C11 | fedSimAuthorityId, nodeId, verify result, clamped trust |
| Sandbox allocate/teardown | C12 | sandboxScopeId, runId, retention |

## 3. Reproducibility provenance

- Every Projection/Impact entry records the full reproducibility tuple
  `(inputs hash, snapshotRef, scenarioId, modelId+seed, constraintSetId, policySetRef)`.
- A deterministic projection is re-derivable from the recorded tuple; a model-assisted projection additionally
  records the verifier attestation. An entry lacking a resolvable rationale is **rejected** (SGP-6).

## 4. Cross-node reconciliation (federated)

- Nodes exchange **signed checkpoints** and reconcile chains by `assertionRef`.
- Divergence handling is **fail-closed**: an effect-mismatch or hash-break between nodes is flagged, quarantined
  (advisory), and **never** auto-resolved into a local commit; resolution is a governed forward act.
- Offline **export + independent verify** is supported (portable chain + checkpoints + public keys).

## 5. S6 / classification conformance

- Audit is immutable and tamper-evident (S6); audit entries carry classification and honor S4 on read
  (sensitive payloads referenced by `*Ref`, never inlined in clear where classification forbids).
- Secrets/keys/model-weights are **never** written to the audit (S3) — references only.

## 6. Traceability
- **Refines:** `SIM-GOV-001/002`, `SIM-SEC-001`, `SIM-FED-001`, `FED-AUD-001`, AUTH-008 (S6),
  `UCOS-SEC-ARCH-001` (AUD-1..7).
- **Consumed by:** `SIM-THREAT-001`, `SIM-READINESS-001`, and a future PI-11 implementation act.
- **Owner:** UCOS Authority Board.

**END SIM-AUD-001 — DESIGN · READY FOR RATIFICATION · TAMPER-EVIDENT · NO IMPLEMENTATION AUTHORIZED.**
