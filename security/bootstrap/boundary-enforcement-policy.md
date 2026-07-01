# WI-SEED.3 — Boundary Enforcement Policy (S1 from day one)

**Control:** SEC-CTL-014 (Boundary authn/authz enforcement) · **Checkpoint:** GATE-SEC-001 **S1**
(non-waivable) · **ADR:** ADR-006 · **PI:** PI-1.

## Policy
Every exposed boundary of every PI-1 foundation component MUST, before processing any request:
1. Terminate on **mTLS STRICT** (workload authentication) — `mesh/mtls-strict.yaml` (S1 via SEC-CTL-014;
   S4 via SEC-CTL-008).
2. Evaluate authorization via the **deny-by-default** policy — `opa/deny-by-default.rego` (S1 via
   SEC-CTL-002; least-privilege S5 via SEC-CTL-013).
3. Reject any request that is non-mTLS, from an unknown workload identity, or from an external origin.

## PI-1 exposure posture (Risk R-2 mitigation)
- Foundation boundaries (`API-018`, `API-027`) are **internal-only**; **no external exposure** in PI-1.
- Workload identity (mTLS) satisfies **S1** for internal boundaries now; full **user/tenant OIDC identity**
  (PE-08) is delivered in **PI-2 before any external exposure**.

## Non-waivability
- **S1/S3/S4 are non-waivable (IC-1 / Const. Art. XII / AUTH-008).** No temporary waiver, permissive mode,
  or dev-exempt posture is permitted. A boundary that cannot enforce S1 MUST NOT be created (§8.3 stop-work
  in `UCOS-IMP-KICK-PI1-001`).

## Traceability
ADR-006 · `UCOS-SEC-CONTROL-001` SEC-CTL-001/002/014 (S1), 008 (S4), 013/017 (S5) · `GATE-SEC-001` S1 ·
IC-1 · FO-1 (per-contract threat model discharged at Platform Validation, step [6]).
