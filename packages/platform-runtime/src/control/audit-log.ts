/**
 * UCOS Control Fabrics — Immutable Audit Log (realizes UCOS-SEC-ARCH-001 S6 auditability).
 *
 * Every control-plane authorization decision (allow, deny, or authentication denial) is recorded
 * append-only. Entries cannot be mutated or removed through this interface; `entries()` returns a
 * defensive copy. A deployment may substitute a durable sink implementing `AuditSink`.
 */

import type { AuditEntry } from "./types.ts";

export interface AuditSink {
  record(entry: AuditEntry): void;
  entries(): readonly AuditEntry[];
}

export class InMemoryAuditLog implements AuditSink {
  readonly #entries: AuditEntry[] = [];

  record(entry: AuditEntry): void {
    // Freeze the entry so downstream holders cannot mutate the recorded fact.
    this.#entries.push(Object.freeze({ ...entry }));
  }

  entries(): readonly AuditEntry[] {
    return this.#entries.map((e) => ({ ...e }));
  }

  /** Total number of recorded decisions. */
  get size(): number {
    return this.#entries.length;
  }
}
