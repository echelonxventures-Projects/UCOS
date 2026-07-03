/**
 * UCOS Federation Fabric — Partition handling (FGP-4 / FED-SEC-TBE / FED-ARCH §4).
 *
 * Federation is fail-closed: when a required source (issuer key service, revocation authority, remote
 * node) is unreachable, dependent operations DENY. Cached foreign state has bounded staleness with a
 * hard expiry; expired => treated as absent => deny-by-default.
 */

export class PartitionMonitor {
  readonly #unreachable = new Set<string>();

  /** Mark a source unreachable (partition). */
  markUnreachable(sourceId: string): void {
    this.#unreachable.add(sourceId);
  }

  /** Mark a source reachable again. */
  markReachable(sourceId: string): void {
    this.#unreachable.delete(sourceId);
  }

  reachable(sourceId: string): boolean {
    return !this.#unreachable.has(sourceId);
  }
}

/** Hard staleness check for cached federated records. Expired => not usable (fail-closed). */
export function withinStaleness(materializedAt: number, ttlMs: number, now: number = Date.now()): boolean {
  return materializedAt + ttlMs > now;
}
