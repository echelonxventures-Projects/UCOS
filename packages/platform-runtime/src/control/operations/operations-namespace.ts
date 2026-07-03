/**
 * UCOS Operational Proof Fabric — Namespace addressing & key helpers (OPF-ARCH-001).
 *
 * Canonical metadata keys under the reserved `operations:` namespace. Every durable key is
 * tenant-partitioned so a tenant's proof/incidents cannot collide with another tenant's keyspace
 * (multi-tenant isolation). Federated ids use the `nodeId::localId` form.
 */

import type { SemVer } from "../../contracts/types.ts";
import { ControlValidationError } from "../errors.ts";

export const ROOT = "operations:";

export const TENANT_PREFIX = "operations:tenant:";
export const METRIC_DEF_PREFIX = "operations:metric-def:";
export const HEALTH_DEF_PREFIX = "operations:health-check:";
export const SLO_DEF_PREFIX = "operations:slo:";
export const ALERT_DEF_PREFIX = "operations:alert-rule:";
export const AUTHORITY_PREFIX = "operations:authority:";
export const PROOF_PREFIX = "operations:proof:";
export const INCIDENT_PREFIX = "operations:incident:";
export const REVOKED_PREFIX = "operations:revoked:";

export function tenantKey(tenantId: string): string {
  return `${TENANT_PREFIX}${tenantId}`;
}

export function metricDefKey(metricId: string): string {
  return `${METRIC_DEF_PREFIX}${metricId}`;
}

export function healthDefKey(checkId: string): string {
  return `${HEALTH_DEF_PREFIX}${checkId}`;
}

export function sloDefKey(sloId: string): string {
  return `${SLO_DEF_PREFIX}${sloId}`;
}

export function alertDefKey(ruleId: string): string {
  return `${ALERT_DEF_PREFIX}${ruleId}`;
}

export function authorityKey(authorityId: string): string {
  return `${AUTHORITY_PREFIX}${authorityId}`;
}

/** `operations:proof:<tenant>:<proofId>@<version>`. */
export function proofKey(tenantId: string, proofId: string, version: SemVer): string {
  return `${PROOF_PREFIX}${tenantId}:${proofId}@${version}`;
}

/** Prefix for all versions of a single proof id within a tenant. */
export function proofIdPrefix(tenantId: string, proofId: string): string {
  return `${PROOF_PREFIX}${tenantId}:${proofId}@`;
}

/** Prefix for all proof records within a tenant. */
export function proofTenantPrefix(tenantId: string): string {
  return `${PROOF_PREFIX}${tenantId}:`;
}

/** `operations:incident:<tenant>:<incidentId>@<version>`. */
export function incidentKey(tenantId: string, incidentId: string, version: SemVer): string {
  return `${INCIDENT_PREFIX}${tenantId}:${incidentId}@${version}`;
}

export function incidentIdPrefix(tenantId: string, incidentId: string): string {
  return `${INCIDENT_PREFIX}${tenantId}:${incidentId}@`;
}

export function incidentTenantPrefix(tenantId: string): string {
  return `${INCIDENT_PREFIX}${tenantId}:`;
}

export function revokedKey(kind: string, id: string): string {
  return `${REVOKED_PREFIX}${kind}:${id}`;
}

/** Validate that a namespace is rooted under `operations:` (fail-closed on foreign roots). */
export function assertOperationsNamespace(namespace: string): void {
  if (!namespace.startsWith(ROOT)) {
    throw new ControlValidationError(`namespace must start with 'operations:': ${namespace}`, { namespace });
  }
}

export function namespacedId(nodeId: string, localId: string): string {
  return `${nodeId}::${localId}`;
}

export function parseNamespacedId(id: string): { nodeId: string; localId: string } | undefined {
  const idx = id.indexOf("::");
  if (idx < 0) return undefined;
  return { nodeId: id.slice(0, idx), localId: id.slice(idx + 2) };
}
