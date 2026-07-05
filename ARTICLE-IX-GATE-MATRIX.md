# ARTICLE IX — GATE MATRIX

> **PHASE R.4 · ARTICLE IX RELEASE READINESS PACKAGE · READ-ONLY GOVERNANCE ANALYSIS**
> **NO CODE · NO IMPLEMENTATION · NO GOVERNANCE MUTATION · NO RELEASE · NO CERTIFICATION**
> Every gate on the path from **REAL-C-05 closed** to **Full Article IX Release (`REAL-C-03`, UCC-5)** and onward to FULL GO, with post-closure status.

| Field | Value |
|-------|-------|
| Artifact ID | `ARTICLE-IX-GATE-MATRIX` |
| Phase | **R.4** · Version 1.0.0 · Date 2026-07-03 |
| Assumption | REAL-C-05 operationally CLOSED: **G1 ∧ G2 ∧ G3 = TRUE**, durability committed. **G4 OPEN**. |
| Legend | ✅ CLOSED · ☐ OPEN · ⧗ OPEN-blocked-by-predecessor · (H) human-gated · (B) Board act |

---

## 1. REAL-C-05 Conversion Gates (independence)

| Gate | Requirement | Status (post-closure) | Still needed for REAL-C-03? |
|:----:|-------------|:---------------------:|:---------------------------:|
| **G1** | Board enacts IA designation (distinct actor + disjoint KMS key custody) | ✅ CLOSED | — (satisfied) |
| **G2** | Register IA Ed25519 public key (`governance-registry.ts`) | ✅ CLOSED | — (satisfied) |
| **G3** | ≥1 signed genesis attestation on the chain (verified SIG-4; author-key rejected SIG-5) | ✅ CLOSED | — (satisfied) |
| **G4** | **Dual-witness** — two distinct IAs concur | ☐ OPEN (H)(B) | **YES** — required at Operational Certification (UCC-4) |

> **G4 is the one REAL-C-05 gate still open.** It is certification-time only and requires a **second Independent Adjudicator**. It binds at UCC-4, not before.

---

## 2. Operational Evidence Gates (`REAL-C-02` — the binding constraint)

| Gate | Requirement | Status | Predecessor | Owner |
|:----:|-------------|:------:|-------------|-------|
| **G12-1** | Provision ENV-DEV + ENV-INT, internal-only, S1/S3/S4 enforced; provisioning attestation | ☐ OPEN (H) | PE-12 ADR + durable ledger + NFR floors | Exec (real-spend) / Board (AD-0009) |
| **G12-2** | CI/CD pipeline (build→test→scan→sign→promote) + contract tests (85 + API-018/API-027) with signed artifacts | ⧗ OPEN | G12-1 | Exec / CA |
| **G12-3** | DR drill + **measured** RPO/RTO/p99/availability vs `UCOS-ASR-NFR-001` floors | ⧗ OPEN | G12-2, PE-12 telemetry | Exec / CA |

> **Fail-closed:** any below-floor metric at G12-3 yields CONDITIONAL / NOT ACHIEVED and withholds UCC-4. This is the **serial, human-executed segment** — the governing bottleneck.

---

## 3. Universal Closure Condition Gates (UCC)

| Gate | Meaning | Status | Closes on | Class |
|:----:|---------|:------:|-----------|-------|
| UCC-1 | Foundation ratification (build/tests) | ✅ (re-affirm on independent basis via C-05 re-attestation) | REM-05 | Evidence |
| UCC-2 | Authority-chain / memory ratification | ✅ (re-affirm via C-05 re-attestation) | REM-05 | Evidence |
| **UCC-4** | **Operational Certification issued** | ☐ OPEN | G12-1∧G12-2∧G12-3 + G4 dual-witness | Certification (B) |
| **UCC-5** | **Full Article IX lock released** (`UCOS-CONSTRUCTION-BLOCKED` lifted) | ☐ OPEN — **terminal** | all predicates P1–P5 CLOSED | Governance (B) |
| **UCC-6** | **PE-12 observability ADR decided** | ☐ OPEN | none hard (do before G12) | Governance (B) |

---

## 4. Release-Predicate Condition Gates (C-A..C-J crosswalk)

| Cond. | Description | Gate(s) | Status | Remediation |
|:-----:|-------------|:-------:|:------:|:-----------:|
| C-A | Enact independent adjudication | G1–G3 | ✅ CLOSED | REM-01 (done) |
| C-B | Re-attest authority chain + PI-8/PI-9 | UCC-1/2 re-affirm | ☐ OPEN | REM-05 |
| C-C | Re-issue terminal certification | — | ☐ OPEN | REM-03 |
| C-D | Corpus durability (commit/push/tag) | — | ✅ CLOSED (co-closed with C-05 durability) | REM-04 (done) |
| C-E | PE-12 observability ADR | UCC-6 | ☐ OPEN | REM-11 |
| C-F | Provision + pipeline + tests + DR + NFRs | G12-1/2/3 | ☐ OPEN | REM-02/08/09 |
| C-G | Operational Certification | UCC-4 + G4 | ☐ OPEN | REM-15 |
| C-H | Construct + ratify in-scope fabrics (PI-10/PI-11) | per-increment ratification | ☐ OPEN | REM-06/REM-14 |
| **C-I** | **Full Article IX release** | **UCC-5** | ☐ OPEN — **terminal** | **REM-07** |
| C-J | Product build + ULTIMATE cert *(FULL GO, not REAL-C-03)* | U2.13/U2.14 | ☐ OPEN | REM-03′ |

---

## 5. The C-6 Release-Review Predicate

Beyond the numbered gates, the release act requires the `ARTICLE-IX-LOCK-RELEASE-REVIEW` to be **re-rendered showing every precondition CLOSED and independently attested** (`UCOS-LOCK-REL-EXEC-R2-001` Step 9; `UCOS-EVIDENCE-REQ-R2-001` EL-2). Its v1 disposition was **NOT YET RELEASE-READY**; the design conditions (C-1..C-5 + CP-1/2/3) are CLOSED, but the operational and (until now) independence predicates were open. After C-05 closure this review can only flip to RELEASE-READY once **UCC-4 (Operational Certification)** and **C-C (terminal cert `-002`)** are closed.

| Predicate in review | Post-C-05 state |
|---------------------|:---------------:|
| Design conditions C-1..C-5 + CP-1/2/3 | ✅ CLOSED |
| Independent adjudication (was decisive) | ✅ CLOSED (C-05) |
| Terminal certification current (`-002`) | ☐ OPEN (C-C) |
| Operational Certification | ☐ OPEN (C-G/UCC-4) |
| In-scope fabric ratification | ☐ OPEN (C-H) |
| AD-0014 boundary deliberation (no INV-14..20) | required at review |

---

## 6. Gate Summary

| Gate class | Total | Closed (post-C-05) | Open | Terminal |
|------------|:-----:|:------------------:|:----:|:--------:|
| REAL-C-05 (G1–G4) | 4 | 3 | 1 (G4) | — |
| Operational (G12-1/2/3) | 3 | 0 | 3 | — |
| UCC | 6 (1/2/4/5/6 relevant) | 2 (UCC-1/2 re-affirmable) | 3 (UCC-4/5/6) | **UCC-5** |
| Conditions (C-A..C-I for release) | 9 | 2 (C-A, C-D) | 7 | **C-I** |

> **Terminal gate = UCC-5 / C-I** (the full-release act). It fires last and only when every upstream gate is CLOSED and independently attested. **First open gate to act on = UCC-6 (PE-12 ADR)** and **C-B re-attestation** (both immediately available now that the IA exists).

## Governance / Non-Mutation Statement
No gate was opened, closed, or altered. REAL-C-05 closure (G1–G3) is an analytical assumption. No lock released, no certification issued, no attestation produced, no Board act enacted. `INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX lock, and `UCOS-CONSTRUCTION-BLOCKED` unchanged. Read-only analysis.

**END ARTICLE-IX-GATE-MATRIX — OPEN GATES: G4, G12-1/2/3, UCC-4, UCC-5, UCC-6 · TERMINAL = UCC-5 · FIRST ACTIONABLE = UCC-6 + C-B RE-ATTEST · BINDING = G12-1→2→3.**
