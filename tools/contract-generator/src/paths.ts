/**
 * Contract Skeleton Generator — canonical repository paths (WI-07).
 *
 * Resolves the fixed input/output locations relative to this file, so the generator is
 * position-independent and deterministic regardless of the process CWD.
 *
 *   repoRoot/
 *     contracts/catalog/*.contract.json         <- inputs (read-only)
 *     contracts/schema/*.schema.json            <- contract meta-schema (read-only)
 *     contracts/schema/field-schema.schema.json <- field-schema meta-schema (WI-08, read-only)
 *     contracts/field-schemas/*.fieldschema.json<- field-schema registry (WI-08, read-only; empty by design)
 *     packages/contracts-sdk/generated/         <- generated output root (write-only)
 *     tools/contract-generator/                 <- this tool (src is 1 level under here)
 *
 * Traceability: CONTRACT-VALIDATION-ARCHITECTURE.md §2/§8 · UCOS-CONTRACT-CAT-001 · IC-2.
 */

import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const thisFile = fileURLToPath(import.meta.url);
const srcDir = dirname(thisFile); // tools/contract-generator/src
const toolDir = resolve(srcDir, ".."); // tools/contract-generator

/** Absolute repository root (tools/contract-generator/../..). */
export const repoRoot: string = resolve(toolDir, "..", "..");

/** Directory holding the machine-readable contract inventories (inputs). */
export const catalogDir: string = join(repoRoot, "contracts", "catalog");

/** Directory holding the contract meta-schema files. */
export const schemaDir: string = join(repoRoot, "contracts", "schema");

/**
 * Directory holding the field-schema registry (WI-08). Contains authored field-level payload
 * schemas (`*.fieldschema.json`) owned by UCOS-PDATA-ARCH-001. Empty by design in WI-08: no
 * business payloads are invented here. The generator tolerates a missing/empty directory.
 */
export const fieldSchemasDir: string = join(repoRoot, "contracts", "field-schemas");

/** Field-schema meta-schema filename (WI-08). Self-contained (only local `$defs` references). */
export const fieldSchemaMetaFile = "field-schema.schema.json";

/** Generated SDK output root. The generator writes ONLY beneath this directory. */
export const generatedDir: string = join(
  repoRoot,
  "packages",
  "contracts-sdk",
  "generated",
);

/** The five meta-schema files, keyed by the bare filename used in cross-file `$ref`s. */
export const schemaFiles: readonly string[] = [
  "contract.schema.json",
  "operation.schema.json",
  "request.schema.json",
  "response.schema.json",
  "error.schema.json",
];

/** Root schema filename against which a full inventory document is validated. */
export const rootSchemaFile = "contract.schema.json";
