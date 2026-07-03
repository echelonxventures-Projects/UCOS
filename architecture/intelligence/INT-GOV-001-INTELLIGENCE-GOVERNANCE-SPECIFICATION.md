# INT-GOV-001 — UCOS Intelligence Governance Specification

| Field | Value |
|-------|-------|
| Artifact | **INT-GOV-001 — Intelligence Governance Specification** |
| Workstream | FND-INT-01 (PHASE 19 · PI-10 Intelligence Fabric Foundations) |
| Version | 1.1.0 |
| Status | **DESIGN — READY FOR RE-RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, infrastructure, services, or model weights |
| Remediation (v1.1.0) | Incorporates **PHASE 19.2** design deltas resolving **F-2** (semantic grounding; `INT-REM-001`) and **F-4** (memory ownership; `INT-REM-002`), consolidated in `INT-REM-003`. Changes: **+IGP-9** (mandatory ontology grounding), **+IGP-10** (single memory SoR), tightened **IGP-8**; **+`INT-GOV-C13`** (Ontology Grounding Binding); **`INT-GOV-C12`** redefined from store → read-only view over PI-9; `INT-GOV-C9` gains ontology/memory snapshot refs. |
| Basis | `AD-0016` (substrate), `AD-0017` (control), `AD-0018` (federation), `AD-0019` (evolution), `AD-0020` (knowledge) — all RATIFIED/executed; `AD-0014` (Ω∞ disposition); `UCOS-SEC-ARCH-001` (S1/S3/S4); AUTH-003 (IP-01..17); AUTH-008/009/012; Constitution Art. IX/XII; `ONTO-*` (PI-8), `MEM-*` (PI-9); `INT-REM-001/002/003` |
| Realizes | Reasoning, Inference, Planning, Decision engines; Goal Management; Policy Evaluation; Constraint Solving; Knowledge Utilization; Memory Utilization; Federated Intelligence — **as governance constructs only** |
| Prohibited-dir impact | **NONE** — every construct is a runtime metadata-stored record interpreted by the existing PI-4 governance/policy engines (metadata-first; IP-04) |

> This specification defines **governance only**. It authorizes no implementation. The Intelligence Fabric
> is a **governed cognition layer** — it *proposes*, it never autonomously *acts*. It is categorically **not**
> the deferred Ω∞ existential / self-directed intelligence (AD-0014 stands): it has no self-authored goals,
> no self-modification, and no autonomous actuation. All intelligence constructs are expressed as runtime,
> metadata-stored records — **0 hardcoded goals, models, policies, or decisions** (IP-04). Intelligence
> implementation remains gated behind a future PI-10 authorization act by the Authority Board.

---

## 1. Principles (intelligence-specific, subordinate to the Authority Layer)

- **IGP-1 Governed Cognition (no self-direction).** Intelligence never authors its own goals. Every goal is
  externally authorized by a Goal Authority (§2.4). The fabric reasons, infers, plans, and *proposes*
  decisions; it has no standing intent and no autonomous mandate. Closes the Ω∞ boundary at the design level
  (AD-0014).
- **IGP-2 Determinism-by-Default / Non-Determinism Quarantine (INV-6).** Reasoning, planning, constraint
  solving, and decision commitment are **deterministic** functions of `(recorded inputs, knowledge snapshot,
  policy set, constraint set, seed)`. Any probabilistic/model-based inference is confined behind a declared
  **Inference Adapter** (§2.2) that is (a) explicitly typed non-deterministic, (b) recorded with full
  reproducibility provenance, (c) **never on the decision-commit path without a deterministic verifier/guard**,
  and (d) advisory-only. Determinism-critical paths remain quarantined from non-deterministic output.
- **IGP-3 Deny-by-Default Actuation (propose, never act).** The Intelligence Fabric produces **proposals** and
  **rationales** only. Every side effect on governed state is routed to the PI-4 Control Plane (PEP) and, for
  governed change, through the ratified **Evolution Fabric**. Absent explicit authorization, a proposal has no
  effect beyond the audit trail.
- **IGP-4 Human/Board-in-the-Loop for Consequential Decisions.** Any decision that certifies a governed change,
  crosses a trust boundary, or exceeds a declared consequence threshold is an **Approval-Required Operation**
  (AD-0009).
- **IGP-5 Bounded Cognition.** Every reasoning session declares hard budgets — reasoning depth, step count,
  wall-clock, and resource ceilings. Budget exhaustion is **fail-closed** (session aborts, no partial commit).
- **IGP-6 Mandatory Explainability.** No unexplained decision. Every inference and decision emits a signed,
  hash-chained rationale linking `evidence → rule/inference → conclusion` (INT-AUD-001). An un-explainable
  output is a rejected output.
- **IGP-7 Single Accountable Authority.** Each intelligence construct has exactly one accountable owner
  (mirrors PEO single-owner); escalation terminates at the local Authority Board (AUTH-009).
- **IGP-8 Read-Governed Knowledge & Memory.** Intelligence reads knowledge via governed **Knowledge Fabric**
  queries (respecting S4 classification) and memory via **read-only recall from the ratified PI-9 Memory
  Fabric** (no intelligence-local memory store; see IGP-10). It **cannot mutate** knowledge, memory-of-record,
  or any governed construct except by driving an Evolution Unit through the Evolution Fabric. Separation of
  duties (SoD) is non-waivable.
- **IGP-9 Mandatory Ontology Grounding (fail-closed).** Every semantically-significant operation (Reasoning,
  Inference, Planning, Constraint interpretation, Goal admission) is **ontology-relative**: the meaning of
  goals, evidence, constraints, and conclusions is defined **only** by `active` ratified Ontology Records
  (`ONTO-C2`) resolved from the Ontology Graph (`ONTO-C4`). There is **no intelligence-local ontology** — the
  PI-8 Ontology Fabric is the sole source of truth for meaning. An operation over a term that cannot resolve to
  an `active` ontology entity/relationship/taxonomy is **denied fail-closed**. (Detail: `INT-REM-001`.)
- **IGP-10 Single Memory Source of Truth (no intelligence-local store).** The **PI-9 Memory Fabric is the sole
  owner and system of record** for all memory across every tier (WM/STM/LTM/SEM/EPI/FED-MEM; `MEM-GOV-001`).
  The Intelligence Fabric holds **no memory store, no independent retention, and no independent forgetting**; it
  **recalls** memory read-only (deny-by-default, S4-monotonic) and **proposes** durable memory as Evolution
  Units targeting the `memory:` namespace (`MGP-4`). (Detail: `INT-REM-002`.)

## 2. The 13 Governance Constructs

Each construct specifies: **Purpose · Record (metadata shape) · Lifecycle · Decision rights · Escalation ·
Invariants**. Records are stored under the reserved metadata key namespace `intelligence:<kind>:<id>`
(provenance keying per FED-PROV convention; carried in data — no first-class core-port fields).

### 2.1 Reasoning Authority (`INT-GOV-C1`)
- **Purpose.** A principal empowered to open reasoning sessions and issue inference/decision proposals within a scope.
- **Record.** `{ authorityId, principalRef, powers: (reason|infer|plan|decide-propose|solve)[], scope, keyRef, status }`.
- **Lifecycle.** `registered → active → (suspended ↔ active) → revoked`.
- **Decision rights.** Registration/scope: Authority Board (Approval-Required). Powers are an **enumerated
  allow-list** (no implicit powers).
- **Invariants.** No `decide-commit` power exists (commit is Decision Authority + Evolution Fabric only);
  unknown power ⇒ reject.

### 2.2 Inference Model Registry (`INT-GOV-C2`)
- **Purpose.** Declares each inference mechanism, its determinism class, and its classification handling.
- **Record.** `{ modelId, kind: "deterministic"|"non-deterministic", ref, seedPolicy, inputClassificationMax, outputClassification, keyRef?, status }`.
- **Lifecycle.** `registered → active → (deprecated) → retired`.
- **Decision rights.** Registration: Authority Board. Any `non-deterministic` model requires a declared
  deterministic **verifier/guard** binding before activation.
- **Invariants.** A `non-deterministic` model's output is **advisory-only** and may never be the sole basis of a
  committed decision (IGP-2). Model weights/keys are **by reference only** (S3) — never embedded in records.

### 2.3 Goal (`INT-GOV-C3`)
- **Purpose.** An externally authorized objective the fabric may reason toward.
- **Record.** `{ goalId, statement, ownerRef, scope, constraints: constraintSetId[], consequenceClass, authorizedBy, expiresAt }`.
- **Lifecycle.** `proposed → authorized → (active ↔ suspended) → (achieved | abandoned | expired)`.
- **Decision rights.** Authorization: Goal Authority (§2.4), Approval-Required.
- **Invariants.** No `active` goal without an explicit authorizing Goal Authority record; goals never
  self-extend (expiry is fail-closed); a goal may **constrain** but never grant actuation power.

### 2.4 Goal Authority (`INT-GOV-C4`)
- **Purpose.** The authority empowered to author/approve/revoke goals in a scope.
- **Record.** `{ goalAuthorityId, principalRef, scope, maxConsequenceClass, keyRef, status }`.
- **Invariants.** A goal's `consequenceClass ≤ authority.maxConsequenceClass`; escalation to Board above the cap.

### 2.5 Policy Evaluation Binding (`INT-GOV-C5`)
- **Purpose.** Binds intelligence proposals to the ratified PI-4 Policy Evaluation engine (deny-by-default,
  deny-overrides-allow).
- **Record.** `{ bindingId, scope, policySetRef, evaluationMode: "pre-commit" }`.
- **Invariants.** Reuses the PI-4 policy evaluator unchanged; every proposal is policy-evaluated **before**
  routing to Control/Evolution; a proposal that fails policy is denied and audited. No new policy engine.

### 2.6 Constraint Set (`INT-GOV-C6`)
- **Purpose.** The hard/soft constraints a planning/constraint-solving run must satisfy.
- **Record.** `{ constraintSetId, hard: constraint[], soft: (constraint,weight)[], scope }`.
- **Invariants.** **Hard constraints are inviolable** — a plan/decision violating any hard constraint is
  rejected (never overridden by soft-constraint optimization). Constraint evaluation is deterministic.

### 2.7 Decision Authority (`INT-GOV-C7`)
- **Purpose.** A principal empowered to certify/ratify a proposed decision for commit.
- **Record.** `{ decisionAuthorityId, principalRef, scope, maxConsequenceClass, keyRef, status }`.
- **Invariants.** **SoD non-waivable** — the proposing Reasoning Authority may not also certify or ratify the
  same decision. Quorum required above declared consequence thresholds.

### 2.8 Decision Certification / Ratification (`INT-GOV-C8`)
- **Purpose.** The governed act that promotes a proposal to a commit-eligible decision.
- **Record.** `{ decisionId, proposalRef, rationaleRef, certifiedBy, ratifiedBy[], quorumMet, at }` (append-only).
- **Invariants.** Requires a resolvable rationale (IGP-6), passing policy evaluation (§2.5), and satisfied hard
  constraints (§2.6). Commit occurs **only** via the Evolution Fabric / Control Plane — never directly.

### 2.9 Reasoning Session (`INT-GOV-C9`)
- **Purpose.** A bounded, budgeted, fully audited unit of cognition.
- **Record.** `{ sessionId, authorityId, goalId?, budgets: {depth,steps,wallMs,resource}, knowledgeSnapshotRef, ontologySnapshotRef, memorySnapshotRef, groundingBindingRef, memoryViewRef, seed, status }`.
- **Lifecycle.** `open → running → (completed | aborted-budget | aborted-fault)`.
- **Invariants.** Bounded per IGP-5; pins a **knowledge snapshot**, an **ontology snapshot** (`ONTO-C4`
  projection; IGP-9), and a **memory snapshot** (PI-9 recall set; IGP-10) for full reproducibility; a session
  **cannot open** without a resolvable Ontology Grounding Binding (`INT-GOV-C13`); every step is audited; abort
  is fail-closed with no partial commit.

### 2.10 Intelligence Revocation Authority (`INT-GOV-C10`)
- **Purpose.** Empowered to revoke goals, models, authorities, or committed decisions (forward-only).
- **Record.** `{ revAuthorityId, principalRef, revocableKinds[], keyRef }`.
- **Behavior.** Revocations **propagate** and are **fail-closed**: a construct in unknown/unreachable revocation
  state is treated as revoked (deny). Reuses federation/knowledge revocation semantics. Decision reversal is a
  new forward Evolution Unit (migration-only, IP-14) — never a silent rewrite.

### 2.11 Federated Intelligence Authority (`INT-GOV-C11`)
- **Purpose.** A foreign authority whose reasoning contributions/decisions this node will evaluate.
- **Record.** `{ fedIntAuthorityId, nodeId, powers: (advise|infer-contribute|decision-attest)[], maxTrustLevel, keyRef, status }`.
- **Invariants.** Foreign intelligence is **advisory / deny-only** for local commit (see INT-FED-001): it may
  inform or add denials, but never autonomously actuates or grants locally without local ratification. Trust is
  clamped to `maxTrustLevel ≤ boundary.maxTrustLevel`.

### 2.12 Memory Scope (`INT-GOV-C12`) — *revised v1.1.0: read-only view over PI-9 (F-4 remediation, `INT-REM-002`)*
- **Purpose.** A **read-only, scoped view over the PI-9 Memory Fabric** declaring which memory tiers/subjects an
  intelligence scope may **recall** — **not** a store, and **not** an owner of retention/forgetting (those are
  `MEM-GOV-002`).
- **Record.** `{ memoryViewId, scope, tierRefs: (T1|T2|T3|T4|T5|T6)[], subjectSelector, classificationCeiling, recallMode: "read-only", memorySnapshotRef, onExpiredOrRevoked: "deny", ownerRef }` (key `intelligence:memory-view:<id>`).
- **Invariants.** **No store / no retention / no forgetting in Intelligence** (owned by PI-9); recall is
  deny-by-default and in-boundary only (`MGP-2`); classification honored end-to-end and monotonic (`MGP-3`, S4)
  clamped by `classificationCeiling`; **any durable memory is a proposed Evolution Unit** targeting `memory:`
  (`MGP-4`) — never a direct write; expired/revoked memory is excluded fail-closed (`MGP-5`).

### 2.13 Ontology Grounding Binding (`INT-GOV-C13`) — *new v1.1.0 (F-2 remediation, `INT-REM-001`)*
- **Purpose.** Binds an intelligence scope to the PI-8 Ontology Fabric as the mandatory grounding source
  (IGP-9) and pins a resolvable ontology view for reproducibility.
- **Record.** `{ bindingId, scope, ontologyNamespaceRefs: namespace[], ontologySnapshotRef, resolutionMode: "active-only", onUnresolved: "deny", status }` (key `intelligence:grounding:<id>`).
- **Decision rights.** Registration/scope: Authority Board (Approval-Required); `ontologyNamespaceRefs` is an
  enumerated allow-list (no implicit namespaces).
- **Invariants.** `resolutionMode = active-only` (never draft/proposed/superseded); `onUnresolved = deny`
  (fail-closed, IGP-9); grants **read/resolve only** (no ontology mutation); a Reasoning Session (`INT-GOV-C9`)
  without a resolvable binding cannot open.

## 3. Governance Coverage Matrix

| Construct | Owner (accountable) | Approval-Required? | Fail-closed? | Threats addressed |
|-----------|---------------------|:------------------:|:------------:|-------------------|
| C1 Reasoning Authority | Authority Board | Yes | Yes | I2, I4, I8 |
| C2 Inference Model Registry | Authority Board | Yes | Yes | I3, I6, I12 |
| C3 Goal | Goal Authority | Yes | Yes (expiry) | I1, I4 |
| C4 Goal Authority | Authority Board | Yes | Yes | I1, I4 |
| C5 Policy Evaluation Binding | Authority Board | Yes | Yes (deny-default) | I4, I7 |
| C6 Constraint Set | Reasoning/Decision Authority | Yes | Yes (hard inviolable) | I7 |
| C7 Decision Authority | Authority Board | Yes | Yes (SoD) | I4, I8 |
| C8 Decision Certification/Ratification | Decision Authority | Yes | Yes (quorum) | I4, I8, I9 |
| C9 Reasoning Session | Reasoning Authority | Yes (consequential) | Yes (budget) | I3, I11 |
| C10 Intelligence Revocation Authority | Authority Board | Yes | Yes (propagate) | I1, I2, I9 |
| C11 Federated Intelligence Authority | Authority Board | Yes | Yes (clamp/deny) | I9 |
| C12 Memory Scope (read-only view over PI-9) | Authority Board | Yes | Yes (deny expired/revoked) | I5 |
| C13 Ontology Grounding Binding | Authority Board | Yes | Yes (deny unresolved) | I2, I6, I7 |

**13/13 constructs defined.** All map to existing PI-4 primitives (governance processes, approvals,
certifications, revocation, deny-overrides-allow policy) + Knowledge (read), **Ontology (read/resolve, PI-8)**,
**Memory (read-only recall, PI-9)**, Evolution (mutation), and Federation (cross-node) fabrics, plus new
metadata record kinds — **no core-dir change**.

## 4. Traceability
- **Refines:** `AD-0016/0017/0018/0019/0020`, `AD-0014`, AUTH-003 (IP-01/04/06/14/15), AUTH-008 (S1/S3/S4),
  AUTH-009, AUTH-012, Constitution Art. IX/XII, `UCOS-SEC-ARCH-001`, `ONTO-*` (PI-8), `MEM-*` (PI-9),
  `INT-REM-001/002/003` (v1.1.0 remediation).
- **Consumed by:** `INT-GOV-002` (lifecycle/decision-rights), `INT-ARCH-001` (engine composition), `INT-SEC-001`
  (assertion verification), `INT-FED-001`, `INT-AUD-001`, `INT-THREAT-001`, `INT-READINESS-001`, the PHASE 19.3
  PI-10 re-authorization review, and a future PI-10 implementation act.
- **Owner:** UCOS Authority Board.

**END INT-GOV-001 v1.1.0 — DESIGN · F-2/F-4 REMEDIATED · READY FOR RE-RATIFICATION · NO IMPLEMENTATION AUTHORIZED · ARTICLE IX ACTIVE.**
