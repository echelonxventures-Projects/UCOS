# SIM-GOV-002 — UCOS Simulation Lifecycle & Decision-Rights Governance Specification

| Field | Value |
|-------|-------|
| Artifact | **SIM-GOV-002 — Simulation Lifecycle & Decision-Rights Governance Specification** |
| Workstream | FND-SIM-01 (PHASE 20 · PI-11 Simulation Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, infrastructure, or services |
| Basis | `SIM-GOV-001` (constructs C1..C12); `AD-0016..0020`; `AD-0014`; AUTH-003 (IP-06 Deterministic Execution, IP-14 Migration-Only Evolution); AUTH-008/009/012 |
| Realizes | Lifecycles + decision-rights + the governed simulation-to-change promotion pipeline + assurance model |
| Prohibited-dir impact | **NONE** — lifecycles are enforced by the existing PI-4 lifecycle/state-machine + governance engines over metadata records |

> Companion to `SIM-GOV-001`. Where SIM-GOV-001 defines *what* the constructs are, this specification defines
> *how they move* (lifecycles), *who decides* (decision-rights), *how a projection becomes a committed change*
> (the promotion pipeline), and *how readiness is assured*. It authorizes no implementation.

---

## 1. Lifecycle State Machines

All transitions are **signed**, **audited**, **replay/freshness-protected**, and **fail-closed**. Illegal
transitions are rejected by the PI-4 lifecycle engine. Terminal states are immutable; reversal is a new forward
act (IP-14, migration-only).

### 1.1 Scenario (`SIM-GOV-C3`)
`proposed → authorized → active → { suspended ↔ active } → { completed | abandoned | expired }`
- **Entry to `authorized`:** an in-scope Scenario Authority approval (Approval-Required, AD-0009);
  `consequenceClass`, `horizon`, and entity count within the authority caps (civilization-class ⇒ Board).
- **Entry to `active`:** at least one bound Constraint Set and a resolvable baseline snapshot.
- **`expired`:** hard, fail-closed on `expiresAt`; no auto-renewal.
- **Invariant:** no run may target a scenario not in `active`.

### 1.2 Digital Twin (`SIM-GOV-C2`)
`defined → bound → active → { stale ↔ active } → retired`
- **Entry to `active`:** a pinned, signed snapshot and a resolvable owner; classification set.
- **`stale`:** snapshot expired ⇒ fail-closed and non-projectable until re-bound to a fresh snapshot.
- **Invariant:** a twin never actuates or mutates its target; retiring a twin never rewrites past projections
  that referenced it (audit immutability).

### 1.3 Predictive Model (`SIM-GOV-C5`)
`registered → active → deprecated → retired`
- **Entry to `active` (non-deterministic model):** a bound deterministic verifier/guard **must** exist first.
- **`deprecated`:** still readable for reproducing historical projections; not selectable for new runs.
- **Invariant:** retiring a model never rewrites past rationales/projections that referenced it.

### 1.4 Simulation Run (`SIM-GOV-C7`)
`open → running → { completed | aborted-budget | aborted-fault }`
- **Entry to `running`:** pinned snapshot, allocated Sandbox Scope, declared budgets, resolved seed.
- **`aborted-budget` / `aborted-fault`:** fail-closed; sandbox torn down; **no promotion**; any partial
  outputs are marked advisory and non-promotable.
- **Invariant:** a run that used a `non-deterministic` model cannot yield a promotion-eligible projection
  without deterministic verifier attestation (SGP-3).

### 1.5 Projection (`SIM-GOV-C8`)
`produced → constraint-checked → { valid | invalid } → (valid) advisory → (optionally) proposed-for-promotion`
- **`constraint-checked`:** all **hard** constraints and preserved system invariants satisfied.
- **Invariant:** an `invalid` projection can never be proposed for promotion.

### 1.6 Impact Analysis (`SIM-GOV-C9`)
`drafted → evaluated → { adopt-proposal | reject | inconclusive }`
- **`adopt-proposal`:** references ≥1 `valid` projection, a passing constraint check, and a resolvable
  rationale; produces a **proposal** only.
- **Invariant:** adoption never self-commits — it opens the promotion pipeline (§3).

### 1.7 Promoted Change (simulation-originated governed change)
`proposed → policy-evaluated → constraint-checked → certified → ratified → committed → { superseded | revoked }`
- **`committed`:** routed through the Evolution Fabric / Control Plane (the only commit path).
- **`superseded`/`revoked`:** forward-only; original proposal + rationale + source projection retained immutably.

### 1.8 Simulation Sandbox Scope (`SIM-GOV-C12`)
`allocated → active → { retained ↔ active } → torn-down`
- **Invariant:** sandbox writes never escape the `simulation:sandbox:<runId>:*` keyspace; teardown is
  fail-closed on run terminal state or retention expiry; only emitted Projection/Impact records survive.

## 2. Decision-Rights Matrix (10 decision classes)

| # | Decision class | Accountable authority | SoD / Quorum | Escalation | Approval-Required (AD-0009) |
|:-:|----------------|-----------------------|--------------|------------|:---------------------------:|
| D1 | Register/scope a Simulation Authority | Authority Board | — | Board | Yes |
| D2 | Define/bind a Digital Twin | Simulation Authority | cross-boundary → Board | Board | Yes |
| D3 | Author/authorize a Scenario | Scenario Authority | ≤ authority caps; civilization → Board | Board | Yes |
| D4 | Register/activate a Predictive Model | Authority Board | verifier-bound if non-deterministic | Board | Yes |
| D5 | Define/modify a Constraint Set | Simulation/Decision Authority | hard set change → Board | Board | Yes |
| D6 | Open a Simulation Run | Simulation Authority | budgets + sandbox declared | Scenario Authority | Yes if consequential |
| D7 | Emit/validate a Projection | Simulation Authority | constraint check PASS | Board | Yes (for promotion) |
| D8 | Certify an Impact Analysis / proposal | Decision Authority | **≠ modeller** | Board | Yes |
| D9 | Commit a promoted change (via Evolution) | Evolution Governor + Control Plane | evolution quorum | Board | Yes |
| D10 | Revoke twin/scenario/model/run/promoted-result | Simulation Revocation Authority | fail-closed propagate | Board | Yes |

**Non-waivable:** the modeller who produced a projection may never certify (D8) its adoption; commit (D9) is
**only** through the Evolution Fabric — the Simulation Fabric holds no independent write path.

## 3. The Governed Simulation-to-Change Promotion Pipeline

```
Scenario(active) ─▶ Simulation Run(bounded, snapshot-pinned, seeded, SANDBOXED)
    │  digital-twin projection / scenario stepping / predictive(adapter) / constraint-solve
    ▼
Projection(+ mandatory rationale)  ── constraint-checked ──▶  Impact Analysis(deltas, risks)
    │                                                                    (advisory only; zero governed side effects)
    │  recommendation = adopt-proposal
    ▼
Proposal
    │  (1) PI-4 Policy Evaluation  (deny-by-default)
    │  (2) Hard Constraint + Preserved-Invariant Check   (inviolable)
    │  (3) Certification  (SoD: certifier ≠ modeller)
    │  (4) Ratification   (quorum by consequence class; Board if over cap)
    ▼
Evolution Unit (targets governed namespace)             ← the ONLY commit path
    │  submit → approve → certify → ratify → atomic apply (Evolution Governor: maxInFlight=1)
    ▼
Control Plane (PEP) actuation + hash-chained audit (SIM-AUD-001) + sandbox teardown
```

- **Reproducibility gate.** A proposal is promotion-eligible only if its source projection's
  `(inputs hash, snapshotRef, scenarioId, modelId+seed, constraintSetId, policySetRef)` are all recorded and
  the result is deterministically re-derivable (non-deterministic contributions are advisory and independently
  re-verified).
- **Fail-closed everywhere.** Any missing signature, stale/replayed transition, budget exhaustion, sandbox
  escape attempt, unresolved rationale, unknown model, invalid projection, or policy denial aborts the pipeline
  with no commit and discards the sandbox.

## 4. Operating Model & Separation of Duties

- **Modeller ≠ Certifier ≠ Committer.** Simulation Authority models/projects; Decision Authority
  certifies/ratifies adoption; Evolution Governor commits. Three distinct accountable roles (mirrors AUTH-009
  SoD).
- **Scenario owner ≠ Decision authority** for the same consequential adoption where feasible; conflicts
  escalate to the Board.
- **Federated contributions** are advisory and pass through the same pipeline locally (SIM-FED-001) — no
  foreign short-circuit and no foreign-originated promotion without local ratification.

## 5. Assurance Model (8 dimensions)

| # | Assurance dimension | Evidence source |
|:-:|---------------------|-----------------|
| A1 | Non-actuation / sandbox isolation | Sandbox scope records; SIM-GOV-001 §2.2/2.12; teardown logs |
| A2 | Determinism / reproducibility | Run snapshot + seed + inputs hash; verifier attestations |
| A3 | Deny-by-default promotion | Pipeline §3; PI-4 policy PASS gate; Evolution-only commit |
| A4 | Explainability completeness | Rationale chain (SIM-AUD-001); 0 unexplained projections |
| A5 | Separation of duties | Certification records; modeller ≠ certifier |
| A6 | Bounded simulation | Run budgets (horizon/steps/entities) + abort records |
| A7 | Input read-governance & S4 | Knowledge/Memory/Ontology query logs; classification inheritance |
| A8 | Auditability & tamper-evidence | Hash-chained SIM_* audit; reconciliation |

## 6. Traceability
- **Refines:** `SIM-GOV-001`, `AD-0016..0020`, `AD-0014`, AUTH-003 (IP-06/14/15), AUTH-008/009/012,
  Constitution Art. IX/XII.
- **Consumed by:** `SIM-ARCH-001`, `SIM-SEC-001`, `SIM-AUD-001`, `SIM-READINESS-001`, and a future PI-11
  implementation act.
- **Owner:** UCOS Authority Board.

**END SIM-GOV-002 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
