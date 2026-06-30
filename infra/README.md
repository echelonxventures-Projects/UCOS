# infra/

Reserved for **infrastructure-as-code and platform engineering assets** (environments, pipelines, IaC modules, observability, runtime topology).

> EMPTY BY DESIGN. No infrastructure code is generated during bootstrap.
> Populated only after platform engineering architecture (Prompt 08).

Each infra artifact added later MUST:
- be declarative and reproducible,
- separate environment configuration from code,
- pass security gates before any live-resource provisioning.
