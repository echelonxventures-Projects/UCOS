# MEM-AUTH-REV-001 — PI-9 Memory Fabric Dependency Analysis

| Field | Value |
|-------|-------|
| Artifact | **MEM-AUTH-REV-001 — Memory Dependency Analysis** |
| Phase | PHASE 18.1 (PI-9 Memory Fabric — Authorization Review) |
| Version | 1.0.0 |
| Mode | INDEPENDENT REVIEW ONLY — audit/validate/challenge; no design change, no implementation, no authorization |
| Inputs (read-only) | MEM-GOV-001/002, MEM-ARCH-001, MEM-SEC-001, MEM-FED-001, MEM-AUD-001, MEM-THREAT-001, MEM-READINESS-001 (PHASE 18); ONTO-* (PHASE 17, PI-8); AD-0018/0019/0020; PI7-IMP-001 (PI-7 implemented) |
| Owner | UCOS Authority Board (review) |

> Review stream 1 of 4. Determines the Memory Fabric's dependencies on the Ontology, Knowledge, Evolution,
> and Federation fabrics, classifies each as **HARD** (build-blocking) or **ENRICHMENT** (by-reference,
> deferrable), and records its satisfaction status against what is *implemented* today. Produces no design
> change and no authorization.

---

## 1. Implemented-vs-design baseline (evidence)

| Fabric | PI | Status of record | Evidence |
|--------|----|------------------|----------|
| Substrate (Meta-Core / Registry / Metadata / Config) | PI-2/3 | **IMPLEMENTED** (AD-0016) | `packages/platform-runtime/src/{meta-core,registry-runtime,metadata-runtime,configuration-runtime}` |
| Control (identity/trust/policy/governance/PEP) | PI-4 | **IMPLEMENTED** (AD-0017) | `src/control/*` |
| Federation | PI-5 | **IMPLEMENTED** (AD-0018) | `src/control/federation/*` |
| Evolution | PI-6 | **IMPLEMENTED** (AD-0019) | `src/control/evolution/*` |
| Knowledge | PI-7 | **IMPLEMENTED** (AD-0020) | `src/control/knowledge/*`; 185/185 tests |
| Ontology | PI-8 | **DESIGN-RATIFIED, NOT IMPLEMENTED** | `architecture/ontology/ONTO-*`; PI-8 READY FOR AUTHORIZATION REVIEW |
| **Memory** | **PI-9** | **DESIGN-RATIFIED, NOT IMPLEMENTED** | `architecture/memory/MEM-*`; PI-9 READY FOR AUTHORIZATION REVIEW (this review) |
| Intelligence / Simulation | PI-10 / PI-11 | DESIGN-RATIFIED, NOT IMPLEMENTED | `INT-*` / `SIM-*` |

**Key fact:** the last *implemented* fabric is **PI-7 Knowledge**. Federation, Evolution, and Knowledge —
Memory's three hard dependencies (see §2) — are all implemented and ratified. Ontology (PI-8) is
design-ratified only.

## 2. Dependency classification

Dependency types:
- **HARD** — Memory cannot function/build without the dependency's *runtime behavior*; the dependency must
  be **implemented** before (or with) the dependent tier.
- **ENRICHMENT** — Memory references the dependency **by data/id** (provenance-by-convention); absence
  degrades a single tier's richness but does not block build or the other tiers; addressable behind a
  bounded, optional adapter seam.

### 2.1 Memory ↔ Federation (`DEP-FED`)
- **Type: HARD** (for the Federated Memory tier T6 only).
- **Nature:** MEM-FED-001 reuses the ratified PI-5 primitives wholesale — signed assertions
  (`assertions.ts`, Ed25519), trust boundary/authority, provenance keying, `FederatedAuditLog`. No new
  federation machinery; a thin `federated-memory-guard` only.
- **Satisfaction:** **SATISFIED** — PI-5 is implemented (AD-0018). Tiers WM/STM/LTM/SEM/EPI do not require
  federation to build (T6 is additive).
- **Coupling surface:** `src/control/federation/*` (reuse-only; MEM-FED-001 §2, hard constraint "no
  modification of federation behavior").

### 2.2 Memory ↔ Evolution (`DEP-EVO`)
- **Type: HARD** (for all durable mutation: LTM promotion, semantic consolidation, supersession, archival,
  forgetting).
- **Nature:** MGP-4 / MEM-GOV-002 §4 route **all** durable memory mutation through the ratified Evolution
  Fabric (evolution units targeting `memory:`); Memory adds **no** independent apply/rollback path and
  relies on the governor's atomic-apply / snapshot-restore / depth-rate-halt (E10/E11/E12).
- **Satisfaction:** **SATISFIED** — PI-6 is implemented (AD-0019).
- **Coupling surface:** `src/control/evolution/*` (reuse-only).

### 2.3 Memory ↔ Knowledge (`DEP-KNOW`)
- **Type: HARD** (for the Semantic Memory tier T4's factual backing + co-ratification).
- **Nature:** MEM-GOV-001 §2.4 — a semantic memory that asserts/updates a knowledge fact must be
  co-ratified through the Knowledge Fabric's ratification authority (no memory-side back door into
  knowledge). Semantic memory references `knowledge:record:*` by id.
- **Satisfaction:** **SATISFIED** — PI-7 is implemented (AD-0020). Non-semantic tiers (WM/STM/LTM/EPI/T6)
  do not require knowledge to build.
- **Coupling surface:** `src/control/knowledge/*` (reference + co-ratification; reuse-only).

### 2.4 Memory ↔ Ontology (`DEP-ONT`)
- **Type: ENRICHMENT** (Semantic Memory tier T4 only; **not** build-blocking).
- **Nature:** Ontology (PI-8) supplies the **schema of meaning** — entity *types*, relationships,
  taxonomy, semantic constraints (ONTO-ARCH-001). Semantic memory *may* type/classify its assertions
  against ontology entities/relationships to gain machine-interpretable meaning. However, per MEM-GOV-001
  §2.4 the Semantic tier's **factual backing and governed ratification path is Knowledge (PI-7)**, not
  Ontology; ontology adds typing on top.
- **Satisfaction:** **PARTIALLY SATISFIED (design only).** Ontology is design-ratified (ONTO-READINESS-001,
  9/9 PASS) but **not implemented**. Because the coupling is a by-id data reference under
  provenance-by-convention (an `ontologyRef` on a semantic-memory record value), it can be carried behind a
  **bounded, optional adapter** and left inert until PI-8 is implemented — exactly as MEM-FED-001/knowledge
  linkages are carried by-reference.
- **Coupling surface (planned):** an optional `OntologyReference` field on the semantic-memory record value
  and an optional read-only `ontology-adapter` in `src/control/memory/*`; **no** import of ontology
  internals, **no** modification of `src/control/ontology/*`.
- **Finding F-DEP-1 (informational):** MEM-GOV-001/ARCH-001 mention Semantic↔Knowledge explicitly but do
  **not** yet formalize the Semantic↔Ontology reference. Recommend a one-line spec clarification (carried as
  condition C-1 in MEM-AUTH-001) rather than a redesign; it is a documentation refinement, not a defect.

## 3. Dependency summary matrix

| Dependency | Type | Depends on (impl) | Status | Blocks which tiers? | Blocks PI-9 build? |
|------------|:----:|-------------------|:------:|---------------------|:------------------:|
| Federation (AD-0018) | HARD | implemented | **SATISFIED** | T6 only | No |
| Evolution (AD-0019) | HARD | implemented | **SATISFIED** | durable mutation (T3/T4/T5) | No |
| Knowledge (AD-0020) | HARD | implemented | **SATISFIED** | T4 backing/co-ratification | No |
| Ontology (PI-8) | **ENRICHMENT** | design-only | **DEFERRABLE** | T4 typing (enrichment only) | **No** |

## 4. Directional coupling (who depends on whom)

- **Memory depends on:** Federation, Evolution, Knowledge (hard, satisfied); Ontology (enrichment,
  deferrable).
- **Depends on Memory (downstream, not a prerequisite here):** Intelligence (PI-10, `INT-*`) and Simulation
  (PI-11, `SIM-*`) read memory partitions via governed queries (SIM-GOV-001 SGP-8). These are **consumers**,
  not dependencies of PI-9; they do not gate PI-9 authorization.
- **No circular dependency:** Memory→Ontology is a downward reference; Ontology does not depend on Memory
  (ONTO-* lists Knowledge, not Memory, as its consumer).

## 5. Determination (this stream)

> Memory's three **HARD** dependencies (Federation, Evolution, Knowledge) are **SATISFIED** by implemented,
> ratified fabrics. The Memory↔Ontology dependency is **ENRICHMENT-class**, confined to the Semantic tier,
> and **deferrable** behind a bounded by-reference adapter — it does **not** block PI-9 build or any
> non-semantic tier. **PI-8 Ontology implementation is NOT a hard prerequisite for PI-9 Memory.** One
> informational finding (F-DEP-1) recommends formalizing the Semantic↔Ontology reference as a spec
> clarification (condition C-1), not a redesign.

## 6. Traceability
- **Refines:** MEM-GOV-001/002, MEM-ARCH-001, MEM-FED-001; ONTO-ARCH-001, ONTO-READINESS-001; AD-0018/0019/0020.
- **Consumed by:** MEM-AUTH-REV-004 (sequencing), MEM-AUTH-001 (recommendation).
- **Owner:** UCOS Authority Board (review).

**END MEM-AUTH-REV-001 — DEPENDENCY ANALYSIS · PI-8 NOT A HARD PREREQUISITE · NO IMPLEMENTATION AUTHORIZED.**
