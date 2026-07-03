/**
 * UCOS Federation Fabric — Federated Identity Provider (FED-ARCH async-ingestion + sync-read).
 *
 * Implements the EXISTING synchronous `IdentityProvider` seam (registered on the PI-4
 * IdentityRegistry). It reads identities the FederationResolver has already verified and materialized
 * into the substrate Metadata runtime under the disjoint `federation:<nodeId>:identity:<localId>`
 * keyspace (FED-PROV-001). Stale (expired) or revoked materializations resolve to `undefined` =>
 * deny-by-default (fail-closed). Local ids never contain "::", so foreign records can never shadow
 * local ones (local-shadows-foreign is structural).
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { IdentityProvider, IdentityRecord } from "../types.ts";
import type { RevocationAuthorityRegistry } from "./revocation-authority.ts";
import { parseNamespacedId } from "./types.ts";

export interface MaterializedIdentity {
  record: IdentityRecord;
  materializedAt: number;
  expiresAt: number; // hard expiry (min of assertion expiry and materialization TTL)
  trustLevel: number; // clamped federated trust level
}

export function materializedKey(nodeId: string, localId: string): string {
  return `federation:${nodeId}:identity:${localId}`;
}

export class FederatedIdentityProvider implements IdentityProvider {
  readonly name = "ucos-federation";
  readonly #metadata: MetadataPort;
  readonly #revocations: RevocationAuthorityRegistry;

  constructor(metadata: MetadataPort, revocations: RevocationAuthorityRegistry) {
    this.#metadata = metadata;
    this.#revocations = revocations;
  }

  resolve(identityId: string): IdentityRecord | undefined {
    const parsed = parseNamespacedId(identityId);
    if (!parsed) return undefined; // not a federated (namespaced) id
    const mat = this.#metadata.get(materializedKey(parsed.nodeId, parsed.localId))?.value as
      | MaterializedIdentity
      | undefined;
    if (!mat) return undefined;
    if (mat.expiresAt <= Date.now()) return undefined; // stale => fail-closed
    if (this.#revocations.isRevoked("identity", identityId)) return undefined; // revoked => deny
    return mat.record;
  }
}
