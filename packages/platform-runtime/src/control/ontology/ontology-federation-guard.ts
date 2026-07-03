/**
 * UCOS Ontology Fabric — Federation Guard (ONTO-FED-001).
 *
 * Governs cross-node ontology: verifies signed bundles, enforces trust boundaries (deny-by-default),
 * clamps conferred trust to the boundary ceiling, preserves local sovereignty (foreign ontology may
 * never override a local `active` record without local ratification), validates federation
 * re-ratification tokens, and fails closed on partition. Reuses federation crypto — no custom crypto.
 */

import type { OntologyBundle, OntologyFederationToken, OntologyRecord, VerificationResult } from "./types.ts";
import type { KeyRegistry } from "../federation/assertions.ts";
import type { PartitionMonitor } from "../federation/partition-handling.ts";
import type { OntologyRegistry } from "./ontology-registry.ts";
import type { OntologyStore } from "./ontology-store.ts";
import { verifyPayload, isFresh } from "../federation/assertions.ts";
import { unitHash } from "./ontology-unit.ts";

export class OntologyFederationGuard {
  readonly #keys: KeyRegistry;
  readonly #registry: OntologyRegistry;
  readonly #store: OntologyStore;
  readonly #partition: PartitionMonitor | undefined;

  constructor(keys: KeyRegistry, registry: OntologyRegistry, store: OntologyStore, partition?: PartitionMonitor) {
    this.#keys = keys;
    this.#registry = registry;
    this.#store = store;
    this.#partition = partition;
  }

  /**
   * Verify an inbound signed ontology bundle for admission into `boundaryId`: signature + freshness +
   * unit integrity + issuer in boundary + partition-reachable. Fail-closed on any failure.
   */
  verifyInbound(bundle: OntologyBundle, boundaryId: string, now: number = Date.now()): VerificationResult {
    if (this.#partition && !this.#partition.reachable(`ontology:${bundle.record.source.nodeId ?? "unknown"}`)) {
      return { ok: false, reason: "source node unreachable (partition) — fail-closed" };
    }
    if (!isFresh(bundle.issuedAt, bundle.expiresAt, now)) return { ok: false, reason: "bundle expired/not fresh" };
    if (bundle.record.unitHash !== unitHash(bundle.record.unit)) return { ok: false, reason: "bundle unit tampered (hash mismatch)" };
    if (!this.#registry.boundaryContains(boundaryId, bundle.issuer)) {
      return { ok: false, reason: `issuer "${bundle.issuer}" not a member of boundary "${boundaryId}" (deny-by-default)` };
    }
    const pub = this.#keys.get(bundle.issuerKeyRef);
    if (!pub) return { ok: false, reason: `no public key for issuerKeyRef "${bundle.issuerKeyRef}"` };
    const sig = bundle.signature;
    if (!sig) return { ok: false, reason: "bundle unsigned" };
    const { signature: _omit, ...payload } = bundle;
    if (!verifyPayload(payload, sig, pub)) return { ok: false, reason: "invalid bundle signature" };
    return { ok: true, reason: "inbound bundle verified" };
  }

  /** Clamp a foreign record's trust to the boundary ceiling. */
  clampTrust(record: OntologyRecord, boundaryId: string): number {
    return Math.min(record.trustLevel, this.#registry.boundaryMaxTrust(boundaryId));
  }

  /**
   * Local sovereignty: a foreign record may NOT override a local `active` record of the same
   * (namespace, kind, localId). Returns false (inadmissible as authoritative) if a local active record
   * exists.
   */
  mayOverrideLocal(record: OntologyRecord): boolean {
    if (record.source.kind === "local") return true;
    const localActive = this.#store
      .versions(record.namespace, record.kind, record.localId)
      .some((r) => r.source.kind === "local" && r.state === "active");
    return !localActive; // foreign cannot override a local active record
  }

  /** Verify a federation re-ratification token (signature + freshness). Fail-closed. */
  validateToken(token: OntologyFederationToken | undefined, now: number = Date.now()): VerificationResult {
    if (!token) return { ok: false, reason: "cross-boundary ontology requires a federation token" };
    if (!isFresh(token.issuedAt, token.expiresAt, now)) return { ok: false, reason: "federation token expired/not fresh" };
    const pub = this.#keys.get(token.issuerKeyRef);
    if (!pub) return { ok: false, reason: `no public key for token issuerKeyRef "${token.issuerKeyRef}"` };
    const sig = token.signature;
    if (!sig) return { ok: false, reason: "federation token unsigned" };
    const { signature: _omit, ...payload } = token;
    if (!verifyPayload(payload, sig, pub)) return { ok: false, reason: "invalid federation token signature" };
    return { ok: true, reason: "federation token verified" };
  }
}
