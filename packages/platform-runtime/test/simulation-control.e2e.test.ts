/**
 * PI-11 Wave W4 — End-to-end: scenario → run(sandbox) → projection → impact → proposal → Evolution
 * commit → teardown; self-commit is impossible (Evolution-only commit path).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSimulation, fullRun, governedUnit, allowPromotion, buildEvolutionArtifacts } from "./simulation-harness.ts";

const PRINCIPALS = { modeller: "modeller-1", certifier: "certifier-2", ratifier: "ratifier-3", approver: "approver-4" };

test("full lifecycle commits through Evolution then tears down the sandbox", async () => {
  const h = buildSimulation();
  const run = await fullRun(h);
  assert.equal(run.projection.valid, true);
  assert.equal(run.impact.recommendation, "adopt-proposal");

  const unit = governedUnit();
  const decisionContext = allowPromotion(h);
  const { proposal, certification, ratification } = buildEvolutionArtifacts(h, unit, PRINCIPALS);

  const result = await h.sim.promotion.promote({
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
      h.sim.projection.project({ runId: run.runId, projectionId: "proj-rd", snapshot: run.snapshot, scenario: run.scenario, materializedState: { count: 20, integrity: true }, modelId: "m-inc", seed: "seed-a", policyHash: "policy-0" }),
  });

  assert.equal(result.committed, true);
  assert.deepEqual(h.substrate.metadata.get("app:orders:projection")?.value, { adopted: true });

  // Tear down the disposable sandbox.
  h.sim.sandbox.teardown(run.runId);
  assert.equal(h.sim.sandbox.isAllocated(run.runId), false);

  // The audit chain recorded the promotion + teardown and verifies intact.
  const events = h.sim.audit.entries().map((e) => e.event);
  assert.ok(events.includes("PROMOTED"));
  const v = (await import("../src/control/simulation/simulation-audit-log.ts")).SimulationAuditLog.verify(h.sim.audit.export());
  assert.ok(v.ok, v.reason);
});

test("the simulation fabric holds NO independent commit power (self-commit impossible, B5/S8)", async () => {
  const h = buildSimulation();
  await fullRun(h);
  // No simulation authority power grants commit; the promotion pipeline exposes no direct-write method.
  const auth = h.sim.registry.getAuthority("sim-auth-1");
  assert.ok(auth);
  assert.ok(!auth!.powers.includes("scenario" as never) || !["commit", "actuate", "write"].some((p) => auth!.powers.includes(p as never)));
  const promo = h.sim.promotion as unknown as Record<string, unknown>;
  for (const forbidden of ["commit", "write", "apply", "mutate", "actuate"]) {
    assert.equal(typeof promo[forbidden], "undefined", `promotion pipeline must not expose ${forbidden}`);
  }
  // Registering an authority with a commit power is impossible (rejected).
  assert.throws(() =>
    h.sim.authorities.register(
      { authorityId: "evil", owner: "x", powers: ["commit" as never], scope: "*", keyRef: h.authKeyRef, status: "active" },
      "board",
    ),
  );
});
