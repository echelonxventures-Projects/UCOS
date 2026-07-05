/**
 * UCOS PI-11 Simulation Fabric — public surface (AD-0022, conditional scoped Article IX release).
 *
 * A governed what-if / projection layer built additively over the AD-0016..0020 substrate/control/
 * federation/evolution/knowledge fabrics. Deterministic-by-default, deny-by-default, fail-closed,
 * snapshot-isolated, non-actuating; all governed change routes through the PI-6 Evolution Fabric.
 * Reuses federation cryptography (no custom crypto). No substrate core dir is modified. The
 * Intelligence (FDG-INT), Memory (FDG-MEM), and Ontology (FDG-ONT) couplings are inert seams.
 */

// Types, enums, errors, and additive async seams (M0).
export type {
  SimulationErrorCode,
  Classification,
  SimulationPower,
  SimulationAuthorityStatus,
  SimulationAuthorityRecord,
  TwinState,
  SignedSnapshot,
  DigitalTwinRecord,
  ScenarioClass,
  ScenarioState,
  Intervention,
  SimulationBudget,
  ScenarioRecord,
  ForecastInput,
  ForecastResult,
  PredictiveModel,
  DeterministicVerifier,
  VerifierAttestation,
  PredictiveModelStatus,
  PredictiveModelRecord,
  ConstraintKind,
  Constraint,
  ConstraintSet,
  ConstraintResult,
  ReproducibilityTuple,
  ProjectionRecord,
  ImpactRecommendation,
  ImpactDelta,
  ImpactRecord,
  RunState,
  SimulationRunRecord,
  SimAuditEvent,
  SimAuditEntry,
  SimulationSink,
  SnapshotSource,
} from "./types.ts";
export { SimulationError, CLASS_ORDER, classRank, maxClass } from "./types.ts";

// Namespaces (M1 support).
export * from "./simulation-namespace.ts";

// Registry (M1), Sandbox (M2), Audit (M12).
export { SimulationRegistry } from "./simulation-registry.ts";
export { SandboxManager } from "./sandbox.ts";
export type { SandboxHandle } from "./sandbox.ts";
export { SimulationAuditLog, SIM_GENESIS_HASH } from "./simulation-audit-log.ts";
export type { SimChainedEntry } from "./simulation-audit-log.ts";

// Digital twin (M3), Scenario (M4).
export { DigitalTwinManager } from "./digital-twin.ts";
export { ScenarioEngine } from "./scenario-engine.ts";

// Projection (M5), Predictive adapter (M6), Constraint evaluator (M7).
export { ProjectionEngine } from "./projection-engine.ts";
export type { ProjectArgs } from "./projection-engine.ts";
export { PredictiveAdapter, deterministicModel } from "./predictive-adapter.ts";
export { ConstraintEvaluator } from "./constraint-evaluator.ts";

// Impact (M8), Federation guard (M10), Revocation (M9).
export { ImpactAnalyzer } from "./impact-analyzer.ts";
export { FederationGuard } from "./federation-guard.ts";
export type { ForeignContribution, AdmittedForeign } from "./federation-guard.ts";
export { RevocationAuthority } from "./revocation-authority.ts";
export type { RevocableSimKind } from "./revocation-authority.ts";

// Promotion pipeline (M11).
export { PromotionPipeline } from "./promotion-pipeline.ts";
export type { PromotionRequest, PromotionResult } from "./promotion-pipeline.ts";

// Assembly (M13).
export {
  createSimulationFabric,
  SimulationAuthorityManager,
} from "./simulation-control.ts";
export type {
  SimulationFabric,
  SimulationOptions,
  SimulationSubstratePorts,
  SimulationUpstreamFabrics,
} from "./simulation-control.ts";
