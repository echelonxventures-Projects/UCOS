# PCAMG-RUNTIME-0013 — WAVE-1 IMPLEMENTATION AUTHORIZATION PACKAGE

**Authority:** Constitutional Runtime Construction Authority
**Artifact Class:** Implementation Authorization Package
**Basis:** Repository reality per PCAMG-RUNTIME-0012B. No new architecture, no doctrine, no code.
**Canonical CGR root (established by 0012B):** `packages/platform-runtime/src/control/constitutional-governance/` (alias `…/cg/`).

**Authoritative Inputs:** PCAMG-RUNTIME-0001, -0002, -0003, -0003A, -0004, -0005, -0006, -0007, -0008, -0010, -0011, -0012, -0012A, -0012B.

---

## A. Executive Summary

This package authorizes construction of the **Wave-1 Constitutional Governance Runtime (CGR) substrate** under the single canonical root ratified by 0012B: `packages/platform-runtime/src/control/constitutional-governance/`.

Wave 1 delivers the foundation only: the shared governance record schema, the append-only invariant guard, deterministic canonical hashing, eleven propose-only registries over one shared base, the hash-chained attributable audit append and its independent verifier, and the control assembly, runtime exports, and test harness that compose them. Everything binds to the existing `@ucos/platform-runtime` substrate **by import-and-compose**; nothing is reimplemented.

Two facts govern this authorization:

1. **Zero CGR code exists today** (0012B, confirmed). Wave 1 is entirely additive under the canonical root, plus exactly two EXTEND points.
2. **The reuse substrate is present and green.** All eighteen reuse targets named by PCAMG-RUNTIME-0011 were verified to exist in the working tree, and the baseline is **443/443 passing**.

Wave 1 is authorized to proceed on the conditions recorded in the Section N statement.

---

## B. Wave-1 Scope

**In scope (foundation substrate, propose-only, inert):**
- Shared governance record schema and enums (single type-truth for the namespace).
- Append-only guard enforcing no-update / no-delete / supersession-by-linked-record.
- Canonical hashing assembly (deterministic content addressing + verify-on-read).
- Eleven propose-only registries over one shared `ConstitutionalRegistry` base (registry rules RG-1..8).
- Hash-chained attributable audit append (authority chain write mechanism).
- Independent, offline audit chain verifier (gap / break / tamper / head-mismatch).
- Composition layer (single control assembly + factory).
- Runtime exports (namespace barrel + one namespaced re-export into `control/index.ts`).
- Test harness (deterministic in-memory fixtures) and the Wave-1 test suites.

**Explicitly out of scope (deferred):**
- Any ACTIVE status or activation path (`CGR-CP-ACTIVATE`) — Wave 3.
- Authority / compiler / traceability reasoning engines (CGR-AR-*, CGR-GC-*, CGR-TR-*) — Wave 2.
- Any modification to existing fabrics, persistence, crypto, or registry infrastructure.

**Component count:** 18 authored component IDs (5 core, 11 registries, 2 audit), materialized across the files enumerated in Section F, plus 2 EXTEND points.

---

## C. Canonical Root Authorization

The single authorized construction root is:

```
packages/platform-runtime/src/control/constitutional-governance/
```

- This is the root ratified by PCAMG-RUNTIME-0012B and independently confirmed absent in the working tree (nothing to migrate; documentation-only reconciliation already recorded).
- The pre-existing `packages/platform-runtime/src/control/governance/` fabric (single file `governance-registry.ts`) is a **PROHIBITED** target and shares no keyspace with the CGR namespace. The CGR governance registry uses the metadata prefix `cg:governance:*` to guarantee collision-freedom.
- The Wave-2 `governance-runtime/` naming from PCAMG-RUNTIME-0012 is superseded by this root; no directory of that name is authorized.
- Only two files outside the canonical root may be touched (the EXTEND points in Section F). All other trees are PROHIBITED.

---

## D. Wave-1 Component Inventory (authorized for implementation)

| # | Component ID | Element | Authorized |
|---|--------------|---------|:----------:|
| 1 | CGR-CORE-01 | Governance record schema & shared types/enums | ✅ |
| 2 | CGR-CORE-02 | Append-only guard (`E-APPEND-ONLY`) | ✅ |
| 3 | CGR-CORE-03 | Canonical hashing assembly (+ verify-on-read) | ✅ |
| 4 | CGR-CORE-04 | Composition layer (control assembly + factory + namespace barrel) | ✅ |
| 5 | CGR-CORE-05 | Test harness (deterministic fixtures, fixed clock) | ✅ |
| 6 | CGR-REG-base | Shared `ConstitutionalRegistry` base (RG-1..8) | ✅ |
| 7 | CGR-REG-PRIN | Principle registry (15 invariant principles) | ✅ |
| 8 | CGR-REG-META | Meta-Constitution registry (M-I..M-XII) | ✅ |
| 9 | CGR-REG-GOV | Governance candidate + generation record registry (candidate-only) | ✅ |
| 10 | CGR-REG-CENTER | Governance center registry (acyclic delegation) | ✅ |
| 11 | CGR-REG-DOMAIN | Domain constitution registry (bound to center) | ✅ |
| 12 | CGR-REG-POLICY | Policy registry (deny-by-default) | ✅ |
| 13 | CGR-REG-CAP | Capability registry (bound to domain + policy) | ✅ |
| 14 | CGR-REG-CONSENT | Consent registry (revocable, append-only) | ✅ |
| 15 | CGR-REG-DECISION | Decision registry (separation-of-duties) | ✅ |
| 16 | CGR-REG-TRACE | Trace registry (8 relations, layer rule) | ✅ |
| 17 | CGR-REG-AUDIT | Audit registry (hash-chained entry store) | ✅ |
| 18 | CGR-AU-CHAIN | Hash-chained attributable audit append (authority chain write) | ✅ |
| 19 | CGR-AU-VERIFY | Chain verifier (gap / break / tamper / head-mismatch) | ✅ |
| — | Runtime exports | Registries barrel, audit barrel, namespace barrel, `control/index.ts` re-export | ✅ |
| — | Test suites | core / registries / audit / system suites | ✅ |

All items are authorized as **propose-only, inert substrate**. No ACTIVE status is conferrable in Wave 1.

---

## E. Reuse Binding Matrix

All targets below were verified to exist in the working tree. Binding kind per PCAMG-RUNTIME-0011 §F.

| CGR component | Verified reuse target (`packages/platform-runtime/src/…`) | Binding kind | Prohibited reimplementation |
|---|---|---|---|
| CGR-CORE-01 | `contracts/types.ts`, `meta-core/ports.ts` | Reuse as-is (import types) | Redefining SemVer / registry-record shape |
| CGR-CORE-02 | `persistence-runtime/append-only-log.ts`; `control/errors.ts` | Wrap (semantic guard over the log) | New durable log; new error base |
| CGR-CORE-03 | `control/federation/assertions.ts` (sha256 + canonicalize); `persistence-runtime/canonical.ts` | Reuse as-is | New hash/canonicalizer; direct crypto import inside `…/cg/` |
| CGR-CORE-04 | `control/bootstrap.ts`; knowledge/simulation assembly pattern; `meta-core/ports.ts` | Adapter / compose | Forking bootstrap; new port definitions |
| CGR-CORE-05 | `registry-runtime/registry.ts`; `metadata-runtime/metadata-store.ts`; `control/audit-log.ts` | Reuse as-is (fixtures) | New in-memory registry / store |
| CGR-REG-base | `meta-core/ports.ts`; `meta-core/semver.ts` | Reuse as-is | New metadata storage; new semver |
| CGR-REG-GOV | `control/evolution/evolution-proposal.ts` (candidate pattern) | Pattern reuse | Touching `control/governance/*` |
| CGR-REG-DECISION | `control/readiness/meta-governance-engine.ts` (SoD pattern) | Pattern reuse | Modifying the readiness engine |
| CGR-REG-POLICY | `control/policy/policy-evaluator.ts` (deny-by-default pattern) | Pattern reuse | Modifying `control/policy/*` |
| CGR-REG-AUDIT | `control/audit-log.ts`; `persistence-runtime/append-only-log.ts` | Wrap | New audit sink surface |
| CGR-AU-CHAIN | `control/federation/federated-audit-log.ts`, `control/evolution/evolution-audit-log.ts`, `control/knowledge/knowledge-audit-log.ts`; `control/federation/assertions.ts` | Extend / pattern reuse | New crypto; new chain construction |
| CGR-AU-VERIFY | the `static verify(...)` construction in the reused audit logs | Pattern reuse | New verification algorithm |

**Global prohibitions:** no new substrate, no new persistence layer, no new crypto, no new registry infrastructure; no modification of any PROHIBITED path beyond the two EXTEND points.

---

## F. Directory Construction Package (directories/files only — no code)

```
packages/platform-runtime/
├── package.json                                     # EXTEND point 2: widen test glob to include test/cg/**/*.test.ts (append only)
├── src/
│   └── control/
│       ├── index.ts                                 # EXTEND point 1: append one namespaced re-export (export * as cg from "./constitutional-governance/index.ts")
│       └── constitutional-governance/               # CANONICAL ROOT — all NEW
│           ├── index.ts                             # CGR-CORE-04  namespace barrel (public surface only)
│           ├── types.ts                             # CGR-CORE-01  record schema, registry/relation enums, DTO/event shapes
│           ├── append-only.ts                       # CGR-CORE-02  append-only guard + E-APPEND-ONLY
│           ├── hashing.ts                           # CGR-CORE-03  canonical content hashing + verify-on-read
│           ├── governance-control.ts               # CGR-CORE-04  control assembly + factory
│           ├── test-harness.ts                     # CGR-CORE-05  deterministic fixtures + fixed clock
│           ├── registries/
│           │   ├── index.ts                         # registries barrel
│           │   ├── registry-base.ts                # CGR-REG-base  ConstitutionalRegistry (RG-1..8)
│           │   ├── principle-registry.ts           # CGR-REG-PRIN
│           │   ├── meta-registry.ts                # CGR-REG-META
│           │   ├── governance-candidate-registry.ts# CGR-REG-GOV  (prefix cg:governance:*)
│           │   ├── center-registry.ts              # CGR-REG-CENTER
│           │   ├── domain-registry.ts              # CGR-REG-DOMAIN
│           │   ├── policy-registry.ts              # CGR-REG-POLICY (deny-by-default)
│           │   ├── capability-registry.ts          # CGR-REG-CAP
│           │   ├── consent-registry.ts             # CGR-REG-CONSENT (revocable)
│           │   ├── decision-registry.ts            # CGR-REG-DECISION (SoD)
│           │   ├── trace-registry.ts               # CGR-REG-TRACE (8 relations)
│           │   └── audit-registry.ts               # CGR-REG-AUDIT (chained entry store)
│           └── audit/
│               ├── index.ts                         # audit barrel
│               ├── audit-chain.ts                  # CGR-AU-CHAIN
│               └── chain-verifier.ts               # CGR-AU-VERIFY
└── test/
    └── cg/                                          # NEW mirror test tree
        ├── core/                                    # CGR-CORE-* unit / determinism / adversarial
        ├── registries/                              # CGR-REG-* RG-1..8, append-only, propose-only, per-registry rules
        ├── audit/                                   # CGR-AU-* chain / tamper / gap / reorder / head-mismatch
        └── system/                                  # end-to-end lifecycle + baseline non-regression
```

**PROHIBITED targets (never create or modify):** `control/governance/*`, `control/policy/*`, `control/readiness/*`, `meta-core/*`, `registry-runtime/*`, `metadata-runtime/*`, `configuration-runtime/*`, `persistence-runtime/*`, `contracts/*`, all other `control/{federation,evolution,knowledge,memory,ontology,operations,simulation,identity,trust}/*`, and `.claude/authority/*`. Reuse of these is by import only.

---

## G. Component Responsibilities

Shared conventions apply to every component: ESM with explicit `.ts` import extensions; no I/O in constructors beyond reused adapter rehydration; every stored record frozen on write with defensive-copy getters; time supplied through an injected clock seam (never a bare wall-clock call in deterministic paths); errors extend the existing control/substrate error base (new codes only, no new base class); all hashing routes through the reused canonicalize + sha256 primitives.

### CGR-CORE-01 — Governance record schema & shared types
- **Purpose:** single type-truth for the namespace — the canonical governance-record envelope, the eleven-registry enum, the eight trace-relation enum, and the record-status set.
- **Inputs:** none (leaf); imports SemVer and related shapes from `contracts/types.ts` and the registry-record shape from `meta-core/ports.ts`.
- **Outputs:** the shared record/enum/DTO/event declarations consumed by every other Wave-1 component.
- **Dependencies:** none.
- **Invariants:** no ACTIVE status is representable in the status set (propose-only); the envelope is structurally compatible with a reused registry-record projection; no import from any PROHIBITED path.

### CGR-CORE-02 — Append-only guard
- **Purpose:** enforce that governance state only grows — reject update and delete; permit append and supersession-by-new-linked-record.
- **Inputs:** a candidate record and the existing record set for that identity.
- **Outputs:** either admission (no return value beyond success) or an `E-APPEND-ONLY` rejection with `{ id, version, attemptedOp }` detail.
- **Dependencies:** CGR-CORE-01; wraps `persistence-runtime/append-only-log.ts`; error base from `control/errors.ts`.
- **Invariants:** duplicate `(id, version)` rejected; no delete code path exists; supersession of a missing or already-superseded target rejected; guard is pure (no I/O); every rejection carries `E-APPEND-ONLY`.

### CGR-CORE-03 — Canonical hashing assembly
- **Purpose:** deterministic content addressing — stable hash over the canonical (recursively key-sorted) form of a record's hash-relevant fields, plus verify-on-read.
- **Inputs:** a record minus its content-hash field (for compute); a full record (for verify).
- **Outputs:** a 64-character lowercase hex hash; a boolean verification verdict.
- **Dependencies:** CGR-CORE-01; reuses `control/federation/assertions.ts` (canonicalize + sha256) so hashing is byte-identical to the existing audit chains; no direct crypto import inside `…/cg/`.
- **Invariants:** key-order independence (structural equality ⇒ equal hash); single-byte tamper ⇒ verify false; no dependency on clock or randomness.

### CGR-CORE-04 — Composition layer (control assembly + barrel)
- **Purpose:** compose the eleven registries and the audit chain into one control seam and expose the namespace's public surface.
- **Inputs:** assembly options — node identity, an injected metadata port, an optional deterministic clock.
- **Outputs:** a fully wired control exposing each registry and the audit chain; the namespace barrel.
- **Dependencies:** CGR-CORE-01/02/03, all eleven CGR-REG-*, CGR-AU-CHAIN; assembly/wiring pattern from `control/bootstrap.ts` and the knowledge/simulation control assemblies; metadata port from `meta-core/ports.ts`.
- **Invariants:** one factory call yields a fully wired, isolated control; every registry write is mirrored to the audit chain; the barrel exports the public surface only; the `control/index.ts` re-export introduces no symbol collision.

### CGR-CORE-05 — Test harness
- **Purpose:** deterministic governance test infrastructure — in-memory port factories, record fixtures, a fixed monotonic clock, and a baseline-pin helper.
- **Inputs:** optional fixture overrides.
- **Outputs:** an isolated control plus its metadata port and clock; deterministic sample records.
- **Dependencies:** CGR-CORE-01 (usable once CORE-03 exists); reuses `registry-runtime/registry.ts`, `metadata-runtime/metadata-store.ts`, and `control/audit-log.ts` for fixtures.
- **Invariants:** fixtures are isolated (no shared mutable state across calls); the fixed clock is deterministic and monotonic; the harness has zero production imports outside `…/cg/`.

### CGR-REG-base — Shared `ConstitutionalRegistry` base (RG-1..8)
- **Purpose:** one generic propose-only, append-only, hash-verified registry base that all eleven registries specialize.
- **Inputs:** registry type, injected metadata port, append-only guard, clock; per-operation record payloads.
- **Outputs:** propose / supersede / get / history / list behaviors; specialized validation is delegated to each concrete registry.
- **Dependencies:** CGR-CORE-01/02/03; metadata port + semver from `meta-core/*`; storage pattern referenced from `control/governance/governance-registry.ts` (not modified).
- **Invariants:** RG-1..8 enforced centrally (propose-only; append-only; content-hashed; supersession-by-link; versioned unique `(id,version)`; deterministic identity; traceable; auditable); no registry re-implements storage; complete, ordered history.

### CGR-REG-* (the eleven registries)
Each registry specializes the base with its own payload and validation. Shared responsibilities: inputs are registry-specific record payloads; outputs are appended propose-only records with verified content hashes and complete history; each write emits an audit event to CGR-AU-CHAIN; invariant of no conferrable ACTIVE status.

| Registry | Purpose | Registry-specific validation invariant | Up-trace |
|----------|---------|----------------------------------------|----------|
| PRIN | 15 invariant principles | closed principle id space; immutable statement once proposed | root |
| META | Meta-Constitution M-I..M-XII | each article traces to ≥1 existing principle | → PRIN |
| GOV | governance candidates + generation records | candidate-only (never ACTIVE); references a generation record | → PRIN/META |
| CENTER | governance centers | delegation graph acyclic | → PRIN |
| DOMAIN | domain constitutions | bound to an existing center | → CENTER |
| POLICY | policies | deny-by-default; absent/ambiguous ⇒ deny | → DOMAIN |
| CAP | capability declarations | bound to a resolvable domain + policy | → DOMAIN/POLICY |
| CONSENT | consent grants/revocations | revocation is a new appended record (never physical delete) | → CAP/POLICY |
| DECISION | decision records | separation of duties: proposer ≠ certifier ≠ ratifier | → subject |
| TRACE | derivation edges | `layerTo ≤ layerFrom`; no self-edge; relation ∈ the 8 | is the traceability substrate |
| AUDIT | hash-chained entry store | genesis-anchored; monotonic seq; delegates hashing to AU-CHAIN | links every governed record |

### CGR-AU-CHAIN — Hash-chained attributable append
- **Purpose:** the authority chain's write mechanism — append attributable, hash-chained audit entries for every governance act.
- **Inputs:** an audit act (actor, action, subject reference, timestamp via clock seam).
- **Outputs:** a frozen chained entry (with seq, prev-hash, entry-hash, node id); the full chain; a deterministic export with head hash.
- **Dependencies:** CGR-REG-AUDIT, CGR-CORE-03; construction pattern reused verbatim from the federation/evolution/knowledge audit logs; sha256 + canonicalize from `assertions.ts`.
- **Invariants:** the first entry links to the genesis hash (64 zeros); entry-hash construction is byte-identical to the reused chains; entries are frozen; seq is monotonic; export is deterministic.

### CGR-AU-VERIFY — Chain verifier
- **Purpose:** independent, offline verification of an exported chain.
- **Inputs:** an exported chain (node id, ordered entries, head hash).
- **Outputs:** a verdict — ok, or not-ok with a reason.
- **Dependencies:** CGR-AU-CHAIN (shapes only; does not import the live chain instance).
- **Invariants:** intact chain ⇒ ok; seq gap, prev-hash break, single-byte tamper, and head-hash mismatch each ⇒ not-ok with reason; verifier is pure and dependency-free; fail-closed.

---

## H. Test Authorization Package

Runner: existing repo `node --test` convention; suites added under `test/cg/**/*.test.ts` via EXTEND point 2. The following suites are authorized and required.

| Component | Unit | Integration | Determinism | Adversarial | Regression |
|-----------|------|-------------|-------------|-------------|------------|
| CORE-01 types | type round-trip; ACTIVE excluded | consumed by a registry fixture | — | ACTIVE construction is a compile-failure proof | baseline import adds 0 failures |
| CORE-02 guard | duplicate rejected; delete absent | registry write path uses guard | — | forged supersession of missing/superseded target | — |
| CORE-03 hashing | stable hash; key-order independence | hash set on write, verified on read | same record → same hash across runs/machines | single-byte tamper ⇒ verify false | — |
| CORE-04 assembly | factory wires all 11 + audit | write mirrored to audit chain | fixed clock ⇒ identical audit head | double-init isolation | `control/index.ts` export adds 0 collisions |
| CORE-05 harness | fixture isolation; fixed clock monotonic | used by every suite | deterministic fixtures | — | — |
| REG (each) | propose/get/history/list + specialized validation | metadata round-trip; audit emit | order-independent hash | append-only breach; SoD/acyclic/deny violations; propose-only breach | history intact after N appends |
| AU-CHAIN | genesis link; monotonic seq; frozen entries | wired from registry writes | identical chain+head for identical sequence | mutate exported entry then verify | matches reused construction |
| AU-VERIFY | intact ⇒ ok | verify a live-exported chain | deterministic verdict | gap, break, tamper, head-mismatch each ⇒ fail | — |

**System suite (required):** end-to-end lifecycle (propose principle → meta → center → domain → policy → capability → decision → trace → audit → export → verify); baseline non-regression (prior 443 still green alongside Wave-1 additions); adversarial composite (tamper anywhere in the chain is detected).

---

## I. Non-Regression Requirements

- **Actual baseline: 443 / 443 passing** (platform-runtime 378 + contract-generator 65), verified per 0012B. This is the non-regression floor.
- No Wave-1 artifact may reduce, skip, or disable any of the 443 existing tests.
- Total post-Wave-1 suite = **443 baseline + Wave-1 additions**, all green.
- The `control/index.ts` re-export and the `package.json` test-glob widening must each add **zero** failures and zero symbol collisions.
- The stale "284" figure in Git history (`56a32d3`) is retired and must not be used as the baseline.

---

## J. Acceptance Gates

All gates are **blocking** and **fail-closed**; a failed gate halts Wave-1 promotion.

| Gate | Condition |
|------|-----------|
| **TypeScript** | `…/cg/**` compiles under the repo TS config with zero errors; no `any` leakage on public surfaces; strict null checks satisfied. |
| **Test** | every Wave-1 suite passes; total = 443 + Wave-1 additions, all green; zero baseline regressions. |
| **Determinism** | content hash and audit head are identical across repeated runs and machines for identical inputs; fixed-clock fixtures reproduce byte-identical audit exports. |
| **Append-only** | no code path updates or deletes any registry record; every mutation attempt is `E-APPEND-ONLY`; supersession only via appended linked record. |
| **Traceability** | every non-root record resolves its up-trace reference; trace edges satisfy `layerTo ≤ layerFrom`, acyclic, 8-relation closed. |
| **Authority** | verifier detects gap / break / tamper / head-mismatch (all four); genesis anchoring confirmed; chain construction byte-identical to the reused audit logs; propose-only confirmed (no ACTIVE conferrable). |

---

## K. Exit Criteria

Wave 1 is complete when **all** of the following hold:

1. All 18 authored component IDs are build-complete and validated per Section D.
2. All six acceptance gates (Section J) are green.
3. The 443/443 baseline is preserved; total suite green including Wave-1 additions.
4. Only the two EXTEND points are touched outside the canonical root; no PROHIBITED path modified.
5. The namespace is exported collision-free from `control/index.ts`, and the CGR substrate is inert (propose-only; no ACTIVE anywhere).
6. An exported audit chain round-trips through replay and independent verification to an identical head hash.

---

## L. Wave-2 Enablement Criteria

Wave 2 (authority / compiler / traceability reasoning engines) may be authorized only after **all** exit criteria (Section K) are met, plus:

1. **Read-model surface available.** The eleven registries expose stable read/history/list projections for a read-only reasoning layer.
2. **Deterministic hashing available.** CGR-CORE-03 is proven deterministic and reusable by the compiler determinism requirement.
3. **Append/guard/audit available.** The append-only guard, CGR-REG-GOV candidate registry, and the hash-chained audit are present and green, ready to back authorized candidate-only generation.
4. **Reuse seams present.** Ontology graph traversal, evolution and simulation impact analyzers, and `control/errors.ts` remain importable (verified present) for the Wave-2 traceability and compiler dependencies.
5. **0012 reconciled to the canonical root.** All Wave-2 references target `…/cg/{authority,compiler,traceability,reasoning}/` under the canonical root — never `governance-runtime/`.

Until these hold, Wave 2 remains SPECIFIED_ONLY and is not constructible.

---

## M. Implementation Backlog (dependency-ordered)

No item precedes its dependencies. Order follows the verified Wave-1 dependency graph.

| # | Backlog item | Component | Deliverable | Gate to clear |
|---|--------------|-----------|-------------|---------------|
| 1 | Namespace dir + shared types/enums | CGR-CORE-01 | `cg/types.ts` | TS |
| 2 | Canonical hashing + verify-on-read | CGR-CORE-03 | `cg/hashing.ts` | TS, Determinism |
| 3 | Append-only guard + `E-APPEND-ONLY` | CGR-CORE-02 | `cg/append-only.ts` | TS, Append-only |
| 4 | Test harness (fixtures, fixed clock) | CGR-CORE-05 | `cg/test-harness.ts` | TS |
| 5 | Registry base (RG-1..8) | CGR-REG-base | `cg/registries/registry-base.ts` | TS, Append-only |
| 6 | Principle registry | CGR-REG-PRIN | `cg/registries/principle-registry.ts` | TS, Test |
| 7 | Meta-Constitution registry | CGR-REG-META | `cg/registries/meta-registry.ts` | TS, Traceability |
| 8 | Governance candidate + generation registry | CGR-REG-GOV | `cg/registries/governance-candidate-registry.ts` | TS, Test |
| 9 | Center registry (acyclic delegation) | CGR-REG-CENTER | `cg/registries/center-registry.ts` | TS, Test |
| 10 | Domain registry (bound to center) | CGR-REG-DOMAIN | `cg/registries/domain-registry.ts` | TS, Traceability |
| 11 | Policy registry (deny-by-default) | CGR-REG-POLICY | `cg/registries/policy-registry.ts` | TS, Test |
| 12 | Capability registry (domain + policy) | CGR-REG-CAP | `cg/registries/capability-registry.ts` | TS, Traceability |
| 13 | Consent registry (revocable) | CGR-REG-CONSENT | `cg/registries/consent-registry.ts` | TS, Append-only |
| 14 | Decision registry (SoD) | CGR-REG-DECISION | `cg/registries/decision-registry.ts` | TS, Test |
| 15 | Trace registry (8 relations, layer rule) | CGR-REG-TRACE | `cg/registries/trace-registry.ts` | TS, Traceability |
| 16 | Audit registry (chained entry store) | CGR-REG-AUDIT | `cg/registries/audit-registry.ts` | TS, Append-only |
| 17 | Registries barrel | — | `cg/registries/index.ts` | TS |
| 18 | Audit chain (append + hash) | CGR-AU-CHAIN | `cg/audit/audit-chain.ts` | TS, Determinism, Authority |
| 19 | Chain verifier (gap/break/tamper/head) | CGR-AU-VERIFY | `cg/audit/chain-verifier.ts` | TS, Authority |
| 20 | Audit barrel | — | `cg/audit/index.ts` | TS |
| 21 | Control assembly + factory | CGR-CORE-04 | `cg/governance-control.ts` | TS, Test |
| 22 | Namespace barrel | CGR-CORE-04 | `cg/index.ts` | TS |
| 23 | EXTEND: namespaced re-export | — | `control/index.ts` (append 1 line) | TS, Test |
| 24 | EXTEND: test glob | — | `packages/platform-runtime/package.json` | Test |
| 25 | Core/registries/audit test suites | all | `test/cg/{core,registries,audit}/*.test.ts` | Test, Determinism, Append-only, Authority |
| 26 | System + baseline non-regression suite | all | `test/cg/system/*.test.ts` | All gates |

**Done-definition:** items 1–26 complete; all six exit gates green; 443/443 preserved; only the two EXTEND points touched outside the canonical root.

---

## N. Formal Authorization Statement

On repository reality alone (0012B), the Wave-1 Constitutional Governance Runtime substrate is authorized for construction under the single canonical root `packages/platform-runtime/src/control/constitutional-governance/`. All eighteen reuse targets are verified present, the non-regression floor is the verified 443/443 baseline, the component inventory and dependency-ordered backlog are fixed, and all six acceptance gates are blocking and fail-closed. Construction is strictly additive under the canonical root plus the two named EXTEND points; every PROHIBITED path is import-only. Wave 1 introduces no ACTIVE status, no new architecture, no new doctrine, and no reasoning engines. Wave-2 authorization is contingent on the Section L enablement criteria.

---

**WAVE-1 IMPLEMENTATION AUTHORIZED**
