/**
 * UCOS PI-6 Evolution Fabric — shared types (AD-0019).
 *
 * The Evolution Fabric governs *managed change to the composed system over time* — introducing,
 * superseding, and rolling back capabilities/contracts, configuration, and metadata under
 * proposal -> approval -> certification -> ratification -> apply -> (active | rolled-back | failed),
 * with a tamper-evident audit trail. It realizes the ratified immutable principles IP-14
 * (Migration-Only Evolution) and IP-15 (Backward-Compatibility Governance).
 *
 * All evolution state is runtime data stored under the reserved `evolution:` metadata namespace.
 * Nothing here modifies a substrate core dir; the fabric orchestrates only the PUBLIC substrate
 * seams (RegistryPort, MetadataPort, ConfigurationPort, MetaCoreKernel public API). It is
 * categorically distinct from the deferred Ω∞ existential self-evolution (AD-0014): the governor
 * (EVO-GOVERNOR-001) STRUCTURALLY prohibits self-modification and recursion.
 */

import type { Descriptor, JsonSchema, SemVer } from "../../contracts/types.ts";

// ------------------------------ Evolution lifecycle ------------------------------

export type EvolutionState =
  | "proposed"
  | "reviewed"
  | "approved"
  | "certified"
  | "ratified"
  | "applied"
  | "active"
  | "rolled-back"
  | "failed";

export type ChangeClass = "routine" | "sensitive" | "federation-touching";

// -------------------------------- Units & targets --------------------------------

/**
 * Declared target namespaces of an evolution unit. The governor validates every target against a
 * positive evolvable allowlist and a reserved/prohibited set (deny-by-default).
 */
export type EvolutionTarget =
  | { kind: "registry"; id: string }
  | { kind: "config"; layer: string; capabilityId: string }
  | { kind: "metadata"; keyPrefix: string };

/** The concrete, reversible runtime mutations an evolution unit performs. */
export type EvolutionOp =
  | { op: "load-descriptor"; descriptor: Descriptor }
  | { op: "set-config"; layer: string; capabilityId: string; values: Record<string, unknown> }
  | { op: "put-metadata"; key: string; value: unknown };

/** The reverse mutation captured at apply time, replayed (in reverse order) on rollback. */
export type ReverseOp =
  | { op: "unregister"; id: string; version: SemVer }
  | { op: "set-config"; layer: string; capabilityId: string; values: Record<string, unknown> }
  | { op: "put-metadata"; key: string; value: unknown; schema?: JsonSchema }
  | { op: "noop" };

/** Immutable, content-hashed change set. */
export interface EvolutionUnit {
  unitId: string;
  title: string;
  changeClass: ChangeClass;
  targets: EvolutionTarget[];
  ops: EvolutionOp[];
  /** Declared source paths this unit touches (self-modification detection; normally empty). */
  codePaths?: string[];
  /** Nesting depth; MUST be 0 (no recursive/child evolution). */
  depth?: number;
}

// ---------------------------- Signed governance artifacts ----------------------------

export type ProposalOrigin = "external" | "evolution-execution";

export interface EvolutionProposal {
  proposalId: string;
  unitHash: string;
  unit: EvolutionUnit;
  proposer: string; // principal id
  proposerKeyRef: string; // resolves to a public key in the KeyRegistry (S3: no key material inline)
  origin: ProposalOrigin;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  rationale?: string;
  signature?: string; // hex over canonical(proposal without `signature`)
}

export interface ApprovalRecord {
  unitHash: string;
  approver: string; // principal id (distinct from proposer)
  at: number;
  reason?: string;
}

export interface EvolutionCertification {
  certificationId: string;
  unitHash: string;
  caId: string;
  certifier: string; // principal id
  certifierKeyRef: string;
  verdict: "pass" | "fail";
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  signature?: string;
}

export interface EvolutionRatification {
  ratificationId: string;
  unitHash: string;
  raId: string;
  ratifier: string; // principal id
  ratifierKeyRef: string;
  proposer: string; // for separation-of-duties cross-checks
  certifier: string;
  approvals: string[]; // approver principal ids
  certificationId: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  signature?: string;
}

/** Federation re-ratification token — required for any federation-touching evolution (EVO-FED-001). */
export interface FederationReRatificationToken {
  tokenId: string;
  scope: string; // e.g. "federation:boundary:b1" or "federation:*"
  issuerKeyRef: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  signature?: string;
}

// ------------------------------- Authority records -------------------------------

export type EvoAuthorityStatus = "active" | "revoked";

export interface EvolutionCARecord {
  caId: string;
  owner: string; // principal id of the certifier
  keyRef: string;
  status: EvoAuthorityStatus;
}

export interface EvolutionRARecord {
  raId: string;
  owner: string; // principal id of the ratifier
  keyRef: string;
  quorum: number; // minimum distinct approvers required
  status: EvoAuthorityStatus;
}

export type RevocableEvoKind = "proposal" | "certification" | "ratification" | "authority" | "unit";

// -------------------------------- Snapshot & state --------------------------------

export interface StateCapture {
  registry: { key: string; descriptor: unknown }[];
  config: { key: string; value: unknown }[];
  metadata: { key: string; value: unknown }[];
}

export interface EvolutionSnapshot {
  snapshotId: string;
  unitHash: string;
  capturedAt: number;
  stateHash: string;
  capture: StateCapture;
}

// ---------------------------------- Governor ----------------------------------

export interface GovernorLimits {
  maxProposalsPerWindow: number;
  maxAppliedPerWindow: number;
  windowMs: number;
}

export interface GovernorConfig {
  /** Positive allowlist of evolvable namespace prefixes (deny-by-default outside it). */
  evolvableAllowlist: string[];
  /** Prohibited source-path prefixes (the five core dirs + the evolution self-dir) — E10. */
  prohibitedCodePaths: string[];
  /** Reserved metadata prefixes evolution may never target (its own + federation) — E10. */
  reservedMetadataPrefixes: string[];
  limits: GovernorLimits;
}

export interface GovernorDecision {
  ok: boolean;
  reason: string;
}

// ----------------------------------- Audit -----------------------------------

export type EvolutionAuditEvent =
  | "PROPOSED"
  | "REVIEWED"
  | "APPROVED"
  | "CERTIFIED"
  | "RATIFIED"
  | "SNAPSHOT"
  | "APPLY_BEGIN"
  | "APPLIED"
  | "ROLLBACK_BEGIN"
  | "ROLLED_BACK"
  | "FAILED"
  | "REVOKED"
  | "HALTED";

export interface EvolutionAuditEntry {
  at: number;
  event: EvolutionAuditEvent;
  unitHash: string;
  actor: string;
  detail: string;
  stateHash?: string;
}

// ----------------------------------- Results -----------------------------------

export interface VerificationResult {
  ok: boolean;
  reason: string;
}

export interface ApplyResult {
  status: "applied" | "rolled-back";
  unitHash: string;
  reason: string;
  preStateHash: string;
  postStateHash: string;
}

// --------------------------------- Tombstone ---------------------------------

/** Logical-absent marker for a metadata key that did not exist prior to an evolution. */
export const TOMBSTONE = { __evoTombstone: true } as const;

export function isTombstone(value: unknown): boolean {
  return typeof value === "object" && value !== null && (value as { __evoTombstone?: unknown }).__evoTombstone === true;
}
