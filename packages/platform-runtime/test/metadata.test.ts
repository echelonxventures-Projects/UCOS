import { test } from "node:test";
import assert from "node:assert/strict";
import { InMemoryMetadataStore } from "../src/metadata-runtime/metadata-store.ts";
import { ValidationError } from "../src/meta-core/errors.ts";
import type { JsonSchema } from "../src/contracts/types.ts";

test("put / get / query by prefix", () => {
  const store = new InMemoryMetadataStore();
  store.put("capability:a@1.0.0", { id: "a" });
  store.put("capability:b@1.0.0", { id: "b" });
  store.put("contract:c@1.0.0", { id: "c" });
  assert.equal(store.get("capability:a@1.0.0")?.value !== undefined, true);
  assert.equal(store.query("capability:").length, 2);
  assert.equal(store.query("contract:").length, 1);
});

test("validateOnWrite rejects invalid values", () => {
  const schema: JsonSchema = { type: "object", required: ["x"], properties: { x: { type: "string" } } };
  const store = new InMemoryMetadataStore({ validateOnWrite: true });
  assert.throws(() => store.put("k", {}, schema), ValidationError);
});

test("validate exposes issues without throwing", () => {
  const store = new InMemoryMetadataStore();
  const result = store.validate({ x: 1 }, { type: "object", properties: { x: { type: "string" } } });
  assert.equal(result.valid, false);
  assert.equal(result.issues.length > 0, true);
});
