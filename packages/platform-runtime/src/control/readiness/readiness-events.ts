/**
 * UCOS Readiness Fabric — Event Bus (RDN-EVT-001).
 *
 * A lightweight, in-process publish/subscribe stream that emits readiness events as they occur, so
 * external monitors (dashboards, alerting, release gates) can react to CONTINUOUS assessment without
 * polling. This is the "hot path" observability surface; the hash-chained audit log is the
 * tamper-evident "cold path" of record. Every published event is also mirrored to the audit chain by
 * the orchestrator.
 *
 * Delivery is best-effort and isolated: a throwing subscriber never breaks publication or other
 * subscribers (fail-open for observability, never fail-open for authorization).
 */

import type { ReadinessAuditEvent } from "./types.ts";

export type ReadinessEventType = ReadinessAuditEvent;

export interface ReadinessEvent {
  type: ReadinessEventType;
  at: number;
  subject: string;
  detail: string;
  payload?: Record<string, unknown>;
}

export type ReadinessEventListener = (event: ReadinessEvent) => void;

export interface ReadinessEventBusOptions {
  /** Cap on retained history for replay/inspection (default 1000; 0 disables retention). */
  historyLimit?: number;
}

export class ReadinessEventBus {
  readonly #byType = new Map<ReadinessEventType, Set<ReadinessEventListener>>();
  readonly #wildcard = new Set<ReadinessEventListener>();
  readonly #history: ReadinessEvent[] = [];
  readonly #historyLimit: number;

  constructor(options: ReadinessEventBusOptions = {}) {
    this.#historyLimit = options.historyLimit ?? 1000;
  }

  /** Subscribe to a specific event type or "*" for all. Returns an unsubscribe function. */
  subscribe(type: ReadinessEventType | "*", listener: ReadinessEventListener): () => void {
    if (type === "*") {
      this.#wildcard.add(listener);
      return () => this.#wildcard.delete(listener);
    }
    let set = this.#byType.get(type);
    if (!set) {
      set = new Set();
      this.#byType.set(type, set);
    }
    set.add(listener);
    return () => set.delete(listener);
  }

  publish(event: ReadinessEvent): void {
    if (this.#historyLimit > 0) {
      this.#history.push(event);
      if (this.#history.length > this.#historyLimit) this.#history.shift();
    }
    const targeted = this.#byType.get(event.type);
    if (targeted) for (const l of targeted) this.#safe(l, event);
    for (const l of this.#wildcard) this.#safe(l, event);
  }

  history(): readonly ReadinessEvent[] {
    return this.#history.map((e) => ({ ...e }));
  }

  #safe(listener: ReadinessEventListener, event: ReadinessEvent): void {
    try {
      listener(event);
    } catch {
      /* isolate subscriber faults — observability must not break the control path */
    }
  }
}
