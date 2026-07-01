# infra/persistence/

**Persistence & Storage substrate IaC — `WP-PLT-02` (PE-02).**

> Established by **WI-SEED.1** (structure). Populated when `WP-PLT-02` commences at sequence step [4]
> (`UCOS-IMP-KICK-PI1-001` §5), gated by precondition **PC-2** (secrets/key primitive, WI-SEED.5).
> Declarative code only — no live provisioning by the seed.

Scope (**ADR-002**):
- PostgreSQL system-of-record (ACID; single-SoR `PEP-005`).
- S3-compatible object storage, OpenSearch, Redis cache.
- **Excluded:** analytical/OLAP store (`ADR-002A` deferred — IC-7).

Security:
- Non-waivable **S4** encryption-at-rest with **externalized keys** consumed by reference from WI-SEED.5
  (SEC-CTL-009); PII classification honored from `UCOS-PDATA-ARCH-001` (SEC-CTL-010).

**Traceability:** ADR-002 · `PEA-001` PE-02 · `UCOS-PDATA-ARCH-001` · SEC-CTL-009/010 · `PRS-005/006`.
