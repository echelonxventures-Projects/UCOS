/**
 * CGR-AU-CHAIN — Audit hash-chain layer (Wave-1 finalization).
 *
 * Turns the RG-8 audit emission stream (`AuditEvent`) into an append-only, immutable,
 * tamper-evident hash chain: a genesis anchor + previous-hash linkage over every event.
 *
 * REUSE ONLY: hashing routes exclusively through the platform `canonicalize` + `sha256`
 * (control/federation/assertions.ts). No new canonicalizer, no new hash, no direct crypto
 * import inside the constitutional-governance namespace.
 *
 * Doctrine upheld here:
 *   - append-only   : entries are only ever appended; never mutated or removed;
 *   - immutable     : returned entries are frozen defensive copies; internal state is private;
 *   - deterministic : an identical event sequence yields an identical chain (INV-6 / RG-6).
 *
 * Scope guard (0031): this layer RECORDS governance mutations. It NEVER creates governance
 * records, NEVER confers ACTIVE state, and NEVER originates authority.
 */

import { canonicalize, sha256 } from "../federation/assertions.ts";
import type { AuditEvent } from "./types.ts";

/**
 * Genesis anchor — the `prevHash` of the first entry. 64-char zero hex, matching the sha256
 * output width so the genesis link is type-identical to every subsequent link.
 */
export const GENESIS_PREV_HASH = "0".repeat(64);

/** A single hash-chained audit entry: the emitted event + its position, back-link, and hash. */
export interface ChainedAuditEntry {
  /** Monotonic 0-based position within the chain. */
  readonly seq: number;
  /** The immutable RG-8 audit event captured at this position. */
  readonly event: AuditEvent;
  /** Back-link: the predecessor's `entryHash`, or `GENESIS_PREV_HASH` at seq 0. */
  readonly prevHash: string;
  /** sha256 over the canonical {seq, prevHash, event} view — tamper-evidence + continuity. */
  readonly entryHash: string;
}

/**
 * Compute the deterministic entry hash over the canonical {seq, prevHash, event} view.
 * Binding `seq` and `prevHash` into the hash makes both reordering and back-link tampering
 * detectable, not just content tampering.
 */
export function computeEntryHash(input: {
  seq: number;
  prevHash: string;
  event: AuditEvent;
}): string {
  return sha256(canonicalize({ seq: input.seq, prevHash: input.prevHash, event: input.event }));
}

/** Freeze an entry (and its captured event) so chain state cannot be mutated after the fact. */
function freezeEntry(entry: ChainedAuditEntry): ChainedAuditEntry {
  Object.freeze(entry.event);
  return Object.freeze(entry);
}

/**
 * Deterministically generate a full chain from an ordered event list (pure; holds no state).
 * Used both for deterministic chain generation and as the reference for offline replay
 * verification (CGR-AU-VERIFY). Identical input ⇒ byte-identical hashes.
 */
export function generateChain(events: readonly AuditEvent[]): readonly ChainedAuditEntry[] {
  const entries: ChainedAuditEntry[] = [];
  let prevHash = GENESIS_PREV_HASH;
  for (let seq = 0; seq < events.length; seq += 1) {
    const event = events[seq]!;
    const entryHash = computeEntryHash({ seq, prevHash, event });
    entries.push(freezeEntry({ seq, event, prevHash, entryHash }));
    prevHash = entryHash;
  }
  return Object.freeze(entries);
}

/**
 * Append-only audit hash chain. New events extend the chain; existing entries are immutable.
 * This is the RG-8 `AuditSink` target wired by the composition root (CGR-CORE-04).
 */
export class AuditHashChain {
  readonly #entries: ChainedAuditEntry[] = [];
  #head: string = GENESIS_PREV_HASH;

  /** Append an event, linking it to the current head. Returns the new (frozen) entry. */
  append(event: AuditEvent): ChainedAuditEntry {
    const seq = this.#entries.length;
    const prevHash = this.#head;
    const entryHash = computeEntryHash({ seq, prevHash, event });
    const entry = freezeEntry({ seq, event, prevHash, entryHash });
    this.#entries.push(entry);
    this.#head = entryHash;
    return entry;
  }

  /** The current head hash (last `entryHash`, or `GENESIS_PREV_HASH` when the chain is empty). */
  head(): string {
    return this.#head;
  }

  /** Number of entries appended. */
  size(): number {
    return this.#entries.length;
  }

  /** Immutable snapshot of the chain (frozen defensive copy of frozen entries). */
  entries(): readonly ChainedAuditEntry[] {
    return Object.freeze([...this.#entries]);
  }
}
