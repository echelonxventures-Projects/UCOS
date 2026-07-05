# UCOS — CAPABILITY MATURITY MATRIX (WORKSTREAM 4)

**Artifact ID:** `UCOS-CAPABILITY-MATURITY-MATRIX`
**Phase:** PHASE X.1 · WS4
**Date:** 2026-07-03
**Source:** repository truth + `registry/program/*.json` + `npm test` (356/356).
**Maturity ladder:** `VISION → REGISTERED → ARCHITECTED → IMPLEMENTED → VERIFIED` (monotonic; a level implies all lower levels are met). Classification is evidence-based; absence of evidence caps the level.

| # | Capability | Maturity | Evidence for the classification |
|---|-----------|----------|--------------------------------|
| UCAP-09 Capability Runtime | **VERIFIED** | meta-core code + composition/dependency/dynamic tests green |
| UCAP-23 Execution Fabric | **VERIFIED** | meta-core/execution-engine + composition.e2e test |
| UCAP-01 Identity Fabric | **VERIFIED** | control/identity + control-identity.test.ts |
| UCAP-03 Trust Fabric | **VERIFIED** | control/trust + control-trust.test.ts |
| UCAP-10 Policy Engine | **VERIFIED** | control/policy + control-policy.test.ts |
| UCAP-11 Authority Engine | **VERIFIED** | control/governance + control-governance.test.ts + AUTH-012 ledger |
| UCAP-22 Federation Fabric | **VERIFIED** | control/federation + federation + federation-adversarial tests; AD-0018 |
| UCAP-19 Evolution Engine | **VERIFIED** | control/evolution + evolution + adversarial/rollback/governor tests; AD-0019 |
| UCAP-04 Knowledge Engine | **VERIFIED** | control/knowledge + 9 knowledge tests; AD-0020; PI7-RAT CERTIFIED |
| UCAP-05 Knowledge Graph | **VERIFIED** (subsumed) | knowledge-lineage test within PI-7 |
| UCAP-06 Ontology Engine | **IMPLEMENTED** (→ VERIFIED pending independent ratification) | control/ontology + ontology test; AD-0021 **contested**; EV-PI8-RAT SUBMITTED |
| UCAP-07 Memory Engine | **IMPLEMENTED** (→ VERIFIED pending independent ratification) | control/memory + 5 memory tests; AD-0023; EV-PI9-RAT SUBMITTED (self-attested) |
| UCAP-08 Memory Continuity | **IMPLEMENTED** (subsumed) | memory tiers within PI-9 |
| UCAP-02 Identity Graph | **IMPLEMENTED** (subsumed) | identity-registry within PI-4; no distinct graph module |
| UCAP-18 Simulation System | **VERIFIED** (ratification pending) | control/simulation + 12 simulation tests incl. adversarial; AD-0022 conditional; PI-11 IN_PROGRESS |
| UCAP-27 Digital Twin | **VERIFIED** (subsumed) | simulation-twin test within PI-11 |
| **UCAP-26 Observability Fabric** | **VERIFIED** (but UNGOVERNED) | control/operations + operations.test.ts green; **no work item** |
| **UCAP-31 Readiness/Meta-Gov Fabric** | **IMPLEMENTED** (verification partial; UNGOVERNED) | control/readiness (17 files) + readiness-harness; no dedicated .test; **no work item** |
| **UCAP-32 Proof Fabric** | **IMPLEMENTED** (UNGOVERNED) | control/operations proof-authority/record/unit; PROOF-IMPL-001 design; **no work item** |
| UCAP-28 Governance Runtime | **IMPLEMENTED** (partial; readiness slice ungoverned) | control/governance + control/readiness + program-compiler (PHASE-P.1) |
| UCAP-24 Universal API Fabric | **IMPLEMENTED** (tooling only) | contracts-sdk + contracts/ + WI-05..10 + Prompt-05/08/09; **service runtime absent** |
| UCAP-21 Infrastructure Fabric | **ARCHITECTED** (IaC authored, not provisioned) | infra/ modules; ACT-06 provisioning PENDING (G12-1) |
| UCAP-17 Intelligence Engine | **ARCHITECTED** | INT-* (8 specs), INT-READINESS 10/10; PI-10 OPEN; AD-0024 NOT issued |
| UCAP-14 Economic Engine | **ARCHITECTED** | ECON-* (9 specs incl. ECON-001 realization, ECON-B05 impl program); no WI |
| UCAP-20 Civilization Control Plane | **ARCHITECTED** (AD-0014 deferred) | CIV-* (8 specs incl. CIV-001); no WI |
| UCAP-25 Universal UI Fabric | **ARCHITECTED** (design ratified C-1/D-1) | experience EXP-* ; apps/ EMPTY; no WI |
| UCAP-12 Workflow Engine | **ARCHITECTED** | platform PWF; PE-07 deferred; no WI |
| UCAP-13 Universal Event Fabric | **ARCHITECTED** (partial runtime) | platform PEV design; audit/event chains partial; no WI |
| UCAP-33 Autonomy Fabric | **ARCHITECTED** | AUTO-* (7 specs); no WI |
| UCAP-34 Ecosystem Fabric | **ARCHITECTED** | ECO-* (7 specs); no WI |
| UCAP-29 Reality Graph Runtime | **VISION** (existential, AD-0014 deferred) | UEA-0006 reality-agnostic proposal only |
| UCAP-15 Resource Engine | **VISION** | subsumed concept in ECON; no distinct model |
| UCAP-16 Learning Engine | **VISION** | no code, no design, no WI — fully unmodeled |

## Maturity histogram (34 capabilities)

| Level | Count | Capabilities |
|-------|:-----:|--------------|
| **VERIFIED** | 12 | UCAP-01,03,04,05,09,10,11,18,19,22,23,26,27 (≈13 slots; 26 verified-but-ungoverned) |
| **IMPLEMENTED** (< verified/independently ratified) | 6 | UCAP-02,06,07,08,24,28,31,32 |
| **ARCHITECTED** | 10 | UCAP-12,13,14,17,20,21,25,33,34 |
| **VISION** | 3 | UCAP-15,16,29 |

*(counts overlap where a capability is subsumed; the definitive per-capability level is the table above.)*

## Maturity findings
1. **The implemented core (substrate + control + federation + evolution + knowledge + simulation) is VERIFIED** against 356 tests — a strong, real foundation.
2. **Maturity ≠ governance.** UCAP-26 Observability is **VERIFIED yet ungoverned** (no work item). Maturity level and compiler visibility are independent axes; the program must not conflate them.
3. **Ratification, not implementation, caps UCAP-06/07/18.** They are implemented and tested but held below VERIFIED-final by the external independent-attestation requirement (REAL-C-05 / LOCK-REAL-C-05).
4. **The design frontier (ARCHITECTED) is broad** — 10 capabilities have complete specs awaiting a scoped Article IX release before construction.
5. **UCAP-16 Learning Engine is the only capability at VISION with no artifact of any kind** — it must be architected before it can even be meaningfully registered beyond a placeholder.

---
**END WS4 — 34 capabilities classified: 12 VERIFIED, 6+ IMPLEMENTED, 10 ARCHITECTED, 3 VISION. Maturity and governance are decoupled — 3 VERIFIED/IMPLEMENTED fabrics are ungoverned.**
