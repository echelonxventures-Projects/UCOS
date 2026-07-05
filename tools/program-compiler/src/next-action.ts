/**
 * Next Action Engine (WS5).
 *
 * Deterministically resolves NEXT_EXECUTABLE_WORK_ITEM from the computed items.
 * Agents do not decide what to do next; the system decides. Selection is a
 * total order over READY items, so the result is stable across runs:
 *   1. lowest priority number (author-declared importance)
 *   2. most dependents unblocked (unblocks the most downstream work)
 *   3. lexical id (final tie-break -> fully deterministic)
 */

import type { ComputedWorkItem } from "./types.ts";

export function resolveNextExecutable(items: ComputedWorkItem[]): ComputedWorkItem | null {
  const ready = items.filter((c) => c.status === "READY");
  if (ready.length === 0) return null;

  ready.sort((a, b) => {
    if (a.item.priority !== b.item.priority) return a.item.priority - b.item.priority;
    if (a.dependents.length !== b.dependents.length) return b.dependents.length - a.dependents.length;
    return a.item.id.localeCompare(b.item.id);
  });

  return ready[0] ?? null;
}

/** All currently executable items, in the same deterministic order. */
export function resolveReadyQueue(items: ComputedWorkItem[]): ComputedWorkItem[] {
  const ready = items.filter((c) => c.status === "READY");
  ready.sort((a, b) => {
    if (a.item.priority !== b.item.priority) return a.item.priority - b.item.priority;
    if (a.dependents.length !== b.dependents.length) return b.dependents.length - a.dependents.length;
    return a.item.id.localeCompare(b.item.id);
  });
  return ready;
}
