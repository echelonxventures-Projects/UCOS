# PHASE 12 — WI-10 Validator Generator — Report

**Phase:** I.4 · PHASE 12 — WI-10
**Objective:** Implement the Validator Generator — transform governed Field Schema Registry
definitions into deterministic runtime validation artifacts.
**Date:** 2026-07-03
**Branch:** `phase-11-contracts-sdk`
**Tool:** `tools/contract-generator/` (Node ≥ 23.6, TypeScript 5.9.3)

---

## DETERMINATION

# ✅ GO

The Validator Generator is implemented, integrated, deterministic, registry-driven, fail-closed,
type-safe, and backward-compatible. It introduces no regressions, no architecture drift, no hardcoded
payload logic, and no governance modifications. All 65 tests pass; both packages typecheck; the
shipped empty registry keeps all prior output byte-identical.

---

## 1. Implementation Summary

| Workstream | Deliverable | Status |
|-----------|-------------|--------|
| WS1 Meta-model | `model/ValidatorModel.ts` | ✅ |
| WS2 Builder | `src/validator/validatorBuilder.ts` | ✅ |
| WS3 Emitter | `src/emit/validator.ts` | ✅ |
| WS4 Integration | `src/generate.ts` (additive validator branch) | ✅ |
| WS5 Fail-closed | verified (builder null + 0 artifacts) | ✅ |
| WS6 Testing | `test/validator.test.ts` (21 tests) | ✅ |
| WS7 Baseline protection | generator + SDK typecheck, 65/65 tests, platform-runtime untouched | ✅ |
| WS8 Documentation | this report + 3 companion docs | ✅ |

## 2. Architecture

Full detail: `WI10-VALIDATOR-ARCHITECTURE.md`. Key points:

- **Meta-model** (`ValidatorModel.ts`, types only): `ValidatorNode` union (primitive/enum/array/
  object/reference), `ValidatorModel`, `ValidatorDocument`, structural `ValidatorConstraintModel`.
- **Parity by construction:** the builder derives the `ValidatorDocument` from the canonical WI-09
  `DTODocument` (`validatorsFromDtoDocument`), so validators and DTOs share identical model sets,
  names, dependency order, and fail-closed behavior — and inherit the already-verified registry
  resolution, cycle protection, and dependency validation.
- **Emitter** (pure formatter): a shared zero-dependency kernel (`validators/_runtime.ts`) plus
  per-model `validate<Name>` / `validate<Name>Into` functions; structural recursion emitted inline;
  references dispatch to sibling validators.
- **Gating:** emission occurs only when Stage-3 `validators === "SUFFICIENT"` (identical condition
  to DTOs). The DTO block was extended, not altered.
- **Enforcement scope:** structural constraints only (type, nullability, required, enum,
  additionalProperties, length/bounds/count/pattern/uniqueness). `format` is advisory (not enforced).
  No business rule is encoded.

## 3. Generated Artifacts

```
validators/
  _runtime.ts            # shared validation kernel (types + structural primitives)
  <slug>/
    models.ts            # validate<Name>(value): ValidationResult per resolved model + dependency
    requests.ts          # Request validator aliases (import DTO types)
    responses.ts         # Response validator aliases (import DTO types)
    errors.ts            # fail-closed error validator (no error model authored)
    index.ts             # per-contract barrel
  index.ts               # aggregate barrel (re-exports kernel + every contract)
```

With the shipped empty registry: **0** artifacts emitted (inert by design). With a resolvable
registry (verified via synthetic, test-only schemas): 7 artifacts for one contract.

## 4. Tests

Full detail: `WI10-VALIDATOR-TEST-REPORT.md`. **65/65 pass** (44 pre-existing + 21 new). Coverage
spans builder correctness, emitter correctness, reference resolution, constraint propagation,
fail-closed (builder + integration, 4 fault classes), determinism, regression, and **runtime
execution** (emitted validators dynamically imported and run against 15 cases with precise path+code
assertions).

## 5. Coverage

| Concern | Evidence |
|---------|----------|
| Builder correctness | parity names/order/deps; constraint propagation |
| Emitter correctness | artifact set; per-model functions; checks; barrels; aliases |
| Reference resolution | model `typeName` + emitted `validate<Ref>Into` + runtime nested check |
| Constraint propagation | model-level + emitted + runtime enforcement |
| Fail-closed | builder returns `null`; integration emits 0 files (missing/broken/cycle/incomplete) |
| Determinism | byte-identical file map across runs |
| Regression | empty-registry parity; DTO/validator co-emission |
| Runtime enforcement | 15 executed cases, exact issue path + code |

## 6. Determinism Evidence

- Test: "validator generation is deterministic (byte-identical file map across runs)" — PASS.
- Construction: models pre-sorted by name; object fields in authored order; temp variables named by
  a per-function counter in traversal order; constraint literals fixed-order; no timestamps /
  environment / randomness.
- `node src/cli.ts --check` reports no drift vs. the committed baseline.

## 7. Fail-Closed Evidence

| Fault | Builder | Validator artifacts |
|-------|---------|---------------------|
| Missing schema / family | `null` | 0 |
| Broken reference | `null` | 0 |
| Dependency cycle | `null` | 0 |
| Incomplete payload family | (Stage-3 BLOCKED) | 0 |
| Empty registry (shipped) | not invoked | 0 |

No partial or speculative validators are ever emitted. All four fault classes covered by tests.

## 8. Regression Evidence

Full detail: `WI10-REGRESSION-REPORT.md`.

- Generator typecheck **EXIT 0**; contracts-sdk typecheck **EXIT 0**.
- Pre-existing 44 tests **PASS** (within 65/65).
- `--check` **PASS**, 0 drift (19 artifacts, empty-registry path).
- `packages/platform-runtime/` **untouched** (git status clean).
- WI-09 output preserved: validators derive from the unchanged DTO document; DTO block extended, not
  altered.

## 9. Success Criteria

| Criterion | Status |
|-----------|--------|
| Validator Generator implemented | ✅ |
| Deterministic | ✅ (byte-identical; `--check` no drift) |
| Registry-driven | ✅ (derived from registry-resolved DTO closure) |
| Fail-closed | ✅ (4 fault classes → 0 artifacts) |
| Fully integrated | ✅ (`generate.ts`, gated on `validators === SUFFICIENT`) |
| No regressions | ✅ (65/65, both typechecks, no drift) |
| No architecture drift | ✅ (mirrors WI-09; single new `validators/_runtime.ts`) |
| No hardcoded payload logic | ✅ (structural checks only; `format` advisory) |
| No governance modifications | ✅ (no governance/authority artifacts touched) |

## 10. Change Inventory

| File | Change |
|------|--------|
| `tools/contract-generator/model/ValidatorModel.ts` | new |
| `tools/contract-generator/src/validator/validatorBuilder.ts` | new |
| `tools/contract-generator/src/emit/validator.ts` | new |
| `tools/contract-generator/test/validator.test.ts` | new |
| `tools/contract-generator/src/generate.ts` | modified (additive validator branch) |

## 11. Housekeeping (non-blocking)

Consistent with the WI-09 report: the `tools/contract-generator/` tree remains **untracked in git**.
Committing the tool tree (including the new WI-10 files) is recommended as part of closure. This does
not affect the GO determination.

## 12. Notes for the Next Work Item

- Validators are emitted as one alias **per payload family** for request/response roles; binding a
  family to a specific operation body remains deferred (Prompt 08), matching the DTO layer.
- Error validators are fail-closed until an error model is authored/ratified (Prompt 09).
- When a governed field-schema set is authored (Prompt 05 / UCOS-PDATA-ARCH-001), Stage-3 lifts
  `dtos`/`validators` to SUFFICIENT and both layers activate with **no generator code change**.

---

## Constraints Honored

- ✅ Registry-driven · Deterministic · Fail-closed · Type-safe · Backward-compatible · Zero hardcoding
- ✅ No business payload authoring · No synthetic production data (synthetic schemas are test-only)
- ✅ No governance redesign · No architecture redesign · No requirements expansion
- ✅ Existing DTO behavior maintained; sufficiency engine reused as-is
