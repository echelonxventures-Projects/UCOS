/**
 * UCOS Substrate — Durable ConfigurationPort adapter (DEL-003).
 *
 * A restart-safe ConfigurationPort over the append-only log. The ratified layered configuration
 * store is the live, derived projection; the log durably records every `setLayer` mutation. The
 * fixed base layer order is a construction parameter (not persisted); dynamically introduced layers
 * are reconstructed deterministically by replaying the log in append order.
 */

import type { ConfigurationPort } from "../meta-core/ports.ts";
import { LayeredConfigurationStore, DEFAULT_LAYER_ORDER } from "../configuration-runtime/configuration-store.ts";
import type { AppendOnlyLog } from "./append-only-log.ts";

interface SetLayerEvent {
  readonly op: "setLayer";
  readonly layer: string;
  readonly capabilityId: string;
  readonly values: Record<string, unknown>;
}

export class DurableConfigurationStore implements ConfigurationPort {
  readonly #inner: LayeredConfigurationStore;
  readonly #log: AppendOnlyLog;

  constructor(log: AppendOnlyLog, layerOrder: readonly string[] = DEFAULT_LAYER_ORDER) {
    this.#inner = new LayeredConfigurationStore(layerOrder);
    this.#log = log;
    this.#rehydrate();
  }

  /** Rebuild the projection by replaying every setLayer mutation in append order. */
  #rehydrate(): void {
    for (const record of this.#log.readAll()) {
      this.#apply(record.event as SetLayerEvent);
    }
  }

  /** Apply an event to the in-memory projection only (no logging). */
  #apply(event: SetLayerEvent): void {
    this.#inner.setLayer(event.layer, event.capabilityId, event.values);
  }

  setLayer(layer: string, capabilityId: string, values: Record<string, unknown>): void {
    this.#inner.setLayer(layer, capabilityId, values);
    this.#log.append({ op: "setLayer", layer, capabilityId, values } satisfies SetLayerEvent);
  }

  resolve(capabilityId: string): Record<string, unknown> {
    return this.#inner.resolve(capabilityId);
  }

  layers(): string[] {
    return this.#inner.layers();
  }
}
