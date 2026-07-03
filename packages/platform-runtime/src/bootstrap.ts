/**
 * UCOS Substrate — Runtime assembly (the "runtime artifact").
 *
 * Wires the Meta-Core kernel over the in-memory Registry, Metadata, and Configuration runtimes.
 * This is the single entry point that stands up a working substrate.
 */

import { MetaCoreKernel } from "./meta-core/kernel.ts";
import { PluginRuntime } from "./meta-core/plugin-runtime.ts";
import { InMemoryRegistry } from "./registry-runtime/registry.ts";
import { InMemoryMetadataStore } from "./metadata-runtime/metadata-store.ts";
import { LayeredConfigurationStore, DEFAULT_LAYER_ORDER } from "./configuration-runtime/configuration-store.ts";

export interface SubstrateOptions {
  layerOrder?: readonly string[];
  validateMetadataOnWrite?: boolean;
}

export interface Substrate {
  kernel: MetaCoreKernel;
  registry: InMemoryRegistry;
  metadata: InMemoryMetadataStore;
  configuration: LayeredConfigurationStore;
  plugins: PluginRuntime;
}

export function createSubstrate(options: SubstrateOptions = {}): Substrate {
  const registry = new InMemoryRegistry();
  const metadata = new InMemoryMetadataStore({ validateOnWrite: options.validateMetadataOnWrite ?? true });
  const configuration = new LayeredConfigurationStore(options.layerOrder ?? DEFAULT_LAYER_ORDER);
  const plugins = new PluginRuntime();
  const kernel = new MetaCoreKernel({ registry, metadata, configuration, plugins });
  return { kernel, registry, metadata, configuration, plugins };
}
