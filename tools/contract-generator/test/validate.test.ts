/**
 * WI-07 unit tests — the four-stage fail-closed validation pipeline + report.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { loadSchemaRegistry } from "../src/validate/schemaRegistry.ts";
import { stage1Schema } from "../src/validate/stage1-schema.ts";
import { stage2Model } from "../src/validate/stage2-model.ts";
import { stage3GeneratorInput } from "../src/validate/stage3-generator-input.ts";
import { buildReport, serializeReport } from "../src/validate/report.ts";
import type { ContractReport } from "../src/validate/report.ts";
import { validInventory } from "./fixtures.ts";
import type { JsonValue } from "../src/types.ts";
import { isObject } from "../src/validate/jsonSchema.ts";

const registry = loadSchemaRegistry();

/** Deep clone helper for mutating fixture variants without a shared reference. */
function clone(v: JsonValue): JsonValue {
  return JSON.parse(JSON.stringify(v)) as JsonValue;
}

test("Stage 1 accepts a schema-valid inventory", () => {
  const r = stage1Schema(validInventory(), registry);
  assert.equal(r.verdict, "PASS", JSON.stringify(r.failures));
});

test("Stage 1 rejects an unknown property (additionalProperties:false, fail-closed)", () => {
  const raw = clone(validInventory());
  if (isObject(raw) && isObject(raw["contract"])) {
    (raw["contract"] as Record<string, JsonValue>)["bogusField"] = true;
  }
  const r = stage1Schema(raw, registry);
  assert.equal(r.verdict, "FAIL");
  assert.ok(r.failures.some((f) => f.reason.includes("additional property 'bogusField'")));
});

test("Stage 1 rejects an out-of-enum verb", () => {
  const raw = clone(validInventory());
  const contract = isObject(raw) ? raw["contract"] : undefined;
  const ops = isObject(contract) ? contract["operations"] : undefined;
  if (Array.isArray(ops) && isObject(ops[0])) {
    (ops[0] as Record<string, JsonValue>)["verbSemantics"] = "FETCH";
  }
  const r = stage1Schema(raw, registry);
  assert.equal(r.verdict, "FAIL");
  assert.ok(r.failures.some((f) => f.path.includes("verbSemantics")));
});

test("Stage 1 rejects a missing required field", () => {
  const raw = clone(validInventory());
  if (isObject(raw) && isObject(raw["contract"])) {
    delete (raw["contract"] as Record<string, JsonValue>)["title"];
  }
  const r = stage1Schema(raw, registry);
  assert.equal(r.verdict, "FAIL");
  assert.ok(r.failures.some((f) => f.reason.includes("missing required property 'title'")));
});

test("Stage 2 builds a canonical model with derived operationIds and kinds", () => {
  const r = stage2Model(validInventory());
  assert.equal(r.verdict, "PASS", JSON.stringify(r.failures));
  assert.ok(r.model);
  const ops = r.model?.contract.operations ?? [];
  assert.equal(ops.length, 2);
  assert.equal(ops[0]?.operationId, "getThingsById");
  assert.equal(ops[0]?.kind, "safe-read");
  assert.equal(ops[1]?.operationId, "postThings");
  assert.equal(ops[1]?.kind, "unsafe-create");
  // Unsafe op carries an opaque body placeholder; safe op does not.
  assert.equal(ops[1]?.request?.bodyRef, "NOT DEFINED IN CATALOG");
  assert.equal(ops[0]?.request?.bodyRef, undefined);
});

test("Stage 2 fails INV-DERIVED when catalog kind contradicts the derived kind", () => {
  const raw = clone(validInventory());
  const contract = isObject(raw) ? raw["contract"] : undefined;
  const ops = isObject(contract) ? contract["operations"] : undefined;
  if (Array.isArray(ops) && isObject(ops[0])) {
    (ops[0] as Record<string, JsonValue>)["kind"] = "unsafe-create"; // GET must be safe-read
  }
  const r = stage2Model(raw);
  assert.equal(r.verdict, "FAIL");
  assert.ok(r.failures.some((f) => f.reason.includes("INV-DERIVED")));
});

test("Stage 2 fails INV-OPID on a duplicate derived operationId", () => {
  const raw = clone(validInventory());
  const contract = isObject(raw) ? raw["contract"] : undefined;
  if (isObject(contract)) {
    (contract as Record<string, JsonValue>)["operations"] = [
      { verbSemantics: "GET", path: "/things", intent: "a", kind: "safe-read" },
      { verbSemantics: "GET", path: "/things", intent: "b", kind: "safe-read" },
    ];
  }
  const r = stage2Model(raw);
  assert.equal(r.verdict, "FAIL");
  assert.ok(r.failures.some((f) => f.reason.includes("INV-OPID")));
});

test("Stage 3 gates deferred field schemas to BLOCKED DTOs / PARTIAL clients", () => {
  const s2 = stage2Model(validInventory());
  assert.ok(s2.model);
  const s3 = stage3GeneratorInput(s2.model!);
  assert.equal(s3.targets.dtos, "BLOCKED");
  assert.equal(s3.targets.validators, "BLOCKED");
  assert.equal(s3.targets.clients, "PARTIAL");
  assert.equal(s3.targets.serverStubs, "PARTIAL");
  assert.ok(s3.notes.length > 0);
});

test("report folds any stage FAIL into a top-level FAIL and serializes deterministically", () => {
  const passing: ContractReport = {
    id: "A",
    sourceId: "a",
    stage1_schema: "PASS",
    stage2_model: "PASS",
    stage3_targets: { dtos: "BLOCKED", validators: "BLOCKED", clients: "PARTIAL", serverStubs: "PARTIAL" },
    failures: [],
    notes: [],
  };
  const failing: ContractReport = {
    ...passing,
    id: "B",
    sourceId: "b",
    stage1_schema: "FAIL",
    failures: [{ path: "/x", reason: "bad" }],
  };
  assert.equal(buildReport([passing], "ucos-contract-meta/1.0.0").verdict, "PASS");
  assert.equal(buildReport([passing, failing], "ucos-contract-meta/1.0.0").verdict, "FAIL");

  const report = buildReport([passing], "ucos-contract-meta/1.0.0");
  const a = serializeReport(report);
  const b = serializeReport(report);
  assert.equal(a, b, "serialization is deterministic");
  assert.ok(!/\d{4}-\d{2}-\d{2}T/.test(a), "no ISO timestamps embedded");
});
