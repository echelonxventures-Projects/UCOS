# infra/runtime/

**Runtime & Compute substrate IaC — `WP-PLT-01` (PE-01).**

> Established by **WI-SEED.1** (structure) and populated by **WI-SEED.2 (Platform Bootstrap)**, Phase 11.3.
> Declarative infrastructure-as-code only (no live provisioning performed by the seed).

Scope:
- OCI container runtime + Kubernetes conformance baseline (**ADR-001**).
- Consumed by ENV-DEV/ENV-INT modules under `infra/environments/` (no ENV-PROD in PI-1).

Contents:
- `kubernetes-baseline.yaml` — namespaces, baseline workload policy (conformance profile).

**Traceability:** ADR-001 · ADR-007 (IaC) · `PEA-001` PE-01/PE-15 · `UCOS-IMP-DELIV-001` §4.
