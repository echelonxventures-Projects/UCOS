/**
 * PI-11 Wave W3 — Impact analyzer: C9 deltas/risks, recommendation, advisory-only (0 governed side
 * effects), and classification inheritance / leak prevention (S6).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSimulation } from "./simulation-harness.ts";
import type { ProjectionRecord, ConstraintResult } from "../src/control/simulation/types.ts";
import { SimulationError } from "../src/control/simulation/types.ts";

function projection(overrides: Partial<ProjectionRecord> = {}): ProjectionRecord {
  return {
    projectionId: "p1",
    runId: "run-1",
    projectedState: { count: 25, integrity: true },
    reproducibility: { snapshotHash: "s", scenarioHash: "sc", modelId: "m", seed: "seed", constraintSetId: "cs-1", policyHash: "p0" },
    projectionHash: "hash",
    rationale: "deterministic projection",
    classification: "internal",
    valid: true,
    ...overrides,
  };
}

const okConstraint: ConstraintResult = { ok: true, hardFailures: [], softWarnings: [], invariantFailures: [] };

test("valid projection + passing constraints ⇒ adopt-proposal, advisory-only", () => {
  const h = buildSimulation();
  const impact = h.sim.impact.assess({ impactId: "i1", runId: "run-1", baselineState: { count: 10, integrity: true }, projection: projection(), constraintResult: okConstraint, baselineClass: "internal" });
  assert.equal(impact.recommendation, "adopt-proposal");
  assert.equal(impact.advisory, true);
  assert.ok(impact.deltas.some((d) => d.path === "count"));
  // Advisory-only: nothing was committed to the substrate registry (no capability/contract added).
  assert.equal(h.substrate.registry.list().length, 0);
});

test("invalid projection ⇒ reject", () => {
  const h = buildSimulation();
  const impact = h.sim.impact.assess({ impactId: "i2", runId: "run-1", baselineState: {}, projection: projection({ valid: false }), constraintResult: okConstraint, baselineClass: "internal" });
  assert.equal(impact.recommendation, "reject");
});

test("failing hard constraints ⇒ reject with a hard-constraint risk", () => {
  const h = buildSimulation();
  const failing: ConstraintResult = { ok: false, hardFailures: ["h1"], softWarnings: [], invariantFailures: [] };
  const impact = h.sim.impact.assess({ impactId: "i3", runId: "run-1", baselineState: {}, projection: projection(), constraintResult: failing, baselineClass: "internal" });
  assert.equal(impact.recommendation, "reject");
  assert.ok(impact.risks.includes("hard-constraint:h1"));
});

test("soft warnings ⇒ inconclusive", () => {
  const h = buildSimulation();
  const soft: ConstraintResult = { ok: true, hardFailures: [], softWarnings: ["s1"], invariantFailures: [] };
  const impact = h.sim.impact.assess({ impactId: "i4", runId: "run-1", baselineState: {}, projection: projection(), constraintResult: soft, baselineClass: "internal" });
  assert.equal(impact.recommendation, "inconclusive");
});

test("impact inherits MAX class of inputs; emitting below inherited class is denied (S6)", () => {
  const h = buildSimulation();
  const proj = projection({ classification: "confidential" });
  // Inherited = max(secret baseline, confidential projection) = secret; emitting at 'internal' leaks.
  assert.throws(
    () => h.sim.impact.assess({ impactId: "i5", runId: "run-1", baselineState: {}, projection: proj, constraintResult: okConstraint, baselineClass: "secret", emitClass: "internal" }),
    (e: unknown) => e instanceof SimulationError && e.code === "CLASSIFICATION_LEAK",
  );
  const okImpact = h.sim.impact.assess({ impactId: "i6", runId: "run-1", baselineState: {}, projection: proj, constraintResult: okConstraint, baselineClass: "secret" });
  assert.equal(okImpact.classification, "secret");
});
