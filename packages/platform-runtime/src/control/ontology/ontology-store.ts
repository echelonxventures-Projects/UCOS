/**
 * UCOS Ontology Fabric — Ontology Store (ONTO-ARCH-001 §5).
 *
 * READ surface over versioned ontology records in the substrate Metadata runtime. There is NO public
 * governed-write here: all governed ontology mutation routes through the Evolution Fabric (a
 * put-metadata op on `ontology:record:*`). The store only reads records back for query/resolve/graph.
 *
 * `evolutionWrite` exposes the exact metadata key+value an evolution unit must write — it never
 * mutates the store itself, keeping the single mutation path inside the evolution transaction.
 */

import type { SemVer } from "../../contracts/types.ts";
import type { MetadataPort } from "../../meta-core/ports.ts";
import type { OntologyKind, OntologyRecord } from "./types.ts";
import { recordIdPrefix, recordKey, recordKindPrefix, recordNamespacePrefix } from "./ontology-namespace.ts";

export class OntologyStore {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  get(namespace: string, kind: OntologyKind, localId: string, version: SemVer): OntologyRecord | undefined {
    return this.#metadata.get(recordKey(namespace, kind, localId, version))?.value as OntologyRecord | undefined;
  }

  /** All versions of a `(kind, localId)`. */
  versions(namespace: string, kind: OntologyKind, localId: string): OntologyRecord[] {
    return this.#metadata.query(recordIdPrefix(namespace, kind, localId)).map((r) => r.value as OntologyRecord);
  }

  /** All records of a kind within a namespace subtree. */
  ofKind(namespace: string, kind: OntologyKind): OntologyRecord[] {
    return this.#metadata.query(recordKindPrefix(namespace, kind)).map((r) => r.value as OntologyRecord);
  }

  /** All records within a namespace subtree. */
  inNamespace(namespace: string): OntologyRecord[] {
    return this.#metadata.query(recordNamespacePrefix(namespace)).map((r) => r.value as OntologyRecord);
  }

  /** All ontology records. */
  all(): OntologyRecord[] {
    return this.#metadata.query(recordNamespacePrefix("ontology:")).map((r) => r.value as OntologyRecord);
  }

  /**
   * The (key, value) an Evolution Fabric put-metadata op must write to persist `record`. The store
   * itself performs no write — this keeps the sole mutation path inside the evolution transaction.
   */
  static evolutionWrite(record: OntologyRecord): { key: string; value: OntologyRecord } {
    return { key: recordKey(record.namespace, record.kind, record.localId, record.version), value: record };
  }
}
