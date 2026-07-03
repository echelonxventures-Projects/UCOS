/**
 * UCOS Ontology Fabric — Semantic Constraint Engine (ONTO-GOV-002 / ONTO-SEC-001).
 *
 * The semantic-integrity gate. Before ANY governed commit, the candidate record is projected into the
 * ontology graph AS IF applied, and the seven semantic-integrity checks are evaluated. A `block`-level
 * violation FAILS CLOSED (mutation rejected, deny-by-default); `warn`-level violations are reported but
 * do not block. The engine is pure and deterministic over the audited active record set.
 *
 * Checks:
 *   SI-1  Referential integrity — every referenced entity/relationship/taxonomy referent resolves to an
 *         active type in-namespace or an explicitly imported namespace (no dangling reference).
 *   SI-2  Taxonomy acyclicity — the union of taxonomy + entity-parent classification edges is a DAG.
 *   SI-3  Domain/range conformance — relationship domain/range resolve to active entities; `inverseOf`
 *         is reciprocal.
 *   SI-4  Attribute conformance — entity attributes are declarative { name, type, required } descriptors
 *         (no values, no code) and attribute names are unique.
 *   SI-5  Cardinality well-formedness — relationship cardinality is one of the four legal forms.
 *   SI-6  Disjointness / non-contradiction — entities declared disjoint may not co-classify under a
 *         common ancestor; declared block-constraints do not contradict.
 *   SI-7  Authority-neutrality — no construct confers identity/trust/permission/execution, and no
 *         constraint weakens a non-waivable S1/S3/S4 control (meaning is not authority).
 */

import type {
  ConstraintBody,
  EntityBody,
  OntologyRecord,
  RelationshipBody,
  SemanticIntegrityCheck,
  SemanticIntegrityResult,
  SemanticViolation,
  TaxonomyBody,
} from "./types.ts";
import type { OntologyStore } from "./ontology-store.ts";
import { OntologyGraph, type ProjectedGraph } from "./ontology-graph.ts";
import { TaxonomyModel } from "./taxonomy-model.ts";
import { RelationshipModel } from "./relationship-model.ts";

const CARDINALITIES = new Set(["1:1", "1:N", "N:1", "N:M"]);

// Tokens that would indicate a construct is trying to confer control-plane authority (SI-7).
const AUTHORITY_TOKENS = ["permission", "grant", "role", "credential", "trust", "execute", "capability", "policy", "identity"];

export interface EvaluateOptions {
  imports?: string[];
  admit?: (record: OntologyRecord) => boolean;
}

export class SemanticConstraintEngine {
  readonly #store: OntologyStore;
  readonly #graph: OntologyGraph;

  constructor(store: OntologyStore, graph?: OntologyGraph) {
    this.#store = store;
    this.#graph = graph ?? new OntologyGraph(store);
  }

  /** Evaluate all seven checks against the graph projected WITH `candidate` applied. */
  evaluate(candidate: OntologyRecord, opts: EvaluateOptions = {}): SemanticIntegrityResult {
    const graph = this.#graph.project(candidate.namespace, {
      candidate,
      ...(opts.imports ? { imports: opts.imports } : {}),
      ...(opts.admit ? { admit: opts.admit } : {}),
    });

    const violations: SemanticViolation[] = [
      ...this.#si1ReferentialIntegrity(candidate, graph),
      ...this.#si2TaxonomyAcyclicity(graph),
      ...this.#si3DomainRangeConformance(graph),
      ...this.#si4AttributeConformance(graph),
      ...this.#si5Cardinality(graph),
      ...this.#si6Disjointness(graph),
      ...this.#si7AuthorityNeutrality(candidate, graph),
    ];

    const ok = !violations.some((v) => v.severity === "block");
    return { ok, violations };
  }

  // ------------------------------ SI-1 ------------------------------

  #si1ReferentialIntegrity(candidate: OntologyRecord, graph: ProjectedGraph): SemanticViolation[] {
    const out: SemanticViolation[] = [];
    const entityExists = (id: string): boolean => graph.entities.has(id);

    // The candidate's own referents (only enforce the candidate hard, others are graph-wide via others).
    if (candidate.kind === "entity") {
      const body = candidate.unit.body as EntityBody;
      for (const parent of body.parents ?? []) {
        if (!entityExists(parent)) out.push(v("SI-1", "block", `entity "${body.entityId}" parent "${parent}" does not resolve to an active entity`));
      }
    }
    if (candidate.kind === "relationship") {
      const body = candidate.unit.body as RelationshipBody;
      if (!entityExists(body.domain)) out.push(v("SI-1", "block", `relationship "${body.relId}" domain "${body.domain}" does not resolve to an active entity`));
      if (!entityExists(body.range)) out.push(v("SI-1", "block", `relationship "${body.relId}" range "${body.range}" does not resolve to an active entity`));
    }
    if (candidate.kind === "taxonomy") {
      const body = candidate.unit.body as TaxonomyBody;
      for (const ref of TaxonomyModel.referents(body)) {
        if (!entityExists(ref)) out.push(v("SI-1", "block", `taxonomy "${body.taxId}" references entity "${ref}" which does not resolve to an active entity`));
      }
    }
    if (candidate.kind === "constraint") {
      const body = candidate.unit.body as ConstraintBody;
      for (const ref of body.appliesTo) {
        const known = graph.entities.has(ref) || graph.relationships.has(ref) || graph.taxonomies.has(ref);
        if (!known) out.push(v("SI-1", "block", `constraint "${body.constraintId}" appliesTo "${ref}" which resolves to no active construct`));
      }
    }
    return out;
  }

  // ------------------------------ SI-2 ------------------------------

  #si2TaxonomyAcyclicity(graph: ProjectedGraph): SemanticViolation[] {
    const dag = OntologyGraph.classificationDag(graph);
    const cyc = TaxonomyModel.detectCycle(dag);
    if (!cyc.acyclic) {
      return [v("SI-2", "block", `taxonomy classification is cyclic: ${cyc.cycle.join(" -> ")}`)];
    }
    return [];
  }

  // ------------------------------ SI-3 ------------------------------

  #si3DomainRangeConformance(graph: ProjectedGraph): SemanticViolation[] {
    const out: SemanticViolation[] = [];
    for (const rel of graph.relationships.values()) {
      if (!graph.entities.has(rel.domain)) out.push(v("SI-3", "block", `relationship "${rel.relId}" domain "${rel.domain}" is not an active entity`));
      if (!graph.entities.has(rel.range)) out.push(v("SI-3", "block", `relationship "${rel.relId}" range "${rel.range}" is not an active entity`));
      if (rel.inverseOf !== undefined) {
        const inv = graph.relationships.get(rel.inverseOf);
        if (!inv) {
          out.push(v("SI-3", "block", `relationship "${rel.relId}" inverseOf "${rel.inverseOf}" does not resolve`));
        } else if (!RelationshipModel.isReciprocal(rel, inv)) {
          out.push(v("SI-3", "block", `relationship "${rel.relId}" and "${inv.relId}" are not reciprocal inverses (domain/range must swap)`));
        }
      }
    }
    return out;
  }

  // ------------------------------ SI-4 ------------------------------

  #si4AttributeConformance(graph: ProjectedGraph): SemanticViolation[] {
    const out: SemanticViolation[] = [];
    for (const ent of graph.entities.values()) {
      const seen = new Set<string>();
      for (const a of ent.attributes) {
        if (!a.name || !a.type || typeof a.required !== "boolean") {
          out.push(v("SI-4", "block", `entity "${ent.entityId}" has a non-declarative attribute (requires name/type/required)`));
          continue;
        }
        if (seen.has(a.name)) out.push(v("SI-4", "block", `entity "${ent.entityId}" has duplicate attribute "${a.name}"`));
        seen.add(a.name);
      }
    }
    return out;
  }

  // ------------------------------ SI-5 ------------------------------

  #si5Cardinality(graph: ProjectedGraph): SemanticViolation[] {
    const out: SemanticViolation[] = [];
    for (const rel of graph.relationships.values()) {
      if (!CARDINALITIES.has(rel.cardinality)) {
        out.push(v("SI-5", "block", `relationship "${rel.relId}" has illegal cardinality "${rel.cardinality}"`));
      }
    }
    return out;
  }

  // ------------------------------ SI-6 ------------------------------

  #si6Disjointness(graph: ProjectedGraph): SemanticViolation[] {
    const out: SemanticViolation[] = [];
    // Ancestor closure over classification edges (child -> its ancestors).
    const ancestors = ancestorClosure(graph);
    // All classified entities (edge endpoints + declared entities).
    const universe = new Set<string>([...graph.entities.keys()]);
    for (const e of graph.classificationEdges) {
      universe.add(e.child);
      universe.add(e.parent);
    }

    for (const c of graph.constraints.values()) {
      if (c.rule !== "disjointness") continue;
      const disjoint = c.appliesTo;
      for (let i = 0; i < disjoint.length; i++) {
        for (let j = i + 1; j < disjoint.length; j++) {
          const a = disjoint[i] as string;
          const b = disjoint[j] as string;
          // Direct is-a relation between the two disjoint types is a contradiction.
          if ((ancestors.get(a)?.has(b) ?? false) || (ancestors.get(b)?.has(a) ?? false)) {
            out.push(v("SI-6", c.severity, `disjointness constraint "${c.constraintId}" violated: "${a}" and "${b}" are in an is-a relation`));
          }
          // A common DESCENDANT (some entity that is-a both) violates disjointness (co-classification).
          for (const node of universe) {
            const anc = ancestors.get(node);
            if (anc && anc.has(a) && anc.has(b)) {
              out.push(v("SI-6", c.severity, `disjointness constraint "${c.constraintId}" violated: "${node}" co-classifies as both "${a}" and "${b}"`));
              break;
            }
          }
        }
      }
    }
    return out;
  }

  // ------------------------------ SI-7 ------------------------------

  #si7AuthorityNeutrality(candidate: OntologyRecord, graph: ProjectedGraph): SemanticViolation[] {
    const out: SemanticViolation[] = [];

    // A constraint may not target or attempt to weaken a security control.
    if (candidate.kind === "constraint") {
      const c = candidate.unit.body as ConstraintBody;
      const hay = `${c.label} ${JSON.stringify(c.params ?? {})}`.toLowerCase();
      if (/\bs1\b|\bs3\b|\bs4\b|waive|weaken|bypass|override.?security/.test(hay)) {
        out.push(v("SI-7", "block", `constraint "${c.constraintId}" appears to target/weaken a non-waivable S1/S3/S4 control (meaning is not authority)`));
      }
    }

    // No entity attribute may declare a control-plane authority type (would conflate meaning + authority).
    for (const ent of graph.entities.values()) {
      for (const a of ent.attributes) {
        const t = a.type.toLowerCase();
        if (AUTHORITY_TOKENS.some((tok) => t === tok || t === `${tok}[]`)) {
          out.push(v("SI-7", "warn", `entity "${ent.entityId}" attribute "${a.name}" uses an authority-flavored type "${a.type}"; ontology confers no authority`));
        }
      }
    }
    return out;
  }
}

function v(check: SemanticIntegrityCheck, severity: "block" | "warn", detail: string): SemanticViolation {
  return { check, severity, detail };
}

/** Compute, for each entity, the set of its ancestors via classification (child -> ancestors). */
function ancestorClosure(graph: ProjectedGraph): Map<string, Set<string>> {
  const parents = new Map<string, string[]>();
  for (const e of graph.classificationEdges) {
    const list = parents.get(e.child) ?? [];
    list.push(e.parent);
    parents.set(e.child, list);
  }
  const cache = new Map<string, Set<string>>();
  const walk = (node: string, stack: Set<string>): Set<string> => {
    const cached = cache.get(node);
    if (cached) return cached;
    const acc = new Set<string>();
    for (const p of parents.get(node) ?? []) {
      if (stack.has(p)) continue; // guard against cycles (SI-2 reports them separately)
      acc.add(p);
      stack.add(p);
      for (const g of walk(p, stack)) acc.add(g);
      stack.delete(p);
    }
    cache.set(node, acc);
    return acc;
  };
  const all = new Set<string>([...graph.entities.keys()]);
  for (const e of graph.classificationEdges) {
    all.add(e.child);
    all.add(e.parent);
  }
  for (const n of all) walk(n, new Set([n]));
  return cache;
}
