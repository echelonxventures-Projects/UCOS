# release/

Reserved for **release engineering and certification assets** (release plans, versioning policy, change logs, certification records, rollout/rollback strategies).

> EMPTY BY DESIGN. No release artifacts are generated during bootstrap.
> Release policy is governed by `.claude/governance/release-gates.md`.

Each release artifact added later MUST:
- reference passing quality, security, and documentation gates,
- carry a certification record from the certification factory (Prompt 12),
- include a rollback strategy.
