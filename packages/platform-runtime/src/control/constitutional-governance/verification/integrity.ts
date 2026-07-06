/**
 * CGR-W2-AVR-01 — Authority Chain Integrity Verifier (Wave-A).
 *
 * READ-ONLY. Given a resolved authority chain (CGR-W2-ACR-02 output), proves link-level integrity:
 *   - existence    : every node still resolves to a live registry head;
 *   - tamper-evidence : verify-on-read holds for every node (contentHash + recordUuid match);
 *   - closure      : every up-trace reference of every node is itself present in the chain;
 *   - reaches-root : the chain is complete (terminates at the Layer-0 principle root).
 * Any failure is fail-closed with a stable reason and the index of the first offending node.
 *
 * REUSE JUSTIFICATION:
 *   Reuses CGR-W2-ACR-01 (`AuthorityReadModel`) for existence + verify-on-read, which in turn
 *   reuse Wave-1 registries and CGR-CORE-03 hashing. No new hash, store, or registry. Integrity
 *   verification over a resolved chain is new behaviour composed from reused reads.
 */

import type { AuthorityReadModel } from "../authority/read-model.ts";
import type { ResolvedAuthorityChain } from "../authority/types.ts";

/** Outcome of integrity verification; carries a fail reason + offending index on failure. */
export interface ChainIntegrityResult {
  readonly valid: boolean;
  readonly checked: number;
  readonly reason?: string;
  readonly brokenAt?: number;
}

function ok(checked: number): ChainIntegrityResult {
  return { valid: true, checked };
}

function fail(checked: number, brokenAt: number, reason: string): ChainIntegrityResult {
  return { valid: false, checked, brokenAt, reason };
}

/**
 * Verify link-level integrity of a resolved chain. Read-only; performs zero writes.
 * An empty chain is a fail-closed failure (nothing to anchor authority to).
 */
export function verifyChainIntegrity(
  readModel: AuthorityReadModel,
  chain: ResolvedAuthorityChain,
): ChainIntegrityResult {
  const nodes = chain.nodes;
  if (nodes.length === 0) {
    return fail(0, 0, "empty chain: no authority nodes to verify");
  }

  const present = new Set(nodes.map((n) => n.logicalId));

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i]!;
    const ref = readModel.lookup(node.logicalId);
    if (!ref) {
      return fail(i + 1, i, `missing record for node ${node.logicalId}`);
    }
    if (!readModel.verify(ref)) {
      return fail(i + 1, i, `verify-on-read failed for node ${node.logicalId}`);
    }
    if (ref.record.recordUuid !== node.recordUuid) {
      return fail(i + 1, i, `recordUuid mismatch for node ${node.logicalId}`);
    }
    if (ref.record.contentHash !== node.contentHash) {
      return fail(i + 1, i, `contentHash mismatch for node ${node.logicalId}`);
    }
    for (const up of node.upTrace) {
      if (!present.has(up)) {
        return fail(i + 1, i, `dangling up-trace ${node.logicalId} → ${up} (not in chain)`);
      }
    }
  }

  if (!chain.complete) {
    return fail(nodes.length, nodes.length - 1, "chain does not reach a Layer-0 principle root");
  }

  return ok(nodes.length);
}
