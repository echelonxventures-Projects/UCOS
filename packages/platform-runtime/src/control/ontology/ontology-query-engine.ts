/**
 * UCOS Ontology Fabric — Query Engine (ONTO-ARCH-001 §4, gate: read-only).
 *
 * Deterministic, read-only querying over ontology records: namespace/prefix scan, kind filter,
 * predicate filtering, SemVer version-range resolution, active-version selection, revocation filtering,
 * and trust/min-trust filtering. Fail-closed: revoked or below-trust records are excluded by default;
 * unknown state is treated as non-active. Reuses the PI-7 query discipline over `MetadataPort.query`.
 */

import type { OntologyKind, OntologyQuery, OntologyRecord } from "./types.ts";
import type { OntologyStore } from "./ontology-store.ts";
import type { OntologyRevocationAuthority } from "./ontology-revocation-authority.ts";
import { maxSatisfying } from "../../meta-core/semver.ts";

export class OntologyQueryEngine {
  readonly #store: OntologyStore;
  readonly #revocations: OntologyRevocationAuthority;

  constructor(store: OntologyStore, revocations: OntologyRevocationAuthority) {
    this.#store = store;
    this.#revocations = revocations;
  }

  /** Run a query and return matching records (deterministically ordered). */
  query(q: OntologyQuery): OntologyRecord[] {
    let records = q.namespace ? this.#store.inNamespace(q.namespace) : this.#store.all();
    if (q.kind) records = records.filter((r) => r.kind === q.kind);
    records = records.filter((r) => this.#admissible(r, q));
    if (q.predicate) records = records.filter((r) => this.#safePredicate(q.predicate as (r: OntologyRecord) => boolean, r));

    records.sort((a, b) =>
      a.namespace.localeCompare(b.namespace) ||
      a.kind.localeCompare(b.kind) ||
      a.localId.localeCompare(b.localId) ||
      a.version.localeCompare(b.version),
    );
    return records;
  }

  /** Resolve the highest record of `(kind, localId)` in `namespace` satisfying `range` and admissibility. */
  resolveHighest(
    namespace: string,
    kind: OntologyKind,
    localId: string,
    range = "*",
    q: Omit<OntologyQuery, "namespace" | "versionRange" | "kind"> = {},
  ): OntologyRecord | undefined {
    const candidates = this.#store
      .versions(namespace, kind, localId)
      .filter((r) => this.#admissible(r, { ...q, versionRange: range }));
    if (candidates.length === 0) return undefined;
    const best = maxSatisfying(candidates.map((r) => r.version), range);
    if (best === undefined) return undefined;
    return candidates.find((r) => r.version === best);
  }

  /** Admissibility: active-only (unless overridden), not revoked, meets trust floor, satisfies range. */
  #admissible(r: OntologyRecord, q: OntologyQuery): boolean {
    if (!q.includeNonActive && r.state !== "active") return false; // fail-closed: only active by default
    if (this.#revocations.isRevoked("record", r.recordId)) return false;
    if (this.#revocations.isRevoked("unit", r.unitHash)) return false;
    if (q.minTrustLevel !== undefined && r.trustLevel < q.minTrustLevel) return false;
    if (q.versionRange && q.versionRange !== "*") {
      const best = maxSatisfying([r.version], q.versionRange);
      if (best === undefined) return false;
    }
    return true;
  }

  #safePredicate(predicate: (r: OntologyRecord) => boolean, r: OntologyRecord): boolean {
    try {
      return predicate(r) === true;
    } catch {
      return false; // fail-closed: a throwing predicate excludes the record
    }
  }
}
