/**
 * UCOS PI-8 Ontology Fabric — shared types (AD-0021 / ONTO-ARCH-001).
 *
 * The Ontology Fabric is a governed SEMANTIC schema layer (entity types, relationship types,
 * taxonomies, semantic constraints) imposed over the ratified PI-7 Knowledge Fabric. Every construct
 * is a signed, versioned, content-addressed record under the reserved `ontology:` metadata namespace.
 * It is additive over the ratified substrate + federation + evolution + knowledge fabrics and modifies
 * no core dir. All governed ontology mutation routes through the Evolution Fabric; all cross-domain
 * artifacts are signed (reusing federation cryptography — no custom crypto).
 *
 * Meaning is not authority: no ontology construct may confer identity, trust, permission, or
 * execution, and no constraint may weaken a non-waivable S1/S3/S4 control (ONTO-SEC-001 §SI-7).
 */

import type { SemVer } from "../../contracts/types.ts";
import type { Provenance } from "../types.ts";

// ------------------------------ Lifecycle ------------------------------

/**
 * Ontology record lifecycle. Reconciled with the ratified PI-7 knowledge lifecycle per AD-0021 §2
 * advisory (ONTO-AUTH-REV-001 §8 / REV-004 §3): the ONTO-ARCH-001 §3.2 name `proposed` is realized as
 * the ratified `validated` state so the two fabrics share one guarded transition vocabulary.
 */
export type OntologyState =
  | "draft"
  | "validated"
  | "certified"
  | "ratified"
  | "active"
  | "superseded"
  | "revoked"
  | "archived";

/** The four kinds of ontological meaning (ONTO-ARCH-001 §3.1). */
export type OntologyKind = "entity" | "relationship" | "taxonomy" | "constraint";

/** Addressing tag used in the metadata key for each kind (`ontology:record:<ns>:<tag>:<id>`). */
export type OntologyKindTag = "entity" | "rel" | "tax" | "constraint";

// ------------------------------ Construct bodies ------------------------------

/** Declarative attribute descriptor for an entity type (name/type/required — no values, no code). */
export interface EntityAttribute {
  name: string;
  type: string; // declarative type token, e.g. "string" | "number" | "boolean" | a referenced type
  required: boolean;
}

/** Entity type body (ONTO-C5). The node type of the ontology graph. */
export interface EntityBody {
  entityId: string;
  label: string;
  attributes: EntityAttribute[];
  /** Taxonomy anchors — parent entity types (is-a). */
  parents?: string[];
  /** Reference (not copy) to a governed PI-7 knowledge record backing this entity. */
  knowledgeRef?: string;
  description?: string;
}

export type Cardinality = "1:1" | "1:N" | "N:1" | "N:M";

/** Relationship type body (ONTO-C6). A typed, directed edge type between entity types. */
export interface RelationshipBody {
  relId: string;
  label: string;
  domain: string; // entityId (source)
  range: string; // entityId (target)
  cardinality: Cardinality;
  symmetric?: boolean;
  transitive?: boolean;
  inverseOf?: string; // relId
  description?: string;
}

/** A single classification edge (parent broader-than child). */
export interface TaxonomyEdge {
  parent: string; // entityId
  child: string; // entityId
}

/** Taxonomy body (ONTO-C7). A governed classification hierarchy over entity types (must be a DAG). */
export interface TaxonomyBody {
  taxId: string;
  label: string;
  root: string; // entityId
  edges: TaxonomyEdge[];
  multipleInheritance?: boolean;
  description?: string;
}

export type ConstraintScope = "entity" | "relationship" | "taxonomy" | "graph";

/** Declarative rule vocabulary (ONTO-ARCH-001 §3.8) — no executable code. */
export type ConstraintRule =
  | "required-attribute"
  | "attribute-type"
  | "cardinality-bound"
  | "domain-range-conformance"
  | "taxonomy-acyclicity"
  | "disjointness"
  | "reference-integrity"
  | "uniqueness";

export type ConstraintSeverity = "block" | "warn";

/** Semantic constraint body (ONTO-C8). A declarative integrity rule the graph must satisfy. */
export interface ConstraintBody {
  constraintId: string;
  label: string;
  scope: ConstraintScope;
  rule: ConstraintRule;
  severity: ConstraintSeverity;
  appliesTo: string[]; // entityId | relId | taxId the rule ranges over
  /** Declarative rule parameters (e.g. `{ attribute: "name" }`, `{ disjoint: ["a","b"] }`). */
  params?: Record<string, unknown>;
  description?: string;
}

export type OntologyBody = EntityBody | RelationshipBody | TaxonomyBody | ConstraintBody;

// ------------------------------ Unit & record ------------------------------

/** The atomic, immutable, content-addressed unit of ontological meaning (ONTO-C1). */
export interface OntologyUnit {
  unitId: string;
  kind: OntologyKind;
  namespace: string; // e.g. "ontology:domain:core"
  body: OntologyBody;
  label?: string;
  contentType?: string;
}

export interface OntologySource {
  kind: "local" | "federated" | "import";
  nodeId?: string; // present for federated/import
  authorityId?: string;
}

/** The versioned, governed wrapper binding an Ontology Unit into a namespace (ONTO-C2). */
export interface OntologyRecord {
  recordId: string;
  kind: OntologyKind;
  localId: string; // logical id within the namespace (entityId | relId | taxId | constraintId)
  namespace: string;
  version: SemVer;
  unitHash: string;
  unit: OntologyUnit;
  source: OntologySource;
  trustLevel: number;
  provenance: Provenance;
  /** Prior recordId this version explicitly supersedes (migration-only, IP-14). */
  supersedes?: string;
  state: OntologyState;
}

// ------------------------------ Authorities / boundaries / namespace ------------------------------

/** Enumerated ontology powers (AD-0021 §2). No implicit powers (O-authority-escalation). */
export type OntologyPower = "define" | "certify" | "ratify" | "revoke" | "federate";
export type OntologyAuthorityStatus = "active" | "revoked";

export interface OntologyAuthorityRecord {
  authorityId: string;
  owner: string; // principal id
  powers: OntologyPower[]; // enumerated; no implicit authority
  keyRef: string; // public key by ref (S3: no key material inline)
  scope: string; // namespace scope, "*" or "ontology:domain:*"
  status: OntologyAuthorityStatus;
}

export interface OntologyBoundaryRecord {
  boundaryId: string;
  members: string[]; // authorityIds accepted within this boundary
  defaultEffect: "deny"; // always deny (deny-by-default)
  maxTrustLevel: number; // clamps any conferred ontology trust
  namespaceScope: string; // e.g. "ontology:*"
}

/** Governed semantic scope owning a coherent construct set under a single accountable authority (ONTO-C3). */
export interface OntologyNamespaceRecord {
  namespace: string;
  owner: string; // single accountable principal
  authorities: string[]; // authorityIds permitted to govern within the namespace
  imports: string[]; // explicitly imported namespaces (for cross-namespace references)
  defaultEffect: "deny"; // deny-by-default for foreign assertions
  status: "active" | "archived";
}

export type RevocableOntologyKind = "unit" | "record" | "certification" | "ratification" | "authority";

// ------------------------------ Signed governance artifacts ------------------------------

export interface OntologyCertification {
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

export interface OntologyRatification {
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

/** Federation re-ratification token for cross-boundary ontology (ONTO-FED-001). */
export interface OntologyFederationToken {
  tokenId: string;
  scope: string;
  issuerKeyRef: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  signature?: string;
}

/** Signed bundle exchanged across nodes (import/export + federation). */
export interface OntologyBundle {
  record: OntologyRecord;
  issuer: string; // authorityId
  issuerKeyRef: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  signature?: string;
}

// ------------------------------ Query ------------------------------

export interface OntologyQuery {
  namespace?: string; // exact namespace or prefix (with `prefix: true`)
  prefix?: boolean;
  kind?: OntologyKind;
  predicate?: (record: OntologyRecord) => boolean;
  versionRange?: string; // SemVer range; default highest active
  includeNonActive?: boolean; // default false (only `active`)
  minTrustLevel?: number;
}

// ------------------------------ Semantic integrity ------------------------------

/** The seven semantic-integrity checks (ONTO-SEC-001). */
export type SemanticIntegrityCheck =
  | "SI-1" // referential integrity (no dangling referent)
  | "SI-2" // taxonomy DAG acyclicity
  | "SI-3" // relationship domain/range conformance + inverse reciprocity
  | "SI-4" // entity attribute conformance (declarative descriptors only)
  | "SI-5" // cardinality well-formedness
  | "SI-6" // disjointness / non-contradiction
  | "SI-7"; // authority-neutrality (meaning is not authority; no S1/S3/S4 weakening)

export interface SemanticViolation {
  check: SemanticIntegrityCheck;
  severity: ConstraintSeverity;
  detail: string;
}

export interface SemanticIntegrityResult {
  ok: boolean;
  violations: SemanticViolation[];
}

// ------------------------------ Audit ------------------------------

export type OntologyAuditEvent =
  | "ONTO_CREATED"
  | "ONTO_VALIDATED"
  | "ONTO_CERTIFIED"
  | "ONTO_RATIFIED"
  | "ONTO_ACTIVATED"
  | "ONTO_SUPERSEDED"
  | "ONTO_REVOKED"
  | "ONTO_ARCHIVED"
  | "ONTO_IMPORTED"
  | "ONTO_FEDERATED"
  | "ONTO_INTEGRITY";

export interface OntologyAuditEntry {
  at: number;
  event: OntologyAuditEvent;
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
