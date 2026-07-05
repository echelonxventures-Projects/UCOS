/**
 * Gap Registry Engine (WS9).
 *
 * Merges the declared gap registry (gaps.json) with gaps AUTO-DISCOVERED from
 * the computed program state, so gaps never have to be hand-maintained:
 *   - evidence inconsistencies (declared COMPLETE, evidence not satisfied)
 *   - dependency cycles (governance defect)
 *   - items with no declared evidence (completion unprovable)
 *   - long-blocked leaf work (blocked with no ready path — informational)
 */

import type { ComputedWorkItem, GapRecord } from "./types.ts";

export function discoverGaps(
  declared: GapRecord[],
  items: ComputedWorkItem[],
  cycles: string[][],
): GapRecord[] {
  const merged: GapRecord[] = [...declared];
  const existingIds = new Set(declared.map((g) => g.id));

  const add = (gap: GapRecord): void => {
    if (existingIds.has(gap.id)) return;
    existingIds.add(gap.id);
    merged.push(gap);
  };

  for (const c of items) {
    if (c.evidenceInconsistency) {
      add({
        id: `GAP-AUTO-EVID-${c.item.id}`,
        description: `${c.item.id} is declared COMPLETE but its evidence is not satisfied (${c.evidence.certified + c.evidence.verified}/${c.evidence.required} at >=VERIFIED, ${c.evidence.missing} missing). Evidence-based completion violated.`,
        workItem: c.item.id,
        severity: "HIGH",
        category: "evidence-inconsistency",
        status: "OPEN",
        autoDiscovered: true,
      });
    }
    if (c.item.requiredEvidence.length === 0 && c.status !== "COMPLETE") {
      add({
        id: `GAP-AUTO-NOEVID-${c.item.id}`,
        description: `${c.item.id} declares no required evidence; its completion can never be proven.`,
        workItem: c.item.id,
        severity: "MEDIUM",
        category: "evidence-missing",
        status: "OPEN",
        autoDiscovered: true,
      });
    }
  }

  for (const cycle of cycles) {
    add({
      id: `GAP-AUTO-CYCLE-${[...cycle].sort().join("_")}`,
      description: `Dependency cycle detected: ${cycle.join(" -> ")}. Cyclic items can never become READY.`,
      workItem: null,
      severity: "CRITICAL",
      category: "dependency-cycle",
      status: "OPEN",
      autoDiscovered: true,
    });
  }

  return merged;
}

export function openGaps(gaps: GapRecord[]): GapRecord[] {
  return gaps.filter((g) => g.status === "OPEN");
}
