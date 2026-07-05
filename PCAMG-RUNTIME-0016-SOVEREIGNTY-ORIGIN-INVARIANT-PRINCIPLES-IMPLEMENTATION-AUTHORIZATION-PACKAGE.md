# PCAMG-RUNTIME-0016 — SOVEREIGNTY ORIGIN & INVARIANT PRINCIPLES — IMPLEMENTATION AUTHORIZATION PACKAGE

**Authority:** Constitutional Runtime Construction Authority
**Artifact Class:** Implementation Authorization Package
**Basis:** Verified repository reality only. No new architecture beyond existing doctrine; no code.
**Canonical Root:** `packages/platform-runtime/src/control/constitutional-governance/` (alias `…/cg/`). No `governance-runtime` reference appears anywhere in this package.

**Supreme Constitutional Doctrine (verified):** Sovereignty Origin **=** Invariant Principles (GD-0002 Article S-I; PCAMG-0002 Layer 0).

**Authority Flow (verified, GD-0002 §5 — downward derivation only, never the reverse):**
Sovereignty Origin → Invariant Principles → Meta-Constitution (PCAMG-1000) → Governance Generation (PCAMG-2000) → Polycentric Governance (PCAMG-3000) → Federated Domain Governance (PCAMG-4000) → Organizations → Implementations → Executions.

**Authoritative Inputs:** PCAMG-RUNTIME-0001, -0002, -0003, -0003A, -0004, -0005, -0006, -0007, -0008, -0010, -0011, -0012, -0012A, -0012B, -0013, -0014, -0015.

**Doctrine anchors (verified present in repository):** `architecture/pcamg/refoundation/GD-0001-GOVERNANCE-DOCTRINE.md`, `GD-0002-SOVEREIGNTY-ORIGIN-DOCTRINE.md`, `architecture/pcamg/PCAMG-0002-UNIVERSAL-PRINCIPLE-REGISTRY.md`, `architecture/pcamg/refoundation/PCAMG-7000-CONFLICT-RESOLUTION-FRAMEWORK.md`, and the runtime specification `architecture/pcamg/runtime/PCAMG-RUNTIME-0001-…-SPECIFICATION.md` (REG-PRIN Layer 0, §3.3 Supremacy, T-1/T-2/T-5 traceability).

---

## A. Executive Summary

This package authorizes the executable implementation of the **top of the authority flow**: the Sovereignty Origin and the Invariant Principles runtime layer, under the single canonical root. It does not introduce new architecture. It binds three already-verified doctrine sources — GD-0002 (Sovereignty Origin), PCAMG-0002 (the 15 invariant principles as Layer-0 records), and the runtime specification's supremacy and traceability rules — onto components already authorized in the construction chain:

- **Origin state (Wave-1, per 0013/0015):** CGR-REG-PRIN (the invariant principle registry) and CGR-REG-TRACE (derivation edges), backed by CGR-CORE-03 hashing, CGR-CORE-02 append-only guard, and CGR-AU-CHAIN audit — all propose-only, inert.
- **Principle-scoped reasoning (Wave-2, per 0012 as reconciled by 0012B to the canonical root):** the principle slice of CGR-AR-RESOLVE, CGR-AR-VALIDATE, CGR-AR-SUPREMACY, and CGR-TR-VERIFY / CGR-TR-GRAPH.

**Critical grounding constraint.** GD-0002 and PCAMG-0002 are marked **PROPOSED · NOT RATIFIED · NOT IMPLEMENTATION AUTHORIZED**. Therefore this package authorizes their construction **only as inert, propose-only registry state and side-effect-free read reasoning** — no ACTIVE status, no enrollment, no conferral of authority. Materializing the principle records as propose-only state does **not** constitute ratification or enrollment (which remains an Authority Board act under AUTH-012). This is fully consistent with the propose-only invariant of the Wave-1 substrate.

The layer is strictly additive over the verified **443/443** baseline and enforces the single non-inversion law of the whole corpus: authority flows downward from the principles and is only ever verified upward — **never the reverse**.

---

## B. Sovereignty Origin Runtime Definition

The Sovereignty Origin Runtime is **not a new component**. It is the enforcement seam formed by composing the invariant principle registry (the origin *state*) with the already-specified supremacy and validation engines (the origin *enforcement*). It encodes GD-0002 as runtime-checkable invariants:

| Doctrine (GD-0002) | Runtime realization (existing components) |
|--------------------|-------------------------------------------|
| S-I Origin — sovereignty originates solely from the invariant principles | CGR-REG-PRIN is the sole Layer-0 record set; every resolved authority chain must terminate at a principle record. |
| S-II Immutability of origin | Principle records are propose-only + append-only (RG-1/RG-2); amendment only by superseding record carrying an AUTH-012 reference (lifecycle §M). |
| S-III Derivation, not creation | CGR-AR-RESOLVE resolves only *derived* chains; a chain with no principle root does not resolve (fail-closed). |
| S-IV No sovereignty from execution | CGR-AR-VALIDATE denies any record asserting execution-origin authority (deny-by-default). |
| S-V No sovereignty from AI | CGR-AR-VALIDATE denies any record asserting machine-terminal or self-directed authority (PRIN-001/PRIN-015). |
| S-VI No sovereignty from organizations | CGR-AR-SUPREMACY treats organizations as delegates, never origins; an organizational record never outranks a principle. |
| G-1..G-6 Non-inversion guarantees | CGR-AR-SUPREMACY + CGR-TR-VERIFY enforce downward-only flow (T-2), origin fixity, and upward-only legitimacy verification (T-1). |

**Runtime obligations:** origin resolution always terminates at a principle; the three exclusions (S-IV/S-V/S-VI) are non-waivable deny-by-default validations; non-inversion is a total, deterministic ordering in which no tier outranks the principles.

---

## C. Invariant Principles Runtime Definition

The Invariant Principles Runtime is the specialization of the Wave-1 principle registry (CGR-REG-PRIN) to the fifteen Layer-0 records of PCAMG-0002:

| ID | Name | ID | Name |
|----|------|----|------|
| PCAMG-PRIN-001 | Human Sovereignty | PCAMG-PRIN-009 | Separation of Duties |
| PCAMG-PRIN-002 | Human Agency | PCAMG-PRIN-010 | Durability |
| PCAMG-PRIN-003 | Consent | PCAMG-PRIN-011 | Rights Protection |
| PCAMG-PRIN-004 | Transparency | PCAMG-PRIN-012 | Sustainability |
| PCAMG-PRIN-005 | Accountability | PCAMG-PRIN-013 | Federation Integrity |
| PCAMG-PRIN-006 | Auditability | PCAMG-PRIN-014 | Evolution Safety |
| PCAMG-PRIN-007 | Non-Coercion | PCAMG-PRIN-015 | Machine Alignment |
| PCAMG-PRIN-008 | Truth Preservation | | |

Each record carries the **nine mandated attributes** of the PCAMG-0002 record schema: UUID, Name, Description, Rationale, Constraints, Validation Rules, Compliance Rules, Amendment Rules, Audit Requirements. All records are stored propose-only (no ACTIVE), append-only, content-hashed, and audited. The registry admits exactly these fifteen IDs (closed id space, RG-enforced) and no sixteenth.

---

## D. Principle Registry Authorization

Authorized: **CGR-REG-PRIN** (already authorized structurally in 0013/0015), specialized here to the invariant-principle payload.

- **Purpose:** hold the fifteen Layer-0 invariant principle records as the sovereignty origin state.
- **Ownership:** root authority (the origin); no delegation; stewarded by the Authority Board but not originated by it (S-VI).
- **Inputs:** principle records conforming to the PCAMG-0002 nine-attribute schema, each with a fixed `PCAMG-PRIN-00N` id and permanent UUID.
- **Outputs:** appended propose-only principle records with verified content hash and complete history; an audit event per append/supersede.
- **Dependencies:** CGR-REG-base (RG-1..8), CGR-CORE-01 schema, CGR-CORE-02 guard, CGR-CORE-03 hashing, CGR-AU-CHAIN audit.
- **Acceptance criteria:** closed fifteen-id space (no addition/removal of ids); each record declares all nine attributes; statement/UUID immutable across versions; propose-only (no ACTIVE representable); append-only history intact; content hash verified on read; root (no up-trace required of principles themselves).

---

## E. Principle Identity Model

- **Logical id:** `PCAMG-PRIN-001..015` — a closed, immutable id space (fifteen exactly). No id may be created or retired at runtime.
- **Permanent UUID:** each record carries the permanent globally-unique UUID assigned in PCAMG-0002 (e.g. PRIN-001 = `5e1c4ebd-bb82-4984-b5e6-6e0e5e2c6529`); the UUID is immutable across all versions.
- **Version axis:** SemVer (`meta-core/semver.ts`); `(id, version)` is unique (RG-5).
- **Content identity:** deterministic content hash over the canonical form (RG-6; CGR-CORE-03) — structural equality yields an equal hash independent of key order.
- **Invariant:** id ↔ UUID binding is fixed for all time; a record whose id or UUID differs from the canonical binding is rejected.

---

## F. Principle Graph Model

- **Nodes:** the fifteen principle records.
- **Edges:** the "subsumes / anchors" derivation relations declared in PCAMG-0002 (e.g. PRIN-013 anchors `FED-*`; PRIN-015 anchors `INT-*`), plus inter-principle references (e.g. PRIN-007 references PRIN-002/PRIN-003), materialized as CGR-REG-TRACE edges using the eight canonical trace relations.
- **Structural rules (verified doctrine):** acyclic (T-5); downward-only authority flow (T-2, GD-0002 G-2); every non-principle artifact up-traces to ≥1 principle (T-1); no self-edge; `layerTo ≤ layerFrom`.
- **Realization:** the graph is projected read-only by CGR-TR-GRAPH over CGR-REG-TRACE; no principle graph is hardcoded — edges are registry records.

---

## G. Principle Classification Model

Classification is **read from the records themselves**, not invented:

- **By invariance class:** all fifteen are `invariant: true`, amendment-restricted (immutable except by Constitutional Majority + AUTH-012).
- **By subsumption anchor:** each principle declares the operational principle families it subsumes/anchors (the `Subsumes / anchors` field of PCAMG-0002), forming the classification linkage to `IP-*`, `INV-*`, `FED-*`, `KNOW-*`, `MEM-*`, etc.
- **By enforcement role:** derived from declared Constraints/Validation/Compliance attributes — e.g. sovereignty-terminal (PRIN-001), consent-gating (PRIN-003), audit-emitting (PRIN-006), SoD (PRIN-009), federation (PRIN-013), machine-alignment (PRIN-015).

The classification model adds no new taxonomy; it exposes the attributes each record already declares as read-only projections.

---

## H. Principle Resolution Runtime

Authorized as the **principle-scoped slice of CGR-AR-RESOLVE** (Wave-2; depends on Wave-1 origin state).

- **Purpose:** deterministically resolve the authority chain of a governance record up to its governing principle(s).
- **Inputs:** a governance record; read-only projections of the principle and trace registries.
- **Outputs:** a resolved, principle-terminated authority chain, or a fail-closed denial.
- **Invariants (verified from 0012 §C.1):** identical inputs yield byte-identical chains; resolution performs no mutation (zero writes); an incomplete or ambiguous chain never resolves to a partial result; a chain that does not terminate at a principle does not resolve (S-III).

---

## I. Principle Validation Runtime

Authorized as the **principle-scoped slice of CGR-AR-VALIDATE** (Wave-2).

- **Purpose:** validate a governance record against the non-waivable invariant principles and the sovereignty exclusions.
- **Inputs:** a governance record; the resolved chain from the resolution runtime; principle rule inputs projected read-only from CGR-REG-PRIN.
- **Outputs:** a deterministic principle verdict (pass / fail with cause), fail-closed.
- **Invariants (verified from 0012 §C.2):** no principle is skippable, overridable, or waivable; absence of evidence is denial (deny-by-default); the three exclusions S-IV/S-V/S-VI are enforced as non-waivable denials; verdicts are deterministic and side-effect free.

---

## J. Principle Supremacy Runtime

Authorized as the **principle-scoped slice of CGR-AR-SUPREMACY** (Wave-2), realizing the Layer-0 supremacy rule (runtime spec §3.3; PCAMG-1000 M-I).

- **Purpose:** on any conflict between an artifact and a registered invariant principle, **the principle prevails**; order competing resolved chains and select the supreme authority.
- **Inputs:** two or more resolved chains.
- **Outputs:** the supreme (principle-rooted) chain, or a fail-closed denial when supremacy is undecidable.
- **Invariants (verified from 0012 §C.3):** ordering is total and deterministic; a principle chain always outranks any lower-tier chain (non-inversion G-1/G-2); ties that cannot be broken canonically deny rather than pick arbitrarily; no chain is mutated. Failure modes (undecidable supremacy, incomparable chains, empty input) all deny.

---

## K. Principle Conflict Detection Runtime

Authorized as the conflict-detection responsibility already carried by CGR-AR-SUPREMACY (runtime spec §1 "conflict detection · supremacy enforcement"), grounded in the verified `PCAMG-7000 Conflict Resolution Framework`.

- **Purpose:** detect conflicts between a candidate artifact and any registered principle, and between competing chains, before supremacy arbitration.
- **Inputs:** resolved chains and principle validation verdicts.
- **Outputs:** a conflict set (empty when none), consumed by the supremacy runtime.
- **Invariants:** detection is deterministic and read-only; any detected principle conflict routes to supremacy arbitration where the principle prevails; an undetectable/ambiguous conflict is treated as a conflict (fail-closed), never silently ignored.

---

## L. Principle Traceability Runtime

Authorized as the **principle-scoped slice of CGR-TR-VERIFY / CGR-TR-GRAPH** (Wave-2) over CGR-REG-TRACE.

- **Purpose:** verify that every non-principle artifact traces upward to ≥1 invariant principle, and that the derivation structure is sound.
- **Inputs:** trace edges (read-only) and the artifact under verification.
- **Outputs:** a traceability verdict (complete up-trace / broken trace), fail-closed.
- **Invariants (verified doctrine):** T-1 complete up-trace to ≥1 principle; T-2 downward-only authority flow; T-5 acyclic; upward-only legitimacy verification (GD-0002 §5) — an unverifiable claim is void; verification is read-only and deterministic.

---

## M. Principle Lifecycle Model

- **States:** `proposed → superseded` only. **No ACTIVE** state exists in this layer (propose-only; Wave-3 activation is out of scope).
- **Amendment:** immutable except by a superseding record that references a Constitutional Majority + AUTH-012 decision (GD-0002 S-II; PCAMG-0002 Amendment Rules). Amendment may only strengthen principle sovereignty, never weaken or invert it (GD-0002 G-6).
- **Supersession:** by appended linked record (RG-4); the prior record is retained and moves to `superseded` by new appended state, never mutated or deleted.
- **Enrollment boundary:** materializing a principle record as propose-only state is **not** enrollment. Ratification/enrollment remains an Authority Board act; the runtime layer never confers it.

---

## N. Constitutional Binding Model

- **Binding law:** every governance artifact except the Layer-0 principles must bind upward to ≥1 invariant principle (T-1); the principles are the terminal binding target.
- **Meta-Constitution binding:** the Meta-Constitution (PCAMG-1000, CGR-REG-META) binds to the principles as its origin; M-I encodes the supremacy rule enforced by the supremacy runtime.
- **Downward-only conferral:** no tier grants authority to a peer or a tier above (GD-0002 §5); the binding model is verified by the traceability runtime, arbitrated by the supremacy runtime, and gated by the validation runtime.
- **Realization:** bindings are CGR-REG-TRACE records; the binding model is read-only projection + verification, never hardcoded.

---

## O. Runtime Directory Structure (directories only — no code)

All under the canonical root; principle-layer construction touches the registries + trace + the principle-scoped Wave-2 engines. No new directories beyond those already authorized by 0013/0015 (Wave-1) and 0012-as-reconciled-by-0012B (Wave-2).

```
packages/platform-runtime/src/control/constitutional-governance/     # CANONICAL ROOT
├── types.ts                                    # CGR-CORE-01  (principle schema: 9-attribute payload, closed id space)
├── hashing.ts                                  # CGR-CORE-03  (principle content hash)
├── append-only.ts                              # CGR-CORE-02  (principle append-only guard)
├── governance-control.ts                       # CGR-CORE-04  (composition, wires principle layer)
├── registries/
│   ├── principle-registry.ts                   # CGR-REG-PRIN  — Invariant Principles Runtime (Section C/D)
│   └── trace-registry.ts                       # CGR-REG-TRACE — Principle Graph edges (Section F)
├── authority/                                  # Wave-2 principle-scoped engines (canonical root, per 0012B)
│   ├── resolve.ts                              # CGR-AR-RESOLVE   — Principle Resolution Runtime (Section H)
│   ├── validate.ts                             # CGR-AR-VALIDATE  — Principle Validation Runtime (Section I)
│   └── supremacy.ts                            # CGR-AR-SUPREMACY — Supremacy + Conflict Detection (Sections J/K)
├── traceability/
│   ├── graph.ts                                # CGR-TR-GRAPH   — principle graph projection (Section F)
│   └── verify.ts                               # CGR-TR-VERIFY  — Principle Traceability Runtime (Section L)
└── reasoning/
    └── read-model.ts                           # read-only projection over principle + trace registries
```

```
packages/platform-runtime/test/cg/
├── registries/                                 # principle registry + trace suites
├── authority/                                  # resolve / validate / supremacy suites
├── traceability/                               # graph / verify suites
└── system/                                     # sovereignty-origin end-to-end + non-regression
```

No directory is created outside the canonical root and `test/cg/`. No `governance-runtime` directory is authorized. All PROHIBITED paths remain import-only.

---

## P. Runtime Test Authorization

| Suite | Coverage authorized |
|-------|---------------------|
| Principle registry | fifteen fixed ids admitted; sixteenth rejected; nine-attribute schema enforced; UUID/statement immutable; propose-only breach; append-only breach; hash verified on read |
| Principle graph | acyclic (T-5); no self-edge; `layerTo ≤ layerFrom`; eight-relation closed; up-trace to ≥1 principle (T-1) |
| Resolution | deterministic principle-terminated chains; incomplete chain ⇒ deny; zero writes |
| Validation | non-waivable principle checks; deny-by-default; exclusions S-IV/S-V/S-VI each ⇒ deny; deterministic verdicts |
| Supremacy | principle always outranks lower tiers; total deterministic ordering; undecidable tie ⇒ deny; no mutation |
| Conflict detection | artifact-vs-principle conflict detected; ambiguous ⇒ treated as conflict (fail-closed); routes to supremacy |
| Traceability | complete up-trace to ≥1 principle; downward-only flow (T-2); broken trace ⇒ deny; read-only |
| System | sovereignty-origin lifecycle (propose principle → derive meta → resolve → validate → supremacy → trace-verify → audit → export → verify); baseline non-regression; non-inversion adversarial (attempt upward/sideways conferral ⇒ deny) |

Runner: existing `node --test` convention under `test/cg/**/*.test.ts`. Harness: CGR-CORE-05.

---

## Q. Non-Regression Requirements

- **Baseline: 443 / 443** (platform-runtime 378 + contract-generator 65), verified. This is the floor.
- No principle-layer artifact may reduce, skip, or disable any existing test.
- Total = **443 baseline + principle-layer additions**, all green.
- The `control/index.ts` re-export and the widened test glob add zero failures / zero collisions.
- The stale "284" figure (Git `56a32d3`) is not a baseline.

---

## R. Acceptance Gates (blocking, fail-closed)

| Gate | Condition |
|------|-----------|
| **Origin** | every resolved authority chain terminates at a principle; no chain confers execution/AI/organization origin (S-IV/S-V/S-VI). |
| **Supremacy** | on any artifact-vs-principle conflict, the principle prevails; ordering total and deterministic; undecidable ⇒ deny. |
| **Non-inversion** | authority flows downward only; upward/sideways conferral impossible; verified by traceability + supremacy. |
| **Traceability** | complete up-trace to ≥1 principle (T-1); acyclic (T-5); downward-only (T-2). |
| **Propose-only** | no ACTIVE representable or conferrable; materialization is not enrollment. |
| **Determinism** | identical inputs ⇒ identical chains, verdicts, orderings, and hashes across runs/machines. |
| **TypeScript** | principle-layer files compile under the repo tsconfig; strict; no runtime-emitting syntax. |
| **Non-regression** | 443 baseline preserved. |

---

## S. Exit Criteria

1. CGR-REG-PRIN holds the fifteen invariant principle records (nine attributes each), propose-only, hash-verified.
2. CGR-REG-TRACE holds the principle graph edges; graph is acyclic and up-trace-complete.
3. The principle-scoped resolution, validation, supremacy, conflict-detection, and traceability runtimes pass all authorized suites, fail-closed.
4. All acceptance gates (Section R) green; 443 baseline preserved.
5. Only the canonical root and `test/cg/` are touched (plus the two standing EXTEND points); no `governance-runtime`; no PROHIBITED path modified.
6. No ACTIVE status anywhere; no enrollment performed; the sovereignty origin is enforced as downward-only and non-invertible.

---

## T. Deliverables Matrix

| # | Deliverable | Path | Component | Bound gates |
|---|-------------|------|-----------|-------------|
| 1 | Invariant principle records (15, 9-attribute) | `cg/registries/principle-registry.ts` | CGR-REG-PRIN | Origin, Propose-only, TS |
| 2 | Principle graph edges | `cg/registries/trace-registry.ts` | CGR-REG-TRACE | Traceability, TS |
| 3 | Principle resolution | `cg/authority/resolve.ts` | CGR-AR-RESOLVE | Origin, Determinism |
| 4 | Principle validation | `cg/authority/validate.ts` | CGR-AR-VALIDATE | Non-inversion, Determinism |
| 5 | Supremacy + conflict detection | `cg/authority/supremacy.ts` | CGR-AR-SUPREMACY | Supremacy, Non-inversion |
| 6 | Principle graph projection | `cg/traceability/graph.ts` | CGR-TR-GRAPH | Traceability |
| 7 | Principle traceability verify | `cg/traceability/verify.ts` | CGR-TR-VERIFY | Traceability, Non-inversion |
| 8 | Read-model projection | `cg/reasoning/read-model.ts` | reasoning | Determinism |
| 9 | Principle-layer test suites | `test/cg/{registries,authority,traceability,system}/*.test.ts` | all | All gates |

---

## U. Risks and Constraints

| Risk / Constraint | Description | Mitigation (repository reality) |
|-------------------|-------------|---------------------------------|
| RC-1 Doctrine not ratified | GD-0002 and PCAMG-0002 are PROPOSED · NOT RATIFIED · NOT IMPLEMENTATION AUTHORIZED | Build only as **propose-only inert state**; materialization ≠ enrollment; ratification stays an AUTH-012 Authority Board act |
| RC-2 Wave-2 dependency | Resolution/validation/supremacy/traceability are Wave-2 engines; require Wave-1 substrate first | Sequence: Wave-1 (0013/0015) origin state before principle-scoped Wave-2 engines (0012 as reconciled by 0012B) |
| RC-3 Non-inversion violation | A latent path could confer authority upward/sideways | Supremacy + traceability gates enforce downward-only; adversarial system suite attempts inversion and must be denied |
| RC-4 Hardcoded principles | Embedding principle literals would violate IP-01/IP-02 (registry-driven) | Principles are registry records; runtimes read projections only, never literals |
| RC-5 Id-space drift | Adding/removing a principle id at runtime | Closed fifteen-id space enforced by the registry; sixteenth rejected |
| RC-6 Determinism loss | Wall-clock/randomness in resolution or hashing | Injected clock seam; hashing via reused canonicalize+sha256; determinism gate |
| RC-7 Baseline regression | New suites perturb 378/65 | Re-run 443 after each package; tsconfig unchanged; glob append-only |
| RC-8 Uncommitted inputs | Inputs 0003–0012 untracked; 0012A/0009 absent as discrete files | Commit authorized inputs and record the 0012B reconciliation before construction |

---

## V. Formal Authorization Statement

On verified repository reality and existing doctrine alone, the Sovereignty Origin and Invariant Principles runtime layer is authorized for construction under the single canonical root `packages/platform-runtime/src/control/constitutional-governance/`. The layer materializes GD-0002 (Sovereignty Origin = Invariant Principles; three non-waivable exclusions; six non-inversion guarantees) and PCAMG-0002 (the fifteen Layer-0 principle records) onto components already authorized in the construction chain — CGR-REG-PRIN and CGR-REG-TRACE (Wave-1, propose-only) and the principle-scoped slices of CGR-AR-RESOLVE / CGR-AR-VALIDATE / CGR-AR-SUPREMACY and CGR-TR-VERIFY / CGR-TR-GRAPH (Wave-2). No new architecture is introduced; the resolution, validation, supremacy, conflict-detection, and traceability runtimes are read-only, deterministic, and fail-closed. Authority flows downward from the principles and is verified only upward — never the reverse. Construction is strictly additive over the verified 443/443 baseline, introduces no ACTIVE status, performs no enrollment, and touches no PROHIBITED path. No `governance-runtime` reference exists in this package.

---

**SOVEREIGNTY ORIGIN IMPLEMENTATION AUTHORIZED**
