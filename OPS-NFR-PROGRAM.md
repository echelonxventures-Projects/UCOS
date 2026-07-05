# OPS — NFR VALIDATION PROGRAM (ACT 8 / G12-3 · NFR PORTION)

> **PHASE E.1 · OPERATIONAL EVIDENCE EXECUTION PROGRAM · READ-ONLY GOVERNANCE ANALYSIS**
> **NO CODE · NO IMPLEMENTATION · NO ENVIRONMENT CREATION · NO PIPELINE EXECUTION · NO CERTIFICATION ISSUANCE · NO GOVERNANCE MUTATION**
> Describes the executable work packages for the NFR portion of Act 8. Measures nothing.

| Field | Value |
|-------|-------|
| Artifact ID | `OPS-NFR-PROGRAM` |
| Phase | **E.1** · Version 1.0.0 · Date 2026-07-03 |
| Act | **Act 8 — DR + NFR Validation** (gate **G12-3**, condition C-F, `REAL-C-02`) — **NFR portion** |
| Assumption | Act 6 substrate (G12-1); Act 7 services deployed (G12-2); PE-12 telemetry emitting; NFR floors authored. |
| Inputs (read-only) | `UCOS-EVIDENCE-REQUIREMENTS` (EO-3, EV-2, EV-6), `ARTICLE-IX-EVIDENCE-MATRIX` (EV-2, EV-6), `UCOS-FULL-GO-PATH` (step 7); source refs `UCOS-ASR-NFR-001` v1.0.1 (classes AC-1..4 / T1..4), CAP-01..14 quantitative attributes (`REM-18` / N-1 residual), `REM-06` NFR floors. |
| Human-gate | Human/CA-executed on the live substrate. The agent executes none of it. |
| Discipline | **Measured, never asserted** (EAR-1..6); **fail-closed** — any below-floor value = NOT ACHIEVED. |

---

## 0. Scope

The NFR portion produces **measured** performance and availability evidence — p99 latency, throughput, availability — against **quantitative floors** derived from `UCOS-ASR-NFR-001` and the CAP-01..14 attributes. It resolves the standing floor-authoring residual (EV-2) as a precondition, then measures, then compares fail-closed. Jointly with `OPS-DR-PROGRAM` it closes **G12-3**.

---

## 1. Work Packages

### NP-1 — Finalize quantitative NFR floors (CAP-01..14)
| Field | Detail |
|-------|--------|
| Inputs | `UCOS-ASR-NFR-001` v1.0.1 (AC-1..4 / T1..4); CAP-01..14 attributes (`REM-18`). |
| Outputs | Per-CAP quantitative acceptance thresholds (p99, throughput, availability, RPO/RTO) — the acceptance basis. |
| Dependencies | Front wave (authored before Act 8; N-1 residual cleared). |
| Evidence produced | **EV-2** (quantitative NFR floors authored). |
| Certification impact | Defines the acceptance basis for the entire NFR track; without it, measurement is un-gradeable. |
| Exit criteria | Every CAP-01..14 has a numeric floor; floors ratified + hash-logged. |

### NP-2 — Performance / load test (measure p99 + throughput)
| Field | Detail |
|-------|--------|
| Inputs | Deployed services (Act 7); load profiles; PE-12 telemetry. |
| Outputs | Measured p99 latency + throughput under defined load. |
| Dependencies | NP-1, Act 7. |
| Evidence produced | Performance measurement set (feeds EO-3). |
| Certification impact | Performance track of G12-3. |
| Exit criteria | Measured p99 ≤ floor; measured throughput ≥ floor (fail-closed). |

### NP-3 — Availability measurement
| Field | Detail |
|-------|--------|
| Inputs | Sustained observation window; PE-12 telemetry; DR results (`OPS-DR-PROGRAM`). |
| Outputs | Measured availability (uptime %) over the window. |
| Dependencies | NP-1, DP-3 (failover behavior). |
| Evidence produced | Availability measurement (feeds EO-3). |
| Certification impact | Availability track of G12-3. |
| Exit criteria | Measured availability ≥ floor (fail-closed). |

### NP-4 — Scale evidence past prior breakpoint
| Field | Detail |
|-------|--------|
| Inputs | Prior scale breakpoint (`REAL-H-05` feed); incremental load. |
| Outputs | Measured behavior at/above the prior breakpoint. |
| Dependencies | NP-2. |
| Evidence produced | **EV-6** (measured scale evidence). |
| Certification impact | Scale track; informs (does not resolve) RK-7 scale-wall watch. |
| Exit criteria | Behavior characterized past prior breakpoint; degradation bounded + documented. |

### NP-5 — Compare measured vs floors (fail-closed) + consolidate
| Field | Detail |
|-------|--------|
| Inputs | NP-2/NP-3/NP-4 measurements; NP-1 floors; DR results (EO-3 DR portion). |
| Outputs | Comparison table (measured vs floor); immutable **NFR evidence pack**. |
| Dependencies | NP-2, NP-3, NP-4, DP-5. |
| Evidence produced | **EO-3** (measured NFR portion, consolidated with DR). |
| Certification impact | **Closes G12-3** (with DR portion). |
| Exit criteria | Every floor has a measured value ≥ floor; any miss ⇒ CONDITIONAL/NOT ACHIEVED; pack IA-attestable. |

---

## 2. Dependency Order

```
NP-1 (floors) ─► NP-2 (p99/throughput) ─► NP-4 (scale)
              └─► NP-3 (availability) ──────────────────► NP-5 (compare + consolidate)  ⟶ G12-3 CLOSED (with DR)
                        ▲                                    ▲
                   DP-3 (failover)                      DP-5 (DR pack)
```

---

## 3. Evidence Summary

| Evidence ID | Description | Gate |
|:-----------:|-------------|:----:|
| EV-2 | Quantitative NFR floors (CAP-01..14) authored | precondition |
| EO-3 (NFR portion) | Measured RPO/RTO/p99/availability vs floors | G12-3 |
| EV-6 | Measured scale evidence past prior breakpoint | G12-3 |

---

## 4. Certification Impact
- Closes the **performance / availability / scale tracks** of `OP-CERT-001`.
- Jointly with `OPS-DR-PROGRAM`, **closes G12-3** — the third and final operational gate feeding **UCC-4 (Act 9)**.
- **Fail-closed** enforcement is the honest-state guarantee: no floor may be assumed met.

## 5. Exit Criteria (NFR portion)
1. Quantitative floors authored for every CAP-01..14 (EV-2).
2. Measured p99 ≤ floor; throughput ≥ floor; availability ≥ floor.
3. Scale characterized past prior breakpoint (EV-6).
4. Comparison table shows **every** floor met; consolidated NFR pack (EO-3) immutable + IA-attestable.
5. **G12-3 CLOSED** (with DR portion).

## Governance / Non-Mutation Statement
No measurement was taken; no load applied; no floor authored; no evidence produced. All packages are future human/CA-executed measurements on the live substrate. `INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX lock, and `UCOS-CONSTRUCTION-BLOCKED` unchanged. Read-only analysis.

**END OPS-NFR-PROGRAM — ACT 8 NFR PORTION / G12-3 · 5 WORK PACKAGES (NP-1..NP-5) · EVIDENCE = MEASURED p99/THROUGHPUT/AVAILABILITY/SCALE (EO-3/EV-6) + FLOORS (EV-2) · FAIL-CLOSED · CLOSES G12-3.**
