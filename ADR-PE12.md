# ADR-PE12 — Observability & Telemetry Technology Selection

**Artifact ID:** `UCOS-PLAT-ADR-008`
**Deliverable alias:** `ADR-PE12.md` (ACT-11 · PHASE G.3)
**Short Name:** ADR-008 Observability
**Layer:** ARCHITECTURE (Platform Engineering — Technology Selection)
**Phase:** ACT-11 — PE-12 Observability ADR Decision Program (resolves the sub-decision deferred by `UCOS-PLAT-ADR-INDEX` §3/§4)
**Status:** ACCEPTED (technology-selection scope)
**Version:** 1.0.0
**Date:** 2026-07-03
**Decision Owner:** Platform Engineering — Observability Owner (`PEO-012`)
**Governing Domain:** `PE-12` Observability & Telemetry (Operability Plane, PEG-D)
**Capability Anchor:** CAP-11 Observability
**Authority:** Subordinate to AUTH-001..012, `UCOS-CONST-001`, `UCOS-ASR-NFR-001` (INV-1..13), the ratified architectures, `UCOS-PEA-001..007`, the UCOS Governance Baseline 1.0.0, and `STATE-001`.

> **Scope notice.** Technology selection authorized by `CTX-ARCHB-001` §5 and deferred by `PEP-010`
> throughout Phases 9.0A–9.0C and explicitly carried forward by `UCOS-PLAT-ADR-INDEX` §3/§4. This ADR
> selects the **observability & telemetry contract/substrate** that will **realize** the ratified
> `PE-12` domain (`PRS-047..051`). It does **not** author telemetry semantics (owned by `UCOS-INF-ARCH-001`
> / data architecture), does **not** own immutable audit (`PE-10`, CAP-16), does **not** generate source
> code, agents, or live observability infrastructure, and does **not** release the Article IX generation
> lock (`UCOS-CONSTRUCTION-BLOCKED` unchanged). It is **additive** and mutates **no** frozen artifact.
> Non-waivable control **S4** (AUTH-008) is preserved.

---

## 1. Context

The ratified Platform Engineering architecture defines `PE-12` **Observability & Telemetry** on the
Operability Plane (PEG-D), anchored to **CAP-11 Observability**, governed by **`PEG-012`**, owned by
**`PEO-012`** (Observability Owner), and bounded by **`PEB-012`** (execution axis =
logs/metrics/traces/health/SLO posture; classification preserved; no PII/secret leakage). The domain is
realized across every fabric — runtime `PRD-012` with services **`PRS-047..051`**, event `PED-012`,
registry `PRG-012` (`PRE-047..051`), configuration `PCD-012` (`PCF-047..051`), metadata `PMD-012`
(`PME-047..051`), and control `PCE-047..051` — as five governed elements:

1. `PRS-047` **Telemetry Ingestion**
2. `PRS-048` **Metrics Aggregation** (deterministic windows)
3. `PRS-049` **Trace Correlation** (traceability preserved; no PII leakage)
4. `PRS-050` **Health & SLO Evaluation**
5. `PRS-051` **Alert Signaling**

Every fabric explicitly recorded **"no observability product selection"**, deferring the product/contract
decision to a future governed sub-ADR under `PE-12`. `UCOS-PLAT-ADR-INDEX` §3 states the observability
substrate "runs on ADR-001/007" while "observability product selection remains a future governed sub-ADR
under `PE-12`." The absence of this decision leaves `RA1-ENV-004` at **NOT READY** and is the internal
dependency root of the operational-evidence chain (ACT-06..). The substrate must:

- Be **cloud-neutral / portable** and expressed as open contracts (`PEP-010`; `CTX-ARCHB-001` §5);
- Cover the three telemetry signals (**logs, metrics, traces**) plus **health/SLO** and **alert signaling**;
- **Preserve data classification** and never carry secrets/PII (`PEB-012`; AUTH-008 **S4**; `PED-009`);
- Respect the **audit-domain boundary** — telemetry is **not** the immutable audit evidence owned by
  `PE-10` (CAP-16, `PRS-039..042`, S6);
- Support **deterministic** metrics aggregation windows (`PCE-048`; EX1);
- Deliver uniformly to **all** platform/runtime domains (`PEP-006/011`; P7).

## 2. Decision

**Adopt an open, vendor-neutral observability contract as the `PE-12` substrate: OpenTelemetry (OTel)
instrumentation and semantic conventions, OTLP as the telemetry wire contract, OpenMetrics/Prometheus
exposition for metrics, and W3C Trace Context for propagation — with the concrete storage/visualization
backend product left PLUGGABLE behind these contracts (product-neutral, migration-only replaceable).**

1. **Instrumentation & signals contract:** all three signals — **logs, metrics, traces** — are produced
   via **OpenTelemetry** APIs/SDKs and **OTel semantic conventions**. This gives a single neutral
   instrumentation contract for `PRS-047` (ingestion), `PRS-048` (metrics), and `PRS-049` (traces).
2. **Wire contract:** **OTLP** (OpenTelemetry Protocol) is the neutral collection/export contract; an
   **OTel Collector** tier provides vendor-neutral ingestion, processing, and fan-out. No proprietary
   agent protocol is placed on the platform's critical path.
3. **Metrics exposition:** metrics are exposed via **OpenMetrics / Prometheus exposition format** with
   **deterministic aggregation windows** (`PCE-048`, EX1); metric/SLO **definitions are metadata-driven**
   (`PME-048`/`PME-050`, `PCF-048`/`PCF-050`) per `UCOS-INF-ARCH-001`.
4. **Trace propagation:** **W3C Trace Context** (`traceparent`/`tracestate`) is the propagation standard;
   trace correlation (`PRS-049`) preserves lineage without PII (Lineage Metadata `PME-049`).
5. **Health & SLO:** `PRS-050` evaluates health/SLO from OpenMetrics signals against metadata-driven SLO
   definitions; **`PRS-051` Alert Signaling** emits **Control Events** via the ratified eventing substrate
   (`PRD-004`, CloudEvents / ADR-003) — not a proprietary alerting bus.
6. **Backend product = pluggable & deferred:** the concrete telemetry **store/visualization product**
   (e.g., an OTLP-compatible metrics/trace/log backend) is **not fixed here**; any OTLP/OpenMetrics-
   conformant backend is admissible and swappable. Concretizing the backend is a governed **sub-decision**
   (`ADR-PE12-A`, analogous to `ADR-002A`) taken when observability ASRs (retention, cardinality, query
   SLAs) are quantified. This preserves `PEP-010` and avoids premature lock-in.
7. **Transport security & classification:** telemetry travels over the **mTLS** service mesh and IdP
   context from ADR-006; **data classification is preserved end-to-end**, and **secrets/PII are never
   emitted** into telemetry (`PEB-012`; `PED-009`; AUTH-008 **S4**).
8. **Boundary with audit:** observability provides operational insight only; **immutable, tamper-evident
   audit evidence remains `PE-10`** (S6). Telemetry pipelines are **not** an audit substrate.

## 3. Alternatives Considered

| # | Alternative | Why not selected |
|---|-------------|------------------|
| A | **Single-vendor observability suite** (proprietary agents + wire format as SoR) | Couples the platform to one vendor's protocol/agents; violates `PEP-010` and `CTX-ARCHB-001` §5 cloud-neutrality. Admissible only as a *pluggable backend* behind OTLP. |
| B | **Cloud-provider-native observability** (managed metrics/traces/logs of one cloud) | Non-portable, cloud-locked telemetry pipeline; violates `PEP-010`. |
| C | **Bespoke in-house telemetry protocol + agents** | Reinvents solved, ratifiable open standards; weak ecosystem; high maintenance and correctness risk; against `PEP-009/018` composability. |
| D | **Fold observability into the audit fabric (`PE-10`)** | Violates the `PEB-012`/`PEB-010` boundary; conflates operational telemetry with immutable audit (S6); telemetry is not tamper-evident evidence. |
| E | **Metrics-as-analytics (route telemetry through the analytics/OLAP engine)** | Analytics/OLAP is `PE-16` (`ADR-002A`); mixing violates domain boundaries and over-scopes PE-12. |
| F | **Defer again (no decision)** | ACT-11 is authorized and READY; continued deferral perpetuates `RA1-ENV-004` NOT-READY and indefinitely roots the operational-evidence chain. |

## 4. Consequences

**Positive**
- Vendor-neutral, portable observability contract (`PEP-010`); backend swappable without re-instrumentation.
- Single instrumentation contract (OTel) across logs/metrics/traces reduces divergence and eases
  composability (`PEP-009/018`).
- Metadata-driven metric/SLO definitions preserve `UCOS-INF-ARCH-001` lineage; deterministic windows (EX1).
- Classification-preserving, secret-free telemetry over ADR-006 mTLS satisfies **S4** and `PEB-012`.
- Clean separation from `PE-10` audit and `PE-16` analytics; boundaries intact.
- Alert signaling reuses the ratified eventing substrate (ADR-003 CloudEvents), not a new bus.

**Negative / Trade-offs**
- The OTel Collector tier is on the telemetry path — mitigated by the `PE-13` resilience posture and by
  the collector's buffering/fan-out (non-blocking to business execution).
- Backend product remains deferred — a bounded, explicitly-flagged follow-on sub-decision (`ADR-PE12-A`),
  not a silent gap; interim realization can use any OTLP-conformant backend.

**Follow-on obligations**
- **`ADR-PE12-A`** — concrete telemetry backend product selection, once observability ASRs (retention,
  cardinality, query SLA) are quantified (governed sub-decision; migration-only).
- **Realization** (instrumentation of `PRS-047..051`, collector deployment, dashboards/alerts) is gated by
  the Article IX lock and the operational-evidence acts (ACT-06..10) under AD-0015/AD-0009 — **out of
  scope here**.
- SLO/metric definition schemas bind to `UCOS-INF-ARCH-001` metadata classes; none created here.

## 5. Traceability

- **Realizes:** `UCOS-PEA-001` (`PE-12`, `PEG-012`, `PEO-012`, `PEB-012`); `PEA-002` (`PRD-012`,
  `PRS-047..051`, EX1); `PEA-003` (`PED-012`, Control Events via `PRD-004`); `PEA-004` (`PRG-012`,
  `PRE-047..051`); `PEA-005` (`PCD-012`, `PCF-047..051`); `PEA-006` (`PMD-012`, `PME-047..051`);
  `PEA-007` (`PCE-047..051`); `UCOS-INF-ARCH-001` (metric/SLO metadata semantics).
- **Justified by ASR/principle:** `PEP-006/009/010/011/018`; principle **P7**; EX1 determinism; AUTH-008 **S4**.
- **Authority:** AUTH-009 (governance/decision rights), AUTH-008 (S4 non-waivable), `CTX-ARCHB-001` §4/§5.
- **Consumes (substrate):** `UCOS-PLAT-ADR-001` (runtime), `-003` (event fabric / CloudEvents), `-006`
  (mTLS/OIDC + classification), `-007` (delivery/GitOps).
- **Consumed by (downstream):** `ACT-06..ACT-10` operational realization (Article IX + AD-0015/AD-0009
  gated); `RA1-ENV-004` (clears NOT-READY at decision level); Prompt 10 (`WP-PLT-*` observability wiring).
- **Chain:** `ADR-PE12 (UCOS-PLAT-ADR-008) → PE-12 / PRD-012 / PRS-047..051 → CAP-11 → PEG-012/PEO-012/PEB-012 → AUTH-008/009 → UCOS-PEA-001..007 → UCOS-INF-ARCH-001`.

## 6. Governance Impacts

- Resolves the **PE-12 observability product** sub-decision deferred by `UCOS-PLAT-ADR-INDEX` §3/§4;
  clears the `RA1-ENV-004` observability **NOT-READY** dependency at the decision level.
- Governed by **`PEG-012`**; decision authority held by the **Observability Owner** (`PEO-012`);
  escalation `PEO-012 → PE-17 → Authority Board`; Approval-By-Exception (`PEP-020`).
- **Non-waivable S4 preserved**; telemetry classification enforced; **PE-10 audit** and **PE-16 analytics**
  boundaries respected; secrets excluded (`PED-009`).
- **Additive only** — **0** mutation of `UCOS-PEA-001..007`, Governance Baseline 1.0.0, or any ratified
  domain/entity/matrix; **0** source code / agents / infrastructure; Article IX lock **unchanged**.
- Evolution **migration-only** (`PEP-016`, IP-14/IP-15): superseding this selection or fixing the deferred
  backend (`ADR-PE12-A`) requires a new ADR version + an AUTH-012 decision record; this ADR is never deleted.
- **Program effect:** ACT-11 → COMPLETE; `EV-ACT-11` → VERIFIED. `ACT-06` becomes **internally** unblocked
  but remains **EXTERNAL_BLOCKED** under EXT-REAL-C-03 (operational evidence, human-executed). Program-wide
  compiler verdict remains **NO_GO** (unchanged).

## 7. Approval Status

| Field | Value |
|-------|-------|
| Status | **ACCEPTED** (technology-selection scope) |
| Approval model | Approval-By-Exception (`PEP-020`); ratified within the platform technology-selection ADR set by `PE-17` (`PEG-017`) |
| Terminal authority | Authority Board |
| Deferred sub-decision | `ADR-PE12-A` — concrete telemetry backend product (flagged, non-blocking) |
| Gating note | Realization gated by Article IX lock + `UCOS-IMP-READY-001` (C-4..C-6) + EXT-REAL-C-03 operational evidence (AD-0015/AD-0009). This ADR selects; it does not realize or release the lock. |

## 8. Ownership

| Role | Assignment |
|------|------------|
| Decision Owner (Engineering) | Observability Owner (`PEO-012`) |
| Steward | Observability Steward (CAP-11) |
| Governing Model | `PEG-012` |
| Boundary | `PEB-012` |
| Capability Anchor | CAP-11 Observability |
| Authority Chain | Observability Owner (`PEO-012`) → `PE-17` → Authority Board |

## Traceability (artifact)
- **Refines:** `UCOS-PEA-001..007`, `UCOS-INF-ARCH-001`, `UCOS-PLAT-ADR-001/003/006/007`,
  `UCOS-PLAT-ADR-INDEX`, `CTX-ARCHB-001` §4/§5, AUTH-008/009, PROMPT-08.
- **Refined by:** `ADR-PE12-A` (deferred backend product); Prompts 09–12; `UCOS-IMP-*` observability
  work packages; `ACT-06..ACT-10` operational realization.
