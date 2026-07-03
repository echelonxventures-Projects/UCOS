/**
 * UCOS Knowledge Fabric — Resolver (KNOW-ARCH-001).
 *
 * Resolves a knowledge reference `(namespace, id, versionRange)` to the single authoritative active
 * record, applying local sovereignty (the highest LOCAL active record shadows any FEDERATED record)
 * and trust-boundary clamping. Deny-by-default: unresolved / revoked / below-trust => none.
 */

import type { KnowledgeRecord } from "./types.ts";
import type { KnowledgeQueryEngine } from "./knowledge-query-engine.ts";
import { maxSatisfying } from "../../meta-core/semver.ts";
import { parseNamespacedId } from "./knowledge-namespace.ts";

export class KnowledgeResolver {
  readonly #query: KnowledgeQueryEngine;

  constructor(query: KnowledgeQueryEngine) {
    this.#query = query;
  }

  /**
   * Resolve to the authoritative active record. If any LOCAL active record satisfies the reference,
   * the highest such LOCAL record wins (local sovereignty / local-shadows-foreign); otherwise the
   * highest admissible (possibly federated) record is returned.
   */
  resolve(namespace: string, knowledgeId: string, range = "*", minTrustLevel?: number): KnowledgeRecord | undefined {
    const candidates = this.#query.query({
      namespace,
      versionRange: range,
      predicate: (r) => r.knowledgeId === knowledgeId,
      ...(minTrustLevel !== undefined ? { minTrustLevel } : {}),
    });
    if (candidates.length === 0) return undefined;

    const locals = candidates.filter((r) => r.source.kind === "local");
    const pool = locals.length > 0 ? locals : candidates; // local sovereignty
    const best = maxSatisfying(pool.map((r) => r.version), range);
    if (best === undefined) return undefined;
    return pool.find((r) => r.version === best);
  }

  isFederated(knowledgeId: string): boolean {
    return parseNamespacedId(knowledgeId) !== undefined;
  }
}
