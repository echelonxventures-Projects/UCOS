/**
 * UCOS Memory Fabric — Federation Guard (MEM-FED-001).
 *
 * Governs cross-node memory: verifies signed memory bundles, enforces the Memory Trust Boundary
 * (deny-by-default), clamps conferred trust to the boundary ceiling, honors classification on ingest
 * (S4), preserves local sovereignty (foreign memory may never override a local `active` record —
 * deny-only shadow), and fails closed on partition. Reuses federation crypto (no custom crypto).
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import { KeyRegistry, NonceCache } from "../federation/assertions.ts";
import type { PartitionMonitor } from "../federation/partition-handling.ts";
import type { MemoryBoundaryRecord, MemoryBundle, MemoryRecord, VerificationResult } from "./types.ts";
import type { MemoryStore } from "./memory-store.ts";
import { SignedAssertionVerifier } from "./signed-assertion-verifier.ts";
import { boundaryKey } from "./memory-namespace.ts";

export class MemoryFederationGuard {
  readonly #metadata: MetadataPort;
  readonly #store: MemoryStore;
  readonly #partition: PartitionMonitor | undefined;
  readonly #verifier: SignedAssertionVerifier;

  constructor(keys: KeyRegistry, metadata: MetadataPort, store: MemoryStore, partition?: PartitionMonitor, nonces?: NonceCache) {
    this.#metadata = metadata;
    this.#store = store;
    this.#partition = partition;
    this.#verifier = new SignedAssertionVerifier(keys, nonces ?? new NonceCache());
  }

  #boundary(boundaryId: string): MemoryBoundaryRecord | undefined {
    return this.#metadata.get(boundaryKey(boundaryId))?.value as MemoryBoundaryRecord | undefined;
  }

  boundaryContains(boundaryId: string, authorityId: string): boolean {
    return this.#boundary(boundaryId)?.members.includes(authorityId) ?? false; // absent ⇒ deny
  }

  boundaryMaxTrust(boundaryId: string): number {
    return this.#boundary(boundaryId)?.maxTrustLevel ?? 0; // absent ⇒ 0 (deny-by-default)
  }

  /**
   * Verify an inbound signed memory bundle for admission into `boundaryId`:
   * partition-reachable + freshness + unit integrity + issuer-in-boundary + valid signature +
   * classification permits crossing. Fail-closed on any failure.
   */
  verifyInbound(bundle: MemoryBundle, boundaryId: string, now: number = Date.now()): VerificationResult {
    if (this.#partition && !this.#partition.reachable(`memory:${bundle.record.source.nodeId ?? "unknown"}`)) {
      return { ok: false, reason: "source node unreachable (partition) — fail-closed" };
    }
    if (!this.boundaryContains(boundaryId, bundle.issuer)) {
      return { ok: false, reason: `issuer "${bundle.issuer}" not a member of boundary "${boundaryId}" (deny-by-default)` };
    }
    // Classification gate (S4): a record whose classification exceeds the boundary ceiling cannot cross.
    const b = this.#boundary(boundaryId);
    if (b && b.maxClassificationLevel !== undefined && bundle.record.classification.level > b.maxClassificationLevel) {
      return { ok: false, reason: "record classification exceeds boundary ceiling (S4)" };
    }
    // Delegate freshness + unit integrity + key resolution + signature + single-use replay to the verifier.
    return this.#verifier.verifyBundle(bundle, { now });
  }

  /** Clamp a foreign record's trust to the boundary ceiling. */
  clampTrust(record: MemoryRecord, boundaryId: string): number {
    return Math.min(record.trustLevel, this.boundaryMaxTrust(boundaryId));
  }

  /**
   * Local sovereignty: a foreign record may NOT override a local `active` record of the same
   * id/namespace. Returns false (inadmissible as authoritative) if a local active record exists.
   */
  mayOverrideLocal(record: MemoryRecord): boolean {
    if (record.source.kind === "local") return true;
    const localActive = this.#store
      .versions(record.namespace, record.memId)
      .some((r) => r.source.kind === "local" && r.state === "active");
    return !localActive; // foreign cannot override a local active record
  }
}
