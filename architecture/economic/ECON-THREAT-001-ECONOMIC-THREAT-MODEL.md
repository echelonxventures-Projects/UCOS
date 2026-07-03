# ECON-THREAT-001 — Economic Threat Model (EC1–EC15)

| Field | Value |
|-------|-------|
| Artifact ID | `ECON-THREAT-001` |
| Layer | ARCH (Economic) |
| Phase | PHASE 24 · PI-13 Economic Fabric (Design) |
| Status | **DESIGN — READY FOR RATIFICATION v1.0.0** (15 threats; **0 residual High/High**) |
| Method | STRIDE-aligned; per-threat pre/post likelihood×impact scoring; adversarial-test obligation |
| Refines | ECON-GOV-001, ECON-ARCH-001, ECON-SEC-001, ECON-FED-001, ECON-AUD-001, AUTH-008 (S1/S3/S4), AUTH-009 (AD-0009), AD-0014, UCOS-CONST-001 (Art. IX/X) |
| Refined by | ECON-READINESS-001 |

> Scale L/M/H. "Residual" = post-mitigation. Target **0 residual High/High**. The fabric's structural
> properties — conservation + non-negativity gates, propose-not-act, Evolution-only commit, and the
> AD-0009 gate on any real value movement — bound impact across the ledger.

---

## 1. Threat ledger

| ID | Threat (STRIDE) | Pre (L×I) | Primary mitigations | Residual (L×I) |
|----|-----------------|:---------:|---------------------|:--------------:|
| **EC1** | Counterfeit asset / unauthorized mint (S/T) | H×H | Mint only via signed authority act + Board auth; conservation gate; enumerated powers | **L×M** |
| **EC2** | Double-spend / non-atomic settlement (T) | H×H | Atomic settlement; double-entry; Evolution single-commit; nonce idempotency | **L×M** |
| **EC3** | Value/rate manipulation / oracle poisoning (T) | H×H | Deterministic valuation (ESP-4); verifier gate (INV-6); bounded slippage; no fabricated prices | **L×M** |
| **EC4** | Budget/allocation bypass / overspend (T/E) | M×H | Fail-closed budgets; deny-by-default; monotonic non-escalation | **L×M** |
| **EC5** | Treasury drain / unauthorized transfer (E) | H×H | Enumerated authority; deny-by-default PEP; non-negativity; signed settlement | **L×M** |
| **EC6** | Conservation violation / value inflation (T) | H×H | Credits=debits gate; offline ledger proof (EAP-2); mint only by authority | **L×L** |
| **EC7** | Marketplace manipulation (wash/front-run) (T) | M×H | Match proposes-only; policy + anti-wash/front-run controls; audit reconciliation | **L×M** |
| **EC8** | Incentive gaming / runaway minting (T/DoS) | M×H | Capped, expiring, non-escalating incentive budgets; conservation gate | **L×L** |
| **EC9** | Settlement replay / idempotency break (T) | M×H | Nonce idempotency; Evolution single-commit; audit replay check | **L×L** |
| **EC10** | Economic-authority escalation (E) | M×H | Enumerated signed powers; SoD; clamped delegation (PI-12); Board auth for mint/rate | **L×M** |
| **EC11** | Federated value abuse (foreign grants local effect) (E) | M×H | Advisory-only/deny-only/clamped; local ratification; no cross-node auto-settle | **L×L** |
| **EC12** | Audit/ledger forgery or suppression (R) | M×H | Hash-chained double-entry audit; offline verifiable; incomplete ⇒ reject | **L×L** |
| **EC13** | Negative balance / underflow (T) | M×H | Non-negativity gate at settlement; fail-closed | **L×L** |
| **EC14** | Economic denial / liquidity lock / exhaustion (DoS) | M×M | Rate/time-box constraints; single in-flight settlement bound; emergency freeze | **L×M** |
| **EC15** | Real-world financial actuation escape (E) — *AD-0009 boundary* | H×H | Propose-not-act (EGP-7); no real-money code path; AD-0009 human/Board approval; emergency freeze | **L×M** |

## 2. Residual posture

- **0 residual High/High** across EC1–EC15 (max residual = L×M).
- Structural bound: no balance changes except via a conservation-checked, deterministic,
  non-negativity-safe, idempotent proposal committed by the Evolution Fabric (closes EC1/EC2/EC5/EC6/EC13);
  no real funds move without AD-0009 human/Board approval (closes EC15); non-deterministic pricing
  cannot reach a commit (EC3). Impact is capped at rejected proposals + audit noise.

## 3. Boundary coverage

Boundaries — actor↔control-plane, actor↔evolution (commit), treasury↔ledger, marketplace↔settlement,
local↔federated, valuation↔intelligence (quarantine), fabric↔real-world (AD-0009) — each carry ≥1
threat and ≥1 control. 15/15 threats mapped; 0 unmapped.

## 4. Adversarial-test obligation (for PI-13 implementation)

An EC1–EC15 suite is a mandatory implementation gate: counterfeit mint, double-spend, rate poisoning,
overspend, treasury drain, conservation break, wash/front-run, incentive farming, replay, authority
escalation, foreign-grant, ledger forgery, underflow, liquidity lock, and real-actuation attempt —
each **blocked** with a typed denial + double-entry audit, and the implemented baseline tests remain
green.

## 5. Traceability
- **Refines:** ECON-GOV/ARCH/SEC/FED/AUD-001, AUTH-008, AUTH-009 (AD-0009), AD-0014, UCOS-CONST-001 (Art. IX/X).
- **Refined by:** ECON-READINESS-001; prospective PI-13 authorization + implementation acts.
- **Owner:** UCOS Authority Board.

**END ECON-THREAT-001 — DESIGN — READY FOR RATIFICATION (0 residual High/High).**
