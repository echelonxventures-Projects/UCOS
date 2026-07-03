import { test } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { createSubstrate } from "../src/bootstrap.ts";
import { ExecutionError, LifecycleViolationError } from "../src/meta-core/errors.ts";

const DESCRIPTOR_DIR = join(import.meta.dirname, "../examples/descriptors");

test("loads example descriptors from the filesystem and composes them", async () => {
  const { kernel } = createSubstrate();
  await kernel.bootstrap({ directory: DESCRIPTOR_DIR });
  const report = kernel.report();

  assert.equal(report.contracts.length, 1);
  assert.equal(report.capabilities.length, 2);
  assert.ok(report.order.indexOf("cap.greeting@1.0.0") < report.order.indexOf("cap.shout@1.0.0"));
  assert.equal(kernel.state("cap.greeting"), "active");
  assert.equal(kernel.state("cap.shout"), "active");
});

test("executes capabilities and composed dependents through their contract", async () => {
  const { kernel } = createSubstrate();
  await kernel.bootstrap({ directory: DESCRIPTOR_DIR });
  assert.equal(await kernel.execute("cap.greeting", "produce", { subject: "UCOS" }), "Hello, UCOS!");
  assert.equal(await kernel.execute("cap.shout", "produce", { subject: "UCOS" }), "HELLO, UCOS!");
});

test("configuration layers override defaults without code change", async () => {
  const { kernel } = createSubstrate();
  await kernel.loadDirectory(DESCRIPTOR_DIR);
  kernel.setConfig("environment", "cap.greeting", { salutation: "Hi" });
  await kernel.compose();
  assert.equal(await kernel.execute("cap.greeting", "produce", { subject: "UCOS" }), "Hi, UCOS!");
});

test("rejects input that violates the contract", async () => {
  const { kernel } = createSubstrate();
  await kernel.bootstrap({ directory: DESCRIPTOR_DIR });
  await assert.rejects(
    () => kernel.execute("cap.greeting", "produce", { subject: 123 }),
    ExecutionError,
  );
});

test("rejects operations not declared in the contract", async () => {
  const { kernel } = createSubstrate();
  await kernel.bootstrap({ directory: DESCRIPTOR_DIR });
  await assert.rejects(() => kernel.execute("cap.greeting", "undeclared", {}), ExecutionError);
});

test("cannot execute before composition", async () => {
  const { kernel } = createSubstrate();
  await kernel.loadDirectory(DESCRIPTOR_DIR);
  await assert.rejects(() => kernel.execute("cap.greeting", "produce", {}), (error: unknown) => error instanceof Error);
  // and executing a non-composed capability id after compose is a lifecycle/execution error
  await kernel.compose();
  await assert.rejects(() => kernel.execute("cap.missing", "produce", {}), (error: unknown) => error instanceof ExecutionError || error instanceof LifecycleViolationError);
});
