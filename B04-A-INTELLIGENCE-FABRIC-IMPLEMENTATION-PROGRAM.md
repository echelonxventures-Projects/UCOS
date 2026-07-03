# B04-A — UCOS Intelligence Fabric Implementation Program (Part A)

| Field | Value |
|-------|-------|
| Artifact | **B04-A — Intelligence Fabric Implementation Program (Part A: Executive Summary · Architecture · Domain Model · Engine Catalog)** |
| Artifact ID | `B04-A-INTELLIGENCE-FABRIC-IMPLEMENTATION-PROGRAM` |
| Phase | **B04-A — Intelligence Fabric Construction Program (Part A)** |
| Layer | ARCHITECTURE / PLATFORM (implementation program — specifies engines, models, contracts; builds nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **IMPLEMENTATION PLANNING / DESIGN ONLY** — engine architecture, domain model, and engine catalog. **No source code, no runtime, no infrastructure, no services, no model weights, no technology/framework/vendor selection, no governance invention, no execution, no `git` mutation** beyond this additive architecture `*.md`. Append-only. |
| Scope of Part A | **Deliverables 1–4 only:** (1) Executive Summary, (2) Architecture, (3) Domain Model, (4) Engine Catalog (`INT-ENG-01..08`). **Stops after the Engine Catalog.** Knowledge/Memory/Agent/Execution/Storage models, APIs, Events, Acceptance Tests, and Implementation Backlog are deferred to Part B (`B04-B`). |
| Authoritative inputs | `INT-GOV-001/002`, `INT-ARCH-001`, `INT-SEC-001`, `INT-FED-001`, `INT-AUD-001`, `INT-THREAT-001`, `INT-READINESS-001`, `INTEL-001` (PHASE R10); `MEM-*` (PI-9, RATIFIED), `KNOW-*`/PI-7, `ONTO-*` (PI-8), Evolution (PI-6/AD-0019), Federation (PI-5/AD-0018), Control (PI-4/AD-0017), Substrate (PI-2/3/AD-0016); AUTH-003/008/009/012; Constitution Art. IX/XII; `UCOS-ASR-NFR-001` (INV-1..13); AD-0014 |
| Governance posture | **Planning is not construction.** `UCOS-CONSTRUCTION-BLOCKED` + the Article IX generation lock remain **ACTIVE**. PI-10 construction remains a future Approval-Required Operation gated on a scoped Article IX release (`AD-0024`, per `INTEL-001` §5). This program authorizes nothing and releases no lock. |
| Requirements (binding) | **Registry-driven · Provider-agnostic · Model-agnostic · No hard-coded agents · No hard-coded workflows** (see § 1.4) |
| **Determination** | **INTELLIGENCE FABRIC PROGRAM (PART A) COMPLETE** — the executive summary, reference architecture, domain model, and 8-engine catalog (`INT-ENG-01..08`) are specified and construction-planning-ready under governance. |

> The Intelligence Fabric is a **governed cognition layer** built additively on the ratified PI-2..PI-9
> fabrics. It **proposes; it never autonomously actuates.** Every governed-state mutation routes through the
> Evolution Fabric; every knowledge read through the Knowledge Fabric; every memory recall through the PI-9
> Memory Fabric; every meaning through the PI-8 Ontology Fabric; every proposal is policy-evaluated by the PI-4
> Control Plane before commit. This is **not** the Ω∞ existential intelligence (AD-0014 stands).

---

## 1. Executive Summary

### 1.1 Purpose

The Intelligence Fabric (**PI-10**) is the UCOS layer that reasons over governed knowledge and memory, plans
toward externally authorized goals, learns within governed bounds, and runs metadata-defined agents under
governed coordination — producing **auditable proposals**, never autonomous actions. B04-A specifies the
**engine decomposition** of that fabric into eight named engines and the **domain model** that binds them,
consolidating three concerns that were previously spread across fabrics:

- **Knowledge** (read/evidence) — from PI-7,
- **Memory** (recall/record) — from PI-9,
- **Cognition** (reason/infer/plan/decide) — from the ratified `INT-*` design set,

and adding three concerns the fabric requires to be operational: **Learning** (governed adaptation),
**Agent Runtime** + **Agent Coordination** (governed autonomous actors), and **Context** (bounded
context assembly for cognition).

### 1.2 What Part A delivers

| # | Deliverable | Section | Content |
|:-:|-------------|:-------:|---------|
| 1 | **Executive Summary** | § 1 | Purpose, scope, requirements conformance, governance posture, engine-to-fabric map |
| 2 | **Architecture** | § 2 | Reference architecture, layering, composition rules, engine interaction, determinism quarantine, reuse map |
| 3 | **Domain Model** | § 3 | Bounded context, aggregates/entities, value objects, invariants, relationships, ubiquitous language |
| 4 | **Engine Catalog** | § 4 | `INT-ENG-01..08` — purpose, responsibilities, inputs/outputs, dependencies, invariants, engine boundary |

> **Stops after § 4 (Engine Catalog)**, per mandate.

### 1.3 Engine-to-fabric map

| Engine | ID | Consolidates / builds on | Commit path | Autonomy class |
|--------|:--:|--------------------------|-------------|----------------|
| Memory | `INT-ENG-01` | **PI-9 Memory Fabric** (read-only recall; durable via Evolution) | Evolution (PI-6) | Propose-only |
| Knowledge | `INT-ENG-02` | **PI-7 Knowledge Fabric** (query/resolve) + PI-8 Ontology grounding | Evolution (PI-6) | Read + propose |
| Reasoning | `INT-ENG-03` | `INT-ARCH-001` §2.1 Reasoning Engine | — (proposes) | Propose-only |
| Planning | `INT-ENG-04` | `INT-ARCH-001` §2.3 Planning Engine | — (proposes) | Propose-only |
| Learning | `INT-ENG-05` | **new** (governed adaptation; Inference Adapters `INT-GOV-C2`) | Evolution (PI-6) | Propose-only |
| Agent Runtime | `INT-ENG-06` | **new** (governed metadata-defined agents) | Control Plane (PI-4) → Evolution | Bounded, capability-gated |
| Agent Coordination | `INT-ENG-07` | **new** (governed multi-agent orchestration) | Control Plane (PI-4) → Evolution | Bounded, policy-gated |
| Context | `INT-ENG-08` | **new** (bounded context assembly; Reasoning Session `INT-GOV-C9`) | — (read/assemble) | Read-only |

### 1.4 Requirements conformance (binding)

| Requirement | How the Intelligence Fabric satisfies it |
|-------------|------------------------------------------|
| **Registry-driven** | Every engine, agent, goal, model, capability, policy binding, coordination protocol, and context template is a **runtime metadata-stored record** resolved from the PI-2/3 substrate registry/metadata runtimes under the reserved `intelligence:<kind>:<id>` keyspace (IP-04; `INT-GOV-001` §2). Nothing is compiled-in. |
| **Provider-agnostic** | Knowledge sources, memory tiers, inference mechanisms, and actuation targets are reached only through **public seams / ports** (Knowledge query, Memory recall, Evolution commit, Federation advisory). Concrete providers are pluggable behind those ports; the fabric binds no provider by name (mirrors the AD-0016 substrate port-inversion). |
| **Model-agnostic** | All inference mechanisms are declared in the **Inference Model Registry** (`INT-GOV-C2`) with `{kind, ref, seedPolicy}`; model weights/keys are **by reference only** (S3). Deterministic and non-deterministic (LLM/ML) models are interchangeable behind the **Inference Adapter** boundary; no model is privileged or embedded. |
| **No hard-coded agents** | Agents are **Agent Definition records** (`INT-ENG-06` / § 3) resolved from the registry — identity, capabilities (enumerated allow-list), budgets, goal bindings, and policy scope are data, not code. Zero agents exist as compiled entities. |
| **No hard-coded workflows** | Coordination is expressed as **Coordination Protocol records** (`INT-ENG-07` / § 3) interpreted at runtime — roles, message contracts, sequencing, and decision points are metadata/config (IP-04). No workflow is embedded in the engine. |

### 1.5 Non-negotiable governance envelope (carried from the ratified fabrics)

- **Propose-not-act** (IGP-3): the fabric emits proposals + rationales; the **sole** governed-state mutation
  path is the PI-6 Evolution Fabric; the **sole** authorization gate is the PI-4 Control Plane (deny-by-default).
- **Determinism-by-default / non-determinism quarantine** (IGP-2, INV-6): committed decisions are deterministic
  functions of recorded evidence + pinned snapshots; probabilistic inference is advisory-only behind a
  deterministic verifier **and** a semantic-constraint verifier.
- **Mandatory ontology grounding** (IGP-9): meaning comes only from `active` PI-8 ontology entities; unresolved
  terms are denied fail-closed.
- **Single memory system of record** (IGP-10): PI-9 owns all memory; the fabric holds no local store.
- **Non-waivable security** (S1/S3/S4): authn/authz, secrets-by-reference, data-protection/classification
  inheritance are enforced by the Control Plane.
- **Additive-only, zero prohibited-core-dir change:** all prospective construction is confined to
  `packages/platform-runtime/src/control/intelligence/*`; `src/meta-core`, `src/registry-runtime`,
  `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts` are never modified.
- **AD-0014 boundary:** no self-authored goals, no self-modification, no autonomous actuation; INV-14..20 are
  **not** enrolled or required.

---

## 2. Architecture

### 2.1 Architectural position (layered atop the ratified stack)

```
                 ┌──────────────────────────────────────────────────────────────┐
   PI-10 (this)  │                 INTELLIGENCE FABRIC (governed)                 │  propose-only
                 │                                                                │
                 │   INT-ENG-08 Context  ──▶  INT-ENG-03 Reasoning                │
                 │        ▲  (assembles)          │  orchestrates                 │
                 │        │                       ▼                               │
                 │   INT-ENG-01 Memory      INT-ENG-04 Planning                   │
                 │   INT-ENG-02 Knowledge   INT-ENG-05 Learning (advisory→propose) │
                 │        ▲                       │                               │
                 │   INT-ENG-06 Agent Runtime ─ INT-ENG-07 Agent Coordination      │
                 └───────┬───────────────┬───────────────┬───────────────┬────────┘
                         │ read/recall    │ ground(meaning)│ mutate/commit │ cross-node
                 ┌───────▼──────┐  ┌──────▼──────┐  ┌───────▼─────┐  ┌──────▼──────┐
   PI-7/9/8/6/5  │ KNOWLEDGE    │  │ ONTOLOGY    │  │ EVOLUTION    │  │ FEDERATION  │
                 │ + MEMORY     │  │ (PI-8 read) │  │ (PI-6 commit)│  │ (advisory)  │
                 │ (read)       │  │             │  │              │  │             │
                 └───────┬──────┘  └──────┬──────┘  └───────┬──────┘  └──────┬──────┘
                 ┌───────▼─────────────────▼─────────────────▼────────────────▼──────┐
   PI-4          │     CONTROL FABRICS (PEP: identity/trust/policy/governance +        │
                 │     immutable hash-chained audit)  — deny-by-default, S1/S3/S4       │
                 └───────────────────────────────┬───────────────────────────────────┘
                 ┌───────────────────────────────▼───────────────────────────────────┐
   PI-2/3        │      SUBSTRATE: Meta-Core · Registry · Metadata · Configuration      │
                 └─────────────────────────────────────────────────────────────────────┘
```

**Rule of composition.** Each engine calls **only downward** through public seams. No engine modifies a lower
fabric's behavior; no engine holds an independent write path to governed state. Inter-engine calls occur only
within the fabric's public surface and never bypass the Control Plane for governed effects.

### 2.2 Engine interaction model (the governed cognition loop)

```
 (0) Agent Runtime (ENG-06) activates a governed agent for an AUTHORIZED goal (ENG-03 goal binding)
        │
 (1) Context Engine (ENG-08) assembles a BOUNDED, SNAPSHOT-PINNED context:
        knowledge snapshot (ENG-02) + memory recall (ENG-01) + ontology grounding (PI-8)
        │
 (2) Reasoning Engine (ENG-03) opens a bounded Reasoning Session over the pinned context
        │   ├─ Planning Engine (ENG-04): produce feasible plan under Constraint Set (hard inviolable)
        │   ├─ Inference (deterministic core + quarantined adapters); Learning (ENG-05) may ADVISE
        │   └─ assemble Proposal + hash-chained rationale
        │
 (3) Decision gate: policy-evaluate (PI-4, deny-by-default) → satisfy hard constraints → certify → ratify (SoD)
        │
 (4) Commit: ratified Decision handed to EVOLUTION FABRIC (PI-6) — the ONLY governed-state mutation path
        │       (durable memory writes, learned-artifact promotion, agent-state changes: all Evolution Units)
        │
 (5) Coordination (ENG-07) sequences multi-agent steps; every step audited (PI-4 immutable audit)
        │
 (fail-closed everywhere: unresolved ontology / budget exhaustion / policy deny / unverified non-determinism ⇒ abort, no partial commit)
```

### 2.3 Determinism quarantine (INV-6 compliance) — applies to ENG-03/04/05

```
 grounded evidence ─▶ [Deterministic Reasoning/Planning/Constraint core] ─▶ candidate decision ─▶ commit path
                              ▲ advisory only
                              │
              ┌───────────────┴────────────────┐
              │  Inference Adapter (declared     │  records: modelRef, seed, inputsHash,
              │  NON-DETERMINISTIC, sandboxed)   │           outputClassification, rationaleFragment
              │  — also the Learning surface     │
              └───────────────┬────────────────┘
                              ▼
      [Deterministic Verifier] ∧ [Semantic-Constraint Verifier (ONTO-C8)] ── BOTH must confirm before
                                                                            any influence on a committed decision
```

- Non-deterministic output (LLM/ML/probabilistic, and all **learned** proposals) **cannot** reach `committed`
  state without deterministic-verifier attestation **and** semantic-constraint validation against `active`
  ontology.
- Every adapter/learning invocation is **reproducible-by-record** (`inputsHash + modelRef + seed`) even when the
  model is external and stochastic. The *decision* remains a deterministic function of recorded evidence + pinned
  ontology + pinned memory.

### 2.4 Cross-cutting architectural properties

| Property | Mechanism |
|----------|-----------|
| **Registry-driven** | Engines resolve all definitions (agents, goals, models, protocols, context templates) from substrate registry/metadata under `intelligence:*` |
| **Provider/model-agnostic** | Ports for Knowledge, Memory, Ontology, Evolution, Federation; Inference Model Registry abstracts mechanisms |
| **Bounded** | Reasoning Sessions declare depth/steps/wall/resource budgets; fail-closed on exhaustion (IGP-5) |
| **Explainable** | Every inference/decision emits a signed, hash-chained rationale (`evidence → rule/inference → conclusion`; IGP-6) |
| **Federated** | Foreign contributions are advisory / deny-only / trust-clamped (`INT-FED-001`) |
| **Auditable** | Thin `INT_*` wrapper over the hash-chained `FederatedAuditLog`; reproducible; reconcilable |
| **Secure** | S1 (authn/authz via PEP), S3 (model/keys by-reference), S4 (classification-monotonic recall/inference) |

### 2.5 Reuse map (no re-implementation)

| Need | Reused ratified component | New in Intelligence Fabric? |
|------|---------------------------|:---------------------------:|
| Authn/authz, deny-by-default policy | PI-4 Control Plane / policy evaluator | No |
| Governed mutation/commit | PI-6 Evolution Fabric | No (drives it) |
| Cross-node advisory | PI-5 Federation (assertions, trust clamp, audit) | No (advisory guard) |
| Evidence / knowledge reads | PI-7 Knowledge Fabric | No (read client) |
| Semantic grounding (meaning) | PI-8 Ontology Fabric (`ONTO-C4`) | No (read client) |
| Memory recall / record | PI-9 Memory Fabric (read-only recall; durable via PI-6) | No (read client) |
| Signatures / crypto | Federation `assertions.ts` (Ed25519) | No custom crypto |
| Audit chain | `FederatedAuditLog` pattern | Thin `INT_*` wrapper |
| Records / metadata / config | PI-2/3 substrate ports | No (public seams) |

---

## 3. Domain Model

### 3.1 Bounded context

The Intelligence Fabric is a single **bounded context** (`intelligence`) with a strict boundary: it owns
*cognition constructs* (goals, sessions, proposals, decisions, agents, protocols, learned artifacts, context
bundles) and **references** — never owns — knowledge (PI-7), memory (PI-9), meaning (PI-8), and committed state
(PI-6). All owned records live under the reserved metadata namespace `intelligence:<kind>:<id>`; all foreign
references are by-ID/by-snapshot (no shared mutable model; AUTH-004 §6.3).

### 3.2 Ubiquitous language (glossary)

| Term | Meaning |
|------|---------|
| **Goal** | An externally authorized objective the fabric may reason toward (never self-authored; IGP-1) |
| **Reasoning Session** | A bounded, budgeted, fully audited unit of cognition over pinned snapshots |
| **Proposal** | A candidate change + rationale produced by cognition; has no effect until committed via Evolution |
| **Decision** | A certified + ratified proposal, commit-eligible via the Evolution Fabric only |
| **Rationale** | Signed, hash-chained `evidence → inference → conclusion` explanation (mandatory; IGP-6) |
| **Agent** | A governed, metadata-defined actor with enumerated capabilities and budgets (no hard-coded agents) |
| **Coordination Protocol** | A metadata-defined multi-agent interaction (roles/messages/sequence; no hard-coded workflows) |
| **Learned Artifact** | A model/rule/parameter adaptation proposed by ENG-05; advisory until Evolution-committed |
| **Context Bundle** | A bounded, snapshot-pinned assembly of knowledge + memory recall + ontology grounding |
| **Grounding** | Resolution of a term's meaning to an `active` PI-8 ontology entity (fail-closed) |

### 3.3 Aggregates, entities, value objects

Records reuse and extend the ratified `INT-GOV-001` construct set (`INT-GOV-C1..C13`) and add engine-specific
aggregates. Legend: **AR** = aggregate root · **E** = entity · **VO** = value object.

| Aggregate / Entity | Kind | Metadata key | Owning engine | Reuses |
|--------------------|:----:|--------------|:-------------:|--------|
| **Goal** | AR | `intelligence:goal:<id>` | ENG-03 | `INT-GOV-C3` |
| Goal Authority | E | `intelligence:goal-authority:<id>` | ENG-03 | `INT-GOV-C4` |
| **Reasoning Session** | AR | `intelligence:session:<id>` | ENG-03 | `INT-GOV-C9` |
| Reasoning Authority | E | `intelligence:authority:<id>` | ENG-03 | `INT-GOV-C1` |
| Rationale | VO | (embedded, hash-chained) | ENG-03 | INT-AUD-001 |
| **Plan** | AR | `intelligence:plan:<id>` | ENG-04 | new |
| Constraint Set | E | `intelligence:constraint-set:<id>` | ENG-04 | `INT-GOV-C6` |
| **Proposal** | AR | `intelligence:proposal:<id>` | ENG-03/04/05 | new |
| **Decision** | AR | `intelligence:decision:<id>` | ENG-03 | `INT-GOV-C7/C8` |
| Decision Authority | E | `intelligence:decision-authority:<id>` | ENG-03 | `INT-GOV-C7` |
| Inference Model | E | `intelligence:model:<id>` | ENG-05 | `INT-GOV-C2` |
| **Learned Artifact** | AR | `intelligence:learned:<id>` | ENG-05 | new |
| **Agent Definition** | AR | `intelligence:agent:<id>` | ENG-06 | new |
| Agent Instance | E | `intelligence:agent-instance:<id>` | ENG-06 | new |
| Capability Binding | VO | (embedded, enumerated) | ENG-06 | Registry (PI-2/3) |
| **Coordination Protocol** | AR | `intelligence:protocol:<id>` | ENG-07 | new |
| Coordination Session | E | `intelligence:coord-session:<id>` | ENG-07 | new |
| **Context Bundle** | AR | `intelligence:context:<id>` | ENG-08 | new |
| Ontology Grounding Binding | E | `intelligence:grounding:<id>` | ENG-08 | `INT-GOV-C13` |
| Memory View | E | `intelligence:memory-view:<id>` | ENG-01 | `INT-GOV-C12` |
| Federated Intelligence Authority | E | `intelligence:fed-authority:<id>` | ENG-07 | `INT-GOV-C11` |
| Revocation Authority | E | `intelligence:rev-authority:<id>` | (fabric) | `INT-GOV-C10` |

**Foreign references (owned elsewhere, referenced by ID/snapshot):** Knowledge Item (PI-7), Memory Record
(PI-9, tiers T1–T6), Ontology Record/Graph (`ONTO-C2/C4`), Evolution Unit (PI-6), Federation assertion (PI-5),
Principal/Trust/Policy (PI-4).

### 3.4 Core domain invariants

| # | Invariant | Enforcing engine(s) |
|:-:|-----------|---------------------|
| DI-1 | No `active` Goal without an authorizing Goal Authority; goals never self-extend (expiry fail-closed) | ENG-03 |
| DI-2 | A Reasoning Session cannot open without a resolvable Ontology Grounding Binding + pinned knowledge/memory snapshots | ENG-03, ENG-08 |
| DI-3 | An `infeasible` plan (hard-constraint or `block`-severity semantic violation) can never become a Decision | ENG-04 |
| DI-4 | A Proposal has no effect on governed state except via a committed Evolution Unit (propose-not-act) | all |
| DI-5 | SoD non-waivable: the proposing Reasoning Authority may not certify or ratify the same Decision | ENG-03 |
| DI-6 | Every Decision carries a resolvable, hash-chained Rationale; an un-explainable output is rejected | ENG-03 |
| DI-7 | Non-deterministic / learned output is advisory-only until deterministic + semantic verifiers both attest | ENG-05, ENG-03 |
| DI-8 | Agents hold only **enumerated** capabilities; unknown/implicit capability ⇒ deny | ENG-06 |
| DI-9 | Coordination is interpreted from Protocol records only; no embedded workflow; deny-by-default step gate | ENG-07 |
| DI-10 | Memory is recalled read-only, deny-by-default, classification-monotonic (S4); no fabric-local store | ENG-01 |
| DI-11 | Context Bundles are bounded and snapshot-pinned; stale/expired refs excluded fail-closed | ENG-08 |
| DI-12 | Revocations propagate and are fail-closed; reversal is a new forward Evolution Unit (migration-only, IP-14) | (fabric) |

### 3.5 Relationship map (aggregate lifecycle & references)

```
 Goal(authorized) ──1:N──▶ Reasoning Session ──1:1──▶ Context Bundle ──refs──▶ {Knowledge*, Memory*, Ontology*}
        │                        │
        │                        ├──1:N──▶ Plan ──uses──▶ Constraint Set
        │                        ├──0:N──▶ Learned Artifact (advisory) ──verify──▶ (det + semantic)
        │                        └──1:1──▶ Proposal ──certify/ratify(SoD)──▶ Decision ──commit──▶ Evolution Unit(PI-6)
        │
 Agent Definition ──instantiate──▶ Agent Instance ──bind──▶ Goal
        └──participate──▶ Coordination Protocol ──run──▶ Coordination Session ──audited steps──▶ (PI-4 audit)
 (* = foreign, by-reference/by-snapshot; committed state lives in PI-6, never in the intelligence context)
```

### 3.6 Domain services (fabric-internal, non-committing)

| Service | Responsibility | Determinism |
|---------|----------------|:-----------:|
| Grounding Resolver | Resolve terms → `active` ontology entities (PI-8); deny unresolved | Deterministic |
| Constraint Solver | Satisfy hard/soft constraints; `feasible|infeasible` | Deterministic |
| Rationale Builder | Assemble + hash-chain `evidence → inference → conclusion` | Deterministic |
| Verifier Pair | Deterministic verifier ∧ semantic-constraint verifier for advisory output | Deterministic |
| Proposal Assembler | Package plan + rationale + refs into a Proposal | Deterministic |
| Recall Adapter | Read-only PI-9 memory recall (snapshot-pinned, S4-monotonic) | Deterministic |
| Knowledge Adapter | Read-only PI-7 query/resolve (S4-aware) | Deterministic |

---

## 4. Engine Catalog

Each engine specifies **Purpose · Responsibilities · Inputs · Outputs · Dependencies · Invariants · Boundary**.
All engines are propose-only unless stated; none holds an independent write path; all governed effects route
through PI-4 (authorize) and PI-6 (commit). Prospective code location (design-time only, NOT created):
`packages/platform-runtime/src/control/intelligence/*`.

### INT-ENG-01 — Memory Engine
- **Purpose.** Provide the Intelligence Fabric with governed **recall** of memory and governed **proposal** of
  durable memory, over the ratified PI-9 Memory Fabric as the single system of record (IGP-10).
- **Responsibilities.** Resolve Memory Views (`INT-GOV-C12`); recall across tiers **T1 Working / T2 Short-Term /
  T3 Long-Term / T4 Semantic / T5 Episodic / T6 Federated** read-only; pin a memory snapshot per session;
  package durable-memory changes as Evolution Units targeting the `memory:` namespace.
- **Inputs.** Memory View record; recall query + classification ceiling; session snapshot ref.
- **Outputs.** Read-only recall set (snapshot-pinned); durable-memory **proposals** (never direct writes).
- **Dependencies.** PI-9 Memory Fabric (recall), PI-6 Evolution (durable proposal), PI-4 (deny-by-default, S4).
- **Invariants.** No fabric-local store / no retention / no forgetting (owned by PI-9, `MEM-GOV-002`); recall
  deny-by-default and in-boundary (`MGP-2`); classification monotonic (`MGP-3`, S4); expired/revoked excluded
  fail-closed (`MGP-5`). (DI-10)
- **Boundary.** Reads and proposes; never owns memory-of-record; never mutates memory directly.

### INT-ENG-02 — Knowledge Engine
- **Purpose.** Provide governed **evidence** to cognition by querying the PI-7 Knowledge Fabric, grounded to
  `active` PI-8 ontology entities.
- **Responsibilities.** Execute S4-aware knowledge queries/resolves; ground returned items to ontology
  (IGP-9); pin a knowledge snapshot per session; propose knowledge contributions as Evolution Units.
- **Inputs.** Query + scope; ontology grounding binding; classification ceiling; session snapshot ref.
- **Outputs.** Grounded, snapshot-pinned evidence set; knowledge **proposals** (via Evolution).
- **Dependencies.** PI-7 Knowledge (read), PI-8 Ontology (ground), PI-6 Evolution (propose), PI-4 (S4).
- **Invariants.** Read-only against PI-7 (mutation only via Evolution); every returned item resolves to an
  `active` ontology entity or is dropped fail-closed; classification honored end-to-end (S4).
- **Boundary.** Reads and grounds; never owns the knowledge graph; no ungrounded evidence enters cognition.

### INT-ENG-03 — Reasoning Engine
- **Purpose.** The deterministic orchestrator of a bounded Reasoning Session that turns grounded context into a
  Proposal + rationale and drives the certify/ratify decision gate.
- **Responsibilities.** Open/close bounded sessions (IGP-5); invoke Planning/Inference/Constraint solving over
  the pinned Context Bundle; assemble rationale (IGP-6); run the deny-by-default policy → hard-constraint →
  certify → ratify pipeline; hand ratified Decisions to Evolution.
- **Inputs.** Authorized Goal; Context Bundle (from ENG-08); Constraint Set; policy binding; seed.
- **Outputs.** Proposal; certified/ratified Decision; signed hash-chained rationale; audited session record.
- **Dependencies.** ENG-08 (context), ENG-04 (plan), ENG-05 (advisory inference/learning), PI-4 (policy),
  PI-6 (commit), PI-5 (federated advisory).
- **Invariants.** Fully deterministic given pinned inputs + seed; SoD non-waivable (DI-5); budget exhaustion
  fail-closed; no `decide-commit` power (commit only via Evolution); no session without grounding binding
  (DI-2).
- **Boundary.** Orchestrates and proposes; never writes governed state directly.

### INT-ENG-04 — Planning Engine
- **Purpose.** Produce deterministic, constraint-satisfying **plans** toward an `active` Goal.
- **Responsibilities.** Generate candidate plans over recalled memory + grounded evidence; evaluate against a
  Constraint Set whose terms are resolved to `active` ontology types; emit `feasible|infeasible` with a plan
  trace.
- **Inputs.** Goal; Context Bundle; Constraint Set (hard/soft); ontology grounding.
- **Outputs.** Plan (feasible) + trace; or `infeasible` verdict (never proposable).
- **Dependencies.** ENG-01 (recall), ENG-02 (evidence), PI-8 (grounding), ENG-03 (orchestration).
- **Invariants.** Hard constraints inviolable; an `infeasible` plan can never become a Decision (DI-3);
  planning is deterministic and reproducible.
- **Boundary.** Plans and evaluates; does not certify, ratify, or commit.

### INT-ENG-05 — Learning Engine
- **Purpose.** Governed adaptation — propose improvements to models/rules/parameters/heuristics as **advisory
  Learned Artifacts**, never self-applying (no self-modification; AD-0014).
- **Responsibilities.** Operate declared Inference Adapters / models (`INT-GOV-C2`); record learning invocations
  reproducibly (`modelRef, seed, inputsHash, outputClassification`); emit Learned Artifacts as proposals; drive
  promotion only through the Evolution Fabric after dual verification.
- **Inputs.** Recorded outcomes/evidence (read); model registry entries; seed; verifier bindings.
- **Outputs.** Advisory Learned Artifacts; Evolution Unit proposals for governed adoption.
- **Dependencies.** Determinism quarantine (§2.3), deterministic verifier + semantic-constraint verifier,
  PI-6 Evolution (promotion), PI-4 (policy/approval).
- **Invariants.** Advisory-only until both verifiers attest (DI-7); model weights/keys by-reference (S3); no
  self-modification and no autonomous adoption; every adoption is a governed Evolution Unit (migration-only,
  IP-14).
- **Boundary.** Learns and proposes; never mutates live models or state directly.

### INT-ENG-06 — Agent Runtime Engine
- **Purpose.** Instantiate and run **metadata-defined agents** as governed, bounded, capability-gated actors
  (no hard-coded agents).
- **Responsibilities.** Resolve Agent Definition records from the registry; instantiate Agent Instances bound to
  authorized Goals; enforce enumerated Capability Bindings and per-agent budgets; route every governed effect
  through the Control Plane (authorize) and Evolution (commit); emit audited lifecycle events.
- **Inputs.** Agent Definition (identity, capabilities allow-list, budgets, goal/policy scope, key ref);
  authorized Goal; policy binding.
- **Outputs.** Agent Instance lifecycle; proposals/decisions produced under agent authority; audited actions.
- **Dependencies.** PI-2/3 registry (definitions), PI-4 (identity/trust/policy + audit), ENG-03 (cognition),
  PI-6 (commit).
- **Invariants.** Zero compiled agents — all agents are records (DI-8); capabilities are an enumerated
  allow-list (unknown ⇒ deny); agents are bounded and non-actuating beyond authorized capabilities; propose-not
  -act preserved.
- **Boundary.** Runs governed agents; agents cannot self-grant capabilities or bypass the PEP/Evolution path.

### INT-ENG-07 — Agent Coordination Engine
- **Purpose.** Orchestrate multi-agent interaction from **metadata-defined Coordination Protocols** (no
  hard-coded workflows), under deny-by-default policy and full audit.
- **Responsibilities.** Resolve Coordination Protocol records (roles, message contracts, sequencing, decision
  points); run Coordination Sessions; gate every step through PI-4 policy; enforce SoD across participating
  agents; admit foreign contributions only as advisory/clamped (`INT-GOV-C11`, `INT-FED-001`); audit each step.
- **Inputs.** Coordination Protocol; participating Agent Instances; policy binding; federation authority record.
- **Outputs.** Coordination Session trace; sequenced proposals/decisions; audited step ledger.
- **Dependencies.** ENG-06 (agents), PI-4 (policy/audit), PI-5 (federated advisory), PI-6 (commit).
- **Invariants.** Workflow is data, interpreted at runtime (DI-9); no embedded/compiled workflow; deny-by
  -default step gate; foreign intelligence advisory/deny-only; every step audited; fail-closed on unresolved
  role/step.
- **Boundary.** Sequences and gates; never itself commits governed state (routes to Evolution via agents).

### INT-ENG-08 — Context Engine
- **Purpose.** Assemble a **bounded, snapshot-pinned Context Bundle** — grounded knowledge + memory recall +
  ontology binding — that makes every Reasoning Session reproducible.
- **Responsibilities.** Resolve the Ontology Grounding Binding (`INT-GOV-C13`); pin knowledge (ENG-02) and
  memory (ENG-01) snapshots; enforce classification ceilings and context budgets; expose the Context Bundle to
  ENG-03; exclude stale/expired/revoked references fail-closed.
- **Inputs.** Goal + scope; grounding binding; knowledge query; memory view; classification ceiling; budgets.
- **Outputs.** Context Bundle (knowledge snapshot + memory recall set + ontology snapshot + grounding ref).
- **Dependencies.** ENG-01 (recall), ENG-02 (evidence), PI-8 (grounding), PI-4 (S4).
- **Invariants.** Bounded + snapshot-pinned (DI-11); a bundle without a resolvable grounding binding is invalid
  (DI-2); read-only assembly (no mutation); classification monotonic (S4).
- **Boundary.** Assembles read-only context; never reasons, decides, or commits.

### 4.1 Engine dependency summary

| Engine | Depends on (engines) | Depends on (ratified fabrics) | Commits? |
|:------:|----------------------|-------------------------------|:--------:|
| ENG-01 Memory | — | PI-9, PI-6, PI-4 | via PI-6 |
| ENG-02 Knowledge | — | PI-7, PI-8, PI-6, PI-4 | via PI-6 |
| ENG-08 Context | ENG-01, ENG-02 | PI-8, PI-4 | No |
| ENG-04 Planning | ENG-01, ENG-02 | PI-8 | No |
| ENG-05 Learning | — | PI-6, PI-4 (+ quarantine) | via PI-6 |
| ENG-03 Reasoning | ENG-04, ENG-05, ENG-08 | PI-4, PI-6, PI-5 | via PI-6 |
| ENG-06 Agent Runtime | ENG-03 | PI-2/3, PI-4, PI-6 | via PI-6 |
| ENG-07 Agent Coordination | ENG-06 | PI-4, PI-5, PI-6 | via PI-6 |

**Acyclic.** Read/assembly engines (01/02/08/04) precede orchestration (03), which precedes agent
runtime/coordination (06/07); Learning (05) feeds cognition advisory-only. No engine commits directly; every
commit is a PI-6 Evolution Unit gated by PI-4.

---

> **END OF PART A — STOPS AFTER ENGINE CATALOG (per mandate).**
> Deferred to **B04-B**: Knowledge Model, Memory Model, Agent Model, Execution Model, Storage Model, APIs,
> Events, Acceptance Tests, Implementation Backlog.

## Governance / Non-Construction Statement

No implementation produced; no code generated; no runtime, infrastructure, services, or model weights created;
no technology/framework/language/datastore/cloud/vendor selected; no governance mechanism, control, or gate
invented; no execution or `git` mutation performed; no lock released; no invariant enrolled; no canon modified.
This is an implementation-**program** design artifact only; the sole repository effect is this additive
architecture `*.md`. PI-10 construction remains a future Approval-Required Operation (AUTH-012 §8 / AD-0009)
gated behind a scoped Article IX release (`AD-0024`, per `INTEL-001` §5). `UCOS-CONSTRUCTION-BLOCKED`, the
Article IX generation lock, INV-1..13, `AUTH-012`, and **AD-0014** (Ω∞ deferral; INV-14..20 **not** enrolled)
are unchanged. All prospective construction is additive and confined to `src/control/intelligence/*` with zero
prohibited-core-dir change; propose-not-act, deny-by-default, determinism quarantine, ontology grounding, single
memory system-of-record, and non-waivable S1/S3/S4 are preserved.

## Traceability
- **Consumes (authoritative):** `INT-GOV-001/002`, `INT-ARCH-001`, `INT-SEC-001`, `INT-FED-001`, `INT-AUD-001`,
  `INT-THREAT-001`, `INT-READINESS-001`, `INTEL-001`; `MEM-*` (PI-9), `KNOW-*`/PI-7, `ONTO-*` (PI-8),
  Evolution (PI-6/AD-0019), Federation (PI-5/AD-0018), Control (PI-4/AD-0017), Substrate (PI-2/3/AD-0016).
- **Refines:** AUTH-003 (IP-01/04/06/14/15), AUTH-008 (S1/S3/S4), AUTH-009, AUTH-012, Constitution Art. IX/XII,
  `UCOS-ASR-NFR-001` (INV-1..13), AD-0014.
- **Produces (Part A):** Executive Summary, Reference Architecture, Domain Model, Engine Catalog
  (`INT-ENG-01..08`).
- **Feeds:** `B04-B` (remaining models, APIs, events, acceptance tests, implementation backlog) and, after a
  future `AD-0024`, PI-10 construction + independent PI-10 validation/ratification.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN),
  AD-0014; construction gated by `UCOS-CONSTRUCTION-BLOCKED`.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); Platform/Intelligence architects
  produce conforming designs under Prompts 02–09.

**END B04-A-INTELLIGENCE-FABRIC-IMPLEMENTATION-PROGRAM — PART A · EXECUTIVE SUMMARY · ARCHITECTURE · DOMAIN
MODEL · ENGINE CATALOG (INT-ENG-01 MEMORY / 02 KNOWLEDGE / 03 REASONING / 04 PLANNING / 05 LEARNING / 06 AGENT
RUNTIME / 07 AGENT COORDINATION / 08 CONTEXT) · REGISTRY-DRIVEN · PROVIDER-AGNOSTIC · MODEL-AGNOSTIC · NO
HARD-CODED AGENTS · NO HARD-CODED WORKFLOWS · PROPOSE-NOT-ACT · DESIGN/PLANNING ONLY · NO CODE / NO INFRA / NO
TECH SELECTION / NO CONSTRUCTION / NO MUTATION · ARTICLE IX + CONSTRUCTION LOCK REMAIN ACTIVE.**
