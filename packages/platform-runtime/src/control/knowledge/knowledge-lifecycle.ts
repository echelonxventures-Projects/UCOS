/**
 * UCOS Knowledge Fabric — Lifecycle transition table (KNOW-GOV-001).
 *
 * Authoritative knowledge lifecycle. Every transition must be signed, governed, audited, and
 * fail-closed. `revoked` is reachable from every pre-terminal state; `archived` is terminal.
 */

import type { KnowledgeState } from "./types.ts";
import { ControlValidationError } from "../errors.ts";

const ALLOWED: Record<KnowledgeState, readonly KnowledgeState[]> = {
  draft: ["validated", "revoked"],
  validated: ["certified", "draft", "revoked"], // draft = rework
  certified: ["ratified", "revoked"],
  ratified: ["active", "revoked"],
  active: ["superseded", "revoked", "archived"],
  superseded: ["archived"],
  revoked: ["archived"],
  archived: [],
};

export function canTransition(from: KnowledgeState, to: KnowledgeState): boolean {
  return ALLOWED[from].includes(to);
}

export function assertTransition(from: KnowledgeState, to: KnowledgeState): void {
  if (!canTransition(from, to)) {
    throw new ControlValidationError(`Illegal knowledge transition: ${from} -> ${to}`, { from, to });
  }
}

export function isTerminal(state: KnowledgeState): boolean {
  return ALLOWED[state].length === 0;
}
