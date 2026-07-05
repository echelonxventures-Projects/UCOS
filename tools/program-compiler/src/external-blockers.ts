/**
 * External Blocker Engine (PHASE G.2, WS1 / WS3 / WS5).
 *
 * Teaches the Constitutional Program Compiler that some blockers are EXTERNAL:
 * they cannot be solved by software and require a governed action by an external
 * actor (Authority Board, Independent Adjudicator, human Operations, Certification
 * Authority). This engine:
 *
 *   WS1  distinguishes EXTERNAL_BLOCKED from INTERNAL_BLOCKED by overlaying an
 *        external-blocker status on the dependency-computed items.
 *   WS3  evaluates each blocker's review trigger (evidence-advance / authority
 *        action) to decide whether re-opening the item is permitted.
 *   WS5  emits a rediscovery-prevention recommendation (DO_NOT_REINVESTIGATE)
 *        whenever an item is EXTERNAL_BLOCKED and no review trigger has fired.
 *
 * The engine is pure and deterministic. It designates no actor, produces no
 * attestation, and closes nothing — it records reality exactly as it exists.
 */

import type {
  ComputedExternalBlocker,
  ComputedWorkItem,
  EvidenceRecord,
  EvidenceState,
  ExternalBlocker,
} from "./types.ts";
import { indexEvidence, isSatisfyingState } from "./evidence-engine.ts";

const EVIDENCE_RANK: Record<EvidenceState, number> = {
  PENDING: 0,
  SUBMITTED: 1,
  VERIFIED: 2,
  CERTIFIED: 3,
};

/**
 * WS3 — evaluate the review trigger. A blocker may be re-opened only when NEW
 * evidence exists: some watched evidence has advanced beyond its recorded
 * baseline state. Absent any advance, review is prohibited (rediscovery
 * prevention). This is fully deterministic and updates automatically the moment
 * an external actor advances evidence via `ucos:set-evidence`.
 */
export function evaluateReviewTrigger(
  blocker: ExternalBlocker,
  evidenceIndex: Map<string, EvidenceRecord>,
): { reviewPermitted: boolean; advancedEvidence: string[]; reasons: string[] } {
  const advancedEvidence: string[] = [];
  const reasons: string[] = [];
  const trigger = blocker.review_trigger;

  for (const evId of trigger.watchEvidence) {
    const rec = evidenceIndex.get(evId);
    const baseline = trigger.baselineStates[evId] ?? "PENDING";
    const current = rec?.state ?? "PENDING";
    if (EVIDENCE_RANK[current] > EVIDENCE_RANK[baseline]) {
      advancedEvidence.push(evId);
      reasons.push(`${evId} advanced ${baseline} -> ${current} since last review (${blocker.last_review_date}).`);
    }
  }

  const reviewPermitted = advancedEvidence.length > 0;
  if (!reviewPermitted) {
    reasons.push(
      `No watched evidence advanced beyond baseline since ${blocker.last_review_date}; no new designation/attestation/authority action recorded. Review prohibited.`,
    );
  }
  return { reviewPermitted, advancedEvidence, reasons };
}

/** Index computed external blockers by evaluating each blocker's review trigger (WS3/WS5). */
export function computeExternalBlockers(
  blockers: ExternalBlocker[],
  evidence: EvidenceRecord[],
): ComputedExternalBlocker[] {
  const evidenceIndex = indexEvidence(evidence);
  return blockers.map((blocker) => {
    const { reviewPermitted, advancedEvidence, reasons } = evaluateReviewTrigger(blocker, evidenceIndex);
    return {
      blocker,
      reviewPermitted,
      advancedEvidence,
      recommendation: reviewPermitted ? "REVIEW_PERMITTED" : "DO_NOT_REINVESTIGATE",
      reasons,
    };
  });
}

/**
 * WS1/WS4 — overlay EXTERNAL_BLOCKED status onto the dependency-computed items.
 *
 * An item becomes EXTERNAL_BLOCKED when it is internally unblocked (no unmet
 * dependencies, not in a cycle, not COMPLETE) yet its only remaining gate is an
 * external actor — i.e. it is either named directly by an active external blocker
 * or one of its required evidence ids is externally gated and still below
 * VERIFIED. Items that are still INTERNAL_BLOCKED (unmet internal dependencies)
 * are left untouched: internal blockers take precedence, because the external
 * action cannot even begin until the internal path clears.
 */
export function applyExternalBlockers(
  items: ComputedWorkItem[],
  computedBlockers: ComputedExternalBlocker[],
  evidence: EvidenceRecord[],
): ComputedWorkItem[] {
  const evidenceIndex = indexEvidence(evidence);

  // Build lookups: workItem id -> blocker, evidence id -> blocker (only for blockers whose review is NOT permitted; a review-permitted blocker means the external action may have occurred, so we do not suppress the item).
  const byWorkItem = new Map<string, ComputedExternalBlocker>();
  const byEvidence = new Map<string, ComputedExternalBlocker>();
  for (const cb of computedBlockers) {
    for (const wi of cb.blocker.blockedWorkItems) if (!byWorkItem.has(wi)) byWorkItem.set(wi, cb);
    for (const ev of cb.blocker.blockedEvidence) if (!byEvidence.has(ev)) byEvidence.set(ev, cb);
  }

  return items.map((c) => {
    // Internal blockers and cycles take precedence — never override a genuine internal block.
    if (c.status === "BLOCKED" || c.status === "COMPLETE") return c;
    if (c.unmetDependencies.length > 0) return c;

    // Direct target of an external blocker (e.g. the REAL-C-05 work item itself).
    let match = byWorkItem.get(c.item.id);

    // Or: a required evidence id is externally gated and not yet at >= VERIFIED.
    if (!match) {
      for (const evId of c.item.requiredEvidence) {
        const cb = byEvidence.get(evId);
        if (!cb) continue;
        const rec = evidenceIndex.get(evId);
        const state = rec?.state ?? "PENDING";
        if (!isSatisfyingState(state)) {
          match = cb;
          break;
        }
      }
    }

    if (!match) return c;

    const reasons = [...c.reasons];
    reasons.push(
      `EXTERNAL_BLOCKED by ${match.blocker.id}: ${match.blocker.reason.split(".")[0]}. Required actor: ${match.blocker.required_actor}. Not software-solvable.`,
    );
    if (match.recommendation === "DO_NOT_REINVESTIGATE") {
      reasons.push("DO NOT REINVESTIGATE — no review trigger has fired since the last review.");
    }

    return {
      ...c,
      status: "EXTERNAL_BLOCKED",
      externalBlocked: true,
      externalBlockerId: match.blocker.id,
      reasons,
    };
  });
}
