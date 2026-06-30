# Skill — Platform Engineering

**Skill ID:** SKILL-009
**Governs:** Platform architecture (Prompt 08), `infra/`.

## Purpose
Define runtime topology, environments, delivery pipelines, and operability foundations.

## When to apply
When selecting technology, defining environments, CI/CD, and operational tooling.

## Standards & Rules
1. Technology choices are governed decisions recorded as ADRs in the registry.
2. Infrastructure is declarative, reproducible, and version-controlled (IaC).
3. Environment configuration is separated from code and from secrets.
4. Pipelines enforce gates (quality, security, documentation) before promotion.
5. Observability (logs/metrics/traces), health, and SLOs are platform-provided.
6. Resilience patterns (autoscaling, failover, backups) are designed and tested.

## Inputs
- Architecture baseline, service designs, security architecture, non-functional requirements.

## Outputs
- Runtime topology, environment model, pipeline design, ADRs, operability standards.

## Definition of Done
- Reproducible environments; gated pipelines; observability and recovery defined.

## Anti-patterns
- Snowflake environments; manual provisioning; secrets in IaC; ungated promotion.

## Traceability
- Refines: CTX-ARCHB-001, SKILL-003, SKILL-008
- Feeds: release-gates, production-readiness.
