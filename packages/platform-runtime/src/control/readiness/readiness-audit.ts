/**
 * UCOS Readiness Fabric — Audit Log (RDN-AUD-001).
 *
 * Hash-chained, tamper-evident, append-only, write-ahead audit of every readiness event — including
 * CERTIFICATION DENIALS (no silent deny). Independently verifiable offline and reconcilable across
 * nodes. Same proven construction as the ratified PI-5/PI-7/PI-9 audits (reused pattern; NO custom
 * cryptography).
 */

import type { ReadinessAuditEntry } from "./types.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";

export interface ReadinessChainedEntry {
  entry: ReadinessAuditEntry;
  seq: number;
  prevHash: string;
  entryHash: string;
  nodeId: string;
}

export const RDN_GENESIS_HASH = "0".repeat(64);

function computeHash(entry: ReadinessAuditEntry, seq: number, prevHash: string, nodeId: string): string {
  return sha256(`${canonicalize(entry)}|${seq}|${prevHash}|${nodeId}`);
}

export type RdnDivergenceClass = "hash-break" | "event-mismatch" | "state-hash-mismatch";

export interface RdnDivergence {
  class: RdnDivergenceClass;
  severity: "high" | "medium";
  detail: string;
}

export interface RdnReconciliationResult {
  status: "consistent" | "divergent";
  divergences: RdnDivergence[];
  failClosed: boolean;
}

export interface RdnAuditExport {
  nodeId: string;
  chain: ReadinessChainedEntry[];
  headHash: string;
}

export class ReadinessAuditLog {
  readonly #nodeId: string;
  readonly #chain: ReadinessChainedEntry[] = [];

  constructor(nodeId: string) {
    this.#nodeId = nodeId;
  }

  /** Write-ahead append of a readiness audit event. */
  record(entry: ReadinessAuditEntry): ReadinessChainedEntry {
    const seq = this.#chain.length;
    const prevHash = seq === 0 ? RDN_GENESIS_HASH : (this.#chain[seq - 1] as ReadinessChainedEntry).entryHash;
    const entryHash = computeHash(entry, seq, prevHash, this.#nodeId);
    const chained: ReadinessChainedEntry = Object.freeze({
      entry: Object.freeze({ ...entry }),
      seq,
      prevHash,
      entryHash,
      nodeId: this.#nodeId,
    });
    this.#chain.push(chained);
    return chained;
  }

  entries(): readonly ReadinessAuditEntry[] {
    return this.#chain.map((c) => ({ ...c.entry }));
  }

  chain(): readonly ReadinessChainedEntry[] {
    return this.#chain.map((c) => ({ ...c, entry: { ...c.entry } }));
  }

  get headHash(): string {
    return this.#chain.length === 0
      ? RDN_GENESIS_HASH
      : (this.#chain[this.#chain.length - 1] as ReadinessChainedEntry).entryHash;
  }

  export(): RdnAuditExport {
    return { nodeId: this.#nodeId, chain: this.chain() as ReadinessChainedEntry[], headHash: this.headHash };
  }

  /** Independent, offline verification: recompute every hash and confirm continuity to the head. */
  static verify(exported: RdnAuditExport): { ok: boolean; reason: string } {
    let prev = RDN_GENESIS_HASH;
    for (let i = 0; i < exported.chain.length; i++) {
      const c = exported.chain[i] as ReadinessChainedEntry;
      if (c.seq !== i) return { ok: false, reason: `seq gap at index ${i} (seq=${c.seq})` };
      if (c.prevHash !== prev) return { ok: false, reason: `prevHash break at seq ${i}` };
      const recomputed = computeHash(c.entry, c.seq, c.prevHash, exported.nodeId);
      if (recomputed !== c.entryHash) return { ok: false, reason: `entryHash mismatch at seq ${i} (tamper)` };
      prev = c.entryHash;
    }
    if (prev !== exported.headHash) return { ok: false, reason: "head hash mismatch" };
    return { ok: true, reason: "chain intact" };
  }

  /** Cross-node reconciliation: verify both chains, then compare shared subject events for agreement. */
  static reconcile(local: RdnAuditExport, remote: RdnAuditExport): RdnReconciliationResult {
    const divergences: RdnDivergence[] = [];
    for (const [label, exp] of [["local", local], ["remote", remote]] as const) {
      const v = ReadinessAuditLog.verify(exp);
      if (!v.ok) divergences.push({ class: "hash-break", severity: "high", detail: `${label} chain: ${v.reason}` });
    }

    const remoteByKey = new Map<string, ReadinessChainedEntry>();
    for (const c of remote.chain) remoteByKey.set(`${c.entry.subject}\u0000${c.entry.event}`, c);

    for (const c of local.chain) {
      const counterpart = remoteByKey.get(`${c.entry.subject}\u0000${c.entry.event}`);
      if (!counterpart) continue;
      if ((c.entry.stateHash ?? "") !== (counterpart.entry.stateHash ?? "")) {
        divergences.push({
          class: "state-hash-mismatch",
          severity: "high",
          detail: `subject ${c.entry.subject} event ${c.entry.event}: state-hash divergence`,
        });
      }
    }

    const failClosed = divergences.some((d) => d.severity === "high");
    return { status: divergences.length === 0 ? "consistent" : "divergent", divergences, failClosed };
  }
}
