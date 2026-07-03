# ECON-B05 — Economy Fabric Implementation Program

| Field | Value |
|-------|-------|
| Artifact ID | `ECON-B05` (Implementation Program B05 — Economy Fabric) |
| Layer | ARCH → IMPL PROGRAM (Economic) |
| Version | 1.0.0 |
| Status | **DESIGN-COMPLETE IMPLEMENTATION PROGRAM — READY FOR AUTHORIZATION REVIEW** (no construction authorized) |
| Phase | PHASE R11 — Economy Fabric Realization (program layer) |
| Date | 2026-07-02 |
| Refines | `ECON-001`, `ECON-ARCH-001`, `ECON-GOV-001`, `ECON-SEC-001`, `ECON-FED-001`, `ECON-AUD-001`, `ECON-THREAT-001`, `ECON-READINESS-001` |
| Governance | Subordinate to AD-0014 (Ω∞ deferral), AD-0009 (financial-transaction Approval-Required), INV-1..13, Constitution Article IX; PI-13 authorization NOT granted |
| Owner | UCOS Authority Board (custodians: Platform Governance CAP-15; commerce alignment CAP-01..08; security CAP-17; assurance CAP-16) |

---

> ## ⚠ GOVERNING DISCLAIMER — DESIGN / PROGRAM ARTIFACT ONLY
>
> This is an **implementation program** (a construction blueprint + backlog), **not source code and not an
> authorization**. All TypeScript, SQL, and schema herein is **illustrative design specification**; it is
> **not** created under `packages/` and **must not** be treated as implemented code. The Constitution
> **Article IX generation lock REMAINS ACTIVE**; **`UCOS-CONSTRUCTION-BLOCKED` is unchanged**; the
> **AD-0014 Ω∞ deferral** is preserved (INV-1..13 unchanged; **no INV-14..20** enrolled). **No real-world
> financial actuation** is permitted — any real value movement is an **AD-0009 Approval-Required Operation**.
> Construction of `packages/platform-runtime/src/control/economic/*` may begin **only** after (a) independent
> constitutional review, (b) the **AUTH-012 ledger restoration** (`UCOS-AUTH-REC-PKG-001`, Phase 21), and
> (c) a separate Authority Board scoped **Article IX release** act (a future `AD-00xx`). This program releases
> no lock.

---

## 0. Program Objective & The Three Load-Bearing Requirements

The Economy Fabric makes UCOS **account for, measure, price, allocate, exchange, and settle value and
resources** under governed authority and deterministic rules. Implementation Program **B05** delivers six
engines as one coherent subsystem:

| # | Engine | B05 role | Existing ECON basis |
|---|--------|----------|---------------------|
| E1 | **Metering Engine** | Capture every resource consumption as a signed, immutable usage record | *new in B05* (extends C3 Resource) |
| E2 | **Resource Accounting** | Maintain conserved resource inventories/quotas; reconcile metered usage to capacity | *new in B05* (extends C3 Resource + EM4) |
| E3 | **Billing Engine** | Rate usage → charges → invoices → statements; produce a traceable cost per action | *new in B05* (aligns platform-side with UCOS-DOM-007 Billing) |
| E4 | **Marketplace Engine** | Offer/bid matching (proposes only); anti-wash / anti-front-run | `ECON-ARCH-001` EM6 |
| E5 | **Settlement Engine** | Atomic, idempotent, conservation-preserving settlement via Evolution commit | `ECON-ARCH-001` EM8 (chokepoint) |
| E6 | **Accounting Engine** | Double-entry general ledger + trial balance + period close over the Treasury Ledger | `ECON-ARCH-001` EM4 (Treasury Ledger), promoted to first-class GL |

The program is governed by three non-negotiable requirements, each realized as an enforced invariant:

| Requirement | Invariant | Realizing engines | Structural enforcement |
|-------------|-----------|-------------------|------------------------|
| **Every resource measurable** | **REQ-MEAS** — no resource is consumed without a signed, deterministic usage record referencing a declared meter and unit | E1 Metering, E2 Resource Accounting | A resource debit is inadmissible to settlement unless it carries a `usageRecordId` whose `resultHash` is reproducible (INV-6). Unmetered consumption ⇒ deny. |
| **Every action accountable** | **REQ-ACCT** — every value-bearing action produces a balanced (net-zero) double-entry posting and a hash-chained audit event | E6 Accounting, E5 Settlement | Settlement rejects any posting where Σcredits ≠ Σdebits; every commit emits an `ECON_*` event on the tamper-evident chain. No posting, no action. |
| **Every cost traceable** | **REQ-TRACE** — every charge links backward to the usage/offer that caused it and forward to the ledger posting that settled it | E1→E3→E5→E6 chain | Each `Charge` carries `sourceRef` (usage/match) and `settlementRef`; the audit replay reconstructs the full cost lineage offline. Broken lineage ⇒ reject. |

These three invariants are added to the EGP set as **EGP-13 (Measurability)**, **EGP-14 (Accountability)**,
and **EGP-15 (Cost Traceability)** and are verified by the acceptance suite (§7) and gates (§8).

---

## Deliverable 1 — Architecture

### 1.1 Architectural stance (inherited, unchanged)

The Economy Fabric is a **double-entry, conservation-enforcing, propose-not-act ledger & coordination
subsystem** (`ECON-ARCH-001` §1). The only way a balance changes is a conservation-checked, deterministic
proposal that the **PI-6 Evolution Fabric** commits after **PI-4 Control-Plane** policy evaluation; real
value movement is additionally gated by **AD-0009**. B05 adds measurement (metering), resource inventory
(resource accounting), pricing (billing), and period-close (accounting) **around** this chokepoint without
weakening it.

### 1.2 Component composition (B05 view)

```
                         ┌─────────────────────────── PI-4 Control Plane (deny-by-default) ──────────────────────────┐
                         │                                                                                             │
 usage signal ─► [E1 Metering] ─► UsageRecord ─► [E2 Resource Accounting] ─► quota/inventory check                    │
      (signed)              │                              │                                                          │
                            ▼                              ▼                                                          │
                     [E3 Billing] ── rate ─► Charge ─► Invoice ─► Statement                                           │
                            │                              │                                                          │
 offer/bid ─► [E4 Marketplace] ── match (proposes) ────────┤                                                          │
                                                           ▼                                                          │
                                            [E5 Settlement] ── conservation + non-neg + nonce gate                    │
                                                           │  (SOLE chokepoint; movesRealValue ⇒ PENDING AD-0009)     │
                                                           ▼                                                          │
                                             PI-6 Evolution Fabric (sole ledger-commit path)                          │
                                                           ▼                                                          │
                                            [E6 Accounting] ── double-entry GL, trial balance, period close           │
                                                           ▼                                                          │
                                    Economic Audit Sink (hash-chained ECON_* + double-entry provenance)  ◄────────────┘
```

### 1.3 Module map (additive; extends `ECON-001` §I.1)

All B05 work is confined to the additive subtree; **zero prohibited-core-dir change**. Modules `EM0`–`EM15`
are the ratified `ECON-001` set; B05 introduces `EM16`–`EM19` and promotes the Treasury Ledger to a
first-class Accounting Engine surface.

```
packages/platform-runtime/src/control/economic/
├── types.ts                        # EM0  Core types (extended additively for B05: Meter, UsageRecord, RateCard, Charge, Invoice, Account)
├── economy-registry.ts             # EM1
├── asset-manager.ts                # EM2
├── valuation-engine.ts             # EM3
├── treasury-ledger.ts              # EM4  (double-entry ledger substrate)
├── budget-allocation-manager.ts    # EM5
├── marketplace-engine.ts           # EM6  ← E4
├── exchange-engine.ts              # EM7
├── settlement-engine.ts            # EM8  ← E5 (chokepoint)
├── incentive-engine.ts             # EM9
├── economic-authority.ts           # EM10
├── revocation-authority.ts         # EM11
├── emergency-halt.ts               # EM12
├── federation-guard.ts             # EM13
├── economic-audit-log.ts           # EM14
├── index.ts / bootstrap.ts         # EM15
├── metering-engine.ts              # EM16 ← E1  (NEW: signed usage records; deterministic)
├── resource-accounting.ts          # EM17 ← E2  (NEW: conserved inventories, quotas, reconciliation)
├── billing-engine.ts               # EM18 ← E3  (NEW: rating, charges, invoices, statements, dunning-propose)
└── accounting-engine.ts            # EM19 ← E6  (NEW: GL views, trial balance, period close over EM4)
```

**Dependency order (acyclic, extends `ECON-001` §1.1):**

```
EM0
 → EM1, EM10, EM14
   → EM2, EM3, EM4, EM16 (metering)
     → EM5, EM7, EM9, EM17 (resource-accounting), EM18 (billing)
       → EM6 (marketplace)
         → EM8 (settlement)            [sole conservation/commit chokepoint]
           → EM19 (accounting), EM11, EM12, EM13
             → EM15 (bootstrap/index)
```

Metering (EM16) depends only on core ports + audit — it records facts and never mutates balances.
Billing (EM18) *proposes* charges but never posts them; only Settlement (EM8) posts, and only Accounting
(EM19) rolls up the posted ledger. This preserves the single-chokepoint property.

### 1.4 Integration with ratified & design fabrics

Unchanged from `ECON-001` §1.2. Hard couplings: **PI-4** (policy), **PI-6** (sole commit),
**PI-5** (Ed25519 assertions + FederatedAuditLog), **PI-7** (read-only valuation evidence),
**PI-2/3** (`MetadataPort`, `ConfigurationPort`, `RegistryPort`). Deferred fail-closed FDGs:
PI-8 Ontology, PI-9 Memory, PI-10 Intelligence, PI-11 Simulation, PI-12 Autonomy.

### 1.5 Commerce alignment (non-collision)

The B05 Billing/Settlement/Accounting engines are the **platform economic substrate**. They are distinct
from and subordinate to the ratified **Core Commerce** business domains — **UCOS-DOM-006 Payments**,
**UCOS-DOM-007 Billing**, **UCOS-DOM-008 Settlement** (CD-09 Financial Data, Restricted-Financial, S1/S4).
B05 does **not** redefine those domains; business capabilities `CAP-01..08` *may consume* the fabric via
read-only, Evolution-routed capability links. Ownership of the commerce domains is unchanged.

---

## Deliverable 2 — Domain Model

### 2.1 Bounded context & ubiquitous language

Bounded context: **Economic Fabric (platform substrate)**. Metadata keyspace: `economic:*`.

| Term | Definition |
|------|------------|
| **Meter** | A declared measurable dimension of a resource (e.g., `compute.cpu.ms`, `storage.gb.hour`) with a unit and a deterministic measurement function. |
| **Usage Record** | An immutable, signed observation that `quantity` of a meter was consumed by a `subject` in a `window`. |
| **Resource Account** | A conserved inventory/quota of a resource unit held by an owner (capacity, reserved, consumed, available). |
| **Rate Card** | A declared, versioned, deterministic mapping from (meter, tier, value-frame) → price. |
| **Charge** | A priced line item derived from usage or a match; the atomic unit of cost. |
| **Invoice** | An immutable aggregation of charges for a billing subject over a period. |
| **Statement** | A periodic account position (opening, activity, closing) issued to an owner. |
| **Posting** | A balanced set of ledger legs (net-zero) representing one accountable action. |
| **Account (GL)** | A named node in the chart of accounts against which postings accrue. |
| **Period** | A closed accounting interval with a frozen trial balance. |

### 2.2 Aggregates, entities, invariants

| Aggregate root | Entities / value objects | Key invariants |
|----------------|--------------------------|----------------|
| **Meter** (EM16) | `MeterDefinition`, `MeasurementFn` ref | Immutable once active; unit + `measurementFn` declared; only authority may declare (SoD). |
| **UsageRecord** (EM16) | legs: `subject`, `meterId`, `quantity`, `window`, `inputsRef[]`, `resultHash` | Append-only; signed (ESP-1); `resultHash` reproducible (INV-6); non-negative `quantity`. |
| **ResourceAccount** (EM17) | `capacity`, `reserved`, `consumed`, `available`, `unit` | `available = capacity − reserved − consumed ≥ 0`; conserved (Σ movements = 0); reconciled to metered usage. |
| **RateCard** (EM18) | `RateTier[]`, `validFrom`, `validTo`, `valueFrame` | Versioned + deterministic; overlapping-window guard; only authority may publish. |
| **Charge** (EM18) | `sourceRef`, `meterId?`, `rateCardVersion`, `amount`, `settlementRef?` | `amount = rate(usage)` deterministic; carries `sourceRef` (REQ-TRACE); immutable once invoiced. |
| **Invoice** (EM18) | `Charge[]`, `subject`, `period`, `total`, `status` | `total = Σ charges`; immutable once issued; corrections are credit notes (never edits). |
| **Treasury / Account (GL)** (EM4/EM19) | `balances`, `ledgerRef`, `accountType` | Non-negative; append-only; every mutation Evolution-committed. |
| **Posting** (EM8/EM19) | `LedgerLeg[]`, `nonce`, `resultHash` | Σcredits = Σdebits (EGP-2); idempotent by nonce (EGP-10); atomic. |
| **Period** (EM19) | `openingTB`, `closingTB`, `status` | Trial balance sums to zero at close; closed periods immutable. |

### 2.3 Domain relationships (metered value chain)

```
Meter 1──* UsageRecord *──1 ResourceAccount
                │
                ▼ (rate via RateCard version)
             Charge *──1 Invoice 1──* Statement
                │
                ▼ (aggregated into a settlement proposal)
            Posting ──(Evolution commit)──► Treasury/GL Account
                │
                ▼
             Period (trial balance, close)
```

REQ-TRACE is the transitive closure of this chain: `Posting.legs[i] → Charge.sourceRef →
UsageRecord.id → Meter.id`, all persisted and offline-replayable.

### 2.4 Domain states (lifecycles)

- **Meter:** `declared → active → deprecated` (deprecated meters accept no new usage).
- **UsageRecord:** `observed → verified → (rated | rejected)` (immutable in all states).
- **ResourceAccount:** `provisioned → active → (exhausted | frozen) → retired`.
- **Charge:** `draft → rated → invoiced → (settled | credited)`.
- **Invoice:** `open → issued → (settled | partially-settled | void-by-credit-note)`.
- **Period:** `open → closing → closed` (closed is terminal/immutable).

All transitions route through the Evolution Fabric (EGP-5) and emit audit events (EGP-11).

---

## Deliverable 3 — Financial Model

### 3.1 Double-entry basis

Every accountable action is a **balanced posting**: `Σ debits = Σ credits` (EGP-2). Amounts are **decimal
strings** (no floating point) with an explicit `valueFrame` (unit of account). The fabric is
**currency-technology-neutral**: a value-frame may be a resource unit (`compute.cpu.ms`), a token, a
knowledge credit, or an energy unit — never a bound real-world currency implementation.

### 3.2 Chart of accounts (platform substrate)

| Account class | Normal balance | Purpose |
|---------------|:--------------:|---------|
| **Resource Inventory** (asset) | Debit | Conserved capacity held per resource unit |
| **Consumption / Cost** (expense) | Debit | Metered usage rated to cost |
| **Treasury** (asset) | Debit | Owner custodial balances |
| **Accrued Charges** (liability) | Credit | Rated-but-unsettled charges |
| **Budget / Allocation** (equity-like control) | Credit | Fail-closed spend caps |
| **Incentive Pool** (liability) | Credit | Capped, expiring reward budgets |
| **Suspense / Clearing** (contra) | — | Advisory federation & in-flight exchange (never co-mingled) |

### 3.3 The metering → rating → billing → settlement → accounting flow

```
1. METER      E1  observe(subject, meterId, quantity, window)
                  → UsageRecord{ resultHash = H(inputsRef) }         (signed, immutable)   [REQ-MEAS]
2. RESERVE    E2  reserve/consume against ResourceAccount            (available ≥ 0)
3. RATE       E3  charge = rateCard(meterId, tier, valueFrame).apply(quantity)  (deterministic)
4. INVOICE    E3  invoice = Σ charges over (subject, period)         (immutable; total = Σ)
5. MATCH      E4  (marketplace path) propose match → settlement legs (proposes only)
6. SETTLE     E5  posting = balanced legs; nonce; movesRealValue?    (conservation + non-neg + idempotent)
                  movesRealValue ⇒ PENDING AD-0009 (no auto-actuation)                     [EGP-7]
7. COMMIT     PI-6 Evolution commits the posting (sole path)                                [EGP-5]
8. ACCOUNT    E6  post to GL; update trial balance; on period end → close                   [REQ-ACCT]
9. AUDIT      hash-chained ECON_* event with full lineage                                   [REQ-TRACE]
```

### 3.4 Pricing / rating model (deterministic)

```typescript
// Illustrative — NOT source code.
interface RateTier { upTo?: string; unitPrice: string; }        // decimal strings
interface RateCard {
  id: string; version: number; valueFrame: string;
  meterId: string; tiers: RateTier[]; validFrom: string; validTo?: string;
}
// rate(usage) is a pure function of (RateCard version, quantity). Non-deterministic
// pricing models (FDG-INT) are advisory and NOT commit-eligible until a verifier
// reproduces the resulting amount (EGP-6 / INV-6).
function rate(card: RateCard, quantity: string): { amount: string; resultHash: string } { /* pure */ }
```

### 3.5 Conservation & non-negativity (security invariants)

- **Conservation gate** (EM8): reject any posting where credits ≠ debits (EC2/EC6).
- **Non-negativity gate** (EM4): reject any post-commit balance < 0, including resource over-consumption
  (`available < 0`) (EC5/EC13).
- **Idempotency** (EM8): each posting carries a nonce; replay is a no-op (EC9).
- **Determinism** (EM3/EM18): rates/valuations advisory unless verifier-reproduced (EC3/INV-6).
- **Corrections are compensating entries** (EM19): a wrong charge is reversed by a credit note +
  reversing posting; ledgers are never silently edited (EGP-11).

### 3.6 Cost traceability ledger (REQ-TRACE)

Each posting leg persists `sourceRef` chaining to the originating `Charge` → `UsageRecord` → `Meter`. The
audit replay (`economic-audit.test.ts`) must reconstruct, for any posted amount, the complete causal chain
back to the metered event that produced it. A charge with a missing or unresolvable `sourceRef` is
**inadmissible** to settlement.

---

## Deliverable 4 — Storage Model

### 4.1 Substrate & keyspace (additive; zero core-dir change)

All state is `economic:*` metadata via the existing `MetadataPort`; caps/rates/profiles via
`ConfigurationPort`; authorities/treasuries via `RegistryPort`. **No schema/core change** — new record
*shapes* register in the reserved keyspace (INV-13 Infinite Extensibility).

| Keyspace prefix | Record | Mutability | Owner module |
|-----------------|--------|:----------:|--------------|
| `economic:economy:<id>` | EconomyProfile | governed | EM1 |
| `economic:asset:<id>` | Asset | governed | EM2 |
| `economic:resource:<id>` | ResourceAccount | Evolution-only | EM17 |
| `economic:meter:<id>` | MeterDefinition | append-on-declare | EM16 |
| `economic:usage:<id>` | UsageRecord | **append-only / immutable** | EM16 |
| `economic:ratecard:<id>:v<n>` | RateCard (versioned) | append-only versions | EM18 |
| `economic:charge:<id>` | Charge | immutable once invoiced | EM18 |
| `economic:invoice:<id>` | Invoice | immutable once issued | EM18 |
| `economic:statement:<owner>:<period>` | Statement | immutable | EM18 |
| `economic:treasury:<id>` | Treasury / GL Account | Evolution-only | EM4/EM19 |
| `economic:ledger:<treasury>:<seq>` | LedgerLeg (double-entry) | **append-only** | EM4 |
| `economic:posting:<nonce>` | Posting (idempotency key) | write-once | EM8 |
| `economic:period:<id>` | Period + trial balance | immutable once closed | EM19 |
| `economic:budget:<id>` / `:allocation:<id>` | Budget / Allocation | Evolution-only | EM5 |
| `economic:authority:<id>` | EconomicAuthority | governed | EM10 |
| `economic:federation:<nodeId>:*` | Foreign advisory records | disjoint / advisory | EM13 |
| `economic:audit:<seq>` | Hash-chained ECON_* event | **append-only, tamper-evident** | EM14 |

### 4.2 Illustrative record schemas

```typescript
// Illustrative — NOT source code. Extends ECON-001 §III.1 EM0 types.
interface MeterDefinition {
  id: string;                 // economic:meter:<id>
  resourceUnit: string;       // e.g., 'compute.cpu.ms'
  measurementFn: string;      // ref to declared deterministic fn
  authority: string; owner: string;
  status: 'declared' | 'active' | 'deprecated';
}
interface UsageRecord {       // economic:usage:<id> — immutable
  id: string; meterId: string; subject: string;
  quantity: string;          // non-negative decimal
  window: { from: string; to: string };
  inputsRef: string[]; resultHash: string;   // INV-6 reproducibility (REQ-MEAS)
  signature: string;         // Ed25519 (reuse federation/assertions.ts)
}
interface ResourceAccount {   // economic:resource:<id>
  id: string; unit: string; owner: string;
  capacity: string; reserved: string; consumed: string; available: string;  // available ≥ 0
}
interface Charge {            // economic:charge:<id>
  id: string; subject: string; meterId?: string;
  sourceRef: string;         // usageRecordId | matchId (REQ-TRACE)
  rateCardVersion: string; amount: string; valueFrame: string;
  settlementRef?: string;    // posting nonce once settled
  status: 'draft' | 'rated' | 'invoiced' | 'settled' | 'credited';
}
interface Posting {           // economic:posting:<nonce> — write-once
  nonce: string; legs: LedgerLeg[];   // Σ net-zero
  sourceRefs: string[];      // charge/match lineage (REQ-TRACE)
  movesRealValue: boolean; resultHash: string; evolutionUnitId?: string;
}
```

### 4.3 Indices, retention, integrity

- **Idempotency index:** `economic:posting:<nonce>` write-once; duplicate nonce ⇒ no-op.
- **Lineage index:** `economic:charge:<id>.sourceRef` and `Posting.sourceRefs[]` enable REQ-TRACE replay.
- **Append-only ledger:** `economic:ledger:*` and `economic:audit:*` are never updated in place; hash-chain
  links each event to its predecessor (offline verifiable, EAP-2/EAP-3).
- **Classification:** usage/charge/invoice/ledger inherit **Restricted-Financial** (S4); no
  down-classification; keys/credentials **by reference only** (S3) — never in records or logs.
- **Retention:** immutable financial records are durable; corrections via compensating entries only.

---

## Deliverable 5 — APIs (public seams)

> Illustrative interfaces — NOT source code. Every mutating call is `propose*`/`record*` and returns a
> proposal or an immutable fact; **only Settlement routes commits through Evolution**, and any real value
> movement returns `PENDING AD-0009 APPROVAL`.

### 5.1 Metering Engine (E1 / EM16)

```typescript
interface MeteringEngine {
  declareMeter(def: MeterDefinition, ctx: AuthCtx): Promise<Result<MeterDefinition>>;   // authority + SoD
  recordUsage(u: Omit<UsageRecord,'resultHash'|'signature'>, ctx: AuthCtx): Promise<Result<UsageRecord>>; // signed, immutable [REQ-MEAS]
  verifyUsage(usageId: string): Promise<Result<{ reproduced: boolean }>>;               // INV-6 verifier
  queryUsage(filter: { subject?: string; meterId?: string; window?: Window }): Promise<UsageRecord[]>;
}
```

### 5.2 Resource Accounting (E2 / EM17)

```typescript
interface ResourceAccounting {
  provision(unit: string, owner: string, capacity: string, ctx: AuthCtx): Promise<Result<ResourceAccount>>;
  reserve(resourceId: string, quantity: string, ctx: AuthCtx): Promise<Result<ResourceAccount>>; // available ≥ 0
  proposeConsume(resourceId: string, usageId: string): Promise<Result<SettlementProposal>>;       // links usage → posting
  reconcile(resourceId: string): Promise<Result<{ metered: string; accounted: string; delta: string }>>; // must be 0
  balance(resourceId: string): Promise<ResourceAccount>;
}
```

### 5.3 Billing Engine (E3 / EM18)

```typescript
interface BillingEngine {
  publishRateCard(card: RateCard, ctx: AuthCtx): Promise<Result<RateCard>>;             // versioned, deterministic
  rate(usageId: string): Promise<Result<Charge>>;                                       // pure; carries sourceRef [REQ-TRACE]
  assembleInvoice(subject: string, period: string): Promise<Result<Invoice>>;           // immutable; total = Σ charges
  issueStatement(owner: string, period: string): Promise<Result<Statement>>;
  proposeDunning(invoiceId: string): Promise<Result<SettlementProposal>>;               // proposes only
  creditNote(chargeId: string, reason: string, ctx: AuthCtx): Promise<Result<Charge>>;  // compensating correction
}
```

### 5.4 Marketplace Engine (E4 / EM6) — proposes only

```typescript
interface MarketplaceEngine {
  postOffer(offer: Offer, ctx: AuthCtx): Promise<Result<Offer>>;
  postBid(bid: Bid, ctx: AuthCtx): Promise<Result<Bid>>;
  proposeMatch(marketId: string): Promise<Result<MatchProposal>>;   // anti-wash / anti-front-run; settles via E5
}
```

### 5.5 Settlement Engine (E5 / EM8) — sole chokepoint

```typescript
interface SettlementEngine {
  checkConstraints(p: SettlementProposal): Promise<ConstraintResult>;   // conservation/non-neg/budget/slippage/idempotency
  settle(p: SettlementProposal, ctx: AuthCtx): Promise<Result<CommitReceipt | Pending>>;
  // returns Pending('PENDING AD-0009 APPROVAL') when p.movesRealValue === true
}
```

### 5.6 Accounting Engine (E6 / EM19)

```typescript
interface AccountingEngine {
  post(committedUnitId: string, p: Posting): Promise<Result<void>>;     // invoked only after Evolution commit [REQ-ACCT]
  trialBalance(period: string): Promise<{ debits: string; credits: string; balanced: boolean }>; // must balance
  closePeriod(period: string, ctx: AuthCtx): Promise<Result<Period>>;   // freezes; immutable
  ledger(accountId: string, window?: Window): Promise<LedgerLeg[]>;
  traceCost(postingNonce: string): Promise<CostLineage>;                // Posting → Charge → Usage → Meter [REQ-TRACE]
}
```

### 5.7 Cross-cutting API guarantees

- **Deny-by-default:** every call passes the PI-4 PolicyEvaluator (EGP-4).
- **Enumerated authorities + SoD:** propose ≠ authorize ≠ settle ≠ post ≠ audit ≠ revoke (EGP-8).
- **No mutation escape:** there is no public balance-mutation method outside Settlement→Evolution (EGP-5).
- **Fail-closed FDGs:** absent Ontology/Memory/Intelligence/Simulation/Autonomy ⇒ deny/inert, never skip.

---

## Deliverable 6 — Events (ECON_* catalog)

All events are hash-chained on the `economic:audit:*` chain (EM14) with double-entry provenance; incomplete
events ⇒ reject (EAP). Every event carries `{ seq, prevHash, hash, actor, authority, timestamp }`.

| Event | Emitted by | Payload (key fields) | Requirement |
|-------|-----------|----------------------|-------------|
| `ECON_METER_DECLARED` | E1 | meterId, unit, measurementFn, authority | REQ-MEAS |
| `ECON_USAGE_RECORDED` | E1 | usageId, meterId, subject, quantity, resultHash, signature | REQ-MEAS |
| `ECON_USAGE_VERIFIED` | E1 | usageId, reproduced | REQ-MEAS / INV-6 |
| `ECON_RESOURCE_PROVISIONED` | E2 | resourceId, unit, capacity, owner | REQ-MEAS |
| `ECON_RESOURCE_RESERVED` | E2 | resourceId, quantity, available | REQ-MEAS |
| `ECON_RESOURCE_RECONCILED` | E2 | resourceId, metered, accounted, delta(=0) | REQ-MEAS / REQ-ACCT |
| `ECON_RATECARD_PUBLISHED` | E3 | rateCardId, version, valueFrame, authority | REQ-TRACE |
| `ECON_CHARGE_RATED` | E3 | chargeId, sourceRef, amount, rateCardVersion | REQ-TRACE |
| `ECON_INVOICE_ISSUED` | E3 | invoiceId, subject, period, total | REQ-TRACE |
| `ECON_STATEMENT_ISSUED` | E3 | owner, period, opening, closing | REQ-ACCT |
| `ECON_CREDIT_NOTE_ISSUED` | E3 | chargeId, reason (compensating) | REQ-ACCT / EGP-11 |
| `ECON_OFFER_POSTED` / `ECON_BID_POSTED` | E4 | id, marketId | — |
| `ECON_MATCH_PROPOSED` | E4 | matchId, legs (proposes only) | — |
| `ECON_SETTLEMENT_PROPOSED` | E5 | nonce, legs, movesRealValue | REQ-ACCT |
| `ECON_SETTLEMENT_PENDING_APPROVAL` | E5 | nonce, `PENDING AD-0009` | EGP-7 |
| `ECON_SETTLED` | E5→PI-6 | nonce, evolutionUnitId, legs (net-zero), sourceRefs, resultHash | REQ-ACCT / REQ-TRACE |
| `ECON_SETTLEMENT_REJECTED` | E5 | nonce, reason (conservation/non-neg/idempotency) | REQ-ACCT |
| `ECON_POSTED` | E6 | postingNonce, accounts, trialBalanceDelta | REQ-ACCT |
| `ECON_PERIOD_CLOSED` | E6 | periodId, trialBalance (balanced) | REQ-ACCT |
| `ECON_FED_ADVISORY_RECEIVED` / `ECON_FED_DENIED` | E13 | nodeId, foreignRef, trust | EGP-12 |
| `ECON_AUTHORITY_GRANTED` / `ECON_AUTHORITY_REVOKED` | E10/E11 | authorityId, powers | EGP-8 |
| `ECON_EMERGENCY_HALT` / `ECON_RESUMED` | E12 | scope, by (distinct resume authority) | ESP-6 |

**Event ordering & idempotency:** consumers key on `nonce` for settlements and `seq` for chain order; the
chain is offline-replayable to reconstruct every balance, every trial balance, and every cost lineage.

---

## Deliverable 7 — Acceptance Tests

Additive suites under `test/control/economic/`; baseline stays green (0 regressions). Format:
Given/When/Then. Each requirement invariant has ≥1 dedicated acceptance test; each threat EC1–EC15 has ≥1
typed-denial test (`ECON-THREAT-001`).

### 7.1 Requirement acceptance (REQ-MEAS / REQ-ACCT / REQ-TRACE)

| ID | Given | When | Then |
|----|-------|------|------|
| **AT-MEAS-1** | a declared active meter | a resource is consumed without a `UsageRecord` | settlement of that consumption is **denied** (`unmetered`) |
| **AT-MEAS-2** | a recorded `UsageRecord` with `inputsRef` | the verifier recomputes `resultHash` | it **reproduces** exactly (INV-6); mismatch ⇒ reject |
| **AT-MEAS-3** | a `ResourceAccount` with capacity C | reserved+consumed would exceed C | reserve/consume is **denied** (`available < 0`) |
| **AT-ACCT-1** | a settlement proposal with Σcredits ≠ Σdebits | `settle` is called | **rejected** (`Conservation`) — no posting, no action |
| **AT-ACCT-2** | any committed settlement | the period trial balance is computed | debits = credits (**balanced = true**) |
| **AT-ACCT-3** | a closed period | any posting targets it | **rejected** (immutable) |
| **AT-ACCT-4** | a wrong charge | a correction is issued | a **credit note + reversing posting** is created (never a silent edit) |
| **AT-TRACE-1** | a settled posting | `traceCost(nonce)` is called | it returns full lineage `Posting → Charge → Usage → Meter` |
| **AT-TRACE-2** | a charge whose `sourceRef` is missing/unresolvable | it is submitted for settlement | **inadmissible** (`broken lineage`) |
| **AT-TRACE-3** | the full audit chain | it is replayed offline | every balance, trial balance, and cost lineage is **reconstructed** |

### 7.2 Governance / determinism / actuation acceptance

| ID | Assertion |
|----|-----------|
| **AT-GOV-1** | No balance mutates outside an Evolution commit (EGP-5) — direct `economic:*` balance write is rejected. |
| **AT-GOV-2** | Advisory (FDG-INT) valuation/rate is **never** commit-eligible until verifier-reproduced (EGP-6). |
| **AT-GOV-3** | `movesRealValue: true` ⇒ `PENDING AD-0009 APPROVAL`; **no** auto-actuation (EGP-7 / EC15). |
| **AT-GOV-4** | Idempotency: replaying a settlement nonce is a **no-op** (EGP-10 / EC9). |
| **AT-GOV-5** | Emergency halt freezes scope to deny-all; **resume** requires a distinct authority (EGP-8 / ESP-6). |

### 7.3 Adversarial mapping (EC1–EC15)

Reuse `economic-adversarial.test.ts` (`ECON-001` §V.2). B05 adds: **EC-B1** unmetered consumption blocked
(AT-MEAS-1), **EC-B2** rate-card tampering / retroactive repricing rejected (versioned + immutable charges),
**EC-B3** cost-lineage forgery rejected (AT-TRACE-2/3). **Expected verdict: 0 residual High/High.**

### 7.4 Test commands (illustrative)

```bash
npm test -- --testPathIgnorePatterns=economic                 # baseline: PASS, 0 regressions
npm test -- test/control/economic                             # all economic suites: PASS
npm test -- test/control/economic/economic-adversarial.test.ts # EC1–EC15 + EC-B1..B3 blocked
```

---

## Deliverable 8 — Implementation Backlog

Sequenced by the acyclic dependency order (§1.3). Each work package (WP) is additive, ends green, and maps
to exit gates (§ below). Estimates are relative points (design guidance, not a schedule).

| WP | Title | Module(s) | Depends on | Exit criteria | Pts |
|----|-------|-----------|-----------|---------------|:---:|
| **WP-E0** | Extend `types.ts` (Meter, UsageRecord, RateCard, Charge, Invoice, Account, Posting) | EM0 | — | `tsc --noEmit` clean; no core-port change | 3 |
| **WP-E1** | Metering Engine — declare/record/verify usage; signed + deterministic | EM16 | WP-E0, EM10/EM14 | AT-MEAS-1/2; `ECON_USAGE_*` events | 8 |
| **WP-E2** | Resource Accounting — provision/reserve/consume/reconcile; non-negativity | EM17 | WP-E1, EM4 | AT-MEAS-3; reconcile delta = 0 | 8 |
| **WP-E3** | Billing Engine — rate cards, rating, invoices, statements, credit notes | EM18 | WP-E1 | AT-TRACE-1; `ECON_CHARGE/INVOICE_*`; EC-B2 | 13 |
| **WP-E4** | Marketplace Engine — offers/bids/propose-match; anti-wash/front-run | EM6 | WP-E0, EM3 | proposes-only; `ECON_MATCH_PROPOSED` | 8 |
| **WP-E5** | Settlement Engine — conservation/non-neg/nonce gate; Evolution commit; AD-0009 boundary | EM8 | WP-E2, WP-E3, WP-E4 | AT-ACCT-1; AT-GOV-3/4; EC2/6/9/13/15 | 13 |
| **WP-E6** | Accounting Engine — GL post, trial balance, period close, `traceCost` | EM19 | WP-E5 | AT-ACCT-2/3/4; AT-TRACE-3 | 13 |
| **WP-E7** | Audit wiring — ECON_* catalog on hash chain; offline replay proof | EM14 | WP-E1..E6 | AT-TRACE-3; offline ledger proof | 5 |
| **WP-E8** | Governance policies — EGP-13/14/15 + D-class gates loaded into PI-4 | EM15 | WP-E5 | AT-GOV-1/2/5; deny-by-default | 5 |
| **WP-E9** | FDG seams — ONT/MEM/INT/SIM/AUTO inert & fail-closed | EM3/EM16/EM17 | WP-E1..E6 | G-FDG deferred-integration tests | 5 |
| **WP-E10** | Adversarial suite — EC1–EC15 + EC-B1..B3 | test/ | WP-E1..E9 | G-THREAT: 0 residual High/High | 8 |
| **WP-E11** | Bootstrap/index + baseline preservation | EM15 | all | G-BUILD, G-BASELINE, G-DIR green | 3 |

**Critical path:** WP-E0 → WP-E1 → WP-E2/E3/E4 → **WP-E5 (chokepoint)** → WP-E6 → WP-E7/E10 → WP-E11.
The Settlement Engine (WP-E5) is the single integration risk; land it before Accounting rollups.

### Exit gates (extends `ECON-001` §XII)

| Gate | Criteria |
|------|----------|
| **G-BUILD** | 20 modules (EM0–EM19) compile; TS strict; no cycles |
| **G-BASELINE** | Current implemented baseline green; 0 regressions (re-measured at construction) |
| **G-MEAS** | REQ-MEAS: AT-MEAS-1/2/3 pass; unmetered consumption denied |
| **G-ACCT** | REQ-ACCT: AT-ACCT-1..4 pass; trial balance always balances |
| **G-TRACE** | REQ-TRACE: AT-TRACE-1/2/3 pass; full offline lineage reconstruction |
| **G-CONSERVE** | Conservation + non-negativity + atomicity + idempotency hold; offline ledger proof |
| **G-THREAT** | EC1–EC15 + EC-B1..B3 blocked; 0 residual High/High |
| **G-GOV / G-SEC / G-CRYPTO** | EGP-1..15 + D1..D10; S1/S3/S4/S6; reuse `federation/assertions.ts` (no custom crypto) |
| **G-DIR** | Zero prohibited-core-dir change; additive `src/control/economic/*` only |
| **G-ACTUATION** | No real-money code path; real value ⇒ `PENDING AD-0009 APPROVAL` |

---

## Traceability & Compliance

- **Refines:** `ECON-001`, `ECON-ARCH-001`, `ECON-GOV-001`, `ECON-SEC-001`, `ECON-FED-001`, `ECON-AUD-001`,
  `ECON-THREAT-001`, `ECON-READINESS-001`; AD-0016..0022 (fabrics), AD-0014 (Ω∞), AD-0009 (financial
  Approval-Required), AUTH-003/007/008/009/012; `UCOS-CONST-001` (Art. IX/XII); `UCOS-CONSTRUCTION-BLOCKED`;
  `UCOS-AUTH-REC-PKG-001`; commerce alignment `UCOS-DOM-006/007/008`, CD-09 (Restricted-Financial).
- **New governance principles introduced:** EGP-13 (Measurability), EGP-14 (Accountability),
  EGP-15 (Cost Traceability) — subordinate to and consistent with EGP-1..12.
- **Coverage:** 6/6 engines specified; 8/8 deliverables produced; 3/3 requirements bound to enforced
  invariants + acceptance tests; EC1–EC15 + EC-B1..B3 mapped.

### Determination

**DESIGN-COMPLETE IMPLEMENTATION PROGRAM — READY FOR AUTHORIZATION REVIEW** (design-only). Construction of
`packages/platform-runtime/src/control/economic/*` may begin **only** after (a) independent constitutional
review of the `ECON-*` set + this program, (b) the **AUTH-012 ledger restoration**
(`UCOS-AUTH-REC-PKG-001`), and (c) a separate Authority Board scoped **Article IX release** (`AD-00xx`).
Until then: **Article IX generation lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` unchanged; AD-0014 preserved
(no INV-14..20); no real-world actuation — AD-0009 Approval-Required.**

**END ECON-B05 — ECONOMY FABRIC IMPLEMENTATION PROGRAM — DESIGN-COMPLETE · READY FOR AUTHORIZATION REVIEW.**
