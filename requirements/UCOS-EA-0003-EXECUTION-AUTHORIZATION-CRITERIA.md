# UCOS-EA-0003 — Execution Authorization Criteria

**Artifact ID:** `UCOS-EA-0003`
**Program:** UCOS Phase 1.1 — Execution Authorization Audit (PARTIAL → READY blocker elimination)
**Phase:** EA-3 — Acceptance Tests & Final Execution Gate
**Mode:** ASSESSMENT ONLY — no code, schema, architecture, requirement, governance, or authority is produced or modified. Defines the **exact acceptance tests** that verify each blocker's closure and the **final execution gate** whose passage is necessary and sufficient to authorize execution.
**Status:** ASSESSMENT BASELINE (v1.0.0)
**Inputs (read-only):** `UCOS-EA-0001/0002`, `UCOS-IR-0005/0006/0007/0008`, `UCOS-AUTH-0001`, `UCOS-INV-0001`.
**Date:** 2026-07-03

---

## 1. Purpose

`UCOS-EA-0002` defined closure criteria and the closure sequence. This artifact makes each criterion **testable**:
every blocker gets an acceptance test (**AT-###**) with an explicit **PASS condition** and the **evidence** that
records the pass. It then composes the tests into the **Final Execution Gate** — a conjunction that must be TRUE
for execution to be authorized.

**Verification rule.** A test PASSES only on **evidence of record** (versioned artifact referenced in the
traceability chain). Intent, plan, or documentary reconciliation alone = FAIL.

---

## 2. Acceptance tests — P0 (integrity gate)

| Test | Verifies | PASS condition | Evidence of record | Verifier |
|------|----------|----------------|--------------------|----------|
| **AT-P0-1** | EA-B-P0-1 | An **independent** party attests the `AUTH-012` chain (AD-0001..0023 @ v1.0.13) and PI-8/PI-9 ratifications; `REAL-H-07` gate returns PASS; self-attestation rejected. | `REAL-C-05` attestation report | Independent adjudicator |
| **AT-P0-2** | EA-B-P0-2 | Independent re-measurement reproduces **269/269** from recorded state; `PROJECT-STATE §0W` divergence reconciled; suite count resolved to one number. | `REAL-M-03` re-run log | Independent re-measurement |
| **AT-P0-3** | EA-B-P0-3 | Board authorization act on record that cites AT-P0-1, AT-P0-2, AT-P1-7 as PASS **and** lifts `UCOS-CONSTRUCTION-BLOCKED` for the authorized scope. | Board act; block-lift record | Authority Board |

---

## 3. Acceptance tests — P1 (soundness / scale gate)

| Test | Verifies | PASS condition | Evidence of record |
|------|----------|----------------|--------------------|
| **AT-P1-7** | EA-B-P1-7 | `UCOM-ULTIMATE-CERT-002` issued: 269/269, memory ACCEPTED, chain state matches AT-P0-1; R14 superseded. | Re-issued `REAL-C-01` cert |
| **AT-P1-1** | EA-B-P1-1 | All 6 audit implementations route through `AUDIT-UNIV-001`; a single tamper-evident, offline-verifiable audit path proven; 0 divergent audit code paths remain. | Stage 6 convergence record; test suite green |
| **AT-P1-2** | EA-B-P1-2 | `AUTH-UNIV-001` subsumes certification/ratification/revocation; per-fabric authority is config-only; 0 duplicated authority code paths. | Stage 6 convergence record; test suite green |
| **AT-P1-3** | EA-B-P1-3 | `LIFE-UNIV-001` replaces 4 state machines; lifecycle profiles are data; 0 parallel lifecycle engines remain. | Stage 6 convergence record; test suite green |
| **AT-P1-4** | EA-B-P1-4 | A new policy predicate is added **with no code change** (registry/metadata only); zero-hardcoding (IP-04) demonstrated. | Extensibility test: add-predicate-without-deploy |
| **AT-P1-8** | EA-B-P1-8 | Memory authorities persisted via `MetadataPort`; 0 in-process authority Maps; memory governance federatable. | Stage 6 convergence record; federation test |
| **AT-P1-5** | EA-B-P1-5 | Durable SoR/cache + distributed adapters operate **beyond ~10⁶** with INV-5/INV-7/INV-10 holding under distribution and partition. | Scale test > 10⁶; `CIV-STRESS-001` re-run |
| **AT-P1-6** | EA-B-P1-6 | Governed platform-class catalog authored over INV-13; RC-029 "any platform" demonstrable at catalog layer. | Platform-class catalog artifact |

---

## 4. Invariant regression guard (applies to every build wave)

Any wave that builds (W4/W5) must additionally re-prove the constitutional floor — a build that closes a P1
blocker but breaks an invariant is a NET FAIL:

| Test | PASS condition |
|------|----------------|
| **AT-INV** | INV-1..13 and non-waivable controls S1/S3/S4/S6 hold on the post-change runtime (`UCOS-IR-0005 §1`); MCR component count unchanged or additive (7 engines / 7 registries / 4 datastores / 5 gov / 7 services); **0 REDESIGN** preserved (`ULT-TEST-001`). |
| **AT-SEQ** | The change introduces **0 forward dependencies** (`UCOS-IR-0006 §3` re-validated). |
| **AT-SCOPE** | No unauthorized scope built: the behavioral/temporal frontier (Stages 8–12) is **not** constructed unless separately authorized; if Stage 9 is in scope, **INV-CORE-12 Non-Actuation is enrolled first** (RISK-P2-4). |

---

## 5. Gate composition

Tests roll up into three named gates, aligned to the closure waves of `UCOS-EA-0002`:

| Gate | Composed of | Satisfies | Authorizes |
|------|-------------|-----------|------------|
| **G0 — Integrity Gate** | AT-P0-1 ∧ AT-P0-2 ∧ AT-P1-7 ∧ AT-P0-3 | Constitutional axis → READY; construction UNBLOCKED | Begin Stage 6 convergence |
| **G1 — Soundness Gate** | AT-P1-1 ∧ AT-P1-2 ∧ AT-P1-3 ∧ AT-P1-4 ∧ AT-P1-8 ∧ AT-INV ∧ AT-SEQ ∧ AT-SCOPE | Architectural axis → READY; Implementation (MCR) → READY | Assert MCR READY; begin Stage 13 |
| **G2 — Scale Gate** | AT-P1-5 ∧ AT-P1-6 ∧ AT-INV ∧ AT-SEQ | Runtime axis → READY (production scale) | Assert full production readiness |

> **G0 is the pivotal gate.** Its AT-P0-3 element is the Board act that lifts `UCOS-CONSTRUCTION-BLOCKED`. Until
> **G0 = PASS**, no build test (G1/G2) is even executable, because building is forbidden under the standing
> block. G0's AT-P0-1/AT-P0-2/AT-P1-7 elements are evidentiary and executable **now**; AT-P0-3 is executable
> only after they pass.

---

## 6. Final Execution Gate

> ### EXECUTION IS AUTHORIZED IF AND ONLY IF **G0 = PASS**.
>
> **Formal condition:**
> `AUTHORIZE ⇔ ( AT-P0-1 ∧ AT-P0-2 ∧ AT-P1-7 ∧ AT-P0-3 ) = TRUE`
>
> - **G0 = PASS** authorizes execution of the **governed forward frontier for the authorized scope** (Stage 6
>   convergence and, thereafter, the stages the Board admits), because the two evidentiary P0 integrity items
>   are discharged, the terminal certificate is truthful, and the Board has lifted the construction block.
> - **G1 = PASS** is required to **assert the Minimum Constitutional Runtime READY** (Constitutional +
>   Architectural + Implementation axes). It is *not* a precondition to *begin* execution — it is the exit
>   criterion of the first build wave.
> - **G2 = PASS** is required to assert **production-scale Runtime READY**.
>
> **Necessary-and-sufficient statement.** G0 is **necessary** (no build may lawfully begin while
> `UCOS-CONSTRUCTION-BLOCKED` stands) and **sufficient** (once integrity is attested and the Board lifts the
> block, the sequence of `UCOS-EA-0002` is forward-dependency-free and every remaining blocker has a mitigation
> of record with 0 REDESIGN). Therefore **G0 is the single execution gate**; G1/G2 are staged exit gates.

### 6.1 Current gate reading (as of 2026-07-03)

| Gate element | Current value | Basis |
|--------------|:-------------:|-------|
| AT-P0-1 | **FAIL** (evidentiary attestation PENDING) | `UCOS-IR-0007` RISK-P0-1; `UCOS-AUTH-0001` |
| AT-P0-2 | **FAIL** (OPEN → closing; not independently reproduced) | RISK-P0-2; `REAL-M-03` |
| AT-P1-7 | **FAIL** (terminal cert stale — R14) | RISK-P1-7 |
| AT-P0-3 | **FAIL** (`UCOS-CONSTRUCTION-BLOCKED` stands; no Board act) | RISK-P0-3 (OPEN by design) |
| **G0** | **FAIL** | any element FALSE ⇒ gate FALSE |

**G0 = FAIL ⇒ AUTHORIZE = FALSE at this time.**

---

## 7. Determination (criteria-level)

> A complete, binary acceptance-test suite (AT-P0-1..3, AT-P1-1..8, plus AT-INV/AT-SEQ/AT-SCOPE guards) verifies
> every blocker, and the **Final Execution Gate reduces to G0**. **G0 currently evaluates FALSE** — all four of
> its elements FAIL — so execution is **not** authorized as of this assessment. The gate is designed to flip to
> TRUE the moment the two evidentiary P0 items and the terminal-cert re-issue pass and the Board lifts the
> construction block; nothing architectural stands in the way (0 REDESIGN).

> **Scope discipline.** No source code, schema, database, migration, API, service, infrastructure, requirement,
> governance, or authority was produced or modified. `INV-1..13`, `AUTH-012` (v1.0.13), `AD-0014`, and the
> Article IX generation lock are unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands.**

## 8. Traceability

- **Consumes:** `UCOS-EA-0001` (blockers), `UCOS-EA-0002` (criteria & sequence), `UCOS-IR-0005` (MCR floor),
  `UCOS-IR-0006` (0-forward-dep), `UCOS-IR-0007/0008` (severities & axis states).
- **Refined by:** `UCOS-EA-0004` (Final Authorization Determination).
- **Owner:** UCOS Authority Board (disposition).

**END `UCOS-EA-0003` — EXECUTION AUTHORIZATION CRITERIA · 14 ACCEPTANCE TESTS · 3 GATES (G0/G1/G2) · FINAL GATE = G0 · G0 CURRENTLY FAIL (4/4 ELEMENTS) · AUTHORIZE = FALSE · 0 REDESIGN · ASSESSMENT ONLY.**
