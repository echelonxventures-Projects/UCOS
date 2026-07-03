/**
 * UCOS Readiness Fabric — Gap-Detection Engine (RDN-ENG-GAP, engine 3 of 7).
 *
 * Compares declared REQUIREMENTS against the aggregated dimension assessments and emits a Gap for every
 * requirement whose dimension is unmet. Deny-by-default: a requirement whose dimension has NO signals is
 * a gap (absence is not readiness); a dimension scoring below the requirement's `minScore` is a gap; a
 * failing status is a gap. Gap severity is inherited from the requirement, so critical requirements
 * surface critical gaps that hard-block certification.
 */

import type { DimensionAssessment, Gap, RequirementSpec } from "./types.ts";
import { GAP_SEVERITY_RANK } from "./types.ts";

export class GapDetectionEngine {
  detect(requirements: readonly RequirementSpec[], dimensions: Map<string, DimensionAssessment>): Gap[] {
    const gaps: Gap[] = [];
    for (const req of requirements) {
      const dim = dimensions.get(req.dimensionId);
      if (!dim) {
        gaps.push(this.#gap(req, `dimension '${req.dimensionId}' has no signals (absent capability)`));
        continue;
      }
      if (dim.status === "fail") {
        gaps.push(this.#gap(req, `dimension '${req.dimensionId}' latest status is 'fail'`));
        continue;
      }
      if (dim.score < req.minScore) {
        gaps.push(
          this.#gap(req, `dimension '${req.dimensionId}' score ${dim.score.toFixed(3)} < required ${req.minScore}`),
        );
      }
    }
    return gaps;
  }

  #gap(req: RequirementSpec, detail: string): Gap {
    return {
      gapId: `gap:${req.requirementId}`,
      requirementId: req.requirementId,
      dimensionId: req.dimensionId,
      severity: req.severityIfMissing,
      detail,
    };
  }

  /** Highest-severity gap present, or `undefined` if there are none. */
  static maxSeverity(gaps: readonly Gap[]): Gap["severity"] | undefined {
    let max: Gap["severity"] | undefined;
    for (const g of gaps) {
      if (!max || GAP_SEVERITY_RANK[g.severity] > GAP_SEVERITY_RANK[max]) max = g.severity;
    }
    return max;
  }

  static hasCritical(gaps: readonly Gap[]): boolean {
    return gaps.some((g) => g.severity === "critical");
  }
}
