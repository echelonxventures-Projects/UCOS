/**
 * Program Dependency Engine (WS2).
 *
 * Capabilities:
 *  - dependency resolution (which items are met/unmet)
 *  - cycle detection (a cycle is a governance defect -> fail closed)
 *  - readiness computation -> READY / BLOCKED / IN_PROGRESS / COMPLETE
 *  - closure validation input
 *
 * Effective status is COMPUTED, never taken on faith: an item declared COMPLETE
 * whose evidence is not satisfied is NOT treated as complete (evidence-based
 * completion), which in turn keeps everything downstream honestly BLOCKED.
 */

import type {
  WorkItem,
  DependencyEdge,
  EvidenceRecord,
  ComputedWorkItem,
  WorkItemStatus,
  EvidenceRollup,
} from "./types.ts";
import { indexEvidence, rollupEvidence } from "./evidence-engine.ts";

export interface DependencyGraph {
  /** item id -> ids it depends on */
  dependsOn: Map<string, string[]>;
  /** item id -> ids that depend on it */
  dependents: Map<string, string[]>;
}

export function buildGraph(items: WorkItem[], edges: DependencyEdge[]): DependencyGraph {
  const dependsOn = new Map<string, string[]>();
  const dependents = new Map<string, string[]>();
  for (const item of items) {
    dependsOn.set(item.id, []);
    dependents.set(item.id, []);
  }
  for (const edge of edges) {
    dependsOn.get(edge.from)!.push(edge.dependsOn);
    dependents.get(edge.dependsOn)!.push(edge.from);
  }
  return { dependsOn, dependents };
}

/** Detect all simple cycles reachable in the dependsOn graph (DFS, colored). */
export function detectCycles(graph: DependencyGraph): string[][] {
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const color = new Map<string, number>();
  const cycles: string[][] = [];
  const seen = new Set<string>();

  for (const id of graph.dependsOn.keys()) color.set(id, WHITE);

  const stack: string[] = [];
  const visit = (node: string): void => {
    color.set(node, GRAY);
    stack.push(node);
    for (const next of graph.dependsOn.get(node) ?? []) {
      if (color.get(next) === GRAY) {
        // found a back-edge; extract the cycle from the stack
        const idx = stack.indexOf(next);
        const cycle = stack.slice(idx).concat(next);
        const key = [...cycle].sort().join(",");
        if (!seen.has(key)) {
          seen.add(key);
          cycles.push(cycle);
        }
      } else if (color.get(next) === WHITE) {
        visit(next);
      }
    }
    stack.pop();
    color.set(node, BLACK);
  };

  for (const id of graph.dependsOn.keys()) {
    if (color.get(id) === WHITE) visit(id);
  }
  return cycles;
}

/** Ids that participate in any detected cycle. */
function cyclicNodes(cycles: string[][]): Set<string> {
  const s = new Set<string>();
  for (const c of cycles) for (const n of c) s.add(n);
  return s;
}

/**
 * Compute the effective status of every work item. Two passes:
 *  1. local completeness (declared COMPLETE AND evidence satisfied)
 *  2. readiness given dependency completeness
 */
export function computeItems(
  items: WorkItem[],
  edges: DependencyEdge[],
  evidence: EvidenceRecord[],
): { computed: ComputedWorkItem[]; cycles: string[][] } {
  const graph = buildGraph(items, edges);
  const cycles = detectCycles(graph);
  const inCycle = cyclicNodes(cycles);
  const evIndex = indexEvidence(evidence);

  const rollups = new Map<string, EvidenceRollup>();
  const complete = new Map<string, boolean>();
  const inconsistency = new Map<string, boolean>();

  // Pass 1: local completeness.
  for (const item of items) {
    const rollup = rollupEvidence(item.requiredEvidence, evIndex);
    rollups.set(item.id, rollup);
    const declaredComplete = item.declaredStatus === "COMPLETE";
    const isComplete = declaredComplete && rollup.satisfied;
    complete.set(item.id, isComplete);
    inconsistency.set(item.id, declaredComplete && !rollup.satisfied);
  }

  // Pass 2: readiness + effective status.
  const computed: ComputedWorkItem[] = items.map((item) => {
    const deps = graph.dependsOn.get(item.id) ?? [];
    const unmet = deps.filter((d) => !complete.get(d));
    const met = deps.filter((d) => complete.get(d));
    const rollup = rollups.get(item.id)!;
    const reasons: string[] = [];
    let status: WorkItemStatus;

    if (inCycle.has(item.id)) {
      status = "BLOCKED";
      reasons.push("participates in a dependency cycle (governance defect)");
    } else if (complete.get(item.id)) {
      status = "COMPLETE";
    } else if (unmet.length > 0) {
      status = "BLOCKED";
      reasons.push(`blocked by ${unmet.length} incomplete dependency(ies): ${unmet.join(", ")}`);
    } else if (item.declaredStatus === "IN_PROGRESS") {
      status = "IN_PROGRESS";
    } else {
      status = "READY";
    }

    if (inconsistency.get(item.id)) {
      reasons.push(
        `declared COMPLETE but evidence not satisfied (${rollup.certified + rollup.verified}/${rollup.required} at >=VERIFIED, ${rollup.missing} missing)`,
      );
    }

    return {
      item,
      status,
      unmetDependencies: unmet,
      metDependencies: met,
      dependents: graph.dependents.get(item.id) ?? [],
      evidence: rollup,
      evidenceInconsistency: inconsistency.get(item.id) ?? false,
      reasons,
    };
  });

  return { computed, cycles };
}
