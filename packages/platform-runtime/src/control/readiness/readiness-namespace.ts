/**
 * UCOS Readiness Fabric — Namespace addressing & key helpers (RDN-ARCH-001).
 *
 * Canonical metadata keys under the reserved `readiness:` namespace. Namespace isolation keeps
 * readiness governance/config, signals, assessments, and certifications from colliding with any
 * other fabric's keyspace.
 */

export const DIMENSION_PREFIX = "readiness:dimension:";
export const CRITERION_PREFIX = "readiness:criterion:";
export const CONTROL_PREFIX = "readiness:control:";
export const REQUIREMENT_PREFIX = "readiness:requirement:";
export const AUTHORITY_PREFIX = "readiness:authority:";
export const SIGNAL_PREFIX = "readiness:signal:";
export const EVIDENCE_PREFIX = "readiness:evidence:";
export const ASSESSMENT_PREFIX = "readiness:assessment:";
export const CERTIFICATION_PREFIX = "readiness:certification:";
export const REVOKED_PREFIX = "readiness:revoked:";
export const META_KEY = "readiness:meta:governance";

export function dimensionKey(dimensionId: string): string {
  return `${DIMENSION_PREFIX}${dimensionId}`;
}

export function criterionKey(criterionId: string): string {
  return `${CRITERION_PREFIX}${criterionId}`;
}

export function controlKey(controlId: string): string {
  return `${CONTROL_PREFIX}${controlId}`;
}

export function requirementKey(requirementId: string): string {
  return `${REQUIREMENT_PREFIX}${requirementId}`;
}

export function authorityKey(authorityId: string): string {
  return `${AUTHORITY_PREFIX}${authorityId}`;
}

/** `readiness:signal:<dimensionId>:<signalId>` — grouped by dimension for efficient prefix scans. */
export function signalKey(dimensionId: string, signalId: string): string {
  return `${SIGNAL_PREFIX}${dimensionId}:${signalId}`;
}

export function signalDimensionPrefix(dimensionId: string): string {
  return `${SIGNAL_PREFIX}${dimensionId}:`;
}

export function evidenceKey(key: string): string {
  return `${EVIDENCE_PREFIX}${key}`;
}

export function assessmentKey(assessmentId: string): string {
  return `${ASSESSMENT_PREFIX}${assessmentId}`;
}

export function certificationKey(certificationId: string): string {
  return `${CERTIFICATION_PREFIX}${certificationId}`;
}

export function revokedKey(kind: string, id: string): string {
  return `${REVOKED_PREFIX}${kind}:${id}`;
}
