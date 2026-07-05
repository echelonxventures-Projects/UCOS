/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Produced by @ucos/contract-generator (PHASE 12 — WI-07) from the ratified contract
 * catalog UCOS-CONTRACT-CAT-001. Regenerate with:
 *   node tools/contract-generator/src/cli.ts
 *
 * Operation client for API-018 (Configuration & Metadata API).
 * Clients verdict: PARTIAL (skeleton; opaque payloads, injected transport).
 *
 * SCOPE = SKELETON (transport-neutral). Payloads are OPAQUE: field-level schemas are
 * deferred by the catalog (G1: NOT DEFINED IN CATALOG) and MUST NOT be assumed here.
 * Traceability: UCOS-CONTRACT-CAT-001 · IC-2 · UCOS-SVC-ARCH-001 · UCOS-SVC-POLICY-001.
 */
import type { OpaquePayload, TransportPort } from "../_runtime/transport.ts";
import type {
  GetConfigurationByScopeRequest,
  PutConfigurationByScopeByKeyRequest,
  GetMetadataByClassRequest,
  GetFeatureFlagsByContextRequest,
} from "./requests.ts";

/** Client for API-018. One method per operation; payloads are opaque (skeleton scope). */
export interface Api018Client {
  /** GET /configuration/{scope} — resolve config/variability. */
  getConfigurationByScope(request: GetConfigurationByScopeRequest): Promise<OpaquePayload>;
  /** PUT /configuration/{scope}/{key} — admin. */
  putConfigurationByScopeByKey(request: PutConfigurationByScopeByKeyRequest): Promise<OpaquePayload>;
  /** GET /metadata/{class} — read MC-01..13. */
  getMetadataByClass(request: GetMetadataByClassRequest): Promise<OpaquePayload>;
  /** GET /feature-flags/{context} — resolve feature flags for context. */
  getFeatureFlagsByContext(request: GetFeatureFlagsByContextRequest): Promise<OpaquePayload>;
}

/** Build a API-018 client bound to an injected transport (no host/protocol assumed). */
export function createApi018Client(transport: TransportPort): Api018Client {
  return {
    getConfigurationByScope(request) {
      return transport.send({
        operationId: "getConfigurationByScope",
        verbSemantics: "GET",
        path: "/configuration/" + encodeURIComponent(request.path.scope),
        pathParameters: { scope: request.path.scope },
      });
    },
    putConfigurationByScopeByKey(request) {
      return transport.send({
        operationId: "putConfigurationByScopeByKey",
        verbSemantics: "PUT",
        path: "/configuration/" + encodeURIComponent(request.path.scope) + "/" + encodeURIComponent(request.path.key),
        pathParameters: { scope: request.path.scope, key: request.path.key },
        body: request.body,
      });
    },
    getMetadataByClass(request) {
      return transport.send({
        operationId: "getMetadataByClass",
        verbSemantics: "GET",
        path: "/metadata/" + encodeURIComponent(request.path.class),
        pathParameters: { class: request.path.class },
      });
    },
    getFeatureFlagsByContext(request) {
      return transport.send({
        operationId: "getFeatureFlagsByContext",
        verbSemantics: "GET",
        path: "/feature-flags/" + encodeURIComponent(request.path.context),
        pathParameters: { context: request.path.context },
      });
    },
  };
}
