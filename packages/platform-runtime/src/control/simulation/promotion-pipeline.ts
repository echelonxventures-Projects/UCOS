/**
 * UCOS PI-11 Simulation Fabric — M11 Promotion Pipeline (SIM-GOV-002 §3).
 *
 * The single, deny-by-default path from an advisory projection/impact to a governed change. It does
 * NOT hold any commit power: every governed mutation is routed through the ratified PI-6 Evolution
 * Fabric (B5 — Evolution-only commit; the fabric has no independent write/rollback path). Gates, in
 * order and all fail-closed:
 *   1. Revocation      — no artifact in the chain is revoked (S9-adjacent, fail-closed).
 *   2. Validity        — projection.valid && impact.recommendation === "adopt-proposal" (S4).
 *   3. Reproducibility — re-derived projection hash matches (A2 / S3 / S10).
 *   4. Separation of duties — certifier ≠ modeller (S8); the sim authority has no commit power.
 *   5. PI-4 policy     — deny-by-default authorization via the unchanged PolicyEvaluator (S4).
 *   6. Evolution commit — submit → approve → certify → ratify → atomic apply (PI-6).
 * Any gate failure aborts with NO commit and a typed, audited error.
 */

import type { DecisionContext } from "../types.ts";
import type { PolicyEvaluator } from "../policy/policy-evaluator.ts";
import type { EvolutionFabric } from "../evolution/index.ts";
import type {
  EvolutionCertification,
  EvolutionProposal,
  EvolutionRatification,
} from "../evolution/index.ts";
import type { RevocationAuthority } from "./revocation-authority.ts";
import type { ImpactRecord, ProjectionRecord, ScenarioRecord, SimulationSink } from "./types.ts";
import { SimulationError } from "./types.ts";

export interface PromotionRequest {
  runId: string;
  scenario: ScenarioRecord;
  projection: ProjectionRecord;
  impact: ImpactRecord;
  /** The modeller/proposer principal (the sim authority owner). SoD: certifier MUST differ. */
  modeller: string;
  certifier: string;
  approver: string;
  /** PI-4 authorization context for the governed change target (deny-by-default). */
  decisionContext: DecisionContext;
  /** Signed Evolution governance artifacts (approval-required acts, AD-0009). */
  proposal: EvolutionProposal;
  certification: EvolutionCertification;
  ratification: EvolutionRatification;
  /** Reproducibility gate: re-derive the projection and compare hashes. */
  reDerive: () => Promise<ProjectionRecord>;
  now?: number;
}

export interface PromotionResult {
  committed: boolean;
  unitHash: string;
  reason: string;
}

export class PromotionPipeline {
  readonly #policy: PolicyEvaluator;
  readonly #evolution: EvolutionFabric;
  readonly #revocations: RevocationAuthority;
  readonly #sink: SimulationSink | undefined;

  constructor(deps: {
    policy: PolicyEvaluator;
    evolution: EvolutionFabric;
    revocations: RevocationAuthority;
    sink?: SimulationSink;
  }) {
    this.#policy = deps.policy;
    this.#evolution = deps.evolution;
    this.#revocations = deps.revocations;
    this.#sink = deps.sink;
  }

  #deny(runId: string, reason: string, code: SimulationError["code"] = "SIMULATION_DENIED"): never {
    this.#sink?.record({ at: Date.now(), event: "PROMOTION_DENIED", runId, actor: "promotion-pipeline", detail: reason });
    throw new SimulationError(code, reason, { runId });
  }

  async promote(req: PromotionRequest): Promise<PromotionResult> {
    const now = req.now ?? Date.now();

    // Gate 1 — revocation (fail-closed).
    this.#revocations.assertNoneRevoked([
      { kind: "run", id: req.runId },
      { kind: "scenario", id: req.scenario.scenarioId },
      { kind: "twin", id: req.scenario.twinId },
      { kind: "model", id: req.projection.reproducibility.modelId },
    ]);

    // Gate 2 — validity (S4): only a valid, adopt-recommended projection may proceed.
    if (!req.projection.valid) this.#deny(req.runId, "projection is invalid (non-promotable)", "CONSTRAINT_VIOLATION");
    if (req.impact.recommendation !== "adopt-proposal") {
      this.#deny(req.runId, `impact recommendation is '${req.impact.recommendation}', not adopt-proposal`);
    }

    // Gate 3 — reproducibility (A2/S3/S10): re-derive and compare.
    const rederived = await req.reDerive();
    if (rederived.projectionHash !== req.projection.projectionHash) {
      this.#deny(req.runId, "reproducibility gate failed: re-derived projection hash differs", "AUDIT_DIVERGENCE");
    }

    // Gate 4 — separation of duties (S8): certifier must not be the modeller; proposer is the modeller.
    if (req.certifier === req.modeller) this.#deny(req.runId, "SoD violation: certifier == modeller", "SEPARATION_OF_DUTIES");
    if (req.proposal.proposer !== req.modeller) this.#deny(req.runId, "proposer must be the modeller", "SEPARATION_OF_DUTIES");

    // Gate 5 — PI-4 policy (deny-by-default). The PEP decision path is unchanged.
    const decision = this.#policy.evaluate(req.decisionContext);
    if (decision.effect !== "allow") this.#deny(req.runId, `policy denied: ${decision.reason}`);

    // Gate 6 — Evolution-only commit. The pipeline never mutates governed state itself.
    const orch = this.#evolution.orchestrator;
    orch.submit(req.proposal, now);
    orch.approve(req.proposal.unitHash, req.approver);
    orch.recordCertification(req.certification, now);
    orch.ratify(req.ratification, now);
    const applied = await orch.apply(req.proposal.unitHash, { now, actor: req.modeller });

    const committed = applied.status === "applied";
    this.#sink?.record({
      at: Date.now(),
      event: committed ? "PROMOTED" : "PROMOTION_DENIED",
      runId: req.runId,
      actor: req.modeller,
      detail: `evolution ${applied.status} unit=${req.proposal.unitHash}`,
      reproHash: req.projection.projectionHash,
    });
    if (!committed) this.#deny(req.runId, `evolution apply did not commit: ${applied.reason}`);
    return { committed, unitHash: req.proposal.unitHash, reason: applied.reason };
  }
}
