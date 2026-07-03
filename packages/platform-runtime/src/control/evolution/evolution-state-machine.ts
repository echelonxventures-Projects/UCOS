/**
 * UCOS Evolution Fabric — Per-unit Evolution State Machine (EVO-GOV-001).
 *
 * Tracks the current lifecycle state and history of every evolution unit (keyed by `unitHash`) and
 * enforces the guarded transition table. Deny-by-default: an unknown unit has no state and cannot
 * transition until `start()`ed.
 */

import type { EvolutionState } from "./types.ts";
import { assertTransition } from "./evolution-lifecycle.ts";
import { ControlValidationError } from "../errors.ts";

interface Entry {
  state: EvolutionState;
  history: { state: EvolutionState; at: number }[];
}

export class EvolutionStateMachine {
  readonly #entries = new Map<string, Entry>();

  /** Initialize a unit at `proposed`. */
  start(unitHash: string): void {
    if (this.#entries.has(unitHash)) {
      throw new ControlValidationError(`Evolution state already initialized for ${unitHash}`, { unitHash });
    }
    this.#entries.set(unitHash, { state: "proposed", history: [{ state: "proposed", at: Date.now() }] });
  }

  transition(unitHash: string, to: EvolutionState): void {
    const entry = this.#entries.get(unitHash);
    if (!entry) throw new ControlValidationError(`No evolution state for ${unitHash}`, { unitHash });
    assertTransition(entry.state, to);
    entry.state = to;
    entry.history.push({ state: to, at: Date.now() });
  }

  state(unitHash: string): EvolutionState | undefined {
    return this.#entries.get(unitHash)?.state;
  }

  history(unitHash: string): readonly { state: EvolutionState; at: number }[] {
    return this.#entries.get(unitHash)?.history.map((h) => ({ ...h })) ?? [];
  }
}
