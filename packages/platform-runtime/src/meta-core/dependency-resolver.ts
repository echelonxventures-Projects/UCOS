/**
 * UCOS Substrate — Dependency Resolver (Meta-Core).
 *
 * Produces a deterministic, dependency-first composition order over the registered
 * capabilities. Resolves each declared dependency and contract to a concrete registered
 * version via the Registry, detecting missing references and dependency cycles.
 * Transitions each resolved capability validated -> resolved.
 */

import type { CapabilityDescriptor } from "../contracts/types.ts";
import type { RegistryPort, RegistryRecord } from "./ports.ts";
import type { LifecycleEngine } from "./lifecycle-engine.ts";
import { DependencyCycleError, ResolutionError } from "./errors.ts";

function nodeKey(record: RegistryRecord): string {
  return `${record.id}@${record.version}`;
}

export class DependencyResolver {
  readonly #registry: RegistryPort;
  readonly #lifecycle: LifecycleEngine;

  constructor(registry: RegistryPort, lifecycle: LifecycleEngine) {
    this.#registry = registry;
    this.#lifecycle = lifecycle;
  }

  /** Returns capability records ordered so that dependencies precede dependents. */
  resolveAll(): RegistryRecord[] {
    const capabilities = this.#registry.list("capability");
    const order: RegistryRecord[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (record: RegistryRecord, trail: string[]): void => {
      const key = nodeKey(record);
      if (visited.has(key)) return;
      if (visiting.has(key)) {
        throw new DependencyCycleError(`Dependency cycle detected: ${[...trail, key].join(" -> ")}`, {
          cycle: [...trail, key],
        });
      }
      visiting.add(key);

      const descriptor = record.descriptor as CapabilityDescriptor;

      // Contract must be resolvable.
      const contract = this.#registry.resolve(descriptor.contract.id, descriptor.contract.versionRange);
      if (!contract || contract.kind !== "contract") {
        throw new ResolutionError(
          `Capability "${descriptor.id}" references unresolved contract "${descriptor.contract.id}@${descriptor.contract.versionRange}"`,
          { capabilityId: descriptor.id, contract: descriptor.contract },
        );
      }

      for (const dependency of descriptor.dependencies ?? []) {
        const depRecord = this.#registry.resolve(dependency.capabilityId, dependency.versionRange);
        if (!depRecord) {
          throw new ResolutionError(
            `Capability "${descriptor.id}" depends on unresolved "${dependency.capabilityId}@${dependency.versionRange}"`,
            { capabilityId: descriptor.id, dependency },
          );
        }
        if (depRecord.kind !== "capability") {
          throw new ResolutionError(
            `Dependency "${dependency.capabilityId}" of "${descriptor.id}" is not a capability`,
            { capabilityId: descriptor.id, dependency },
          );
        }
        visit(depRecord, [...trail, key]);
      }

      visiting.delete(key);
      visited.add(key);
      order.push(record);
    };

    for (const record of capabilities) {
      visit(record, []);
    }

    for (const record of order) {
      if (this.#lifecycle.state(record.id, record.version) === "validated") {
        this.#lifecycle.transition(record.id, record.version, "resolved");
      }
    }

    return order;
  }
}
