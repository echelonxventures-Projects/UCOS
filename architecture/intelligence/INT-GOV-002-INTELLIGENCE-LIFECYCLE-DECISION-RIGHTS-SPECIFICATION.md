# INT-GOV-002 — UCOS Intelligence Lifecycle & Decision-Rights Governance Specification

| Field | Value |
|-------|-------|
| Artifact | **INT-GOV-002 — Intelligence Lifecycle & Decision-Rights Governance Specification** |
| Workstream | FND-INT-01 (PHASE 19 · PI-10 Intelligence Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, infrastructure, or services |
| Basis | `INT-GOV-001` (constructs C1..C12); `AD-0016..0020`; `AD-0014`; AUTH-003 (IP-06 Deterministic Execution, IP-14 Migration-Only Evolution); AUTH-008/009/012 |
| Realizes | Lifecycles + decision-rights + the governed decision-commit pipeline + assurance model |
| Prohibited-dir impact | **NONE** — lifecycles are enforced by the existing PI-4 lifecycle/state-machine + governance engines over metadata records |

> Companion to `INT-GOV-001`. Where INT-GOV-001 defines *what* the constructs are, this specification defines
> *how they move* (lifecycles), *who decides* (decision-rights), *how a proposal becomes a committed decision*
> (the pipeline), and *how readiness is assured*. It authorizes no implementation.

---

## 1. Lifecycle State Machines

All transitions are **signed**, **audited**, **replay/freshness-protected**, and **fail-closed**. Illegal
transitions are rejected by the PI-4 lifecycle engine. Terminal states are immutable; reversal is a new forward
act (IP-14, migration-only).

### 1.1 Goal (`INT-GOV-C3`)
`proposed → authorized → active → { suspended ↔ active } → { achieved | abandoned | expired }`
- **Entry to `authorized`:** an in-scope Goal Authority approval (Approval-Required, AD-0009).
- **Entry to `active`:** at least one bound Constraint Set and a resolvable owner.
- **`expired`:** hard, fail-closed on `expiresAt`; no auto-renewal.
- **Invariant:** no reasoning session may target a goal not in `active`.

### 1.2 Inference Model (`INT-GOV-C2`)
`registered → active → deprecated → retired`
- **Entry to `active` (non-deterministic model):** a bound deterministic verifier/guard **must** exist first.
- **`deprecated`:** still readable for reproducing historical decisions; not selectable for new sessions.
- **Invariant:** retiring a model never rewrites past rationales that referenced it (audit immutability).

### 1.3 Reasoning Session (`INT-GOV-C9`)
`open → running → { completed | aborted-budget | aborted-fault }`
- **Entry to `running`:** pinned knowledge snapshot, declared budgets, resolved seed.
- **`aborted-budget` / `aborted-fault`:** fail-closed; **no partial commit**; session outputs (if any) are
  marked advisory and non-committable.
- **Invariant:** a session that touched a `non-deterministic` model cannot transition to `completed` on a
  commit-eligible path without deterministic verifier attestation (IGP-2).

### 1.4 Decision (`INT-GOV-C8`)
`proposed → policy-evaluated → constraint-checked → certified → ratified → committed → { superseded | revoked }`
- **`policy-evaluated`:** PI-4 policy evaluator PASS (deny-by-default).
- **`constraint-checked`:** all **hard** constraints satisfied.
- **`certified`:** Decision Authority ≠ proposer (SoD).
- **`ratified`:** quorum met for the decision's consequence class.
- **`committed`:** routed through the Evolution Fabric / Control Plane (the only commit path).
- **`superseded`/`revoked`:** forward-only; original decision + rationale retained immutably.

### 1.5 Plan (planning-engine output; sub-artifact of a Reasoning Session)
`drafted → constraint-checked → { feasible | infeasible } → (feasible) proposed-as-decision`
- **Invariant:** an `infeasible` plan (any hard-constraint violation) can never be proposed as a decision.

### 1.6 Memory-of-Record (`INT-GOV-C12`, semantic/episodic)
`written → active → { retained ↔ active } → expired`
- **Invariant:** authoritative memory writes route through the Evolution Fabric; working memory is ephemeral
  and never authoritative.

## 2. Decision-Rights Matrix (10 decision classes)

| # | Decision class | Accountable authority | SoD / Quorum | Escalation | Approval-Required (AD-0009) |
|:-:|----------------|-----------------------|--------------|------------|:---------------------------:|
| D1 | Register/scope a Reasoning Authority | Authority Board | — | Board | Yes |
| D2 | Register/activate an Inference Model | Authority Board | verifier-bound if non-deterministic | Board | Yes |
| D3 | Author/authorize a Goal | Goal Authority | ≤ authority.maxConsequenceClass | Board | Yes |
| D4 | Open a Reasoning Session | Reasoning Authority | budgets declared | Goal Authority | Yes if consequential |
| D5 | Define/modify a Constraint Set | Reasoning/Decision Authority | hard set change → Board | Board | Yes |
| D6 | Bind a Policy Evaluation set | Authority Board | — | Board | Yes |
| D7 | Certify a proposed Decision | Decision Authority | **≠ proposer** | Board | Yes |
| D8 | Ratify a Decision | Decision Authority | **quorum** by consequence class | Board | Yes |
| D9 | Commit a Decision (via Evolution) | Evolution Governor + Control Plane | evolution quorum | Board | Yes |
| D10 | Revoke goal/model/authority/decision | Intelligence Revocation Authority | fail-closed propagate | Board | Yes |

**Non-waivable:** the proposer of a decision may never certify (D7) or ratify (D8) it. Commit (D9) is **only**
through the Evolution Fabric — the Intelligence Fabric holds no independent write path.

## 3. The Governed Decision-Commit Pipeline

```
Goal(active) ─▶ Reasoning Session(bounded, snapshot-pinned, seeded)
    │  reason / infer(adapter) / plan / solve-constraints
    ▼
Proposal(+ mandatory rationale)                         ← advisory only; zero side effects
    │  (1) PI-4 Policy Evaluation  (deny-by-default)
    │  (2) Hard Constraint Check   (inviolable)
    │  (3) Decision Certification  (SoD: certifier ≠ proposer)
    │  (4) Decision Ratification   (quorum by consequence class; Board if over cap)
    ▼
Evolution Unit (targets governed namespace)             ← the ONLY commit path
    │  submit → approve → certify → ratify → atomic apply (Evolution Governor: maxInFlight=1)
    ▼
Control Plane (PEP) actuation + hash-chained audit (INT-AUD-001)
```

- **Reproducibility gate.** A decision is commit-eligible only if its `(inputs hash, knowledgeSnapshotRef,
  modelId+seed, constraintSetId, policySetRef)` are all recorded and the result is deterministically
  re-derivable (non-deterministic contributions are advisory and independently re-verified).
- **Fail-closed everywhere.** Any missing signature, stale/replayed transition, budget exhaustion, unresolved
  rationale, unknown model, or policy denial aborts the pipeline with no commit.

## 4. Operating Model & Separation of Duties

- **Proposer ≠ Certifier ≠ Committer.** Reasoning Authority proposes; Decision Authority certifies/ratifies;
  Evolution Governor commits. Three distinct accountable roles (mirrors AUTH-009 SoD).
- **Goal owner ≠ Decision authority** for the same consequential decision where feasible; conflicts escalate to
  the Board.
- **Federated contributions** are advisory and pass through the same pipeline locally (INT-FED-001) — no foreign
  short-circuit.

## 5. Assurance Model (8 dimensions)

| # | Assurance dimension | Evidence source |
|:-:|---------------------|-----------------|
| A1 | Governed cognition (no self-authored goals) | Goal Authority records; INT-GOV-001 §2.3/2.4 |
| A2 | Determinism / reproducibility | Session snapshot + seed + inputs hash; verifier attestations |
| A3 | Deny-by-default actuation | Pipeline §3; PI-4 policy PASS gate |
| A4 | Explainability completeness | Rationale chain (INT-AUD-001); 0 unexplained decisions |
| A5 | Separation of duties | Certification/ratification records; proposer ≠ certifier |
| A6 | Bounded cognition | Session budgets + abort records |
| A7 | Knowledge/memory read-governance & S4 | Knowledge Fabric query logs; classification inheritance |
| A8 | Auditability & tamper-evidence | Hash-chained INT_* audit; reconciliation |

## 6. Traceability
- **Refines:** `INT-GOV-001`, `AD-0016..0020`, `AD-0014`, AUTH-003 (IP-06/14/15), AUTH-008/009/012,
  Constitution Art. IX/XII.
- **Consumed by:** `INT-ARCH-001`, `INT-SEC-001`, `INT-AUD-001`, `INT-READINESS-001`, and a future PI-10
  implementation act.
- **Owner:** UCOS Authority Board.

**END INT-GOV-002 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
