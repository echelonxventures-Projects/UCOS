/**
 * UCOS Readiness Fabric — Certification lifecycle transition table (RDN-GOV-002).
 *
 * A readiness certification is `certified` when issued, and may only move to the terminal states
 * `revoked` (governed revocation) or `expired` (time-based). Terminal states are non-reversible: a new
 * assessment + a fresh certification is required to re-establish readiness. Deny-by-default: an unknown
 * certification cannot transition until `start()`ed.
 */

import type { CertificationStatus } from "./types.ts";
import { ControlValidationError } from "../errors.ts";

/** `pending` is the pre-issue state (assessment produced, not yet certified). */
export type CertificationLifecycleState = "pending" | "certified" | "revoked" | "expired";

const ALLOWED: Record<CertificationLifecycleState, readonly CertificationLifecycleState[]> = {
  pending: ["certified"],
  certified: ["revoked", "expired"],
  revoked: [],
  expired: [],
};

export function canTransition(from: CertificationLifecycleState, to: CertificationLifecycleState): boolean {
  return ALLOWED[from].includes(to);
}

export function assertTransition(from: CertificationLifecycleState, to: CertificationLifecycleState): void {
  if (!canTransition(from, to)) {
    throw new ControlValidationError(`Illegal readiness certification transition: ${from} -> ${to}`, { from, to });
  }
}

export function isTerminal(state: CertificationLifecycleState): boolean {
  return ALLOWED[state].length === 0;
}

/** Map a persisted certification status to its lifecycle state. */
export function stateForStatus(status: CertificationStatus): CertificationLifecycleState {
  return status === "revoked" ? "revoked" : "certified";
}
