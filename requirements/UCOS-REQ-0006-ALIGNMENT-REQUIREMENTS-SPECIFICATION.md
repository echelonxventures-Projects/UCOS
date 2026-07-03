# UCOS-REQ-0006 — Alignment Requirements Specification

**Artifact ID:** `UCOS-REQ-0006`
**Phase:** Phase 0.5 — Constitutional Gap Closure & Ratification (Alignment Cluster Closure)
**Mode:** REQUIREMENTS DISCOVERY / SPECIFICATION ONLY — no code, schema, architecture, or implementation design is produced. Alignment requirements are **stated as governed requirements of record**; no PI-10 build, no adapter, no design is authored here.
**Status:** RATIFIED BASELINE (v1.0.0) — closes the MISSING alignment requirement class.
**Subordinate to:** `UCOS-REQ-0001..0004`, `UCOS-AUDIT-0001..0003`, `UCOS-GAP-0001/0002`, the Authority Layer (`AUTH-001..012`), and the Constitution (`UCOS-CONST-001`).
**Governing invariants:** `INV-1..INV-13` (binding). `INV-CORE-12` (Non-Actuation) is DEFINED, not enrolled (`UA-05`); its enrollment is analyzed in `UCOS-INV-0001` and reserved to the Authority Board.
**Closes:** GAP-R65 · MISSING class **RC-065 (Alignment)**; records the **RC-020 ≡ RC-048** Unknown-Future admission protocol (GAP-R20/48).
**Date:** 2026-07-03

---

## 0. Purpose, scope, and non-scope

The frozen audit baseline classifies **RC-065 Alignment** as MISSING: the guarantee that autonomous actors are
*provably bounded* (propose-not-act, deny-by-default, Evolution-only commit, no self-authored goals, no
self-modification, no autonomous actuation) exists **only as design** (`INT-GOV-001`), with `INV-CORE-12
Non-Actuation` **DEFINED but not enrolled** and PI-10 **unbuilt** (`UCOS-REQ-0001 RC-065`; `UCOS-REQ-0004 §10
UR-EXE-03`; `UCOS-AUDIT-0001 §2.5`).

This specification closes RC-065 by **stating the alignment requirements of record**. Per the Phase 4 charter it
does so **without creating implementation designs**:

- **In scope:** governed alignment requirement statements (`UR-ALIGN-*`) across the five charter alignment
  dimensions (Human, Organizational, Constitutional, Policy, AI), their classification transition (MISSING →
  STATED-REQUIREMENT), evidence anchors, acceptance criteria, and the Unknown-Future admission protocol
  (RC-020≡048).
- **Explicitly out of scope (prohibited here):** any PI-10 Intelligence build, adapter, alignment engine,
  verifier implementation, schema, ADR, or code; any enrollment of `INV-CORE-12` (reserved to the Board,
  analyzed in `UCOS-INV-0001`); any change to `INV-1..13`, `AUTH-012`, or `AD-0014`.

> **No-redesign / no-implementation guarantee.** Each requirement below reuses ratified mechanisms
> (deny-by-default INV-3; Evolution-only commit INV-10/PI-6; determinism-quarantine `EXIST-001` CRC-2;
> human/Board-in-the-loop `INT-GOV-001`/`CIV-GOV-001`). Where an alignment requirement and an `INV-1..13`
> invariant appear to conflict, **the ratified invariant prevails.** Consistent with `ULT-TEST-001` (0
> `REDESIGN`), alignment is stated as an **additive governance requirement**, not a new mechanism.

---

## 1. Alignment requirement-class map

| RC | Class | Prior class. | This artifact | UR-ALIGN | Gap |
|----|-------|:------------:|:-------------:|:--------:|-----|
| RC-065 | Alignment | MISSING | **STATED-REQUIREMENT** | UR-ALIGN-01..05 | GAP-R65 |
| RC-020 (≡ RC-048) | Future Discovery admission protocol | MISSING | **STATED-REQUIREMENT** | UR-ALIGN-06 | GAP-R20/48 |

The charter defines alignment across **five dimensions**. Each is stated below as a governed requirement,
anchored to the existing design-only artifacts of record and to binding invariants.

---

## 2. Human Alignment (UR-ALIGN-01)

**Requirement statement.** Autonomous and semi-autonomous actors shall remain **aligned to human intent and
control**: no governed action that affects a system-of-record shall occur without a **human/Board decision in
the loop** at the governed commit boundary.

- **UR-ALIGN-01a — Human-in-the-loop commit.** Any cognitive/autonomous output may **propose** but never
  **commit**; the commit is a human/Board-authorized Evolution act (INV-10; PI-6 sole mutation path).
- **UR-ALIGN-01b — Explainability to humans.** Every proposed action shall carry an explainable rationale chain
  sufficient for human review (`INT-AUD-001` design; charter principle "Explainability").
- **UR-ALIGN-01c — Overridable & reversible-by-forward-migration.** Humans shall be able to reject/withhold any
  proposal; accepted actions are correctable only by forward migration, never destructive rollback (IP-14).

**Classification:** STATED-REQUIREMENT (was MISSING).
**Evidence anchors:** `INT-GOV-001` (human/Board-in-loop, propose-not-act); `UR-EXE-02` (explainable, Evolution-only commit); INV-10; IP-14; charter principle 11 (Explainability).
**Acceptance criteria:** (1) no autonomous commit path exists of record; (2) proposals are explainable; (3) rejection/override is always available and fail-closed.

---

## 3. Organizational Alignment (UR-ALIGN-02)

**Requirement statement.** Actors shall remain aligned to the **owning organization's sovereignty, boundaries,
and single-ownership**: no actor shall act across a bounded-context or federation boundary except by contract,
and never override a local single-owner system-of-record.

- **UR-ALIGN-02a — Sovereignty-respecting.** Foreign/cross-org constructs are advisory / deny-only,
  namespace-isolated, and never override a local SoR (INV-5; `FED-GOV-001`; UR-GOV-06).
- **UR-ALIGN-02b — Contract-first action.** Cross-boundary effect is contract-first, versioned, and
  partition-tolerant (INV-1; `UCOS-SVC-ARCH-001`).
- **UR-ALIGN-02c — Aggregate-only population handling.** Where actors reason over populations, data shall be
  aggregate-only (no PII, no re-identification) (`CIV-GOV-001`; UR-CIV-03).

**Classification:** STATED-REQUIREMENT (was MISSING).
**Evidence anchors:** INV-1/INV-5; `FED-GOV-001`; `UR-GOV-06`; `CIV-GOV-001` (population privacy).
**Acceptance criteria:** (1) no cross-boundary override of a local SoR; (2) all cross-boundary action is contract-first; (3) population reasoning is aggregate-only.

---

## 4. Constitutional Alignment (UR-ALIGN-03)

**Requirement statement.** All actor behavior shall remain **subordinate to the Authority Layer and
Constitution**: no actor may author goals, self-modify, or take actions that contradict a higher-precedence
artifact, and no actor may become an authority above the Authority Board within an instance.

- **UR-ALIGN-03a — No self-authored goals.** Actors execute only governed, authorized objectives; goal-setting
  is a governed human/Board act (`INT-GOV-001`).
- **UR-ALIGN-03b — No self-modification.** Actors shall not modify their own governing constructs, policies, or
  authority; any change routes through Evolution + governance (INV-10; AUTH-009).
- **UR-ALIGN-03c — Precedence subordination.** Actor behavior yields to Authority > Constitution > Architecture
  > Specifications (`AUTH-009 §6.2`); a proposed action that contradicts a higher artifact is denied
  (deny-by-default, INV-3).
- **UR-ALIGN-03d — No new supreme authority.** No actor/civilization construct constitutes an authority above
  the Board within an instance (`CIV-GOV-001` federated-governance; UR-CIV-04).

**Classification:** STATED-REQUIREMENT (was MISSING).
**Evidence anchors:** `AUTH-009` precedence; INV-3; INV-10; `INT-GOV-001`; `CIV-GOV-001` (GT-0..GT-3, no authority above Board).
**Acceptance criteria:** (1) no self-authored goals of record; (2) no self-modification path; (3) contradiction with higher-precedence artifact ⇒ deny; (4) no supra-Board authority.

---

## 5. Policy Alignment (UR-ALIGN-04)

**Requirement statement.** Actor behavior shall remain **aligned to the governed policy set**: every action is
policy-evaluated under deny-by-default, deny-overrides-allow, and priority ordering, with no behavior outside
the governed policy vocabulary.

- **UR-ALIGN-04a — Policy-evaluated action.** Every proposed action is evaluated by the governed policy engine
  before it may be proposed for commit (IP-05; PI-4 `policy-evaluator`).
- **UR-ALIGN-04b — Deny-by-default / deny-overrides-allow.** Absence of an authorizing policy denies; any
  applicable deny prevails (INV-3; RC-060 logical foundations).
- **UR-ALIGN-04c — Extensible-yet-governed vocabulary.** New policy predicates enter by governed
  registration/metadata (closing GAP-M3 additively), never by ungoverned code paths.

**Classification:** STATED-REQUIREMENT (was MISSING).
**Evidence anchors:** IP-05 (policy-driven); INV-3; RC-060 (`policy-evaluator.ts`); GAP-M3 (extensible predicate vocabulary).
**Acceptance criteria:** (1) no action bypasses policy evaluation; (2) deny-by-default holds; (3) predicate vocabulary is governed-extensible.

---

## 6. AI Alignment (UR-ALIGN-05) — the enrolled-invariant core

**Requirement statement.** Autonomous **AI/cognitive** actors shall be **provably bounded** — this is the direct
statement of RC-065 and the enrollment target of `INV-CORE-12` (Non-Actuation): **propose-not-act,
deny-by-default, Evolution-only commit, no self-authored goals, no self-modification, no autonomous actuation.**

- **UR-ALIGN-05a — Non-actuation (enrollment target).** No AI/cognitive actor shall actuate any effect on a
  system-of-record or the physical/operational world directly; all effect is mediated by the governed commit
  path behind a deterministic verifier. This requirement is the requirements-layer counterpart of the
  DEFINED-not-enrolled `INV-CORE-12`; **enrollment is reserved to the Authority Board** (analyzed in
  `UCOS-INV-0001`).
- **UR-ALIGN-05b — Determinism-quarantine of cognition.** Non-deterministic cognitive output is sandboxed and
  advisory, off the commit path, admissible only through a deterministic verifier — reusing `EXIST-001` CRC-2
  verbatim; the verifier's decision (not the AI output) is recorded/committed (EX1/EX2/EX3).
- **UR-ALIGN-05c — Adversarial assurance of record.** AI alignment shall be validated against a governed
  adversarial suite (the `INT-*` I1–I12 threat set; 0 residual High/High) before any AI actor is authorized.
- **UR-ALIGN-05d — Explainable & auditable.** Every AI proposal carries a rationale chain and is fully audited
  (RC-066 risk; UR-GOV-04/05).

**Classification:** STATED-REQUIREMENT (was MISSING); the load-bearing element of RC-065 closure.
**Evidence anchors:** `INT-GOV-001` (alignment principles, design); `INV-CORE-12 Non-Actuation` (DEFINED, `UA-05`); `EXIST-001` CRC-2 (determinism-quarantine + verifier gate); `INT-*` I1–I12 adversarial threat model; UR-EXE-03.
**Acceptance criteria:** (1) no AI actuation path of record; (2) non-deterministic cognition is verifier-gated and off the commit path; (3) adversarial suite passes with 0 residual High/High before authorization; (4) every AI proposal is explainable and audited.

---

## 7. Unknown-Future Admission Protocol (UR-ALIGN-06 · RC-020 ≡ RC-048)

**Requirement statement.** A **closed, governed admission protocol** shall exist so that currently-unknowable
requirement/construct classes — including new alignment obligations for new actor species/realities — enter the
baseline by **registration, not by re-authoring it**, and never bypass alignment or governance.

- **UR-ALIGN-06a — Requirements-layer admission gate.** New requirement/construct classes are admitted only via
  a governed gate (the requirements-layer companion to Meta-Core registration + federation), preserving INV-13's
  five extension mechanisms (registration/metadata/configuration/composition/federation).
- **UR-ALIGN-06b — Alignment-preserving admission.** Any admitted future construct inherits UR-ALIGN-01..05 by
  default (deny-by-default alignment): an admitted construct that cannot demonstrate alignment conformance is
  rejected, not absorbed (mirrors `AUTH-013 §5` R-4 unknown-future boundedness).
- **UR-ALIGN-06c — No redesign admission.** Anything requiring foundation redesign is **rejected**, never
  admitted (INV-13; `ULT-TEST-001` 0 REDESIGN).

**Classification:** STATED-REQUIREMENT (was MISSING); consolidates RC-020 and RC-048 into one intent per
`UCOS-AUDIT-0003` D-1.
**Evidence anchors:** INV-13 (C-EX1..5); `O-16 Unknown Future Entity`; `UCOS-UEA-0001` L14; `PHASE-UA-04-UNKNOWN-READINESS-001`; `AUTH-013-AMD-001` INV-20; `UCOS-AUDIT-0003` D-1.
**Acceptance criteria:** (1) a governed requirements-admission gate is of record; (2) admitted constructs inherit alignment by default; (3) redesign-requiring items are rejected.

---

## 8. Consolidated alignment-requirement determination

| UR-ALIGN | Dimension | Requirement | Class. | Prevailing invariants preserved |
|----------|-----------|-------------|:------:|---------------------------------|
| UR-ALIGN-01 | Human | Human-in-the-loop, explainable, overridable | STATED | INV-10, IP-14 |
| UR-ALIGN-02 | Organizational | Sovereignty-respecting, contract-first, aggregate-only | STATED | INV-1, INV-5 |
| UR-ALIGN-03 | Constitutional | No self-goals/self-mod; precedence-subordinate; no supra-Board | STATED | AUTH-009, INV-3, INV-10 |
| UR-ALIGN-04 | Policy | Policy-evaluated, deny-by-default, governed vocabulary | STATED | INV-3, IP-05 |
| UR-ALIGN-05 | AI | Non-actuation, determinism-quarantine, adversarial-assured, explainable | STATED | INV-3, INV-10, EX1 (CRC-2) |
| UR-ALIGN-06 | Admission | Governed unknown-future admission, alignment-preserving | STATED | INV-13 |

> **Determination.** **RC-065 Alignment is closed at the requirements layer** across all five charter
> dimensions, and the **RC-020 ≡ RC-048 Unknown-Future admission protocol** is stated of record. Every
> requirement reuses ratified mechanisms and creates **no implementation design**. The load-bearing element —
> AI Non-Actuation (UR-ALIGN-05a) — is stated as the requirements-layer counterpart of `INV-CORE-12`; its
> **invariant enrollment and any PI-10 build remain reserved to the Authority Board** (enrollment analyzed in
> `UCOS-INV-0001`; build is a future scoped Article IX release). **No `INV-1..13` is weakened; 0 REDESIGN; no
> implementation design produced.**

---

## 9. Dependencies & sequencing (recorded, not authorized)

| Dependency | Nature | Status |
|------------|--------|--------|
| `INV-CORE-12` (Non-Actuation) enrollment | Makes UR-ALIGN-05a a binding invariant | DEFINED not enrolled; **Board act** (`UCOS-INV-0001`) |
| `EXIST-001` CRC-2 enactment | Underpins UR-ALIGN-05b determinism-quarantine | Resolution authored; **Board enactment pending** |
| `INT-*` I1–I12 adversarial suite | Precondition for authorizing any AI actor | Design of record; **build/validation out of scope** |
| PI-10 Intelligence build | Realization of AI alignment | **Out of scope** — future scoped Article IX release (`AD-0024`+) |
| `AUTH-012` chain restoration | Precondition for enrolling alignment invariant | RESTORED (v1.0.13); attestation pending (`UCOS-AUTH-0001`) |

---

## 10. Scope discipline

No source code, schema, database, migration, API, service, infrastructure, implementation plan, roadmap, or
architecture/implementation design was produced. `INV-1..13`, `INV-CORE-12` (not enrolled here), `AUTH-012`,
`AD-0014`, and the Article IX generation lock are unchanged. This artifact states alignment requirements of
record only.

## 11. Traceability

- **Refines:** `UCOS-REQ-0001` (RC-065, RC-020, RC-048), `UCOS-REQ-0004 §10` (UR-EXE-03), `UCOS-GAP-0001/0002`.
- **Reuses (no change):** INV-1/INV-3/INV-5/INV-10; IP-05/IP-14; PI-6 Evolution; `EXIST-001` CRC-2; `INT-GOV-001`; `CIV-GOV-001`; INV-13 (C-EX1..5); `O-16`.
- **Evidence:** `INV-CORE-12` (`UA-05`); `INT-*` I1–I12; `PHASE-UA-04-UNKNOWN-READINESS-001`; `AUTH-013-AMD-001` INV-20; `UCOS-AUDIT-0003` D-1.
- **Refined by:** `UCOS-INV-0001` (INV-CORE-12 disposition), `UCOS-AUDIT-0004` (completeness re-evaluation).
- **Owner:** UCOS Authority Board.

**END `UCOS-REQ-0006` — ALIGNMENT REQUIREMENTS SPECIFICATION · RC-065 CLOSED (STATED-REQUIREMENT) · HUMAN/ORG/CONSTITUTIONAL/POLICY/AI ALIGNMENT + UNKNOWN-FUTURE ADMISSION STATED · 0 IMPLEMENTATION DESIGN · 0 REDESIGN · INV-1..13 UNCHANGED · REQUIREMENTS ONLY.**
