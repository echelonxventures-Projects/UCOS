/**
 * UCOS Evolution Fabric — Rollback Engine (EVO-ARCH-001).
 *
 * Executes captured reverse-ops in reverse order to deterministically restore the pre-apply state,
 * then VERIFIES the restoration by re-hashing observable state and comparing to the snapshot's
 * `stateHash`. A verification mismatch is a hard, fail-closed condition: the caller must raise the
 * emergency halt (no further evolution until manual governance review).
 */

import type { EvolutionSnapshotEngine } from "./evolution-snapshot-engine.ts";
import type { EvolutionTransactionManager } from "./evolution-transaction-manager.ts";
import type { EvolutionTarget, ReverseOp, VerificationResult } from "./types.ts";

export class EvolutionRollbackEngine {
  readonly #txn: EvolutionTransactionManager;
  readonly #snapshots: EvolutionSnapshotEngine;

  constructor(txn: EvolutionTransactionManager, snapshots: EvolutionSnapshotEngine) {
    this.#txn = txn;
    this.#snapshots = snapshots;
  }

  /** Replay reverse-ops in reverse application order. */
  execute(reverseOps: readonly ReverseOp[]): void {
    for (let i = reverseOps.length - 1; i >= 0; i--) {
      this.#txn.applyReverse(reverseOps[i] as ReverseOp);
    }
  }

  /** Verify restoration: re-observed state hash must equal the pre-apply snapshot hash. */
  verify(targets: readonly EvolutionTarget[], expectedStateHash: string): VerificationResult {
    const restored = this.#snapshots.stateHash(this.#snapshots.capture(targets));
    if (restored !== expectedStateHash) {
      return { ok: false, reason: `rollback verification failed: restored=${restored.slice(0, 12)} expected=${expectedStateHash.slice(0, 12)}` };
    }
    return { ok: true, reason: "rollback verified (state restored exactly)" };
  }
}
