/**
 * UCOS Memory Fabric — Revocation Authority (MEM-GOV-001 C8 / MEM-SEC-001).
 *
 * Revokes memory units/records/certifications/ratifications/authorities. FAIL-CLOSED: if the
 * revocation source is unreachable (partition), the entity is treated as revoked. Entries under
 * `memory:revoked:<kind>:<id>`. Revocation propagates to recall (query engine excludes revoked) and
 * underpins audit-preserving forgetting (the VALUE becomes unrecallable; the audit fact is retained).
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { RevocableMemoryKind } from "./types.ts";
import type { PartitionMonitor } from "../federation/partition-handling.ts";
import { revokedKey } from "./memory-namespace.ts";

export class MemoryRevocation {
  readonly #metadata: MetadataPort;
  readonly #partition: PartitionMonitor | undefined;

  constructor(metadata: MetadataPort, partition?: PartitionMonitor) {
    this.#metadata = metadata;
    this.#partition = partition;
  }

  revoke(kind: RevocableMemoryKind, id: string, by: string): void {
    this.#metadata.put(revokedKey(kind, id), { kind, id, by, at: Date.now() });
  }

  isRevoked(kind: RevocableMemoryKind, id: string): boolean {
    if (this.#partition && !this.#partition.reachable(`memory-revocation:${kind}`)) return true; // fail-closed
    return this.#metadata.get(revokedKey(kind, id)) !== undefined;
  }
}
