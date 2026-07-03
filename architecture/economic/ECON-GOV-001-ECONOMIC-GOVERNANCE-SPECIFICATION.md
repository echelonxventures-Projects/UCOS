# ECON-GOV-001 — Economic Governance Specification

| Field | Value |
|-------|-------|
| Artifact ID | `ECON-GOV-001` |
| Layer | ARCH (Economic) |
| Phase | PHASE 24 · PI-13 Economic Fabric (Design) |
| Status | **DESIGN — READY FOR RATIFICATION v1.0.0** (no implementation) |
| Mode | DESIGN ONLY — no source code, runtime, infrastructure, services, cryptography, real value movement, or authorization |
| Refines | AD-0016..0022 (implemented/design fabrics), AD-0014 (Ω∞ deferral), AUTH-003 (IP-01..17, esp. IP-13 Backward-Compat / INV-13 Infinite Extensibility), AUTH-008 (S1/S3/S4), AUTH-009 (AD-0009 financial-transaction Approval-Required), AUTH-012, UCOS-CONST-001 (Art. IX/XII), UCOS-SEC-ARCH-001, UCOS-DOM-ARCH-001 (Core Commerce CAP-01..08), AUTO-GOV-001 (PI-12) |
| Refined by | ECON-ARCH-001, ECON-SEC-001, ECON-FED-001, ECON-AUD-001, ECON-THREAT-001, ECON-READINESS-001; prospective PI-13 authorization act |

> **Append-only / additive.** The Economic Fabric is a **technology-neutral value & resource
> accounting/coordination layer**. It maintains **governed ledger balances** and **proposes** economic
> outcomes; it moves **no real funds**, binds **no currency/token/energy technology**, and performs
> **no real-world financial transaction** — those remain **Approval-Required Operations** (AD-0009)
> executed by humans/the Board. It enrolls **no** existential invariant (INV-14..20 deferred),
> preserves INV-1..13, and keeps the **AD-0014 Ω∞ boundary** intact (no self-directed / self-owned
> economy). It is distinct from and subordinate to the ratified **Core Commerce** business domains
> (CAP-01..08); it is the *platform* economic substrate they may consume, not a business marketplace.

---

## 1. Purpose & position

The Economic Fabric lets UCOS **account for, allocate, incentivize, exchange, and settle value and
resources** across pluggable economy types, under governed authority and deterministic rules. Every
ledger mutation (mint/burn/transfer/settle/allocate) is committed **only** through the ratified
**PI-6 Evolution Fabric**, policy-evaluated by the **PI-4 Control Plane**, dry-run in **PI-11
Simulation**, and — where it maps to a real financial act — gated by **AD-0009** human/Board approval.
Autonomous economic actors (PI-12) operate strictly inside **budgets/envelopes** and also **propose,
never actuate**. Additive over PI-2..PI-12 with **zero prohibited-core-dir change** (new
`src/control/economic/*` + reserved `economic:*` metadata keyspace only).

## 2. Supported economy types (pluggable; INV-13 Infinite Extensibility)

Each economy is a **declared metadata profile** (`economic:economy:<id>`) governed by the *same*
constructs and invariants; **no** economy-specific logic is hardcoded.

| Economy | Profile intent |
|---------|----------------|
| **Resource** | Finite accountable capacities (compute/storage/bandwidth) tracked as conserved balances. |
| **Token** | Fungible governed units of account within a value-frame; mint/burn only by authority act. |
| **Knowledge** | Value/credits over governed knowledge contributions (PI-7), classification-inherited. |
| **Energy** | Energy budgets/credits as a conserved resource class; technology-neutral units. |
| **Hybrid** | Composite value-frames combining ≥2 profiles under one deterministic valuation function. |
| **Unknown Future** | A profile *shape* (not content) — new economy types are added as metadata profiles with a declared valuation/exchange function; **no schema/core change** (INV-13). |

## 3. Economic principles (EGP-1..EGP-12)

| ID | Principle | Requirement |
|----|-----------|-------------|
| **EGP-1** | Governed Value (No Self-Owned Economy) | Assets/treasuries/authorities are always granted by a human/Board authority; the fabric owns nothing autonomously. |
| **EGP-2** | Conservation | No value/resource is created or destroyed except by an explicit, signed, authorized mint/burn act; every transfer is double-entry and net-zero. |
| **EGP-3** | Non-Negative Balances (Fail-Closed) | No treasury/budget may go negative; underflow ⇒ deny, never overdraw. |
| **EGP-4** | Deny-by-Default | Every allocation, exchange, settlement, and mint is denied unless policy allows and all economic constraints pass. |
| **EGP-5** | Propose-not-Act / Evolution-Only Commit | Every ledger mutation is a proposal committed only via the Evolution Fabric; no independent write/rollback path. |
| **EGP-6** | Determinism (INV-6) | Valuation, exchange rates, and settlement are deterministic functions of recorded inputs; no fabricated market prices; non-deterministic pricing models are advisory + verifier-gated. |
| **EGP-7** | No Real-World Actuation | The fabric never executes a real financial transaction; any real value movement is an **AD-0009 Approval-Required Operation** performed by humans/the Board. |
| **EGP-8** | Separation of Duties | mint-propose ≠ authorize ≠ settle ≠ approve ≠ audit ≠ revoke; no adjacent powers co-held. |
| **EGP-9** | Bounded Incentives & Budgets | Incentives and budgets are capped, expiring, and non-escalating; no runaway minting/reward farming. |
| **EGP-10** | Idempotent, Atomic Settlement | Settlement is atomic (all-or-nothing) and idempotent (replay-safe); partial settlement is impossible. |
| **EGP-11** | Auditability (S6) & Reversibility | Every economic event is hash-chained; allocations/exchanges are reversible by governed compensating entries (never silent edits). |
| **EGP-12** | Local Sovereignty & No Ω∞ | Federated value is advisory-only/deny-only; no self-directed existential economy; INV-1..13 preserved; INV-14..20 not enrolled. |

## 4. Governed constructs (ECON-C1..ECON-C12)

Metadata-backed under `economic:<kind>:<id>`; single-owner; signed; lifecycle-governed; deny-by-default.

| # | Construct | Definition | Key rules |
|---|-----------|------------|-----------|
| **C1** | **Asset** | A governed unit of value in a declared economy profile (fungible or non-fungible by declaration). | No intrinsic real-world binding; classification-inherited; created only by an authorized mint act. |
| **C2** | **Value** | A deterministic valuation of an asset within a declared value-frame (unit of account). | Pluggable, deterministic valuation function; no fabricated/oracle-poisoned prices (EC3). |
| **C3** | **Resource** | A finite, conserved, accountable capacity tracked as balances. | Conservation-enforced (EGP-2); non-negative (EGP-3). |
| **C4** | **Treasury** | A single-owner custodial account holding asset/resource balances. | Append-only double-entry ledger; no negative balance; owner accountable; suspendable/haltable. |
| **C5** | **Settlement** | The atomic, conservation-preserving finalization of an exchange/transfer. | Double-entry; atomic; idempotent (nonce); commit only via Evolution Fabric (EGP-5/EGP-10). |
| **C6** | **Marketplace** | A governed matching venue (offers/bids) that **proposes** matches. | Deny-by-default; never self-executes; matches settle via C5; anti-wash/anti-front-run controls (EC7). |
| **C7** | **Incentive** | A governed, budget-bounded reward/penalty rule tied to policy outcomes. | Capped, expiring, non-escalating budget; no runaway minting (EC8). |
| **C8** | **Budget** | A governed spend/allocation cap per actor/goal/period. | Fail-closed; monotonic non-escalation; ties to PI-12 autonomy envelopes. |
| **C9** | **Allocation** | A governed, reversible assignment of asset/resource from a treasury/budget to a purpose. | Audited; reversible by compensating entry; deny if budget/constraint fails. |
| **C10** | **Exchange** | A governed conversion between value-frames/asset types via a declared deterministic function. | Bounded slippage; no fabricated rate; deterministic; settles via C5. |
| **C11** | **Economic Authority** | Enumerated, signed, revocable powers (`mint-propose\|burn-propose\|allocate\|settle-propose\|set-rate-propose\|revoke`). **No autonomous mint/settle/actuate power.** | Enumerated only; SoD; revocable; never grants identity/permission outside scope. |
| **C12** | **Economic Federation** | Advisory-only cross-node value/asset recognition authority. | Deny-only, clamped, local-shadows-foreign; no cross-node auto-settlement (EC11; ECON-FED-001). |

## 5. Economic invariants (fail-closed)

- **Conservation:** Σ(credits) = Σ(debits) for every settlement; mint/burn only via signed authority act.
- **Non-negativity:** every treasury/budget balance ≥ 0 at all times.
- **Determinism:** valuation(asset, frame, t) and rate(frameA, frameB, t) are pure functions of recorded inputs.
- **Idempotency:** settlement(nonce) applied at most once.
- **Reversibility:** every allocation/exchange has a governed compensating path (no silent deletion).

## 6. Lifecycles & decision-rights (D1..D10)

- **Asset/Treasury:** `declared → active → (frozen) → retired`. **Settlement:** `proposed → evaluated → (denied|approved) → committed(Evolution) | rejected`.
- **Budget/Allocation:** `granted → active → (exhausted|expired|revoked)`.

| Class | Proposer | Authorizer | Approver (real act) | Revoker |
|-------|----------|-----------|---------------------|---------|
| D1 Mint/Burn | Econ authority | Board | AD-0009 (if real) | Revocation authority |
| D2 Open treasury | Econ authority | Board | — | Revocation authority |
| D3 Set/adjust value-frame or rate | Econ authority | Board + policy | AD-0009 (if real) | Revocation authority |
| D4 Allocate/Budget | Actor/authority | Policy (PEP) + constraints | — | Revocation authority |
| D5 Post offer/bid | Actor | Policy (PEP) | — | Marketplace/authority |
| D6 Match | Marketplace (proposes) | Policy (PEP) | — | — |
| D7 Settle | Settlement engine (proposes) | PEP + conservation check | AD-0009 (if real value moves) | Emergency halt |
| D8 Incentive payout | Incentive rule (proposes) | PEP + budget | AD-0009 (if real) | Revocation authority |
| D9 Federate value | Econ fed authority | Board | — | Revocation authority |
| D10 Emergency halt | Human/Board / auto-trigger | (none to halt) | distinct resume authority | — |

## 7. Reuse (no re-implementation)

PI-4 Control Plane (policy evaluation) · PI-6 Evolution Fabric (sole ledger-commit path) · PI-5
Federation (advisory value recognition; Ed25519 + FederatedAuditLog) · PI-7 Knowledge (valuation
evidence) · PI-11 Simulation (dry-run markets/allocations) · PI-12 Autonomy (economic actors under
budgets; propose-not-act). Deferred gates: **FDG-INT** (non-deterministic pricing models),
**FDG-MEM** (price/allocation history), **FDG-ONT** (asset/economy semantic typing).

## 8. Coverage of mandated concepts (12/12)

Asset (C1) · Value (C2) · Resource (C3) · Treasury (C4) · Settlement (C5) · Marketplace (C6) ·
Incentive (C7) · Budget (C8) · Allocation (C9) · Exchange (C10) · Economic Authority (C11) · Economic
Federation (C12) — all defined and governed.

## 9. Traceability
- **Refines:** AD-0016..0022, AD-0014, AUTH-003/008/009/012, UCOS-CONST-001 (Art. IX/XII), UCOS-SEC-ARCH-001, UCOS-DOM-ARCH-001, AUTO-GOV-001, EVO-GOVERNOR-001, SIM-ARCH-001.
- **Refined by:** ECON-ARCH/SEC/FED/AUD/THREAT/READINESS-001.
- **Owner:** UCOS Authority Board (custodian: Platform Governance CAP-15; commerce alignment CAP-01..08).

**END ECON-GOV-001 — DESIGN — READY FOR RATIFICATION.**
