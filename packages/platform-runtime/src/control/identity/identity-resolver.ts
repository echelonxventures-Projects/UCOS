/**
 * UCOS Identity Fabric — Identity Resolution (ID-002).
 *
 * Resolves a principal reference to an authenticated, active identity, verifying credentials
 * and consulting federated providers when the identity is not stored locally.
 */

import type { IdentityRecord, PrincipalRef } from "../types.ts";
import type { IdentityRegistry } from "./identity-registry.ts";
import type { CredentialVerifier } from "./credential-verifier.ts";
import { TokenCredentialVerifier } from "./credential-verifier.ts";
import { AuthenticationError } from "../errors.ts";

export class IdentityResolver {
  readonly #registry: IdentityRegistry;
  readonly #verifier: CredentialVerifier;

  constructor(registry: IdentityRegistry, verifier: CredentialVerifier = new TokenCredentialVerifier()) {
    this.#registry = registry;
    this.#verifier = verifier;
  }

  resolve(principal: PrincipalRef): IdentityRecord {
    const record = this.#registry.get(principal.identityId) ?? this.#registry.resolveFederated(principal.identityId);
    if (!record) {
      throw new AuthenticationError(`Unknown identity "${principal.identityId}"`, { identityId: principal.identityId });
    }
    if (record.status !== "active") {
      throw new AuthenticationError(`Identity "${principal.identityId}" is ${record.status}`, {
        identityId: principal.identityId,
        status: record.status,
      });
    }
    if (!this.#verifier.verify(record, principal.credential)) {
      throw new AuthenticationError(`Invalid credential for identity "${principal.identityId}"`, {
        identityId: principal.identityId,
      });
    }
    return record;
  }
}
