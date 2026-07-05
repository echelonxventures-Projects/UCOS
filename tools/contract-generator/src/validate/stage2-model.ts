/**
 * Contract Skeleton Generator — Stage 2: Canonical Model Validation (WI-07).
 *
 * Normalizes a Stage-1-valid inventory into the canonical `ContractModel`
 * (tools/contract-generator/model/*) and checks the semantic invariants that JSON Schema
 * alone cannot express. Fail-closed. NO INVENTION: deferred field-level schemas remain
 * explicit PlaceholderStates; the normalizer never fills them.
 *
 * Invariants enforced (CONTRACT-VALIDATION-ARCHITECTURE.md §4):
 *   INV-META      metaSchemaVersion pins to "ucos-contract-meta/1.0.0"
 *   INV-KIND      contractKind consistency (api ⇒ operations present)
 *   INV-DERIVED   catalog-provided operation.kind (if any) equals the deterministic
 *                 normalization of verbSemantics
 *   INV-OPID      derived operationIds are unique within a contract
 *   INV-VERB      verbSemantics is a recognized catalog verb
 *   INV-PURITY    deferred slots are placeholders, never fabricated concrete values
 *
 * Traceability: CONTRACT-VALIDATION-ARCHITECTURE.md §4 · UCOS-CONTRACT-CAT-001 · IC-2.
 */

import { isObject } from "./jsonSchema.ts";
import type { SchemaObject } from "./jsonSchema.ts";
import { deriveOperationId } from "../normalize/deriveOperationId.ts";
import { parsePath } from "../normalize/pathTemplate.ts";
import type { Failure, JsonValue, StageVerdict } from "../types.ts";
import type {
  ContractEntryModel,
  ContractKind,
  ContractModel,
  DataContractDetailModel,
  EmitsModel,
  NfrModel,
  SeamEcrModel,
  TraceabilityModel,
} from "../../model/ContractModel.ts";
import type {
  OperationKind,
  OperationModel,
  VerbSemantics,
} from "../../model/OperationModel.ts";
import type { ParameterModel } from "../../model/RequestModel.ts";
import type { MetaSchemaVersion, PlaceholderState } from "../../model/SchemaModel.ts";

const META_VERSION: MetaSchemaVersion = "ucos-contract-meta/1.0.0";
const NOT_DEFINED: PlaceholderState = "NOT DEFINED IN CATALOG";

const VERBS: readonly VerbSemantics[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

/** Deterministic derivation of the operation kind from its verb semantics (CVA §4). */
const KIND_BY_VERB: Readonly<Record<VerbSemantics, OperationKind>> = {
  GET: "safe-read",
  POST: "unsafe-create",
  PUT: "unsafe-idempotent",
  PATCH: "unsafe-idempotent",
  DELETE: "unsafe-delete",
};

function asString(v: JsonValue | undefined): string | undefined {
  return typeof v === "string" ? v : undefined;
}
function asStringArray(v: JsonValue | undefined): readonly string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  return v.filter((x): x is string => typeof x === "string");
}
function asObject(v: JsonValue | undefined): SchemaObject | undefined {
  return isObject(v) ? v : undefined;
}
function isVerb(v: string): v is VerbSemantics {
  return (VERBS as readonly string[]).includes(v);
}

export interface Stage2Result {
  readonly verdict: StageVerdict;
  readonly failures: readonly Failure[];
  readonly model: ContractModel | null;
}

interface NormalizeContext {
  readonly failures: Failure[];
}

function normalizeParameters(rawPath: string): readonly ParameterModel[] {
  const parsed = parsePath(rawPath);
  const params: ParameterModel[] = [];
  for (const name of parsed.pathParameters) {
    params.push({ name, in: "path", required: true });
  }
  for (const name of parsed.queryParameters) {
    params.push({ name, in: "query", required: false });
  }
  return params;
}

function normalizeOperation(
  rawOp: SchemaObject,
  index: number,
  ctx: NormalizeContext,
): OperationModel | null {
  const verbRaw = asString(rawOp["verbSemantics"]);
  const path = asString(rawOp["path"]);
  const intent = asString(rawOp["intent"]) ?? "";
  if (verbRaw === undefined || !isVerb(verbRaw)) {
    ctx.failures.push({
      path: `/contract/operations/${index}/verbSemantics`,
      reason: `INV-VERB: unrecognized verb semantics ${JSON.stringify(verbRaw)}`,
    });
    return null;
  }
  if (path === undefined) {
    ctx.failures.push({
      path: `/contract/operations/${index}/path`,
      reason: "INV-KIND: operation is missing a path template",
    });
    return null;
  }

  const derivedKind = KIND_BY_VERB[verbRaw];
  const catalogKind = asString(rawOp["kind"]);
  if (catalogKind !== undefined && catalogKind !== derivedKind) {
    ctx.failures.push({
      path: `/contract/operations/${index}/kind`,
      reason: `INV-DERIVED: catalog kind '${catalogKind}' contradicts derived kind '${derivedKind}' for ${verbRaw}`,
    });
  }

  const operationId = deriveOperationId(verbRaw, path);
  const parsed = parsePath(path);
  const parameters = normalizeParameters(path);
  const isUnsafe = verbRaw !== "GET";

  const pathParameters: readonly ParameterModel[] = parsed.pathParameters.map((name) => ({
    name,
    in: "path",
    required: true,
  }));
  const queryParameters: readonly ParameterModel[] = parsed.queryParameters.map((name) => ({
    name,
    in: "query",
    required: false,
  }));

  const op: OperationModel = {
    operationId,
    verbSemantics: verbRaw,
    path,
    intent,
    kind: derivedKind,
    parameters,
    request: {
      declared: false,
      placeholder: NOT_DEFINED,
      pathParameters,
      queryParameters,
      // Unsafe operations have a request body whose field-level schema is deferred (G1/G2):
      // represent it as an explicit placeholder — never an invented shape.
      ...(isUnsafe ? { bodyRef: NOT_DEFINED } : {}),
    },
    responses: [{ declared: false, placeholder: NOT_DEFINED }],
    errors: { declared: false, placeholder: NOT_DEFINED },
  };
  return op;
}

function normalizeEmits(raw: SchemaObject | undefined): EmitsModel | undefined {
  if (!raw) return undefined;
  const emits: EmitsModel = {
    eventContract: asString(raw["eventContract"]),
    shortId: asString(raw["shortId"]),
    producer: asString(raw["producer"]),
    domain: asString(raw["domain"]),
    capability: asString(raw["capability"]),
    messages: asStringArray(raw["messages"]),
  };
  return emits;
}

function normalizeNfr(raw: SchemaObject | undefined): NfrModel | undefined {
  if (!raw) return undefined;
  return {
    latency: asString(raw["latency"]),
    throughput: asString(raw["throughput"]),
    availability: asString(raw["availability"]),
    recoveryRtoRpo: asString(raw["recoveryRtoRpo"]),
  };
}

function normalizeDataContractDetail(
  raw: SchemaObject | undefined,
): DataContractDetailModel | undefined {
  if (!raw) return undefined;
  const id = asString(raw["id"]);
  if (id === undefined) return undefined;
  return {
    id,
    owningServiceDomain: asString(raw["owningServiceDomain"]),
    capability: asString(raw["capability"]),
    payloadFamilies: asStringArray(raw["payloadFamilies"]),
    referencesDataArchitecture: asString(raw["referencesDataArchitecture"]),
    classification: asString(raw["classification"]),
    fieldLevelSchema: asString(raw["fieldLevelSchema"]),
  };
}

function normalizeSeamEcr(raw: SchemaObject | undefined): SeamEcrModel | undefined {
  if (!raw) return undefined;
  return { seams: asStringArray(raw["seams"]), ecr: asStringArray(raw["ecr"]) };
}

function normalizeTraceability(raw: SchemaObject | undefined): TraceabilityModel | undefined {
  if (!raw) return undefined;
  return {
    refines: asStringArray(raw["refines"]),
    governedBy: asString(raw["governedBy"]),
    invariants: asStringArray(raw["invariants"]),
  };
}

/** Normalize + validate one inventory document. */
export function stage2Model(raw: JsonValue): Stage2Result {
  const ctx: NormalizeContext = { failures: [] };

  if (!isObject(raw)) {
    return {
      verdict: "FAIL",
      failures: [{ path: "", reason: "INV-KIND: inventory root is not an object" }],
      model: null,
    };
  }

  const contractRaw = asObject(raw["contract"]);
  if (!contractRaw) {
    return {
      verdict: "FAIL",
      failures: [{ path: "/contract", reason: "INV-KIND: missing contract entry" }],
      model: null,
    };
  }

  const id = asString(contractRaw["id"]);
  const title = asString(contractRaw["title"]);
  const version = asString(contractRaw["version"]);
  if (id === undefined || title === undefined || version === undefined) {
    ctx.failures.push({
      path: "/contract",
      reason: "INV-KIND: contract requires id, title and version",
    });
  }

  // INV-META — the metaSchemaVersion is pinned; a conflicting stated value fails closed.
  const statedMeta = asString(raw["metaSchemaVersion"]);
  if (statedMeta !== undefined && statedMeta !== META_VERSION) {
    ctx.failures.push({
      path: "/metaSchemaVersion",
      reason: `INV-META: stated '${statedMeta}' does not match pinned '${META_VERSION}'`,
    });
  }

  const contractKind = (asString(contractRaw["contractKind"]) ?? "api") as ContractKind;

  // Operations
  const rawOps = Array.isArray(contractRaw["operations"]) ? contractRaw["operations"] : [];
  const operations: OperationModel[] = [];
  rawOps.forEach((entry, index) => {
    const opObj = asObject(entry);
    if (!opObj) {
      ctx.failures.push({
        path: `/contract/operations/${index}`,
        reason: "INV-KIND: operation is not an object",
      });
      return;
    }
    const op = normalizeOperation(opObj, index, ctx);
    if (op) operations.push(op);
  });

  // INV-KIND — API contracts require at least one operation.
  if (contractKind === "api" && operations.length === 0) {
    ctx.failures.push({
      path: "/contract/operations",
      reason: "INV-KIND: api contract must declare at least one operation",
    });
  }

  // INV-OPID — derived operationIds must be unique within the contract.
  const seen = new Set<string>();
  for (const op of operations) {
    const oid = op.operationId ?? "";
    if (seen.has(oid)) {
      ctx.failures.push({
        path: "/contract/operations",
        reason: `INV-OPID: duplicate derived operationId '${oid}'`,
      });
    }
    seen.add(oid);
  }

  const contract: ContractEntryModel = {
    id: id ?? "",
    shortId: asString(contractRaw["shortId"]),
    title: title ?? "",
    version: version ?? "",
    status: asString(contractRaw["status"]),
    contractKind,
    producer: asString(contractRaw["producer"]),
    domain: asString(contractRaw["domain"]),
    capability: asString(contractRaw["capability"]),
    dataContract: asString(contractRaw["dataContract"]),
    consumers: asStringArray(contractRaw["consumers"]),
    operations,
    seamEcr: normalizeSeamEcr(asObject(contractRaw["seamEcr"])),
    emits: normalizeEmits(asObject(contractRaw["emits"])),
    nfr: normalizeNfr(asObject(contractRaw["nfr"])),
    security: asString(contractRaw["security"]),
    dataContractDetail: normalizeDataContractDetail(asObject(contractRaw["dataContractDetail"])),
  };

  const inventoryKindRaw = asString(raw["inventoryKind"]) ?? "api-contract-extraction";
  const inventoryKind =
    inventoryKindRaw === "event-contract-extraction" ||
    inventoryKindRaw === "data-contract-extraction"
      ? inventoryKindRaw
      : "api-contract-extraction";

  const extractionRaw = asObject(raw["extraction"]);
  const constraintsRaw = asObject(raw["generationConstraints"]);
  const constraintNote = constraintsRaw ? asString(constraintsRaw["note"]) : undefined;

  const model: ContractModel = {
    metaSchemaVersion: META_VERSION,
    inventoryFormat: asString(raw["inventoryFormat"]) ?? "ucos-api-contract.inventory/v1",
    inventoryKind,
    extraction:
      extractionRaw && asString(extractionRaw["source"]) !== undefined
        ? {
            source: asString(extractionRaw["source"]) ?? "",
            sourceArtifactId: asString(extractionRaw["sourceArtifactId"]) ?? "",
            sourceVersion: asString(extractionRaw["sourceVersion"]),
            sourceSection: asString(extractionRaw["sourceSection"]),
            extractedBy: asString(extractionRaw["extractedBy"]),
            extractionDate: asString(extractionRaw["extractionDate"]),
            fidelity: asString(extractionRaw["fidelity"]),
          }
        : undefined,
    contract,
    generationConstraints: constraintNote !== undefined ? { note: constraintNote } : undefined,
    traceability: normalizeTraceability(asObject(raw["traceability"])),
  };

  const verdict: StageVerdict = ctx.failures.length === 0 ? "PASS" : "FAIL";
  return { verdict, failures: ctx.failures, model: verdict === "PASS" ? model : model };
}
