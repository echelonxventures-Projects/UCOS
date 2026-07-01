# security/bootstrap/

**WI-SEED.3 Security Bootstrap + WI-SEED.5 Secrets & Key Bootstrap — PI-1.**

> Establishes the **day-one enforcement scaffolding** for non-waivable **S1/S3/S4** so that no boundary can
> exist unprotected (IC-1 / Const. Art. XII). **No temporary waivers are permitted (P4).**

| Path | Work item | Purpose | Controls |
|------|-----------|---------|----------|
| `mesh/mtls-strict.yaml` | WI-SEED.3 | mTLS STRICT transport (mesh-neutral) | SEC-CTL-008 (S4), 014 (S1) |
| `opa/deny-by-default.rego` | WI-SEED.3 | deny-by-default authorization baseline | SEC-CTL-002 (S1), 013 (S5) |
| `boundary-enforcement-policy.md` | WI-SEED.3 | S1 boundary enforcement mapping | SEC-CTL-001/002/014 (S1) |
| `secrets/` | WI-SEED.5 | secrets/KMS by-reference + rotation | SEC-CTL-005/006/007 (S3), 009 (S4) |

**Technology neutrality (PEP-010 / IC-7):** ADR-006 selects a *neutral* mTLS-mesh and *neutral* secrets/KMS
contract; concrete product binding (mesh, IdP, KMS) is a governed `WP-PLT-03/08/09` decision within ADR-006
and is NOT bound by the seed. OPA policy-as-code IS the ratified selection (ADR-006).

**Enforcement invariant:** every ENV-DEV/INT boundary is workload-authenticated (mTLS) + deny-by-default;
**no boundary is externally exposed in PI-1** (R-2). Full user/tenant OIDC identity (PE-08) lands in PI-2
**before** any external exposure.

**Traceability:** ADR-006 · `UCOS-SEC-CONTROL-001` (S1/S3/S4 rows) · `PEA-007` (design discipline) ·
IC-1/IC-6 · FO-1/FO-2/FO-3.
