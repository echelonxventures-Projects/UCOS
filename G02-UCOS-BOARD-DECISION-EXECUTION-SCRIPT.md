# G02 — UCOS Board Decision Execution Script

## PHASE G02 — Exact Governance-Session Procedure to Conduct the Board Meeting and Reach a Valid M0 Decision (Procedure Only)

| Field | Value |
|-------|-------|
| Artifact | **G02 — UCOS Board Decision Execution Script** |
| Artifact ID | `G02-UCOS-BOARD-DECISION-EXECUTION-SCRIPT` |
| Phase | **G02 — Board Decision Execution Script** |
| Layer | GOVERNANCE / OPERATIONS (meeting run-script — defines the decision procedure; decides nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **PROCEDURE ONLY** — define the meeting flow to conduct the Board session and reach a valid M0 decision. **No authorization, no enactment, no execution, no governance invention, no `git` mutation (beyond this additive governance `*.md`, permitted by the S0′ tolerance rule).** All record fields are **blank templates** completed live. Append-only. |
| Authoritative inputs (per mandate) | `T04` (session checklist HGA-1..HGA-5), `B04` (MCF construction master authority), `B05` (M0 package; AUTHORIZE-WITH-CONDITIONS; C-0..C-6), `G01` (M0 decision package + draft resolution; C-0 CLOSED) |
| Governance posture | `UCOS-CONSTRUCTION-BLOCKED` + Article IX generation lock remain **ACTIVE**. This script conducts a decision; it neither makes nor pre-empts it. |
| **Determination** | **BOARD SESSION READY** — the session can be conducted end-to-end from this script to a valid M0 decision (§ 10). |

> **Purpose.** A step-by-step run-script the presiding authority follows to: verify prerequisites, enact the T04
> governance actions, review conditions C-1..C-6, take the M0 decision, adopt the resolution, capture evidence,
> and close. It composes T04 (HGA-1..HGA-5) with the G01 resolution in one sitting (per G01 §3). Procedure only.

---

## 1. Session Agenda

| # | Agenda item | Ref | Outcome sought |
|:-:|-------------|-----|----------------|
| A1 | Call to order; quorum + presiding authority; confirm RM-1 minute unmodified | T04 P-1/P-5 | Quorum ☐; minute hash == adopted ☐ |
| A2 | Confirm participants + candidates; SoD pre-check | T04 §2 | Executor/IA/Custodian identified |
| A3 | Opening verification (baseline/anchors, inputs present) | § 4 | Verification PASS ☐ |
| A4 | **HGA-1** G-A activation (sign RM-1 minute; date; counter-record; name Executor; ratify tags; O-2) | T04 §4 | G-A/G-F/G-G CLOSED |
| A5 | **HGA-2** REAL-C-05 IA designation (or record *pending*) | T04 §5 | IA designated / pending |
| A6 | **HGA-3/HGA-4** IA key-registration authorization + RM-8 adjudicator confirmation (SoD) | T04 §6 | Key-reg authorized; RM-8 confirmed |
| A7 | **Condition review C-1..C-6** | § 5 | Each Satisfied/Pending-tracked |
| A8 | **M0 decision procedure** | § 6 | AUTHORIZE / AUTHORIZE-WITH-CONDITIONS / DO NOT AUTHORIZE |
| A9 | **Resolution adoption** (G01 §9) | § 7 | Resolution adopted or deferred |
| A10 | **HGA-5** reassessment trigger armed | T04 §7 | Trigger armed |
| A11 | **Evidence capture** | § 8 | Records enrolled append-only |
| A12 | **Session close** + hand-off | § 9 | Outcome recorded; hand-off issued |

---

## 2. Required Participants

| Role | Present? | Identity (record) | Function in session |
|------|:--------:|-------------------|---------------------|
| Presiding Board authority | ☐ | `____` | Signs minute (HA-1); chairs decision |
| Custodian (Chief Authority Architect) | ☐ | `____` | Counter-records; oversight (≠ Executor) |
| Executor | ☐ | `____` | Named (HA-3); records O-2 (HA-7); (≠ IA, ≠ Custodian) |
| Independent Adjudicator (IA) | ☐ / *pending* | `____` | Designated (C-3); RM-8/M4 verifier (≠ Executor) |
| Recorder | ☐ | `____` | Enrolls register entries append-only |

- [ ] **PT** Quorum confirmed; Executor ≠ IA ≠ Custodian (or IA *pending* recorded).

---

## 3. Required Inputs (must be on the table)

- [ ] **IN-1** RM-1 minute verbatim + adopted-text hash (T04 E-1).
- [ ] **IN-2** IA candidate identity + KMS key-custody reference + public-key fingerprint (or *pending* note).
- [ ] **IN-3** Two ratified tag names (`authority-restoration-v1.0.13`, `pi2-pi9-implementation-v1.0.0`).
- [ ] **IN-4** `B04` master authority; `B05` authorization package; `G01` decision package + draft resolution.
- [ ] **IN-5** Anchors-of-record sheet (HEAD/tree/tracked-index/content-anchor/upstream).
- [ ] **IN-6** Non-reserved AD/`GOV-REC` id for the IA designation; AD-0024 issuance record template.
- [ ] **IN-7** Activation Control Register (U28) open for live append-only recording.

---

## 4. Opening Verification Checklist (A3)

- [ ] **OV-1** Quorum present; presiding authority seated.
- [ ] **OV-2** RM-1 minute text hash == adopted (no modification; else VOID per T04 F-A).
- [ ] **OV-3** All required inputs (§3) present.
- [ ] **OV-4** Baseline anchors confirmed live/available (HEAD `519aed9`, tracked-index `d0d60914…`, content-anchor `4416b3a7…`, upstream 0/0) — full Pre-Flight re-verify is the Executor's pre-RM-2 step (U30 §3), not this session.
- [ ] **OV-5** Scope confirmed = MCF Genesis-Kernel-first; no scope-expansion items on agenda (SG-1).
- [ ] **OV-6** `B04` consistency confirmed (C-0 closed); `B05`/`G01` recommendation = AUTHORIZE-WITH-CONDITIONS.

*Any OV fail → PAUSE (T04 F-E) or VOID (OV-2) before proceeding.*

---

## 5. Condition Review Procedure (C-1..C-6) (A7)

For each condition: state it, confirm its status per G01 §3, record the disposition.

| # | Condition | Review action | Target disposition |
|:-:|-----------|---------------|--------------------|
| **C-1** | T04 session enacted (HGA-1) | Confirm A4 completed: minute signed/dated/counter-recorded; G-A/G-F/G-G CLOSED | **Satisfied at-session** |
| **C-2** | REAL-M-07 durability | Confirm HGA-1 authorizes RM-2..RM-7; record C-2 as a **condition on M1** (G-DURABILITY) — not a precondition to M0 issuance | **Pending → milestone-gated (M1)** |
| **C-3** | REAL-C-05 IA designation | Confirm A5/A6: IA designated (distinct key) **or** record *pending `REAL-C-05`* (M4 independence pending, U32 CP-1) | **Satisfied at-session** (designation) / attestation M4 |
| **C-4** | Separation of duty | Verify Executor ≠ IA ≠ Custodian; distinct keys (T04 §6) | **Satisfied at-session** |
| **C-5** | Scope-lock | Confirm authorization limited to MCF Genesis Kernel (B04 §2) | **Satisfied** |
| **C-6** | Construction gates operative | Confirm gates (B01 §6) instantiated as M1..M4 gate events | **Satisfied at-M0 instantiation** |

- [ ] **CR** All C-1..C-6 dispositions recorded; **none Blocked** (C-0 closed by B04). If any decisive condition (C-1/C-4/C-5) cannot be met → do not proceed to AUTHORIZE (§6).

---

## 6. Decision Procedure (A8)

**Step-by-step:**
1. **Motion:** presiding authority moves to decide M0 for the MCF Genesis-Kernel sub-scope (per G01 recommendation).
2. **Discussion:** review B05/G01 recommendation, risk register, and condition dispositions (§5).
3. **Decision rule (apply exactly):**
   - **AUTHORIZE** — only if **all** conditions are unconditionally satisfied now (C-1..C-6 with no tracked/pending item). *(Not expected: C-2 is inherently M1-gated; C-3 attestation is M4-gated.)*
   - **AUTHORIZE WITH CONDITIONS** — if C-5 Satisfied ∧ C-1/C-4 satisfied at-session ∧ C-3 designated (or *pending*) ∧ C-6 instantiated ∧ C-2 tracked to M1. **(Expected outcome per G01.)**
   - **DO NOT AUTHORIZE** — if any decisive condition fails: minute modified (VOID), no/ambiguous Executor or SoD breach (C-4 fail), scope expansion (C-5 fail / SG-1), or a design blocker surfaces (none per T03).
4. **Determination:** record exactly one outcome: ☐ AUTHORIZE ☐ AUTHORIZE WITH CONDITIONS ☐ DO NOT AUTHORIZE.
5. **Fail-closed default:** on any unresolved ambiguity → **defer** (do-not-authorize) rather than authorize.

- [ ] **DEC** One outcome selected; basis recorded; conditions (if any) enumerated with their gate points (C-2→M1, C-3-attestation→M4).

---

## 7. Resolution Adoption Procedure (A9)

1. Open the **G01 §9 draft resolution** template.
2. Complete items **1–8**: G-A activation (C-1); IA designation or pending (C-3); SoD (C-4); scope-lock (C-5); construction gates (C-6); durability condition (C-2→M1); **issue AD-0024-with-conditions** (item 7); non-outcomes (item 8).
3. **Sign:** presiding authority signs; **counter-record:** Custodian.
4. **Assign** the AD-0024 record its id + decision date (AUTH-012 §9 sequential).
5. **Enroll append-only** into the decision log (`AUTH-012` / IF-GOV) — recorded as a session record for durable enrollment via the RM-2 wave (CC-1: append-only-at-RM-2; do not pre-write into the 32 protected inputs).
6. Confirm the resolution reflects the §6 outcome exactly (no scope drift; SG-1).

- [ ] **RES** Resolution adopted (signed + counter-recorded) **or** deferred; outcome matches §6.

---

## 8. Evidence Capture Procedure (A11)

Capture into the Activation Control Register (U28), append-only, hash-chained (evidence class = **CE** for the decision, per B02 §3):

- [ ] **EC-1** Signed, dated RM-1 minute + counter-record (EV-1).
- [ ] **EC-2** Named Executor of record (EV-2).
- [ ] **EC-3** IA designation (distinct-key) or *pending* record (EV-3).
- [ ] **EC-4** Ratified tag-name record (EV-4).
- [ ] **EC-5** Executor O-2 commitment (EV-5).
- [ ] **EC-6** SoD attestation Executor≠IA≠Custodian (EV-6).
- [ ] **EC-7** Adopted AD-0024-with-conditions (id, date, conditions, scope) — the M0 decision record.
- [ ] **EC-8** HGA-5 reassessment trigger record.
- [ ] **EC-9** Decision date + session outcome; recorder attestation.

**Rule:** every capture is append-only and attributable; the CE bundle is the decision's creation evidence and
feeds the RM-2 durable enrollment (EV-8 lands as first content of RM-2, per CC-1).

---

## 9. Session Close Procedure (A12)

- [ ] **SC-1** Confirm all agenda items A1–A11 complete (or explicitly deferred).
- [ ] **SC-2** Record final **session outcome**: ☐ SUCCESS (M0 decided; resolution adopted) ☐ PAUSED ☐ DEFERRED ☐ VOID.
- [ ] **SC-3** If AUTHORIZE-WITH-CONDITIONS: issue **hand-off token** to the Executor — `{AD-0024 ref, scope=Genesis Kernel, Executor, IA/pending, O-2 ref, anchors sheet}` — for **RM-2 Pre-Flight** (U30 §3) and construction M0→M1.
- [ ] **SC-4** Confirm Article IX lock + `UCOS-CONSTRUCTION-BLOCKED` unchanged beyond the authorized MCF sub-scope.
- [ ] **SC-5** Recorder seals the register entries; presiding authority adjourns.

**Post-session state (expected):** M0 decided (AUTHORIZE-WITH-CONDITIONS); AD-0024-with-conditions adopted;
program at **AUTHORIZED EXECUTION** for the Genesis Kernel; Executor proceeds to RM-2 Pre-Flight → construction.

---

## 10. Final Determination

> # **BOARD SESSION READY**
>
> The session can be conducted end-to-end from this script to a valid M0 decision. It specifies the agenda
> (§ 1), participants (§ 2), required inputs (§ 3), opening verification (§ 4), the C-1..C-6 condition review
> procedure (§ 5), the decision procedure with the exact decision rule (§ 6), the resolution adoption procedure
> against the G01 template (§ 7), the evidence capture procedure (§ 8), and the session close procedure (§ 9).
>
> With **C-0 closed** (B04) and the expected outcome **AUTHORIZE WITH CONDITIONS** (C-5 satisfied; C-1/C-4 and
> the C-3 designation at-session; C-6 at-M0; C-2 and the C-3 attestation milestone-gated), the session flow is
> complete and fail-closed (VOID/PAUSE/DEFER guards; do-not-authorize default on ambiguity).
>
> This script conducts a decision; it does not make one. **No authorization, enactment, execution, governance
> invention, or `git` mutation was performed.** All fields are blank templates. `UCOS-CONSTRUCTION-BLOCKED` and
> the Article IX generation lock remain **ACTIVE**.
>
> ### Next required phase
> Conduct the Board session per this script; on **AUTHORIZE WITH CONDITIONS**, adopt the G01 resolution, issue
> AD-0024-with-conditions, and hand off to the Executor for RM-2 Pre-Flight → MCF Genesis Kernel construction
> (M0→M1).

---

## Governance / Non-Enactment Statement

No authorization issued; no resolution enacted; no adjudicator designated; no session held; no execution,
construction, or `git` mutation performed; no new governance mechanism, control, or architecture created; no
lock released; no invariant enrolled; no technology selected. This is a meeting **procedure** script with blank
record fields; the sole repository effect is this additive governance `*.md`, permitted by the S0′ tolerance
rule and outside the `RM2-CONTENT-ANCHOR` protected set. M0 and all construction remain Approval-Required
Operations (AUTH-012 §8 / AD-0009). INV-1..13, `AUTH-012` (v1.0.13), AD-0014, AUTH-004/005/006 (FROZEN canon),
the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged.

## Traceability
- **Consumes (authoritative):** `T04`, `B04`, `B05`, `G01`.
- **Operationalizes:** the T04 checklist (HGA-1..HGA-5) + the G01 decision package/draft resolution into one meeting run-script.
- **Produces:** the Board decision execution script (agenda, participants, inputs, opening verification, condition review, decision procedure, resolution adoption, evidence capture, close).
- **Feeds:** the live Board session → M0 decision (expected AUTHORIZE-WITH-CONDITIONS) → AD-0024-with-conditions → RM-2 Pre-Flight → MCF Genesis Kernel construction.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014; construction gated by `UCOS-CONSTRUCTION-BLOCKED`.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); Executor + Independent Adjudicator to be designated.

**END G02-UCOS-BOARD-DECISION-EXECUTION-SCRIPT — PHASE G02 · AGENDA A1..A12 · PARTICIPANTS · INPUTS · OPENING
VERIFICATION · CONDITION REVIEW (C-1..C-6; NONE BLOCKED; C-0 CLOSED) · DECISION PROCEDURE (RULE: AUTHORIZE /
AUTHORIZE-WITH-CONDITIONS / DO-NOT-AUTHORIZE) · RESOLUTION ADOPTION (G01 TEMPLATE) · EVIDENCE CAPTURE (CE →
U28) · SESSION CLOSE + HAND-OFF · **BOARD SESSION READY** · PROCEDURE ONLY · NO AUTHORIZATION / NO ENACTMENT /
NO EXECUTION / NO GOVERNANCE INVENTION / NO MUTATION · CONSTRUCTION LOCK + ARTICLE IX REMAIN ACTIVE.**
