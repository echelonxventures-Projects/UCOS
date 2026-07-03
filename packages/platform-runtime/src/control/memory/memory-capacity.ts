/**
 * UCOS Memory Fabric — Working/Short-Term Capacity control (MEM-GOV-002 §2; MEM-THREAT-001 M12).
 *
 * Closes the working-memory exhaustion / resource-flooding surface. Where the retention engine bounds
 * memory in TIME (M3: nothing durable-by-omission), this control bounds volatile memory in SIZE: the
 * number of distinct LIVE records admitted into a `working` or `short-term` namespace is capped. An
 * attempt to accumulate beyond the configured cap is REJECTED fail-closed BEFORE persistence — no
 * unbounded accumulation, no flooding-driven eviction of governed state.
 *
 * The policy is data (IP-04), configured per fabric. It is OPT-IN: an unset cap ⇒ no size bound for
 * that tier (time-based retention still applies), so default fabric behaviour is unchanged. A configured
 * cap is enforced fail-closed. Counting is over DISTINCT `memId`s currently live (admissible) in the
 * target namespace+tier; re-versioning an existing `memId` does not consume additional capacity. Pure /
 * deterministic; reuses no cryptography and touches no core dir.
 */

import type { MemoryRecord, MemoryTier } from "./types.ts";
import { ControlValidationError } from "../errors.ts";

/** Per-tier maximum distinct live records. Unset ⇒ unbounded (opt-in; default behaviour preserved). */
export interface MemoryCapacityPolicy {
  working?: number;
  "short-term"?: number;
}

/** Tiers subject to volatile-capacity bounding (the non-durable, high-churn tiers). */
const CAPPED_TIERS: ReadonlySet<MemoryTier> = new Set<MemoryTier>(["working", "short-term"]);

export class MemoryCapacity {
  readonly #policy: MemoryCapacityPolicy;

  constructor(policy: MemoryCapacityPolicy = {}) {
    this.#policy = policy;
    for (const [tier, cap] of Object.entries(policy)) {
      if (cap !== undefined && (!Number.isInteger(cap) || cap < 0)) {
        throw new ControlValidationError(`memory capacity for tier '${tier}' must be a non-negative integer`, { tier, cap });
      }
    }
  }

  /** The configured cap for a tier, or `undefined` when unbounded. */
  capFor(tier: MemoryTier): number | undefined {
    if (!CAPPED_TIERS.has(tier)) return undefined;
    return this.#policy[tier as "working" | "short-term"];
  }

  /**
   * Fail-closed capacity admission for `incoming` given the currently-live records in its namespace+tier
   * (`live` should already exclude expired/revoked/non-active records — i.e. the query-engine result).
   * Throws when admitting a NEW distinct `memId` would exceed the configured cap. Re-versioning an
   * existing `memId` is always admitted (replaces in place; consumes no new capacity).
   */
  assertAdmissible(incoming: MemoryRecord, live: readonly MemoryRecord[]): void {
    const cap = this.capFor(incoming.tier);
    if (cap === undefined) return; // unbounded tier (opt-in not configured)
    const distinct = new Set<string>();
    for (const r of live) {
      if (r.tier === incoming.tier && r.namespace === incoming.namespace) distinct.add(r.memId);
    }
    if (distinct.has(incoming.memId)) return; // re-version of an existing id — no new capacity consumed
    if (distinct.size >= cap) {
      throw new ControlValidationError(
        `memory capacity exhausted: ${incoming.tier} namespace '${incoming.namespace}' is at its cap (${cap}); ` +
          `admitting '${incoming.memId}' would exceed it (fail-closed, M12)`,
        { tier: incoming.tier, namespace: incoming.namespace, cap, current: distinct.size, memId: incoming.memId },
      );
    }
  }
}
