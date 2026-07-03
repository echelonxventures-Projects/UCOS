/**
 * UCOS Evolution Fabric — Signed Evolution Proposals (EVO-SEC-001).
 *
 * A proposal binds an Evolution Unit to a proposer, is Ed25519-signed over its canonical form, and
 * carries a single-use nonce + freshness window (replay protection). Tampering with the unit or the
 * proposal invalidates the signature. Signing reuses the federation cryptographic primitives.
 */

import type { KeyObject } from "node:crypto";
import type { EvolutionProposal, EvolutionUnit, ProposalOrigin, VerificationResult } from "./types.ts";
import type { KeyRegistry, NonceCache } from "../federation/assertions.ts";
import { signPayload, verifyPayload, isFresh, newNonce } from "../federation/assertions.ts";
import { unitHash } from "./evolution-unit.ts";

export interface MintProposalOptions {
  proposalId: string;
  unit: EvolutionUnit;
  proposer: string;
  proposerKeyRef: string;
  origin?: ProposalOrigin;
  issuedAt?: number;
  expiresAt?: number;
  nonce?: string;
  rationale?: string;
}

/** Mint a signed proposal for `unit` using the proposer's private key. */
export function mintProposal(priv: KeyObject, opts: MintProposalOptions): EvolutionProposal {
  const now = opts.issuedAt ?? Date.now();
  const base: Omit<EvolutionProposal, "signature"> = {
    proposalId: opts.proposalId,
    unitHash: unitHash(opts.unit),
    unit: opts.unit,
    proposer: opts.proposer,
    proposerKeyRef: opts.proposerKeyRef,
    origin: opts.origin ?? "external",
    issuedAt: now,
    expiresAt: opts.expiresAt ?? now + 300_000,
    nonce: opts.nonce ?? newNonce(),
    ...(opts.rationale !== undefined ? { rationale: opts.rationale } : {}),
  };
  return { ...base, signature: signPayload(base, priv) };
}

/**
 * Verify a proposal end-to-end: signature against the registered proposer key, freshness, the
 * declared `unitHash` matches the actual unit, and (optionally) single-use nonce enforcement.
 * Fail-closed: any missing key / unknown ref / stale window / hash mismatch => not verified.
 */
export function verifyProposal(
  proposal: EvolutionProposal,
  keys: KeyRegistry,
  opts: { nonces?: NonceCache; now?: number; nonceTtlMs?: number } = {},
): VerificationResult {
  const now = opts.now ?? Date.now();
  if (proposal.unitHash !== unitHash(proposal.unit)) return { ok: false, reason: "unitHash mismatch (unit tampered)" };
  if (!isFresh(proposal.issuedAt, proposal.expiresAt, now)) return { ok: false, reason: "proposal expired/not fresh" };
  const pub = keys.get(proposal.proposerKeyRef);
  if (!pub) return { ok: false, reason: `no public key for proposer keyRef "${proposal.proposerKeyRef}"` };
  const sig = proposal.signature;
  if (!sig) return { ok: false, reason: "proposal unsigned" };
  const { signature: _omit, ...payload } = proposal;
  if (!verifyPayload(payload, sig, pub)) return { ok: false, reason: "invalid proposal signature" };
  if (opts.nonces && !opts.nonces.checkAndRecord(proposal.proposer, proposal.nonce, opts.nonceTtlMs ?? 300_000, now)) {
    return { ok: false, reason: "proposal nonce replay" };
  }
  return { ok: true, reason: "proposal verified" };
}
