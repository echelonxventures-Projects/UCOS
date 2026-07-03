/**
 * UCOS Substrate — Contract Loader (Meta-Core).
 * Validates and registers contract descriptors into the Registry + Metadata runtimes.
 */

import type { ContractDescriptor } from "../contracts/types.ts";
import type { MetadataPort, RegistryPort } from "./ports.ts";
import type { LoadedArtifact } from "./artifact-loader.ts";
import type { ValidationEngine } from "./validation-engine.ts";

export class ContractLoader {
  readonly #registry: RegistryPort;
  readonly #metadata: MetadataPort;
  readonly #validation: ValidationEngine;

  constructor(registry: RegistryPort, metadata: MetadataPort, validation: ValidationEngine) {
    this.#registry = registry;
    this.#metadata = metadata;
    this.#validation = validation;
  }

  load(artifact: LoadedArtifact): ContractDescriptor {
    const descriptor = artifact.descriptor as ContractDescriptor;
    this.#validation.validateDescriptor(descriptor);
    this.#registry.register({
      id: descriptor.id,
      version: descriptor.version,
      kind: "contract",
      descriptor,
      sourceDir: artifact.sourceDir,
    });
    this.#metadata.put(`contract:${descriptor.id}@${descriptor.version}`, descriptor);
    return descriptor;
  }
}
