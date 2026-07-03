/**
 * UCOS Operational Proof Fabric — Proof Record construction (OPF-GOV-002).
 *
 * A versioned, tenant-scoped, provenance-bearing wrapper around a Proof Unit. Records are immutable
 * snapshots of operational evidence; change is expressed by new versions (never in-place mutation).
 */

import type { SemVer } from "../../contracts/types.ts";
import type { Provenance } from "../types.ts";
import type { ProofKind, ProofRecord, ProofState, ProofUnit } from "./types.ts";
import { isValidVersion } from "../../meta-core/semver.ts";
import { unitHash } from "./proof-unit.ts";
import { ControlValidationError } from "../errors.ts";

export interface CreateProofRecordOptions {
  proofId: string;
  version: SemVer;
  unit: ProofUnit;
  trustLevel: number;
  provenance: Provenance;
  state?: ProofState;
  kind?: ProofKind;
  stateHash?: string;
  source?: ProofRecord["source"];
}

export function createProofRecord(opts: CreateProofRecordOptions): ProofRecord {
  if (!isValidVersion(opts.version)) {
    throw new ControlValidationError(`Invalid proof version: ${opts.version}`, { version: opts.version });
  }
  if (!Number.isFinite(opts.trustLevel) || opts.trustLevel < 0) {
    throw new ControlValidationError("Proof trustLevel must be a non-negative number", { trustLevel: opts.trustLevel });
  }
  return {
    proofId: opts.proofId,
    version: opts.version,
    tenantId: opts.unit.tenantId,
    namespace: opts.unit.namespace,
    unitHash: unitHash(opts.unit),
    unit: opts.unit,
    kind: opts.kind ?? opts.unit.kind,
    state: opts.state ?? "draft",
    trustLevel: opts.trustLevel,
    provenance: opts.provenance,
    ...(opts.stateHash !== undefined ? { stateHash: opts.stateHash } : {}),
    source: opts.source ?? { kind: "local" },
  };
}

/** JSON schema for ProofRecord metadata validation (validateOnWrite). */
export const PROOF_RECORD_SCHEMA = {
  type: "object",
  properties: {
    proofId: { type: "string" },
    version: { type: "string" },
    tenantId: { type: "string" },
    namespace: { type: "string" },
    unitHash: { type: "string" },
    kind: { type: "string" },
    state: { type: "string" },
    trustLevel: { type: "number" },
  },
  required: ["proofId", "version", "tenantId", "namespace", "unitHash", "kind", "state", "trustLevel"],
} as const;
