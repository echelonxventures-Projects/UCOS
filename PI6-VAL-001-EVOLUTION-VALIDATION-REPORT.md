# PI6-VAL-001 — Evolution Fabric Validation Report

| Field | Value |
|-------|-------|
| Artifact | PI6-VAL-001 — Evolution Fabric Validation Report |
| Phase | PHASE 14 (AD-0019 execution) |
| Status | **VALIDATED** — 134/134 tests pass, TypeScript clean, no prohibited-dir change |

## 1. Build & test reproduction

| Check | Command | Result |
|-------|---------|--------|
| TypeScript compile | `tsc --noEmit -p tsconfig.json` | clean (exit 0) |
| Full suite | `node --test "test/*.test.ts"` | tests **134** / pass **134** / fail **0** / skipped **0** / todo **0** |
| Baseline + federation preserved | federation + registry + metadata + configuration suites | 38 sampled + 90 total prior — all green (no regressions) |

## 2. Test inventory (evolution = 44 new)

| Suite | Tests | Focus |
|-------|:-----:|-------|
| `test/evolution.test.ts` | 9 | full lifecycle apply (metadata + config), impact analysis, state machine, lifecycle table, snapshot determinism, sequential applies + monotonic counter, audit hash-chain + tamper, cross-node reconciliation |
| `test/evolution-adversarial.test.ts` | 16 | all 16 threat vectors (see PI6-SEC-001) — all fail closed |
| `test/evolution-rollback.test.ts` | 5 | validator-fail rollback, throwing-op atomic revert, explicit rollback, rollback verification, terminal-state re-apply refusal |
| `test/evolution-governor.test.ts` | 9 | E10 self/allowlist/core-path, E11 depth/origin/in-flight, E12 rate-limit/halt |
| `test/evolution-federation.test.ts` | 5 | touch-detection, token-gated apply, silent-weakening auto-rollback, invalid/expired token block |
| **Total** | **44** | |

Combined with the preserved 90 baseline+federation tests → **134/134**.

## 3. Functional validation highlights

- **Atomicity (no partial commits):** a failing post-apply validator and a mid-apply throwing op both leave zero residue; `preStateHash == postStateHash` after revert.
- **Deterministic rollback:** explicit rollback of an active config evolution restores `configuration.resolve("cap.shout")` to its prior value; rollback verification compares re-observed state hash to the snapshot hash.
- **Governance path:** propose → reviewed → approved → certified → ratified → active, each transition guarded and audited.
- **Backward compatibility:** the ratified PI-2/PI-3 substrate, PI-4 control plane, and PI-5 federation fabric are untouched; all prior tests remain green.

## 4. Directory integrity

Prohibited dirs (`meta-core`, `registry-runtime`, `metadata-runtime`, `configuration-runtime`, `contracts`) retain mtimes 13:13–13:24 (PI-2/PI-3 era); all PI-6 files are 15:07–16:27. Only `src/control/evolution/*` (18 files), `test/evolution*.ts` (6 files), and the additive export in `src/control/index.ts` were written.

**PI6-VAL-001: VALIDATED.**
