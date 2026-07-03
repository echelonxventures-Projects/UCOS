# INT-AUD-001 — UCOS Intelligence Audit & Explainability Specification

| Field | Value |
|-------|-------|
| Artifact | **INT-AUD-001 — Intelligence Audit & Explainability Specification** |
| Workstream | FND-INT-01 (PHASE 19 · PI-10 Intelligence Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, or services |
| Basis | `INT-GOV-001/002`, `INT-ARCH-001`, `INT-SEC-001`, `INT-FED-001`; `AD-0018` `FederatedAuditLog` (hash-chain); `UCOS-SEC-ARCH-001` (S6 immutable audit) |
| Realizes | Immutable cognition audit + **mandatory explainability** (evidence→inference→decision) + reproducibility + reconciliation |
| Prohibited-dir impact | **NONE** — reuses the ratified hash-chained audit pattern behind the existing `AuditSink` seam |

> Every act of governed cognition is auditable and every committed decision is **explainable**. An un-explainable
> output is a rejected output (IGP-6). Audit is hash-chained, tamper-evident, reproducible-by-record, and
> cross-node reconcilable, reusing the proven Federation audit chain — **no custom crypto, no core-dir change**.

---

## 1. Principles

- **IAP-1 No Unexplained Decision.** A decision cannot reach `committed` without a resolvable rationale chain.
- **IAP-2 Tamper-Evidence.** Audit entries are hash-chained (SHA-256 over the prior entry) and signature-checked
  at checkpoints (reuse `FederatedAuditLog`); any break is a detectable integrity event.
- **IAP-3 Reproducibility-by-Record.** Every decision records enough to deterministically re-derive it.
- **IAP-4 Append-Only / Migration-Only.** Audit is never rewritten; corrections are forward entries (IP-14).
- **IAP-5 Classification-Inheriting.** Audit/rationale records inherit `max(input classification)` (S4).
- **IAP-6 Fail-Closed.** Unwritable/unverifiable audit ⇒ the cognition act is denied (no silent proceed).

## 2. Audited Event Types (`INT_*`)

| Event | Emitted when | Key fields (provenance-in-data) |
|-------|--------------|---------------------------------|
| `INT_SESSION_OPEN` | Reasoning Session opens | sessionId, authorityId, goalId, budgets, knowledgeSnapshotRef, seed |
| `INT_KNOWLEDGE_READ` | Knowledge/memory read for evidence | sessionId, queryRef, resultRefs[], classification |
| `INT_INFERENCE` | Inference step (det or adapter) | sessionId, modelId, kind, inputsHash, outputRef, `advisory?` |
| `INT_ADAPTER_INVOKE` | Non-deterministic adapter call | sessionId, modelRef, seed, inputsHash, outputClassification |
| `INT_VERIFIER_ATTEST` | Deterministic verifier confirms/rejects adapter output | sessionId, adapterOutputRef, verdict |
| `INT_PLAN` | Plan produced | sessionId, planRef, constraintSetId, feasibility |
| `INT_PROPOSAL` | Proposal + rationale assembled | sessionId, proposalRef, rationaleRef |
| `INT_POLICY_EVAL` | PI-4 policy evaluation of proposal | proposalRef, verdict, denyReasons[] |
| `INT_CONSTRAINT_CHECK` | Hard/soft constraint check | proposalRef, hardPass, softScore |
| `INT_DECISION_CERTIFY` | Decision certified (SoD) | decisionId, certifier, proposer, `certifier≠proposer` |
| `INT_DECISION_RATIFY` | Decision ratified (quorum) | decisionId, ratifiers[], quorumMet |
| `INT_DECISION_COMMIT` | Committed via Evolution Fabric | decisionId, evolutionUnitRef, appliedAt |
| `INT_SESSION_ABORT` | Budget/fault abort (fail-closed) | sessionId, reason |
| `INT_REVOKE` | Goal/model/authority/decision revoked | targetRef, revAuthorityId, reason |
| `INT_FED_CONTRIBUTION` | Foreign advisory contribution ingested | contributionRef, nodeId, clampedTrust, `advisory` |

All entries are chained (`prevHash → entryHash`) and carry `sessionId`/`decisionId` correlation.

## 3. Explainability Model — the Rationale Chain

A **rationale** is a signed, structured object binding a decision back to its evidence:

```
Decision(decisionId)
  └─ Rationale(rationaleRef)
       ├─ evidence[]      → INT_KNOWLEDGE_READ result refs (+ classification)
       ├─ inferences[]    → INT_INFERENCE / INT_ADAPTER_INVOKE + INT_VERIFIER_ATTEST refs
       ├─ constraints[]   → hard/soft outcomes (INT_CONSTRAINT_CHECK)
       ├─ policy          → INT_POLICY_EVAL verdict
       └─ conclusion      → the proposed action + why (human-readable + machine-checkable)
```

- **Completeness rule.** Every `conclusion` element must trace to ≥1 `evidence` or `inference` node; a dangling
  conclusion fails IAP-1 and the decision is rejected.
- **Adapter transparency.** Any non-deterministic contribution appears as an `inference` node tagged `advisory`
  with its verifier attestation; a decision resting on an *unverified* adapter output is not commit-eligible.

## 4. Reproducibility Record

Per committed decision: `{ decisionId, inputsHash, knowledgeSnapshotRef, modelId+seed[], constraintSetId,
policySetRef, rationaleRef, resultHash }`. A re-run over the same snapshot/seed must yield the same
`resultHash`; divergence is an integrity event (surfaces I3 non-deterministic drift).

## 5. Cross-Node Reconciliation (federated)

- Reuses `FederatedAuditLog` reconciliation: nodes exchange signed checkpoints; mismatched effect or broken
  hash ⇒ **fail-closed divergence** adjudicated by the federation Audit Authority (FED-AUD-001).
- Foreign contributions (`INT_FED_CONTRIBUTION`) are reconcilable to their originating node's audit but bind
  locally only after local ratification (INT-FED-001 §2.2).

## 6. Export / Offline Verification
- Audit segments export as signed, self-verifying bundles; an offline verifier recomputes the hash chain and
  checks checkpoint signatures without live system access.

## 7. Threat Coverage
Primary closure of **I10** (audit/explainability gap); supports **I3** (drift detection), **I8** (forgery/replay
detection), **I2** (evidence provenance), **I9** (federated reconciliation). See `INT-THREAT-001`.

## 8. Traceability
- **Refines:** `INT-GOV-001/002`, `INT-ARCH-001`, `INT-SEC-001`, `INT-FED-001`, `AD-0018` (`FED-AUD-001`),
  `UCOS-SEC-ARCH-001` (S6), AUTH-008/010/012, Constitution Art. X.
- **Consumed by:** `INT-THREAT-001`, `INT-READINESS-001`, future PI-10 act.
- **Owner:** UCOS Authority Board.

**END INT-AUD-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
