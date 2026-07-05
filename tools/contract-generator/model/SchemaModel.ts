/**
 * Canonical Generator Model — SchemaModel
 *
 * TYPE DEFINITIONS ONLY. No generator logic, no runtime values, no I/O.
 *
 * SchemaModel is the leaf reference type shared by request/response/error/payload models.
 * It NEVER inlines a fabricated field-level schema. The UCOS contract catalog
 * (UCOS-CONTRACT-CAT-001) is boundary-level: payloads reference PDE and LDO data entities
 * whose field schemas are owned by the data architecture (UCOS-PDATA-ARCH-001, Prompt 05)
 * and whose wire form is deferred (Prompt 08). Until those exist, a schema is represented
 * as an explicit PlaceholderState — never invented.
 *
 * Mirrors: contracts/schema/contract.schema.json ($defs.payloadRef, placeholderState)
 *          contracts/schema/operation.schema.json ($defs.schemaRef)
 * Traceability: UCOS-CONTRACT-CAT-001 · UCOS-SVC-ARCH-001 · IC-2.
 */

/** Version tag of the canonical contract meta-model family. Bumped additively only. */
export type MetaSchemaVersion = "ucos-contract-meta/1.0.0";

/**
 * The ONLY permitted non-concrete states. A generator MUST treat any of these as
 * "not defined" and MUST NOT substitute an invented value.
 */
export type PlaceholderState =
  | "NOT DEFINED IN CATALOG"
  | "PENDING ASR RATIFICATION"
  | "FLAGGED FOR PROMPT 09";

/** A traceable UCOS artifact identifier (e.g. "UCOS-DATA-CONTRACT-018", "DOM-018"). */
export type ArtifactId = string;

/**
 * Opaque reference to a canonical schema node. Points at a payload family / data entity
 * once the data architecture defines it; carries no field-level structure itself.
 */
export interface SchemaRef {
  readonly ref: string;
}

/**
 * A schema slot: either a concrete reference (once defined) or an explicit placeholder.
 * This union is the canonical "maybe-defined schema" used throughout the model.
 */
export type SchemaModel = SchemaRef | PlaceholderState;

/**
 * Reference to a payload family WITHOUT redefining its field-level schema.
 * Faithful to the catalog: family name + owning data contract + a maybe-defined schema.
 */
export interface PayloadRef {
  readonly family: string;
  readonly dataContract?: ArtifactId;
  readonly fieldLevelSchema: SchemaModel;
}

/** Narrowing helper type: true schema references vs. deferred placeholders. */
export type IsPlaceholder<T extends SchemaModel> = T extends PlaceholderState ? true : false;
