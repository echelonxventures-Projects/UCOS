# WI-09 DTO Generator — Determinism Report (Workstream 4)

**Mode:** Repeated-run byte comparison with a synthetic registry. **No business payloads.**
**Date:** 2026-07-03
**Verdict:** DTO generation is **deterministic — byte-identical across runs**, with stable ordering and naming.

---

## Method

`generate()` was executed **5 times** with an identical synthetic 2-schema registry (`ThingRecord` + transitive `Address`). The serialized file map (`JSON.stringify(files)`) of every run was compared to run #1.

```
DETERMINISM: 5 runs byte-identical = true
```

The existing suite corroborates this with two dedicated determinism tests:
- `generation is deterministic (identical file map across runs)` — empty registry (WI-07 path).
- `generate() is deterministic with a populated registry (identical file map across runs)` — DTO path.

Both PASS.

## Determinism Guarantees (by construction)

| Concern | Mechanism | Location |
|---------|-----------|----------|
| **Byte-identical output** | Pure functions; no timestamps, no environment, no randomness in emitted content | `emit/dto.ts` banner + renderers |
| **Stable model ordering** | `models` sorted by `name` (stable string compare) | `dtoBuilder.ts` step 3 |
| **Stable closure ordering** | Dependency closure iterated in `[...allIds].sort()` order | `dtoBuilder.ts` step 2 |
| **Stable naming** | Definitions processed in sorted-id order; deterministic PascalCase; smallest-suffix collision resolution | `allocateNames()` |
| **Stable field ordering** | Object fields preserve authored property order | `lowerNode()` object case |
| **Stable dependency lists** | `directRefs()` returns sorted, deduplicated ids | `dtoBuilder.ts` |
| **Stable constraint ordering** | Fixed member emission order in `constraintDocLines()` | `emit/dto.ts` |
| **Stable file ordering** | Final `files.sort()` by `relPath`; barrel slugs sorted | `generate.ts`, `emitDtoRootIndex()` |
| **Stable family type names** | `payloadFamilyTypeNames` in declared order, deduplicated | `dtoBuilder.ts` step 4 |

## Drift Check (on-disk baseline)

`node src/cli.ts --check` against the committed generated tree:

```
validation PASS — 19 artifacts would be generated (--check: nothing written).
EXIT: 0
```

No drift between the generator and the committed baseline.

---

## WS4 Conclusion

Output is byte-identical across repeated runs; ordering and naming are stable by construction. **No defect found.**
