# Skill — Domain-Driven Design (DDD)

**Skill ID:** SKILL-002
**Governs:** Domain architecture (Prompt 03) and any model-bearing artifact.

## Purpose
Decompose the business into well-bounded contexts with a ubiquitous language and clear maps.

## When to apply
Whenever defining domains, models, aggregates, context boundaries, or integration relationships.

## Standards & Rules
1. Use the ubiquitous language from `UCOS-GLOSSARY.md`; extend it there, not ad hoc.
2. Each bounded context owns its model; no shared mutable models across contexts.
3. Define aggregates with clear invariants and transactional boundaries.
4. Document the context map: relationships (partnership, customer-supplier, conformist, ACL).
5. Use anti-corruption layers when integrating with foreign/legacy models.
6. Distinguish core, supporting, and generic subdomains; invest accordingly.

## Inputs
- Domain Catalog candidates, Capability Catalog, Glossary, Vision.

## Outputs
- Ratified bounded contexts, aggregates, domain events, context map (under `architecture/domains/`).

## Definition of Done
- Every context traces to ≥1 capability; boundaries and integration patterns documented.

## Anti-patterns
- Anemic domain models; god aggregates; leaking entities across contexts; CRUD-as-domain.

## Traceability
- Refines: CTX-DOM-001, CTX-CAP-001, CTX-GLOSS-001
- Feeds: service-design, api-design, data-modeling.
