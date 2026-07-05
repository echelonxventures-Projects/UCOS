/**
 * PI-11 Wave W0 — Registry indexing + sandbox allocate/teardown + allowed-namespace confinement.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSimulation, registerAuthority } from "./simulation-harness.ts";
import { SandboxManager } from "../src/control/simulation/sandbox.ts";
import { SimulationAuditLog } from "../src/control/simulation/simulation-audit-log.ts";
import { sandboxPrefix, isAllowedNamespace } from "../src/control/simulation/simulation-namespace.ts";
import { SimulationError } from "../src/control/simulation/types.ts";

test("registry indexes an authority under the allowed namespace and round-trips it", () => {
  const h = buildSimulation();
  const rec = registerAuthority(h);
  const got = h.sim.registry.getAuthority(rec.authorityId);
  assert.equal(got?.authorityId, rec.authorityId);
  // The metadata write landed under simulation:authority:*
  const raw = h.substrate.metadata.get(`simulation:authority:${rec.authorityId}`);
  assert.ok(raw, "authority persisted under simulation:authority: namespace");
});

test("all simulation writes stay within allowed namespaces", () => {
  const h = buildSimulation();
  registerAuthority(h);
  for (const rec of h.substrate.metadata.query("")) {
    if (rec.key.startsWith("simulation:")) {
      assert.ok(isAllowedNamespace(rec.key), `key ${rec.key} must be an allowed simulation namespace`);
    }
  }
});

test("sandbox allocate creates an isolated store; a confined write succeeds", () => {
  const audit = new SimulationAuditLog("node-local");
  const mgr = new SandboxManager(audit);
  const sb = mgr.allocate("run-1");
  const key = `${sandboxPrefix("run-1")}state`;
  sb.put(key, { count: 1 });
  assert.deepEqual(sb.get(key), { count: 1 });
  assert.equal(sb.size(), 1);
  assert.ok(mgr.isAllocated("run-1"));
});

test("sandbox write OUTSIDE the run keyspace is rejected (SANDBOX_ESCAPE) and audited (S1)", () => {
  const audit = new SimulationAuditLog("node-local");
  const mgr = new SandboxManager(audit);
  const sb = mgr.allocate("run-2");
  assert.throws(
    () => sb.put("registry:cap.evil", { boom: true }),
    (e: unknown) => e instanceof SimulationError && e.code === "SANDBOX_ESCAPE",
  );
  // Also rejects another run's sandbox keyspace.
  assert.throws(
    () => sb.put(`${sandboxPrefix("run-OTHER")}state`, {}),
    (e: unknown) => e instanceof SimulationError && e.code === "SANDBOX_ESCAPE",
  );
  const rejected = audit.entries().filter((e) => e.event === "SANDBOX_WRITE_REJECTED");
  assert.equal(rejected.length, 2);
});

test("sandbox teardown disposes all contents (fail-closed, idempotent)", () => {
  const mgr = new SandboxManager();
  const sb = mgr.allocate("run-3");
  sb.put(`${sandboxPrefix("run-3")}a`, 1);
  mgr.teardown("run-3");
  assert.equal(mgr.isAllocated("run-3"), false);
  mgr.teardown("run-3"); // idempotent, no throw
});

test("double allocation of a live run is rejected", () => {
  const mgr = new SandboxManager();
  mgr.allocate("run-4");
  assert.throws(() => mgr.allocate("run-4"), (e: unknown) => e instanceof SimulationError);
});
