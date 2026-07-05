/**
 * Contract Skeleton Generator — path-template parser (WI-07).
 *
 * Parses a catalog-verbatim path template (e.g. "/configuration/{scope}/{key}",
 * "/registry/discovery?type=") into its deterministic parts: literal segments, path
 * parameters ({name}), and declared query parameter names. Pure, side-effect-free.
 *
 * This surfaces ONLY what the catalog literally states (segment names, {param} names, and
 * query keys present in the template). It NEVER infers parameter TYPES — those are deferred
 * (G4) and represented opaquely by the emitters.
 *
 * Traceability: GENERATOR-READINESS-GAP-REPORT.md §3.2 (G4/G7) · UCOS-CONTRACT-CAT-001.
 */

/** One parsed path segment: a literal token or a `{param}` placeholder. */
export interface PathSegment {
  readonly kind: "literal" | "param";
  /** For a literal: the raw text. For a param: the parameter name (without braces). */
  readonly value: string;
}

export interface ParsedPath {
  /** Path portion before any '?', with a single leading '/'. */
  readonly templatePath: string;
  readonly segments: readonly PathSegment[];
  /** Ordered, de-duplicated path parameter names ({name}) in template order. */
  readonly pathParameters: readonly string[];
  /** Ordered, de-duplicated declared query parameter names present in the template. */
  readonly queryParameters: readonly string[];
}

function uniqueInOrder(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    if (!seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

/** Parse the query key names from the raw query string (e.g. "type=&x=1" -> ["type","x"]). */
function parseQueryKeys(query: string): readonly string[] {
  if (query.length === 0) return [];
  const keys = query
    .split("&")
    .map((pair) => {
      const eq = pair.indexOf("=");
      return (eq === -1 ? pair : pair.slice(0, eq)).trim();
    })
    .filter((k) => k.length > 0);
  return uniqueInOrder(keys);
}

/** Parse a catalog path template into deterministic parts. */
export function parsePath(rawPath: string): ParsedPath {
  const qIdx = rawPath.indexOf("?");
  const pathPart = qIdx === -1 ? rawPath : rawPath.slice(0, qIdx);
  const queryPart = qIdx === -1 ? "" : rawPath.slice(qIdx + 1);

  const rawSegments = pathPart.split("/").filter((s) => s.length > 0);
  const segments: PathSegment[] = [];
  const pathParams: string[] = [];
  for (const seg of rawSegments) {
    if (seg.startsWith("{") && seg.endsWith("}")) {
      const name = seg.slice(1, -1);
      segments.push({ kind: "param", value: name });
      pathParams.push(name);
    } else {
      segments.push({ kind: "literal", value: seg });
    }
  }

  const templatePath = "/" + rawSegments.join("/");
  return {
    templatePath,
    segments,
    pathParameters: uniqueInOrder(pathParams),
    queryParameters: parseQueryKeys(queryPart),
  };
}
