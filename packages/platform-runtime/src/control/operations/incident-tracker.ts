/**
 * UCOS Operational Proof Fabric — Incident Tracker (OPF-INC-003).
 *
 * Constructs versioned, append-only incident records and guards their lifecycle via the state machine.
 * The tracker performs NO persistence itself — it returns the next immutable incident record for the
 * control layer to persist through the Evolution Fabric (single mutation path). Each transition bumps
 * the version and appends to an immutable timeline, so the incident record IS the operational proof of
 * how the incident was handled.
 */

import type { IncidentRecord, IncidentSeverity, IncidentState } from "./types.ts";
import { IncidentStateMachine } from "./incident-state-machine.ts";
import { assertTransition } from "./incident-lifecycle.ts";
import { ControlValidationError } from "../errors.ts";

export interface OpenIncidentInput {
  incidentId: string;
  tenantId: string;
  title: string;
  severity: IncidentSeverity;
  actor: string;
  linkedAlerts?: string[];
  linkedEvidence?: string[];
  note?: string;
  now?: number;
}

function versionForTimeline(count: number): string {
  // v1.0.0 at open (count 1), then patch-increment per subsequent event.
  return `1.0.${Math.max(0, count - 1)}`;
}

export class IncidentTracker {
  readonly states: IncidentStateMachine;
  // latest in-memory record per incident (authoritative store copy is read via OperationsStore)
  readonly #latest = new Map<string, IncidentRecord>();

  constructor(states?: IncidentStateMachine) {
    this.states = states ?? new IncidentStateMachine();
  }

  /** Build the initial (v1.0.0, open) incident record. Does not persist. */
  open(input: OpenIncidentInput): IncidentRecord {
    if (this.#latest.has(input.incidentId)) {
      throw new ControlValidationError(`Incident already open: ${input.incidentId}`, { incidentId: input.incidentId });
    }
    const now = input.now ?? Date.now();
    this.states.start(input.incidentId, "open");
    const timeline = [{ at: now, state: "open" as IncidentState, actor: input.actor, ...(input.note ? { note: input.note } : {}) }];
    const record: IncidentRecord = {
      incidentId: input.incidentId,
      version: versionForTimeline(timeline.length),
      tenantId: input.tenantId,
      title: input.title,
      severity: input.severity,
      state: "open",
      openedAt: now,
      linkedAlerts: input.linkedAlerts ? [...input.linkedAlerts] : [],
      linkedEvidence: input.linkedEvidence ? [...input.linkedEvidence] : [],
      timeline,
      provenance: { origin: "local" },
    };
    this.#latest.set(input.incidentId, record);
    return record;
  }

  /** Build the next incident record for a guarded transition. Does not persist. */
  transition(
    incidentId: string,
    to: IncidentState,
    actor: string,
    opts: { note?: string; linkAlert?: string; linkEvidence?: string; now?: number } = {},
  ): IncidentRecord {
    const prev = this.#latest.get(incidentId);
    if (!prev) throw new ControlValidationError(`Unknown incident: ${incidentId}`, { incidentId });
    assertTransition(prev.state, to);
    this.states.transition(incidentId, to);
    const now = opts.now ?? Date.now();
    const timeline = [...prev.timeline, { at: now, state: to, actor, ...(opts.note ? { note: opts.note } : {}) }];
    const record: IncidentRecord = {
      ...prev,
      version: versionForTimeline(timeline.length),
      state: to,
      linkedAlerts: opts.linkAlert ? [...prev.linkedAlerts, opts.linkAlert] : prev.linkedAlerts,
      linkedEvidence: opts.linkEvidence ? [...prev.linkedEvidence, opts.linkEvidence] : prev.linkedEvidence,
      timeline,
    };
    this.#latest.set(incidentId, record);
    return record;
  }

  latest(incidentId: string): IncidentRecord | undefined {
    const r = this.#latest.get(incidentId);
    return r ? { ...r, timeline: r.timeline.map((e) => ({ ...e })) } : undefined;
  }

  state(incidentId: string): IncidentState | undefined {
    return this.states.state(incidentId);
  }
}
