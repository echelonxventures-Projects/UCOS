# AUTH-004 — Architecture Canon

**Authority ID:** AUTH-004
**Layer:** AUTHORITY
**Status:** RATIFIED (canonical architecture rules)
**Version:** 1.0.0
**Supersedes:** `CTX-ARCHB-001` (architecture baseline) as the canonical architectural stance.
**Immutability:** Immutable record. Evolves only via version increment + decision record (AUTH-012) + approval.

> This canon fixes the non-negotiable architectural rules of UCOS. It governs how all architecture
> is produced (Prompts 02–09); it does not itself design the platform, domains, or services.

---

## 1. Purpose

Establish the canonical architectural style, layer model, boundary rules, cross-cutting mandates,
technology-decision discipline, and quality-attribute framing that every architectural artifact
must obey.

## 2. Scope

**In scope**
- Canonical architectural style and layering.
- Boundary and integration rules.
- Mandatory cross-cutting concerns.
- Technology-decision discipline (ADR-governed).
- Architecturally significant quality attributes.

**Out of scope**
- Concrete domain, data, metadata, experience, service, platform, or security designs (their
  owning canons and prompts produce these). No technology is selected here.

## 3. Ownership

| Role | Responsibility |
|------|----------------|
| Chief Authority Architect | Custodian of the architecture canon. |
| Domain/Platform/Security architects | Produce conforming designs under their prompts. |
| Quality & documentation gates | Enforce conformance. |

## 4. Dependencies

- **Upstream:** AUTH-002 (Constitution Art. III–V, VII), AUTH-003 (P1–P4, P7–P10, IP-01–IP-15).
- **Downstream:** AUTH-005 (Domain), AUTH-007 (Data), AUTH-008 (Security), Prompts 02–09.

## 5. Controlled Artifacts

- `.claude/context/UCOS-ARCHITECTURE-BASELINE.md` (`CTX-ARCHB-001`) — subordinate.
- All `architecture/**` artifacts produced by Prompts 02–09.

## 6. Governance Rules

1. **Architectural style (binding):** Domain-Driven Design; composable/modular; contract-first;
   metadata-driven configurability; event-aware asynchronous integration.
2. **Canonical layer model:** Experience → Service/Application → Domain → Platform → Data →
   Metadata → Security. Each layer has a fixed home under `architecture/**`, `apps/`, `services/`,
   `packages/`, `infra/`, `security/`.
3. **Boundary & integration rules:** cross-context calls use published, versioned contracts only;
   no shared mutable domain models (use ACL/translation); minimize synchronous coupling; prefer
   asynchronous, idempotent integration; every contract is versioned with migration paths.
4. **Mandatory cross-cutting concerns (designed, not bolted on):** identity & tenancy;
   configuration/metadata; observability; security; resilience/idempotency; auditability.
5. **Technology-decision discipline:** no framework, language, datastore, or cloud is assumed; all
   technology selection is a governed decision recorded as an ADR (Prompt 08) and registered.
6. **Quality attributes (ASRs):** availability, scalability, security/privacy, evolvability,
   observability, performance, interoperability, operability — each must be quantified by the
   owning generator and verified by gates.

## 7. Compliance Rules

- Any architecture artifact violating the layer model, boundary rules, or cross-cutting mandates is
  a blocking gap (Quality gate Q2; Documentation gate).
- Any technology choice lacking a justifying registered ADR is non-compliant.
- Shared mutable models across contexts are a non-waivable consistency violation.

## 8. Approval Rules

- Amending the architectural style, layer model, or cross-cutting mandate set is an
  **Approval-Required Operation**.
- Producing conforming architecture documents and ADRs within an authorized prompt is a
  **Trusted Operation**.

## 9. Change Procedure

1. Propose via AUTH-012 decision record; assess downstream design impact.
2. Obtain Authority Board approval; record reference.
3. Increment version; preserve superseded rules with supersession links.
4. Update AUTHORITY-INDEX; flag dependent architecture artifacts for review.

## 10. Traceability Links

- **Refines:** AUTH-002 (Constitution), AUTH-003 (Principles).
- **Refined by:** AUTH-005, AUTH-007, AUTH-008; Prompts 02–09 outputs.
- **Controls:** `CTX-ARCHB-001`, all `architecture/**`.

## 11. Version Information

| Version | Date | Author | Change | Decision Ref |
|---------|------|--------|--------|--------------|
| 1.0.0 | 2026-06-29 | Chief Authority Architect | Ratified canonical architecture rules from baseline. | AUTH-012 / AD-0003 |
