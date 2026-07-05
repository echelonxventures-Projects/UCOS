# PCAMG-RUNTIME-0012
# WAVE-2 CONSTRUCTION PACKAGE

Status: DRAFT

## A. Wave 2 Executive Summary

Wave 2 constructs the reasoning layer of the Constitutional Governance Runtime (CGR) — the engines that read over the eleven propose-only registries built in Wave 1 and turn stored governance records into resolved authority chains, validated principle verdicts, compiled governance candidates, and verified traceability graphs.

Wave 1 delivered inert state (schema, append-only guard, canonical hashing, registries, hash-chained audit); Wave 2 delivers the deterministic, fail-closed computation over that state.

Every engine binds to the Wave 1 substrate and the existing platform fabrics by import-and-compose through ports; no registry, hash, or audit primitive is reimplemented, and no activation authority is introduced.

Governance remains propose-only: the compiler emits candidate generation records to CGR-REG-GOV, never an ACTIVE status.

### Component Set

#### Authority Runtime (CGR-AR-*)

- CGR-AR-RESOLVE
- CGR-AR-VALIDATE
- CGR-AR-SUPREMACY

#### Governance Compiler Runtime (CGR-GC-*)

- CGR-GC-RULES
- CGR-GC-ERRORS
- CGR-GC-DETERMINISM
- CGR-GC-FAILCLOSED
- CGR-GC-GENERATE

#### Traceability Runtime (CGR-TR-*)

- CGR-TR-GRAPH
- CGR-TR-VERIFY
- CGR-TR-IMPACT

### Governance Behaviours Delivered

1. Deterministic authority resolution.
2. Non-waivable principle validation.
3. Canonical reproducible compilation.
4. Fail-closed conflict resolution.
5. Complete acyclic traceability.
6. Activation remains impossible.

### Reuse Posture

- Reuse Wave 1 canonical hashing.
- Reuse Wave 1 authority chain.
- Reuse meta-core composition.
- Reuse ontology graph traversal.
- Reuse evolution and simulation impact analyzers.
- Reuse existing error infrastructure.
- No new crypto.
- No new persistence layer.
- No new registry substrate.

### Exit Condition

- All Wave 2 components typecheck.
- All Wave 2 test suites pass.
- Non-regression baseline preserved.
- Determinism proven.
- Validation remains fail-closed.
- Traceability violations detected.
- Compiler emits candidate-only records.
- No ACTIVE state is conferrable.

---
End of Section A.


## B. Repository Construction Layout

Wave 2 is purely additive over the repository reality established by PCAMG-RUNTIME-0009, PCAMG-RUNTIME-0010, and PCAMG-RUNTIME-0011. Those packages placed the Constitutional Governance Runtime (CGR) under the single existing package `packages/platform-runtime`, in the CGR root `packages/platform-runtime/src/control/governance-runtime/`, and delivered the eleven propose-only registries, the append-only guard, canonical hashing, and the hash-chained audit as inert state. Wave 2 adds the reasoning engines above that state and adds nothing outside the two trees below.

- No new package is created; Wave 2 lives inside `packages/platform-runtime`.
- No file under `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, or `src/contracts` is created or modified.
- No Wave 1 CGR file is modified; Wave 1 files are consumed by import-and-compose only.
- Test suites follow the established convention: `packages/platform-runtime/test/*.test.ts` executed by `node --test`, with non-test shared harnesses named `*-harness.ts`.

### B.1 Wave 2 directory structure

```
packages/platform-runtime/
├── src/
│   └── control/
│       └── governance-runtime/                         [Wave 1 — CGR root, existing]
│           ├── registries/                             [Wave 1 — existing, reuse]
│           ├── hashing/                                [Wave 1 — existing, reuse]
│           ├── audit/                                  [Wave 1 — existing, reuse]
│           ├── guard/                                  [Wave 1 — existing, reuse]
│           ├── ports.ts                                [Wave 1 — existing, extended by re-export only in B.4]
│           ├── errors.ts                               [Wave 1 — existing, reuse]
│           ├── authority/                              [Wave 2 — NEW]
│           ├── compiler/                               [Wave 2 — NEW]
│           ├── traceability/                           [Wave 2 — NEW]
│           └── reasoning/                              [Wave 2 — NEW]
└── test/                                               [existing test root]
    └── (Wave 2 suites + harness listed in B.5)         [Wave 2 — NEW files only]
```

New Wave 2 directories (exhaustive):

| # | Directory | Purpose |
|---|-----------|---------|
| 1 | `src/control/governance-runtime/authority/` | Authority Runtime engines (CGR-AR-*) |
| 2 | `src/control/governance-runtime/compiler/` | Governance Compiler Runtime engines (CGR-GC-*) |
| 3 | `src/control/governance-runtime/traceability/` | Traceability Runtime engines (CGR-TR-*) |
| 4 | `src/control/governance-runtime/reasoning/` | Shared read-model projections and engine composition wiring over Wave 1 state |

No directory is created outside `src/control/governance-runtime/` and `test/`.

### B.2 Wave 2 source files

#### Authority Runtime — `src/control/governance-runtime/authority/`

| File | Component | Responsibility |
|------|-----------|----------------|
| `resolve.ts` | CGR-AR-RESOLVE | Deterministic authority-chain resolution over stored authority records |
| `validate.ts` | CGR-AR-VALIDATE | Non-waivable principle validation (fail-closed verdicts) |
| `supremacy.ts` | CGR-AR-SUPREMACY | Supremacy ordering and conflict arbitration across resolved chains |
| `index.ts` | — | Barrel export of the Authority Runtime surface (no logic) |

#### Governance Compiler Runtime — `src/control/governance-runtime/compiler/`

| File | Component | Responsibility |
|------|-----------|----------------|
| `rules.ts` | CGR-GC-RULES | Compiler rule set evaluation (CR-* realization) |
| `errors.ts` | CGR-GC-ERRORS | Compiler error model (CE-* realization) over reused error infrastructure |
| `determinism.ts` | CGR-GC-DETERMINISM | Canonical, reproducible compilation ordering and hashing |
| `fail-closed.ts` | CGR-GC-FAILCLOSED | Fail-closed conflict resolution and deny-by-default emission gate |
| `generate.ts` | CGR-GC-GENERATE | Candidate governance generation — emits candidate-only records to CGR-REG-GOV |
| `index.ts` | — | Barrel export of the Compiler Runtime surface (no logic) |

#### Traceability Runtime — `src/control/governance-runtime/traceability/`

| File | Component | Responsibility |
|------|-----------|----------------|
| `graph.ts` | CGR-TR-GRAPH | Derivation-edge graph projection over registry records |
| `verify.ts` | CGR-TR-VERIFY | Acyclicity and mandatory up-trace verification (fail-closed) |
| `impact.ts` | CGR-TR-IMPACT | Forward/backward impact traversal over the trace graph |
| `index.ts` | — | Barrel export of the Traceability Runtime surface (no logic) |

#### Reasoning shared layer — `src/control/governance-runtime/reasoning/`

| File | Responsibility |
|------|----------------|
| `read-model.ts` | Read-only projection adapters over the eleven Wave 1 registries (no writes) |
| `compose.ts` | Engine composition/wiring binding the three runtimes to Wave 1 ports and platform fabrics |
| `index.ts` | Barrel export of the reasoning surface (no logic) |

No source file outside these four directories is added by Wave 2.

### B.3 New interfaces

All interfaces are declared inside the Wave 2 files above (no new `types.ts` in a prohibited or Wave 1 location is created). They are consumed through the barrel exports.

Authority Runtime interfaces (`authority/`):

| Interface | Declared in | Contract |
|-----------|-------------|----------|
| `AuthorityResolver` | `resolve.ts` | Resolve stored authority records into a deterministic resolved chain |
| `ResolvedAuthorityChain` | `resolve.ts` | Read-only value shape of a fully resolved, ordered chain |
| `PrincipleValidator` | `validate.ts` | Produce a non-waivable pass/deny verdict for a governance record |
| `PrincipleVerdict` | `validate.ts` | Fail-closed verdict value shape with denial cause |
| `SupremacyArbiter` | `supremacy.ts` | Order competing chains and select the supreme authority under conflict |

Governance Compiler Runtime interfaces (`compiler/`):

| Interface | Declared in | Contract |
|-----------|-------------|----------|
| `CompilerRuleSet` | `rules.ts` | Evaluate compiler rules against inputs |
| `CompilerErrorModel` | `errors.ts` | Structured compiler error taxonomy over reused error infrastructure |
| `DeterminismHarness` | `determinism.ts` | Canonicalize inputs and prove reproducible compilation output |
| `FailClosedGate` | `fail-closed.ts` | Deny-by-default emission decision under unresolved conflict |
| `CandidateGenerator` | `generate.ts` | Emit candidate-only governance generation records |
| `GovernanceCandidate` | `generate.ts` | Read-only candidate record shape (never carries ACTIVE status) |

Traceability Runtime interfaces (`traceability/`):

| Interface | Declared in | Contract |
|-----------|-------------|----------|
| `TraceGraphBuilder` | `graph.ts` | Build the derivation-edge graph projection |
| `TraceGraph` | `graph.ts` | Read-only projected graph value shape |
| `TraceVerifier` | `verify.ts` | Verify acyclicity and mandatory up-trace, fail-closed |
| `ImpactAnalyzer` | `impact.ts` | Compute forward/backward impact sets over the graph |

Reasoning shared interfaces (`reasoning/`):

| Interface | Declared in | Contract |
|-----------|-------------|----------|
| `RegistryReadModel` | `read-model.ts` | Read-only projection surface over the eleven Wave 1 registries |
| `ReasoningComposition` | `compose.ts` | Composed handle binding the three runtimes to Wave 1 ports and fabrics |

### B.4 New test suites

New files under `packages/platform-runtime/test/` (executed by `node --test`, matching `test/*.test.ts`):

| Test suite | Covers |
|------------|--------|
| `cgr-authority-resolve.test.ts` | CGR-AR-RESOLVE deterministic resolution |
| `cgr-authority-validate.test.ts` | CGR-AR-VALIDATE non-waivable, fail-closed validation |
| `cgr-authority-supremacy.test.ts` | CGR-AR-SUPREMACY conflict arbitration |
| `cgr-compiler-rules.test.ts` | CGR-GC-RULES rule evaluation |
| `cgr-compiler-errors.test.ts` | CGR-GC-ERRORS error taxonomy |
| `cgr-compiler-determinism.test.ts` | CGR-GC-DETERMINISM reproducibility proof |
| `cgr-compiler-failclosed.test.ts` | CGR-GC-FAILCLOSED deny-by-default emission gate |
| `cgr-compiler-generate.test.ts` | CGR-GC-GENERATE candidate-only emission to CGR-REG-GOV |
| `cgr-traceability-graph.test.ts` | CGR-TR-GRAPH projection correctness |
| `cgr-traceability-verify.test.ts` | CGR-TR-VERIFY acyclicity + mandatory up-trace |
| `cgr-traceability-impact.test.ts` | CGR-TR-IMPACT forward/backward traversal |
| `cgr-activation-impossible.test.ts` | Invariant: no path confers ACTIVE status (activation remains impossible) |
| `cgr-wave2-nonregression.test.ts` | Wave 1 baseline preserved; no Wave 1 CGR or prohibited-core change |

New non-test shared harness (matches the established `*-harness.ts` convention, not collected by the runner):

| Harness file | Purpose |
|--------------|---------|
| `test/governance-runtime-harness.ts` | Builds a composed substrate + wired CGR (Wave 1 registries/hashing/audit/guard + Wave 2 engines) and helpers to seed records and drive resolve → validate → compile → trace |

### B.5 Reuse bindings into existing substrate

All bindings are import-and-compose (read or already-authorized write); no primitive is reimplemented and no new persistence, crypto, or registry substrate is introduced.

| Bound-from (Wave 2) | Bound-to (existing) | Binding kind |
|---------------------|---------------------|--------------|
| `reasoning/read-model.ts` | Wave 1 registries `src/control/governance-runtime/registries/` (all eleven) | Read-only projection |
| `compiler/determinism.ts` | Wave 1 canonical hashing `src/control/governance-runtime/hashing/` | Import — canonical hash |
| `authority/resolve.ts` | Wave 1 authority chain (registries + hashing) | Import — chain resolution inputs |
| `compiler/generate.ts` | Wave 1 CGR-REG-GOV registry + append-only guard `src/control/governance-runtime/guard/` | Authorized candidate-only append |
| `compiler/generate.ts`, `traceability/verify.ts` | Wave 1 hash-chained audit `src/control/governance-runtime/audit/` | Import — audit append |
| `compiler/errors.ts` | Existing error infrastructure `src/control/errors.ts` | Import — error base |
| `reasoning/compose.ts` | Meta-core composition `src/meta-core/**` | Import — kernel composition (no modification) |
| `traceability/graph.ts`, `traceability/impact.ts` | Ontology graph traversal `src/control/ontology/**` | Import — graph traversal |
| `traceability/impact.ts` | Evolution impact analyzer `src/control/evolution/**` | Import — impact analysis |
| `traceability/impact.ts` | Simulation impact analyzer `src/control/simulation/**` | Import — impact analysis |
| `reasoning/compose.ts` | Control types/ports `src/control/types.ts` | Import — port shapes (no modification) |

No reuse binding writes to any prohibited core directory, and the only write binding (`compiler/generate.ts` → CGR-REG-GOV) emits candidate-only records through the existing append-only guard.

---
End of Section B.
