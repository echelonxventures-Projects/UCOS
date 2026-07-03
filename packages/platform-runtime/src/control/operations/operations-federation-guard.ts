/**
 * UCOS Operational Proof Fabric — Federation Guard (OPF-FED-001).
 *
 * Governs cross-node operational evidence (distributed capable): verifies signed proof bundles,
 * enforces tenant admission (deny-by-default), clamps conferred trust to the tenant ceiling, preserves
 * local sovereignty (a foreign proof may never override a local `sealed` proof of the same id), and
 * fails closed on partition. Reuses federation cryptography.
 */

import type { ProofBundle, ProofRecord, VerificationResult } from "./types.ts";
import type { KeyRegistry } from "../federation/assertions.ts";
import type { PartitionMonitor } from "../federation/partition-handling.ts";
import type { OperationsRegistry } from "./operations-registry.ts";
import type { OperationsStore } from "./operations-store.ts";
import { verifyPayload, isFresh } from "../federation/assertions.ts";
import { unitHash } from "./proof-unit.ts";

export class OperationsFederationGuard {
  readonly #keys: KeyRegistry;
  readonly #registry: OperationsRegistry;
  readonly #store: OperationsStore;
  readonly #partition: PartitionMonitor | undefined;

  constructor(keys: KeyRegistry, registry: OperationsRegistry, store: OperationsStore, partition?: PartitionMonitor) {
    this.#keys = keys;
    this.#registry = registry;
    this.#store = store;
    this.#partition = partition;
  }

  /**
   * Verify an inbound signed proof bundle: partition-reachable + fresh + untampered + issuer holds the
   * `attest` power for the target tenant + valid signature. Fail-closed on any failure.
   */
  verifyInbound(bundle: ProofBundle, now: number = Date.now()): VerificationResult {
    const tenantId = bundle.record.tenantId;
    if (this.#partition && !this.#partition.reachable(`operations:${bundle.record.source.nodeId ?? "unknown"}`)) {
      return { ok: false, reason: "source node unreachable (partition) — fail-closed" };
    }
    if (!this.#registry.isTenantActive(tenantId)) {
      return { ok: false, reason: `tenant "${tenantId}" is unknown/suspended (deny-by-default)` };
    }
    if (!isFresh(bundle.issuedAt, bundle.expiresAt, now)) return { ok: false, reason: "bundle expired/not fresh" };
    if (bundle.record.unitHash !== unitHash(bundle.record.unit)) return { ok: false, reason: "bundle unit tampered (hash mismatch)" };
    if (!this.#registry.hasPower(bundle.issuer, "attest", tenantId)) {
      return { ok: false, reason: `issuer "${bundle.issuer}" lacks attest power for tenant "${tenantId}" (deny-by-default)` };
    }
    const pub = this.#keys.get(bundle.issuerKeyRef);
    if (!pub) return { ok: false, reason: `no public key for issuerKeyRef "${bundle.issuerKeyRef}"` };
    const sig = bundle.signature;
    if (!sig) return { ok: false, reason: "bundle unsigned" };
    const { signature: _omit, ...payload } = bundle;
    if (!verifyPayload(payload, sig, pub)) return { ok: false, reason: "invalid bundle signature" };
    return { ok: true, reason: "inbound bundle verified" };
  }

  /** Clamp a foreign proof's trust to the tenant ceiling (OPF5 trust-boundary bypass). */
  clampTrust(record: ProofRecord): number {
    return Math.min(record.trustLevel, this.#registry.tenantMaxTrust(record.tenantId));
  }

  /** Local sovereignty: a foreign proof may not override a local `sealed` proof of the same id. */
  mayOverrideLocal(record: ProofRecord): boolean {
    if (record.source.kind === "local") return true;
    const localSealed = this.#store
      .proofVersions(record.tenantId, record.proofId)
      .some((r) => r.source.kind === "local" && r.state === "sealed");
    return !localSealed;
  }
}
