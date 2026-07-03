# UCOS — Domain Map

| Field | Value |
|-------|-------|
| Artifact | **UCOS Domain Map** |
| Artifact ID | `URNP-DOM-001` |
| Program | UCOS Repository Normalization Program (URNP) v1.0 |
| Phase | **Phase 4 — Domain Classification** |
| Mode | ANALYSIS & ORGANIZATION ONLY |
| Status | GENERATED |
| Date | 2026-07-02 |
| Sources | `UCOS-DOM-ARCH-001` (`docs/domain-architecture`), `.claude/context/UCOS-DOMAIN-CATALOG.md`, contract catalog (`UCOS-CONTRACT-CAT-001`), `packages/platform-runtime/src/control/**`, `architecture/**` |

> **Purpose.** Authoritative domain map for the whole repository. Two domain layers coexist:
> **(A) Business bounded-context domains** `DOM-001..028` (the commerce operating system) and
> **(B) Platform fabric domains** (the runtime substrate implemented in `platform-runtime`).
> Every artifact maps to exactly one **primary** domain. Domain definitions are **referenced** from
> their canonical owners (§ DUPLICATE-ANALYSIS D-05); this map does not redefine them.

---

## 1. Layer A — Business Bounded-Context Domains (`DOM-001..028`)

Source of truth: `docs/domain-architecture/**` (`UCOS-DOM-ARCH-001`). Classification bands per catalog:
**Core (11)**, **Supporting (5)**, **Cross-Cutting (5)**, **Governance (4)**, **Platform (3)**.

### Core Commerce (DOM-001..011)

| Domain | Name | Capability | Service | API Contract | Event Contract | Data Contract |
|--------|------|-----------|---------|--------------|----------------|---------------|
| DOM-001 | Catalog | CAP-01 | SVC-001 | API-001 | EVT-001 | DC-001 |
| DOM-002 | Pricing & Promotions | CAP-02 | SVC-002 | API-002 | EVT-002 | DC-002 |
| DOM-003 | Inventory & Availability | CAP-03 | SVC-003 | API-003 | EVT-003 | DC-003 |
| DOM-004 | Cart & Checkout | CAP-04 | SVC-004 | API-004 | EVT-004 | DC-004 |
| DOM-005 | Order Management | CAP-05 | SVC-005 | API-005 | EVT-005 | DC-005 |
| DOM-006 | Payments | CAP-06 | SVC-006 | API-006 | EVT-006 | DC-006 |
| DOM-007 | Billing | CAP-06 | SVC-007 | API-007 | EVT-007 | DC-007 |
| DOM-008 | Settlement | CAP-06 | SVC-008 | API-008 | EVT-008 | DC-008 |
| DOM-009 | Fulfillment & Returns | CAP-07 | SVC-009 | API-009 | EVT-009 | DC-009 |
| DOM-010 | Subscriptions | CAP-05/02/06 | SVC-010 | API-010 | EVT-010 | DC-010 |
| DOM-011 | Customer & CRM | CAP-08 | SVC-011 | API-011 | EVT-011 | DC-011 |

### Supporting (DOM-012..016)

| Domain | Name | Capability | Service | API | Event | Data |
|--------|------|-----------|---------|-----|-------|------|
| DOM-012 | Merchandising | CAP-14/13 | SVC-012 | API-012 | EVT-012 | DC-012 |
| DOM-013 | Supplier | CAP-01/03 | SVC-013 | API-013 | EVT-013 | DC-013 |
| DOM-014 | Marketplace | CAP-01..07 | SVC-014 | API-014 | EVT-014 | DC-014 |
| DOM-015 | Communication | CAP-14 | SVC-015 | API-015 | EVT-015 | DC-015 |
| DOM-016 | Document | CAP-14 | SVC-016 | API-016 | EVT-016 | DC-016 |

### Cross-Cutting (DOM-017..021)

| Domain | Name | Capability | Service | API | Event | Data |
|--------|------|-----------|---------|-----|-------|------|
| DOM-017 | Identity & Access | CAP-09 | SVC-017 | API-017 | EVT-017 | DC-017 |
| DOM-018 | Configuration & Metadata | CAP-10 | SVC-018 | API-018 | EVT-018 | DC-018 |
| DOM-019 | Workflow & Orchestration | EA L6 (+CAP-05) | SVC-019 | API-019 | EVT-019 | DC-019 |
| DOM-020 | Intelligence & Insight | CAP-13 | SVC-020 | API-020 | EVT-020 | DC-020 |
| DOM-021 | Observability | CAP-11 | SVC-021 | API-021 | EVT-021 | DC-021 |

### Governance (DOM-022..025)

| Domain | Name | Capability | Service | API | Event | Data |
|--------|------|-----------|---------|-----|-------|------|
| DOM-022 | Governance | CAP-15 | SVC-022 | API-022 | EVT-022 | DC-022 |
| DOM-023 | Compliance & Assurance | CAP-16 | SVC-023 | API-023 | EVT-023 | DC-023 |
| DOM-024 | Security & Trust | CAP-17 | SVC-024 | API-024 | EVT-024 | DC-024 |
| DOM-025 | Policy & Decisioning | CAP-18 | SVC-025 | API-025 | EVT-025 | DC-025 |

### Platform (DOM-026..028)

| Domain | Name | Capability | Service | API | Event | Data |
|--------|------|-----------|---------|-----|-------|------|
| DOM-026 | Integration & Federation | CAP-12 | SVC-026 | API-026 | EVT-026 | DC-026 |
| DOM-027 | Registry & Discovery | CAP-19 | SVC-027 | API-027 | EVT-027 | DC-027 |
| DOM-028 | Experience Delivery | CAP-14 | SVC-028 | API-028/029/030 | — (terminal) | DC-028 |

---

## 2. Layer B — Platform Fabric Domains (runtime substrate)

Source of truth: `architecture/**` (design) + `packages/platform-runtime/src/**` (implementation).
These are the fabrics named in the PI construction authorizations (`AD-0016..0023`) and realized in code.

| Fabric Domain | PI | Design (architecture/) | Implementation (src/control or src/) | Status |
|---------------|----|-----------------------|--------------------------------------|--------|
| **Meta-Substrate / Kernel** | PI-2/3 | `architecture/platform/**` | `src/meta-core/**`, `bin/ucos-substrate.ts` | IMPLEMENTED |
| **Operations / Control** | PI-4 | `architecture/platform/**`, `architecture/governance/**` | `src/control/{operations,identity,policy,trust,readiness,governance}/**` | IMPLEMENTED |
| **Federation** | PI-5 | `architecture/federation/**`, `architecture/ecosystem/**` | `src/control/federation/**` | IMPLEMENTED |
| **Evolution / Autonomy** | PI-6 | `architecture/autonomy/**` | `src/control/evolution/**` | IMPLEMENTED |
| **Knowledge** | PI-7 | `architecture/**` | `src/control/knowledge/**` | IMPLEMENTED |
| **Ontology** | PI-8 | `architecture/ontology/**` | `src/control/ontology/**` | RATIFIED |
| **Memory** | PI-9 | `architecture/memory/**` | `src/control/memory/**` | RATIFIED |
| **Intelligence** | PI-10 | `architecture/intelligence/**` | (design-only) | DESIGN-ONLY |
| **Simulation** | PI-11 | `architecture/simulation/**` | (design-only, AD-0022 conditional) | DESIGN-ONLY |
| **Proof (Operational Proof Fabric)** | — | `architecture/proof/**` | `services/platform/operational-proof/**` | GENERATED |
| **Registry / Metadata / Configuration** | — | `architecture/services/**` | `src/{registry,metadata,configuration}-runtime/**`, `services/platform/registry`, `services/platform/config-metadata` | IMPLEMENTED |
| **Economy** | — | `architecture/economic/**` | (design-only) | DESIGN-ONLY |
| **Civilization** | — | `architecture/civilization/**`, `PHASE-R7-CIV-GOV-001` | (design-only) | DESIGN-ONLY |
| **Existential / Invariants** | — | `architecture/existential/**`, `UA-05` | (governance canon; INV-1..13 binding) | GOVERNANCE |

---

## 3. Canonical Domain Vocabulary (URNP program domains)

The URNP program spec named a domain vocabulary (Identity, Governance, Proof, Audit, Registry, Economy,
Memory, Knowledge, Intelligence, Operations, Certification, Security, Infrastructure). This maps onto the
two layers above as follows (for cross-artifact tagging):

| URNP domain tag | Maps to (Layer A) | Maps to (Layer B) |
|-----------------|-------------------|-------------------|
| Identity | DOM-017 | Control/identity |
| Governance | DOM-022 | Control/governance |
| Proof | (DOM-021 audit facet) | Operational Proof Fabric |
| Audit | DOM-021 / DOM-023 | per-fabric audit modules; `AUDIT-UNIV-001` |
| Registry | DOM-027 | registry-runtime |
| Economy | (DOM-002/008 commercial facet) | Economy fabric (design) |
| Memory | — | Memory fabric (PI-9) |
| Knowledge | DOM-020 (insight) | Knowledge fabric (PI-7) |
| Intelligence | DOM-020 | Intelligence fabric (PI-10, design) |
| Operations | DOM-019/DOM-021 | Operations/control fabric (PI-4) |
| Certification | DOM-023 | `OP-CERT-001`, ratification determinations |
| Security | DOM-024 | Control/trust; `security/bootstrap/**` |
| Infrastructure | — | `infra/**` |
| Ontology | — | Ontology fabric (PI-8) |
| Federation | DOM-026 | Federation fabric (PI-5) |
| Evolution | — | Evolution fabric (PI-6) |
| Simulation | — | Simulation fabric (PI-11, design) |
| Civilization | — | Civilization fabric (design) |
| Experience | DOM-028 | (frontend empty by design) |

---

## 4. Artifact → Domain Assignment Rules

Every artifact maps to a **primary domain** by the following precedence:
1. **Explicit domain anchor** in the artifact header (`DOM-0xx`, fabric name).
2. **Contract/service ID** (SVC/API/EVT/DC-0xx → its DOM per §1).
3. **Directory location** (`architecture/memory/**`→Memory; `src/control/federation/**`→Federation; `infra/**`→Infrastructure).
4. **Prefix family** (`MEM-*`→Memory; `ONTO-*`→Ontology; `PI5-*`→Federation; `PI6-*`→Evolution; `PI7-*`→Knowledge; `INT-*`/`INTEL-*`/`IP-011`→Intelligence).
5. **Governance fallback** (authority/decision/gate/phase-report artifacts without a domain anchor → Governance).

Full artifact→domain assignment is materialized in `registry/DOMAIN-REGISTRY.md` (Phase 6).

---

## 5. Domain Relationship Summary

```
Experience (DOM-028) ──BFF──> Core Commerce (DOM-001..011)
Core Commerce ──events──> Observability (DOM-021) ──> Intelligence (DOM-020)
All domains ──governed-by──> Governance (DOM-022) ──> Compliance (DOM-023)
All domains ──access via──> Identity (DOM-017) + Policy (DOM-025) + Security (DOM-024)
All domains ──config via──> Configuration & Metadata (DOM-018)
All domains ──registered in──> Registry & Discovery (DOM-027)

Platform fabrics (Layer B) provide the runtime substrate that HOSTS Layer A:
  Meta-Core Kernel → Control fabrics (Ops/Identity/Policy/Trust/Governance)
    → Federation / Evolution / Knowledge / Ontology / Memory
    → Registry / Metadata / Configuration runtimes
```

## 6. Totals

| Layer | Domains |
|-------|--------:|
| A — Business bounded contexts (DOM-001..028) | 28 |
| B — Platform fabric domains | 14 |
| URNP domain tags | 19 |

## 7. Traceability
- **Sources:** `UCOS-DOM-ARCH-001`, `UCOS-DOMAIN-CATALOG`, `UCOS-CONTRACT-CAT-001`, `AD-0016..0023`, `src/control/**`.
- **Feeds:** `registry/DOMAIN-REGISTRY.md`, `CANONICAL-OWNERSHIP.md` (Phase 5), RTM (Phase 7).
- **Owner:** URNP (subordinate to Domain Architecture / Authority Board). Domain definitions remain owned by `UCOS-DOM-ARCH-001`.

**END `URNP-DOM-001` — Domain Map (28 business + 14 fabric domains; every artifact mappable).**
