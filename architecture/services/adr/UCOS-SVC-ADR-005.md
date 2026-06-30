# UCOS-SVC-ADR-005 — Semantic Versioning & Migration-Only Contract Evolution

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-SVC-ADR-005` |
| Status | Accepted (generated) v1.0.0 |
| Phase | 10.2B — Prompt 07 |
| Parent | `UCOS-SVC-ARCH-001` |
| Date | 2026-06-30 |

## Context
Contracts must evolve without breaking consumers (PEP-016 migration-only; PEP-017 backward
compatibility; AUTH-009). UCOS forbids destructive change and deletion (registry rule 3).

## Decision
Adopt `vMAJOR.MINOR` for all contracts (`UCOS-SVC-POLICY-001`): MINOR = additive/backward-compatible;
MAJOR = breaking, with previous MAJOR retained and deprecated (never deleted); at most N and N-1 served
concurrently; `Supersedes`/`Superseded-By` recorded in `CTX-REG-001`.

## Consequences
- Safe, governed evolution; consumers migrate within a deprecation window.
- Deprecation-window duration is SLA-dependent → **PENDING ASR RATIFICATION**.
- Version transitions gated by contract tests (`UCOS-SVC-CTEST-001`).

## Alternatives rejected
- Unversioned/"latest-only" contracts (breaks consumers; violates compatibility canon).
- Date-based versioning (less explicit about break semantics for this governance model).

## Traceability
Refines AUTH-009, PEP-016/017; refined by Prompt 11.
