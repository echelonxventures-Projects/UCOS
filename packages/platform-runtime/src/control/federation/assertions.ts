/**
 * UCOS PI-5 Federation Fabric — cryptographic assertion primitives (FED-SEC-001).
 *
 * Real asymmetric signatures via Node's built-in `node:crypto` (Ed25519) — zero external deps.
 * Provides deterministic canonicalization, signing, verification, a public-key registry (keys by
 * reference — S3: no private key material in records/metadata), a replay nonce cache, and freshness
 * checks. These are the mechanisms behind FED-SEC-CV / FED-SEC-RP.
 */

import { generateKeyPairSync, sign as cryptoSign, verify as cryptoVerify, createHash, randomUUID } from "node:crypto";
import type { KeyObject } from "node:crypto";

/** Deterministic, canonical JSON serialization (recursively sorted object keys). */
export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`).join(",")}}`;
}

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export interface Ed25519KeyPair {
  publicKeyPem: string;
  privateKey: KeyObject;
}

/** Generate an Ed25519 keypair. Private key is held only by the signer; public key is exported by ref. */
export function generateKeyPair(): Ed25519KeyPair {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  return { publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString(), privateKey };
}

/** Sign the canonical form of `payload` (which must NOT contain a `signature` field). */
export function signPayload(payload: unknown, privateKey: KeyObject): string {
  const data = Buffer.from(canonicalize(payload), "utf8");
  return cryptoSign(null, data, privateKey).toString("hex");
}

/** Verify a hex signature over the canonical form of `payload` against a SPKI PEM public key. */
export function verifyPayload(payload: unknown, signatureHex: string, publicKeyPem: string): boolean {
  try {
    const data = Buffer.from(canonicalize(payload), "utf8");
    return cryptoVerify(null, data, publicKeyPem, Buffer.from(signatureHex, "hex"));
  } catch {
    return false;
  }
}

export function newNonce(): string {
  return randomUUID();
}

/**
 * Public-key registry: maps a `keyRef` to a SPKI PEM public key. Only PUBLIC keys are stored here
 * (S3). An unknown keyRef fails verification (deny). A durable deployment substitutes this.
 */
export class KeyRegistry {
  readonly #keys = new Map<string, string>();

  register(keyRef: string, publicKeyPem: string): void {
    this.#keys.set(keyRef, publicKeyPem);
  }

  get(keyRef: string): string | undefined {
    return this.#keys.get(keyRef);
  }

  has(keyRef: string): boolean {
    return this.#keys.has(keyRef);
  }
}

/**
 * Replay nonce cache (FED-SEC-RP). A (issuer, nonce) pair is single-use within its TTL.
 * `checkAndRecord` returns false if the nonce was already seen (replay) — deny.
 */
export class NonceCache {
  readonly #seen = new Map<string, number>(); // key -> expiry (ms epoch)

  checkAndRecord(issuer: string, nonce: string, ttlMs: number, now: number = Date.now()): boolean {
    this.#evict(now);
    const key = `${issuer}\u0000${nonce}`;
    if (this.#seen.has(key)) return false; // replay
    this.#seen.set(key, now + ttlMs);
    return true;
  }

  #evict(now: number): void {
    for (const [key, expiry] of this.#seen) if (expiry <= now) this.#seen.delete(key);
  }
}

/**
 * Freshness check (FED-SEC-RP): assertion must have a mandatory future `expiresAt`, must not be
 * expired, and `issuedAt` must fall within an allowed clock-skew window (not in the future).
 */
export function isFresh(
  issuedAt: number,
  expiresAt: number,
  now: number = Date.now(),
  skewMs = 60_000,
): boolean {
  if (!Number.isFinite(issuedAt) || !Number.isFinite(expiresAt)) return false;
  if (expiresAt <= now) return false; // expired / no future validity
  if (issuedAt - skewMs > now) return false; // issued in the future beyond skew
  return true;
}
