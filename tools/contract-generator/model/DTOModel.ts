/**
 * Canonical Generator Model — DTOModel (WI-09)
 *
 * TYPE DEFINITIONS ONLY. No generator logic, no runtime values, no I/O.
 *
 * The canonical, deterministic, registry-driven, versioned representation of a TYPED DATA-TRANSFER
 * OBJECT. A DTO is the shape into which a resolved FIELD-LEVEL payload schema
 * (model/FieldSchemaModel.ts, owned by UCOS-PDATA-ARCH-001 / Prompt 05) is lowered before the
 * emitter renders type-safe TypeScript. WI-09 defines the ENGINE only: it authors no business
 * payload. With the shipped (empty) field-schema registry no DTO is ever built, so WI-07/WI-08
 * output regenerates byte-identically.
 *
 * Relationship to FieldSchemaModel:
 *   FieldSchemaModel  = the AUTHORED, catalog-bound INPUT shape (what the data architect writes).
 *   DTOModel          = the LOWERED, name-resolved OUTPUT shape (what the emitter renders).
 * The builder (src/dto/dtoBuilder.ts) is the pure, total function between them. References are
 * resolved to concrete DTO type names at build time, so the emitter stays a pure formatter.
 *
 * Design constraints (WI-09 WS1):
 *   Deterministic        — a model is pure data; the builder is a pure function of the registry.
 *   Versioned            — every model carries `dtoModelVersion` + the source definition `version`.
 *   Registry Driven      — models are built from resolved registry definitions, never hard-coded.
 *   Backward Compatible  — additive-only; the shipped empty registry emits nothing (WI-07 parity).
 *
 * Supported type kinds: primitive · object · array · enum · reference. Nullability and a
 * transport-neutral constraint set are carried through on every applicable node (constraints are
 * advisory metadata that parameterize a LATER validator pass; they do not alter the emitted type).
 *
 * Traceability: UCOS-CONTRACT-CAT-001 · UCOS-PDATA-ARCH-001 · UCOS-SVC-ARCH-001 · IC-2.
 */

/** Semantic version tag of the DTO meta-model family. Bumped additively only. */
export type DTOModelVersion = "ucos-dto/1.0.0";

/** Primitive scalar types. Transport-neutral: no wire encoding is implied. */
export type DTOPrimitiveType =
  | "string"
  | "number"
  | "integer"
  | "boolean";

/** The discriminator for a DTO type node. */
export type DTOTypeKind =
  | "primitive"
  | "object"
  | "array"
  | "enum"
  | "reference";

/**
 * Transport-neutral constraint set carried verbatim from the source field schema. Every member is
 * OPTIONAL and advisory: constraints DO NOT change the emitted TypeScript type; they are recorded
 * so a later validator-generation pass can parameterize runtime checks. Mirror of FieldConstraints.
 */
export interface DTOConstraintModel {
  /** String: inclusive minimum length. */
  readonly minLength?: number;
  /** String: inclusive maximum length. */
  readonly maxLength?: number;
  /** String: ECMA-262 regular-expression source (no flags). */
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

/** Fields common to every DTO type node. */
interface DTOTypeNodeBase {
  readonly kind: DTOTypeKind;
  /** When true, the value may be null in addition to its declared type (emitted as `| null`). */
  readonly nullable: boolean;
  /** Human-facing description carried verbatim from the source schema. */
  readonly description?: string;
}

/** A scalar leaf. */
export interface DTOPrimitiveTypeModel extends DTOTypeNodeBase {
  readonly kind: "primitive";
  readonly type: DTOPrimitiveType;
  readonly constraints?: DTOConstraintModel;
}

/** A closed set of literal values. `base` is the underlying scalar type of every value. */
export interface DTOEnumTypeModel extends DTOTypeNodeBase {
  readonly kind: "enum";
  readonly base: "string" | "integer" | "number";
  readonly values: readonly (string | number)[];
}

/** An ordered collection whose elements share one type node. */
export interface DTOArrayTypeModel extends DTOTypeNodeBase {
  readonly kind: "array";
  readonly items: DTOTypeModel;
  readonly constraints?: DTOConstraintModel;
}

/** A structured record. `additionalProperties` defaults to false (closed) when omitted. */
export interface DTOObjectTypeModel extends DTOTypeNodeBase {
  readonly kind: "object";
  readonly fields: readonly DTOFieldModel[];
  readonly additionalProperties: boolean;
}

/**
 * A resolved reference to another named DTO. The builder has already resolved the source
 * field-schema `ref` (a registry id) to the concrete emitted `typeName`, so the emitter renders
 * `typeName` directly. `ref` (the registry id) and optional `version` are retained for traceability.
 */
export interface DTOReferenceModel extends DTOTypeNodeBase {
  readonly kind: "reference";
  /** Registry id of the referenced source field-schema definition. */
  readonly ref: string;
  /** Concrete emitted DTO type name the reference resolves to (build-time resolved). */
  readonly typeName: string;
  /** Optional exact version of the referenced definition. */
  readonly version?: string;
}

/** The recursive union of all DTO type nodes. */
export type DTOTypeModel =
  | DTOPrimitiveTypeModel
  | DTOEnumTypeModel
  | DTOArrayTypeModel
  | DTOObjectTypeModel
  | DTOReferenceModel;

/** One field (property) of an object DTO. */
export interface DTOFieldModel {
  /** Property name, carried verbatim from the source object property. */
  readonly name: string;
  /** The field's type node. */
  readonly type: DTOTypeModel;
  /** true when the property must be present (emitted without `?`). */
  readonly required: boolean;
  /** Human-facing description carried verbatim from the source property schema. */
  readonly description?: string;
}

/**
 * A named, top-level DTO — the unit of emission. Built from exactly one resolved field-schema
 * definition (a payload family or one of its transitive dependencies). `name` is the deterministic,
 * unique TypeScript identifier the emitter renders (`export interface <name>` for object roots,
 * `export type <name>` otherwise). `dependencies` are the registry ids this DTO references.
 */
export interface DTOModel {
  readonly dtoModelVersion: DTOModelVersion;
  /** Registry id of the source field-schema definition, e.g. "UCOS-DATA-CONTRACT-018/ConfigurationValue". */
  readonly id: string;
  /** Source definition version (e.g. "1.0.0"). */
  readonly version: string;
  /** Deterministic, unique emitted DTO type name (PascalCase). */
  readonly name: string;
  /** Bound catalog payload family, when the source definition declared one. */
  readonly payloadFamily?: string;
  /** Owning data contract id, when the source definition declared one. */
  readonly dataContract?: string;
  readonly title?: string;
  readonly description?: string;
  /** The root type node of this DTO (usually `object`, but any kind is permitted). */
  readonly root: DTOTypeModel;
  /** Registry ids this DTO references (direct, sorted, deduplicated). */
  readonly dependencies: readonly string[];
}

/**
 * A per-contract DTO document: every named DTO required to type the contract's resolved payload
 * families (the families plus their transitive dependencies), in deterministic order (by `name`).
 * Emitted only when Stage-3 gates the contract's DTOs to SUFFICIENT.
 */
export interface DTODocument {
  readonly dtoModelVersion: DTOModelVersion;
  /** Contract short id this document belongs to (e.g. "API-018"). */
  readonly contractShortId: string;
  /** The DTO type names that back the contract's DECLARED payload families (subset of `models`). */
  readonly payloadFamilyTypeNames: readonly string[];
  /** All named DTOs (families + transitive dependencies), deterministically ordered by `name`. */
  readonly models: readonly DTOModel[];
}
