/**
 * UCOS Substrate — Validation Engine (Meta-Core).
 *
 * Validates descriptors structurally (against the built-in descriptor schemas) and validates
 * resolved configuration against a capability's declared config schema. Delegates the actual
 * schema evaluation to the Metadata Runtime (MetadataPort.validate).
 */

import type {
  CapabilityDescriptor,
  ContractDescriptor,
  Descriptor,
  JsonSchema,
} from "../contracts/types.ts";
import type { MetadataPort } from "./ports.ts";
import { ValidationError } from "./errors.ts";
import { CAPABILITY_DESCRIPTOR_SCHEMA, CONTRACT_DESCRIPTOR_SCHEMA } from "./descriptor-schemas.ts";
import { isValidVersion } from "./semver.ts";

export class ValidationEngine {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  validateDescriptor(descriptor: Descriptor): void {
    if (descriptor.kind === "contract") {
      this.#validateContract(descriptor);
    } else if (descriptor.kind === "capability") {
      this.#validateCapability(descriptor);
    } else {
      throw new ValidationError(`Unknown descriptor kind: ${(descriptor as { kind?: string }).kind}`, {
        descriptor,
      });
    }
  }

  #validateContract(descriptor: ContractDescriptor): void {
    const result = this.#metadata.validate(descriptor, CONTRACT_DESCRIPTOR_SCHEMA);
    if (!result.valid) {
      throw new ValidationError(`Contract descriptor "${descriptor.id}" is invalid`, { issues: result.issues });
    }
    if (!isValidVersion(descriptor.version)) {
      throw new ValidationError(`Contract "${descriptor.id}" has invalid version "${descriptor.version}"`);
    }
    const names = new Set<string>();
    for (const operation of descriptor.operations) {
      if (names.has(operation.name)) {
        throw new ValidationError(`Contract "${descriptor.id}" has duplicate operation "${operation.name}"`);
      }
      names.add(operation.name);
    }
  }

  #validateCapability(descriptor: CapabilityDescriptor): void {
    const result = this.#metadata.validate(descriptor, CAPABILITY_DESCRIPTOR_SCHEMA);
    if (!result.valid) {
      throw new ValidationError(`Capability descriptor "${descriptor.id}" is invalid`, { issues: result.issues });
    }
    if (!isValidVersion(descriptor.version)) {
      throw new ValidationError(`Capability "${descriptor.id}" has invalid version "${descriptor.version}"`);
    }
  }

  validateConfig(capabilityId: string, config: unknown, schema: JsonSchema): void {
    const result = this.#metadata.validate(config, schema);
    if (!result.valid) {
      throw new ValidationError(`Configuration for capability "${capabilityId}" is invalid`, {
        capabilityId,
        issues: result.issues,
      });
    }
  }
}
