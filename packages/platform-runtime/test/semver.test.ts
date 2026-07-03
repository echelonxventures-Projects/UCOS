import { test } from "node:test";
import assert from "node:assert/strict";
import { compareVersions, maxSatisfying, satisfies, isValidVersion } from "../src/meta-core/semver.ts";

test("isValidVersion accepts and rejects", () => {
  assert.equal(isValidVersion("1.2.3"), true);
  assert.equal(isValidVersion("1.2"), false);
  assert.equal(isValidVersion("v1.2.3"), false);
});

test("compareVersions orders correctly", () => {
  assert.equal(compareVersions("1.0.0", "1.0.1"), -1);
  assert.equal(compareVersions("2.0.0", "1.9.9"), 1);
  assert.equal(compareVersions("1.2.3", "1.2.3"), 0);
});

test("satisfies handles exact, caret, gte and wildcard", () => {
  assert.equal(satisfies("1.2.3", "1.2.3"), true);
  assert.equal(satisfies("1.2.4", "1.2.3"), false);
  assert.equal(satisfies("1.5.0", "^1.2.0"), true);
  assert.equal(satisfies("2.0.0", "^1.2.0"), false);
  assert.equal(satisfies("1.2.0", ">=1.0.0"), true);
  assert.equal(satisfies("0.9.0", ">=1.0.0"), false);
  assert.equal(satisfies("9.9.9", "*"), true);
  assert.equal(satisfies("9.9.9", ""), true);
});

test("caret respects 0.x semantics", () => {
  assert.equal(satisfies("0.2.9", "^0.2.3"), true);
  assert.equal(satisfies("0.3.0", "^0.2.3"), false);
});

test("maxSatisfying returns the highest matching version", () => {
  assert.equal(maxSatisfying(["1.0.0", "1.2.0", "1.4.0", "2.0.0"], "^1.0.0"), "1.4.0");
  assert.equal(maxSatisfying(["1.0.0", "2.0.0"], "^3.0.0"), undefined);
});
