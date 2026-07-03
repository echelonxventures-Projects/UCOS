/**
 * UCOS Evolution Fabric — Evolution Registry (EVO-GOV-001 / EVO-ARCH-001).
 *
 * Metadata-backed store for evolution proposals, approvals, certifications, ratifications, snapshots,
 * and per-unit state, under the reserved `evolution:` namespace (mirroring the federation `federation:`
 * convention). This namespace is itself a reserved/prohibited evolution target (E10 self-target).
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type {
  ApprovalRecord,
  EvolutionCertification,
  EvolutionProposal,
  EvolutionRatification,
  EvolutionSnapshot,
} from "./types.ts";

const P_PROPOSAL = "evolution:proposal:";
const P_APPROVAL = "evolution:approval:";
const P_CERT = "evolution:certification:";
const P_RAT = "evolution:ratification:";
const P_SNAPSHOT = "evolution:snapshot:";

export class EvolutionRegistry {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  putProposal(p: EvolutionProposal): void {
    this.#metadata.put(`${P_PROPOSAL}${p.unitHash}`, p);
  }

  getProposal(unitHash: string): EvolutionProposal | undefined {
    return this.#metadata.get(`${P_PROPOSAL}${unitHash}`)?.value as EvolutionProposal | undefined;
  }

  addApproval(a: ApprovalRecord): void {
    this.#metadata.put(`${P_APPROVAL}${a.unitHash}:${a.approver}`, a);
  }

  approvals(unitHash: string): ApprovalRecord[] {
    return this.#metadata.query(`${P_APPROVAL}${unitHash}:`).map((r) => r.value as ApprovalRecord);
  }

  putCertification(c: EvolutionCertification): void {
    this.#metadata.put(`${P_CERT}${c.unitHash}`, c);
  }

  getCertification(unitHash: string): EvolutionCertification | undefined {
    return this.#metadata.get(`${P_CERT}${unitHash}`)?.value as EvolutionCertification | undefined;
  }

  putRatification(r: EvolutionRatification): void {
    this.#metadata.put(`${P_RAT}${r.unitHash}`, r);
  }

  getRatification(unitHash: string): EvolutionRatification | undefined {
    return this.#metadata.get(`${P_RAT}${unitHash}`)?.value as EvolutionRatification | undefined;
  }

  putSnapshot(s: EvolutionSnapshot): void {
    this.#metadata.put(`${P_SNAPSHOT}${s.unitHash}`, s);
  }

  getSnapshot(unitHash: string): EvolutionSnapshot | undefined {
    return this.#metadata.get(`${P_SNAPSHOT}${unitHash}`)?.value as EvolutionSnapshot | undefined;
  }
}
