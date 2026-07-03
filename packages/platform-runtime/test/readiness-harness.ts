/**
 * Shared test harness for PI-12 Ultimate Readiness Fabric suites (B06). Not a test file (no ".test.ts").
 *
 * Builds a composed substrate + wired Readiness Fabric with two distinct governance authorities
 * (an assessor and an independent certifier) so separation-of-duties can be satisfied, and provides
 * helpers to register dimensions/criteria/controls/requirements and to ingest signals.
 */

import type { KeyObject } from "node:crypto";
import { createSubstrate } from "../src/bootstrap.ts";
import type { CapabilityInstance, Descriptor } from "../src/contracts/types.ts";
import { generateKeyPair } from "../src/control/federation/assertions.ts";
import { createReadiness } from "../src/control/readiness/readiness-control.ts";
import type {
  ReadinessDimension,
  ReadinessSignal,
  SignalStatus,
} from "../src/control/readiness/types.ts";

const textContract: Descriptor = {
  kind: "contract",
  id: "contract.text-producer",
  version: "1.0.0",
  operations: [{ name: "produce", input: { type: "object" }, output: { type: "string" } }],
};
const shoutCapability: Descriptor = {
  kind: "capability",
  id: "cap.shout",
  version: "1.0.0",
  name: "Shout",
  contract: { id: "contract.text-producer", versionRange: "^1.0.0" },
  provider: { module: "plugin:shout", export: "create" },
};

export interface Governance {
  /** Independent certifier authority + its signing key. */
  certifierKey: KeyObject;
  caId: string;
  certifierAuthorityId: string;
  certifierOwner: string;
  assessorAuthorityId: string;
  assessorOwner: string;
}

/**
 * Stand up a Readiness Fabric. By default it wires two distinct authorities (assessor + certifier) so
 * SoD is enforceable and self-inspection passes; pass `withGovernance: false` to omit them.
 */
export async function buildReadiness(opts: { withGovernance?: boolean; readyThreshold?: number } = {}) {
  const substrate = createSubstrate();
  substrate.kernel.registerProvider("shout", (): CapabilityInstance => ({ operations: { produce: () => "OK" } }));
  substrate.kernel.loadDescriptors([textContract, shoutCapability]);
  await substrate.kernel.compose();

  const rdn = createReadiness(substrate, {
    nodeId: "node-local",
    ...(opts.readyThreshold !== undefined ? { readyThreshold: opts.readyThreshold } : {}),
  });

  let governance: Governance | undefined;
  if (opts.withGovernance !== false) {
    const certKp = generateKeyPair();
    const caId = "rdn-ca-1";
    const certifierOwner = "board-certifier";
    const assessorOwner = "readiness-monitor";
    // Certifier authority (holds certify) + its certification authority (public key registered).
    rdn.registerAuthority({ authorityId: "auth-certifier", owner: certifierOwner, powers: ["certify", "revoke"], keyRef: "k-cert", scope: "*" });
    rdn.registerCertificationAuthority({ caId, owner: certifierOwner, keyRef: "k-cert" }, certKp.publicKeyPem);
    // Independent assessor authority (holds assess) — distinct owner => SoD enforceable.
    rdn.registerAuthority({ authorityId: "auth-assessor", owner: assessorOwner, powers: ["assess", "inspect"], keyRef: "k-assess", scope: "*" });
    governance = {
      certifierKey: certKp.privateKey,
      caId,
      certifierAuthorityId: "auth-certifier",
      certifierOwner,
      assessorAuthorityId: "auth-assessor",
      assessorOwner,
    };
  }

  return { substrate, rdn, governance };
}

export function dim(dimensionId: string, opts: { weight?: number; critical?: boolean; title?: string } = {}): ReadinessDimension {
  return {
    dimensionId,
    title: opts.title ?? dimensionId,
    weight: opts.weight ?? 1,
    critical: opts.critical ?? false,
  };
}

let signalSeq = 0;
export function signal(
  dimensionId: string,
  opts: { status?: SignalStatus; score?: number; source?: string; observedAt?: number; signalId?: string } = {},
): ReadinessSignal {
  return {
    signalId: opts.signalId ?? `sig-${signalSeq++}`,
    dimensionId,
    source: opts.source ?? "probe-a",
    status: opts.status ?? "pass",
    score: opts.score ?? 1,
    observedAt: opts.observedAt ?? Date.now(),
  };
}

export { generateKeyPair };
