/**
 * UCOS Evolution Fabric — Evolution Lifecycle transition table (EVO-GOV-001).
 *
 * The evolution lifecycle is DISTINCT from the meta-core capability lifecycle: it adds reversal
 * edges (`applied -> rolled-back`) that the core lifecycle intentionally lacks. Terminal states
 * (`rolled-back`, `failed`) are recoverable only via a NEW proposal. Transitions are guarded;
 * an illegal transition is a governance error (fail-closed).
 */

import type { EvolutionState } from "./types.ts";
import { ControlValidationError } from "../errors.ts";

const ALLOWED: Record<EvolutionState, readonly EvolutionState[]> = {
  proposed: ["reviewed", "failed"],
  reviewed: ["approved", "failed"],
  approved: ["certified", "failed"],
  certified: ["ratified", "failed"],
  ratified: ["applied", "failed"],
  applied: ["active", "rolled-back", "failed"],
  active: ["rolled-back"],
  "rolled-back": [],
  failed: [],
};

export function canTransition(from: EvolutionState, to: EvolutionState): boolean {
  return ALLOWED[from].includes(to);
}

export function assertTransition(from: EvolutionState, to: EvolutionState): void {
  if (!canTransition(from, to)) {
    throw new ControlValidationError(`Illegal evolution transition: ${from} -> ${to}`, { from, to });
  }
}

export function isTerminal(state: EvolutionState): boolean {
  return ALLOWED[state].length === 0;
}
