# WI08-SCHEMA-REGISTRY

| Field | Value |
|-------|-------|
| Artifact | **Field-Schema Framework & Schema Registry — Architecture** |
| Work Item | **PHASE 12 — WI-08** (Contract Catalog Enrichment) |
| Branch | `phase-11-contracts-sdk` |
| Frozen Baseline | `56a32d3` · Tag `ucost-baseline-green-284` |
| Mode | **IMPLEMENTATION** — framework + registry + sufficiency engine; no invented business payloads |
| Date | 2026-07-03 |
| Traceability | `UCOS-CONTRACT-CAT-001` · `UCOS-PDATA-ARCH-001` · `UCOS-SVC-ARCH-001` · IC-2 |

> **Purpose.** Document the WI-08 registry-driven field-schema architecture: the canonical Field Schema
> Model, the Schema Registry layer (discovery, validation, version + dependency resolution), and the enhanced
> Stage-3 sufficiency engine that consults the registry to decide DTO/Validator readiness — all **without
> inventing any business payload**.

---

## 1. Architecture Overview

```
                       (authored + ratified by UCOS-PDATA-ARCH-001 / Prompt 05 — NOT by WI-08)
                                             │
                                             ▼
   contracts/field-schemas/*.fieldschema.json      ── EMPTY by design in WI-08
                                             │  discovery
                                             ▼
   ┌──────────────────────────── Schema Registry (WI-08 WS3) ─────────────────────────────┐
   │  discover → structural-validate (field-schema.schema.json) → index → resolve          │
   │    · version resolution (semver; highest or exact)                                     │
   │    · payload-family binding (dataContract/family → definition)                         │
   │    · dependency resolution (transitive refs; missing + cycle detection)                │
   └───────────────────────────────────────┬───────────────────────────────────────────────┘
                                            │ FieldSchemaRegistry (read-only surface)
                                            ▼
   Stage 3 · Generator Input / Sufficiency Gate (WI-08 WS4)
     per contract: do ALL declared payload families resolve completely?
       yes → DTOs/Validators SUFFICIENT · Clients/ServerStubs SUFFICIENT
       no  → DTOs/Validators BLOCKED    · Clients/ServerStubs PARTIAL   (= WI-07 behavior)
                                            │
                                            ▼
                          Deterministic validation report + emitters
```

**Registry-driven invariant.** No generator module references a field schema directly. The generator only
asks the registry to *resolve* — satisfying the WS3 acceptance criterion "No direct schema references in
generator logic."

---

## 2. Registry Model (Canonical Field Schema Model)

Defined as pure erasable TypeScript in `tools/contract-generator/model/FieldSchemaModel.ts` and mirrored by
the meta-schema `contracts/schema/field-schema.schema.json`.

### 2.1 Node kinds

| Kind | Purpose | Key fields |
|------|---------|-----------|
| `primitive` | scalar leaf | `type` (`string`\|`number`\|`integer`\|`boolean`), `constraints`, `nullable` |
| `enum` | closed value set | `base`, `values[]`, `nullable` |
| `array` | ordered collection | `items` (node), `constraints`, `nullable` |
| `object` | structured record | `properties[]` (`name`, `schema`, `required`), `additionalProperties`, `nullable` |
| `reference` | reuse / composition | `ref` (registry id), `version?`, `nullable` |

### 2.2 Constraints (transport-neutral, all optional/additive)

`minLength`, `maxLength`, `pattern`, `format`, `minimum`, `maximum`, `minItems`, `maxItems`, `uniqueItems`.
Constraints carry no business meaning by themselves; they parameterize future validator generation.

### 2.3 Definition (registry unit)

```json
{
  "fieldSchemaModelVersion": "ucos-field-schema/1.0.0",
  "id": "UCOS-DATA-CONTRACT-018/ConfigurationValue",
  "version": "1.0.0",
  "payloadFamily": "ConfigurationValue",
  "dataContract": "UCOS-DATA-CONTRACT-018",
  "schema": { "kind": "object", "properties": [ /* ... */ ] }
}
```

- **Registry Driven** — discovered from a directory; never hard-referenced.
- **Deterministic** — a definition is pure data; resolution is a pure function (stable ordering, no clock).
- **Versioned** — every definition has `version`; multiple versions of one `id` coexist.
- **Backward Compatible** — additive-only; the meta-schema is closed (`additionalProperties:false`), so any
  unknown field fails closed at validation.

The binding fields `payloadFamily` + `dataContract` connect a definition to a catalog payload family, so the
sufficiency engine resolves a contract's families to concrete schemas **without any hand-mapping**.

---

## 3. Registry Layer (`src/registry/fieldSchemaRegistry.ts`)

| Responsibility | Function(s) | Behavior |
|----------------|-------------|----------|
| **Discovery** | `discoverFieldSchemas(dir)` | Loads `*.fieldschema.json` in deterministic (sorted) order. Tolerates a missing/empty directory (returns `[]`). |
| **Validation** | `buildFieldSchemaRegistry(...).validate()` | Structural (against `field-schema.schema.json`) + semantic: duplicate `id@version`, dangling references, dependency cycles. Fail-closed. |
| **Version resolution** | `resolve(id, version?)` · `compareVersions(a,b)` | Exact version, or the highest by semver when omitted. |
| **Binding resolution** | `resolvePayloadFamily(family, dataContract?)` | Qualified key `dataContract/family`, with bare-family fallback. |
| **Dependency resolution** | `resolveDependencies(id, version?)` · `directDependencies(...)` | Transitive `reference` graph; reports `resolved`, `missing`, `cycle`, `ok`. |

Read-only surface: `size`, `list()`, `ids()`, `has()`, plus the resolvers above. Construction is pure:
`buildFieldSchemaRegistry(sources, metaRegistry)` builds from any source array (disk or in-memory), enabling
hermetic tests. `EMPTY_FIELD_SCHEMA_REGISTRY` is the default used by Stage 3.

---

## 4. Sufficiency Engine (Stage 3)

`stage3GeneratorInput(model, registry = EMPTY_FIELD_SCHEMA_REGISTRY)`:

1. Resolve each declared payload family via `registry.resolvePayloadFamily(family, dataContract)`.
2. A family is **resolved** only when the definition exists **and** `resolveDependencies(...).ok` is true.
3. `fieldSchemasResolvable` = the contract declares ≥1 family **and every family resolved**.

| Target | SUFFICIENT when | Otherwise |
|--------|-----------------|-----------|
| DTOs | `fieldSchemasResolvable` | BLOCKED |
| Validators | `fieldSchemasResolvable` | BLOCKED |
| Clients | `hasOperations && fieldSchemasResolvable` | PARTIAL (if operations) / BLOCKED (none) |
| Server Stubs | = Clients | = Clients |

**Byte-identical guarantee.** On the BLOCKED path the notes use the exact WI-07 wording, and the
SUFFICIENT/diagnostic notes are emitted **only when the registry is non-empty**. With the shipped empty
registry, the report — and therefore the entire generated tree — is unchanged.

---

## 5. Upgrade Path (governed, additive)

1. `UCOS-PDATA-ARCH-001` authors a `*.fieldschema.json` per payload family, binding `payloadFamily` +
   `dataContract`, and places it under `contracts/field-schemas/`.
2. Re-run `node tools/contract-generator/src/cli.ts`.
3. The registry validates + resolves the new schema; Stage 3 lifts the affected contract's DTOs/Validators to
   `SUFFICIENT`.
4. WI-09 (DTO Generator) consumes the `SUFFICIENT` verdict + resolved schema tree to emit typed DTOs and
   validators behind the same skeleton contract — no rework of WI-07/WI-08.

No generator code changes are required to onboard new schemas; the pipeline is fully registry-driven.

---

## 6. Known Limitations

- **No business payloads shipped.** The registry is intentionally empty; WI-08 delivers only the mechanism.
  Until `UCOS-PDATA-ARCH-001` authors schemas, all real contracts remain `BLOCKED`/`PARTIAL`.
- **Validation subset.** Structural validation uses the offline JSON-Schema draft-2020-12 subset already used
  by Stage 1 (`type`, `properties`, `required`, `additionalProperties:false`, `enum`, `const`, `pattern`,
  `minLength`, `items`, `oneOf`, `$ref`). Numeric bound keywords (`minimum`/`maximum`) inside the *meta-schema*
  are not enforced; the field-schema *instances* carry them as data for later validator generation.
- **`oneOf` semantics.** The engine treats `oneOf` as "≥1 branch matches" (consistent with WI-06/07). Node
  discrimination relies on the `kind` const, so branches are mutually exclusive in practice.
- **DTO/validator emission is out of scope.** WI-08 determines *readiness*; emitting typed DTOs/validators is
  WI-09.
- **Error models + parameter types.** Representable by the model but neither authored nor required for the
  DTO/Validator sufficiency flip (see `WI08-CATALOG-GAP-INVENTORY.md` §4–5).

**END WI08-SCHEMA-REGISTRY (Implementation · Registry-driven · No invention · Baseline `56a32d3`).**
