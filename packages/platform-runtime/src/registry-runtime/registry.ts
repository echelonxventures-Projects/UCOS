/**
 * UCOS Substrate — Registry Runtime (FND-02).
 *
 * In-memory RegistryPort adapter: registration, discovery, resolution, versioning.
 * The store is pluggable behind RegistryPort; persistence can be added without kernel change.
 * Realizes UCOS-PEA-004; ADR-004.
 */

import type { SemVer, VersionRange } from "../contracts/types.ts";
import type { RegistryPort, RegistryRecord } from "../meta-core/ports.ts";
import { SubstrateError } from "../meta-core/errors.ts";
import { maxSatisfying, isValidVersion } from "../meta-core/semver.ts";

function key(id: string, version: SemVer): string {
  return `${id}@${version}`;
}

export class InMemoryRegistry implements RegistryPort {
  readonly #records = new Map<string, RegistryRecord>();
  readonly #versionsById = new Map<string, Set<SemVer>>();

  register(record: RegistryRecord): void {
    if (!isValidVersion(record.version)) {
      throw new SubstrateError("VALIDATION_FAILED", `Invalid version for ${record.id}: ${record.version}`, {
        id: record.id,
        version: record.version,
      });
    }
    const recordKey = key(record.id, record.version);
    if (this.#records.has(recordKey)) {
      throw new SubstrateError("REGISTRY_CONFLICT", `Already registered: ${recordKey}`, { id: record.id, version: record.version });
    }
    this.#records.set(recordKey, record);
    const versions = this.#versionsById.get(record.id) ?? new Set<SemVer>();
    versions.add(record.version);
    this.#versionsById.set(record.id, versions);
  }

  unregister(id: string, version: SemVer): void {
    const recordKey = key(id, version);
    this.#records.delete(recordKey);
    const versions = this.#versionsById.get(id);
    if (versions) {
      versions.delete(version);
      if (versions.size === 0) this.#versionsById.delete(id);
    }
  }

  get(id: string, version: SemVer): RegistryRecord | undefined {
    return this.#records.get(key(id, version));
  }

  resolve(id: string, range: VersionRange): RegistryRecord | undefined {
    const versions = this.#versionsById.get(id);
    if (!versions || versions.size === 0) return undefined;
    const best = maxSatisfying([...versions], range);
    if (best === undefined) return undefined;
    return this.#records.get(key(id, best));
  }

  list(kind?: "capability" | "contract"): RegistryRecord[] {
    const all = [...this.#records.values()];
    return kind ? all.filter((record) => record.kind === kind) : all;
  }

  has(id: string, range?: VersionRange): boolean {
    if (range === undefined) return this.#versionsById.has(id);
    return this.resolve(id, range) !== undefined;
  }
}
