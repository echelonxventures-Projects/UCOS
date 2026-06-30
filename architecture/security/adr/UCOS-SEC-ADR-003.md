# UCOS-SEC-ADR-003 — Authorization Model (Deny-by-Default, Policy-Driven RBAC+ABAC)

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-SEC-ADR-003` |
| Status | Accepted (design) |
| Phase | Phase 9 — Security Architecture (Prompt 09) |
| Parent | `UCOS-SEC-ARCH-001` |
| Date | 2026-06-30 |
| Owner | Security Architect (`UCOS-DOM-024`; CAP-17) |
| Anchors | SP-03; §V; S1/S5; AUTH-008 §6.1; Const. X.2; IP-05 |

## Context
Authorization must be deny-by-default, least-privilege, tenant-isolating, policy-driven (not
hard-coded), and attributable across 28 contexts. It must support both coarse roles and fine-grained
attribute/context decisions, and respect single-owner resource governance (AUTH-007).

## Decision
Adopt an **abstract policy-decision model combining role, attribute/context, and resource-ownership
dimensions** (an RBAC+ABAC abstraction): (1) `PRS-032` is the policy decision point (PDP); enforcement
points (PEP) are the gateway (`PRS-018/019`), eventing (`PRS-013/015`), and per-service guards; (2)
policy is sourced from the Policy domain (`UCOS-DOM-025`) and configuration/metadata (`PRD-011`), never
embedded in code; (3) decisions are evaluated within the principal's tenant context (`PRS-033`);
(4) absence of an explicit grant is denial; (5) every allow/deny decision is audited (`PRS-039`).

## Consequences
- **Positive:** Centralized, governed, auditable authorization; least-privilege by construction; policy evolves without code change (IP-05).
- **Negative / cost:** Requires a governed policy authoring/decision discipline; PDP availability is on the critical path (mitigated by defense-in-depth and caching at implementation — not specified here).
- **Constraints:** No policy engine, policy language, or product selected here.
- **Verification:** S1/S5 verified against implementation by Prompt 11.

## Traceability
- Refines: `UCOS-SEC-ARCH-001` §V; AUTH-008; `UCOS-DOM-ARCH-001` (DOM-025); `UCOS-PEA-002` (`PRD-008`).
- Refined by: `UCOS-SEC-ADR-004` (tenancy); Prompts 10–11.
