/**
 * CGR-W2-EEL-03 — Eligibility Evidence Emission (Wave-D, Execution Eligibility Layer).
 *
 * Authorized by PCAMG-RUNTIME-0202 (`WAVE_D_IMPLEMENTATION_AUTHORIZED`), specified under
 * PCAMG-RUNTIME-0202A, and constructed under PCAMG-RUNTIME-0202B. Produces append-only,
 * replay-verifiable evidence records capturing eligibility verdicts (CGR-W2-EEL-01) in a
 * tamper-evident, immutable audit stream. Preserves audit continuity (INV-5) and fail-closed posture
 * (INV-6) by delegating to the Wave-1 audit infrastructure (CGR-AU-CHAIN / CGR-AU-VERIFY).
 *
 * REUSE JUSTIFICATION:
 *   Reused assets —
 *     - CGR-W2-EEL-01 `EligibilityAssessment` / `EligibilityVerdict` (eligibility.ts) — the input.
 *     - Wave-1 `AuditEvent` shape (CGR-CORE-01 types.ts) — the canonical evidence container.
 *     - Wave-1 `AuditHashChain` (CGR-AU-CHAIN) — the append-only, tamper-evident audit substrate.
 *     - Wave-1 `verifyChain` (CGR-AU-VERIFY) — replay verification for audit continuity.
 *     - Wave-1 `hashing` (canonicalize + sha256) — content integrity.
 *     - CGR-W2-GEL-03 `EvidenceEmissionResult` (governance-evaluation/evidence.ts) — the shared
 *       emission-result shape (reused rather than duplicated).
 *   Reason new code is necessary: eligibility evidence emission is new behaviour (GEL-03 audits
 *   governance *evaluations*; EEL-03 audits eligibility *verdicts*). It is composed entirely from
 *   reused audit infrastructure and originates, mutates, and activates nothing.
 *
 * CONSTITUTIONAL POSTURE: append-only evidence emission. No execution, no activation, no mutation
 * outside the append-only audit chain (INV-1/10/11). Evidence records are immutable, replay-verifiable,
 * and fail-closed on an unassessed input (E-EMPTY-ELIGIBILITY-EVIDENCE).
 *
 * AUDIT CONTINUITY: all evidence flows through the Wave-1 audit chain (CGR-AU-CHAIN), inheriting its
 * append-only, tamper-evident, replay-verifiable properties. A broken chain is fail-closed.
 */

import type { AuditEvent } from "../types.ts";
import type { EligibilityAssessment, EligibilityVerdict } from "./eligibility.ts";
import { AuditHashChain, type ChainedAuditEntry } from "../audit-chain.ts";
import { verifyChain } from "../audit-verifier.ts";
import type { EvidenceEmissionResult } from "../governance-evaluation/evidence.ts";
import { canonicalize, sha256 } from "../../federation/assertions.ts";

/** Evidence record for an eligibility verdict (EEL-01). */
export interface EligibilityEvidence {
  readonly type: "eligibility-assessment";
  readonly subject: string;
  readonly verdict: EligibilityVerdict;
  readonly timestamp: string; // ISO 8601
  readonly contentHash: string; // sha256 over {subject, verdict}
}

function deny(
  code: string,
  message: string,
  detail: Readonly<Record<string, unknown>>,
): EvidenceEmissionResult {
  return { emitted: false, entry: null, denial: { code, message, detail } };
}

/**
 * Append-only, replay-verifiable eligibility evidence emitter. Wraps the Wave-1 audit chain
 * (CGR-AU-CHAIN) and provides typed evidence emission for eligibility verdicts (EEL-01). All evidence
 * records are immutable, tamper-evident, and fail-closed on integrity violations.
 */
export class EligibilityEvidenceEmitter {
  readonly #chain: AuditHashChain = new AuditHashChain();

  /**
   * Emit eligibility evidence (EEL-01). Fail-closed on an unassessed eligibility state
   * (E-EMPTY-ELIGIBILITY-EVIDENCE). Recording an `ELIGIBLE` verdict is NOT execution and NOT
   * activation — it is an append-only audit record of an advancement-admissibility determination.
   */
  emitEligibilityAssessment(assessment: EligibilityAssessment): EvidenceEmissionResult {
    if (!assessment.assessed || assessment.verdict === null || assessment.subject === null) {
      return deny("E-EMPTY-ELIGIBILITY-EVIDENCE", "cannot emit evidence for an unassessed eligibility state", {
        upstream: assessment.denial?.code ?? null,
      });
    }

    const evidence: EligibilityEvidence = {
      type: "eligibility-assessment",
      subject: assessment.subject,
      verdict: assessment.verdict,
      timestamp: new Date().toISOString(),
      contentHash: sha256(canonicalize({ subject: assessment.subject, verdict: assessment.verdict })),
    };

    const event: AuditEvent = {
      actor: "CGR-W2-EEL-03",
      action: "PROPOSE",
      registry: "REG-AUDIT",
      subjectRef: `${assessment.subject}@eligibility`,
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
