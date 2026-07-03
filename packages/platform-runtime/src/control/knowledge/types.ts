/**
 * UCOS PI-7 Knowledge Fabric — shared types (AD-0020).
 *
 * The Knowledge Fabric stores, governs, versions, queries, audits, federates, and evolves knowledge
 * as first-class signed, versioned, provenance-bearing records under the reserved `knowledge:`
 * metadata namespace. It is additive over the ratified substrate + federation + evolution fabrics and
 * modifies no core dir. All governed knowledge mutation routes through the Evolution Fabric; all
 * cross-domain claims are signed (reusing federation cryptography — no custom crypto).
 */

import type { SemVer } from "../../contracts/types.ts";
import type { Provenance } from "../types.ts";

// ------------------------------ Lifecycle ------------------------------

export type KnowledgeState =
  | "draft"
  | "validated"
  | "certified"
  | "ratified"
  | "active"
  | "superseded"
  | "revoked"
  | "archived";

export type KnowledgeClass = "reference" | "authoritative" | "federated";

// ------------------------------ Unit & record ------------------------------

export interface KnowledgeUnit {
  unitId: string;
  title: string;
  namespace: string; // e.g. "knowledge:domain:topic"
  payload: unknown; // the knowledge itself (fact, model, schema, document, parameters)
  contentType?: string; // e.g. "application/json", "text/markdown"
}

export interface KnowledgeSource {
  kind: "local" | "federated" | "import";
  nodeId?: string; // present for federated/import
  authorityId?: string;
}

export interface KnowledgeRecord {
  knowledgeId: string;
  version: SemVer;
  namespace: string;
  unitHash: string;
  unit: KnowledgeUnit;
  source: KnowledgeSource;
  trustLevel: number;
  provenance: Provenance;
  lineage: string[]; // parent unitHashes (DAG of derivations)
  state: KnowledgeState;
  knowledgeClass: KnowledgeClass;
}

// ------------------------------ Authorities ------------------------------

export type KnowledgePower = "author" | "validate" | "certify" | "ratify" | "revoke" | "audit";
export type KnowledgeAuthorityStatus = "active" | "revoked";

export interface KnowledgeAuthorityRecord {
  authorityId: string;
  owner: string; // principal id
  powers: KnowledgePower[]; // enumerated; no implicit powers (K4)
  keyRef: string; // public key by ref (S3: no key material inline)
  scope: string; // namespace scope, "*" or "knowledge:domain:*"
  status: KnowledgeAuthorityStatus;
}

export interface KnowledgeBoundaryRecord {
  boundaryId: string;
  members: string[]; // authorityIds accepted within this boundary
  defaultEffect: "deny"; // always deny (deny-by-default)
  maxTrustLevel: number; // clamps any conferred knowledge trust (K5)
  namespaceScope: string; // e.g. "knowledge:*"
}

export type RevocableKnowledgeKind = "unit" | "record" | "certification" | "ratification" | "authority";

// ------------------------------ Signed governance artifacts ------------------------------

export interface KnowledgeCertification {
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

export interface KnowledgeRatification {
  ratificationId: string;
  unitHash: string;
  raId: string;
  ratifier: string;
  ratifierKeyRef: string;
  author: string;
  validators: string[];
  certifier: string;
  certificationId: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  signature?: string;
}

/** Federation re-ratification token for cross-boundary knowledge (EVO-FED parity). */
export interface KnowledgeFederationToken {
  tokenId: string;
  scope: string;
  issuerKeyRef: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  signature?: string;
}

/** Signed bundle exchanged across nodes (import/export + federation). */
export interface KnowledgeBundle {
  record: KnowledgeRecord;
  issuer: string; // authorityId
  issuerKeyRef: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  signature?: string;
}

// ------------------------------ Query ------------------------------

export interface KnowledgeQuery {
  namespace?: string; // exact namespace or prefix (with `prefix: true`)
  prefix?: boolean;
  predicate?: (record: KnowledgeRecord) => boolean;
  versionRange?: string; // SemVer range; default highest active
  includeNonActive?: boolean; // default false (only `active`)
  minTrustLevel?: number;
}

// ------------------------------ Audit ------------------------------

export type KnowledgeAuditEvent =
  | "KNOW_CREATED"
  | "KNOW_VALIDATED"
  | "KNOW_CERTIFIED"
  | "KNOW_RATIFIED"
  | "KNOW_ACTIVATED"
  | "KNOW_SUPERSEDED"
  | "KNOW_REVOKED"
  | "KNOW_ARCHIVED"
  | "KNOW_EXCHANGED"
  | "KNOW_SYNCED"
  | "KNOW_RECONCILED"
  | "KNOW_LINEAGE";

export interface KnowledgeAuditEntry {
  at: number;
  event: KnowledgeAuditEvent;
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
