/**
 * CGR-AU-VERIFY — Offline audit-chain verifier (Wave-1 finalization).
 *
 * READ-ONLY. Given a chain snapshot (`ChainedAuditEntry[]`), it proves:
 *   - tamper-evidence : every `entryHash` recomputes to its stored value;
 *   - continuity      : every `prevHash` equals the predecessor `entryHash` (genesis at seq 0);
 *   - ordering        : `seq` is a 0-based monotonic run;
 *   - replay          : regenerating the chain from the entries' events reproduces every hash.
 *
 * Pure functions; inputs are NEVER mutated. REUSE ONLY: hashing/regeneration route through
 * CGR-AU-CHAIN (which itself routes through the platform canonicalize + sha256).
 */

import { GENESIS_PREV_HASH, computeEntryHash, generateChain } from "./audit-chain.ts";
import type { ChainedAuditEntry } from "./audit-chain.ts";

/** The outcome of a verification pass. On failure it carries a reason and the failing index. */
export interface AuditChainVerificationResult {
  /** True iff every checked invariant held across the whole chain. */
  readonly valid: boolean;
  /** Number of entries inspected. */
  readonly checked: number;
  /** Human-readable failure reason (absent when `valid`). */
  readonly reason?: string;
  /** Index of the first failing entry (absent when `valid`). */
  readonly brokenAt?: number;
}

function ok(checked: number): AuditChainVerificationResult {
  return { valid: true, checked };
}

function fail(checked: number, brokenAt: number, reason: string): AuditChainVerificationResult {
  return { valid: false, checked, brokenAt, reason };
}

/**
 * Verify tamper-evidence + continuity + ordering of a chain snapshot. Read-only.
 * An empty chain is vacuously valid (genesis with no entries).
 */
export function verifyChain(entries: readonly ChainedAuditEntry[]): AuditChainVerificationResult {
  let prevHash = GENESIS_PREV_HASH;
  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i]!;
    if (entry.seq !== i) {
      return fail(i + 1, i, `ordering violation at index ${i}: expected seq ${i}, found ${entry.seq}`);
    }
    if (entry.prevHash !== prevHash) {
      return fail(i + 1, i, `continuity violation at seq ${i}: prevHash does not link to the predecessor`);
    }
    const recomputed = computeEntryHash({ seq: entry.seq, prevHash: entry.prevHash, event: entry.event });
    if (recomputed !== entry.entryHash) {
      return fail(i + 1, i, `tamper detected at seq ${i}: entryHash mismatch`);
    }
    prevHash = entry.entryHash;
  }
  return ok(entries.length);
}

/**
 * Deterministic replay verification: regenerate the chain from the recorded events and confirm
 * every regenerated `entryHash` matches the stored chain. Read-only. A pristine chain replays
 * exactly; any hidden divergence (e.g. a re-linked entry) surfaces here.
 */
export function verifyReplay(entries: readonly ChainedAuditEntry[]): AuditChainVerificationResult {
  const regenerated = generateChain(entries.map((e) => e.event));
  if (regenerated.length !== entries.length) {
    return fail(entries.length, Math.min(regenerated.length, entries.length), "replay length mismatch");
  }
  for (let i = 0; i < entries.length; i += 1) {
    if (regenerated[i]!.entryHash !== entries[i]!.entryHash) {
      return fail(entries.length, i, `replay divergence at seq ${i}`);
    }
  }
  return ok(entries.length);
}
