# Skill — Constitutional Compliance

**Skill ID:** SKILL-001
**Governs:** Every artifact and generation step.
**Authority source:** `.claude/context/UCOS-CONSTITUTION.md`, `UCOS-PRINCIPLES.md`

## Purpose
Ensure all work conforms to the UCOS Constitution and Principles before it is accepted.

## When to apply
At the start and end of every prompt/generator, and as a precondition to any gate.

## Standards & Rules
1. Verify precedence order is respected (Constitution → Principles → Baseline → Gates → Specs → Impl).
2. Confirm no artifact contradicts a higher-precedence artifact.
3. Confirm Articles I–X are satisfied for the produced scope.
4. Reject generation that violates Article IX (no premature platform/domain/service/code).

## Inputs
- Constitution, Principles, the candidate artifact(s).

## Outputs
- A compliance checklist result (pass/fail per article) recorded with the artifact.

## Definition of Done
- Every applicable article is explicitly evaluated; violations are logged as gaps.

## Anti-patterns
- Implicit compliance ("looks fine"); skipping articles; silent precedence violations.

## Traceability
- Refines: CTX-CONST-001, CTX-PRIN-001
- Feeds: all governance gates, gap-detection, certification.
