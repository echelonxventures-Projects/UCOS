/**
 * UCOS Foundational Substrate — public surface.
 *
 * PI-2 Meta-Core Runtime + PI-3 Registry / Metadata / Configuration Runtimes.
 * Authorized by AD-0016 (scoped Article IX release). No business/domain logic.
 */

// Contracts SDK surface
export type {
  SemVer,
  VersionRange,
  JsonSchema,
  ProviderRef,
  ContractRef,
  CapabilityDependency,
  CapabilityDescriptor,
  ContractDescriptor,
  ContractOperation,
  Descriptor,
  LifecycleState,
  Operation,
  CapabilityInstance,
  CapabilityContext,
  CapabilityFactory,
  ValidationIssue,
  ValidationResult,
} from "./contracts/types.ts";

// Meta-Core
export { MetaCoreKernel } from "./meta-core/kernel.ts";
export type { KernelPorts, CompositionReport, CapabilityReport } from "./meta-core/kernel.ts";
export { PluginRuntime } from "./meta-core/plugin-runtime.ts";
export { ValidationEngine } from "./meta-core/validation-engine.ts";
export { LifecycleEngine } from "./meta-core/lifecycle-engine.ts";
export { DependencyResolver } from "./meta-core/dependency-resolver.ts";
export { CompositionEngine, CompositionGraph } from "./meta-core/composition-engine.ts";
export type { ComposedNode } from "./meta-core/composition-engine.ts";
export { ExecutionEngine } from "./meta-core/execution-engine.ts";
export { ArtifactLoader } from "./meta-core/artifact-loader.ts";
export type { LoadedArtifact } from "./meta-core/artifact-loader.ts";
export { ContractLoader } from "./meta-core/contract-loader.ts";
export { CapabilityLoader } from "./meta-core/capability-loader.ts";
export type { RegistryPort, RegistryRecord, MetadataPort, MetadataRecord, ConfigurationPort } from "./meta-core/ports.ts";
export * from "./meta-core/errors.ts";
export * as semver from "./meta-core/semver.ts";

// Fabric runtimes
export { InMemoryRegistry } from "./registry-runtime/registry.ts";
export { InMemoryMetadataStore } from "./metadata-runtime/metadata-store.ts";
export type { MetadataStoreOptions } from "./metadata-runtime/metadata-store.ts";
export { validateAgainstSchema } from "./metadata-runtime/schema-validator.ts";
export { LayeredConfigurationStore, DEFAULT_LAYER_ORDER } from "./configuration-runtime/configuration-store.ts";

// Runtime assembly
export { createSubstrate, rehydrate } from "./bootstrap.ts";
export type { Substrate, SubstrateOptions, PersistenceOptions, PersistenceLogs } from "./bootstrap.ts";

// Persistence Runtime (L4) — durable port adapters + append-only storage medium.
export * from "./persistence-runtime/index.ts";

// PI-4 Control Fabrics (AD-0017) — additive control plane over the substrate.
export * from "./control/index.ts";
