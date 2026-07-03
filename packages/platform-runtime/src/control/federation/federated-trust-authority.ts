/**
 * UCOS Federation Fabric — Federated Trust Authority (FED-SEC clamped trust; sync-read).
 *
 * Implements the EXISTING synchronous `TrustAuthority` seam (registered on the PI-4 TrustEvaluator).
 * Returns the ALREADY-CLAMPED federated trust level that the FederationResolver materialized (min of
 * asserted level, delegation cap, and boundary ceiling — closes T2 trust poisoning). Stale/revoked
 * materializations contribute no trust (undefined).
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { TrustAuthority } from "../types.ts";
import type { RevocationAuthorityRegistry } from "./revocation-authority.ts";
import type { MaterializedIdentity } from "./federated-identity-provider.ts";
import { materializedKey } from "./federated-identity-provider.ts";
import { parseNamespacedId } from "./types.ts";

export class FederatedTrustAuthority implements TrustAuthority {
  readonly name = "ucos-federation-trust";
  readonly #metadata: MetadataPort;
  readonly #revocations: RevocationAuthorityRegistry;

  constructor(metadata: MetadataPort, revocations: RevocationAuthorityRegistry) {
    this.#metadata = metadata;
    this.#revocations = revocations;
  }

  levelFor(identityId: string): number | undefined {
    const parsed = parseNamespacedId(identityId);
    if (!parsed) return undefined;
    const mat = this.#metadata.get(materializedKey(parsed.nodeId, parsed.localId))?.value as
      | MaterializedIdentity
      | undefined;
    if (!mat) return undefined;
    if (mat.expiresAt <= Date.now()) return undefined; // stale
    if (this.#revocations.isRevoked("trust", identityId)) return undefined; // trust revoked
    return mat.trustLevel;
  }
}
