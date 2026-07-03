/**
 * UCOS Operational Proof Fabric — per-incident State Machine (OPF-INC-002).
 *
 * Tracks and guards each incident's lifecycle state (keyed by incidentId) against the transition
 * table. Deny-by-default: an unknown incident cannot transition until `start()`ed.
 */

import type { IncidentState } from "./types.ts";
import { assertTransition } from "./incident-lifecycle.ts";
import { ControlValidationError } from "../errors.ts";

interface Entry {
  state: IncidentState;
  history: { state: IncidentState; at: number }[];
}

export class IncidentStateMachine {
  readonly #entries = new Map<string, Entry>();

  start(incidentId: string, initial: IncidentState = "open"): void {
    if (this.#entries.has(incidentId)) {
      throw new ControlValidationError(`Incident state already initialized for ${incidentId}`, { incidentId });
    }
    this.#entries.set(incidentId, { state: initial, history: [{ state: initial, at: Date.now() }] });
  }

  transition(incidentId: string, to: IncidentState): void {
    const entry = this.#entries.get(incidentId);
    if (!entry) throw new ControlValidationError(`No incident state for ${incidentId}`, { incidentId });
    assertTransition(entry.state, to);
    entry.state = to;
    entry.history.push({ state: to, at: Date.now() });
  }

  state(incidentId: string): IncidentState | undefined {
    return this.#entries.get(incidentId)?.state;
  }

  history(incidentId: string): readonly { state: IncidentState; at: number }[] {
    return this.#entries.get(incidentId)?.history.map((h) => ({ ...h })) ?? [];
  }
}
