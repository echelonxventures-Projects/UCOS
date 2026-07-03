/**
 * UCOS Memory Fabric — Memory Store (MEM-ARCH-001).
 *
 * READ surface over versioned memory records in the substrate Metadata runtime. There is NO public
 * governed-write here: all durable memory mutation routes through the Evolution Fabric (a put-metadata
 * op on `memory:record:*`). The store only reads records back for query/resolve.
 *
 * `evolutionWrite` exposes the exact metadata key+value an evolution unit must write — it never mutates
 * the store itself, keeping the single mutation path inside the evolution transaction.
 */

import type { SemVer } from "../../contracts/types.ts";
import type { MetadataPort } from "../../meta-core/ports.ts";
import type { MemoryRecord } from "./types.ts";
import { recordIdPrefix, recordKey, recordNamespacePrefix } from "./memory-namespace.ts";

export class MemoryStore {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  get(namespace: string, memId: string, version: SemVer): MemoryRecord | undefined {
    return this.#metadata.get(recordKey(namespace, memId, version))?.value as MemoryRecord | undefined;
  }

  /** All versions of a memory id. */
  versions(namespace: string, memId: string): MemoryRecord[] {
    return this.#metadata.query(recordIdPrefix(namespace, memId)).map((r) => r.value as MemoryRecord);
  }

  /** All records within a namespace subtree. */
  inNamespace(namespace: string): MemoryRecord[] {
    return this.#metadata.query(recordNamespacePrefix(namespace)).map((r) => r.value as MemoryRecord);
  }

  /** All local memory records. */
  all(): MemoryRecord[] {
    return this.#metadata.query(recordNamespacePrefix("memory:")).map((r) => r.value as MemoryRecord);
  }

  /**
   * The (key, value) an Evolution Fabric put-metadata op must write to persist `record`. The store
   * itself performs no write — this keeps the sole mutation path inside the evolution transaction.
   */
  static evolutionWrite(record: MemoryRecord): { key: string; value: MemoryRecord } {
    return { key: recordKey(record.namespace, record.memId, record.version), value: record };
  }
}
