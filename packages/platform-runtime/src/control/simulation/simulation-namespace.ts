/**
 * UCOS PI-11 Simulation Fabric — reserved metadata namespaces (AD-0022 §2, boundary B4).
 *
 * Every simulation write is confined to one of these `simulation:*` namespaces; run writes are
 * confined to the disposable `simulation:sandbox:<runId>:*` keyspace (enforced by M2's static guard).
 */

export const SIM_PREFIX = "simulation:";

export const AUTHORITY_PREFIX = "simulation:authority:";
export const TWIN_PREFIX = "simulation:twin:";
export const SCENARIO_PREFIX = "simulation:scenario:";
export const MODEL_PREFIX = "simulation:model:";
export const RUN_PREFIX = "simulation:run:";
export const PROJECTION_PREFIX = "simulation:projection:";
export const IMPACT_PREFIX = "simulation:impact:";
export const BOUNDARY_PREFIX = "simulation:boundary:";
export const REVOKED_PREFIX = "simulation:revoked:";

export function authorityKey(id: string): string {
  return `${AUTHORITY_PREFIX}${id}`;
}
export function twinKey(id: string): string {
  return `${TWIN_PREFIX}${id}`;
}
export function scenarioKey(id: string): string {
  return `${SCENARIO_PREFIX}${id}`;
}
export function modelKey(id: string): string {
  return `${MODEL_PREFIX}${id}`;
}
export function runKey(id: string): string {
  return `${RUN_PREFIX}${id}`;
}
export function projectionKey(id: string): string {
  return `${PROJECTION_PREFIX}${id}`;
}
export function impactKey(id: string): string {
  return `${IMPACT_PREFIX}${id}`;
}
export function revokedKey(kind: string, id: string): string {
  return `${REVOKED_PREFIX}${kind}:${id}`;
}
export function foreignPrefix(nodeId: string): string {
  return `simulation:foreign:${nodeId}:`;
}
export function foreignKey(nodeId: string, tail: string): string {
  return `${foreignPrefix(nodeId)}${tail}`;
}

/** The disposable per-run sandbox keyspace root. All run writes MUST start with this. */
export function sandboxPrefix(runId: string): string {
  return `simulation:sandbox:${runId}:`;
}

/** The set of allowed top-level namespaces (AD-0022 §2), used by write-confinement checks. */
export const ALLOWED_NAMESPACE_PREFIXES: readonly string[] = [
  AUTHORITY_PREFIX,
  TWIN_PREFIX,
  SCENARIO_PREFIX,
  MODEL_PREFIX,
  RUN_PREFIX,
  PROJECTION_PREFIX,
  IMPACT_PREFIX,
  BOUNDARY_PREFIX,
  REVOKED_PREFIX,
  "simulation:foreign:",
  "simulation:sandbox:",
];

/** True iff `key` falls within an AD-0022 §2 allowed simulation namespace. */
export function isAllowedNamespace(key: string): boolean {
  return ALLOWED_NAMESPACE_PREFIXES.some((p) => key.startsWith(p));
}
