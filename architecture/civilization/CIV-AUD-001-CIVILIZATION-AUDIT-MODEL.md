# CIV-AUD-001 — UCOS Civilization Audit Model Specification

| Field | Value |
|-------|-------|
| Artifact | **CIV-AUD-001 — Civilization Audit Model** |
| Program | PHASE Ω-01 · Civilization Fabric Conceptual Architecture Program |
| Version | 1.0.0 |
| Status | **DESIGN / PROPOSAL — READY FOR RATIFICATION REVIEW** (specification only; no implementation) |
| Basis | `CIV-GOV-001`, `CIV-ARCH-001`, `CIV-SEC-001`, `CIV-FED-001`; PI-5 `FederatedAuditLog` (hash-chain, SHA-256); `SIM-AUD-001`; AUTH-008 (S6); `UCOS-SEC-ARCH-001` (AUD-1..7) |
| Prohibited-dir impact | **NONE** — reuses the federation audit-chain behind the existing `AuditSink` seam |
| Owner | UCOS Authority Board (Architecture) |

> **Governing disclaimer:** design/proposal only. Preserves AD-0014; enrolls no INV-14..20; releases no Article
> IX lock; authorizes no implementation/construction. **The Civilization Fabric remains conceptual and deferred
> under AD-0014.**

---

## 1. Audit record model

Every civilization modeling act — model definition/composition, population/institution/culture/economy binding,
rights/obligations model change, knowledge reference, simulation run open/step/abort, projection/impact
emission, preservation/continuity snapshot, promotion, revocation, and federated contribution — is recorded on
an **append-only, hash-chained, tamper-evident** audit trail reusing PI-5 `FederatedAuditLog` (no new crypto).

Each entry (`ChainedEntry` wrapping the base `AuditEntry`):
`{ seq, prevHash, hash, at, actor(principalRef+nodeId), kind, subjectRef, decision, rationaleRef?, baselineRef?,
scenarioId?, modelId?, seed?, constraintSetId?, policyResult?, classification, signature }`.

- **Hash chain:** `hash = SHA-256(prevHash ‖ canonical(entry))`; tampering breaks the chain (detectable on verify).
- **Signed checkpoints:** periodic signed `{ seq, hash, at }` anchor the chain.
- **Append-only:** no update/delete; corrections are new forward entries (IP-14).

## 2. Mandatory audited events

| Event | Emitting construct | Required fields |
|-------|--------------------|-----------------|
| Civilization define/compose/archive | CIV-C1 | civId, class, versionRef, signature |
| Institution/Population/Culture/Economy bind | CIV-C2/C3/C4/C10 | civId, componentRef, classification |
| Rights/Obligations model change | CIV-C11/C12 | civId, constraintSetId, changeRef |
| Knowledge reference (read-only) | CIV-C7 | civId, knowledgeRef, classification |
| Simulation run open/step/complete/abort | SIM C7 | runId, sandboxScopeId, budgets, seed, baselineRef |
| Projection emit + constraint result | CIV/SIM C8 | projectionId, method, modelId?, rationaleRef, classification |
| Impact analysis + recommendation | CIV/SIM C9 | impactId, deltas summary, recommendation, rationaleRef |
| Preservation / continuity snapshot | dynamics | snapshotRef, contentHash, signature |
| Promotion (proposal→Evolution) | pipeline | proposalRef, policyResult, certifiedBy, ratifiedBy[] |
| Revocation | CIV revocation | target ref, revocableKind, propagation result |
| Federated contribution | CIV-FED | fedAuthorityId, nodeId, verify result, clamped trust |

## 3. Historical integrity & anti-revision (threat C4)

- **Preservation/continuity records are append-only and hash-anchored.** A civilization-model history can never
  be edited in place; a "revision" is a new forward, signed, audited version referencing the prior content hash.
- **Reproducibility tuple** `(inputs hash, baselineRef, scenarioId, modelId+seed, constraintSetId, policySetRef)`
  is recorded for every Projection/Impact; a deterministic projection is re-derivable, and an entry lacking a
  resolvable rationale is **rejected** (explainability; SGP-6 analog).
- **Historical revision abuse** (silently rewriting a civilization's modeled past) is structurally impossible:
  detection is guaranteed by the broken hash chain on any in-place mutation.

## 4. Cross-node reconciliation (federated)

- Nodes exchange **signed checkpoints** and reconcile chains by `assertionRef`.
- Divergence handling is **fail-closed**: an effect-mismatch or hash-break is flagged, quarantined (advisory), and
  **never** auto-resolved into a local commit; resolution is a governed forward act.
- Offline **export + independent verify** is supported (portable chain + checkpoints + public keys).

## 5. S6 / classification conformance

- Audit is immutable and tamper-evident (S6); entries carry classification and honor S4 on read (sensitive
  payloads referenced by `*Ref`, never inlined in clear where classification forbids).
- Secrets/keys/model-weights are **never** written to the audit (S3) — references only.
- Population records referenced in audit remain aggregate-only (no PII; CIV-SEC-001 §4).

## 6. Traceability
- **Refines:** `CIV-GOV-001`, `CIV-SEC-001`, `CIV-FED-001`, `SIM-AUD-001`, `FED-AUD-001`, AUTH-008 (S6),
  `UCOS-SEC-ARCH-001` (AUD-1..7).
- **Consumed by:** `CIV-THREAT-001`, `CIV-READINESS-001`.
- **Owner:** UCOS Authority Board.

**END CIV-AUD-001 — DESIGN/PROPOSAL · TAMPER-EVIDENT · ANTI-REVISION · AD-0014 PRESERVED · NO IMPLEMENTATION AUTHORIZED.**
