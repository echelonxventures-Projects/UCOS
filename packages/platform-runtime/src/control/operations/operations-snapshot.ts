/**
 * UCOS Operational Proof Fabric — Snapshot (OPF-ARCH-004).
 *
 * Captures a deterministic, tenant-scoped state hash over a tenant's durable proof + incident records.
 * The hash is embedded into an attested proof (`ProofRecord.stateHash`) to bind the evidence to the
 * observed durable state at attestation time, and to power cross-node reconciliation.
 */

import type { OperationsStore } from "./operations-store.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";

export interface OperationsSnapshotResult {
  tenantId: string;
  proofCount: number;
  incidentCount: number;
  stateHash: string;
}

export class OperationsSnapshot {
  readonly #store: OperationsStore;

  constructor(store: OperationsStore) {
    this.#store = store;
  }

  capture(tenantId: string): OperationsSnapshotResult {
    const proofs = this.#store
      .proofsForTenant(tenantId)
      .map((r) => ({ id: r.proofId, v: r.version, h: r.unitHash, s: r.state }))
      .sort((a, b) => (a.id === b.id ? a.v.localeCompare(b.v) : a.id.localeCompare(b.id)));
    const incidents = this.#store
      .incidentsForTenant(tenantId)
      .map((r) => ({ id: r.incidentId, v: r.version, s: r.state }))
      .sort((a, b) => (a.id === b.id ? a.v.localeCompare(b.v) : a.id.localeCompare(b.id)));
    const stateHash = sha256(canonicalize({ tenantId, proofs, incidents }));
    return { tenantId, proofCount: proofs.length, incidentCount: incidents.length, stateHash };
  }
}
