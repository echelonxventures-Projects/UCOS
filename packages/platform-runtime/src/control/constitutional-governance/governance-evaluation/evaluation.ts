/**
 * CGR-W2-GEL-01 — Governance Evaluation Engine (Wave-C, Governance Evaluation Layer).
 *
 * Authorized by PCAMG-RUNTIME-0112 (`WAVE_C_IMPLEMENTATION_AUTHORIZED`) and constructed under
 * PCAMG-RUNTIME-0112A. Evaluates governance state for a subject WITHOUT executing governance: it
 * consumes the Constitutional Resolution Layer's precedence output (CGR-W2-CRL-02) and produces a
 * deterministic, read-only structural assessment. Fail-closed: an undecided precedence denies with a
 * stable cause rather than emitting a partial assessment.
 *
 * REUSE JUSTIFICATION:
 *   Reused assets —
 *     - CGR-W2-CRL-02 `PrecedenceResult` / `ApplicableProvision` (constitutional-resolution) — the sole input.
 *     - Wave-1 `REGISTRY_NAMES` (CGR-CORE-01): the sovereignty tiering used to confirm ordering.
 *   Reason new code is necessary: governance evaluation over resolved provisions is new behaviour
 *   (ACR/AVR/CRL resolve and order; none *evaluate governance fitness*). It is composed entirely from
 *   reused reads and reports structural facts only — it executes nothing, decides nothing, mutates
 *   nothing, and originates no authority.
 *
 * CONSTITUTIONAL POSTURE: read-only assessment. No execution, no activation, no mutation. The output
 * is an immutable report; downstream execution eligibility (EEL / Wave-D) is explicitly NOT computed here.
 */

import { REGISTRY_NAMES } from "../types.ts";
import type { PrecedenceResult } from "../constitutional-resolution/precedence.ts";
import type { ApplicableProvision } from "../constitutional-resolution/applicable-provision.ts";

/** Stable fail-closed denial codes for the Governance Evaluation Layer (shared across GEL-01..03). */
export type EvaluationDenialCode =
  | "E-UNDECIDED-PRECEDENCE"
  | "E-EMPTY-EVALUATION"
  | "E-UNVERIFIED-EVALUATION"
  | "E-EVALUATION-SUBJECT-MISMATCH"
  | "E-UNASSESSED-COMPLIANCE"
  | "E-EMPTY-EVIDENCE";

/** A fail-closed evaluation denial with a stable, reconstructable cause. */
export interface EvaluationDenial {
  readonly code: EvaluationDenialCode;
  readonly message: string;
  readonly detail: Readonly<Record<string, unknown>>;
}

/** The deterministic, read-only structural assessment of a subject's resolved governance state. */
export interface GovernanceAssessment {
  /** Number of applicable provisions governing the subject. */
  readonly provisionCount: number;
  /** The supreme (highest-precedence) provision's logical id. */
  readonly supremeProvision: string;
  /** True iff the supreme provision is the Layer-0 principle root (sovereignty-anchored). */
  readonly rootAnchored: boolean;
  /** True iff the provisions are ordered by non-decreasing registry sovereignty rank. */
  readonly sovereigntyOrdered: boolean;
  /** Deepest provision depth from the subject. */
  readonly maxDepth: number;
}

/** The result of a governance evaluation: an assessment or a fail-closed denial (never both). */
export interface GovernanceEvaluation {
  readonly evaluated: boolean;
  /** Subject the evaluation was produced for (present iff evaluated). */
  readonly subject: string | null;
  /** The read-only structural assessment (present iff evaluated). */
  readonly assessment: GovernanceAssessment | null;
  /** The fail-closed denial (present iff not evaluated). */
  readonly denial: EvaluationDenial | null;
}

function deny(
  code: EvaluationDenialCode,
  message: string,
  detail: Readonly<Record<string, unknown>>,
): GovernanceEvaluation {
  return { evaluated: false, subject: null, assessment: null, denial: { code, message, detail } };
}

function sovereigntyRank(provision: ApplicableProvision): number {
  return REGISTRY_NAMES.indexOf(provision.registry);
}

/**
 * Evaluate the resolved governance state carried by a CRL precedence result. Read-only; performs
 * zero writes, executes no governance, and originates no authority. Fail-closed on an undecided
 * precedence (E-UNDECIDED-PRECEDENCE) or an empty ordering (E-EMPTY-EVALUATION).
 */
export function evaluateGovernance(precedence: PrecedenceResult): GovernanceEvaluation {
  if (!precedence.decided || precedence.supreme === null || precedence.subject === null) {
    return deny("E-UNDECIDED-PRECEDENCE", "cannot evaluate governance over an undecided precedence", {
      upstream: precedence.denial?.code ?? null,
    });
  }
  if (precedence.ordered.length === 0) {
    return deny("E-EMPTY-EVALUATION", "no provisions to evaluate", { subject: precedence.subject });
  }

  // Deterministic assessment: confirm sovereignty ordering (non-decreasing registry rank) and depth.
  let sovereigntyOrdered = true;
  let maxDepth = 0;
  for (let i = 0; i < precedence.ordered.length; i += 1) {
    const p = precedence.ordered[i]!;
    if (p.depth > maxDepth) maxDepth = p.depth;
    if (i > 0 && sovereigntyRank(precedence.ordered[i - 1]!) > sovereigntyRank(p)) {
      sovereigntyOrdered = false;
    }
  }

  const assessment: GovernanceAssessment = {
    provisionCount: precedence.ordered.length,
    supremeProvision: precedence.supreme.logicalId,
    rootAnchored: precedence.supreme.isRoot,
    sovereigntyOrdered,
    maxDepth,
  };

  return { evaluated: true, subject: precedence.subject, assessment: Object.freeze(assessment), denial: null };
}
