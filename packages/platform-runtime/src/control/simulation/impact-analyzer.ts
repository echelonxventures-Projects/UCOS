/**
 * UCOS PI-11 Simulation Fabric — M8 Impact Analyzer (C9, SIM-GOV-002 §1.6).
 *
 * Computes deltas/risks between the baseline and a projection and issues an advisory recommendation
 * (`adopt-proposal` | `reject` | `inconclusive`). It is ADVISORY-ONLY — it performs zero governed
 * side effects; the record survives only as an append-only `simulation:impact:*` advisory until
 * Evolution-promoted. Classification is inherited as the MAX of its inputs (S6); emitting an impact at
 * a LOWER classification than its inherited class is DENIED (S6 classification leakage).
 */

import type { SimulationRegistry } from "./simulation-registry.ts";
import type {
  Classification,
  ConstraintResult,
  ImpactDelta,
  ImpactRecord,
  ProjectionRecord,
  SimulationSink,
} from "./types.ts";
import { classRank, maxClass, SimulationError } from "./types.ts";

export class ImpactAnalyzer {
  readonly #registry: SimulationRegistry;
  readonly #sink: SimulationSink | undefined;

  constructor(deps: { registry: SimulationRegistry; sink?: SimulationSink }) {
    this.#registry = deps.registry;
    this.#sink = deps.sink;
  }

  #audit(event: Parameters<SimulationSink["record"]>[0]["event"], runId: string, detail: string): void {
    this.#sink?.record({ at: Date.now(), event, runId, actor: "impact-analyzer", detail });
  }

  assess(args: {
    impactId: string;
    runId: string;
    baselineState: Record<string, unknown>;
    projection: ProjectionRecord;
    constraintResult: ConstraintResult;
    baselineClass: Classification;
    /** Optional requested emit classification; if lower than inherited ⇒ denied (S6). */
    emitClass?: Classification;
  }): ImpactRecord {
    const { baselineState, projection, constraintResult } = args;

    // Classification inheritance (S6): impact ≥ MAX(baseline, projection).
    const inherited = maxClass(args.baselineClass, projection.classification);
    if (args.emitClass !== undefined && classRank(args.emitClass) < classRank(inherited)) {
      this.#audit("DENY", args.runId, `classification leak: emit ${args.emitClass} < inherited ${inherited}`);
      throw new SimulationError("CLASSIFICATION_LEAK", "impact emit classification below inherited class", { runId: args.runId, inherited, emitClass: args.emitClass });
    }

    const deltas: ImpactDelta[] = [];
    const keys = new Set([...Object.keys(baselineState), ...Object.keys(projection.projectedState)]);
    for (const k of keys) {
      const before = baselineState[k];
      const after = projection.projectedState[k];
      if (JSON.stringify(before) !== JSON.stringify(after)) deltas.push({ path: k, before, after });
    }

    const risks: string[] = [];
    if (!projection.valid) risks.push("projection-invalid");
    for (const h of constraintResult.hardFailures) risks.push(`hard-constraint:${h}`);
    for (const inv of constraintResult.invariantFailures) risks.push(`invariant:${inv}`);
    for (const s of constraintResult.softWarnings) risks.push(`soft-warning:${s}`);

    let recommendation: ImpactRecord["recommendation"];
    if (!projection.valid || !constraintResult.ok) recommendation = "reject";
    else if (constraintResult.softWarnings.length > 0) recommendation = "inconclusive";
    else recommendation = "adopt-proposal";

    const rec: ImpactRecord = {
      impactId: args.impactId,
      runId: args.runId,
      deltas,
      risks,
      recommendation,
      classification: inherited,
      advisory: true,
    };
    this.#registry.putImpact(rec);
    this.#audit("IMPACT_ASSESSED", args.runId, `impact ${args.impactId} rec=${recommendation} deltas=${deltas.length}`);
    return rec;
  }
}
