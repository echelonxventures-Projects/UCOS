/**
 * Contract Skeleton Generator — registry manifest emitter (WI-07).
 *
 * Emits `<slug>/manifest.ts`: a catalog-faithful `ContractManifest` value enumerating the
 * contract's identity, payload families, per-target generation verdicts, and operations.
 *
 * Traceability: GENERATOR-READINESS-GAP-REPORT.md §5(3) · UCOS-CONTRACT-CAT-001 · IC-2.
 */

import { generatedBanner, str, strArray } from "./render.ts";
import type { ContractView, OperationView } from "./view.ts";

function operationEntry(op: OperationView): string {
  return [
    `    {`,
    `      operationId: ${str(op.operationId)},`,
    `      verbSemantics: ${str(op.verbSemantics)},`,
    `      path: ${str(op.templatePath)},`,
    `      intent: ${str(op.intent)},`,
    `      kind: ${str(op.kind)},`,
    `      pathParameters: ${strArray(op.pathParameters)},`,
    `      queryParameters: ${strArray(op.queryParameters)},`,
    `      requestBody: ${str(op.hasBody ? "opaque" : "none")},`,
    `      errorModel: "not-declared",`,
    `    },`,
  ].join("\n");
}

export function emitManifest(view: ContractView): string {
  const c = view.model.contract;
  const shortId = c.shortId ?? c.id;
  const operations = view.operations.map(operationEntry).join("\n");

  return (
    generatedBanner([`Registry manifest for ${shortId} (${c.title}).`]) +
    `import type { ContractManifest } from "../_runtime/manifest.ts";

/** Catalog-faithful registry manifest for ${shortId}. */
export const ${view.manifestConstName}: ContractManifest = {
  metaSchemaVersion: ${str(view.model.metaSchemaVersion)},
  id: ${str(c.id)},
  shortId: ${str(shortId)},
  title: ${str(c.title)},
  version: ${str(c.version)},
  domain: ${str(c.domain ?? "")},
  capability: ${str(c.capability ?? "")},
  producer: ${str(c.producer ?? "")},
  dataContract: ${str(c.dataContract ?? "")},
  payloadFamilies: ${strArray(view.payloadFamilies)},
  generation: {
    scope: "skeleton",
    dtos: ${str(view.targets.dtos)},
    validators: ${str(view.targets.validators)},
    clients: ${str(view.targets.clients)},
    serverStubs: ${str(view.targets.serverStubs)},
  },
  operations: [
${operations}
  ],
};
`
  );
}
