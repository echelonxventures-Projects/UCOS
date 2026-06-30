# AUTH-005 — Domain Canon

**Authority ID:** AUTH-005
**Layer:** AUTHORITY
**Status:** RATIFIED (canonical domain rules)
**Version:** 1.0.0
**Supersedes:** Governs `CTX-DOM-001` (Domain Catalog) as the canonical domain-governance authority.
**Immutability:** Immutable record. Evolves only via version increment + decision record (AUTH-012) + approval.

> This canon governs HOW bounded contexts are defined, related, and ratified. It does NOT design or
> ratify domains — that authority belongs to Prompt 03. No domain generation occurs here.

---

## 1. Purpose

Establish the canonical rules for domain architecture: what a bounded context is, how the context
map is governed, how the ubiquitous language is maintained, and how candidate domains become
ratified bounded contexts.

## 2. Scope

**In scope**
- Bounded-context definition rules and the canonical provisional candidate set.
- Context-map governance (relationship types, integration patterns).
- Ubiquitous-language governance and capability-to-domain allocation rules.

**Out of scope**
- Ratifying domains, authoring domain models, or generating context maps (Prompt 03).
- Contracts (Prompt 07), data persistence (AUTH-007), or code.

## 3. Ownership

| Role | Responsibility |
|------|----------------|
| Domain Architect | Produces ratified contexts under Prompt 03 conforming to this canon. |
| Chief Authority Architect | Custodian of domain governance rules. |
| Traceability gate | Enforces capability→domain lineage. |

## 4. Dependencies

- **Upstream:** AUTH-003 (P4 Domain-Driven Boundaries, IP-07), AUTH-004 (Architecture Canon),
  AUTH-006 (Capability Canon — domains realize capabilities).
- **Downstream:** Prompt 03 outputs; AUTH-007 (data per context), AUTH-008 (per-context threat models).

## 5. Controlled Artifacts

- `.claude/context/UCOS-DOMAIN-CATALOG.md` (`CTX-DOM-001`) — provisional candidates, subordinate.
- All `architecture/domains/**` artifacts produced by Prompt 03.

## 6. Governance Rules

1. **Bounded context definition:** a context is an explicit boundary within which a single model and
   ubiquitous language are consistent. Each ratified context receives a permanent Domain ID and a
   registry entry.
2. **Provisional candidate set (non-binding seed for Prompt 03):** Identity & Access; Catalog &
   Product; Pricing & Promotions; Inventory & Availability; Cart & Checkout; Order Management;
   Payments & Billing; Fulfillment & Logistics; Customer & CRM; Merchandising & Experience;
   Configuration & Metadata; Analytics & Insight. These are candidates only — not ratified contexts.
3. **Context-map governance:** every cross-context relationship must declare a relationship type
   (partnership, customer-supplier, conformist, anti-corruption layer, shared kernel) and an
   integration pattern (synchronous contract or asynchronous event). No undeclared seams.
4. **No shared mutable models:** contexts integrate only through published contracts; translation/ACL
   is required where models differ.
5. **Capability allocation:** every ratified context MUST trace to ≥1 ratified capability (AUTH-006).
6. **Ubiquitous language:** per-context terminology is governed and merged into AUTH-011 (Glossary).

## 7. Compliance Rules

- A ratified domain with no upstream capability is a blocking traceability gap (no orphan domains).
- An undeclared or unmapped context-map seam is a blocking gap.
- Shared mutable cross-context models are a non-waivable consistency violation.

## 8. Approval Rules

- Amending domain-governance rules or the candidate taxonomy is an **Approval-Required Operation**.
- Ratifying contexts and authoring context maps within Prompt 03 is a **Trusted Operation**
  (autonomous, audited) provided traceability holds.

## 9. Change Procedure

1. Propose via AUTH-012 decision record; assess context-map and capability-lineage impact.
2. Obtain Authority Board approval; record reference.
3. Increment version; preserve superseded rules with supersession links.
4. Update AUTHORITY-INDEX; flag dependent domain artifacts for review.

## 10. Traceability Links

- **Refines:** AUTH-003, AUTH-004, AUTH-006.
- **Refined by:** Prompt 03 outputs; AUTH-007, AUTH-008.
- **Controls:** `CTX-DOM-001`, all `architecture/domains/**`.

## 11. Version Information

| Version | Date | Author | Change | Decision Ref |
|---------|------|--------|--------|--------------|
| 1.0.0 | 2026-06-29 | Chief Authority Architect | Ratified canonical domain-governance rules. | AUTH-012 / AD-0003 |
