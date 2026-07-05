# UCOS Ω∞ — GOVERNANCE DEPENDENCY GRAPH (WORKSTREAM C)

> **PHASE R.2 · ARTICLE IX LOCK RELEASE ANALYSIS · READ-ONLY GOVERNANCE ANALYSIS**
> NO CODE · NO IMPLEMENTATION · NO LOCK RELEASE · NO GOVERNANCE MODIFICATION

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-GOV-DEPGRAPH-R2-001` |
| Workstream | **C — Dependency Analysis** |
| Phase | **R.2** |
| Date | 2026-07-03 |
| Mode | **ANALYSIS ONLY** — maps the governance dependencies among Article IX, REAL-C-05, certification, operational evidence, Board acts, and release authority; identifies critical path, blocking dependencies, and parallelizable activities. |
| Inputs (read-only) | Workstreams A/B (`UCOS-ART9-ANALYSIS-R2-001`, `UCOS-REAL-C-05-ANALYSIS-R2-001`); `REAL-001` §4/§5; `UCOS-MASTER-RAT-001` §5; `UCOS-GAP-MASTER-001`; `REAL-C-05-PROGRAM-RECOVERY-...` §5 |
| **Determination** | Single **critical path** anchored on `REAL-C-05` (independent adjudication) → operational evidence → Operational Certification → full Article IX release → product/ULTIMATE. Several documentary and durability activities are **parallelizable** at the front of the path. |

---

## 1. Node Inventory

| Node | Meaning | Governing unit | State |
|------|---------|----------------|:-----:|
| **N-C05** | Independent adjudication enacted (IA designation + key + ≥1 attestation) | `REAL-C-05` G1–G3 | PARTIAL (0/4) |
| **N-C05W** | Dual-witness adjudication (terminal/op cert) | `REAL-C-05` G4 / WIT | ABSENT |
| **N-RECON** | `PROJECT-STATE` reconciled to reality | `REAL-M-03` | ~DONE (self-attested) |
| **N-CERT1** | Terminal cert re-issued `UCOM-ULTIMATE-CERT-002` | `REAL-C-01` | PENDING |
| **N-REATT** | Re-attest authority chain + PI-8/PI-9 | `AUTH-REST-004`/`REAL-H-07` | PENDING |
| **N-DUR** | Corpus committed/pushed/tagged (151 files) | `REAL-M-07` | PENDING |
| **N-PE12** | PE-12 observability ADR decided | `REAL-M-04` | OPEN |
| **N-NFR** | Quantitative NFR floors authored | `REAL-M-06` | PENDING |
| **N-ENV** | ENV-DEV/INT provisioned (G12-1) | `REAL-C-02` / AD-0015 + AD-0009 | ABSENT |
| **N-PIPE** | Pipeline + contract tests (G12-2) | `REAL-C-02` | ABSENT |
| **N-DR** | DR drill + measured RPO/RTO/p99/availability (G12-3) | `REAL-C-02` | ABSENT |
| **N-OPCERT** | Operational Certification issued (UCC-4) | `REAL-C-02` | PENDING |
| **N-FAB** | In-scope fabrics constructed + ratified (PI-10/PI-11) | `REAL-H-01` / AD-0024, AD-0022 | DESIGN-ONLY |
| **N-REL** | **Full Article IX lock release** (UCC-5) | `REAL-C-03` | PENDING |
| **N-PROD** | Product construction (domains/services/experience) | `REAL-C-04` | UNBUILT |
| **N-ULT** | Arch-completeness re-audit + ULTIMATE cert | `U2.13`/`U2.14` | PENDING |
| **N-BOARD** | Authority Board acts (designation, releases, cert release) | AUTH-012 / Art. XII | recurring actor |

---

## 2. Dependency Edges (A → B = A must precede/enable B)

```
N-BOARD ──designation──▶ N-C05 (G1)
N-C05  ──────────────▶ N-REATT        (independence makes re-attestation defensible)
N-C05  ──────────────▶ N-CERT1        (cert re-issue needs 2nd-party attestation, REAL-C-01 elem 6)
N-C05  ──────────────▶ N-C05W         (dual-witness bootstraps from the first IA)
N-C05  ──(element 6 of every unit)──▶ N-FAB, N-OPCERT, N-REL   (universal review predecessor)

N-PE12 ──────────────▶ N-NFR ─────────▶ N-DR        (observability → floors → measured metrics)
N-DUR  ──────────────▶ N-ENV           (durable ledger before real-spend acts)
N-ENV  ──────────────▶ N-PIPE ─────────▶ N-DR        (strict G12-1 → G12-2 → G12-3 evidence chain)
N-DR   ──────────────▶ N-OPCERT
N-C05W ──────────────▶ N-OPCERT        (dual-witness required for operational cert)

N-OPCERT ────────────▶ N-REL           (operational proof precedes full release)
N-CERT1  ────────────▶ N-REL           (non-stale terminal instrument)
N-REATT  ────────────▶ N-REL
N-FAB    ────────────▶ N-REL           (in-scope fabrics ratified before general release)
N-BOARD  ──release act──▶ N-REL

N-REL ───────────────▶ N-PROD ─────────▶ N-ULT
```

---

## 3. Critical Path

The longest chain of hard dependencies that gates **FULL GO** (full Article IX release → product → ULTIMATE):

```
N-BOARD(designate)
  → N-C05 (G1→G2→G3 independent adjudication)          [decisive; universal predecessor]
  → N-PE12 (PE-12 ADR)
  → N-NFR (NFR floors)
  → N-ENV (G12-1 provision, AD-0015 + AD-0009 real-spend)
  → N-PIPE (G12-2)
  → N-DR (G12-3 measured NFRs)
  → N-C05W (dual-witness) + N-OPCERT (Operational Certification, UCC-4)
  → N-FAB (PI-10/PI-11 constructed + independently ratified)
  → N-REL (FULL ARTICLE IX RELEASE, UCC-5)
  → N-PROD (product construction, REAL-C-04)
  → N-ULT (ULTIMATE certification / baseline freeze)
```

**Critical-path length:** 12 governed stages. **Binding constraint:** N-ENV → N-PIPE → N-DR (human approvals + real cloud spend under AD-0015 + AD-0009); this is the single longest, least-compressible segment.

**Sub-critical path to OPERATIONALLY CERTIFIED only** (the nearer milestone, per REAL-001 §5 — excludes N-FAB/N-REL/N-PROD/N-ULT):
```
N-C05 → N-PE12 → N-NFR → N-ENV → N-PIPE → N-DR → N-C05W → N-OPCERT
```

---

## 4. Blocking Dependencies

| # | Blocking dependency | Blocks | Severity |
|:-:|---------------------|--------|:--------:|
| BD-1 | **N-C05** (independent adjudication) is a predecessor of N-REATT, N-CERT1, N-C05W, N-OPCERT, N-FAB, N-REL | Everything defensible | **DECISIVE** |
| BD-2 | **N-PE12** blocks N-NFR/N-DR (no metrics without observability) | Operational evidence | HIGH |
| BD-3 | **N-DUR** blocks N-ENV (real-spend acts need a durable ledger) | Provisioning | HIGH |
| BD-4 | **N-ENV → N-PIPE → N-DR** strict evidence chain (each step feeds the next) | Operational cert | HIGH |
| BD-5 | **N-OPCERT** blocks N-REL (no full release without operational proof) | Full release | CRITICAL |
| BD-6 | **N-CERT1 + N-REATT** block N-REL (credible, independently-attested instruments) | Full release | HIGH |
| BD-7 | **N-C05W** blocks N-OPCERT (dual-witness required for operational/terminal cert) | Operational cert | HIGH |
| BD-8 | **N-REL** blocks N-PROD (product construction only post full release) | Product | CRITICAL |

---

## 5. Parallelizable Activities

Activities with no mutual dependency that may proceed concurrently:

| Wave | Parallel set | Rationale |
|------|--------------|-----------|
| **W1 (front)** | `N-C05 (G1 designation)` ∥ `N-RECON` ∥ `N-CERT1 (draft)` ∥ `N-DUR` ∥ `N-PE12` | Independent adjudication designation, state reconciliation, cert-draft, durability commit, and the PE-12 ADR share no hard predecessor (though N-CERT1/N-REATT *finalization* awaits N-C05 G3). Best coordinated in one Board sitting. |
| **W2** | `N-NFR` ∥ (`N-REATT` finalize) ∥ (`N-CERT1` finalize under N-C05) | NFR floors authored while re-attestation and cert re-issue are independently signed. |
| **W3** | `N-ENV → N-PIPE → N-DR` (serial internally) ∥ `N-FAB` planning | The operational spine is serial, but PI-10/PI-11 construction *planning* (not ratification) can proceed in parallel; their independent ratification still needs N-C05. |
| **W4** | none — `N-OPCERT`, then `N-REL`, then `N-PROD`, then `N-ULT` are strictly serial | Certification/release/product acts are gate-serial. |

**Key accelerator (from `REAL-C-05-PROGRAM-RECOVERY` §5 / REAL-001 §5):** enact `N-C05 (G1)` and `N-PE12` at the **same Board sitting** that names the REAL-M-07 RM-8 adjudicator; make the **RM-8 durability attestation double as the C-05 G3 genesis** (one act closes independence + durability-verification), collapsing W1 into a single governed ceremony.

---

## OUTPUT — Workstream C

- **Critical path:** `N-C05 → N-PE12 → N-NFR → N-ENV → N-PIPE → N-DR → N-C05W → N-OPCERT → N-FAB → N-REL → N-PROD → N-ULT` (12 stages).
- **Decisive blocking dependency:** `N-C05` (independent adjudication) — the universal review predecessor; nothing downstream is defensibly attestable until G1→G3 close.
- **Binding constraint:** the `N-ENV → N-PIPE → N-DR` operational segment (human real-spend under AD-0015 + AD-0009).
- **Highest-leverage parallelization:** collapse the W1 documentary/governance set into one Board ceremony that also names the RM-8 adjudicator, letting the RM-8 attestation serve as the C-05 G3 genesis.
- **Two milestones distinguished:** OPERATIONALLY CERTIFIED (N-OPCERT) is reachable without N-FAB/N-REL/N-PROD; FULL GO (full Article IX release + product + ULTIMATE) requires the entire critical path.

## Governance / Non-Mutation Statement
No code, infrastructure, or authorization produced; no lock released; no governance modified. `INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX lock, and `UCOS-CONSTRUCTION-BLOCKED` unchanged. Read-only analysis.

**END UCOS-GOV-DEPGRAPH-R2-001 — CRITICAL PATH ANCHORED ON REAL-C-05 · BINDING CONSTRAINT = OPERATIONAL EVIDENCE SEGMENT · W1 PARALLELIZABLE INTO ONE BOARD CEREMONY.**
