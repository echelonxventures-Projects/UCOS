/**
 * PI-11 Wave W3 — Federation guard: C11 advisory/deny-only foreign contributions, trust clamp,
 * local-shadows-foreign, fail-closed partition.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSimulation } from "./simulation-harness.ts";
import { generateKeyPair, signPayload } from "../src/control/federation/assertions.ts";
import type { ForeignContribution } from "../src/control/simulation/federation-guard.ts";
import { SimulationError } from "../src/control/simulation/types.ts";

function signedForeign(h: ReturnType<typeof buildSimulation>, over: Partial<ForeignContribution> = {}): ForeignContribution {
  const { publicKeyPem, privateKey } = generateKeyPair();
  const keyRef = over.keyRef ?? "foreign-key-1";
  h.sim.keys.register(keyRef, publicKeyPem);
  const base: Omit<ForeignContribution, "signature"> = {
    nodeId: over.nodeId ?? "nodeB",
    authorityId: over.authorityId ?? "authB",
    keyRef,
    artifactId: over.artifactId ?? "foreign-proj-1",
    assertedTrust: over.assertedTrust ?? 3,
    payload: over.payload ?? { count: 7 },
  };
  return { ...base, signature: signPayload(base, privateKey) };
}

test("a valid foreign contribution is admitted advisory-only, never promotable", () => {
  const h = buildSimulation();
  const admitted = h.sim.federationGuard.admit(signedForeign(h));
  assert.equal(admitted.advisory, true);
  assert.equal(admitted.promotable, false);
  assert.equal(admitted.effectiveTrust, 3);
});

test("trust is clamped to min(asserted, delegated, boundary)", () => {
  const h = buildSimulation({ nodeId: "node-local" });
  // Default boundary/delegation = 5; asserted 5 clamps to 5.
  const admitted = h.sim.federationGuard.admit(signedForeign(h, { assertedTrust: 5 }));
  assert.equal(admitted.effectiveTrust, 5);
});

test("an over-cap assertion (asserted > boundary) is denied (S9)", () => {
  const h = buildSimulation();
  assert.throws(
    () => h.sim.federationGuard.admit(signedForeign(h, { assertedTrust: 99 })),
    (e: unknown) => e instanceof SimulationError && e.code === "FEDERATION_DENIED",
  );
});

test("an unsigned or badly-signed foreign contribution is denied", () => {
  const h = buildSimulation();
  const c = signedForeign(h);
  const tampered = { ...c, payload: { count: 9999 } }; // signature no longer matches
  assert.throws(
    () => h.sim.federationGuard.admit(tampered),
    (e: unknown) => e instanceof SimulationError && e.code === "FEDERATION_DENIED",
  );
});

test("local shadows foreign: a local artifact of the same id rejects the foreign one", () => {
  const h = buildSimulation();
  h.sim.federationGuard.registerLocalArtifact("shadowed");
  assert.throws(
    () => h.sim.federationGuard.admit(signedForeign(h, { artifactId: "shadowed" })),
    (e: unknown) => e instanceof SimulationError && e.code === "FEDERATION_DENIED",
  );
});

test("under partition, foreign contributions fail closed", () => {
  const h = buildSimulation();
  h.sim.federationGuard.setPartitioned(true);
  assert.throws(
    () => h.sim.federationGuard.admit(signedForeign(h)),
    (e: unknown) => e instanceof SimulationError && e.code === "FEDERATION_DENIED",
  );
  h.sim.federationGuard.setPartitioned(false);
  assert.ok(h.sim.federationGuard.admit(signedForeign(h, { artifactId: "after-heal" })));
});
