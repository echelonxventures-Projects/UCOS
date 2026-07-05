/**
 * Contract Skeleton Generator — artifact writer (WI-07).
 *
 * Writes the generated file map to disk. Writes ONLY beneath the generated root
 * (packages/contracts-sdk/generated/). `cleanGenerated` removes prior generated content
 * (preserving `.gitkeep`) so regeneration is idempotent and free of stale files.
 *
 * Traceability: CONTRACT-VALIDATION-ARCHITECTURE.md §7 (no partial writes) · PHASE-12-WI-06 §8.
 */

import { mkdirSync, readdirSync, rmSync, writeFileSync, type Dirent } from "node:fs";
import { dirname, join } from "node:path";
import { generatedDir } from "./paths.ts";
import type { EmittedFile } from "./generate.ts";

/** Files preserved across regeneration. */
const PRESERVE: ReadonlySet<string> = new Set([".gitkeep"]);

/** Read directory entries, returning null if the directory does not exist. */
function safeReaddir(dir: string): Dirent[] | null {
  try {
    return readdirSync(dir, { withFileTypes: true });
  } catch {
    return null;
  }
}

/** Remove all generated content under `dir` except preserved files. Safe if `dir` is empty/missing. */
export function cleanGenerated(dir: string = generatedDir): void {
  const entries = safeReaddir(dir);
  if (entries === null) return;
  for (const entry of entries) {
    if (PRESERVE.has(entry.name)) continue;
    rmSync(join(dir, entry.name), { recursive: true, force: true });
  }
}

/** Write every emitted file beneath `dir`, creating parent directories as needed. */
export function writeArtifacts(
  files: readonly EmittedFile[],
  dir: string = generatedDir,
): readonly string[] {
  const written: string[] = [];
  for (const file of files) {
    const abs = join(dir, file.relPath);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, file.content, "utf8");
    written.push(file.relPath);
  }
  return written;
}
