/**
 * UCOS Substrate — Durable MetadataPort adapter (DEL-001).
 *
 * A restart-safe MetadataPort. It keeps the ratified in-memory metadata store as its live,
 * derived projection and writes every mutation to an append-only log first (write-ahead), so the
 * authoritative metadata survives process and machine restart. The port contract is unchanged; the
 * kernel and fabrics remain unaware that storage is durable.
 *
 * Authority: the log is the durable record of authoritative state. The in-memory Map is a DERIVED
 * projection rebuilt by replaying the log during rehydration.
 */

import type { JsonSchema, ValidationResult } from "../contracts/types.ts";
import type { MetadataPort, MetadataRecord } from "../meta-core/ports.ts";
import { InMemoryMetadataStore, type MetadataStoreOptions } from "../metadata-runtime/metadata-store.ts";
import type { AppendOnlyLog } from "./append-only-log.ts";
import { canonicalStringify } from "./canonical.ts";

/** Append-only event: a single governed metadata write. */
interface MetadataPutEvent {
  readonly op: "put";
  readonly key: string;
  readonly value: unknown;
  readonly schema?: JsonSchema;
}

export interface DurableMetadataStoreOptions extends MetadataStoreOptions {}

export class DurableMetadataStore implements MetadataPort {
  readonly #inner: InMemoryMetadataStore;
  readonly #log: AppendOnlyLog;
  readonly #validateOnWrite: boolean;

  constructor(log: AppendOnlyLog, options: DurableMetadataStoreOptions = {}) {
    this.#validateOnWrite = options.validateOnWrite ?? true;
    this.#inner = new InMemoryMetadataStore({ validateOnWrite: this.#validateOnWrite });
    this.#log = log;
    this.#rehydrate();
  }

  /** Rebuild the in-memory projection by replaying the durable log in append order. */
  #rehydrate(): void {
    for (const record of this.#log.readAll()) {
      const event = record.event as MetadataPutEvent;
      if (event.op === "put") this.#apply(event);
    }
  }

  /** Apply an event to the in-memory projection only (no logging). */
  #apply(event: MetadataPutEvent): void {
    this.#inner.put(event.key, event.value, event.schema);
  }

  put(key: string, value: unknown, schema?: JsonSchema): void {
    // Idempotent no-op: a structurally identical write changes nothing, so it is neither applied nor
    // appended. This keeps the append-only history a record of actual STATE CHANGES and lets a restart
    // safely re-load repository descriptors (which re-put identical `capability:*`/`contract:*`
    // metadata) without growing the log. Version history for genuinely changed values is preserved.
    const existing = this.#inner.get(key);
    if (existing) {
      const before = canonicalStringify({ value: existing.value, schema: existing.schema ?? null });
      const after = canonicalStringify({ value, schema: schema ?? null });
      if (before === after) return;
    }
    // Apply to the projection first: the in-memory store performs full schema validation and throws
    // (fail-closed) on invalid input, so an invalid write is never appended to the durable log.
    this.#inner.put(key, value, schema);
    // Only durably record a mutation that actually succeeded (append-only history).
    const event: MetadataPutEvent = schema ? { op: "put", key, value, schema } : { op: "put", key, value };
    this.#log.append(event);
  }

  get(key: string): MetadataRecord | undefined {
    return this.#inner.get(key);
  }

  query(prefix: string): MetadataRecord[] {
    return this.#inner.query(prefix);
  }

  validate(value: unknown, schema: JsonSchema): ValidationResult {
    return this.#inner.validate(value, schema);
  }
}
