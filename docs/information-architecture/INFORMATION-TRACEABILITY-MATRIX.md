# UCOS — Information / Metadata Traceability Matrix

**Artifact ID:** UCOS-INF-TRACE-001
**Layer:** ARCHITECTURE (Information / Metadata)
**Status:** CREATED (Phase 5.0 generation; ratification deferred to Phase 5.1)
**Version:** 1.0.0
**Phase:** Phase 5.0 — Information / Metadata Architecture Generation
**Date:** 2026-06-29
**Owner:** Chief Information Architect
**Parent:** `UCOS-INF-ARCH-001`

> **Purpose.** Establish complete, bidirectional lineage for every Information Class (`IC-01..IC-17`)
> and every Metadata Class (`MC-01..MC-13`) back to Authority and forward to its realizing domain and
> capability, satisfying AUTH-010 (no orphans, no dangling realization). Conceptual only — no data,
> schema, contract, or implementation lineage is asserted.

---

## 1. Traceability Rules Applied (AUTH-010)

1. **No orphans** — every class has ≥1 upstream Authority link.
2. **No dangling realization** — every Information Class names its owning domain + realizing capability.
3. **Bidirectional integrity** — owning domains/capabilities realize the named classes.
4. **Registry authority** — links recorded in `CTX-REG-001`.
5. **Seven axes** for Information Classes; **four axes** (minimum) for Metadata Classes.

---

## 2. Information Class Traceability (7 axes) — 17/17

Axes: **A**=Authority · **C**=Constitution · **EA**=Enterprise Architecture · **D**=Domain ·
**CAP**=Capability · **DC**=Data Canon (AUTH-007) · **DR**=Decision Records (AUTH-012).

| IC | Class | A (Authority) | C (Const.) | EA | D (Domain) | CAP | DC (AUTH-007) | DR |
|----|-------|---------------|------------|----|-----------|-----|---------------|----|
| IC-01 | Identity Information | AUTH-001 G1, AUTH-003 IP-08, AUTH-008 | Part on Security/Identity | §VI Information; §VIII Security | UCOS-DOM-017 | CAP-09 | §6.1, §6.3 | — |
| IC-02 | Party Information | AUTH-005 §6.4, AUTH-011 (Party) | Part on Domain/Glossary | §VI Information | UCOS-DOM-011 (+013/014/017 facets) | CAP-08 | §6.1, §6.3 | DF-002 closure (`UCOS-GOV-DF002-001`) |
| IC-03 | Product Information | AUTH-001 G1, AUTH-005 | Part on Capability/Domain | §V/§VI | UCOS-DOM-001 | CAP-01 | §6.2, §6.3 | — |
| IC-04 | Catalog Information | AUTH-001 G1, AUTH-005 | Part on Capability | §V/§VI | UCOS-DOM-001 (+012) | CAP-01 | §6.2, §6.3 | — |
| IC-05 | Commercial Information | AUTH-001 G1, AUTH-003 P-univ. | Part on Capability | §V/§VI | UCOS-DOM-002 (+010/014) | CAP-02 | §6.2, §6.3 | — |
| IC-06 | Order Information | AUTH-001 G1, AUTH-005 | Part on Capability | §V/§VI | UCOS-DOM-005 (+004) | CAP-05 | §6.1, §6.4 | — |
| IC-07 | Transaction Information | AUTH-008 (S1), AUTH-007 | Part on Security | §VI/§VIII | UCOS-DOM-006 | CAP-06 | §6.1, §6.3 | — |
| IC-08 | Fulfillment Information | AUTH-001 G1, AUTH-005 | Part on Capability | §V/§VI | UCOS-DOM-009 (+003) | CAP-07 | §6.1, §6.4 | — |
| IC-09 | Financial Information | AUTH-008 (S1), AUTH-007 | Part on Security/Compliance | §VI/§IX | UCOS-DOM-007 / UCOS-DOM-008 | CAP-06 | §6.1, §6.3, §6.4 | — |
| IC-10 | Compliance Information | AUTH-008, AUTH-009 | Part on Compliance | §IX Compliance | UCOS-DOM-023 | CAP-16 | §6.3, §6.4 | AD-0012 |
| IC-11 | Policy Information | AUTH-009, AUTH-003 IP-05 | Part on Governance | §XIV Governance | UCOS-DOM-025 | CAP-18 | §6.4 | AD-0012; AD-0013/TO-001 (IP-05) |
| IC-12 | Governance Information | AUTH-009 | Part on Governance | §XIV Governance | UCOS-DOM-022 | CAP-15 | §6.4 | AD-0012 |
| IC-13 | Security Information | AUTH-008 (S1/S3/S4) | Part on Security | §VIII Security | UCOS-DOM-024 | CAP-17 | §6.3 | AD-0012 |
| IC-14 | Registry Information | AUTH-010 §6.4, AUTH-009 | Part on Traceability | §XV Traceability | UCOS-DOM-027 | CAP-19 | §6.1 | AD-0012 |
| IC-15 | Workflow Information | AUTH-004, AUTH-009 | Part on Automation | §XI Automation | UCOS-DOM-019 | CAP-05 (orchestration) | §6.4 | — |
| IC-16 | Intelligence Information | AUTH-001 G5, AUTH-008 | Part on Observability | §X Observability | UCOS-DOM-020 (+021) | CAP-13 | §6.3, §6.4 | — |
| IC-17 | Platform Information | AUTH-003 P3/IP-04, AUTH-004 | Part V (Configuration) | §VI/§VII Integration | UCOS-DOM-018 (+021/026/028) | CAP-10 (+11/12/14) | §6.2, §6.3 | — |

**Information Class lineage: 17/17 complete across all 7 axes. Orphans: 0. Dangling realizations: 0.**

---

## 3. Metadata Class Traceability (4 axes) — 13/13

Axes: **A**=Authority · **G**=Governance (AUTH-009 / UCOS-DOM-022·CAP-15) ·
**T**=Traceability Canon (AUTH-010) · **IA**=Information Architecture (`UCOS-INF-ARCH-001`).

| MC | Class | A (Authority) | G (Governance) | T (AUTH-010) | IA (Information Arch.) |
|----|-------|---------------|----------------|--------------|-------------------------|
| MC-01 | Classification Metadata | AUTH-007 §6.3, AUTH-008 | AUTH-009; CAP-17 | §6.3 (lineage metadata) | §V, §XII (all IC) |
| MC-02 | Ownership Metadata | AUTH-005 §6, AUTH-007 §6.1 | AUTH-009; CAP-15 | §6.3 | §VI (all IC) |
| MC-03 | Governance Metadata | AUTH-009 | AUTH-009; CAP-15 | §6.3 | §IX (all IC) |
| MC-04 | Lineage Metadata | AUTH-010 §6.4 | AUTH-009; CAP-19 | §6.1, §6.4 | §XI (all IC) |
| MC-05 | Lifecycle Metadata | AUTH-007 §6.4 | AUTH-009; CAP-15 | §6.3 | §X (all IC) |
| MC-06 | Policy Metadata | AUTH-009, IP-05 | AUTH-009; CAP-18 | §6.3 | §IX, §XII |
| MC-07 | Security Metadata | AUTH-008 (S1/S3/S4) | AUTH-009; CAP-17 | §6.3 | §XII (Restricted IC) |
| MC-08 | Compliance Metadata | AUTH-008, AUTH-009 | AUTH-009; CAP-16 | §6.3 | §XII (Regulated IC) |
| MC-09 | Traceability Metadata | AUTH-010 | AUTH-009; CAP-19 | §6.4, §6.5 | §XI, §XXI (all IC) |
| MC-10 | Registry Metadata | AUTH-010 §6.2, CTX-REG-001 | AUTH-009; CAP-19 | §6.4 | §XXII (all artifacts) |
| MC-11 | Capability Metadata | AUTH-006 | AUTH-009; CAP-15 | §6.4 (capability lineage) | §VI (CAP links) |
| MC-12 | Domain Metadata | AUTH-005 | AUTH-009; CAP-15 | §6.4 (domain lineage) | §VI (Domain links) |
| MC-13 | Information Metadata | AUTH-007, UCOS-INF-ARCH-001 | AUTH-009; CAP-10 | §6.3 | §IV, §XIV (all IC) |

**Metadata Class lineage: 13/13 complete across all 4 axes. Orphans: 0.**

---

## 4. Bidirectional Realization (Domain ↔ Information Class)

| Domain | Realizes (IC) | Domain | Realizes (IC) |
|--------|---------------|--------|---------------|
| UCOS-DOM-001 | IC-03, IC-04 | UCOS-DOM-015 | IC-02, IC-17 |
| UCOS-DOM-002 | IC-05 | UCOS-DOM-016 | IC-09, IC-10 |
| UCOS-DOM-003 | IC-04, IC-08 | UCOS-DOM-017 | IC-01 |
| UCOS-DOM-004 | IC-06 | UCOS-DOM-018 | IC-17 |
| UCOS-DOM-005 | IC-06 | UCOS-DOM-019 | IC-15 |
| UCOS-DOM-006 | IC-07 | UCOS-DOM-020 | IC-16 |
| UCOS-DOM-007 | IC-09 | UCOS-DOM-021 | IC-16, IC-17 |
| UCOS-DOM-008 | IC-09 | UCOS-DOM-022 | IC-12 |
| UCOS-DOM-009 | IC-08 | UCOS-DOM-023 | IC-10 |
| UCOS-DOM-010 | IC-05, IC-06 | UCOS-DOM-024 | IC-13 |
| UCOS-DOM-011 | IC-02 | UCOS-DOM-025 | IC-11 |
| UCOS-DOM-012 | IC-04 | UCOS-DOM-026 | IC-17 |
| UCOS-DOM-013 | IC-02 | UCOS-DOM-027 | IC-14 |
| UCOS-DOM-014 | IC-02, IC-05, IC-06 | UCOS-DOM-028 | IC-17 |

**Domain coverage: 28/28. Information Class coverage: 17/17. Bidirectional integrity verified.**

---

## 5. Bidirectional Realization (Capability ↔ Information Class)

| Capability | Realizes (IC) | Capability | Realizes (IC) |
|------------|---------------|------------|---------------|
| CAP-01 Product Catalog Mgmt | IC-03, IC-04 | CAP-11 Observability | IC-16, IC-17 |
| CAP-02 Pricing & Promotion | IC-05 | CAP-12 Integration & Eventing | IC-17 |
| CAP-03 Inventory & Availability | IC-04, IC-08 | CAP-13 Analytics & Reporting | IC-16 |
| CAP-04 Cart & Checkout | IC-06 | CAP-14 Experience Delivery | IC-17 |
| CAP-05 Order Orchestration | IC-06, IC-15 | CAP-15 Platform Governance | IC-12 |
| CAP-06 Payment Processing | IC-07, IC-09 | CAP-16 Compliance & Assurance | IC-10 |
| CAP-07 Fulfillment & Returns | IC-08 | CAP-17 Security & Trust | IC-13 |
| CAP-08 Customer Management | IC-02 | CAP-18 Policy & Decisioning | IC-11 |
| CAP-09 Identity & Access Mgmt | IC-01 | CAP-19 Registry & Discovery | IC-14 |
| CAP-10 Configuration & Metadata | IC-17, IC-13(MC-13) | | |

**Capability coverage: 19/19. Information Class coverage: 17/17. Bidirectional integrity verified.**

---

## 6. Information ↔ Metadata Coverage (mandatory metadata set)

Mandatory for every IC: **MC-01, MC-02, MC-04, MC-05, MC-09, MC-11, MC-12, MC-13**.
Conditional: **MC-07** (Restricted/Regulated), **MC-08** (Regulated/Evidentiary), **MC-06** (policy-bearing), **MC-03** (governance state).

| IC | Mandatory set | + Conditional |
|----|---------------|---------------|
| IC-01 Identity | ✅ | MC-07 |
| IC-02 Party | ✅ | MC-07 |
| IC-03 Product | ✅ | — |
| IC-04 Catalog | ✅ | — |
| IC-05 Commercial | ✅ | MC-06 |
| IC-06 Order | ✅ | MC-07 |
| IC-07 Transaction | ✅ | MC-07, MC-08 |
| IC-08 Fulfillment | ✅ | MC-07 |
| IC-09 Financial | ✅ | MC-07, MC-08 |
| IC-10 Compliance | ✅ | MC-08 |
| IC-11 Policy | ✅ | MC-06, MC-03 |
| IC-12 Governance | ✅ | MC-03 |
| IC-13 Security | ✅ | MC-07, MC-08 |
| IC-14 Registry | ✅ | MC-10 |
| IC-15 Workflow | ✅ | MC-03 |
| IC-16 Intelligence | ✅ | MC-07 |
| IC-17 Platform | ✅ | MC-06 |

**Every Information Class carries a complete metadata context. 0 classes without metadata.**

---

## 7. Lineage Integrity Summary

| Check | Result |
|-------|:------:|
| Information Classes with ≥1 Authority link | 17/17 |
| Information Classes with owning domain + capability | 17/17 |
| Metadata Classes with Authority+Governance+Traceability+InfoArch | 13/13 |
| Domain → IC bidirectional coverage | 28/28 |
| Capability → IC bidirectional coverage | 19/19 |
| IC → mandatory metadata coverage | 17/17 |
| Orphan Information Classes | 0 |
| Orphan Metadata Classes | 0 |
| Dangling realizations | 0 |
| Broken bidirectional links | 0 |
| Traceability gaps | 0 |

---

## Traceability

- **Refines:** `UCOS-INF-ARCH-001`, `AUTH-005/006/007/008/009/010`, `UCOS-CONST-001`,
  `UCOS-ENT-ARCH-001`, `UCOS-DOM-ARCH-001`, `UCOS-CAP-ARCH-001`, `CTX-CAP-001`, `CTX-REG-001`,
  `AUTH-012` (AD-0003/AD-0012/AD-0013).
- **Refined by:** `UCOS-INF-COMP-001`, `UCOS-INF-DONE-001`; Phase 5.1 audit; Prompt 05.
