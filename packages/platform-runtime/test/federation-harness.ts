/**
 * Shared test harness for PI-5 federation suites. Not a test file (no ".test.ts").
 * Builds a composed substrate + PI-4 control fabric + wired federation fabric, plus helpers to mint
 * signed identity/trust assertions from a remote authority holding an Ed25519 private key.
 */

import { createSubstrate } from "../src/bootstrap.ts";
import { createControlPlane } from "../src/control/bootstrap.ts";
import type { CapabilityInstance, Descriptor } from "../src/contracts/types.ts";
import { FederatedAuditLog } from "../src/control/federation/federated-audit-log.ts";
import { FederatedCredentialVerifier } from "../src/control/federation/federated-credential-verifier.ts";
import { createFederation } from "../src/control/federation/federated-control-plane.ts";
import { generateKeyPair, signPayload, newNonce } from "../src/control/federation/assertions.ts";
import type { IdentityAssertion, TrustAssertion } from "../src/control/federation/types.ts";
import type { KeyObject } from "node:crypto";

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

export async function buildFederation(options?: { boundaryMaxTrust?: number; delegationMax?: number }) {
  const substrate = createSubstrate();
  substrate.kernel.registerProvider("shout", (): CapabilityInstance => ({
    operations: { produce: (input) => `${(input as { subject?: string })?.subject ?? ""}!`.toUpperCase() },
  }));
  substrate.kernel.loadDescriptors([textContract, shoutCapability]);
  await substrate.kernel.compose();

  const audit = new FederatedAuditLog("node-local");
  const control = createControlPlane(substrate, { credentialVerifier: new FederatedCredentialVerifier(), auditSink: audit });
  const fed = createFederation(substrate, control, { nodeId: "node-local", boundaryId: "b1" });

  // Remote node "nodeB" with an authority holding an Ed25519 keypair.
  const authKeys = generateKeyPair();
  fed.keys.register("keyB", authKeys.publicKeyPem);

  fed.nodes.propose({ nodeId: "nodeB", homeDomain: "domainB", publicKeyRef: "keyB", declaredCapabilities: [] });
  fed.nodes.admit("nodeB", "board");
  fed.memberships.grant({ membershipId: "m-nodeB", nodeId: "nodeB", trustBoundaryId: "b1", scopes: ["*"], grantedBy: "board" });
  fed.authorities.register({ authorityId: "authB", nodeId: "nodeB", powers: ["identity", "trust"], scope: "*", keyRef: "keyB" });
  fed.boundaries.define({
    boundaryId: "b1",
    members: ["authB"],
    maxTrustLevel: options?.boundaryMaxTrust ?? 7,
    acceptedAssertionTypes: ["identity", "trust"],
  });
  fed.trustDelegations.grant({
    delegationId: "d1",
    fromAuthority: "authB",
    scope: "*",
    maxLevel: options?.delegationMax ?? 7,
    expiresAt: Date.now() + 3_600_000,
  });

  return { substrate, control, fed, audit, authKeyPriv: authKeys.privateKey };
}

/** Mint a signed identity assertion from authority `issuer`. */
export function mintIdentity(
  priv: KeyObject,
  opts: {
    nodeId?: string;
    identityId: string;
    issuer?: string;
    permissions: string[];
    kind?: string;
    attributes?: Record<string, unknown>;
    issuedAt?: number;
    expiresAt?: number;
    nonce?: string;
  },
): IdentityAssertion {
  const now = Date.now();
  const base: Omit<IdentityAssertion, "signature"> = {
    assertionType: "identity",
    subject: { nodeId: opts.nodeId ?? "nodeB", identityId: opts.identityId },
    issuer: opts.issuer ?? "authB",
    issuedAt: opts.issuedAt ?? now,
    expiresAt: opts.expiresAt ?? now + 300_000,
    nonce: opts.nonce ?? newNonce(),
    claims: { kind: opts.kind ?? "user", permissions: opts.permissions, attributes: opts.attributes },
  };
  return { ...base, signature: signPayload(base, priv) };
}

/** Mint a signed trust assertion from authority `issuer`. */
export function mintTrust(
  priv: KeyObject,
  opts: { nodeId?: string; identityId: string; issuer?: string; level: number; issuedAt?: number; expiresAt?: number; nonce?: string },
): TrustAssertion {
  const now = Date.now();
  const base: Omit<TrustAssertion, "signature"> = {
    assertionType: "trust",
    subject: { nodeId: opts.nodeId ?? "nodeB", identityId: opts.identityId },
    issuer: opts.issuer ?? "authB",
    issuedAt: opts.issuedAt ?? now,
    expiresAt: opts.expiresAt ?? now + 300_000,
    nonce: opts.nonce ?? newNonce(),
    level: opts.level,
  };
  return { ...base, signature: signPayload(base, priv) };
}

/** Register an allow policy for cap.shout requiring a permission (and optional trust). */
export function allowShout(control: Awaited<ReturnType<typeof buildFederation>>["control"], minTrust?: number): void {
  const rules: import("../src/control/types.ts").PolicyRule[] = [
    { type: "require-permission", permission: "cap.shout:produce" },
  ];
  if (minTrust !== undefined) rules.push({ type: "require-trust", minLevel: minTrust });
  control.policyRegistry.register({
    id: "allow-shout",
    target: { capability: "cap.shout", operation: "produce" },
    effect: "allow",
    rules,
  });
}
