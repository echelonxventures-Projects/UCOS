/**
 * PI-11 Wave W2 — Projection engine: C8 deterministic stepping, re-derivability from the reproducibility
 * tuple, and non-deterministic model rejection (FDG-INT).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSimulation, mintSnapshot, registerAuthority, standardScenario } from "./simulation-harness.ts";
import { deterministicModel } from "../src/control/simulation/predictive-adapter.ts";
import type { PredictiveModel } from "../src/control/simulation/types.ts";
import { SimulationError } from "../src/control/simulation/types.ts";

function setup(h: ReturnType<typeof buildSimulation>) {
  const auth = registerAuthority(h);
  h.sim.twins.define("twin-1", "target:app.orders");
  const snap = mintSnapshot(h.authKeyPriv, { targetRef: "target:app.orders", state: { count: 10, integrity: true }, keyRef: h.authKeyRef });
  h.sim.twins.bind("twin-1", snap);
  h.sim.adapter.register(deterministicModel("m-inc", (baseline) => ({ count: Number(baseline.count ?? 0) + 5, integrity: true })));
  h.sim.scenarios.author(standardScenario({ authorityId: auth.authorityId, twinId: "twin-1", constraintSetId: "cs-1", interventions: [{ path: "count", value: 20 }] }));
  h.sim.scenarios.authorize("scn-1");
  h.sim.scenarios.activate("scn-1");
  return { snap, scenario: h.sim.registry.getScenario("scn-1")! };
}

test("deterministic projection produces a valid, reproducible projection", async () => {
  const h = buildSimulation();
  const { snap, scenario } = setup(h);
  const sb = h.sim.sandbox.allocate("run-1");
  const materialized = h.sim.scenarios.materialize("run-1", "scn-1", snap.state, sb);
  const proj = await h.sim.projection.project({
    runId: "run-1", projectionId: "proj-1", snapshot: snap, scenario, materializedState: materialized, modelId: "m-inc", seed: "seed-a", policyHash: "policy-0",
  });
  assert.equal(proj.valid, true);
  assert.equal(proj.projectedState.count, 25); // intervention 20 → model +5
  assert.ok(proj.rationale.length > 0);
  assert.ok(proj.projectionHash);
});

test("same inputs ⇒ identical projectionHash (re-derivable, A2)", async () => {
  const h = buildSimulation();
  const { snap, scenario } = setup(h);
  const sb1 = h.sim.sandbox.allocate("run-A");
  const m1 = h.sim.scenarios.materialize("run-A", "scn-1", snap.state, sb1);
  const p1 = await h.sim.projection.project({ runId: "run-A", projectionId: "p1", snapshot: snap, scenario, materializedState: m1, modelId: "m-inc", seed: "seed-a", policyHash: "policy-0" });
  const sb2 = h.sim.sandbox.allocate("run-B");
  const m2 = h.sim.scenarios.materialize("run-B", "scn-1", snap.state, sb2);
  const p2 = await h.sim.projection.project({ runId: "run-B", projectionId: "p2", snapshot: snap, scenario, materializedState: m2, modelId: "m-inc", seed: "seed-a", policyHash: "policy-0" });
  assert.equal(p1.projectionHash, p2.projectionHash);
});

test("a different seed ⇒ different reproducibility tuple", async () => {
  const h = buildSimulation();
  const { snap, scenario } = setup(h);
  const sb = h.sim.sandbox.allocate("run-C");
  const m = h.sim.scenarios.materialize("run-C", "scn-1", snap.state, sb);
  const p1 = await h.sim.projection.project({ runId: "run-C", projectionId: "p1", snapshot: snap, scenario, materializedState: m, modelId: "m-inc", seed: "seed-a", policyHash: "policy-0" });
  const p2 = await h.sim.projection.project({ runId: "run-C", projectionId: "p2", snapshot: snap, scenario, materializedState: m, modelId: "m-inc", seed: "seed-b", policyHash: "policy-0" });
  assert.notEqual(p1.reproducibility.seed, p2.reproducibility.seed);
});

test("registering a non-deterministic model is denied (FDG-INT)", () => {
  const h = buildSimulation();
  const nonDet: PredictiveModel = {
    modelId: "m-nd",
    kind: "non-deterministic",
    async forecast() {
      return { modelId: "m-nd", output: {}, deterministic: false };
    },
  };
  assert.throws(
    () => h.sim.adapter.register(nonDet),
    (e: unknown) => e instanceof SimulationError && e.code === "FDG_UNBOUND",
  );
});

test("projection classification inherits the MAX of its inputs (S6)", async () => {
  const h = buildSimulation();
  const auth = registerAuthority(h, { maxClass: "secret" });
  h.sim.twins.define("twin-c", "target:x");
  const snap = mintSnapshot(h.authKeyPriv, { targetRef: "target:x", state: { count: 1, integrity: true }, keyRef: h.authKeyRef, classification: "confidential" });
  h.sim.twins.bind("twin-c", snap);
  h.sim.adapter.register(deterministicModel("m-id", (b) => ({ ...b })));
  h.sim.scenarios.author(standardScenario({ authorityId: auth.authorityId, twinId: "twin-c", constraintSetId: "cs-1", classification: "internal" }));
  h.sim.scenarios.authorize("scn-1");
  h.sim.scenarios.activate("scn-1");
  const scenario = h.sim.registry.getScenario("scn-1")!;
  const sb = h.sim.sandbox.allocate("run-x");
  const m = h.sim.scenarios.materialize("run-x", "scn-1", snap.state, sb);
  const proj = await h.sim.projection.project({ runId: "run-x", projectionId: "p", snapshot: snap, scenario, materializedState: m, modelId: "m-id", seed: "s", policyHash: "p0" });
  assert.equal(proj.classification, "confidential"); // max(confidential, internal)
});
