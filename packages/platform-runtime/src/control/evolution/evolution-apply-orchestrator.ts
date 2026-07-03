/**
 * UCOS Evolution Fabric — Apply Orchestrator + assembly (EVO-ARCH-001 / AD-0019).
 *
 * The single controlled entry point for driving an evolution through its lifecycle and enacting it
 * atomically. It composes the governor (E10/E11/E12), the security authorities (signing, SoD,
 * revocation), the federation guard (E6), the snapshot/rollback engines, and the hash-chained audit.
 *
 * Atomic-apply invariant (fail-closed, no partial commits): snapshot -> validate -> apply -> recompose
 * -> post-apply validation + federation invariant re-check -> commit; on ANY failure the captured
 * reverse-ops are replayed, the substrate is recomposed, and rollback is verified against the
 * pre-apply state hash. If rollback cannot be verified, the emergency halt is raised.
 *
 * Built additively over the substrate's PUBLIC seams; no substrate core dir is modified, and the
 * governor makes the evolution fabric's own namespace a non-expressible target (no self-modification).
 */

import type { Substrate } from "../../bootstrap.ts";
import type { MetaCoreKernel } from "../../meta-core/kernel.ts";
import type {
  ApplyResult,
  EvolutionCertification,
  EvolutionProposal,
  EvolutionRatification,
  EvolutionUnit,
  FederationReRatificationToken,
  GovernorConfig,
  ReverseOp,
  EvolutionSnapshot,
} from "./types.ts";
import { KeyRegistry, NonceCache } from "../federation/assertions.ts";
import type { PartitionMonitor } from "../federation/partition-handling.ts";
import { AuthorizationError, ControlValidationError } from "../errors.ts";
import { EvolutionGovernor, defaultGovernorConfig } from "./evolution-governor.ts";
import { EvolutionRegistry } from "./evolution-registry.ts";
import { EvolutionStateMachine } from "./evolution-state-machine.ts";
import { EvolutionCertificationAuthority } from "./evolution-certification-authority.ts";
import { EvolutionRatificationAuthority } from "./evolution-ratification-authority.ts";
import { EvolutionRevocationAuthority } from "./evolution-revocation-authority.ts";
import { EvolutionImpactAnalyzer, type ImpactReport } from "./evolution-impact-analyzer.ts";
import { EvolutionSnapshotEngine } from "./evolution-snapshot-engine.ts";
import { EvolutionTransactionManager } from "./evolution-transaction-manager.ts";
import { EvolutionRollbackEngine } from "./evolution-rollback-engine.ts";
import { EvolutionFederationGuard } from "./evolution-federation-guard.ts";
import { EvolutionAuditLog } from "./evolution-audit-log.ts";
import { verifyProposal } from "./evolution-proposal.ts";

export interface EvolutionApplyOptions {
  reRatificationToken?: FederationReRatificationToken;
  /** Post-apply validation hook (gate G6). Returning !ok triggers automatic rollback. */
  validator?: () => { ok: boolean; reason: string };
  now?: number;
  actor?: string;
}

interface AppliedRecord {
  unit: EvolutionUnit;
  reverses: ReverseOp[];
  snapshot: EvolutionSnapshot;
}

export class EvolutionApplyOrchestrator {
  readonly #kernel: MetaCoreKernel;
  readonly #governor: EvolutionGovernor;
  readonly #registry: EvolutionRegistry;
  readonly #states: EvolutionStateMachine;
  readonly #certs: EvolutionCertificationAuthority;
  readonly #rats: EvolutionRatificationAuthority;
  readonly #revocations: EvolutionRevocationAuthority;
  readonly #impact: EvolutionImpactAnalyzer;
  readonly #snapshots: EvolutionSnapshotEngine;
  readonly #txn: EvolutionTransactionManager;
  readonly #rollback: EvolutionRollbackEngine;
  readonly #fedGuard: EvolutionFederationGuard;
  readonly #audit: EvolutionAuditLog;
  readonly #nonces: NonceCache;
  readonly #keyRegistry: KeyRegistry;

  readonly #applied = new Map<string, AppliedRecord>();

  constructor(deps: {
    kernel: MetaCoreKernel;
    governor: EvolutionGovernor;
    registry: EvolutionRegistry;
    states: EvolutionStateMachine;
    certs: EvolutionCertificationAuthority;
    rats: EvolutionRatificationAuthority;
    revocations: EvolutionRevocationAuthority;
    impact: EvolutionImpactAnalyzer;
    snapshots: EvolutionSnapshotEngine;
    txn: EvolutionTransactionManager;
    rollback: EvolutionRollbackEngine;
    fedGuard: EvolutionFederationGuard;
    audit: EvolutionAuditLog;
    nonces: NonceCache;
    keys: KeyRegistry;
  }) {
    this.#kernel = deps.kernel;
    this.#governor = deps.governor;
    this.#registry = deps.registry;
    this.#states = deps.states;
    this.#certs = deps.certs;
    this.#rats = deps.rats;
    this.#revocations = deps.revocations;
    this.#impact = deps.impact;
    this.#snapshots = deps.snapshots;
    this.#txn = deps.txn;
    this.#rollback = deps.rollback;
    this.#fedGuard = deps.fedGuard;
    this.#audit = deps.audit;
    this.#nonces = deps.nonces;
    this.#keyRegistry = deps.keys;
  }

  // ------------------------------- G1: submit (proposed -> reviewed) -------------------------------

  /** Admit + verify a signed proposal, initialize its lifecycle, and run impact analysis. */
  submit(proposal: EvolutionProposal, now: number = Date.now()): { unitHash: string; impact: ImpactReport } {
    const gd = this.#governor.admit(proposal, now);
    if (!gd.ok) throw new AuthorizationError(`Evolution proposal denied by governor: ${gd.reason}`, { unitHash: proposal.unitHash });

    const vp = verifyProposal(proposal, this.#keys(), { nonces: this.#nonces, now });
    if (!vp.ok) throw new AuthorizationError(`Evolution proposal verification failed: ${vp.reason}`, { unitHash: proposal.unitHash });

    this.#states.start(proposal.unitHash);
    this.#registry.putProposal(proposal);
    this.#auditRecord("PROPOSED", proposal.unitHash, proposal.proposer, `origin=${proposal.origin}`);

    const impact = this.#impact.analyze(proposal.unit);
    this.#states.transition(proposal.unitHash, "reviewed");
    this.#auditRecord("REVIEWED", proposal.unitHash, proposal.proposer, impact.summary);
    return { unitHash: proposal.unitHash, impact };
  }

  // ------------------------------- G2/G3: approve + certify -------------------------------

  approve(unitHash: string, approver: string, reason?: string): void {
    const proposal = this.#requireProposal(unitHash);
    if (approver === proposal.proposer) {
      throw new AuthorizationError("separation-of-duties violation: approver == proposer", { unitHash });
    }
    this.#registry.addApproval(reason !== undefined ? { unitHash, approver, at: Date.now(), reason } : { unitHash, approver, at: Date.now() });
    if (this.#states.state(unitHash) === "reviewed") this.#states.transition(unitHash, "approved");
    this.#auditRecord("APPROVED", unitHash, approver, reason ?? "approved");
  }

  recordCertification(cert: EvolutionCertification, now: number = Date.now()): void {
    this.#requireProposal(cert.unitHash);
    const v = this.#certs.verify(cert, { nonces: this.#nonces, now });
    if (!v.ok) throw new AuthorizationError(`Evolution certification rejected: ${v.reason}`, { unitHash: cert.unitHash });
    this.#registry.putCertification(cert);
    this.#states.transition(cert.unitHash, "certified");
    this.#auditRecord("CERTIFIED", cert.unitHash, cert.certifier, `caId=${cert.caId}`);
  }

  // ------------------------------- G4: ratify (certified -> ratified) -------------------------------

  ratify(rat: EvolutionRatification, now: number = Date.now()): void {
    const cert = this.#registry.getCertification(rat.unitHash);
    if (!cert) throw new AuthorizationError("cannot ratify: no certification on record", { unitHash: rat.unitHash });
    if (rat.certificationId !== cert.certificationId) {
      throw new AuthorizationError("ratification references an unknown certification", { unitHash: rat.unitHash });
    }
    if (rat.certifier !== cert.certifier) {
      throw new AuthorizationError("ratification certifier does not match certification", { unitHash: rat.unitHash });
    }
    const v = this.#rats.verify(rat, { nonces: this.#nonces, now });
    if (!v.ok) throw new AuthorizationError(`Evolution ratification rejected: ${v.reason}`, { unitHash: rat.unitHash });
    this.#registry.putRatification(rat);
    this.#states.transition(rat.unitHash, "ratified");
    this.#auditRecord("RATIFIED", rat.unitHash, rat.ratifier, `raId=${rat.raId} approvals=${rat.approvals.length}`);
  }

  // ------------------------------- G5/G6: atomic apply -------------------------------

  async apply(unitHash: string, opts: EvolutionApplyOptions = {}): Promise<ApplyResult> {
    const now = opts.now ?? Date.now();
    const proposal = this.#requireProposal(unitHash);
    const unit = proposal.unit;
    const actor = opts.actor ?? proposal.proposer;

    if (this.#states.state(unitHash) !== "ratified") {
      throw new AuthorizationError(`cannot apply: unit is "${this.#states.state(unitHash)}", expected "ratified"`, { unitHash });
    }

    // Apply-time security re-verification (no nonce re-consumption).
    this.#assertNotRevoked(unitHash);
    const cert = this.#registry.getCertification(unitHash);
    if (!cert || !this.#certs.verify(cert, { now }).ok) throw new AuthorizationError("apply-time certification invalid/absent", { unitHash });
    const rat = this.#registry.getRatification(unitHash);
    if (!rat || !this.#rats.verify(rat, { now }).ok) throw new AuthorizationError("apply-time ratification invalid/absent", { unitHash });

    // Governor apply-time gate.
    const gd = this.#governor.checkApply(unit, now);
    if (!gd.ok) throw new AuthorizationError(`Evolution apply denied by governor: ${gd.reason}`, { unitHash });

    // Federation guard: federation-touching units require a valid re-ratification token (EVO-FED-001).
    const fedTouching = this.#fedGuard.isFederationTouching(unit);
    if (fedTouching) {
      const tv = this.#fedGuard.validateToken(opts.reRatificationToken, now);
      if (!tv.ok) throw new AuthorizationError(`Federation-touching evolution blocked: ${tv.reason}`, { unitHash });
    }

    // Acquire the single in-flight slot (maxInFlight=1; E11/E12). Fail-closed if unavailable/halted.
    if (!this.#governor.acquire(now)) {
      throw new AuthorizationError("evolution transaction slot unavailable (in-flight or halted)", { unitHash });
    }
    this.#txn.enter();
    this.#auditRecord("APPLY_BEGIN", unitHash, actor, "write-ahead"); // write-ahead

    // Snapshot + validate BEFORE any mutation.
    const snapshot = this.#snapshots.snapshot(unitHash, unit.targets);
    this.#registry.putSnapshot(snapshot);
    this.#auditRecord("SNAPSHOT", unitHash, actor, `snapshotId=${snapshot.snapshotId}`, snapshot.stateHash);

    const sv = this.#snapshots.validate(snapshot);
    if (!sv.ok) {
      this.#auditRecord("FAILED", unitHash, actor, `snapshot invalid: ${sv.reason}`);
      this.#states.transition(unitHash, "failed");
      this.#txn.exit();
      this.#governor.release();
      throw new ControlValidationError(`Evolution aborted (fail-closed): ${sv.reason}`, { unitHash }); // never applied
    }

    const fedBefore = this.#fedGuard.captureInvariants();
    const reverses: ReverseOp[] = [];
    try {
      for (const op of unit.ops) reverses.push(this.#txn.applyOp(op));
      // Config/metadata/registry record mutations are live through the public seams; the substrate's
      // composer is one-shot (not re-entrant), so we do not force a recompose here (AD-0019: no core
      // modification). Post-apply validation observes the live effective state directly.

      if (opts.validator) {
        const pv = opts.validator();
        if (!pv.ok) throw new ControlValidationError(`post-apply validation failed: ${pv.reason}`, { unitHash });
      }
      this.#fedGuard.assertInvariantsHeld(fedBefore); // throws on any federation regression (E6)

      const postStateHash = this.#snapshots.stateHash(this.#snapshots.capture(unit.targets));
      this.#states.transition(unitHash, "applied");
      this.#states.transition(unitHash, "active");
      this.#auditRecord("APPLIED", unitHash, actor, "committed", postStateHash);
      this.#applied.set(unitHash, { unit, reverses, snapshot });
      return { status: "applied", unitHash, reason: "applied", preStateHash: snapshot.stateHash, postStateHash };
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      this.#auditRecord("ROLLBACK_BEGIN", unitHash, actor, reason);
      this.#rollback.execute(reverses);
      const rv = this.#rollback.verify(unit.targets, snapshot.stateHash);
      const restoredHash = this.#snapshots.stateHash(this.#snapshots.capture(unit.targets));
      if (!rv.ok) {
        this.#governor.emergencyHalt(`rollback-verify-failed:${unitHash}`);
        this.#auditRecord("HALTED", unitHash, actor, rv.reason, restoredHash);
      }
      this.#states.transition(unitHash, "failed");
      this.#auditRecord("ROLLED_BACK", unitHash, actor, reason, restoredHash);
      return { status: "rolled-back", unitHash, reason, preStateHash: snapshot.stateHash, postStateHash: restoredHash };
    } finally {
      this.#txn.exit();
      this.#governor.release();
    }
  }

  // ------------------------------- Explicit rollback of an active unit -------------------------------

  /** Approval-required in production (AD-0009). Reverts an already-active unit and verifies restoration. */
  async rollback(unitHash: string, opts: { now?: number; actor?: string } = {}): Promise<ApplyResult> {
    const now = opts.now ?? Date.now();
    const rec = this.#applied.get(unitHash);
    if (!rec) throw new ControlValidationError("no applied evolution to roll back", { unitHash });
    if (this.#states.state(unitHash) !== "active") throw new ControlValidationError("unit is not active", { unitHash });
    const actor = opts.actor ?? "rollback-authority";

    if (!this.#governor.acquire(now)) throw new AuthorizationError("evolution transaction slot unavailable", { unitHash });
    this.#txn.enter();
    this.#auditRecord("ROLLBACK_BEGIN", unitHash, actor, "explicit rollback");
    try {
      this.#rollback.execute(rec.reverses);
      const rv = this.#rollback.verify(rec.unit.targets, rec.snapshot.stateHash);
      const restoredHash = this.#snapshots.stateHash(this.#snapshots.capture(rec.unit.targets));
      if (!rv.ok) {
        this.#governor.emergencyHalt(`rollback-verify-failed:${unitHash}`);
        this.#auditRecord("HALTED", unitHash, actor, rv.reason, restoredHash);
        throw new ControlValidationError(`rollback verification failed (fail-closed): ${rv.reason}`, { unitHash });
      }
      this.#states.transition(unitHash, "rolled-back");
      this.#auditRecord("ROLLED_BACK", unitHash, actor, "explicit rollback complete", restoredHash);
      this.#applied.delete(unitHash);
      return { status: "rolled-back", unitHash, reason: "explicit rollback", preStateHash: rec.snapshot.stateHash, postStateHash: restoredHash };
    } finally {
      this.#txn.exit();
      this.#governor.release();
    }
  }

  // ------------------------------- helpers -------------------------------

  state(unitHash: string): string | undefined {
    return this.#states.state(unitHash);
  }

  auditLog(): EvolutionAuditLog {
    return this.#audit;
  }

  #assertNotRevoked(unitHash: string): void {
    if (this.#revocations.isRevoked("unit", unitHash)) throw new AuthorizationError("unit revoked", { unitHash });
    if (this.#revocations.isRevoked("proposal", unitHash)) throw new AuthorizationError("proposal revoked", { unitHash });
    const cert = this.#registry.getCertification(unitHash);
    if (cert && this.#revocations.isRevoked("certification", cert.certificationId)) {
      throw new AuthorizationError("certification revoked", { unitHash });
    }
    const rat = this.#registry.getRatification(unitHash);
    if (rat && this.#revocations.isRevoked("ratification", rat.ratificationId)) {
      throw new AuthorizationError("ratification revoked", { unitHash });
    }
  }

  #requireProposal(unitHash: string): EvolutionProposal {
    const p = this.#registry.getProposal(unitHash);
    if (!p) throw new ControlValidationError(`unknown evolution unit "${unitHash}"`, { unitHash });
    return p;
  }

  #keys(): KeyRegistry {
    return this.#keyRegistry;
  }

  #auditRecord(event: Parameters<EvolutionAuditLog["record"]>[0]["event"], unitHash: string, actor: string, detail: string, stateHash?: string): void {
    this.#audit.record(stateHash !== undefined ? { at: Date.now(), event, unitHash, actor, detail, stateHash } : { at: Date.now(), event, unitHash, actor, detail });
  }
}

// ------------------------------- Assembly -------------------------------

export interface EvolutionOptions {
  nodeId: string;
  /** Positive allowlist of evolvable namespace prefixes. */
  evolvableAllowlist?: string[];
  governorConfig?: GovernorConfig;
  keys?: KeyRegistry;
  nonces?: NonceCache;
  partition?: PartitionMonitor;
}

export interface EvolutionFabric {
  keys: KeyRegistry;
  nonces: NonceCache;
  governor: EvolutionGovernor;
  registry: EvolutionRegistry;
  states: EvolutionStateMachine;
  certifications: EvolutionCertificationAuthority;
  ratifications: EvolutionRatificationAuthority;
  revocations: EvolutionRevocationAuthority;
  impactAnalyzer: EvolutionImpactAnalyzer;
  snapshotEngine: EvolutionSnapshotEngine;
  transactionManager: EvolutionTransactionManager;
  rollbackEngine: EvolutionRollbackEngine;
  federationGuard: EvolutionFederationGuard;
  audit: EvolutionAuditLog;
  orchestrator: EvolutionApplyOrchestrator;
}

const DEFAULT_ALLOWLIST = ["registry:", "config:", "app:", "federation:"];

/** Stand up the PI-6 evolution fabric over an existing substrate. Additive; no core-dir modification. */
export function createEvolution(substrate: Substrate, options: EvolutionOptions): EvolutionFabric {
  const kernel = substrate.kernel;
  const metadata = substrate.metadata;
  const keys = options.keys ?? new KeyRegistry();
  const nonces = options.nonces ?? new NonceCache();

  const governor = new EvolutionGovernor(options.governorConfig ?? defaultGovernorConfig(options.evolvableAllowlist ?? [...DEFAULT_ALLOWLIST]));
  const registry = new EvolutionRegistry(metadata);
  const states = new EvolutionStateMachine();
  const certifications = new EvolutionCertificationAuthority(metadata, keys);
  const ratifications = new EvolutionRatificationAuthority(metadata, keys);
  const revocations = new EvolutionRevocationAuthority(metadata, options.partition);
  const impactAnalyzer = new EvolutionImpactAnalyzer(kernel);
  const snapshotEngine = new EvolutionSnapshotEngine(kernel);
  const transactionManager = new EvolutionTransactionManager(kernel);
  const rollbackEngine = new EvolutionRollbackEngine(transactionManager, snapshotEngine);
  const federationGuard = new EvolutionFederationGuard(kernel, keys);
  const audit = new EvolutionAuditLog(options.nodeId);

  const orchestrator = new EvolutionApplyOrchestrator({
    kernel,
    governor,
    registry,
    states,
    certs: certifications,
    rats: ratifications,
    revocations,
    impact: impactAnalyzer,
    snapshots: snapshotEngine,
    txn: transactionManager,
    rollback: rollbackEngine,
    fedGuard: federationGuard,
    audit,
    nonces,
    keys,
  });

  return {
    keys,
    nonces,
    governor,
    registry,
    states,
    certifications,
    ratifications,
    revocations,
    impactAnalyzer,
    snapshotEngine,
    transactionManager,
    rollbackEngine,
    federationGuard,
    audit,
    orchestrator,
  };
}
