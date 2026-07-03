/**
 * UCOS Memory Fabric — per-unit State Machine (MEM-GOV-002 §1).
 *
 * Tracks and guards the lifecycle state of each memory unit (keyed by `unitHash`) against the
 * transition table. Deny-by-default: an unknown unit cannot transition until `start()`ed.
 */

import type { MemoryState } from "./types.ts";
import { assertTransition } from "./memory-lifecycle.ts";
import { ControlValidationError } from "../errors.ts";

interface Entry {
  state: MemoryState;
  history: { state: MemoryState; at: number }[];
}

export class MemoryStateMachine {
  readonly #entries = new Map<string, Entry>();

  start(unitHash: string, initial: MemoryState = "captured"): void {
    if (this.#entries.has(unitHash)) {
      throw new ControlValidationError(`Memory state already initialized for ${unitHash}`, { unitHash });
    }
    this.#entries.set(unitHash, { state: initial, history: [{ state: initial, at: Date.now() }] });
  }

  transition(unitHash: string, to: MemoryState): void {
    const entry = this.#entries.get(unitHash);
    if (!entry) throw new ControlValidationError(`No memory state for ${unitHash}`, { unitHash });
    assertTransition(entry.state, to);
    entry.state = to;
    entry.history.push({ state: to, at: Date.now() });
  }

  state(unitHash: string): MemoryState | undefined {
    return this.#entries.get(unitHash)?.state;
  }

  history(unitHash: string): readonly { state: MemoryState; at: number }[] {
    return this.#entries.get(unitHash)?.history.map((h) => ({ ...h })) ?? [];
  }
}
