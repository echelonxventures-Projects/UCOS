# UCOS-OPS-0002 — Evidence Collection Dashboard

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-OPS-0002` |
| Program | **UCOS Execution Control Center — Program Operations Authority** |
| Phase | OPS-2 — Evidence Collection Dashboard |
| Mode | **OPERATIONS CONTROL ONLY** — mirrors the evidence state of the frozen corpus. Collects no evidence, attests nothing, re-measures nothing, issues no certificate, lifts no lock. Changes no gate value. |
| Status | OPS BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Inputs (read-only, frozen) | `UCOS-G0-0001` (14 atomic reqs); `UCOS-W1-0003` (evidence register); `UCOS-W1-0006` (submission dossier); `UCOS-EA-0001` (blockers); `UCOS-RA-0007` (closure package); `UCOS-EP-0003` (waves) |
| Governing constraints | Corpus FROZEN. No self-attestation. `UCOS-CONSTRUCTION-BLOCKED` stands. |

---

## 0. Purpose

Track, in one surface, **all evidence required to open Gate 0**: the **14 atomic requirements**, the **4
execution blockers** they roll up into, and the **three closure waves W1 · W2 · W3**. Every status here is the
value **of record** in `UCOS-W1-0003`; this dashboard advances nothing. A row moves only when an independent
producer lodges evidence of record and the named verifier confirms it.

**Legend.** ● MET (CERTIFIED of record) · ○ NOT STARTED (PENDING) · ◐ IN PROGRESS · ⊘ BLOCKED (deps unmet) ·
✗ REJECTED. As issued: **0 ● · 14 ○/⊘ · G0 = FAIL.**

---

## 1. Master evidence counter

| Metric | Value | Source |
|--------|:-----:|--------|
| Atomic requirements total | **14** | `UCOS-G0-0001 §5` |
| Atomic requirements **MET** | **0** | `UCOS-W1-0003 §3` |
| Atomic requirements PENDING | **14** | `UCOS-W1-0003 §3` |
| Gate elements (execution blockers) | **4** | `UCOS-EA-0003 §6` |
| Gate elements PASS | **0 of 4** | `UCOS-G0-0006 §1` |
| Closure waves | **3** (W1, W2, W3) | `UCOS-RA-0007 §5` |
| Closure waves complete | **0 of 3** | `UCOS-W1-0006 §6.1` |
| **G0 evidence completeness** | **0%** | `UCOS-W1-0003 §3`; `UCOS-G0-0006` |

---

## 2. The 14 atomic requirements (evidence-of-record tracker)

### 2.1 EA-B-P0-1 — Authority-chain & PI-8/PI-9 attestation *(Evidentiary · Wave W1)*

| Req | Required evidence | Producer | Verifier | Acceptance authority | Depends on | Status |
|:---:|-------------------|----------|----------|----------------------|------------|:------:|
| **P0-1.a** | `REAL-C-05` adjudication of `AUTH-012` v1.0.13 (AD-0001..0023) | Independent adjudicator | Independent adjudicator | Authority Board | — | ○ NOT STARTED |
| **P0-1.b** | Independent attestation of PI-8 (`ONTO-RAT-001`) | Independent adjudicator | Independent adjudicator | Authority Board | — | ○ NOT STARTED |
| **P0-1.c** | Independent attestation of PI-9 (`MEM-RAT-003`); `MEM-RAT-001` superseded | Independent adjudicator | Independent adjudicator | Authority Board | — | ○ NOT STARTED |
| **P0-1.d** | `REAL-H-07` pre-construction gate = PASS | Gate operator | `REAL-H-07` gate | Authority Board | a,b,c | ⊘ BLOCKED |

**Rollup AT-P0-1 = P0-1.a ∧ .b ∧ .c ∧ .d → FAIL** (0/4).

### 2.2 EA-B-P0-2 — Program-state reproducibility *(Evidentiary · Wave W1)*

| Req | Required evidence | Producer | Verifier | Acceptance authority | Depends on | Status |
|:---:|-------------------|----------|----------|----------------------|------------|:------:|
| **P0-2.a** | `REAL-M-03` re-run reproduces **269/269** from recorded state | Independent re-measurer | Independent re-measurer | Authority Board | — | ○ NOT STARTED |
| **P0-2.b** | `§0W` divergence reconciled (213/213,"REJECTED" → 269/269,"ACCEPTED") | Independent re-measurer | Independent re-measurer | Authority Board | a | ⊘ BLOCKED |
| **P0-2.c** | Suite-count resolved to one number of record (36 vs 40) | Independent re-measurer | Independent re-measurer | Authority Board | a | ⊘ BLOCKED |

**Rollup AT-P0-2 = P0-2.a ∧ .b ∧ .c → FAIL** (0/3).

### 2.3 EA-B-P1-7 — Terminal certification re-issue *(Evidentiary · Wave W2)*

| Req | Required evidence | Producer | Verifier | Acceptance authority | Depends on | Status |
|:---:|-------------------|----------|----------|----------------------|------------|:------:|
| **P1-7.a** | `UCOM-ULTIMATE-CERT-002` re-issued (269/269, memory ACCEPTED) | Certification authority | Certification authority | Authority Board | AT-P0-1, AT-P0-2 | ⊘ BLOCKED |
| **P1-7.b** | Certified chain state consistent with P0-1 attestation | Certification authority | Certification authority | Authority Board | P0-1.* | ⊘ BLOCKED |
| **P1-7.c** | Stale R14 `UCOM-ULTIMATE-CERT-001` superseded of record | Certification authority | Certification authority | Authority Board | P1-7.a | ⊘ BLOCKED |

**Rollup AT-P1-7 = P1-7.a ∧ .b ∧ .c → FAIL** (0/3).

### 2.4 EA-B-P0-3 — Construction-block lift *(Governance · Wave W3 · the pivot)*

| Req | Required evidence | Producer | Verifier | Acceptance authority | Depends on | Status |
|:---:|-------------------|----------|----------|----------------------|------------|:------:|
| **P0-3.a** | Board act cites **AT-P0-1 = PASS** | UCOS Authority Board | Authority Board | Authority Board (A-1) | AT-P0-1 | ⊘ BLOCKED |
| **P0-3.b** | Board act cites **AT-P0-2 = PASS** | UCOS Authority Board | Authority Board | Authority Board (A-1) | AT-P0-2 | ⊘ BLOCKED |
| **P0-3.c** | Board act cites **AT-P1-7 = PASS** | UCOS Authority Board | Authority Board | Authority Board (A-1) | AT-P1-7 | ⊘ BLOCKED |
| **P0-3.d** | Lift of `UCOS-CONSTRUCTION-BLOCKED` for named scope + Article IX release, recorded on `AUTH-012` | UCOS Authority Board (human-executed) | Authority Board | Authority Board (sole; A-1; `AD-0009`) | a,b,c | ⊘ BLOCKED |

**Rollup AT-P0-3 = P0-3.a ∧ .b ∧ .c ∧ .d → FAIL** (0/4).

---

## 3. The 4 execution blockers (gate-element rollup)

| Gate element | Blocker | Type | Wave | Atomic reqs | Met | Value | Status |
|--------------|---------|:----:|:----:|:-----------:|:---:|:-----:|:------:|
| **AT-P0-1** | EA-B-P0-1 | Evidentiary | W1 | 4 | 0 | FAIL | ○ NOT STARTED |
| **AT-P0-2** | EA-B-P0-2 | Evidentiary | W1 | 3 | 0 | FAIL | ○ NOT STARTED |
| **AT-P1-7** | EA-B-P1-7 | Evidentiary | W2 | 3 | 0 | FAIL | ⊘ BLOCKED (W1) |
| **AT-P0-3** | EA-B-P0-3 | Governance | W3 | 4 | 0 | FAIL | ⊘ BLOCKED (W1+W2) |
| **G0** | — | — | — | **14** | **0** | **FAIL** | ⊘ NO-GO |

---

## 4. Wave-level collection status (W1 · W2 · W3)

| Wave | Package | What it collects | Executable now? | Independence required | Status |
|:----:|---------|------------------|:---------------:|:---------------------:|:------:|
| **W1** | `EWP-00-ATTEST` | AT-P0-1 attestation (`REAL-C-05`; `REAL-H-07`) | **YES** (no build) | **YES** — not the authoring party | ○ NOT STARTED |
| **W1** | `EWP-00-REMEAS` | AT-P0-2 re-measurement (`REAL-M-03`, 269/269) | **YES** (no build) | **YES** — not the authoring party | ○ NOT STARTED |
| **W2** | `EWP-00-CERT` | AT-P1-7 certificate (`UCOM-ULTIMATE-CERT-002`) | YES (after W1 state) | Certification authority | ⊘ BLOCKED (W1) |
| **W3** | `EWP-00-LIFT` | AT-P0-3 Board lift act (`AUTH-012`) | Only Board act | UCOS Authority Board (A-1) | ⊘ BLOCKED (W1+W2) |

**Ordering (non-negotiable):** `{W1: AT-P0-1 ∥ AT-P0-2} → W2: AT-P1-7 → W3: AT-P0-3`. 0 cycles, 0 forward
dependencies (`UCOS-W1-0003 §2`). W1 and W2 are the **only** acts executable under the standing block; both are
**evidentiary, not construction**.

---

## 5. Submission-readiness (from `UCOS-W1-0006`)

| Checklist item (SB-1..7) | Requirement | State |
|--------------------------|-------------|:-----:|
| SB-1 | Evidence index complete; 4 instruments lodged | ○ not lodged |
| SB-2 | Verification results recorded; both W1 items independent | ○ not recorded |
| SB-3 | Certificate grounded; R14 superseded | ○ not issued |
| SB-4 | Board decision recorded on `AUTH-012` with named scope | ○ no decision |
| SB-5 | Master Evidence Register shows **14/14 MET** | ○ 0/14 MET |
| SB-6 | No active rejection / revocation / invalidator | n/a (nothing lodged) |
| SB-7 | Ordering W1 → W2 → W3 honored | enforced |
| **Package readiness** | Instruments ready for independent parties | **READY FOR INDEPENDENT EVIDENCE COLLECTION** |
| **Evidence readiness** | Evidence exists of record | **NO — G0 = FAIL / NO-GO** |

> **Critical distinction of record (`UCOS-W1-0006 §7`):** the W1 package set is **complete and sufficient** for
> independent parties to execute — but **no evidence exists**, **G0 is not PASS**, and the block **stands**.
> Producing the packages changes no gate value.

---

## 6. What is required to move each counter

| To move… | The required act (and who) | Constraint |
|----------|----------------------------|------------|
| AT-P0-1 → PASS | Independent adjudicator produces `REAL-C-05` + `REAL-H-07` PASS | Must be independent; self-attestation REJECTED |
| AT-P0-2 → PASS | Independent re-measurer reproduces 269/269, reconciles §0W, fixes suite count | Must be independent |
| AT-P1-7 → PASS | Certification authority re-issues `UCOM-ULTIMATE-CERT-002`, supersedes R14 | Grounded in AT-P0-1 ∧ AT-P0-2 |
| AT-P0-3 → PASS | **UCOS Authority Board** records A-1 lift act on `AUTH-012` (human-executed) | Sole authority; requires AT-P0-1/2/7 PASS first; **no AI/agent may perform** |

---

## 7. Determination (evidence-dashboard level)

> Evidence collection stands at **0 of 14 atomic requirements MET**, **0 of 4 gate elements PASS**, **0 of 3
> closure waves complete** — **G0 evidence completeness = 0%**. The collection instruments are **complete and
> ready** for independent execution (`UCOS-W1-0006`), but **no evidence exists of record**. The two W1
> evidentiary acts (`EWP-00-ATTEST`, `EWP-00-REMEAS`) are executable immediately, under the standing block, by
> independent parties; W2 follows W1; W3 is the sole Board lift act. Until independent evidence is lodged and
> confirmed, **every counter remains at zero and G0 = FAIL**.

## 8. Scope discipline

No evidence collected, lodged, attested, re-measured, certified, or approved; no status advanced; no lock
lifted. This dashboard reports `UCOS-W1-0003` values verbatim. INV-1..13, `AUTH-012`, `AD-0014`, and the
Article IX lock are unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands.**

## 9. Traceability

- **Consumes:** `UCOS-G0-0001` (14 reqs); `UCOS-W1-0003` (register); `UCOS-W1-0006` (submission);
  `UCOS-EA-0001` (blockers); `UCOS-RA-0007` (closure); `UCOS-EP-0003` (waves).
- **Feeds:** `UCOS-OPS-0003` (gate control), `UCOS-OPS-0004` (readiness index), `UCOS-OPS-0005` (authority
  actions).
- **Owner:** UCOS Authority Board (register custodian).

**END `UCOS-OPS-0002` — EVIDENCE COLLECTION DASHBOARD · 14 ATOMIC REQS: 0 MET / 14 PENDING · 4 EXECUTION BLOCKERS: 0/4 PASS · WAVES W1/W2/W3: 0/3 COMPLETE · G0 EVIDENCE COMPLETENESS = 0% · PACKAGES READY / NO EVIDENCE · NO SELF-ATTESTATION · OPERATIONS CONTROL ONLY.**
