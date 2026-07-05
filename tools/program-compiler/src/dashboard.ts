/**
 * Program Dashboard (WS11).
 *
 * Renders UCOS-PROGRAM-DASHBOARD.md and a machine-readable dashboard.json from a
 * compiled ProgramState. Layered by concern: overall completion, contract
 * toolchain, runtime/fabric layer, governance layer, evidence layer,
 * certification layer, open gaps, next executable item, blocked items.
 */

import type { ProgramState, ComputedWorkItem } from "./types.ts";

const STATUS_ICON: Record<string, string> = {
  COMPLETE: "\u2705",
  IN_PROGRESS: "\ud83d\udfe1",
  READY: "\ud83d\udfe2",
  BLOCKED: "\u26d4",
  EXTERNAL_BLOCKED: "\ud83d\udd12",
  OPEN: "\u2b1c",
};

function layer(items: ComputedWorkItem[], predicate: (c: ComputedWorkItem) => boolean): ComputedWorkItem[] {
  return items.filter(predicate);
}

function itemRow(c: ComputedWorkItem): string {
  const ev = c.evidence;
  const evStr = `${ev.certified + ev.verified}/${ev.required}`;
  return `| ${c.item.id} | ${c.item.title} | ${STATUS_ICON[c.status] ?? ""} ${c.status} | ${evStr} | ${c.unmetDependencies.join(", ") || "\u2014"} |`;
}

export function buildDashboardData(state: ProgramState): Record<string, unknown> {
  return {
    artifactId: "PROG-DASH-001",
    program: state.program,
    computedAt: state.computedAt,
    currentPhase: state.currentPhase,
    completionPercent: state.programHealth.completionPercent,
    counts: {
      total: state.programHealth.total,
      complete: state.programHealth.complete,
      inProgress: state.programHealth.inProgress,
      ready: state.programHealth.ready,
      blocked: state.programHealth.blocked,
      externalBlocked: state.programHealth.externalBlocked,
      open: state.programHealth.open,
    },
    nextExecutableWorkItem: state.nextExecutableWorkItem?.item.id ?? null,
    readyItems: state.readyItems,
    blockedItems: state.blockedItems,
    externalBlockedItems: state.externalBlockedItems,
    externalBlockers: state.externalBlockers.map((cb) => ({
      id: cb.blocker.id,
      target: cb.blocker.target,
      recommendation: cb.recommendation,
      reviewPermitted: cb.reviewPermitted,
      solvableBySoftware: cb.blocker.solvableBySoftware,
    })),
    constitutionalLocks: state.constitutionalLocks.map((cl) => ({
      id: cl.lock.id,
      closure: cl.lock.closure,
      state: cl.state,
      releasableBySoftware: cl.lock.releasableBySoftware,
    })),
    openGaps: state.gaps.filter((g) => g.status === "OPEN").length,
    governanceVerdict: state.governanceHealth.overallVerdict,
    closures: state.governanceHealth.closures.map((c) => ({ id: c.definition.id, verdict: c.verdict })),
    evidenceInconsistencies: state.programHealth.evidenceInconsistencies,
    warnings: state.warnings,
  };
}

export function renderDashboard(state: ProgramState): string {
  const h = state.programHealth;
  const g = state.governanceHealth;
  const next = state.nextExecutableWorkItem;
  const openGaps = state.gaps.filter((x) => x.status === "OPEN");

  const bar = (pct: number): string => {
    const filled = Math.round(pct / 5);
    return `[${"\u2588".repeat(filled)}${"\u2591".repeat(20 - filled)}] ${pct}%`;
  };

  const lines: string[] = [];
  lines.push("# UCOS Program Dashboard");
  lines.push("");
  lines.push("> **GENERATED FILE — DO NOT EDIT BY HAND.** Produced by the Constitutional Program Compiler");
  lines.push("> (`pnpm ucos:dashboard`). The source of truth is `registry/program/*.json`.");
  lines.push("");
  lines.push(`- **Program:** ${state.program}`);
  lines.push(`- **Current Phase:** ${state.currentPhase.id} — ${state.currentPhase.title} (${state.currentPhase.status})`);
  lines.push(`- **Computed At:** ${state.computedAt}`);
  lines.push(`- **Article IX:** ${g.articleIX} · **Construction Blocked:** ${g.constructionBlocked ? "YES" : "NO"}`);
  lines.push("");

  lines.push("## Overall Completion");
  lines.push("");
  lines.push("```");
  lines.push(bar(h.completionPercent));
  lines.push("```");
  lines.push("");
  lines.push(`Complete ${h.complete} · In-Progress ${h.inProgress} · Ready ${h.ready} · Blocked ${h.blocked} · External-Blocked ${h.externalBlocked} · Open ${h.open} · Total ${h.total}`);
  lines.push("");

  const emit = (title: string, rows: ComputedWorkItem[]): void => {
    if (rows.length === 0) return;
    lines.push(`## ${title}`);
    lines.push("");
    lines.push("| ID | Title | Status | Evidence | Unmet Deps |");
    lines.push("|----|-------|--------|----------|------------|");
    for (const r of rows) lines.push(itemRow(r));
    lines.push("");
  };

  emit("Contract Toolchain", layer(state.items, (c) => c.item.type === "work-item"));
  emit("Runtime / Fabric Layer", layer(state.items, (c) => c.item.type === "program-increment"));
  emit("Contract Authoring", layer(state.items, (c) => c.item.type === "prompt"));
  emit("Operational Activities", layer(state.items, (c) => c.item.type === "activity"));
  emit("Governance Layer", layer(state.items, (c) => c.item.type === "governance"));

  lines.push("## Governance Closure Layer");
  lines.push("");
  lines.push(`**Overall verdict: ${g.overallVerdict}**`);
  lines.push("");
  lines.push("| Closure | Verdict | Unmet Deps | Evidence (>=VERIFIED / required) | Notes |");
  lines.push("|---------|---------|------------|----------------------------------|-------|");
  for (const c of g.closures) {
    const ev = c.evidence;
    lines.push(
      `| ${c.definition.id} | ${c.verdict} | ${c.unmetDependencies.join(", ") || "\u2014"} | ${ev.certified + ev.verified}/${ev.required} | ${c.reasons.join("; ")} |`,
    );
  }
  lines.push("");

  // PHASE G.2 — Constitutional Lock Layer.
  lines.push("## Constitutional Lock Layer");
  lines.push("");
  lines.push("| Lock | Closure | State | Verdict | Releasable by SW | Required actor |");
  lines.push("|------|---------|-------|---------|------------------|----------------|");
  for (const cl of state.constitutionalLocks) {
    lines.push(
      `| ${cl.lock.id} | ${cl.lock.closure} | ${cl.state} | ${cl.closureVerdict} | ${cl.lock.releasableBySoftware ? "yes" : "**NO**"} | ${cl.lock.requiredActor} |`,
    );
  }
  lines.push("");

  // PHASE G.2 — External Blocker Layer (not software-solvable).
  lines.push("## External Blockers (not software-solvable)");
  lines.push("");
  if (state.externalBlockers.length === 0) {
    lines.push("None recorded.");
  } else {
    lines.push("| Blocker | Target | Recommendation | Review permitted | Required actor | Blocks |");
    lines.push("|---------|--------|----------------|------------------|----------------|--------|");
    for (const cb of state.externalBlockers) {
      const b = cb.blocker;
      lines.push(
        `| ${b.id} | ${b.target} | ${cb.recommendation} | ${cb.reviewPermitted ? "yes" : "no"} | ${b.required_actor} | ${b.blockedWorkItems.join(", ") || "\u2014"} |`,
      );
    }
    lines.push("");
    lines.push(`**EXTERNAL_BLOCKED items:** ${state.externalBlockedItems.join(", ") || "none"}`);
  }
  lines.push("");

  lines.push("## Evidence Layer");
  lines.push("");
  if (state.missingEvidence.length === 0) {
    lines.push("All required evidence is at least VERIFIED.");
  } else {
    lines.push("| Work Item | Evidence | State |");
    lines.push("|-----------|----------|-------|");
    for (const m of state.missingEvidence) lines.push(`| ${m.workItem} | ${m.evidenceId} | ${m.state} |`);
  }
  lines.push("");

  lines.push("## Next Executable Work Item");
  lines.push("");
  if (next) {
    lines.push(`\u27a1\ufe0f **${next.item.id} — ${next.item.title}** (owner: ${next.item.owner})`);
    lines.push("");
    lines.push("Acceptance criteria:");
    for (const a of next.item.acceptanceCriteria) lines.push(`- ${a}`);
  } else {
    lines.push("No READY work item. Every remaining item is BLOCKED, IN_PROGRESS, or COMPLETE — resolve blockers or evidence.");
  }
  lines.push("");

  lines.push("## Blocked Items");
  lines.push("");
  if (state.blockedItems.length === 0) {
    lines.push("None.");
  } else {
    for (const id of state.blockedItems) {
      const c = state.items.find((x) => x.item.id === id)!;
      lines.push(`- **${id}** — ${c.reasons.join("; ")}`);
    }
  }
  lines.push("");

  lines.push("## Open Gaps");
  lines.push("");
  lines.push("| Gap | Severity | Category | Work Item | Source |");
  lines.push("|-----|----------|----------|-----------|--------|");
  for (const gap of openGaps) {
    lines.push(`| ${gap.id} | ${gap.severity} | ${gap.category} | ${gap.workItem ?? "\u2014"} | ${gap.autoDiscovered ? "auto" : "declared"} |`);
  }
  lines.push("");

  if (state.warnings.length > 0) {
    lines.push("## Warnings");
    lines.push("");
    for (const w of state.warnings) lines.push(`- \u26a0\ufe0f ${w}`);
    lines.push("");
  }

  return lines.join("\n");
}
