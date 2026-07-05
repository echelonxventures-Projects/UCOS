/**
 * UCOS PI-11 Simulation Fabric — M3 Digital Twin Manager (C2, SIM-GOV-002 §1.2).
 *
 * Binds twins to signed, expiring baseline snapshots of governed targets. Snapshots are verified via
 * `federation/assertions.ts` (Ed25519) with freshness + replay-nonce enforcement (S2/S7). A twin whose
 * snapshot has expired transitions to `stale` and is non-projectable (fail-closed). The twin NEVER
 * writes back to the target (non-actuation, S12). The FDG-MEM `memory:*` read hook is an inert seam:
 * requesting memory enrichment during PI-11 is denied (AD-0022 FDG-MEM).
 */

import type { KeyRegistry, NonceCache } from "../federation/assertions.ts";
import { canonicalize, isFresh, sha256, verifyPayload } from "../federation/assertions.ts";
import type { SimulationRegistry } from "./simulation-registry.ts";
import type { DigitalTwinRecord, SignedSnapshot, SimulationSink } from "./types.ts";
import { SimulationError } from "./types.ts";

const SNAPSHOT_NONCE_TTL_MS = 3_600_000;

export class DigitalTwinManager {
  readonly #registry: SimulationRegistry;
  readonly #keys: KeyRegistry;
  readonly #nonces: NonceCache;
  readonly #sink: SimulationSink | undefined;
  /** In-memory baseline copies (never authoritative records). */
  readonly #baselines = new Map<string, SignedSnapshot>();

  constructor(deps: { registry: SimulationRegistry; keys: KeyRegistry; nonces: NonceCache; sink?: SimulationSink }) {
    this.#registry = deps.registry;
    this.#keys = deps.keys;
    this.#nonces = deps.nonces;
    this.#sink = deps.sink;
  }

  #audit(event: Parameters<SimulationSink["record"]>[0]["event"], actor: string, detail: string): void {
    this.#sink?.record({ at: Date.now(), event, actor, detail });
  }

  /** D2 (approval-required at runtime): define an unbound twin. */
  define(twinId: string, targetRef: string, fidelity = 1): DigitalTwinRecord {
    const rec: DigitalTwinRecord = { twinId, targetRef, state: "defined", fidelity };
    this.#registry.putTwin(rec);
    return rec;
  }

  /** Compute the canonical snapshot hash (over the snapshot without its signature). */
  static snapshotHash(snapshot: SignedSnapshot): string {
    const { signature: _sig, ...unsigned } = snapshot;
    return sha256(canonicalize(unsigned));
  }

  /**
   * Bind (or refresh) a twin to a signed snapshot. Fail-closed on any verification failure.
   * @param opts.memoryRef FDG-MEM inert seam — supplying it is DENIED during PI-11.
   */
  bind(twinId: string, snapshot: SignedSnapshot, opts: { now?: number; memoryRef?: string } = {}): DigitalTwinRecord {
    const now = opts.now ?? Date.now();
    const existing = this.#registry.getTwin(twinId);
    if (!existing) throw new SimulationError("SIMULATION_VALIDATION_FAILED", `unknown twin ${twinId}`, { twinId });
    if (existing.state === "retired") throw new SimulationError("TWIN_DRIFT", `twin ${twinId} is retired`, { twinId });

    // FDG-MEM: memory read enrichment is deferred behind a separate authorization (AD-0022).
    if (opts.memoryRef !== undefined) {
      this.#audit("DENY", "twin", `FDG-MEM premature binding rejected for ${twinId}`);
      throw new SimulationError("FDG_UNBOUND", "FDG-MEM: memory read enrichment is deferred (unbound)", { twinId });
    }

    // S2: signature + known key.
    const pubKey = this.#keys.get(snapshot.keyRef);
    if (!pubKey || !snapshot.signature) {
      this.#audit("DENY", "twin", `snapshot key/signature missing for ${twinId}`);
      throw new SimulationError("SNAPSHOT_INVALID", "snapshot key unknown or signature missing", { twinId, keyRef: snapshot.keyRef });
    }
    const { signature, ...unsigned } = snapshot;
    if (!verifyPayload(unsigned, signature, pubKey)) {
      this.#audit("DENY", "twin", `snapshot signature invalid for ${twinId}`);
      throw new SimulationError("SNAPSHOT_INVALID", "snapshot signature verification failed (tamper)", { twinId });
    }

    // S7: freshness (mandatory future expiry, not issued in the future) + replay-nonce single-use.
    if (!isFresh(snapshot.issuedAt, snapshot.expiresAt, now)) {
      this.#audit("DENY", "twin", `snapshot not fresh for ${twinId}`);
      throw new SimulationError("SNAPSHOT_INVALID", "snapshot expired or not yet valid", { twinId });
    }
    if (!this.#nonces.checkAndRecord(snapshot.issuer, snapshot.nonce, SNAPSHOT_NONCE_TTL_MS, now)) {
      this.#audit("DENY", "twin", `snapshot replay for ${twinId}`);
      throw new SimulationError("SNAPSHOT_INVALID", "snapshot nonce replay detected", { twinId });
    }

    const hash = DigitalTwinManager.snapshotHash(snapshot);
    this.#baselines.set(twinId, snapshot);
    const rec: DigitalTwinRecord = {
      ...existing,
      state: "active",
      snapshotHash: hash,
      snapshotExpiresAt: snapshot.expiresAt,
      classification: snapshot.classification,
      boundAt: now,
    };
    this.#registry.putTwin(rec);
    this.#audit("TWIN_BOUND", "twin", `twin ${twinId} bound snapshotHash=${hash}`);
    return rec;
  }

  /** Transition an expired twin to `stale` (non-projectable). Returns the current record. */
  refreshStaleness(twinId: string, now: number = Date.now()): DigitalTwinRecord {
    const rec = this.#registry.getTwin(twinId);
    if (!rec) throw new SimulationError("SIMULATION_VALIDATION_FAILED", `unknown twin ${twinId}`, { twinId });
    if (rec.state === "active" && rec.snapshotExpiresAt !== undefined && rec.snapshotExpiresAt <= now) {
      const stale: DigitalTwinRecord = { ...rec, state: "stale" };
      this.#registry.putTwin(stale);
      this.#audit("TWIN_STALE", "twin", `twin ${twinId} stale`);
      return stale;
    }
    return rec;
  }

  /**
   * Resolve the read-only baseline for projection. Fail-closed: an unbound, stale, expired, or retired
   * twin is non-projectable and throws `TWIN_DRIFT` (S12).
   */
  baseline(twinId: string, now: number = Date.now()): SignedSnapshot {
    const rec = this.refreshStaleness(twinId, now);
    if (rec.state !== "active") {
      throw new SimulationError("TWIN_DRIFT", `twin ${twinId} is non-projectable (state=${rec.state})`, { twinId, state: rec.state });
    }
    const snap = this.#baselines.get(twinId);
    if (!snap) throw new SimulationError("TWIN_DRIFT", `twin ${twinId} has no bound baseline`, { twinId });
    if (snap.expiresAt <= now) {
      this.refreshStaleness(twinId, now);
      throw new SimulationError("TWIN_DRIFT", `twin ${twinId} baseline expired`, { twinId });
    }
    return snap;
  }

  retire(twinId: string): void {
    const rec = this.#registry.getTwin(twinId);
    if (!rec) return;
    this.#registry.putTwin({ ...rec, state: "retired" });
    this.#baselines.delete(twinId);
  }
}
