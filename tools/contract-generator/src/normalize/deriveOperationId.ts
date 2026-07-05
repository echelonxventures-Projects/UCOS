/**
 * Contract Skeleton Generator — deterministic operationId derivation (WI-07).
 *
 * The v1 catalog inventory defines NO stable `operationId` (gap G6). Rather than invent
 * arbitrary names, the generator DERIVES one deterministically from the catalog-verbatim
 * verb semantics + path template, per this documented rule:
 *
 *   operationId = <verb-lowercased>
 *                 + for each path segment, in template order:
 *                     literal  -> PascalCase(segment)
 *                     {param}  -> "By" + PascalCase(param)
 *   (query parameters do not contribute to the id)
 *
 * Examples:
 *   GET  /configuration/{scope}          -> getConfigurationByScope
 *   PUT  /configuration/{scope}/{key}    -> putConfigurationByScopeByKey
 *   GET  /metadata/{class}               -> getMetadataByClass
 *   GET  /feature-flags/{context}        -> getFeatureFlagsByContext
 *   GET  /registry/artifacts             -> getRegistryArtifacts
 *   POST /registry/artifacts             -> postRegistryArtifacts
 *   GET  /registry/artifacts/{id}        -> getRegistryArtifactsById
 *   GET  /registry/discovery?type=       -> getRegistryDiscovery
 *
 * Pure and total: same inputs always yield the same id (no clock, no counter, no random).
 *
 * Traceability: GENERATOR-READINESS-GAP-REPORT.md §3.2 (G6) · PHASE-12-WI-06 §8 cond 3.
 */

import { parsePath } from "./pathTemplate.ts";
import type { PathSegment } from "./pathTemplate.ts";

/** PascalCase a token, splitting on any non-alphanumeric boundary (e.g. "feature-flags" -> "FeatureFlags"). */
export function pascalCase(token: string): string {
  const words = token.split(/[^a-zA-Z0-9]+/).filter((w) => w.length > 0);
  return words
    .map((w) => {
      const first = w.charAt(0).toUpperCase();
      return first + w.slice(1);
    })
    .join("");
}

function segmentToPart(segment: PathSegment): string {
  return segment.kind === "param" ? "By" + pascalCase(segment.value) : pascalCase(segment.value);
}

/** Derive the canonical operationId from verb semantics + a path template. */
export function deriveOperationId(verbSemantics: string, rawPath: string): string {
  const verb = verbSemantics.toLowerCase();
  const parsed = parsePath(rawPath);
  const parts = parsed.segments.map(segmentToPart).join("");
  return parts.length === 0 ? verb + "Root" : verb + parts;
}
