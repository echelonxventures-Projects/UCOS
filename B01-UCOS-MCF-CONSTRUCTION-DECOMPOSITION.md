# B01 — UCOS MCF Construction Decomposition

## PHASE B01 — Decomposition of the 9-Domain MCF into Executable Construction Workstreams (Construction Planning Only)

| Field | Value |
|-------|-------|
| Artifact | **B01 — UCOS MCF Construction Decomposition** |
| Artifact ID | `B01-UCOS-MCF-CONSTRUCTION-DECOMPOSITION` |
| Phase | **B01 — MCF Construction Decomposition** |
| Layer | ARCHITECTURE / PLATFORM (construction work-breakdown — decomposes the MCF into workstreams; builds nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **CONSTRUCTION PLANNING ONLY** — decompose the F03 MCF into work packages, streams, dependencies, milestones, and gates. **No implementation, no code, no infrastructure, no technology/framework selection, no governance invention, no execution, no `git` mutation (beyond this additive architecture `*.md`, permitted by the S0′ tolerance rule).** Append-only. |
| Authoritative inputs (per mandate) | `F01-UCOS-FOUNDATION-CONSTRUCTION-PROGRAM` (FP-1..12; IF-*; FC-1..9), `F02-UCOS-FOUNDATION-EXECUTION-ROADMAP` (waves; milestones), `F03-…-MCF-CONSTRUCTION-PACKAGE` (9 domains; MC-1..13; AC-1..9; HO-1..7), AUTH-001/003/004/005/006 |
| Governance posture | Planning is not construction. `UCOS-CONSTRUCTION-BLOCKED` + Article IX lock remain **ACTIVE**; every workstream/increment is gated by a governed authorization (M0). Construction gates below are **derived from existing governance** — none is new. |
| **Determination** | **MCF CONSTRUCTION PROGRAM READY** — the 9 domain work packages, cross-domain interface matrix, 4-stream construction model, dependency execution graph, M0..M4 milestones, construction gates, and program risks are complete and construction-ready under governance (§ 8). |

> **Scope.** Decompose the **9-domain MCF** (Genesis Kernel F-STO/F-IDN/F-SEC/F-REG + Operating Spine
> F-CFG/F-POL/F-EVT/F-GOV/F-EXE) into construction-ready workstreams. **Deliverables are design/spec/test
> artifacts** (contracts, models, acceptance-test definitions) — **not** code, infrastructure, or technology.

---

## 1. MCF Domain Work Package Catalog

Each work package (WP): **Purpose · Responsibilities · Inputs · Outputs · Dependencies · Deliverables · Acceptance
Criteria.** Deliverables are planning artifacts (contract specs, model specs, test definitions) — no code/tech.

### WP-STO — F-STO (Durable Substrate)
- **Purpose:** durable, ordered, append-only persistence + replay/snapshot; the recoverability + audit substrate.
- **Responsibilities:** append/read/snapshot/replay; ordered-log semantics; hash-chain storage.
- **Inputs:** genesis seed.
- **Outputs:** IF-STO.
- **Dependencies:** genesis seed (bootstrap).
- **Deliverables:** IF-STO contract spec; ordered-log + hash-chain semantics spec; replay-from-empty spec; snapshot spec; AC-5/AC-6 test definitions.
- **Acceptance:** a written record is recoverable by replay from empty (AC-5); append-only + tamper-evident (AC-6).

### WP-IDN — F-IDN (Identity & Tenancy)
- **Purpose:** attributable principal + tenant context on every operation.
- **Responsibilities:** principal/tenant model; authn/authz context; tenant scoping.
- **Inputs:** IF-STO.
- **Outputs:** IF-IDN.
- **Dependencies:** WP-STO.
- **Deliverables:** IF-IDN contract spec; principal/tenant model spec; tenant-scoping rules; AC-3/AC-7 test definitions.
- **Acceptance:** every operation attributable to principal + tenant (AC-9 precondition); tenant scoping default (AC-7).

### WP-SEC — F-SEC (Security & Trust)
- **Purpose:** cryptographic integrity + trust (sign/verify, keys-by-reference).
- **Responsibilities:** signature/verify; hash-chain integrity; key-custody-by-reference; secrets discipline.
- **Inputs:** IF-STO, IF-IDN.
- **Outputs:** IF-SEC.
- **Dependencies:** WP-STO, WP-IDN.
- **Deliverables:** IF-SEC contract spec; sign/verify semantics; key-by-reference rules (AUTH-008); genesis-seed verification spec; AC-1/AC-6 test definitions.
- **Acceptance:** a record signs + independently verifies; genesis seed verifiable under an independent key (AC-1).

### WP-REG — F-REG (Registry & Discovery)
- **Purpose:** authoritative registration/discovery/metadata of every artifact; kernel self-registration.
- **Responsibilities:** register/resolve/describe; self-registration; zero-orphan enforcement.
- **Inputs:** IF-STO, IF-IDN, IF-SEC.
- **Outputs:** IF-REG.
- **Dependencies:** WP-STO, WP-IDN, WP-SEC.
- **Deliverables:** IF-REG contract spec; artifact/type/contract registration model; self-registration spec; AC-1/AC-2 test definitions.
- **Acceptance:** registry self-registers; resolves any registered artifact; rejects orphans (AC-1/AC-2).

### WP-CFG — F-CFG (Configuration & Metadata)
- **Purpose:** behavior-from-data (zero hard-coding); tenant/context variability.
- **Responsibilities:** config resolution by tenant/context; variability model.
- **Inputs:** IF-REG, IF-STO, IF-IDN.
- **Outputs:** IF-CFG.
- **Dependencies:** Genesis Kernel (M1).
- **Deliverables:** IF-CFG contract spec; variability/metadata model; resolution semantics; AC-3 test definitions.
- **Acceptance:** two tenants differ by config only, identical code path (AC-3).

### WP-POL — F-POL (Policy & Decisioning)
- **Purpose:** deterministic authorization of every operation.
- **Responsibilities:** policy lifecycle; evaluate→decision; enforcement obligations.
- **Inputs:** IF-REG, IF-CFG, IF-IDN, IF-STO.
- **Outputs:** IF-POL.
- **Dependencies:** WP-CFG (+ kernel).
- **Deliverables:** IF-POL contract spec; policy lifecycle + decision model; determinism spec; AC-4 test definitions.
- **Acceptance:** every candidate op → deterministic allow/deny/obligation (AC-4).

### WP-EVT — F-EVT (Eventing & Messaging)
- **Purpose:** contract-typed, ordered, idempotent event backbone.
- **Responsibilities:** publish/subscribe; ordering; idempotent delivery; contract validation.
- **Inputs:** IF-STO, IF-REG, IF-IDN.
- **Outputs:** IF-EVT.
- **Dependencies:** Genesis Kernel (M1).
- **Deliverables:** IF-EVT contract spec; ordered/idempotent delivery semantics; audit-event schema (MC-8); AC-5/AC-6 test definitions.
- **Acceptance:** events ordered, replayable, contract-validated, exactly-once-effect (AC-5); audit events emitted (AC-6).

### WP-GOV — F-GOV (Governance)
- **Purpose:** gate every governed operation; append-only decision log.
- **Responsibilities:** gate-check; decision-record; approval/trusted-op lifecycle (AUTH-012).
- **Inputs:** IF-REG, IF-POL, IF-IDN, IF-STO.
- **Outputs:** IF-GOV.
- **Dependencies:** WP-POL (+ kernel).
- **Deliverables:** IF-GOV contract spec; gate-check + decision-record model; approval/trusted-op lifecycle spec; AC-8 test definitions.
- **Acceptance:** no governed op proceeds without a recorded gate decision (AC-8).

### WP-EXE — F-EXE (Execution / Runtime)
- **Purpose:** deterministic, governed capability invocation; the vertical slice.
- **Responsibilities:** invoke→result; idempotency keys; identity+policy+config binding; audit emission.
- **Inputs:** IF-IDN, IF-POL, IF-CFG, IF-EVT, IF-GOV.
- **Outputs:** IF-EXE.
- **Dependencies:** WP-CFG, WP-POL, WP-EVT, WP-GOV (+ kernel).
- **Deliverables:** IF-EXE contract spec; invocation + idempotency model; vertical-slice definition; AC-9 test definition.
- **Acceptance:** a capability runs end-to-end under identity+policy+config, emits audit, recoverable by replay (AC-9).

---

## 2. Cross-Domain Interface Matrix

| Interface | Producer | Consumer(s) | Contract | Dependency type | Validation requirement |
|-----------|:--------:|-------------|----------|:---------------:|------------------------|
| IF-STO | F-STO | all | append/read/snapshot/replay | **Hard** | Replay-from-empty equivalence; append-only/tamper-evident |
| IF-IDN | F-IDN | all | authenticate/authorize-context/tenant-scope | **Hard** | Every op carries attributable principal+tenant |
| IF-SEC | F-SEC | F-REG, F-GOV, F-EVT | sign/verify/key-ref | **Hard** | Signature verifies under independent key; no in-band secret |
| IF-REG | F-REG | all | register/resolve/describe | **Hard** | Self-registration resolves; orphan rejected |
| IF-CFG | F-CFG | F-POL, F-EXE | resolve(config,tenant,context) | **Hard** | Behavior varies by data only (no code fork) |
| IF-POL | F-POL | F-GOV, F-EXE | evaluate→decision | **Hard** | Deterministic decision; same input+state → same decision |
| IF-EVT | F-EVT | F-EXE, F-GOV, (F-OBS later) | publish/subscribe | **Hard** | Ordered, idempotent, contract-validated; audit-event emit |
| IF-GOV | F-GOV | F-EXE | gate-check/record-decision | **Hard** | No governed op without recorded gate decision |
| IF-EXE | F-EXE | services/capabilities | invoke→result | **Hard** | Deterministic, idempotent, audit-emitting execution |
| genesis-seed | (bootstrap) | F-STO/IDN/SEC/REG | signed seed | **Bootstrap** | Independently verifiable; self-registers |

**Rules (binding):** every interface is versioned with migration paths (FP-10); no cross-domain call bypasses a
contract; no shared mutable model (AUTH-004 §6.3); every produced artifact is registered (FP-1) and traced (AUTH-010).

---

## 3. Construction Stream Model

| Stream | Scope | Domains / work | Ordering | Path |
|:------:|-------|----------------|----------|------|
| **A — Genesis Kernel** | Root trust/identity/registry/durability | WP-STO → (WP-IDN ∥ WP-SEC) → WP-REG | mostly serial; IDN∥SEC parallel after STO | **Critical** |
| **B — Operating Spine** | Config/policy/event/gov/exec | (WP-CFG ∥ WP-EVT) → WP-POL → WP-GOV → WP-EXE | serial spine; CFG∥EVT parallel | **Critical** |
| **C — Governance Integration** | Wire IF-GOV gate-checks, policy enforcement, registry+traceability across all domains; SoD; construction gates (§6) | integrates as each domain lands (STO..EXE) | parallel to A/B, lagging one WP | Partially parallel |
| **D — Certification & Validation** | Per-domain acceptance (AC-1..9), vertical-slice (FC-9), durability (REAL-M-07), independent assurance (REAL-C-05) | per-domain acceptance runs at each WP exit; MCF integration + independent validation at end | parallel per-WP; serial at M3/M4 | Partially parallel; serial tail |

**Parallel work:** WP-IDN∥WP-SEC (Stream A); WP-CFG∥WP-EVT (Stream B); Stream C integration + Stream D per-domain
acceptance run alongside A/B.
**Serialized work:** WP-STO→WP-REG (kernel closes); WP-CFG→WP-POL→WP-GOV→WP-EXE (spine closes); Stream A ≺ Stream B.
**Critical-path work:** `WP-STO → WP-IDN → WP-SEC → WP-REG → WP-CFG → WP-POL → WP-GOV → WP-EXE → vertical-slice
(FC-9/AC-9) → independent validation (M4)`.

---

## 4. Dependency Execution Graph

```
 M0 (Construction Authorization — AD-0024-with-conditions)  ── governance gate over everything
        │
 [BOOTSTRAP] genesis seed ──▶ F-STO ──▶ (F-IDN ∥ F-SEC) ──▶ F-REG            ── Stream A (kernel) ─ M1
        │                                                        │
        │                       (F-CFG ∥ F-EVT) ──▶ F-POL ──▶ F-GOV ──▶ F-EXE ── Stream B (spine) ─ M2
        │                                                        │
        └── Stream C (governance integration: IF-GOV gates, policy, registry/trace, SoD) ── parallel
                                                                 │
                       Stream D: per-WP acceptance (AC-1..9) → vertical slice (FC-9) ─────── M3 (MCF)
                                                                 │
                       independent assurance (REAL-C-05) + durability (REAL-M-07) ────────── M4
```

| Dependency class | Members |
|------------------|---------|
| **Hard** | STO→IDN→SEC→REG; CFG→POL→GOV→EXE; roots→all spine; POL←CFG; GOV←POL; EXE←{IDN,POL,CFG,EVT,GOV} |
| **Soft** | IDN∥SEC (after STO); CFG∥EVT; Stream C lagging one WP; Stream D per-WP acceptance concurrency |
| **Bootstrap** | genesis seed → F-STO/IDN/SEC/REG co-bootstrap + self-registration (resolved per F01 §3 / F03 §3) |
| **Governance** | M0 authorization gates all work; each increment gated by G-AUTH/G-DURABILITY/G-PREFLIGHT/G-INDEP (§6) |
| **Critical path** | STO→IDN→SEC→REG→CFG→POL→GOV→EXE→FC-9→M4 |

**Acyclic** (only the resolved genesis bootstrap is self-referential).

---

## 5. Milestone Framework

| MS | Name | Entry Criteria | Exit Criteria | Evidence Required |
|:--:|------|----------------|---------------|-------------------|
| **M0** | **Construction Authorization** | T04 Board session enacted; RM-2..RM-8 durability + REAL-C-05 designation available; scope = MCF (kernel-first) | AD-0024-with-conditions issued for the MCF sub-scope; Executor + IA named; SoD verified | Signed authorization; SoD attestation; construction-scope record |
| **M1** | **Genesis Kernel Complete** | M0 passed; genesis-seed design approved | Stream A complete; AC-1 + AC-2 pass; kernel self-registered; seed independently verified | IF-STO/IDN/SEC/REG specs registered; AC-1/AC-2 results; seed-verify attestation |
| **M2** | **Operating Spine Complete** | M1 passed; IF-REG/IDN/SEC/STO published+versioned | Stream B complete; AC-3, AC-4, AC-8 pass; append-only/hash-chained events emitted | IF-CFG/POL/EVT/GOV/EXE specs registered; AC-3/4/8 results |
| **M3** | **MCF Complete** | M2 passed; Stream C integration done | **AC-1..AC-9 ∧ AC-INT all pass** (incl. FC-9 vertical slice, FC-6 audit via replay) | Full AC-1..9 + AC-INT results; vertical-slice trace; audit-trail replay proof |
| **M4** | **Independent Validation Complete** | M3 passed | Independent (REAL-C-05, distinct-actor) attestation confirms MCF COMPLETE; durability (REAL-M-07) committed/pushed/tagged | Signed independent attestation; durability tag; HO-1..HO-7 satisfied |

**Mapping to F02:** B01 M0 = the governed authorization; B01 M1/M2 = F02 Wave-0/Wave-1 exits; B01 M3 = F02 **M3**
(MCF certified); B01 M4 = independent assurance (F02 HO-2 / REAL-C-05). Gating: M0 ≺ M1 ≺ M2 ≺ M3 ≺ M4 (fail-closed).

---

## 6. Construction Governance Gates (derived from existing governance — none new)

| Gate | Derived from | Purpose | Required evidence | Pass criteria | Fail criteria |
|------|--------------|---------|-------------------|---------------|---------------|
| **G-AUTH** | AUTH-012 §8 / AD-0009; AD-0024 | Authorize the MCF construction scope (M0) | Signed AD-0024-with-conditions; named Executor/IA; SoD | Authorization live, scope = MCF, SoD verified | Missing/expired authorization; scope expansion (SG-1) |
| **G-PREFLIGHT** | RM-2 Pre-Flight (U30 PF-1..8) | Verify baseline before each durability commit | Anchors/counts re-verified; clean index | All PF checks PASS | Any drift → NO-GO |
| **G-DURABILITY** | REAL-M-07 (O-1/O-2/O-3) | Each increment committed durably, atomically, no-rewrite | Commit SHA; push; append-only; no force-push | Increment durable + recoverable | Split/rewrite/force-push (O-1/O-2 breach) |
| **G-TRACE** | AUTH-010 Traceability; FP-1 | Every artifact registered + traced (zero orphan) | Registry entry; upward/downward lineage | Registered + traced | Orphan or missing lineage |
| **G-QUALITY** | `.claude/governance/quality-gates.md` (Q-gates) | Design/spec quality of each WP | Q-gate checklist for the WP artifacts | Q-gates pass | Any blocking quality gap |
| **G-DOC** | `.claude/governance/documentation-gates.md` | Documentation completeness of each WP | Doc-gate checklist | Doc-gates pass | Missing required documentation |
| **G-SEC** | `.claude/governance/security-gates.md`; AUTH-008 | Security/trust conformance (keys-by-reference, threat) | Security-gate checklist; F-SEC conformance | Security-gates pass | Any non-waivable security violation |
| **G-POLICY** | F-POL / FP-4 | Each domain's operations are policy-governed | Policy-decision evidence for domain ops | Every op policy-gated | Ungoverned operation path |
| **G-INDEP** | REAL-C-05 (SG-4 / SIG-4) | Independent, distinct-actor validation (M4) | Signed independent attestation; reproduced evidence | Concurring PASS; Executor ≠ IA | Self-attested; SoD breach; FAIL/unresolved PARTIAL |
| **G-RELEASE** | `.claude/governance/release-gates.md`; `completion-criteria.md` | MCF completion + handover (M3→M4→handover) | AC-1..9 + AC-INT; HO-1..7 | All pass | Any AC/HO unmet |

**All gates are derived from existing governance instruments; no new mechanism is introduced.**

---

## 7. Construction Program Risks

| Class | Risk | Mitigation direction (planning-level; no tech) |
|-------|------|-----------------------------------------------|
| **Technical** | Genesis bootstrap trust; hidden nondeterminism breaking replay | Independent seed verification (G-INDEP); FP-5 determinism + idempotency; AC-5 replay-equivalence |
| **Technical** | Audit read without F-OBS impractical | Acceptable at MCF (replay-based read, MC-9); operational observability deferred to Wave 2 (F03 R-3) |
| **Operational** | Critical-path serialization (kernel→spine) limits parallelism; recovery replay time | Exploit IDN∥SEC, CFG∥EVT, Stream C/D concurrency; snapshots (IF-STO) |
| **Governance** | Construction begun before M0; self-governance capture; self-attested validation | Fail-closed G-AUTH; SoD + G-INDEP (REAL-C-05); append-only decision log (AUTH-012) |
| **Evolution** | Contract drift across 9 IF-* interfaces during construction | Versioned contracts + migration (FP-10); G-TRACE registration of contract versions; additive-only |
| **Integration** | Interface mismatch between producer/consumer domains; Stream C lag | Cross-domain interface matrix (§2) as the integration contract; validation requirement per interface; integrate-as-you-land (Stream C) |
| **Integration** | Vertical slice (FC-9) exposes latent cross-domain gaps late | Per-WP acceptance (Stream D) + early slice scaffolding once F-EXE deps land |

**No mitigation selects technology.** Detailed control/tech selection is a later governed decision (Prompt 08 ADRs).

---

## 8. Final Determination

> # **MCF CONSTRUCTION PROGRAM READY**
>
> The fully specified 9-domain MCF is decomposed into construction-ready workstreams: **9 domain work packages**
> with purpose/responsibilities/inputs/outputs/dependencies/deliverables/acceptance (§ 1); the **cross-domain
> interface matrix** with producer/consumer/contract/dependency-type/validation (§ 2); the **4-stream construction
> model** (A Genesis Kernel · B Operating Spine · C Governance Integration · D Certification & Validation) with
> parallel/serial/critical-path classification (§ 3); the **dependency execution graph** (hard/soft/bootstrap/
> governance + critical path, acyclic) (§ 4); the **milestone framework M0..M4** with entry/exit/evidence (§ 5);
> the **construction governance gates** derived entirely from existing governance (§ 6); and the **program risk
> analysis** (§ 7).
>
> Deliverables are planning artifacts (contract specs, models, acceptance-test definitions). **No implementation,
> code, infrastructure, technology/framework selection, governance invention, execution, or `git` mutation was
> performed.** `UCOS-CONSTRUCTION-BLOCKED` and the Article IX generation lock remain **ACTIVE**; all work is gated
> by M0 (AD-0024-with-conditions) and the derived construction gates, with independent validation at M4.
>
> ### Next required phase
> Governed authorization at **M0** (via the T04 Board session + RM-2..RM-8 durability + REAL-C-05 designation →
> AD-0024-with-conditions), then construction along Streams A→B with C/D concurrent, gated M1→M2→M3→M4.

---

## Governance / Non-Construction Statement

No implementation produced; no code generated; no infrastructure created; no technology/framework/language/
datastore/cloud selected; no new governance mechanism, control, or gate invented (all gates derived from existing
instruments); no execution, construction, or `git` mutation performed; no lock released; no invariant enrolled; no
canon modified. This is a construction-**decomposition** artifact only; the sole repository effect is this additive
architecture `*.md`, permitted by the S0′ tolerance rule and outside the `RM2-CONTENT-ANCHOR` protected set. MCF
construction remains a future Approval-Required Operation (AUTH-012 §8 / AD-0009) gated behind M0. INV-1..13,
`AUTH-012` (v1.0.13), AD-0014, AUTH-004/005/006 (FROZEN canon), the Article IX generation lock, and
`UCOS-CONSTRUCTION-BLOCKED` are unchanged.

## Traceability
- **Consumes (authoritative):** `F01-…-FOUNDATION-CONSTRUCTION-PROGRAM`, `F02-…-EXECUTION-ROADMAP`, `F03-…-MCF-CONSTRUCTION-PACKAGE`, AUTH-001/003/004/005/006.
- **Derives gates from:** AUTH-012 (§8/AD-0009), AUTH-010 (traceability), AUTH-008 (security), REAL-M-07 (durability O-1/O-2/O-3), REAL-C-05 (independence), `.claude/governance/*` (quality/documentation/security/release/completion gates).
- **Produces:** the MCF construction program (WP catalog, interface matrix, 4-stream model, dependency execution graph, milestones M0..M4, construction gates, risks).
- **Feeds:** the governed M0 authorization and construction to M4 / MCF COMPLETE + independent assurance; handover (F03 HO-1..7) to Wave 2 + commerce-domain construction.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014; construction gated by `UCOS-CONSTRUCTION-BLOCKED`.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); Platform/Domain architects produce conforming designs under Prompts 02–09.

**END B01-UCOS-MCF-CONSTRUCTION-DECOMPOSITION — PHASE B01 · 9 WORK PACKAGES (WP-STO/IDN/SEC/REG/CFG/POL/EVT/GOV/EXE) ·
CROSS-DOMAIN INTERFACE MATRIX · 4 STREAMS (A KERNEL / B SPINE / C GOV-INTEGRATION / D CERT-VALIDATION) ·
DEPENDENCY EXECUTION GRAPH (HARD/SOFT/BOOTSTRAP/GOVERNANCE + CRITICAL PATH) · MILESTONES M0..M4 · GATES DERIVED
FROM EXISTING GOVERNANCE · RISK ANALYSIS · **MCF CONSTRUCTION PROGRAM READY** · PLANNING ONLY · NO CODE / NO
INFRA / NO TECH SELECTION / NO GOVERNANCE INVENTION / NO CONSTRUCTION / NO MUTATION · CONSTRUCTION LOCK +
ARTICLE IX REMAIN ACTIVE.**
