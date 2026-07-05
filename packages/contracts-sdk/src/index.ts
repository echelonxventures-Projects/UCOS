/**
 * @ucos/contracts-sdk — public entry.
 *
 * Re-exports the GENERATED contract-first SDK produced by @ucos/contract-generator
 * (PHASE 12 — WI-07) from the ratified contract catalog `UCOS-CONTRACT-CAT-001` into
 * `../generated/`. Nothing here is hand-authored: to change the surface, evolve the contract
 * catalog via governed versioning (`UCOS-SVC-POLICY-001`) and regenerate:
 *   node tools/contract-generator/src/cli.ts
 *
 * STATUS: SKELETON scope. Clients + request/response/error scaffolds + registry manifests for
 * `UCOS-API-CONTRACT-018` and `UCOS-API-CONTRACT-027` are generated with OPAQUE payloads;
 * typed DTOs/validators remain BLOCKED until field-level schemas exist (Prompt 05 /
 * `UCOS-PDATA-ARCH-001`).
 *
 * Traceability: `UCOS-CONTRACT-CAT-001` · IC-2 · `UCOS-SVC-ARCH-001` · `UCOS-SVC-POLICY-001`.
 */

export * from "../generated/index.ts";
