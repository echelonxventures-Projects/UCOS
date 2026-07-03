/**
 * UCOS Readiness Fabric — Policy Engine (RDN-ENG-POLICY, engine 1 of 7).
 *
 * Evaluates declarative readiness CRITERIA against the current assessment context. Every rule is
 * deny-by-default: an absent signal, a stale signal, a missing compliance result, an unresolved
 * certification, or an unmet threshold FAILS the rule. A failing `blocking` criterion is a hard gate
 * that forces overall `not-ready`; a failing non-blocking criterion is advisory (caps at `conditional`).
 *
 * The engine is pure: it reads the supplied context and returns outcomes. It never mutates state and
 * never emits events (the orchestrator owns audit/eventing).
 */

import type {
  CriterionOutcome,
  CriterionRule,
  DimensionAssessment,
  ComplianceResult,
  Gap,
  ReadinessCriterion,
  ReadinessSignal,
} from "./types.ts";
import { statusAtLeast } from "./readiness-signal.ts";

export interface PolicyEvaluationContext {
  /** Aggregated per-dimension assessment, keyed by dimensionId. */
  dimensions: Map<string, DimensionAssessment>;
  /** Latest (most recent `observedAt`) signal per dimension, keyed by dimensionId. */
  latestSignal: Map<string, ReadinessSignal>;
  /** Detected gaps (from the Gap-Detection Engine). */
  gaps: readonly Gap[];
  /** Compliance results keyed by controlId (from the Compliance Engine). */
  compliance: Map<string, ComplianceResult>;
  /** Certification ids that are currently valid (verified, non-revoked, unexpired). */
  activeCertifications: Set<string>;
  now: number;
}

export class ReadinessPolicyEngine {
  evaluate(criteria: readonly ReadinessCriterion[], ctx: PolicyEvaluationContext): CriterionOutcome[] {
    return criteria.map((c) => this.#evaluateCriterion(c, ctx));
  }

  #evaluateCriterion(criterion: ReadinessCriterion, ctx: PolicyEvaluationContext): CriterionOutcome {
    const failures: string[] = [];
    for (const rule of criterion.rules) {
      const failure = this.#evaluateRule(rule, ctx);
      if (failure) failures.push(failure);
    }
    return {
      criterionId: criterion.criterionId,
      passed: failures.length === 0,
      blocking: criterion.blocking,
      failures,
    };
  }

  /** Returns a human-readable failure reason, or `undefined` when the rule passes. */
  #evaluateRule(rule: CriterionRule, ctx: PolicyEvaluationContext): string | undefined {
    switch (rule.type) {
      case "min-score": {
        const dim = ctx.dimensions.get(rule.dimensionId);
        if (!dim) return `min-score: no signals for dimension '${rule.dimensionId}' (deny-by-default)`;
        if (dim.score < rule.min) {
          return `min-score: dimension '${rule.dimensionId}' score ${dim.score.toFixed(3)} < ${rule.min}`;
        }
        return undefined;
      }
      case "require-status": {
        const sig = ctx.latestSignal.get(rule.dimensionId);
        if (!sig) return `require-status: no signal for dimension '${rule.dimensionId}'`;
        if (!statusAtLeast(sig.status, rule.status)) {
          return `require-status: dimension '${rule.dimensionId}' status '${sig.status}' < required '${rule.status}'`;
        }
        return undefined;
      }
      case "require-signal": {
        if (!ctx.latestSignal.get(rule.dimensionId)) {
          return `require-signal: no signal present for dimension '${rule.dimensionId}'`;
        }
        return undefined;
      }
      case "max-signal-age": {
        const sig = ctx.latestSignal.get(rule.dimensionId);
        if (!sig) return `max-signal-age: no signal for dimension '${rule.dimensionId}'`;
        const age = ctx.now - sig.observedAt;
        if (age > rule.maxAgeMs) {
          return `max-signal-age: dimension '${rule.dimensionId}' signal is stale (age ${age}ms > ${rule.maxAgeMs}ms)`;
        }
        return undefined;
      }
      case "no-critical-gaps": {
        const criticals = ctx.gaps.filter((g) => g.severity === "critical");
        if (criticals.length > 0) {
          return `no-critical-gaps: ${criticals.length} critical gap(s) present`;
        }
        return undefined;
      }
      case "require-compliance": {
        const result = ctx.compliance.get(rule.controlId);
        if (!result) return `require-compliance: control '${rule.controlId}' not assessed (deny-by-default)`;
        if (result.status !== "compliant") {
          return `require-compliance: control '${rule.controlId}' is ${result.status}`;
        }
        return undefined;
      }
      case "require-certification": {
        if (!ctx.activeCertifications.has(rule.certificationId)) {
          return `require-certification: certification '${rule.certificationId}' is not active/valid`;
        }
        return undefined;
      }
      default: {
        // Exhaustiveness guard: an unknown rule shape is a hard fail (deny-by-default).
        const _exhaustive: never = rule;
        return `unknown rule type (deny-by-default): ${JSON.stringify(_exhaustive)}`;
      }
    }
  }
}
