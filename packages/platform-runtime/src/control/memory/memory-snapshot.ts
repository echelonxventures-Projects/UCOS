/**
 * UCOS Memory Fabric — Snapshot (MEM-ARCH-001, MEM-AUD-001).
 *
 * Deterministic, read-only capture + content hash of a memory namespace subtree, used for
 * reconciliation baselines and to detect drift. Mirrors the evolution/knowledge snapshot pattern
 * (reuses federation canonicalize + sha256; no custom crypto).
 */

import type { MemoryRecord } from "./types.ts";
import type { MemoryStore } from "./memory-store.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";

export interface MemorySnapshotResult {
  namespace: string;
  capturedAt: number;
  stateHash: string;
  records: { key: string; unitHash: string; version: string; state: string }[];
}

export class MemorySnapshot {
  readonly #store: MemoryStore;

  constructor(store: MemoryStore) {
    this.#store = store;
  }

  capture(namespace: string): MemorySnapshotResult {
    const recs: MemoryRecord[] = this.#store.inNamespace(namespace);
    const records = recs
      .map((r) => ({ key: `${r.namespace}:${r.memId}@${r.version}`, unitHash: r.unitHash, version: r.version, state: r.state }))
      .sort((a, b) => a.key.localeCompare(b.key));
    return { namespace, capturedAt: Date.now(), stateHash: sha256(canonicalize(records)), records };
  }

  /** Drift detection: compare two snapshots of the same namespace. */
  drift(before: MemorySnapshotResult, after: MemorySnapshotResult): { drifted: boolean; reason: string } {
    if (before.stateHash === after.stateHash) return { drifted: false, reason: "no drift" };
    return { drifted: true, reason: `state hash changed ${before.stateHash.slice(0, 12)} -> ${after.stateHash.slice(0, 12)}` };
  }
}
