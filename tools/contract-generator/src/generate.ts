/**
 * Contract Skeleton Generator — pipeline orchestrator (WI-07).
 *
 * Runs the fail-closed pipeline for every catalog inventory:
 *   load -> Stage 1 (schema) -> Stage 2 (canonical model) -> Stage 3 (sufficiency) -> emit.
 * Generation is PURE here: it returns a deterministic { report, files } — it performs NO I/O
 * writes (see writeArtifacts.ts / cli.ts). Artifacts are produced ONLY when the top-level
 * verdict is PASS (any Stage-1/Stage-2 FAIL ⇒ zero files).
 *
 * Traceability: CONTRACT-VALIDATION-ARCHITECTURE.md §2/§7 · GENERATOR-READINESS-GAP-REPORT.md.
 */

import { loadCatalog } from "./load/loadInventory.ts";
import { loadSchemaRegistry } from "./validate/schemaRegistry.ts";
import { loadFieldSchemaRegistry } from "./registry/fieldSchemaRegistry.ts";
import { stage1Schema } from "./validate/stage1-schema.ts";
import { stage2Model } from "./validate/stage2-model.ts";
import { stage3GeneratorInput } from "./validate/stage3-generator-input.ts";
import { buildReport, serializeReport } from "./validate/report.ts";
import { buildContractView } from "./emit/view.ts";
import { emitManifestRuntime, emitTransportRuntime } from "./emit/runtime.ts";
import { emitInterfaces } from "./emit/interfaces.ts";
import { emitRequests } from "./emit/requests.ts";
import { emitResponses } from "./emit/responses.ts";
import { emitErrors } from "./emit/errors.ts";
import { emitClient } from "./emit/client.ts";
import { emitManifest } from "./emit/manifest.ts";
import { emitContractIndex, emitRegistry, emitRootIndex } from "./emit/barrels.ts";
import { emitContractDtoFiles, emitDtoRootIndex } from "./emit/dto.ts";
import { buildContractDTOs, familyBindingsOf } from "./dto/dtoBuilder.ts";
import { emitContractValidatorFiles, emitValidatorRootIndex, emitValidatorRuntime } from "./emit/validator.ts";
import { validatorsFromDtoDocument } from "./validator/validatorBuilder.ts";
import type { ContractReport, ValidationReport } from "./validate/report.ts";
import type { Stage3Targets } from "./validate/stage3-generator-input.ts";
import type { ContractView } from "./emit/view.ts";
import type { SchemaRegistry } from "./validate/jsonSchema.ts";
import type { FieldSchemaRegistry } from "./registry/fieldSchemaRegistry.ts";
import type { Failure, LoadedInventory, StageVerdict } from "./types.ts";

const META_VERSION = "ucos-contract-meta/1.0.0";

const BLOCKED_TARGETS: Stage3Targets = {
  dtos: "BLOCKED",
  validators: "BLOCKED",
  clients: "BLOCKED",
  serverStubs: "BLOCKED",
};

/** One generated artifact: a path relative to the generated root + its full content. */
export interface EmittedFile {
  readonly relPath: string;
  readonly content: string;
}

export interface GenerateResult {
  readonly report: ValidationReport;
  readonly reportJson: string;
  readonly files: readonly EmittedFile[];
  readonly views: readonly ContractView[];
}

export interface GenerateOptions {
  /** Override inventories (tests). Defaults to loading the catalog directory. */
  readonly inventories?: readonly LoadedInventory[];
  /** Override the meta-schema registry (tests). Defaults to loading contracts/schema. */
  readonly registry?: SchemaRegistry;
  /**
   * Override the field-schema registry (WI-08). Defaults to loading contracts/field-schemas
   * (empty by design ⇒ BLOCKED/PARTIAL verdicts, identical to WI-07).
   */
  readonly fieldSchemas?: FieldSchemaRegistry;
}

function emitContractFiles(view: ContractView): readonly EmittedFile[] {
  return [
    { relPath: `${view.slug}/interfaces.ts`, content: emitInterfaces(view) },
    { relPath: `${view.slug}/requests.ts`, content: emitRequests(view) },
    { relPath: `${view.slug}/responses.ts`, content: emitResponses(view) },
    { relPath: `${view.slug}/errors.ts`, content: emitErrors(view) },
    { relPath: `${view.slug}/client.ts`, content: emitClient(view) },
    { relPath: `${view.slug}/manifest.ts`, content: emitManifest(view) },
    { relPath: `${view.slug}/index.ts`, content: emitContractIndex(view) },
  ];
}

/** Execute the full generation pipeline. Deterministic; no filesystem writes. */
export function generate(options: GenerateOptions = {}): GenerateResult {
  const registry = options.registry ?? loadSchemaRegistry();
  const inventories = options.inventories ?? loadCatalog();
  const fieldSchemas = options.fieldSchemas ?? loadFieldSchemaRegistry();

  const contractReports: ContractReport[] = [];
  const views: ContractView[] = [];

  for (const inv of inventories) {
    const s1 = stage1Schema(inv.raw, registry);
    let s2Verdict: StageVerdict = "FAIL";
    let failures: Failure[] = [...s1.failures];
    let targets: Stage3Targets = BLOCKED_TARGETS;
    let notes: string[] = [];
    let contractId = inv.sourceId;

    if (s1.verdict === "PASS") {
      const s2 = stage2Model(inv.raw);
      s2Verdict = s2.verdict;
      failures = failures.concat(s2.failures);
      if (s2.model !== null) {
        contractId = s2.model.contract.id.length > 0 ? s2.model.contract.id : inv.sourceId;
        const s3 = stage3GeneratorInput(s2.model, fieldSchemas);
        targets = s3.targets;
        notes = [...s3.notes];
        if (s2.verdict === "PASS") {
          views.push(buildContractView(s2.model, s3.targets));
        }
      }
    }

    contractReports.push({
      id: contractId,
      sourceId: inv.sourceId,
      stage1_schema: s1.verdict,
      stage2_model: s1.verdict === "PASS" ? s2Verdict : "FAIL",
      stage3_targets: targets,
      failures,
      notes,
    });
  }

  const report = buildReport(contractReports, META_VERSION);
  const reportJson = serializeReport(report);

  const files: EmittedFile[] = [];
  if (report.verdict === "PASS" && views.length > 0) {
    files.push({ relPath: "_runtime/transport.ts", content: emitTransportRuntime() });
    files.push({ relPath: "_runtime/manifest.ts", content: emitManifestRuntime() });
    for (const view of views) {
      for (const file of emitContractFiles(view)) files.push(file);
    }
    files.push({ relPath: "registry.ts", content: emitRegistry(views) });
    files.push({ relPath: "index.ts", content: emitRootIndex(views) });
    files.push({ relPath: "validation-report.json", content: reportJson });

    // WI-09 — DTO generation. Gated per contract on Stage-3 SUFFICIENT (fail closed otherwise).
    // WI-10 — Validator generation. Gated identically (validators SUFFICIENT ⇔ dtos SUFFICIENT) and
    // DERIVED from the SAME resolved DTO document, so validators and DTOs can never diverge.
    // With the shipped empty field-schema registry NO contract is SUFFICIENT, so NO dto/* or
    // validators/* files are emitted and WI-07/WI-08/WI-09 output regenerates byte-identically.
    const dtoViews: ContractView[] = [];
    const validatorViews: ContractView[] = [];
    for (const view of views) {
      if (view.targets.dtos !== "SUFFICIENT") continue;
      const doc = buildContractDTOs(
        view.model.contract.shortId ?? view.model.contract.id,
        familyBindingsOf(view.model),
        fieldSchemas,
      );
      if (doc === null) continue; // gating contradiction — fail closed, emit nothing for this contract
      for (const file of emitContractDtoFiles(view, doc)) files.push(file);
      dtoViews.push(view);

      if (view.targets.validators === "SUFFICIENT") {
        const validatorDoc = validatorsFromDtoDocument(doc);
        for (const file of emitContractValidatorFiles(view, validatorDoc)) files.push(file);
        validatorViews.push(view);
      }
    }
    if (dtoViews.length > 0) {
      files.push({ relPath: "dto/index.ts", content: emitDtoRootIndex(dtoViews) });
    }
    if (validatorViews.length > 0) {
      files.push({ relPath: "validators/_runtime.ts", content: emitValidatorRuntime() });
      files.push({ relPath: "validators/index.ts", content: emitValidatorRootIndex(validatorViews) });
    }
  }

  files.sort((a, b) => (a.relPath < b.relPath ? -1 : a.relPath > b.relPath ? 1 : 0));
  return { report, reportJson, files, views };
}
