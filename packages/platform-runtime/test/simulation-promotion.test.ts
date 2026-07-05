/**
 * PI-11 Wave W4 — Promotion pipeline: deny-by-default; SoD; Evolution-only commit; reproducibility gate.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSimulation, fullRun, governedUnit, allowPromotion, buildEvolutionArtifacts } from "./simulation-harness.ts";
import type { PromotionRequest } from "../src/control/simulation/index.ts";
import { SimulationError } from "../src/control/simulation/types.ts";

const PRINCIPALS = { modeller: "modeller-1", certifier: "certifier-2", ratifier: "ratifier-3", approver: "approver-4" };

async function baseRequest(h: ReturnType<typeof buildSimulation>): Promise<PromotionRequest> {
  const run = await fullRun(h);
  const unit = governedUnit();
  const decisionContext = allowPromotion(h);
  const { proposal, certification, ratification } = buildEvolutionArtifacts(h, unit, PRINCIPALS);
  return {
    runId: run.runId,
    scenario: run.scenario,
    projection: run.projection,
    impact: run.impact,
    modeller: PRINCIPALS.modeller,
    certifier: PRINCIPALS.certifier,
    approver: PRINCIPALS.approver,
    decisionContext,
    proposal,
    certification,
    ratification,
    reDerive: async () =>
      h.sim.projection.project({
        runId: run.runId,
        projectionId: "proj-rederive",
        snapshot: run.snapshot,
        scenario: run.scenario,
        materializedState: { count: 20, integrity: true },
        modelId: "m-inc",
        seed: "seed-a",
        policyHash: "policy-0",
      }),
  };
}

test("a fully-valid, policy-PASS, certified+ratified promotion commits via Evolution", async () => {
  const h = buildSimulation();
  const req = await baseRequest(h);
  const result = await h.sim.promotion.promote(req);
  assert.equal(result.committed, true);
  // The governed change landed in the substrate metadata via the Evolution Fabric (the only commit path).
  assert.deepEqual(h.substrate.metadata.get("app:orders:projection")?.value, { adopted: true });
});

test("an invalid projection cannot be promoted (S4)", async () => {
  const h = buildSimulation();
  const req = await baseRequest(h);
  req.projection = { ...req.projection, valid: false };
  await assert.rejects(
    () => h.sim.promotion.promote(req),
    (e: unknown) => e instanceof SimulationError && e.code === "CONSTRAINT_VIOLATION",
  );
  assert.equal(h.substrate.metadata.get("app:orders:projection"), undefined);
});

test("a non-adopt impact recommendation blocks promotion", async () => {
  const h = buildSimulation();
  const req = await baseRequest(h);
  req.impact = { ...req.impact, recommendation: "inconclusive" };
  await assert.rejects(() => h.sim.promotion.promote(req), (e: unknown) => e instanceof SimulationError);
});

test("SoD: certifier == modeller is rejected (S8)", async () => {
  const h = buildSimulation();
  const req = await baseRequest(h);
  req.certifier = req.modeller;
  await assert.rejects(
    () => h.sim.promotion.promote(req),
    (e: unknown) => e instanceof SimulationError && e.code === "SEPARATION_OF_DUTIES",
  );
});

test("the reproducibility gate rejects a mismatched re-derivation (S3/S10)", async () => {
  const h = buildSimulation();
  const req = await baseRequest(h);
  req.reDerive = async () => ({ ...req.projection, projectionHash: "different-hash" });
  await assert.rejects(
    () => h.sim.promotion.promote(req),
    (e: unknown) => e instanceof SimulationError && e.code === "AUDIT_DIVERGENCE",
  );
});

test("policy deny-by-default blocks promotion when no allow policy applies (S4)", async () => {
  const h = buildSimulation();
  const req = await baseRequest(h);
  // Point the decision context at an operation with no allow policy.
  req.decisionContext = { ...req.decisionContext, operation: "unpermitted" };
  await assert.rejects(
    () => h.sim.promotion.promote(req),
    (e: unknown) => e instanceof SimulationError && e.code === "SIMULATION_DENIED",
  );
  assert.equal(h.substrate.metadata.get("app:orders:projection"), undefined);
});

test("a revoked run blocks promotion (fail-closed)", async () => {
  const h = buildSimulation();
  const req = await baseRequest(h);
  h.sim.revocations.revoke("run", req.runId);
  await assert.rejects(() => h.sim.promotion.promote(req), (e: unknown) => e instanceof SimulationError);
});
