# B04-B — UCOS Intelligence Fabric Implementation Program (Part B)

| Field | Value |
|-------|-------|
| Artifact | **B04-B — Intelligence Fabric Implementation Program (Part B: Knowledge · Memory · Agent · Execution · Storage Models)** |
| Artifact ID | `B04-B-INTELLIGENCE-FABRIC-IMPLEMENTATION-PROGRAM` |
| Phase | **B04-B — Intelligence Fabric Construction Program (Part B)** |
| Layer | ARCHITECTURE / PLATFORM (implementation program — model specifications; builds nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Continues | `B04-A-INTELLIGENCE-FABRIC-IMPLEMENTATION-PROGRAM.md` (§§ 1–4). **Previous sections are NOT regenerated.** |
| Mode | **IMPLEMENTATION PLANNING / DESIGN ONLY** — model specifications. **No source code, runtime, infrastructure, services, model weights, technology/framework/vendor selection, governance invention, execution, or `git` mutation** beyond this additive architecture `*.md`. Append-only. |
| Scope of Part B | **Deliverables 5–9 only:** (5) Knowledge Model, (6) Memory Model, (7) Agent Model, (8) Execution Model, (9) Storage Model. **Stops after the Storage Model.** **No APIs, no Events (catalog), no Acceptance Tests, no Implementation Backlog** — deferred to `B04-C`. |
| Binding requirements | **Registry-driven · Provider-agnostic · Model-agnostic · No hard-coded agents · No hard-coded workflows · Propose-not-act · Deny-by-default · Evolution-only commit** |
| Authoritative inputs | `B04-A` (§§ 1–4); `INT-GOV-001/002`, `INT-ARCH-001`, `INT-SEC-001`, `INT-FED-001`, `INT-AUD-001`; `MEM-*` (PI-9), `KNOW-*`/PI-7, `ONTO-*` (PI-8), Evolution (PI-6/AD-0019), Federation (PI-5/AD-0018), Control (PI-4/AD-0017), Substrate (PI-2/3/AD-0016); AUTH-003/008/009/012; Constitution Art. IX/XII; INV-1..13; AD-0014 |
| Governance posture | `UCOS-CONSTRUCTION-BLOCKED` + Article IX generation lock remain **ACTIVE**. This program authorizes nothing and releases no lock. PI-10 construction remains a future Approval-Required Operation gated on `AD-0024`. |
| **Determination** | **INTELLIGENCE FABRIC PROGRAM (PART B) COMPLETE** — the Knowledge, Memory, Agent, Execution, and Storage models are specified and construction-planning-ready under governance. |

> Per-model structure (applied uniformly): **Purpose · Core entities · Aggregates · State transitions ·
> Invariants · Registry bindings · Event relationships · Persistence boundaries · Failure semantics ·
> Governance constraints.** "Event relationships" name the events a model **participates in**; the full event
> catalog is **not** produced here (deferred to `B04-C`). All records live under `intelligence:<kind>:<id>` on
> the PI-2/3 substrate unless the record is owned by a lower fabric (then referenced by ID/snapshot only).

---

## 5. Knowledge Model

### 5.1 Purpose
Define how the Intelligence Fabric **reads, grounds, snapshots, and proposes** knowledge — as a governed
consumer of the PI-7 Knowledge Fabric grounded by the PI-8 Ontology Fabric. The fabric **owns no knowledge
graph**; it owns only *read views, groundings, snapshots, and knowledge-change proposals*. Evidence that cannot
be grounded to an `active` ontology entity never enters cognition (IGP-9, fail-closed).

### 5.2 Core entities
| Entity | Kind | Ownership | Description |
|--------|:----:|-----------|-------------|
| Knowledge Item | ref | **PI-7** | A knowledge unit (fact/relation/document-node); referenced by ID + version |
| Knowledge Query | VO | intelligence | Scope + selector + classification ceiling; deterministic |
| Grounded Evidence | VO | intelligence | Knowledge Item bound to an `active` ontology entity (`ONTO-C2`) |
| Knowledge Snapshot | E | intelligence | Immutable, content-hashed evidence set pinned to a Reasoning Session |
| Knowledge View | E | intelligence | Read-only scoped selector (`intelligence:knowledge-view:<id>`) |
| Knowledge Proposal | AR | intelligence | A proposed knowledge contribution/correction, committed only via Evolution |
| Ontology Grounding Binding | ref | intelligence (`INT-GOV-C13`) | Pins the ontology namespaces/snapshot used for grounding |

### 5.3 Aggregates
- **Knowledge Snapshot (AR of read-path):** `{ snapshotId, viewId, groundingBindingRef, items: GroundedEvidence[], contentHash, sessionRef, classificationCeiling, createdAt }` — immutable once sealed.
- **Knowledge Proposal (AR of write-path):** `{ proposalId, targetKnowledgeRef?, change, rationaleRef, evidenceRefs[], evolutionUnitRef?, status }` — the only knowledge write path is a committed Evolution Unit.

### 5.4 State transitions
- **Knowledge Snapshot:** `assembling → sealed → (consumed | expired)`. Sealed snapshots are immutable; `expired` on session close or TTL.
- **Grounded Evidence:** `resolved → (valid | dropped-unresolved)`; an item that cannot bind to an `active` ontology entity transitions to `dropped-unresolved` (fail-closed) and never enters a sealed snapshot.
- **Knowledge Proposal:** `drafted → policy-evaluated → certified → ratified → (committed-via-evolution | rejected | withdrawn)`.

### 5.5 Invariants
- KM-1 Read-only against PI-7; the sole knowledge mutation path is a committed Evolution Unit (Evolution-only commit).
- KM-2 Every Grounded Evidence resolves to exactly one `active` ontology entity; unresolved ⇒ dropped fail-closed (IGP-9).
- KM-3 A sealed Knowledge Snapshot is immutable and content-hashed (reproducibility).
- KM-4 Classification is monotonic and never downgraded across grounding/snapshot (S4).
- KM-5 No ungrounded evidence may enter a Reasoning Session (DI-2 support).

### 5.6 Registry bindings
- Knowledge Views, Snapshots, and Proposals are metadata records under `intelligence:knowledge-view:*`, `intelligence:knowledge-snapshot:*`, `intelligence:knowledge-proposal:*` (registry-driven).
- Knowledge **sources** are reached only through the PI-7 query port (provider-agnostic); no source is bound by name.
- Grounding namespaces are an **enumerated allow-list** on the Ontology Grounding Binding (no implicit namespaces).

### 5.7 Event relationships
Participates in (names only; catalog deferred): `INT_KNOWLEDGE_SNAPSHOT_SEALED`, `INT_EVIDENCE_DROPPED_UNRESOLVED`, `INT_KNOWLEDGE_PROPOSAL_CERTIFIED`, `INT_KNOWLEDGE_COMMITTED` (emitted by Evolution). All are audit-chained (`INT_*` over `FederatedAuditLog`).

### 5.8 Persistence boundaries
- **Owned & persisted by intelligence:** Views, Snapshots (hashes + references, not copies of PI-7 content beyond what a snapshot legitimately pins), Proposals — on PI-2/3 substrate.
- **Owned & persisted elsewhere:** Knowledge Items and the knowledge graph remain in **PI-7**; committed changes persist via **PI-6 Evolution**. No knowledge-of-record is stored inside the intelligence context.

### 5.9 Failure semantics
- Unresolved grounding, classification-ceiling breach, or PI-7 unavailability ⇒ **fail-closed** (no snapshot seal, session cannot open). Partial snapshots are never consumed. Proposal commit failure at Evolution ⇒ proposal remains `ratified`, uncommitted; forward retry only (migration-only, no silent rewrite).

### 5.10 Governance constraints
- Deny-by-default reads (Control Plane); S4 classification honored end-to-end; propose-not-act (contributions are proposals); Evolution-only commit; single source of meaning = PI-8 (IGP-9); no shared mutable model with PI-7.

---

## 6. Memory Model

### 6.1 Purpose
Define how the Intelligence Fabric **recalls** memory read-only and **proposes** durable memory, with the PI-9
Memory Fabric as the **single system of record** across all tiers (IGP-10). The fabric holds **no local store,
no retention, no forgetting** — those are owned by PI-9 (`MEM-GOV-002`).

### 6.2 Core entities
| Entity | Kind | Ownership | Description |
|--------|:----:|-----------|-------------|
| Memory Record | ref | **PI-9** | A memory unit in tier T1–T6; referenced by ID + version |
| Memory Tier | VO | PI-9 | T1 Working · T2 Short-Term · T3 Long-Term · T4 Semantic · T5 Episodic · T6 Federated |
| Memory View | E | intelligence (`INT-GOV-C12`) | Read-only scoped view (`tierRefs`, `subjectSelector`, `classificationCeiling`, `recallMode: read-only`) |
| Recall Set | VO | intelligence | Snapshot-pinned read result of a recall query |
| Memory Snapshot | E | intelligence | Immutable, content-hashed recall set pinned to a Reasoning Session |
| Durable-Memory Proposal | AR | intelligence | A proposed durable memory write, committed only via Evolution (`MGP-4`) |

### 6.3 Aggregates
- **Memory Snapshot (AR of read-path):** `{ memSnapshotId, viewId, records: MemoryRecordRef[], contentHash, sessionRef, classificationCeiling, createdAt }` — immutable once sealed.
- **Durable-Memory Proposal (AR of write-path):** `{ proposalId, targetTier, subject, change, rationaleRef, evolutionUnitRef?, status }` — targets the `memory:` namespace via Evolution only.

### 6.4 State transitions
- **Memory View:** `registered → active → (suspended ↔ active) → revoked`; `onExpiredOrRevoked: deny`.
- **Memory Snapshot:** `assembling → sealed → (consumed | expired)`.
- **Durable-Memory Proposal:** `drafted → policy-evaluated → certified → ratified → (committed-via-evolution | rejected | withdrawn)`.

### 6.5 Invariants
- MM-1 No fabric-local memory store, retention, or forgetting (owned by PI-9; IGP-10).
- MM-2 Recall is deny-by-default and in-boundary only (`MGP-2`).
- MM-3 Classification is monotonic across recall/snapshot (`MGP-3`, S4); ceiling clamps the view.
- MM-4 Expired/revoked memory is excluded fail-closed (`MGP-5`).
- MM-5 Durable memory is a proposed Evolution Unit only — never a direct write (`MGP-4`, Evolution-only commit).
- MM-6 A sealed Memory Snapshot is immutable and content-hashed (reproducibility; DI-2 support).

### 6.6 Registry bindings
- Memory Views/Snapshots/Proposals are records under `intelligence:memory-view:*`, `intelligence:memory-snapshot:*`, `intelligence:memory-proposal:*` (registry-driven).
- Tiers and memory providers are reached only through the PI-9 recall port (provider-agnostic); no tier backend is bound by name.

### 6.7 Event relationships
Participates in: `INT_MEMORY_SNAPSHOT_SEALED`, `INT_MEMORY_RECALL_DENIED`, `INT_DURABLE_MEMORY_PROPOSAL_CERTIFIED`, `INT_MEMORY_COMMITTED` (emitted by Evolution/PI-9). Audit-chained.

### 6.8 Persistence boundaries
- **Owned & persisted by intelligence:** Views, Snapshots (references + hashes), Proposals — on PI-2/3.
- **Owned & persisted elsewhere:** all Memory Records (T1–T6) remain in **PI-9**; durable writes persist via **PI-6 Evolution** into the `memory:` namespace. No memory-of-record inside the intelligence context.

### 6.9 Failure semantics
- Recall of expired/revoked/over-ceiling memory ⇒ **fail-closed exclusion** (deny). PI-9 unavailability ⇒ session cannot pin a memory snapshot ⇒ session cannot open (fail-closed). Commit failure ⇒ proposal stays `ratified`, forward retry only.

### 6.10 Governance constraints
- Deny-by-default recall; S4 monotonic classification; propose-not-act; Evolution-only commit; single memory SoR = PI-9 (IGP-10); SoD non-waivable for durable-memory certification.

---

## 7. Agent Model

### 7.1 Purpose
Define **governed, metadata-defined agents** as bounded, capability-gated actors — with **no hard-coded agents**
and **no hard-coded workflows**. Every agent, capability, tool, and coordination is a runtime record;
agents **propose, never act autonomously** beyond enumerated capabilities, and route all governed effects
through the Control Plane (authorize) and Evolution Fabric (commit).

### 7.2 Sub-model A — Agent definitions
- **Agent Definition (AR)** `intelligence:agent:<id>`: `{ agentId, principalRef, capabilities: capabilityId[], toolBindings: toolId[], goalScope, policyScope, budgets:{depth,steps,wallMs,resource}, keyRef, status }`.
- **Agent Instance (E)** `intelligence:agent-instance:<id>`: a runtime activation bound to an authorized Goal; carries session state references only (no governed state).
- **No compiled agents** (DI-8): all agents are records resolved from the registry; unknown agent ⇒ deny.

### 7.3 Sub-model B — Capability definitions
- **Capability Definition (E)** `intelligence:capability:<id>`: `{ capabilityId, verb, targetKind, contractRef, consequenceClass, requiresApproval? }`.
- Capabilities are an **enumerated allow-list** on each Agent Definition; an agent may exercise only capabilities it explicitly holds; implicit/unknown capability ⇒ deny-by-default.
- No capability grants a direct write path; consequential capabilities are Approval-Required (IGP-4).

### 7.4 Sub-model C — Tool definitions
- **Tool Definition (E)** `intelligence:tool:<id>`: `{ toolId, kind: read|propose, portRef, providerRef?, inputContract, outputContract, classificationMax, determinismClass, keyRef? }`.
- Tools are **provider-agnostic ports** (Knowledge query, Memory recall, Ontology resolve, Evolution propose, Federation advisory); concrete providers/models are pluggable by reference (**model-agnostic**, S3 keys by-reference).
- A tool is either `read` (no governed effect) or `propose` (emits an Evolution Unit); **no tool commits directly**.

### 7.5 Sub-model D — Coordination definitions
- **Coordination Protocol (AR)** `intelligence:protocol:<id>`: `{ protocolId, roles:[{roleId, capabilityReqs[]}], messageContracts[], sequence: step[], decisionPoints[], policyBinding, sodRules }`.
- **Coordination Session (E)** `intelligence:coord-session:<id>`: a runtime run of a protocol with bound Agent Instances.
- **No hard-coded workflows** (DI-9): sequencing/roles/messages/decision points are **data**, interpreted at runtime; unknown role/step ⇒ deny fail-closed.

### 7.6 Sub-model E — Lifecycle definitions
- **Agent Definition:** `registered → active → (suspended ↔ active) → revoked`.
- **Agent Instance:** `instantiated → bound(goal) → running → (completed | aborted-budget | aborted-fault | revoked)`.
- **Coordination Session:** `open → running → (completed | aborted-policy | aborted-fault)`.
- Lifecycle transitions are gated by the Control Plane; abort is fail-closed (no partial commit).

### 7.7 Core entities & aggregates (consolidated)
| Aggregate/Entity | Kind | Key | Notes |
|------------------|:----:|-----|-------|
| Agent Definition | AR | `intelligence:agent:*` | capabilities/tools enumerated; budgets bound |
| Agent Instance | E | `intelligence:agent-instance:*` | runtime activation; no governed state |
| Capability Definition | E | `intelligence:capability:*` | enumerated allow-list unit |
| Tool Definition | E | `intelligence:tool:*` | read|propose port; provider/model by reference |
| Coordination Protocol | AR | `intelligence:protocol:*` | roles/messages/sequence as data |
| Coordination Session | E | `intelligence:coord-session:*` | interpreted run of a protocol |

### 7.8 Invariants
- AM-1 Zero hard-coded agents/workflows; all are records (DI-8/DI-9).
- AM-2 Capabilities enumerated; unknown/implicit ⇒ deny.
- AM-3 Agents/tools propose-not-act; no direct commit; consequential capabilities Approval-Required.
- AM-4 SoD enforced across coordinating agents (proposer ≠ certifier ≠ ratifier).
- AM-5 Budgets bound every instance/session; exhaustion fail-closed.
- AM-6 Foreign agents/contributions are advisory/deny-only, trust-clamped (`INT-GOV-C11`, INT-FED-001).

### 7.9 Registry bindings
All six record kinds resolve from PI-2/3 registry/metadata; capabilities/tools/protocols are composed by reference (registry-driven, provider/model-agnostic). No agent/tool/workflow is compiled-in.

### 7.10 Event relationships
Participates in: `INT_AGENT_ACTIVATED`, `INT_AGENT_ABORTED`, `INT_CAPABILITY_DENIED`, `INT_COORD_STEP_GATED`, `INT_COORD_SESSION_COMPLETED`, `INT_AGENT_PROPOSAL_EMITTED`. Audit-chained per step.

### 7.11 Persistence boundaries
- **Owned & persisted by intelligence:** Agent/Capability/Tool/Protocol definitions and session records (PI-2/3).
- **Owned elsewhere:** principal identity/trust/policy (**PI-4**); any committed agent-produced change (**PI-6**). Instances/sessions hold references, not governed state.

### 7.12 Failure semantics
- Unknown capability/role/tool, policy deny, or budget exhaustion ⇒ fail-closed abort; no partial effect. Revocation propagates fail-closed (unknown state ⇒ revoked). Instance/session faults abort with audit; no silent continuation.

### 7.13 Governance constraints
- Deny-by-default (capabilities, coordination steps); propose-not-act; Evolution-only commit; SoD non-waivable; AD-0014 boundary (no self-authored goals, no self-modification, no autonomous actuation); S1 (authn/authz), S3 (keys/models by reference).

---

## 8. Execution Model

### 8.1 Purpose
Define the **deterministic, governed control flows** by which the engines cooperate to turn authorized goals
into audited proposals — each flow bounded, snapshot-pinned, fail-closed, and non-committing except via the
Evolution Fabric.

### 8.2 Flow A — Context assembly flow (ENG-08)
```
resolve grounding binding (PI-8, active-only, deny-unresolved)
  → pin knowledge snapshot (ENG-02, S4) → pin memory snapshot (ENG-01, S4)
  → assemble Context Bundle (bounded, content-hashed) → seal
  (fail-closed: unresolved grounding | ceiling breach | source unavailable ⇒ no seal)
```
- Output: sealed **Context Bundle** (reproducible). Read-only; no reasoning/commit.

### 8.3 Flow B — Reasoning flow (ENG-03)
```
open bounded Reasoning Session (requires resolvable grounding binding + sealed Context Bundle + seed)
  → run deterministic inference over pinned context (Planning ⟂ Learning advisory)
  → assemble Proposal + hash-chained rationale (evidence → inference → conclusion)
  → policy-evaluate (PI-4, deny-by-default) → satisfy hard constraints
  → certify → ratify (SoD, quorum if consequential) → hand ratified Decision to Evolution (PI-6)
  (fail-closed: budget exhaustion | policy deny | unmet hard constraint | missing rationale ⇒ abort, no commit)
```
- Determinism: fully deterministic given `(session inputs, knowledge/ontology/memory snapshots, policy set, constraint set, seed)`.

### 8.4 Flow C — Planning flow (ENG-04)
```
receive Goal + Context Bundle + Constraint Set (terms grounded to active ontology types)
  → generate candidate plans → evaluate hard (inviolable) + soft (weighted) constraints
  → emit feasible plan + trace | infeasible verdict
  (infeasible ⇒ never proposable as a Decision; DI-3)
```

### 8.5 Flow D — Learning flow (ENG-05)
```
operate declared Inference Adapter/model (INT-GOV-C2) on recorded outcomes/evidence (read)
  → emit advisory Learned Artifact (recorded: modelRef, seed, inputsHash, outputClassification)
  → deterministic verifier ∧ semantic-constraint verifier (ONTO-C8) must BOTH attest
  → propose adoption as an Evolution Unit (migration-only, IP-14)
  (fail-closed: either verifier fails ⇒ advisory only, no adoption; no self-modification)
```

### 8.6 Flow E — Agent execution flow (ENG-06)
```
resolve Agent Definition (registry) → instantiate Agent Instance → bind authorized Goal
  → per action: check enumerated capability (deny unknown) → exercise tool (read | propose)
  → route propose-effects to Control Plane (authorize) then Reasoning/Decision → Evolution (commit)
  → audit every action; enforce budgets (fail-closed on exhaustion)
  (agents never self-grant capability, never commit directly)
```

### 8.7 Flow F — Coordination flow (ENG-07)
```
resolve Coordination Protocol (roles/messages/sequence/decision points = data)
  → open Coordination Session, bind Agent Instances to roles (capability-checked)
  → interpret sequence step-by-step: deny-by-default policy gate per step + SoD across agents
  → admit foreign contributions advisory/clamped only (INT-FED-001)
  → sequence proposals → decisions → Evolution commit; audit each step
  (fail-closed: unresolved role/step | policy deny | SoD breach ⇒ abort session, no partial commit)
```

### 8.8 Cross-flow invariants
- EM-1 Every flow is bounded (budgets) and fail-closed on exhaustion/violation.
- EM-2 No flow mutates governed state except via a committed PI-6 Evolution Unit (Evolution-only commit).
- EM-3 Every committed decision is a deterministic function of recorded evidence + pinned snapshots (INV-6); non-deterministic/learned inputs are advisory-only until dual-verified.
- EM-4 Every step is audited (hash-chained `INT_*`); un-explainable output is rejected (IGP-6).
- EM-5 Meaning is resolved only via `active` PI-8 ontology (IGP-9); memory only via PI-9 (IGP-10); knowledge only via PI-7.
- EM-6 SoD non-waivable across proposal/certify/ratify and across coordinating agents.

### 8.9 State transitions (execution units)
- **Reasoning Session:** `open → running → (completed | aborted-budget | aborted-fault)`.
- **Proposal:** `drafted → policy-evaluated → (rejected | certified)`; **Decision:** `certified → ratified → (committed-via-evolution | reversed-by-forward-unit)`.
- **Coordination Session:** `open → running → (completed | aborted-policy | aborted-fault)`.

### 8.10 Registry bindings
Flows are parameterized entirely by records — goals, constraint sets, models, protocols, agent/tool definitions, context/grounding bindings — resolved from PI-2/3 (registry-driven); no flow embeds providers, models, agents, or workflows.

### 8.11 Event relationships
Participates in: `INT_SESSION_OPENED/CLOSED`, `INT_PROPOSAL_CERTIFIED`, `INT_DECISION_RATIFIED`, `INT_DECISION_COMMITTED` (Evolution), `INT_LEARNED_ARTIFACT_VERIFIED`, `INT_COORD_STEP_GATED`. Catalog deferred to `B04-C`.

### 8.12 Persistence & failure semantics
- **Persistence boundary:** execution *records* (sessions, proposals, decisions, traces) persist on PI-2/3; committed *effects* persist only via PI-6; audit persists in the hash-chained log. No governed state is written inside a flow.
- **Failure semantics:** any budget/policy/constraint/grounding/verifier failure ⇒ fail-closed abort with audited reason; no partial commit; reversal is a new forward Evolution Unit (migration-only), never a silent rewrite.

### 8.13 Governance constraints
- Propose-not-act; deny-by-default; Evolution-only commit; determinism quarantine (INV-6); ontology grounding (IGP-9); single memory SoR (IGP-10); SoD; Approval-Required for consequential decisions (IGP-4); AD-0014 boundary; S1/S3/S4 preserved.

---

## 9. Storage Model

### 9.1 Purpose
Define **where and how** intelligence records persist, drawing an exact boundary between what the Intelligence
Fabric owns (cognition records on the PI-2/3 substrate) and what remains owned by lower fabrics (knowledge,
memory, committed state, audit) — with **no shared mutable model** and **no fabric-local system of record for
knowledge/memory/committed state**.

### 9.2 Core entities (storage classes)
| Storage class | Contents | Owner | Backing |
|---------------|----------|:-----:|---------|
| Cognition Records | goals, sessions, proposals, decisions, agents, protocols, learned artifacts, views, bindings, context bundles | intelligence | PI-2/3 metadata runtime, `intelligence:*` keyspace |
| Snapshots | knowledge/memory/ontology snapshots (references + content hashes) | intelligence | PI-2/3 (immutable once sealed) |
| Audit Ledger | hash-chained `INT_*` decision/step provenance | (reused) | `FederatedAuditLog` pattern (append-only) |
| Knowledge-of-record | knowledge graph/items | **PI-7** | PI-7 store |
| Memory-of-record | tiers T1–T6 | **PI-9** | PI-9 store |
| Committed state | all governed mutations | **PI-6** | Evolution-committed store |
| Identity/Policy | principals, trust, policy | **PI-4** | Control fabrics |

### 9.3 Aggregates & persistence boundaries
- **Intelligence-owned & persisted:** cognition records + sealed snapshots (as references/hashes) + intelligence-side audit wrappers — all under `intelligence:*` on the substrate.
- **Referenced, never copied as SoR:** knowledge (PI-7), memory (PI-9), committed state (PI-6), identity/policy (PI-4). References are by ID + version/snapshot; **no shared mutable model** (AUTH-004 §6.3).
- **Immutability:** sealed snapshots and audit entries are append-only and content-addressed; reversal is a new forward record (migration-only, IP-14).

### 9.4 State transitions (storage lifecycle)
- **Cognition Record:** `created → active → (superseded-by-forward-record | revoked | expired)` — never destructively rewritten.
- **Snapshot:** `assembling → sealed(immutable) → (referenced) → expired` — content hash fixed at seal.
- **Audit Entry:** `appended → chained` — never mutated or deleted.

### 9.5 Invariants
- SM-1 No knowledge/memory/committed-state system of record inside intelligence (single SoR per concern: PI-7/PI-9/PI-6).
- SM-2 Records are append-only / migration-only; no destructive rewrite (IP-14/IP-15).
- SM-3 Sealed snapshots and audit entries are immutable and content-hashed (reproducibility, tamper-evidence).
- SM-4 Classification labels persist and are monotonic across storage (S4).
- SM-5 Secrets/model weights/keys are stored **by reference only** — never inlined (S3).
- SM-6 Every persisted record is registered and traceable (zero orphan; AUTH-010).

### 9.6 Registry bindings
- All intelligence storage keys are registry-resolved under `intelligence:<kind>:<id>` (registry-driven).
- Backing stores are reached only through PI-2/3 substrate ports (provider-agnostic); **no storage engine, database, datastore, schema, or vendor is selected here** — technology selection is a deferred governed ADR (Prompt 08).

### 9.7 Event relationships
Participates in: `INT_RECORD_REGISTERED`, `INT_SNAPSHOT_SEALED`, `INT_RECORD_SUPERSEDED`, `INT_AUDIT_APPENDED`. Catalog deferred.

### 9.8 Failure semantics
- Substrate write failure ⇒ record not registered ⇒ dependent flow fail-closed (no orphan, no partial state). Snapshot seal failure ⇒ session cannot proceed. Audit append failure ⇒ operation fails closed (no un-audited governed effect). Reference resolution failure (stale/expired PI-7/PI-9/PI-6 ref) ⇒ exclude fail-closed.

### 9.9 Governance constraints
- Single SoR per concern; append-only/migration-only; no shared mutable model; S3 (by-reference secrets/models); S4 (classification persistence/monotonicity); zero-orphan traceability (AUTH-010); technology/datastore selection deferred to Prompt 08 ADRs; Evolution-only commit for governed state.

---

> **END OF PART B — STOPS AFTER STORAGE MODEL (per mandate).**
> **Not produced here:** APIs, Events (catalog), Acceptance Tests, Implementation Backlog — deferred to `B04-C`.

## Governance / Non-Construction Statement

No implementation produced; no code generated; no runtime, infrastructure, services, or model weights created;
no technology/framework/language/datastore/cloud/vendor selected; no governance mechanism, control, or gate
invented; no execution or `git` mutation performed; no lock released; no invariant enrolled; no canon modified;
no previous B04-A section regenerated. This is an implementation-**program** design artifact only; the sole
repository effect is this additive architecture `*.md`. PI-10 construction remains a future Approval-Required
Operation (AUTH-012 §8 / AD-0009) gated behind a scoped Article IX release (`AD-0024`). `UCOS-CONSTRUCTION-BLOCKED`,
the Article IX generation lock, INV-1..13, `AUTH-012`, and **AD-0014** (Ω∞ deferral; INV-14..20 **not** enrolled)
are unchanged. All prospective construction is additive and confined to `src/control/intelligence/*` with zero
prohibited-core-dir change; registry-driven, provider-agnostic, model-agnostic, no-hard-coded-agents,
no-hard-coded-workflows, propose-not-act, deny-by-default, and Evolution-only commit are preserved throughout.

## Traceability
- **Continues:** `B04-A-INTELLIGENCE-FABRIC-IMPLEMENTATION-PROGRAM` (§§ 1–4; not regenerated).
- **Consumes (authoritative):** `INT-GOV-001/002`, `INT-ARCH-001`, `INT-SEC-001`, `INT-FED-001`, `INT-AUD-001`;
  `MEM-*` (PI-9), `KNOW-*`/PI-7, `ONTO-*` (PI-8), Evolution (PI-6/AD-0019), Federation (PI-5/AD-0018),
  Control (PI-4/AD-0017), Substrate (PI-2/3/AD-0016).
- **Refines:** AUTH-003 (IP-01/04/06/14/15), AUTH-008 (S1/S3/S4), AUTH-009, AUTH-010 (traceability), AUTH-012,
  Constitution Art. IX/XII, INV-1..13, AD-0014.
- **Produces (Part B):** Knowledge Model, Memory Model, Agent Model (definitions/capabilities/tools/coordination/
  lifecycle), Execution Model (reasoning/planning/learning/context/agent/coordination flows), Storage Model.
- **Feeds:** `B04-C` (APIs, Events, Acceptance Tests, Implementation Backlog) and, after a future `AD-0024`,
  PI-10 construction + independent PI-10 validation/ratification.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN),
  AD-0014; construction gated by `UCOS-CONSTRUCTION-BLOCKED`.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect).

**END B04-B-INTELLIGENCE-FABRIC-IMPLEMENTATION-PROGRAM — PART B · KNOWLEDGE MODEL · MEMORY MODEL · AGENT MODEL
(DEFINITIONS/CAPABILITIES/TOOLS/COORDINATION/LIFECYCLE) · EXECUTION MODEL (REASONING/PLANNING/LEARNING/CONTEXT/
AGENT/COORDINATION FLOWS) · STORAGE MODEL · REGISTRY-DRIVEN · PROVIDER-AGNOSTIC · MODEL-AGNOSTIC · NO HARD-CODED
AGENTS · NO HARD-CODED WORKFLOWS · PROPOSE-NOT-ACT · DENY-BY-DEFAULT · EVOLUTION-ONLY COMMIT · DESIGN/PLANNING
ONLY · NO APIS / NO EVENTS / NO ACCEPTANCE TESTS / NO BACKLOG · NO CODE / NO INFRA / NO TECH SELECTION / NO
CONSTRUCTION / NO MUTATION · ARTICLE IX + CONSTRUCTION LOCK REMAIN ACTIVE.**
