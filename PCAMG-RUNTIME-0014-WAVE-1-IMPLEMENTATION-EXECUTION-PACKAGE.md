# PCAMG-RUNTIME-0014 — WAVE-1 IMPLEMENTATION EXECUTION PACKAGE

**Authority:** Constitutional Runtime Construction Authority
**Artifact Class:** Implementation Execution Package
**Basis:** Verified repository reality only (per 0012B / 0013). No new architecture, no doctrine, no code.
**Canonical Root:** `packages/platform-runtime/src/control/constitutional-governance/` (alias `…/cg/`). No `governance-runtime` reference appears anywhere in this program.

**Authoritative Inputs:** PCAMG-RUNTIME-0001, -0002, -0003, -0003A, -0004, -0005, -0006, -0007, -0008, -0010, -0011, -0012, -0012A, -0012B, -0013.

---

## A. Executive Summary

This package is the execution program that turns the Wave-1 authorization (0013) into an ordered, verifiable build. It sequences the construction of the CGR foundation substrate — the record schema, append-only guard, canonical hashing, eleven propose-only registries over one shared base, the hash-chained audit append and its verifier, and the composition layer, exports, and tests — entirely under the canonical root, strictly additive over the verified **443/443** baseline.

Three verified execution facts anchor this program:

1. **No CGR code exists** (0012B). The build is additive under `…/cg/` plus exactly two EXTEND points.
2. **All eighteen reuse targets exist** in `packages/platform-runtime/src/` (verified in 0013). Nothing is reimplemented.
3. **The toolchain already covers the new tree.** `tsconfig.json` `include` already globs `src/**/*.ts` and `test/**/*.ts`, so the TypeScript gate covers `…/cg/**` and `test/cg/**` automatically with **no tsconfig change**; only the `package.json` test glob must be widened. Runtime is Node ≥ 23.6 (measured v26.3.0), which executes `.ts` under `node --test` natively.

The program is a single agent-executable sequence of 26 backlog items in strict dependency order, each bound to acceptance gates that are blocking and fail-closed.

---

## B. Authorized Scope

**Authorized (this Wave):** the 18 component IDs of 0013 §D — CGR-CORE-01..05, CGR-REG-base + eleven registries, CGR-AU-CHAIN, CGR-AU-VERIFY — plus runtime exports and the core/registries/audit/system test suites. All delivered as **inert, propose-only** substrate.

**Two EXTEND points only (outside `…/cg/`):**
1. `packages/platform-runtime/src/control/index.ts` — append one namespaced re-export mirroring the existing `export * as <fabric>` lines (memory, readiness, operations, simulation, …).
2. `packages/platform-runtime/package.json` — widen the `test` script glob to also match `test/cg/**/*.test.ts` (append only; keep the existing `test/*.test.ts`).

**Out of scope:** any ACTIVE status / activation path (Wave 3); authority / compiler / traceability reasoning engines (Wave 2); any change to persistence, crypto, registry infrastructure, or any PROHIBITED fabric.

**Compiler-imposed constraint (verified):** `erasableSyntaxOnly: true` forbids runtime-emitting TypeScript (no `enum`, no runtime `namespace`); the schema's registry/relation/status "enums" are therefore union-string / const-object forms, consistent with 0011. `verbatimModuleSyntax` + `allowImportingTsExtensions` require explicit `.ts` import extensions and type-only import discipline.

---

## C. Implementation Work Breakdown Structure (WBS)

| WBS | Work Package | Component IDs | Sequence position |
|-----|--------------|---------------|-------------------|
| WBS-1 | Namespace scaffold + shared schema | CGR-CORE-01 | Items 1 |
| WBS-2 | Core primitives (hash, guard, harness) | CGR-CORE-03, -02, -05 | Items 2–4 |
| WBS-3 | Registry base | CGR-REG-base | Item 5 |
| WBS-4 | Registry construction (eleven) | CGR-REG-PRIN..AUDIT | Items 6–16 |
| WBS-5 | Registries barrel | — | Item 17 |
| WBS-6 | Authority chain + verifier | CGR-AU-CHAIN, CGR-AU-VERIFY | Items 18–19 |
| WBS-7 | Audit barrel | — | Item 20 |
| WBS-8 | Composition layer + namespace barrel | CGR-CORE-04 | Items 21–22 |
| WBS-9 | Runtime export EXTEND points | — | Items 23–24 |
| WBS-10 | Test suites (core/registries/audit) | all | Item 25 |
| WBS-11 | System + baseline non-regression suite | all | Item 26 |

Each WBS package is closed only when its items are build-complete, its bound gates are green, and the 443 baseline is intact.

---

## D. Directory Creation Sequence

Directories are created lazily as the first file in each is authored (no empty directories committed). The creation order follows the dependency build order:

```
Step 1  src/control/constitutional-governance/                 (created with types.ts)
Step 2  src/control/constitutional-governance/registries/      (created with registry-base.ts)
Step 3  src/control/constitutional-governance/audit/           (created with audit-chain.ts)
Step 4  test/cg/                                               (created with first core suite)
Step 5  test/cg/core/                                          (core suites)
Step 6  test/cg/registries/                                    (registry suites)
Step 7  test/cg/audit/                                         (audit suites)
Step 8  test/cg/system/                                        (system + non-regression suite)
```

No directory is created outside the canonical root and `test/cg/`. No tsconfig `include` edit is required (already globs `src/**` and `test/**`).

---

## E. Component Construction Sequence

Strict topological order (no component precedes its dependencies). Construction order, dependencies, required reuse, required exports, and required tests per component:

| Order | Component | Depends on | Required reuse targets (verified present) | Required exports | Required tests |
|-------|-----------|-----------|-------------------------------------------|------------------|----------------|
| 1 | CGR-CORE-01 types | — | `contracts/types.ts`, `meta-core/ports.ts` | shared record/enum/DTO/event declarations | type round-trip; ACTIVE-excluded proof |
| 2 | CGR-CORE-03 hashing | 01 | `control/federation/assertions.ts`, `persistence-runtime/canonical.ts` | hash + verify surface | determinism; key-order independence; tamper ⇒ false |
| 3 | CGR-CORE-02 guard | 01 | `persistence-runtime/append-only-log.ts`, `control/errors.ts` | guard surface + `E-APPEND-ONLY` code | duplicate rejected; delete absent; forged supersession rejected |
| 4 | CGR-CORE-05 harness | 01 (usable after 03) | `registry-runtime/registry.ts`, `metadata-runtime/metadata-store.ts`, `control/audit-log.ts` | fixture factory, fixed clock, sample record | fixture isolation; monotonic fixed clock |
| 5 | CGR-REG-base | 01,02,03 | `meta-core/ports.ts`, `meta-core/semver.ts` | `ConstitutionalRegistry` base | RG-1..8 each covered |
| 6 | CGR-REG-PRIN | base | MetadataPort + metadata store | principle registry | propose/get/history/list; immutable statement |
| 7 | CGR-REG-META | PRIN | + PRIN read | meta registry | up-trace to existing principle |
| 8 | CGR-REG-GOV | PRIN,META | `control/evolution/evolution-proposal.ts` (pattern) | candidate + generation registry | candidate-only (never ACTIVE) |
| 9 | CGR-REG-CENTER | PRIN | MetadataPort | center registry | acyclic delegation |
| 10 | CGR-REG-DOMAIN | CENTER | + CENTER read | domain registry | bound to existing center |
| 11 | CGR-REG-POLICY | DOMAIN | `control/policy/policy-evaluator.ts` (pattern) | policy registry | deny-by-default |
| 12 | CGR-REG-CAP | DOMAIN,POLICY | + DOMAIN/POLICY read | capability registry | domain+policy resolve |
| 13 | CGR-REG-CONSENT | base | MetadataPort | consent registry | revoke = new appended record |
| 14 | CGR-REG-DECISION | base | `control/readiness/meta-governance-engine.ts` (SoD pattern) | decision registry | proposer ≠ certifier ≠ ratifier |
| 15 | CGR-REG-TRACE | base | MetadataPort | trace registry | `layerTo ≤ layerFrom`; no self-edge; 8 relations |
| 16 | CGR-REG-AUDIT | base, 03 | `control/audit-log.ts`, `append-only-log.ts` | audit registry | genesis-anchored; monotonic seq |
| 17 | registries barrel | 5–16 | — | `registries/index.ts` | barrel imports without collision |
| 18 | CGR-AU-CHAIN | REG-AUDIT, 03 | `federated-`/`evolution-`/`knowledge-audit-log.ts`, `assertions.ts` | audit chain surface, genesis constant | genesis link; monotonic seq; determinism |
| 19 | CGR-AU-VERIFY | AU-CHAIN | reused `static verify` construction | verifier surface | gap/break/tamper/head-mismatch each ⇒ fail |
| 20 | audit barrel | 18–19 | — | `audit/index.ts` | barrel imports without collision |
| 21 | CGR-CORE-04 assembly | all above | `control/bootstrap.ts`, knowledge/simulation assembly pattern, `meta-core/ports.ts` | control assembly + factory | all 11 + audit wired; write mirrored |
| 22 | CGR-CORE-04 barrel | 21 | — | `index.ts` namespace barrel (public surface only) | zero collision on re-export |
| 23 | EXTEND re-export | 22 | mirrors existing `export * as <fabric>` | `control/index.ts` (append 1 line) | export adds 0 collisions / 0 failures |
| 24 | EXTEND test glob | — | existing `node --test` convention | `package.json` test script | glob resolves `test/cg/**` |
| 25 | core/reg/audit suites | all | harness | `test/cg/{core,registries,audit}/*.test.ts` | all bound gates |
| 26 | system suite | all | harness | `test/cg/system/*.test.ts` | all six gates |

---

## F. Registry Construction Program (all eleven)

**Base first (Item 5).** `ConstitutionalRegistry` centralizes registry rules RG-1..8 — propose-only, append-only, content-hashed, supersession-by-link, versioned-unique `(id,version)`, deterministic identity, traceable, auditable — so no registry re-implements storage, hashing, or the guard. Storage is via the injected metadata port; hashing via CGR-CORE-03; append discipline via CGR-CORE-02; every write emits an audit event.

**Then the eleven, in cross-reference-safe order** (6→16): PRIN → META → GOV → CENTER → DOMAIN → POLICY → CAP → CONSENT → DECISION → TRACE → AUDIT. Each supplies only its specialized validation and payload; all else is inherited.

| Registry | Specialized validation invariant (execution acceptance) | Cross-ref precondition |
|----------|----------------------------------------------------------|------------------------|
| PRIN | closed 15-id space; statement immutable across versions | none (root) |
| META | article traces to ≥1 existing PRIN | PRIN populated |
| GOV | candidate references a generation record; candidate-only | PRIN/META readable |
| CENTER | delegation graph acyclic | none |
| DOMAIN | `centerRef` resolves to existing CENTER | CENTER populated |
| POLICY | absent/ambiguous ⇒ deny (deny-by-default) | DOMAIN populated |
| CAP | `domainRef` + `policyRef` resolve | DOMAIN + POLICY populated |
| CONSENT | revocation is a new appended record | none |
| DECISION | SoD: proposer ≠ certifier ≠ ratifier | none |
| TRACE | `layerTo ≤ layerFrom`; no self-edge; relation ∈ 8 | referenced ids exist |
| AUDIT | genesis-anchored; monotonic seq; hashing delegated to AU-CHAIN | CGR-CORE-03 present |

**Registry-specific reuse discipline:** GOV uses the evolution candidate pattern (never touches `control/governance/*`; prefix `cg:governance:*`); POLICY uses the deny-by-default pattern from `control/policy/policy-evaluator.ts` (not modified); DECISION mirrors the SoD pattern in `control/readiness/meta-governance-engine.ts` (not modified). Item 17 closes the registries barrel.

---

## G. Core Runtime Construction Program

Execution order within the core (Items 2, 3, 18, 19, 21):

1. **Hashing assembly (CGR-CORE-03, Item 2).** Deterministic content addressing over the canonical key-sorted form, excluding the content-hash field; verify-on-read. Routes exclusively through reused `canonicalize` + `sha256` (byte-identical to existing chains); no direct crypto import inside `…/cg/`.
2. **Append-only guard (CGR-CORE-02, Item 3).** Semantic no-update / no-delete / supersession-by-linked-record layer over the reused append-only log; every rejection is `E-APPEND-ONLY` (extends the existing error base). Pure, no I/O.
3. **Audit chain (CGR-AU-CHAIN, Item 18).** Attributable, hash-chained append; first entry links to the 64-zero genesis; entry-hash construction identical to the reused federation/evolution/knowledge chains; entries frozen; deterministic export with head hash.
4. **Audit verifier (CGR-AU-VERIFY, Item 19).** Pure, offline recomputation of every entry hash, seq continuity, prev-hash linkage, and head match; four failure modes each ⇒ fail-closed verdict; does not import the live chain instance.
5. **Composition layer (CGR-CORE-04, Item 21).** Single factory wiring all eleven registries + the audit chain into one control; every registry write mirrored to the chain; assembly pattern reused from `control/bootstrap.ts` and the knowledge/simulation assemblies; metadata port injected.

---

## H. Runtime Export Program

- **Namespace barrel (Item 22):** `…/cg/index.ts` exports the public surface only (control factory + control shape, registry types, audit surfaces, error code, chain verifier). Internal helpers stay unexported.
- **Registries / audit barrels (Items 17, 20):** local barrels for the two subtrees.
- **EXTEND re-export (Item 23):** append `export * as cg from "./constitutional-governance/index.ts";` to `control/index.ts`, mirroring the existing namespaced fabric exports (memory, readiness, operations, simulation). The `cg` alias guarantees collision-freedom with generic fabric names.
- **EXTEND test glob (Item 24):** widen the `package.json` `test` script to match `test/cg/**/*.test.ts` in addition to `test/*.test.ts`. No tsconfig change (already globs `test/**`).

---

## I. Test Construction Program

Runner: `node --test` (native `.ts`, Node v26). Suites created under `test/cg/{core,registries,audit,system}/`.

| Suite tree | Coverage authorized |
|------------|---------------------|
| `test/cg/core/` | CORE-01 type round-trip + ACTIVE-excluded; CORE-02 duplicate/forged-supersession/no-delete; CORE-03 determinism + key-order + tamper; CORE-04 wiring + audit mirror + double-init isolation; CORE-05 fixture isolation + fixed-clock monotonicity |
| `test/cg/registries/` | per-registry propose/get/history/list; specialized validation; propose-only breach; append-only breach; SoD / acyclic / deny / layer-rule violations; order-independent hash; history intact after N appends; RG-1..8 |
| `test/cg/audit/` | genesis link; monotonic seq; frozen entries; determinism of chain+head; verifier gap/break/tamper/head-mismatch |
| `test/cg/system/` | end-to-end lifecycle (principle→meta→center→domain→policy→capability→decision→trace→audit→export→verify); baseline non-regression; adversarial composite (tamper anywhere detected) |

Harness (CGR-CORE-05) is available from Item 4 and is the sole fixture source for every suite.

---

## J. Integration Construction Program

Integration is the final assembly and wiring, executed as Items 21–26:

1. Compose the control (Item 21) and export the barrel (Item 22).
2. Wire the namespace into the tree via the single `control/index.ts` re-export (Item 23) — verify zero collision and zero baseline failure immediately after.
3. Widen the test glob (Item 24) — verify the runner discovers `test/cg/**`.
4. Run the full suite (Items 25–26): core, registries, audit, then the system suite that drives the complete propose→export→verify lifecycle and asserts the 443 baseline still passes alongside the additions.

Integration is complete when the end-to-end lifecycle produces an exported chain that round-trips through replay and independent verification to an identical head hash, with the substrate inert (propose-only).

---

## K. Non-Regression Program

- **Baseline: 443 / 443** (platform-runtime 378 + contract-generator 65), verified. This is the floor.
- After every WBS package, re-run the platform-runtime suite; the existing 378 must remain green and the contract-generator 65 untouched.
- The `control/index.ts` re-export and the widened test glob must each add zero failures and zero symbol collisions.
- Final total = **443 + Wave-1 additions**, all green. No existing test is skipped, disabled, or modified.
- The stale "284" figure (Git `56a32d3`) is not a baseline and is not used.

---

## L. Acceptance Verification Program

Per-item verification is bound to the gates in Section E and executed continuously:

1. **Compile check** after each file: `tsc --noEmit -p tsconfig.json` (strict; `noUncheckedIndexedAccess`; no `any` on public surfaces; explicit `.ts` extensions; no runtime-emitting syntax).
2. **Unit/determinism/adversarial suites** after each component per Section I.
3. **Append-only proof:** no update/delete path exists on any registry record; every mutation attempt yields `E-APPEND-ONLY`.
4. **Authority proof:** verifier detects all four failure modes; chain construction byte-identical to reused chains; genesis anchoring confirmed.
5. **Traceability proof:** every non-root record resolves its up-trace; trace edges satisfy the layer rule, acyclic, 8-relation closed.
6. **Propose-only proof:** no ACTIVE status is representable or conferrable anywhere.
7. **Non-regression proof:** 443 baseline re-run green after every package.

Escalation: an undetected tamper in AU-VERIFY is a **security escalation** (fail-closed breach) and halts the Wave; any other failed gate halts the affected package for fix-in-place.

---

## M. Exit Gates

All gates are **blocking** and **fail-closed**.

| Gate | Condition |
|------|-----------|
| **TypeScript** | `…/cg/**` and `test/cg/**` compile under the repo tsconfig with zero errors; strict + `noUncheckedIndexedAccess` satisfied; no `any` leakage on public surfaces; no runtime-emitting syntax (`erasableSyntaxOnly`). |
| **Test** | every Wave-1 suite passes; total = 443 + additions; zero baseline regressions. |
| **Determinism** | content hash and audit head identical across repeated runs / machines for identical inputs; fixed-clock fixtures reproduce byte-identical exports. |
| **Append-only** | no update/delete path; every mutation attempt is `E-APPEND-ONLY`; supersession only by appended linked record. |
| **Traceability** | every non-root record resolves its up-trace; trace edges layer-valid, acyclic, 8-relation closed. |
| **Authority** | verifier detects gap/break/tamper/head-mismatch; genesis anchoring confirmed; chain construction byte-identical to reused audit logs; propose-only confirmed. |

---

## N. Deliverables Matrix

| # | Deliverable | Path | Component | Bound gates |
|---|-------------|------|-----------|-------------|
| 1 | Shared schema | `cg/types.ts` | CORE-01 | TS |
| 2 | Hashing | `cg/hashing.ts` | CORE-03 | TS, Determinism |
| 3 | Append-only guard | `cg/append-only.ts` | CORE-02 | TS, Append-only |
| 4 | Test harness | `cg/test-harness.ts` | CORE-05 | TS |
| 5 | Registry base | `cg/registries/registry-base.ts` | REG-base | TS, Append-only |
| 6–16 | Eleven registries | `cg/registries/{principle,meta,governance-candidate,center,domain,policy,capability,consent,decision,trace,audit}-registry.ts` | REG-PRIN..AUDIT | TS, Test, Traceability, Append-only |
| 17 | Registries barrel | `cg/registries/index.ts` | — | TS |
| 18 | Audit chain | `cg/audit/audit-chain.ts` | AU-CHAIN | TS, Determinism, Authority |
| 19 | Chain verifier | `cg/audit/chain-verifier.ts` | AU-VERIFY | TS, Authority |
| 20 | Audit barrel | `cg/audit/index.ts` | — | TS |
| 21 | Control assembly | `cg/governance-control.ts` | CORE-04 | TS, Test |
| 22 | Namespace barrel | `cg/index.ts` | CORE-04 | TS |
| 23 | Re-export EXTEND | `control/index.ts` (append 1 line) | — | TS, Test |
| 24 | Test glob EXTEND | `packages/platform-runtime/package.json` | — | Test |
| 25 | Core/reg/audit suites | `test/cg/{core,registries,audit}/*.test.ts` | all | Test, Determinism, Append-only, Authority |
| 26 | System + non-regression suite | `test/cg/system/*.test.ts` | all | All gates |

---

## O. Construction Risks

| Risk | Description | Mitigation (from repository reality) |
|------|-------------|--------------------------------------|
| R-1 Runtime-emitting syntax | `erasableSyntaxOnly` forbids `enum`/runtime `namespace`; naïve enum authoring fails compile | Author registry/relation/status sets as union-string / const-object forms (as in 0011); TS gate catches any violation immediately |
| R-2 Hash divergence | A new canonicalizer or direct crypto import would break byte-identity with existing chains | Bind CORE-03 and AU-CHAIN exclusively to `assertions.ts` (`canonicalize`,`sha256`); Determinism + Authority gates enforce identity |
| R-3 Barrel collision | `export *` from the new namespace could shadow generic fabric names in `control/index.ts` | Use `export * as cg` (namespaced), mirroring existing fabric exports; Test gate verifies zero collision |
| R-4 Keyspace clash with existing governance | CGR-REG-GOV vs pre-existing `control/governance/*` | Distinct metadata prefix `cg:governance:*`; `control/governance/*` is PROHIBITED (import-only) |
| R-5 Baseline regression | New suites or the glob widening perturb the 378/65 baseline | Re-run 443 after every WBS package; glob is append-only; tsconfig unchanged |
| R-6 Non-determinism via clock | Wall-clock use in a hashed/deterministic path | Inject `clock()` seam everywhere; fixed-clock fixtures in the harness; Determinism gate |
| R-7 Silent tamper miss | Verifier fails to detect a tamper mode | Four-mode adversarial suite; an undetected tamper is a security escalation that halts the Wave |
| R-8 Uncommitted inputs | Inputs 0003–0012 remain untracked; 0012A/0009 absent as discrete files | Commit the authorized inputs and record the 0012B reconciliation before build start (precondition carried from 0012B/0013) |

---

## P. Formal Execution Authorization

On verified repository reality alone, the Wave-1 Constitutional Governance Runtime substrate is authorized for execution under the single canonical root `packages/platform-runtime/src/control/constitutional-governance/`, following the 26-item dependency-ordered program above. All eighteen reuse targets are verified present; the toolchain already covers the new source and test trees; the non-regression floor is the verified 443/443 baseline; and all six exit gates are blocking and fail-closed. Construction is strictly additive under the canonical root plus the two named EXTEND points, with every PROHIBITED path import-only. The Wave introduces no ACTIVE status, no new architecture, no doctrine, and no reasoning engines. No `governance-runtime` reference exists in this program.

---

**WAVE-1 IMPLEMENTATION EXECUTION AUTHORIZED**
