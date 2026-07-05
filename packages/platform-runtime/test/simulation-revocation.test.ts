/**
 * PI-11 Wave W3 — Revocation authority: C10 forward-only, fail-closed propagation across
 * twin/scenario/model/run/result.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSimulation } from "./simulation-harness.ts";
import { SimulationError } from "../src/control/simulation/types.ts";

test("revoking an artifact makes it isRevoked and blocks assertNoneRevoked", () => {
  const h = buildSimulation();
  h.sim.revocations.revoke("scenario", "scn-1", "revocation-authority", "policy breach");
  assert.equal(h.sim.revocations.isRevoked("scenario", "scn-1"), true);
  assert.throws(
    () => h.sim.revocations.assertNoneRevoked([{ kind: "scenario", id: "scn-1" }]),
    (e: unknown) => e instanceof SimulationError && e.code === "SIMULATION_DENIED",
  );
});

test("revocation propagates across the artifact chain (twin/model/run/result)", () => {
  const h = buildSimulation();
  h.sim.revocations.revoke("twin", "twin-1");
  h.sim.revocations.revoke("model", "m-1");
  h.sim.revocations.revoke("run", "run-1");
  h.sim.revocations.revoke("result", "proj-1");
  for (const [kind, id] of [["twin", "twin-1"], ["model", "m-1"], ["run", "run-1"], ["result", "proj-1"]] as const) {
    assert.equal(h.sim.revocations.isRevoked(kind, id), true);
  }
});

test("revocation is durable in the reserved simulation:revoked namespace", () => {
  const h = buildSimulation();
  h.sim.revocations.revoke("run", "run-42");
  const raw = h.substrate.metadata.get("simulation:revoked:run:run-42");
  assert.ok(raw, "revocation marker persisted under simulation:revoked:*");
});

test("revocation is forward-only (no un-revoke method exists)", () => {
  const h = buildSimulation();
  const rev = h.sim.revocations as unknown as Record<string, unknown>;
  for (const forbidden of ["unrevoke", "restore", "clear", "reinstate"]) {
    assert.equal(typeof rev[forbidden], "undefined", `revocation must not expose ${forbidden}`);
  }
});

test("a not-revoked artifact passes assertNoneRevoked", () => {
  const h = buildSimulation();
  h.sim.revocations.assertNoneRevoked([{ kind: "run", id: "clean-run" }]);
});
