/**
 * CGR-REG-PRIN — Layer-0 invariant principles (root registry).
 *
 * Closed 15-id space PCAMG-PRIN-001..015; every record carries an immutable `statement`;
 * root registry (no up-trace). Authorization: PCAMG-RUNTIME-0016; 0021 §G.
 */

import { ConstitutionalRegistry } from "./registry-base.ts";
import { CgValidationError } from "../append-only.ts";
import type { AuditSink, Clock, ProposeInput, ConstitutionalRecord } from "../types.ts";
import type { AppendOnlyLog } from "../../../persistence-runtime/append-only-log.ts";

const PRIN_ID = /^PCAMG-PRIN-(00[1-9]|01[0-5])$/; // 001..015

export interface PrincipleDeps {
  readonly log: AppendOnlyLog;
  readonly clock: Clock;
  readonly auditSink?: AuditSink;
}

export function createPrincipleRegistry(deps: PrincipleDeps): ConstitutionalRegistry {
  const validateContent = (input: ProposeInput, existing: readonly ConstitutionalRecord[]): void => {
    if (!PRIN_ID.test(input.logicalId)) {
      throw new CgValidationError(
        `REG-PRIN closed id-space violation: "${input.logicalId}" (expected PCAMG-PRIN-001..015)`,
        { logicalId: input.logicalId },
      );
    }
    const statement = input.content["statement"];
    if (typeof statement !== "string" || statement.trim().length === 0) {
      throw new CgValidationError("REG-PRIN record requires a non-empty `statement`", {
        logicalId: input.logicalId,
      });
    }
    // statement immutable across versions of the same principle
    for (const prior of existing) {
      if (prior.logicalId === input.logicalId && prior.content["statement"] !== statement) {
        throw new CgValidationError(
          `REG-PRIN statement is immutable across versions of ${input.logicalId}`,
          { logicalId: input.logicalId },
        );
      }
    }
  };

  return new ConstitutionalRegistry({
    registry: "REG-PRIN",
    log: deps.log,
    clock: deps.clock,
    requiresUpTrace: false, // root
    auditSink: deps.auditSink,
    validateContent,
  });
}
