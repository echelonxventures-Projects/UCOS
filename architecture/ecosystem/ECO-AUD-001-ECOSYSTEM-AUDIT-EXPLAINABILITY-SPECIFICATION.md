# ECO-AUD-001 — UCOS Ecosystem Audit & Explainability Specification

| Field | Value |
|-------|-------|
| Artifact | **ECO-AUD-001 — Ecosystem Audit & Explainability Specification** |
| Workstream | FND-ECO-01 (PHASE 27 · PI-16 Ecosystem Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, or services |
| Basis | `ECO-GOV-001`, `ECO-ARCH-001`, `ECO-SEC-001`, `ECO-FED-001`; `AD-0018` `FederatedAuditLog` (hash-chain); `UCOS-SEC-ARCH-001` (S6 immutable audit) |
| Realizes | Immutable ecosystem audit + **mandatory explainability** (signals→assessment→verdict/intervention) + reproducibility + reconciliation |
| Prohibited-dir impact | **NONE** — reuses the ratified hash-chained audit pattern behind the existing `AuditSink` seam |

> Every act of governed ecosystem modeling is auditable and every health/resilience verdict and proposed
> intervention is **explainable**. An un-explainable output is a rejected output (EGP-9). Audit is hash-chained,
> tamper-evident, reproducible-by-record, and cross-node reconcilable, reusing the proven Federation audit
> chain — **no custom crypto, no core-dir change**.

---

## 1. Principles

- **EAP-1 No Unexplained Verdict or Intervention.** A health/resilience verdict cannot be published, and a
  proposed intervention cannot reach `certified`, without a resolvable rationale chain.
- **EAP-2 Tamper-Evidence.** Audit entries are hash-chained (SHA-256 over the prior entry) and signature-checked
  at checkpoints (reuse `FederatedAuditLog`); any break is a detectable integrity event.
- **EAP-3 Reproducibility-by-Record.** Every verdict/intervention records enough to deterministically re-derive
  it from pinned snapshots.
- **EAP-4 Append-Only / Migration-Only.** Audit is never rewritten; corrections are forward entries (IP-14).
- **EAP-5 Classification-Inheriting.** Audit/rationale records inherit `max(input classification)` (S4).
- **EAP-6 Fail-Closed.** Unwritable/unverifiable audit ⇒ the ecosystem act is denied (no silent proceed).

## 2. Audited Event Types (`ECO_*`)

| Event | Emitted when | Key fields (provenance-in-data) |
|-------|--------------|---------------------------------|
| `ECO_ENTITY_REGISTER` | Entity proposed/certified/ratified | entityId, kind(ontologyRef), scope, authorityId, classification |
| `ECO_RELATIONSHIP_ASSERT` | Relationship asserted | relId, type(ontologyRef), source, target, classification |
| `ECO_DEPENDENCY_DECLARE` | Dependency declared | depId, from, to, depType, criticality |
| `ECO_GROUNDING_RESOLVE` | Ontology grounding of a kind/type | recordRef, ontologyRef, snapshotRef, `resolved|denied` |
| `ECO_SIGNAL_ADMIT` | Signal Source admitted/rejected | signalId, sourceRef, kind, classification, `admitted|rejected(reason)` |
| `ECO_HEALTH_ASSESS` | Health assessment produced | healthId, scope, snapshotRefs, verdict, rationaleRef |
| `ECO_RESILIENCE_ASSESS` | Resilience assessment produced | resilienceId, scope, findings[], score, simEvidenceRef?, intelAdvisoryRef?, rationaleRef |
| `ECO_INTERVENTION_PROPOSE` | Remediation/intervention proposed | proposalRef, basisRef(health/resilience), rationaleRef |
| `ECO_POLICY_EVAL` | PI-4 policy evaluation of proposal | proposalRef, verdict, denyReasons[] |
| `ECO_INTERVENTION_CERTIFY` | Intervention certified (SoD) | changeRef, certifier, proposer, `certifier≠proposer` |
| `ECO_INTERVENTION_RATIFY` | Intervention ratified (quorum) | changeRef, ratifiers[], quorumMet |
| `ECO_EVOLUTION_COMMIT` | Committed via Evolution Fabric | changeRef, evolutionUnitRef, appliedAt |
| `ECO_REVOKE` | Entity/relationship/dependency/assessment/authority revoked | targetRef, revAuthorityId, reason |
| `ECO_FED_CONTRIBUTION` | Foreign advisory contribution ingested | contributionRef, nodeId, clampedTrust, `advisory` |
| `ECO_UNKNOWN_ADMIT` | Unknown-future ecosystem kind admission act | admissionId, proposedKind, groundingProposalRef, amendmentRef?, `admitted|denied` |

All entries are chained (`prevHash → entryHash`) and carry `scope`/`healthId`/`resilienceId`/`changeRef`
correlation.

## 3. Explainability Model — the Assessment Rationale Chain

A **rationale** is a signed, structured object binding a verdict/intervention back to its evidence:

```
Verdict / Intervention
  └─ Rationale(rationaleRef)
       ├─ signals[]     → ECO_SIGNAL_ADMIT refs (+ classification, provenance)
       ├─ graph         → pinned ecosystem-graph ref (entities/relationships/dependencies)
       ├─ grounding[]   → ECO_GROUNDING_RESOLVE refs (ontology types, snapshot)
       ├─ advisory[]    → INT/SIM advisory evidence refs (tagged `advisory`, referenced not authoritative)
       ├─ rules         → deterministic health/resilience ruleset + budgets
       └─ conclusion    → verdict / proposed intervention + why (human-readable + machine-checkable)
```

- **Completeness rule.** Every `conclusion` element must trace to ≥1 `signal`, `graph`, or `grounding` node; a
  dangling conclusion fails EAP-1 and the verdict/intervention is rejected.
- **Advisory transparency.** Any Intelligence/Simulation contribution appears as an `advisory` node with its
  source/provenance; a verdict resting **solely** on advisory evidence (no deterministic signal/graph basis) is
  not publishable, and an intervention resting on it is not commit-eligible (closes ECO5 masking).

## 4. Reproducibility Record

Per published verdict / committed intervention: `{ id, inputsHash, ontologySnapshotRef, knowledgeSnapshotRef,
memorySnapshotRef, graphRef, signalRefs[], rulesetRef, rationaleRef, resultHash }`. A re-run over the same
snapshots must yield the same `resultHash`; divergence is an integrity event (surfaces ECO5 resilience
miscalculation / masking).

## 5. Cross-Node Reconciliation (federated)

- Reuses `FederatedAuditLog` reconciliation: nodes exchange signed checkpoints; mismatched effect or broken
  hash ⇒ **fail-closed divergence** adjudicated by the federation Audit Authority (FED-AUD-001).
- Foreign contributions (`ECO_FED_CONTRIBUTION`) are reconcilable to their originating node's audit but bind
  locally only after local ratification (ECO-FED-001 §2.2).

## 6. Export / Offline Verification
- Audit segments export as signed, self-verifying bundles; an offline verifier recomputes the hash chain and
  checks checkpoint signatures without live system access.

## 7. Threat Coverage
Primary closure of **ECO14** (audit/explainability gap); supports **ECO5** (resilience-masking detection),
**ECO4** (signal provenance), **ECO10** (evolution-bypass detection), **ECO8/ECO9** (federated reconciliation).
See `ECO-THREAT-001`.

## 8. Traceability
- **Refines:** `ECO-GOV-001`, `ECO-ARCH-001`, `ECO-SEC-001`, `ECO-FED-001`, `AD-0018` (`FED-AUD-001`),
  `UCOS-SEC-ARCH-001` (S6), AUTH-008/010/012, Constitution Art. X.
- **Consumed by:** `ECO-THREAT-001`, `ECO-READINESS-001`, future PI-16 act.
- **Owner:** UCOS Authority Board.

**END ECO-AUD-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
