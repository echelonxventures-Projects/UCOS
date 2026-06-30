# UCOS — Information / Metadata Governance Model

**Artifact ID:** UCOS-INF-GOV-001
**Layer:** ARCHITECTURE (Information / Metadata)
**Status:** CREATED (Phase 5.0 generation; ratification deferred to Phase 5.1)
**Version:** 1.0.0
**Phase:** Phase 5.0 — Information / Metadata Architecture Generation
**Date:** 2026-06-29
**Owner:** Chief Information Architect
**Parent:** `UCOS-INF-ARCH-001`

> **Purpose.** Define how the UCOS Information & Metadata Architecture is governed: ownership and
> accountability, stewardship, classification governance, lifecycle governance, policy/compliance/
> security oversight, the operation classes (Trusted vs Approval-Required), and the change procedure.
> Conceptual and governance-driven only — no data, schema, contract, or implementation governance.

---

## 1. Governing Authority

This model is subordinate to and enacts:

| Source | Governs |
|--------|---------|
| `AUTH-009` Governance Canon | Governance spine; approval-by-exception; five autonomous-agent zones |
| `AUTH-007` Data Canon | Single-owner mandate; classification; lifecycle; migration-only |
| `AUTH-005` Domain Canon | Bounded-context ownership; anti-corruption seams |
| `AUTH-008` Security Canon | Non-waivable S1/S3/S4; classification → controls |
| `AUTH-010` Traceability Canon | No-orphan lineage; registry authority |
| `AUTH-003` Principles | IP-04 (Configuration-Driven), IP-05 (Policy-Driven), IP-08 (Traceability-First), IP-13/14/15 |
| `UCOS-CONST-001` | Constitutional contract (Art. V configuration; governance Parts) |

Precedence in conflict: **Authority → Constitution → EA → Domain → Capability → Information** (AUTH-009 §6.2).

---

## 2. Governance Bodies (conceptual roles)

| Body | Conceptual Role | Anchor |
|------|------------------|--------|
| **Authority Board** | Approves amendments to taxonomy, ownership, classification, lifecycle rules | AUTH-009, AUTH-012 |
| **Information Governance (oversight)** | Verifies ownership/stewardship/lifecycle integrity across all IC | UCOS-DOM-022 / CAP-15 |
| **Policy Authority** | Supplies governing policy that constrains information handling | UCOS-DOM-025 / CAP-18 |
| **Security Oversight** | Verifies classification presence/consistency; maps to controls later | UCOS-DOM-024 / CAP-17 |
| **Compliance Oversight** | Verifies regulated/evidentiary lifecycle and obligations | UCOS-DOM-023 / CAP-16 |
| **Registry Authority** | Records lineage/registration metadata; single source of truth for links | UCOS-DOM-027 / CAP-19 |

---

## 3. Information Ownership & Accountability

### 3.1 Ownership Rule

Every Information Class (`IC-01..IC-17`) has **exactly one accountable owning bounded context**,
inherited unchanged from `UCOS-DOM-ARCH-001` §VII.2. Ownership is accountability for *meaning*, not
custody of *data*. No shared mutable ownership exists.

### 3.2 Accountability Matrix

| IC | Owner (Domain) | Accountable for |
|----|----------------|-----------------|
| IC-01 Identity | UCOS-DOM-017 | Meaning, classification (PII), lifecycle (Durable), governance conformance |
| IC-02 Party | UCOS-DOM-011 (Shared-Language) | Meaning of party; no shared mutable model; identity referenced from DOM-017 |
| IC-03 Product | UCOS-DOM-001 | Product meaning, classification, lifecycle |
| IC-04 Catalog | UCOS-DOM-001 | Catalog meaning |
| IC-05 Commercial | UCOS-DOM-002 | Terms-of-exchange meaning |
| IC-06 Order | UCOS-DOM-005 | Order meaning + lifecycle state |
| IC-07 Transaction | UCOS-DOM-006 | Monetary-event meaning (S1) |
| IC-08 Fulfillment | UCOS-DOM-009 | Delivery meaning |
| IC-09 Financial | UCOS-DOM-007 / UCOS-DOM-008 | Accounting meaning (single-owner-per-facet) |
| IC-10 Compliance | UCOS-DOM-023 | Evidentiary meaning |
| IC-11 Policy | UCOS-DOM-025 | Policy meaning (IP-05) |
| IC-12 Governance | UCOS-DOM-022 | Governance-system meaning |
| IC-13 Security | UCOS-DOM-024 | Protection meaning (S1/S3/S4) |
| IC-14 Registry | UCOS-DOM-027 | Authoritative existence meaning |
| IC-15 Workflow | UCOS-DOM-019 | Orchestrated-process meaning |
| IC-16 Intelligence | UCOS-DOM-020 | Derived-insight meaning |
| IC-17 Platform | UCOS-DOM-018 | Configuration/platform meaning |

**Ownership conflicts: 0. Multi-owner mutable classes: 0.**

---

## 4. Metadata Ownership & Accountability

Each Metadata Class (`MC-01..MC-13`) is owned by a Platform Governance/Platform context (never a
commerce context), per §XVI of `UCOS-INF-ARCH-001`:

| MC | Owner | Accountable for |
|----|-------|-----------------|
| MC-01 Classification | UCOS-DOM-024 / CAP-17 | Sensitivity/category integrity |
| MC-02 Ownership | UCOS-DOM-022 / CAP-15 | Owner/steward assignment integrity |
| MC-03 Governance | UCOS-DOM-022 / CAP-15 | Governance state/gates |
| MC-04 Lineage | UCOS-DOM-027 / CAP-19 | Provenance integrity |
| MC-05 Lifecycle | UCOS-DOM-022 / CAP-15 | Retention/versioning context |
| MC-06 Policy | UCOS-DOM-025 / CAP-18 | Applicable-policy integrity |
| MC-07 Security | UCOS-DOM-024 / CAP-17 | Protection posture |
| MC-08 Compliance | UCOS-DOM-023 / CAP-16 | Regulatory scope/obligations |
| MC-09 Traceability | UCOS-DOM-027 / CAP-19 | Lineage-link integrity |
| MC-10 Registry | UCOS-DOM-027 / CAP-19 | Registration/discovery integrity |
| MC-11 Capability | UCOS-DOM-022 / CAP-15 | Realizing-capability context |
| MC-12 Domain | UCOS-DOM-022 / CAP-15 | Owning-domain context |
| MC-13 Information | UCOS-DOM-018 / CAP-10 | Semantic descriptor integrity |

**Metadata ownership conflicts: 0.**

---

## 5. Stewardship Governance

| Role | Holder | Operation Class |
|------|--------|-----------------|
| Owner | Accountable context (§3/§4) | Accountable; rule changes Approval-Required |
| Steward | Owning-context governance function | Curation; Trusted |
| Producer | Every artifact owner | Declares mandatory metadata at creation; Trusted |
| Custodian | Platform contexts (Config/Integration/Observability) | Transit/observe only; never re-owns |
| Consumer | Governance/Security/Compliance/Registry | Audits/uses; no meaning change |

**Rules:** every IC has 1 Owner + ≥1 Steward; custodianship never confers ownership; oversight bodies
audit but do not own commerce information.

---

## 6. Classification Governance

1. Every Information Class carries exactly one primary sensitivity class (AUTH-007 §6.3); unclassified = **blocking gap** (S4).
2. The classification taxonomy (Public/Internal/Confidential/Restricted-PII/Restricted-Financial/Restricted-Security/Regulated-Evidentiary) is governed by Security Oversight (CAP-17) under AUTH-008.
3. Highest applicable sensitivity governs (conservative dominance); derived classes inherit the highest source sensitivity.
4. Amending the classification taxonomy is an **Approval-Required Operation** (assess security impact).

---

## 7. Lifecycle Governance

1. Every Information Class declares a lifecycle profile (Transient/Operational/Durable/Evidentiary) per AUTH-007 §6.4.
2. Retirement of meaning is recorded and reversible; destructive in-place loss is prohibited.
3. Evidentiary classes may not be retired below their regulatory retention horizon.
4. When derived to data later, all change is **migration-only** (IP-14, AUTH-007 §6.5) — never destructive in-place edits.

---

## 8. Policy, Compliance & Security Oversight

| Concern | Oversight | Rule |
|---------|-----------|------|
| Policy conformance | CAP-18 / UCOS-DOM-025 | Information handling is governed by declared policy (IP-05), not ad-hoc rules |
| Compliance/evidentiary | CAP-16 / UCOS-DOM-023 | Regulated/evidentiary classes carry compliance metadata + evidentiary lifecycle |
| Security/protection | CAP-17 / UCOS-DOM-024 | Restricted classes carry non-waivable S1/S3/S4 anchors into AUTH-008 unchanged |

---

## 9. Operation Classification (Approval-by-Exception, AUTH-009)

| Operation | Class |
|-----------|-------|
| Recording classifications, stewardship, lineage/registry metadata | **Trusted** |
| Producing mandatory metadata at artifact creation | **Trusted** |
| Authoring conceptual information/metadata models within this phase | **Trusted** |
| Amending Information/Metadata **taxonomy** (classes/groups) | **Approval-Required** |
| Re-owning an Information/Metadata Class | **Approval-Required** |
| Amending the **classification taxonomy** | **Approval-Required** |
| Amending **lifecycle/retention** policy | **Approval-Required** |
| Deriving this baseline into a **Data Architecture** (Prompt 05) | **Approval-Required (downstream phase gate)** |
| Any destructive operation on governed meaning | **Approval-Required (non-waivable)** |

---

## 10. Governance Integrity Constraints (non-waivable)

1. **Single-owner mandate** — multi-owner mutable class is a non-waivable consistency violation (AUTH-007 §7).
2. **Mandatory classification** — unclassified class is a blocking gap (S4).
3. **No-orphan lineage** — every class traces to Authority (AUTH-010 §6.5/§7).
4. **Bidirectional integrity** — broken lineage link is a blocking gap.
5. **Acyclic governance** — no class governs a class that governs it.
6. **No shared mutable model** — cross-context use is reference/translation only (AUTH-005 §6.4).
7. **Non-waivable security** — S1/S3/S4 preserved (AUTH-008).

---

## 11. Change Procedure (AUTH-009 / AUTH-012)

1. Propose change via an AUTH-012 decision record; assess classification, lineage, and downstream (Data Architecture) impact.
2. Obtain Authority Board approval for Approval-Required operations; record the reference.
3. Increment version; preserve superseded rules/classes with supersession links (never delete).
4. Update `CTX-REG-001` and `AUTHORITY-INDEX`; flag dependent Information/Metadata/Data artifacts for review.

---

## 12. Governance Assessment (this generation)

| Dimension | Result |
|-----------|:------:|
| Information ownership defined (17/17) | ✅ |
| Metadata ownership defined (13/13) | ✅ |
| Accountability assigned (all classes) | ✅ |
| Stewardship defined | ✅ |
| Classification governance defined (0 unclassified) | ✅ |
| Lifecycle governance defined | ✅ |
| Policy/Compliance/Security oversight defined | ✅ |
| Operation classes defined (Trusted vs Approval-Required) | ✅ |
| Governance conflicts | 0 |
| Ownership conflicts | 0 |
| Approval-Required operations triggered by this generation | 0 |
| Implementation leakage | NONE |

> This generation **inherited** the ratified domain/capability ownership unchanged and introduced no
> taxonomy/ownership/classification amendment, so **no Approval-Required operation was triggered**.

---

## Traceability

- **Refines:** `UCOS-INF-ARCH-001`, `AUTH-003/005/007/008/009/010`, `UCOS-CONST-001`,
  `UCOS-ENT-ARCH-001`, `UCOS-DOM-ARCH-001`, `UCOS-CAP-ARCH-001`, `AUTH-012` (AD-0003/AD-0012/AD-0013).
- **Refined by:** `UCOS-INF-COMP-001`, `UCOS-INF-DONE-001`; Phase 5.1 governance audit; Prompt 05.
