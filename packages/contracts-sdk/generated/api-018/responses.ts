/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Produced by @ucos/contract-generator (PHASE 12 — WI-07) from the ratified contract
 * catalog UCOS-CONTRACT-CAT-001. Regenerate with:
 *   node tools/contract-generator/src/cli.ts
 *
 * Response scaffolds for API-018 (Configuration & Metadata API).
 *
 * SCOPE = SKELETON (transport-neutral). Payloads are OPAQUE: field-level schemas are
 * deferred by the catalog (G1: NOT DEFINED IN CATALOG) and MUST NOT be assumed here.
 * Traceability: UCOS-CONTRACT-CAT-001 · IC-2 · UCOS-SVC-ARCH-001 · UCOS-SVC-POLICY-001.
 */
import type { OpaquePayload } from "../_runtime/transport.ts";

/** Response scaffold for getConfigurationByScope. OPAQUE body — field-level schema deferred (G1/G3); outcome/status deferred (Prompt 08). */
export interface GetConfigurationByScopeResponse {
  readonly body: OpaquePayload;
}

/** Response scaffold for putConfigurationByScopeByKey. OPAQUE body — field-level schema deferred (G1/G3); outcome/status deferred (Prompt 08). */
export interface PutConfigurationByScopeByKeyResponse {
  readonly body: OpaquePayload;
}

/** Response scaffold for getMetadataByClass. OPAQUE body — field-level schema deferred (G1/G3); outcome/status deferred (Prompt 08). */
export interface GetMetadataByClassResponse {
  readonly body: OpaquePayload;
}

/** Response scaffold for getFeatureFlagsByContext. OPAQUE body — field-level schema deferred (G1/G3); outcome/status deferred (Prompt 08). */
export interface GetFeatureFlagsByContextResponse {
  readonly body: OpaquePayload;
}
