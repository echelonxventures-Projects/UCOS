/**
 * authority/index.ts — Authority Chain Runtime (CGR-W2-ACR-*) barrel (Wave-A).
 *
 * Aggregates the read-model (CGR-W2-ACR-01), chain resolver (CGR-W2-ACR-02), and supremacy
 * arbiter (CGR-W2-ACR-03) into one read-only surface. No logic lives here.
 *
 * REUSE JUSTIFICATION: barrel-only re-export, mirroring the Wave-1 `registries/index.ts` pattern;
 * introduces no new primitive. Names are unique within the constitutional-governance namespace.
 */

export * from "./types.ts";
export * from "./read-model.ts";
export * from "./resolve.ts";
export * from "./supremacy.ts";
