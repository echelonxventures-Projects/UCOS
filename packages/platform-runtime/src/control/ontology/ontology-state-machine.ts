/**
 * UCOS Ontology Fabric — per-unit State Machine (ONTO-GOV-001).
 *
 * Tracks and guards the lifecycle state of each ontology unit (keyed by `unitHash`) against the
 * transition table. Deny-by-default: an unknown unit cannot transition until `start()`ed.
 */

import type { OntologyState } from "./types.ts";
import { assertTransition } from "./ontology-lifecycle.ts";
import { ControlValidationError } from "../errors.ts";

interface Entry {
  state: OntologyState;
  history: { state: OntologyState; at: number }[];
}

export class OntologyStateMachine {
  readonly #entries = new Map<string, Entry>();

  start(unitHash: string, initial: OntologyState = "draft"): void {
    if (this.#entries.has(unitHash)) {
      throw new ControlValidationError(`Ontology state already initialized for ${unitHash}`, { unitHash });
    }
    this.#entries.set(unitHash, { state: initial, history: [{ state: initial, at: Date.now() }] });
  }

  transition(unitHash: string, to: OntologyState): void {
    const entry = this.#entries.get(unitHash);
    if (!entry) throw new ControlValidationError(`No ontology state for ${unitHash}`, { unitHash });
    assertTransition(entry.state, to);
    entry.state = to;
    entry.history.push({ state: to, at: Date.now() });
  }

  state(unitHash: string): OntologyState | undefined {
    return this.#entries.get(unitHash)?.state;
  }

  history(unitHash: string): readonly { state: OntologyState; at: number }[] {
    return this.#entries.get(unitHash)?.history.map((h) => ({ ...h })) ?? [];
  }
}
