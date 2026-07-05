/**
 * CGR-REG-DECISION — decision records with SEPARATION-OF-DUTIES (PRIN-009).
 *
 * Each decision names `proposer`, `certifier`, `ratifier` — all present and pairwise distinct.
 * Up-traces to the decision `subject`. Authorization: 0021 §G; 0015 §D.
 */

import { ConstitutionalRegistry } from "./registry-base.ts";
import { CgValidationError } from "../append-only.ts";
import type { AuditSink, Clock, ProposeInput } from "../types.ts";
import type { AppendOnlyLog } from "../../../persistence-runtime/append-only-log.ts";

export interface DecisionDeps {
  readonly log: AppendOnlyLog;
  readonly clock: Clock;
  readonly auditSink?: AuditSink;
}

export function createDecisionRegistry(deps: DecisionDeps): ConstitutionalRegistry {
  const validateContent = (input: ProposeInput): void => {
    const proposer = input.content["proposer"];
    const certifier = input.content["certifier"];
    const ratifier = input.content["ratifier"];
    for (const [role, value] of [["proposer", proposer], ["certifier", certifier], ["ratifier", ratifier]] as const) {
      if (typeof value !== "string" || value.trim().length === 0) {
        throw new CgValidationError(`REG-DECISION requires a non-empty \`${role}\``, { logicalId: input.logicalId });
      }
    }
    if (proposer === certifier || certifier === ratifier || proposer === ratifier) {
      throw new CgValidationError("REG-DECISION SoD violation: proposer, certifier, ratifier must be distinct", {
        logicalId: input.logicalId,
        proposer,
        certifier,
        ratifier,
      });
    }
  };

  return new ConstitutionalRegistry({
    registry: "REG-DECISION",
    log: deps.log,
    clock: deps.clock,
    requiresUpTrace: true, // up-trace to the decision subject
    auditSink: deps.auditSink,
    validateContent,
  });
}
