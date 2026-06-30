# Skill — API Design

**Skill ID:** SKILL-004
**Governs:** Contract definition (Prompt 07) and `specifications/contracts/`.

## Purpose
Produce explicit, versioned, interoperable contracts at every boundary.

## When to apply
Whenever a boundary is exposed: REST, GraphQL, gRPC, events/webhooks.

## Standards & Rules
1. Contract-first using machine-readable specs (OpenAPI, AsyncAPI, GraphQL SDL, JSON Schema).
2. Consistent resource naming, error model, pagination, filtering, and idempotency conventions.
3. Explicit versioning; no breaking changes without a new version + deprecation policy.
4. Security defined per endpoint (authn, authz scopes, rate limits).
5. Backward compatibility and contract tests are mandatory.
6. Document semantics, not just syntax (pre/post-conditions, idempotency, side effects).

## Inputs
- Service design, domain models, security architecture.

## Outputs
- Versioned contract artifacts registered in the Artifact Registry.

## Definition of Done
- Contract validates, is versioned, security-annotated, and consumer-verifiable.

## Anti-patterns
- Implementation-leaking APIs; undocumented errors; silent breaking changes; chatty endpoints.

## Traceability
- Refines: SKILL-003, CTX-ARCHB-001
- Feeds: experience, integration, testing-architecture.
