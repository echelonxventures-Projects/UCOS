# UCOS-EXP-ADR-001 — Channel-Agnostic Core Flows, Edge-Specific Presentation

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-EXP-ADR-001` |
| Status | Accepted (generated; ratification deferred) |
| Phase | Phase 10.2A — Prompt 06 |
| Authority | `CTX-ARCHB-001` §1, `AUTH-004`, `SKILL-007` |
| Date | 2026-06-30 |

## Context
UCOS serves the same capabilities across multiple channels (web, mobile, admin). Duplicating flow logic per
channel causes drift and breaks G1 (Universality) / G2 (Composability).

## Decision
Interaction flows/journeys are defined **channel-agnostically**; only presentation adapts at the channel
edge. A journey (`UCOS-EXP-JOURNEY-*`) is authored once and rendered per channel via the design system
(`UCOS-EXP-STD-001`, `UCOS-EXP-STD-006`).

## Consequences
- (+) Consistent behavior and capability parity across channels; single source of journey truth.
- (+) New channels added without redefining flows.
- (−) Requires disciplined separation of flow from presentation.
- No UI implementation, framework, or device target is selected here (deferred to Prompt 08/10).

## Traceability
- Refines: `CTX-ARCHB-001`, `UCOS-EXP-ARCH-001` §3/§5.
- Affects: all surfaces and journeys.
