/**
 * Governance Closure Tracking (WS10).
 *
 * For each constitutional closure (REAL-C-03/04/05, ...) the engine maps
 * evidence + dependencies + closure criteria and computes GO / GO_WITH_CONDITIONS
 * / NO_GO automatically. The overall governance verdict is the worst per-closure
 * verdict (fail-closed conservatism).
 */

import type {
  ClosureDefinition,
  ComputedClosure,
  ComputedWorkItem,
  ClosureVerdict,
  EvidenceRecord,
  EvidenceRollup,
} from "./types.ts";
import { indexEvidence, rollupEvidence } from "./evidence-engine.ts";

const VERDICT_RANK: Record<ClosureVerdict, number> = {
  NO_GO: 0,
  GO_WITH_CONDITIONS: 1,
  GO: 2,
};

function evidenceHasBlocking(rollup: EvidenceRollup): boolean {
  return rollup.pending > 0 || rollup.missing > 0;
}

export function computeClosures(
  closures: ClosureDefinition[],
  items: ComputedWorkItem[],
  evidence: EvidenceRecord[],
): { closures: ComputedClosure[]; overallVerdict: ClosureVerdict } {
  const statusById = new Map(items.map((c) => [c.item.id, c.status]));
  const evIndex = indexEvidence(evidence);

  const computed: ComputedClosure[] = closures.map((def) => {
    const unmet = def.dependencies.filter((d) => statusById.get(d) !== "COMPLETE");
    const rollup = rollupEvidence(def.requiredEvidence, evIndex);
    const reasons: string[] = [];

    let verdict: ClosureVerdict;
    if (unmet.length === 0 && rollup.satisfied) {
      verdict = "GO";
      reasons.push("all dependencies COMPLETE and all evidence at >=VERIFIED");
    } else if (unmet.length === 0 && !evidenceHasBlocking(rollup)) {
      verdict = "GO_WITH_CONDITIONS";
      reasons.push(`dependencies COMPLETE; ${rollup.submitted} evidence item(s) SUBMITTED but not yet VERIFIED`);
    } else {
      verdict = "NO_GO";
      if (unmet.length > 0) reasons.push(`unmet dependencies: ${unmet.join(", ")}`);
      if (rollup.pending > 0) reasons.push(`${rollup.pending} evidence item(s) PENDING`);
      if (rollup.missing > 0) reasons.push(`${rollup.missing} required evidence id(s) missing`);
    }

    return { definition: def, verdict, unmetDependencies: unmet, evidence: rollup, reasons };
  });

  const overallVerdict: ClosureVerdict = computed.length
    ? computed.reduce<ClosureVerdict>(
        (worst, c) => (VERDICT_RANK[c.verdict] < VERDICT_RANK[worst] ? c.verdict : worst),
        "GO",
      )
    : "GO";

  return { closures: computed, overallVerdict };
}
