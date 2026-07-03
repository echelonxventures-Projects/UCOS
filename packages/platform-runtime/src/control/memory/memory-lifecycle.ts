/**
 * UCOS Memory Fabric — Lifecycle transition table (MEM-GOV-002 §1).
 *
 * Working memory uses the ephemeral path (captured → active/consolidated/expired); durable tiers use
 * the governed path (proposed → certified → ratified → active). Every durable transition is signed,
 * governed, audited, and fail-closed. `forgotten` and `expired` are terminal (non-reversible).
 */

import type { MemoryState } from "./types.ts";
import { ControlValidationError } from "../errors.ts";

const ALLOWED: Record<MemoryState, readonly MemoryState[]> = {
  captured: ["active", "consolidated", "expired", "forgotten"],
  proposed: ["certified", "forgotten"],
  certified: ["ratified", "forgotten"],
  ratified: ["active", "forgotten"],
  active: ["consolidated", "superseded", "expired", "forgotten"],
  consolidated: ["superseded", "forgotten"],
  superseded: ["forgotten"],
  forgotten: [],
  expired: [],
};

export function canTransition(from: MemoryState, to: MemoryState): boolean {
  return ALLOWED[from].includes(to);
}

export function assertTransition(from: MemoryState, to: MemoryState): void {
  if (!canTransition(from, to)) {
    throw new ControlValidationError(`Illegal memory transition: ${from} -> ${to}`, { from, to });
  }
}

export function isTerminal(state: MemoryState): boolean {
  return ALLOWED[state].length === 0;
}
