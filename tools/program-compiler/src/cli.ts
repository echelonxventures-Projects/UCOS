/**
 * Constitutional Program Compiler — CLI entry.
 *
 * The single command surface for the Autonomous Execution Governor. Everything is
 * DERIVED from registry/program/*.json (the single source of truth); this CLI never
 * hardcodes program content and never mutates the registry except via the governed
 * status-sync transitions.
 *
 * Subcommands:
 *   program-state | state   Compile + print the full program state and regenerate outputs.
 *   compile                 Regenerate all derived artifacts (no console report).
 *   dashboard               Regenerate + print the dashboard markdown.
 *   context                 Regenerate + print MINIMAL_CONTEXT.md.
 *   next                    Print the system-resolved next executable work item (JSON).
 *   authorize <id>          Run the execution-authorization (anti-deviation) check for <id>.
 *   external-blockers       Print the external blocker model + rediscovery-prevention (PHASE G.2).
 *   locks                   Print the constitutional lock registry with computed states (PHASE G.2).
 *   replay                  Print the deterministic audit-replay narrative + fingerprint.
 *   set-status <id> <S>     Governed declared-status transition (OPEN|IN_PROGRESS|COMPLETE).
 *   set-evidence <id> <S>   Governed evidence-state advance (PENDING|SUBMITTED|VERIFIED|CERTIFIED).
 *   verify                  Determinism + integrity self-check; exit non-zero on defect.
 *
 * Exit codes: 0 = success; 1 = governance/integrity defect or rejected authorization.
 *
 * Usage:  node tools/program-compiler/src/cli.ts <subcommand> [args]
 */

import { loadRegistry } from "./registry.ts";
import { compile } from "./compiler.ts";
import { authorize } from "./authorization.ts";
import { resolveReadyQueue } from "./next-action.ts";
import { replay, renderReplay, fingerprint } from "./audit-replay.ts";
import { renderDashboard } from "./dashboard.ts";
import { renderMinimalContext } from "./minimal-context.ts";
import { writeOutputs, buildNextWorkItem } from "./outputs.ts";
import {
  setWorkItemStatus,
  setEvidenceState,
  stampLastComputed,
  type DeclaredStatus,
} from "./status-sync.ts";
import type { ProgramState, EvidenceState } from "./types.ts";

const out = (s = ""): void => void process.stdout.write(s + "\n");
const err = (s = ""): void => void process.stderr.write(s + "\n");

/** Fixed timestamp for --deterministic runs (determinism tests, byte-identical output). */
const FIXED_TS = "1970-01-01T00:00:00.000Z";

function nowFor(argv: string[]): Date {
  return argv.includes("--deterministic") ? new Date(FIXED_TS) : new Date();
}

/** Human-readable program-state report — the `pnpm ucos:program-state` surface. */
function renderProgramState(state: ProgramState): string {
  const h = state.programHealth;
  const g = state.governanceHealth;
  const next = state.nextExecutableWorkItem;
  const openGaps = state.gaps.filter((x) => x.status === "OPEN");
  const L: string[] = [];

  L.push("============================================================");
  L.push(`  UCOS CONSTITUTIONAL PROGRAM STATE`);
  L.push("============================================================");
  L.push(`  Program        : ${state.program} (Program Layer v${state.programLayerVersion})`);
  L.push(`  Computed At     : ${state.computedAt}`);
  L.push("");
  L.push(`  Current Phase   : ${state.currentPhase.id} — ${state.currentPhase.title} (${state.currentPhase.status})`);
  L.push(`  Completion      : ${h.completionPercent}%  (${h.complete}/${h.total} complete)`);
  L.push("");
  L.push("  Program Health");
  L.push(`    Complete=${h.complete}  In-Progress=${h.inProgress}  Ready=${h.ready}  Blocked=${h.blocked}  External-Blocked=${h.externalBlocked}  Open=${h.open}  Total=${h.total}`);
  L.push(`    Evidence inconsistencies: ${h.evidenceInconsistencies.length ? h.evidenceInconsistencies.join(", ") : "none"}`);
  L.push(`    Dependency cycles       : ${h.cycles.length ? h.cycles.map((c) => c.join("->")).join(" | ") : "none (acyclic)"}`);
  L.push("");
  L.push("  Governance Health");
  L.push(`    Article IX: ${g.articleIX}   Construction Blocked: ${g.constructionBlocked ? "YES" : "NO"}`);
  L.push(`    Overall verdict: ${g.overallVerdict}`);
  for (const c of g.closures) {
    L.push(`      - ${c.definition.id}: ${c.verdict}  (${c.reasons.join("; ")})`);
  }
  L.push("");

  L.push("  Completed Items");
  const complete = state.items.filter((c) => c.status === "COMPLETE").map((c) => c.item.id);
  L.push(`    ${complete.length ? complete.join(", ") : "none"}`);
  L.push("");

  L.push("  Ready Items (deterministic queue)");
  const readyQueue = resolveReadyQueue(state.items);
  if (readyQueue.length === 0) L.push("    none");
  else for (const c of readyQueue) L.push(`    ${c.item.id} — ${c.item.title} (priority ${c.item.priority}, unblocks ${c.dependents.length})`);
  L.push("");

  L.push("  Blocked Items");
  if (state.blockedItems.length === 0) L.push("    none");
  else
    for (const id of state.blockedItems) {
      const c = state.items.find((x) => x.item.id === id)!;
      L.push(`    ${id} — ${c.reasons.join("; ")}`);
    }
  L.push("");

  L.push("  ===== EXTERNAL BLOCKERS (not software-solvable) =====");
  if (state.externalBlockers.length === 0) L.push("    none");
  else
    for (const cb of state.externalBlockers) {
      const b = cb.blocker;
      L.push(`    ${b.id} -> ${b.target}  [${cb.recommendation}]`);
      L.push(`      reason        : ${b.reason.split(".")[0]}.`);
      L.push(`      required actor: ${b.required_actor}`);
      L.push(`      required act. : ${b.required_action}`);
      L.push(`      required evid.: ${b.required_evidence.join(", ")}`);
      L.push(`      last review   : ${b.last_review_date}${b.last_review_phase ? " (" + b.last_review_phase + ")" : ""}`);
      L.push(`      review trigger: ${b.review_trigger.reopenWhen}`);
      L.push(`      blocked items : ${b.blockedWorkItems.join(", ") || "—"}`);
      if (cb.recommendation === "DO_NOT_REINVESTIGATE")
        L.push(`      >> DO NOT REINVESTIGATE — ${cb.reasons[cb.reasons.length - 1]}`);
      else L.push(`      >> REVIEW PERMITTED — advanced: ${cb.advancedEvidence.join(", ")}`);
    }
  L.push("");

  L.push("  Constitutional Locks");
  if (state.constitutionalLocks.length === 0) L.push("    none");
  else
    for (const cl of state.constitutionalLocks) {
      L.push(`    ${cl.lock.id} (${cl.lock.closure}): ${cl.state}  [${cl.closureVerdict}]  releasableBySoftware=${cl.lock.releasableBySoftware}`);
      L.push(`      ${cl.reasons.join("; ")}`);
    }
  L.push("");

  L.push("  Missing Evidence (required but < VERIFIED)");
  if (state.missingEvidence.length === 0) L.push("    none");
  else for (const m of state.missingEvidence) L.push(`    ${m.workItem}: ${m.evidenceId} [${m.state}]`);
  L.push("");

  L.push("  Open Gaps");
  if (openGaps.length === 0) L.push("    none");
  else
    for (const gap of openGaps)
      L.push(`    [${gap.severity}] ${gap.id} (${gap.category}${gap.autoDiscovered ? ", auto" : ""}) — ${gap.workItem ?? "—"}`);
  L.push("");

  L.push("  >>> NEXT EXECUTABLE WORK ITEM <<<");
  if (next) {
    const dec = authorize(next, next.item.id);
    L.push(`    ${next.item.id} — ${next.item.title}`);
    L.push(`    type=${next.item.type}  phase=${next.item.phase}  owner=${next.item.owner}`);
    L.push(`    dependencies (all COMPLETE): ${next.metDependencies.join(", ") || "none"}`);
    L.push(`    required evidence: ${next.item.requiredEvidence.join(", ") || "none"}`);
    L.push(`    authorization: ${dec.decision}${dec.authorized ? "" : " — " + dec.reasons.join("; ")}`);
  } else {
    L.push("    NONE — every remaining item is BLOCKED, IN_PROGRESS, or COMPLETE.");
    L.push("    Resolve the top blocked items or advance outstanding evidence.");
  }
  L.push("");

  if (state.warnings.length) {
    L.push("  Warnings");
    for (const w of state.warnings) L.push(`    ! ${w}`);
    L.push("");
  }
  L.push("============================================================");
  return L.join("\n");
}

function compileState(argv: string[]): ProgramState {
  const registry = loadRegistry();
  return compile(registry, nowFor(argv));
}

/** Regenerate the four derived artifacts and stamp state.json lastComputed. */
function regenerate(state: ProgramState, argv: string[]): void {
  const written = writeOutputs(state);
  if (!argv.includes("--deterministic")) stampLastComputed(state.computedAt);
  err(
    `regenerated: ${["next-work-item.json", "dashboard.json", "UCOS-PROGRAM-DASHBOARD.md", "MINIMAL_CONTEXT.md"].join(", ")}`,
  );
  void written;
}

function cmdProgramState(argv: string[]): void {
  const state = compileState(argv);
  regenerate(state, argv);
  out(renderProgramState(state));
  process.exitCode = state.programHealth.cycles.length > 0 ? 1 : 0;
}

function cmdCompile(argv: string[]): void {
  const state = compileState(argv);
  regenerate(state, argv);
  out("Program compiled. Derived artifacts regenerated from registry/program/*.json.");
}

function cmdDashboard(argv: string[]): void {
  const state = compileState(argv);
  regenerate(state, argv);
  out(renderDashboard(state));
}

function cmdContext(argv: string[]): void {
  const state = compileState(argv);
  regenerate(state, argv);
  out(renderMinimalContext(state));
}

function cmdNext(argv: string[]): void {
  const state = compileState(argv);
  out(JSON.stringify(buildNextWorkItem(state), null, 2));
}

function cmdAuthorize(argv: string[]): void {
  const id = argv.find((a) => !a.startsWith("--"));
  if (!id) {
    err("usage: authorize <work-item-id>");
    process.exitCode = 1;
    return;
  }
  const state = compileState(argv);
  const computed = state.items.find((c) => c.item.id === id);
  const decision = authorize(computed, id);
  out(JSON.stringify(decision, null, 2));
  out("");
  out(`DECISION: ${decision.decision}`);
  for (const c of decision.checks) out(`  [${c.passed ? "PASS" : "FAIL"}] ${c.name}: ${c.detail}`);
  process.exitCode = decision.authorized ? 0 : 1;
}

function cmdReplay(argv: string[]): void {
  const registry = loadRegistry();
  const state = compile(registry, nowFor(argv));
  out(renderReplay(replay(registry, state)));
}

/** PHASE G.2 — print the external blocker model + rediscovery-prevention recommendations. */
function cmdExternalBlockers(argv: string[]): void {
  const state = compileState(argv);
  out(JSON.stringify(
    {
      artifactId: "PROG-EXT-BLOCKER-VIEW-001",
      computedAt: state.computedAt,
      externalBlockedItems: state.externalBlockedItems,
      externalBlockers: state.externalBlockers.map((cb) => ({
        id: cb.blocker.id,
        target: cb.blocker.target,
        recommendation: cb.recommendation,
        reviewPermitted: cb.reviewPermitted,
        advancedEvidence: cb.advancedEvidence,
        solvableBySoftware: cb.blocker.solvableBySoftware,
        required_actor: cb.blocker.required_actor,
        required_action: cb.blocker.required_action,
        required_evidence: cb.blocker.required_evidence,
        last_review_date: cb.blocker.last_review_date,
        blockedWorkItems: cb.blocker.blockedWorkItems,
        reasons: cb.reasons,
      })),
    },
    null,
    2,
  ));
}

/** PHASE G.2 — print the constitutional lock registry with computed states. */
function cmdLocks(argv: string[]): void {
  const state = compileState(argv);
  out(JSON.stringify(
    {
      artifactId: "PROG-LOCK-VIEW-001",
      computedAt: state.computedAt,
      locks: state.constitutionalLocks.map((cl) => ({
        id: cl.lock.id,
        closure: cl.lock.closure,
        state: cl.state,
        closureVerdict: cl.closureVerdict,
        externalBlocked: cl.externalBlocked,
        releasableBySoftware: cl.lock.releasableBySoftware,
        requiredActor: cl.lock.requiredActor,
        requiredAuthority: cl.lock.requiredAuthority,
        releaseConditions: cl.lock.releaseConditions,
        reasons: cl.reasons,
      })),
    },
    null,
    2,
  ));
}

function cmdSetStatus(argv: string[]): void {
  const positional = argv.filter((a) => !a.startsWith("--"));
  const [id, status] = positional;
  const allowed: DeclaredStatus[] = ["OPEN", "IN_PROGRESS", "COMPLETE"];
  if (!id || !status || !allowed.includes(status as DeclaredStatus)) {
    err(`usage: set-status <id> <${allowed.join("|")}>`);
    process.exitCode = 1;
    return;
  }
  const { from, to } = setWorkItemStatus(id, status as DeclaredStatus);
  const state = compileState(argv);
  regenerate(state, argv);
  out(`${id}: ${from} -> ${to}. Registry updated and derived artifacts regenerated.`);
}

function cmdSetEvidence(argv: string[]): void {
  const positional = argv.filter((a) => !a.startsWith("--"));
  const [id, status] = positional;
  const allowed: EvidenceState[] = ["PENDING", "SUBMITTED", "VERIFIED", "CERTIFIED"];
  if (!id || !status || !allowed.includes(status as EvidenceState)) {
    err(`usage: set-evidence <id> <${allowed.join("|")}>`);
    process.exitCode = 1;
    return;
  }
  const { from, to } = setEvidenceState(id, status as EvidenceState);
  const state = compileState(argv);
  regenerate(state, argv);
  out(`${id}: ${from} -> ${to}. Registry updated and derived artifacts regenerated.`);
}

/** Determinism + integrity self-check (used by `verify` / determinism proof). */
function cmdVerify(argv: string[]): void {
  const registry = loadRegistry();
  const a = compile(registry, new Date(FIXED_TS));
  const b = compile(registry, new Date(FIXED_TS));
  const sa = JSON.stringify(a);
  const sb = JSON.stringify(b);
  const deterministic = sa === sb;
  const fp1 = fingerprint(registry);
  const fp2 = fingerprint(loadRegistry());

  const problems: string[] = [];
  if (!deterministic) problems.push("compile() is non-deterministic (two runs differ)");
  if (fp1 !== fp2) problems.push("registry fingerprint unstable across loads");
  if (a.programHealth.cycles.length > 0) problems.push(`dependency cycle(s): ${a.programHealth.cycles.map((c) => c.join("->")).join(" | ")}`);

  out("PROGRAM COMPILER SELF-CHECK");
  out(`  determinism        : ${deterministic ? "PASS" : "FAIL"}`);
  out(`  fingerprint stable : ${fp1 === fp2 ? "PASS" : "FAIL"} (${fp1})`);
  out(`  acyclic graph      : ${a.programHealth.cycles.length === 0 ? "PASS" : "FAIL"}`);
  out(`  next item resolved : ${a.nextExecutableWorkItem ? "PASS (" + a.nextExecutableWorkItem.item.id + ")" : "N/A (no READY item)"}`);
  out(`  governance verdict : ${a.governanceHealth.overallVerdict}`);
  out(`  completion         : ${a.programHealth.completionPercent}%`);
  if (problems.length) {
    err("\nDEFECTS:");
    for (const p of problems) err(`  - ${p}`);
    process.exitCode = 1;
  } else {
    out("\nALL CHECKS PASS.");
  }
  void argv;
}

const COMMANDS: Record<string, (argv: string[]) => void> = {
  "program-state": cmdProgramState,
  state: cmdProgramState,
  compile: cmdCompile,
  dashboard: cmdDashboard,
  context: cmdContext,
  next: cmdNext,
  authorize: cmdAuthorize,
  replay: cmdReplay,
  "external-blockers": cmdExternalBlockers,
  blockers: cmdExternalBlockers,
  locks: cmdLocks,
  "set-status": cmdSetStatus,
  "set-evidence": cmdSetEvidence,
  verify: cmdVerify,
};

function main(argv: string[]): void {
  const [cmd, ...rest] = argv;
  const handler = cmd ? COMMANDS[cmd] : COMMANDS["program-state"];
  if (!handler) {
    err(`Unknown subcommand: ${cmd}`);
    err(`Available: ${Object.keys(COMMANDS).join(", ")}`);
    process.exitCode = 1;
    return;
  }
  try {
    handler(rest);
  } catch (e) {
    err(`\nFAIL-CLOSED: ${(e as Error).message}`);
    process.exitCode = 1;
  }
}

main(process.argv.slice(2));
