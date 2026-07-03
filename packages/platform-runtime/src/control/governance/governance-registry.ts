/**
 * UCOS Governance Fabric — Registry, Decision/Approval/Certification models, Validation
 * (GOV-001/GOV-002/GOV-003).
 *
 * Governance processes, approvals, and certifications are runtime records stored in the substrate
 * Metadata Runtime. Approvals/certifications are granted at runtime; nothing is pre-approved in code.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { ApprovalRecord, CertificationRecord, GovernanceProcess } from "../types.ts";
import { ControlValidationError } from "../errors.ts";

const PROCESS_PREFIX = "governance:process:";
const APPROVAL_PREFIX = "governance:approval:";
const CERT_PREFIX = "governance:certification:";

export class GovernanceRegistry {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  registerProcess(process: GovernanceProcess): void {
    if (!process.id) throw new ControlValidationError("Governance process requires an id", { process });
    this.#metadata.put(`${PROCESS_PREFIX}${process.id}`, process);
  }

  getProcess(id: string): GovernanceProcess | undefined {
    return this.#metadata.get(`${PROCESS_PREFIX}${id}`)?.value as GovernanceProcess | undefined;
  }

  listProcesses(): GovernanceProcess[] {
    return this.#metadata.query(PROCESS_PREFIX).map((record) => record.value as GovernanceProcess);
  }

  // ---- Approvals (decision model) ----

  grantApproval(record: Omit<ApprovalRecord, "at"> & { at?: number }): ApprovalRecord {
    if (!this.getProcess(record.process)) {
      throw new ControlValidationError(`Unknown governance process "${record.process}"`, { process: record.process });
    }
    const full: ApprovalRecord = { ...record, at: record.at ?? Date.now() };
    this.#metadata.put(`${APPROVAL_PREFIX}${record.process}:${record.subject}`, full);
    return full;
  }

  getApproval(process: string, subject: string): ApprovalRecord | undefined {
    return this.#metadata.get(`${APPROVAL_PREFIX}${process}:${subject}`)?.value as ApprovalRecord | undefined;
  }

  isApproved(process: string, subject: string): boolean {
    return this.getApproval(process, subject)?.decision === "approved";
  }

  // ---- Certifications ----

  certify(record: Omit<CertificationRecord, "at" | "status"> & { at?: number }): CertificationRecord {
    const full: CertificationRecord = { ...record, status: "certified", at: record.at ?? Date.now() };
    this.#metadata.put(`${CERT_PREFIX}${record.id}`, full);
    return full;
  }

  revokeCertification(id: string, authority: string): void {
    const existing = this.getCertification(id);
    if (!existing) throw new ControlValidationError(`Unknown certification "${id}"`, { id });
    this.#metadata.put(`${CERT_PREFIX}${id}`, { ...existing, status: "revoked", authority, at: Date.now() });
  }

  getCertification(id: string): CertificationRecord | undefined {
    return this.#metadata.get(`${CERT_PREFIX}${id}`)?.value as CertificationRecord | undefined;
  }

  isCertified(id: string): boolean {
    return this.getCertification(id)?.status === "certified";
  }

  // ---- Validation ----

  validateApproval(process: string, subject: string): void {
    if (!this.isApproved(process, subject)) {
      throw new ControlValidationError(`No active approval for "${subject}" under process "${process}"`, {
        process,
        subject,
      });
    }
  }
}
