/**
 * Canonical Generator Model — FieldSchemaModel (WI-08)
 *
 * TYPE DEFINITIONS ONLY. No generator logic, no runtime values, no I/O.
 *
 * The canonical, registry-driven, versioned representation of a FIELD-LEVEL payload schema.
 * This is the shape into which any authored field schema (owned by UCOS-PDATA-ARCH-001 /
 * Prompt 05) is normalized before the generator may lift a payload from OPAQUE to typed.
 *
 * WI-08 defines the FRAMEWORK only. It does NOT author any business payload: the UCOS contract
 * catalog remains boundary-level, and no `FieldSchemaDefinition` for any real payload family is
 * shipped by this work item. The registry (contracts/field-schemas/) is empty by design, so the
 * generator's sufficiency verdicts remain BLOCKED/PARTIAL and WI-07 output regenerates identically.
 *
 * Design constraints (WI-08 WS2):
 *   Registry Driven      — schemas are discovered from a registry, never referenced directly.
 *   Deterministic        — a definition is pure data; normalization/resolution is a pure function.
 *   Versioned            — every definition carries a `version`; multiple versions may coexist.
 *   Backward Compatible  — additive-only; unknown fields fail closed at Stage-1 validation.
 *
 * Supported node kinds: primitive · object · array · enum · reference. Nullability and a
 * transport-neutral constraint set are supported on every applicable node.
 *
 * Mirrors: contracts/schema/field-schema.schema.json
 * Traceability: UCOS-CONTRACT-CAT-001 · UCOS-PDATA-ARCH-001 · UCOS-SVC-ARCH-001 · IC-2.
 */

import type { ArtifactId } from "./SchemaModel.ts";

/** Semantic version tag of the field-schema meta-model family. Bumped additively only. */
export type FieldSchemaModelVersion = "ucos-field-schema/1.0.0";

/** Primitive scalar types. Transport-neutral: no wire encoding is implied. */
export type PrimitiveType =
  | "string"
  | "number"
  | "integer"
  | "boolean";

/** The discriminator for a field-schema node. */
export type FieldSchemaKind =
  | "primitive"
  | "object"
  | "array"
  | "enum"
  | "reference";

/**
 * Transport-neutral constraint set. Every member is OPTIONAL and additive. Constraints carry
 * no business meaning by themselves; they parameterize validator generation once schemas exist.
 */
export interface FieldConstraints {
  /** String: inclusive minimum length. */
  readonly minLength?: number;
  /** String: inclusive maximum length. */
  readonly maxLength?: number;
  /** String: ECMA-262 regular-expression source (validated as a pattern, no flags). */
  readonly pattern?: string;
  /** String: named semantic format hint (e.g. "uuid", "date-time"). Advisory only. */
  readonly format?: string;
  /** Number/integer: inclusive minimum. */
  readonly minimum?: number;
  /** Number/integer: inclusive maximum. */
  readonly maximum?: number;
  /** Array: inclusive minimum item count. */
  readonly minItems?: number;
  /** Array: inclusive maximum item count. */
  readonly maxItems?: number;
  /** Array: whether items must be unique. */
  readonly uniqueItems?: boolean;
}

/** Fields common to every node kind. */
interface FieldSchemaNodeBase {
  readonly kind: FieldSchemaKind;
  /** When true, the value may be null in addition to its declared type. */
  readonly nullable?: boolean;
  /** Human-facing description carried verbatim from the authored schema. */
  readonly description?: string;
}

/** A scalar leaf. */
export interface PrimitiveFieldSchema extends FieldSchemaNodeBase {
  readonly kind: "primitive";
  readonly type: PrimitiveType;
  readonly constraints?: FieldConstraints;
}

/** A closed set of literal values. `base` is the underlying scalar type of every value. */
export interface EnumFieldSchema extends FieldSchemaNodeBase {
  readonly kind: "enum";
  readonly base: "string" | "integer" | "number";
  readonly values: readonly (string | number)[];
}

/** An ordered collection whose elements share one node schema. */
export interface ArrayFieldSchema extends FieldSchemaNodeBase {
  readonly kind: "array";
  readonly items: FieldSchemaNode;
  readonly constraints?: FieldConstraints;
}

/** One property of an object node. */
export interface ObjectPropertySchema {
  readonly name: string;
  readonly schema: FieldSchemaNode;
  /** true when the property must be present. */
  readonly required: boolean;
}

/** A structured record. `additionalProperties` defaults to false (closed) when omitted. */
export interface ObjectFieldSchema extends FieldSchemaNodeBase {
  readonly kind: "object";
  readonly properties: readonly ObjectPropertySchema[];
  readonly additionalProperties?: boolean;
}

/**
 * A reference to another registered field-schema definition, by its registry `id`
 * (with optional `version`). Enables reuse and dependency composition WITHOUT inlining.
 */
export interface ReferenceFieldSchema extends FieldSchemaNodeBase {
  readonly kind: "reference";
  /** Registry id of the referenced definition. */
  readonly ref: string;
  /** Optional exact version; when omitted the registry resolves the highest available. */
  readonly version?: string;
}

/** The recursive union of all node kinds. */
export type FieldSchemaNode =
  | PrimitiveFieldSchema
  | EnumFieldSchema
  | ArrayFieldSchema
  | ObjectFieldSchema
  | ReferenceFieldSchema;

/**
 * A registered field-schema definition. `id` is the unique, deterministic registry key.
 * `payloadFamily` + `dataContract` provide the BINDING back to a catalog payload family so the
 * sufficiency engine can resolve a contract's families to concrete schemas — registry-driven,
 * never hard-coded in generator logic.
 */
export interface FieldSchemaDefinition {
  readonly fieldSchemaModelVersion: FieldSchemaModelVersion;
  /** Unique registry id, e.g. "UCOS-DATA-CONTRACT-018/ConfigurationValue". */
  readonly id: string;
  /** Definition version (e.g. "1.0.0"). Multiple versions of one id may coexist. */
  readonly version: string;
  /** Bound payload family name (e.g. "ConfigurationValue"). */
  readonly payloadFamily?: string;
  /** Owning data contract id (e.g. "UCOS-DATA-CONTRACT-018"). */
  readonly dataContract?: ArtifactId;
  readonly title?: string;
  readonly description?: string;
  /** The root node of this definition's schema. */
  readonly schema: FieldSchemaNode;
}

/** Narrowing guard alias: a node that composes children (object/array/reference). */
export type CompositeFieldSchema = ObjectFieldSchema | ArrayFieldSchema | ReferenceFieldSchema;
