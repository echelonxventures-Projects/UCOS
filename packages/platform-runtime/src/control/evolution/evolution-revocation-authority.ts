/**
 * UCOS Evolution Fabric — Revocation Authority (EVO-GOV-001 / EVO-SEC-001).
 *
 * Revokes proposals, certifications, ratifications, authorities, or applied units. Revocation is
 * FAIL-CLOSED: if the revocation source is unreachable (partition), the entity is treated as revoked.
 * Revocation entries under `evolution:revoked:<kind>:<id>`.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { RevocableEvoKind } from "./types.ts";
import type { PartitionMonitor } from "../federation/partition-handling.ts";

const REVOKED_PREFIX = "evolution:revoked:";

export class EvolutionRevocationAuthority {
  readonly #metadata: MetadataPort;
  readonly #partition: PartitionMonitor | undefined;

  constructor(metadata: MetadataPort, partition?: PartitionMonitor) {
    this.#metadata = metadata;
    this.#partition = partition;
  }

  /** Record a revocation (append-only fact). */
  revoke(kind: RevocableEvoKind, id: string, by: string): void {
    this.#metadata.put(`${REVOKED_PREFIX}${kind}:${id}`, { kind, id, by, at: Date.now() });
  }

  /**
   * Fail-closed revocation check. If the revocation source for `kind` is unreachable, the entity is
   * treated as REVOKED (deny). Otherwise, revoked iff an entry exists.
   */
  isRevoked(kind: RevocableEvoKind, id: string): boolean {
    if (this.#partition && !this.#partition.reachable(`evolution-revocation:${kind}`)) return true; // fail-closed
    return this.#metadata.get(`${REVOKED_PREFIX}${kind}:${id}`) !== undefined;
  }
}
