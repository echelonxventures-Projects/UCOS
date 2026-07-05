/**
 * Contract Skeleton Generator — shared generated runtime emitters (WI-07).
 *
 * Emits the small, contract-agnostic support types shared by every generated contract:
 *   _runtime/transport.ts  — transport-neutral verb/payload/port types (injected transport)
 *   _runtime/manifest.ts   — registry manifest types
 * These are GENERATED (deterministic) so the contracts-sdk package stays fully generated.
 *
 * Traceability: CONTRACT-VALIDATION-ARCHITECTURE.md §5 (transport deferred) · IC-2.
 */

import { generatedBanner } from "./render.ts";

export function emitTransportRuntime(): string {
  return (
    generatedBanner([
      "Shared transport-neutral runtime types for all generated contract clients.",
      "No host, protocol, serialization, or framework is assumed (deferred to Prompt 08).",
    ]) +
    `/** Catalog-verbatim operation verb semantics (safe/unsafe/idempotent), not a chosen transport verb. */
export type VerbSemantics = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * OPAQUE payload. The contract catalog defers all field-level payload schemas
 * (G1: NOT DEFINED IN CATALOG; Prompt 05 / UCOS-PDATA-ARCH-001). Do NOT assume a shape;
 * a later generation pass replaces this with typed DTOs once the data architecture defines them.
 */
export type OpaquePayload = unknown;

/** Transport-neutral request envelope handed to the injected TransportPort. */
export interface TransportRequest {
  readonly operationId: string;
  readonly verbSemantics: VerbSemantics;
  readonly path: string;
  readonly pathParameters: Readonly<Record<string, string>>;
  readonly queryParameters?: Readonly<Record<string, string>>;
  readonly body?: OpaquePayload;
}

/** Injected transport. The SDK never binds a concrete transport; callers provide one. */
export interface TransportPort {
  send(request: TransportRequest): Promise<OpaquePayload>;
}
`
  );
}

export function emitManifestRuntime(): string {
  return (
    generatedBanner([
      "Shared registry-manifest types describing generated contracts and their operations.",
    ]) +
    `import type { VerbSemantics } from "./transport.ts";

/** Per-target generation sufficiency verdict (Stage 3). */
export type GenerationVerdict = "SUFFICIENT" | "PARTIAL" | "BLOCKED";

/** Catalog-faithful descriptor of one generated operation. */
export interface OperationManifestEntry {
  readonly operationId: string;
  readonly verbSemantics: VerbSemantics;
  readonly path: string;
  readonly intent: string;
  readonly kind: string;
  readonly pathParameters: readonly string[];
  readonly queryParameters: readonly string[];
  readonly requestBody: "opaque" | "none";
  readonly errorModel: "declared" | "not-declared";
}

/** Per-target generation scope for a contract. */
export interface GenerationScope {
  readonly scope: "skeleton";
  readonly dtos: GenerationVerdict;
  readonly validators: GenerationVerdict;
  readonly clients: GenerationVerdict;
  readonly serverStubs: GenerationVerdict;
}

/** Registry manifest for a single generated contract. */
export interface ContractManifest {
  readonly metaSchemaVersion: string;
  readonly id: string;
  readonly shortId: string;
  readonly title: string;
  readonly version: string;
  readonly domain: string;
  readonly capability: string;
  readonly producer: string;
  readonly dataContract: string;
  readonly payloadFamilies: readonly string[];
  readonly generation: GenerationScope;
  readonly operations: readonly OperationManifestEntry[];
}

/** Aggregate registry of all generated contracts. */
export interface SdkRegistry {
  readonly metaSchemaVersion: string;
  readonly contracts: readonly ContractManifest[];
}
`
  );
}
