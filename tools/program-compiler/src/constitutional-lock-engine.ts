/**
 * Constitutional Lock Engine (PHASE G.2, WS2 / WS7).
 *
 * Maps constitutional closures (REAL-C-03/04/05) to release locks and computes
 * each lock's effective state:
 *
 *   RELEASED         closure verdict is GO — evidence satisfies the closure criteria.
 *   EXTERNAL_LOCKED  closure is not GO AND an active external blocker gates it
 *                    (release requires a governed action by an external actor).
 *   LOCKED           closure is not GO with no external blocker (internally solvable).
 *   OPEN             no closure verdict is available (lock not yet engaged).
 *
 * A lock can ONLY move to RELEASED when evidence satisfies the closure criteria
 * (closure verdict GO). This engine releases no lock and closes nothing; it
 * records the lock state exactly as the evidence and external-blocker model imply.
 */

import type {
  ClosureVerdict,
  ComputedClosure,
  ComputedExternalBlocker,
  ComputedLock,
  ConstitutionalLock,
  EvidenceRecord,
  EvidenceRollup,
  LockState,
} from "./types.ts";
import { indexEvidence, rollupEvidence } from "./evidence-engine.ts";

export function computeLocks(
  locks: ConstitutionalLock[],
  closures: ComputedClosure[],
  externalBlockers: ComputedExternalBlocker[],
  evidence: EvidenceRecord[],
): ComputedLock[] {
  const verdictByClosure = new Map<string, ClosureVerdict>(
    closures.map((c) => [c.definition.id, c.verdict]),
  );
  const blockerByClosure = new Map<string, ComputedExternalBlocker>();
  for (const cb of externalBlockers) {
    const closureId = cb.blocker.targetClosure ?? cb.blocker.target;
    if (!blockerByClosure.has(closureId)) blockerByClosure.set(closureId, cb);
  }
  const evIndex = indexEvidence(evidence);

  return locks.map((lock) => {
    const verdict = verdictByClosure.get(lock.closure);
    const blocker = blockerByClosure.get(lock.closure);
    const rollup: EvidenceRollup = rollupEvidence(lock.requiredEvidence, evIndex);
    const reasons: string[] = [];

    let state: LockState;
    if (verdict === undefined) {
      state = "OPEN";
      reasons.push(`no closure verdict available for ${lock.closure}`);
    } else if (verdict === "GO") {
      state = "RELEASED";
      reasons.push(`closure ${lock.closure} is GO — evidence satisfies all closure criteria`);
    } else if (blocker) {
      state = "EXTERNAL_LOCKED";
      reasons.push(
        `closure ${lock.closure} is ${verdict}; gated by external blocker ${blocker.blocker.id} (actor: ${lock.requiredActor})`,
      );
      if (!blocker.reviewPermitted) {
        reasons.push("no review trigger fired — lock cannot be released by software; DO NOT REINVESTIGATE");
      } else {
        reasons.push("review trigger fired — re-evaluate lock against the new external evidence");
      }
    } else {
      state = "LOCKED";
      reasons.push(`closure ${lock.closure} is ${verdict}; internally blocked (no external blocker)`);
    }

    return {
      lock,
      state,
      closureVerdict: verdict ?? "UNKNOWN",
      externalBlocked: state === "EXTERNAL_LOCKED",
      reviewPermitted: blocker?.reviewPermitted ?? false,
      evidence: rollup,
      reasons,
    };
  });
}
