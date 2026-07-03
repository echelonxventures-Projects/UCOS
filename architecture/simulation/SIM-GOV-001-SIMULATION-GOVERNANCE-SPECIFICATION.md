# SIM-GOV-001 — UCOS Simulation Governance Specification

| Field | Value |
|-------|-------|
| Artifact | **SIM-GOV-001 — Simulation Governance Specification** |
| Workstream | FND-SIM-01 (PHASE 20 · PI-11 Simulation Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, infrastructure, services, or model weights |
| Basis | `AD-0016` (substrate), `AD-0017` (control), `AD-0018` (federation), `AD-0019` (evolution), `AD-0020` (knowledge) — all RATIFIED/executed; design-phase predecessors `ONTO-*` (PI-8), `MEM-*` (PI-9), `INT-*` (PI-10); `AD-0014` (Ω∞ disposition); `UCOS-SEC-ARCH-001` (S1/S3/S4); AUTH-003 (IP-01..17); AUTH-008/009/012; Constitution Art. IX/XII |
| Realizes | Digital Twins; Scenario Engine; Predictive Models; State Projection; Impact Analysis; Policy Simulation; Knowledge Simulation; Civilization Simulation Foundations; Federated Simulation; Simulation Evolution — **as governance constructs only** |
| Prohibited-dir impact | **NONE** — every construct is a runtime metadata-stored record interpreted by the existing PI-4 governance/policy engines (metadata-first; IP-04) |

> This specification defines **governance only**. It authorizes no implementation. The Simulation Fabric is a
> **governed what-if / projection layer** — it *models*, *projects*, and *proposes*; it never *is* the system
> it models and never autonomously *acts* on governed state. Every simulation executes inside an **isolated,
> disposable sandbox** against a **pinned, signed snapshot** of governed state; it can produce projections and
> proposals but has **no independent write path** to any governed construct. It is categorically **not** the
> deferred Ω∞ existential / self-directed system (AD-0014 stands): it has no self-authored goals, no
> self-modification, and no autonomous actuation, and its Civilization-Simulation scope is a **bounded,
> conceptual** modelling class — never an unbounded self-running society. All simulation constructs are
> expressed as runtime, metadata-stored records — **0 hardcoded twins, scenarios, models, or projections**
> (IP-04). Simulation implementation remains gated behind a future PI-11 authorization act by the Authority
> Board.

---

## 1. Principles (simulation-specific, subordinate to the Authority Layer)

- **SGP-1 Non-Actuating Simulation (project & propose, never act).** The fabric produces **projections**,
  **impact analyses**, and **proposals** only. It has no standing intent and no autonomous mandate. Every
  side effect on governed state is routed to the PI-4 Control Plane (PEP) and, for governed change, through
  the ratified **Evolution Fabric** (AD-0019). Absent explicit authorization, a simulation output has no
  effect beyond the audit trail. Closes the Ω∞ boundary at the design level (AD-0014).
- **SGP-2 Sandbox Isolation (never touches production state).** Every Simulation Run executes in an isolated,
  disposable **Simulation Sandbox Scope** (§2.12) under the reserved `simulation:sandbox:<runId>:*` keyspace.
  Reads come from a pinned snapshot; writes land only in the sandbox partition; the sandbox is torn down on
  completion. A simulation may **never** write to any non-sandbox governed namespace (`knowledge:*`,
  `memory:*`, `ontology:*`, `policy:*`, `identity:*`, `evolution:*`, registry, or contracts).
- **SGP-3 Determinism-by-Default / Non-Determinism Quarantine (INV-6).** State projection, scenario stepping,
  impact analysis, and result commitment are **deterministic** functions of `(pinned snapshot, scenario
  definition, constraint set, model set, seed)`. Any probabilistic/predictive inference is confined behind a
  declared **Predictive Model Adapter** (§2.5) that is (a) explicitly typed non-deterministic, (b) recorded
  with full reproducibility provenance, (c) **never on the promotion-commit path without a deterministic
  verifier/guard**, and (d) advisory-only. A forecast is never a fact.
- **SGP-4 Deny-by-Default Promotion.** A projection or impact analysis becomes a governed change **only** by
  driving an **Evolution Unit** through the Evolution Fabric, after passing PI-4 Policy Evaluation and hard
  constraint checks. Absent that path, results are advisory. No simulation output self-promotes.
- **SGP-5 Bounded Simulation.** Every run declares hard budgets — projection **horizon**, **step count**,
  **entity/agent count**, wall-clock, and resource ceilings. Budget exhaustion is **fail-closed** (run aborts,
  sandbox discarded, no partial promotion).
- **SGP-6 Mandatory Explainability & Reproducibility.** No unexplained projection. Every run emits a signed,
  hash-chained rationale linking `snapshot + scenario + model/seed → projected state → impact` (SIM-AUD-001).
  A result whose `(inputs hash, snapshotRef, scenarioId, modelId+seed, constraintSetId)` is not fully recorded
  and re-derivable is a **rejected** result.
- **SGP-7 Single Accountable Authority.** Each simulation construct has exactly one accountable owner (mirrors
  PEO single-owner); escalation terminates at the local Authority Board (AUTH-009).
- **SGP-8 Read-Governed Inputs (SoD non-waivable).** Simulation reads knowledge via governed **Knowledge
  Fabric** queries, memory via governed **Memory Fabric** partitions, semantics via the **Ontology Fabric**,
  and forecasts via the **Intelligence Fabric** — all respecting S4 classification. It **cannot mutate**
  knowledge, memory-of-record, ontology, policy, or any governed construct except by driving an Evolution Unit.
  Separation of duties between *modeller*, *certifier*, and *committer* is non-waivable.
- **SGP-9 Bounded Civilization Simulation (no existential scope).** Civilization-scale simulation is a
  **bounded, conceptual, snapshot-based** modelling class: fixed horizon, capped entity/agent count, sandbox
  isolated, non-actuating, and reproducible. It is **not** a self-directed, open-ended, or self-executing
  society, must never author its own goals, and never crosses into Ω∞ existential scope (AD-0014).

## 2. The 12 Governance Constructs

Each construct specifies: **Purpose · Record (metadata shape) · Lifecycle · Decision rights · Escalation ·
Invariants**. Records are stored under the reserved metadata key namespace `simulation:<kind>:<id>`
(provenance keying per FED-PROV convention; carried in data — no first-class core-port fields).

### 2.1 Simulation Authority (`SIM-GOV-C1`)
- **Purpose.** A principal empowered to open simulation runs and issue projections/impact analyses/proposals within a scope.
- **Record.** `{ authorityId, principalRef, powers: (model-twin|define-scenario|run|project|analyze-impact|propose)[], scope, keyRef, status }`.
- **Lifecycle.** `registered → active → (suspended ↔ active) → revoked`.
- **Decision rights.** Registration/scope: Authority Board (Approval-Required, AD-0009). Powers are an
  **enumerated allow-list** (no implicit powers).
- **Invariants.** No `commit`/`actuate` power exists (commit is Evolution Fabric + Control Plane only);
  unknown power ⇒ reject.

### 2.2 Digital Twin (`SIM-GOV-C2`)
- **Purpose.** A governed model that mirrors a target system's structure/state for what-if projection — a
  **read-derived replica**, never a control surface over the source.
- **Record.** `{ twinId, targetRef, snapshotRef, fidelity: "structural"|"stateful"|"behavioral", ontologyRef?, classificationMax, status }`.
- **Lifecycle.** `defined → bound(snapshot) → active → (stale ↔ active) → retired`.
- **Decision rights.** Registration/binding: Simulation Authority; cross-boundary twin ⇒ Board.
- **Invariants.** A twin is bound to a **pinned, signed snapshot** and **never actuates or mutates its
  target**; `stale` (expired snapshot) is fail-closed and non-projectable until re-bound; a twin never carries
  higher classification exposure than its `classificationMax` (S4).

### 2.3 Scenario (`SIM-GOV-C3`)
- **Purpose.** A what-if definition: a baseline plus a set of interventions/perturbations to project.
- **Record.** `{ scenarioId, kind: "policy"|"knowledge"|"state"|"capability"|"civilization"|"generic", baselineRef: snapshotRef, interventions: intervention[], horizon, constraints: constraintSetId[], authorizedBy, expiresAt }`.
- **Lifecycle.** `proposed → authorized → (active ↔ suspended) → (completed | abandoned | expired)`.
- **Decision rights.** Authorization: Scenario Authority (§2.4), Approval-Required.
- **Invariants.** No `active` scenario without an explicit Scenario Authority record; scenarios never
  self-extend (expiry fail-closed); a scenario may **perturb the sandbox** but never grants actuation on the
  real target. **Policy Simulation** = `kind:"policy"` (interventions over `policy:*` in-sandbox);
  **Knowledge Simulation** = `kind:"knowledge"` (interventions over a `knowledge:*` snapshot);
  **Civilization Simulation** = `kind:"civilization"` (bounded per SGP-9).

### 2.4 Scenario Authority (`SIM-GOV-C4`)
- **Purpose.** The authority empowered to author/approve/revoke scenarios in a scope.
- **Record.** `{ scenarioAuthorityId, principalRef, scope, maxConsequenceClass, maxHorizon, maxEntityCount, keyRef, status }`.
- **Invariants.** A scenario's `consequenceClass ≤ authority.maxConsequenceClass` and its `horizon`/entity
  count ≤ the authority caps; escalation to Board above the cap (civilization-class always Board).

### 2.5 Predictive Model Registry (`SIM-GOV-C5`)
- **Purpose.** Declares each predictive/forecasting mechanism, its determinism class, and its classification handling.
- **Record.** `{ modelId, kind: "deterministic"|"non-deterministic", ref, seedPolicy, inputClassificationMax, outputClassification, verifierRef?, keyRef?, status }`.
- **Lifecycle.** `registered → active → (deprecated) → retired`.
- **Decision rights.** Registration: Authority Board. A `non-deterministic` model requires a bound
  deterministic **verifier/guard** before activation. Predictive contributions may reuse the Intelligence
  Fabric Inference Model Registry (INT-GOV-001 §2.2) where present.
- **Invariants.** A `non-deterministic` model's output is **advisory-only** and may never be the sole basis of
  a promoted result (SGP-3). Model weights/keys are **by reference only** (S3) — never embedded in records.

### 2.6 Simulation Constraint Set (`SIM-GOV-C6`)
- **Purpose.** The hard/soft invariants a projection/scenario run must satisfy.
- **Record.** `{ constraintSetId, hard: constraint[], soft: (constraint,weight)[], preservedInvariants: string[], scope }`.
- **Invariants.** **Hard constraints are inviolable** — a projection violating any hard constraint (or any
  declared preserved system invariant, e.g. conservation/non-negativity/boundary rules) is rejected, never
  overridden by soft-optimization. Constraint evaluation is deterministic.

### 2.7 Simulation Run (`SIM-GOV-C7`)
- **Purpose.** A bounded, budgeted, sandbox-isolated, fully audited unit of simulation.
- **Record.** `{ runId, authorityId, scenarioId, twinRefs: twinId[], sandboxScopeId, budgets: {horizon,steps,entities,wallMs,resource}, snapshotRef, seed, status }`.
- **Lifecycle.** `open → running → (completed | aborted-budget | aborted-fault)`.
- **Invariants.** Bounded per SGP-5; pins a **snapshot** for reproducibility; executes only inside its
  Sandbox Scope (§2.12); every step audited; abort is fail-closed with sandbox teardown and no promotion.

### 2.8 Projection Record (`SIM-GOV-C8`)
- **Purpose.** The state-projection output of a run — the projected/hypothetical future or counterfactual state.
- **Record.** `{ projectionId, runId, snapshotRef, method: "deterministic"|"model-assisted", steps, projectedStateRef, rationaleRef, classification, at }` (append-only).
- **Invariants.** Advisory by default (zero side effects); resolvable rationale required (SGP-6);
  model-assisted projections carry the contributing `modelId`+verifier attestation; classification inherited
  from inputs (S4). Promotion to governed change occurs **only** via the Evolution Fabric.

### 2.9 Impact Analysis Record (`SIM-GOV-C9`)
- **Purpose.** The governed assessment of a scenario's consequences relative to the baseline.
- **Record.** `{ impactId, scenarioId, projectionRefs: projectionId[], deltas: delta[], risks: risk[], constraintCompliance, recommendation: "adopt-proposal"|"reject"|"inconclusive", rationaleRef, at }` (append-only).
- **Invariants.** Every `adopt-proposal` recommendation must reference a passing constraint check and a
  resolvable rationale; a recommendation is advisory and **never** self-commits — adoption is a separate
  Evolution Unit subject to policy evaluation, certification (SoD), and ratification.

### 2.10 Simulation Revocation Authority (`SIM-GOV-C10`)
- **Purpose.** Empowered to revoke twins, scenarios, models, runs, or promoted results (forward-only).
- **Record.** `{ revAuthorityId, principalRef, revocableKinds[], keyRef }`.
- **Behavior.** Revocations **propagate** and are **fail-closed**: a construct in unknown/unreachable
  revocation state is treated as revoked (deny). Reuses federation/knowledge revocation semantics. Reversal of
  a promoted result is a new forward Evolution Unit (migration-only, IP-14) — never a silent rewrite.

### 2.11 Federated Simulation Authority (`SIM-GOV-C11`)
- **Purpose.** A foreign authority whose twins/scenarios/projections this node will evaluate (co-simulation).
- **Record.** `{ fedSimAuthorityId, nodeId, powers: (contribute-twin|contribute-scenario|attest-projection)[], maxTrustLevel, keyRef, status }`.
- **Invariants.** Foreign simulation is **advisory / deny-only** for local promotion (see SIM-FED-001): it may
  inform or add denials, but never autonomously actuates or promotes locally without local ratification. Trust
  is clamped to `maxTrustLevel ≤ boundary.maxTrustLevel`; foreign twins/projections are namespace-isolated
  (local-shadows-foreign).

### 2.12 Simulation Sandbox Scope (`SIM-GOV-C12`)
- **Purpose.** An isolated, disposable metadata partition in which a run executes.
- **Record.** `{ sandboxScopeId, runId, keyspace: "simulation:sandbox:<runId>:*", classification, retention, ownerRef }`.
- **Invariants.** All run writes are confined to the sandbox keyspace; the sandbox **never overlaps** any
  governed namespace; teardown/retention is fail-closed on expiry; nothing leaves the sandbox except an
  explicitly emitted, audited Projection/Impact record (which remains advisory until Evolution-promoted).

## 3. Governance Coverage Matrix

| Construct | Owner (accountable) | Approval-Required? | Fail-closed? | Threats addressed |
|-----------|---------------------|:------------------:|:------------:|-------------------|
| C1 Simulation Authority | Authority Board | Yes | Yes | S1, S8 |
| C2 Digital Twin | Simulation Authority | Yes (cross-boundary) | Yes (stale) | S2, S12 |
| C3 Scenario | Scenario Authority | Yes | Yes (expiry) | S4, S11 |
| C4 Scenario Authority | Authority Board | Yes | Yes (caps) | S8, S11 |
| C5 Predictive Model Registry | Authority Board | Yes | Yes | S3, S4 |
| C6 Simulation Constraint Set | Simulation/Decision Authority | Yes | Yes (hard inviolable) | S4, S11 |
| C7 Simulation Run | Simulation Authority | Yes (consequential) | Yes (budget) | S1, S5 |
| C8 Projection Record | Simulation Authority | Yes (promotion) | Yes (deny-default) | S1, S3, S6 |
| C9 Impact Analysis Record | Simulation/Decision Authority | Yes (promotion) | Yes | S4, S10 |
| C10 Simulation Revocation Authority | Authority Board | Yes | Yes (propagate) | S2, S9 |
| C11 Federated Simulation Authority | Authority Board | Yes | Yes (clamp/deny) | S9, S12 |
| C12 Simulation Sandbox Scope | Authority Board | Yes | Yes (retention/teardown) | S1, S6 |

**12/12 constructs defined.** All map to existing PI-4 primitives (governance processes, approvals,
certifications, revocation, deny-overrides-allow policy) + Knowledge/Memory/Ontology (read), Intelligence
(advisory forecasts), Evolution (mutation/promotion), and Federation (cross-node) fabrics, plus new metadata
record kinds — **no core-dir change**.

## 4. Traceability
- **Refines:** `AD-0016/0017/0018/0019/0020`, `AD-0014`, design predecessors `ONTO-*`/`MEM-*`/`INT-*`,
  AUTH-003 (IP-01/04/06/14/15), AUTH-008 (S1/S3/S4), AUTH-009, AUTH-012, Constitution Art. IX/XII,
  `UCOS-SEC-ARCH-001`.
- **Consumed by:** `SIM-GOV-002` (lifecycle/decision-rights), `SIM-ARCH-001` (engine composition),
  `SIM-SEC-001` (assertion verification), `SIM-FED-001`, `SIM-AUD-001`, `SIM-THREAT-001`,
  `SIM-READINESS-001`, and a future PI-11 implementation act.
- **Owner:** UCOS Authority Board.

**END SIM-GOV-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
