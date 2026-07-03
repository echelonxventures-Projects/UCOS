/**
 * UCOS Operational Proof Fabric — Query Engine (OPF-ARCH-003).
 *
 * Unified, TENANT-SCOPED read surface over durable proof + incident records. Deny-by-default:
 * every query requires a tenantId and never crosses tenant boundaries. Fail-closed: revoked records
 * are excluded from results. "Latest" resolves to the highest semantic version of an id.
 */

import type { IncidentQuery, IncidentRecord, IncidentSeverity, ProofQuery, ProofRecord } from "./types.ts";
import type { OperationsStore } from "./operations-store.ts";
import type { OperationsRevocationAuthority } from "./operations-revocation-authority.ts";
import { compareVersions } from "../../meta-core/semver.ts";

const SEVERITY_RANK: Record<IncidentSeverity, number> = { info: 0, warn: 1, critical: 2 };

function latestOf<T extends { version: string }>(records: readonly T[]): T | undefined {
  if (records.length === 0) return undefined;
  return records.reduce((best, cur) => (compareVersions(cur.version, best.version) > 0 ? cur : best));
}

export class OperationsQueryEngine {
  readonly #store: OperationsStore;
  readonly #revocations: OperationsRevocationAuthority;

  constructor(store: OperationsStore, revocations: OperationsRevocationAuthority) {
    this.#store = store;
    this.#revocations = revocations;
  }

  /** Latest non-revoked version of a proof. */
  resolveProof(tenantId: string, proofId: string): ProofRecord | undefined {
    const latest = latestOf(this.#store.proofVersions(tenantId, proofId));
    if (!latest) return undefined;
    if (this.#revocations.isRevoked("proof", proofId)) return undefined;
    return latest;
  }

  /** Latest non-revoked version of each proof in the tenant, filtered by the query. */
  queryProofs(query: ProofQuery): ProofRecord[] {
    const byId = new Map<string, ProofRecord[]>();
    for (const r of this.#store.proofsForTenant(query.tenantId)) {
      const arr = byId.get(r.proofId) ?? [];
      arr.push(r);
      byId.set(r.proofId, arr);
    }
    const out: ProofRecord[] = [];
    for (const [proofId, versions] of byId) {
      if (this.#revocations.isRevoked("proof", proofId)) continue;
      const latest = latestOf(versions);
      if (!latest) continue;
      if (query.kind && latest.kind !== query.kind) continue;
      if (query.state && latest.state !== query.state) continue;
      if (query.fromAt !== undefined && latest.unit.capturedAt < query.fromAt) continue;
      if (query.toAt !== undefined && latest.unit.capturedAt > query.toAt) continue;
      out.push(latest);
    }
    return out.sort((a, b) => a.unit.capturedAt - b.unit.capturedAt);
  }

  /** Latest non-revoked version of an incident. */
  resolveIncident(tenantId: string, incidentId: string): IncidentRecord | undefined {
    const latest = latestOf(this.#store.incidentVersions(tenantId, incidentId));
    if (!latest) return undefined;
    if (this.#revocations.isRevoked("incident", incidentId)) return undefined;
    return latest;
  }

  /** Latest non-revoked version of each incident in the tenant, filtered by the query. */
  queryIncidents(query: IncidentQuery): IncidentRecord[] {
    const byId = new Map<string, IncidentRecord[]>();
    for (const r of this.#store.incidentsForTenant(query.tenantId)) {
      const arr = byId.get(r.incidentId) ?? [];
      arr.push(r);
      byId.set(r.incidentId, arr);
    }
    const out: IncidentRecord[] = [];
    for (const [incidentId, versions] of byId) {
      if (this.#revocations.isRevoked("incident", incidentId)) continue;
      const latest = latestOf(versions);
      if (!latest) continue;
      if (query.state && latest.state !== query.state) continue;
      if (query.openOnly && latest.state === "closed") continue;
      if (query.minSeverity && SEVERITY_RANK[latest.severity] < SEVERITY_RANK[query.minSeverity]) continue;
      out.push(latest);
    }
    return out.sort((a, b) => b.openedAt - a.openedAt);
  }
}
