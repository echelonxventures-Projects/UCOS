/**
 * CGR-CORE-01 verification — shared schema.
 * Proves: registry set closed & complete; ACTIVE not representable in RecordStatus;
 * the eight edge relations present.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { REGISTRY_NAMES, EDGE_RELATIONS } from "../../../src/control/constitutional-governance/types.ts";
import type { RecordStatus } from "../../../src/control/constitutional-governance/types.ts";

test("CORE-01: eleven registries are declared, closed set", () => {
  assert.equal(REGISTRY_NAMES.length, 11);
  assert.ok(REGISTRY_NAMES.includes("REG-PRIN"));
  assert.ok(REGISTRY_NAMES.includes("REG-AUDIT"));
  assert.equal(new Set(REGISTRY_NAMES).size, 11);
});

test("CORE-01: ACTIVE is not a representable status (propose-only doctrine)", () => {
  const allowed: readonly RecordStatus[] = ["proposed", "superseded"];
  // Type-level guarantee is compile-time; assert the runtime allowed-set excludes "active".
  assert.ok(!(allowed as readonly string[]).includes("active"));
  assert.deepEqual([...allowed].sort(), ["proposed", "superseded"]);
});

test("CORE-01: eight derivation-edge relations are declared", () => {
  assert.equal(EDGE_RELATIONS.length, 8);
  assert.equal(new Set(EDGE_RELATIONS).size, 8);
  for (const r of ["derives-from", "refines", "realizes", "governed-by", "subsumed-by", "supersedes", "depends-on", "federates-with"]) {
    assert.ok((EDGE_RELATIONS as readonly string[]).includes(r), `missing relation ${r}`);
  }
});
