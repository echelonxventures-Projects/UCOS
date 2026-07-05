/**
 * Contract Skeleton Generator — TypeScript interface emitter (WI-07).
 *
 * Emits `<slug>/interfaces.ts`: the operationId union, an operation descriptor type, a
 * contract metadata type, and OPAQUE payload-family aliases (field-level schemas deferred, G1).
 *
 * Traceability: GENERATOR-READINESS-GAP-REPORT.md §5(3) · UCOS-CONTRACT-CAT-001 · IC-2.
 */

import { pascalCase } from "../normalize/deriveOperationId.ts";
import { generatedBanner } from "./render.ts";
import type { ContractView } from "./view.ts";

export function emitInterfaces(view: ContractView): string {
  const shortId = view.model.contract.shortId ?? view.model.contract.id;

  const unionMembers =
    view.operations.length === 0
      ? "  never"
      : view.operations.map((op) => `  | ${JSON.stringify(op.operationId)}`).join("\n");

  const payloadAliases = view.payloadFamilies
    .map((family) => {
      const typeName = pascalCase(family);
      return [
        `/** OPAQUE payload family ${JSON.stringify(family)} — field-level schema deferred (G1: NOT DEFINED IN CATALOG). */`,
        `export type ${typeName} = OpaquePayload;`,
      ].join("\n");
    })
    .join("\n\n");

  return (
    generatedBanner([`TypeScript interfaces for ${shortId} (${view.model.contract.title}).`]) +
    `import type { OpaquePayload, VerbSemantics } from "../_runtime/transport.ts";

/** Canonical operation ids for ${shortId} (derived deterministically from verb + path; G6). */
export type ${view.operationIdUnionName} =
${unionMembers};

/** Boundary-level descriptor of one ${shortId} operation (catalog-faithful metadata). */
export interface ${view.descriptorTypeName} {
  readonly operationId: ${view.operationIdUnionName};
  readonly verbSemantics: VerbSemantics;
  readonly path: string;
  readonly intent: string;
  readonly kind: string;
  readonly pathParameters: readonly string[];
  readonly queryParameters: readonly string[];
}

/** Contract-level metadata for ${shortId}. */
export interface ${view.metadataTypeName} {
  readonly id: string;
  readonly shortId: string;
  readonly title: string;
  readonly version: string;
  readonly domain: string;
  readonly capability: string;
}
${payloadAliases.length > 0 ? "\n" + payloadAliases + "\n" : ""}`
  );
}
