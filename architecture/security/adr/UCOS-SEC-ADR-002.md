# UCOS-SEC-ADR-002 — Identity & Authentication Architecture

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-SEC-ADR-002` |
| Status | Accepted (design) |
| Phase | Phase 9 — Security Architecture (Prompt 09) |
| Parent | `UCOS-SEC-ARCH-001` |
| Date | 2026-06-30 |
| Owner | Security Architect (`UCOS-DOM-024`; CAP-17) |
| Anchors | SP-02; AUTHN-1..6; Identity §III; S1; AUTH-008 §6.2 |

## Context
UCOS has four principal classes (human user, service/workload, autonomous agent, tenant) that must be
uniquely identified, attributable, tenant-scoped, and lifecycle-governed. Authentication must work
across external/federated identity sources without binding to any specific provider or token format.

## Decision
Adopt a **federation-ready, abstract identity & authentication architecture**: (1) every principal is a
registered governed element with a stable unique identifier; (2) authentication is centralized in
`PRS-031` and session/token issuance/validation/revocation in `PRS-034`, backed by issued material from
`PRS-035` (never embedded); (3) the model defines an **identity-provider abstraction** so external/
federated IdPs can be integrated without architectural change; (4) authentication strength (e.g.,
multi-factor for human/privileged access) is a governed configuration parameter (`PRD-011`), not
hard-coded; (5) failed authentication is deny-by-default, rate-limited, and audited.

## Consequences
- **Positive:** Pluggable identity sources; consistent attribution (SP-07); no credentials in code (S3 alignment).
- **Negative / cost:** Requires a governed credential lifecycle (creation/rotation Approval-Required, AUTH-008 §8).
- **Constraints:** No IdP product, auth protocol (e.g., token standard), or crypto library selected here.
- **Verification:** AUTHN-1..6 verified against implementation by Prompt 11.

## Traceability
- Refines: `UCOS-SEC-ARCH-001` §III/§IV; AUTH-008; `UCOS-PEA-002` (`PRD-008`); CAP-09/CAP-17.
- Refined by: `UCOS-SEC-ADR-003` (authz), `UCOS-SEC-ADR-005` (secrets); Prompts 10–11.
