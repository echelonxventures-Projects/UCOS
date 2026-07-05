/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Produced by @ucos/contract-generator (PHASE 12 — WI-07) from the ratified contract
 * catalog UCOS-CONTRACT-CAT-001. Regenerate with:
 *   node tools/contract-generator/src/cli.ts
 *
 * Request scaffolds for API-018 (Configuration & Metadata API).
 *
 * SCOPE = SKELETON (transport-neutral). Payloads are OPAQUE: field-level schemas are
 * deferred by the catalog (G1: NOT DEFINED IN CATALOG) and MUST NOT be assumed here.
 * Traceability: UCOS-CONTRACT-CAT-001 · IC-2 · UCOS-SVC-ARCH-001 · UCOS-SVC-POLICY-001.
 */
import type { OpaquePayload } from "../_runtime/transport.ts";

/** Request scaffold for getConfigurationByScope (GET /configuration/{scope}). */
export interface GetConfigurationByScopeRequest {
  /** Path parameters (URL segments; concrete types deferred, G4). */
  readonly path: { readonly scope: string };
}

/** Request scaffold for putConfigurationByScopeByKey (PUT /configuration/{scope}/{key}). */
export interface PutConfigurationByScopeByKeyRequest {
  /** Path parameters (URL segments; concrete types deferred, G4). */
  readonly path: { readonly scope: string; readonly key: string };
  /** OPAQUE request body — field-level schema deferred (G1/G2). */
  readonly body: OpaquePayload;
}

/** Request scaffold for getMetadataByClass (GET /metadata/{class}). */
export interface GetMetadataByClassRequest {
  /** Path parameters (URL segments; concrete types deferred, G4). */
  readonly path: { readonly class: string };
}

/** Request scaffold for getFeatureFlagsByContext (GET /feature-flags/{context}). */
export interface GetFeatureFlagsByContextRequest {
  /** Path parameters (URL segments; concrete types deferred, G4). */
  readonly path: { readonly context: string };
}
