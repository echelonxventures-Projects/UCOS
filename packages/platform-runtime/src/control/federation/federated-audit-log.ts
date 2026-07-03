/**
 * UCOS Federation Fabric — Federated Audit Log (FED-AUD-001).
 *
 * A federation-grade `AuditSink` that wraps each PI-4 `AuditEntry` in a hash-chained, tamper-evident
 * `ChainedEntry`. The chain is append-only, exportable, and independently verifiable offline. The PI-4
 * `AuditEntry` shape and `ControlPlane` audit call are UNCHANGED — chaining is added around them.
 */

import type { AuditEntry } from "../types.ts";
import type { AuditSink } from "../audit-log.ts";
import { canonicalize, sha256 } from "./assertions.ts";

export interface ChainedEntry {
  entry: AuditEntry;
  seq: number;
  prevHash: string;
  entryHash: string;
  nodeId: string;
}

export const GENESIS_HASH = "0".repeat(64);

function computeHash(entry: AuditEntry, seq: number, prevHash: string, nodeId: string): string {
  return sha256(`${canonicalize(entry)}|${seq}|${prevHash}|${nodeId}`);
}

export class FederatedAuditLog implements AuditSink {
  readonly #nodeId: string;
  readonly #chain: ChainedEntry[] = [];

  constructor(nodeId: string) {
    this.#nodeId = nodeId;
  }

  record(entry: AuditEntry): void {
    const seq = this.#chain.length;
    const prevHash = seq === 0 ? GENESIS_HASH : this.#chain[seq - 1]!.entryHash;
    const entryHash = computeHash(entry, seq, prevHash, this.#nodeId);
    this.#chain.push(Object.freeze({ entry: Object.freeze({ ...entry }), seq, prevHash, entryHash, nodeId: this.#nodeId }));
  }

  /** PI-4 AuditSink surface: plain entries (defensive copies). */
  entries(): readonly AuditEntry[] {
    return this.#chain.map((c) => ({ ...c.entry }));
  }

  /** Full chained view (defensive copies). */
  chain(): readonly ChainedEntry[] {
    return this.#chain.map((c) => ({ ...c, entry: { ...c.entry } }));
  }

  get headHash(): string {
    return this.#chain.length === 0 ? GENESIS_HASH : this.#chain[this.#chain.length - 1]!.entryHash;
  }

  /** Deterministic export (chain + signed-able head commitment). */
  export(): { nodeId: string; chain: ChainedEntry[]; headHash: string } {
    return { nodeId: this.#nodeId, chain: this.chain() as ChainedEntry[], headHash: this.headHash };
  }

  /**
   * Independent, offline verification of an exported chain: recompute every entryHash and confirm
   * continuity (prevHash linkage) up to the head. Detects any tamper/removal/reorder.
   */
  static verify(exported: { nodeId: string; chain: ChainedEntry[]; headHash: string }): { ok: boolean; reason: string } {
    let prev = GENESIS_HASH;
    for (let i = 0; i < exported.chain.length; i++) {
      const c = exported.chain[i]!;
      if (c.seq !== i) return { ok: false, reason: `seq gap at index ${i} (seq=${c.seq})` };
      if (c.prevHash !== prev) return { ok: false, reason: `prevHash break at seq ${i}` };
      const recomputed = computeHash(c.entry, c.seq, c.prevHash, exported.nodeId);
      if (recomputed !== c.entryHash) return { ok: false, reason: `entryHash mismatch at seq ${i} (tamper)` };
      prev = c.entryHash;
    }
    if (prev !== exported.headHash) return { ok: false, reason: "head hash mismatch" };
    return { ok: true, reason: "chain intact" };
  }
}
