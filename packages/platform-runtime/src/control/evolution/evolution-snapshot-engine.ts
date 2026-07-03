/**
 * UCOS Evolution Fabric — Snapshot Engine (EVO-ARCH-001).
 *
 * Captures a deterministic, read-only observation of the substrate state covered by an evolution
 * unit's declared targets, computes a canonical `stateHash`, and validates snapshot integrity. The
 * hash is compared after rollback to prove the substrate was restored exactly (rollback verification).
 *
 * Reads only through the PUBLIC substrate seams. Because the ConfigurationPort exposes no per-layer
 * read, config state is observed via its effective merged value (`configuration.resolve(cap)`) — which
 * is exactly what a rollback of an evolution-owned layer restores.
 */

import type { MetaCoreKernel } from "../../meta-core/kernel.ts";
import type { EvolutionSnapshot, EvolutionTarget, StateCapture, VerificationResult } from "./types.ts";
import { isTombstone } from "./types.ts";
import { canonicalize, sha256 } from "../federation/assertions.ts";

export class EvolutionSnapshotEngine {
  readonly #kernel: MetaCoreKernel;

  constructor(kernel: MetaCoreKernel) {
    this.#kernel = kernel;
  }

  /** Observe the current state across the unit's targets (deterministic ordering). */
  capture(targets: readonly EvolutionTarget[]): StateCapture {
    const registry: { key: string; descriptor: unknown }[] = [];
    const config: { key: string; value: unknown }[] = [];
    const metadata: { key: string; value: unknown }[] = [];

    for (const target of targets) {
      if (target.kind === "registry") {
        for (const rec of this.#kernel.registry.list()) {
          if (rec.id === target.id) registry.push({ key: `${rec.id}@${rec.version}`, descriptor: rec.descriptor });
        }
      } else if (target.kind === "config") {
        config.push({ key: target.capabilityId, value: this.#kernel.configuration.resolve(target.capabilityId) });
      } else {
        for (const rec of this.#kernel.metadata.query(target.keyPrefix)) {
          if (isTombstone(rec.value)) continue; // tombstoned keys are logically absent
          metadata.push({ key: rec.key, value: rec.value });
        }
      }
    }

    registry.sort((a, b) => a.key.localeCompare(b.key));
    config.sort((a, b) => a.key.localeCompare(b.key));
    metadata.sort((a, b) => a.key.localeCompare(b.key));
    return { registry, config, metadata };
  }

  stateHash(capture: StateCapture): string {
    return sha256(canonicalize(capture));
  }

  /** Take a full snapshot for `unitHash` over its targets. */
  snapshot(unitHash: string, targets: readonly EvolutionTarget[]): EvolutionSnapshot {
    const capture = this.capture(targets);
    return {
      snapshotId: `snap-${unitHash.slice(0, 12)}-${Date.now()}`,
      unitHash,
      capturedAt: Date.now(),
      stateHash: this.stateHash(capture),
      capture,
    };
  }

  /**
   * Validate a snapshot's internal integrity: the recorded `stateHash` must equal a re-hash of its
   * capture. A snapshot that fails validation is unsafe to roll back to -> the caller must fail closed
   * and never apply.
   */
  validate(snapshot: EvolutionSnapshot): VerificationResult {
    if (!snapshot.capture) return { ok: false, reason: "snapshot missing capture" };
    const rehash = this.stateHash(snapshot.capture);
    if (rehash !== snapshot.stateHash) return { ok: false, reason: "snapshot stateHash mismatch (corrupt snapshot)" };
    return { ok: true, reason: "snapshot valid" };
  }
}
