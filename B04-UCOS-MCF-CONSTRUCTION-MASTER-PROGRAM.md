# B04 — UCOS MCF Construction Master Program

## PHASE B04 — Single Authoritative Construction Authority for the Minimum Constructible Foundation (Consolidation & Validation Only)

| Field | Value |
|-------|-------|
| Artifact | **B04 — UCOS MCF Construction Master Program** |
| Artifact ID | `B04-UCOS-MCF-CONSTRUCTION-MASTER-PROGRAM` |
| Phase | **B04 — MCF Construction Master Program** |
| Layer | ARCHITECTURE / GOVERNANCE (master authority — consolidates the approved corpus; introduces nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **CONSOLIDATION & VALIDATION ONLY** — produce the single authoritative construction-authority document by consolidating, normalizing, cross-reference-validating, and confirming readiness. **No new requirements/governance/architecture/milestones/work-packages/acceptance-criteria/evidence; no implementation, code, infrastructure, technology selection, execution, construction, or `git` mutation (beyond this additive architecture `*.md`, permitted by the S0′ tolerance rule).** Append-only. |
| Authoritative inputs (per mandate) | `F01` (FP-1..12; FC-1..9; IF-*), `F02` (waves/milestones), `F03` (9 domains; MC-1..13; AC-1..9; HO-1..7), `B01` (WP-*; interface matrix; Streams A–D; M0..M4; gates G-*), `B02` (DEL-M0..M4; CE/VE/AE/IVE; AP-1/2/3; IVI-1..8), `B03` (operating/coordination/milestone/evidence/certification/change/failure models) |
| **Resolves** | Closes **AF-B04 / condition C-0** raised in `B05` (the B04 authority document now exists). |
| Governance posture | `UCOS-CONSTRUCTION-BLOCKED` + Article IX generation lock remain **ACTIVE**; this document consolidates and confirms readiness — it authorizes nothing. |
| **Determination** | **MCF MASTER PROGRAM COMPLETE** — the corpus is consolidated, normalized, internally consistent, and construction-ready pending the governed M0 enactment (§ 11). |

> **Nature of this document.** The **single source of construction authority** for the MCF. Where prior artifacts
> diverged in count or numbering, this master **normalizes** to one authoritative statement and records the
> supersession — it invents nothing. Two prior reconciliations are adopted as authoritative: **F02-R1**
> (Knowledge/Ontology split — out of MCF scope) and **F03-R3** (F-OBS deferred → **MCF = 9 domains**).

---

## 1. Executive Summary

- **MCF Scope:** the **9-domain** Minimum Constructible Foundation — Genesis Kernel {F-STO, F-IDN, F-SEC, F-REG} + Operating Spine {F-CFG, F-POL, F-EVT, F-GOV, F-EXE} — the smallest foundation satisfying **FC-1..FC-9** with no Wave 2/3 domain (per F03-R3).
- **Construction Objective:** stand up a registry-driven, policy-governed, deterministic, auditable, recoverable, multi-tenant foundation spine that runs one capability end-to-end (vertical slice) under identity+policy+config — the base for all higher-order UCOS construction.
- **Authorization Boundary:** M0 authorizes the MCF **kernel-first, wave-gated**; **excluded** = commerce/experience/technology/infrastructure; **deferred** = Wave 2 (F-OBS/WFL/INT/MEM/CMP) + Wave 3 (F-KNW/ONT/autonomy); **reserved** = Article IX release, AD-0025/0026, terminal certification.
- **Critical Path:** `F-STO → F-IDN → F-SEC → F-REG → F-CFG → F-POL → F-GOV → F-EXE → vertical-slice (FC-9) → independent validation (M4)` (§ 8).
- **Completion Definition:** **MCF COMPLETE ⟺ AC-1..AC-9 ∧ AC-INT PASS (M3)**, durably committed (REAL-M-07), then **independently certified at M4** (REAL-C-05) with HO-1..HO-7 satisfied.

---

## 2. MCF Scope Authority (normalized)

| Scope class | Authoritative content | Normalization note |
|-------------|-----------------------|--------------------|
| **In Scope** | The 9 MCF domains + their 9 IF-* contracts + genesis seed + one vertical slice; deliverables = specs/contracts/tests + durable increments (B02) | Normalizes F02 (10, incl. F-OBS) → **F03-R3: 9 domains**; F-OBS moved to Deferred |
| **Out of Scope** | Any commerce/experience domain; **technology/framework/datastore/cloud selection**; infrastructure provisioning; anything not required for FC-1..9 | Consistent across F01/F03/B01/B05 |
| **Deferred Scope** | **Wave 2** {F-OBS, F-WFL, F-INT, F-MEM, F-CMP} (FC-10/FC-12); **Wave 3** {F-KNW, F-ONT} + autonomy (FC-11) | F02-R1 (K/O split) applies within deferred scope |
| **Reserved Scope** | Article IX generation-lock release; AD-0025/AD-0026; certification upgrades; terminal/Operational cert (REAL-C-05 §10 dual-witness) | Reserved to future governed acts; not in M0 (B05 §1) |

**Scope-lock (SG-1):** authoritative MCF scope = the 9 in-scope domains, kernel-first. Expansion → re-authorization.

---

## 3. Domain Authority Register (9)

| ID | Domain | Purpose | Key Responsibilities | Dependencies | Acceptance Ownership |
|:--:|--------|---------|----------------------|--------------|----------------------|
| **F-STO** | Durable Substrate | Durable, ordered, append-only persistence + replay | append/read/snapshot/replay; hash-chain storage | genesis seed | Executor → AC-5, AC-6 |
| **F-IDN** | Identity & Tenancy | Attributable principal + tenant context | principal/tenant model; authz-context; scoping | F-STO | Executor → AC-7 (+ AC-9 precond) |
| **F-SEC** | Security & Trust | Cryptographic integrity + trust | sign/verify; key-by-reference; seed verification | F-STO, F-IDN | Executor → AC-1, AC-6 |
| **F-REG** | Registry & Discovery | Authoritative registration/discovery | register/resolve/describe; self-registration; zero-orphan | F-STO, F-IDN, F-SEC | Executor → AC-1, AC-2 |
| **F-CFG** | Configuration & Metadata | Behavior-from-data (zero hard-coding) | config resolution by tenant/context; variability model | root tier | Executor → AC-3 |
| **F-POL** | Policy & Decisioning | Deterministic authorization | policy lifecycle; evaluate→decision; enforcement | F-REG, F-CFG, F-IDN, F-STO | Executor → AC-4 |
| **F-EVT** | Eventing & Messaging | Ordered, idempotent, contract-typed backbone | publish/subscribe; ordering; idempotent delivery; audit-event | F-STO, F-REG, F-IDN | Executor → AC-5, AC-6 |
| **F-GOV** | Governance | Gate every governed operation | gate-check; decision-record; approval/trusted-op lifecycle | F-REG, F-POL, F-IDN, F-STO | Executor → AC-8 |
| **F-EXE** | Execution / Runtime | Deterministic, governed capability invocation | invoke→result; idempotency; identity+policy+config binding; audit emit | F-IDN, F-POL, F-CFG, F-EVT, F-GOV | Executor → AC-9 |

**Final acceptance ownership:** per-domain AC = **Executor**; milestone gate decision = **Authority Board**;
independent validation (M4) = **Independent Adjudicator** (distinct actor, REAL-C-05). *(Restated from B01/B02/B03; no change.)*

---

## 4. Work Package Authority Register (9)

| WP | Deliverables (B01/B02) | Acceptance Criteria | Milestone | Evidence (B02) |
|:--:|------------------------|:-------------------:|:---------:|----------------|
| **WP-STO** | IF-STO spec; ordered-log/hash-chain/replay/snapshot specs; test defs | AC-5, AC-6 | M1 | CE/VE/AE (MC-1, MC-8/9) |
| **WP-IDN** | IF-IDN spec; principal/tenant model; scoping rules | AC-7 (+AC-9 precond) | M1 | CE/VE (MC-3, MC-12) |
| **WP-SEC** | IF-SEC spec; sign/verify; key-by-ref; seed-verify spec | AC-1, AC-6 | M1 | CE/VE (MC-2, MC-8) |
| **WP-REG** | IF-REG spec; registration model; self-registration spec | AC-1, AC-2 | M1 | CE/VE/AE (MC-4) |
| **WP-CFG** | IF-CFG spec; variability/metadata model; resolution semantics | AC-3 | M2 | CE/VE/AE (MC-5) |
| **WP-POL** | IF-POL spec; policy lifecycle + decision model; determinism spec | AC-4 | M2 | CE/VE/AE (MC-6) |
| **WP-EVT** | IF-EVT spec; ordered/idempotent semantics; audit-event schema | AC-5, AC-6 | M2 | CE/VE/AE (MC-7, MC-8) |
| **WP-GOV** | IF-GOV spec; gate-check + decision-record model; lifecycle spec | AC-8 | M2 | CE/VE/AE (MC-10) |
| **WP-EXE** | IF-EXE spec; invocation + idempotency model; vertical-slice def | AC-9 | M2→M3 | CE/VE/AE (MC-11, MC-13) |

*(Kernel WPs → M1; spine WPs → M2; the vertical slice via WP-EXE closes at M3 with AC-INT. Restated from B01/B02; no change.)*

---

## 5. Interface Authority Register

| Interface | Producer | Consumer(s) | In-MCF? | Orphan? | Duplicate? | Deps resolved? |
|-----------|:--------:|-------------|:-------:|:-------:|:----------:|:--------------:|
| genesis-seed (bootstrap) | (seed) | F-STO/IDN/SEC/REG | ✔ | No | No | ✔ (self-registers) |
| **IF-STO** | F-STO | all | ✔ | No | No | ✔ |
| **IF-IDN** | F-IDN | all | ✔ | No | No | ✔ |
| **IF-SEC** | F-SEC | F-REG, F-GOV, F-EVT | ✔ | No | No | ✔ |
| **IF-REG** | F-REG | all | ✔ | No | No | ✔ |
| **IF-CFG** | F-CFG | F-POL, F-EXE | ✔ | No | No | ✔ |
| **IF-POL** | F-POL | F-GOV, F-EXE | ✔ | No | No | ✔ |
| **IF-EVT** | F-EVT | F-EXE, F-GOV | ✔ | No | No | ✔ |
| **IF-GOV** | F-GOV | F-EXE | ✔ | No | No | ✔ |
| **IF-EXE** | F-EXE | capabilities/services | ✔ | No | No | ✔ |

**Validation:** **9 in-MCF interfaces (one per domain) + genesis seed.** No orphan (every interface has a
producer and ≥1 consumer within the MCF). No duplicate (one authoritative producer each). No unresolved
dependency (all consumers resolve within the 9 domains + seed). The Wave-2/3 interfaces from F01 (IF-OBS/WFL/INT/
KNW/MEM/CMP/ONT) are **out-of-MCF-scope**, not orphans (deferred, per §2). **Interface set consistent and closed.**

---

## 6. Milestone Authority Model (M0..M4, normalized to the MCF construction scope)

> Normalization: the MCF construction milestones are **M0..M4** (B01/B02/B03). These are the authoritative MCF
> milestones; they correspond to F02's program milestones (B01-M3 ≡ F02-M3 "MCF certified"). F02's M4..M6 are
> post-MCF (Wave 2/3) and out of this master's scope.

| MS | Entry Criteria | Exit Criteria | Required Evidence | Required Gates | Certification Status |
|:--:|----------------|---------------|-------------------|----------------|:--------------------:|
| **M0** | T04 enacted; REAL-M-07/REAL-C-05 available; scope=MCF | AD-0024-with-conditions live; Executor+IA named; SoD verified | DEL-M0-1..7 | G-AUTH | Authorized (conditional) |
| **M1** | M0 passed; genesis-seed design approved | Kernel complete; AC-1∧AC-2 PASS; seed verified; self-registered | DEL-M1-1..7; AP-1 | G-PREFLIGHT/DURABILITY/TRACE/QUALITY/DOC/SEC | Kernel certified |
| **M2** | M1 passed; IF-REG/IDN/SEC/STO published | Spine complete; AC-3∧AC-4∧AC-8 PASS | DEL-M2-1..6; AP-2 | + G-POLICY | Spine certified |
| **M3** | M2 passed; Stream C integration done | **AC-1..9 ∧ AC-INT PASS**; FC-9 slice; FC-6 replay; MCF durably tagged | DEL-M3-1..6; AP-3 | G-RELEASE | **MCF self-certified** |
| **M4** | M3 passed | REAL-C-05 distinct-actor attestation PASS; HO-1..7 satisfied | DEL-M4-1..5; IVE | G-INDEP | **MCF independently certified** |

*(Consolidated from B01 §5, B02 §6, B03 §3; no new milestone, criterion, or evidence introduced.)*

---

## 7. Governance & Assurance Authority Model

| Instrument | Role in MCF construction | Status for M0 |
|------------|--------------------------|:-------------:|
| **AUTH-010** (Traceability) | Every artifact registered + traced (FP-1); G-TRACE | **Satisfied** (framework in force) |
| **AUTH-012** (Decision authority) | Approval-Required Operations; decision log; change procedure; G-AUTH | **Satisfied** (in force) |
| **REAL-M-07** (Durability) | O-1/O-2/O-3; durable increments; G-DURABILITY/PREFLIGHT | **Pending** (FULLY SPECIFIED; execution not run — U33) |
| **REAL-C-05** (Independence) | Distinct-actor M4 validation; G-INDEP | **Pending** (PARTIAL; G1 designation required — C01) |
| **REAL-H-07** (Pre-construction gate) | Enroll⇒durability; operative on M-07+C-05+wiring | **Pending** (condition, not kernel-start blocker) |
| **T01–T04** (Transition→checklist) | Governance path to M0 (adversarially confirmed NO DESIGN BLOCKERS at T03) | **Pending enactment** (T04 session not run) |
| **Construction Gates** (B01 §6, derived) | G-AUTH/PREFLIGHT/DURABILITY/TRACE/QUALITY/DOC/SEC/POLICY/INDEP/RELEASE | **Satisfied** (specified; operative on M0) |

**Roll-up:** AUTH-010/012 + Construction Gates **Satisfied**; REAL-M-07/C-05/H-07 + T01–T04 enactment **Pending**;
**no Blocked item** (B05's C-0/AF-B04 is **resolved** by this document). All Pending items are governed
enactments, not design gaps (T03).

---

## 8. Critical Path Authority

**The single authoritative construction critical path:**

```
F-STO ─▶ F-IDN ─▶ F-SEC ─▶ F-REG ─▶ F-CFG ─▶ F-POL ─▶ F-GOV ─▶ F-EXE ─▶ vertical-slice (FC-9/AC-9) ─▶ independent validation (M4)
 └── Genesis Kernel (M1) ──┘        └────────── Operating Spine (M2) ──────────┘   └── MCF (M3) ──┘   └── certified (M4) ──┘
```

- **Parallelizable off the path:** WP-IDN∥WP-SEC (after STO); WP-CFG∥WP-EVT; Stream C (gov-integration) + Stream D (per-WP acceptance) concurrent.
- **Authoritative:** this is the one critical path across F02/B01/B03; all other work is off-path and must not block it. *(Consolidated; no change.)*

---

## 9. Construction Readiness Determination

| Readiness | Determination | Basis |
|-----------|:-------------:|-------|
| **Architecture Readiness** | **READY** | F01-F03 + B01-B03 coherent; 9 domains, closed interface set, acyclic dependencies, canon-aligned; no technology assumed |
| **Governance Readiness** | **PENDING ENACTMENT** | AUTH-010/012 + gates satisfied; REAL-M-07/C-05 + T04 session **not yet enacted** (lock + Article IX active) |
| **Construction Readiness** | **PENDING M0** | Fully specified + orchestrated (B01/B02/B03); construction begins only on M0 (AD-0024-with-conditions) |
| **Authorization Readiness** | **READY** | B05 package complete (AUTHORIZE-WITH-CONDITIONS); this B04 resolves C-0; remaining conditions are the governance enactments (C-1..C-6) |

---

## 10. Cross-Artifact Consistency Review

| Check | Result | Disposition |
|-------|:------:|-------------|
| Domain set (F01 "16" vs enumerated) | Reconciled | **F02-R1**: Knowledge/Ontology split → 16 total; MCF unaffected (K/O deferred) |
| MCF size (F02 "10 incl. F-OBS" vs F03 "9") | Reconciled | **F03-R3 authoritative**: F-OBS deferred → **MCF = 9**; adopted here (§2/§3) |
| Memory↔Knowledge dependency | Reconciled | **F02-R2**: Memory (Wave 2) ← consumed by Knowledge (Wave 3); acyclic; both out of MCF |
| Milestone numbering (F02 M1-M6 vs B01 M0-M4) | Reconciled | MCF milestones = **M0..M4** (§6); F02 M4-M6 are post-MCF |
| Acceptance criteria (F03 AC-1..9) vs B01/B02 | Consistent | Same AC set; AC-INT integration at M3 |
| Interface set (F01 IF-* vs MCF) | Consistent | 9 in-MCF interfaces + seed; Wave-2/3 IF-* deferred (§5) |
| Gates (B01 §6) vs evidence (B02) vs orchestration (B03) | Consistent | Gates derived from existing governance; evidence CE/VE/AE/IVE; orchestration composes them |
| Scope (F01/F03/B05) | Consistent | In/Out/Deferred/Reserved aligned (§2) |
| **B04 authority gap (B05 AF-B04 / C-0)** | **Resolved** | This document is the B04 authority; C-0 closed |

**Contradictions:** none remaining (the three prior divergences are normalized above with recorded supersession).
**Gaps:** none within MCF scope (FC-10/11/12 correctly deferred). **Ambiguities:** none (milestone numbering + MCF
size normalized). **Duplicate authority:** none (single producer per interface; single authoritative milestone
model). **The corpus is internally consistent under this master.**

---

## 11. Final Determination

> # **MCF MASTER PROGRAM COMPLETE**
>
> The single authoritative construction-authority document for the Minimum Constructible Foundation is complete.
> It consolidates the executive summary (§ 1); the normalized MCF scope authority (§ 2); the domain (§ 3), work
> package (§ 4), interface (§ 5), and milestone (§ 6) authority registers; the governance & assurance authority
> model (§ 7); the single critical path (§ 8); the construction-readiness determination (§ 9); and the
> cross-artifact consistency review (§ 10).
>
> All prior divergences are **normalized** with recorded supersession — **F02-R1** (K/O split), **F03-R3**
> (F-OBS deferred → **MCF = 9 domains**), and milestone numbering (**M0..M4**) — and **no contradiction, gap,
> ambiguity, or duplicate authority remains** within MCF scope. The interface set is **closed** (9 + seed; no
> orphan/duplicate/unresolved). This document **resolves B05's AF-B04 / condition C-0**.
>
> **Readiness:** Architecture **READY**; Authorization **READY**; Governance **PENDING ENACTMENT**; Construction
> **PENDING M0** — the remaining items are the reserved governance enactments (T04 session + REAL-M-07 durability
> + REAL-C-05 designation → AD-0024-with-conditions), not design or specification gaps (per T03).
>
> This document introduced **no** new requirement, governance, architecture, milestone, work package, acceptance
> criterion, or evidence requirement — consolidation and validation only. No authorization, execution,
> construction, or `git` mutation was performed. `UCOS-CONSTRUCTION-BLOCKED` and the Article IX generation lock
> remain **ACTIVE**.
>
> ### Next required phase
> Enact the governance conditions (T04 Board session + REAL-M-07 + REAL-C-05) and bring `B05` to the Board for
> the **M0** decision (AUTHORIZE-WITH-CONDITIONS → MCF Genesis Kernel, wave-gated), then construct per this master
> to M1→M2→M3→M4.

---

## Governance / Non-Construction Statement

No new requirement, governance, architecture, milestone, work package, acceptance criterion, or evidence
requirement introduced; no authorization, activation, designation, execution, construction, or `git` mutation
performed; no lock released; no invariant enrolled; no technology selected; no canon modified. This is a
consolidation & validation **master authority** only; the sole repository effect is this additive architecture
`*.md`, permitted by the S0′ tolerance rule and outside the `RM2-CONTENT-ANCHOR` protected set. M0 and all
construction remain Approval-Required Operations (AUTH-012 §8 / AD-0009). INV-1..13, `AUTH-012` (v1.0.13),
AD-0014, AUTH-004/005/006 (FROZEN canon), the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are
unchanged.

## Traceability
- **Consumes (authoritative):** `F01`, `F02`, `F03`, `B01`, `B02`, `B03`.
- **Consolidates:** scope, domains, work packages, interfaces, milestones, governance/assurance, critical path, readiness — into one authority.
- **Normalizes (recorded supersession):** F02-R1 (K/O split), F03-R3 (MCF=9, F-OBS deferred), milestone numbering (M0..M4).
- **Resolves:** `B05` AF-B04 / condition C-0 (B04 authority now exists).
- **Feeds:** the `B05` M0 authorization package → Board M0 decision → construction to M1..M4.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014; construction gated by `UCOS-CONSTRUCTION-BLOCKED`.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); Executor + Independent Adjudicator to be designated.

**END B04-UCOS-MCF-CONSTRUCTION-MASTER-PROGRAM — PHASE B04 · EXEC SUMMARY · SCOPE AUTHORITY (NORMALIZED) · DOMAIN
(9) / WORK-PACKAGE (9) / INTERFACE (9+SEED, CLOSED) / MILESTONE (M0..M4) AUTHORITY REGISTERS · GOVERNANCE &
ASSURANCE MODEL (AUTH-010/012 + GATES SATISFIED · M-07/C-05/H-07 + T04 PENDING · NO BLOCKED) · SINGLE CRITICAL
PATH · READINESS (ARCH READY · AUTH READY · GOV PENDING-ENACTMENT · CONSTRUCTION PENDING-M0) · CONSISTENCY: NO
CONTRADICTION/GAP/DUPLICATE (RECONCILED F02-R1/F03-R3/MILESTONES) · RESOLVES B05 AF-B04/C-0 · **MCF MASTER
PROGRAM COMPLETE** · CONSOLIDATION ONLY · NO NEW REQUIREMENTS / NO GOVERNANCE INVENTION / NO CODE / NO TECH / NO
MUTATION · CONSTRUCTION LOCK + ARTICLE IX REMAIN ACTIVE.**
