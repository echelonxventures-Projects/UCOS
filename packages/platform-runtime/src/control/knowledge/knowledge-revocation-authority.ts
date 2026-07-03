/**
 * UCOS Knowledge Fabric — Revocation Authority (KNOW-GOV-002 / KNOW-SEC-001).
 *
 * Revokes knowledge units/records/certifications/ratifications/authorities. FAIL-CLOSED: if the
 * revocation source is unreachable (partition), the entity is treated as revoked. Entries under
 * `knowledge:revoked:<kind>:<id>`.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { RevocableKnowledgeKind } from "./types.ts";
import type { PartitionMonitor } from "../federation/partition-handling.ts";
import { revokedKey } from "./knowledge-namespace.ts";

export class KnowledgeRevocationAuthority {
  readonly #metadata: MetadataPort;
  readonly #partition: PartitionMonitor | undefined;

  constructor(metadata: MetadataPort, partition?: PartitionMonitor) {
    this.#metadata = metadata;
    this.#partition = partition;
  }

  revoke(kind: RevocableKnowledgeKind, id: string, by: string): void {
    this.#metadata.put(revokedKey(kind, id), { kind, id, by, at: Date.now() });
  }

  isRevoked(kind: RevocableKnowledgeKind, id: string): boolean {
    if (this.#partition && !this.#partition.reachable(`knowledge-revocation:${kind}`)) return true; // fail-closed
    return this.#metadata.get(revokedKey(kind, id)) !== undefined;
  }
}
