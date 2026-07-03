/**
 * UCOS Federation Fabric — Federated Credential Verifier (FED-SEC-001).
 *
 * Implements the PI-4 `CredentialVerifier` seam. A FEDERATED identity (one carrying a verified
 * `provenance` in its attributes) was already cryptographically authenticated at ingestion by the
 * FederationResolver, so it needs no locally-presented credential. LOCAL identities are delegated to
 * the wrapped base verifier (default: token). This keeps cross-domain authentication cryptographic
 * (assertion signatures) rather than plaintext.
 */

import type { Credential, IdentityRecord } from "../types.ts";
import type { CredentialVerifier } from "../identity/credential-verifier.ts";
import { TokenCredentialVerifier } from "../identity/credential-verifier.ts";

function hasVerifiedProvenance(identity: IdentityRecord): boolean {
  const prov = (identity.attributes as Record<string, unknown> | undefined)?.["provenance"] as
    | { origin?: unknown; verifiedAt?: unknown }
    | undefined;
  return !!prov && prov.origin !== "local" && typeof prov.verifiedAt === "number";
}

export class FederatedCredentialVerifier implements CredentialVerifier {
  readonly #base: CredentialVerifier;

  constructor(base: CredentialVerifier = new TokenCredentialVerifier()) {
    this.#base = base;
  }

  verify(identity: IdentityRecord, presented: Credential | undefined): boolean {
    if (hasVerifiedProvenance(identity)) return true; // pre-verified at ingestion (assertion signature)
    return this.#base.verify(identity, presented);
  }
}
