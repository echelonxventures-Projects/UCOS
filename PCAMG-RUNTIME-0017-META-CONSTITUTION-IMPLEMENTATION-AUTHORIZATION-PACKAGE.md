# PCAMG-RUNTIME-0017 — META-CONSTITUTION — IMPLEMENTATION AUTHORIZATION PACKAGE

**Authority:** Constitutional Runtime Construction Authority
**Artifact Class:** Implementation Authorization Package
**Basis:** Verified repository reality only. Existing doctrine only. No new constitutional theory, no new architecture, no implementation code, no pseudocode, no TypeScript, no SQL, no APIs.
**Canonical Root:** `packages/platform-runtime/src/control/constitutional-governance/` (alias `…/cg/`). No `governance-runtime` reference appears anywhere in this package.

**Supreme Constitutional Doctrine (verified):** Sovereignty Origin **=** Invariant Principles (GD-0002 Article S-I; PCAMG-0002 Layer 0). Therefore **Principles > Constitutions**, and never the reverse.

**Authority Flow (verified, GD-0002 §5 — downward derivation only, never the reverse):**
Sovereignty Origin → Invariant Principles → **Meta-Constitution (PCAMG-1000)** → Governance Generation (PCAMG-2000) → Polycentric Governance (PCAMG-3000) → Federated Domain Governance (PCAMG-4000) → Organizations → Implementations → Executions.

**Authoritative Inputs:** GD-0002-SOVEREIGNTY-ORIGIN-DOCTRINE; PCAMG-0002-UNIVERSAL-PRINCIPLE-REGISTRY; PCAMG-RUNTIME-0001, -0002, -0003, -0003A, -0004, -0005, -0006, -0007, -0008, -0010, -0011, -0012, -0012A, -0012B, -0013, -0014, -0015, -0016.

**Doctrine anchors (verified present in repository):** `architecture/pcamg/refoundation/GD-0002-SOVEREIGNTY-ORIGIN-DOCTRINE.md` (§5 flow; Articles S-I..S-VI; guarantees G-1..G-6); `architecture/pcamg/refoundation/PCAMG-1000-META-CONSTITUTION.md` (Articles M-I..M-XII; meta-invariants MI-1..MI-8; §4 lifecycle); `architecture/pcamg/PCAMG-0003-META-CONSTITUTION.md` (foundation Articles M-I..M-XII, re-issued by PCAMG-1000); `architecture/pcamg/PCAMG-0002-UNIVERSAL-PRINCIPLE-REGISTRY.md` and `architecture/pcamg/refoundation/PCAMG-0000-INVARIANT-PRINCIPLES-REGISTRY.md` (the fifteen Layer-0 records); `architecture/pcamg/refoundation/PCAMG-7000-CONFLICT-RESOLUTION-FRAMEWORK.md`; and the runtime specification `architecture/pcamg/runtime/PCAMG-RUNTIME-0001-CONSTITUTIONAL-GOVERNANCE-RUNTIME-SPECIFICATION.md` (REG-META Layer 1 §201; VR-M* §563; T-1/T-2/T-5 traceability; §3.3 supremacy).

**Predecessor grounding:** PCAMG-RUNTIME-0016 authorized the layer directly above this one — the Sovereignty Origin and the fifteen Invariant Principle records (CGR-REG-PRIN, CGR-REG-TRACE, and the principle-scoped Wave-2 engines). This package authorizes the **next tier down**: the Meta-Constitution (PCAMG-1000), which derives from — and is bounded by — those principles.

---

## A. Executive Summary

This package authorizes the executable implementation of the **Meta-Constitution layer** — the constitution *of constitutions* (PCAMG-1000) — under the single canonical root. It introduces no new architecture. It binds three already-verified doctrine sources — GD-0002 (the Sovereignty Origin the Meta-Constitution derives from), PCAMG-1000 (Articles M-I..M-XII and meta-invariants MI-1..MI-8), and the runtime specification's REG-META schema, supremacy, and traceability rules — onto components already authorized in the construction chain:

- **Meta state (Wave-1, per 0013/0015):** **CGR-REG-META** (the Meta-Constitution article registry, M-I..M-XII), depending on **CGR-REG-PRIN** (read) for principle up-trace, with **CGR-REG-TRACE** carrying the derivation edges, backed by CGR-CORE-03 hashing, CGR-CORE-02 append-only guard, and CGR-AU-CHAIN audit — all propose-only, inert.
- **Meta-scoped reasoning (Wave-2, per 0012 as reconciled by 0012B to the canonical root):** the constitution slice of CGR-AR-RESOLVE, CGR-AR-VALIDATE, CGR-AR-SUPREMACY, and CGR-TR-VERIFY / CGR-TR-GRAPH.

**The single proof this package establishes.** Every Meta-Constitution article is a *derived* artifact whose legitimacy is only ever verified by tracing **upward to ≥1 invariant principle**. Article M-I (Principle Supremacy) and M-VIII (Amendment) are themselves realized as records that the supremacy and validation runtimes enforce **against** the principles: on any conflict between a constitution and a principle, the principle prevails and the constitutional artifact is rejected or escalated. This is the runtime encoding of **Principles > Constitutions**, and it is non-invertible.

**Critical grounding constraint.** GD-0002, PCAMG-0002/PCAMG-0000, and PCAMG-1000 are all marked **PROPOSED · NOT RATIFIED · NOT IMPLEMENTATION AUTHORIZED**. Therefore this package authorizes construction of the Meta-Constitution **only as inert, propose-only registry state and side-effect-free read reasoning** — no ACTIVE status, no enrollment, no conferral of authority. Materializing the twelve article records as propose-only state does **not** constitute ratification or enrollment (which remains an Authority Board act under AUTH-012, M-VIII). This is fully consistent with the propose-only invariant of the Wave-1 substrate.

**Repository reality note.** The canonical root `packages/platform-runtime/src/control/constitutional-governance/` is **not yet materialized on disk**; it is authorized-but-unbuilt in the construction chain (0013/0015 Wave-1; 0012-as-reconciled-by-0012B Wave-2). This package authorizes the Meta-Constitution specialization onto those components in dependency order after the substrate is materialized. The separate path `control/governance/governance-registry.ts` is PROHIBITED and untouched.

The layer is strictly additive over the verified **443 / 443** baseline and enforces the single non-inversion law of the whole corpus: authority flows downward from the principles to the Meta-Constitution and is only ever verified upward — **never the reverse**.

---

## B. Meta-Constitution Runtime Definition

The Meta-Constitution Runtime is **not a new component**. It is the enforcement seam formed by composing the Meta-Constitution article registry (the constitutional *state*) with the already-specified resolution, validation, and supremacy engines (the constitutional *enforcement*), all operating strictly beneath the Invariant Principles. It encodes PCAMG-1000 as runtime-checkable invariants:

| Doctrine (PCAMG-1000) | Runtime realization (existing components) |
|-----------------------|-------------------------------------------|
| M-I Principle Supremacy | CGR-AR-SUPREMACY: on any article-vs-principle conflict, the principle prevails and the article is rejected/escalated; the Meta-Constitution never outranks a principle. |
| M-II Derivation of Authority (void-without-derivation) | CGR-AR-RESOLVE + CGR-TR-VERIFY: an article whose derivation chain does not terminate at a registered principle is **void** (fail-closed). |
| M-III No Sovereignty From Execution/AI/Organizations | CGR-AR-VALIDATE: the three GD-0002 exclusions (S-IV/S-V/S-VI) are non-waivable denials at the meta level. |
| M-IV Governance Is Generated, Not Privileged | CGR-REG-META records carry a principle-derivation reference; no article is self-declared or hardcoded (IP-01/IP-02). |
| M-V Polycentric Authority | Bindings are trace records; no meta record confers absolute or terminal authority; Authority Board escalation is a PRIN-001 delegation (S-VI). |
| M-VI Determinism & Non-Ambiguity | Resolution, validation, supremacy, and hashing are deterministic; identical inputs yield identical results (INV-6). |
| M-VII Conflict Resolution | CGR-AR-SUPREMACY applies the PCAMG-7000 deterministic ordering; higher-derivation prevails; principles prevail over everything. |
| M-VIII Amendment | Lifecycle model (Section M): amend only by superseding record referencing Constitutional Majority + AUTH-012; never in a direction violating M-I/M-II/M-III. |
| M-IX Legitimacy & Consent | Binding model (Section G) treats an unverifiable/illegitimate article as void. |
| M-X Compliance-Gated Activation | No ACTIVE representable in this layer; activation is out of scope (Wave-3); propose-only enforced. |
| M-XI Auditability & Traceability | CGR-AU-CHAIN emits an immutable audit event per append/supersede; CGR-TR-VERIFY enforces complete derivation trace. |
| M-XII Reconciliation With the Ratified Corpus | Materialization is propose-only and non-enrolling; `UCOS-CONST-001` reframing remains an AUTH-012 Authority Board act, unaffected by construction. |

**Runtime obligations:** every article resolves upward to ≥1 principle; the three exclusions remain non-waivable at the meta level; principle supremacy is a total, deterministic ordering in which no article — including M-I itself — outranks the principles.

---

## C. Constitutional Identity Model

- **Logical id:** `M-I … M-XII` — a closed, immutable article id space (twelve exactly, per PCAMG-1000 §3 and PCAMG-0003). No article id may be created or retired at runtime; a thirteenth is rejected.
- **Registry field:** each record carries the `article` identifier (`M-I`..`M-XII`) mandated by the REG-META schema (runtime spec §201).
- **Permanent UUID:** each article record carries a permanent globally-unique UUID; the UUID is immutable across all versions of that article.
- **Version axis:** SemVer (`meta-core/semver.ts`); `(id, version)` is unique (RG-5).
- **Content identity:** deterministic content hash over the canonical form (RG-6; CGR-CORE-03) — structural equality yields an equal hash independent of key order.
- **Invariant:** the `article` ↔ UUID binding is fixed for all time; a record whose article id or UUID differs from the canonical binding is rejected. An article record with no `principle_derivation` is void (M-II).

---

## D. Constitutional Registry Authorization

Authorized: **CGR-REG-META** (already authorized structurally in 0013/0015 §D), specialized here to the twelve Meta-Constitution article records of PCAMG-1000.

- **Purpose:** hold Articles M-I..M-XII as the Layer-1 constitutional state derived from the Layer-0 principles.
- **Ownership:** root authority (derived, never originating); stewarded by the Authority Board but not originated by it (GD-0002 S-VI).
- **Inputs:** article records conforming to the REG-META schema (runtime spec §201) — `article`, `article_name`, `article_text`, `governs`, `principle_derivation[]` (→ `PCAMG-PRIN-*` UUIDs), `amendment_rules` — each with a fixed `M-*` id and permanent UUID.
- **Outputs:** appended propose-only article records with verified content hash and complete history; an audit event per append/supersede (CGR-AU-CHAIN).
- **Dependencies:** CGR-REG-base (RG-1..8), CGR-REG-PRIN (read, for derivation resolution), CGR-CORE-01 schema, CGR-CORE-02 guard, CGR-CORE-03 hashing, CGR-AU-CHAIN audit.
- **Acceptance criteria (verified from 0015 §D CGR-REG-META):** each article traces to ≥1 existing principle; closed twelve-id space (no addition/removal of article ids); article id/UUID immutable across versions; propose-only (no ACTIVE representable); append-only history intact; content hash verified on read.

---

## E. Constitutional Graph Model

- **Nodes:** the twelve article records (M-I..M-XII).
- **Edges:** the `principle_derivation` references of each article (article → ≥1 `PCAMG-PRIN-*`), plus any inter-article reference declared in PCAMG-1000 (e.g. M-VIII references M-I/M-II/M-III as amendment bounds; M-III references GD-0002 S-IV/S-V/S-VI), materialized as CGR-REG-TRACE edges using the eight canonical trace relations.
- **Structural rules (verified doctrine):** acyclic (T-5); downward-only authority flow (T-2, GD-0002 G-2) — every edge points from the constitution *up* to the principle it derives from, and authority is only conferred downward; every article up-traces to ≥1 principle (T-1); no self-edge; `layerTo ≤ layerFrom` (Layer 1 → Layer 0).
- **Realization:** the graph is projected read-only by CGR-TR-GRAPH over CGR-REG-TRACE; no constitutional graph is hardcoded — edges are registry records (M-IV).

---

## F. Constitutional Classification Model

Classification is **read from the article records themselves**, not invented:

- **By governance target:** each article declares what it `governs` (REG-META schema) — e.g. supremacy (M-I), derivation (M-II), exclusions (M-III), generation (M-IV), polycentrism (M-V), interpretation (M-VI), conflict (M-VII), amendment (M-VIII), legitimacy/consent (M-IX), activation (M-X), audit/trace (M-XI), reconciliation (M-XII).
- **By amendment class:** derived from `amendment_rules` — articles amendable only by Constitutional Majority + AUTH-012; M-I/M-II/M-III additionally strengthen-only (never amendable to weaken principle sovereignty).
- **By meta-invariant linkage:** each article maps to the non-waivable meta-invariants it anchors (MI-1..MI-8 of PCAMG-1000 §5) — e.g. M-I→MI-1, M-II→MI-2, M-III→MI-3, M-IV→MI-4, M-VI→MI-5, M-VIII→MI-6, M-X→MI-7, M-XI→MI-8.

The classification model adds no new taxonomy; it exposes the attributes each article already declares as read-only projections.

---

## G. Constitutional Binding Model

Defines how constitutions bind to the **Sovereignty Origin** and the **Invariant Principles**.

- **Binding target:** every Meta-Constitution article binds **upward** to ≥1 invariant principle (T-1); the principles (the Sovereignty Origin, GD-0002 S-I) are the terminal binding target. An article with no principle binding is void (M-II).
- **Binding to the Sovereignty Origin:** the exclusions article M-III binds directly to GD-0002 S-IV/S-V/S-VI (no sovereignty from execution/AI/organizations); the supremacy article M-I binds to the origin-fixity guarantee G-1; the derivation article M-II binds to S-III (derivation, not creation).
- **Binding to the Invariant Principles:** each article's `principle_derivation[]` references the permanent UUIDs of the specific `PCAMG-PRIN-*` records it derives from (e.g. M-IX → PRIN-003 Consent / PRIN-007 Non-Coercion; M-XI → PRIN-004 Transparency / PRIN-006 Auditability; M-V → PRIN-001 Human Sovereignty).
- **Downward-only conferral:** the Meta-Constitution confers derived, bounded authority on the tiers below it (PCAMG-2000..4000); it never grants authority to a peer, to the principles above it, or to itself as an origin (GD-0002 §5). The Meta-Constitution is bound *by* the principles, not a source of them.
- **Non-inversion:** on any conflict between an article and a principle, the principle prevails (M-I) — the binding is verified by CGR-TR-VERIFY, arbitrated by CGR-AR-SUPREMACY, and gated by CGR-AR-VALIDATE, all of which treat the principle as strictly superior. **Principles > Constitutions**, enforced as a total ordering, never invertible.
- **Realization:** bindings are CGR-REG-TRACE records; the binding model is read-only projection + verification, never hardcoded.

---

## H. Constitutional Resolution Runtime

Authorized as the **constitution-scoped slice of CGR-AR-RESOLVE** (Wave-2; depends on Wave-1 meta + principle state).

- **Purpose:** deterministically resolve the authority chain of a Meta-Constitution article up to its governing principle(s).
- **Inputs:** an article record; read-only projections of the meta, principle, and trace registries.
- **Outputs:** a resolved, principle-terminated authority chain, or a fail-closed denial.
- **Invariants (verified from 0012 §C.1):** identical inputs yield byte-identical chains; resolution performs no mutation (zero writes); an incomplete or ambiguous chain never resolves to a partial result; an article chain that does not terminate at a principle does not resolve (M-II / GD-0002 S-III).

---

## I. Constitutional Validation Runtime

Authorized as the **constitution-scoped slice of CGR-AR-VALIDATE** (Wave-2), realizing the VR-M* Meta-Constitution conformance rules (runtime spec §563).

- **Purpose:** validate a Meta-Constitution article (and any artifact claiming meta-conformance) against the non-waivable principles, the sovereignty exclusions, and the VR-M* rules.
- **Inputs:** an article record; the resolved chain from the resolution runtime; principle rule inputs projected read-only from CGR-REG-PRIN.
- **Outputs:** a deterministic constitutional verdict (pass / fail with cause), fail-closed.
- **Invariants (verified from 0012 §C.2; VR-M1):** an article not derived from ≥1 principle fails (VR-M1); no principle check is skippable, overridable, or waivable; absence of evidence is denial (deny-by-default); the three exclusions S-IV/S-V/S-VI are enforced as non-waivable denials at the meta level (M-III); verdicts are deterministic and side-effect free.

---

## J. Constitutional Supremacy Runtime

Authorized as the **constitution-scoped slice of CGR-AR-SUPREMACY** (Wave-2), realizing Article M-I and the Layer-0 supremacy rule (runtime spec §3.3; PCAMG-1000 M-I; PCAMG-7000).

- **Purpose:** on any conflict between a Meta-Constitution article (or any lower artifact) and a registered invariant principle, **the principle prevails**; among competing constitutional chains, the higher-derivation chain prevails (M-VII).
- **Inputs:** two or more resolved chains.
- **Outputs:** the supreme (principle-rooted) chain, or a fail-closed denial when supremacy is undecidable.
- **Invariants (verified from 0012 §C.3):** ordering is total and deterministic; a principle chain always outranks any constitutional chain — including one rooted in M-I itself (non-inversion G-1/G-2; **Principles > Constitutions**); ties that cannot be broken canonically deny rather than pick arbitrarily; no chain is mutated. Failure modes (undecidable supremacy, incomparable chains, empty input) all deny.

---

## K. Constitutional Conflict Detection Runtime

Authorized as the conflict-detection responsibility already carried by CGR-AR-SUPREMACY (runtime spec §1 "conflict detection · supremacy enforcement"), grounded in the verified `PCAMG-7000 Conflict Resolution Framework` and Article M-VII.

- **Purpose:** detect conflicts between a candidate article and any registered principle, between competing articles, and between an article and a higher-derivation artifact, before supremacy arbitration.
- **Inputs:** resolved chains and constitutional validation verdicts.
- **Outputs:** a conflict set (empty when none), consumed by the supremacy runtime.
- **Invariants:** detection is deterministic and read-only; any detected article-vs-principle conflict routes to supremacy arbitration where the principle prevails (M-I); an undetectable/ambiguous conflict is treated as a conflict (fail-closed, M-VI), never silently ignored.

---

## L. Constitutional Traceability Runtime

Authorized as the **constitution-scoped slice of CGR-TR-VERIFY / CGR-TR-GRAPH** (Wave-2) over CGR-REG-TRACE.

- **Purpose:** verify that every Meta-Constitution article traces upward to ≥1 invariant principle, and that the derivation structure is sound (M-XI).
- **Inputs:** trace edges (read-only) and the article under verification.
- **Outputs:** a traceability verdict (complete up-trace / broken trace), fail-closed.
- **Invariants (verified doctrine):** T-1 complete up-trace to ≥1 principle; T-2 downward-only authority flow; T-5 acyclic; upward-only legitimacy verification (GD-0002 §5) — an unverifiable article is void (M-II); verification is read-only and deterministic.

---

## M. Constitutional Lifecycle Model

- **States:** `proposed → superseded` only. **No ACTIVE** state exists in this layer (propose-only; Wave-3 activation and the four-stage compliance gate of M-X are out of scope).
- **Amendment (M-VIII):** an article is immutable except by a superseding record that references a Constitutional Majority + AUTH-012 decision. M-I/M-II/M-III may be amended only in the strengthen-only direction (never to weaken or invert principle sovereignty, GD-0002 G-6).
- **Supersession:** by appended linked record (RG-4); the prior article record is retained and moves to `superseded` by new appended state, never mutated or deleted (INV-10, append-only).
- **Enrollment boundary:** materializing an article as propose-only state is **not** enrollment. Ratification/enrollment and the M-XII reconciliation with `UCOS-CONST-001` remain Authority Board acts under AUTH-012; the runtime layer never confers them.

---

## N. Constitutional Evolution Constraints

Defines what may evolve, what may never evolve, and the principle-supremacy guarantees.

- **What may evolve:** the *text and derivation detail* of an article, only via an AUTH-012-referenced superseding record (M-VIII), append-only, simulate-before-apply, backward-compatible (IP-14/IP-15). Generated governance, domain constitutions, and policies below the Meta-Constitution evolve via the Adaptive Evolution Framework — they are not part of this layer.
- **What may never evolve:**
  - The **origin of sovereignty** — always the invariant principles; never reassigned to the Meta-Constitution, an execution, an AI, or an organization (GD-0002 G-1; M-III).
  - The **closed twelve-article id space** and each article's fixed `article`↔UUID binding.
  - Articles **M-I / M-II / M-III** in any weakening or inverting direction (strengthen-only; MI-6, PRIN-014).
  - The **principle-supremacy ordering** — no evolution may make any article outrank a principle.
  - The **propose-only, append-only, audited** discipline of the registry (INV-10).
- **Principle supremacy guarantees:** evolution is itself bounded by the principles (M-I). Any proposed article version that would weaken principle sovereignty, break an up-trace, or invert the authority flow is rejected by the validation and supremacy runtimes before it can be appended. Evolution can only ever move in the direction that preserves or strengthens **Principles > Constitutions**.

---

## O. Governance Generation Binding Model

Defines how constitutions authorize governance generation.

- **Authorization direction:** the Meta-Constitution (Layer 1) authorizes the Governance Generation Framework (PCAMG-2000, Layer 2) to *generate* governance systems from principles + the Meta-Constitution (M-IV: "governance is generated, not privileged"). Generation authority flows **downward only** (GD-0002 §5).
- **Binding requirement:** every generated governance candidate (held propose-only in CGR-REG-GOV, per 0015 §D) must carry a generation record and must up-trace through the Meta-Constitution articles to ≥1 invariant principle (T-1). A candidate that cannot bind upward to both a Meta-Constitution article and a principle is void (M-II / M-IV) and is denied by the validation runtime.
- **No self-privilege:** no governance system may be manually privileged, hardcoded, or self-declared (IP-01/IP-02, M-IV); the Meta-Constitution never authorizes a governance system that claims authority the Meta-Constitution itself does not hold (bounded-subset rule, GD-0002 §5).
- **Scope boundary of this package:** this package authorizes only the **binding seam** by which the Meta-Constitution *would* authorize generation — realized as read-only trace/validation over CGR-REG-META and CGR-REG-GOV. The compiler/generation runtime (CGR-CE-*) itself is a later wave and is **not** authorized here; CGR-REG-GOV remains a propose-only store (Wave-1 stores; Wave-2 compiler proposes).

---

## P. Runtime Directory Structure (directories only — no code)

All under the canonical root; the Meta-Constitution layer touches the meta + principle + trace registries and the constitution-scoped Wave-2 engines. No new directories beyond those already authorized by 0013/0015 (Wave-1) and 0012-as-reconciled-by-0012B (Wave-2).

```
packages/platform-runtime/src/control/constitutional-governance/     # CANONICAL ROOT
├── types.ts                                    # CGR-CORE-01  (REG-META article schema: article, article_name,
│                                               #               article_text, governs, principle_derivation[], amendment_rules)
├── hashing.ts                                  # CGR-CORE-03  (article content hash)
├── append-only.ts                              # CGR-CORE-02  (article append-only guard)
├── governance-control.ts                       # CGR-CORE-04  (composition, wires meta layer)
├── registries/
│   ├── principle-registry.ts                   # CGR-REG-PRIN  (read — derivation source)
│   ├── meta-registry.ts                        # CGR-REG-META  — Meta-Constitution Runtime (Section B/D)
│   └── trace-registry.ts                       # CGR-REG-TRACE — Constitutional Graph edges (Section E)
├── authority/                                  # Wave-2 constitution-scoped engines (canonical root, per 0012B)
│   ├── resolve.ts                              # CGR-AR-RESOLVE   — Constitutional Resolution Runtime (Section H)
│   ├── validate.ts                             # CGR-AR-VALIDATE  — Constitutional Validation Runtime (Section I)
│   └── supremacy.ts                            # CGR-AR-SUPREMACY — Supremacy + Conflict Detection (Sections J/K)
├── traceability/
│   ├── graph.ts                                # CGR-TR-GRAPH   — constitutional graph projection (Section E)
│   └── verify.ts                               # CGR-TR-VERIFY  — Constitutional Traceability Runtime (Section L)
└── reasoning/
    └── read-model.ts                           # read-only projection over meta + principle + trace registries
```

```
packages/platform-runtime/test/cg/
├── registries/                                 # meta-registry + trace suites
├── authority/                                  # resolve / validate / supremacy suites
├── traceability/                               # graph / verify suites
└── system/                                     # meta-constitution end-to-end + non-regression
```

No directory is created outside the canonical root and `test/cg/`. No `governance-runtime` directory is authorized. The path `control/governance/governance-registry.ts` remains PROHIBITED and import-only. All other PROHIBITED paths remain import-only.

---

## Q. Runtime Test Authorization

| Suite | Coverage authorized |
|-------|---------------------|
| Meta registry | twelve fixed article ids (M-I..M-XII) admitted; thirteenth rejected; REG-META schema enforced; each article up-traces to ≥1 existing principle; article id/UUID immutable; propose-only breach; append-only breach; hash verified on read |
| Constitutional graph | acyclic (T-5); no self-edge; `layerTo ≤ layerFrom` (Layer 1 → Layer 0); eight-relation closed; every article up-traces to ≥1 principle (T-1) |
| Resolution | deterministic principle-terminated chains for each article; incomplete/undrived chain ⇒ deny (M-II); zero writes |
| Validation | VR-M1 (article not derived from a principle ⇒ fail); non-waivable principle checks; deny-by-default; exclusions S-IV/S-V/S-VI each ⇒ deny (M-III); deterministic verdicts |
| Supremacy | principle always outranks any article — including M-I's own chain; higher-derivation article prevails (M-VII); total deterministic ordering; undecidable tie ⇒ deny; no mutation |
| Conflict detection | article-vs-principle conflict detected; article-vs-article conflict detected; ambiguous ⇒ treated as conflict (fail-closed); routes to supremacy |
| Traceability | complete up-trace to ≥1 principle (T-1); downward-only flow (T-2); broken trace ⇒ deny; read-only |
| System | meta-constitution lifecycle (propose article → resolve to principle → validate → supremacy → trace-verify → audit → export → verify); generation-binding seam (candidate up-traces through article to principle or ⇒ deny); baseline non-regression; non-inversion adversarial (attempt to make an article outrank a principle, or confer authority upward/sideways ⇒ deny) |

Runner: existing `node --test` convention under `test/cg/**/*.test.ts`. Harness: CGR-CORE-05.

---

## R. Non-Regression Requirements

- **Baseline: 443 / 443** (platform-runtime 378 + contract-generator 65), verified. This is the floor.
- No meta-layer artifact may reduce, skip, or disable any existing test.
- Total = **443 baseline + meta-layer additions**, all green.
- The `control/index.ts` re-export (`export * as cg from "./constitutional-governance/index.ts"`) and the widened test glob (`test/cg/**/*.test.ts`) add zero failures / zero collisions.
- The stale "284" figure (Git `56a32d3`) is not a baseline.

---

## S. Acceptance Gates (blocking, fail-closed)

| Gate | Condition |
|------|-----------|
| **Derivation** | every article resolves to ≥1 principle; an article with no principle derivation is void (M-II / VR-M1). |
| **Supremacy** | on any article-vs-principle conflict, the principle prevails; no article — including M-I — outranks a principle; ordering total and deterministic; undecidable ⇒ deny. |
| **Exclusions** | no article confers execution/AI/organization origin (M-III / S-IV/S-V/S-VI). |
| **Non-inversion** | authority flows downward only from principles to the Meta-Constitution; upward/sideways conferral impossible; verified by traceability + supremacy. |
| **Traceability** | complete up-trace to ≥1 principle (T-1); acyclic (T-5); downward-only (T-2). |
| **Generation-binding** | a governance candidate must up-trace through a Meta-Constitution article to a principle, or ⇒ deny (M-IV). |
| **Propose-only** | no ACTIVE representable or conferrable; materialization is not enrollment (M-X / M-XII). |
| **Determinism** | identical inputs ⇒ identical chains, verdicts, orderings, and hashes across runs/machines (M-VI). |
| **TypeScript** | meta-layer files compile under the repo tsconfig; strict; no runtime-emitting syntax. |
| **Non-regression** | 443 baseline preserved. |

---

## T. Exit Criteria

1. CGR-REG-META holds the twelve Meta-Constitution article records (M-I..M-XII, REG-META schema), each up-tracing to ≥1 principle, propose-only, hash-verified.
2. CGR-REG-TRACE holds the constitutional graph edges; graph is acyclic and up-trace-complete.
3. The constitution-scoped resolution, validation, supremacy, conflict-detection, and traceability runtimes pass all authorized suites, fail-closed.
4. The generation-binding seam denies any governance candidate that cannot up-trace through an article to a principle.
5. All acceptance gates (Section S) green; 443 baseline preserved.
6. Only the canonical root and `test/cg/` are touched (plus the two standing EXTEND points); no `governance-runtime`; no PROHIBITED path modified.
7. No ACTIVE status anywhere; no enrollment performed; **Principles > Constitutions** is enforced as downward-only and non-invertible.

---

## U. Deliverables Matrix

| # | Deliverable | Path | Component | Bound gates |
|---|-------------|------|-----------|-------------|
| 1 | Meta-Constitution article records (12, REG-META schema) | `cg/registries/meta-registry.ts` | CGR-REG-META | Derivation, Propose-only, TS |
| 2 | Constitutional graph edges | `cg/registries/trace-registry.ts` | CGR-REG-TRACE | Traceability, TS |
| 3 | Constitutional resolution | `cg/authority/resolve.ts` | CGR-AR-RESOLVE | Derivation, Determinism |
| 4 | Constitutional validation | `cg/authority/validate.ts` | CGR-AR-VALIDATE | Exclusions, Non-inversion, Determinism |
| 5 | Supremacy + conflict detection | `cg/authority/supremacy.ts` | CGR-AR-SUPREMACY | Supremacy, Non-inversion |
| 6 | Constitutional graph projection | `cg/traceability/graph.ts` | CGR-TR-GRAPH | Traceability |
| 7 | Constitutional traceability verify | `cg/traceability/verify.ts` | CGR-TR-VERIFY | Traceability, Non-inversion |
| 8 | Read-model projection | `cg/reasoning/read-model.ts` | reasoning | Determinism, Generation-binding |
| 9 | Meta-layer test suites | `test/cg/{registries,authority,traceability,system}/*.test.ts` | all | All gates |

---

## V. Risks and Constraints

| Risk / Constraint | Description | Mitigation (repository reality) |
|-------------------|-------------|---------------------------------|
| RC-1 Doctrine not ratified | GD-0002, PCAMG-0002/0000, and PCAMG-1000 are PROPOSED · NOT RATIFIED · NOT IMPLEMENTATION AUTHORIZED | Build only as **propose-only inert state**; materialization ≠ enrollment; ratification and M-XII reconciliation stay AUTH-012 Authority Board acts |
| RC-2 Substrate dependency | CGR-REG-META depends on CGR-REG-PRIN (0016) and the Wave-1 base; the canonical root is not yet materialized on disk | Sequence: materialize Wave-1 (0013/0015) + principle layer (0016) before the meta registry and its constitution-scoped Wave-2 engines (0012B) |
| RC-3 Constitutional inversion | A latent path could let an article outrank a principle | Supremacy + traceability gates enforce Principles > Constitutions; adversarial system suite attempts to make M-I outrank a principle and must be denied |
| RC-4 Hardcoded articles | Embedding article literals would violate IP-01/IP-02 / M-IV (registry-driven, generated-not-privileged) | Articles are registry records; runtimes read projections only, never literals |
| RC-5 Id-space drift | Adding/removing an article id at runtime | Closed twelve-id space enforced by the registry; thirteenth rejected |
| RC-6 Broken derivation | An article materialized without a principle derivation | VR-M1 + Derivation gate: an underived article is void (M-II) |
| RC-7 Determinism loss | Wall-clock/randomness in resolution or hashing | Injected clock seam; hashing via reused canonicalize+sha256; determinism gate (M-VI) |
| RC-8 Baseline regression | New suites perturb 378/65 | Re-run 443 after each package; tsconfig unchanged; glob append-only |
| RC-9 Scope creep into generation | Authorizing the compiler/generation runtime prematurely | Only the binding seam is authorized; CGR-CE-* compiler is a later wave; CGR-REG-GOV stays a propose-only store |

---

## W. Formal Authorization Statement

On verified repository reality and existing doctrine alone, the Meta-Constitution runtime layer is authorized for construction under the single canonical root `packages/platform-runtime/src/control/constitutional-governance/`. The layer materializes PCAMG-1000 (Articles M-I..M-XII; meta-invariants MI-1..MI-8; the M-VIII amendment discipline) as propose-only records in **CGR-REG-META**, bound upward to the fifteen invariant principle records via **CGR-REG-TRACE**, and enforced by the constitution-scoped slices of **CGR-AR-RESOLVE / CGR-AR-VALIDATE / CGR-AR-SUPREMACY** and **CGR-TR-VERIFY / CGR-TR-GRAPH** — all components already authorized in the construction chain (0013/0015 Wave-1; 0012-as-reconciled-by-0012B Wave-2), and all derived from and bounded by the Sovereignty Origin and Invariant Principles authorized in PCAMG-RUNTIME-0016. No new constitutional theory and no new architecture are introduced; the resolution, validation, supremacy, conflict-detection, and traceability runtimes are read-only, deterministic, and fail-closed. Every article is a derived artifact whose legitimacy is verified only by tracing upward to ≥1 invariant principle; on any conflict, the principle prevails. This package proves and enforces **Principles > Constitutions**, and never the reverse. Construction is strictly additive over the verified 443/443 baseline, introduces no ACTIVE status, performs no enrollment, and touches no PROHIBITED path. No `governance-runtime` reference exists in this package.

---

**META-CONSTITUTION IMPLEMENTATION AUTHORIZED**
