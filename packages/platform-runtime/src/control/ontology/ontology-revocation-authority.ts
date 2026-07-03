/**
 * UCOS Ontology Fabric — Revocation Authority (ONTO-GOV-002 / ONTO-SEC-001).
 *
 * Revokes ontology units/records/certifications/ratifications/authorities. FAIL-CLOSED: if the
 * revocation source is unreachable (partition), the entity is treated as revoked. Entries under
 * `ontology:revoked:<kind>:<id>`.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { RevocableOntologyKind } from "./types.ts";
import type { PartitionMonitor } from "../federation/partition-handling.ts";
import { revokedKey } from "./ontology-namespace.ts";

export class OntologyRevocationAuthority {
  readonly #metadata: MetadataPort;
  readonly #partition: PartitionMonitor | undefined;

  constructor(metadata: MetadataPort, partition?: PartitionMonitor) {
    this.#metadata = metadata;
    this.#partition = partition;
  }

  revoke(kind: RevocableOntologyKind, id: string, by: string): void {
    this.#metadata.put(revokedKey(kind, id), { kind, id, by, at: Date.now() });
  }

  isRevoked(kind: RevocableOntologyKind, id: string): boolean {
    if (this.#partition && !this.#partition.reachable(`ontology-revocation:${kind}`)) return true; // fail-closed
    return this.#metadata.get(revokedKey(kind, id)) !== undefined;
  }
}
