# services/

Reserved for **backend services / bounded-context implementations** (domain services, application services, integration services).

> EMPTY BY DESIGN. No service code is generated during bootstrap.
> Populated only after service/API architecture (Prompt 07) and the implementation factory (Prompt 10).

Each service added later MUST:
- map 1:1 (or clearly) to a bounded context in the Domain Catalog,
- expose only contract-first APIs registered in `specifications/contracts/`,
- pass security, quality, and production-readiness gates.
