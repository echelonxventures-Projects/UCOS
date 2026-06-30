# UCOS-EXP-ADR-004 — Metadata-Driven Variability (No Code Forks)

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-EXP-ADR-004` |
| Status | Accepted (generated; ratification deferred) |
| Phase | Phase 10.2A — Prompt 06 |
| Authority | Constitution Art. V, `AUTH-003` (IP-04 / IP-H / P3), `UCOS-INF-ARCH-001` |
| Date | 2026-06-30 |

## Context
UCOS must span B2C/B2B/B2B2C/marketplace/subscription/hybrid and many tenants/brands/locales without forking
the core (G1/G3).

## Decision
All experience variability — theming, branding, feature exposure, locale/currency/format — is expressed as
**metadata/configuration, never code forks** (`UCOS-EXP-STD-004`, `UCOS-EXP-STD-005`). Variability resolves
from metadata constructs (`MC-13` Information Metadata; classification `MC-01`) at the edge.

## Consequences
- (+) One experience core serves all commerce models and tenants; no branched meaning.
- (+) Configuration is governed data, traceable to `UCOS-INF-ARCH-001`.
- (−) Requires a robust metadata resolution mechanism (owned by Prompt 07/08/10, not here).
- No metadata class is created or modified by this ADR.

## Traceability
- Refines: `UCOS-INF-ARCH-001`, `UCOS-EXP-ARCH-001` §5/§7.4.
- Affects: theming, i18n, feature variability across all surfaces.
