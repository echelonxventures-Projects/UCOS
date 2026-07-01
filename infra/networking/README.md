# infra/networking/

**Networking & Connectivity substrate IaC — `WP-PLT-03` (PE-03).**

> Established by **WI-SEED.1** (structure). Zero-trust transport policy is seeded by **WI-SEED.3 (Security
> Bootstrap)** under `security/bootstrap/mesh/`; environment wiring lands with `WP-PLT-03` at sequence
> step [2] (`UCOS-IMP-KICK-PI1-001` §5). Declarative code only — no live provisioning by the seed.

Scope:
- mTLS service mesh (strict), network segmentation / zero-trust transport (**ADR-006** networking facet).
- Enforces non-waivable **S4** (encryption in transit) and contributes to **S1** (boundary) from day one.

**Traceability:** ADR-006 · `PEA-001` PE-03 · SEC-CTL-008/014/017 · `PRS-010/011`.
