/**
 * Contract Skeleton Generator — request scaffold emitter (WI-07).
 *
 * Emits `<slug>/requests.ts`: one request scaffold interface per operation. Path parameters
 * are surfaced as URL path segments (string form; concrete types deferred, G4); declared
 * query keys are optional strings; request bodies for unsafe operations are OPAQUE (G1/G2).
 *
 * Traceability: GENERATOR-READINESS-GAP-REPORT.md §3 (G1/G2/G4) · UCOS-CONTRACT-CAT-001.
 */

import { generatedBanner } from "./render.ts";
import type { ContractView, OperationView } from "./view.ts";

function requestInterface(op: OperationView): string {
  const lines: string[] = [];
  if (op.pathParameters.length > 0) {
    const props = op.pathParameters.map((p) => `readonly ${p}: string`).join("; ");
    lines.push(`  /** Path parameters (URL segments; concrete types deferred, G4). */`);
    lines.push(`  readonly path: { ${props} };`);
  }
  if (op.queryParameters.length > 0) {
    const props = op.queryParameters.map((q) => `readonly ${q}?: string`).join("; ");
    lines.push(`  /** Declared query parameters (types deferred, G7). */`);
    lines.push(`  readonly query?: { ${props} };`);
  }
  if (op.hasBody) {
    lines.push(`  /** OPAQUE request body — field-level schema deferred (G1/G2). */`);
    lines.push(`  readonly body: OpaquePayload;`);
  }
  const body = lines.length > 0 ? "\n" + lines.join("\n") + "\n" : "";
  return [
    `/** Request scaffold for ${op.operationId} (${op.verbSemantics} ${op.templatePath}). */`,
    `export interface ${op.requestTypeName} {${body}}`,
  ].join("\n");
}

export function emitRequests(view: ContractView): string {
  const shortId = view.model.contract.shortId ?? view.model.contract.id;
  const needsOpaque = view.operations.some((op) => op.hasBody);
  const importLine = needsOpaque
    ? `import type { OpaquePayload } from "../_runtime/transport.ts";\n\n`
    : "";
  const bodies = view.operations.map(requestInterface).join("\n\n");
  return (
    generatedBanner([`Request scaffolds for ${shortId} (${view.model.contract.title}).`]) +
    importLine +
    bodies +
    "\n"
  );
}
