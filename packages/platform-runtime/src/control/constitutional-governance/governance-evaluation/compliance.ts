/**
 * CGR-W2-GEL-02 — Constitutional Compliance Evaluator (Wave-C, Governance Evaluation Layer).
 *
 * Authorized by PCAMG-RUNTIME-0112 (`WAVE_C_IMPLEMENTATION_AUTHORIZED`) and constructed under
 * PCAMG-RUNTIME-0112A. Assesses constitutional compliance for a subject by evaluating whether the
 * governance assessment satisfies the Invariant Principles (INV-1..11) that govern the Constitutional
 * Governance Runtime. Read-only, deterministic, and verify-on-read: it consumes the governance
 * assessment (CGR-W2-GEL-01) and produces a structural compliance finding WITHOUT executing governance,
 * mutating state, or originating authority.
 *
 * REUSE JUSTIFICATION:
 *   Reused assets —
 *     - CGR-W2-GEL-01 `GovernanceAssessment` / `GovernanceEvaluation` — the sole input.
 *     - CGR-W2-GEL-01 denial shape (`EvaluationDenial`/`EvaluationDenialCode`) — shared fail-closed vocabulary.
 *     - Wave-1 Invariant Principles (INV-1..11, encoded in authority/invariant-principles/) — the
 *       compliance criteria. No new constitutional axioms are introduced.
 *   Reason new code is necessary: constitutional compliance assessment over governance evaluations is
 *   new behaviour (ACR/AVR/CRL/GEL-01 produce assessments; none *evaluate compliance*). It is composed
 *   entirely from reused reads and reports structural compliance facts only — it executes nothing,
 *   decides nothing, mutates nothing, and originates no authority.
 *
 * CONSTITUTIONAL POSTURE: read-only compliance assessment. No execution, no activation, no mutation.
 * The output is an immutable compliance finding; downstream execution eligibility (EEL / Wave-D) is
 * explicitly NOT computed here.
 *
 * COMPLIANCE CRITERIA (derived from Invariant Principles):
 *   - INV-1 (Append-Only): verified by audit continuity (not assessed here; deferred to evidence layer).
 *   - INV-2 (Propose-Only): no governance execution pathway exists (structural invariant; Wave-C/D boundary).
 *   - INV-3 (Deterministic): governance assessment is pure and deterministic (GEL-01 contract).
 *   - INV-4 (Verify-on-Read): authority/verification chains are verified before consumption (CRL contract).
 *   - INV-5 (Audit Continuity): audit chain is unbroken (verified by CGR-AU-VERIFY; not assessed here).
 *   - INV-6 (Fail-Closed): all denials are stable and reconstructable (GEL-01/CRL/ACR/AVR contract).
 *   - INV-7 (No ACTIVE State): no governance record enters ACTIVE without ratification (execution boundary).
 *   - INV-8 (No Activation Pathway): no code path activates governance (Wave-C/D boundary).
 *   - INV-9 (No Authority Origination): authority originates from Layer-0 only (rootAnchored check).
 *   - INV-10 (No Mutation Outside Append-Only): all state changes are append-only audited (architectural).
 *   - INV-11 (Sovereignty Origin = Invariant Principles): the supreme provision is Layer-0 anchored (rootAnchored check).
 *
 * ASSESSMENT FOCUS: INV-9 and INV-11 are structurally verifiable from the governance assessment's
 * `rootAnchored` flag. Other invariants are architectural constraints enforced by Wave-1/A/B/C
 * construction (no execution, no mutation, no activation, verify-on-read, fail-closed, append-only).
 */

import type {
  GovernanceEvaluation,
  GovernanceAssessment,
  EvaluationDenial,
  EvaluationDenialCode,
} from "./evaluation.ts";

/** A single compliance violation: the invariant violated and a reconstructable explanation. */
export interface ComplianceViolation {
  /** The Invariant Principle violated (e.g., "INV-9", "INV-11"). */
  readonly invariant: string;
  /** A stable, reconstructable explanation of the violation. */
  readonly reason: string;
  /** Supporting detail for reconstruction. */
  readonly detail: Readonly<Record<string, unknown>>;
}

/** The deterministic, read-only constitutional compliance finding for a subject. */
export interface ComplianceFinding {
  /** True iff the subject's governance state is constitutionally compliant. */
  readonly compliant: boolean;
  /** The subject the finding applies to. */
  readonly subject: string;
  /** The governance assessment the finding is derived from. */
  readonly assessment: GovernanceAssessment;
  /** Violations detected (empty iff compliant). */
  readonly violations: readonly ComplianceViolation[];
}

/** The result of a compliance evaluation: a finding or a fail-closed denial (never both). */
export interface ComplianceEvaluation {
  readonly evaluated: boolean;
  /** Subject the evaluation was produced for (present iff evaluated). */
  readonly subject: string | null;
  /** The read-only compliance finding (present iff evaluated). */
  readonly finding: ComplianceFinding | null;
  /** The fail-closed denial (present iff not evaluated). */
  readonly denial: EvaluationDenial | null;
}

function deny(
  code: EvaluationDenialCode,
  message: string,
  detail: Readonly<Record<string, unknown>>,
): ComplianceEvaluation {
  return { evaluated: false, subject: null, finding: null, denial: { code, message, detail } };
}

/**
 * Evaluate constitutional compliance for a governance evaluation. Read-only; performs zero writes,
 * executes no governance, and originates no authority. Fail-closed on an unevaluated governance
 * state (E-UNVERIFIED-EVALUATION).
 *
 * COMPLIANCE CHECKS:
 *   - INV-9 (No Authority Origination): authority originates from Layer-0 only (rootAnchored).
 *   - INV-11 (Sovereignty Origin = Invariant Principles): the supreme provision is Layer-0 anchored (rootAnchored).
 *
 * Other invariants (INV-1..8, INV-10) are architectural constraints enforced by Wave-1/A/B/C
 * construction; no runtime check is required here.
 */
export function evaluateCompliance(evaluation: GovernanceEvaluation): ComplianceEvaluation {
  if (!evaluation.evaluated || evaluation.assessment === null || evaluation.subject === null) {
    return deny("E-UNVERIFIED-EVALUATION", "cannot assess compliance over an unevaluated governance state", {
      upstream: evaluation.denial?.code ?? null,
    });
  }

  const violations: ComplianceViolation[] = [];
  const { assessment, subject } = evaluation;

  // INV-9 and INV-11: the supreme provision MUST be Layer-0 (rootAnchored).
  // "Sovereignty Origin = Invariant Principles" — authority originates from Layer-0 only.
  if (!assessment.rootAnchored) {
    violations.push({
      invariant: "INV-9",
      reason: "authority does not originate from Layer-0",
      detail: { supremeProvision: assessment.supremeProvision, rootAnchored: false },
    });
    violations.push({
      invariant: "INV-11",
      reason: "supreme provision is not Layer-0 anchored",
      detail: { supremeProvision: assessment.supremeProvision, rootAnchored: false },
    });
  }

  const finding: ComplianceFinding = {
    compliant: violations.length === 0,
    subject,
    assessment,
    violations: Object.freeze(violations),
  };

  return { evaluated: true, subject, finding: Object.freeze(finding), denial: null };
}
