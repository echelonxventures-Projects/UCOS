/**
 * Generated-artifact writers.
 *
 * The compiler regenerates four derived artifacts from the compiled ProgramState.
 * None of these is hand-authored; all are DERIVED from registry/program/*.json:
 *   - registry/program/next-work-item.json  (machine-readable next action + authorization)
 *   - registry/program/dashboard.json        (machine-readable dashboard data)
 *   - UCOS-PROGRAM-DASHBOARD.md               (human dashboard)
 *   - MINIMAL_CONTEXT.md                      (agent startup context — token optimization)
 *
 * Writers are deterministic: identical registry input yields byte-identical output
 * (modulo the single computedAt timestamp, which callers can pin for determinism tests).
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT, REGISTRY_DIR } from "./registry.ts";
import type { ProgramState } from "./types.ts";
import { authorize } from "./authorization.ts";
import { buildDashboardData, renderDashboard } from "./dashboard.ts";
import { renderMinimalContext } from "./minimal-context.ts";

function writeJson(absPath: string, data: unknown): void {
  writeFileSync(absPath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function writeText(absPath: string, text: string): void {
  writeFileSync(absPath, text.endsWith("\n") ? text : text + "\n", "utf8");
}

/** Build the next-work-item.json payload: the system-resolved next action + its authorization. */
export function buildNextWorkItem(state: ProgramState): Record<string, unknown> {
  const next = state.nextExecutableWorkItem;
  const decision = next ? authorize(next, next.item.id) : null;
  return {
    artifactId: "PROG-NEXT-001",
    program: state.program,
    computedAt: state.computedAt,
    currentPhase: state.currentPhase,
    nextExecutableWorkItem: next
      ? {
          id: next.item.id,
          title: next.item.title,
          type: next.item.type,
          phase: next.item.phase,
          owner: next.item.owner,
          priority: next.item.priority,
          metDependencies: next.metDependencies,
          acceptanceCriteria: next.item.acceptanceCriteria,
          requiredEvidence: next.item.requiredEvidence,
          governanceGates: next.item.governanceGates,
          constitutionalConstraints: next.item.constitutionalConstraints,
          evidence: next.evidence,
        }
      : null,
    authorization: decision,
    readyQueue: state.readyItems,
    externalBlockedItems: state.externalBlockedItems,
    externalBlockers: state.externalBlockers.map((cb) => ({
      id: cb.blocker.id,
      target: cb.blocker.target,
      recommendation: cb.recommendation,
      reviewPermitted: cb.reviewPermitted,
      required_actor: cb.blocker.required_actor,
      blockedWorkItems: cb.blocker.blockedWorkItems,
    })),
    constitutionalLocks: state.constitutionalLocks.map((cl) => ({
      id: cl.lock.id,
      closure: cl.lock.closure,
      state: cl.state,
      releasableBySoftware: cl.lock.releasableBySoftware,
    })),
    note: next
      ? "System-resolved next executable work item. Do not choose your own; run ucos:authorize before starting. EXTERNAL_BLOCKED items are excluded — they require an external actor and must not be re-investigated without a review trigger."
      : "No READY work item. Resolve blockers or advance outstanding evidence. Note: EXTERNAL_BLOCKED items are not software-solvable.",
  };
}

export interface WrittenOutputs {
  nextWorkItem: string;
  dashboardData: string;
  dashboardDoc: string;
  minimalContext: string;
}

/** Regenerate all four derived artifacts. Returns the absolute paths written. */
export function writeOutputs(state: ProgramState): WrittenOutputs {
  const nextWorkItem = join(REGISTRY_DIR, "next-work-item.json");
  const dashboardData = join(REGISTRY_DIR, "dashboard.json");
  const dashboardDoc = join(REPO_ROOT, "UCOS-PROGRAM-DASHBOARD.md");
  const minimalContext = join(REPO_ROOT, "MINIMAL_CONTEXT.md");

  writeJson(nextWorkItem, buildNextWorkItem(state));
  writeJson(dashboardData, buildDashboardData(state));
  writeText(dashboardDoc, renderDashboard(state));
  writeText(minimalContext, renderMinimalContext(state));

  return { nextWorkItem, dashboardData, dashboardDoc, minimalContext };
}
