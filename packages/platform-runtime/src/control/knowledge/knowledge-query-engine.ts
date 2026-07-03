/**
 * UCOS Knowledge Fabric — Query Engine (KNOW-ARCH-001, gate: read-only).
 *
 * Deterministic, read-only querying over knowledge records: namespace/prefix scan, predicate
 * filtering, SemVer version-range resolution, active-version selection, revocation filtering, and
 * trust-boundary/min-trust filtering. Fail-closed: revoked or below-trust records are excluded by
 * default; unknown state is treated as non-active. Introduces no core modification (a new additive
 * control-layer module over `MetadataPort.query`).
 */

import type { KnowledgeQuery, KnowledgeRecord } from "./types.ts";
import type { KnowledgeStore } from "./knowledge-store.ts";
import type { KnowledgeRevocationAuthority } from "./knowledge-revocation-authority.ts";
import { maxSatisfying } from "../../meta-core/semver.ts";

export class KnowledgeQueryEngine {
  readonly #store: KnowledgeStore;
  readonly #revocations: KnowledgeRevocationAuthority;

  constructor(store: KnowledgeStore, revocations: KnowledgeRevocationAuthority) {
    this.#store = store;
    this.#revocations = revocations;
  }

  /** Run a query and return matching records (deterministically ordered by key). */
  query(q: KnowledgeQuery): KnowledgeRecord[] {
    let records = q.namespace ? this.#store.inNamespace(q.namespace) : this.#store.all();

    records = records.filter((r) => this.#admissible(r, q));

    if (q.predicate) records = records.filter((r) => this.#safePredicate(q.predicate as (r: KnowledgeRecord) => boolean, r));

    // Deterministic ordering: namespace, id, version.
    records.sort((a, b) =>
      a.namespace.localeCompare(b.namespace) || a.knowledgeId.localeCompare(b.knowledgeId) || a.version.localeCompare(b.version),
    );
    return records;
  }

  /** Resolve the highest record of `id` in `namespace` satisfying `range` and admissibility. */
  resolveHighest(namespace: string, knowledgeId: string, range = "*", q: Omit<KnowledgeQuery, "namespace" | "versionRange"> = {}): KnowledgeRecord | undefined {
    const candidates = this.#store
      .versions(namespace, knowledgeId)
      .filter((r) => this.#admissible(r, { ...q, versionRange: range }));
    if (candidates.length === 0) return undefined;
    const best = maxSatisfying(candidates.map((r) => r.version), range);
    if (best === undefined) return undefined;
    return candidates.find((r) => r.version === best);
  }

  /** Admissibility: active-only (unless overridden), not revoked, meets trust floor, satisfies range. */
  #admissible(r: KnowledgeRecord, q: KnowledgeQuery): boolean {
    if (!q.includeNonActive && r.state !== "active") return false; // fail-closed: only active by default
    if (this.#revocations.isRevoked("record", `${r.namespace}:${r.knowledgeId}@${r.version}`)) return false;
    if (this.#revocations.isRevoked("unit", r.unitHash)) return false;
    if (q.minTrustLevel !== undefined && r.trustLevel < q.minTrustLevel) return false;
    if (q.versionRange && q.versionRange !== "*") {
      const best = maxSatisfying([r.version], q.versionRange);
      if (best === undefined) return false;
    }
    return true;
  }

  #safePredicate(predicate: (r: KnowledgeRecord) => boolean, r: KnowledgeRecord): boolean {
    try {
      return predicate(r) === true;
    } catch {
      return false; // fail-closed: a throwing predicate excludes the record
    }
  }
}
