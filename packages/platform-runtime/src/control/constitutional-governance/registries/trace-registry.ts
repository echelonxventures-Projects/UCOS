/**
 * CGR-REG-TRACE — derivation edges (the traceability substrate).
 *
 * Each edge: `from`, `to`, `relation` ∈ the eight, `layerFrom`, `layerTo`. Downward-only authority
 * (T-2: layerTo ≤ layerFrom); no self-edge; valid relation; append-only. The edges ARE the trace
 * substrate, so edge records themselves carry no up-trace. Authorization: 0021 §G; 0015 §D.
 */

import { ConstitutionalRegistry } from "./registry-base.ts";
import { CgValidationError } from "../append-only.ts";
import { EDGE_RELATIONS } from "../types.ts";
import type { AuditSink, Clock, EdgeRelation, ProposeInput } from "../types.ts";
import type { AppendOnlyLog } from "../../../persistence-runtime/append-only-log.ts";

const MIN_LAYER = 0;
const MAX_LAYER = 8;

function isLayer(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= MIN_LAYER && value <= MAX_LAYER;
}

export interface TraceDeps {
  readonly log: AppendOnlyLog;
  readonly clock: Clock;
  readonly auditSink?: AuditSink;
}

export function createTraceRegistry(deps: TraceDeps): ConstitutionalRegistry {
  const validateContent = (input: ProposeInput): void => {
    const from = input.content["from"];
    const to = input.content["to"];
    const relation = input.content["relation"];
    const layerFrom = input.content["layerFrom"];
    const layerTo = input.content["layerTo"];

    if (typeof from !== "string" || from.trim().length === 0) {
      throw new CgValidationError("REG-TRACE edge requires `from`", { logicalId: input.logicalId });
    }
    if (typeof to !== "string" || to.trim().length === 0) {
      throw new CgValidationError("REG-TRACE edge requires `to`", { logicalId: input.logicalId });
    }
    if (from === to) {
      throw new CgValidationError("REG-TRACE self-edge is not permitted", { logicalId: input.logicalId, from });
    }
    if (!(EDGE_RELATIONS as readonly string[]).includes(relation as EdgeRelation)) {
      throw new CgValidationError(`REG-TRACE invalid relation: ${String(relation)}`, { logicalId: input.logicalId });
    }
    if (!isLayer(layerFrom) || !isLayer(layerTo)) {
      throw new CgValidationError("REG-TRACE layerFrom/layerTo must be integers in 0..8", { logicalId: input.logicalId });
    }
    if ((layerTo as number) > (layerFrom as number)) {
      throw new CgValidationError("REG-TRACE downward-only violation: layerTo > layerFrom (T-2)", {
        logicalId: input.logicalId,
        layerFrom,
        layerTo,
      });
    }
  };

  return new ConstitutionalRegistry({
    registry: "REG-TRACE",
    log: deps.log,
    clock: deps.clock,
    requiresUpTrace: false, // edges are the trace substrate
    auditSink: deps.auditSink,
    validateContent,
  });
}
