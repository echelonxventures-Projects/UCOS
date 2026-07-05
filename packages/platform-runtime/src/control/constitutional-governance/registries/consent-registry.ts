/**
 * CGR-REG-CONSENT — revocable consent (PRIN-003).
 *
 * A consent record carries `subject`, `grantee`, `scope`, `granted`. Revocation is a NEW appended
 * record (supersession with `granted:false`) — never a physical delete. Authorization: 0021 §G; 0015 §D.
 */

import { ConstitutionalRegistry } from "./registry-base.ts";
import { CgValidationError } from "../append-only.ts";
import type { AuditSink, Clock, ProposeInput } from "../types.ts";
import type { AppendOnlyLog } from "../../../persistence-runtime/append-only-log.ts";

export interface ConsentDeps {
  readonly log: AppendOnlyLog;
  readonly clock: Clock;
  readonly auditSink?: AuditSink;
}

export function createConsentRegistry(deps: ConsentDeps): ConstitutionalRegistry {
  const validateContent = (input: ProposeInput): void => {
    const subject = input.content["subject"];
    const grantee = input.content["grantee"];
    const granted = input.content["granted"];
    if (typeof subject !== "string" || subject.trim().length === 0) {
      throw new CgValidationError("REG-CONSENT requires a `subject`", { logicalId: input.logicalId });
    }
    if (typeof grantee !== "string" || grantee.trim().length === 0) {
      throw new CgValidationError("REG-CONSENT requires a `grantee`", { logicalId: input.logicalId });
    }
    if (typeof granted !== "boolean") {
      throw new CgValidationError("REG-CONSENT requires a boolean `granted`", { logicalId: input.logicalId });
    }
  };

  return new ConstitutionalRegistry({
    registry: "REG-CONSENT",
    log: deps.log,
    clock: deps.clock,
    requiresUpTrace: true, // up-trace to the CAP/POLICY the consent concerns
    auditSink: deps.auditSink,
    validateContent,
  });
}
