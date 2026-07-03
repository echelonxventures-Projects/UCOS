/**
 * UCOS Knowledge Fabric — Knowledge Store (KNOW-ARCH-001).
 *
 * READ surface over versioned knowledge records in the substrate Metadata runtime. There is NO public
 * governed-write here: all governed knowledge mutation routes through the Evolution Fabric (a
 * put-metadata op on `knowledge:record:*`). The store only reads records back for query/resolve.
 *
 * `writeViaEvolution` exposes the exact metadata key+value an evolution unit must write — it never
 * mutates the store itself, keeping the single mutation path inside the evolution transaction.
 */

import type { SemVer } from "../../contracts/types.ts";
import type { MetadataPort } from "../../meta-core/ports.ts";
import type { KnowledgeRecord } from "./types.ts";
import { recordIdPrefix, recordKey, recordNamespacePrefix } from "./knowledge-namespace.ts";

export class KnowledgeStore {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  get(namespace: string, knowledgeId: string, version: SemVer): KnowledgeRecord | undefined {
    return this.#metadata.get(recordKey(namespace, knowledgeId, version))?.value as KnowledgeRecord | undefined;
  }

  /** All versions of a knowledge id. */
  versions(namespace: string, knowledgeId: string): KnowledgeRecord[] {
    return this.#metadata.query(recordIdPrefix(namespace, knowledgeId)).map((r) => r.value as KnowledgeRecord);
  }

  /** All records within a namespace subtree. */
  inNamespace(namespace: string): KnowledgeRecord[] {
    return this.#metadata.query(recordNamespacePrefix(namespace)).map((r) => r.value as KnowledgeRecord);
  }

  /** All knowledge records. */
  all(): KnowledgeRecord[] {
    return this.#metadata.query(recordNamespacePrefix("knowledge:")).map((r) => r.value as KnowledgeRecord);
  }

  /**
   * The (key, value) an Evolution Fabric put-metadata op must write to persist `record`. The store
   * itself performs no write — this keeps the sole mutation path inside the evolution transaction.
   */
  static evolutionWrite(record: KnowledgeRecord): { key: string; value: KnowledgeRecord } {
    return { key: recordKey(record.namespace, record.knowledgeId, record.version), value: record };
  }
}
