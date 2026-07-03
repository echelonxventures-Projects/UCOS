/**
 * UCOS Substrate — Execution Engine (Meta-Core).
 *
 * Invokes a capability operation through its ratified contract: validates the input against
 * the contract's operation input schema, invokes the composed provider operation, then
 * validates the output. Enforces that the capability is in the "active" lifecycle state.
 */

import type { CapabilityDescriptor, ContractDescriptor } from "../contracts/types.ts";
import type { MetadataPort, RegistryPort } from "./ports.ts";
import type { LifecycleEngine } from "./lifecycle-engine.ts";
import type { CompositionGraph } from "./composition-engine.ts";
import { ExecutionError, LifecycleViolationError } from "./errors.ts";

export class ExecutionEngine {
  readonly #registry: RegistryPort;
  readonly #metadata: MetadataPort;
  readonly #lifecycle: LifecycleEngine;

  constructor(registry: RegistryPort, metadata: MetadataPort, lifecycle: LifecycleEngine) {
    this.#registry = registry;
    this.#metadata = metadata;
    this.#lifecycle = lifecycle;
  }

  async execute(
    graph: CompositionGraph,
    capabilityId: string,
    operationName: string,
    input: unknown,
  ): Promise<unknown> {
    const node = graph.get(capabilityId);
    if (!node) {
      throw new ExecutionError(`Capability "${capabilityId}" is not composed`, { capabilityId });
    }

    const descriptor = node.descriptor as CapabilityDescriptor;
    if (this.#lifecycle.state(descriptor.id, descriptor.version) !== "active") {
      throw new LifecycleViolationError(`Capability "${capabilityId}" is not active`, { capabilityId });
    }

    const contractRecord = this.#registry.resolve(descriptor.contract.id, descriptor.contract.versionRange);
    if (!contractRecord || contractRecord.kind !== "contract") {
      throw new ExecutionError(`Contract for "${capabilityId}" is not available`, { capabilityId });
    }
    const contract = contractRecord.descriptor as ContractDescriptor;
    const operation = contract.operations.find((op) => op.name === operationName);
    if (!operation) {
      throw new ExecutionError(
        `Operation "${operationName}" is not declared in contract "${contract.id}"`,
        { capabilityId, operationName, contract: contract.id },
      );
    }

    const inputResult = this.#metadata.validate(input, operation.input);
    if (!inputResult.valid) {
      throw new ExecutionError(`Input to "${capabilityId}.${operationName}" failed contract validation`, {
        capabilityId,
        operationName,
        issues: inputResult.issues,
      });
    }

    const fn = node.instance.operations[operationName];
    if (typeof fn !== "function") {
      throw new ExecutionError(
        `Provider for "${capabilityId}" does not implement operation "${operationName}"`,
        { capabilityId, operationName },
      );
    }

    let output: unknown;
    try {
      output = await fn(input);
    } catch (error) {
      throw new ExecutionError(`Execution of "${capabilityId}.${operationName}" threw`, {
        capabilityId,
        operationName,
        cause: error instanceof Error ? error.message : String(error),
      });
    }

    const outputResult = this.#metadata.validate(output, operation.output);
    if (!outputResult.valid) {
      throw new ExecutionError(`Output of "${capabilityId}.${operationName}" failed contract validation`, {
        capabilityId,
        operationName,
        issues: outputResult.issues,
      });
    }

    return output;
  }
}
