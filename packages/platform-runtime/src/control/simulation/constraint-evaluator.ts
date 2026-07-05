/**
 * UCOS PI-11 Simulation Fabric — M7 Constraint Evaluator (C6, SIM-GOV-002 §1.5).
 *
 * Deterministic evaluation of hard/soft constraints and preserved-invariant checks against a projected
 * state. A projection that fails any hard constraint or preserved invariant is `invalid` and NEVER
 * promotable (S4). FDG-ONT: a constraint that references an `ontology:*` surface (`ontologyRef`) is
 * REJECTED (deny), never silently skipped, because ontology-typed semantic validation is deferred until
 * PI-8 binding under a separate authorization (AD-0022 FDG-ONT rule).
 */

import type { ConstraintResult, ConstraintSet, Constraint, SimulationSink } from "./types.ts";
import { SimulationError } from "./types.ts";

function resolve(state: Record<string, unknown>, path: string): unknown {
  // Dot-path resolution over the projected state.
  return path.split(".").reduce<unknown>((acc, seg) => {
    if (acc && typeof acc === "object" && seg in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[seg];
    }
    return undefined;
  }, state);
}

function satisfied(value: unknown, op: Constraint["op"], bound: Constraint["bound"]): boolean {
  switch (op) {
    case "eq":
      return value === bound;
    case "neq":
      return value !== bound;
    case "lte":
      return typeof value === "number" && typeof bound === "number" && value <= bound;
    case "gte":
      return typeof value === "number" && typeof bound === "number" && value >= bound;
    default:
      return false; // deny-safe
  }
}

export class ConstraintEvaluator {
  readonly #sink: SimulationSink | undefined;
  /** FDG-ONT provider is intentionally unbound during PI-11. */
  readonly #ontologyBound: boolean;

  constructor(deps: { sink?: SimulationSink; ontologyBound?: boolean } = {}) {
    this.#sink = deps.sink;
    this.#ontologyBound = deps.ontologyBound ?? false;
  }

  #audit(event: Parameters<SimulationSink["record"]>[0]["event"], detail: string): void {
    this.#sink?.record({ at: Date.now(), event, actor: "constraint-evaluator", detail });
  }

  /** Evaluate a constraint set against a projected state. Deterministic; fail-closed on FDG-ONT. */
  check(projectedState: Record<string, unknown>, set: ConstraintSet): ConstraintResult {
    const all = [...set.hard, ...set.soft, ...set.preservedInvariants];
    for (const c of all) {
      // FDG-ONT: absent ontology surface ⇒ deny, never skip (AD-0022, generalized).
      if (c.ontologyRef !== undefined && !this.#ontologyBound) {
        this.#audit("DENY", `FDG-ONT: constraint ${c.id} references unbound ontology surface`);
        throw new SimulationError("FDG_UNBOUND", `FDG-ONT: constraint '${c.id}' references an unbound ontology:* surface`, { constraintId: c.id, ontologyRef: c.ontologyRef });
      }
    }

    const hardFailures: string[] = [];
    const softWarnings: string[] = [];
    const invariantFailures: string[] = [];

    for (const c of set.hard) {
      if (!satisfied(resolve(projectedState, c.path), c.op, c.bound)) hardFailures.push(c.id);
    }
    for (const c of set.soft) {
      if (!satisfied(resolve(projectedState, c.path), c.op, c.bound)) softWarnings.push(c.id);
    }
    for (const c of set.preservedInvariants) {
      if (!satisfied(resolve(projectedState, c.path), c.op, c.bound)) invariantFailures.push(c.id);
    }

    const ok = hardFailures.length === 0 && invariantFailures.length === 0;
    this.#audit("CONSTRAINT_CHECKED", `ok=${ok} hard=${hardFailures.length} inv=${invariantFailures.length}`);
    return { ok, hardFailures, softWarnings, invariantFailures };
  }
}
