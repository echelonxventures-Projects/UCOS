/**
 * Contract Skeleton Generator — barrel + aggregate emitters (WI-07).
 *
 * Emits the per-contract index barrels, the aggregate `registry.ts` (all manifests), and the
 * generated-root `index.ts` re-export barrel. Deterministic ordering.
 *
 * Traceability: CONTRACT-SDK-GENERATOR-ARCHITECTURE.md · IC-2.
 */

import { generatedBanner, str } from "./render.ts";
import type { ContractView } from "./view.ts";

const CONTRACT_MODULES: readonly string[] = [
  "interfaces",
  "requests",
  "responses",
  "errors",
  "client",
  "manifest",
];

export function emitContractIndex(view: ContractView): string {
  const shortId = view.model.contract.shortId ?? view.model.contract.id;
  const exports = CONTRACT_MODULES.map((m) => `export * from "./${m}.ts";`).join("\n");
  return generatedBanner([`Barrel for ${shortId} (${view.model.contract.title}).`]) + exports + "\n";
}

export function emitRegistry(views: readonly ContractView[]): string {
  const meta = views.length > 0 ? views[0]!.model.metaSchemaVersion : "ucos-contract-meta/1.0.0";
  const imports = views
    .map((v) => `import { ${v.manifestConstName} } from "./${v.slug}/manifest.ts";`)
    .join("\n");
  const items = views.map((v) => `    ${v.manifestConstName},`).join("\n");
  return (
    generatedBanner(["Aggregate registry manifest of all generated contracts."]) +
    `import type { SdkRegistry } from "./_runtime/manifest.ts";
${imports}

/** Registry of every generated contract manifest (deterministic order). */
export const sdkRegistry: SdkRegistry = {
  metaSchemaVersion: ${str(meta)},
  contracts: [
${items}
  ],
};
`
  );
}

export function emitRootIndex(views: readonly ContractView[]): string {
  const contractExports = views.map((v) => `export * from "./${v.slug}/index.ts";`).join("\n");
  return (
    generatedBanner(["Generated SDK root barrel — re-exports shared runtime, contracts, registry."]) +
    `export * from "./_runtime/transport.ts";
export * from "./_runtime/manifest.ts";
${contractExports}
export * from "./registry.ts";
`
  );
}
