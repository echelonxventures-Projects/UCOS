/**
 * UCOS Readiness Fabric — Store (RDN-ARCH-001).
 *
 * Persists readiness governance/config (dimensions, criteria, controls, requirements), high-frequency
 * observations (signals, evidence), and derived/signed outputs (assessments, certifications) into the
 * substrate Metadata runtime under the reserved `readiness:` namespace. No core dir is modified.
 *
 * Design note: signals and assessments are DERIVED, non-authoritative MONITORING artifacts and are
 * written directly (they are high-frequency and non-durable). Governed, signed outputs
 * (certifications) and governance config carry separate integrity guarantees (signatures / SoD).
 */

import type { InMemoryMetadataStore } from "../../metadata-runtime/metadata-store.ts";
import type {
  ComplianceControl,
  EvidenceRecord,
  MetaGovernanceRecord,
  ReadinessAssessment,
  ReadinessAuthorityRecord,
  ReadinessCertification,
  ReadinessCriterion,
  ReadinessDimension,
  ReadinessSignal,
  RequirementSpec,
} from "./types.ts";
import {
  ASSESSMENT_PREFIX,
  AUTHORITY_PREFIX,
  CERTIFICATION_PREFIX,
  CONTROL_PREFIX,
  CRITERION_PREFIX,
  DIMENSION_PREFIX,
  EVIDENCE_PREFIX,
  META_KEY,
  REQUIREMENT_PREFIX,
  SIGNAL_PREFIX,
  assessmentKey,
  authorityKey,
  certificationKey,
  controlKey,
  criterionKey,
  dimensionKey,
  evidenceKey,
  requirementKey,
  signalDimensionPrefix,
  signalKey,
} from "./readiness-namespace.ts";

export class ReadinessStore {
  readonly #metadata: InMemoryMetadataStore;

  constructor(metadata: InMemoryMetadataStore) {
    this.#metadata = metadata;
  }

  // --------------------------- Governance config ---------------------------

  putDimension(record: ReadinessDimension): void {
    this.#metadata.put(dimensionKey(record.dimensionId), record);
  }

  getDimension(dimensionId: string): ReadinessDimension | undefined {
    return this.#metadata.get(dimensionKey(dimensionId))?.value as ReadinessDimension | undefined;
  }

  dimensions(): ReadinessDimension[] {
    return this.#metadata.query(DIMENSION_PREFIX).map((r) => r.value as ReadinessDimension);
  }

  putCriterion(record: ReadinessCriterion): void {
    this.#metadata.put(criterionKey(record.criterionId), record);
  }

  criteria(): ReadinessCriterion[] {
    return this.#metadata.query(CRITERION_PREFIX).map((r) => r.value as ReadinessCriterion);
  }

  putControl(record: ComplianceControl): void {
    this.#metadata.put(controlKey(record.controlId), record);
  }

  getControl(controlId: string): ComplianceControl | undefined {
    return this.#metadata.get(controlKey(controlId))?.value as ComplianceControl | undefined;
  }

  controls(): ComplianceControl[] {
    return this.#metadata.query(CONTROL_PREFIX).map((r) => r.value as ComplianceControl);
  }

  putRequirement(record: RequirementSpec): void {
    this.#metadata.put(requirementKey(record.requirementId), record);
  }

  requirements(): RequirementSpec[] {
    return this.#metadata.query(REQUIREMENT_PREFIX).map((r) => r.value as RequirementSpec);
  }

  putAuthority(record: ReadinessAuthorityRecord): void {
    this.#metadata.put(authorityKey(record.authorityId), record);
  }

  getAuthority(authorityId: string): ReadinessAuthorityRecord | undefined {
    return this.#metadata.get(authorityKey(authorityId))?.value as ReadinessAuthorityRecord | undefined;
  }

  authorities(): ReadinessAuthorityRecord[] {
    return this.#metadata.query(AUTHORITY_PREFIX).map((r) => r.value as ReadinessAuthorityRecord);
  }

  putMeta(record: MetaGovernanceRecord): void {
    this.#metadata.put(META_KEY, record);
  }

  getMeta(): MetaGovernanceRecord | undefined {
    return this.#metadata.get(META_KEY)?.value as MetaGovernanceRecord | undefined;
  }

  // --------------------------- Signals & evidence ---------------------------

  putSignal(record: ReadinessSignal): void {
    this.#metadata.put(signalKey(record.dimensionId, record.signalId), record);
  }

  signalsForDimension(dimensionId: string): ReadinessSignal[] {
    return this.#metadata.query(signalDimensionPrefix(dimensionId)).map((r) => r.value as ReadinessSignal);
  }

  allSignals(): ReadinessSignal[] {
    return this.#metadata.query(SIGNAL_PREFIX).map((r) => r.value as ReadinessSignal);
  }

  putEvidence(record: EvidenceRecord): void {
    this.#metadata.put(evidenceKey(record.key), record);
  }

  getEvidence(key: string): EvidenceRecord | undefined {
    return this.#metadata.get(evidenceKey(key))?.value as EvidenceRecord | undefined;
  }

  evidence(): EvidenceRecord[] {
    return this.#metadata.query(EVIDENCE_PREFIX).map((r) => r.value as EvidenceRecord);
  }

  // --------------------------- Derived / signed outputs ---------------------------

  putAssessment(record: ReadinessAssessment): void {
    this.#metadata.put(assessmentKey(record.assessmentId), record);
  }

  getAssessment(assessmentId: string): ReadinessAssessment | undefined {
    return this.#metadata.get(assessmentKey(assessmentId))?.value as ReadinessAssessment | undefined;
  }

  assessments(): ReadinessAssessment[] {
    return this.#metadata.query(ASSESSMENT_PREFIX).map((r) => r.value as ReadinessAssessment);
  }

  putCertification(record: ReadinessCertification): void {
    this.#metadata.put(certificationKey(record.certificationId), record);
  }

  getCertification(certificationId: string): ReadinessCertification | undefined {
    return this.#metadata.get(certificationKey(certificationId))?.value as ReadinessCertification | undefined;
  }

  certifications(): ReadinessCertification[] {
    return this.#metadata.query(CERTIFICATION_PREFIX).map((r) => r.value as ReadinessCertification);
  }
}
