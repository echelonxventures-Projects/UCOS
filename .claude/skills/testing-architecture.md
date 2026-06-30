# Skill — Testing Architecture

**Skill ID:** SKILL-010
**Governs:** Quality engineering, `quality/`, and `.claude/governance/quality-gates.md`.

## Purpose
Define a layered, traceable test strategy that verifies behavior against specifications.

## When to apply
Whenever defining how an artifact/increment will be verified.

## Standards & Rules
1. Test pyramid: unit → integration → contract → end-to-end → non-functional.
2. Contract tests verify provider/consumer compatibility at every boundary.
3. Tests trace to acceptance criteria in `specifications/acceptance/`.
4. Non-functional testing (performance, security, resilience) is explicit.
5. Coverage policy is defined and enforced; flaky tests are defects.
6. Test data is governed; no production PII in test environments.

## Inputs
- Specifications, contracts, acceptance criteria, quality gates.

## Outputs
- Test strategy, test suites configuration, coverage policy, validation harness design.

## Definition of Done
- Each acceptance criterion has a verifying test; gates can consume results.

## Anti-patterns
- Testing implementation not behavior; no contract tests; untraced tests; ignored flakiness.

## Traceability
- Refines: SKILL-004, CTX-PRIN-001 (P10)
- Feeds: validation factory (Prompt 11), certification (Prompt 12).
