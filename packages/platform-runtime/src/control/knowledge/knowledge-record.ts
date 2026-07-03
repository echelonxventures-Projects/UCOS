/**
 * UCOS Knowledge Fabric — Knowledge Record construction (KNOW-GOV-001 / KNOW-ARCH-001).
 *
 * A versioned, provenance-bearing wrapper around a Knowledge Unit. Records are immutable snapshots;
 * change is expressed by new versions (superseding the prior active one) via the Evolution Fabric.
 */

import type { SemVer } from "../../contracts/types.ts";
import type { KnowledgeClass, KnowledgeRecord, KnowledgeSource, KnowledgeState, KnowledgeUnit } from "./types.ts";
import type { Provenance } from "../types.ts";
import { isValidVersion } from "../../meta-core/semver.ts";
import { unitHash } from "./knowledge-unit.ts";
import { ControlValidationError } from "../errors.ts";

export interface CreateRecordOptions {
  knowledgeId: string;
  version: SemVer;
  unit: KnowledgeUnit;
  source: KnowledgeSource;
  trustLevel: number;
  provenance: Provenance;
  lineage?: string[];
  state?: KnowledgeState;
  knowledgeClass?: KnowledgeClass;
}

export function createRecord(opts: CreateRecordOptions): KnowledgeRecord {
  if (!isValidVersion(opts.version)) {
    throw new ControlValidationError(`Invalid knowledge version: ${opts.version}`, { version: opts.version });
  }
  if (!Number.isFinite(opts.trustLevel) || opts.trustLevel < 0) {
    throw new ControlValidationError("Knowledge trustLevel must be a non-negative number", { trustLevel: opts.trustLevel });
  }
  return {
    knowledgeId: opts.knowledgeId,
    version: opts.version,
    namespace: opts.unit.namespace,
    unitHash: unitHash(opts.unit),
    unit: opts.unit,
    source: opts.source,
    trustLevel: opts.trustLevel,
    provenance: opts.provenance,
    lineage: opts.lineage ? [...opts.lineage] : [],
    state: opts.state ?? "draft",
    knowledgeClass: opts.knowledgeClass ?? "reference",
  };
}

/** JSON schema for KnowledgeRecord metadata validation (validateOnWrite). */
export const KNOWLEDGE_RECORD_SCHEMA = {
  type: "object",
  properties: {
    knowledgeId: { type: "string" },
    version: { type: "string" },
    namespace: { type: "string" },
    unitHash: { type: "string" },
    trustLevel: { type: "number" },
    state: { type: "string" },
  },
  required: ["knowledgeId", "version", "namespace", "unitHash", "trustLevel", "state"],
} as const;
