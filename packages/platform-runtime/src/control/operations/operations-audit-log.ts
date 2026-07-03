/**
 * UCOS Operational Proof Fabric — Audit Log (OPF-AUD-001).
 *
 * Hash-chained, tamper-evident, append-only, write-ahead audit of every operational-proof event
 * (attestation, seal, incident lifecycle, alert, health change, SLO breach, exchange). Independently
 * verifiable offline and reconcilable across nodes (distributed capable) — the same proven
 * construction as the PI-5 federation / PI-7 knowledge audits (reused pattern; no custom crypto).
 */

import type { OperationsAuditEntry } from "./types.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";

export interface OperationsChainedEntry {
  entry: OperationsAuditEntry;
  seq: number;
  prevHash: string;
  entryHash: string;
  nodeId: string;
}

export const OPS_GENESIS_HASH = "0".repeat(64);

function computeHash(entry: OperationsAuditEntry, seq: number, prevHash: string, nodeId: string): string {
  return sha256(`${canonicalize(entry)}|${seq}|${prevHash}|${nodeId}`);
}

export type OpsDivergenceClass = "hash-break" | "event-mismatch" | "state-hash-mismatch";

export interface OpsDivergence {
  class: OpsDivergenceClass;
  severity: "high" | "medium";
  detail: string;
}

export interface OpsReconciliationResult {
  status: "consistent" | "divergent";
  divergences: OpsDivergence[];
  failClosed: boolean;
}

interface OpsAuditExport {
  nodeId: string;
  chain: OperationsChainedEntry[];
  headHash: string;
}

export class OperationsAuditLog {
  readonly #nodeId: string;
  readonly #chain: OperationsChainedEntry[] = [];

  constructor(nodeId: string) {
    this.#nodeId = nodeId;
  }

  /** Write-ahead append of an operations audit event. */
  record(entry: OperationsAuditEntry): OperationsChainedEntry {
    const seq = this.#chain.length;
    const prevHash = seq === 0 ? OPS_GENESIS_HASH : (this.#chain[seq - 1] as OperationsChainedEntry).entryHash;
    const entryHash = computeHash(entry, seq, prevHash, this.#nodeId);
    const chained: OperationsChainedEntry = Object.freeze({
      entry: Object.freeze({ ...entry }),
      seq,
      prevHash,
      entryHash,
      nodeId: this.#nodeId,
    });
    this.#chain.push(chained);
    return chained;
  }

  entries(): readonly OperationsAuditEntry[] {
    return this.#chain.map((c) => ({ ...c.entry }));
  }

  chain(): readonly OperationsChainedEntry[] {
    return this.#chain.map((c) => ({ ...c, entry: { ...c.entry } }));
  }

  get headHash(): string {
    return this.#chain.length === 0 ? OPS_GENESIS_HASH : (this.#chain[this.#chain.length - 1] as OperationsChainedEntry).entryHash;
  }

  export(): OpsAuditExport {
    return { nodeId: this.#nodeId, chain: this.chain() as OperationsChainedEntry[], headHash: this.headHash };
  }

  /** Independent, offline verification: recompute every hash and confirm continuity to the head. */
  static verify(exported: OpsAuditExport): { ok: boolean; reason: string } {
    let prev = OPS_GENESIS_HASH;
    for (let i = 0; i < exported.chain.length; i++) {
      const c = exported.chain[i] as OperationsChainedEntry;
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
  static reconcile(local: OpsAuditExport, remote: OpsAuditExport): OpsReconciliationResult {
    const divergences: OpsDivergence[] = [];
    for (const [label, exp] of [["local", local], ["remote", remote]] as const) {
      const v = OperationsAuditLog.verify(exp);
      if (!v.ok) divergences.push({ class: "hash-break", severity: "high", detail: `${label} chain: ${v.reason}` });
    }

    const remoteByKey = new Map<string, OperationsChainedEntry>();
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
