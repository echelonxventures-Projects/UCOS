/**
 * UCOS Memory Fabric — Signed-Assertion Verifier (MEM-SEC-001).
 *
 * Single, reusable verifier for signed cross-node memory bundles. Enforces, fail-closed and in this
 * order: freshness (expiry/skew), unit integrity (unitHash matches the carried unit), a resolvable
 * public key (by reference — S3), a valid Ed25519 signature (reusing federation crypto — NO custom
 * crypto), and single-use replay protection via the federation NonceCache. Any failure ⇒ deny.
 *
 * Replay (M1): a (issuer, nonce) pair is single-use within its TTL; a re-presented bundle is rejected.
 * The nonce is only consumed AFTER signature/freshness/integrity pass, so failed probes cannot burn a
 * legitimate nonce.
 */

import { KeyRegistry, NonceCache, verifyPayload, isFresh } from "../federation/assertions.ts";
import type { MemoryBundle, VerificationResult } from "./types.ts";
import { unitHash } from "./memory-unit.ts";

export interface VerifyContext {
  now?: number;
  /** Replay TTL; defaults to the bundle's own validity window. */
  nonceTtlMs?: number;
}

export class SignedAssertionVerifier {
  readonly #keys: KeyRegistry;
  readonly #nonces: NonceCache;

  constructor(keys: KeyRegistry, nonces: NonceCache) {
    this.#keys = keys;
    this.#nonces = nonces;
  }

  /**
   * Verify signature + freshness + unit integrity + replay(nonce) of a memory bundle. Boundary
   * membership and classification ceilings are enforced separately by the federation guard.
   */
  verifyBundle(bundle: MemoryBundle, ctx: VerifyContext = {}): VerificationResult {
    const now = ctx.now ?? Date.now();
    if (!isFresh(bundle.issuedAt, bundle.expiresAt, now)) {
      return { ok: false, reason: "bundle expired/not fresh (staleness/replay window closed)" };
    }
    if (bundle.record.unitHash !== unitHash(bundle.record.unit)) {
      return { ok: false, reason: "bundle unit tampered (hash mismatch)" };
    }
    const pub = this.#keys.get(bundle.issuerKeyRef);
    if (!pub) return { ok: false, reason: `no public key for issuerKeyRef "${bundle.issuerKeyRef}"` };
    const sig = bundle.signature;
    if (!sig) return { ok: false, reason: "bundle unsigned" };
    const { signature: _omit, ...payload } = bundle;
    if (!verifyPayload(payload, sig, pub)) return { ok: false, reason: "invalid bundle signature" };

    // Replay guard LAST (so an invalid probe cannot consume a legitimate nonce).
    const ttl = ctx.nonceTtlMs ?? Math.max(1, bundle.expiresAt - bundle.issuedAt);
    if (!this.#nonces.checkAndRecord(bundle.issuer, bundle.nonce, ttl, now)) {
      return { ok: false, reason: "replayed bundle nonce (single-use) — fail-closed" };
    }
    return { ok: true, reason: "assertion verified (freshness+integrity+signature+nonce)" };
  }
}
