/**
 * UCOS Knowledge Fabric — Authority & Boundary Registry (KNOW-GOV-002).
 *
 * Metadata-backed registry for knowledge authorities and trust boundaries under `knowledge:authority:*`
 * and `knowledge:boundary:*`. Authorities carry enumerated powers (no implicit authority — K4).
 * Boundaries are deny-by-default and clamp conferred knowledge trust (K5). Registration is an
 * Approval-Required governance-setup operation (AD-0009), not a governed knowledge mutation.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { KnowledgeAuthorityRecord, KnowledgeBoundaryRecord, KnowledgePower } from "./types.ts";
import { authorityKey, boundaryKey } from "./knowledge-namespace.ts";
import { ControlValidationError } from "../errors.ts";

export class KnowledgeRegistry {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  registerAuthority(
    record: Omit<KnowledgeAuthorityRecord, "status"> & { status?: KnowledgeAuthorityRecord["status"] },
  ): KnowledgeAuthorityRecord {
    if (!record.authorityId || !record.keyRef || !record.owner) {
      throw new ControlValidationError("Knowledge authority requires authorityId, owner, keyRef", { record });
    }
    if (!Array.isArray(record.powers) || record.powers.length === 0) {
      throw new ControlValidationError("Knowledge authority requires enumerated powers (no implicit authority)", { record });
    }
    const full: KnowledgeAuthorityRecord = { ...record, status: record.status ?? "active" };
    this.#metadata.put(authorityKey(record.authorityId), full);
    return full;
  }

  getAuthority(authorityId: string): KnowledgeAuthorityRecord | undefined {
    return this.#metadata.get(authorityKey(authorityId))?.value as KnowledgeAuthorityRecord | undefined;
  }

  /** Authority must exist, be active, and hold the requested power (fail-closed). */
  hasPower(authorityId: string, power: KnowledgePower): boolean {
    const a = this.getAuthority(authorityId);
    return !!a && a.status === "active" && a.powers.includes(power);
  }

  revokeAuthority(authorityId: string): void {
    const a = this.getAuthority(authorityId);
    if (!a) throw new ControlValidationError(`Unknown knowledge authority "${authorityId}"`, { authorityId });
    this.#metadata.put(authorityKey(authorityId), { ...a, status: "revoked" });
  }

  defineBoundary(record: Omit<KnowledgeBoundaryRecord, "defaultEffect"> & { defaultEffect?: "deny" }): KnowledgeBoundaryRecord {
    if (!record.boundaryId) throw new ControlValidationError("Knowledge boundary requires boundaryId", { record });
    if (!Number.isFinite(record.maxTrustLevel) || record.maxTrustLevel < 0) {
      throw new ControlValidationError("Knowledge boundary maxTrustLevel must be a non-negative number", { record });
    }
    const full: KnowledgeBoundaryRecord = { ...record, defaultEffect: "deny" };
    this.#metadata.put(boundaryKey(record.boundaryId), full);
    return full;
  }

  getBoundary(boundaryId: string): KnowledgeBoundaryRecord | undefined {
    return this.#metadata.get(boundaryKey(boundaryId))?.value as KnowledgeBoundaryRecord | undefined;
  }

  /** Is the authority a member of the boundary? (Out-of-boundary => deny.) */
  boundaryContains(boundaryId: string, authorityId: string): boolean {
    return this.getBoundary(boundaryId)?.members.includes(authorityId) ?? false;
  }

  boundaryMaxTrust(boundaryId: string): number {
    return this.getBoundary(boundaryId)?.maxTrustLevel ?? 0; // absent => 0 (deny-by-default)
  }
}
