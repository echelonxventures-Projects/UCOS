/**
 * UCOS PI-5 Federation Fabric — shared types (AD-0018).
 *
 * All federation state is runtime data stored in the substrate Metadata runtime under the reserved
 * `federation:` key namespace (FED-PROV-001). Cross-domain claims are SIGNED assertions (FED-SEC-001),
 * never raw records. Nothing here modifies a substrate core dir; provenance is carried in data.
 */

// --------------------------- Governance records (FED-GOV-001) ---------------------------

export type NodeStatus = "proposed" | "admitted" | "suspended" | "expelled";

export interface FederationNodeRecord {
  nodeId: string;
  homeDomain: string;
  publicKeyRef: string; // resolves to a public key in the KeyRegistry (S3: no key material inline)
  declaredCapabilities: string[];
  status: NodeStatus;
  admittedAt?: number;
  admittedBy?: string;
}

export type MembershipStatus = "pending" | "active" | "suspended" | "revoked";

export interface MembershipRecord {
  membershipId: string;
  nodeId: string;
  trustBoundaryId: string;
  scopes: string[];
  grantedBy: string;
  grantedAt: number;
  expiresAt?: number;
  status: MembershipStatus;
}

export type FederationPower = "identity" | "trust" | "policy" | "certification" | "revocation" | "audit";
export type AuthorityStatus = "registered" | "active" | "suspended" | "revoked";

export interface FederationAuthorityRecord {
  authorityId: string;
  nodeId: string;
  powers: FederationPower[]; // enumerated allow-list; no implicit powers (T8)
  scope: string;
  keyRef: string;
  status: AuthorityStatus;
}

export interface TrustBoundaryRecord {
  boundaryId: string;
  members: string[]; // authorityIds accepted within this boundary
  defaultEffect: "deny"; // always deny (FGP-2)
  maxTrustLevel: number; // ceiling any in-boundary authority may confer (T2)
  acceptedAssertionTypes: AssertionType[];
}

export interface TrustDelegationRecord {
  delegationId: string;
  fromAuthority: string;
  scope: string;
  maxLevel: number;
  depth: number; // default 0 => non-transitive
  expiresAt: number;
  revocable: true;
}

export interface PolicyDelegationRecord {
  delegationId: string;
  fromNode: string;
  effectConstraint: "deny-only"; // foreign policy may only deny (FGP-1 / T3)
  targetScope: string;
  expiresAt?: number;
}

export interface CertificationAuthorityRecord {
  caId: string;
  authorityId: string;
  keyRef: string;
  chainMaxDepth: number;
  status: AuthorityStatus;
}

export interface RevocationAuthorityRecord {
  revAuthorityId: string;
  authorityId: string;
  revocableKinds: RevocableKind[];
  keyRef: string;
}

export type RevocableKind = "identity" | "trust" | "certification" | "membership";

export interface AuditAuthorityRecord {
  auditAuthorityId: string;
  authorityId: string;
  reconcileScope: string;
  keyRef: string;
}

export interface SuspensionRecord {
  suspensionId: string;
  nodeId: string;
  reason: string;
  at: number;
  by: string;
}

export interface ExpulsionRecord {
  expulsionId: string;
  nodeId: string;
  reason: string;
  at: number;
  by: string;
}

// ----------------------------- Signed assertions (FED-SEC-001) -----------------------------

export type AssertionType = "identity" | "trust";

export interface AssertionSubject {
  nodeId: string;
  identityId: string; // local id at the home node; namespaced form is `${nodeId}::${identityId}`
}

export interface AssertionEnvelope {
  assertionType: AssertionType;
  subject: AssertionSubject;
  issuer: string; // authorityId
  issuedAt: number;
  expiresAt: number;
  nonce: string;
}

export interface IdentityAssertion extends AssertionEnvelope {
  assertionType: "identity";
  claims: { kind: string; permissions: string[]; attributes?: Record<string, unknown> };
  signature?: string; // hex; over canonical(assertion without `signature`)
}

export interface TrustAssertion extends AssertionEnvelope {
  assertionType: "trust";
  level: number;
  signature?: string;
}

export interface SignedCertification {
  certificationId: string;
  subject: string;
  caId: string;
  issuedAt: number;
  expiresAt: number;
  signature?: string;
}

/** Bundle presented for a federated request. */
export interface FederationBundle {
  identity: IdentityAssertion;
  trust?: TrustAssertion;
}

// ------------------------------- Verification results -------------------------------

export interface VerificationResult {
  ok: boolean;
  reason: string;
}

/** The fully namespaced principal id form. */
export function namespacedId(nodeId: string, identityId: string): string {
  return `${nodeId}::${identityId}`;
}

/** Parse a namespaced id back into (nodeId, localId); returns undefined if not namespaced. */
export function parseNamespacedId(id: string): { nodeId: string; localId: string } | undefined {
  const idx = id.indexOf("::");
  if (idx < 0) return undefined;
  return { nodeId: id.slice(0, idx), localId: id.slice(idx + 2) };
}
