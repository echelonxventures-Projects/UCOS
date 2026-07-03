/**
 * UCOS Ontology Fabric — Taxonomy Model (ONTO-C7).
 *
 * A Taxonomy is a governed classification hierarchy (is-a / broader-narrower) over entity types. Its
 * edge set MUST be a DAG — cycle injection is rejected at write time (ONTO-GOV-002 §2, closes threat
 * O5). Classification is inheritance of TYPE, never of authority.
 */

import type { OntologyUnit, TaxonomyBody, TaxonomyEdge } from "./types.ts";
import { createUnit } from "./ontology-unit.ts";
import { ControlValidationError } from "../errors.ts";

export interface TaxonomyInit {
  taxId: string;
  namespace: string;
  label: string;
  root: string;
  edges?: TaxonomyEdge[];
  multipleInheritance?: boolean;
  description?: string;
  unitId?: string;
}

export interface CycleResult {
  acyclic: boolean;
  cycle: string[]; // the node sequence forming a cycle (empty if acyclic)
}

export class TaxonomyModel {
  /** Build a validated `taxonomy` ontology unit. */
  static unit(init: TaxonomyInit): OntologyUnit {
    if (!init.taxId) throw new ControlValidationError("TaxonomyModel requires taxId", { init });
    const body: TaxonomyBody = {
      taxId: init.taxId,
      label: init.label,
      root: init.root,
      edges: init.edges ? init.edges.map((e) => ({ ...e })) : [],
    };
    if (init.multipleInheritance !== undefined) body.multipleInheritance = init.multipleInheritance;
    if (init.description !== undefined) body.description = init.description;
    return createUnit({
      unitId: init.unitId ?? `tax:${init.taxId}`,
      kind: "taxonomy",
      namespace: init.namespace,
      body,
      label: init.label,
    });
  }

  /** Every entity referenced by the taxonomy (root + all edge endpoints). */
  static referents(body: TaxonomyBody): string[] {
    const set = new Set<string>([body.root]);
    for (const e of body.edges) {
      set.add(e.parent);
      set.add(e.child);
    }
    return [...set];
  }

  /**
   * Detect a cycle over a set of parent→child edges (directed, parent points to child). Returns the
   * first cycle found. Pure and deterministic. Used by graph projection and SI-2.
   */
  static detectCycle(edges: readonly TaxonomyEdge[]): CycleResult {
    const adjacency = new Map<string, string[]>();
    for (const e of edges) {
      const list = adjacency.get(e.parent) ?? [];
      list.push(e.child);
      adjacency.set(e.parent, list);
    }
    // Deterministic node ordering.
    const nodes = [...adjacency.keys()].sort();
    const WHITE = 0;
    const GRAY = 1;
    const BLACK = 2;
    const color = new Map<string, number>();
    const stack: string[] = [];

    const visit = (node: string): string[] | undefined => {
      color.set(node, GRAY);
      stack.push(node);
      for (const next of (adjacency.get(node) ?? []).slice().sort()) {
        const c = color.get(next) ?? WHITE;
        if (c === GRAY) {
          const idx = stack.indexOf(next);
          return [...stack.slice(idx), next]; // cycle path
        }
        if (c === WHITE) {
          const found = visit(next);
          if (found) return found;
        }
      }
      stack.pop();
      color.set(node, BLACK);
      return undefined;
    };

    for (const n of nodes) {
      if ((color.get(n) ?? WHITE) === WHITE) {
        const cycle = visit(n);
        if (cycle) return { acyclic: false, cycle };
      }
    }
    return { acyclic: true, cycle: [] };
  }
}
