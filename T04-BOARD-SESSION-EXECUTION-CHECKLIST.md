# T04 — Board Session Execution Checklist

## PHASE T04 — Human-Operational Run-Sheet to Conduct the Governance Session (Checklist Only)

| Field | Value |
|-------|-------|
| Artifact | **T04 — Board Session Execution Checklist** |
| Artifact ID | `T04-BOARD-SESSION-EXECUTION-CHECKLIST` |
| Phase | **T04 — Board Session Execution Checklist** |
| Layer | GOVERNANCE / OPERATIONS (operational run-sheet — how to conduct the session; enacts nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **OPERATIONAL CHECKLIST ONLY** — the exact human steps to conduct the Board session that enacts T02 (HGA-1..HGA-5). **No new governance, control, requirement, or architecture; no execution, designation, or activation; no `git` mutation (beyond this additive governance `*.md`, permitted by the S0′ tolerance rule).** All boxes are blank, completed live by the actors. Append-only. |
| Authoritative inputs (per mandate) | `T02-CONSTRUCTION-READINESS-GOVERNANCE-ACTION-PACKAGE` (HGA-1..HGA-5; agenda; decision matrix; SoD; post-session state), `T03-AUTHORIZED-EXECUTION-READINESS-CONFIRMATION` (NO REMAINING DESIGN BLOCKERS; caveats CC-1..3) |
| Instruments at the table (reuse-only) | RM-1 minute (Dossier §3), `MCS-1-RM-2-ACTIVATION-AND-PREFLIGHT-PACKAGE`, `MCS-1-G-A-ACTIVATION-CONTROL-REGISTER`, `REAL-C-05-…-ESTABLISHMENT-RECORD` (§12), `MCS-1-RM-8-ADJUDICATION-AND-REAL-M-07-CLOSURE-CERTIFICATION` |
| Anchors of record (unchanged) | HEAD `519aed9` · tracked-index `d0d6091486…af0a` · RM-2 content anchor `4416b3a776…ca7ca` · upstream 0/0 |
| Governance status | INV-1..13 unchanged; AD-0014 intact; Article IX generation lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |
| **Determination** | **BOARD SESSION READY** — the session can be conducted end-to-end using this checklist alone (§ Final Determination). |

> **Operating caveats carried from T03 (observe throughout — not new requirements):**
> **CC-1** the signed minute and IA designation are recorded as **session records** and enrolled **append-only as
> the first RM-2 action** (post-Pre-Flight) — **do not** pre-write them into any of the 32 protected inputs, or
> PF-5 mismatches (NO-GO). **CC-2** the C-05 designation is committed **within the M-07 wave** for durability.
> **CC-3** the IA designation takes a **non-reserved** AD/`GOV-REC` id (AD-0024/25/26 are reserved).

---

## 1. Session Prerequisites

- [ ] **P-1** Quorum of the UCOS Authority Board confirmed; presiding authority identified.
- [ ] **P-2** Custodian (Chief Authority Architect) present.
- [ ] **P-3** Executor candidate identified and available.
- [ ] **P-4** Independent Adjudicator (IA) candidate identified **or** decision to record *pending `REAL-C-05`* prepared.
- [ ] **P-5** RM-1 minute (Dossier §3) available **verbatim, unmodified**; adopted-text hash on hand for comparison.
- [ ] **P-6** T02 package + T03 confirmation available at the table; CC-1..3 understood.
- [ ] **P-7** Activation Control Register (U28) open for live recording; append-only medium ready.
- [ ] **P-8** Machine determinants confirmed live (or scheduled for Executor Pre-Flight immediately after session): HEAD `519aed9`, tracked-index `d0d6091486…af0a`, content anchor `4416b3a776…ca7ca`, upstream 0/0.
- [ ] **P-9** No scope-expansion items on the agenda (no Article IX release, no AD-0024/25/26 issuance, no lock lift) — SG-1.

---

## 2. Required Participants

| Role | Present? | Identity (record) | SoD note |
|------|:--------:|-------------------|----------|
| **Presiding Board authority** (signs HA-1) | ☐ | `____________` | ≠ IA on same act (SoD-4) |
| **Custodian / Chief Authority Architect** (counter-records HA-2) | ☐ | `____________` | ≠ Executor |
| **Executor** (runs RM-2..RM-7; HA-3/HA-7) | ☐ | `____________` | ≠ IA (SG-4), ≠ Custodian |
| **Independent Adjudicator** (IA / RM-8) | ☐ or *pending* | `____________` | ≠ Executor; distinct key; ∉ authoring chain |
| **Recorder** (enrolls register entries) | ☐ | `____________` | — |

- [ ] **PT-1** Executor ≠ IA ≠ Custodian confirmed (or IA *pending* recorded).

---

## 3. Required Evidence (must be present to proceed)

- [ ] **E-1** RM-1 minute verbatim + adopted-text hash.
- [ ] **E-2** IA candidate identity + KMS key-custody reference + public-key fingerprint (or *pending* note).
- [ ] **E-3** Authorship-provenance check for the IA (IRQ-4/SoD-2) — IA not in authoring chain of targets.
- [ ] **E-4** Two ratified tag names on hand: `authority-restoration-v1.0.13`, `pi2-pi9-implementation-v1.0.0`.
- [ ] **E-5** O-2 commitment wording ready for the Executor (only `add`/`commit`/`push`/`tag`).
- [ ] **E-6** Next non-reserved AD/`GOV-REC` id available for the IA designation (CC-3).
- [ ] **E-7** Anchors-of-record sheet (HEAD/tree/tracked-index/content-anchor/upstream) for the hand-off.

---

## 4. HGA-1 Execution Checklist — G-A Activation

- [ ] **H1-1** Confirm the §3 minute text is **unmodified**; enrolled/target text hash == adopted hash.
- [ ] **H1-2** **HA-1** Presiding authority **signs** the minute (attributable, dated).
- [ ] **H1-3** **HA-6** Record the **decision date** (AUTH-012 §9 sequential).
- [ ] **H1-4** **HA-2** Custodian **counter-records** (identity + date).
- [ ] **H1-5** **HA-3** Name the **Executor** (in minute + authorization record) — single, unambiguous.
- [ ] **H1-6** **HA-5** Ratify the **two tag names** verbatim (no variance).
- [ ] **H1-7** **HA-7** Executor records the **O-2 commitment**.
- [ ] **H1-8** Confirm authorization **not revoked**; record EV-1/EV-2/EV-4/EV-5/EV-6 in the Control Register.
- [ ] **H1-9** Verify **G-A ∧ G-F ∧ G-G = CLOSED** (U30 §2 closure logic).
- [ ] **H1-CC1** Confirm the signed minute is held as a **session record** for append-only enrollment at RM-2 — **not** written into any of the 32 protected inputs now (CC-1).

*Stop conditions:* modified minute / hash mismatch → **VOID** (F-A); no/ambiguous Executor or SoD breach → **ABORT** (F-B); scope expansion → **VOID** (F-D).

---

## 5. HGA-2 Execution Checklist — REAL-C-05 IA Designation (G1)

- [ ] **H2-1** Confirm IA candidate meets **IRQ-1..6** (distinct identity, distinct key custody, competence, no authorship on target, reproduction capability, ledger standing).
- [ ] **H2-2** Confirm **SoD-2/SoD-3**: IA ∉ authoring/construction chain; IA key ≠ CI-signing ≠ any authoring key.
- [ ] **H2-3** Record the IA identity, class(es) (`IA-GOV`/`IA-SEC`/`IA-IMP`/`IA-OPS`), and public-key **fingerprint by reference** (AUTH-008 S3 — no private key anywhere).
- [ ] **H2-4** Assign a **non-reserved** AD/`GOV-REC` id for the designation (CC-3).
- [ ] **H2-5** Record the designation as an **`AUTH-012` decision** (session record; enrolled append-only within the M-07 wave — CC-1/CC-2).
- [ ] **H2-6** Confirm **G1** satisfied (distinct actor + separated key custody designated by governed act).

*If no eligible IA:* record explicit **_pending `REAL-C-05`_** (H2 deferred; proceed — RM-8 will be flagged pending per U32 CP-1). *Do not* designate an authoring-chain actor (SIG-5 would reject the attestation).

---

## 6. HGA-3 / HGA-4 Execution Checklist — Key Registration Authorization + RM-8 Adjudicator Confirmation

**HGA-3 — IA Key Registration Authorization (G2)**
- [ ] **H3-1** Confirm the IA public key to register (fingerprint from H2-3).
- [ ] **H3-2** **Authorize** registration via `governance-registry.ts` (SIG-6) — *authorization only; the registration act itself is post-session execution (EX)*.
- [ ] **H3-3** Record registry reference + key fingerprint; confirm **key-by-reference** only.

**HGA-4 — RM-8 Adjudicator Appointment Confirmation**
- [ ] **H4-1** Confirm the RM-8 Adjudicator **= the designated IA** (HGA-2), or record *pending `REAL-C-05`*.
- [ ] **H4-2** Verify **SoD-A** Executor ≠ Adjudicator (distinct identities **and** keys).
- [ ] **H4-3** Verify **SoD-B** Executor ≠ Custodian.
- [ ] **H4-4** Verify **SoD-C/D** IA ∉ authoring chain; IA key disjoint from CI/authoring keys.
- [ ] **H4-5** Verify **SoD-E** Board signing authority ≠ IA on the same act.
- [ ] **H4-6** Record the RM-8 Adjudicator of record (EV-3) + SoD attestation (EV-6).

*Stop condition:* any SoD constraint unsatisfiable → **ABORT/DEFER**; if unresolved, record HGA-4 *pending `REAL-C-05`* (execution proceeds; RM-8 flagged pending).

---

## 7. HGA-5 Trigger Conditions — Construction-Readiness Reassessment

- [ ] **H5-1** Record the reassessment **trigger** (a governed intent; **not** a re-determination performed now).
- [ ] **H5-2** State the **firing conditions** — all must later hold:
  - [ ] REAL-M-07 = **PASS** (RM-8 verified)
  - [ ] REAL-C-05 = **operational** (G1 + G2 + G3 first attestation)
  - [ ] REAL-H-07 = **operative** (M-07 durable ∧ C-05 operational ∧ wiring authorized)
- [ ] **H5-3** Name the **owner** responsible for firing the CONST-READY-001/002 re-determination when conditions hold.
- [ ] **H5-4** Confirm **no reassessment is performed in-session** (deferred to post-execution); trigger **armed**.

*HGA-5 is non-blocking:* it may be deferred without blocking AUTHORIZED EXECUTION (F-G).

---

## 8. Session Completion Criteria

The session is **COMPLETE** when all hold (or the explicit *pending* branch is recorded):

- [ ] **C-1** HGA-1 closed: minute signed/dated/counter-recorded; Executor named; tags ratified; O-2 recorded → **G-A/G-F/G-G CLOSED**.
- [ ] **C-2** HGA-2 enacted: IA designated (distinct actor + separated key) **or** *pending `REAL-C-05`* recorded.
- [ ] **C-3** HGA-3 authorized: IA key registration authorized (if IA designated).
- [ ] **C-4** HGA-4 confirmed: RM-8 Adjudicator = IA with SoD verified **or** *pending* recorded.
- [ ] **C-5** HGA-5 armed: reassessment trigger recorded with firing conditions + owner.
- [ ] **C-6** All entries enrolled **append-only** in the Activation Control Register; CC-1 honored (no pre-write into the 32 inputs).
- [ ] **C-7** No scope expansion occurred (SG-1); Article IX lock + `UCOS-CONSTRUCTION-BLOCKED` still in force.
- [ ] **C-8** Hand-off sheet issued to the Executor (anchors + signed-minute ref + O-2 pledge ref) for **RM-2 Pre-Flight** (U30 §3).

**Post-session state (expected):** program at **AUTHORIZED EXECUTION** — the named Executor proceeds to RM-2
Pre-Flight (PF-1..PF-8); on all-PASS, signs the Launch Authorization (U30 §7) and begins RM-2.

---

## Final Determination

> # **BOARD SESSION READY**
>
> The session can be conducted end-to-end from this checklist alone. It specifies prerequisites (§ 1), required
> participants with SoD notes (§ 2), required evidence (§ 3), the HGA-1 G-A activation steps (§ 4), the HGA-2
> REAL-C-05 IA designation steps (§ 5), the HGA-3/HGA-4 key-registration + RM-8 SoD confirmation steps (§ 6), the
> HGA-5 reassessment trigger conditions (§ 7), and the session completion criteria (§ 8) — with the T03 caveats
> CC-1..3 carried as operating notes and explicit *pending `REAL-C-05`* branches where a distinct IA is not yet
> available. On completion, the program reaches **AUTHORIZED EXECUTION** and hands off to the Executor's RM-2
> Pre-Flight.
>
> This is an operational checklist only — all boxes are blank. No governance, control, requirement, or
> architecture was created; no activation, designation, execution, or `git` mutation was performed. The Article
> IX generation lock and `UCOS-CONSTRUCTION-BLOCKED` remain in force.
>
> ### Next required phase
> **Conduct the Board session per this checklist** (enacting T02 HGA-1..HGA-5), then hand off to the Executor for
> RM-2 Pre-Flight.

---

## Governance / Non-Enactment Statement

No governance enacted; no minute signed; no adjudicator designated; no key registered; no attestation produced;
no AD issued; no new governance mechanism, control, requirement, or architecture created; no execution or `git`
mutation performed; no lock released; no invariant enrolled. This is an operational **checklist** with blank
boxes; the sole repository effect is this additive governance `*.md`, permitted by the S0′ tolerance rule and
outside the `RM2-CONTENT-ANCHOR` protected set. HGA-1..HGA-5 remain Approval-Required Operations (AUTH-012 §8 /
AD-0009). INV-1..13, `AUTH-012` substance (v1.0.13), AD-0014, the Article IX generation lock, and
`UCOS-CONSTRUCTION-BLOCKED` are unchanged.

## Traceability
- **Consumes (authoritative):** `T02-CONSTRUCTION-READINESS-GOVERNANCE-ACTION-PACKAGE`, `T03-AUTHORIZED-EXECUTION-READINESS-CONFIRMATION`.
- **Operationalizes (reuse-only):** RM-1 minute, `MCS-1-RM-2-ACTIVATION-AND-PREFLIGHT-PACKAGE`, `MCS-1-G-A-ACTIVATION-CONTROL-REGISTER`, `REAL-C-05-…-ESTABLISHMENT-RECORD` (§12), `MCS-1-RM-8-ADJUDICATION-AND-REAL-M-07-CLOSURE-CERTIFICATION`.
- **Produces:** the human-operational run-sheet (prerequisites, participants, evidence, HGA-1/2/3/4 steps, HGA-5 trigger, completion criteria).
- **Feeds:** the live Board session → G-A closure + IA designation → AUTHORIZED EXECUTION → Executor RM-2 Pre-Flight.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); Executor and Independent Adjudicator to be designated (this checklist designates none).

**END T04-BOARD-SESSION-EXECUTION-CHECKLIST — PHASE T04 · PREREQUISITES · PARTICIPANTS · EVIDENCE · HGA-1 (G-A) ·
HGA-2 (C-05 IA) · HGA-3/HGA-4 (KEY-REG + RM-8 SoD) · HGA-5 (REASSESSMENT TRIGGER) · COMPLETION CRITERIA ·
CC-1..3 OBSERVED · **BOARD SESSION READY** · NO GOVERNANCE / NO CONTROL / NO EXECUTION / NO DESIGNATION / NO
ACTIVATION / NO MUTATION PERFORMED BY THIS ARTIFACT.**
