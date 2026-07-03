/**
 * UCOS Federation Fabric — Federation Membership registry (FED-GOV-C2).
 *
 * The governed relationship binding a node into this node's federation. No membership => the node
 * is treated as untrusted external (deny-by-default). Membership never auto-renews; expiry is
 * fail-closed. Records under `federation:membership:<id>`.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { MembershipRecord } from "./types.ts";
import { ControlValidationError } from "../errors.ts";

const PREFIX = "federation:membership:";

export class MembershipRegistry {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  grant(record: Omit<MembershipRecord, "status" | "grantedAt"> & { grantedAt?: number }): MembershipRecord {
    if (!record.membershipId || !record.nodeId) {
      throw new ControlValidationError("Membership requires membershipId and nodeId", { record });
    }
    const full: MembershipRecord = { ...record, grantedAt: record.grantedAt ?? Date.now(), status: "active" };
    this.#metadata.put(`${PREFIX}${record.membershipId}`, full);
    return full;
  }

  get(membershipId: string): MembershipRecord | undefined {
    return this.#metadata.get(`${PREFIX}${membershipId}`)?.value as MembershipRecord | undefined;
  }

  list(): MembershipRecord[] {
    return this.#metadata.query(PREFIX).map((r) => r.value as MembershipRecord);
  }

  #set(membershipId: string, status: MembershipRecord["status"]): void {
    const rec = this.get(membershipId);
    if (!rec) throw new ControlValidationError(`Unknown membership "${membershipId}"`, { membershipId });
    this.#metadata.put(`${PREFIX}${membershipId}`, { ...rec, status });
  }

  suspend(membershipId: string): void {
    this.#set(membershipId, "suspended");
  }

  reinstate(membershipId: string): void {
    this.#set(membershipId, "active");
  }

  revoke(membershipId: string): void {
    this.#set(membershipId, "revoked");
  }

  /** Active membership for a node (unexpired), if any. Expiry is fail-closed. */
  activeForNode(nodeId: string, now: number = Date.now()): MembershipRecord | undefined {
    return this.list().find(
      (m) => m.nodeId === nodeId && m.status === "active" && (m.expiresAt === undefined || m.expiresAt > now),
    );
  }

  isActive(nodeId: string, now: number = Date.now()): boolean {
    return this.activeForNode(nodeId, now) !== undefined;
  }
}
