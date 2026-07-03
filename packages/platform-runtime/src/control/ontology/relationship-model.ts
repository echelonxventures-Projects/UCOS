/**
 * UCOS Ontology Fabric — Relationship Model (ONTO-C6).
 *
 * A Relationship is a named, typed, directed association between entity TYPES — the edge type of the
 * ontology graph. `domain`/`range` reference entity ids; `inverseOf` names a reciprocal relationship.
 * A relationship is semantic, never a control edge: it never grants authority/trust/permission
 * (enforced by SI-7 in the SemanticConstraintEngine).
 */

import type { Cardinality, OntologyUnit, RelationshipBody } from "./types.ts";
import { createUnit } from "./ontology-unit.ts";
import { ControlValidationError } from "../errors.ts";

export interface RelationshipInit {
  relId: string;
  namespace: string;
  label: string;
  domain: string;
  range: string;
  cardinality: Cardinality;
  symmetric?: boolean;
  transitive?: boolean;
  inverseOf?: string;
  description?: string;
  unitId?: string;
}

export class RelationshipModel {
  /** Build a validated `relationship` ontology unit. */
  static unit(init: RelationshipInit): OntologyUnit {
    if (!init.relId) throw new ControlValidationError("RelationshipModel requires relId", { init });
    const body: RelationshipBody = {
      relId: init.relId,
      label: init.label,
      domain: init.domain,
      range: init.range,
      cardinality: init.cardinality,
    };
    if (init.symmetric !== undefined) body.symmetric = init.symmetric;
    if (init.transitive !== undefined) body.transitive = init.transitive;
    if (init.inverseOf !== undefined) body.inverseOf = init.inverseOf;
    if (init.description !== undefined) body.description = init.description;
    return createUnit({
      unitId: init.unitId ?? `rel:${init.relId}`,
      kind: "relationship",
      namespace: init.namespace,
      body,
      label: init.label,
    });
  }

  /** Entity referents this relationship depends on (domain + range). */
  static referents(body: RelationshipBody): string[] {
    return [body.domain, body.range];
  }

  /**
   * Reciprocity check for `inverseOf`: `a` names `b` as its inverse and `b` names `a`, with swapped
   * domain/range. Used by SI-3.
   */
  static isReciprocal(a: RelationshipBody, b: RelationshipBody): boolean {
    return a.inverseOf === b.relId && b.inverseOf === a.relId && a.domain === b.range && a.range === b.domain;
  }
}
