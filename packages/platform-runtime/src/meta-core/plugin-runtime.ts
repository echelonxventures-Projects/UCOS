/**
 * UCOS Substrate — Plugin Runtime (Meta-Core).
 *
 * Resolves capability providers (factories) referenced by descriptors. This is the seam
 * that keeps the kernel free of business logic: providers are supplied externally, either
 * as in-memory registered factories ("plugin:<name>") or as dynamically imported modules.
 */

import { isAbsolute, resolve as resolvePath } from "node:path";
import { pathToFileURL } from "node:url";
import type { CapabilityFactory, ProviderRef } from "../contracts/types.ts";
import { PluginLoadError } from "./errors.ts";

const PLUGIN_SCHEME = "plugin:";

export class PluginRuntime {
  readonly #inline = new Map<string, CapabilityFactory>();
  readonly #moduleCache = new Map<string, Record<string, unknown>>();

  /** Register a provider factory programmatically. Referenced via module = "plugin:<name>". */
  registerInline(name: string, factory: CapabilityFactory): void {
    if (this.#inline.has(name)) {
      throw new PluginLoadError(`Inline provider already registered: ${name}`, { name });
    }
    this.#inline.set(name, factory);
  }

  hasInline(name: string): boolean {
    return this.#inline.has(name);
  }

  async load(ref: ProviderRef, sourceDir?: string): Promise<CapabilityFactory> {
    if (ref.module.startsWith(PLUGIN_SCHEME)) {
      const name = ref.module.slice(PLUGIN_SCHEME.length);
      const factory = this.#inline.get(name);
      if (!factory) {
        throw new PluginLoadError(`No inline provider registered for "${name}"`, { module: ref.module });
      }
      return factory;
    }

    const absolutePath = isAbsolute(ref.module)
      ? ref.module
      : resolvePath(sourceDir ?? process.cwd(), ref.module);

    let moduleNamespace = this.#moduleCache.get(absolutePath);
    if (!moduleNamespace) {
      try {
        moduleNamespace = (await import(pathToFileURL(absolutePath).href)) as Record<string, unknown>;
      } catch (cause) {
        throw new PluginLoadError(`Failed to import provider module "${ref.module}"`, {
          module: ref.module,
          absolutePath,
          cause: cause instanceof Error ? cause.message : String(cause),
        });
      }
      this.#moduleCache.set(absolutePath, moduleNamespace);
    }

    const exported = moduleNamespace[ref.export];
    if (typeof exported !== "function") {
      throw new PluginLoadError(`Export "${ref.export}" in "${ref.module}" is not a factory function`, {
        module: ref.module,
        export: ref.export,
      });
    }
    return exported as CapabilityFactory;
  }
}
