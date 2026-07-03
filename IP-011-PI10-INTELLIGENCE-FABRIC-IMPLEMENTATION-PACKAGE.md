# IP-011 — PI-10 Intelligence Fabric Implementation Package

| Field | Value |
|-------|-------|
| Artifact | **IP-011 — PI-10 Intelligence Fabric Implementation Specification** |
| Package | Implementation Package IP-011 |
| Target | **PI-10 Intelligence Fabric** (governed cognition layer) |
| Version | 1.0.0 |
| Mode | **IMPLEMENTATION DESIGN ONLY** — complete, implementation-ready specification. No source code is created, no lock is released, no AD is issued by this artifact. |
| Authoritative basis | `INTEL-001`, `INT-ARCH-001` (v1.1.0), `INT-GOV-001` (v1.1.0), `INT-GOV-002`, `INT-REM-001`, `INT-REM-002`, `INT-REM-003`, `AD-0024` (scoped Article IX release for `src/control/intelligence/*`), `PROJECT-STATE` (PHASE R10), `REG-ABS-001` |
| Construction gate | Execution of this package is authorized **only** under **AD-0024** (Authority Board, Approval-Required, AUTH-012 §8 / AD-0009). Until then the Article IX generation lock is ACTIVE and `UCOS-CONSTRUCTION-BLOCKED` stands. |
| Prospective location | `packages/platform-runtime/src/control/intelligence/*` + one additive re-export line in `src/control/index.ts` |
| Non-waivable constraints | Additive-only over PI-2..PI-9; propose-not-act (IGP-3); Evolution-only commit (D9); determinism quarantine (INV-6); ontology grounding fail-closed (IGP-9); single memory SoR (IGP-10); S1/S3/S4; no custom crypto (reuse federation Ed25519); no INV-14..20; AD-0014 Ω∞ boundary preserved; 269/269 baseline green at every step |

> The Intelligence Fabric is a governed cognition layer composed additively on the ratified fabrics. It
> **proposes**; it never autonomously actuates. Every governed-state mutation routes through the Evolution
> Fabric (PI-6); every fact read routes through the Knowledge Fabric (PI-7); every meaning resolution routes
> through the Ontology Fabric (PI-8); every memory recall routes read-only through the Memory Fabric (PI-9);
> every cross-node contribution is advisory via the Federation Fabric (PI-5); every proposal is policy-evaluated
> by the PI-4 Control Plane before commit. This package specifies **how to build it**; it is not the Ω∞
> existential intelligence (AD-0014 stands).

---

## 0. Package Scope & Conventions

### 0.1 What this package delivers
An implementation-ready specification across 15 axes (Domain, Service, Engine, Runtime, Registry, Event,
Storage, API, Security, Governance, Integration, Test, Migration, Repository, Backlog). Every construct traces
to `INT-GOV-001` C1..C13, the four engines of `INT-ARCH-001`, the lifecycle/decision-rights of `INT-GOV-002`,
and the remediated single-source-of-truth model of `INT-REM-001/002/003`.

### 0.2 Naming & keyspace conventions (inherited)
- Language/runtime: TypeScript, ESM, in-process, matching peer fabrics (`src/control/{knowledge,ontology,memory}`).
- Reserved metadata keyspace: `intelligence:<kind>:<id>` (per FED-PROV provenance keying; carried in data — no new core-port fields).
- Public surface: namespaced barrel re-export `export * as intelligence from "./intelligence/index.ts"` in `src/control/index.ts` (one additive line), mirroring the `ontology`/`memory` pattern that avoids barrel-name collisions (`unitHash`, `createUnit`, `canTransition`, `namespacedId`, …).
- Crypto: reuse federation `assertions.ts` (Ed25519) and hash-chaining (SHA-256) — **no custom cryptography** (HC-4, REG-ABS-001).
- Determinism: every commit-path function is a pure function of recorded inputs + pinned snapshots + seed.

### 0.3 Construct ↔ module index (normative)
| Construct | ID | Primary module |
|-----------|----|----------------|
| Reasoning Authority | C1 | `reasoning-authority.ts` |
| Inference Model Registry | C2 | `inference-model-registry.ts` |
| Goal | C3 | `goal-registry.ts` |
| Goal Authority | C4 | `goal-authority.ts` |
| Policy Evaluation Binding | C5 | `policy-binding.ts` |
| Constraint Set | C6 | `constraint-solver.ts` (+ `types.ts` record) |
| Decision Authority | C7 | `decision-authority.ts` |
| Decision Certification/Ratification | C8 | `decision-engine.ts` |
| Reasoning Session | C9 | `reasoning-engine.ts` (+ session record in `types.ts`) |
| Intelligence Revocation Authority | C10 | `intelligence-revocation.ts` |
| Federated Intelligence Authority | C11 | `federated-intelligence.ts` |
| Memory Scope (read-only view over PI-9) | C12 | `memory-access.ts` |
| Ontology Grounding Binding | C13 | `ontology-access.ts` |

---

## 1. Domain Model

The domain is expressed entirely as metadata-stored records interpreted by engines (0 hardcoded goals, models,
policies, decisions — IP-04). All records live under `intelligence:<kind>:<id>`.

### 1.1 Shared value types (`types.ts`)
```ts
// Classification lattice (reused from control types; monotonic under S4)
type Classification = "public" | "internal" | "confidential" | "secret";

// Consequence class drives quorum + Approval-Required thresholds (INT-GOV-002 §2)
type ConsequenceClass = "c0" | "c1" | "c2" | "c3"; // c0 informational … c3 board-reserved

// Determinism class (INV-6 quarantine)
type DeterminismClass = "deterministic" | "non-deterministic";

// PI-9 memory tiers (MEM-GOV-001 §2)
type MemoryTier = "T1" | "T2" | "T3" | "T4" | "T5" | "T6"; // WM/STM/LTM/SEM/EPI/FED

// Immutable, versioned snapshot references (reproducibility triad)
interface SnapshotRef { ref: string; hash: string; pinnedAt: string; }

// Reproducible provenance for any non-deterministic contribution
interface AdapterProvenance {
  modelRef: string; seed: string; inputsHash: string;
  outputClassification: Classification; rationaleFragment: string;
}

// Grounded evidence assertion (INT-REM-001 §4) — never opaque data
interface GroundedEvidence {
  evidenceId: string;
  sourceKind: "knowledge" | "memory" | "inference-adapter" | "federated-advisory";
  sourceRef: string;
  groundedType: string;          // MUST resolve to an ACTIVE ONTO-C5 entity in the pinned ontology snapshot
  classification: Classification;
  provenance: string;
  memoryProvenance?: string;     // MGP-7 envelope, present iff sourceKind = "memory"
  verifierAttestation?: string;  // deterministic guard, present iff sourceKind = "inference-adapter"
}
```

### 1.2 Governance construct records (C1..C13)
Records reproduce `INT-GOV-001 §2` shapes verbatim as TypeScript interfaces:

```ts
// C1 Reasoning Authority — intelligence:reasoning-authority:<id>
interface ReasoningAuthorityRecord {
  authorityId: string; principalRef: string;
  powers: Array<"reason" | "infer" | "plan" | "decide-propose" | "solve">; // enumerated allow-list; NO decide-commit
  scope: string; keyRef: string;
  status: "registered" | "active" | "suspended" | "revoked";
}

// C2 Inference Model Registry — intelligence:model:<id>
interface InferenceModelRecord {
  modelId: string; kind: DeterminismClass; ref: string; seedPolicy: string;
  inputClassificationMax: Classification; outputClassification: Classification;
  verifierRef?: string;   // REQUIRED before a non-deterministic model may enter `active`
  keyRef?: string;
  status: "registered" | "active" | "deprecated" | "retired";
}

// C3 Goal — intelligence:goal:<id>
interface GoalRecord {
  goalId: string; statement: string; ownerRef: string; scope: string;
  constraints: string[];  // constraintSetId[]
  consequenceClass: ConsequenceClass; authorizedBy: string; expiresAt: string;
  status: "proposed" | "authorized" | "active" | "suspended" | "achieved" | "abandoned" | "expired";
}

// C4 Goal Authority — intelligence:goal-authority:<id>
interface GoalAuthorityRecord {
  goalAuthorityId: string; principalRef: string; scope: string;
  maxConsequenceClass: ConsequenceClass; keyRef: string; status: "active" | "suspended" | "revoked";
}

// C5 Policy Evaluation Binding — intelligence:policy-binding:<id>
interface PolicyEvaluationBinding {
  bindingId: string; scope: string; policySetRef: string; evaluationMode: "pre-commit";
}

// C6 Constraint Set — intelligence:constraint-set:<id>
interface ConstraintSetRecord {
  constraintSetId: string;
  hard: Constraint[]; soft: Array<{ constraint: Constraint; weight: number }>;
  scope: string;
}
interface Constraint { term: string; groundedType: string; op: string; value: unknown; } // term typed against ONTO-C5

// C7 Decision Authority — intelligence:decision-authority:<id>
interface DecisionAuthorityRecord {
  decisionAuthorityId: string; principalRef: string; scope: string;
  maxConsequenceClass: ConsequenceClass; keyRef: string; status: "active" | "suspended" | "revoked";
}

// C8 Decision (certification/ratification) — intelligence:decision:<id> (append-only)
interface DecisionRecord {
  decisionId: string; proposalRef: string; rationaleRef: string;
  certifiedBy: string; ratifiedBy: string[]; quorumMet: boolean; at: string;
  status: "proposed" | "policy-evaluated" | "constraint-checked" | "certified"
        | "ratified" | "committed" | "superseded" | "revoked";
  commitVia?: string; // evolutionUnitRef, set at `committed`
}

// C9 Reasoning Session — intelligence:session:<id>  (snapshot triad, INT-REM-003 §2)
interface ReasoningSessionRecord {
  sessionId: string; authorityId: string; goalId?: string;
  budgets: { depth: number; steps: number; wallMs: number; resource: number };
  knowledgeSnapshotRef: SnapshotRef; ontologySnapshotRef: SnapshotRef; memorySnapshotRef: SnapshotRef;
  groundingBindingRef: string; memoryViewRef: string; seed: string;
  status: "open" | "running" | "completed" | "aborted-budget" | "aborted-fault";
}

// C10 Intelligence Revocation Authority — intelligence:revocation-authority:<id>
interface RevocationAuthorityRecord {
  revAuthorityId: string; principalRef: string;
  revocableKinds: Array<"goal" | "model" | "authority" | "decision">; keyRef: string;
}

// C11 Federated Intelligence Authority — intelligence:fed-authority:<id>
interface FederatedIntelligenceAuthorityRecord {
  fedIntAuthorityId: string; nodeId: string;
  powers: Array<"advise" | "infer-contribute" | "decision-attest">;
  maxTrustLevel: number; keyRef: string; status: "active" | "suspended" | "revoked";
}

// C12 Memory Scope (read-only VIEW over PI-9; INT-REM-002 §4.1) — intelligence:memory-view:<id>
interface MemoryViewRecord {
  memoryViewId: string; scope: string; tierRefs: MemoryTier[]; subjectSelector: string;
  classificationCeiling: Classification; recallMode: "read-only";
  memorySnapshotRef: SnapshotRef; onExpiredOrRevoked: "deny"; ownerRef: string;
  status: "active" | "suspended" | "revoked";
}

// C13 Ontology Grounding Binding (INT-REM-001 §3.2) — intelligence:grounding:<id>
interface OntologyGroundingBinding {
  bindingId: string; scope: string; ontologyNamespaceRefs: string[];
  ontologySnapshotRef: SnapshotRef; resolutionMode: "active-only"; onUnresolved: "deny";
  status: "active" | "suspended" | "revoked";
}
```

### 1.3 Decision Provenance aggregate (`INT-REM-003 §3.1`)
`DecisionProvenance` is the rationale-complete aggregate assembled by the Decision Engine and hash-chained into
the audit log; it references (never copies) the grounding, evidence, inference steps, policy result, constraint
result, SoD signatures, and the `commitVia` Evolution Unit. It is the sole object promoted to `committed`.

### 1.4 Domain invariants (fail-closed)
- No `active` goal without an authorizing Goal Authority whose `maxConsequenceClass ≥ goal.consequenceClass`.
- No reasoning session may target a goal not in `active`; a session cannot `open` without a resolvable C13 binding.
- No `decide-commit` power exists on any authority (commit is D9 via Evolution only).
- A non-deterministic model cannot enter `active` without a bound deterministic verifier (`verifierRef`).
- Every `groundedType` resolves to an `active` ONTO-C5 entity in the pinned ontology snapshot, else deny.
- Hard constraints are inviolable; an `infeasible` plan can never be proposed as a decision.

---

## 2. Service Architecture

The fabric is a set of collaborating in-process services assembled by `intelligence-control.ts`. No service
holds a write path to governed state; all mutation is proposed to PI-6.

### 2.1 Service map
| Service | Module | Responsibility | Reads | Proposes |
|---------|--------|----------------|-------|----------|
| Reasoning Authority Registry | `reasoning-authority.ts` | CRUD/lifecycle of C1 records; enumerated powers | Metadata | — |
| Inference Model Registry | `inference-model-registry.ts` | C2 records; determinism class; verifier binding | Metadata | — |
| Goal Registry | `goal-registry.ts` | C3 lifecycle; expiry fail-closed | Metadata | — |
| Goal Authority | `goal-authority.ts` | C4 authorization of goals (Approval-Required) | Metadata | — |
| Decision Authority | `decision-authority.ts` | C7 certify/ratify eligibility; SoD, quorum, cap | Metadata | — |
| Revocation Authority | `intelligence-revocation.ts` | C10 forward-only revocation, propagate fail-closed | Metadata | Evolution (reversal) |
| Federated Intelligence Guard | `federated-intelligence.ts` | C11 advisory foreign contributions, trust clamp | Federation | — |
| Ontology Access | `ontology-access.ts` | C13 read/resolve client over PI-8 (`active-only`) | PI-8 | — |
| Memory Access | `memory-access.ts` | C12 read-only recall client over PI-9 | PI-9 | Evolution (durable memory) |
| Knowledge Access | `knowledge-access.ts` | S4-aware read-only query over PI-7 | PI-7 | — |
| Policy Binding | `policy-binding.ts` | C5 adapter to PI-4 policy evaluator (pre-commit) | PI-4 | — |
| Reasoning Engine | `reasoning-engine.ts` | C9 bounded session orchestration | all reads | Proposal |
| Inference Engine (+Adapter) | `inference-engine.ts`, `inference-adapter.ts` | deterministic core + quarantined adapter | PI-8 | — |
| Planning Engine | `planning-engine.ts` | deterministic plans over typed constraints | PI-8/PI-9 | — |
| Constraint Solver | `constraint-solver.ts` | C6 hard/soft satisfaction | PI-8 | — |
| Decision Engine | `decision-engine.ts` | C8 pipeline gate; assembles provenance; hands to Evolution | all | Evolution (commit) |
| Audit Log | `intelligence-audit-log.ts` | hash-chained INT_* events | — | — |
| Control Assembly | `intelligence-control.ts` | wires all services; sole governed-mutation entry | — | Evolution |

### 2.2 Dependency wiring (composition root)
`createIntelligence(ports)` receives the substrate ports (`RegistryPort`, `MetadataPort`, `ConfigurationPort`)
and the ratified fabric handles (`ControlPlane`/PI-4 policy evaluator, Evolution control, Knowledge query,
Ontology resolver/snapshot, Memory recall/snapshot, Federation verifier). It constructs registries →
access clients → engines → decision engine → control, and returns the `IntelligenceControl` facade.

### 2.3 Separation of Duties (service-level)
Proposer (Reasoning Authority via Reasoning Engine) ≠ Certifier ≠ Ratifier (Decision Authority via Decision
Engine) ≠ Committer (Evolution Governor). Enforced structurally: the Reasoning/Inference/Planning services have
no reference to the Evolution commit handle; only `decision-engine.ts` does, and only after certification +
ratification checks pass.

---

## 3. Engine Architecture

### 3.1 Reasoning Engine (deterministic orchestrator)
- Opens a bounded `ReasoningSession` (C9) only when a resolvable C13 grounding binding exists.
- Pins the **snapshot triad**: knowledge (PI-7), ontology (PI-8, `ONTO-C4` projection), memory (PI-9 recall set).
- Gathers `GroundedEvidence` (each grounded to an `active` ONTO-C5 entity), invokes Inference/Planning/Constraint solving over the pinned ontology graph, and assembles a Proposal + mandatory rationale.
- Fully deterministic given `(session inputs, knowledge snapshot, ontology snapshot, memory snapshot, policy set, constraint set, seed)`. No side effects except audit + ephemeral working context (no local store).
- Enforces IGP-5 budgets (depth/steps/wall/resource); budget exhaustion → `aborted-budget`, fail-closed, no partial commit.

### 3.2 Inference Engine + Inference Adapter (determinism quarantine, INV-6)
```
 grounded evidence ─▶ [Deterministic Inference core: ontology-relative over ONTO-C4/C6/C7] ─▶ candidate conclusion ─▶ commit path
                                                                                                    ▲ advisory only
        Inference Adapter (declared NON-DETERMINISTIC, sandboxed) ─┐                                 │
          records AdapterProvenance{modelRef,seed,inputsHash,…}    └─▶ advisory fragment ─▶ [Deterministic Verifier/Guard]
                                                                                             + [Semantic-Constraint Verifier (ONTO-C8)]
```
- Deterministic inference derives only relationships admissible under `active` ONTO-C6/C7 and is checked against ONTO-C8 semantic constraints.
- Non-deterministic adapter output is advisory-only and **cannot** reach `committed` without (a) a deterministic verifier attestation **and** (b) a Semantic-Constraint Verifier confirming ontology validity. A fragment referencing an unresolved/deny type is dropped fail-closed.
- Every adapter invocation is reproducible-by-record (inputs hash + model ref + seed) even when the model is external/stochastic.

### 3.3 Planning Engine (deterministic)
- Produces plans toward an `active` goal subject to a Constraint Set whose terms are typed against `active` ontology types, over memory recalled read-only from PI-9. Emits `feasible | infeasible`.
- An `infeasible` plan (hard-constraint or `block`-severity semantic-constraint violation) can never be proposed as a decision.

### 3.4 Constraint Solver (deterministic)
- Satisfies hard (inviolable) and soft (weighted) constraints; hard-constraint violation → reject (never overridden by soft optimization). Constraint evaluation is deterministic and typed against the pinned ontology snapshot.

### 3.5 Decision Engine (deterministic gate, non-committing)
- Drives a feasible proposal through the pipeline: policy-evaluated → constraint-checked → certified (SoD) → ratified (quorum) → assembles `DecisionProvenance` → hands the ratified decision to the Evolution Fabric for the actual commit. The engine itself **never writes** governed state.

### 3.6 Semantic-Constraint Verifier & Deterministic Verifier/Guard
Two independent verifiers on the quarantine boundary: the Deterministic Verifier confirms adapter contributions
against deterministic rules/constraints; the Semantic-Constraint Verifier confirms asserted entities/relations
are `active`-ontology-valid (ONTO-C8). Both must pass before any non-deterministic influence is commit-eligible.

---

## 4. Runtime Architecture

### 4.1 Reasoning-session runtime
1. **Open**: resolve C1 authority, C13 binding, C12 memory view, target `active` goal, declared budgets, resolved seed → `open`.
2. **Pin**: capture knowledge/ontology/memory snapshots (immutable, versioned, hashed) → `running`.
3. **Reason**: deterministic core loop bounded by budgets; adapter calls are sandboxed/advisory.
4. **Propose**: assemble Proposal + rationale (advisory, zero side effects).
5. **Terminate**: `completed` (proposal emitted) | `aborted-budget` | `aborted-fault` (fail-closed, non-committable).

### 4.2 Determinism & reproducibility
A committed decision is a deterministic function of `(pinned facts, pinned meaning, pinned memory, policy set,
constraint set, seed)`. Non-deterministic contributions are advisory and independently re-verified. This is the
runtime expression of INV-6.

### 4.3 Fail-closed matrix (runtime)
| Condition | Runtime outcome |
|-----------|-----------------|
| C13 binding unresolvable | session cannot open |
| `groundedType` unresolved/expired/revoked | evidence excluded; conclusion referencing it rejected |
| budget exhausted | `aborted-budget`, no partial commit |
| adapter fragment fails verifier or ONTO-C8 | fragment dropped; cannot influence commit |
| policy denial | pipeline abort at `policy-evaluated` |
| hard-constraint violation | pipeline abort at `constraint-checked` |
| certifier = proposer | certification rejected (SoD) |
| quorum unmet | ratification rejected |
| expired/revoked memory recall | excluded (treated as absent) |
| construct in unknown revocation state | treated as revoked (deny) |

### 4.4 Concurrency & isolation
Commit routing inherits the Evolution Governor discipline (`maxInFlight = 1`) — the fabric never opens an
independent write path. Reasoning sessions are isolated by pinned snapshots; concurrent sessions never share
mutable state (no local store).

---

## 5. Registry Architecture

### 5.1 Object-model absolutism (REG-ABS-001)
Every intelligence object (C1..C13) is a `MetadataRecord` under `intelligence:<kind>:<id>`; engines only
**interpret** records. This realizes the previously-GAP subject **Agents** as registry-backed runtime objects
(`intelligence:*` records + `identity` records with `kind:"agent"`), closing REG-ABS-001 Class-B item #4 through
the normal authorization→implementation→ratification path. No new hard-coded object classes are introduced
(HC-1..HC-7 remain the intended, permanent bootstrap/constitutional floor).

### 5.2 Keyspace allocation
```
intelligence:reasoning-authority:<id>   intelligence:model:<id>
intelligence:goal:<id>                  intelligence:goal-authority:<id>
intelligence:policy-binding:<id>        intelligence:constraint-set:<id>
intelligence:decision-authority:<id>    intelligence:decision:<id>          (append-only)
intelligence:session:<id>               intelligence:revocation-authority:<id>
intelligence:fed-authority:<id>         intelligence:memory-view:<id>
intelligence:grounding:<id>             intelligence:revoked:<kind>:<id>    (revocation tombstones)
```

### 5.3 Schemas & resolution
- Each record kind ships a JSON schema registered with the `MetadataPort` validator (mirrors `MEMORY_RECORD_SCHEMA`, `POLICY_SCHEMA`).
- Resolution is deny-by-default (unresolved/expired/revoked → absent), with local-sovereignty clamping for any federated advisory records (local shadows foreign), reusing the `OntologyResolver`/`MemoryResolver` pattern.
- No versioned `RegistryPort` capability/contract records are required for the fabric's own constructs; `RegistryPort` is consulted read-only when a construct references a capability/contract descriptor.

### 5.4 Namespace helpers (`intelligence-namespace.ts`)
`recordKey`, `recordIdPrefix`, `authorityKey`, `revokedKey`, `namespacedId`, `parseNamespacedId` — same shape as
`memory-namespace.ts`, over the `intelligence:` prefix constants.

---

## 6. Event Model

### 6.1 Audit chain
Hash-chained, signed INT_* events via `intelligence-audit-log.ts` (reuses the `FederatedAuditLog`/`MemoryAuditLog`
pattern: SHA-256 chaining from a genesis hash `INT_GENESIS_HASH`, Ed25519 signatures). Append-only; retiring a
model never rewrites past rationales.

### 6.2 Event catalogue (emitted at every governed transition)
| Event | Emitted when |
|-------|--------------|
| `INT_AUTHORITY_REGISTERED/ACTIVATED/SUSPENDED/REVOKED` | C1/C4/C7/C10/C11 lifecycle |
| `INT_MODEL_REGISTERED/ACTIVATED/DEPRECATED/RETIRED` | C2 lifecycle (activation requires verifier binding) |
| `INT_GOAL_PROPOSED/AUTHORIZED/ACTIVATED/SUSPENDED/ACHIEVED/ABANDONED/EXPIRED` | C3 lifecycle |
| `INT_GROUNDING_BOUND/REVOKED` | C13 lifecycle |
| `INT_MEMORYVIEW_BOUND/REVOKED` | C12 lifecycle |
| `INT_SESSION_OPENED/RUNNING/COMPLETED/ABORTED_BUDGET/ABORTED_FAULT` | C9 lifecycle |
| `INT_EVIDENCE_ADMITTED/EXCLUDED` | grounded-evidence admission (excluded = fail-closed) |
| `INT_ADAPTER_INVOKED` | adapter call (records AdapterProvenance) |
| `INT_ADAPTER_FRAGMENT_VERIFIED/DROPPED` | verifier + ONTO-C8 gate outcome |
| `INT_DECISION_PROPOSED/POLICY_EVALUATED/CONSTRAINT_CHECKED/CERTIFIED/RATIFIED/COMMITTED/SUPERSEDED/REVOKED` | C8 pipeline |
| `INT_COMMIT_ROUTED` | ratified decision handed to Evolution (`commitVia`) |
| `INT_DENIED` | any fail-closed denial (with reason code) |

### 6.3 Event invariants
Every event carries `{ seq, prevHash, hash, sig, actorRef, at, payloadRef }`. No commit-path event may be emitted
without its predecessor’s hash; reconciliation detects divergence (reuse `MemReconciliationResult` pattern).

---

## 7. Storage Model

### 7.1 Backing stores (no new ports)
- **MetadataPort** — all C1..C13 records + revocation tombstones (keyspace §5.2), schema-validated.
- **RegistryPort** — read-only lookups of referenced capability/contract descriptors.
- **ConfigurationPort** — fabric configuration layers (budgets defaults, quorum thresholds by consequence class, classification ceilings) — data, not code.

### 7.2 No local stores (single-SoR)
The fabric persists **no** ontology (PI-8 owns meaning) and **no** memory of record (PI-9 owns memory). Working
context is ephemeral and never authoritative. Durable memory the fabric wishes to create is a **proposed
Evolution Unit** targeting the `memory:` namespace (MGP-4).

### 7.3 Snapshots
The three pinned snapshots (`knowledgeSnapshotRef`, `ontologySnapshotRef`, `memorySnapshotRef`) are stored by
reference + hash on the session record. Snapshots are immutable and reproducible-by-record; the fabric consumes
peer-fabric snapshot facilities (`OntologySnapshot`, `MemorySnapshot`) rather than re-implementing them.

### 7.4 Append-only audit
Audit entries are append-only and hash-chained; no in-place mutation. Terminal record states are immutable;
reversal is a new forward Evolution Unit (IP-14, migration-only).

---

## 8. API Surface

### 8.1 Public barrel (`intelligence/index.ts`)
Exports types (records + value types §1), namespace helpers, unit/record builders, lifecycle/state-machine
helpers, registries, access clients, engines, verifiers, audit log + genesis hash, and the control assembly.
Re-exported from `src/control/index.ts` as:
```ts
// PI-10 Intelligence Fabric (AD-0024) — additive governed cognition over substrate + control +
// federation + evolution + knowledge + ontology + memory. Namespaced to avoid barrel collisions.
export * as intelligence from "./intelligence/index.ts";
```

### 8.2 Control facade (`intelligence-control.ts`)
```ts
interface IntelligenceOptions { /* ports + peer-fabric handles + config */ }
function createIntelligence(opts: IntelligenceOptions): IntelligenceControl;

class IntelligenceControl {
  // registries (Approval-Required ops route through PI-4 governance)
  registerReasoningAuthority(rec): Result; registerModel(rec): Result;
  authorizeGoal(rec): Result; bindGrounding(rec): Result; bindMemoryView(rec): Result;
  defineConstraintSet(rec): Result; bindPolicy(rec): Result;

  // cognition
  openSession(input): ReasoningSessionRecord;      // fail-closed without C13 binding
  reason(sessionId): Proposal;                     // bounded, deterministic, audited

  // decision pipeline (non-committing here; commit is via Evolution)
  proposeDecision(proposalRef): DecisionRecord;
  certifyDecision(decisionId, certifierRef): DecisionRecord;   // SoD: ≠ proposer
  ratifyDecision(decisionId, ratifierRefs): DecisionRecord;    // quorum by consequence class
  commitDecision(decisionId): { evolutionUnitRef: string };    // routes to Evolution ONLY

  // revocation (forward-only, propagate fail-closed)
  revoke(kind, id, revAuthorityId): Result;

  // read clients
  recall(viewId, tier, subject): GroundedEvidence[];  // read-only PI-9
  resolveMeaning(bindingId, term): OntologyRef;        // read/resolve PI-8, active-only
  queryKnowledge(query): GroundedEvidence[];           // read-only PI-7, S4-aware
}
```

### 8.3 Method contracts (selected)
- `openSession` throws/denies fail-closed if the C13 binding is unresolvable, the goal is not `active`, budgets are missing, or the seed cannot be resolved.
- `commitDecision` requires `status = ratified`, all seven `INT-REM-003 §3.2` rationale-completeness conditions satisfied; it returns the Evolution Unit ref and transitions the decision to `committed` only after Evolution applies.
- All Approval-Required operations (D1..D10) return a pending governance state until the PI-4 approval/certification record resolves.

---

## 9. Security Model

### 9.1 Non-waivable security floor (S1/S3/S4)
- **S1** deny-by-default across recall, resolution, policy, and commit.
- **S3** secrets/model weights/keys **by reference only** (`keyRef`, `modelRef`) — never embedded in records.
- **S4** classification honored end-to-end and **monotonic**; a memory view may narrow but never declassify (`classificationCeiling`); evidence classification propagates into the decision provenance.

### 9.2 Cryptography (reuse only)
Ed25519 signed assertions and SHA-256 hash-chaining reuse federation `assertions.ts` / the audit-log pattern —
**no custom cryptography** (HC-4). Every lifecycle transition and audit entry is signed; replay/freshness
protection is inherited.

### 9.3 Determinism quarantine as a security control (INV-6)
Non-deterministic inference is sandboxed, advisory, and double-gated (deterministic verifier + semantic-constraint
verifier). This is the primary control against I6 (inference/prompt injection) and a contributor to I2 (evidence
poisoning) and I3 (non-determinism).

### 9.4 Separation of duties (non-waivable)
Proposer ≠ certifier ≠ ratifier ≠ committer (D7/D8/D9). No `decide-commit` power exists on any authority.

### 9.5 Threat coverage (STRIDE I1–I12; `INT-THREAT-001`)
| Threat | Primary control(s) |
|--------|--------------------|
| I1 self-authored goals | IGP-1; Goal Authority (C4) mandatory authorization |
| I2 evidence poisoning | ontology-valid grounded evidence + ONTO-C8 gate (C13, §3.2) |
| I3 non-determinism / unreproducible context | snapshot triad pinning (§4.2); seed recording |
| I4 Ω∞ actuation escape | propose-not-act (IGP-3); commit only via Evolution (D9); no INV-14..20 |
| I5 memory tampering / declassification | read-only recall; S4 monotonic ceiling; fail-closed expiry (C12) |
| I6 inference/prompt injection | determinism quarantine double-gate (§3.2, §3.6) |
| I7 constraint bypass | hard-constraint inviolability; typed constraints over pinned ontology |
| I8 SoD violation | proposer ≠ certifier ≠ ratifier; quorum (C7/C8) |
| I9 federated abuse | advisory/deny-only foreign contributions; trust clamp (C11) |
| I10 audit tampering | hash-chained signed INT_* audit (append-only) |
| I11 resource exhaustion | bounded cognition budgets; fail-closed abort (IGP-5) |
| I12 model substitution | model registry determinism class + verifier binding (C2) |

**Verification gate (on construction):** an I1–I12 adversarial suite must reproduce **0 residual High/High**.

---

## 10. Governance Model

### 10.1 Decision-rights matrix (D1..D10, `INT-GOV-002 §2`)
| # | Decision class | Authority | SoD / Quorum | Approval-Required |
|:-:|----------------|-----------|--------------|:-----------------:|
| D1 | Register/scope a Reasoning Authority | Board | — | Yes |
| D2 | Register/activate an Inference Model | Board | verifier-bound if non-deterministic | Yes |
| D3 | Author/authorize a Goal | Goal Authority | ≤ maxConsequenceClass | Yes |
| D4 | Open a Reasoning Session | Reasoning Authority | budgets declared | Yes if consequential |
| D5 | Define/modify a Constraint Set | Reasoning/Decision Authority | hard-set change → Board | Yes |
| D6 | Bind a Policy Evaluation set | Board | — | Yes |
| D7 | Certify a proposed Decision | Decision Authority | **≠ proposer** | Yes |
| D8 | Ratify a Decision | Decision Authority | **quorum** by consequence class | Yes |
| D9 | Commit a Decision (via Evolution) | Evolution Governor + Control Plane | evolution quorum | Yes |
| D10 | Revoke goal/model/authority/decision | Revocation Authority | fail-closed propagate | Yes |

### 10.2 Lifecycle state machines (enforced by the PI-4 lifecycle engine)
- Goal: `proposed → authorized → active → {suspended ↔ active} → {achieved|abandoned|expired}`
- Model: `registered → active → deprecated → retired`
- Session: `open → running → {completed|aborted-budget|aborted-fault}`
- Decision: `proposed → policy-evaluated → constraint-checked → certified → ratified → committed → {superseded|revoked}`
- Plan: `drafted → constraint-checked → {feasible|infeasible} → (feasible) proposed-as-decision`

All transitions are signed, audited, replay/freshness-protected, and fail-closed; illegal transitions are
rejected; terminal states are immutable (reversal is a new forward act, IP-14).

### 10.3 Approval-Required & escalation
Every D1..D10 is an Approval-Required Operation (AD-0009); decisions above the authority’s `maxConsequenceClass`
escalate to the Authority Board. Consequential sessions (D4) require Goal-Authority escalation.

### 10.4 Assurance dimensions (A1..A8, `INT-GOV-002 §5`)
Governed cognition, determinism/reproducibility, deny-by-default actuation, explainability completeness (0
unexplained decisions), SoD, bounded cognition, read-governance + S4, auditability/tamper-evidence — each with a
named evidence source produced by the modules above.

---

## 11. Integration Points

| # | Peer fabric | Seam (public) | Direction | Contract |
|:-:|-------------|---------------|-----------|----------|
| 1 | **PI-4 Control** | `ControlPlane` PEP + `PolicyEvaluator` | read/evaluate | pre-commit deny-by-default policy evaluation (C5); PEP actuation + audit sink |
| 2 | **PI-5 Federation** | `assertions.ts` (Ed25519), federation verifier | read/verify | signed advisory foreign contributions; trust clamp (C11); no custom crypto |
| 3 | **PI-6 Evolution** | Evolution control (submit→approve→certify→ratify→apply) | propose→commit | **sole** governed-mutation path (D9); `maxInFlight=1`; migration-only reversal |
| 4 | **PI-7 Knowledge** | `knowledge` barrel query/resolve | read-only | S4-aware evidence reads (`knowledge-access.ts`, IGP-8) |
| 5 | **PI-8 Ontology** | `ontology` barrel: `OntologyResolver`, `OntologySnapshot`, `SemanticConstraintEngine` (ONTO-C8) | read/resolve | active-only meaning resolution (C13, IGP-9); snapshot pinning; semantic-constraint verification |
| 6 | **PI-9 Memory** | `memory` barrel: `MemoryRecallEngine`, `MemorySnapshot` | read-only recall | deny-by-default recall (C12, IGP-10); snapshot pinning; durable memory via PI-6 |
| 7 | **PI-2/3 Substrate** | `RegistryPort`, `MetadataPort`, `ConfigurationPort` | read/persist records | metadata-first storage; no core-port field additions |

Integration is strictly downward through public seams; the fabric modifies no lower fabric and holds no
independent write path (INT-ARCH-001 §1 rule of composition).

---

## 12. Test Architecture

### 12.1 Baseline preservation
The existing **269/269** test suite must remain green at every step (additive-only guarantee). CI gate: run full
baseline before and after each module lands.

### 12.2 New test suites (under `test/intelligence/`)
| Suite | Covers |
|-------|--------|
| `constructs.*.test.ts` | C1..C13 record schemas, enumerated allow-lists, invariants |
| `lifecycle.*.test.ts` | goal/model/session/decision/plan state machines; illegal-transition rejection; terminal immutability |
| `grounding.test.ts` | IGP-9 fail-closed: unresolved/expired/revoked `groundedType` exclusion; C13-required session open |
| `memory-recall.test.ts` | IGP-10 read-only recall; S4 monotonic ceiling; expired/revoked exclusion; no local store |
| `determinism-quarantine.test.ts` | INV-6: adapter advisory-only; double-gate (verifier + ONTO-C8); reproducibility-by-record |
| `constraint-solver.test.ts` | hard inviolability; typed constraints over pinned ontology; infeasible-not-proposable |
| `decision-pipeline.test.ts` | full pipeline; `INT-REM-003 §3.2` 7-condition rationale-completeness; commit only via Evolution |
| `sod.test.ts` | proposer ≠ certifier ≠ ratifier; quorum by consequence class |
| `federated-advisory.test.ts` | advisory/deny-only foreign contributions; trust clamp |
| `revocation.test.ts` | forward-only revocation; propagate fail-closed; unknown-state = revoked |
| `audit.test.ts` | hash-chain integrity; append-only; genesis; reconciliation divergence detection |
| `reproducibility.test.ts` | identical `(inputs, snapshots, seed)` → identical decision |
| `adversarial-I1-I12.test.ts` | STRIDE I1–I12 suite; assert 0 residual High/High |

### 12.3 Test principles
Deterministic tests only (seeded); no network; peer fabrics stubbed via their public seams; fail-closed paths are
asserted to **deny**, not merely to error. Independent PI-10 ratification (`PI10-*` deliverables) follows the
construction suite, analogous to PI-5/PI-7/PI-8/PI-9 ratification.

---

## 13. Migration Strategy

### 13.1 Additive-only guarantees
- Zero modification to the five substrate core dirs (`src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts`).
- Exactly **one** additive line in `src/control/index.ts` (the namespaced re-export).
- No changes to peer fabric modules; integration is via their existing public seams only.
- No new substrate ports; no core-port field additions.

### 13.2 Propose-not-act & determinism
No independent write path; all governed mutation routes through Evolution (Evolution-only commit). Non-deterministic
inference quarantined, advisory, verifier-gated. No INV-14..20 enrollment; AD-0014 Ω∞ boundary preserved.

### 13.3 Phased landing (each phase keeps baseline green)
1. Types + namespace + schemas (no behavior).
2. Registries + lifecycle/state-machines (C1..C7, C10, C11, C13, C12).
3. Access clients (ontology/memory/knowledge/policy bindings).
4. Engines (reasoning/inference+adapter/planning/constraint solver) + verifiers.
5. Decision engine + provenance + Evolution commit routing.
6. Audit log + reconciliation.
7. Control assembly + single re-export line.
8. I1–I12 adversarial suite + independent ratification.

### 13.4 Rollback
Because the fabric is additive and holds no independent write path, rollback is removal of the module tree + the
single re-export line; no governed state is orphaned (nothing was committed except via Evolution Units, which
follow migration-only reversal).

---

## 14. Repository Layout

```
packages/platform-runtime/src/control/intelligence/
├── index.ts                         # public barrel (namespaced re-export target)
├── types.ts                         # C1..C13 records + shared value types (§1)
├── intelligence-namespace.ts        # keyspace helpers + prefix constants (§5.4)
├── intelligence-unit.ts             # unitHash/validateUnit/createUnit (proposal/evolution unit builders)
├── intelligence-record.ts           # createRecord + JSON schemas (metadata validation)
├── intelligence-lifecycle.ts        # canTransition/assertTransition/isTerminal (all state machines)
├── intelligence-state-machine.ts    # state-machine driver (reuses PI-4 lifecycle engine)
│
├── reasoning-authority.ts           # C1 registry
├── inference-model-registry.ts      # C2 registry (+ verifier binding gate)
├── goal-registry.ts                 # C3 lifecycle
├── goal-authority.ts                # C4 authorization
├── decision-authority.ts            # C7 certify/ratify eligibility (SoD, quorum, cap)
├── intelligence-revocation.ts       # C10 forward-only revocation (propagate fail-closed)
├── federated-intelligence.ts        # C11 advisory foreign-contribution guard (trust clamp)
│
├── ontology-access.ts               # C13 read/resolve client over PI-8 (active-only, snapshot-pinned, S4)
├── memory-access.ts                 # C12 read-only recall client over PI-9 (snapshot-pinned, S4)
├── knowledge-access.ts              # read-only PI-7 query client (S4-aware)
├── policy-binding.ts                # C5 adapter to PI-4 policy evaluator (pre-commit)
│
├── reasoning-engine.ts              # C9 bounded session orchestration (snapshot triad)
├── inference-engine.ts              # deterministic ontology-relative inference core
├── inference-adapter.ts             # quarantined non-deterministic adapter boundary (AdapterProvenance)
├── semantic-constraint-verifier.ts  # ONTO-C8 validity gate on the quarantine boundary
├── deterministic-verifier.ts        # deterministic guard on the quarantine boundary
├── planning-engine.ts               # deterministic planner (typed constraints)
├── constraint-solver.ts             # C6 hard/soft satisfaction
├── decision-engine.ts               # C8 pipeline gate + DecisionProvenance assembly + Evolution routing
│
├── intelligence-audit-log.ts        # hash-chained signed INT_* audit (INT_GENESIS_HASH)
└── intelligence-control.ts          # assembly; createIntelligence(); sole governed-mutation entry

packages/platform-runtime/test/intelligence/
├── constructs.*.test.ts   lifecycle.*.test.ts   grounding.test.ts   memory-recall.test.ts
├── determinism-quarantine.test.ts   constraint-solver.test.ts   decision-pipeline.test.ts
├── sod.test.ts   federated-advisory.test.ts   revocation.test.ts   audit.test.ts
├── reproducibility.test.ts   adversarial-I1-I12.test.ts

packages/platform-runtime/src/control/index.ts   # +1 line: export * as intelligence …
```

---

## 15. Build Backlog

Ordered, dependency-aware work items. All gated by **AD-0024**. Each item lands green against the 269 baseline.

| # | Epic / Task | Modules | Depends on | Exit criteria |
|:-:|-------------|---------|:----------:|---------------|
| **B0** | AD-0024 preflight: confirm scoped release, named Executor/IA, SoD, clean baseline | — | AD-0024 | 269/269 green; scope = `intelligence/*`; SoD attested |
| **B1** | Domain types + value types | `types.ts` | B0 | interfaces compile; no behavior; baseline green |
| **B2** | Keyspace + record schemas + validation | `intelligence-namespace.ts`, `intelligence-record.ts` | B1 | schemas registered; round-trip validation tests pass |
| **B3** | Unit builders + lifecycle/state machines | `intelligence-unit.ts`, `intelligence-lifecycle.ts`, `intelligence-state-machine.ts` | B2 | `lifecycle.*` tests green; illegal transitions rejected |
| **B4** | Authority & goal registries (C1,C3,C4,C7,C10,C11) | `reasoning-authority.ts`, `goal-registry.ts`, `goal-authority.ts`, `decision-authority.ts`, `intelligence-revocation.ts`, `federated-intelligence.ts` | B3 | `constructs.*`, `sod`, `revocation`, `federated-advisory` tests green |
| **B5** | Model registry + verifier binding (C2) | `inference-model-registry.ts` | B3 | non-deterministic activation blocked without verifier |
| **B6** | Grounding + memory-view + access clients (C13,C12,C5, knowledge) | `ontology-access.ts`, `memory-access.ts`, `knowledge-access.ts`, `policy-binding.ts` | B4,B5 | `grounding`, `memory-recall` tests green; fail-closed asserted |
| **B7** | Constraint solver (C6) | `constraint-solver.ts` | B6 | `constraint-solver` tests green; hard inviolability + typed |
| **B8** | Inference core + adapter + verifiers (quarantine) | `inference-engine.ts`, `inference-adapter.ts`, `semantic-constraint-verifier.ts`, `deterministic-verifier.ts` | B6 | `determinism-quarantine` tests green; double-gate enforced |
| **B9** | Planning engine | `planning-engine.ts` | B7,B8 | feasible/infeasible; infeasible-not-proposable |
| **B10** | Reasoning engine (C9, snapshot triad) | `reasoning-engine.ts` | B6,B7,B8,B9 | bounded sessions; budgets fail-closed; `reproducibility` tests green |
| **B11** | Decision engine + provenance + Evolution routing (C8,D9) | `decision-engine.ts` | B10 | `decision-pipeline` tests green; 7-condition completeness; commit only via Evolution |
| **B12** | Audit log + reconciliation | `intelligence-audit-log.ts` | B11 | `audit` tests green; hash-chain + append-only |
| **B13** | Control assembly + factory + re-export | `intelligence-control.ts`, `index.ts`, `src/control/index.ts` (+1 line) | B12 | `createIntelligence` wires all; public surface exported; baseline green |
| **B14** | I1–I12 adversarial suite | `adversarial-I1-I12.test.ts` | B13 | 0 residual High/High |
| **B15** | Independent PI-10 validation/ratification (`PI10-*`) | — | B14 | independent ratification analogous to PI-5/7/8/9 |

**Definition of done (package):** all B0..B15 complete; 269 baseline + new suites green; I1–I12 at 0 residual
High/High; INV-1..13 and AD-0014 preserved; INV-14..20 unenrolled; single re-export line is the only edit outside
`intelligence/*`; independent PI-10 ratification passed.

---

## Traceability
- **Refines / consumes:** `INTEL-001`, `INT-ARCH-001` v1.1.0, `INT-GOV-001` v1.1.0, `INT-GOV-002`, `INT-REM-001/002/003`, `AD-0024`, `AD-0016..0023`, `AD-0014`, `REG-ABS-001`, `PROJECT-STATE` (PHASE R10), AUTH-003 (IP-04/06/14), AUTH-008/009/012, Constitution Art. IX/XII.
- **Refined by:** the PI-10 construction activity (executed only under AD-0024) and subsequent independent PI-10 ratification (`PI10-*`).
- **Owner:** UCOS Authority Board.

**END IP-011 — PI-10 INTELLIGENCE FABRIC IMPLEMENTATION SPECIFICATION · IMPLEMENTATION-READY · NO IMPLEMENTATION PERFORMED · CONSTRUCTION GATED ON AD-0024 · ARTICLE IX ACTIVE · AD-0014 PRESERVED.**
