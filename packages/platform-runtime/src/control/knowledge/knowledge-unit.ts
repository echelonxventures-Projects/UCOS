/**
 * UCOS Knowledge Fabric — Knowledge Unit construction & content hashing (KNOW-SEC-001).
 *
 * The `unitHash = sha256(canonicalize(unit))` is the stable identifier every downstream signature
 * (certification, ratification, bundle) binds to — tampering with the unit invalidates them all.
 */

import type { KnowledgeUnit } from "./types.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";
import { ControlValidationError } from "../errors.ts";

export function unitHash(unit: KnowledgeUnit): string {
  return sha256(canonicalize(unit));
}

export function validateUnit(unit: KnowledgeUnit): void {
  if (!unit.unitId) throw new ControlValidationError("Knowledge unit requires unitId", { unit });
  if (!unit.namespace || !unit.namespace.startsWith("knowledge:")) {
    throw new ControlValidationError("Knowledge unit namespace must start with 'knowledge:'", { unit });
  }
  if (unit.payload === undefined) throw new ControlValidationError("Knowledge unit requires a payload", { unit });
}

export function createUnit(unit: KnowledgeUnit): KnowledgeUnit {
  validateUnit(unit);
  return { ...unit };
}
