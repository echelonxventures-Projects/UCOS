/**
 * UCOS Policy Fabric — Policy Evaluation Engine (POL-002).
 *
 * The engine is a pure interpreter of the metadata-stored `PolicyRecord`s (POL-001). It compiles
 * NO policy into code: every rule is data, read from the Policy Registry at evaluation time and
 * evaluated against a `DecisionContext`. Governance approvals / certifications are consulted live
 * from the Governance Registry. There are no hardcoded permissions, trust levels, or policies.
 *
 * Decision semantics (realizes UCOS-SEC-ARCH-001 deny-by-default authorization):
 *   1. An applicable policy is one whose `target` matches (capability, operation).
 *   2. A policy "fires" when ALL of its rules are satisfied.
 *   3. If any DENY policy fires  -> DENY  (deny overrides allow).
 *   4. else if any ALLOW policy fires -> ALLOW.
 *   5. else -> DENY (deny-by-default).
 *   Among same-effect firing policies the highest `priority` supplies the decision reason.
 */

import type { GovernanceRegistry } from "../governance/governance-registry.ts";
import type { PolicyRegistry } from "./policy-registry.ts";
import type {
  Decision,
  DecisionContext,
  PolicyEffect,
  PolicyRecord,
  PolicyRule,
  PolicyTarget,
} from "../types.ts";

function deepEquals(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Glob match where `*` in the pattern matches any run of characters. Undefined pattern = any. */
function globMatch(pattern: string | undefined, value: string): boolean {
  if (pattern === undefined || pattern === "*") return true;
  if (!pattern.includes("*")) return pattern === value;
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`).test(value);
}

/** A grant satisfies a required permission by exact match, `*`, or a `*`-glob (e.g. "cap.*:*"). */
function permissionGranted(grant: string, required: string): boolean {
  if (grant === "*" || grant === required) return true;
  if (!grant.includes("*")) return false;
  const escaped = grant.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`).test(required);
}

function targetApplies(target: PolicyTarget | undefined, capabilityId: string, operation: string): boolean {
  if (!target) return true;
  return globMatch(target.capability, capabilityId) && globMatch(target.operation, operation);
}

interface RuleResult {
  satisfied: boolean;
  reason: string;
}

export class PolicyEvaluator {
  readonly #policies: PolicyRegistry;
  readonly #governance: GovernanceRegistry;

  constructor(policies: PolicyRegistry, governance: GovernanceRegistry) {
    this.#policies = policies;
    this.#governance = governance;
  }

  /** Evaluate a single rule against the decision context. */
  #evaluateRule(rule: PolicyRule, ctx: DecisionContext): RuleResult {
    switch (rule.type) {
      case "require-permission": {
        const satisfied = ctx.identity.permissions.some((g) => permissionGranted(g, rule.permission));
        return { satisfied, reason: satisfied ? "" : `missing permission "${rule.permission}"` };
      }
      case "require-trust": {
        const satisfied = ctx.trustLevel >= rule.minLevel;
        return { satisfied, reason: satisfied ? "" : `trust level ${ctx.trustLevel} < required ${rule.minLevel}` };
      }
      case "require-attribute": {
        const satisfied = deepEquals(ctx.identity.attributes?.[rule.key], rule.equals);
        return { satisfied, reason: satisfied ? "" : `identity attribute "${rule.key}" mismatch` };
      }
      case "require-governance-approval": {
        // Approval may be granted to the acting identity or to the target capability.
        const satisfied =
          this.#governance.isApproved(rule.process, ctx.identity.id) ||
          this.#governance.isApproved(rule.process, ctx.capabilityId);
        return { satisfied, reason: satisfied ? "" : `no active governance approval for process "${rule.process}"` };
      }
      case "require-certification": {
        const satisfied = this.#governance.isCertified(rule.certification);
        return { satisfied, reason: satisfied ? "" : `certification "${rule.certification}" is not active` };
      }
      default: {
        // Unknown rule type is treated as unsatisfiable (deny-safe).
        const unknown = rule as { type?: string };
        return { satisfied: false, reason: `unknown rule type "${String(unknown.type)}"` };
      }
    }
  }

  /** True iff every rule of the policy is satisfied; also returns the first failing reason. */
  #policyFires(policy: PolicyRecord, ctx: DecisionContext): { fires: boolean; reason: string } {
    for (const rule of policy.rules) {
      const result = this.#evaluateRule(rule, ctx);
      if (!result.satisfied) return { fires: false, reason: result.reason };
    }
    return { fires: true, reason: "all rules satisfied" };
  }

  /** Compute the authorization decision for a context. Deny-by-default. */
  evaluate(ctx: DecisionContext): Decision {
    const applicable = this.#policies
      .list()
      .filter((p) => targetApplies(p.target, ctx.capabilityId, ctx.operation));

    const byPriorityDesc = (a: PolicyRecord, b: PolicyRecord) => (b.priority ?? 0) - (a.priority ?? 0);

    const firedDeny: PolicyRecord[] = [];
    const firedAllow: PolicyRecord[] = [];
    const unmetAllowReasons: string[] = [];

    for (const policy of applicable) {
      const { fires, reason } = this.#policyFires(policy, ctx);
      if (fires) {
        (policy.effect === "deny" ? firedDeny : firedAllow).push(policy);
      } else if (policy.effect === "allow") {
        unmetAllowReasons.push(`${policy.id}: ${reason}`);
      }
    }

    if (firedDeny.length > 0) {
      firedDeny.sort(byPriorityDesc);
      const top = firedDeny[0]!;
      const denyEffect: PolicyEffect = "deny";
      return {
        effect: denyEffect,
        reason: `explicit deny by policy "${top.id}"${top.description ? ` (${top.description})` : ""}`,
        matchedPolicies: firedDeny.map((p) => p.id),
      };
    }

    if (firedAllow.length > 0) {
      firedAllow.sort(byPriorityDesc);
      const top = firedAllow[0]!;
      const allowEffect: PolicyEffect = "allow";
      return {
        effect: allowEffect,
        reason: `allowed by policy "${top.id}"`,
        matchedPolicies: firedAllow.map((p) => p.id),
      };
    }

    const detail =
      unmetAllowReasons.length > 0
        ? ` (unmet: ${unmetAllowReasons.join("; ")})`
        : " (no applicable allow policy)";
    const denyEffect: PolicyEffect = "deny";
    return {
      effect: denyEffect,
      reason: `deny-by-default${detail}`,
      matchedPolicies: [],
    };
  }
}
