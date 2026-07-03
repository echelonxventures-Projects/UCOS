/**
 * UCOS Control Fabrics — assembly (AD-0017).
 *
 * Wires the Identity, Trust, Policy, and Governance runtimes and the Control Plane over an
 * EXISTING substrate. It is purely additive: it consumes the substrate's public Metadata runtime
 * and Meta-Core kernel and adds the control plane on top without touching the substrate core.
 *
 * All control state (identities, policies, governance processes/approvals/certifications) lives
 * in the substrate Metadata runtime — registry/metadata/configuration-first, 0 hardcoded
 * identities/permissions/policies.
 */

import type { Substrate } from "../bootstrap.ts";
import { IdentityRegistry } from "./identity/identity-registry.ts";
import { IdentityResolver } from "./identity/identity-resolver.ts";
import { TokenCredentialVerifier, type CredentialVerifier } from "./identity/credential-verifier.ts";
import { TrustEvaluator } from "./trust/trust-evaluator.ts";
import { PolicyRegistry } from "./policy/policy-registry.ts";
import { PolicyEvaluator } from "./policy/policy-evaluator.ts";
import { GovernanceRegistry } from "./governance/governance-registry.ts";
import { InMemoryAuditLog, type AuditSink } from "./audit-log.ts";
import { ControlPlane } from "./control-plane.ts";

export interface ControlPlaneOptions {
  /** Override the default (substrate-level) credential verifier with a production verifier. */
  credentialVerifier?: CredentialVerifier;
  /** Override the default in-memory append-only audit sink with a durable one. */
  auditSink?: AuditSink;
}

export interface ControlFabric {
  identityRegistry: IdentityRegistry;
  identityResolver: IdentityResolver;
  trustEvaluator: TrustEvaluator;
  policyRegistry: PolicyRegistry;
  policyEvaluator: PolicyEvaluator;
  governance: GovernanceRegistry;
  audit: AuditSink;
  controlPlane: ControlPlane;
}

/** Stand up the PI-4 control fabrics on top of an existing substrate. */
export function createControlPlane(substrate: Substrate, options: ControlPlaneOptions = {}): ControlFabric {
  const metadata = substrate.metadata;

  const identityRegistry = new IdentityRegistry(metadata);
  const verifier = options.credentialVerifier ?? new TokenCredentialVerifier();
  const identityResolver = new IdentityResolver(identityRegistry, verifier);
  const trustEvaluator = new TrustEvaluator();
  const policyRegistry = new PolicyRegistry(metadata);
  const governance = new GovernanceRegistry(metadata);
  const policyEvaluator = new PolicyEvaluator(policyRegistry, governance);
  const audit = options.auditSink ?? new InMemoryAuditLog();

  const controlPlane = new ControlPlane({
    kernel: substrate.kernel,
    identity: identityResolver,
    trust: trustEvaluator,
    policy: policyEvaluator,
    audit,
  });

  return {
    identityRegistry,
    identityResolver,
    trustEvaluator,
    policyRegistry,
    policyEvaluator,
    governance,
    audit,
    controlPlane,
  };
}
