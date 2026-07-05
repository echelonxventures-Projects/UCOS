/**
 * UCOS PI-11 Simulation Fabric — M6 Predictive Adapter (C5, SGP-3 / FDG-INT).
 *
 * Holds the predictive-model registry and the adapter interface. Only DETERMINISTIC models are
 * commit-eligible; registering a NON-DETERMINISTIC model is DENIED — that binding is deferred behind
 * FDG-INT until PI-10 (Intelligence) is implemented, ratified, and separately authorized (AD-0022).
 * The `DeterministicVerifier` seam exists so a future non-deterministic contribution can be gated as
 * advisory-only, but it is inert during PI-11 (no non-det model can be registered).
 */

import type { SimulationRegistry } from "./simulation-registry.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";
import type {
  DeterministicVerifier,
  ForecastResult,
  PredictiveModel,
  SimulationSink,
  VerifierAttestation,
} from "./types.ts";
import { SimulationError } from "./types.ts";

export class PredictiveAdapter {
  readonly #registry: SimulationRegistry;
  readonly #sink: SimulationSink | undefined;
  readonly #verifier: DeterministicVerifier | undefined;
  readonly #models = new Map<string, PredictiveModel>();

  constructor(deps: { registry: SimulationRegistry; sink?: SimulationSink; verifier?: DeterministicVerifier }) {
    this.#registry = deps.registry;
    this.#sink = deps.sink;
    this.#verifier = deps.verifier;
  }

  #audit(event: Parameters<SimulationSink["record"]>[0]["event"], detail: string): void {
    this.#sink?.record({ at: Date.now(), event, actor: "predictive-adapter", detail });
  }

  /**
   * Register a predictive model (D4, approval-required). FDG-INT: a non-deterministic model is DENIED.
   */
  register(model: PredictiveModel): void {
    if (model.kind === "non-deterministic") {
      this.#audit("DENY", `FDG-INT: non-deterministic model ${model.modelId} registration denied`);
      throw new SimulationError("FDG_UNBOUND", "FDG-INT: non-deterministic model binding is deferred (PI-10 not bound)", { modelId: model.modelId });
    }
    this.#models.set(model.modelId, model);
    this.#registry.putModel({ modelId: model.modelId, kind: "deterministic", status: "active" });
  }

  get(modelId: string): PredictiveModel {
    const m = this.#models.get(modelId);
    if (!m) throw new SimulationError("SIMULATION_VALIDATION_FAILED", `unknown model ${modelId}`, { modelId });
    const rec = this.#registry.getModel(modelId);
    if (!rec || rec.status !== "active") {
      throw new SimulationError("SIMULATION_DENIED", `model ${modelId} is not active`, { modelId });
    }
    return m;
  }

  has(modelId: string): boolean {
    return this.#models.has(modelId);
  }

  /**
   * Gate a forecast result. A deterministic result is commit-eligible. A non-deterministic result is
   * commit-eligible ONLY with a valid verifier attestation; otherwise it is advisory-only (S3). During
   * PI-11 no non-deterministic model can be registered, so this returns `false` for non-det without a
   * verifier (fail-closed).
   */
  async gate(result: ForecastResult, seed: string): Promise<{ committable: boolean; attestation?: VerifierAttestation }> {
    if (result.deterministic) return { committable: true };
    if (!this.#verifier) return { committable: false };
    const attestation = await this.#verifier.attest(result, seed);
    if (!attestation) return { committable: false };
    // The attestation must bind the exact output (tamper/detachment resistance).
    if (attestation.outputHash !== sha256(canonicalize(result.output))) return { committable: false };
    return { committable: true, attestation };
  }
}

/** A minimal deterministic model: a pure function of `(baseline, horizon, seed)`. */
export function deterministicModel(
  modelId: string,
  fn: (baseline: Record<string, unknown>, horizon: number, seed: string) => Record<string, unknown>,
): PredictiveModel {
  return {
    modelId,
    kind: "deterministic",
    async forecast(input) {
      return { modelId, output: fn(input.baseline, input.horizon, input.seed), deterministic: true };
    },
  };
}
