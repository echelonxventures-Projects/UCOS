# PHASE 9.1 — CONSOLIDATION PLAN

**Artifact ID:** PHASE-9.1-CONSOLIDATION-PLAN
**Status:** PLAN — NOT YET EXECUTED (read-only phase; DO NOT MERGE / DO NOT PUSH)
**Date:** 2026-06-30
**Parent:** `RAT-001`
**Supporting:** `TM-RAT-001` (convergence), `TM-RAT-002` (proposals)

> **Why a plan only.** Phase 9.1 is authorized to **produce** the consolidation plan and ratification
> package, **not** to merge or push. The steps below are the prescription for a subsequent
> merge-authorized consolidation step.

## 1. Target topology

- **Integrated base:** config line head `eb55feb` (`phase-9.0c.3-config`) — most complete: `PEA-003`
  v1.0.0, `PEA-004`, `PEA-005`, certification, Event/Config/FINAL reports & proposals.
- **Imports (disjoint, conflict-free per `TM-RAT-001.C`):**
  - from `46d41b5` (`phase-9.0c.4-metadata`): `PEA-006`, `UCOS-PEA-9.0C.4-COMP-001`,
    `PHASE-9.0C.4-STATE-PROPOSAL.md`, `PHASE-9.0C.4-REGISTRY-PROPOSAL.md`.
  - from `0e82c0e` (`phase-9.0c-governance-audit`): `GOV-AUD-001`, `TM-GOV-001/002/003`,
    `PHASE-9.0C-GOV-AUDIT-REPORT.md`.

## 2. Convergence sequence (prescription)

1. Create integration branch from `eb55feb` (e.g., `phase-9.1-consolidation`).
2. Integrate metadata imports: `git merge 46d41b5` (or cherry-pick `46d41b5`). Expected: **0 conflicts**
   (metadata branch adds only its 4 files; its stale `PEA-003` v0.5.0 is unmodified relative to base, so
   config-line `PEA-003` v1.0.0 prevails automatically).
3. Integrate GOV-audit imports: `git merge 0e82c0e` (or cherry-pick). Expected: **0 conflicts** (5 disjoint
   files).
4. Verify integrated tree contains all four architectures + all completion reports (9.0C.1A–1D, 9.0C.2,
   9.0C.3, 9.0C.4) + certification (`UCOS-PEA-9.0C-CERT-001`, `TM-CERT-001/002/003`) + GOV audit + all
   proposals.

## 3. Proposal application (per `TM-RAT-002.D`)

5. Base `STATE-001`/`CTX-REG-001` already carry Event 9.0C.1D (`ad7d4ba`, direct).
6. Apply `PHASE-9.0C.2` → `9.0C.3` → `9.0C.4` → `9.0C-FINAL` state & registry proposals (additive, disjoint
   by identifier).
7. Append Phase 9.1 ratification rows (`RAT-001`, `TM-RAT-001/002`) to `CTX-REG-001`.
8. Reconcile the **mixed application model**: record Event 9.0C.1D direct `STATE-001`/`CTX-REG-001` edits as
   retroactively accepted; mandate proposal-mediation for any future effects.

## 4. Ratification activation

9. Authority Board sign-off flips `UCOS-PEA-003/004/005/006` status CREATED — IN PROGRESS → **RATIFIED**
   (set version baselines; record ratification date) and marks `UCOS-PEA-9.0C-CERT-001` CONDITIONAL PASS →
   ratified.
10. Update `STATE-001` Current Phase to "Phase 9.1 — Consolidation & Ratification COMPLETE"; unlock the
    next authorized phase (9.0C.5 Control Fabric / technology-selection ADRs / Prompt 09 Security).

## 5. Rollback / safety

- The integration is performed on a fresh branch; `eb55feb`, `46d41b5`, `0e82c0e` remain intact as
  rollback points. No history rewrite of workstream branches. No force-push.
- If any unexpected conflict arises (none predicted), halt and escalate to the Authority Board; do not
  auto-resolve ownership/governance/boundary conflicts.

## 6. Pre/post-conditions

- **Pre:** all four artifacts integrity-verified (`TM-RAT-001.B`); 0 proposal conflicts (`TM-RAT-002.B`).
- **Post:** single integrated line carrying 4 architectures + 12 `TM-PEA` + 3 `TM-CERT` + GOV audit;
  `STATE-001`/`CTX-REG-001` fully consolidated; four artifacts RATIFIED.
