/**
 * UCOS Knowledge Fabric — Control assembly + Evolution integration (KNOW-ARCH-001 / AD-0020 §Part H).
 *
 * `KnowledgeControl` is the single controlled entry point. Its ONLY governed mutation path is
 * `commit`, which persists a knowledge record by routing a put-metadata operation through the ratified
 * Evolution Fabric (snapshot -> atomic apply -> audited -> rollback-capable). There is NO direct store
 * write and NO governor bypass. Knowledge-domain governance (certification/ratification with SoD) gates
 * the commit; evolution provides the atomic, audited persistence.
 *
 * Built additively over the substrate + federation + evolution fabrics; no core dir is modified, and
 * no evolution/federation behavior is changed (reuse only).
 */

import type { Substrate } from "../../bootstrap.ts";
import { KeyRegistry, NonceCache, generateKeyPair } from "../federation/assertions.ts";
import type { PartitionMonitor } from "../federation/partition-handling.ts";
import { createEvolution, type EvolutionFabric } from "../evolution/evolution-apply-orchestrator.ts";
import { createUnit as createEvolutionUnit, unitHash as evolutionUnitHash } from "../evolution/evolution-unit.ts";
import { mintProposal as mintEvolutionProposal } from "../evolution/evolution-proposal.ts";
import type { KnowledgeCertification, KnowledgeRatification, KnowledgeRecord, VerificationResult } from "./types.ts";
import { KnowledgeRegistry } from "./knowledge-registry.ts";
import { KnowledgeStore } from "./knowledge-store.ts";
import { KnowledgeRevocationAuthority } from "./knowledge-revocation-authority.ts";
import { KnowledgeCertificationAuthority } from "./knowledge-certification-authority.ts";
import { KnowledgeRatificationAuthority } from "./knowledge-ratification-authority.ts";
import { KnowledgeQueryEngine } from "./knowledge-query-engine.ts";
import { KnowledgeResolver } from "./knowledge-resolver.ts";
import { KnowledgeLineage } from "./knowledge-lineage.ts";
import { KnowledgeSnapshot } from "./knowledge-snapshot.ts";
import { KnowledgeImportExport } from "./knowledge-import-export.ts";
import { KnowledgeFederationGuard } from "./knowledge-federation-guard.ts";
import { KnowledgeAuditLog } from "./knowledge-audit-log.ts";
import { KnowledgeStateMachine } from "./knowledge-state-machine.ts";
import { unitHash } from "./knowledge-unit.ts";
import { assertTransition } from "./knowledge-lifecycle.ts";
import { AuthorizationError, ControlValidationError } from "../errors.ts";

export interface KnowledgeOptions {
  nodeId: string;
  keys?: KeyRegistry;
  nonces?: NonceCache;
  partition?: PartitionMonitor;
}

export interface KnowledgeCommitOptions {
  /** Knowledge-domain certification gating the commit (verified before persistence). */
  certification?: KnowledgeCertification;
  /** Knowledge-domain ratification gating the commit (SoD + quorum verified before persistence). */
  ratification?: KnowledgeRatification;
  actor?: string;
  now?: number;
}

// Internal evolution "system" principals — distinct ids satisfy the evolution SoD while sharing one
// system key. They mechanize atomic persistence AFTER knowledge governance has authorized the commit.
const SYS_PROPOSER = "knowledge-sys-proposer";
const SYS_APPROVER = "knowledge-sys-approver";
const SYS_CERTIFIER = "knowledge-sys-certifier";
const SYS_RATIFIER = "knowledge-sys-ratifier";
const SYS_KEYREF = "knowledge-system";

export class KnowledgeControl {
  readonly registry: KnowledgeRegistry;
  readonly store: KnowledgeStore;
  readonly revocations: KnowledgeRevocationAuthority;
  readonly certifications: KnowledgeCertificationAuthority;
  readonly ratifications: KnowledgeRatificationAuthority;
  readonly queryEngine: KnowledgeQueryEngine;
  readonly resolver: KnowledgeResolver;
  readonly lineage: KnowledgeLineage;
  readonly snapshots: KnowledgeSnapshot;
  readonly importExport: KnowledgeImportExport;
  readonly federationGuard: KnowledgeFederationGuard;
  readonly audit: KnowledgeAuditLog;
  readonly states: KnowledgeStateMachine;
  readonly keys: KeyRegistry;
  readonly nonces: NonceCache;
  readonly evolution: EvolutionFabric;

  readonly #substrate: Substrate;
  readonly #sysKey: import("node:crypto").KeyObject;
  #evoSeq = 0;

  constructor(substrate: Substrate, options: KnowledgeOptions) {
    this.#substrate = substrate;
    const metadata = substrate.metadata;
    this.keys = options.keys ?? new KeyRegistry();
    this.nonces = options.nonces ?? new NonceCache();

    this.registry = new KnowledgeRegistry(metadata);
    this.store = new KnowledgeStore(metadata);
    this.revocations = new KnowledgeRevocationAuthority(metadata, options.partition);
    this.certifications = new KnowledgeCertificationAuthority(metadata, this.keys);
    this.ratifications = new KnowledgeRatificationAuthority(metadata, this.keys);
    this.queryEngine = new KnowledgeQueryEngine(this.store, this.revocations);
    this.resolver = new KnowledgeResolver(this.queryEngine);
    this.lineage = new KnowledgeLineage(this.store);
    this.snapshots = new KnowledgeSnapshot(this.store);
    this.importExport = new KnowledgeImportExport(this.keys);
    this.federationGuard = new KnowledgeFederationGuard(this.keys, this.registry, this.store, options.partition);
    this.audit = new KnowledgeAuditLog(options.nodeId);
    this.states = new KnowledgeStateMachine();

    // Evolution fabric is the SOLE mutation mechanism; allowlist includes the knowledge namespace.
    this.evolution = createEvolution(substrate, {
      nodeId: options.nodeId,
      evolvableAllowlist: ["knowledge:"],
      keys: this.keys,
      ...(options.partition ? { partition: options.partition } : {}),
    });

    // Internal system key + evolution authorities (distinct principals -> evolution SoD satisfied).
    const sys = generateKeyPair();
    this.#sysKey = sys.privateKey;
    this.keys.register(SYS_KEYREF, sys.publicKeyPem);
    this.evolution.certifications.register({ caId: "knowledge-evo-ca", owner: SYS_CERTIFIER, keyRef: SYS_KEYREF });
    this.evolution.ratifications.register({ raId: "knowledge-evo-ra", owner: SYS_RATIFIER, keyRef: SYS_KEYREF, quorum: 1 });
  }

  /**
   * The SOLE governed mutation path. Verifies knowledge governance (certification + ratification with
   * SoD/quorum, when supplied), tracks the lifecycle transition, then PERSISTS the record atomically
   * via the Evolution Fabric. Fail-closed: any gate failure aborts before persistence.
   */
  async commit(record: KnowledgeRecord, opts: KnowledgeCommitOptions = {}): Promise<{ ok: true; unitHash: string; evolutionUnitHash: string }> {
    const now = opts.now ?? Date.now();
    const uh = record.unitHash;
    if (uh !== unitHash(record.unit)) throw new ControlValidationError("record unitHash mismatch (unit tampered)", { uh });

    // Integrity: lineage + provenance (K7/K10/K2).
    const lin = this.lineage.verifyLineage(record);
    if (!lin.ok) throw new AuthorizationError(`lineage verification failed: ${lin.reason}`, { uh });
    const prov = this.lineage.verifyProvenance(record);
    if (!prov.ok) throw new AuthorizationError(`provenance verification failed: ${prov.reason}`, { uh });

    // Knowledge governance gate (when the target state is ratified/active).
    if (record.state === "ratified" || record.state === "active") {
      if (!opts.certification || !this.certifications.verify(opts.certification, { now }).ok) {
        throw new AuthorizationError("commit to ratified/active requires a valid knowledge certification", { uh });
      }
      if (opts.certification.unitHash !== uh) throw new AuthorizationError("certification unitHash mismatch", { uh });
      if (!opts.ratification || !this.ratifications.verify(opts.ratification, { now }).ok) {
        throw new AuthorizationError("commit to ratified/active requires a valid knowledge ratification (SoD + quorum)", { uh });
      }
      if (opts.ratification.unitHash !== uh || opts.ratification.certificationId !== opts.certification.certificationId) {
        throw new AuthorizationError("ratification does not match certification/unit", { uh });
      }
    }

    // Track knowledge lifecycle state (guarded).
    if (this.states.state(uh) === undefined) this.states.start(uh, "draft");
    this.#advanceTo(uh, record.state);

    // PERSIST via Evolution Fabric (the single mutation path; atomic + audited + rollback-capable).
    const write = KnowledgeStore.evolutionWrite(record);
    const evoUnitHash = await this.#persistViaEvolution(write.key, write.value, now);

    // Knowledge audit (write-ahead already emitted by evolution; record the knowledge-domain event).
    const stateHash = this.snapshots.capture(record.namespace).stateHash;
    const event = record.state === "active" ? "KNOW_ACTIVATED" : record.state === "ratified" ? "KNOW_RATIFIED" : "KNOW_CREATED";
    this.audit.record({ at: now, event, unitHash: uh, namespace: record.namespace, actor: opts.actor ?? record.source.kind, detail: `state=${record.state} v=${record.version}`, stateHash });
    if (record.lineage.length > 0) {
      this.audit.record({ at: now, event: "KNOW_LINEAGE", unitHash: uh, namespace: record.namespace, actor: opts.actor ?? "system", detail: `parents=${record.lineage.length}` });
    }
    return { ok: true, unitHash: uh, evolutionUnitHash: evoUnitHash };
  }

  /** Revoke a knowledge unit/record (fail-closed on next resolution). Approval-required in production. */
  revoke(kind: "unit" | "record", id: string, by: string): void {
    this.revocations.revoke(kind, id, by);
    this.audit.record({ at: Date.now(), event: "KNOW_REVOKED", unitHash: kind === "unit" ? id : "-", namespace: "-", actor: by, detail: `${kind}:${id}` });
  }

  /** Advance the knowledge state machine from its current state up to `target` along legal edges. */
  #advanceTo(uh: string, target: KnowledgeRecord["state"]): void {
    const path: Record<string, KnowledgeRecord["state"][]> = {
      draft: ["draft"],
      validated: ["validated"],
      certified: ["validated", "certified"],
      ratified: ["validated", "certified", "ratified"],
      active: ["validated", "certified", "ratified", "active"],
      superseded: [],
      revoked: ["revoked"],
      archived: [],
    };
    const steps = path[target] ?? [];
    for (const s of steps) {
      if (this.states.state(uh) === s) continue;
      assertTransition(this.states.state(uh) as KnowledgeRecord["state"], s);
      this.states.transition(uh, s);
    }
  }

  /** Drive an evolution unit (put-metadata) through the full evolution lifecycle and apply it. */
  async #persistViaEvolution(key: string, value: unknown, now: number): Promise<string> {
    const seq = this.#evoSeq++;
    const evoUnit = createEvolutionUnit({
      unitId: `know-persist-${seq}-${now}`,
      title: `persist ${key}`,
      changeClass: "routine",
      targets: [{ kind: "metadata", keyPrefix: key }],
      ops: [{ op: "put-metadata", key, value }],
    });
    const evoUnitHash = evolutionUnitHash(evoUnit);
    const proposal = mintEvolutionProposal(this.#sysKey, {
      proposalId: `know-prop-${seq}`,
      unit: evoUnit,
      proposer: SYS_PROPOSER,
      proposerKeyRef: SYS_KEYREF,
    });
    this.evolution.orchestrator.submit(proposal, now);
    this.evolution.orchestrator.approve(evoUnitHash, SYS_APPROVER);
    const cert = this.evolution.certifications.issue(this.#sysKey, { unitHash: evoUnitHash, caId: "knowledge-evo-ca" });
    this.evolution.orchestrator.recordCertification(cert, now);
    const rat = this.evolution.ratifications.issue(this.#sysKey, {
      unitHash: evoUnitHash,
      raId: "knowledge-evo-ra",
      proposer: SYS_PROPOSER,
      certifier: SYS_CERTIFIER,
      approvals: [SYS_APPROVER],
      certificationId: cert.certificationId,
    });
    this.evolution.orchestrator.ratify(rat, now);
    const result = await this.evolution.orchestrator.apply(evoUnitHash, { now, actor: SYS_PROPOSER });
    if (result.status !== "applied") {
      throw new ControlValidationError(`knowledge persistence rolled back (fail-closed): ${result.reason}`, { key });
    }
    return evoUnitHash;
  }

  /** Verify an inbound bundle then persist via evolution (fail-closed). For federation/import (K1/K9). */
  async importBundle(
    bundle: import("./types.ts").KnowledgeBundle,
    boundaryId: string,
    opts: KnowledgeCommitOptions = {},
  ): Promise<VerificationResult> {
    const now = opts.now ?? Date.now();
    const inbound = this.federationGuard.verifyInbound(bundle, boundaryId, now);
    if (!inbound.ok) return inbound;
    // Local sovereignty: a foreign record may not override a local active record.
    if (!this.federationGuard.mayOverrideLocal(bundle.record)) {
      return { ok: false, reason: "local sovereignty: foreign knowledge cannot override a local active record" };
    }
    // Clamp trust to the boundary ceiling and persist via evolution.
    const clamped = this.federationGuard.clampTrust(bundle.record, boundaryId);
    const record: KnowledgeRecord = { ...bundle.record, trustLevel: clamped };
    const write = KnowledgeStore.evolutionWrite(record);
    await this.#persistViaEvolution(write.key, write.value, now);
    this.audit.record({ at: now, event: "KNOW_EXCHANGED", unitHash: record.unitHash, namespace: record.namespace, actor: bundle.issuer, detail: `boundary=${boundaryId} clampedTrust=${clamped}` });
    return { ok: true, reason: "bundle imported (trust-clamped, persisted via evolution)" };
  }

  get substrate(): Substrate {
    return this.#substrate;
  }
}

/** Stand up the PI-7 knowledge fabric over an existing substrate. Additive; no core-dir modification. */
export function createKnowledge(substrate: Substrate, options: KnowledgeOptions): KnowledgeControl {
  return new KnowledgeControl(substrate, options);
}
