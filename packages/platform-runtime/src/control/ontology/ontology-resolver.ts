/**
 * UCOS Ontology Fabric — Resolver (ONTO-ARCH-001 §4).
 *
 * Resolves an ontology reference `(namespace, kind, localId, versionRange)` to the single authoritative
 * active record, applying local sovereignty (the highest LOCAL active record shadows any FEDERATED
 * record — PRV-2 / FGP-1) and trust-boundary clamping. Deny-by-default: unresolved / revoked /
 * below-trust => none. Never a silent substitution.
 */

import type { OntologyKind, OntologyRecord } from "./types.ts";
import type { OntologyQueryEngine } from "./ontology-query-engine.ts";
import { maxSatisfying } from "../../meta-core/semver.ts";
import { parseNamespacedId } from "./ontology-namespace.ts";

export class OntologyResolver {
  readonly #query: OntologyQueryEngine;

  constructor(query: OntologyQueryEngine) {
    this.#query = query;
  }

  /**
   * Resolve to the authoritative active record. If any LOCAL active record satisfies the reference, the
   * highest such LOCAL record wins (local sovereignty / local-shadows-foreign); otherwise the highest
   * admissible (possibly federated) record is returned.
   */
  resolve(namespace: string, kind: OntologyKind, localId: string, range = "*", minTrustLevel?: number): OntologyRecord | undefined {
    const candidates = this.#query.query({
      namespace,
      kind,
      versionRange: range,
      predicate: (r) => r.localId === localId,
      ...(minTrustLevel !== undefined ? { minTrustLevel } : {}),
    });
    if (candidates.length === 0) return undefined;

    const locals = candidates.filter((r) => r.source.kind === "local");
    const pool = locals.length > 0 ? locals : candidates; // local sovereignty
    const best = maxSatisfying(pool.map((r) => r.version), range);
    if (best === undefined) return undefined;
    return pool.find((r) => r.version === best);
  }

  isFederated(localId: string): boolean {
    return parseNamespacedId(localId) !== undefined;
  }
}
