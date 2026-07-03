# UCOS-EP-0001 — Master Work Breakdown Structure

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-EP-0001` |
| Program | **UCOS Phase 2 — Master Execution Program** |
| Phase | EP-1 — Work Breakdown Structure |
| Mode | **EXECUTION PLANNING ONLY** — no audit, no redesign, no new requirement, no new RC class, no scope expansion. Decomposes the frozen corpus into an executable WBS. |
| Status | EXECUTION BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Operates under | `UCOS-EXEC-0001`; `UCOS-RA-0001..0008`; `UCOS-IR-0001..0008`; `UCOS-EA-0001..0004` |
| Governing constraints | Constitution / Requirements / Architecture / Realization / Coverage all FROZEN. INV-1..13 unchanged; `AD-0014` intact; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |

---

## 0. Purpose & source of truth

This is the definitive UCOS Work Breakdown Structure. It decomposes the **Civilization Operating System** into
its ratified fabrics and capabilities, using **only** the frozen fabric taxonomy (`UCOS-IR-0003`: 12
FOUNDATIONAL, 7 CORE, 6 OPTIONAL, 5 DEFERRED + FAB-PFC), the ratified capability set (`CAP-01..19`), and the
realization state of record (`UCOS-RA-0004`: PI-2..PI-9 realized; frontier design-only). It invents no fabric,
no capability, and no work outside these sources.

**WBS-level ↔ IR-class mapping (of record):**

| WBS Level | Name | IR-0003 class | Realization |
|:---------:|------|---------------|-------------|
| L0 | Civilization Operating System | (root) | — |
| L1 | Foundational Fabrics | 12 FOUNDATIONAL | REALIZED (4 PARTIAL caveats) |
| L2 | Core Fabrics | 7 CORE | REALIZED |
| L3 | Advanced Fabrics | 6 OPTIONAL + FAB-TIME (DEFERRED-temporal) + FAB-PFC | design/stated/debt |
| L4 | Deferred Fabrics | FAB-INTEL, FAB-SIM, FAB-ECON (DEFERRED-behavioral) | design-only |
| L5 | Civilization Fabrics | FAB-CIV (DEFERRED, `AD-0014`) + unknown-future admission | design-only / held |

---

## 1. WBS tree

```
L0  UCOS — Civilization Operating System
│
├── L1  FOUNDATIONAL FABRICS  (existence floor; REALIZED — PI-2..PI-6)
│    ├── 1.1  FAB-REG    Registry            [REALIZED]   ← CAP-19 (Registry & Discovery)
│    ├── 1.2  FAB-META   Metadata            [REALIZED]   ← CAP-10 (Metadata)
│    ├── 1.3  FAB-CFG    Configuration       [REALIZED]   ← CAP-11 (Config)
│    ├── 1.4  FAB-EXEC   Meta-Core/Execution [REALIZED]   ← CAP-15 (Platform Governance/kernel)
│    ├── 1.5  FAB-EVT    Event               [REALIZED]   ← CAP-12 (Eventing)
│    ├── 1.6  FAB-IDENT  Identity            [REALIZED]   ← CAP-17 (Security & Trust / identity)
│    ├── 1.7  FAB-AUTH   Authority           [REALIZED · PARTIAL]  ← CAP-15  (GAP-M1 dup; attestation RR-1)
│    ├── 1.8  FAB-GOV    Governance          [REALIZED]   ← CAP-15/18 (Policy & Decisioning)
│    ├── 1.9  FAB-POL    Policy              [REALIZED · PARTIAL]  ← CAP-18  (GAP-M3 bounded vocab)
│    ├── 1.10 FAB-EVO    Evolution           [REALIZED]   ← CAP-15 (sole commit path)
│    ├── 1.11 FAB-STATE  State/Lifecycle     [REALIZED · PARTIAL]  ← CAP-15  (GAP-M2 4× engines)
│    └── 1.12 FAB-AUDIT  Audit/Provenance    [REALIZED · PARTIAL]  ← CAP-16  (GAP-C1 6× dup)
│
├── L2  CORE FABRICS  (constitutional completeness; REALIZED — PI-5/7/8/9 + ops)
│    ├── 2.1  FAB-TRUST  Trust               [REALIZED]   ← CAP-17
│    ├── 2.2  FAB-SEC    Security            [REALIZED]   ← CAP-17 (S1/S3/S4)
│    ├── 2.3  FAB-FED    Federation          [REALIZED · PI-5]  ← CAP-15
│    ├── 2.4  FAB-KNOW   Knowledge           [REALIZED · PI-7]  ← CAP-16 (Intelligence & Analytics)
│    ├── 2.5  FAB-ONTO   Ontology            [REALIZED · PI-8; attestation RR-1]  ← CAP-16
│    ├── 2.6  FAB-MEM    Memory              [REALIZED · PI-9; attestation RR-1]  ← CAP-16
│    └── 2.7  FAB-OPS    Ops/Platform-Eng    [PARTIAL — single-node]  ← CAP-15 (PE-01..17)
│
├── L3  ADVANCED FABRICS  (soundness + temporal + catalog; DEBT / STATED)
│    ├── 3.1  Universal Authority  (AUTH-UNIV-001)   [OPTIONAL · GAP-M1]  ← CAP-15
│    ├── 3.2  Universal Audit/Provenance (AUDIT-UNIV-001) [OPTIONAL · GAP-C1] ← CAP-16
│    ├── 3.3  Universal Lifecycle  (LIFE-UNIV-001)   [OPTIONAL · GAP-M2]  ← CAP-15
│    ├── 3.4  Extensible Policy Vocabulary            [OPTIONAL · GAP-M3]  ← CAP-18
│    ├── 3.5  FAB-TIME  Temporal (T-1..T-7)           [DEFERRED-temporal · UCOS-RA-0003]  ← CAP-15
│    └── 3.6  FAB-PFC   Platform-Factory Catalog      [OPTIONAL · GAP-R29]  ← CAP-15/INV-13
│
├── L4  DEFERRED FABRICS  (behavioral frontier; design-only)
│    ├── 4.1  FAB-INTEL Intelligence  (PI-10)         [DEFERRED · INTEL-001; gated INV-CORE-12]  ← CAP-16
│    ├── 4.2  FAB-SIM   Simulation    (PI-11)         [DEFERRED · SIM-PLAN-001..003; AD-0022]    ← CAP-16
│    └── 4.3  FAB-ECON  Economic      (PI-13)         [DEFERRED · ECON-001; ledger-restore first]← CAP-06/14
│
└── L5  CIVILIZATION FABRICS  (deferred under AD-0014)
     ├── 5.1  FAB-CIV  Civilization  (PI-12)          [DEFERRED · CIV-001; AD-0014]  ← CAP set (non-actuating)
     └── 5.2  Unknown-Future Admission (Stage N)      [DEFERRED · RC-020≡048; INV-13/O-16]  ← CAP-19
```

---

## 2. Fabric inventory roll-up (25 fabrics + 4 convergences)

| Level | Fabrics / work items | Count | Realization |
|:-----:|----------------------|:-----:|-------------|
| L1 Foundational | REG, META, CFG, EXEC, EVT, IDENT, AUTH, GOV, POL, EVO, STATE, AUDIT | 12 | REALIZED (4 PARTIAL) |
| L2 Core | TRUST, SEC, FED, KNOW, ONTO, MEM, OPS | 7 | REALIZED (OPS single-node) |
| L3 Advanced | AUTH-UNIV, AUDIT-UNIV, LIFE-UNIV, Policy-vocab, FAB-TIME, FAB-PFC | 6 | debt / stated |
| L4 Deferred | FAB-INTEL, FAB-SIM, FAB-ECON | 3 | design-only |
| L5 Civilization | FAB-CIV, Unknown-Future Admission | 2 | design-only / held |
| **Total** | | **30** | **19 realized · 11 forward** |

## 3. Capability coverage (CAP-01..19)

Every ratified capability maps to at least one WBS fabric; there is **0 orphan capability** and **0 orphan
fabric**. Commerce capabilities (CAP-01..08) are realized as business services atop the L1/L2 substrate (Wave
3+ business build, gated on production readiness); platform/governance capabilities (CAP-09..19) map directly to
the L1–L3 fabrics above. Intelligence/analytics (CAP-16) spans FAB-KNOW/ONTO/MEM (realized) and FAB-INTEL/SIM
(deferred). No capability requires a fabric outside this WBS.

## 4. Determination

> **The UCOS WBS is complete and closed.** The Civilization Operating System decomposes into **30 fabrics/work
> items across six levels (L0–L5)**, each mapped to its ratified capability and realization state. **19 are
> REALIZED** (the L1 Foundational + L2 Core existence floor, PI-2..PI-9); **11 are forward work** (L3 advanced/
> temporal/catalog, L4 behavioral, L5 civilization). No fabric or capability is invented; every item traces to
> `UCOS-IR-0003`/`0004` and `UCOS-RA-0004`. This WBS is the spine for the Execution Backlog (`UCOS-EP-0002`).

## 5. Scope discipline
No code, requirement, RC class, invariant, or authorization produced. INV-1..13, `AUTH-012`, `AD-0014`, Article
IX lock unchanged; `UCOS-CONSTRUCTION-BLOCKED` stands. WBS only.

## 6. Traceability
- **Consumes:** `UCOS-IR-0003` (fabric classes), `UCOS-IR-0004` (dependency tiers), `UCOS-RA-0004` (fabric disposition), `UCOS-EXEC-0001` (governing determinations), CAP-01..19.
- **Refined by:** `UCOS-EP-0002..0008`.
- **Owner:** UCOS Authority Board.

**END `UCOS-EP-0001` — MASTER WBS · L0 CivOS · 30 FABRICS/ITEMS · L1 12 FOUNDATIONAL · L2 7 CORE · L3 6 ADVANCED · L4 3 DEFERRED · L5 2 CIVILIZATION · 19 REALIZED / 11 FORWARD · 0 ORPHAN · PLANNING ONLY.**
