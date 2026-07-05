/**
 * CGR-REG-base — the generic ConstitutionalRegistry enforcing RG-1..8 (Wave 1).
 *
 * RG scheme (per PCAMG-RUNTIME-0015 §D, the contract bound to this base):
 *   RG-1 Propose-only   — records enter `proposed`; ACTIVE is never representable/conferrable.
 *   RG-2 Append-only    — no update/delete; only appends to the reused append-only log.
 *   RG-3 Content-hashed  — every record carries a verified contentHash (also single-owner).
 *   RG-4 Supersession-by-link — a change is a new appended record linking to its predecessor.
 *   RG-5 Versioned       — (id, version) unique; version is valid SemVer.
 *   RG-6 Deterministic identity — structural equality ⇒ equal contentHash (order-independent).
 *   RG-7 Traceable       — non-root records reference ≥1 up-trace source.
 *   RG-8 Auditable       — every append/supersede emits an attributable audit event.
 * (Corresponds to PCAMG-RUNTIME-0001/0002 RG-1..8: single-source, append-only, single-owner,
 *  up-trace, tamper-evidence, determinism, secrets-by-ref, fail-closed — all upheld here.)
 *
 * Storage: REUSES the platform `AppendOnlyLog` as the single source of truth. Reads derive from
 * `log.readAll()`, so state is a deterministic replay (RG-6) and the log is never mutated (RG-2).
 * Status is a read-time projection from supersession links.
 */

import type { AppendOnlyLog } from "../../../persistence-runtime/append-only-log.ts";
import { computeContentHash, computeRecordUuid, verifyRecordHash } from "../hashing.ts";
import {
  AppendOnlyError,
  CgNotFoundError,
  CgValidationError,
  assertNoDuplicate,
  assertValidSupersession,
  assertValidVersion,
} from "../append-only.ts";
import type {
  AuditSink,
  Clock,
  ConstitutionalRecord,
  ProposeInput,
  RecordContent,
  RegistryName,
  SupersedeInput,
} from "../types.ts";

/** The persisted envelope (record minus the derived `status`). */
interface StoredEnvelope {
  readonly recordUuid: string;
  readonly registry: RegistryName;
  readonly logicalId: string;
  readonly version: string;
  readonly ownerAuthority: string;
  readonly supersedes: string | null;
  readonly upTrace: readonly string[];
  readonly content: RecordContent;
  readonly contentHash: string;
  readonly createdBy: string;
  readonly createdAt: string;
  readonly seq: number;
}

/** Specialized validator supplied by a concrete registry (deny-by-default; throw to reject). */
export type ContentValidator = (
  input: ProposeInput,
  existing: readonly ConstitutionalRecord[],
) => void;

export interface RegistryConfig {
  readonly registry: RegistryName;
  readonly log: AppendOnlyLog;
  readonly clock: Clock;
  /** RG-7: when true, every record must carry ≥1 up-trace reference. Root (REG-PRIN) = false. */
  readonly requiresUpTrace: boolean;
  /** RG-8 emission seam. Cross-registry wiring to REG-AUDIT is CGR-CORE-04 (out of Wave-1 scope). */
  readonly auditSink?: AuditSink;
  /** Registry-specific validation (immutability, references, SoD, layering, deny-default, …). */
  readonly validateContent?: ContentValidator;
  /** RG-4: allow superseding existing records. REG-AUDIT sets this false (entries are terminal). */
  readonly allowSupersede?: boolean;
}

export class ConstitutionalRegistry {
  readonly #registry: RegistryName;
  readonly #log: AppendOnlyLog;
  readonly #clock: Clock;
  readonly #requiresUpTrace: boolean;
  readonly #auditSink: AuditSink | undefined;
  readonly #validateContent: ContentValidator | undefined;
  readonly #allowSupersede: boolean;

  constructor(config: RegistryConfig) {
    this.#registry = config.registry;
    this.#log = config.log;
    this.#clock = config.clock;
    this.#requiresUpTrace = config.requiresUpTrace;
    this.#auditSink = config.auditSink;
    this.#validateContent = config.validateContent;
    this.#allowSupersede = config.allowSupersede ?? true;
  }

  get registry(): RegistryName {
    return this.#registry;
  }

  /** RG-1: propose the first version of a logical id. Always enters `proposed`; never ACTIVE. */
  propose(input: ProposeInput): ConstitutionalRecord {
    return this.#append(input, null);
  }

  /** RG-4: append-only supersession — a new version linked to the prior. No mutation/deletion. */
  supersede(input: SupersedeInput): ConstitutionalRecord {
    if (!this.#allowSupersede) {
      throw new AppendOnlyError(`${this.#registry} records are terminal and cannot be superseded`, {
        registry: this.#registry,
        logicalId: input.logicalId,
      });
    }
    const existing = this.#projectedAll();
    const prior = assertValidSupersession(existing, input.logicalId, input.priorVersion);
    return this.#append(input, prior.recordUuid);
  }

  /** Fail-closed lookup with verify-on-read (RG-3/RG-5 tamper-evidence). */
  get(logicalId: string, version: string): ConstitutionalRecord | undefined {
    const env = this.#all().find((e) => e.logicalId === logicalId && e.version === version);
    if (!env) return undefined;
    return this.#verifiedProjection(env);
  }

  /** Full ordered version history for a logical id (oldest first). */
  history(logicalId: string): ConstitutionalRecord[] {
    return this.#all()
      .filter((e) => e.logicalId === logicalId)
      .map((e) => this.#verifiedProjection(e));
  }

  /** The current (non-superseded) head for a logical id, if any. */
  getLatest(logicalId: string): ConstitutionalRecord | undefined {
    return this.history(logicalId).find((r) => r.status === "proposed");
  }

  /** Latest non-superseded record per logical id. */
  list(): ConstitutionalRecord[] {
    const ids = new Set(this.#all().map((e) => e.logicalId));
    const out: ConstitutionalRecord[] = [];
    for (const id of ids) {
      const head = this.getLatest(id);
      if (head) out.push(head);
    }
    return out;
  }

  /** Count of appended records. */
  size(): number {
    return this.#log.size();
  }

  // ── internals ───────────────────────────────────────────────────────────

  #all(): StoredEnvelope[] {
    return this.#log.readAll().map((r) => r.event as StoredEnvelope);
  }

  #projectedAll(): ConstitutionalRecord[] {
    const all = this.#all();
    return all.map((e) => this.#project(e, all));
  }

  #append(input: ProposeInput, supersedes: string | null): ConstitutionalRecord {
    // RG-3 single-owner (fail-closed on missing owner).
    if (!input.ownerAuthority || input.ownerAuthority.trim().length === 0) {
      throw new CgValidationError("missing ownerAuthority (RG-3 single-owner)", {
        registry: this.#registry,
        logicalId: input.logicalId,
      });
    }
    // RG-5 versioned.
    assertValidVersion(input.version);

    // RG-7 traceable (non-root registries must carry ≥1 up-trace reference).
    const upTrace = input.upTrace ?? [];
    if (this.#requiresUpTrace && upTrace.length === 0) {
      throw new CgValidationError(`up-trace required (RG-7) for ${this.#registry}`, {
        registry: this.#registry,
        logicalId: input.logicalId,
      });
    }

    const existing = this.#projectedAll();

    // Registry-specific validation (deny-by-default; specialized rules).
    this.#validateContent?.(input, existing);

    // RG-2/RG-5 uniqueness.
    assertNoDuplicate(existing, input.logicalId, input.version);

    const recordUuid = computeRecordUuid({
      registry: this.#registry,
      logicalId: input.logicalId,
      version: input.version,
      supersedes,
    });
    const contentHash = computeContentHash({
      registry: this.#registry,
      logicalId: input.logicalId,
      version: input.version,
      ownerAuthority: input.ownerAuthority,
      supersedes,
      upTrace,
      content: input.content,
    });

    const env: StoredEnvelope = {
      recordUuid,
      registry: this.#registry,
      logicalId: input.logicalId,
      version: input.version,
      ownerAuthority: input.ownerAuthority,
      supersedes,
      upTrace: [...upTrace],
      content: input.content,
      contentHash,
      createdBy: input.createdBy,
      createdAt: this.#clock(),
      seq: this.#log.size(),
    };

    this.#log.append(env);

    // RG-8 auditable emission.
    this.#auditSink?.({
      actor: input.createdBy,
      action: supersedes ? "SUPERSEDE" : "PROPOSE",
      registry: this.#registry,
      subjectRef: `${input.logicalId}@${input.version}`,
      recordUuid,
      contentHash,
      at: env.createdAt,
    });

    return this.#project(env, this.#all());
  }

  #project(env: StoredEnvelope, all: readonly StoredEnvelope[]): ConstitutionalRecord {
    const superseded = all.some((e) => e.supersedes === env.recordUuid);
    return {
      recordUuid: env.recordUuid,
      registry: env.registry,
      logicalId: env.logicalId,
      version: env.version,
      ownerAuthority: env.ownerAuthority,
      status: superseded ? "superseded" : "proposed",
      supersedes: env.supersedes,
      upTrace: env.upTrace,
      content: env.content,
      contentHash: env.contentHash,
      createdBy: env.createdBy,
      createdAt: env.createdAt,
      seq: env.seq,
    };
  }

  #verifiedProjection(env: StoredEnvelope): ConstitutionalRecord {
    const record = this.#project(env, this.#all());
    if (!verifyRecordHash(record)) {
      throw new CgNotFoundError(
        `verify-on-read failed: content hash mismatch for ${env.logicalId}@${env.version}`,
        { registry: this.#registry, logicalId: env.logicalId, version: env.version },
      );
    }
    return record;
  }
}
