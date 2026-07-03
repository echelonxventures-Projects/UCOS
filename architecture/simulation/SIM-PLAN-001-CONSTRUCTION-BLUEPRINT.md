# SIM-PLAN-001 — PI-11 Simulation Fabric Construction Blueprint

| Field | Value |
|-------|-------|
| Artifact | **SIM-PLAN-001 — Simulation Fabric Construction Blueprint** |
| Workstream | PHASE 20.2 · PI-11 Simulation Fabric Implementation Planning |
| Version | 1.0.0 |
| Status | **PLAN — READY FOR CONSTRUCTION** (planning artifact; no source code in this phase) |
| Authorizing act | **AD-0022** (RELEASE LOCK — PI-11 SIMULATION-FABRIC SCOPE ONLY, CONDITIONAL; effective 2026-07-01) |
| Basis (read-only) | `SIM-GOV-001/002`, `SIM-ARCH-001`, `SIM-SEC-001`, `SIM-FED-001`, `SIM-AUD-001`, `SIM-THREAT-001`, `SIM-READINESS-001`; PI-4 control, PI-5 federation (`assertions.ts`, `FederatedAuditLog`), PI-6 evolution, PI-7 knowledge |
| Target subtree | `packages/platform-runtime/src/control/simulation/*` (new) + additive interfaces in `src/control/simulation/types.ts` |
| Hard constraint | **Zero modification** of `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts` (SIM-COND-1) |
| Baseline to preserve | **134/134** implemented tests green (SIM-COND-2); implemented fabrics PI-2..PI-7 unchanged |
| Owner | UCOS Authority Board (Architecture) |

> This blueprint is the **construction-ready** translation of the ratified `SIM-*` design set into a concrete
> module topology, package boundaries, control interfaces, upstream-fabric integration points, and the three
> forward-dependency-gate (FDG) binding points. It authorizes **no** deviation from AD-0022 §2 scope and adds
> **no** capability beyond the seven ratified specifications. It produces **planning only**; construction is a
> subsequent step governed by SIM-PLAN-002.

---

## 1. Scope anchor (AD-0022 §2, restated for construction)

**Authorized to build (S-A + S-B):** the new simulation modules under `src/control/simulation/*` — sandbox
manager, digital-twin manager, scenario engine, deterministic state-projection engine, impact analyzer,
predictive adapter **interface** (+ deterministic models only), constraint evaluator, simulation registry,
revocation authority, federation guard, simulation audit (reuse/thin-wrap `FederatedAuditLog`), assembly, and
barrel — plus additive async interfaces in `src/control/simulation/types.ts`; and their tests under `test/`.

**Metadata namespaces (allowed):** `simulation:twin:*`, `simulation:scenario:*`, `simulation:model:*`,
`simulation:run:*`, `simulation:projection:*`, `simulation:impact:*`, `simulation:authority:*`,
`simulation:boundary:*`, `simulation:revoked:*`, `simulation:foreign:<nodeId>:*`, and the disposable
`simulation:sandbox:<runId>:*` keyspace.

**Not built here (deferred behind gates):** Intelligence-backed non-deterministic model binding (**FDG-INT**),
`memory:*` read enrichment (**FDG-MEM**), `ontology:*` semantic validation (**FDG-ONT**). See §7.

---

## 2. Module topology (`src/control/simulation/*`)

Each construct C1..C12 (SIM-GOV-001) maps to exactly one owning module. All modules are new; none modify a
prohibited core dir. Module names follow the implemented `knowledge/`/`evolution/`/`federation/` conventions.

| # | Module | Realizes (construct / spec) | Primary responsibility | Reuses |
|:-:|--------|-----------------------------|------------------------|--------|
| M0 | `types.ts` | C1..C12 record shapes; async seams | `SnapshotSource`, `PredictiveModel`, `SimulationSink`, record types, enums | PI-4 `types.ts`, FED `Provenance` |
| M1 | `simulation-registry.ts` | C1/C2/C3/C5/C6 index | Metadata-backed index of authorities/twins/scenarios/models/constraint-sets/runs | `MetadataPort` |
| M2 | `sandbox.ts` | C12 (SIM-GOV-002 §1.8) | Allocate/teardown `simulation:sandbox:<runId>:*`; static keyspace write-guard (SIM-SEC-ISO-1) | `MetadataPort` |
| M3 | `digital-twin.ts` | C2 (SIM-GOV-002 §1.2) | Bind/refresh twins to signed snapshots; fidelity; `stale` fail-closed; never actuates target | `assertions.ts`, M1, M2 |
| M4 | `scenario-engine.ts` | C3/C4 (SIM-GOV-002 §1.1) | Author/authorize/step scenarios; apply interventions in-sandbox; authority-cap enforcement | M1, M2, PI-4 policy |
| M5 | `projection-engine.ts` | C8 (SIM-GOV-002 §1.5) | **Deterministic** stepping baseline snapshot → projected state; reproducibility tuple | M2, M3 |
| M6 | `predictive-adapter.ts` | C5 (SGP-3) | Adapter **interface** + deterministic models; verifier-gate; non-det path advisory-only (FDG-INT stub) | M0 seam |
| M7 | `constraint-evaluator.ts` | C6 (SIM-GOV-002 §1.5) | Deterministic hard/soft + preserved-invariant checks; `invalid` never promotable | M1 |
| M8 | `impact-analyzer.ts` | C9 (SIM-GOV-002 §1.6) | Deltas/risks vs baseline; recommendation = `adopt-proposal`/`reject`/`inconclusive` | M5, M7 |
| M9 | `revocation-authority.ts` | C10 (SIM-GOV-002 D10) | Forward-only, fail-closed revocation propagation across twin/scenario/model/run/result | M1, M12 |
| M10 | `federation-guard.ts` | C11 (SIM-FED-001 §4) | Advisory/deny-only foreign contributions; clamp trust; local-shadows-foreign | FED `assertions.ts`, `trust-boundary.ts`, M1 |
| M11 | `promotion-pipeline.ts` | pipeline (SIM-GOV-002 §3) | Orchestrate proposal → PI-4 policy → constraint → cert(SoD) → ratify → **Evolution Unit** | PI-4 PEP, PI-6 governor |
| M12 | `simulation-audit-log.ts` | audit (SIM-AUD-001) | Hash-chained tamper-evident `SIM_*` audit; reproducibility tuple; checkpoints | `FederatedAuditLog` |
| M13 | `simulation-control.ts` | assembly (SIM-ARCH-001 §1) | `createSimulationFabric(substrate, control, fabrics, options)` wiring | M0..M12 |
| M14 | `index.ts` | barrel | Namespaced re-export (mirrors knowledge barrel) | — |

**Dependency direction (acyclic):** `types → registry → sandbox → {digital-twin, scenario-engine} →
projection-engine → {predictive-adapter, constraint-evaluator} → impact-analyzer → promotion-pipeline`; with
`federation-guard`, `revocation-authority`, and `simulation-audit-log` as cross-cutting leaves consumed by the
engines; `simulation-control` composes all; `index` re-exports. No module imports from a prohibited core dir.

---

## 3. Package boundaries

| Boundary | Rule | Enforcement |
|----------|------|-------------|
| **B1 — Core-dir isolation** | No `import` from `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts` except via their **public seams** (`RegistryPort`, `MetadataPort`, `ConfigurationPort`, `MetaCoreKernel` public API) | Static import-audit gate (SIM-PLAN-003 G-DIR); mtime-integrity check post-build |
| **B2 — Control-only surface** | All new code lives under `src/control/simulation/*`; the sole edit outside it is **one** additive re-export line in `src/control/index.ts` | Diff review; file-inventory gate |
| **B3 — Fabric reuse, not re-implementation** | Crypto → `federation/assertions.ts`; audit → `FederatedAuditLog`; policy → PI-4 `PolicyEvaluator`; commit → PI-6 Evolution; cross-node → PI-5 federation | No `crypto.*` primitive re-implementation (SIM-COND-2: no custom cryptography) |
| **B4 — Namespace confinement** | Writes only to the AD-0022 §2 allowed namespaces; run writes only to `simulation:sandbox:<runId>:*` | M2 static keyspace guard (SIM-SEC-ISO-1) |
| **B5 — No commit power** | The fabric holds **no** independent write/rollback path to governed state; all governed mutation flows through M11 → Evolution Fabric | Architectural review; M11 is the only module referencing the Evolution governor |
| **B6 — Additive async** | New async interfaces are introduced **alongside** existing sync interfaces; no existing signature changes | Type-diff gate; 134/134 baseline unchanged |

---

## 4. Control interfaces (additive async seams — `src/control/simulation/types.ts`)

Introduced alongside existing interfaces (non-breaking), mirroring the FED-ARCH-001 pattern. Signatures below
are the **planned contracts**; construction realizes them exactly.

```ts
// src/control/simulation/types.ts  (control dir — NOT prohibited)

export interface SnapshotSource {
  readonly name: string;
  snapshot(targetRef: string): Promise<SignedSnapshot | undefined>;   // signed, expiring baseline
}

export interface PredictiveModel {
  readonly modelId: string;
  readonly kind: "deterministic" | "non-deterministic";               // non-det ⇒ verifier-gated, advisory
  forecast(input: ForecastInput): Promise<ForecastResult>;
}

export interface DeterministicVerifier {                              // gates non-deterministic contributions
  attest(result: ForecastResult, seed: string): Promise<VerifierAttestation | undefined>;
}

export interface SimulationSink { record(entry: SimAuditEntry): void; } // → FederatedAuditLog wrapper (M12)
```

**Assembly contract (M13):**
```ts
createSimulationFabric(
  substrate: { registry: RegistryPort; metadata: MetadataPort; configuration: ConfigurationPort },
  control:   ControlFabric,                                           // PI-4 PEP + PolicyEvaluator
  fabrics:   { evolution: EvolutionFabric; federation?: FederationFabric; knowledge?: KnowledgeQuerySurface },
  options?:  { snapshotSources?: SnapshotSource[]; predictiveModels?: PredictiveModel[];
               verifier?: DeterministicVerifier; auditSink?: SimulationSink }
): SimulationFabric
```
- All `options` are additive; defaults preserve current behavior (empty sources ⇒ fail-closed non-projectable).
- `control.execute`/PEP path is **unchanged**; simulation never calls the kernel to mutate governed state.

---

## 5. Upstream-fabric integration points

### 5.1 Knowledge Fabric (PI-7 · AD-0020) — **read-only baseline source**
- **Where:** `digital-twin.ts` (M3) and `scenario-engine.ts` (M4) obtain baseline state via the Knowledge
  **query surface** (governed `MetadataPort.get/query` + Knowledge read API), honoring S4 classification.
- **Direction:** read-only. Simulation never writes knowledge; there is no memory/knowledge back door.
- **Failure mode:** knowledge unavailable ⇒ baseline unresolvable ⇒ twin non-projectable (fail-closed).

### 5.2 Evolution Fabric (PI-6 · AD-0019) — **the only commit path**
- **Where:** `promotion-pipeline.ts` (M11) constructs an **Evolution Unit** targeting a governed namespace and
  submits it to the Evolution Governor (`submit → approve → certify → ratify → atomic apply`, `maxInFlight=1`).
- **Direction:** simulation → evolution proposal only. The Simulation Fabric introduces **no** independent
  commit/rollback path (SIM-COND-3; B5).
- **Failure mode:** policy denial, failed constraint check, missing certification, or governor rejection aborts
  the pipeline with **no commit** and discards the sandbox.

### 5.3 Federation Fabric (PI-5 · AD-0018) — **crypto, audit chain, co-simulation**
- **Crypto:** `digital-twin.ts`, `scenario-engine.ts`, `federation-guard.ts` verify signed assertions via
  `federation/assertions.ts` (Ed25519). No custom cryptography.
- **Audit:** `simulation-audit-log.ts` (M12) thin-wraps `FederatedAuditLog` (hash chain, SHA-256, signed
  checkpoints, cross-node reconciliation).
- **Co-simulation:** `federation-guard.ts` (M10) reuses PI-5 `trust-boundary.ts`/authority verification;
  foreign artifacts stored under `simulation:foreign:<nodeId>:*` with local-shadows-foreign; fail-closed on
  partition.

### 5.4 Control Plane (PI-4 · AD-0017) — **deny-by-default authorization**
- **Where:** every actuation-adjacent op routes through the PI-4 PEP: authenticate → resolve trust →
  deny-by-default policy → (promotion) evolution gate. `scenario-engine.ts` and `promotion-pipeline.ts` are the
  primary callers; the PEP decision path is unchanged.

---

## 6. Data-flow & isolation (construction-level)

```
scenario(active) ─▶ M2.allocate(runId)  ─▶  read pinned signed snapshot (Knowledge/Metadata, S4)  ─▶  materialize into sandbox
                     (isolated keyspace)      M5.step(...) [deterministic] / M6.forecast(...) [verifier-gated, advisory]
                                              M7.check(...) hard/soft + preserved invariants
                                              M8.assess(...) → simulation:projection:* / simulation:impact:* (advisory)
                                                                                                        │
   all run writes confined to  simulation:sandbox:<runId>:*  (M2 static guard rejects+audits any non-sandbox write)
                                                                                                        │
promotion ─▶ M11: Proposal ─ PI-4 Policy(sync,UNCHANGED) ─ M7 hard-constraint ─ Cert(SoD) ─ Ratify ─▶ Evolution Unit ─▶ commit
                                                                                                        │
                                                                                              M2.teardown(runId)  (fail-closed)
```

- **Reads:** governed queries only; sandbox holds copies, never authoritative records.
- **Emitted survivors:** only append-only `simulation:projection:*` / `simulation:impact:*` (advisory until
  Evolution-promoted).
- **Provenance:** carried in data (FED-PROV convention) — id-namespacing `nodeId::localId`,
  `descriptor.metadata.provenance`, disjoint `simulation:` keys — **no first-class core-port fields**.

---

## 7. Forward-dependency-gate (FDG) binding points

Each gate is built as an **inert seam now** and bound later under its own authorization. A constraint that
references an absent gated surface is **rejected (deny)**, never silently skipped (AD-0022 FDG-ONT rule,
generalized).

| Gate | Deferred capability | Binding point (module / seam) | Behavior until bound | Bind precondition |
|------|---------------------|-------------------------------|----------------------|-------------------|
| **FDG-INT** (PI-10 Intelligence) | Bind an Intelligence-backed **non-deterministic** predictive model to the Predictive Model Registry (C5) | `predictive-adapter.ts` (M6) `PredictiveModel{kind:"non-deterministic"}` + `DeterministicVerifier` seam | C5 accepts **deterministic models only**; non-det registration **denied**; adapter interface exists but unbound | PI-10 implemented + ratified + separate authorization + adversarial tests |
| **FDG-MEM** (PI-9 Memory) | `memory:*` read enrichment of baselines | `digital-twin.ts` (M3) baseline resolver — optional `memoryRef` read hook | Baselines use pinned snapshot + Knowledge Fabric only; `memory:*` reads **not issued** | PI-9 implemented + separate authorization + adversarial tests |
| **FDG-ONT** (PI-8 Ontology) | `ontology:*`-typed semantic validation of scenarios/twins | `constraint-evaluator.ts` (M7) — optional `ontologyRef` validation hook | Validate against declared Constraint Sets + Knowledge only; a constraint referencing an absent `ontology:*` surface is **rejected (deny)** | PI-8 implemented + separate authorization + adversarial tests |

**Binding discipline:** each FDG seam is a typed extension point with a default deny/absent implementation.
Wiring a real provider is an Approval-Required Operation (AD-0009) that MUST NOT occur during PI-11 construction
under AD-0022.

---

## 8. Prohibited-core-dir impact statement (construction)

| Prohibited dir | Change required by this blueprint? | Why not |
|----------------|:----------------------------------:|---------|
| `src/meta-core` | **No** | `kernel.execute` already async; simulation never mutates governed state directly |
| `src/registry-runtime` | **No** | Foreign twins/scenarios in a separate namespaced adapter instance (FED-PROV) |
| `src/metadata-runtime` | **No** | Sandbox + records use existing sync `put/get/query`; sandbox-prefixed keys |
| `src/configuration-runtime` | **No** | Simulation config via existing `setLayer` (unknown-layer append) |
| `src/contracts` | **No** | Provenance carried in existing free-form `descriptor.metadata` |

**All construction is confined to `src/control/simulation/*` (14 new modules + additive async interfaces) plus
one additive re-export in `src/control/index.ts`. Zero prohibited-core-dir change — SIM-COND-1 satisfied.**

---

## 9. Traceability
- **Refines:** `SIM-ARCH-001` (§1 component model, §3 async seams, §6 impact statement), `SIM-GOV-001/002`,
  `SIM-SEC-001`, `SIM-FED-001`, `SIM-AUD-001`, `SIM-THREAT-001`, `AD-0022` (§2 scope, SIM-COND-1..7,
  FDG-INT/MEM/ONT), `AD-0016..0020`.
- **Consumed by:** `SIM-PLAN-002` (implementation sequence), `SIM-PLAN-003` (validation & test architecture),
  and the PI-11 implementation act.
- **Owner:** UCOS Authority Board.

**END SIM-PLAN-001 — CONSTRUCTION BLUEPRINT · ZERO PROHIBITED-CORE-DIR CHANGE · FDG-INT/MEM/ONT DEFERRED · PLANNING ONLY.**
