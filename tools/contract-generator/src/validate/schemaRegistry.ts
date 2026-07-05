/**
 * Contract Skeleton Generator — meta-schema registry loader (WI-07).
 *
 * Loads the five contract meta-schema files into a registry keyed by bare filename (the key
 * form used by cross-file `$ref`s such as "operation.schema.json#/$defs/schemaRef").
 * READ-ONLY. Deterministic.
 *
 * Traceability: contracts/schema/*.schema.json · CONTRACT-VALIDATION-ARCHITECTURE.md §3.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { schemaDir, schemaFiles } from "../paths.ts";
import { isObject } from "./jsonSchema.ts";
import type { SchemaObject, SchemaRegistry } from "./jsonSchema.ts";
import type { JsonValue } from "../types.ts";

/** Load and parse all meta-schema files into an immutable registry. Throws (fail-closed) on any parse error. */
export function loadSchemaRegistry(dir: string = schemaDir): SchemaRegistry {
  const registry = new Map<string, SchemaObject>();
  for (const name of schemaFiles) {
    const abs = join(dir, name);
    let parsed: JsonValue;
    try {
      parsed = JSON.parse(readFileSync(abs, "utf8")) as JsonValue;
    } catch (cause) {
      throw new Error(`Cannot load meta-schema file '${name}' from ${dir}`, { cause });
    }
    if (!isObject(parsed)) {
      throw new Error(`Meta-schema file '${name}' is not a JSON object`);
    }
    registry.set(name, parsed);
  }
  return registry;
}
