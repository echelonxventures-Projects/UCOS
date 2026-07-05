/**
 * CGR registries barrel (Wave-1 glue).
 *
 * Re-exports the registry substrate + the eleven registry factories. This is the registries
 * subtree barrel ONLY. The top-level namespace barrel `cg/index.ts` (CGR-CORE-04) and the
 * `control/index.ts` EXTEND re-export are EXPLICITLY EXCLUDED from Wave-1 execution (0029).
 */

export { ConstitutionalRegistry } from "./registry-base.ts";
export type { RegistryConfig, ContentValidator } from "./registry-base.ts";

export { createPrincipleRegistry } from "./principle-registry.ts";
export type { PrincipleDeps } from "./principle-registry.ts";

export { createMetaRegistry } from "./meta-registry.ts";
export type { MetaDeps } from "./meta-registry.ts";

export { createGovernanceCandidateRegistry, GOV_KEYSPACE } from "./governance-candidate-registry.ts";
export type { GovernanceDeps } from "./governance-candidate-registry.ts";

export { createCenterRegistry } from "./center-registry.ts";
export type { CenterDeps } from "./center-registry.ts";

export { createDomainRegistry } from "./domain-registry.ts";
export type { DomainDeps } from "./domain-registry.ts";

export { createPolicyRegistry, policyEffect } from "./policy-registry.ts";
export type { PolicyDeps } from "./policy-registry.ts";

export { createCapabilityRegistry } from "./capability-registry.ts";
export type { CapabilityDeps } from "./capability-registry.ts";

export { createConsentRegistry } from "./consent-registry.ts";
export type { ConsentDeps } from "./consent-registry.ts";

export { createDecisionRegistry } from "./decision-registry.ts";
export type { DecisionDeps } from "./decision-registry.ts";

export { createTraceRegistry } from "./trace-registry.ts";
export type { TraceDeps } from "./trace-registry.ts";

export { createAuditRegistry } from "./audit-registry.ts";
export type { AuditDeps } from "./audit-registry.ts";
