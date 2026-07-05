/**
 * Canonical Generator Model — OperationModel
 *
 * TYPE DEFINITIONS ONLY. No generator logic, no runtime values, no I/O.
 *
 * Canonical normalization of a single contract operation. `verbSemantics`, `path`, and
 * `intent` are catalog-verbatim. `kind` is a DERIVED normalization of the catalog's stated
 * verb semantics (documented provenance). Request/responses/errors are OPTIONAL, reference-
 * based, and deferred — never invented.
 *
 * Mirrors: contracts/schema/operation.schema.json (+ request/response/error schemas)
 * Traceability: UCOS-CONTRACT-CAT-001 · UCOS-SVC-ARCH-001 · IC-2.
 */

import type { RequestModel, ParameterModel } from "./RequestModel.ts";
import type { ResponseModel } from "./ResponseModel.ts";
import type { PayloadRef, PlaceholderState } from "./SchemaModel.ts";

/** Catalog verb denoting operation SEMANTICS (safe/unsafe/idempotent), not a transport verb. */
export type VerbSemantics = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * DERIVED classification of an operation, normalized deterministically from VerbSemantics
 * per the catalog reading note. Provenance = derived, not verbatim.
 */
export type OperationKind =
  | "safe-read"
  | "unsafe-create"
  | "unsafe-idempotent"
  | "unsafe-delete";

/** Optional idempotency obligation (absent for API-018/027 operations in the catalog). */
export interface IdempotencyModel {
  readonly requiresIdempotencyKey: boolean;
}

/** Optional cursor-pagination obligation for read collections (concrete params deferred). */
export interface PaginationModel {
  readonly style: "cursor";
  readonly declared: boolean;
}

/**
 * Canonical error model for an operation. `declared` is false when the catalog defines no
 * error model (the API-018/027 case). Individual errors are reference-based.
 */
export interface ErrorConditionModel {
  readonly code: string;
  readonly title?: string;
  readonly description?: string;
  readonly payloadRef?: PayloadRef;
}

export interface ErrorModel {
  readonly declared: boolean;
  readonly placeholder?: PlaceholderState;
  readonly errors?: readonly ErrorConditionModel[];
}

/**
 * Canonical operation model.
 *
 * `operationId` is OPTIONAL: absent in the v1 catalog inventory. When absent, the generator
 * MUST derive it deterministically (documented) rather than invent arbitrary names.
 */
export interface OperationModel {
  readonly operationId?: string;
  readonly verbSemantics: VerbSemantics;
  readonly path: string;
  readonly intent: string;
  readonly kind?: OperationKind;
  readonly parameters?: readonly ParameterModel[];
  readonly request?: RequestModel;
  readonly responses?: readonly ResponseModel[];
  readonly errors?: ErrorModel;
  readonly idempotency?: IdempotencyModel;
  readonly pagination?: PaginationModel;
}
