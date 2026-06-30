# Skill — Security Architecture

**Skill ID:** SKILL-008
**Governs:** Security architecture (Prompt 09), `security/`, and `.claude/governance/security-gates.md`.

## Purpose
Embed zero-trust, least-privilege, and privacy-by-design into every layer.

## When to apply
Across all design and before any network-exposed capability is accepted.

## Standards & Rules
1. Zero-trust: authenticate and authorize every request; never trust the network.
2. Least-privilege for identities, services, and data access.
3. Threat-model each context (e.g., STRIDE); map threats to controls.
4. Encrypt in transit and at rest; manage secrets via a vault, never in code/artifacts.
5. Data privacy: classify, minimize, define retention, support data-subject rights.
6. Auditability: security-relevant events are logged immutably.

## Inputs
- Domain/service designs, data classification, contracts, compliance requirements.

## Outputs
- Threat models, control mappings, identity & trust architecture, secrets strategy.

## Definition of Done
- Every exposed boundary has authn/authz; threats mapped to controls; secrets externalized.

## Anti-patterns
- Implicit trust; broad scopes; secrets in code; unlogged privileged actions.

## Traceability
- Refines: CTX-CONST-001 (Art. VI), CTX-PRIN-001 (P6)
- Feeds: security-gates, production-readiness, certification.
