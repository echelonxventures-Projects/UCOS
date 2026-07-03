# UCOS-OPS-0005 — Authority Action Register

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-OPS-0005` |
| Program | **UCOS Execution Control Center — Program Operations Authority** |
| Phase | OPS-5 — Authority Action Register |
| Mode | **OPERATIONS CONTROL ONLY** — registers the acts the frozen corpus requires of the Authority Board, independent parties, and certification authority. Grants no authority, performs no act, records nothing on `AUTH-012`. |
| Status | OPS BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Inputs (read-only, frozen) | `UCOS-EP-0008 §4` (A-1..A-9); `UCOS-EXEC-0001 §7`; `UCOS-G0-0005` (lift authority); `UCOS-G0-0001..0004`; `UCOS-RA-0007`; `UCOS-EP-0006` (gates); `AD-0009`; `AUTH-009`; `AUTH-012` |
| Governing constraints | Corpus FROZEN. Lifting the block is reserved to the UCOS Authority Board. No AI/agent may perform A-1..A-9. |

---

## 0. Purpose

Register every act that must be performed — and by whom — to move the program from **G0 = FAIL** forward.
Four registers: **Required Board Actions**, **Required Authority Actions (A-1..A-9)**, **Required
Certifications**, **Required Reviews**. Each row records: the act, the sole party who may perform it, its
preconditions, and its current state. This register **specifies** required acts; it **performs none**.

**State legend.** ○ PENDING (not begun) · ⊘ BLOCKED (precondition unmet) · ● DONE (of record).

---

## 1. Register A — Required Board Actions (the critical path to G0 = PASS)

| Ref | Board action | Wave | Preconditions | May be performed by | Recorded on | State |
|:---:|--------------|:----:|---------------|---------------------|:-----------:|:-----:|
| **BA-1** | Accept AT-P0-1 attestation of record (`REAL-C-05`; `REAL-H-07` PASS) | W1 | Independent adjudication lodged | UCOS Authority Board | `AUTH-012` | ⊘ BLOCKED (no attestation) |
| **BA-2** | Accept AT-P0-2 re-measurement of record (`REAL-M-03`, 269/269) | W1 | Independent re-measurement lodged | UCOS Authority Board | `AUTH-012` | ⊘ BLOCKED (not reproduced) |
| **BA-3** | Accept AT-P1-7 certificate of record (`UCOM-ULTIMATE-CERT-002`) | W2 | Certificate re-issued; grounded in BA-1/BA-2 | UCOS Authority Board | `AUTH-012` | ⊘ BLOCKED (cert not issued) |
| **BA-4** | **Lift `UCOS-CONSTRUCTION-BLOCKED`** for a named scope + Article IX release (the pivot) | W3 | BA-1 ∧ BA-2 ∧ BA-3 accepted; LE-1∧LE-2∧LE-3 PASS | **UCOS Authority Board (sole; human-executed)** | `AUTH-012` | ⊘ BLOCKED (LE-1..3 FAIL; LE-4 ABSENT) |

> **BA-4 is the single decisive act of the whole program.** It is `A-1` (lift / Article IX release), sole to
> the Board, human-executed, at the required majority, append-only on `AUTH-012`. On BA-4, `G0 = PASS` and
> construction is unblocked for the named scope. Eight invalidators (`INV-L-1..8`, `UCOS-G0-0005 §4`) void any
> premature, self-attested, out-of-scope, unrecorded, or non-Board lift.

---

## 2. Register B — Required Authority Actions (A-1..A-9, `UCOS-EP-0008 §4`)

The full Authority-Approval set. Each is Authority-Board-terminal (`AD-0009`), recorded on `AUTH-012`, and
**structurally forbidden to any agent/AI** (`UCOS-EXEC-0001 §7`; `UCOS-EP-0008 §2`).

| Ref | Authority act | Gate / Wave enabled | Preconditions | State |
|:---:|---------------|---------------------|---------------|:-----:|
| **A-1** | Lift `UCOS-CONSTRUCTION-BLOCKED` / Article IX release (`EWP-00-LIFT`) | **Gate 0 exit** | BA-1..BA-3; LE-1∧LE-2∧LE-3 | ⊘ BLOCKED |
| **A-2** | Enroll invariant — **INV-CORE-12 (Non-Actuation)**, revised INV-17/18, INV-14/16/19/20 (`EWP-E-NONACT/CRC`) | Gate 2 enactment; hard precondition for Gate 4 | Gate 0 exit | ⊘ BLOCKED (post-G0) |
| **A-3** | Scoped fabric construction authorization — `AD-0024` (Intelligence), `AD-0022` (Simulation), Economic, Temporal | Gates 4/5/6, Stage 8 | Gate 0 exit; per-fabric preconditions | ⊘ BLOCKED (post-G0) |
| **A-4** | New/changed technology ADR version | as needed | Gate 0 exit | ○ PENDING (as needed) |
| **A-5** | Any change touching INV-1..13 / class floor (constitutional) | as needed | constitutional process | ○ PENDING (none pending) |
| **A-6** | `AD-0014` disposition (Civilization / existential) | **Gate 7** | Gate 5; civilization criteria | ⊘ BLOCKED / ⏸ DEFERRED |
| **A-7** | Live provisioning / deployment / vendor binding / ENV-PROD (real spend; **human executes**) | Gate 3 (PRODUCTION) | Gate 0 exit; full release | ⊘ BLOCKED (post-G0) |
| **A-8** | High-blast-radius key rotation; AC-1 downtime maintenance | operations | production standing | ⊘ BLOCKED (post-G0) |
| **A-9** | `AUTH-012` ledger amendment; authority/custodian succession | as needed | governance process | ○ PENDING (as needed) |

> **Immediate critical act:** **A-1** (= BA-4). **A-2 (Non-Actuation enrollment)** is the next safety-critical
> act and is the **hard precondition** for any Intelligence build (Gate 4) — no autonomous actuation is lawful
> until INV-CORE-12 is enrolled (`UCOS-EP-0008 §2`).

---

## 3. Register C — Required Certifications

| Ref | Certification | Producer | Grounded in | Supersedes | State |
|:---:|---------------|----------|-------------|------------|:-----:|
| **C-1** | **`UCOM-ULTIMATE-CERT-002`** — terminal certificate (269/269, memory ACCEPTED) | Certification authority (`REAL-C-01`) | AT-P0-1 ∧ AT-P0-2 | R14 `UCOM-ULTIMATE-CERT-001` (stale) | ⊘ BLOCKED (W2; deps W1) |
| **C-2** | **UCC-4** — Operational Certification (production) | Platform ops + Board | Gate 3: G12-1∧G12-2∧G12-3; NFR floors | — | ⊘ BLOCKED (post-G0) |
| **C-3** | **UCC-6** — observability ADR (`PE-12`) decided | Board (governance) | Gate 3 | — | ⊘ BLOCKED (post-G0) |
| **C-4** | Language coverage certification | (certification authority) | `UCOS-LANG-0001..0003` | — | ● DONE (`UCOS-LANG-0004`) |

> The **only certification currently blocking G0** is **C-1** (`UCOM-ULTIMATE-CERT-002`). It is evidentiary and
> can be issued now, once W1 evidence exists. C-2/C-3 are production-tier and post-date Gate 0.

---

## 4. Register D — Required Reviews

| Ref | Review | Reviewer (must be independent where noted) | Feeds | State |
|:---:|--------|--------------------------------------------|-------|:-----:|
| **R-1** | Independent adjudication of authority chain + PI-8/PI-9 (`REAL-C-05`) | **Independent adjudicator** (not authoring party) | AT-P0-1 / BA-1 | ○ PENDING (not engaged) |
| **R-2** | Independent re-measurement of program state (`REAL-M-03`) | **Independent re-measurer** (not authoring party) | AT-P0-2 / BA-2 | ○ PENDING (not engaged) |
| **R-3** | `REAL-H-07` pre-construction enrollment gate | Deterministic gate operator | AT-P0-1 (P0-1.d) | ⊘ BLOCKED (deps R-1) |
| **R-4** | Quality / Security / Doc / Release gate reviews (`GATE-QUAL/SEC/DOC/REL-001`) | Board (governance gates) | build-package acceptance | ⊘ BLOCKED (post-G0) |
| **R-5** | Steward governance-approval (optional convergence / catalog / observability) | Stewards (`PEO-*`; append-only) | Wave 2/3 optional packages | ⊘ BLOCKED (post-G0) |

> **R-1 and R-2 are the entry acts of the entire forward program.** Both require parties **independent of the
> authoring process**; self-attestation is rejected by rule (`UCOS-EP-0005 §2`). They are executable now,
> under the standing block.

---

## 5. Action-sequence (the ordered critical path)

```
R-1 (adjudicate) ∥ R-2 (re-measure)      ── W1, independent, executable now
      │                 │
      └──── BA-1 ────────┴──── BA-2       ── Board accepts AT-P0-1, AT-P0-2
                 │
                 ▼
   C-1 UCOM-ULTIMATE-CERT-002 issued      ── W2
                 │
                 ▼
              BA-3                          ── Board accepts AT-P1-7
                 │
                 ▼
      BA-4 = A-1  LIFT BLOCK (AUTH-012)     ── W3, sole Board act, human-executed
                 │
                 ▼
        G0 = PASS ⇒ EXECUTION MAY COMMENCE (named scope)
                 │
        ┌────────┴─────────┐
        ▼                  ▼
   A-7 (ENV-PROD)     A-2 (INV-CORE-12 enroll) ─► A-3 (fabric authz) ─► A-6 (AD-0014)
   → UCC-4 = PRODUCTION READY                    → ... → CIVILIZATION READY
```

---

## 6. Register summary

| Register | Items | DONE | PENDING | BLOCKED |
|----------|:-----:|:----:|:-------:|:-------:|
| A — Board Actions | 4 | 0 | 0 | 4 |
| B — Authority Acts (A-1..A-9) | 9 | 0 | 3 (as-needed) | 6 |
| C — Certifications | 4 | 1 (LANG) | 0 | 3 |
| D — Reviews | 5 | 0 | 2 (executable now) | 3 |
| **Total** | **22** | **1** | **5** | **16** |

**Single decisive act:** **BA-4 / A-1** — the Authority-Board lift of `UCOS-CONSTRUCTION-BLOCKED`. Nothing
downstream is lawful until it is recorded on `AUTH-012`, and it is lawful only after BA-1/BA-2/BA-3.

---

## 7. Determination (authority-action level)

> The frozen corpus requires **22 registered acts**; **1** is DONE (language certification), **5** are
> executable/PENDING (chiefly the two independent reviews R-1/R-2), and **16** are BLOCKED behind Gate 0. The
> entire forward program pivots on **one** Authority-Board act — **BA-4 / A-1**, the lift of
> `UCOS-CONSTRUCTION-BLOCKED` — which is lawful only after independent attestation (R-1/BA-1), independent
> re-measurement (R-2/BA-2), and certificate re-issue (C-1/BA-3). **No agent or AI may perform any A-1..A-9 act
> or any lock release.** This register performs none of these acts.

## 8. Scope discipline

No authority granted, no act performed, no `AUTH-012` entry made, no lock lifted. INV-1..13, `AUTH-012`,
`AD-0014`, and the Article IX lock are unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands.**

## 9. Traceability

- **Consumes:** `UCOS-EP-0008 §4`; `UCOS-EXEC-0001 §7`; `UCOS-G0-0001..0005`; `UCOS-RA-0007`; `UCOS-EP-0006`;
  `AD-0009`; `AUTH-009`; `AUTH-012`.
- **Feeds:** `UCOS-OPS-0006` (timeline), `UCOS-OPS-0007` (operations manual).
- **Owner:** UCOS Authority Board (terminal authority).

**END `UCOS-OPS-0005` — AUTHORITY ACTION REGISTER · 22 ACTS (1 DONE · 5 PENDING · 16 BLOCKED) · A-1..A-9 · SINGLE DECISIVE ACT = BA-4/A-1 (LIFT BLOCK) · CERT C-1 = UCOM-ULTIMATE-CERT-002 · REVIEWS R-1/R-2 INDEPENDENT, EXECUTABLE NOW · NO AI MAY PERFORM ANY AUTHORITY ACT · OPERATIONS CONTROL ONLY.**
