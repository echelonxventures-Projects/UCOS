/**
 * WI-07 integration tests — full pipeline against the real catalog + generated-artifact checks.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { generate } from "../src/generate.ts";
import { loadSchemaRegistry } from "../src/validate/schemaRegistry.ts";
import { validInventory, asInventory } from "./fixtures.ts";
import type { EmittedFile } from "../src/generate.ts";
import type { JsonValue } from "../src/types.ts";

function fileMap(files: readonly EmittedFile[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const f of files) m.set(f.relPath, f.content);
  return m;
}

test("pipeline processes all ratified contracts and PASSES", () => {
  const result = generate();
  assert.equal(result.report.verdict, "PASS");
  assert.equal(result.report.contracts.length, 2);
  const ids = result.report.contracts.map((c) => c.id).sort();
  assert.deepEqual(ids, ["UCOS-API-CONTRACT-018", "UCOS-API-CONTRACT-027"]);
});

test("per-contract verdicts reflect authored field schemas (DTOs/validators SUFFICIENT)", () => {
  // After UCOS-PDATA-ARCH-001 (PHASE D.1) authored the field schemas for every payload family
  // of API-018 and API-027, the on-disk registry resolves all families -> Stage 3 SUFFICIENT.
  const result = generate();
  for (const c of result.report.contracts) {
    assert.equal(c.stage1_schema, "PASS");
    assert.equal(c.stage2_model, "PASS");
    assert.equal(c.stage3_targets.dtos, "SUFFICIENT");
    assert.equal(c.stage3_targets.validators, "SUFFICIENT");
    assert.equal(c.stage3_targets.clients, "SUFFICIENT");
    assert.equal(c.stage3_targets.serverStubs, "SUFFICIENT");
  }
});

test("emits the expected artifact set (runtime, per-contract files, barrels, report)", () => {
  const files = fileMap(generate().files);
  for (const rel of [
    "_runtime/transport.ts",
    "_runtime/manifest.ts",
    "api-018/interfaces.ts",
    "api-018/requests.ts",
    "api-018/responses.ts",
    "api-018/errors.ts",
    "api-018/client.ts",
    "api-018/manifest.ts",
    "api-018/index.ts",
    "api-027/client.ts",
    "registry.ts",
    "index.ts",
    "validation-report.json",
  ]) {
    assert.ok(files.has(rel), `missing generated artifact: ${rel}`);
  }
});

test("generation is deterministic (identical file map across runs)", () => {
  const a = JSON.stringify(generate().files);
  const b = JSON.stringify(generate().files);
  assert.equal(a, b);
});

test("generated client is a transport-injected factory over opaque payloads (no invention)", () => {
  const files = fileMap(generate().files);
  const client = files.get("api-018/client.ts") ?? "";
  assert.match(client, /export function createApi018Client\(transport: TransportPort\)/);
  assert.match(client, /getConfigurationByScope\(request: GetConfigurationByScopeRequest\): Promise<OpaquePayload>/);
  assert.match(client, /encodeURIComponent\(request\.path\.scope\)/);
  // No fabricated field-level typing leaked into the skeleton.
  assert.doesNotMatch(client, /:\s*any\b/);
});

test("generated interfaces expose opaque payload families, never concrete fields", () => {
  const files = fileMap(generate().files);
  const interfaces = files.get("api-018/interfaces.ts") ?? "";
  assert.match(interfaces, /export type ConfigurationValue = OpaquePayload;/);
  assert.match(interfaces, /export type MetadataRecord = OpaquePayload;/);
  assert.match(interfaces, /export type FeatureFlag = OpaquePayload;/);
});

test("registry manifest aggregates both contracts", () => {
  const files = fileMap(generate().files);
  const registry = files.get("registry.ts") ?? "";
  assert.match(registry, /api018Manifest/);
  assert.match(registry, /api027Manifest/);
  assert.match(registry, /export const sdkRegistry: SdkRegistry/);
});

test("fail-closed: a schema-invalid inventory yields FAIL and ZERO files", () => {
  const registry = loadSchemaRegistry();
  const bad = JSON.parse(JSON.stringify(validInventory())) as JsonValue;
  // Inject an unknown top-level property to trip additionalProperties:false.
  (bad as Record<string, JsonValue>)["unexpected"] = 123;
  const result = generate({ inventories: [asInventory(bad)], registry });
  assert.equal(result.report.verdict, "FAIL");
  assert.equal(result.files.length, 0, "no artifacts emitted on validation failure");
});

test("fail-closed: a valid injected inventory still generates skeletons", () => {
  const registry = loadSchemaRegistry();
  const result = generate({ inventories: [asInventory(validInventory())], registry });
  assert.equal(result.report.verdict, "PASS");
  assert.ok(result.files.length > 0);
  const files = fileMap(result.files);
  assert.ok(files.has("api-999/client.ts"));
});
