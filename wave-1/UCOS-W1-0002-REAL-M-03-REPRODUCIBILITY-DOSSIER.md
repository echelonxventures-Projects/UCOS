# UCOS-W1-0002 — REAL-M-03 Reproducibility Dossier

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-W1-0002` |
| Program | **UCOS Wave 1 — Independent Evidence Package Generation** |
| Phase | W1-2 — Reproducibility Package |
| Closes toward | **EA-B-P0-2** (AT-P0-2) via evidence instrument **`REAL-M-03`** |
| Mode | **PREPARATION ARTIFACT ONLY** — blank procedures, protocols, and forms for an **independent re-measurer**. Contains no measurements, no results. Performs no re-measurement. |
| Status | EVIDENCE-PACKAGE TEMPLATE (v1.0.0) — **UNEXECUTED** |
| Date | 2026-07-03 |
| Inputs (read-only, frozen) | `UCOS-G0-0001 §2`; `UCOS-G0-0003`; `UCOS-EA-0002 §2.1`; `UCOS-EA-0003 §2`; `UCOS-RA-0007 §2`; `UCOS-EP-0005 §1`; `PROJECT-STATE §0W`; `REAL-M-03` instrument |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. **No self-run by the author. No lock lift.** |

> **Filling rule.** Every `⟨…⟩` / `[ ]` field is completed **only by the independent re-measurer** at execution
> time. As issued this dossier is **UNEXECUTED**; all results are **PENDING**; **269/269 is a target, not a
> claim.** Producing this dossier asserts no reproduction and does not close EA-B-P0-2.

---

## 1. Purpose

To equip an **independent re-measurer** (no authoring role) with the complete protocol set to produce
**`REAL-M-03`** — the independent re-measurement that reproduces the recorded program state, reconciles the
`PROJECT-STATE §0W` divergence, and resolves the suite-count discrepancy — satisfying **AT-P0-2** and closing
**EA-B-P0-2**.

## 2. Reproduction targets (what must be reproduced — `UCOS-G0-0003 §1`)

| # | Target | Recorded baseline | Required reproduced result | Recorded |
|:--:|--------|-------------------|----------------------------|:--------:|
| R-1 | Full test corpus from recorded program state | reproduced state = 269/269 | **269/269** | `⟨n/269⟩` |
| R-2 | `PROJECT-STATE §0W` divergence | 213/213, "Memory REJECTED" | reconciled → 269/269, memory ACCEPTED | `⟨____⟩` |
| R-3 | Suite-count discrepancy | 36 vs 40 | **one** number of record | `⟨count⟩` |

> Scale (`CIV-STRESS-001`, > 10⁶) is **out of G0 scope** (Gate 2/3, EA-B-P1-5). This package covers 269/269
> correctness only.

## 3. Measurement procedures

| Step | Procedure | Record in |
|:--:|-----------|-----------|
| MP-1 | Capture environment fingerprint (toolchain, OS, versions, commit/state ref) | Form RF-1 |
| MP-2 | Load the **recorded program state** (not a fresh/altered state); record the state reference | Form RF-1 |
| MP-3 | Enumerate the recorded test corpus; record suite count and per-suite identity | Form RF-2 |
| MP-4 | Execute the corpus deterministically; record per-suite pass/fail and total | Form RF-2 |
| MP-5 | Record the memory disposition observed (ACCEPTED/REJECTED) | Form RF-2 |

## 4. Reproduction procedures

| Step | Procedure | Record in |
|:--:|-----------|-----------|
| RP-1 | Compare MP-4 total against baseline **269/269**; compute delta | Form RF-3 (EQ-1) |
| RP-2 | Confirm MP-2 state fingerprint matches the recorded reference | Form RF-3 (EQ-2) |
| RP-3 | Reconcile the historical §0W record (213/213, "Memory REJECTED") to the reproduced result; state the cause | Form RF-4 (EQ-3) |
| RP-4 | Resolve 36-vs-40 to a single suite count of record; explain/retire the other | Form RF-4 (EQ-4) |
| RP-5 | Affirm independence (re-measurer ≠ author) | Form RF-1 (EQ-5) |

## 5. Equivalence tests (from `UCOS-G0-0003 §4`)

| Test | Proof obligation | PASS condition | Result |
|------|------------------|----------------|:------:|
| EQ-1 count | re-run total = recorded total | 269/269; delta = 0 | `⟨PASS/FAIL⟩` |
| EQ-2 state | run from recorded state | fingerprint matches | `⟨PASS/FAIL⟩` |
| EQ-3 divergence | §0W reconciled | cause stated; memory ACCEPTED | `⟨PASS/FAIL⟩` |
| EQ-4 uniqueness | one suite count survives | 36-vs-40 resolved | `⟨PASS/FAIL⟩` |
| EQ-5 independence | re-measurer ≠ author | declaration present | `⟨PASS/FAIL⟩` |
| **X-P0-1** cross-consistency | memory disposition consistent with PI-9 attestation (`UCOS-W1-0001` S-3) | no contradiction | `⟨PASS/FAIL⟩` |

## 6. Pass/Fail rules

- **AT-P0-2 = PASS** iff **EQ-1 ∧ EQ-2 ∧ EQ-3 ∧ EQ-4 ∧ EQ-5 ∧ X-P0-1** all PASS **and** forms RF-1..RF-5 are of
  record, versioned, referenced in the traceability chain.
- **AT-P0-2 = FAIL** if any of:

| ID | Fail trigger |
|----|--------------|
| RJ-1 | Re-run total ≠ 269/269 (EQ-1 FAIL) |
| RJ-2 | Run executed from fresh/altered (non-recorded) state (EQ-2 FAIL) |
| RJ-3 | §0W divergence not reconciled / cause not stated (EQ-3 FAIL) |
| RJ-4 | Suite count not resolved to one number (EQ-4 FAIL) |
| RJ-5 | Re-measurer not independent (EQ-5 FAIL) — prohibited (`UCOS-EP-0005 §2`) |
| RJ-6 | Reproduced memory disposition contradicts the P0-1 attestation (X-P0-1 FAIL) |

> On any fail: **remain BLOCKED**; EA-B-P0-2 stays OPEN; re-run W1 re-measurement.

## 7. Independent verification instructions

1. Affirm independence (RF-1); if not independent, **STOP** (RJ-5).
2. Execute MP-1..MP-5, then RP-1..RP-5, recording each in the named form.
3. Evaluate EQ-1..EQ-5 and X-P0-1 (§5); apply §6 pass/fail rules.
4. Complete RF-5 (`REAL-M-03` cover); submit to Authority Board for acceptance (RF-6).
5. Board acceptance records evidence only — **not a lock-lift** (`UCOS-G0-0005`).

---

## EVIDENCE RECORDING FORMS

### Form RF-1 — Environment & Independence

```
Re-measurer (independent): ⟨____⟩     Independence affirmed (EQ-5): [ ]
Toolchain/OS/versions: ⟨____⟩          Recorded-state reference (EQ-2): ⟨____⟩
State fingerprint: ⟨____⟩
```

### Form RF-2 — Measurement Log

| Suite # | Suite identity | Pass/Fail | Notes |
|:--:|----------------|:---------:|-------|
| `⟨1⟩` | `⟨____⟩` | `⟨P/F⟩` | `⟨____⟩` |
| … | … | … | … |
| **Totals** | suites = `⟨count⟩` (R-3) | passes = `⟨n⟩` / `⟨total⟩` | memory disposition = `⟨ACCEPTED/REJECTED⟩` |

### Form RF-3 — Count & State Equivalence

```
Re-run total: ⟨n/269⟩   Delta vs 269: ⟨____⟩   EQ-1: ⟨PASS/FAIL⟩
State match:  ⟨yes/no⟩                          EQ-2: ⟨PASS/FAIL⟩
```

### Form RF-4 — §0W Reconciliation & Suite-Count Resolution

```
Historical §0W: 213/213, "Memory REJECTED"
Reproduced:     ⟨n/269⟩, memory ⟨ACCEPTED/REJECTED⟩
Cause of divergence: ⟨____⟩                      EQ-3: ⟨PASS/FAIL⟩
Suite-count-of-record: ⟨count⟩   (36-vs-40 resolved: ⟨explain/retire⟩)  EQ-4: ⟨PASS/FAIL⟩
```

### Form RF-5 — `REAL-M-03` Cover Sheet

```
REAL-M-03 INDEPENDENT RE-MEASUREMENT — COVER
Re-measurer (independent): ⟨____⟩     Independence: [ ]
EQ-1 [ ] EQ-2 [ ] EQ-3 [ ] EQ-4 [ ] EQ-5 [ ] X-P0-1 [ ]
Overall: ⟨REPRODUCED / NOT-REPRODUCED⟩
Signature: ____________________   Date: ⟨____⟩
```

### Form RF-6 — Board Acceptance of Evidence *(not a lock-lift)*

```
AUTHORITY BOARD — ACCEPTANCE OF REAL-M-03 EVIDENCE OF RECORD
Accepts RF-1..RF-5 as of record on AUTH-012 (append-only): [ ]
NOTE: Records evidence only. Does NOT lift UCOS-CONSTRUCTION-BLOCKED.
Board signatory: ____________________   Date: ⟨____⟩
```

---

## 8. Determination (package-level)

> A **complete, blank reproducibility package**: three targets, measurement procedures (MP-1..5), reproduction
> procedures (RP-1..5), six equivalence tests (EQ-1..5 + X-P0-1), pass/fail rules, verification instructions,
> and six recording forms (RF-1..6). As issued it is **UNEXECUTED** — **no measurement exists; 269/269 is not
> claimed; AT-P0-2 remains FAIL.** Sufficiency for third-party execution: **YES**.

## 9. Scope discipline

No re-measurement performed, no suite executed, no lock lifted, no self-run by any authoring party. INV-1..13,
`AUTH-012`, `AD-0014`, Article IX lock unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands.**

## 10. Traceability

- **Consumes:** `UCOS-G0-0001 §2`; `UCOS-G0-0003`; `UCOS-EA-0002 §2.1`; `UCOS-RA-0007 §2`; `UCOS-EP-0005 §1`;
  `PROJECT-STATE §0W`.
- **Feeds:** `UCOS-W1-0003` (register), `UCOS-W1-0004` (cert grounding), `UCOS-W1-0005` (Board LE-2),
  `UCOS-W1-0006` (submission).
- **Owner (of the act):** Independent re-measurer (producer); UCOS Authority Board (acceptance authority).

**END `UCOS-W1-0002` — REAL-M-03 REPRODUCIBILITY DOSSIER · 3 TARGETS · MP/RP PROCEDURES · EQ-1..5 + X-P0-1 · PASS/FAIL RULES · FORMS RF-1..RF-6 · UNEXECUTED · 269/269 IS A TARGET NOT A CLAIM · AT-P0-2 = FAIL · NO LOCK LIFT · PREPARATION ARTIFACT ONLY.**
