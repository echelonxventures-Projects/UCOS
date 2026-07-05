# PCAMG-RUNTIME-0015 — WAVE-1 BUILD PACKAGE — REGISTRIES & FOUNDATION SUBSTRATE

**Authority:** Constitutional Runtime Construction Authority
**Artifact Class:** Build Package · Construction Package · Implementation Work Package
**Basis:** Verified repository reality only (per 0012B / 0013 / 0014). No new architecture, no doctrine, no code.
**Canonical Root:** `packages/platform-runtime/src/control/constitutional-governance/` (alias `…/cg/`). No `governance-runtime` reference appears anywhere in this package.

**Authoritative Inputs:** PCAMG-RUNTIME-0001, -0002, -0003, -0003A, -0004, -0005, -0006, -0007, -0008, -0010, -0011, -0012, -0012A, -0012B, -0013, -0014.

---

## A. Executive Summary

This is the executable build package for the Wave-1 Constitutional Governance Runtime (CGR) foundation substrate. It authorizes the concrete construction — under the single canonical root — of the shared record schema, the canonical hashing assembly, the append-only guard, the eleven propose-only registries over one shared base, the hash-chained audit chain and its verifier, the composition layer, the runtime exports, and the test suites.

The build is strictly additive over the verified **443/443** baseline (platform-runtime 378 + contract-generator 65). No CGR code exists today (0012B); all eighteen reuse targets are verified present (0013); and the toolchain already covers the new trees — `tsconfig.json` `include` globs `src/**/*.ts` and `test/**/*.ts`, so only the `package.json` test glob is widened. Runtime is Node ≥ 23.6 (measured v26.3.0), executing `.ts` natively under `node --test`.

Everything below is import-and-compose over the existing `@ucos/platform-runtime` substrate. Nothing is reimplemented. The entire substrate is delivered as **inert, propose-only** state: no ACTIVE status is representable or conferrable in Wave 1.

---

## B. Build Scope

**In build (18 component IDs + exports + tests):**
- Foundation directory scaffold under the canonical root.
- CGR-CORE-01 shared schema; CGR-CORE-03 hashing; CGR-CORE-02 append-only guard; CGR-CORE-05 test harness; CGR-CORE-04 composition layer + barrel.
- CGR-REG-base + eleven registries (PRIN, META, GOV, CENTER, DOMAIN, POLICY, CAP, CONSENT, DECISION, TRACE, AUDIT).
- CGR-AU-CHAIN audit append; CGR-AU-VERIFY chain verifier.
- Runtime exports: registries barrel, audit barrel, namespace barrel, one namespaced re-export into `control/index.ts`.
- Unit, integration, and non-regression test suites under `test/cg/`.

**Two EXTEND points only (outside `…/cg/`):**
1. `packages/platform-runtime/src/control/index.ts` — append one `export * as cg …` line mirroring the existing fabric exports (memory, readiness, operations, simulation, …).
2. `packages/platform-runtime/package.json` — widen the `test` script glob to also match `test/cg/**/*.test.ts` (append only).

**Out of build:** ACTIVE / activation (Wave 3); authority/compiler/traceability reasoning engines (Wave 2); any change to persistence, crypto, registry infrastructure, or any PROHIBITED fabric.

**Compiler-imposed build constraints (verified):** `erasableSyntaxOnly: true` forbids runtime-emitting TypeScript (no `enum`, no runtime `namespace`); `verbatimModuleSyntax` + `allowImportingTsExtensions` require explicit `.ts` import extensions and type-only import discipline; `strict` + `noUncheckedIndexedAccess` apply.

---

## C. Foundation Directory Package

Directories are created lazily with the first file authored in each — no empty directories.

```
packages/platform-runtime/
├── package.json                                     # EXTEND: widen test glob to include test/cg/**/*.test.ts
├── src/control/
│   ├── index.ts                                     # EXTEND: append `export * as cg from "./constitutional-governance/index.ts"`
│   └── constitutional-governance/                   # CANONICAL ROOT — all NEW
│       ├── index.ts                                 # CGR-CORE-04  namespace barrel
│       ├── types.ts                                 # CGR-CORE-01  schema + enums (union-string) + DTO/event shapes
│       ├── hashing.ts                               # CGR-CORE-03  canonical hashing + verify-on-read
│       ├── append-only.ts                           # CGR-CORE-02  append-only guard + E-APPEND-ONLY
│       ├── test-harness.ts                          # CGR-CORE-05  deterministic fixtures + fixed clock
│       ├── governance-control.ts                    # CGR-CORE-04  control assembly + factory
│       ├── registries/
│       │   ├── index.ts                             # registries barrel
│       │   ├── registry-base.ts                     # CGR-REG-base  ConstitutionalRegistry (RG-1..8)
│       │   ├── principle-registry.ts                # CGR-REG-PRIN
│       │   ├── meta-registry.ts                     # CGR-REG-META
│       │   ├── governance-candidate-registry.ts     # CGR-REG-GOV  (prefix cg:governance:*)
│       │   ├── center-registry.ts                   # CGR-REG-CENTER
│       │   ├── domain-registry.ts                   # CGR-REG-DOMAIN
│       │   ├── policy-registry.ts                   # CGR-REG-POLICY
│       │   ├── capability-registry.ts               # CGR-REG-CAP
│       │   ├── consent-registry.ts                  # CGR-REG-CONSENT
│       │   ├── decision-registry.ts                 # CGR-REG-DECISION
│       │   ├── trace-registry.ts                    # CGR-REG-TRACE
│       │   └── audit-registry.ts                    # CGR-REG-AUDIT
│       └── audit/
│           ├── index.ts                             # audit barrel
│           ├── audit-chain.ts                       # CGR-AU-CHAIN
│           └── chain-verifier.ts                    # CGR-AU-VERIFY
└── test/cg/
    ├── core/                                        # CGR-CORE-* suites
    ├── registries/                                  # CGR-REG-* suites
    ├── audit/                                        # CGR-AU-* suites
    └── system/                                      # end-to-end + baseline non-regression
```

No tsconfig `include` edit required (already globs `src/**` and `test/**`). No directory outside the canonical root and `test/cg/`.

---

## D. Registry Package (all eleven authorized)

**Shared base (CGR-REG-base) — built first.** One generic `ConstitutionalRegistry` encodes registry rules RG-1..8 so no registry re-implements storage, hashing, or the guard:

| Rule | Statement |
|------|-----------|
| RG-1 | Propose-only — records enter `proposed`; no ACTIVE conferrable. |
| RG-2 | Append-only — no update, no delete (via CGR-CORE-02). |
| RG-3 | Content-hashed — verified `contentHash` on every record (via CGR-CORE-03). |
| RG-4 | Supersession by link — a change is a new appended linked record; prior moves to `superseded` by appended state, not mutation. |
| RG-5 | Versioned — `(id, version)` unique; version is valid SemVer (`meta-core/semver.ts`). |
| RG-6 | Deterministic identity — structural equality ⇒ equal `contentHash` (order-independent). |
| RG-7 | Traceable — non-root records reference their derivation source. |
| RG-8 | Auditable — every append/supersede emits an audit event to CGR-AU-CHAIN. |

**Base build spec.** Purpose: propose/get/history/list + supersede over the injected metadata port, delegating append discipline to the guard and hashing to the hashing assembly; concrete registries supply only specialized validation and payload. Inputs: registry type, metadata port, guard, clock. Outputs: append/read/history behaviors. Dependencies: CORE-01/02/03; reuse `meta-core/ports.ts`, `meta-core/semver.ts`. Acceptance: RG-1..8 enforced centrally; no storage re-implementation; complete ordered history.

Then the eleven, in cross-reference-safe order:

### CGR-REG-PRIN — Principle registry
- **Purpose:** the 15 invariant principles.
- **Ownership:** root authority; no delegation.
- **Inputs:** principle records (`principleId`, statement, invariant flag).
- **Outputs:** appended propose-only principle records with verified hash + history.
- **Dependencies:** CGR-REG-base.
- **Acceptance:** closed 15-id space; statement immutable across versions; propose-only; append-only history intact; hash verified on read; root (no up-trace).

### CGR-REG-META — Meta-Constitution registry
- **Purpose:** the Meta-Constitution articles M-I..M-XII.
- **Ownership:** root authority.
- **Inputs:** article records with derivation references.
- **Outputs:** appended propose-only article records.
- **Dependencies:** CGR-REG-PRIN (read).
- **Acceptance:** each article traces to ≥1 existing principle; propose-only; append-only; hash verified.

### CGR-REG-GOV — Governance candidate + generation registry
- **Purpose:** store governance candidates and generation records (Wave-2 compiler proposes; Wave-1 stores only).
- **Ownership:** compiler runtime (future) proposes; this registry stores.
- **Inputs:** candidate records and generation records (with inputs hash, ruleset version).
- **Outputs:** appended **candidate-only** records (never ACTIVE).
- **Dependencies:** CGR-REG-PRIN/META (read).
- **Acceptance:** every candidate references a generation record; candidate-only; keyspace prefix `cg:governance:*` (collision-free with `control/governance/*`, which is PROHIBITED); up-trace to PRIN/META.

### CGR-REG-CENTER — Governance center registry
- **Purpose:** governance centers and their delegation graph.
- **Ownership:** root authority.
- **Inputs:** center records with delegation references.
- **Outputs:** appended propose-only center records.
- **Dependencies:** CGR-REG-base (+ PRIN up-trace).
- **Acceptance:** delegation graph acyclic; propose-only; append-only; hash verified.

### CGR-REG-DOMAIN — Domain constitution registry
- **Purpose:** domain constitutions bound to centers.
- **Ownership:** owning center.
- **Inputs:** domain records with a center reference.
- **Outputs:** appended propose-only domain records.
- **Dependencies:** CGR-REG-CENTER (read).
- **Acceptance:** center reference resolves to an existing center; up-trace to CENTER; propose-only; append-only.

### CGR-REG-POLICY — Policy registry (deny-by-default)
- **Purpose:** policies with default-deny effect.
- **Ownership:** owning domain.
- **Inputs:** policy records (effect defaulting to deny, rules).
- **Outputs:** appended propose-only policy records.
- **Dependencies:** CGR-REG-DOMAIN (read); deny-by-default pattern reused from `control/policy/policy-evaluator.ts` (not modified).
- **Acceptance:** absent/ambiguous ⇒ deny; up-trace to DOMAIN; propose-only; append-only.

### CGR-REG-CAP — Capability registry
- **Purpose:** capability declarations bound to domain + policy.
- **Ownership:** owning domain.
- **Inputs:** capability records with domain and policy references.
- **Outputs:** appended propose-only capability records.
- **Dependencies:** CGR-REG-DOMAIN + CGR-REG-POLICY (read).
- **Acceptance:** both references resolve; up-trace to DOMAIN/POLICY; propose-only; append-only.

### CGR-REG-CONSENT — Consent registry (revocable)
- **Purpose:** consent grants and revocations.
- **Ownership:** the consenting subject.
- **Inputs:** consent records (subject, grantee, scope, granted flag).
- **Outputs:** appended records; revocation is a new appended record (never physical delete).
- **Dependencies:** CGR-REG-base (+ CAP/POLICY up-trace).
- **Acceptance:** revoke = new appended record; append-only; hash verified; propose-only.

### CGR-REG-DECISION — Decision registry (separation of duties)
- **Purpose:** decision records with SoD enforcement.
- **Ownership:** the deciding body.
- **Inputs:** decision records (proposer, certifier, ratifier, subject reference, verdict).
- **Outputs:** appended propose-only decision records.
- **Dependencies:** CGR-REG-base; SoD pattern mirrored from `control/readiness/meta-governance-engine.ts` (not modified).
- **Acceptance:** proposer ≠ certifier ≠ ratifier; up-trace to subject; append-only.

### CGR-REG-TRACE — Trace registry (8 relations)
- **Purpose:** derivation edges — the traceability substrate.
- **Ownership:** the derivation author.
- **Inputs:** trace edges (from, to, relation, layer-from, layer-to).
- **Outputs:** appended propose-only edges (never removed).
- **Dependencies:** CGR-REG-base.
- **Acceptance:** `layerTo ≤ layerFrom`; no self-edge; relation ∈ the 8; append-only; hash verified.

### CGR-REG-AUDIT — Audit registry (hash-chained entry store)
- **Purpose:** store the hash-chained audit entries.
- **Ownership:** the audit runtime.
- **Inputs:** chained audit entries (from CGR-AU-CHAIN).
- **Outputs:** append-only chained entry store; seq is the version axis.
- **Dependencies:** CGR-REG-base, CGR-CORE-03; hashing delegated to CGR-AU-CHAIN.
- **Acceptance:** genesis-anchored; monotonic seq; append-only, no supersession; links every governed record.

Item — registries barrel closes the subtree with no symbol collision.

---

## E. Foundation Runtime Package

### Canonical hashing assembly (CGR-CORE-03)
Deterministic content addressing over the canonical (recursively key-sorted) form, excluding the content-hash field; verify-on-read. Routes exclusively through reused `canonicalize` + `sha256` from `control/federation/assertions.ts` (byte-identical to existing chains); no direct crypto import inside `…/cg/`. Acceptance: key-order independence; single-byte tamper ⇒ verify false; 64-char lowercase hex; no clock/randomness dependency.

### Append-only guard (CGR-CORE-02)
Semantic no-update / no-delete / supersession-by-linked-record layer over the reused `persistence-runtime/append-only-log.ts`. Every rejection is `E-APPEND-ONLY`, a new code extending the existing error base (`control/errors.ts`) — no new base class. Pure, no I/O. Acceptance: duplicate `(id,version)` rejected; no delete path; forged supersession rejected.

### Audit chain (CGR-AU-CHAIN)
Attributable, hash-chained append. First entry links to the 64-zero genesis; entry-hash construction identical to the reused federation/evolution/knowledge audit logs; entries frozen; deterministic export with head hash; monotonic seq. Reuse pattern verbatim; no new crypto, no new chain construction.

### Audit verifier (CGR-AU-VERIFY)
Pure, offline verification of an exported chain — recompute every entry hash, confirm seq continuity, prev-hash linkage, and head match. Four failure modes (seq gap, prev-hash break, entry tamper, head mismatch) each ⇒ fail-closed verdict. Does not import the live chain instance. An undetected tamper is a security escalation.

---

## F. Runtime Composition Package (CGR-CORE-04)

A single factory wires the eleven registries + the audit chain into one control seam; every registry write is mirrored to the audit chain. Assembly pattern reused from `control/bootstrap.ts` and the knowledge/simulation control assemblies; the metadata port is injected (`meta-core/ports.ts`); an optional deterministic clock seam is supported. Acceptance: one call yields a fully wired, isolated control; all registries reachable; write-to-audit mirroring verified; the composed control exposes only the public surface. The test harness (CGR-CORE-05) provides the deterministic in-memory fixtures for every suite.

---

## G. Export Package

- **Namespace barrel** (`…/cg/index.ts`) — exports the public surface only (control factory + shape, registry types, audit surfaces, the `E-APPEND-ONLY` code, the chain verifier). Internal helpers stay unexported.
- **Registries / audit barrels** — local barrels for the two subtrees.
- **EXTEND re-export** — append `export * as cg from "./constitutional-governance/index.ts";` to `control/index.ts`, mirroring the existing namespaced fabric exports; the `cg` alias guarantees collision-freedom.
- **EXTEND test glob** — widen the `package.json` `test` script to match `test/cg/**/*.test.ts` in addition to `test/*.test.ts`.

---

## H. Test Package

Runner: `node --test` (native `.ts`, Node v26). Suites under `test/cg/{core,registries,audit,system}/`.

**Unit suites:**
- CORE-01: type round-trip; ACTIVE-excluded proof.
- CORE-02: duplicate rejected; delete absent; forged-supersession rejected.
- CORE-03: stable hash; key-order independence; tamper ⇒ verify false.
- CORE-04: factory wires all 11 + audit; double-init isolation.
- CORE-05: fixture isolation; fixed-clock monotonicity.
- REG (each): propose/get/history/list; specialized validation; propose-only breach; append-only breach; SoD / acyclic / deny / layer-rule violations; order-independent hash; RG-1..8.
- AU-CHAIN: genesis link; monotonic seq; frozen entries.
- AU-VERIFY: intact ⇒ ok; gap / break / tamper / head-mismatch each ⇒ fail.

**Integration suites:**
- Registry write path exercises guard + hashing + audit emit through the metadata store round-trip.
- Composition: write mirrored to audit chain under a fixed clock ⇒ identical audit head.
- End-to-end lifecycle: propose principle → meta → center → domain → policy → capability → decision → trace → audit → export → verify.

**Non-regression suites:**
- Baseline assertion: the prior **443** tests remain green alongside Wave-1 additions.
- The `control/index.ts` re-export and the widened glob each add zero failures / zero collisions.
- Adversarial composite: tamper anywhere in the chain is detected.

---

## I. Reuse Package (all targets verified present)

| CGR component | Reuse target (`packages/platform-runtime/src/…`) | Binding kind | Prohibited reimplementation |
|---|---|---|---|
| CGR-CORE-01 | `contracts/types.ts`, `meta-core/ports.ts` | Reuse as-is | Redefine SemVer / registry-record shape |
| CGR-CORE-02 | `persistence-runtime/append-only-log.ts`; `control/errors.ts` | Wrap | New durable log; new error base |
| CGR-CORE-03 | `control/federation/assertions.ts`; `persistence-runtime/canonical.ts` | Reuse as-is | New hash/canonicalizer; direct crypto in `…/cg/` |
| CGR-CORE-04 | `control/bootstrap.ts`; knowledge/simulation assembly; `meta-core/ports.ts` | Adapter / compose | Fork bootstrap; new ports |
| CGR-CORE-05 | `registry-runtime/registry.ts`; `metadata-runtime/metadata-store.ts`; `control/audit-log.ts` | Reuse as-is | New in-memory registry/store |
| CGR-REG-base | `meta-core/ports.ts`; `meta-core/semver.ts` | Reuse as-is | New metadata storage; new semver |
| CGR-REG-GOV | `control/evolution/evolution-proposal.ts` | Pattern reuse | Touch `control/governance/*` |
| CGR-REG-DECISION | `control/readiness/meta-governance-engine.ts` | Pattern reuse | Modify readiness engine |
| CGR-REG-POLICY | `control/policy/policy-evaluator.ts` | Pattern reuse | Modify `control/policy/*` |
| CGR-REG-AUDIT | `control/audit-log.ts`; `persistence-runtime/append-only-log.ts` | Wrap | New audit sink |
| CGR-AU-CHAIN | `control/federation/federated-audit-log.ts`, `control/evolution/evolution-audit-log.ts`, `control/knowledge/knowledge-audit-log.ts`; `assertions.ts` | Extend / pattern reuse | New crypto; new chain construction |
| CGR-AU-VERIFY | the reused `static verify(...)` construction | Pattern reuse | New verification algorithm |

**Global prohibitions:** no new substrate, persistence layer, crypto, or registry infrastructure; no modification of any PROHIBITED path beyond the two EXTEND points. All PROHIBITED paths are import-only.

---

## J. Build Order (step-by-step, dependency-ordered)

No step precedes its dependencies.

```
 1. cg/types.ts                                   CGR-CORE-01   (leaf)
 2. cg/hashing.ts                                 CGR-CORE-03   ← 01
 3. cg/append-only.ts                             CGR-CORE-02   ← 01
 4. cg/test-harness.ts                            CGR-CORE-05   ← 01 (available to all suites)
 5. cg/registries/registry-base.ts               CGR-REG-base  ← 01,02,03
 6. cg/registries/principle-registry.ts          CGR-REG-PRIN  ← base
 7. cg/registries/meta-registry.ts               CGR-REG-META  ← PRIN
 8. cg/registries/governance-candidate-registry.ts CGR-REG-GOV ← PRIN,META
 9. cg/registries/center-registry.ts             CGR-REG-CENTER← PRIN
10. cg/registries/domain-registry.ts             CGR-REG-DOMAIN← CENTER
11. cg/registries/policy-registry.ts             CGR-REG-POLICY← DOMAIN
12. cg/registries/capability-registry.ts         CGR-REG-CAP   ← DOMAIN,POLICY
13. cg/registries/consent-registry.ts            CGR-REG-CONSENT← base
14. cg/registries/decision-registry.ts           CGR-REG-DECISION← base
15. cg/registries/trace-registry.ts              CGR-REG-TRACE ← base
16. cg/registries/audit-registry.ts              CGR-REG-AUDIT ← base,03
17. cg/registries/index.ts                        registries barrel
18. cg/audit/audit-chain.ts                       CGR-AU-CHAIN  ← REG-AUDIT,03
19. cg/audit/chain-verifier.ts                    CGR-AU-VERIFY ← AU-CHAIN
20. cg/audit/index.ts                             audit barrel
21. cg/governance-control.ts                      CGR-CORE-04   ← ALL above
22. cg/index.ts                                   namespace barrel
23. control/index.ts                              EXTEND re-export (append 1 line)
24. package.json                                  EXTEND test glob
25. test/cg/{core,registries,audit}/*.test.ts     unit + integration suites
26. test/cg/system/*.test.ts                      system + baseline non-regression
```

---

## K. Verification Gates (continuous, per step)

| Gate | Verified how |
|------|--------------|
| **Compile** | `tsc --noEmit -p tsconfig.json` after each file — strict, `noUncheckedIndexedAccess`, no `any` on public surfaces, explicit `.ts` extensions, no runtime-emitting syntax. |
| **Unit** | component suite green immediately after authoring. |
| **Determinism** | identical hash + audit head across repeated runs / machines; fixed-clock fixtures reproduce byte-identical exports. |
| **Append-only** | no update/delete path; every mutation attempt yields `E-APPEND-ONLY`. |
| **Traceability** | non-root records resolve up-trace; trace edges layer-valid, acyclic, 8-relation closed. |
| **Authority** | verifier detects all four failure modes; chain byte-identical to reused logs; genesis anchoring confirmed. |
| **Non-regression** | 443 baseline re-run green after each WBS package. |

---

## L. Completion Gates (blocking, fail-closed)

Wave-1 build is complete only when **all** hold:

1. All 18 component IDs build-complete and validated.
2. All verification gates (Section K) green.
3. `…/cg/**` and `test/cg/**` compile with zero errors under the repo tsconfig.
4. Total suite = **443 baseline + Wave-1 additions**, all green; zero baseline regressions.
5. Only the two EXTEND points touched outside the canonical root; no PROHIBITED path modified.
6. Namespace exported collision-free from `control/index.ts`; substrate inert (propose-only; no ACTIVE anywhere).
7. An exported audit chain round-trips through replay and independent verification to an identical head hash.

---

## M. Deliverables Matrix

| # | Deliverable | Path | Component | Bound gates |
|---|-------------|------|-----------|-------------|
| 1 | Shared schema | `cg/types.ts` | CORE-01 | Compile |
| 2 | Hashing | `cg/hashing.ts` | CORE-03 | Compile, Determinism |
| 3 | Append-only guard | `cg/append-only.ts` | CORE-02 | Compile, Append-only |
| 4 | Test harness | `cg/test-harness.ts` | CORE-05 | Compile |
| 5 | Registry base | `cg/registries/registry-base.ts` | REG-base | Compile, Append-only |
| 6–16 | Eleven registries | `cg/registries/*-registry.ts` | REG-PRIN..AUDIT | Compile, Unit, Traceability, Append-only |
| 17 | Registries barrel | `cg/registries/index.ts` | — | Compile |
| 18 | Audit chain | `cg/audit/audit-chain.ts` | AU-CHAIN | Compile, Determinism, Authority |
| 19 | Chain verifier | `cg/audit/chain-verifier.ts` | AU-VERIFY | Compile, Authority |
| 20 | Audit barrel | `cg/audit/index.ts` | — | Compile |
| 21 | Control assembly | `cg/governance-control.ts` | CORE-04 | Compile, Unit |
| 22 | Namespace barrel | `cg/index.ts` | CORE-04 | Compile |
| 23 | Re-export EXTEND | `control/index.ts` (append 1 line) | — | Compile, Non-regression |
| 24 | Test glob EXTEND | `package.json` | — | Non-regression |
| 25 | Unit + integration suites | `test/cg/{core,registries,audit}/*.test.ts` | all | Unit, Determinism, Append-only, Authority |
| 26 | System + non-regression suite | `test/cg/system/*.test.ts` | all | All gates |

---

## N. Build Risks

| Risk | Description | Mitigation (repository reality) |
|------|-------------|---------------------------------|
| R-1 Runtime-emitting syntax | `erasableSyntaxOnly` rejects `enum` / runtime `namespace` | Author enums as union-string / const-object forms (as in 0011); Compile gate catches immediately |
| R-2 Hash divergence | New canonicalizer or direct crypto breaks byte-identity | Bind CORE-03 + AU-CHAIN to `assertions.ts` only; Determinism + Authority gates |
| R-3 Barrel collision | `export *` could shadow generic fabric names | Use `export * as cg`; Non-regression gate verifies zero collision |
| R-4 Governance keyspace clash | CGR-REG-GOV vs existing `control/governance/*` | Prefix `cg:governance:*`; `control/governance/*` PROHIBITED (import-only) |
| R-5 Baseline regression | New suites / glob perturb 378/65 | Re-run 443 after each package; glob append-only; tsconfig unchanged |
| R-6 Non-determinism via clock | Wall-clock in a hashed/deterministic path | Inject `clock()` seam; fixed-clock fixtures; Determinism gate |
| R-7 Silent tamper miss | Verifier misses a tamper mode | Four-mode adversarial suite; undetected tamper = security escalation, halts Wave |
| R-8 Uncommitted inputs | Inputs 0003–0012 untracked; 0012A/0009 absent as discrete files | Commit authorized inputs + record the 0012B reconciliation before build start |

---

## O. Build Authorization Statement

On verified repository reality alone, the Wave-1 Constitutional Governance Runtime foundation substrate — the shared schema, canonical hashing, append-only guard, eleven propose-only registries over one shared base, hash-chained audit chain and verifier, composition layer, exports, and test suites — is authorized for construction under the single canonical root `packages/platform-runtime/src/control/constitutional-governance/`, following the 26-step dependency-ordered build above. All eighteen reuse targets are verified present; the toolchain already covers the new source and test trees; the non-regression floor is the verified 443/443 baseline; and all completion gates are blocking and fail-closed. Construction is strictly additive under the canonical root plus the two named EXTEND points, with every PROHIBITED path import-only. The build introduces no ACTIVE status, no new architecture, no doctrine, and no reasoning engines. No `governance-runtime` reference exists in this package.

---

**WAVE-1 BUILD AUTHORIZED**
