/**
 * UCOS Readiness Fabric — Certification Engine (RDN-ENG-CERT, engine 6 of 7).
 *
 * Issues and verifies SIGNED readiness certifications — the fabric's only authoritative, non-repudiable
 * output. A certification binds a certified `level` to a specific assessment `assessmentHash` and is
 * signed with the issuing authority's key (reusing the ratified federation Ed25519; NO custom crypto).
 *
 * Verification is fail-closed: an unknown authority, a missing public key, a certifier that does not
 * match the authority owner, or a bad signature ⇒ INVALID. The engine does not enforce SoD or powers
 * (that is the Meta-Governance Engine's job); it enforces cryptographic integrity and authority binding.
 */

import type { KeyObject } from "node:crypto";
import { KeyRegistry, signPayload, verifyPayload } from "../federation/assertions.ts";
import { ControlValidationError } from "../errors.ts";
import type { ReadinessCertification, ReadinessLevel } from "./types.ts";

export interface CertificationAuthorityRecord {
  caId: string;
  /** Principal that owns/operates this authority (must match `certifier` on issue). */
  owner: string;
  /** Public key by reference (S3). */
  keyRef: string;
}

export interface IssueCertificationInput {
  assessmentId: string;
  assessmentHash: string;
  level: ReadinessLevel;
  caId: string;
  assessor: string;
  at?: number;
  ttlMs?: number;
}

const DEFAULT_CERT_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export class CertificationEngine {
  readonly #keys: KeyRegistry;
  readonly #authorities = new Map<string, CertificationAuthorityRecord>();
  #seq = 0;

  constructor(keys: KeyRegistry) {
    this.#keys = keys;
  }

  register(record: CertificationAuthorityRecord): CertificationAuthorityRecord {
    if (!record.caId || !record.owner || !record.keyRef) {
      throw new ControlValidationError("readiness certification authority requires caId, owner, keyRef", { record });
    }
    this.#authorities.set(record.caId, record);
    return record;
  }

  get(caId: string): CertificationAuthorityRecord | undefined {
    return this.#authorities.get(caId);
  }

  /**
   * Issue a signed readiness certification. The signer's private key must correspond to the authority's
   * registered public keyRef; the `certifier` is the authority owner.
   */
  issue(privateKey: KeyObject, input: IssueCertificationInput): ReadinessCertification {
    const ca = this.#authorities.get(input.caId);
    if (!ca) throw new ControlValidationError(`unknown certification authority: ${input.caId}`, { input });
    const at = input.at ?? Date.now();
    const expiresAt = at + (input.ttlMs ?? DEFAULT_CERT_TTL_MS);
    const base = {
      certificationId: `rdn-cert-${this.#seq++}`,
      assessmentId: input.assessmentId,
      assessmentHash: input.assessmentHash,
      level: input.level,
      caId: input.caId,
      certifier: ca.owner,
      assessor: input.assessor,
      at,
      expiresAt,
    };
    return { ...base, signature: signPayload(base, privateKey) };
  }

  /** Fail-closed cryptographic verification against the registered authority's public key. */
  verify(cert: ReadinessCertification): boolean {
    const ca = this.#authorities.get(cert.caId);
    if (!ca) return false;
    if (cert.certifier !== ca.owner) return false;
    const pub = this.#keys.get(ca.keyRef);
    if (!pub) return false;
    const { signature, ...base } = cert;
    return verifyPayload(base, signature, pub);
  }

  /** Verify AND check freshness (not expired) at `now`. */
  isValid(cert: ReadinessCertification, now: number = Date.now()): boolean {
    if (!this.verify(cert)) return false;
    return cert.expiresAt > now;
  }
}
