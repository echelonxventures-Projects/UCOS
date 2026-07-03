/**
 * Shared test harness for PI-6 evolution suites. Not a test file (no ".test.ts").
 * Builds a composed substrate + PI-4 control fabric + wired PI-6 evolution fabric, plus helpers to
 * drive a unit through the full lifecycle (propose -> approve -> certify -> ratify -> apply) with
 * distinct signing keys per role (separation of duties).
 */

import type { KeyObject } from "node:crypto";
import { createSubstrate } from "../src/bootstrap.ts";
import { createControlPlane } from "../src/control/bootstrap.ts";
import type { CapabilityInstance, Descriptor } from "../src/contracts/types.ts";
import { generateKeyPair } from "../src/control/federation/assertions.ts";
import { createEvolution } from "../src/control/evolution/evolution-apply-orchestrator.ts";
import { mintProposal } from "../src/control/evolution/evolution-proposal.ts";
import { createUnit, unitHash } from "../src/control/evolution/evolution-unit.ts";
import type { EvolutionUnit } from "../src/control/evolution/types.ts";

export const textContract: Descriptor = {
  kind: "contract",
  id: "contract.text-producer",
  version: "1.0.0",
  operations: [
    {
      name: "produce",
      input: { type: "object", properties: { subject: { type: "string" } }, additionalProperties: false },
      output: { type: "string" },
    },
  ],
};

export const shoutCapability: Descriptor = {
  kind: "capability",
  id: "cap.shout",
  version: "1.0.0",
  name: "Shout",
  contract: { id: "contract.text-producer", versionRange: "^1.0.0" },
  provider: { module: "plugin:shout", export: "create" },
};

export interface EvoRoleKeys {
  proposer: KeyObject;
  certifier: KeyObject;
  ratifier: KeyObject;
}

export async function buildEvolution(evolvableAllowlist?: string[]) {
  const substrate = createSubstrate();
  substrate.kernel.registerProvider("shout", (): CapabilityInstance => ({
    operations: { produce: (input) => `${(input as { subject?: string })?.subject ?? ""}!`.toUpperCase() },
  }));
  substrate.kernel.loadDescriptors([textContract, shoutCapability]);
  await substrate.kernel.compose();

  const control = createControlPlane(substrate);
  const evo = createEvolution(substrate, evolvableAllowlist ? { nodeId: "node-local", evolvableAllowlist } : { nodeId: "node-local" });

  // Distinct role keys (separation of duties).
  const proposerKeys = generateKeyPair();
  const certifierKeys = generateKeyPair();
  const ratifierKeys = generateKeyPair();
  evo.keys.register("proposerKey", proposerKeys.publicKeyPem);
  evo.keys.register("certifierKey", certifierKeys.publicKeyPem);
  evo.keys.register("ratifierKey", ratifierKeys.publicKeyPem);

  // Register the certification + ratification authorities (owners are distinct principals).
  evo.certifications.register({ caId: "ca1", owner: "carol-certifier", keyRef: "certifierKey" });
  evo.ratifications.register({ raId: "ra1", owner: "rachel-ratifier", keyRef: "ratifierKey", quorum: 1 });

  const roleKeys: EvoRoleKeys = { proposer: proposerKeys.privateKey, certifier: certifierKeys.privateKey, ratifier: ratifierKeys.privateKey };
  return { substrate, control, evo, roleKeys };
}

/** A simple, allowlisted unit that writes an app-metadata key. */
export function appMetadataUnit(unitId: string, key = "app:feature:flag", value: unknown = { enabled: true }): EvolutionUnit {
  return createUnit({
    unitId,
    title: `set ${key}`,
    changeClass: "routine",
    targets: [{ kind: "metadata", keyPrefix: key }],
    ops: [{ op: "put-metadata", key, value }],
  });
}

/** A config unit on the evolution-owned layer for cap.shout. */
export function configUnit(unitId: string, values: Record<string, unknown> = { greeting: "hi" }): EvolutionUnit {
  return createUnit({
    unitId,
    title: "set cap.shout config",
    changeClass: "routine",
    targets: [{ kind: "config", layer: "evolution", capabilityId: "cap.shout" }],
    ops: [{ op: "set-config", layer: "evolution", capabilityId: "cap.shout", values }],
  });
}

export interface DriveOptions {
  proposer?: string;
  approver?: string;
  origin?: "external" | "evolution-execution";
}

/**
 * Drive a unit through propose -> approve -> certify -> ratify, returning the unitHash ready to apply.
 * Uses distinct principals per role to satisfy separation of duties.
 */
export function ratifyUnit(
  evo: Awaited<ReturnType<typeof buildEvolution>>["evo"],
  keys: EvoRoleKeys,
  unit: EvolutionUnit,
  opts: DriveOptions = {},
): string {
  const proposer = opts.proposer ?? "pat-proposer";
  const approver = opts.approver ?? "alan-approver";
  const uh = unitHash(unit);

  const proposal = mintProposal(keys.proposer, {
    proposalId: `prop-${unit.unitId}`,
    unit,
    proposer,
    proposerKeyRef: "proposerKey",
    origin: opts.origin ?? "external",
  });
  evo.orchestrator.submit(proposal);
  evo.orchestrator.approve(uh, approver);

  const cert = evo.certifications.issue(keys.certifier, { unitHash: uh, caId: "ca1" });
  evo.orchestrator.recordCertification(cert);

  const rat = evo.ratifications.issue(keys.ratifier, {
    unitHash: uh,
    raId: "ra1",
    proposer,
    certifier: "carol-certifier",
    approvals: [approver],
    certificationId: cert.certificationId,
  });
  evo.orchestrator.ratify(rat);
  return uh;
}
