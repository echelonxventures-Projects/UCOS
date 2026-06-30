# UCOS-SEC-ADR-004 — Tenancy Isolation Model

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-SEC-ADR-004` |
| Status | Accepted (design) |
| Phase | Phase 9 — Security Architecture (Prompt 09) |
| Parent | `UCOS-SEC-ARCH-001` |
| Date | 2026-06-30 |
| Owner | Security Architect (`UCOS-DOM-024`; CAP-17) |
| Anchors | TEN-1..4; SP-03; S1/S4/S5; AUTH-008 §6.1/§6.4 |

## Context
UCOS is multi-tenant. Cross-tenant data leakage is a non-waivable data-protection violation (S4).
Isolation must hold at the boundary, in authorization, and at data access, without selecting a
persistence or partitioning technology.

## Decision
Adopt a **defense-in-depth tenancy isolation model**: (1) every request resolves a tenant context via
`PRS-033`; requests without a valid tenant context are denied; (2) authorization (`PRS-032`) evaluates
every decision within tenant scope; cross-tenant authorization requires an explicit governed grant;
(3) data is tenant-partitioned at rest and in projections; the data-access broker (`PRS-006`) enforces
tenant scoping; (4) cross-tenant access is treated as an S4 violation and blocks the scope.

## Consequences
- **Positive:** Strong isolation guarantee; cross-tenant leakage prevented at three layers (SP-08).
- **Negative / cost:** Tenant context must be threaded through every call and persistence operation.
- **Constraints:** No partitioning strategy (row/schema/store), datastore, or isolation product selected here.
- **Verification:** TEN-1..4 verified against implementation by Prompt 11; tenant-leakage tests required.

## Traceability
- Refines: `UCOS-SEC-ARCH-001` §V.4/§VI; AUTH-008; `UCOS-PEA-002` (`PRD-008`, `PRS-006`).
- Refined by: `UCOS-SEC-ADR-006` (data protection); Prompts 10–11.
