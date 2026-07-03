import { test } from "node:test";
import assert from "node:assert/strict";
import { validateAgainstSchema } from "../src/metadata-runtime/schema-validator.ts";
import type { JsonSchema } from "../src/contracts/types.ts";

test("validates a well-formed object", () => {
  const schema: JsonSchema = {
    type: "object",
    required: ["name"],
    properties: { name: { type: "string", minLength: 1 }, age: { type: "integer", minimum: 0 } },
    additionalProperties: false,
  };
  assert.equal(validateAgainstSchema({ name: "ucos", age: 1 }, schema).valid, true);
});

test("reports missing required property", () => {
  const schema: JsonSchema = { type: "object", required: ["name"], properties: { name: { type: "string" } } };
  const result = validateAgainstSchema({}, schema);
  assert.equal(result.valid, false);
  assert.equal(result.issues[0]?.path, "name");
});

test("reports type mismatch", () => {
  const result = validateAgainstSchema({ age: "x" }, { type: "object", properties: { age: { type: "integer" } } });
  assert.equal(result.valid, false);
});

test("rejects additional properties when disallowed", () => {
  const schema: JsonSchema = { type: "object", properties: { a: { type: "string" } }, additionalProperties: false };
  assert.equal(validateAgainstSchema({ a: "x", b: 1 }, schema).valid, false);
});

test("validates enum and const", () => {
  assert.equal(validateAgainstSchema("b", { enum: ["a", "b"] }).valid, true);
  assert.equal(validateAgainstSchema("c", { enum: ["a", "b"] }).valid, false);
  assert.equal(validateAgainstSchema("capability", { const: "capability" }).valid, true);
});

test("validates arrays and numeric bounds", () => {
  const schema: JsonSchema = { type: "array", items: { type: "number", maximum: 10 } };
  assert.equal(validateAgainstSchema([1, 2, 3], schema).valid, true);
  assert.equal(validateAgainstSchema([1, 99], schema).valid, false);
});

test("validates string length and pattern", () => {
  assert.equal(validateAgainstSchema("ab", { type: "string", minLength: 3 }).valid, false);
  assert.equal(validateAgainstSchema("abc", { type: "string", pattern: "^a" }).valid, true);
});
