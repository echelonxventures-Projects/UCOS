/**
 * UCOS Substrate — Configuration Runtime (FND-04).
 *
 * Layered ConfigurationPort adapter. Values are stored per (layer, capability) and the
 * resolver deep-merges them in the fixed layer order (later layers win). This is how a
 * capability's effective configuration is assembled without any code fork.
 * Realizes UCOS-PEA-005; ADR-005.
 */

import type { ConfigurationPort } from "../meta-core/ports.ts";

export const DEFAULT_LAYER_ORDER = ["default", "environment", "instance"] as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const existing = result[key];
    if (isPlainObject(existing) && isPlainObject(value)) {
      result[key] = deepMerge(existing, value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export class LayeredConfigurationStore implements ConfigurationPort {
  readonly #order: string[];
  // layer -> capabilityId -> values
  readonly #store = new Map<string, Map<string, Record<string, unknown>>>();

  constructor(layerOrder: readonly string[] = DEFAULT_LAYER_ORDER) {
    if (layerOrder.length === 0) throw new Error("Configuration layer order cannot be empty");
    this.#order = [...layerOrder];
    for (const layer of this.#order) this.#store.set(layer, new Map());
  }

  setLayer(layer: string, capabilityId: string, values: Record<string, unknown>): void {
    let layerStore = this.#store.get(layer);
    if (!layerStore) {
      // Unknown layers append to the end (lowest precedence after known layers, highest among unknown).
      layerStore = new Map();
      this.#store.set(layer, layerStore);
      this.#order.push(layer);
    }
    layerStore.set(capabilityId, values);
  }

  resolve(capabilityId: string): Record<string, unknown> {
    let merged: Record<string, unknown> = {};
    for (const layer of this.#order) {
      const values = this.#store.get(layer)?.get(capabilityId);
      if (values) merged = deepMerge(merged, values);
    }
    return merged;
  }

  layers(): string[] {
    return [...this.#order];
  }
}
