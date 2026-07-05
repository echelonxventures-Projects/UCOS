/**
 * Agent Startup Context Generator (WS7) — token/credit optimization.
 *
 * Emits MINIMAL_CONTEXT.md: the smallest set of facts an agent needs to resume
 * work — current phase, next executable work item, its dependencies, acceptance
 * criteria, evidence requirements, and constitutional constraints — instead of
 * re-reading the entire repository. Reading this file is the intended startup
 * path and replaces repository-wide rediscovery.
 */

import type { ProgramState } from "./types.ts";

export function renderMinimalContext(state: ProgramState): string {
  const next = state.nextExecutableWorkItem;
  const h = state.programHealth;
  const g = state.governanceHealth;

  const lines: string[] = [];
  lines.push("# UCOS — Minimal Agent Startup Context");
  lines.push("");
  lines.push("> **GENERATED — DO NOT EDIT.** Produced by `pnpm ucos:context`. This file is the ONLY");
  lines.push("> startup context an agent needs. Do NOT re-audit the repository, reconstruct the");
  lines.push("> roadmap, or re-derive governance — consume this, then act. Source of truth:");
  lines.push("> `registry/program/*.json`.");
  lines.push("");
  lines.push(`**Program:** ${state.program} (Program Layer v${state.programLayerVersion})`);
  lines.push(`**Computed:** ${state.computedAt}`);
  lines.push("");
  lines.push("## Where the program is");
  lines.push(`- Phase: **${state.currentPhase.id} — ${state.currentPhase.title}** (${state.currentPhase.status})`);
  lines.push(`- Completion: **${h.completionPercent}%** (${h.complete}/${h.total} complete; ${h.ready} ready, ${h.blocked} blocked)`);
  lines.push(`- Governance verdict: **${g.overallVerdict}** · Article IX: **${g.articleIX}** · Construction blocked: **${g.constructionBlocked ? "YES" : "NO"}**`);
  lines.push("");

  lines.push("## Do this next (system-resolved — do not choose your own)");
  lines.push("");
  if (next) {
    lines.push(`### \u27a1\ufe0f ${next.item.id} — ${next.item.title}`);
    lines.push(`- **Type:** ${next.item.type} · **Phase:** ${next.item.phase} · **Owner:** ${next.item.owner}`);
    lines.push(`- **Dependencies (all COMPLETE):** ${next.metDependencies.join(", ") || "none"}`);
    lines.push("- **Acceptance criteria:**");
    for (const a of next.item.acceptanceCriteria) lines.push(`  - ${a}`);
    lines.push(`- **Required evidence:** ${next.item.requiredEvidence.join(", ") || "none declared"}`);
    lines.push(`- **Governance gates:** ${next.item.governanceGates.join(", ") || "none"}`);
    lines.push(`- **Constitutional constraints:** ${next.item.constitutionalConstraints.join("; ") || "none"}`);
    lines.push("");
    lines.push("Before starting, confirm authorization: `pnpm ucos:authorize " + next.item.id + "`");
  } else {
    lines.push("No READY work item. All remaining items are BLOCKED, IN_PROGRESS, or COMPLETE.");
    lines.push("Resolve the top blocked items or advance the outstanding evidence below.");
  }
  lines.push("");

  if (state.readyItems.length > 1) {
    lines.push("## Also ready (deterministic queue)");
    lines.push(state.readyItems.map((id) => `\`${id}\``).join(" \u00b7 "));
    lines.push("");
  }

  lines.push("## Hard blockers to be aware of");
  const criticalGaps = state.gaps.filter((x) => x.status === "OPEN" && (x.severity === "HIGH" || x.severity === "CRITICAL"));
  if (criticalGaps.length === 0) {
    lines.push("- None at HIGH/CRITICAL severity.");
  } else {
    for (const gap of criticalGaps.slice(0, 12)) lines.push(`- **${gap.id}** (${gap.severity}): ${gap.description}`);
  }
  lines.push("");

  // PHASE G.2 (WS6) — External blockers: agents must immediately know which blockers
  // are solvable and which are external (not software-solvable) so they do not waste
  // tokens re-investigating settled external determinations.
  lines.push("## External blockers (NOT software-solvable — do not try to close these)");
  if (state.externalBlockers.length === 0) {
    lines.push("- None recorded.");
  } else {
    lines.push("These require a governed action by an external actor. Software/agents cannot close them.");
    lines.push("");
    for (const cb of state.externalBlockers) {
      const b = cb.blocker;
      const flag = cb.recommendation === "DO_NOT_REINVESTIGATE" ? "\ud83d\uded1 DO NOT REINVESTIGATE" : "\ud83d\udd0d REVIEW PERMITTED (new evidence)";
      lines.push(`- **${b.id} \u2192 ${b.target}** — ${flag}`);
      lines.push(`  - Why external: ${b.reason.split(".")[0]}.`);
      lines.push(`  - Required actor: ${b.required_actor}`);
      lines.push(`  - Required action: ${b.required_action}`);
      lines.push(`  - Blocks: ${b.blockedWorkItems.join(", ") || "\u2014"}`);
      lines.push(`  - Re-open only when: ${b.review_trigger.reopenWhen}`);
      lines.push(`  - Last reviewed: ${b.last_review_date}${b.last_review_phase ? " (" + b.last_review_phase + ")" : ""}`);
    }
  }
  lines.push("");
  if (state.externalBlockedItems.length > 0) {
    lines.push(`> \u26a0\ufe0f **EXTERNAL_BLOCKED items:** ${state.externalBlockedItems.join(", ")}. These are NOT executable by an agent; do not select them as next work and do not re-audit them without a review trigger.`);
    lines.push("");
  }

  lines.push("## Constitutional locks");
  if (state.constitutionalLocks.length === 0) {
    lines.push("- None recorded.");
  } else {
    lines.push("| Lock | Closure | State | Verdict | Releasable by software |");
    lines.push("|------|---------|-------|---------|------------------------|");
    for (const cl of state.constitutionalLocks) {
      lines.push(`| ${cl.lock.id} | ${cl.lock.closure} | ${cl.state} | ${cl.closureVerdict} | ${cl.lock.releasableBySoftware ? "yes" : "NO"} |`);
    }
  }
  lines.push("");

  if (state.warnings.length > 0) {
    lines.push("## Integrity warnings");
    for (const w of state.warnings) lines.push(`- \u26a0\ufe0f ${w}`);
    lines.push("");
  }

  lines.push("## Rules of engagement");
  lines.push("- The system decides the next step; do not deviate to un-ready or unregistered work.");
  lines.push("- Do not mark work COMPLETE without VERIFIED/CERTIFIED evidence (evidence-based completion).");
  lines.push("- EXTERNAL_BLOCKED items require an external actor and are NOT software-solvable — do not attempt to close them or re-investigate them without a review trigger (rediscovery prevention).");
  lines.push("- Article IX / AD-0014 limits stand; construction of locked scope requires a governed release act.");
  lines.push("- To add work, append to `registry/program/*.json` and recompile — never hardcode.");
  lines.push("");
  return lines.join("\n");
}
