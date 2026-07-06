/**
 * CGR-W2-EEL-02 — Eligibility Constraint Evaluation (Wave-D, Execution Eligibility Layer).
 *
 * Authorized by PCAMG-RUNTIME-0202 (`WAVE_D_IMPLEMENTATION_AUTHORIZED`), specified under
 * PCAMG-RUNTIME-0202A, and constructed under PCAMG-RUNTIME-0202B. Deterministically evaluates the
 * eligibility constraints that gate advancement: the conjunction of required upstream PASS
 * determinations produced by the Governance Evaluation Layer (GEL, Wave-C). It consumes GEL outputs
 * ONLY, read-only, and reports per-constraint satisfaction. It executes nothing, activates nothing,
 * mutates nothing, and originates no authority.
 *
 * This is the base module of the Execution Eligibility Layer: it owns the shared fail-closed denial
 * vocabulary and the constraint set. CGR-W2-EEL-01 (eligibility.ts) composes these constraint results
 * into an eligibility verdict; CGR-W2-EEL-03 (evidence.ts) emits append-only evidence of that verdict.
 *
 * REUSE JUSTIFICATION:
 *   Reused assets —
 *     - CGR-W2-GEL-01 `GovernanceEvaluation` / `GovernanceAssessment` — an upstream input (read-only).
 *     - CGR-W2-GEL-02 `ComplianceEvaluation` / `ComplianceFinding` — an upstream input (read-only).
 *   Reason new code is necessary: eligibility constraint evaluation is new behaviour (ACR/AVR/CRL/GEL
 *   resolve, evaluate, and assess compliance; none determine *advancement eligibility*). It is composed
 *   entirely from reused GEL reads and reports structural facts only.
 *
 * CONSTITUTIONAL POSTURE: read-only assessment. No execution, no activation, no mutation, no authority
 * origination (INV-2/7/8/9/11). Fail-closed (INV-6): an unevaluated / unassessed / mismatched upstream
 * state yields a stable denial rather than any implied satisfaction. `NOT satisfied` is never defaulted
 * to `satisfied`.
 *
 * RISK CONTROLS (PCAMG-RUNTIME-0201 §6 / 0202 §2):
 *   - R-2 Authority Inflation: constraint results are derivative of upstream determinations; no authority created.
 *   - R-4 Constitutional Re-Interpretation: GEL outputs are consumed read-only; never re-decided or overridden.
 *   - R-5 Sovereignty Contamination: no sovereign source introduced; anchoring is only *read* from GEL.
 *   - R-6 Upstream Mutation: inputs are never written; no upstream state is mutated.
 *   - R-7 Boundary Collapse: constraints assess advancement readiness only; they do not re-implement GEL evaluation.
 */

import type { GovernanceEvaluation } from "../governance-evaluation/evaluation.ts";
import type { ComplianceEvaluation } from "../governance-evaluation/compliance.ts";

/**
 * Stable fail-closed denial codes for the Execution Eligibility Layer (shared across EEL-01..03).
 * A denial is emitted when the upstream state is structurally unformed and no eligibility verdict can
 * be produced. A formed-but-failing state is expressed as a `NOT_ELIGIBLE` verdict, not a denial.
 */
export type EligibilityDenialCode =
  | "E-UNEVALUATED-GOVERNANCE"
  | "E-UNASSESSED-COMPLIANCE"
  | "E-ELIGIBILITY-SUBJECT-MISMATCH"
  | "E-EMPTY-ELIGIBILITY-EVIDENCE";

/** A fail-closed eligibility denial with a stable, reconstructable cause. */
export interface EligibilityDenial {
  readonly code: EligibilityDenialCode;
  readonly message: string;
  readonly detail: Readonly<Record<string, unknown>>;
}

/**
 * The identifiers of the eligibility constraints that gate advancement. Each is a read-only predicate
 * over already-verified GEL determinations. Advancement is admissible only when every constraint is
 * satisfied.
 */
export type EligibilityConstraintId =
  | "C-CONSTITUTIONALLY-COMPLIANT"
  | "C-SOVEREIGNTY-ROOT-ANCHORED"
  | "C-SOVEREIGNTY-ORDERED";

/** The deterministic result of a single eligibility constraint. */
export interface ConstraintResult {
  /** The constraint evaluated. */
  readonly constraint: EligibilityConstraintId;
  /** True iff the constraint is satisfied by the upstream determinations. */
  readonly satisfied: boolean;
  /** A stable, reconstructable explanation. */
  readonly reason: string;
  /** Supporting detail for reconstruction. */
  readonly detail: Readonly<Record<string, unknown>>;
}

/** The result of an eligibility constraint evaluation: constraint results or a fail-closed denial. */
export interface EligibilityConstraintEvaluation {
  /** True iff the upstream state was well-formed and constraints were evaluated. */
  readonly evaluated: boolean;
  /** The subject the constraints were evaluated for (present iff evaluated). */
  readonly subject: string | null;
  /** The per-constraint results (present, non-empty, iff evaluated). */
  readonly constraints: readonly ConstraintResult[];
  /** True iff every constraint is satisfied (false when not evaluated). */
  readonly allSatisfied: boolean;
  /** The fail-closed denial (present iff not evaluated). */
  readonly denial: EligibilityDenial | null;
}

function deny(
  code: EligibilityDenialCode,
  message: string,
  detail: Readonly<Record<string, unknown>>,
): EligibilityConstraintEvaluation {
  return {
    evaluated: false,
    subject: null,
    constraints: Object.freeze([]),
    allSatisfied: false,
    denial: { code, message, detail },
  };
}

/**
 * Evaluate the eligibility constraints over the GEL governance evaluation (GEL-01) and constitutional
 * compliance evaluation (GEL-02). Read-only; performs zero writes, executes no governance, and
 * originates no authority.
 *
 * FAIL-CLOSED preconditions (INV-6) — any unmet precondition denies rather than producing a verdict:
 *   - E-UNEVALUATED-GOVERNANCE:      the governance evaluation is not decided.
 *   - E-UNASSESSED-COMPLIANCE:       the compliance evaluation is not decided.
 *   - E-ELIGIBILITY-SUBJECT-MISMATCH: the governance and compliance subjects differ.
 *
 * SUBSTANTIVE constraints (evaluated only over a well-formed upstream state):
 *   - C-CONSTITUTIONALLY-COMPLIANT:  the compliance finding reports full compliance (GEL-02).
 *   - C-SOVEREIGNTY-ROOT-ANCHORED:   the supreme provision is Layer-0 anchored (GEL-01; INV-9/INV-11).
 *   - C-SOVEREIGNTY-ORDERED:         the provisions are sovereignty-ordered (GEL-01).
 */
export function evaluateEligibilityConstraints(
  governance: GovernanceEvaluation,
  compliance: ComplianceEvaluation,
): EligibilityConstraintEvaluation {
  if (!governance.evaluated || governance.assessment === null || governance.subject === null) {
    return deny(
      "E-UNEVALUATED-GOVERNANCE",
      "cannot evaluate eligibility over an unevaluated governance state",
      { upstream: governance.denial?.code ?? null },
    );
  }
  if (!compliance.evaluated || compliance.finding === null || compliance.subject === null) {
    return deny(
      "E-UNASSESSED-COMPLIANCE",
      "cannot evaluate eligibility over an unassessed compliance state",
      { upstream: compliance.denial?.code ?? null },
    );
  }
  if (governance.subject !== compliance.subject) {
    return deny(
      "E-ELIGIBILITY-SUBJECT-MISMATCH",
      "governance and compliance subjects differ; refusing to evaluate eligibility",
      { governanceSubject: governance.subject, complianceSubject: compliance.subject },
    );
  }

  const subject = governance.subject;
  const { assessment } = governance;
  const { finding } = compliance;

  const constraints: readonly ConstraintResult[] = Object.freeze([
    Object.freeze({
      constraint: "C-CONSTITUTIONALLY-COMPLIANT" as const,
      satisfied: finding.compliant,
      reason: finding.compliant
        ? "compliance finding reports full constitutional compliance"
        : "compliance finding reports one or more violations",
      detail: { violations: finding.violations.map((v) => v.invariant) },
    }),
    Object.freeze({
      constraint: "C-SOVEREIGNTY-ROOT-ANCHORED" as const,
      satisfied: assessment.rootAnchored,
      reason: assessment.rootAnchored
        ? "supreme provision is Layer-0 anchored (sovereignty origin = Invariant Principles)"
        : "supreme provision is not Layer-0 anchored",
      detail: { supremeProvision: assessment.supremeProvision, rootAnchored: assessment.rootAnchored },
    }),
    Object.freeze({
      constraint: "C-SOVEREIGNTY-ORDERED" as const,
      satisfied: assessment.sovereigntyOrdered,
      reason: assessment.sovereigntyOrdered
        ? "provisions are ordered by non-decreasing sovereignty rank"
        : "provisions are not sovereignty-ordered",
      detail: { sovereigntyOrdered: assessment.sovereigntyOrdered },
    }),
  ]);

  const allSatisfied = constraints.every((c) => c.satisfied);

  return { evaluated: true, subject, constraints, allSatisfied, denial: null };
}
