# CIV-ARCH-001 — UCOS Civilization Architecture Specification

| Field | Value |
|-------|-------|
| Artifact | **CIV-ARCH-001 — Civilization Architecture Specification** |
| Program | PHASE Ω-01 · Civilization Fabric Conceptual Architecture Program |
| Version | 1.0.0 |
| Status | **DESIGN / PROPOSAL — READY FOR RATIFICATION REVIEW** (specification only; no implementation) |
| Basis | `CIV-GOV-001`; `SIM-ARCH-001` (sandboxed-snapshot pattern; control-layer engines); `SIM-GOV-002`; PI-4 control, PI-5 federation, PI-6 evolution, PI-7 knowledge |
| Hard constraint | **NO modification** of `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts` |
| Prohibited-dir impact | **NONE (proposed)** — a future implementation would be confined to `src/control/civilization/*` operating over the Simulation Fabric; **no implementation is authorized by this artifact** |
| Owner | UCOS Authority Board (Architecture) |

> **Governing disclaimer:** design/proposal only. Preserves AD-0014; enrolls no INV-14..20; releases no Article
> IX lock; authorizes no implementation/construction; alters no ratified fabric or PI-8/9/10/11 status. **The
> Civilization Fabric remains conceptual and deferred under AD-0014.**

---

## 1. Architectural principle: Civilization = composite Simulation object

The Civilization Fabric introduces **no new execution or actuation primitive**. A Civilization is a
**composite model object** assembled from Simulation Fabric constructs and *run only* as a Simulation run:

```
Civilization (CIV-C1)
 ├─ Institutions (CIV-C2)      ─┐
 ├─ Population models (CIV-C3)  │  composed as Scenario nodes / state variables
 ├─ Culture (CIV-C4)           │  (SIM-GOV-001 C3 Scenario, C8 Projection state)
 ├─ Capability models (CIV-C5) │
 ├─ Infrastructure (CIV-C6)   ─┘
 ├─ Knowledge refs (CIV-C7) ── read-only → PI-7 Knowledge query surface
 ├─ Memory refs (CIV-C8) ────── DEFERRED (PI-9) — inert hook
 ├─ Governance model (CIV-C9) ─ Scenario policy set (evaluated in-sandbox by PI-4 evaluator)
 ├─ Economy model (CIV-C10) ─── Projection state variables
 └─ Rights/Obligations (CIV-C11/C12) ─ Simulation Constraint Set (SIM-GOV-001 C6)

Run mode: SandboxManager.allocate(runId) → deterministic ProjectionEngine.step(...) [+ verifier-gated
predictive, advisory] → ImpactAnalyzer.assess(...) → civilization:projection:* / civilization:impact:*
(advisory) → (optional) promotion via Evolution Fabric ONLY → teardown.
```

Because every civilization run *is* a Simulation run, it inherits — unchanged — the ratified non-actuation,
sandbox-isolation, determinism, deny-by-default promotion, and Evolution-only-commit guarantees.

---

## 2. Proposed conceptual module topology (`src/control/civilization/*`, future)

All modules are **new control-layer modules layered above the Simulation Fabric** (`src/control/simulation/*`);
none modifies a prohibited core dir. Presented as a *proposal* — not authorized for construction.

| # | Module (proposed) | Realizes | Reuses (no re-implementation) |
|:-:|-------------------|----------|-------------------------------|
| CM0 | `civilization/types.ts` | CIV-C1..C12 record shapes; classification enums; async refs | SIM `types.ts`, FED `Provenance` |
| CM1 | `civilization/civilization-registry.ts` | Index of civilization model objects & versions | `MetadataPort` |
| CM2 | `civilization/civilization-composer.ts` | Compose CIV-C1 from C2..C12 into a Scenario/twin class | SIM digital-twin + scenario-engine |
| CM3 | `civilization/population-model.ts` | CIV-C3 aggregate/statistical cohorts (no PII) | SIM projection state |
| CM4 | `civilization/institution-model.ts` | CIV-C2 institutions/roles | SIM scenario nodes |
| CM5 | `civilization/culture-economy-model.ts` | CIV-C4/C10 descriptive parameters/flows | SIM projection state |
| CM6 | `civilization/rights-obligations-model.ts` | CIV-C11/C12 as Constraint-Set entries | SIM constraint-evaluator |
| CM7 | `civilization/governance-model.ts` | CIV-C9 modeled governance/policy set | PI-4 policy evaluator (in-sandbox) |
| CM8 | `civilization/knowledge-memory-refs.ts` | CIV-C7 read-only; CIV-C8 inert (FDG-MEM analog) | PI-7 Knowledge (read); PI-9 deferred |
| CM9 | `civilization/preservation-continuity.ts` | Signed, hash-anchored model snapshots; continuity reconstruction | FED `assertions.ts`, SIM audit |
| CM10 | `civilization/resilience-analyzer.ts` | Modeled stress/perturbation within scenarios | SIM impact-analyzer |
| CM11 | `civilization/civilization-federation-guard.ts` | Advisory/deny-only foreign civilization models | SIM/FED federation guard |
| CM12 | `civilization/civilization-revocation-authority.ts` | Forward-only fail-closed revocation | SIM revocation-authority |
| CM13 | `civilization/civilization-audit-log.ts` | Hash-chained CIV_* audit (thin-wrap) | `FederatedAuditLog` |
| CM14 | `civilization/civilization-control.ts`, `index.ts` | `createCivilizationFabric(sim, control, fabrics)`; barrel | CM0..CM13 |

**Dependency direction (acyclic):** `types → registry → {population, institution, culture-economy,
rights-obligations, governance, knowledge-memory-refs} → composer → {resilience, preservation-continuity} →
federation-guard/revocation/audit → control → index`. No module imports a prohibited core dir; the sole
external touch (in a future implementation) would be one additive re-export line in the control barrel.

---

## 3. Reuse map (Civilization builds on ratified/authorized fabrics)

| Concern | Source fabric | Reuse |
|---------|---------------|-------|
| Run/sandbox/projection | Simulation (AD-0022 scope) | Civilization runs *are* Simulation runs; sandbox `simulation:sandbox:<runId>:*` |
| Cryptography | PI-5 Federation `assertions.ts` (Ed25519) | Signed civilization/preservation assertions; **no custom crypto** |
| Audit chain | PI-5 `FederatedAuditLog` | Hash-chained CIV_* audit |
| Policy evaluation | PI-4 `PolicyEvaluator` | Modeled governance evaluated in-sandbox (unchanged decision path) |
| Commit | PI-6 Evolution Fabric | **Only** path to promote a civilization insight to governed change |
| Knowledge reads | PI-7 Knowledge query surface | CIV-C7 read-only baseline inputs |
| Cross-node | PI-5 Federation | Advisory/deny-only foreign civilization models |

---

## 4. Isolation & non-actuation guarantees (architecture-level)

- **Non-actuation (CGP-1/SGP-9):** no civilization module has a write path to governed state; all run writes
  confined to the Simulation sandbox keyspace; only advisory `civilization:projection:*` / `civilization:impact:*`
  records survive teardown.
- **Deferred hooks:** CIV-C8 memory reference and any ontology-typed civilization validation are **inert
  deny/absent seams** (FDG-MEM / FDG-ONT analogs); a model referencing an absent gated surface is **rejected
  (deny)**, never skipped. Binding requires the respective PI implementation + separate authorization.
- **Provenance:** carried in data (FED-PROV convention); disjoint `civilization:*` keys; no first-class
  core-port fields.

---

## 5. Prohibited-core-dir impact statement (proposed)

| Prohibited dir | Change required? | Why not |
|----------------|:----------------:|---------|
| `src/meta-core` | **No** | Civilization runs are Simulation runs; kernel already async; no governed mutation |
| `src/registry-runtime` | **No** | Foreign civilization models in a namespaced adapter instance (FED-PROV) |
| `src/metadata-runtime` | **No** | Model records use existing `put/get/query`; `civilization:*` / sandbox-prefixed keys |
| `src/configuration-runtime` | **No** | Civilization config via existing `setLayer` (unknown-layer append) |
| `src/contracts` | **No** | Provenance carried in existing free-form `descriptor.metadata` |

**A future implementation would be confined to `src/control/civilization/*` layered on `src/control/simulation/*`.
Zero prohibited-core-dir change. No implementation is authorized by this artifact.**

---

## 6. Traceability
- **Refines:** `CIV-GOV-001`, `SIM-ARCH-001`, `SIM-GOV-002`, `AD-0022`, `AD-0014`, `AD-0016..0020`.
- **Consumed by:** `CIV-SEC-001`, `CIV-FED-001`, `CIV-AUD-001`, `CIV-THREAT-001`, `CIV-READINESS-001`.
- **Owner:** UCOS Authority Board.

**END CIV-ARCH-001 — DESIGN/PROPOSAL · ZERO PROHIBITED-CORE-DIR CHANGE · SGP-9-BOUNDED · AD-0014 PRESERVED · NO IMPLEMENTATION AUTHORIZED.**
