# SIM-PLAN-002 — PI-11 Simulation Fabric Implementation Sequence & Delivery Plan

| Field | Value |
|-------|-------|
| Artifact | **SIM-PLAN-002 — Implementation Sequence & Delivery Plan** |
| Workstream | PHASE 20.2 · PI-11 Simulation Fabric Implementation Planning |
| Version | 1.0.0 |
| Status | **PLAN — READY FOR CONSTRUCTION** (planning artifact; no source code in this phase) |
| Authorizing act | **AD-0022** (conditional scoped Article IX release) |
| Basis | `SIM-PLAN-001` (module topology M0..M14; boundaries B1..B6; FDG seams); `SIM-GOV-002` (lifecycles, decision-rights, promotion pipeline); `SIM-ARCH-001` |
| Delivery discipline | **Additive-only** over the implemented PI-2..PI-7 baseline; **134/134** tests remain green at every wave boundary (SIM-COND-2) |
| Owner | UCOS Authority Board (Architecture) |

> Defines the ordered, dependency-respecting build sequence for the fourteen simulation modules, the wave gates
> that keep the implemented baseline green, the additive-change discipline, and the approval-required control
> points. Every wave ends at a **green, mergeable, non-regressing** state. Construction of a later wave MUST NOT
> begin until the prior wave's exit gate passes.

---

## 1. Delivery principles

- **DP-1 Additive-only.** New modules under `src/control/simulation/*`; exactly **one** additive re-export in
  `src/control/index.ts`; **one** additive `PolicyRecord.target`-style optionality only if already present. No
  existing signature changes (B6).
- **DP-2 Baseline-green invariant.** After every wave, `tsc --noEmit` exits 0 and the full suite passes with
  the **134 pre-existing tests unchanged** plus the wave's new tests. A wave that regresses any baseline test
  is rolled back before proceeding.
- **DP-3 Fail-closed first.** Each engine is built with its deny/absent path before its happy path, so a
  partially built fabric is safe (non-projectable, non-promoting) rather than permissive.
- **DP-4 Reuse over re-implementation.** Crypto/audit/policy/commit/federation come from PI-4..PI-7 (B3); no
  custom cryptography (SIM-COND-2).
- **DP-5 FDG seams inert.** Intelligence/Memory/Ontology binding points are typed extension points with
  deny/absent defaults; no real provider is wired during PI-11 (§6).
- **DP-6 Approval-required acts deferred to runtime.** Registering an authority, binding a twin to a target,
  authorizing a scenario, admitting a federated authority, and any promotion remain Approval-Required
  Operations (AD-0009, SIM-COND-7); construction builds the mechanism, not standing approvals.

---

## 2. Build waves (ordered)

Dependency order derives from SIM-PLAN-001 §2 (acyclic). Each wave lists modules, the tests introduced
(detailed in SIM-PLAN-003), and the exit gate.

### Wave W0 — Foundations (types + registry + sandbox + audit)
| Modules | M0 `types.ts`, M1 `simulation-registry.ts`, M2 `sandbox.ts`, M12 `simulation-audit-log.ts` |
|---|---|
| Realizes | C1/C6 index scaffolding, C12 sandbox + keyspace guard, SIM-AUD-001 hash chain (thin-wrap `FederatedAuditLog`) |
| Key guarantees | Static keyspace write-guard (SIM-SEC-ISO-1); append-only audit chain; allowed-namespace confinement (B4) |
| New tests | `simulation-harness.ts`; `simulation.test.ts` (registry/sandbox); `simulation-audit.test.ts` |
| **Exit gate** | Sandbox writes rejected outside `simulation:sandbox:<runId>:*` + audited; audit chain verifies + tamper-detects; 134 baseline green |

### Wave W1 — Baseline binding (digital twin + scenario engine)
| Modules | M3 `digital-twin.ts`, M4 `scenario-engine.ts` |
|---|---|
| Realizes | C2 twin lifecycle (`defined→bound→active→{stale↔active}→retired`); C3/C4 scenario lifecycle + authority caps |
| Depends on | W0; PI-5 `assertions.ts` (signed snapshot/scenario verify); PI-7 Knowledge query surface (read-only baseline) |
| Key guarantees | Signed snapshot verify + expiry (SIM-SEC-AS); `stale` fail-closed; twin never actuates target; civilization-class scenario ⇒ Board (SGP-9) |
| New tests | `simulation-twin.test.ts`, `simulation-scenario.test.ts` |
| **Exit gate** | Unsigned/expired snapshot rejected; stale twin non-projectable; over-cap scenario denied; 134 baseline green |

### Wave W2 — Deterministic projection (projection engine + predictive adapter interface + constraint evaluator)
| Modules | M5 `projection-engine.ts`, M6 `predictive-adapter.ts`, M7 `constraint-evaluator.ts` |
|---|---|
| Realizes | C8 deterministic stepping + reproducibility tuple; C5 adapter **interface** (deterministic models only); C6 hard/soft + preserved-invariant checks |
| Depends on | W1 |
| Key guarantees | Determinism-by-default (INV-6); non-deterministic model registration **denied** (FDG-INT stub); `invalid` projection never promotable; reproducibility tuple recorded |
| New tests | `simulation-projection.test.ts`, `simulation-constraint.test.ts` |
| **Exit gate** | Same `(inputs,snapshot,scenario,model+seed,constraintSet,policySet)` ⇒ identical projection (re-derivable); non-det model rejected; hard-constraint failure blocks; 134 baseline green |

### Wave W3 — Impact + federation guard + revocation
| Modules | M8 `impact-analyzer.ts`, M10 `federation-guard.ts`, M9 `revocation-authority.ts` |
|---|---|
| Realizes | C9 deltas/risks + recommendation; C11 advisory/deny-only foreign contribution; C10 forward-only fail-closed revocation |
| Depends on | W2; PI-5 `trust-boundary.ts`/authority verification |
| Key guarantees | Impact advisory-only (zero governed side effects); foreign clamp `min(asserted,delegated,boundary)`; local-shadows-foreign; fail-closed partition; revocation forward-only |
| New tests | `simulation-impact.test.ts`, `simulation-federation.test.ts`, `simulation-revocation.test.ts` |
| **Exit gate** | Foreign contribution advisory/deny-only (never promotes); over-cap foreign denied; partition ⇒ foreign absent; revocation propagates fail-closed; 134 baseline green |

### Wave W4 — Promotion pipeline + assembly + barrel
| Modules | M11 `promotion-pipeline.ts`, M13 `simulation-control.ts`, M14 `index.ts`; +1 additive re-export in `src/control/index.ts` |
|---|---|
| Realizes | SIM-GOV-002 §3 pipeline (proposal → PI-4 policy → constraint → cert[SoD] → ratify → **Evolution Unit** → commit); `createSimulationFabric(...)`; barrel |
| Depends on | W3; PI-4 PEP + `PolicyEvaluator`; PI-6 Evolution Governor |
| Key guarantees | Deny-by-default promotion; SoD (certifier ≠ modeller); **Evolution-only commit** (no independent write/rollback path, B5); reproducibility gate; fail-closed everywhere |
| New tests | `simulation-promotion.test.ts`, `simulation-control.e2e.test.ts` |
| **Exit gate** | Only valid + policy-PASS + constraint-PASS + certified + ratified proposals reach a committed Evolution Unit; self-commit impossible; sandbox torn down on terminal state; 134 baseline green |

### Wave W5 — Adversarial hardening (S1–S12)
| Modules | none (test-only) |
|---|---|
| Realizes | `SIM-THREAT-001` verification (see SIM-PLAN-003) |
| New tests | `simulation-adversarial.test.ts` (S1–S12 attack vectors) |
| **Exit gate** | 12/12 threat vectors blocked with typed errors; **0 residual High/High** reproduced empirically; full suite green |

---

## 3. Wave dependency graph

```
W0 (types, registry, sandbox, audit)
   └─▶ W1 (digital-twin, scenario-engine)
          └─▶ W2 (projection, predictive-adapter[iface], constraint-evaluator)
                 └─▶ W3 (impact, federation-guard, revocation)
                        └─▶ W4 (promotion-pipeline, assembly, barrel, +1 re-export)
                               └─▶ W5 (adversarial S1–S12)
```
Strictly linear at the wave level; intra-wave modules may be built in parallel where the §2 acyclic order
permits. No wave imports a not-yet-built downstream module.

---

## 4. Additive-change & backward-compatibility discipline

| Change point | Kind | Guarantee |
|--------------|------|-----------|
| `src/control/simulation/*` (14 modules) | **New files** | No existing file touched; pure addition |
| `src/control/index.ts` | **+1 re-export line** | Namespaced (`export * as simulation from "./simulation/index.ts"`), mirroring the knowledge barrel; no other line changed |
| `src/control/types.ts` | **None expected** | Async seams live in `simulation/types.ts`; only touch types.ts if an existing optional field is reused (additive, non-breaking) |
| Prohibited core dirs | **None** | SIM-COND-1; verified by import-audit + mtime-integrity gate (SIM-PLAN-003 G-DIR) |
| Existing 134 tests | **Unchanged** | DP-2 baseline-green invariant enforced at each wave gate |

**Regression protocol.** If any wave turns a baseline test red, the wave is reverted, the cause is diagnosed at
the root (not patched incrementally), and the wave is rebuilt. A red baseline never advances to the next wave.

---

## 5. Approval-required control points (AD-0009 / SIM-COND-7)

These are **runtime governance acts**, not construction steps. The build delivers the enforcing mechanism;
none of these approvals is baked in as a standing grant (deny-by-default; 0 hardcoded authorities/policies).

| Act | Decision class (SIM-GOV-002 §2) | Built in wave | Standing approval created? |
|-----|:-------------------------------:|:-------------:|:--------------------------:|
| Register/scope a Simulation Authority | D1 | W0/W4 | No |
| Bind a twin to a target | D2 | W1 | No |
| Author/authorize a scenario | D3 | W1 | No |
| Register/activate a predictive model | D4 | W2 | No (non-det denied — FDG-INT) |
| Admit a federated simulation authority | D2/D-fed | W3 | No |
| Promote a projection/impact to governed change | D7/D8/D9 | W4 | No |

---

## 6. FDG deferral in the sequence

| Gate | Built as (during PI-11) | Explicitly NOT done |
|------|-------------------------|---------------------|
| **FDG-INT** (Intelligence non-det models) | M6 adapter interface + `DeterministicVerifier` seam; non-det registration path returns **deny** | No Intelligence provider wired; no non-deterministic model activated |
| **FDG-MEM** (memory reads) | M3 optional `memoryRef` hook, unbound | No `memory:*` read issued |
| **FDG-ONT** (ontology validation) | M7 optional `ontologyRef` hook; constraint citing absent `ontology:*` ⇒ **deny** | No ontology surface consulted |

Binding any gate is a **separate future authorization** (its own AD + adversarial tests) and is out of PI-11
scope. The adversarial suite (W5) includes a test that premature FDG binding is rejected.

---

## 7. Definition of Done (PI-11 implementation)

1. All 14 modules under `src/control/simulation/*` implemented per SIM-PLAN-001 §2.
2. `tsc --noEmit` exits 0; full suite green = **134 baseline + all new simulation tests**.
3. W5 adversarial suite: **12/12 (S1–S12) blocked**; 0 residual High/High reproduced.
4. Import-audit + mtime-integrity gate: **0** prohibited-core-dir change (SIM-COND-1).
5. Coverage thresholds met on security-critical paths (SIM-PLAN-003 §4).
6. No standing authority/policy hardcoded; deny-by-default verified.
7. FDG-INT/MEM/ONT remain inert (deny/absent); premature-binding rejection test passes.
8. Deliverables `PI11-IMP-001` / `PI11-VAL-001` / `PI11-SEC-001` / `PI11-AUD-001` produced (per PI-5 pattern),
   then independent PI-11 validation/ratification.

---

## 8. Traceability
- **Refines:** `SIM-PLAN-001`, `SIM-GOV-002` (§1 lifecycles, §2 decision-rights, §3 pipeline), `SIM-ARCH-001`
  (§5 non-regression), `AD-0022` (SIM-COND-1..7, FDG-INT/MEM/ONT).
- **Consumed by:** `SIM-PLAN-003` (validation & test architecture) and the PI-11 implementation act.
- **Owner:** UCOS Authority Board.

**END SIM-PLAN-002 — IMPLEMENTATION SEQUENCE · ADDITIVE-ONLY · BASELINE-GREEN AT EVERY WAVE · PLANNING ONLY.**
