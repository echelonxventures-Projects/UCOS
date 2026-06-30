# UCOS-SVC-ADR-004 — Synchronous APIs for Reads/Commands, Events for State Propagation

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-SVC-ADR-004` |
| Status | Accepted (generated) v1.0.0 |
| Phase | 10.2B — Prompt 07 |
| Parent | `UCOS-SVC-ARCH-001` |
| Date | 2026-06-30 |

## Context
Seams in `UCOS-DOM-ARCH-001` §VIII carry different intents: synchronous truth reads and commitments
(CS/CF reads, command handoffs) vs. asynchronous state propagation (CF event projection). A platform
event catalog already exists (`UCOS-PEA-003` `PEV-001..073`).

## Decision
- **Synchronous request/response API contracts** for reads and commands requiring an immediate result.
- **Asynchronous event contracts** for state propagation; each realizes platform events (`PEV-*`, whose
  payload authority was deferred to Prompt 07).
- State-changing handoffs use a command API **plus** a confirming event (e.g., `OrderPlaced`).

## Consequences
- Loose coupling for propagation; strong consistency where a synchronous result is needed.
- Tolerant-reader + at-least-once + idempotency-key declared as event contract obligations.
- Concrete protocol/broker selection deferred to Prompt 08.

## Alternatives rejected
- Events-only (poor fit for synchronous reads such as availability/price quote).
- Synchronous-only (brittle coupling for cross-domain propagation).

## Traceability
Refines `UCOS-DOM-ARCH-001` §VIII, `UCOS-PEA-003`; refined by Prompt 08/10/11.
