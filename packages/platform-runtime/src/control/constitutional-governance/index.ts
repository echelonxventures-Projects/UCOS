/**
 * cg/index.ts — Constitutional Governance Runtime (CGR) top-level namespace barrel.
 *
 * Aggregates the complete Wave-1 propose-only substrate into one public surface:
 *   - shared schema (types)                          — CGR-CORE-01
 *   - append-only guards + fail-closed errors        — CGR-CORE-02
 *   - canonical hashing + verify-on-read             — CGR-CORE-03
 *   - deterministic test harness                     — CGR-CORE-05
 *   - the eleven registries + generic base           — CGR-REG-*
 *   - the audit hash-chain                           — CGR-AU-CHAIN
 *   - the offline audit-chain verifier               — CGR-AU-VERIFY
 *   - the deterministic composition root             — CGR-CORE-04
 *
 * Exposed through the platform control surface via `control/index.ts`
 * (`export * as constitutionalGovernance`). No collisions: every re-exported name is unique
 * within this namespace. Propose-only, append-only, fail-closed — confers NO ACTIVE state.
 */

export * from "./types.ts";
export * from "./hashing.ts";
export * from "./append-only.ts";
export * from "./test-harness.ts";
export * from "./registries/index.ts";
export * from "./audit-chain.ts";
export * from "./audit-verifier.ts";
export * from "./composition-root.ts";

// Wave-A Authority Runtime Foundation (PCAMG-RUNTIME-0102A) — additive, read-over-Wave-1.
// Namespaced re-exports avoid any collision with the `export *` surface above (e.g. the Wave-1
// audit-verifier's `verifyChain`/`AuditChainVerificationResult`). Reachable through the platform
// control surface as `constitutionalGovernance.authorityRuntime` / `.authorityVerification`.
// Read-only, propose-only, fail-closed: confers NO ACTIVE state and originates NO authority.
export * as authorityRuntime from "./authority/index.ts";
export * as authorityVerification from "./verification/index.ts";

// Wave-B Constitutional Resolution Layer (PCAMG-RUNTIME-0107A) — additive, read-over-Wave-A/Wave-1.
// Namespaced re-export avoids any collision with the surfaces above (e.g. its resolution-audit
// verifiers `verifyResolutionAudit`/`verifyResolutionReplay` are distinct from the Wave-1 audit
// verifier's `verifyChain`/`verifyReplay`). Reachable through the platform control surface as
// `constitutionalGovernance.constitutionalResolution`. Read-only resolvers + append-only resolution
// audit: confers NO ACTIVE state, originates NO authority, and appends nothing to the governance chain.
export * as constitutionalResolution from "./constitutional-resolution/index.ts";

// Wave-C Governance Evaluation Layer (PCAMG-RUNTIME-0112A) — additive, read-over-Wave-B/Wave-A/Wave-1.
// Namespaced re-export avoids any collision with the surfaces above. Reachable through the platform
// control surface as `constitutionalGovernance.governanceEvaluation`. Read-only evaluation engines +
// append-only evidence emission: confers NO ACTIVE state, originates NO authority, executes NO
// governance, and creates NO activation pathway (Wave-C/D boundary).
export * as governanceEvaluation from "./governance-evaluation/index.ts";

// Wave-D Execution Eligibility Layer (PCAMG-RUNTIME-0202B) — additive, read-over-Wave-C/Wave-B/Wave-A/Wave-1.
// Namespaced re-export avoids any collision with the surfaces above. Reachable through the platform
// control surface as `constitutionalGovernance.executionEligibility`. Read-only eligibility assessment
// + append-only evidence emission: confers NO ACTIVE state, originates NO authority, executes NO
// governance, triggers NO execution, and creates NO activation pathway. `ELIGIBLE` means "MAY advance
// toward a future execution phase" — never authorization-to-execute (R-1 / R-3 semantic firewall).
export * as executionEligibility from "./execution-eligibility/index.ts";
