/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Produced by @ucos/contract-generator (PHASE 12 — WI-07) from the ratified contract
 * catalog UCOS-CONTRACT-CAT-001. Regenerate with:
 *   node tools/contract-generator/src/cli.ts
 *
 * Registry manifest for API-027 (Registry API).
 *
 * SCOPE = SKELETON (transport-neutral). Payloads are OPAQUE: field-level schemas are
 * deferred by the catalog (G1: NOT DEFINED IN CATALOG) and MUST NOT be assumed here.
 * Traceability: UCOS-CONTRACT-CAT-001 · IC-2 · UCOS-SVC-ARCH-001 · UCOS-SVC-POLICY-001.
 */
import type { ContractManifest } from "../_runtime/manifest.ts";

/** Catalog-faithful registry manifest for API-027. */
export const api027Manifest: ContractManifest = {
  metaSchemaVersion: "ucos-contract-meta/1.0.0",
  id: "UCOS-API-CONTRACT-027",
  shortId: "API-027",
  title: "Registry API",
  version: "v1.0",
  domain: "DOM-027",
  capability: "CAP-19",
  producer: "UCOS-SVC-027",
  dataContract: "DC-027",
  payloadFamilies: ["RegistryArtifact", "DiscoveryRecord"],
  generation: {
    scope: "skeleton",
    dtos: "BLOCKED",
    validators: "BLOCKED",
    clients: "PARTIAL",
    serverStubs: "PARTIAL",
  },
  operations: [
    {
      operationId: "getRegistryArtifacts",
      verbSemantics: "GET",
      path: "/registry/artifacts",
      intent: "list registered artifacts",
      kind: "safe-read",
      pathParameters: [],
      queryParameters: [],
      requestBody: "none",
      errorModel: "not-declared",
    },
    {
      operationId: "postRegistryArtifacts",
      verbSemantics: "POST",
      path: "/registry/artifacts",
      intent: "register",
      kind: "unsafe-create",
      pathParameters: [],
      queryParameters: [],
      requestBody: "opaque",
      errorModel: "not-declared",
    },
    {
      operationId: "getRegistryArtifactsById",
      verbSemantics: "GET",
      path: "/registry/artifacts/{id}",
      intent: "read a registered artifact",
      kind: "safe-read",
      pathParameters: ["id"],
      queryParameters: [],
      requestBody: "none",
      errorModel: "not-declared",
    },
    {
      operationId: "getRegistryDiscovery",
      verbSemantics: "GET",
      path: "/registry/discovery",
      intent: "discover wiring/services",
      kind: "safe-read",
      pathParameters: [],
      queryParameters: ["type"],
      requestBody: "none",
      errorModel: "not-declared",
    },
  ],
};
