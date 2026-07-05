/**
 * Execution Authorization Engine (WS6) — the Anti-Deviation control.
 *
 * Before any work item may start, this engine verifies:
 *   1. registered            — the item exists in the registry
 *   2. dependencies satisfied — all upstream items are COMPLETE
 *   3. required evidence known — the item declares its evidence requirements
 *   4. constitutional gate satisfied — no constraint hard-blocks execution
 *
 * If any check fails the engine REJECTS execution. There is no bypass and no
 * manual override in code — an override is itself a governed (Authority Board)
 * act recorded in the registry, not a flag here.
 */

import type { AuthorizationDecision, ComputedWorkItem } from "./types.ts";

/**
 * Constraints that hard-block execution until a governed act clears them.
 * These are matched case-insensitively against a work item's declared
 * constitutional constraints. The list is intentionally small and explicit.
 */
const HARD_BLOCK_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /requires ad-0024 \(not yet issued\)/i, reason: "requires Authority Board scoped release AD-0024 (not yet issued)" },
  { pattern: /not yet issued/i, reason: "requires a governed authorization act that has not been issued" },
];

export function authorize(
  computed: ComputedWorkItem | undefined,
  workItemId: string,
): AuthorizationDecision {
  const checks: AuthorizationDecision["checks"] = [];
  const reasons: string[] = [];

  // Check 1: registered
  const registered = Boolean(computed);
  checks.push({
    name: "registered",
    passed: registered,
    detail: registered ? `${workItemId} is registered` : `${workItemId} is NOT registered in the program registry`,
  });
  if (!computed) {
    reasons.push(`${workItemId} is not a registered work item; execution rejected (anti-rediscovery: register it first).`);
    return { workItemId, authorized: false, decision: "REJECTED", checks, reasons };
  }

  // Already complete -> nothing to authorize.
  if (computed.status === "COMPLETE") {
    checks.push({ name: "not-already-complete", passed: false, detail: "item is already COMPLETE" });
    reasons.push(`${workItemId} is already COMPLETE; no execution required.`);
    return { workItemId, authorized: false, decision: "REJECTED", checks, reasons };
  }

  // Check 2: dependencies satisfied
  const depsSatisfied = computed.unmetDependencies.length === 0;
  checks.push({
    name: "dependencies-satisfied",
    passed: depsSatisfied,
    detail: depsSatisfied
      ? "all dependencies COMPLETE"
      : `unmet dependencies: ${computed.unmetDependencies.join(", ")}`,
  });
  if (!depsSatisfied) reasons.push(`Blocked: dependencies not COMPLETE (${computed.unmetDependencies.join(", ")}).`);

  // Check 3: required evidence known
  const evidenceKnown = computed.item.requiredEvidence.length > 0;
  checks.push({
    name: "required-evidence-known",
    passed: evidenceKnown,
    detail: evidenceKnown
      ? `${computed.item.requiredEvidence.length} required evidence id(s) declared`
      : "no required evidence declared (evidence-based completion impossible)",
  });
  if (!evidenceKnown) reasons.push("No required evidence declared; completion could never be proven. Declare evidence first.");

  // Check 4: constitutional gate satisfied
  const hardBlocks = computed.item.constitutionalConstraints
    .flatMap((c) => HARD_BLOCK_PATTERNS.filter((p) => p.pattern.test(c)).map((p) => p.reason));
  const gateSatisfied = hardBlocks.length === 0;
  checks.push({
    name: "constitutional-gate-satisfied",
    passed: gateSatisfied,
    detail: gateSatisfied
      ? "no hard constitutional block"
      : `hard-blocked: ${hardBlocks.join("; ")}`,
  });
  if (!gateSatisfied) reasons.push(`Constitutional gate not satisfied: ${hardBlocks.join("; ")}.`);

  const authorized = depsSatisfied && evidenceKnown && gateSatisfied;
  if (authorized) reasons.push(`AUTHORIZED: ${workItemId} may proceed.`);

  return {
    workItemId,
    authorized,
    decision: authorized ? "AUTHORIZED" : "REJECTED",
    checks,
    reasons,
  };
}
