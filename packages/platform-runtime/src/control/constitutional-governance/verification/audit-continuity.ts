/**
 * CGR-W2-AVR-03 — Verification Audit / Audit-Continuity Verifier (Wave-A).
 *
 * READ-ONLY. Runs the full authority-chain verification (integrity + acyclicity/up-trace) and, in
 * the same pass, proves the tamper-evident audit hash-chain's continuity, then binds the outcome
 * to the current audit-chain head so the verification is itself anchored to the audit spine.
 *
 * DELIBERATE NO-WRITE AUDIT OBLIGATION:
 *   The Wave-1 `AuditEvent.action` union is closed (`"PROPOSE" | "SUPERSEDE"`). Emitting a new
 *   "VERIFY" audit event would require widening that union inside the Wave-1 `types.ts` — a
 *   modification of a non-barrel Wave-1 file, which PCAMG-RUNTIME-0102A prohibits. Wave-A therefore
 *   discharges its audit obligation by (a) VERIFYING audit continuity/replay read-only and
 *   (b) ANCHORING the immutable verification report to the audit head hash — never by appending.
 *   This preserves append-only, audit continuity, and the closed Wave-1 audit schema simultaneously.
 *
 * REUSE JUSTIFICATION:
 *   - Audit continuity + replay: reuses CGR-AU-VERIFY (`verifyChain`, `verifyReplay`) verbatim.
 *   - Audit head anchor: reuses the CGR-AU-CHAIN `AuditHashChain.head()`/`.entries()` accessors.
 *   - Chain verdicts: reuses CGR-W2-AVR-01 and CGR-W2-AVR-02.
 *   No new audit engine, hash, or verifier is created.
 */

import { verifyChain, verifyReplay } from "../audit-verifier.ts";
import type { AuditChainVerificationResult } from "../audit-verifier.ts";
import type { ConstitutionalGovernance } from "../composition-root.ts";
import type { AuthorityReadModel } from "../authority/read-model.ts";
import type { ResolvedAuthorityChain } from "../authority/types.ts";
import { verifyChainIntegrity } from "./integrity.ts";
import type { ChainIntegrityResult } from "./integrity.ts";
import { verifyAcyclicUpTrace } from "./acyclicity.ts";
import type { TraceVerificationResult } from "./acyclicity.ts";

/** An immutable, audit-anchored verification report over a resolved authority chain. */
export interface VerificationReport {
  /** Subject the chain was resolved for. */
  readonly subject: string;
  /** Link-level integrity verdict (CGR-W2-AVR-01). */
  readonly integrity: ChainIntegrityResult;
  /** Acyclicity + mandatory up-trace verdict (CGR-W2-AVR-02). */
  readonly trace: TraceVerificationResult;
  /** Tamper-evidence + continuity of the audit hash-chain (CGR-AU-VERIFY). */
  readonly auditContinuity: AuditChainVerificationResult;
  /** Deterministic replay verification of the audit hash-chain (CGR-AU-VERIFY). */
  readonly auditReplay: AuditChainVerificationResult;
  /** The audit-chain head hash at verification time — the tamper-evident anchor (no append). */
  readonly auditHead: string;
  /** Overall verdict: the conjunction of every sub-verdict (fail-closed). */
  readonly valid: boolean;
}

/**
 * Verify a resolved authority chain and anchor the outcome to the audit-chain head. Read-only;
 * performs zero writes and appends no audit entry (see the no-write obligation above).
 */
export function verifyAndAudit(
  gov: ConstitutionalGovernance,
  readModel: AuthorityReadModel,
  chain: ResolvedAuthorityChain,
): VerificationReport {
  const integrity = verifyChainIntegrity(readModel, chain);
  const trace = verifyAcyclicUpTrace(chain);

  const entries = gov.auditChain.entries();
  const auditContinuity = verifyChain(entries);
  const auditReplay = verifyReplay(entries);

  const valid = integrity.valid && trace.valid && auditContinuity.valid && auditReplay.valid;

  return Object.freeze({
    subject: chain.subject,
    integrity,
    trace,
    auditContinuity,
    auditReplay,
    auditHead: gov.auditChain.head(),
    valid,
  });
}
