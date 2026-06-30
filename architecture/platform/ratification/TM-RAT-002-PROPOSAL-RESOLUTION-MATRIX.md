# TM-RAT-002 — Proposal Resolution Matrix

**Artifact ID:** TM-RAT-002
**Layer:** RATIFICATION (Phase 9.1 — Governance Consolidation)
**Phase:** Phase 9.1 — Governance Consolidation & Ratification (read-only; plan only)
**Date:** 2026-06-30
**Parent:** `RAT-001`
**Mode:** Read-only. Proposals are reviewed, not applied.

> **Purpose.** Inventory every state/registry proposal (and the one direct state/registry application),
> determine the target, action, and conflicts, and prescribe a deterministic application order for the
> governance consolidator. Targets: `STATE-001` (`PROJECT-STATE.md`) and `CTX-REG-001`
> (`UCOS-ARTIFACT-REGISTRY.md`).

## A. State/registry effect inventory

| # | Source | Effect type | Target(s) | Status |
|---|--------|-------------|-----------|--------|
| 0 | Event 9.0C.1D (`ad7d4ba`) | **Direct application** (not a proposal) | `STATE-001`, `CTX-REG-001` | ALREADY APPLIED on config line (PEA-003 v1.0.0 rows/state) |
| 1 | `PHASE-9.0C.2-STATE-PROPOSAL` | Proposal | `STATE-001` | Pending — PEA-004 rows |
| 2 | `PHASE-9.0C.2-REGISTRY-PROPOSAL` | Proposal | `CTX-REG-001` | Pending — PEA-004 rows |
| 3 | `PHASE-9.0C.3-STATE-PROPOSAL` | Proposal | `STATE-001` | Pending — PEA-005 rows |
| 4 | `PHASE-9.0C.3-REGISTRY-PROPOSAL` | Proposal | `CTX-REG-001` | Pending — PEA-005 rows |
| 5 | `PHASE-9.0C.4-STATE-PROPOSAL` | Proposal | `STATE-001` | Pending — PEA-006 rows |
| 6 | `PHASE-9.0C.4-REGISTRY-PROPOSAL` | Proposal | `CTX-REG-001` | Pending — PEA-006 rows |
| 7 | `PHASE-9.0C-FINAL-STATE-PROPOSAL` | Proposal | `STATE-001` | Pending — certification rows |
| 8 | `PHASE-9.0C-FINAL-REGISTRY-PROPOSAL` | Proposal | `CTX-REG-001` | Pending — certification rows |

## B. Conflict analysis (pairwise)

| Pair | Overlapping target rows | Conflict? |
|------|--------------------------|:---------:|
| Event direct (#0) vs proposals #1–8 | #0 edits PEA-003 rows/state; #1–8 add PEA-004/005/006/cert rows | ✅ none (disjoint identifiers) |
| #1/#2 (PEA-004) vs #3/#4 (PEA-005) vs #5/#6 (PEA-006) | distinct artifact rows | ✅ none |
| #7/#8 (certification) vs #1–6 | cert rows reference, do not overwrite, artifact rows | ✅ none |
| All registry proposals — precedence note | each appends `UCOS-PEA-00n` as a peer | ✅ additive, consistent |

> **Result:** **0 hard proposal conflicts.** All effects are **additive and disjoint** by identifier
> (`PEA-003` rows from #0; `PEA-004`/`005`/`006` + certification rows from the proposals). No proposal
> overwrites another's rows.

## C. Process inconsistency (must be reconciled, not a data conflict)

| Finding | Detail | Resolution |
|---------|--------|------------|
| **Mixed application model** | Event 9.0C.1D (`ad7d4ba`) applied `STATE-001`/`CTX-REG-001` **directly**, breaking the proposal-based isolation that Registry/Config/Metadata/FINAL followed | Consolidator records #0 as a retroactively-accepted direct application; applies #1–8 on top of the Event-modified state/registry (additive, conflict-free). Going forward, all state/registry effects SHOULD be proposal-mediated |

## D. Prescribed application order (deterministic; for the consolidator at merge time)

1. Adopt config-line `STATE-001`/`CTX-REG-001` (already carry Event 9.0C.1D, #0) as the base.
2. Apply #1 → #2 (PEA-004), then #3 → #4 (PEA-005), then #5 → #6 (PEA-006) — artifact rows.
3. Apply #7 → #8 (certification rows: `UCOS-PEA-9.0C-CERT-001`, `TM-CERT-001/002/003`).
4. Apply Phase 9.1 ratification rows (`RAT-001`, `TM-RAT-001/002`) — see `PHASE-9.1-RATIFICATION-REPORT`.
5. Flip status of `UCOS-PEA-003/004/005/006` from CREATED — IN PROGRESS → **RATIFIED** only after steps 1–4
   and Authority Board sign-off.

## Verdict

**TM-RAT-002: proposals RESOLVABLE — 0 hard conflicts; 1 process inconsistency (mixed application model)
flagged for reconciliation.** A deterministic, additive application order exists.
