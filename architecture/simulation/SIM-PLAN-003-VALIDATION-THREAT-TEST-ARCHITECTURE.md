# SIM-PLAN-003 — PI-11 Simulation Fabric Validation, Threat-Verification & Test Architecture

| Field | Value |
|-------|-------|
| Artifact | **SIM-PLAN-003 — Validation Strategy, Threat-Verification Plan & Test Architecture** |
| Workstream | PHASE 20.2 · PI-11 Simulation Fabric Implementation Planning |
| Version | 1.0.0 |
| Status | **PLAN — READY FOR CONSTRUCTION** (planning artifact; no source code in this phase) |
| Authorizing act | **AD-0022** (conditional scoped Article IX release) |
| Basis | `SIM-PLAN-001` (modules/boundaries), `SIM-PLAN-002` (waves W0..W5), `SIM-THREAT-001` (S1–S12), `SIM-SEC-001`, `SIM-FED-001`, `SIM-AUD-001`, `SIM-GOV-002` (assurance A1..A8) |
| Determination gate | **0 residual High/High** empirically reproduced; **134 baseline** tests unchanged and green |
| Runner | Node built-in test runner (`node --test`), matching implemented PI-2..PI-7 test conventions |
| Owner | UCOS Authority Board (Architecture) |

> Defines *how PI-11 is proven correct and safe*: the validation strategy, the S1–S12 threat-verification plan
> (one adversarial test per threat), the test-suite architecture (harness + per-wave suites), and the coverage
> and exit gates that a PI-11 implementation MUST pass before independent ratification. Planning only.

---

## 1. Validation strategy

Five validation streams, mirroring the ratified federation/knowledge validation pattern:

| Stream | Question | Method | Pass condition |
|--------|----------|--------|----------------|
| **V-A Structural** | Is the fabric confined and additive? | Import-audit + file-inventory + mtime-integrity of prohibited dirs | 14 modules under `src/control/simulation/*`; **1** additive re-export; **0** prohibited-core-dir change |
| **V-B Functional** | Do the constructs behave per SIM-GOV-002 lifecycles? | Per-wave unit/integration suites (W0..W4) | All lifecycle transitions legal-only; illegal transitions rejected; happy-path projections re-derivable |
| **V-C Security** | Are S1/S3/S4 (+S6) enforced? | Security suite + adversarial suite (W5) | Deny-by-default; keyspace guard; classification inheritance; signed assertions; keys by-reference; tamper-evident audit |
| **V-D Threat** | Are S1–S12 mitigated in code? | Adversarial suite (W5), one test per threat | 12/12 vectors blocked with typed errors; **0 residual High/High** |
| **V-E Assurance** | Are SIM-GOV-002 A1..A8 evidenced? | Assurance mapping over produced tests/records | 8/8 assurance dimensions have passing evidence |

**Non-regression clause.** Every stream runs against the full suite; the **134 pre-existing tests** must remain
unchanged and green (SIM-COND-2). A red baseline fails validation regardless of new-test results.

---

## 2. Threat-verification plan (S1–S12 → tests)

One adversarial test per threat in `simulation-adversarial.test.ts` (Wave W5). Each asserts the attack is
**rejected with a typed error and audited**, reproducing the residual rating in `SIM-THREAT-001` §1.

| # | Threat (SIM-THREAT-001) | Adversarial test asserts | Enforcing module(s) | Target residual |
|---|-------------------------|--------------------------|---------------------|:---------------:|
| S1 | Sandbox escape (write to governed state) | A run write outside `simulation:sandbox:<runId>:*` is **rejected + audited** | M2 sandbox guard (SIM-SEC-ISO-1) | Low |
| S2 | Snapshot/twin poisoning (forged baseline) | Unsigned/tampered snapshot fails Ed25519 verify ⇒ bind **denied** | M3 + `assertions.ts` | Low |
| S3 | Non-deterministic leakage (forecast as fact) | A non-det forecast without verifier attestation is **advisory-only**, non-promotable | M6 + M11 reproducibility gate | Low |
| S4 | Predictive/model overreach (promote w/o governance) | Projection promoted without policy-PASS/constraint-PASS/cert is **denied** | M11 + PI-4 policy | Low |
| S5 | Resource exhaustion / runaway sim | Exceeding horizon/steps/entities/wall budget ⇒ `aborted-budget`, sandbox torn down, no promotion | M4/M5 budgets, M2 | Low |
| S6 | Classification leakage (S4) | Cross-class emit (high input → lower-class projection) **denied** | M8 + SIM-SEC §4 | Low–Med |
| S7 | Replay/stale scenario/twin/snapshot | Replayed nonce or expired snapshot ⇒ **denied**; stale twin non-projectable | M3/M4 + `assertions.ts` | Low |
| S8 | Authority escalation (self-promote to commit) | A simulation authority attempting commit has **no commit power**; SoD blocks certifier=modeller | M11 (B5), decision-rights | Low |
| S9 | Federated poisoning/override | Foreign contribution is advisory/deny-only; over-cap trust clamped/denied; cannot force local promotion | M10 (SFG-1..5) | Low–Med |
| S10 | Audit divergence / unexplained projection | Tampered chain fails verify; projection lacking resolvable rationale **rejected** | M12 + M5 rationale gate | Low–Med |
| S11 | Existential / civilization scope creep | Civilization-class scenario without Board authorization **denied**; bounded horizon/entities enforced | M4 (SGP-9), AD-0014 | Low |
| S12 | Digital-twin drift / impersonation | Twin never actuates target; foreign twin namespace-isolated (local-shadows-foreign); stale ⇒ fail-closed | M3/M10 | Low |

**Exit:** 12/12 blocked; **0 residual High/High**; residual Low–Med (S6/S9/S10) matches SIM-THREAT-001 and is
bounded by classification inheritance, fail-closed federation, and reconciliation cadence.

---

## 3. Test-suite architecture

Files under `packages/platform-runtime/test/` (additive; naming mirrors `knowledge-*`/`federation-*`/`evolution-*`).

| Test file | Wave | Covers | Type |
|-----------|:----:|--------|------|
| `simulation-harness.ts` | W0 | Shared fixtures: in-memory substrate wiring, signing keypairs (reuse FED harness), sample twin/scenario/constraint/snapshot builders | Harness |
| `simulation.test.ts` | W0 | Registry indexing; sandbox allocate/teardown; allowed-namespace confinement | Unit/Integration |
| `simulation-audit.test.ts` | W0 | Hash-chain append/verify; tamper detection; signed checkpoints; reproducibility tuple recorded | Unit |
| `simulation-twin.test.ts` | W1 | C2 lifecycle; signed-snapshot bind/verify/expiry; `stale` fail-closed; non-actuation | Unit/Integration |
| `simulation-scenario.test.ts` | W1 | C3/C4 lifecycle; authority caps; civilization-class ⇒ Board; in-sandbox intervention | Unit/Integration |
| `simulation-projection.test.ts` | W2 | C8 deterministic stepping; **re-derivability** from reproducibility tuple; non-det model rejection (FDG-INT) | Unit/Integration |
| `simulation-constraint.test.ts` | W2 | C6 hard/soft + preserved-invariant checks; `invalid` non-promotable; absent-`ontology:*` ⇒ deny (FDG-ONT) | Unit |
| `simulation-impact.test.ts` | W3 | C9 deltas/risks; recommendation; advisory-only (0 governed side effects) | Unit/Integration |
| `simulation-federation.test.ts` | W3 | C11 advisory/deny-only; trust clamp; local-shadows-foreign; fail-closed partition | Integration |
| `simulation-revocation.test.ts` | W3 | C10 forward-only fail-closed propagation across twin/scenario/model/run/result | Unit |
| `simulation-promotion.test.ts` | W4 | Pipeline §3: policy→constraint→cert(SoD)→ratify→**Evolution Unit**; deny-by-default; reproducibility gate | Integration |
| `simulation-control.e2e.test.ts` | W4 | End-to-end: scenario→run(sandbox)→projection→impact→proposal→Evolution commit→teardown; self-commit impossible | E2E |
| `simulation-adversarial.test.ts` | W5 | S1–S12 attack vectors (§2) | Adversarial |

---

## 4. Coverage & exit gates

| Gate | Requirement |
|------|-------------|
| **G-BUILD** | `tsc --noEmit` exits 0 |
| **G-BASELINE** | 134 pre-existing tests unchanged and green at every wave boundary (SIM-COND-2) |
| **G-FUNC** | All W0–W4 functional suites pass; every SIM-GOV-002 lifecycle transition covered (legal accepted, illegal rejected) |
| **G-THREAT** | `simulation-adversarial.test.ts`: **12/12 (S1–S12) blocked**; 0 residual High/High |
| **G-COV** | Security-critical modules — M2 sandbox guard, M3 twin verify, M10 federation guard, M11 promotion pipeline, M12 audit — **~100% line / 100% branch** on deny/verify paths; simulation subtree ≥ **90% line** overall (matches PI-4/PI-5 achieved coverage) |
| **G-DIR** | Import-audit + mtime-integrity: **0** change to `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts` (SIM-COND-1) |
| **G-ADDITIVE** | File inventory: 14 new simulation modules + exactly **1** additive re-export in `src/control/index.ts`; no other control-file behavior change |
| **G-FDG** | FDG-INT/MEM/ONT seams inert (deny/absent); premature-binding rejection test passes |
| **G-CRYPTO** | No custom cryptography; all signing/verify via `federation/assertions.ts` (SIM-COND-2) |
| **G-ASSURE** | SIM-GOV-002 A1..A8 each mapped to ≥1 passing test/record (§5) |

All gates must pass before the PI-11 deliverables (`PI11-IMP-001`/`VAL-001`/`SEC-001`/`AUD-001`) are issued and
independent ratification is convened.

---

## 5. Assurance-dimension → evidence mapping (SIM-GOV-002 §5)

| A# | Assurance dimension | Evidence (test/record) |
|:--:|---------------------|------------------------|
| A1 | Non-actuation / sandbox isolation | `simulation.test.ts` (namespace confinement), `simulation-adversarial.test.ts` S1, teardown logs |
| A2 | Determinism / reproducibility | `simulation-projection.test.ts` (re-derivability), audit reproducibility tuple |
| A3 | Deny-by-default promotion | `simulation-promotion.test.ts`, adversarial S4/S8; Evolution-only commit |
| A4 | Explainability completeness | rationale-required rejection in `simulation-projection.test.ts`; adversarial S10 |
| A5 | Separation of duties | `simulation-promotion.test.ts` certifier≠modeller assertion; adversarial S8 |
| A6 | Bounded simulation | `simulation-scenario.test.ts`/budget abort; adversarial S5/S11 |
| A7 | Input read-governance & S4 | `simulation-twin.test.ts` (governed reads), `simulation-impact.test.ts`; adversarial S6 |
| A8 | Auditability & tamper-evidence | `simulation-audit.test.ts` (chain verify/tamper); adversarial S10 |

---

## 6. Validation outputs (produced by the PI-11 implementation act, not this phase)

- **`PI11-IMP-001`** — implementation report (modules, wave completion, DoD checklist).
- **`PI11-VAL-001`** — validation report (V-A..V-E stream results; G-* gate results).
- **`PI11-SEC-001`** — security report (S1/S3/S4/S6 conformance; coverage on deny/verify paths).
- **`PI11-AUD-001`** — audit report (chain integrity, reproducibility, reconciliation).

These mirror the ratified `PI5-IMP/VAL/SEC/AUD-001` deliverable set and feed independent PI-11 validation/
ratification.

---

## 7. Traceability
- **Refines:** `SIM-PLAN-001/002`, `SIM-THREAT-001` (S1–S12), `SIM-SEC-001` (S1/S3/S4), `SIM-FED-001`,
  `SIM-AUD-001` (S6), `SIM-GOV-002` (A1..A8), `AD-0022` (SIM-COND-1..7, FDG-INT/MEM/ONT).
- **Consumed by:** the PI-11 implementation act and independent PI-11 validation/ratification.
- **Owner:** UCOS Authority Board.

**END SIM-PLAN-003 — VALIDATION · THREAT-VERIFICATION (S1–S12, 0 RESIDUAL HIGH/HIGH) · TEST ARCHITECTURE · PLANNING ONLY.**
