/**
 * UCOS Knowledge Fabric — per-unit State Machine (KNOW-GOV-001).
 *
 * Tracks and guards the lifecycle state of each knowledge unit (keyed by `unitHash`) against the
 * transition table. Deny-by-default: an unknown unit cannot transition until `start()`ed.
 */

import type { KnowledgeState } from "./types.ts";
import { assertTransition } from "./knowledge-lifecycle.ts";
import { ControlValidationError } from "../errors.ts";

interface Entry {
  state: KnowledgeState;
  history: { state: KnowledgeState; at: number }[];
}

export class KnowledgeStateMachine {
  readonly #entries = new Map<string, Entry>();

  start(unitHash: string, initial: KnowledgeState = "draft"): void {
    if (this.#entries.has(unitHash)) {
      throw new ControlValidationError(`Knowledge state already initialized for ${unitHash}`, { unitHash });
    }
    this.#entries.set(unitHash, { state: initial, history: [{ state: initial, at: Date.now() }] });
  }

  transition(unitHash: string, to: KnowledgeState): void {
    const entry = this.#entries.get(unitHash);
    if (!entry) throw new ControlValidationError(`No knowledge state for ${unitHash}`, { unitHash });
    assertTransition(entry.state, to);
    entry.state = to;
    entry.history.push({ state: to, at: Date.now() });
  }

  state(unitHash: string): KnowledgeState | undefined {
    return this.#entries.get(unitHash)?.state;
  }

  history(unitHash: string): readonly { state: KnowledgeState; at: number }[] {
    return this.#entries.get(unitHash)?.history.map((h) => ({ ...h })) ?? [];
  }
}
