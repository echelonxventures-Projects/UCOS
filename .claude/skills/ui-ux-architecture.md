# Skill — UI/UX Architecture

**Skill ID:** SKILL-007
**Governs:** Experience architecture (Prompt 06) and `apps/`, `architecture/experience/`.

## Purpose
Define experience surfaces, design-system contracts, and channel strategy.

## When to apply
When designing user-facing channels, flows, and shared UI contracts.

## Standards & Rules
1. Experiences consume services only through published API contracts.
2. Define a design system / component contract for consistency and reuse.
3. Accessibility (WCAG) is a requirement, not an enhancement.
4. Channel-agnostic core flows; channel-specific presentation at the edge.
5. State, error, loading, and empty states are explicitly designed.
6. Internationalization, localization, and theming are first-class.

## Inputs
- Capability/domain models, API contracts, brand/UX requirements.

## Outputs
- Experience map, design-system contracts, key flow specifications.

## Definition of Done
- Surfaces traced to capabilities; accessibility & i18n addressed; contracts referenced.

## Anti-patterns
- UI calling internal models directly; inconsistent components; inaccessible flows.

## Traceability
- Refines: SKILL-004, CTX-ARCHB-001
- Feeds: implementation factory, testing-architecture.
