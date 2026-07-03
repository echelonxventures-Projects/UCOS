/**
 * UCOS Memory Fabric — Query Engine (MEM-ARCH-001, gate: read-only).
 *
 * Deterministic, read-only querying over memory records: namespace/prefix scan, tier/subject filtering,
 * predicate filtering, SemVer version-range resolution, active-version selection, revocation filtering,
 * FAIL-CLOSED retention/expiry exclusion (M3), classification-projection withholding (S4/M2), and
 * trust-boundary/min-trust filtering. Introduces no core modification (additive over `MetadataPort`).
 */

import type { MemoryQuery, MemoryRecord } from "./types.ts";
import type { MemoryStore } from "./memory-store.ts";
import type { MemoryRevocation } from "./memory-revocation.ts";
import type { MemoryRetention } from "./memory-retention.ts";
import { maxSatisfying } from "../../meta-core/semver.ts";

export class MemoryQueryEngine {
  readonly #store: MemoryStore;
  readonly #revocations: MemoryRevocation;
  readonly #retention: MemoryRetention;

  constructor(store: MemoryStore, revocations: MemoryRevocation, retention: MemoryRetention) {
    this.#store = store;
    this.#revocations = revocations;
    this.#retention = retention;
  }

  /** Run a query and return matching records (deterministically ordered). */
  query(q: MemoryQuery): MemoryRecord[] {
    let records = q.namespace ? this.#store.inNamespace(q.namespace) : this.#store.all();
    records = records.filter((r) => this.#admissible(r, q));
    if (q.tier) records = records.filter((r) => r.tier === q.tier);
    if (q.subjectRef) records = records.filter((r) => r.subjectRef === q.subjectRef);
    if (q.predicate) records = records.filter((r) => this.#safePredicate(q.predicate as (r: MemoryRecord) => boolean, r));

    records.sort((a, b) =>
      a.namespace.localeCompare(b.namespace) || a.memId.localeCompare(b.memId) || a.version.localeCompare(b.version),
    );
    return records;
  }

  /** Resolve the highest record of `memId` in `namespace` satisfying `range` and admissibility. */
  resolveHighest(namespace: string, memId: string, range = "*", q: Omit<MemoryQuery, "namespace" | "versionRange"> = {}): MemoryRecord | undefined {
    const candidates = this.#store
      .versions(namespace, memId)
      .filter((r) => this.#admissible(r, { ...q, versionRange: range }));
    if (candidates.length === 0) return undefined;
    const best = maxSatisfying(candidates.map((r) => r.version), range);
    if (best === undefined) return undefined;
    return candidates.find((r) => r.version === best);
  }

  /**
   * Admissibility (all fail-closed):
   *  - active-only unless `includeNonActive`
   *  - not revoked (unit or record)
   *  - NOT expired (retention; M3) unless `includeNonActive`
   *  - meets trust floor
   *  - within recall-projection clearance (S4/M2): higher-classified records are withheld
   *  - satisfies version range
   */
  #admissible(r: MemoryRecord, q: MemoryQuery): boolean {
    const now = q.now ?? Date.now();
    if (!q.includeNonActive && r.state !== "active") return false; // fail-closed: only active by default
    if (this.#revocations.isRevoked("record", `${r.namespace}:${r.memId}@${r.version}`)) return false;
    if (this.#revocations.isRevoked("unit", r.unitHash)) return false;
    if (!q.includeNonActive && this.#retention.isExpired(r, now)) return false; // fail-closed expiry (M3)
    if (q.minTrustLevel !== undefined && r.trustLevel < q.minTrustLevel) return false;
    if (q.clearanceLevel !== undefined && r.classification.level > q.clearanceLevel) return false; // S4 projection
    if (q.versionRange && q.versionRange !== "*") {
      const best = maxSatisfying([r.version], q.versionRange);
      if (best === undefined) return false;
    }
    return true;
  }

  #safePredicate(predicate: (r: MemoryRecord) => boolean, r: MemoryRecord): boolean {
    try {
      return predicate(r) === true;
    } catch {
      return false; // fail-closed: a throwing predicate excludes the record
    }
  }
}
