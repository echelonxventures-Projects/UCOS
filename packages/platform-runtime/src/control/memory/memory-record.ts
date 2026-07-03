/**
 * UCOS Memory Fabric — Memory Record construction (MEM-GOV-001 / MEM-ARCH-001).
 *
 * A versioned, classification-bound, provenance-bearing wrapper around a Memory Unit. Records are
 * immutable snapshots; change is expressed by new versions (superseding the prior active one) via the
 * Evolution Fabric — never edit-in-place (IP-14).
 */

import type { SemVer } from "../../contracts/types.ts";
import type { Classification, MemoryRecord, MemorySource, MemoryState, MemoryTier, MemoryUnit, RetentionClass } from "./types.ts";
import type { Provenance } from "../types.ts";
import { isValidVersion } from "../../meta-core/semver.ts";
import { unitHash } from "./memory-unit.ts";
import { ControlValidationError } from "../errors.ts";

export interface CreateRecordOptions {
  memId: string;
  version: SemVer;
  unit: MemoryUnit;
  source: MemorySource;
  classification: Classification;
  trustLevel: number;
  provenance: Provenance;
  retentionClass: RetentionClass;
  capturedAt?: number;
  expiresAt?: number;
  lineage?: string[];
  state?: MemoryState;
}

export function createRecord(opts: CreateRecordOptions): MemoryRecord {
  if (!isValidVersion(opts.version)) {
    throw new ControlValidationError(`Invalid memory version: ${opts.version}`, { version: opts.version });
  }
  if (!Number.isFinite(opts.trustLevel) || opts.trustLevel < 0) {
    throw new ControlValidationError("Memory trustLevel must be a non-negative number", { trustLevel: opts.trustLevel });
  }
  if (!opts.classification || !Number.isFinite(opts.classification.level) || opts.classification.level < 0) {
    throw new ControlValidationError("Memory record requires a classification with a non-negative level", { classification: opts.classification });
  }
  const capturedAt = opts.capturedAt ?? Date.now();
  const record: MemoryRecord = {
    memId: opts.memId,
    version: opts.version,
    tier: opts.unit.tier as MemoryTier,
    namespace: opts.unit.namespace,
    subjectRef: opts.unit.subjectRef,
    unitHash: unitHash(opts.unit),
    unit: opts.unit,
    source: opts.source,
    classification: { ...opts.classification },
    trustLevel: opts.trustLevel,
    provenance: opts.provenance,
    lineage: opts.lineage ? [...opts.lineage] : [],
    state: opts.state ?? "captured",
    retentionClass: opts.retentionClass,
    capturedAt,
    ...(opts.expiresAt !== undefined ? { expiresAt: opts.expiresAt } : {}),
  };
  return record;
}

/** JSON schema for MemoryRecord metadata validation. */
export const MEMORY_RECORD_SCHEMA = {
  type: "object",
  properties: {
    memId: { type: "string" },
    version: { type: "string" },
    namespace: { type: "string" },
    unitHash: { type: "string" },
    trustLevel: { type: "number" },
    state: { type: "string" },
    retentionClass: { type: "string" },
  },
  required: ["memId", "version", "namespace", "unitHash", "trustLevel", "state", "retentionClass"],
} as const;
