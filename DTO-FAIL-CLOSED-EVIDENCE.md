# WI-09 DTO Generator — Fail-Closed Evidence (Workstream 3)

**Mode:** Adversarial verification with synthetic, malformed registries. **No business payloads.**
**Date:** 2026-07-03
**Verdict:** All four fail-closed conditions **BLOCK generation and emit zero DTO artifacts.**

---

## Principle

DTO emission is doubly gated:
1. **Stage 3** must rate the contract's `dtos` target `SUFFICIENT` (every declared family resolves completely), else the generator `continue`s past DTO emission.
2. Even when reached, `buildContractDTOs()` returns `null` on any resolution contradiction, and `generate.ts` `continue`s (emits nothing) on `null`.

## Case Matrix

| # | Injected fault | Stage-3 `dtos` | Builder result | DTO files emitted | Registry `validate()` |
|---|----------------|----------------|----------------|-------------------|-----------------------|
| A | **Missing schema** (empty registry / family not registered) | `BLOCKED` | not invoked | **0** | PASS (empty) |
| B | **Broken reference** (`ref` → non-existent id) | `BLOCKED` | `null` | **0** | **FAIL** (dangling reference) |
| C | **Circular dependency** (A→B→A) | `BLOCKED` | `null` | **0** | **FAIL** (dependency cycle) |
| D | **Incomplete payload family** (2 declared, 1 registered) | `BLOCKED` | not reached | **0** | n/a |

## Captured Output

```
--- FAIL-CLOSED ---
empty-registry     dto files = 0   dtos verdict = BLOCKED
broken-ref         builder doc = null | dtos verdict = BLOCKED | dto files = 0
broken-ref         registry.validate = FAIL
cyclic             builder doc = null | validate = FAIL | dto files = 0
incomplete-family  dtos verdict = BLOCKED | dto files = 0
```

### Case A — Missing schema
Empty field-schema registry: every declared family is unresolved → `dtos = BLOCKED` → no `dto/*` files. Identical to the shipped default state.

### Case B — Broken reference
A `ThingRecord` referencing `UCOS-DATA-CONTRACT-999/DOES-NOT-EXIST`:
- `resolveDependencies()` reports the ref as `missing` (`ok = false`) → Stage 3 `BLOCKED`.
- `buildContractDTOs()` returns `null` (dependency-incomplete guard).
- `registry.validate()` = **FAIL** with `dangling field-schema reference`.
- Zero DTO files emitted.

### Case C — Circular dependency
`ThingRecord → B → ThingRecord`:
- `resolveDependencies()` detects the cycle (`cycle != null`, `ok = false`).
- `buildContractDTOs()` returns `null`.
- `registry.validate()` = **FAIL** with `dependency cycle`.
- Zero DTO files emitted.

### Case D — Incomplete payload family
Contract declares `["ThingRecord", "OtherRecord"]`; only `ThingRecord` registered:
- `fieldSchemasResolvable = false` (not every family resolves) → `dtos = BLOCKED`.
- Emitter never reached for DTOs. Zero DTO files emitted.
- Diagnostic note names the unresolved family `OtherRecord`.

---

## WS3 Conclusion

The generator fails closed on missing schemas, broken references, circular dependencies, and incomplete payload families. In every case generation is blocked and **no DTO artifact is emitted**. No invention occurs under fault. **No defect found.**
