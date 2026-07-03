/**
 * UCOS Identity Fabric — Credential Model (ID-003).
 *
 * Pluggable credential verification. The default token verifier is intentionally simple
 * (substrate-level); production deployments supply a verifier backed by hashed secrets / an IdP.
 */

import type { Credential, IdentityRecord } from "../types.ts";

export interface CredentialVerifier {
  verify(identity: IdentityRecord, presented: Credential | undefined): boolean;
}

export class TokenCredentialVerifier implements CredentialVerifier {
  verify(identity: IdentityRecord, presented: Credential | undefined): boolean {
    const required = identity.credentials ?? [];
    if (required.length === 0) return true; // identity requires no credential
    if (!presented) return false;
    return required.some((cred) => cred.scheme === presented.scheme && cred.value === presented.value);
  }
}
