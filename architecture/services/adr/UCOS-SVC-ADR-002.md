# UCOS-SVC-ADR-002 — Contract-First at Every Seam (Article IV)

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-SVC-ADR-002` |
| Status | Accepted (generated) v1.0.0 |
| Phase | 10.2B — Prompt 07 |
| Parent | `UCOS-SVC-ARCH-001` |
| Date | 2026-06-30 |

## Context
Constitution Article IV mandates contract-first: every integration seam must have an explicit,
versioned contract before any implementation. `UCOS-DOM-ARCH-001` §VIII declares all cross-context
seams.

## Decision
Author a **versioned contract for every declared seam** ahead of any code. Synchronous read/command
seams → API contracts; state-propagation seams → event contracts; payloads → data contracts. The
contracts are the single source of integration truth; Prompt 10 implements strictly from them.

## Consequences
- 100% seam coverage (`TM-SVC-002`); no undeclared or uncovered seam.
- Implementation is gated on contract existence and contract-test pass (Q4, Prompt 11).
- Article IX honored: contracts are design artifacts, not code.

## Alternatives rejected
- Implementation-first / contract-by-extraction (violates Art. IV; produces drift).

## Traceability
Refines `UCOS-CONST-001` Art. IV, AUTH-004; refined by Prompts 10/11.
