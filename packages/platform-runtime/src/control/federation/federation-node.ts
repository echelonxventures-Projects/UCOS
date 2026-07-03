/**
 * UCOS Federation Fabric — Federation Node registry (FED-GOV-C1).
 *
 * A remote autonomous UCOS domain. Node records are runtime metadata under `federation:node:<id>`.
 * Lifecycle: proposed -> admitted -> (suspended <-> admitted) -> expelled (terminal).
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { FederationNodeRecord, NodeStatus } from "./types.ts";
import { ControlValidationError } from "../errors.ts";

const PREFIX = "federation:node:";

export class FederationNodeRegistry {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  propose(record: Omit<FederationNodeRecord, "status">): FederationNodeRecord {
    if (!record.nodeId) throw new ControlValidationError("Federation node requires a nodeId", { record });
    if (this.get(record.nodeId)) {
      throw new ControlValidationError(`Federation node "${record.nodeId}" already exists`, { nodeId: record.nodeId });
    }
    const full: FederationNodeRecord = { ...record, status: "proposed" };
    this.#metadata.put(`${PREFIX}${record.nodeId}`, full);
    return full;
  }

  admit(nodeId: string, by: string): void {
    const rec = this.#require(nodeId);
    if (rec.status !== "proposed" && rec.status !== "suspended") {
      throw new ControlValidationError(`Cannot admit node "${nodeId}" from status ${rec.status}`, { nodeId });
    }
    this.#metadata.put(`${PREFIX}${nodeId}`, { ...rec, status: "admitted", admittedAt: Date.now(), admittedBy: by });
  }

  #setStatus(nodeId: string, status: NodeStatus): void {
    const rec = this.#require(nodeId);
    if (rec.status === "expelled") throw new ControlValidationError(`Node "${nodeId}" is expelled (terminal)`, { nodeId });
    this.#metadata.put(`${PREFIX}${nodeId}`, { ...rec, status });
  }

  suspend(nodeId: string): void {
    this.#setStatus(nodeId, "suspended");
  }

  reinstate(nodeId: string): void {
    const rec = this.#require(nodeId);
    if (rec.status !== "suspended") throw new ControlValidationError(`Node "${nodeId}" is not suspended`, { nodeId });
    this.#metadata.put(`${PREFIX}${nodeId}`, { ...rec, status: "admitted" });
  }

  expel(nodeId: string): void {
    this.#setStatus(nodeId, "expelled");
  }

  get(nodeId: string): FederationNodeRecord | undefined {
    return this.#metadata.get(`${PREFIX}${nodeId}`)?.value as FederationNodeRecord | undefined;
  }

  list(): FederationNodeRecord[] {
    return this.#metadata.query(PREFIX).map((r) => r.value as FederationNodeRecord);
  }

  /** A node may act only when admitted (not proposed/suspended/expelled). */
  isActive(nodeId: string): boolean {
    return this.get(nodeId)?.status === "admitted";
  }

  #require(nodeId: string): FederationNodeRecord {
    const rec = this.get(nodeId);
    if (!rec) throw new ControlValidationError(`Unknown federation node "${nodeId}"`, { nodeId });
    return rec;
  }
}
