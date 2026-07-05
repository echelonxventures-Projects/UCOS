/**
 * CGR-CORE-01 — Constitutional Governance Runtime shared schema (Wave 1).
 *
 * Authorized by PCAMG-RUNTIME-0028 / -0029; grounded in PCAMG-RUNTIME-0001 §2 and -0002 §1.
 * Union-string types + interfaces only (tsconfig `erasableSyntaxOnly`: no runtime `enum`,
 * no runtime `namespace`, no parameter properties).
 *
 * Doctrine enforced at the type layer:
 *   - No ACTIVE state: `RecordStatus` cannot represent "active". Status is `proposed` | `superseded`.
 *   - Propose-only, append-only, content-hashed, up-traceable governance records.
 */

/** The eleven authorized registries. No `governance-runtime`; no new registry. */
export type RegistryName =
  | "REG-PRIN"
  | "REG-META"
  | "REG-GOV"
  | "REG-CENTER"
  | "REG-DOMAIN"
  | "REG-POLICY"
  | "REG-CAP"
  | "REG-CONSENT"
  | "REG-DECISION"
  | "REG-TRACE"
  | "REG-AUDIT";

/** Closed set of registry names, for iteration / validation. */
export const REGISTRY_NAMES: readonly RegistryName[] = [
  "REG-PRIN",
  "REG-META",
  "REG-GOV",
  "REG-CENTER",
  "REG-DOMAIN",
  "REG-POLICY",
  "REG-CAP",
  "REG-CONSENT",
  "REG-DECISION",
  "REG-TRACE",
  "REG-AUDIT",
] as const;

/**
 * Record status. **ACTIVE is deliberately not representable** (propose-only doctrine).
 * A record is `proposed` when appended and becomes `superseded` (derived) once a later
 * record links to it via `supersedes`.
 */
export type RecordStatus = "proposed" | "superseded";

/** The eight derivation-edge relations (PCAMG-RUNTIME-0001 §6.2). */
export type EdgeRelation =
  | "derives-from"
  | "refines"
  | "realizes"
  | "governed-by"
  | "subsumed-by"
  | "supersedes"
  | "depends-on"
  | "federates-with";

export const EDGE_RELATIONS: readonly EdgeRelation[] = [
  "derives-from",
  "refines",
  "realizes",
  "governed-by",
  "subsumed-by",
  "supersedes",
  "depends-on",
  "federates-with",
] as const;

/** Deterministic clock seam (injected). Returns an ISO-8601 timestamp string. */
export type Clock = () => string;

/** A registry-specific content body. */
export type RecordContent = Readonly<Record<string, unknown>>;

/**
 * The canonical, immutable governance record shape shared by every registry.
 * `status` is a read-time projection derived from supersession links; the underlying
 * append-only log is never mutated.
 */
export interface ConstitutionalRecord {
  /** Deterministic identity: sha256(canonical({registry, logicalId, version, supersedes})). */
  readonly recordUuid: string;
  /** Owning registry. */
  readonly registry: RegistryName;
  /** Namespaced logical id (e.g. "PCAMG-PRIN-001"). */
  readonly logicalId: string;
  /** Immutable semantic version. */
  readonly version: string;
  /** Single accountable owner (RG-3 / single-owner). */
  readonly ownerAuthority: string;
  /** Derived status — never "active". */
  readonly status: RecordStatus;
  /** Append-only lineage link to the superseded predecessor's recordUuid, or null. */
  readonly supersedes: string | null;
  /** Up-trace references (RG-7). Empty only for the Layer-0 principle root. */
  readonly upTrace: readonly string[];
  /** Registry-specific body. */
  readonly content: RecordContent;
  /** sha256 hex over the canonical semantic view (tamper-evidence / RG-5). */
  readonly contentHash: string;
  /** Attributable creator (A-1). */
  readonly createdBy: string;
  /** Creation timestamp from the injected clock. */
  readonly createdAt: string;
  /** Monotonic sequence within the owning registry's append-only log. */
  readonly seq: number;
}

/** Input to propose a new record (first version of a logical id). */
export interface ProposeInput {
  readonly logicalId: string;
  readonly version: string;
  readonly ownerAuthority: string;
  readonly content: RecordContent;
  readonly createdBy: string;
  /** Up-trace references; required for every non-root registry (RG-7). */
  readonly upTrace?: readonly string[];
}

/** Input to supersede an existing record with a new version (append-only replacement). */
export interface SupersedeInput extends ProposeInput {
  /** The prior version being superseded (must already exist). */
  readonly priorVersion: string;
}

/** An attributable audit event emitted on every append/supersede (RG-8 emission seam). */
export interface AuditEvent {
  readonly actor: string;
  readonly action: "PROPOSE" | "SUPERSEDE";
  readonly registry: RegistryName;
  readonly subjectRef: string; // logicalId@version
  readonly recordUuid: string;
  readonly contentHash: string;
  readonly at: string;
}

/** Audit emission seam. The cross-registry wiring to REG-AUDIT is CGR-CORE-04 (Wave-1 finalization, out of scope here). */
export type AuditSink = (event: AuditEvent) => void;
