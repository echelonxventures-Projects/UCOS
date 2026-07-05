/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Produced by @ucos/contract-generator (PHASE 12 — WI-07) from the ratified contract
 * catalog UCOS-CONTRACT-CAT-001. Regenerate with:
 *   node tools/contract-generator/src/cli.ts
 *
 * TypeScript interfaces for API-018 (Configuration & Metadata API).
 *
 * SCOPE = SKELETON (transport-neutral). Payloads are OPAQUE: field-level schemas are
 * deferred by the catalog (G1: NOT DEFINED IN CATALOG) and MUST NOT be assumed here.
 * Traceability: UCOS-CONTRACT-CAT-001 · IC-2 · UCOS-SVC-ARCH-001 · UCOS-SVC-POLICY-001.
 */
import type { OpaquePayload, VerbSemantics } from "../_runtime/transport.ts";

/** Canonical operation ids for API-018 (derived deterministically from verb + path; G6). */
export type Api018OperationId =
  | "getConfigurationByScope"
  | "putConfigurationByScopeByKey"
  | "getMetadataByClass"
  | "getFeatureFlagsByContext";

/** Boundary-level descriptor of one API-018 operation (catalog-faithful metadata). */
export interface Api018OperationDescriptor {
  readonly operationId: Api018OperationId;
  readonly verbSemantics: VerbSemantics;
  readonly path: string;
  readonly intent: string;
  readonly kind: string;
  readonly pathParameters: readonly string[];
  readonly queryParameters: readonly string[];
}

/** Contract-level metadata for API-018. */
export interface Api018ContractMetadata {
  readonly id: string;
  readonly shortId: string;
  readonly title: string;
  readonly version: string;
  readonly domain: string;
  readonly capability: string;
}

/** OPAQUE payload family "ConfigurationValue" — field-level schema deferred (G1: NOT DEFINED IN CATALOG). */
export type ConfigurationValue = OpaquePayload;

/** OPAQUE payload family "MetadataRecord" — field-level schema deferred (G1: NOT DEFINED IN CATALOG). */
export type MetadataRecord = OpaquePayload;

/** OPAQUE payload family "FeatureFlag" — field-level schema deferred (G1: NOT DEFINED IN CATALOG). */
export type FeatureFlag = OpaquePayload;
