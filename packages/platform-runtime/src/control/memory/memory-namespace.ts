/**
 * UCOS Memory Fabric — Namespace addressing & key helpers (MEM-ARCH-001).
 *
 * Canonical metadata keys under the reserved `memory:` namespace. Namespace isolation keeps a
 * foreign/federated id from colliding with the local keyspace (federated memory lives under
 * `federation:<nodeId>:memory:*`, and federated ids are `nodeId::localId`).
 */

import type { SemVer } from "../../contracts/types.ts";
import { ControlValidationError } from "../errors.ts";

export const RECORD_PREFIX = "memory:record:";
export const AUTHORITY_PREFIX = "memory:authority:";
export const BOUNDARY_PREFIX = "memory:boundary:";
export const REVOKED_PREFIX = "memory:revoked:";

/** `memory:record:<namespaceTail>:<memId>@<version>` — namespace already carries the `memory:` root. */
export function recordKey(namespace: string, memId: string, version: SemVer): string {
  return `${RECORD_PREFIX}${nsTail(namespace)}:${memId}@${version}`;
}

/** Prefix for all versions of a memory id within a namespace. */
export function recordIdPrefix(namespace: string, memId: string): string {
  return `${RECORD_PREFIX}${nsTail(namespace)}:${memId}@`;
}

/** Prefix for all records within a namespace (or namespace subtree). */
export function recordNamespacePrefix(namespace: string): string {
  return `${RECORD_PREFIX}${nsTail(namespace)}`;
}

export function authorityKey(authorityId: string): string {
  return `${AUTHORITY_PREFIX}${authorityId}`;
}

export function boundaryKey(boundaryId: string): string {
  return `${BOUNDARY_PREFIX}${boundaryId}`;
}

export function revokedKey(kind: string, id: string): string {
  return `${REVOKED_PREFIX}${kind}:${id}`;
}

/** Namespace tail = the namespace with the reserved `memory:` root stripped. */
export function nsTail(namespace: string): string {
  if (!namespace.startsWith("memory:")) {
    throw new ControlValidationError(`namespace must start with 'memory:': ${namespace}`, { namespace });
  }
  return namespace.slice("memory:".length);
}

/** Federated principal/id form. */
export function namespacedId(nodeId: string, localId: string): string {
  return `${nodeId}::${localId}`;
}

export function parseNamespacedId(id: string): { nodeId: string; localId: string } | undefined {
  const idx = id.indexOf("::");
  if (idx < 0) return undefined;
  return { nodeId: id.slice(0, idx), localId: id.slice(idx + 2) };
}
