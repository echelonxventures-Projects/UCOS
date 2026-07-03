import { test } from "node:test";
import assert from "node:assert/strict";
import { createSubstrate } from "../src/bootstrap.ts";
import { DependencyCycleError, ResolutionError } from "../src/meta-core/errors.ts";
import type { Descriptor } from "../src/contracts/types.ts";

const contract: Descriptor = {
  kind: "contract",
  id: "contract.noop",
  version: "1.0.0",
  operations: [{ name: "run", input: { type: "object" }, output: { type: "object" } }],
};

function capability(id: string, deps: string[] = []): Descriptor {
  return {
    kind: "capability",
    id,
    version: "1.0.0",
    name: id,
    contract: { id: "contract.noop", versionRange: "^1.0.0" },
    provider: { module: "plugin:noop", export: "create" },
    dependencies: deps.map((capabilityId) => ({ capabilityId, versionRange: "^1.0.0" })),
  };
}

test("resolves dependencies before dependents", () => {
  const { kernel } = createSubstrate();
  kernel.loadDescriptors([contract, capability("cap.a", ["cap.b"]), capability("cap.b", ["cap.c"]), capability("cap.c")]);
  const order = kernel.resolve().map((record) => record.id);
  assert.ok(order.indexOf("cap.c") < order.indexOf("cap.b"));
  assert.ok(order.indexOf("cap.b") < order.indexOf("cap.a"));
});

test("detects dependency cycles", () => {
  const { kernel } = createSubstrate();
  kernel.loadDescriptors([contract, capability("cap.x", ["cap.y"]), capability("cap.y", ["cap.x"])]);
  assert.throws(() => kernel.resolve(), DependencyCycleError);
});

test("reports missing dependency", () => {
  const { kernel } = createSubstrate();
  kernel.loadDescriptors([contract, capability("cap.m", ["cap.absent"])]);
  assert.throws(() => kernel.resolve(), ResolutionError);
});

test("reports unresolved contract", () => {
  const { kernel } = createSubstrate();
  kernel.loadDescriptors([capability("cap.orphan")]);
  assert.throws(() => kernel.resolve(), ResolutionError);
});
