# Skill — Metadata Architecture

**Skill ID:** SKILL-006
**Governs:** Meta/configuration architecture (Prompt 04) and `architecture/meta/`.

## Purpose
Express commerce-model variability as governed metadata/configuration, not code forks.

## When to apply
Whenever behavior must vary by tenant, channel, region, or business model.

## Standards & Rules
1. Variability is data: configuration schemas, feature flags, policy/rule definitions.
2. Configuration is validated against schemas and versioned like contracts.
3. Separation of configuration from code and from environment secrets.
4. Safe defaults; explicit precedence/override rules; deterministic resolution.
5. Configuration changes are auditable and reversible.
6. No per-tenant code branches; tenancy is a configuration dimension.

## Inputs
- Capability/domain models, multi-model requirements (B2C/B2B/marketplace/etc.).

## Outputs
- Metadata model, configuration schemas, resolution rules, governance for changes.

## Definition of Done
- Variability points enumerated; schema-validated; override semantics defined; audit-ready.

## Anti-patterns
- Hardcoded branches; tenant-specific forks; unvalidated free-form config; hidden coupling.

## Traceability
- Refines: CTX-PRIN-001 (P3), CTX-ARCHB-001
- Feeds: service-design, data-modeling, platform-engineering.
