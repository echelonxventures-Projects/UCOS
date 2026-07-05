/**
 * UCOS PI-11 Simulation Fabric — M9 Revocation Authority (C10, SIM-GOV-002 D10).
 *
 * Forward-only, fail-closed revocation across twins, scenarios, models, runs, and results. A
 * revocation is a durable `simulation:revoked:*` marker; once set it cannot be lifted (forward-only).
 * Revocation status is consulted by the promotion pipeline (fail-closed: a revoked artifact anywhere in
 * the chain blocks promotion). Under partition the marker still denies (fail-closed).
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { SimulationSink } from "./types.ts";
import { SimulationError } from "./types.ts";
import { isAllowedNamespace, revokedKey } from "./simulation-namespace.ts";

export type RevocableSimKind = "twin" | "scenario" | "model" | "run" | "result" | "authority";

export class RevocationAuthority {
  readonly #metadata: MetadataPort;
  readonly #sink: SimulationSink | undefined;

  constructor(deps: { metadata: MetadataPort; sink?: SimulationSink }) {
    this.#metadata = deps.metadata;
    this.#sink = deps.sink;
  }

  /** Revoke an artifact (approval-required act). Idempotent; forward-only. */
  revoke(kind: RevocableSimKind, id: string, actor = "revocation-authority", reason?: string): void {
    const key = revokedKey(kind, id);
    if (!isAllowedNamespace(key)) throw new SimulationError("SANDBOX_ESCAPE", `revocation write outside namespace: ${key}`, { key });
    this.#metadata.put(key, { kind, id, revokedAt: Date.now(), actor, reason: reason ?? "" });
    this.#sink?.record({ at: Date.now(), event: "REVOKED", actor, detail: `${kind}:${id} revoked${reason ? ` (${reason})` : ""}` });
  }

  isRevoked(kind: RevocableSimKind, id: string): boolean {
    return this.#metadata.get(revokedKey(kind, id)) !== undefined;
  }

  /** Fail-closed guard used before promotion: throws if any listed artifact is revoked. */
  assertNoneRevoked(artifacts: { kind: RevocableSimKind; id: string }[]): void {
    for (const a of artifacts) {
      if (this.isRevoked(a.kind, a.id)) {
        throw new SimulationError("SIMULATION_DENIED", `${a.kind} ${a.id} is revoked`, { kind: a.kind, id: a.id });
      }
    }
  }
}
