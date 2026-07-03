/**
 * UCOS Knowledge Fabric — Snapshot (KNOW-ARCH-001).
 *
 * Deterministic, read-only capture + content hash of a knowledge namespace subtree, used for
 * reconciliation baselines and to detect drift (K12). Mirrors the evolution snapshot pattern.
 */

import type { KnowledgeRecord } from "./types.ts";
import type { KnowledgeStore } from "./knowledge-store.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";

export interface KnowledgeSnapshotResult {
  namespace: string;
  capturedAt: number;
  stateHash: string;
  records: { key: string; unitHash: string; version: string; state: string }[];
}

export class KnowledgeSnapshot {
  readonly #store: KnowledgeStore;

  constructor(store: KnowledgeStore) {
    this.#store = store;
  }

  capture(namespace: string): KnowledgeSnapshotResult {
    const recs: KnowledgeRecord[] = this.#store.inNamespace(namespace);
    const records = recs
      .map((r) => ({ key: `${r.namespace}:${r.knowledgeId}@${r.version}`, unitHash: r.unitHash, version: r.version, state: r.state }))
      .sort((a, b) => a.key.localeCompare(b.key));
    return { namespace, capturedAt: Date.now(), stateHash: sha256(canonicalize(records)), records };
  }

  /** Drift detection: compare two snapshots of the same namespace. */
  drift(before: KnowledgeSnapshotResult, after: KnowledgeSnapshotResult): { drifted: boolean; reason: string } {
    if (before.stateHash === after.stateHash) return { drifted: false, reason: "no drift" };
    return { drifted: true, reason: `state hash changed ${before.stateHash.slice(0, 12)} -> ${after.stateHash.slice(0, 12)}` };
  }
}
