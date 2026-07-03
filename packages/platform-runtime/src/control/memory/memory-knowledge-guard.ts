/**
 * UCOS Memory Fabric — Memory↔Knowledge Co-Ratification Guard (MEM-GOV-001 §2.4; MEM-THREAT-001 M11).
 *
 * Closes the semantic-drift / memory↔knowledge desynchronization surface. A SEMANTIC-tier memory whose
 * unit carries a `knowledgeRef` is a knowledge-backed assertion: it may exist only while the referenced
 * knowledge is CO-RATIFIED (i.e. currently in an `active`/`ratified` state). This guard is fail-closed
 * and deny-by-default:
 *
 *   - a knowledge-backed semantic memory committed WITHOUT a knowledge oracle is denied (co-ratification
 *     cannot be established);
 *   - a `knowledgeRef` that does not resolve (dangling / unknown) is denied (reference validation);
 *   - a `knowledgeRef` whose knowledge is revoked/superseded/draft (i.e. NOT co-ratified) is denied — a
 *     semantic memory may not contradict or outlive ratified knowledge (this also closes the knowledge
 *     rollback attack: once the backing knowledge is rolled back, recall of the stale memory denies).
 *
 * The guard consults an injected, read-only `MemoryKnowledgeOracle` — it NEVER dereferences, mutates, or
 * co-ratifies knowledge itself (that authority lives in the Knowledge Fabric). It is pure and additive;
 * it reuses no cryptography and touches no core dir. Cross-reference TAMPERING is already closed upstream
 * by the unit-hash binding (mutating `knowledgeRef` changes `unitHash` ⇒ the commit integrity check
 * rejects it); this guard adds the state/consistency half.
 */

import type { MemoryRecord } from "./types.ts";

/**
 * Read-only co-ratification oracle over the ratified Knowledge Fabric. Returns the current state of a
 * knowledge reference, or `undefined` when the reference is unknown/dangling. Implementations MUST NOT
 * fabricate state (no-synthesis): an unknown reference is `undefined`, never a default "active".
 */
export interface MemoryKnowledgeOracle {
  status(knowledgeRef: string): { state: string } | undefined;
}

/** Knowledge states under which a semantic memory may be co-ratified (bound). */
const CO_RATIFIABLE = new Set(["active", "ratified"]);

export class MemoryKnowledgeGuard {
  /** True when `record` is a knowledge-backed semantic memory that requires co-ratification. */
  static requiresCoRatification(record: MemoryRecord): boolean {
    const ref = record.unit.knowledgeRef;
    return record.tier === "semantic" && typeof ref === "string" && ref.length > 0;
  }

  /**
   * Evaluate co-ratification for `record` against `oracle` (fail-closed). Returns `ok:true` when the
   * record does not require co-ratification, or when its `knowledgeRef` resolves to a co-ratified
   * (`active`/`ratified`) knowledge record. Otherwise returns a denial reason.
   */
  static evaluate(record: MemoryRecord, oracle?: MemoryKnowledgeOracle): { ok: true } | { ok: false; reason: string } {
    if (!MemoryKnowledgeGuard.requiresCoRatification(record)) return { ok: true };
    const ref = record.unit.knowledgeRef as string;
    if (!oracle) {
      return { ok: false, reason: `knowledge-backed semantic memory requires a co-ratification oracle (ref=${ref}); none configured (fail-closed)` };
    }
    const status = oracle.status(ref);
    if (status === undefined) {
      return { ok: false, reason: `knowledgeRef does not resolve to ratified knowledge (dangling/unknown ref=${ref})` };
    }
    if (!CO_RATIFIABLE.has(status.state)) {
      return { ok: false, reason: `knowledgeRef is not co-ratified (ref=${ref} state=${status.state}); semantic memory may not contradict/outlive ratified knowledge` };
    }
    return { ok: true };
  }

  /** Convenience predicate for recall-time re-validation (M11 knowledge rollback). */
  static isCoRatified(record: MemoryRecord, oracle?: MemoryKnowledgeOracle): boolean {
    return MemoryKnowledgeGuard.evaluate(record, oracle).ok;
  }
}
