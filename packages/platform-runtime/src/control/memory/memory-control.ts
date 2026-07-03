/**
 * UCOS Memory Fabric — Control assembly + Evolution integration (MEM-ARCH-001 / AD-0023).
 *
 * `MemoryControl` is the single controlled entry point. Its ONLY durable mutation path is `commit`,
 * which persists a memory record by routing a put-metadata operation through the ratified Evolution
 * Fabric (snapshot → atomic apply → audited → rollback-capable). There is NO direct store write and NO
 * governor bypass (MGP-4). Recall is deny-by-default + no-synthesis; forgetting is audit-preserving.
 *
 * Built additively over the substrate + control + federation + evolution + knowledge fabrics; no core
 * dir is modified, no federation/evolution/knowledge behavior is changed (reuse only), and no custom
 * cryptography is introduced. It is NOT an Ω∞ self-directed memory (AD-0014 stands; C-5).
 */

import type { KeyObject } from "node:crypto";
import type { Substrate } from "../../bootstrap.ts";
import { KeyRegistry, NonceCache, generateKeyPair } from "../federation/assertions.ts";
import type { PartitionMonitor } from "../federation/partition-handling.ts";
import { createEvolution, type EvolutionFabric } from "../evolution/evolution-apply-orchestrator.ts";
import { createUnit as createEvolutionUnit, unitHash as evolutionUnitHash } from "../evolution/evolution-unit.ts";
import { mintProposal as mintEvolutionProposal } from "../evolution/evolution-proposal.ts";
import type {
  MemoryAuthorityRecord,
  MemoryBoundaryRecord,
  MemoryBundle,
  MemoryPower,
  MemoryRecord,
  VerificationResult,
} from "./types.ts";
import { MemoryStore } from "./memory-store.ts";
import { MemoryRevocation } from "./memory-revocation.ts";
import { MemoryRetention, DEFAULT_RETENTION_POLICY, type RetentionPolicy } from "./memory-retention.ts";
import { MemoryQueryEngine } from "./memory-query-engine.ts";
import { MemoryResolver, type RecallOptions } from "./memory-resolver.ts";
import { MemorySnapshot } from "./memory-snapshot.ts";
import { MemoryFederationGuard } from "./memory-federation-guard.ts";
import { MemoryAuditLog } from "./memory-audit.ts";
import { MemoryStateMachine } from "./memory-state-machine.ts";
import { MemoryCertificationAuthority, type MemoryCertification } from "./memory-certification-authority.ts";
import { MemoryRatificationAuthority, type MemoryRatification } from "./memory-ratification-authority.ts";
import { MemoryConsolidationEngine } from "./memory-consolidation-engine.ts";
import { MemoryRecallEngine } from "./memory-recall-engine.ts";
import { MemoryCapacity, type MemoryCapacityPolicy } from "./memory-capacity.ts";
import { MemoryKnowledgeGuard, type MemoryKnowledgeOracle } from "./memory-knowledge-guard.ts";
import { unitHash } from "./memory-unit.ts";
import { assertTransition } from "./memory-lifecycle.ts";
import { authorityKey, boundaryKey } from "./memory-namespace.ts";
import { AuthorizationError, ControlValidationError } from "../errors.ts";

export interface MemoryOptions {
  nodeId: string;
  keys?: KeyRegistry;
  nonces?: NonceCache;
  partition?: PartitionMonitor;
  retentionPolicy?: RetentionPolicy;
  /**
   * Opt-in working/short-term volatile-capacity caps (M12). Unset ⇒ unbounded for that tier (default
   * behaviour preserved); a configured cap is enforced fail-closed before persistence.
   */
  capacity?: MemoryCapacityPolicy;
  /**
   * Opt-in read-only memory↔knowledge co-ratification oracle (M11). When present, a knowledge-backed
   * SEMANTIC memory may commit/recall only while its `knowledgeRef` resolves to co-ratified knowledge.
   */
  knowledge?: MemoryKnowledgeOracle;
}

export interface MemoryCommitOptions {
  actor?: string;
  now?: number;
}

// Internal evolution "system" principals — distinct ids satisfy the evolution SoD while sharing one
// system key. They mechanize atomic persistence AFTER memory governance has authorized the commit.
const SYS_PROPOSER = "memory-sys-proposer";
const SYS_APPROVER = "memory-sys-approver";
const SYS_CERTIFIER = "memory-sys-certifier";
const SYS_RATIFIER = "memory-sys-ratifier";
const SYS_KEYREF = "memory-system";

export class MemoryControl {
  readonly store: MemoryStore;
  readonly revocations: MemoryRevocation;
  readonly retention: MemoryRetention;
  readonly queryEngine: MemoryQueryEngine;
  readonly resolver: MemoryResolver;
  readonly snapshots: MemorySnapshot;
  readonly federationGuard: MemoryFederationGuard;
  readonly audit: MemoryAuditLog;
  readonly states: MemoryStateMachine;
  readonly certifications: MemoryCertificationAuthority;
  readonly ratifications: MemoryRatificationAuthority;
  readonly recallEngine: MemoryRecallEngine;
  readonly keys: KeyRegistry;
  readonly nonces: NonceCache;
  readonly evolution: EvolutionFabric;
  readonly capacity: MemoryCapacity;

  readonly #substrate: Substrate;
  readonly #sysKey: KeyObject;
  readonly #knowledge?: MemoryKnowledgeOracle;
  #evoSeq = 0;

  constructor(substrate: Substrate, options: MemoryOptions) {
    this.#substrate = substrate;
    const metadata = substrate.metadata;
    this.keys = options.keys ?? new KeyRegistry();
    this.nonces = options.nonces ?? new NonceCache();

    this.store = new MemoryStore(metadata);
    this.revocations = new MemoryRevocation(metadata, options.partition);
    this.retention = new MemoryRetention(options.retentionPolicy ?? DEFAULT_RETENTION_POLICY);
    this.queryEngine = new MemoryQueryEngine(this.store, this.revocations, this.retention);
    this.resolver = new MemoryResolver(this.queryEngine);
    this.snapshots = new MemorySnapshot(this.store);
    this.federationGuard = new MemoryFederationGuard(this.keys, metadata, this.store, options.partition, this.nonces);
    this.audit = new MemoryAuditLog(options.nodeId);
    this.states = new MemoryStateMachine();
    this.certifications = new MemoryCertificationAuthority(this.keys);
    this.ratifications = new MemoryRatificationAuthority(this.keys);
    this.recallEngine = new MemoryRecallEngine(this.resolver);
    this.capacity = new MemoryCapacity(options.capacity ?? {});
    if (options.knowledge) this.#knowledge = options.knowledge;

    // Evolution fabric is the SOLE durable mutation mechanism; allowlist includes the memory namespace.
    this.evolution = createEvolution(substrate, {
      nodeId: options.nodeId,
      evolvableAllowlist: ["memory:"],
      keys: this.keys,
      ...(options.partition ? { partition: options.partition } : {}),
    });

    const sys = generateKeyPair();
    this.#sysKey = sys.privateKey;
    this.keys.register(SYS_KEYREF, sys.publicKeyPem);
    this.evolution.certifications.register({ caId: "memory-evo-ca", owner: SYS_CERTIFIER, keyRef: SYS_KEYREF });
    this.evolution.ratifications.register({ raId: "memory-evo-ra", owner: SYS_RATIFIER, keyRef: SYS_KEYREF, quorum: 1 });
  }

  // --------------------------- Governance setup (Approval-Required, AD-0009) ---------------------------

  /** Register a memory authority with enumerated powers (no implicit authority). */
  registerAuthority(record: Omit<MemoryAuthorityRecord, "status"> & { status?: MemoryAuthorityRecord["status"] }): MemoryAuthorityRecord {
    if (!record.authorityId || !record.keyRef || !record.owner) {
      throw new ControlValidationError("Memory authority requires authorityId, owner, keyRef", { record });
    }
    if (!Array.isArray(record.powers) || record.powers.length === 0) {
      throw new ControlValidationError("Memory authority requires enumerated powers (no implicit authority)", { record });
    }
    const full: MemoryAuthorityRecord = { ...record, status: record.status ?? "active" };
    this.#substrate.metadata.put(authorityKey(record.authorityId), full);
    return full;
  }

  hasPower(authorityId: string, power: MemoryPower): boolean {
    const a = this.#substrate.metadata.get(authorityKey(authorityId))?.value as MemoryAuthorityRecord | undefined;
    return !!a && a.status === "active" && a.powers.includes(power);
  }

  /** Define a memory trust boundary (deny-by-default; clamps conferred trust). */
  defineBoundary(record: Omit<MemoryBoundaryRecord, "defaultEffect"> & { defaultEffect?: "deny" }): MemoryBoundaryRecord {
    if (!record.boundaryId) throw new ControlValidationError("Memory boundary requires boundaryId", { record });
    if (!Number.isFinite(record.maxTrustLevel) || record.maxTrustLevel < 0) {
      throw new ControlValidationError("Memory boundary maxTrustLevel must be a non-negative number", { record });
    }
    const full: MemoryBoundaryRecord = { ...record, defaultEffect: "deny" };
    this.#substrate.metadata.put(boundaryKey(record.boundaryId), full);
    return full;
  }

  // --------------------------- Durable mutation (evolution-routed) ---------------------------

  /**
   * The SOLE durable mutation path. Verifies unit integrity, derives fail-closed retention expiry,
   * tracks the lifecycle transition, then PERSISTS the record atomically via the Evolution Fabric.
   * Fail-closed: any gate failure aborts before persistence.
   */
  async commit(record: MemoryRecord, opts: MemoryCommitOptions = {}): Promise<{ ok: true; unitHash: string; evolutionUnitHash: string }> {
    const now = opts.now ?? Date.now();
    const uh = record.unitHash;
    if (uh !== unitHash(record.unit)) throw new ControlValidationError("record unitHash mismatch (unit tampered)", { uh });

    // M11 — Memory↔Knowledge co-ratification gate (fail-closed). A knowledge-backed semantic memory may
    // persist only while its knowledgeRef resolves to co-ratified knowledge (deny dangling/rolled-back).
    const coRat = MemoryKnowledgeGuard.evaluate(record, this.#knowledge);
    if (!coRat.ok) throw new AuthorizationError(`memory↔knowledge co-ratification failed: ${coRat.reason}`, { uh });

    // M12 — Working/short-term capacity gate (fail-closed). Reject unbounded accumulation/flooding into a
    // volatile namespace beyond its configured cap (opt-in; unset ⇒ unbounded, default behaviour intact).
    if (this.capacity.capFor(record.tier) !== undefined) {
      const live = this.queryEngine.query({ namespace: record.namespace, tier: record.tier, now });
      this.capacity.assertAdmissible(record, live);
    }

    // Derive a fail-closed expiry from the retention class if none was supplied (M3: nothing durable-by-omission).
    const derivedExpiry = this.retention.expiryFor(record.retentionClass, record.capturedAt);
    const persisted: MemoryRecord =
      record.expiresAt === undefined && derivedExpiry !== undefined ? { ...record, expiresAt: derivedExpiry } : record;

    // Track memory lifecycle state (guarded).
    if (this.states.state(uh) === undefined) this.states.start(uh, "captured");
    this.#advanceTo(uh, persisted.state);

    // PERSIST via Evolution Fabric (the single mutation path; atomic + audited + rollback-capable).
    const write = MemoryStore.evolutionWrite(persisted);
    const evoUnitHash = await this.#persistViaEvolution(write.key, write.value, now);

    const stateHash = this.snapshots.capture(persisted.namespace).stateHash;
    const event =
      persisted.state === "active" ? "MEM_ACTIVATED" :
      persisted.state === "consolidated" ? "MEM_CONSOLIDATED" :
      persisted.state === "ratified" ? "MEM_RATIFIED" :
      persisted.state === "certified" ? "MEM_CERTIFIED" : "MEM_CAPTURED";
    this.audit.record({
      at: now, event, unitHash: uh, namespace: persisted.namespace,
      actor: opts.actor ?? persisted.source.kind,
      detail: `tier=${persisted.tier} state=${persisted.state} v=${persisted.version} class=${persisted.classification.level} ret=${persisted.retentionClass}`,
      stateHash,
    });
    return { ok: true, unitHash: uh, evolutionUnitHash: evoUnitHash };
  }

  /**
   * Consolidate/promote a source record into a higher tier as a new record, enforcing MONOTONIC
   * classification (MGP-3): the promoted classification may raise but never lower. Persisted via
   * evolution. This is an authority act (Consolidation Authority) in production (C-4/AD-0009).
   */
  async consolidate(target: MemoryRecord, sources: readonly MemoryRecord[], opts: MemoryCommitOptions = {}): Promise<{ ok: true; unitHash: string }> {
    const promoted = MemoryConsolidationEngine.consolidate(target, sources); // monotonic classification + merged lineage (fail-closed)
    const res = await this.commit(promoted, opts);
    return { ok: true, unitHash: res.unitHash };
  }

  /**
   * Governed durable commit with memory-layer separation of duties. Requires a signed certification and
   * a signed ratification bound to THIS record's `unitHash`; verifies both fail-closed (forged ⇒ deny,
   * M2); enforces enumerated authority powers (consolidate/certify/ratify) and SoD
   * (consolidate ≠ certify ≠ ratify, M4); then persists via the sole Evolution-routed `commit` path.
   */
  async governedCommit(
    record: MemoryRecord,
    gov: { certification: MemoryCertification; ratification: MemoryRatification },
    opts: MemoryCommitOptions = {},
  ): Promise<{ ok: true; unitHash: string; evolutionUnitHash: string }> {
    const uh = record.unitHash;
    const { certification: cert, ratification: rat } = gov;
    if (uh !== unitHash(record.unit)) throw new ControlValidationError("record unitHash mismatch (unit tampered)", { uh });
    if (cert.unitHash !== uh || rat.unitHash !== uh) {
      throw new AuthorizationError("certification/ratification not bound to this record unitHash (fail-closed)", { uh });
    }
    if (rat.certificationId !== cert.certificationId || rat.certifier !== cert.certifier) {
      throw new AuthorizationError("ratification is not bound to the presented certification (fail-closed)", { uh });
    }
    if (!this.certifications.verify(cert)) throw new AuthorizationError("invalid/forged memory certification (fail-closed)", { uh });
    if (!this.ratifications.verify(rat)) throw new AuthorizationError("invalid/forged memory ratification or SoD/quorum failure (fail-closed)", { uh });
    // Enumerated-power checks at the memory-authority layer (no implicit authority; M4 escalation ⇒ deny).
    if (!this.hasPower(rat.consolidator, "consolidate")) throw new AuthorizationError(`consolidator "${rat.consolidator}" lacks 'consolidate' power`, { uh });
    if (!this.hasPower(rat.certifier, "certify")) throw new AuthorizationError(`certifier "${rat.certifier}" lacks 'certify' power`, { uh });
    for (const r of rat.ratifiers) {
      if (!this.hasPower(r, "ratify")) throw new AuthorizationError(`ratifier "${r}" lacks 'ratify' power`, { uh });
    }
    // Structural SoD re-assertion (defence in depth; ratifications.verify already enforces this).
    if (rat.consolidator === rat.certifier || rat.ratifiers.includes(rat.consolidator) || rat.ratifiers.includes(rat.certifier)) {
      throw new AuthorizationError("separation of duties violated (consolidate≠certify≠ratify)", { uh });
    }
    return this.commit(record, opts);
  }

  // --------------------------- Recall (deny-by-default, no-synthesis) ---------------------------

  /**
   * Recall the authoritative active memory for `(namespace, memId)`. Deny-by-default + no-synthesis:
   * an unresolved/revoked/expired/below-trust/above-clearance reference returns `undefined` and is
   * audited as a first-class DENIAL (no silent deny — closes M4 / supports M1/M5 forensics).
   */
  recall(namespace: string, memId: string, opts: RecallOptions & { actor?: string } = {}): MemoryRecord | undefined {
    const now = opts.now ?? Date.now();
    const rec = this.recallEngine.recall(namespace, memId, opts);
    // M11 — recall-time co-ratification re-check (knowledge rollback). A knowledge-backed semantic memory
    // whose backing knowledge is no longer co-ratified is treated as ABSENT (deny-by-default, no-synthesis).
    if (rec && !MemoryKnowledgeGuard.isCoRatified(rec, this.#knowledge)) {
      this.audit.record({ at: now, event: "MEM_RECALL_DENIED", unitHash: rec.unitHash, namespace, actor: opts.actor ?? "recall", detail: `memId=${memId} (knowledge desync: backing knowledge not co-ratified)` });
      return undefined;
    }
    if (rec) {
      this.audit.record({ at: now, event: "MEM_RECALLED", unitHash: rec.unitHash, namespace, actor: opts.actor ?? "recall", detail: `memId=${memId} tier=${rec.tier} v=${rec.version}` });
    } else {
      this.audit.record({ at: now, event: "MEM_RECALL_DENIED", unitHash: "-", namespace, actor: opts.actor ?? "recall", detail: `memId=${memId} (deny-by-default / no-synthesis)` });
    }
    return rec;
  }

  // --------------------------- Governed forgetting (audit-preserving) ---------------------------

  /**
   * Governed forgetting (MEM-GOV-002 §2.3). Renders the memory VALUE unrecallable (revokes unit+record
   * so the query engine excludes it), while the tamper-evident audit fact is RETAINED (audit-preserving,
   * closes both sides of M9). Suspended under legal-hold. Approval-Required in production (C-4/AD-0009).
   */
  forget(record: MemoryRecord, by: string, opts: MemoryCommitOptions = {}): VerificationResult {
    const now = opts.now ?? Date.now();
    if (this.retention.forgettingSuspended(record)) {
      return { ok: false, reason: "forgetting suspended under legal-hold" };
    }
    this.revocations.revoke("record", `${record.namespace}:${record.memId}@${record.version}`, by);
    this.revocations.revoke("unit", record.unitHash, by);
    if (this.states.state(record.unitHash) !== undefined && this.states.state(record.unitHash) !== "forgotten") {
      try {
        assertTransition(this.states.state(record.unitHash)!, "forgotten");
        this.states.transition(record.unitHash, "forgotten");
      } catch {
        /* terminal already; revocation still makes it unrecallable */
      }
    }
    this.audit.record({ at: now, event: "MEM_FORGOTTEN", unitHash: record.unitHash, namespace: record.namespace, actor: by, detail: `memId=${record.memId} (value unrecallable; audit fact retained)` });
    return { ok: true, reason: "memory forgotten (audit-preserving)" };
  }

  /** Revoke a memory unit/record directly (fail-closed on next recall). Approval-required in production. */
  revoke(kind: "unit" | "record", id: string, by: string): void {
    this.revocations.revoke(kind, id, by);
    this.audit.record({ at: Date.now(), event: "MEM_REVOKED", unitHash: kind === "unit" ? id : "-", namespace: "-", actor: by, detail: `${kind}:${id}` });
  }

  // --------------------------- Federation (deny-only shadow) ---------------------------

  /**
   * Verify an inbound signed memory bundle, enforce local sovereignty + trust clamp + classification,
   * then persist as a deny-only shadow via evolution (fail-closed). Closes M5/M6.
   */
  async importBundle(bundle: MemoryBundle, boundaryId: string, opts: MemoryCommitOptions = {}): Promise<VerificationResult> {
    const now = opts.now ?? Date.now();
    const inbound = this.federationGuard.verifyInbound(bundle, boundaryId, now);
    if (!inbound.ok) return inbound;
    if (!this.federationGuard.mayOverrideLocal(bundle.record)) {
      return { ok: false, reason: "local sovereignty: foreign memory cannot override a local active record" };
    }
    const clamped = this.federationGuard.clampTrust(bundle.record, boundaryId);
    const record: MemoryRecord = { ...bundle.record, trustLevel: clamped };
    const write = MemoryStore.evolutionWrite(record);
    await this.#persistViaEvolution(write.key, write.value, now);
    this.audit.record({ at: now, event: "MEM_FEDERATED_INGEST", unitHash: record.unitHash, namespace: record.namespace, actor: bundle.issuer, detail: `boundary=${boundaryId} clampedTrust=${clamped}` });
    return { ok: true, reason: "bundle imported (trust-clamped, deny-only shadow, persisted via evolution)" };
  }

  // --------------------------- internals ---------------------------

  /** Advance the memory state machine from its current state up to `target` along legal edges. */
  #advanceTo(uh: string, target: MemoryRecord["state"]): void {
    const path: Record<string, MemoryRecord["state"][]> = {
      captured: ["captured"],
      proposed: ["proposed"],
      certified: ["proposed", "certified"],
      ratified: ["proposed", "certified", "ratified"],
      active: ["active"],
      consolidated: ["consolidated"],
      superseded: ["superseded"],
      forgotten: ["forgotten"],
      expired: ["expired"],
    };
    const steps = path[target] ?? [];
    for (const s of steps) {
      if (this.states.state(uh) === s) continue;
      assertTransition(this.states.state(uh) as MemoryRecord["state"], s);
      this.states.transition(uh, s);
    }
  }

  /** Drive an evolution unit (put-metadata) through the full evolution lifecycle and apply it. */
  async #persistViaEvolution(key: string, value: unknown, now: number): Promise<string> {
    const seq = this.#evoSeq++;
    const evoUnit = createEvolutionUnit({
      unitId: `mem-persist-${seq}-${now}`,
      title: `persist ${key}`,
      changeClass: "routine",
      targets: [{ kind: "metadata", keyPrefix: key }],
      ops: [{ op: "put-metadata", key, value }],
    });
    const evoUnitHash = evolutionUnitHash(evoUnit);
    const proposal = mintEvolutionProposal(this.#sysKey, {
      proposalId: `mem-prop-${seq}`,
      unit: evoUnit,
      proposer: SYS_PROPOSER,
      proposerKeyRef: SYS_KEYREF,
    });
    this.evolution.orchestrator.submit(proposal, now);
    this.evolution.orchestrator.approve(evoUnitHash, SYS_APPROVER);
    const cert = this.evolution.certifications.issue(this.#sysKey, { unitHash: evoUnitHash, caId: "memory-evo-ca" });
    this.evolution.orchestrator.recordCertification(cert, now);
    const rat = this.evolution.ratifications.issue(this.#sysKey, {
      unitHash: evoUnitHash,
      raId: "memory-evo-ra",
      proposer: SYS_PROPOSER,
      certifier: SYS_CERTIFIER,
      approvals: [SYS_APPROVER],
      certificationId: cert.certificationId,
    });
    this.evolution.orchestrator.ratify(rat, now);
    const result = await this.evolution.orchestrator.apply(evoUnitHash, { now, actor: SYS_PROPOSER });
    if (result.status !== "applied") {
      throw new ControlValidationError(`memory persistence rolled back (fail-closed): ${result.reason}`, { key });
    }
    return evoUnitHash;
  }

  get substrate(): Substrate {
    return this.#substrate;
  }
}

/** Stand up the PI-9 memory fabric over an existing substrate. Additive; no core-dir modification. */
export function createMemory(substrate: Substrate, options: MemoryOptions): MemoryControl {
  return new MemoryControl(substrate, options);
}
