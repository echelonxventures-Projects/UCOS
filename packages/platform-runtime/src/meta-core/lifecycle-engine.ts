/**
 * UCOS Substrate — Lifecycle Engine (Meta-Core).
 *
 * Tracks and guards the lifecycle state of every registered capability. Transitions are
 * validated against an allowed-transition table; illegal transitions raise a governance error.
 */

import type { LifecycleState, SemVer } from "../contracts/types.ts";
import { LifecycleViolationError } from "./errors.ts";

const ALLOWED_TRANSITIONS: Record<LifecycleState, readonly LifecycleState[]> = {
  registered: ["validated", "failed"],
  validated: ["resolved", "failed"],
  resolved: ["composed", "failed"],
  composed: ["active", "failed"],
  active: ["retired", "failed"],
  retired: [],
  failed: [],
};

export interface LifecycleEntry {
  state: LifecycleState;
  history: { state: LifecycleState; at: number }[];
}

function key(id: string, version: SemVer): string {
  return `${id}@${version}`;
}

export class LifecycleEngine {
  readonly #entries = new Map<string, LifecycleEntry>();

  register(id: string, version: SemVer): void {
    const entryKey = key(id, version);
    if (this.#entries.has(entryKey)) {
      throw new LifecycleViolationError(`Lifecycle already initialized for ${entryKey}`, { id, version });
    }
    this.#entries.set(entryKey, { state: "registered", history: [{ state: "registered", at: Date.now() }] });
  }

  transition(id: string, version: SemVer, to: LifecycleState): void {
    const entryKey = key(id, version);
    const entry = this.#entries.get(entryKey);
    if (!entry) {
      throw new LifecycleViolationError(`No lifecycle entry for ${entryKey}`, { id, version });
    }
    const allowed = ALLOWED_TRANSITIONS[entry.state];
    if (!allowed.includes(to)) {
      throw new LifecycleViolationError(
        `Illegal lifecycle transition for ${entryKey}: ${entry.state} -> ${to}`,
        { id, version, from: entry.state, to },
      );
    }
    entry.state = to;
    entry.history.push({ state: to, at: Date.now() });
  }

  state(id: string, version: SemVer): LifecycleState | undefined {
    return this.#entries.get(key(id, version))?.state;
  }

  entry(id: string, version: SemVer): LifecycleEntry | undefined {
    return this.#entries.get(key(id, version));
  }
}
