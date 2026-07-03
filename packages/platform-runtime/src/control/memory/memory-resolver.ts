/**
 * UCOS Memory Fabric — Resolver / Recall (MEM-ARCH-001, MEM-SEC-001 §7).
 *
 * Resolves a memory reference `(namespace, memId, versionRange)` to the single authoritative active
 * record, applying local sovereignty (the highest LOCAL active record shadows any FEDERATED record),
 * fail-closed retention/expiry, classification projection, and trust-boundary clamping.
 *
 * NO-SYNTHESIS (M4): recall resolves ONLY to a verified stored record. A reference that cannot resolve
 * returns `undefined` (deny/absent) — the resolver never fabricates memory.
 */

import type { MemoryRecord } from "./types.ts";
import type { MemoryQueryEngine } from "./memory-query-engine.ts";
import { maxSatisfying } from "../../meta-core/semver.ts";
import { parseNamespacedId } from "./memory-namespace.ts";

export interface RecallOptions {
  range?: string;
  minTrustLevel?: number;
  clearanceLevel?: number;
  now?: number;
}

export class MemoryResolver {
  readonly #query: MemoryQueryEngine;

  constructor(query: MemoryQueryEngine) {
    this.#query = query;
  }

  /**
   * Recall the authoritative active record. If any LOCAL active record satisfies the reference, the
   * highest such LOCAL record wins (local sovereignty / local-shadows-foreign); otherwise the highest
   * admissible (possibly federated) record is returned. Deny-by-default and no-synthesis: unresolved,
   * revoked, expired, below-trust, or above-clearance ⇒ `undefined`.
   */
  recall(namespace: string, memId: string, opts: RecallOptions = {}): MemoryRecord | undefined {
    const range = opts.range ?? "*";
    const candidates = this.#query.query({
      namespace,
      versionRange: range,
      predicate: (r) => r.memId === memId,
      ...(opts.minTrustLevel !== undefined ? { minTrustLevel: opts.minTrustLevel } : {}),
      ...(opts.clearanceLevel !== undefined ? { clearanceLevel: opts.clearanceLevel } : {}),
      ...(opts.now !== undefined ? { now: opts.now } : {}),
    });
    if (candidates.length === 0) return undefined;

    const locals = candidates.filter((r) => r.source.kind === "local");
    const pool = locals.length > 0 ? locals : candidates; // local sovereignty
    const best = maxSatisfying(pool.map((r) => r.version), range);
    if (best === undefined) return undefined;
    return pool.find((r) => r.version === best);
  }

  isFederated(memId: string): boolean {
    return parseNamespacedId(memId) !== undefined;
  }
}
