/**
 * Evidence Registry Engine (WS3).
 *
 * Evidence progresses PENDING -> SUBMITTED -> VERIFIED -> CERTIFIED. A work item
 * cannot become COMPLETE unless every required evidence id is at least VERIFIED.
 * This engine is pure: it derives roll-ups from the evidence registry only.
 */

import type { EvidenceRecord, EvidenceRollup, EvidenceState } from "./types.ts";

const RANK: Record<EvidenceState, number> = {
  PENDING: 0,
  SUBMITTED: 1,
  VERIFIED: 2,
  CERTIFIED: 3,
};

/** Evidence at VERIFIED or above counts as satisfying a completion requirement. */
export function isSatisfyingState(state: EvidenceState): boolean {
  return RANK[state] >= RANK.VERIFIED;
}

export function indexEvidence(records: EvidenceRecord[]): Map<string, EvidenceRecord> {
  const map = new Map<string, EvidenceRecord>();
  for (const rec of records) map.set(rec.id, rec);
  return map;
}

/**
 * Compute the evidence roll-up for a set of required evidence ids.
 * Missing evidence ids (declared required but absent from the registry) count
 * against satisfaction — silence is never treated as success.
 */
export function rollupEvidence(
  requiredIds: string[],
  index: Map<string, EvidenceRecord>,
): EvidenceRollup {
  let certified = 0;
  let verified = 0;
  let submitted = 0;
  let pending = 0;
  let missing = 0;

  for (const id of requiredIds) {
    const rec = index.get(id);
    if (!rec) {
      missing += 1;
      continue;
    }
    switch (rec.state) {
      case "CERTIFIED":
        certified += 1;
        break;
      case "VERIFIED":
        verified += 1;
        break;
      case "SUBMITTED":
        submitted += 1;
        break;
      case "PENDING":
        pending += 1;
        break;
    }
  }

  const required = requiredIds.length;
  const satisfied =
    required > 0
      ? certified + verified === required
      : true; // an item with no required evidence is vacuously satisfied

  return { required, certified, verified, submitted, pending, missing, satisfied };
}

/** Evidence items not yet at VERIFIED, for the "Missing Evidence" compiler section. */
export function unsatisfiedEvidence(
  requiredIds: string[],
  index: Map<string, EvidenceRecord>,
): { evidenceId: string; state: EvidenceState }[] {
  const out: { evidenceId: string; state: EvidenceState }[] = [];
  for (const id of requiredIds) {
    const rec = index.get(id);
    if (!rec) {
      out.push({ evidenceId: id, state: "PENDING" });
      continue;
    }
    if (!isSatisfyingState(rec.state)) out.push({ evidenceId: id, state: rec.state });
  }
  return out;
}
