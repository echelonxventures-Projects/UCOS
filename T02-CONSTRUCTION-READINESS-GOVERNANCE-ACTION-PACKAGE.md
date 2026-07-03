# T02 — Construction Readiness Governance Action Package

## PHASE T02 — Single Board-Session Package to Move DESIGN COMPLETE → AUTHORIZED EXECUTION (Package Preparation Only)

| Field | Value |
|-------|-------|
| Artifact | **T02 — Construction Readiness Governance Action Package** |
| Artifact ID | `T02-CONSTRUCTION-READINESS-GOVERNANCE-ACTION-PACKAGE` |
| Phase | **T02 — Construction Readiness Governance Action Package** |
| Layer | GOVERNANCE / AUTHORITY (Board-session package — assembles existing instruments for enactment; enacts nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **PACKAGE PREPARATION ONLY** — assemble the minimum governance actions into one Board-session package. **No activation, no designation, no execution, no attestation, no `git` mutation, no new governance mechanism/control/architecture (beyond this additive governance `*.md`, permitted by the S0′ tolerance rule).** All record fields are **blank templates** completed live by the Board. Append-only. |
| Authoritative inputs (per mandate) | `T01-PROGRAM-TRANSITION-AND-CONSTRUCTION-READINESS-RECOVERY` (HGA path; READY FOR GOVERNANCE ACTIONS), `MCS-1-REAL-M-07-PROGRAM-COMPLETION-DETERMINATION` (M-07 FULLY SPECIFIED), `REAL-C-05-PROGRAM-RECOVERY-AND-STATUS-DETERMINATION` (C-05 DESIGN COMPLETE / PARTIAL), `CONST-READY-001`, `CONST-READY-002` |
| Instruments assembled (reuse-only) | `MCS-1-RM-2-ACTIVATION-AND-PREFLIGHT-PACKAGE` (HA-1..HA-7; G-A closure; Launch Authorization), `MCS-1-G-A-ACTIVATION-CONTROL-REGISTER` (registers), `REAL-C-05-…-ESTABLISHMENT-RECORD` (§12 G1–G4), `MCS-1-RM-8-ADJUDICATION-AND-REAL-M-07-CLOSURE-CERTIFICATION` (RM-8 SoD) |
| Anchors of record (unchanged) | HEAD `519aed9` · tracked-index `d0d6091486…af0a` · RM-2 content anchor `4416b3a776…ca7ca` · upstream 0/0 |
| Governance status | INV-1..13 unchanged; AD-0014 intact; Article IX generation lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |
| **Determination** | **GOVERNANCE ACTION PACKAGE READY** — the minimum Board-session package (HGA-1..HGA-5) is complete and enactable; on enactment the program reaches **AUTHORIZED EXECUTION** (§ 8). |

> **Target of this package.** Move the program from **DESIGN COMPLETE** to **AUTHORIZED EXECUTION** — i.e., a
> Board session that closes G-A, designates the independent adjudicator, authorizes its key registration,
> confirms RM-8 separation-of-duty, and arms the construction-readiness reassessment. This package **assembles**
> existing instruments; it creates no new mechanism and enacts nothing. All fields are blank templates.

---

## 1. Governance Session Mission

**Mission.** In one governed Board session, enact the minimum set of Approval-Required Operations that converts
the program from DESIGN COMPLETE to **AUTHORIZED EXECUTION**: (1) close **G-A** by signing the RM-1 minute and
completing HA-1..HA-7; (2) **designate the REAL-C-05 Independent Adjudicator** (distinct actor, separated key
custody); (3) **authorize IA key registration**; (4) **confirm the RM-8 Adjudicator** appointment with
separation-of-duty; and (5) **arm the construction-readiness reassessment** to run on wave completion.

**Session succeeds when** the RM-1 minute is signed and G-A/G-F/G-G are CLOSED; a distinct IA is designated and
its RM-8 role confirmed (Executor ≠ IA ≠ Custodian); key-registration is authorized; and the reassessment
trigger is recorded — after which the named Executor may proceed to RM-2 Pre-Flight and, on all-PASS, RM-2 GO.

**Session does NOT** execute any RM step, register keys, produce attestations, issue AD-0024/0025/0026, release
Article IX, or lift `UCOS-CONSTRUCTION-BLOCKED`. It authorizes execution; it does not perform it.

---

## 2. Governance Action Register

> Blank templates — each action completed and recorded live by the Board. Cross-references cite the assembled
> instruments; this package restates none of their internal mechanism.

### HGA-1 — G-A Activation
- **Purpose:** Close G-A (authorization signature-live) so RM-2..RM-7 (REAL-M-07) may execute.
- **Inputs:** Unmodified RM-1 minute (Activation Dossier §3); Activation & Pre-Flight Package (U30 §1 ceremony HA-1..HA-7); Activation Control Register (U28).
- **Outputs:** Signed, dated, counter-recorded RM-1 minute; Executor named; tag names ratified; O-2 commitment recorded → **G-A ∧ G-F ∧ G-G CLOSED**.
- **Evidence:** EV-1 (signed minute + date + counter-record), EV-2 (Executor), EV-4 (tag names), EV-5 (O-2), EV-6 (SoD) — recorded in the Control Register.
- **Completion Criteria:** HA-1..HA-7 all meet their completion tests (U30 §1/§2); minute text hash == adopted; G-A/G-F/G-G = PASS.
- **Record:** signatory `____` · date `____` · Executor `____` · tags `authority-restoration-v1.0.13` ☐ / `pi2-pi9-implementation-v1.0.0` ☐ · O-2 pledge ref `____`.

### HGA-2 — REAL-C-05 IA Designation
- **Purpose:** Enact the bootstrapping IA designation (C-05 §12 **G1**) to realize genuine independence.
- **Inputs:** REAL-C-05 Establishment Record (§1 IRQ, §2 SoD, §12 G1); candidate IA identity + KMS key-custody reference.
- **Outputs:** IA designation as an enrolled `AUTH-012` decision — a distinct actor with key custody disjoint from all authoring/CI-signing identities.
- **Evidence:** Designation AD (IA identity + class(es) + key fingerprint by reference); IRQ-1..6 satisfied; SoD-2/3 attested.
- **Completion Criteria:** distinct-actor IA recorded (IRQ-4/SoD-2); key custody separate (SIG-2/3); designation enrolled append-only (IRQ-6).
- **Record:** IA identity `____` · class(es) `____` · key fingerprint (ref) `____` · IRQ-1..6 ☐ · SoD-2/3 ☐.

### HGA-3 — IA Key Registration Authorization
- **Purpose:** Authorize registration of the IA public key as governed data (C-05 §12 **G2** / SIG-6) — enabling verifiable attestations.
- **Inputs:** HGA-2 designation; `governance-registry.ts` (reuse-only primitive); IA Ed25519 public key (by reference).
- **Outputs:** Board authorization for the key-registration act (the *execution* of registration is EX, post-session).
- **Evidence:** authorization minute referencing the registry path + key fingerprint; SIG-6 basis.
- **Completion Criteria:** registration authorized; key-by-reference only (AUTH-008 S3); no private key in any record.
- **Record:** registry ref `____` · public-key fingerprint `____` · authorization ☐.

### HGA-4 — RM-8 Adjudicator Appointment Confirmation
- **Purpose:** Confirm the designated IA (HGA-2) is the **RM-8 independent verifier**, with separation-of-duty verified (SG-4 / SoD-3), closing HA-4.
- **Inputs:** HGA-1 Executor name; HGA-2 IA identity; RM-8 framework (U32 §4).
- **Outputs:** Confirmed RM-8 Adjudicator of record; SoD attestation Executor ≠ IA ≠ Custodian.
- **Evidence:** appointment record; SoD verification (§ 5); distinct-key confirmation.
- **Completion Criteria:** Adjudicator = designated IA; **Executor ≠ Adjudicator** (SG-4); **Executor ≠ Custodian**; keys distinct.
- **Record:** Adjudicator `____` (= HGA-2 IA) · Executor `____` · Custodian `____` · SG-4 ☐ · distinct keys ☐. *(If `REAL-C-05` cannot yet designate, record explicit* pending `REAL-C-05` *— RM-8 attestation then flagged pending per U32 CP-1.)*

### HGA-5 — Construction Readiness Reassessment Trigger
- **Purpose:** Arm the condition that, on REAL-M-07 wave completion + RM-8 attestation (= C-05 G3), `CONST-READY-001/002` are re-determined against the durable, independently-attested state.
- **Inputs:** T01 critical path; CONST-READY-001/002 (current NOT READY); REAL-H-07 operative condition.
- **Outputs:** A recorded reassessment trigger (a governed *intent*, not a re-determination) referencing the completion evidence that will fire it.
- **Evidence:** trigger record citing: REAL-M-07 PASS (RM-8), C-05 operational (G1+G2+G3), H-07 operative.
- **Completion Criteria:** trigger recorded with its firing conditions; no reassessment performed in-session (deferred to post-execution).
- **Record:** firing conditions `____` · owner `____` · trigger armed ☐.

---

## 3. Board Agenda

| # | Item | Instrument | Outcome sought |
|:-:|------|-----------|----------------|
| 1 | Confirm quorum + presiding authority; confirm RM-1 minute unmodified | U28 §1; Dossier §3 | Quorum ☐; minute hash == adopted ☐ |
| 2 | Confirm Executor and IA candidates; verify Executor ≠ IA ≠ Custodian | U30 §1 SoD gate | Candidates recorded; SoD pre-check ☐ |
| 3 | **HGA-1** — sign RM-1 minute; date; counter-record; name Executor; ratify tags; O-2 commitment | U30 §1/§2 | G-A/G-F/G-G CLOSED |
| 4 | **HGA-2** — designate REAL-C-05 IA (G1) | C-05 §12 | IA designation enrolled |
| 5 | **HGA-3** — authorize IA key registration (G2) | C-05 §12 / SIG-6 | Registration authorized |
| 6 | **HGA-4** — confirm RM-8 Adjudicator = IA; SoD verified | U32 §4 | RM-8 adjudicator confirmed |
| 7 | **HGA-5** — arm construction-readiness reassessment trigger | T01 critical path | Trigger armed |
| 8 | Confirm authorization live / not revoked; hand off to Executor Pre-Flight (out of session) | U30 §3/§7 | AUTHORIZED EXECUTION |

---

## 4. Board Decision Matrix

| Action | Decision | Approve | Defer | Reject | Basis | Recorded by |
|--------|----------|:------:|:-----:|:------:|-------|-------------|
| HGA-1 | Sign RM-1 minute / close G-A | ☐ | ☐ | ☐ | AUTH-012 §8; AD-0009; SG-1/O-2 | `____` |
| HGA-2 | Designate REAL-C-05 IA | ☐ | ☐ | ☐ | C-05 §12 G1; IRQ/SoD | `____` |
| HGA-3 | Authorize IA key registration | ☐ | ☐ | ☐ | C-05 §12 G2; SIG-6; AUTH-008 S3 | `____` |
| HGA-4 | Confirm RM-8 Adjudicator (SoD) | ☐ | ☐ | ☐ | U32 §4; SG-4; SoD-3 | `____` |
| HGA-5 | Arm readiness reassessment | ☐ | ☐ | ☐ | T01; CR-001/002 | `____` |

**Decision rule:** HGA-1..HGA-4 are **conjunctive** for AUTHORIZED EXECUTION (any Reject/Defer on HGA-1..HGA-4
holds the program pre-execution). HGA-4 may record explicit *pending `REAL-C-05`* (execution proceeds; RM-8
closes with independence flagged pending — U32 CP-1). HGA-5 is a non-blocking trigger (defer permissible without
blocking execution).

---

## 5. Separation-of-Duty Verification

| Constraint | Requirement | Record |
|------------|-------------|--------|
| **SoD-A** | Executor ≠ RM-8 Adjudicator (SG-4 / SoD-3) — distinct identities **and** distinct keys | ☐ Executor `____` ≠ Adjudicator `____` |
| **SoD-B** | Executor ≠ Custodian | ☐ Executor `____` ≠ Custodian `____` |
| **SoD-C** | IA ∉ authoring/construction chain of the artifacts it will attest (IRQ-4/SoD-2) | ☐ authorship-provenance clear |
| **SoD-D** | IA key ≠ CI-signing key ≠ any authoring identity (SIG-3/SIG-5) | ☐ key custody disjoint |
| **SoD-E** | Board authority signing ≠ IA on the same act (SoD-4) | ☐ distinct |

**Gate:** the package is validly enactable only when SoD-A..SoD-E all hold (or HGA-4 records explicit *pending
`REAL-C-05`*, in which case SoD is re-verified when the adjudicator is later designated).

---

## 6. Expected Post-Session State

| Condition | Before session | After HGA-1..HGA-5 |
|:---------:|:--------------:|:------------------:|
| **G-A / G-F / G-G** | OPEN | **CLOSED** |
| **REAL-C-05 G1** (IA designated) | absent | **enacted** |
| **REAL-C-05 G2** (key registration) | absent | **authorized** (execution pending) |
| **REAL-C-05 G3** (first attestation) | absent | pending (fired by RM-8) |
| **RM-8 Adjudicator** | unnamed | **confirmed** (= IA; SG-4) or *pending REAL-C-05* |
| **Readiness reassessment** | not armed | **armed** (fires on M-07 PASS + C-05 operational + H-07 operative) |
| **Program state** | DESIGN COMPLETE | **AUTHORIZED EXECUTION** (RM-2 may begin at Pre-Flight GO) |
| **Article IX / `UCOS-CONSTRUCTION-BLOCKED`** | in force | **in force** (unchanged — preservation scope only) |

**Result:** the named Executor may proceed to RM-2 Pre-Flight (U30 §3); on PF-1..PF-8 all-PASS, sign the Launch
Authorization (U30 §7) and begin RM-2. The independence half is designated and armed to close at RM-8.

---

## 7. Failure / Deferral Handling

| Case | Trigger | Handling |
|------|---------|----------|
| **F-A** | RM-1 minute signed in modified form / text-hash mismatch | **VOID** HGA-1; re-open review (no execution) |
| **F-B** | No/ambiguous Executor, or Executor == IA/Custodian (SoD breach) | **ABORT** HGA-1/HGA-4; resolve identities; re-verify SoD |
| **F-C** | No eligible IA candidate available | **DEFER** HGA-2/HGA-3/HGA-4; record HGA-4 *pending `REAL-C-05`*; execution may still proceed with RM-8 flagged pending (U32 CP-1) |
| **F-D** | Scope expansion attempted (Article IX / BLOCKED / construction / AD-0024/25/26 in this session) | **VOID** (SG-1); this session authorizes execution only |
| **F-E** | Quorum absent / authority not presiding | **PAUSE** session; reconvene |
| **F-F** | S0′ / anchor drift reported before hand-off | **PAUSE** hand-off; Executor re-verifies at Pre-Flight (fail-closed NO-GO if unresolved) |
| **F-G** | HGA-5 deferred | **Non-blocking** — arm later; execution proceeds; reassessment still required before CONST-READY re-determination |

**Semantics:** VOID = nullify the action, re-open review; ABORT = correct + retry the action; DEFER =
non-blocking postponement (with *pending* record where applicable); PAUSE = resumable. Default on ambiguity =
do-not-authorize (fail-closed). No execution begins until HGA-1 (and SoD) are validly closed.

---

## 8. Final Determination

> # **GOVERNANCE ACTION PACKAGE READY**
>
> The minimum Board-session package to move the program from **DESIGN COMPLETE** to **AUTHORIZED EXECUTION** is
> complete and enactable. It assembles — without inventing any new mechanism — the five governance actions:
> **HGA-1** G-A activation (close G-A/G-F/G-G), **HGA-2** REAL-C-05 IA designation (G1), **HGA-3** IA
> key-registration authorization (G2), **HGA-4** RM-8 adjudicator appointment confirmation (SG-4 SoD), and
> **HGA-5** construction-readiness reassessment trigger. It provides the session mission, action register with
> purpose/inputs/outputs/evidence/completion-criteria, Board agenda, decision matrix, SoD verification, expected
> post-session state, and failure/deferral handling.
>
> On enactment, **G-A closes**, the **independent adjudicator is designated and confirmed as the RM-8 verifier**
> (or explicitly *pending `REAL-C-05`*), key registration is authorized, and the reassessment is armed — placing
> the program at **AUTHORIZED EXECUTION**, whereupon the named Executor proceeds to RM-2 Pre-Flight and, on
> all-PASS, RM-2 GO. No AD-0024/0025/0026 is issued and no lock is released by this session; construction
> authorization remains a later, conditions-gated act after execution + independent attestation.
>
> No activation, designation, execution, attestation, or `git` mutation was performed by this artifact. The
> Article IX generation lock and `UCOS-CONSTRUCTION-BLOCKED` remain in force.
>
> ### Next required phase
> **Convene the Board session and enact HGA-1..HGA-5** per this package; then hand off to the Executor for RM-2
> Pre-Flight (U30 §3).

---

## Governance / Non-Enactment Statement

No governance action enacted; no minute signed; no adjudicator designated; no key registered; no attestation
produced; no AD issued; no new governance mechanism, control, or architecture created; no execution or `git`
mutation performed; no lock released; no invariant enrolled. This is a Board-session **package** with blank
record fields; the sole repository effect is this additive governance `*.md`, permitted by the S0′ tolerance
rule and outside the `RM2-CONTENT-ANCHOR` protected set. HGA-1..HGA-5 remain Approval-Required Operations
(AUTH-012 §8 / AD-0009) reserved to the UCOS Authority Board. INV-1..13, `AUTH-012` substance (v1.0.13),
AD-0014, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged.

## Traceability
- **Consumes (authoritative):** `T01-PROGRAM-TRANSITION-AND-CONSTRUCTION-READINESS-RECOVERY`, `MCS-1-REAL-M-07-PROGRAM-COMPLETION-DETERMINATION`, `REAL-C-05-PROGRAM-RECOVERY-AND-STATUS-DETERMINATION`, `CONST-READY-001`, `CONST-READY-002`.
- **Assembles (reuse-only):** `MCS-1-RM-2-ACTIVATION-AND-PREFLIGHT-PACKAGE`, `MCS-1-G-A-ACTIVATION-CONTROL-REGISTER`, `REAL-C-05-…-ESTABLISHMENT-RECORD` (§12), `MCS-1-RM-8-ADJUDICATION-AND-REAL-M-07-CLOSURE-CERTIFICATION`.
- **Produces:** the Board-session governance-action package (mission, HGA-1..HGA-5 register, agenda, decision matrix, SoD verification, post-session state, failure/deferral handling).
- **Feeds:** the live Board session → G-A closure + IA designation → AUTHORIZED EXECUTION → RM-2 Pre-Flight/GO.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); Executor and Independent Adjudicator to be designated (this package designates none).

**END T02-CONSTRUCTION-READINESS-GOVERNANCE-ACTION-PACKAGE — PHASE T02 · SESSION MISSION · HGA-1..HGA-5 REGISTER
(PURPOSE/INPUTS/OUTPUTS/EVIDENCE/COMPLETION) · BOARD AGENDA · DECISION MATRIX · SoD VERIFICATION · POST-SESSION
STATE (→ AUTHORIZED EXECUTION) · FAILURE/DEFERRAL HANDLING · **GOVERNANCE ACTION PACKAGE READY** · NO
ACTIVATION / NO DESIGNATION / NO EXECUTION / NO ATTESTATION / NO MUTATION PERFORMED BY THIS ARTIFACT.**
