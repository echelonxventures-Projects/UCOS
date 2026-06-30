# AUTH-008 — Security Canon

**Authority ID:** AUTH-008
**Layer:** AUTHORITY
**Status:** RATIFIED (canonical security rules)
**Version:** 1.0.0
**Supersedes:** Governs `GATE-SEC-001` and all security-architecture artifacts as the canonical security authority.
**Immutability:** Immutable record. Evolves only via version increment + decision record (AUTH-012) + approval.

> This canon fixes the non-negotiable security posture of UCOS. It governs how security is designed
> and verified; it does not implement controls (Prompt 10) or render gate verdicts on built
> software (Prompt 11). Its mandates are non-waivable and supersede any autonomy provision.

---

## 1. Purpose

Establish the canonical security and privacy rules: zero-trust, least-privilege, secrets handling,
data protection, threat-modeling discipline, audit logging, and the security operations that always
require human approval — establishing the posture all implementation must realize.

## 2. Scope

**In scope**
- Canonical security mandates (authn/authz, secrets, data protection, least privilege, audit).
- Threat-modeling and control-mapping discipline.
- Security operations that are always approval-required.
- The non-waivable control set.

**Out of scope**
- Authoring per-context threat models/control mappings (Prompt 09); implementing controls
  (Prompt 10); gate verdicts on implementation (Prompt 11).

## 3. Ownership

| Role | Responsibility |
|------|----------------|
| Security Architect | Produces conforming threat models/controls under Prompt 09. |
| Chief Authority Architect | Custodian of the security canon. |
| Authority Board | Approves security-policy change (approval-required). |
| Security gate (`GATE-SEC-001`) | Enforces checkpoints S1–S7 against implementation. |

## 4. Dependencies

- **Upstream:** AUTH-002 (Art. VI), AUTH-003 (P6, IP-05, IP-09, IP-10), AUTH-007 (classification).
- **Downstream:** Prompt 09 outputs; Prompts 10–12; `GATE-SEC-001`.

## 5. Controlled Artifacts

- `.claude/governance/security-gates.md` (`GATE-SEC-001`) — subordinate; derives authority here.
- All `architecture/security/**` and `security/**` artifacts produced by Prompt 09.

## 6. Governance Rules

1. **Zero-trust & least-privilege by default (IP-09):** no implicit trust; identities, services, and
   data access are scoped minimally.
2. **AuthN/AuthZ on every exposed boundary (S1):** no network-exposed capability ships without
   authentication and authorization defined. No silent open surfaces.
3. **Secrets management (S3):** no secrets in code or artifacts; vault-managed with defined rotation.
4. **Data protection (S4):** encryption in transit and at rest; PII classified (AUTH-007) and
   minimized.
5. **Threat modeling (S2):** threats modeled (e.g., STRIDE) per context and per exposed contract and
   mapped to controls; every threat traces to a control, every control to what it protects.
6. **Audit logging (S6, IP-10):** security-relevant events are logged immutably and attributably.
7. **Dependency risk (S7):** dependencies pinned; known-vuln scan clean or risk-accepted with record.

## 7. Compliance Rules

- **Non-waivable controls:** S1 (authn/authz), S3 (secrets), S4 (data protection) — these CANNOT be
  waived or deferred by any autonomy provision (Article XII) and block the scope until satisfied.
- An unauthenticated exposed boundary or unprotected PII is a non-waivable security gap.
- Security posture is designed in Prompt 09 and verified against implementation in Prompt 11.

## 8. Approval Rules

The following are **always Approval-Required Operations** (human approval mandatory, never autonomous):

- Security policy changes; modifications to this canon or `GATE-SEC-001`.
- Secret creation, modification, or rotation; credential creation or rotation.
- External account creation; vendor onboarding with data access.
- Granting or widening access scopes; disabling or weakening a control.
- Production deployment of security-relevant change.

Designing threat models and control mappings within Prompt 09, and running security scans/linters,
are **Trusted Operations** (autonomous, audited).

## 9. Change Procedure

1. Propose via AUTH-012 decision record; assess control coverage and non-waivable impact.
2. Obtain Authority Board approval; record reference.
3. Increment version; preserve superseded rules with supersession links.
4. Update AUTHORITY-INDEX; flag dependent security artifacts for review.

## 10. Traceability Links

- **Refines:** AUTH-002 (Art. VI), AUTH-003 (P6/IP-09/IP-10), AUTH-007 (classification).
- **Refined by:** Prompt 09 outputs; Prompts 10–12; `GATE-SEC-001`.
- **Controls:** `GATE-SEC-001`, all `architecture/security/**`, `security/**`.

## 11. Version Information

| Version | Date | Author | Change | Decision Ref |
|---------|------|--------|--------|--------------|
| 1.0.0 | 2026-06-29 | Chief Authority Architect | Ratified canonical security mandates + non-waivable set + approval-required security operations. | AUTH-012 / AD-0009 |
