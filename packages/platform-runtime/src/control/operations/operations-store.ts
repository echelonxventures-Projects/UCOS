/**
 * UCOS Operational Proof Fabric — Store (OPF-ARCH-002).
 *
 * READ surface over versioned proof + incident records in the substrate Metadata runtime. There is NO
 * public governed-write here: all durable proof mutation routes through the Evolution Fabric (a
 * put-metadata op on `operations:proof:*` / `operations:incident:*`). The static `evolutionWrite`
 * helpers expose the exact key+value an evolution unit must write, keeping the sole mutation path
 * inside the evolution transaction. Multi-tenant: reads are always tenant-partitioned.
 */

import type { SemVer } from "../../contracts/types.ts";
import type { MetadataPort } from "../../meta-core/ports.ts";
import type { IncidentRecord, ProofRecord } from "./types.ts";
import {
  incidentIdPrefix,
  incidentKey,
  incidentTenantPrefix,
  proofIdPrefix,
  proofKey,
  proofTenantPrefix,
} from "./operations-namespace.ts";

export class OperationsStore {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  // ------------------------------ Proof records ------------------------------

  getProof(tenantId: string, proofId: string, version: SemVer): ProofRecord | undefined {
    return this.#metadata.get(proofKey(tenantId, proofId, version))?.value as ProofRecord | undefined;
  }

  proofVersions(tenantId: string, proofId: string): ProofRecord[] {
    return this.#metadata.query(proofIdPrefix(tenantId, proofId)).map((r) => r.value as ProofRecord);
  }

  proofsForTenant(tenantId: string): ProofRecord[] {
    return this.#metadata.query(proofTenantPrefix(tenantId)).map((r) => r.value as ProofRecord);
  }

  static proofEvolutionWrite(record: ProofRecord): { key: string; value: ProofRecord } {
    return { key: proofKey(record.tenantId, record.proofId, record.version), value: record };
  }

  // ------------------------------ Incident records ------------------------------

  getIncident(tenantId: string, incidentId: string, version: SemVer): IncidentRecord | undefined {
    return this.#metadata.get(incidentKey(tenantId, incidentId, version))?.value as IncidentRecord | undefined;
  }

  incidentVersions(tenantId: string, incidentId: string): IncidentRecord[] {
    return this.#metadata.query(incidentIdPrefix(tenantId, incidentId)).map((r) => r.value as IncidentRecord);
  }

  incidentsForTenant(tenantId: string): IncidentRecord[] {
    return this.#metadata.query(incidentTenantPrefix(tenantId)).map((r) => r.value as IncidentRecord);
  }

  static incidentEvolutionWrite(record: IncidentRecord): { key: string; value: IncidentRecord } {
    return { key: incidentKey(record.tenantId, record.incidentId, record.version), value: record };
  }
}
