# services/platform/operational-proof/

**B02 — Operational Proof Fabric service delivery (Monitoring, Telemetry, Observability, Audit,
Incident Tracking, Health Monitoring, Operational Evidence).**

This service is the deployable surface of the `@ucos/platform-runtime` **Operational Proof Fabric**
(`src/control/operations/`). It realizes the ratified fabric behavior over durable infrastructure:

- **Real-time plane** (ephemeral, bounded, backpressure): telemetry ingest → in-memory time-series →
  observability / health / SLO / alert evaluation. Never persisted raw; sealed into evidence.
- **Proof plane** (durable, governed): operational evidence + incident records are signed, versioned,
  hash-chained, and persisted **only** through the Evolution Fabric into the PostgreSQL SoR
  (`dom_ops`). Tamper-evident audit chain is independently verifiable and cross-node reconcilable.

**Non-negotiables (inherited platform invariants):**
- Registry-driven — no hardcoded tenants, thresholds, SLOs, or authorities (all runtime data).
- Multi-tenant — deny-by-default tenant isolation; per-tenant trust clamps; tenant-partitioned keys.
- Distributed-capable — per-node hash-chained audit + signed evidence bundles + reconciliation.
- Real-time — bounded ring buffers; no unbounded growth regardless of ingest rate.
- Fail-closed — unknown/suspended tenant, unregistered metric, missing signature, or partition ⇒ deny.
- No custom crypto — Ed25519 signing/verification reused from the Federation Fabric.

**Contract-first:** realizes `UCOS-API-CONTRACT-OPF` (+ `UCOS-EVT-CONTRACT-OPF`, `UCOS-DATA-CONTRACT-OPF`).
**Traceability:** B02 · OPF-ARCH-001 · CAP (Observability/Operations) · DOM (Operations) · ADR-005 (SoR).

## Layout
```
operational-proof/
  schema/        JSON-Schema (YAML) record models: proof, incident, tenant, definitions
  migrations/    PostgreSQL SoR forward-only migrations (dom_ops)
  events/        Event contract (OPS_* domain events) — CloudEvents envelope
  api/           OpenAPI realization of UCOS-API-CONTRACT-OPF
  deploy/        Kubernetes deployment descriptor + mesh allow-rule
```
