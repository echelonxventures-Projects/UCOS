/**
 * Self-Healing Audit Capability (WS12) — the Audit Replay Engine.
 *
 * Future audits become REPLAY, not rediscovery. From the registry + evidence +
 * closures + compiled state, this engine reconstructs program status as a
 * compact, deterministic narrative plus a content fingerprint. A new agent
 * reconstructs the whole picture in seconds by reading the replay instead of
 * re-auditing the repository over thousands of tokens.
 */

import { createHash } from "node:crypto";
import type { ProgramRegistry, ProgramState } from "./types.ts";

/** Deterministic content fingerprint of the registry (drift detection). */
export function fingerprint(registry: ProgramRegistry): string {
  const canonical = JSON.stringify({
    workItems: registry.workItems.map((w) => ({ id: w.id, s: w.declaredStatus, e: w.requiredEvidence })),
    dependencies: registry.dependencies,
    evidence: registry.evidence.map((e) => ({ id: e.id, s: e.state })),
    closures: registry.closures.map((c) => ({ id: c.id, d: c.dependencies, e: c.requiredEvidence })),
  });
  return createHash("sha256").update(canonical).digest("hex").slice(0, 16);
}

export interface AuditReplay {
  program: string;
  fingerprint: string;
  computedAt: string;
  phases: {
    phase: string;
    items: { id: string; status: string; evidence: string; artifacts: string[] }[];
  }[];
  governanceVerdict: string;
  completionPercent: number;
  reconstructedFrom: string[];
}

export function replay(registry: ProgramRegistry, state: ProgramState): AuditReplay {
  const evByItem = new Map<string, string[]>();
  for (const ev of registry.evidence) {
    const arr = evByItem.get(ev.workItem) ?? [];
    if (ev.artifact) arr.push(`${ev.id}:${ev.state} -> ${ev.artifact}`);
    else arr.push(`${ev.id}:${ev.state}`);
    evByItem.set(ev.workItem, arr);
  }

  const phaseMap = new Map<string, AuditReplay["phases"][number]["items"]>();
  for (const c of state.items) {
    const list = phaseMap.get(c.item.phase) ?? [];
    list.push({
      id: c.item.id,
      status: c.status,
      evidence: `${c.evidence.certified + c.evidence.verified}/${c.evidence.required} >=VERIFIED`,
      artifacts: evByItem.get(c.item.id) ?? [],
    });
    phaseMap.set(c.item.phase, list);
  }

  const phases = [...phaseMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([phase, items]) => ({ phase, items }));

  return {
    program: state.program,
    fingerprint: fingerprint(registry),
    computedAt: state.computedAt,
    phases,
    governanceVerdict: state.governanceHealth.overallVerdict,
    completionPercent: state.programHealth.completionPercent,
    reconstructedFrom: [
      "registry/program/work-items.json",
      "registry/program/dependencies.json",
      "registry/program/evidence-registry.json",
      "registry/program/closure-matrix.json",
      "registry/program/gaps.json",
    ],
  };
}

export function renderReplay(r: AuditReplay): string {
  const lines: string[] = [];
  lines.push(`AUDIT REPLAY — ${r.program}`);
  lines.push(`fingerprint=${r.fingerprint} completion=${r.completionPercent}% governance=${r.governanceVerdict} computedAt=${r.computedAt}`);
  lines.push(`reconstructed from: ${r.reconstructedFrom.join(", ")}`);
  lines.push("");
  for (const p of r.phases) {
    lines.push(`# ${p.phase}`);
    for (const it of p.items) {
      lines.push(`  ${it.id} [${it.status}] evidence ${it.evidence}`);
      for (const a of it.artifacts) lines.push(`     - ${a}`);
    }
  }
  return lines.join("\n");
}
