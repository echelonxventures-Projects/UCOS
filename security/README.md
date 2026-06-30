# security/

Reserved for **security implementation assets** (policies-as-code, threat models, control mappings, secrets-management patterns, audit tooling).

> EMPTY BY DESIGN. No security implementation is generated during bootstrap.
> Architectural decisions are governed by `.claude/skills/security-architecture.md` and `.claude/governance/security-gates.md`.

Each security artifact added later MUST:
- map to a defined control and threat,
- enforce least-privilege and zero-trust defaults,
- be auditable and versioned.
