# SIM-ARCH-001 — UCOS Simulation Architecture Specification

| Field | Value |
|-------|-------|
| Artifact | **SIM-ARCH-001 — Simulation Architecture Specification** |
| Workstream | FND-SIM-01 (PHASE 20 · PI-11 Simulation Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | `SIM-GOV-001/002`; PI-4 control seams; PI-5 federation (`assertions.ts`, `FederatedAuditLog`); PI-6 evolution governor; PI-7 knowledge, PI-9 memory, PI-8 ontology, PI-10 intelligence read/query surfaces |
| Realizes | Digital-Twin manager · Scenario Engine · State-Projection Engine · Predictive Adapter · Impact Analyzer · Sandbox manager · Simulation Evolution path |
| **Hard constraint** | **NO modification of `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts`** |
| Prohibited-dir impact | **NONE** — all engines are new control-layer modules under `src/control/simulation/*` operating on metadata records via existing public seams |

> The Simulation Fabric is compute-heavy and often network-bound (co-simulation, remote snapshots). This spec
> defines an architecture that runs simulation **entirely within the control layer**, keeps the synchronous
> PI-4 decision/authorization path unchanged, executes every run inside a disposable sandbox against a pinned
> snapshot, and modifies **none** of the five prohibited core dirs. The existing implemented test baseline
> (**134/134** at PI-7 Knowledge) remains green; PI-8/9/10 remain design-only.

---

## 1. Component model (all under `src/control/simulation/*`)

| Component | Module (proposed) | Responsibility |
|-----------|-------------------|----------------|
| Simulation types | `simulation/types.ts` | Record shapes C1..C12; async engine interfaces |
| Digital-Twin manager | `simulation/digital-twin.ts` | Bind/refresh twins to signed snapshots; fidelity handling; staleness |
| Scenario Engine | `simulation/scenario-engine.ts` | Author/authorize/step scenarios; apply interventions in-sandbox |
| State-Projection Engine | `simulation/projection-engine.ts` | Deterministic stepping from baseline snapshot → projected state |
| Predictive Adapter | `simulation/predictive-adapter.ts` | Quarantined non-deterministic forecasts; verifier gate; advisory-only |
| Impact Analyzer | `simulation/impact-analyzer.ts` | Compute deltas/risks vs baseline; constraint compliance; recommendation |
| Sandbox manager | `simulation/sandbox.ts` | Allocate/tear-down `simulation:sandbox:<runId>:*`; isolation enforcement |
| Constraint evaluator | `simulation/constraint-evaluator.ts` | Deterministic hard/soft + preserved-invariant checks |
| Simulation registry | `simulation/simulation-registry.ts` | Metadata-backed index of twins/scenarios/models/runs |
| Revocation authority | `simulation/revocation-authority.ts` | Forward-only, fail-closed revocation propagation |
| Federation guard | `simulation/federation-guard.ts` | Advisory/deny-only foreign contributions; clamp; local-shadows-foreign |
| Simulation audit | `simulation/simulation-audit-log.ts` | Hash-chained tamper-evident audit (reuse/thin-wrap `FederatedAuditLog`) |
| Assembly + barrel | `simulation/simulation-control.ts`, `simulation/index.ts` | `createSimulationFabric(substrate, control, fabrics)`; re-export |

**Reuse (no re-implementation):** cryptography → `src/control/federation/assertions.ts`; audit chain →
`FederatedAuditLog`; policy evaluation → PI-4 policy evaluator; commit → PI-6 Evolution Fabric; cross-node →
PI-5 federation; reads → Knowledge/Memory/Ontology/Intelligence query surfaces.

## 2. Chosen execution pattern — Sandboxed Snapshot Simulation + Async Ingestion + Sync Decision

```
                    ┌──────────── async / compute-heavy (NEW control-layer simulation modules) ────────────┐
  scenario   ──▶  SandboxManager.allocate(runId)  ──▶  read pinned snapshot (governed queries, S4)  ──▶  materialize
                  (isolated keyspace)                  ProjectionEngine.step(...) / PredictiveAdapter(verifier)
                                                       ImpactAnalyzer.assess(...)   → Projection/Impact records
                                                                                                        │
                    all run writes confined to  simulation:sandbox:<runId>:*  (never a governed namespace)
                                                                                                        │
  promotion  ──▶  Proposal ─ PI-4 Policy(sync, UNCHANGED) ─ Constraint check ─ Cert(SoD) ─ Ratify ─▶ Evolution Unit ─▶ commit
                                                                                                        │
                                                                                            SandboxManager.teardown(runId)
```

- The **compute/async** work (twin binding, projection stepping, predictive inference, impact analysis) happens
  in **new control-layer modules** inside a **disposable sandbox partition**, completing **before** any
  promotion decision.
- The **decision/authorization path stays synchronous and unchanged** — the ratified PI-4 evaluator/plane and
  PI-6 evolution governor operate exactly as today. This is why the existing tests remain valid.
- Snapshots carry bounded staleness + hard expiry; expired ⇒ twin `stale` ⇒ non-projectable ⇒ fail-closed.

## 3. Additive async seams (control layer only)

Introduced **alongside** existing interfaces (non-breaking); mirrors the FED-ARCH-001 pattern:
```
// src/control/simulation/types.ts (control dir — NOT prohibited)
interface SnapshotSource   { readonly name: string; snapshot(targetRef): Promise<SignedSnapshot | undefined>; }
interface PredictiveModel  { readonly modelId: string; readonly kind: "deterministic"|"non-deterministic";
                             forecast(input): Promise<ForecastResult>; }   // non-det ⇒ verifier-gated, advisory
interface SimulationSink   { record(entry): void; }                        // → FederatedAuditLog wrapper
```
- The Meta-Core kernel (`kernel.execute`) is **already async** and unchanged; simulation never calls it to
  mutate governed state — promotion goes through the Evolution Fabric.
- `createSimulationFabric(...)` gains optional wiring (`snapshotSources`, `predictiveModels`, `auditSink`) —
  additive options; defaults preserve current behavior.

## 4. Data-flow & isolation guarantees

- **Reads:** governed queries only (`MetadataPort.get/query`, Knowledge/Memory/Ontology/Intelligence read
  surfaces), honoring S4 classification.
- **Writes:** exclusively into `simulation:sandbox:<runId>:*` via existing sync `MetadataPort.put`; a static
  keyspace guard rejects any write whose key is not sandbox-prefixed (defense-in-depth for SGP-2).
- **Emitted survivors:** only append-only `simulation:projection:*` / `simulation:impact:*` records; these are
  advisory until Evolution-promoted.
- **Provenance:** carried in data (FED-PROV convention) — id-namespacing `nodeId::localId`,
  `descriptor.metadata.provenance`, disjoint `simulation:` keys — **no first-class core-port fields**.

## 5. Backward-compatibility & non-regression

- No existing sync interface signature changes; async behavior is opt-in via new methods/providers.
- The implemented PI-2..PI-7 baseline (**134/134** tests) exercises only substrate/control/federation/
  evolution/knowledge paths and remains valid without modification.
- `src/control/index.ts` gains exactly one additive re-export of the simulation barrel; no other control file
  behavior changes (Digital-Twin/Scenario/Projection engines are new modules; federation/evolution reused).

## 6. Prohibited-core-dir impact statement

| Prohibited dir | Change required by this spec? | Why not |
|----------------|:-----------------------------:|---------|
| `src/meta-core` | **No** | `kernel.execute` already async; simulation never mutates governed state directly |
| `src/registry-runtime` | **No** | Foreign twins/scenarios in a separate namespaced adapter instance (FED-PROV) |
| `src/metadata-runtime` | **No** | Sandbox + records use existing sync `put/get/query`; sandbox-prefixed keys |
| `src/configuration-runtime` | **No** | Simulation config via existing `setLayer` (unknown layer append) |
| `src/contracts` | **No** | Provenance carried in existing free-form `descriptor.metadata` |

**All architecture is confined to `src/control/simulation/*` (new modules + additive async interfaces in
`src/control/simulation/types.ts`). Zero prohibited-core-dir change — constraint satisfied.**

## 7. Traceability
- **Refines:** `SIM-GOV-001/002`; FED-ARCH-001 (evolution pattern); `AD-0016..0020`.
- **Consumed by:** `SIM-SEC-001`, `SIM-FED-001`, `SIM-AUD-001`, `SIM-READINESS-001`, and a future PI-11
  implementation act.
- **Owner:** UCOS Authority Board (Architecture).

**END SIM-ARCH-001 — DESIGN · READY FOR RATIFICATION · ZERO PROHIBITED-CORE-DIR CHANGE · NO IMPLEMENTATION AUTHORIZED.**
