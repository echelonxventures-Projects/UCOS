/**
 * UCOS Constitutional Program Compiler — domain types.
 *
 * These types model the Program Registry (the single source of truth for the
 * roadmap) and the computed Program State. Nothing here encodes program content:
 * all content lives in registry/program/*.json and is loaded at runtime.
 */

export type WorkItemStatus =
  | "OPEN"
  | "READY"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "EXTERNAL_BLOCKED"
  | "COMPLETE";
export type EvidenceState = "PENDING" | "SUBMITTED" | "VERIFIED" | "CERTIFIED";
export type ClosureVerdict = "GO" | "GO_WITH_CONDITIONS" | "NO_GO";
/** Constitutional lock lifecycle (PHASE G.2, WS2). */
export type LockState = "OPEN" | "LOCKED" | "EXTERNAL_LOCKED" | "RELEASED";
export type WorkItemType =
  | "work-item"
  | "activity"
  | "prompt"
  | "program-increment"
  | "governance";

/** A single executable unit of the program, as declared in work-items.json. */
export interface WorkItem {
  id: string;
  title: string;
  type: WorkItemType;
  phase: string;
  /** The status asserted by the registry author. The engine COMPUTES the effective status. */
  declaredStatus: WorkItemStatus;
  owner: string;
  /** Lower number = higher priority when several items are simultaneously READY. */
  priority: number;
  acceptanceCriteria: string[];
  requiredEvidence: string[];
  governanceGates: string[];
  constitutionalConstraints: string[];
}

export interface DependencyEdge {
  from: string;
  dependsOn: string;
}

export interface EvidenceRecord {
  id: string;
  workItem: string;
  phase: string;
  state: EvidenceState;
  artifact: string | null;
  report: string | null;
  note?: string;
}

export interface ClosureDefinition {
  id: string;
  title: string;
  description: string;
  governanceGates: string[];
  dependencies: string[];
  requiredEvidence: string[];
  closureCriteria: string[];
}

export interface GapRecord {
  id: string;
  description: string;
  workItem: string | null;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  category: string;
  status: "OPEN" | "RESOLVED";
  autoDiscovered?: boolean;
}

/** Review-trigger model (PHASE G.2, WS3). Governs when an external blocker may be re-opened. */
export interface ReviewTrigger {
  type: string;
  watchEvidence: string[];
  baselineStates: Record<string, EvidenceState>;
  baselineAttestationChainLength?: number;
  reopenWhen: string;
  additionalTriggers?: string[];
}

/**
 * External Blocker record (PHASE G.2, WS1). A program item whose closure cannot be
 * achieved by software and requires an external actor to perform a governed action.
 * Field names mirror the Phase G.2 specification (snake_case) exactly.
 */
export interface ExternalBlocker {
  id: string;
  target: string;
  targetClosure?: string;
  blockerClass: "EXTERNAL";
  solvableBySoftware: boolean;
  postActionSolvableBySoftware?: boolean;
  reason: string;
  required_actor: string;
  required_action: string;
  required_evidence: string[];
  required_authority?: string;
  blockedWorkItems: string[];
  blockedEvidence: string[];
  externalGate?: string;
  last_review_date: string;
  last_review_phase?: string;
  last_review_determination?: string;
  review_trigger: ReviewTrigger;
  rediscoveryNote?: string;
}

/** Constitutional Lock definition (PHASE G.2, WS2/WS7). */
export interface ConstitutionalLock {
  id: string;
  closure: string;
  title: string;
  declaredState: LockState;
  externalBlocker?: string;
  releaseConditions: string[];
  requiredEvidence: string[];
  requiredActor: string;
  requiredAuthority: string;
  releasableBySoftware: boolean;
  postGateSoftwareSolvable?: boolean;
  note?: string;
}

/** Computed external blocker: the record plus the compiler's review-trigger determination. */
export interface ComputedExternalBlocker {
  blocker: ExternalBlocker;
  /** true iff a review trigger has fired (new evidence / designation / attestation / authority action). */
  reviewPermitted: boolean;
  /** Evidence ids that advanced beyond their recorded baseline (the trigger evidence). */
  advancedEvidence: string[];
  /** Rediscovery-prevention recommendation surfaced to agents (WS5). */
  recommendation: "DO_NOT_REINVESTIGATE" | "REVIEW_PERMITTED";
  reasons: string[];
}

/** Computed constitutional lock: the definition plus the engine-derived effective state. */
export interface ComputedLock {
  lock: ConstitutionalLock;
  state: LockState;
  closureVerdict: ClosureVerdict | "UNKNOWN";
  externalBlocked: boolean;
  reviewPermitted: boolean;
  evidence: EvidenceRollup;
  reasons: string[];
}

export interface ProgramStateFile {
  artifactId: string;
  program: string;
  programLayerVersion: string;
  sourceOfTruth: boolean;
  description: string;
  authority: Record<string, unknown>;
  constitutionalLock: {
    articleIX: string;
    constructionBlocked: boolean;
    scopedReleases: string[];
    note: string;
  };
  canonicalReality: Record<string, unknown>;
  currentPhase: { id: string; title: string; status: string };
  statusVocabulary: string[];
  evidenceVocabulary: string[];
  closureVocabulary: string[];
  generatedOutputs: Record<string, string>;
  lastComputed: string | null;
}

/** The raw registry loaded from disk (before any computation). */
export interface ProgramRegistry {
  state: ProgramStateFile;
  workItems: WorkItem[];
  dependencies: DependencyEdge[];
  evidence: EvidenceRecord[];
  closures: ClosureDefinition[];
  gaps: GapRecord[];
  externalBlockers: ExternalBlocker[];
  locks: ConstitutionalLock[];
}

/** Per-item computed evidence roll-up. */
export interface EvidenceRollup {
  required: number;
  certified: number;
  verified: number;
  submitted: number;
  pending: number;
  missing: number;
  /** true iff every required evidence id is at least VERIFIED. */
  satisfied: boolean;
}

/** A work item enriched with computed status, readiness, and evidence. */
export interface ComputedWorkItem {
  item: WorkItem;
  status: WorkItemStatus;
  unmetDependencies: string[];
  metDependencies: string[];
  dependents: string[];
  evidence: EvidenceRollup;
  /** Populated when declaredStatus=COMPLETE but evidence is not satisfied. */
  evidenceInconsistency: boolean;
  /** True iff the item is EXTERNAL_BLOCKED (gated solely by an external actor). WS1/WS4. */
  externalBlocked?: boolean;
  /** The external blocker id gating this item, when externalBlocked. */
  externalBlockerId?: string;
  reasons: string[];
}

export interface ComputedClosure {
  definition: ClosureDefinition;
  verdict: ClosureVerdict;
  unmetDependencies: string[];
  evidence: EvidenceRollup;
  reasons: string[];
}

export interface AuthorizationDecision {
  workItemId: string;
  authorized: boolean;
  decision: "AUTHORIZED" | "REJECTED";
  checks: { name: string; passed: boolean; detail: string }[];
  reasons: string[];
}

export interface ProgramHealth {
  total: number;
  complete: number;
  inProgress: number;
  ready: number;
  blocked: number;
  externalBlocked: number;
  open: number;
  completionPercent: number;
  evidenceInconsistencies: string[];
  cycles: string[][];
  orphanDependencies: string[];
}

export interface GovernanceHealth {
  articleIX: string;
  constructionBlocked: boolean;
  closures: ComputedClosure[];
  overallVerdict: ClosureVerdict;
}

/** The full computed program state — the compiler's primary output. */
export interface ProgramState {
  program: string;
  programLayerVersion: string;
  computedAt: string;
  currentPhase: { id: string; title: string; status: string };
  items: ComputedWorkItem[];
  nextExecutableWorkItem: ComputedWorkItem | null;
  readyItems: string[];
  blockedItems: string[];
  externalBlockedItems: string[];
  missingEvidence: { workItem: string; evidenceId: string; state: EvidenceState }[];
  gaps: GapRecord[];
  externalBlockers: ComputedExternalBlocker[];
  constitutionalLocks: ComputedLock[];
  programHealth: ProgramHealth;
  governanceHealth: GovernanceHealth;
  warnings: string[];
}
