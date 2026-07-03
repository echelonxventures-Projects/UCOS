# UCOM-REMEDIATION-001 — UCOS Comprehensive Remediation Program Authorization

**Phase:** R0 — UCOM Remediation Program Authorization
**Artifact ID:** `UCOM-REMEDIATION-001`
**Mode:** **GOVERNANCE ONLY — NO IMPLEMENTATION.** Charters and authorizes a remediation *program*; writes no source, releases no lock, enrolls no invariant, mutates no frozen construct. Construction remains gated by Article IX and per-work-stream scoped authorizations.
**Authority:** Subordinate to `AUTH-001..012`, `UCOS-CONST-001`, `UCOS-ASR-NFR-001` (INV-1..13), Governance Baseline 1.0.0 (FROZEN). Terminal authority: UCOS Authority Board (AUTH-009).
**Date:** 2026-07-02

---

## 0. Input Baseline — Findings Reviewed (UA-01 … UA-10)

Program inputs are the **actually-recorded** universal-architecture audit findings. Three referenced phases are **not on record** and are treated as a baseline gap, not as passing results.

| Phase | Artifact | On record | Verdict / Finding consolidated |
|-------|----------|:---------:|--------------------------------|
| **UA-01** | `ARCH-GAP-001` | ✅ | **UCOS ARCHITECTURE INCOMPLETE** — 3 Critical (C1 missing/duplicated Audit primitive; C2 Intelligence/Simulation/Civilization not representable by the 9 primitives; C3 off-ledger authority chain), 5 Major (M1 Authority duplicated; M2 Evolution/lifecycle duplicated; M3 hard-coded policy predicates; M4 Memory bypasses Metadata; M5 ledger↔code divergence), 4 Minor |
| **UA-02** | *(none)* | ❌ | **NOT ON RECORD** — must be executed/located (baseline gap RL-018) |
| **UA-03** | `REG-ABS-001` | ✅ | **REGISTRY GAPS FOUND** — registry/metadata-absolute at object layer; permanent Class-A hard-coded floor (interpreter/crypto/storage/constitutional) + Class-B unrealized subjects |
| **UA-04** | `UNKNOWN-READINESS-001` | ✅ | **FUTURE ADAPTIVE** — substrate redesign NOT required; conditions **FA-C1..FA-C4** (additive-only discipline; maturity≠adaptivity; resolve INV-17 scope; define INV-18 determinism-quarantine contract) |
| **UA-05** | `INV-CORE-001` | ✅ | **DEFINED** — 14 canonical invariants (`INV-CORE-01..14`), each with Formal/Verification/Failure/Recovery; **not yet enrolled** (AUTH-012 act pending) |
| **UA-06** | `CIV-STRESS-001` | ✅ | **15 breakpoints / 17 bottlenecks** — first architectural BREAK at ~10⁶ users (in-memory single-node substrate; single Evolution commit path; absent Memory fabric); structural WALLs at 10⁹+ (single terminal authority; INV-5 single-SoR; INV-6 synchronous determinism) |
| **UA-07** | *(none)* | ❌ | **NOT ON RECORD** — must be executed/located (baseline gap RL-018) |
| **UA-08** | `AF-001` | ✅ | **FRAGILE ELEMENTS FOUND** — robust/resilient but not anti-fragile; fragile elements **AF-F-1..6**; missing mechanisms **AF-M-1..6** |
| **UA-09** | *(none)* | ❌ | **NOT ON RECORD** — must be executed/located (baseline gap RL-018) |
| **UA-10** | `UA-10-CERT-001` | ✅ | **ULTIMATE ARCHITECTURE NOT CERTIFIED** — B-1 (new-realities/INV-17/INV-18 vs INV-5/INV-6 unresolved), B-2 (Agents/Economies/Civilization/Memory unrealized), B-3 (UA-03 registry gaps) |

**Master root cause (appears in UA-01 C3, UA-06 §6.5, referenced by `PHASE-21`):** the authorization chain `AD-0016..AD-0023` sits **off the canonical `AUTH-012` ledger**, and `AD-0021` (Ontology) is contested; Memory was ratification-REJECTED yet is implemented. **No remediation can be cleanly authorized until this ledger is restored.** This is the program's prerequisite gate **P-0**.

---

## 1. Program Charter

**Program name:** UCOS Comprehensive Remediation Program (**UCOM**).
**Purpose:** Convert the consolidated UA-01..UA-10 findings into a single governed, traceable, prerequisite-ordered remediation program that removes every Critical and Major finding, discharges the recorded conditions, and drives each UA phase to a re-verifiable non-blocking verdict — **without redesigning the ratified substrate** (per UA-04) and **without violating Article IX** (no unauthorized construction).
**Problem statement:** UCOS is a correctness-complete, robust single-node control platform whose *architecture* is INCOMPLETE (duplicated governance primitives, an unrepresented Audit primitive, and behavioral fabrics outside the 9-primitive model), whose *governance ledger* is defective (off-ledger authority chain, ledger↔code drift), whose *scale envelope* breaks at ~10⁶ users, and which is *robust but not anti-fragile*.
**Mandate of this artifact:** authorize the *program, its governance, and its ledger only*. It does **not** authorize any code, technology selection, invariant enrollment, or lock release.

**Guiding principles (binding on all UCOM work):**
1. **Additive-only / zero substrate-core-dir change** (UA-04 FA-C1; `AD-0016`) — remediation touches `src/control/*` and governance records, never the five substrate core dirs; test baseline stays green.
2. **Governance-before-construction** — every construction item requires its own scoped Article-IX release (a future `AD-00xx`), granted only after P-0 and the item's design gate.
3. **Evidence-based, non-optimistic** — closure is proven by re-running the source UA phase to a recorded PASS, not by assertion.
4. **Append-only correction** — no destructive edits; supersede via forward migration; preserve all prior records (INV-10).
5. **Non-waivable controls preserved** — S1/S3/S4, INV-1..13, AD-0014 (Ω∞ deferral) are unaffected.

---

## 2. Program Scope

### 2.1 In scope (remediation work-streams)

| WS | Title | Source findings | Nature |
|----|-------|------------------|--------|
| **WS-0** | Governance Ledger Restoration (**prerequisite P-0**) | UA-01 C3; UA-06 §6.5; `PHASE-21` | Governance — enroll `AD-0016..0023` on `AUTH-012`, resolve contested `AD-0021`, reconcile Memory authorization |
| **WS-1** | Universal Primitive Consolidation (de-duplication) | UA-01 C1/M1/M2/M4/m1 | Design→construction (scoped) — collapse 6 audit logs → 1 Audit primitive; unify certification/ratification/revocation → 1 Authority primitive; unify state machines/lifecycle → Evolution/Lifecycle primitive; migrate Memory authorities onto `MetadataPort` |
| **WS-2** | Representation-Model Completion | UA-01 C2; UA-10 B-1/B-2 | Governance→design — add/represent an **Audit/Provenance** primitive; formally decide whether Intelligence & Simulation are new primitives or reductions; realize or formally scope Agents/Economies/Civilization |
| **WS-3** | State/Record Truth Reconciliation | UA-01 M5 | Governance — reconcile `PROJECT-STATE.md` with implemented reality (269/269 tests; Memory + Ontology present) |
| **WS-4** | Policy Extensibility | UA-01 M3 | Design→construction (scoped) — make the policy predicate vocabulary registry/metadata-extensible (remove the closed rule-type switch) |
| **WS-5** | Registry-Absolutism Closure | UA-03 (`REG-ABS-001`) | Governance→design — formally bound & document the Class-A hard-coded floor; plan realization of Class-B subjects |
| **WS-6** | Canonical-Invariant Enrollment & Invariant-Conflict Resolution | UA-05; UA-04 FA-C3/FA-C4; UA-10 B-1 | Governance (AUTH-012) — enroll `INV-CORE-01..14`; resolve INV-17 vs INV-5 and INV-18 vs INV-6 (determinism-quarantine contract) via the amendment path |
| **WS-7** | Scale-Ceiling Remediation | UA-06 BP-1..BP-15 | Design→construction (scoped) — durable/sharded persistence adapters (BP-1), partitioned Evolution ledger (BP-2), Memory fabric (BP-3), delegated/federated authority (BP-5/10/12/14), partitioned governance (BP-6/11/13/15) |
| **WS-8** | Anti-Fragility Uplift | UA-08 AF-F-1..6 / AF-M-1..6 | Design→construction (scoped) — behavioral reputation, adaptive thresholds, auto-quarantine, failure→governed-hardening feedback, unified integrity primitive, automated halt-recovery, durable persistence |
| **WS-9** | Assessment-Baseline Completion | UA-02, UA-07, UA-09 absent | Governance/analysis — execute or locate the three missing UA phases so the audit baseline is complete before program certification |

### 2.2 Out of scope (explicitly excluded)
- Any source-code construction under this artifact (each construction WS requires a separate scoped `AD-00xx` release).
- Release of the Article IX generation lock; modification of `UCOS-CONSTRUCTION-BLOCKED`.
- Enrollment of existential invariants INV-14..20 or any change to INV-1..13 outside the governed amendment path (WS-6 *proposes*, the Authority Board *disposes*).
- Technology/vendor/cloud selection beyond the ratified ADRs.
- Any modification of the five substrate core dirs (`meta-core`, `registry-runtime`, `metadata-runtime`, `configuration-runtime`, `contracts`).

---

## 3. Success Criteria

| ID | Criterion | Measure |
|----|-----------|---------|
| SC-1 | **All Critical findings closed** | UA-01 C1/C2/C3 → re-audit PASS (0 Critical) |
| SC-2 | **All Major findings closed** | UA-01 M1..M5 → re-audit PASS (0 Major) |
| SC-3 | **Governance ledger restored** | `AD-0016..0023` enrolled on `AUTH-012`; 0 off-ledger authorizations; contested `AD-0021` resolved |
| SC-4 | **Duplication eliminated** | Exactly **one** Audit, one Authority (cert/ratify/revoke), one Evolution-Lifecycle, one Federation primitive that all fabrics compose (audit-log implementations: 6 → 1) |
| SC-5 | **Representation set complete or bounded** | Audit/Provenance represented as a primitive; Intelligence/Simulation either reduced to primitives or formally enrolled as additional primitives with governance sign-off |
| SC-6 | **State truth reconciled** | `PROJECT-STATE.md` matches implemented reality; 0 drift on next audit |
| SC-7 | **Canonical invariants enrolled** | `INV-CORE-01..14` enrolled (AUTH-012) or dispositioned; INV-17/INV-18 conflicts resolved or formally deferred with recorded rationale |
| SC-8 | **Scale breakpoints dispositioned** | BP-1..BP-15 each: remediated (design ratified + scoped-authorized) OR formally accepted as a governed limit with recorded rationale |
| SC-9 | **Anti-fragility uplift dispositioned** | AF-M-1..6 each: designed + scoped-authorized OR formally deferred; AF-F-1..3 (Major) remediated |
| SC-10 | **Assessment baseline complete** | UA-02, UA-07, UA-09 on record with recorded verdicts |
| SC-11 | **Invariants preserved throughout** | 0 change to INV-1..13; 0 substrate-core-dir change; test baseline green at every gate; AD-0014 intact |

---

## 4. Exit Criteria

The UCOM program is **CLOSED** only when **all** hold:

- **EX-1** — SC-1..SC-11 satisfied and independently verified.
- **EX-2** — Every Remediation Ledger item (§8) is `CLOSED` or `ACCEPTED-AS-GOVERNED-LIMIT` with a recorded Authority-Board disposition; **0 items OPEN or BLOCKED**.
- **EX-3** — All ten UA phases (UA-01..UA-10) have been **re-executed** and each returns a **non-blocking** verdict (COMPLETE / CERTIFIED / PASS / ACCEPTED-WITH-CONDITIONS), replacing the current INCOMPLETE / GAPS-FOUND / NOT-CERTIFIED / FRAGILE verdicts — or the residual is a formally accepted governed limit.
- **EX-4** — A closure certificate (`UCOM-CERT-001`, produced under §7) is ratified by the Authority Board.
- **EX-5** — No Critical or Major finding remains open across the audit set; residual Minor findings are individually accepted.
- **EX-6** — Governance integrity confirmed: ledger restored (P-0), append-only preserved, INV-1..13 unchanged, Article IX status explicitly re-stated (released or still-active per a separate Board act — **not** by this program).

---

## 5. Governance Structure

**Cadence & artifacts.** UCOM proceeds work-stream by work-stream, each producing: a **design/governance proposal** → **independent review** → **Authority-Board disposition** (recorded in `AUTH-012`) → for construction WS, a **scoped Article-IX release** → **implementation** (out of scope here) → **re-audit** → **closure entry** in the Remediation Ledger.

**Gates (every WS deliverable must pass):**
| Gate | Enforces |
|------|----------|
| `GATE-DOC-001` | Documentation/traceability completeness |
| `GATE-QUAL-001` | Additive-only, test-baseline-green, zero substrate-core-dir change |
| `GATE-SEC-001` | Non-waivable S1/S3/S4 preserved |
| **UCOM-GATE-LEDGER** | P-0 satisfied before any dependent WS is authorized |
| **UCOM-GATE-REAUDIT** | Source UA phase re-run to a recorded non-blocking verdict before an item is `CLOSED` |

**Prerequisite ordering (dependency DAG):**
```
WS-0 (P-0 ledger restoration)  ─┬─▶ WS-1  Primitive consolidation
                                ├─▶ WS-3  State reconciliation
                                ├─▶ WS-6  Invariant enrollment
                                └─▶ WS-7  Scale remediation ──▶ WS-8 Anti-fragility uplift
WS-2 (representation model) ──▶ WS-1 / WS-5
WS-9 (missing audits) ──▶ program certification (EX-3)
```
No construction work-stream may begin before **WS-0 (P-0)** closes.

**Roles (governance only; no new authority created):**
- **Authority Board (AUTH-009)** — terminal disposition of every proposal, ledger entry, and scoped release.
- **Independent Reviewer** — audits each WS deliverable and re-runs the source UA phase (no self-certification).
- **Program Steward** — maintains the Remediation Ledger (§8) append-only and reports status; holds no authority to close items.
- **Fabric Owners** — single-owner accountability per fabric for their WS-1/WS-7/WS-8 items.

---

## 6. Authority Structure

- **Terminal authority:** UCOS Authority Board (AUTH-009). This charter delegates **no** terminal authority.
- **This artifact authorizes:** the *program*, its *governance structure*, its *ledger*, and the *planning/design/review* activities of WS-0..WS-9. It is itself an **Approval-Required Operation** (AD-0009) requiring Board adoption to take effect.
- **This artifact does NOT authorize:** any code, any Article-IX release, any invariant enrollment, or any technology selection. Each construction item (WS-1, WS-4, WS-7, WS-8) is separately gated on a **scoped Article-IX release** (`AD-00xx`), issued only after P-0 and that item's design ratification, and **revocable** on any substrate-core-dir breach (mirrors `UCOS-ART9-REL-001` §6).
- **Prerequisite over all authority acts:** **P-0 (WS-0)** — until `AD-0016..0023` are enrolled on the canonical `AUTH-012` ledger and `AD-0021` is resolved, the Board may authorize **only** WS-0, WS-2 (governance/design), WS-3, WS-5 (governance/design), WS-6 (deliberation), and WS-9. All construction authorizations are held.
- **Escalation:** every UCOM decision resolves upward to the Authority Board; no self-granted authority; non-waivable S1/S3/S4 and INV-1..13 are outside any UCOM authority to alter.

---

## 7. Certification Framework

**Per-item certification (UCOM-GATE-REAUDIT).** A ledger item reaches `CLOSED` only when:
1. Its remediation deliverable passes `GATE-DOC/QUAL/SEC-001`; **and**
2. The **source UA phase is re-executed** and returns a recorded non-blocking verdict for that finding; **and**
3. An **independent review** confirms closure (no self-certification); **and**
4. The **Authority Board** ratifies the closure (recorded in `AUTH-012` + the Remediation Ledger).

**Governed-limit acceptance.** An item that is architecturally sound to leave unremediated (e.g., UA-03 Class-A floor; certain UA-06 WALLs tied to INV-5/INV-6/physics; deferred existential scope under AD-0014) may be dispositioned `ACCEPTED-AS-GOVERNED-LIMIT` with a recorded Board rationale — this is a valid closure state, not a defect, provided it is explicit and traceable.

**Program certification (`UCOM-CERT-001`).** Issued when EX-1..EX-6 hold. It must render a decision matrix over: (a) UA-01..UA-10 re-verdicts; (b) Critical/Major/Minor residual counts; (c) ledger-restoration proof; (d) invariant-preservation proof (INV-1..13 unchanged; 0 substrate-core-dir change; baseline green); (e) Article-IX status statement. Certification is **evidence-based and non-optimistic**; a single unresolved Critical or an OPEN/BLOCKED ledger item withholds certification.

**Re-verification cadence.** UA-04 **FA-C1** (0 core-dir change; baseline green) is a **standing gate** re-affirmed at every UCOM milestone, not only at closure.

---

## 8. Remediation Ledger

Status legend: `OPEN` · `BLOCKED` (awaiting prerequisite) · `IN-DESIGN` · `AUTHORIZED` (scoped release granted) · `CLOSED` · `ACCEPTED` (governed limit). All items initialize per prerequisite; nothing is implemented by this artifact.

| RL # | Finding (source) | Sev | WS | Prerequisite | Closure test | Init status |
|------|------------------|:---:|:--:|--------------|--------------|:-----------:|
| **RL-001** | Off-ledger authority chain `AD-0016..0023`; `AD-0021` contested (UA-01 C3) | **Critical** | WS-0 | — (P-0 root) | AUTH-012 shows all AD enrolled; 0 off-ledger; `AD-0021` resolved | OPEN |
| RL-002 | Memory ratification REJECTED but implemented (UA-01 C3; UA-06) | Critical | WS-0 | RL-001 | Clean Memory authorization enrolled; re-run UA (MEM-RAT) PASS | BLOCKED |
| RL-003 | Audit/Provenance not a primitive; 6 parallel audit logs (UA-01 C1) | Critical | WS-1/WS-2 | RL-001 | One Audit primitive; audit-log impls 6→1; UA-01 re-audit: C1 cleared | BLOCKED |
| RL-004 | Intelligence/Simulation/Civilization not representable by the 9 primitives (UA-01 C2; UA-10 B-1/B-2) | Critical | WS-2 | RL-001 | Board disposition: reduced to primitives OR enrolled as new primitives; UA-01 C2 cleared | BLOCKED |
| RL-005 | Authority (cert/ratify/revoke) duplicated per fabric (UA-01 M1) | Major | WS-1 | RL-001, RL-003 | One universal Authority primitive; 5→1 cert, 4→1 ratify, 5→1 revoke | BLOCKED |
| RL-006 | Evolution/lifecycle & state machines duplicated (UA-01 M2) | Major | WS-1 | RL-001 | One Evolution/Lifecycle primitive; 4→1 state machines | BLOCKED |
| RL-007 | Hard-coded, closed policy predicate switch (UA-01 M3) | Major | WS-4 | RL-001 | New predicate addable via registry/metadata, 0 core change; UA-01 M3 cleared | BLOCKED |
| RL-008 | Memory authorities bypass `MetadataPort` (in-process Maps) (UA-01 M4) | Major | WS-1 | RL-002 | Memory authorities persisted as metadata records; parity with knowledge/evolution | BLOCKED |
| RL-009 | `PROJECT-STATE.md` ↔ code divergence (UA-01 M5) | Major | WS-3 | RL-001 | Ledger matches reality (269/269; Memory+Ontology present); 0 drift | OPEN |
| RL-010 | Registry Class-A hard-coded floor + Class-B unrealized (UA-03) | Major | WS-5 | RL-001 | Class-A bounded & documented; Class-B realization plan ratified OR ACCEPTED | BLOCKED |
| RL-011 | Canonical invariants `INV-CORE-01..14` defined but unenrolled (UA-05) | Major | WS-6 | RL-001 | AUTH-012 enrollment or explicit disposition | BLOCKED |
| RL-012 | INV-17 vs INV-5 & INV-18 vs INV-6 unresolved (UA-04 FA-C3/C4; UA-10 B-1) | Major | WS-6 | RL-011 | Determinism-quarantine contract + reality-scope clarification ratified OR formally deferred | BLOCKED |
| RL-013 | Scale BREAK at ~10⁶ — in-memory single-node substrate (UA-06 BP-1) | Major | WS-7 | RL-001 | Durable/sharded adapter behind ports designed + scoped-authorized OR ACCEPTED | BLOCKED |
| RL-014 | Single serialized Evolution commit path; unpartitioned ledger (UA-06 BP-2) | Major | WS-7 | RL-006 | Partitioned Evolution ledger design ratified OR ACCEPTED | BLOCKED |
| RL-015 | Absent Memory fabric at scale (UA-06 BP-3) | Major | WS-7 | RL-002 | Memory fabric implemented+validated under clean authorization OR ACCEPTED | BLOCKED |
| RL-016 | Structural authority/governance WALLs at 10⁹+ (UA-06 BP-5/6/10/11/12/13/14/15) | Major | WS-6/WS-7 | RL-011, RL-012 | Delegated/federated authority + partitioned governance dispositioned (design OR ACCEPTED-AS-GOVERNED-LIMIT) | BLOCKED |
| RL-017 | Not anti-fragile; fragile elements AF-F-1..6; missing AF-M-1..6 (UA-08) | Major | WS-8 | RL-013 | AF-F-1..3 remediated; AF-M-1..6 designed+scoped-authorized OR deferred | BLOCKED |
| RL-018 | UA-02 / UA-07 / UA-09 not on record (baseline gap) | Major | WS-9 | RL-001 | Three phases executed/located with recorded verdicts | OPEN |
| RL-019 | UA-01 Minor findings m1..m4 (federation guards; descriptor kinds; config validation; ontology typing) | Minor | WS-1/WS-4 | RL-003 | Each remediated OR individually ACCEPTED | BLOCKED |
| RL-020 | ULTIMATE certification withheld (UA-10 B-1/B-2/B-3 rollup) | Critical (rollup) | all | RL-004, RL-010, RL-012, RL-015 | UA-10 re-run → CERTIFIED or ACCEPTED-WITH-CONDITIONS | BLOCKED |

**Ledger rollup at authorization:** 20 items — **4 Critical**, **13 Major**, **1 Minor**, **2 rollup/baseline**; **3 OPEN** (RL-001, RL-009, RL-018 — all executable immediately, no prerequisite beyond P-0 itself for RL-001), **remainder BLOCKED on P-0**. `0 CLOSED` (nothing implemented by this artifact).

---

## 9. Determination

> **UCOM REMEDIATION PROGRAM — AUTHORIZED (GOVERNANCE ONLY).**
>
> The consolidated UA-01..UA-10 findings are chartered into a single prerequisite-ordered remediation program (WS-0..WS-9) with a 20-item Remediation Ledger, success/exit criteria, governance and authority structures, and an evidence-based certification framework. The program is **gated on P-0 (governance-ledger restoration)**; no construction work-stream may begin before P-0 closes, and every construction item requires its own scoped Article-IX release. This authorization writes no code, releases no lock, enrolls no invariant, and mutates no frozen construct.
>
> **Baseline caveat:** UA-02, UA-07, and UA-09 are **not on record**; program certification (EX-3) cannot complete until they are executed (RL-018).

## 10. Governance / Non-Mutation Statement

No source code, infrastructure, or authorization was produced; no lock released; no invariant enrolled; no frozen construct modified. `INV-1..13`, `AUTH-012` substance, `AD-0014` (Ω∞ deferral), the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged. This artifact is an Approval-Required Operation (AD-0009) and takes effect only upon Authority-Board adoption.

## 11. Traceability
- **Consumes:** `ARCH-GAP-001` (UA-01), `REG-ABS-001` (UA-03), `UNKNOWN-READINESS-001` (UA-04), `INV-CORE-001` (UA-05), `CIV-STRESS-001` (UA-06), `AF-001` (UA-08), `UA-10-CERT-001` (UA-10), `PHASE-21-CONSTITUTIONAL-RECONCILIATION-REPORT`.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001`, `UCOS-ASR-NFR-001` (INV-1..13), Governance Baseline 1.0.0.
- **Refined by:** WS-0..WS-9 proposals, scoped `AD-00xx` releases, and `UCOM-CERT-001` (program closure).
- **Owner:** UCOS Authority Board (adoption & terminal disposition); Program Steward (ledger maintenance, append-only).

**END `UCOM-REMEDIATION-001` — PHASE R0 · REMEDIATION PROGRAM AUTHORIZED (GOVERNANCE ONLY) · 8 CHARTER SECTIONS · 20-ITEM LEDGER (4 CRITICAL / 13 MAJOR / 1 MINOR / 2 ROLLUP) · GATED ON P-0 · NO IMPLEMENTATION · NO LOCK RELEASE · NO FROZEN-CONSTRUCT MUTATION.**
