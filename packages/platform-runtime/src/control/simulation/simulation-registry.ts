/**
 * UCOS PI-11 Simulation Fabric — M1 Simulation Registry (SIM-PLAN-001 §2).
 *
 * A metadata-backed index of authorities (C1), twins (C2), scenarios (C3/C4), predictive models (C5),
 * and runs. Writes are confined to the AD-0022 §2 allowed `simulation:*` namespaces (B4). Reuses only
 * the substrate's PUBLIC `MetadataPort` seam — no core dir is modified (SIM-COND-1).
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type {
  DigitalTwinRecord,
  ImpactRecord,
  PredictiveModelRecord,
  ProjectionRecord,
  ScenarioRecord,
  SimulationAuthorityRecord,
  SimulationRunRecord,
} from "./types.ts";
import { SimulationError } from "./types.ts";
import {
  authorityKey,
  impactKey,
  isAllowedNamespace,
  modelKey,
  projectionKey,
  runKey,
  scenarioKey,
  twinKey,
} from "./simulation-namespace.ts";

export class SimulationRegistry {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  #put(key: string, value: unknown): void {
    // Defense-in-depth: the registry only ever writes to allowed simulation namespaces (B4).
    if (!isAllowedNamespace(key)) {
      throw new SimulationError("SANDBOX_ESCAPE", `registry write outside allowed namespace: ${key}`, { key });
    }
    this.#metadata.put(key, value);
  }

  #get<T>(key: string): T | undefined {
    return this.#metadata.get(key)?.value as T | undefined;
  }

  // ------------------------------- Authorities (C1) -------------------------------

  putAuthority(rec: SimulationAuthorityRecord): void {
    this.#put(authorityKey(rec.authorityId), rec);
  }
  getAuthority(id: string): SimulationAuthorityRecord | undefined {
    return this.#get<SimulationAuthorityRecord>(authorityKey(id));
  }

  // ------------------------------- Twins (C2) -------------------------------

  putTwin(rec: DigitalTwinRecord): void {
    this.#put(twinKey(rec.twinId), rec);
  }
  getTwin(id: string): DigitalTwinRecord | undefined {
    return this.#get<DigitalTwinRecord>(twinKey(id));
  }

  // ------------------------------- Scenarios (C3/C4) -------------------------------

  putScenario(rec: ScenarioRecord): void {
    this.#put(scenarioKey(rec.scenarioId), rec);
  }
  getScenario(id: string): ScenarioRecord | undefined {
    return this.#get<ScenarioRecord>(scenarioKey(id));
  }

  // ------------------------------- Predictive models (C5) -------------------------------

  putModel(rec: PredictiveModelRecord): void {
    this.#put(modelKey(rec.modelId), rec);
  }
  getModel(id: string): PredictiveModelRecord | undefined {
    return this.#get<PredictiveModelRecord>(modelKey(id));
  }

  // ------------------------------- Runs -------------------------------

  putRun(rec: SimulationRunRecord): void {
    this.#put(runKey(rec.runId), rec);
  }
  getRun(id: string): SimulationRunRecord | undefined {
    return this.#get<SimulationRunRecord>(runKey(id));
  }

  // ------------------------------- Projections (C8, advisory survivors) -------------------------------

  putProjection(rec: ProjectionRecord): void {
    this.#put(projectionKey(rec.projectionId), rec);
  }
  getProjection(id: string): ProjectionRecord | undefined {
    return this.#get<ProjectionRecord>(projectionKey(id));
  }

  // ------------------------------- Impacts (C9, advisory survivors) -------------------------------

  putImpact(rec: ImpactRecord): void {
    this.#put(impactKey(rec.impactId), rec);
  }
  getImpact(id: string): ImpactRecord | undefined {
    return this.#get<ImpactRecord>(impactKey(id));
  }
}
