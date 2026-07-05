/**
 * PI-11 Wave W1 — Digital twin: signed-snapshot bind/verify/expiry, `stale` fail-closed, non-actuation,
 * and the inert FDG-MEM seam.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSimulation, mintSnapshot } from "./simulation-harness.ts";
import { SimulationError } from "../src/control/simulation/types.ts";

test("bind a twin to a valid signed snapshot => active", () => {
  const h = buildSimulation();
  h.sim.twins.define("twin-1", "target:app.orders");
  const snap = mintSnapshot(h.authKeyPriv, { targetRef: "target:app.orders", state: { count: 10 }, keyRef: h.authKeyRef });
  const rec = h.sim.twins.bind("twin-1", snap);
  assert.equal(rec.state, "active");
  assert.ok(rec.snapshotHash);
  const baseline = h.sim.twins.baseline("twin-1");
  assert.deepEqual(baseline.state, { count: 10 });
});

test("an unsigned or tampered snapshot is rejected (S2, SNAPSHOT_INVALID)", () => {
  const h = buildSimulation();
  h.sim.twins.define("twin-2", "target:x");
  const snap = mintSnapshot(h.authKeyPriv, { targetRef: "target:x", state: { count: 1 }, keyRef: h.authKeyRef });
  // Tamper with the state after signing.
  const tampered = { ...snap, state: { count: 999 } };
  assert.throws(
    () => h.sim.twins.bind("twin-2", tampered),
    (e: unknown) => e instanceof SimulationError && e.code === "SNAPSHOT_INVALID",
  );
});

test("an expired snapshot is rejected (S7, SNAPSHOT_INVALID)", () => {
  const h = buildSimulation();
  h.sim.twins.define("twin-3", "target:x");
  const past = Date.now() - 10_000;
  const snap = mintSnapshot(h.authKeyPriv, { targetRef: "target:x", state: {}, keyRef: h.authKeyRef, issuedAt: past - 1000, expiresAt: past });
  assert.throws(
    () => h.sim.twins.bind("twin-3", snap),
    (e: unknown) => e instanceof SimulationError && e.code === "SNAPSHOT_INVALID",
  );
});

test("replaying a snapshot nonce is rejected (S7)", () => {
  const h = buildSimulation();
  h.sim.twins.define("twin-4a", "target:x");
  h.sim.twins.define("twin-4b", "target:x");
  const snap = mintSnapshot(h.authKeyPriv, { targetRef: "target:x", state: {}, keyRef: h.authKeyRef });
  h.sim.twins.bind("twin-4a", snap);
  assert.throws(
    () => h.sim.twins.bind("twin-4b", snap), // same nonce => replay
    (e: unknown) => e instanceof SimulationError && e.code === "SNAPSHOT_INVALID",
  );
});

test("a stale twin is non-projectable (fail-closed, S12/TWIN_DRIFT)", () => {
  const h = buildSimulation();
  h.sim.twins.define("twin-5", "target:x");
  const now = Date.now();
  const snap = mintSnapshot(h.authKeyPriv, { targetRef: "target:x", state: { v: 1 }, keyRef: h.authKeyRef, issuedAt: now, expiresAt: now + 1000 });
  h.sim.twins.bind("twin-5", snap, { now });
  // Advance beyond expiry.
  const later = now + 2000;
  const rec = h.sim.twins.refreshStaleness("twin-5", later);
  assert.equal(rec.state, "stale");
  assert.throws(
    () => h.sim.twins.baseline("twin-5", later),
    (e: unknown) => e instanceof SimulationError && e.code === "TWIN_DRIFT",
  );
});

test("FDG-MEM memory read enrichment is denied during PI-11 (inert seam)", () => {
  const h = buildSimulation();
  h.sim.twins.define("twin-6", "target:x");
  const snap = mintSnapshot(h.authKeyPriv, { targetRef: "target:x", state: {}, keyRef: h.authKeyRef });
  assert.throws(
    () => h.sim.twins.bind("twin-6", snap, { memoryRef: "memory:episodic:123" }),
    (e: unknown) => e instanceof SimulationError && e.code === "FDG_UNBOUND",
  );
});

test("the twin never exposes a write path to its target (non-actuation)", () => {
  const h = buildSimulation();
  h.sim.twins.define("twin-7", "target:x");
  const twin = h.sim.twins as unknown as Record<string, unknown>;
  // No actuate/write/commit method exists on the twin manager surface.
  for (const forbidden of ["actuate", "write", "commit", "apply", "mutateTarget"]) {
    assert.equal(typeof twin[forbidden], "undefined", `twin must not expose ${forbidden}`);
  }
});
