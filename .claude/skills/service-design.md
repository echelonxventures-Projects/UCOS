# Skill — Service Design

**Skill ID:** SKILL-003
**Governs:** Service/application architecture (Prompt 07) and `services/`.

## Purpose
Design services that align to bounded contexts, are contract-first, resilient, and operable.

## When to apply
When defining service responsibilities, granularity, communication, and runtime behavior.

## Standards & Rules
1. A service maps to a bounded context (or a cohesive slice of one); avoid distributed monoliths.
2. Contract-first: define the API/event contract before implementation.
3. Stateless where possible; externalize state; design for horizontal scale.
4. Idempotent operations; explicit timeouts, retries, and backpressure.
5. Synchronous coupling minimized; prefer async events for cross-context flows.
6. Every service defines health, readiness, metrics, logs, and traces.

## Inputs
- Bounded contexts, capability specs, architecture baseline.

## Outputs
- Service catalog, responsibilities, interaction diagrams, SLAs/SLOs.

## Definition of Done
- Each service: traced to a context, contract-defined, observable, resilience-specified.

## Anti-patterns
- Chatty synchronous chains; shared databases across services; hidden coupling.

## Traceability
- Refines: CTX-ARCHB-001, CTX-DOM-001
- Feeds: api-design, platform-engineering, testing-architecture.
