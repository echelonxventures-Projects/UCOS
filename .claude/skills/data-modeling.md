# Skill — Data Modeling

**Skill ID:** SKILL-005
**Governs:** Data architecture (Prompt 05) and `architecture/data/`.

## Purpose
Define canonical, well-governed data models, ownership, and contracts.

## When to apply
When modeling persistent state, canonical entities, events, and data contracts.

## Standards & Rules
1. Each datum has a single owning bounded context (data ownership is explicit).
2. Model for invariants and integrity; choose consistency model deliberately (strong vs eventual).
3. Separate canonical/internal models from external data contracts.
4. Define data classification (PII, financial, sensitive) and retention up front.
5. Version data contracts and event schemas; evolve compatibly.
6. Design for auditability, lineage, and idempotent ingestion.

## Inputs
- Domain models, security/privacy requirements, integration patterns.

## Outputs
- Canonical models, schema contracts, classification & retention policy.

## Definition of Done
- Ownership, classification, consistency, and versioning are all specified and traced.

## Anti-patterns
- Shared cross-context databases; unclassified PII; schema-by-accident; hidden denormalization.

## Traceability
- Refines: SKILL-002, CTX-ARCHB-001
- Feeds: api-design, security-architecture, metadata-architecture.
