# UCOS-CAP-AUTHORITY-CONSTRUCTION-0000

## Functional Requirements

> Scope note: This section contains the **Functional Requirements only** (FR-AUTH-001 through
> FR-AUTH-025). Every requirement is derived from and traceable to the completed authoritative
> `design.md`, and is consistent with the UCOS canon (registry-driven single source of truth, no
> hardcoded authorization logic, deterministic execution `INV-6`, event sourcing, propose-not-act,
> deny-by-default `S-A6`, PI-4 policy evaluation, PI-6 sole commit path, `AD-0009` external-actuation
> gating, revocation supremacy, single apex `AA-0`/`UAF-C3`, non-inversion `PCAMG-0008` G-1..G-5,
> hash-chained auditability). The 25 requirements comprehensively cover the design's registry,
> ten authority constructs (`AUTH-C1..C10`), archetype vocabulary (`AA-0..AA-8`), spine invariants
> (`S-A1..S-A10`), and runtime engines (Grant, Delegation, Scope, Decision, Approval, Revocation,
> Emergency Halt, Event Store).

---

### Authority Registry Management

#### FR-AUTH-001

- **ID:** FR-AUTH-001
- **Requirement:** THE Authority_Registry SHALL persist every authority construct (authority instance, authority type, grant, delegation, scope, policy, approval, decision, revocation) as a metadata-backed record keyed as `authority:<kind>:<id>`, such that the registry is the single authoritative source of truth for all authority state.
- **Rationale:** Registry-first design makes the Authority Registry the single source of truth and prevents divergent, cached, or code-embedded authority state (`UAF-C4`; registry rule 8; `INV-13`).
- **Source Design Section:** §4 Registry Schema (`AuthorityRecord`, `AuthorityTypeRecord`, `AuthorityScopeRecord`, `AuthorityDelegationRecord`, `AuthorityPolicyRecord`, `RevocationRecord`); §3 Domain Model.
- **Verification Method:** integration test (registry round-trip) + review of `authority:*` key-namespace conformance.

#### FR-AUTH-002

- **ID:** FR-AUTH-002
- **Requirement:** WHEN any authority construct is registered, THE Authority_Registry SHALL reject the registration IF the record lacks exactly one owner, a classification tag, a semantic version, or a resolvable Authority/Constitution source reference.
- **Rationale:** Single-owner (`S-A1`), mandatory classification (S4), mandatory versioning (`IP-13`), and source traceability (`S-A10`, `AUTH-010`) are canon invariants; records missing any are blocking gaps.
- **Source Design Section:** §4 Registry Schema ("Registry rules (enforced)" 1–3, 7); §3 Domain Model.
- **Verification Method:** property-based test (reject any record missing owner/classification/version/source) + adversarial test.

---

### Authority Type & Archetype Vocabulary

#### FR-AUTH-003

- **ID:** FR-AUTH-003
- **Requirement:** THE Authority_Type_Registry SHALL be the single source of truth for the archetype vocabulary (`AA-0..AA-8`), and WHEN an authority instance is admitted THE Authority_Registry SHALL reject the instance IF its `archetypeRef` does not resolve to a registered archetype or resolves to the non-instantiable apex archetype `AA-0`.
- **Rationale:** The archetype set is fixed and registry-declared; the apex `AA-0` is a preserved, non-instantiable singleton, so no fabric may forge a competing apex (`UAF-C3`; registry rule 5; Correctness Property 1).
- **Source Design Section:** §4 Registry Schema (`AuthorityTypeRecord`, registry rule 5; `admitAuthority` archetype/instantiable asserts); §3 Domain Model (C2); §10 Correctness Property 1.
- **Verification Method:** property-based test (no `AA-0` instance admissible) + adversarial test (apex forgery).

#### FR-AUTH-004

- **ID:** FR-AUTH-004
- **Requirement:** WHEN an authority instance is admitted, THE Authority_Registry SHALL commit the record only after verifying that the requesting authority holds the `grant` power and is neither revoked nor halted, that the record's `enumeratedPowers` are a subset of the resolved archetype's `powerVocabulary`, and that the record is not self-granted, and SHALL route the admission itself through the PI-6 Evolution_Fabric commit path.
- **Rationale:** Admission is deny-by-default, enumerated-power-bounded, non-self-granting, and committed only via the sole ledger-commit path so registration is itself governed and auditable (`S-A5`, `S-A9`; `admitAuthority` procedure).
- **Source Design Section:** §4 Registry Schema (`PROCEDURE admitAuthority`, registry rules 5–6); §7 API Model (`grantAuthority`); §8 Governance Model (Evolution-only commit).
- **Verification Method:** policy test + integration test (admission routed through Evolution Fabric) + adversarial test (self-grant, power widening).

---

### Decision Engine

#### FR-AUTH-005

- **ID:** FR-AUTH-005
- **Requirement:** WHEN any authority action (grant, delegate, decide, approve, revoke, or scope change) is requested, THE Decision_Engine SHALL obtain an authorization decision from the PI-4 Control_Plane policy evaluator before applying any enumerated-power or scope-containment check or committing any effect.
- **Rationale:** PI-4 policy evaluation is the mandated deny-by-default authorization stage preceding constraint checking and commit (`S-A6`; §7.1 step 1).
- **Source Design Section:** §7.1 Decision API (step 1 policy check); §8 Governance Model (deny-by-default row); §9 Dependency Graph (PI-4 hard dependency).
- **Verification Method:** policy test (authorization invoked on every governed path) + integration test against PI-4.

#### FR-AUTH-006

- **ID:** FR-AUTH-006
- **Requirement:** IF the PI-4 Control_Plane returns any decision other than ALLOW for a requested authority action, THEN THE Decision_Engine SHALL deny the action fail-closed with no authority-state change and SHALL append an `AUTH_DECISION_DENIED` audit event with reason `policy-deny`.
- **Rationale:** Deny-by-default requires that absent an explicit ALLOW every action is denied, with the denial recorded (`S-A6`; Correctness Property 3; §17 Error Handling Policy-deny row).
- **Source Design Section:** §7.1 Decision API (policy-deny branch); §17 Error Handling (Policy deny row); §10 Correctness Property 3.
- **Verification Method:** property-based test (no explicit ALLOW ⇒ DENY) + adversarial test.

#### FR-AUTH-007

- **ID:** FR-AUTH-007
- **Requirement:** WHEN any authority action is requested, THE Decision_Engine SHALL evaluate revocation and emergency-halt supremacy FIRST and non-bypassably, and IF the actor is revoked or the target scope is halted THEN THE Decision_Engine SHALL deny the action fail-closed regardless of any policy, power, or scope state.
- **Rationale:** Revocation supremacy and emergency halt are non-bypassable deny conditions checked before all other gates so a revoked or halted authority can never be exercised (`S-A?` revocation supremacy; Correctness Property 4; §7.1 step 0).
- **Source Design Section:** §7.1 Decision API (step 0 revocation/halt supremacy); §8 Governance Model (Revocation supremacy, Emergency halt rows); §10 Correctness Property 4.
- **Verification Method:** property-based test (revoked/halted ⇒ DENY at every subsequent decision) + adversarial test (revocation/halt bypass).

#### FR-AUTH-008

- **ID:** FR-AUTH-008
- **Requirement:** WHEN a policy-allowed authority action is evaluated, THE Decision_Engine SHALL deny the action fail-closed IF the actor does not hold the requested power as an enumerated power, IF the target scope is not contained within the actor's scope, or IF the action exceeds the actor's delegation bounds.
- **Rationale:** Enumerated-power containment (`S-A9`, no implicit power), scope containment, and narrowing-only delegation bounds are load-bearing fail-closed gates after policy authorization (Correctness Properties 2, 5; §7.1 step 2).
- **Source Design Section:** §7.1 Decision API (step 2 enumerated-power, scope-containment, delegation-bounds asserts); §10 Correctness Properties 2, 5; §17 Error Handling (Power not enumerated, Scope escape rows).
- **Verification Method:** property-based test (enumerated-power + scope containment) + adversarial test (power widening, scope escape).

#### FR-AUTH-009

- **ID:** FR-AUTH-009
- **Requirement:** WHEN rendering an authority decision, THE Decision_Engine SHALL compute the verdict as a pure, side-effect-free function of recorded inputs and SHALL emit a `resultHash` such that identical decision inputs always reproduce an identical verdict and `resultHash`.
- **Rationale:** Determinism (`INV-6`) requires decisions to be pure functions of recorded inputs with a reproducible proof, and the decision itself mutates no authority state (Correctness Property 7; §7.1 step 3).
- **Source Design Section:** §7.1 Decision API (step 3 determinism gate, `resultHash`); §16 Operational Model (determinism guarantee); §10 Correctness Property 7.
- **Verification Method:** property-based test (identical inputs ⇒ identical `resultHash`) + replay test.

#### FR-AUTH-010

- **ID:** FR-AUTH-010
- **Requirement:** IF a requested authority action would actuate a real-world (external) authority change, THEN THE Decision_Engine SHALL return a `Pending("AD-0009 approval required")` outcome and SHALL NOT commit the change autonomously.
- **Rationale:** External-world authority change is `AD-0009` Approval-Required and never autonomous (Correctness Property 9; §7.1 step 4).
- **Source Design Section:** §7.1 Decision API (step 4 external actuation gate); §8 Governance Model (No external actuation row); §10 Correctness Property 9; §17 Error Handling (External actuation row).
- **Verification Method:** integration test (`AD-0009` pending path) + adversarial test (external actuation without AD-0009 blocked).

---

### Grant Engine

#### FR-AUTH-011

- **ID:** FR-AUTH-011
- **Requirement:** WHEN a grant is requested, THE Grant_Engine SHALL accept it as a governed proposal only and SHALL commit the grant exclusively through the PI-6 Evolution_Fabric after verifying an explicit ALLOW decision, that the granted `enumeratedPowers` are a subset of the granter's own enumerated powers, that the proposer is distinct from the approver, and that the ratification quorum is met.
- **Rationale:** Grants are propose-not-act, narrowing (cannot grant beyond own), Separation-of-Duties- and quorum-gated, and committed only via the sole commit path (`S-A2`, `S-A3`, `S-A5`, `S-A9`; Correctness Properties 6, 8; `grantAuthority` procedure).
- **Source Design Section:** §7.2 Grant API (`FUNCTION grantAuthority`); §8 Governance Model (Separation of duties, Ratification, Evolution-only commit rows); §10 Correctness Properties 6, 8.
- **Verification Method:** property-based test (no grant beyond own powers; SoD distinctness) + integration test (Evolution commit) + adversarial test (self-escalation).

---

### Delegation Engine

#### FR-AUTH-012

- **ID:** FR-AUTH-012
- **Requirement:** WHEN a delegation is requested, THE Delegation_Engine SHALL admit it only IF the delegated `narrowedPowers` are a subset of the delegator's enumerated powers, the delegation scope is contained within the delegator's scope, the delegation graph remains acyclic, and the delegation depth does not exceed the configured `delegationMaxDepth`.
- **Rationale:** Delegation is narrowing-only, non-circular, and bounded so a delegated authority never exceeds its delegator (Correctness Property 5; §17 Delegation overflow row).
- **Source Design Section:** §4 Registry Schema (`AuthorityDelegationRecord`, narrowing/containment rules); §7 API Model (`delegateAuthority`); §10 Correctness Property 5; §17 Error Handling (Delegation overflow row).
- **Verification Method:** property-based test (narrowing subset, acyclic, bounded depth) + adversarial test (delegation cycle, depth overflow).

---

### Scope Manager

#### FR-AUTH-013

- **ID:** FR-AUTH-013
- **Requirement:** WHEN a scope is registered or narrowed, THE Scope_Manager SHALL enforce that every scope is namespace-isolated and containment-checked, such that a child scope is fully contained within its parent scope and local scopes shadow foreign scopes.
- **Rationale:** Scope containment and namespace isolation (local-shadows-foreign) bound where enumerated powers are valid and prevent scope escape (`S-A8`; `AuthorityScopeRecord`; §17 Scope escape row).
- **Source Design Section:** §4 Registry Schema (`AuthorityScopeRecord`, containment/namespace); §7 API Model (`registerScope`, `narrowScope`); §3 Domain Model (C6).
- **Verification Method:** property-based test (containment predicate; namespace isolation) + adversarial test (scope escape).

---

### Approval Manager & Separation of Duties

#### FR-AUTH-014

- **ID:** FR-AUTH-014
- **Requirement:** WHEN an authority change requires ratification, THE Approval_Manager SHALL evaluate the change against a Separation-of-Duties constraint (proposer ≠ certifier ≠ ratifier ≠ revoker) and a quorum at least equal to the configured `quorumFloor`, and IF the quorum is not met THEN THE Approval_Manager SHALL return a `Pending("quorum-not-met")` outcome.
- **Rationale:** Ratification is SoD- and quorum-gated so no single authority can unilaterally effect an authority change (`S-A2`, `S-A3`; Correctness Property 6; §17 Quorum-not-met row).
- **Source Design Section:** §7 API Model (`requestApproval`); §7.2 Grant API (SoD + quorum asserts); §8 Governance Model (Separation of duties, Ratification rows); §10 Correctness Property 6.
- **Verification Method:** policy test (SoD role distinctness; quorum floor) + adversarial test (SoD collusion, quorum evasion).

---

### Revocation & Emergency Halt

#### FR-AUTH-015

- **ID:** FR-AUTH-015
- **Requirement:** WHEN a revocation is committed, THE Revocation_Authority SHALL make the revocation forward-only and SHALL propagate it transitively to all delegations derived from the revoked authority, such that a revoked authority is denied at every subsequent decision point and is never re-activated except by an explicit, Board-approved new grant with a new identifier.
- **Rationale:** Revocation supremacy is forward-only, propagates transitively, and always wins over any grant or decision (Correctness Property 4; §6.2 revocation payload; §8 revocation supremacy row).
- **Source Design Section:** §6.2 Revocation supremacy event (`RevocationPayload`); §6.3 Projection (`markRevokedTransitive`); §7 API Model (`revokeAuthority`); §10 Correctness Property 4.
- **Verification Method:** property-based test (revoked ⇒ always denied; transitive propagation) + adversarial test (revocation bypass).

#### FR-AUTH-016

- **ID:** FR-AUTH-016
- **Requirement:** WHEN an emergency halt is active for a scope, THE Emergency_Halt SHALL non-bypassably reject all authority activity within that scope, and WHEN a resume is requested THE Emergency_Halt SHALL require the resume to be authorized by an authority distinct from the halting authority.
- **Rationale:** Emergency halt is a non-bypassable deny-all freeze resumed only under Separation of Duties (`AA-8`; §8 Emergency halt row; §16 Emergency control).
- **Source Design Section:** §7 API Model (`emergencyHalt`, `resume`); §8 Governance Model (Emergency halt row); §16 Operational Model (Emergency control); §17 Error Handling (Revoked/halted actor row).
- **Verification Method:** adversarial test (halt bypass) + policy test (distinct resume authority).

---

### Event Sourcing

#### FR-AUTH-017

- **ID:** FR-AUTH-017
- **Requirement:** WHEN any authority state change occurs, THE Authority_Event_Store SHALL append a corresponding `AuthorityEvent` to an append-only stream with a strictly increasing per-stream `sequence` and a hash chain where `hash = H(prevHash || canonical(payload))`.
- **Rationale:** Event sourcing with a tamper-evident hash chain is the authoritative record of all authority state changes (`S-A7`; `IP-10`; S6; Correctness Property 10).
- **Source Design Section:** §6.1 Canonical event vocabulary (`AuthorityEvent`, `EnumAuthEventType`); §10 Correctness Property 10.
- **Verification Method:** property-based test (monotonic sequence + hash-chain integrity) + adversarial test (audit-chain tampering).

#### FR-AUTH-018

- **ID:** FR-AUTH-018
- **Requirement:** THE Authority_Event_Store SHALL treat the event stream, not any derived projection, as the authoritative record of authority state, and SHALL evolve event types additively and version-tagged such that older events remain replayable via deterministic upcasters and no event is deleted or rewritten.
- **Rationale:** The stream is authoritative and event evolution is additive/versioned so historical events are never deleted or rewritten (`AUTH-009` §6.6 append-only; §14 event stream evolution).
- **Source Design Section:** §6 Event Model (stream-authoritative statement); §14 Migration Strategy (Event stream evolution).
- **Verification Method:** replay test (old events replayable via upcasters) + review (additive event versioning).

---

### Projection & Replay

#### FR-AUTH-019

- **ID:** FR-AUTH-019
- **Requirement:** WHEN reconstructing authority state, THE Authority_Fabric SHALL derive it deterministically by ordered replay of the event stream, asserting hash-chain integrity and the single-owner, enumerated-power, scope-containment, single-apex, and revocation-supremacy invariants at each event, such that replaying the same stream always yields identical authority state.
- **Rationale:** Authority state is a projection replayed deterministically; any hash or invariant breach must halt replay fail-closed (`INV-6`; §6.3 projection contract; Correctness Properties 4, 7).
- **Source Design Section:** §6.3 Projection (`FUNCTION projectAuthorityState`, preconditions/postconditions/loop invariant); §10 Correctness Properties 4, 7.
- **Verification Method:** property-based test (deterministic replay; invariants at every prefix) + replay test.

#### FR-AUTH-020

- **ID:** FR-AUTH-020
- **Requirement:** WHEN an authority-state or power query is received, THE Authority_Fabric SHALL return the authority view (`getAuthority`, `listPowers`) as a read-only projection derived from the event stream without mutating any authority state.
- **Rationale:** Authority queries are read-only projections; queries must not have side effects (§7 API Model; §16 observability read-models).
- **Source Design Section:** §7 API Model (`getAuthority`, `listPowers` read-only projections); §16 Operational Model (queryable read-models).
- **Verification Method:** integration test (read-only, no state change) + review.

---

### Commit Authority

#### FR-AUTH-021

- **ID:** FR-AUTH-021
- **Requirement:** THE Authority_Fabric SHALL commit every authority-state change and every registry registration exclusively through the PI-6 Evolution_Fabric, and SHALL possess no independent authority write, edit, or rollback path.
- **Rationale:** PI-6 is the sole authority-commit path; no independent write/rollback path may exist (`S-A5`; Correctness Property 8).
- **Source Design Section:** §7.2 Grant API (Evolution commit); §4 Registry Schema (`admitAuthority` via `Evolution.commit`); §8 Governance Model (Evolution-only commit row); §10 Correctness Property 8.
- **Verification Method:** integration test (commit routed through Evolution Fabric) + review (no alternate write path).

---

### Type Declaration

#### FR-AUTH-022

- **ID:** FR-AUTH-022
- **Requirement:** WHEN an archetype declaration is requested, THE Authority_Type_Registry SHALL admit the new `AuthorityTypeRecord` only through an Authority Board declaration with quorum ratification, and SHALL NOT allow any non-Board authority to declare or modify an archetype.
- **Rationale:** Declaring an archetype is a Board-only, Approval-Required act; the fixed archetype set may not be extended by any fabric (§8.1 decision-rights; §13 Approval-Required acts).
- **Source Design Section:** §7 API Model (`declareAuthorityType` — Board only); §8.1 Decision-rights (Declare archetype row); §13 Implementation Phases (Approval-Required acts).
- **Verification Method:** policy test (Board-only archetype declaration) + adversarial test (non-Board archetype declaration rejected).

---

### Federation

#### FR-AUTH-023

- **ID:** FR-AUTH-023
- **Requirement:** WHERE a foreign (federated) authority is presented, THE Authority_Fabric SHALL treat it as advisory-only, deny-only, and trust-clamped, with foreign authority namespace-isolated and shadowed by local authority, and SHALL NOT perform any cross-node authority auto-grant, failing closed on federation partition.
- **Rationale:** Foreign authority is advisory/deny-only, trust-clamped, namespace-isolated, local-shadows-foreign, with no cross-node auto-grant and partition-safe fail-closed behavior (`S-A8`; §16 Federation).
- **Source Design Section:** §16 Operational Model (Federation row); §8 Governance Model (Federation row); §5 Configuration Model (`federationMode = advisory-only` floor).
- **Verification Method:** integration test (federation advisory/deny-only) + adversarial test (cross-node foreign-authority auto-grant blocked).

---

### Extensibility & Register-Then-Retire

#### FR-AUTH-024

- **ID:** FR-AUTH-024
- **Requirement:** THE Authority_Fabric SHALL admit every governed fabric's governance solely through registration of `authority:*` archetype instances via register-then-retire, such that a new consuming fabric requires no CAP-AUTHORITY core change and the superseded bespoke authority model text is linked and preserved rather than deleted.
- **Rationale:** Forward consumers re-express governance as registered instances (`INV-13`, `UAF-C4`), and superseded model text is superseded/linked, never deleted (`AUTH-009` §6.6).
- **Source Design Section:** §9 Dependency Graph (forward consumers, register-then-retire); §14 Migration Strategy (Model collapse via register-then-retire); §3 Domain Model.
- **Verification Method:** integration test (consumer governance admitted via instance registration, zero core change) + review (superseded model linked, not deleted).

---

### Non-Inversion

#### FR-AUTH-025

- **ID:** FR-AUTH-025
- **Requirement:** THE Authority_Fabric SHALL enforce the `PCAMG-0008` non-inversion guarantees such that no lower-layer authority can grant itself or hold authority over a higher layer, and SHALL preserve the singular Authority Board apex (`AA-0`) unchanged and non-instantiable per fabric.
- **Rationale:** Non-inversion (`G-1..G-5`) and single-apex preservation (`UAF-C3`) prevent authority escalation across the hierarchy (Correctness Properties 1, 11).
- **Source Design Section:** §2.4 Layer placement (non-inversion); §8 Governance Model (Non-inversion, Apex rows); §10 Correctness Properties 1, 11.
- **Verification Method:** property-based test (no cross-layer inversion; no `AA-0` instance) + adversarial test (apex forgery, layer inversion).


---

## Non-Functional Requirements

> Scope note: This section contains the **Non-Functional Requirements only** (NFR-AUTH-001 through
> NFR-AUTH-020), one per quality attribute. Each requirement is derived from and traceable to the
> completed authoritative `design.md` and is consistent with the UCOS canon (`AUTH-001..012`,
> `UCOS-CONST-001`, `IP-*`, `INV-*`, `S-A1..S-A10`, S1/S3/S4/S6, `AD-0009`, PI-4, PI-6). Where the
> design defers quantitative targets (RPO/RTO/latency per §16 / OI-4), the requirement is stated
> qualitatively and the quantitative target is marked **PENDING ASR RATIFICATION** rather than
> inventing a value.

---

### Determinism

#### NFR-AUTH-001

- **ID:** NFR-AUTH-001
- **Requirement:** THE Authority_Fabric SHALL execute all decision, policy-evaluation, and state-projection logic as pure, side-effect-free functions of recorded inputs such that identical inputs and identical event streams always produce identical outputs and identical `resultHash` values across runs and hosts.
- **Rationale:** Determinism (`INV-6`, `S-A?` determinism) is a load-bearing safety property enabling reproducible replay, verifiable decisions, and tamper-evident reconstruction.
- **Source Design Section:** §6.3 Projection (`FUNCTION projectAuthorityState`); §7.1 Decision API (step 3 determinism gate); §16 Operational Model (determinism guarantee); §10 Correctness Property 7.
- **Verification Method:** property-based test (identical inputs ⇒ identical `resultHash`; stable replay across runs) + replay test.

---

### Performance

#### NFR-AUTH-002

- **ID:** NFR-AUTH-002
- **Requirement:** THE Authority_Fabric SHALL evaluate an authority decision (revocation/halt supremacy, policy, enumerated-power, scope-containment, and determinism gates) within a bounded latency budget, and the quantitative per-operation latency target SHALL be **PENDING ASR RATIFICATION**.
- **Rationale:** Bounded decision-path latency is required for a usable substrate, but the numeric target is deferred to ASR ratification and must not be invented (§16; OI-4).
- **Source Design Section:** §7.1 Decision API (gate sequence); §16 Operational Model; §19 Open Items (OI-4 ASR/NFR quantitative values).
- **Verification Method:** performance test against the ratified latency budget once ASR values are ratified; until then, review of bounded, non-unbounded gate implementation.

---

### Scalability

#### NFR-AUTH-003

- **ID:** NFR-AUTH-003
- **Requirement:** THE Authority_Fabric SHALL scale to increasing numbers of authorities, scopes, delegations, and events by relying on append-only per-stream event partitioning and derived read-model projections, and the quantitative throughput and volume targets SHALL be **PENDING ASR RATIFICATION**.
- **Rationale:** Per-stream append-only partitioning and projection-based read-models provide the scalability model; concrete throughput/volume ceilings are deferred to ASR ratification (§6; §16; OI-4).
- **Source Design Section:** §6 Event Model (per-stream sequence, projections); §16 Operational Model (queryable read-models); §19 Open Items (OI-4).
- **Verification Method:** load test against ratified scalability targets once ASR values are ratified; until then, review of per-stream partitioning and projection design.

---

### Availability

#### NFR-AUTH-004

- **ID:** NFR-AUTH-004
- **Requirement:** WHILE the PI-5 Federation dependency is unavailable or partitioned, THE Authority_Fabric SHALL remain available for its core governed loop by degrading fail-closed rather than failing open, and the quantitative availability/uptime target SHALL be **PENDING ASR RATIFICATION**.
- **Rationale:** Core availability must not fail open under federation partition; the numeric availability target is deferred to ASR ratification (§16 Federation; OI-4).
- **Source Design Section:** §16 Operational Model (Federation fail-closed on partition); §9 Dependency Graph; §19 Open Items (OI-4).
- **Verification Method:** integration test (core loop available and fail-closed under federation partition) + availability measurement against ratified target once ASR values are ratified.

---

### Reliability

#### NFR-AUTH-005

- **ID:** NFR-AUTH-005
- **Requirement:** IF any revocation/halt, policy, enumerated-power, scope-containment, delegation-bound, determinism, SoD/quorum, or chain-integrity check fails, THEN THE Authority_Fabric SHALL fail closed with no authority-state change and SHALL NOT silently drop the failed action.
- **Rationale:** Fail-closed reliability guarantees that every failure leaves authority state unchanged and recorded, never silently lost (§16 failure handling; §17 Error Handling; Correctness Properties 3, 4).
- **Source Design Section:** §16 Operational Model (Failure handling row); §17 Error Handling (all rows); §7.1 Decision API (fail-closed branches).
- **Verification Method:** property-based test (any gate failure ⇒ no state change + recorded denial) + adversarial test.

---

### Recoverability

#### NFR-AUTH-006

- **ID:** NFR-AUTH-006
- **Requirement:** THE Authority_Fabric SHALL recover authority state by deterministic ordered replay of the authoritative event stream and SHALL correct errors only via governed compensating events, and the quantitative RPO and RTO targets SHALL be **PENDING ASR RATIFICATION** (inheriting the `UCOS-ASR-NFR-001` floors).
- **Rationale:** Recovery is by deterministic replay with reversible compensating events; RPO/RTO floors inherit from `UCOS-ASR-NFR-001` with values deferred to ASR ratification (§16 Recovery; OI-4).
- **Source Design Section:** §16 Operational Model (Recovery row); §6.3 Projection; §14 Migration Strategy (Rollback); §19 Open Items (OI-4).
- **Verification Method:** replay test (state recovery from event stream) + integration test (compensating-event correction); RPO/RTO validated once ASR values are ratified.

---

### Auditability

#### NFR-AUTH-007

- **ID:** NFR-AUTH-007
- **Requirement:** THE Authority_Fabric SHALL record every authority state change and every decision as a classified, hash-chained, append-only audit event carrying full provenance, such that the trail is independently and offline verifiable.
- **Rationale:** Auditability requires tamper-evident, append-only, offline-verifiable provenance for every state change and decision (S6; `S-A7`; `AUTH-009` §6.6; Correctness Property 10).
- **Source Design Section:** §6 Event Model (hash-chained events); §16 Operational Model (Auditability row); §18 Security Considerations (S6); §10 Correctness Property 10.
- **Verification Method:** property-based test (chain integrity) + replay test (offline audit replay proof) + adversarial test (audit evasion).

---

### Observability

#### NFR-AUTH-008

- **ID:** NFR-AUTH-008
- **Requirement:** THE Authority_Fabric SHALL expose queryable read-models for authority-state projections and decision deny-rates and SHALL emit every authority event as a structured, classified, hash-chained record suitable for observability consumption.
- **Rationale:** Observability requires structured, classified events plus queryable authority-state and deny-rate read-models (§16 observability).
- **Source Design Section:** §16 Operational Model (Observability row); §7 API Model (`getAuthority` read-model); §6.1 Canonical event vocabulary.
- **Verification Method:** integration test (read-model queries) + review (event structure/classification/hash-chaining).

---

### Security

#### NFR-AUTH-009

- **ID:** NFR-AUTH-009
- **Requirement:** THE Authority_Fabric SHALL enforce the non-waivable security floors S1 (authenticated actors, deny-by-default authorization via PI-4), S3 (signing keys referenced, never embedded; reuse of PI-5 Ed25519 assertions), and S4 (inherited, monotonic classification on records, projections, and exports).
- **Rationale:** S1/S3/S4 are non-waivable canon floors that bound the blast radius of a compromised proposer to rejected proposals plus audit noise (`AUTH-008`; §18 Security Considerations).
- **Source Design Section:** §18 Security Considerations (S1/S3/S4, blast radius, non-waivable); §7.1 Decision API (authenticated-actor precondition); §4 Registry Schema (classification, `keyRef` by reference).
- **Verification Method:** security conformance test (`EV-SEC`, S1/S3/S4) + adversarial test (self-grant, classification bypass) + review (keys by reference).

---

### Registry-Driven Configuration

#### NFR-AUTH-010

- **ID:** NFR-AUTH-010
- **Requirement:** THE Authority_Fabric SHALL resolve every authorization rule, power vocabulary, scope, policy, and archetype from registry and configuration records and SHALL NOT embed any authorization rule, role, power, or archetype in compiled code.
- **Rationale:** Configuration-driven and policy-driven design (`IP-04`, `IP-05`; registry rule 4) requires all authority behavior to originate from registry/config records, not code.
- **Source Design Section:** §4 Registry Schema (policy/rule records, registry rule 4); §5 Configuration Model; §2.1 Architectural stance.
- **Verification Method:** review (no hardcoded rule/role/power/archetype) + integration test (behavior changes via registry/config only).

---

### Platform Independence

#### NFR-AUTH-011

- **ID:** NFR-AUTH-011
- **Requirement:** THE Authority_Fabric specification and design SHALL select no technology, cloud, datastore, language, framework, runtime, broker, or vendor, and SHALL express all behavior in technology-neutral structured pseudocode.
- **Rationale:** Platform independence (`PEP-010`; `AUTH-004` §6.5) mandates a technology-neutral architecture artifact that binds no vendor or runtime.
- **Source Design Section:** Governing discipline preamble; §2.4 Layer placement and boundaries; header notation (`pascal`, technology-neutral per `PEP-010`).
- **Verification Method:** review (zero technology/vendor selection; structured-pseudocode notation only).

---

### Extensibility

#### NFR-AUTH-012

- **ID:** NFR-AUTH-012
- **Requirement:** WHERE a new consuming fabric or governance model is introduced, THE Authority_Fabric SHALL admit it through registration of `authority:*` archetype instances (register-then-retire) without requiring any modification to CAP-AUTHORITY core code.
- **Rationale:** Infinite extensibility (`INV-13`, `UAF-C4`) requires extension by instance registration rather than core change (§9 forward consumers).
- **Source Design Section:** §9 Dependency Graph (forward consumers); §14 Migration Strategy (register-then-retire); §10 Correctness Property 12.
- **Verification Method:** integration test (new fabric governance admitted with zero core-dir change) + review.

---

### Configurability

#### NFR-AUTH-013

- **ID:** NFR-AUTH-013
- **Requirement:** THE Authority_Fabric SHALL resolve behavior through hierarchical configuration with precedence `default → fabric-profile → environment → instance` (deep-merge), and IF a resolved configuration attempts to relax a non-waivable floor (`denyByDefault = TRUE`, `revocationSupremacy = TRUE`, `singleApex = TRUE`, `externalActuationGate = AD-0009`, `federationMode = advisory-only`, `evolutionOnlyCommit = TRUE`), THEN THE Authority_Fabric SHALL reject the configuration as a governance violation.
- **Rationale:** Configurability must allow tightening but never relaxation of non-waivable floors (`IP-04`; `S-A5`, `S-A6`, `UAF-C3`; §5 configuration floors).
- **Source Design Section:** §5 Configuration Model (`AuthorityConfig`, configuration floors, `FUNCTION resolveConfig`).
- **Verification Method:** property-based test (floor relaxation rejected) + integration test (precedence deep-merge).

---

### Data Integrity

#### NFR-AUTH-014

- **ID:** NFR-AUTH-014
- **Requirement:** THE Authority_Fabric SHALL preserve data integrity by guaranteeing the single-owner, enumerated-power-containment, scope-containment, single-apex, and revocation-supremacy invariants on every record and at every replay point.
- **Rationale:** Single-owner, enumerated-power, scope-containment, single-apex, and revocation-supremacy are the load-bearing integrity invariants of the authority ledger (Correctness Properties 1, 2, 4; §6.3 invariant asserts).
- **Source Design Section:** §6.3 Projection (`invariantsHold` asserts); §4 Registry Schema (registry rules 1, 5, 6); §10 Correctness Properties 1, 2, 4.
- **Verification Method:** property-based test (invariants at every prefix) + adversarial test (power widening, scope escape, apex forgery).

---

### Event Consistency

#### NFR-AUTH-015

- **ID:** NFR-AUTH-015
- **Requirement:** THE Authority_Fabric SHALL maintain event consistency by appending every authority event with a strictly increasing per-stream `sequence` and a verifiable hash chain `hash = H(prevHash || canonical(payload))`, and IF a sequence gap or hash mismatch is detected on replay THEN THE Authority_Fabric SHALL halt replay fail-closed.
- **Rationale:** Strictly ordered, hash-chained events guarantee a consistent, tamper-evident stream that self-halts on inconsistency (`S-A7`; `AUTH-009` §6.6; §6.3 chain-integrity asserts).
- **Source Design Section:** §6.1 Canonical event vocabulary (`AuthorityEvent`); §6.3 Projection (chain-integrity asserts); §17 Error Handling (Chain break row).
- **Verification Method:** property-based test (monotonic sequence + chain integrity) + adversarial test (chain tamper).

---

### Replayability

#### NFR-AUTH-016

- **ID:** NFR-AUTH-016
- **Requirement:** THE Authority_Fabric SHALL guarantee that the authoritative event stream is fully replayable such that ordered replay reproduces identical authority state, and SHALL evolve event types additively and version-tagged with deterministic upcasters so historical events remain replayable and are never deleted or rewritten.
- **Rationale:** Replayability requires additive, version-tagged, deterministically upcastable events and a stream-authoritative model that reproduces state exactly (`INV-6`; §14 event stream evolution; `AUTH-009` §6.6).
- **Source Design Section:** §6 Event Model (stream-authoritative); §6.3 Projection; §14 Migration Strategy (event stream evolution).
- **Verification Method:** replay test (identical state on re-replay; old events replayable via upcasters) + review (additive versioning).

---

### Traceability

#### NFR-AUTH-017

- **ID:** NFR-AUTH-017
- **Requirement:** THE Authority_Fabric SHALL maintain full, orphan-free lineage from capability through constructs, contracts, events, and tests such that every governed action is traceable to its authorizing design section and canon anchor.
- **Rationale:** Traceability (`AUTH-010`, `S-A10`) requires complete lineage with zero orphans as design-class evidence (`EV-TRACE`; §11 Evidence).
- **Source Design Section:** §0 Traceability Anchors; §11 Evidence Requirements (`EV-TRACE`); §20 Traceability Links.
- **Verification Method:** traceability matrix review (0 orphans) + design-evidence audit.

---

### Governance Compliance

#### NFR-AUTH-018

- **ID:** NFR-AUTH-018
- **Requirement:** THE Authority_Fabric SHALL remain subordinate to `AUTH-001..012` and `UCOS-CONST-001` such that no authority behavior contradicts, amends, supersedes, merges, or deletes a ratified authority, constitutional article, principle, or invariant.
- **Rationale:** Governance compliance requires structural subordination to the authority corpus and constitution, composing over it without amendment (`AUTH-009` §6.6, `G-2`; `UCOS-CONST-001` Art. IX/XI/XII; §8 Governance Model).
- **Source Design Section:** §8 Governance Model (Constitutional compliance); §0 Traceability Anchors; Governing discipline preamble.
- **Verification Method:** governance conformance review against `AUTH-001..012` and `UCOS-CONST-001` (zero amendment).

---

### Operational Resilience

#### NFR-AUTH-019

- **ID:** NFR-AUTH-019
- **Requirement:** WHEN a fault, partition, or emergency condition occurs, THE Authority_Fabric SHALL respond fail-closed by denying affected activity with no state change, SHALL support a non-bypassable emergency halt that freezes scoped authority activity to deny-all, and SHALL fail closed on federation partition.
- **Rationale:** Operational resilience requires fail-closed fault handling, a non-bypassable emergency halt, and partition-safe federation (`AA-8`; §16 failure handling, emergency control, federation).
- **Source Design Section:** §16 Operational Model (Failure handling, Emergency control, Federation rows); §7.1 Decision API (halt guard); §17 Error Handling (Revoked/halted actor row).
- **Verification Method:** adversarial test (halt bypass, partition) + integration test (fail-closed under fault).

---

### Future Capability Compatibility

#### NFR-AUTH-020

- **ID:** NFR-AUTH-020
- **Requirement:** THE Authority_Fabric SHALL remain forward-compatible with every governed fabric (Platform, Data, Federation, Evolution, Knowledge, Ontology, Memory, Intelligence, Simulation, Economic, Autonomy, Civilization, Governance) by exposing versioned contracts and registry-based archetype instances such that consumers register their governance without any CAP-AUTHORITY core change, and additive construction SHALL preserve the existing baseline with zero regressions.
- **Rationale:** Future capability compatibility requires additive, versioned, registry-based extension preserving the baseline (`INV-13`; `IP-15`; `UAF-C2`; Correctness Property 12; §9 forward consumers).
- **Source Design Section:** §9 Dependency Graph (forward consumers); §14 Migration Strategy (Backward compatibility, register-then-retire); §10 Correctness Property 12; §2.4 Additivity.
- **Verification Method:** integration test (consumer registration without core change; baseline green) + review (versioned contracts).


---

## Governance Requirements

> Scope note: This section contains the **Governance Requirements only** (GR-AUTH-001 through
> GR-AUTH-020), one per governance topic. Each requirement is derived from and traceable to the
> completed authoritative `design.md` and is consistent with the UCOS canon (`AUTH-001..012`,
> `UCOS-CONST-001`, `IP-*`, `INV-*`, `S-A1..S-A10`, S1/S3/S4/S6, `AD-0009`, PI-4, PI-6, `PCAMG-0008`
> G-1..G-5).

---

### Constitutional Compliance

#### GR-AUTH-001

- **ID:** GR-AUTH-001
- **Requirement:** THE Authority_Fabric SHALL NOT begin construction of the `src/control/authority/*` subtree until a scoped Article IX generation-lock release act is recorded, and SHALL at all times operate subordinate to `UCOS-CONST-001` Article IX (generation lock), Article XI (immutability), and Article XII (approval-by-exception).
- **Rationale:** Constitutional compliance requires the Article IX generation lock to be released for a scoped subtree before construction, and approval-by-exception under Article XII (§8 Governance Model; OI-1).
- **Source Design Section:** §8 Governance Model (Constitutional compliance); §12 Completion Criteria (item 10); §13 Implementation Phases (Approval-Required acts); §19 Open Items (OI-1).
- **Verification Method:** governance review (scoped Article IX release act recorded in `AUTH-012` before construction).

---

### Registry Sovereignty

#### GR-AUTH-002

- **ID:** GR-AUTH-002
- **Requirement:** THE Authority_Registry SHALL be the single authoritative source of truth for all authority state, and THE Authority_Fabric SHALL NOT cache authority state at runtime without a corresponding invalidation event.
- **Rationale:** Registry sovereignty requires a single source of truth and forbids stale uninvalidated caches (registry rule 8; `UAF-C4`).
- **Source Design Section:** §4 Registry Schema (registry rules 1–8); §2.1 Architectural stance; §3 Domain Model.
- **Verification Method:** review (no uninvalidated authority cache) + integration test (registry as sole source of truth).

---

### PI-4 Policy Evaluation

#### GR-AUTH-003

- **ID:** GR-AUTH-003
- **Requirement:** WHEN any governed authority action is requested, THE Authority_Fabric SHALL obtain an explicit authorization decision from the PI-4 Control_Plane policy evaluator before applying any enumerated-power or scope-containment check or committing any effect.
- **Rationale:** PI-4 policy evaluation is the mandatory deny-by-default authorization stage preceding constraint checking and commit (`S-A6`; §7.1 step 1).
- **Source Design Section:** §7.1 Decision API (step 1 policy check); §8 Governance Model (deny-by-default); §9 Dependency Graph (PI-4 hard dependency).
- **Verification Method:** policy test (authorization invoked on every governed path) + integration test against PI-4.

---

### PI-6 Commit Authority

#### GR-AUTH-004

- **ID:** GR-AUTH-004
- **Requirement:** THE Authority_Fabric SHALL commit every authority-state mutation and every registry registration exclusively through the PI-6 Evolution_Fabric and SHALL possess no independent authority write, edit, or rollback path.
- **Rationale:** PI-6 is the sole authority-commit path; no independent write/rollback path may exist (`S-A5`; Correctness Property 8).
- **Source Design Section:** §7.2 Grant API (Evolution commit); §4 Registry Schema (`admitAuthority` via `Evolution.commit`); §8 Governance Model (Evolution-only commit); §10 Correctness Property 8.
- **Verification Method:** integration test (commit routed through Evolution Fabric) + review (no alternate write path).

---

### AD-0009 External Actuation Controls

#### GR-AUTH-005

- **ID:** GR-AUTH-005
- **Requirement:** IF an authority action would actuate a real-world (external) authority change, THEN THE Authority_Fabric SHALL return a `Pending("AD-0009 approval required")` outcome and SHALL NOT commit autonomously.
- **Rationale:** External authority actuation is `AD-0009` Approval-Required and never autonomous (Correctness Property 9; §7.1 step 4).
- **Source Design Section:** §7.1 Decision API (step 4 external actuation gate); §8 Governance Model (No external actuation); §10 Correctness Property 9; §17 Error Handling (External actuation row).
- **Verification Method:** integration test (`AD-0009` pending path) + adversarial test (autonomous external actuation blocked).

---

### Deny-by-Default Governance

#### GR-AUTH-006

- **ID:** GR-AUTH-006
- **Requirement:** THE Authority_Fabric SHALL deny every grant, delegation, decision, approval, scope, and revocation action by default and SHALL permit it only when an explicit policy ALLOW decision is returned and all enumerated-power, scope-containment, and supremacy checks pass.
- **Rationale:** Deny-by-default (`S-A6`) requires rejection absent an explicit ALLOW and passing constraints (Correctness Property 3; §5 non-waivable `denyByDefault` floor).
- **Source Design Section:** §8 Governance Model (Deny-by-default row); §5 Configuration Model (`denyByDefault = TRUE` floor); §10 Correctness Property 3.
- **Verification Method:** property-based test (no explicit ALLOW ⇒ DENY) + adversarial test.

---

### Propose-Not-Act Principle

#### GR-AUTH-007

- **ID:** GR-AUTH-007
- **Requirement:** THE Authority_Fabric SHALL expose only propose-not-act operations such that no API path mutates authority state except through a PI-6 Evolution_Fabric commit.
- **Rationale:** Propose-not-act requires that every authority-state change originate from the Evolution Fabric and never from a direct API mutation (Correctness Property 8; §7 API Model).
- **Source Design Section:** §7 API Model (propose-only contract); §2.3 Governed authority loop; §10 Correctness Property 8.
- **Verification Method:** property-based test (no state mutation outside Evolution commit) + review of API surface.

---

### Single Apex Preservation

#### GR-AUTH-008

- **ID:** GR-AUTH-008
- **Requirement:** THE Authority_Fabric SHALL preserve the singular Authority Board apex (`AA-0`) unchanged, non-instantiable per fabric, and SHALL reject any attempt to admit an `AA-0` apex instance or to instantiate a competing apex.
- **Rationale:** The apex is a preserved singleton; no fabric may forge a competing apex (`UAF-C3`, `S-A4`; Correctness Property 1).
- **Source Design Section:** §8 Governance Model (Apex row); §4 Registry Schema (registry rule 5); §1 Capability Purpose (non-goals); §10 Correctness Property 1.
- **Verification Method:** property-based test (no `AA-0` instance) + adversarial test (apex forgery).

---

### Revocation Supremacy

#### GR-AUTH-009

- **ID:** GR-AUTH-009
- **Requirement:** THE Authority_Fabric SHALL enforce revocation supremacy such that a revocation is forward-only, propagates transitively to derived delegations, and always wins over any grant or decision, and SHALL require no counter-authorization to effect a revocation.
- **Rationale:** Revocation supremacy guarantees a revoked authority can never be exercised, without counter-authorization (Correctness Property 4; §8.1 decision-rights Revoke row).
- **Source Design Section:** §8 Governance Model (Revocation supremacy row); §8.1 Decision-rights (Revoke row); §6.2 Revocation payload; §10 Correctness Property 4.
- **Verification Method:** property-based test (revoked ⇒ always denied; transitive) + adversarial test (revocation bypass).

---

### Separation of Duties & Quorum

#### GR-AUTH-010

- **ID:** GR-AUTH-010
- **Requirement:** THE Authority_Fabric SHALL enforce separation of duties such that for any authority change the roles of proposer, certifier, ratifier, and revoker are held by distinct authorities and the halt-invoker is distinct from the resume-authority, and SHALL require a ratification quorum at least equal to the configured `quorumFloor`.
- **Rationale:** Separation of duties and quorum (`S-A2`, `S-A3`) prevent authority concentration and unilateral escalation across the authority loop (Correctness Property 6; §8.1 decision-rights).
- **Source Design Section:** §8 Governance Model (Separation of duties, Ratification rows); §8.1 Decision-rights; §7.2 Grant API (SoD + quorum asserts); §10 Correctness Property 6.
- **Verification Method:** policy test (role distinctness; quorum floor; distinct resume) + adversarial test (SoD collusion, quorum evasion).

---

### Narrowing-Only Delegation

#### GR-AUTH-011

- **ID:** GR-AUTH-011
- **Requirement:** THE Authority_Fabric SHALL enforce that every delegation is narrowing-only, non-circular, and bounded such that a delegated authority's powers and scope never exceed those of its delegator and the delegation chain remains acyclic within `delegationMaxDepth`.
- **Rationale:** Narrowing-only, acyclic, bounded delegation prevents privilege escalation through re-grant (Correctness Property 5; §17 Delegation overflow row).
- **Source Design Section:** §4 Registry Schema (`AuthorityDelegationRecord`); §7 API Model (`delegateAuthority`); §10 Correctness Property 5; §17 Error Handling (Delegation overflow row).
- **Verification Method:** property-based test (narrowing subset, acyclic, bounded) + adversarial test (delegation cycle, depth overflow).

---

### Non-Inversion Guarantee

#### GR-AUTH-012

- **ID:** GR-AUTH-012
- **Requirement:** THE Authority_Fabric SHALL uphold the `PCAMG-0008` non-inversion guarantees (`G-1..G-5`) such that no lower-layer authority grants itself or holds authority over a higher layer, and every folded construct maps to exactly one archetype with equal or stricter powers.
- **Rationale:** Non-inversion and fold-map preservation prevent a lower layer from inverting a higher one and prevent power widening during model collapse (`G-1`; Correctness Property 11; §14 Fold-map preservation).
- **Source Design Section:** §2.4 Layer placement (non-inversion `G-1..G-5`); §8 Governance Model (Non-inversion row); §14 Migration Strategy (Fold-map preservation); §10 Correctness Property 11.
- **Verification Method:** property-based test (no cross-layer inversion; fold-map equal-or-stricter) + adversarial test (layer inversion).

---

### Deterministic Governance

#### GR-AUTH-013

- **ID:** GR-AUTH-013
- **Requirement:** THE Authority_Fabric SHALL evaluate all governance gates (revocation/halt supremacy, policy authorization, enumerated-power, scope-containment, delegation-bound, determinism) as deterministic functions of recorded inputs such that the same inputs always yield the same governance verdict.
- **Rationale:** Deterministic governance (`INV-6`) ensures reproducible, auditable governance decisions across runs and hosts (Correctness Property 7).
- **Source Design Section:** §7.1 Decision API (gate sequence); §8 Governance Model (Determinism row); §10 Correctness Property 7.
- **Verification Method:** property-based test (identical inputs ⇒ identical verdict) + replay test.

---

### Authority Rule Registration

#### GR-AUTH-014

- **ID:** GR-AUTH-014
- **Requirement:** THE Authority_Fabric SHALL require every authorization rule, policy, power vocabulary, scope, and archetype to be registered as a governed registry/metadata record before it can influence any decision, and SHALL NOT honor any rule that is not a registered, resolvable record.
- **Rationale:** Configuration-/policy-driven governance (`IP-04`, `IP-05`; registry rule 4) requires all authorization rules to be registered records rather than code-embedded logic.
- **Source Design Section:** §4 Registry Schema (`AuthorityPolicyRecord`, registry rule 4); §5 Configuration Model; §2.1 Architectural stance.
- **Verification Method:** integration test (unregistered rule not honored) + review (no hardcoded rule).

---

### Governance Traceability

#### GR-AUTH-015

- **ID:** GR-AUTH-015
- **Requirement:** THE Authority_Fabric SHALL make every governed action traceable to its authorizing authority, policy decision, canon anchor, and audit event, maintaining orphan-free lineage per `AUTH-010` and `S-A10`.
- **Rationale:** Governance traceability requires end-to-end lineage of every governed action for auditability and closure evidence (`AUTH-010`, `S-A10`; `EV-TRACE`; §11).
- **Source Design Section:** §0 Traceability Anchors; §11 Evidence Requirements (`EV-TRACE`); §20 Traceability Links; §8 Governance Model.
- **Verification Method:** traceability matrix review (governed action → authority/policy/canon/audit; 0 orphans).

---

### Versioning & Migration-Only Evolution

#### GR-AUTH-016

- **ID:** GR-AUTH-016
- **Requirement:** THE Authority_Fabric SHALL version every archetype, instance, scope, policy schema, and exposed API contract, and IF a change is breaking THEN THE Authority_Fabric SHALL require a new major version plus a recorded reversible migration path rather than any destructive in-place edit.
- **Rationale:** Versioning and migration-only evolution (`IP-13`, `IP-14`, `IP-15`; `AUTH-007` §6.5) require breaking changes to be new versions with migration, never destructive edits.
- **Source Design Section:** §4 Registry Schema (registry rule 3, `version`/`SemVer`); §14 Migration Strategy (Schema/registry evolution, Backward compatibility); §7 API Model (`v1.0`).
- **Verification Method:** review (versioned schemas/contracts) + integration test (breaking change requires new version + migration).

---

### Approval Workflow

#### GR-AUTH-017

- **ID:** GR-AUTH-017
- **Requirement:** WHEN an Approval-Required act (archetype declaration, external authority actuation, or scoped Article IX release) is requested, THE Authority_Fabric SHALL route it to human/Board approval and SHALL NOT auto-execute it.
- **Rationale:** Approval-Required authority acts must be granted by a human/Board and never auto-executed (`AD-0009`; §13 Approval-Required acts; §8.1 decision-rights).
- **Source Design Section:** §13 Implementation Phases (Approval-Required acts); §8.1 Decision-rights; §7 API Model (`declareAuthorityType` Board declaration); §19 Open Items (OI-1, OI-2).
- **Verification Method:** integration test (Approval-Required act blocked pending Board approval) + review of decision-rights routing.

---

### Closure Evidence Production

#### GR-AUTH-018

- **ID:** GR-AUTH-018
- **Requirement:** THE Authority_Fabric SHALL produce the complete set of required closure evidence (`EV-DESIGN`, `EV-TRACE`, `EV-CODE-*`, `EV-SEC`, `EV-THREAT`, `EV-AUDIT`, `EV-ADDITIVE`, `EV-GOV`), and the absence of any required evidence item SHALL be treated as a FAIL.
- **Rationale:** Non-optimistic closure discipline requires all listed evidence present, with absence counting as failure (`OP-CERT-001`; §11 Evidence; §12 Completion Criteria).
- **Source Design Section:** §11 Evidence Requirements (full table; non-optimistic discipline); §12 Completion Criteria.
- **Verification Method:** closure-evidence audit (all `EV-*` present; missing ⇒ FAIL).

---

### Compliance Verification

#### GR-AUTH-019

- **ID:** GR-AUTH-019
- **Requirement:** THE Authority_Fabric SHALL demonstrate compliance by satisfying every completion criterion in §12 as a fail-closed conjunction, such that construction is complete only when all criteria hold, including the passing of the adversarial suite with 0 residual High/High.
- **Rationale:** Compliance verification requires the full completion-criteria conjunction, with any unmet criterion blocking closure (§12 Completion Criteria; `OP-CERT-001`).
- **Source Design Section:** §12 Completion Criteria (fail-closed conjunction); §11 Evidence Requirements; §10 Correctness Properties; §15.3 Adversarial testing.
- **Verification Method:** completion-criteria audit (all §12 items proven; any gap ⇒ incomplete).

---

### Constitutional Invariant Protection

#### GR-AUTH-020

- **ID:** GR-AUTH-020
- **Requirement:** THE Authority_Fabric SHALL preserve invariants `INV-1..13`, SHALL enroll no existential invariant (`INV-14..20`), SHALL keep the AD-0014 Ω∞ boundary intact, SHALL NOT release the Article IX generation lock, and SHALL treat the non-waivable S1/S3/S4 controls and configuration floors (`denyByDefault`, `revocationSupremacy`, `singleApex`, `externalActuationGate = AD-0009`, `federationMode = advisory-only`, `evolutionOnlyCommit`) as protected and non-relaxable.
- **Rationale:** Constitutional invariant protection requires preservation of `INV-1..13`, non-enrollment of existential invariants, an intact Ω∞ boundary, an unreleased generation lock, and non-waivable security/config floors (Governing discipline preamble; §5 floors; §18 non-waivable).
- **Source Design Section:** Governing discipline preamble; §5 Configuration Model (configuration floors); §18 Security Considerations (non-waivable); §8 Governance Model.
- **Verification Method:** property-based test (floor/invariant non-relaxation) + governance review (Ω∞ boundary, `INV-14..20` non-enrollment, generation lock intact).

---

## Data Requirements

> Scope note: This section contains the **Data Requirements only** (DR-AUTH-001 through DR-AUTH-015),
> one per data topic. Each requirement is derived from and traceable to the completed authoritative
> `design.md` and preserves registry sovereignty (single source of truth), event sourcing
> (stream-authoritative), deterministic replay (`INV-6`), and constitutional traceability (`AUTH-010`,
> `S-A10`).

---

### Registry Records

#### DR-AUTH-001

- **ID:** DR-AUTH-001
- **Requirement:** THE Authority_Registry SHALL persist every authority instance as an `AuthorityRecord` keyed as `authority:<fabric>:<uuid>` carrying `archetypeRef`, a single `ownerRef`, a `keyRef` by reference, `enumeratedPowers`, `scopeRef`, `grantedBy`, `sourceRef`, `version`, and lifecycle `status`, such that the registry remains the single authoritative source of truth.
- **Rationale:** Authority records are the single source of truth with single-owner, keys-by-reference, enumerated powers, provenance, and source traceability (registry rules 1–8; `S-A1`, `S-A9`, `S-A10`).
- **Source Design Section:** §4 Registry Schema (`STRUCTURE AuthorityRecord`, registry rules 1–8); §3 Domain Model (C1).
- **Verification Method:** integration test (registry round-trip; key-namespace conformance) + property-based test (reject record missing owner/classification/version/source).

---

### Authority Type Records

#### DR-AUTH-002

- **ID:** DR-AUTH-002
- **Requirement:** THE Authority_Type_Registry SHALL represent every archetype as an `AuthorityTypeRecord` enumerating its `archetype`, an `instantiable` flag (FALSE for `AA-0`), a `powerVocabulary`, a `spineConformance` set including `S-A1..S-A10` as applicable, and a `version`, such that new consuming fabrics reference archetypes rather than defining new authority types.
- **Rationale:** Archetypes are registry-declared with a fixed set; the apex `AA-0` is non-instantiable and every type declares its spine conformance and power vocabulary (registry rule 5; `UAF-C3`; C2).
- **Source Design Section:** §4 Registry Schema (`STRUCTURE AuthorityTypeRecord`, registry rule 5); §3 Domain Model (C2); §2.1 Architectural stance.
- **Verification Method:** integration test (archetype resolution; `AA-0` non-instantiable) + review (no fabric-defined type).

---

### Scope Records

#### DR-AUTH-003

- **ID:** DR-AUTH-003
- **Requirement:** THE Authority_Registry SHALL persist every scope as an `AuthorityScopeRecord` keyed as `authority:scope:<slug>` carrying an isolated `namespace`, a `boundary` containment predicate, and an optional `parentScopeRef`, such that scopes form a containment tree and local scopes shadow foreign scopes.
- **Rationale:** Scope records enforce namespace isolation and containment (local-shadows-foreign), bounding where enumerated powers are valid (`S-A8`; C6).
- **Source Design Section:** §4 Registry Schema (`STRUCTURE AuthorityScopeRecord`); §3 Domain Model (C6); §16 Operational Model (Federation).
- **Verification Method:** integration test (containment tree; namespace isolation) + property-based test (containment predicate).

---

### Delegation Records

#### DR-AUTH-004

- **ID:** DR-AUTH-004
- **Requirement:** THE Authority_Registry SHALL persist every delegation as an `AuthorityDelegationRecord` carrying `fromRef`, `toRef`, `narrowedPowers` (a subset of the delegator's enumerated powers), a `scopeRef` contained within the delegator's scope, an `expiry`, and a `version`, such that no delegation exceeds its delegator and the delegation graph stays acyclic.
- **Rationale:** Delegation records are narrowing-only, bounded, and non-circular, preventing privilege escalation through re-grant (Correctness Property 5; C5).
- **Source Design Section:** §4 Registry Schema (`STRUCTURE AuthorityDelegationRecord`); §3 Domain Model (C5); §10 Correctness Property 5.
- **Verification Method:** property-based test (narrowing subset; scope containment; acyclic) + adversarial test (cycle, widening).

---

### Policy Records

#### DR-AUTH-005

- **ID:** DR-AUTH-005
- **Requirement:** THE Authority_Registry SHALL persist every authorization rule as an `AuthorityPolicyRecord` carrying an externalized `ruleRef`, a PI-4 `evaluatorRef`, a non-overridable `denyByDefault = TRUE` floor, and a `version`, and SHALL NOT honor any policy that is not a registered, resolvable record.
- **Rationale:** Policy records are configuration-/policy-driven and deny-by-default, never code-embedded (`IP-05`, `S-A6`; registry rule 4; C7).
- **Source Design Section:** §4 Registry Schema (`STRUCTURE AuthorityPolicyRecord`, registry rule 4); §3 Domain Model (C7); §5 Configuration Model.
- **Verification Method:** integration test (unregistered policy not honored; deny-by-default) + review (no hardcoded rule).

---

### Revocation Records

#### DR-AUTH-006

- **ID:** DR-AUTH-006
- **Requirement:** THE Authority_Registry SHALL persist every revocation as a `RevocationRecord` carrying `targetRef`, a `forwardOnly = TRUE` flag, a `propagate = TRUE` flag, and a `reason`, such that a revocation is forward-only and transitively removes derived delegations.
- **Rationale:** Revocation records enforce forward-only, transitively-propagating revocation supremacy (Correctness Property 4; C4).
- **Source Design Section:** §4 Registry Schema (`STRUCTURE RevocationRecord`); §6.2 Revocation supremacy event (`RevocationPayload`); §3 Domain Model (C4); §10 Correctness Property 4.
- **Verification Method:** property-based test (forward-only; transitive propagation) + adversarial test (revocation bypass).

---

### Proposal Records

#### DR-AUTH-007

- **ID:** DR-AUTH-007
- **Requirement:** THE Authority_Fabric SHALL represent every grant, delegation, scope, approval, and revocation request as a governed proposal data structure that carries its originating actor, authority reference, and target scope, such that a proposal never directly mutates any authority state.
- **Rationale:** Proposal data is propose-not-act: coordination requests are governed candidates that mutate no state until Evolution-committed (Correctness Property 8).
- **Source Design Section:** §7 API Model (propose-only operations); §2.3 Governed authority loop; §7.2 Grant API; §10 Correctness Property 8.
- **Verification Method:** property-based test (proposal submission mutates no state) + review (proposal carries actor/authority/scope).

---

### Authority Events

#### DR-AUTH-008

- **ID:** DR-AUTH-008
- **Requirement:** THE Authority_Event_Store SHALL persist every authority state change as an `AuthorityEvent` appended to an append-only, per-stream event log with a strictly increasing `sequence`, and SHALL treat the event stream, not any derived projection, as the authoritative record of authority state.
- **Rationale:** Authority events are the authoritative, stream-first record of all state changes (event sourcing), enabling deterministic replay and reversibility (`S-A7`; `AUTH-009` §6.6; `INV-6`; Correctness Property 10).
- **Source Design Section:** §6.1 Canonical event vocabulary (`STRUCTURE AuthorityEvent`, `EnumAuthEventType`); §6 Event Model (stream-authoritative); §10 Correctness Property 10.
- **Verification Method:** property-based test (monotonic per-stream sequence) + replay test (stream-authoritative reconstruction).

---

### Event Metadata

#### DR-AUTH-009

- **ID:** DR-AUTH-009
- **Requirement:** THE Authority_Event_Store SHALL record on every `AuthorityEvent` the metadata fields `eventId`, `streamId`, `type`, `payload`, `actor`, `authorityRef`, `resultHash`, `timestamp` (logical clock), and `classification`, such that each event is determinism-provable, provenance-complete, and classified.
- **Rationale:** Event metadata carries the determinism proof (`resultHash`), authorizing reference, and classification required for auditable, deterministic, tamper-evident sourcing (`INV-6`; S4; `S-A7`).
- **Source Design Section:** §6.1 Canonical event vocabulary (`STRUCTURE AuthorityEvent`); §7.1 Decision API (determinism gate); §18 Security Considerations (S4).
- **Verification Method:** review (event carries all mandated metadata fields) + property-based test (`resultHash` determinism).

---

### Hash Chains

#### DR-AUTH-010

- **ID:** DR-AUTH-010
- **Requirement:** THE Authority_Event_Store SHALL bind every `AuthorityEvent` into a tamper-evident hash chain by storing `prevHash` and `hash = H(prevHash || canonical(payload))`, anchored at a per-stream genesis hash, such that any break in the chain is detectable on replay.
- **Rationale:** Hash chaining provides tamper-evident integrity over the event log, guaranteeing historical events cannot be silently altered (Correctness Property 10; `S-A7`; S6).
- **Source Design Section:** §6.1 Canonical event vocabulary (`prevHash`, `hash`); §6.3 Projection (chain-integrity asserts, genesis anchor); §10 Correctness Property 10.
- **Verification Method:** property-based test (hash-chain integrity across appended events) + adversarial test (chain tamper detection).

---

### Audit Records

#### DR-AUTH-011

- **ID:** DR-AUTH-011
- **Requirement:** THE Authority_Fabric SHALL persist a classified, hash-chained, append-only audit record for every committed authority change and every allowed or denied decision, capturing full provenance, such that the audit trail is independently and offline verifiable.
- **Rationale:** Audit records are the tamper-evident, append-only, offline-verifiable provenance data mandated for every state change and decision (S6; `S-A7`; `AUTH-009` §6.6; Correctness Property 10).
- **Source Design Section:** §6 Event Model (hash-chained events); §16 Operational Model (Auditability); §18 Security Considerations (S6); §11 Evidence Requirements (`EV-AUDIT`).
- **Verification Method:** replay test (offline audit replay proof) + property-based test (audit chain integrity) + review (provenance completeness).

---

### Authority State Projections

#### DR-AUTH-012

- **ID:** DR-AUTH-012
- **Requirement:** THE Authority_Fabric SHALL derive authority-state projections (`Map<AuthorityId, AuthorityView>`) as read-only, non-authoritative data reconstructed deterministically by ordered replay of the authoritative event stream, asserting hash-chain integrity and the single-owner, enumerated-power, scope-containment, single-apex, and revocation-supremacy invariants at each event.
- **Rationale:** Projections are derived, read-only views of the authoritative stream; replaying the same stream must always reproduce identical state with invariants preserved (`INV-6`; §6.3 projection contract; Correctness Properties 1, 2, 4, 7).
- **Source Design Section:** §6.3 Projection (`FUNCTION projectAuthorityState`, preconditions/postconditions/loop invariant); §7 API Model (`getAuthority` read-only projection); §10 Correctness Properties 4, 7.
- **Verification Method:** property-based test (deterministic replay; invariants at every prefix) + integration test (read-only, no state mutation).

---

### Approval & Decision Records

#### DR-AUTH-013

- **ID:** DR-AUTH-013
- **Requirement:** THE Authority_Fabric SHALL persist every approval as an `AuthorityApproval` record carrying `proposalRef`, `quorum`, `approvers`, and Separation-of-Duties metadata, and every decision as an `AuthorityDecision` record carrying `actor`, `action`, `verdict`, and a reproducible `resultHash`, such that ratification distinctness and deterministic verdicts are preserved.
- **Rationale:** Approval and decision records carry the SoD, quorum, and determinism proof required for auditable, reproducible authority governance (`S-A2`, `S-A3`, `INV-6`; C8, C9).
- **Source Design Section:** §3 Domain Model (C8 AuthorityApproval, C9 AuthorityDecision); §7.1 Decision API (`resultHash`); §7.2 Grant API (SoD + quorum); §10 Correctness Properties 6, 7.
- **Verification Method:** policy test (SoD role distinctness; quorum) + property-based test (`resultHash` determinism).

---

### Reconciliation Records

#### DR-AUTH-014

- **ID:** DR-AUTH-014
- **Requirement:** THE Authority_Fabric SHALL correct any committed grant, delegation, scope, or authority change solely by recording a governed compensating event (revocation/narrowing) and SHALL NOT silently edit or delete any prior event, and SHALL retain the provenance required to reconcile authority events against the `AUTH-012` decision ledger.
- **Rationale:** Reconciliation data is produced by append-only compensating events (never silent edits), and authority sensitivity requires event-to-`AUTH-012`-ledger reconciliation (`AUTH-009` §6.6; §14 Rollback; §16 Recovery).
- **Source Design Section:** §14 Migration Strategy (Rollback); §16 Operational Model (Recovery); §6 Event Model (append-only); §0 Traceability Anchors (`AUTH-012`).
- **Verification Method:** integration test (compensating-event correction; event-to-ledger reconciliation) + review (no in-place edit/delete path).

---

### Cross-Capability References

#### DR-AUTH-015

- **ID:** DR-AUTH-015
- **Requirement:** THE Authority_Fabric SHALL admit every governed fabric's governance solely through registry-based `authority:*` archetype-instance references and versioned contract/event references, with no shared mutable model, and SHALL preserve superseded bespoke authority model text by linking rather than deleting it.
- **Rationale:** Cross-capability references are registry/contract/event-only (no shared mutable state); consumer onboarding is register-then-retire, and superseded model text is preserved, not deleted (`INV-13`, `UAF-C4`; §2.4 boundaries; §9 forward consumers; `AUTH-009` §6.6).
- **Source Design Section:** §9 Dependency Graph (forward consumers, register-then-retire); §2.4 Layer placement and boundaries; §14 Migration Strategy (Model collapse); §3 Domain Model.
- **Verification Method:** integration test (consumer governance admitted via registry reference, zero core change) + review (contract/event-only integration; superseded model linked).

---

## Security Requirements

> Scope note: This section contains the **Security Requirements only** (SR-AUTH-001 through
> SR-AUTH-015), one per security topic. Each requirement is derived from and traceable to the completed
> authoritative `design.md`, is platform-independent, registry-driven, and governance-compliant, and is
> grounded in S1/S3/S4/S6, `S-A1..S-A10`, and the design's §18 Security Considerations, §7.1 Decision
> API, and §6 Event Model.

---

### Authorization

#### SR-AUTH-001

- **ID:** SR-AUTH-001
- **Requirement:** WHEN any governed authority action (grant, delegate, decide, approve, revoke, or scope change) is requested, THE Authority_Fabric SHALL obtain an explicit authorization decision from the PI-4 Control_Plane policy evaluator before applying any enumerated-power or scope-containment check or committing any effect.
- **Rationale:** Authorization via the PI-4 policy evaluator is the mandatory S1 stage preceding constraint checking and commit (`AUTH-008` S1; `S-A6`; §7.1 step 1).
- **Source Design Section:** §7.1 Decision API (step 1 policy check); §18 Security Considerations (S1); §8 Governance Model (deny-by-default).
- **Verification Method:** policy test (authorization invoked on every governed path) + integration test against PI-4.

---

### Authentication Integration

#### SR-AUTH-002

- **ID:** SR-AUTH-002
- **Requirement:** THE Authority_Fabric SHALL require every actor to be authenticated before any grant, delegation, decision, approval, or revocation request is accepted, integrating with the platform authentication provided under the S1 control.
- **Rationale:** Authenticated actors are an S1 precondition of the decision path and bound the identity of every governed request (`AUTH-008` S1; §7.1 preconditions).
- **Source Design Section:** §7.1 Decision API (authenticated-actor precondition); §18 Security Considerations (S1).
- **Verification Method:** security conformance test (authenticated actor) + adversarial test (unauthenticated request rejected).

---

### Deny-by-Default

#### SR-AUTH-003

- **ID:** SR-AUTH-003
- **Requirement:** THE Authority_Fabric SHALL deny every grant, delegation, decision, approval, scope, and revocation action by default, and IF the PI-4 Control_Plane returns any decision other than ALLOW THEN THE Authority_Fabric SHALL deny the action fail-closed with no state change and append an `AUTH_DECISION_DENIED` audit event.
- **Rationale:** Deny-by-default (`S-A6`) requires rejection absent an explicit ALLOW, with the denial recorded fail-closed (Correctness Property 3; §5 non-waivable `denyByDefault` floor).
- **Source Design Section:** §7.1 Decision API (policy-deny branch); §5 Configuration Model (`denyByDefault = TRUE` floor); §10 Correctness Property 3; §17 Error Handling (Policy deny row).
- **Verification Method:** property-based test (no explicit ALLOW ⇒ DENY with no state change) + adversarial test.

---

### Policy Enforcement

#### SR-AUTH-004

- **ID:** SR-AUTH-004
- **Requirement:** THE Authority_Fabric SHALL enforce every authority constraint (enumerated-power containment, scope containment, delegation bounds, determinism) fail-closed after policy authorization and before commit, such that no action that fails any constraint alters authority state.
- **Rationale:** Policy enforcement layers deny-by-default authorization with load-bearing constraint gates that must all pass before an Evolution commit (`S-A9`, `INV-6`; §7.1 steps 2–3).
- **Source Design Section:** §7.1 Decision API (steps 2–3 constraint/determinism gates); §8 Governance Model (deny-by-default); §17 Error Handling.
- **Verification Method:** property-based test (any constraint failure ⇒ no state change) + adversarial test (power widening, scope escape).

---

### Key & Signature Management

#### SR-AUTH-005

- **ID:** SR-AUTH-005
- **Requirement:** THE Authority_Fabric SHALL reference every signing key by reference only and SHALL NOT embed any key material, reusing the PI-5 Federation Ed25519 assertions for signed authority acts and introducing no custom cryptography.
- **Rationale:** Keys-by-reference and reuse of PI-5 Ed25519 (no custom cryptography) are the S3 control (`AUTH-008` S3; `S-A7`).
- **Source Design Section:** §18 Security Considerations (S3); §4 Registry Schema (`keyRef` by reference); §1 Capability Purpose (non-goals — not a secrets manager or crypto primitive).
- **Verification Method:** review (keys by reference; no embedded key material) + security conformance test (PI-5 Ed25519 reuse).

---

### Tamper Detection

#### SR-AUTH-006

- **ID:** SR-AUTH-006
- **Requirement:** IF an event's `prevHash` or `hash` fails verification during ordered replay, THEN THE Authority_Fabric SHALL halt replay fail-closed and flag the tamper condition for governance investigation.
- **Rationale:** Tamper detection over the hash-chained log guarantees that any silent alteration self-halts replay and surfaces for investigation (S6; §17 chain-break row; `S-A7`).
- **Source Design Section:** §6.3 Projection (chain-integrity asserts); §17 Error Handling (Chain break row); §18 Security Considerations (S6).
- **Verification Method:** adversarial test (chain tamper triggers fail-closed halt + flag) + replay test.

---

### Hash Integrity

#### SR-AUTH-007

- **ID:** SR-AUTH-007
- **Requirement:** THE Authority_Fabric SHALL compute and verify every event hash as `hash = H(prevHash || canonical(payload))` over a canonical payload encoding, anchored at a per-stream genesis hash, such that the full chain is verifiable independently and offline.
- **Rationale:** Hash integrity over canonical encodings is the cryptographic basis of tamper evidence and offline verifiability of the audit trail (S6; Correctness Property 10; `S-A7`).
- **Source Design Section:** §6.1 Canonical event vocabulary (`hash`, `prevHash`); §6.3 Projection (genesis anchor, hash asserts); §18 Security Considerations (S6).
- **Verification Method:** property-based test (hash recomputation matches on replay) + replay test (offline chain verification).

---

### Event Integrity

#### SR-AUTH-008

- **ID:** SR-AUTH-008
- **Requirement:** THE Authority_Fabric SHALL guarantee event integrity by appending events with a strictly increasing per-stream sequence and never deleting or rewriting a committed event, evolving event types only additively via version-tagged deterministic upcasters.
- **Rationale:** Event integrity requires append-only, strictly ordered, additively versioned events so historical events remain intact and replayable (`AUTH-009` §6.6; `S-A7`; §14 event stream evolution).
- **Source Design Section:** §6.1 Canonical event vocabulary (`sequence`); §6 Event Model (stream-authoritative); §14 Migration Strategy (event stream evolution).
- **Verification Method:** property-based test (monotonic sequence; no deletion) + adversarial test (audit-chain tampering) + review (additive versioning).

---

### Registry Protection

#### SR-AUTH-009

- **ID:** SR-AUTH-009
- **Requirement:** THE Authority_Registry SHALL commit every registry registration and schema change exclusively through the PI-6 Evolution_Fabric, SHALL reject any registration lacking a resolvable owner, classification, version, source, or valid archetype, and SHALL NOT cache authority state at runtime without a corresponding invalidation event.
- **Rationale:** Registry protection preserves the single source of truth by routing all registrations through the sole commit path, enforcing record completeness, and forbidding stale uninvalidated caches (`S-A5`; registry rules 1–8).
- **Source Design Section:** §4 Registry Schema (`PROCEDURE admitAuthority`, registry rules 1–8); §18 Security Considerations; §8 Governance Model (Evolution-only commit).
- **Verification Method:** integration test (registration via Evolution Fabric; no uninvalidated cache) + adversarial test (malformed record rejected).

---

### Audit Protection

#### SR-AUTH-010

- **ID:** SR-AUTH-010
- **Requirement:** THE Authority_Fabric SHALL maintain the authority audit trail as immutable, append-only, and hash-chained such that audit records cannot be modified or deleted after append, and SHALL record a classified audit entry for every committed authority change and every allowed or denied decision.
- **Rationale:** Audit protection guarantees an immutable, append-only, tamper-evident trail as the S6 control and closure evidence source (S6; `AUTH-009` §6.6; `EV-AUDIT`).
- **Source Design Section:** §18 Security Considerations (S6); §16 Operational Model (Auditability); §6 Event Model; §11 Evidence Requirements (`EV-AUDIT`).
- **Verification Method:** adversarial test (audit modification/deletion prevented) + replay test (offline audit replay proof).

---

### Revocation Enforcement

#### SR-AUTH-011

- **ID:** SR-AUTH-011
- **Requirement:** WHEN an actor is revoked or a target scope is halted, THE Authority_Fabric SHALL deny every subsequent action by that actor or within that scope non-bypassably, forward-only, and with transitive propagation to derived delegations, preventing any exercise of revoked authority.
- **Rationale:** Revocation enforcement guarantees revocation supremacy — a revoked or halted authority can never be exercised, and revocation propagates transitively (Correctness Property 4; §7.1 step 0).
- **Source Design Section:** §7.1 Decision API (step 0 revocation/halt supremacy); §6.2 Revocation payload; §6.3 Projection (`markRevokedTransitive`); §10 Correctness Property 4.
- **Verification Method:** property-based test (revoked ⇒ always denied; transitive) + adversarial test (revocation bypass).

---

### Emergency Halt Enforcement

#### SR-AUTH-012

- **ID:** SR-AUTH-012
- **Requirement:** WHEN an emergency halt is active for a scope, THE Authority_Fabric SHALL non-bypassably freeze all authority activity within that scope to deny-all, and SHALL require any resume to be authorized by an authority distinct from the halting authority.
- **Rationale:** Emergency halt is a non-bypassable deny-all freeze resumed only under Separation of Duties (`AA-8`; §16 Emergency control; §8 Emergency halt row).
- **Source Design Section:** §7 API Model (`emergencyHalt`, `resume`); §8 Governance Model (Emergency halt row); §16 Operational Model (Emergency control).
- **Verification Method:** adversarial test (halt bypass) + policy test (distinct resume authority).

---

### Separation of Authority

#### SR-AUTH-013

- **ID:** SR-AUTH-013
- **Requirement:** THE Authority_Fabric SHALL enforce separation of duties such that for any authority change the roles of proposer, certifier, ratifier, and revoker are held by distinct authorities, SHALL require a ratification quorum at least equal to the configured `quorumFloor`, and SHALL require an emergency-halt resume to be authorized by an authority distinct from the halting authority.
- **Rationale:** Separation of authority (`S-A2`, `S-A3`) prevents authority concentration and escalation across the authority loop and the halt/resume path (Correctness Property 6).
- **Source Design Section:** §8 Governance Model (Separation of duties, Ratification rows); §8.1 Decision-rights; §7.2 Grant API (SoD + quorum); §10 Correctness Property 6.
- **Verification Method:** policy test (role distinctness; quorum; distinct resume) + adversarial test (SoD collusion, quorum evasion).

---

### Governance Enforcement

#### SR-AUTH-014

- **ID:** SR-AUTH-014
- **Requirement:** IF a resolved configuration attempts to relax a non-waivable floor (`denyByDefault = TRUE`, `revocationSupremacy = TRUE`, `singleApex = TRUE`, `externalActuationGate = AD-0009`, `federationMode = advisory-only`, `evolutionOnlyCommit = TRUE`) or the S1/S3/S4 controls, THEN THE Authority_Fabric SHALL reject the configuration as a governance violation.
- **Rationale:** Governance enforcement guarantees configuration may tighten but never relax the non-waivable security and safety floors (`S-A5`, `S-A6`, `UAF-C3`; `AUTH-008`; §5 configuration floors; §18 non-waivable).
- **Source Design Section:** §5 Configuration Model (configuration floors, `FUNCTION resolveConfig`); §18 Security Considerations (non-waivable); §8 Governance Model.
- **Verification Method:** property-based test (floor/control relaxation rejected) + integration test (config precedence with floor enforcement).

---

### Constitutional Invariant Protection

#### SR-AUTH-015

- **ID:** SR-AUTH-015
- **Requirement:** THE Authority_Fabric SHALL preserve invariants `INV-1..13`, SHALL enroll no existential invariant (`INV-14..20`), SHALL keep the AD-0014 Ω∞ boundary intact, SHALL preserve the single apex (`AA-0`) and non-inversion guarantees, and SHALL treat the non-waivable S1/S3/S4 controls and configuration floors as protected and non-relaxable at all times.
- **Rationale:** Constitutional invariant protection requires preservation of `INV-1..13`, non-enrollment of existential invariants, an intact Ω∞ boundary, single-apex and non-inversion preservation, and non-waivable security/config floors (Governing discipline preamble; §5 floors; §18 non-waivable; Correctness Properties 1, 11).
- **Source Design Section:** Governing discipline preamble; §5 Configuration Model (configuration floors); §18 Security Considerations (non-waivable); §8 Governance Model; §10 Correctness Properties 1, 11.
- **Verification Method:** property-based test (floor/invariant non-relaxation; single apex; non-inversion) + governance review (Ω∞ boundary intact; `INV-14..20` non-enrollment).


---

## Acceptance Criteria

> Scope note: This section contains the **Acceptance Criteria only** (AC-AUTH-001 through AC-AUTH-040),
> authored in **strict EARS notation**. Each criterion is derived from and traceable to the completed
> authoritative `design.md` and the UCOS canon (`INV-6` determinism, deny-by-default `S-A6`, enumerated
> powers `S-A9`, revocation supremacy, narrowing-only delegation, SoD/quorum `S-A2`/`S-A3`, single apex
> `AA-0`/`UAF-C3`, non-inversion `PCAMG-0008` G-1..G-5, PI-4 policy evaluation, PI-6 sole commit path,
> `AD-0009` external-actuation gating, hash-chained auditability `S-A7`). Every criterion links to the
> specific FR-/NFR-/GR-/DR-/SR-AUTH requirement(s) it validates and names a verification approach (TEST,
> SIMULATION, REPLAY, AUDIT, PROPERTY TEST, FORMAL VALIDATION). The twelve load-bearing constitutional
> properties — Single Apex, Enumerated Powers, Deny-by-Default, Revocation Supremacy, Narrowing-Only
> Delegation, Separation of Duties, Determinism, Propose-Not-Act (PI-6 Commit Path), No External
> Actuation (AD-0009), Auditability, Non-Inversion, and Additivity — are each covered by at least one
> criterion, and are jointly asserted by the constitutional criteria AC-AUTH-039 and AC-AUTH-040.

---

### Authority Registry

#### AC-AUTH-001

- **ID:** AC-AUTH-001
- **EARS Statement:** WHEN an authority construct (authority, type, grant, delegation, scope, policy, approval, decision, or revocation) is registered, THEN THE Authority_Registry SHALL persist it as a metadata-backed record keyed as `authority:<kind>:<id>` and SHALL treat that record as the single authoritative source of truth for the construct's state.
- **Linked Requirement IDs:** FR-AUTH-001, DR-AUTH-001, GR-AUTH-002, NFR-AUTH-010.
- **Verification Approach:** TEST (registry round-trip and key-namespace conformance) + AUDIT (single-source-of-truth review). *(Validates: Registry Sovereignty)*

#### AC-AUTH-002

- **ID:** AC-AUTH-002
- **EARS Statement:** IF a registration record lacks exactly one owner, a classification tag, a semantic version, or a resolvable source reference, THEN THE Authority_Registry SHALL reject the registration.
- **Linked Requirement IDs:** FR-AUTH-002, DR-AUTH-001, SR-AUTH-009.
- **Verification Approach:** PROPERTY TEST (reject any record missing owner/classification/version/source) + TEST (adversarial malformed-record rejection).

#### AC-AUTH-003

- **ID:** AC-AUTH-003
- **EARS Statement:** WHEN an authority instance is admitted, THEN THE Authority_Registry SHALL commit it only after verifying that the requesting authority holds the `grant` power and is neither revoked nor halted, that the instance's enumerated powers are a subset of the resolved archetype's power vocabulary, and that the instance is not self-granted, and SHALL route the admission through the PI-6 Evolution_Fabric commit path.
- **Linked Requirement IDs:** FR-AUTH-004, GR-AUTH-004, SR-AUTH-009.
- **Verification Approach:** TEST (admission commit routed through Evolution Fabric) + SIMULATION (missing-power, self-grant, and power-widening rejection). *(Validates: PI-6 Commit Path, Enumerated Powers)*

#### AC-AUTH-004

- **ID:** AC-AUTH-004
- **EARS Statement:** WHILE the Authority_Registry holds authority state, THE SYSTEM SHALL treat the registry as the single authoritative source of truth and SHALL NOT serve cached authority state absent a corresponding invalidation event.
- **Linked Requirement IDs:** GR-AUTH-002, DR-AUTH-001, SR-AUTH-009, NFR-AUTH-010.
- **Verification Approach:** TEST (no uninvalidated authority cache) + AUDIT (registry-as-sole-source review). *(Validates: Registry Sovereignty)*

---

### Type & Archetype / Single Apex

#### AC-AUTH-005

- **ID:** AC-AUTH-005
- **EARS Statement:** IF an authority instance references the non-instantiable apex archetype `AA-0` or an unresolved archetype, THEN THE Authority_Registry SHALL reject the instance, preserving the singular Authority Board apex.
- **Linked Requirement IDs:** FR-AUTH-003, GR-AUTH-008, FR-AUTH-025.
- **Verification Approach:** PROPERTY TEST (no `AA-0` instance admissible) + TEST (adversarial apex forgery). *(Validates: Single Apex)*

#### AC-AUTH-006

- **ID:** AC-AUTH-006
- **EARS Statement:** WHERE an authority instance enumerates powers, THE SYSTEM SHALL admit it only IF its enumerated powers are a subset of its archetype's power vocabulary, holding no implicit or widened power.
- **Linked Requirement IDs:** FR-AUTH-003, DR-AUTH-002, NFR-AUTH-014.
- **Verification Approach:** PROPERTY TEST (enumerated-power containment) + TEST (adversarial power widening). *(Validates: Enumerated Powers)*

---

### Policy Engine

#### AC-AUTH-007

- **ID:** AC-AUTH-007
- **EARS Statement:** WHEN any governed authority action (grant, delegate, decide, approve, revoke, or scope change) is requested, THEN THE Decision_Engine SHALL obtain an explicit authorization decision from the PI-4 Control_Plane policy evaluator before applying any enumerated-power or scope-containment check or committing any effect.
- **Linked Requirement IDs:** FR-AUTH-005, GR-AUTH-003, SR-AUTH-001.
- **Verification Approach:** TEST (authorization invoked on every governed path) + SIMULATION (integration against PI-4). *(Validates: PI-4 Evaluation Path)*

#### AC-AUTH-008

- **ID:** AC-AUTH-008
- **EARS Statement:** IF the PI-4 Control_Plane returns any decision other than ALLOW for a requested authority action, THEN THE Decision_Engine SHALL deny the action fail-closed with no state change and SHALL append an `AUTH_DECISION_DENIED` audit event with reason `policy-deny`.
- **Linked Requirement IDs:** FR-AUTH-006, GR-AUTH-006, SR-AUTH-003.
- **Verification Approach:** PROPERTY TEST (no explicit ALLOW ⇒ DENY with no state change) + TEST (adversarial deny path). *(Validates: Deny-by-Default, PI-4 Evaluation Path)*

#### AC-AUTH-009

- **ID:** AC-AUTH-009
- **EARS Statement:** WHERE no explicit ALLOW policy decision exists for a grant, delegation, decision, approval, scope, or revocation action, THE SYSTEM SHALL deny the action by default.
- **Linked Requirement IDs:** GR-AUTH-006, SR-AUTH-003, FR-AUTH-006.
- **Verification Approach:** PROPERTY TEST (absence of ALLOW ⇒ DENY across all governed APIs). *(Validates: Deny-by-Default)*

---

### Decision Determinism

#### AC-AUTH-010

- **ID:** AC-AUTH-010
- **EARS Statement:** WHEN rendering an authority decision, THEN THE Decision_Engine SHALL compute the verdict as a pure, side-effect-free function of recorded inputs and SHALL emit a reproducible `resultHash`.
- **Linked Requirement IDs:** FR-AUTH-009, NFR-AUTH-001, DR-AUTH-013.
- **Verification Approach:** PROPERTY TEST (identical inputs ⇒ identical `resultHash`) + REPLAY (recorded-input reproduction). *(Validates: Determinism)*

#### AC-AUTH-011

- **ID:** AC-AUTH-011
- **EARS Statement:** WHEN identical decision inputs and identical event streams are evaluated, THEN THE Authority_Fabric SHALL produce identical verdicts and identical `resultHash` values across runs and hosts.
- **Linked Requirement IDs:** NFR-AUTH-001, FR-AUTH-009, GR-AUTH-013.
- **Verification Approach:** PROPERTY TEST (stable verdicts across runs) + REPLAY (cross-host reproduction). *(Validates: Determinism)*

#### AC-AUTH-012

- **ID:** AC-AUTH-012
- **EARS Statement:** WHEN evaluating governance gates (revocation/halt supremacy, policy authorization, enumerated-power, scope-containment, delegation-bound, and determinism), THEN THE Authority_Fabric SHALL evaluate them as deterministic functions of recorded inputs such that identical inputs always yield the identical governance verdict.
- **Linked Requirement IDs:** GR-AUTH-013, NFR-AUTH-001, FR-AUTH-009.
- **Verification Approach:** PROPERTY TEST (identical inputs ⇒ identical verdict) + REPLAY (stable verdict reproduction). *(Validates: Determinism)*

---

### Grant & Delegation

#### AC-AUTH-013

- **ID:** AC-AUTH-013
- **EARS Statement:** WHEN a grant is requested, THEN THE Grant_Engine SHALL accept it as a governed proposal only, SHALL verify that the granted enumerated powers are a subset of the granter's own powers and that the proposer is distinct from the approver, and SHALL commit the grant exclusively through the PI-6 Evolution_Fabric only when the ratification quorum is met.
- **Linked Requirement IDs:** FR-AUTH-011, GR-AUTH-007, GR-AUTH-010, DR-AUTH-007.
- **Verification Approach:** PROPERTY TEST (no grant beyond own powers; SoD distinctness) + TEST (Evolution commit; quorum gate). *(Validates: Propose-Not-Act, Separation of Duties, PI-6 Commit Path)*

#### AC-AUTH-014

- **ID:** AC-AUTH-014
- **EARS Statement:** WHEN a delegation is requested, THEN THE Delegation_Engine SHALL admit it only IF the delegated powers are a subset of the delegator's enumerated powers and the delegation scope is contained within the delegator's scope.
- **Linked Requirement IDs:** FR-AUTH-012, GR-AUTH-011, DR-AUTH-004.
- **Verification Approach:** PROPERTY TEST (narrowing subset; scope containment) + TEST (adversarial power/scope escalation). *(Validates: Narrowing-Only Delegation)*

#### AC-AUTH-015

- **ID:** AC-AUTH-015
- **EARS Statement:** IF a delegation would introduce a cycle in the delegation graph or exceed the configured `delegationMaxDepth`, THEN THE Delegation_Engine SHALL reject the delegation.
- **Linked Requirement IDs:** FR-AUTH-012, GR-AUTH-011, NFR-AUTH-013.
- **Verification Approach:** PROPERTY TEST (acyclic; bounded depth) + TEST (adversarial delegation cycle / depth overflow). *(Validates: Narrowing-Only Delegation)*

#### AC-AUTH-016

- **ID:** AC-AUTH-016
- **EARS Statement:** IF a policy-allowed action requests a power the actor does not hold as an enumerated power, or targets a scope not contained within the actor's scope, THEN THE Decision_Engine SHALL deny the action fail-closed.
- **Linked Requirement IDs:** FR-AUTH-008, DR-AUTH-003, SR-AUTH-004.
- **Verification Approach:** PROPERTY TEST (enumerated-power + scope containment) + TEST (adversarial power widening, scope escape). *(Validates: Enumerated Powers)*

---

### Scope

#### AC-AUTH-017

- **ID:** AC-AUTH-017
- **EARS Statement:** WHEN a scope is registered or narrowed, THEN THE Scope_Manager SHALL enforce that the scope is namespace-isolated and fully contained within its parent scope, with local scopes shadowing foreign scopes.
- **Linked Requirement IDs:** FR-AUTH-013, DR-AUTH-003, NFR-AUTH-014.
- **Verification Approach:** PROPERTY TEST (containment predicate; namespace isolation) + TEST (adversarial scope escape).

---

### Revocation Supremacy

#### AC-AUTH-018

- **ID:** AC-AUTH-018
- **EARS Statement:** WHILE an authority is revoked, THE SYSTEM SHALL deny every subsequent action by that authority at every decision point, non-bypassably.
- **Linked Requirement IDs:** FR-AUTH-007, FR-AUTH-015, SR-AUTH-011, GR-AUTH-009.
- **Verification Approach:** PROPERTY TEST (revoked ⇒ always DENY) + TEST (adversarial revocation bypass). *(Validates: Revocation Supremacy)*

#### AC-AUTH-019

- **ID:** AC-AUTH-019
- **EARS Statement:** WHEN a revocation is committed, THEN THE Revocation_Authority SHALL make it forward-only and SHALL propagate it transitively to all delegations derived from the revoked authority.
- **Linked Requirement IDs:** FR-AUTH-015, DR-AUTH-006, GR-AUTH-009.
- **Verification Approach:** PROPERTY TEST (forward-only; transitive propagation) + TEST (adversarial re-activation blocked). *(Validates: Revocation Supremacy)*

---

### Emergency Halt

#### AC-AUTH-020

- **ID:** AC-AUTH-020
- **EARS Statement:** WHILE an emergency halt is active for a scope, THE SYSTEM SHALL non-bypassably reject all authority activity within that scope.
- **Linked Requirement IDs:** FR-AUTH-016, SR-AUTH-012, NFR-AUTH-019.
- **Verification Approach:** TEST (fail-closed rejection under halt) + SIMULATION (adversarial halt-bypass).

#### AC-AUTH-021

- **ID:** AC-AUTH-021
- **EARS Statement:** WHEN an emergency-halt resume is requested, THEN THE Emergency_Halt SHALL require the resume to be authorized by an authority distinct from the halting authority.
- **Linked Requirement IDs:** FR-AUTH-016, GR-AUTH-010, SR-AUTH-013.
- **Verification Approach:** TEST (distinct resume authority enforced) + SIMULATION (adversarial same-authority resume rejected).

---

### Approval & Separation of Duties

#### AC-AUTH-022

- **ID:** AC-AUTH-022
- **EARS Statement:** WHERE an authority change is ratified, THE SYSTEM SHALL enforce that the roles of proposer, certifier, ratifier, and revoker are held by distinct authorities.
- **Linked Requirement IDs:** FR-AUTH-014, GR-AUTH-010, SR-AUTH-013, DR-AUTH-013.
- **Verification Approach:** PROPERTY TEST (role distinctness) + TEST (adversarial SoD collusion). *(Validates: Separation of Duties)*

#### AC-AUTH-023

- **ID:** AC-AUTH-023
- **EARS Statement:** IF the ratification quorum is below the configured `quorumFloor`, THEN THE Approval_Manager SHALL return a `Pending("quorum-not-met")` outcome and SHALL NOT commit the authority change.
- **Linked Requirement IDs:** FR-AUTH-014, GR-AUTH-010, SR-AUTH-013.
- **Verification Approach:** TEST (quorum floor enforced) + SIMULATION (adversarial quorum evasion).

---

### External Actuation

#### AC-AUTH-024

- **ID:** AC-AUTH-024
- **EARS Statement:** IF a requested authority action would actuate a real-world (external) authority change, THEN THE Authority_Fabric SHALL return a `Pending("AD-0009 approval required")` outcome and SHALL NOT commit autonomously.
- **Linked Requirement IDs:** FR-AUTH-010, GR-AUTH-005, GR-AUTH-017.
- **Verification Approach:** TEST (AD-0009 pending path) + AUDIT (no-autonomous-external-actuation review). *(Validates: AD-0009 Actuation Boundary)*

---

### Commit & Propose-Not-Act

#### AC-AUTH-025

- **ID:** AC-AUTH-025
- **EARS Statement:** WHEN an authority-state change is admissible after policy, constraint, and approval checks, THEN THE Authority_Fabric SHALL commit it exclusively through the PI-6 Evolution_Fabric and SHALL possess no independent authority write or rollback path.
- **Linked Requirement IDs:** FR-AUTH-021, GR-AUTH-004, GR-AUTH-007.
- **Verification Approach:** TEST (commit routed through Evolution Fabric; no alternate write path) + AUDIT (commit-provenance review). *(Validates: PI-6 Commit Path, Propose-Not-Act)*

#### AC-AUTH-026

- **ID:** AC-AUTH-026
- **EARS Statement:** WHEN an actor submits a grant, delegation, scope, approval, or revocation request, THEN THE Authority_Fabric SHALL accept it as a governed proposal only and SHALL NOT mutate any authority state as a direct result of the submission.
- **Linked Requirement IDs:** FR-AUTH-021, GR-AUTH-007, DR-AUTH-007.
- **Verification Approach:** PROPERTY TEST (proposal submission mutates no state) + TEST (proposal carries actor/authority/scope). *(Validates: Propose-Not-Act)*

---

### Event Sourcing

#### AC-AUTH-027

- **ID:** AC-AUTH-027
- **EARS Statement:** WHEN any authority state change occurs, THEN THE Authority_Event_Store SHALL append a corresponding `AuthorityEvent` to an append-only stream with a strictly increasing per-stream `sequence`.
- **Linked Requirement IDs:** FR-AUTH-017, DR-AUTH-008, NFR-AUTH-015.
- **Verification Approach:** PROPERTY TEST (monotonic per-stream sequence) + TEST (append-only enforcement).

#### AC-AUTH-028

- **ID:** AC-AUTH-028
- **EARS Statement:** WHEN an `AuthorityEvent` is appended, THEN THE Authority_Event_Store SHALL bind it into a tamper-evident hash chain where `hash = H(prevHash || canonical(payload))`, anchored at a per-stream genesis hash.
- **Linked Requirement IDs:** FR-AUTH-017, DR-AUTH-010, SR-AUTH-007.
- **Verification Approach:** PROPERTY TEST (hash-chain integrity across appended events) + REPLAY (chain reconstruction). *(Validates: Auditability)*

#### AC-AUTH-029

- **ID:** AC-AUTH-029
- **EARS Statement:** WHILE the authority system maintains state, THE SYSTEM SHALL treat the event stream, not any derived projection, as the authoritative record of authority state.
- **Linked Requirement IDs:** FR-AUTH-018, DR-AUTH-008, NFR-AUTH-016.
- **Verification Approach:** REPLAY (stream-authoritative reconstruction) + AUDIT (projection-non-authoritative review).

#### AC-AUTH-030

- **ID:** AC-AUTH-030
- **EARS Statement:** WHEN authority event types evolve, THEN THE Authority_Fabric SHALL evolve them additively and version-tagged with deterministic upcasters such that older events remain replayable and no event is deleted or rewritten.
- **Linked Requirement IDs:** FR-AUTH-018, NFR-AUTH-016, SR-AUTH-008.
- **Verification Approach:** REPLAY (old events replayable via upcasters) + TEST (additive-versioning; no delete/rewrite path).

---

### Projection & Replay

#### AC-AUTH-031

- **ID:** AC-AUTH-031
- **EARS Statement:** WHEN reconstructing authority state, THEN THE Authority_Fabric SHALL derive it deterministically by ordered replay of the event stream, asserting hash-chain integrity and the single-owner, enumerated-power, scope-containment, single-apex, and revocation-supremacy invariants at each event, such that replaying the same stream always yields identical state.
- **Linked Requirement IDs:** FR-AUTH-019, DR-AUTH-012, NFR-AUTH-001, NFR-AUTH-014.
- **Verification Approach:** PROPERTY TEST (deterministic replay; invariants at every prefix) + REPLAY (identical-state reproduction). *(Validates: Determinism, Single Apex, Enumerated Powers, Revocation Supremacy)*

#### AC-AUTH-032

- **ID:** AC-AUTH-032
- **EARS Statement:** IF a hash-chain break or an invariant violation is detected during ordered replay, THEN THE Authority_Fabric SHALL halt replay fail-closed and SHALL flag the condition for governance investigation.
- **Linked Requirement IDs:** FR-AUTH-019, SR-AUTH-006, NFR-AUTH-015.
- **Verification Approach:** REPLAY (chain-break / invariant-break halt) + TEST (adversarial chain tamper detection).

#### AC-AUTH-033

- **ID:** AC-AUTH-033
- **EARS Statement:** WHEN an authority-state or power query is received, THEN THE Authority_Fabric SHALL return the authority view as a read-only projection derived from the event stream without mutating any authority state.
- **Linked Requirement IDs:** FR-AUTH-020, DR-AUTH-012, NFR-AUTH-008.
- **Verification Approach:** TEST (read-only query; no state change) + AUDIT (view-derivation-from-stream review).

---

### Audit Trail

#### AC-AUTH-034

- **ID:** AC-AUTH-034
- **EARS Statement:** WHEN any authority state change is committed or any decision is allowed or denied, THEN THE Authority_Fabric SHALL append a classified, hash-chained, append-only audit record capturing full provenance.
- **Linked Requirement IDs:** FR-AUTH-017, DR-AUTH-011, SR-AUTH-010, NFR-AUTH-007.
- **Verification Approach:** PROPERTY TEST (audit chain integrity) + AUDIT (provenance completeness). *(Validates: Auditability)*

#### AC-AUTH-035

- **ID:** AC-AUTH-035
- **EARS Statement:** WHILE the authority audit trail is maintained, THE SYSTEM SHALL keep it append-only, immutable, and independently offline-verifiable.
- **Linked Requirement IDs:** SR-AUTH-010, NFR-AUTH-007, DR-AUTH-011.
- **Verification Approach:** REPLAY (offline audit replay proof) + AUDIT (append-only immutability review). *(Validates: Auditability)*

---

### Reconciliation

#### AC-AUTH-036

- **ID:** AC-AUTH-036
- **EARS Statement:** WHEN a committed grant, delegation, scope, or authority change must be corrected, THEN THE Authority_Fabric SHALL apply a governed compensating event and SHALL NOT perform any silent edit or in-place deletion of a prior event, retaining the provenance required to reconcile authority events against the `AUTH-012` decision ledger.
- **Linked Requirement IDs:** DR-AUTH-014, NFR-AUTH-006, GR-AUTH-015.
- **Verification Approach:** TEST (compensating-event correction) + REPLAY (state recovery) + AUDIT (event-to-`AUTH-012`-ledger reconciliation; no in-place edit/delete path).

---

### Federation

#### AC-AUTH-037

- **ID:** AC-AUTH-037
- **EARS Statement:** WHERE a foreign (federated) authority is presented, THE SYSTEM SHALL treat it as advisory-only, deny-only, and trust-clamped, with foreign authority namespace-isolated and shadowed by local authority, and SHALL NOT perform any cross-node authority auto-grant.
- **Linked Requirement IDs:** FR-AUTH-023, DR-AUTH-015, NFR-AUTH-019.
- **Verification Approach:** TEST (advisory-only/deny-only/clamped enforcement) + SIMULATION (adversarial cross-node auto-grant blocked).

---

### Non-Inversion

#### AC-AUTH-038

- **ID:** AC-AUTH-038
- **EARS Statement:** WHEN any authority action would grant a lower-layer authority power over a higher `PCAMG-0008` layer, THEN THE Authority_Fabric SHALL reject the action, upholding the non-inversion guarantees `G-1..G-5`.
- **Linked Requirement IDs:** FR-AUTH-025, GR-AUTH-012, DR-AUTH-004.
- **Verification Approach:** PROPERTY TEST (no cross-layer inversion) + TEST (adversarial layer inversion). *(Validates: Non-Inversion)*

---

### Constitutional Invariants

#### AC-AUTH-039

- **ID:** AC-AUTH-039
- **EARS Statement:** WHILE the Authority_Fabric operates, THE SYSTEM SHALL preserve the load-bearing constitutional invariants of Single Apex (no `AA-0` instance), Registry Sovereignty (single source of truth), Deny-by-Default (`S-A6`), Propose-Not-Act, the PI-4 Evaluation Path, the PI-6 Commit Path, Determinism (`INV-6`), and Non-Inversion (`G-1..G-5`), such that no authority state changes except through a PI-6 Evolution_Fabric commit that follows an explicit PI-4 ALLOW decision, and such that all authority behavior resolves from registry records.
- **Linked Requirement IDs:** FR-AUTH-005, FR-AUTH-021, FR-AUTH-025, GR-AUTH-002, GR-AUTH-003, GR-AUTH-004, GR-AUTH-006, GR-AUTH-007, GR-AUTH-008, GR-AUTH-012, GR-AUTH-013, GR-AUTH-020, SR-AUTH-015.
- **Verification Approach:** PROPERTY TEST (no state change outside Evolution commit; deny-by-default; deterministic verdicts; no `AA-0` instance) + FORMAL VALIDATION (invariant preservation) + AUDIT (registry-sovereignty and PI-4/PI-6 path review). *(Validates: Single Apex, Registry Sovereignty, Deny-by-Default, Propose-Not-Act, PI-4 Evaluation Path, PI-6 Commit Path, Determinism, Non-Inversion)*

#### AC-AUTH-040

- **ID:** AC-AUTH-040
- **EARS Statement:** IF any authority action would violate Revocation Supremacy (exercising a revoked or halted authority), Enumerated Powers (holding a power outside its archetype vocabulary), Narrowing-Only Delegation (a delegation exceeding its delegator), Separation of Duties (proposer/certifier/ratifier/revoker not distinct), or the AD-0009 Actuation Boundary (autonomous external authority change), THEN THE Authority_Fabric SHALL reject or hold the action fail-closed with no autonomous commit and no authority-state change.
- **Linked Requirement IDs:** FR-AUTH-007, FR-AUTH-008, FR-AUTH-010, FR-AUTH-011, FR-AUTH-012, FR-AUTH-015, GR-AUTH-005, GR-AUTH-009, GR-AUTH-010, GR-AUTH-011, SR-AUTH-011, SR-AUTH-013, SR-AUTH-015.
- **Verification Approach:** PROPERTY TEST (revocation supremacy, enumerated-power, narrowing-only, SoD fail-closed) + FORMAL VALIDATION (invariant preservation) + TEST (adversarial AD-0009 autonomous external actuation blocked). *(Validates: Revocation Supremacy, Enumerated Powers, Narrowing-Only Delegation, Separation of Duties, AD-0009 Actuation Boundary)*


---

## Traceability Matrix

> Purpose: demonstrate end-to-end traceability **Constitution → Design → Requirements → Acceptance
> Criteria → Evidence → Verification → Closure** for every requirement in this document. The matrix
> below contains one row for **all 95** requirements (FR-AUTH-001..025, NFR-AUTH-001..020,
> GR-AUTH-001..020, DR-AUTH-001..015, SR-AUTH-001..015). Design Source cites the `design.md` section(s)
> already recorded in each requirement; Constitutional Source maps to the applicable UCOS canon
> principles; Acceptance Criteria cross-reference the `Linked Requirement IDs` recorded in the
> Acceptance Criteria section (AC-AUTH-001..040); Evidence, Verification, and Closure are grounded in
> `design.md` §10 Correctness Properties, §11 Evidence Requirements, §12 Completion Criteria, and §15
> Test Strategy. Every requirement maps to at least one Acceptance Criterion, one Evidence artifact, one
> Verification method, and one Closure contribution. The jointly-asserted constitutional criteria
> AC-AUTH-039 and AC-AUTH-040 backstop the load-bearing invariants.

### Matrix

| Requirement | Requirement Title | Design Source | Constitutional Source | Acceptance Criteria | Evidence | Verification | Closure |
|-------------|-------------------|---------------|-----------------------|---------------------|----------|--------------|---------|
| FR-AUTH-001 | Registry as single source of truth | §4 Registry Schema; §3 Domain Model | Registry Sovereignty; Single Source of Truth; Traceability | AC-AUTH-001 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, AUDIT, REVIEW | MANDATORY |
| FR-AUTH-002 | Reject records lacking owner/classification/version/source | §4 registry rules 1–3,7 | Registry Sovereignty; Deny-by-Default; Auditability | AC-AUTH-002 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | PROPERTY TEST, TEST | MANDATORY |
| FR-AUTH-003 | Archetype resolution; no AA-0 instance | §4 `AuthorityTypeRecord`, rule 5; §10 CP1 | Single Apex; Registry Sovereignty | AC-AUTH-005, AC-AUTH-006 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| FR-AUTH-004 | Admission deny-by-default + Evolution commit | §4 `admitAuthority`; §7 grant | Deny-by-Default; PI-6 Commit Authority; Enumerated Powers | AC-AUTH-003 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, SIMULATION | MANDATORY |
| FR-AUTH-005 | Policy evaluation before effect | §7.1 step 1; §8 deny-by-default | PI-4 Policy Evaluation; Deny-by-Default | AC-AUTH-007, AC-AUTH-039 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, SIMULATION | MANDATORY |
| FR-AUTH-006 | Fail-closed on non-ALLOW + audit | §7.1 policy-deny; §17; §10 CP3 | Deny-by-Default; PI-4 Policy Evaluation; Auditability | AC-AUTH-008, AC-AUTH-009 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-AUDIT | PROPERTY TEST, TEST | MANDATORY |
| FR-AUTH-007 | Revocation/halt supremacy checked first | §7.1 step 0; §8; §10 CP4 | Revocation Supremacy; Deny-by-Default | AC-AUTH-018, AC-AUTH-040 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| FR-AUTH-008 | Enumerated-power + scope containment | §7.1 step 2; §10 CP2,CP5; §17 | Enumerated Powers; Narrowing-Only Delegation | AC-AUTH-016, AC-AUTH-040 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| FR-AUTH-009 | Deterministic decision + resultHash | §7.1 step 3; §16; §10 CP7 | Determinism (INV-6) | AC-AUTH-010, AC-AUTH-011, AC-AUTH-012 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, REPLAY | MANDATORY |
| FR-AUTH-010 | External actuation → AD-0009 pending | §7.1 step 4; §8; §10 CP9; §17 | AD-0009 Actuation Boundary; Propose-Not-Act | AC-AUTH-024, AC-AUTH-040 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, AUDIT | MANDATORY |
| FR-AUTH-011 | Grant propose-only, narrowing, SoD, quorum, Evolution commit | §7.2 grant; §8; §10 CP6,CP8 | Propose-Not-Act; Separation of Duties; PI-6 Commit Authority | AC-AUTH-013 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | PROPERTY TEST, TEST | MANDATORY |
| FR-AUTH-012 | Delegation narrowing-only, acyclic, bounded | §4 `AuthorityDelegationRecord`; §10 CP5; §17 | Narrowing-Only Delegation | AC-AUTH-014, AC-AUTH-015 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| FR-AUTH-013 | Scope containment / namespace isolation | §4 `AuthorityScopeRecord`; §7; §3 C6 | Enumerated Powers; Registry Sovereignty | AC-AUTH-017 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| FR-AUTH-014 | Approval SoD + quorum | §7 `requestApproval`; §7.2; §8; §10 CP6 | Separation of Duties | AC-AUTH-022, AC-AUTH-023 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | PROPERTY TEST, TEST | MANDATORY |
| FR-AUTH-015 | Revocation supremacy forward-only, transitive | §6.2; §6.3; §7; §10 CP4 | Revocation Supremacy | AC-AUTH-018, AC-AUTH-019, AC-AUTH-040 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| FR-AUTH-016 | Emergency halt non-bypassable + distinct resume | §7; §8; §16; §17 | Deny-by-Default; Separation of Duties | AC-AUTH-020, AC-AUTH-021 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, SIMULATION | MANDATORY |
| FR-AUTH-017 | Append hash-chained event on state change | §6.1 event vocab; §10 CP10 | Event Sourcing; Auditability | AC-AUTH-027, AC-AUTH-028, AC-AUTH-034 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-AUDIT | PROPERTY TEST, TEST | MANDATORY |
| FR-AUTH-018 | Stream authoritative; additive versioned events | §6 Event Model; §14 event evolution | Event Sourcing; Auditability | AC-AUTH-029, AC-AUTH-030 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-AUDIT | REPLAY, REVIEW | MANDATORY |
| FR-AUTH-019 | Deterministic replay projection with invariant asserts | §6.3 `projectAuthorityState`; §10 CP4,CP7 | Determinism (INV-6); Revocation Supremacy; Single Apex | AC-AUTH-031, AC-AUTH-032 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, REPLAY | MANDATORY |
| FR-AUTH-020 | Read-only authority projection | §7 `getAuthority`/`listPowers`; §16 | Event Sourcing; Propose-Not-Act | AC-AUTH-033 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, REVIEW | SUPPORTING |
| FR-AUTH-021 | Evolution-only commit (sole path) | §7.2; §4 admit; §8; §10 CP8 | PI-6 Commit Authority; Propose-Not-Act | AC-AUTH-025, AC-AUTH-026, AC-AUTH-039 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, REVIEW | MANDATORY |
| FR-AUTH-022 | Board-only archetype declaration | §7 `declareAuthorityType`; §8.1; §13 | Constitutional Compliance; Separation of Duties | AC-AUTH-005 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | TEST, REVIEW | MANDATORY |
| FR-AUTH-023 | Federation advisory-only/deny-only/clamped | §16 Federation; §8; §5 floor | Deny-by-Default; Platform Independence | AC-AUTH-037 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, SIMULATION | MANDATORY |
| FR-AUTH-024 | Register-then-retire; consumer via instance registration | §9 forward consumers; §14; §3 | Registry Sovereignty; Platform Independence | AC-AUTH-037, AC-AUTH-039 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-DESIGN | TEST, REVIEW | SUPPORTING |
| FR-AUTH-025 | Non-inversion; single apex preservation | §2.4; §8; §10 CP1,CP11 | Non-Inversion; Single Apex | AC-AUTH-005, AC-AUTH-038 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| NFR-AUTH-001 | Determinism (pure functions of recorded inputs) | §6.3; §7.1 step 3; §16; §10 CP7 | Determinism (INV-6) | AC-AUTH-010, AC-AUTH-011, AC-AUTH-012, AC-AUTH-031 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, REPLAY | MANDATORY |
| NFR-AUTH-002 | Bounded decision-path latency (target PENDING ASR) | §7.1 gate sequence; §16; §19 OI-4 | PI-4 Policy Evaluation; Determinism (INV-6) | AC-AUTH-007 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, REVIEW | SUPPORTING [1] |
| NFR-AUTH-003 | Scalability via per-stream partitioning (PENDING ASR) | §6 Event Model; §16; §19 OI-4 | Event Sourcing | AC-AUTH-027 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-DESIGN | REVIEW | SUPPORTING [1] |
| NFR-AUTH-004 | Core availability under federation partition (PENDING ASR) | §16 Federation; §9; §19 OI-4 | Deny-by-Default | AC-AUTH-037 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, SIMULATION | SUPPORTING [1] |
| NFR-AUTH-005 | Fail-closed reliability (no silent drop) | §16 failure; §17; §10 CP3,CP4 | Deny-by-Default; Revocation Supremacy | AC-AUTH-008, AC-AUTH-040 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| NFR-AUTH-006 | Recoverability by replay + compensating events (PENDING ASR) | §16 Recovery; §6.3; §14; §19 OI-4 | Event Sourcing; Determinism (INV-6) | AC-AUTH-031, AC-AUTH-036 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-RECON | REPLAY, TEST | MANDATORY |
| NFR-AUTH-007 | Auditability (classified hash-chained, offline verifiable) | §6; §16; §18 S6; §10 CP10 | Auditability | AC-AUTH-034, AC-AUTH-035 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-AUDIT | PROPERTY TEST, REPLAY, AUDIT | MANDATORY |
| NFR-AUTH-008 | Observability (read-models + structured events) | §16 Observability; §7; §6.1 | Auditability; Event Sourcing | AC-AUTH-033 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, REVIEW | SUPPORTING |
| NFR-AUTH-009 | Non-waivable S1/S3/S4 security floors | §18 S1/S3/S4; §7.1; §4 | Deny-by-Default; Constitutional Compliance | AC-AUTH-002, AC-AUTH-007 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-SEC | TEST, REVIEW | MANDATORY |
| NFR-AUTH-010 | Registry-/config-driven (no hardcoded logic) | §4 rule 4; §5; §2.1 | Registry Sovereignty; Single Source of Truth | AC-AUTH-001, AC-AUTH-004 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | REVIEW, TEST | MANDATORY |
| NFR-AUTH-011 | Platform independence (technology-neutral) | Preamble; §2.4; header notation | Platform Independence | AC-AUTH-039 | EV-CAP-AUTH-DESIGN | REVIEW | MANDATORY |
| NFR-AUTH-012 | Extensibility by instance registration | §9; §14; §10 CP12 | Platform Independence; Registry Sovereignty | AC-AUTH-037 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, REVIEW | SUPPORTING |
| NFR-AUTH-013 | Hierarchical config with non-waivable floors | §5 Configuration Model | Deny-by-Default; Constitutional Compliance | AC-AUTH-015 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| NFR-AUTH-014 | Data integrity (single-owner/enumerated/scope/apex/revocation invariants) | §6.3; §4 rules 1,5,6; §10 CP1,CP2,CP4 | Enumerated Powers; Single Apex; Revocation Supremacy | AC-AUTH-006, AC-AUTH-017, AC-AUTH-031 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| NFR-AUTH-015 | Event consistency (ordered, hash-chained, self-halting) | §6.1; §6.3; §17 chain-break | Event Sourcing; Auditability | AC-AUTH-027, AC-AUTH-032 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-AUDIT | PROPERTY TEST, TEST | MANDATORY |
| NFR-AUTH-016 | Replayability (additive upcasters, identical state) | §6; §6.3; §14 event evolution | Event Sourcing; Determinism (INV-6) | AC-AUTH-029, AC-AUTH-030, AC-AUTH-031 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-AUDIT | REPLAY, REVIEW | MANDATORY |
| NFR-AUTH-017 | Orphan-free traceability lineage | §0 Anchors; §11 EV-TRACE; §20 | Traceability | AC-AUTH-039 | EV-CAP-AUTH-TRACE, EV-CAP-AUTH-DESIGN | REVIEW, AUDIT | MANDATORY |
| NFR-AUTH-018 | Governance compliance (subordinate, no amendment) | §8; §0; Preamble | Constitutional Compliance | AC-AUTH-039 | EV-CAP-AUTH-DESIGN | REVIEW | MANDATORY |
| NFR-AUTH-019 | Operational resilience (fail-closed, halt, partition) | §16; §7.1 halt; §17 | Deny-by-Default; Revocation Supremacy | AC-AUTH-020, AC-AUTH-037 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, SIMULATION | MANDATORY |
| NFR-AUTH-020 | Future capability compatibility (versioned, additive) | §9; §14; §10 CP12; §2.4 | Platform Independence; Registry Sovereignty | AC-AUTH-037 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, REVIEW | SUPPORTING |
| GR-AUTH-001 | Article IX scoped release before construction | §8; §12 item 10; §13; §19 OI-1 | Constitutional Compliance; Propose-Not-Act | AC-AUTH-039 | EV-CAP-AUTH-DESIGN, EV-CAP-AUTH-AUDIT | AUDIT, REVIEW | MANDATORY |
| GR-AUTH-002 | Registry sovereignty (no uninvalidated cache) | §4 rules 1–8; §2.1; §3 | Registry Sovereignty; Single Source of Truth | AC-AUTH-001, AC-AUTH-004, AC-AUTH-039 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | REVIEW, TEST, AUDIT | MANDATORY |
| GR-AUTH-003 | PI-4 policy evaluation on every governed action | §7.1 step 1; §8; §9 | PI-4 Policy Evaluation | AC-AUTH-007, AC-AUTH-039 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, SIMULATION | MANDATORY |
| GR-AUTH-004 | PI-6 sole commit authority | §7.2; §4; §8; §10 CP8 | PI-6 Commit Authority | AC-AUTH-003, AC-AUTH-025, AC-AUTH-039 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, REVIEW | MANDATORY |
| GR-AUTH-005 | AD-0009 external actuation control | §7.1 step 4; §8; §10 CP9; §17 | AD-0009 Actuation Boundary; Propose-Not-Act | AC-AUTH-024, AC-AUTH-040 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, AUDIT | MANDATORY |
| GR-AUTH-006 | Deny-by-default governance | §8; §5 floor; §10 CP3 | Deny-by-Default | AC-AUTH-008, AC-AUTH-009, AC-AUTH-039 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| GR-AUTH-007 | Propose-not-act (no direct state mutation) | §7; §2.3; §10 CP8 | Propose-Not-Act | AC-AUTH-013, AC-AUTH-026, AC-AUTH-039 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, REVIEW | MANDATORY |
| GR-AUTH-008 | Single apex preservation (no AA-0 instance) | §8 Apex; §4 rule 5; §1; §10 CP1 | Single Apex | AC-AUTH-005, AC-AUTH-039 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| GR-AUTH-009 | Revocation supremacy governance | §8; §8.1; §6.2; §10 CP4 | Revocation Supremacy | AC-AUTH-018, AC-AUTH-019, AC-AUTH-040 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| GR-AUTH-010 | Separation of duties + quorum | §8 SoD/Ratification; §8.1; §7.2; §10 CP6 | Separation of Duties | AC-AUTH-013, AC-AUTH-021, AC-AUTH-022, AC-AUTH-023 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | PROPERTY TEST, TEST | MANDATORY |
| GR-AUTH-011 | Narrowing-only delegation governance | §4; §7; §10 CP5; §17 | Narrowing-Only Delegation | AC-AUTH-014, AC-AUTH-015, AC-AUTH-040 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| GR-AUTH-012 | Non-inversion guarantee (G-1..G-5) | §2.4; §8; §14; §10 CP11 | Non-Inversion | AC-AUTH-038, AC-AUTH-039 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| GR-AUTH-013 | Deterministic governance verdicts | §7.1 gates; §8; §10 CP7 | Determinism (INV-6) | AC-AUTH-011, AC-AUTH-012, AC-AUTH-039 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, REPLAY | MANDATORY |
| GR-AUTH-014 | Authority rule registration (registered before honored) | §4 rule 4; §5; §2.1 | Registry Sovereignty; Single Source of Truth | AC-AUTH-001, AC-AUTH-004 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, REVIEW | MANDATORY |
| GR-AUTH-015 | Governance traceability (action → authority/policy/canon/audit) | §0; §11 EV-TRACE; §20; §8 | Traceability; Auditability | AC-AUTH-036, AC-AUTH-039 | EV-CAP-AUTH-TRACE, EV-CAP-AUTH-AUDIT | REVIEW, AUDIT | MANDATORY |
| GR-AUTH-016 | Versioning + migration-only evolution | §4 rule 3; §14; §7 v1.0 | Constitutional Compliance; Traceability | AC-AUTH-030 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-DESIGN | REVIEW, TEST | MANDATORY |
| GR-AUTH-017 | Approval workflow (no auto-execute) | §13; §8.1; §7 `declareAuthorityType`; §19 OI-1 | AD-0009 Actuation Boundary; Constitutional Compliance | AC-AUTH-024 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, REVIEW | MANDATORY |
| GR-AUTH-018 | Closure evidence production (missing ⇒ FAIL) | §11 full table; §12 | Constitutional Compliance; Auditability | AC-AUTH-034, AC-AUTH-039 | EV-CAP-AUTH-DESIGN, EV-CAP-AUTH-TRACE, EV-CAP-AUTH-AUDIT | AUDIT, REVIEW | MANDATORY |
| GR-AUTH-019 | Compliance verification (§12 conjunction) | §12; §11; §10; §15.3 | Constitutional Compliance | AC-AUTH-039 | EV-CAP-AUTH-DESIGN, EV-CAP-AUTH-TRACE, EV-CAP-AUTH-SEC | AUDIT, REVIEW | MANDATORY |
| GR-AUTH-020 | Constitutional invariant protection (floors, Ω∞, lock) | Preamble; §5 floors; §18; §8 | Constitutional Compliance; Deny-by-Default | AC-AUTH-039, AC-AUTH-040 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | PROPERTY TEST, REVIEW, FORMAL VALIDATION | MANDATORY |
| DR-AUTH-001 | Authority records (owner/keyRef/powers/source/version) | §4 `AuthorityRecord`, rules 1–8; §3 C1 | Registry Sovereignty; Enumerated Powers; Traceability | AC-AUTH-001, AC-AUTH-002 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, PROPERTY TEST | MANDATORY |
| DR-AUTH-002 | Authority type records (archetype vocabulary) | §4 `AuthorityTypeRecord`, rule 5; §3 C2 | Single Apex; Registry Sovereignty | AC-AUTH-006 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, REVIEW | MANDATORY |
| DR-AUTH-003 | Scope records (namespace-isolated, contained) | §4 `AuthorityScopeRecord`; §3 C6; §16 | Enumerated Powers; Registry Sovereignty | AC-AUTH-016, AC-AUTH-017 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, PROPERTY TEST | MANDATORY |
| DR-AUTH-004 | Delegation records (narrowing subset, contained) | §4 `AuthorityDelegationRecord`; §3 C5; §10 CP5 | Narrowing-Only Delegation; Non-Inversion | AC-AUTH-014, AC-AUTH-038 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| DR-AUTH-005 | Policy records (externalized, deny-by-default floor) | §4 `AuthorityPolicyRecord`, rule 4; §3 C7; §5 | Registry Sovereignty; Deny-by-Default | AC-AUTH-009 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, REVIEW | MANDATORY |
| DR-AUTH-006 | Revocation records (forward-only, propagate) | §4 `RevocationRecord`; §6.2; §3 C4; §10 CP4 | Revocation Supremacy | AC-AUTH-019 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| DR-AUTH-007 | Proposal data (actor/authority/scope) | §7 propose-only; §2.3; §7.2; §10 CP8 | Propose-Not-Act | AC-AUTH-013, AC-AUTH-026 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, REVIEW | MANDATORY |
| DR-AUTH-008 | Authority events (append-only, stream authoritative) | §6.1 `AuthorityEvent`; §6; §10 CP10 | Event Sourcing; Auditability | AC-AUTH-027, AC-AUTH-029 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-AUDIT | PROPERTY TEST, REPLAY | MANDATORY |
| DR-AUTH-009 | Event metadata (resultHash, classification, authorityRef) | §6.1 `AuthorityEvent`; §7.1; §18 S4 | Event Sourcing; Determinism (INV-6); Auditability | AC-AUTH-010, AC-AUTH-028 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-AUDIT | REVIEW, PROPERTY TEST | MANDATORY |
| DR-AUTH-010 | Hash chains (prevHash/hash, genesis-anchored) | §6.1; §6.3; §10 CP10 | Auditability; Event Sourcing | AC-AUTH-028, AC-AUTH-032 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-AUDIT | PROPERTY TEST, TEST | MANDATORY |
| DR-AUTH-011 | Audit records (classified, offline-verifiable provenance) | §6; §16; §18 S6; §11 EV-AUDIT | Auditability | AC-AUTH-034, AC-AUTH-035 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-AUDIT | REPLAY, PROPERTY TEST, REVIEW | MANDATORY |
| DR-AUTH-012 | Authority state projections (read-only, deterministic) | §6.3; §7 `getAuthority`; §10 CP4,CP7 | Determinism (INV-6); Revocation Supremacy | AC-AUTH-031, AC-AUTH-033 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| DR-AUTH-013 | Approval & decision records (SoD, quorum, resultHash) | §3 C8,C9; §7.1; §7.2; §10 CP6,CP7 | Separation of Duties; Determinism (INV-6) | AC-AUTH-010, AC-AUTH-022 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | POLICY TEST, PROPERTY TEST | MANDATORY |
| DR-AUTH-014 | Reconciliation records (compensating, AUTH-012) | §14 Rollback; §16 Recovery; §6; §0 | Event Sourcing; Auditability; Traceability | AC-AUTH-036 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-RECON, EV-CAP-AUTH-AUDIT | TEST, REVIEW | MANDATORY |
| DR-AUTH-015 | Cross-capability references (registry/contract/event only) | §9; §2.4; §14; §3 | Registry Sovereignty; Platform Independence | AC-AUTH-037 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-DESIGN | TEST, REVIEW | SUPPORTING |
| SR-AUTH-001 | Authorization via PI-4 (S1) | §7.1 step 1; §18 S1; §8 | PI-4 Policy Evaluation; Deny-by-Default | AC-AUTH-007 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-SEC | TEST, SIMULATION | MANDATORY |
| SR-AUTH-002 | Authentication integration (S1) | §7.1 preconditions; §18 S1 | Deny-by-Default; Constitutional Compliance | AC-AUTH-007 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-SEC | TEST, REVIEW | MANDATORY |
| SR-AUTH-003 | Deny-by-default (fail-closed + audit) | §7.1 policy-deny; §5 floor; §10 CP3; §17 | Deny-by-Default | AC-AUTH-008, AC-AUTH-009 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | PROPERTY TEST, TEST | MANDATORY |
| SR-AUTH-004 | Policy enforcement (constraints fail-closed) | §7.1 steps 2–3; §8; §17 | Enumerated Powers; Deny-by-Default | AC-AUTH-016 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | PROPERTY TEST, TEST | MANDATORY |
| SR-AUTH-005 | Key & signature management (S3, keys by reference) | §18 S3; §4 `keyRef`; §1 | Constitutional Compliance; Auditability | AC-AUTH-002 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-SEC | REVIEW, TEST | MANDATORY |
| SR-AUTH-006 | Tamper detection (halt fail-closed on chain break) | §6.3; §17 chain-break; §18 S6 | Auditability; Event Sourcing | AC-AUTH-032 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-AUDIT, EV-CAP-AUTH-SEC | REPLAY, TEST | MANDATORY |
| SR-AUTH-007 | Hash integrity (canonical, offline-verifiable) | §6.1; §6.3; §18 S6 | Auditability | AC-AUTH-028 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-AUDIT, EV-CAP-AUTH-SEC | PROPERTY TEST, REPLAY | MANDATORY |
| SR-AUTH-008 | Event integrity (append-only, additive versioning) | §6.1; §6; §14 | Event Sourcing; Auditability | AC-AUTH-030 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-AUDIT, EV-CAP-AUTH-SEC | PROPERTY TEST, TEST, REVIEW | MANDATORY |
| SR-AUTH-009 | Registry protection (Evolution commit, no cache) | §4 `admitAuthority`, rules 1–8; §18; §8 | Registry Sovereignty; PI-6 Commit Authority | AC-AUTH-002, AC-AUTH-003, AC-AUTH-004 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | TEST, REVIEW | MANDATORY |
| SR-AUTH-010 | Audit protection (immutable append-only) | §18 S6; §16; §6; §11 EV-AUDIT | Auditability | AC-AUTH-034, AC-AUTH-035 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-AUDIT, EV-CAP-AUTH-SEC | REPLAY, TEST | MANDATORY |
| SR-AUTH-011 | Revocation enforcement (supremacy non-bypassable) | §7.1 step 0; §6.2; §6.3; §10 CP4 | Revocation Supremacy | AC-AUTH-018, AC-AUTH-040 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | PROPERTY TEST, TEST | MANDATORY |
| SR-AUTH-012 | Emergency halt enforcement (non-bypassable freeze) | §7; §8; §16 | Deny-by-Default; Separation of Duties | AC-AUTH-020, AC-AUTH-021 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | TEST, SIMULATION | MANDATORY |
| SR-AUTH-013 | Separation of authority (SoD + quorum + distinct resume) | §8 SoD/Ratification; §8.1; §7.2 | Separation of Duties | AC-AUTH-021, AC-AUTH-022, AC-AUTH-023, AC-AUTH-040 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | PROPERTY TEST, TEST | MANDATORY |
| SR-AUTH-014 | Governance enforcement (floor relaxation rejected) | §5 floors, `resolveConfig`; §18; §8 | Deny-by-Default; Constitutional Compliance | AC-AUTH-039 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | PROPERTY TEST, TEST | MANDATORY |
| SR-AUTH-015 | Constitutional invariant protection (floors, Ω∞, apex, non-inversion) | Preamble; §5 floors; §18; §8; §10 CP1,CP11 | Constitutional Compliance; Single Apex; Non-Inversion | AC-AUTH-039, AC-AUTH-040 | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | PROPERTY TEST, REVIEW, FORMAL VALIDATION | MANDATORY |

**Closure footnotes.**

- **[1]** `NFR-AUTH-002` (Performance), `NFR-AUTH-003` (Scalability), and `NFR-AUTH-004`
  (Availability) are classified **SUPPORTING** (not MANDATORY) solely because their quantitative
  targets are `PENDING ASR RATIFICATION` (`design.md` §16, §19 OI-4); their qualitative bounded /
  fail-closed behaviors are nonetheless verified. They are **not** OPTIONAL: they become MANDATORY once
  the `UCOS-ASR-NFR-001` values are ratified. No requirement in this matrix is classified OPTIONAL —
  every safety, governance, and authority-integrity requirement defaults to MANDATORY.

---

### Evidence Artifact Definitions

- **EV-CAP-AUTH-DESIGN** — *Design & specification approval evidence.* The approved design,
  requirements, and (later) tasks artifacts, plus platform-independence and governance-subordination
  (no `AUTH-*` amendment) review. Maps `design.md` §11 `EV-DESIGN`.
- **EV-CAP-AUTH-IMP** — *Implementation evidence.* The additive
  `packages/platform-runtime/src/control/authority/*` implementation realizing each requirement,
  produced with **zero** prohibited-core-dir change, **zero** `AUTH-001..012` amendment, and a green
  existing baseline. Rolls up `design.md` §11 `EV-ADDITIVE` and the `EV-CODE-*` code artifacts.
- **EV-CAP-AUTH-TEST** — *Test evidence.* Passing unit, property-based (≥100 iterations, tagged to the
  corresponding `design.md` §10 correctness property), integration, and simulation results — including
  single-apex, enumerated-power, deny-by-default, revocation-supremacy, narrowing-only delegation, SoD,
  and determinism properties. Rolls up `design.md` §11 `EV-CODE-APEX/POWER/DENY/RVK/DELEG/DET/SOD` and
  §15 Test Strategy.
- **EV-CAP-AUTH-AUDIT** — *Audit-trail evidence.* Hash-chained `AUTH_*` event records plus an offline
  authority-state replay proof demonstrating tamper-evident, append-only auditability. Maps `design.md`
  §11 `EV-AUDIT` and §16 Auditability.
- **EV-CAP-AUTH-RECON** — *Reconciliation evidence.* Governed compensating-event corrections and the
  provenance reconciling authority events against the `AUTH-012` decision ledger. Grounds `design.md`
  §14 Rollback and §16 Recovery.
- **EV-CAP-AUTH-TRACE** — *Traceability evidence.* This Traceability Matrix and its validation,
  demonstrating orphan-free lineage Constitution → Design → Requirements → AC → Evidence → Verification
  → Closure. Maps `design.md` §11 `EV-TRACE` and `AUTH-010`.
- **EV-CAP-AUTH-SEC** — *Security conformance evidence.* `AUTH-008` conformance (S1/S3/S4, signed
  authorities, keys-by-reference) plus the §15.3 adversarial suite (AC1–ACn: apex forgery, self-grant,
  power widening, scope escape, delegation cycles/overflow, revocation bypass, halt bypass, SoD
  collusion, quorum evasion, non-deterministic decision injection, audit-chain tampering, external
  actuation without AD-0009, cross-node foreign-authority auto-grant) with **0 residual High/High**.
  Maps `design.md` §11 `EV-SEC` and `EV-THREAT`.

---

## Evidence Coverage Matrix

> Purpose: demonstrate **100% evidence coverage** across three axes — Requirements → Evidence,
> Acceptance Criteria → Evidence, and Verification Methods → Evidence — consistent with the Traceability
> Matrix above (which records the per-requirement `EV-CAP-AUTH-*` links) and with the seven Evidence
> Artifact Definitions. All 95 requirements and all 40 acceptance criteria map to at least one evidence
> artifact; every verification method is discharged by at least one artifact.

### Requirements → Evidence (grouped)

| Requirement group | Primary evidence artifacts | Coverage |
|-------------------|----------------------------|----------|
| FR-AUTH-001..025 (Functional) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST (+ EV-CAP-AUTH-AUDIT for 017/018; EV-CAP-AUTH-SEC for 002/011/014/022; EV-CAP-AUTH-DESIGN for 024) | 25 / 25 |
| NFR-AUTH-001..020 (Non-Functional) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST (+ EV-CAP-AUTH-AUDIT for 007/015/016; EV-CAP-AUTH-RECON for 006; EV-CAP-AUTH-DESIGN for 003/011; EV-CAP-AUTH-TRACE for 017; EV-CAP-AUTH-SEC for 009) | 20 / 20 |
| GR-AUTH-001..020 (Governance) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST (+ EV-CAP-AUTH-DESIGN for 001/016/018/019; EV-CAP-AUTH-AUDIT for 001/015/018; EV-CAP-AUTH-TRACE for 015/018/019; EV-CAP-AUTH-SEC for 010/019/020) | 20 / 20 |
| DR-AUTH-001..015 (Data) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST (+ EV-CAP-AUTH-AUDIT for 008/009/010/011; EV-CAP-AUTH-RECON for 014; EV-CAP-AUTH-SEC for 013; EV-CAP-AUTH-DESIGN for 015) | 15 / 15 |
| SR-AUTH-001..015 (Security) | EV-CAP-AUTH-SEC, EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST (+ EV-CAP-AUTH-AUDIT for 006/007/008/010/011) | 15 / 15 |
| **Total** | **7 artifacts (EV-CAP-AUTH-DESIGN, -IMP, -TEST, -AUDIT, -RECON, -TRACE, -SEC)** | **95 / 95** |

### Acceptance Criteria → Evidence

| Acceptance Criteria | Evidence artifacts |
|---------------------|--------------------|
| AC-AUTH-001, -004 (Registry sovereignty) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-TRACE |
| AC-AUTH-002, -003 (Registration integrity / admission) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC |
| AC-AUTH-005, -006 (Single apex / enumerated powers) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST |
| AC-AUTH-007, -008, -009 (Policy / deny-by-default) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC, EV-CAP-AUTH-AUDIT |
| AC-AUTH-010, -011, -012 (Determinism) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST |
| AC-AUTH-013, -014, -015, -016 (Grant / delegation / power-scope) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC |
| AC-AUTH-017 (Scope containment) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST |
| AC-AUTH-018, -019 (Revocation supremacy) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC |
| AC-AUTH-020, -021 (Emergency halt) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC |
| AC-AUTH-022, -023 (Approval / SoD / quorum) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC |
| AC-AUTH-024 (External actuation / AD-0009) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST |
| AC-AUTH-025, -026 (Commit / propose-not-act) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST |
| AC-AUTH-027, -028, -029, -030 (Event sourcing) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-AUDIT |
| AC-AUTH-031, -032, -033 (Projection / replay) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-AUDIT |
| AC-AUTH-034, -035 (Audit trail) | EV-CAP-AUTH-AUDIT, EV-CAP-AUTH-IMP, EV-CAP-AUTH-SEC |
| AC-AUTH-036 (Reconciliation) | EV-CAP-AUTH-RECON, EV-CAP-AUTH-AUDIT, EV-CAP-AUTH-IMP |
| AC-AUTH-037 (Federation) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-DESIGN |
| AC-AUTH-038 (Non-inversion) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST |
| AC-AUTH-039, -040 (Constitutional invariants) | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-TRACE, EV-CAP-AUTH-SEC, EV-CAP-AUTH-AUDIT |
| **Coverage** | **40 / 40** |

### Verification Methods → Evidence

| Verification method | Discharged by |
|---------------------|---------------|
| TEST | EV-CAP-AUTH-TEST, EV-CAP-AUTH-IMP, EV-CAP-AUTH-SEC, EV-CAP-AUTH-RECON |
| PROPERTY TEST | EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC |
| SIMULATION | EV-CAP-AUTH-TEST |
| REPLAY | EV-CAP-AUTH-AUDIT, EV-CAP-AUTH-RECON, EV-CAP-AUTH-TEST |
| AUDIT | EV-CAP-AUTH-AUDIT, EV-CAP-AUTH-RECON, EV-CAP-AUTH-TRACE, EV-CAP-AUTH-IMP |
| FORMAL VALIDATION | EV-CAP-AUTH-TEST (invariant proofs), EV-CAP-AUTH-SEC |
| REVIEW | EV-CAP-AUTH-DESIGN, EV-CAP-AUTH-TRACE, EV-CAP-AUTH-IMP |
| POLICY TEST | EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC |
| **Coverage** | **8 / 8 methods discharged** |

### Traceability Validation

1. **Requirements without Design Source:** NONE — all 95 requirements cite one or more `design.md` sections.
2. **Requirements without Constitutional Source:** NONE — all 95 requirements map to one or more UCOS canon principles.
3. **Requirements without Acceptance Criteria:** NONE — all 95 requirements map to at least one AC-AUTH criterion (review-/audit-class quality attributes map to the nearest covering criterion and/or the constitutional criteria AC-AUTH-039/040).
4. **Requirements without Evidence:** NONE — all 95 requirements map to at least one EV-CAP-AUTH-* artifact.
5. **Requirements without Verification:** NONE — all 95 requirements name at least one verification method from {TEST, PROPERTY TEST, POLICY TEST, SIMULATION, REPLAY, AUDIT, FORMAL VALIDATION, REVIEW}.
6. **Requirements without Closure Contribution:** NONE — all 95 requirements are classified MANDATORY or SUPPORTING; none is OPTIONAL.

### Coverage Report

- **Uncovered Requirements:** NONE — all 95 requirements (FR 25, NFR 20, GR 20, DR 15, SR 15) map to ≥1 evidence artifact.
- **Uncovered Acceptance Criteria:** NONE — all 40 acceptance criteria (AC-AUTH-001..040) map to ≥1 evidence artifact.
- **Uncovered Verification Methods:** NONE — all methods are discharged by ≥1 artifact.
- **Evidence Coverage:** **100%** across Requirements → Evidence, Acceptance Criteria → Evidence, and Verification → Evidence.

### Traceability Coverage Summary

| Metric | Value |
|--------|-------|
| Total Requirements | 95 (FR 25, NFR 20, GR 20, DR 15, SR 15) |
| Total Acceptance Criteria | 40 (AC-AUTH-001..040) |
| Requirements with ≥1 Design Source | 95 / 95 |
| Requirements with ≥1 Constitutional Source | 95 / 95 |
| Requirements with ≥1 Acceptance Criterion | 95 / 95 |
| Total Evidence Links | 95 / 95 requirements linked (7 evidence artifacts: EV-CAP-AUTH-DESIGN, -IMP, -TEST, -AUDIT, -RECON, -TRACE, -SEC) |
| Total Verification Links | 95 / 95 requirements linked |
| Total Closure Links | 95 / 95 requirements classified (MANDATORY / SUPPORTING; 0 OPTIONAL) |
| **Coverage Percentage** | **100%** |
| Orphans | **0** |


---

## Completion Criteria

> Scope note: The twenty completion criteria below (CC-AUTH-001..020) are the fail-closed conjunction
> that governs CAP-AUTHORITY closure. They align with `design.md` §12 Completion Criteria (all must hold
> — absence of any is a FAIL per `OP-CERT-001`) and §13 Implementation Phases (waves W0–W9). Each
> criterion references the `EV-CAP-AUTH-*` evidence that proves it, names a verification method from
> {TEST, PROPERTY TEST, SIMULATION, REPLAY, AUDIT, FORMAL VALIDATION, REVIEW}, and is classified
> MANDATORY or SUPPORTING for closure. Construction is complete **only when every MANDATORY criterion
> holds**; SUPPORTING criteria strengthen but do not by themselves gate closure.

| ID | Criterion | Evidence Required | Verification Method | Closure Impact |
|----|-----------|-------------------|---------------------|----------------|
| CC-AUTH-001 | **Design Approved** — CAP-AUTHORITY design is approved, platform-independent, and governance-subordinate (no `AUTH-*` amendment). | EV-CAP-AUTH-DESIGN | REVIEW | MANDATORY |
| CC-AUTH-002 | **Requirements Approved** — All 95 requirements (FR/NFR/GR/DR/SR) are derived from the design and approved. | EV-CAP-AUTH-DESIGN, EV-CAP-AUTH-TRACE | REVIEW | MANDATORY |
| CC-AUTH-003 | **Traceability Complete** — Orphan-free lineage Constitution → Design → Requirements → AC → Evidence → Verification → Closure for all 95 requirements and 40 AC. | EV-CAP-AUTH-TRACE | AUDIT, REVIEW | MANDATORY |
| CC-AUTH-004 | **Registry & Type Schemas Implemented** — Authority Type Registry (`AA-0..AA-8`), Authority Registry, and the ten constructs (`AUTH-C1..C10`) implemented registry-first with owner/classification/version/source, no hardcoded authorization logic. | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, REVIEW | MANDATORY |
| CC-AUTH-005 | **Admission Fail-Closed** — Admission enforces single-owner, enumerated-power containment, no-self-grant, no `AA-0` instance, and Evolution-only commit. | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, PROPERTY TEST | MANDATORY |
| CC-AUTH-006 | **Event Store Implemented** — Append-only, per-stream, hash-chained Authority Event Store is the authoritative record; additive versioned events. | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-AUDIT | PROPERTY TEST, TEST | MANDATORY |
| CC-AUTH-007 | **Projection Engine Implemented** — Authority state is a read-only projection reconstructed by deterministic ordered replay with chain-integrity and invariant asserts. | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, REPLAY | MANDATORY |
| CC-AUTH-008 | **Scope & Policy Implemented** — Scope Manager enforces containment/namespace isolation; Authority Policy records bind PI-4; config floors enforced. | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, PROPERTY TEST | MANDATORY |
| CC-AUTH-009 | **Decision Engine Implemented** — Deterministic `decide` with revocation/halt-first supremacy, PI-4 deny-by-default, enumerated-power/scope gates, and `resultHash` verifier. | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, REPLAY | MANDATORY |
| CC-AUTH-010 | **Grant & Delegation Implemented** — Grant Engine (narrowing, no self-grant, Evolution commit) and Delegation Engine (narrowing-only, non-circular, bounded depth). | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | PROPERTY TEST, TEST | MANDATORY |
| CC-AUTH-011 | **Approval & SoD Implemented** — Approval Manager enforces SoD (proposer/certifier/ratifier/revoker distinct) and quorum floor; AD-0009 external-actuation escalation. | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | PROPERTY TEST, TEST | MANDATORY |
| CC-AUTH-012 | **Revocation & Halt Implemented** — Revocation supremacy (forward-only, transitive) and non-bypassable Emergency Halt/Resume with distinct resume authority. | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-SEC | PROPERTY TEST, TEST | MANDATORY |
| CC-AUTH-013 | **Security Controls Implemented** — Non-waivable S1/S3/S4 floors enforced; keys by reference; configuration floor relaxation rejected. | EV-CAP-AUTH-SEC, EV-CAP-AUTH-IMP | TEST, PROPERTY TEST, REVIEW | MANDATORY |
| CC-AUTH-014 | **Audit Controls Implemented** — Every commit/decision appends a classified, hash-chained, append-only audit record; tamper halts replay fail-closed. | EV-CAP-AUTH-AUDIT, EV-CAP-AUTH-IMP | AUDIT, REPLAY | MANDATORY |
| CC-AUTH-015 | **Core Property Tests Passing** — Single-apex, enumerated-power, deny-by-default, revocation-supremacy, narrowing-only delegation, SoD, and deterministic-replay property tests pass at ≥100 iterations, tagged to `design.md` §10. | EV-CAP-AUTH-TEST | PROPERTY TEST | MANDATORY |
| CC-AUTH-016 | **Determinism Validated** — Identical inputs and streams yield identical verdicts and `resultHash` across runs and hosts; non-reproducible decisions rejected. | EV-CAP-AUTH-TEST, EV-CAP-AUTH-AUDIT | PROPERTY TEST, REPLAY | MANDATORY |
| CC-AUTH-017 | **PI-4 Path Verified** — Every governed action obtains an explicit PI-4 authorization decision before any constraint/effect. | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, SIMULATION | MANDATORY |
| CC-AUTH-018 | **PI-6 Path Verified** — Every authority mutation and registration commits solely through PI-6 Evolution Fabric; no alternate write path exists. | EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST | TEST, AUDIT | MANDATORY |
| CC-AUTH-019 | **Adversarial Suite Passed** — The §15.3 adversarial suite (apex forgery, self-grant, power widening, scope escape, delegation cycle/overflow, revocation/halt bypass, SoD collusion, quorum evasion, non-deterministic injection, audit tampering, external actuation without AD-0009, cross-node auto-grant) passes with 0 residual High/High. | EV-CAP-AUTH-SEC | TEST, PROPERTY TEST | MANDATORY |
| CC-AUTH-020 | **Evidence Accepted & Closure Review Passed** — All seven `EV-CAP-AUTH-*` artifacts present, integrity-verifiable, and accepted; additivity preserved (0 prohibited-core-dir change, 0 `AUTH-*` amendment, baseline green); scoped Article IX release (OI-1) recorded; Authority Board closure review confirms the conjunction. | EV-CAP-AUTH-DESIGN, EV-CAP-AUTH-IMP, EV-CAP-AUTH-TEST, EV-CAP-AUTH-AUDIT, EV-CAP-AUTH-RECON, EV-CAP-AUTH-TRACE, EV-CAP-AUTH-SEC | AUDIT, REVIEW | MANDATORY |

**Fail-closed conjunction (per `design.md` §12, `OP-CERT-001`).** CAP-AUTHORITY construction is complete
**only when all twenty MANDATORY criteria hold simultaneously**. Any unmet criterion, any missing
`EV-CAP-AUTH-*` artifact, or any residual High/High adversarial finding blocks closure. There is no
optimistic partial-closure path.

---

## Capability Completion Gate

> Scope note: This gate defines the fail-closed conjunction that admits CAP-AUTHORITY to closure,
> consistent with `design.md` §12 (all completion criteria must hold) and `OP-CERT-001` (non-optimistic
> discipline — absence of evidence is a FAIL). The gate is evaluated only after the Completion Criteria
> (CC-AUTH-001..020) are assessed; it does not soften any MANDATORY criterion.

### Entry Conditions

1. **CC-AUTH-001 Design Approved** holds (EV-CAP-AUTH-DESIGN accepted).
2. **CC-AUTH-002 Requirements Approved** holds (all 95 requirements approved; EV-CAP-AUTH-TRACE present).
3. **CC-AUTH-003 Traceability Complete** holds (orphan-free lineage; 95/95 and 40/40 coverage).
4. Scoped Article IX generation-lock release act (OI-1, a prospective `AD-00xx`) is recorded in `AUTH-012`, authorizing `src/control/authority/*` construction.
5. Board adoption of `UAF-SPINE` + `AA-1..AA-8` as the governing authority model (OI-2) is granted.
6. Hard dependencies satisfied: PI-4 Control Plane COMPLETE, PI-6 Evolution Fabric COMPLETE, PI-5 Federation COMPLETE, PI-2/3 Substrate COMPLETE.

### Exit Conditions (all MANDATORY, fail-closed conjunction)

1. **CC-AUTH-004..018** all hold — registry, type, event store, projection, scope/policy, decision, grant/delegation, approval/SoD, revocation/halt, security, and audit controls implemented; core property and determinism validated; PI-4 and PI-6 paths verified.
2. **CC-AUTH-019 Adversarial Suite Passed** — the §15.3 suite passes with 0 residual High/High.
3. **CC-AUTH-020 Evidence Accepted & Closure Review Passed** — all seven `EV-CAP-AUTH-*` artifacts present, integrity-verifiable, and accepted; Authority Board closure review confirms the conjunction.
4. Additivity preserved — zero prohibited-core-dir change; zero `AUTH-001..012` amendment; existing baseline green (0 regressions).

### Mandatory Evidence

`EV-CAP-AUTH-DESIGN`, `EV-CAP-AUTH-IMP`, `EV-CAP-AUTH-TEST`, `EV-CAP-AUTH-AUDIT`, `EV-CAP-AUTH-RECON`,
`EV-CAP-AUTH-TRACE`, `EV-CAP-AUTH-SEC` — **all seven** required; absence of any is a FAIL.

### Mandatory Acceptance Criteria

All 40 acceptance criteria (AC-AUTH-001..040) satisfied, with the load-bearing constitutional criteria
**AC-AUTH-039** (Single Apex, Registry Sovereignty, Deny-by-Default, Propose-Not-Act, PI-4 Evaluation
Path, PI-6 Commit Path, Determinism, Non-Inversion) and **AC-AUTH-040** (Revocation Supremacy,
Enumerated Powers, Narrowing-Only Delegation, Separation of Duties, AD-0009 Actuation Boundary) jointly
asserted and passing.

### Mandatory Verification Activities

Property-based tests (≥100 iterations, tagged), unit tests, integration tests against PI-4/PI-5/PI-6,
deterministic replay proofs, offline audit-trail verification, the §15.3 adversarial suite (0 residual
High/High), formal validation of the single-apex / enumerated-power / revocation-supremacy /
non-inversion invariants, register-then-retire migration proof, and the traceability/coverage audit.

### Mandatory Governance Reviews

1. Platform-independence and governance-subordination review — no `AUTH-*` amendment (EV-CAP-AUTH-DESIGN).
2. Traceability/coverage audit (EV-CAP-AUTH-TRACE; 0 orphans).
3. Security conformance and adversarial review (EV-CAP-AUTH-SEC; 0 residual High/High).
4. Scoped Article IX release act recorded in `AUTH-012` (OI-1) and Board adoption of `UAF-SPINE`/`AA-1..AA-8` (OI-2).
5. Authority Board closure review (CC-AUTH-020).

### Current Verdict

**CAP-AUTHORITY NOT READY FOR CLOSURE.**

Only the **Design** and **Requirements** phases are complete. No implementation, tests, or evidence
exist yet. The gate is fail-closed: with the exit conditions unmet, the verdict is negative and cannot
be reported otherwise (`OP-CERT-001` non-optimistic discipline). Unmet MANDATORY conditions include:

- **Implementation absent** — CC-AUTH-004..014, -017, -018 unmet (no `packages/platform-runtime/src/control/authority/*` implementation; EV-CAP-AUTH-IMP not produced).
- **Verification absent** — CC-AUTH-015, -016, -019 unmet (no property/adversarial/replay results; EV-CAP-AUTH-TEST, EV-CAP-AUTH-AUDIT, EV-CAP-AUTH-SEC not produced); the §15.3 adversarial suite is unrun.
- **Evidence not accepted** — CC-AUTH-020 unmet (of the seven artifacts, only EV-CAP-AUTH-DESIGN and EV-CAP-AUTH-TRACE are producible in the current phase; EV-CAP-AUTH-IMP, -TEST, -AUDIT, -RECON, -SEC are not yet produced).
- **Governance acts pending** — scoped Article IX release (OI-1) not yet recorded; Board adoption of `UAF-SPINE`/`AA-1..AA-8` (OI-2) pending; register-then-retire migration ordering (OI-3) sequenced in the tasks phase; ASR ratification of deferred NFR targets (OI-4) pending; `PCAMG-0008`/`AUTH-INDEX-001` harmonization (OI-5) under Board review; CC-AUTH-020 closure review not held.

Reporting readiness at this stage would be a false-positive closure and is prohibited.

---

## Requirements Phase Exit Report

> Scope note: This report closes the Requirements phase of the CAP-AUTHORITY design-first workflow. It
> summarizes the requirements-phase artifacts and the prerequisites that remain before the Tasks phase
> and, subsequently, construction. All counts are consistent with the sections above and the
> Traceability Matrix.

### Summary

| Metric | Value |
|--------|-------|
| Total Requirements | **95** (FR-AUTH 25, NFR-AUTH 20, GR-AUTH 20, DR-AUTH 15, SR-AUTH 15) |
| Total Acceptance Criteria | **40** (AC-AUTH-001..040) |
| Total Evidence Artifacts | **7** (EV-CAP-AUTH-DESIGN, -IMP, -TEST, -AUDIT, -RECON, -TRACE, -SEC) |
| Total Completion Criteria | **20** (CC-AUTH-001..020) |
| Coverage Percentage (requirements-phase artifacts) | **100%** (Design 95/95, Constitutional 95/95, AC 95/95, Evidence 95/95, Verification 95/95, Closure 95/95; AC→Evidence 40/40; Verification methods discharged) |
| Orphans | **0** |
| Requirements Phase Status | **COMPLETE** |

### Remaining Prerequisites Before Task Planning

1. **OI-1 — Scoped Article IX release** (`AD-00xx`): the generation-lock release act authorizing `src/control/authority/*` construction MUST be recorded in `AUTH-012` before construction begins.
2. **OI-2 — Board adoption of `UAF-SPINE` + `AA-1..AA-8`**: adoption of the governing authority model is Approval-Required (`AUTH-009` §8; `UAF-C1`); this spec is a construction candidate, not an enactment.
3. **OI-3 — Register-then-retire migration order**: the sequencing of the ~14 existing fabric authority models onboarded as `authority:*` instances is deferred to the tasks phase; append-only, no deletion (`UAF-C4`).
4. **OI-4 — ASR ratification of deferred NFR targets**: `UCOS-ASR-NFR-001` quantitative values (RPO/RTO/latency/throughput/availability) currently `PENDING ASR RATIFICATION` for NFR-AUTH-002, -003, -004 (and -006 floors) MUST be ratified; upon ratification these SUPPORTING NFRs become MANDATORY.
5. **OI-5 — `PCAMG-0008` / `AUTH-INDEX-001` harmonization**: reconciliation of the proposed hierarchy with the ratified index proceeds by version increment + `AUTH-012`, never silent rewrite; Board review pending.

### Readiness Statement

The **Design** and **Requirements** artifacts are complete, mutually consistent, fully traceable
(100% coverage across all axes, 0 orphans), and grounded in the completed `design.md` and the UCOS canon
(`AUTH-001..012`, `UCOS-CONST-001`, `UAF-SPINE`/`AA-0..AA-8`, `PCAMG-0008`, `INV-6`, deny-by-default,
`AD-0009`, PI-4/PI-6, revocation supremacy, hash-chained auditability). They are **ready to proceed to
the Tasks phase**. The Capability Completion Gate verdict remains **CAP-AUTHORITY NOT READY FOR
CLOSURE** — task planning and construction (with implementation, property/adversarial tests, and
evidence acceptance) remain ahead, and the prerequisites above (notably OI-1 and OI-2) gate the
transition from planning to construction.

**END Requirements Phase — Evidence, Coverage, Completion Criteria, Completion Gate, and Exit Report COMPLETE. Tasks deferred to the Tasks phase.**
