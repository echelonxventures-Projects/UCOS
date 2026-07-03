# UCOS-IR-0002 — Capability Realization Matrix

**Artifact ID:** `UCOS-IR-0002`
**Program:** UCOS Phase 1 — Implementation Readiness Assessment
**Phase:** IR-2 — Capability → Fabric Mapping
**Mode:** ASSESSMENT ONLY — no code, schema, architecture, or governance produced. Maps each constitutional capability (CAP-IR-001..067 from `UCOS-IR-0001`) to the fabric, subsystem, and runtime layer that realizes it, and classifies realization state.
**Status:** ASSESSMENT BASELINE (v1.0.0)
**Inputs (read-only):** `UCOS-IR-0001`, `UCOS-REQ-0001..0006`, `UCOS-AUDIT-0001..0004`, `UCOS-AUTH-0001`, `UCOS-INV-0001`; corpus evidence (`architecture/*`, `PROJECT-STATE`, `ARCH-GAP-001`, `REAL-M-03`).
**Date:** 2026-07-03

---

## 1. Classification scheme

Per the IR charter each capability is classified against its realizing fabric:

- **EXISTS** — realized of record: implemented code at the reproduced 269/269 baseline, or a ratified artifact
  that fully discharges the capability.
- **PARTIAL** — realized in part: implemented but with a recorded soundness/uniformity/scale caveat, or ratified
  as model but with an integrity/attestation caveat.
- **MISSING** — no realization of record (design absent or entailment-only); the capability is not yet buildable
  from an artifact.
- **DEFERRED** — design of record exists but realization is a governed future step, explicitly deferred
  (chiefly under `AD-0014`) or gated behind a scoped Article IX release.

**Runtime layer legend:** `L-SUB` substrate/Meta-Core · `L-CTL` control plane · `L-DATA` data/knowledge/memory
· `L-FED` federation · `L-EVO` evolution · `L-GOV` governance/authority · `L-BEH` behavioral (cognition/
simulation/economic/civilization) · `L-TIME` temporal · `L-OPS` platform-engineering/operations.

---

## 2. Fabric inventory (realization targets)

| Fabric ID | Fabric | Primitive(s) | PI / source | Runtime layer | State of fabric |
|-----------|--------|--------------|-------------|:-------------:|-----------------|
| FAB-REG | Registry Fabric | Registry | PI-2/3 | L-SUB | EXISTS |
| FAB-META | Metadata Fabric | Metadata | PI-2/3 | L-SUB | EXISTS |
| FAB-CFG | Configuration Fabric | Configuration | PI-2/3 | L-SUB | EXISTS |
| FAB-EXEC | Meta-Core / Execution Fabric | (execution engine) | PI-2 | L-SUB | EXISTS |
| FAB-IDENT | Identity Fabric | Identity | PI-4 | L-CTL | EXISTS |
| FAB-TRUST | Trust Fabric | (trust eval) | PI-4 | L-CTL | EXISTS |
| FAB-POL | Policy Fabric | (policy evaluator) | PI-4 | L-CTL | PARTIAL *(hard-coded vocab, GAP-M3)* |
| FAB-SEC | Security Fabric | (S1..S20 controls) | PI-4 | L-CTL | EXISTS |
| FAB-AUTH | Authority Fabric | Authority | PI-4 gov / `AUTH-UNIV-001` | L-GOV | PARTIAL *(duplicated 5/4/5, GAP-M1; chain attestation pending)* |
| FAB-GOV | Governance Fabric | (gates + `AUTH-012` ledger) | AUTH-009 / PI-4 | L-GOV | EXISTS *(chain reconciled documentarily)* |
| FAB-AUDIT | Audit/Provenance Fabric | (audit log; Provenance) | per-fabric / `AUDIT-UNIV-001` | L-GOV | PARTIAL *(6× duplicated, GAP-C1)* |
| FAB-EVT | Event Fabric | (event catalog) | `UCOS-PEA-003` | L-SUB | EXISTS |
| FAB-STATE | State/Lifecycle Fabric | (lifecycle) | `PEL-001`/`LIFE-UNIV-001` | L-EVO | PARTIAL *(4× lifecycle engines, GAP-M2)* |
| FAB-FED | Federation Fabric | Federation | PI-5 | L-FED | EXISTS |
| FAB-EVO | Evolution Fabric | Evolution | PI-6 | L-EVO | EXISTS |
| FAB-KNOW | Knowledge Fabric | Knowledge | PI-7 | L-DATA | EXISTS *(attestation pending)* |
| FAB-ONTO | Ontology Fabric | Ontology | PI-8 | L-DATA | EXISTS *(not consumed as universal type system; attestation pending)* |
| FAB-MEM | Memory Fabric | Memory | PI-9 | L-DATA | EXISTS *(attestation pending)* |
| FAB-INTEL | Intelligence Fabric | (cognition) | PI-10 (design) | L-BEH | DEFERRED (design-only) |
| FAB-SIM | Simulation Fabric | (projection) | PI-11 (design) | L-BEH | DEFERRED (design-only) |
| FAB-ECON | Economic Fabric | (value) | `ECON-*` (design) | L-BEH | DEFERRED (design-only) |
| FAB-CIV | Civilization Fabric | (civilization) | `CIV-*` (design) | L-BEH | DEFERRED (`AD-0014`) |
| FAB-TIME | Temporal Fabric | (bi-temporal / frames) | `UCOS-REQ-0005` (stated) | L-TIME | MISSING *(stated req; unbuilt)* |
| FAB-PFC | Platform-Factory Catalog | (platform classes) | GAP-R29 | L-OPS | MISSING *(catalog; mechanism EXISTS)* |
| FAB-OPS | Platform-Engineering/Ops Fabric | (obs/resilience/delivery) | `UCOS-PEA-001` ADR-001..007 | L-OPS | EXISTS *(PE-12 product open)* |

> **Nine ratified primitives** (Registry, Metadata, Configuration, Knowledge, Ontology, Memory, Authority,
> Federation, Evolution) are all realized as fabrics; three cross-cutting capabilities that the corpus flags
> for **primitive convergence** — Authority (FAB-AUTH), Audit/Provenance (FAB-AUDIT), and Evolution/Lifecycle
> (FAB-STATE) — are realized but **duplicated per fabric** rather than unified (P1 gaps GAP-M1/GAP-C1/GAP-M2).

---

## 3. Capability realization matrix (CAP-IR-001 … 067)

| CAP-IR | Capability | Realizing fabric(s) | Subsystem | Layer | State |
|--------|-----------|---------------------|-----------|:-----:|:-----:|
| 001 | Compose platforms from metadata | FAB-META/FAB-CFG/FAB-REG | Meta-Core composition | L-SUB | EXISTS |
| 002 | Supreme Authority + Constitution | FAB-AUTH/FAB-GOV | Authority hierarchy | L-GOV | PARTIAL *(attestation)* |
| 003 | Top-down layered architecture | FAB-GOV | Architecture canon | L-GOV | EXISTS |
| 004 | Approval-By-Exception governance | FAB-GOV/FAB-AUTH | Gates + `AUTH-012` | L-GOV | PARTIAL *(chain attestation)* |
| 005 | Principal-agnostic identity | FAB-IDENT | `control/identity` | L-CTL | EXISTS |
| 006 | Runtime trust evaluation | FAB-TRUST | `control/trust` | L-CTL | EXISTS |
| 007 | Contract-only federation | FAB-FED | `control/federation` | L-FED | EXISTS |
| 008 | Governed knowledge fabric | FAB-KNOW | `control/knowledge` | L-DATA | EXISTS *(attestation)* |
| 009 | Governed tiered memory | FAB-MEM | `control/memory` | L-DATA | PARTIAL *(attestation; GAP-M4 metadata uniformity)* |
| 010 | Governed ontology | FAB-ONTO | `control/ontology` | L-DATA | PARTIAL *(not consumed as type system; attestation)* |
| 011 | Economic fabric | FAB-ECON | `control/economic` (planned) | L-BEH | DEFERRED |
| 012 | Civilization fabric | FAB-CIV | `control/civilization` (planned) | L-BEH | DEFERRED |
| 013 | Single Evolution commit path | FAB-EVO | `control/evolution` | L-EVO | EXISTS |
| 014 | Zero-trust security | FAB-SEC | `control` security | L-CTL | EXISTS |
| 015 | Production operability | FAB-OPS | PE-11..15 | L-OPS | EXISTS |
| 016 | Compliance & assurance | FAB-GOV/FAB-OPS | Compliance models | L-GOV | EXISTS |
| 017 | Readiness certification | FAB-GOV | Gate program | L-GOV | EXISTS |
| 018 | Horizontal scale | FAB-OPS/FAB-EXEC | Stateless services | L-OPS | PARTIAL *(single-node; break ~10⁶)* |
| 019 | No architectural ceiling | FAB-EXEC/FAB-REG | INV-13 mechanism | L-SUB | EXISTS |
| 020 | Unknown-future admission | FAB-GOV/FAB-REG | Admission gate | L-GOV | MISSING *(stated; unbuilt)* |
| 021 | Any-reality context | FAB-ONTO | `O-14` reality context | L-DATA | DEFERRED *(INV-17 resolved, unenrolled)* |
| 022 | Everything-is-Entity | FAB-ONTO | entity model | L-DATA | EXISTS |
| 023 | Universal identity | FAB-IDENT/FAB-REG | id@version | L-CTL | EXISTS |
| 024 | Universal resource record | FAB-REG/FAB-META | registry/metadata | L-SUB | EXISTS |
| 025 | Universal capability | FAB-EXEC | capability composition | L-SUB | EXISTS |
| 026 | Universal relationship | FAB-ONTO | relationship model | L-DATA | PARTIAL *(temporal/causal stated, unbuilt)* |
| 027 | Universal state/lifecycle | FAB-STATE | lifecycle engine | L-EVO | PARTIAL *(4× engines; projection unbuilt)* |
| 028 | Universal event | FAB-EVT | event catalog | L-SUB | EXISTS |
| 029 | Platform factory | FAB-PFC (over FAB-EXEC) | class catalog | L-OPS | MISSING *(catalog; mechanism EXISTS)* |
| 030 | Universal civilization | FAB-CIV | civilization objects | L-BEH | DEFERRED |
| 031 | Architectural unboundedness | FAB-EXEC | INV-13 (+INV-14..20) | L-SUB | PARTIAL *(enrolled scope EXISTS; existential DEFERRED)* |
| 032 | Unknown-domain onboarding | FAB-REG/FAB-EXEC | Meta-Core registration | L-SUB | PARTIAL *(mechanism EXISTS; protocol stated)* |
| 033 | Supreme authority hierarchy | FAB-AUTH | authority model | L-GOV | PARTIAL *(duplicated; universal primitive DEFERRED)* |
| 034 | Local sovereignty | FAB-FED | deny-only foreign policy | L-FED | EXISTS |
| 035 | Static-stability continuity | FAB-FED/FAB-EXEC | last-known-good | L-FED | EXISTS |
| 036 | Provenance/lineage | FAB-AUDIT/FAB-FED | provenance envelopes | L-GOV | PARTIAL *(unify w/ audit DEFERRED)* |
| 037 | Append-only hash-chained ledger | FAB-AUDIT | audit logs | L-GOV | PARTIAL *(6× duplicated)* |
| 038 | Deterministic execution | FAB-EXEC | execution engine (17 PEX) | L-SUB | EXISTS |
| 039 | Governed cognition | FAB-INTEL | `control/intelligence` (planned) | L-BEH | DEFERRED |
| 040 | Sandboxed simulation | FAB-SIM | `control/simulation` (planned) | L-BEH | DEFERRED |
| 041 | Governed discovery | FAB-REG | registry discovery | L-SUB | EXISTS |
| 042 | Technology-neutral infra | FAB-OPS | ADR-001..007 | L-OPS | EXISTS |
| 043 | Observability | FAB-OPS | PE-12 | L-OPS | PARTIAL *(product undecided)* |
| 044 | Layer assurance gating | FAB-GOV | RAT/AUD/CERT | L-GOV | EXISTS |
| 045 | Reflexive Meta-System | FAB-EXEC/FAB-REG/FAB-META | Meta-Core | L-SUB | EXISTS |
| 046 | Unknown reserved construct | FAB-ONTO | `O-16` | L-DATA | DEFERRED |
| 047 | Emergent-requirement detection | FAB-GOV | gap discipline | L-GOV | MISSING *(detection not formalized)* |
| 048 | Future-discovery admission | FAB-GOV/FAB-REG | admission gate (≡020) | L-GOV | MISSING *(stated; unbuilt)* |
| 049 | Self-extension (0 core change) | FAB-EXEC | additive fabrics | L-SUB | EXISTS |
| 050 | Meta-requirements governance | FAB-GOV | requirements registry | L-GOV | PARTIAL *(no standing registry construct)* |
| 051 | First-class time | FAB-TIME | bi-temporal model | L-TIME | MISSING *(stated; unbuilt)* |
| 052 | Relativistic time | FAB-TIME/FAB-FED | causal clocks; async quorum | L-TIME | MISSING *(stated; unbuilt)* |
| 053 | Spatial-temporal locality | FAB-TIME/FAB-ONTO | `O-15` + temporal | L-TIME | MISSING *(stated; unbuilt)* |
| 054 | Multi-reference frame | FAB-TIME/FAB-FED | frame-as-locality | L-TIME | MISSING *(stated; unbuilt)* |
| 055 | Planetary/oceanic reality | FAB-ONTO | `O-10` habitat | L-DATA | PARTIAL *(representable; not of record→now stated)* |
| 056 | Alternate/nested realities | FAB-SIM | sandbox reality | L-BEH | DEFERRED |
| 057 | Century-scale continuity | FAB-AUDIT/FAB-AUTH | crypto-agility; ledger longevity | L-TIME | MISSING *(stated; unbuilt)* |
| 058 | Temporal governance | FAB-GOV/FAB-TIME | effective-dating | L-TIME | MISSING *(stated; unbuilt)* |
| 059 | Mathematical foundations | FAB-EXEC | L0 substrate | L-SUB | PARTIAL *(referenced, not formalized)* |
| 060 | Logical foundations | FAB-POL | policy/constraint logic | L-CTL | PARTIAL *(bounded vocab, GAP-M3)* |
| 061 | Semantic grounding | FAB-ONTO | glossary/ontology | L-DATA | PARTIAL *(not consumed as type system)* |
| 062 | Tolerant communication | FAB-FED | service/contract layer | L-FED | EXISTS |
| 063 | Cognition profile | FAB-INTEL | `O-12` intelligence | L-BEH | DEFERRED |
| 064 | Ethics governance | FAB-INTEL/FAB-CIV | ethics constraints | L-BEH | DEFERRED |
| 065 | Provable alignment / Non-Actuation | FAB-INTEL/FAB-GOV | INV-CORE-12 + verifier | L-BEH | MISSING *(stated; enrollment+build pending)* |
| 066 | Threat enumeration (STRIDE) | FAB-SEC | per-fabric threat models | L-CTL | EXISTS *(per-fabric)* |
| 067 | Anti-fragility/resilience | FAB-EXEC/FAB-FED | fail-closed recovery | L-SUB | EXISTS |

---

## 4. Realization-state rollup

| State | CAP-IR count | Capabilities (summary) |
|-------|:------------:|------------------------|
| **EXISTS** | 27 | Substrate, control, identity/trust/security, evolution, federation, knowledge, event, meta-system, discovery, deterministic execution, resilience, assurance, ops |
| **PARTIAL** | 18 | Authority/governance (attestation), audit/provenance/lifecycle (duplicated), policy/logic (bounded vocab), memory/ontology (attestation + type-system), scale (single-node), observability, planetary reality, math foundations, unboundedness, meta-requirements |
| **MISSING** | 12 | Temporal cluster (051/052/053/054/057/058), platform-factory catalog, unknown-future admission (020/048), emergent detection, alignment/Non-Actuation |
| **DEFERRED** | 10 | Intelligence, Simulation, Economic, Civilization, cognition/ethics, alternate reality, any-reality context, unknown reserved construct |

> Totals: 27 + 18 + 12 + 10 = **67**, one dominant state per capability. Several PARTIAL capabilities carry a
> *second* posture (e.g., attestation-pending vs convergence-debt) noted inline.

### 4.1 Layer coverage

| Layer | EXISTS | PARTIAL | MISSING | DEFERRED |
|-------|:------:|:-------:|:-------:|:--------:|
| L-SUB (substrate/Meta-Core) | ● strong | math-foundations | — | — |
| L-CTL (control) | ● strong | policy/logic | — | — |
| L-DATA (knowledge/ontology/memory) | knowledge | memory/ontology/relationship/reality | — | reserved-construct |
| L-FED (federation) | ● strong | — | — | — |
| L-EVO (evolution/state) | evolution | lifecycle/state | — | — |
| L-GOV (governance/authority/audit) | gates/assurance | authority/audit/provenance/meta-req | admission/emergent | — |
| L-BEH (behavioral) | — | — | alignment | intelligence/simulation/economic/civilization/ethics |
| L-TIME (temporal) | — | — | ● entire cluster | — |
| L-OPS (ops/platform-factory) | ops/infra | observability/scale | platform-factory catalog | — |

---

## 5. Determination

**Realization is concentrated in the lower layers and thins toward the frontier.** The substrate (L-SUB),
control (L-CTL), federation (L-FED), and evolution (L-EVO) layers are **EXISTS-dominant** — the constitutional
control kernel is realized. The governance/authority/audit layer (L-GOV) is **EXISTS-with-caveats**: the model
is realized but three cross-cutting capabilities (Authority, Audit/Provenance, Evolution/Lifecycle) are
**duplicated rather than unified** (P1 convergence debt) and the authority chain, though reconciled at the
documentary level, awaits **independent evidentiary attestation**.

The **behavioral layer (L-BEH) is uniformly DEFERRED** (Intelligence, Simulation, Economic, Civilization —
design-only), the **temporal layer (L-TIME) is uniformly MISSING** at realization (stated-of-record only), and
two governance capabilities (unknown-future admission, emergent detection) plus **alignment/Non-Actuation** are
MISSING at realization.

**No capability is unrealizable.** Every MISSING/DEFERRED capability has an additive design or stated requirement
of record and carries a `0 REDESIGN` posture (`ULT-TEST-001`). The matrix therefore shows a system that is
**realized as a correctness-complete single-node control kernel, with a fully-specified but unbuilt behavioral/
temporal frontier and a well-defined primitive-convergence debt.**

> **Scope discipline.** No code, schema, architecture, or governance was produced. `INV-1..13`, `AUTH-012`,
> `AD-0014`, and the Article IX generation lock are unchanged.

## 6. Traceability

- **Realizes-map of:** `UCOS-IR-0001` (CAP-IR-001..067).
- **Evidence:** `UCOS-AUDIT-0002` (traceability states RAT/IMPL/DSGN/MECH), `UCOS-AUDIT-0001` (gaps), `ARCH-GAP-001` (C1/M1/M2/M3), `REAL-M-03` (reproduced state), `architecture/*` fabric specs, `UCOS-PEA-001/002/003`.
- **Refined by:** `UCOS-IR-0003` (Foundational Fabric Specification), `UCOS-IR-0004` (Dependency Graph).
- **Owner:** UCOS Authority Board.

**END `UCOS-IR-0002` — CAPABILITY REALIZATION MATRIX · 27 EXISTS · 18 PARTIAL · 12 MISSING · 10 DEFERRED · 25 FABRICS · 0 UNREALIZABLE · ASSESSMENT ONLY.**
