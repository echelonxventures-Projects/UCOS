# UCOM-PRIMITIVE-001 — Universal Primitive Completion Model

**Phase:** R2 — Universal Primitive Completion Review
**Artifact:** `UCOM-PRIMITIVE-001`
**Mode:** REVIEW & DESIGN-PROPOSAL ONLY — no code, no runtime change, no authorization, no lock release,
no substrate-core-dir modification, no ratified-artifact mutation. Append-only.
**Question:** *Can the current primitive model fully represent Audit, Intelligence, Simulation, and
Civilization without substrate redesign? If not, design the minimum primitive additions.*
**Governance status:** INV-1..13 unchanged; INV-14..20 NOT enrolled; AD-0014 intact; Article IX unchanged.
The primitives proposed here are additive design candidates; none is enrolled, implemented, or authorized.

---

## 1. Baseline Primitive Inventory (what exists today)

The substrate = five core dirs (`meta-core`, `registry-runtime`, `metadata-runtime`,
`configuration-runtime`, `contracts`). The current representational primitives are:

| ID | Primitive | Surface | Layer |
|----|-----------|---------|-------|
| B-1 | **RegistryRecord** `{id, version, kind, descriptor}` | `RegistryPort` | core substrate |
| B-2 | **MetadataRecord** `{key, value, schema}` (prefix-queryable) | `MetadataPort` | core substrate |
| B-3 | **ConfigurationLayer** (ordered, deep-merged) | `ConfigurationPort` | core substrate |
| B-4 | **Descriptor** (capability / contract) | `contracts/types.ts` | core substrate |
| B-5 | **SignedAssertion** (Ed25519) | `federation/assertions.ts` | control (shared) |
| B-6 | **ChainedAuditEntry / AuditLog** (SHA-256 hash chain) | `control/audit-log.ts`, `FederatedAuditLog` | control (shared) |
| B-7 | **EvolutionUnit** (sole governed proposal→certify→ratify→commit path) | `control/evolution/*` | control (shared) |

Observed reality: every domain fabric (Knowledge, Ontology, Memory, Federation, and the designed
Intelligence/Simulation/Civilization) reduces its objects to **B-2 records** under a per-fabric
`<domain>:<kind>:<id>` keyspace, interpreted by control-layer engines. This is why PI-4..PI-11 were all
built with **zero core-dir change**.

---

## 2. Per-Subject Representability Analysis

| Subject | Representable on baseline? | First-class / clean? | Recurring shape re-implemented ad-hoc |
|---------|:---:|:---:|---|
| **Audit** | YES | **YES** — B-6 + B-5 + B-2 already provide it as a shared cross-cutting primitive | (none — already unified) |
| **Intelligence** | YES (by convention) | **NO** | *advisory/uncommitted* results; *rationale/provenance chains* (evidence→inference→conclusion, reproducible) |
| **Simulation** | YES (by convention) | **NO** | *pinned immutable snapshots*; *isolated sandbox scope*; *advisory projections ("never facts")* |
| **Civilization** | YES (by convention) | **NO** | *composite/aggregate objects* (institution/population/economy ∈ civilization); *digital-twin snapshots* |

**Finding.** All four are representable **without substrate (core-dir) redesign** — everything reduces to
records + additive control engines. **Audit is already first-class.** But the model is **not complete**:
Intelligence, Simulation, and Civilization each re-implement the *same* missing shapes by convention
(each fabric ships its own snapshot engine, its own advisory-flagging, its own lineage/edge encoding).
This is the Class-A keyspace/convention hard-coding recorded in `REG-ABS-001` (HC-6) manifesting as
per-fabric duplication.

---

## 3. Determination

The current primitive model **can represent** all four subjects **without substrate redesign**, and
**fully represents Audit**. It does **not** *cleanly / first-class* represent **Intelligence,
Simulation, and Civilization** — those three depend on four recurring shapes (advisory state, snapshot,
isolated scope, provenance edge) that today are re-invented per fabric rather than provided as shared
primitives. Therefore the primitive model is **INCOMPLETE**, and completion is achievable with a
**minimum additive primitive set** that requires **no substrate-core-dir redesign**.

---

## 4. Minimum Primitive Additions

Five additive primitives. **P2–P5 are necessary** for full first-class representation of Intelligence /
Simulation / Civilization; **P1 is a recommended consolidation** (removes HC-6 duplication). All are
built on the baseline (B-2 records + B-5 crypto + B-6 audit + B-7 evolution) and live in a shared
`src/control/primitives/*` module consumed by fabrics — **zero change to the five core dirs.**

| ID | Primitive | Purpose | Closes gap for | Built on | Necessity |
|----|-----------|---------|----------------|----------|:---------:|
| **UCOM-P1** | **Namespaced Record** | Formalize `<domain>:<kind>:<id>[@version]` (register / version / prefix-query / reserved-keyspace guard) into one primitive | ALL fabrics (removes per-fabric keyspace reinvention, HC-6) | B-2 | Recommended |
| **UCOM-P2** | **Assertion (status-typed)** | One assertion primitive with `status ∈ {advisory, signed, committed}` + provenance; an *advisory* assertion is explicitly **non-authoritative** until promoted via Evolution | Intelligence (advisory inference), Simulation (projections "never facts") | B-5, B-7 | **Required** |
| **UCOM-P3** | **Snapshot** | Immutable, content-addressed (hash), signed point-in-time view of a keyspace subtree | Simulation (pinned baseline + twins), Civilization (twins); unifies Evolution/Knowledge/Ontology/Memory snapshots | B-2, B-5, B-6 | **Required** |
| **UCOM-P4** | **Scope (Sandbox / Session)** | Named, disposable, isolated overlay over a Snapshot with a write-guard (writes confined to `scope:<id>:*`, never escaping to authoritative keyspace) | Simulation (sandbox run), Intelligence (reasoning session); structurally enforces non-actuation | B-2, UCOM-P3 | **Required** |
| **UCOM-P5** | **Provenance Edge** | Typed, directed, immutable link `(from) --relation--> (to)` + authority + time | Intelligence (rationale chain), Civilization (composite aggregation), unifies Knowledge lineage / Ontology relationships / Memory↔audit | B-2, B-6 | **Required** |

**Coverage proof.** With P2–P5 (and P1 for uniformity):

- **Audit** — already complete (B-5/B-6/B-2); optionally consumes P5 for event linkage.
- **Intelligence** — goals/models/sessions/decisions = P1 records; non-deterministic inference runs in a
  **P4 scope** producing **P2 advisory** assertions; the **P5** rationale chain makes every decision
  reproducible; commit only via **B-7**. Determinism (INV-6) preserved: nothing advisory becomes a fact
  without verifier + Evolution.
- **Simulation** — a run = **P4 scope** over a **P3 snapshot**; twins/scenarios/projections = P1 records
  + **P2 advisory** results; promotion via **B-7**; audit via **B-6**.
- **Civilization** — a civilization = a **P5**-linked composite of P1 records (institution / population /
  culture / economy / governance), simulated as a **P3/P4** digital twin. No new primitive beyond P1–P5.

**Substrate-redesign check.** None of P1–P5 alters `RegistryPort`, `MetadataPort`, `ConfigurationPort`,
the descriptor schema, or any core-dir file. They are shared control-layer primitives over the existing
metadata + crypto + evolution surfaces — the same additive pattern proven across PI-4..PI-11.

---

## OUTPUT

**`UCOM-PRIMITIVE-001` — PRIMITIVE MODEL INCOMPLETE (COMPLETABLE WITHOUT SUBSTRATE REDESIGN)**

- **Audit:** fully representable today (first-class).
- **Intelligence / Simulation / Civilization:** representable without substrate redesign, but **not
  first-class** on the current model — they require the minimum additive primitive set **UCOM-P2
  (Assertion, status-typed), UCOM-P3 (Snapshot), UCOM-P4 (Scope/Sandbox), UCOM-P5 (Provenance Edge)**,
  with **UCOM-P1 (Namespaced Record)** recommended to remove per-fabric duplication.
- **Substrate redesign required: NO.** All five additions are additive control-layer primitives over the
  existing baseline; the five core dirs are untouched.

> Design proposal only — no code, runtime, authorization, or lock release. INV-1..13, AD-0014, and the
> Article IX generation lock are unchanged. Enrollment/implementation of UCOM-P1..P5 is an
> Approval-Required Operation (AD-0009) reserved to the Authority Board and would follow the standard
> proposal → review → authorization → additive implementation → ratification path.
