/**
 * UCOS Evolution Fabric — Evolution Unit construction & content hashing (EVO-ARCH-001 / EVO-SEC-001).
 *
 * An Evolution Unit is the atomic, immutable, content-hashed change set. The `unitHash` is the
 * stable identifier referenced by proposals, certifications, ratifications, and audit — so tampering
 * with the unit invalidates every downstream signature.
 */

import type { EvolutionUnit } from "./types.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";
import { ControlValidationError } from "../errors.ts";

/** Deterministic content hash over the canonical form of the unit. */
export function unitHash(unit: EvolutionUnit): string {
  return sha256(canonicalize(unit));
}

/** Validate structural well-formedness (does NOT authorize — the governor does that). */
export function validateUnit(unit: EvolutionUnit): void {
  if (!unit.unitId) throw new ControlValidationError("Evolution unit requires unitId", { unit });
  if (!Array.isArray(unit.ops) || unit.ops.length === 0) {
    throw new ControlValidationError("Evolution unit requires at least one op", { unit });
  }
  if (!Array.isArray(unit.targets) || unit.targets.length === 0) {
    throw new ControlValidationError("Evolution unit requires at least one declared target", { unit });
  }
  if (unit.depth !== undefined && unit.depth !== 0) {
    throw new ControlValidationError("Evolution unit depth must be 0 (no recursive evolution)", { unit });
  }
}

/** Build a normalized, validated unit (depth defaults to 0). */
export function createUnit(unit: EvolutionUnit): EvolutionUnit {
  const normalized: EvolutionUnit = { depth: 0, codePaths: [], ...unit };
  validateUnit(normalized);
  return normalized;
}
