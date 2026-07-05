# WI-09 DTO Generator — Implementation Audit (Workstream 1)

**Phase:** I.3A · PHASE 12 — WI-09
**Mode:** Formal verification (no re-implementation)
**Date:** 2026-07-03
**Tool root:** `tools/contract-generator/`
**Verdict:** All five required components **EXIST** and are wired.

---

## Audit Matrix

| # | Required Component | Expected Artifact | Status | Evidence |
|---|--------------------|-------------------|--------|----------|
| 1 | DTO Model (types only) | `model/DTOModel.ts` | ✅ PRESENT | 200-line canonical meta-model; type definitions only, no logic/IO |
| 2 | DTO Builder (pure lowering) | `src/dto/dtoBuilder.ts` | ✅ PRESENT | Pure total function registry → `DTODocument`; fail-closed `null` returns |
| 3 | DTO Emitter (pure formatter) | `src/emit/dto.ts` | ✅ PRESENT | Renders `DTODocument` → 5 per-contract files + aggregate barrel |
| 4 | Generator integration | `src/generate.ts` | ✅ WIRED | Imports builder+emitter; DTO block gated on Stage-3 `SUFFICIENT` |
| 5 | DTO readiness gating | `src/validate/stage3-generator-input.ts` | ✅ PRESENT | Registry-driven `dtos: SUFFICIENT \| BLOCKED` per contract |

---

## 1. DTOModel — `model/DTOModel.ts`

Type definitions only (verified: no imports of `node:fs`, no runtime values, no functions).

- Version tag: `DTOModelVersion = "ucos-dto/1.0.0"` (additive-only).
- Type kinds: `primitive · object · array · enum · reference` (`DTOTypeKind`).
- Node union `DTOTypeModel` with `DTOPrimitiveTypeModel`, `DTOEnumTypeModel`, `DTOArrayTypeModel`, `DTOObjectTypeModel`, `DTOReferenceModel`.
- `DTOConstraintModel` — transport-neutral advisory constraint set (mirror of `FieldConstraints`).
- `DTOModel` — named top-level unit of emission (`id`, `version`, `name`, `root`, `dependencies`, optional `payloadFamily`/`dataContract`/`title`/`description`).
- `DTODocument` — per-contract set (`contractShortId`, `payloadFamilyTypeNames`, deterministically ordered `models`).
- References carry build-time-resolved `typeName` so the emitter stays a pure formatter.

## 2. DTO Builder — `src/dto/dtoBuilder.ts`

Pure, total, deterministic. No I/O.

- `buildContractDTOs(shortId, families, registry): DTODocument | null` — the public entry.
- `familyBindingsOf(model): FamilyBinding[]` — derives declared families from the contract model.
- Deterministic naming: `allocateNames()` PascalCases the payload family (or last id segment), processes definitions in **sorted-id order**, appends the smallest numeric suffix on collision.
- `lowerNode()` recursively lowers every field-schema node kind; `lowerConstraints()` copies only defined members (undefined ⇒ omitted); `directRefs()` collects sorted/deduped dependency ids.
- Fail-closed: returns `null` when (a) no families declared, (b) a family fails to resolve, (c) dependencies incomplete, or (d) a closure member vanished.
- Models sorted by `name`; `payloadFamilyTypeNames` in declared order, deduplicated.

## 3. DTO Emitter — `src/emit/dto.ts`

Pure formatter (all naming/resolution already done in builder).

- `emitContractDtoFiles(view, doc)` → `dto/<slug>/{models,requests,responses,errors,index}.ts`.
- `emitDtoRootIndex(views)` → `dto/index.ts` aggregate barrel (slugs sorted).
- `renderType()` handles all five kinds incl. nullability parenthesization (`(A | null)[]`, `(x | y) | null`), enum literal rendering, inline nested objects, `additionalProperties` open-record handling.
- Advisory constraints rendered as `@constraint` JSDoc only — never alter the emitted TYPE.
- Object roots → `export interface`; all other roots → `export type`.
- Error DTO is fail-closed `never` (catalog declares no error model — G5).
- "GENERATED FILE — DO NOT EDIT" banner on every file; no timestamps/environment (determinism-safe).

## 4. Generator Integration — `src/generate.ts`

- Imports: `emitContractDtoFiles`, `emitDtoRootIndex`, `buildContractDTOs`, `familyBindingsOf`.
- DTO emission occurs only inside the `report.verdict === "PASS" && views.length > 0` block.
- Per contract: `if (view.targets.dtos !== "SUFFICIENT") continue;` then `buildContractDTOs(...)`; `if (doc === null) continue;` (gating contradiction ⇒ emit nothing for that contract).
- `dto/index.ts` emitted only when ≥1 DTO-SUFFICIENT contract exists.
- Final `files.sort()` by `relPath` for stable ordering.

## 5. DTO Readiness Gating — `src/validate/stage3-generator-input.ts`

- `resolveFamilies()` resolves every declared payload family against the `FieldSchemaRegistry` and checks transitive dependency completeness.
- `dtos: TargetVerdict = fieldSchemasResolvable ? "SUFFICIENT" : "BLOCKED"` where `fieldSchemasResolvable = hasFamilies && every family resolved`.
- Defaults to `EMPTY_FIELD_SCHEMA_REGISTRY` → preserves WI-07 `BLOCKED`/`PARTIAL` verdicts byte-identically.

---

## Audit Conclusion

Every WI-09 component required by the specification is present, wired, and internally consistent. The engine authors **no** business payload: with the shipped empty field-schema registry, no DTO is built and no `dto/*` artifact is emitted. **No missing implementation detected in WS1.**
