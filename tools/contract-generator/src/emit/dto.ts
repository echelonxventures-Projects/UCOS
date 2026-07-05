/**
 * Contract Skeleton Generator — DTO Emitter (WI-09 WS3).
 *
 * Renders a per-contract `DTODocument` into type-safe, deterministic TypeScript beneath the
 * generated `dto/` subtree. Pure formatter: all naming/resolution already happened in the builder.
 *
 * Output (only for contracts whose Stage-3 DTO verdict is SUFFICIENT):
 *   dto/<slug>/models.ts     — one named interface/type per resolved payload family + dependency.
 *   dto/<slug>/requests.ts   — Request DTO aliases, one per declared payload family.
 *   dto/<slug>/responses.ts  — Response DTO aliases, one per declared payload family.
 *   dto/<slug>/errors.ts     — Error DTO (fail-closed: catalog declares no error model — G5).
 *   dto/<slug>/index.ts      — per-contract DTO barrel.
 *   dto/index.ts             — aggregate DTO barrel across all DTO-SUFFICIENT contracts.
 *
 * Determinism: models are pre-sorted by name; object fields preserve authored order; constraints
 * render as advisory JSDoc (they never alter the emitted TYPE). No timestamps, no environment.
 *
 * NOTE ON REQUEST/RESPONSE: the catalog does NOT bind operations to specific payload families
 * (that binding is deferred — Prompt 05 / Prompt 08). To avoid invention, this emitter provides a
 * typed DTO alias PER PAYLOAD FAMILY for both request and response roles; wiring a family to a
 * specific operation body remains DTO CONTENT GENERATION work (see WI09 report §"Remaining").
 *
 * Traceability: DTOModel.ts · dtoBuilder.ts · GENERATOR-READINESS-GAP-REPORT.md (G1/G5) · IC-2.
 */

import type {
  DTOArrayTypeModel,
  DTOConstraintModel,
  DTODocument,
  DTOEnumTypeModel,
  DTOFieldModel,
  DTOModel,
  DTOObjectTypeModel,
  DTOPrimitiveTypeModel,
  DTOReferenceModel,
  DTOTypeModel,
} from "../../model/DTOModel.ts";
import type { ContractView } from "./view.ts";
import type { EmittedFile } from "../generate.ts";

// ---------------------------------------------------------------------------
// Banner
// ---------------------------------------------------------------------------

/** DTO-specific "do not edit" banner. Unlike the skeleton banner, DTOs are fully TYPED. */
function dtoBanner(lines: readonly string[]): string {
  const body = lines.map((l) => ` * ${l}`).join("\n");
  return [
    "/**",
    " * GENERATED FILE — DO NOT EDIT BY HAND.",
    " *",
    " * Produced by @ucos/contract-generator (PHASE 12 — WI-09 DTO Generator) from resolved",
    " * field-level payload schemas (contracts/field-schemas/, owned by UCOS-PDATA-ARCH-001).",
    " * Regenerate with:  node tools/contract-generator/src/cli.ts generate",
    " *",
    body,
    " *",
    " * SCOPE = TYPED DTO. Emitted ONLY when Stage-3 gates the contract's DTOs to SUFFICIENT",
    " * (every declared payload family resolves completely). No payload shape is invented.",
    " * Traceability: UCOS-CONTRACT-CAT-001 · UCOS-PDATA-ARCH-001 · IC-2 · UCOS-SVC-ARCH-001.",
    " */",
    "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Type rendering
// ---------------------------------------------------------------------------

const PRIMITIVE_TS: Readonly<Record<DTOPrimitiveTypeModel["type"], string>> = {
  string: "string",
  number: "number",
  integer: "number",
  boolean: "boolean",
};

/** Render an enum member literal. */
function enumLiteral(base: DTOEnumTypeModel["base"], value: string | number): string {
  if (base === "string") return JSON.stringify(String(value));
  return String(value);
}

/** Apply nullability to an already-rendered core type, parenthesizing when needed. */
function withNullable(core: string, nullable: boolean): string {
  return nullable ? `${core} | null` : core;
}

/** Render a DTO type node to a TypeScript type expression (single line). */
function renderType(node: DTOTypeModel): string {
  switch (node.kind) {
    case "primitive": {
      const n = node as DTOPrimitiveTypeModel;
      return withNullable(PRIMITIVE_TS[n.type], n.nullable);
    }
    case "enum": {
      const n = node as DTOEnumTypeModel;
      const union = n.values.length === 0 ? "never" : n.values.map((v) => enumLiteral(n.base, v)).join(" | ");
      // A multi-member union must be parenthesized before `| null`.
      const needsParens = n.nullable && n.values.length > 1;
      return withNullable(needsParens ? `(${union})` : union, n.nullable);
    }
    case "array": {
      const n = node as DTOArrayTypeModel;
      const itemCore = renderType(n.items);
      // Parenthesize a union item so `readonly (X | null)[]` binds correctly.
      const item = /[|&]/.test(itemCore) ? `(${itemCore})` : itemCore;
      return withNullable(`readonly ${item}[]`, n.nullable);
    }
    case "object": {
      const n = node as DTOObjectTypeModel;
      const body = renderInlineObject(n);
      return withNullable(body, n.nullable);
    }
    case "reference":
    default: {
      const n = node as DTOReferenceModel;
      return withNullable(n.typeName, n.nullable);
    }
  }
}

/** Render an anonymous inline object type (used for nested, non-top-level objects). */
function renderInlineObject(node: DTOObjectTypeModel): string {
  if (node.fields.length === 0) {
    return node.additionalProperties ? "Record<string, unknown>" : "Record<string, never>";
  }
  const members = node.fields.map((f) => `readonly ${f.name}${f.required ? "" : "?"}: ${renderType(f.type)}`);
  const base = `{ ${members.join("; ")} }`;
  if (node.additionalProperties) {
    return `${base} & Record<string, unknown>`;
  }
  return base;
}

// ---------------------------------------------------------------------------
// Constraint documentation (advisory; never changes the emitted TYPE)
// ---------------------------------------------------------------------------

function constraintDocLines(c: DTOConstraintModel | undefined): readonly string[] {
  if (c === undefined) return [];
  const parts: string[] = [];
  if (c.minLength !== undefined) parts.push(`minLength=${c.minLength}`);
  if (c.maxLength !== undefined) parts.push(`maxLength=${c.maxLength}`);
  if (c.pattern !== undefined) parts.push(`pattern=${c.pattern}`);
  if (c.format !== undefined) parts.push(`format=${c.format}`);
  if (c.minimum !== undefined) parts.push(`minimum=${c.minimum}`);
  if (c.maximum !== undefined) parts.push(`maximum=${c.maximum}`);
  if (c.minItems !== undefined) parts.push(`minItems=${c.minItems}`);
  if (c.maxItems !== undefined) parts.push(`maxItems=${c.maxItems}`);
  if (c.uniqueItems !== undefined) parts.push(`uniqueItems=${c.uniqueItems}`);
  return parts.length > 0 ? [`@constraint ${parts.join(" ")}`] : [];
}

/** Extract advisory constraints from a type node (primitive/array carry them). */
function nodeConstraints(node: DTOTypeModel): DTOConstraintModel | undefined {
  if (node.kind === "primitive") return (node as DTOPrimitiveTypeModel).constraints;
  if (node.kind === "array") return (node as DTOArrayTypeModel).constraints;
  return undefined;
}

/** Render a JSDoc block for a field (description + advisory constraints), or "" when empty. */
function fieldDoc(field: DTOFieldModel, indent: string): string {
  const lines: string[] = [];
  if (field.description !== undefined && field.description.length > 0) lines.push(field.description);
  for (const c of constraintDocLines(nodeConstraints(field.type))) lines.push(c);
  if (lines.length === 0) return "";
  if (lines.length === 1) return `${indent}/** ${lines[0]} */\n`;
  return `${indent}/**\n` + lines.map((l) => `${indent} * ${l}`).join("\n") + `\n${indent} */\n`;
}

// ---------------------------------------------------------------------------
// Model rendering
// ---------------------------------------------------------------------------

/** Render one top-level named DTO. Object roots become interfaces; everything else, type aliases. */
function renderModel(model: DTOModel): string {
  const doc = modelDoc(model);
  const root = model.root;
  if (root.kind === "object" && !root.nullable) {
    const obj = root as DTOObjectTypeModel;
    const fields = obj.fields
      .map((f) => `${fieldDoc(f, "  ")}  readonly ${f.name}${f.required ? "" : "?"}: ${renderType(f.type)};`)
      .join("\n");
    const extra = obj.additionalProperties
      ? "\n  /** additionalProperties=true (open record). */\n  readonly [key: string]: unknown;"
      : "";
    const body = obj.fields.length > 0 || extra.length > 0 ? "\n" + fields + extra + "\n" : "";
    return `${doc}export interface ${model.name} {${body}}`;
  }
  return `${doc}export type ${model.name} = ${renderType(root)};`;
}

function modelDoc(model: DTOModel): string {
  const lines: string[] = [];
  if (model.title !== undefined && model.title.length > 0) lines.push(model.title);
  if (model.description !== undefined && model.description.length > 0) lines.push(model.description);
  lines.push(`Source field schema: ${model.id} (v${model.version}).`);
  if (model.payloadFamily !== undefined) lines.push(`Payload family: ${model.payloadFamily}.`);
  return `/**\n` + lines.map((l) => ` * ${l}`).join("\n") + `\n */\n`;
}

// ---------------------------------------------------------------------------
// File emitters
// ---------------------------------------------------------------------------

function emitModels(view: ContractView, doc: DTODocument): string {
  const shortId = view.model.contract.shortId ?? view.model.contract.id;
  const bodies = doc.models.map(renderModel).join("\n\n");
  return dtoBanner([`Typed DTO models for ${shortId} (${view.model.contract.title}).`]) + bodies + "\n";
}

function emitRequestDtos(view: ContractView, doc: DTODocument): string {
  const shortId = view.model.contract.shortId ?? view.model.contract.id;
  const importLine =
    doc.payloadFamilyTypeNames.length > 0
      ? `import type {\n${doc.payloadFamilyTypeNames.map((n) => `  ${n},`).join("\n")}\n} from "./models.ts";\n\n`
      : "";
  const aliases = doc.payloadFamilyTypeNames
    .map((n) =>
      [
        `/** Request DTO for payload family ${JSON.stringify(n)}. Operation binding deferred (Prompt 08). */`,
        `export type ${n}RequestDTO = ${n};`,
      ].join("\n"),
    )
    .join("\n\n");
  return (
    dtoBanner([`Request DTOs for ${shortId} (${view.model.contract.title}).`]) + importLine + aliases + "\n"
  );
}

function emitResponseDtos(view: ContractView, doc: DTODocument): string {
  const shortId = view.model.contract.shortId ?? view.model.contract.id;
  const importLine =
    doc.payloadFamilyTypeNames.length > 0
      ? `import type {\n${doc.payloadFamilyTypeNames.map((n) => `  ${n},`).join("\n")}\n} from "./models.ts";\n\n`
      : "";
  const aliases = doc.payloadFamilyTypeNames
    .map((n) =>
      [
        `/** Response DTO for payload family ${JSON.stringify(n)}. Operation binding deferred (Prompt 08). */`,
        `export type ${n}ResponseDTO = ${n};`,
      ].join("\n"),
    )
    .join("\n\n");
  return (
    dtoBanner([`Response DTOs for ${shortId} (${view.model.contract.title}).`]) + importLine + aliases + "\n"
  );
}

function emitErrorDtos(view: ContractView, _doc: DTODocument): string {
  const shortId = view.model.contract.shortId ?? view.model.contract.id;
  return (
    dtoBanner([`Error DTO for ${shortId} (${view.model.contract.title}).`]) +
    `/**
 * Error DTO for ${shortId}. FAIL-CLOSED: the contract catalog declares NO error model
 * (G5 / declared:false), and no error-family field schema is registered — so NO error shape is
 * invented here. This alias is a typed placeholder (\`never\`) until an error model is authored
 * and ratified (UCOS-PDATA-ARCH-001 / Prompt 09). Do NOT assume codes or fields.
 */
export type ${view.pascal}ErrorDTO = never;
`
  );
}

const DTO_MODULES: readonly string[] = ["models", "requests", "responses", "errors"];

function emitDtoContractIndex(view: ContractView): string {
  const shortId = view.model.contract.shortId ?? view.model.contract.id;
  const exports = DTO_MODULES.map((m) => `export * from "./${m}.ts";`).join("\n");
  return dtoBanner([`DTO barrel for ${shortId} (${view.model.contract.title}).`]) + exports + "\n";
}

// ---------------------------------------------------------------------------
// Public surface
// ---------------------------------------------------------------------------

/** Emit the per-contract DTO artifact set (files are relative to the generated root). */
export function emitContractDtoFiles(view: ContractView, doc: DTODocument): readonly EmittedFile[] {
  return [
    { relPath: `dto/${view.slug}/models.ts`, content: emitModels(view, doc) },
    { relPath: `dto/${view.slug}/requests.ts`, content: emitRequestDtos(view, doc) },
    { relPath: `dto/${view.slug}/responses.ts`, content: emitResponseDtos(view, doc) },
    { relPath: `dto/${view.slug}/errors.ts`, content: emitErrorDtos(view, doc) },
    { relPath: `dto/${view.slug}/index.ts`, content: emitDtoContractIndex(view) },
  ];
}

/** Emit the aggregate DTO root barrel across every DTO-SUFFICIENT contract (deterministic order). */
export function emitDtoRootIndex(views: readonly ContractView[]): string {
  const slugs = views.map((v) => v.slug).sort();
  const exports = slugs.map((s) => `export * from "./${s}/index.ts";`).join("\n");
  return dtoBanner(["Aggregate DTO root barrel — re-exports every DTO-SUFFICIENT contract."]) + exports + "\n";
}
