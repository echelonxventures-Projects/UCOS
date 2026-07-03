/**
 * UCOS Readiness Fabric — Signal construction, validation & hashing (RDN-SEC-001).
 *
 * A `signalHash = sha256(canonicalize(signal))` binds any downstream reference to the exact
 * observation content (tamper-evident). Signals are validated fail-closed: a malformed score, unknown
 * status, or missing dimension is rejected at ingestion rather than silently counted.
 */

import type { ReadinessSignal, SignalStatus } from "./types.ts";
import { STATUS_RANK } from "./types.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";
import { ControlValidationError } from "../errors.ts";

const STATUSES: readonly SignalStatus[] = ["pass", "warn", "fail", "unknown"];

export function signalHash(signal: ReadinessSignal): string {
  return sha256(canonicalize(signal));
}

export function validateSignal(signal: ReadinessSignal): void {
  if (!signal.signalId) throw new ControlValidationError("Readiness signal requires signalId", { signal });
  if (!signal.dimensionId) throw new ControlValidationError("Readiness signal requires dimensionId", { signal });
  if (!signal.source) throw new ControlValidationError("Readiness signal requires a source", { signal });
  if (!STATUSES.includes(signal.status)) {
    throw new ControlValidationError(`Readiness signal has unknown status: ${signal.status}`, { signal });
  }
  if (typeof signal.score !== "number" || !Number.isFinite(signal.score) || signal.score < 0 || signal.score > 1) {
    throw new ControlValidationError("Readiness signal score must be a finite number in [0,1]", { signal });
  }
  if (typeof signal.observedAt !== "number" || !Number.isFinite(signal.observedAt)) {
    throw new ControlValidationError("Readiness signal requires a numeric observedAt", { signal });
  }
}

export function createSignal(signal: ReadinessSignal): ReadinessSignal {
  validateSignal(signal);
  return { ...signal };
}

/** True if `actual` is at least as healthy as `required` (pass > warn > fail > unknown). */
export function statusAtLeast(actual: SignalStatus, required: SignalStatus): boolean {
  return STATUS_RANK[actual] >= STATUS_RANK[required];
}

/** Combine multiple statuses into the WORST (deny-by-default aggregation). */
export function worstStatus(statuses: readonly SignalStatus[]): SignalStatus {
  if (statuses.length === 0) return "unknown";
  return statuses.reduce((worst, s) => (STATUS_RANK[s] < STATUS_RANK[worst] ? s : worst), "pass" as SignalStatus);
}
