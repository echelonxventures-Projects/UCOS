# UCOS-EXP-ADR-006 — Unified Console Shell with Role-Based Navigation

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-EXP-ADR-006` |
| Status | Accepted (generated; ratification deferred) |
| Phase | Phase 10.2A — Prompt 06 |
| Authority | `SKILL-007`, `UCOS-EXP-IA-003`, `AUTH-009` |
| Date | 2026-06-30 |

## Context
Internal surfaces (merchandising, operations, support, governance, IAM, compliance, observability,
configuration) share interaction patterns and operators often work across several.

## Decision
All console-class surfaces (S-005, S-006, S-008, S-009, S-010, S-011, S-012, S-013) share a **unified
console shell** with **role-/permission-scoped navigation** (`UCOS-EXP-IA-003`). Navigation expresses, but
does not enforce, access; authorization design is owned by Prompt 09.

## Consequences
- (+) Consistent operator experience; reduced training/cognitive load; reuse of shell + components.
- (+) Capability-grouped, entitlement-driven menus.
- (−) Requires a shared shell contract in the design system (`UCOS-EXP-STD-001`).
- Access enforcement is deferred to security (Prompt 09); this ADR defines presentation only.

## Traceability
- Refines: `UCOS-EXP-ARCH-001` §4 (`UCOS-EXP-IA-003`).
- Affects: all console-class surfaces.
