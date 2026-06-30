# UCOS-EXP-ADR-005 — Contract-First Consumption (Contracts Deferred to Prompt 07)

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-EXP-ADR-005` |
| Status | Accepted (generated; ratification deferred) |
| Phase | Phase 10.2A — Prompt 06 |
| Authority | `CTX-ARCHB-001` §1/§3 (contract-first), `AUTH-004`, `SKILL-007` |
| Date | 2026-06-30 |

## Context
Experiences must not couple to internal domain models; UCOS mandates contract-first boundaries
(`CTX-ARCHB-001` §3). However, contracts are owned by Prompt 07, which has not executed.

## Decision
Surfaces consume services **only through published contracts**. The experience layer expresses its needs as
**Experience Consumption Requirements** (`UCOS-EXP-CR-001..021`) — forward dependencies handed to Prompt 07.
No API/event/data contract, schema, endpoint, or payload is defined in the experience layer.

## Consequences
- (+) Clean separation; experiences never call internal models directly (anti-pattern avoided).
- (+) Prompt 07 receives a complete, traceable consumption-requirement set (C-2 enablement).
- (−) Experience realization (Prompt 10) is blocked until contracts exist and Article IX lock is released.

## Traceability
- Refines: `CTX-ARCHB-001`, `UCOS-EXP-ARCH-001` §6.
- Affects: ECR-001..021; feeds Prompt 07.
