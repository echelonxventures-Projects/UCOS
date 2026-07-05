/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Produced by @ucos/contract-generator (PHASE 12 — WI-07) from the ratified contract
 * catalog UCOS-CONTRACT-CAT-001. Regenerate with:
 *   node tools/contract-generator/src/cli.ts
 *
 * Operation client for API-027 (Registry API).
 * Clients verdict: PARTIAL (skeleton; opaque payloads, injected transport).
 *
 * SCOPE = SKELETON (transport-neutral). Payloads are OPAQUE: field-level schemas are
 * deferred by the catalog (G1: NOT DEFINED IN CATALOG) and MUST NOT be assumed here.
 * Traceability: UCOS-CONTRACT-CAT-001 · IC-2 · UCOS-SVC-ARCH-001 · UCOS-SVC-POLICY-001.
 */
import type { OpaquePayload, TransportPort } from "../_runtime/transport.ts";
import type {
  GetRegistryArtifactsRequest,
  PostRegistryArtifactsRequest,
  GetRegistryArtifactsByIdRequest,
  GetRegistryDiscoveryRequest,
} from "./requests.ts";

/** Client for API-027. One method per operation; payloads are opaque (skeleton scope). */
export interface Api027Client {
  /** GET /registry/artifacts — list registered artifacts. */
  getRegistryArtifacts(request: GetRegistryArtifactsRequest): Promise<OpaquePayload>;
  /** POST /registry/artifacts — register. */
  postRegistryArtifacts(request: PostRegistryArtifactsRequest): Promise<OpaquePayload>;
  /** GET /registry/artifacts/{id} — read a registered artifact. */
  getRegistryArtifactsById(request: GetRegistryArtifactsByIdRequest): Promise<OpaquePayload>;
  /** GET /registry/discovery — discover wiring/services. */
  getRegistryDiscovery(request: GetRegistryDiscoveryRequest): Promise<OpaquePayload>;
}

/** Build a API-027 client bound to an injected transport (no host/protocol assumed). */
export function createApi027Client(transport: TransportPort): Api027Client {
  return {
    getRegistryArtifacts(request) {
      return transport.send({
        operationId: "getRegistryArtifacts",
        verbSemantics: "GET",
        path: "/registry/artifacts",
        pathParameters: {},
      });
    },
    postRegistryArtifacts(request) {
      return transport.send({
        operationId: "postRegistryArtifacts",
        verbSemantics: "POST",
        path: "/registry/artifacts",
        pathParameters: {},
        body: request.body,
      });
    },
    getRegistryArtifactsById(request) {
      return transport.send({
        operationId: "getRegistryArtifactsById",
        verbSemantics: "GET",
        path: "/registry/artifacts/" + encodeURIComponent(request.path.id),
        pathParameters: { id: request.path.id },
      });
    },
    getRegistryDiscovery(request) {
      const queryParameters: Record<string, string> = {};
      if (request.query?.type !== undefined) { queryParameters.type = request.query.type; }
      return transport.send({
        operationId: "getRegistryDiscovery",
        verbSemantics: "GET",
        path: "/registry/discovery",
        pathParameters: {},
        queryParameters,
      });
    },
  };
}
