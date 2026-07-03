# UCOS-W1-0005 — Authority Board Decision Package

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-W1-0005` |
| Program | **UCOS Wave 1 — Independent Evidence Package Generation** |
| Phase | W1-5 — Board Package (Wave W3; the pivot) |
| Closes toward | **EA-B-P0-3** (AT-P0-3) — the Authority-Board lift act (**A-1**, `AD-0009`) |
| Mode | **PREPARATION ARTIFACT ONLY** — blank decision memorandum, resolution template, and criteria for the UCOS Authority Board. Grants no authorization. Lifts no lock. Records no decision. |
| Status | BOARD-PACKAGE TEMPLATE (v1.0.0) — **NO DECISION TAKEN** |
| Date | 2026-07-03 |
| Inputs (read-only, frozen) | `UCOS-G0-0001 §4`; `UCOS-G0-0005`; `UCOS-EA-0003 §2/§6`; `UCOS-RA-0007 §4`; `UCOS-EXEC-0001 §7` (A-1); `UCOS-EP-0005 §1`; `UCOS-EP-0006` (Gate 0); `UCOS-EP-0008 §4`; `AD-0009`; `AUTH-009`; `AUTH-012`; `UCOS-CONST-001` Article IX |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; `AD-0014` intact; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. **Board-only; human-executed. No AI/agent may perform this act.** |

> **Authority rule.** Only the **UCOS Authority Board** may adopt the resolution in §5, at the required majority,
> recorded append-only on `AUTH-012` (A-1; `AD-0009`; human-executed). This package **prepares** the decision;
> it does **not** take it. As issued: **NO DECISION; block stands.**

---

## 1. Decision memorandum *(to be completed by the Board secretariat)*

```
TO:        UCOS Authority Board
FROM:      ⟨Secretariat / Chief Authority Architect⟩
RE:        EWP-00-LIFT — Lift of UCOS-CONSTRUCTION-BLOCKED for authorized scope (A-1)
DATE:      ⟨____⟩

DECISION SOUGHT:
  Adopt the resolution (§5) to lift UCOS-CONSTRUCTION-BLOCKED for the NAMED
  authorized scope ⟨____⟩, upon confirmation that AT-P0-1, AT-P0-2, and AT-P1-7
  are PASS of record.

MATTER CLASS: Authority-Approval (A-1) — Approval-Required Operation (AD-0009).
              Terminal authority: Authority Board only. Human-executed.

RECOMMENDATION: ⟨APPROVE / REJECT / DEFER⟩   (to be set by the Board)
```

## 2. Evidence summary *(populated from `UCOS-W1-0003`; values entered at decision time)*

| Gate element | Instrument | Register ref | Verified PASS? | Value |
|--------------|-----------|--------------|:--------------:|:-----:|
| **AT-P0-1** | `REAL-C-05` + `REAL-H-07` | EV-P0-1.a..d | `[ ]` | `⟨PASS/FAIL⟩` |
| **AT-P0-2** | `REAL-M-03` (269/269) | EV-P0-2.a..c | `[ ]` | `⟨PASS/FAIL⟩` |
| **AT-P1-7** | `UCOM-ULTIMATE-CERT-002` | EV-P1-7.a..c | `[ ]` | `⟨PASS/FAIL⟩` |
| **Prerequisite conjunction** | LE-1 ∧ LE-2 ∧ LE-3 | — | `[ ]` | `⟨TRUE/FALSE⟩` |

> The Board may proceed to resolution **only if** the prerequisite conjunction = TRUE (`UCOS-G0-0005 §2`).

## 3. Risk statement

| Risk | If the Board lifts… | Basis |
|------|---------------------|-------|
| **RK-1** | …before LE-1∧LE-2∧LE-3 are PASS → lift **void ab initio**; building is an Article IX violation | INV-L-1 (`UCOS-G0-0005 §4`) |
| **RK-2** | …on self-attested (non-independent) evidence → unlawful | INV-L-3; `UCOS-EP-0005 §2` |
| **RK-3** | …beyond the named scope (blanket lift) → excess void | INV-L-7 |
| **RK-4** | …with any invariant change / new requirement / redesign → void | INV-L-5; `ULT-TEST-001` |
| **RK-5** | …and grounding later revoked (`REAL-C-05`/`REAL-M-03`/cert) → G0→FAIL; lift defeated | INV-L-2; `UCOS-G0-0004 §4` |
| **RK-6** | …via non-Board party or AI execution → ultra vires; no effect | INV-L-4/8; `UCOS-EP-0008 §2/§6` |
| **RK-7** | …without `AUTH-012` append-only record at required majority → not of record | INV-L-6 |

> **Residual-risk posture.** Fail-closed (`UCOS-EP-0006` Gate 0): if any risk is unmitigated, **withhold the
> act** and remain BLOCKED. Rollback is corrective-forward, never destructive (INV-10).

## 4. Approval criteria (Board MAY adopt the lift resolution iff ALL true)

- [ ] AK-1 AT-P0-1 = PASS of record (independent; not self-attested).
- [ ] AK-2 AT-P0-2 = PASS of record (269/269 independently reproduced).
- [ ] AK-3 AT-P1-7 = PASS of record (`UCOM-ULTIMATE-CERT-002` issued; R14 superseded).
- [ ] AK-4 A **named authorized scope** is specified (no blanket lift).
- [ ] AK-5 The act carries **0** invariant change, **0** new requirement, **0** redesign.
- [ ] AK-6 Required Board majority present; act to be recorded append-only on `AUTH-012`.
- [ ] AK-7 A human executor is designated for the live act (`UCOS-EXEC-0001` A-7).

## 5. Board resolution template *(BLANK — unadopted)*

```
╔══════════════════════════════════════════════════════════════════════╗
║        ⟦ UNADOPTED — NO DECISION — TEMPLATE ⟧                          ║
║   UCOS AUTHORITY BOARD RESOLUTION — EWP-00-LIFT (A-1 / AD-0009)        ║
╠══════════════════════════════════════════════════════════════════════╣
║ WHEREAS AT-P0-1 is PASS of record (REAL-C-05; REAL-H-07):   ⟨y/n⟩      ║
║ WHEREAS AT-P0-2 is PASS of record (REAL-M-03, 269/269):     ⟨y/n⟩      ║
║ WHEREAS AT-P1-7 is PASS of record (UCOM-ULTIMATE-CERT-002): ⟨y/n⟩      ║
║                                                                        ║
║ RESOLVED, the Board hereby CITES the three elements above as PASS and  ║
║ LIFTS UCOS-CONSTRUCTION-BLOCKED for the NAMED scope:                   ║
║     Authorized scope: ⟨____⟩                                           ║
║     Article IX generation-lock release link: ⟨____⟩                    ║
║                                                                        ║
║ This resolution makes NO invariant change, NO new requirement,         ║
║ NO redesign. Anything outside the named scope remains gated.           ║
║                                                                        ║
║ Decision: ⟨APPROVED / REJECTED / DEFERRED⟩                             ║
║ Majority recorded: ⟨____⟩       AUTH-012 entry: ⟨____⟩ (append-only)   ║
║ Human executor designated (A-7): ⟨____⟩                               ║
║ Board signatories: ____________________  ____________________         ║
║ Date: ⟨____⟩                                                           ║
╠══════════════════════════════════════════════════════════════════════╣
║ Until adopted at the required majority and recorded on AUTH-012, this  ║
║ resolution has NO legal effect and UCOS-CONSTRUCTION-BLOCKED STANDS.   ║
╚══════════════════════════════════════════════════════════════════════╝
```

## 6. Rejection criteria (Board MUST NOT / cannot lawfully adopt if ANY true)

| ID | Trigger |
|----|---------|
| RJ-1 | Any of AT-P0-1 / AT-P0-2 / AT-P1-7 is FAIL or not of record |
| RJ-2 | Evidence is self-attested / producer not independent |
| RJ-3 | No named scope (blanket/implied lift requested) |
| RJ-4 | Act would change an invariant / add a requirement / require redesign |
| RJ-5 | Required majority absent, or not recordable append-only on `AUTH-012` |
| RJ-6 | Execution proposed by a non-Board party or by AI |

## 7. Lock-lift preconditions (summary — from `UCOS-G0-0005 §2`)

`LE-1 (AT-P0-1 PASS) ∧ LE-2 (AT-P0-2 PASS) ∧ LE-3 (AT-P1-7 PASS) → LE-4 (scoped Board act on AUTH-012)`.
Ordering is non-negotiable: W1 evidence → W2 certificate → W3 lift. A lift without LE-1..3 of record is void.

## 8. Current reading (as issued)

| Element | State |
|---------|:-----:|
| AT-P0-1 / AT-P0-2 / AT-P1-7 | **FAIL / FAIL / FAIL** (`UCOS-W1-0003`) |
| Prerequisite conjunction (LE-1∧LE-2∧LE-3) | **FALSE** |
| Board resolution | **UNADOPTED** |
| **AT-P0-3** | **FAIL** — `UCOS-CONSTRUCTION-BLOCKED` stands |

## 9. Determination (board-package level)

> A **complete blank Board package**: decision memorandum, evidence summary (bound to the register), a
> seven-row risk statement, seven approval criteria, six rejection criteria, explicit lock-lift preconditions,
> and an **UNADOPTED resolution template**. As issued **no decision is taken, no lock is lifted, AT-P0-3 remains
> FAIL.** The package is lawfully adoptable **only** after AT-P0-1/AT-P0-2/AT-P1-7 are PASS of record.
> Sufficiency for Board execution: **YES**.

## 10. Scope discipline

No authorization granted, no resolution adopted, no `AUTH-012` entry made, no lock lifted. INV-1..13,
`AUTH-012`, `AD-0014`, Article IX lock unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands.** Lifting is reserved to
the UCOS Authority Board.

## 11. Traceability

- **Consumes:** `UCOS-G0-0001 §4`; `UCOS-G0-0005`; `UCOS-EXEC-0001 §7`; `UCOS-EP-0005/0006/0008`; `AD-0009`;
  `AUTH-009`; `AUTH-012`; `UCOS-W1-0001/0002/0003/0004`.
- **Feeds:** `UCOS-W1-0006` (submission — Board decision result).
- **Owner:** UCOS Authority Board (terminal authority; custodian: Chief Authority Architect).

**END `UCOS-W1-0005` — AUTHORITY BOARD DECISION PACKAGE · MEMO · EVIDENCE SUMMARY · RISK RK-1..7 · APPROVAL AK-1..7 · REJECTION RJ-1..6 · LOCK-LIFT PRECONDITIONS · UNADOPTED RESOLUTION TEMPLATE · NO DECISION · AT-P0-3 = FAIL · BOARD-ONLY / HUMAN-EXECUTED · NO LOCK LIFT · PREPARATION ARTIFACT ONLY.**
