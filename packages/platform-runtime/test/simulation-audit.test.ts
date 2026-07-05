/**
 * PI-11 Wave W0 — Simulation audit: hash-chain append/verify, tamper detection, reproducibility tuple.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { SimulationAuditLog, SIM_GENESIS_HASH } from "../src/control/simulation/simulation-audit-log.ts";

test("audit chain appends and verifies intact", () => {
  const log = new SimulationAuditLog("node-local");
  log.record({ at: 1, event: "RUN_ALLOCATED", runId: "r1", actor: "sandbox", detail: "prefix" });
  log.record({ at: 2, event: "PROJECTED", runId: "r1", actor: "projection-engine", detail: "p1", reproHash: "abc" });
  const exported = log.export();
  assert.equal(exported.chain.length, 2);
  assert.equal(exported.chain[0]!.prevHash, SIM_GENESIS_HASH);
  const v = SimulationAuditLog.verify(exported);
  assert.ok(v.ok, v.reason);
});

test("reproducibility digest is recorded on projection audit entries (A2/A8)", () => {
  const log = new SimulationAuditLog("node-local");
  log.record({ at: 1, event: "PROJECTED", runId: "r1", actor: "projection-engine", detail: "p1", reproHash: "hash-xyz" });
  assert.equal(log.entries()[0]!.reproHash, "hash-xyz");
});

test("tampering with a recorded entry is detected on verify (S10)", () => {
  const log = new SimulationAuditLog("node-local");
  log.record({ at: 1, event: "PROMOTED", runId: "r1", actor: "m", detail: "committed" });
  log.record({ at: 2, event: "TORN_DOWN", runId: "r1", actor: "sandbox", detail: "disposed" });
  const exported = log.export();
  // Tamper: mutate the first entry's detail after the fact.
  exported.chain[0]!.entry.detail = "forged";
  const v = SimulationAuditLog.verify(exported);
  assert.equal(v.ok, false);
  assert.match(v.reason, /tamper|mismatch/);
});

test("reordering entries breaks chain continuity", () => {
  const log = new SimulationAuditLog("node-local");
  log.record({ at: 1, event: "RUN_ALLOCATED", runId: "r1", actor: "s", detail: "1" });
  log.record({ at: 2, event: "PROJECTED", runId: "r1", actor: "p", detail: "2" });
  const exported = log.export();
  [exported.chain[0], exported.chain[1]] = [exported.chain[1]!, exported.chain[0]!];
  const v = SimulationAuditLog.verify(exported);
  assert.equal(v.ok, false);
});
