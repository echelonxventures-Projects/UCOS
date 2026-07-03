# AUTO-AUD-001 — Autonomy Audit & Explainability Specification

| Field | Value |
|-------|-------|
| Artifact ID | `AUTO-AUD-001` |
| Layer | ARCH (Autonomy) |
| Phase | PHASE 23 · PI-12 Autonomy Fabric (Design) |
| Status | **DESIGN — READY FOR RATIFICATION v1.0.0** |
| Refines | AUTO-GOV-001, AUTO-SEC-001, AUTO-FED-001, FED-AUD-001, UCOS-SEC-ARCH-001 (AUD-1..7 / S6), AUTH-008/010/012 |
| Refined by | AUTO-THREAT-001, AUTO-READINESS-001 |

> Design only. Reuses the ratified hash-chained `FederatedAuditLog` (`ChainedEntry`) via the PI-4
> pluggable `AuditSink`; **no custom cryptography, no new audit engine**.

---

## 1. Audit principles (AAP-1..AAP-6)

| ID | Principle |
|----|-----------|
| **AAP-1** | Every autonomy event is written to a **hash-chained, tamper-evident** log before/at effect. |
| **AAP-2** | **Mandatory rationale chain** — no committed decision without a complete `goal → evidence → plan → constraints → policy → conclusion` record. |
| **AAP-3** | **Reproducibility** — each decision records a `resultHash` and the evidence refs sufficient to deterministically re-derive it (INV-6). |
| **AAP-4** | **Cross-node reconciliation** — federated autonomy events reconcile via `assertionRef`; divergence is fail-closed. |
| **AAP-5** | **Non-repudiation** — halt, revoke, approval (AD-0009), and denial events are immutable and independently exportable/verifiable offline. |
| **AAP-6** | **Audit-preserving revocation/forgetting** — the audited *fact* of an action is retained even if its payload is governed-forgotten (reuse MEM pattern). |

## 2. Mandatory audited events (AUTO_* )

`AUTO_ACTOR_CREATED` · `AUTO_CHARTER_BOUND` · `AUTO_GOAL_ASSIGNED` · `AUTO_AUTHORITY_GRANTED` ·
`AUTO_DELEGATED` · `AUTO_DECISION_FORMED` · `AUTO_POLICY_EVALUATED` (allow/deny) ·
`AUTO_CONSTRAINT_CHECK` (pass/fail) · `AUTO_SIMULATED` (dry-run) · `AUTO_PROPOSED` (→Evolution) ·
`AUTO_EXECUTION_APPROVED` (AD-0009) · `AUTO_COMMITTED` · `AUTO_REJECTED` · `AUTO_REVOKED` ·
`AUTO_HALTED` / `AUTO_RESUMED` · `AUTO_FED_ADVISORY_RECEIVED` · `AUTO_FED_DENIED`.

Each event records: actor id, charter/envelope ref, goal ref, authority/delegation chain, policy
decision + reason, constraint results, evidence refs, `resultHash`, signer, nonce, timestamp, and
prior-entry hash.

## 3. Rationale chain (explainability)

A decision's rationale chain is a directed record linking the authorizing charter, the goal, every
evidence reference (knowledge/memory), the advisory plan (and its verifier result), the constraint
evaluations, the policy decision, and the conclusion. **Completeness is a gate:** an incomplete chain
⇒ the decision is rejected (closes A9 audit/ rationale suppression).

## 4. Reconciliation & verification

- Within-node: chain integrity verified by hash linkage; any break ⇒ fail-closed halt.
- Cross-node: reconcile via signed `assertionRef`; effect-mismatch or hash-break ⇒ divergence,
  fail-closed (reuse FED-AUD-001).
- Offline: full export + independent verification of chain + signatures without the live system.

## 5. Traceability
- **Refines:** AUTO-GOV-001, AUTO-SEC-001, AUTO-FED-001, FED-AUD-001, UCOS-SEC-ARCH-001 (S6/AUD-1..7), AUTH-008/010/012.
- **Refined by:** AUTO-THREAT-001, AUTO-READINESS-001.
- **Owner:** UCOS Authority Board (Compliance & Assurance, CAP-16).

**END AUTO-AUD-001 — DESIGN — READY FOR RATIFICATION.**
