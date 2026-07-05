/**
 * Contract Skeleton Generator — error scaffold emitter (WI-07).
 *
 * Emits `<slug>/errors.ts`: an OPAQUE error alias for the contract. The catalog declares NO
 * error model at the boundary level (G5 / declared:false), so the shape is opaque until an
 * error model is authored and ratified — never invented.
 *
 * Traceability: GENERATOR-READINESS-GAP-REPORT.md §3.1 (G5) · UCOS-CONTRACT-CAT-001.
 */

import { generatedBanner } from "./render.ts";
import type { ContractView } from "./view.ts";

export function emitErrors(view: ContractView): string {
  const shortId = view.model.contract.shortId ?? view.model.contract.id;
  return (
    generatedBanner([`Error scaffold for ${shortId} (${view.model.contract.title}).`]) +
    `import type { OpaquePayload } from "../_runtime/transport.ts";

/**
 * OPAQUE error type for ${shortId}. The catalog declares NO error model (G5 / declared:false);
 * this alias is a placeholder until an error model is authored + ratified. Do NOT assume codes or shapes.
 */
export type ${view.errorTypeName} = OpaquePayload;
`
  );
}
