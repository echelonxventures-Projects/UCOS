import { test } from "node:test";
import assert from "node:assert/strict";
import { LayeredConfigurationStore } from "../src/configuration-runtime/configuration-store.ts";

test("merges layers in order (later wins)", () => {
  const config = new LayeredConfigurationStore(["default", "environment", "instance"]);
  config.setLayer("default", "cap.a", { salutation: "Hello", retries: 1 });
  config.setLayer("environment", "cap.a", { salutation: "Hi" });
  config.setLayer("instance", "cap.a", { retries: 5 });
  assert.deepEqual(config.resolve("cap.a"), { salutation: "Hi", retries: 5 });
});

test("deep-merges nested objects", () => {
  const config = new LayeredConfigurationStore();
  config.setLayer("default", "cap.a", { limits: { soft: 1, hard: 2 } });
  config.setLayer("environment", "cap.a", { limits: { hard: 9 } });
  assert.deepEqual(config.resolve("cap.a"), { limits: { soft: 1, hard: 9 } });
});

test("unknown capability resolves to empty config", () => {
  const config = new LayeredConfigurationStore();
  assert.deepEqual(config.resolve("cap.missing"), {});
});

test("unknown layers are appended and applied", () => {
  const config = new LayeredConfigurationStore(["default"]);
  config.setLayer("default", "cap.a", { a: 1 });
  config.setLayer("override", "cap.a", { a: 2 });
  assert.equal(config.layers().includes("override"), true);
  assert.deepEqual(config.resolve("cap.a"), { a: 2 });
});
