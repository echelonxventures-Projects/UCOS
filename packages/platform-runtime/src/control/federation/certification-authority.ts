/**
 * UCOS Federation Fabric — Certification Authority registry & verification (FED-GOV-C7).
 *
 * A CA whose signed certifications this node may accept. Certifications must be signature-verifiable
 * to a registered, active CA within the boundary; the LOCAL certification store remains authoritative
 * for local decisions (closes T9). Records under `federation:ca:<id>`.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { CertificationAuthorityRecord, SignedCertification, VerificationResult } from "./types.ts";
import type { KeyRegistry } from "./assertions.ts";
import { verifyPayload, isFresh } from "./assertions.ts";
import { ControlValidationError } from "../errors.ts";

const PREFIX = "federation:ca:";

export class CertificationAuthorityRegistry {
  readonly #metadata: MetadataPort;
  readonly #keys: KeyRegistry;

  constructor(metadata: MetadataPort, keys: KeyRegistry) {
    this.#metadata = metadata;
    this.#keys = keys;
  }

  register(record: Omit<CertificationAuthorityRecord, "status"> & { status?: CertificationAuthorityRecord["status"] }): CertificationAuthorityRecord {
    if (!record.caId || !record.keyRef) throw new ControlValidationError("CA requires caId and keyRef", { record });
    const full: CertificationAuthorityRecord = { ...record, status: record.status ?? "active" };
    this.#metadata.put(`${PREFIX}${record.caId}`, full);
    return full;
  }

  get(caId: string): CertificationAuthorityRecord | undefined {
    return this.#metadata.get(`${PREFIX}${caId}`)?.value as CertificationAuthorityRecord | undefined;
  }

  list(): CertificationAuthorityRecord[] {
    return this.#metadata.query(PREFIX).map((r) => r.value as CertificationAuthorityRecord);
  }

  revoke(caId: string): void {
    const rec = this.get(caId);
    if (!rec) throw new ControlValidationError(`Unknown CA "${caId}"`, { caId });
    this.#metadata.put(`${PREFIX}${caId}`, { ...rec, status: "revoked" });
  }

  /** Verify a signed certification against its issuing CA (signature + active CA + freshness). */
  verify(cert: SignedCertification, now: number = Date.now()): VerificationResult {
    const ca = this.get(cert.caId);
    if (!ca) return { ok: false, reason: `unknown CA "${cert.caId}"` };
    if (ca.status !== "active") return { ok: false, reason: `CA "${cert.caId}" is ${ca.status}` };
    if (!isFresh(cert.issuedAt, cert.expiresAt, now)) return { ok: false, reason: "certification expired/not fresh" };
    const pub = this.#keys.get(ca.keyRef);
    if (!pub) return { ok: false, reason: `no public key for CA keyRef "${ca.keyRef}"` };
    const sig = cert.signature;
    if (!sig) return { ok: false, reason: "certification unsigned" };
    const { signature: _omit, ...payload } = cert;
    if (!verifyPayload(payload, sig, pub)) return { ok: false, reason: "invalid certification signature" };
    return { ok: true, reason: "certification verified" };
  }
}
