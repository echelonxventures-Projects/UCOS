/**
 * UCOS Substrate — Persistence Runtime (L4): dom_ops metadata journal (AC-D1).
 *
 * The append-only journal that sits BEHIND the durable MetadataPort adapter and whose durable
 * record is the Operations System-of-Record (`dom_ops`). It is the SoR-backed analogue of the
 * file/in-memory `AppendOnlyLog`: a single governed metadata write is appended as one journal
 * record; replaying the journal in append order reconstructs the authoritative metadata state.
 *
 * The journal surface is asynchronous because its durable backend (`dom_ops`, ADR-005 PostgreSQL)
 * is a networked SoR. Adapters depend only on this interface, so the durable medium can change
 * (Postgres, another SoR, or the in-memory test double) without touching the MetadataPort adapter.
 * The ports remain the authority boundary; this journal is an implementation detail.
 */

import type { JsonSchema } from "../contracts/types.ts";

/** Current journal record envelope version. Bump when the envelope layout changes (migration hook). */
export const DOM_OPS_JOURNAL_VERSION = 1 as const;

/** Append-only event: a governed metadata write (`put`) or a terminal revocation (`revoke`). */
export type DomOpsMetadataEvent =
  | { readonly op: "put"; readonly key: string; readonly value: unknown; readonly schema?: JsonSchema }
  | { readonly op: "revoke"; readonly key: string };

/** A single durable, append-only journal record as persisted in `dom_ops`. */
export interface DomOpsJournalRecord {
  /** Envelope format version — enables forward migration of older journals. */
  readonly v: number;
  /** Monotonic per-scope sequence number (0-based). */
  readonly seq: number;
  /** The governed metadata write payload. */
  readonly event: DomOpsMetadataEvent;
}

/**
 * Append-only, `dom_ops`-backed metadata journal surface.
 *
 * append() durably records one metadata write and returns its assigned sequence number.
 * readAll() replays every persisted record in append order (oldest first) for rehydration.
 * size() returns the count of persisted records.
 */
export interface DomOpsJournal {
  append(event: DomOpsMetadataEvent): Promise<number>;
  readAll(): Promise<DomOpsJournalRecord[]>;
  size(): Promise<number>;
}

/**
 * In-memory `DomOpsJournal`. Deterministic and dependency-free — used for unit tests and for
 * ephemeral (non-durable) runtimes. Not restart-safe by design; the `dom_ops` PG adapter provides
 * the durable backend in the operational-proof service.
 */
export class InMemoryDomOpsJournal implements DomOpsJournal {
  readonly #records: DomOpsJournalRecord[] = [];

  async append(event: DomOpsMetadataEvent): Promise<number> {
    const seq = this.#records.length;
    this.#records.push({ v: DOM_OPS_JOURNAL_VERSION, seq, event });
    return seq;
  }

  async readAll(): Promise<DomOpsJournalRecord[]> {
    // Defensive copy; records themselves are treated as immutable.
    return [...this.#records];
  }

  async size(): Promise<number> {
    return this.#records.length;
  }
}
