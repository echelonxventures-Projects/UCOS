# CONST-READY-002 — Final Construction Readiness Determination

## PHASE U9 — Terminal Readiness Synthesis (blocker-vs-condition classification of the five open findings)

| Field | Value |
|-------|-------|
| Artifact | **CONST-READY-002 — Final Construction Readiness Determination** |
| Artifact ID | `CONST-READY-002` |
| Phase | **U9 — Final Construction Readiness Determination** |
| Layer | GOVERNANCE / ASSURANCE (terminal readiness synthesis — determines only; audits nothing anew) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **FINAL DETERMINATION ONLY** — classify the five open findings as *blockers* or *conditions* and fix the readiness verdict. **No new audit, no architecture review, no governance redesign, no new control, no new framework, no code, no authorization, no lock release.** Prior findings are assumed known and are **not** re-reproduced. Append-only. |
| Authoritative inputs (per mandate) | **`CONST-READY-001`**, **`REAL-C-05`**, **`REAL-M-03`**, **`REAL-C-01`**, **`REAL-H-07`**, **`REAL-M-07`**, **`REAL-M-07-REMEDIATION-PLAN`** |
| Governing discipline | Non-optimistic, fail-closed. **A finding is a *blocker* only if it prevents construction from safely beginning; otherwise it is a *condition* tracked to a later gate.** Absence of executed closure = OPEN (analysis ≠ closure). |
| Governance status | INV-1..13 unchanged; INV-14..20 NOT enrolled; AD-0014 intact; Article IX generation lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. This determination releases nothing. |
| **Determination** | **NOT READY** — two decisive findings remain **open and un-executed**: `REAL-M-07` (durability = **FAIL**) and `REAL-C-05` (independent adjudication = **PARTIAL / 0 attestations**). `REAL-M-03` is documentarily reconciled (no longer a construction blocker); `REAL-C-01` and `REAL-H-07` are conditions. A short, known minimum closure sequence (§ MCS) converts this to READY WITH CONDITIONS. |

> **State delta since `CONST-READY-001`.** Phases U8.1–U8.6 **advanced the analysis** (M-03 reconciled, C-01
> reconciled, H-07 gate defined, M-07 durability audited, M-07 remediation planned) but **executed no closure**:
> the corpus is still uncommitted (`REAL-M-07` FAIL), no independent adjudicator is designated (`REAL-C-05`
> PARTIAL), and no gate is wired. Under the non-optimism rule, *analysis is not closure* — the executed
> readiness posture has not materially changed. This is why the verdict remains NOT READY, not READY WITH
> CONDITIONS.

---

## 1. Per-Finding Determination (blocker vs condition)

Each finding is classified against the sharpened question the mandate poses: **does it *prevent* construction
from safely beginning, or *impose a condition*?** "Before X?" columns state whether the finding must be CLOSED
prior to that milestone.

### REAL-C-05 — Independent Adjudication Authority
| Attribute | Determination |
|-----------|---------------|
| **Current Status** | **PARTIAL** — mechanism fully established (`REAL-C-05` §1–§11); genuine independence **not realized** (no G1 designation, 0 signed attestations). |
| **Blocking?** | **YES** |
| **Reason** | Universal review predecessor — element (6) of every realization unit. Without an operational distinct-actor adjudicator, any construction produces only *self-attestable* output; it cannot be defensibly ratified. Safe construction requires a ratifiable outcome. |
| **Before Construction?** | **YES** — operationalize C-05 (`REAL-C-05` G1 designation + G3 first attestation) before construction begins. |
| **Before Certification?** | **YES** — dual-witness (`REAL-C-05` §10) + IA-1..IA-4 (`REAL-C-01` §6). |
| **Before AD-0024?** | **YES** — `CONST-READY-001` D-4 condition C-a (PI-10 review re-attested independently). |
| **Before AD-0025?** | **YES** — presupposed by the independent ECON A3 review (`AUTH-CONST-001` §4). |
| **Before AD-0026?** | **YES** — presupposed by the independent CIV A3 review + A4 finding (`AUTH-CONST-001` §5). |

### REAL-M-03 — Ledger & Project-State Reconciliation
| Attribute | Determination |
|-----------|---------------|
| **Current Status** | **PARTIALLY RECONCILED** — canonical state fixed (§2); the C-1 PROJECT-STATE append performed; **documentary U2.1 divergence CLOSED**. Residual is *evidentiary* (independent attestation of self-attested facts; suite-count 36-vs-40; terminal-cert re-issue). |
| **Blocking?** | **NO** |
| **Reason** | The universal-predecessor requirement (state == reality) is **documentarily satisfied**; `REAL-M-03` §6 explicitly removes M-03 from the first-wave blocker set (leaving C-05, H-07, M-07). The remainder is a certification-grade *condition*, not a construction preventer. |
| **Before Construction?** | **NO** — documentary reconciliation is done; construction may proceed against the fixed canonical state. |
| **Before Certification?** | **YES** — residual independent attestation (T-04/T-05/T-14) + suite-count re-measurement (T-02). |
| **Before AD-0024?** | **YES** — U2.1 acceptance is `CONST-READY-001` D-4 condition C-b (Board acceptance act). |
| **Before AD-0025?** | **YES** — same U2.1 acceptance predicate. |
| **Before AD-0026?** | **YES** — same. |

### REAL-C-01 — Terminal Certification Reconciliation
| Attribute | Determination |
|-----------|---------------|
| **Current Status** | **PARTIALLY RECONCILED** — level **CONDITIONALLY CERTIFIED** VALID; R14 record stale (not valid as written); re-issue `UCOM-ULTIMATE-CERT-002` + IA-1..IA-4 pending. |
| **Blocking?** | **NO** |
| **Reason** | Certification-layer only. A stale terminal instrument does not prevent additive construction; it blocks an *honest ULTIMATE claim*. Pure condition-before-certification. |
| **Before Construction?** | **NO**. |
| **Before Certification?** | **YES** — re-issue against reconciled state (`REAL-C-01` RC-1..RC-5) + independent attestation. |
| **Before AD-0024?** | **NO** — not an AD-0024 authorization predicate (`CONST-READY-001` D-4 lists C-a..C-d; terminal-cert re-issue is not among them). |
| **Before AD-0025?** | **NO**. |
| **Before AD-0026?** | **NO**. |

### REAL-H-07 — Pre-Construction Enrollment Gate
| Attribute | Determination |
|-----------|---------------|
| **Current Status** | **PARTIAL** — gate fully defined; **not operative** (unwired; depends on C-05 operational + M-07 durability). PASS-gate G-1..G-4 open. |
| **Blocking?** | **NO (conditional)** |
| **Reason** | The gate is the *mechanism* that makes construction defensible. Its **minimum enroll-with-durability discipline** is satisfied procedurally by executing `REAL-M-07` RM-2 (authorization-of-record committed first, atomically) + elevating `AUTH-CONST-001` A6 to a hard E4∧E5 precondition (G-1). Full CI automation (G-2) is a hardening required before *broad/automated* construction, not the earliest-safe *manual, governed* scope. It imposes a condition, it does not permanently prevent. |
| **Before Construction?** | **YES (procedural minimum only)** — G-1 (procedural gate) in force + G-4 (durability via M-07). Full CI wiring (G-2) required before broad construction, not the earliest-safe scope. |
| **Before Certification?** | **YES** — authorization-integrity + retro-enrollment attestation (IA-2) underpin the constitutional-integrity premise. |
| **Before AD-0024?** | **YES** — `CONST-READY-001` D-4 condition C-c (H-07 gate active). |
| **Before AD-0025?** | **YES** — same. |
| **Before AD-0026?** | **YES** — same. |

### REAL-M-07 — Repository Integrity & Durability
| Attribute | Determination |
|-----------|---------------|
| **Current Status** | **FAIL** — 431 untracked + 7 modified-uncommitted; 0/138 src tracked; 0/8 AD tracked; canonical `AUTH-012` v1.0.13 uncommitted. Remediation **planned** (`REAL-M-07-REMEDIATION-PLAN`: YES, restorable) but **not executed**. |
| **Blocking?** | **YES** |
| **Reason** | The hard, present, physical preventer. Constructing now adds non-durable work onto a non-durable base whose *authorization-of-record is one working-tree loss from erasure*. Zero-trust fail-closed forbids beginning construction on a FAIL-durable corpus. |
| **Before Construction?** | **YES** — execute `REAL-M-07-REMEDIATION-PLAN` RM-1..RM-6 (durability FAIL→PASS). |
| **Before Certification?** | **YES** — durable, reproducible evidence corpus (RR-5). |
| **Before AD-0024?** | **YES** — `CONST-READY-001` D-4 condition C-d (AD-0024 must enroll into a durable ledger). |
| **Before AD-0025?** | **YES** — same. |
| **Before AD-0026?** | **YES** — same. |

---

## 2. Output 1 — Final Readiness Matrix

| Finding | Status | Blocking? | Before Construction | Before Certification | Before AD-0024 | Before AD-0025 | Before AD-0026 |
|---------|:------:|:---------:|:-------------------:|:--------------------:|:--------------:|:--------------:|:--------------:|
| **REAL-C-05** Independent adjudication | PARTIAL | **YES** | YES | YES | YES | YES | YES |
| **REAL-M-03** State reconciliation | PARTIALLY RECONCILED | **NO** | NO | YES | YES | YES | YES |
| **REAL-C-01** Terminal cert reconciliation | PARTIALLY RECONCILED | **NO** | NO | YES | NO | NO | NO |
| **REAL-H-07** Pre-construction gate | PARTIAL | **NO (cond.)** | YES (procedural min.) | YES | YES | YES | YES |
| **REAL-M-07** Durability | **FAIL** | **YES** | YES | YES | YES | YES | YES |

**Reading:** two hard construction blockers (**REAL-M-07**, **REAL-C-05**); one documentarily-closed
(**REAL-M-03**); two conditions (**REAL-C-01** certification-only; **REAL-H-07** procedural condition riding on
M-07 + A6 elevation).

## 3. Output 2 — Construction Blocking Matrix

| Finding | Prevents construction start? | Basis |
|---------|:----------------------------:|-------|
| REAL-M-07 | **YES — hard preventer** | Non-durable corpus + non-durable authorization-of-record; fail-closed |
| REAL-C-05 | **YES — defensibility preventer** | No independent ratification ⇒ construction output not ratifiable (element 6) |
| REAL-H-07 | **NO — condition** | Minimum discipline satisfied by M-07 RM-2 + A6-as-gate (G-1); full CI (G-2) pre-broad only |
| REAL-M-03 | **NO — closed** | Documentary U2.1 reconciliation done; removed from blocker set |
| REAL-C-01 | **NO — certification-layer** | Stale terminal record does not prevent additive construction |

**Construction-blocking set = { REAL-M-07, REAL-C-05 }.**

## 4. Output 3 — Certification Blocking Matrix

| Finding | Blocks certification? | Closure required for certification |
|---------|:---------------------:|-----------------------------------|
| REAL-C-05 | **YES** | Operational C-05 (G1–G4) + dual-witness + IA-1..IA-4 |
| REAL-M-03 | **YES** | Independent attestation of self-attested facts + suite-count (T-02) |
| REAL-C-01 | **YES** | Re-issue `UCOM-ULTIMATE-CERT-002` (RC-1..RC-5) + IA |
| REAL-H-07 | **YES** | Retro-enrollment attestation (IA-2) + gate operative |
| REAL-M-07 | **YES** | Durable, reproducible evidence corpus (RM-1..RM-6) |

**All five block certification.** Certification is strictly downstream of construction here.

## 5. Output 4 — AD-0024 Eligibility Determination (PI-10 Intelligence)
- **Verdict:** **ISSUABLE-WITH-CONDITIONS** (unchanged from `CONST-READY-001` D-4; no re-audit).
- **Required closures (conjunctive):** REAL-C-05 operational **and** PI-10 review re-attested by the independent actor (C-a) · REAL-M-03 U2.1 acceptance (C-b) · REAL-H-07 gate active (C-c) · REAL-M-07 corpus committed/durable (C-d).
- **Not required:** REAL-C-01 terminal-cert re-issue (certification-layer, not an authorization predicate).
- **On C-a..C-d closed → AD-0024 issuable** as a scoped, parallel-eligible release (`AUTH-CONST-001` §3). Until then **HELD**.

## 6. Output 5 — AD-0025 Eligibility Determination (PI-13 Economy)
- **Verdict:** **NOT ISSUABLE** (unchanged; `AUTH-CONST-001` §4 / `CONST-READY-001` D-5).
- **Required closures:** all of {C-05, M-03, H-07, M-07} **plus** an **independent constitutional review of the `ECON-*` set + ECON-001 (A3)** — which itself presupposes operational REAL-C-05.
- **Sequence:** close C-05 → perform ECON A3 review → then AD-0025. (ECON A3 is outside these five findings and remains outstanding.)

## 7. Output 6 — AD-0026 Eligibility Determination (Civilization)
- **Verdict:** **NOT ISSUABLE** (unchanged; `AUTH-CONST-001` §5 / `CONST-READY-001` D-6).
- **Required closures:** all of {C-05, M-03, H-07, M-07} **plus** an **independent CIV A3 review** **and** an **explicit AD-0014-boundary finding (A4)** recording the release as bounded, non-actuating, simulation-object only, INV-14..20 untouched.
- **Sequence:** close C-05 → perform CIV A3 review + A4 finding → then AD-0026.

## 8. Output 7 — Earliest Safe Construction Scope (post minimum-closure)
Once the §MCS closures land, the earliest **safe** construction scope (in increasing risk) is:
1. **CW-2 primitive convergence** — `REAL-H-03`, **additive**, no new authorization (proceeds under the standing scoped-release envelope), **escalate-if-redesign**.
2. **PI-11 Simulation** — `REAL-H-01`, under the **standing AD-0022** (SIM-COND-1..7); additive over the frozen substrate; no new Article IX release.

**Explicitly NOT in the earliest safe scope:** PI-10 Intelligence (needs AD-0024 C-a..C-d), Economy/Civilization construction (need AD-0025/AD-0026 with A3/A4 reviews), infrastructure provisioning, the full Article IX release (`REAL-C-03`), and any product-layer build (`REAL-C-04`).

## 9. Output 8 — Earliest Safe Operational Scope
**NONE YET — operational scope remains NOT READY** and is **outside** the five findings' closure. Infrastructure
provisioning (`REAL-C-02` G12-1) additionally requires **`REAL-M-04`** (PE-12 observability ADR) and
**`REAL-M-06`** (quantitative NFR floors) — neither exists — plus standing **AD-0015** evidence carve-out +
per-act **AD-0009** spend approvals. Closing {C-05, M-03, H-07, M-07} does **not** unlock operations; operations
wait on {M-04, M-06} + spend authorization. (Stated for completeness; not part of this determination's closure set.)

---

## 10. Final Determination

> ## CONST-READY-002 — **NOT READY**
>
> Construction is **NOT READY** to begin. Of the five findings, **two remain open, un-executed, and
> construction-blocking**: **`REAL-M-07` (durability = FAIL)** — the corpus and its authorization-of-record are
> non-durable, forbidding safe construction on a fail-closed base — and **`REAL-C-05` (PARTIAL)** — no
> operational independent adjudicator exists, so no construction output could be defensibly ratified.
> **`REAL-M-03`** is documentarily reconciled and **no longer a construction blocker**; **`REAL-C-01`** is a
> certification-layer condition; **`REAL-H-07`** is a condition whose minimum discipline is satisfied by the
> M-07 remediation plus elevating the existing `AUTH-CONST-001` A6 step to a gate. The U8 phases advanced the
> *analysis* to completion but **closed no blocker** — under non-optimism, that leaves the executed posture at
> NOT READY.
>
> The gap to READY WITH CONDITIONS is **short, known, and uses only already-defined acts** (no new control, no
> new framework, no new audit): execute the durability remediation, adopt the procedural gate, and operationalize
> the already-established independent-adjudication mechanism. All three are governed Board acts, not new
> engineering.

### MINIMUM CLOSURE SEQUENCE (MCS) — to become READY WITH CONDITIONS

| # | Closure act | Uses (already defined) | Flips |
|:-:|-------------|------------------------|-------|
| **MCS-1** | Execute `REAL-M-07-REMEDIATION-PLAN` **RM-1..RM-6** (authorize → commit authorization-of-record first/atomic → commit impl → commit evidence → push → tag) | `REAL-M-07-REMEDIATION-PLAN` | `REAL-M-07` **FAIL→PASS**; satisfies `REAL-H-07` **G-4** (durability) + the RM-2 no-split enroll-with-durability discipline |
| **MCS-2** | Adopt `REAL-H-07` **G-1** — elevate `AUTH-CONST-001` **A6** to a hard **E4∧E5** precondition of construction admission (procedural gate) | `REAL-H-07` §7/§9 | `REAL-H-07` minimum in force (condition met for earliest-safe scope) |
| **MCS-3** | Enact `REAL-C-05` **G1** (Board designates independent adjudicator + KMS key custody) **and G3** (first signed attestation) | `REAL-C-05` §12 | `REAL-C-05` **PARTIAL→operational**; enables defensible ratification |

**On MCS-1..MCS-3 CLOSED → status becomes READY WITH CONDITIONS.** The **CW-0 scope then authorized to begin**
is exactly §8: **CW-2 primitive convergence (`REAL-H-03`, additive, escalate-if-redesign)** and **PI-11
Simulation (standing `AD-0022`)** — with these **tracked residual conditions** (not construction-blocking):
`REAL-C-01` terminal-cert re-issue, `REAL-M-03` residual independent attestation + suite-count re-measurement,
full `REAL-H-07` CI wiring (G-2) before broad/automated construction, and the AD-0024 C-a..C-d closures before
any PI-10 build. Operations and Economy/Civilization/product remain fail-closed pending {M-04, M-06} and the
AD-0025/AD-0026 A3/A4 reviews respectively.

> Final determination only — no new audit, no architecture review, no governance redesign, no new control/
> framework, no code, no authorization, no lock release. INV-1..13, AD-0014, and the Article IX generation lock
> are unchanged; `UCOS-CONSTRUCTION-BLOCKED` stands.

### OUTPUT

**`CONST-READY-002` — FINAL CONSTRUCTION READINESS = **NOT READY** · CONSTRUCTION-BLOCKING SET = { REAL-M-07
(FAIL, DURABILITY), REAL-C-05 (PARTIAL, INDEPENDENT ADJUDICATION) } · REAL-M-03 DOCUMENTARILY CLOSED (NOT
BLOCKING) · REAL-C-01 + REAL-H-07 = CONDITIONS · ALL FIVE BLOCK CERTIFICATION · AD-0024 ISSUABLE-WITH-CONDITIONS
(C-05 ∧ M-03-ACCEPT ∧ H-07-ACTIVE ∧ M-07-DURABLE + PI-10 RE-ATTEST) · AD-0025 NOT ISSUABLE (+ECON A3) · AD-0026
NOT ISSUABLE (+CIV A3 +A4) · EARLIEST SAFE CONSTRUCTION = CW-2 CONVERGENCE (REAL-H-03) + PI-11 (AD-0022) ·
EARLIEST SAFE OPERATIONS = NONE (NEEDS M-04 + M-06 + SPEND) · MINIMUM CLOSURE SEQUENCE = [MCS-1 EXECUTE M-07
REMEDIATION RM-1..6 → MCS-2 ADOPT H-07 A6-GATE → MCS-3 ENACT C-05 G1+G3] → READY WITH CONDITIONS · NO NEW AUDIT
/ NO ARCHITECTURE REVIEW / NO GOVERNANCE REDESIGN / NO NEW CONTROL / NO NEW FRAMEWORK / NO CODE / NO
AUTHORIZATION / NO LOCK RELEASE.**

---

## 11. Governance / Non-Mutation Statement

No source code, infrastructure, or authorization was produced; no audit re-run; no lock released; no invariant
enrolled; no frozen/ratified construct modified; no new control, framework, or audit created. This is a terminal
readiness determination synthesizing already-authoritative findings. INV-1..13, `AUTH-012` substance (v1.0.13),
AD-0014, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged. Every closure act named
(MCS-1..MCS-3; AD-0024/0025/0026 issuance; certification) remains an Approval-Required Operation (AUTH-012 §8 /
AD-0009) reserved to the UCOS Authority Board.

## 12. Traceability
- **Consumes (authoritative):** `CONST-READY-001` (D-1..D-7 baseline readiness), `REAL-C-05` (PARTIAL; G1–G4),
  `REAL-M-03` (PARTIALLY RECONCILED; §6 blocker-set reduction), `REAL-C-01` (PARTIALLY RECONCILED; RC/IA),
  `REAL-H-07` (PARTIAL; OO-map; G-1..G-4), `REAL-M-07` (FAIL; RR-1..RR-8), `REAL-M-07-REMEDIATION-PLAN`
  (RM-1..RM-8; YES).
- **Supersedes (as readiness determination of record):** `CONST-READY-001`'s aggregate "NOT READY" — refined
  here with the blocker-vs-condition classification and the explicit MCS.
- **Sequences with:** `ROADMAP-ULT-001` (U2.1 done; CW-2/CW-3 waves), `AUTH-CONST-001` (AD-0024/0025/0026 envelopes; A1–A7).
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Refined by:** the prospective Board acts MCS-1..MCS-3, then the CW-0 construction and its independent ratification.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); independent adjudicator to be designated (`REAL-C-05`).

**END CONST-READY-002 — PHASE U9 · FINAL CONSTRUCTION READINESS DETERMINATION · VERDICT: NOT READY · BLOCKERS
{ REAL-M-07, REAL-C-05 } · MCS → READY WITH CONDITIONS (CW-2 CONVERGENCE + PI-11) · DETERMINATION ONLY · NO NEW
AUDIT / NO ARCHITECTURE REVIEW / NO GOVERNANCE REDESIGN / NO NEW CONTROL / NO NEW FRAMEWORK.**

---

## 13. PHASE U9 COMPLETION ADDENDUM — Mandated Outputs 9–10 + CW-0 Closure Column

> **Append-only completion.** This addendum carries the three mission-mandated items not literally present in
> §§1–12: (a) the per-finding **"Closure Required Before CW-0?"** determination, (b) **Output 9 — Exact CW-0
> Entry Criteria**, and (c) **Output 10 — Exact CW-0 Exit Criteria**. It changes **no verdict** — the
> determination remains **NOT READY → READY WITH CONDITIONS on MCS-1..MCS-3** — and introduces no new audit,
> control, framework, or authorization. It only makes the already-derived closures explicit against CW-0.

### 13.1 Per-Finding Closure-Before-CW-0 (completes the mission's 7-attribute evaluation)

Restated in the exact YES/NO shape the mission asks for. "Blocking Construction" and "Blocking CW-0" are the
same physical question here (CW-0 **is** the first construction wave), so they agree.

| Finding | Status | Block Construction? | Block Certification? | Block AD-0024? | Block AD-0025? | Block AD-0026? | **Closure Required Before CW-0?** |
|---------|:------:|:-------------------:|:--------------------:|:--------------:|:--------------:|:--------------:|:---------------------------------:|
| **REAL-C-05** Independent adjudication | PARTIAL | **YES** | YES | YES | YES | YES | **YES** — MCS-3 (`REAL-C-05` **G1 + G3**) |
| **REAL-M-03** State reconciliation | PARTIALLY RECONCILED | **NO** | YES | YES | YES | YES | **NO** — documentarily closed; residual is certification-grade |
| **REAL-C-01** Terminal cert reconciliation | PARTIALLY RECONCILED | **NO** | YES | NO | NO | NO | **NO** — certification-layer only |
| **REAL-H-07** Pre-construction gate | PARTIAL | **NO (cond.)** | YES | YES | YES | YES | **YES (procedural minimum only)** — MCS-2 (`REAL-H-07` **G-1**) + **G-4** via M-07; full **G-2** CI = pre-*broad*, not CW-0 |
| **REAL-M-07** Durability | **FAIL** | **YES** | YES | YES | YES | YES | **YES** — MCS-1 (`REAL-M-07-REMEDIATION-PLAN` **RM-1..RM-8**) |

**Closure-required-before-CW-0 set = { REAL-M-07 (RM-1..RM-8), REAL-C-05 (G1+G3), REAL-H-07 (G-1 + G-4) }.**
`REAL-M-03` and `REAL-C-01` are **not** CW-0 preconditions; they ride to the certification gate.

---

### 13.2 Output 9 — EXACT CW-0 ENTRY CRITERIA (all conjunctive; fail-closed)

CW-0 (earliest-safe scope = **CW-2 primitive convergence `REAL-H-03`** + **PI-11 Simulation** under standing
`AD-0022`) **may begin** only when **every** predicate below is CLOSED and independently verified. Each is an
already-defined act; none is new work.

| # | Entry criterion | Source | Verifiable evidence of closure |
|:-:|-----------------|--------|--------------------------------|
| **E-1** | **Durability act authorized** — DO-NOT-PUSH posture released for this scope by minuted Board decision | `REAL-M-07-REMEDIATION-PLAN` **RM-1** | `AUTH-012` decision minute citing `REAL-M-07` FAIL + `REAL-M-03` C-9; scope = preservation only |
| **E-2** | **Authorization-of-record durable** — ledger + index + registry + state + AD-0016..0023 + AUTH-REST/CONST/GOV-REC committed **atomically and first** (no-split invariant O-1) | **RM-2** | Single commit containing AD **and** its `AUTH-012` enrollment; content-hash reconciles |
| **E-3** | **Implementation + evidence durable** — `platform-runtime/**`, architecture/**, then PI*/ONTO*/MEM*/U-phase/UCOM-*/REAL-*/CONST-READY committed | **RM-3, RM-4** | Commits exist; working tree clean (0 untracked material corpus, 0 modified-uncommitted) |
| **E-4** | **Corpus pushed + milestone-tagged + reconciled** — branch pushed; authority-restoration tag @ RM-2, implementation tag @ RM-3; stale `main` side-line reconciled | **RM-5, RM-6, RM-7** | `git` remote head == ratified corpus head; tags resolve; +4 Phase-9 audits reconciled |
| **E-5** | **`REAL-M-07` FAIL → PASS** (durability closed) and thereby **`REAL-H-07` G-4** CLOSED for the standing corpus | **RM outcome; `REAL-H-07` G-4** | Reproduced clean tree; enrolled head == pushed head |
| **E-6** | **Procedural gate in force** — `AUTH-CONST-001` **A6** adopted as a hard **E4∧E5** precondition of construction admission | MCS-2 / `REAL-H-07` **G-1** | Board-adopted gate record; admission checklist references A6 |
| **E-7** | **Independent adjudicator operational** — Board-enacted IA designation (distinct actor, KMS custody disjoint from author/CI keys) **and** ≥1 signed, verified attestation (chain genesis) | MCS-3 / `REAL-C-05` **G1 + G3** (G2 key-registration implied) | Enrolled `AUTH-012` IA decision; `governance-registry.ts` holds IA public key; one attestation verifies under SIG-4 |
| **E-8** | **Independent durability verification** — distinct-actor attestation that pushed tags == ratified corpus | **RM-8** (`REAL-C-05`) | Signed IA attestation over the tagged corpus |
| **E-9** | **Standing scope envelope intact** — additive-only; `AD-0022` SIM-COND-1..7 honored for PI-11; no new Article IX release; INV-1..13 / AD-0014 / generation lock unchanged | `AUTH-CONST-001` §3; `AD-0022` | Scope statement confirms additive, non-actuating, no-redesign |

**Entry gate:** E-1 ∧ E-2 ∧ E-3 ∧ E-4 ∧ E-5 ∧ E-6 ∧ E-7 ∧ E-8 ∧ E-9. Any single OPEN predicate holds CW-0
closed. **E-1..E-5 ≡ MCS-1; E-6 ≡ MCS-2; E-7 (+E-8) ≡ MCS-3.**

---

### 13.3 Output 10 — EXACT CW-0 EXIT CRITERIA (all conjunctive; fail-closed)

CW-0 is **complete** — and its output ratifiable — only when **every** predicate below holds. Exit does **not**
release the Article IX lock, issue any AD, or award certification; those remain downstream Approval-Required
Operations.

| # | Exit criterion | Basis | Verifiable evidence of closure |
|:-:|----------------|-------|--------------------------------|
| **X-1** | **Scope delivered additively** — `REAL-H-03` primitive convergence and PI-11 simulation artifacts produced with **no redesign** of frozen architecture/governance (escalate-if-redesign honored) | §8; `AUTH-CONST-001` §3 | Deliverables present; diff is additive; no frozen construct mutated |
| **X-2** | **Every transition enrolled through the operative gate** — each construction act passed `REAL-H-07` E4∧E5; ledger-continuity 1:1 with `AUTH-012` bumps (AU-4) | `REAL-H-07` G-1/AU-4 | Gate audit trail reconciles 1:1; no retroactive/unenrolled entry (F-6) |
| **X-3** | **Output durably persisted** — all CW-0 commits pushed and tagged; enrolled head == pushed head throughout (no non-durable residue) | `REAL-M-07` discipline; O-2/O-3 | Clean reproduced tree; remote head current; forward-only history |
| **X-4** | **Independently attested** — the CW-0 deliverables and their enrollment carry ≥1 distinct-actor signed attestation verified under SIG-4 (no self-attested output) | `REAL-C-05` §6/§7; element (6) | IA attestation(s) over CW-0 corpus verify; author-chain-signed reviews rejected by SIG-5 |
| **X-5** | **Standing conditions maintained** — `AD-0022` SIM-COND-1..7 satisfied for PI-11; additive envelope unbroken; INV-1..13, AD-0014, generation lock, `UCOS-CONSTRUCTION-BLOCKED` unchanged | `AD-0022`; `AUTH-CONST-001` §3 | Condition checklist closed; lock/invariant status unchanged |
| **X-6** | **Residual conditions carried forward, not silently closed** — `REAL-C-01` re-issue, `REAL-M-03` residual independent attestation + suite-count (T-02), full `REAL-H-07` **G-2** CI wiring recorded as OPEN pre-broad/pre-certification items | §2 conditions; §4 | Tracked-condition register updated; none marked closed without executed evidence |

**Exit gate:** X-1 ∧ X-2 ∧ X-3 ∧ X-4 ∧ X-5 ∧ X-6. On satisfaction, CW-0 is closed and its output is a durable,
independently-ratified, additive increment — **without** unlocking PI-10 (needs AD-0024 C-a..C-d),
Economy/Civilization (AD-0025/AD-0026 + A3/A4), operations (needs `REAL-M-04` + `REAL-M-06` + spend), or
certification (all five findings' certification-layer closures + IA-1..IA-4).

---

### 13.4 Addendum determination (unchanged verdict)

> **CONST-READY-002 remains NOT READY.** Completing Outputs 9–10 confirms rather than alters the verdict:
> the CW-0 **entry** gate has three OPEN conjuncts today (`REAL-M-07` E-1..E-5, `REAL-H-07` E-6, `REAL-C-05`
> E-7/E-8), which are exactly **MCS-1..MCS-3**. Execute those three governed Board acts → **READY WITH
> CONDITIONS**, authorizing CW-0 = **CW-2 primitive convergence (`REAL-H-03`) + PI-11 (`AD-0022`)** to begin,
> bounded by the X-1..X-6 exit gate and the tracked residual conditions. No architecture review, no governance
> redesign, no new framework, no new audit.

**END CONST-READY-002 · PHASE U9 COMPLETION ADDENDUM — OUTPUTS 9–10 + CW-0 CLOSURE COLUMN COMPLETE · VERDICT
UNCHANGED: NOT READY → READY WITH CONDITIONS ON [MCS-1 M-07 RM-1..8 · MCS-2 H-07 G-1 · MCS-3 C-05 G1+G3] · CW-0
ENTRY = E-1..E-9 · CW-0 EXIT = X-1..X-6 · CLOSURE-BEFORE-CW-0 SET = { REAL-M-07, REAL-C-05, REAL-H-07 (proc. min) }.**
