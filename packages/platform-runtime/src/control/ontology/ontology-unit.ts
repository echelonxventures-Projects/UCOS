/**
 * UCOS Ontology Fabric — Ontology Unit construction & content hashing (ONTO-C1 / ONTO-SEC-001).
 *
 * `unitHash = sha256(canonicalize(unit))` is the stable identifier every downstream signature
 * (certification, ratification, bundle) binds to — tampering with the unit invalidates them all.
 * The body is structurally validated against its kind's descriptor shape before acceptance. This is
 * WELL-FORMEDNESS only; semantic integrity (referential integrity, DAG acyclicity, constraints) is
 * enforced separately by the SemanticConstraintEngine, and authorization by the governance authorities.
 */

import type {
  ConstraintBody,
  EntityBody,
  OntologyBody,
  OntologyUnit,
  RelationshipBody,
  TaxonomyBody,
} from "./types.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";
import { ControlValidationError } from "../errors.ts";

const CARDINALITIES = new Set(["1:1", "1:N", "N:1", "N:M"]);
const CONSTRAINT_SCOPES = new Set(["entity", "relationship", "taxonomy", "graph"]);
const CONSTRAINT_RULES = new Set([
  "required-attribute",
  "attribute-type",
  "cardinality-bound",
  "domain-range-conformance",
  "taxonomy-acyclicity",
  "disjointness",
  "reference-integrity",
  "uniqueness",
]);
const CONSTRAINT_SEVERITIES = new Set(["block", "warn"]);

export function unitHash(unit: OntologyUnit): string {
  return sha256(canonicalize(unit));
}

/** The logical id carried by a body (entityId | relId | taxId | constraintId). */
export function bodyLocalId(unit: OntologyUnit): string {
  switch (unit.kind) {
    case "entity":
      return (unit.body as EntityBody).entityId;
    case "relationship":
      return (unit.body as RelationshipBody).relId;
    case "taxonomy":
      return (unit.body as TaxonomyBody).taxId;
    case "constraint":
      return (unit.body as ConstraintBody).constraintId;
  }
}

export function validateUnit(unit: OntologyUnit): void {
  if (!unit.unitId) throw new ControlValidationError("Ontology unit requires unitId", { unit });
  if (!unit.namespace || !unit.namespace.startsWith("ontology:")) {
    throw new ControlValidationError("Ontology unit namespace must start with 'ontology:'", { unit });
  }
  if (!unit.kind) throw new ControlValidationError("Ontology unit requires a kind", { unit });
  if (unit.body === undefined || unit.body === null || typeof unit.body !== "object") {
    throw new ControlValidationError("Ontology unit requires a structured body", { unit });
  }
  validateBody(unit.kind, unit.body);
}

function validateBody(kind: OntologyUnit["kind"], body: OntologyBody): void {
  switch (kind) {
    case "entity":
      return validateEntity(body as EntityBody);
    case "relationship":
      return validateRelationship(body as RelationshipBody);
    case "taxonomy":
      return validateTaxonomy(body as TaxonomyBody);
    case "constraint":
      return validateConstraint(body as ConstraintBody);
    default:
      throw new ControlValidationError(`Unknown ontology kind "${String(kind)}"`, { kind });
  }
}

function validateEntity(body: EntityBody): void {
  if (!body.entityId) throw new ControlValidationError("Entity requires entityId", { body });
  if (!body.label) throw new ControlValidationError("Entity requires a label", { body });
  if (!Array.isArray(body.attributes)) {
    throw new ControlValidationError("Entity requires an attributes array (may be empty)", { body });
  }
  for (const a of body.attributes) {
    if (!a || typeof a !== "object" || !a.name || !a.type || typeof a.required !== "boolean") {
      throw new ControlValidationError("Entity attribute must be a declarative { name, type, required } descriptor", { body, a });
    }
    // Meaning is not code: an attribute is a declarative descriptor and may not carry a value.
    const raw = a as unknown as Record<string, unknown>;
    if ("value" in raw || typeof raw.type !== "string") {
      throw new ControlValidationError("Entity attribute must be declarative (no values, no code)", { body, a });
    }
  }
  if (body.parents !== undefined && !Array.isArray(body.parents)) {
    throw new ControlValidationError("Entity parents must be an array of entityIds", { body });
  }
}

function validateRelationship(body: RelationshipBody): void {
  if (!body.relId) throw new ControlValidationError("Relationship requires relId", { body });
  if (!body.label) throw new ControlValidationError("Relationship requires a label", { body });
  if (!body.domain || !body.range) throw new ControlValidationError("Relationship requires domain and range entityIds", { body });
  if (!CARDINALITIES.has(body.cardinality)) {
    throw new ControlValidationError(`Relationship cardinality must be one of 1:1|1:N|N:1|N:M`, { body });
  }
}

function validateTaxonomy(body: TaxonomyBody): void {
  if (!body.taxId) throw new ControlValidationError("Taxonomy requires taxId", { body });
  if (!body.label) throw new ControlValidationError("Taxonomy requires a label", { body });
  if (!body.root) throw new ControlValidationError("Taxonomy requires a root entityId", { body });
  if (!Array.isArray(body.edges)) throw new ControlValidationError("Taxonomy requires an edges array", { body });
  for (const e of body.edges) {
    if (!e || typeof e !== "object" || !e.parent || !e.child) {
      throw new ControlValidationError("Taxonomy edge must be { parent, child } entityIds", { body, e });
    }
    if (e.parent === e.child) {
      throw new ControlValidationError("Taxonomy edge cannot be a self-loop (parent == child)", { body, e });
    }
  }
}

function validateConstraint(body: ConstraintBody): void {
  if (!body.constraintId) throw new ControlValidationError("Constraint requires constraintId", { body });
  if (!body.label) throw new ControlValidationError("Constraint requires a label", { body });
  if (!CONSTRAINT_SCOPES.has(body.scope)) throw new ControlValidationError("Constraint scope invalid", { body });
  if (!CONSTRAINT_RULES.has(body.rule)) throw new ControlValidationError("Constraint rule invalid", { body });
  if (!CONSTRAINT_SEVERITIES.has(body.severity)) throw new ControlValidationError("Constraint severity must be block|warn", { body });
  if (!Array.isArray(body.appliesTo)) throw new ControlValidationError("Constraint requires an appliesTo array", { body });
}

/** Build a normalized, validated unit. Fills default arrays; does NOT authorize. */
export function createUnit(unit: OntologyUnit): OntologyUnit {
  validateUnit(unit);
  return { ...unit, body: { ...unit.body } as OntologyBody };
}
