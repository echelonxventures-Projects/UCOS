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


## C. Component Construction Specifications

Eleven components are constructed in Wave 2. Each specification is normative for construction only; it authorizes no enrollment and confers no ACTIVE status. All components are read-over-Wave-1 engines except CGR-GC-GENERATE, whose only write is a candidate-only append through the existing append-only guard.

### C.1 CGR-AR-RESOLVE (Authority Resolution)

- **Purpose.** Turn stored authority records into a single deterministic, fully ordered resolved authority chain for a given subject.
- **Responsibilities.** Read authority records via the registry read-model; assemble the derivation of authority from root to subject; order the chain by canonical rule; expose the resolved chain as an immutable value.
- **Inputs.** Subject identifier; read-only authority records projected from the Wave 1 registries; canonical hashing for ordering ties.
- **Outputs.** One `ResolvedAuthorityChain` value, or a fail-closed denial when the chain cannot be closed.
- **Dependencies.** `reasoning/read-model.ts`; Wave 1 registries; Wave 1 canonical hashing. No write dependency.
- **Invariants.** Same inputs yield byte-identical chains; resolution performs no mutation; an incomplete or ambiguous chain never resolves to a partial result.
- **Failure Modes.** Missing root authority; broken derivation edge; ambiguous ordering; unknown subject. Every failure returns a denial with a stable cause code; none is swallowed or defaulted.
- **Acceptance Criteria.** Deterministic across repeated runs; denial on any incomplete chain; zero writes; output consumed unchanged by CGR-AR-VALIDATE and CGR-AR-SUPREMACY.

### C.2 CGR-AR-VALIDATE (Principle Validation)

- **Purpose.** Produce a non-waivable pass/deny verdict for a governance record against the fifteen principles.
- **Responsibilities.** Evaluate a record against each applicable principle rule; aggregate per-principle results into a single verdict; attach denial cause for any failing principle.
- **Inputs.** A governance record; the resolved authority chain from CGR-AR-RESOLVE; principle rule inputs projected read-only from the registries.
- **Outputs.** One `PrincipleVerdict` (pass or deny with cause). No waiver path exists.
- **Dependencies.** CGR-AR-RESOLVE; `reasoning/read-model.ts`. No write dependency.
- **Invariants.** No principle is skippable, overridable, or waivable; absence of evidence is treated as denial (deny-by-default); verdicts are deterministic.
- **Failure Modes.** Unresolvable authority chain; missing principle input; conflicting principle results. All map to deny, never to pass.
- **Acceptance Criteria.** Every principle exercised; no waiver reachable; deny-by-default proven for missing input; identical verdicts across repeated runs.

### C.3 CGR-AR-SUPREMACY (Supremacy Arbitration)

- **Purpose.** Order competing resolved chains and select the supreme authority under conflict, fail-closed.
- **Responsibilities.** Compare two or more resolved chains; apply canonical supremacy ordering; return the supreme chain or a denial when supremacy is undecidable.
- **Inputs.** Two or more `ResolvedAuthorityChain` values; canonical ordering inputs.
- **Outputs.** The selected supreme chain, or a fail-closed denial when no unambiguous supremacy exists.
- **Dependencies.** CGR-AR-RESOLVE. No write dependency.
- **Invariants.** Ordering is total and deterministic; ties that cannot be broken canonically deny rather than pick arbitrarily; no chain is mutated.
- **Failure Modes.** Undecidable supremacy; incomparable chains; empty input set. All deny.
- **Acceptance Criteria.** Total deterministic ordering; denial on undecidable conflict; no arbitrary selection; stable across runs.

### C.4 CGR-GC-RULES (Compiler Rule Set)

- **Purpose.** Evaluate the compiler rules (CR-* realization) against compilation inputs.
- **Responsibilities.** Apply each compiler rule to the candidate inputs; collect rule outcomes; expose a structured result consumed by determinism and fail-closed gating.
- **Inputs.** Read-only projected registry records; the applicable resolved/validated authority context.
- **Outputs.** A structured rule-evaluation result (per-rule outcomes). No write.
- **Dependencies.** `reasoning/read-model.ts`; CGR-AR-VALIDATE context. No write dependency.
- **Invariants.** Rules are data-driven from registry inputs, never hardcoded; evaluation is deterministic and side-effect free.
- **Failure Modes.** Missing rule input; malformed record; rule contradiction. Surfaced as structured errors via CGR-GC-ERRORS; never silently passed.
- **Acceptance Criteria.** No hardcoded rule values; deterministic outcomes; every rule contradiction produces a structured error.

### C.5 CGR-GC-ERRORS (Compiler Error Model)

- **Purpose.** Provide the structured compiler error taxonomy (CE-* realization) over the reused error infrastructure.
- **Responsibilities.** Define stable error categories and causes; classify every rule and generation failure; carry sufficient cause for fail-closed decisions and audit.
- **Inputs.** Failure signals from CGR-GC-RULES, CGR-GC-DETERMINISM, CGR-GC-FAILCLOSED, CGR-GC-GENERATE.
- **Outputs.** Structured `CompilerErrorModel` instances built on the existing error base.
- **Dependencies.** Existing error infrastructure (`src/control/errors.ts`). No write dependency.
- **Invariants.** No new error transport or persistence is created; every error carries a stable, testable cause code; errors are never downgraded to warnings.
- **Failure Modes.** Unclassified failure. Treated as a fail-closed error, never as success.
- **Acceptance Criteria.** All failures classified; stable cause codes; built strictly on the reused error base.

### C.6 CGR-GC-DETERMINISM (Determinism Harness)

- **Purpose.** Canonicalize compilation inputs and prove reproducible output.
- **Responsibilities.** Impose canonical ordering on inputs; compute canonical hashes via Wave 1 hashing; expose a reproducibility check used by generation and tests.
- **Inputs.** Rule-evaluation results; read-only registry projections; Wave 1 canonical hashing.
- **Outputs.** A canonical, hash-anchored compilation form and a reproducibility assertion.
- **Dependencies.** Wave 1 canonical hashing; CGR-GC-RULES. No write dependency.
- **Invariants.** Identical inputs produce identical canonical form and hash; no wall-clock, random, or environment-derived value enters the canonical form.
- **Failure Modes.** Non-canonicalizable input; hash mismatch on repeat. Both fail-closed.
- **Acceptance Criteria.** Byte-identical output across repeated and cross-process runs; no nondeterministic source admitted; hash reproduced exactly.

### C.7 CGR-GC-FAILCLOSED (Fail-Closed Gate)

- **Purpose.** Make the deny-by-default emission decision under unresolved conflict or error.
- **Responsibilities.** Consume validation verdicts, rule results, and error state; permit emission only when every gate is satisfied; deny otherwise.
- **Inputs.** `PrincipleVerdict`; rule-evaluation result; compiler error state; supremacy outcome where relevant.
- **Outputs.** A binary emission decision (permit/deny) with cause on deny.
- **Dependencies.** CGR-AR-VALIDATE; CGR-AR-SUPREMACY; CGR-GC-RULES; CGR-GC-ERRORS. No write dependency.
- **Invariants.** Default is deny; any unresolved conflict, missing input, or error forces deny; there is no permit path that bypasses validation.
- **Failure Modes.** Ambiguous gate state; partial inputs. Both deny.
- **Acceptance Criteria.** Deny-by-default proven; no permit without full validation; deterministic decisions.

### C.8 CGR-GC-GENERATE (Candidate Generator)

- **Purpose.** Emit candidate-only governance generation records to CGR-REG-GOV.
- **Responsibilities.** On a permit decision, construct a `GovernanceCandidate` from the canonical compilation form; append it through the append-only guard; write the corresponding audit entry.
- **Inputs.** Canonical compilation form; permit decision from CGR-GC-FAILCLOSED; append-only guard; hash-chained audit.
- **Outputs.** One appended candidate record (never ACTIVE); one audit entry.
- **Dependencies.** CGR-GC-FAILCLOSED; Wave 1 CGR-REG-GOV registry; Wave 1 append-only guard; Wave 1 hash-chained audit.
- **Invariants.** Emitted records carry candidate status only and can never carry or imply ACTIVE; every emission is append-only and audited; no update or delete path exists.
- **Failure Modes.** Guard rejection; audit append failure; absent permit. All abort emission fail-closed with no partial write.
- **Acceptance Criteria.** Candidate-only status enforced; activation unreachable; append-only and audited; no emission without a permit.

### C.9 CGR-TR-GRAPH (Trace Graph Projection)

- **Purpose.** Project the derivation-edge graph over registry records.
- **Responsibilities.** Read derivation edges via the read-model; build an immutable graph projection; expose it for verification and impact traversal, reusing ontology graph traversal.
- **Inputs.** Read-only edge and record projections; ontology graph traversal primitives.
- **Outputs.** One immutable `TraceGraph` projection.
- **Dependencies.** `reasoning/read-model.ts`; ontology graph traversal (`src/control/ontology/**`). No write dependency.
- **Invariants.** Projection is read-only and deterministic; no edge is synthesized beyond stored records.
- **Failure Modes.** Missing referenced node; malformed edge. Surfaced fail-closed to CGR-TR-VERIFY.
- **Acceptance Criteria.** Deterministic projection; no fabricated edges; reuses ontology traversal without reimplementation.

### C.10 CGR-TR-VERIFY (Trace Verification)

- **Purpose.** Verify acyclicity and mandatory up-trace over the trace graph, fail-closed.
- **Responsibilities.** Detect cycles; confirm every record has a mandatory up-trace to authority; write an audit entry for verification outcomes.
- **Inputs.** `TraceGraph`; Wave 1 hash-chained audit.
- **Outputs.** A verification result (pass or fail with the violating nodes/edges).
- **Dependencies.** CGR-TR-GRAPH; Wave 1 hash-chained audit.
- **Invariants.** Any cycle or missing up-trace fails verification; incomplete graphs fail rather than pass; audit is append-only.
- **Failure Modes.** Cycle detected; missing up-trace; unreachable authority root. All fail-closed.
- **Acceptance Criteria.** Cycles detected reliably; missing up-trace detected; deterministic verdicts; verification audited.

### C.11 CGR-TR-IMPACT (Impact Analysis)

- **Purpose.** Compute forward and backward impact sets over the verified trace graph.
- **Responsibilities.** Traverse the graph to derive downstream and upstream impact for a subject, reusing evolution and simulation impact analyzers.
- **Inputs.** `TraceGraph`; subject identifier; evolution and simulation impact analyzers.
- **Outputs.** Forward and backward impact sets as read-only values.
- **Dependencies.** CGR-TR-GRAPH; evolution analyzer (`src/control/evolution/**`); simulation analyzer (`src/control/simulation/**`). No write dependency.
- **Invariants.** Traversal is read-only and deterministic; impact reflects only stored edges; analyzers are reused, not reimplemented.
- **Failure Modes.** Unknown subject; graph failed verification. Deny/empty fail-closed rather than partial impact.
- **Acceptance Criteria.** Deterministic impact sets; reuse of existing analyzers proven; no impact reported over an unverified graph.

---
End of Section C.


## D. Authority Runtime Specification

Scope: CGR-AR-RESOLVE, CGR-AR-VALIDATE, CGR-AR-SUPREMACY (`src/control/governance-runtime/authority/`).

- **Construction boundaries.** Confined to the `authority/` directory plus its barrel export. Reads Wave 1 registry state exclusively through `reasoning/read-model.ts`. Performs no writes, no persistence, and introduces no registry substrate or crypto. Realizes the authority-resolution and validation behaviour of PCAMG-RUNTIME-0001 at the reasoning layer without amending any doctrine.
- **Authorized dependencies.** `reasoning/read-model.ts`; Wave 1 registries (read-only); Wave 1 canonical hashing (ordering/tie-break); the fifteen principle inputs projected from registries. Intra-runtime: VALIDATE and SUPREMACY depend on RESOLVE.
- **Prohibited dependencies.** Any write path; the append-only guard; the audit writer; CGR-REG-GOV writes; `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts` sources; the compiler and traceability runtimes (no upward dependency onto them).
- **Determinism guarantees.** Resolution, validation, and supremacy are pure functions of their read-only inputs; ordering ties break canonically via Wave 1 hashing; no wall-clock, randomness, or environment input participates; repeated and cross-process runs yield identical results.
- **Fail-closed guarantees.** Incomplete chains, missing principle inputs, and undecidable supremacy all deny; deny-by-default governs absence of evidence; no waiver or override path is constructed for any principle.
- **Traceability requirements.** Every resolved chain preserves its derivation from authority root to subject; validation cites the principle and cause on denial; supremacy records the ordering basis so downstream traceability verification can reconstruct the decision.

---
End of Section D.


## E. Governance Compiler Specification

Scope: CGR-GC-RULES, CGR-GC-ERRORS, CGR-GC-DETERMINISM, CGR-GC-FAILCLOSED, CGR-GC-GENERATE (`src/control/governance-runtime/compiler/`).

- **Construction boundaries.** Confined to the `compiler/` directory plus its barrel export. The only authorized write in all of Wave 2 is CGR-GC-GENERATE's candidate-only append to CGR-REG-GOV through the Wave 1 append-only guard, with a paired audit entry. No update or delete path is constructed. No new persistence, registry substrate, or crypto is introduced.
- **Authorized dependencies.** `reasoning/read-model.ts`; CGR-AR-VALIDATE and CGR-AR-SUPREMACY (context and gating); Wave 1 canonical hashing (determinism); existing error infrastructure (`src/control/errors.ts`); Wave 1 CGR-REG-GOV registry, append-only guard, and hash-chained audit (generation only).
- **Prohibited dependencies.** Any write outside the guarded candidate append; direct registry mutation bypassing the guard; new error transport or persistence; prohibited core sources; the traceability runtime (no dependency onto it). Compilation must not read wall-clock, randomness, or environment.
- **Determinism guarantees.** Rule evaluation and canonicalization are pure over read-only inputs; CGR-GC-DETERMINISM anchors output with Wave 1 canonical hashing; identical inputs yield byte-identical candidate forms and identical hashes across processes; no nondeterministic source is admitted to the canonical form.
- **Fail-closed guarantees.** CGR-GC-FAILCLOSED denies by default; any unresolved conflict, missing input, or unclassified error forces deny; generation occurs only on an explicit permit; guard or audit failure aborts with no partial write; candidate status is the only status emissible and ACTIVE is unreachable.
- **Traceability requirements.** Each candidate record carries its derivation to the validated authority context; every emission and every denial is audited via the hash-chained audit; error causes are stable and reconstructable so CGR-TR-VERIFY can up-trace each candidate to its authority.

---
End of Section E.


## F. Traceability Runtime Specification

Scope: CGR-TR-GRAPH, CGR-TR-VERIFY, CGR-TR-IMPACT (`src/control/governance-runtime/traceability/`).

- **Construction boundaries.** Confined to the `traceability/` directory plus its barrel export. Builds read-only projections and verifications over registry records; the only write is CGR-TR-VERIFY's audit entry for verification outcomes through the Wave 1 audit writer. No registry mutation, no new persistence, registry substrate, or crypto.
- **Authorized dependencies.** `reasoning/read-model.ts`; ontology graph traversal (`src/control/ontology/**`); evolution and simulation impact analyzers (`src/control/evolution/**`, `src/control/simulation/**`); Wave 1 hash-chained audit (verification outcomes only).
- **Prohibited dependencies.** Any registry write; the append-only guard; CGR-REG-GOV writes; prohibited core sources; the compiler runtime (no dependency onto it). No edge may be synthesized beyond stored records.
- **Determinism guarantees.** Graph projection, verification, and impact traversal are pure over read-only inputs; reused ontology and analyzer primitives are invoked deterministically; identical graphs yield identical verdicts and impact sets across runs.
- **Fail-closed guarantees.** Any cycle, missing mandatory up-trace, unreachable authority root, or unverified graph fails verification and blocks impact reporting; incomplete graphs fail rather than pass; malformed edges surface as failures, never as omissions.
- **Traceability requirements.** Verification confirms every record up-traces to authority (PRIN-004 mandatory up-trace); violations name the offending nodes/edges; verification outcomes are audited so the trace decision is itself reconstructable.

---
End of Section F.


## G. Reuse Binding Matrix

Consolidated, authoritative map of every Wave 2 reuse binding. All bindings are import-and-compose; none reimplements a primitive; the sole write bindings are the guarded candidate append and the two audit appends. This section supersedes no earlier content; it consolidates Section B.5 with per-component granularity.

| Consumer component | Reused primitive | Location | Access | New substrate? |
|--------------------|------------------|----------|--------|----------------|
| CGR-AR-RESOLVE | Registry read-model + authority records | `reasoning/read-model.ts` → Wave 1 registries | Read-only | No |
| CGR-AR-RESOLVE, CGR-GC-DETERMINISM | Canonical hashing | Wave 1 `hashing/` | Read-only import | No |
| CGR-AR-VALIDATE | Principle inputs (15 principles) | Wave 1 registries via read-model | Read-only | No |
| CGR-AR-SUPREMACY | Canonical ordering | Wave 1 `hashing/` | Read-only import | No |
| CGR-GC-RULES | Compiler rule inputs (CR-*) | Wave 1 registries via read-model | Read-only | No |
| CGR-GC-ERRORS | Error base infrastructure | `src/control/errors.ts` | Import | No |
| CGR-GC-GENERATE | CGR-REG-GOV registry | Wave 1 `registries/` | Guarded candidate-only append | No |
| CGR-GC-GENERATE | Append-only guard | Wave 1 `guard/` | Import — enforced append | No |
| CGR-GC-GENERATE, CGR-TR-VERIFY | Hash-chained audit | Wave 1 `audit/` | Append (audit only) | No |
| CGR-TR-GRAPH, CGR-TR-IMPACT | Ontology graph traversal | `src/control/ontology/**` | Import | No |
| CGR-TR-IMPACT | Evolution impact analyzer | `src/control/evolution/**` | Import | No |
| CGR-TR-IMPACT | Simulation impact analyzer | `src/control/simulation/**` | Import | No |
| `reasoning/compose.ts` | Meta-core composition | `src/meta-core/**` | Import (no modification) | No |
| `reasoning/compose.ts` | Control types/ports | `src/control/types.ts` | Import (no modification) | No |

No binding modifies a prohibited core directory; no binding introduces persistence, registry, or cryptographic substrate.

---
End of Section G.


## H. Test Construction Package

All suites are `packages/platform-runtime/test/*.test.ts` executed by `node --test`, sharing `test/governance-runtime-harness.ts`. No suite mutates Wave 1 state except through the authorized guarded/audited paths under test.

### H.1 Unit suites

| Suite | Component under test | Asserts |
|-------|----------------------|---------|
| `cgr-authority-resolve.test.ts` | CGR-AR-RESOLVE | Chain closure; canonical ordering; denial on incomplete chain; zero writes |
| `cgr-authority-validate.test.ts` | CGR-AR-VALIDATE | Every principle exercised; no waiver path; deny-by-default on missing input |
| `cgr-authority-supremacy.test.ts` | CGR-AR-SUPREMACY | Total ordering; denial on undecidable conflict; no arbitrary pick |
| `cgr-compiler-rules.test.ts` | CGR-GC-RULES | Data-driven rules (no hardcoding); contradictions produce structured errors |
| `cgr-compiler-errors.test.ts` | CGR-GC-ERRORS | All failures classified; stable cause codes; built on reused error base |
| `cgr-compiler-failclosed.test.ts` | CGR-GC-FAILCLOSED | Deny-by-default; no permit without full validation |
| `cgr-compiler-generate.test.ts` | CGR-GC-GENERATE | Candidate-only status; guarded append; audit paired; abort on guard/audit failure |
| `cgr-traceability-graph.test.ts` | CGR-TR-GRAPH | Deterministic projection; no fabricated edges |
| `cgr-traceability-verify.test.ts` | CGR-TR-VERIFY | Cycle detection; mandatory up-trace; audited outcome |
| `cgr-traceability-impact.test.ts` | CGR-TR-IMPACT | Forward/backward sets; reuse of analyzers; no impact over unverified graph |

### H.2 Integration suites

- End-to-end reasoning path over the harness: resolve → validate → supremacy → rule-evaluate → fail-closed gate → candidate generate → trace-graph → verify → impact, asserting cross-component contracts hold and no ACTIVE status is produced.
- Compiler-to-registry integration: a permitted compilation appends exactly one candidate to CGR-REG-GOV through the guard with a paired audit entry; a denied compilation appends nothing.
- Traceability-over-generation integration: every generated candidate up-traces to its authority under CGR-TR-VERIFY.

### H.3 Determinism suites

- `cgr-compiler-determinism.test.ts`: byte-identical canonical form and hash across repeated in-process runs and a separate-process run; rejection of any nondeterministic input source.
- Cross-component determinism: identical seeded state yields identical resolved chains, verdicts, supremacy selections, candidate hashes, trace graphs, and impact sets on repeat.

### H.4 Non-regression suites

- `cgr-wave2-nonregression.test.ts`: the Wave 1 baseline suite count and outcomes are preserved; no Wave 1 CGR file and no prohibited-core file is modified; the full package typecheck remains clean.
- Substrate-untouched assertion: Wave 2 introduces no change under `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts`.

### H.5 Activation-impossible suites

- `cgr-activation-impossible.test.ts`: no reachable path — through generation, guard, or audit — confers or implies ACTIVE status on any record; candidate is the terminal status for Wave 2; attempts to construct an ACTIVE transition fail-closed.

---
End of Section H.


## I. Dependency Graph

Construction and runtime dependency ordering. Edges point from dependent to dependency (A → B means A depends on B). The graph is acyclic; the three runtimes do not depend on one another laterally except through explicitly authorized authority context consumed by the compiler.

```
reasoning/read-model.ts  ─→  Wave 1 registries (read-only)
reasoning/compose.ts     ─→  meta-core, control/types.ts, all three runtimes

Authority Runtime
  CGR-AR-RESOLVE     ─→  read-model, Wave 1 hashing
  CGR-AR-VALIDATE    ─→  CGR-AR-RESOLVE, read-model
  CGR-AR-SUPREMACY   ─→  CGR-AR-RESOLVE

Governance Compiler Runtime
  CGR-GC-RULES       ─→  read-model, CGR-AR-VALIDATE (context)
  CGR-GC-ERRORS      ─→  src/control/errors.ts
  CGR-GC-DETERMINISM ─→  CGR-GC-RULES, Wave 1 hashing
  CGR-GC-FAILCLOSED  ─→  CGR-AR-VALIDATE, CGR-AR-SUPREMACY, CGR-GC-RULES, CGR-GC-ERRORS
  CGR-GC-GENERATE    ─→  CGR-GC-FAILCLOSED, CGR-GC-DETERMINISM,
                         Wave 1 CGR-REG-GOV + guard + audit

Traceability Runtime
  CGR-TR-GRAPH       ─→  read-model, ontology traversal
  CGR-TR-VERIFY      ─→  CGR-TR-GRAPH, Wave 1 audit
  CGR-TR-IMPACT      ─→  CGR-TR-GRAPH, evolution + simulation analyzers
```

Construction order implied by the graph:
1. `reasoning/read-model.ts`
2. Authority Runtime (RESOLVE → VALIDATE, SUPREMACY)
3. Governance Compiler Runtime (ERRORS, RULES → DETERMINISM, FAILCLOSED → GENERATE)
4. Traceability Runtime (GRAPH → VERIFY, IMPACT)
5. `reasoning/compose.ts` (final wiring)

No cycle exists; no runtime depends on a not-yet-constructed peer; all leaf dependencies are Wave 1 or existing platform primitives.

---
End of Section I.


## J. Acceptance Matrix

### J.1 Component-by-component acceptance

| Component | Accepted when |
|-----------|---------------|
| CGR-AR-RESOLVE | Deterministic chains; denial on incomplete chain; zero writes |
| CGR-AR-VALIDATE | All principles exercised; no waiver reachable; deny-by-default proven |
| CGR-AR-SUPREMACY | Total deterministic ordering; denial on undecidable conflict |
| CGR-GC-RULES | No hardcoded rule values; contradictions → structured errors |
| CGR-GC-ERRORS | All failures classified with stable causes on the reused base |
| CGR-GC-DETERMINISM | Byte-identical output/hash across processes; no nondeterministic source |
| CGR-GC-FAILCLOSED | Deny-by-default; no permit without full validation |
| CGR-GC-GENERATE | Candidate-only; guarded append; paired audit; activation unreachable |
| CGR-TR-GRAPH | Deterministic projection; no fabricated edges |
| CGR-TR-VERIFY | Cycles and missing up-trace detected; outcome audited |
| CGR-TR-IMPACT | Deterministic impact sets; analyzer reuse; no impact over unverified graph |

### J.2 Runtime-level acceptance

| Runtime | Accepted when |
|---------|---------------|
| Authority Runtime | Determinism and fail-closed guarantees of Section D met; no write path constructed; no upward dependency on compiler/traceability |
| Governance Compiler Runtime | Section E met; sole write is guarded candidate-only append with audit; ACTIVE unreachable; determinism proven |
| Traceability Runtime | Section F met; only write is verification audit; acyclicity and mandatory up-trace enforced; analyzer/ontology reuse proven |

### J.3 Wave-level acceptance

Wave 2 is accepted only when all of Section A's Exit Conditions hold together:
- All Wave 2 components and suites typecheck and pass.
- Determinism proven across processes for every deterministic surface.
- Validation and gating remain fail-closed; deny-by-default demonstrated.
- Traceability violations (cycles, missing up-trace) are reliably detected.
- The compiler emits candidate-only records; no ACTIVE state is conferrable.
- The Wave 1 baseline and prohibited-core directories are unchanged (non-regression preserved).

---
End of Section J.


## K. Exit Gates

All gates are mandatory; any failing gate blocks Wave 2 completion. Gates are evaluated fail-closed — an unevaluated gate counts as failed.

- **Technical gates.** Full `packages/platform-runtime` typecheck clean; all Wave 2 unit and integration suites pass under `node --test`; no new package, persistence engine, registry substrate, or cryptographic primitive introduced; Wave 2 code confined to the four Section B.1 directories plus the listed test files.
- **Determinism gates.** Every deterministic surface (resolve, validate, supremacy, rule-evaluate, canonicalize, graph, verify, impact) produces byte-identical results across repeated and cross-process runs; no wall-clock, randomness, or environment input admitted to any canonical form or hash.
- **Governance gates.** Governance remains propose-only; generation is candidate-only; no waiver/override path exists for any principle; deny-by-default demonstrated across compiler gating and validation; no new governance doctrine or certification content introduced.
- **Traceability gates.** Every candidate up-traces to authority; CGR-TR-VERIFY detects all injected cycles and missing up-traces; verification outcomes are audited via the hash-chained audit.
- **Non-regression gates.** Wave 1 baseline suite outcomes preserved; zero modification under `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts`; no Wave 1 CGR file modified; activation-impossible suite passes.

---
End of Section K.


## L. Final Construction Backlog

### L.1 Mandatory post-Wave-2 work

- Wire the composed CGR reasoning handle into the platform-runtime composition entry so the engines are reachable through the established control surface (composition only; no activation).
- Author operator-facing read documentation for the reasoning surface (resolve/validate/compile-candidate/trace) consistent with existing fabric docs.
- Extend the non-regression baseline record to include the Wave 2 suite counts so future waves inherit the enlarged baseline.

### L.2 Deferred work

- Performance profiling and caching of the read-model projections (correctness-first in Wave 2; optimization deferred).
- Batch/streaming resolution and verification over large registries (single-subject paths delivered in Wave 2).
- Consolidated diagnostics reporting across the three runtimes (per-component causes exist; aggregation deferred).

### L.3 Wave-3 prerequisites

- Authority-Board / Article IX decision governing whether any candidate may progress beyond candidate status; Wave 2 confers none and Wave 3 may not assume one.
- A ratified activation-authority model (currently non-existent by design) before any ACTIVE transition can be specified.
- Ratified enrollment and lifecycle inputs for candidate promotion, sourced from governing documents, not from Wave 2.

### L.4 Explicit out-of-scope items

- Any activation, enrollment, or ACTIVE-status conferral — impossible by construction in Wave 2.
- Any new persistence engine, registry substrate, or cryptographic primitive.
- Any modification of the prohibited core directories or any Wave 1 CGR file.
- Any new governance doctrine, certification content, or architecture theory.
- Any implementation code, SQL, migrations, or API definitions — this is a construction package only.

---
End of Section L.
---
PCAMG-RUNTIME-0012 COMPLETE
