/**
 * constitutional-resolution/index.ts — Constitutional Resolution Layer (CGR-W2-CRL-*) barrel (Wave-B).
 *
 * Aggregates the applicable-provision resolver (CGR-W2-CRL-01), the precedence resolver
 * (CGR-W2-CRL-02), and the resolution audit emitter (CGR-W2-CRL-03) into one read-only surface.
 * No logic lives here.
 *
 * REUSE JUSTIFICATION: barrel-only re-export, mirroring the Wave-A `authority/index.ts` and
 * `verification/index.ts` pattern; introduces no new primitive. Names are unique within the
 * constitutional-governance namespace.
 */

export * from "./applicable-provision.ts";
export * from "./precedence.ts";
export * from "./audit.ts";
