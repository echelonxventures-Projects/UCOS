# UCOS — CAPABILITY DEPENDENCY GRAPH (WORKSTREAM 5)

**Artifact ID:** `UCOS-CAPABILITY-DEPENDENCY-GRAPH`
**Phase:** PHASE X.1 · WS5
**Date:** 2026-07-03
**Source:** `dependencies.json` (implemented PI edges) + architecture dependency declarations (FED/EVOL/KNOW/ONTO/MEM/INT/SIM/ECON/CIV reuse maps) + code import structure (`control/*` reuse).
**Property:** acyclic (DAG). Verified against the compiler (`acyclic graph: PASS`).

## 1. Layered dependency structure (roots → leaves)

```
L0 ROOT — Capability Runtime (UCAP-09) + Execution Fabric (UCAP-23)      [meta-core substrate; PI-2-3]
            │  registry-runtime · metadata-runtime · configuration-runtime
            ▼
L1 CONTROL SPINE — Identity(01) · Trust(03) · Policy(10) · Authority(11) [PI-4 control plane]
            │  deny-by-default, S1/S3/S4, single controlled entry point
            ▼
L2 TRUST & CHANGE — Federation(22, PI-5) · Evolution(19, PI-6)
            │  Evolution = SOLE commit path for all durable mutation
            ▼
L3 KNOWLEDGE PLANE — Knowledge(04, PI-7) ─▶ Ontology(06, PI-8)
            │                              └▶ Memory(07, PI-9)
            ▼
L4 COGNITION & PROJECTION — Intelligence(17, PI-10) · Simulation(18, PI-11) · Digital Twin(27⊂18)
            │  Intelligence ← {Ontology, Memory}; Simulation ← Knowledge
            ▼
L5 OPERABILITY (cross-cutting, attach to L1) — Observability(26/30) · Readiness/Meta-Gov(31) · Proof(32)
            │  observe/certify/prove the fabrics below; Governance Runtime(28) spans L1+L5
            ▼
L6 VALUE & COORDINATION — Economic(14) ─▶ Resource(15) ; Workflow(12) ; Universal Event(13)
            │  Economic commit via Evolution(19); Workflow orchestrates services
            ▼
L7 EXPERIENCE & INTERFACE — Universal API(24) ─▶ Universal UI(25)
            ▼
L8 DELIVERY SUBSTRATE (cross-cutting) — Infrastructure(21) ; provisioning gates operation
            ▼
L9 EMERGENT / EXISTENTIAL — Civilization(20) ← {Simulation, Economic} ; Learning(16) ← {Intelligence, Memory} ; Reality Graph(29) ← Civilization   [AD-0014 deferred]
```

## 2. Node classification

| Class | Capabilities | Rationale |
|-------|--------------|-----------|
| **Roots** (depend on nothing above substrate) | UCAP-09 Capability Runtime, UCAP-23 Execution | Everything composes on the Meta-Core substrate |
| **Intermediate domains** | UCAP-01,03,10,11 (control) · 22 Federation · 19 Evolution · 04 Knowledge · 06 Ontology · 07 Memory · 24 API · 21 Infra · 26/31/32 operability | Both consume roots and are consumed by higher layers |
| **Leaf domains** | UCAP-17 Intelligence · 18 Simulation · 12 Workflow · 13 Event · 14 Economic · 15 Resource · 25 UI · 16 Learning · 20 Civilization · 29 Reality Graph | Nothing (within scope) depends on them |

## 3. Critical dependencies (single points that gate the most)

| Critical node | Gates | Why critical |
|---------------|-------|--------------|
| **UCAP-09/23 Capability + Execution Runtime (PI-2-3)** | ALL | Substrate; every fabric composes through it. |
| **UCAP-19 Evolution Engine (PI-6)** | 04,06,07,14,17,18,20 (all durable mutation) | The **sole commit path**; any capability that changes durable state must route through it. |
| **UCAP-11 Authority Engine (PI-4)** | ALL governed change | Deny-by-default + AUTH-012; gates every scoped release. |
| **UCAP-22 Federation (PI-5)** | 04,06,07,18,20,34 (cross-node) | Provides the Ed25519 assertion + audit primitives reused by every federated fabric. |
| **UCAP-07 Memory (PI-9) + UCAP-06 Ontology (PI-8)** | 17 Intelligence | Intelligence is blocked until both are ratified (compiler: PI-10 ← PI-8, PI-9). |

## 4. Dependency-driven build ordering (consistent with compiler edges)

1. **Done/verified:** PI-2-3 → PI-4 → {PI-5, PI-6} → PI-7 → {PI-8, PI-9} ; PI-11 (← PI-7).
2. **Operability (attach to PI-4, reuse PI-5 audit):** Observability(26) · Readiness(31) · Proof(32) — *already implemented*, must be registered.
3. **Cognition:** PI-10 Intelligence (← PI-8, PI-9, GOV-LEDGER-RESTORE) — needs AD-0024.
4. **Value/coordination:** Economic(14 ← PI-6, PI-4) · Workflow(12 ← PI-6) · Event(13 ← PI-5) → Resource(15 ← 14).
5. **Experience:** API(24 ← WI-10) → UI(25 ← 24).
6. **Delivery:** Infrastructure(21 ← ACT-06 operational).
7. **Emergent (AD-0014 deferred):** Learning(16 ← 17,07) · Civilization(20 ← 18,14) · Reality Graph(29 ← 20).

## 5. Observations
- **The graph is acyclic and substrate-rooted** — consistent with the compiler's `PI-2-3 → … → PI-10/PI-11` edges; the capability graph is a strict superset that also captures the ungoverned operability and value layers.
- **Evolution(19) is the universal chokepoint** for durable change — a deliberate constitutional property (single commit path), not a defect.
- **The registered-but-blocked frontier (PI-10) and the unregistered frontier (Economic/Workflow/Event/API/UI/operability) share the same two roots** already VERIFIED, so most remaining work is gated by *governance authorization*, not by missing technical dependencies.

---
**END WS5 — acyclic capability DAG: 2 roots, ~13 intermediate, ~10 leaf; critical chokepoints = Substrate(09/23), Evolution(19), Authority(11), Federation(22), Ontology+Memory(06/07).**
