/**
 * UCOS Memory Fabric — Retention & Classification engine (MEM-GOV-002 §2, MEM-SEC-001 §4).
 *
 * Governs bounded retention (fail-closed expiry — MGP-5), legal-hold (suspends expiry & forgetting),
 * and monotonic classification across tiers (MGP-3 / S4). This is the load-bearing memory-specific
 * control: an expired record is treated as ABSENT ⇒ recall denies (closes M3). No memory retains
 * indefinitely by omission. All state is data (no hardcoded policy — IP-04).
 */

import type { Classification, MemoryRecord, RetentionClass } from "./types.ts";
import { ControlValidationError } from "../errors.ts";

/**
 * Time-to-live per retention class, expressed as a governed policy (milliseconds) rather than a
 * hardcoded number in business logic. `ephemeral`/`bounded`/`durable` have finite TTLs; `legal-hold`
 * has no time expiry (Infinity). A deployment overrides these via `MemoryRetention` construction.
 */
export interface RetentionPolicy {
  ephemeral: number; // e.g. session/request order (short)
  bounded: number; // e.g. hours/days order
  durable: number; // e.g. long horizon (still finite — nothing durable-by-omission)
}

export const DEFAULT_RETENTION_POLICY: RetentionPolicy = {
  ephemeral: 5 * 60_000, //   5 minutes
  bounded: 24 * 60 * 60_000, //  1 day
  durable: 365 * 24 * 60 * 60_000, // ~1 year (finite by design)
};

export class MemoryRetention {
  readonly #policy: RetentionPolicy;

  constructor(policy: RetentionPolicy = DEFAULT_RETENTION_POLICY) {
    this.#policy = policy;
  }

  /** Absolute expiry for a record captured at `capturedAt` under `retentionClass`. `legal-hold` ⇒ never. */
  expiryFor(retentionClass: RetentionClass, capturedAt: number): number | undefined {
    switch (retentionClass) {
      case "legal-hold":
        return undefined; // suspended: no time expiry
      case "ephemeral":
        return capturedAt + this.#policy.ephemeral;
      case "bounded":
        return capturedAt + this.#policy.bounded;
      case "durable":
        return capturedAt + this.#policy.durable;
      default:
        throw new ControlValidationError(`unknown retention class: ${retentionClass as string}`, { retentionClass });
    }
  }

  /**
   * Fail-closed expiry check (M3). A record with a finite `expiresAt <= now` is EXPIRED. Records under
   * `legal-hold` (no `expiresAt`) never expire by time. A record missing a retention class is treated
   * as expired (deny) — no default-to-durable path.
   */
  isExpired(record: MemoryRecord, now: number = Date.now()): boolean {
    if (record.retentionClass === "legal-hold") return false;
    if (!record.retentionClass) return true; // fail-closed: no class ⇒ absent
    if (record.expiresAt === undefined) {
      // No stored expiry for a non-legal-hold record: recompute fail-closed from policy.
      const exp = this.expiryFor(record.retentionClass, record.capturedAt);
      return exp !== undefined && exp <= now;
    }
    return record.expiresAt <= now;
  }

  /** Under legal-hold, forgetting is suspended (MEM-GOV-002 §2.1). */
  forgettingSuspended(record: MemoryRecord): boolean {
    return record.retentionClass === "legal-hold";
  }

  /**
   * Monotonic classification (MGP-3 / S4). Promotion/consolidation may RAISE but never LOWER
   * classification: the resulting classification is the max level over all sources. A target that
   * attempts to declassify below any source is REJECTED.
   */
  static reconcileClassification(target: Classification, sources: readonly Classification[]): Classification {
    let max = target;
    for (const s of sources) if (s.level > max.level) max = s;
    return { label: max.label, level: max.level };
  }

  /** Assert a promotion does not declassify (fail-closed). */
  static assertMonotonic(from: Classification, to: Classification): void {
    if (to.level < from.level) {
      throw new ControlValidationError(`classification may not be lowered on promotion: ${from.level} -> ${to.level} (MGP-3)`, { from, to });
    }
  }

  /** Recall projection (S4): a requester may recall only records at or below their clearance level. */
  static clearedFor(record: MemoryRecord, clearanceLevel: number | undefined): boolean {
    if (clearanceLevel === undefined) return true; // no projection requested
    return record.classification.level <= clearanceLevel;
  }
}
