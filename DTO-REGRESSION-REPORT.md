# WI-09 DTO Generator — Regression Report (Workstream 5)

**Mode:** Verification of backward compatibility and cross-package integrity.
**Date:** 2026-07-03
**Verdict:** **No regression.** WI-07 output unchanged under the empty registry; contracts-sdk typechecks; platform-runtime untouched; all tests pass.

---

## 1. WI-07 output unchanged with the empty (shipped) registry

- `node src/cli.ts --check` → `validation PASS — 19 artifacts would be generated`, **EXIT 0**. No drift vs. the committed `packages/contracts-sdk/generated/` tree.
- Per-contract Stage-3 verdicts (both `UCOS-API-CONTRACT-018` and `-027`): `dtos: BLOCKED`, `validators: BLOCKED`, `clients: PARTIAL`, `serverStubs: PARTIAL`.
- Empty-registry run emits **0** `dto/*` files (verified programmatically).
- Empty-registry run is deterministic across repeated runs (`true`).
- Regression-anchor test present and passing: `generate() with the default (empty) registry keeps DTOs BLOCKED (regression anchor)`.
- The committed `packages/contracts-sdk/generated/` tree contains **no `dto/` directory** — consistent with the empty-registry design.

## 2. contracts-sdk typecheck

```
packages/contracts-sdk $ npm run typecheck   (tsc --noEmit -p tsconfig.json)
EXIT: 0
```
`tsconfig.json` includes `src/**/*.ts` and `generated/**/*.ts` under `strict` + `noUncheckedIndexedAccess` + `verbatimModuleSyntax` + `allowImportingTsExtensions`. Clean.

Additionally, the WI-09 **emitted DTO output** (synthetic) was typechecked in isolation under the same TypeScript 5.9.3 settings → **EXIT 0** (see DTO-GENERATION-EVIDENCE.md).

## 3. platform-runtime untouched

- WI-09 changes are confined to `tools/contract-generator/` (model/builder/emitter/integration/gating) plus generator output under `packages/contracts-sdk/generated/`.
- No source file under `packages/platform-runtime/` is referenced, imported, or modified by the DTO generator.
- `git status` shows no modifications under `packages/platform-runtime/`.

## 4. Generator tool test suite

```
tools/contract-generator $ npm test   (node --test "test/*.test.ts")
tests 44 | pass 44 | fail 0 | cancelled 0 | skipped 0 | todo 0
```

## 5. Generator tool typecheck

```
tools/contract-generator $ npm run typecheck   (tsc --noEmit)
EXIT: 0
```

---

## Observation (non-blocking)

The `tools/contract-generator/` directory (WI-06/07/08/09 tool code) is present and functional on disk but currently **untracked in git** on branch `phase-11-contracts-sdk`. This is a source-control housekeeping item, not a functional regression — the code compiles, runs, and passes all tests. Recommend committing the tool tree as part of WI-09 closure.

---

## WS5 Conclusion

WI-07 behavior is preserved byte-for-byte under the shipped empty registry; the SDK package typechecks; platform-runtime is untouched; all 44 tests pass. **No regression, no defect found.**
