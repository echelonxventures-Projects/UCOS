/**
 * Canonical Generator Model — ValidatorModel (WI-10)
 *
 * TYPE DEFINITIONS ONLY. No generator logic, no runtime values, no I/O.
 *
 * The canonical, deterministic, registry-derived representation of a RUNTIME VALIDATOR. A validator
 * is the executable check into which a resolved FIELD-LEVEL payload schema
 * (model/FieldSchemaModel.ts, owned by UCOS-PDATA-ARCH-001 / Prompt 05) is lowered so the emitter
 * can render deterministic, dependency-free TypeScript validation functions. WI-10 defines the
 * ENGINE only: it authors no business payload and encodes no business rule. With the shipped
 * (empty) field-schema registry no validator is ever built, so WI-07/WI-08/WI-09 output regenerates
 * byte-identically.
 *
 * Relationship to DTOModel:
 *   DTOModel        = the LOWERED TYPE shape the emitter renders (`interface`/`type`).
 *   ValidatorModel  = the LOWERED CHECK shape the emitter renders (a `validate<Name>` function).
 * Both are projections of the SAME resolved field-schema closure. To guarantee they can never
 * disagree, the validator builder derives the ValidatorDocument from the canonical DTODocument
 * (src/dto/dtoBuilder.ts) — identical model set, identical names, identical dependency order.
 * References therefore carry the same build-time-resolved `typeName` the DTO layer assigned, so
 * the emitter can dispatch to a sibling validator by name and stay a pure formatter.
 *
 * Design constraints (WI-10 WS1):
 *   Deterministic        — a model is pure data; the builder is a pure function of the registry.
 *   Versioned            — every document carries `validatorModelVersion` + source `version`.
 *   Registry Driven      — models are built from resolved registry definitions, never hard-coded.
 *   Backward Compatible  — additive-only; the shipped empty registry emits nothing (WI-09 parity).
 *   Zero Business Logic  — only STRUCTURAL constraints are carried (see ValidatorConstraintModel).
 *
 * Supported node kinds: primitive · object · array · enum · reference. Nullability and a
 * transport-neutral structural constraint set are carried through on every applicable node.
 *
 * Traceability: FieldSchemaModel.ts · DTOModel.ts · UCOS-PDATA-ARCH-001 · UCOS-CONTRACT-CAT-001 · IC-2.
 */

/** Semantic version tag of the validator meta-model family. Bumped additively only. */
export type ValidatorModelVersion = "ucos-validator/1.0.0";

/** Primitive scalar types validated at runtime. Transport-neutral: no wire encoding is implied. */
export type ValidatorPrimitiveType =
  | "string"
  | "number"
  | "integer"
  | "boolean";

/** The discriminator for a validator node. */
export type ValidatorNodeKind =
  | "primitive"
  | "object"
  | "array"
  | "enum"
  | "reference";

/**
 * Structural constraint set carried verbatim from the source field schema. Every member is
 * OPTIONAL. These are the ONLY constraints the generated validator ENFORCES; each is a purely
 * structural predicate (length/bounds/count/regex/uniqueness) that carries NO business meaning.
 * `format` is intentionally advisory-only (not enforced): it is a named semantic hint whose
 * meaning is owned by the data architecture, so enforcing it here would invent semantics.
 * Mirror of FieldConstraints / DTOConstraintModel.
 */
export interface ValidatorConstraintModel {
  /** String: inclusive minimum length. ENFORCED. */
  readonly minLength?: number;
  /** String: inclusive maximum length. ENFORCED. */
  readonly maxLength?: number;
  /** String: ECMA-262 regular-expression source (no flags). ENFORCED. */
  readonly pattern?: string;
  /** String: named semantic format hint (e.g. "uuid"). ADVISORY ONLY — recorded, not enforced. */
  readonly format?: string;
  /** Number/integer: inclusive minimum. ENFORCED. */
  readonly minimum?: number;
  /** Number/integer: inclusive maximum. ENFORCED. */
  readonly maximum?: number;
  /** Array: inclusive minimum item count. ENFORCED. */
  readonly minItems?: number;
  /** Array: inclusive maximum item count. ENFORCED. */
  readonly maxItems?: number;
  /** Array: whether items must be unique (deep structural equality). ENFORCED. */
  readonly uniqueItems?: boolean;
}

/** Fields common to every validator node. */
interface ValidatorNodeBase {
  readonly kind: ValidatorNodeKind;
  /** When true, `null` is accepted in addition to the declared type. */
  readonly nullable: boolean;
}

/** A scalar leaf check. */
export interface ValidatorPrimitiveNode extends ValidatorNodeBase {
  readonly kind: "primitive";
  readonly type: ValidatorPrimitiveType;
  readonly constraints?: ValidatorConstraintModel;
}

/** A closed-set membership check. `base` is the underlying scalar type of every value. */
export interface ValidatorEnumNode extends ValidatorNodeBase {
  readonly kind: "enum";
  readonly base: "string" | "integer" | "number";
  readonly values: readonly (string | number)[];
}

/** An ordered-collection check whose elements share one node. */
export interface ValidatorArrayNode extends ValidatorNodeBase {
  readonly kind: "array";
  readonly items: ValidatorNode;
  readonly constraints?: ValidatorConstraintModel;
}

/** A structured-record check. `additionalProperties` false ⇒ unknown keys are rejected. */
export interface ValidatorObjectNode extends ValidatorNodeBase {
  readonly kind: "object";
  readonly fields: readonly ValidatorFieldNode[];
  readonly additionalProperties: boolean;
}

/**
 * A resolved reference to another named validator. `typeName` is the build-time-resolved sibling
 * validator name (identical to the DTO type name) the emitter dispatches to. `ref` (registry id)
 * is retained for traceability.
 */
export interface ValidatorReferenceNode extends ValidatorNodeBase {
  readonly kind: "reference";
  /** Registry id of the referenced source field-schema definition. */
  readonly ref: string;
  /** Concrete emitted validator/DTO name the reference resolves to (build-time resolved). */
  readonly typeName: string;
  /** Optional exact version of the referenced definition. */
  readonly version?: string;
}

/** The recursive union of all validator nodes. */
export type ValidatorNode =
  | ValidatorPrimitiveNode
  | ValidatorEnumNode
  | ValidatorArrayNode
  | ValidatorObjectNode
  | ValidatorReferenceNode;

/** One field (property) of an object validator. */
export interface ValidatorFieldNode {
  /** Property name, carried verbatim from the source object property. */
  readonly name: string;
  /** The field's validator node. */
  readonly node: ValidatorNode;
  /** true when the property must be present. */
  readonly required: boolean;
}

/**
 * A named, top-level validator — the unit of emission. Built from exactly one resolved
 * field-schema definition (a payload family or one of its transitive dependencies). `name` is the
 * deterministic, unique identifier shared with the DTO layer; the emitter renders
 * `export function validate<name>(value: unknown): ValidationResult`. `dependencies` are the
 * registry ids this validator references.
 */
export interface ValidatorModel {
  readonly validatorModelVersion: ValidatorModelVersion;
  /** Registry id of the source field-schema definition. */
  readonly id: string;
  /** Source definition version (e.g. "1.0.0"). */
  readonly version: string;
  /** Deterministic, unique validator name (PascalCase; identical to the DTO type name). */
  readonly name: string;
  /** Bound catalog payload family, when the source definition declared one. */
  readonly payloadFamily?: string;
  /** Owning data contract id, when the source definition declared one. */
  readonly dataContract?: string;
  /** The root node of this validator. */
  readonly root: ValidatorNode;
  /** Registry ids this validator references (direct, sorted, deduplicated). */
  readonly dependencies: readonly string[];
}

/**
 * A per-contract validator document: every named validator required to check the contract's
 * resolved payload families (the families plus their transitive dependencies), in deterministic
 * order (by `name`). Emitted only when Stage-3 gates the contract's validators to SUFFICIENT.
 */
export interface ValidatorDocument {
  readonly validatorModelVersion: ValidatorModelVersion;
  /** Contract short id this document belongs to (e.g. "API-018"). */
  readonly contractShortId: string;
  /** The validator names that back the contract's DECLARED payload families (subset of `validators`). */
  readonly payloadFamilyTypeNames: readonly string[];
  /** All named validators (families + transitive dependencies), deterministically ordered by `name`. */
  readonly validators: readonly ValidatorModel[];
}
