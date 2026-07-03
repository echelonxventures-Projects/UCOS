/**
 * UCOS Ontology Fabric — Lifecycle transition table (ONTO-GOV-001 / ONTO-C2).
 *
 * Authoritative ontology-record lifecycle, sharing the ratified PI-7 vocabulary (AD-0021 §2 advisory:
 * `validated` realizes ONTO-ARCH-001's `proposed`). Every transition must be signed, governed, audited,
 * and fail-closed. `revoked` is reachable from every pre-terminal state; `archived` is terminal.
 */

import type { OntologyState } from "./types.ts";
import { ControlValidationError } from "../errors.ts";

const ALLOWED: Record<OntologyState, readonly OntologyState[]> = {
  draft: ["validated", "revoked"],
  validated: ["certified", "draft", "revoked"], // draft = rework
  certified: ["ratified", "revoked"],
  ratified: ["active", "revoked"],
  active: ["superseded", "revoked", "archived"],
  superseded: ["archived"],
  revoked: ["archived"],
  archived: [],
};

export function canTransition(from: OntologyState, to: OntologyState): boolean {
  return ALLOWED[from].includes(to);
}

export function assertTransition(from: OntologyState, to: OntologyState): void {
  if (!canTransition(from, to)) {
    throw new ControlValidationError(`Illegal ontology transition: ${from} -> ${to}`, { from, to });
  }
}

export function isTerminal(state: OntologyState): boolean {
  return ALLOWED[state].length === 0;
}
