# B03 — UCOS MCF Construction Orchestration Model

## PHASE B03 — How the Approved MCF Construction Program is Coordinated, Controlled, Validated & Certified (Planning Only)

| Field | Value |
|-------|-------|
| Artifact | **B03 — UCOS MCF Construction Orchestration Model** |
| Artifact ID | `B03-UCOS-MCF-CONSTRUCTION-ORCHESTRATION-MODEL` |
| Phase | **B03 — MCF Construction Orchestration Model** |
| Layer | ARCHITECTURE / GOVERNANCE-OPS (orchestration model — how construction is run; runs nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **ORCHESTRATION PLANNING ONLY** — define how the M0-authorized MCF program is coordinated/controlled/validated/certified. **No governance invention, no implementation, no code, no infrastructure, no technology/framework selection, no execution, no `git` mutation (beyond this additive architecture `*.md`, permitted by the S0′ tolerance rule).** Append-only. |
| Authoritative inputs (per mandate) | `F01` (FP-1..12; FC-1..9), `F02` (waves/milestones), `F03` (9 domains; AC-1..9; HO-1..7), `B01` (WP-*; interface matrix; Streams A–D; M0..M4; gates G-*), `B02` (DEL-M0..M4; CE/VE/AE/IVE; AP-1/2/3; IVI-1..8) |
| Governance posture | Planning is not construction. `UCOS-CONSTRUCTION-BLOCKED` + Article IX lock remain **ACTIVE**; this model activates on **M0** only. All roles/gates/lifecycles are **derived from existing governance** — none new. |
| **Determination** | **MCF ORCHESTRATION MODEL READY** — the operating model, workstream coordination, milestone governance, evidence lifecycle, acceptance/certification lifecycle, change control, and failure/recovery model are complete (§ 8). |

> **Objective.** Specify the coordination and control machinery that makes B01/B02 executable end-to-end under
> governance — who does what, in what order, with what gates, evidence, and recovery. Orchestration of existing
> governance only; no new mechanism, no code, no technology.

---

## 1. Construction Operating Model

**Roles (existing; SoD-bound).**
| Role | Responsibility | Separation constraint |
|------|----------------|-----------------------|
| **Authority Board** | Grants M0; approves milestone advances; owns Approval-Required Operations (AUTH-012 §8) | ≠ IA on the same act (SoD-4) |
| **Custodian** (Chief Authority Architect) | Oversight; counter-records; maintains registry/traceability integrity | ≠ Executor |
| **Executor** | Produces deliverables (specs/contracts/tests); runs construction increments; captures CE/VE/AE | ≠ IA (SG-4), ≠ Custodian |
| **Independent Adjudicator (IA)** | M4 independent re-derivation + attestation (IVE) | ≠ Executor; distinct key (SIG-3) |

**Operating principles (derived).**
- **OP-1 Authorization envelope:** all work runs strictly inside the M0 scope-lock (MCF, kernel-first); scope expansion → re-authorization (SG-1).
- **OP-2 Fail-closed:** any gate/AC/evidence gap halts advance; default = do-not-proceed.
- **OP-3 Register-and-evidence-first:** no deliverable is "done" until registered (FP-1), traced (AUTH-010), and evidenced (CE/VE) — G-TRACE.
- **OP-4 Contract-first coordination:** a consumer WP integrates only against a **published, versioned** producer IF-* (FP-3).
- **OP-5 Durable-and-forward-only:** increments are committed durably, atomically, no-rewrite (O-1/O-2/O-3; REAL-M-07 discipline).
- **OP-6 Independence preserved:** the M4 verdict is re-derived by a distinct actor (REAL-C-05), never self-attested.

**Cadence:** Streams A→B on the critical path; Streams C (governance integration) and D (per-WP acceptance)
run concurrently, lagging one WP; each WP closes with a handoff token; each milestone closes with a gate event (§3).

---

## 2. Workstream Coordination Model

**Stream interaction (from B01 §3):**
```
A (Kernel):   WP-STO → (WP-IDN ∥ WP-SEC) → WP-REG ─────────────────────┐  ⇒ M1
B (Spine):                         (WP-CFG ∥ WP-EVT) → WP-POL → WP-GOV → WP-EXE  ⇒ M2
C (Gov-Integration):  wire IF-GOV gates + policy + registry/trace as each WP lands (lag ≤ 1 WP)
D (Cert/Validation):  per-WP acceptance (AC-*) at each WP exit; MCF integration (AC-INT) at M3; independent (M4)
```

**Coordination rules.**
- **CO-1 Interface handoff:** a producer WP exits only when its IF-* spec is published + versioned + registered; the consumer WP's entry gate checks that handoff (the B01 §2 interface matrix is the coordination contract).
- **CO-2 Parallelization:** WP-IDN∥WP-SEC (after WP-STO); WP-CFG∥WP-EVT; Stream C/D concurrency — coordinated by dependency, not calendar.
- **CO-3 Integration cadence (Stream C):** each landed WP is immediately wired into IF-GOV gate-checks + policy enforcement + registry/traceability; integration lag ≤ 1 WP to surface cross-domain gaps early (integration risk mitigation).
- **CO-4 Acceptance cadence (Stream D):** per-WP acceptance (AC-*) runs at WP exit (early defect detection); AC-INT (integrated) runs only at M3.
- **CO-5 Handoff token:** each WP emits `{WP-id, IF-* version, CE/VE refs, acceptance result}` consumed by dependents and by the milestone gate.
- **CO-6 Critical-path protection:** the critical path `STO→IDN→SEC→REG→CFG→POL→GOV→EXE→slice` is never blocked by non-critical Stream C/D work; non-critical work yields to critical-path WPs.

---

## 3. Milestone Governance Model

Each milestone M0..M4 is a **governed gate event**, not a status label. Sequence: M0 ≺ M1 ≺ M2 ≺ M3 ≺ M4 (fail-closed).

**Gate event structure (per milestone):**
1. **Entry** — entry criteria met (B02 §6); required deliverables (DEL-*) present + registered.
2. **Gate evaluation** — the applicable B01 §6 gates are evaluated with their evidence:
   - M0 → G-AUTH (+ SoD)
   - M1/M2 → G-PREFLIGHT, G-DURABILITY, G-TRACE, G-QUALITY, G-DOC, G-SEC, G-POLICY (per WP)
   - M3 → G-RELEASE (AC-1..9 + AC-INT)
   - M4 → G-INDEP (REAL-C-05 attestation)
3. **Decision** — Authority Board (with IA input at M4) renders **ADVANCE / HOLD / ROLLBACK** (§7).
4. **Record** — decision enrolled append-only in the decision log (AUTH-012 / IF-GOV); milestone-exit evidence sealed.

| MS | Gate owner | Decisive gate(s) | Advance requires |
|:--:|-----------|------------------|------------------|
| M0 | Board | G-AUTH | AD-0024-with-conditions live; SoD verified |
| M1 | Board (Executor evidence) | G-DURABILITY, G-TRACE, G-QUALITY/DOC/SEC | AC-1 ∧ AC-2 PASS; kernel durable; AP-1 complete |
| M2 | Board | same + G-POLICY | AC-3 ∧ AC-4 ∧ AC-8 PASS; spine durable; AP-2 complete |
| M3 | Board | G-RELEASE | AC-1..9 ∧ AC-INT PASS; AP-3 complete; MCF durably tagged |
| M4 | Board + IA | G-INDEP | REAL-C-05 distinct-actor attestation PASS; HO-1..7 satisfied |

**Rule:** a milestone gate is fail-closed — any unmet gate → HOLD or ROLLBACK; no advance on partial evidence.

---

## 4. Evidence Production Lifecycle

Lifecycle of each evidence unit (CE→VE→AE→IVE per B02 §3), append-only and registered:

```
DRAFT ─▶ REGISTERED ─▶ VERIFIED ─▶ ACCEPTED ─▶ [M4] INDEPENDENTLY-VALIDATED
 (author) (FP-1/trace) (VE: gates)  (AE: AC PASS)   (IVE: IA re-derivation + signature)
```

| Stage | Produces | Owner | Rule |
|-------|----------|:-----:|------|
| **CE** Creation | spec/contract/model + registry entry + lineage | Executor | OP-3: unregistered ⇒ not-done (G-TRACE) |
| **VE** Verification | gate results (G-QUALITY/DOC/SEC/TRACE/POLICY) + self-run AC | Executor | admissible only if CE exists + links |
| **AE** Acceptance | AC-* PASS results; vertical-slice trace; replay proof | Executor | admissible only if CE+VE link (chain) |
| **IVE** Independent Validation | re-derived results + signed attestation over hashes | IA | EAR-1 reproduced (not copied); SIG-4 verify; ≠ Executor |

**Lifecycle rules (derived):**
- **EL-1 Evidence-before-advance:** no milestone advances without its complete evidence chain (§3).
- **EL-2 Append-only + hash-chained:** evidence is immutable; corrections are new, linked entries (FP-6/O-2).
- **EL-3 Chain admissibility:** an AE is admissible only with linked CE+VE; an IVE only if it independently re-derives the AE (REAL-C-05 EAR).
- **EL-4 Durability:** accepted evidence is committed durably with its increment (REAL-M-07); it survives on the durable substrate (F-STO), not one tree.

---

## 5. Acceptance & Certification Lifecycle

```
per-WP:   spec → VERIFIED (gates) → ACCEPTED (AC-*)  ── Stream D, at each WP exit
package:  AP-1 (M1 kernel) → AP-2 (M2 spine) → AP-3 (M3 MCF, incl. AC-INT)
certify:  AP-3 ACCEPTED → [M4] INDEPENDENTLY-VALIDATED (IA) → CERTIFIED (MCF Closure Certificate) → HANDOVER
```

| Stage | Gate | Output | Authority |
|-------|:----:|--------|-----------|
| Per-WP acceptance | AC-* (F03 §5) | domain AE | Executor + Stream D |
| Kernel certification | AP-1 / M1 | Genesis Kernel accepted | Board (M1 gate) |
| Spine certification | AP-2 / M2 | Operating Spine accepted | Board (M2 gate) |
| MCF certification | AP-3 / M3 (G-RELEASE) | MCF COMPLETE (self-certified, durable) | Board (M3 gate) |
| Independent validation | M4 (G-INDEP) | REAL-C-05 attestation (PASS/PARTIAL/FAIL) | IA (distinct actor) |
| Closure + handover | HO-1..7 | MCF Closure Certificate + handover token | Board + IA |

**Certification rules:** M3 yields a **self-certified** MCF (Executor+Board); M4 makes it **independently
certified** (IA). A PASS (or Board-accepted PARTIAL with tracked conditions) authorizes handover to Wave 2 /
commerce-domain construction; a FAIL re-opens the failing scope (REAL-C-05 LIFE-2). If no distinct IA exists,
M4 records **pending `REAL-C-05`** (MCF self-certified/durable; independence flagged pending — U32 CP-1 analogue).

---

## 6. Change Control Model

Changes during construction are governed and **forward-only** (derived from AUTH-012 change procedure + O-2/O-3 + FP-10):

| Step | Action | Rule |
|:----:|--------|------|
| CC-1 | **Change request** (defect fix, contract revision, scope question) | Recorded append-only; classified |
| CC-2 | **Impact assessment** | Assess against FP-*, FC-1..9, interface matrix, dependents; identify affected WPs/ACs |
| CC-3 | **Scope check** | In MCF scope → Executor proceeds under M0; **outside** MCF scope → **re-authorization** (SG-1) |
| CC-4 | **Governed decision** | For contract-breaking/interface changes: governed decision (IF-GOV/AUTH-012); version bump (FP-10) |
| CC-5 | **Forward-only implementation** | Pre-durability: `restore`/`reset --soft` (non-rewrite); post-durability: **new corrective increment** (`revert`/additive) — **never** rewrite durable history (O-2) |
| CC-6 | **Re-verify** | Re-run affected VE/AE; re-issue evidence links; dependents re-validate against the new IF-* version |

**Change control rules:**
- **CC-A Contract versioning:** any change crossing an IF-* seam ⇒ new version + migration note (FP-10); consumers pinned to versions.
- **CC-B No destructive rewrite:** durable history is additive-only (O-2); recovery pre-durability only (O-3).
- **CC-C Scope-lock:** MCF scope is fixed by M0; expansion requires a new governed authorization (no silent scope creep).

---

## 7. Failure / Recovery Model

Derived from RM-2 rollback (U29 §5), wave rollback (U31 §6), U32 failure logic, and REAL-C-05 LIFE.

| Failure point | Classification | Handling | Recovery |
|---------------|----------------|----------|----------|
| **Gate fails** (G-QUALITY/DOC/SEC/TRACE/POLICY) | Construction defect | HALT the WP (fail-closed) | Fix + re-run gate; re-issue VE |
| **AC-* fails** (per-WP) | Acceptance defect | HALT the WP; do not hand off | Correct deliverable; re-run AC; re-issue AE |
| **AC-INT fails** (M3) | Integration defect | HOLD M3 | Diagnose cross-domain gap (interface matrix); fix; re-run AC-INT |
| **G-PREFLIGHT fails** | Baseline drift | NO-GO on the durability commit | Re-verify anchors; resolve drift; retry |
| **Durability commit error, pre-push** | Recoverable | ROLLBACK (pre-push) | Non-rewrite recovery (`reset --soft`/`restore`/branch-recreate); re-enter (O-3) |
| **Post-push defect** | Forward-only | REMEDIATION | New corrective increment (`revert`/additive); never force-push (O-2) |
| **Milestone gate HOLD** | Advance blocked | Stay at current milestone | Clear the unmet criterion; re-present the gate event |
| **M4 independent FAIL** | Independence/validation defect | Re-open failing scope | Return artifact to Executor (LIFE-2); remediate; re-attest |
| **No distinct IA at M4** | Independence pending | Proceed with flag | Record **pending `REAL-C-05`**; complete attestation when IA designated (CP-1 analogue) |

**Recovery principles:** pre-durability = fully recoverable via non-rewrite means (O-3); post-durability =
forward-only (O-2/O-3); every failure is fail-closed (halt, don't advance); every recovery re-enters at the last
passed gate and re-runs the affected evidence chain.

---

## 8. Final Determination

> # **MCF ORCHESTRATION MODEL READY**
>
> The complete orchestration model for constructing the MCF once M0 is granted is defined: the **construction
> operating model** (roles, SoD, operating principles OP-1..6, cadence, § 1); the **workstream coordination
> model** (stream interaction, interface handoff, parallelization, integration/acceptance cadence, critical-path
> protection, § 2); the **milestone governance model** (M0..M4 gate events with owners, decisive gates, and
> advance criteria, § 3); the **evidence production lifecycle** (CE→VE→AE→IVE with append-only/chain rules,
> § 4); the **acceptance & certification lifecycle** (per-WP → AP-1/2/3 → M3 self-certified → M4 independently
> certified → handover, § 5); the **change control model** (governed, forward-only, versioned, scope-locked,
> § 6); and the **failure/recovery model** (fail-closed halt, pre-durability rollback, post-durability
> forward-only, independent-FAIL re-open, § 7).
>
> Every role, gate, lifecycle, and recovery path is **derived from existing governance** (AUTH-012, AUTH-010,
> AUTH-008, REAL-M-07 O-1/O-2/O-3, REAL-C-05, `.claude/governance/*`) — **no new governance was invented.** The
> model activates only on **M0**; `UCOS-CONSTRUCTION-BLOCKED` and the Article IX generation lock remain
> **ACTIVE**.
>
> This model plans only. **No implementation, code, infrastructure, technology/framework selection, governance
> invention, execution, or `git` mutation was performed.**
>
> ### Next required phase
> Governed authorization at **M0** (T04 Board session + RM-2..RM-8 durability + REAL-C-05 designation →
> AD-0024-with-conditions), then run construction under this orchestration model: Streams A→B (C/D concurrent),
> gated M1→M2→M3→M4 to MCF COMPLETE + independent certification + handover.

---

## Governance / Non-Construction Statement

No implementation produced; no code generated; no infrastructure created; no technology/framework/language/
datastore/cloud selected; no new governance mechanism, role, gate, or lifecycle invented (all derived from
existing instruments); no execution, construction, or `git` mutation performed; no lock released; no invariant
enrolled; no canon modified. This is an orchestration-**model** artifact only; the sole repository effect is this
additive architecture `*.md`, permitted by the S0′ tolerance rule and outside the `RM2-CONTENT-ANCHOR` protected
set. Construction activates only under M0 (AUTH-012 §8 / AD-0009). INV-1..13, `AUTH-012` (v1.0.13), AD-0014,
AUTH-004/005/006 (FROZEN canon), the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged.

## Traceability
- **Consumes (authoritative):** `F01`, `F02`, `F03`, `B01`, `B02`.
- **Derives orchestration from:** AUTH-012 (§8/AD-0009 + change procedure), AUTH-010 (traceability), AUTH-008 (security), REAL-M-07 (O-1/O-2/O-3 durability + rollback), REAL-C-05 (independence/LIFE/EAR/SIG), `.claude/governance/*` (quality/documentation/security/release/completion gates), RM-2/U29/U31/U32 (pre-flight, rollback, failure logic).
- **Produces:** the MCF construction orchestration model (operating model, coordination, milestone governance, evidence lifecycle, acceptance/certification lifecycle, change control, failure/recovery).
- **Feeds:** the M0-authorized construction run to M4 / MCF COMPLETE + independent certification + handover (F03 HO-1..7).
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014; construction gated by `UCOS-CONSTRUCTION-BLOCKED`.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); Executor + Independent Adjudicator to be designated.

**END B03-UCOS-MCF-CONSTRUCTION-ORCHESTRATION-MODEL — PHASE B03 · OPERATING MODEL (ROLES/OP-1..6) · WORKSTREAM
COORDINATION (CO-1..6) · MILESTONE GOVERNANCE (M0..M4 GATE EVENTS) · EVIDENCE LIFECYCLE (CE→VE→AE→IVE) ·
ACCEPTANCE/CERTIFICATION LIFECYCLE (AP-1/2/3 → M3 → M4 → HANDOVER) · CHANGE CONTROL (FORWARD-ONLY/VERSIONED/
SCOPE-LOCKED) · FAILURE/RECOVERY (FAIL-CLOSED / O-2/O-3) · **MCF ORCHESTRATION MODEL READY** · PLANNING ONLY ·
NO GOVERNANCE INVENTION / NO CODE / NO INFRA / NO TECH SELECTION / NO MUTATION · CONSTRUCTION LOCK + ARTICLE IX
REMAIN ACTIVE.**
