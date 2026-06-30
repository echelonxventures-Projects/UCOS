# TM-CONV-001 — Proposal Execution Matrix

**Artifact ID:** TM-CONV-001
**Layer:** CONVERGENCE (Phase 9.2 — Controlled Architecture Convergence)
**Phase:** Phase 9.2 — Controlled Architecture Convergence (execution)
**Date:** 2026-06-30
**Branch:** `phase-9.2-convergence` (from `phase-9.0c.3-config` @ `eb55feb`)
**Authority:** `RAT-001`, `PHASE-9.1-CONSOLIDATION-PLAN`, `TM-RAT-002`
**Sources:** metadata `46d41b5`, governance-audit `0e82c0e`

> **Purpose.** Record the execution disposition of every state/registry proposal (and the one direct
> application) per the `TM-RAT-002.D` order. Effects are **additive and disjoint by identifier**; all
> approved proposals are applied to `STATE-001`/`CTX-REG-001` on this convergence branch.

## A. Proposal execution

| # | Identifier | Source Phase | Target | Status | Applied | Rejected | Deferred | Justification |
|---|-----------|--------------|--------|:------:|:-------:|:--------:|:--------:|---------------|
| 0 | Event 9.0C.1D direct edit (`ad7d4ba`) | 9.0C.1D | `STATE-001`, `CTX-REG-001` | RATIFIED | ✅ | — | — | Already applied on base; retroactively accepted; PEA-003 v1.0.0 rows |
| 1 | `PHASE-9.0C.2-STATE-PROPOSAL` | 9.0C.2 | `STATE-001` | APPLIED | ✅ | — | — | PEA-004 rows; additive, no conflict |
| 2 | `PHASE-9.0C.2-REGISTRY-PROPOSAL` | 9.0C.2 | `CTX-REG-001` | APPLIED | ✅ | — | — | PEA-004 registry rows |
| 3 | `PHASE-9.0C.3-STATE-PROPOSAL` | 9.0C.3 | `STATE-001` | APPLIED | ✅ | — | — | PEA-005 rows |
| 4 | `PHASE-9.0C.3-REGISTRY-PROPOSAL` | 9.0C.3 | `CTX-REG-001` | APPLIED | ✅ | — | — | PEA-005 registry rows |
| 5 | `PHASE-9.0C.4-STATE-PROPOSAL` | 9.0C.4 | `STATE-001` | APPLIED | ✅ | — | — | PEA-006 rows (imported from `46d41b5`) |
| 6 | `PHASE-9.0C.4-REGISTRY-PROPOSAL` | 9.0C.4 | `CTX-REG-001` | APPLIED | ✅ | — | — | PEA-006 registry rows |
| 7 | `PHASE-9.0C-FINAL-STATE-PROPOSAL` | 9.0C.FINAL | `STATE-001` | APPLIED | ✅ | — | — | Certification status rows |
| 8 | `PHASE-9.0C-FINAL-REGISTRY-PROPOSAL` | 9.0C.FINAL | `CTX-REG-001` | APPLIED | ✅ | — | — | `UCOS-PEA-9.0C-CERT-001` + `TM-CERT-001/002/003` rows |
| 9 | Phase 9.1 ratification rows (`RAT-001`, `TM-RAT-001/002`) | 9.1 | `CTX-REG-001` | APPLIED | ✅ | — | — | Ratification package registration |

> **Result:** **10/10 effects applied; 0 rejected; 0 deferred.** All effects additive and disjoint by
> identifier (`PEA-003` from #0; `PEA-004`/`005`/`006` + certification + ratification from #1–9). The
> mixed-application-model inconsistency (Event 9.0C.1D direct, #0) is **reconciled**: #0 recorded as
> retroactively accepted; #1–9 applied on top.

## B. Convergence provenance

| Field | Value |
|-------|-------|
| Baseline commit | `eb55feb` (config line: PEA-003 v1.0.0, PEA-004, PEA-005, certification) |
| Source commit (metadata) | `46d41b5` (PEA-006 + 9.0C.4 report + proposals) |
| Source commit (gov-audit) | `0e82c0e` (GOV-AUD-001 + TM-GOV-001/002/003 + report) |
| Merge base | `44af0a9` (Phase 9.0C.2 Registry) |
| Duplicate resolution | `PEA-003`: keep **v1.0.0** (config line); metadata-branch v0.5.0 superseded (not imported) |
| Target commit | recorded at Phase 9.2 commit (see `UCOS-PEA-9.2-CONVERGENCE-REPORT`) |

## Verdict

**TM-CONV-001: proposals EXECUTED — 10/10 applied, 0 rejected, 0 deferred, 0 conflicts.**
