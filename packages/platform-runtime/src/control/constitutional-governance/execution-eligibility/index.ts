/**
 * execution-eligibility/index.ts — Execution Eligibility Layer (EEL) namespace barrel (Wave-D).
 *
 * Aggregates the complete Wave-D Execution Eligibility Layer into one public surface:
 *   - CGR-W2-EEL-01 Eligibility Assessment           — assessEligibility, EligibilityAssessment, EligibilityVerdict
 *   - CGR-W2-EEL-02 Eligibility Constraint Evaluation — evaluateEligibilityConstraints, ConstraintResult
 *   - CGR-W2-EEL-03 Eligibility Evidence Emission     — EligibilityEvidenceEmitter, EligibilityEvidence
 *
 * Exposed through the constitutional-governance namespace as `executionEligibility`. Read-only
 * eligibility assessment + append-only evidence emission: confers NO ACTIVE state, originates NO
 * authority, executes NO governance, triggers NO execution, and creates NO activation pathway.
 * `ELIGIBLE` means "MAY advance toward a future execution phase" — never authorization-to-execute
 * (R-1 / R-3 semantic firewall).
 */

export * from "./constraints.ts";
export * from "./eligibility.ts";
export * from "./evidence.ts";
