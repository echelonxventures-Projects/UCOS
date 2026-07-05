/**
 * PI-11 Wave W5 — Adversarial hardening: one attack vector per SIM-THREAT-001 threat (S1–S12), each
 * asserting the attack is rejected with a typed error and (where applicable) audited. Determination
 * gate: 12/12 blocked, 0 residual High/High. Also verifies the FDG-INT/MEM/ONT seams reject premature
 * binding (SIM-PLAN-002 §6).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildSimulation,
  fullRun,
  governedUnit,
  allowPromotion,
  buildEvolutionArtifacts,
  mintSnapshot,
  registerAuthority,
  standardScenario,
  simpleConstraintSet,
  DEFAULT_BUDGET,
} from "./simulation-harness.ts";
import { generateKeyPair, signPayload } from "../src/control/federation/assertions.ts";
import { deterministicModel } from "../src/control/simulation/predictive-adapter.ts";
import { SimulationAuditLog } from "../src/control/simulation/simulation-audit-log.ts";
import type { ForeignContribution } from "../src/control/simulation/federation-guard.ts";
import type { PredictiveModel, ForecastResult } from "../src/control/simulation/types.ts";
import { SimulationError } from "../src/control/simulation/types.ts";

const P = { modeller: "modeller-1", certifier: "certifier-2", ratifier: "ratifier-3", approver: "approver-4" };

test("S1 — sandbox escape: a write outside the run keyspace is rejected + audited", () => {
  const h = buildSimulation();
  const sb = h.sim.sandbox.allocate("run-s1");
  assert.throws(
    () => sb.put("registry:cap.injected", { evil: true }),
    (e: unknown) => e instanceof SimulationError && e.code === "SANDBOX_ESCAPE",
  );
  assert.ok(h.sim.audit.entries().some((e) => e.event === "SANDBOX_WRITE_REJECTED"));
});

test("S2 — snapshot/twin poisoning: a forged/unsigned snapshot fails verify ⇒ bind denied", () => {
  const h = buildSimulation();
  h.sim.twins.define("twin-s2", "target:x");
  const snap = mintSnapshot(h.authKeyPriv, { targetRef: "target:x", state: { v: 1 }, keyRef: h.authKeyRef });
  const forged = { ...snap, state: { v: 2 } };
  assert.throws(
    () => h.sim.twins.bind("twin-s2", forged),
    (e: unknown) => e instanceof SimulationError && e.code === "SNAPSHOT_INVALID",
  );
});

test("S3 — non-deterministic leakage: an unattested non-det forecast is advisory-only (non-committable)", async () => {
  const h = buildSimulation();
  const result: ForecastResult = { modelId: "m-nd", output: { count: 1 }, deterministic: false };
  const gate = await h.sim.adapter.gate(result, "seed"); // no verifier configured
  assert.equal(gate.committable, false);
});

test("S4 — predictive/model overreach: promotion without policy-PASS is denied", async () => {
  const h = buildSimulation();
  const run = await fullRun(h);
  const unit = governedUnit();
  const decisionContext = allowPromotion(h);
  const { proposal, certification, ratification } = buildEvolutionArtifacts(h, unit, P);
  await assert.rejects(
    () =>
      h.sim.promotion.promote({
        runId: run.runId, scenario: run.scenario, projection: run.projection, impact: run.impact,
        modeller: P.modeller, certifier: P.certifier, approver: P.approver,
        decisionContext: { ...decisionContext, operation: "no-policy" }, // deny-by-default
        proposal, certification, ratification,
        reDerive: async () => run.projection,
      }),
    (e: unknown) => e instanceof SimulationError && e.code === "SIMULATION_DENIED",
  );
});

test("S5 — resource exhaustion: exceeding the step/entity budget aborts", () => {
  const h = buildSimulation();
  const auth = registerAuthority(h);
  h.sim.twins.define("twin-s5", "target:x");
  const snap = mintSnapshot(h.authKeyPriv, { targetRef: "target:x", state: {}, keyRef: h.authKeyRef });
  h.sim.twins.bind("twin-s5", snap);
  h.sim.scenarios.author({
    scenarioId: "scn-s5", authorityId: auth.authorityId, twinId: "twin-s5", class: "standard",
    interventions: Array.from({ length: 10 }, (_, i) => ({ path: `k${i}`, value: i })),
    budget: { maxHorizon: 100, maxSteps: 2, maxEntities: 1000, maxWallMs: 5000 }, constraintSetId: "cs-1", classification: "internal",
  });
  h.sim.scenarios.authorize("scn-s5");
  h.sim.scenarios.activate("scn-s5");
  const sb = h.sim.sandbox.allocate("run-s5");
  assert.throws(
    () => h.sim.scenarios.materialize("run-s5", "scn-s5", {}, sb),
    (e: unknown) => e instanceof SimulationError && e.code === "BUDGET_EXCEEDED",
  );
});

test("S6 — classification leakage: emitting an impact below its inherited class is denied", async () => {
  const h = buildSimulation();
  const run = await fullRun(h);
  assert.throws(
    () => h.sim.impact.assess({ impactId: "imp-s6", runId: run.runId, baselineState: run.snapshot.state, projection: { ...run.projection, classification: "secret" }, constraintResult: simpleConstraintResult(), baselineClass: "secret", emitClass: "public" }),
    (e: unknown) => e instanceof SimulationError && e.code === "CLASSIFICATION_LEAK",
  );
});

test("S7 — replay/stale: a replayed snapshot nonce is denied", () => {
  const h = buildSimulation();
  h.sim.twins.define("twin-s7a", "target:x");
  h.sim.twins.define("twin-s7b", "target:x");
  const snap = mintSnapshot(h.authKeyPriv, { targetRef: "target:x", state: {}, keyRef: h.authKeyRef });
  h.sim.twins.bind("twin-s7a", snap);
  assert.throws(
    () => h.sim.twins.bind("twin-s7b", snap),
    (e: unknown) => e instanceof SimulationError && e.code === "SNAPSHOT_INVALID",
  );
});

test("S8 — authority escalation: no commit power is expressible; SoD blocks certifier==modeller", async () => {
  const h = buildSimulation();
  assert.throws(
    () => h.sim.authorities.register({ authorityId: "evil", owner: "x", powers: ["commit" as never], scope: "*", keyRef: h.authKeyRef, status: "active" }, "board"),
    (e: unknown) => e instanceof SimulationError,
  );
  const run = await fullRun(h);
  const unit = governedUnit();
  const decisionContext = allowPromotion(h);
  const { proposal, certification, ratification } = buildEvolutionArtifacts(h, unit, P);
  await assert.rejects(
    () => h.sim.promotion.promote({ runId: run.runId, scenario: run.scenario, projection: run.projection, impact: run.impact, modeller: P.modeller, certifier: P.modeller, approver: P.approver, decisionContext, proposal, certification, ratification, reDerive: async () => run.projection }),
    (e: unknown) => e instanceof SimulationError && e.code === "SEPARATION_OF_DUTIES",
  );
});

test("S9 — federated poisoning: an over-cap foreign contribution is denied (advisory/deny-only)", () => {
  const h = buildSimulation();
  const { publicKeyPem, privateKey } = generateKeyPair();
  h.sim.keys.register("fk", publicKeyPem);
  const base: Omit<ForeignContribution, "signature"> = { nodeId: "nodeB", authorityId: "authB", keyRef: "fk", artifactId: "f-s9", assertedTrust: 99, payload: { x: 1 } };
  const contribution: ForeignContribution = { ...base, signature: signPayload(base, privateKey) };
  assert.throws(
    () => h.sim.federationGuard.admit(contribution),
    (e: unknown) => e instanceof SimulationError && e.code === "FEDERATION_DENIED",
  );
});

test("S10 — audit divergence: a tampered audit chain fails verification", () => {
  const log = new SimulationAuditLog("node-local");
  log.record({ at: 1, event: "PROMOTED", runId: "r", actor: "m", detail: "committed" });
  log.record({ at: 2, event: "TORN_DOWN", runId: "r", actor: "s", detail: "disposed" });
  const exported = log.export();
  exported.chain[0]!.entry.detail = "forged";
  assert.equal(SimulationAuditLog.verify(exported).ok, false);
});

test("S11 — existential/civilization scope creep: civilization scenario without Board is denied", () => {
  const h = buildSimulation();
  const auth = registerAuthority(h, { maxClass: "secret" });
  h.sim.twins.define("twin-s11", "target:x");
  const snap = mintSnapshot(h.authKeyPriv, { targetRef: "target:x", state: { integrity: true }, keyRef: h.authKeyRef });
  h.sim.twins.bind("twin-s11", snap);
  h.sim.scenarios.author({ scenarioId: "civ-s11", authorityId: auth.authorityId, twinId: "twin-s11", class: "civilization", interventions: [], budget: DEFAULT_BUDGET, constraintSetId: "cs-1", classification: "secret" });
  assert.throws(
    () => h.sim.scenarios.authorize("civ-s11"),
    (e: unknown) => e instanceof SimulationError && e.code === "SCOPE_VIOLATION",
  );
});

test("S12 — digital-twin drift/impersonation: a stale twin is non-projectable (fail-closed)", () => {
  const h = buildSimulation();
  h.sim.twins.define("twin-s12", "target:x");
  const now = Date.now();
  const snap = mintSnapshot(h.authKeyPriv, { targetRef: "target:x", state: { v: 1 }, keyRef: h.authKeyRef, issuedAt: now, expiresAt: now + 1000 });
  h.sim.twins.bind("twin-s12", snap, { now });
  assert.throws(
    () => h.sim.twins.baseline("twin-s12", now + 5000),
    (e: unknown) => e instanceof SimulationError && e.code === "TWIN_DRIFT",
  );
});

test("FDG premature binding is rejected for all three deferred gates (INT/MEM/ONT)", () => {
  const h = buildSimulation();
  // FDG-INT: a non-deterministic model cannot be registered.
  const nonDet: PredictiveModel = { modelId: "nd", kind: "non-deterministic", async forecast() { return { modelId: "nd", output: {}, deterministic: false }; } };
  assert.throws(() => h.sim.adapter.register(nonDet), (e: unknown) => e instanceof SimulationError && e.code === "FDG_UNBOUND");
  // FDG-MEM: a memory read hook cannot be bound.
  h.sim.twins.define("twin-fdg", "target:x");
  const snap = mintSnapshot(h.authKeyPriv, { targetRef: "target:x", state: {}, keyRef: h.authKeyRef });
  assert.throws(() => h.sim.twins.bind("twin-fdg", snap, { memoryRef: "memory:x" }), (e: unknown) => e instanceof SimulationError && e.code === "FDG_UNBOUND");
  // FDG-ONT: a constraint referencing an unbound ontology:* surface is denied.
  assert.throws(
    () => h.sim.constraints.check({ type: "Order" }, { constraintSetId: "cs", hard: [{ id: "o", kind: "hard", path: "type", op: "eq", bound: "Order", ontologyRef: "ontology:type:Order" }], soft: [], preservedInvariants: [] }),
    (e: unknown) => e instanceof SimulationError && e.code === "FDG_UNBOUND",
  );
});

// Local helper (constraint result) to avoid coupling S6 to a full projection run.
function simpleConstraintResult() {
  return { ok: true, hardFailures: [], softWarnings: [], invariantFailures: [] };
}
void simpleConstraintSet;
void deterministicModel;
