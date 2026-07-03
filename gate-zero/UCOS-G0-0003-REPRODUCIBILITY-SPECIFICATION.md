# UCOS-G0-0003 — Gate Zero Reproducibility Specification

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-G0-0003` |
| Program | **UCOS Gate Zero Authority — Final G0 Dossier** |
| Phase | G0-3 — Reproducibility Package |
| Mode | **REPRODUCIBILITY SPECIFICATION ONLY** — defines the exact reproducibility evidence that discharges EA-B-P0-2. Performs no re-measurement and re-runs no suite. |
| Status | G0 DOSSIER BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Inputs (read-only, frozen) | `UCOS-G0-0001` (P0-2.a..c); `UCOS-EA-0001/0002/0003`; `UCOS-RA-0007 §2`; `UCOS-EP-0005 §1`; `PROJECT-STATE §0W`; `REAL-M-03` instrument; `CIV-STRESS-001` (scale bound, out of G0 scope) |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. No self-attestation. |

---

## 0. Purpose & scope

This artifact specifies the **exact reproducibility evidence** whose existence-of-record satisfies **AT-P0-2**
and closes **EA-B-P0-2** (atomic requirements `P0-2.a..c` of `UCOS-G0-0001`). It answers three questions:
**what must be reproduced**, **by whom**, and **how equivalence is proven**. It binds production package
`EWP-00-REMEAS` (approval class **A**, `UCOS-EP-0005 §1`) and is executable **now, under the standing block** —
re-measurement is evidentiary, not a build (`UCOS-RA-0007 §2`).

**Independence rule (non-waivable).** The re-measurer must be **independent of the authoring party**; self-run
by the author is rejected (`UCOS-EP-0005 §2`; `UCOS-EXEC-0001` Prohibition 12).

---

## 1. What must be reproduced

| # | Reproduction target | Recorded reference (baseline) | Required reproduced result | Atomic req. |
|:--:|---------------------|-------------------------------|----------------------------|:-----------:|
| **R-1** | Full recorded test corpus from the recorded program state | Reproduced program state = **269/269** | **269/269** (bit-for-bit pass count) | P0-2.a |
| **R-2** | The `PROJECT-STATE §0W` historical divergence | Historical §0W = **213/213**, "Memory **REJECTED**" | Reconciled to 269/269 & memory **ACCEPTED**, with the divergence explained of record | P0-2.b |
| **R-3** | Suite-count discrepancy | **36 vs 40** (two numbers of record) | **One** suite count of record; the other explained/retired | P0-2.c |

> Scale reproduction (`CIV-STRESS-001`, > 10⁶ users) is **out of G0 scope** — it belongs to Gate 2/Gate 3
> (EA-B-P1-5, `UCOS-EP-0006`). G0 reproducibility concerns the **269/269 program-state** correctness only.

---

## 2. By whom (producer & verifier)

| Role | Party | Constraint |
|------|-------|-----------|
| **Producer** | Independent re-measurer | Distinct from the authoring/self-attesting process (`UCOS-EP-0008 §1`) |
| **Verifier** | Same independent re-measurer records the result; the re-run itself is the verification | Deterministic; reproducible by a third party from the recorded state |
| **Acceptance authority** | UCOS Authority Board | Accepts `REAL-M-03` of record (not a lift act) |

---

## 3. Required reproducibility evidence (documents & artifacts)

| Doc/Artifact | Title | Content |
|--------------|-------|---------|
| **RM-1** | `REAL-M-03` independent re-run log | Environment fingerprint; recorded-state reference; per-suite pass/fail; total = 269/269 |
| **RM-2** | §0W reconciliation note | Explains 213/213 & "Memory REJECTED" → 269/269 & "Memory ACCEPTED"; identifies the cause of the historical divergence |
| **RM-3** | Suite-count-of-record note | Fixes the single suite count; retires/explains the 36-vs-40 discrepancy |
| **RM-4** | Board acceptance record | Authority Board accepts RM-1..RM-3 of record (append-only, `AUTH-012`) |

All are versioned and referenced from the traceability chain; absence of any leaves the corresponding atomic
requirement `UNMET`.

---

## 4. How equivalence is proven

Equivalence = the independent re-run is **provably the same measurement** as the recorded 269/269, and the
historical divergence is **explained rather than ignored**.

| Equivalence test | Proof obligation | PASS condition |
|------------------|------------------|----------------|
| **EQ-1 — count equivalence** | Independent re-run total equals the recorded total | re-run = **269/269**; delta = 0 |
| **EQ-2 — state equivalence** | Re-run executed from the *recorded program state*, not a fresh/altered state | state fingerprint in RM-1 matches the recorded reference |
| **EQ-3 — divergence reconciliation** | The 213/213 & "Memory REJECTED" record is reconciled to the reproduced result | RM-2 states the cause; memory disposition = ACCEPTED consistent with P0-1 attestation |
| **EQ-4 — count-of-record uniqueness** | Exactly one suite count survives | RM-3 fixes one number; 36-vs-40 resolved |
| **EQ-5 — independence** | The re-measurer is not the author | RM-1 independence declaration present |

> **Equivalence proven ⇔ EQ-1 ∧ EQ-2 ∧ EQ-3 ∧ EQ-4 ∧ EQ-5.** A re-run that yields 269/269 but cannot show
> EQ-2 (same recorded state) or EQ-5 (independence) does **not** prove equivalence and does **not** close P0-2.

### 4.1 Cross-consistency with P0-1

The memory disposition reproduced here (memory **ACCEPTED**) must be **consistent with the P0-1 attestation** of
PI-9 (`MEM-RAT-003`, `UCOS-G0-0002 §1` S-3) and with the certificate re-issue (`UCOS-G0-0004`). A contradiction
between the reproduced memory disposition and the attested chain state holds **both** AT-P0-1 and AT-P0-2 at
FAIL.

---

## 5. Verification chain

```
Recorded program state  +  recorded test corpus
        │
        ▼
[Independent re-measurer] ── re-runs corpus ──► REAL-M-03 log (RM-1)   [269/269, EQ-1/EQ-2/EQ-5]
        │
        ├──► §0W reconciliation (RM-2)   [EQ-3: 213/213 "REJECTED" → 269/269 "ACCEPTED"]
        └──► suite-count-of-record (RM-3) [EQ-4: 36 vs 40 → one number]
        │
        ▼
[Authority Board] ── accepts of record ──► RM-4 on AUTH-012
        │
        ▼
AT-P0-2 = PASS   ⇒  EA-B-P0-2 CLOSED   ⇒  cross-consistency feeds P1-7 (UCOS-G0-0004) & P0-3 (UCOS-G0-0005)
```

---

## 6. Acceptance condition

> **AT-P0-2 = PASS** iff RM-1..RM-4 exist of record and EQ-1..EQ-5 all hold. Any missing artifact, any failed
> equivalence test, a fresh-state (non-recorded) re-run, or a non-independent re-measurer ⇒ **AT-P0-2 = FAIL**
> ⇒ EA-B-P0-2 remains OPEN.

### 6.1 Current reading (as of 2026-07-03)

| Element | State | Basis |
|---------|:-----:|-------|
| RM-1 `REAL-M-03` | **ABSENT** | `UCOS-EA-0003 §6.1` AT-P0-2 = FAIL ("OPEN → closing; not independently reproduced") |
| RM-2 §0W reconciliation | **ABSENT** | divergence not yet independently reconciled |
| RM-3 suite-count-of-record | **ABSENT** | 36-vs-40 unresolved (`UCOS-EA-0001 §6` P3-2) |
| **AT-P0-2** | **FAIL** | not independently reproduced |

---

## 7. Determination (reproducibility-level)

> The reproducibility package for EA-B-P0-2 is **fully specified**: three reproduction targets (269/269
> re-run, §0W reconciliation, suite-count resolution), an independent producer, four evidence artifacts
> (RM-1..RM-4), and five equivalence tests (EQ-1..EQ-5) plus P0-1 cross-consistency. It is **executable now
> under the standing block** (no build). As of this dossier the package is **ABSENT of record** ⇒
> **AT-P0-2 = FAIL**. Nothing here requires redesign or a new requirement.

## 8. Scope discipline

No re-measurement was performed, no suite re-run, no lock lifted. INV-1..13, `AUTH-012`, `AD-0014`, Article IX
lock unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands.**

## 9. Traceability

- **Consumes:** `UCOS-G0-0001` (P0-2.a..c); `UCOS-EA-0002 §2.1`; `UCOS-EA-0003 §2`; `UCOS-RA-0007 §2`;
  `UCOS-EP-0005 §1`; `PROJECT-STATE §0W`.
- **Feeds:** `UCOS-G0-0004` (cert re-issue cross-consistency); `UCOS-G0-0005` (P0-3.b); `UCOS-G0-0006`.
- **Owner:** UCOS Authority Board.

**END `UCOS-G0-0003` — REPRODUCIBILITY SPECIFICATION · 3 TARGETS (269/269 · §0W RECONCILE · SUITE-COUNT) · INDEPENDENT RE-MEASURER · 4 ARTIFACTS · 5 EQUIVALENCE TESTS · P0-1 CROSS-CONSISTENCY · EXECUTABLE UNDER STANDING BLOCK · CURRENTLY AT-P0-2 = FAIL (PACKAGE ABSENT) · SPECIFICATION ONLY.**
