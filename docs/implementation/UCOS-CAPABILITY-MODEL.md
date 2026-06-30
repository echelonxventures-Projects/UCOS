# UCOS — Implementation Capability Model

| Field | Value |
|-------|-------|
| Artifact | **UCOS-CAPABILITY-MODEL** |
| Artifact ID | `UCOS-IMP-CAP-001` |
| Version | 1.0.0 |
| Phase | **Phase 10.0 — Implementation Readiness** |
| Status | CREATED — IMPLEMENTATION PLANNING |
| Mode | **PLANNING ONLY** — no source code, no technology selection, no runtime construction |
| Authority | Subordinate to UCOS Governance Baseline 1.0.0 (`UCOS-GOVERNANCE-BASELINE-1.0`), Authority Layer (`AUTH-001..012`), Constitution (`UCOS-CONST-001`) |
| Generates | `TM-IMP-001` — Capability Traceability Matrix (§7) |
| Branch | `phase-9.2-convergence` (DO NOT PUSH / DO NOT MERGE / DO NOT TAG) |
| Date | 2026-06-30 |

> **Scope discipline (binding).** This artifact transforms the *ratified, frozen* governance baseline into
> an implementation-oriented capability model for delivery planning. It introduces **no** new capability,
> domain, contract, data model, or technology decision. Every capability unit below is a planning lens over
> already-ratified constructs (`CAP-01..19`, `UCOS-DOM-001..028`, `PE-01..17`, `PRS-001..073`,
> `PEA-003..007`). Capability ratification authority remains with Prompts 02/03; this is a Prompt-10-phase
> readiness artifact only.

---

## 1. Purpose

Express the ratified UCOS capability landscape as a set of **Implementation Capability Units (ICUs)** that
can be planned, sequenced, work-packaged, and governed for delivery — while preserving full upstream
traceability (`Capability → Domain → Runtime Service → Governance Family`). The model is the entry point of
the Phase 10.0 implementation-readiness program and the parent of the roadmap (`UCOS-IMP-ROAD-001`), work
package structure (`UCOS-IMP-WPS-001`), and dependency graph (`UCOS-IMP-DEP-001`).

## 2. Inputs Confirmation

| Input | Source | Present |
|-------|--------|:-------:|
| 19 ratified capabilities `CAP-01..19` | `AUTH-006` v1.1.0 / `UCOS-CAP-ARCH-001` | ✅ |
| 28 ratified domains `UCOS-DOM-001..028` | `UCOS-DOM-ARCH-001` (RATIFIED) | ✅ |
| 17 platform domains `PE-01..17` | `UCOS-PEA-001` (substrate, frozen) | ✅ |
| 73 runtime services `PRS-001..073` | `UCOS-PEA-002` (substrate, frozen) | ✅ |
| 5 ratified governance families `PEA-003..007` | UCOS Governance Baseline 1.0.0 | ✅ |
| Capability→runtime-service mapping | `TM-PEA-002` | ✅ |

## 3. Capability Classes (ratified — unchanged)

| Class | Capabilities | Count | Realization track |
|-------|--------------|:-----:|-------------------|
| Core Commerce | `CAP-01..08` | 8 | Business track (requires Prompt 06/07/09) |
| Cross-Cutting / Platform | `CAP-09..14` | 6 | Platform track (`PRS` substrate) + Experience (`CAP-14`) |
| Platform Governance | `CAP-15..19` | 5 | Platform track (governance runtime services) |
| **Total** | **`CAP-01..19`** | **19** | — |

## 4. Implementation Capability Units (ICU-001..019)

Each ICU is a **1:1 planning projection** of one ratified capability. No capability is created, merged,
split, re-owned, or reclassified.

### 4.1 Core Commerce ICUs (business track)

| ICU | Capability | Realizing domain(s) | Realization track | Precondition |
|-----|------------|---------------------|-------------------|--------------|
| ICU-001 | CAP-01 Product Catalog Management | Catalog & Product | Business | Prompt 06/07/09 |
| ICU-002 | CAP-02 Pricing & Promotion | Pricing & Promotions | Business | Prompt 06/07/09 |
| ICU-003 | CAP-03 Inventory & Availability | Inventory & Availability | Business | Prompt 06/07/09 |
| ICU-004 | CAP-04 Cart & Checkout | Cart & Checkout | Business | Prompt 06/07/09 |
| ICU-005 | CAP-05 Order Orchestration | Order Management | Business | Prompt 06/07/09 |
| ICU-006 | CAP-06 Payment Processing | Payments & Billing | Business | Prompt 06/07/09 |
| ICU-007 | CAP-07 Fulfillment & Returns | Fulfillment & Logistics | Business | Prompt 06/07/09 |
| ICU-008 | CAP-08 Customer Management | Customer & CRM | Business | Prompt 06/07/09 |

### 4.2 Cross-Cutting ICUs (platform + experience track)

| ICU | Capability | Anchor platform domain | Realizing runtime services | Track |
|-----|------------|------------------------|----------------------------|-------|
| ICU-009 | CAP-09 Identity & Access Management | PE-08 Identity, Access & Tenancy | `PRS-031..034` | Platform |
| ICU-010 | CAP-10 Configuration & Metadata | PE-11 Configuration & Metadata Delivery | `PRS-043..046` | Platform |
| ICU-011 | CAP-11 Observability | PE-12 Observability & Telemetry | `PRS-047..051` | Platform |
| ICU-012 | CAP-12 Integration & Eventing | PE-04 Messaging & Eventing / PE-05 Integration & API Gateway | `PRS-013..021` | Platform |
| ICU-013 | CAP-13 Analytics & Reporting | PE-16 Intelligence & Analytics | `PRS-065..068` | Platform |
| ICU-014 | CAP-14 Experience Delivery | (experience surfaces) | (apps; Prompt 06) | Experience |

### 4.3 Platform Governance ICUs (platform track)

| ICU | Capability | Anchor platform domain | Realizing runtime services | Governing family |
|-----|------------|------------------------|----------------------------|------------------|
| ICU-015 | CAP-15 Platform Governance | PE-17 Platform Governance & Control Plane | `PRS-001..008`, `PRS-052..064`, `PRS-069..073` | `PEA-007` Control Fabric |
| ICU-016 | CAP-16 Compliance & Assurance | PE-10 Audit & Evidence | `PRS-039..042` | `PEA-007` Control Fabric |
| ICU-017 | CAP-17 Security & Trust | PE-09 Secrets & Key Mgmt / PE-08 | `PRS-009..012`, `PRS-035..038` | `PEA-007` + Prompt 09 |
| ICU-018 | CAP-18 Policy & Decisioning | PE-17 Platform Governance & Control Plane | `PRS-026..030` | `PEA-007` Control Fabric |
| ICU-019 | CAP-19 Registry & Discovery | PE-06 Registry & Discovery | `PRS-022..025` | `PEA-004` Registry |

> **Runtime-service coverage:** the platform/governance ICUs (`ICU-009..013`, `ICU-015..019`) collectively
> map all **73** runtime services `PRS-001..073` (per `TM-PEA-002`). `ICU-001..008` (core commerce) and
> `ICU-014` (experience) realize business capabilities through the 28 business domains and are pending
> their design parents (Prompts 06/07/09).

## 5. Governance Family Binding

| Governance family | Baseline version | Implementation relevance |
|-------------------|:----------------:|--------------------------|
| `PEA-003` Event | 1.0.0 RATIFIED | Event production/consumption contracts implemented by every ICU emitting `PEV-*` |
| `PEA-004` Registry | 0.6.0 RATIFIED | Registration/discovery (`PRE-*`) implemented by `ICU-019` and consumed by all |
| `PEA-005` Configuration | 0.7.0 RATIFIED | Config resolution (`PCF-*`) implemented by `ICU-010`, consumed by all |
| `PEA-006` Metadata | 0.8.0 RATIFIED | Metadata services (`PME-*`) implemented by `ICU-010`/`ICU-019` |
| `PEA-007` Control Fabric | 0.7.0 RATIFIED | Control enforcement (`PCE-*`) implemented by `ICU-015..018`, enforced platform-wide |

## 6. Capability Readiness Classification

| ICU set | Design parents complete? | Technology selected? | Implementation-ready? |
|---------|:------------------------:|:--------------------:|:---------------------:|
| `ICU-009..013`, `ICU-015..019` (platform) | Architecture RATIFIED; contracts (07) PENDING | No (ADRs deferred) | **CONDITIONAL** |
| `ICU-001..008` (core commerce) | Domain RATIFIED; Experience (06)/Contracts (07)/Security (09) PENDING | No | **BLOCKED until conditions met** |
| `ICU-014` (experience) | Experience (06) PENDING | No | **BLOCKED until conditions met** |

> No ICU is unconditionally implementation-ready in this phase because the generation lock (Constitution
> Article IX) is not yet released: Prompts 06, 07, 09 and the platform technology-selection ADRs are
> outstanding. This is reflected in the Phase 10.0 verdict (`UCOS-IMP-READY-001`).

## 7. TM-IMP-001 — Capability Traceability Matrix

| ICU | Capability | Domain anchor | Runtime services | Governance family | Upstream authority | Track | Readiness |
|-----|-----------|---------------|------------------|-------------------|--------------------|-------|:---------:|
| ICU-001 | CAP-01 | Catalog & Product | (biz svc; Prompt 07) | PEA-003/005/007 | `UCOS-CAP-ARCH-001` | Business | Conditional |
| ICU-002 | CAP-02 | Pricing & Promotions | (biz svc; Prompt 07) | PEA-003/005/007 | `UCOS-CAP-ARCH-001` | Business | Conditional |
| ICU-003 | CAP-03 | Inventory & Availability | (biz svc; Prompt 07) | PEA-003/005/007 | `UCOS-CAP-ARCH-001` | Business | Conditional |
| ICU-004 | CAP-04 | Cart & Checkout | (biz svc; Prompt 07) | PEA-003/005/007 | `UCOS-CAP-ARCH-001` | Business | Conditional |
| ICU-005 | CAP-05 | Order Management | (biz svc; Prompt 07) | PEA-003/005/007 | `UCOS-CAP-ARCH-001` | Business | Conditional |
| ICU-006 | CAP-06 | Payments & Billing | (biz svc; Prompt 07) | PEA-003/005/007 | `UCOS-CAP-ARCH-001` | Business | Conditional |
| ICU-007 | CAP-07 | Fulfillment & Logistics | (biz svc; Prompt 07) | PEA-003/005/007 | `UCOS-CAP-ARCH-001` | Business | Conditional |
| ICU-008 | CAP-08 | Customer & CRM | (biz svc; Prompt 07) | PEA-003/005/007 | `UCOS-CAP-ARCH-001` | Business | Conditional |
| ICU-009 | CAP-09 | PE-08 Identity | `PRS-031..034` | PEA-003/004/007 | `TM-PEA-002` | Platform | Conditional |
| ICU-010 | CAP-10 | PE-11 Config/Metadata | `PRS-043..046` | PEA-005/006 | `TM-PEA-002` | Platform | Conditional |
| ICU-011 | CAP-11 | PE-12 Observability | `PRS-047..051` | PEA-003/007 | `TM-PEA-002` | Platform | Conditional |
| ICU-012 | CAP-12 | PE-04/05 Eventing/Gateway | `PRS-013..021` | PEA-003/004 | `TM-PEA-002` | Platform | Conditional |
| ICU-013 | CAP-13 | PE-16 Analytics | `PRS-065..068` | PEA-003/006 | `TM-PEA-002` | Platform | Conditional |
| ICU-014 | CAP-14 | Experience surfaces | (apps; Prompt 06) | PEA-003/005 | `UCOS-CAP-ARCH-001` | Experience | Conditional |
| ICU-015 | CAP-15 | PE-17 Control Plane | `PRS-001..008/052..064/069..073` | PEA-007 | `TM-PEA-002` | Platform | Conditional |
| ICU-016 | CAP-16 | PE-10 Audit & Evidence | `PRS-039..042` | PEA-007 | `TM-PEA-002` | Platform | Conditional |
| ICU-017 | CAP-17 | PE-09/08 Security | `PRS-009..012/035..038` | PEA-007 + Prompt 09 | `TM-PEA-002` | Platform | Conditional |
| ICU-018 | CAP-18 | PE-17 Policy | `PRS-026..030` | PEA-007 | `TM-PEA-002` | Platform | Conditional |
| ICU-019 | CAP-19 | PE-06 Registry & Discovery | `PRS-022..025` | PEA-004 | `TM-PEA-002` | Platform | Conditional |

> **TM-IMP-001 result:** 19/19 capabilities projected to ICUs with full upstream traceability; 73/73
> runtime services covered by platform/governance ICUs; 0 orphan capabilities; 0 orphan runtime services; 0
> capability create/merge/split/re-own/reclassify. All ICUs **Conditional** pending generation-lock release.

## 8. Validation

| Check | Target | Observed | Result |
|-------|:------:|:--------:|:------:|
| Capabilities projected (1:1) | 19 | 19 | ✅ |
| Runtime-service coverage (platform ICUs) | 73 | 73 | ✅ |
| Orphan capabilities / services | 0 | 0 | ✅ |
| New capability/domain/contract/tech created | 0 | 0 | ✅ |
| Upstream traceability complete | 100% | 100% | ✅ |
| Implementation leakage (code/tech/vendor) | NONE | NONE | ✅ |

## Traceability
- **Refines:** `UCOS-GOVERNANCE-BASELINE-1.0`, `UCOS-CAP-ARCH-001`, `UCOS-DOM-ARCH-001`, `UCOS-PEA-001/002`, `TM-PEA-002`, `AUTH-006`.
- **Refined by:** `UCOS-IMP-ROAD-001` (roadmap), `UCOS-IMP-WPS-001` (work packages), `UCOS-IMP-DEP-001` (dependencies), `UCOS-IMP-READY-001` (readiness report).
- **Owner:** Implementation Program (subordinate to Authority Board).
