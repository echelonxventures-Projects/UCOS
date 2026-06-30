# AUTH-006 — Capability Canon

**Authority ID:** AUTH-006
**Layer:** AUTHORITY
**Status:** RATIFIED (canonical capability rules)
**Version:** 1.1.0
**Supersedes:** Governs `CTX-CAP-001` (Capability Catalog) as the canonical capability authority.
**Immutability:** Immutable record. Evolves only via version increment + decision record (AUTH-012) + approval.

> This canon governs HOW capabilities are defined, ratified, and traced. It does NOT ratify
> capabilities — that authority belongs to Prompt 02. No enterprise architecture is generated here.

---

## 1. Purpose

Establish the canonical rules for capabilities: what a capability is, how candidates become
ratified capabilities, the required attributes, and the lineage capabilities must maintain to the
Vision and to realizing domains.

## 2. Scope

**In scope**
- Capability definition and ratification rules; the canonical provisional candidate set.
- Required capability attributes and value-stream linkage rules.

**Out of scope**
- Ratifying capabilities, authoring value streams/ASRs (Prompt 02), or any domain/service design.

## 3. Ownership

| Role | Responsibility |
|------|----------------|
| Enterprise Architect | Ratifies capabilities under Prompt 02 conforming to this canon. |
| Chief Authority Architect | Custodian of capability-governance rules. |
| Traceability gate | Enforces vision→capability→domain lineage. |

## 4. Dependencies

- **Upstream:** AUTH-001 (Vision goals G1–G6), AUTH-003 (P5, IP-08).
- **Downstream:** Prompt 02 outputs; AUTH-005 (domains realize capabilities).

## 5. Controlled Artifacts

- `.claude/context/UCOS-CAPABILITY-CATALOG.md` (`CTX-CAP-001`) — provisional candidates, subordinate.
- All `specifications/capabilities/**` and `architecture/enterprise/**` produced by Prompt 02.

## 6. Governance Rules

1. **Capability definition:** a capability is a business ability the platform provides, independent
   of implementation. Each ratified capability receives a permanent Capability ID and registry entry.
2. **Provisional candidate set (non-binding seed for Prompt 02):** Core — Product Catalog
   Management; Pricing & Promotion; Inventory & Availability; Cart & Checkout; Order Orchestration;
   Payment Processing; Fulfillment & Returns; Customer Management. Cross-cutting — Identity & Access
   Management; Configuration & Metadata; Observability; Integration & Eventing; Analytics &
   Reporting; Experience Delivery. These are candidates only.
2.1 **Ratified Platform Governance Capabilities (AD-0012):** in addition to the provisional
   candidates above, a **Platform Governance Capabilities** class is ratified alongside the Core
   Commerce and Cross-Cutting/Platform classes. It contains five first-class capabilities with
   strict **1:1 domain ownership**, each carrying a permanent Capability ID and registry entry:
   - **CAP-15 Platform Governance** — govern the governance system itself (frameworks, lifecycle,
     enforcement, evolution); realized by **ADOM-22 Governance**.
   - **CAP-16 Compliance & Assurance** — verification, assurance, audit coordination, regulatory
     conformance; realized by **ADOM-23 Compliance**.
   - **CAP-17 Security & Trust** — platform integrity/confidentiality/availability, trust
     frameworks, risk reduction; realized by **ADOM-24 Security**.
   - **CAP-18 Policy & Decisioning** — policy lifecycle, evaluation, decision governance,
     enforcement; realized by **ADOM-25 Policy**.
   - **CAP-19 Registry & Discovery** — registration lifecycle, discovery frameworks, metadata
     governance; realized by **ADOM-27 Registry**.
   These resolve finding **DF-001** and provide **direct** capability lineage for the
   governance/platform domains. Required-attribute completion (maturity, dependencies, KPIs/SLAs)
   and value-stream/ASR authoring for CAP-15..19 remain a Prompt 02 Trusted Operation.
3. **Required attributes (on ratification):** outcome, maturity, owning-domain intent, dependencies,
   KPIs/SLAs.
4. **Value-stream linkage:** every ratified capability traces to ≥1 value stream and to a Vision
   goal (G1–G6); no orphan capabilities.
5. **Realization:** every capability MUST be realized by ≥1 domain (AUTH-005) and traced accordingly.

## 7. Compliance Rules

- A capability with no Vision-goal lineage or no realizing domain is a blocking traceability gap.
- A ratified capability missing required attributes is a documentation gap.
- Candidate→permanent ID mappings must be recorded; unmapped candidates are a gap.

## 8. Approval Rules

- Amending capability-governance rules or the candidate taxonomy is an **Approval-Required Operation**.
- Ratifying capabilities and authoring value streams/ASRs within Prompt 02 is a **Trusted Operation**.

## 9. Change Procedure

1. Propose via AUTH-012 decision record; assess domain-allocation and value-stream impact.
2. Obtain Authority Board approval; record reference.
3. Increment version; preserve superseded rules with supersession links.
4. Update AUTHORITY-INDEX; flag dependent capability artifacts for review.

## 10. Traceability Links

- **Refines:** AUTH-001 (Vision), AUTH-003 (Principles).
- **Refined by:** Prompt 02 outputs; AUTH-005 (Domain Canon).
- **Controls:** `CTX-CAP-001`.

## 11. Version Information

| Version | Date | Author | Change | Decision Ref |
|---------|------|--------|--------|--------------|
| 1.0.0 | 2026-06-29 | Chief Authority Architect | Ratified canonical capability-governance rules. | AUTH-012 / AD-0003 |
| 1.1.0 | 2026-06-29 | Authority Board | Platform Governance Capability Expansion: ratified CAP-15 Platform Governance, CAP-16 Compliance & Assurance, CAP-17 Security & Trust, CAP-18 Policy & Decisioning, CAP-19 Registry & Discovery under a new Platform Governance Capabilities class with 1:1 domain ownership (ADOM-22/23/24/25/27); resolves DF-001. | AUTH-012 / AD-0012 |
