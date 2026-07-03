/**
 * UCOS Ontology Fabric — Ontology Graph projection (ONTO-C4).
 *
 * The graph is a DERIVED, READ-ONLY view assembled by resolving all `active` entity, relationship, and
 * taxonomy records in a namespace (plus explicitly imported namespaces) into a typed, directed graph.
 * It is a pure projection with NO independent authority and NO hidden state — reproducible from the
 * audited active record set. An unresolvable/expired/revoked referent is excluded fail-closed (never
 * silently substituted). A `candidate` record may be supplied to project the graph AS IF a pending
 * commit were applied (used by the SemanticConstraintEngine before persistence).
 */

import type {
  ConstraintBody,
  EntityBody,
  OntologyKind,
  OntologyRecord,
  RelationshipBody,
  TaxonomyBody,
  TaxonomyEdge,
} from "./types.ts";
import type { OntologyStore } from "./ontology-store.ts";
import { compareVersions } from "../../meta-core/semver.ts";

export interface ClassificationEdge {
  parent: string;
  child: string;
  source: "taxonomy" | "entity-parent";
  taxId?: string;
}

export interface ProjectedGraph {
  namespace: string;
  entities: Map<string, EntityBody>;
  relationships: Map<string, RelationshipBody>;
  taxonomies: Map<string, TaxonomyBody>;
  constraints: Map<string, ConstraintBody>;
  nodes: string[]; // entityIds
  edges: { relId: string; domain: string; range: string }[];
  classificationEdges: ClassificationEdge[];
}

export interface ProjectOptions {
  /** Additional namespaces whose active records are merged (explicit imports only). */
  imports?: string[];
  /** A pending record to project as if committed (overrides any same-(kind,localId) record). */
  candidate?: OntologyRecord;
  /** Admissibility predicate (default: active-only). Callers inject revocation/trust filtering. */
  admit?: (record: OntologyRecord) => boolean;
}

export class OntologyGraph {
  readonly #store: OntologyStore;

  constructor(store: OntologyStore) {
    this.#store = store;
  }

  project(namespace: string, opts: ProjectOptions = {}): ProjectedGraph {
    const admit = opts.admit ?? ((r: OntologyRecord) => r.state === "active");
    const namespaces = [namespace, ...(opts.imports ?? [])];

    // Gather admissible records across the namespace + imports.
    const gathered: OntologyRecord[] = [];
    for (const ns of namespaces) {
      for (const r of this.#store.inNamespace(ns)) if (admit(r)) gathered.push(r);
    }
    if (opts.candidate) gathered.push(opts.candidate);

    // Dedupe to the highest version per (namespace, kind, localId); a candidate always wins its slot.
    const best = new Map<string, OntologyRecord>();
    for (const r of gathered) {
      const key = `${r.namespace}\u0000${r.kind}\u0000${r.localId}`;
      const isCandidate = opts.candidate !== undefined && r === opts.candidate;
      const cur = best.get(key);
      if (!cur) {
        best.set(key, r);
      } else if (isCandidate) {
        best.set(key, r);
      } else if (!(opts.candidate !== undefined && cur === opts.candidate) && compareVersions(r.version, cur.version) > 0) {
        best.set(key, r);
      }
    }

    const entities = new Map<string, EntityBody>();
    const relationships = new Map<string, RelationshipBody>();
    const taxonomies = new Map<string, TaxonomyBody>();
    const constraints = new Map<string, ConstraintBody>();

    for (const r of best.values()) {
      switch (r.kind as OntologyKind) {
        case "entity":
          entities.set(r.localId, r.unit.body as EntityBody);
          break;
        case "relationship":
          relationships.set(r.localId, r.unit.body as RelationshipBody);
          break;
        case "taxonomy":
          taxonomies.set(r.localId, r.unit.body as TaxonomyBody);
          break;
        case "constraint":
          constraints.set(r.localId, r.unit.body as ConstraintBody);
          break;
      }
    }

    const nodes = [...entities.keys()].sort();
    const edges = [...relationships.values()]
      .map((rel) => ({ relId: rel.relId, domain: rel.domain, range: rel.range }))
      .sort((a, b) => a.relId.localeCompare(b.relId));

    const classificationEdges: ClassificationEdge[] = [];
    for (const tax of taxonomies.values()) {
      for (const e of tax.edges) classificationEdges.push({ parent: e.parent, child: e.child, source: "taxonomy", taxId: tax.taxId });
    }
    for (const ent of entities.values()) {
      for (const parent of ent.parents ?? []) classificationEdges.push({ parent, child: ent.entityId, source: "entity-parent" });
    }
    classificationEdges.sort((a, b) => a.parent.localeCompare(b.parent) || a.child.localeCompare(b.child));

    return { namespace, entities, relationships, taxonomies, constraints, nodes, edges, classificationEdges };
  }

  /** The union of classification edges (taxonomy + entity-parent) as parent→child edges. */
  static classificationDag(graph: ProjectedGraph): TaxonomyEdge[] {
    return graph.classificationEdges.map((e) => ({ parent: e.parent, child: e.child }));
  }
}
