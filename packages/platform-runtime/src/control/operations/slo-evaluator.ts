/**
 * UCOS Operational Proof Fabric — SLO Evaluator (OPF-RT-005).
 *
 * Evaluates registry-defined SLOs over a trailing window and computes compliance + remaining error
 * budget. Compliance = the window aggregate satisfies (`lte`/`gte`) the objective. Error budget is
 * derived from the fraction of in-window samples that individually breach the objective versus the
 * allowed budget. Registry-driven; fail-closed (no samples => not compliant, budget unknown as 0).
 */

import type { SloDefinition, SloResult } from "./types.ts";
import type { OperationsRegistry } from "./operations-registry.ts";
import type { MetricStore } from "./metric-store.ts";

function satisfies(value: number, comparison: SloDefinition["comparison"], objective: number): boolean {
  return comparison === "lte" ? value <= objective : value >= objective;
}

export class SloEvaluator {
  readonly #registry: OperationsRegistry;
  readonly #metrics: MetricStore;

  constructor(registry: OperationsRegistry, metrics: MetricStore) {
    this.#registry = registry;
    this.#metrics = metrics;
  }

  evaluateSlo(def: SloDefinition, tenantId: string, now: number): SloResult {
    const fromAt = now - def.windowMs;
    const win = this.#metrics.window(tenantId, def.metric, fromAt, now);
    if (win.length === 0) {
      return { sloId: def.sloId, tenantId, compliant: false, observed: 0, objective: def.objective, budgetRemaining: 0, windowMs: def.windowMs, at: now };
    }
    const observed = this.#metrics.aggregate(tenantId, def.metric, def.aggregate, fromAt, now);
    const compliant = satisfies(observed, def.comparison, def.objective);

    // Per-sample breach fraction vs allowed budget => remaining budget as a fraction (can go negative).
    const breaching = win.filter((p) => !satisfies(p.value, def.comparison, def.objective)).length;
    const breachFraction = breaching / win.length;
    const budgetRemaining = def.budget <= 0 ? (breachFraction > 0 ? -breachFraction : 1) : (def.budget - breachFraction) / def.budget;

    return { sloId: def.sloId, tenantId, compliant, observed, objective: def.objective, budgetRemaining, windowMs: def.windowMs, at: now };
  }

  evaluateTenant(tenantId: string, now: number = Date.now()): SloResult[] {
    return this.#registry.slosForTenant(tenantId).map((d) => this.evaluateSlo(d, tenantId, now));
  }
}
