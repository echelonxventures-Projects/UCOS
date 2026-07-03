/**
 * UCOS Federation Fabric — Federated Control Plane wrapper + assembly (AD-0018 / FED-ARCH-001).
 *
 * `FederatedControlPlane` adds an ASYNC federated entry point around the UNCHANGED PI-4 ControlPlane:
 * it runs async ingestion (verify + clamp + materialize) then delegates to the existing synchronous
 * authorize/execute path. The PI-4 control-plane source is NOT modified (backward compatible; the 65
 * baseline tests stay valid). `createFederation` wires the whole fabric over an existing substrate +
 * control fabric.
 */

import type { Substrate } from "../../bootstrap.ts";
import type { ControlFabric } from "../bootstrap.ts";
import type { ControlPlane, ControlDecision } from "../control-plane.ts";
import { AuthenticationError, AuthorizationError } from "../errors.ts";
import type { FederationBundle } from "./types.ts";
import { KeyRegistry, NonceCache } from "./assertions.ts";
import { PartitionMonitor } from "./partition-handling.ts";
import { FederationNodeRegistry } from "./federation-node.ts";
import { MembershipRegistry } from "./federation-membership.ts";
import { FederationAuthorityRegistry } from "./federation-authority.ts";
import { TrustBoundaryRegistry } from "./trust-boundary.ts";
import { TrustDelegationRegistry } from "./trust-delegation.ts";
import { PolicyDelegationRegistry } from "./policy-delegation.ts";
import { CertificationAuthorityRegistry } from "./certification-authority.ts";
import { RevocationAuthorityRegistry } from "./revocation-authority.ts";
import { AuditAuthorityRegistry } from "./audit-authority.ts";
import { FederatedIdentityProvider } from "./federated-identity-provider.ts";
import { FederatedTrustAuthority } from "./federated-trust-authority.ts";
import { FederationResolver } from "./federation-resolver.ts";

export class FederatedControlPlane {
  readonly #controlPlane: ControlPlane;
  readonly #resolver: FederationResolver;

  constructor(controlPlane: ControlPlane, resolver: FederationResolver) {
    this.#controlPlane = controlPlane;
    this.#resolver = resolver;
  }

  /** Async: ingest+verify the federated bundle, then authorize (dry) via the sync PI-4 plane. */
  async authorizeFederated(
    bundle: FederationBundle,
    capabilityId: string,
    operation: string,
    input: unknown = null,
  ): Promise<ControlDecision> {
    const res = await this.#resolver.ensure(bundle);
    if (!res.ok || !res.identityId) {
      throw new AuthenticationError(`Federation verification failed: ${res.reason}`, { capabilityId, operation });
    }
    return this.#controlPlane.authorize({ identityId: res.identityId }, capabilityId, operation, input);
  }

  /** Async: ingest+verify then enforce+execute via the unchanged sync PI-4 pipeline. */
  async executeFederated(
    bundle: FederationBundle,
    capabilityId: string,
    operation: string,
    input: unknown,
  ): Promise<unknown> {
    const res = await this.#resolver.ensure(bundle);
    if (!res.ok || !res.identityId) {
      throw new AuthenticationError(`Federation verification failed: ${res.reason}`, { capabilityId, operation });
    }
    return this.#controlPlane.execute({ identityId: res.identityId }, capabilityId, operation, input);
  }

  /** Read-only audit view (delegates to the underlying control plane / its sink). */
  audit(): ReturnType<ControlPlane["audit"]> {
    return this.#controlPlane.audit();
  }
}

export interface FederationOptions {
  nodeId: string; // this node's id (for audit chain attribution)
  boundaryId: string;
  keys?: KeyRegistry;
  nonces?: NonceCache;
  partition?: PartitionMonitor;
  nonceTtlMs?: number;
  materializedTtlMs?: number;
}

export interface FederationFabric {
  keys: KeyRegistry;
  nonces: NonceCache;
  partition: PartitionMonitor;
  nodes: FederationNodeRegistry;
  memberships: MembershipRegistry;
  authorities: FederationAuthorityRegistry;
  boundaries: TrustBoundaryRegistry;
  trustDelegations: TrustDelegationRegistry;
  policyDelegations: PolicyDelegationRegistry;
  certificationAuthorities: CertificationAuthorityRegistry;
  revocations: RevocationAuthorityRegistry;
  auditAuthorities: AuditAuthorityRegistry;
  federatedIdentityProvider: FederatedIdentityProvider;
  federatedTrustAuthority: FederatedTrustAuthority;
  resolver: FederationResolver;
  federatedControlPlane: FederatedControlPlane;
}

/**
 * Stand up the PI-5 federation fabric over an existing substrate + PI-4 control fabric. Registers the
 * federated identity provider and trust authority onto the existing PI-4 IdentityRegistry /
 * TrustEvaluator, so the synchronous decision path resolves materialized federated principals.
 */
export function createFederation(substrate: Substrate, control: ControlFabric, options: FederationOptions): FederationFabric {
  const metadata = substrate.metadata;
  const keys = options.keys ?? new KeyRegistry();
  const nonces = options.nonces ?? new NonceCache();
  const partition = options.partition ?? new PartitionMonitor();

  const nodes = new FederationNodeRegistry(metadata);
  const memberships = new MembershipRegistry(metadata);
  const authorities = new FederationAuthorityRegistry(metadata);
  const boundaries = new TrustBoundaryRegistry(metadata);
  const trustDelegations = new TrustDelegationRegistry(metadata);
  const policyDelegations = new PolicyDelegationRegistry(metadata);
  const certificationAuthorities = new CertificationAuthorityRegistry(metadata, keys);
  const revocations = new RevocationAuthorityRegistry(metadata, partition);
  const auditAuthorities = new AuditAuthorityRegistry(metadata);

  const federatedIdentityProvider = new FederatedIdentityProvider(metadata, revocations);
  const federatedTrustAuthority = new FederatedTrustAuthority(metadata, revocations);

  // Wire the federated seams into the existing PI-4 sync decision path (additive registration).
  control.identityRegistry.registerProvider(federatedIdentityProvider);
  control.trustEvaluator.registerAuthority(federatedTrustAuthority);

  const resolver = new FederationResolver(
    { metadata, keys, nodes, authorities, boundaries, delegations: trustDelegations, memberships, revocations, nonces, partition },
    { boundaryId: options.boundaryId, nonceTtlMs: options.nonceTtlMs, materializedTtlMs: options.materializedTtlMs },
  );

  const federatedControlPlane = new FederatedControlPlane(control.controlPlane, resolver);

  return {
    keys,
    nonces,
    partition,
    nodes,
    memberships,
    authorities,
    boundaries,
    trustDelegations,
    policyDelegations,
    certificationAuthorities,
    revocations,
    auditAuthorities,
    federatedIdentityProvider,
    federatedTrustAuthority,
    resolver,
    federatedControlPlane,
  };
}
