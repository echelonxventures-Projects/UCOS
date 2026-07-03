/**
 * UCOS PI-6 Evolution Fabric — public surface (AD-0019).
 *
 * Governed change-management (realizing IP-14 Migration-Only Evolution, IP-15 Backward-Compatibility
 * Governance), built additively over the AD-0016/AD-0017/AD-0018 substrate, control, and federation
 * fabrics. Proposal -> approval -> certification -> ratification -> atomic apply -> (active |
 * rolled-back | failed), with deny-by-default gates, separation of duties, a recursion/self-modification
 * governor, deterministic rollback, federation protection, and a hash-chained tamper-evident audit.
 *
 * No substrate core dir is modified; the fabric orchestrates only PUBLIC seams, and the governor makes
 * the fabric's own namespace a non-expressible target (no self-modification). Categorically distinct
 * from the deferred Ω∞ existential self-evolution (AD-0014).
 */

// Types & helpers (explicit to avoid re-export ambiguity with federation's VerificationResult)
export type {
  EvolutionState,
  ChangeClass,
  EvolutionTarget,
  EvolutionOp,
  ReverseOp,
  EvolutionUnit,
  ProposalOrigin,
  EvolutionProposal,
  ApprovalRecord,
  EvolutionCertification,
  EvolutionRatification,
  FederationReRatificationToken,
  EvoAuthorityStatus,
  EvolutionCARecord,
  EvolutionRARecord,
  RevocableEvoKind,
  StateCapture,
  EvolutionSnapshot,
  GovernorLimits,
  GovernorConfig,
  GovernorDecision,
  EvolutionAuditEvent,
  EvolutionAuditEntry,
  ApplyResult,
} from "./types.ts";
export { TOMBSTONE, isTombstone } from "./types.ts";

// Unit & proposal
export { unitHash, validateUnit, createUnit } from "./evolution-unit.ts";
export { mintProposal, verifyProposal } from "./evolution-proposal.ts";
export type { MintProposalOptions } from "./evolution-proposal.ts";

// Lifecycle & state
export { canTransition, assertTransition, isTerminal } from "./evolution-lifecycle.ts";
export { EvolutionStateMachine } from "./evolution-state-machine.ts";

// Governor (E10/E11/E12)
export {
  EvolutionGovernor,
  defaultGovernorConfig,
  DEFAULT_PROHIBITED_CODE_PATHS,
  DEFAULT_RESERVED_METADATA_PREFIXES,
} from "./evolution-governor.ts";

// Registry
export { EvolutionRegistry } from "./evolution-registry.ts";

// Security authorities
export { EvolutionCertificationAuthority } from "./evolution-certification-authority.ts";
export { EvolutionRatificationAuthority } from "./evolution-ratification-authority.ts";
export { EvolutionRevocationAuthority } from "./evolution-revocation-authority.ts";

// Atomic apply & rollback
export { EvolutionSnapshotEngine } from "./evolution-snapshot-engine.ts";
export { EvolutionTransactionManager } from "./evolution-transaction-manager.ts";
export { EvolutionRollbackEngine } from "./evolution-rollback-engine.ts";
export { EvolutionImpactAnalyzer } from "./evolution-impact-analyzer.ts";
export type { ImpactReport } from "./evolution-impact-analyzer.ts";

// Federation protection
export { EvolutionFederationGuard } from "./evolution-federation-guard.ts";

// Audit
export { EvolutionAuditLog, EVO_GENESIS_HASH } from "./evolution-audit-log.ts";
export type { EvolutionChainedEntry, EvoDivergence, EvoReconciliationResult } from "./evolution-audit-log.ts";

// Orchestrator + assembly
export { EvolutionApplyOrchestrator, createEvolution } from "./evolution-apply-orchestrator.ts";
export type { EvolutionApplyOptions, EvolutionOptions, EvolutionFabric } from "./evolution-apply-orchestrator.ts";
