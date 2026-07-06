/**
 * CGR-W2-GEL-03 — Evaluation Evidence Emitter (Wave-C, Governance Evaluation Layer).
 *
 * Authorized by PCAMG-RUNTIME-0112 (`WAVE_C_IMPLEMENTATION_AUTHORIZED`) and constructed under
 * PCAMG-RUNTIME-0112A. Produces append-only, replay-verifiable evaluation evidence records that
 * capture governance evaluations and compliance findings in a tamper-evident, immutable audit stream.
 * The evidence layer preserves audit continuity (INV-5) and fail-closed posture (INV-6) by
 * delegating to the Wave-1 audit infrastructure (CGR-AU-CHAIN / CGR-AU-VERIFY).
 *
 * REUSE JUSTIFICATION:
 *   Reused assets —
 *     - CGR-W2-GEL-01 `GovernanceEvaluation` / `GovernanceAssessment` — the evaluation input.
 *     - CGR-W2-GEL-02 `ComplianceEvaluation` / `ComplianceFinding` — the compliance input.
 *     - Wave-1 `AuditEvent` shape (CGR-CORE-01 types.ts) — the canonical evidence container.
 *     - Wave-1 `AuditHashChain` (CGR-AU-CHAIN) — the append-only, tamper-evident audit substrate.
 *     - Wave-1 `verifyChain` (CGR-AU-VERIFY) — replay verification for audit continuity.
 *     - Wave-1 `hashing` (CGR-CORE-03) — canonicalize + sha256 for content integrity.
 *   Reason new code is necessary: evaluation evidence emission is new behaviour (Wave-1/A/B audit
 *   governance mutations; GEL-03 audits governance *evaluations*). It is composed entirely from
 *   reused audit infrastructure and originates, mutates, and activates nothing.
 *
 * CONSTITUTIONAL POSTURE: append-only evidence emission. No execution, no activation, no mutation
 * outside the append-only audit chain. The evidence records are immutable, replay-verifiable, and
 * fail-closed on integrity violations.
 *
 * EVIDENCE TYPES:
 *   - `governance-evaluation`: captures a governance assessment (GEL-01 output).
 *   - `compliance-evaluation`: captures a constitutional compliance finding (GEL-02 output).
 *
 * AUDIT CONTINUITY: all evidence records flow through the Wave-1 audit chain (CGR-AU-CHAIN),
 * inheriting its append-only, tamper-evident, replay-verifiable properties. Replay verification
 * (CGR-AU-VERIFY) confirms continuity; a broken chain is fail-closed (E-EMPTY-EVIDENCE).
 */

import type { AuditEvent } from "../types.ts";
import type { GovernanceEvaluation, GovernanceAssessment } from "./evaluation.ts";
import type { ComplianceEvaluation, ComplianceFinding } from "./compliance.ts";
import { AuditHashChain, type ChainedAuditEntry } from "../audit-chain.ts";
import { verifyChain } from "../audit-verifier.ts";
import { canonicalize, sha256 } from "../../federation/assertions.ts";

/** Evidence record for a governance evaluation (GEL-01). */
export interface GovernanceEvaluationEvidence {
  readonly type: "governance-evaluation";
  readonly subject: string;
  readonly assessment: GovernanceAssessment;
  readonly timestamp: string; // ISO 8601
  readonly contentHash: string; // sha256 over {subject, assessment}
}

/** Evidence record for a compliance evaluation (GEL-02). */
export interface ComplianceEvaluationEvidence {
  readonly type: "compliance-evaluation";
  readonly subject: string;
  readonly finding: ComplianceFinding;
  readonly timestamp: string; // ISO 8601
  readonly contentHash: string; // sha256 over {subject, finding}
}

/** Union of all evaluation evidence types. */
export type EvaluationEvidence = GovernanceEvaluationEvidence | ComplianceEvaluationEvidence;

/** The result of evidence emission: the chained audit entry or a fail-closed denial. */
export interface EvidenceEmissionResult {
  readonly emitted: boolean;
  /** The chained audit entry (present iff emitted). */
  readonly entry: ChainedAuditEntry | null;
  /** The fail-closed denial (present iff not emitted). */
  readonly denial: { code: string; message: string; detail: Readonly<Record<string, unknown>> } | null;
}

function deny(
  code: string,
  message: string,
  detail: Readonly<Record<string, unknown>>,
): EvidenceEmissionResult {
  return { emitted: false, entry: null, denial: { code, message, detail } };
}

/**
 * Append-only, replay-verifiable evaluation evidence emitter. Wraps the Wave-1 audit chain
 * (CGR-AU-CHAIN) and provides typed evidence emission for governance evaluations (GEL-01) and
 * compliance evaluations (GEL-02). All evidence records are immutable, tamper-evident, and
 * fail-closed on integrity violations.
 */
export class EvaluationEvidenceEmitter {
  readonly #chain: AuditHashChain = new AuditHashChain();

  /**
   * Emit governance evaluation evidence (GEL-01). Fail-closed on an unevaluated governance state
   * (E-EMPTY-EVIDENCE).
   */
  emitGovernanceEvaluation(evaluation: GovernanceEvaluation): EvidenceEmissionResult {
    if (!evaluation.evaluated || evaluation.assessment === null || evaluation.subject === null) {
      return deny("E-EMPTY-EVIDENCE", "cannot emit evidence for an unevaluated governance state", {
        upstream: evaluation.denial?.code ?? null,
      });
    }

    const evidence: GovernanceEvaluationEvidence = {
      type: "governance-evaluation",
      subject: evaluation.subject,
      assessment: evaluation.assessment,
      timestamp: new Date().toISOString(),
      contentHash: sha256(canonicalize({ subject: evaluation.subject, assessment: evaluation.assessment })),
    };

    const event: AuditEvent = {
      actor: "CGR-W2-GEL-03",
      action: "PROPOSE",
      registry: "REG-AUDIT",
      subjectRef: `${evaluation.subject}@evaluation`,
      recordUuid: evidence.contentHash,
      contentHash: evidence.contentHash,
      at: evidence.timestamp,
    };

    const entry = this.#chain.append(event);
    return { emitted: true, entry, denial: null };
  }

  /**
   * Emit compliance evaluation evidence (GEL-02). Fail-closed on an unevaluated compliance state
   * (E-EMPTY-EVIDENCE).
   */
  emitComplianceEvaluation(evaluation: ComplianceEvaluation): EvidenceEmissionResult {
    if (!evaluation.evaluated || evaluation.finding === null || evaluation.subject === null) {
      return deny("E-EMPTY-EVIDENCE", "cannot emit evidence for an unevaluated compliance state", {
        upstream: evaluation.denial?.code ?? null,
      });
    }

    const evidence: ComplianceEvaluationEvidence = {
      type: "compliance-evaluation",
      subject: evaluation.subject,
      finding: evaluation.finding,
      timestamp: new Date().toISOString(),
      contentHash: sha256(canonicalize({ subject: evaluation.subject, finding: evaluation.finding })),
    };

    const event: AuditEvent = {
      actor: "CGR-W2-GEL-03",
      action: "PROPOSE",
      registry: "REG-AUDIT",
      subjectRef: `${evaluation.subject}@compliance`,
      recordUuid: evidence.contentHash,
      contentHash: evidence.contentHash,
      at: evidence.timestamp,
    };

    const entry = this.#chain.append(event);
    return { emitted: true, entry, denial: null };
  }

  /** The current audit chain head hash (for continuity verification). */
  head(): string {
    return this.#chain.head();
  }

  /** Number of evidence records emitted. */
  size(): number {
    return this.#chain.size();
  }

  /** Immutable snapshot of the evidence chain (frozen defensive copy). */
  entries(): readonly ChainedAuditEntry[] {
    return this.#chain.entries();
  }

  /**
   * Verify audit continuity: replay the chain and confirm it matches the current state.
   * Fail-closed on a broken chain (returns false).
   */
  verifyContinuity(): boolean {
    const entries = this.#chain.entries();
    const result = verifyChain(entries);
    return result.valid && entries.length === this.#chain.size();
  }
}
