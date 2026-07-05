/**
 * UCOS Substrate — Durable RegistryPort adapter (DEL-002).
 *
 * A restart-safe RegistryPort over the append-only log. The ratified in-memory registry is the live,
 * derived projection (including its version index); the log is the durable record of registrations
 * and unregistrations. Rehydration replays the log to rebuild both the records and the derived
 * version index deterministically.
 */

import type { SemVer, VersionRange } from "../contracts/types.ts";
import type { RegistryPort, RegistryRecord } from "../meta-core/ports.ts";
import { InMemoryRegistry } from "../registry-runtime/registry.ts";
import type { AppendOnlyLog } from "./append-only-log.ts";
import { canonicalStringify } from "./canonical.ts";

interface RegisterEvent {
  readonly op: "register";
  readonly record: RegistryRecord;
}

interface UnregisterEvent {
  readonly op: "unregister";
  readonly id: string;
  readonly version: SemVer;
}

type RegistryEvent = RegisterEvent | UnregisterEvent;

export class DurableRegistryStore implements RegistryPort {
  readonly #inner: InMemoryRegistry;
  readonly #log: AppendOnlyLog;

  constructor(log: AppendOnlyLog) {
    this.#inner = new InMemoryRegistry();
    this.#log = log;
    this.#rehydrate();
  }

  /** Rebuild the projection (records + derived version index) by replaying the log in order. */
  #rehydrate(): void {
    for (const record of this.#log.readAll()) {
      this.#apply(record.event as RegistryEvent);
    }
  }

  /** Apply an event to the in-memory projection only (no logging). */
  #apply(event: RegistryEvent): void {
    if (event.op === "register") {
      this.#inner.register(event.record);
    } else {
      this.#inner.unregister(event.id, event.version);
    }
  }

  register(record: RegistryRecord): void {
    // Idempotent convergence: re-registering a structurally identical record is a no-op. This lets a
    // restart rebuild DERIVED state (lifecycle + composition) by re-loading repository descriptors
    // even though the same registrations were already replayed from the durable log. A conflicting
    // (different) record for the same id@version still fails via the inner registry (REGISTRY_CONFLICT).
    const existing = this.#inner.get(record.id, record.version);
    if (existing && canonicalStringify(existing) === canonicalStringify(record)) return;
    // Apply first: validation (version validity + conflict) throws before anything is logged.
    this.#inner.register(record);
    this.#log.append({ op: "register", record } satisfies RegisterEvent);
  }

  unregister(id: string, version: SemVer): void {
    this.#inner.unregister(id, version);
    this.#log.append({ op: "unregister", id, version } satisfies UnregisterEvent);
  }

  get(id: string, version: SemVer): RegistryRecord | undefined {
    return this.#inner.get(id, version);
  }

  resolve(id: string, range: VersionRange): RegistryRecord | undefined {
    return this.#inner.resolve(id, range);
  }

  list(kind?: "capability" | "contract"): RegistryRecord[] {
    return this.#inner.list(kind);
  }

  has(id: string, range?: VersionRange): boolean {
    return this.#inner.has(id, range);
  }
}
