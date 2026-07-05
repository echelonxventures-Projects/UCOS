/**
 * Contract Skeleton Generator — deterministic validation report (WI-07).
 *
 * A machine-readable, reproducible report: per contract and per stage, a verdict, ordered
 * failures, per-target sufficiency, and recorded notes. DETERMINISTIC — identical inputs
 * yield an identical report (fixed key order, no timestamps, stable ordering). Fail-closed —
 * any Stage-1/Stage-2 FAIL sets the top-level verdict to FAIL and blocks generation entirely.
 *
 * Traceability: CONTRACT-VALIDATION-ARCHITECTURE.md §6 · IC-2.
 */

import type { Failure, StageVerdict } from "../types.ts";
import type { Stage3Targets } from "./stage3-generator-input.ts";

export interface ContractReport {
  readonly id: string;
  readonly sourceId: string;
  readonly stage1_schema: StageVerdict;
  readonly stage2_model: StageVerdict;
  readonly stage3_targets: Stage3Targets;
  readonly failures: readonly Failure[];
  readonly notes: readonly string[];
}

export interface ValidationReport {
  readonly verdict: StageVerdict;
  readonly metaSchemaVersion: string;
  readonly contracts: readonly ContractReport[];
}

/** Fold per-contract reports into a top-level report. FAIL if any contract failed stage 1 or 2. */
export function buildReport(
  contracts: readonly ContractReport[],
  metaSchemaVersion: string,
): ValidationReport {
  const anyFail = contracts.some(
    (c) => c.stage1_schema === "FAIL" || c.stage2_model === "FAIL",
  );
  return {
    verdict: anyFail ? "FAIL" : "PASS",
    metaSchemaVersion,
    contracts,
  };
}

/** Serialize a report deterministically (stable key order via explicit reconstruction). */
export function serializeReport(report: ValidationReport): string {
  const ordered = {
    verdict: report.verdict,
    metaSchemaVersion: report.metaSchemaVersion,
    contracts: report.contracts.map((c) => ({
      id: c.id,
      sourceId: c.sourceId,
      stage1_schema: c.stage1_schema,
      stage2_model: c.stage2_model,
      stage3_targets: {
        dtos: c.stage3_targets.dtos,
        validators: c.stage3_targets.validators,
        clients: c.stage3_targets.clients,
        serverStubs: c.stage3_targets.serverStubs,
      },
      failures: c.failures.map((f) => ({ path: f.path, reason: f.reason })),
      notes: [...c.notes],
    })),
  };
  return JSON.stringify(ordered, null, 2) + "\n";
}
