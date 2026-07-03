/**
 * UCOS Readiness Fabric — per-certification State Machine (RDN-GOV-002).
 *
 * Tracks and guards the lifecycle state of each readiness certification (keyed by certificationId)
 * against the transition table. Deny-by-default: an unknown certification cannot transition until
 * `start()`ed.
 */

import type { CertificationLifecycleState } from "./readiness-lifecycle.ts";
import { assertTransition } from "./readiness-lifecycle.ts";
import { ControlValidationError } from "../errors.ts";

interface Entry {
  state: CertificationLifecycleState;
  history: { state: CertificationLifecycleState; at: number }[];
}

export class ReadinessStateMachine {
  readonly #entries = new Map<string, Entry>();

  start(certificationId: string, initial: CertificationLifecycleState = "pending"): void {
    if (this.#entries.has(certificationId)) {
      throw new ControlValidationError(`Readiness state already initialized for ${certificationId}`, { certificationId });
    }
    this.#entries.set(certificationId, { state: initial, history: [{ state: initial, at: Date.now() }] });
  }

  transition(certificationId: string, to: CertificationLifecycleState): void {
    const entry = this.#entries.get(certificationId);
    if (!entry) throw new ControlValidationError(`No readiness state for ${certificationId}`, { certificationId });
    assertTransition(entry.state, to);
    entry.state = to;
    entry.history.push({ state: to, at: Date.now() });
  }

  state(certificationId: string): CertificationLifecycleState | undefined {
    return this.#entries.get(certificationId)?.state;
  }

  history(certificationId: string): readonly { state: CertificationLifecycleState; at: number }[] {
    return this.#entries.get(certificationId)?.history.map((h) => ({ ...h })) ?? [];
  }
}
