# UCOS — Capability Traceability Matrix

**Artifact ID:** UCOS-CAP-TRACE-001
**Layer:** ARCHITECTURE (Capability)
**Status:** CREATED (Phase 4.0; verification & ratification deferred to Phase 4.1)
**Version:** 1.0.0
**Phase:** Phase 4.0 — Capability Architecture Generation
**Date:** 2026-06-29
**Owner:** Chief Capability Architect / Traceability gate
**Parent:** `UCOS-CAP-ARCH-001`

> **Purpose.** Establish, for every ratified capability (CAP-01..19), complete upstream lineage to
> **Authority**, **Constitution**, **Enterprise Architecture**, **Domain Architecture**, the
> **Capability Canon**, and **Decision Records**, plus Vision-goal and principle anchors. Enforces the
> no-orphan rule (AUTH-010 §7; AUTH-006 §6.4/§6.5). Conceptual only — no implementation artifacts.

---

## 1. Traceability Axes

Per AUTH-010 and the Phase 4.0 mandate, each capability is traced across seven axes:

| Axis | Source | Rule |
|------|--------|------|
| A1 Authority | `AUTH-001..012` | ≥1 governing Authority artifact |
| A2 Constitution | `UCOS-CONST-001` | ≥1 governing constitutional Part |
| A3 Enterprise Architecture | `UCOS-ENT-ARCH-001` | EA §V Capability framework / §IV layers |
| A4 Domain Architecture | `UCOS-DOM-ARCH-001` | ≥1 realizing domain (§VII.2) |
| A5 Capability Canon | `AUTH-006` v1.1.0 | Canonical capability definition + class |
| A6 Decision Record | `AUTH-012` | ≥1 ratifying decision (AD-0003 / AD-0012) |
| A7 Vision Goal | `AUTH-001` G1–G6 | ≥1 strategic goal anchor |

---

## 2. Master Traceability Matrix (CAP-01..19)

| Cap ID | Capability | A1 Authority | A2 Constitution | A3 EA | A4 Domain | A5 Canon | A6 Decision | A7 Vision | Principles |
|--------|-----------|--------------|-----------------|-------|-----------|----------|-------------|-----------|------------|
| CAP-01 | Product Catalog Management | AUTH-001, AUTH-006, AUTH-005 | Parts IV–VII | §V, §IV (L0–L9) | UCOS-DOM-001 (+013,+014) | §6.2 Core Commerce | AD-0003 | G1, G2 | IP-01, IP-03, IP-07 |
| CAP-02 | Pricing & Promotion | AUTH-001, AUTH-006, AUTH-005 | Parts IV–VII | §V, §IV | UCOS-DOM-002 (+010,+014) | §6.2 Core Commerce | AD-0003 | G1, G2 | IP-01, IP-05, IP-03 |
| CAP-03 | Inventory & Availability | AUTH-001, AUTH-006, AUTH-005 | Parts IV–VII | §V, §IV | UCOS-DOM-003 (+013,+014) | §6.2 Core Commerce | AD-0003 | G1, G2 | IP-01, IP-07 |
| CAP-04 | Cart & Checkout | AUTH-001, AUTH-006, AUTH-005 | Parts IV–VII | §V, §IV | UCOS-DOM-004 (+014) | §6.2 Core Commerce | AD-0003 | G1, G2 | IP-06, IP-07 |
| CAP-05 | Order Orchestration | AUTH-001, AUTH-006, AUTH-005 | Parts IV–VII, X | §V, §IV (L6 Execution) | UCOS-DOM-005 (+010,+019,+014) | §6.2 Core Commerce | AD-0003 | G1, G2 | IP-06, IP-07, IP-13 |
| CAP-06 | Payment Processing | AUTH-001, AUTH-006, AUTH-008 | Parts IV–VII, X | §V, §IV, §VIII | UCOS-DOM-006/007/008 (+010,+014) | §6.2 Core Commerce | AD-0003 | G1, G6 | IP-09 (non-waivable), IP-10, IP-13 |
| CAP-07 | Fulfillment & Returns | AUTH-001, AUTH-006, AUTH-005 | Parts IV–VII | §V, §IV | UCOS-DOM-009 (+014) | §6.2 Core Commerce | AD-0003 | G1, G2 | IP-06, IP-07 |
| CAP-08 | Customer Management | AUTH-001, AUTH-006, AUTH-008 | Parts IV–VII | §V, §IV | UCOS-DOM-011 | §6.2 Core Commerce | AD-0003 | G1, G2 | IP-09, IP-10 |
| CAP-09 | Identity & Access Management | AUTH-001, AUTH-006, AUTH-008 | Parts VI, XIII | §V, §VIII | UCOS-DOM-017 | §6.2 Cross-Cutting/Platform | AD-0003 | G6, G1 | IP-09 (non-waivable), IP-05, IP-10 |
| CAP-10 | Configuration & Metadata | AUTH-001, AUTH-006, AUTH-003 | Parts V, XII | §V, §VI | UCOS-DOM-018 | §6.2 Cross-Cutting/Platform | AD-0003 | G3, G2 | IP-01, IP-03, IP-04 |
| CAP-11 | Observability | AUTH-001, AUTH-006, AUTH-009 | Parts XI, XII | §V, §X | UCOS-DOM-021 | §6.2 Cross-Cutting/Platform | AD-0003 | G6 | IP-10, IP-11 |
| CAP-12 | Integration & Eventing | AUTH-001, AUTH-006, AUTH-004 | Parts IV, XII | §V, §VII | UCOS-DOM-026 | §6.2 Cross-Cutting/Platform | AD-0003 | G4, G2 | IP-07, IP-13, IP-15 |
| CAP-13 | Analytics & Reporting | AUTH-001, AUTH-006, AUTH-009 | Parts XI, XII | §V, §X | UCOS-DOM-020 (+012) | §6.2 Cross-Cutting/Platform | AD-0003 | G5, G6 | IP-10, IP-11, IP-16 |
| CAP-14 | Experience Delivery | AUTH-001, AUTH-006, AUTH-005 | Parts IV–VII | §V, §IV | UCOS-DOM-028 (+012,+015,+016) | §6.2 Cross-Cutting/Platform | AD-0003 | G1, G4 | IP-04, IP-07 |
| CAP-15 | Platform Governance | AUTH-002, AUTH-009, AUTH-006 | Parts I, XII, XIII | §XIV, §XII | UCOS-DOM-022 (1:1) | §6.2.1 Platform Governance | AD-0012 | G5, G6 | IP-08, IP-16, IP-17 |
| CAP-16 | Compliance & Assurance | AUTH-002, AUTH-009, AUTH-006 | Part XI | §IX, §XIV | UCOS-DOM-023 (1:1) | §6.2.1 Platform Governance | AD-0012 | G5, G6 | IP-08, IP-10 |
| CAP-17 | Security & Trust | AUTH-008, AUTH-006, AUTH-002 | Part VI | §VIII | UCOS-DOM-024 (1:1) | §6.2.1 Platform Governance | AD-0012 | G6, G5 | IP-09 (non-waivable S1/S3/S4), IP-10 |
| CAP-18 | Policy & Decisioning | AUTH-003, AUTH-009, AUTH-006 | Parts V, XIII | §V, §XIV | UCOS-DOM-025 (1:1) | §6.2.1 Platform Governance | AD-0012 | G5, G3 | IP-05 (Policy Driven), IP-01 |
| CAP-19 | Registry & Discovery | AUTH-006, AUTH-010, AUTH-009 | Parts II, XII | §VI, §XV | UCOS-DOM-027 (1:1) | §6.2.1 Platform Governance | AD-0012 | G5, G2 | IP-02 (Registry Driven), IP-08 |

> **Note:** EA section references (§V Capability framework; §IV Architectural Layers L0–L9) are
> conceptual anchors to the ratified Enterprise Architecture; no EA content is altered here.

---

## 3. Capability → Realizing Domain Lineage

| Cap ID | Primary Domain | Contributing Domains (distinct facets) | Ownership type |
|--------|----------------|----------------------------------------|----------------|
| CAP-01 | UCOS-DOM-001 Catalog | UCOS-DOM-013, UCOS-DOM-014 | Single primary |
| CAP-02 | UCOS-DOM-002 Pricing & Promotions | UCOS-DOM-010, UCOS-DOM-014 | Single primary |
| CAP-03 | UCOS-DOM-003 Inventory & Availability | UCOS-DOM-013, UCOS-DOM-014 | Single primary |
| CAP-04 | UCOS-DOM-004 Cart & Checkout | UCOS-DOM-014 | Single primary |
| CAP-05 | UCOS-DOM-005 Order Management | UCOS-DOM-010, UCOS-DOM-019, UCOS-DOM-014 | Single primary |
| CAP-06 | UCOS-DOM-006 Payments | UCOS-DOM-007, UCOS-DOM-008, UCOS-DOM-010, UCOS-DOM-014 | Multi-facet (single-owner-per-facet) |
| CAP-07 | UCOS-DOM-009 Fulfillment & Returns | UCOS-DOM-014 | Single primary |
| CAP-08 | UCOS-DOM-011 Customer & CRM | — | Single primary |
| CAP-09 | UCOS-DOM-017 Identity & Access | — | Single primary |
| CAP-10 | UCOS-DOM-018 Configuration & Metadata | — | Single primary |
| CAP-11 | UCOS-DOM-021 Observability | — | Single primary |
| CAP-12 | UCOS-DOM-026 Integration & Federation | — | Single primary |
| CAP-13 | UCOS-DOM-020 Intelligence & Insight | UCOS-DOM-012 | Single primary |
| CAP-14 | UCOS-DOM-028 Experience Delivery | UCOS-DOM-012, UCOS-DOM-015, UCOS-DOM-016 | Multi-facet (single-owner-per-facet) |
| CAP-15 | UCOS-DOM-022 Governance | — | **1:1** |
| CAP-16 | UCOS-DOM-023 Compliance | — | **1:1** |
| CAP-17 | UCOS-DOM-024 Security | — | **1:1** |
| CAP-18 | UCOS-DOM-025 Policy | — | **1:1** |
| CAP-19 | UCOS-DOM-027 Registry | — | **1:1** |

> Every domain realizing a contributing facet is itself an approved, ratified bounded context
> (`UCOS-DOM-ARCH-001`) — so capability lineage is bidirectionally complete (capability ↔ domain).

---

## 4. Candidate → Permanent Capability ID Mapping

| Provisional | Permanent | Capability | Class | Source |
|-------------|-----------|-----------|-------|--------|
| CAP-CAND-01 | CAP-01 | Product Catalog Management | Core Commerce | AUTH-006 §6.2; AD-0003 |
| CAP-CAND-02 | CAP-02 | Pricing & Promotion | Core Commerce | AUTH-006 §6.2; AD-0003 |
| CAP-CAND-03 | CAP-03 | Inventory & Availability | Core Commerce | AUTH-006 §6.2; AD-0003 |
| CAP-CAND-04 | CAP-04 | Cart & Checkout | Core Commerce | AUTH-006 §6.2; AD-0003 |
| CAP-CAND-05 | CAP-05 | Order Orchestration | Core Commerce | AUTH-006 §6.2; AD-0003 |
| CAP-CAND-06 | CAP-06 | Payment Processing | Core Commerce | AUTH-006 §6.2; AD-0003 |
| CAP-CAND-07 | CAP-07 | Fulfillment & Returns | Core Commerce | AUTH-006 §6.2; AD-0003 |
| CAP-CAND-08 | CAP-08 | Customer Management | Core Commerce | AUTH-006 §6.2; AD-0003 |
| CAP-CAND-09 | CAP-09 | Identity & Access Management | Cross-Cutting/Platform | AUTH-006 §6.2; AD-0003 |
| CAP-CAND-10 | CAP-10 | Configuration & Metadata | Cross-Cutting/Platform | AUTH-006 §6.2; AD-0003 |
| CAP-CAND-11 | CAP-11 | Observability | Cross-Cutting/Platform | AUTH-006 §6.2; AD-0003 |
| CAP-CAND-12 | CAP-12 | Integration & Eventing | Cross-Cutting/Platform | AUTH-006 §6.2; AD-0003 |
| CAP-CAND-13 | CAP-13 | Analytics & Reporting | Cross-Cutting/Platform | AUTH-006 §6.2; AD-0003 |
| CAP-CAND-14 | CAP-14 | Experience Delivery | Cross-Cutting/Platform | AUTH-006 §6.2; AD-0003 |
| (ratified directly) | CAP-15 | Platform Governance | Platform Governance | AUTH-006 §6.2.1; AD-0012 |
| (ratified directly) | CAP-16 | Compliance & Assurance | Platform Governance | AUTH-006 §6.2.1; AD-0012 |
| (ratified directly) | CAP-17 | Security & Trust | Platform Governance | AUTH-006 §6.2.1; AD-0012 |
| (ratified directly) | CAP-18 | Policy & Decisioning | Platform Governance | AUTH-006 §6.2.1; AD-0012 |
| (ratified directly) | CAP-19 | Registry & Discovery | Platform Governance | AUTH-006 §6.2.1; AD-0012 |

> **0 unmapped candidates.** All 14 provisional candidates map 1:1 to permanent IDs; the 5 Platform
> Governance capabilities were ratified directly (AD-0012). No candidate is dropped or duplicated.

---

## 5. Coverage Verification

| Axis | Capabilities covered | Result |
|------|----------------------|:------:|
| A1 Authority | 19/19 | ✅ |
| A2 Constitution | 19/19 | ✅ |
| A3 Enterprise Architecture | 19/19 | ✅ |
| A4 Domain Architecture (≥1 realizing domain) | 19/19 | ✅ |
| A5 Capability Canon | 19/19 | ✅ |
| A6 Decision Record | 19/19 | ✅ |
| A7 Vision Goal | 19/19 | ✅ |
| Candidate → permanent mapping | 19/19 | ✅ |
| Domains realizing ≥1 capability | 28/28 | ✅ |

---

## 6. Gap Analysis

| Gap class | Count | Detail |
|-----------|------:|--------|
| Orphan capabilities (no upstream) | 0 | All 19 trace across A1–A7 |
| Orphan domains (realize no capability) | 0 | 28/28 realize ≥1 capability (incl. governance frameworks) |
| Ownership conflicts | 0 | Single primary per capability; CAP-15..19 1:1 |
| Unmapped candidates | 0 | 19/19 mapped |
| Undeclared dependencies | 0 | All edges declared (UCOS-CAP-ARCH-001 §IX–§X) |
| Vision-goal gaps | 0 | 19/19 anchored to ≥1 of G1–G6 |
| Decision-record gaps | 0 | 19/19 anchored to AD-0003 or AD-0012 |

> **Traceability verdict:** **0 orphans, 0 gaps, 0 ownership conflicts.** Seven-axis lineage complete.

---

## Traceability

- **Refines (upstream):** `UCOS-CAP-ARCH-001`; `AUTH-001`, `AUTH-003`, `AUTH-005`, `AUTH-006` v1.1.0,
  `AUTH-008`, `AUTH-009`, `AUTH-010`, `AUTH-012` (AD-0003, AD-0012); `UCOS-CONST-001`;
  `UCOS-ENT-ARCH-001`; `UCOS-DOM-ARCH-001`; `CTX-CAP-001`.
- **Refined by (downstream):** `CAPABILITY-COMPLIANCE-REPORT.md` (`UCOS-CAP-COMP-001`),
  `CAPABILITY-COMPLETION-REPORT.md` (`UCOS-CAP-DONE-001`); Phase 4.1.

## Version Information

| Version | Date | Author | Change | Decision Ref |
|---------|------|--------|--------|--------------|
| 1.0.0 | 2026-06-29 | Chief Capability Architect | Seven-axis traceability matrix for CAP-01..19; 19/19 covered across Authority/Constitution/EA/Domain/Canon/Decision/Vision; candidate→permanent mapping 19/19; 0 orphans, 0 gaps, 0 ownership conflicts. | Phase 4.0 |
