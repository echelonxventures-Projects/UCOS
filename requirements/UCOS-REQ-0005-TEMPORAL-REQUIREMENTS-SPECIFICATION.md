# UCOS-REQ-0005 — Temporal Requirements Specification

**Artifact ID:** `UCOS-REQ-0005`
**Phase:** Phase 0.5 — Constitutional Gap Closure & Ratification (Temporal Cluster Closure)
**Mode:** REQUIREMENTS DISCOVERY / SPECIFICATION ONLY — no code, schema, ontology design, data model, architecture, or roadmap is produced. Temporal requirements are **stated as governed requirements of record**; they are neither designed nor implemented here, and they change **no** existing architecture.
**Status:** RATIFIED BASELINE (v1.0.0) — closes the MISSING temporal requirement classes.
**Subordinate to:** `UCOS-REQ-0001..0004`, `UCOS-AUDIT-0001..0003`, `UCOS-GAP-0001/0002`, the Authority Layer (`AUTH-001..012`), and the Constitution (`UCOS-CONST-001`).
**Governing invariants:** `INV-1..INV-13` (binding). `INV-19` (Cosmological Locality) and `INV-14` (No Scale Ceiling) are PROPOSED (`AUTH-013-AMD-001`, deferred `AD-0014`); relativistic-time reconciliation reuses the `EXIST-001` Computation-Realizer Contract (INV-18↔INV-6, resolution authored, enactment reserved to the Board).
**Closes:** GAP-R51, GAP-R52, GAP-R53/54, GAP-R55, GAP-R57, GAP-R58 · MISSING classes **RC-052, RC-053, RC-054, RC-055, RC-057, RC-058** (and formalizes PROPOSED **RC-051**).
**Date:** 2026-07-03

---

## 0. Purpose, scope, and non-scope

The frozen audit baseline identifies the **temporal cluster** as the single most concentrated completeness
gap: the one dimension where the Constitutional Completeness Test **fails outright** (`UCOS-REQ-0002 §11`
CT-F5; `UCOS-REQ-0004 §7`; `UCOS-AUDIT-0001 §2.4`). UCOS today has **only append-only monotone version
ordering** (INV-10) and an event lifecycle (`PEL-001`) — strong *ordering/versioning* time, but **no
first-class temporal, spatial-temporal, multi-reference-frame, relativistic, or century-continuity model**.

This specification closes that cluster by **stating the temporal requirements of record**. Per the Phase 3
charter it does so **without changing existing architecture**:

- **In scope:** governed requirement statements (`UR-TIME-*`), their classification transition (MISSING →
  STATED-REQUIREMENT), evidence anchors, acceptance criteria, and non-regression constraints against
  `INV-1..13`.
- **Explicitly out of scope (prohibited here):** temporal data models, schemas, ontology edits, ADRs, code,
  a temporal fabric, or any modification to `O-14/O-15`, `INV-1..13`, `AUTH-012`, or `AD-0014`. Realization
  is a future scoped Article IX release (Architecture-Gap F / Implementation-Gap G per `UCOS-GAP-0002`),
  **not** this artifact.

> **No-redesign guarantee.** Consistent with `ULT-TEST-001` (0 `REDESIGN` verdicts), every requirement below
> is expressible as an **additive specialization** of existing constructs (INV-10 append-only order; `O-15`
> Cosmology locality; PI-5 federation; `PEL-001` lifecycle; `EXIST-001` CRC). Where a temporal requirement
> and an `INV-1..13` invariant appear to conflict, **the ratified invariant prevails** and the temporal
> requirement is re-expressed as a conformant extension (`AUTH-013 §4` subordination doctrine).

---

## 1. Temporal requirement-class map (RC-051 … RC-058)

| RC | Class | Prior class. (`UCOS-REQ-0001`) | This artifact | UR-TIME | Gap |
|----|-------|:------------------------------:|:-------------:|:-------:|-----|
| RC-051 | Temporal (first-class time) | PROPOSED (partial) | **STATED-REQUIREMENT** | UR-TIME-01 | GAP-R51 |
| RC-052 | Relativistic Time | MISSING | **STATED-REQUIREMENT** | UR-TIME-02 | GAP-R52 |
| RC-053 | Spatial-Temporal | MISSING | **STATED-REQUIREMENT** | UR-TIME-03 | GAP-R53 |
| RC-054 | Multi-Reference Frame | MISSING | **STATED-REQUIREMENT** | UR-TIME-04 | GAP-R54 |
| RC-055 | Planetary & Oceanic Reality (of record) | MISSING | **STATED-REQUIREMENT** | UR-TIME-07 | GAP-R55 |
| RC-057 | Time Continuity (century-scale) | MISSING | **STATED-REQUIREMENT** | UR-TIME-05 | GAP-R57 |
| RC-058 | Temporal Governance | MISSING | **STATED-REQUIREMENT** | UR-TIME-06 | GAP-R58 |

> **"STATED-REQUIREMENT"** means: the requirement now exists of record as a governed, append-only, single-owner
> requirements artifact subordinate to Authority and Constitution — the MISSING classification is discharged at
> the *requirements layer*. Enrollment of any dependent invariant (e.g. INV-19) and realization (a temporal
> construct) remain reserved to the Authority Board and to a future scoped release.

---

## 2. Temporal Models — first-class time (UR-TIME-01 · RC-051)

**Requirement statement.** Time shall be a **first-class, modeled, governed dimension**, not merely an emergent
property of append-only versioning. Every governed construct shall be describable along at least two temporal
axes:

- **UR-TIME-01a — Valid-time.** The time interval during which a fact is asserted to be true in the modeled
  world (effective-from / effective-to), independent of when it was recorded.
- **UR-TIME-01b — Transaction-time.** The time at which a fact was recorded/committed to a system-of-record;
  monotone and append-only (this axis is EXISTING via INV-10 and is **restated, not redesigned**).
- **UR-TIME-01c — Event/temporal ordering.** A governed, reproducible ordering relation over events and state
  transitions, consistent with the existing event lifecycle (`PEL-001`) and event catalog (`UCOS-PEA-003`).

**Classification:** STATED-REQUIREMENT (was PROPOSED/partial).
**Evidence anchors:** INV-10 (append-only monotone order); `PEL-001` (10-stage lifecycle); `UCOS-PEA-003` (73 PEV / 17 PED); `UCOS-REQ-0004 §7 UR-TIME-01`.
**Acceptance criteria (requirements-layer):** (1) valid-time and transaction-time are distinguishable for any governed record; (2) transaction-time remains INV-10 append-only; (3) no destructive time travel — corrections are forward migrations (IP-14).
**Non-regression:** INV-10 unweakened; bi-temporality is additive metadata, not a mutation of the commit path.

---

## 3. Relativistic Time (UR-TIME-02 · RC-052)

**Requirement statement.** The platform shall **not assume a single synchronous global clock**. Temporal
correctness shall hold under **latency-divergent / relativistic** conditions across reference frames
(light-minute-and-beyond round-trip times), such that no governed decision depends on instantaneous global
time agreement.

- **UR-TIME-02a — No global-now assumption.** Ordering and causality shall be established by **logical/causal
  clocks and signed evidence**, never by an assumed shared wall-clock instant.
- **UR-TIME-02b — Asynchronous ratification.** Governed ratification across localities shall tolerate delay and
  partition: it shall be achievable via **asynchronous signed-quorum** rather than synchronous consensus
  (partition is a normal operating condition, `UCOS-UEA-0007`; INV-9 static stability).
- **UR-TIME-02c — Determinism preserved under the CRC.** Any computation contributing to a governed temporal
  decision shall satisfy the **Computation-Realizer Contract** of `EXIST-001` (INV-6-conformant propagation +
  determinism-quarantine), so that relativistic tolerance never places non-deterministic output on the commit
  path.

**Classification:** STATED-REQUIREMENT (was MISSING).
**Evidence anchors:** `CIV-STRESS-001` BP-15 (INV-6-vs-relativistic-latency WALL); `UCOS-UEA-0007` Q2; `EXIST-001` R-18 (CRC-1/CRC-2); INV-9.
**Resolution note (no conflict):** The baseline's "INV-6-vs-relativistic-latency WALL" is discharged **additively** — `EXIST-001` already establishes that INV-6 is *event-driven propagation* (at-least-once + idempotent + tolerant reader), which is precisely a latency/partition-tolerant contract; and determinism (EX1) is preserved via the verifier gate. Relativistic time therefore reuses ratified mechanisms; **INV-6/EX1 prevail unweakened.**
**Acceptance criteria:** (1) no requirement statement anywhere depends on a synchronous global clock; (2) cross-frame ordering is causal/logical + signed; (3) ratification degrades to async signed-quorum under partition without violating INV-5/INV-6.

---

## 4. Spatial-Temporal Relationships (UR-TIME-03 · RC-053)

**Requirement statement.** Combined **spatial-temporal locality (where + when)** shall be an addressable,
governed context — an entity/event may be located in both a cosmological locality and a temporal interval, and
the pair shall be a first-class relationship dimension.

- **UR-TIME-03a — Spatial-temporal addressing.** Locality addressing (existing `O-15 Cosmology`, spatial) shall
  be **extensible with a temporal locality component** so that (locality, time-interval) is expressible without
  a new core primitive — realized additively as attributes/relationships on existing constructs.
- **UR-TIME-03b — Temporal & causal relationships first-class.** The relationship classes named but not yet
  first-class in `UCOS-REQ-0004 §6 UR-REL-02` — **temporal** (before/after/during/overlaps) and **causal**
  (causes/enables/precludes) — shall be stated requirements of record (closing the `UR-REL-02` MISSING note).

**Classification:** STATED-REQUIREMENT (was MISSING).
**Evidence anchors:** `O-15 Cosmology` (spatial only; temporal flagged open); `ONTO-C6` relationships (domain/range/cardinality/symmetric/transitive/inverse); `UCOS-REQ-0004 §6 UR-REL-02`; `UCOS-UEA-0007` (open questions Q1/Q2).
**Acceptance criteria:** (1) (locality × time) is expressible as data on existing constructs, zero new core ports; (2) temporal and causal relationship classes are of record; (3) `O-15` is *extended additively*, never redesigned.

---

## 5. Multi-Reference Frames (UR-TIME-04 · RC-054)

**Requirement statement.** The platform shall support **multiple, reconcilable reference frames** for
time/space/state, each with its own local ordering, reconciled only through contract-first federation — never
through a shared mutable global frame.

- **UR-TIME-04a — Frame as federation-locality.** A reference frame shall be treated as a **federation-locality
  axis** (directly analogous to the `EXIST-001` Reality-Scoped Single-SoR doctrine and the `O-15` cosmological
  locality): each frame owns its state; cross-frame views are provenance-tagged, read-only, locally
  re-ratified projections (INV-1/INV-5).
- **UR-TIME-04b — Reconciliation, not unification.** Frames are **reconciled** (mapping + provenance), not
  merged into one authoritative frame; there is **no cross-frame shared mutable state**.
- **UR-TIME-04c — Single-SoR per (domain, frame).** INV-5 holds in full within each frame — one system-of-record
  per (domain, reference-frame) — mirroring `EXIST-001` RSD-1.

**Classification:** STATED-REQUIREMENT (was MISSING).
**Evidence anchors:** `UCOS-UEA-0007` (federation-of-localities); PI-5 federation model (local sovereignty, deny-by-default, clamped trust, local-shadows-foreign, namespace isolation); `EXIST-001` RSD-1..3; INV-5.
**Acceptance criteria:** (1) no requirement asserts a single global reference frame; (2) cross-frame access is federation only; (3) single-SoR per (domain, frame) demonstrable; **INV-5/INV-1 prevail.**

---

## 6. Time Continuity — century-scale (UR-TIME-05 · RC-057)

**Requirement statement.** Governance, audit, and identity shall remain **continuous and reconcilable across
century-scale time**, surviving cryptographic obsolescence, ledger growth, and custodian/authority succession.

- **UR-TIME-05a — Crypto-agility.** Credential/signature verification shall be **pluggable and migratable**
  (post-quantum-capable) via a `CredentialVerifier` contract, with **migration-only re-anchoring** (no
  destructive re-signing; IP-14/INV-10).
- **UR-TIME-05b — Ledger longevity.** The append-only ledgers shall support **century-scale longevity** via
  signed audit checkpoints and segmented/compacted ledger structure, preserving offline verifiability and
  reconstruction (INV-10; `UR-GOV-04`).
- **UR-TIME-05c — Authority/custodian succession.** Authority and key custody shall have a **governed succession
  path** across generations, recorded on `AUTH-012`, without breaking the decision-chain continuity.

**Classification:** STATED-REQUIREMENT (was MISSING).
**Evidence anchors:** `ULT-TEST-001` RM-8/RM-9 (crypto-agility & century-scale ledger longevity *absent from design record*); FM-10/11/12; `UR-GOV-04`; INV-10; IP-14.
**Acceptance criteria:** (1) no fixed cryptographic primitive is assumed permanent; (2) ledger verifiability is defined independent of any single key/era; (3) succession is a governed `AUTH-012` act, append-only.

---

## 7. Temporal Governance (UR-TIME-06 · RC-058)

**Requirement statement.** Governance decisions shall carry **explicit temporal validity** — effective dates,
expiry/sunset, and time-scoped authority — as first-class, governed fields, replacing the current *ad hoc*
effective-date usage in `AD-*` records.

- **UR-TIME-06a — Effective/expiry dating.** Every governed decision (`AUTH-012` decision records, policies,
  ratifications) shall carry a **valid-time interval** (effective-from, optional effective-to/sunset).
- **UR-TIME-06b — Time-scoped authority.** Delegated authority shall be expressible as **time-bounded**, with
  automatic lapse at expiry unless renewed by a governed act (deny-by-default on lapse; INV-3).
- **UR-TIME-06c — Temporal precedence.** Where two governed decisions overlap, temporal validity plus the
  existing precedence order (`AUTH-009 §6.2`) shall deterministically resolve which is in force at a given
  instant.

**Classification:** STATED-REQUIREMENT (was MISSING).
**Evidence anchors:** effective-date fields appearing ad hoc in `AD-*`; `AUTH-009` precedence; INV-3 deny-by-default; UR-TIME-01a valid-time.
**Acceptance criteria:** (1) governed decisions have explicit valid-time of record; (2) authority lapse is fail-closed; (3) time-scoped precedence is deterministic and auditable.

---

## 8. Planetary & Oceanic Reality of record (UR-TIME-07 · RC-055)

**Requirement statement.** Physical realities that are **inherently temporal-spatial** — planets, oceans,
mountains, ecosystems — shall be **requirements of record** as entities/habitats bearing spatial-temporal
locality, not merely representationally demonstrable.

- **UR-TIME-07a — Entity/habitat of record.** Planetary/oceanic/ecological realities shall be stated as
  representable via the existing `O-10 Habitat` + `entity` constructs (already *verified* by `UNIV-ENTITY-001`),
  now **required of record** rather than demonstrated-only.
- **UR-TIME-07b — Spatial-temporal binding.** Such entities shall bind to UR-TIME-03 spatial-temporal locality
  (a planet has a where and an evolving when).

**Classification:** STATED-REQUIREMENT (was MISSING).
**Evidence anchors:** `O-10 Habitat`; `UNIV-ENTITY-001` (Planet verified representationally, SCALE-INVARIANT); `UCOS-REQ-0001 RC-055`.
**Acceptance criteria:** (1) planetary/oceanic realities have a requirement of record; (2) realized additively on existing `O-10`/`entity` constructs — zero new construct kinds (consistent with `UNIV-ENTITY-001`).

---

## 9. Consolidated temporal-requirement determination

| UR-TIME | RC | Requirement | Class. | Prevailing invariants preserved |
|---------|----|-------------|:------:|---------------------------------|
| UR-TIME-01 | RC-051 | First-class time (valid/transaction/ordering) | STATED | INV-10 |
| UR-TIME-02 | RC-052 | Relativistic time (no global-now; async ratification; CRC) | STATED | INV-6, INV-9, EX1 |
| UR-TIME-03 | RC-053 | Spatial-temporal locality + temporal/causal relationships | STATED | O-15 (additive), INV-1 |
| UR-TIME-04 | RC-054 | Multi-reference frames (federation-locality; single-SoR per frame) | STATED | INV-5, INV-1 |
| UR-TIME-05 | RC-057 | Century-scale continuity (crypto-agility, ledger longevity, succession) | STATED | INV-10, IP-14 |
| UR-TIME-06 | RC-058 | Temporal governance (effective dating, time-scoped authority) | STATED | INV-3, AUTH-009 |
| UR-TIME-07 | RC-055 | Planetary/oceanic reality of record | STATED | O-10 (additive) |

> **Determination.** The **six MISSING temporal requirement classes (RC-052/053/054/055/057/058) are closed at
> the requirements layer**, and the PROPOSED-partial RC-051 is formalized. Every requirement is an **additive
> specialization** reusing ratified mechanisms (INV-10 order; `O-15`/`O-10` localities; PI-5 federation;
> `PEL-001` lifecycle; `EXIST-001` CRC / Reality-Scoped Single-SoR). **No existing architecture is changed; no
> `INV-1..13` is weakened; 0 `REDESIGN`.** The temporal cluster's *outright completeness failure* (CT-F5) is
> thereby discharged **at the requirements layer**; realization (a temporal construct) and any dependent
> invariant enrollment (INV-19 cosmological locality) remain reserved to the Authority Board and a future
> scoped release.

---

## 10. Dependencies & sequencing (recorded, not authorized)

| Dependency | Nature | Status |
|------------|--------|--------|
| `EXIST-001` INV-18↔INV-6 CRC enactment | Underpins UR-TIME-02c determinism preservation | Resolution authored; **Board enactment pending** (`UCOS-INV-0001`) |
| INV-19 (Cosmological Locality) enrollment | Strengthens UR-TIME-03/04 locality binding | PROPOSED (`AUTH-013-AMD-001`); **Board disposition pending** |
| `AUTH-012` chain restoration | Precondition for enrolling any temporal-governance act | RESTORED (v1.0.13), evidentiary attestation pending (`UCOS-AUTH-0001`) |
| Temporal realization (construct/fabric) | Implementation of UR-TIME-01..07 | **Out of scope** — future scoped Article IX release |

---

## 11. Scope discipline

No source code, schema, database, migration, API, service, ontology edit, infrastructure, implementation plan,
roadmap, or architecture was produced. `O-14/O-15`, `INV-1..13`, `AUTH-012`, `AD-0014`, and the Article IX
generation lock are unchanged. This artifact states temporal requirements of record only.

## 12. Traceability

- **Refines:** `UCOS-REQ-0001` (RC-051..058), `UCOS-REQ-0004 §7` (UR-TIME-01..06), `UCOS-GAP-0001/0002`.
- **Reuses (no change):** INV-10; `O-10/O-15`; `PEL-001`; `UCOS-PEA-003`; PI-5 federation; `EXIST-001` CRC & Reality-Scoped Single-SoR; `UNIV-ENTITY-001`.
- **Evidence:** `CIV-STRESS-001` BP-15; `ULT-TEST-001` RM-8/RM-9/FM-10-12; `UCOS-UEA-0007` Q1/Q2; `AUTH-013-AMD-001` (INV-19).
- **Refined by:** `UCOS-INV-0001` (INV-18/INV-19 disposition), `UCOS-AUDIT-0004` (completeness re-evaluation).
- **Owner:** UCOS Authority Board.

**END `UCOS-REQ-0005` — TEMPORAL REQUIREMENTS SPECIFICATION · RC-052/053/054/055/057/058 CLOSED (STATED-REQUIREMENT) · RC-051 FORMALIZED · 0 ARCHITECTURE CHANGE · 0 REDESIGN · INV-1..13 UNCHANGED · REQUIREMENTS ONLY.**
