/**
 * UCOS Evolution Fabric — Certification Authority (EVO-GOV-001 / EVO-SEC-001).
 *
 * An independent authority that signs certifications attesting an evolution unit is well-formed and
 * compatible (compiles/composes/no prohibited-dir change). Certifications are Ed25519-signed, fresh,
 * and bound to the `unitHash`. A revoked CA can no longer validate certifications (closes the
 * certification-abuse threat). Records under `evolution:ca:<caId>`.
 */

import type { KeyObject } from "node:crypto";
import type { MetadataPort } from "../../meta-core/ports.ts";
import type { EvolutionCARecord, EvolutionCertification, VerificationResult } from "./types.ts";
import type { KeyRegistry, NonceCache } from "../federation/assertions.ts";
import { signPayload, verifyPayload, isFresh, newNonce } from "../federation/assertions.ts";
import { ControlValidationError } from "../errors.ts";

const PREFIX = "evolution:ca:";

export class EvolutionCertificationAuthority {
  readonly #metadata: MetadataPort;
  readonly #keys: KeyRegistry;

  constructor(metadata: MetadataPort, keys: KeyRegistry) {
    this.#metadata = metadata;
    this.#keys = keys;
  }

  register(record: Omit<EvolutionCARecord, "status"> & { status?: EvoAuthorityStatusLoose }): EvolutionCARecord {
    if (!record.caId || !record.keyRef || !record.owner) {
      throw new ControlValidationError("Evolution CA requires caId, owner, and keyRef", { record });
    }
    const full: EvolutionCARecord = { ...record, status: record.status ?? "active" };
    this.#metadata.put(`${PREFIX}${record.caId}`, full);
    return full;
  }

  get(caId: string): EvolutionCARecord | undefined {
    return this.#metadata.get(`${PREFIX}${caId}`)?.value as EvolutionCARecord | undefined;
  }

  revoke(caId: string): void {
    const rec = this.get(caId);
    if (!rec) throw new ControlValidationError(`Unknown evolution CA "${caId}"`, { caId });
    this.#metadata.put(`${PREFIX}${caId}`, { ...rec, status: "revoked" });
  }

  /** Build + sign a certification for `unitHash` using the CA owner's private key. */
  issue(
    priv: KeyObject,
    opts: { unitHash: string; caId: string; verdict?: "pass" | "fail"; issuedAt?: number; expiresAt?: number; nonce?: string },
  ): EvolutionCertification {
    const ca = this.get(opts.caId);
    if (!ca) throw new ControlValidationError(`Unknown evolution CA "${opts.caId}"`, { caId: opts.caId });
    const now = opts.issuedAt ?? Date.now();
    const base: Omit<EvolutionCertification, "signature"> = {
      certificationId: `cert-${opts.unitHash.slice(0, 12)}-${now}`,
      unitHash: opts.unitHash,
      caId: opts.caId,
      certifier: ca.owner,
      certifierKeyRef: ca.keyRef,
      verdict: opts.verdict ?? "pass",
      issuedAt: now,
      expiresAt: opts.expiresAt ?? now + 300_000,
      nonce: opts.nonce ?? newNonce(),
    };
    return { ...base, signature: signPayload(base, priv) };
  }

  /** Verify a signed certification: active CA + freshness + signature + pass verdict + optional nonce. */
  verify(cert: EvolutionCertification, opts: { nonces?: NonceCache; now?: number } = {}): VerificationResult {
    const now = opts.now ?? Date.now();
    const ca = this.get(cert.caId);
    if (!ca) return { ok: false, reason: `unknown evolution CA "${cert.caId}"` };
    if (ca.status !== "active") return { ok: false, reason: `evolution CA "${cert.caId}" is ${ca.status}` };
    if (cert.verdict !== "pass") return { ok: false, reason: `certification verdict is "${cert.verdict}"` };
    if (!isFresh(cert.issuedAt, cert.expiresAt, now)) return { ok: false, reason: "certification expired/not fresh" };
    const pub = this.#keys.get(cert.certifierKeyRef);
    if (!pub) return { ok: false, reason: `no public key for CA keyRef "${cert.certifierKeyRef}"` };
    const sig = cert.signature;
    if (!sig) return { ok: false, reason: "certification unsigned" };
    const { signature: _omit, ...payload } = cert;
    if (!verifyPayload(payload, sig, pub)) return { ok: false, reason: "invalid certification signature" };
    if (opts.nonces && !opts.nonces.checkAndRecord(cert.caId, cert.nonce, 300_000, now)) {
      return { ok: false, reason: "certification nonce replay" };
    }
    return { ok: true, reason: "certification verified" };
  }
}

type EvoAuthorityStatusLoose = EvolutionCARecord["status"];
