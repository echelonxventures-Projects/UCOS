# @ucos/contract-generator — Contract Skeleton Generator (WI-07)

Deterministic, fail-closed, registry-driven generator that turns the ratified UCOS contract
catalog into transport-neutral SDK **skeletons**. This is the implementation behind
`CONTRACT-VALIDATION-ARCHITECTURE.md` and `PHASE-12-WI-06-CONTRACT-META-SCHEMA-REPORT.md`.

> **Scope = SKELETON.** Payloads are OPAQUE. The catalog defers all field-level schemas
> (`NOT DEFINED IN CATALOG`, G1), so typed DTOs and validators are **BLOCKED** and are **never
> invented**. Clients + request/response/error scaffolds + registry manifests are generated at
> the `PARTIAL` sufficiency level, exactly as authorized by WI-06.

## Pipeline

```
Contract Catalog            →  Canonical Generator Model  →  SDK Skeleton Generation
contracts/catalog/*.json       tools/contract-generator/      packages/contracts-sdk/generated/
       │                            model/*.ts
       ▼
  Stage 1  Schema Validation     (contracts/schema/*.schema.json, offline subset validator)
  Stage 2  Canonical Model       (normalize + semantic invariants; derive operationId/kind)
  Stage 3  Sufficiency Gate      (per-target SUFFICIENT | PARTIAL | BLOCKED)
       ▼
  VERDICT  PASS → emit PARTIAL-permitted skeletons   |   FAIL → zero files (fail-closed)
```

## Layout

```
tools/contract-generator/
  model/                     canonical model TYPES (WI-06)
  src/
    paths.ts                 fixed repo input/output locations
    types.ts                 shared result vocabulary
    load/loadInventory.ts    read catalog inventories (read-only, sorted)
    validate/
      jsonSchema.ts          offline JSON-Schema subset interpreter (registry-driven)
      schemaRegistry.ts      loads contracts/schema/*.schema.json
      stage1-schema.ts       Stage 1 — structural conformance
      stage2-model.ts        Stage 2 — normalize + semantic invariants
      stage3-generator-input.ts  Stage 3 — per-target sufficiency
      report.ts              deterministic ValidationReport
    normalize/
      pathTemplate.ts        parse "/a/{b}?c=" into segments/params/query
      deriveOperationId.ts   deterministic operationId rule (G6)
    emit/
      render.ts view.ts runtime.ts interfaces.ts requests.ts responses.ts
      errors.ts client.ts manifest.ts barrels.ts
    generate.ts              orchestrator (pure: returns {report, files})
    writeArtifacts.ts        writes the file map under generated/ (idempotent clean)
    cli.ts                   entry point
  test/                      node:test unit + integration suites
```

## Usage

```bash
# From tools/contract-generator (Node >= 23.6, native TS type-stripping):
node src/cli.ts            # validate + generate into packages/contracts-sdk/generated/
node src/cli.ts --check    # validate + print report only; exit 1 on FAIL; write nothing
node --test "test/*.test.ts"                      # run the test suite
node --test --experimental-test-coverage "test/*.test.ts"   # with coverage
```

The CLI prints the machine-readable validation report to stdout. On any Stage-1/Stage-2 FAIL
it exits non-zero and writes **no** artifacts.

## Generated output (`packages/contracts-sdk/generated/`)

```
_runtime/transport.ts   VerbSemantics, OpaquePayload, TransportRequest, TransportPort (injected)
_runtime/manifest.ts    ContractManifest / SdkRegistry types
<slug>/interfaces.ts    operationId union, operation descriptor, contract metadata, opaque payload aliases
<slug>/requests.ts      per-operation request scaffolds (path params as string; opaque body for unsafe ops)
<slug>/responses.ts     per-operation response scaffolds (opaque body)
<slug>/errors.ts        opaque error alias (catalog declares no error model, G5)
<slug>/client.ts        client interface + createXxxClient(transport) factory
<slug>/manifest.ts      catalog-faithful ContractManifest value
<slug>/index.ts         per-contract barrel
registry.ts             aggregate sdkRegistry
index.ts                generated-root barrel (re-exported by @ucos/contracts-sdk)
validation-report.json  deterministic validation report
```

`<slug>` is the lowercased short id (e.g. `api-018`, `api-027`).

## Design guarantees

- **No hard coding.** The contract shape is validated against `contracts/schema/*.schema.json`
  interpreted as data; nothing about API-018/027 is baked into the engine.
- **Registry driven.** Inputs are the catalog inventories + meta-schema registry.
- **Deterministic.** No timestamps, clocks, or randomness; stable ordering; identical inputs
  produce byte-identical output (verified by test + sha256).
- **Backward compatible.** Meta-schema is additive-only; unknown fields fail closed rather than
  silently drift.
- **Type safe.** Generated code compiles under the strict, erasable, `verbatimModuleSyntax`
  config shared with `@ucos/platform-runtime`.
- **100% automated & no invention.** Deferred field-level schemas remain opaque placeholders;
  the generator refuses to fabricate DTO fields, error codes, transport, or security.

## Extending to new contracts

1. Add/extend the catalog inventory under `contracts/catalog/*.contract.json` via governed
   versioning (`UCOS-SVC-POLICY-001`).
2. Run `node src/cli.ts --check` — confirm PASS and review per-target sufficiency.
3. Run `node src/cli.ts` to regenerate. Never hand-edit anything under `generated/`.

When field-level schemas are ratified (Prompt 05 / `UCOS-PDATA-ARCH-001`), Stage 3 will report
`SUFFICIENT` for DTOs/validators and a future emitter pass can lift payloads from opaque to typed
— without changing this skeleton contract.
