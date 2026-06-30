# AUTH-007 — Data Canon

**Authority ID:** AUTH-007
**Layer:** AUTHORITY
**Status:** RATIFIED (canonical data rules)
**Version:** 1.0.0
**Supersedes:** Governs all data-architecture artifacts as the canonical data authority.
**Immutability:** Immutable record. Evolves only via version increment + decision record (AUTH-012) + approval.

> This canon governs HOW data is modeled, owned, classified, and evolved. It does NOT design data
> models or select datastore technology — those belong to Prompt 05 and Prompt 08 respectively.

---

## 1. Purpose

Establish the canonical rules for data architecture: data ownership and sovereignty, canonical
modeling discipline, classification, and the migration-only evolution rule that governs all data
and schema change.

## 2. Scope

**In scope**
- Data ownership/sovereignty rules and the single-owner mandate.
- Canonical/logical data-modeling discipline (boundary-respecting).
- Data classification taxonomy feeding security.
- Data lifecycle and migration-only evolution governance.

**Out of scope**
- Authoring concrete data models/schemas (Prompt 05); physical datastore selection (Prompt 08);
  contracts (Prompt 07); code (Prompt 10).

## 3. Ownership

| Role | Responsibility |
|------|----------------|
| Data Architect | Produces conforming data models under Prompt 05. |
| Chief Authority Architect | Custodian of data-governance rules. |
| Security gate | Consumes classification for control mapping. |

## 4. Dependencies

- **Upstream:** AUTH-003 (P5, P9, IP-13, IP-14, IP-15), AUTH-004 (Architecture Canon),
  AUTH-005 (Domain Canon).
- **Downstream:** Prompt 05 outputs; AUTH-008 (Security — classification → controls).

## 5. Controlled Artifacts

- All `architecture/data/**` artifacts produced by Prompt 05.
- Data classification records feeding `GATE-SEC-001` (S4).

## 6. Governance Rules

1. **Single-owner mandate:** every data entity has exactly one owning bounded context; no shared
   mutable ownership. Cross-context access is via contracts/projections only.
2. **Canonical modeling discipline:** logical/canonical models realize domain aggregates without
   violating context boundaries; keys and relationships are explicit.
3. **Data classification:** every entity is classified for sensitivity (e.g., PII, financial,
   confidential, public); classification is mandatory input to AUTH-008.
4. **Lifecycle governance:** retention, archival, and versioning are defined per entity.
5. **Migration-only evolution (IP-14):** schema/state changes occur only through reversible,
   recorded migrations — never destructive in-place edits without an approved migration.
6. **Versioning (IP-13) & backward compatibility (IP-15):** data contracts are versioned; breaking
   changes require new versions and migration paths.

## 7. Compliance Rules

- Multi-owner data entities are a non-waivable consistency violation.
- Unclassified data entities are a blocking gap (block security gate readiness, S4).
- Schema change without a recorded, reversible migration is a non-waivable violation.

## 8. Approval Rules

- Amending data-governance rules (ownership, classification taxonomy, migration policy) is an
  **Approval-Required Operation**.
- Destructive data operations (dropping stores/entities, irreversible migrations, bulk deletes) are
  **Approval-Required Operations** regardless of phase.
- Authoring logical data models and reversible migrations within Prompt 05 is a **Trusted Operation**.

## 9. Change Procedure

1. Propose via AUTH-012 decision record; assess classification and downstream control impact.
2. Obtain Authority Board approval; record reference.
3. Increment version; preserve superseded rules with supersession links.
4. Update AUTHORITY-INDEX; flag dependent data and security artifacts for review.

## 10. Traceability Links

- **Refines:** AUTH-003, AUTH-004, AUTH-005.
- **Refined by:** Prompt 05 outputs; AUTH-008 (Security Canon).
- **Controls:** all `architecture/data/**`.

## 11. Version Information

| Version | Date | Author | Change | Decision Ref |
|---------|------|--------|--------|--------------|
| 1.0.0 | 2026-06-29 | Chief Authority Architect | Ratified canonical data-governance rules (single-owner, classification, migration-only). | AUTH-012 / AD-0003 |
