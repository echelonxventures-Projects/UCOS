# UCOS-SVC-ADR-003 — Experience BFFs for Surface Aggregation

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-SVC-ADR-003` |
| Status | Accepted (generated) v1.0.0 |
| Phase | 10.2B — Prompt 07 |
| Parent | `UCOS-SVC-ARCH-001` |
| Date | 2026-06-30 |

## Context
Experience surfaces (`UCOS-EXP-SURFACE-001..014`) and journeys consume multiple services. ECRs are
consumer-driven (`UCOS-EXP-CR-001..021`). Surfaces must not couple directly to many service contracts
nor own domain truth.

## Decision
Introduce two **Backends-for-Frontends** hosted by `UCOS-SVC-028`: `UCOS-API-CONTRACT-029` (Storefront
BFF) and `UCOS-API-CONTRACT-030` (Console BFF). BFFs aggregate downstream service contracts into
consumer-shaped operations; they own **no** domain model and persist **no** truth.

## Consequences
- ECR → operation mapping is satisfied via BFFs while preserving service boundaries (`TM-SVC-003`).
- Channel-agnostic core flows preserved (`UCOS-EXP-ADR-001`); edge presentation deferred to Prompt 10.
- Navigation/entitlement enforcement at BFFs is `FLAGGED FOR PROMPT 09`.

## Alternatives rejected
- Direct surface-to-service fan-out (tight coupling, inconsistent aggregation).
- A single mega-gateway owning aggregation logic for all surfaces (mixes storefront/console concerns).

## Traceability
Refines `UCOS-EXP-ARCH-001`, AUTH-004; refined by Prompts 09/10.
