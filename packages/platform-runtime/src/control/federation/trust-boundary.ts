/**
 * UCOS Federation Fabric — Trust Boundary registry (FED-GOV-C4).
 *
 * The explicit set of authorities whose assertions a node will evaluate. defaultEffect is ALWAYS
 * deny (FGP-2); maxTrustLevel caps any conferred trust (T2 ceiling). Records under
 * `federation:boundary:<id>`.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { AssertionType, TrustBoundaryRecord } from "./types.ts";
import { ControlValidationError } from "../errors.ts";

const PREFIX = "federation:boundary:";

export class TrustBoundaryRegistry {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  define(record: Omit<TrustBoundaryRecord, "defaultEffect"> & { defaultEffect?: "deny" }): TrustBoundaryRecord {
    if (!record.boundaryId) throw new ControlValidationError("Trust boundary requires boundaryId", { record });
    if (!Number.isFinite(record.maxTrustLevel) || record.maxTrustLevel < 0) {
      throw new ControlValidationError("Trust boundary maxTrustLevel must be a non-negative number", { record });
    }
    const full: TrustBoundaryRecord = { ...record, defaultEffect: "deny" };
    this.#metadata.put(`${PREFIX}${record.boundaryId}`, full);
    return full;
  }

  get(boundaryId: string): TrustBoundaryRecord | undefined {
    return this.#metadata.get(`${PREFIX}${boundaryId}`)?.value as TrustBoundaryRecord | undefined;
  }

  list(): TrustBoundaryRecord[] {
    return this.#metadata.query(PREFIX).map((r) => r.value as TrustBoundaryRecord);
  }

  /** Is the authority a member of the boundary? (Out-of-boundary => deny.) */
  contains(boundaryId: string, authorityId: string): boolean {
    return this.get(boundaryId)?.members.includes(authorityId) ?? false;
  }

  accepts(boundaryId: string, type: AssertionType): boolean {
    return this.get(boundaryId)?.acceptedAssertionTypes.includes(type) ?? false;
  }

  maxTrustLevel(boundaryId: string): number {
    return this.get(boundaryId)?.maxTrustLevel ?? 0;
  }
}
