/**
 * CGR-W2-ACR-03 — Authority Supremacy Ordering (Wave-A).
 *
 * Imposes a total, deterministic ordering over resolved authority chains and selects the supreme
 * chain under conflict. Fail-closed: an empty input set or any incomplete chain yields a denial
 * rather than an arbitrary pick. Because ties are always broken canonically by content hash, the
 * ordering is total and never resorts to an arbitrary choice.
 *
 * REUSE JUSTIFICATION:
 *   Consumes only CGR-W2-ACR-02 outputs (`ResolvedAuthorityChain`) and the record `contentHash`
 *   carried on each node (Wave-1 CGR-CORE-03 hashing). No new hashing, ordering primitive, or
 *   store is introduced; supremacy arbitration is new behaviour built from reused values.
 *
 * SUPREMACY RULE (deterministic, total):
 *   1. Every input chain MUST be complete (terminates at the principle root). Any incomplete chain
 *      makes supremacy undecidable → deny (fail-closed).
 *   2. Order ascending by `maxDepth` — a subject nearer the Layer-0 principle root is more
 *      fundamental, hence more supreme.
 *   3. Canonical tie-break by subject node `contentHash` ascending, then subject logical id. Since
 *      distinct records have distinct content hashes, this is a total order with no arbitrary pick.
 *   The supreme chain is the first under this order.
 */

import type { AuthorityDenial, AuthorityDenialCode, ResolvedAuthorityChain } from "./types.ts";

/** The outcome of supremacy arbitration. */
export interface SupremacyResult {
  readonly decided: boolean;
  /** The selected supreme chain (present iff decided). */
  readonly supreme: ResolvedAuthorityChain | null;
  /** All input chains in canonical supremacy order (present iff decided). */
  readonly ordered: readonly ResolvedAuthorityChain[];
  /** The fail-closed denial (present iff not decided). */
  readonly denial: AuthorityDenial | null;
}

function deny(code: AuthorityDenialCode, message: string, detail: Readonly<Record<string, unknown>>): SupremacyResult {
  return { decided: false, supreme: null, ordered: [], denial: { code, message, detail } };
}

/** The subject node's content hash is the canonical tie-break key (subject sits at depth 0). */
function subjectHash(chain: ResolvedAuthorityChain): string {
  const subjectNode = chain.nodes.find((n) => n.logicalId === chain.subject);
  return subjectNode ? subjectNode.contentHash : "";
}

/**
 * Order competing resolved chains and select the supreme one. Returns a fail-closed denial on an
 * empty set or any incomplete chain. Performs zero writes.
 */
export function orderBySupremacy(chains: readonly ResolvedAuthorityChain[]): SupremacyResult {
  if (chains.length === 0) {
    return deny("E-EMPTY-INPUT", "no chains supplied for supremacy arbitration", { count: 0 });
  }
  const incomplete = chains.filter((c) => !c.complete).map((c) => c.subject);
  if (incomplete.length > 0) {
    return deny("E-UNDECIDABLE-SUPREMACY", "supremacy undecidable: one or more chains are incomplete", {
      incomplete,
    });
  }

  const ordered = [...chains].sort((a, b) => {
    if (a.maxDepth !== b.maxDepth) return a.maxDepth - b.maxDepth;
    const ha = subjectHash(a);
    const hb = subjectHash(b);
    if (ha !== hb) return ha < hb ? -1 : 1;
    return a.subject < b.subject ? -1 : a.subject > b.subject ? 1 : 0;
  });

  return {
    decided: true,
    supreme: ordered[0]!,
    ordered: Object.freeze(ordered),
    denial: null,
  };
}
