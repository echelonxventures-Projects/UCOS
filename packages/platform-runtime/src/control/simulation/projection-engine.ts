/**
 * UCOS PI-11 Simulation Fabric — M5 Projection Engine (C8, SIM-GOV-002 §1.5).
 *
 * Deterministically steps a materialized baseline forward under a scenario + predictive model, yielding
 * a projected state plus a reproducibility tuple (A2). Determinism-by-default (INV-6): only a
 * deterministic model produces a commit-eligible (`valid`) projection; a non-deterministic contribution
 * is advisory-only (`valid=false`, S3). A projection lacking a resolvable rationale is REJECTED (S10).
 * Same `(snapshot, scenario, model+seed, constraintSet, policy)` ⇒ identical `projectionHash`
 * (re-derivable). Reuses `sha256`/`canonicalize` (no custom cryptography).
 */

import { canonicalize, sha256 } from "../federation/assertions.ts";
import type { SimulationRegistry } from "./simulation-registry.ts";
import type { PredictiveAdapter } from "./predictive-adapter.ts";
import { DigitalTwinManager } from "./digital-twin.ts";
import type {
  Classification,
  ProjectionRecord,
  ReproducibilityTuple,
  ScenarioRecord,
  SignedSnapshot,
  SimulationSink,
} from "./types.ts";
import { maxClass, SimulationError } from "./types.ts";

export interface ProjectArgs {
  runId: string;
  projectionId: string;
  snapshot: SignedSnapshot;
  scenario: ScenarioRecord;
  materializedState: Record<string, unknown>;
  modelId: string;
  seed: string;
  /** Deterministic digest of the policy set in force (part of the reproducibility tuple). */
  policyHash: string;
  horizon?: number;
  rationale?: string;
}

export class ProjectionEngine {
  readonly #registry: SimulationRegistry;
  readonly #adapter: PredictiveAdapter;
  readonly #sink: SimulationSink | undefined;

  constructor(deps: { registry: SimulationRegistry; adapter: PredictiveAdapter; sink?: SimulationSink }) {
    this.#registry = deps.registry;
    this.#adapter = deps.adapter;
    this.#sink = deps.sink;
  }

  #audit(event: Parameters<SimulationSink["record"]>[0]["event"], runId: string, detail: string, reproHash?: string): void {
    this.#sink?.record(reproHash !== undefined ? { at: Date.now(), event, runId, actor: "projection-engine", detail, reproHash } : { at: Date.now(), event, runId, actor: "projection-engine", detail });
  }

  static scenarioHash(scenario: ScenarioRecord): string {
    // Hash the intent, independent of mutable lifecycle state.
    const intent = { scenarioId: scenario.scenarioId, twinId: scenario.twinId, class: scenario.class, interventions: scenario.interventions, budget: scenario.budget, constraintSetId: scenario.constraintSetId };
    return sha256(canonicalize(intent));
  }

  static projectionHash(repro: ReproducibilityTuple, projectedState: Record<string, unknown>): string {
    return sha256(canonicalize({ repro, projectedState }));
  }

  /** Deterministically produce a projection. Fail-closed on budget / rationale / drift. */
  async project(args: ProjectArgs): Promise<ProjectionRecord> {
    const scn = args.scenario;
    const horizon = args.horizon ?? scn.budget.maxHorizon;
    if (horizon > scn.budget.maxHorizon) {
      throw new SimulationError("BUDGET_EXCEEDED", `horizon ${horizon} > budget ${scn.budget.maxHorizon}`, { runId: args.runId });
    }

    const model = this.#adapter.get(args.modelId);
    const forecast = await model.forecast({ baseline: args.materializedState, horizon, seed: args.seed });
    const gate = await this.#adapter.gate(forecast, args.seed);

    const projectedState: Record<string, unknown> = { ...args.materializedState, ...forecast.output };

    const snapshotHash = DigitalTwinManager.snapshotHash(args.snapshot);
    const repro: ReproducibilityTuple = {
      snapshotHash,
      scenarioHash: ProjectionEngine.scenarioHash(scn),
      modelId: args.modelId,
      seed: args.seed,
      constraintSetId: scn.constraintSetId,
      policyHash: args.policyHash,
    };
    const projectionHash = ProjectionEngine.projectionHash(repro, projectedState);

    // S10: a projection MUST carry a resolvable rationale.
    const rationale = args.rationale ?? `deterministic projection of scenario ${scn.scenarioId} over horizon ${horizon} (model ${args.modelId}, seed ${args.seed})`;
    if (!rationale || rationale.trim().length === 0) {
      this.#audit("DENY", args.runId, "projection missing rationale");
      throw new SimulationError("AUDIT_DIVERGENCE", "projection lacks a resolvable rationale", { runId: args.runId });
    }

    // Classification inheritance (S6): projection ≥ MAX(snapshot, scenario) class.
    const classification: Classification = maxClass(args.snapshot.classification, scn.classification);

    // Commit-eligibility: deterministic forecast that passed the adapter gate.
    const valid = forecast.deterministic && gate.committable;

    const rec: ProjectionRecord = {
      projectionId: args.projectionId,
      runId: args.runId,
      projectedState,
      reproducibility: repro,
      projectionHash,
      rationale,
      classification,
      valid,
    };
    this.#registry.putProjection(rec);
    this.#audit("PROJECTED", args.runId, `projection ${args.projectionId} valid=${valid}`, projectionHash);
    return rec;
  }
}
