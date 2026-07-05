# UCOS — COMPILER COVERAGE REPORT (WORKSTREAM 3)

**Artifact ID:** `UCOS-COMPILER-COVERAGE-REPORT`
**Phase:** PHASE X.1 · WS3
**Date:** 2026-07-03
**Source:** Deterministic compiler over `registry/program/*.json` (`tools/program-compiler`; fingerprint `f5646d379919d887`).
**Question:** Which capabilities are **visible** to the Constitutional Program Compiler, which are **invisible**, which have **executable work items**, and which do not.

A capability is **compiler-visible** iff a work item in `work-items.json` governs it (the compiler is strictly registry-driven; nothing outside the registry is computed).

## A. Compiler-VISIBLE capabilities (governed by a work item) — 18

| Capability | Governing WI | Computed status (pre-registration) |
|-----------|--------------|-------------------------------------|
| UCAP-09 Capability Runtime / UCAP-23 Execution | PI-2-3 | COMPLETE |
| UCAP-01 Identity / UCAP-02 Identity Graph / UCAP-03 Trust / UCAP-10 Policy / UCAP-11 Authority | PI-4 | COMPLETE |
| UCAP-22 Federation | PI-5 | COMPLETE |
| UCAP-19 Evolution | PI-6 | COMPLETE |
| UCAP-04 Knowledge / UCAP-05 Knowledge Graph | PI-7 | COMPLETE |
| UCAP-06 Ontology | PI-8 | COMPLETE (evidence-inconsistent: RAT SUBMITTED) |
| UCAP-07 Memory / UCAP-08 Continuity | PI-9 | COMPLETE (evidence-inconsistent: RAT SUBMITTED) |
| UCAP-17 Intelligence | PI-10 | BLOCKED (PI-8, PI-9) / EXTERNAL_BLOCKED (AD-0024) |
| UCAP-18 Simulation / UCAP-27 Digital Twin | PI-11 | IN_PROGRESS (ratification pending) |
| UCAP-24 Universal API (tooling) | WI-05..10 | COMPLETE (tooling) |
| UCAP-21 Infrastructure | ACT-06 (+ ACT-07..12) | EXTERNAL_BLOCKED |
| UCAP-28 Governance Runtime (partial) | PI-4 + PHASE-P.1 | COMPLETE (partial coverage) |

## B. Compiler-INVISIBLE capabilities (no work item) — 11 + 5 discovered

| Capability | Repo reality | Why invisible |
|-----------|--------------|---------------|
| **UCAP-26 Observability Fabric** | **IMPLEMENTED + TESTED** (control/operations) | No WI — only ACT-11 decided its ADR; the fabric itself is ungoverned |
| **UCAP-31 Readiness / Meta-Governance Fabric** | **IMPLEMENTED** (control/readiness) | No WI |
| **UCAP-32 Proof Fabric** | **IMPLEMENTED** (control/operations proof-*) | No WI |
| UCAP-12 Workflow Engine | design (PWF) | No WI |
| UCAP-13 Universal Event Fabric | design + partial runtime | No WI |
| UCAP-14 Economic Engine | design (ECON-*) | No WI |
| UCAP-15 Resource Engine | design subset | No WI |
| UCAP-16 Learning Engine | unmodeled | No WI |
| UCAP-20 Civilization Control Plane | design (CIV-*) | No WI |
| UCAP-25 Universal UI Fabric | design (EXP-*) | No WI |
| UCAP-29 Reality Graph Runtime | design (UEA-0006) | No WI (AD-0014 deferred) |
| UCAP-33 Autonomy Fabric | design (AUTO-*) | No WI |
| UCAP-34 Ecosystem Fabric | design (ECO-*) | No WI |

## C. Capabilities with an EXECUTABLE work item

- **Currently executable (READY / software-solvable): NONE.** The compiler resolves `nextExecutableWorkItem = null`; every governed capability is COMPLETE, IN_PROGRESS, BLOCKED, or EXTERNAL_BLOCKED.
- **Governed but not executable:** PI-10 (BLOCKED/EXTERNAL AD-0024), PI-11 (IN_PROGRESS), ACT-06..12 (EXTERNAL operational), PI-8/PI-9 (COMPLETE but evidence-inconsistent, external attestation).

## D. Capabilities with NO work item (not executable, not tracked)
All of section B. Of these, **UCAP-26/31/32 are the anomaly**: implemented and contributing to the 356-test baseline, yet the compiler cannot see, track, gate, or certify them. From the compiler's perspective they **do not exist** — a governance blind spot in which real code runs outside the constitutional program.

## E. Coverage arithmetic
- Compiler-governed work items today: **28** (per `work-items.json`).
- Distinct capabilities in the universe: **34** (WS1).
- Capabilities with dedicated compiler visibility: **~13** (several share a PI).
- **Capabilities entirely outside the compiler: 13** (11 named + 2 discovered design; +3 discovered implemented that map to the invisible set).

## F. Consequence
Because the compiler is the Autonomous Execution Governor and is strictly registry-driven, any capability without a work item is **ungoverned**: it accrues no evidence requirement, no closure criterion, no lock, and cannot appear in the READY queue or the closure verdict. WS8 registration converts sections B into compiler-visible governed items so that **no capability remains outside governance** (success criterion).

---
**END WS3 — 18 capabilities compiler-visible; 13 invisible (3 of them implemented); 0 currently executable; `nextExecutableWorkItem = null`.**
