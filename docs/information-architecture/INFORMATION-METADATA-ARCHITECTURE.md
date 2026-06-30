# UCOS — Information / Metadata Architecture

**Artifact ID:** UCOS-INF-ARCH-001
**Layer:** ARCHITECTURE (Information / Metadata)
**Status:** CREATED (Phase 5.0 generation; ratification deferred to Phase 5.1)
**Version:** 1.0.0
**Phase:** Phase 5.0 — Information / Metadata Architecture Generation
**Date:** 2026-06-29
**Owner:** Chief Information Architect
**Approver:** Authority Board (information/metadata-architecture ratification deferred to Phase 5.1)

> **Supremacy notice.** This Information / Metadata Architecture is subordinate to the Authority
> Layer (`AUTH-001..012`), the ratified Constitution (`UCOS-CONST-001`), the ratified Enterprise
> Architecture (`UCOS-ENT-ARCH-001`), the ratified Domain Architecture (`UCOS-DOM-ARCH-001`), and
> the ratified Capability Architecture (`UCOS-CAP-ARCH-001`). In any conflict, **Authority prevails**,
> then the Constitution, then the Enterprise Architecture, then the Domain Architecture, then the
> Capability Architecture (AUTH-009 §6.2). This artifact establishes the conceptual **Information**
> and **Metadata** architecture of UCOS. It does **NOT** create, remove, merge, split, or re-own any
> domain or capability, and it does **NOT** design data.

> **Conceptual-only declaration.** This document defines **no** logical data models, physical data
> models, canonical data models, entities, attributes, fields, columns, tables, keys, relationships
> between tables, database designs, storage models, schemas, JSON/XML structures, services,
> microservices, applications, APIs, endpoints, commands, queries, events, topics, queues, workflows,
> processes, infrastructure, technology, vendor, cloud, language, framework, deployment, code,
> pseudo-code, or implementation guidance. **Information is not Data. Metadata is not Data.**
> Information Architecture precedes Data Architecture; the Data Architecture (Prompt 05) will be
> *derived* from this baseline in a later phase. This artifact remains entirely within Information &
> Metadata Architecture.

---

## Section I — Information Architecture Overview

### I.1 Purpose

The UCOS Information / Metadata Architecture establishes the **authoritative conceptual map of the
meaning and context of the platform's information**, independent of how it is later modeled, stored,
exchanged, or implemented. It answers two questions that must be settled *before* any data design:

- **Information** — *what does the platform mean by the things it knows?* (semantics)
- **Metadata** — *what does the platform know about what it knows?* (context, governance, lineage)

This phase converts the ratified Domain (`UCOS-DOM-ARCH-001`) and Capability (`UCOS-CAP-ARCH-001`)
baselines into a governed **information landscape** of conceptual **Information Classes** and a
governed **metadata landscape** of conceptual **Metadata Classes**, each with explicit ownership,
stewardship, classification, relationships, governance, lifecycle, and traceability — all conceptual.

### I.2 Information Is Not Data

| Concept | Defines | Owned by this phase | Owned later |
|---------|---------|:-------------------:|-------------|
| **Information** | Meaning — the business semantics of what the platform knows | ✅ | — |
| **Metadata** | Context — what is known *about* information (classification, ownership, lineage) | ✅ | — |
| **Data** | Representation — logical/physical models, schemas, storage | ❌ | Prompt 05 (Data Architecture) |
| **Contract** | Exchange — APIs/events that move information | ❌ | Prompt 07 |
| **Implementation** | Realization — services, stores, code | ❌ | Prompts 08–10 |

Information Architecture **precedes** Data Architecture. Nothing in this document is a data model.

### I.3 Scope

**In scope**
- The 17 conceptual **Information Classes** (`IC-01..IC-17`) and their 5 Information Groups.
- The 13 conceptual **Metadata Classes** (`MC-01..MC-13`) and their Metadata Groups.
- Information/metadata taxonomy, classification, ownership, stewardship, relationships, governance,
  lifecycle, traceability, security classification, and reference architecture — all conceptual.

**Out of scope (deferred to later phases)**
- Logical/physical/canonical data models, schemas, entities, attributes, keys (Prompt 05).
- Metadata/configuration *persistence* and storage of metadata at rest (Prompts 05/08).
- Experiences (Prompt 06), service & API contracts (Prompt 07), platform/technology (Prompt 08),
  security controls (Prompt 09), implementation (Prompt 10).

### I.4 Inputs (authoritative, immutable)

| Input | Artifact | Role |
|-------|----------|------|
| Authority Layer | `AUTH-001..012` | Supreme governing canon |
| Vision | `AUTH-001` (G1–G6) | Strategic goal anchors |
| Principles | `AUTH-003` (P1–P10, IP-01..IP-17) | Binding principle anchors |
| Architecture Canon | `AUTH-004` | Conceptual-layering discipline |
| Domain Canon | `AUTH-005` | Single-owner / boundary rules |
| Capability Canon | `AUTH-006` v1.1.0 | Capability governance |
| Data Canon | `AUTH-007` | Ownership, classification, lifecycle, migration-only rules |
| Security Canon | `AUTH-008` | Non-waivable S1/S3/S4; classification → controls |
| Governance Canon | `AUTH-009` | Governance spine + approval-by-exception |
| Traceability Canon | `AUTH-010` | No-orphan / lineage rules |
| Glossary Canon | `AUTH-011` | Canonical terms (incl. "Party" Shared Language) |
| Constitution | `UCOS-CONST-001` | Constitutional contract |
| Enterprise Architecture | `UCOS-ENT-ARCH-001` | §VI Information layer; §IV layers L0–L9 |
| Domain Architecture | `UCOS-DOM-ARCH-001` | 28 bounded contexts; ownership map (§VII.2) |
| Capability Architecture | `UCOS-CAP-ARCH-001` | 19 capabilities across 3 classes |
| Decision AD-0003 | `AUTH-012` | Data-governance / canon ratification |
| Decision AD-0012 | `AUTH-012` | Platform Governance Capability Expansion (CAP-15..19) |
| Decision AD-0013 / TO-001 | `AUTH-012`, `UCOS-TO-001` | OBS-1 Policy anchor (IP-05) correction |

### I.5 Information Baseline (immutable for this phase)

| Metric | Value |
|--------|------:|
| Information Classes | 17 |
| Information Groups | 5 |
| Metadata Classes | 13 |
| Realizing Domains | 28 |
| Realizing Capabilities | 19 |
| Orphan Information Classes | 0 |
| Orphan Metadata Classes | 0 |
| Ownership Conflicts | 0 |
| Open (blocking) Findings | 0 |

---

## Section II — Information Principles

The following binding principles, inherited from Authority and the Constitution, govern this
architecture. Each Information Class and Metadata Class conforms to all of them.

| # | Principle | Source | Application to Information |
|---|-----------|--------|----------------------------|
| IP-A | **Information ≠ Data** | AUTH-004, AUTH-007 | Meaning is modeled before representation; no data leakage. |
| IP-B | **Single Information Owner** | AUTH-005 §6, AUTH-007 §6.1 | Every Information Class has exactly one accountable owning context; no shared mutable ownership. |
| IP-C | **Boundary-Respecting Reference** | AUTH-005 §6.4 | Cross-context information is referenced via declared seams/translation, never co-owned. |
| IP-D | **Classification Is Mandatory** | AUTH-007 §6.3, AUTH-008 | Every Information Class carries a sensitivity classification feeding security. |
| IP-E | **Governed Lifecycle** | AUTH-007 §6.4 | Retention, archival, and versioning are defined conceptually per class. |
| IP-F | **Migration-Only Evolution (IP-14)** | AUTH-003 IP-14, AUTH-007 §6.5 | When derived to data, change occurs only via reversible, recorded migration. |
| IP-G | **Traceability-First (IP-08)** | AUTH-003 IP-08, AUTH-010 | Every class traces to Authority; no orphans precede acceptance. |
| IP-H | **Configuration-Driven Variability (P3/IP-04)** | AUTH-003, Const. Art. V | Cross-model variability is expressed as metadata, not branched meaning. |
| IP-I | **Policy-Driven Governance (IP-05)** | AUTH-003 IP-05 | Information governance is enacted through policy, not ad-hoc rules. |
| IP-J | **Universality (G1)** | AUTH-001 | One information model spans B2C/B2B/B2B2C/marketplace/subscription/hybrid without forks. |

---

## Section III — Information Landscape

### III.1 Landscape Summary

The UCOS information landscape is a governed set of **17 Information Classes** organized into **5
Information Groups**. The groups mirror the platform's value flow: *who* participates (Identity &
Party), *what* is offered (Commercial), *what is transacted* (Transactional), *how the platform is
governed* (Governance), and *what underpins the platform* (Platform). Every concept the platform
knows is allocated to exactly one Information Class; no in-scope concept is unallocated.

### III.2 Information Groups

| Group | Definition | Information Classes | Count |
|-------|------------|---------------------|------:|
| **IG-1 Identity & Party** | Who participates and how they are recognized | IC-01, IC-02 | 2 |
| **IG-2 Commercial** | What is offered and on what terms | IC-03, IC-04, IC-05 | 3 |
| **IG-3 Transactional** | What is committed, paid, fulfilled, and accounted | IC-06, IC-07, IC-08, IC-09 | 4 |
| **IG-4 Governance** | How the platform is constrained, verified, and protected | IC-10, IC-11, IC-12, IC-13 | 4 |
| **IG-5 Platform** | What registers, orchestrates, reasons over, and underpins the platform | IC-14, IC-15, IC-16, IC-17 | 4 |

### III.3 Information Landscape Register

| IC ID | Information Class | Group | Conceptual meaning (semantics only) | Primary Owning Domain |
|-------|-------------------|-------|--------------------------------------|------------------------|
| IC-01 | Identity Information | IG-1 | Recognition of principals — accounts, credentials, authorization context, tenancy | UCOS-DOM-017 Identity & Access |
| IC-02 | Party Information | IG-1 | Meaning of parties (customers, suppliers, sellers, organizations) and their relationships | UCOS-DOM-011 Customer & CRM (Shared Language) |
| IC-03 | Product Information | IG-2 | Meaning of sellable things — definitions, attributes, classifications | UCOS-DOM-001 Catalog |
| IC-04 | Catalog Information | IG-2 | Organized, presentable arrangement of products — categories, assortments, merchandising context | UCOS-DOM-001 Catalog |
| IC-05 | Commercial Information | IG-2 | Terms of exchange — prices, promotions, quotes, subscription terms | UCOS-DOM-002 Pricing & Promotions |
| IC-06 | Order Information | IG-3 | Expressed and committed purchase intent — carts, orders, lifecycle state | UCOS-DOM-005 Order Management |
| IC-07 | Transaction Information | IG-3 | Monetary exchange events — authorizations, captures, refunds | UCOS-DOM-006 Payments |
| IC-08 | Fulfillment Information | IG-3 | Delivery of value and its reversal — shipments, deliveries, returns | UCOS-DOM-009 Fulfillment & Returns |
| IC-09 | Financial Information | IG-3 | Accounting meaning of value — billing, invoices, settlement, reconciliation | UCOS-DOM-007 Billing / UCOS-DOM-008 Settlement |
| IC-10 | Compliance Information | IG-4 | Evidence and state of regulatory/standards conformance | UCOS-DOM-023 Compliance |
| IC-11 | Policy Information | IG-4 | Declared rules that govern behavior — policy definitions and decisions | UCOS-DOM-025 Policy |
| IC-12 | Governance Information | IG-4 | The governance system's own knowledge — decisions, gates, authority state | UCOS-DOM-022 Governance |
| IC-13 | Security Information | IG-4 | Protection-relevant meaning — trust, risk, security posture (conceptual) | UCOS-DOM-024 Security |
| IC-14 | Registry Information | IG-5 | Authoritative knowledge of what exists — artifacts, services, capability/domain registers | UCOS-DOM-027 Registry |
| IC-15 | Workflow Information | IG-5 | Meaning of orchestrated process — process state, steps, coordination | UCOS-DOM-019 Workflow & Orchestration |
| IC-16 | Intelligence Information | IG-5 | Derived meaning — insights, analytics, metrics, signals | UCOS-DOM-020 Intelligence & Insight |
| IC-17 | Platform Information | IG-5 | Foundational platform meaning — configuration, integration, observability, experience context | UCOS-DOM-018 Configuration & Metadata |

### III.4 Domain Coverage (28/28 — no domain unmapped)

Information ownership inherits from domain ownership (`UCOS-DOM-ARCH-001` §VII.2). Every ratified
domain contributes to or stewards at least one Information Class:

| Domain | Contributing Information Class(es) |
|--------|-------------------------------------|
| UCOS-DOM-001 Catalog | IC-03, IC-04 |
| UCOS-DOM-002 Pricing & Promotions | IC-05 |
| UCOS-DOM-003 Inventory & Availability | IC-04 (availability context), IC-08 |
| UCOS-DOM-004 Cart & Checkout | IC-06 (pre-order) |
| UCOS-DOM-005 Order Management | IC-06 |
| UCOS-DOM-006 Payments | IC-07 |
| UCOS-DOM-007 Billing | IC-09 |
| UCOS-DOM-008 Settlement | IC-09 |
| UCOS-DOM-009 Fulfillment & Returns | IC-08 |
| UCOS-DOM-010 Subscriptions | IC-05 (recurring terms), IC-06 |
| UCOS-DOM-011 Customer & CRM | IC-02 |
| UCOS-DOM-012 Merchandising | IC-04 |
| UCOS-DOM-013 Supplier | IC-02 (supplier facet) |
| UCOS-DOM-014 Marketplace | IC-02 (seller facet), IC-05, IC-06 |
| UCOS-DOM-015 Communication | IC-02 (contact/consent context), IC-17 |
| UCOS-DOM-016 Document | IC-09 (documentary), IC-10 (evidentiary) |
| UCOS-DOM-017 Identity & Access | IC-01 |
| UCOS-DOM-018 Configuration & Metadata | IC-17 (primary metadata domain) |
| UCOS-DOM-019 Workflow & Orchestration | IC-15 |
| UCOS-DOM-020 Intelligence & Insight | IC-16 |
| UCOS-DOM-021 Observability | IC-17 (observability context), IC-16 |
| UCOS-DOM-022 Governance | IC-12 |
| UCOS-DOM-023 Compliance | IC-10 |
| UCOS-DOM-024 Security | IC-13 |
| UCOS-DOM-025 Policy | IC-11 |
| UCOS-DOM-026 Integration & Federation | IC-17 (integration context) |
| UCOS-DOM-027 Registry | IC-14 |
| UCOS-DOM-028 Experience Delivery | IC-17 (experience context) |

**Coverage: 28/28 domains, 17/17 information classes — 0 orphans.**

---

## Section IV — Information Taxonomy

### IV.1 Taxonomy Definition

A UCOS **Information Class** is a conceptual grouping of related meaning, independent of
implementation. Information Classes are classified by their **semantic role** in the platform's value
flow (their Information Group), not by representation, storage, or realizing technology.

### IV.2 Taxonomy Dimensions

Each Information Class is described along conceptual dimensions only:

| Dimension | Meaning | Example values (conceptual) |
|-----------|---------|------------------------------|
| **Group** | Position in the value flow | IG-1 … IG-5 |
| **Owning context** | Single accountable domain | UCOS-DOM-001..028 |
| **Sensitivity class** | Protection level (→ AUTH-008) | Public / Internal / Confidential / Restricted-PII / Restricted-Financial |
| **Criticality** | Importance to platform integrity | Foundational / High / Standard |
| **Sharing mode** | How other contexts may know it | Owned / Referenced / Shared-Language |
| **Lifecycle profile** | Retention/archival expectation | Transient / Operational / Durable / Evidentiary |

### IV.3 Taxonomy Rules

1. Every Information Class belongs to exactly one Information Group.
2. Every Information Class has exactly one owning domain (single-owner mandate, AUTH-007 §6.1).
3. Cross-group meaning is **referenced**, never duplicated as a competing owned class.
4. "Party" (IC-02) is **Shared Language** (canonical glossary term, AUTH-011; DF-002): no shared
   mutable ownership; principal identity is referenced from Identity & Access (UCOS-DOM-017).
5. Taxonomy is conceptual; no class implies an entity, table, schema, or document structure.

---

## Section V — Information Classification Model

### V.1 Classification Intent

Classification establishes the **sensitivity and handling meaning** of each Information Class. Per
AUTH-007 §6.3, classification is **mandatory** and is the authoritative input to the Security Canon
(AUTH-008) for later control mapping. This phase assigns conceptual classes only; it does not define
controls (Prompt 09) or storage protections (Prompt 08).

### V.2 Sensitivity Classes (conceptual)

| Sensitivity Class | Meaning | Illustrative Information Classes |
|-------------------|---------|----------------------------------|
| **Public** | Freely shareable meaning | Portions of IC-03/IC-04 (public catalog) |
| **Internal** | Internal-only operational meaning | IC-04, IC-15, IC-17 |
| **Confidential** | Sensitive business meaning | IC-05, IC-11, IC-12, IC-16 |
| **Restricted-PII** | Personal/identity-bearing meaning | IC-01, IC-02 |
| **Restricted-Financial** | Monetary/regulated meaning | IC-07, IC-09 |
| **Restricted-Security** | Protection-critical meaning | IC-13 |
| **Regulated-Evidentiary** | Compliance/audit evidence meaning | IC-10 |

### V.3 Classification Rules

1. Every Information Class carries **exactly one** primary sensitivity class (an unclassified class
   is a blocking gap, AUTH-007 §7 / S4).
2. A class may carry secondary regulatory tags (e.g., PII + Financial) where meaning overlaps.
3. The **highest** applicable sensitivity governs handling expectations (conservative dominance).
4. Classification is an input to AUTH-008 — this document does not author controls.

---

## Section VI — Information Ownership Model

### VI.1 Ownership Principle

Per AUTH-005 §6 and AUTH-007 §6.1, **every Information Class has exactly one accountable owning
bounded context.** Ownership is *accountability for meaning*, not custody of data. There is no shared
mutable ownership. Ownership is inherited unchanged from the ratified Domain Architecture
(`UCOS-DOM-ARCH-001` §VII.2); this phase introduces no new owners and re-owns nothing.

### VI.2 Ownership Register

| IC ID | Information Class | Accountable Owner (Domain) | Realizing Capability | Sharing Mode |
|-------|-------------------|-----------------------------|----------------------|--------------|
| IC-01 | Identity Information | UCOS-DOM-017 Identity & Access | CAP-09 | Referenced |
| IC-02 | Party Information | UCOS-DOM-011 Customer & CRM | CAP-08 | Shared-Language |
| IC-03 | Product Information | UCOS-DOM-001 Catalog | CAP-01 | Referenced |
| IC-04 | Catalog Information | UCOS-DOM-001 Catalog | CAP-01 | Referenced |
| IC-05 | Commercial Information | UCOS-DOM-002 Pricing & Promotions | CAP-02 | Referenced |
| IC-06 | Order Information | UCOS-DOM-005 Order Management | CAP-05 | Owned |
| IC-07 | Transaction Information | UCOS-DOM-006 Payments | CAP-06 | Owned |
| IC-08 | Fulfillment Information | UCOS-DOM-009 Fulfillment & Returns | CAP-07 | Owned |
| IC-09 | Financial Information | UCOS-DOM-007 Billing / UCOS-DOM-008 Settlement | CAP-06 | Owned (per-facet) |
| IC-10 | Compliance Information | UCOS-DOM-023 Compliance | CAP-16 | Owned |
| IC-11 | Policy Information | UCOS-DOM-025 Policy | CAP-18 | Owned |
| IC-12 | Governance Information | UCOS-DOM-022 Governance | CAP-15 | Owned |
| IC-13 | Security Information | UCOS-DOM-024 Security | CAP-17 | Owned |
| IC-14 | Registry Information | UCOS-DOM-027 Registry | CAP-19 | Referenced |
| IC-15 | Workflow Information | UCOS-DOM-019 Workflow & Orchestration | CAP-05 (orchestration facet) | Owned |
| IC-16 | Intelligence Information | UCOS-DOM-020 Intelligence & Insight | CAP-13 | Derived/Referenced |
| IC-17 | Platform Information | UCOS-DOM-018 Configuration & Metadata | CAP-10 | Referenced |

> **Multi-facet single-owner.** IC-09 Financial Information spans Billing (UCOS-DOM-007) and
> Settlement (UCOS-DOM-008); each *facet* has a single owner — there is no co-owned mutable model.
> This mirrors the ratified CAP-06 multi-facet single-owner-per-facet pattern.

### VI.3 Ownership Rules

1. No Information Class is co-owned mutably (single-owner mandate; multi-owner = non-waivable
   consistency violation, AUTH-007 §7).
2. Owners are accountable for meaning, classification, lifecycle, and governance of their class.
3. Cross-context use is by **reference/translation only** (anti-corruption seams, AUTH-005 §6.4).
4. "Party" (IC-02) follows Shared-Language rules — no domain owns a shared mutable party model.

---

## Section VII — Information Stewardship Model

### VII.1 Stewardship Roles (conceptual)

Ownership is *accountability*; stewardship is *operational care*. Roles are conceptual governance
responsibilities, not org charts or personas.

| Role | Holder | Responsibility |
|------|--------|----------------|
| **Information Owner** | Accountable owning domain (VI.2) | Accountable for meaning, classification, lifecycle, governance conformance |
| **Information Steward** | Owning-domain governance function | Day-to-day curation of meaning, quality, and consistency of the class |
| **Information Custodian** | Platform contexts (Config/Integration/Observability) | Conceptual custody where information transits or is observed — never re-ownership |
| **Governance Oversight** | UCOS-DOM-022 Governance / CAP-15 | Verifies ownership/stewardship integrity across all classes |
| **Security Oversight** | UCOS-DOM-024 Security / CAP-17 | Verifies classification is present and consistent (→ AUTH-008) |
| **Compliance Oversight** | UCOS-DOM-023 Compliance / CAP-16 | Verifies regulated classes carry evidentiary lifecycle |

### VII.2 Stewardship Rules

1. Every Information Class has exactly one Owner and at least one Steward.
2. Custodianship never confers ownership; custodians may not redefine meaning.
3. Oversight roles (Governance/Security/Compliance) audit but do not own commerce information.
4. Stewardship decisions affecting meaning across contexts are Approval-Required (AUTH-009).

---

## Section VIII — Information Relationship Model

### VIII.1 Relationship Intent

Information Classes relate **semantically** — by reference, derivation, or aggregation of meaning.
These are conceptual associations only. They are **not** data relationships, foreign keys, joins,
or schema links, and they will be realized later exclusively through declared contracts/projections
(Prompt 07), never through shared mutable models.

### VIII.2 Conceptual Relationship Types

| Type | Meaning | Example (conceptual) |
|------|---------|----------------------|
| **References** | One class points to the meaning of another, owned elsewhere | IC-06 Order references IC-02 Party, IC-03 Product, IC-05 Commercial |
| **Derives-from** | One class's meaning is computed/abstracted from another | IC-09 Financial derives-from IC-07 Transaction; IC-16 Intelligence derives-from IC-06/IC-07/IC-08 |
| **Governs** | One class constrains the handling of others | IC-11 Policy governs all; IC-13 Security governs handling of Restricted classes |
| **Describes** | One class supplies context about another | IC-14 Registry describes IC-12 Governance and IC-17 Platform artifacts |
| **Orchestrates** | One class coordinates the progression of others | IC-15 Workflow orchestrates IC-06 → IC-07 → IC-08 progression |

### VIII.3 Key Conceptual Relationships

| Source | Relationship | Target | Realization (later phase) |
|--------|--------------|--------|----------------------------|
| IC-06 Order | References | IC-01/IC-02, IC-03/IC-04, IC-05 | Contract/projection (Prompt 07) |
| IC-07 Transaction | References / Confirms | IC-06 Order | Contract/projection |
| IC-08 Fulfillment | References | IC-06 Order, IC-03 Product | Contract/projection |
| IC-09 Financial | Derives-from | IC-07 Transaction, IC-06 Order | Contract/projection |
| IC-16 Intelligence | Derives-from | IC-03..IC-09 | Read-only projection |
| IC-11 Policy | Governs | IC-01..IC-17 | Policy evaluation seam (CAP-18) |
| IC-13 Security | Governs | All Restricted classes | Control mapping (AUTH-008) |
| IC-14 Registry | Describes | IC-12, IC-17, all artifacts | Registry reference (CAP-19) |
| IC-15 Workflow | Orchestrates | IC-06, IC-07, IC-08 | Orchestration seam |

### VIII.4 Relationship Rules

1. Relationships express **meaning**, not storage or message structure.
2. No relationship implies a shared mutable model across contexts (AUTH-005 §6.4).
3. Every cross-context relationship realizes later as a **declared seam** (contract/projection).
4. Relationship cycles in *governance* meaning are prohibited (acyclic governance, AUTH-009).

---

## Section IX — Information Governance Model

### IX.1 Governance Spine

Information governance is enacted through the Authority governance spine (AUTH-009) and is
policy-driven (IP-05). The Governance domain (UCOS-DOM-022 / CAP-15) holds oversight; the Policy
domain (UCOS-DOM-025 / CAP-18) supplies governing policy; Compliance (UCOS-DOM-023 / CAP-16) and
Security (UCOS-DOM-024 / CAP-17) provide assurance and protection oversight.

### IX.2 Governance Responsibilities

| Concern | Governing Authority | Oversight Domain/Capability |
|---------|---------------------|------------------------------|
| Ownership integrity | AUTH-005, AUTH-007 §6.1 | UCOS-DOM-022 / CAP-15 |
| Classification integrity | AUTH-007 §6.3, AUTH-008 | UCOS-DOM-024 / CAP-17 |
| Lifecycle integrity | AUTH-007 §6.4 | UCOS-DOM-022 / CAP-15 |
| Policy conformance | AUTH-009, IP-05 | UCOS-DOM-025 / CAP-18 |
| Compliance/evidentiary | AUTH-008, AUTH-009 | UCOS-DOM-023 / CAP-16 |
| Traceability integrity | AUTH-010 | UCOS-DOM-027 / CAP-19 |

### IX.3 Governance Rules

1. Information governance changes (ownership, classification taxonomy, lifecycle policy) are
   **Approval-Required Operations** (AUTH-007 §8, AUTH-009).
2. Recording classifications, stewardship assignments, and lineage links are **Trusted Operations**.
3. Non-waivable security controls (S1/S3/S4) are preserved as governing constraints (AUTH-008).
4. Governance of information is acyclic — no class governs a class that governs it.

---

## Section X — Information Lifecycle Model

### X.1 Lifecycle Intent

The lifecycle describes the **conceptual states of meaning** an Information Class passes through.
It is not a state machine, workflow, or storage lifecycle. Retention/archival meaning is defined per
AUTH-007 §6.4; when later derived to data, change is migration-only (IP-14, AUTH-007 §6.5).

### X.2 Conceptual Lifecycle States

| State | Meaning |
|-------|---------|
| **Conceived** | The meaning is defined/recognized as relevant to the platform |
| **Captured** | An instance of the meaning enters the platform's knowledge |
| **Active** | The meaning is in current use and authoritative |
| **Referenced** | The meaning is consumed by other contexts via seams |
| **Archived** | The meaning is retained for evidentiary/historical purposes |
| **Retired** | The meaning is withdrawn per retention policy (recorded, reversible) |

### X.3 Lifecycle Profiles by Information Class

| Profile | Meaning | Information Classes |
|---------|---------|---------------------|
| **Transient** | Short-lived operational meaning | IC-06 (cart/pre-order facet), IC-15 |
| **Operational** | Active business meaning | IC-03, IC-04, IC-05, IC-06, IC-08, IC-17 |
| **Durable** | Long-retained authoritative meaning | IC-01, IC-02, IC-07, IC-09, IC-14 |
| **Evidentiary** | Retained for audit/regulatory proof | IC-10, IC-11, IC-12, IC-13, IC-16 |

### X.4 Lifecycle Rules

1. Every Information Class declares a lifecycle profile (retention/archival meaning).
2. Retirement is recorded and reversible in meaning; destructive in-place loss is prohibited.
3. Evidentiary classes may not be retired below their regulatory retention horizon.
4. Lifecycle realization (storage TTL, migrations) is deferred to Prompts 05/08.

---

## Section XI — Information Traceability Model

### XI.1 Traceability Intent

Per AUTH-010, every Information Class MUST trace upstream to Authority and downstream to its
realizing domain and capability. Traceability precedes acceptance (IP-08). The full per-class matrix
is maintained in the companion `INFORMATION-TRACEABILITY-MATRIX.md` (`UCOS-INF-TRACE-001`).

### XI.2 Traceability Axes (per Information Class)

1. **Authority** — `AUTH-*` governing canon (incl. AUTH-007 Data Canon).
2. **Constitution** — `UCOS-CONST-001` governing Part(s).
3. **Enterprise Architecture** — `UCOS-ENT-ARCH-001` §VI Information layer.
4. **Domain Architecture** — owning bounded context (`UCOS-DOM-001..028`).
5. **Capability Architecture** — realizing capability (`CAP-01..19`).
6. **Data Canon** — `AUTH-007` governance rule(s) the class will later honor.
7. **Decision Records** — `AUTH-012` (AD-0003 / AD-0012 / AD-0013) where applicable.

### XI.3 Traceability Rules

1. **No orphans** — every Information Class has ≥1 upstream Authority link (AUTH-010 §6.5).
2. **No dangling realization** — every class names its owning domain and realizing capability.
3. **Bidirectional integrity** — domain/capability artifacts list the classes they realize.
4. **Registry authority** — links are recorded in `CTX-REG-001`.

**Result: 17/17 Information Classes fully traced; 0 orphans, 0 gaps** (see `UCOS-INF-TRACE-001`).

---

## Section XII — Information Security Classification

### XII.1 Intent

This section restates the security-relevant classification of each Information Class as the
authoritative input to AUTH-008 (Security Canon → Prompt 09 controls). It assigns meaning only; it
defines no controls, encryption, masking, access models, or infrastructure.

### XII.2 Security Classification Register

| IC ID | Information Class | Primary Sensitivity | Regulatory Tags (conceptual) | Non-waivable Anchor |
|-------|-------------------|---------------------|------------------------------|---------------------|
| IC-01 | Identity Information | Restricted-PII | PII, Authn/Authz context | S1, S3, S4 |
| IC-02 | Party Information | Restricted-PII | PII, Consent | S4 |
| IC-03 | Product Information | Internal (Public subset) | — | S4 |
| IC-04 | Catalog Information | Internal (Public subset) | — | S4 |
| IC-05 | Commercial Information | Confidential | Competitive-sensitive | S4 |
| IC-06 | Order Information | Confidential | Contains PII references | S4 |
| IC-07 | Transaction Information | Restricted-Financial | Financial, payment-regulated | S1, S4 |
| IC-08 | Fulfillment Information | Confidential | PII (delivery) references | S4 |
| IC-09 | Financial Information | Restricted-Financial | Financial, tax/regulatory | S1, S4 |
| IC-10 | Compliance Information | Regulated-Evidentiary | Audit, regulatory | S3, S4 |
| IC-11 | Policy Information | Confidential | Governance-sensitive | S3, S4 |
| IC-12 | Governance Information | Confidential | Governance-sensitive | S3, S4 |
| IC-13 | Security Information | Restricted-Security | Security-critical | S1, S3, S4 |
| IC-14 | Registry Information | Internal | Integrity-critical | S3, S4 |
| IC-15 | Workflow Information | Internal | — | S4 |
| IC-16 | Intelligence Information | Confidential | May embed PII-derived signals | S4 |
| IC-17 | Platform Information | Internal | Config integrity-critical | S3, S4 |

> Non-waivable anchors (S1 confidentiality of regulated/financial data; S3 integrity/auditability;
> S4 mandatory classification) are preserved per AUTH-008; controls are authored later (Prompt 09).

### XII.3 Security Classification Rules

1. No Information Class is unclassified (unclassified = blocking gap, S4).
2. Restricted/Regulated classes carry their non-waivable anchors into AUTH-008 unchanged.
3. Derived classes (IC-16) inherit the **highest** sensitivity of their sources.

---

## Section XIII — Metadata Architecture Overview

### XIII.1 Purpose

The Metadata Architecture defines **what the platform knows about its information** — the governed
context that makes information trustworthy, discoverable, classifiable, and traceable. Metadata is
not data and not information content; it is the *governing context layer* that wraps every
Information Class and, more broadly, every governed artifact in the program.

### XIII.2 Metadata Is Not Data

Metadata Classes describe classification, ownership, governance, lineage, lifecycle, policy,
security, compliance, traceability, registry, capability, domain, and information context. They are
conceptual. They define no schemas, attributes, tag stores, or catalogs-as-implemented — those are
derived later (Prompts 04/05/08).

### XIII.3 Metadata Baseline

| Metric | Value |
|--------|------:|
| Metadata Classes | 13 |
| Metadata Groups | 5 |
| Applies-to | All 17 Information Classes + all governed artifacts |
| Orphan Metadata Classes | 0 |

---

## Section XIV — Metadata Taxonomy

### XIV.1 Metadata Groups

| Group | Definition | Metadata Classes | Count |
|-------|------------|------------------|------:|
| **MG-1 Descriptive/Structural** | What information *is* and means | MC-01, MC-13 | 2 |
| **MG-2 Stewardship** | Who is accountable for it | MC-02, MC-11, MC-12 | 3 |
| **MG-3 Governance & Control** | How it is governed and constrained | MC-03, MC-06, MC-08 | 3 |
| **MG-4 Protection** | How it must be protected | MC-07 | 1 |
| **MG-5 Lineage & Lifecycle** | Where it comes from and how it evolves | MC-04, MC-05, MC-09, MC-10 | 4 |

### XIV.2 Metadata Class Register

| MC ID | Metadata Class | Group | Conceptual meaning (context only) |
|-------|----------------|-------|------------------------------------|
| MC-01 | Classification Metadata | MG-1 | Sensitivity, criticality, and category of information |
| MC-02 | Ownership Metadata | MG-2 | Accountable owner and stewardship assignment |
| MC-03 | Governance Metadata | MG-3 | Governance state, gates, approvals, authority anchors |
| MC-04 | Lineage Metadata | MG-5 | Origin, derivation, and provenance of meaning |
| MC-05 | Lifecycle Metadata | MG-5 | Lifecycle state, retention, archival, versioning context |
| MC-06 | Policy Metadata | MG-3 | Governing policies and their applicability |
| MC-07 | Security Metadata | MG-4 | Protection posture, trust, and control anchors (conceptual) |
| MC-08 | Compliance Metadata | MG-3 | Regulatory scope, obligations, and evidentiary state |
| MC-09 | Traceability Metadata | MG-5 | Upstream/downstream lineage links per AUTH-010 |
| MC-10 | Registry Metadata | MG-5 | Registration, identity, and discoverability context |
| MC-11 | Capability Metadata | MG-2 | Realizing-capability context (`CAP-01..19`) |
| MC-12 | Domain Metadata | MG-2 | Owning-domain context (`UCOS-DOM-001..028`) |
| MC-13 | Information Metadata | MG-1 | Information-class identity and semantic descriptors |

### XIV.3 Taxonomy Rules

1. Every Metadata Class belongs to exactly one Metadata Group.
2. Metadata Classes are cross-cutting — they apply to every Information Class and governed artifact.
3. Metadata is conceptual context; no class implies a tag schema, store, or catalog implementation.

---

## Section XV — Metadata Classification Model

### XV.1 Classification of Metadata Itself

Metadata also carries sensitivity. Most metadata is **Internal**; governance/security/compliance
metadata is **Confidential**; metadata that embeds protection posture is **Restricted-Security**.

| MC ID | Metadata Class | Sensitivity | Rationale |
|-------|----------------|-------------|-----------|
| MC-01 Classification | Confidential | Reveals what is sensitive |
| MC-02 Ownership | Internal | Accountability mapping |
| MC-03 Governance | Confidential | Governance state |
| MC-04 Lineage | Internal | Provenance |
| MC-05 Lifecycle | Internal | Retention context |
| MC-06 Policy | Confidential | Governing rules |
| MC-07 Security | Restricted-Security | Protection posture |
| MC-08 Compliance | Confidential | Regulatory state |
| MC-09 Traceability | Internal | Lineage links |
| MC-10 Registry | Internal | Discoverability |
| MC-11 Capability | Internal | Realization context |
| MC-12 Domain | Internal | Ownership context |
| MC-13 Information | Internal | Semantic descriptors |

### XV.2 Rules

1. Metadata sensitivity never undercuts the sensitivity of the information it describes.
2. Security Metadata (MC-07) is itself Restricted-Security and governed by AUTH-008.

---

## Section XVI — Metadata Ownership Model

### XVI.1 Ownership Principle

Each Metadata Class has a single accountable governing authority. Because metadata is cross-cutting,
ownership rests with the **Platform Governance** capabilities/domains rather than commerce contexts.

### XVI.2 Metadata Ownership Register

| MC ID | Metadata Class | Accountable Owner | Governing Authority |
|-------|----------------|-------------------|---------------------|
| MC-01 | Classification Metadata | UCOS-DOM-024 Security / CAP-17 | AUTH-007 §6.3, AUTH-008 |
| MC-02 | Ownership Metadata | UCOS-DOM-022 Governance / CAP-15 | AUTH-005 §6, AUTH-007 §6.1 |
| MC-03 | Governance Metadata | UCOS-DOM-022 Governance / CAP-15 | AUTH-009 |
| MC-04 | Lineage Metadata | UCOS-DOM-027 Registry / CAP-19 | AUTH-010 §6.4 |
| MC-05 | Lifecycle Metadata | UCOS-DOM-022 Governance / CAP-15 | AUTH-007 §6.4 |
| MC-06 | Policy Metadata | UCOS-DOM-025 Policy / CAP-18 | AUTH-009, IP-05 |
| MC-07 | Security Metadata | UCOS-DOM-024 Security / CAP-17 | AUTH-008 |
| MC-08 | Compliance Metadata | UCOS-DOM-023 Compliance / CAP-16 | AUTH-008, AUTH-009 |
| MC-09 | Traceability Metadata | UCOS-DOM-027 Registry / CAP-19 | AUTH-010 |
| MC-10 | Registry Metadata | UCOS-DOM-027 Registry / CAP-19 | AUTH-010, CTX-REG-001 |
| MC-11 | Capability Metadata | UCOS-DOM-022 Governance / CAP-15 | AUTH-006 |
| MC-12 | Domain Metadata | UCOS-DOM-022 Governance / CAP-15 | AUTH-005 |
| MC-13 | Information Metadata | UCOS-DOM-018 Configuration & Metadata / CAP-10 | AUTH-007, UCOS-INF-ARCH-001 |

### XVI.3 Rules

1. Every Metadata Class has exactly one accountable owner (no co-ownership).
2. Metadata ownership is held by Platform Governance/Platform contexts, never commerce contexts.
3. Owners are accountable for the integrity and consistency of their metadata across all classes.

---

## Section XVII — Metadata Stewardship Model

### XVII.1 Roles

| Role | Holder | Responsibility |
|------|--------|----------------|
| **Metadata Owner** | Accountable domain/capability (XVI.2) | Accountable for metadata integrity and rules |
| **Metadata Steward** | Owning-context governance function | Curates and maintains metadata quality |
| **Metadata Producer** | Every artifact owner | Declares metadata (classification, lineage, ownership) on creation |
| **Metadata Consumer** | Governance/Security/Compliance/Registry | Uses metadata to verify integrity and enable discovery |

### XVII.2 Rules

1. Every governed artifact **produces** mandatory metadata at creation (MC-02, MC-04/MC-09, MC-01).
2. Stewards may not alter the meaning metadata describes — only its accuracy/consistency.
3. Metadata production is a **Trusted Operation**; metadata *rule* changes are Approval-Required.

---

## Section XVIII — Metadata Governance Model

### XVIII.1 Governance

Metadata governance is anchored in AUTH-009 (governance spine), AUTH-010 (traceability), and
AUTH-007 (classification/lifecycle). The Governance domain holds oversight; Registry (CAP-19) is the
authoritative recording instrument (`CTX-REG-001`).

### XVIII.2 Rules

| Concern | Rule | Operation Class |
|---------|------|-----------------|
| Recording metadata (links, classifications) | Permitted continuously | Trusted (AUTH-010 §8) |
| Amending metadata taxonomy / classes | Requires Authority Board approval | Approval-Required (AUTH-007 §8, AUTH-010 §8) |
| Changing classification taxonomy | Requires approval; assess security impact | Approval-Required (AUTH-007 §8) |
| Breaking a bidirectional lineage link | Prohibited (blocking gap) | Non-waivable (AUTH-010 §7) |
| Metadata governance graph | Must remain acyclic | Non-waivable (AUTH-009) |

---

## Section XIX — Metadata Relationship Model

### XIX.1 Relationship Intent

Metadata Classes relate to **information** (they describe it) and to **each other** (they compose a
governing context). These are conceptual associations, not data joins.

### XIX.2 Conceptual Relationships

| Relationship | Meaning |
|--------------|---------|
| **Describes** | Every Metadata Class describes one or more Information Classes / artifacts |
| **Composes** | MC-01..MC-13 together compose the complete governing context of an artifact |
| **Depends-on** | MC-08 Compliance depends-on MC-01 Classification; MC-07 Security depends-on MC-01; MC-09 Traceability depends-on MC-10 Registry |
| **Enables** | MC-10 Registry enables discovery; MC-09 Traceability enables certification |

### XIX.3 Information ↔ Metadata Coverage

Every Information Class (IC-01..IC-17) is described by the **mandatory metadata set**:
MC-01 Classification, MC-02 Ownership, MC-04 Lineage, MC-05 Lifecycle, MC-09 Traceability, MC-11
Capability, MC-12 Domain, MC-13 Information — plus MC-07 Security and MC-08 Compliance for
Restricted/Regulated classes, and MC-06 Policy where policy applies. **Coverage: 17/17 classes carry
a complete metadata context; 0 information classes without metadata.**

### XIX.4 Rules

1. No Information Class exists without its mandatory metadata set (else blocking gap).
2. Metadata relationships are acyclic in governance meaning.
3. Relationships realize later as registry/contract context, never shared mutable models.

---

## Section XX — Metadata Lifecycle Model

### XX.1 Conceptual States

| State | Meaning |
|-------|---------|
| **Declared** | Metadata is asserted when an artifact/class is created |
| **Maintained** | Metadata is kept accurate as meaning evolves |
| **Verified** | Metadata integrity is audited (governance/traceability scans) |
| **Superseded** | Metadata is version-incremented; prior context preserved with links |
| **Retired** | Metadata is retired only with the artifact it describes (recorded) |

### XX.2 Rules

1. Metadata is declared at creation and maintained for the artifact's life (AUTH-010 §6.3).
2. Metadata evolves by version increment + decision record where governed (no silent overwrite).
3. Superseded metadata is never deleted; supersession links are preserved.

---

## Section XXI — Metadata Traceability Model

### XXI.1 Traceability Axes (per Metadata Class)

Per the prompt's traceability requirement, every Metadata Class traces to:

1. **Authority** — `AUTH-*` governing canon.
2. **Governance** — `AUTH-009` / Governance domain (UCOS-DOM-022, CAP-15).
3. **Traceability Canon** — `AUTH-010`.
4. **Information Architecture** — this artifact (`UCOS-INF-ARCH-001`) and the classes it describes.

The full per-class matrix is in `INFORMATION-TRACEABILITY-MATRIX.md` (`UCOS-INF-TRACE-001`).

### XXI.2 Rules

1. **No orphan Metadata Classes** — each traces to Authority + Governance + Traceability + Info Arch.
2. Metadata Classes are themselves registered in `CTX-REG-001` (registry authority).
3. Bidirectional integrity holds between metadata and the artifacts it describes.

**Result: 13/13 Metadata Classes fully traced; 0 orphans, 0 gaps.**

---

## Section XXII — Information–Metadata Reference Architecture

### XXII.1 Conceptual Layering

The Information & Metadata Architecture occupies the **Information layer** of the Enterprise
Architecture (`UCOS-ENT-ARCH-001` §VI), above Domain/Capability meaning and below Data:

```
Authority (AUTH-001..012)
  └─ Constitution (UCOS-CONST-001)
       └─ Enterprise Architecture (UCOS-ENT-ARCH-001)
            └─ Domain Architecture (28 contexts)  ──┐
            └─ Capability Architecture (19 caps) ───┤
                 └─ INFORMATION ARCHITECTURE  ◄─────┘  (this phase: meaning)
                      │  Information Classes IC-01..IC-17
                      │  wrapped by
                      └─ METADATA ARCHITECTURE         (this phase: context)
                           Metadata Classes MC-01..MC-13
                                └─ Data Architecture   (Prompt 05 — DERIVED LATER)
                                     └─ Contracts (07) → Services/Storage (08–10)
```

### XXII.2 Reference Pattern (conceptual)

Every governed unit of meaning in UCOS is an **Information Class instance wrapped by a complete
Metadata context**:

| Layer | Element | Source |
|-------|---------|--------|
| Meaning | Information Class (IC-01..IC-17) | This architecture §III–§XII |
| Context | Metadata set (MC-01..MC-13) | This architecture §XIII–§XXI |
| Owner | Single bounded context | `UCOS-DOM-ARCH-001` |
| Realization | Single/Set of capabilities | `UCOS-CAP-ARCH-001` |
| Derivation (later) | Data model | Prompt 05 |

### XXII.3 Reference Rules

1. No meaning exists without an owner, a classification, and a complete metadata context.
2. The Data Architecture (Prompt 05) is **derived** from this reference — never the reverse.
3. This reference architecture defines no storage, contract, or technology binding.

---

## Section XXIII — Governance Alignment Assessment

### XXIII.1 Alignment Findings

| Dimension | Authority | Result |
|-----------|-----------|:------:|
| Information ownership integrity | AUTH-005, AUTH-007 §6.1 | ✅ PASS (17/17 single-owner; IC-02 Shared-Language; IC-09 single-owner-per-facet) |
| Information accountability | AUTH-009 | ✅ PASS (owner named for every class) |
| Information stewardship | AUTH-009 | ✅ PASS (owner + ≥1 steward per class) |
| Metadata ownership integrity | AUTH-009, AUTH-010 | ✅ PASS (13/13 single-owner) |
| Metadata accountability | AUTH-009 | ✅ PASS |
| Metadata stewardship | AUTH-010 §6.3 | ✅ PASS (producer/steward/consumer defined) |
| Governance integrity | AUTH-009 | ✅ PASS (acyclic; approval-by-exception honored) |
| Traceability integrity | AUTH-010 | ✅ PASS (17/17 + 13/13; 0 orphans, 0 gaps) |
| Classification integrity | AUTH-007 §6.3, AUTH-008 | ✅ PASS (0 unclassified classes) |
| Lifecycle integrity | AUTH-007 §6.4 | ✅ PASS (profile per class) |

### XXIII.2 Conflicts

**Governance conflicts: 0. Ownership conflicts: 0. Approval-Required operations triggered: 0**
(generation introduced no taxonomy/ownership/classification *amendments* — it inherited the ratified
baselines unchanged).

### XXIII.3 Outstanding Governed Trusted Operation (carried, non-blocking)

The previously scheduled Trusted Operation **N-1** (author CAP-01..14 quantitative attributes under
Prompt 02, per AUTH-006 §6.3/§6.4) remains outstanding and is unaffected by this phase. It is not a
finding and does not block ratification.

---

## Section XXIV — Architecture Readiness Assessment

### XXIV.1 Readiness Scorecard

| Criterion | Status |
|-----------|:------:|
| Information Architecture generated (17 classes, 5 groups) | ✅ |
| Metadata Architecture generated (13 classes, 5 groups) | ✅ |
| All 24 required sections present | ✅ |
| All required Information Classes defined (17/17) | ✅ |
| All required Metadata Classes defined (13/13) | ✅ |
| Information ownership defined (17/17) | ✅ |
| Metadata ownership defined (13/13) | ✅ |
| Information governance defined | ✅ |
| Metadata governance defined | ✅ |
| Information classification defined (0 unclassified) | ✅ |
| Information traceability complete (7 axes) | ✅ |
| Metadata traceability complete (4 axes) | ✅ |
| Orphan Information Classes | 0 |
| Orphan Metadata Classes | 0 |
| Traceability gaps | 0 |
| Governance conflicts | 0 |
| Implementation leakage | NONE |

### XXIV.2 Compliance Summary

| Compliance | Verdict |
|------------|:-------:|
| Authority | PASS |
| Constitution | PASS |
| Enterprise Architecture | PASS |
| Domain Architecture | PASS |
| Capability Architecture | PASS |
| Data Canon | PASS |
| Governance | PASS |
| Traceability | PASS |
| Implementation Leakage | NONE |

### XXIV.3 Readiness Verdict

The Information / Metadata Architecture is **COMPLETE and COMPLIANT** as a Phase 5.0 generation
artifact. Status **CREATED**; independent validation & ratification are deferred to **Phase 5.1**.
This baseline is ready to govern the conceptual information/metadata foundation for Phases 5.1–12.0
and to be **derived** into the Data Architecture (Prompt 05) in a later phase. Generation lock for
downstream phases (data/experience/contracts/platform/security/code) remains intact.

---

## Traceability

- **Refines:** `AUTH-001..012` (esp. AUTH-004/005/006/007/008/009/010/011), `UCOS-CONST-001`,
  `UCOS-ENT-ARCH-001`, `UCOS-DOM-ARCH-001`, `UCOS-CAP-ARCH-001`, `CTX-CAP-001`, `CTX-DOM-001`,
  `AUTH-012` (AD-0003, AD-0012, AD-0013).
- **Refined by:** `UCOS-INF-TRACE-001`, `UCOS-INF-GOV-001`, `UCOS-INF-COMP-001`, `UCOS-INF-DONE-001`;
  Phase 5.1 validation; Prompt 05 (Data Architecture, derived).
- **Controls:** the conceptual information/metadata baseline for Phases 5.1–12.0.
