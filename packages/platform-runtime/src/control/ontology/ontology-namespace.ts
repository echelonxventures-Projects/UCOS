/**
 * UCOS Ontology Fabric — Namespace addressing & key helpers (ONTO-ARCH-001 §2).
 *
 * Canonical metadata keys under the reserved `ontology:` namespace. The keyspace is disjoint from
 * PI-4/PI-7 keys so existing queries never collide. Foreign/federated ids are `<homeDomain>::<localId>`
 * (namespace isolation → local-shadows-foreign resolution); local ids never contain `::`.
 */

import type { SemVer } from "../../contracts/types.ts";
import type { OntologyKind, OntologyKindTag } from "./types.ts";
import { ControlValidationError } from "../errors.ts";

export const RECORD_PREFIX = "ontology:record:";
export const NAMESPACE_PREFIX = "ontology:namespace:";
export const AUTHORITY_PREFIX = "ontology:authority:";
export const BOUNDARY_PREFIX = "ontology:boundary:";
export const REVOKED_PREFIX = "ontology:revoked:";
export const FEDERATION_PREFIX = "ontology:federation:";

const KIND_TAG: Record<OntologyKind, OntologyKindTag> = {
  entity: "entity",
  relationship: "rel",
  taxonomy: "tax",
  constraint: "constraint",
};

export function kindTag(kind: OntologyKind): OntologyKindTag {
  return KIND_TAG[kind];
}

/** `ontology:record:<namespaceTail>:<tag>:<localId>@<version>`. */
export function recordKey(namespace: string, kind: OntologyKind, localId: string, version: SemVer): string {
  return `${RECORD_PREFIX}${nsTail(namespace)}:${kindTag(kind)}:${localId}@${version}`;
}

/** Prefix for all versions of a `(kind, localId)` within a namespace. */
export function recordIdPrefix(namespace: string, kind: OntologyKind, localId: string): string {
  return `${RECORD_PREFIX}${nsTail(namespace)}:${kindTag(kind)}:${localId}@`;
}

/** Prefix for every record in a namespace subtree. */
export function recordNamespacePrefix(namespace: string): string {
  return `${RECORD_PREFIX}${nsTail(namespace)}`;
}

/** Prefix for every record of a kind within a namespace. */
export function recordKindPrefix(namespace: string, kind: OntologyKind): string {
  return `${RECORD_PREFIX}${nsTail(namespace)}:${kindTag(kind)}:`;
}

export function namespaceKey(namespace: string): string {
  return `${NAMESPACE_PREFIX}${nsTail(namespace)}`;
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

/** Namespace tail = the namespace with the reserved `ontology:` root stripped. */
export function nsTail(namespace: string): string {
  if (!namespace.startsWith("ontology:")) {
    throw new ControlValidationError(`namespace must start with 'ontology:': ${namespace}`, { namespace });
  }
  return namespace.slice("ontology:".length);
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
