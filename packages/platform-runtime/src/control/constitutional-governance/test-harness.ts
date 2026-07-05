/**
 * CGR-CORE-05 — Deterministic test harness.
 *
 * Provides a fixed, monotonic clock and fresh reused append-only log instances so every suite is
 * deterministic and isolated (INV-6). No wall-clock, no randomness in any hashed path.
 * REUSE ONLY: the storage primitive is the platform `InMemoryAppendOnlyLog`.
 */

import { InMemoryAppendOnlyLog } from "../../persistence-runtime/append-only-log.ts";
import type { AppendOnlyLog } from "../../persistence-runtime/append-only-log.ts";
import type { AuditEvent, AuditSink, Clock } from "./types.ts";

/** A deterministic clock: successive calls yield strictly increasing, reproducible ISO instants. */
export function fixedClock(startEpochMs = 1_700_000_000_000, stepMs = 1_000): Clock {
  let current = startEpochMs;
  return () => {
    const iso = new Date(current).toISOString();
    current += stepMs;
    return iso;
  };
}

/** A recording audit sink for tests — captures the RG-8 emission stream. */
export interface RecordingAuditSink {
  readonly sink: AuditSink;
  readonly events: readonly AuditEvent[];
}

export function recordingAuditSink(): RecordingAuditSink {
  const events: AuditEvent[] = [];
  return {
    sink: (event: AuditEvent) => {
      events.push(event);
    },
    get events() {
      return events;
    },
  };
}

/** Deterministic harness bundle: a fresh log + fixed clock + recording audit sink. */
export interface Harness {
  readonly log: AppendOnlyLog;
  readonly clock: Clock;
  readonly audit: RecordingAuditSink;
}

export function makeHarness(): Harness {
  return {
    log: new InMemoryAppendOnlyLog(),
    clock: fixedClock(),
    audit: recordingAuditSink(),
  };
}
