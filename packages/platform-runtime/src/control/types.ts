/**
 * UCOS PI-4 Control Fabrics — shared types.
 *
 * Identity, Trust, Policy, and Governance are all runtime-driven: their records are stored in
 * the substrate's Metadata + Configuration runtimes and interpreted by the control engines.
 * There are no hardcoded identities, permissions, or policies anywhere in this layer.
 */

// ----------------------------- Identity -----------------------------

export interface Credential {
  scheme: string; // e.g. "token"
  value: string;
}

export type IdentityStatus = "active" | "suspended" | "retired";

export interface IdentityRecord {
  id: string;
  /** Species-agnostic principal kind (user | service | agent | tenant | ...future). Open by design. */
  kind: string;
  status: IdentityStatus;
  /** Permission grants, e.g. "cap.greeting:produce", "cap.*:*", "*". */
  permissions: string[];
  trust?: { level: number; attributes?: Record<string, unknown> };
  credentials?: Credential[];
  attributes?: Record<string, unknown>;
}

export interface PrincipalRef {
  identityId: string;
  credential?: Credential;
}

/** Federation seam: external identity authorities implement this. */
export interface IdentityProvider {
  readonly name: string;
  resolve(identityId: string): IdentityRecord | undefined;
}

// ------------------------------- Trust ------------------------------

export interface TrustRequirement {
  minLevel?: number;
  attributes?: Record<string, unknown>;
}

/** Federation seam: external trust authorities implement this. */
export interface TrustAuthority {
  readonly name: string;
  levelFor(identityId: string): number | undefined;
}

// ------------------------------ Policy ------------------------------

export type PolicyEffect = "allow" | "deny";

export interface PolicyTarget {
  /** Capability id, "*", or a "prefix.*" glob. Omitted = any. */
  capability?: string;
  /** Operation name, "*", or omitted = any. */
  operation?: string;
}

export type PolicyRule =
  | { type: "require-permission"; permission: string }
  | { type: "require-trust"; minLevel: number }
  | { type: "require-attribute"; key: string; equals: unknown }
  | { type: "require-governance-approval"; process: string }
  | { type: "require-certification"; certification: string };

export interface PolicyRecord {
  id: string;
  /** Omitted target applies to any capability/operation. */
  target?: PolicyTarget;
  effect: PolicyEffect;
  rules: PolicyRule[];
  /** Higher priority wins among same-effect matches; deny always overrides allow. */
  priority?: number;
  description?: string;
}

// ---------------------------- Governance ----------------------------

export interface GovernanceProcess {
  id: string;
  kind: "approval" | "certification";
  description?: string;
}

export interface ApprovalRecord {
  process: string;
  subject: string;
  decision: "approved" | "rejected";
  approver: string;
  at: number;
  reason?: string;
}

export interface CertificationRecord {
  id: string;
  subject: string;
  status: "certified" | "revoked";
  authority: string;
  at: number;
}

// --------------------------- Decision flow --------------------------

export interface DecisionContext {
  identity: IdentityRecord;
  trustLevel: number;
  capabilityId: string;
  operation: string;
  input: unknown;
  config: Record<string, unknown>;
}

export interface Decision {
  effect: PolicyEffect;
  reason: string;
  matchedPolicies: string[];
}

export interface AuditEntry {
  at: number;
  identityId: string;
  capabilityId: string;
  operation: string;
  effect: PolicyEffect | "authn-denied";
  reason: string;
}

// ----------------- Federation seams (additive; AD-0018 / FED-ARCH-001) -----------------

/**
 * Origin/provenance envelope carried in DATA (never as a core-port field). For federated
 * artifacts it records the home node, the asserting authority, and verification evidence.
 * Local artifacts use `origin: "local"`. See FED-PROV-001.
 */
export interface Provenance {
  origin: "local" | { nodeId: string; homeDomain?: string };
  assertedBy?: string;
  assertionRef?: string;
  verifiedAt?: number;
  signatureRef?: string;
}

/**
 * Async federation identity seam (FED-ARCH-001 §3). Added ALONGSIDE the synchronous
 * `IdentityProvider` — existing sync providers are unchanged and remain valid.
 */
export interface AsyncIdentityProvider {
  readonly name: string;
  resolve(identityId: string): Promise<IdentityRecord | undefined>;
}

/** Async federation trust seam (FED-ARCH-001 §3). Added alongside the sync `TrustAuthority`. */
export interface AsyncTrustAuthority {
  readonly name: string;
  levelFor(identityId: string): Promise<number | undefined>;
}
