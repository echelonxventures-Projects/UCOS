/**
 * UCOS Knowledge Fabric — Ratification Authority (KNOW-GOV-002 / KNOW-SEC-001).
 *
 * Terminal authority for a knowledge unit. Valid only when signed by an active RA, fresh, referencing
 * a certification, meeting the validator quorum, and satisfying SEPARATION OF DUTIES: author,
 * validators, certifier, and ratifier are pairwise distinct (closes K4 authority-escalation /
 * governance bypass). Records under `knowledge:ra:<raId>`.
 */

import type { KeyObject } from "node:crypto";
import type { MetadataPort } from "../../meta-core/ports.ts";
import type { KnowledgeRatification, VerificationResult } from "./types.ts";
import type { KeyRegistry, NonceCache } from "../federation/assertions.ts";
import { signPayload, verifyPayload, isFresh, newNonce } from "../federation/assertions.ts";
import { ControlValidationError } from "../errors.ts";

const PREFIX = "knowledge:ra:";

interface KnowledgeRARecord {
  raId: string;
  owner: string;
  keyRef: string;
  quorum: number; // minimum distinct validators
  status: "active" | "revoked";
}

export class KnowledgeRatificationAuthority {
  readonly #metadata: MetadataPort;
  readonly #keys: KeyRegistry;

  constructor(metadata: MetadataPort, keys: KeyRegistry) {
    this.#metadata = metadata;
    this.#keys = keys;
  }

  register(record: Omit<KnowledgeRARecord, "status"> & { status?: KnowledgeRARecord["status"] }): KnowledgeRARecord {
    if (!record.raId || !record.keyRef || !record.owner) {
      throw new ControlValidationError("Knowledge RA requires raId, owner, keyRef", { record });
    }
    if (!Number.isFinite(record.quorum) || record.quorum < 1) {
      throw new ControlValidationError("Knowledge RA quorum must be >= 1", { record });
    }
    const full: KnowledgeRARecord = { ...record, status: record.status ?? "active" };
    this.#metadata.put(`${PREFIX}${record.raId}`, full);
    return full;
  }

  get(raId: string): KnowledgeRARecord | undefined {
    return this.#metadata.get(`${PREFIX}${raId}`)?.value as KnowledgeRARecord | undefined;
  }

  revoke(raId: string): void {
    const rec = this.get(raId);
    if (!rec) throw new ControlValidationError(`Unknown knowledge RA "${raId}"`, { raId });
    this.#metadata.put(`${PREFIX}${raId}`, { ...rec, status: "revoked" });
  }

  issue(
    priv: KeyObject,
    opts: {
      unitHash: string;
      raId: string;
      author: string;
      validators: string[];
      certifier: string;
      certificationId: string;
      issuedAt?: number;
      expiresAt?: number;
      nonce?: string;
    },
  ): KnowledgeRatification {
    const ra = this.get(opts.raId);
    if (!ra) throw new ControlValidationError(`Unknown knowledge RA "${opts.raId}"`, { raId: opts.raId });
    const now = opts.issuedAt ?? Date.now();
    const base: Omit<KnowledgeRatification, "signature"> = {
      ratificationId: `krat-${opts.unitHash.slice(0, 12)}-${now}`,
      unitHash: opts.unitHash,
      raId: opts.raId,
      ratifier: ra.owner,
      ratifierKeyRef: ra.keyRef,
      author: opts.author,
      validators: [...opts.validators],
      certifier: opts.certifier,
      certificationId: opts.certificationId,
      issuedAt: now,
      expiresAt: opts.expiresAt ?? now + 300_000,
      nonce: opts.nonce ?? newNonce(),
    };
    return { ...base, signature: signPayload(base, priv) };
  }

  verify(rat: KnowledgeRatification, opts: { nonces?: NonceCache; now?: number } = {}): VerificationResult {
    const now = opts.now ?? Date.now();
    const ra = this.get(rat.raId);
    if (!ra) return { ok: false, reason: `unknown knowledge RA "${rat.raId}"` };
    if (ra.status !== "active") return { ok: false, reason: `knowledge RA "${rat.raId}" is ${ra.status}` };
    if (!isFresh(rat.issuedAt, rat.expiresAt, now)) return { ok: false, reason: "ratification expired/not fresh" };

    const sod = this.#assertSeparationOfDuties(rat);
    if (!sod.ok) return sod;

    const distinctValidators = new Set(rat.validators);
    if (distinctValidators.size < ra.quorum) {
      return { ok: false, reason: `insufficient validators: ${distinctValidators.size} < quorum ${ra.quorum}` };
    }

    const pub = this.#keys.get(rat.ratifierKeyRef);
    if (!pub) return { ok: false, reason: `no public key for RA keyRef "${rat.ratifierKeyRef}"` };
    const sig = rat.signature;
    if (!sig) return { ok: false, reason: "ratification unsigned" };
    const { signature: _omit, ...payload } = rat;
    if (!verifyPayload(payload, sig, pub)) return { ok: false, reason: "invalid ratification signature" };
    if (opts.nonces && !opts.nonces.checkAndRecord(rat.raId, rat.nonce, 300_000, now)) {
      return { ok: false, reason: "ratification nonce replay" };
    }
    return { ok: true, reason: "ratification verified" };
  }

  #assertSeparationOfDuties(rat: KnowledgeRatification): VerificationResult {
    const roles: [string, string][] = [
      ["author", rat.author],
      ["certifier", rat.certifier],
      ["ratifier", rat.ratifier],
    ];
    const seen = new Map<string, string>();
    for (const [role, principal] of roles) {
      const prior = seen.get(principal);
      if (prior) return { ok: false, reason: `separation-of-duties violation: ${role} == ${prior} ("${principal}")` };
      seen.set(principal, role);
    }
    for (const v of rat.validators) {
      if (v === rat.author) return { ok: false, reason: "SoD violation: validator == author" };
      if (v === rat.certifier) return { ok: false, reason: "SoD violation: validator == certifier" };
      if (v === rat.ratifier) return { ok: false, reason: "SoD violation: validator == ratifier" };
    }
    return { ok: true, reason: "separation of duties satisfied" };
  }
}
