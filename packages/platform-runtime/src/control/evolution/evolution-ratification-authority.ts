/**
 * UCOS Evolution Fabric — Ratification Authority (EVO-GOV-001 / EVO-SEC-001).
 *
 * Terminal authority for an evolution. A ratification is only valid when it is signed by an active
 * ratification authority, fresh, references a certification, meets the approval quorum, and satisfies
 * SEPARATION OF DUTIES: proposer, approvers, certifier, and ratifier must be pairwise distinct.
 * This closes the ratification-bypass and governance-bypass threats. Records under `evolution:ra:<raId>`.
 */

import type { KeyObject } from "node:crypto";
import type { MetadataPort } from "../../meta-core/ports.ts";
import type { EvolutionRARecord, EvolutionRatification, VerificationResult } from "./types.ts";
import type { KeyRegistry, NonceCache } from "../federation/assertions.ts";
import { signPayload, verifyPayload, isFresh, newNonce } from "../federation/assertions.ts";
import { ControlValidationError } from "../errors.ts";

const PREFIX = "evolution:ra:";

export class EvolutionRatificationAuthority {
  readonly #metadata: MetadataPort;
  readonly #keys: KeyRegistry;

  constructor(metadata: MetadataPort, keys: KeyRegistry) {
    this.#metadata = metadata;
    this.#keys = keys;
  }

  register(record: Omit<EvolutionRARecord, "status"> & { status?: EvolutionRARecord["status"] }): EvolutionRARecord {
    if (!record.raId || !record.keyRef || !record.owner) {
      throw new ControlValidationError("Evolution RA requires raId, owner, and keyRef", { record });
    }
    if (!Number.isFinite(record.quorum) || record.quorum < 1) {
      throw new ControlValidationError("Evolution RA quorum must be >= 1", { record });
    }
    const full: EvolutionRARecord = { ...record, status: record.status ?? "active" };
    this.#metadata.put(`${PREFIX}${record.raId}`, full);
    return full;
  }

  get(raId: string): EvolutionRARecord | undefined {
    return this.#metadata.get(`${PREFIX}${raId}`)?.value as EvolutionRARecord | undefined;
  }

  revoke(raId: string): void {
    const rec = this.get(raId);
    if (!rec) throw new ControlValidationError(`Unknown evolution RA "${raId}"`, { raId });
    this.#metadata.put(`${PREFIX}${raId}`, { ...rec, status: "revoked" });
  }

  /** Build + sign a ratification using the RA owner's private key. */
  issue(
    priv: KeyObject,
    opts: {
      unitHash: string;
      raId: string;
      proposer: string;
      certifier: string;
      approvals: string[];
      certificationId: string;
      issuedAt?: number;
      expiresAt?: number;
      nonce?: string;
    },
  ): EvolutionRatification {
    const ra = this.get(opts.raId);
    if (!ra) throw new ControlValidationError(`Unknown evolution RA "${opts.raId}"`, { raId: opts.raId });
    const now = opts.issuedAt ?? Date.now();
    const base: Omit<EvolutionRatification, "signature"> = {
      ratificationId: `rat-${opts.unitHash.slice(0, 12)}-${now}`,
      unitHash: opts.unitHash,
      raId: opts.raId,
      ratifier: ra.owner,
      ratifierKeyRef: ra.keyRef,
      proposer: opts.proposer,
      certifier: opts.certifier,
      approvals: [...opts.approvals],
      certificationId: opts.certificationId,
      issuedAt: now,
      expiresAt: opts.expiresAt ?? now + 300_000,
      nonce: opts.nonce ?? newNonce(),
    };
    return { ...base, signature: signPayload(base, priv) };
  }

  /**
   * Verify a ratification: active RA + freshness + signature + quorum + separation of duties.
   * Fail-closed on any failure.
   */
  verify(rat: EvolutionRatification, opts: { nonces?: NonceCache; now?: number } = {}): VerificationResult {
    const now = opts.now ?? Date.now();
    const ra = this.get(rat.raId);
    if (!ra) return { ok: false, reason: `unknown evolution RA "${rat.raId}"` };
    if (ra.status !== "active") return { ok: false, reason: `evolution RA "${rat.raId}" is ${ra.status}` };
    if (!isFresh(rat.issuedAt, rat.expiresAt, now)) return { ok: false, reason: "ratification expired/not fresh" };

    // Separation of duties: proposer, approvers, certifier, ratifier pairwise distinct.
    const sod = this.#assertSeparationOfDuties(rat);
    if (!sod.ok) return sod;

    // Approval quorum.
    const distinctApprovers = new Set(rat.approvals);
    if (distinctApprovers.size < ra.quorum) {
      return { ok: false, reason: `insufficient approvals: ${distinctApprovers.size} < quorum ${ra.quorum}` };
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

  #assertSeparationOfDuties(rat: EvolutionRatification): VerificationResult {
    const roles: [string, string][] = [
      ["proposer", rat.proposer],
      ["certifier", rat.certifier],
      ["ratifier", rat.ratifier],
    ];
    const seen = new Map<string, string>();
    for (const [role, principal] of roles) {
      const prior = seen.get(principal);
      if (prior) return { ok: false, reason: `separation-of-duties violation: ${role} == ${prior} ("${principal}")` };
      seen.set(principal, role);
    }
    for (const approver of rat.approvals) {
      if (approver === rat.proposer) return { ok: false, reason: "separation-of-duties violation: approver == proposer" };
      if (approver === rat.certifier) return { ok: false, reason: "separation-of-duties violation: approver == certifier" };
      if (approver === rat.ratifier) return { ok: false, reason: "separation-of-duties violation: approver == ratifier" };
    }
    return { ok: true, reason: "separation of duties satisfied" };
  }
}
