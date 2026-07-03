# ECON-FED-001 — Federated Economy Specification

| Field | Value |
|-------|-------|
| Artifact ID | `ECON-FED-001` |
| Layer | ARCH (Economic) |
| Phase | PHASE 24 · PI-13 Economic Fabric (Design) |
| Status | **DESIGN — READY FOR RATIFICATION v1.0.0** |
| Refines | ECON-GOV-001, ECON-SEC-001, ECON-ARCH-001, AD-0018 (FED-GOV/SEC/PROV/AUD-001), AUTH-008/009 |
| Refined by | ECON-AUD-001, ECON-THREAT-001, ECON-READINESS-001 |

> Design only. Reuses AD-0018 federation constructs unchanged. Cross-node value is
> **advisory-only, deny-only, clamped, local-sovereign, fail-closed** — there is **no cross-node
> auto-settlement**.

---

## 1. Federated economy principles (EFP-1..EFP-6)

| ID | Principle |
|----|-----------|
| **EFP-1** | **Advisory-only value recognition.** A foreign node's assets/valuations/offers are advisory; they take no local ledger effect without local ratification. |
| **EFP-2** | **Deny-only.** Foreign economic policy/authority may only restrict local economic action, never grant or mint locally. |
| **EFP-3** | **Trust-clamped.** Foreign valuations/rates are clamped to the local trust ceiling and to local slippage bounds; a foreign authority never exceeds a local one. |
| **EFP-4** | **Local-shadows-foreign.** Local `active` assets/treasuries shadow imported foreign records, which live in a disjoint `economic:federation:<nodeId>:*` keyspace. |
| **EFP-5** | **Fail-closed on partition.** On node/quorum loss, foreign-dependent valuation/exchange suspends (deny); never settle on stale foreign trust. |
| **EFP-6** | **No cross-node auto-settlement.** Any cross-node value movement is a local proposal that runs the full governed loop (policy + conservation + Evolution commit + AD-0009 for real value); the fabric never auto-settles across nodes. |

## 2. Cross-node coordination model

- Cross-node economic coordination = exchange of **signed advisory offers/valuations** (Ed25519,
  nonce+freshness, clamped), each subjected to the **local** governed economic loop. No foreign node
  can cause a local mint, transfer, or settlement.
- **Conservation is per-ledger and local:** foreign balances are never co-mingled into a local
  treasury; cross-node exchange is modeled as two independently-governed local settlements linked by a
  shared `assertionRef` (reconciled via ECON-AUD-001).
- **Provenance by convention** (FED-PROV-001): `nodeId::localId`, `attributes.provenance`, disjoint
  `economic:federation:` keys; **no first-class provenance fields on core ports**.

## 3. Sovereignty & isolation

- Foreign economic authorities register only in `economic:federation:<nodeId>:authority:*` with
  **enumerated advisory powers only** (never `mint`, `settle`, `allocate`, or `resume`).
- Local value-frames, budgets, and treasuries are **never** mutated by federation; a federation-touching
  change requires a local re-ratification token (reuse EVO-FED-001 pattern).

## 4. Reuse

Reuses AD-0018 `FederatedControlPlane`, `assertions.ts`, `FederatedAuditLog`, trust-boundary and
authority primitives **without modification**. Guard lives in `src/control/economic/federation-guard.ts`.

## 5. Traceability
- **Refines:** ECON-GOV-001, ECON-SEC-001, AD-0018 (FED-*), AUTH-008/009, AD-0014.
- **Refined by:** ECON-AUD-001, ECON-THREAT-001, ECON-READINESS-001.
- **Owner:** UCOS Authority Board.

**END ECON-FED-001 — DESIGN — READY FOR RATIFICATION.**
