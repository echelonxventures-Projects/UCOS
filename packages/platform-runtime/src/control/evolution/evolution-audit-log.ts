/**
 * UCOS Evolution Fabric — Evolution Audit Log (EVO-AUD-001).
 *
 * Hash-chained, tamper-evident, append-only log of every evolution lifecycle event. Entries are
 * written AHEAD of state commit (write-ahead) so a crash mid-apply is diagnosable and the snapshot is
 * always recoverable. The chain is independently verifiable offline and reconcilable across nodes —
 * the same construction proven in the PI-5 federation audit.
 */

import type { EvolutionAuditEntry } from "./types.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";

export interface EvolutionChainedEntry {
  entry: EvolutionAuditEntry;
  seq: number;
  prevHash: string;
  entryHash: string;
  nodeId: string;
}

export const EVO_GENESIS_HASH = "0".repeat(64);

function computeHash(entry: EvolutionAuditEntry, seq: number, prevHash: string, nodeId: string): string {
  return sha256(`${canonicalize(entry)}|${seq}|${prevHash}|${nodeId}`);
}

export type EvoDivergenceClass = "hash-break" | "event-mismatch" | "state-hash-mismatch";

export interface EvoDivergence {
  class: EvoDivergenceClass;
  severity: "high" | "medium";
  detail: string;
}

export interface EvoReconciliationResult {
  status: "consistent" | "divergent";
  divergences: EvoDivergence[];
  failClosed: boolean;
}

interface EvoAuditExport {
  nodeId: string;
  chain: EvolutionChainedEntry[];
  headHash: string;
}

export class EvolutionAuditLog {
  readonly #nodeId: string;
  readonly #chain: EvolutionChainedEntry[] = [];

  constructor(nodeId: string) {
    this.#nodeId = nodeId;
  }

  /** Write-ahead append of an evolution audit event. */
  record(entry: EvolutionAuditEntry): EvolutionChainedEntry {
    const seq = this.#chain.length;
    const prevHash = seq === 0 ? EVO_GENESIS_HASH : (this.#chain[seq - 1] as EvolutionChainedEntry).entryHash;
    const entryHash = computeHash(entry, seq, prevHash, this.#nodeId);
    const chained: EvolutionChainedEntry = Object.freeze({
      entry: Object.freeze({ ...entry }),
      seq,
      prevHash,
      entryHash,
      nodeId: this.#nodeId,
    });
    this.#chain.push(chained);
    return chained;
  }

  entries(): readonly EvolutionAuditEntry[] {
    return this.#chain.map((c) => ({ ...c.entry }));
  }

  chain(): readonly EvolutionChainedEntry[] {
    return this.#chain.map((c) => ({ ...c, entry: { ...c.entry } }));
  }

  get headHash(): string {
    return this.#chain.length === 0 ? EVO_GENESIS_HASH : (this.#chain[this.#chain.length - 1] as EvolutionChainedEntry).entryHash;
  }

  export(): EvoAuditExport {
    return { nodeId: this.#nodeId, chain: this.chain() as EvolutionChainedEntry[], headHash: this.headHash };
  }

  /** Independent, offline verification: recompute every hash and confirm continuity to the head. */
  static verify(exported: EvoAuditExport): { ok: boolean; reason: string } {
    let prev = EVO_GENESIS_HASH;
    for (let i = 0; i < exported.chain.length; i++) {
      const c = exported.chain[i] as EvolutionChainedEntry;
      if (c.seq !== i) return { ok: false, reason: `seq gap at index ${i} (seq=${c.seq})` };
      if (c.prevHash !== prev) return { ok: false, reason: `prevHash break at seq ${i}` };
      const recomputed = computeHash(c.entry, c.seq, c.prevHash, exported.nodeId);
      if (recomputed !== c.entryHash) return { ok: false, reason: `entryHash mismatch at seq ${i} (tamper)` };
      prev = c.entryHash;
    }
    if (prev !== exported.headHash) return { ok: false, reason: "head hash mismatch" };
    return { ok: true, reason: "chain intact" };
  }

  /**
   * Cross-node reconciliation. Verifies both chains, then compares shared unit events (by unitHash +
   * event) for state-hash agreement. Any hash break or state-hash mismatch is high-severity and
   * fail-closed.
   */
  static reconcile(local: EvoAuditExport, remote: EvoAuditExport): EvoReconciliationResult {
    const divergences: EvoDivergence[] = [];
    for (const [label, exp] of [["local", local], ["remote", remote]] as const) {
      const v = EvolutionAuditLog.verify(exp);
      if (!v.ok) divergences.push({ class: "hash-break", severity: "high", detail: `${label} chain: ${v.reason}` });
    }

    const remoteByKey = new Map<string, EvolutionChainedEntry>();
    for (const c of remote.chain) remoteByKey.set(`${c.entry.unitHash}\u0000${c.entry.event}`, c);

    for (const c of local.chain) {
      const counterpart = remoteByKey.get(`${c.entry.unitHash}\u0000${c.entry.event}`);
      if (!counterpart) continue;
      if ((c.entry.stateHash ?? "") !== (counterpart.entry.stateHash ?? "")) {
        divergences.push({
          class: "state-hash-mismatch",
          severity: "high",
          detail: `unit ${c.entry.unitHash.slice(0, 12)} event ${c.entry.event}: state-hash divergence`,
        });
      }
    }

    const failClosed = divergences.some((d) => d.severity === "high");
    return { status: divergences.length === 0 ? "consistent" : "divergent", divergences, failClosed };
  }
}
