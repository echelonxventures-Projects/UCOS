# apps/

Reserved for **user-facing applications** (web, admin, console, mobile shells, storefront experiences).

> EMPTY BY DESIGN. No application code is generated during bootstrap.
> Populated only after experience architecture (Prompt 06) and the implementation factory (Prompt 10).

Each app added later MUST:
- trace to an experience-architecture artifact,
- consume services only via published contracts in `specifications/contracts/`,
- comply with the constitution and quality/security gates.
