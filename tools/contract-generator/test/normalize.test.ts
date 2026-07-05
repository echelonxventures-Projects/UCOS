/**
 * WI-07 unit tests — path-template parser + deterministic operationId derivation.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePath } from "../src/normalize/pathTemplate.ts";
import { deriveOperationId, pascalCase } from "../src/normalize/deriveOperationId.ts";

test("parsePath splits literals, path params, and query keys", () => {
  const p = parsePath("/configuration/{scope}/{key}");
  assert.equal(p.templatePath, "/configuration/{scope}/{key}");
  assert.deepEqual(p.pathParameters, ["scope", "key"]);
  assert.deepEqual(p.queryParameters, []);
  assert.equal(p.segments.length, 3);
  assert.deepEqual(p.segments[0], { kind: "literal", value: "configuration" });
  assert.deepEqual(p.segments[1], { kind: "param", value: "scope" });
});

test("parsePath extracts declared query keys and strips them from the path", () => {
  const p = parsePath("/registry/discovery?type=");
  assert.equal(p.templatePath, "/registry/discovery");
  assert.deepEqual(p.pathParameters, []);
  assert.deepEqual(p.queryParameters, ["type"]);
});

test("parsePath is order-preserving and de-duplicates parameters", () => {
  const p = parsePath("/a/{x}/b/{x}");
  assert.deepEqual(p.pathParameters, ["x"]);
});

test("pascalCase normalizes hyphenated tokens", () => {
  assert.equal(pascalCase("feature-flags"), "FeatureFlags");
  assert.equal(pascalCase("configuration"), "Configuration");
});

test("deriveOperationId is deterministic and matches the documented rule", () => {
  assert.equal(deriveOperationId("GET", "/configuration/{scope}"), "getConfigurationByScope");
  assert.equal(
    deriveOperationId("PUT", "/configuration/{scope}/{key}"),
    "putConfigurationByScopeByKey",
  );
  assert.equal(deriveOperationId("GET", "/metadata/{class}"), "getMetadataByClass");
  assert.equal(deriveOperationId("GET", "/feature-flags/{context}"), "getFeatureFlagsByContext");
  assert.equal(deriveOperationId("GET", "/registry/artifacts"), "getRegistryArtifacts");
  assert.equal(deriveOperationId("POST", "/registry/artifacts"), "postRegistryArtifacts");
  assert.equal(deriveOperationId("GET", "/registry/artifacts/{id}"), "getRegistryArtifactsById");
  assert.equal(deriveOperationId("GET", "/registry/discovery?type="), "getRegistryDiscovery");
});

test("deriveOperationId falls back to <verb>Root for the root path", () => {
  assert.equal(deriveOperationId("GET", "/"), "getRoot");
});
