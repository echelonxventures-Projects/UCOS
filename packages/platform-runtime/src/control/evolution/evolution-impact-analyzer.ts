/**
 * UCOS Evolution Fabric — Impact Analyzer (EVO-GOV-001, gate G2).
 *
 * Computes the blast radius of an evolution unit BEFORE approval: which registered capabilities
 * depend on a target being changed, and which config/metadata surfaces are touched. Read-only; wires
 * the substrate's registry dependency data. The result informs the impact-review gate.
 */

import type { MetaCoreKernel } from "../../meta-core/kernel.ts";
import type { CapabilityDescriptor } from "../../contracts/types.ts";
import type { EvolutionUnit } from "./types.ts";

export interface ImpactReport {
  changedCapabilities: string[];
  dependentCapabilities: string[];
  configTargets: string[];
  metadataTargets: string[];
  summary: string;
}

export class EvolutionImpactAnalyzer {
  readonly #kernel: MetaCoreKernel;

  constructor(kernel: MetaCoreKernel) {
    this.#kernel = kernel;
  }

  analyze(unit: EvolutionUnit): ImpactReport {
    const changed = new Set<string>();
    const configTargets = new Set<string>();
    const metadataTargets = new Set<string>();

    for (const target of unit.targets) {
      if (target.kind === "registry") changed.add(target.id);
      else if (target.kind === "config") configTargets.add(target.capabilityId);
      else metadataTargets.add(target.keyPrefix);
    }
    for (const op of unit.ops) {
      if (op.op === "load-descriptor") changed.add(op.descriptor.id);
      else if (op.op === "set-config") configTargets.add(op.capabilityId);
      else metadataTargets.add(op.key);
    }

    // Dependents: any capability whose descriptor declares a dependency on a changed id.
    const dependents = new Set<string>();
    for (const rec of this.#kernel.registry.list("capability")) {
      const descriptor = rec.descriptor as CapabilityDescriptor;
      for (const dep of descriptor.dependencies ?? []) {
        if (changed.has(dep.capabilityId)) dependents.add(rec.id);
      }
    }

    const changedCapabilities = [...changed].sort();
    const dependentCapabilities = [...dependents].sort();
    return {
      changedCapabilities,
      dependentCapabilities,
      configTargets: [...configTargets].sort(),
      metadataTargets: [...metadataTargets].sort(),
      summary:
        `${changedCapabilities.length} changed, ${dependentCapabilities.length} dependent capability(ies), ` +
        `${configTargets.size} config + ${metadataTargets.size} metadata target(s)`,
    };
  }
}
