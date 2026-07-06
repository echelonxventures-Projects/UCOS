/**
 * CGR-W2-ACR-02 — Authority Chain Resolver (Wave-A).
 *
 * Turns a subject logical id into one deterministic, fully ordered resolved authority chain by
 * following up-trace derivation edges to the Layer-0 principle root(s). Pure, read-only, and
 * fail-closed: a missing subject, a broken up-trace edge, or an ambiguous reference denies with a
 * stable cause rather than returning a partial chain.
 *
 * REUSE JUSTIFICATION:
 *   - Reads exclusively through CGR-W2-ACR-01 (`AuthorityReadModel`), which itself reuses Wave-1
 *     registries + verify-on-read. No registry, hash, or store primitive is reintroduced here.
 *   - Ordering keys reuse the record `contentHash` produced by Wave-1 CGR-CORE-03 hashing; no new
 *     canonicalizer is created.
 *   Chain resolution is genuinely new behaviour (Wave-1 has no chain-walker), so a new engine is
 *   warranted; it is built entirely from reused reads.
 *
 * DETERMINISM: a breadth-first walk with a visited guard assigns each node its shortest hop depth;
 * up-trace edges are visited in sorted order; the final node list is re-sorted by (depth, logicalId).
 * Identical state ⇒ byte-identical chains. No wall-clock, randomness, or environment input.
 *
 * TERMINATION / CYCLES: the visited guard guarantees termination even if the stored edges contain
 * a cycle. Detecting and rejecting cycles is CGR-W2-AVR-02's responsibility; the resolver merely
 * produces the node set so the verifier can adjudicate.
 */

import type { AuthorityReadModel, AuthorityRef } from "./read-model.ts";
import type {
  AuthorityChainNode,
  AuthorityDenial,
  AuthorityDenialCode,
  AuthorityResolutionResult,
  ResolvedAuthorityChain,
} from "./types.ts";

function deny(
  code: AuthorityDenialCode,
  message: string,
  detail: Readonly<Record<string, unknown>>,
): AuthorityResolutionResult {
  const denial: AuthorityDenial = { code, message, detail };
  return { resolved: false, chain: null, denial };
}

function nodeOf(ref: AuthorityRef, depth: number): AuthorityChainNode {
  return {
    logicalId: ref.logicalId,
    registry: ref.registry,
    recordUuid: ref.record.recordUuid,
    contentHash: ref.record.contentHash,
    upTrace: [...ref.record.upTrace],
    depth,
    isRoot: ref.registry === "REG-PRIN",
  };
}

/**
 * Resolve the authority chain for `subjectLogicalId`. Returns a resolved chain or a fail-closed
 * denial. Performs zero writes.
 */
export function resolveAuthorityChain(
  readModel: AuthorityReadModel,
  subjectLogicalId: string,
): AuthorityResolutionResult {
  const subjectRef = readModel.lookup(subjectLogicalId);
  if (!subjectRef) {
    return deny("E-UNKNOWN-SUBJECT", `unknown subject: ${subjectLogicalId}`, {
      subject: subjectLogicalId,
    });
  }
  if (readModel.isAmbiguous(subjectLogicalId)) {
    return deny("E-AMBIGUOUS-REF", `ambiguous subject reference: ${subjectLogicalId}`, {
      subject: subjectLogicalId,
    });
  }

  // BFS with a visited guard → shortest-hop depth per node, deterministic and cycle-safe.
  const visited = new Map<string, AuthorityChainNode>();
  let frontier: AuthorityRef[] = [subjectRef];
  let depth = 0;

  while (frontier.length > 0) {
    const next: AuthorityRef[] = [];
    for (const ref of frontier) {
      if (visited.has(ref.logicalId)) continue;
      visited.set(ref.logicalId, nodeOf(ref, depth));

      for (const up of [...ref.record.upTrace].sort()) {
        if (visited.has(up)) continue;
        const upRef = readModel.lookup(up);
        if (!upRef) {
          return deny("E-CHAIN-BROKEN", `broken up-trace edge: ${ref.logicalId} → ${up}`, {
            subject: subjectLogicalId,
            from: ref.logicalId,
            missing: up,
          });
        }
        if (readModel.isAmbiguous(up)) {
          return deny("E-AMBIGUOUS-REF", `ambiguous up-trace reference: ${up}`, {
            subject: subjectLogicalId,
            reference: up,
          });
        }
        next.push(upRef);
      }
    }
    frontier = next;
    depth += 1;
  }

  const nodes = [...visited.values()].sort((a, b) =>
    a.depth !== b.depth ? a.depth - b.depth : a.logicalId < b.logicalId ? -1 : a.logicalId > b.logicalId ? 1 : 0,
  );
  const terminals = nodes.filter((n) => n.upTrace.length === 0);
  const rootIds = terminals.map((n) => n.logicalId).sort();
  const maxDepth = nodes.reduce((m, n) => (n.depth > m ? n.depth : m), 0);
  // Complete iff there is at least one terminal and every terminal is a Layer-0 principle root.
  const complete = terminals.length > 0 && terminals.every((n) => n.isRoot);

  const chain: ResolvedAuthorityChain = {
    subject: subjectLogicalId,
    subjectRegistry: subjectRef.registry,
    nodes: Object.freeze(nodes),
    rootIds: Object.freeze(rootIds),
    maxDepth,
    complete,
  };
  return { resolved: true, chain: Object.freeze(chain), denial: null };
}
