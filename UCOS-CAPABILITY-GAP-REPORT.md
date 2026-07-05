# UCOS — CAPABILITY GAP REPORT (WORKSTREAM 6)

**Artifact ID:** `UCOS-CAPABILITY-GAP-REPORT`
**Phase:** PHASE X.1 · WS6
**Date:** 2026-07-03
**Source:** WS1–WS5 + registry/compiler truth. Reflects state **before** WS8 registration.

## 1. Gap taxonomy (per mission)

### 1a. Unregistered capabilities (implemented/architected but no compiler work item) — 13
| Capability | Reality | Severity |
|-----------|---------|:--------:|
| **UCAP-26 Observability Fabric** | IMPLEMENTED + TESTED (control/operations) | **CRITICAL** — implemented code outside governance |
| **UCAP-31 Readiness/Meta-Gov Fabric** | IMPLEMENTED (control/readiness) | **CRITICAL** |
| **UCAP-32 Proof Fabric** | IMPLEMENTED (control/operations proof-*) | **HIGH** |
| UCAP-14 Economic Engine | ARCHITECTED (ECON-*) | HIGH |
| UCAP-20 Civilization Control Plane | ARCHITECTED (CIV-*) | MEDIUM (AD-0014) |
| UCAP-25 Universal UI Fabric | ARCHITECTED (EXP-*) | HIGH |
| UCAP-12 Workflow Engine | ARCHITECTED (PWF) | MEDIUM |
| UCAP-13 Universal Event Fabric | ARCHITECTED (PEV) | MEDIUM |
| UCAP-33 Autonomy Fabric | ARCHITECTED (AUTO-*) | MEDIUM |
| UCAP-34 Ecosystem Fabric | ARCHITECTED (ECO-*) | MEDIUM |
| UCAP-15 Resource Engine | VISION (ECON subset) | LOW |
| UCAP-29 Reality Graph Runtime | VISION (UEA-0006) | LOW (AD-0014) |
| UCAP-16 Learning Engine | VISION (unmodeled) | MEDIUM |

### 1b. Unmodeled capabilities (no design artifact at all)
- **UCAP-16 Learning Engine** — no code, no architecture spec, no work item. The only capability with zero artifacts. Must be architected before meaningful construction.
- **UCAP-15 Resource Engine** — no distinct model; exists only as a conceptual economy type inside ECON-*.

### 1c. Missing registries (no compiler work item / state tracking)
All 13 in §1a. Additionally, the API Fabric (UCAP-24) has a **service-runtime** registry gap (only contract-tooling WI-05..10 exist).

### 1d. Missing schemas
- UCAP-16 Learning Engine (no schema).
- UCAP-15 Resource Engine (no distinct schema).
- UCAP-12 Workflow, UCAP-13 Event — partial (platform PWF/PEV design, no fabric runtime schema).

### 1e. Missing evidence models (no evidence record)
- UCAP-26/31/32 (implemented, but **no** IMP/VAL/SEC/AUD evidence records registered).
- UCAP-12/13/14/16/20/25/33/34 (no evidence records).
- UCAP-15/29 (no evidence records).

### 1f. Missing closure criteria (participate in no governance closure)
- All of §1a. No closure currently tracks capability-universe completeness. The three governance closures (REAL-C-03/04/05) cover only operational evidence, PI-10/11 fabric, and attestation — **not** the broader capability universe.

## 2. Severity-ranked gap register

| Gap ID | Capability(ies) | Class | Severity |
|--------|-----------------|-------|:--------:|
| GAP-CAP-OPS-GOV | UCAP-26 Observability | implemented, ungoverned | CRITICAL |
| GAP-CAP-RDY-GOV | UCAP-31 Readiness/Meta-Gov | implemented, ungoverned | CRITICAL |
| GAP-CAP-PROOF-GOV | UCAP-32 Proof | implemented, ungoverned | HIGH |
| GAP-CAP-ECON | UCAP-14 Economic | architected, no WI | HIGH |
| GAP-CAP-UI | UCAP-25 UI | architected, no WI | HIGH |
| GAP-CAP-API-RT | UCAP-24 API service runtime | tooling-only, no runtime WI | HIGH |
| GAP-CAP-WORKFLOW | UCAP-12 Workflow | architected, no WI | MEDIUM |
| GAP-CAP-EVENT | UCAP-13 Event | architected, no WI | MEDIUM |
| GAP-CAP-AUTON | UCAP-33 Autonomy | architected, no WI | MEDIUM |
| GAP-CAP-ECOSYS | UCAP-34 Ecosystem | architected, no WI | MEDIUM |
| GAP-CAP-CIV | UCAP-20 Civilization | architected, deferred | MEDIUM |
| GAP-CAP-LEARN | UCAP-16 Learning | unmodeled | MEDIUM |
| GAP-CAP-INFRA | UCAP-21 Infrastructure | provision-pending | MEDIUM |
| GAP-CAP-RES | UCAP-15 Resource | vision | LOW |
| GAP-CAP-REALITY | UCAP-29 Reality Graph | vision, deferred | LOW |
| GAP-CAP-CLOSURE | (all) | no capability-universe closure | HIGH |

## 3. Root-cause analysis
- **The compiler roadmap tracked the PI construction ladder (PI-2..PI-11) but never enrolled the operability layer** (observability/readiness/proof) that was subsequently built — so implemented code drifted outside the registry.
- **The design frontier outran the registry**: architecture specs (ECON/CIV/AUTO/ECO/EXP/PWF/PEV) were authored without a corresponding compiler work item, so they are invisible to the governor.
- **No closure enforced capability-universe completeness**, so the drift was never surfaced by the verdict.

## 4. Remediation (→ WS7/WS8)
Register all 13 unregistered capabilities + 1 reconciliation item as governed work items with dependencies, evidence, and a new **Capability Universe Governance Closure (CAP-C-01)**; gate design-only capabilities behind an Authority Board scoped-release external blocker (EXT-CAP-AUTH); create one software-solvable reconciliation item (CAP-RECON) to bring the implemented-invisible fabrics under evidence. **No implementation** — modeling and governance only.

---
**END WS6 — 13 unregistered capabilities (3 implemented/CRITICAL), 2 unmodeled, 13 missing evidence models, 13 missing closure links; remediation specified in WS7.**
