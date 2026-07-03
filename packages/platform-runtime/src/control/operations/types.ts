/**
 * UCOS B02 Operational Proof Fabric — shared types (OPF-ARCH-001).
 *
 * The Operational Proof Fabric turns operational activity into GOVERNED, TENANT-SCOPED,
 * TAMPER-EVIDENT PROOF. It has two planes:
 *
 *   1. Real-time plane (ephemeral, high-volume): telemetry ingestion, metric time-series,
 *      trace/log correlation, health monitoring, SLO evaluation, and alerting. Bounded,
 *      backpressure-aware, in-memory ring buffers — no governed mutation, no evolution.
 *
 *   2. Proof plane (durable, low-volume): operational evidence and incident records are signed,
 *      versioned, hash-chained, and persisted through the ratified Evolution Fabric (snapshot ->
 *      atomic apply -> audited -> rollback-capable). This is the "proof" — an independently
 *      verifiable record that operations were observed, evaluated, and handled.
 *
 * Registry-driven (no hardcoded thresholds/tenants), distributed-capable (per-node audit chains +
 * cross-node reconciliation + signed evidence bundles), multi-tenant (deny-by-default tenant
 * isolation with per-tenant trust clamps), real-time (bounded ring buffers, streaming aggregation).
 *
 * Additive over substrate + control + federation + evolution fabrics; reuses federation cryptography
 * (no custom crypto); modifies no substrate core dir.
 */

import type { SemVer } from "../../contracts/types.ts";
import type { Provenance } from "../types.ts";

// ------------------------------ Tenancy ------------------------------

export type TenantStatus = "active" | "suspended";

export interface TenantRecord {
  tenantId: string;
  displayName: string;
  status: TenantStatus;
  /** Clamps any conferred proof trust for this tenant boundary (deny-by-default; OPF5). */
  maxTrustLevel: number;
  /** Bounded real-time retention (ring-buffer capacities) — real-time plane is never unbounded. */
  retention: { metricSamples: number; spans: number; logs: number };
}

// ------------------------------ Real-time signals ------------------------------

export type MetricKind = "gauge" | "counter" | "histogram";

export interface MetricPoint {
  tenantId: string;
  metric: string; // MetricDefinition.metricId
  value: number;
  at: number; // epoch ms
  labels?: Record<string, string>;
  source?: string; // emitting node/component id
}

export interface TraceSpan {
  tenantId: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  startedAt: number;
  endedAt: number;
  status: "ok" | "error";
  attributes?: Record<string, string | number | boolean>;
}

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogEvent {
  tenantId: string;
  at: number;
  level: LogLevel;
  message: string;
  component?: string;
  traceId?: string;
  fields?: Record<string, unknown>;
}

// ------------------------------ Registry-driven definitions ------------------------------

export type MetricAggregate = "count" | "sum" | "avg" | "min" | "max" | "p50" | "p95" | "p99" | "last";

export interface MetricDefinition {
  metricId: string;
  kind: MetricKind;
  unit: string; // e.g. "ms", "requests", "ratio"
  description?: string;
  tenantScope: string; // tenantId or "*"
}

export type HealthState = "healthy" | "degraded" | "unhealthy" | "unknown";

export interface HealthCheckDefinition {
  checkId: string;
  component: string;
  tenantScope: string;
  metric: string; // metric observed for this check
  aggregate: MetricAggregate; // aggregate over the freshness window
  windowMs: number;
  /** Inclusive bounds; a value outside [min,max] fails the check. */
  min?: number;
  max?: number;
  /** Latest sample must be no older than this to be considered fresh (else `unknown`). */
  ttlMs: number;
  severityOnFail: "degraded" | "unhealthy";
}

export type SloComparison = "lte" | "gte";

export interface SloDefinition {
  sloId: string;
  tenantScope: string;
  metric: string;
  aggregate: MetricAggregate;
  comparison: SloComparison; // aggregate `comparison` objective => compliant
  objective: number;
  windowMs: number;
  /** Error-budget as a fraction of the window's evaluations (0..1). */
  budget: number;
}

export type AlertComparison = "lt" | "lte" | "gt" | "gte" | "eq";
export type AlertSeverity = "info" | "warn" | "critical";

export interface AlertRuleDefinition {
  ruleId: string;
  tenantScope: string;
  metric: string;
  aggregate: MetricAggregate;
  comparison: AlertComparison;
  threshold: number;
  windowMs: number;
  severity: AlertSeverity;
  /** Open an incident automatically when this rule fires. */
  autoIncident?: boolean;
}

// ------------------------------ Derived real-time results ------------------------------

export interface HealthResult {
  checkId: string;
  tenantId: string;
  component: string;
  state: HealthState;
  observed: number | undefined;
  reason: string;
  at: number;
}

export interface HealthRollup {
  tenantId: string;
  state: HealthState;
  checks: HealthResult[];
  at: number;
}

export interface SloResult {
  sloId: string;
  tenantId: string;
  compliant: boolean;
  observed: number;
  objective: number;
  /** Remaining error budget as a fraction (0..1); negative means exhausted/breached. */
  budgetRemaining: number;
  windowMs: number;
  at: number;
}

export type AlertPhase = "firing" | "resolved";

export interface AlertEvent {
  alertId: string;
  ruleId: string;
  tenantId: string;
  severity: AlertSeverity;
  phase: AlertPhase;
  observed: number;
  threshold: number;
  at: number;
  reason: string;
}

// ------------------------------ Incident tracking ------------------------------

export type IncidentState = "open" | "acknowledged" | "mitigated" | "resolved" | "closed";
export type IncidentSeverity = AlertSeverity;

export interface IncidentEvent {
  at: number;
  state: IncidentState;
  actor: string;
  note?: string;
}

export interface IncidentRecord {
  incidentId: string;
  version: SemVer;
  tenantId: string;
  title: string;
  severity: IncidentSeverity;
  state: IncidentState;
  openedAt: number;
  /** Alert ids / evidence proof-ids linked to this incident. */
  linkedAlerts: string[];
  linkedEvidence: string[];
  timeline: IncidentEvent[];
  provenance: Provenance;
}

// ------------------------------ Operational evidence (proof plane) ------------------------------

export type ProofKind =
  | "telemetry-snapshot"
  | "health-attestation"
  | "slo-attestation"
  | "incident-evidence"
  | "custom";

export type ProofState = "draft" | "attested" | "sealed";

export interface ProofUnit {
  unitId: string;
  tenantId: string;
  kind: ProofKind;
  namespace: string; // e.g. "operations:proof:<tenant>"
  payload: unknown; // the evidence content (aggregates, health rollup, slo status, incident summary)
  capturedAt: number;
}

export interface ProofRecord {
  proofId: string;
  version: SemVer;
  tenantId: string;
  namespace: string;
  unitHash: string;
  unit: ProofUnit;
  kind: ProofKind;
  state: ProofState;
  trustLevel: number;
  provenance: Provenance;
  /** Operational state hash captured at attestation (binds proof to observed state). */
  stateHash?: string;
  source: { kind: "local" | "federated" | "import"; nodeId?: string };
}

// ------------------------------ Proof authorities & signed artifacts ------------------------------

export type ProofPower = "attest" | "seal" | "revoke" | "audit";
export type ProofAuthorityStatus = "active" | "revoked";

export interface ProofAuthorityRecord {
  authorityId: string;
  owner: string; // principal id
  powers: ProofPower[]; // enumerated; no implicit powers
  keyRef: string; // public key by ref (no key material inline)
  tenantScope: string; // tenantId or "*"
  status: ProofAuthorityStatus;
}

export interface ProofAttestation {
  attestationId: string;
  unitHash: string;
  paId: string; // proof authority id
  attester: string; // principal id
  attesterKeyRef: string;
  verdict: "pass" | "fail";
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  signature?: string;
}

/** Second-signature seal (separation of duties) that promotes an attested proof to sealed. */
export interface ProofSeal {
  sealId: string;
  unitHash: string;
  paId: string;
  sealer: string;
  sealerKeyRef: string;
  attester: string; // must differ from sealer (SoD)
  attestationId: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  signature?: string;
}

/** Signed evidence bundle exchanged across nodes (distributed proof federation). */
export interface ProofBundle {
  record: ProofRecord;
  issuer: string; // authorityId
  issuerKeyRef: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  signature?: string;
}

// ------------------------------ Queries ------------------------------

export interface MetricQuery {
  tenantId: string;
  metric: string;
  fromAt?: number;
  toAt?: number;
  aggregate?: MetricAggregate;
  labelMatch?: Record<string, string>;
}

export interface IncidentQuery {
  tenantId: string;
  state?: IncidentState;
  minSeverity?: IncidentSeverity;
  openOnly?: boolean;
}

export interface ProofQuery {
  tenantId: string;
  kind?: ProofKind;
  state?: ProofState;
  fromAt?: number;
  toAt?: number;
}

// ------------------------------ Audit ------------------------------

export type OperationsAuditEvent =
  | "OPS_PROOF_ATTESTED"
  | "OPS_PROOF_SEALED"
  | "OPS_PROOF_EXCHANGED"
  | "OPS_INCIDENT_OPENED"
  | "OPS_INCIDENT_TRANSITIONED"
  | "OPS_INCIDENT_CLOSED"
  | "OPS_ALERT_FIRED"
  | "OPS_ALERT_RESOLVED"
  | "OPS_HEALTH_CHANGED"
  | "OPS_SLO_BREACH"
  | "OPS_RECONCILED"
  | "OPS_REVOKED";

export interface OperationsAuditEntry {
  at: number;
  event: OperationsAuditEvent;
  tenantId: string;
  subject: string; // proofId / incidentId / ruleId / sloId / checkId
  actor: string;
  detail: string;
  stateHash?: string;
}

// ------------------------------ Results ------------------------------

export interface VerificationResult {
  ok: boolean;
  reason: string;
}
