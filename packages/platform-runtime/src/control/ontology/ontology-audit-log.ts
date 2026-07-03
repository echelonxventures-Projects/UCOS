/**
 * UCOS Ontology Fabric — Audit Log (ONTO-AUD-001).
 *
 * Hash-chained, tamper-evident, append-only, write-ahead audit of every ontology lifecycle,
 * semantic-integrity, and federation event. Independently verifiable offline and reconcilable across
 * nodes — the same proven construction as the PI-5 federation / PI-7 knowledge audit (reused pattern;
 * no custom cryptography).
 */

import type { OntologyAuditEntry } from "./types.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";

export interface OntologyChainedEntry {
  entry: OntologyAuditEntry;
  seq: number;
  prevHash: string;
  entryHash: string;
  nodeId: string;
}

export const ONTO_GENESIS_HASH = "0".repeat(64);

function computeHash(entry: OntologyAuditEntry, seq: number, prevHash: string, nodeId: string): string {
  return sha256(`${canonicalize(entry)}|${seq}|${prevHash}|${nodeId}`);
}

export type OntoDivergenceClass = "hash-break" | "event-mismatch" | "state-hash-mismatch";

export interface OntoDivergence {
  class: OntoDivergenceClass;
  severity: "high" | "medium";
  detail: string;
}

export interface OntoReconciliationResult {
  status: "consistent" | "divergent";
  divergences: OntoDivergence[];
  failClosed: boolean;
}

interface OntoAuditExport {
  nodeId: string;
  chain: OntologyChainedEntry[];
  headHash: string;
}

export class OntologyAuditLog {
  readonly #nodeId: string;
  readonly #chain: OntologyChainedEntry[] = [];

  constructor(nodeId: string) {
    this.#nodeId = nodeId;
  }

  /** Write-ahead append of an ontology audit event. */
  record(entry: OntologyAuditEntry): OntologyChainedEntry {
    const seq = this.#chain.length;
    const prevHash = seq === 0 ? ONTO_GENESIS_HASH : (this.#chain[seq - 1] as OntologyChainedEntry).entryHash;
    const entryHash = computeHash(entry, seq, prevHash, this.#nodeId);
    const chained: OntologyChainedEntry = Object.freeze({
      entry: Object.freeze({ ...entry }),
      seq,
      prevHash,
      entryHash,
      nodeId: this.#nodeId,
    });
    this.#chain.push(chained);
    return chained;
  }

  entries(): readonly OntologyAuditEntry[] {
    return this.#chain.map((c) => ({ ...c.entry }));
  }

  chain(): readonly OntologyChainedEntry[] {
    return this.#chain.map((c) => ({ ...c, entry: { ...c.entry } }));
  }

  get headHash(): string {
    return this.#chain.length === 0 ? ONTO_GENESIS_HASH : (this.#chain[this.#chain.length - 1] as OntologyChainedEntry).entryHash;
  }

  export(): OntoAuditExport {
    return { nodeId: this.#nodeId, chain: this.chain() as OntologyChainedEntry[], headHash: this.headHash };
  }

  /** Independent, offline verification: recompute every hash and confirm continuity to the head. */
  static verify(exported: OntoAuditExport): { ok: boolean; reason: string } {
    let prev = ONTO_GENESIS_HASH;
    for (let i = 0; i < exported.chain.length; i++) {
      const c = exported.chain[i] as OntologyChainedEntry;
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
  static reconcile(local: OntoAuditExport, remote: OntoAuditExport): OntoReconciliationResult {
    const divergences: OntoDivergence[] = [];
    for (const [label, exp] of [["local", local], ["remote", remote]] as const) {
      const v = OntologyAuditLog.verify(exp);
      if (!v.ok) divergences.push({ class: "hash-break", severity: "high", detail: `${label} chain: ${v.reason}` });
    }

    const remoteByKey = new Map<string, OntologyChainedEntry>();
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
