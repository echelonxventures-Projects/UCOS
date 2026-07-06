/**
 * verification/index.ts — Authority Verification Runtime (CGR-W2-AVR-*) barrel (Wave-A).
 *
 * Aggregates the integrity verifier (CGR-W2-AVR-01), the acyclicity + mandatory up-trace verifier
 * (CGR-W2-AVR-02), and the audit-continuity verifier (CGR-W2-AVR-03) into one read-only surface.
 * No logic lives here.
 *
 * REUSE JUSTIFICATION: barrel-only re-export, mirroring the Wave-1 `registries/index.ts` pattern;
 * introduces no new primitive. Names are unique within the constitutional-governance namespace.
 */

export * from "./integrity.ts";
export * from "./acyclicity.ts";
export * from "./audit-continuity.ts";
