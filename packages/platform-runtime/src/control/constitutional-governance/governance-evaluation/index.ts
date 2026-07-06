/**
 * governance-evaluation/index.ts — Governance Evaluation Layer (GEL) namespace barrel (Wave-C).
 *
 * Aggregates the complete Wave-C Governance Evaluation Layer into one public surface:
 *   - CGR-W2-GEL-01 Governance Evaluation Engine       — evaluateGovernance, GovernanceEvaluation, GovernanceAssessment
 *   - CGR-W2-GEL-02 Constitutional Compliance Evaluator — evaluateCompliance, ComplianceEvaluation, ComplianceFinding
 *   - CGR-W2-GEL-03 Evaluation Evidence Emitter         — EvaluationEvidenceEmitter, EvaluationEvidence
 *
 * Exposed through the constitutional-governance namespace as `governanceEvaluation`. Read-only
 * evaluation engines + append-only evidence emission: confers NO ACTIVE state, originates NO
 * authority, executes NO governance, and creates NO activation pathway (Wave-C/D boundary).
 */

export * from "./evaluation.ts";
export * from "./compliance.ts";
export * from "./evidence.ts";
