# WI-10 Validator Generator — Test Report

**Phase:** I.4 · PHASE 12 — WI-10
**Date:** 2026-07-03
**Suite:** `tools/contract-generator/test/*.test.ts` (Node 26 native TS, `node --test`)
**Result:** **65 / 65 pass** (44 pre-existing + 21 new WI-10 tests). 0 fail, 0 skipped.

---

## Execution

```
tools/contract-generator $ npm test
tests 65 | pass 65 | fail 0 | cancelled 0 | skipped 0 | todo 0 | duration ~340ms
```

## New Tests — `test/validator.test.ts` (21)

All schemas are SYNTHETIC / test-only (never written to `contracts/field-schemas/`).

### Builder correctness (4)
- derives validators with DTO-parity names + deterministic ordering (`["Address","ThingRecord"]`).
- `validatorsFromDtoDocument` mirrors the DTO document exactly (names, order, family names, deps).
- constraints propagate into the validator model (string/array constraints, resolved reference `typeName`).
- (parity) transitive dependency `Address` pulled into the closure.

### Fail-closed — builder (3)
- `null` on a missing family.
- `null` on a broken reference.
- `null` on a dependency cycle.

### Emitter correctness (7)
- emits the full artifact set (`_runtime.ts`, per-contract `models/requests/responses/errors/index`, aggregate `index.ts`).
- `validate<Name>` emitted per resolved model + transitive dependency.
- reference fields dispatch to sibling `validate<Ref>Into`.
- structural constraints emitted as `checkString/checkNumber/checkArray/checkEnum` calls + `additionalProperty` rejection.
- request/response validators alias model validators and `import type` the DTO types.
- error validator is fail-closed (`no-error-model`, `_value` unused).
- aggregate barrel re-exports the shared kernel + each contract.

### Determinism (1)
- byte-identical file map across repeated generations.

### Fail-closed — integration (4)
- empty registry → 0 validator artifacts (`validators BLOCKED`).
- broken reference → 0 validator artifacts.
- dependency cycle → 0 validator artifacts.
- incomplete payload family → 0 validator artifacts (`BLOCKED`).

### Regression (2)
- default empty registry keeps `validators`/`dtos` BLOCKED and emits no `validators/*` or `dto/*` (WI-09 parity).
- populated registry emits DTOs AND validators together (both SUFFICIENT).

### Runtime behavior (1, dynamic import)
The emitted validators are written to a temp ESM package, dynamically imported, and executed. Every
case asserts the precise issue `path` + `code`:

| Input | Expected | Result |
|-------|----------|--------|
| `{ key: "abc" }` | valid | ✅ |
| `{ key, count, tags, status, home }` (all valid) | valid | ✅ |
| `{ key, home: { street, zip: null } }` (nullable field) | valid | ✅ |
| `{}` | `$.key` / `required` | ✅ |
| `{ key: 5 }` | `$.key` / `type` | ✅ |
| `{ key: "" }` | `$.key` / `minLength` | ✅ |
| `{ key: "123456789" }` | `$.key` / `maxLength` | ✅ |
| `{ key, count: -1 }` | `$.count` / `minimum` | ✅ |
| `{ key, count: 1.5 }` | `$.count` / `type` (integer) | ✅ |
| `{ key, status: "nope" }` | `$.status` / `enum` | ✅ |
| `{ key, tags: [] }` | `$.tags` / `minItems` | ✅ |
| `{ key, tags: ["x","x"] }` | `$.tags[1]` / `uniqueItems` | ✅ |
| `{ key, extra: 1 }` | `$.extra` / `additionalProperty` | ✅ |
| `{ key, home: { street: 9 } }` | `$.home.street` / `type` (nested reference) | ✅ |
| `"nope"` | `$` / `type` | ✅ |

## Coverage Summary

| Concern | Covered |
|---------|---------|
| Builder correctness | ✅ names, ordering, parity, dependencies |
| Emitter correctness | ✅ artifact set, functions, checks, barrels, aliases |
| Reference resolution | ✅ build model + emitted dispatch + runtime nested check |
| Constraint propagation | ✅ model-level + emitted + runtime enforcement |
| Fail-closed behavior | ✅ builder (null) + integration (0 files) × 4 fault classes |
| Determinism | ✅ byte-identical file map |
| Regression protection | ✅ empty-registry parity + DTO/validator co-emission |
| Runtime enforcement | ✅ 15 executed cases, precise path+code |

## Isolated Typecheck of Emitted Output

The emitted `validators/*` + `dto/*` were compiled in isolation under the contracts-sdk compiler
settings (`strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `allowImportingTsExtensions`,
`erasableSyntaxOnly`, ESM) with TypeScript 5.9.3 → **EXIT 0, no diagnostics**.
