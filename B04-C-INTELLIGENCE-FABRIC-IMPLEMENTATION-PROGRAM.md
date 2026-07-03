# B04-C — UCOS Intelligence Fabric Implementation Program (Part C)

| Field | Value |
|-------|-------|
| Artifact | **B04-C — Intelligence Fabric Implementation Program (Part C: API Specification · Event Catalog · Registry Architecture · Runtime Composition)** |
| Artifact ID | `B04-C-INTELLIGENCE-FABRIC-IMPLEMENTATION-PROGRAM` |
| Phase | **B04-C — Intelligence Fabric Construction Program (Part C)** |
| Layer | ARCHITECTURE / PLATFORM (implementation program — contract/event/registry/composition specs; builds nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Continues | `B04-A` (§§ 1–4) + `B04-B` (§§ 5–9). **Prior sections are NOT regenerated.** |
| Mode | **IMPLEMENTATION PLANNING / DESIGN ONLY** — technology-neutral contract, event, registry, and composition specifications. **No source code, runtime, infrastructure, services, model weights, transport/protocol/framework/vendor selection, governance invention, execution, or `git` mutation** beyond this additive architecture `*.md`. Append-only. |
| Scope of Part C | **Deliverables 10–13 only:** (10) API Specification, (11) Event Catalog, (12) Registry Architecture, (13) Runtime Composition. **Stops after Runtime Composition.** **No Acceptance Tests, no Implementation Backlog** — deferred to `B04-D`. |
| Binding requirements | **Registry-driven · Provider-agnostic · Model-agnostic · No hard-coded agents · No hard-coded workflows · Propose-not-act · Deny-by-default · Evolution-only commit** |
| Authoritative inputs | `B04-A`/`B04-B`; `INT-GOV-001/002`, `INT-ARCH-001`, `INT-SEC-001`, `INT-FED-001`, `INT-AUD-001`; `MEM-*` (PI-9), `KNOW-*`/PI-7, `ONTO-*` (PI-8), Evolution (PI-6/AD-0019), Federation (PI-5/AD-0018), Control (PI-4/AD-0017), Substrate (PI-2/3/AD-0016); AUTH-003/008/009/010/012; Constitution Art. IX/XII; INV-1..13; AD-0014 |
| Governance posture | `UCOS-CONSTRUCTION-BLOCKED` + Article IX generation lock remain **ACTIVE**. This program authorizes nothing and releases no lock. PI-10 construction remains a future Approval-Required Operation gated on `AD-0024`. |
| **Determination** | **INTELLIGENCE FABRIC PROGRAM (PART C) COMPLETE** — the API specification, event catalog, registry architecture, and runtime composition are specified and construction-planning-ready under governance. |

> All contracts are **technology-neutral** (no transport, protocol, serialization, framework, or vendor is
> selected — that is a deferred Prompt 08 ADR). Every command is **propose-only** (its effect is an Evolution
> Unit); every query is **read-only**; every interface is **deny-by-default** and audited. Interface names use
> the fabric prefix `INT`. Events use the `INT_*` taxonomy.

---

## 10. API Specification

### 10.1 Contract conventions (binding)
- **Shape.** Each operation declares `{ name, kind: command|query, inputs, preconditions, effect/result, postconditions, errors[], authority, classificationRule }`. Inputs/outputs are abstract data contracts (no wire format).
- **Command vs query.** A **command** never mutates governed state directly — its sole effect is a **proposed Evolution Unit** (propose-not-act); a **query** is strictly read-only.
- **Authorization.** Every operation is evaluated by the PI-4 Control Plane **deny-by-default** before any effect; unauthorized ⇒ `INT-ERR-AUTHZ` (deny).
- **Grounding & snapshots.** Any semantically-significant operation requires a resolvable ontology grounding binding and pinned snapshots; absence ⇒ fail-closed.
- **Determinism.** Command results are deterministic functions of recorded inputs + pinned snapshots + seed; non-deterministic contributions are advisory-only (dual-verified before influence).

### 10.2 Command interfaces (propose-only → Evolution)
| Operation | Inputs (abstract) | Effect | Key errors |
|-----------|-------------------|--------|-----------|
| `INT.Goal.Propose` | statement, scope, constraintSetId[], consequenceClass | Proposes Goal record (auth by Goal Authority) | AUTHZ, CONSEQUENCE-CAP, GROUNDING |
| `INT.Session.Open` | authorityId, goalId, contextBundleId, budgets, seed | Opens bounded Reasoning Session | GROUNDING, BUDGET, SNAPSHOT |
| `INT.Proposal.Submit` | sessionId, planId, rationaleRef | Emits Proposal (pre-commit) | CONSTRAINT, RATIONALE-MISSING |
| `INT.Decision.Certify` | proposalId, certifierId | Certifies (SoD-checked) | SOD, POLICY-DENY |
| `INT.Decision.Ratify` | decisionId, ratifierId[] | Ratifies (quorum if consequential) | SOD, QUORUM, APPROVAL-REQUIRED |
| `INT.Decision.Commit` | decisionId | Hands ratified Decision to Evolution (PI-6) — **only commit path** | EVOLUTION-REJECT, STATE |
| `INT.Memory.ProposeDurable` | targetTier, subject, change, rationaleRef | Proposes durable memory Evolution Unit | AUTHZ, CLASSIFICATION |
| `INT.Knowledge.ProposeChange` | targetRef?, change, evidenceRefs[], rationaleRef | Proposes knowledge Evolution Unit | GROUNDING, POLICY-DENY |
| `INT.Learned.ProposeAdoption` | learnedArtifactId | Proposes learned-artifact adoption Evolution Unit | VERIFIER-FAIL, POLICY-DENY |
| `INT.Agent.Activate` | agentId, goalId | Instantiates Agent Instance | AUTHZ, CAPABILITY-UNKNOWN, BUDGET |
| `INT.Agent.Abort` | agentInstanceId, reason | Fail-closed abort of instance | STATE |
| `INT.Coord.Start` | protocolId, agentInstanceIds[] | Opens Coordination Session | ROLE-UNRESOLVED, POLICY-DENY |
| `INT.Revocation.Issue` | targetRef, revAuthorityId | Forward revocation (propagating) | AUTHZ |

### 10.3 Query interfaces (read-only)
| Operation | Inputs | Result |
|-----------|--------|--------|
| `INT.Query.Session` | sessionId | Session state + audited step trace |
| `INT.Query.Proposal` / `INT.Query.Decision` | id | Record + rationale ref + status |
| `INT.Query.Agent` | agentId / instanceId | Definition/instance state + capabilities |
| `INT.Query.Rationale` | decisionId | Hash-chained rationale (`evidence → inference → conclusion`) |
| `INT.Query.Registry` | kind, selector | Resolved records (registry read; § 12) |

### 10.4 Agent interfaces
- `INT.Agent.Define` (command; proposes Agent Definition), `INT.Agent.Activate`/`INT.Agent.Abort`, `INT.Agent.Query`.
- Capability exercise is **not** a distinct API — it is mediated inside a Reasoning/Coordination session, capability-checked (enumerated allow-list; unknown ⇒ `INT-ERR-CAPABILITY-UNKNOWN`).
- No agent API can self-grant capability or commit directly (propose-not-act).

### 10.5 Memory interfaces
- `INT.Memory.Recall` (query; read-only, snapshot-pinnable, S4-monotonic, deny-by-default).
- `INT.Memory.SealSnapshot` (command-internal; seals immutable content-hashed recall set).
- `INT.Memory.ProposeDurable` (command; Evolution-only). **No direct write / no forget** (owned by PI-9; IGP-10).

### 10.6 Knowledge interfaces
- `INT.Knowledge.Query` (query; S4-aware, grounded), `INT.Knowledge.Ground` (query; resolve → `active` ontology), `INT.Knowledge.SealSnapshot` (command-internal), `INT.Knowledge.ProposeChange` (command; Evolution-only). Ungrounded evidence ⇒ dropped fail-closed.

### 10.7 Planning interfaces
- `INT.Plan.Generate` (query-like, deterministic; over Context Bundle + Constraint Set) → `feasible plan + trace | infeasible`. An `infeasible` plan cannot be submitted as a Proposal (DI-3).

### 10.8 Learning interfaces
- `INT.Learn.Invoke` (advisory; runs declared Inference Adapter/model, records `modelRef/seed/inputsHash`), `INT.Learn.Verify` (deterministic verifier ∧ semantic-constraint verifier), `INT.Learned.ProposeAdoption` (command; Evolution-only). Advisory-only until both verifiers attest (DI-7); no self-modification.

### 10.9 Coordination interfaces
- `INT.Coord.Start`/`INT.Coord.Step`/`INT.Coord.Complete`/`INT.Coord.Abort`. Steps are interpreted from Protocol records (no hard-coded workflow); each step is deny-by-default policy-gated and SoD-checked; foreign contributions advisory/clamped only.

### 10.10 Context interfaces
- `INT.Context.Assemble` (command-internal; grounding + knowledge snapshot + memory snapshot → sealed Context Bundle), `INT.Context.Query` (read-only). A bundle without a resolvable grounding binding is invalid (DI-2/DI-11).

### 10.11 Error contracts
| Code | Meaning | Semantics |
|------|---------|-----------|
| `INT-ERR-AUTHZ` | Deny-by-default authorization failure | Deny, audited; no effect |
| `INT-ERR-GROUNDING` | Term unresolved to `active` ontology | Fail-closed; no session/snapshot |
| `INT-ERR-SNAPSHOT` | Snapshot unavailable/expired/stale | Fail-closed exclusion |
| `INT-ERR-BUDGET` | Reasoning/agent budget exhausted | Fail-closed abort; no partial commit |
| `INT-ERR-CONSTRAINT` | Hard-constraint / block-severity violation | Reject proposal/plan |
| `INT-ERR-SOD` | Separation-of-duties violation | Reject certify/ratify |
| `INT-ERR-QUORUM` | Ratification quorum unmet | Reject ratify |
| `INT-ERR-APPROVAL-REQUIRED` | Consequential decision needs human/Board | Hold; Approval-Required (IGP-4) |
| `INT-ERR-CAPABILITY-UNKNOWN` | Unknown/implicit agent capability | Deny |
| `INT-ERR-ROLE-UNRESOLVED` | Coordination role/step unresolved | Fail-closed abort session |
| `INT-ERR-VERIFIER-FAIL` | Deterministic/semantic verifier rejected advisory output | Advisory-only; no adoption |
| `INT-ERR-POLICY-DENY` | PI-4 policy denial | Deny, audited |
| `INT-ERR-EVOLUTION-REJECT` | Evolution Fabric rejected commit | Proposal stays ratified; forward retry only |
| `INT-ERR-CLASSIFICATION` | S4 classification ceiling breach | Deny/exclude |
- **Uniform rule:** every error is **fail-closed** and **audited**; no error path yields a partial governed effect. Errors are data contracts (no exception semantics prescribed).

### 10.12 Versioning strategy
- **Contract versioning:** `vMAJOR.MINOR`; **additive/migration-only** (IP-14/IP-15); breaking changes require a new MAJOR with N/N-1 coexistence and a migration path (mirrors `UCOS-SVC-POLICY-001`).
- **Deprecation:** governed, announced, coexistence-window; no silent removal. Every contract version is a registered, traceable record (AUTH-010).
- **Snapshot pinning:** operations record the contract version alongside pinned knowledge/ontology/memory snapshots for reproducibility.

---

## 11. Event Catalog

### 11.1 `INT_*` event taxonomy
| Class | Events (representative) | Nature |
|-------|-------------------------|--------|
| **Session** | `INT_SESSION_OPENED`, `INT_SESSION_CLOSED`, `INT_SESSION_ABORTED_BUDGET`, `INT_SESSION_ABORTED_FAULT` | lifecycle |
| **Cognition** | `INT_PROPOSAL_SUBMITTED`, `INT_PROPOSAL_CERTIFIED`, `INT_DECISION_RATIFIED`, `INT_DECISION_COMMITTED`, `INT_DECISION_REVERSED_FORWARD` | governed decision |
| **Planning** | `INT_PLAN_FEASIBLE`, `INT_PLAN_INFEASIBLE` | evaluation |
| **Learning** | `INT_LEARNED_ARTIFACT_EMITTED`, `INT_LEARNED_ARTIFACT_VERIFIED`, `INT_LEARNED_ADOPTION_PROPOSED` | advisory→propose |
| **Memory** | `INT_MEMORY_SNAPSHOT_SEALED`, `INT_MEMORY_RECALL_DENIED`, `INT_DURABLE_MEMORY_PROPOSED`, `INT_MEMORY_COMMITTED` | read/propose |
| **Knowledge** | `INT_KNOWLEDGE_SNAPSHOT_SEALED`, `INT_EVIDENCE_DROPPED_UNRESOLVED`, `INT_KNOWLEDGE_PROPOSED`, `INT_KNOWLEDGE_COMMITTED` | read/propose |
| **Context** | `INT_CONTEXT_ASSEMBLED`, `INT_CONTEXT_INVALID` | assembly |
| **Agent** | `INT_AGENT_ACTIVATED`, `INT_AGENT_ABORTED`, `INT_CAPABILITY_DENIED`, `INT_AGENT_PROPOSAL_EMITTED` | agent lifecycle |
| **Coordination** | `INT_COORD_STARTED`, `INT_COORD_STEP_GATED`, `INT_COORD_SESSION_COMPLETED`, `INT_COORD_SESSION_ABORTED` | orchestration |
| **Governance** | `INT_APPROVAL_REQUIRED`, `INT_POLICY_DENIED`, `INT_REVOCATION_ISSUED`, `INT_SOD_VIOLATION` | governance |
| **Registry/Storage** | `INT_RECORD_REGISTERED`, `INT_RECORD_SUPERSEDED`, `INT_AUDIT_APPENDED` | substrate |

### 11.2 Event producers / consumers
| Event class | Primary producer | Primary consumers |
|-------------|------------------|-------------------|
| Session/Cognition | ENG-03 Reasoning | Coordination (ENG-07), audit, Evolution (commit) |
| Planning | ENG-04 Planning | ENG-03, audit |
| Learning | ENG-05 Learning | ENG-03 (advisory), Evolution (adoption), audit |
| Memory | ENG-01 Memory | ENG-08 Context, Evolution, audit |
| Knowledge | ENG-02 Knowledge | ENG-08 Context, Evolution, audit |
| Context | ENG-08 Context | ENG-03 Reasoning, audit |
| Agent | ENG-06 Agent Runtime | ENG-07 Coordination, audit |
| Coordination | ENG-07 Coordination | ENG-06 agents, audit |
| Governance | Control Plane (PI-4) / fabric | Authority Board, audit |
| Registry/Storage | Substrate (PI-2/3) | all engines, audit |
- **Cross-node:** federated events are **advisory/clamped** via PI-5; a foreign event never triggers a local commit without local ratification (INT-FED-001).

### 11.3 Ordering rules
- Events are **causally ordered per Reasoning/Coordination Session** (session is the ordering scope). Commit events (`INT_DECISION_COMMITTED`, `INT_*_COMMITTED`) are ordered by the **Evolution Fabric** commit sequence (single integrity gate). No cross-session global total order is assumed; ordering is per-scope + Evolution-serialized for commits.

### 11.4 Idempotency rules
- Every event carries an idempotency key `{ sessionRef | proposalRef | decisionRef, seq, contentHash }`. Re-delivery with an existing key is a **no-op** (exactly-once effect). Commit proposals carry an Evolution idempotency token so a retried `INT.Decision.Commit` cannot double-commit.

### 11.5 Replay behavior
- Events are **replayable** from the append-only audit ledger; replaying reconstructs session/decision state deterministically (INV-6) given the pinned snapshots referenced by each event. Replay is **effect-free** (no re-commit) — commits are reconstructed as historical facts, not re-executed. Divergence on replay ⇒ fail-closed integrity alarm.

### 11.6 Audit bindings
- Every `INT_*` event is a thin wrapper over the hash-chained `FederatedAuditLog` (`INT-AUD-001`): append-only, tamper-evident, signed (Ed25519 via federation `assertions.ts`, **no custom crypto**), reproducible, cross-node reconcilable. An operation that cannot append its audit event **fails closed** (no un-audited governed effect). Every committed decision links `event → rationale → evidence/snapshots`.

---

## 12. Registry Architecture

### 12.1 Principle
Everything the fabric does is **registry-driven** (IP-04): agents, capabilities, tools, workflows, memory
views, knowledge views, models/providers, and policy bindings are runtime metadata records resolved from the
PI-2/3 substrate registry under `intelligence:<kind>:<id>`. **Nothing is compiled-in.** The fabric registers
*records*; it selects **no** storage engine (deferred to Prompt 08 ADRs).

### 12.2 Registry catalog
| Registry | Kind key | Record shape (abstract) | Requirement served |
|----------|----------|-------------------------|--------------------|
| **Agent registry** | `intelligence:agent:*` | id, principal, capabilities[], toolBindings[], goalScope, budgets, keyRef, status | No hard-coded agents |
| **Capability registry** | `intelligence:capability:*` | id, verb, targetKind, contractRef, consequenceClass, requiresApproval | Enumerated allow-list |
| **Tool registry** | `intelligence:tool:*` | id, kind(read|propose), portRef, providerRef?, in/out contracts, classMax, determinismClass, keyRef? | Provider-agnostic |
| **Workflow registry** | `intelligence:protocol:*` | id, roles[], messageContracts[], sequence[], decisionPoints[], policyBinding, sodRules | No hard-coded workflows |
| **Memory registry** | `intelligence:memory-view:*` | id, tierRefs[], subjectSelector, classCeiling, recallMode(read-only), onExpiredOrRevoked(deny) | Single memory SoR (PI-9) |
| **Knowledge registry** | `intelligence:knowledge-view:*` | id, scope, selector, classCeiling, groundingBindingRef | Grounded reads (PI-7/PI-8) |
| **Model/provider registry** | `intelligence:model:*` | id, kind(det|non-det), ref, seedPolicy, in/outClassification, verifierBinding, keyRef | Model-agnostic (S3) |
| **Policy registry** | `intelligence:policy-binding:*` | id, scope, policySetRef(PI-4), evaluationMode(pre-commit) | Deny-by-default |

- Supporting registries: goal (`intelligence:goal:*`), goal-authority, decision-authority, reasoning-authority, constraint-set, grounding (`intelligence:grounding:*`), federated-intelligence-authority, revocation-authority — all metadata records.

### 12.3 Resolution rules
- **By-ID + version/snapshot only** (no by-name provider coupling; provider-agnostic).
- **Active-only** resolution for grounding/models/policies (`resolutionMode: active-only`); draft/superseded/deprecated records are not resolvable for live cognition.
- **Local-shadows-foreign** for federated records; foreign records are namespace-isolated (`intelligence:federation:<nodeId>:*`) and advisory/clamped.
- **Composition by reference:** agents reference capabilities/tools; protocols reference roles/capabilities; sessions reference bindings/snapshots — no inlining, no shared mutable model.
- **Zero-orphan:** an unresolved reference ⇒ fail-closed (`INT-ERR-*`); every resolved record is traceable (AUTH-010).

### 12.4 Validation rules
- **Schema validation** against the record's registered contract (JSON-schema-subset, per substrate metadata validator) before registration.
- **Enumerated allow-lists:** capabilities/powers/namespaces are explicit; unknown/implicit ⇒ reject.
- **Determinism class check:** any `non-deterministic` model requires a bound deterministic verifier before activation (INV-6).
- **Classification consistency:** `classificationMax`/ceilings monotonic and non-downgrading (S4).
- **Secrets-by-reference:** any inlined secret/model weight/key ⇒ reject (S3).
- **Approval gate:** registration/scope of authorities, goals, models, protocols is Approval-Required (AUTH-012 §8 / AD-0009).
- **Additive-only:** record evolution is migration-only; destructive rewrite ⇒ reject (IP-14/IP-15).

---

## 13. Runtime Composition

### 13.1 Engine interaction map
```
        ┌──────────── INT-ENG-06 Agent Runtime ─────────────┐
        │        (registry-resolved agents; bounded)         │
        ▼                                                    ▼
 INT-ENG-07 Coordination ──sequences──▶ INT-ENG-03 Reasoning ──orchestrates──▶ decision gate
        │ (protocol = data)                 │  ▲    ▲                              │ (policy→constraint
        │                                   │  │    │                              │  →certify→ratify)
        │                    ┌──────────────┘  │    └───────── INT-ENG-05 Learning (advisory, dual-verified)
        │                    ▼                  │
        │            INT-ENG-08 Context ◀──assembles── INT-ENG-01 Memory (recall) + INT-ENG-02 Knowledge (evidence)
        │                    │  (grounding via PI-8)
        ▼                    ▼
     PI-4 Control Plane (deny-by-default, S1/S3/S4, audit)  ──▶  PI-6 Evolution (ONLY commit)  ──▶ PI-5 Federation (advisory)
```

### 13.2 Context assembly sequence (ENG-08)
`resolve grounding (PI-8, active-only, deny-unresolved) → pin knowledge snapshot (ENG-02, S4) → pin memory snapshot (ENG-01, S4) → assemble + content-hash Context Bundle → seal`. Fail-closed on unresolved grounding / ceiling breach / source unavailable ⇒ `INT_CONTEXT_INVALID`.

### 13.3 Reasoning sequence (ENG-03)
`open bounded Session (requires grounding + sealed bundle + seed) → deterministic inference over pinned context (Planning ⟂ Learning advisory) → assemble Proposal + hash-chained rationale → policy-evaluate (PI-4, deny-default) → satisfy hard constraints → certify → ratify (SoD/quorum) → INT.Decision.Commit → Evolution`. Fail-closed on budget/policy/constraint/rationale failure.

### 13.4 Planning sequence (ENG-04)
`receive Goal + Context Bundle + Constraint Set (terms grounded) → generate candidates → evaluate hard(inviolable)+soft(weighted) → emit feasible plan + trace | infeasible`. `infeasible ⇒ INT_PLAN_INFEASIBLE`, never proposable.

### 13.5 Learning sequence (ENG-05)
`operate declared adapter/model on recorded outcomes (read) → emit advisory Learned Artifact (modelRef/seed/inputsHash recorded) → deterministic verifier ∧ semantic-constraint verifier → INT.Learned.ProposeAdoption → Evolution (migration-only)`. Fail-closed: either verifier fails ⇒ advisory only; no self-modification.

### 13.6 Agent execution sequence (ENG-06)
`resolve Agent Definition (registry) → instantiate → bind authorized Goal → per action: capability check (deny unknown) → exercise tool (read|propose) → route propose-effects to Control Plane → Reasoning/Decision → Evolution → audit each action; enforce budgets`. Agents never self-grant capability or commit directly.

### 13.7 Coordination sequence (ENG-07)
`resolve Protocol (roles/messages/sequence = data) → open Coordination Session, bind agents to roles (capability-checked) → interpret sequence step-by-step: deny-by-default policy gate + SoD per step → admit foreign contributions advisory/clamped → sequence proposals → decisions → Evolution commit; audit each step`. Fail-closed on unresolved role/step / policy deny / SoD breach ⇒ abort, no partial commit.

### 13.8 Failure handling (uniform, fail-closed)
| Failure | Runtime response |
|---------|------------------|
| Unresolved grounding / stale snapshot | Abort assembly/session; `INT_CONTEXT_INVALID`; no seal |
| Budget exhaustion | Abort session/instance; no partial commit |
| Policy deny / SoD / quorum | Reject decision; audited; hold or deny |
| Hard-constraint / infeasible plan | Reject proposal; never commit |
| Verifier rejection (det/semantic) | Advisory output discarded; no adoption |
| Evolution rejection | Decision stays ratified/uncommitted; forward retry only (no rewrite) |
| Audit-append failure | Operation fails closed (no un-audited effect) |
| Revocation (any construct) | Propagates fail-closed; unknown state ⇒ treated as revoked |
| Federated contribution invalid | Ignored/denied (advisory only; local ratification required) |

### 13.9 Determinism boundaries
- **Deterministic (commit path):** context assembly, reasoning orchestration, planning, constraint solving, rationale building, decision certification/ratification, commit hand-off — all deterministic functions of recorded inputs + pinned snapshots + seed (INV-6).
- **Quarantined non-deterministic (advisory only):** probabilistic/model-based inference and all learning outputs — recorded reproducibly (`modelRef/seed/inputsHash`), and **never** influence a committed decision without deterministic-verifier **and** semantic-constraint-verifier attestation.
- **Boundary invariant:** no non-deterministic value crosses into the commit path unverified; the committed decision remains reproducible from the record even when an external model is stochastic.

---

> **END OF PART C — STOPS AFTER RUNTIME COMPOSITION (per mandate).**
> **Not produced here:** Acceptance Tests, Implementation Backlog — deferred to `B04-D`.

## Governance / Non-Construction Statement

No implementation produced; no code generated; no runtime, infrastructure, services, or model weights created;
no transport/protocol/serialization/framework/language/datastore/cloud/vendor selected; no governance mechanism,
control, or gate invented; no execution or `git` mutation performed; no lock released; no invariant enrolled; no
canon modified; no prior B04-A/B04-B section regenerated. This is an implementation-**program** design artifact
only; the sole repository effect is this additive architecture `*.md`. PI-10 construction remains a future
Approval-Required Operation (AUTH-012 §8 / AD-0009) gated behind a scoped Article IX release (`AD-0024`).
`UCOS-CONSTRUCTION-BLOCKED`, the Article IX generation lock, INV-1..13, `AUTH-012`, and **AD-0014** (Ω∞ deferral;
INV-14..20 **not** enrolled) are unchanged. All prospective construction is additive and confined to
`src/control/intelligence/*` with zero prohibited-core-dir change; registry-driven, provider-agnostic,
model-agnostic, no-hard-coded-agents, no-hard-coded-workflows, propose-not-act, deny-by-default, and
Evolution-only commit are preserved throughout.

## Traceability
- **Continues:** `B04-A` (§§ 1–4), `B04-B` (§§ 5–9) — not regenerated.
- **Consumes (authoritative):** `INT-GOV-001/002`, `INT-ARCH-001`, `INT-SEC-001`, `INT-FED-001`, `INT-AUD-001`;
  `MEM-*` (PI-9), `KNOW-*`/PI-7, `ONTO-*` (PI-8), Evolution (PI-6/AD-0019), Federation (PI-5/AD-0018),
  Control (PI-4/AD-0017), Substrate (PI-2/3/AD-0016); `UCOS-SVC-POLICY-001` (versioning pattern).
- **Refines:** AUTH-003 (IP-01/04/06/14/15), AUTH-008 (S1/S3/S4), AUTH-009, AUTH-010 (traceability), AUTH-012,
  Constitution Art. IX/XII, INV-1..13, AD-0014.
- **Produces (Part C):** API Specification (command/query/agent/memory/knowledge/planning/learning/coordination/
  context interfaces + error contracts + versioning), Event Catalog (`INT_*` taxonomy, producers/consumers,
  ordering, idempotency, replay, audit bindings), Registry Architecture (8 registries + resolution + validation),
  Runtime Composition (interaction map + six sequences + failure handling + determinism boundaries).
- **Feeds:** `B04-D` (Acceptance Tests, Implementation Backlog) and, after a future `AD-0024`, PI-10 construction
  + independent PI-10 validation/ratification.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN),
  AD-0014; construction gated by `UCOS-CONSTRUCTION-BLOCKED`.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect).

**END B04-C-INTELLIGENCE-FABRIC-IMPLEMENTATION-PROGRAM — PART C · API SPECIFICATION (COMMAND/QUERY/AGENT/MEMORY/
KNOWLEDGE/PLANNING/LEARNING/COORDINATION/CONTEXT + ERROR CONTRACTS + VERSIONING) · EVENT CATALOG (INT_* TAXONOMY/
PRODUCERS/CONSUMERS/ORDERING/IDEMPOTENCY/REPLAY/AUDIT) · REGISTRY ARCHITECTURE (AGENT/CAPABILITY/TOOL/WORKFLOW/
MEMORY/KNOWLEDGE/MODEL-PROVIDER/POLICY + RESOLUTION/VALIDATION) · RUNTIME COMPOSITION (INTERACTION MAP + 6
SEQUENCES + FAILURE HANDLING + DETERMINISM BOUNDARIES) · REGISTRY-DRIVEN · PROVIDER-AGNOSTIC · MODEL-AGNOSTIC ·
NO HARD-CODED AGENTS · NO HARD-CODED WORKFLOWS · PROPOSE-NOT-ACT · DENY-BY-DEFAULT · EVOLUTION-ONLY COMMIT ·
DESIGN/PLANNING ONLY · NO ACCEPTANCE TESTS / NO BACKLOG · NO CODE / NO INFRA / NO TECH SELECTION / NO
CONSTRUCTION / NO MUTATION · ARTICLE IX + CONSTRUCTION LOCK REMAIN ACTIVE.**
