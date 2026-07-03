/**
 * UCOS Knowledge Fabric — Audit Log (KNOW-AUD-001).
 *
 * Hash-chained, tamper-evident, append-only, write-ahead audit of every knowledge lifecycle and
 * federation event. Independently verifiable offline and reconcilable across nodes — the same proven
 * construction as the PI-5 federation audit (reused pattern; no custom cryptography).
 */

import type { KnowledgeAuditEntry } from "./types.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";

export interface KnowledgeChainedEntry {
  entry: KnowledgeAuditEntry;
  seq: number;
  prevHash: string;
  entryHash: string;
  nodeId: string;
}

export const KNOW_GENESIS_HASH = "0".repeat(64);

function computeHash(entry: KnowledgeAuditEntry, seq: number, prevHash: string, nodeId: string): string {
  return sha256(`${canonicalize(entry)}|${seq}|${prevHash}|${nodeId}`);
}

export type KnowDivergenceClass = "hash-break" | "event-mismatch" | "state-hash-mismatch";

export interface KnowDivergence {
  class: KnowDivergenceClass;
  severity: "high" | "medium";
  detail: string;
}

export interface KnowReconciliationResult {
  status: "consistent" | "divergent";
  divergences: KnowDivergence[];
  failClosed: boolean;
}

interface KnowAuditExport {
  nodeId: string;
  chain: KnowledgeChainedEntry[];
  headHash: string;
}

export class KnowledgeAuditLog {
  readonly #nodeId: string;
  readonly #chain: KnowledgeChainedEntry[] = [];

  constructor(nodeId: string) {
    this.#nodeId = nodeId;
  }

  /** Write-ahead append of a knowledge audit event. */
  record(entry: KnowledgeAuditEntry): KnowledgeChainedEntry {
    const seq = this.#chain.length;
    const prevHash = seq === 0 ? KNOW_GENESIS_HASH : (this.#chain[seq - 1] as KnowledgeChainedEntry).entryHash;
    const entryHash = computeHash(entry, seq, prevHash, this.#nodeId);
    const chained: KnowledgeChainedEntry = Object.freeze({
      entry: Object.freeze({ ...entry }),
      seq,
      prevHash,
      entryHash,
      nodeId: this.#nodeId,
    });
    this.#chain.push(chained);
    return chained;
  }

  entries(): readonly KnowledgeAuditEntry[] {
    return this.#chain.map((c) => ({ ...c.entry }));
  }

  chain(): readonly KnowledgeChainedEntry[] {
    return this.#chain.map((c) => ({ ...c, entry: { ...c.entry } }));
  }

  get headHash(): string {
    return this.#chain.length === 0 ? KNOW_GENESIS_HASH : (this.#chain[this.#chain.length - 1] as KnowledgeChainedEntry).entryHash;
  }

  export(): KnowAuditExport {
    return { nodeId: this.#nodeId, chain: this.chain() as KnowledgeChainedEntry[], headHash: this.headHash };
  }

  /** Independent, offline verification: recompute every hash and confirm continuity to the head. */
  static verify(exported: KnowAuditExport): { ok: boolean; reason: string } {
    let prev = KNOW_GENESIS_HASH;
    for (let i = 0; i < exported.chain.length; i++) {
      const c = exported.chain[i] as KnowledgeChainedEntry;
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
  static reconcile(local: KnowAuditExport, remote: KnowAuditExport): KnowReconciliationResult {
    const divergences: KnowDivergence[] = [];
    for (const [label, exp] of [["local", local], ["remote", remote]] as const) {
      const v = KnowledgeAuditLog.verify(exp);
      if (!v.ok) divergences.push({ class: "hash-break", severity: "high", detail: `${label} chain: ${v.reason}` });
    }

    const remoteByKey = new Map<string, KnowledgeChainedEntry>();
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
