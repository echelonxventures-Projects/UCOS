# UCOS — Program Increment Plan

| Field | Value |
|-------|-------|
| Artifact | **UCOS-PROGRAM-INCREMENT-PLAN** |
| Artifact ID | `UCOS-IMP-PI-001` |
| Version | 1.0.0 |
| Phase | **Phase 10.0 — Implementation Readiness** |
| Status | CREATED — IMPLEMENTATION PLANNING |
| Mode | **PLANNING ONLY** — increment plan; no code, no dates, no capacity commitment |
| Authority | Subordinate to UCOS Governance Baseline 1.0.0, Authority Layer, Constitution (Art. IX) |
| Generates | `TM-IMP-007` — Program Increment Matrix (§4) |
| Date | 2026-06-30 |

> Sequences the work packages (`UCOS-IMP-WPS-001`) into **Program Increments (PIs)** consistent with the
> roadmap (`UCOS-IMP-ROAD-001`) and the acyclic dependency graph (`UCOS-IMP-DEP-001`). PIs are
> dependency-ordered, gate-bound units of progress, not calendar periods. Each PI has objectives, included
> WPs, entry criteria, exit criteria, and the gate set that must PASS to close it.

---

## 1. Program Increment Overview

| PI | Theme | Roadmap stage | Track |
|:--:|-------|:-------------:|-------|
| **PI-0** | Enablement & Lock Release | S0 | Enablement |
| **PI-1** | Platform Foundation | S1 | Platform |
| **PI-2** | Integration, Trust & Control | S2 | Platform |
| **PI-3** | Operability, Delivery & Analytics | S3 | Platform |
| **PI-4** | Core Commerce | S4 | Business |
| **PI-5** | Experience & End-to-End Hardening | S5 | Experience |
| **PI-6** | Validation | S6 | Assurance |
| **PI-7** | Certification & Release | S7 | Assurance |

## 2. Increment Objectives & Scope

### PI-0 — Enablement & Lock Release
- **Objective:** complete & ratify the outstanding design pipeline and release the Article IX lock.
- **WPs:** `WP-ENB-01` (Experience/06), `WP-ENB-02` (Contracts/07), `WP-ENB-03` (Security/09),
  `WP-ENB-04` (Technology ADRs/08), `WP-ENB-05` (Phase 9.1 platform ratification).
- **Entry:** Governance Baseline 1.0.0 FROZEN (met).
- **Exit:** 06/07/09 RATIFIED; ADRs recorded & ratified; `PEA-001..007` ratified; lock release approved by
  Authority Board.

### PI-1 — Platform Foundation
- **Objective:** stand up the execution/persistence/networking substrate + registry/config/metadata.
- **WPs:** `WP-PLT-01..03`, `WP-PLT-06`, `WP-PLT-11`.
- **Entry:** PI-0 exit met (lock released).
- **Exit:** foundation services contract-conformant; QUAL/SEC/DOC PASS; traceability clean.

### PI-2 — Integration, Trust & Control
- **Objective:** eventing/gateway/workflow, identity/secrets/audit, and control-fabric enforcement.
- **WPs:** `WP-PLT-04/05/07`, `WP-PLT-08/09/10`, `WP-PLT-17`.
- **Entry:** PI-1 exit met.
- **Exit:** trust plane enforcing; control fabric (`PCE-*`) active platform-wide; gates PASS.

### PI-3 — Operability, Delivery & Analytics
- **Objective:** observability, resilience, delivery/CI-CD control plane, analytics — complete substrate.
- **WPs:** `WP-PLT-12/13`, `WP-PLT-14/15/16`.
- **Entry:** PI-2 exit met.
- **Exit:** platform substrate complete (all 17 platform WPs done); gates PASS.

### PI-4 — Core Commerce
- **Objective:** implement core commerce business services on the substrate.
- **WPs:** `WP-BIZ-01..08`.
- **Entry:** PI-1–PI-3 substrate dependencies met (registry/config/eventing/identity/audit/control).
- **Exit:** all 8 commerce services contract-conformant; gates PASS; end-to-end commerce slice demonstrable.

### PI-5 — Experience & End-to-End Hardening
- **Objective:** experience surfaces over commerce + platform; harden cross-cutting concerns.
- **WPs:** `WP-EXP-01`.
- **Entry:** PI-4 exit met.
- **Exit:** experience surfaces conformant; full vertical slices demonstrable; gates PASS.

### PI-6 — Validation
- **Objective:** independent verification of all implemented scope (Prompt 11).
- **WPs:** `WP-VNC-01`.
- **Entry:** PI-1–PI-5 exits met.
- **Exit:** validation verdicts PASS; zero blocking gaps.

### PI-7 — Certification & Release
- **Objective:** certify, finalize, release, tag (Prompt 12).
- **WPs:** `WP-VNC-02`.
- **Entry:** PI-6 PASS.
- **Exit:** certified; release approved; tag created per release governance.

## 3. Increment Invariants

1. A PI closes only when **every** included WP passes Quality/Security/Documentation gates + traceability.
2. PIs are strictly dependency-ordered; a later PI cannot start until its predecessor PI's exit is met
   (PI-4 may begin once its specific substrate dependencies from PI-1–PI-3 are satisfied).
3. Non-waivable S1/S3/S4 hold in every PI.
4. No PI introduces unsanctioned scope (Article IX).

## 4. TM-IMP-007 — Program Increment Matrix

| PI | WPs | Stage | Entry | Exit (gate) | Predecessor PI |
|:--:|-----|:-----:|-------|-------------|:--------------:|
| PI-0 | WP-ENB-01..05 | S0 | Baseline FROZEN | Lock released (06/07/08/09 + 9.1 ratified) | — |
| PI-1 | WP-PLT-01..03/06/11 | S1 | PI-0 exit | Foundation conformant; QUAL/SEC/DOC PASS | PI-0 |
| PI-2 | WP-PLT-04/05/07/08/09/10/17 | S2 | PI-1 exit | Trust+control enforcing; gates PASS | PI-1 |
| PI-3 | WP-PLT-12..16 | S3 | PI-2 exit | Substrate complete (17/17); gates PASS | PI-2 |
| PI-4 | WP-BIZ-01..08 | S4 | substrate deps met | Commerce conformant; gates PASS | PI-1..PI-3 |
| PI-5 | WP-EXP-01 | S5 | PI-4 exit | Experience conformant; gates PASS | PI-4 |
| PI-6 | WP-VNC-01 | S6 | PI-1..PI-5 exit | Validation PASS | PI-5 |
| PI-7 | WP-VNC-02 | S7 | PI-6 PASS | Certified & released | PI-6 |

> **TM-IMP-007 result:** 8 PIs covering all 33 WPs; PI-0 releases the Article IX lock and gates every later
> PI; substrate PIs (PI-1..PI-3) precede business/experience PIs (PI-4..PI-5); validation (PI-6) and
> certification (PI-7) terminal. Every PI has entry/exit + gate set. 0 PI cycles; 0 WP unassigned to a PI; 0
> PI authorizing code before PI-0 closes.

## 5. Validation

| Check | Target | Observed | Result |
|-------|:------:|:--------:|:------:|
| PIs defined with objectives/entry/exit | 8 | 8 | ✅ |
| All 33 WPs assigned to a PI | 33 | 33 | ✅ |
| Lock-release PI (PI-0) gates all later PIs | yes | yes | ✅ |
| PI ordering acyclic | yes | yes | ✅ |
| Calendar dates committed | 0 | 0 | ✅ |
| Code/technology introduced | NONE | NONE | ✅ |

## Traceability
- **Refines:** `UCOS-IMP-ROAD-001`, `UCOS-IMP-WPS-001`, `UCOS-IMP-DEP-001`, `UCOS-IMP-GOV-001`.
- **Refined by:** `UCOS-IMP-READY-001`.
- **Owner:** Implementation Program (subordinate to Authority Board).
