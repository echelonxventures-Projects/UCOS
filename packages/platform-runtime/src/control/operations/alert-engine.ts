/**
 * UCOS Operational Proof Fabric — Alert Engine (OPF-RT-006).
 *
 * Evaluates registry-defined alert rules against the real-time metric store and emits state-change
 * events only (firing -> resolved edge detection with per-rule dedup). Registry-driven thresholds;
 * multi-tenant scoped. The engine is pure evaluation + edge detection — persistence/incident linkage
 * is decided by the control layer (rules with `autoIncident` are surfaced to the caller).
 */

import type { AlertComparison, AlertEvent, AlertRuleDefinition } from "./types.ts";
import type { OperationsRegistry } from "./operations-registry.ts";
import type { MetricStore } from "./metric-store.ts";

function compare(value: number, comparison: AlertComparison, threshold: number): boolean {
  switch (comparison) {
    case "lt":
      return value < threshold;
    case "lte":
      return value <= threshold;
    case "gt":
      return value > threshold;
    case "gte":
      return value >= threshold;
    case "eq":
      return value === threshold;
    default:
      return false;
  }
}

let alertSeq = 0;

export class AlertEngine {
  readonly #registry: OperationsRegistry;
  readonly #metrics: MetricStore;
  // (tenantId\u0000ruleId) -> currently firing?
  readonly #firing = new Map<string, boolean>();

  constructor(registry: OperationsRegistry, metrics: MetricStore) {
    this.#registry = registry;
    this.#metrics = metrics;
  }

  #key(tenantId: string, ruleId: string): string {
    return `${tenantId}\u0000${ruleId}`;
  }

  isFiring(tenantId: string, ruleId: string): boolean {
    return this.#firing.get(this.#key(tenantId, ruleId)) ?? false;
  }

  /** Evaluate one rule; returns a phase-change event only on a firing<->resolved edge (else undefined). */
  evaluateRule(def: AlertRuleDefinition, tenantId: string, now: number): AlertEvent | undefined {
    const observed = this.#metrics.aggregate(tenantId, def.metric, def.aggregate, now - def.windowMs, now);
    const breach = compare(observed, def.comparison, def.threshold);
    const key = this.#key(tenantId, def.ruleId);
    const wasFiring = this.#firing.get(key) ?? false;
    if (breach === wasFiring) return undefined; // no edge
    this.#firing.set(key, breach);
    return {
      alertId: `alert-${alertSeq++}-${now}`,
      ruleId: def.ruleId,
      tenantId,
      severity: def.severity,
      phase: breach ? "firing" : "resolved",
      observed,
      threshold: def.threshold,
      at: now,
      reason: `${def.metric} ${def.aggregate} ${observed} ${def.comparison} ${def.threshold} => ${breach ? "breach" : "cleared"}`,
    };
  }

  /** Evaluate all in-scope rules for a tenant; returns only phase-change events. */
  evaluateTenant(tenantId: string, now: number = Date.now()): AlertEvent[] {
    const out: AlertEvent[] = [];
    for (const def of this.#registry.alertRulesForTenant(tenantId)) {
      const ev = this.evaluateRule(def, tenantId, now);
      if (ev) out.push(ev);
    }
    return out;
  }

  /** Rule lookup helper (control layer uses `autoIncident` to decide incident creation). */
  rule(tenantId: string, ruleId: string): AlertRuleDefinition | undefined {
    return this.#registry.alertRulesForTenant(tenantId).find((r) => r.ruleId === ruleId);
  }
}
