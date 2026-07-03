/**
 * UCOS Federation Fabric — Policy Delegation registry (FED-GOV-C6).
 *
 * Governs whether/how a foreign node's policies affect local decisions. effectConstraint is ALWAYS
 * "deny-only": a foreign policy may only ADD denials to local capabilities, never grants (FGP-1 /
 * closes T3). Records under `federation:policy-delegation:<id>`.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { PolicyRecord } from "../types.ts";
import type { PolicyDelegationRecord } from "./types.ts";
import { ControlValidationError } from "../errors.ts";

const PREFIX = "federation:policy-delegation:";

export class PolicyDelegationRegistry {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  grant(record: Omit<PolicyDelegationRecord, "effectConstraint">): PolicyDelegationRecord {
    if (!record.delegationId || !record.fromNode) {
      throw new ControlValidationError("Policy delegation requires delegationId and fromNode", { record });
    }
    const full: PolicyDelegationRecord = { ...record, effectConstraint: "deny-only" };
    this.#metadata.put(`${PREFIX}${record.delegationId}`, full);
    return full;
  }

  get(delegationId: string): PolicyDelegationRecord | undefined {
    return this.#metadata.get(`${PREFIX}${delegationId}`)?.value as PolicyDelegationRecord | undefined;
  }

  list(): PolicyDelegationRecord[] {
    return this.#metadata.query(PREFIX).map((r) => r.value as PolicyDelegationRecord);
  }

  /**
   * Guard for ingesting a foreign policy: a foreign policy is admissible ONLY if its effect is
   * "deny". Any foreign allow policy is rejected (local sovereignty — foreign may only deny).
   */
  assertAdmissibleForeignPolicy(policy: PolicyRecord): void {
    if (policy.effect !== "deny") {
      throw new ControlValidationError(
        `Foreign policy "${policy.id}" is inadmissible: foreign policies may only DENY (effect=${policy.effect})`,
        { policyId: policy.id, effect: policy.effect },
      );
    }
  }

  isAdmissibleForeignPolicy(policy: PolicyRecord): boolean {
    return policy.effect === "deny";
  }
}
