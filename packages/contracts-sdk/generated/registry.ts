/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Produced by @ucos/contract-generator (PHASE 12 — WI-07) from the ratified contract
 * catalog UCOS-CONTRACT-CAT-001. Regenerate with:
 *   node tools/contract-generator/src/cli.ts
 *
 * Aggregate registry manifest of all generated contracts.
 *
 * SCOPE = SKELETON (transport-neutral). Payloads are OPAQUE: field-level schemas are
 * deferred by the catalog (G1: NOT DEFINED IN CATALOG) and MUST NOT be assumed here.
 * Traceability: UCOS-CONTRACT-CAT-001 · IC-2 · UCOS-SVC-ARCH-001 · UCOS-SVC-POLICY-001.
 */
import type { SdkRegistry } from "./_runtime/manifest.ts";
import { api018Manifest } from "./api-018/manifest.ts";
import { api027Manifest } from "./api-027/manifest.ts";

/** Registry of every generated contract manifest (deterministic order). */
export const sdkRegistry: SdkRegistry = {
  metaSchemaVersion: "ucos-contract-meta/1.0.0",
  contracts: [
    api018Manifest,
    api027Manifest,
  ],
};
