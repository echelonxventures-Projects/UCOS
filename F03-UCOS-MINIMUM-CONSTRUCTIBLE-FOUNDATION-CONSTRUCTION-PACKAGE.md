# F03 — UCOS Minimum Constructible Foundation (MCF) Construction Package

## PHASE F03 — Exact Scope of the Smallest Foundation Satisfying FC-1..FC-9 (Construction Planning Only)

| Field | Value |
|-------|-------|
| Artifact | **F03 — UCOS Minimum Constructible Foundation (MCF) Construction Package** |
| Artifact ID | `F03-UCOS-MINIMUM-CONSTRUCTIBLE-FOUNDATION-CONSTRUCTION-PACKAGE` |
| Phase | **F03 — MCF Construction Package** |
| Layer | ARCHITECTURE / PLATFORM (MCF scope package — isolates the minimum foundation; builds nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **CONSTRUCTION PLANNING ONLY** — define the exact MCF scope. **No implementation, no code, no infrastructure, no technology/framework selection, no execution, no `git` mutation (beyond this additive architecture `*.md`, permitted by the S0′ tolerance rule).** Append-only. |
| Authoritative inputs (per mandate) | `F01-UCOS-FOUNDATION-CONSTRUCTION-PROGRAM` (FP-1..12; FC-1..12; IF-*), `F02-UCOS-FOUNDATION-EXECUTION-ROADMAP` (MCF; waves; milestones), AUTH-001 Vision, AUTH-003 Principles, AUTH-004/005/006 canons |
| Governance posture | Planning is not construction. `UCOS-CONSTRUCTION-BLOCKED` + Article IX lock remain **ACTIVE**; MCF construction runs only under governed authorization (T04 → RM-2..RM-8 + REAL-C-05 → AD-0024-with-conditions). |
| **F02 reconciliation (transparent)** | **R-3:** F02 stated MCF = 10 domains (incl. **F-OBS**, a Wave 2 domain) to *surface* audit. F03 — tasked to isolate the smallest subset satisfying FC-1..FC-9 **without Wave 2/3** — refines this: FC-6's auditability **guarantee** (append-only, hash-chained, attributable events) is produced at Wave 0/1 by **F-STO + F-EVT + F-SEC + F-IDN** and **read via IF-STO replay**; the F-OBS observability domain (metrics/traces/health/rich audit-query) is an operational enhancement **deferred to Wave 2**. Therefore **MCF = 9 domains** (Wave 0 + Wave 1). FC-6 remains satisfied. |
| **Determination** | **MCF FULLY SPECIFIED** — the 9-domain MCF, its capability inventory, dependency graph, construction boundaries, acceptance criteria, risks, and handover criteria are complete (§ 8). |

> **Objective.** Isolate the **smallest** foundation that satisfies **FC-1..FC-9** with **no** Wave 2 or Wave 3
> domain — the earliest defensibly-constructible sub-scope. Planning only; selects no technology, writes no code.

---

## 1. MCF Domain Inventory (9 domains)

**MCF = { F-STO, F-IDN, F-SEC, F-REG (Genesis Kernel) · F-CFG, F-POL, F-EVT, F-GOV, F-EXE (Operating Spine) }.**

### Genesis Kernel (Root — 4)
| ID | Domain | Purpose | Responsibilities | Inputs | Outputs | Dependencies |
|:--:|--------|---------|------------------|--------|---------|--------------|
| **F-STO** | Durable Substrate | Durable, ordered, append-only persistence + replay | Append/read/snapshot/replay; ordered-log semantics; hash-chain storage | genesis seed | IF-STO | genesis seed |
| **F-IDN** | Identity & Tenancy | Attributable principal + tenant context | Principal/tenant model; authn/authz context; tenant scoping | F-STO | IF-IDN | F-STO |
| **F-SEC** | Security & Trust | Cryptographic integrity + trust | Sign/verify; key-by-reference; hash-chain integrity; secrets discipline | F-STO, F-IDN | IF-SEC | F-STO, F-IDN |
| **F-REG** | Registry & Discovery | Authoritative registration/discovery of every artifact | Register/resolve/describe; self-registration; zero-orphan enforcement | F-STO, F-IDN, F-SEC | IF-REG | F-STO, F-IDN, F-SEC |

### Operating Spine (Core — 5)
| ID | Domain | Purpose | Responsibilities | Inputs | Outputs | Dependencies |
|:--:|--------|---------|------------------|--------|---------|--------------|
| **F-CFG** | Configuration & Metadata | Behavior-from-data (zero hard-coding) | Tenant/context config resolution; variability model | F-REG, F-STO, F-IDN | IF-CFG | root tier |
| **F-POL** | Policy & Decisioning | Deterministic authorization of every operation | Policy lifecycle; evaluate→decision; enforcement obligations | F-REG, F-CFG, F-IDN, F-STO | IF-POL | F-REG, F-CFG, F-IDN, F-STO |
| **F-EVT** | Eventing & Messaging | Contract-typed, ordered, idempotent event backbone | Publish/subscribe; ordering; idempotent delivery; contract validation | F-STO, F-REG, F-IDN | IF-EVT | F-STO, F-REG, F-IDN |
| **F-GOV** | Governance | Gate every governed operation; decision log | Gate-check; decision-record; approval/trusted-op lifecycle | F-REG, F-POL, F-IDN, F-STO | IF-GOV | F-REG, F-POL, F-IDN, F-STO |
| **F-EXE** | Execution / Runtime | Deterministic, governed capability invocation | Invoke→result; idempotency keys; identity+policy+config binding; audit-event emission | F-IDN, F-POL, F-CFG, F-EVT, F-GOV | IF-EXE | F-IDN, F-POL, F-CFG, F-EVT, F-GOV |

---

## 2. MCF Capability Inventory (mapped to domains + FC coverage)

Foundation capabilities (functions the MCF must provide), each mapped to owning domain(s) and the FC it satisfies.

| Cap | Capability (function) | Owning domain(s) | Satisfies |
|:---:|-----------------------|------------------|:---------:|
| MC-1 | Durable append/read/snapshot/**replay-from-empty** | F-STO | FC-5, FC-6 |
| MC-2 | Signed **genesis seed** + independent verify | F-SEC + F-STO | FC-1 |
| MC-3 | Attributable **principal + tenant context** on every op | F-IDN | FC-7, FC-9 |
| MC-4 | **Register / resolve / describe / self-register** (zero orphan) | F-REG | FC-1, FC-2 |
| MC-5 | **Config resolution** by tenant/context (no code fork) | F-CFG | FC-3 |
| MC-6 | **Policy evaluate → decision** (deterministic allow/deny/obligation) | F-POL | FC-4 |
| MC-7 | **Contract-typed, ordered, idempotent** event publish/subscribe | F-EVT | FC-5, FC-6 |
| MC-8 | **Append-only, hash-chained, attributable audit event** per state change | F-STO + F-EVT + F-SEC + F-IDN | FC-6 |
| MC-9 | **Audit read/replay** (verify audit trail without F-OBS) | F-STO (IF-STO read/replay) | FC-6 |
| MC-10 | **Gate-check + decision-record** for every governed op | F-GOV | FC-8 |
| MC-11 | **Deterministic, idempotent invocation** under identity+policy+config | F-EXE | FC-5, FC-9 |
| MC-12 | **Tenant isolation** by default | F-IDN + F-CFG | FC-7 |
| MC-13 | **End-to-end vertical slice** (one capability through IF-EXE, emitting audit, recoverable) | F-EXE (composing all 9) | FC-9 |

**Coverage check:** FC-1(MC-2,MC-4) · FC-2(MC-4) · FC-3(MC-5) · FC-4(MC-6) · FC-5(MC-1,MC-7,MC-11) · FC-6(MC-1,
MC-7,MC-8,MC-9) · FC-7(MC-3,MC-12) · FC-8(MC-10) · FC-9(MC-3,MC-11,MC-13). **All of FC-1..FC-9 covered by the 9
MCF domains — no Wave 2/3 domain required.**

---

## 3. MCF Dependency Graph

```
                 ┌──────── GENESIS KERNEL (co-bootstrapped from signed seed) ────────┐
   genesis seed ─▶  F-STO ──▶ F-IDN ──▶ F-SEC ──▶ F-REG  (self-registers the kernel)  │
                 └───────────────────────────────┬───────────────────────────────────┘
                                                  │  (all spine depend on all roots)
                 ┌──────────────────── OPERATING SPINE ─────────────────────────────┐
                 │   F-CFG ─┐                                                          │
                 │   F-EVT ─┼──▶ F-POL ──▶ F-GOV ──▶ F-EXE  (vertical slice, FC-9)     │
                 │          └───────────────▲──────────┘                               │
                 └────────────────────────────────────────────────────────────────────┘
```

| Dependency | Type | Note |
|------------|:----:|------|
| genesis seed → F-STO | **Mandatory** | bootstrap origin |
| F-STO → F-IDN → F-SEC → F-REG | **Mandatory** | kernel serialization |
| roots → F-CFG, F-EVT | **Mandatory** | (F-CFG ∥ F-EVT) |
| F-CFG → F-POL | **Mandatory** | policy uses config |
| F-POL → F-GOV | **Mandatory** | governance uses policy |
| {F-IDN,F-POL,F-CFG,F-EVT,F-GOV} → F-EXE | **Mandatory** | execution binds all |
| F-OBS (audit-query surface) | **Deferred (Wave 2)** | audit *guarantee* met by MC-8/MC-9; rich observability optional to MCF |
| F-WFL, F-INT, F-MEM, F-CMP | **Deferred (Wave 2)** | not required for FC-1..9 |
| F-KNW, F-ONT, autonomy | **Deferred (Wave 3)** | self-description/autonomy beyond MCF |
| external monitoring/dashboards | **Optional** | operational convenience; not an MCF acceptance dependency |

**No circular dependency** (the only self-reference — the genesis bootstrap — is resolved by the signed seed +
self-registration; acyclic thereafter, per F02 R-2).

---

## 4. MCF Construction Boundaries

| Boundary | Content |
|----------|---------|
| **In Scope** | The 9 MCF domains (F-STO/F-IDN/F-SEC/F-REG/F-CFG/F-POL/F-EVT/F-GOV/F-EXE); their IF-* contracts (IF-STO/IDN/SEC/REG/CFG/POL/EVT/GOV/EXE); the signed genesis seed + self-registration; one end-to-end vertical slice (FC-9); append-only hash-chained attributable audit (MC-8) with replay-based audit read (MC-9). |
| **Out of Scope (entirely)** | Any commerce domain (catalog/pricing/cart/order/payment/etc.); any experience/UI surface; any **technology, framework, language, datastore, or cloud selection** (later ADRs, Prompt 08); infrastructure provisioning; performance tuning beyond determinism/idempotency guarantees. |
| **Deferred to Wave 2** | **F-OBS** (operational observability: metrics/traces/health/rich audit-query), **F-WFL** (orchestration/sagas), **F-INT** (external integration/federation), **F-MEM** (operational memory), **F-CMP** (compliance/assurance tooling). *(FC-10/FC-12 belong here.)* |
| **Deferred to Wave 3** | **F-KNW** (knowledge/PI-7), **F-ONT** (ontology/PI-8), governed autonomous construction. *(FC-11 belongs here.)* |

**Boundary rule:** the MCF is defined by FC-1..FC-9 exactly — nothing that is not required to satisfy those nine
criteria is in scope (no speculative expansion). FC-10 (extensibility demo), FC-11 (self-description), and FC-12
(assurance) are **explicitly deferred** and are not MCF acceptance conditions.

---

## 5. MCF Acceptance Criteria (measurable — prove MCF COMPLETE)

Each is a demonstrable, gated test (fail-closed; no optimism):

| AC | Criterion | Measurable test | Proves |
|:--:|-----------|-----------------|:------:|
| **AC-1** | Genesis verified | Signed genesis seed verifies under an independent key; kernel self-registration resolves | FC-1 |
| **AC-2** | Registry-driven | Register a new artifact; resolve + describe it; an unregistered artifact is rejected (zero orphan) | FC-2 |
| **AC-3** | Zero hard-coding | Two tenants exhibit different behavior via config only, with identical code path | FC-3 |
| **AC-4** | Policy-governed | An operation denied by policy does not execute; an allowed one executes; decisions deterministic | FC-4 |
| **AC-5** | Deterministic + recoverable | Replay from empty reconstructs identical authoritative state; a retried op is idempotent | FC-5 |
| **AC-6** | Auditable | Every state change produced an append-only, hash-chained, attributable event; the audit trail is readable via IF-STO replay and tamper-evident | FC-6 |
| **AC-7** | Multi-tenant isolation | Tenant A cannot observe/affect Tenant B's artifacts/state; scoping enforced by default | FC-7 |
| **AC-8** | Governed | No governed operation proceeds without a recorded gate decision; SoD + independent adjudication wired (REAL-C-05) | FC-8 |
| **AC-9** | Vertical slice | One capability runs end-to-end through IF-EXE under identity+policy+config, emits audit, and is recoverable by replay | FC-9 |
| **AC-INT** | MCF integration | AC-1..AC-9 hold **together** in one running kernel+spine (not in isolation) | FC-1..9 |

**MCF COMPLETE ⟺ AC-1..AC-9 ∧ AC-INT all PASS**, independently assured (REAL-C-05 attestation).

---

## 6. MCF Risk Analysis

| Class | Risk | Mitigation direction (planning-level; no tech) |
|-------|------|-----------------------------------------------|
| **Technical** | Genesis bootstrap incorrectly trusted (self-signed seed) | Independent verification of the seed (RM-8-style attestation); key-by-reference custody (F-SEC/AUTH-008) |
| **Technical** | Hidden nondeterminism breaks replay (FC-5/AC-5) | Enforce FP-5 determinism + idempotency keys; replay-equivalence test in AC-5 |
| **Technical** | Audit read without F-OBS is impractical at scale | Acceptable at MCF (replay-based read, MC-9); operational audit-query deferred to F-OBS (Wave 2) |
| **Governance** | F-GOV self-governance capture at genesis | SoD + independent adjudication (REAL-C-05); append-only decision log (AUTH-012); no self-attested closure |
| **Governance** | MCF construction begun before authorization | Fail-closed: construction lock + Article IX active; MCF runs only under AD-0024-with-conditions |
| **Operational** | Recovery replay time as the log grows | Snapshots (IF-STO); bounded replay windows (detailed controls later) |
| **Operational** | Multi-tenant isolation breach (AC-7) | Tenant-scoping default (FP-8); per-tenant limits at the boundary |
| **Evolution** | Contract drift among the 9 IF-* interfaces | Versioned contracts + migration paths (FP-10); additive-only change; registry-tracked contract versions |
| **Evolution** | MCF scope creep (pulling Wave 2/3 in) | Boundary rule (§4): only FC-1..9-required scope; FC-10/11/12 explicitly deferred |

**No mitigation selects technology.** All are architectural directions; control selection is a later governed ADR.

---

## 7. MCF Handover Criteria (when higher-order construction may begin)

Higher-order platform construction (Wave 2 enablers, then commerce domains, then Wave 3 autonomy) may begin only
when **all** hold:

- [ ] **HO-1** MCF COMPLETE: AC-1..AC-9 ∧ AC-INT all PASS (§ 5).
- [ ] **HO-2** Independent assurance: a distinct-actor (REAL-C-05) attestation confirms MCF COMPLETE (not self-attested).
- [ ] **HO-3** Milestone **M3** (F02) certified: the MCF is the running minimum operating foundation.
- [ ] **HO-4** All 9 IF-* contracts published, versioned, and registered (FP-3/10).
- [ ] **HO-5** Durability: the MCF corpus is committed/pushed/tagged (REAL-M-07 discipline) — recoverable off-machine.
- [ ] **HO-6** Governed authorization for the next sub-scope (Wave 2 / commerce domain) issued (AD-0024-with-conditions extension), each subsequent wave gated on the prior milestone.
- [ ] **HO-7** No open FC-1..9 regression; extensibility (FC-10) test scheduled as the first Wave-2 acceptance.

**Handover token (blank):** `MCF-COMPLETE-______` · AC-1..9 ✔ · AC-INT ✔ · independent attestation ref `____` ·
M3 certified ☐ · IF-* versions `____` · durability tag `____` · next-scope authorization `____`.

---

## 8. Final Determination

> # **MCF FULLY SPECIFIED**
>
> The Minimum Constructible Foundation is exactly specified: a **9-domain** set (Genesis Kernel F-STO/F-IDN/F-SEC/
> F-REG + Operating Spine F-CFG/F-POL/F-EVT/F-GOV/F-EXE) that satisfies **FC-1..FC-9 with no Wave 2 or Wave 3
> domain**. The package provides the domain inventory with responsibilities and dependencies (§ 1); the
> capability inventory MC-1..MC-13 mapped to domains and FC coverage (§ 2); the acyclic dependency graph with
> mandatory/optional/deferred edges (§ 3); explicit construction boundaries (in/out/deferred, § 4); measurable
> acceptance criteria AC-1..AC-9 + AC-INT (§ 5); technical/governance/operational/evolution risks (§ 6); and
> handover criteria HO-1..HO-7 (§ 7).
>
> The F02 MCF was refined (R-3): FC-6's auditability **guarantee** is met at Wave 0/1 by the append-only,
> hash-chained, attributable event log (read via IF-STO replay), so the **F-OBS** observability domain is
> deferred to Wave 2 without violating FC-1..FC-9 — yielding the true minimum of **9 domains**.
>
> This package plans only. **No implementation, code, infrastructure, technology/framework selection, execution,
> construction, or `git` mutation was performed.** `UCOS-CONSTRUCTION-BLOCKED` and the Article IX generation lock
> remain **ACTIVE**; MCF construction begins only under the governed authorization path (T04 → RM-2..RM-8 +
> REAL-C-05 → AD-0024-with-conditions), wave-gated to milestone **M3**.
>
> ### Next required phase
> Governed authorization of the **MCF (Genesis Kernel first) sub-scope** via the established path, then
> construction against AC-1..AC-9 to MCF COMPLETE + independent assurance (HO-1/HO-2) — the pivot to higher-order
> platform construction.

---

## Governance / Non-Construction Statement

No implementation produced; no code generated; no infrastructure created; no technology/framework/language/
datastore/cloud selected; no execution, construction, or `git` mutation performed; no lock released; no invariant
enrolled; no canon modified. This is an MCF scope-**package** only; the sole repository effect is this additive
architecture `*.md`, permitted by the S0′ tolerance rule and outside the `RM2-CONTENT-ANCHOR` protected set. MCF
construction remains a future Approval-Required Operation (AUTH-012 §8 / AD-0009) gated behind the governed
authorization path. INV-1..13, `AUTH-012` (v1.0.13), AD-0014, AUTH-004/005/006 (FROZEN canon), the Article IX
generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged.

## Traceability
- **Consumes (authoritative):** `F01-UCOS-FOUNDATION-CONSTRUCTION-PROGRAM`, `F02-UCOS-FOUNDATION-EXECUTION-ROADMAP`, AUTH-001, AUTH-003, AUTH-004, AUTH-005, AUTH-006.
- **Refines F02:** R-3 (FC-6 audit guarantee met at Wave 0/1 → F-OBS deferred → MCF = 9 domains).
- **Produces:** the MCF construction package (domain inventory, capability inventory MC-1..13, dependency graph, boundaries, acceptance criteria AC-1..9/AC-INT, risks, handover HO-1..7).
- **Feeds:** the governed MCF construction authorization and construction to M3 / MCF COMPLETE; handover to Wave 2 + commerce-domain construction.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014; construction gated by `UCOS-CONSTRUCTION-BLOCKED`.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); Platform/Domain architects produce conforming designs under Prompts 02–09.

**END F03-UCOS-MINIMUM-CONSTRUCTIBLE-FOUNDATION-CONSTRUCTION-PACKAGE — PHASE F03 · MCF = 9 DOMAINS (KERNEL
STO/IDN/SEC/REG + SPINE CFG/POL/EVT/GOV/EXE) · CAPABILITY INVENTORY MC-1..13 → FC-1..9 · ACYCLIC DEPENDENCY
GRAPH · BOUNDARIES (F-OBS + WAVE-2/3 DEFERRED, R-3) · ACCEPTANCE AC-1..9 + AC-INT · RISK ANALYSIS · HANDOVER
HO-1..7 · **MCF FULLY SPECIFIED** · PLANNING ONLY · NO CODE / NO INFRA / NO TECH SELECTION / NO CONSTRUCTION /
NO MUTATION · CONSTRUCTION LOCK + ARTICLE IX REMAIN ACTIVE.**
