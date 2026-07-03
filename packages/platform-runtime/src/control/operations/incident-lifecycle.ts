/**
 * UCOS Operational Proof Fabric — Incident lifecycle transition table (OPF-INC-001).
 *
 * Authoritative incident lifecycle. Every transition is audited and (as a versioned incident record)
 * persisted through the Evolution Fabric. `closed` is terminal; a `resolved` incident may be reopened.
 */

import type { IncidentState } from "./types.ts";
import { ControlValidationError } from "../errors.ts";

const ALLOWED: Record<IncidentState, readonly IncidentState[]> = {
  open: ["acknowledged", "mitigated", "resolved"],
  acknowledged: ["mitigated", "resolved"],
  mitigated: ["resolved", "open"], // regression => reopen
  resolved: ["closed", "open"], // reopen if it recurs
  closed: [],
};

export function canTransition(from: IncidentState, to: IncidentState): boolean {
  return ALLOWED[from].includes(to);
}

export function assertTransition(from: IncidentState, to: IncidentState): void {
  if (!canTransition(from, to)) {
    throw new ControlValidationError(`Illegal incident transition: ${from} -> ${to}`, { from, to });
  }
}

export function isTerminal(state: IncidentState): boolean {
  return ALLOWED[state].length === 0;
}
