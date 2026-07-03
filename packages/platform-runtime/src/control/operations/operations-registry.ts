/**
 * UCOS Operational Proof Fabric — Registry (OPF-GOV-001).
 *
 * Metadata-backed, registry-DRIVEN definitions: tenants, metric definitions, health checks, SLOs,
 * alert rules, and proof authorities. There are NO hardcoded thresholds, tenants, or authorities —
 * every operational rule is runtime data resolved from the substrate Metadata runtime. Registration
 * is an Approval-Required governance-setup operation (not a governed proof mutation).
 *
 * Deny-by-default multi-tenancy: an unknown/suspended tenant confers nothing; a definition applies to
 * a tenant only when its `tenantScope` is "*" or the exact tenantId.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type {
  AlertRuleDefinition,
  HealthCheckDefinition,
  MetricDefinition,
  ProofAuthorityRecord,
  ProofPower,
  SloDefinition,
  TenantRecord,
} from "./types.ts";
import {
  alertDefKey,
  authorityKey,
  healthDefKey,
  metricDefKey,
  sloDefKey,
  tenantKey,
  ALERT_DEF_PREFIX,
  HEALTH_DEF_PREFIX,
  METRIC_DEF_PREFIX,
  SLO_DEF_PREFIX,
} from "./operations-namespace.ts";
import { ControlValidationError } from "../errors.ts";

/** A definition applies to a tenant when scope is global (`*`) or equals the tenant. */
export function scopeMatches(tenantScope: string, tenantId: string): boolean {
  return tenantScope === "*" || tenantScope === tenantId;
}

export class OperationsRegistry {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  // ------------------------------ Tenants ------------------------------

  registerTenant(record: Omit<TenantRecord, "status"> & { status?: TenantRecord["status"] }): TenantRecord {
    if (!record.tenantId) throw new ControlValidationError("Tenant requires tenantId", { record });
    if (!Number.isFinite(record.maxTrustLevel) || record.maxTrustLevel < 0) {
      throw new ControlValidationError("Tenant maxTrustLevel must be a non-negative number", { record });
    }
    const r = record.retention;
    if (!r || r.metricSamples <= 0 || r.spans <= 0 || r.logs <= 0) {
      throw new ControlValidationError("Tenant retention capacities must be positive (bounded real-time plane)", { record });
    }
    const full: TenantRecord = { ...record, status: record.status ?? "active" };
    this.#metadata.put(tenantKey(record.tenantId), full);
    return full;
  }

  getTenant(tenantId: string): TenantRecord | undefined {
    return this.#metadata.get(tenantKey(tenantId))?.value as TenantRecord | undefined;
  }

  /** Fail-closed tenant admission: must exist AND be active. */
  isTenantActive(tenantId: string): boolean {
    return this.getTenant(tenantId)?.status === "active";
  }

  suspendTenant(tenantId: string): void {
    const t = this.getTenant(tenantId);
    if (!t) throw new ControlValidationError(`Unknown tenant "${tenantId}"`, { tenantId });
    this.#metadata.put(tenantKey(tenantId), { ...t, status: "suspended" });
  }

  tenantMaxTrust(tenantId: string): number {
    return this.getTenant(tenantId)?.maxTrustLevel ?? 0; // absent => 0 (deny-by-default)
  }

  // ------------------------------ Metric definitions ------------------------------

  registerMetric(def: MetricDefinition): MetricDefinition {
    if (!def.metricId || !def.unit) throw new ControlValidationError("MetricDefinition requires metricId and unit", { def });
    this.#metadata.put(metricDefKey(def.metricId), def);
    return def;
  }

  getMetric(metricId: string): MetricDefinition | undefined {
    return this.#metadata.get(metricDefKey(metricId))?.value as MetricDefinition | undefined;
  }

  metricsForTenant(tenantId: string): MetricDefinition[] {
    return this.#metadata
      .query(METRIC_DEF_PREFIX)
      .map((r) => r.value as MetricDefinition)
      .filter((d) => scopeMatches(d.tenantScope, tenantId));
  }

  // ------------------------------ Health checks ------------------------------

  registerHealthCheck(def: HealthCheckDefinition): HealthCheckDefinition {
    if (!def.checkId || !def.metric) throw new ControlValidationError("HealthCheckDefinition requires checkId and metric", { def });
    if (def.windowMs <= 0 || def.ttlMs <= 0) throw new ControlValidationError("HealthCheck windowMs/ttlMs must be positive", { def });
    this.#metadata.put(healthDefKey(def.checkId), def);
    return def;
  }

  healthChecksForTenant(tenantId: string): HealthCheckDefinition[] {
    return this.#metadata
      .query(HEALTH_DEF_PREFIX)
      .map((r) => r.value as HealthCheckDefinition)
      .filter((d) => scopeMatches(d.tenantScope, tenantId));
  }

  // ------------------------------ SLOs ------------------------------

  registerSlo(def: SloDefinition): SloDefinition {
    if (!def.sloId || !def.metric) throw new ControlValidationError("SloDefinition requires sloId and metric", { def });
    if (def.windowMs <= 0) throw new ControlValidationError("SLO windowMs must be positive", { def });
    if (def.budget < 0 || def.budget > 1) throw new ControlValidationError("SLO budget must be within [0,1]", { def });
    this.#metadata.put(sloDefKey(def.sloId), def);
    return def;
  }

  slosForTenant(tenantId: string): SloDefinition[] {
    return this.#metadata
      .query(SLO_DEF_PREFIX)
      .map((r) => r.value as SloDefinition)
      .filter((d) => scopeMatches(d.tenantScope, tenantId));
  }

  // ------------------------------ Alert rules ------------------------------

  registerAlertRule(def: AlertRuleDefinition): AlertRuleDefinition {
    if (!def.ruleId || !def.metric) throw new ControlValidationError("AlertRuleDefinition requires ruleId and metric", { def });
    if (def.windowMs <= 0) throw new ControlValidationError("AlertRule windowMs must be positive", { def });
    this.#metadata.put(alertDefKey(def.ruleId), def);
    return def;
  }

  alertRulesForTenant(tenantId: string): AlertRuleDefinition[] {
    return this.#metadata
      .query(ALERT_DEF_PREFIX)
      .map((r) => r.value as AlertRuleDefinition)
      .filter((d) => scopeMatches(d.tenantScope, tenantId));
  }

  // ------------------------------ Proof authorities ------------------------------

  registerAuthority(
    record: Omit<ProofAuthorityRecord, "status"> & { status?: ProofAuthorityRecord["status"] },
  ): ProofAuthorityRecord {
    if (!record.authorityId || !record.owner || !record.keyRef) {
      throw new ControlValidationError("Proof authority requires authorityId, owner, keyRef", { record });
    }
    if (!Array.isArray(record.powers) || record.powers.length === 0) {
      throw new ControlValidationError("Proof authority requires enumerated powers (no implicit authority)", { record });
    }
    const full: ProofAuthorityRecord = { ...record, status: record.status ?? "active" };
    this.#metadata.put(authorityKey(record.authorityId), full);
    return full;
  }

  getAuthority(authorityId: string): ProofAuthorityRecord | undefined {
    return this.#metadata.get(authorityKey(authorityId))?.value as ProofAuthorityRecord | undefined;
  }

  /** Authority must exist, be active, hold the power, and be scoped to the tenant (fail-closed). */
  hasPower(authorityId: string, power: ProofPower, tenantId: string): boolean {
    const a = this.getAuthority(authorityId);
    return !!a && a.status === "active" && a.powers.includes(power) && scopeMatches(a.tenantScope, tenantId);
  }

  revokeAuthority(authorityId: string): void {
    const a = this.getAuthority(authorityId);
    if (!a) throw new ControlValidationError(`Unknown proof authority "${authorityId}"`, { authorityId });
    this.#metadata.put(authorityKey(authorityId), { ...a, status: "revoked" });
  }
}
