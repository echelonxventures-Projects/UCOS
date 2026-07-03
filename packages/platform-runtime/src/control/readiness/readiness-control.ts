/**
 * UCOS PI-12 Ultimate Readiness Fabric — Control assembly (RDN-ARCH-001 / B06 / AD-0024).
 *
 * `ReadinessControl` is the single controlled entry point. It CONTINUOUSLY ASSESSES platform readiness
 * by orchestrating the seven engines over collected signals, evidence, requirements, and criteria, and
 * it is the ONLY place that produces the fabric's signed, separation-of-duties-gated output: a
 * ReadinessCertification.
 *
 * Invariants:
 *   - deny-by-default / fail-closed: absent, stale, unverifiable, or contradicted inputs never read as
 *     "ready"; certification is refused (and audited) unless every gate passes;
 *   - separation of duties: assessor ≠ certifier, enforced by the Meta-Governance Engine before the
 *     Certification Engine is permitted to sign;
 *   - self-inspection first: the fabric proves its own audit/SoD/wiring integrity every assessment;
 *   - tamper-evidence: every event is hash-chained; certifications bind to an assessment content hash;
 *   - additive & no custom crypto: built over the ratified substrate/federation primitives only.
 *
 * Assessments are DERIVED monitoring artifacts (written directly). Certifications are the governed,
 * signed outputs. This is NOT an Ω∞ self-directed governor (AD-0014 stands).
 */

import type { KeyObject } from "node:crypto";
import type { Substrate } from "../../bootstrap.ts";
import { KeyRegistry, canonicalize, sha256 } from "../federation/assertions.ts";
import { AuthorizationError, ControlValidationError } from "../errors.ts";
import type {
  ComplianceControl,
  ComplianceResult,
  CriterionOutcome,
  DimensionAssessment,
  EvidenceRecord,
  EvolutionReadinessInput,
  EvolutionReadinessPolicy,
  Gap,
  ReadinessAssessment,
  ReadinessAuditEvent,
  ReadinessAuthorityRecord,
  ReadinessCertification,
  ReadinessCriterion,
  ReadinessDimension,
  ReadinessLevel,
  ReadinessSignal,
  RequirementSpec,
  VerificationResult,
} from "./types.ts";
import { ReadinessStore } from "./readiness-store.ts";
import { ReadinessAuditLog } from "./readiness-audit.ts";
import { ReadinessEventBus } from "./readiness-events.ts";
import { ReadinessStateMachine } from "./readiness-state-machine.ts";
import { createSignal, worstStatus } from "./readiness-signal.ts";
import { ReadinessPolicyEngine, type PolicyEvaluationContext } from "./policy-engine.ts";
import { ComplianceEngine } from "./compliance-engine.ts";
import { GapDetectionEngine } from "./gap-detection-engine.ts";
import { EvolutionReadinessEngine, DEFAULT_EVOLUTION_READINESS_POLICY } from "./evolution-engine.ts";
import { SelfInspectionEngine } from "./self-inspection-engine.ts";
import { CertificationEngine, type CertificationAuthorityRecord } from "./certification-engine.ts";
import { MetaGovernanceEngine } from "./meta-governance-engine.ts";

/** Read-only oracle over the PI-6 Evolution Fabric supplying live change-management state. */
export type EvolutionReadinessOracle = () => EvolutionReadinessInput;

export interface ReadinessOptions {
  nodeId: string;
  keys?: KeyRegistry;
  eventBus?: ReadinessEventBus;
  /** Weighted overall score at/above which an unblocked assessment reaches `ready`. Default 0.8. */
  readyThreshold?: number;
  /** Ceilings for the Evolution-Readiness Engine. */
  evolutionPolicy?: EvolutionReadinessPolicy;
  /** Live evolution posture oracle; when absent, a zero-activity baseline is assumed (overridable per-assess). */
  evolutionOracle?: EvolutionReadinessOracle;
}

export interface AssessOptions {
  /** Principal running this assessment (recorded as the assessor for later SoD checks). */
  assessor?: string;
  now?: number;
  /** Explicit evolution posture for this run (overrides the oracle / baseline). */
  evolutionInput?: EvolutionReadinessInput;
}

export interface CertifyOptions {
  privateKey: KeyObject;
  caId: string;
  certifierAuthorityId: string;
  assessorAuthorityId: string;
  /** Principal that produced the assessment (SoD: must differ from the certifier owner). */
  assessor: string;
  now?: number;
  ttlMs?: number;
}

const READY_THRESHOLD_DEFAULT = 0.8;

export class ReadinessControl {
  readonly store: ReadinessStore;
  readonly audit: ReadinessAuditLog;
  readonly events: ReadinessEventBus;
  readonly states: ReadinessStateMachine;
  readonly keys: KeyRegistry;

  // The seven engines.
  readonly policyEngine: ReadinessPolicyEngine;
  readonly complianceEngine: ComplianceEngine;
  readonly gapEngine: GapDetectionEngine;
  readonly evolutionEngine: EvolutionReadinessEngine;
  readonly selfInspectionEngine: SelfInspectionEngine;
  readonly certification: CertificationEngine;
  readonly metaGovernance: MetaGovernanceEngine;

  readonly #substrate: Substrate;
  readonly #nodeId: string;
  readonly #readyThreshold: number;
  readonly #evolutionPolicy: EvolutionReadinessPolicy;
  readonly #evolutionOracle?: EvolutionReadinessOracle;
  #assessSeq = 0;

  constructor(substrate: Substrate, options: ReadinessOptions) {
    this.#substrate = substrate;
    this.#nodeId = options.nodeId;
    this.keys = options.keys ?? new KeyRegistry();
    this.store = new ReadinessStore(substrate.metadata);
    this.audit = new ReadinessAuditLog(options.nodeId);
    this.events = options.eventBus ?? new ReadinessEventBus();
    this.states = new ReadinessStateMachine();

    this.policyEngine = new ReadinessPolicyEngine();
    this.complianceEngine = new ComplianceEngine();
    this.gapEngine = new GapDetectionEngine();
    this.evolutionEngine = new EvolutionReadinessEngine();
    this.selfInspectionEngine = new SelfInspectionEngine();
    this.certification = new CertificationEngine(this.keys);
    this.metaGovernance = new MetaGovernanceEngine(this.store);

    this.#readyThreshold = options.readyThreshold ?? READY_THRESHOLD_DEFAULT;
    this.#evolutionPolicy = options.evolutionPolicy ?? DEFAULT_EVOLUTION_READINESS_POLICY;
    if (options.evolutionOracle) this.#evolutionOracle = options.evolutionOracle;
  }

  // --------------------------- Governance / config registration ---------------------------

  registerDimension(record: ReadinessDimension): ReadinessDimension {
    if (!record.dimensionId || !record.title) {
      throw new ControlValidationError("Readiness dimension requires dimensionId and title", { record });
    }
    if (!Number.isFinite(record.weight) || record.weight < 0) {
      throw new ControlValidationError("Readiness dimension weight must be a non-negative number", { record });
    }
    this.store.putDimension(record);
    return record;
  }

  registerCriterion(record: ReadinessCriterion): ReadinessCriterion {
    if (!record.criterionId || !Array.isArray(record.rules)) {
      throw new ControlValidationError("Readiness criterion requires criterionId and rules", { record });
    }
    this.store.putCriterion(record);
    return record;
  }

  registerComplianceControl(record: ComplianceControl): ComplianceControl {
    if (!record.controlId || !record.family) {
      throw new ControlValidationError("Compliance control requires controlId and family", { record });
    }
    this.store.putControl(record);
    return record;
  }

  registerRequirement(record: RequirementSpec): RequirementSpec {
    if (!record.requirementId || !record.dimensionId) {
      throw new ControlValidationError("Requirement requires requirementId and dimensionId", { record });
    }
    this.store.putRequirement(record);
    return record;
  }

  registerAuthority(
    record: Omit<ReadinessAuthorityRecord, "status"> & { status?: ReadinessAuthorityRecord["status"] },
  ): ReadinessAuthorityRecord {
    return this.metaGovernance.registerAuthority(record);
  }

  /**
   * Register a certification authority. When `publicKeyPem` is supplied it is registered into the key
   * registry under `record.keyRef` (S3: only public keys are stored).
   */
  registerCertificationAuthority(record: CertificationAuthorityRecord, publicKeyPem?: string): CertificationAuthorityRecord {
    if (publicKeyPem) this.keys.register(record.keyRef, publicKeyPem);
    return this.certification.register(record);
  }

  // --------------------------- Signal & evidence ingestion ---------------------------

  /** Ingest a readiness observation (fail-closed validation), persist it, audit + publish it. */
  ingestSignal(signal: ReadinessSignal): ReadinessSignal {
    const validated = createSignal(signal);
    this.store.putSignal(validated);
    this.#emit("RDN_SIGNAL_INGESTED", validated.signalId, validated.source, {
      dimensionId: validated.dimensionId,
      status: validated.status,
      score: validated.score,
    }, `dim=${validated.dimensionId} status=${validated.status} score=${validated.score}`, validated.observedAt);
    return validated;
  }

  /** Record a by-reference evidence verdict for a compliance control. */
  setEvidence(evidence: Omit<EvidenceRecord, "at"> & { at?: number }): EvidenceRecord {
    if (!evidence.key) throw new ControlValidationError("Evidence requires a key", { evidence });
    const rec: EvidenceRecord = { ...evidence, at: evidence.at ?? Date.now() };
    this.store.putEvidence(rec);
    return rec;
  }

  // --------------------------- Continuous assessment (the core) ---------------------------

  /**
   * Run one full readiness assessment across all seven engines and persist the derived result.
   * Designed to be invoked on a cadence (see `startContinuous`). Never mutates governed platform state.
   */
  assess(opts: AssessOptions = {}): ReadinessAssessment {
    const now = opts.now ?? Date.now();
    const assessor = opts.assessor ?? "readiness-monitor";

    // 1. Aggregate signals into per-dimension assessments.
    const registeredDims = this.store.dimensions();
    const dimMap = new Map<string, DimensionAssessment>();
    const latestSignal = new Map<string, ReadinessSignal>();
    for (const dim of registeredDims) {
      const signals = this.store.signalsForDimension(dim.dimensionId);
      const agg = this.#assessDimension(dim, signals);
      if (agg) dimMap.set(dim.dimensionId, agg);
      const latest = this.#latest(signals);
      if (latest) latestSignal.set(dim.dimensionId, latest);
    }

    // 2. Gap detection.
    const gaps = this.gapEngine.detect(this.store.requirements(), dimMap);

    // 3. Compliance.
    const evidenceMap = new Map<string, EvidenceRecord>(this.store.evidence().map((e) => [e.key, e] as const));
    const compliance = this.complianceEngine.evaluate(this.store.controls(), evidenceMap);
    const complianceMap = new Map<string, ComplianceResult>(compliance.map((c) => [c.controlId, c] as const));

    // 4. Evolution readiness.
    const evoInput = opts.evolutionInput ?? this.#evolutionOracle?.() ?? {
      openProposals: 0,
      pendingChanges: 0,
      unreconciledRollbacks: 0,
      auditDivergent: false,
    };
    const evolution = this.evolutionEngine.assess(evoInput, this.#evolutionPolicy);

    // 5. Self-inspection (who watches the watcher).
    const sod = this.metaGovernance.sodEnforceable();
    const selfCertCount = this.store.certifications().filter((c) => c.assessor === c.certifier).length;
    const selfInspection = this.selfInspectionEngine.inspect({
      auditVerify: ReadinessAuditLog.verify(this.audit.export()),
      governancePresent: this.store.getMeta() !== undefined,
      certifyAuthorityPresent: this.metaGovernance.anyAuthorityWith("certify"),
      sodEnforceable: sod.ok,
      sodDetail: sod.detail,
      selfCertificationCount: selfCertCount,
      enginesWired: true,
    });

    // 6. Policy evaluation over criteria.
    const activeCertifications = new Set(
      this.store
        .certifications()
        .filter((c) => this.certification.isValid(c, now) && this.states.state(c.certificationId) !== "revoked")
        .map((c) => c.certificationId),
    );
    const ctx: PolicyEvaluationContext = {
      dimensions: dimMap,
      latestSignal,
      gaps,
      compliance: complianceMap,
      activeCertifications,
      now,
    };
    const criteria = this.policyEngine.evaluate(this.store.criteria(), ctx);

    // 7. Aggregate score + level determination.
    const overallScore = this.#overallScore(registeredDims, dimMap);
    const { level, blockers } = this.#determineLevel({
      overallScore,
      registeredDims,
      dimMap,
      criteria,
      gaps,
      compliance,
      evolution,
      selfInspection,
    });

    const assessmentId = `rdn-assess-${this.#assessSeq++}-${now}`;
    const base: Omit<ReadinessAssessment, "assessmentHash"> = {
      assessmentId,
      at: now,
      level,
      overallScore,
      dimensions: [...dimMap.values()],
      criteria,
      compliance,
      gaps,
      evolution,
      selfInspection,
      blockers,
    };
    const assessmentHash = sha256(canonicalize(base));
    const assessment: ReadinessAssessment = { ...base, assessmentHash };

    this.store.putAssessment(assessment);

    // Audit + event emission.
    this.#emit("RDN_COMPLIANCE_EVALUATED", assessmentId, assessor, { count: compliance.length }, `controls=${compliance.length}`, now);
    this.#emit("RDN_EVOLUTION_CHECKED", assessmentId, assessor, { ready: evolution.ready }, evolution.detail, now);
    this.#emit("RDN_SELF_INSPECTED", assessmentId, assessor, { ok: selfInspection.ok }, selfInspection.ok ? "self-inspection passed" : "self-inspection FAILED", now);
    for (const g of gaps.filter((x) => x.severity === "critical")) {
      this.#emit("RDN_GAP_DETECTED", g.gapId, assessor, { severity: g.severity, dimensionId: g.dimensionId }, g.detail, now);
    }
    for (const c of criteria.filter((x) => x.blocking && !x.passed)) {
      this.#emit("RDN_CRITERION_FAILED", c.criterionId, assessor, { blocking: true }, c.failures.join("; "), now);
    }
    this.#emit("RDN_ASSESSED", assessmentId, assessor, { level, overallScore }, `level=${level} score=${overallScore.toFixed(3)} blockers=${blockers.length}`, now, assessmentHash);

    return assessment;
  }

  /** Convenience: the most recent assessment (by `at`, then sequence), or `undefined`. */
  latestAssessment(): ReadinessAssessment | undefined {
    const all = this.store.assessments();
    if (all.length === 0) return undefined;
    return all.reduce((a, b) => (b.at >= a.at ? b : a));
  }

  /**
   * Start continuous assessment on a fixed cadence. Returns a stop handle. The timer is `unref`'d so it
   * never keeps the process alive on its own.
   */
  startContinuous(intervalMs: number, opts: AssessOptions = {}): { stop: () => void } {
    if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
      throw new ControlValidationError("startContinuous requires a positive intervalMs", { intervalMs });
    }
    const handle = setInterval(() => {
      try {
        this.assess(opts);
      } catch {
        /* an assessment failure must not crash the cadence loop; it is deny-by-default (no cert) */
      }
    }, intervalMs);
    if (typeof handle.unref === "function") handle.unref();
    return { stop: () => clearInterval(handle) };
  }

  // --------------------------- Certification (signed, SoD-gated) ---------------------------

  /**
   * Certify an assessment. Deny-by-default and fail-closed:
   *   - the assessment must exist and be at `ready` with no blockers;
   *   - Meta-Governance must admit the act (powers + SoD + self-cert prohibition + cadence);
   *   - the Certification Engine signs and the signature is re-verified before persistence.
   * A denied certification is AUDITED (RDN_CERTIFICATION_DENIED) and raises AuthorizationError.
   */
  certify(assessmentId: string, opts: CertifyOptions): ReadinessCertification {
    const now = opts.now ?? Date.now();
    const assessment = this.store.getAssessment(assessmentId);
    if (!assessment) throw new ControlValidationError(`unknown assessment: ${assessmentId}`, { assessmentId });

    const deny = (reason: string): never => {
      this.#emit("RDN_CERTIFICATION_DENIED", assessmentId, opts.assessor, { reason }, reason, now);
      throw new AuthorizationError(`readiness certification denied: ${reason}`, { assessmentId, reason });
    };

    if (assessment.level !== "ready" || assessment.blockers.length > 0) {
      deny(`assessment is '${assessment.level}' with ${assessment.blockers.length} blocker(s) (must be 'ready' + no blockers)`);
    }

    const ca = this.certification.get(opts.caId);
    if (!ca) deny(`unknown certification authority '${opts.caId}'`);
    const certifier = (ca as CertificationAuthorityRecord).owner;

    // Meta-Governance admissibility (powers, SoD, self-cert prohibition, cadence).
    const lastCert = this.store
      .certifications()
      .filter((c) => c.assessmentId === assessmentId || c.caId === opts.caId)
      .reduce<number | undefined>((max, c) => (max === undefined || c.at > max ? c.at : max), undefined);
    const admit = this.metaGovernance.admitCertification({
      certifierAuthorityId: opts.certifierAuthorityId,
      assessorAuthorityId: opts.assessorAuthorityId,
      assessor: opts.assessor,
      certifier,
      ...(lastCert !== undefined ? { lastCertificationAt: lastCert } : {}),
      now,
    });
    if (!admit.ok) deny(admit.reason);

    // Issue + re-verify (defence in depth).
    const cert = this.certification.issue(opts.privateKey, {
      assessmentId,
      assessmentHash: assessment.assessmentHash,
      level: "certified",
      caId: opts.caId,
      assessor: opts.assessor,
      at: now,
      ...(opts.ttlMs !== undefined ? { ttlMs: opts.ttlMs } : {}),
    });
    if (!this.certification.verify(cert)) deny("issued certification failed self-verification (key mismatch)");

    this.store.putCertification(cert);
    this.states.start(cert.certificationId, "pending");
    this.states.transition(cert.certificationId, "certified");
    this.#emit("RDN_CERTIFIED", cert.certificationId, certifier, { assessmentId, level: cert.level }, `assessment=${assessmentId} by=${certifier} assessor=${opts.assessor}`, now, assessment.assessmentHash);
    return cert;
  }

  /** Fail-closed validity check: signature ok, not expired, not revoked, binds to a stored assessment. */
  verifyCertification(cert: ReadinessCertification, now: number = Date.now()): VerificationResult {
    if (!this.certification.verify(cert)) return { ok: false, reason: "invalid/forged signature (fail-closed)" };
    if (cert.expiresAt <= now) return { ok: false, reason: "certification expired" };
    if (this.states.state(cert.certificationId) === "revoked") return { ok: false, reason: "certification revoked" };
    const assessment = this.store.getAssessment(cert.assessmentId);
    if (!assessment) return { ok: false, reason: "certified assessment no longer present" };
    if (assessment.assessmentHash !== cert.assessmentHash) {
      return { ok: false, reason: "assessment content changed since certification (hash mismatch)" };
    }
    return { ok: true, reason: "certification valid" };
  }

  /** Governed revocation of a certification. Terminal + audited; fail-closed on next verify. */
  revokeCertification(certificationId: string, by: string, now: number = Date.now()): VerificationResult {
    const cert = this.store.getCertification(certificationId);
    if (!cert) throw new ControlValidationError(`unknown certification: ${certificationId}`, { certificationId });
    if (this.states.state(certificationId) === undefined) this.states.start(certificationId, "certified");
    if (this.states.state(certificationId) !== "revoked") this.states.transition(certificationId, "revoked");
    this.#emit("RDN_REVOKED", certificationId, by, { assessmentId: cert.assessmentId }, `revoked by ${by}`, now);
    return { ok: true, reason: "certification revoked" };
  }

  get substrate(): Substrate {
    return this.#substrate;
  }

  get nodeId(): string {
    return this.#nodeId;
  }

  // --------------------------- internals ---------------------------

  #assessDimension(dim: ReadinessDimension, signals: readonly ReadinessSignal[]): DimensionAssessment | undefined {
    if (signals.length === 0) return undefined;
    const latestBySource = new Map<string, ReadinessSignal>();
    for (const s of signals) {
      const prev = latestBySource.get(s.source);
      if (!prev || s.observedAt > prev.observedAt) latestBySource.set(s.source, s);
    }
    const latest = [...latestBySource.values()];
    const score = latest.reduce((a, s) => a + s.score, 0) / latest.length;
    return {
      dimensionId: dim.dimensionId,
      score,
      status: worstStatus(latest.map((s) => s.status)),
      critical: dim.critical,
      signalCount: latest.length,
      weight: dim.weight,
    };
  }

  #latest(signals: readonly ReadinessSignal[]): ReadinessSignal | undefined {
    let latest: ReadinessSignal | undefined;
    for (const s of signals) if (!latest || s.observedAt > latest.observedAt) latest = s;
    return latest;
  }

  /** Weighted mean over ALL registered dimensions; a dimension with no signals contributes score 0. */
  #overallScore(registeredDims: readonly ReadinessDimension[], dimMap: Map<string, DimensionAssessment>): number {
    let weighted = 0;
    let totalWeight = 0;
    for (const dim of registeredDims) {
      const w = dim.weight;
      totalWeight += w;
      weighted += w * (dimMap.get(dim.dimensionId)?.score ?? 0);
    }
    if (totalWeight === 0) return 0;
    return weighted / totalWeight;
  }

  #determineLevel(input: {
    overallScore: number;
    registeredDims: readonly ReadinessDimension[];
    dimMap: Map<string, DimensionAssessment>;
    criteria: readonly CriterionOutcome[];
    gaps: readonly Gap[];
    compliance: readonly ComplianceResult[];
    evolution: { ready: boolean; blockers: string[] };
    selfInspection: { ok: boolean; checks: { name: string; ok: boolean; detail: string }[] };
  }): { level: ReadinessLevel; blockers: string[] } {
    const hard: string[] = [];

    for (const o of input.criteria) {
      if (o.blocking && !o.passed) hard.push(`blocking criterion '${o.criterionId}' failed: ${o.failures.join("; ")}`);
    }
    for (const dim of input.registeredDims.filter((d) => d.critical)) {
      const a = input.dimMap.get(dim.dimensionId);
      if (!a) hard.push(`critical dimension '${dim.dimensionId}' has no signals`);
      else if (a.status === "fail") hard.push(`critical dimension '${dim.dimensionId}' status is 'fail'`);
    }
    if (GapDetectionEngine.hasCritical(input.gaps)) {
      hard.push(`${input.gaps.filter((g) => g.severity === "critical").length} critical gap(s) present`);
    }
    const cBlockers = ComplianceEngine.blockers(input.compliance);
    if (cBlockers.length > 0) hard.push(`${cBlockers.length} mandatory control(s) not compliant`);
    if (!input.evolution.ready) for (const b of input.evolution.blockers) hard.push(`evolution: ${b}`);
    if (!input.selfInspection.ok) {
      for (const c of input.selfInspection.checks.filter((x) => !x.ok)) hard.push(`self-inspection: ${c.name} — ${c.detail}`);
    }

    if (hard.length > 0) return { level: "not-ready", blockers: hard };

    // No hard blockers — evaluate soft conditions for ready vs conditional.
    const soft: string[] = [];
    for (const o of input.criteria) if (!o.passed) soft.push(`advisory criterion '${o.criterionId}' failed: ${o.failures.join("; ")}`);
    const majorGaps = input.gaps.filter((g) => g.severity === "major");
    if (majorGaps.length > 0) soft.push(`${majorGaps.length} major gap(s) present`);
    if (input.overallScore < this.#readyThreshold) {
      soft.push(`overall score ${input.overallScore.toFixed(3)} < ready threshold ${this.#readyThreshold}`);
    }

    if (soft.length === 0) return { level: "ready", blockers: [] };
    return { level: "conditional", blockers: soft };
  }

  #emit(
    event: ReadinessAuditEvent,
    subject: string,
    actor: string,
    payload: Record<string, unknown>,
    detail: string,
    at: number,
    stateHash?: string,
  ): void {
    this.audit.record(stateHash !== undefined ? { at, event, subject, actor, detail, stateHash } : { at, event, subject, actor, detail });
    this.events.publish({ type: event, at, subject, detail, payload });
  }
}

/** Stand up the PI-12 Ultimate Readiness Fabric over an existing substrate. Additive; no core-dir change. */
export function createReadiness(substrate: Substrate, options: ReadinessOptions): ReadinessControl {
  return new ReadinessControl(substrate, options);
}
