/**
 * Contract Skeleton Generator — Validator Emitter (WI-10 WS3).
 *
 * Renders a per-contract `ValidatorDocument` into deterministic, dependency-free TypeScript runtime
 * validators beneath the generated `validators/` subtree. Pure formatter: all naming/resolution
 * already happened in the builder (validators mirror the DTO layer exactly).
 *
 * Output (only for contracts whose Stage-3 validators verdict is SUFFICIENT):
 *   validators/_runtime.ts       — shared, contract-agnostic validation kernel (types + primitives).
 *   validators/<slug>/models.ts  — one `validate<Name>(value): ValidationResult` per resolved
 *                                  payload family + transitive dependency.
 *   validators/<slug>/requests.ts   — Request validator aliases, one per declared payload family.
 *   validators/<slug>/responses.ts  — Response validator aliases, one per declared payload family.
 *   validators/<slug>/errors.ts     — Error validator (fail-closed: catalog declares no error model).
 *   validators/<slug>/index.ts      — per-contract validator barrel.
 *   validators/index.ts             — aggregate validator barrel across all validator-SUFFICIENT contracts.
 *
 * Determinism: models are pre-sorted by name; object fields preserve authored order; temp-variable
 * names are assigned by a per-function counter in traversal order; constraint object literals use a
 * fixed key order. No timestamps, no environment, no randomness.
 *
 * Enforcement scope: validators enforce STRUCTURAL constraints only (type, nullability, required,
 * enum membership, additionalProperties, minLength/maxLength/pattern, minimum/maximum, minItems/
 * maxItems/uniqueItems). `format` is advisory and NOT enforced (its meaning is owned by the data
 * architecture — enforcing it would invent semantics). No business rule is encoded.
 *
 * Traceability: ValidatorModel.ts · validatorBuilder.ts · DTOModel.ts · GENERATOR-READINESS-GAP-REPORT.md · IC-2.
 */

import type {
  ValidatorArrayNode,
  ValidatorConstraintModel,
  ValidatorDocument,
  ValidatorEnumNode,
  ValidatorModel,
  ValidatorObjectNode,
  ValidatorPrimitiveNode,
  ValidatorReferenceNode,
  ValidatorNode,
} from "../../model/ValidatorModel.ts";
import type { ContractView } from "./view.ts";
import type { EmittedFile } from "../generate.ts";

// ---------------------------------------------------------------------------
// Banner
// ---------------------------------------------------------------------------

function validatorBanner(lines: readonly string[]): string {
  const body = lines.map((l) => ` * ${l}`).join("\n");
  return [
    "/**",
    " * GENERATED FILE — DO NOT EDIT BY HAND.",
    " *",
    " * Produced by @ucos/contract-generator (PHASE 12 — WI-10 Validator Generator) from resolved",
    " * field-level payload schemas (contracts/field-schemas/, owned by UCOS-PDATA-ARCH-001).",
    " * Regenerate with:  node tools/contract-generator/src/cli.ts generate",
    " *",
    body,
    " *",
    " * SCOPE = RUNTIME VALIDATOR. Emitted ONLY when Stage-3 gates the contract's validators to",
    " * SUFFICIENT (every declared payload family resolves completely). Enforces STRUCTURAL",
    " * constraints only; no business rule is encoded. Traceability: UCOS-CONTRACT-CAT-001 ·",
    " * UCOS-PDATA-ARCH-001 · IC-2 · UCOS-SVC-ARCH-001.",
    " */",
    "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Shared runtime kernel — validators/_runtime.ts
// ---------------------------------------------------------------------------

/**
 * Emit the shared, contract-agnostic validation kernel. Zero dependencies, deterministic, and
 * self-contained. Generated per-model validators call into these primitives; structural recursion
 * (objects/arrays/references) is emitted inline by the model renderer.
 */
export function emitValidatorRuntime(): string {
  return (
    validatorBanner([
      "Shared validation kernel for all generated contract validators.",
      "Pure, dependency-free structural checks. No business semantics.",
    ]) +
    `/** A single structural validation issue. \`path\` is a "$"-rooted dotted/indexed location. */
export interface ValidationIssue {
  readonly path: string;
  readonly code: string;
  readonly message: string;
}

/** The result of validating a value: valid iff no issues were recorded. */
export interface ValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ValidationIssue[];
}

/**
 * A validator for a value expected to conform to type \`T\`. \`T\` is documentary (phantom): it ties
 * a validator to the DTO type it checks without affecting the runtime signature.
 */
export type Validator<T> = (value: unknown) => ValidationResult;

/** Internal mutable issue accumulator used by generated validators. */
export interface Ctx {
  readonly issues: ValidationIssue[];
}

/** Create a fresh accumulator. */
export function ctx(): Ctx {
  return { issues: [] };
}

/** Record one issue. */
export function add(c: Ctx, path: string, code: string, message: string): void {
  c.issues.push({ path, code, message });
}

/** Finalize an accumulator into an immutable result. */
export function done(c: Ctx): ValidationResult {
  return { valid: c.issues.length === 0, issues: c.issues };
}

/** True when the value is a non-null, non-array object. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Enforceable string constraints (structural only). */
export interface StringChecks {
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string;
}

export function checkString(c: Ctx, path: string, value: unknown, checks?: StringChecks): void {
  if (typeof value !== "string") {
    add(c, path, "type", "expected string");
    return;
  }
  if (checks === undefined) return;
  if (checks.minLength !== undefined && value.length < checks.minLength) {
    add(c, path, "minLength", "expected length >= " + checks.minLength);
  }
  if (checks.maxLength !== undefined && value.length > checks.maxLength) {
    add(c, path, "maxLength", "expected length <= " + checks.maxLength);
  }
  if (checks.pattern !== undefined && !new RegExp(checks.pattern).test(value)) {
    add(c, path, "pattern", "expected match for pattern " + checks.pattern);
  }
}

/** Enforceable number/integer constraints (structural only). */
export interface NumberChecks {
  readonly integer?: boolean;
  readonly minimum?: number;
  readonly maximum?: number;
}

export function checkNumber(c: Ctx, path: string, value: unknown, checks?: NumberChecks): void {
  if (typeof value !== "number" || Number.isNaN(value)) {
    add(c, path, "type", "expected number");
    return;
  }
  if (checks === undefined) return;
  if (checks.integer === true && !Number.isInteger(value)) {
    add(c, path, "type", "expected integer");
  }
  if (checks.minimum !== undefined && value < checks.minimum) {
    add(c, path, "minimum", "expected value >= " + checks.minimum);
  }
  if (checks.maximum !== undefined && value > checks.maximum) {
    add(c, path, "maximum", "expected value <= " + checks.maximum);
  }
}

export function checkBoolean(c: Ctx, path: string, value: unknown): void {
  if (typeof value !== "boolean") {
    add(c, path, "type", "expected boolean");
  }
}

export function checkEnum(
  c: Ctx,
  path: string,
  value: unknown,
  values: readonly (string | number)[],
): void {
  for (const v of values) {
    if (v === value) return;
  }
  add(c, path, "enum", "expected one of " + JSON.stringify(values));
}

/** Enforceable array constraints (structural only). */
export interface ArrayChecks {
  readonly minItems?: number;
  readonly maxItems?: number;
  readonly uniqueItems?: boolean;
}

/**
 * Type-check the value as an array and enforce array-level constraints. Returns the array for
 * item iteration, or \`null\` when the value is not an array (a type issue is recorded).
 */
export function checkArray(
  c: Ctx,
  path: string,
  value: unknown,
  checks?: ArrayChecks,
): readonly unknown[] | null {
  if (!Array.isArray(value)) {
    add(c, path, "type", "expected array");
    return null;
  }
  const items: readonly unknown[] = value;
  if (checks !== undefined) {
    if (checks.minItems !== undefined && items.length < checks.minItems) {
      add(c, path, "minItems", "expected item count >= " + checks.minItems);
    }
    if (checks.maxItems !== undefined && items.length > checks.maxItems) {
      add(c, path, "maxItems", "expected item count <= " + checks.maxItems);
    }
    if (checks.uniqueItems === true) {
      const seen = new Set<string>();
      for (let i = 0; i < items.length; i += 1) {
        const key = String(JSON.stringify(items[i]));
        if (seen.has(key)) {
          add(c, path + "[" + i + "]", "uniqueItems", "expected unique items");
        } else {
          seen.add(key);
        }
      }
    }
  }
  return items;
}
`
  );
}

// ---------------------------------------------------------------------------
// Per-model code generation
// ---------------------------------------------------------------------------

interface EmitState {
  readonly out: string[];
  counter: number;
}

function line(s: EmitState, indent: number, text: string): void {
  s.out.push("  ".repeat(indent) + text);
}

function fresh(s: EmitState): string {
  const id = `t${s.counter}`;
  s.counter += 1;
  return id;
}

/** JS expression appending a static suffix to a path expression. */
function pathChild(pathExpr: string, suffix: string): string {
  return `${pathExpr} + ${JSON.stringify(suffix)}`;
}

/** Build the string-check object-literal argument, or "" to omit it. */
function stringChecksArg(c: ValidatorConstraintModel | undefined): string {
  if (c === undefined) return "";
  const parts: string[] = [];
  if (c.minLength !== undefined) parts.push(`minLength: ${c.minLength}`);
  if (c.maxLength !== undefined) parts.push(`maxLength: ${c.maxLength}`);
  if (c.pattern !== undefined) parts.push(`pattern: ${JSON.stringify(c.pattern)}`);
  return parts.length > 0 ? `, { ${parts.join(", ")} }` : "";
}

/** Build the number-check object-literal argument, or "" to omit it. */
function numberChecksArg(node: ValidatorPrimitiveNode): string {
  const parts: string[] = [];
  if (node.type === "integer") parts.push("integer: true");
  const c = node.constraints;
  if (c?.minimum !== undefined) parts.push(`minimum: ${c.minimum}`);
  if (c?.maximum !== undefined) parts.push(`maximum: ${c.maximum}`);
  return parts.length > 0 ? `, { ${parts.join(", ")} }` : "";
}

/** Build the array-check object-literal argument, or "" to omit it. */
function arrayChecksArg(c: ValidatorConstraintModel | undefined): string {
  if (c === undefined) return "";
  const parts: string[] = [];
  if (c.minItems !== undefined) parts.push(`minItems: ${c.minItems}`);
  if (c.maxItems !== undefined) parts.push(`maxItems: ${c.maxItems}`);
  if (c.uniqueItems !== undefined) parts.push(`uniqueItems: ${c.uniqueItems}`);
  return parts.length > 0 ? `, { ${parts.join(", ")} }` : "";
}

/** Emit statements validating `valueExpr` against `node` at `pathExpr`, handling nullability. */
function emitNode(
  s: EmitState,
  indent: number,
  node: ValidatorNode,
  valueExpr: string,
  pathExpr: string,
): void {
  if (node.nullable) {
    const v = fresh(s);
    line(s, indent, `const ${v} = ${valueExpr};`);
    line(s, indent, `if (${v} !== null) {`);
    emitCore(s, indent + 1, node, v, pathExpr);
    line(s, indent, `}`);
    return;
  }
  emitCore(s, indent, node, valueExpr, pathExpr);
}

/** Emit the type-specific validation (nullability already handled by emitNode). */
function emitCore(
  s: EmitState,
  indent: number,
  node: ValidatorNode,
  valueExpr: string,
  pathExpr: string,
): void {
  switch (node.kind) {
    case "primitive": {
      const n = node as ValidatorPrimitiveNode;
      if (n.type === "string") {
        line(s, indent, `checkString(c, ${pathExpr}, ${valueExpr}${stringChecksArg(n.constraints)});`);
      } else if (n.type === "boolean") {
        line(s, indent, `checkBoolean(c, ${pathExpr}, ${valueExpr});`);
      } else {
        line(s, indent, `checkNumber(c, ${pathExpr}, ${valueExpr}${numberChecksArg(n)});`);
      }
      return;
    }
    case "enum": {
      const n = node as ValidatorEnumNode;
      line(s, indent, `checkEnum(c, ${pathExpr}, ${valueExpr}, ${JSON.stringify(n.values)});`);
      return;
    }
    case "reference": {
      const n = node as ValidatorReferenceNode;
      line(s, indent, `validate${n.typeName}Into(c, ${pathExpr}, ${valueExpr});`);
      return;
    }
    case "array": {
      const n = node as ValidatorArrayNode;
      const arr = fresh(s);
      const idx = fresh(s);
      const item = fresh(s);
      line(s, indent, `const ${arr} = checkArray(c, ${pathExpr}, ${valueExpr}${arrayChecksArg(n.constraints)});`);
      line(s, indent, `if (${arr} !== null) {`);
      line(s, indent + 1, `for (let ${idx} = 0; ${idx} < ${arr}.length; ${idx} += 1) {`);
      line(s, indent + 2, `const ${item} = ${arr}[${idx}];`);
      emitNode(s, indent + 2, n.items, item, `${pathExpr} + "[" + ${idx} + "]"`);
      line(s, indent + 1, `}`);
      line(s, indent, `}`);
      return;
    }
    case "object":
    default: {
      const n = node as ValidatorObjectNode;
      const obj = fresh(s);
      line(s, indent, `const ${obj} = ${valueExpr};`);
      line(s, indent, `if (!isRecord(${obj})) {`);
      line(s, indent + 1, `add(c, ${pathExpr}, "type", "expected object");`);
      line(s, indent, `} else {`);
      for (const field of n.fields) {
        const key = JSON.stringify(field.name);
        const access = `${obj}[${key}]`;
        const childPath = pathChild(pathExpr, `.${field.name}`);
        if (field.required) {
          line(s, indent + 1, `if (!(${key} in ${obj})) {`);
          line(s, indent + 2, `add(c, ${childPath}, "required", "missing required property " + ${key});`);
          line(s, indent + 1, `} else {`);
          emitNode(s, indent + 2, field.node, access, childPath);
          line(s, indent + 1, `}`);
        } else {
          const fv = fresh(s);
          line(s, indent + 1, `if (${key} in ${obj}) {`);
          line(s, indent + 2, `const ${fv} = ${access};`);
          line(s, indent + 2, `if (${fv} !== undefined) {`);
          emitNode(s, indent + 3, field.node, fv, childPath);
          line(s, indent + 2, `}`);
          line(s, indent + 1, `}`);
        }
      }
      if (!n.additionalProperties) {
        const known = fresh(s);
        const k = fresh(s);
        const names = n.fields.map((f) => JSON.stringify(f.name)).join(", ");
        line(s, indent + 1, `const ${known} = new Set<string>([${names}]);`);
        line(s, indent + 1, `for (const ${k} of Object.keys(${obj})) {`);
        line(s, indent + 2, `if (!${known}.has(${k})) {`);
        line(s, indent + 3, `add(c, ${pathExpr} + "." + ${k}, "additionalProperty", "unexpected property " + ${k});`);
        line(s, indent + 2, `}`);
        line(s, indent + 1, `}`);
      }
      line(s, indent, `}`);
      return;
    }
  }
}

/** Render one validator model: its public `validate<Name>` plus the internal `validate<Name>Into`. */
function renderValidator(model: ValidatorModel): string {
  const s: EmitState = { out: [], counter: 0 };
  emitNode(s, 1, model.root, "value", "p");
  const body = s.out.join("\n");
  const doc =
    `/**\n` +
    ` * Validator for ${model.name} (source field schema ${model.id} v${model.version}).\n` +
    (model.payloadFamily !== undefined ? ` * Payload family: ${model.payloadFamily}.\n` : "") +
    ` */\n`;
  return (
    `${doc}export function validate${model.name}(value: unknown): ValidationResult {\n` +
    `  const c = ctx();\n` +
    `  validate${model.name}Into(c, "$", value);\n` +
    `  return done(c);\n` +
    `}\n\n` +
    `function validate${model.name}Into(c: Ctx, p: string, value: unknown): void {\n` +
    `${body}\n` +
    `}`
  );
}

// ---------------------------------------------------------------------------
// File emitters
// ---------------------------------------------------------------------------

const KERNEL_IMPORT =
  `import {\n` +
  `  type Ctx,\n` +
  `  type ValidationResult,\n` +
  `  add,\n` +
  `  checkArray,\n` +
  `  checkBoolean,\n` +
  `  checkEnum,\n` +
  `  checkNumber,\n` +
  `  checkString,\n` +
  `  ctx,\n` +
  `  done,\n` +
  `  isRecord,\n` +
  `} from "../_runtime.ts";\n\n`;

function emitModels(view: ContractView, doc: ValidatorDocument): string {
  const shortId = view.model.contract.shortId ?? view.model.contract.id;
  const bodies = doc.validators.map(renderValidator).join("\n\n");
  return (
    validatorBanner([`Runtime validators for ${shortId} (${view.model.contract.title}).`]) +
    KERNEL_IMPORT +
    bodies +
    "\n"
  );
}

function emitRoleValidators(
  view: ContractView,
  doc: ValidatorDocument,
  role: "Request" | "Response",
): string {
  const shortId = view.model.contract.shortId ?? view.model.contract.id;
  const names = doc.payloadFamilyTypeNames;
  const dtoModule = role === "Request" ? "requests" : "responses";
  const dtoImport =
    names.length > 0
      ? `import type {\n${names.map((n) => `  ${n}${role}DTO,`).join("\n")}\n} from "../../dto/${view.slug}/${dtoModule}.ts";\n`
      : "";
  const kernelImport = names.length > 0 ? `import type { Validator } from "../_runtime.ts";\n` : "";
  const modelsImport =
    names.length > 0
      ? `import {\n${names.map((n) => `  validate${n},`).join("\n")}\n} from "./models.ts";\n\n`
      : "";
  const aliases = names
    .map((n) =>
      [
        `/** ${role} validator for payload family ${JSON.stringify(n)}. Operation binding deferred (Prompt 08). */`,
        `export const validate${n}${role}DTO: Validator<${n}${role}DTO> = validate${n};`,
      ].join("\n"),
    )
    .join("\n\n");
  return (
    validatorBanner([`${role} validators for ${shortId} (${view.model.contract.title}).`]) +
    dtoImport +
    kernelImport +
    modelsImport +
    aliases +
    "\n"
  );
}

function emitErrorValidator(view: ContractView): string {
  const shortId = view.model.contract.shortId ?? view.model.contract.id;
  return (
    validatorBanner([`Error validator for ${shortId} (${view.model.contract.title}).`]) +
    `import type { ValidationResult } from "../_runtime.ts";

/**
 * Error validator for ${shortId}. FAIL-CLOSED: the contract catalog declares NO error model
 * (G5 / declared:false), and no error-family field schema is registered — so there is NOTHING to
 * validate against and NO error shape is invented. Any value is reported invalid until an error
 * model is authored and ratified (UCOS-PDATA-ARCH-001 / Prompt 09). Do NOT assume codes or fields.
 */
export function validate${view.pascal}ErrorDTO(_value: unknown): ValidationResult {
  return {
    valid: false,
    issues: [
      { path: "$", code: "no-error-model", message: "no error model is defined for ${shortId}" },
    ],
  };
}
`
  );
}

const VALIDATOR_MODULES: readonly string[] = ["models", "requests", "responses", "errors"];

function emitValidatorContractIndex(view: ContractView): string {
  const shortId = view.model.contract.shortId ?? view.model.contract.id;
  const exports = VALIDATOR_MODULES.map((m) => `export * from "./${m}.ts";`).join("\n");
  return validatorBanner([`Validator barrel for ${shortId} (${view.model.contract.title}).`]) + exports + "\n";
}

// ---------------------------------------------------------------------------
// Public surface
// ---------------------------------------------------------------------------

/** Emit the per-contract validator artifact set (files are relative to the generated root). */
export function emitContractValidatorFiles(
  view: ContractView,
  doc: ValidatorDocument,
): readonly EmittedFile[] {
  return [
    { relPath: `validators/${view.slug}/models.ts`, content: emitModels(view, doc) },
    { relPath: `validators/${view.slug}/requests.ts`, content: emitRoleValidators(view, doc, "Request") },
    { relPath: `validators/${view.slug}/responses.ts`, content: emitRoleValidators(view, doc, "Response") },
    { relPath: `validators/${view.slug}/errors.ts`, content: emitErrorValidator(view) },
    { relPath: `validators/${view.slug}/index.ts`, content: emitValidatorContractIndex(view) },
  ];
}

/** Emit the aggregate validator root barrel across every validator-SUFFICIENT contract. */
export function emitValidatorRootIndex(views: readonly ContractView[]): string {
  const slugs = views.map((v) => v.slug).sort();
  const exports = slugs.map((s) => `export * from "./${s}/index.ts";`).join("\n");
  return (
    validatorBanner(["Aggregate validator root barrel — re-exports every validator-SUFFICIENT contract."]) +
    `export * from "./_runtime.ts";\n` +
    exports +
    "\n"
  );
}
