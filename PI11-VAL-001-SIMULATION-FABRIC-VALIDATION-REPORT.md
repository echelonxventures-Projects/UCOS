# PI11-VAL-001 — Simulation Fabric Validation Report

| Field | Value |
|-------|-------|
| Artifact | **PI11-VAL-001** |
| Work item | PI-11 — Simulation Fabric |
| Basis | SIM-PLAN-003 (validation strategy, threat plan, test architecture) |
| Runner | `node --test` (Node built-in), matching PI-2..PI-9 conventions |
| Determination | **VALIDATED — 5/5 streams pass; 10/10 exit gates pass; 0 residual High/High** |
| Date | 2026-07-03 |

## 1. Validation streams (SIM-PLAN-003 §1)

| Stream | Method | Result |
|--------|--------|--------|
| **V-A Structural** | import-audit + file-inventory + mtime/`git status` of prohibited dirs | **PASS** — 15 modules + namespace helper under `src/control/simulation/*`; 1 additive re-export; 0 core-dir change |
| **V-B Functional** | per-wave unit/integration suites (W0..W4) | **PASS** — lifecycle transitions legal-only; happy-path projections re-derivable |
| **V-C Security** | security assertions + adversarial suite | **PASS** — deny-by-default, keyspace guard, classification inheritance, signed assertions, keys by-reference, tamper-evident audit |
| **V-D Threat** | adversarial suite, one test per S1–S12 | **PASS** — 12/12 blocked with typed errors; 0 residual High/High |
| **V-E Assurance** | assurance mapping (A1..A8) | **PASS** — 8/8 dimensions evidenced (see §4) |

Non-regression: the 284 pre-existing tests remain unchanged and green (SIM-COND-2).

## 2. Test suite (SIM-PLAN-003 §3) — 72 new tests

| File | Wave | Tests |
|------|:--:|:--:|
| `simulation-harness.ts` | W0 | harness (fixtures) |
| `simulation.test.ts` | W0 | 6 |
| `simulation-audit.test.ts` | W0 | 4 |
| `simulation-twin.test.ts` | W1 | 7 |
| `simulation-scenario.test.ts` | W1 | 7 |
| `simulation-projection.test.ts` | W2 | 5 |
| `simulation-constraint.test.ts` | W2 | 5 |
| `simulation-impact.test.ts` | W3 | 5 |
| `simulation-federation.test.ts` | W3 | 6 |
| `simulation-revocation.test.ts` | W3 | 5 |
| `simulation-promotion.test.ts` | W4 | 7 |
| `simulation-control.e2e.test.ts` | W4 | 2 |
| `simulation-adversarial.test.ts` | W5 | 13 |
| **Total** | | **72** (284 baseline + 72 = **356** green) |

## 3. Exit gates (SIM-PLAN-003 §4)

| Gate | Requirement | Result |
|------|-------------|--------|
| G-BUILD | `tsc --noEmit` exits 0 | **PASS** |
| G-BASELINE | 284 pre-existing tests unchanged + green | **PASS** |
| G-FUNC | W0–W4 functional suites pass | **PASS** |
| G-THREAT | 12/12 (S1–S12) blocked; 0 residual High/High | **PASS** |
| G-COV | deny/verify paths on M2/M3/M10/M11/M12 exercised | **PASS** |
| G-DIR | 0 change to the five core dirs (SIM-COND-1) | **PASS** |
| G-ADDITIVE | simulation modules + exactly 1 additive re-export | **PASS** |
| G-FDG | FDG-INT/MEM/ONT inert; premature-binding rejection | **PASS** |
| G-CRYPTO | no custom cryptography (assertions.ts only) | **PASS** |
| G-ASSURE | A1..A8 mapped to ≥1 passing test | **PASS** |

## 4. Assurance mapping (SIM-PLAN-003 §5)

| A# | Dimension | Evidence |
|:--:|-----------|----------|
| A1 | Non-actuation / sandbox isolation | `simulation.test.ts` (confinement), adversarial S1, teardown |
| A2 | Determinism / reproducibility | `simulation-projection.test.ts` (re-derivability), audit reproHash |
| A3 | Deny-by-default promotion | `simulation-promotion.test.ts`, adversarial S4/S8; Evolution-only commit |
| A4 | Explainability completeness | projection rationale gate; adversarial S10 |
| A5 | Separation of duties | promotion certifier≠modeller; adversarial S8 |
| A6 | Bounded simulation | scenario budget abort; adversarial S5/S11 |
| A7 | Input read-governance & S4 | twin governed reads; impact; adversarial S6 |
| A8 | Auditability & tamper-evidence | `simulation-audit.test.ts`; adversarial S10 |

**END PI11-VAL-001.**
