/**
 * UCOS Ontology Fabric — Ontology Record construction (ONTO-C2 / ONTO-GOV-001).
 *
 * A versioned, provenance-bearing wrapper around an Ontology Unit. Records are immutable snapshots;
 * change is expressed by new versions that explicitly `supersede` the prior active one (migration-only,
 * IP-14) via the Evolution Fabric.
 */

import type { SemVer } from "../../contracts/types.ts";
import type { Provenance } from "../types.ts";
import type { OntologyRecord, OntologySource, OntologyState, OntologyUnit } from "./types.ts";
import { isValidVersion } from "../../meta-core/semver.ts";
import { bodyLocalId, unitHash } from "./ontology-unit.ts";
import { ControlValidationError } from "../errors.ts";

export interface CreateRecordOptions {
  version: SemVer;
  unit: OntologyUnit;
  source: OntologySource;
  trustLevel: number;
  provenance: Provenance;
  localId?: string; // defaults to the body's logical id
  supersedes?: string;
  state?: OntologyState;
  recordId?: string;
}

export function createRecord(opts: CreateRecordOptions): OntologyRecord {
  if (!isValidVersion(opts.version)) {
    throw new ControlValidationError(`Invalid ontology version: ${opts.version}`, { version: opts.version });
  }
  if (!Number.isFinite(opts.trustLevel) || opts.trustLevel < 0) {
    throw new ControlValidationError("Ontology trustLevel must be a non-negative number", { trustLevel: opts.trustLevel });
  }
  const localId = opts.localId ?? bodyLocalId(opts.unit);
  const uh = unitHash(opts.unit);
  const record: OntologyRecord = {
    recordId: opts.recordId ?? `${opts.unit.kind}:${localId}@${opts.version}`,
    kind: opts.unit.kind,
    localId,
    namespace: opts.unit.namespace,
    version: opts.version,
    unitHash: uh,
    unit: opts.unit,
    source: opts.source,
    trustLevel: opts.trustLevel,
    provenance: opts.provenance,
    state: opts.state ?? "draft",
  };
  if (opts.supersedes !== undefined) record.supersedes = opts.supersedes;
  return record;
}

/** JSON schema for OntologyRecord metadata validation (validateOnWrite). */
export const ONTOLOGY_RECORD_SCHEMA = {
  type: "object",
  properties: {
    recordId: { type: "string" },
    kind: { type: "string" },
    localId: { type: "string" },
    namespace: { type: "string" },
    version: { type: "string" },
    unitHash: { type: "string" },
    trustLevel: { type: "number" },
    state: { type: "string" },
  },
  required: ["recordId", "kind", "localId", "namespace", "version", "unitHash", "trustLevel", "state"],
} as const;
