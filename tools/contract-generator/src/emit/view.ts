/**
 * Contract Skeleton Generator — emit view model (WI-07).
 *
 * Projects a validated `ContractModel` + Stage-3 verdicts into a flat, naming-resolved view
 * that the emitters render without further logic. Centralizes ALL naming and the deterministic
 * path-expression construction so every emitter stays a pure formatter.
 *
 * Traceability: CONTRACT-SDK-GENERATOR-ARCHITECTURE.md · GENERATOR-READINESS-GAP-REPORT.md.
 */

import { pascalCase } from "../normalize/deriveOperationId.ts";
import { parsePath } from "../normalize/pathTemplate.ts";
import { str } from "./render.ts";
import type { ContractModel } from "../../model/ContractModel.ts";
import type { VerbSemantics } from "../../model/OperationModel.ts";
import type { Stage3Targets } from "../validate/stage3-generator-input.ts";

export interface OperationView {
  readonly operationId: string;
  readonly pascalId: string;
  readonly verbSemantics: VerbSemantics;
  readonly templatePath: string;
  readonly intent: string;
  readonly kind: string;
  readonly pathParameters: readonly string[];
  readonly queryParameters: readonly string[];
  readonly hasBody: boolean;
  readonly requestTypeName: string;
  readonly responseTypeName: string;
  /** JS expression that resolves the URL path from `request.path.*` (deterministic). */
  readonly pathExpression: string;
  /** JS object-literal for the transport `pathParameters` field, e.g. "{ scope: request.path.scope }". */
  readonly pathParamsObject: string;
}

export interface ContractView {
  readonly model: ContractModel;
  readonly targets: Stage3Targets;
  readonly slug: string;
  readonly pascal: string;
  readonly operationIdUnionName: string;
  readonly descriptorTypeName: string;
  readonly metadataTypeName: string;
  readonly errorTypeName: string;
  readonly clientTypeName: string;
  readonly clientFactoryName: string;
  readonly manifestConstName: string;
  readonly payloadFamilies: readonly string[];
  readonly operations: readonly OperationView[];
}

function slugify(source: string): string {
  return source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Contract prefix in PascalCase with acronym normalization (e.g. "API-018" -> "Api018"). */
function contractPascal(source: string): string {
  const words = source.split(/[^a-zA-Z0-9]+/).filter((w) => w.length > 0);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

function operationPascal(operationId: string): string {
  return operationId.charAt(0).toUpperCase() + operationId.slice(1);
}

/** Build the deterministic path-resolution expression + pathParameters object literal. */
function buildPathExpression(templatePath: string): {
  readonly expression: string;
  readonly paramsObject: string;
  readonly pathParameters: readonly string[];
} {
  const parsed = parsePath(templatePath);
  const fragments: string[] = [];
  const params: string[] = [];
  let literal = "";
  for (const seg of parsed.segments) {
    if (seg.kind === "literal") {
      literal += "/" + seg.value;
    } else {
      literal += "/";
      fragments.push(str(literal));
      fragments.push(`encodeURIComponent(request.path.${seg.value})`);
      literal = "";
      params.push(seg.value);
    }
  }
  if (literal.length > 0) fragments.push(str(literal));
  const expression = fragments.length === 0 ? str("/") : fragments.join(" + ");
  const paramsObject =
    params.length === 0
      ? "{}"
      : "{ " + params.map((p) => `${p}: request.path.${p}`).join(", ") + " }";
  return { expression, paramsObject, pathParameters: parsed.pathParameters };
}

/** Build the full emit view for one validated contract. */
export function buildContractView(model: ContractModel, targets: Stage3Targets): ContractView {
  const shortId = model.contract.shortId ?? model.contract.id;
  const pascal = contractPascal(shortId);
  const slug = slugify(shortId);

  const operations: OperationView[] = (model.contract.operations ?? []).map((op) => {
    const operationId = op.operationId ?? "";
    const parsed = parsePath(op.path);
    const built = buildPathExpression(op.path);
    const pascalId = operationPascal(operationId);
    return {
      operationId,
      pascalId,
      verbSemantics: op.verbSemantics,
      templatePath: parsed.templatePath,
      intent: op.intent,
      kind: op.kind ?? "",
      pathParameters: parsed.pathParameters,
      queryParameters: parsed.queryParameters,
      hasBody: op.request?.bodyRef !== undefined,
      requestTypeName: `${pascalId}Request`,
      responseTypeName: `${pascalId}Response`,
      pathExpression: built.expression,
      pathParamsObject: built.paramsObject,
    };
  });

  return {
    model,
    targets,
    slug,
    pascal,
    operationIdUnionName: `${pascal}OperationId`,
    descriptorTypeName: `${pascal}OperationDescriptor`,
    metadataTypeName: `${pascal}ContractMetadata`,
    errorTypeName: `${pascal}Error`,
    clientTypeName: `${pascal}Client`,
    clientFactoryName: `create${pascal}Client`,
    manifestConstName: `${slugify(shortId).replace(/-/g, "")}Manifest`,
    payloadFamilies: model.contract.dataContractDetail?.payloadFamilies ?? [],
    operations,
  };
}
