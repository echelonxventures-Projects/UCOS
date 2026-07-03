/**
 * UCOS Substrate — Artifact Loader (Meta-Core).
 *
 * Reads descriptor artifacts from a source (filesystem directory of JSON files, or in-memory
 * objects) and normalizes them into LoadedArtifact records. It does not register or validate;
 * that is the Contract/Capability loaders' job. Each artifact retains its source directory so
 * the Plugin Runtime can resolve relative provider modules.
 */

import { readFile, readdir } from "node:fs/promises";
import { extname, join, resolve as resolvePath } from "node:path";
import type { Descriptor } from "../contracts/types.ts";
import { SubstrateError } from "./errors.ts";

export interface LoadedArtifact {
  descriptor: Descriptor;
  sourceDir: string;
  sourcePath?: string;
}

function asDescriptorArray(parsed: unknown): Descriptor[] {
  if (Array.isArray(parsed)) return parsed as Descriptor[];
  return [parsed as Descriptor];
}

export class ArtifactLoader {
  async loadFromDirectory(dir: string): Promise<LoadedArtifact[]> {
    const absoluteDir = resolvePath(dir);
    let entries: string[];
    try {
      entries = await readdir(absoluteDir);
    } catch (cause) {
      throw new SubstrateError("LOADER_FAILED", `Cannot read descriptor directory "${dir}"`, {
        dir: absoluteDir,
        cause: cause instanceof Error ? cause.message : String(cause),
      });
    }

    const jsonFiles = entries.filter((entry) => extname(entry) === ".json").sort();
    const artifacts: LoadedArtifact[] = [];

    for (const file of jsonFiles) {
      const sourcePath = join(absoluteDir, file);
      let parsed: unknown;
      try {
        parsed = JSON.parse(await readFile(sourcePath, "utf8"));
      } catch (cause) {
        throw new SubstrateError("LOADER_FAILED", `Cannot parse descriptor file "${file}"`, {
          sourcePath,
          cause: cause instanceof Error ? cause.message : String(cause),
        });
      }
      for (const descriptor of asDescriptorArray(parsed)) {
        artifacts.push({ descriptor, sourceDir: absoluteDir, sourcePath });
      }
    }

    return artifacts;
  }

  loadFromObjects(descriptors: readonly Descriptor[], sourceDir: string = process.cwd()): LoadedArtifact[] {
    return descriptors.map((descriptor) => ({ descriptor, sourceDir }));
  }
}
