/**
 * UCOS Ontology Fabric — Certification Authority (ONTO-GOV-002 / ONTO-SEC-001).
 *
 * Independent signed attestation that an ontology unit is well-formed, sourced, and semantically
 * consistent. Certifications are Ed25519-signed (federation primitives reused — no custom crypto),
 * fresh, bound to the `unitHash`. A revoked CA can no longer certify. Records under `ontology:ca:<caId>`.
 */

import type { KeyObject } from "node:crypto";
import type { MetadataPort } from "../../meta-core/ports.ts";
import type { OntologyCertification, VerificationResult } from "./types.ts";
import type { KeyRegistry, NonceCache } from "../federation/assertions.ts";
import { signPayload, verifyPayload, isFresh, newNonce } from "../federation/assertions.ts";
import { ControlValidationError } from "../errors.ts";

const PREFIX = "ontology:ca:";

interface OntologyCARecord {
  caId: string;
  owner: string;
  keyRef: string;
  status: "active" | "revoked";
}

export class OntologyCertificationAuthority {
  readonly #metadata: MetadataPort;
  readonly #keys: KeyRegistry;

  constructor(metadata: MetadataPort, keys: KeyRegistry) {
    this.#metadata = metadata;
    this.#keys = keys;
  }

  register(record: Omit<OntologyCARecord, "status"> & { status?: OntologyCARecord["status"] }): OntologyCARecord {
    if (!record.caId || !record.keyRef || !record.owner) {
      throw new ControlValidationError("Ontology CA requires caId, owner, keyRef", { record });
    }
    const full: OntologyCARecord = { ...record, status: record.status ?? "active" };
    this.#metadata.put(`${PREFIX}${record.caId}`, full);
    return full;
  }

  get(caId: string): OntologyCARecord | undefined {
    return this.#metadata.get(`${PREFIX}${caId}`)?.value as OntologyCARecord | undefined;
  }

  revoke(caId: string): void {
    const rec = this.get(caId);
    if (!rec) throw new ControlValidationError(`Unknown ontology CA "${caId}"`, { caId });
    this.#metadata.put(`${PREFIX}${caId}`, { ...rec, status: "revoked" });
  }

  issue(
    priv: KeyObject,
    opts: { unitHash: string; caId: string; verdict?: "pass" | "fail"; issuedAt?: number; expiresAt?: number; nonce?: string },
  ): OntologyCertification {
    const ca = this.get(opts.caId);
    if (!ca) throw new ControlValidationError(`Unknown ontology CA "${opts.caId}"`, { caId: opts.caId });
    const now = opts.issuedAt ?? Date.now();
    const base: Omit<OntologyCertification, "signature"> = {
      certificationId: `ocert-${opts.unitHash.slice(0, 12)}-${now}`,
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

  verify(cert: OntologyCertification, opts: { nonces?: NonceCache; now?: number } = {}): VerificationResult {
    const now = opts.now ?? Date.now();
    const ca = this.get(cert.caId);
    if (!ca) return { ok: false, reason: `unknown ontology CA "${cert.caId}"` };
    if (ca.status !== "active") return { ok: false, reason: `ontology CA "${cert.caId}" is ${ca.status}` };
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
