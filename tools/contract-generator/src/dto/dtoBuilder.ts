/**
 * Contract Skeleton Generator — DTO Builder (WI-09 WS2).
 *
 * The pure, total, deterministic function from RESOLVED field-schema definitions to lowered
 * DTO models. It performs NO I/O and holds NO business logic: every DTO shape is derived
 * mechanically from the field-schema registry. References are resolved to concrete DTO type
 * names here (build time) so the emitter stays a pure formatter.
 *
 * The builder is invoked ONLY for a contract whose Stage-3 DTO verdict is SUFFICIENT (every
 * declared payload family resolves completely). With the shipped empty registry it is never
 * invoked, so WI-07/WI-08 output regenerates byte-identically.
 *
 * Naming (deterministic + unique): each definition's preferred name is PascalCase of its bound
 * payload family (or, absent that, the last '/'-segment of its id). Definitions are processed in
 * sorted-id order; a collision appends the smallest numeric suffix that keeps names unique. Because
 * the input set and its ordering are deterministic, the assigned names are deterministic too.
 *
 * Traceability: FieldSchemaModel.ts · DTOModel.ts · UCOS-PDATA-ARCH-001 · UCOS-CONTRACT-CAT-001 · IC-2.
 */

import { pascalCase } from "../normalize/deriveOperationId.ts";
import type { FieldSchemaRegistry } from "../registry/fieldSchemaRegistry.ts";
import type { ContractModel } from "../../model/ContractModel.ts";
import type {
  ArrayFieldSchema,
  EnumFieldSchema,
  FieldConstraints,
  FieldSchemaDefinition,
  FieldSchemaNode,
  ObjectFieldSchema,
  PrimitiveFieldSchema,
  ReferenceFieldSchema,
} from "../../model/FieldSchemaModel.ts";
import type {
  DTOArrayTypeModel,
  DTOConstraintModel,
  DTODocument,
  DTOEnumTypeModel,
  DTOFieldModel,
  DTOModel,
  DTOModelVersion,
  DTOObjectTypeModel,
  DTOPrimitiveTypeModel,
  DTOReferenceModel,
  DTOTypeModel,
} from "../../model/DTOModel.ts";

const DTO_MODEL_VERSION: DTOModelVersion = "ucos-dto/1.0.0";

/** A declared payload family plus its owning data contract (for registry resolution). */
export interface FamilyBinding {
  readonly family: string;
  readonly dataContract?: string;
}

// ---------------------------------------------------------------------------
// Name derivation + allocation (deterministic, unique)
// ---------------------------------------------------------------------------

/** Ensure a token is a legal TypeScript identifier start (prefix with `T` when it begins with a digit). */
function safeIdentifier(name: string): string {
  if (name.length === 0) return "Dto";
  return /^[0-9]/.test(name) ? `T${name}` : name;
}

/** Preferred (pre-collision) DTO type name for a definition. */
function preferredName(def: FieldSchemaDefinition): string {
  const source = def.payloadFamily ?? def.id.split("/").pop() ?? def.id;
  return safeIdentifier(pascalCase(source));
}

/**
 * Allocate a deterministic, unique DTO type name for every definition id.
 * `defsById` MUST be iterated in sorted-id order for determinism (callers pass a sorted list).
 */
function allocateNames(defs: readonly FieldSchemaDefinition[]): ReadonlyMap<string, string> {
  const byId = new Map<string, string>();
  const used = new Set<string>();
  for (const def of defs) {
    const base = preferredName(def);
    let name = base;
    let n = 2;
    while (used.has(name)) {
      name = `${base}${n}`;
      n += 1;
    }
    used.add(name);
    byId.set(def.id, name);
  }
  return byId;
}

// ---------------------------------------------------------------------------
// Constraint + node lowering
// ---------------------------------------------------------------------------

/** Copy only the defined constraint members (deterministic; undefined ⇒ omitted). */
function lowerConstraints(c: FieldConstraints | undefined): DTOConstraintModel | undefined {
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

/** Lower one field-schema node to a DTO type node. Pure; references resolved via `nameOf`. */
function lowerNode(node: FieldSchemaNode, nameOf: (id: string) => string): DTOTypeModel {
  const nullable = node.nullable ?? false;
  const description = node.description;
  switch (node.kind) {
    case "primitive": {
      const src = node as PrimitiveFieldSchema;
      const constraints = lowerConstraints(src.constraints);
      const out: DTOPrimitiveTypeModel = {
        kind: "primitive",
        type: src.type,
        nullable,
        ...(description !== undefined ? { description } : {}),
        ...(constraints !== undefined ? { constraints } : {}),
      };
      return out;
    }
    case "enum": {
      const src = node as EnumFieldSchema;
      const out: DTOEnumTypeModel = {
        kind: "enum",
        base: src.base,
        values: [...src.values],
        nullable,
        ...(description !== undefined ? { description } : {}),
      };
      return out;
    }
    case "array": {
      const src = node as ArrayFieldSchema;
      const constraints = lowerConstraints(src.constraints);
      const out: DTOArrayTypeModel = {
        kind: "array",
        items: lowerNode(src.items, nameOf),
        nullable,
        ...(description !== undefined ? { description } : {}),
        ...(constraints !== undefined ? { constraints } : {}),
      };
      return out;
    }
    case "object": {
      const src = node as ObjectFieldSchema;
      const fields: DTOFieldModel[] = src.properties.map((p): DTOFieldModel => ({
        name: p.name,
        type: lowerNode(p.schema, nameOf),
        required: p.required,
        ...(p.schema.description !== undefined ? { description: p.schema.description } : {}),
      }));
      const out: DTOObjectTypeModel = {
        kind: "object",
        fields,
        additionalProperties: src.additionalProperties ?? false,
        nullable,
        ...(description !== undefined ? { description } : {}),
      };
      return out;
    }
    case "reference":
    default: {
      const src = node as ReferenceFieldSchema;
      const out: DTOReferenceModel = {
        kind: "reference",
        ref: src.ref,
        typeName: nameOf(src.ref),
        ...(src.version !== undefined ? { version: src.version } : {}),
        nullable,
        ...(description !== undefined ? { description } : {}),
      };
      return out;
    }
  }
}

/** Collect the direct reference ids used anywhere within a node tree (sorted, unique). */
function directRefs(node: FieldSchemaNode): readonly string[] {
  const out = new Set<string>();
  const walk = (n: FieldSchemaNode): void => {
    switch (n.kind) {
      case "reference":
        out.add(n.ref);
        return;
      case "array":
        walk(n.items);
        return;
      case "object":
        for (const p of n.properties) walk(p.schema);
        return;
      default:
        return;
    }
  };
  walk(node);
  return [...out].sort();
}

/** Build a single named DTO model from one resolved definition. */
function buildModel(def: FieldSchemaDefinition, nameOf: (id: string) => string): DTOModel {
  return {
    dtoModelVersion: DTO_MODEL_VERSION,
    id: def.id,
    version: def.version,
    name: nameOf(def.id),
    ...(def.payloadFamily !== undefined ? { payloadFamily: def.payloadFamily } : {}),
    ...(def.dataContract !== undefined ? { dataContract: def.dataContract } : {}),
    ...(def.title !== undefined ? { title: def.title } : {}),
    ...(def.description !== undefined ? { description: def.description } : {}),
    root: lowerNode(def.schema, nameOf),
    dependencies: directRefs(def.schema),
  };
}

// ---------------------------------------------------------------------------
// Document construction
// ---------------------------------------------------------------------------

/**
 * Build the complete DTO document for a contract from its declared payload families.
 *
 * Fail-closed: returns `null` when the contract declares NO families, or when ANY family (or a
 * transitive dependency) fails to resolve completely. Callers must gate on Stage-3 SUFFICIENT, so
 * a `null` here indicates a genuine gating violation and MUST suppress all DTO emission.
 */
export function buildContractDTOs(
  contractShortId: string,
  families: readonly FamilyBinding[],
  registry: FieldSchemaRegistry,
): DTODocument | null {
  if (families.length === 0) return null;

  // 1) Resolve every declared family + gather the transitive closure of definition ids.
  const familyDefIds: string[] = [];
  const allIds = new Set<string>();
  for (const { family, dataContract } of families) {
    const def = registry.resolvePayloadFamily(family, dataContract);
    if (!def) return null; // gating violation — fail closed
    const dep = registry.resolveDependencies(def.id, def.version);
    if (!dep.ok) return null; // incomplete dependencies — fail closed
    familyDefIds.push(def.id);
    allIds.add(def.id);
    for (const depId of dep.resolved) allIds.add(depId);
  }

  // 2) Resolve every id to a definition (deterministic, sorted by id).
  const defs: FieldSchemaDefinition[] = [];
  for (const id of [...allIds].sort()) {
    const def = registry.resolve(id);
    if (!def) return null; // closure member vanished — fail closed
    defs.push(def);
  }

  // 3) Allocate deterministic, unique names, then build one DTO model per definition.
  const names = allocateNames(defs);
  const nameOf = (id: string): string => names.get(id) ?? safeIdentifier(pascalCase(id.split("/").pop() ?? id));
  const models = defs
    .map((def) => buildModel(def, nameOf))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  // 4) Payload-family type names in declared order (deduplicated).
  const familyTypeNames: string[] = [];
  const seen = new Set<string>();
  for (const id of familyDefIds) {
    const name = nameOf(id);
    if (!seen.has(name)) {
      seen.add(name);
      familyTypeNames.push(name);
    }
  }

  return {
    dtoModelVersion: DTO_MODEL_VERSION,
    contractShortId,
    payloadFamilyTypeNames: familyTypeNames,
    models,
  };
}

/** Convenience: derive the family bindings from a contract model. */
export function familyBindingsOf(model: ContractModel): readonly FamilyBinding[] {
  const detail = model.contract.dataContractDetail;
  const families = detail?.payloadFamilies ?? [];
  const dataContract = detail?.id;
  return families.map((family): FamilyBinding =>
    dataContract !== undefined ? { family, dataContract } : { family });
}
