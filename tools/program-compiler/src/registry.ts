/**
 * Registry loader. Reads registry/program/*.json into a typed ProgramRegistry.
 *
 * The registry is the single source of truth (WS1). This loader performs
 * structural validation and fails closed (throws) on malformed input so that
 * no downstream engine ever computes against a corrupt registry.
 */

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type {
  ProgramRegistry,
  WorkItem,
  DependencyEdge,
  EvidenceRecord,
  ClosureDefinition,
  GapRecord,
  ProgramStateFile,
  ExternalBlocker,
  ConstitutionalLock,
} from "./types.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Repository root, resolved relative to this file (tools/program-compiler/src). */
export const REPO_ROOT = resolve(__dirname, "..", "..", "..");
export const REGISTRY_DIR = join(REPO_ROOT, "registry", "program");

function readJson<T>(file: string): T {
  const path = join(REGISTRY_DIR, file);
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch (err) {
    throw new Error(`Program registry file missing or unreadable: ${path} (${(err as Error).message})`);
  }
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    throw new Error(`Program registry file is not valid JSON: ${path} (${(err as Error).message})`);
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Registry validation failed: ${message}`);
}

/** Load and structurally validate the full program registry. Fails closed. */
export function loadRegistry(): ProgramRegistry {
  const state = readJson<ProgramStateFile>("state.json");
  const workItemsDoc = readJson<{ workItems: WorkItem[] }>("work-items.json");
  const depsDoc = readJson<{ edges: DependencyEdge[] }>("dependencies.json");
  const evidenceDoc = readJson<{ evidence: EvidenceRecord[] }>("evidence-registry.json");
  const closureDoc = readJson<{ closures: ClosureDefinition[] }>("closure-matrix.json");
  const gapsDoc = readJson<{ gaps: GapRecord[] }>("gaps.json");
  const extBlockerDoc = readJson<{ externalBlockers: ExternalBlocker[] }>("external-blockers.json");
  const lockDoc = readJson<{ locks: ConstitutionalLock[] }>("constitutional-locks.json");

  assert(Array.isArray(workItemsDoc.workItems), "work-items.json must contain a workItems array");
  assert(Array.isArray(depsDoc.edges), "dependencies.json must contain an edges array");
  assert(Array.isArray(evidenceDoc.evidence), "evidence-registry.json must contain an evidence array");
  assert(Array.isArray(closureDoc.closures), "closure-matrix.json must contain a closures array");
  assert(Array.isArray(gapsDoc.gaps), "gaps.json must contain a gaps array");
  assert(Array.isArray(extBlockerDoc.externalBlockers), "external-blockers.json must contain an externalBlockers array");
  assert(Array.isArray(lockDoc.locks), "constitutional-locks.json must contain a locks array");

  const ids = new Set<string>();
  for (const wi of workItemsDoc.workItems) {
    assert(wi.id, "every work item requires an id");
    assert(!ids.has(wi.id), `duplicate work item id: ${wi.id}`);
    ids.add(wi.id);
    assert(Array.isArray(wi.requiredEvidence), `${wi.id}: requiredEvidence must be an array`);
    assert(typeof wi.priority === "number", `${wi.id}: priority must be a number`);
  }

  // Referential integrity: dependency endpoints must be registered work items.
  for (const edge of depsDoc.edges) {
    assert(ids.has(edge.from), `dependency edge references unknown work item (from): ${edge.from}`);
    assert(ids.has(edge.dependsOn), `dependency edge references unknown work item (dependsOn): ${edge.dependsOn}`);
    assert(edge.from !== edge.dependsOn, `self-dependency is not allowed: ${edge.from}`);
  }

  // Referential integrity: evidence must reference a registered work item.
  const evidenceIds = new Set<string>();
  for (const ev of evidenceDoc.evidence) {
    assert(ev.id, "every evidence record requires an id");
    assert(!evidenceIds.has(ev.id), `duplicate evidence id: ${ev.id}`);
    evidenceIds.add(ev.id);
    assert(ids.has(ev.workItem), `${ev.id}: references unknown work item ${ev.workItem}`);
  }

  // Referential integrity: external blockers (PHASE G.2). Blocked work items must be
  // registered; blocked evidence must be registered. Fails closed on drift.
  const closureIds = new Set(closureDoc.closures.map((c) => c.id));
  const blockerIds = new Set<string>();
  for (const b of extBlockerDoc.externalBlockers) {
    assert(b.id, "every external blocker requires an id");
    assert(!blockerIds.has(b.id), `duplicate external blocker id: ${b.id}`);
    blockerIds.add(b.id);
    assert(Array.isArray(b.blockedWorkItems), `${b.id}: blockedWorkItems must be an array`);
    assert(Array.isArray(b.blockedEvidence), `${b.id}: blockedEvidence must be an array`);
    assert(b.solvableBySoftware === false, `${b.id}: an external blocker must have solvableBySoftware=false`);
    for (const wi of b.blockedWorkItems) assert(ids.has(wi), `${b.id}: blockedWorkItems references unknown work item ${wi}`);
    for (const ev of b.blockedEvidence) assert(evidenceIds.has(ev), `${b.id}: blockedEvidence references unknown evidence ${ev}`);
    assert(b.review_trigger && Array.isArray(b.review_trigger.watchEvidence), `${b.id}: review_trigger.watchEvidence must be an array`);
  }

  // Referential integrity: constitutional locks (PHASE G.2). Each lock maps to a
  // registered closure; a declared external lock must reference a known blocker.
  const lockIds = new Set<string>();
  for (const l of lockDoc.locks) {
    assert(l.id, "every constitutional lock requires an id");
    assert(!lockIds.has(l.id), `duplicate lock id: ${l.id}`);
    lockIds.add(l.id);
    assert(closureIds.has(l.closure), `${l.id}: references unknown closure ${l.closure}`);
    if (l.externalBlocker) assert(blockerIds.has(l.externalBlocker), `${l.id}: references unknown external blocker ${l.externalBlocker}`);
  }

  return {
    state,
    workItems: workItemsDoc.workItems,
    dependencies: depsDoc.edges,
    evidence: evidenceDoc.evidence,
    closures: closureDoc.closures,
    gaps: gapsDoc.gaps,
    externalBlockers: extBlockerDoc.externalBlockers,
    locks: lockDoc.locks,
  };
}
