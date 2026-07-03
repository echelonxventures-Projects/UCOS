/**
 * UCOS Operational Proof Fabric — Revocation Authority (OPF-SEC-003).
 *
 * Revokes proofs/incidents/attestations/seals/authorities. FAIL-CLOSED: if the revocation source is
 * unreachable (partition), the entity is treated as revoked. Entries under `operations:revoked:<kind>:<id>`.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { PartitionMonitor } from "../federation/partition-handling.ts";
import { revokedKey } from "./operations-namespace.ts";

export type RevocableOperationsKind = "proof" | "incident" | "attestation" | "seal" | "authority";

export class OperationsRevocationAuthority {
  readonly #metadata: MetadataPort;
  readonly #partition: PartitionMonitor | undefined;

  constructor(metadata: MetadataPort, partition?: PartitionMonitor) {
    this.#metadata = metadata;
    this.#partition = partition;
  }

  revoke(kind: RevocableOperationsKind, id: string, by: string): void {
    this.#metadata.put(revokedKey(kind, id), { kind, id, by, at: Date.now() });
  }

  isRevoked(kind: RevocableOperationsKind, id: string): boolean {
    if (this.#partition && !this.#partition.reachable(`operations-revocation:${kind}`)) return true; // fail-closed
    return this.#metadata.get(revokedKey(kind, id)) !== undefined;
  }
}
