/**
 * Contract Skeleton Generator — Stage 1: Schema Validation (WI-07).
 *
 * Structural conformance of a contract inventory to the meta-schema
 * (contracts/schema/contract.schema.json, draft 2020-12 subset). Fail-closed:
 * unknown fields, missing required fields, enum/pattern violations, or an unresolvable
 * reference all yield FAIL. No output is permitted downstream on FAIL.
 *
 * Traceability: CONTRACT-VALIDATION-ARCHITECTURE.md §3 · UCOS-CONTRACT-CAT-001 · IC-2.
 */

import { rootSchemaFile } from "../paths.ts";
import { validateValue } from "./jsonSchema.ts";
import type { SchemaRegistry } from "./jsonSchema.ts";
import type { Failure, JsonValue, StageVerdict } from "../types.ts";

export interface Stage1Result {
  readonly verdict: StageVerdict;
  readonly failures: readonly Failure[];
}

/** Validate one inventory document against the root meta-schema. */
export function stage1Schema(raw: JsonValue, registry: SchemaRegistry): Stage1Result {
  let failures: readonly Failure[];
  try {
    failures = validateValue(raw, rootSchemaFile, registry);
  } catch (err) {
    // Unresolvable $ref / registry defect — fail-closed with a single structural failure.
    const reason = err instanceof Error ? err.message : String(err);
    failures = [{ path: "", reason: `schema validation aborted: ${reason}` }];
  }
  return { verdict: failures.length === 0 ? "PASS" : "FAIL", failures };
}
