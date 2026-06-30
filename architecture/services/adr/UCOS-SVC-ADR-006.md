# UCOS-SVC-ADR-006 — Data Contracts Reference Authoritative Data Entities (No Redefinition)

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-SVC-ADR-006` |
| Status | Accepted (generated) v1.0.0 |
| Phase | 10.2B — Prompt 07 |
| Parent | `UCOS-SVC-ARCH-001` |
| Date | 2026-06-30 |

## Context
The Data Architecture is RATIFIED — AUTHORITATIVE (`UCOS-LDATA-ARCH-001` `LDO-001..073`;
`UCOS-PDATA-ARCH-001` `PDE-001..073`). Persistence neutrality (PD-GOV-002) and single ownership of data
(AUTH-007) must be preserved; contracts must not redefine schemas.

## Decision
Data contracts (`UCOS-DATA-CONTRACT-001..028`) **reference** the owning domain's `LDO-*`/`PDE-*` entities
and **inherit** classification (`MC-01`); they define payload *families* (read models, command payloads,
event payloads) at the boundary level only. No fields, keys, tables, storage, DDL, or serialization are
authored.

## Consequences
- Zero data-schema redefinition; classification inherited (least-exposure per `UCOS-EXP-STD-007`).
- Field-level physical schema remains owned by Prompt 05; technology binding deferred to Prompt 08.
- PII/sensitive payload handling is `FLAGGED FOR PROMPT 09`.

## Alternatives rejected
- Authoring fresh contract schemas (duplicates/forks data truth; violates AUTH-007/PD-GOV-002).

## Traceability
Refines `UCOS-LDATA-ARCH-001`, `UCOS-PDATA-ARCH-001`, AUTH-007; refined by Prompt 09/10.
