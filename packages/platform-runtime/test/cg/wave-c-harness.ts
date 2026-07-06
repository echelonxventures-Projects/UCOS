/**
 * Wave-C test harness — reusable fixtures for the Governance Evaluation Layer (GEL).
 *
 * Wraps the Wave-B resolution fixture and adds GEL-01/02/03 evaluation outputs for common test scenarios.
 * Deterministic: identical subject ⇒ byte-identical evaluations.
 */

import { resolutionFixture } from "./wave-b-harness.ts";
import { evaluateGovernance } from "../../src/control/constitutional-governance/governance-evaluation/evaluation.ts";
import { evaluateCompliance } from "../../src/control/constitutional-governance/governance-evaluation/compliance.ts";
import { EvaluationEvidenceEmitter } from "../../src/control/constitutional-governance/governance-evaluation/evidence.ts";
import type { GovernanceEvaluation } from "../../src/control/constitutional-governance/governance-evaluation/evaluation.ts";
import type { ComplianceEvaluation } from "../../src/control/constitutional-governance/governance-evaluation/compliance.ts";

/** Complete Wave-C evaluation fixture for a subject (GEL-01 + GEL-02 + resolution context). */
export interface WaveCFixture {
  /** The subject the fixture was generated for. */
  readonly subject: string;
  /** GEL-01 governance evaluation result. */
  readonly governanceEvaluation: GovernanceEvaluation;
  /** GEL-02 constitutional compliance evaluation result. */
  readonly complianceEvaluation: ComplianceEvaluation;
  /** The Wave-B resolution fixture the evaluations are derived from. */
  readonly resolution: ReturnType<typeof resolutionFixture>;
}

/**
 * Generate a complete Wave-C evaluation fixture for a subject. Deterministic: identical subject ⇒
 * byte-identical evaluations. The subject is resolved through Wave-B (ACR + AVR + CRL), then
 * evaluated through Wave-C (GEL-01 + GEL-02).
 */
export function waveCFixture(subject: string): WaveCFixture {
  const resolution = resolutionFixture(subject);
  const governanceEvaluation = evaluateGovernance(resolution.precedence);
  const complianceEvaluation = evaluateCompliance(governanceEvaluation);

  return {
    subject,
    governanceEvaluation,
    complianceEvaluation,
    resolution,
  };
}

/**
 * Generate a GEL-03 evidence emitter populated with evaluation evidence for a subject.
 * Deterministic: identical subject ⇒ byte-identical evidence chain.
 */
export function evidenceFixture(subject: string): {
  emitter: EvaluationEvidenceEmitter;
  fixture: WaveCFixture;
} {
  const fixture = waveCFixture(subject);
  const emitter = new EvaluationEvidenceEmitter();
  emitter.emitGovernanceEvaluation(fixture.governanceEvaluation);
  emitter.emitComplianceEvaluation(fixture.complianceEvaluation);
  return { emitter, fixture };
}
