# ARTICLE IX — CLOSURE CHECKLIST

> **PHASE R.4 · ARTICLE IX RELEASE READINESS PACKAGE · READ-ONLY GOVERNANCE ANALYSIS**
> **NO CODE · NO IMPLEMENTATION · NO GOVERNANCE MUTATION · NO RELEASE · NO CERTIFICATION**
> The ordered, fail-closed checklist from **REAL-C-05 closed** to **Full Article IX Release (`REAL-C-03`)**, then to **FULL GO**.

| Field | Value |
|-------|-------|
| Artifact ID | `ARTICLE-IX-CLOSURE-CHECKLIST` |
| Phase | **R.4** · Version 1.0.0 · Date 2026-07-03 |
| Assumption | REAL-C-05 CLOSED (G1–G3 ✅, durability ✅). G4 dual-witness OPEN. |
| Owners | **Board** (Authority Board) · **IA** (Independent Adjudicator) · **IA2** (second IA) · **Cust** (Chief Authority Architect) · **CA** (Certifying Authority) · **Exec** (named executor). |
| Legend | ✅ done (assumption) · ☐ open · (H) human/real-spend · (B) Board act |

---

## 0. Precondition (satisfied by assumption)

| Step | Item | Owner | Gate | Status |
|:----:|------|-------|:----:|:------:|
| AC-0a | REAL-C-05 IA designation | Board | G1 | ✅ |
| AC-0b | IA public key registered | Cust/Exec/Board | G2 | ✅ |
| AC-0c | Genesis attestation on chain (verified) | IA | G3 | ✅ |
| AC-0d | Corpus durable (commit/push/tag; designation AD landed) | Exec | C-D | ✅ |

---

## 1. Front Wave — defensibility + capturability (parallel; no lock, no spend)

| Step | Item | Owner | Gate/Cond | REM | Status |
|:----:|------|-------|:---------:|:---:|:------:|
| AC-1 | Independently **re-attest** authority chain + PI-8/PI-9 | IA / Cust | C-B / UCC-1/2 | REM-05 | ☐ |
| AC-2 | Re-issue **`UCOM-ULTIMATE-CERT-002`** vs 269/269 (+ supersession note, IA attestation) | CA / IA / Board(B) | C-C | REM-03 | ☐ |
| AC-3 | Decide **PE-12 observability ADR** (+ ADR-002A / PE-07) | Board(B) | C-E / UCC-6 | REM-11 | ☐ |
| AC-4 | Enroll **INV-CORE-01..14** runtime invariants | Board(B) / IA | — | REM-13 | ☐ |
| AC-5 | Author quantitative **NFR floors** (CAP-01..14) as acceptance thresholds | Cust / CA | EV-2 | REM-18/06 | ☐ |
| AC-6 | Documentary reconciliation (suite-count, stale header, "Party" term) | Cust | — | REM-17/18/19 | ☐ |

**Exit:** foundations independently attested; terminal instrument current; metrics capturable; NFR floors authored. **All authorized now — no lock release, no spend.**

---

## 2. Governance Prerequisite for Dual-Witness

| Step | Item | Owner | Gate | Status |
|:----:|------|-------|:----:|:------:|
| AC-7 | **Designate a SECOND Independent Adjudicator** (distinct actor + disjoint KMS key) — activates G4 capability | Board(B) | G4-prep | ☐ |

> Required so the Operational Certification (AC-13) can carry a **dual-witness** (two concurring IAs). Do this before AC-13; can be co-scheduled with AC-3.

---

## 3. Operational-Evidence Segment (binding constraint — strictly serial, human real-spend)

| Step | Item | Owner | Gate | REM | Status |
|:----:|------|-------|:----:|:---:|:------:|
| AC-8 | Board approves **AD-0009 real-spend** envelope for ENV-DEV/INT | Board(B) | — | — | ☐ |
| AC-9 | **Provision ENV-DEV + ENV-INT** internal-only, S1/S3/S4 enforced → provisioning attestation | Exec(H) / CA | **G12-1** | REM-02 | ☐ |
| AC-10 | Execute **CI/CD pipeline + contract tests** (85 + API-018/API-027), signed artifacts | Exec / CA | **G12-2** | REM-02/08 | ☐ |
| AC-11 | Verify **live security** (mTLS STRICT, deny-by-default, S1/S3/S4) | Exec / CA | G12-1/2 | REM-09 | ☐ |
| AC-12 | **DR drill + measured NFRs** (RPO/RTO/p99/availability vs floors) | Exec / CA | **G12-3** | REM-02 | ☐ |

**Exit:** G12-1 ∧ G12-2 ∧ G12-3 CLOSED; every NFR floor met (fail-closed — any miss = NOT ACHIEVED).

---

## 4. Operational Certification (milestone M-γ)

| Step | Item | Owner | Gate | REM | Status |
|:----:|------|-------|:----:|:---:|:------:|
| AC-13 | Issue **Operational Certification** with **dual-witness (IA + IA2 concurring)** | CA / IA×2 / Board(B) | **C-G / UCC-4 / G4** | REM-15 | ☐ |

**Exit:** UCC-4 CLOSED → **OPERATIONALLY CERTIFIED**. Nearest major milestone before the release.

---

## 5. In-Scope Fabric Construction + Ratification

| Step | Item | Owner | Gate | REM | Status |
|:----:|------|-------|:----:|:---:|:------:|
| AC-14 | Compose **universal audit/provenance** (`AUDIT-UNIV-001` + `PROOF-IMPL-001`) | Eng / IA | — | REM-10 | ☐ |
| AC-15 | Construct + **independently ratify PI-10** (AD-0024) + **PI-11** (AD-0022) | Eng / IA / Board | **C-H** | REM-14/06 | ☐ |

**Exit:** in-scope fabrics realized and independently ratified.

---

## 6. TERMINAL — Full Article IX Release (`REAL-C-03` / UCC-5)

| Step | Item | Owner | Gate | REM | Status |
|:----:|------|-------|:----:|:---:|:------:|
| AC-16 | Re-render **`ARTICLE-IX-LOCK-RELEASE-REVIEW`** — all predicates CLOSED + independently attested; AD-0014 boundary deliberation (no INV-14..20) | IA / Cust | EL-2 | REM-07 | ☐ |
| AC-17 | Write scoped-release **reconciliation** (AD-0015 / AD-0016..0024 vs full release) | Cust | EL-3 | REM-07 | ☐ |
| AC-18 | Issue **AD-0024** scoped release (PI-10, with conditions); rely on standing **AD-0022** (PI-11) | Board(B) | — | — | ☐ |
| AC-19 | **ENACT FULL RELEASE** — issue `UCOS-ARTICLE-IX-LOCK-RELEASE.md` + `UCOS-CONSTRUCTION-AUTHORIZATION.md` + `AUTH-012` full-release entry | **Board(B)** | **C-I / UCC-5** | REM-07 | ☐ |

**Exit:** `UCOS-CONSTRUCTION-BLOCKED` **LIFTED**; UCC-5 CLOSED. **← `REAL-C-03` COMPLETE.**

---

## 7. Post-Release — FULL GO (`REAL-C-04`)

| Step | Item | Owner | Gate | REM | Status |
|:----:|------|-------|:----:|:---:|:------:|
| AC-20 | **Product construction** per-increment behind 85 contracts, each independently ratified | Eng / IA / CA | — | REM-06 | ☐ |
| AC-21 | Architecture-completeness re-audit (U2.13/U2.14) + issue **ULTIMATE certification**, freeze **ULT 1.0.0** | CA / IA / Board(B) | **C-J** | REM-03′ | ☐ |

**Exit:** **FULL GO / ULT 1.0.0.**

---

## 8. Governance-Action Sub-Checklist (Board / Approval-By-Exception acts only)

| # | Board act | Step | Threshold |
|:-:|-----------|:----:|-----------|
| BA-a | Re-issue terminal cert supersession record | AC-2 | Approval-Required |
| BA-b | PE-12 observability ADR | AC-3 | Approval-Required |
| BA-c | Enroll INV-CORE-01..14 | AC-4 | Constitutional-Majority |
| BA-d | Designate 2nd IA (G4) | AC-7 | Approval-Required |
| BA-e | AD-0009 real-spend approval | AC-8 | Approval-Required |
| BA-f | Release Operational Certification | AC-13 | Approval-Required |
| BA-g | Issue AD-0024 scoped release (PI-10) | AC-18 | Approval-By-Exception |
| BA-h | **Enact full Article IX release** | AC-19 | **Approval-By-Exception** |
| BA-i | Release ULTIMATE certification | AC-21 | Approval-By-Exception |

> None is a constitutional amendment; Article IX text is unchanged throughout.

## 9. Checklist Summary
- **Steps to `REAL-C-03`:** AC-1 → AC-19 (19 open steps; AC-0a..d satisfied).
- **Steps to FULL GO:** + AC-20, AC-21.
- **Immediately authorizable now (no lock, no spend):** AC-1..AC-7 (front wave + 2nd-IA designation).
- **Binding constraint:** AC-9 → AC-10 → AC-12 (serial, human real-spend).
- **Terminal act:** AC-19 (Board full-release, UCC-5).

## Governance / Non-Mutation Statement
No checklist step was executed. Every ☐ item is a future Approval-Required / Approval-By-Exception operation reserved to the Authority Board. REAL-C-05 closure and durability are analytical assumptions. No lock released, no certification issued, no attestation produced, no key registered, no invariant enrolled. `INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX lock, and `UCOS-CONSTRUCTION-BLOCKED` unchanged. Read-only analysis.

**END ARTICLE-IX-CLOSURE-CHECKLIST — 19 STEPS TO REAL-C-03 (AC-1→AC-19) + 2 TO FULL GO · NOW-AUTHORIZABLE = AC-1..AC-7 · BOTTLENECK = AC-9→AC-10→AC-12 · TERMINAL = AC-19 (UCC-5).**
