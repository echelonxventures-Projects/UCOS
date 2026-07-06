/**
 * CGR-W2-AVR-02 — Acyclicity & Mandatory Up-Trace Verifier (Wave-A).
 *
 * READ-ONLY. Over a resolved authority chain (CGR-W2-ACR-02 output) proves the two structural
 * doctrine invariants of the derivation graph:
 *   - acyclicity        : the up-trace edge set contains no cycle (a chain that loops is invalid);
 *   - mandatory up-trace : every non-root node carries ≥1 up-trace reference (RG-7 / PRIN-004
 *                          mandatory up-trace to authority). Only Layer-0 principle roots
 *                          (REG-PRIN) may have an empty up-trace.
 * Any cycle or missing up-trace is fail-closed, naming the offending nodes/edges. An incomplete
 * or malformed chain fails rather than passing.
 *
 * REUSE JUSTIFICATION:
 *   Consumes only CGR-W2-ACR-02 chain nodes (which reuse Wave-1 registries via the read-model) and
 *   the `RegistryName` doctrine from Wave-1 `types.ts`. Cycle detection is a standard three-colour
 *   DFS over the in-chain edge set — no external graph library, no new primitive, no store.
 */

import type { ResolvedAuthorityChain, AuthorityChainNode } from "../authority/types.ts";

/** Outcome of acyclicity + mandatory up-trace verification. */
export interface TraceVerificationResult {
  readonly valid: boolean;
  readonly reason?: string;
  /** The logical ids forming a detected cycle (present only on a cycle failure). */
  readonly cycle?: readonly string[];
  /** The non-root logical ids missing a mandatory up-trace (present only on that failure). */
  readonly missingUpTrace?: readonly string[];
}

/**
 * Verify the chain is acyclic and every non-root node up-traces. Read-only; performs zero writes.
 * Cycle detection is checked first so a genuine loop is reported precisely.
 */
export function verifyAcyclicUpTrace(chain: ResolvedAuthorityChain): TraceVerificationResult {
  const nodes = chain.nodes;
  if (nodes.length === 0) {
    return { valid: false, reason: "empty chain: nothing to verify" };
  }

  const byId = new Map<string, AuthorityChainNode>();
  for (const n of nodes) byId.set(n.logicalId, n);

  // ── cycle detection: three-colour DFS over in-chain up-trace edges (deterministic order) ──
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const colour = new Map<string, number>();
  for (const n of nodes) colour.set(n.logicalId, WHITE);
  const stack: string[] = [];

  const visit = (id: string): readonly string[] | null => {
    colour.set(id, GRAY);
    stack.push(id);
    const node = byId.get(id);
    if (node) {
      for (const up of [...node.upTrace].sort()) {
        if (!byId.has(up)) continue; // dangling edges are AVR-01's concern
        const c = colour.get(up);
        if (c === GRAY) {
          // back-edge → cycle; slice the stack from the re-entered node.
          const start = stack.indexOf(up);
          return [...stack.slice(start), up];
        }
        if (c === WHITE) {
          const found = visit(up);
          if (found) return found;
        }
      }
    }
    colour.set(id, BLACK);
    stack.pop();
    return null;
  };

  for (const n of nodes) {
    if (colour.get(n.logicalId) === WHITE) {
      const cycle = visit(n.logicalId);
      if (cycle) {
        return { valid: false, reason: `cycle detected: ${cycle.join(" → ")}`, cycle };
      }
    }
  }

  // ── mandatory up-trace: every non-root node must carry ≥1 up-trace reference ──
  const missing = nodes
    .filter((n) => !n.isRoot && n.upTrace.length === 0)
    .map((n) => n.logicalId)
    .sort();
  if (missing.length > 0) {
    return {
      valid: false,
      reason: `mandatory up-trace missing for non-root node(s): ${missing.join(", ")}`,
      missingUpTrace: missing,
    };
  }

  return { valid: true };
}
