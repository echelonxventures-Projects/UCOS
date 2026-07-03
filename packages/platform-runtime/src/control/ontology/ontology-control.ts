/**
 * UCOS Ontology Fabric — Control assembly + Evolution integration (ONTO-ARCH-001 / ONTO-GOV-002 / AD-0021).
 *
 * `OntologyControl` is the single controlled entry point. Its ONLY governed mutation path is `commit`,
 * which persists an ontology record by routing a put-metadata operation through the ratified Evolution
 * Fabric (snapshot -> atomic apply -> audited -> rollback-capable). There is NO direct store write and
 * NO governor bypass. Before persistence, `commit` runs the SEMANTIC-INTEGRITY GATE (SI-1..SI-7): a
 * `block` violation fails closed. Ontology-domain governance (certification/ratification with SoD)
 * additionally gates commits to `ratified`/`active`.
 *
 * Built additively over the substrate + federation + evolution fabrics; no core dir is modified, and no
 * evolution/federation behavior is changed (reuse only). Meaning is not authority: no ontology construct
 * may confer identity/trust/permission/execution (SI-7), and all governed change is migration-only.
 */

import type { Substrate } from "../../bootstrap.ts";
import { KeyRegistry, NonceCache, generateKeyPair } from "../federation/assertions.ts";
import type { PartitionMonitor } from "../federation/partition-handling.ts";
import { createEvolution, type EvolutionFabric } from "../evolution/evolution-apply-orchestrator.ts";
import { createUnit as createEvolutionUnit, unitHash as evolutionUnitHash } from "../evolution/evolution-unit.ts";
import { mintProposal as mintEvolutionProposal } from "../evolution/evolution-proposal.ts";
import type {
  OntologyBundle,
  OntologyCertification,
  OntologyRatification,
  OntologyRecord,
  OntologyState,
  SemanticIntegrityResult,
  VerificationResult,
} from "./types.ts";
import { OntologyRegistry } from "./ontology-registry.ts";
import { OntologyStore } from "./ontology-store.ts";
import { OntologyRevocationAuthority } from "./ontology-revocation-authority.ts";
import { OntologyCertificationAuthority } from "./ontology-certification-authority.ts";
import { OntologyRatificationAuthority } from "./ontology-ratification-authority.ts";
import { OntologyQueryEngine } from "./ontology-query-engine.ts";
import { OntologyResolver } from "./ontology-resolver.ts";
import { OntologyGraph } from "./ontology-graph.ts";
import { SemanticConstraintEngine } from "./semantic-constraint-engine.ts";
import { OntologySnapshot } from "./ontology-snapshot.ts";
import { OntologyFederationGuard } from "./ontology-federation-guard.ts";
import { OntologyAuditLog } from "./ontology-audit-log.ts";
import { OntologyStateMachine } from "./ontology-state-machine.ts";
import { unitHash } from "./ontology-unit.ts";
import { assertTransition } from "./ontology-lifecycle.ts";
import { AuthorizationError, ControlValidationError } from "../errors.ts";

export interface OntologyOptions {
  nodeId: string;
  keys?: KeyRegistry;
  nonces?: NonceCache;
  partition?: PartitionMonitor;
}

export interface OntologyCommitOptions {
  /** Ontology-domain certification gating the commit (verified before persistence). */
  certification?: OntologyCertification;
  /** Ontology-domain ratification gating the commit (SoD + quorum verified before persistence). */
  ratification?: OntologyRatification;
  actor?: string;
  now?: number;
  /** Skip the semantic-integrity gate ONLY for non-graph-affecting drafts (default: always enforced). */
  imports?: string[];
}

// Internal evolution "system" principals — distinct ids satisfy the evolution SoD while sharing one
// system key. They mechanize atomic persistence AFTER ontology governance has authorized the commit.
const SYS_PROPOSER = "ontology-sys-proposer";
const SYS_APPROVER = "ontology-sys-approver";
const SYS_CERTIFIER = "ontology-sys-certifier";
const SYS_RATIFIER = "ontology-sys-ratifier";
const SYS_KEYREF = "ontology-system";

export class OntologyControl {
  readonly registry: OntologyRegistry;
  readonly store: OntologyStore;
  readonly revocations: OntologyRevocationAuthority;
  readonly certifications: OntologyCertificationAuthority;
  readonly ratifications: OntologyRatificationAuthority;
  readonly queryEngine: OntologyQueryEngine;
  readonly resolver: OntologyResolver;
  readonly graph: OntologyGraph;
  readonly constraints: SemanticConstraintEngine;
  readonly snapshots: OntologySnapshot;
  readonly federationGuard: OntologyFederationGuard;
  readonly audit: OntologyAuditLog;
  readonly states: OntologyStateMachine;
  readonly keys: KeyRegistry;
  readonly nonces: NonceCache;
  readonly evolution: EvolutionFabric;

  readonly #substrate: Substrate;
  readonly #sysKey: import("node:crypto").KeyObject;
  #evoSeq = 0;

  constructor(substrate: Substrate, options: OntologyOptions) {
    this.#substrate = substrate;
    const metadata = substrate.metadata;
    this.keys = options.keys ?? new KeyRegistry();
    this.nonces = options.nonces ?? new NonceCache();

    this.registry = new OntologyRegistry(metadata);
    this.store = new OntologyStore(metadata);
    this.revocations = new OntologyRevocationAuthority(metadata, options.partition);
    this.certifications = new OntologyCertificationAuthority(metadata, this.keys);
    this.ratifications = new OntologyRatificationAuthority(metadata, this.keys);
    this.queryEngine = new OntologyQueryEngine(this.store, this.revocations);
    this.resolver = new OntologyResolver(this.queryEngine);
    this.graph = new OntologyGraph(this.store);
    this.constraints = new SemanticConstraintEngine(this.store, this.graph);
    this.snapshots = new OntologySnapshot(this.store);
    this.federationGuard = new OntologyFederationGuard(this.keys, this.registry, this.store, options.partition);
    this.audit = new OntologyAuditLog(options.nodeId);
    this.states = new OntologyStateMachine();

    // Evolution fabric is the SOLE mutation mechanism; allowlist includes only the ontology namespace.
    this.evolution = createEvolution(substrate, {
      nodeId: options.nodeId,
      evolvableAllowlist: ["ontology:"],
      keys: this.keys,
      ...(options.partition ? { partition: options.partition } : {}),
    });

    // Internal system key + evolution authorities (distinct principals -> evolution SoD satisfied).
    const sys = generateKeyPair();
    this.#sysKey = sys.privateKey;
    this.keys.register(SYS_KEYREF, sys.publicKeyPem);
    this.evolution.certifications.register({ caId: "ontology-evo-ca", owner: SYS_CERTIFIER, keyRef: SYS_KEYREF });
    this.evolution.ratifications.register({ raId: "ontology-evo-ra", owner: SYS_RATIFIER, keyRef: SYS_KEYREF, quorum: 1 });
  }

  /** The admit predicate used for graph projection: active + not revoked (fail-closed). */
  #admit = (r: OntologyRecord): boolean => {
    if (r.state !== "active") return false;
    if (this.revocations.isRevoked("record", r.recordId)) return false;
    if (this.revocations.isRevoked("unit", r.unitHash)) return false;
    return true;
  };

  /** Run the semantic-integrity gate for a candidate record (SI-1..SI-7). */
  checkIntegrity(record: OntologyRecord, imports?: string[]): SemanticIntegrityResult {
    const im = imports ?? this.registry.imports(record.namespace);
    return this.constraints.evaluate(record, { imports: im, admit: this.#admit });
  }

  /**
   * The SOLE governed mutation path. Order: unit-integrity -> SEMANTIC-INTEGRITY GATE (SI-1..SI-7,
   * fail-closed on block) -> ontology governance (cert+rat with SoD/quorum when target is
   * ratified/active) -> lifecycle tracking -> atomic persistence via the Evolution Fabric -> audit.
   * Any gate failure aborts before persistence (deny-by-default).
   */
  async commit(
    record: OntologyRecord,
    opts: OntologyCommitOptions = {},
  ): Promise<{ ok: true; unitHash: string; evolutionUnitHash: string; integrity: SemanticIntegrityResult }> {
    const now = opts.now ?? Date.now();
    const uh = record.unitHash;
    if (uh !== unitHash(record.unit)) throw new ControlValidationError("record unitHash mismatch (unit tampered)", { uh });

    // SEMANTIC-INTEGRITY GATE (ONTO-GOV-002 §2). Evaluate against the graph as if the record applies.
    const integrity = this.checkIntegrity(record, opts.imports);
    if (!integrity.ok) {
      const blocking = integrity.violations.filter((v) => v.severity === "block");
      this.audit.record({
        at: now,
        event: "ONTO_INTEGRITY",
        unitHash: uh,
        namespace: record.namespace,
        actor: opts.actor ?? record.source.kind,
        detail: `BLOCKED: ${blocking.map((v) => `${v.check}:${v.detail}`).join("; ")}`,
      });
      throw new AuthorizationError(`semantic-integrity gate failed (fail-closed): ${blocking.map((v) => v.check).join(",")}`, { uh });
    }

    // Ontology governance gate (when the target state is ratified/active).
    if (record.state === "ratified" || record.state === "active") {
      if (!opts.certification || !this.certifications.verify(opts.certification, { now }).ok) {
        throw new AuthorizationError("commit to ratified/active requires a valid ontology certification", { uh });
      }
      if (opts.certification.unitHash !== uh) throw new AuthorizationError("certification unitHash mismatch", { uh });
      if (!opts.ratification || !this.ratifications.verify(opts.ratification, { now }).ok) {
        throw new AuthorizationError("commit to ratified/active requires a valid ontology ratification (SoD + quorum)", { uh });
      }
      if (opts.ratification.unitHash !== uh || opts.ratification.certificationId !== opts.certification.certificationId) {
        throw new AuthorizationError("ratification does not match certification/unit", { uh });
      }
    }

    // Track ontology lifecycle state (guarded).
    if (this.states.state(uh) === undefined) this.states.start(uh, "draft");
    this.#advanceTo(uh, record.state);

    // PERSIST via Evolution Fabric (the single mutation path; atomic + audited + rollback-capable).
    const write = OntologyStore.evolutionWrite(record);
    const evoUnitHash = await this.#persistViaEvolution(write.key, write.value, now);

    // Ontology audit (write-ahead already emitted by evolution; record the ontology-domain event).
    const stateHash = this.snapshots.capture(record.namespace).stateHash;
    const event = record.state === "active" ? "ONTO_ACTIVATED" : record.state === "ratified" ? "ONTO_RATIFIED" : "ONTO_CREATED";
    this.audit.record({
      at: now,
      event,
      unitHash: uh,
      namespace: record.namespace,
      actor: opts.actor ?? record.source.kind,
      detail: `kind=${record.kind} id=${record.localId} state=${record.state} v=${record.version}`,
      stateHash,
    });
    if (record.supersedes !== undefined) {
      this.audit.record({
        at: now,
        event: "ONTO_SUPERSEDED",
        unitHash: uh,
        namespace: record.namespace,
        actor: opts.actor ?? "system",
        detail: `supersedes=${record.supersedes}`,
      });
    }
    return { ok: true, unitHash: uh, evolutionUnitHash: evoUnitHash, integrity };
  }

  /** Revoke an ontology unit/record (fail-closed on next resolution). Approval-required in production. */
  revoke(kind: "unit" | "record", id: string, by: string): void {
    this.revocations.revoke(kind, id, by);
    this.audit.record({ at: Date.now(), event: "ONTO_REVOKED", unitHash: kind === "unit" ? id : "-", namespace: "-", actor: by, detail: `${kind}:${id}` });
  }

  /** Advance the ontology state machine from its current state up to `target` along legal edges. */
  #advanceTo(uh: string, target: OntologyState): void {
    const path: Record<OntologyState, OntologyState[]> = {
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
      assertTransition(this.states.state(uh) as OntologyState, s);
      this.states.transition(uh, s);
    }
  }

  /** Drive an evolution unit (put-metadata) through the full evolution lifecycle and apply it. */
  async #persistViaEvolution(key: string, value: unknown, now: number): Promise<string> {
    const seq = this.#evoSeq++;
    const evoUnit = createEvolutionUnit({
      unitId: `onto-persist-${seq}-${now}`,
      title: `persist ${key}`,
      changeClass: "routine",
      targets: [{ kind: "metadata", keyPrefix: key }],
      ops: [{ op: "put-metadata", key, value }],
    });
    const evoUnitHash = evolutionUnitHash(evoUnit);
    const proposal = mintEvolutionProposal(this.#sysKey, {
      proposalId: `onto-prop-${seq}`,
      unit: evoUnit,
      proposer: SYS_PROPOSER,
      proposerKeyRef: SYS_KEYREF,
    });
    this.evolution.orchestrator.submit(proposal, now);
    this.evolution.orchestrator.approve(evoUnitHash, SYS_APPROVER);
    const cert = this.evolution.certifications.issue(this.#sysKey, { unitHash: evoUnitHash, caId: "ontology-evo-ca" });
    this.evolution.orchestrator.recordCertification(cert, now);
    const rat = this.evolution.ratifications.issue(this.#sysKey, {
      unitHash: evoUnitHash,
      raId: "ontology-evo-ra",
      proposer: SYS_PROPOSER,
      certifier: SYS_CERTIFIER,
      approvals: [SYS_APPROVER],
      certificationId: cert.certificationId,
    });
    this.evolution.orchestrator.ratify(rat, now);
    const result = await this.evolution.orchestrator.apply(evoUnitHash, { now, actor: SYS_PROPOSER });
    if (result.status !== "applied") {
      throw new ControlValidationError(`ontology persistence rolled back (fail-closed): ${result.reason}`, { key });
    }
    return evoUnitHash;
  }

  /**
   * Verify an inbound bundle, enforce local sovereignty + trust clamp + semantic integrity, then persist
   * via evolution (fail-closed). For federation/import (ONTO-FED-001). A cross-boundary import additionally
   * requires a valid federation re-ratification token.
   */
  async importBundle(
    bundle: OntologyBundle,
    boundaryId: string,
    opts: OntologyCommitOptions & { token?: import("./types.ts").OntologyFederationToken } = {},
  ): Promise<VerificationResult> {
    const now = opts.now ?? Date.now();
    const inbound = this.federationGuard.verifyInbound(bundle, boundaryId, now);
    if (!inbound.ok) return inbound;
    const tok = this.federationGuard.validateToken(opts.token, now);
    if (!tok.ok) return tok;
    // Local sovereignty: a foreign record may not override a local active record.
    if (!this.federationGuard.mayOverrideLocal(bundle.record)) {
      return { ok: false, reason: "local sovereignty: foreign ontology cannot override a local active record" };
    }
    // Clamp trust to the boundary ceiling.
    const clamped = this.federationGuard.clampTrust(bundle.record, boundaryId);
    const record: OntologyRecord = { ...bundle.record, trustLevel: clamped };
    // Semantic-integrity gate applies to imported ontology too (fail-closed).
    const integrity = this.checkIntegrity(record, opts.imports);
    if (!integrity.ok) {
      return { ok: false, reason: `imported ontology failed semantic-integrity gate: ${integrity.violations.filter((v) => v.severity === "block").map((v) => v.check).join(",")}` };
    }
    const write = OntologyStore.evolutionWrite(record);
    await this.#persistViaEvolution(write.key, write.value, now);
    this.audit.record({
      at: now,
      event: "ONTO_FEDERATED",
      unitHash: record.unitHash,
      namespace: record.namespace,
      actor: bundle.issuer,
      detail: `boundary=${boundaryId} clampedTrust=${clamped}`,
    });
    return { ok: true, reason: "bundle imported (trust-clamped, integrity-checked, persisted via evolution)" };
  }

  get substrate(): Substrate {
    return this.#substrate;
  }
}

/** Stand up the PI-8 ontology fabric over an existing substrate. Additive; no core-dir modification. */
export function createOntology(substrate: Substrate, options: OntologyOptions): OntologyControl {
  return new OntologyControl(substrate, options);
}
