import { test } from "node:test";
import assert from "node:assert/strict";
import { TrustEvaluator } from "../src/control/trust/trust-evaluator.ts";
import type { IdentityRecord, TrustAuthority } from "../src/control/types.ts";

const base: IdentityRecord = { id: "u1", kind: "user", status: "active", permissions: [] };

test("resolves the local trust level (default 0)", () => {
  const t = new TrustEvaluator();
  assert.equal(t.resolveLevel(base), 0);
  assert.equal(t.resolveLevel({ ...base, trust: { level: 3 } }), 3);
});

test("evaluates minLevel requirements", () => {
  const t = new TrustEvaluator();
  const id = { ...base, trust: { level: 5 } };
  assert.equal(t.evaluate(id, { minLevel: 5 }).ok, true);
  const fail = t.evaluate(id, { minLevel: 7 });
  assert.equal(fail.ok, false);
  assert.match(fail.reason, /trust level 5 < required 7/);
});

test("evaluates trust attribute requirements", () => {
  const t = new TrustEvaluator();
  const id = { ...base, trust: { level: 1, attributes: { region: "eu", verified: true } } };
  assert.equal(t.evaluate(id, { attributes: { region: "eu" } }).ok, true);
  assert.equal(t.evaluate(id, { attributes: { region: "us" } }).ok, false);
});

test("federated trust authority can raise the effective level (max wins)", () => {
  const t = new TrustEvaluator();
  const authority: TrustAuthority = { name: "fed", levelFor: (id) => (id === "u1" ? 9 : undefined) };
  t.registerAuthority(authority);
  assert.equal(t.resolveLevel({ ...base, trust: { level: 2 } }), 9);
  // A lower federated level never lowers the local level.
  const lower: TrustAuthority = { name: "lo", levelFor: () => 1 };
  const t2 = new TrustEvaluator();
  t2.registerAuthority(lower);
  assert.equal(t2.resolveLevel({ ...base, trust: { level: 4 } }), 4);
});
