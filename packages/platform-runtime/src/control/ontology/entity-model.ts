/**
 * UCOS Ontology Fabric — Entity Model (ONTO-C5).
 *
 * An Entity is a named ontological TYPE (a class of thing) — the node type of the ontology graph.
 * This module builds and inspects entity bodies. Attributes are declarative type descriptors only
 * (name/type/required) — no values, no code (enforced structurally at unit validation). An entity may
 * carry a `knowledgeRef` linking it to a governed PI-7 knowledge record (reference, never copy).
 */

import type { EntityAttribute, EntityBody, OntologyUnit } from "./types.ts";
import { createUnit } from "./ontology-unit.ts";
import { ControlValidationError } from "../errors.ts";

export interface EntityInit {
  entityId: string;
  namespace: string;
  label: string;
  attributes?: EntityAttribute[];
  parents?: string[];
  knowledgeRef?: string;
  description?: string;
  unitId?: string;
}

export class EntityModel {
  /** Build a validated `entity` ontology unit. */
  static unit(init: EntityInit): OntologyUnit {
    if (!init.entityId) throw new ControlValidationError("EntityModel requires entityId", { init });
    const body: EntityBody = {
      entityId: init.entityId,
      label: init.label,
      attributes: init.attributes ? init.attributes.map((a) => ({ ...a })) : [],
    };
    if (init.parents !== undefined) body.parents = [...init.parents];
    if (init.knowledgeRef !== undefined) body.knowledgeRef = init.knowledgeRef;
    if (init.description !== undefined) body.description = init.description;
    return createUnit({
      unitId: init.unitId ?? `entity:${init.entityId}`,
      kind: "entity",
      namespace: init.namespace,
      body,
      label: init.label,
    });
  }

  /** Names of the required attributes (used by SI-4 / required-attribute constraints). */
  static requiredAttributes(body: EntityBody): string[] {
    return body.attributes.filter((a) => a.required).map((a) => a.name);
  }

  /** Declared taxonomy anchors (parent entity types). */
  static parents(body: EntityBody): string[] {
    return body.parents ? [...body.parents] : [];
  }

  /** External referents this entity depends on (parents + knowledgeRef). */
  static referents(body: EntityBody): { entities: string[]; knowledgeRef?: string } {
    return {
      entities: EntityModel.parents(body),
      ...(body.knowledgeRef !== undefined ? { knowledgeRef: body.knowledgeRef } : {}),
    };
  }
}
