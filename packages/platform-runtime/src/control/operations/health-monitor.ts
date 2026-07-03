/**
 * UCOS Operational Proof Fabric — Health Monitor (OPF-RT-004).
 *
 * Evaluates registry-defined health checks against the real-time metric store and rolls per-component
 * results up to a tenant health state. Registry-driven (thresholds/windows are data, not code) and
 * fail-closed on missing data: a check with no fresh sample within its TTL evaluates to `unknown`
 * (never silently `healthy`). The rollup is the payload of a health-attestation proof.
 */

import type { HealthCheckDefinition, HealthResult, HealthRollup, HealthState } from "./types.ts";
import type { OperationsRegistry } from "./operations-registry.ts";
import type { MetricStore } from "./metric-store.ts";

function worst(a: HealthState, b: HealthState): HealthState {
  const rank: Record<HealthState, number> = { healthy: 0, degraded: 1, unhealthy: 2, unknown: 3 };
  return rank[b] > rank[a] ? b : a;
}

export class HealthMonitor {
  readonly #registry: OperationsRegistry;
  readonly #metrics: MetricStore;

  constructor(registry: OperationsRegistry, metrics: MetricStore) {
    this.#registry = registry;
    this.#metrics = metrics;
  }

  /** Evaluate one health check for a tenant against the trailing window. */
  evaluateCheck(def: HealthCheckDefinition, tenantId: string, now: number): HealthResult {
    const fresh = this.#metrics.window(tenantId, def.metric, now - def.ttlMs, now);
    if (fresh.length === 0) {
      return { checkId: def.checkId, tenantId, component: def.component, state: "unknown", observed: undefined, reason: "no fresh sample within TTL", at: now };
    }
    const observed = this.#metrics.aggregate(tenantId, def.metric, def.aggregate, now - def.windowMs, now);
    const belowMin = def.min !== undefined && observed < def.min;
    const aboveMax = def.max !== undefined && observed > def.max;
    if (belowMin || aboveMax) {
      const bound = belowMin ? `< min ${def.min}` : `> max ${def.max}`;
      return { checkId: def.checkId, tenantId, component: def.component, state: def.severityOnFail, observed, reason: `observed ${observed} ${bound}`, at: now };
    }
    return { checkId: def.checkId, tenantId, component: def.component, state: "healthy", observed, reason: "within bounds", at: now };
  }

  /** Evaluate all in-scope checks and roll up to a tenant health state (worst-of). */
  evaluateTenant(tenantId: string, now: number = Date.now()): HealthRollup {
    const defs = this.#registry.healthChecksForTenant(tenantId);
    const checks = defs.map((d) => this.evaluateCheck(d, tenantId, now));
    let state: HealthState = checks.length === 0 ? "unknown" : "healthy";
    for (const c of checks) state = worst(state, c.state);
    return { tenantId, state, checks, at: now };
  }
}
