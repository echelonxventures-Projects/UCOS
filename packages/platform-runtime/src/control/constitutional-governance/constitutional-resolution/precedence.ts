/**
 * CGR-W2-CRL-02 — Precedence Resolver (Wave-B, Constitutional Resolution Layer).
 *
 * Authorized by PCAMG-RUNTIME-0107; constructed under PCAMG-RUNTIME-0107A. Imposes a total,
 * deterministic, sovereignty-first precedence ordering over the applicable provisions produced by
 * CGR-W2-CRL-01 and selects the supreme provision. Pure, read-only, and fail-closed: an unresolved
 * input or an empty provision set denies rather than ordering arbitrarily.
 *
 * REUSE JUSTIFICATION:
 *   Reused assets —
 *     - CGR-W2-CRL-01 outputs (`ApplicableProvisionResult`, `ApplicableProvision`) — the sole input.
 *     - CGR-W2-CRL-01 denial shape (`ResolutionDenial`/`ResolutionDenialCode`) — one shared fail-closed vocabulary.
 *     - Wave-1 `REGISTRY_NAMES` (CGR-CORE-01): its fixed order IS the sovereignty tiering
 *       (REG-PRIN = Layer-0 sovereign origin at index 0). No new hierarchy constant is introduced.
 *     - The per-provision `contentHash` (Wave-1 CGR-CORE-03 hashing) as the canonical tie-break.
 *   Reason new code is necessary: precedence arbitration over resolved provisions is new behaviour
 *   (Wave-1/Wave-A have no precedence resolver); it is built entirely from reused values and
 *   originates, mutates, and activates nothing.
 *
 * SOVEREIGNTY-FIRST PRECEDENCE (deterministic, total):
 *   1. registry sovereignty rank ascending — index in `REGISTRY_NAMES`; REG-PRIN (0) is most
 *      sovereign. "Sovereignty Origin = Invariant Principles" ⇒ the principle tier precedes all.
 *   2. depth descending — a provision nearer the Layer-0 root is more fundamental, hence higher precedence.
 *   3. contentHash ascending — canonical tie-break; distinct records have distinct hashes, so no
 *      arbitrary pick is ever required.
 *   4. logicalId ascending — final total-order guard.
 *   The supreme provision is the first under this order.
 */

import { REGISTRY_NAMES } from "../types.ts";
import type {
  ApplicableProvision,
  ApplicableProvisionResult,
  ResolutionDenial,
  ResolutionDenialCode,
} from "./applicable-provision.ts";

/** The outcome of precedence arbitration over applicable provisions. */
export interface PrecedenceResult {
  readonly decided: boolean;
  /** The subject the provisions apply to (present iff decided). */
  readonly subject: string | null;
  /** All provisions in canonical sovereignty-first precedence order (present iff decided). */
  readonly ordered: readonly ApplicableProvision[];
  /** The supreme (highest-precedence) provision (present iff decided). */
  readonly supreme: ApplicableProvision | null;
  /** The fail-closed denial (present iff not decided). */
  readonly denial: ResolutionDenial | null;
}

function deny(
  code: ResolutionDenialCode,
  message: string,
  detail: Readonly<Record<string, unknown>>,
): PrecedenceResult {
  return { decided: false, subject: null, ordered: [], supreme: null, denial: { code, message, detail } };
}

/** Sovereignty rank of a provision: its registry's index in the canonical `REGISTRY_NAMES` order. */
function sovereigntyRank(provision: ApplicableProvision): number {
  return REGISTRY_NAMES.indexOf(provision.registry);
}

/**
 * Order applicable provisions by constitutional precedence and select the supreme one. Read-only;
 * performs zero writes. Fail-closed on an unresolved input (E-UNRESOLVED-PROVISIONS) or an empty
 * provision set (E-EMPTY-PROVISION-SET).
 */
export function resolvePrecedence(applicable: ApplicableProvisionResult): PrecedenceResult {
  if (!applicable.resolved) {
    return deny("E-UNRESOLVED-PROVISIONS", "cannot order precedence over an unresolved provision set", {
      denial: applicable.denial?.code ?? null,
    });
  }
  if (applicable.provisions.length === 0) {
    return deny("E-EMPTY-PROVISION-SET", "no provisions supplied for precedence arbitration", {
      subject: applicable.subject,
      count: 0,
    });
  }

  const ordered = [...applicable.provisions].sort((a, b) => {
    const ra = sovereigntyRank(a);
    const rb = sovereigntyRank(b);
    if (ra !== rb) return ra - rb; // sovereignty tier first (REG-PRIN precedes all)
    if (a.depth !== b.depth) return b.depth - a.depth; // nearer the root ⇒ more fundamental
    if (a.contentHash !== b.contentHash) return a.contentHash < b.contentHash ? -1 : 1; // canonical tie-break
    return a.logicalId < b.logicalId ? -1 : a.logicalId > b.logicalId ? 1 : 0; // total-order guard
  });

  return {
    decided: true,
    subject: applicable.subject,
    ordered: Object.freeze(ordered),
    supreme: ordered[0]!,
    denial: null,
  };
}
