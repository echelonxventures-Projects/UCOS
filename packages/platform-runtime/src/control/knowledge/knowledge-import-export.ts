/**
 * UCOS Knowledge Fabric — Import / Export (KNOW-ARCH-001 / KNOW-SEC-001).
 *
 * Export packages a record into a signed, canonical `KnowledgeBundle`; import RE-VERIFIES the bundle
 * (signature + freshness + tamper) BEFORE it may be admitted. Import never writes directly — it
 * returns a verified record for the caller to persist via the Evolution Fabric (single mutation path).
 * Reuses federation crypto (no custom cryptography).
 */

import type { KeyObject } from "node:crypto";
import type { KnowledgeBundle, KnowledgeRecord, VerificationResult } from "./types.ts";
import type { KeyRegistry } from "../federation/assertions.ts";
import { signPayload, verifyPayload, isFresh, newNonce } from "../federation/assertions.ts";
import { unitHash } from "./knowledge-unit.ts";

export class KnowledgeImportExport {
  readonly #keys: KeyRegistry;

  constructor(keys: KeyRegistry) {
    this.#keys = keys;
  }

  /** Package a record as a signed bundle for cross-node exchange. */
  export(
    priv: KeyObject,
    record: KnowledgeRecord,
    opts: { issuer: string; issuerKeyRef: string; issuedAt?: number; expiresAt?: number; nonce?: string },
  ): KnowledgeBundle {
    const now = opts.issuedAt ?? Date.now();
    const base: Omit<KnowledgeBundle, "signature"> = {
      record,
      issuer: opts.issuer,
      issuerKeyRef: opts.issuerKeyRef,
      issuedAt: now,
      expiresAt: opts.expiresAt ?? now + 300_000,
      nonce: opts.nonce ?? newNonce(),
    };
    return { ...base, signature: signPayload(base, priv) };
  }

  /**
   * Verify an inbound bundle end-to-end (signature + freshness + unit-hash integrity). Returns the
   * verified record for the caller to persist via the Evolution Fabric. Fail-closed on any failure.
   */
  verifyForImport(bundle: KnowledgeBundle, now: number = Date.now()): { result: VerificationResult; record?: KnowledgeRecord } {
    if (!isFresh(bundle.issuedAt, bundle.expiresAt, now)) return { result: { ok: false, reason: "bundle expired/not fresh" } };
    if (bundle.record.unitHash !== unitHash(bundle.record.unit)) return { result: { ok: false, reason: "unit tampered (hash mismatch)" } };
    const pub = this.#keys.get(bundle.issuerKeyRef);
    if (!pub) return { result: { ok: false, reason: `no public key for issuerKeyRef "${bundle.issuerKeyRef}"` } };
    const sig = bundle.signature;
    if (!sig) return { result: { ok: false, reason: "bundle unsigned" } };
    const { signature: _omit, ...payload } = bundle;
    if (!verifyPayload(payload, sig, pub)) return { result: { ok: false, reason: "invalid bundle signature" } };
    return { result: { ok: true, reason: "bundle verified" }, record: bundle.record };
  }
}
