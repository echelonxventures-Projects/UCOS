/**
 * UCOS PI-11 Simulation Fabric — M12 Simulation Audit Log (SIM-AUD-001, S6/S10).
 *
 * A hash-chained, tamper-evident, append-only audit for `SIM_*` events. It reuses the federation
 * fabric's `sha256` / `canonicalize` primitives (SIM-COND-2: NO custom cryptography) exactly as the
 * `FederatedAuditLog` / `EvolutionAuditLog` do. The chain records reproducibility digests for
 * projections and promotions (A2/A8) and is independently verifiable offline (tamper detection, S10).
 */

import { canonicalize, sha256 } from "../federation/assertions.ts";
import type { SimAuditEntry, SimulationSink } from "./types.ts";

export interface SimChainedEntry {
  entry: SimAuditEntry;
  seq: number;
  prevHash: string;
  entryHash: string;
  nodeId: string;
}

export const SIM_GENESIS_HASH = "0".repeat(64);

function computeHash(entry: SimAuditEntry, seq: number, prevHash: string, nodeId: string): string {
  return sha256(`${canonicalize(entry)}|${seq}|${prevHash}|${nodeId}`);
}

export class SimulationAuditLog implements SimulationSink {
  readonly #nodeId: string;
  readonly #chain: SimChainedEntry[] = [];

  constructor(nodeId: string) {
    this.#nodeId = nodeId;
  }

  record(entry: SimAuditEntry): void {
    const seq = this.#chain.length;
    const prevHash = seq === 0 ? SIM_GENESIS_HASH : this.#chain[seq - 1]!.entryHash;
    const entryHash = computeHash(entry, seq, prevHash, this.#nodeId);
    this.#chain.push(
      Object.freeze({ entry: Object.freeze({ ...entry }), seq, prevHash, entryHash, nodeId: this.#nodeId }),
    );
  }

  entries(): readonly SimAuditEntry[] {
    return this.#chain.map((c) => ({ ...c.entry }));
  }

  chain(): readonly SimChainedEntry[] {
    return this.#chain.map((c) => ({ ...c, entry: { ...c.entry } }));
  }

  get headHash(): string {
    return this.#chain.length === 0 ? SIM_GENESIS_HASH : this.#chain[this.#chain.length - 1]!.entryHash;
  }

  export(): { nodeId: string; chain: SimChainedEntry[]; headHash: string } {
    return { nodeId: this.#nodeId, chain: this.chain() as SimChainedEntry[], headHash: this.headHash };
  }

  /** Offline, independent verification: recompute every hash + confirm continuity. Detects any tamper. */
  static verify(exported: { nodeId: string; chain: SimChainedEntry[]; headHash: string }): {
    ok: boolean;
    reason: string;
  } {
    let prev = SIM_GENESIS_HASH;
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
