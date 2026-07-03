/**
 * UCOS Substrate — Shared Contract Types (Contracts SDK surface)
 *
 * These are the metadata-first descriptor shapes and runtime contracts that every
 * substrate module depends on. Nothing here contains business logic; capabilities are
 * described entirely by data (descriptors) and realized by externally supplied providers.
 *
 * Realizes: UCOS-PEA-004/005/006 descriptor model. Authorized by AD-0016.
 */

export type SemVer = string; // "MAJOR.MINOR.PATCH"
export type VersionRange = string; // exact "1.2.3" | caret "^1.2.0" | ">=1.0.0" | "*"

/** Minimal JSON-Schema subset used for contract/metadata/config validation. */
export interface JsonSchema {
  type?: "object" | "array" | "string" | "number" | "integer" | "boolean" | "null";
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: readonly unknown[];
  const?: unknown;
  additionalProperties?: boolean | JsonSchema;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  description?: string;
}

/**
 * Reference to a capability provider (plugin). Two resolution schemes are supported by
 * the Plugin Runtime:
 *   - "plugin:<name>"  → an in-memory factory registered programmatically
 *   - "<path>.ts|.js"  → a module dynamically imported relative to the descriptor source dir
 */
export interface ProviderRef {
  module: string;
  export: string;
}

export interface ContractRef {
  id: string;
  versionRange: VersionRange;
}

export interface CapabilityDependency {
  capabilityId: string;
  versionRange: VersionRange;
  /** Key under which the resolved dependency instance is injected. Defaults to capabilityId. */
  as?: string;
}

export interface CapabilityDescriptor {
  kind: "capability";
  id: string;
  version: SemVer;
  name: string;
  contract: ContractRef;
  provider: ProviderRef;
  dependencies?: CapabilityDependency[];
  configSchema?: JsonSchema;
  /** Default configuration layer values contributed by this descriptor. */
  defaults?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface ContractOperation {
  name: string;
  input: JsonSchema;
  output: JsonSchema;
}

export interface ContractDescriptor {
  kind: "contract";
  id: string;
  version: SemVer;
  operations: ContractOperation[];
}

export type Descriptor = CapabilityDescriptor | ContractDescriptor;

export type LifecycleState =
  | "registered"
  | "validated"
  | "resolved"
  | "composed"
  | "active"
  | "retired"
  | "failed";

export type Operation = (input: unknown) => unknown | Promise<unknown>;

export interface CapabilityInstance {
  readonly operations: Readonly<Record<string, Operation>>;
  dispose?: () => void | Promise<void>;
}

export interface CapabilityContext {
  readonly capabilityId: string;
  readonly config: Readonly<Record<string, unknown>>;
  readonly dependencies: Readonly<Record<string, CapabilityInstance>>;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export type CapabilityFactory = (
  context: CapabilityContext,
) => CapabilityInstance | Promise<CapabilityInstance>;

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}
