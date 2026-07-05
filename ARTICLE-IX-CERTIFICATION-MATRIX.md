# ARTICLE IX — CERTIFICATION MATRIX

> **PHASE R.4 · ARTICLE IX RELEASE READINESS PACKAGE · READ-ONLY GOVERNANCE ANALYSIS**
> **NO CODE · NO IMPLEMENTATION · NO GOVERNANCE MUTATION · NO CERTIFICATION · NO RELEASE**
> Every certification / ratification act required between **REAL-C-05 closed** and **Full Article IX Release (`REAL-C-03`)**, plus the one additional act required for **FULL GO**.

| Field | Value |
|-------|-------|
| Artifact ID | `ARTICLE-IX-CERTIFICATION-MATRIX` |
| Phase | **R.4** · Version 1.0.0 · Date 2026-07-03 |
| Assumption | REAL-C-05 CLOSED (G1–G3); a designated IA is available; **2nd IA (G4 dual-witness) not yet designated**. |
| Current certification level | **CONDITIONALLY CERTIFIED** (unchanged). |
| Legend | ☐ NOT ISSUED · ◐ STALE/SUPERSEDED · ✅ ISSUED · (2IA) requires dual-witness · (B) Board release act |

---

## 1. Certification Acts Remaining

| # | Certification / ratification | Instrument | For | Status | Requires |
|:-:|------------------------------|-----------|:---:|:------:|----------|
| CERT-1 | **Terminal certification re-issue** | `UCOM-ULTIMATE-CERT-002` | `REAL-C-03` predicate P2 (C-C) | ☐ (R14 = ◐ stale) | 269/269 reproduced + `MEM-RAT-003` + IA attestation (REM-03/REM-05) |
| CERT-2 | **Operational Certification** | supersedes `UCOS-P12-CERT-001` (PENDING) | `REAL-C-03` predicate P3 (C-G / UCC-4) | ☐ | G12-1∧G12-2∧G12-3 + **G4 dual-witness (2IA)** (REM-15) |
| CERT-3 | **PI-10 / PI-11 ratification** | per-increment ratification determinations | `REAL-C-03` predicate P4 (C-H) | ☐ | scoped construction (AD-0024 PI-10 / AD-0022 PI-11) + IA ratification (REM-06/REM-14) |
| CERT-4 | **ULTIMATE certification** *(FULL GO, not REAL-C-03)* | ULTIMATE cert, freeze at **ULT 1.0.0** | `REAL-C-04` (C-J) — post-release | ☐ | full release (UCC-5) + product build + arch-completeness re-audit (U2.13/U2.14) |

> **For the release act itself (`REAL-C-03` / UCC-5) three certification acts must complete: CERT-1, CERT-2, CERT-3.** CERT-4 (ULTIMATE) is **after** the release and belongs to FULL GO.

---

## 2. CERT-1 — Terminal Certification `UCOM-ULTIMATE-CERT-002`

| Aspect | Detail |
|--------|--------|
| Why | Stale R14 instrument (`UCOM-ULTIMATE-CERT-001`: 134/134, chain "DEFECTIVE", Memory "REJECTED") must be replaced against the **269/269** canonical state. Closes `G-C3`. |
| Inputs | Reproduced `node --test` 269/269 (EC-1); `AUTH-012` v1.0.13 (EC-2); `MEM-RAT-003`; `GOV-REC-001` precedence rule; reconciliation table (EC-3). |
| Post-C-05 enabler | Now **independently attestable** (EC-5) — the number-reproduction can carry an IA attestation, removing the self-attestation discount. |
| Owner | **CA** issues · **IA** attests · **Board** records supersession. |
| Completion | `-002` issued; supersession of R13/R14 enrolled append-only in AUTH-012; IA attestation attached. |
| Blocks | P2 of the release; a predicate of the re-rendered release review (EL-2). |

---

## 3. CERT-2 — Operational Certification (UCC-4)

| Aspect | Detail |
|--------|--------|
| Why | Certifies the built foundation **runs, is resilient, and meets NFRs** → state **OPERATIONALLY CERTIFIED** (milestone M-γ). Closes UCC-4 and the operational half of `RK-2`/`RK-3`. |
| Inputs | G12-1 provisioning attestation; G12-2 pipeline + contract results (signed); G12-3 DR + measured RPO/RTO/p99/availability vs floors; live security proof (mTLS STRICT, deny-by-default). |
| **Dual-witness (G4)** | **Requires TWO distinct Independent Adjudicators** concurring (WIT-1..5). This is the **certification-time activation of REAL-C-05 G4** — a **second IA designation** is a prerequisite governance act. |
| Owner | **CA** issues · **IA×2** dual-witness · **Board** release. |
| Completion | G12-1∧G12-2∧G12-3 CLOSED; NFRs meet floors; two concurring IA attestations; instrument issued (supersedes PENDING). |
| Blocks | P3 of the release; the nearest major milestone before UCC-5. |
| Fail-closed | Any below-floor NFR ⇒ CONDITIONAL / NOT ACHIEVED ⇒ no certification ⇒ no release. |

---

## 4. CERT-3 — PI-10 / PI-11 Ratification

| Aspect | Detail |
|--------|--------|
| Why | The in-scope upper fabrics must be constructed and **independently ratified** before they can be included in the release scope. Closes `G-M2` / condition C-H. |
| Scope | **PI-10 Intelligence** under scoped authorization **AD-0024** (ISSUABLE-WITH-CONDITIONS); **PI-11 Simulation** under standing **AD-0022**. |
| Per-increment gate | Each increment: contract-conformance PASS, adversarial suite PASS, operational evidence on env, **independent ratification** (IA). |
| Owner | implementation owners · **IA** ratifies · **CA** · **Board**. |
| Completion | PI-10 + PI-11 ratification determinations issued and independently attested. |
| Note | Depends on universal audit composition (`REM-10`) and product substrate (`REM-06`); construction of these fabrics is itself a **scoped carve-out**, not the general lock lift. |

---

## 5. CERT-4 — ULTIMATE Certification (post-release, FULL GO)

| Aspect | Detail |
|--------|--------|
| Why | Terminal state of FULL GO: product layer built + independently ratified, architecture-completeness re-audit (U2.13/U2.14), certification frozen at **ULT 1.0.0**. Closes `G-C4` / condition C-J. |
| Dependency | **Occurs after UCC-5** (the release). Not a predicate of `REAL-C-03`; it is the predicate of **REAL-C-04 / FULL GO**. |
| Owner | implementation owners · **IA** per-increment ratification · **CA** · **Board**. |
| Completion | ratified product surface realized; ULTIMATE certification issued; baseline frozen → **FULL GO**. |

---

## 6. Certification Sequence

```
CERT-1 (UCOM-ULTIMATE-CERT-002)  ─┐
                                   ├─► (predicates for release review EL-2)
CERT-3 (PI-10/PI-11 ratification) ─┤
                                   │
CERT-2 (Operational Certification, 2IA dual-witness) ─┘
        ▲ requires G12-1→2→3 (binding constraint)
        │
   ═════╪═══════════════ UCC-5 : FULL ARTICLE IX RELEASE (REAL-C-03) ═════════════
        ▼
CERT-4 (ULTIMATE cert, ULT 1.0.0)  ← post-release → FULL GO (REAL-C-04)
```

---

## 7. Summary

| For | Certifications required | Count |
|-----|-------------------------|:-----:|
| **`REAL-C-03` (Article IX Release)** | CERT-1, CERT-2, CERT-3 | **3** |
| **FULL GO (adds `REAL-C-04`)** | + CERT-4 | **4 total** |

> **Decisive certification for the release = CERT-2 (Operational Certification)**, because it consumes the operational-evidence binding constraint **and** activates the REAL-C-05 **G4 dual-witness** (requiring a **second IA designation**). CERT-1 and CERT-3 are governance/ratification acts compressible into Board sittings; CERT-2 cannot be, because it waits on measured runtime evidence.

## Governance / Non-Mutation Statement
No certification or ratification was issued, re-issued, superseded, or attested. REAL-C-05 closure is an analytical assumption; the 2nd-IA designation for G4 is identified as a prerequisite, **not** enacted here. Certification level unchanged: **CONDITIONALLY CERTIFIED**. `INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX lock, and `UCOS-CONSTRUCTION-BLOCKED` unchanged. Read-only analysis.

**END ARTICLE-IX-CERTIFICATION-MATRIX — RELEASE NEEDS CERT-1 (TERMINAL -002) + CERT-2 (OP-CERT, 2IA) + CERT-3 (PI-10/11 RATIFY) · FULL GO ADDS CERT-4 (ULTIMATE) · DECISIVE = CERT-2 · 2ND IA DESIGNATION REQUIRED FOR G4.**
