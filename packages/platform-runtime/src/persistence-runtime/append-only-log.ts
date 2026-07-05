/**
 * UCOS Substrate — Persistence Runtime (L4).
 *
 * Append-only durable log: the storage medium that sits BEHIND the substrate ports.
 * It is an implementation detail — the ports (Registry / Metadata / Configuration) remain the
 * authority boundary and the kernel stays storage agnostic.
 *
 * Properties (per the L4 persistence authority package):
 *   - deterministic          : replaying the log in order reconstructs identical state;
 *   - local                  : file-backed on the local filesystem (no network / cluster);
 *   - restart-safe           : records persist across process restart;
 *   - machine-restart-safe   : every append is flushed to disk (fsync) before returning;
 *   - migration-friendly     : each line is a self-describing, versioned JSON record;
 *   - append-only compatible : records are only ever appended, never mutated or deleted.
 *
 * The log stores generic records; the durable port adapters define the record shapes.
 */

import { openSync, writeSync, fsyncSync, closeSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

/** Current on-disk record envelope version. Bump when the envelope layout changes (migration hook). */
export const LOG_FORMAT_VERSION = 1 as const;

/** A single durable, append-only record as persisted on a log line. */
export interface LogRecord {
  /** Envelope format version — enables forward migration of older logs. */
  readonly v: number;
  /** Monotonic sequence number within this log (0-based). */
  readonly seq: number;
  /** Domain-specific event payload (opaque to the log). */
  readonly event: unknown;
}

/**
 * Append-only log surface. Adapters depend only on this interface, so the durable medium
 * (file, memory, or a future backend) can change without touching the adapters.
 */
export interface AppendOnlyLog {
  /** Durably append an event and return its assigned sequence number. */
  append(event: unknown): number;
  /** Replay every persisted record in append order (oldest first). */
  readAll(): LogRecord[];
  /** Count of records currently persisted. */
  size(): number;
}

/**
 * In-memory append-only log. Deterministic and dependency-free — used for tests and for
 * ephemeral (non-durable) runtimes. Not restart-safe by design.
 */
export class InMemoryAppendOnlyLog implements AppendOnlyLog {
  readonly #records: LogRecord[] = [];

  append(event: unknown): number {
    const seq = this.#records.length;
    this.#records.push({ v: LOG_FORMAT_VERSION, seq, event });
    return seq;
  }

  readAll(): LogRecord[] {
    // Return a defensive copy; records themselves are treated as immutable.
    return [...this.#records];
  }

  size(): number {
    return this.#records.length;
  }
}

/**
 * File-backed append-only log (JSON Lines). One JSON record per line.
 *
 * Durability: each append opens the file in append mode, writes the line, fsyncs the file
 * descriptor, and closes it. The fsync makes the write survive not just a process restart but a
 * machine restart. Existing content is never rewritten, satisfying append-only semantics.
 */
export class FileAppendOnlyLog implements AppendOnlyLog {
  readonly #path: string;
  #seq: number;

  constructor(path: string) {
    this.#path = path;
    const dir = dirname(path);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    // Recover the next sequence number from any existing log so appends stay monotonic.
    this.#seq = this.#countExisting();
  }

  #countExisting(): number {
    if (!existsSync(this.#path)) return 0;
    const raw = readFileSync(this.#path, "utf8");
    if (raw.length === 0) return 0;
    let count = 0;
    for (const line of raw.split("\n")) {
      if (line.trim().length > 0) count += 1;
    }
    return count;
  }

  append(event: unknown): number {
    const seq = this.#seq;
    const record: LogRecord = { v: LOG_FORMAT_VERSION, seq, event };
    const line = `${JSON.stringify(record)}\n`;
    const fd = openSync(this.#path, "a");
    try {
      writeSync(fd, line);
      // Flush to physical storage so the record survives a machine restart (AC-2).
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
    this.#seq = seq + 1;
    return seq;
  }

  readAll(): LogRecord[] {
    if (!existsSync(this.#path)) return [];
    const raw = readFileSync(this.#path, "utf8");
    if (raw.length === 0) return [];
    const records: LogRecord[] = [];
    let lineNo = 0;
    for (const line of raw.split("\n")) {
      lineNo += 1;
      const trimmed = line.trim();
      if (trimmed.length === 0) continue;
      let parsed: LogRecord;
      try {
        parsed = JSON.parse(trimmed) as LogRecord;
      } catch (cause) {
        throw new Error(`Corrupt durable log at ${this.#path}:${lineNo}: unparseable record`, { cause });
      }
      records.push(parsed);
    }
    return records;
  }

  size(): number {
    return this.#seq;
  }
}
