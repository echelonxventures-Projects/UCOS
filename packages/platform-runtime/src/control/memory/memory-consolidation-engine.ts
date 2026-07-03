/**
 * UCOS Memory Fabric — Consolidation Engine (MEM-GOV-002 §1; MEM-ARCH-001).
 *
 * Deterministically promotes/consolidates source memories into a higher-tier target record, enforcing
 * MONOTONIC classification (MGP-3 / S4): the consolidated classification is the max over target + all
 * sources and may never be lowered. Merges provenance lineage (the consolidation DAG) without
 * duplication. Pure/deterministic — no side effects; durable persistence is performed by the control
 * assembly via the Evolution Fabric (MGP-4).
 */

import type { MemoryRecord } from "./types.ts";
import { MemoryRetention } from "./memory-retention.ts";

export class MemoryConsolidationEngine {
  /**
   * Produce the consolidated (promoted) record. Classification is raised to max(target, sources);
   * an attempt to lower below any source throws (fail-closed, MGP-3). Lineage is the de-duplicated
   * union of the target's lineage and every source `unitHash`.
   */
  static consolidate(target: MemoryRecord, sources: readonly MemoryRecord[]): MemoryRecord {
    const reconciled = MemoryRetention.reconcileClassification(
      target.classification,
      sources.map((s) => s.classification),
    );
    MemoryRetention.assertMonotonic(target.classification, reconciled);
    const lineage = [...new Set([...target.lineage, ...sources.map((s) => s.unitHash)])];
    return { ...target, classification: reconciled, lineage };
  }
}
