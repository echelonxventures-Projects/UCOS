/**
 * UCOS PI-8 Ontology Fabric — public surface (AD-0021).
 *
 * A governed SEMANTIC schema layer (entity types, relationship types, taxonomies, semantic constraints)
 * over the ratified PI-7 Knowledge Fabric. Deny-by-default, fail-closed, trust-clamped, separation of
 * duties, signed transitions, hash-chained audit, taxonomy-DAG acyclicity, and referential integrity;
 * all governed mutation routes through the Evolution Fabric. Reuses federation cryptography (no custom
 * crypto). Meaning is not authority. No substrate core dir is modified.
 */

// Types (explicit to avoid re-export ambiguity with federation/evolution/knowledge generic names).
export type {
  OntologyState,
  OntologyKind,
  OntologyKindTag,
  EntityAttribute,
  EntityBody,
  Cardinality,
  RelationshipBody,
  TaxonomyEdge,
  TaxonomyBody,
  ConstraintScope,
  ConstraintRule,
  ConstraintSeverity,
  ConstraintBody,
  OntologyBody,
  OntologyUnit,
  OntologySource,
  OntologyRecord,
  OntologyPower,
  OntologyAuthorityStatus,
  OntologyAuthorityRecord,
  OntologyBoundaryRecord,
  OntologyNamespaceRecord,
  RevocableOntologyKind,
  OntologyCertification,
  OntologyRatification,
  OntologyFederationToken,
  OntologyBundle,
  OntologyQuery,
  SemanticIntegrityCheck,
  SemanticViolation,
  SemanticIntegrityResult,
  OntologyAuditEvent,
  OntologyAuditEntry,
} from "./types.ts";

// Namespace helpers
export {
  recordKey,
  recordIdPrefix,
  recordNamespacePrefix,
  recordKindPrefix,
  namespaceKey,
  authorityKey,
  boundaryKey,
  revokedKey,
  nsTail,
  kindTag,
  namespacedId,
  parseNamespacedId,
  RECORD_PREFIX,
  NAMESPACE_PREFIX,
  AUTHORITY_PREFIX,
  BOUNDARY_PREFIX,
  REVOKED_PREFIX,
  FEDERATION_PREFIX,
} from "./ontology-namespace.ts";

// Unit & record
export { unitHash, validateUnit, createUnit, bodyLocalId } from "./ontology-unit.ts";
export { createRecord, ONTOLOGY_RECORD_SCHEMA } from "./ontology-record.ts";
export type { CreateRecordOptions } from "./ontology-record.ts";

// Lifecycle & state
export { canTransition, assertTransition, isTerminal } from "./ontology-lifecycle.ts";
export { OntologyStateMachine } from "./ontology-state-machine.ts";

// Structural models
export { EntityModel } from "./entity-model.ts";
export type { EntityInit } from "./entity-model.ts";
export { RelationshipModel } from "./relationship-model.ts";
export type { RelationshipInit } from "./relationship-model.ts";
export { TaxonomyModel } from "./taxonomy-model.ts";
export type { TaxonomyInit, CycleResult } from "./taxonomy-model.ts";

// Registry & store
export { OntologyRegistry } from "./ontology-registry.ts";
export { OntologyStore } from "./ontology-store.ts";

// Graph & semantic integrity
export { OntologyGraph } from "./ontology-graph.ts";
export type { ProjectedGraph, ProjectOptions, ClassificationEdge } from "./ontology-graph.ts";
export { SemanticConstraintEngine } from "./semantic-constraint-engine.ts";
export type { EvaluateOptions } from "./semantic-constraint-engine.ts";

// Query & resolve
export { OntologyQueryEngine } from "./ontology-query-engine.ts";
export { OntologyResolver } from "./ontology-resolver.ts";

// Authorities
export { OntologyCertificationAuthority } from "./ontology-certification-authority.ts";
export { OntologyRatificationAuthority } from "./ontology-ratification-authority.ts";
export { OntologyRevocationAuthority } from "./ontology-revocation-authority.ts";

// Federation & snapshot
export { OntologyFederationGuard } from "./ontology-federation-guard.ts";
export { OntologySnapshot } from "./ontology-snapshot.ts";
export type { OntologySnapshotResult } from "./ontology-snapshot.ts";

// Audit
export { OntologyAuditLog, ONTO_GENESIS_HASH } from "./ontology-audit-log.ts";
export type { OntologyChainedEntry, OntoDivergence, OntoReconciliationResult } from "./ontology-audit-log.ts";

// Control assembly + evolution integration
export { OntologyControl, createOntology } from "./ontology-control.ts";
export type { OntologyOptions, OntologyCommitOptions } from "./ontology-control.ts";
