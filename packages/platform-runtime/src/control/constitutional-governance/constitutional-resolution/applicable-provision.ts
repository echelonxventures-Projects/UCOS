/**
 * CGR-W2-CRL-01 — Applicable-Provision Resolver (Wave-B, Constitutional Resolution Layer).
 *
 * Authorized by PCAMG-RUNTIME-0107 (`WAVE_B_IMPLEMENTATION_AUTHORIZED`) and constructed under
 * PCAMG-RUNTIME-0107A. Determines which constitutional provisions apply to a subject, consuming an
 * AVR-verified authority chain ONLY. Pure, read-only, deterministic, and fail-closed: an
 * unverified chain, a report/chain subject mismatch, an incomplete chain, or a verify-on-read
 * breach denies with a stable cause rather than returning a partial provision set.
 *
 * REUSE JUSTIFICATION:
 *   Reused assets —
 *     - CGR-W2-ACR-02 `ResolvedAuthorityChain` (authority/types.ts): the resolved, ordered chain.
 *     - CGR-W2-AVR-03 `VerificationReport` (verification/audit-continuity.ts): the AVR verdict that
 *       makes the chain "verified"; CRL-01 admits a chain only when its report is `valid`.
 *     - CGR-W2-ACR-01 `AuthorityReadModel` (authority/read-model.ts) for the mandated verify-on-read,
 *       which itself reuses Wave-1 `verifyRecordHash` (CGR-CORE-03). No registry/hash re-read is added.
 *     - Wave-1 `RegistryName` (types.ts) verbatim.
 *   Reason new code is necessary: neither Wave-1 nor Wave-A resolves *applicable provisions* — this
 *   is genuinely new resolution behaviour. It is composed entirely from reused reads; it originates,
 *   modifies, and decides nothing.
 *
 * CONSTITUTIONAL POSTURE: read-only projection over an AVR-verified chain. Deny-by-default; every
 * denial is stable and reconstructable. Confers no ACTIVE state and originates no authority.
 */

import type { RegistryName } from "../types.ts";
import type { AuthorityReadModel } from "../authority/read-model.ts";
import type { ResolvedAuthorityChain } from "../authority/types.ts";
import type { VerificationReport } from "../verification/audit-continuity.ts";

/** Stable fail-closed denial codes for the Constitutional Resolution Layer (shared across CRL-01..03). */
export type ResolutionDenialCode =
  | "E-EMPTY-CHAIN"
  | "E-UNVERIFIED-CHAIN"
  | "E-REPORT-SUBJECT-MISMATCH"
  | "E-INCOMPLETE-CHAIN"
  | "E-VERIFY-ON-READ-FAILED"
  | "E-EMPTY-PROVISION-SET"
  | "E-UNDECIDABLE-PRECEDENCE"
  | "E-UNRESOLVED-PROVISIONS";

/** A fail-closed resolution denial with a stable, reconstructable cause. */
export interface ResolutionDenial {
  readonly code: ResolutionDenialCode;
  readonly message: string;
  readonly detail: Readonly<Record<string, unknown>>;
}

/** A single constitutional provision applicable to the subject (a read projection of one chain node). */
export interface ApplicableProvision {
  /** Namespaced logical id of the governing provision. */
  readonly logicalId: string;
  /** Owning registry of the provision (also its sovereignty tier — see CRL-02). */
  readonly registry: RegistryName;
  /** Deterministic record identity (Wave-1 `computeRecordUuid`). */
  readonly recordUuid: string;
  /** Canonical content hash (Wave-1 `computeContentHash`) — the canonical tie-break / tamper binding. */
  readonly contentHash: string;
  /** Shortest hop distance from the subject (subject = 0; the principle root is deepest). */
  readonly depth: number;
  /** True iff this provision is a Layer-0 authority root (REG-PRIN). */
  readonly isRoot: boolean;
}

/** The result of applicable-provision resolution: either a provision set or a fail-closed denial. */
export interface ApplicableProvisionResult {
  readonly resolved: boolean;
  /** The subject the provisions were resolved for (present iff resolved). */
  readonly subject: string | null;
  /** Applicable provisions, deterministically ordered by (depth asc, logicalId asc). */
  readonly provisions: readonly ApplicableProvision[];
  /** The fail-closed denial (present iff not resolved). */
  readonly denial: ResolutionDenial | null;
}

function deny(
  code: ResolutionDenialCode,
  message: string,
  detail: Readonly<Record<string, unknown>>,
): ApplicableProvisionResult {
  return { resolved: false, subject: null, provisions: [], denial: { code, message, detail } };
}

/**
 * Resolve the constitutional provisions applicable to `chain.subject`, admitting the chain ONLY when
 * its AVR verification report is valid. Read-only; performs zero writes and originates no authority.
 *
 * Fail-closed ordering of guards:
 *   1. empty chain            → E-EMPTY-CHAIN
 *   2. report not valid       → E-UNVERIFIED-CHAIN            (consume AVR-verified chains only)
 *   3. report/chain subject ≠ → E-REPORT-SUBJECT-MISMATCH     (the report must describe THIS chain)
 *   4. chain not complete     → E-INCOMPLETE-CHAIN            (must reach the Layer-0 principle root)
 *   5. verify-on-read breach  → E-VERIFY-ON-READ-FAILED       (re-verify each provision at read time)
 */
export function resolveApplicableProvisions(
  readModel: AuthorityReadModel,
  chain: ResolvedAuthorityChain,
  report: VerificationReport,
): ApplicableProvisionResult {
  const nodes = chain.nodes;
  if (nodes.length === 0) {
    return deny("E-EMPTY-CHAIN", "empty chain: no provisions to resolve", { subject: chain.subject });
  }
  if (!report.valid) {
    return deny("E-UNVERIFIED-CHAIN", "authority chain is not AVR-verified", {
      subject: chain.subject,
      integrity: report.integrity.valid,
      trace: report.trace.valid,
      auditContinuity: report.auditContinuity.valid,
      auditReplay: report.auditReplay.valid,
    });
  }
  if (report.subject !== chain.subject) {
    return deny("E-REPORT-SUBJECT-MISMATCH", "verification report does not describe this chain", {
      reportSubject: report.subject,
      chainSubject: chain.subject,
    });
  }
  if (!chain.complete) {
    return deny("E-INCOMPLETE-CHAIN", "chain does not reach a Layer-0 principle root", {
      subject: chain.subject,
    });
  }

  // Verify-on-read: re-prove every provision against a live registry head before admitting it.
  for (const node of nodes) {
    const ref = readModel.lookup(node.logicalId);
    if (!ref || !readModel.verify(ref) || ref.record.contentHash !== node.contentHash) {
      return deny("E-VERIFY-ON-READ-FAILED", `verify-on-read failed for provision ${node.logicalId}`, {
        subject: chain.subject,
        provision: node.logicalId,
      });
    }
  }

  const provisions: ApplicableProvision[] = nodes.map((n) => ({
    logicalId: n.logicalId,
    registry: n.registry,
    recordUuid: n.recordUuid,
    contentHash: n.contentHash,
    depth: n.depth,
    isRoot: n.isRoot,
  }));
  // Deterministic order: (depth asc, logicalId asc). Identical state ⇒ byte-identical provision list.
  provisions.sort((a, b) =>
    a.depth !== b.depth ? a.depth - b.depth : a.logicalId < b.logicalId ? -1 : a.logicalId > b.logicalId ? 1 : 0,
  );

  return {
    resolved: true,
    subject: chain.subject,
    provisions: Object.freeze(provisions),
    denial: null,
  };
}
