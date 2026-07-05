/**
 * UCOS PI-11 Simulation Fabric — M2 Sandbox Manager (C12, SIM-SEC-ISO-1 / SIM-COND-3).
 *
 * Allocates disposable, snapshot-isolated sandboxes. Every run write is confined to
 * `simulation:sandbox:<runId>:*` by a STATIC keyspace write-guard: a write whose key does not start
 * with the run's sandbox prefix is rejected with a typed `SANDBOX_ESCAPE` error and audited (S1). The
 * sandbox is a truly disposable in-memory store — it never touches the governed substrate metadata, so
 * the fabric introduces no independent write path to governed state (non-actuation, B5).
 */

import type { SimAuditEntry, SimulationSink } from "./types.ts";
import { SimulationError } from "./types.ts";
import { sandboxPrefix } from "./simulation-namespace.ts";

export interface SandboxHandle {
  readonly runId: string;
  readonly prefix: string;
  /** Write a value at `key`. `key` MUST start with the sandbox prefix or the write is rejected. */
  put(key: string, value: unknown): void;
  get(key: string): unknown;
  query(prefix: string): { key: string; value: unknown }[];
  keys(): string[];
  size(): number;
}

export class SandboxManager {
  readonly #stores = new Map<string, Map<string, unknown>>();
  readonly #sink: SimulationSink | undefined;

  constructor(sink?: SimulationSink) {
    this.#sink = sink;
  }

  #audit(entry: Omit<SimAuditEntry, "at">): void {
    this.#sink?.record({ at: Date.now(), ...entry });
  }

  /** Allocate a fresh, isolated sandbox for `runId`. Re-allocation of a live run is rejected. */
  allocate(runId: string): SandboxHandle {
    if (this.#stores.has(runId)) {
      throw new SimulationError("SIMULATION_VALIDATION_FAILED", `sandbox already allocated for run ${runId}`, { runId });
    }
    const prefix = sandboxPrefix(runId);
    const store = new Map<string, unknown>();
    this.#stores.set(runId, store);
    this.#audit({ event: "RUN_ALLOCATED", runId, actor: "sandbox", detail: `prefix=${prefix}` });

    const self = this;
    const handle: SandboxHandle = {
      runId,
      prefix,
      put(key: string, value: unknown): void {
        // STATIC keyspace write-guard (SIM-SEC-ISO-1): the sole write path is sandbox-confined.
        if (!key.startsWith(prefix)) {
          self.#audit({ event: "SANDBOX_WRITE_REJECTED", runId, actor: "sandbox", detail: `rejected key=${key}` });
          throw new SimulationError("SANDBOX_ESCAPE", `sandbox write outside keyspace: ${key}`, { runId, key, prefix });
        }
        store.set(key, value);
      },
      get(key: string): unknown {
        return store.get(key);
      },
      query(qPrefix: string): { key: string; value: unknown }[] {
        const out: { key: string; value: unknown }[] = [];
        for (const [k, v] of store) if (k.startsWith(qPrefix)) out.push({ key: k, value: v });
        return out;
      },
      keys(): string[] {
        return [...store.keys()];
      },
      size(): number {
        return store.size;
      },
    };
    return handle;
  }

  /** True iff a sandbox is currently allocated for `runId`. */
  isAllocated(runId: string): boolean {
    return this.#stores.has(runId);
  }

  /** Tear down (dispose) the sandbox and all its contents. Fail-closed: idempotent, always disposes. */
  teardown(runId: string): void {
    const store = this.#stores.get(runId);
    if (store) {
      store.clear();
      this.#stores.delete(runId);
      this.#audit({ event: "TORN_DOWN", runId, actor: "sandbox", detail: "sandbox disposed" });
    }
  }
}
