/**
 * Contract Skeleton Generator — response scaffold emitter (WI-07).
 *
 * Emits `<slug>/responses.ts`: one response scaffold interface per operation with an OPAQUE
 * body (field-level schema deferred, G1/G3). No transport status is emitted (deferred, Prompt 08).
 *
 * Traceability: GENERATOR-READINESS-GAP-REPORT.md §3 (G1/G3) · UCOS-CONTRACT-CAT-001.
 */

import { generatedBanner } from "./render.ts";
import type { ContractView, OperationView } from "./view.ts";

function responseInterface(op: OperationView): string {
  return [
    `/** Response scaffold for ${op.operationId}. OPAQUE body — field-level schema deferred (G1/G3); outcome/status deferred (Prompt 08). */`,
    `export interface ${op.responseTypeName} {`,
    `  readonly body: OpaquePayload;`,
    `}`,
  ].join("\n");
}

export function emitResponses(view: ContractView): string {
  const shortId = view.model.contract.shortId ?? view.model.contract.id;
  const bodies = view.operations.map(responseInterface).join("\n\n");
  return (
    generatedBanner([`Response scaffolds for ${shortId} (${view.model.contract.title}).`]) +
    `import type { OpaquePayload } from "../_runtime/transport.ts";\n\n` +
    bodies +
    "\n"
  );
}
