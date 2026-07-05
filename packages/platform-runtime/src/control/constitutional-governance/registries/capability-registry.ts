/**
 * CGR-REG-CAP — Layer-6 capabilities bound to a domain and a policy.
 *
 * Requires `domainRef` and `policyRef`; both resolve when resolvers are wired. Up-traces (RG-7).
 * Authorization: 0021 §G; 0015 §D.
 */

import { ConstitutionalRegistry } from "./registry-base.ts";
import { CgValidationError } from "../append-only.ts";
import type { AuditSink, Clock, ProposeInput } from "../types.ts";
import type { AppendOnlyLog } from "../../../persistence-runtime/append-only-log.ts";

export interface CapabilityDeps {
  readonly log: AppendOnlyLog;
  readonly clock: Clock;
  readonly auditSink?: AuditSink;
  readonly domainExists?: (domainLogicalId: string) => boolean;
  readonly policyExists?: (policyLogicalId: string) => boolean;
}

export function createCapabilityRegistry(deps: CapabilityDeps): ConstitutionalRegistry {
  const validateContent = (input: ProposeInput): void => {
    const domainRef = input.content["domainRef"];
    const policyRef = input.content["policyRef"];
    if (typeof domainRef !== "string" || domainRef.trim().length === 0) {
      throw new CgValidationError("REG-CAP record requires a `domainRef`", { logicalId: input.logicalId });
    }
    if (typeof policyRef !== "string" || policyRef.trim().length === 0) {
      throw new CgValidationError("REG-CAP record requires a `policyRef`", { logicalId: input.logicalId });
    }
    if (deps.domainExists && !deps.domainExists(domainRef)) {
      throw new CgValidationError(`REG-CAP domainRef does not resolve: ${domainRef}`, { logicalId: input.logicalId, domainRef });
    }
    if (deps.policyExists && !deps.policyExists(policyRef)) {
      throw new CgValidationError(`REG-CAP policyRef does not resolve: ${policyRef}`, { logicalId: input.logicalId, policyRef });
    }
  };

  return new ConstitutionalRegistry({
    registry: "REG-CAP",
    log: deps.log,
    clock: deps.clock,
    requiresUpTrace: true,
    auditSink: deps.auditSink,
    validateContent,
  });
}
