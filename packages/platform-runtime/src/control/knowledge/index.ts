/**
 * UCOS PI-7 Knowledge Fabric — public surface (AD-0020).
 *
 * Governed knowledge store/query/federation/evolution, built additively over the AD-0016..0019
 * fabrics. Deny-by-default, fail-closed, trust-clamped, separation of duties, signed transitions,
 * hash-chained audit; all governed mutation routes through the Evolution Fabric. Reuses federation
 * cryptography (no custom crypto). No substrate core dir is modified.
 */

// Types (explicit to avoid re-export ambiguity with federation/evolution VerificationResult).
export type {
  KnowledgeState,
  KnowledgeClass,
  KnowledgeUnit,
  KnowledgeSource,
  KnowledgeRecord,
  KnowledgePower,
  KnowledgeAuthorityStatus,
  KnowledgeAuthorityRecord,
  KnowledgeBoundaryRecord,
  RevocableKnowledgeKind,
  KnowledgeCertification,
  KnowledgeRatification,
  KnowledgeFederationToken,
  KnowledgeBundle,
  KnowledgeQuery,
  KnowledgeAuditEvent,
  KnowledgeAuditEntry,
} from "./types.ts";

// Namespace helpers
export {
  recordKey,
  recordIdPrefix,
  recordNamespacePrefix,
  authorityKey,
  boundaryKey,
  revokedKey,
  nsTail,
  namespacedId,
  parseNamespacedId,
  RECORD_PREFIX,
  AUTHORITY_PREFIX,
  BOUNDARY_PREFIX,
  REVOKED_PREFIX,
} from "./knowledge-namespace.ts";

// Unit & record
export { unitHash, validateUnit, createUnit } from "./knowledge-unit.ts";
export { createRecord, KNOWLEDGE_RECORD_SCHEMA } from "./knowledge-record.ts";
export type { CreateRecordOptions } from "./knowledge-record.ts";

// Lifecycle & state
export { canTransition, assertTransition, isTerminal } from "./knowledge-lifecycle.ts";
export { KnowledgeStateMachine } from "./knowledge-state-machine.ts";

// Registry & store
export { KnowledgeRegistry } from "./knowledge-registry.ts";
export { KnowledgeStore } from "./knowledge-store.ts";

// Query & resolve
export { KnowledgeQueryEngine } from "./knowledge-query-engine.ts";
export { KnowledgeResolver } from "./knowledge-resolver.ts";

// Authorities
export { KnowledgeCertificationAuthority } from "./knowledge-certification-authority.ts";
export { KnowledgeRatificationAuthority } from "./knowledge-ratification-authority.ts";
export { KnowledgeRevocationAuthority } from "./knowledge-revocation-authority.ts";

// Security / lineage
export { KnowledgeLineage } from "./knowledge-lineage.ts";

// Federation / snapshot / import-export
export { KnowledgeFederationGuard } from "./knowledge-federation-guard.ts";
export { KnowledgeSnapshot } from "./knowledge-snapshot.ts";
export type { KnowledgeSnapshotResult } from "./knowledge-snapshot.ts";
export { KnowledgeImportExport } from "./knowledge-import-export.ts";

// Audit
export { KnowledgeAuditLog, KNOW_GENESIS_HASH } from "./knowledge-audit-log.ts";
export type { KnowledgeChainedEntry, KnowDivergence, KnowReconciliationResult } from "./knowledge-audit-log.ts";

// Control assembly + evolution integration
export { KnowledgeControl, createKnowledge } from "./knowledge-control.ts";
export type { KnowledgeOptions, KnowledgeCommitOptions } from "./knowledge-control.ts";
