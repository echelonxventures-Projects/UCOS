/**
 * UCOS Memory Fabric — Reconciliation Engine (MEM-AUD-001 §4; MEM-GOV-001 C12).
 *
 * Cross-node memory reconciliation over exported, hash-chained audit logs. Verifies both chains are
 * intact, then compares shared (unitHash, event) entries for state-hash agreement. FAIL-CLOSED: any
 * high-severity divergence (a broken chain or a state-hash mismatch on a shared event) sets
 * `failClosed = true`, signalling that the divergent foreign view must NOT be trusted/merged without
 * local adjudication (local sovereignty). Deterministic; no side effects. Reuses the audit primitives
 * (no custom crypto).
 */

import { MemoryAuditLog, type MemReconciliationResult } from "./memory-audit.ts";

interface MemAuditExport {
  nodeId: string;
  chain: Parameters<typeof MemoryAuditLog.verify>[0]["chain"];
  headHash: string;
}

export class MemoryReconciliationEngine {
  /** Reconcile a local audit export against a remote one; fail-closed on high-severity divergence. */
  static reconcile(local: MemAuditExport, remote: MemAuditExport): MemReconciliationResult {
    return MemoryAuditLog.reconcile(local, remote);
  }

  /** Convenience: true when the two nodes' shared memory history is consistent and both chains verify. */
  static consistent(local: MemAuditExport, remote: MemAuditExport): boolean {
    const r = MemoryAuditLog.reconcile(local, remote);
    return r.status === "consistent" && !r.failClosed;
  }
}
