/**
 * UCOS Knowledge Fabric — Namespace addressing & key helpers (KNOW-ARCH-001).
 *
 * Canonical metadata keys under the reserved `knowledge:` namespace. Namespace isolation prevents a
 * foreign/federated id from colliding with the local keyspace (federated ids are `nodeId::localId`).
 */

import type { SemVer } from "../../contracts/types.ts";
import { ControlValidationError } from "../errors.ts";

export const RECORD_PREFIX = "knowledge:record:";
export const AUTHORITY_PREFIX = "knowledge:authority:";
export const BOUNDARY_PREFIX = "knowledge:boundary:";
export const REVOKED_PREFIX = "knowledge:revoked:";

/** `knowledge:record:<namespaceTail>:<id>@<version>` — namespace already carries the `knowledge:` root. */
export function recordKey(namespace: string, knowledgeId: string, version: SemVer): string {
  return `${RECORD_PREFIX}${nsTail(namespace)}:${knowledgeId}@${version}`;
}

/** Prefix for all versions of a knowledge id within a namespace. */
export function recordIdPrefix(namespace: string, knowledgeId: string): string {
  return `${RECORD_PREFIX}${nsTail(namespace)}:${knowledgeId}@`;
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

/** Namespace tail = the namespace with the reserved `knowledge:` root stripped. */
export function nsTail(namespace: string): string {
  if (!namespace.startsWith("knowledge:")) {
    throw new ControlValidationError(`namespace must start with 'knowledge:': ${namespace}`, { namespace });
  }
  return namespace.slice("knowledge:".length);
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
