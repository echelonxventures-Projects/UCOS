/**
 * UCOS PI-9 Memory Fabric — shared types (AD-0023).
 *
 * The Memory Fabric captures, consolidates, indexes, recalls, reconciles, retains, and forgets memory
 * as first-class signed, versioned, provenance-bearing, classification-bound records under the reserved
 * `memory:` metadata namespace, across six governed tiers. It is additive over the ratified substrate +
 * control + federation + evolution + knowledge fabrics and modifies no core dir. All durable memory
 * mutation routes through the Evolution Fabric; all cross-node memory is signed (reusing federation
 * cryptography — no custom crypto). It is NOT an Ω∞ self-directed memory (AD-0014 stands).
 */

import type { SemVer } from "../../contracts/types.ts";
import type { Provenance } from "../types.ts";

// ------------------------------ Tiers & lifecycle ------------------------------

/** The six governed memory tiers (MEM-GOV-001 §2). */
export type MemoryTier = "working" | "short-term" | "long-term" | "semantic" | "episodic" | "federated";

/**
 * Unified memory lifecycle state (MEM-GOV-002 §1). Working memory uses the ephemeral path
 * (captured → active/consolidated/expired); durable tiers use the governed path
 * (proposed → certified → ratified → active). `forgotten` and `expired` are terminal.
 */
export type MemoryState =
  | "captured"
  | "proposed"
  | "certified"
  | "ratified"
  | "active"
  | "consolidated"
  | "superseded"
  | "forgotten"
  | "expired";

/** Retention class (MEM-GOV-002 §2). `legal-hold` suspends expiry & forgetting. */
export type RetentionClass = "ephemeral" | "bounded" | "durable" | "legal-hold";

// ------------------------------ Classification (S4, monotonic) ------------------------------

/**
 * Classification label + monotonic level. Higher `level` = more restricted. Promotion may RAISE but
 * never LOWER classification (MGP-3). Recall is projected: a principal clearance must be >= level.
 */
export interface Classification {
  label: string; // e.g. "public" | "internal" | "restricted" | "secret"
  level: number; // monotonic ordering; higher = more classified
}

// ------------------------------ Unit & record ------------------------------

export interface MemoryUnit {
  unitId: string;
  tier: MemoryTier;
  namespace: string; // e.g. "memory:long-term:subject"
  subjectRef: string; // the subject/entity the memory is about
  value: unknown; // the remembered content
  /** Optional by-id link to a ratified knowledge record (Semantic tier backing; MEM-GOV-001 §2.4). */
  knowledgeRef?: string;
  /**
   * Optional, INERT, read-only by-reference link to an ontology entity (C-1 / CL-1). It carries no
   * behavior and is never dereferenced by the Memory Fabric until PI-8 Ontology is IMPLEMENTED and a
   * separate governed integration activates it. Present here only so records are forward-compatible.
   */
  ontologyRef?: string;
  contentType?: string;
}

export interface MemorySource {
  kind: "local" | "federated" | "import";
  nodeId?: string; // present for federated/import
  authorityId?: string;
}

export interface MemoryRecord {
  memId: string;
  version: SemVer;
  tier: MemoryTier;
  namespace: string;
  subjectRef: string;
  unitHash: string;
  unit: MemoryUnit;
  source: MemorySource;
  classification: Classification;
  trustLevel: number;
  provenance: Provenance;
  lineage: string[]; // parent unitHashes (consolidation/promotion DAG)
  state: MemoryState;
  retentionClass: RetentionClass;
  capturedAt: number;
  /** Absolute expiry (ms epoch); undefined for `legal-hold` (never expires by time). */
  expiresAt?: number;
}

// ------------------------------ Authorities & boundary ------------------------------

export type MemoryPower = "consolidate" | "certify" | "ratify" | "revoke" | "retain" | "forget" | "federate" | "audit";
export type MemoryAuthorityStatus = "active" | "revoked";

export interface MemoryAuthorityRecord {
  authorityId: string;
  owner: string; // principal id
  powers: MemoryPower[]; // enumerated; no implicit powers
  keyRef: string; // public key by ref (S3: no key material inline)
  scope: string; // namespace scope, "*" or "memory:long-term:*"
  status: MemoryAuthorityStatus;
}

export interface MemoryBoundaryRecord {
  boundaryId: string;
  members: string[]; // authorityIds accepted within this boundary
  defaultEffect: "deny"; // always deny (deny-by-default)
  maxTrustLevel: number; // clamps any conferred memory trust
  namespaceScope: string; // e.g. "memory:*"
  /** Optional classification ceiling (S4): records above this level may not cross the boundary. */
  maxClassificationLevel?: number;
}

export type RevocableMemoryKind = "unit" | "record" | "certification" | "ratification" | "authority";

// ------------------------------ Signed cross-node artifact ------------------------------

/** Signed memory bundle exchanged across nodes (federation). Reuses federation crypto (no new crypto). */
export interface MemoryBundle {
  record: MemoryRecord;
  issuer: string; // authorityId
  issuerKeyRef: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  signature?: string;
}

// ------------------------------ Query & recall ------------------------------

export interface MemoryQuery {
  namespace?: string; // exact namespace or prefix
  tier?: MemoryTier;
  subjectRef?: string;
  predicate?: (record: MemoryRecord) => boolean;
  versionRange?: string; // SemVer range; default highest active
  includeNonActive?: boolean; // default false (only `active`)
  minTrustLevel?: number;
  /** Recall projection (S4): the requester's clearance level. Records above it are withheld. */
  clearanceLevel?: number;
  now?: number; // for deterministic expiry evaluation
}

// ------------------------------ Audit ------------------------------

export type MemoryAuditEvent =
  | "MEM_CAPTURED"
  | "MEM_CONSOLIDATED"
  | "MEM_CERTIFIED"
  | "MEM_RATIFIED"
  | "MEM_ACTIVATED"
  | "MEM_RECALLED"
  | "MEM_RECALL_DENIED"
  | "MEM_SUPERSEDED"
  | "MEM_FORGOTTEN"
  | "MEM_EXPIRED"
  | "MEM_REVOKED"
  | "MEM_FEDERATED_INGEST"
  | "MEM_RECONCILED";

export interface MemoryAuditEntry {
  at: number;
  event: MemoryAuditEvent;
  unitHash: string;
  namespace: string;
  actor: string;
  detail: string;
  stateHash?: string;
}

// ------------------------------ Results ------------------------------

export interface VerificationResult {
  ok: boolean;
  reason: string;
}
