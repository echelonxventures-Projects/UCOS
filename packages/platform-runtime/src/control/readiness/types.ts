/**
 * UCOS PI-12 Ultimate Readiness Fabric — shared types (B06 / AD-0024).
 *
 * The Readiness Fabric CONTINUOUSLY ASSESSES whether the platform is ready — for release, for
 * evolution, for federation, for certification — by collecting signed, provenance-bearing signals
 * across governed readiness dimensions and running seven engines over them:
 *
 *   Policy · Compliance · Gap-Detection · Self-Inspection · Evolution-Readiness · Certification ·
 *   Meta-Governance.
 *
 * It is ADDITIVE over the ratified substrate + control + federation + evolution + knowledge + memory
 * fabrics and modifies no core dir. It introduces NO custom cryptography (readiness certifications
 * reuse the ratified federation Ed25519 primitives). It is deny-by-default and fail-closed: an absent,
 * stale, unverifiable, or contradicted signal never counts as "ready". Assessments are DERIVED,
 * non-authoritative monitoring artifacts; the only SIGNED, separation-of-duties-gated output is a
 * ReadinessCertification. It is NOT an Ω∞ self-directed governor (AD-0014 stands).
 */

import type { Provenance } from "../types.ts";

// ------------------------------ Readiness levels ------------------------------

/** Monotonic readiness ladder. Higher = more ready. `certified` is only reachable via `certify()`. */
export type ReadinessLevel = "not-ready" | "conditional" | "ready" | "certified";

/** Numeric ordering for the readiness ladder (comparison / monotonicity checks). */
export const READINESS_ORDER: Record<ReadinessLevel, number> = {
  "not-ready": 0,
  conditional: 1,
  ready: 2,
  certified: 3,
};

// ------------------------------ Dimensions & signals ------------------------------

/** A governed dimension of platform readiness (a fabric, a gate family, a capability area). */
export interface ReadinessDimension {
  dimensionId: string;
  title: string;
  /** Relative importance in the weighted overall score. Must be >= 0. */
  weight: number;
  /** A failing critical dimension forces overall `not-ready` regardless of the aggregate score. */
  critical: boolean;
}

/** Observation status, ordered pass > warn > fail > unknown. */
export type SignalStatus = "pass" | "warn" | "fail" | "unknown";

/** Numeric rank of a signal status (higher = healthier). Used for "status or better" comparisons. */
export const STATUS_RANK: Record<SignalStatus, number> = { pass: 3, warn: 2, fail: 1, unknown: 0 };

/**
 * A collected observation about a dimension, emitted by a probe/authority. `score` is in [0,1].
 * Signals are provenance-bearing; evidence is carried BY REFERENCE (S3: no inline secrets/payloads).
 */
export interface ReadinessSignal {
  signalId: string;
  dimensionId: string;
  source: string;
  status: SignalStatus;
  score: number;
  observedAt: number;
  evidenceRef?: string;
  detail?: string;
  provenance?: Provenance;
}

// ------------------------------ Policy (criteria) ------------------------------

/** A single, machine-evaluable readiness rule. Deny-by-default: an unmet precondition => fail. */
export type CriterionRule =
  | { type: "min-score"; dimensionId: string; min: number }
  | { type: "require-status"; dimensionId: string; status: SignalStatus }
  | { type: "require-signal"; dimensionId: string }
  | { type: "max-signal-age"; dimensionId: string; maxAgeMs: number }
  | { type: "no-critical-gaps" }
  | { type: "require-compliance"; controlId: string }
  | { type: "require-certification"; certificationId: string };

export interface ReadinessCriterion {
  criterionId: string;
  title: string;
  rules: CriterionRule[];
  /** A failing blocking criterion forces `not-ready` (it is a hard gate, not advisory). */
  blocking: boolean;
}

export interface CriterionOutcome {
  criterionId: string;
  passed: boolean;
  blocking: boolean;
  failures: string[];
}

// ------------------------------ Compliance ------------------------------

export type ComplianceStatus = "compliant" | "non-compliant" | "not-assessed";

export interface ComplianceControl {
  controlId: string;
  /** Control family, e.g. "security" | "quality" | "documentation" | "release" | "governance". */
  family: string;
  title: string;
  /** Evidence keys that must all be present AND passing for the control to be compliant. */
  requiredEvidence: string[];
  /** A mandatory non-compliant control is a hard blocker. */
  mandatory: boolean;
}

/** By-reference evidence record (no inline payload/secret; S3). */
export interface EvidenceRecord {
  key: string;
  present: boolean;
  pass: boolean;
  ref?: string;
  at: number;
}

export interface ComplianceResult {
  controlId: string;
  family: string;
  status: ComplianceStatus;
  mandatory: boolean;
  missingEvidence: string[];
  detail: string;
}

// ------------------------------ Gap detection ------------------------------

export type GapSeverity = "critical" | "major" | "minor";

export const GAP_SEVERITY_RANK: Record<GapSeverity, number> = { critical: 3, major: 2, minor: 1 };

/** A declared requirement whose absence is a gap of the given severity. */
export interface RequirementSpec {
  requirementId: string;
  dimensionId: string;
  description: string;
  /** Minimum passing score in [0,1] for the requirement's dimension to be considered satisfied. */
  minScore: number;
  severityIfMissing: GapSeverity;
}

export interface Gap {
  gapId: string;
  requirementId: string;
  dimensionId: string;
  severity: GapSeverity;
  detail: string;
}

// ------------------------------ Evolution readiness ------------------------------

/** Observed change-management state (supplied by an oracle over the PI-6 Evolution Fabric or reported). */
export interface EvolutionReadinessInput {
  openProposals: number;
  pendingChanges: number;
  unreconciledRollbacks: number;
  auditDivergent: boolean;
}

export interface EvolutionReadinessPolicy {
  maxOpenProposals: number;
  maxPendingChanges: number;
}

export interface EvolutionReadinessResult {
  ready: boolean;
  detail: string;
  blockers: string[];
}

// ------------------------------ Self inspection ------------------------------

export interface SelfInspectionCheck {
  name: string;
  ok: boolean;
  detail: string;
}

export interface SelfInspectionResult {
  ok: boolean;
  checks: SelfInspectionCheck[];
}

// ------------------------------ Meta governance ------------------------------

export type ReadinessPower = "assess" | "certify" | "govern" | "inspect" | "revoke";
export type AuthorityStatus = "active" | "revoked";

export interface ReadinessAuthorityRecord {
  authorityId: string;
  owner: string;
  /** Enumerated powers; no implicit authority. */
  powers: ReadinessPower[];
  /** Public key by reference (S3: no key material inline). */
  keyRef: string;
  /** Dimension scope, "*" or a "readiness:<...>" glob. */
  scope: string;
  status: AuthorityStatus;
}

/** Governs the readiness fabric itself (cadence + SoD invariants). */
export interface MetaGovernanceRecord {
  /** Minimum interval between certifications of the same target (anti-rubber-stamp). */
  minCertificationIntervalMs: number;
  /** Assessor and certifier principals MUST differ (separation of duties). */
  requireSeparationOfDuties: boolean;
  /** The fabric may not certify its OWN readiness dimension without an independent authority. */
  prohibitSelfCertification: boolean;
}

// ------------------------------ Assessment (aggregate) ------------------------------

export interface DimensionAssessment {
  dimensionId: string;
  score: number;
  status: SignalStatus;
  critical: boolean;
  signalCount: number;
  weight: number;
}

export interface ReadinessAssessment {
  assessmentId: string;
  at: number;
  level: ReadinessLevel;
  overallScore: number;
  dimensions: DimensionAssessment[];
  criteria: CriterionOutcome[];
  compliance: ComplianceResult[];
  gaps: Gap[];
  evolution: EvolutionReadinessResult;
  selfInspection: SelfInspectionResult;
  /** Human-readable reasons preventing a higher readiness level. Empty at `ready`+. */
  blockers: string[];
  /** Deterministic content hash of the assessment (binds certifications, tamper-evident). */
  assessmentHash: string;
}

// ------------------------------ Certification (signed) ------------------------------

export type CertificationStatus = "certified" | "revoked";

export interface ReadinessCertification {
  certificationId: string;
  assessmentId: string;
  /** Binds the certification to a specific assessment content hash (tamper-evident). */
  assessmentHash: string;
  level: ReadinessLevel;
  caId: string;
  /** Owner principal that certified. */
  certifier: string;
  /** Principal that produced the assessment (SoD: assessor !== certifier). */
  assessor: string;
  at: number;
  expiresAt: number;
  signature: string;
}

// ------------------------------ Audit / events ------------------------------

export type ReadinessAuditEvent =
  | "RDN_SIGNAL_INGESTED"
  | "RDN_ASSESSED"
  | "RDN_CRITERION_FAILED"
  | "RDN_GAP_DETECTED"
  | "RDN_COMPLIANCE_EVALUATED"
  | "RDN_SELF_INSPECTED"
  | "RDN_EVOLUTION_CHECKED"
  | "RDN_CERTIFIED"
  | "RDN_CERTIFICATION_DENIED"
  | "RDN_REVOKED";

export interface ReadinessAuditEntry {
  at: number;
  event: ReadinessAuditEvent;
  /** The subject id (assessmentId / signalId / certificationId / dimensionId). */
  subject: string;
  actor: string;
  detail: string;
  stateHash?: string;
}

// ------------------------------ Results ------------------------------

export interface VerificationResult {
  ok: boolean;
  reason: string;
}
