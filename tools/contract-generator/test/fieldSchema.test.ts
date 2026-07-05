/**
 * WI-08 tests — Field-Schema Model, Schema Registry (discovery/validation/version/dependency
 * resolution), and the registry-driven Stage-3 sufficiency flip. Includes regression tests
 * proving the empty registry preserves WI-07 verdicts + output.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildFieldSchemaRegistry,
  compareVersions,
  discoverFieldSchemas,
  loadFieldSchemaMetaRegistry,
  loadFieldSchemaRegistry,
  EMPTY_FIELD_SCHEMA_REGISTRY,
} from "../src/registry/fieldSchemaRegistry.ts";
import type { LoadedFieldSchema } from "../src/registry/fieldSchemaRegistry.ts";
import { stage2Model } from "../src/validate/stage2-model.ts";
import { stage3GeneratorInput } from "../src/validate/stage3-generator-input.ts";
import { loadSchemaRegistry } from "../src/validate/schemaRegistry.ts";
import { generate } from "../src/generate.ts";
import {
  validInventory,
  asInventory,
  fieldSchemaDoc,
  objectSchema,
  api999FieldSchemas,
} from "./fixtures.ts";
import type { JsonValue } from "../src/types.ts";
import type { EmittedFile } from "../src/generate.ts";

const meta = loadFieldSchemaMetaRegistry();

/** Wrap raw field-schema docs as LoadedFieldSchema sources with stable ids. */
function sources(docs: readonly JsonValue[]): readonly LoadedFieldSchema[] {
  return docs.map((raw, i) => ({ sourceId: `test/fs-${i}.fieldschema.json`, raw }));
}

function reg(docs: readonly JsonValue[]) {
  return buildFieldSchemaRegistry(sources(docs), meta);
}

function fileMap(files: readonly EmittedFile[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const f of files) m.set(f.relPath, f.content);
  return m;
}

// --- Field Schema Model / meta-schema structural validation --------------------------------

test("registry accepts a structurally-valid field schema (primitive/object/array/enum nodes)", () => {
  const r = reg([fieldSchemaDoc("DC/Thing", "Thing", "DC", objectSchema())]);
  assert.equal(r.size, 1);
  assert.equal(r.validate().verdict, "PASS", JSON.stringify(r.validate().failures));
  assert.deepEqual(r.ids(), ["DC/Thing"]);
});

test("registry rejects an unknown node kind (fail-closed; definition excluded, failure recorded)", () => {
  const bad = fieldSchemaDoc("DC/Bad", "Bad", "DC", { kind: "tuple", items: [] });
  const r = reg([bad]);
  assert.equal(r.size, 0, "structurally invalid definition is not registered");
  const v = r.validate();
  assert.equal(v.verdict, "FAIL");
  assert.ok(v.failures.length > 0);
});

test("registry rejects an additional property under additionalProperties:false", () => {
  const bad = fieldSchemaDoc("DC/Bad", "Bad", "DC", {
    kind: "primitive",
    type: "string",
    bogus: true,
  });
  const r = reg([bad]);
  assert.equal(r.size, 0);
  assert.equal(r.validate().verdict, "FAIL");
});

test("registry rejects a bad version pattern and a missing required field", () => {
  const badVersion = {
    fieldSchemaModelVersion: "ucos-field-schema/1.0.0",
    id: "DC/X",
    version: "v1",
    schema: { kind: "primitive", type: "string" },
  };
  assert.equal(reg([badVersion]).validate().verdict, "FAIL");

  const missingSchema = {
    fieldSchemaModelVersion: "ucos-field-schema/1.0.0",
    id: "DC/Y",
    version: "1.0.0",
  };
  assert.equal(reg([missingSchema]).validate().verdict, "FAIL");
});

// --- Version resolution ---------------------------------------------------------------------

test("compareVersions orders semver numerically", () => {
  assert.ok(compareVersions("1.0.0", "1.0.1") < 0);
  assert.ok(compareVersions("2.0.0", "1.9.9") > 0);
  assert.equal(compareVersions("1.2.3", "1.2.3"), 0);
  assert.ok(compareVersions("1.10.0", "1.9.0") > 0);
});

test("resolve() returns the highest version by default and an exact version on request", () => {
  const r = reg([
    fieldSchemaDoc("DC/T", "T", "DC", { kind: "primitive", type: "string" }, "1.0.0"),
    fieldSchemaDoc("DC/T", "T", "DC", { kind: "primitive", type: "integer" }, "2.1.0"),
    fieldSchemaDoc("DC/T", "T", "DC", { kind: "primitive", type: "boolean" }, "1.5.0"),
  ]);
  assert.equal(r.resolve("DC/T")?.version, "2.1.0");
  assert.equal(r.resolve("DC/T", "1.0.0")?.version, "1.0.0");
  assert.equal(r.resolve("DC/T", "9.9.9"), undefined);
  assert.equal(r.resolve("DC/missing"), undefined);
});

test("resolvePayloadFamily resolves by qualified key and falls back to bare family", () => {
  const r = reg([fieldSchemaDoc("DC/ConfigurationValue", "ConfigurationValue", "UCOS-DATA-CONTRACT-018", objectSchema())]);
  assert.equal(
    r.resolvePayloadFamily("ConfigurationValue", "UCOS-DATA-CONTRACT-018")?.id,
    "DC/ConfigurationValue",
  );
  // Bare-family fallback when the qualified data contract does not match.
  assert.equal(r.resolvePayloadFamily("ConfigurationValue", "OTHER-DC")?.id, "DC/ConfigurationValue");
  assert.equal(r.resolvePayloadFamily("Unknown"), undefined);
});

// --- Dependency resolution ------------------------------------------------------------------

test("resolveDependencies resolves a transitive reference graph", () => {
  const r = reg([
    fieldSchemaDoc("A", "A", "DC", { kind: "object", properties: [{ name: "b", required: true, schema: { kind: "reference", ref: "B" } }] }),
    fieldSchemaDoc("B", "B", "DC", { kind: "object", properties: [{ name: "c", required: true, schema: { kind: "reference", ref: "C" } }] }),
    fieldSchemaDoc("C", "C", "DC", { kind: "primitive", type: "string" }),
  ]);
  assert.equal(r.validate().verdict, "PASS");
  const dep = r.resolveDependencies("A");
  assert.deepEqual(dep.resolved, ["B", "C"]);
  assert.deepEqual(dep.missing, []);
  assert.equal(dep.cycle, null);
  assert.equal(dep.ok, true);
  assert.deepEqual(r.directDependencies("A"), ["B"]);
});

test("resolveDependencies flags a dangling reference (validate FAIL)", () => {
  const r = reg([
    fieldSchemaDoc("A", "A", "DC", { kind: "object", properties: [{ name: "b", required: true, schema: { kind: "reference", ref: "B" } }] }),
  ]);
  const dep = r.resolveDependencies("A");
  assert.deepEqual(dep.missing, ["B"]);
  assert.equal(dep.ok, false);
  const v = r.validate();
  assert.equal(v.verdict, "FAIL");
  assert.ok(v.failures.some((f) => f.reason.includes("dangling field-schema reference 'B'")));
});

test("resolveDependencies detects a cycle (validate FAIL)", () => {
  const r = reg([
    fieldSchemaDoc("A", "A", "DC", { kind: "object", properties: [{ name: "b", required: true, schema: { kind: "reference", ref: "B" } }] }),
    fieldSchemaDoc("B", "B", "DC", { kind: "object", properties: [{ name: "a", required: true, schema: { kind: "reference", ref: "A" } }] }),
  ]);
  const dep = r.resolveDependencies("A");
  assert.notEqual(dep.cycle, null);
  assert.equal(dep.ok, false);
  const v = r.validate();
  assert.equal(v.verdict, "FAIL");
  assert.ok(v.failures.some((f) => f.reason.includes("dependency cycle")));
});

test("duplicate id@version is rejected", () => {
  const r = reg([
    fieldSchemaDoc("DC/Dup", "Dup", "DC", { kind: "primitive", type: "string" }, "1.0.0"),
    fieldSchemaDoc("DC/Dup", "Dup", "DC", { kind: "primitive", type: "integer" }, "1.0.0"),
  ]);
  const v = r.validate();
  assert.equal(v.verdict, "FAIL");
  assert.ok(v.failures.some((f) => f.reason.includes("duplicate field-schema id@version")));
});

// --- Discovery ------------------------------------------------------------------------------

test("discoverFieldSchemas tolerates a missing directory (returns empty)", () => {
  assert.deepEqual(discoverFieldSchemas("/nonexistent/field-schemas/xyz"), []);
});

test("on-disk registry carries the UCOS-PDATA-ARCH-001 authored field schemas and validates PASS", () => {
  // Field authority UCOS-PDATA-ARCH-001 (PHASE D.1) authored the 5 payload-family schemas.
  // The registry is no longer empty; it must validate PASS and expose all five bindings.
  const r = loadFieldSchemaRegistry();
  assert.equal(r.size, 5);
  assert.equal(r.validate().verdict, "PASS");
  assert.deepEqual(r.ids(), [
    "UCOS-DATA-CONTRACT-018/ConfigurationValue",
    "UCOS-DATA-CONTRACT-018/FeatureFlag",
    "UCOS-DATA-CONTRACT-018/MetadataRecord",
    "UCOS-DATA-CONTRACT-027/DiscoveryRecord",
    "UCOS-DATA-CONTRACT-027/RegistryArtifact",
  ]);
});

// --- Sufficiency flip (Stage 3) -------------------------------------------------------------

test("Stage 3 stays BLOCKED/PARTIAL with the EMPTY registry (WI-07 backward-compat)", () => {
  const s2 = stage2Model(validInventory());
  assert.ok(s2.model);
  const s3 = stage3GeneratorInput(s2.model!, EMPTY_FIELD_SCHEMA_REGISTRY);
  assert.equal(s3.targets.dtos, "BLOCKED");
  assert.equal(s3.targets.validators, "BLOCKED");
  assert.equal(s3.targets.clients, "PARTIAL");
  assert.equal(s3.targets.serverStubs, "PARTIAL");
  assert.equal(s3.fieldSchemas.length, 1);
  assert.equal(s3.fieldSchemas[0]?.resolved, false);
});

test("Stage 3 FLIPS to SUFFICIENT when all payload families resolve in the registry", () => {
  const s2 = stage2Model(validInventory());
  assert.ok(s2.model);
  const registry = reg(api999FieldSchemas());
  const s3 = stage3GeneratorInput(s2.model!, registry);
  assert.equal(s3.targets.dtos, "SUFFICIENT");
  assert.equal(s3.targets.validators, "SUFFICIENT");
  assert.equal(s3.targets.clients, "SUFFICIENT");
  assert.equal(s3.targets.serverStubs, "SUFFICIENT");
  assert.ok(s3.fieldSchemas.every((f) => f.resolved));
  assert.ok(s3.notes.some((n) => n.startsWith("DTOs SUFFICIENT")));
});

test("Stage 3 stays BLOCKED when only SOME families resolve, with a missing-family diagnostic", () => {
  // Two families declared; register only one.
  const raw = JSON.parse(JSON.stringify(validInventory())) as JsonValue;
  const contract = (raw as Record<string, JsonValue>)["contract"] as Record<string, JsonValue>;
  const dcd = contract["dataContractDetail"] as Record<string, JsonValue>;
  dcd["payloadFamilies"] = ["ThingRecord", "OtherRecord"];
  const s2 = stage2Model(raw);
  assert.ok(s2.model);
  const registry = reg(api999FieldSchemas()); // only ThingRecord
  const s3 = stage3GeneratorInput(s2.model!, registry);
  assert.equal(s3.targets.dtos, "BLOCKED");
  assert.equal(s3.targets.clients, "PARTIAL");
  assert.ok(s3.notes.some((n) => n.includes("OtherRecord")));
});

test("Stage 3 keeps DTOs BLOCKED when a resolved family has incomplete dependencies", () => {
  const s2 = stage2Model(validInventory());
  assert.ok(s2.model);
  // ThingRecord references a missing schema → dependency-incomplete → not sufficient.
  const registry = reg([
    fieldSchemaDoc("UCOS-DATA-CONTRACT-999/ThingRecord", "ThingRecord", "UCOS-DATA-CONTRACT-999", {
      kind: "object",
      properties: [{ name: "ref", required: true, schema: { kind: "reference", ref: "MISSING" } }],
    }),
  ]);
  const s3 = stage3GeneratorInput(s2.model!, registry);
  assert.equal(s3.targets.dtos, "BLOCKED");
  assert.equal(s3.fieldSchemas[0]?.reason, "incomplete-dependencies");
});

// --- Integration through generate() ---------------------------------------------------------

test("generate() with a populated registry reports SUFFICIENT and stamps the manifest", () => {
  const registry = loadSchemaRegistry();
  const fieldSchemas = reg(api999FieldSchemas());
  const result = generate({ inventories: [asInventory(validInventory())], registry, fieldSchemas });
  assert.equal(result.report.verdict, "PASS");
  const c = result.report.contracts[0];
  assert.equal(c?.stage3_targets.dtos, "SUFFICIENT");
  assert.equal(c?.stage3_targets.validators, "SUFFICIENT");
  const files = fileMap(result.files);
  const manifest = files.get("api-999/manifest.ts") ?? "";
  assert.match(manifest, /dtos: "SUFFICIENT"/);
  assert.match(manifest, /validators: "SUFFICIENT"/);
});

test("generate() is deterministic with a populated registry (identical file map across runs)", () => {
  const registry = loadSchemaRegistry();
  const fieldSchemas = reg(api999FieldSchemas());
  const a = JSON.stringify(generate({ inventories: [asInventory(validInventory())], registry, fieldSchemas }).files);
  const b = JSON.stringify(generate({ inventories: [asInventory(validInventory())], registry, fieldSchemas }).files);
  assert.equal(a, b);
});

test("generate() with the default (empty) registry keeps DTOs BLOCKED (regression anchor)", () => {
  const registry = loadSchemaRegistry();
  const result = generate({ inventories: [asInventory(validInventory())], registry });
  const c = result.report.contracts[0];
  assert.equal(c?.stage3_targets.dtos, "BLOCKED");
  assert.equal(c?.stage3_targets.clients, "PARTIAL");
});
