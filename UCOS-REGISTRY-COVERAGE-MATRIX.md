# UCOS — REGISTRY COVERAGE MATRIX (WORKSTREAM 2)

**Artifact ID:** `UCOS-REGISTRY-COVERAGE-MATRIX`
**Phase:** PHASE X.1 · WS2
**Date:** 2026-07-03
**Source:** `registry/program/*.json` (work-items, dependencies, evidence-registry, closure-matrix, external-blockers, constitutional-locks) + `contracts/` (schemas) + `.claude/authority` (authority).
**Mode:** Discovery only. Reflects state **before** WS8 registration.

## Column key
- **Registry** = has a work item in `work-items.json`.
- **Schema** = has a structural/contract schema (contracts/schema, contracts/field-schemas, or fabric metadata schema/`*_SCHEMA` export).
- **Authority** = has a governing Authority/AD anchor (AUTH-012 AD-xxxx / scoped release / owner).
- **Evidence** = has evidence record(s) in `evidence-registry.json`.
- **Closure** = participates in a governance closure (`closure-matrix.json`) or lock.

| # | Capability | Registry | Schema | Authority | Evidence | Closure | Notes |
|---|-----------|:--:|:--:|:--:|:--:|:--:|------|
| UCAP-01 Identity Fabric | ✅ PI-4 | ✅ IDENTITY_SCHEMA | ✅ AD-0017 | ✅ EV-PI4-BUILD | ✅ (S1/S3/S4) | complete |
| UCAP-03 Trust Fabric | ✅ PI-4 | ✅ (trust records) | ✅ AD-0017 | ✅ EV-PI4-BUILD | ✅ | complete |
| UCAP-10 Policy Engine | ✅ PI-4 | ✅ POLICY_SCHEMA | ✅ AD-0017 | ✅ EV-PI4-BUILD | ✅ | complete |
| UCAP-11 Authority Engine | ✅ PI-4 | ✅ (governance records) | ✅ AUTH-012/AD-0017 | ✅ EV-PI4-BUILD | ✅ | complete |
| UCAP-09 Capability Runtime | ✅ PI-2-3 | ✅ (descriptor schema) | ✅ AD-0016 | ✅ EV-PI23-BUILD | ✅ | complete |
| UCAP-23 Execution Fabric | ✅ PI-2-3* | ✅ | ✅ AD-0016 | ✅ EV-PI23-BUILD | ✅ | subsumed in PI-2-3 |
| UCAP-22 Federation Fabric | ✅ PI-5 | ✅ (assertions) | ✅ AD-0018 | ✅ EV-PI5-IMP/VAL/SEC/AUD | ✅ REAL-C-04 | complete |
| UCAP-19 Evolution Engine | ✅ PI-6 | ✅ | ✅ AD-0019 | ✅ EV-PI6-* | ✅ | complete |
| UCAP-04 Knowledge Engine | ✅ PI-7 | ✅ | ✅ AD-0020 | ✅ EV-PI7-* + RAT | ✅ | complete |
| UCAP-05 Knowledge Graph | ✅ PI-7* | ✅ | ✅ AD-0020 | ✅ EV-PI7-* | ✅ | subsumed in PI-7 |
| UCAP-06 Ontology Engine | ✅ PI-8 | ✅ SI-1..7 | ◑ AD-0021 (contested) | ◑ EV-PI8-RAT SUBMITTED | ✅ REAL-C-05 | ratification contested |
| UCAP-07 Memory Engine | ✅ PI-9 | ✅ | ◑ AD-0023 (self-attested) | ◑ EV-PI9-RAT SUBMITTED | ✅ REAL-C-05 | ratification self-attested |
| UCAP-08 Memory Continuity | ✅ PI-9* | ✅ | ◑ AD-0023 | ◑ EV-PI9-* | ✅ | subsumed in PI-9 |
| UCAP-02 Identity Graph | ✅ PI-4* | ◑ | ✅ AD-0017 | ✅ EV-PI4-BUILD | ✅ | subsumed; distinct graph absent |
| UCAP-17 Intelligence Engine | ✅ PI-10 | ◑ (INT design) | ❌ AD-0024 NOT issued | ◑ EV-PI10-* PENDING | ✅ REAL-C-04 | authorization gap |
| UCAP-18 Simulation System | ✅ PI-11 | ✅ SIM | ✅ AD-0022 (conditional) | ◑ EV-PI11-* SUBMITTED | ✅ REAL-C-04 | ratification pending |
| UCAP-27 Digital Twin | ✅ PI-11* | ✅ | ✅ AD-0022 | ◑ EV-PI11-* | ✅ | subsumed in PI-11 |
| UCAP-24 Universal API Fabric | ◑ WI-05..10 | ✅ contracts/schema + field-schemas | ✅ Article IX (tooling) | ✅ EV-WI-05..10 + EV-PROMPT-05/08/09 | ❌ | tooling only; **no service-runtime WI** |
| UCAP-21 Infrastructure Fabric | ◑ ACT-06 | ◑ (IaC modules) | ✅ AD-0015/AD-0009 | ◑ EV-ACT-06 PENDING | ✅ REAL-C-03 | provisioning proxy only |
| UCAP-28 Governance Runtime | ◑ PI-4 + PHASE-P.1 | ◑ | ✅ AUTH-012 | ◑ partial | ◑ | readiness fabric ungoverned |
| **UCAP-26 Observability Fabric** | ❌ | ✅ (operations metadata) | ◑ ADR-PE12 (decision) | ❌ | ❌ | **implemented, no WI/evidence/closure** |
| **UCAP-31 Readiness/Meta-Gov Fabric** | ❌ | ✅ (readiness records) | ❌ | ❌ | ❌ | **implemented, no WI/evidence/closure** |
| **UCAP-32 Proof Fabric** | ❌ | ✅ (proof-unit/record) | ◑ PROOF-IMPL-001 | ❌ | ❌ | **implemented, no WI/evidence/closure** |
| UCAP-12 Workflow Engine | ❌ | ◑ PWF design | ◑ PE-07 deferred | ❌ | ❌ | design only |
| UCAP-13 Universal Event Fabric | ❌ | ✅ PEV design | ◑ PE-04 | ❌ | ❌ | design only; partial runtime |
| UCAP-14 Economic Engine | ❌ | ✅ ECON design | ◑ scoped release NOT issued | ❌ | ❌ | design only |
| UCAP-15 Resource Engine | ❌ | ◑ (ECON subset) | ❌ | ❌ | ❌ | unmodeled distinctly |
| UCAP-16 Learning Engine | ❌ | ❌ | ❌ | ❌ | ❌ | **fully unmodeled** |
| UCAP-20 Civilization Control Plane | ❌ | ✅ CIV design | ◑ AD-0014 deferred | ❌ | ❌ | design only, deferred |
| UCAP-25 Universal UI Fabric | ❌ | ✅ EXP (ratified C-1) | ✅ D-1 ratified design | ❌ | ❌ | design ratified; construction WI absent |
| UCAP-29 Reality Graph Runtime | ❌ | ✅ UEA-0006 | ◑ AD-0014 deferred | ❌ | ❌ | existential, deferred |
| UCAP-33 Autonomy Fabric | ❌ | ✅ AUTO design | ◑ scoped release NOT issued | ❌ | ❌ | design only |
| UCAP-34 Ecosystem Fabric | ❌ | ✅ ECO design | ◑ scoped release NOT issued | ❌ | ❌ | design only |

## Coverage rollup (pre-registration)

| Coverage dimension | Full | Partial | Missing |
|--------------------|:----:|:-------:|:-------:|
| Registry (has WI) | 15 | 3 (WI-05..10/ACT-06/PI-4-partial) | 13 |
| Schema | 18 | 6 | 6 |
| Authority anchor | 12 | 9 | 8 |
| Evidence record | 12 | 6 | 11 |
| Closure participation | 13 | 3 | 13 |

## Critical registry gaps (feeds WS6)
1. **UCAP-26/31/32** — implemented fabrics with **zero** registry/evidence/closure coverage (governance blind spot).
2. **UCAP-24** — API Fabric has contract-tooling coverage but no service-runtime work item or closure.
3. **UCAP-14/20/25/33/34** — architected with schemas but no work item, evidence, or closure.
4. **UCAP-16** — no coverage at any dimension (pure vision).

---
**END WS2 — registry coverage mapped; 13 capabilities have no work item, 11 have no evidence record, 13 participate in no closure.**
