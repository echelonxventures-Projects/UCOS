# UCOS — Implementation Dependency Graph

| Field | Value |
|-------|-------|
| Artifact | **UCOS-DEPENDENCY-GRAPH** |
| Artifact ID | `UCOS-IMP-DEP-001` |
| Version | 1.0.0 |
| Phase | **Phase 10.0 — Implementation Readiness** |
| Status | CREATED — IMPLEMENTATION PLANNING |
| Mode | **PLANNING ONLY** — dependency analysis; no code, no technology |
| Authority | Subordinate to UCOS Governance Baseline 1.0.0, Authority Layer, Constitution (Art. IX) |
| Generates | `TM-IMP-004` — Dependency Matrix (§5) |
| Date | 2026-06-30 |

> Establishes the directed, **acyclic** dependency graph over the work packages (`UCOS-IMP-WPS-001`),
> determining a valid build order. Consistent with the ratified service-relationship DAG (`PSR-001..017`)
> and the Constitution Article IX lock: all implementation WPs depend on the enablement (lock-release) WPs.

---

## 1. Dependency Classes

| Class | Meaning |
|-------|---------|
| **LOCK** | Hard gate — dependent cannot begin until predecessor is complete & ratified (Article IX) |
| **SUBSTRATE** | Dependent runs on the platform substrate produced by predecessor |
| **CONTRACT** | Dependent consumes a published contract owned by predecessor |
| **GOVERNANCE** | Dependent is enforced/observed by the predecessor control/registry/config services |

## 2. Top-Level Dependency Order

```
WP-ENB-01..05 (LOCK)
      │  releases Constitution Article IX generation lock
      ▼
WS-PLT-EXE (WP-PLT-01..03)  ── execution/persistence/networking substrate
      │ SUBSTRATE
      ├──► WP-PLT-06 Registry & Discovery (ICU-019)
      ├──► WP-PLT-11 Config & Metadata (ICU-010)
      ▼
WS-PLT-INT (WP-PLT-04/05/07)  ── eventing, gateway, workflow
      │ SUBSTRATE + CONTRACT
      ▼
WS-PLT-TRU (WP-PLT-08/09/10)  ── identity, secrets, audit
      │ GOVERNANCE
      ▼
WP-PLT-17 Control Plane (ICU-015/018) ── control-fabric enforcement
      │ GOVERNANCE (applies to ALL later WPs)
      ▼
WS-PLT-OPS / WS-PLT-DEL (WP-PLT-12..16)  ── observability, resilience, CI/CD, analytics
      │ SUBSTRATE
      ▼
WS-BIZ (WP-BIZ-01..08)  ── core commerce on substrate
      │ CONTRACT + SUBSTRATE
      ▼
WS-EXP (WP-EXP-01)  ── experience surfaces
      │
      ▼
WP-VNC-01 (Validation) ──► WP-VNC-02 (Certification & Release)
```

## 3. Foundational Service Dependencies (within platform substrate)

| Predecessor | Dependents | Class | Rationale |
|-------------|-----------|-------|-----------|
| WP-PLT-06 Registry & Discovery (ICU-019) | all platform & business WPs | GOVERNANCE | every service registers/discovers via `PRE-*` |
| WP-PLT-11 Config & Metadata (ICU-010) | all platform & business WPs | GOVERNANCE | config resolution via `PCF-*`, metadata via `PME-*` |
| WP-PLT-04/05 Eventing/Gateway (ICU-012) | all event producers/consumers | CONTRACT | `PEV-*` flow via the governed eventing substrate (`PRD-004`) |
| WP-PLT-08 Identity (ICU-009) | all WPs requiring authn/authz/tenancy | GOVERNANCE | trust plane prerequisite |
| WP-PLT-17 Control Plane (ICU-015/018) | all WPs | GOVERNANCE | control fabric (`PCE-*`) enforced platform-wide |

## 4. Business → Platform Dependencies

| Business WP | Depends on platform WP(s) | Class |
|-------------|---------------------------|-------|
| WP-BIZ-01..08 (all core commerce) | WP-PLT-06 (registry), WP-PLT-11 (config/metadata), WP-PLT-04/05 (eventing/gateway), WP-PLT-08 (identity), WP-PLT-10 (audit), WP-PLT-17 (control) | SUBSTRATE + CONTRACT + GOVERNANCE |
| WP-BIZ-05 Order Orchestration | WP-PLT-07 (workflow), WP-BIZ-01/03/04/06 (catalog/inventory/cart/payment) | CONTRACT |
| WP-BIZ-06 Payment Processing | WP-PLT-09 (secrets), WP-PLT-08 (identity) | GOVERNANCE |
| WP-EXP-01 Experience | WP-BIZ-01..08, WP-PLT-05 (gateway) | CONTRACT |

## 5. TM-IMP-004 — Dependency Matrix

| WP / set | Direct predecessors | Dependency class | Cycle? |
|----------|--------------------|------------------|:------:|
| WP-ENB-01..05 | Governance Baseline 1.0.0 | LOCK (release) | No |
| WP-PLT-01..03 (EXE) | WP-ENB-01..05 | LOCK | No |
| WP-PLT-06 (Registry) | WP-PLT-01..03 | SUBSTRATE | No |
| WP-PLT-11 (Config/Meta) | WP-PLT-01..03 | SUBSTRATE | No |
| WP-PLT-04/05/07 (INT) | WP-PLT-01..03, WP-PLT-06 | SUBSTRATE+CONTRACT | No |
| WP-PLT-08/09/10 (TRU) | WP-PLT-06, WP-PLT-11 | SUBSTRATE+GOVERNANCE | No |
| WP-PLT-17 (Control Plane) | WP-PLT-08/09/10 | GOVERNANCE | No |
| WP-PLT-12/13 (OPS) | WP-PLT-01..03, WP-PLT-17 | SUBSTRATE+GOVERNANCE | No |
| WP-PLT-14/15/16 (DEL) | WP-PLT-06, WP-PLT-17 | SUBSTRATE+GOVERNANCE | No |
| WP-BIZ-01..08 | platform substrate (06/11/04/05/08/10/17) | SUBSTRATE+CONTRACT+GOVERNANCE | No |
| WP-EXP-01 | WP-BIZ-01..08, WP-PLT-05 | CONTRACT | No |
| WP-VNC-01 | all implementation WPs | (validation) | No |
| WP-VNC-02 | WP-VNC-01 | (release) | No |

> **TM-IMP-004 result:** directed acyclic graph confirmed — every implementation WP transitively depends on
> the enablement (lock-release) set; platform substrate precedes business; control fabric (`WP-PLT-17`)
> governs all later WPs; validation/certification terminal. **0 cycles**; 0 implementation WP without a
> predecessor; 0 dependency that bypasses the Article IX lock. Consistent with the ratified acyclic
> service-relationship DAG (`PSR-001..017`).

## 6. Critical Path (relative)

```
WP-ENB-02 (Contracts) ▶ WP-PLT-06 (Registry) ▶ WP-PLT-11 (Config/Meta) ▶ WP-PLT-08 (Identity)
   ▶ WP-PLT-17 (Control Plane) ▶ WP-BIZ-05 (Order Orchestration) ▶ WP-EXP-01 ▶ WP-VNC-01 ▶ WP-VNC-02
```

> The critical path runs through contract authoring, the registry/config/identity/control substrate, order
> orchestration (the most dependency-dense business WP), experience, then validation and release.

## 7. Validation

| Check | Target | Observed | Result |
|-------|:------:|:--------:|:------:|
| Graph acyclic | yes | yes | ✅ |
| Implementation WPs gated behind lock release | all | all | ✅ |
| Platform substrate precedes business | yes | yes | ✅ |
| Control fabric governs all later WPs | yes | yes | ✅ |
| Orphan WP (no predecessor, excl. baseline) | 0 | 0 | ✅ |
| Dependency bypassing Article IX | 0 | 0 | ✅ |

## Traceability
- **Refines:** `UCOS-IMP-WPS-001`, `UCOS-IMP-ROAD-001`, `PSR-001..017` (ratified service-relationship DAG), Constitution Art. IX.
- **Refined by:** `UCOS-IMP-PI-001`, `UCOS-IMP-DELIV-001`, `UCOS-IMP-READY-001`.
- **Owner:** Implementation Program (subordinate to Authority Board).
