/**
 * UCOS PI-4 Control Fabrics — public surface (AD-0017).
 *
 * Identity, Trust, Policy, and Governance runtimes + the Control Plane (Policy Enforcement Point),
 * built additively on the AD-0016 substrate. Registry/metadata/configuration-first; deny-by-default;
 * 0 hardcoded identities, permissions, or policies.
 */

// Shared types & errors
export type {
  Credential,
  IdentityRecord,
  IdentityStatus,
  PrincipalRef,
  IdentityProvider,
  TrustRequirement,
  TrustAuthority,
  PolicyEffect,
  PolicyTarget,
  PolicyRule,
  PolicyRecord,
  GovernanceProcess,
  ApprovalRecord,
  CertificationRecord,
  DecisionContext,
  Decision,
  AuditEntry,
} from "./types.ts";
export * from "./errors.ts";

// Identity Runtime
export { IdentityRegistry, IDENTITY_SCHEMA } from "./identity/identity-registry.ts";
export { IdentityResolver } from "./identity/identity-resolver.ts";
export { TokenCredentialVerifier } from "./identity/credential-verifier.ts";
export type { CredentialVerifier } from "./identity/credential-verifier.ts";

// Trust Runtime
export { TrustEvaluator } from "./trust/trust-evaluator.ts";
export type { TrustEvaluation } from "./trust/trust-evaluator.ts";

// Policy Runtime
export { PolicyRegistry, POLICY_SCHEMA } from "./policy/policy-registry.ts";
export { PolicyEvaluator } from "./policy/policy-evaluator.ts";

// Governance Runtime
export { GovernanceRegistry } from "./governance/governance-registry.ts";

// Control Plane (Policy Enforcement Point)
export { ControlPlane } from "./control-plane.ts";
export type { ControlPlanePorts, ControlDecision } from "./control-plane.ts";
export { InMemoryAuditLog } from "./audit-log.ts";
export type { AuditSink } from "./audit-log.ts";

// Assembly
export { createControlPlane } from "./bootstrap.ts";
export type { ControlPlaneOptions, ControlFabric } from "./bootstrap.ts";

// PI-5 Federation Fabric (AD-0018) — additive over the PI-4 control fabrics.
export type { AsyncIdentityProvider, AsyncTrustAuthority, Provenance } from "./types.ts";
export * from "./federation/index.ts";

// PI-6 Evolution Fabric (AD-0019) — additive governed change-management over the substrate.
export * from "./evolution/index.ts";

// PI-7 Knowledge Fabric (AD-0020) — additive governed knowledge over substrate + federation + evolution.
// Namespaced re-export to avoid barrel collisions with federation/evolution generic names
// (unitHash, createUnit, canTransition, namespacedId, ...). Import specifics from ./knowledge/index.ts.
export * as knowledge from "./knowledge/index.ts";

// PI-8 Ontology Fabric (AD-0021) — additive governed semantic layer over the knowledge fabric.
// Namespaced re-export to avoid barrel collisions with the federation/evolution/knowledge generic
// names (unitHash, createUnit, canTransition, ...). Import specifics from ./ontology/index.ts.
export * as ontology from "./ontology/index.ts";

// PI-9 Memory Fabric (AD-0023) — additive governed memory over substrate + control + federation +
// evolution + knowledge. Namespaced re-export to avoid barrel collisions with the other fabrics'
// generic names (unitHash, createUnit, canTransition, ...). Import specifics from ./memory/index.ts.
export * as memory from "./memory/index.ts";

// PI-12 Ultimate Readiness Fabric (B06 / AD-0024) — additive, continuous, deny-by-default platform
// readiness assessment (Policy · Compliance · Gap-Detection · Self-Inspection · Evolution-Readiness ·
// Certification · Meta-Governance). Namespaced re-export to avoid barrel collisions with the other
// fabrics' generic names (canTransition, createSignal, ...). Import specifics from ./readiness/index.ts.
export * as readiness from "./readiness/index.ts";

// B02 Operational Proof Fabric (OPF) — additive governed operational evidence (monitoring, telemetry,
// observability, audit, incident tracking, health, operational proof) over substrate + control +
// federation + evolution. Namespaced re-export to avoid barrel collisions with other fabrics' generic
// names (unitHash, createUnit, canTransition, ...). Import specifics from ./operations/index.ts.
export * as operations from "./operations/index.ts";

// PI-11 Simulation Fabric (AD-0022, conditional scoped Article IX release) — additive governed what-if
// / projection layer over substrate + control + federation + evolution + knowledge. Deterministic-by-
// default, non-actuating, Evolution-only commit. Namespaced re-export to avoid barrel collisions with
// the other fabrics' generic names. Import specifics from ./simulation/index.ts.
export * as simulation from "./simulation/index.ts";

// Constitutional Governance Runtime (CGR) — Wave-1 propose-only substrate (PCAMG-RUNTIME-0021/-0031).
// The eleven append-only, content-hashed, up-traceable governance registries + the deterministic
// composition root + the tamper-evident audit hash-chain and its offline verifier. Namespaced
// re-export to avoid barrel collisions with the other fabrics' generic names (AuditEvent, AuditSink,
// ConstitutionalRegistry, ...). Import specifics from ./constitutional-governance/index.ts.
// Propose-only, append-only, fail-closed: confers NO ACTIVE state and originates NO authority.
export * as constitutionalGovernance from "./constitutional-governance/index.ts";
