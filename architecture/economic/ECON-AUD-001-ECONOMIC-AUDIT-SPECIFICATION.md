# ECON-AUD-001 — Economic Audit & Ledger-Integrity Specification

| Field | Value |
|-------|-------|
| Artifact ID | `ECON-AUD-001` |
| Layer | ARCH (Economic) |
| Phase | PHASE 24 · PI-13 Economic Fabric (Design) |
| Status | **DESIGN — READY FOR RATIFICATION v1.0.0** |
| Refines | ECON-GOV-001, ECON-SEC-001, ECON-FED-001, FED-AUD-001, UCOS-SEC-ARCH-001 (S6/AUD-1..7), AUTH-008/010/012 |
| Refined by | ECON-THREAT-001, ECON-READINESS-001 |

> Design only. Reuses the ratified hash-chained `FederatedAuditLog` (`ChainedEntry`) via the PI-4
> pluggable `AuditSink`; **no custom cryptography, no new audit engine**.

---

## 1. Audit principles (EAP-1..EAP-6)

| ID | Principle |
|----|-----------|
| **EAP-1** | Every economic event is written to a **hash-chained, tamper-evident, double-entry** log at/before commit. |
| **EAP-2** | **Ledger integrity is provable** — replaying the audited entries reproduces every treasury balance exactly (conservation + non-negativity verifiable offline). |
| **EAP-3** | **Reproducibility** — each valuation/exchange/settlement records inputs + `resultHash` sufficient to deterministically re-derive it (INV-6). |
| **EAP-4** | **Cross-node reconciliation** — federated value events reconcile via `assertionRef`; effect-mismatch or hash-break ⇒ fail-closed divergence. |
| **EAP-5** | **Non-repudiation** — mint/burn, settlement, allocation, freeze, revoke, and AD-0009 approvals are immutable and independently exportable/verifiable. |
| **EAP-6** | **Reversibility over deletion** — corrections are governed compensating entries; ledger rows are never silently edited or deleted. |

## 2. Mandatory audited events (ECON_* )

`ECON_ECONOMY_DECLARED` · `ECON_ASSET_MINTED` / `ECON_ASSET_BURNED` · `ECON_TREASURY_OPENED` ·
`ECON_VALUATION_COMPUTED` · `ECON_RATE_SET` · `ECON_OFFER_POSTED` / `ECON_BID_POSTED` ·
`ECON_MATCH_PROPOSED` · `ECON_POLICY_EVALUATED` (allow/deny) · `ECON_CONSTRAINT_CHECK`
(conservation/non-neg/budget/slippage/idempotency: pass/fail) · `ECON_SIMULATED` (dry-run) ·
`ECON_SETTLEMENT_PROPOSED` · `ECON_SETTLEMENT_APPROVED` (AD-0009) · `ECON_SETTLED` (double-entry) ·
`ECON_ALLOCATED` / `ECON_ALLOCATION_REVERSED` · `ECON_INCENTIVE_PAID` · `ECON_REJECTED` ·
`ECON_FROZEN` / `ECON_UNFROZEN` · `ECON_REVOKED` · `ECON_FED_ADVISORY_RECEIVED` / `ECON_FED_DENIED`.

Each records: economy id, asset/value-frame, treasury(s), debit/credit legs (net-zero), authority &
signer, policy decision + reason, constraint results, evidence refs, nonce, `resultHash`, timestamp,
and prior-entry hash.

## 3. Double-entry provenance & integrity checks

- Every `ECON_SETTLED` carries balanced debit/credit legs; the audit verifier asserts Σ=0 and both
  affected balances ≥ 0 post-commit.
- **Offline ledger proof:** an independent verifier reconstructs all treasury balances from the chain
  and confirms conservation, non-negativity, and idempotency (nonce uniqueness) — closing EC6/EC12/EC13.

## 4. Reconciliation & verification

- Within-node: hash-linkage + balance replay; any break ⇒ fail-closed freeze.
- Cross-node: reconcile paired local settlements via shared `assertionRef`; mismatch ⇒ divergence,
  fail-closed (reuse FED-AUD-001).
- Offline: full export + independent verification of chain, signatures, and balances.

## 5. Traceability
- **Refines:** ECON-GOV-001, ECON-SEC-001, ECON-FED-001, FED-AUD-001, UCOS-SEC-ARCH-001 (S6/AUD-1..7), AUTH-008/010/012.
- **Refined by:** ECON-THREAT-001, ECON-READINESS-001.
- **Owner:** UCOS Authority Board (Compliance & Assurance, CAP-16).

**END ECON-AUD-001 — DESIGN — READY FOR RATIFICATION.**
