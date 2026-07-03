/**
 * UCOS Readiness Fabric — Evolution-Readiness Engine (RDN-ENG-EVOLUTION, engine 4 of 7).
 *
 * Assesses whether the platform is in a SAFE state to evolve / be released with respect to the PI-6
 * Evolution Fabric's change-management posture. It does NOT drive evolution (that is PI-6's authority):
 * it reads an observed change-management snapshot (supplied by an oracle over the Evolution Fabric, or
 * reported) and decides — fail-closed — whether outstanding change activity blocks readiness.
 *
 * Blockers (deny-by-default):
 *   - a divergent evolution audit chain (tamper / partition) — always blocks;
 *   - unreconciled rollbacks — a rolled-back change not yet reconciled blocks;
 *   - open proposals beyond the configured ceiling;
 *   - pending (certified/ratified-but-unapplied) changes beyond the configured ceiling.
 */

import type { EvolutionReadinessInput, EvolutionReadinessPolicy, EvolutionReadinessResult } from "./types.ts";

export const DEFAULT_EVOLUTION_READINESS_POLICY: EvolutionReadinessPolicy = {
  maxOpenProposals: 0,
  maxPendingChanges: 0,
};

export class EvolutionReadinessEngine {
  assess(input: EvolutionReadinessInput, policy: EvolutionReadinessPolicy = DEFAULT_EVOLUTION_READINESS_POLICY): EvolutionReadinessResult {
    const blockers: string[] = [];

    if (input.auditDivergent) {
      blockers.push("evolution audit chain is divergent (tamper/partition) — hard block");
    }
    if (input.unreconciledRollbacks > 0) {
      blockers.push(`${input.unreconciledRollbacks} unreconciled rollback(s) outstanding`);
    }
    if (input.openProposals > policy.maxOpenProposals) {
      blockers.push(`open proposals ${input.openProposals} > ceiling ${policy.maxOpenProposals}`);
    }
    if (input.pendingChanges > policy.maxPendingChanges) {
      blockers.push(`pending changes ${input.pendingChanges} > ceiling ${policy.maxPendingChanges}`);
    }

    const ready = blockers.length === 0;
    return {
      ready,
      detail: ready
        ? "no outstanding evolution activity blocks readiness"
        : `${blockers.length} evolution readiness blocker(s)`,
      blockers,
    };
  }
}
