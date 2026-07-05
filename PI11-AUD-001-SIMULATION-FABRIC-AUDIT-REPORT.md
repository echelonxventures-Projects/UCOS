# PI11-AUD-001 — Simulation Fabric Audit Report

| Field | Value |
|-------|-------|
| Artifact | **PI11-AUD-001** |
| Work item | PI-11 — Simulation Fabric |
| Basis | SIM-AUD-001 (S6), M12 `simulation-audit-log.ts` |
| Determination | **AUDITABLE — hash-chain integrity + reproducibility + tamper-evidence verified** |
| Date | 2026-07-03 |

## 1. Audit chain

`SimulationAuditLog` (M12) is an append-only, hash-chained, tamper-evident log built on the shared
`sha256`/`canonicalize` primitives (no custom cryptography), mirroring `FederatedAuditLog` /
`EvolutionAuditLog`. Each entry binds `(canonical(entry), seq, prevHash, nodeId)`; the genesis link is
`0`×64. `SimulationAuditLog.verify(export)` recomputes every hash and confirms continuity offline.

## 2. Recorded events

`AUTHORITY_REGISTERED`, `TWIN_BOUND`, `TWIN_STALE`, `SCENARIO_AUTHORIZED`, `RUN_ALLOCATED`,
`SANDBOX_WRITE_REJECTED`, `PROJECTED`, `CONSTRAINT_CHECKED`, `IMPACT_ASSESSED`, `FOREIGN_CONTRIBUTION`,
`REVOKED`, `PROMOTION_DENIED`, `PROMOTED`, `TORN_DOWN`, `DENY`. Projection and promotion entries carry
the `reproHash` reproducibility digest (A2/A8).

## 3. Verification evidence

| Property | Test | Result |
|----------|------|--------|
| Append + continuity | `simulation-audit.test.ts` | **PASS** — chain verifies intact |
| Reproducibility digest recorded | `simulation-audit.test.ts` | **PASS** |
| Tamper detection | `simulation-audit.test.ts`, adversarial S10 | **PASS** — mutated entry fails verify |
| Reorder detection | `simulation-audit.test.ts` | **PASS** — prevHash break detected |
| Deny-path auditing | `simulation.test.ts` S1 (rejected sandbox writes), e2e | **PASS** |
| End-to-end chain after commit + teardown | `simulation-control.e2e.test.ts` | **PASS** — `PROMOTED` recorded, chain verifies |

## 4. Reproducibility (A2)

A projection is a pure function of its reproducibility tuple `(snapshotHash, scenarioHash, modelId,
seed, constraintSetId, policyHash)`. Identical inputs yield an identical `projectionHash`
(`simulation-projection.test.ts`), and the promotion pipeline re-derives and compares the hash before
any commit (reproducibility gate). A divergent re-derivation is rejected (`AUDIT_DIVERGENCE`).

## 5. Chain of custody / federation reconciliation

Foreign contributions are stored under the isolated `simulation:foreign:<nodeId>:*` namespace and are
advisory-only; they never enter the commit path. The audit log is node-scoped and independently
exportable/verifiable, supporting cross-node reconciliation on the same basis as the federation audit.

**END PI11-AUD-001.**
