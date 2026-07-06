# AGP-D1 — CAPABILITY CLASSIFICATION ATTESTATION SET

**Deliverable:** D-1 (S-1) · **Program:** Architecture Governance (Program 0) · **Mode:** attest-only,
append-only, fail-closed.
**Source of truth (INV-5):** `UCOS-CAPABILITY-INVENTORY.md` (rows 17–57) · `UCOS-CAPABILITY-GAP-REPORT`.
**Rule:** every enumerated constitutional capability is assigned exactly one governance class; any
capability whose class cannot be proven from source → `UNCLASSIFIED` finding (never a default).

## Governance-class taxonomy (derived, not invented)

| Class | Meaning |
|---|---|
| `A · GOVERNED-IMPLEMENTED` | Work-item-governed **and** implemented + tested |
| `B · GOVERNED-SUBSUMED` | Governed via a parent PI (no separate work item required) |
| `C · GOVERNED-IN-PROGRESS` | Governed but ratification open / pending / contested |
| `D · UNGOVERNED-IMPLEMENTED` | Implemented in code but **no work item governs it** (drift) |
| `E · DESIGN-ONLY-UNGOVERNED` | Architected (design) with no work item |
| `F · VISION / UNMODELED / DEFERRED` | Not modelled or explicitly deferred |

## Classification attestation (UCAP-01..34)

| UCAP | Name | Class | Basis (inventory) |
|---|---|:--:|---|
| 01 | Identity Fabric | A | impl+gov ✅, PI-4 |
| 02 | Identity Graph | B | subsumed ⊂ PI-4 |
| 03 | Trust Fabric | A | impl+gov ✅, PI-4 |
| 04 | Knowledge Engine | A | impl+gov ✅, PI-7 |
| 05 | Knowledge Graph | B | subsumed ⊂ PI-7 |
| 06 | Ontology Engine | C | PI-8, ratification contested |
| 07 | Memory Engine | C | PI-9, ratification self-attested |
| 08 | Memory Continuity Layer | B | subsumed ⊂ PI-9 |
| 09 | Capability Runtime | A | substrate, PI-2-3 |
| 10 | Policy Engine | A | impl+gov ✅, PI-4 |
| 11 | Authority Engine | A | impl+gov ✅, PI-4 |
| 12 | Workflow Engine | E | design only, work item **NONE** |
| 13 | Universal Event Fabric | E | partial, work item **NONE** |
| 14 | Economic Engine | E | design only, work item **NONE** |
| 15 | Resource Engine | F | subsumed/unmodeled |
| 16 | Learning Engine | F | entirely unmodeled |
| 17 | Intelligence Engine | C | PI-10 OPEN (AD-0024 gate) |
| 18 | Simulation System | C | PI-11 IN_PROGRESS, ratification pending |
| 19 | Evolution Engine | A | impl+gov ✅, PI-6 |
| 20 | Civilization Control Plane | E | design only, work item **NONE** |
| 21 | Infrastructure Fabric | C | IaC not provisioned; ACT-06 proxy |
| 22 | Federation Fabric | A | impl+gov ✅, PI-5 |
| 23 | Execution Fabric | B | substrate subsumed ⊂ PI-2-3 |
| 24 | Universal API Fabric | C | tooling only; no service runtime WI |
| 25 | Universal UI Fabric | E | apps/ EMPTY; design C-1; WI **NONE** |
| 26 | Observability Fabric | D | implemented, **compiler-invisible** |
| 27 | Digital Twin Layer | B | subsumed ⊂ PI-11 |
| 28 | Governance Runtime | C | PI-4 partial; readiness fabric UNGOVERNED |
| 29 | Reality Graph Runtime | F | existential, AD-0014 deferred |
| 30 | Operations/Observability (impl.) | D | implemented+tested, **compiler-invisible** |
| 31 | Readiness/Certification/Meta-Gov | D | implemented, **compiler-invisible** |
| 32 | Proof Fabric | D | implemented, **compiler-invisible** |
| 33 | Autonomy Fabric | E | design AUTO-* (7 specs), no WI |
| 34 | Ecosystem Fabric | E | design ECO-* (7 specs), no WI |

## Class tally

| Class | Count | UCAP |
|---|:--:|---|
| A GOVERNED-IMPLEMENTED | 8 | 01,03,04,09,10,11,19,22 |
| B GOVERNED-SUBSUMED | 5 | 02,05,08,23,27 |
| C GOVERNED-IN-PROGRESS | 6 | 06,07,17,18,21,24,28 → *7* |
| D UNGOVERNED-IMPLEMENTED | 4 | 26,30,31,32 |
| E DESIGN-ONLY-UNGOVERNED | 6 | 12,13,14,20,25,33,34 → *7* |
| F VISION/UNMODELED/DEFERRED | 3 | 15,16,29 |

*(Corrected counts: C = 7 {06,07,17,18,21,24,28}; E = 7 {12,13,14,20,25,33,34}. Total = 8+5+7+4+7+3 = 34.)*

`UNCLASSIFIED` findings: **0** — every UCAP-01..34 is classified from source.

**D-1 STATUS: COMPLETE — 34/34 capabilities classified, 0 unclassified.**
*(Classification attests present state; it corrects nothing. Class D and E are surfaced to D-6 as
integrity/coverage concerns, not resolved here.)*
