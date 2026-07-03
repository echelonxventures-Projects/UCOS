/**
 * UCOS B02 Operational Proof Fabric — public surface.
 *
 * Governed, tenant-scoped, tamper-evident operational proof (monitoring, telemetry, observability,
 * audit logs, incident tracking, health monitoring, operational evidence) built additively over the
 * ratified substrate + control + federation + evolution fabrics. Registry-driven, distributed-capable,
 * multi-tenant, real-time. Durable proof mutation routes exclusively through the Evolution Fabric;
 * cryptography is reused from federation (no custom crypto); no substrate core dir is modified.
 */

// Types (explicit to avoid barrel collisions with other fabrics' generic names like VerificationResult).
export type {
  TenantRecord,
  TenantStatus,
  MetricKind,
  MetricPoint,
  TraceSpan,
  LogEvent,
  LogLevel,
  MetricAggregate,
  MetricDefinition,
  HealthState,
  HealthCheckDefinition,
  HealthResult,
  HealthRollup,
  SloComparison,
  SloDefinition,
  SloResult,
  AlertComparison,
  AlertSeverity,
  AlertRuleDefinition,
  AlertPhase,
  AlertEvent,
  IncidentState,
  IncidentSeverity,
  IncidentEvent,
  IncidentRecord,
  ProofKind,
  ProofState,
  ProofUnit,
  ProofRecord,
  ProofPower,
  ProofAuthorityStatus,
  ProofAuthorityRecord,
  ProofAttestation,
  ProofSeal,
  ProofBundle,
  MetricQuery,
  IncidentQuery,
  ProofQuery,
  OperationsAuditEvent,
  OperationsAuditEntry,
} from "./types.ts";

// Namespace helpers
export {
  ROOT,
  tenantKey,
  metricDefKey,
  healthDefKey,
  sloDefKey,
  alertDefKey,
  authorityKey,
  proofKey,
  proofIdPrefix,
  proofTenantPrefix,
  incidentKey,
  incidentIdPrefix,
  incidentTenantPrefix,
  revokedKey,
  assertOperationsNamespace,
  namespacedId,
  parseNamespacedId,
} from "./operations-namespace.ts";

// Registry (registry-driven definitions)
export { OperationsRegistry, scopeMatches } from "./operations-registry.ts";

// Real-time plane
export { MetricStore, aggregate } from "./metric-store.ts";
export { TelemetryIngest } from "./telemetry-ingest.ts";
export type { IngestStats } from "./telemetry-ingest.ts";
export { ObservabilityEngine } from "./observability-engine.ts";
export type { ObservationSnapshot, MetricSummary, TraceTreeNode } from "./observability-engine.ts";
export { HealthMonitor } from "./health-monitor.ts";
export { SloEvaluator } from "./slo-evaluator.ts";
export { AlertEngine } from "./alert-engine.ts";

// Incident tracking
export { canTransition, assertTransition, isTerminal } from "./incident-lifecycle.ts";
export { IncidentStateMachine } from "./incident-state-machine.ts";
export { IncidentTracker } from "./incident-tracker.ts";
export type { OpenIncidentInput } from "./incident-tracker.ts";

// Proof plane (durable evidence)
export { unitHash, validateUnit, createUnit } from "./proof-unit.ts";
export { createProofRecord, PROOF_RECORD_SCHEMA } from "./proof-record.ts";
export type { CreateProofRecordOptions } from "./proof-record.ts";
export { ProofAttestationAuthority, ProofSealAuthority } from "./proof-authority.ts";
export { OperationsRevocationAuthority } from "./operations-revocation-authority.ts";
export type { RevocableOperationsKind } from "./operations-revocation-authority.ts";
export { OperationsStore } from "./operations-store.ts";
export { OperationsQueryEngine } from "./operations-query-engine.ts";
export { OperationsSnapshot } from "./operations-snapshot.ts";
export type { OperationsSnapshotResult } from "./operations-snapshot.ts";
export { OperationsFederationGuard } from "./operations-federation-guard.ts";

// Audit
export { OperationsAuditLog, OPS_GENESIS_HASH } from "./operations-audit-log.ts";
export type { OperationsChainedEntry, OpsDivergence, OpsReconciliationResult } from "./operations-audit-log.ts";

// Control assembly + evolution integration
export { OperationsControl, createOperations } from "./operations-control.ts";
export type { OperationsOptions, AttestOptions } from "./operations-control.ts";
