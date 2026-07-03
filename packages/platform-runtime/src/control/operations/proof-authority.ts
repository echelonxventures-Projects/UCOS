/**
 * UCOS Operational Proof Fabric — Proof Authorities (OPF-SEC-002).
 *
 * Two Ed25519-signing authorities (federation crypto reused — no custom crypto):
 *
 *  - `ProofAttestationAuthority` issues/verifies a signed ATTESTATION that an evidence unit is
 *    well-formed and observed (records under `operations:pa:<paId>`).
 *  - `ProofSealAuthority` issues/verifies a SEAL that promotes an attested proof to `sealed`, under
 *    SEPARATION OF DUTIES: the sealer principal must differ from the attester (records under
 *    `operations:psa:<paId>`).
 *
 * Both are fresh-bound to the `unitHash`; a revoked authority can no longer sign/verify; unknown
 * key refs fail verification (deny-by-default).
 */

import type { KeyObject } from "node:crypto";
import type { MetadataPort } from "../../meta-core/ports.ts";
import type { ProofAttestation, ProofSeal, VerificationResult } from "./types.ts";
import type { KeyRegistry, NonceCache } from "../federation/assertions.ts";
import { signPayload, verifyPayload, isFresh, newNonce } from "../federation/assertions.ts";
import { ControlValidationError } from "../errors.ts";

const ATTEST_TTL_MS = 300_000;

interface SigningAuthorityRecord {
  paId: string;
  owner: string;
  keyRef: string;
  status: "active" | "revoked";
}

// ------------------------------ Attestation authority ------------------------------

const PA_PREFIX = "operations:pa:";

export class ProofAttestationAuthority {
  readonly #metadata: MetadataPort;
  readonly #keys: KeyRegistry;

  constructor(metadata: MetadataPort, keys: KeyRegistry) {
    this.#metadata = metadata;
    this.#keys = keys;
  }

  register(record: Omit<SigningAuthorityRecord, "status"> & { status?: SigningAuthorityRecord["status"] }): SigningAuthorityRecord {
    if (!record.paId || !record.keyRef || !record.owner) {
      throw new ControlValidationError("Proof attestation authority requires paId, owner, keyRef", { record });
    }
    const full: SigningAuthorityRecord = { ...record, status: record.status ?? "active" };
    this.#metadata.put(`${PA_PREFIX}${record.paId}`, full);
    return full;
  }

  get(paId: string): SigningAuthorityRecord | undefined {
    return this.#metadata.get(`${PA_PREFIX}${paId}`)?.value as SigningAuthorityRecord | undefined;
  }

  revoke(paId: string): void {
    const rec = this.get(paId);
    if (!rec) throw new ControlValidationError(`Unknown proof attestation authority "${paId}"`, { paId });
    this.#metadata.put(`${PA_PREFIX}${paId}`, { ...rec, status: "revoked" });
  }

  issue(
    priv: KeyObject,
    opts: { unitHash: string; paId: string; verdict?: "pass" | "fail"; issuedAt?: number; expiresAt?: number; nonce?: string },
  ): ProofAttestation {
    const pa = this.get(opts.paId);
    if (!pa) throw new ControlValidationError(`Unknown proof attestation authority "${opts.paId}"`, { paId: opts.paId });
    const now = opts.issuedAt ?? Date.now();
    const base: Omit<ProofAttestation, "signature"> = {
      attestationId: `attest-${opts.unitHash.slice(0, 12)}-${now}`,
      unitHash: opts.unitHash,
      paId: opts.paId,
      attester: pa.owner,
      attesterKeyRef: pa.keyRef,
      verdict: opts.verdict ?? "pass",
      issuedAt: now,
      expiresAt: opts.expiresAt ?? now + ATTEST_TTL_MS,
      nonce: opts.nonce ?? newNonce(),
    };
    return { ...base, signature: signPayload(base, priv) };
  }

  verify(att: ProofAttestation, opts: { nonces?: NonceCache; now?: number } = {}): VerificationResult {
    const now = opts.now ?? Date.now();
    const pa = this.get(att.paId);
    if (!pa) return { ok: false, reason: `unknown proof attestation authority "${att.paId}"` };
    if (pa.status !== "active") return { ok: false, reason: `attestation authority "${att.paId}" is ${pa.status}` };
    if (att.verdict !== "pass") return { ok: false, reason: `attestation verdict is "${att.verdict}"` };
    if (!isFresh(att.issuedAt, att.expiresAt, now)) return { ok: false, reason: "attestation expired/not fresh" };
    const pub = this.#keys.get(att.attesterKeyRef);
    if (!pub) return { ok: false, reason: `no public key for attester keyRef "${att.attesterKeyRef}"` };
    const sig = att.signature;
    if (!sig) return { ok: false, reason: "attestation unsigned" };
    const { signature: _omit, ...payload } = att;
    if (!verifyPayload(payload, sig, pub)) return { ok: false, reason: "invalid attestation signature" };
    if (opts.nonces && !opts.nonces.checkAndRecord(att.paId, att.nonce, ATTEST_TTL_MS, now)) {
      return { ok: false, reason: "attestation nonce replay" };
    }
    return { ok: true, reason: "attestation verified" };
  }
}

// ------------------------------ Seal authority (SoD) ------------------------------

const PSA_PREFIX = "operations:psa:";

export class ProofSealAuthority {
  readonly #metadata: MetadataPort;
  readonly #keys: KeyRegistry;

  constructor(metadata: MetadataPort, keys: KeyRegistry) {
    this.#metadata = metadata;
    this.#keys = keys;
  }

  register(record: Omit<SigningAuthorityRecord, "status"> & { status?: SigningAuthorityRecord["status"] }): SigningAuthorityRecord {
    if (!record.paId || !record.keyRef || !record.owner) {
      throw new ControlValidationError("Proof seal authority requires paId, owner, keyRef", { record });
    }
    const full: SigningAuthorityRecord = { ...record, status: record.status ?? "active" };
    this.#metadata.put(`${PSA_PREFIX}${record.paId}`, full);
    return full;
  }

  get(paId: string): SigningAuthorityRecord | undefined {
    return this.#metadata.get(`${PSA_PREFIX}${paId}`)?.value as SigningAuthorityRecord | undefined;
  }

  revoke(paId: string): void {
    const rec = this.get(paId);
    if (!rec) throw new ControlValidationError(`Unknown proof seal authority "${paId}"`, { paId });
    this.#metadata.put(`${PSA_PREFIX}${paId}`, { ...rec, status: "revoked" });
  }

  issue(
    priv: KeyObject,
    opts: { unitHash: string; paId: string; attester: string; attestationId: string; issuedAt?: number; expiresAt?: number; nonce?: string },
  ): ProofSeal {
    const psa = this.get(opts.paId);
    if (!psa) throw new ControlValidationError(`Unknown proof seal authority "${opts.paId}"`, { paId: opts.paId });
    const now = opts.issuedAt ?? Date.now();
    const base: Omit<ProofSeal, "signature"> = {
      sealId: `seal-${opts.unitHash.slice(0, 12)}-${now}`,
      unitHash: opts.unitHash,
      paId: opts.paId,
      sealer: psa.owner,
      sealerKeyRef: psa.keyRef,
      attester: opts.attester,
      attestationId: opts.attestationId,
      issuedAt: now,
      expiresAt: opts.expiresAt ?? now + ATTEST_TTL_MS,
      nonce: opts.nonce ?? newNonce(),
    };
    return { ...base, signature: signPayload(base, priv) };
  }

  verify(seal: ProofSeal, opts: { nonces?: NonceCache; now?: number } = {}): VerificationResult {
    const now = opts.now ?? Date.now();
    const psa = this.get(seal.paId);
    if (!psa) return { ok: false, reason: `unknown proof seal authority "${seal.paId}"` };
    if (psa.status !== "active") return { ok: false, reason: `seal authority "${seal.paId}" is ${psa.status}` };
    if (!isFresh(seal.issuedAt, seal.expiresAt, now)) return { ok: false, reason: "seal expired/not fresh" };
    // Separation of duties: sealer must differ from attester.
    if (seal.sealer === seal.attester) return { ok: false, reason: "separation-of-duties violation: sealer == attester" };
    const pub = this.#keys.get(seal.sealerKeyRef);
    if (!pub) return { ok: false, reason: `no public key for sealer keyRef "${seal.sealerKeyRef}"` };
    const sig = seal.signature;
    if (!sig) return { ok: false, reason: "seal unsigned" };
    const { signature: _omit, ...payload } = seal;
    if (!verifyPayload(payload, sig, pub)) return { ok: false, reason: "invalid seal signature" };
    if (opts.nonces && !opts.nonces.checkAndRecord(seal.paId, seal.nonce, ATTEST_TTL_MS, now)) {
      return { ok: false, reason: "seal nonce replay" };
    }
    return { ok: true, reason: "seal verified" };
  }
}
