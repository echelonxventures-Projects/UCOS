/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Produced by @ucos/contract-generator (PHASE 12 — WI-07) from the ratified contract
 * catalog UCOS-CONTRACT-CAT-001. Regenerate with:
 *   node tools/contract-generator/src/cli.ts
 *
 * Request scaffolds for API-027 (Registry API).
 *
 * SCOPE = SKELETON (transport-neutral). Payloads are OPAQUE: field-level schemas are
 * deferred by the catalog (G1: NOT DEFINED IN CATALOG) and MUST NOT be assumed here.
 * Traceability: UCOS-CONTRACT-CAT-001 · IC-2 · UCOS-SVC-ARCH-001 · UCOS-SVC-POLICY-001.
 */
import type { OpaquePayload } from "../_runtime/transport.ts";

/** Request scaffold for getRegistryArtifacts (GET /registry/artifacts). */
export interface GetRegistryArtifactsRequest {}

/** Request scaffold for postRegistryArtifacts (POST /registry/artifacts). */
export interface PostRegistryArtifactsRequest {
  /** OPAQUE request body — field-level schema deferred (G1/G2). */
  readonly body: OpaquePayload;
}

/** Request scaffold for getRegistryArtifactsById (GET /registry/artifacts/{id}). */
export interface GetRegistryArtifactsByIdRequest {
  /** Path parameters (URL segments; concrete types deferred, G4). */
  readonly path: { readonly id: string };
}

/** Request scaffold for getRegistryDiscovery (GET /registry/discovery). */
export interface GetRegistryDiscoveryRequest {
  /** Declared query parameters (types deferred, G7). */
  readonly query?: { readonly type?: string };
}
