/**
 * Shared test harness for PI-11 simulation suites. Not a test file (no ".test.ts").
 *
 * Builds a composed substrate + PI-4 control fabric + PI-6 evolution fabric + the wired PI-11
 * simulation fabric, plus helpers to mint signed snapshots/foreign assertions from a remote authority
 * holding an Ed25519 private key (reusing the federation crypto — no custom cryptography).
 */

import type { KeyObject } from "node:crypto";
import { createSubstrate, type Substrate } from "../src/bootstrap.ts";
import { createControlPlane, type ControlFabric } from "../src/control/bootstrap.ts";
import { createEvolution, type EvolutionFabric } from "../src/control/evolution/index.ts";
import { generateKeyPair, signPayload, newNonce } from "../src/control/federation/assertions.ts";
import { createSimulationFabric, type SimulationFabric } from "../src/control/simulation/index.ts";
import type {
  Classification,
  ConstraintSet,
  SignedSnapshot,
  SimulationAuthorityRecord,
  ScenarioRecord,
  SimulationBudget,
} from "../src/control/simulation/types.ts";

export interface SimHarness {
  substrate: Substrate;
  control: ControlFabric;
  evolution: EvolutionFabric;
  sim: SimulationFabric;
  authKeyPriv: KeyObject;
  authKeyRef: string;
}

/** Stand up the full stack with a registered simulation authority + signing keypair. */
export function buildSimulation(options?: { nodeId?: string }): SimHarness {
  const nodeId = options?.nodeId ?? "node-local";
  const substrate = createSubstrate();
  const control = createControlPlane(substrate);
  const evolution = createEvolution(substrate, { nodeId, evolvableAllowlist: ["app:", "config:", "registry:"] });

  const { publicKeyPem, privateKey } = generateKeyPair();
  const authKeyRef = "sim-authority-key";
  const keys = evolution.keys; // shared KeyRegistry across evolution + simulation
  keys.register(authKeyRef, publicKeyPem);

  const sim = createSimulationFabric(
    { registry: substrate.registry, metadata: substrate.metadata, configuration: substrate.configuration },
    control,
    { evolution },
    { nodeId, keys },
  );

  return { substrate, control, evolution, sim, authKeyPriv: privateKey, authKeyRef };
}

export const DEFAULT_BUDGET: SimulationBudget = { maxHorizon: 100, maxSteps: 50, maxEntities: 1000, maxWallMs: 5_000 };

/** Register an active simulation authority (approval-required act, done in the harness for tests). */
export function registerAuthority(
  h: SimHarness,
  opts?: Partial<SimulationAuthorityRecord>,
): SimulationAuthorityRecord {
  const rec: SimulationAuthorityRecord = {
    authorityId: opts?.authorityId ?? "sim-auth-1",
    owner: opts?.owner ?? "modeller-1",
    powers: opts?.powers ?? ["scenario", "decision", "revocation"],
    scope: opts?.scope ?? "*",
    keyRef: opts?.keyRef ?? h.authKeyRef,
    maxClass: opts?.maxClass ?? "confidential",
    status: opts?.status ?? "active",
  };
  h.sim.authorities.register(rec, "board");
  return rec;
}

/** Mint a signed baseline snapshot from the authority's private key. */
export function mintSnapshot(
  priv: KeyObject,
  opts: {
    targetRef: string;
    state: Record<string, unknown>;
    keyRef: string;
    issuer?: string;
    classification?: Classification;
    issuedAt?: number;
    expiresAt?: number;
    nonce?: string;
  },
): SignedSnapshot {
  const now = Date.now();
  const base: Omit<SignedSnapshot, "signature"> = {
    targetRef: opts.targetRef,
    state: opts.state,
    issuer: opts.issuer ?? "authB",
    keyRef: opts.keyRef,
    issuedAt: opts.issuedAt ?? now,
    expiresAt: opts.expiresAt ?? now + 300_000,
    nonce: opts.nonce ?? newNonce(),
    classification: opts.classification ?? "internal",
  };
  return { ...base, signature: signPayload(base, priv) };
}

export function simpleConstraintSet(id = "cs-1"): ConstraintSet {
  return {
    constraintSetId: id,
    hard: [{ id: "h1", kind: "hard", path: "count", op: "lte", bound: 1000 }],
    soft: [{ id: "s1", kind: "soft", path: "count", op: "lte", bound: 100 }],
    preservedInvariants: [{ id: "inv1", kind: "hard", path: "integrity", op: "eq", bound: true }],
  };
}

export function standardScenario(opts: {
  scenarioId?: string;
  authorityId: string;
  twinId: string;
  constraintSetId: string;
  interventions?: { path: string; value: unknown }[];
  classification?: Classification;
}): Omit<ScenarioRecord, "state"> {
  return {
    scenarioId: opts.scenarioId ?? "scn-1",
    authorityId: opts.authorityId,
    twinId: opts.twinId,
    class: "standard",
    interventions: opts.interventions ?? [{ path: "count", value: 42 }],
    budget: DEFAULT_BUDGET,
    constraintSetId: opts.constraintSetId,
    classification: opts.classification ?? "internal",
  };
}


// ------------------------------- Promotion (W4) helpers -------------------------------

import { createUnit, mintProposal, type EvolutionUnit, type EvolutionProposal, type EvolutionCertification, type EvolutionRatification } from "../src/control/evolution/index.ts";
import { deterministicModel } from "../src/control/simulation/index.ts";
import type { DecisionContext, IdentityRecord } from "../src/control/types.ts";
import type { ImpactRecord, ProjectionRecord } from "../src/control/simulation/types.ts";

/** Register a fresh Ed25519 keypair for `principal` in the shared key registry; return its private key. */
export function principalKey(h: SimHarness, keyRef: string): import("node:crypto").KeyObject {
  const { publicKeyPem, privateKey } = generateKeyPair();
  h.evolution.keys.register(keyRef, publicKeyPem);
  return privateKey;
}

/** A governed evolution unit targeting an allowed (`app:`) metadata namespace. */
export function governedUnit(unitId = "sim-evo-1"): EvolutionUnit {
  return createUnit({
    unitId,
    title: "Adopt simulation-projected order configuration",
    changeClass: "routine",
    targets: [{ kind: "metadata", keyPrefix: "app:orders" }],
    ops: [{ op: "put-metadata", key: "app:orders:projection", value: { adopted: true } }],
  });
}

/** Register a PI-4 allow policy + identity for the promotion decision context. */
export function allowPromotion(h: SimHarness, capabilityId = "app.orders", operation = "promote"): DecisionContext {
  const permission = `${capabilityId}:${operation}`;
  h.control.policyRegistry.register({
    id: "allow-sim-promotion",
    target: { capability: capabilityId, operation },
    effect: "allow",
    rules: [{ type: "require-permission", permission }],
  });
  const identity: IdentityRecord = { id: "modeller-1", kind: "agent", status: "active", permissions: [permission] };
  return { identity, trustLevel: 5, capabilityId, operation, input: {}, config: {} };
}

/** Build the signed Evolution governance artifacts for a promotion (approval-required acts). */
export function buildEvolutionArtifacts(
  h: SimHarness,
  unit: EvolutionUnit,
  principals: { modeller: string; certifier: string; ratifier: string; approver: string },
  now = Date.now(),
): { proposal: EvolutionProposal; certification: EvolutionCertification; ratification: EvolutionRatification } {
  const modellerPriv = principalKey(h, "k-modeller");
  const certifierPriv = principalKey(h, "k-certifier");
  const ratifierPriv = principalKey(h, "k-ratifier");

  const proposal = mintProposal(modellerPriv, {
    proposalId: `prop-${unit.unitId}`,
    unit,
    proposer: principals.modeller,
    proposerKeyRef: "k-modeller",
    issuedAt: now,
  });

  h.evolution.certifications.register({ caId: "ca-1", owner: principals.certifier, keyRef: "k-certifier" });
  const certification = h.evolution.certifications.issue(certifierPriv, { unitHash: proposal.unitHash, caId: "ca-1", issuedAt: now });

  h.evolution.ratifications.register({ raId: "ra-1", owner: principals.ratifier, keyRef: "k-ratifier", quorum: 1 });
  const ratification = h.evolution.ratifications.issue(ratifierPriv, {
    unitHash: proposal.unitHash,
    raId: "ra-1",
    proposer: principals.modeller,
    certifier: principals.certifier,
    approvals: [principals.approver],
    certificationId: certification.certificationId,
    issuedAt: now,
  });
  return { proposal, certification, ratification };
}

/** Drive a full run: bind twin, register model, author/authorize/activate scenario, project, assess. */
export async function fullRun(h: SimHarness): Promise<{ scenario: ScenarioRecord; projection: ProjectionRecord; impact: ImpactRecord; snapshot: SignedSnapshot; runId: string }> {
  const auth = registerAuthority(h);
  h.sim.twins.define("twin-1", "target:app.orders");
  const snapshot = mintSnapshot(h.authKeyPriv, { targetRef: "target:app.orders", state: { count: 10, integrity: true }, keyRef: h.authKeyRef });
  h.sim.twins.bind("twin-1", snapshot);
  h.sim.adapter.register(deterministicModel("m-inc", (b) => ({ count: Number(b.count ?? 0) + 5, integrity: true })));
  h.sim.scenarios.author(standardScenario({ authorityId: auth.authorityId, twinId: "twin-1", constraintSetId: "cs-1", interventions: [{ path: "count", value: 20 }] }));
  h.sim.scenarios.authorize("scn-1");
  h.sim.scenarios.activate("scn-1");
  const scenario = h.sim.registry.getScenario("scn-1")!;

  const runId = "run-1";
  const sb = h.sim.sandbox.allocate(runId);
  const materialized = h.sim.scenarios.materialize(runId, "scn-1", snapshot.state, sb);
  const projection = await h.sim.projection.project({ runId, projectionId: "proj-1", snapshot, scenario, materializedState: materialized, modelId: "m-inc", seed: "seed-a", policyHash: "policy-0" });
  const constraintResult = h.sim.constraints.check(projection.projectedState, simpleConstraintSet());
  const impact = h.sim.impact.assess({ impactId: "imp-1", runId, baselineState: snapshot.state, projection, constraintResult, baselineClass: snapshot.classification });
  return { scenario, projection, impact, snapshot, runId };
}
