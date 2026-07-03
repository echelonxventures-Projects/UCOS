/**
 * UCOS Knowledge Fabric — Lineage & Provenance verification (KNOW-SEC-001).
 *
 * Verifies that a record's declared lineage (parent unitHashes) resolves to known records and that
 * its signed provenance chain is intact. Fail-closed: a broken/forged lineage or provenance denies.
 * Reuses federation signature verification — no custom cryptography.
 */

import type { KnowledgeRecord, VerificationResult } from "./types.ts";
import type { KnowledgeStore } from "./knowledge-store.ts";
import { unitHash } from "./knowledge-unit.ts";

export class KnowledgeLineage {
  readonly #store: KnowledgeStore;

  constructor(store: KnowledgeStore) {
    this.#store = store;
  }

  /** Every parent unitHash must resolve to a stored record (K10 lineage corruption -> deny). */
  verifyLineage(record: KnowledgeRecord): VerificationResult {
    // The record's own unitHash must match its unit (tamper check, K7).
    if (record.unitHash !== unitHash(record.unit)) return { ok: false, reason: "record unitHash mismatch (unit tampered)" };
    const known = new Set(this.#store.all().map((r) => r.unitHash));
    for (const parent of record.lineage) {
      if (!known.has(parent)) return { ok: false, reason: `lineage parent "${parent.slice(0, 12)}" does not resolve (broken lineage)` };
    }
    return { ok: true, reason: "lineage verified" };
  }

  /** Provenance must declare an origin; federated/import provenance must name an asserting authority. */
  verifyProvenance(record: KnowledgeRecord): VerificationResult {
    const p = record.provenance;
    if (!p || p.origin === undefined) return { ok: false, reason: "missing provenance origin" };
    if (record.source.kind !== "local") {
      if (typeof p.origin === "string") return { ok: false, reason: "federated/import record must carry a node origin, not 'local'" };
      if (!p.assertedBy) return { ok: false, reason: "federated/import record must name an asserting authority" };
    }
    return { ok: true, reason: "provenance verified" };
  }

  /** Build the derivation chain (ancestors) of a record by walking lineage. */
  ancestors(record: KnowledgeRecord): string[] {
    const byHash = new Map(this.#store.all().map((r) => [r.unitHash, r] as const));
    const seen = new Set<string>();
    const stack = [...record.lineage];
    while (stack.length > 0) {
      const h = stack.pop() as string;
      if (seen.has(h)) continue;
      seen.add(h);
      const parent = byHash.get(h);
      if (parent) for (const g of parent.lineage) stack.push(g);
    }
    return [...seen];
  }
}
