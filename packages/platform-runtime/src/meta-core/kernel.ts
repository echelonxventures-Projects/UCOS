/**
 * UCOS Substrate — Meta-Core Kernel.
 *
 * The composition root of the substrate. It wires the loaders and engines over the Registry,
 * Metadata, and Configuration ports and exposes the end-to-end flow:
 *   load -> validate -> resolve -> compose -> execute
 * The kernel holds no business logic; every behavior is contributed by descriptors + providers.
 */

import type { CapabilityFactory, Descriptor, LifecycleState, SemVer } from "../contracts/types.ts";
import type { ConfigurationPort, MetadataPort, RegistryPort, RegistryRecord } from "./ports.ts";
import { PluginRuntime } from "./plugin-runtime.ts";
import { ValidationEngine } from "./validation-engine.ts";
import { LifecycleEngine } from "./lifecycle-engine.ts";
import { DependencyResolver } from "./dependency-resolver.ts";
import { CompositionEngine, type CompositionGraph } from "./composition-engine.ts";
import { ExecutionEngine } from "./execution-engine.ts";
import { ArtifactLoader, type LoadedArtifact } from "./artifact-loader.ts";
import { ContractLoader } from "./contract-loader.ts";
import { CapabilityLoader } from "./capability-loader.ts";
import { SubstrateError } from "./errors.ts";

export interface KernelPorts {
  registry: RegistryPort;
  metadata: MetadataPort;
  configuration: ConfigurationPort;
  plugins?: PluginRuntime;
}

export interface CapabilityReport {
  id: string;
  version: SemVer;
  name: string;
  state: LifecycleState | undefined;
  contract: string;
  dependencies: string[];
  operations: string[];
}

export interface CompositionReport {
  contracts: { id: string; version: SemVer; operations: string[] }[];
  capabilities: CapabilityReport[];
  order: string[];
}

export class MetaCoreKernel {
  readonly #registry: RegistryPort;
  readonly #metadata: MetadataPort;
  readonly #configuration: ConfigurationPort;
  readonly #plugins: PluginRuntime;

  readonly #validation: ValidationEngine;
  readonly #lifecycle: LifecycleEngine;
  readonly #resolver: DependencyResolver;
  readonly #composition: CompositionEngine;
  readonly #execution: ExecutionEngine;

  readonly #artifactLoader: ArtifactLoader;
  readonly #contractLoader: ContractLoader;
  readonly #capabilityLoader: CapabilityLoader;

  #order: RegistryRecord[] | undefined;
  #graph: CompositionGraph | undefined;

  constructor(ports: KernelPorts) {
    this.#registry = ports.registry;
    this.#metadata = ports.metadata;
    this.#configuration = ports.configuration;
    this.#plugins = ports.plugins ?? new PluginRuntime();

    this.#validation = new ValidationEngine(this.#metadata);
    this.#lifecycle = new LifecycleEngine();
    this.#resolver = new DependencyResolver(this.#registry, this.#lifecycle);
    this.#composition = new CompositionEngine(
      this.#registry,
      this.#configuration,
      this.#metadata,
      this.#plugins,
      this.#validation,
      this.#lifecycle,
    );
    this.#execution = new ExecutionEngine(this.#registry, this.#metadata, this.#lifecycle);

    this.#artifactLoader = new ArtifactLoader();
    this.#contractLoader = new ContractLoader(this.#registry, this.#metadata, this.#validation);
    this.#capabilityLoader = new CapabilityLoader(
      this.#registry,
      this.#metadata,
      this.#configuration,
      this.#validation,
      this.#lifecycle,
    );
  }

  /** Register a provider factory programmatically (referenced by module "plugin:<name>"). */
  registerProvider(name: string, factory: CapabilityFactory): void {
    this.#plugins.registerInline(name, factory);
  }

  /** Contribute configuration values into a named layer for a capability. */
  setConfig(layer: string, capabilityId: string, values: Record<string, unknown>): void {
    this.#configuration.setLayer(layer, capabilityId, values);
    this.#invalidateComposition();
  }

  async loadDirectory(dir: string): Promise<void> {
    this.#loadArtifacts(await this.#artifactLoader.loadFromDirectory(dir));
  }

  loadDescriptors(descriptors: readonly Descriptor[], sourceDir?: string): void {
    this.#loadArtifacts(this.#artifactLoader.loadFromObjects(descriptors, sourceDir));
  }

  #loadArtifacts(artifacts: readonly LoadedArtifact[]): void {
    // Contracts first so capability resolution has them available.
    for (const artifact of artifacts) {
      if (artifact.descriptor.kind === "contract") this.#contractLoader.load(artifact);
    }
    for (const artifact of artifacts) {
      if (artifact.descriptor.kind === "capability") this.#capabilityLoader.load(artifact);
    }
    this.#invalidateComposition();
  }

  /** Compute the dependency-first composition order. */
  resolve(): RegistryRecord[] {
    this.#order = this.#resolver.resolveAll();
    return this.#order;
  }

  /** Instantiate all capabilities in dependency order. */
  async compose(): Promise<CompositionGraph> {
    if (!this.#order) this.resolve();
    this.#graph = await this.#composition.compose(this.#order as RegistryRecord[]);
    return this.#graph;
  }

  /** Convenience: load a descriptor directory (or descriptors) then resolve + compose. */
  async bootstrap(source: { directory?: string; descriptors?: readonly Descriptor[]; sourceDir?: string }): Promise<CompositionGraph> {
    if (source.directory) await this.loadDirectory(source.directory);
    if (source.descriptors) this.loadDescriptors(source.descriptors, source.sourceDir);
    return this.compose();
  }

  async execute(capabilityId: string, operation: string, input: unknown): Promise<unknown> {
    if (!this.#graph) {
      throw new SubstrateError("EXECUTION_FAILED", "Substrate not composed; call compose() first", { capabilityId });
    }
    return this.#execution.execute(this.#graph, capabilityId, operation, input);
  }

  state(capabilityId: string): LifecycleState | undefined {
    const node = this.#graph?.get(capabilityId);
    if (node) return this.#lifecycle.state(node.record.id, node.record.version);
    const record = this.#registry.list("capability").find((r) => r.id === capabilityId);
    return record ? this.#lifecycle.state(record.id, record.version) : undefined;
  }

  report(): CompositionReport {
    const contracts = this.#registry.list("contract").map((record) => {
      const descriptor = record.descriptor as Extract<Descriptor, { kind: "contract" }>;
      return { id: record.id, version: record.version, operations: descriptor.operations.map((op) => op.name) };
    });

    const capabilities: CapabilityReport[] = (this.#order ?? this.#registry.list("capability")).map((record) => {
      const descriptor = record.descriptor as Extract<Descriptor, { kind: "capability" }>;
      const node = this.#graph?.get(record.id);
      return {
        id: record.id,
        version: record.version,
        name: descriptor.name,
        state: this.#lifecycle.state(record.id, record.version),
        contract: `${descriptor.contract.id}@${descriptor.contract.versionRange}`,
        dependencies: (descriptor.dependencies ?? []).map((d) => `${d.capabilityId}@${d.versionRange}`),
        operations: node ? Object.keys(node.instance.operations) : [],
      };
    });

    return {
      contracts,
      capabilities,
      order: (this.#order ?? []).map((record) => `${record.id}@${record.version}`),
    };
  }

  get registry(): RegistryPort {
    return this.#registry;
  }

  get metadata(): MetadataPort {
    return this.#metadata;
  }

  get configuration(): ConfigurationPort {
    return this.#configuration;
  }

  #invalidateComposition(): void {
    this.#order = undefined;
    this.#graph = undefined;
  }
}
