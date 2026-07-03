/**
 * UCOS Operational Proof Fabric — Proof Unit construction & content hashing (OPF-SEC-001).
 *
 * `unitHash = sha256(canonicalize(unit))` is the stable identifier every downstream signature
 * (attestation, seal, bundle) binds to — tampering with the evidence payload invalidates them all.
 */

import type { ProofUnit } from "./types.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";
import { assertOperationsNamespace } from "./operations-namespace.ts";
import { ControlValidationError } from "../errors.ts";

export function unitHash(unit: ProofUnit): string {
  return sha256(canonicalize(unit));
}

export function validateUnit(unit: ProofUnit): void {
  if (!unit.unitId) throw new ControlValidationError("Proof unit requires unitId", { unit });
  if (!unit.tenantId) throw new ControlValidationError("Proof unit requires tenantId", { unit });
  assertOperationsNamespace(unit.namespace);
  if (unit.payload === undefined) throw new ControlValidationError("Proof unit requires a payload", { unit });
}

export function createUnit(unit: ProofUnit): ProofUnit {
  validateUnit(unit);
  return { ...unit };
}
