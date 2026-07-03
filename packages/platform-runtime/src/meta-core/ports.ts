/**
 * UCOS Substrate — Meta-Core Ports.
 *
 * The Meta-Core kernel depends only on these interfaces (composition-first / dependency
 * inversion). The Registry, Metadata, and Configuration runtimes are concrete adapters.
 * Swapping any storage backend requires no kernel change.
 */

import type {
  CapabilityDescriptor,
  ContractDescriptor,
  JsonSchema,
  SemVer,
  ValidationResult,
  VersionRange,
} from "../contracts/types.ts";

export interface RegistryRecord {
  id: string;
  version: SemVer;
  kind: "capability" | "contract";
  descriptor: CapabilityDescriptor | ContractDescriptor;
  /** Directory the descriptor was loaded from (used to resolve relative provider modules). */
  sourceDir?: string;
}

/** FND-02 Registry Fabric surface. */
export interface RegistryPort {
  register(record: RegistryRecord): void;
  unregister(id: string, version: SemVer): void;
  get(id: string, version: SemVer): RegistryRecord | undefined;
  /** Highest registered version of `id` satisfying `range`. */
  resolve(id: string, range: VersionRange): RegistryRecord | undefined;
  list(kind?: "capability" | "contract"): RegistryRecord[];
  has(id: string, range?: VersionRange): boolean;
}

export interface MetadataRecord {
  key: string;
  value: unknown;
  schema?: JsonSchema;
}

/** FND-03 Metadata Fabric surface. */
export interface MetadataPort {
  put(key: string, value: unknown, schema?: JsonSchema): void;
  get(key: string): MetadataRecord | undefined;
  /** All records whose key starts with `prefix`. */
  query(prefix: string): MetadataRecord[];
  /** Validate a value against a schema (resolver + validation engine primitive). */
  validate(value: unknown, schema: JsonSchema): ValidationResult;
}

/** FND-04 Configuration Fabric surface. Layers are merged in registration order. */
export interface ConfigurationPort {
  setLayer(layer: string, capabilityId: string, values: Record<string, unknown>): void;
  /** Effective, deep-merged configuration for a capability across all ordered layers. */
  resolve(capabilityId: string): Record<string, unknown>;
  layers(): string[];
}
