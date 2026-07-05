/**
 * UCOS PI-11 Simulation Fabric — shared types & additive async seams (AD-0022, SIM-PLAN-001 §4).
 *
 * The Simulation Fabric is a governed *what-if / projection* layer: it runs bounded,
 * deterministic-by-default scenarios inside disposable, snapshot-isolated sandboxes, reads governed
 * state via the existing fabrics (read-only), and routes ALL governed change through the ratified
 * Evolution Fabric (PI-6). It projects and proposes; it never autonomously actuates a target
 * (SIM-COND-3 non-actuation). No substrate core dir is modified (SIM-COND-1); crypto/audit are reused
 * from the federation fabric (SIM-COND-2, no custom cryptography).
 *
 * Records are runtime data under the reserved `simulation:` metadata namespaces (AD-0022 §2). Async
 * seams are introduced ALONGSIDE existing interfaces (B6, additive), mirroring FED-ARCH-001.
 */

import type { Provenance } from "../types.ts";

// ------------------------------- Error taxonomy -------------------------------

export type SimulationErrorCode =
  | "SIMULATION_DENIED" // deny-by-default authorization / policy
  | "SANDBOX_ESCAPE" // S1: write outside the run sandbox keyspace
  | "SNAPSHOT_INVALID" // S2/S7: unsigned / tampered / expired / replayed baseline
  | "NON_DETERMINISTIC" // S3: ungated non-deterministic contribution
  | "CONSTRAINT_VIOLATION" // S4/S6: hard constraint / preserved invariant / classification
  | "BUDGET_EXCEEDED" // S5: horizon / steps / entities / wall-budget
  | "CLASSIFICATION_LEAK" // S6: cross-class emit to a lower classification
  | "SEPARATION_OF_DUTIES" // S8: certifier == modeller, or a self-promote attempt
  | "FEDERATION_DENIED" // S9: foreign contribution over-cap / partition / non-advisory
  | "AUDIT_DIVERGENCE" // S10: tamper / unexplained projection
  | "SCOPE_VIOLATION" // S11: civilization/existential scope without Board authorization
  | "TWIN_DRIFT" // S12: stale / impersonating twin
  | "FDG_UNBOUND" // FDG-INT/MEM/ONT: premature binding of a deferred surface
  | "SIMULATION_VALIDATION_FAILED"; // structural / input validation

/** Fail-closed simulation error. Every deny path throws (or returns) a typed error and is audited. */
export class SimulationError extends Error {
  readonly code: SimulationErrorCode;
  readonly details: Record<string, unknown>;

  constructor(code: SimulationErrorCode, message: string, details: Record<string, unknown> = {}) {
    super(message);
    this.name = "SimulationError";
    this.code = code;
    this.details = details;
  }
}

// ------------------------------- Classification (S4/S6) -------------------------------

/** Ordered classification lattice. A projection/impact inherits the MAX class of its inputs. */
export type Classification = "public" | "internal" | "confidential" | "secret";

export const CLASS_ORDER: readonly Classification[] = ["public", "internal", "confidential", "secret"];

export function classRank(c: Classification): number {
  return CLASS_ORDER.indexOf(c);
}

/** The higher (more restrictive) of two classifications. */
export function maxClass(a: Classification, b: Classification): Classification {
  return classRank(a) >= classRank(b) ? a : b;
}

// ------------------------------- C1 Simulation Authority -------------------------------

/**
 * Enumerated, signed, revocable simulation powers. **None is a commit/actuate power** (B5): the
 * fabric holds no independent write path; governed change flows only through the Evolution Fabric.
 */
export type SimulationPower = "scenario" | "decision" | "revocation" | "federated-simulation";

export type SimulationAuthorityStatus = "active" | "revoked";

export interface SimulationAuthorityRecord {
  authorityId: string;
  owner: string; // principal id
  powers: SimulationPower[]; // enumerated; never includes a commit power
  scope: string; // e.g. "*", "scenario:standard:*" — glob
  keyRef: string; // resolves to a PUBLIC key in the KeyRegistry (S3: no key material inline)
  /** Maximum scenario class this authority may authorize; civilization requires Board (SGP-9). */
  maxClass?: Classification;
  status: SimulationAuthorityStatus;
  provenance?: Provenance;
}

// ------------------------------- C2 Digital Twin -------------------------------

export type TwinState = "defined" | "bound" | "active" | "stale" | "retired";

/**
 * A signed, expiring baseline snapshot of a governed target. Verified via `federation/assertions.ts`
 * (Ed25519); expiry + replay-nonce enforced (S2/S7). The twin never writes back to the target.
 */
export interface SignedSnapshot {
  targetRef: string;
  /** Opaque governed state copy (read-only baseline). */
  state: Record<string, unknown>;
  issuer: string;
  keyRef: string;
  issuedAt: number;
  expiresAt: number;
  nonce: string;
  /** Classification of the captured state (drives S4/S6 inheritance). */
  classification: Classification;
  signature?: string; // hex over canonical(snapshot without `signature`)
}

export interface DigitalTwinRecord {
  twinId: string;
  targetRef: string;
  state: TwinState;
  fidelity: number; // 0..1
  snapshotHash?: string;
  snapshotExpiresAt?: number;
  classification?: Classification;
  boundAt?: number;
  /** FDG-MEM (deferred): a memory read hook. MUST be absent during PI-11 (binding denied). */
  memoryRef?: string;
  provenance?: Provenance;
}

// ------------------------------- C3/C4 Scenario -------------------------------

export type ScenarioClass = "standard" | "civilization";

export type ScenarioState = "defined" | "authorized" | "active" | "completed" | "aborted";

/** A bounded intervention applied inside the sandbox only. */
export interface Intervention {
  path: string; // key within the sandboxed state
  value: unknown;
}

/** Hard bounds enforced every step (S5 resource exhaustion, S11 scope creep). */
export interface SimulationBudget {
  maxHorizon: number; // logical time units
  maxSteps: number;
  maxEntities: number;
  maxWallMs: number;
}

export interface ScenarioRecord {
  scenarioId: string;
  authorityId: string;
  twinId: string;
  class: ScenarioClass;
  interventions: Intervention[];
  budget: SimulationBudget;
  constraintSetId: string;
  state: ScenarioState;
  /** Present only when a civilization-class scenario has explicit Board authorization (SGP-9). */
  boardAuthorization?: string;
  classification: Classification;
  provenance?: Provenance;
}

// ------------------------------- C5 Predictive Model -------------------------------

export interface ForecastInput {
  baseline: Record<string, unknown>;
  horizon: number;
  seed: string;
}

export interface ForecastResult {
  modelId: string;
  output: Record<string, unknown>;
  deterministic: boolean;
}

/** C5 adapter interface. Deterministic models are commit-eligible; non-det are verifier-gated. */
export interface PredictiveModel {
  readonly modelId: string;
  readonly kind: "deterministic" | "non-deterministic";
  forecast(input: ForecastInput): Promise<ForecastResult>;
}

/** Gates non-deterministic contributions (FDG-INT). Without an attestation, non-det is advisory-only. */
export interface DeterministicVerifier {
  attest(result: ForecastResult, seed: string): Promise<VerifierAttestation | undefined>;
}

export interface VerifierAttestation {
  modelId: string;
  seed: string;
  outputHash: string;
  attestedAt: number;
}

export type PredictiveModelStatus = "active" | "revoked";

export interface PredictiveModelRecord {
  modelId: string;
  kind: "deterministic" | "non-deterministic";
  status: PredictiveModelStatus;
}

// ------------------------------- C6 Constraints -------------------------------

export type ConstraintKind = "hard" | "soft";

export interface Constraint {
  id: string;
  kind: ConstraintKind;
  /** Key in the projected state to inspect. */
  path: string;
  /** Predicate: value must equal / be <= / be >= the bound. */
  op: "eq" | "lte" | "gte" | "neq";
  bound: number | string | boolean;
  /** FDG-ONT (deferred): an `ontology:*` surface reference. If set and unbound ⇒ deny, never skip. */
  ontologyRef?: string;
}

export interface ConstraintSet {
  constraintSetId: string;
  hard: Constraint[];
  soft: Constraint[];
  /** Named invariants that must hold across the projection (preserved-invariant checks). */
  preservedInvariants: Constraint[];
}

export interface ConstraintResult {
  ok: boolean; // hard + preserved invariants all satisfied
  hardFailures: string[];
  softWarnings: string[];
  invariantFailures: string[];
}

// ------------------------------- C8 Projection -------------------------------

/** Reproducibility tuple — the deterministic inputs a projection is a pure function of (A2). */
export interface ReproducibilityTuple {
  snapshotHash: string;
  scenarioHash: string;
  modelId: string;
  seed: string;
  constraintSetId: string;
  policyHash: string;
}

export interface ProjectionRecord {
  projectionId: string;
  runId: string;
  projectedState: Record<string, unknown>;
  reproducibility: ReproducibilityTuple;
  /** Deterministic digest of `(reproducibility, projectedState)`; re-derivable (A2). */
  projectionHash: string;
  /** Human/machine rationale; a projection lacking a resolvable rationale is rejected (S10). */
  rationale: string;
  classification: Classification;
  valid: boolean; // false ⇒ never promotable
}

// ------------------------------- C9 Impact -------------------------------

export type ImpactRecommendation = "adopt-proposal" | "reject" | "inconclusive";

export interface ImpactDelta {
  path: string;
  before: unknown;
  after: unknown;
}

export interface ImpactRecord {
  impactId: string;
  runId: string;
  deltas: ImpactDelta[];
  risks: string[];
  recommendation: ImpactRecommendation;
  classification: Classification; // inherited MAX of inputs (S6)
  /** Advisory only — carries zero governed side effects until Evolution-promoted. */
  advisory: true;
}

// ------------------------------- Run -------------------------------

export type RunState = "allocated" | "running" | "projected" | "assessed" | "promoted" | "torn-down" | "aborted";

export interface SimulationRunRecord {
  runId: string;
  scenarioId: string;
  sandboxKey: string; // `simulation:sandbox:<runId>:`
  state: RunState;
  startedAt: number;
  classification: Classification;
}

// ------------------------------- Audit -------------------------------

export type SimAuditEvent =
  | "AUTHORITY_REGISTERED"
  | "TWIN_BOUND"
  | "TWIN_STALE"
  | "SCENARIO_AUTHORIZED"
  | "RUN_ALLOCATED"
  | "SANDBOX_WRITE_REJECTED"
  | "PROJECTED"
  | "CONSTRAINT_CHECKED"
  | "IMPACT_ASSESSED"
  | "FOREIGN_CONTRIBUTION"
  | "REVOKED"
  | "PROMOTION_DENIED"
  | "PROMOTED"
  | "TORN_DOWN"
  | "DENY";

export interface SimAuditEntry {
  at: number;
  event: SimAuditEvent;
  runId?: string;
  actor: string;
  detail: string;
  /** Optional reproducibility digest recorded for projections/promotions (A2/A8). */
  reproHash?: string;
}

/** Audit sink seam → thin-wraps the federation hash-chained audit (M12). */
export interface SimulationSink {
  record(entry: SimAuditEntry): void;
}

// ------------------------------- Baseline read seam (read-only) -------------------------------

/**
 * Read-only baseline source (Knowledge/Metadata query surface). Additive async seam; the fabric never
 * writes through it. Absent/failed source ⇒ baseline unresolvable ⇒ twin non-projectable (fail-closed).
 */
export interface SnapshotSource {
  readonly name: string;
  snapshot(targetRef: string): Promise<SignedSnapshot | undefined>;
}
