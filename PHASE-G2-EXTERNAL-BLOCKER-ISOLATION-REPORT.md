# PHASE-G2-EXTERNAL-BLOCKER-ISOLATION-REPORT (FINAL REPORT)

> **PHASE G.2 · External Blocker Isolation & Constitutional Lock Engine · CONSOLIDATED DETERMINATION**
> Consolidates WS1–WS8 into a single Program-Compiler-consumable determination.
> NO CODE THAT CLOSES REAL-C-05 · NO SYNTHETIC DESIGNATION / ATTESTATION / AUTHORITY / EVIDENCE · NO LOCK RELEASE.

| Field | Value |
|-------|-------|
| Artifact ID | `PHASE-G2-EXTERNAL-BLOCKER-ISOLATION-REPORT` |
| Phase | **G.2** · Version 1.0.0 · Date 2026-07-03 |
| Source of truth | `registry/program/*.json` (Constitutional Program Compiler) — **remains authoritative** |
| Compiler verdict (entry and exit) | **NO_GO** (unchanged) |
| Registry fingerprint | `a581025a35912a76` (stable across loads; determinism PASS) |
| Absolute rule honored | REAL-C-05 is recorded exactly as PHASE G.1 left it — **PARTIAL**. Not closed, not re-opened. |

---

## 0. Determination (top-line)

> # **REAL-C-05 = EXTERNAL_BLOCKED / EXTERNAL_LOCKED — not software-solvable.**
>
> The Program Compiler now distinguishes **EXTERNAL_BLOCKED** from **INTERNAL_BLOCKED**, isolates
> REAL-C-05 (and REAL-C-03, REAL-C-04) as external blockers that **cannot be solved by software**,
> maps each to a constitutional lock, prohibits re-investigation without new evidence, and
> recomputes the executable frontier. The Program Compiler is the **source of truth** for which
> blockers are solvable and which are external.

Programmatic closure of REAL-C-05 is **IMPOSSIBLE**; external governance action is required. This
determination is stable and machine-consumable.

## 1. What was built this phase

### Registry (single source of truth — new inputs)
- `registry/program/external-blockers.json` (`PROG-EXT-BLOCKER-001`) — WS1 external blocker model.
- `registry/program/constitutional-locks.json` (`PROG-LOCK-001`) — WS2/WS7 lock registry.
- `registry/program/state.json` — migrated: `statusVocabulary` += `EXTERNAL_BLOCKED`; added
  `lockStateVocabulary` and `externalBlockerModel` pointer (append/migration-only, INV-10).

### Engine (`tools/program-compiler/src/`)
- `external-blockers.ts` — WS1/WS3/WS5: `evaluateReviewTrigger`, `computeExternalBlockers`, `applyExternalBlockers`.
- `constitutional-lock-engine.ts` — WS2/WS7: `computeLocks` (OPEN/LOCKED/EXTERNAL_LOCKED/RELEASED).
- `types.ts` — `EXTERNAL_BLOCKED` status, `LockState`, `ExternalBlocker`, `ConstitutionalLock`,
  `ReviewTrigger`, `Computed*` types, `ProgramHealth.externalBlocked`, `ProgramState.externalBlockers`/`constitutionalLocks`/`externalBlockedItems`.
- `registry.ts` — loads + fail-closed validates both new files (referential integrity + `solvableBySoftware=false`).
- `compiler.ts` — applies the external-blocker overlay **before** ready/next resolution; computes locks; adds an EXTERNAL_BLOCKED warning.
- `cli.ts` — EXTERNAL BLOCKERS + Constitutional Locks sections; EXTERNAL_BLOCKED count; new subcommands `external-blockers` / `blockers` / `locks`.
- `minimal-context.ts`, `dashboard.ts`, `outputs.ts` — surface external blockers, locks, and DO_NOT_REINVESTIGATE.
- Root `package.json` — `ucos:external-blockers`, `ucos:locks` scripts.

## 2. Workstream results

| WS | Deliverable | Result |
|----|-------------|--------|
| WS1 External Blocker Model | `external-blockers.json` with id/reason/required_actor/required_action/required_evidence/last_review_date/review_trigger | **DONE** — 3 blockers registered |
| WS2 Constitutional Lock Engine | Lock registry + engine, states OPEN/LOCKED/EXTERNAL_LOCKED/RELEASED, release only on GO | **DONE** |
| WS3 Review Triggers | Evidence-trigger model; re-open only on new evidence/designation/attestation/authority | **DONE** — deterministic, self-updating |
| WS4 Program Compiler Integration | Statuses READY/BLOCKED/EXTERNAL_BLOCKED/IN_PROGRESS/COMPLETE; EXTERNAL BLOCKERS section | **DONE** |
| WS5 Token Protection | `DO_NOT_REINVESTIGATE` recommendation when EXTERNAL_BLOCKED + no trigger | **DONE** — all 3 blockers |
| WS6 Minimal Context Integration | External Blockers section in `MINIMAL_CONTEXT.md` | **DONE** |
| WS7 Governance Lock Mapping | REAL-C-03/04/05 → locks with release conditions/evidence/actor/authority | **DONE** — all EXTERNAL_LOCKED |
| WS8 Next Action Recomputation | Recompute next/highest-leverage/governance/engineering state | **DONE** — see §3 |

## 3. Recomputed state (WS8)

| Dimension | Before G.2 | After G.2 |
|-----------|-----------|-----------|
| Status vocabulary | READY/BLOCKED/IN_PROGRESS/COMPLETE/OPEN | + **EXTERNAL_BLOCKED** |
| EXTERNAL_BLOCKED items | (concept absent) | **PI-8, PI-9, REAL-C-05** |
| Ready queue | PI-8, PI-9, PI-11, Prompt-05, ACT-11 | **PI-11, Prompt-05, ACT-11** |
| Next executable | PI-8 (illusory — awaited external attestation) | **PI-11 — Simulation Fabric** (highest-leverage internally-buildable) |
| Governance verdict | NO_GO | **NO_GO (unchanged)** |
| Constitutional locks | (concept absent) | REAL-C-03/04/05 all **EXTERNAL_LOCKED**, none software-releasable |
| Health counts | Complete 12 / Ready 5 / Blocked 9 | Complete 12 / Ready 3 / Blocked 9 / **External-Blocked 3** |

**Highest-leverage insight:** PI-8/PI-9 previously appeared "READY" only because they are declared
COMPLETE with unsatisfied ratification evidence. That evidence can be satisfied **only** by
independent attestation (REAL-C-05) — an external act. Isolating this reveals that the true next
*software* work item is **PI-11**, and that no amount of agent effort advances PI-8/PI-9/REAL-C-05.

**Engineering state:** internally executable now = `PI-11`, `Prompt-05`, `ACT-11`.
**Governance state:** three external locks; program release path gated on external governance
(Authority Board designation for REAL-C-05, AD-0024 for REAL-C-04, human ops + certification for REAL-C-03).

## 4. Validation

| Check | Result |
|-------|--------|
| TypeScript typecheck (`tsc --noEmit`) | **PASS** (exit 0) |
| Determinism (two fixed-timestamp compiles identical) | **PASS** |
| Registry fingerprint stable | **PASS** (`a581025a35912a76`) |
| Acyclic dependency graph | **PASS** |
| Fail-closed load validation (external blockers + locks referential integrity) | **PASS** |
| Next-item resolution after isolation | **PASS** (PI-11) |
| Review-trigger flips on new evidence (in-memory, no mutation) | **PASS** (DO_NOT_REINVESTIGATE → REVIEW_PERMITTED) |
| Governance verdict | **NO_GO** (unchanged, correct) |

## 5. Success criteria (Phase G.2)

A future agent, reading only `MINIMAL_CONTEXT.md` / `pnpm ucos:program-state`, now knows:

- ✅ **REAL-C-05 exists** — registered work item + closure + external blocker `EXT-REAL-C-05`.
- ✅ **REAL-C-05 is blocked** — computed status `EXTERNAL_BLOCKED`; lock `EXTERNAL_LOCKED`.
- ✅ **REAL-C-05 requires external action** — Authority Board designation + Independent Adjudicator attestation.
- ✅ **REAL-C-05 cannot be solved by software** — `solvableBySoftware=false`, `releasableBySoftware=false`.
- ✅ **REAL-C-05 should not be re-investigated without new evidence** — `DO_NOT_REINVESTIGATE`, review-trigger baseline recorded.
- ✅ **The Program Compiler is the source of truth** — all of the above is derived, not hand-authored.

## 6. Program-Compiler Consumable Result

```json
{
  "phase": "G.2",
  "capability": "external-blocker-isolation + constitutional-lock-engine",
  "statusVocabularyAdded": "EXTERNAL_BLOCKED",
  "lockStates": ["OPEN", "LOCKED", "EXTERNAL_LOCKED", "RELEASED"],
  "externalBlockers": {
    "EXT-REAL-C-05": { "target": "REAL-C-05", "solvableBySoftware": false, "recommendation": "DO_NOT_REINVESTIGATE" },
    "EXT-REAL-C-03": { "target": "REAL-C-03", "solvableBySoftware": false, "recommendation": "DO_NOT_REINVESTIGATE" },
    "EXT-REAL-C-04": { "target": "REAL-C-04", "solvableBySoftware": false, "recommendation": "DO_NOT_REINVESTIGATE" }
  },
  "constitutionalLocks": {
    "LOCK-REAL-C-05": "EXTERNAL_LOCKED",
    "LOCK-REAL-C-03": "EXTERNAL_LOCKED",
    "LOCK-REAL-C-04": "EXTERNAL_LOCKED"
  },
  "externalBlockedItems": ["PI-8", "PI-9", "REAL-C-05"],
  "recompute": { "nextExecutable": "PI-11", "readyQueue": ["PI-11", "Prompt-05", "ACT-11"] },
  "compilerVerdict": "NO_GO",
  "realC05": { "determination": "PARTIAL", "closableByProgram": false, "reInvestigate": false },
  "registryMutated": "additive-only (external-blockers.json, constitutional-locks.json, state.json vocabulary)",
  "syntheticEvidenceCreated": false,
  "fingerprint": "a581025a35912a76",
  "reports": [
    "EXTERNAL-BLOCKER-MODEL.md",
    "CONSTITUTIONAL-LOCK-ENGINE.md",
    "REDISCOVERY-PREVENTION-REPORT.md",
    "PHASE-G2-EXTERNAL-BLOCKER-ISOLATION-REPORT.md"
  ]
}
```

## 7. Governance / Non-Mutation Statement

This phase produced **no** fabric source code; designated **no** adjudicator; registered **no** key;
produced **no** attestation or signature; enacted **no** Board act; released **no** lock; enrolled
**no** invariant; awarded **no** certification; and created **no** synthetic evidence. REAL-C-05
remains **PARTIAL**. The only registry effects are additive/migration-only: two new source-of-truth
JSON files and a vocabulary extension in `state.json`, plus regenerated derived artifacts
(`MINIMAL_CONTEXT.md`, `UCOS-PROGRAM-DASHBOARD.md`, `next-work-item.json`, `dashboard.json`).
`INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED`
are unchanged. The compiler's **NO_GO** verdict stands and is correct.

## 8. Traceability
- **Consolidates:** `EXTERNAL-BLOCKER-MODEL.md`, `CONSTITUTIONAL-LOCK-ENGINE.md`, `REDISCOVERY-PREVENTION-REPORT.md`.
- **Consumes (read-only):** `PHASE-G1-REAL-C05-CLOSURE-REPORT.md`, `UCOS-REAL-C-05-ANALYSIS.md`, `registry/program/*.json`.
- **Subordinate to:** `AUTH-008` (S1/S3/S4), `AUTH-009` (SoD), `AUTH-012` (INV-10), `UCOS-CONST-001` (Art. IX/XI/XII), Governance Baseline 1.0.0 (FROZEN), `AD-0014`.
- **Refined by:** the prospective Authority-Board G1 designation (REAL-C-05), AD-0024 issuance (REAL-C-04), and governed operational execution (REAL-C-03) — each of which fires a review trigger and re-opens its item for evaluation.

**END PHASE-G2-EXTERNAL-BLOCKER-ISOLATION-REPORT — EXTERNAL_BLOCKED isolated · REAL-C-05 EXTERNAL_LOCKED / PARTIAL / NOT software-solvable / DO_NOT_REINVESTIGATE · next executable recomputed to PI-11 · compiler NO_GO unchanged · NO synthetic evidence · Program Compiler is the source of truth.**
