# SIM-THREAT-001 — UCOS Simulation Fabric Threat Model

| Field | Value |
|-------|-------|
| Artifact | **SIM-THREAT-001 — Simulation Threat Model** |
| Workstream | FND-SIM-01 (PHASE 20 · PI-11 Simulation Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | `SIM-GOV-001/002`, `SIM-ARCH-001`, `SIM-SEC-001`, `SIM-FED-001`, `SIM-AUD-001`; STRIDE; AUTH-008 (S1/S3/S4/S6) |
| Method | STRIDE over the 12 constructs, the sandbox boundary, and the federation boundary |
| Owner | UCOS Authority Board |

> Enumerates the simulation-specific threats (S1–S12), the STRIDE class(es), the mitigating specification(s),
> and the residual risk after mitigation. The determination gate is **0 residual High/High**.

---

## 1. Threat ledger (S1–S12)

| # | Threat | STRIDE | Prior (unmitigated) | Mitigating spec(s) | Residual |
|---|--------|--------|:-------------------:|--------------------|:--------:|
| S1 | **Sandbox escape** — a run writes to production/governed state | E, T | High/High | SIM-GOV §2.2/2.12 (sandbox isolation) + SIM-SEC-ISO-1 (keyspace guard) + deny-by-default; Evolution-only commit | **Low** |
| S2 | **Snapshot/twin poisoning** — forged/tampered baseline | T, S | High/High | SIM-SEC-AS (signed snapshots, Ed25519 verify, expiry) + FED-PROV namespacing | **Low** |
| S3 | **Non-deterministic leakage** — a forecast treated as committed fact | T, I | Med/High | SGP-3 quarantine (verifier-gated adapter, advisory-only, recorded seed) | **Low** |
| S4 | **Predictive/model overreach** — projection promoted without governance | E | High/High | SGP-4 deny-by-default promotion; Evolution-only commit; hard constraint check | **Low** |
| S5 | **Resource exhaustion / runaway simulation** | D | High/Med | SGP-5 bounded budgets (horizon/steps/entities/wall/resource) + fail-closed abort | **Low** |
| S6 | **Classification leakage (S4)** — sensitive data exposed via projection output | I | High/High | SIM-SEC §4 classification inheritance; cross-class emit denied; sandbox teardown | **Low–Med** |
| S7 | **Replay/stale** scenario, twin, or snapshot | T, S | Med/High | SIM-SEC-AS (nonce + freshness + expiry); stale ⇒ non-projectable | **Low** |
| S8 | **Authority escalation** — sim authority self-promotes to commit | E | Med/High | Enumerated powers (C1/C4); SoD non-waivable; no commit power in the fabric | **Low** |
| S9 | **Federated simulation poisoning/override** — foreign result forces local change | S, T, E | High/High | SIM-FED (advisory/deny-only, clamped trust, local-shadows-foreign, fail-closed) | **Low–Med** |
| S10 | **Audit divergence / unexplained projection** | R, T | High/High | SIM-AUD (hash chain, checkpoints, reconciliation, mandatory rationale) | **Low–Med** |
| S11 | **Existential / civilization scope creep** — unbounded self-running society | E, T | High/High | SGP-9 bounded civilization sim (fixed horizon/entities, non-actuating) + AD-0014 | **Low** |
| S12 | **Digital-twin drift / impersonation** — twin mistaken for the real system, or foreign twin poisoning | S, T | High/High | Twin never actuates target; provenance namespacing; local-shadows-foreign; stale fail-closed | **Low** |

**Result: 0 residual High/High.** All prior High/High threats (S1, S2, S4, S6, S9, S10, S11, S12) reduced to
Low / Low–Med. Remaining Low–Med residuals (S6, S9, S10) are inherent to classification handling and
distributed co-simulation and are acceptably bounded by classification inheritance, fail-closed federation, and
reconciliation cadence.

## 2. Boundary analysis

- **Sandbox boundary (S1/S6/S12).** The strongest guarantee: every run is confined to
  `simulation:sandbox:<runId>:*`; a static keyspace write-guard rejects and audits any non-sandbox write; only
  advisory Projection/Impact records survive teardown. Simulation has **no** independent governed write path.
- **Promotion boundary (S3/S4/S8).** Deny-by-default; a projection becomes governed change only via the
  Evolution Fabric after policy PASS, hard-constraint PASS, certification (SoD), and ratification.
- **Federation boundary (S9/S12).** Local sovereignty; foreign contributions are advisory/deny-only, clamped,
  namespace-isolated, and fail-closed on partition.

## 3. Non-waivable control coverage
S1 (authz/deny-by-default), S3 (secrets/weights by-reference), S4 (classification inheritance), S6 (immutable
tamper-evident audit) are all designed and enforced across SIM-SEC-001 and SIM-AUD-001. No control is waivable.

## 4. Traceability
- **Refines:** `SIM-GOV-001/002`, `SIM-ARCH-001`, `SIM-SEC-001`, `SIM-FED-001`, `SIM-AUD-001`, AUTH-008.
- **Consumed by:** `SIM-READINESS-001` and a future PI-11 implementation act.
- **Owner:** UCOS Authority Board.

**END SIM-THREAT-001 — DESIGN · READY FOR RATIFICATION · 0 RESIDUAL HIGH/HIGH · NO IMPLEMENTATION AUTHORIZED.**
