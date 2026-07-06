/**
 * Wave-D test harness — reusable fixtures for the Execution Eligibility Layer (EEL).
 *
 * Wraps the Wave-C evaluation fixture and adds EEL-01/02/03 eligibility outputs for common test
 * scenarios. Deterministic: identical subject ⇒ byte-identical eligibility verdicts. Also provides a
 * synthetic non-eligible upstream fixture (non-root-anchored ⇒ non-compliant) for NOT_ELIGIBLE paths.
 *
 * This harness is the primary verification asset handed to PCAMG-RUNTIME-0203 (Wave-D Verification).
 */

import { waveCFixture, type WaveCFixture } from "./wave-c-harness.ts";
import { evaluateCompliance } from "../../src/control/constitutional-governance/governance-evaluation/compliance.ts";
import { assessEligibility } from "../../src/control/constitutional-governance/execution-eligibility/eligibility.ts";
import { evaluateEligibilityConstraints } from "../../src/control/constitutional-governance/execution-eligibility/constraints.ts";
import { EligibilityEvidenceEmitter } from "../../src/control/constitutional-governance/execution-eligibility/evidence.ts";
import type { GovernanceEvaluation } from "../../src/control/constitutional-governance/governance-evaluation/evaluation.ts";
import type { ComplianceEvaluation } from "../../src/control/constitutional-governance/governance-evaluation/compliance.ts";
import type { EligibilityAssessment } from "../../src/control/constitutional-governance/execution-eligibility/eligibility.ts";
import type { EligibilityConstraintEvaluation } from "../../src/control/constitutional-governance/execution-eligibility/constraints.ts";

/** Complete Wave-D eligibility fixture for a subject (EEL-02 + EEL-01 + Wave-C context). */
export interface WaveDFixture {
  /** The subject the fixture was generated for. */
  readonly subject: string;
  /** The Wave-C evaluation fixture the eligibility is derived from. */
  readonly waveC: WaveCFixture;
  /** EEL-02 eligibility constraint evaluation result. */
  readonly constraintEvaluation: EligibilityConstraintEvaluation;
  /** EEL-01 eligibility assessment result. */
  readonly eligibility: EligibilityAssessment;
}

/**
 * Generate a complete Wave-D eligibility fixture for a subject. Deterministic: identical subject ⇒
 * byte-identical verdicts. The subject is resolved + evaluated through Wave-A/B/C, then assessed for
 * execution eligibility through Wave-D (EEL-02 + EEL-01).
 */
export function waveDFixture(subject: string): WaveDFixture {
  const waveC = waveCFixture(subject);
  const constraintEvaluation = evaluateEligibilityConstraints(
    waveC.governanceEvaluation,
    waveC.complianceEvaluation,
  );
  const eligibility = assessEligibility(waveC.governanceEvaluation, waveC.complianceEvaluation);
  return { subject, waveC, constraintEvaluation, eligibility };
}

/**
 * Generate an EEL-03 eligibility evidence emitter populated with the eligibility verdict for a
 * subject. Deterministic: identical subject ⇒ byte-identical evidence chain (modulo timestamps).
 */
export function eligibilityEvidenceFixture(subject: string): {
  emitter: EligibilityEvidenceEmitter;
  fixture: WaveDFixture;
} {
  const fixture = waveDFixture(subject);
  const emitter = new EligibilityEvidenceEmitter();
  emitter.emitEligibilityAssessment(fixture.eligibility);
  return { emitter, fixture };
}

/**
 * Build a synthetic non-eligible upstream pair: a non-root-anchored governance evaluation and its
 * authentic (non-compliant) compliance evaluation, produced by the real GEL-02 evaluator. Used to
 * drive `NOT_ELIGIBLE` paths without depending on fixture internals.
 */
export function nonEligibleUpstream(subject: string): {
  governance: GovernanceEvaluation;
  compliance: ComplianceEvaluation;
} {
  const governance: GovernanceEvaluation = {
    evaluated: true,
    subject,
    assessment: {
      provisionCount: 1,
      supremeProvision: "TEST-PRIN-999",
      rootAnchored: false, // NOT Layer-0 anchored ⇒ GEL-02 will report violations
      sovereigntyOrdered: true,
      maxDepth: 1,
    },
    denial: null,
  };
  const compliance = evaluateCompliance(governance);
  return { governance, compliance };
}

/**
 * Build a well-formed but subject-mismatched upstream pair: both the governance evaluation and the
 * compliance evaluation are decided, but they refer to different subjects. Used to drive the
 * fail-closed subject-consistency path (E-ELIGIBILITY-SUBJECT-MISMATCH) without depending on which
 * capability subjects exist in the seeded corpus.
 */
export function mismatchedUpstream(
  governanceSubject: string,
  complianceSubject: string,
): { governance: GovernanceEvaluation; compliance: ComplianceEvaluation } {
  const governance: GovernanceEvaluation = {
    evaluated: true,
    subject: governanceSubject,
    assessment: {
      provisionCount: 1,
      supremeProvision: "TEST-PRIN-000",
      rootAnchored: true,
      sovereigntyOrdered: true,
      maxDepth: 1,
    },
    denial: null,
  };
  const compliance: ComplianceEvaluation = {
    evaluated: true,
    subject: complianceSubject,
    finding: {
      compliant: true,
      subject: complianceSubject,
      assessment: governance.assessment!,
      violations: Object.freeze([]),
    },
    denial: null,
  };
  return { governance, compliance };
}
