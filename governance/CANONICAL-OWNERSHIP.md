# UCOS — Canonical Ownership Model

| Field | Value |
|-------|-------|
| Artifact | **UCOS Canonical Ownership Model** |
| Artifact ID | `URNP-OWN-001` |
| Program | UCOS Repository Normalization Program (URNP) v1.0 |
| Phase | **Phase 5 — Canonical Ownership Model** |
| Mode | ANALYSIS & ORGANIZATION ONLY |
| Status | GENERATED |
| Date | 2026-07-02 |
| Parent | `URNP-DOM-001`, `URNP-DUP-001` |

> **Rule (binding).** **One concept. One owner.** Every major concept has exactly one canonical
> owning artifact. All other artifacts **reference** the canonical owner; they never redefine it.
> This model records the canonical owner for each concept, its authoritative artifact/location, the
> accountable body, and the referencing (non-owning) artifacts. Ownership assignments are derived
> from existing headers, canons (`AUTH-004..011`), and the contract catalog; nothing is invented.

---

## 1. Ownership Bodies (accountable roles)

| Body | Scope |
|------|-------|
| **Authority Board** | Vision, Constitution, Principles, decisions, canon, invariants |
| **Platform Governance** | Gates, registry, state ledger, governance zones, release |
| **Enterprise Architecture** | EA reference, ASR/NFR |
| **Domain Architecture** | Domain model DOM-001..028 |
| **Capability Architecture** | Capability model CAP-01..19 |
| **Data Architecture** | IC/CD/LD/PD data chain, MC-01..13, schemas |
| **Service & API Contract Architecture** | API/Event/Data contracts |
| **Experience Architecture** | Experience surfaces, EXP-CR-001..021 |
| **Security Architecture** | Security controls (Prompt 09), `security/**` |
| **Platform Engineering** | `platform-runtime`, services, `infra/**` |
| **Implementation Factory** | Construction programs, per-PI implementation |

---

## 2. Canonical Ownership — Governance & Authority Concepts

| Concept | Canonical Owner (artifact) | Body | Referencing (non-owning) |
|---------|---------------------------|------|--------------------------|
| **Vision** | `.claude/authority/AUTH-001-VISION.md` | Authority Board | `.claude/context/UCOS-VISION.md` (seed) |
| **Constitution** | `.claude/authority/AUTH-002-CONSTITUTION.md` + `docs/constitution/**` | Authority Board | `.claude/context/UCOS-CONSTITUTION.md` (SUPERSEDED) |
| **Principles** | `.claude/authority/AUTH-003-PRINCIPLES.md` | Authority Board | `.claude/context/UCOS-PRINCIPLES.md` (seed) |
| **Architecture Canon** | `.claude/authority/AUTH-004-ARCHITECTURE-CANON.md` | Authority Board | `architecture/**`, `docs/**` |
| **Decision Log (AD-0001..0023)** | `.claude/authority/AUTH-012-DECISION-LOG.md` | Authority Board | root `AD-00xx-*`, `AUTHORITY-BOARD-DECISION-RECORD`, `governance/DECISION-REGISTER.md` |
| **Artifact Registry** | `.claude/context/UCOS-ARTIFACT-REGISTRY.md` (CTX-REG-001) | Platform Governance | `registry/ARTIFACT-REGISTRY.md` (derived index), `CTX-REG-001-EVIDENCE-PACK` |
| **Project State** | `.claude/state/PROJECT-STATE.md` (STATE-001) | Platform Governance | `REAL-M-03`, all phase reports |
| **Governance Gates** | `.claude/governance/{completion,documentation,quality,release,security}-*.md` | Platform Governance | `docs/governance/**`, quality/release reports |
| **Invariants (INV-1..20)** | `UA-05-CANONICAL-INVARIANTS.md` + `architecture/existential/**` | Authority Board | `EXIST-001`, `AF-001`, REAL-M-03 |
| **Traceability Model** | `AUTH-010-TRACEABILITY-CANON.md` + `.claude/context/UCOS-TRACEABILITY-MODEL.md` | Authority Board / Platform Governance | `requirements/RTM.md` (derived) |
| **Glossary / Ubiquitous Language** | `.claude/context/UCOS-GLOSSARY.md` (CTX-GLOSS-001) | Authority Board | `knowledge/TERMINOLOGY-REGISTRY.md` (derived index) |

---

## 3. Canonical Ownership — Architecture Model Concepts

| Concept | Canonical Owner | Body | Referencing |
|---------|-----------------|------|-------------|
| **Domain Model (DOM-001..028)** | `docs/domain-architecture/**` (`UCOS-DOM-ARCH-001`) | Domain Architecture | `UCOS-DOMAIN-CATALOG` (seed), `domains/DOMAIN-MAP.md`, contract catalog |
| **Capability Model (CAP-01..19)** | `docs/capability-architecture/**` (`UCOS-CAP-ARCH-001`) | Capability Architecture | `UCOS-CAPABILITY-CATALOG` (seed), RTM |
| **Enterprise Architecture (EA L1..L6)** | `docs/enterprise-architecture/**` | Enterprise Architecture | `UCOS-ARCHITECTURE-BASELINE` |
| **Information Architecture (MC-01..13)** | `docs/information-architecture/**` (`UCOS-INF-ARCH-001`) | Data Architecture | contract catalog (classification inheritance) |
| **Data Architecture chain (IC/CD/LD/PD)** | `docs/data-architecture/**` (`UCOS-PDATA-ARCH-001`, `UCOS-LDATA-ARCH-001`) | Data Architecture | data contracts (`DC-*`), `data/**` catalogs |
| **Platform Event Architecture (PEV-001..073, PED-001..017)** | `UCOS-PEA-003` (`architecture/platform/**`) | Platform Architecture | event contracts (`EVT-CONTRACT-*`), `UCOS-PEA-9.2A/9.3A-*` |
| **Platform Domains (PE-01..17) / Runtime Services (PRS-001..073)** | `architecture/platform/**` | Platform Architecture | `platform-runtime` modules, WP-PLT reports |
| **Experience surfaces (S-001..S-014) / EXP-CR-001..021** | `architecture/experience/**` (`UCOS-EXP-ARCH-001`) | Experience Architecture | contract catalog BFFs (API-028/029/030), `apps/` (empty) |
| **Service & API Contracts (85)** | `specifications/contracts/UCOS-CONTRACT-CATALOG.md` (`UCOS-CONTRACT-CAT-001`) | Service & API Contract Architecture | `services/platform/**` realizations, backend catalogs |
| **ASR / NFR** | `UCOS-ASR-NFR-RATIFICATION.md` | Enterprise Architecture | all contracts (resolves "PENDING ASR RATIFICATION") |
| **Security controls** | `architecture/security/**` (+ ADRs) + `security/bootstrap/**` | Security Architecture | all contracts (resolves "FLAGGED FOR PROMPT 09") |

---

## 4. Canonical Ownership — Cross-Cutting Concept Primitives

> These are the concepts URNP explicitly requires a single owner for (Attestation, Verification,
> ProofCase, Evidence, Identity, Audit Event, Registry Record, Memory Item, Knowledge Item).

| Concept | Canonical Owner | Body | Referencing |
|---------|-----------------|------|-------------|
| **Identity / Principal** | DOM-017 (`UCOS-DATA-CONTRACT-017` Principal/Role/RoleAssignment/AccessDecision) + `src/control/identity/**` | Domain Architecture / Platform Engineering | all services (access consumers), Security (DOM-024) |
| **Access Decision** | DOM-017 `POST /access:evaluate` (`API-017`); model owned by Prompt 09 | Security Architecture | Policy (DOM-025) `POST /policies:evaluate` references it |
| **Policy / Decision Rule** | DOM-025 (`UCOS-DATA-CONTRACT-025` Policy/PolicyDecision/PolicyVersion) | Domain Architecture | all services (rule evaluation), Compliance |
| **Attestation Framework** | DOM-023 Compliance (`Attestation` in `DC-023`) + `OP-CERT-001` | Domain Architecture / Platform Governance | ratification determinations (`*-RAT-*`) |
| **Verification Framework** | DOM-023 Compliance (`GateResult`/gate evaluation, `API-023`) | Domain Architecture | validation reports (`*-VAL-*`), quality gates |
| **ProofCase / Operational Proof** | Operational Proof Fabric (`architecture/proof/**`, `services/platform/operational-proof/**`) | Platform Engineering | `B02-OPF-*`, audit records (DOM-021) |
| **Evidence** | DOM-023 `ComplianceEvidence` (`DC-023`) | Domain Architecture | `*-EVIDENCE-PACK` artifacts, PI evidence packs |
| **Audit Event / Audit Record** | DOM-021 Observability (`AuditRecord` in `DC-021`) + `AUDIT-UNIV-001` (universal primitive) | Domain Architecture / Platform Architecture | per-fabric `*-AUD-*` reports, DOM-023 |
| **Registry Record / Artifact** | DOM-027 Registry (`RegistryArtifact` in `DC-027`) + CTX-REG-001 | Domain Architecture / Platform Governance | `registry/**` (URNP derived), `src/registry-runtime/**` |
| **Memory Item** | Memory Fabric (`architecture/memory/**`, `src/control/memory/**`) | Platform Engineering | `MEM-*` reports, INT-REM-002 |
| **Knowledge Item** | Knowledge Fabric (`architecture/**`, `src/control/knowledge/**`) | Platform Engineering | `PI7-*` reports, DOM-020 insight |
| **Ontology / Semantic Type** | Ontology Fabric (`architecture/ontology/**`, `src/control/ontology/**`) | Platform Engineering | `ONTO-*` reports, INT-REM-001 |
| **Configuration / Metadata / Feature Flag** | DOM-018 (`DC-018`; MC-01..13) + `src/configuration-runtime/**` | Domain Architecture / Platform Engineering | all services (variability consumers) |
| **Integration Seam / API Key** | DOM-026 (`DC-026`); key material owned by Prompt 09 | Domain Architecture / Security Architecture | all services (transport) |
| **Governance Decision / Ownership Record / Zone** | DOM-022 (`DC-022`) + AUTH-012 | Domain Architecture / Authority Board | this artifact (URNP-OWN-001), DECISION-REGISTER |

---

## 5. Ownership of Per-Domain Business Concepts (DOM-001..016)

Each core/supporting domain is the sole owner of its aggregate concepts; "Party" is Shared Language
(consumed via translation/ACL, no shared mutable model).

| Concept | Owner Domain | Notes |
|---------|-------------|-------|
| Product / Category | DOM-001 Catalog | ProductReadModel/WriteModel canonical here |
| Price / Promotion | DOM-002 Pricing | PriceQuote canonical |
| Stock / Reservation / Availability | DOM-003 Inventory | AvailabilityView canonical |
| Cart / CheckoutContext | DOM-004 Cart & Checkout | |
| Order / OrderLine / OrderStatus | DOM-005 Order | idempotent order placement |
| Payment / Refund | DOM-006 Payments | PCI/tokenization flagged for Prompt 09 |
| Invoice / BillingAccount | DOM-007 Billing | |
| Settlement / Ledger / Commission | DOM-008 Settlement | |
| Shipment / Return | DOM-009 Fulfillment | |
| Subscription / Plan | DOM-010 Subscriptions | |
| CustomerProfile / SupportCase | DOM-011 Customer & CRM | Party = Shared Language (DF-002) |
| Recommendation / Collection / MerchandisingRule | DOM-012 Merchandising | |
| Supplier / CatalogSubmission | DOM-013 Supplier | |
| Listing / Seller | DOM-014 Marketplace | composes DOM-001..009 |
| NotificationRequest / CommunicationPreference | DOM-015 Communication | |
| DocumentDescriptor / DocumentReference | DOM-016 Document | |

---

## 6. Conflict Resolution Rule

Where two artifacts appear to define the same concept (see `URNP-DUP-001`), the canonical owner in
this model prevails. The non-owning artifact:
1. remains in place (no deletion/rename), and
2. should carry a reference/cross-link to the canonical owner (advisory action, executed only under
   separate authorization; read-only ledgers exempt).

Precedence for ownership disputes: **Canon (AUTH-004..011) > Architecture doc (`docs/**`, `architecture/**`) > Contract catalog > Realization (YAML/code) > Report/Program artifact.**

## 7. Traceability
- **Sources:** `AUTH-001..012`, `UCOS-DOM-ARCH-001`, `UCOS-CAP-ARCH-001`, `UCOS-PDATA-ARCH-001`, `UCOS-PEA-003`, `UCOS-CONTRACT-CAT-001`, `URNP-DUP-001`, `URNP-DOM-001`.
- **Feeds:** all Phase 6 registries, RTM (Phase 7), DECISION-REGISTER (Phase 8).
- **Owner:** URNP (subordinate to Authority Board). Canonical owners named here retain their authority.

**END `URNP-OWN-001` — Canonical Ownership Model (one concept, one owner; no redefinition).**
