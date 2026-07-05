/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Produced by @ucos/contract-generator (PHASE 12 — WI-07) from the ratified contract
 * catalog UCOS-CONTRACT-CAT-001. Regenerate with:
 *   node tools/contract-generator/src/cli.ts
 *
 * Registry manifest for API-018 (Configuration & Metadata API).
 *
 * SCOPE = SKELETON (transport-neutral). Payloads are OPAQUE: field-level schemas are
 * deferred by the catalog (G1: NOT DEFINED IN CATALOG) and MUST NOT be assumed here.
 * Traceability: UCOS-CONTRACT-CAT-001 · IC-2 · UCOS-SVC-ARCH-001 · UCOS-SVC-POLICY-001.
 */
import type { ContractManifest } from "../_runtime/manifest.ts";

/** Catalog-faithful registry manifest for API-018. */
export const api018Manifest: ContractManifest = {
  metaSchemaVersion: "ucos-contract-meta/1.0.0",
  id: "UCOS-API-CONTRACT-018",
  shortId: "API-018",
  title: "Configuration & Metadata API",
  version: "v1.0",
  domain: "DOM-018",
  capability: "CAP-10",
  producer: "UCOS-SVC-018",
  dataContract: "DC-018",
  payloadFamilies: ["ConfigurationValue", "MetadataRecord", "FeatureFlag"],
  generation: {
    scope: "skeleton",
    dtos: "BLOCKED",
    validators: "BLOCKED",
    clients: "PARTIAL",
    serverStubs: "PARTIAL",
  },
  operations: [
    {
      operationId: "getConfigurationByScope",
      verbSemantics: "GET",
      path: "/configuration/{scope}",
      intent: "resolve config/variability",
      kind: "safe-read",
      pathParameters: ["scope"],
      queryParameters: [],
      requestBody: "none",
      errorModel: "not-declared",
    },
    {
      operationId: "putConfigurationByScopeByKey",
      verbSemantics: "PUT",
      path: "/configuration/{scope}/{key}",
      intent: "admin",
      kind: "unsafe-idempotent",
      pathParameters: ["scope", "key"],
      queryParameters: [],
      requestBody: "opaque",
      errorModel: "not-declared",
    },
    {
      operationId: "getMetadataByClass",
      verbSemantics: "GET",
      path: "/metadata/{class}",
      intent: "read MC-01..13",
      kind: "safe-read",
      pathParameters: ["class"],
      queryParameters: [],
      requestBody: "none",
      errorModel: "not-declared",
    },
    {
      operationId: "getFeatureFlagsByContext",
      verbSemantics: "GET",
      path: "/feature-flags/{context}",
      intent: "resolve feature flags for context",
      kind: "safe-read",
      pathParameters: ["context"],
      queryParameters: [],
      requestBody: "none",
      errorModel: "not-declared",
    },
  ],
};
