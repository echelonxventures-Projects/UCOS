/**
 * UCOS PI-9 Memory Fabric — public surface (AD-0023).
 *
 * Governed memory capture/consolidate/recall/reconcile/retain/forget across six tiers, built additively
 * over the AD-0016..0021 fabrics. Deny-by-default recall & write, monotonic classification (S4),
 * fail-closed retention/expiry, local sovereignty, separation of duties, signed cross-node bundles,
 * hash-chained audit; all durable mutation routes through the Evolution Fabric. Reuses federation
 * cryptography (no custom crypto). No substrate core dir is modified. Not an Ω∞ memory (AD-0014).
 */

// Types
export type {
  MemoryTier,
  MemoryState,
  RetentionClass,
  Classification,
  MemoryUnit,
  MemorySource,
  MemoryRecord,
  MemoryPower,
  MemoryAuthorityStatus,
  MemoryAuthorityRecord,
  MemoryBoundaryRecord,
  RevocableMemoryKind,
  MemoryBundle,
  MemoryQuery,
  MemoryAuditEvent,
  MemoryAuditEntry,
  VerificationResult,
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
} from "./memory-namespace.ts";

// Unit & record
export { unitHash, validateUnit, createUnit } from "./memory-unit.ts";
export { createRecord, MEMORY_RECORD_SCHEMA } from "./memory-record.ts";
export type { CreateRecordOptions } from "./memory-record.ts";

// Lifecycle & state
export { canTransition, assertTransition, isTerminal } from "./memory-lifecycle.ts";
export { MemoryStateMachine } from "./memory-state-machine.ts";

// Retention & classification
export { MemoryRetention, DEFAULT_RETENTION_POLICY } from "./memory-retention.ts";
export type { RetentionPolicy } from "./memory-retention.ts";

// Store, query, recall, snapshot
export { MemoryStore } from "./memory-store.ts";
export { MemoryQueryEngine } from "./memory-query-engine.ts";
export { MemoryResolver } from "./memory-resolver.ts";
export type { RecallOptions } from "./memory-resolver.ts";
export { MemorySnapshot } from "./memory-snapshot.ts";
export type { MemorySnapshotResult } from "./memory-snapshot.ts";

// Revocation & federation
export { MemoryRevocation } from "./memory-revocation.ts";
export { MemoryFederationGuard } from "./memory-federation-guard.ts";
export { SignedAssertionVerifier } from "./signed-assertion-verifier.ts";
export type { VerifyContext } from "./signed-assertion-verifier.ts";

// Governance authorities (memory-layer SoD: consolidate ≠ certify ≠ ratify)
export { MemoryCertificationAuthority } from "./memory-certification-authority.ts";
export type { MemoryCertification, MemoryCertificationAuthorityRecord } from "./memory-certification-authority.ts";
export { MemoryRatificationAuthority } from "./memory-ratification-authority.ts";
export type { MemoryRatification, MemoryRatificationAuthorityRecord, RatifyInput } from "./memory-ratification-authority.ts";

// Engines
export { MemoryConsolidationEngine } from "./memory-consolidation-engine.ts";
export { MemoryRecallEngine } from "./memory-recall-engine.ts";
export { MemoryReconciliationEngine } from "./memory-reconciliation-engine.ts";

// Volatile-capacity control (M12) & memory↔knowledge co-ratification guard (M11)
export { MemoryCapacity } from "./memory-capacity.ts";
export type { MemoryCapacityPolicy } from "./memory-capacity.ts";
export { MemoryKnowledgeGuard } from "./memory-knowledge-guard.ts";
export type { MemoryKnowledgeOracle } from "./memory-knowledge-guard.ts";

// Audit
export { MemoryAuditLog, MEM_GENESIS_HASH } from "./memory-audit.ts";
export type { MemoryChainedEntry, MemDivergence, MemReconciliationResult } from "./memory-audit.ts";

// Control assembly + evolution integration
export { MemoryControl, createMemory } from "./memory-control.ts";
export type { MemoryOptions, MemoryCommitOptions } from "./memory-control.ts";
