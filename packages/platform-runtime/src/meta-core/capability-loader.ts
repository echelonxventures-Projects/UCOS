/**
 * UCOS Substrate — Capability Loader (Meta-Core).
 * Validates and registers capability descriptors, seeds the default configuration layer,
 * and initializes lifecycle state (registered -> validated).
 */

import type { CapabilityDescriptor } from "../contracts/types.ts";
import type { ConfigurationPort, MetadataPort, RegistryPort } from "./ports.ts";
import type { LoadedArtifact } from "./artifact-loader.ts";
import type { ValidationEngine } from "./validation-engine.ts";
import type { LifecycleEngine } from "./lifecycle-engine.ts";

export class CapabilityLoader {
  readonly #registry: RegistryPort;
  readonly #metadata: MetadataPort;
  readonly #config: ConfigurationPort;
  readonly #validation: ValidationEngine;
  readonly #lifecycle: LifecycleEngine;

  constructor(
    registry: RegistryPort,
    metadata: MetadataPort,
    config: ConfigurationPort,
    validation: ValidationEngine,
    lifecycle: LifecycleEngine,
  ) {
    this.#registry = registry;
    this.#metadata = metadata;
    this.#config = config;
    this.#validation = validation;
    this.#lifecycle = lifecycle;
  }

  load(artifact: LoadedArtifact): CapabilityDescriptor {
    const descriptor = artifact.descriptor as CapabilityDescriptor;
    this.#validation.validateDescriptor(descriptor);

    this.#registry.register({
      id: descriptor.id,
      version: descriptor.version,
      kind: "capability",
      descriptor,
      sourceDir: artifact.sourceDir,
    });

    this.#metadata.put(`capability:${descriptor.id}@${descriptor.version}`, descriptor);

    if (descriptor.defaults) {
      this.#config.setLayer("default", descriptor.id, descriptor.defaults);
    }

    this.#lifecycle.register(descriptor.id, descriptor.version);
    this.#lifecycle.transition(descriptor.id, descriptor.version, "validated");
    return descriptor;
  }
}
