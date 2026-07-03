# ECON-ARCH-001 — Economic Reference Architecture

| Field | Value |
|-------|-------|
| Artifact ID | `ECON-ARCH-001` |
| Layer | ARCH (Economic) |
| Phase | PHASE 24 · PI-13 Economic Fabric (Design) |
| Status | **DESIGN — READY FOR RATIFICATION v1.0.0** (no implementation) |
| Refines | ECON-GOV-001, AD-0016..0022, AD-0014, UCOS-PEA-001..007, UCOS-SEC-ARCH-001, AUTO-ARCH-001 |
| Refined by | ECON-SEC-001, ECON-FED-001, ECON-AUD-001, ECON-THREAT-001, ECON-READINESS-001 |

> Design only. Zero source code. All prospective work confined to `src/control/economic/*`; no
> modification of any substrate core dir or of federation/evolution/knowledge/control/autonomy behavior.

---

## 1. Architectural stance

The Economic Fabric is a **double-entry, conservation-enforcing, propose-not-act ledger &
coordination subsystem**. The load-bearing safety property is structural: **the only way a balance
changes is a conservation-checked, deterministic proposal that the Evolution Fabric commits after
Control-Plane policy evaluation**, with real-world value movement additionally gated by AD-0009. A
compromised economic actor's maximum blast radius is *rejected proposals + audit noise* — it cannot
mint, drain, double-spend, or move real funds.

## 2. Component composition

| Component | Responsibility | Reuses |
|-----------|----------------|--------|
| **Economy Registry** | Pluggable economy profiles (resource/token/knowledge/energy/hybrid/unknown) | `RegistryPort`, `MetadataPort` |
| **Asset Manager** | Asset declaration, typing, classification inheritance | PI-8 Ontology (FDG-ONT) |
| **Valuation Engine** | Deterministic valuation within a value-frame | PI-7 Knowledge; PI-10 Intelligence (FDG-INT, advisory) |
| **Treasury Ledger** | Double-entry, append-only, non-negative balances | `MetadataPort`, Evolution Fabric |
| **Budget/Allocation Manager** | Fail-closed caps; reversible allocations | ECON-GOV-001 C8/C9; PI-12 envelopes |
| **Marketplace Engine** | Offer/bid matching (proposes only); anti-wash/front-run | PI-11 Simulation (dry-run) |
| **Exchange Engine** | Deterministic value-frame conversion; bounded slippage | Valuation Engine |
| **Settlement Engine** | Atomic, idempotent, conservation-preserving settlement | PI-6 Evolution Fabric (sole commit) |
| **Incentive Engine** | Budget-bounded reward/penalty proposals | Budget Manager |
| **Economic Authority** | Enumerated, signed, revocable powers | PI-5 assertions |
| **Revocation & Emergency Halt** | Cascading revoke; non-bypassable deny-all | AUTO-ARCH-001 pattern |
| **Federation Guard** | Advisory-only cross-node value recognition | PI-5 Federation |
| **Economic Audit Sink** | Hash-chained ECON_* events + double-entry provenance | PI-5 FederatedAuditLog |

## 3. The governed economic loop

```
Economy profile (human/Board)                 ← EGP-1
   │
   ▼
Offer/Bid or Allocation/Exchange request       ─ Marketplace / Budget Manager
   │
   ▼
Valuation (deterministic)                      ─ Valuation Engine  [INT advisory, verifier-gated]
   │
   ▼
Simulation dry-run (sandbox)                   ─ PI-11             [no ledger effect]
   │
   ▼
Match / Decision                               ─ Marketplace / Exchange Engine
   │
   ├── Control Plane / Policy Evaluator (deny-by-default)  ── deny ─► reject + audit
   ├── Economic Constraints (budget/conservation/non-neg/slippage/idempotency) ── fail ─► halt + audit
   │
   ▼
Settlement proposal ──► PI-6 Evolution Fabric (sole ledger-commit path; double-entry, atomic)
   │
   ├── Real value movement? ─► AD-0009 human/Board approval (Approval-Required)  [EGP-7]
   │
   ▼
Commit (net-zero, non-negative) + hash-chained double-entry audit
```

Any failure is **fail-closed** (no balance change). The Emergency Halt Controller can freeze all (or
scoped) economic activity to deny-all instantly.

## 4. Conservation & determinism enforcement

- **Conservation gate:** the Settlement Engine rejects any proposal whose credits ≠ debits, or that
  would drive a balance negative (EC2/EC5/EC6/EC13).
- **Determinism gate (INV-6):** valuation/exchange rates from non-deterministic Intelligence models
  are advisory; a settlement is inadmissible until a deterministic verifier reproduces the rate/value
  from recorded inputs (`resultHash`). Closes EC3 (rate manipulation) structurally.
- **Idempotency:** each settlement carries a nonce; replay is a no-op (EC9).

## 5. Prospective module map (public seams only)

```
packages/platform-runtime/src/control/economic/
  types.ts                     (+ additive interfaces; no core-port change)
  economy-registry.ts
  asset-manager.ts
  valuation-engine.ts          (deterministic; INT adapter interface, advisory fallback)
  treasury-ledger.ts           (double-entry; non-negative; append-only)
  budget-allocation-manager.ts
  marketplace-engine.ts        (proposes matches; anti-wash/front-run)
  exchange-engine.ts
  settlement-engine.ts         (atomic; idempotent; Evolution-commit)
  incentive-engine.ts
  economic-authority.ts        (enumerated powers; signed; revocable)
  revocation-authority.ts
  emergency-halt.ts            (non-bypassable freeze)
  federation-guard.ts
  economic-audit-log.ts        (reuse/thin-wrap FederatedAuditLog)
  bootstrap.ts / index.ts
test/  economic.test.ts, economic-adversarial.test.ts (EC1–EC15)
```

## 6. Zero-prohibited-core-dir-change proof

- Balances/assets/economies are `economic:*` metadata records via the existing `MetadataPort`.
- Caps/rates/profiles resolved via the existing `ConfigurationPort`.
- Authorities/treasuries registered via the existing `RegistryPort`.
- Ledger mutation only via the Evolution Fabric allowlist (`economic:` prefix).
- Crypto/audit reuse `assertions.ts` (Ed25519) + `FederatedAuditLog`; policy reuse the PI-4 evaluator.

No change to `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`,
`src/configuration-runtime`, `src/contracts`, or to federation/evolution/knowledge/control/autonomy
behavior. Existing implemented baseline tests remain the additive gate.

## 7. Traceability
- **Refines:** ECON-GOV-001, EVO-ARCH-001, SIM-ARCH-001, AUTO-ARCH-001, KNOW-ARCH-001, UCOS-PEA-001..007.
- **Refined by:** ECON-SEC-001, ECON-FED-001, ECON-AUD-001, ECON-THREAT-001, ECON-READINESS-001.
- **Owner:** UCOS Authority Board.

**END ECON-ARCH-001 — DESIGN — READY FOR RATIFICATION.**
