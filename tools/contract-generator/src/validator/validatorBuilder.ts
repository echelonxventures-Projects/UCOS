/**
 * Contract Skeleton Generator — Validator Builder (WI-10 WS2).
 *
 * The pure, total, deterministic function from RESOLVED field-schema definitions to lowered
 * validator models. It performs NO I/O and holds NO business logic.
 *
 * Parity by construction: the validator document is DERIVED from the canonical `DTODocument`
 * produced by src/dto/dtoBuilder.ts. That builder already performs — against the Field-Schema
 * Registry — payload-family resolution, transitive dependency resolution, cycle protection, and
 * fail-closed gating (returning `null` on any missing reference / cycle / incomplete family).
 * Reusing it guarantees validators and DTOs share IDENTICAL model sets, names, dependency order,
 * and fail-closed behavior, and can never drift apart. The mapping below is a pure structural
 * projection (DTO type node → validator node); it introduces no new resolution and no invention.
 *
 * The builder is invoked ONLY for a contract whose Stage-3 validators verdict is SUFFICIENT (which
 * holds exactly when the DTOs verdict is SUFFICIENT). With the shipped empty registry it is never
 * invoked, so WI-07/WI-08/WI-09 output regenerates byte-identically.
 *
 * Traceability: ValidatorModel.ts · DTOModel.ts · dtoBuilder.ts · UCOS-PDATA-ARCH-001 · IC-2.
 */

import { buildContractDTOs, familyBindingsOf } from "../dto/dtoBuilder.ts";
import type { FamilyBinding } from "../dto/dtoBuilder.ts";
import type { FieldSchemaRegistry } from "../registry/fieldSchemaRegistry.ts";
import type { ContractModel } from "../../model/ContractModel.ts";
import type {
  DTOArrayTypeModel,
  DTOConstraintModel,
  DTODocument,
  DTOEnumTypeModel,
  DTOModel,
  DTOObjectTypeModel,
  DTOPrimitiveTypeModel,
  DTOReferenceModel,
  DTOTypeModel,
} from "../../model/DTOModel.ts";
import type {
  ValidatorArrayNode,
  ValidatorConstraintModel,
  ValidatorDocument,
  ValidatorEnumNode,
  ValidatorFieldNode,
  ValidatorModel,
  ValidatorModelVersion,
  ValidatorObjectNode,
  ValidatorPrimitiveNode,
  ValidatorReferenceNode,
  ValidatorNode,
} from "../../model/ValidatorModel.ts";

const VALIDATOR_MODEL_VERSION: ValidatorModelVersion = "ucos-validator/1.0.0";

// Re-export the shared binding type so callers can build validators without importing the DTO layer.
export type { FamilyBinding } from "../dto/dtoBuilder.ts";

// ---------------------------------------------------------------------------
// Constraint + node projection (pure; DTO node → validator node)
// ---------------------------------------------------------------------------

/** Copy only the defined constraint members (deterministic; undefined ⇒ omitted). */
function projectConstraints(c: DTOConstraintModel | undefined): ValidatorConstraintModel | undefined {
  if (c === undefined) return undefined;
  const out: {
    minLength?: number; maxLength?: number; pattern?: string; format?: string;
    minimum?: number; maximum?: number; minItems?: number; maxItems?: number; uniqueItems?: boolean;
  } = {};
  if (c.minLength !== undefined) out.minLength = c.minLength;
  if (c.maxLength !== undefined) out.maxLength = c.maxLength;
  if (c.pattern !== undefined) out.pattern = c.pattern;
  if (c.format !== undefined) out.format = c.format;
  if (c.minimum !== undefined) out.minimum = c.minimum;
  if (c.maximum !== undefined) out.maximum = c.maximum;
  if (c.minItems !== undefined) out.minItems = c.minItems;
  if (c.maxItems !== undefined) out.maxItems = c.maxItems;
  if (c.uniqueItems !== undefined) out.uniqueItems = c.uniqueItems;
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Project one DTO type node to a validator node. Pure; references keep their resolved typeName. */
function projectNode(node: DTOTypeModel): ValidatorNode {
  switch (node.kind) {
    case "primitive": {
      const src = node as DTOPrimitiveTypeModel;
      const constraints = projectConstraints(src.constraints);
      const out: ValidatorPrimitiveNode = {
        kind: "primitive",
        type: src.type,
        nullable: src.nullable,
        ...(constraints !== undefined ? { constraints } : {}),
      };
      return out;
    }
    case "enum": {
      const src = node as DTOEnumTypeModel;
      const out: ValidatorEnumNode = {
        kind: "enum",
        base: src.base,
        values: [...src.values],
        nullable: src.nullable,
      };
      return out;
    }
    case "array": {
      const src = node as DTOArrayTypeModel;
      const constraints = projectConstraints(src.constraints);
      const out: ValidatorArrayNode = {
        kind: "array",
        items: projectNode(src.items),
        nullable: src.nullable,
        ...(constraints !== undefined ? { constraints } : {}),
      };
      return out;
    }
    case "object": {
      const src = node as DTOObjectTypeModel;
      const fields: ValidatorFieldNode[] = src.fields.map((f): ValidatorFieldNode => ({
        name: f.name,
        node: projectNode(f.type),
        required: f.required,
      }));
      const out: ValidatorObjectNode = {
        kind: "object",
        fields,
        additionalProperties: src.additionalProperties,
        nullable: src.nullable,
      };
      return out;
    }
    case "reference":
    default: {
      const src = node as DTOReferenceModel;
      const out: ValidatorReferenceNode = {
        kind: "reference",
        ref: src.ref,
        typeName: src.typeName,
        ...(src.version !== undefined ? { version: src.version } : {}),
        nullable: src.nullable,
      };
      return out;
    }
  }
}

/** Project one resolved DTO model into a validator model. Pure. */
function projectModel(model: DTOModel): ValidatorModel {
  return {
    validatorModelVersion: VALIDATOR_MODEL_VERSION,
    id: model.id,
    version: model.version,
    name: model.name,
    ...(model.payloadFamily !== undefined ? { payloadFamily: model.payloadFamily } : {}),
    ...(model.dataContract !== undefined ? { dataContract: model.dataContract } : {}),
    root: projectNode(model.root),
    dependencies: [...model.dependencies],
  };
}

// ---------------------------------------------------------------------------
// Document construction
// ---------------------------------------------------------------------------

/**
 * Pure projection of a resolved `DTODocument` into a `ValidatorDocument`. Preserves model set,
 * names, ordering, and payload-family type names exactly — validators and DTOs cannot diverge.
 */
export function validatorsFromDtoDocument(doc: DTODocument): ValidatorDocument {
  return {
    validatorModelVersion: VALIDATOR_MODEL_VERSION,
    contractShortId: doc.contractShortId,
    payloadFamilyTypeNames: [...doc.payloadFamilyTypeNames],
    validators: doc.models.map(projectModel),
  };
}

/**
 * Build the complete validator document for a contract from its declared payload families.
 *
 * Fail-closed: returns `null` whenever the underlying DTO resolution fails closed — i.e. the
 * contract declares NO families, or ANY family (or a transitive dependency) fails to resolve, or a
 * dependency cycle is present. Callers must gate on Stage-3 SUFFICIENT; a `null` here indicates a
 * genuine gating violation and MUST suppress all validator emission.
 */
export function buildContractValidators(
  contractShortId: string,
  families: readonly FamilyBinding[],
  registry: FieldSchemaRegistry,
): ValidatorDocument | null {
  const doc = buildContractDTOs(contractShortId, families, registry);
  if (doc === null) return null; // inherit DTO builder's fail-closed guarantees
  return validatorsFromDtoDocument(doc);
}

/** Convenience: derive the family bindings from a contract model (mirrors the DTO layer). */
export function validatorFamilyBindingsOf(model: ContractModel): readonly FamilyBinding[] {
  return familyBindingsOf(model);
}
