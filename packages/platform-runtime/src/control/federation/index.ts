/**
 * UCOS PI-5 Federation Fabric — public surface (AD-0018).
 *
 * Built additively on the AD-0016 substrate and AD-0017 control fabrics. Cross-domain identity/trust
 * via cryptographically signed assertions; deny-by-default; local sovereignty; clamped federated
 * trust; provenance by convention (no core-port fields); hash-chained tamper-evident audit;
 * fail-closed partition handling. No substrate core dir is modified.
 */

// Types & helpers
export * from "./types.ts";

// Crypto & security primitives
export {
  canonicalize,
  sha256,
  generateKeyPair,
  signPayload,
  verifyPayload,
  newNonce,
  isFresh,
  KeyRegistry,
  NonceCache,
} from "./assertions.ts";
export type { Ed25519KeyPair } from "./assertions.ts";

// Governance registries
export { FederationNodeRegistry } from "./federation-node.ts";
export { MembershipRegistry } from "./federation-membership.ts";
export { FederationAuthorityRegistry } from "./federation-authority.ts";
export { TrustBoundaryRegistry } from "./trust-boundary.ts";
export { TrustDelegationRegistry } from "./trust-delegation.ts";
export { PolicyDelegationRegistry } from "./policy-delegation.ts";
export { CertificationAuthorityRegistry } from "./certification-authority.ts";
export { RevocationAuthorityRegistry } from "./revocation-authority.ts";
export { AuditAuthorityRegistry } from "./audit-authority.ts";
export type { Divergence, DivergenceClass, ReconciliationResult } from "./audit-authority.ts";

// Provenance & resolution
export { FederatedIdentityProvider, materializedKey } from "./federated-identity-provider.ts";
export type { MaterializedIdentity } from "./federated-identity-provider.ts";
export { FederatedTrustAuthority } from "./federated-trust-authority.ts";
export { FederatedCredentialVerifier } from "./federated-credential-verifier.ts";
export { FederationResolver } from "./federation-resolver.ts";
export type { FederationResolverPorts, FederationResolverOptions, EnsureResult } from "./federation-resolver.ts";

// Partition handling
export { PartitionMonitor, withinStaleness } from "./partition-handling.ts";

// Audit
export { FederatedAuditLog, GENESIS_HASH } from "./federated-audit-log.ts";
export type { ChainedEntry } from "./federated-audit-log.ts";

// Control plane + assembly
export { FederatedControlPlane, createFederation } from "./federated-control-plane.ts";
export type { FederationOptions, FederationFabric } from "./federated-control-plane.ts";
