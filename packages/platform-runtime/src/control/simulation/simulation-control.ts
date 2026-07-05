/**
 * UCOS PI-11 Simulation Fabric — M13 Assembly (SIM-ARCH-001 §1).
 *
 * `createSimulationFabric(substrate, control, fabrics, options)` wires M0..M12 into a cohesive fabric
 * over the EXISTING substrate + PI-4 control + PI-6 evolution (+ optional PI-5 federation / PI-7
 * knowledge). It is purely additive: it consumes only PUBLIC seams and holds no independent commit
 * path (all governed change flows through the Evolution Fabric). Deny-by-default with ZERO hardcoded
 * authorities/policies/models — every authority, twin, scenario, and model is registered at runtime as
 * an approval-required act (AD-0009 / SIM-COND-7).
 */

import type { ConfigurationPort, MetadataPort, RegistryPort } from "../../meta-core/ports.ts";
import type { ControlFabric } from "../bootstrap.ts";
import type { EvolutionFabric } from "../evolution/index.ts";
import type { FederationFabric } from "../federation/federated-control-plane.ts";
import { KeyRegistry, NonceCache } from "../federation/assertions.ts";

import { SimulationRegistry } from "./simulation-registry.ts";
import { SandboxManager } from "./sandbox.ts";
import { SimulationAuditLog } from "./simulation-audit-log.ts";
import { DigitalTwinManager } from "./digital-twin.ts";
import { ScenarioEngine } from "./scenario-engine.ts";
import { PredictiveAdapter } from "./predictive-adapter.ts";
import { ConstraintEvaluator } from "./constraint-evaluator.ts";
import { ProjectionEngine } from "./projection-engine.ts";
import { ImpactAnalyzer } from "./impact-analyzer.ts";
import { FederationGuard } from "./federation-guard.ts";
import { RevocationAuthority } from "./revocation-authority.ts";
import { PromotionPipeline } from "./promotion-pipeline.ts";
import type { DeterministicVerifier, PredictiveModel, SimulationAuthorityRecord, SimulationSink } from "./types.ts";
import { SimulationError } from "./types.ts";

export interface SimulationSubstratePorts {
  registry: RegistryPort;
  metadata: MetadataPort;
  configuration: ConfigurationPort;
}

export interface SimulationUpstreamFabrics {
  evolution: EvolutionFabric;
  federation?: FederationFabric;
  /** Read-only knowledge query surface (kept opaque; simulation never writes knowledge). */
  knowledge?: unknown;
}

export interface SimulationOptions {
  nodeId?: string;
  keys?: KeyRegistry;
  nonces?: NonceCache;
  verifier?: DeterministicVerifier;
  auditSink?: SimulationSink;
  predictiveModels?: PredictiveModel[];
  boundaryMaxTrust?: number;
  delegationMax?: number;
  /** FDG-ONT provider binding — MUST remain false during PI-11 (deferred). */
  ontologyBound?: boolean;
}

/** Runtime authority facade (D1). Registration is approval-required; commit powers are impossible. */
export class SimulationAuthorityManager {
  readonly #registry: SimulationRegistry;
  readonly #sink: SimulationSink | undefined;

  constructor(registry: SimulationRegistry, sink?: SimulationSink) {
    this.#registry = registry;
    this.#sink = sink;
  }

  register(rec: SimulationAuthorityRecord, approvedBy: string): SimulationAuthorityRecord {
    if (!approvedBy || approvedBy.trim().length === 0) {
      throw new SimulationError("SIMULATION_DENIED", "authority registration is approval-required (AD-0009)", { authorityId: rec.authorityId });
    }
    // Enumerated powers only; a commit/actuate power is not expressible (B5). Defense-in-depth check:
    const ALLOWED = new Set(["scenario", "decision", "revocation", "federated-simulation"]);
    for (const p of rec.powers) {
      if (!ALLOWED.has(p)) {
        throw new SimulationError("SIMULATION_DENIED", `illegal simulation power '${p}' (no commit power)`, { authorityId: rec.authorityId });
      }
    }
    this.#registry.putAuthority({ ...rec, status: rec.status ?? "active" });
    this.#sink?.record({ at: Date.now(), event: "AUTHORITY_REGISTERED", actor: approvedBy, detail: `authority ${rec.authorityId} powers=[${rec.powers.join(",")}]` });
    return rec;
  }

  get(id: string): SimulationAuthorityRecord | undefined {
    return this.#registry.getAuthority(id);
  }

  revoke(id: string): void {
    const rec = this.#registry.getAuthority(id);
    if (rec) this.#registry.putAuthority({ ...rec, status: "revoked" });
  }
}

export interface SimulationFabric {
  audit: SimulationAuditLog;
  registry: SimulationRegistry;
  sandbox: SandboxManager;
  authorities: SimulationAuthorityManager;
  twins: DigitalTwinManager;
  scenarios: ScenarioEngine;
  adapter: PredictiveAdapter;
  constraints: ConstraintEvaluator;
  projection: ProjectionEngine;
  impact: ImpactAnalyzer;
  federationGuard: FederationGuard;
  revocations: RevocationAuthority;
  promotion: PromotionPipeline;
  keys: KeyRegistry;
  nonces: NonceCache;
}

export function createSimulationFabric(
  substrate: SimulationSubstratePorts,
  control: ControlFabric,
  fabrics: SimulationUpstreamFabrics,
  options: SimulationOptions = {},
): SimulationFabric {
  const nodeId = options.nodeId ?? "node-local";
  const keys = options.keys ?? fabrics.evolution.keys ?? new KeyRegistry();
  const nonces = options.nonces ?? new NonceCache();
  const audit = options.auditSink instanceof SimulationAuditLog ? options.auditSink : new SimulationAuditLog(nodeId);
  const sink: SimulationSink = options.auditSink ?? audit;

  const registry = new SimulationRegistry(substrate.metadata);
  const sandbox = new SandboxManager(sink);
  const authorities = new SimulationAuthorityManager(registry, sink);
  const twins = new DigitalTwinManager({ registry, keys, nonces, sink });
  const scenarios = new ScenarioEngine({ registry, sink });
  const adapter = new PredictiveAdapter({ registry, sink, ...(options.verifier ? { verifier: options.verifier } : {}) });
  const constraints = new ConstraintEvaluator({ sink, ontologyBound: options.ontologyBound ?? false });
  const projection = new ProjectionEngine({ registry, adapter, sink });
  const impact = new ImpactAnalyzer({ registry, sink });
  const federationGuard = new FederationGuard({
    keys,
    metadata: substrate.metadata,
    sink,
    ...(options.boundaryMaxTrust !== undefined ? { boundaryMaxTrust: options.boundaryMaxTrust } : {}),
    ...(options.delegationMax !== undefined ? { delegationMax: options.delegationMax } : {}),
  });
  const revocations = new RevocationAuthority({ metadata: substrate.metadata, sink });
  const promotion = new PromotionPipeline({ policy: control.policyEvaluator, evolution: fabrics.evolution, revocations, sink });

  // Register any provided deterministic models (non-deterministic ones are denied by the adapter).
  for (const m of options.predictiveModels ?? []) adapter.register(m);

  return { audit, registry, sandbox, authorities, twins, scenarios, adapter, constraints, projection, impact, federationGuard, revocations, promotion, keys, nonces };
}
