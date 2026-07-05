/**
 * Contract Skeleton Generator — inventory loader (WI-07).
 *
 * Reads contract inventory JSON files from the catalog directory. READ-ONLY: never mutates
 * the source of record. Ordering is deterministic (sorted by filename) so downstream
 * generation and reporting are reproducible.
 *
 * Traceability: CONTRACT-VALIDATION-ARCHITECTURE.md §2 (Stage 0/Input) · UCOS-CONTRACT-CAT-001.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join, relative, isAbsolute } from "node:path";
import { catalogDir, repoRoot } from "../paths.ts";
import type { JsonValue, LoadedInventory } from "../types.ts";

/** Suffix that marks a catalog inventory file. */
const CONTRACT_SUFFIX = ".contract.json";

/** Normalize an absolute path to a stable, forward-slash repo-relative id. */
function toSourceId(absPath: string): string {
  const rel = isAbsolute(absPath) ? relative(repoRoot, absPath) : absPath;
  return rel.split("\\").join("/");
}

/** Parse a single inventory file. Throws on unreadable/invalid JSON (fail-closed). */
export function loadInventoryFile(absPath: string): LoadedInventory {
  let text: string;
  try {
    text = readFileSync(absPath, "utf8");
  } catch (cause) {
    throw new Error(`Cannot read contract inventory: ${absPath}`, { cause });
  }
  let raw: JsonValue;
  try {
    raw = JSON.parse(text) as JsonValue;
  } catch (cause) {
    throw new Error(`Invalid JSON in contract inventory: ${absPath}`, { cause });
  }
  return { sourcePath: absPath, sourceId: toSourceId(absPath), raw };
}

/**
 * Load every `*.contract.json` inventory in the catalog directory, sorted deterministically
 * by filename. Returns an empty list if the directory has none.
 */
export function loadCatalog(dir: string = catalogDir): readonly LoadedInventory[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && e.name.endsWith(CONTRACT_SUFFIX))
    .map((e) => e.name)
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return files.map((name) => loadInventoryFile(join(dir, name)));
}
