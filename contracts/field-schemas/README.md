# contracts/field-schemas — Field-Schema Registry (WI-08)

This directory is the **registry** of field-level payload schemas consumed by the UCOS Contract
Skeleton Generator (`tools/contract-generator`). It is discovered automatically by
`loadFieldSchemaRegistry()`; each entry is a single JSON document named `*.fieldschema.json` that
conforms to the field-schema meta-schema `contracts/schema/field-schema.schema.json`.

## Status: EMPTY BY DESIGN

WI-08 (Contract Catalog Enrichment) delivers the **framework** — the canonical Field Schema Model,
this registry layer, and a sufficiency engine that recognizes registered schemas. It does **not**
author any business payload. The UCOS contract catalog (`UCOS-CONTRACT-CAT-001`) is boundary-level;
the field-level schemas for payload families such as `ConfigurationValue`, `MetadataRecord`,
`FeatureFlag`, `RegistryArtifact`, and `DiscoveryRecord` are owned by **`UCOS-PDATA-ARCH-001`
(Prompt 05)** and are authored + ratified through governed change, not invented here.

Because this directory ships with **zero** `*.fieldschema.json` files, the generator's Stage-3
sufficiency verdicts remain `BLOCKED` (DTOs, Validators) and `PARTIAL` (Clients, Server Stubs),
and the WI-07 generated output regenerates **byte-identically**.

## How a schema is added (governed, additive)

1. Author a `<key>.fieldschema.json` document conforming to `field-schema.schema.json`, binding it
   to a catalog payload family via `payloadFamily` + `dataContract`.
2. Place it in this directory.
3. Re-run the generator: `node tools/contract-generator/src/cli.ts`.
4. When **every** payload family of a contract resolves to a valid, dependency-complete field
   schema, Stage 3 reports `SUFFICIENT` for that contract's DTOs and Validators.

No file here is hand-mapped in generator logic — resolution is fully registry-driven.

## Document shape (summary)

```json
{
  "fieldSchemaModelVersion": "ucos-field-schema/1.0.0",
  "id": "UCOS-DATA-CONTRACT-0NN/<PayloadFamily>",
  "version": "1.0.0",
  "payloadFamily": "<PayloadFamily>",
  "dataContract": "UCOS-DATA-CONTRACT-0NN",
  "schema": { "kind": "object", "properties": [ /* ... */ ] }
}
```

Node kinds: `primitive` · `object` · `array` · `enum` · `reference`. See
`tools/contract-generator/model/FieldSchemaModel.ts` and `WI08-SCHEMA-REGISTRY.md`.

Traceability: `UCOS-CONTRACT-CAT-001` · `UCOS-PDATA-ARCH-001` · `UCOS-SVC-ARCH-001` · IC-2.
