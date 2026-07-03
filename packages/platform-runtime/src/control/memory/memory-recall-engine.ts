/**
 * UCOS Memory Fabric — Recall Engine (MEM-ARCH-001; MEM-SEC-001 §7).
 *
 * The recall entry point used by the control assembly. Delegates resolution to the `MemoryResolver`
 * (local-shadows-foreign, highest active version) and enforces deny-by-default + NO-SYNTHESIS: an
 * unresolved / revoked / expired / below-trust / above-clearance reference resolves to `undefined`
 * (absent), never a fabricated memory. Recall never mutates state.
 */

import type { MemoryRecord } from "./types.ts";
import type { MemoryResolver, RecallOptions } from "./memory-resolver.ts";

export class MemoryRecallEngine {
  readonly #resolver: MemoryResolver;

  constructor(resolver: MemoryResolver) {
    this.#resolver = resolver;
  }

  /** Resolve the single authoritative active record, or `undefined` (deny/absent — no synthesis). */
  recall(namespace: string, memId: string, opts: RecallOptions = {}): MemoryRecord | undefined {
    return this.#resolver.recall(namespace, memId, opts);
  }
}
