# WI-09 DTO Generator — Coverage Report (Workstream 6)

**Mode:** Test inventory + execution results.
**Date:** 2026-07-03
**Verdict:** DTO **behavior is fully verified** (gating, builder, emitter, determinism, fail-closed). One **test-coverage observation**: the committed suite does not assert the emitted `dto/*` artifact *content* directly.

---

## Test Suite Execution

```
tools/contract-generator $ npm test
tests 44 | pass 44 | fail 0 | skipped 0 | todo 0 | duration ~309ms
```

Files: `test/fieldSchema.test.ts`, `test/generate.test.ts`, `test/normalize.test.ts`, `test/validate.test.ts`, plus `test/fixtures.ts` (shared).

## DTO-Related Test Inventory

DTO generation depends on: (a) the field-schema registry, (b) transitive dependency resolution, (c) Stage-3 sufficiency gating, (d) `generate()` integration. Tests exercising this chain:

| Test | File | What it locks | DTO relevance |
|------|------|---------------|---------------|
| Stage 3 stays BLOCKED/PARTIAL with EMPTY registry | fieldSchema | empty ⇒ `dtos BLOCKED` | Gating floor (no emission) |
| Stage 3 FLIPS to SUFFICIENT when all families resolve | fieldSchema | resolvable ⇒ `dtos SUFFICIENT` | Gating opens DTO emission |
| Stage 3 stays BLOCKED when only SOME families resolve | fieldSchema | partial ⇒ `BLOCKED` + diagnostic | Fail-closed gate |
| Stage 3 keeps DTOs BLOCKED on incomplete dependencies | fieldSchema | dep-incomplete ⇒ `BLOCKED` | Fail-closed gate |
| resolveDependencies resolves transitive graph | fieldSchema | closure correctness | Builder closure input |
| resolveDependencies flags dangling reference (FAIL) | fieldSchema | broken ref detection | Fail-closed input |
| resolveDependencies detects a cycle (FAIL) | fieldSchema | cycle detection | Fail-closed input |
| resolve() highest/exact version | fieldSchema | version resolution | Builder naming input |
| resolvePayloadFamily qualified + bare fallback | fieldSchema | family binding | Builder family lookup |
| generate() populated registry ⇒ SUFFICIENT + manifest | fieldSchema | end-to-end flip + manifest stamp | Integration (manifest) |
| generate() deterministic with populated registry | fieldSchema | byte-identical file map | Determinism (incl. DTO files) |
| generate() default empty registry keeps DTOs BLOCKED | fieldSchema | regression anchor | WI-07 parity |
| generation is deterministic (empty) | generate | byte-identical file map | Determinism |
| fail-closed: schema-invalid ⇒ FAIL + 0 files | generate | zero-emission on FAIL | Fail-closed |

**Count:** ~14 tests directly exercise the DTO gating / registry / determinism chain (subset of the 44).

## Coverage Assessment by Component

| Component | Covered behavior | Coverage |
|-----------|------------------|----------|
| Stage-3 DTO gating | BLOCKED / SUFFICIENT / partial / dep-incomplete | ✅ Direct unit tests |
| Field-schema registry + dependency resolution | version, family, transitive, dangling, cycle, duplicate | ✅ Direct unit tests |
| `generate()` DTO integration | SUFFICIENT flip, manifest stamp, determinism, empty-registry regression | ✅ Direct tests (manifest + file-map) |
| DTO Builder output shape (`DTODocument`) | model names, closure, reference resolution, family type names | ⚠️ Verified in this WS via harness; **not** asserted by committed tests |
| DTO Emitter output bytes (`dto/*.ts`) | interface/type rendering, nullability, enums, constraints, references, barrels | ⚠️ Verified in this WS via harness + isolated typecheck; **not** asserted by committed tests |

## Observation (test-coverage gap, not an implementation defect)

The committed suite proves the DTO path is *reachable* and *deterministic* (`generate()` with a populated registry stamps the manifest `dtos: "SUFFICIENT"` and produces a stable file map), but no committed test opens a `dto/api-999/models.ts` and asserts the rendered interface content. The correctness of the emitter output was verified **in this workstream** by:
- driving the full pipeline with a synthetic registry and inspecting the emitted files (see DTO-GENERATION-EVIDENCE.md), and
- compiling the emitted DTO output under strict TypeScript 5.9.3 → EXIT 0.

This is a **coverage hardening opportunity**, not a defect: the behavior is correct and proven. Per the WI-09 mandate ("only create code if a verified defect is discovered"), **no test code was added**. Recommended follow-up (WI-10 or a dedicated hardening task): add `test/dto.test.ts` asserting emitted `dto/*` content and an isolated typecheck of generated DTO output.

---

## WS6 Conclusion

All 44 tests pass. DTO gating, registry, dependency resolution, integration, and determinism are covered by committed tests; emitter/builder output correctness is verified by this workstream's harness. One non-blocking coverage-hardening opportunity noted. **No defect found.**
