/**
 * UCOS Memory Fabric — Audit Log (MEM-AUD-001).
 *
 * Hash-chained, tamper-evident, append-only, write-ahead audit of every memory lifecycle and
 * federation event — including recall DENIALS (no silent deny). Independently verifiable offline and
 * reconcilable across nodes. The same proven construction as the PI-5/PI-7 audit (reused pattern; no
 * custom cryptography).
 *
 * Audit-preserving forgetting (MEM-AUD-001 §5): forgetting operates on recallable memory VALUES via
 * revocation; the append-only audit chain is OUT OF SCOPE for deletion — the fact that a memory
 * existed and was forgotten is permanently retained (closes the over-forgetting side of M9).
 */

import type { MemoryAuditEntry } from "./types.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";

export interface MemoryChainedEntry {
  entry: MemoryAuditEntry;
  seq: number;
  prevHash: string;
  entryHash: string;
  nodeId: string;
}

export const MEM_GENESIS_HASH = "0".repeat(64);

function computeHash(entry: MemoryAuditEntry, seq: number, prevHash: string, nodeId: string): string {
  return sha256(`${canonicalize(entry)}|${seq}|${prevHash}|${nodeId}`);
}

export type MemDivergenceClass = "hash-break" | "event-mismatch" | "state-hash-mismatch";

export interface MemDivergence {
  class: MemDivergenceClass;
  severity: "high" | "medium";
  detail: string;
}

export interface MemReconciliationResult {
  status: "consistent" | "divergent";
  divergences: MemDivergence[];
  failClosed: boolean;
}

interface MemAuditExport {
  nodeId: string;
  chain: MemoryChainedEntry[];
  headHash: string;
}

export class MemoryAuditLog {
  readonly #nodeId: string;
  readonly #chain: MemoryChainedEntry[] = [];

  constructor(nodeId: string) {
    this.#nodeId = nodeId;
  }

  /** Write-ahead append of a memory audit event. */
  record(entry: MemoryAuditEntry): MemoryChainedEntry {
    const seq = this.#chain.length;
    const prevHash = seq === 0 ? MEM_GENESIS_HASH : (this.#chain[seq - 1] as MemoryChainedEntry).entryHash;
    const entryHash = computeHash(entry, seq, prevHash, this.#nodeId);
    const chained: MemoryChainedEntry = Object.freeze({
      entry: Object.freeze({ ...entry }),
      seq,
      prevHash,
      entryHash,
      nodeId: this.#nodeId,
    });
    this.#chain.push(chained);
    return chained;
  }

  entries(): readonly MemoryAuditEntry[] {
    return this.#chain.map((c) => ({ ...c.entry }));
  }

  chain(): readonly MemoryChainedEntry[] {
    return this.#chain.map((c) => ({ ...c, entry: { ...c.entry } }));
  }

  get headHash(): string {
    return this.#chain.length === 0 ? MEM_GENESIS_HASH : (this.#chain[this.#chain.length - 1] as MemoryChainedEntry).entryHash;
  }

  export(): MemAuditExport {
    return { nodeId: this.#nodeId, chain: this.chain() as MemoryChainedEntry[], headHash: this.headHash };
  }

  /** Independent, offline verification: recompute every hash and confirm continuity to the head. */
  static verify(exported: MemAuditExport): { ok: boolean; reason: string } {
    let prev = MEM_GENESIS_HASH;
    for (let i = 0; i < exported.chain.length; i++) {
      const c = exported.chain[i] as MemoryChainedEntry;
      if (c.seq !== i) return { ok: false, reason: `seq gap at index ${i} (seq=${c.seq})` };
      if (c.prevHash !== prev) return { ok: false, reason: `prevHash break at seq ${i}` };
      const recomputed = computeHash(c.entry, c.seq, c.prevHash, exported.nodeId);
      if (recomputed !== c.entryHash) return { ok: false, reason: `entryHash mismatch at seq ${i} (tamper)` };
      prev = c.entryHash;
    }
    if (prev !== exported.headHash) return { ok: false, reason: "head hash mismatch" };
    return { ok: true, reason: "chain intact" };
  }

  /** Cross-node reconciliation: verify both chains, then compare shared unit events for agreement. */
  static reconcile(local: MemAuditExport, remote: MemAuditExport): MemReconciliationResult {
    const divergences: MemDivergence[] = [];
    for (const [label, exp] of [["local", local], ["remote", remote]] as const) {
      const v = MemoryAuditLog.verify(exp);
      if (!v.ok) divergences.push({ class: "hash-break", severity: "high", detail: `${label} chain: ${v.reason}` });
    }

    const remoteByKey = new Map<string, MemoryChainedEntry>();
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
