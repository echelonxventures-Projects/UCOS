/**
 * UCOS Federation Fabric — Revocation Authority & revocation list (FED-GOV-C8).
 *
 * Empowered to revoke identities, trust delegations, certifications, and memberships. Revocations
 * PROPAGATE and are FAIL-CLOSED: an entity whose revocation state cannot be determined (authority
 * unreachable) is treated as revoked. Authority records under `federation:revocation-authority:<id>`;
 * revocation entries under `federation:revoked:<kind>:<id>`.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { RevocableKind, RevocationAuthorityRecord } from "./types.ts";
import type { PartitionMonitor } from "./partition-handling.ts";
import { ControlValidationError } from "../errors.ts";

const AUTH_PREFIX = "federation:revocation-authority:";
const REVOKED_PREFIX = "federation:revoked:";

export class RevocationAuthorityRegistry {
  readonly #metadata: MetadataPort;
  readonly #partition: PartitionMonitor | undefined;

  constructor(metadata: MetadataPort, partition?: PartitionMonitor) {
    this.#metadata = metadata;
    this.#partition = partition;
  }

  registerAuthority(record: RevocationAuthorityRecord): RevocationAuthorityRecord {
    if (!record.revAuthorityId) throw new ControlValidationError("Revocation authority requires revAuthorityId", { record });
    this.#metadata.put(`${AUTH_PREFIX}${record.revAuthorityId}`, record);
    return record;
  }

  getAuthority(revAuthorityId: string): RevocationAuthorityRecord | undefined {
    return this.#metadata.get(`${AUTH_PREFIX}${revAuthorityId}`)?.value as RevocationAuthorityRecord | undefined;
  }

  /** Record a revocation (append-only fact). */
  revoke(kind: RevocableKind, id: string, by: string): void {
    this.#metadata.put(`${REVOKED_PREFIX}${kind}:${id}`, { kind, id, by, at: Date.now() });
  }

  /**
   * Fail-closed revocation check. If the revocation source for `kind` is unreachable (partition),
   * the entity is treated as REVOKED (deny). Otherwise, revoked iff an entry exists.
   */
  isRevoked(kind: RevocableKind, id: string): boolean {
    if (this.#partition && !this.#partition.reachable(`revocation:${kind}`)) return true; // fail-closed
    return this.#metadata.get(`${REVOKED_PREFIX}${kind}:${id}`) !== undefined;
  }
}
