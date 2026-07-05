# OPS — CERTIFICATION READINESS (ACT 9 UNLOCK)

> **PHASE E.1 · OPERATIONAL EVIDENCE EXECUTION PROGRAM · READ-ONLY GOVERNANCE ANALYSIS**
> **NO CODE · NO IMPLEMENTATION · NO ENVIRONMENT CREATION · NO PIPELINE EXECUTION · NO CERTIFICATION ISSUANCE · NO GOVERNANCE MUTATION**
> Determines exactly how the Act 6–8 evidence unlocks **Act 9 — Operational Certification (UCC-4)**.

| Field | Value |
|-------|-------|
| Artifact ID | `OPS-CERTIFICATION-READINESS` |
| Phase | **E.1** · Version 1.0.0 · Date 2026-07-03 |
| Target | **Act 9 — Operational Certification** (condition C-G, gate **UCC-4**, `REAL-C-02`, `REM-15`) |
| Inputs (read-only) | `OPS-EVIDENCE-MATRIX`, `ARTICLE-IX-CERTIFICATION-MATRIX` (CERT-2), `ARTICLE-IX-READINESS-REPORT` (act 9), `UCOS-EVIDENCE-REQUIREMENTS` (EO-5/EO-6); source refs `OP-CERT-001` (9 tracks, 5 FAIL), REAL-C-05 **G4 dual-witness**, `UCOS-P12-CERT-001` (PENDING, to be superseded). |
| Legend | ☐ open · ✅ satisfied-by-assumption · (2IA) needs dual-witness |

---

## 0. What Act 9 Is

Act 9 issues the **Operational Certification** that supersedes the PENDING `UCOS-P12-CERT-001`, closing **UCC-4** and reaching milestone **M-γ OPERATIONALLY CERTIFIED**. It is a **certification act**, not an evidence-production act — it **consumes** the Act 6–8 evidence and **adds** independent review.

---

## 1. Act 9 Preconditions

| Precondition | Source | State | Satisfied by |
|--------------|--------|:-----:|--------------|
| **G12-1 CLOSED** | Act 6 | ☐ | EO-1 ∧ EV-3 |
| **G12-2 CLOSED** | Act 7 | ☐ | EO-2 ∧ EV-5 ∧ EV-4 ∧ EO-4(runtime security) |
| **G12-3 CLOSED** | Act 8 | ☐ | EO-3 ∧ EV-6 ∧ EV-2 ∧ EO-4(backup) |
| Runtime-invariant tests | REM-13 | ☐ | EV-7 |
| **All measured values ≥ floors** | Act 8 | ☐ | NP-5 fail-closed comparison |
| **G4 dual-witness available** | REAL-C-05 | ☐ | **2nd IA designation** (governance, separate) |
| Evidence immutable + IA-reproducible | Acts 6–8 | ☐ | EV-4 hash-chain |

---

## 2. OP-CERT-001 Track Closure Map

`OP-CERT-001` carries **9 tracks, currently 5 FAIL**. The Act 6–8 evidence + Act-9 review drive them to PASS:

| Track (functional) | Evidence that closes it | Program |
|--------------------|-------------------------|---------|
| T-a Provisioning | EO-1, EV-3 | Environment |
| T-b Pipeline integrity | EO-2, EV-4 | Pipeline |
| T-c Contract conformance | EV-5 (85 + API-018/027) | Pipeline |
| T-d Security enforcement | EO-4 (mTLS/authz/S1/S3/S4) | Security |
| T-e Resilience / DR | EO-3 (RPO/RTO), EO-4 (backup) | DR |
| T-f Performance / NFR | EO-3 (p99/throughput/avail), EV-2 | NFR |
| T-g Scale | EV-6 | NFR |
| T-h Runtime integrity | EV-7 (INV-CORE-01..14) | front wave (REM-13) |
| **T-i Independent review** | **EO-5 (dual-witness, 2 IAs)** | **Act 9** |

> Tracks T-a..T-h are closed by **evidence** (Acts 6–8 + REM-13). Track **T-i is closed only at Act 9** by the **dual-witness** — it cannot be produced by the evidence programs.

---

## 3. The Dual-Witness Requirement (G4)

| Aspect | Detail |
|--------|--------|
| Rule | Operational Certification requires **two distinct Independent Adjudicators** concurring (WIT-1..5), each reproducing the evidence independently. |
| Prerequisite | A **second IA** must be designated (distinct actor + KMS key disjoint from the first IA, CI, and authoring). This is a **governance act** outside Acts 6–8. |
| Why | SoD at certification time: `proposer ≠ certifier ≠ ratifier`; two witnesses prevent single-actor capture of the terminal operational verdict. |
| Evidence | **EO-5** (independent operational review, two concurring attestations). |
| Fail-closed | Divergent witnesses ⇒ no certification. |

---

## 4. Act 9 Issuance Sequence (certification act, not evidence)

```
[G12-1 ∧ G12-2 ∧ G12-3 CLOSED]  ∧  [EV-7 runtime invariants]  ∧  [all floors met]
        │
        ├─► IA #1 reproduces + attests the full evidence pack
        ├─► IA #2 (2nd designation) independently reproduces + attests  ──► EO-5 dual-witness
        │
        ▼
   CA issues Operational Certification (supersedes UCOS-P12-CERT-001 PENDING)  ──► EO-6
        │
        ▼
   Board releases certification  ──► UCC-4 CLOSED  ⟶  OPERATIONALLY CERTIFIED (M-γ)
```

---

## 5. Readiness Determination

> ## **ACT 9 = UNLOCKABLE-ON-EVIDENCE — NOT YET READY**
>
> - **Evidence tracks (T-a..T-h):** unlock exactly when Acts 6–8 + REM-13 produce their artifacts with every floor met, fail-closed.
> - **Review track (T-i):** unlocks only with a **second IA designation** (governance) + two concurring attestations (EO-5).
> - **Certification issuance (EO-6):** a CA act + Board release, permissible **only** after all nine tracks PASS.
> - **No track may be assumed passing.** Absence of evidence or any below-floor value is a FAIL.
>
> Act 9 is therefore **fully specified and reachable**, gated solely on (a) the Act 6–8 evidence pack and (b) the 2nd-IA dual-witness.

## Governance / Non-Mutation Statement
No certification was issued; no track was closed; no adjudicator (first or second) designated; no attestation produced. The 2nd-IA designation is identified as a prerequisite, not enacted. Certification level unchanged: **CONDITIONALLY CERTIFIED**. `INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX lock, and `UCOS-CONSTRUCTION-BLOCKED` unchanged. Read-only analysis.

**END OPS-CERTIFICATION-READINESS — ACT 9 / UCC-4 · UNLOCKS ON [G12-1∧2∧3 + EV-7 + FLOORS MET] + [2ND-IA DUAL-WITNESS EO-5] → EO-6 · 9 OP-CERT TRACKS (T-a..T-i) · T-i = DUAL-WITNESS ONLY AT ACT 9.**
