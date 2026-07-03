/**
 * UCOS Trust Fabric — Trust Model, Evaluation, Resolution, Federation (TRUST-001/TRUST-002).
 *
 * Trust is a runtime attribute of an identity (level + optional attributes). Requirements come
 * from capability metadata / policy at evaluation time. Federated trust authorities may raise an
 * identity's effective level. Nothing about trust is hardcoded per-identity.
 */

import type { IdentityRecord, TrustAuthority, TrustRequirement } from "../types.ts";

export interface TrustEvaluation {
  ok: boolean;
  level: number;
  reason: string;
}

function valueEquals(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export class TrustEvaluator {
  readonly #authorities: TrustAuthority[] = [];

  registerAuthority(authority: TrustAuthority): void {
    this.#authorities.push(authority);
  }

  /** Effective trust level = max(local level, any federated authority level). */
  resolveLevel(identity: IdentityRecord): number {
    let level = identity.trust?.level ?? 0;
    for (const authority of this.#authorities) {
      const federated = authority.levelFor(identity.id);
      if (federated !== undefined && federated > level) level = federated;
    }
    return level;
  }

  evaluate(identity: IdentityRecord, requirement: TrustRequirement): TrustEvaluation {
    const level = this.resolveLevel(identity);
    if (requirement.minLevel !== undefined && level < requirement.minLevel) {
      return { ok: false, level, reason: `trust level ${level} < required ${requirement.minLevel}` };
    }
    for (const [key, expected] of Object.entries(requirement.attributes ?? {})) {
      if (!valueEquals(identity.trust?.attributes?.[key], expected)) {
        return { ok: false, level, reason: `trust attribute "${key}" mismatch` };
      }
    }
    return { ok: true, level, reason: "trust requirements satisfied" };
  }
}
