# security/bootstrap/secrets/ — WI-SEED.5 Secrets & Key Bootstrap

**Bounded secrets/key primitive (subset of ADR-006) — PI-1.** Formalizes readiness finding **NB-1** /
precondition **PC-2** (`UCOS-IMP-RDY-PI1-001`).

> Provides the minimal secrets manager / KMS primitive that lets PI-1 satisfy **S3** (secrets vault-managed)
> and **S4** (externalized encryption-at-rest keys) **before** the full Secrets & Key Management service
> (`WP-PLT-09`, PE-09) lands in PI-2. Superseded/hardened by `WP-PLT-09` migration-only (IC-7).

## Absolute rule (S3 — non-waivable)
**No secret material is EVER stored in this repository.** All secrets and keys are issued and resolved
**by reference** (opaque `external://` handles). `secret-references.yaml` contains only *references*, never
values. Any literal secret committed is a **hard-stop** (§8.3 stop-work) and a `GATE-SEC-001` S3 failure.

## Interface (neutral — ADR-006)
| Capability | Control | Purpose |
|-----------|:-------:|---------|
| Secret issuance & resolution by reference | SEC-CTL-005 (S3) | inject DB creds, tokens, signing keys — never inline |
| Key lifecycle (generate/use/destroy) | SEC-CTL-006 (S3/S4) | mTLS CA keys, at-rest data keys |
| Rotation | SEC-CTL-007 (S3) | see `rotation-policy.md` |
| At-rest key provision | SEC-CTL-009 (S4) | externalized keys for `WP-PLT-02` encryption |

The **concrete KMS/secrets product** is a governed `WP-PLT-09` decision within ADR-006's neutral contract
(PEP-010 / IC-7) — **not** selected by the seed.

## Consumers (PI-1)
- WI-SEED.2 platform IaC (`var.secret_refs`) · WI-SEED.3 mTLS CA keys · WI-SEED.4 signing key ref ·
  WP-PLT-02 at-rest keys · WP-PLT-11 config service (secrets excluded from config per ADR-005).

**Traceability:** ADR-006 · `UCOS-SEC-CONTROL-001` SEC-CTL-005/006/007 (S3), 009 (S4) · IC-1 · NB-1/PC-2.
