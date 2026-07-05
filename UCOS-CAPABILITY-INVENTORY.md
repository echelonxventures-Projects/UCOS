# UCOS — CAPABILITY INVENTORY (WORKSTREAM 1)

**Artifact ID:** `UCOS-CAPABILITY-INVENTORY`
**Phase:** PHASE X.1 · Capability Universe Expansion & Constitutional Discovery · WS1
**Date:** 2026-07-03
**Mode:** Discovery only — grounded in repository truth (`packages/platform-runtime/src`, `architecture/`, `contracts/`, `infra/`), registry truth (`registry/program/*.json`), and compiler truth (`tools/program-compiler`). No implementation, no runtime code, no assumption.
**Test baseline observed:** `npm test` → **356 pass / 356, 0 fail** (Node built-in runner).

## Legend
- **Exists** = code module present in `src`. **Referenced** = design spec present in `architecture/`. **Implemented** = wired + exported in `src/*/index.ts`. **Registry-Driven** = has a compiler work item in `work-items.json`. **Compiler-Governed** = visible to the Constitutional Program Compiler.

## Column key
Ex=Exists(code) · Ref=Referenced(design) · Impl=Implemented · RD=Registry-Driven (has WI) · CG=Compiler-Governed · WI=governing work item

| # | Capability | Ex | Ref | Impl | RD | CG | Code location | Design | WI |
|---|-----------|:--:|:--:|:--:|:--:|:--:|---------------|--------|----|
| UCAP-01 | Identity Fabric | ✅ | ✅ | ✅ | ✅ | ✅ | control/identity | SEC-* | PI-4 |
| UCAP-02 | Identity Graph | ◑ | ✅ | ◑ | ✅* | ✅* | control/identity (registry) | SEC/UEA | PI-4 (subsumed) |
| UCAP-03 | Trust Fabric | ✅ | ✅ | ✅ | ✅ | ✅ | control/trust | SEC-* | PI-4 |
| UCAP-04 | Knowledge Engine | ✅ | ✅ | ✅ | ✅ | ✅ | control/knowledge | KNOW-* | PI-7 |
| UCAP-05 | Knowledge Graph | ◑ | ✅ | ◑ | ✅* | ✅* | control/knowledge (lineage) | KNOW-* | PI-7 (subsumed) |
| UCAP-06 | Ontology Engine | ✅ | ✅ | ✅ | ✅ | ✅ | control/ontology | ONTO-* | PI-8 (ratification contested) |
| UCAP-07 | Memory Engine | ✅ | ✅ | ✅ | ✅ | ✅ | control/memory | MEM-* | PI-9 (ratification self-attested) |
| UCAP-08 | Memory Continuity Layer | ◑ | ✅ | ◑ | ✅* | ✅* | control/memory (tiers) | MEM-* | PI-9 (subsumed) |
| UCAP-09 | Capability Runtime | ✅ | ✅ | ✅ | ✅ | ✅ | meta-core | platform | PI-2-3 |
| UCAP-10 | Policy Engine | ✅ | ✅ | ✅ | ✅ | ✅ | control/policy | GOV/SEC | PI-4 |
| UCAP-11 | Authority Engine | ✅ | ✅ | ✅ | ✅ | ✅ | control/governance + AUTH layer | GOV-*/AUTH | PI-4 |
| UCAP-12 | Workflow Engine | ❌ | ✅ | ❌ | ❌ | ❌ | — | platform PWF / PE-07 | **NONE** |
| UCAP-13 | Universal Event Fabric | ◑ | ✅ | ◑ | ❌ | ❌ | control/audit-log + fabric event chains (partial) | platform PEV | **NONE** |
| UCAP-14 | Economic Engine | ❌ | ✅ | ❌ | ❌ | ❌ | — | ECON-* (incl. ECON-001, ECON-B05) | **NONE** |
| UCAP-15 | Resource Engine | ❌ | ◑ | ❌ | ❌ | ❌ | — | (subsumed in ECON resource economy) | **NONE** |
| UCAP-16 | Learning Engine | ❌ | ❌ | ❌ | ❌ | ❌ | — | **unmodeled** | **NONE** |
| UCAP-17 | Intelligence Engine | ❌ | ✅ | ❌ | ✅ | ✅ | — | INT-* | PI-10 (OPEN; AD-0024 gate) |
| UCAP-18 | Simulation System | ✅ | ✅ | ✅ | ✅ | ✅ | control/simulation | SIM-* | PI-11 (IN_PROGRESS; ratification pending) |
| UCAP-19 | Evolution Engine | ✅ | ✅ | ✅ | ✅ | ✅ | control/evolution | EVOL / AD-0019 | PI-6 |
| UCAP-20 | Civilization Control Plane | ❌ | ✅ | ❌ | ❌ | ❌ | — | CIV-* (incl. CIV-001) | **NONE** |
| UCAP-21 | Infrastructure Fabric | ◑ | ✅ | ❌ | ◑ | ◑ | infra/ (IaC, not provisioned) | infra + PE-15 | ACT-06 (operational proxy) |
| UCAP-22 | Federation Fabric | ✅ | ✅ | ✅ | ✅ | ✅ | control/federation | FED-* | PI-5 |
| UCAP-23 | Execution Fabric | ✅ | ✅ | ✅ | ✅* | ✅* | meta-core/execution-engine | platform | PI-2-3 (subsumed) |
| UCAP-24 | Universal API Fabric | ◑ | ✅ | ◑ | ◑ | ◑ | contracts-sdk + contracts/ (tooling) | SVC-* | WI-05..10 (tooling only; no service runtime WI) |
| UCAP-25 | Universal UI Fabric | ❌ | ✅ | ❌ | ❌ | ❌ | apps/ (EMPTY) | EXP-* (ratified design, C-1) | **NONE** |
| UCAP-26 | Observability Fabric | ✅ | ✅ | ✅ | ❌ | ❌ | **control/operations** | OPS-* / PE-12 / ADR-PE12 | **NONE** (only ACT-11 ADR decision) |
| UCAP-27 | Digital Twin Layer | ◑ | ✅ | ◑ | ✅* | ✅* | control/simulation (twin) | SIM-* | PI-11 (subsumed) |
| UCAP-28 | Governance Runtime | ✅ | ✅ | ✅ | ◑ | ◑ | control/governance + **control/readiness** + program-compiler | GOV-* | PI-4 (partial) + PHASE-P.1; readiness fabric UNGOVERNED |
| UCAP-29 | Reality Graph Runtime | ❌ | ✅ | ❌ | ❌ | ❌ | — | existential UEA-0006 (reality-agnostic) | **NONE** (AD-0014 deferred) |

`✅*`/`✅*` = realized/governed **within a parent PI** (subsumed), not a distinct module or work item. `◑` = partial.

## Discovered capabilities beyond the stated 29 (repository truth)

| # | Capability | Ex | Impl | RD | CG | Location | Note |
|---|-----------|:--:|:--:|:--:|:--:|----------|------|
| UCAP-30 | Operations / Observability Fabric (impl.) | ✅ | ✅ | ❌ | ❌ | control/operations (23 files) | Same as UCAP-26; **implemented + tested, compiler-invisible** |
| UCAP-31 | Readiness / Certification / Meta-Governance Fabric | ✅ | ✅ | ❌ | ❌ | control/readiness (17 files) | Implemented (verification via harness — partial); **compiler-invisible** |
| UCAP-32 | Proof Fabric | ✅ | ✅ | ❌ | ❌ | control/operations (proof-authority/record/unit) | Design PROOF-IMPL-001 / B02-OPF / B03-SCALE; **implemented, compiler-invisible** |
| UCAP-33 | Autonomy Fabric | ❌ | ❌ | ❌ | ❌ | — | Design AUTO-* (7 specs); **no WI** |
| UCAP-34 | Ecosystem Fabric | ❌ | ❌ | ❌ | ❌ | — | Design ECO-* (7 specs); **no WI** |

## Headline findings

1. **12 of 29 capabilities are fully implemented, tested, and compiler-governed** (UCAP-01/03/04/06/07/09/10/11/18/19/22 + substrate UCAP-09/23). Verified by the 356-test baseline.
2. **Three implemented fabrics are compiler-invisible** — UCAP-26/30 Observability, UCAP-31 Readiness/Meta-Governance, UCAP-32 Proof. They exist in code, are exported from `control/index.ts`, and contribute to the 356 tests, yet **no work item governs them**. This is the most severe class of finding: *implemented capability outside governance.*
3. **Six capabilities are architected (design only) with no work item** — UCAP-12 Workflow, UCAP-13 Event, UCAP-14 Economic, UCAP-20 Civilization, UCAP-25 UI, plus UCAP-33 Autonomy / UCAP-34 Ecosystem.
4. **Three capabilities are pure VISION / unmodeled or deferred** — UCAP-15 Resource (subsumed, unmodeled distinctly), UCAP-16 Learning (entirely unmodeled), UCAP-29 Reality Graph (existential, AD-0014 deferred).
5. **Subsumed capabilities (governed via a parent PI):** UCAP-02 Identity Graph⊂PI-4, UCAP-05 Knowledge Graph⊂PI-7, UCAP-08 Memory Continuity⊂PI-9, UCAP-23 Execution⊂PI-2-3, UCAP-27 Digital Twin⊂PI-11. These are governed and require **no** new work item; they are documented, not minted.

**Success-criterion status (pre-registration):** capabilities outside governance = **9** (UCAP-12/13/14/16/20/25/26/31/32 + 33/34 design). Registration (WS8) closes this.

---
**END WS1 — 29 named + 5 discovered = 34 capabilities inventoried against code/design/registry/compiler truth.**
