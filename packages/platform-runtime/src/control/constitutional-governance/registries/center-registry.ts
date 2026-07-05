/**
 * CGR-REG-CENTER — Layer-3 governance centers with an ACYCLIC delegation graph.
 *
 * A center may declare `parentCenter` (a center logicalId). The delegation graph must remain
 * acyclic (VR-G3). Up-traces to a principle (RG-7). Authorization: 0019; 0021 §G.
 */

import { ConstitutionalRegistry } from "./registry-base.ts";
import { CgValidationError } from "../append-only.ts";
import type { AuditSink, Clock, ProposeInput, ConstitutionalRecord } from "../types.ts";
import type { AppendOnlyLog } from "../../../persistence-runtime/append-only-log.ts";

export interface CenterDeps {
  readonly log: AppendOnlyLog;
  readonly clock: Clock;
  readonly auditSink?: AuditSink;
}

export function createCenterRegistry(deps: CenterDeps): ConstitutionalRegistry {
  const validateContent = (input: ProposeInput, existing: readonly ConstitutionalRecord[]): void => {
    const parent = input.content["parentCenter"];
    if (parent === undefined || parent === null) return; // root center is allowed

    if (typeof parent !== "string" || parent.trim().length === 0) {
      throw new CgValidationError("REG-CENTER `parentCenter` must be a non-empty center id", {
        logicalId: input.logicalId,
      });
    }
    if (parent === input.logicalId) {
      throw new CgValidationError("REG-CENTER self-delegation is a cycle", { logicalId: input.logicalId });
    }

    // Build parent map from existing head records + the proposed edge, then detect a cycle.
    const parentOf = new Map<string, string | null>();
    for (const r of existing) {
      const p = r.content["parentCenter"];
      parentOf.set(r.logicalId, typeof p === "string" ? p : null);
    }
    parentOf.set(input.logicalId, parent);

    // Parent must exist (either already registered or being registered now).
    if (!parentOf.has(parent) && !existing.some((r) => r.logicalId === parent)) {
      throw new CgValidationError(`REG-CENTER parent center does not exist: ${parent}`, {
        logicalId: input.logicalId,
        parent,
      });
    }

    // Walk the parent chain; a revisit ⇒ cycle.
    const seen = new Set<string>();
    let cursor: string | null | undefined = input.logicalId;
    while (cursor) {
      if (seen.has(cursor)) {
        throw new CgValidationError(`REG-CENTER delegation cycle detected at ${cursor}`, {
          logicalId: input.logicalId,
        });
      }
      seen.add(cursor);
      cursor = parentOf.get(cursor) ?? null;
    }
  };

  return new ConstitutionalRegistry({
    registry: "REG-CENTER",
    log: deps.log,
    clock: deps.clock,
    requiresUpTrace: true,
    auditSink: deps.auditSink,
    validateContent,
  });
}
