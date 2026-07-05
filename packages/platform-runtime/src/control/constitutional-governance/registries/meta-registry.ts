/**
 * CGR-REG-META — Layer-1 Meta-Constitution articles (M-I..M-XII).
 *
 * Every article up-traces to ≥1 principle (RG-7). When a `principleExists` resolver is wired,
 * each up-trace reference must resolve to an existing principle. Authorization: 0017; 0021 §G.
 */

import { ConstitutionalRegistry } from "./registry-base.ts";
import { CgValidationError } from "../append-only.ts";
import type { AuditSink, Clock, ProposeInput, ConstitutionalRecord } from "../types.ts";
import type { AppendOnlyLog } from "../../../persistence-runtime/append-only-log.ts";

export interface MetaDeps {
  readonly log: AppendOnlyLog;
  readonly clock: Clock;
  readonly auditSink?: AuditSink;
  /** Optional cross-registry resolver: does this principle logicalId exist and is it a head? */
  readonly principleExists?: (principleLogicalId: string) => boolean;
}

export function createMetaRegistry(deps: MetaDeps): ConstitutionalRegistry {
  const validateContent = (input: ProposeInput): void => {
    const article = input.content["article"];
    if (typeof article !== "string" || article.trim().length === 0) {
      throw new CgValidationError("REG-META record requires a non-empty `article`", {
        logicalId: input.logicalId,
      });
    }
    const upTrace = input.upTrace ?? [];
    if (deps.principleExists) {
      for (const ref of upTrace) {
        if (!deps.principleExists(ref)) {
          throw new CgValidationError(
            `REG-META up-trace does not resolve to an existing principle: ${ref}`,
            { logicalId: input.logicalId, ref },
          );
        }
      }
    }
  };

  return new ConstitutionalRegistry({
    registry: "REG-META",
    log: deps.log,
    clock: deps.clock,
    requiresUpTrace: true,
    auditSink: deps.auditSink,
    validateContent,
  });
}
