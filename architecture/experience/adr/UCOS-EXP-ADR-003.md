# UCOS-EXP-ADR-003 — WCAG 2.2 AA as Non-Waivable Accessibility Baseline

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-EXP-ADR-003` |
| Status | Accepted (generated; ratification deferred) |
| Phase | Phase 10.2A — Prompt 06 |
| Authority | `SKILL-007`, `CTX-ARCHB-001` §6 (quality attributes), `AUTH-009` |
| Date | 2026-06-30 |

## Context
Accessibility is a requirement, not an enhancement (`SKILL-007`). UCOS surfaces serve diverse audiences and
must be inclusive and legally defensible.

## Decision
**WCAG 2.2 AA** is the **non-waivable** accessibility baseline for **every** surface
(`UCOS-EXP-STD-002`). Each surface (S-001..014) must demonstrate conformance; no surface may ship without it.

## Consequences
- (+) Uniform, auditable accessibility across all 14 surfaces (§8.3, 14/14).
- (+) Accessibility designed in from the start, not retrofitted.
- (−) Component design and content authoring carry mandatory accessibility constraints.
- Conformance testing/tooling is owned by Prompt 11 (validation), not defined here.

## Traceability
- Refines: `UCOS-EXP-ARCH-001` §5/§8.3.
- Affects: all surfaces; design system (`UCOS-EXP-STD-001`).
