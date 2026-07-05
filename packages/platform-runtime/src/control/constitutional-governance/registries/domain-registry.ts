/**
 * CGR-REG-DOMAIN — Layer-4 domain constitutions bound to a governance center.
 *
 * Each domain declares a `centerRef`; when a `centerExists` resolver is wired, it must resolve to
 * an existing center. Up-traces to a principle (RG-7). Authorization: 0020; 0021 §G.
 */

import { ConstitutionalRegistry } from "./registry-base.ts";
import { CgValidationError } from "../append-only.ts";
import type { AuditSink, Clock, ProposeInput } from "../types.ts";
import type { AppendOnlyLog } from "../../../persistence-runtime/append-only-log.ts";

export interface DomainDeps {
  readonly log: AppendOnlyLog;
  readonly clock: Clock;
  readonly auditSink?: AuditSink;
  /** Optional cross-registry resolver: does this center id exist as a head record? */
  readonly centerExists?: (centerLogicalId: string) => boolean;
}

export function createDomainRegistry(deps: DomainDeps): ConstitutionalRegistry {
  const validateContent = (input: ProposeInput): void => {
    const centerRef = input.content["centerRef"];
    if (typeof centerRef !== "string" || centerRef.trim().length === 0) {
      throw new CgValidationError("REG-DOMAIN record requires a `centerRef`", {
        logicalId: input.logicalId,
      });
    }
    if (deps.centerExists && !deps.centerExists(centerRef)) {
      throw new CgValidationError(`REG-DOMAIN centerRef does not resolve: ${centerRef}`, {
        logicalId: input.logicalId,
        centerRef,
      });
    }
  };

  return new ConstitutionalRegistry({
    registry: "REG-DOMAIN",
    log: deps.log,
    clock: deps.clock,
    requiresUpTrace: true,
    auditSink: deps.auditSink,
    validateContent,
  });
}
