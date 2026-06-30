# UCOS-SVC-ADR-001 — One Service per Bounded Context

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-SVC-ADR-001` |
| Status | Accepted (generated) v1.0.0 |
| Phase | 10.2B — Prompt 07 |
| Parent | `UCOS-SVC-ARCH-001` |
| Date | 2026-06-30 |

## Context
`UCOS-DOM-ARCH-001` defines 28 bounded contexts, each with one model + one ubiquitous language
(AUTH-003 P4 / IP-07) and no shared mutable models (AUTH-005 §6.4). Service boundaries must preserve
these invariants.

## Decision
Define exactly **one service per bounded context** (`UCOS-SVC-001..028`), owning that context's model
and exposing it only via published contracts. A context MAY later be realized by multiple runtime
services (`PRS-*`) without changing the contract boundary.

## Consequences
- Contract boundaries align 1:1 with ratified domains → clean traceability (`TM-SVC-001`).
- No cross-service shared mutable model; integration only via declared seams.
- Service implementation/runtime is **not** decided here (Prompt 08/10).

## Alternatives rejected
- Service-per-capability (capabilities span multiple domains; would split single-owner truth).
- Coarse "modular monolith" single service (violates boundary integrity at the contract layer).

## Traceability
Refines AUTH-003/005, `UCOS-DOM-ARCH-001`; refined by Prompt 08/10.
