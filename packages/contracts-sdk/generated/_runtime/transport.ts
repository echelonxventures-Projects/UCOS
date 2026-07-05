/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Produced by @ucos/contract-generator (PHASE 12 — WI-07) from the ratified contract
 * catalog UCOS-CONTRACT-CAT-001. Regenerate with:
 *   node tools/contract-generator/src/cli.ts
 *
 * Shared transport-neutral runtime types for all generated contract clients.
 * No host, protocol, serialization, or framework is assumed (deferred to Prompt 08).
 *
 * SCOPE = SKELETON (transport-neutral). Payloads are OPAQUE: field-level schemas are
 * deferred by the catalog (G1: NOT DEFINED IN CATALOG) and MUST NOT be assumed here.
 * Traceability: UCOS-CONTRACT-CAT-001 · IC-2 · UCOS-SVC-ARCH-001 · UCOS-SVC-POLICY-001.
 */
/** Catalog-verbatim operation verb semantics (safe/unsafe/idempotent), not a chosen transport verb. */
export type VerbSemantics = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * OPAQUE payload. The contract catalog defers all field-level payload schemas
 * (G1: NOT DEFINED IN CATALOG; Prompt 05 / UCOS-PDATA-ARCH-001). Do NOT assume a shape;
 * a later generation pass replaces this with typed DTOs once the data architecture defines them.
 */
export type OpaquePayload = unknown;

/** Transport-neutral request envelope handed to the injected TransportPort. */
export interface TransportRequest {
  readonly operationId: string;
  readonly verbSemantics: VerbSemantics;
  readonly path: string;
  readonly pathParameters: Readonly<Record<string, string>>;
  readonly queryParameters?: Readonly<Record<string, string>>;
  readonly body?: OpaquePayload;
}

/** Injected transport. The SDK never binds a concrete transport; callers provide one. */
export interface TransportPort {
  send(request: TransportRequest): Promise<OpaquePayload>;
}
