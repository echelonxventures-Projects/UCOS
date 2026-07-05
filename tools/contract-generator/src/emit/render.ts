/**
 * Contract Skeleton Generator — rendering helpers (WI-07).
 *
 * Deterministic string helpers for emitting generated TypeScript. No timestamps, no random,
 * no environment coupling — identical inputs yield byte-identical output.
 *
 * Traceability: CONTRACT-SDK-GENERATOR-ARCHITECTURE.md · IC-2.
 */

/** Standard "do not edit" banner for every generated file. `lines` are contract-specific notes. */
export function generatedBanner(lines: readonly string[]): string {
  const body = lines.map((l) => ` * ${l}`).join("\n");
  return [
    "/**",
    " * GENERATED FILE — DO NOT EDIT BY HAND.",
    " *",
    " * Produced by @ucos/contract-generator (PHASE 12 — WI-07) from the ratified contract",
    " * catalog UCOS-CONTRACT-CAT-001. Regenerate with:",
    " *   node tools/contract-generator/src/cli.ts",
    " *",
    body,
    " *",
    " * SCOPE = SKELETON (transport-neutral). Payloads are OPAQUE: field-level schemas are",
    " * deferred by the catalog (G1: NOT DEFINED IN CATALOG) and MUST NOT be assumed here.",
    " * Traceability: UCOS-CONTRACT-CAT-001 · IC-2 · UCOS-SVC-ARCH-001 · UCOS-SVC-POLICY-001.",
    " */",
    "",
  ].join("\n");
}

/** Render a JSON string literal (double-quoted) deterministically. */
export function str(value: string): string {
  return JSON.stringify(value);
}

/** Render a readonly string[] literal, e.g. ["a", "b"]. */
export function strArray(values: readonly string[]): string {
  return "[" + values.map((v) => str(v)).join(", ") + "]";
}
