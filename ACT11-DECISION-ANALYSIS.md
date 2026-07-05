# ACT-11 · WORKSTREAM 3 — DECISION ANALYSIS

**Artifact ID:** `ACT11-DECISION-ANALYSIS`
**Phase:** PHASE G.3 · ACT-11
**Mode:** GOVERNANCE DECISION ANALYSIS ONLY — options, constraints, dependencies, constitutional requirements, external blockers, governance implications. No implementation; no observability fabric.
**Date:** 2026-07-03

---

## 1. Decision statement

Select, via a governed technology-selection ADR, the **observability & telemetry contract/substrate**
for platform domain **`PE-12`** (CAP-11), such that the ratified elements `PRS-047..051` (telemetry
ingestion, metrics aggregation, trace correlation, health/SLO evaluation, alert signaling) can later be
realized without violating platform independence, data classification, or the audit-domain boundary.

## 2. Decision options

Each option is evaluated against the binding constraints in §4.

| # | Option | Description | Verdict |
|---|--------|-------------|:-------:|
| **O-1** | **Open/neutral observability contract** — OpenTelemetry (OTel) instrumentation + semantic conventions; OpenMetrics/Prometheus exposition; W3C Trace Context propagation; OTLP as the wire contract; backend product **pluggable behind OTLP** | Vendor-neutral standards; backend swappable; identical selection philosophy as ADR-001..007 (Kubernetes API, S3 API, Kafka API, OIDC, CloudEvents) | **SELECTED** |
| O-2 | **Single-vendor observability suite** (one proprietary APM/o11y product as SoR + wire format) | Fast, cohesive, but couples the platform to one vendor's agents/protocols | **REJECTED** — violates `PEP-010`, `CTX-ARCHB-001` §5 |
| O-3 | **Cloud-provider-native observability** (managed metrics/traces/logs of one cloud) | Low ops, but cloud-locked telemetry pipeline; non-portable | **REJECTED** — violates `PEP-010` cloud-neutrality |
| O-4 | **Bespoke/in-house observability protocol & agents** | Full control, but re-implements solved standards; high risk; weak ecosystem; custom wire format | **REJECTED** — `PEP-009/018` composability; reinvention risk; no ecosystem |
| O-5 | **Fold observability into the audit fabric (`PE-10`)** | Reuse audit pipeline for telemetry | **REJECTED** — violates `PEB-012`/`PEB-010` boundary (telemetry ≠ immutable audit; S6 owned by PE-10) |
| O-6 | **Defer again (no decision)** | Keep PE-12 product undecided | **REJECTED** — ACT-11 is authorized and READY; deferral perpetuates `RA1-ENV-004` NOT-READY and roots the operational-evidence chain indefinitely |

**Selected: O-1** — an open/neutral observability **contract**, with the concrete backend product left
**pluggable** behind the OTLP/OpenMetrics contracts (product-neutral, migration-only replaceable). This
is the minimum governed decision that (a) unblocks the PE-12 NOT-READY dependency and (b) honors every
binding constraint.

## 3. Dependencies (satisfaction analysis)

| Dependency | Needed for | Status | Satisfied? |
|------------|-----------|--------|:----------:|
| `UCOS-PEA-001` `PE-12`/`PEG-012`/`PEO-012`/`PEB-012` | domain/governance identity | RATIFIED | ✅ |
| `PEA-002` `PRD-012` / `PRS-047..051` | realization anchors | RATIFIED | ✅ |
| `PEA-004/005/006/007` `PRG/PCD/PMD/PCE-012` | registry/config/metadata/control anchors | RATIFIED | ✅ |
| `UCOS-PLAT-ADR-001` Runtime, `-007` Delivery | substrate the observability stack runs on | ACCEPTED | ✅ |
| `UCOS-PLAT-ADR-003` Event Fabric (CloudEvents) | telemetry-bearing event transport | ACCEPTED | ✅ |
| `UCOS-PLAT-ADR-006` Security (mTLS/OIDC/classification) | secure telemetry transport; S4 | ACCEPTED | ✅ |
| AUTH-008 (S4) data classification | telemetry classification rules | RATIFIED | ✅ (inherited, unchanged) |

**All authoring dependencies are satisfied.** ACT-11 has **no unmet dependency** and is READY.

## 4. Constraints & constitutional requirements

| ID | Constraint | Source | Effect on decision |
|----|-----------|--------|--------------------|
| C-PEP-010 | **Platform Independence** — selections expressed as open/neutral contracts | `PEP-010`; `CTX-ARCHB-001` §5 | Forces O-1; rejects O-2/O-3 |
| C-P7 | Observability principle (P7) | `UCOS-PRINCIPLES.md`; PEG-012 | Requires governed logs/metrics/traces/health/SLO |
| C-PEP-006/011 | Observability/operability compliance; delivery to all domains | PEG-012 compliance | Contract must serve all domains uniformly |
| C-S4 | **Non-waivable data protection** — telemetry classification preserved; no PII/secret leakage | AUTH-008 S4; `PEB-012` | Contract must carry classification; secrets excluded |
| C-PE10 | Audit-domain boundary — telemetry ≠ immutable audit | `PEB-012` vs `PEB-010` | Rejects O-5; ADR must not claim audit ownership |
| C-PE09 | Secrets never in telemetry | `PED-009` boundary | Explicit exclusion in ADR |
| C-DET | Deterministic aggregation windows | `PCE-048` / EX1 | Metrics windows deterministic |
| C-ARTIX | **Article IX generation lock ACTIVE** | `state.json`; `UCOS-CONSTRUCTION-BLOCKED` | ADR **selects**; generates **no** code/agents/infra; releases **no** lock |
| C-FROZEN | No mutation of frozen artifacts | Governance Baseline 1.0.0; `PEA-001..007` | ADR is **additive only** |
| C-INV10 | Append-only / migration-only | INV-10; IP-14/IP-15 | ADR is a new artifact; supersession requires new version + AUTH-012 record |
| C-OWN | Single-owner; escalation terminal at Board | `PEO-012`; AUTH-009; `PEP-020` | Owner = Observability Owner (`PEO-012`) → PE-17 → Board |

## 5. External blockers (bearing on ACT-11)

| Blocker | Relationship to ACT-11 | Consequence |
|---------|------------------------|-------------|
| **EXT-REAL-C-03** (Operational Evidence) | Blocks ACT-06..10/12 (the *human-executed* operational acts). Names **ACT-11 as the internal dependency root** but does **not** list ACT-11 among `blockedWorkItems`. | ACT-11 is **internally software-solvable**; completing it does **not** clear EXT-REAL-C-03. ACT-06 stays EXTERNAL_BLOCKED after ACT-11 completes. |
| EXT-REAL-C-05 (Independent Attestation) | Unrelated to ACT-11 (governs PI-8/PI-9 ratification independence). | No effect. Must not be touched/reopened. |
| EXT-REAL-C-04 (Design-only fabric / AD-0024) | Unrelated to ACT-11. | No effect. |

**Key finding:** ACT-11 is the one member of the operational-certification cluster that is **not**
external-blocked. It is the internal decision that must precede — but is independent of — the external
operational evidence. Resolving it is precisely within a software agent's authority (documentation/
governance, GATE-DOC-001).

## 6. Governance implications

- **Ownership:** Decision Owner = Observability Owner (`PEO-012`); governed by `PEG-012`; boundary
  `PEB-012`; approval = Approval-By-Exception (`PEP-020`); terminal authority = Authority Board
  (`PEG-017`). Consistent with ADR-001..007.
- **Scope of the decision:** technology **selection** only. It does **not** release Article IX, author
  contracts (Prompt 07), author threat models (Prompt 09), or generate code/agents/infrastructure.
- **Effect on the program:** ACT-11 → COMPLETE; `EV-ACT-11` → VERIFIED; `ACT-06` becomes **internally**
  unblocked (but remains EXTERNAL_BLOCKED under EXT-REAL-C-03); `RA1-ENV-004` observability NOT-READY is
  cleared at the decision level. **Program verdict remains NO_GO** (operational evidence, design-only
  fabrics, and independent attestation still open) — an honest, unchanged compiler output.
- **Evolution:** migration-only (`PEP-016`); superseding the selected contract requires a new ADR
  version + an AUTH-012 decision record; the deferred backend-product concretization is a governed
  sub-decision (analogous to `ADR-002A`) and is explicitly flagged, not silently omitted.
- **Rediscovery prevention:** EXT-REAL-C-03's review trigger watches `EV-ACT-06..10/12` (operational
  evidence), **not** `EV-ACT-11`. Completing ACT-11 therefore does **not** improperly reopen the
  external blocker.

## 7. Analysis determination

**Decision is well-formed, dependency-satisfied, and constitutionally admissible.** Select **O-1**
(open/neutral observability contract, product-pluggable behind OTLP/OpenMetrics), authored as a governed
platform technology-selection ADR under `PE-12`/`PEG-012`. Proceed to WS4.

---

**END WS3 — Option O-1 selected; all constraints satisfiable; ACT-11 internally resolvable; program NO_GO unchanged.**
