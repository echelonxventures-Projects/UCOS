/**
 * UCOS Substrate — dom_ops-backed durable MetadataPort adapter (AC-D1).
 *
 * A restart-safe MetadataPort whose durable record is the Operations System-of-Record (`dom_ops`)
 * via a {@link DomOpsJournal}. It keeps the ratified in-memory metadata store as its live, DERIVED
 * projection and records every mutation to the journal, so authoritative metadata survives process
 * and machine restart. The port contract is unchanged; the kernel and fabrics remain unaware that
 * storage is durable and SoR-backed.
 *
 * Sync surface over an async SoR: the MetadataPort signature is synchronous and MUST NOT change, but
 * `dom_ops` is a networked backend. put() therefore applies to the in-memory projection first (which
 * performs full, fail-closed schema validation) and enqueues the durable append on a serialized
 * promise chain that preserves append order. Callers reach a durable consistency boundary via
 * drain(); a failed durable append latches the store fail-closed (UPP-5) so no subsequent write can
 * silently proceed on an unpersisted mutation.
 *
 * Authority: the journal (dom_ops) is the durable record of authoritative state. The in-memory Map is
 * a DERIVED projection rebuilt by replaying the journal during open()/rehydration.
 */

import type { JsonSchema, ValidationResult } from "../contracts/types.ts";
import type { MetadataPort, MetadataRecord } from "../meta-core/ports.ts";
import { InMemoryMetadataStore, type MetadataStoreOptions } from "../metadata-runtime/metadata-store.ts";
import type { DomOpsJournal, DomOpsMetadataEvent } from "./dom-ops-journal.ts";
import { canonicalStringify } from "./canonical.ts";

export interface DomOpsMetadataStoreOptions extends MetadataStoreOptions {}

export class DomOpsMetadataStore implements MetadataPort {
  readonly #inner: InMemoryMetadataStore;
  readonly #journal: DomOpsJournal;
  /** Terminal revocation tombstones (fail-closed): a revoked key never resolves and cannot be re-put. */
  readonly #revoked = new Set<string>();
  /** Serialized durable-append chain: preserves append order across concurrent put() calls. */
  #tail: Promise<void> = Promise.resolve();
  /** Fail-closed latch: the first durable-append failure, rethrown on drain() and future put(). */
  #failure: Error | undefined;

  private constructor(journal: DomOpsJournal, options: DomOpsMetadataStoreOptions) {
    this.#inner = new InMemoryMetadataStore({ validateOnWrite: options.validateOnWrite ?? true });
    this.#journal = journal;
  }

  /**
   * Open a durable store over `journal`, rebuilding the in-memory projection by replaying the durable
   * journal in append order. Asynchronous because the SoR backend is networked; construction of the
   * synchronous MetadataPort surface completes only after rehydration.
   */
  static async open(
    journal: DomOpsJournal,
    options: DomOpsMetadataStoreOptions = {},
  ): Promise<DomOpsMetadataStore> {
    const store = new DomOpsMetadataStore(journal, options);
    for (const record of await journal.readAll()) {
      const event = record.event;
      if (event.op === "put") store.#apply(event);
      else if (event.op === "revoke") store.#revoked.add(event.key);
    }
    return store;
  }

  /** Apply a put event to the in-memory projection only (no journaling). */
  #apply(event: Extract<DomOpsMetadataEvent, { op: "put" }>): void {
    this.#inner.put(event.key, event.value, event.schema);
  }

  put(key: string, value: unknown, schema?: JsonSchema): void {
    // Fail-closed: a prior durable append failed; refuse further writes until reopened.
    if (this.#failure) throw this.#failure;
    // Fail-closed: a revoked key is terminal — it can neither resolve nor be resurrected.
    if (this.#revoked.has(key)) throw new Error(`metadata "${key}" is revoked (fail-closed)`);

    // Idempotent no-op: a structurally identical write changes nothing, so it is neither applied nor
    // journaled. This keeps the append-only history a record of actual STATE CHANGES and lets a
    // restart safely re-put identical descriptor metadata without growing the journal.
    const existing = this.#inner.get(key);
    if (existing) {
      const before = canonicalStringify({ value: existing.value, schema: existing.schema ?? null });
      const after = canonicalStringify({ value, schema: schema ?? null });
      if (before === after) return;
    }

    // Apply to the projection first: the in-memory store performs full schema validation and throws
    // (fail-closed) on invalid input, so an invalid write is never enqueued for durable append.
    this.#inner.put(key, value, schema);

    // Only durably record a mutation that actually succeeded (append-only history).
    const event: DomOpsMetadataEvent = schema
      ? { op: "put", key, value, schema }
      : { op: "put", key, value };
    this.#enqueue(event);
  }

  /**
   * Terminally revoke a metadata key (fail-closed). The revocation is durably journaled as an
   * append-only `revoke` event; after it drains, the key never resolves on get()/query() and any
   * later put() to it throws. Not part of the MetadataPort seam — a concrete durable-store operation.
   */
  revoke(key: string): void {
    if (this.#failure) throw this.#failure;
    if (this.#revoked.has(key)) return; // idempotent: already terminal
    this.#revoked.add(key);
    this.#enqueue({ op: "revoke", key });
  }

  /** Serialize durable appends; latch the first failure fail-closed without breaking the chain. */
  #enqueue(event: DomOpsMetadataEvent): void {
    this.#tail = this.#tail.then(async () => {
      if (this.#failure) return;
      try {
        await this.#journal.append(event);
      } catch (cause) {
        this.#failure = new Error(`dom_ops durable append failed for metadata "${event.key}"`, { cause });
      }
    });
  }

  /**
   * Await the durable consistency boundary: all enqueued appends are persisted to `dom_ops`. Throws
   * (fail-closed) if any durable append failed, so callers never treat unpersisted state as durable.
   */
  async drain(): Promise<void> {
    await this.#tail;
    if (this.#failure) throw this.#failure;
  }

  get(key: string): MetadataRecord | undefined {
    if (this.#revoked.has(key)) return undefined; // fail-closed: revoked keys do not resolve
    return this.#inner.get(key);
  }

  query(prefix: string): MetadataRecord[] {
    return this.#inner.query(prefix).filter((record) => !this.#revoked.has(record.key));
  }

  validate(value: unknown, schema: JsonSchema): ValidationResult {
    return this.#inner.validate(value, schema);
  }
}
