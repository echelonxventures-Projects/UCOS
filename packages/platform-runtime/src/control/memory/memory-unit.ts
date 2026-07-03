/**
 * UCOS Memory Fabric — Memory Unit construction & content hashing (MEM-SEC-001).
 *
 * The `unitHash = sha256(canonicalize(unit))` is the stable identifier every downstream signature
 * (memory bundle, certification) binds to — tampering with the unit invalidates them all. Reuses the
 * ratified federation cryptography (no custom crypto).
 */

import type { MemoryUnit } from "./types.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";
import { ControlValidationError } from "../errors.ts";

const TIERS = ["working", "short-term", "long-term", "semantic", "episodic", "federated"] as const;

export function unitHash(unit: MemoryUnit): string {
  return sha256(canonicalize(unit));
}

export function validateUnit(unit: MemoryUnit): void {
  if (!unit.unitId) throw new ControlValidationError("Memory unit requires unitId", { unit });
  if (!unit.namespace || !unit.namespace.startsWith("memory:")) {
    throw new ControlValidationError("Memory unit namespace must start with 'memory:'", { unit });
  }
  if (!unit.subjectRef) throw new ControlValidationError("Memory unit requires subjectRef", { unit });
  if (!TIERS.includes(unit.tier)) throw new ControlValidationError(`Memory unit has unknown tier: ${unit.tier}`, { unit });
  if (unit.value === undefined) throw new ControlValidationError("Memory unit requires a value (no-synthesis)", { unit });
}

export function createUnit(unit: MemoryUnit): MemoryUnit {
  validateUnit(unit);
  return { ...unit };
}
