import { test } from "node:test";
import assert from "node:assert/strict";
import { InMemoryRegistry } from "../src/registry-runtime/registry.ts";
import { SubstrateError } from "../src/meta-core/errors.ts";
import type { RegistryRecord } from "../src/meta-core/ports.ts";

function contractRecord(id: string, version: string): RegistryRecord {
  return {
    id,
    version,
    kind: "contract",
    descriptor: { kind: "contract", id, version, operations: [] },
  };
}

test("register / get / list", () => {
  const registry = new InMemoryRegistry();
  registry.register(contractRecord("c", "1.0.0"));
  assert.equal(registry.get("c", "1.0.0")?.id, "c");
  assert.equal(registry.list("contract").length, 1);
  assert.equal(registry.list("capability").length, 0);
});

test("resolve returns highest satisfying version", () => {
  const registry = new InMemoryRegistry();
  registry.register(contractRecord("c", "1.0.0"));
  registry.register(contractRecord("c", "1.4.0"));
  registry.register(contractRecord("c", "2.0.0"));
  assert.equal(registry.resolve("c", "^1.0.0")?.version, "1.4.0");
  assert.equal(registry.resolve("c", "*")?.version, "2.0.0");
  assert.equal(registry.resolve("c", "^3.0.0"), undefined);
});

test("has honors range", () => {
  const registry = new InMemoryRegistry();
  registry.register(contractRecord("c", "1.0.0"));
  assert.equal(registry.has("c"), true);
  assert.equal(registry.has("c", "^1.0.0"), true);
  assert.equal(registry.has("c", "^2.0.0"), false);
  assert.equal(registry.has("missing"), false);
});

test("duplicate registration is a conflict", () => {
  const registry = new InMemoryRegistry();
  registry.register(contractRecord("c", "1.0.0"));
  assert.throws(() => registry.register(contractRecord("c", "1.0.0")), (error: unknown) => error instanceof SubstrateError && error.code === "REGISTRY_CONFLICT");
});

test("invalid version rejected", () => {
  const registry = new InMemoryRegistry();
  assert.throws(() => registry.register(contractRecord("c", "1.0")), SubstrateError);
});

test("unregister removes the record", () => {
  const registry = new InMemoryRegistry();
  registry.register(contractRecord("c", "1.0.0"));
  registry.unregister("c", "1.0.0");
  assert.equal(registry.has("c"), false);
});
