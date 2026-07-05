/**
 * PI-11 Wave W2 — Constraint evaluator: C6 hard/soft + preserved-invariant checks; `invalid`
 * non-promotable; absent `ontology:*` surface ⇒ deny (FDG-ONT).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { ConstraintEvaluator } from "../src/control/simulation/constraint-evaluator.ts";
import { SimulationAuditLog } from "../src/control/simulation/simulation-audit-log.ts";
import type { ConstraintSet } from "../src/control/simulation/types.ts";
import { SimulationError } from "../src/control/simulation/types.ts";
import { simpleConstraintSet } from "./simulation-harness.ts";

test("a satisfied constraint set passes (ok=true)", () => {
  const ev = new ConstraintEvaluator();
  const res = ev.check({ count: 50, integrity: true }, simpleConstraintSet());
  assert.equal(res.ok, true);
  assert.equal(res.hardFailures.length, 0);
  assert.equal(res.invariantFailures.length, 0);
});

test("a hard-constraint failure ⇒ ok=false (non-promotable, S4)", () => {
  const ev = new ConstraintEvaluator();
  const res = ev.check({ count: 5000, integrity: true }, simpleConstraintSet());
  assert.equal(res.ok, false);
  assert.deepEqual(res.hardFailures, ["h1"]);
});

test("a preserved-invariant failure ⇒ ok=false", () => {
  const ev = new ConstraintEvaluator();
  const res = ev.check({ count: 5, integrity: false }, simpleConstraintSet());
  assert.equal(res.ok, false);
  assert.deepEqual(res.invariantFailures, ["inv1"]);
});

test("a soft-constraint miss is a warning, not a failure", () => {
  const ev = new ConstraintEvaluator();
  const res = ev.check({ count: 500, integrity: true }, simpleConstraintSet());
  assert.equal(res.ok, true);
  assert.deepEqual(res.softWarnings, ["s1"]);
});

test("a constraint referencing an unbound ontology:* surface is DENIED, never skipped (FDG-ONT)", () => {
  const audit = new SimulationAuditLog("node-local");
  const ev = new ConstraintEvaluator({ sink: audit, ontologyBound: false });
  const set: ConstraintSet = {
    constraintSetId: "cs-onto",
    hard: [{ id: "onto-h", kind: "hard", path: "type", op: "eq", bound: "Order", ontologyRef: "ontology:type:Order" }],
    soft: [],
    preservedInvariants: [],
  };
  assert.throws(
    () => ev.check({ type: "Order" }, set),
    (e: unknown) => e instanceof SimulationError && e.code === "FDG_UNBOUND",
  );
});
