/**
 * Canonical Generator Model — RequestModel
 *
 * TYPE DEFINITIONS ONLY. No generator logic, no runtime values, no I/O.
 *
 * Canonical normalization of an operation's request contract. Body/parameter field-level
 * schemas are OPTIONAL and reference-based (SchemaModel) — never inlined or invented,
 * because UCOS-CONTRACT-CAT-001 defines no field-level request schemas.
 *
 * Mirrors: contracts/schema/request.schema.json, operation.schema.json ($defs.parameter)
 * Traceability: UCOS-CONTRACT-CAT-001 · UCOS-SVC-ARCH-001 · IC-2.
 */

import type { SchemaModel } from "./SchemaModel.ts";

/** Where a parameter is carried. Transport-neutral categories only. */
export type ParameterLocation = "path" | "query" | "header";

/**
 * A path/query/header parameter surfaced from the catalog path template.
 * Its TYPE (schemaRef) is deferred unless the data architecture defines it.
 */
export interface ParameterModel {
  readonly name: string;
  readonly in: ParameterLocation;
  readonly required?: boolean;
  readonly schemaRef?: SchemaModel;
}

/**
 * Canonical request model.
 *
 * `declared` is false when the catalog defines no concrete request schema (the API-018/027
 * case). `bodyRef` is a maybe-defined SchemaModel; `placeholder` records the deferral reason.
 */
export interface RequestModel {
  readonly declared: boolean;
  readonly placeholder?: SchemaModel;
  readonly pathParameters?: readonly ParameterModel[];
  readonly queryParameters?: readonly ParameterModel[];
  readonly bodyRef?: SchemaModel;
}
