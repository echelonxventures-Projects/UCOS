# UCOS-EXP-ADR-007 — Explicit Design of Loading / Empty / Error / Success States

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-EXP-ADR-007` |
| Status | Accepted (generated; ratification deferred) |
| Phase | Phase 10.2A — Prompt 06 |
| Authority | `SKILL-007` (state, error, loading, empty states), `CTX-ARCHB-001` §6 |
| Date | 2026-06-30 |

## Context
Undesigned intermediate and failure states are a primary source of poor, inaccessible, and untrustworthy
experiences, especially across asynchronous, eventually-consistent commerce flows.

## Decision
Every view and action MUST explicitly design **loading, empty, error, success, and partial/degraded**
states (`UCOS-EXP-STD-003`). Actions are idempotent and confirmable; destructive actions are reversible
where feasible and clearly signposted.

## Consequences
- (+) Predictable, accessible, trustworthy interactions; resilience to async/eventual consistency.
- (+) State design aligns with WCAG 2.2 AA (`UCOS-EXP-ADR-003`) and idempotency principles.
- (−) Higher up-front design effort per view/action.
- Error taxonomy/observability instrumentation is owned by Prompt 09/Prompt 11, not defined here.

## Traceability
- Refines: `UCOS-EXP-ARCH-001` §5 (`UCOS-EXP-STD-003`).
- Affects: all surfaces and journeys.
