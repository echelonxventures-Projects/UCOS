# WI-09 DTO Generator — End-to-End Generation Evidence (Workstream 2)

**Mode:** Verification via hermetic, synthetic, test-only field schemas. **No business payloads authored.**
**Date:** 2026-07-03
**Verdict:** Full path **Registry → DTO Builder → DTO Emitter → Generated DTO Artifacts** verified working.

---

## Synthetic Fixture (hermetic, test-only)

Two synthetic field schemas were constructed **in memory only** (never written under `contracts/field-schemas/`), bound to the existing test contract `API-999` (`UCOS-DATA-CONTRACT-999`):

- `ThingRecord` — object with: required `string` (`minLength/maxLength` constraints), optional `integer` (`minimum`), optional `string[]` array (`minItems`), optional `enum` (`active|inactive`), and a **`reference` → `Address`**.
- `Address` — object with required `string` and a nullable `string`.

This exercises every node kind plus a transitive reference. The real on-disk registry remains empty.

## Pipeline Result

```
REGISTRY.size = 2
REGISTRY.validate = PASS
ThingRecord deps resolved = ["UCOS-DATA-CONTRACT-999/Address"] ok = true
PIPELINE verdict = PASS
STAGE3 dtos = SUFFICIENT
```

## Emitted DTO Artifacts (6)

```
dto/api-999/errors.ts
dto/api-999/index.ts
dto/api-999/models.ts
dto/api-999/requests.ts
dto/api-999/responses.ts
dto/index.ts
```

## Builder Output

```
BUILDER doc.models names        = ["Address","ThingRecord"]   (sorted by name)
BUILDER payloadFamilyTypeNames  = ["ThingRecord"]              (declared order)
```

The transitive dependency `Address` was pulled into the closure and emitted, and the reference in `ThingRecord.home` was resolved at build time to the concrete type name `Address`.

## Emitted `dto/api-999/models.ts` (verbatim, banner elided)

```typescript
/**
 * Source field schema: UCOS-DATA-CONTRACT-999/Address (v1.0.0).
 * Payload family: Address.
 */
export interface Address {
  /** @constraint minLength=1 */
  readonly street: string;
  readonly zip?: string | null;
}

/**
 * Source field schema: UCOS-DATA-CONTRACT-999/ThingRecord (v1.0.0).
 * Payload family: ThingRecord.
 */
export interface ThingRecord {
  /** @constraint minLength=1 maxLength=128 */
  readonly key: string;
  /** @constraint minimum=0 */
  readonly count?: number;
  /** @constraint minItems=0 */
  readonly tags?: readonly string[];
  readonly status?: "active" | "inactive";
  readonly home?: Address;
}
```

Confirmed behaviors:
- **Reference resolution** — `home?: Address` (build-time resolved concrete type).
- **Nullability** — `zip?: string | null`.
- **Enum union** — `"active" | "inactive"`.
- **Readonly arrays** — `readonly string[]`.
- **Advisory constraints** — rendered as `@constraint` JSDoc; the emitted TYPE is unchanged.
- **Required vs optional** — `key` (required) vs `count?/tags?/status?/home?` (optional).

## Request/Error Emitters

`dto/api-999/requests.ts` (typed alias per declared family, operation binding deferred):
```typescript
import type { ThingRecord } from "./models.ts";
/** Request DTO for payload family "ThingRecord". Operation binding deferred (Prompt 08). */
export type ThingRecordRequestDTO = ThingRecord;
```

`dto/api-999/errors.ts` (fail-closed placeholder — catalog declares no error model, G5):
```typescript
export type Api999ErrorDTO = never;
```

## Isolated Typecheck of Emitted Output

The six emitted DTO files were written to an isolated temp directory and compiled with the project's TypeScript **5.9.3** under `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `allowImportingTsExtensions`:

```
node <typescript@5.9.3>/bin/tsc --noEmit -p <tmp>/tsconfig.json
TSC EXIT: 0   (no diagnostics)
```

The generated DTO output — including the cross-file `import type { ThingRecord } from "./models.ts"` — is **valid, strict, type-safe TypeScript**.

---

## WS2 Conclusion

The complete DTO generation path produces correct, type-safe, dependency-resolved artifacts from a resolvable registry. Behavior verified end-to-end. **No defect found.**
