/**
 * CGR-REG-POLICY — Layer-5 policies with DENY-BY-DEFAULT semantics (S1).
 *
 * `effect` is `permit` | `deny`; when absent it is interpreted as `deny`. Up-traces to a domain.
 * Authorization: 0021 §G; 0015 §D.
 */

import { ConstitutionalRegistry } from "./registry-base.ts";
import { CgValidationError } from "../append-only.ts";
import type { AuditSink, Clock, ProposeInput, ConstitutionalRecord } from "../types.ts";
import type { AppendOnlyLog } from "../../../persistence-runtime/append-only-log.ts";

export interface PolicyDeps {
  readonly log: AppendOnlyLog;
  readonly clock: Clock;
  readonly auditSink?: AuditSink;
  readonly domainExists?: (domainLogicalId: string) => boolean;
}

/** Deny-by-default effect resolution: absence/ambiguity ⇒ "deny". */
export function policyEffect(record: ConstitutionalRecord): "permit" | "deny" {
  return record.content["effect"] === "permit" ? "permit" : "deny";
}

export function createPolicyRegistry(deps: PolicyDeps): ConstitutionalRegistry {
  const validateContent = (input: ProposeInput): void => {
    const effect = input.content["effect"];
    if (effect !== undefined && effect !== "permit" && effect !== "deny") {
      throw new CgValidationError("REG-POLICY `effect` must be 'permit' | 'deny' (or omitted ⇒ deny)", {
        logicalId: input.logicalId,
        effect,
      });
    }
    const domainRef = input.content["domainRef"];
    if (typeof domainRef !== "string" || domainRef.trim().length === 0) {
      throw new CgValidationError("REG-POLICY record requires a `domainRef`", { logicalId: input.logicalId });
    }
    if (deps.domainExists && !deps.domainExists(domainRef)) {
      throw new CgValidationError(`REG-POLICY domainRef does not resolve: ${domainRef}`, { logicalId: input.logicalId, domainRef });
    }
  };

  return new ConstitutionalRegistry({
    registry: "REG-POLICY",
    log: deps.log,
    clock: deps.clock,
    requiresUpTrace: true,
    auditSink: deps.auditSink,
    validateContent,
  });
}
