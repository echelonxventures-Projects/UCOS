# WI-10 Validator Generator — Architecture

**Phase:** I.4 · PHASE 12 — WI-10
**Date:** 2026-07-03
**Tool:** `tools/contract-generator/`
**Status:** Implemented, integrated, verified.

---

## 1. Purpose

The Validator Generator transforms governed **Field Schema Registry** definitions into deterministic
**runtime validation artifacts** — dependency-free TypeScript functions that check an `unknown`
value against a resolved payload schema and return a structured result. It is the runtime counterpart
of the WI-09 DTO Generator: DTOs give compile-time types, validators give run-time structural checks.

Like every prior work item, it is **registry-driven, deterministic, fail-closed, type-safe,
backward-compatible, and encodes zero business logic**. With the shipped empty field-schema registry
it emits nothing, so WI-07/08/09 output regenerates byte-identically.

## 2. Component Map

| Layer | Artifact | Responsibility |
|-------|----------|----------------|
| Meta-model | `model/ValidatorModel.ts` | Type definitions only. `ValidatorNode` union, `ValidatorModel`, `ValidatorDocument`, `ValidatorConstraintModel`. |
| Builder | `src/validator/validatorBuilder.ts` | Pure projection of the resolved DTO closure → `ValidatorDocument`. Fail-closed. |
| Emitter | `src/emit/validator.ts` | Pure formatter: `ValidatorDocument` → deterministic TypeScript. Shared runtime kernel + per-model functions. |
| Integration | `src/generate.ts` | Gates on Stage-3 `validators === "SUFFICIENT"`; reuses the resolved DTO document. |
| Gating | `src/validate/stage3-generator-input.ts` (WI-08, unchanged) | Computes the `validators` verdict (registry-driven sufficiency). |

## 3. Design Decision — Parity by Construction

Validators and DTOs MUST agree on the model set, names, dependency order, and fail-closed behavior;
if they diverged, a value could type-check as a DTO but fail its validator (or vice-versa). To make
divergence structurally impossible, the validator builder **derives the `ValidatorDocument` from the
canonical `DTODocument`** produced by `src/dto/dtoBuilder.ts`:

```
FieldSchemaRegistry ──▶ buildContractDTOs ──▶ DTODocument ──▶ validatorsFromDtoDocument ──▶ ValidatorDocument
                        (WI-09, verified)                     (WI-10, pure projection)
```

`buildContractDTOs` already performs, against the registry: payload-family resolution, transitive
dependency resolution, cycle protection, and fail-closed gating (returns `null` on any missing
reference / cycle / incomplete family). Reusing it means the validator layer **inherits all of those
guarantees for free** and can never drift from the DTO layer. The projection
(`validatorsFromDtoDocument`) is a pure, total structural map (DTO type node → validator node),
introducing no new resolution and no invention.

This satisfies WS2's requirements (deterministic output, fail closed, reference resolution, cycle
protection, dependency validation) transitively through the already-verified WI-09 engine.

## 4. Generated Output Layout

```
packages/contracts-sdk/generated/
  validators/
    _runtime.ts              # shared validation kernel (types + structural primitives)
    <slug>/
      models.ts              # validate<Name>(value): ValidationResult per resolved model + dependency
      requests.ts            # Request validator aliases (one per declared payload family)
      responses.ts           # Response validator aliases (one per declared payload family)
      errors.ts              # fail-closed error validator (no error model authored)
      index.ts               # per-contract validator barrel
    index.ts                 # aggregate barrel (re-exports _runtime + every contract)
```

The per-slug structure mirrors the DTO layer (`dto/<slug>/…`) and is the natural multi-contract form
of the WS3 file list (`models/requests/responses/errors/index`). The shared `validators/_runtime.ts`
is a single file (distinct from the top-level `_runtime/` directory used by clients), so no existing
generated runtime is touched.

## 5. The Runtime Kernel (`validators/_runtime.ts`)

Zero-dependency, deterministic primitives shared by all generated validators:

- **Types:** `ValidationIssue { path, code, message }`, `ValidationResult { valid, issues }`,
  `Validator<T>` (phantom `T` ties a validator to its DTO type), `Ctx` (mutable issue accumulator).
- **Accumulator:** `ctx()`, `add(c, path, code, message)`, `done(c)`.
- **Type guards / checks:** `isRecord`, `checkString` (minLength/maxLength/pattern), `checkNumber`
  (integer/minimum/maximum), `checkBoolean`, `checkEnum`, `checkArray` (minItems/maxItems/uniqueItems,
  returns the array for item iteration or `null` on type error).

Structural recursion (objects, arrays, references) is emitted **inline** by the model renderer so the
kernel stays flat and the generated code is explicit and auditable.

## 6. Per-Model Emission

Each `ValidatorModel` renders two functions in `models.ts`:

- `export function validate<Name>(value: unknown): ValidationResult` — public entry.
- `function validate<Name>Into(c: Ctx, p: string, value: unknown): void` — internal walker.
  Reference nodes dispatch to a sibling `validate<Ref>Into` (all models share the file; declarations
  hoist, so ordering is irrelevant for correctness and is fixed by name for determinism).

Emission rules per node kind:

| Kind | Emitted check |
|------|---------------|
| primitive `string` | `checkString(c, path, v, { minLength?, maxLength?, pattern? })` |
| primitive `integer`/`number` | `checkNumber(c, path, v, { integer?, minimum?, maximum? })` |
| primitive `boolean` | `checkBoolean(c, path, v)` |
| enum | `checkEnum(c, path, v, [values])` |
| array | `checkArray(...)` then indexed loop recursing into items at `path[i]` |
| object | `isRecord` guard, per-field required/optional handling, then `additionalProperties:false` ⇒ unknown-key rejection via a `Set` of known names |
| reference | `validate<TypeName>Into(c, path, v)` |

**Nullability** is handled at each descent: a nullable node is wrapped in `if (v !== null) { … }`;
a non-nullable node lets the type check reject `null`. **Optional** object fields are checked only
when present and not `undefined`; **required** fields emit a `required` issue when absent.

**Determinism:** models pre-sorted by name; object fields in authored order; temp variables named by
a per-function counter in traversal order (`t0`, `t1`, …); constraint object literals use a fixed key
order; no timestamps/environment/randomness.

## 7. Enforcement Scope (Zero Business Logic)

Validators enforce **structural** constraints only: type, nullability, required presence, enum
membership, `additionalProperties`, `minLength`/`maxLength`/`pattern`, `minimum`/`maximum`,
`minItems`/`maxItems`/`uniqueItems`. Each is a pure structural predicate carrying no business meaning.

`format` (e.g. `"uuid"`, `"date-time"`) is **advisory and NOT enforced**: its meaning is owned by the
data architecture (UCOS-PDATA-ARCH-001); enforcing it here would invent semantics. This mirrors the
DTO layer's advisory treatment of `format`.

## 8. Fail-Closed Behavior

Emission is doubly gated, exactly as the DTO layer:

1. **Stage 3** must rate `validators === "SUFFICIENT"` (holds iff every declared payload family
   resolves completely, which is the same condition as `dtos`). Otherwise the generator skips
   validator emission for that contract.
2. Even when reached, `buildContractValidators` (via `buildContractDTOs`) returns `null` on any
   missing schema, broken reference, dependency cycle, or incomplete family — and `generate.ts` emits
   nothing for that contract.

No partial or speculative validators are ever emitted. See `WI10-REGRESSION-REPORT.md` for evidence.

## 9. Integration (`generate.ts`)

Validator generation is co-located with the DTO block. After a contract's `DTODocument` is built
(non-null, DTOs SUFFICIENT), and if `validators === "SUFFICIENT"`, the same document is projected via
`validatorsFromDtoDocument` and emitted. The shared kernel (`validators/_runtime.ts`) and aggregate
barrel (`validators/index.ts`) are emitted once when at least one validator-SUFFICIENT contract
exists. Existing DTO behavior is unchanged (the DTO block was extended, not altered).

## 10. Constraints Honored

- Registry-driven · Deterministic · Fail-closed · Type-safe · Backward-compatible · Zero hardcoding.
- No business payload authoring · No synthetic production data · No governance redesign · No
  architecture redesign. Synthetic schemas exist only in tests; the on-disk registry stays empty.
