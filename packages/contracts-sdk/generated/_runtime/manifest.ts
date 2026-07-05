/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Produced by @ucos/contract-generator (PHASE 12 — WI-07) from the ratified contract
 * catalog UCOS-CONTRACT-CAT-001. Regenerate with:
 *   node tools/contract-generator/src/cli.ts
 *
 * Shared registry-manifest types describing generated contracts and their operations.
 *
 * SCOPE = SKELETON (transport-neutral). Payloads are OPAQUE: field-level schemas are
 * deferred by the catalog (G1: NOT DEFINED IN CATALOG) and MUST NOT be assumed here.
 * Traceability: UCOS-CONTRACT-CAT-001 · IC-2 · UCOS-SVC-ARCH-001 · UCOS-SVC-POLICY-001.
 */
import type { VerbSemantics } from "./transport.ts";

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
