# SIM-AUTH-REV-001 — PI-11 Simulation Fabric Cross-Fabric Dependency Analysis

| Field | Value |
|-------|-------|
| Artifact | **SIM-AUTH-REV-001 — Cross-Fabric Dependency Analysis** |
| Phase | PHASE 20.1 (PI-11 Simulation Fabric — Authorization Review) |
| Version | 1.0.0 |
| Mode | REVIEW / ANALYSIS ONLY — no source, runtime, infrastructure, services, or authorization |
| Inputs | `SIM-GOV-001/002`, `SIM-ARCH-001`, `SIM-SEC-001`, `SIM-FED-001`, `SIM-AUD-001`, `SIM-THREAT-001`, `SIM-READINESS-001`; `INT-*` (PI-10 design), `MEM-*` (PI-9 design), `ONTO-*` (PI-8 design), `KNOW-*`/AD-0020 (PI-7); on-disk `packages/platform-runtime/src/control/*` |
| Owner | UCOS Authority Board |

> Determines the true dependency structure between the Simulation Fabric and the Intelligence, Memory,
> Ontology, and Knowledge fabrics, and classifies each dependency as **hard** (must exist to build/operate
> the construct) or **soft** (enriches, but degrades gracefully / fail-closed when absent). This analysis is
> the pivot for the authorization determination (SIM-AUTH-REV-004 / SIM-AUTH-001).

---

## 1. Ground truth — implemented vs design-only (on-disk evidence)

| PI | Fabric | On-disk state | Path |
|:--:|--------|---------------|------|
| PI-2/3 | Substrate (meta-core, registry, metadata, configuration) | **IMPLEMENTED** | `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime` |
| PI-4 | Control (governance, identity, policy, trust, control-plane, audit) | **IMPLEMENTED** | `src/control/{governance,identity,policy,trust}`, `control-plane.ts`, `audit-log.ts` |
| PI-5 | Federation (signed assertions Ed25519, `FederatedAuditLog`) | **IMPLEMENTED** | `src/control/federation/*` |
| PI-6 | Evolution (governor, apply orchestrator, snapshot, rollback) | **IMPLEMENTED** | `src/control/evolution/*` |
| PI-7 | Knowledge (store, query, resolver, lineage, snapshot, import/export) | **IMPLEMENTED** | `src/control/knowledge/*` (20 modules) |
| PI-8 | Ontology | **DESIGN ONLY** (`ONTO-*`) — no control module | `architecture/ontology/` |
| PI-9 | Memory | **DESIGN ONLY** (`MEM-*`) — no control module | `architecture/memory/` |
| PI-10 | Intelligence | **DESIGN ONLY** (`INT-*`) — no control module | `architecture/intelligence/` |
| PI-11 | Simulation | **DESIGN ONLY** (`SIM-*`) — this authorization review | `architecture/simulation/` |

**Key fact:** the Simulation Fabric's structural prerequisites (substrate, control/policy, evolution,
federation crypto+audit) **and** its primary read surface (**Knowledge**) are all **implemented**. Ontology,
Memory, and Intelligence are **designed but not implemented**.

## 2. Dependency classification

### 2.1 Simulation ↔ Knowledge (PI-7 — IMPLEMENTED)
| Coupling | Class | Rationale | Availability |
|----------|:-----:|-----------|:------------:|
| Read governed knowledge for baselines/snapshots (`knowledge:*`) | **HARD (satisfied)** | Digital Twins, State Projection, Knowledge Simulation, and Impact Analysis read knowledge records as the primary input surface | ✅ Available |
| Knowledge snapshot as scenario baseline | HARD (satisfied) | Scenario `baselineRef` resolves against knowledge/metadata snapshots | ✅ Available |
| Commit adopted proposals | via Evolution (PI-6) | Simulation never writes knowledge directly | ✅ Available |
**Verdict:** the Knowledge dependency is a **hard** dependency and it is **satisfied** today.

### 2.2 Simulation ↔ Evolution / Federation / Control (PI-4/5/6 — IMPLEMENTED)
| Coupling | Class | Availability |
|----------|:-----:|:------------:|
| Sole commit path (promotion → Evolution Unit) | **HARD (satisfied)** | ✅ |
| Signed assertions + hash-chained audit (reuse) | **HARD (satisfied)** | ✅ |
| Deny-by-default policy evaluation of proposals | **HARD (satisfied)** | ✅ |
**Verdict:** all satisfied — these are the structural backbone and are present.

### 2.3 Simulation ↔ Ontology (PI-8 — DESIGN ONLY)
| Coupling | Class | Rationale | Availability |
|----------|:-----:|-----------|:------------:|
| Semantic typing/validation of scenario entities & twin structure (`ontology:*`) | **SOFT** | Enriches scenario/twin correctness; absent ⇒ scenarios validate against Knowledge/metadata + declared Constraint Sets only | ❌ Deferred |
**Verdict:** **soft**. Ontology-typed semantic constraints are a **deferred enhancement**; core projection/impact runs on Knowledge + Constraint Sets without it. Fail-closed: an ontology-typed constraint referencing an absent `ontology:*` surface is rejected (deny), not silently skipped.

### 2.4 Simulation ↔ Memory (PI-9 — DESIGN ONLY)
| Coupling | Class | Rationale | Availability |
|----------|:-----:|-----------|:------------:|
| Episodic/semantic memory as an additional read input (`memory:*`) | **SOFT** | Enriches baselines with historical/episodic context; absent ⇒ baselines drawn from Knowledge + pinned snapshot | ❌ Deferred |
**Verdict:** **soft**. Memory-tier reads are a **deferred enhancement**; simulation reproducibility depends on the **pinned snapshot**, not on live memory.

### 2.5 Simulation ↔ Intelligence (PI-10 — DESIGN ONLY) — the decisive case
| Coupling | Class | Rationale | Availability |
|----------|:-----:|-----------|:------------:|
| **Deterministic** state projection / scenario stepping | **NONE** | Deterministic projection is a pure function of `(snapshot, scenario, constraints, seed)` — no Intelligence needed (SGP-3) | n/a |
| **Non-deterministic / predictive** forecasts feeding Predictive Model Registry (C5) | **SOFT** | Intelligence Inference Model Registry (INT-GOV-001 §2.2) *may* supply advisory forecasts; by design (SGP-3/IGP-2) these are **advisory-only, verifier-gated, never on the commit path** | ❌ Deferred |
| Impact-analysis heuristics | **SOFT** | Deterministic delta/risk computation needs no Intelligence; ML-assisted ranking is advisory-only | ❌ Deferred |
**Verdict:** **soft**. The only Simulation↔Intelligence coupling is **advisory predictive contribution**, which the design already quarantines as advisory-only and verifier-gated. The **Predictive Adapter interface** (`simulation/predictive-adapter.ts`) can be built now; **binding an Intelligence-backed non-deterministic model is deferred** until PI-10 is implemented. **Simulation does NOT hard-depend on Intelligence.**

## 3. Dependency summary matrix

| Fabric | Relationship | Class | Satisfied now? | If absent |
|--------|--------------|:-----:|:--------------:|-----------|
| Substrate / Control / Policy | Structural backbone | HARD | ✅ | (present) |
| Evolution (PI-6) | Sole commit path | HARD | ✅ | (present) |
| Federation (PI-5) | Crypto + audit + co-sim | HARD | ✅ | (present) |
| Knowledge (PI-7) | Primary read surface / baseline | HARD | ✅ | (present) |
| Ontology (PI-8) | Semantic validation | SOFT | ❌ | deferred; fail-closed on `ontology:*` refs |
| Memory (PI-9) | Episodic/semantic read enrichment | SOFT | ❌ | deferred; baselines from snapshot+Knowledge |
| Intelligence (PI-10) | Advisory predictive forecasts | SOFT | ❌ | deferred; deterministic projection + adapter interface only |

**All four HARD dependencies are satisfied. All three unimplemented fabrics (Ontology, Memory, Intelligence)
are SOFT and fail-closed-degradable.**

## 4. Determinations answering the objective

- **Simulation ↔ Intelligence:** SOFT (advisory predictive contribution, quarantined). Not required to build the core fabric.
- **Simulation ↔ Memory:** SOFT (read enrichment). Reproducibility rests on the pinned snapshot, not live memory.
- **Simulation ↔ Ontology:** SOFT (semantic validation). Core validity rests on declared Constraint Sets.
- **Simulation ↔ Knowledge:** HARD — **and satisfied** (PI-7 implemented).
- **Must PI-10 (Intelligence) be implemented first?** **NO.** The sole coupling is advisory, verifier-gated, off the commit path, and pluggable behind an interface. Deterministic projection + the Predictive Adapter interface proceed without it.

## 5. Traceability
- **Refines:** `SIM-GOV-001/002`, `SIM-ARCH-001`, `INT-GOV-001` (§2.2), `MEM-*`, `ONTO-*`, AD-0020.
- **Consumed by:** `SIM-AUTH-REV-004`, `SIM-AUTH-001`, `AD-0022`.
- **Owner:** UCOS Authority Board.

**END SIM-AUTH-REV-001 — REVIEW · 4/4 HARD DEPENDENCIES SATISFIED · PI-10 NOT A PREREQUISITE.**
