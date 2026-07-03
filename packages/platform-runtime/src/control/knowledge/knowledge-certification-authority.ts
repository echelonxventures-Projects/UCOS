/**
 * UCOS Knowledge Fabric — Certification Authority (KNOW-GOV-002 / KNOW-SEC-001).
 *
 * Independent signed attestation that a knowledge unit is well-formed, sourced, and consistent.
 * Certifications are Ed25519-signed (federation primitives reused — no custom crypto), fresh, bound
 * to the `unitHash`. A revoked CA can no longer validate. Records under `knowledge:ca:<caId>`.
 */

import type { KeyObject } from "node:crypto";
import type { MetadataPort } from "../../meta-core/ports.ts";
import type { KnowledgeCertification, VerificationResult } from "./types.ts";
import type { KeyRegistry, NonceCache } from "../federation/assertions.ts";
import { signPayload, verifyPayload, isFresh, newNonce } from "../federation/assertions.ts";
import { ControlValidationError } from "../errors.ts";

const PREFIX = "knowledge:ca:";

interface KnowledgeCARecord {
  caId: string;
  owner: string;
  keyRef: string;
  status: "active" | "revoked";
}

export class KnowledgeCertificationAuthority {
  readonly #metadata: MetadataPort;
  readonly #keys: KeyRegistry;

  constructor(metadata: MetadataPort, keys: KeyRegistry) {
    this.#metadata = metadata;
    this.#keys = keys;
  }

  register(record: Omit<KnowledgeCARecord, "status"> & { status?: KnowledgeCARecord["status"] }): KnowledgeCARecord {
    if (!record.caId || !record.keyRef || !record.owner) {
      throw new ControlValidationError("Knowledge CA requires caId, owner, keyRef", { record });
    }
    const full: KnowledgeCARecord = { ...record, status: record.status ?? "active" };
    this.#metadata.put(`${PREFIX}${record.caId}`, full);
    return full;
  }

  get(caId: string): KnowledgeCARecord | undefined {
    return this.#metadata.get(`${PREFIX}${caId}`)?.value as KnowledgeCARecord | undefined;
  }

  revoke(caId: string): void {
    const rec = this.get(caId);
    if (!rec) throw new ControlValidationError(`Unknown knowledge CA "${caId}"`, { caId });
    this.#metadata.put(`${PREFIX}${caId}`, { ...rec, status: "revoked" });
  }

  issue(
    priv: KeyObject,
    opts: { unitHash: string; caId: string; verdict?: "pass" | "fail"; issuedAt?: number; expiresAt?: number; nonce?: string },
  ): KnowledgeCertification {
    const ca = this.get(opts.caId);
    if (!ca) throw new ControlValidationError(`Unknown knowledge CA "${opts.caId}"`, { caId: opts.caId });
    const now = opts.issuedAt ?? Date.now();
    const base: Omit<KnowledgeCertification, "signature"> = {
      certificationId: `kcert-${opts.unitHash.slice(0, 12)}-${now}`,
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

  verify(cert: KnowledgeCertification, opts: { nonces?: NonceCache; now?: number } = {}): VerificationResult {
    const now = opts.now ?? Date.now();
    const ca = this.get(cert.caId);
    if (!ca) return { ok: false, reason: `unknown knowledge CA "${cert.caId}"` };
    if (ca.status !== "active") return { ok: false, reason: `knowledge CA "${cert.caId}" is ${ca.status}` };
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
