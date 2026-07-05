/**
 * CGR-REG-GOV — Layer-2 governance candidates + generation records (candidate-only).
 *
 * Wave-1 STORES candidates only; the Wave-2 compiler proposes them. Records are candidate-only and
 * can NEVER be ACTIVE. Keyspace tag `cg:governance:*` guarantees collision-freedom with the
 * PROHIBITED `control/governance/*` fabric. Authorization: 0018; 0021 §G.
 */

import { ConstitutionalRegistry } from "./registry-base.ts";
import { CgValidationError } from "../append-only.ts";
import type { AuditSink, Clock, ProposeInput } from "../types.ts";
import type { AppendOnlyLog } from "../../../persistence-runtime/append-only-log.ts";

/** Namespace tag applied to every governance-candidate subject (collision-free with control/governance/*). */
export const GOV_KEYSPACE = "cg:governance:" as const;

export interface GovernanceDeps {
  readonly log: AppendOnlyLog;
  readonly clock: Clock;
  readonly auditSink?: AuditSink;
}

export function createGovernanceCandidateRegistry(deps: GovernanceDeps): ConstitutionalRegistry {
  const validateContent = (input: ProposeInput): void => {
    // Every candidate must reference a generation record.
    const generationRef = input.content["generationRef"];
    if (typeof generationRef !== "string" || generationRef.trim().length === 0) {
      throw new CgValidationError("REG-GOV candidate requires a `generationRef`", {
        logicalId: input.logicalId,
      });
    }
    // Candidate-only: reject any content that attempts to assert ACTIVE.
    const status = input.content["status"];
    if (status === "active" || input.content["active"] === true) {
      throw new CgValidationError("REG-GOV is candidate-only: ACTIVE is not representable", {
        logicalId: input.logicalId,
      });
    }
    const candidate = input.content["candidate"];
    if (candidate !== undefined && candidate !== true) {
      throw new CgValidationError("REG-GOV records must be candidate:true (or omit the flag)", {
        logicalId: input.logicalId,
      });
    }
  };

  return new ConstitutionalRegistry({
    registry: "REG-GOV",
    log: deps.log,
    clock: deps.clock,
    requiresUpTrace: true, // up-trace to PRIN/META
    auditSink: deps.auditSink,
    validateContent,
  });
}
