# UCOS-EXP-ADR-002 — Surface Taxonomy: Storefront / Console / Portal Separation

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-EXP-ADR-002` |
| Status | Accepted (generated; ratification deferred) |
| Phase | Phase 10.2A — Prompt 06 |
| Authority | `UCOS-DOM-ARCH-001`, `UCOS-CAP-ARCH-001`, `SKILL-007` |
| Date | 2026-06-30 |

## Context
Audiences differ sharply: shoppers, customers, internal operators, partners, and governance/security
administrators have distinct goals, risk profiles, and entitlements.

## Decision
Surfaces are organized into three classes — **Storefront** (consumer-facing), **Console** (internal
admin/operator/governance), and **Portal/Self-service** (customer/partner/developer) — per
`UCOS-EXP-IA-001`. Each surface maps to specific capabilities/domains (`UCOS-EXP-ARCH-001` §2).

## Consequences
- (+) Clear audience/risk separation; entitlement and IA models align to class.
- (+) Console surfaces share a unified shell (`UCOS-EXP-ADR-006`).
- (−) Some capabilities appear in multiple classes (intentional, e.g. CAP-05 in storefront + console).

## Traceability
- Refines: `UCOS-EXP-ARCH-001` §2/§4.
- Affects: surface catalog, IA models.
