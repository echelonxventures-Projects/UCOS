/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Produced by @ucos/contract-generator (PHASE 12 — WI-07) from the ratified contract
 * catalog UCOS-CONTRACT-CAT-001. Regenerate with:
 *   node tools/contract-generator/src/cli.ts
 *
 * TypeScript interfaces for API-027 (Registry API).
 *
 * SCOPE = SKELETON (transport-neutral). Payloads are OPAQUE: field-level schemas are
 * deferred by the catalog (G1: NOT DEFINED IN CATALOG) and MUST NOT be assumed here.
 * Traceability: UCOS-CONTRACT-CAT-001 · IC-2 · UCOS-SVC-ARCH-001 · UCOS-SVC-POLICY-001.
 */
import type { OpaquePayload, VerbSemantics } from "../_runtime/transport.ts";

/** Canonical operation ids for API-027 (derived deterministically from verb + path; G6). */
export type Api027OperationId =
  | "getRegistryArtifacts"
  | "postRegistryArtifacts"
  | "getRegistryArtifactsById"
  | "getRegistryDiscovery";

/** Boundary-level descriptor of one API-027 operation (catalog-faithful metadata). */
export interface Api027OperationDescriptor {
  readonly operationId: Api027OperationId;
  readonly verbSemantics: VerbSemantics;
  readonly path: string;
  readonly intent: string;
  readonly kind: string;
  readonly pathParameters: readonly string[];
  readonly queryParameters: readonly string[];
}

/** Contract-level metadata for API-027. */
export interface Api027ContractMetadata {
  readonly id: string;
  readonly shortId: string;
  readonly title: string;
  readonly version: string;
  readonly domain: string;
  readonly capability: string;
}

/** OPAQUE payload family "RegistryArtifact" — field-level schema deferred (G1: NOT DEFINED IN CATALOG). */
export type RegistryArtifact = OpaquePayload;

/** OPAQUE payload family "DiscoveryRecord" — field-level schema deferred (G1: NOT DEFINED IN CATALOG). */
export type DiscoveryRecord = OpaquePayload;
