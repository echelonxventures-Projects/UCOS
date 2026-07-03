/**
 * UCOS Memory Fabric — Certification Authority (MEM-GOV-001 C5).
 *
 * A memory-layer governance authority that attests a memory unit is well-formed, classification-correct,
 * and provenance-valid — issuing a SIGNED certification assertion over its `unitHash` (reusing federation
 * Ed25519; NO custom crypto). Certification is distinct from Consolidation and Ratification (SoD, MGP /
 * AD-0023 §2). Verification is fail-closed: an unknown authority, missing key, or bad signature ⇒ invalid.
 */

import type { KeyObject } from "node:crypto";
import { KeyRegistry, signPayload, verifyPayload } from "../federation/assertions.ts";
import { ControlValidationError } from "../errors.ts";

export interface MemoryCertificationAuthorityRecord {
  caId: string;
  owner: string; // principal id (must differ from consolidator/ratifier — SoD)
  keyRef: string; // public key by reference (S3)
}

export interface MemoryCertification {
  certificationId: string;
  unitHash: string;
  caId: string;
  certifier: string; // the owner principal that certified
  at: number;
  signature: string;
}

export class MemoryCertificationAuthority {
  readonly #keys: KeyRegistry;
  readonly #authorities = new Map<string, MemoryCertificationAuthorityRecord>();
  #seq = 0;

  constructor(keys: KeyRegistry) {
    this.#keys = keys;
  }

  register(record: MemoryCertificationAuthorityRecord): MemoryCertificationAuthorityRecord {
    if (!record.caId || !record.owner || !record.keyRef) {
      throw new ControlValidationError("memory certification authority requires caId, owner, keyRef", { record });
    }
    this.#authorities.set(record.caId, record);
    return record;
  }

  get(caId: string): MemoryCertificationAuthorityRecord | undefined {
    return this.#authorities.get(caId);
  }

  /** Issue a signed certification for `unitHash`. The signer's private key must match the authority's keyRef. */
  issue(privateKey: KeyObject, input: { unitHash: string; caId: string; at?: number }): MemoryCertification {
    const ca = this.#authorities.get(input.caId);
    if (!ca) throw new ControlValidationError(`unknown certification authority: ${input.caId}`, { input });
    const at = input.at ?? Date.now();
    const base = { certificationId: `mem-cert-${this.#seq++}`, unitHash: input.unitHash, caId: input.caId, certifier: ca.owner, at };
    return { ...base, signature: signPayload(base, privateKey) };
  }

  /** Fail-closed verification of a certification assertion against the registered authority's public key. */
  verify(cert: MemoryCertification): boolean {
    const ca = this.#authorities.get(cert.caId);
    if (!ca) return false;
    if (cert.certifier !== ca.owner) return false;
    const pub = this.#keys.get(ca.keyRef);
    if (!pub) return false;
    const { signature, ...base } = cert;
    return verifyPayload(base, signature, pub);
  }
}
