# PHASE R7 — Civilization Governance Review · Scalable Governance Structures

> **STATUS: REVIEW COMPLETE — CIV-GOV-001 ADVANCED v1.0.0 → v1.1.0 (governed revision)**
> DESIGN / PROPOSAL ONLY · NO CODE · NO IMPLEMENTATION · NO AUTHORIZATION
> APPEND-ONLY: v1.0.0 (`architecture/civilization/CIV-GOV-001-CIVILIZATION-FABRIC-DEFINITION.md`) is
> **PRESERVED & LINKED**, not deleted; this revision **supersedes only §4–§5 governance/decision-rights**
> DOES NOT MODIFY INV-1..13 · DOES NOT ENROLL INV-14..20 · DOES NOT RELEASE ARTICLE IX · **PRESERVES AD-0014**
> NON-ACTUATION INTACT · `UCOS-CONSTRUCTION-BLOCKED` UNCHANGED · REQUIRES AUTHORITY BOARD REVIEW

| Field | Value |
|-------|-------|
| Artifact ID | `CIV-GOV-001` |
| Version | **1.1.0** (governance revision; supersedes §4–§5 of v1.0.0 via AUTH-009 §6.6 evolution procedure) |
| Phase | **R7 — Civilization Governance Review** |
| Name | Civilization Fabric — Scalable Governance Structures |
| Mode | **ANALYSIS + DESIGN ONLY** — replace governance bottlenecks; design scalable governance; no source/runtime/authorization |
| Supersession scope | v1.0.0 §5 decision-rights (uniform apex escalation) **SUPERSEDED**; v1.0.0 §1–§3 (constructs CIV-C1..C12, dynamics) and §4 principles CGP-1..9 **PRESERVED**; CGP-10..13 **ADDED** |
| Composes with | `AUTH-UNIV-001` (UAF-SPINE S-A1..S-A10; archetypes AA-0..AA-8) — this revision *instantiates* that fabric |
| Subordinate to | `AUTH-009` (governance canon), `AD-0014` (Ω∞ Civilization deferral), `SIM-GOV-001/002` (SGP-9), Governance Baseline 1.0.0 |
| **DETERMINATION** | **BOTTLENECKS REPLACED — SCALABLE GOVERNANCE DESIGNED** (conditions SG-C1..SG-C4) |

> **Governing disclaimer (unchanged from v1.0.0).** CREATED — READY FOR RATIFICATION REVIEW · NOT RATIFIED ·
> NOT CONSTITUTIONAL LAW · NOT IMPLEMENTATION AUTHORIZED · PRESERVES AD-0014. **The Civilization Fabric remains
> conceptual, non-actuating, and deferred under AD-0014.** Scaling governance changes *who ratifies within the
> model*, never what the fabric may do to any real society — it still projects and proposes, never actuates.

---

## 1. Mandate & Scope

PHASE R7: review civilization governance, **replace governance bottlenecks**, and **design scalable governance
structures**. Output `CIV-GOV-001`. Because `CIV-GOV-001` v1.0.0 is a registered append-only artifact, R7 is
delivered as a **governed v1.1.0 revision** (version increment + supersession link, AUTH-009 §6.6) that
replaces the bottlenecked decision-rights model with a scalable one. **No preserved invariant is weakened:**
non-actuation, deny-by-default, Evolution-only commit, SoD, population privacy, historical integrity, local
sovereignty, AD-0014, and non-waivable S1/S3/S4 all carry forward verbatim.

## 2. Bottleneck Review (v1.0.0 §5 as-is)

The v1.0.0 decision-rights matrix (CD1..CD9) routes **almost every consequential decision to a single
synchronous Authority Board**, and marks *all* decisions Approval-Required (AD-0009). Six structural
bottlenecks result:

| ID | Bottleneck | Evidence (v1.0.0) | Failure mode at civilization scale |
|:--:|-----------|-------------------|------------------------------------|
| **B1** | **Single synchronous apex on the critical path** | CD1/CD2/CD4 "⇒ Board"; every CD Approval-Required | Apex load = O(all decisions); serialization; contention; the Board becomes the throughput ceiling |
| **B2** | **Single Evolution-Governor promotion chokepoint** | CD8 "Decision Authority + Evolution Governor", single commit gate | One serial gate for every promoted insight across all civilizations/nodes |
| **B3** | **No risk-tiering (uniform Approval-Required)** | "Approval-Required (AD-0009): Yes" for CD1..CD9 | Low-risk sandbox modeling pays the same governance cost as constitutional change → human-approval saturation |
| **B4** | **Centralized federation admission** | CD7 foreign-model admission ⇒ Board/Approval-Required | Cross-node co-simulation admission cannot scale with node/federation count |
| **B5** | **Partition-intolerant synchronous approval** | synchronous Board round-trip implied for all consequential CDs | Contradicts INV-1 (federation-first), INV-9 (static stability), L13 cosmological latency/partition |
| **B6** | **No elasticity** | one fixed apex; no tier/council model | Governance capacity is fixed while civilization/scenario count grows unbounded (INV-13) |

**Root cause.** A *single-apex, synchronous, uniform-approval* model — correct for a small program, structurally
unscalable for civilization/federation/cosmological scope.

## 3. Design Principles Added (CGP-10..CGP-13; CGP-1..9 preserved)

| # | Principle | Statement |
|:-:|-----------|-----------|
| **CGP-10** | **Subsidiarity** | Every decision is resolved at the **lowest competent governance tier**; escalation to the apex occurs only when a decision is genuinely constitutional/invariant/existential. |
| **CGP-11** | **Bounded delegated authority** | Tiers/councils hold **enumerated, scoped, time-boxed, revocable, narrowing-only, non-circular** authority *delegated from* the apex (AA-7); they never hold competing terminal authority (AUTH-UNIV-001 UAF-C3). |
| **CGP-12** | **Partition-tolerant append-only governance** | Ratification is an **asynchronous signed quorum** over append-only records that survives latency/partition: last-known-good operation, **deny-by-default (fail-closed) under partition**, eventual reconciliation (reuse FED-AUD). |
| **CGP-13** | **Risk-proportionate approval** | Governance cost scales with **blast radius**: sandboxed non-consequential modeling is autonomous+audited; consequential-but-scoped acts are council-ratified; only constitutional/existential acts are apex-reserved. |

## 4. Scalable Governance Structures (replaces v1.0.0 §5 model)

### 4.1 Governance Tier Model — subsidiarity hierarchy (GT-0..GT-3)

A tiered structure of **delegated** authority (each tier = registered instances in `authority:civilization:*`
per `AUTH-UNIV-001`). The apex is a *constitutional backstop*, not a per-decision approver.

| Tier | Body | Authority archetype(s) | Handles | On critical path for |
|:----:|------|------------------------|---------|----------------------|
| **GT-0** | **Authority Board (apex, singleton)** | AA-0 | Constitutional / invariant / AD-0014 / new civilization-class *taxonomy* / S1-S3-S4 | **Lane C only** (rare) |
| **GT-1** | **Federation / Domain Governance Councils** (quorum, per scope) | AA-3 (ratify), AA-2 (certify), AA-5 (federate), AA-4 (revoke) | Consequential-but-scoped acts within a sovereignty/trust boundary | **Lane B** |
| **GT-2** | **Civilization Governance Authority** (per civilization-model) | AA-6 (own), AA-1 (propose), AA-7 (delegate) | Compose/define within an already-authorized class | Lane A/B origination |
| **GT-3** | **Scenario / Run Authorities** (operational) | AA-1 (propose), AA-8 (halt) | Bounded, sandboxed, non-consequential modeling & runs | **Lane A** (autonomous) |

Delegation is **narrowing-only and revocable**: GT-0 delegates a bounded power set to GT-1 councils; councils
sub-delegate a narrower set to GT-2; no tier can widen its own grant or delegate a power it does not hold
(AA-7; non-circular). Any grant is revocable upward and auto-expires (time-boxed).

### 4.2 Risk-Classified Decision Lanes (replaces uniform Approval-Required)

| Lane | Blast radius | Resolver | Sync/Async | Human approval | Basis |
|:----:|-------------|----------|:----------:|:--------------:|-------|
| **A — Autonomous** | Sandboxed, non-consequential, within an authorized class | GT-2/GT-3 tier-local | async | No (audited Trusted Op) | AUTH-009 Approval-By-Exception (max safe autonomy) |
| **B — Council-ratified** | Consequential but scope-bounded (new class in an authorized family, cross-class within a scope, federation admission within a trust boundary) | **GT-1 council quorum** | async | Council quorum (not apex) | CGP-11/12 |
| **C — Apex-reserved** | Constitutional / invariant / AD-0014 / new civilization-class taxonomy / S1-S3-S4 / hard-constraint at fabric level | **GT-0 Authority Board** | may be async (non-actuating ⇒ latency-tolerant) | Yes (AD-0009) | AUTH-009 §6.4; UAF-C3 |

This collapses apex load from **O(all decisions) → O(constitutional decisions)** (B1/B3 replaced).

### 4.3 Asynchronous Quorum Ratification Protocol (B2/B5 replaced)

- **Ratification = signed quorum**, not a single approver: a Lane-B decision is ratified when a council quorum
  of AA-3 instances sign it (reuse PI-5 Ed25519). Throughput scales with **council count**, not one Governor.
- **Certification is parallelized/sharded** (multiple AA-2 certifiers per scope); the **Evolution Fabric remains
  the single *integrity* commit gate** (CGP-3) but is fed by parallel certified/ratified proposals — the gate
  checks integrity, it is no longer the throughput bottleneck (B2 replaced).
- **Partition behavior (CGP-12):** under partition, in-scope Lane-A continues (last-known-good); Lane-B/C
  **fail-closed** (deny-by-default) and queue as append-only signed records; on heal, **FED-AUD reconciliation**
  merges records deterministically (effect-mismatch/hash-break ⇒ fail-closed divergence). No decision requires a
  globally-synchronous apex round-trip (B5 replaced).

### 4.4 Elastic Council Registry (B4/B6 replaced)

- Councils/authorities are **registered instances** (`authority:civilization:<scope>:*`), composing with the
  `AUTH-UNIV-001` fabric. New federation/civilization scopes **spawn new councils declaratively** — governance
  capacity scales horizontally with civilization/federation count (INV-13; scale-free), **without redesign**
  (consistent with `UNKNOWN-READINESS-001` FA-C1).
- **Federation admission is decentralized to GT-1 councils** (AA-5, clamped/deny-only/namespace-isolated within
  each trust boundary); only cross-boundary or constitutional admissions escalate to GT-0 (B4 replaced).

## 5. Revised Decision-Rights Matrix (CD1..CD9 · v1.1.0)

Each decision keeps its SoD and non-actuation guarantees but is assigned a **lane + tier**, removing "⇒ Board"
from all but Lane C.

| # | Decision class | Lane | Resolver (tier) | Sync/Async | Escalates to GT-0 only if |
|:-:|----------------|:----:|-----------------|:----------:|---------------------------|
| CD1 | Define/scope a Civilization model class | B | GT-1 council (within authorized family) | async | **new class taxonomy** (Lane C) |
| CD2 | Compose institutions/population/culture/economy | A | GT-2 authority | async | cross-*sovereignty* (Lane B→GT-1) |
| CD3 | Bind a Knowledge (C7) read reference | A | GT-2/GT-3 | async | — |
| CD4 | Define a Rights/Obligations model | B | GT-1 council | async | **fabric-level hard-constraint** (Lane C) |
| CD5 | Open a Civilization Simulation run | A | GT-3 run authority (budgeted, sandboxed) | async | consequential-scope run (Lane B) |
| CD6 | Preserve/continuity-snapshot | A | GT-3 (signed, hash-anchored) | async | — |
| CD7 | Admit a foreign civilization model (federation) | B | **GT-1 Federation council** (clamped) | async | cross-trust-boundary (Lane C) |
| CD8 | Promote a model insight to governed change | B | GT-1 quorum certify+ratify → **Evolution commit** | async | invariant/constitutional impact (Lane C) |
| CD9 | Revoke a model/run/insight | A/B | GT-1/GT-2 AA-4 (forward-only, fail-closed) | async | apex-granted authority revocation (Lane C) |

**Non-waivable (unchanged):** author ≠ certifier ≠ committer (CGP-7/SoD); commit **only** via the Evolution
Fabric (CGP-3, the fabric holds no commit power); population privacy (CGP-5); AD-0014 preservation (CGP-9); the
Authority Board remains the **singular** apex — councils hold *delegated*, not competing, authority (UAF-C3).

## 6. Bottleneck → Replacement Register

| Bottleneck | Replacement | Scalability property |
|:----------:|-------------|----------------------|
| B1 single synchronous apex | GT-0..GT-3 subsidiarity + Lane A/B/C | apex load O(constitutional), not O(all) |
| B2 single Evolution-Governor chokepoint | parallel/sharded AA-2/AA-3 councils; Evolution = integrity gate only | throughput ∝ council count |
| B3 uniform Approval-Required | risk-classified lanes (CGP-13) | human approval only for Lane C |
| B4 centralized federation admission | GT-1 federation councils (AA-5, clamped) | admission scales with federation count |
| B5 partition-intolerant sync approval | async signed-quorum + fail-closed + FED-AUD reconciliation (CGP-12) | partition-tolerant; latency-tolerant |
| B6 no elasticity | elastic council registry (`authority:civilization:*`, INV-13) | horizontal, scale-free, no redesign |

## 7. Scalability & Safety Assessment

- **Scalability.** Apex is off the routine critical path; ratification and certification scale horizontally with
  councils; admission decentralized; governance is partition/latency-tolerant and elastic. Governance capacity
  now grows with the model population instead of being pinned to one Board.
- **Safety preserved.** Non-actuation (CGP-1), deny-by-default + Evolution-only commit (CGP-3), SoD (CGP-7),
  population privacy (CGP-5), historical integrity/append-only (CGP-6), local sovereignty (CGP-8), AD-0014
  (CGP-9), and non-waivable S1/S3/S4 are **unchanged**. Delegation is bounded/revocable and cannot manufacture
  authority (CGP-11); under uncertainty the system fails **closed** (CGP-12). No competing apex is created.

## 8. Determination & Conditions

> **BOTTLENECKS REPLACED — SCALABLE GOVERNANCE DESIGNED.**
> The single-apex, synchronous, uniform-approval model (B1–B6) is replaced by a **subsidiarity tier model
> (GT-0..GT-3)** with **risk-classified decision lanes (A/B/C)**, **asynchronous partition-tolerant signed-quorum
> ratification**, and an **elastic council registry**, instantiated on the `AUTH-UNIV-001` composable authority
> fabric. Apex load drops from O(all) to O(constitutional); throughput and admission scale horizontally; the
> model tolerates latency/partition — all while preserving non-actuation, SoD, deny-by-default, Evolution-only
> commit, and AD-0014.

- **SG-C1** — Adoption is Authority-Board-approved (AUTH-009 §8); this v1.1.0 is a proposal, not an enactment.
- **SG-C2** — The Authority Board remains the **singular apex**; councils are delegated, revocable, bounded
  (CGP-11; UAF-C3). No competing terminal authority may be instantiated.
- **SG-C3** — Any implementation is additive `src/control/civilization/*` (+ `authority:civilization:*` records)
  with **0** prohibited-core-dir change and the test baseline kept green (currently 269/269); commit remains
  Evolution-only.
- **SG-C4** — **AD-0014 preserved:** this revision scales *model governance* only; it enrolls no existential
  invariant, releases no lock, and the Civilization Fabric remains conceptual, non-actuating, and deferred.

## 9. Traceability & Next Step

- **Revises:** `CIV-GOV-001` v1.0.0 (§4–§5); preserves §1–§3 + CGP-1..9.
- **Composes with:** `AUTH-UNIV-001` (UAF-SPINE, AA-0..AA-8), `AUTH-009` (Approval-By-Exception, hierarchy),
  `SIM-GOV-001/002` (SGP-9), `AD-0018` (federation crypto/audit), `AD-0019` (Evolution commit gate).
- **Consumes:** `UNKNOWN-READINESS-001` (FA-C1 additive discipline), `AD-0014` (Ω∞ deferral).
- **Owner:** UCOS Authority Board (disposition).
- **Next step (non-authorizing):** register `CIV-GOV-001` v1.1.0 append-only in `CTX-REG-001` with a supersession
  link to v1.0.0; record an AUTH-012 decision proposal for Board adoption of the tier/lane model; propagate the
  lane/tier pattern to sibling fabric governance reviews (a general scalable-governance template). No
  construction, canon amendment, or lock release is authorized by this review.

**END CIV-GOV-001 v1.1.0 — PHASE R7 · CIVILIZATION GOVERNANCE REVIEW · SUBSIDIARITY TIERS (GT-0..GT-3) · RISK LANES (A/B/C) · ASYNC PARTITION-TOLERANT QUORUM · ELASTIC COUNCILS · BOTTLENECKS B1–B6 REPLACED · NON-ACTUATION & AD-0014 PRESERVED · DESIGN/PROPOSAL ONLY · NO CODE / NO LOCK RELEASE.**
