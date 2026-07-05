/**
 * Program Compiler (WS4) — the orchestrator.
 *
 * Consumes the Program Registry, the Dependency Engine, and the Evidence
 * Registry, and produces a single ProgramState object that answers, in one shot:
 *   Current Phase, Completed / Blocked / Ready Items, Missing Evidence,
 *   Next Executable Work Item, Program Health, Governance Health, Completion %.
 *
 * This is the ONLY startup context an agent needs (WS4/WS7): read the compiled
 * state instead of re-auditing the repository.
 */

import type {
  ProgramRegistry,
  ProgramState,
  ComputedWorkItem,
  ProgramHealth,
  GovernanceHealth,
} from "./types.ts";
import { computeItems } from "./dependency-engine.ts";
import { indexEvidence, unsatisfiedEvidence } from "./evidence-engine.ts";
import { resolveNextExecutable } from "./next-action.ts";
import { discoverGaps } from "./gap-engine.ts";
import { computeClosures } from "./governance-closure.ts";
import { computeExternalBlockers, applyExternalBlockers } from "./external-blockers.ts";
import { computeLocks } from "./constitutional-lock-engine.ts";

export function compile(registry: ProgramRegistry, now: Date = new Date()): ProgramState {
  const { computed: rawComputed, cycles } = computeItems(registry.workItems, registry.dependencies, registry.evidence);
  const evIndex = indexEvidence(registry.evidence);

  // PHASE G.2 (WS1/WS3/WS5): evaluate external blockers and overlay EXTERNAL_BLOCKED
  // status. This runs BEFORE ready/blocked/next-action resolution so that items gated
  // solely by an external actor are removed from the executable queue.
  const externalBlockers = computeExternalBlockers(registry.externalBlockers, registry.evidence);
  const computed = applyExternalBlockers(rawComputed, externalBlockers, registry.evidence);

  const byStatus = (s: ComputedWorkItem["status"]) => computed.filter((c) => c.status === s);
  const complete = byStatus("COMPLETE");
  const inProgress = byStatus("IN_PROGRESS");
  const ready = byStatus("READY");
  const blocked = byStatus("BLOCKED");
  const externalBlocked = byStatus("EXTERNAL_BLOCKED");
  const open = byStatus("OPEN");

  const evidenceInconsistencies = computed.filter((c) => c.evidenceInconsistency).map((c) => c.item.id);

  // Missing evidence across the whole program (for the compiler "Missing Evidence" section).
  const missingEvidence: ProgramState["missingEvidence"] = [];
  for (const c of computed) {
    for (const u of unsatisfiedEvidence(c.item.requiredEvidence, evIndex)) {
      missingEvidence.push({ workItem: c.item.id, evidenceId: u.evidenceId, state: u.state });
    }
  }

  const total = computed.length;
  const completionPercent = total === 0 ? 0 : Math.round((complete.length / total) * 1000) / 10;

  const programHealth: ProgramHealth = {
    total,
    complete: complete.length,
    inProgress: inProgress.length,
    ready: ready.length,
    blocked: blocked.length,
    externalBlocked: externalBlocked.length,
    open: open.length,
    completionPercent,
    evidenceInconsistencies,
    cycles,
    orphanDependencies: [], // referential integrity enforced at load; retained for schema stability
  };

  const closureResult = computeClosures(registry.closures, computed, registry.evidence);
  const governanceHealth: GovernanceHealth = {
    articleIX: registry.state.constitutionalLock.articleIX,
    constructionBlocked: registry.state.constitutionalLock.constructionBlocked,
    closures: closureResult.closures,
    overallVerdict: closureResult.overallVerdict,
  };

  // PHASE G.2 (WS2/WS7): compute constitutional lock states from closure verdicts + blockers.
  const constitutionalLocks = computeLocks(
    registry.locks,
    closureResult.closures,
    externalBlockers,
    registry.evidence,
  );

  const gaps = discoverGaps(registry.gaps, computed, cycles);

  const warnings: string[] = [];
  if (cycles.length > 0) warnings.push(`${cycles.length} dependency cycle(s) detected — program graph is not acyclic.`);
  if (evidenceInconsistencies.length > 0)
    warnings.push(`${evidenceInconsistencies.length} evidence inconsistency(ies): ${evidenceInconsistencies.join(", ")}.`);
  if (externalBlocked.length > 0)
    warnings.push(
      `${externalBlocked.length} item(s) EXTERNAL_BLOCKED (require an external actor; not software-solvable): ${externalBlocked.map((c) => c.item.id).join(", ")}.`,
    );

  const nextExecutableWorkItem = resolveNextExecutable(computed);

  return {
    program: registry.state.program,
    programLayerVersion: registry.state.programLayerVersion,
    computedAt: now.toISOString(),
    currentPhase: registry.state.currentPhase,
    items: computed,
    nextExecutableWorkItem,
    readyItems: ready.map((c) => c.item.id),
    blockedItems: blocked.map((c) => c.item.id),
    externalBlockedItems: externalBlocked.map((c) => c.item.id),
    missingEvidence,
    gaps,
    externalBlockers,
    constitutionalLocks,
    programHealth,
    governanceHealth,
    warnings,
  };
}
