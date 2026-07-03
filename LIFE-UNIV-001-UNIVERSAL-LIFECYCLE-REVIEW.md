# LIFE-UNIV-001 — Universal Lifecycle Review

**Phase:** R4 — Universal Lifecycle Review
**Artifact ID:** `LIFE-UNIV-001`
**Program:** UCOM (`UCOM-REMEDIATION-001`) — closes **RL-006** / `ARCH-GAP-001` **M2** (duplicated Evolution/lifecycle & state machines)
**Mode:** **REVIEW / DESIGN-DETERMINATION ONLY — NO IMPLEMENTATION.** No source, no runtime change, no lock release, no frozen-construct mutation. Additive-only discipline (UA-04 FA-C1) governs any downstream construction.
**Method:** Direct inspection of every lifecycle/state-machine implementation in `packages/platform-runtime/src/**`; build/test baseline reproduced earlier this program (`tsc` clean; 269/269).
**Date:** 2026-07-02

---

## 1. Objective

Review all lifecycle implementations and determine whether **one universal lifecycle engine can replace the duplicated per-fabric state machines**.

---

## 2. Inventory of Lifecycle Implementations

| # | Implementation | Location | Engine class | Transition table | Key | Error type |
|---|----------------|----------|--------------|------------------|-----|-----------|
| 1 | Substrate capability lifecycle | `meta-core/lifecycle-engine.ts` | `LifecycleEngine` | inline `ALLOWED_TRANSITIONS` | `id@version` | `LifecycleViolationError` |
| 2 | Evolution unit lifecycle | `control/evolution/{evolution-state-machine,evolution-lifecycle}.ts` | `EvolutionStateMachine` | `evolution-lifecycle.ALLOWED` | `unitHash` | `ControlValidationError` |
| 3 | Knowledge unit lifecycle | `control/knowledge/{knowledge-state-machine,knowledge-lifecycle}.ts` | `KnowledgeStateMachine` | `knowledge-lifecycle.ALLOWED` | `unitHash` | `ControlValidationError` |
| 4 | Memory unit lifecycle | `control/memory/{memory-state-machine,memory-lifecycle}.ts` | `MemoryStateMachine` | `memory-lifecycle.ALLOWED` | `unitHash` | `ControlValidationError` |
| 5 | Ontology unit lifecycle | `control/ontology/{ontology-state-machine,ontology-lifecycle}.ts` | `OntologyStateMachine` | `ontology-lifecycle.ALLOWED` | `unitHash` | `ControlValidationError` |

**5 engine classes + 5 transition tables** implementing one mechanism.

---

## 3. Structural Comparison

### 3.1 The engine mechanism is identical
Every state machine (items 1–5) is the same construction:

```
#entries: Map<key, { state, history: {state, at}[] }>
start(key, initial?)      // deny-by-default: re-init throws
transition(key, to)       // assertTransition(from,to) → mutate → push history
state(key) / history(key) // read accessors
```

and every transition table is the same construction:

```
ALLOWED: Record<State, readonly State[]>
canTransition(from,to) = ALLOWED[from].includes(to)
assertTransition(from,to) = throw unless canTransition
isTerminal(state) = ALLOWED[state].length === 0
```

The four control-fabric `*StateMachine` classes (items 2–5) are **near byte-identical** — they differ only in (a) the compile-time state type, (b) the imported `assertTransition`, and (c) the default initial state. The meta-core engine (item 1) is the same pattern with a different key scheme and error type and an inline table.

### 3.2 `assertTransition` is a pure table lookup (critical finding)
In **all** fabrics, `assertTransition` performs **only** an allowed-edge check and throws. There is **no** fabric-specific guard, side-effect, signature check, or semantic validation inside the lifecycle/state-machine modules. All governance-critical guards (signature verification, certification-before-ratification, ontology SI-checks, memory retention/forgetting, audit emission) are **already externalized to the calling control modules**. Unification therefore requires **no** extraction of hidden logic — the fabric-specific surface is already just *data* (the table) plus *caller-side guards*.

### 3.3 Transition tables — duplication and shared spine

| States | Table |
|--------|-------|
| **Knowledge** | draft→{validated,revoked}; validated→{certified,draft,revoked}; certified→{ratified,revoked}; ratified→{active,revoked}; active→{superseded,revoked,archived}; superseded→{archived}; revoked→{archived}; archived→∅ |
| **Ontology** | **IDENTICAL to Knowledge** (same edges, same `// draft = rework` comment) |
| **Evolution** | proposed→{reviewed,failed}; reviewed→{approved,failed}; approved→{certified,failed}; certified→{ratified,failed}; ratified→{applied,failed}; applied→{active,rolled-back,failed}; active→{rolled-back}; terminals: rolled-back, failed |
| **Memory** | ephemeral: captured→{active,consolidated,expired,forgotten}; governed: proposed→certified→ratified→active; active→{consolidated,superseded,expired,forgotten}; terminals: forgotten, expired |
| **Substrate** | registered→validated→resolved→composed→active→retired; +failed from each; terminals: retired, failed |

**Observations:**
- **Knowledge and Ontology are the same lifecycle expressed twice** (100% duplicate table + code).
- All governed lifecycles share a **common `certified → ratified → active` governance spine** plus terminal/revocation edges.
- The differences between tables are **pure data** (which states, which edges), never behavioral.

---

## 4. Duplication Metrics

| Metric | Now | After unification |
|--------|-----|-------------------|
| Engine/state-machine classes | 5 | **1** universal engine |
| Distinct transition-table *modules* | 5 | **N data definitions** (Knowledge≡Ontology ⇒ ~4 distinct shapes) |
| Lines of duplicated engine logic | ~4× the control state-machine body (~180 LOC) + meta-core | ~0 (single implementation) |
| Behavioral variation across engines | **none** | none (parameterized by data) |

The duplication is **pure copy-paste of a generic algorithm**, with the variability already isolated as data. This is the strongest possible case for consolidation.

---

## 5. Determination

> **YES — one universal, data-driven lifecycle engine can replace the duplicated per-fabric state machines.**

The four control-fabric state machines (Evolution, Knowledge, Memory, Ontology) collapse to **one** engine parameterized by a **lifecycle definition** (state set + transition table + initial state), because their only differences are data and their guards are already caller-side. The meta-core engine is the same pattern and is *declared conformant* to it, but is treated specially (see §7 constraint L-C1).

### 5.1 Proposed universal design (design-only; no code emitted)

A single engine driven by a **registered lifecycle definition** — which makes a lifecycle a first-class **Registry/Metadata object**, aligning with the universal-representation model (`ARCH-GAP-001` C-class remediation) instead of hard-coded per-fabric tables (`INV-CORE-14` configuration/metadata integrity):

```
// stored as a metadata record under `lifecycle:def:<defId>` (data, not code)
LifecycleDefinition {
  id: string
  states: string[]
  initial: string
  transitions: Record<string, string[]>   // the ALLOWED table, as data
}

UniversalLifecycleEngine {
  defineLifecycle(def)                     // validates: every edge target ∈ states; deterministic
  start(defId, instanceKey, initial?)      // deny-by-default; re-init denied
  transition(instanceKey, to, guard?)      // table check + optional caller guard hook + history + audit hook
  state(instanceKey) / history(instanceKey)
  isTerminal(instanceKey)                  // derived: transitions[state].length === 0
}
```

- **Keying** is a parameter (`unitHash` for control fabrics; `id@version` for the substrate) — subsumes both schemes.
- **Guards** remain caller-supplied hooks (preserving today's externalized governance checks) and/or become declarative pre-conditions on edges.
- **Audit** emission becomes a single injected hook — the natural integration point for the WS-1 unified Audit primitive (`RL-003`).
- Each fabric supplies its table as **data** (`evolution`, `knowledge`≡`ontology`, `memory`), eliminating 4 code modules.

### 5.2 What must be parameterized (the only real variation)
State set · transition table · initial state · key scheme · (optionally) error label. All are data or a single injected function.

---

## 6. Invariants the Universal Engine Must Preserve (fail-closed)

| Must preserve | Source |
|---------------|--------|
| Deny-by-default: unknown instance/edge cannot transition | all fabrics; `INV-CORE-11` |
| Terminal states remain terminal (recovery only via new unit/proposal) | evolution/knowledge/memory/ontology |
| Guarded transition throws (governance error), never silently no-ops | all `assertTransition` |
| Append-only history retained per instance | all engines; `INV-10` |
| Caller-side governance guards (signature/cert-order/SI-checks/retention) still enforced | control modules (unchanged) |
| Migration-only, additive semantics; no lifecycle weakening | `INV-CORE-05`, IP-14 |

Consolidation must be a **behavior-preserving refactor**: identical accepted/rejected transition sets, identical throw semantics, identical history.

---

## 7. Constraints & Scope Boundaries

- **L-C1 — Substrate core-dir prohibition.** `meta-core/lifecycle-engine.ts` lives inside a prohibited-to-modify core dir (`AD-0016`; UA-04 **FA-C1**). It is therefore **declared conformant** to the universal pattern and **left physically in place**; it may be physically merged only under a *separate substrate-scoped* authorization. Unifying the **four control-fabric** state machines requires **zero substrate-core-dir change** and is the actionable target of RL-006.
- **L-C2 — Governance-before-construction.** This review is design-only. Constructing the universal engine + migrating the four fabrics is a WS-1 item requiring its own scoped Article-IX release (`AD-00xx`) under `UCOM-REMEDIATION-001` §6, gated on **P-0** (ledger restoration).
- **L-C3 — Behavior-preservation proof.** Migration must keep the 269-baseline green and add equivalence tests proving each fabric's accepted/denied transition set is unchanged before the old `*StateMachine` classes are removed.
- **L-C4 — Error-type reconciliation.** Control fabrics use `ControlValidationError`; the substrate uses `LifecycleViolationError`. The unified engine standardizes on one lifecycle-violation error (or maps per-context) without changing throw semantics.

---

## 8. Recommended Migration Path (design; unauthorized until WS-1/P-0)

1. Introduce `UniversalLifecycleEngine` + `LifecycleDefinition` in a shared `src/control/*` location (additive; 0 core-dir change).
2. Express the fabric tables as **data definitions**; collapse Knowledge≡Ontology to one shared definition.
3. Re-point Evolution/Knowledge/Memory/Ontology control modules at the universal engine behind their existing method surface (`start`/`transition`/`state`/`history`).
4. Add equivalence tests (L-C3); keep baseline green.
5. Remove the four `*StateMachine` classes and four `*-lifecycle.ts` table modules once equivalence is proven.
6. Wire the single audit hook to the unified Audit primitive (RL-003) when available.
7. Record closure and re-run `ARCH-GAP-001` (M2) to PASS.

---

## 9. Determination Summary

> **LIFE-UNIV-001 — CONSOLIDATION CONFIRMED.**
>
> The five lifecycle implementations share **one identical, behavior-free engine mechanism**; all fabric variation is **pure data** (state set + transition table + initial state), and all governance guards are **already caller-side**. Knowledge and Ontology are the *same* lifecycle duplicated verbatim. **One universal, definition-driven lifecycle engine can replace the four duplicated control-fabric state machines** with zero substrate-core-dir change, reducing 5 engine classes + 5 table modules to **1 engine + N data definitions**. The substrate capability lifecycle is declared conformant and left in place (core-dir prohibition). This closes the *design* of **RL-006** / `ARCH-GAP-001` **M2**; construction is a WS-1 scoped item gated on **P-0**.

## 10. Governance / Non-Mutation Statement
No source code, infrastructure, or authorization produced; no lock released; no invariant enrolled; no frozen construct modified. `INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged. Design-only artifact.

## 11. Traceability
- **Reviews:** `meta-core/lifecycle-engine.ts`; `control/{evolution,knowledge,memory,ontology}/*-state-machine.ts` + `*-lifecycle.ts`.
- **Closes (design):** `UCOM-REMEDIATION-001` **RL-006**; `ARCH-GAP-001` **M2**; supports `RL-003` (unified audit hook).
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001`, `UCOS-ASR-NFR-001` (INV-1..13), Governance Baseline 1.0.0; `UCOM-REMEDIATION-001` (WS-1, P-0).
- **Refined by:** WS-1 scoped construction release (`AD-00xx`) + behavior-equivalence validation.
- **Owner:** UCOS Authority Board (disposition); Fabric Owners (migration).

**END `LIFE-UNIV-001` — PHASE R4 · UNIVERSAL LIFECYCLE REVIEW · DETERMINATION: ONE UNIVERSAL ENGINE CAN REPLACE THE 4 DUPLICATED CONTROL STATE MACHINES (5→1 + N DATA DEFINITIONS; KNOWLEDGE≡ONTOLOGY) · SUBSTRATE ENGINE CONFORMANT, LEFT IN PLACE · DESIGN ONLY · NO IMPLEMENTATION · NO LOCK RELEASE.**
