# UCOS — PROGRAM EXPANSION PLAN (WORKSTREAM 7)

**Artifact ID:** `UCOS-PROGRAM-EXPANSION-PLAN`
**Phase:** PHASE X.1 · WS7
**Date:** 2026-07-03
**Mode:** Governance modeling only. Defines the exact append-only additions to `registry/program/*.json` executed in WS8. **No implementation, no runtime code.** All additions are migration-only / append-only (INV-10, IP-14). Article IX lock unchanged.

## Design principles
1. **Subsumed capabilities get NO new work item** (governed via parent PI): UCAP-02⊂PI-4, UCAP-05⊂PI-7, UCAP-08⊂PI-9, UCAP-23⊂PI-2-3, UCAP-27⊂PI-11. Documented, not minted.
2. **Honest status only.** Implemented-invisible fabrics → `IN_PROGRESS` (implemented; evidence/ratification reconciliation pending). Design-only → `OPEN`, gated `EXTERNAL_BLOCKED` behind an Authority Board scoped-release blocker (Article IX is ACTIVE — construction requires a scoped release). No fabricated `COMPLETE`, no fabricated `READY` except the one genuinely software-solvable reconciliation item.
3. **Determinism + acyclicity preserved** — all new edges point to existing COMPLETE items or lower capability nodes; no cycles.

## A. New work items (16)

### A1. Implemented-but-compiler-invisible fabrics → IN_PROGRESS
| ID | Title | Type | Owner | Depends on | Evidence (state) | Gate | Constraint |
|----|-------|------|-------|-----------|------------------|------|-----------|
| CAP-OPS | Observability & Operations Fabric | program-increment | Platform Runtime / PEO-012 | PI-4 | EV-CAP-OPS-IMP (SUBMITTED), EV-CAP-OPS-RECON (PENDING) | GATE-QUAL-001, GATE-SEC-001 | Implemented (control/operations, 356 tests); authorizing scoped release + evidence to be reconciled (CAP-RECON); ADR-PE12 |
| CAP-RDY | Readiness / Certification / Meta-Governance Fabric | program-increment | Platform Runtime | PI-4 | EV-CAP-RDY-IMP (SUBMITTED), EV-CAP-RDY-RECON (PENDING) | GATE-QUAL-001 | Implemented (control/readiness); verification partial; reconcile via CAP-RECON |
| CAP-PROOF | Proof Fabric | program-increment | Platform Runtime | CAP-OPS | EV-CAP-PROOF-IMP (SUBMITTED), EV-CAP-PROOF-RECON (PENDING) | GATE-QUAL-001, GATE-SEC-001 | Implemented (control/operations proof-*); PROOF-IMPL-001/B02-OPF/B03 |

### A2. Reconciliation item → READY (software-solvable, GATE-DOC-001)
| ID | Title | Type | Owner | Depends on | Evidence (state) | Gate | Constraint |
|----|-------|------|-------|-----------|------------------|------|-----------|
| CAP-RECON | Reconcile compiler-invisible implemented fabrics (Observability/Readiness/Proof) into the registry with authored validation/audit evidence + AD reconciliation | governance | Platform Governance | PI-4 | EV-CAP-RECON (PENDING) | GATE-DOC-001 | Documentation/governance only; authors IMP→VERIFIED evidence + reconciles authorizing scoped release on AUTH-012 ledger. No independent-attestation requirement. **This is the new NEXT EXECUTABLE item.** |

### A3. Design-only fabrics → OPEN, EXTERNAL_BLOCKED (Authority Board scoped-release gate)
| ID | Title | Type | Owner | Depends on | Evidence (state) | Gate | Constraint |
|----|-------|------|-------|-----------|------------------|------|-----------|
| CAP-ECON | Economic Engine | program-increment | Platform Runtime | PI-6, PI-4 | EV-CAP-ECON-AUTH (PENDING) | GATE-QUAL-001, GATE-SEC-001 | ECON-* design; requires scoped Article IX release; Evolution-only commit |
| CAP-RES | Resource Engine | program-increment | Platform Runtime | CAP-ECON | EV-CAP-RES-ARCH (PENDING) | GATE-QUAL-001 | subset of Economic; needs distinct model |
| CAP-WORKFLOW | Workflow Engine | program-increment | Platform Runtime | PI-6, PI-4 | EV-CAP-WORKFLOW-AUTH (PENDING) | GATE-QUAL-001 | PWF/PE-07 design |
| CAP-EVENT | Universal Event Fabric | program-increment | Platform Runtime | PI-5, PI-4 | EV-CAP-EVENT-AUTH (PENDING) | GATE-QUAL-001, GATE-SEC-001 | PEV design; partial runtime |
| CAP-API | Universal API Fabric (service runtime) | program-increment | Platform Runtime | WI-10, PI-4 | EV-CAP-API-AUTH (PENDING) | GATE-QUAL-001, GATE-SEC-001 | contract tooling done (WI-05..10); service runtime gated |
| CAP-UI | Universal UI Fabric | program-increment | Experience | CAP-API | EV-CAP-UI-AUTH (PENDING) | GATE-DOC-001, GATE-QUAL-001 | EXP-* ratified design; apps/ empty |
| CAP-AUTON | Autonomy Fabric | program-increment | Platform Runtime | PI-10 | EV-CAP-AUTON-AUTH (PENDING) | GATE-QUAL-001, GATE-SEC-001 | AUTO-* design; blocked on Intelligence |
| CAP-ECOSYS | Ecosystem Fabric | program-increment | Platform Runtime | PI-5 | EV-CAP-ECOSYS-AUTH (PENDING) | GATE-QUAL-001 | ECO-* design |
| CAP-INFRA | Infrastructure Fabric | program-increment | Operations | ACT-06 | EV-CAP-INFRA-AUTH (PENDING) | GATE-SEC-001 | infra/ IaC; provisioning-gated (BLOCKED by ACT-06) |
| CAP-LEARN | Learning Engine | program-increment | Platform Runtime | PI-10, PI-9 | EV-CAP-LEARN-ARCH (PENDING) | GATE-QUAL-001 | unmodeled; architecture required first |
| CAP-CIV | Civilization Control Plane | program-increment | Platform Governance | PI-11, CAP-ECON | EV-CAP-CIV-AUTH (PENDING) | GATE-QUAL-001, GATE-SEC-001 | CIV-* design; AD-0014 deferred |
| CAP-REALITY | Reality Graph Runtime | program-increment | Platform Governance | CAP-CIV | EV-CAP-REALITY-ARCH (PENDING) | GATE-QUAL-001 | UEA-0006; existential; AD-0014 deferred |

## B. New dependency edges
```
CAP-OPS→PI-4 · CAP-RDY→PI-4 · CAP-PROOF→CAP-OPS · CAP-RECON→PI-4
CAP-ECON→PI-6 · CAP-ECON→PI-4 · CAP-RES→CAP-ECON
CAP-WORKFLOW→PI-6 · CAP-WORKFLOW→PI-4
CAP-EVENT→PI-5 · CAP-EVENT→PI-4
CAP-API→WI-10 · CAP-API→PI-4 · CAP-UI→CAP-API
CAP-AUTON→PI-10 · CAP-ECOSYS→PI-5 · CAP-INFRA→ACT-06
CAP-LEARN→PI-10 · CAP-LEARN→PI-9
CAP-CIV→PI-11 · CAP-CIV→CAP-ECON · CAP-REALITY→CAP-CIV
```
Acyclic (all edges point to existing or lower nodes). Verified by compiler post-registration.

## C. New governance closure
**CAP-C-01 — Capability Universe Governance Closure.** dependencies = all 16 new items; requiredEvidence = their evidence; closureCriteria = "every discovered capability registered, governed, and either VERIFIED or under a governed authorization/construction path." Computes **NO_GO** initially (correct — universe not yet realized). Overall program verdict remains **NO_GO**.

## D. New external blocker
**EXT-CAP-AUTH → CAP-C-01.** blockedWorkItems = [CAP-ECON, CAP-RES, CAP-WORKFLOW, CAP-EVENT, CAP-API, CAP-UI, CAP-AUTON, CAP-ECOSYS, CAP-LEARN, CAP-CIV, CAP-REALITY, CAP-INFRA]. required_actor = UCOS Authority Board (scoped Article IX release per capability). solvableBySoftware=false; postActionSolvableBySoftware=true (construction is software-solvable after each scoped release). Review trigger = evidence-advance on the AUTH/ARCH evidence ids. This marks the design-only capabilities EXTERNAL_BLOCKED (they need a Board scoped release before construction, exactly like PI-10/AD-0024).

## E. New constitutional lock (optional, for parity)
**LOCK-CAP-C-01 → CAP-C-01.** declaredState EXTERNAL_LOCKED; externalBlocker EXT-CAP-AUTH; releasableBySoftware=false; releaseConditions = per-capability scoped releases + construction + ratification.

## F. New gaps registry entries
The 16 GAP-CAP-* entries from WS6 §2, each linked to its owning capability work item.

## G. Computed effect (predicted, confirmed in WS9)
- **IN_PROGRESS (+3):** CAP-OPS, CAP-RDY; CAP-PROOF → BLOCKED (dep CAP-OPS not COMPLETE).
- **READY (+1):** **CAP-RECON** → becomes `nextExecutableWorkItem` (software-solvable, GATE-DOC-001).
- **EXTERNAL_BLOCKED (+5 via overlay):** CAP-ECON, CAP-WORKFLOW, CAP-EVENT, CAP-API, CAP-ECOSYS.
- **BLOCKED (+7):** CAP-PROOF, CAP-RES, CAP-UI, CAP-AUTON, CAP-INFRA, CAP-LEARN, CAP-CIV, CAP-REALITY (dep-gated; several transitively external).
- **Overall verdict:** NO_GO (unchanged; CAP-C-01 adds a fourth NO_GO closure).
- **Article IX:** unchanged (ACTIVE). No lock released. No implementation.

## H. Absolute-rule compliance
No implementation · no runtime code · no hard-coded capability logic · registry-driven (append-only) · compiler-governed · determinism/acyclicity preserved · INV-1..13/AUTH-012/AD-0014 preserved · Article IX ACTIVE.

---
**END WS7 — expansion plan: 16 work items, 22 edges, 1 closure, 1 external blocker, 1 lock, 16 gaps. One genuine software-solvable READY item (CAP-RECON) regenerates the queue.**
