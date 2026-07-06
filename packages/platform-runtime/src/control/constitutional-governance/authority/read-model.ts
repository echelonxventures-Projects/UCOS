/**
 * CGR-W2-ACR-01 — Authority Read-Model (Wave-A).
 *
 * A deterministic, read-only projection over the eleven Wave-1 registries composed by
 * CGR-CORE-04. It is the *only* seam through which the Authority Chain Runtime and the Authority
 * Verification Runtime read governance state: no engine touches a registry directly, and no engine
 * writes anything.
 *
 * REUSE JUSTIFICATION:
 *   - Registry state + verify-on-read: reuses the composed `ConstitutionalGovernance` handle and
 *     `ConstitutionalRegistry.getLatest` (Wave-1 CGR-CORE-04 / CGR-REG-base), which already
 *     performs verify-on-read (RG-3/RG-5). No new store, no new registry, no re-read of raw logs.
 *   - Tamper-evidence: reuses `verifyRecordHash` (Wave-1 CGR-CORE-03 hashing) rather than any new
 *     hash. `REGISTRY_NAMES` (Wave-1 CGR-CORE-01) fixes a deterministic scan order.
 *   A new primitive is unnecessary and prohibited: this is pure composition of existing reads.
 *
 * CONSTITUTIONAL POSTURE: read-only. Deny-by-default is expressed by returning `null` on absence;
 * ambiguity is surfaced (not silently resolved) so callers can fail closed.
 */

import { verifyRecordHash } from "../hashing.ts";
import { REGISTRY_NAMES } from "../types.ts";
import type { ConstitutionalRecord, RegistryName } from "../types.ts";
import type { ConstitutionalGovernance } from "../composition-root.ts";

/** A located record together with its owning registry. */
export interface AuthorityRef {
  readonly logicalId: string;
  readonly registry: RegistryName;
  readonly record: ConstitutionalRecord;
}

/** Read-only projection surface over the composed constitutional-governance registries. */
export interface AuthorityReadModel {
  /**
   * The single current (non-superseded) head for a logical id, scanning registries in the fixed
   * `REGISTRY_NAMES` order. Returns `null` when absent. When a logical id resolves in more than
   * one registry the FIRST match (deterministic) is returned; use `isAmbiguous` to detect that.
   */
  lookup(logicalId: string): AuthorityRef | null;
  /** Every registry head that carries this logical id (deterministic order). */
  lookupAll(logicalId: string): readonly AuthorityRef[];
  /** True iff the logical id resolves to a head in more than one registry (RG-1 single-source breach). */
  isAmbiguous(logicalId: string): boolean;
  /** Re-run verify-on-read over a located record (tamper-evidence, RG-3/RG-5). */
  verify(ref: AuthorityRef): boolean;
}

/**
 * Build a read-only authority projection over a composed governance runtime. Construction is
 * side-effect free and originates nothing.
 */
export function createAuthorityReadModel(gov: ConstitutionalGovernance): AuthorityReadModel {
  function lookupAll(logicalId: string): readonly AuthorityRef[] {
    const refs: AuthorityRef[] = [];
    for (const name of REGISTRY_NAMES) {
      const record = gov.registry(name).getLatest(logicalId);
      if (record) {
        refs.push({ logicalId, registry: name, record });
      }
    }
    return Object.freeze(refs);
  }

  function lookup(logicalId: string): AuthorityRef | null {
    const all = lookupAll(logicalId);
    return all.length > 0 ? all[0]! : null;
  }

  function isAmbiguous(logicalId: string): boolean {
    return lookupAll(logicalId).length > 1;
  }

  function verify(ref: AuthorityRef): boolean {
    return verifyRecordHash(ref.record);
  }

  return Object.freeze({ lookup, lookupAll, isAmbiguous, verify });
}
