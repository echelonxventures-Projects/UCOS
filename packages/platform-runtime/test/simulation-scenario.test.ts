/**
 * PI-11 Wave W1 — Scenario engine: C3/C4 lifecycle, authority caps, civilization ⇒ Board (SGP-9),
 * in-sandbox intervention + budget enforcement.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSimulation, mintSnapshot, registerAuthority, standardScenario, simpleConstraintSet, DEFAULT_BUDGET } from "./simulation-harness.ts";
import { SimulationError } from "../src/control/simulation/types.ts";

function boundTwin(h: ReturnType<typeof buildSimulation>, twinId = "twin-1"): void {
  h.sim.twins.define(twinId, "target:app.orders");
  const snap = mintSnapshot(h.authKeyPriv, { targetRef: "target:app.orders", state: { count: 10, integrity: true }, keyRef: h.authKeyRef });
  h.sim.twins.bind(twinId, snap);
}

test("author → authorize → activate a standard scenario", () => {
  const h = buildSimulation();
  const auth = registerAuthority(h);
  boundTwin(h);
  h.sim.scenarios.author(standardScenario({ authorityId: auth.authorityId, twinId: "twin-1", constraintSetId: "cs-1" }));
  const authorized = h.sim.scenarios.authorize("scn-1");
  assert.equal(authorized.state, "authorized");
  const active = h.sim.scenarios.activate("scn-1");
  assert.equal(active.state, "active");
});

test("authoring with an authority lacking the 'scenario' power is denied", () => {
  const h = buildSimulation();
  const auth = registerAuthority(h, { authorityId: "no-scn", powers: ["decision"] });
  boundTwin(h);
  assert.throws(
    () => h.sim.scenarios.author(standardScenario({ authorityId: auth.authorityId, twinId: "twin-1", constraintSetId: "cs-1" })),
    (e: unknown) => e instanceof SimulationError && e.code === "SIMULATION_DENIED",
  );
});

test("a scenario whose class exceeds the authority's class cap is denied", () => {
  const h = buildSimulation();
  const auth = registerAuthority(h, { authorityId: "low", maxClass: "public" });
  boundTwin(h);
  h.sim.scenarios.author(standardScenario({ authorityId: auth.authorityId, twinId: "twin-1", constraintSetId: "cs-1", classification: "confidential" }));
  assert.throws(
    () => h.sim.scenarios.authorize("scn-1"),
    (e: unknown) => e instanceof SimulationError && e.code === "SIMULATION_DENIED",
  );
});

test("an over-scope scenario (outside the authority scope glob) is denied", () => {
  const h = buildSimulation();
  const auth = registerAuthority(h, { authorityId: "scoped", scope: "scenario:standard:allowed-*" });
  boundTwin(h);
  h.sim.scenarios.author(standardScenario({ scenarioId: "scn-denied", authorityId: auth.authorityId, twinId: "twin-1", constraintSetId: "cs-1" }));
  assert.throws(
    () => h.sim.scenarios.authorize("scn-denied"),
    (e: unknown) => e instanceof SimulationError && e.code === "SIMULATION_DENIED",
  );
});

test("a civilization-class scenario without Board authorization is denied (SGP-9, S11)", () => {
  const h = buildSimulation();
  const auth = registerAuthority(h, { maxClass: "secret" });
  boundTwin(h);
  h.sim.scenarios.author({
    scenarioId: "civ-1",
    authorityId: auth.authorityId,
    twinId: "twin-1",
    class: "civilization",
    interventions: [{ path: "count", value: 1 }],
    budget: DEFAULT_BUDGET,
    constraintSetId: "cs-1",
    classification: "secret",
  });
  assert.throws(
    () => h.sim.scenarios.authorize("civ-1"),
    (e: unknown) => e instanceof SimulationError && e.code === "SCOPE_VIOLATION",
  );
  // With Board authorization it is permitted.
  const ok = h.sim.scenarios.authorize("civ-1", { boardAuthorization: "AUTH-BOARD-CIV-1" });
  assert.equal(ok.state, "authorized");
});

test("interventions materialize ONLY inside the run sandbox (non-actuation)", () => {
  const h = buildSimulation();
  const auth = registerAuthority(h);
  boundTwin(h);
  h.sim.scenarios.author(standardScenario({ authorityId: auth.authorityId, twinId: "twin-1", constraintSetId: "cs-1", interventions: [{ path: "count", value: 42 }] }));
  h.sim.scenarios.authorize("scn-1");
  h.sim.scenarios.activate("scn-1");
  const sb = h.sim.sandbox.allocate("run-1");
  const state = h.sim.scenarios.materialize("run-1", "scn-1", { count: 10, integrity: true }, sb);
  assert.equal(state.count, 42);
  // Governed substrate metadata is untouched by the intervention.
  assert.equal(h.substrate.metadata.get("target:app.orders"), undefined);
  assert.equal(sb.size(), 1);
});

test("exceeding the step budget aborts (S5, BUDGET_EXCEEDED)", () => {
  const h = buildSimulation();
  const auth = registerAuthority(h);
  boundTwin(h);
  const many = Array.from({ length: 5 }, (_, i) => ({ path: `k${i}`, value: i }));
  h.sim.scenarios.author({
    scenarioId: "scn-budget",
    authorityId: auth.authorityId,
    twinId: "twin-1",
    class: "standard",
    interventions: many,
    budget: { maxHorizon: 100, maxSteps: 3, maxEntities: 1000, maxWallMs: 5000 },
    constraintSetId: "cs-1",
    classification: "internal",
  });
  h.sim.scenarios.authorize("scn-budget");
  h.sim.scenarios.activate("scn-budget");
  const sb = h.sim.sandbox.allocate("run-b");
  assert.throws(
    () => h.sim.scenarios.materialize("run-b", "scn-budget", {}, sb),
    (e: unknown) => e instanceof SimulationError && e.code === "BUDGET_EXCEEDED",
  );
});

// keep simpleConstraintSet import used (constraint sets referenced by id in scenarios).
void simpleConstraintSet;
