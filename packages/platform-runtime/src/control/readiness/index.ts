/**
 * UCOS PI-12 Ultimate Readiness Fabric — public surface (B06 / AD-0024).
 *
 * Continuous, deny-by-default platform readiness assessment across seven engines — Policy · Compliance ·
 * Gap-Detection · Self-Inspection · Evolution-Readiness · Certification · Meta-Governance — built
 * additively over the ratified substrate + control + federation + evolution + knowledge + memory
 * fabrics. Signed readiness certifications reuse the federation Ed25519 primitives (NO custom crypto);
 * no substrate core dir is modified. Not an Ω∞ self-directed governor (AD-0014 stands).
 */

// Types & constants
export type {
  ReadinessLevel,
  ReadinessDimension,
  SignalStatus,
  ReadinessSignal,
  CriterionRule,
  ReadinessCriterion,
  CriterionOutcome,
  ComplianceStatus,
  ComplianceControl,
  EvidenceRecord,
  ComplianceResult,
  GapSeverity,
  RequirementSpec,
  Gap,
  EvolutionReadinessInput,
  EvolutionReadinessPolicy,
  EvolutionReadinessResult,
  SelfInspectionCheck,
  SelfInspectionResult,
  ReadinessPower,
  AuthorityStatus,
  ReadinessAuthorityRecord,
  MetaGovernanceRecord,
  DimensionAssessment,
  ReadinessAssessment,
  CertificationStatus,
  ReadinessCertification,
  ReadinessAuditEvent,
  ReadinessAuditEntry,
  VerificationResult,
} from "./types.ts";
export { READINESS_ORDER, STATUS_RANK, GAP_SEVERITY_RANK } from "./types.ts";

// Namespace helpers
export {
  DIMENSION_PREFIX,
  CRITERION_PREFIX,
  CONTROL_PREFIX,
  REQUIREMENT_PREFIX,
  AUTHORITY_PREFIX,
  SIGNAL_PREFIX,
  EVIDENCE_PREFIX,
  ASSESSMENT_PREFIX,
  CERTIFICATION_PREFIX,
  REVOKED_PREFIX,
  META_KEY,
  dimensionKey,
  criterionKey,
  controlKey,
  requirementKey,
  authorityKey,
  signalKey,
  signalDimensionPrefix,
  evidenceKey,
  assessmentKey,
  certificationKey,
  revokedKey,
} from "./readiness-namespace.ts";

// Signal construction & helpers
export { signalHash, validateSignal, createSignal, statusAtLeast, worstStatus } from "./readiness-signal.ts";

// Lifecycle & state machine
export { canTransition, assertTransition, isTerminal, stateForStatus } from "./readiness-lifecycle.ts";
export type { CertificationLifecycleState } from "./readiness-lifecycle.ts";
export { ReadinessStateMachine } from "./readiness-state-machine.ts";

// Storage
export { ReadinessStore } from "./readiness-store.ts";

// Events
export { ReadinessEventBus } from "./readiness-events.ts";
export type { ReadinessEvent, ReadinessEventType, ReadinessEventListener, ReadinessEventBusOptions } from "./readiness-events.ts";

// Audit
export { ReadinessAuditLog, RDN_GENESIS_HASH } from "./readiness-audit.ts";
export type { ReadinessChainedEntry, RdnDivergence, RdnReconciliationResult, RdnAuditExport } from "./readiness-audit.ts";

// The seven engines
export { ReadinessPolicyEngine } from "./policy-engine.ts";
export type { PolicyEvaluationContext } from "./policy-engine.ts";
export { ComplianceEngine } from "./compliance-engine.ts";
export { GapDetectionEngine } from "./gap-detection-engine.ts";
export { EvolutionReadinessEngine, DEFAULT_EVOLUTION_READINESS_POLICY } from "./evolution-engine.ts";
export { SelfInspectionEngine } from "./self-inspection-engine.ts";
export type { SelfInspectionInput } from "./self-inspection-engine.ts";
export { CertificationEngine } from "./certification-engine.ts";
export type { CertificationAuthorityRecord, IssueCertificationInput } from "./certification-engine.ts";
export { MetaGovernanceEngine, DEFAULT_META_GOVERNANCE } from "./meta-governance-engine.ts";

// Control assembly
export { ReadinessControl, createReadiness } from "./readiness-control.ts";
export type {
  ReadinessOptions,
  AssessOptions,
  CertifyOptions,
  EvolutionReadinessOracle,
} from "./readiness-control.ts";
