/**
 * UCOS Ontology Fabric — Snapshot (ONTO-ARCH-001).
 *
 * Deterministic, read-only capture + content hash of an ontology namespace subtree, used for
 * reconciliation baselines, audit state-hash stamping, and drift detection. Mirrors the PI-7 snapshot.
 */

import type { OntologyRecord } from "./types.ts";
import type { OntologyStore } from "./ontology-store.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";

export interface OntologySnapshotResult {
  namespace: string;
  capturedAt: number;
  stateHash: string;
  records: { key: string; unitHash: string; version: string; state: string }[];
}

export class OntologySnapshot {
  readonly #store: OntologyStore;

  constructor(store: OntologyStore) {
    this.#store = store;
  }

  capture(namespace: string): OntologySnapshotResult {
    const recs: OntologyRecord[] = this.#store.inNamespace(namespace);
    const records = recs
      .map((r) => ({ key: r.recordId, unitHash: r.unitHash, version: r.version, state: r.state }))
      .sort((a, b) => a.key.localeCompare(b.key));
    return { namespace, capturedAt: Date.now(), stateHash: sha256(canonicalize(records)), records };
  }

  /** Drift detection: compare two snapshots of the same namespace. */
  drift(before: OntologySnapshotResult, after: OntologySnapshotResult): { drifted: boolean; reason: string } {
    if (before.stateHash === after.stateHash) return { drifted: false, reason: "no drift" };
    return { drifted: true, reason: `state hash changed ${before.stateHash.slice(0, 12)} -> ${after.stateHash.slice(0, 12)}` };
  }
}
