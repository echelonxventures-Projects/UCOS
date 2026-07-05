/**
 * UCOS Substrate — Runtime assembly (the "runtime artifact").
 *
 * Wires the Meta-Core kernel over the Registry, Metadata, and Configuration runtimes. This is the
 * single entry point that stands up a working substrate.
 *
 * Two modes, selected by `SubstrateOptions.persistence`:
 *   - ephemeral (default): in-memory ports; state is lost on process exit (L3 behavior);
 *   - persistent (L4)    : durable, append-only-backed ports. On construction each durable port
 *                          rehydrates its in-memory projection by replaying its log, so authoritative
 *                          Registry / Metadata / Configuration state survives process and machine
 *                          restart. Derived state (composition graph, indexes) is rebuilt by
 *                          `rehydrate()` (or any kernel.compose()) from the restored authoritative
 *                          state plus repository descriptors/providers.
 *
 * This module is runtime assembly, not kernel or fabric logic: it only swaps which port adapters are
 * wired in. Port contracts, the kernel, and all fabrics are untouched.
 */

import { MetaCoreKernel } from "./meta-core/kernel.ts";
import { PluginRuntime } from "./meta-core/plugin-runtime.ts";
import type { ConfigurationPort, MetadataPort, RegistryPort } from "./meta-core/ports.ts";
import type { CompositionGraph } from "./meta-core/composition-engine.ts";
import { InMemoryRegistry } from "./registry-runtime/registry.ts";
import { InMemoryMetadataStore } from "./metadata-runtime/metadata-store.ts";
import { LayeredConfigurationStore, DEFAULT_LAYER_ORDER } from "./configuration-runtime/configuration-store.ts";
import { join } from "node:path";
import type { AppendOnlyLog } from "./persistence-runtime/append-only-log.ts";
import { FileAppendOnlyLog } from "./persistence-runtime/append-only-log.ts";
import { DurableMetadataStore } from "./persistence-runtime/durable-metadata-store.ts";
import { DurableRegistryStore } from "./persistence-runtime/durable-registry-store.ts";
import { DurableConfigurationStore } from "./persistence-runtime/durable-configuration-store.ts";

/** Explicit append-only logs backing each durable port (one per port). */
export interface PersistenceLogs {
  metadata: AppendOnlyLog;
  registry: AppendOnlyLog;
  configuration: AppendOnlyLog;
}

/**
 * Durable persistence configuration. Provide either a `directory` (file-backed logs are created
 * under it) or explicit `logs` (e.g. in-memory logs for tests, or a custom backend).
 */
export interface PersistenceOptions {
  /** Directory under which `metadata.log`, `registry.log`, and `configuration.log` are stored. */
  directory?: string;
  /** Explicit logs (overrides `directory`). */
  logs?: PersistenceLogs;
}

export interface SubstrateOptions {
  layerOrder?: readonly string[];
  validateMetadataOnWrite?: boolean;
  /** When set, the substrate uses durable, restart-safe ports (L4). Omit for an ephemeral runtime. */
  persistence?: PersistenceOptions;
}

export interface Substrate {
  kernel: MetaCoreKernel;
  registry: RegistryPort;
  metadata: MetadataPort;
  configuration: ConfigurationPort;
  plugins: PluginRuntime;
  /** True when the substrate is backed by durable, restart-safe ports. */
  durable: boolean;
}

function fileLogs(directory: string): PersistenceLogs {
  return {
    metadata: new FileAppendOnlyLog(join(directory, "metadata.log")),
    registry: new FileAppendOnlyLog(join(directory, "registry.log")),
    configuration: new FileAppendOnlyLog(join(directory, "configuration.log")),
  };
}

function resolveLogs(persistence: PersistenceOptions): PersistenceLogs {
  if (persistence.logs) return persistence.logs;
  if (persistence.directory) return fileLogs(persistence.directory);
  throw new Error("SubstrateOptions.persistence requires either `directory` or `logs`");
}

export function createSubstrate(options: SubstrateOptions = {}): Substrate {
  const validateOnWrite = options.validateMetadataOnWrite ?? true;
  const layerOrder = options.layerOrder ?? DEFAULT_LAYER_ORDER;

  let registry: RegistryPort;
  let metadata: MetadataPort;
  let configuration: ConfigurationPort;

  if (options.persistence) {
    // L4: durable ports. Each adapter rehydrates its projection from its log on construction.
    const logs = resolveLogs(options.persistence);
    registry = new DurableRegistryStore(logs.registry);
    metadata = new DurableMetadataStore(logs.metadata, { validateOnWrite });
    configuration = new DurableConfigurationStore(logs.configuration, layerOrder);
  } else {
    // L3: ephemeral in-memory ports.
    registry = new InMemoryRegistry();
    metadata = new InMemoryMetadataStore({ validateOnWrite });
    configuration = new LayeredConfigurationStore(layerOrder);
  }

  const plugins = new PluginRuntime();
  const kernel = new MetaCoreKernel({ registry, metadata, configuration, plugins });
  return { kernel, registry, metadata, configuration, plugins, durable: Boolean(options.persistence) };
}

/**
 * Rebuild DERIVED runtime state (composition graph, dependency ordering, and the derived indexes the
 * engines hold) from the already-rehydrated authoritative state plus the registered providers.
 *
 * Authoritative Registry / Metadata / Configuration state is restored automatically when a durable
 * substrate is constructed. Derived state must never be treated as authoritative, so it is
 * reconstructed here deterministically from the authoritative records. Providers are code (loaded
 * from the repository) and must be registered on the kernel before calling this.
 *
 * Returns the recomposed graph. Equivalent to `substrate.kernel.compose()`, exposed as a named L4
 * rehydration entry point.
 */
export async function rehydrate(substrate: Substrate): Promise<CompositionGraph> {
  substrate.kernel.resolve();
  return substrate.kernel.compose();
}
