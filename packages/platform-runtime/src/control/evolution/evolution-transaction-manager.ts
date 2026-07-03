/**
 * UCOS Evolution Fabric — Transaction Manager (EVO-ARCH-001).
 *
 * Owns the low-level, reversible mutation of the substrate through PUBLIC seams only, and the
 * execution-context flag used to block re-entrant (recursive) proposals (E11). Each applied op yields
 * a `ReverseOp` captured AT APPLY TIME, so rollback is deterministic regardless of prior state.
 *
 * Config changes are performed on an evolution-owned layer and mirrored in a private shadow map, so
 * their prior values are always known for reversal (the ConfigurationPort exposes no per-layer read).
 * A metadata key that did not previously exist is reversed with a TOMBSTONE (logically absent).
 */

import type { MetaCoreKernel } from "../../meta-core/kernel.ts";
import type { EvolutionOp, ReverseOp } from "./types.ts";
import { TOMBSTONE } from "./types.ts";

function shadowKey(layer: string, capabilityId: string): string {
  return `${layer}\u0000${capabilityId}`;
}

export class EvolutionTransactionManager {
  readonly #kernel: MetaCoreKernel;
  readonly #configShadow = new Map<string, Record<string, unknown>>();
  #inExecution = false;

  constructor(kernel: MetaCoreKernel) {
    this.#kernel = kernel;
  }

  get inExecution(): boolean {
    return this.#inExecution;
  }

  enter(): void {
    this.#inExecution = true;
  }

  exit(): void {
    this.#inExecution = false;
  }

  /** Apply a single op and return its reverse. Throws on invalid op (caught by the orchestrator). */
  applyOp(op: EvolutionOp): ReverseOp {
    switch (op.op) {
      case "load-descriptor": {
        const d = op.descriptor;
        const existed = this.#kernel.registry.get(d.id, d.version) !== undefined;
        this.#kernel.loadDescriptors([d]);
        return existed ? { op: "noop" } : { op: "unregister", id: d.id, version: d.version };
      }
      case "set-config": {
        const prior = this.#configShadow.get(shadowKey(op.layer, op.capabilityId));
        this.#kernel.setConfig(op.layer, op.capabilityId, op.values);
        this.#configShadow.set(shadowKey(op.layer, op.capabilityId), op.values);
        return { op: "set-config", layer: op.layer, capabilityId: op.capabilityId, values: prior ?? {} };
      }
      case "put-metadata": {
        const priorRec = this.#kernel.metadata.get(op.key);
        this.#kernel.metadata.put(op.key, op.value);
        if (priorRec) {
          return priorRec.schema
            ? { op: "put-metadata", key: op.key, value: priorRec.value, schema: priorRec.schema }
            : { op: "put-metadata", key: op.key, value: priorRec.value };
        }
        return { op: "put-metadata", key: op.key, value: TOMBSTONE };
      }
    }
  }

  /** Replay a reverse op during rollback. */
  applyReverse(rev: ReverseOp): void {
    switch (rev.op) {
      case "unregister":
        this.#kernel.registry.unregister(rev.id, rev.version);
        return;
      case "set-config":
        this.#kernel.setConfig(rev.layer, rev.capabilityId, rev.values);
        this.#configShadow.set(shadowKey(rev.layer, rev.capabilityId), rev.values);
        return;
      case "put-metadata":
        this.#kernel.metadata.put(rev.key, rev.value, rev.schema);
        return;
      case "noop":
        return;
    }
  }
}
