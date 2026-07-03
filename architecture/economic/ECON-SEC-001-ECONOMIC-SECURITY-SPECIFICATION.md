# ECON-SEC-001 — Economic Security Specification

| Field | Value |
|-------|-------|
| Artifact ID | `ECON-SEC-001` |
| Layer | ARCH (Economic) |
| Phase | PHASE 24 · PI-13 Economic Fabric (Design) |
| Status | **DESIGN — READY FOR RATIFICATION v1.0.0** (S1/S3/S4 enforced; 0 non-waivable gaps) |
| Refines | ECON-GOV-001, ECON-ARCH-001, UCOS-SEC-ARCH-001, AUTH-008 (S1/S3/S4), AUTH-009 (AD-0009 financial), FED-SEC-001, AD-0014 |
| Refined by | ECON-FED-001, ECON-AUD-001, ECON-THREAT-001, ECON-READINESS-001 |

> Design only. Reuses ratified federation Ed25519 (`assertions.ts`); **no custom cryptography**.
> Non-waivable **S1/S3/S4** designed & enforced; 0 non-waivable gaps.

---

## 1. Economic security principles (ESP-1..ESP-6)

| ID | Principle |
|----|-----------|
| **ESP-1** | Every value-bearing construct (asset, treasury op, settlement, allocation, rate-set, mint/burn) carries a **signed assertion** verified before effect (reuse Ed25519). |
| **ESP-2** | **Deny-by-default** authorization on every economic act; enumerated economic authorities; **no autonomous mint/settle/actuate power**; SoD non-waivable. |
| **ESP-3** | **Conservation & non-negativity are security invariants** — a proposal violating credits=debits or ≥0 balance is rejected at the settlement gate (EC2/EC5/EC6/EC13). |
| **ESP-4** | **Determinism as a security control** — valuation/rates from non-deterministic models are advisory and verifier-gated; only deterministically re-derived values are commit-eligible (EC3/INV-6). |
| **ESP-5** | **No real-world actuation** — the fabric never executes a real financial transaction; real value movement is an **AD-0009 Approval-Required Operation** with human/Board sign-off (EC15). |
| **ESP-6** | **Emergency freeze as a security control** — a non-bypassable, fail-closed freeze reachable by humans/Board and auto-triggered on conservation/authority/partition breach. |

## 2. Non-waivable control mapping

| Control | Economic enforcement |
|---------|----------------------|
| **S1 (AuthN/AuthZ)** | Economic acts are performed by authenticated PI-4 identities/PI-12 actors; deny-by-default policy evaluation; enumerated signed authorities; no autonomous mint/settle. |
| **S3 (Secrets/Keys)** | Signing keys and any external-settlement credentials are **by reference only**; never embedded in treasuries, assets, ledgers, or logs. |
| **S4 (Data Protection)** | Assets/valuations/settlement records inherit the classification of their evidence (e.g., knowledge-economy assets); no down-classification; federated exports classification-gated. |
| **S6 (Audit)** | All ECON_* events hash-chained, double-entry, tamper-evident (ECON-AUD-001). |

## 3. Threat-facing controls (summary; full model in ECON-THREAT-001)

- **Counterfeit/mint (EC1):** mint only via signed authority act + Board authorization; conservation gate.
- **Double-spend/replay (EC2/EC9):** atomic settlement + nonce idempotency + Evolution single-commit.
- **Rate/oracle manipulation (EC3):** deterministic valuation; verifier gate; bounded slippage.
- **Overspend/treasury drain (EC4/EC5):** fail-closed budgets; non-negativity; deny-by-default.
- **Authority escalation (EC10):** enumerated powers; SoD; clamped delegation (via PI-12).
- **Federated value abuse (EC11):** advisory-only/deny-only/clamped; local ratification (ECON-FED-001).
- **Real actuation escape (EC15):** propose-not-act; AD-0009 gate; no real-money code path exists.

## 4. Coverage

- Signed-assertion coverage: 6/6 value-bearing act classes.
- Non-waivable coverage: S1 ✅ · S3 ✅ · S4 ✅ · S6 ✅ — 0 gaps.
- Every EC1–EC15 maps to ≥1 control here / in ECON-GOV-001 / ECON-FED-001 / ECON-AUD-001.

## 5. Traceability
- **Refines:** ECON-GOV-001, ECON-ARCH-001, UCOS-SEC-ARCH-001, AUTH-008, AUTH-009 (AD-0009), FED-SEC-001, AD-0014.
- **Refined by:** ECON-FED-001, ECON-AUD-001, ECON-THREAT-001, ECON-READINESS-001.
- **Owner:** UCOS Authority Board (Security & Trust, CAP-17).

**END ECON-SEC-001 — DESIGN — READY FOR RATIFICATION.**
