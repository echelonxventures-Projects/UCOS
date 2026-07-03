/**
 * UCOS Federation Fabric — Trust Delegation registry (FED-GOV-C5).
 *
 * A bounded grant allowing an authority to assert trust within a scope. depth 0 => non-transitive;
 * maxLevel bounded; expiry fail-closed. Records under `federation:trust-delegation:<id>`.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { TrustDelegationRecord } from "./types.ts";
import { ControlValidationError } from "../errors.ts";

const PREFIX = "federation:trust-delegation:";

export class TrustDelegationRegistry {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  grant(record: Omit<TrustDelegationRecord, "revocable" | "depth"> & { depth?: number }): TrustDelegationRecord {
    if (!record.delegationId || !record.fromAuthority) {
      throw new ControlValidationError("Trust delegation requires delegationId and fromAuthority", { record });
    }
    const full: TrustDelegationRecord = { ...record, depth: record.depth ?? 0, revocable: true };
    this.#metadata.put(`${PREFIX}${record.delegationId}`, full);
    return full;
  }

  get(delegationId: string): TrustDelegationRecord | undefined {
    return this.#metadata.get(`${PREFIX}${delegationId}`)?.value as TrustDelegationRecord | undefined;
  }

  list(): TrustDelegationRecord[] {
    return this.#metadata.query(PREFIX).map((r) => r.value as TrustDelegationRecord);
  }

  revoke(delegationId: string): void {
    const rec = this.get(delegationId);
    if (!rec) throw new ControlValidationError(`Unknown trust delegation "${delegationId}"`, { delegationId });
    this.#metadata.put(`${PREFIX}${delegationId}`, { ...rec, expiresAt: 0 }); // expire immediately (fail-closed)
  }

  /**
   * The maximum trust level `fromAuthority` may confer in `scope` right now. Returns 0 when no
   * active (unexpired) delegation applies. Scope matches exactly or via delegation scope "*".
   */
  maxLevelFor(fromAuthority: string, scope: string, now: number = Date.now()): number {
    let max = 0;
    for (const d of this.list()) {
      if (d.fromAuthority !== fromAuthority) continue;
      if (d.expiresAt <= now) continue;
      if (d.scope !== "*" && d.scope !== scope) continue;
      if (d.maxLevel > max) max = d.maxLevel;
    }
    return max;
  }
}
