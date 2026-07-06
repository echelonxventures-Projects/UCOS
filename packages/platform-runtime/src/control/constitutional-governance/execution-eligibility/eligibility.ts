/**
 * CGR-W2-EEL-01 — Eligibility Assessment (Wave-D, Execution Eligibility Layer).
 *
 * Authorized by PCAMG-RUNTIME-0202 (`WAVE_D_IMPLEMENTATION_AUTHORIZED`), specified under
 * PCAMG-RUNTIME-0202A, and constructed under PCAMG-RUNTIME-0202B. Produces a deterministic eligibility
 * verdict for a proposal that has already passed Authority Resolution (ACR) + Constitutional Resolution
 * (CRL) + Governance Evaluation (GEL). The verdict answers exactly one question: MAY this proposal
 * advance toward a future execution phase?
 *
 * IMPORTANT — R-1 / R-3 SEMANTIC FIREWALL: an `ELIGIBLE` verdict means "MAY advance toward a future
 * execution phase" and NOTHING more. It is NOT authorization to execute, NOT activation, NOT authority,
 * and NOT sovereignty. This module emits a verdict and evidence handle only; it triggers, schedules,
 * invokes, and enables no execution, and it transitions nothing to an ACTIVE state.
 *
 * REUSE JUSTIFICATION:
 *   Reused assets —
 *     - CGR-W2-EEL-02 `evaluateEligibilityConstraints` (constraints.ts) — the constraint mechanism and
 *       shared fail-closed denial vocabulary. The verdict is the conjunction of its constraint results.
 *     - CGR-W2-GEL-01 `GovernanceEvaluation` / CGR-W2-GEL-02 `ComplianceEvaluation` — read-only inputs.
 *   Reason new code is necessary: the eligibility verdict (advancement admissibility) is new behaviour
 *   not produced by any prior layer. It is composed entirely from reused reads.
 *
 * CONSTITUTIONAL POSTURE: read-only assessment. No execution, no activation, no mutation, no authority
 * origination (INV-2/7/8/9/11). Fail-closed (INV-6): a structurally unformed upstream state yields a
 * denial (no verdict); a well-formed-but-failing state yields a `NOT_ELIGIBLE` verdict. Eligibility is
 * never defaulted to `ELIGIBLE`.
 */

import {
  evaluateEligibilityConstraints,
  type ConstraintResult,
  type EligibilityConstraintId,
  type EligibilityDenial,
} from "./constraints.ts";
import type { GovernanceEvaluation } from "../governance-evaluation/evaluation.ts";
import type { ComplianceEvaluation } from "../governance-evaluation/compliance.ts";

/**
 * The eligibility decision. `ELIGIBLE` = MAY advance toward a future execution phase (never
 * authorization-to-execute). `NOT_ELIGIBLE` = MAY NOT advance.
 */
export type EligibilityDecision = "ELIGIBLE" | "NOT_ELIGIBLE";

/**
 * The deterministic, read-only eligibility verdict for a subject. Carries the decision, the
 * constraint results it was derived from, and the list of unmet constraints. It carries NO execution,
 * activation, authority, or sovereignty field by construction (R-1 / R-2 / R-3 / R-5).
 */
export interface EligibilityVerdict {
  /** The advancement decision. `ELIGIBLE` = MAY advance; it is NOT permission to execute. */
  readonly decision: EligibilityDecision;
  /** The subject the verdict applies to. */
  readonly subject: string;
  /** The constraint results the verdict was derived from. */
  readonly constraints: readonly ConstraintResult[];
  /** The constraints that were not satisfied (empty iff `ELIGIBLE`). */
  readonly unmet: readonly EligibilityConstraintId[];
}

/** The result of an eligibility assessment: a verdict or a fail-closed denial (never both). */
export interface EligibilityAssessment {
  readonly assessed: boolean;
  /** Subject the assessment was produced for (present iff assessed). */
  readonly subject: string | null;
  /** The read-only eligibility verdict (present iff assessed). */
  readonly verdict: EligibilityVerdict | null;
  /** The fail-closed denial (present iff not assessed). */
  readonly denial: EligibilityDenial | null;
}

/**
 * Assess execution eligibility for a proposal, derived solely from upstream GEL determinations.
 * Read-only; performs zero writes, executes no governance, activates nothing, and originates no
 * authority. Fail-closed: a structurally unformed upstream state is denied (via CGR-W2-EEL-02); a
 * well-formed state yields a verdict that is `ELIGIBLE` iff every eligibility constraint is satisfied.
 */
export function assessEligibility(
  governance: GovernanceEvaluation,
  compliance: ComplianceEvaluation,
): EligibilityAssessment {
  const constraintEvaluation = evaluateEligibilityConstraints(governance, compliance);

  if (!constraintEvaluation.evaluated || constraintEvaluation.subject === null) {
    return { assessed: false, subject: null, verdict: null, denial: constraintEvaluation.denial };
  }

  const unmet: readonly EligibilityConstraintId[] = Object.freeze(
    constraintEvaluation.constraints.filter((c) => !c.satisfied).map((c) => c.constraint),
  );

  const decision: EligibilityDecision = constraintEvaluation.allSatisfied ? "ELIGIBLE" : "NOT_ELIGIBLE";

  const verdict: EligibilityVerdict = Object.freeze({
    decision,
    subject: constraintEvaluation.subject,
    constraints: constraintEvaluation.constraints,
    unmet,
  });

  return { assessed: true, subject: constraintEvaluation.subject, verdict, denial: null };
}
