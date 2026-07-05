/**
 * UCOS Substrate — Persistence Runtime canonical serialization.
 *
 * Deterministic JSON serialization with recursively sorted object keys. Used to test structural
 * identity of records independently of key insertion order (e.g. an idempotent re-registration
 * check where a replayed record and a freshly-loaded record are structurally equal but may differ
 * in property order).
 */

export function canonicalStringify(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value !== null && typeof value === "object") {
    const source = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(source).sort()) out[key] = sortKeys(source[key]);
    return out;
  }
  return value;
}
