/**
 * UCOS Federation Fabric — Federation Authority registry (FED-GOV-C3).
 *
 * A named authority whose signed assertions this node may accept, with an ENUMERATED allow-list of
 * powers. No implicit powers (closes T8 authority escalation). Records under
 * `federation:authority:<id>`.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { FederationAuthorityRecord, FederationPower } from "./types.ts";
import { ControlValidationError } from "../errors.ts";

const PREFIX = "federation:authority:";

export class FederationAuthorityRegistry {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  register(record: Omit<FederationAuthorityRecord, "status"> & { status?: FederationAuthorityRecord["status"] }): FederationAuthorityRecord {
    if (!record.authorityId || !record.nodeId) {
      throw new ControlValidationError("Authority requires authorityId and nodeId", { record });
    }
    const full: FederationAuthorityRecord = { ...record, status: record.status ?? "active" };
    this.#metadata.put(`${PREFIX}${record.authorityId}`, full);
    return full;
  }

  get(authorityId: string): FederationAuthorityRecord | undefined {
    return this.#metadata.get(`${PREFIX}${authorityId}`)?.value as FederationAuthorityRecord | undefined;
  }

  list(): FederationAuthorityRecord[] {
    return this.#metadata.query(PREFIX).map((r) => r.value as FederationAuthorityRecord);
  }

  #set(authorityId: string, status: FederationAuthorityRecord["status"]): void {
    const rec = this.get(authorityId);
    if (!rec) throw new ControlValidationError(`Unknown authority "${authorityId}"`, { authorityId });
    this.#metadata.put(`${PREFIX}${authorityId}`, { ...rec, status });
  }

  suspend(authorityId: string): void {
    this.#set(authorityId, "suspended");
  }

  revoke(authorityId: string): void {
    this.#set(authorityId, "revoked");
  }

  isActive(authorityId: string): boolean {
    return this.get(authorityId)?.status === "active";
  }

  /** True iff the authority is active AND holds the enumerated power. */
  hasPower(authorityId: string, power: FederationPower): boolean {
    const rec = this.get(authorityId);
    return rec?.status === "active" && rec.powers.includes(power);
  }
}
