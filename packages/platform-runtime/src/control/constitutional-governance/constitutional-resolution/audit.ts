/**
 * CGR-W2-CRL-03 — Resolution Audit Emitter (Wave-B, Constitutional Resolution Layer).
 *
 * Authorized by PCAMG-RUNTIME-0107; constructed under PCAMG-RUNTIME-0107A. Emits append-only,
 * replay-verifiable evidence of each precedence resolution (CGR-W2-CRL-02 output), hash-linked into
 * an immutable resolution-audit spine and anchored to the governance audit head at emission time.
 *
 * DELIBERATE NO-WRITE OBLIGATION (inherited from CGR-W2-AVR-03):
 *   The Wave-1 `AuditEvent.action` union is closed (`"PROPOSE" | "SUPERSEDE"`) and MUST NOT be
 *   widened (that would modify a non-barrel Wave-1 file and could imply a governance mutation).
 *   CRL-03 therefore NEVER appends to `gov.auditChain`; it keeps its OWN append-only resolution
 *   spine and merely READS `gov.auditChain.head()` to anchor each resolution to the governance
 *   substrate. This preserves append-only, audit continuity, the closed Wave-1 schema, and
 *   "no authority origination" simultaneously — a resolution is recorded, never a governance act.
 *
 * REUSE JUSTIFICATION:
 *   Reused assets —
 *     - CGR-AU-CHAIN `GENESIS_PREV_HASH` (audit-chain.ts) — the exact genesis anchor constant.
 *     - The platform hash substrate `sha256` + `canonicalize` (federation/assertions.ts) — the SAME
 *       single-source hashing CGR-AU-CHAIN itself routes through; no new hash, no direct crypto.
 *     - CGR-AU-CHAIN's genesis→prevHash→entryHash append-only + deterministic-replay pattern, mirrored verbatim.
 *     - CGR-W2-CRL-02 `PrecedenceResult` / CGR-W2-CRL-01 `ResolutionDenial` — the input + fail-closed vocabulary.
 *   Reason new code is necessary: the closed Wave-1 `AuditEvent`/`ChainedAuditEntry` shapes cannot
 *   carry resolution evidence without widening the schema (prohibited). CRL-03 therefore records a
 *   distinct `ResolutionRecord` shape over the identical hash-linking + replay semantics. Deletion,
 *   rewrite, mutation, and history replacement are structurally unavailable (append-only, frozen).
 */

import { canonicalize, sha256 } from "../../federation/assertions.ts";
import { GENESIS_PREV_HASH } from "../audit-chain.ts";
import type { ConstitutionalGovernance } from "../composition-root.ts";
import type { ResolutionDenial, ResolutionDenialCode } from "./applicable-provision.ts";
import type { PrecedenceResult } from "./precedence.ts";

/** The immutable semantic payload of one resolution: what was resolved, in what order, anchored where. */
export interface ResolutionRecord {
  /** Subject the precedence resolution was decided for. */
  readonly subject: string;
  /** Governance audit-chain head at emission time — the tamper-evident anchor (read, never appended). */
  readonly auditHead: string;
  /** Provision logical ids in sovereignty-first precedence order (CGR-W2-CRL-02). */
  readonly provisionOrder: readonly string[];
  /** Provision content hashes in the same order — binds the evidence to exact record content. */
  readonly provisionHashes: readonly string[];
  /** The supreme (highest-precedence) provision's logical id. */
  readonly supreme: string;
}

/** A single hash-chained resolution-audit entry: the record + its position, back-link, and hash. */
export interface ResolutionAuditEntry {
  /** Monotonic 0-based position within the resolution spine. */
  readonly seq: number;
  /** The immutable resolution record captured at this position. */
  readonly record: ResolutionRecord;
  /** Back-link: the predecessor's `entryHash`, or `GENESIS_PREV_HASH` at seq 0. */
  readonly prevHash: string;
  /** sha256 over the canonical {seq, prevHash, record} view — tamper-evidence + continuity. */
  readonly entryHash: string;
}

/** The outcome of an emit attempt: an appended entry, or a fail-closed denial with nothing appended. */
export interface ResolutionEmissionResult {
  readonly emitted: boolean;
  readonly entry: ResolutionAuditEntry | null;
  readonly denial: ResolutionDenial | null;
}

/** The outcome of a resolution-spine verification pass (mirrors CGR-AU-VERIFY semantics). */
export interface ResolutionVerificationResult {
  readonly valid: boolean;
  readonly checked: number;
  readonly reason?: string;
  readonly brokenAt?: number;
}

function denial(code: ResolutionDenialCode, message: string, detail: Readonly<Record<string, unknown>>): ResolutionDenial {
  return { code, message, detail };
}

/**
 * Deterministic entry hash over the canonical {seq, prevHash, record} view. Binding `seq` and
 * `prevHash` into the hash makes reordering and back-link tampering detectable, not just content
 * tampering — identical to the CGR-AU-CHAIN entry-hash discipline.
 */
export function computeResolutionEntryHash(input: {
  seq: number;
  prevHash: string;
  record: ResolutionRecord;
}): string {
  return sha256(canonicalize({ seq: input.seq, prevHash: input.prevHash, record: input.record }));
}

/** Freeze an entry (and its captured record) so spine state cannot be mutated after the fact. */
function freezeEntry(entry: ResolutionAuditEntry): ResolutionAuditEntry {
  Object.freeze(entry.record.provisionOrder);
  Object.freeze(entry.record.provisionHashes);
  Object.freeze(entry.record);
  return Object.freeze(entry);
}

/**
 * Deterministically regenerate a full resolution spine from an ordered record list (pure; holds no
 * state). The reference for offline replay verification: identical input ⇒ byte-identical hashes.
 */
export function generateResolutionChain(records: readonly ResolutionRecord[]): readonly ResolutionAuditEntry[] {
  const entries: ResolutionAuditEntry[] = [];
  let prevHash = GENESIS_PREV_HASH;
  for (let seq = 0; seq < records.length; seq += 1) {
    const record = records[seq]!;
    const entryHash = computeResolutionEntryHash({ seq, prevHash, record });
    entries.push(freezeEntry({ seq, record, prevHash, entryHash }));
    prevHash = entryHash;
  }
  return Object.freeze(entries);
}

/**
 * Append-only resolution-audit emitter. Each decided precedence resolution extends the spine;
 * existing entries are immutable. NEVER appends to the governance audit chain — it only READS the
 * governance head to anchor each resolution (see the no-write obligation above).
 */
export class ResolutionAuditEmitter {
  readonly #entries: ResolutionAuditEntry[] = [];
  #head: string = GENESIS_PREV_HASH;

  /**
   * Emit resolution evidence for a decided precedence result. Fail-closed: an undecided result
   * appends NOTHING and returns a denial. On success, appends one frozen entry and returns it.
   */
  emit(gov: ConstitutionalGovernance, precedence: PrecedenceResult): ResolutionEmissionResult {
    if (!precedence.decided || precedence.supreme === null || precedence.subject === null) {
      return {
        emitted: false,
        entry: null,
        denial: denial("E-UNDECIDABLE-PRECEDENCE", "cannot emit resolution evidence for an undecided precedence", {
          upstream: precedence.denial?.code ?? null,
        }),
      };
    }

    const record: ResolutionRecord = {
      subject: precedence.subject,
      auditHead: gov.auditChain.head(), // READ ONLY — anchor, never append
      provisionOrder: precedence.ordered.map((p) => p.logicalId),
      provisionHashes: precedence.ordered.map((p) => p.contentHash),
      supreme: precedence.supreme.logicalId,
    };

    const seq = this.#entries.length;
    const prevHash = this.#head;
    const entryHash = computeResolutionEntryHash({ seq, prevHash, record });
    const entry = freezeEntry({ seq, record, prevHash, entryHash });
    this.#entries.push(entry);
    this.#head = entryHash;
    return { emitted: true, entry, denial: null };
  }

  /** The current head hash (last `entryHash`, or `GENESIS_PREV_HASH` when the spine is empty). */
  head(): string {
    return this.#head;
  }

  /** Number of resolution entries appended. */
  size(): number {
    return this.#entries.length;
  }

  /** Immutable snapshot of the spine (frozen defensive copy of frozen entries). */
  entries(): readonly ResolutionAuditEntry[] {
    return Object.freeze([...this.#entries]);
  }
}

/**
 * Verify tamper-evidence + continuity + ordering of a resolution spine snapshot. Read-only; inputs
 * are never mutated. An empty spine is vacuously valid (genesis with no entries). Mirrors CGR-AU-VERIFY.
 */
export function verifyResolutionAudit(entries: readonly ResolutionAuditEntry[]): ResolutionVerificationResult {
  let prevHash = GENESIS_PREV_HASH;
  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i]!;
    if (entry.seq !== i) {
      return { valid: false, checked: i + 1, brokenAt: i, reason: `ordering violation at index ${i}: expected seq ${i}, found ${entry.seq}` };
    }
    if (entry.prevHash !== prevHash) {
      return { valid: false, checked: i + 1, brokenAt: i, reason: `continuity violation at seq ${i}: prevHash does not link to the predecessor` };
    }
    const recomputed = computeResolutionEntryHash({ seq: entry.seq, prevHash: entry.prevHash, record: entry.record });
    if (recomputed !== entry.entryHash) {
      return { valid: false, checked: i + 1, brokenAt: i, reason: `tamper detected at seq ${i}: entryHash mismatch` };
    }
    prevHash = entry.entryHash;
  }
  return { valid: true, checked: entries.length };
}

/**
 * Deterministic replay verification: regenerate the spine from the recorded resolution records and
 * confirm every regenerated `entryHash` matches the stored spine. Read-only. Mirrors CGR-AU-VERIFY replay.
 */
export function verifyResolutionReplay(entries: readonly ResolutionAuditEntry[]): ResolutionVerificationResult {
  const regenerated = generateResolutionChain(entries.map((e) => e.record));
  if (regenerated.length !== entries.length) {
    return { valid: false, checked: entries.length, brokenAt: Math.min(regenerated.length, entries.length), reason: "replay length mismatch" };
  }
  for (let i = 0; i < entries.length; i += 1) {
    if (regenerated[i]!.entryHash !== entries[i]!.entryHash) {
      return { valid: false, checked: entries.length, brokenAt: i, reason: `replay divergence at seq ${i}` };
    }
  }
  return { valid: true, checked: entries.length };
}
