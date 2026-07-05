/**
 * Canonical Generator Model — ResponseModel
 *
 * TYPE DEFINITIONS ONLY. No generator logic, no runtime values, no I/O.
 *
 * Canonical normalization of an operation's response contract. Body field-level schema is
 * OPTIONAL and reference-based (SchemaModel) — never inlined or invented. `outcome` is a
 * transport-neutral result category, NOT an HTTP status code (transport deferred to Prompt 08).
 *
 * Mirrors: contracts/schema/response.schema.json
 * Traceability: UCOS-CONTRACT-CAT-001 · UCOS-SVC-ARCH-001 · IC-2.
 */

import type { SchemaModel } from "./SchemaModel.ts";

/** Transport-neutral response outcome categories. Extensible additively only. */
export type ResponseOutcome =
  | "success"
  | "accepted"
  | "no-content"
  | "not-found"
  | "conflict"
  | "rejected";

/**
 * Canonical response model.
 *
 * `declared` is false when the catalog defines no concrete response schema (API-018/027 case).
 * `collection` marks a paginated/list response (per the catalog cursor-pagination obligation).
 */
export interface ResponseModel {
  readonly declared: boolean;
  readonly placeholder?: SchemaModel;
  readonly outcome?: ResponseOutcome;
  readonly collection?: boolean;
  readonly bodyRef?: SchemaModel;
}
