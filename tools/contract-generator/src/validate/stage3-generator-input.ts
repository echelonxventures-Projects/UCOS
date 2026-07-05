/**
 * Contract Skeleton Generator — Stage 3: Generator Input Validation / Sufficiency Gate
 * (WI-07 · enhanced by WI-08).
 *
 * Decides, PER GENERATION TARGET, whether the canonical model carries enough catalog-faithful
 * information to generate without invention:
 *   SUFFICIENT — full faithful generation possible
 *   PARTIAL    — transport-neutral skeleton only (opaque payloads); typed bodies deferred
 *   BLOCKED    — cannot generate faithfully; inputs missing
 *
 * WI-08 change: sufficiency is now REGISTRY-DRIVEN. Instead of reading the catalog's deferral
 * string, the engine asks the Field-Schema Registry whether EVERY payload family the contract
 * declares resolves to a valid, dependency-complete field schema. When the registry is empty
 * (the shipped WI-08 state — no invented business payloads), every payload family is unresolved,
 * so DTOs/Validators stay BLOCKED and Clients/ServerStubs stay PARTIAL — byte-identical to WI-07.
 * When a governed field-schema set is later authored (UCOS-PDATA-ARCH-001), the same engine lifts
 * the affected targets to SUFFICIENT with no code change here.
 *
 * Traceability: CONTRACT-VALIDATION-ARCHITECTURE.md §5 · GENERATOR-READINESS-GAP-REPORT.md ·
 *               WI08-CATALOG-GAP-INVENTORY.md · WI08-SCHEMA-REGISTRY.md.
 */

import type { TargetVerdict } from "../types.ts";
import type { ContractModel } from "../../model/ContractModel.ts";
import { EMPTY_FIELD_SCHEMA_REGISTRY } from "../registry/fieldSchemaRegistry.ts";
import type { FieldSchemaRegistry } from "../registry/fieldSchemaRegistry.ts";

export interface Stage3Targets {
  readonly dtos: TargetVerdict;
  readonly validators: TargetVerdict;
  readonly clients: TargetVerdict;
  readonly serverStubs: TargetVerdict;
}

/** Per-payload-family resolution outcome (registry-driven; recorded, deterministic). */
export interface FieldSchemaResolution {
  readonly family: string;
  readonly resolved: boolean;
  /** Registry id of the resolved definition (when resolved). */
  readonly schemaId?: string;
  /** Why a family did not resolve: "not-registered" | "incomplete-dependencies". */
  readonly reason?: string;
}

export interface Stage3Result {
  readonly targets: Stage3Targets;
  /** Ordered, deterministic notes explaining any BLOCKED/PARTIAL/SUFFICIENT verdict. */
  readonly notes: readonly string[];
  /** Per-family resolution detail (registry-driven). Empty when the contract declares no families. */
  readonly fieldSchemas: readonly FieldSchemaResolution[];
}

/** Resolve each declared payload family against the registry (deterministic, order-preserving). */
function resolveFamilies(
  model: ContractModel,
  registry: FieldSchemaRegistry,
): readonly FieldSchemaResolution[] {
  const detail = model.contract.dataContractDetail;
  const families = detail?.payloadFamilies ?? [];
  const dataContract = detail?.id;
  return families.map((family): FieldSchemaResolution => {
    const def = registry.resolvePayloadFamily(family, dataContract);
    if (!def) return { family, resolved: false, reason: "not-registered" };
    const dep = registry.resolveDependencies(def.id, def.version);
    if (!dep.ok) {
      return { family, resolved: false, schemaId: def.id, reason: "incomplete-dependencies" };
    }
    return { family, resolved: true, schemaId: def.id };
  });
}

/**
 * Compute per-target sufficiency for one contract model against a field-schema registry.
 * Defaults to the EMPTY registry, which preserves the WI-07 BLOCKED/PARTIAL verdicts exactly.
 */
export function stage3GeneratorInput(
  model: ContractModel,
  registry: FieldSchemaRegistry = EMPTY_FIELD_SCHEMA_REGISTRY,
): Stage3Result {
  const operations = model.contract.operations ?? [];
  const hasOperations = operations.length > 0;

  const fieldSchemas = resolveFamilies(model, registry);
  const hasFamilies = fieldSchemas.length > 0;
  // DTOs/Validators are SUFFICIENT only when EVERY declared payload family resolves completely.
  const fieldSchemasResolvable = hasFamilies && fieldSchemas.every((f) => f.resolved);

  const notes: string[] = [];

  const dtos: TargetVerdict = fieldSchemasResolvable ? "SUFFICIENT" : "BLOCKED";
  const validators: TargetVerdict = fieldSchemasResolvable ? "SUFFICIENT" : "BLOCKED";
  const clients: TargetVerdict = !hasOperations
    ? "BLOCKED"
    : fieldSchemasResolvable
      ? "SUFFICIENT"
      : "PARTIAL";
  const serverStubs: TargetVerdict = clients;

  if (!fieldSchemasResolvable) {
    // BLOCKED path — identical wording to WI-07 so the shipped (empty-registry) report is byte-identical.
    notes.push(
      "DTOs BLOCKED: field-level payload schema deferred by catalog (G1: NOT DEFINED IN CATALOG; Prompt 05 / UCOS-PDATA-ARCH-001).",
    );
    notes.push("Validators BLOCKED: no field-level schema/constraints to validate (G1–G3).");
  } else {
    notes.push(
      "DTOs SUFFICIENT: every declared payload family resolves to a registered field schema (WI-08 field-schema registry).",
    );
    notes.push(
      "Validators SUFFICIENT: registered field schemas + constraints are available for validator generation.",
    );
  }

  if (clients === "PARTIAL") {
    notes.push(
      "Clients PARTIAL: path template + verb present; request/response bodies opaque until field-level schemas exist (G1–G4). operationId derived deterministically (G6).",
    );
    notes.push("ServerStubs PARTIAL: handler signatures with opaque payloads; no business logic.");
  } else if (clients === "SUFFICIENT") {
    notes.push(
      "Clients SUFFICIENT: typed request/response bodies available from resolved field schemas.",
    );
    notes.push("ServerStubs SUFFICIENT: typed handler signatures available from resolved field schemas.");
  }

  if (!hasOperations) {
    notes.push("Clients/ServerStubs BLOCKED: contract declares no operations.");
  }

  // Diagnostic notes appear ONLY when the registry is populated, so the shipped empty-registry
  // report remains byte-identical to WI-07. They record exactly which families are missing.
  if (registry.size > 0 && hasFamilies && !fieldSchemasResolvable) {
    for (const f of fieldSchemas) {
      if (!f.resolved) {
        notes.push(`Field schema unresolved for payload family '${f.family}' (${f.reason ?? "not-registered"}).`);
      }
    }
  }

  return { targets: { dtos, validators, clients, serverStubs }, notes, fieldSchemas };
}
