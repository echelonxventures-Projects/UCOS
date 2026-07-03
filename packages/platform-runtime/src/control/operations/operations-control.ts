/**
 * UCOS Operational Proof Fabric — Control assembly + Evolution integration (OPF-ARCH-001 / B02).
 *
 * `OperationsControl` is the single controlled entry point for the fabric. It exposes:
 *
 *  - Real-time plane (no governed mutation): observe metrics/spans/logs, evaluate health/SLOs/alerts.
 *  - Proof plane (governed): `attest` a proof record and incident lifecycle mutations. The ONLY durable
 *    mutation path is `#persistViaEvolution`, which routes a put-metadata op through the ratified
 *    Evolution Fabric (snapshot -> atomic apply -> audited -> rollback-capable). There is NO direct
 *    store write and NO governor bypass. Operational governance (signed attestation + SoD seal) gates
 *    the commit; evolution provides atomic, audited persistence.
 *
 * Built additively over substrate + control + federation + evolution; reuses federation cryptography;
 * no substrate core dir is modified and no evolution/federation behavior is changed (reuse only).
 */

import type { Substrate } from "../../bootstrap.ts";
import { KeyRegistry, NonceCache, generateKeyPair } from "../federation/assertions.ts";
import type { PartitionMonitor } from "../federation/partition-handling.ts";
import { createEvolution, type EvolutionFabric } from "../evolution/evolution-apply-orchestrator.ts";
import { createUnit as createEvolutionUnit, unitHash as evolutionUnitHash } from "../evolution/evolution-unit.ts";
import { mintProposal as mintEvolutionProposal } from "../evolution/evolution-proposal.ts";
import type {
  AlertEvent,
  HealthRollup,
  IncidentRecord,
  IncidentState,
  LogEvent,
  MetricPoint,
  ProofAttestation,
  ProofBundle,
  ProofRecord,
  ProofSeal,
  SloResult,
  TraceSpan,
  VerificationResult,
} from "./types.ts";
import { OperationsRegistry } from "./operations-registry.ts";
import { TelemetryIngest } from "./telemetry-ingest.ts";
import { ObservabilityEngine } from "./observability-engine.ts";
import { HealthMonitor } from "./health-monitor.ts";
import { SloEvaluator } from "./slo-evaluator.ts";
import { AlertEngine } from "./alert-engine.ts";
import { IncidentTracker, type OpenIncidentInput } from "./incident-tracker.ts";
import { ProofAttestationAuthority, ProofSealAuthority } from "./proof-authority.ts";
import { OperationsRevocationAuthority, type RevocableOperationsKind } from "./operations-revocation-authority.ts";
import { OperationsStore } from "./operations-store.ts";
import { OperationsQueryEngine } from "./operations-query-engine.ts";
import { OperationsSnapshot } from "./operations-snapshot.ts";
import { OperationsFederationGuard } from "./operations-federation-guard.ts";
import { OperationsAuditLog } from "./operations-audit-log.ts";
import { unitHash } from "./proof-unit.ts";
import { AuthorizationError, ControlValidationError } from "../errors.ts";

export interface OperationsOptions {
  nodeId: string;
  keys?: KeyRegistry;
  nonces?: NonceCache;
  partition?: PartitionMonitor;
}

export interface AttestOptions {
  /** Signed attestation gating a commit to `attested`/`sealed` (verified before persistence). */
  attestation?: ProofAttestation;
  /** Signed seal (SoD) gating a commit to `sealed`. */
  seal?: ProofSeal;
  actor?: string;
  now?: number;
}

// Internal evolution "system" principals — distinct ids satisfy evolution SoD while sharing one key.
const SYS_PROPOSER = "operations-sys-proposer";
const SYS_APPROVER = "operations-sys-approver";
const SYS_CERTIFIER = "operations-sys-certifier";
const SYS_RATIFIER = "operations-sys-ratifier";
const SYS_KEYREF = "operations-system";

export class OperationsControl {
  readonly registry: OperationsRegistry;
  readonly ingest: TelemetryIngest;
  readonly observability: ObservabilityEngine;
  readonly health: HealthMonitor;
  readonly slos: SloEvaluator;
  readonly alerts: AlertEngine;
  readonly incidents: IncidentTracker;
  readonly attestations: ProofAttestationAuthority;
  readonly seals: ProofSealAuthority;
  readonly revocations: OperationsRevocationAuthority;
  readonly store: OperationsStore;
  readonly queryEngine: OperationsQueryEngine;
  readonly snapshots: OperationsSnapshot;
  readonly federationGuard: OperationsFederationGuard;
  readonly audit: OperationsAuditLog;
  readonly keys: KeyRegistry;
  readonly nonces: NonceCache;
  readonly evolution: EvolutionFabric;

  readonly #substrate: Substrate;
  readonly #sysKey: import("node:crypto").KeyObject;
  #evoSeq = 0;

  constructor(substrate: Substrate, options: OperationsOptions) {
    this.#substrate = substrate;
    const metadata = substrate.metadata;
    this.keys = options.keys ?? new KeyRegistry();
    this.nonces = options.nonces ?? new NonceCache();

    this.registry = new OperationsRegistry(metadata);
    this.ingest = new TelemetryIngest(this.registry);
    this.observability = new ObservabilityEngine(this.ingest, this.registry);
    this.health = new HealthMonitor(this.registry, this.ingest.metrics);
    this.slos = new SloEvaluator(this.registry, this.ingest.metrics);
    this.alerts = new AlertEngine(this.registry, this.ingest.metrics);
    this.incidents = new IncidentTracker();
    this.attestations = new ProofAttestationAuthority(metadata, this.keys);
    this.seals = new ProofSealAuthority(metadata, this.keys);
    this.revocations = new OperationsRevocationAuthority(metadata, options.partition);
    this.store = new OperationsStore(metadata);
    this.queryEngine = new OperationsQueryEngine(this.store, this.revocations);
    this.snapshots = new OperationsSnapshot(this.store);
    this.federationGuard = new OperationsFederationGuard(this.keys, this.registry, this.store, options.partition);
    this.audit = new OperationsAuditLog(options.nodeId);

    // Evolution fabric is the SOLE durable mutation mechanism; allowlist the operations namespace.
    this.evolution = createEvolution(substrate, {
      nodeId: options.nodeId,
      evolvableAllowlist: ["operations:"],
      keys: this.keys,
      ...(options.partition ? { partition: options.partition } : {}),
    });

    const sys = generateKeyPair();
    this.#sysKey = sys.privateKey;
    this.keys.register(SYS_KEYREF, sys.publicKeyPem);
    this.evolution.certifications.register({ caId: "operations-evo-ca", owner: SYS_CERTIFIER, keyRef: SYS_KEYREF });
    this.evolution.ratifications.register({ raId: "operations-evo-ra", owner: SYS_RATIFIER, keyRef: SYS_KEYREF, quorum: 1 });
  }

  // ------------------------------ Real-time plane (ephemeral; no governed mutation) ------------------------------

  observeMetric(point: MetricPoint): boolean {
    return this.ingest.ingestMetric(point);
  }

  observeMetrics(points: readonly MetricPoint[]): number {
    return this.ingest.ingestMetrics(points);
  }

  observeSpan(span: TraceSpan): boolean {
    return this.ingest.ingestSpan(span);
  }

  observeLog(log: LogEvent): boolean {
    return this.ingest.ingestLog(log);
  }

  evaluateHealth(tenantId: string, now: number = Date.now()): HealthRollup {
    const rollup = this.health.evaluateTenant(tenantId, now);
    this.audit.record({ at: now, event: "OPS_HEALTH_CHANGED", tenantId, subject: tenantId, actor: "health-monitor", detail: `state=${rollup.state} checks=${rollup.checks.length}` });
    return rollup;
  }

  evaluateSlos(tenantId: string, now: number = Date.now()): SloResult[] {
    const results = this.slos.evaluateTenant(tenantId, now);
    for (const r of results) {
      if (!r.compliant) {
        this.audit.record({ at: now, event: "OPS_SLO_BREACH", tenantId, subject: r.sloId, actor: "slo-evaluator", detail: `observed=${r.observed} objective=${r.objective} budgetRemaining=${r.budgetRemaining.toFixed(4)}` });
      }
    }
    return results;
  }

  /**
   * Evaluate alert rules; audit each phase change. Rules flagged `autoIncident` that just fired open a
   * governed incident (persisted via evolution). Returns the phase-change events and any opened incidents.
   */
  async evaluateAlerts(tenantId: string, now: number = Date.now()): Promise<{ events: AlertEvent[]; opened: IncidentRecord[] }> {
    const events = this.alerts.evaluateTenant(tenantId, now);
    const opened: IncidentRecord[] = [];
    for (const ev of events) {
      const event = ev.phase === "firing" ? "OPS_ALERT_FIRED" : "OPS_ALERT_RESOLVED";
      this.audit.record({ at: now, event, tenantId, subject: ev.ruleId, actor: "alert-engine", detail: ev.reason });
      if (ev.phase === "firing") {
        const rule = this.alerts.rule(tenantId, ev.ruleId);
        if (rule?.autoIncident) {
          const incident = await this.openIncident({
            incidentId: `inc-${ev.ruleId}-${now}`,
            tenantId,
            title: `Alert ${ev.ruleId} firing (${ev.severity})`,
            severity: ev.severity,
            actor: "alert-engine",
            linkedAlerts: [ev.alertId],
            note: ev.reason,
            now,
          });
          opened.push(incident);
        }
      }
    }
    return { events, opened };
  }

  // ------------------------------ Proof plane (governed; evolution-backed) ------------------------------

  /**
   * Governed proof commit. Verifies the target tenant is active, then (for `attested`/`sealed`)
   * verifies the signed attestation and (for `sealed`) the SoD seal, before persisting the record
   * atomically via the Evolution Fabric. Fail-closed: any gate failure aborts before persistence.
   */
  async attest(record: ProofRecord, opts: AttestOptions = {}): Promise<{ ok: true; unitHash: string; evolutionUnitHash: string }> {
    const now = opts.now ?? Date.now();
    const uh = record.unitHash;
    if (uh !== unitHash(record.unit)) throw new ControlValidationError("record unitHash mismatch (unit tampered)", { uh });
    if (!this.registry.isTenantActive(record.tenantId)) {
      throw new AuthorizationError(`tenant "${record.tenantId}" is unknown/suspended (deny-by-default)`, { tenantId: record.tenantId });
    }
    if (record.unit.tenantId !== record.tenantId) {
      throw new ControlValidationError("proof record/unit tenant mismatch", { uh });
    }

    if (record.state === "attested" || record.state === "sealed") {
      if (!opts.attestation || !this.attestations.verify(opts.attestation, { now }).ok) {
        throw new AuthorizationError("commit to attested/sealed requires a valid proof attestation", { uh });
      }
      if (opts.attestation.unitHash !== uh) throw new AuthorizationError("attestation unitHash mismatch", { uh });
    }
    if (record.state === "sealed") {
      if (!opts.seal || !this.seals.verify(opts.seal, { now }).ok) {
        throw new AuthorizationError("commit to sealed requires a valid seal (SoD)", { uh });
      }
      if (opts.seal.unitHash !== uh || (opts.attestation && opts.seal.attestationId !== opts.attestation.attestationId)) {
        throw new AuthorizationError("seal does not match attestation/unit", { uh });
      }
    }

    const write = OperationsStore.proofEvolutionWrite(record);
    const evoUnitHash = await this.#persistViaEvolution(write.key, write.value, now);

    const stateHash = this.snapshots.capture(record.tenantId).stateHash;
    const event = record.state === "sealed" ? "OPS_PROOF_SEALED" : "OPS_PROOF_ATTESTED";
    this.audit.record({ at: now, event, tenantId: record.tenantId, subject: record.proofId, actor: opts.actor ?? record.source.kind, detail: `kind=${record.kind} state=${record.state} v=${record.version}`, stateHash });
    return { ok: true, unitHash: uh, evolutionUnitHash: evoUnitHash };
  }

  /** Open a governed incident (persisted via evolution). */
  async openIncident(input: OpenIncidentInput): Promise<IncidentRecord> {
    if (!this.registry.isTenantActive(input.tenantId)) {
      throw new AuthorizationError(`tenant "${input.tenantId}" is unknown/suspended (deny-by-default)`, { tenantId: input.tenantId });
    }
    const now = input.now ?? Date.now();
    const record = this.incidents.open(input);
    const write = OperationsStore.incidentEvolutionWrite(record);
    await this.#persistViaEvolution(write.key, write.value, now);
    const stateHash = this.snapshots.capture(record.tenantId).stateHash;
    this.audit.record({ at: now, event: "OPS_INCIDENT_OPENED", tenantId: record.tenantId, subject: record.incidentId, actor: input.actor, detail: `severity=${record.severity} title=${record.title}`, stateHash });
    return record;
  }

  /** Transition a governed incident (persisted via evolution). */
  async transitionIncident(
    tenantId: string,
    incidentId: string,
    to: IncidentState,
    actor: string,
    opts: { note?: string; linkAlert?: string; linkEvidence?: string; now?: number } = {},
  ): Promise<IncidentRecord> {
    if (!this.registry.isTenantActive(tenantId)) {
      throw new AuthorizationError(`tenant "${tenantId}" is unknown/suspended (deny-by-default)`, { tenantId });
    }
    const now = opts.now ?? Date.now();
    const record = this.incidents.transition(incidentId, to, actor, opts);
    const write = OperationsStore.incidentEvolutionWrite(record);
    await this.#persistViaEvolution(write.key, write.value, now);
    const stateHash = this.snapshots.capture(tenantId).stateHash;
    const event = to === "closed" ? "OPS_INCIDENT_CLOSED" : "OPS_INCIDENT_TRANSITIONED";
    this.audit.record({ at: now, event, tenantId, subject: incidentId, actor, detail: `state=${to} v=${record.version}`, stateHash });
    return record;
  }

  /** Verify an inbound proof bundle then persist via evolution (fail-closed). Distributed proof exchange. */
  async importBundle(bundle: ProofBundle, opts: { now?: number } = {}): Promise<VerificationResult> {
    const now = opts.now ?? Date.now();
    const inbound = this.federationGuard.verifyInbound(bundle, now);
    if (!inbound.ok) return inbound;
    if (!this.federationGuard.mayOverrideLocal(bundle.record)) {
      return { ok: false, reason: "local sovereignty: foreign proof cannot override a local sealed proof" };
    }
    const clamped = this.federationGuard.clampTrust(bundle.record);
    const record: ProofRecord = { ...bundle.record, trustLevel: clamped };
    const write = OperationsStore.proofEvolutionWrite(record);
    await this.#persistViaEvolution(write.key, write.value, now);
    this.audit.record({ at: now, event: "OPS_PROOF_EXCHANGED", tenantId: record.tenantId, subject: record.proofId, actor: bundle.issuer, detail: `clampedTrust=${clamped}` });
    return { ok: true, reason: "bundle imported (trust-clamped, persisted via evolution)" };
  }

  /** Revoke a proof/incident/attestation/seal/authority (fail-closed on next resolution). */
  revoke(kind: RevocableOperationsKind, id: string, by: string, tenantId = "-"): void {
    this.revocations.revoke(kind, id, by);
    this.audit.record({ at: Date.now(), event: "OPS_REVOKED", tenantId, subject: id, actor: by, detail: `${kind}:${id}` });
  }

  get substrate(): Substrate {
    return this.#substrate;
  }

  /** Drive an evolution unit (put-metadata) through the full evolution lifecycle and apply it. */
  async #persistViaEvolution(key: string, value: unknown, now: number): Promise<string> {
    const seq = this.#evoSeq++;
    const evoUnit = createEvolutionUnit({
      unitId: `ops-persist-${seq}-${now}`,
      title: `persist ${key}`,
      changeClass: "routine",
      targets: [{ kind: "metadata", keyPrefix: key }],
      ops: [{ op: "put-metadata", key, value }],
    });
    const evoUnitHash = evolutionUnitHash(evoUnit);
    const proposal = mintEvolutionProposal(this.#sysKey, {
      proposalId: `ops-prop-${seq}`,
      unit: evoUnit,
      proposer: SYS_PROPOSER,
      proposerKeyRef: SYS_KEYREF,
    });
    this.evolution.orchestrator.submit(proposal, now);
    this.evolution.orchestrator.approve(evoUnitHash, SYS_APPROVER);
    const cert = this.evolution.certifications.issue(this.#sysKey, { unitHash: evoUnitHash, caId: "operations-evo-ca" });
    this.evolution.orchestrator.recordCertification(cert, now);
    const rat = this.evolution.ratifications.issue(this.#sysKey, {
      unitHash: evoUnitHash,
      raId: "operations-evo-ra",
      proposer: SYS_PROPOSER,
      certifier: SYS_CERTIFIER,
      approvals: [SYS_APPROVER],
      certificationId: cert.certificationId,
    });
    this.evolution.orchestrator.ratify(rat, now);
    const result = await this.evolution.orchestrator.apply(evoUnitHash, { now, actor: SYS_PROPOSER });
    if (result.status !== "applied") {
      throw new ControlValidationError(`operational proof persistence rolled back (fail-closed): ${result.reason}`, { key });
    }
    return evoUnitHash;
  }
}

/** Stand up the B02 operational proof fabric over an existing substrate. Additive; no core-dir modification. */
export function createOperations(substrate: Substrate, options: OperationsOptions): OperationsControl {
  return new OperationsControl(substrate, options);
}
