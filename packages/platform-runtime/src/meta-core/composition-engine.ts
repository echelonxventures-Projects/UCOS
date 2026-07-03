/**
 * UCOS Substrate — Composition Engine (Meta-Core).
 *
 * Instantiates capabilities in dependency-first order. For each capability it resolves the
 * effective configuration, validates it against the declared config schema, injects the
 * already-composed dependency instances, and invokes the externally supplied provider factory.
 * The engine contains no business logic — behavior comes entirely from providers + descriptors.
 */

import type {
  CapabilityDescriptor,
  CapabilityInstance,
  CapabilityContext,
} from "../contracts/types.ts";
import type { ConfigurationPort, MetadataPort, RegistryPort, RegistryRecord } from "./ports.ts";
import type { PluginRuntime } from "./plugin-runtime.ts";
import type { ValidationEngine } from "./validation-engine.ts";
import type { LifecycleEngine } from "./lifecycle-engine.ts";
import { CompositionError } from "./errors.ts";

export interface ComposedNode {
  record: RegistryRecord;
  descriptor: CapabilityDescriptor;
  instance: CapabilityInstance;
  effectiveConfig: Record<string, unknown>;
}

export class CompositionGraph {
  readonly #nodes = new Map<string, ComposedNode>();

  set(node: ComposedNode): void {
    this.#nodes.set(node.descriptor.id, node);
  }

  get(capabilityId: string): ComposedNode | undefined {
    return this.#nodes.get(capabilityId);
  }

  has(capabilityId: string): boolean {
    return this.#nodes.has(capabilityId);
  }

  list(): ComposedNode[] {
    return [...this.#nodes.values()];
  }
}

export class CompositionEngine {
  readonly #registry: RegistryPort;
  readonly #config: ConfigurationPort;
  readonly #metadata: MetadataPort;
  readonly #plugins: PluginRuntime;
  readonly #validation: ValidationEngine;
  readonly #lifecycle: LifecycleEngine;

  constructor(
    registry: RegistryPort,
    config: ConfigurationPort,
    metadata: MetadataPort,
    plugins: PluginRuntime,
    validation: ValidationEngine,
    lifecycle: LifecycleEngine,
  ) {
    this.#registry = registry;
    this.#config = config;
    this.#metadata = metadata;
    this.#plugins = plugins;
    this.#validation = validation;
    this.#lifecycle = lifecycle;
  }

  async compose(order: readonly RegistryRecord[]): Promise<CompositionGraph> {
    const graph = new CompositionGraph();

    for (const record of order) {
      const descriptor = record.descriptor as CapabilityDescriptor;
      try {
        const effectiveConfig = this.#config.resolve(descriptor.id);
        if (descriptor.configSchema) {
          this.#validation.validateConfig(descriptor.id, effectiveConfig, descriptor.configSchema);
        }

        const dependencies: Record<string, CapabilityInstance> = {};
        for (const dependency of descriptor.dependencies ?? []) {
          const depRecord = this.#registry.resolve(dependency.capabilityId, dependency.versionRange);
          const composed = depRecord ? graph.get(depRecord.id) : undefined;
          if (!composed) {
            throw new CompositionError(
              `Dependency "${dependency.capabilityId}" for "${descriptor.id}" was not composed before its dependent`,
              { capabilityId: descriptor.id, dependency },
            );
          }
          dependencies[dependency.as ?? dependency.capabilityId] = composed.instance;
        }

        const factory = await this.#plugins.load(descriptor.provider, record.sourceDir);
        const context: CapabilityContext = {
          capabilityId: descriptor.id,
          config: effectiveConfig,
          dependencies,
          metadata: descriptor.metadata ?? {},
        };

        const instance = await factory(context);
        if (!instance || typeof instance.operations !== "object" || instance.operations === null) {
          throw new CompositionError(`Provider for "${descriptor.id}" returned no operations`, {
            capabilityId: descriptor.id,
          });
        }

        graph.set({ record, descriptor, instance, effectiveConfig });
        this.#lifecycle.transition(descriptor.id, descriptor.version, "composed");
        this.#lifecycle.transition(descriptor.id, descriptor.version, "active");
      } catch (error) {
        if (this.#lifecycle.state(descriptor.id, descriptor.version) !== "failed") {
          this.#lifecycle.transition(descriptor.id, descriptor.version, "failed");
        }
        if (error instanceof CompositionError) throw error;
        throw new CompositionError(`Failed to compose capability "${descriptor.id}"`, {
          capabilityId: descriptor.id,
          cause: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return graph;
  }
}
