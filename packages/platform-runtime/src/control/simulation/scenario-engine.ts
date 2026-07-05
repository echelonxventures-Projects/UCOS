/**
 * UCOS PI-11 Simulation Fabric — M4 Scenario Engine (C3/C4, SIM-GOV-002 §1.1).
 *
 * Authors, authorizes, activates, and materializes scenarios. Authorization is deny-by-default and
 * enforces the authoring authority's enumerated `scenario` power, its scope glob, and its maximum
 * class cap. A civilization-class scenario (SGP-9) additionally requires explicit Board authorization
 * (S11 scope creep). Interventions are applied ONLY inside the run sandbox (non-actuation), under the
 * scenario budget (S5 resource exhaustion).
 */

import type { SimulationRegistry } from "./simulation-registry.ts";
import type { SandboxHandle } from "./sandbox.ts";
import type { ScenarioRecord, SimulationSink } from "./types.ts";
import { classRank, SimulationError } from "./types.ts";
import { sandboxPrefix } from "./simulation-namespace.ts";

/** `*`-glob match (matches the PI-4 policy glob semantics). Undefined/`*` = any. */
function globMatch(pattern: string | undefined, value: string): boolean {
  if (pattern === undefined || pattern === "*") return true;
  if (!pattern.includes("*")) return pattern === value;
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`).test(value);
}

export class ScenarioEngine {
  readonly #registry: SimulationRegistry;
  readonly #sink: SimulationSink | undefined;

  constructor(deps: { registry: SimulationRegistry; sink?: SimulationSink }) {
    this.#registry = deps.registry;
    this.#sink = deps.sink;
  }

  #audit(event: Parameters<SimulationSink["record"]>[0]["event"], actor: string, detail: string): void {
    this.#sink?.record({ at: Date.now(), event, actor, detail });
  }

  /** Author a scenario (D3). Validates the authority + twin exist and are usable. */
  author(scenario: Omit<ScenarioRecord, "state">): ScenarioRecord {
    const authority = this.#registry.getAuthority(scenario.authorityId);
    if (!authority || authority.status !== "active") {
      throw new SimulationError("SIMULATION_DENIED", `authority ${scenario.authorityId} unknown or revoked`, { authorityId: scenario.authorityId });
    }
    if (!authority.powers.includes("scenario")) {
      throw new SimulationError("SIMULATION_DENIED", `authority ${scenario.authorityId} lacks 'scenario' power`, { authorityId: scenario.authorityId });
    }
    const twin = this.#registry.getTwin(scenario.twinId);
    if (!twin) throw new SimulationError("SIMULATION_VALIDATION_FAILED", `unknown twin ${scenario.twinId}`, { twinId: scenario.twinId });
    this.#validateBudget(scenario.budget);

    const rec: ScenarioRecord = { ...scenario, state: "defined" };
    this.#registry.putScenario(rec);
    return rec;
  }

  /**
   * Authorize a scenario (D3, approval-required). Enforces scope glob, class cap, and — for
   * civilization class — mandatory Board authorization (SGP-9).
   */
  authorize(scenarioId: string, opts: { boardAuthorization?: string } = {}): ScenarioRecord {
    const scn = this.#requireScenario(scenarioId);
    const authority = this.#registry.getAuthority(scn.authorityId);
    if (!authority || authority.status !== "active") {
      this.#audit("DENY", "scenario", `authority revoked for ${scenarioId}`);
      throw new SimulationError("SIMULATION_DENIED", `authority ${scn.authorityId} unknown or revoked`, { scenarioId });
    }

    // Scope cap: the authority's scope glob must cover this scenario resource.
    const resource = `scenario:${scn.class}:${scn.scenarioId}`;
    if (!globMatch(authority.scope, resource)) {
      this.#audit("DENY", "scenario", `over-scope ${resource} for authority ${authority.authorityId}`);
      throw new SimulationError("SIMULATION_DENIED", `scenario ${scenarioId} outside authority scope`, { scenarioId, scope: authority.scope });
    }

    // Class cap: scenario classification must not exceed the authority's maxClass.
    const cap = authority.maxClass ?? "public";
    if (classRank(scn.classification) > classRank(cap)) {
      this.#audit("DENY", "scenario", `class ${scn.classification} > cap ${cap} for ${scenarioId}`);
      throw new SimulationError("SIMULATION_DENIED", `scenario class exceeds authority cap`, { scenarioId, cap });
    }

    // SGP-9: civilization-class scope requires explicit Board authorization; AD-0014 stands.
    if (scn.class === "civilization" && !opts.boardAuthorization) {
      this.#audit("DENY", "scenario", `civilization scenario ${scenarioId} without Board authorization`);
      throw new SimulationError("SCOPE_VIOLATION", "civilization-class scenario requires Board authorization (SGP-9)", { scenarioId });
    }

    const rec: ScenarioRecord = {
      ...scn,
      state: "authorized",
      ...(opts.boardAuthorization ? { boardAuthorization: opts.boardAuthorization } : {}),
    };
    this.#registry.putScenario(rec);
    this.#audit("SCENARIO_AUTHORIZED", "scenario", `scenario ${scenarioId} authorized class=${scn.class}`);
    return rec;
  }

  activate(scenarioId: string): ScenarioRecord {
    const scn = this.#requireScenario(scenarioId);
    if (scn.state !== "authorized") {
      throw new SimulationError("SIMULATION_DENIED", `scenario ${scenarioId} not authorized (state=${scn.state})`, { scenarioId });
    }
    const rec: ScenarioRecord = { ...scn, state: "active" };
    this.#registry.putScenario(rec);
    return rec;
  }

  /**
   * Materialize the baseline + scenario interventions into the run sandbox, enforcing the budget.
   * All writes go through the sandbox handle (keyspace-guarded). Returns the materialized state.
   */
  materialize(runId: string, scenarioId: string, baselineState: Record<string, unknown>, sandbox: SandboxHandle): Record<string, unknown> {
    const scn = this.#requireScenario(scenarioId);
    if (scn.state !== "active") {
      throw new SimulationError("SIMULATION_DENIED", `scenario ${scenarioId} not active`, { scenarioId });
    }
    const state: Record<string, unknown> = { ...baselineState };

    // S5: entity budget — reject an intervention set larger than the allowed entity count.
    const entityCount = Object.keys(state).length + scn.interventions.length;
    if (entityCount > scn.budget.maxEntities) {
      throw new SimulationError("BUDGET_EXCEEDED", `entity budget exceeded (${entityCount} > ${scn.budget.maxEntities})`, { scenarioId });
    }
    if (scn.interventions.length > scn.budget.maxSteps) {
      throw new SimulationError("BUDGET_EXCEEDED", `intervention count exceeds step budget`, { scenarioId });
    }

    for (const iv of scn.interventions) state[iv.path] = iv.value;
    // Persist the materialized state into the sandbox keyspace (guarded write).
    sandbox.put(`${sandboxPrefix(runId)}state`, state);
    return state;
  }

  #validateBudget(budget: ScenarioRecord["budget"]): void {
    for (const [k, v] of Object.entries(budget)) {
      if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) {
        throw new SimulationError("SIMULATION_VALIDATION_FAILED", `invalid budget.${k}`, { budget });
      }
    }
  }

  #requireScenario(scenarioId: string): ScenarioRecord {
    const scn = this.#registry.getScenario(scenarioId);
    if (!scn) throw new SimulationError("SIMULATION_VALIDATION_FAILED", `unknown scenario ${scenarioId}`, { scenarioId });
    return scn;
  }
}
