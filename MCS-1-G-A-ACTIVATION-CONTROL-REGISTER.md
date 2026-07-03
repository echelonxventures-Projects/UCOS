# MCS-1 — G-A Activation Control Register

## PHASE U28 — Official Recording Framework Governing the Human Activation Event (Framework Only — No Activation)

| Field | Value |
|-------|-------|
| Artifact | **MCS-1 — G-A Activation Control Register** |
| Artifact ID | `MCS-1-G-A-ACTIVATION-CONTROL-REGISTER` |
| Phase | **U28 — G-A Activation Control Register** |
| Layer | GOVERNANCE / AUTHORITY (control-register framework — governs/audits the event; activates nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **CONTROL-REGISTER FRAMEWORK ONLY** — define the official register that will record, govern, and audit the actual human activation event. **No activation, no signatures, no appointments, no execution, no `git` mutation.** All record fields are **blank templates** to be completed *during* the event by the responsible actors. Append-only. |
| Authoritative inputs (per mandate) | `MCS-1-G-A-GOVERNANCE-ACTIVATION-DOSSIER` (HA-1..HA-7; ceremony), `MCS-1-RM-2-ACTIVATION-READINESS-CERTIFICATE` (machine determinants live), `MCS-1-RM-2-SUFFICIENCY-CERTIFICATION` (complete determinant set) |
| Anchors of record (immutable references) | HEAD `519aed95cef03b33afd16bf5ea43a8326ca13c57` · tracked-index `d0d6091486…af0a` · RM-2 content anchor `4416b3a776…ca7ca` · upstream 0/0 |
| Governance status | INV-1..13 unchanged; AD-0014 intact; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |
| **Determination** | **READY FOR ACTIVATION EVENT** — the event can be fully governed and audited using this register alone (§ Required Determination). |

> **How to use this register.** During the activation ceremony (dossier § 3), each responsible actor completes
> the corresponding rows below. The register is the **single source of truth** for whether G-A activation
> SUCCEEDED, and it feeds the RM-2 handover. Completing a field is a human act performed *at event time* — this
> artifact only provides the empty, governed structure.

---

## 1. Activation Event Register

| Field | Value (to record at event) |
|-------|----------------------------|
| Event ID | `RM1-ACT-________` |
| Event type | RM-1 preservation-scoped authorization activation (G-A) |
| Scheduled date/time (UTC) | `____________` |
| Convened by | `____________` (presiding Board authority) |
| Minute reference | RM-1 minute (dossier § 3 verbatim); text hash `____________` MUST equal the adopted text |
| Baseline of record | **S0′** (anchors above); Pre-Flight re-verify per § 7 |
| Quorum present? | ☐ Yes ☐ No |
| Event status (final) | ☐ SUCCESS ☐ PAUSED ☐ FAILED ☐ VOID |

---

## 2. Participant Register

| Role | Identity (record) | Distinct-key / SoD attest | Present? |
|------|-------------------|---------------------------|:--------:|
| **Board Authority** (signs, HA-1) | `____________` | signing authority of record | ☐ |
| **Custodian** (Chief Authority Architect, counter-records HA-2) | `____________` | ≠ Executor | ☐ |
| **Executor** (runs RM-2..RM-7, HA-3/HA-7) | `____________` | ≠ RM-8 Adjudicator (SG-4); ≠ Custodian | ☐ |
| **RM-8 Adjudicator** (independent verify) | `____________` or *pending `REAL-C-05`* | distinct key ≠ Executor | ☐ |

**SoD gate:** the register is valid only if Executor ≠ Adjudicator **and** Executor ≠ Custodian (record confirmation): ☐ confirmed.

---

## 3. Activation Evidence Register

| HA | Evidence expected | Recorded value / reference | Captured? |
|:--:|-------------------|----------------------------|:---------:|
| **HA-1** | Board signature bound to exact minute text (attributable, dated) | signatory `____`; sig ref `____`; text hash `____` | ☐ |
| **HA-2** | Custodian counter-record | custodian `____`; date `____` | ☐ |
| **HA-3** | Executor named (minute + authorization record) | executor `____` | ☐ |
| **HA-4** | RM-8 adjudicator named or *pending `REAL-C-05`* | adjudicator `____` / *pending* | ☐ |
| **HA-5** | Tag names ratified verbatim | `authority-restoration-v1.0.13` ☐ · `pi2-pi9-implementation-v1.0.0` ☐ | ☐ |
| **HA-6** | Decision date recorded (AUTH-012 §9) | date `____` | ☐ |
| **HA-7** | Executor O-2 commitment | pledge ref `____` (only add/commit/push/tag; no rewrite/force) | ☐ |

---

## 4. Activation Completion Register (objective completion criteria)

| HA | Objective completion test | Pass? |
|:--:|---------------------------|:-----:|
| HA-1 | Signature present, attributable, dated, and minute text hash == adopted text hash | ☐ |
| HA-2 | Custodian identity + date recorded; custodian ≠ executor | ☐ |
| HA-3 | Exactly one executor named in both minute and authorization record | ☐ |
| HA-4 | Adjudicator field populated (named distinct-key, or explicit *pending*) | ☐ |
| HA-5 | Both tag names present **verbatim**, no variance | ☐ |
| HA-6 | Decision date of record present and sequential (AUTH-012 §9) | ☐ |
| HA-7 | O-2 commitment recorded by the named executor | ☐ |
| **G-A** | **HA-1..HA-7 all Pass** | ☐ |
| **G-F** | ⟸ HA-3 ∧ HA-7 | ☐ |
| **G-G** | ⟸ HA-1 ∧ HA-2 ∧ HA-6; authorization not revoked | ☐ |

---

## 5. Activation Failure Register (void / pause / abort conditions)

| ID | Condition | Effect |
|:--:|-----------|--------|
| AF-1 | Minute signed in **modified** form / text hash mismatch | **VOID** |
| AF-2 | No/ambiguous/multiple executors | **ABORT** (until resolved) |
| AF-3 | Executor == RM-8 Adjudicator, or Executor == Custodian (SoD breach) | **VOID** |
| AF-4 | Tag names altered or missing | **ABORT** |
| AF-5 | Signature not attributable/dated/enrolled append-only | **ABORT** |
| AF-6 | Scope expanded in signing (lock release / construction / certification / AD-0024/25/26) | **VOID** (SG-1) |
| AF-7 | Quorum absent / authority not presiding | **PAUSED** |
| AF-8 | S0′ anchor drift discovered mid-event (HEAD/tracked-index/counts) | **PAUSED** → re-baseline |
| AF-9 | RM-2 content anchor mismatch (`≠ 4416b3a7…`) | **PAUSED** → investigate content change |
| AF-10 | Authorization revoked/lapsed | **VOID** |

**Semantics:** PAUSED = resumable after the condition clears; ABORT = stop, correct, restart the affected step;
VOID = authorization nullified, re-open review. Default on any ambiguity = do-not-proceed (fail-closed).

---

## 6. Activation Outcome Register

| Outcome | Definition | Downstream |
|---------|------------|-----------|
| **SUCCESS** | HA-1..HA-7 all Pass; G-A/G-F/G-G CLOSED; no AF triggered | → § 7 RM-2 Handover |
| **PAUSED** | An AF-7/AF-8/AF-9 condition present; event suspended | Resume after clearance; re-verify |
| **FAILED** | One or more HA completion tests not met at close | Re-attempt after remediation |
| **VOID** | AF-1/AF-3/AF-6/AF-10 triggered | Authorization nullified; return to review |

Record final outcome: ☐ SUCCESS ☐ PAUSED ☐ FAILED ☐ VOID · Recorded by `____` · Date `____`.

---

## 7. RM-2 Handover Register

```
Completed Activation (Outcome = SUCCESS; G-A/G-F/G-G CLOSED)
        │  handover token: signed minute ref + executor name + O-2 pledge ref
        ▼
Pre-Flight Verification (executor, immediately before RM-2) — re-verify against S0′:
   PC-1 HEAD == 519aed9 / tree == 28b8191…                         ☐
   PC-2 branch == phase-10-implementation-readiness; upstream 0/0  ☐
   PC-3 tracked 347 · staged 0 · modified 7 · src 0/138 · AD 0/8   ☐
   PC-4 tracked-index digest == d0d6091486…af0a                    ☐
   PC-5 RM-2 content anchor == 4416b3a776…ca7ca                    ☐
   PC-6 additive untracked = governance *.md only                 ☐
   PC-7 operative baseline == S0′                                 ☐
   PC-8 G-A closed; authorization not revoked                     ☐
        │
        ├── ALL PASS  ⟶  RM-2 GO  ⟶  first action: append signed minute into AUTH-012
        │                              (append-only) + stage 32 inputs for ONE atomic O-1 commit
        └── ANY FAIL  ⟶  RM-2 NO-GO (fail-closed; do not begin)
```

**Handover authority:** only the named Executor may perform Pre-Flight and RM-2, under the signed minute; the
Adjudicator (or *pending*) verifies independently at RM-8 (post-push).

---

## 8. Control Register Certification

- **Governs the event:** participant, evidence, completion, and failure registers cover every actor and act (HA-1..HA-7) with objective tests. ✔
- **Auditable standalone:** anchors of record, minute reference, outcome states, and handover are captured in one artifact; an auditor can reconstruct what happened and whether G-A validly closed without any other document. ✔
- **Fail-closed:** AF register + outcome semantics + Pre-Flight handover ensure any deviation yields PAUSED/ABORT/VOID/NO-GO. ✔
- **Non-mutating:** all fields are blank templates; no signature, appointment, execution, or `git` change performed. ✔

---

## Required Determination

> # **READY FOR ACTIVATION EVENT**
>
> The activation event can be **fully governed and audited using this register alone**. It defines the event
> record, the participant roster with separation-of-duty gates, the per-HA evidence and objective completion
> tests, the void/pause/abort failure conditions, the outcome states, and the exact RM-2 handover (SUCCESS →
> Pre-Flight PC-1..PC-8 → GO/NO-GO). All machine anchors of record are fixed (HEAD `519aed9`, tracked-index
> `d0d6091486…af0a`, content anchor `4416b3a776…ca7ca`, upstream 0/0). The **only** remaining activity is the
> human activation ceremony itself, recorded live into this register.
>
> No activation, signature, appointment, execution, or mutation was performed by this artifact. The Article IX
> generation lock and `UCOS-CONSTRUCTION-BLOCKED` remain in force; `REAL-C-05` remains separate and non-blocking
> for the durability verdict.

---

## Governance / Non-Activation Statement

No signature created; no participant appointed; no `git` mutation, commit, push, tag, branch, or config change
performed; no authorization activated; no lock released; no invariant enrolled; no governance modified. This is
a control-register **framework** with blank record fields. RM-1/RM-2 remain Approval-Required Operations
(AUTH-012 §8 / AD-0009). INV-1..13, `AUTH-012` substance (v1.0.13), AD-0014, the Article IX generation lock,
and `UCOS-CONSTRUCTION-BLOCKED` are unchanged.

## Traceability
- **Consumes (authoritative):** `MCS-1-G-A-GOVERNANCE-ACTIVATION-DOSSIER`, `MCS-1-RM-2-ACTIVATION-READINESS-CERTIFICATE`, `MCS-1-RM-2-SUFFICIENCY-CERTIFICATION`.
- **Produces:** the official activation control/recording framework (event, participants, evidence, completion, failure, outcome, RM-2 handover).
- **Feeds:** the live G-A activation event and, on SUCCESS, the RM-2 Pre-Flight/GO gate.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); independent adjudicator to be designated (`REAL-C-05`).

**END MCS-1-G-A-ACTIVATION-CONTROL-REGISTER — PHASE U28 · EVENT / PARTICIPANT / EVIDENCE / COMPLETION / FAILURE /
OUTCOME / RM-2-HANDOVER REGISTERS · ANCHORS OF RECORD FIXED (`d0d60914…` / `4416b3a7…`) · AUDITABLE STANDALONE ·
**READY FOR ACTIVATION EVENT** · NO ACTIVATION / NO SIGNATURE / NO APPOINTMENT / NO EXECUTION / NO MUTATION
PERFORMED BY THIS ARTIFACT.**
