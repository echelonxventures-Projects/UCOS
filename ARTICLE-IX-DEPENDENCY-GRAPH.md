# ARTICLE IX — DEPENDENCY GRAPH

> **PHASE R.4 · ARTICLE IX RELEASE READINESS PACKAGE · READ-ONLY GOVERNANCE ANALYSIS**
> **NO CODE · NO IMPLEMENTATION · NO GOVERNANCE MUTATION · NO RELEASE · NO CERTIFICATION**
> The residual dependency graph from **REAL-C-05 closed** to **Full Article IX Release (`REAL-C-03`, UCC-5)** and onward to **FULL GO** (`REAL-C-04`).

| Field | Value |
|-------|-------|
| Artifact ID | `ARTICLE-IX-DEPENDENCY-GRAPH` |
| Phase | **R.4** · Version 1.0.0 · Date 2026-07-03 |
| Assumption | **DONE nodes:** `REM-01` (REAL-C-05 G1–G3), `REM-04` (durability C-D). **G4 dual-witness open.** |
| Source | `UCOS-REM-PROG-001` §4/§5, `UCOS-LOCK-REL-EXEC-R2-001` sequence, `UCOS-FULL-GO-PATH-R2-001` critical path. |
| Edge legend | `A ──► B` = A is a blocking predecessor of B. |

---

## 1. Node Legend (residual items only)

| Node | Item | Condition | Wave | Class |
|------|------|:---------:|:----:|-------|
| ✅ REM-01 | Independent adjudication (REAL-C-05 G1–G3) | C-A | A | done |
| ✅ REM-04 | Corpus durability | C-D | A | done |
| REM-05 | Re-attest authority chain + PI-8/PI-9 | C-B | A | Governance |
| REM-03 | Re-issue `UCOM-ULTIMATE-CERT-002` | C-C | B | Certification |
| REM-11 | PE-12 observability ADR (UCC-6) | C-E | B | Governance |
| REM-13 | Enroll INV-CORE-01..14 | — | B | Governance |
| REM-17/18/19 | Documentary reconciliation | — | B | Documentation |
| REM-10 | Universal audit/provenance | — | C | Engineering |
| REM-06 | Product layer (28 domains/services/experience) | C-H | C | Engineering |
| REM-14 | PI-10 (AD-0024) + PI-11 (AD-0022) | C-H | C | Engineering |
| REM-20/21/22 | Durable adapters / mesh rules / anti-fragility | — | C | Engineering |
| REM-12/16 | IP governance / research fabric | — | C | Gov/Eng |
| REM-02 | Provision + pipeline + DR + measured NFRs (G12-1/2/3) | C-F | D | Evidence (H) |
| REM-08 | Contract-test execution | C-F | D | Evidence |
| REM-09 | Live security verification | C-F | D | Evidence |
| **REM-15** | **Operational Certification** (UCC-4, G4 dual-witness) | C-G | E | Certification (B) |
| **REM-07** | **Article IX lock RELEASE** (UCC-5) — `REAL-C-03` | C-I | E | Governance (B) |
| REM-03′ | ULTIMATE cert freeze (ULT 1.0.0) — `REAL-C-04` | C-J | E | Certification (B) |

---

## 2. Residual Dependency Graph (post-C-05)

```
   ✅ REM-01 (REAL-C-05 done) ─┐
   ✅ REM-04 (durable) ────────┤
                               ▼
                        REM-05 (re-attest chain + PI-8/9)   [C-B]
                               │
             ┌─────────────────┼───────────────────────────┐
             ▼                 ▼                            ▼
        REM-03 (cert-002)  REM-11 (PE-12 ADR, UCC-6)   REM-13 (INV-CORE)
             [C-C]              [C-E]                    (+ REM-17/18/19 documentary, independent)
             │                  │
             │                  ▼
             │        ┌───────────────────────────────────────────────┐
             │        │  WAVE C engineering (scoped; product/fabric     │
             │        │  build gated by REM-07 for general lock)        │
             │        │  REM-10 ─► REM-06 ─► REM-14                      │
             │        │           REM-06 ─► REM-20 ─► REM-22            │
             │        │           REM-06 ─► REM-21                       │
             │        │           REM-12 ─► REM-16                       │
             │        └───────────────────────────────────────────────┘
             │                  │
             │                  ▼   (binding constraint — serial, human real-spend)
             │        REM-02 (G12-1 ─► G12-2 ─► G12-3)   [C-F]  ◄── REM-11, REM-06/REM-20
             │             │        │
             │        REM-08 (contract tests) ◄── REM-02
             │        REM-09 (live security)  ◄── REM-02, REM-21
             │             │
             ▼             ▼
        ┌───────────────────────────────────┐
        │  REM-15  Operational Certification │  [C-G / UCC-4]   ◄── REM-02 + REM-08 + REM-09 + G4 (2nd IA)
        └───────────────────────────────────┘
                        │
   REM-01 + REM-03 + REM-05 + REM-14 + REM-15 ─────► ┌──────────────────────────────┐
                                                     │  REM-07  ARTICLE IX RELEASE  │ [C-I / UCC-5] = REAL-C-03
                                                     └──────────────────────────────┘
                        │
                        ▼
                   REM-03′ (ULTIMATE cert, ULT 1.0.0)  [C-J] = REAL-C-04 ─► FULL GO
```

---

## 3. Predecessor Sets for the Terminal Nodes

| Node | Complete predecessor set (must all be CLOSED) |
|------|-----------------------------------------------|
| **REM-15** (Operational Certification, UCC-4) | REM-02 ∧ REM-08 ∧ REM-09 ∧ **G4 dual-witness (2nd IA)** |
| **REM-07** (`REAL-C-03`, UCC-5) | REM-01(✅) ∧ REM-05 ∧ REM-03 ∧ REM-14 (in-scope fabrics) ∧ **REM-15** ∧ re-rendered release review (EL-2) |
| REM-03′ (`REAL-C-04`, C-J) | REM-07 ∧ product build (REM-06) ∧ arch-completeness re-audit |

---

## 4. Parallelization (does NOT extend the critical path)

Runnable concurrently once the IA exists (which it does, post-C-05), off the critical path:
- **REM-05** re-attestations ∥ **REM-11** PE-12 ADR ∥ **REM-13** INV-CORE ∥ documentary **REM-17/18/19**.
- **REM-03** terminal cert re-issue ∥ NFR-floor authoring (EV-2).
- Wave-C engineering items not upstream of REM-02: **REM-10, REM-12, REM-16, REM-22** (bounded by their own gates).

## 5. Serial Spine (cannot be parallelized)
```
REM-05/REM-03/REM-11 (front wave) ─► REM-02 (G12-1 ─► G12-2 ─► G12-3) ─► REM-15 ─► REM-07 ─► REM-03′
```
The `G12-1 → G12-2 → G12-3` sub-chain inside REM-02 is **strictly serial** (provision before test before measure) and **human real-spend gated** (`AD-0015` + `AD-0009`) — the governing bottleneck.

## Governance / Non-Mutation Statement
No dependency was executed; no node was closed. REAL-C-05 (REM-01) and durability (REM-04) are marked DONE as the stated analytical assumption only. No lock released, no certification issued, no attestation produced. `INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX lock, and `UCOS-CONSTRUCTION-BLOCKED` unchanged. Read-only analysis.

**END ARTICLE-IX-DEPENDENCY-GRAPH — DONE: REM-01, REM-04 · SERIAL SPINE = REM-05/03/11 → REM-02(G12-1→2→3) → REM-15 → REM-07(REAL-C-03) → REM-03′(FULL GO) · BOTTLENECK = REM-02.**
