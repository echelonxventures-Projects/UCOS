/**
 * UCOS Control Plane — Policy Enforcement Point over the Meta-Core kernel (AD-0017 Part C-E).
 *
 * This is the single controlled entry point for executing a substrate capability under the four
 * control fabrics. It is strictly ADDITIVE: it wraps the kernel's PUBLIC API and never modifies
 * the Meta-Core. Every request flows through:
 *
 *   authenticate (Identity) -> resolve trust (Trust) -> evaluate policy (Policy, deny-by-default)
 *   -> [governance gates expressed as policy rules] -> kernel.execute (contract-enforced)
 *
 * Every decision is written to the append-only audit log. Nothing about identities, trust, or
 * policy is hardcoded here; all of it is runtime data resolved from the substrate's Metadata and
 * Configuration runtimes.
 */

import type { MetaCoreKernel } from "../meta-core/kernel.ts";
import type { IdentityResolver } from "./identity/identity-resolver.ts";
import type { TrustEvaluator } from "./trust/trust-evaluator.ts";
import type { PolicyEvaluator } from "./policy/policy-evaluator.ts";
import type { AuditSink } from "./audit-log.ts";
import type { AuditEntry, Decision, DecisionContext, IdentityRecord, PrincipalRef } from "./types.ts";
import { AuthenticationError, AuthorizationError } from "./errors.ts";

export interface ControlPlanePorts {
  kernel: MetaCoreKernel;
  identity: IdentityResolver;
  trust: TrustEvaluator;
  policy: PolicyEvaluator;
  audit: AuditSink;
}

export interface ControlDecision extends Decision {
  identity: IdentityRecord;
  trustLevel: number;
  capabilityId: string;
  operation: string;
}

export class ControlPlane {
  readonly #kernel: MetaCoreKernel;
  readonly #identity: IdentityResolver;
  readonly #trust: TrustEvaluator;
  readonly #policy: PolicyEvaluator;
  readonly #audit: AuditSink;

  constructor(ports: ControlPlanePorts) {
    this.#kernel = ports.kernel;
    this.#identity = ports.identity;
    this.#trust = ports.trust;
    this.#policy = ports.policy;
    this.#audit = ports.audit;
  }

  /**
   * Authorize (without executing) a principal's request. Authenticates + resolves trust, then
   * returns the full control decision. Throws `AuthenticationError` if the principal cannot be
   * authenticated (authentication is a precondition of any decision).
   */
  authorize(principal: PrincipalRef, capabilityId: string, operation: string, input: unknown = null): ControlDecision {
    let identity: IdentityRecord;
    try {
      identity = this.#identity.resolve(principal);
    } catch (error) {
      this.#audit.record({
        at: Date.now(),
        identityId: principal.identityId,
        capabilityId,
        operation,
        effect: "authn-denied",
        reason: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AuthenticationError
        ? error
        : new AuthenticationError(`Authentication failed for "${principal.identityId}"`, { capabilityId, operation });
    }

    const trustLevel = this.#trust.resolveLevel(identity);
    const config = this.#kernel.configuration.resolve(capabilityId);
    const context: DecisionContext = { identity, trustLevel, capabilityId, operation, input, config };
    const decision = this.#policy.evaluate(context);

    this.#audit.record({
      at: Date.now(),
      identityId: identity.id,
      capabilityId,
      operation,
      effect: decision.effect,
      reason: decision.reason,
    });

    return { ...decision, identity, trustLevel, capabilityId, operation };
  }

  /**
   * Enforce the control decision and, if allowed, execute the capability operation through the
   * kernel (which enforces the ratified contract). Throws `AuthorizationError` on deny.
   */
  async execute(principal: PrincipalRef, capabilityId: string, operation: string, input: unknown): Promise<unknown> {
    const decision = this.authorize(principal, capabilityId, operation, input);
    if (decision.effect === "deny") {
      throw new AuthorizationError(decision.reason, {
        identityId: decision.identity.id,
        capabilityId,
        operation,
        matchedPolicies: decision.matchedPolicies,
      });
    }
    return this.#kernel.execute(capabilityId, operation, input);
  }

  /** Read-only view of the audit trail. */
  audit(): readonly AuditEntry[] {
    return this.#audit.entries();
  }
}
