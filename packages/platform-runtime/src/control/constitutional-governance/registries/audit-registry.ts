/**
 * CGR-REG-AUDIT — append-only, content-hashed audit entry store.
 *
 * Terminal entries: monotonic seq (from the reused append-only log), never superseded, never
 * deleted. Each entry links a governed record via `subjectRef` and names an `actor` (A-1).
 * NOTE: the hash-CHAIN linkage (prev-hash/genesis) and offline verifier are CGR-AU-CHAIN /
 * CGR-AU-VERIFY — Wave-1 finalization scope, EXPLICITLY EXCLUDED from this execution (0029).
 * This registry provides only the append-only, content-hashed entry store. Authorization: 0021 §G; 0015 §D.
 */

import { ConstitutionalRegistry } from "./registry-base.ts";
import { CgValidationError } from "../append-only.ts";
import type { AuditSink, Clock, ProposeInput } from "../types.ts";
import type { AppendOnlyLog } from "../../../persistence-runtime/append-only-log.ts";

export interface AuditDeps {
  readonly log: AppendOnlyLog;
  readonly clock: Clock;
  readonly auditSink?: AuditSink;
}

export function createAuditRegistry(deps: AuditDeps): ConstitutionalRegistry {
  const validateContent = (input: ProposeInput): void => {
    const actor = input.content["actor"];
    const action = input.content["action"];
    const subjectRef = input.content["subjectRef"];
    if (typeof actor !== "string" || actor.trim().length === 0) {
      throw new CgValidationError("REG-AUDIT entry requires an `actor` (A-1 attributable)", { logicalId: input.logicalId });
    }
    if (typeof action !== "string" || action.trim().length === 0) {
      throw new CgValidationError("REG-AUDIT entry requires an `action`", { logicalId: input.logicalId });
    }
    if (typeof subjectRef !== "string" || subjectRef.trim().length === 0) {
      throw new CgValidationError("REG-AUDIT entry requires a `subjectRef` (links a governed record)", { logicalId: input.logicalId });
    }
  };

  return new ConstitutionalRegistry({
    registry: "REG-AUDIT",
    log: deps.log,
    clock: deps.clock,
    requiresUpTrace: false,
    auditSink: deps.auditSink,
    validateContent,
    allowSupersede: false, // audit entries are terminal (append-only, never superseded)
  });
}
