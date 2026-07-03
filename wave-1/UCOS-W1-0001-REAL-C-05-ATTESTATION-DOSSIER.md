# UCOS-W1-0001 — REAL-C-05 Attestation Dossier

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-W1-0001` |
| Program | **UCOS Wave 1 — Independent Evidence Package Generation** |
| Phase | W1-1 — Attestation Package |
| Closes toward | **EA-B-P0-1** (AT-P0-1) via evidence instrument **`REAL-C-05`** |
| Mode | **PREPARATION ARTIFACT ONLY** — blank templates, checklists, and forms for an **independent adjudicator**. Contains no evidence, no findings, no signatures. Performs no attestation. |
| Status | EVIDENCE-PACKAGE TEMPLATE (v1.0.0) — **UNEXECUTED** |
| Date | 2026-07-03 |
| Inputs (read-only, frozen) | `UCOS-G0-0001 §1`; `UCOS-G0-0002`; `UCOS-EA-0003 §2`; `UCOS-RA-0007 §1`; `UCOS-EP-0005 §1/§2`; `AUTH-REST-004`; `ONTO-RAT-001`; `MEM-RAT-003`; `MEM-RAT-001` (superseded); `AUTH-012` v1.0.13 |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. **No self-attestation. No lock lift.** |

> **Filling rule.** Every field marked `⟨…⟩` or `[ ]` is completed **only by the independent adjudicator** at
> execution time. This dossier as issued is **UNEXECUTED**; all statuses are **PENDING**. Producing this dossier
> asserts no evidence and does not close EA-B-P0-1.

---

## 1. Purpose

To equip an **independent adjudicator** (a party with no role in authoring, restoring, or self-attesting the
UCOS corpus) with the complete instrument set to produce **`REAL-C-05`** — the independent adjudication that,
with a `REAL-H-07` PASS, satisfies **AT-P0-1** and closes **EA-B-P0-1**. This dossier standardizes what must be
reviewed, measured, signed, accepted, and what must cause rejection.

## 2. Scope

**In scope (attestation subjects, per `UCOS-G0-0002 §1`):**

| Subject | Attest that… | Documentary basis (read-only) |
|:--:|--------------|-------------------------------|
| **S-1** | The reconciled `AUTH-012` v1.0.13 chain enrolls AD-0001..0023 end-to-end | `AUTH-REST-004`; `AUTH-012` ledger |
| **S-2** | PI-8 (Ontology) ratification is valid | `ONTO-RAT-001` |
| **S-3** | PI-9 (Memory) ratification is valid; REJECTED `MEM-RAT-001` is superseded | `MEM-RAT-003`; `MEM-RAT-001` |
| **S-4** | The pre-construction enrollment gate returns PASS on the attested state | `REAL-H-07` |

**Out of scope:** program-state reproduction (that is `UCOS-W1-0002` / `REAL-M-03`); certificate re-issue
(`UCOS-W1-0004`); any lock-lift (`UCOS-W1-0005`). The adjudicator attests the **chain and ratifications only**.

## 3. Required evidence (adjudicator assembles / references — read-only)

| Ref | Evidence item | Location field |
|-----|---------------|----------------|
| E-1 | `AUTH-REST-004` documentary restoration record | `⟨path/version⟩` |
| E-2 | `AUTH-012` v1.0.13 ledger export (AD-0001..0023) | `⟨path/version⟩` |
| E-3 | Phantom `AD-0021` disposition (withdrawn/superseded) | `⟨path/version⟩` |
| E-4 | `ONTO-RAT-001` (PI-8 ratification) | `⟨path/version⟩` |
| E-5 | `MEM-RAT-003` (PI-9 ratification) | `⟨path/version⟩` |
| E-6 | `MEM-RAT-001` (REJECTED; supersession target) | `⟨path/version⟩` |
| E-7 | `REAL-H-07` gate definition/runner | `⟨path/version⟩` |

## 4. Required measurements

| Meas | Quantity | Required value | Recorded value |
|------|----------|----------------|:--------------:|
| M-1 | `REAL-H-07` gate result | **PASS** | `⟨PASS/FAIL⟩` |
| M-2 | Attestation subjects confirmed | **4 of 4 (S-1..S-4)** | `⟨n/4⟩` |
| M-3 | Self-attestation reliance | **0** (independence declared) | `⟨0/≠0⟩` |
| M-4 | Chain gaps AD-0001..0023 @ v1.0.13 | **0** | `⟨count⟩` |

## 5. Required signatories

| Sig | Signatory role | Name / body | Signature | Date |
|-----|----------------|-------------|-----------|------|
| SIG-1 | Independent adjudicator (author of `REAL-C-05`) | `⟨____⟩` | `[ ]` | `⟨____⟩` |
| SIG-2 | `REAL-H-07` gate operator (deterministic) | `⟨____⟩` | `[ ]` | `⟨____⟩` |
| SIG-3 | UCOS Authority Board — acceptance of evidence (not a lift) | `⟨____⟩` | `[ ]` | `⟨____⟩` |

> **Independence declaration (mandatory, SIG-1):** "I certify I had no authoring, restoration, or self-attesting
> role in the UCOS corpus under review." `[ ] affirmed`

## 6. Verifier instructions (adjudicator procedure)

1. Confirm independence (§5 declaration); if not independent, **STOP** — record REJECTION R-1.
2. Reference E-1..E-7 by path and version; confirm each is of record and unmodified.
3. **S-1:** trace AD-0001..0023 into `AUTH-012` v1.0.13; record any gap in M-4; confirm `AD-0021` disposition (E-3).
4. **S-2:** review `ONTO-RAT-001`; confirm PI-8 ratification validity.
5. **S-3:** review `MEM-RAT-003`; confirm PI-9 ratification; confirm `MEM-RAT-001` superseded (E-6 link).
6. **S-4:** run/observe `REAL-H-07` on the attested state; record M-1.
7. Complete Form F-1 (per-subject finding) and Form F-2 (`REAL-C-05` cover).
8. Complete Form F-3 (`REAL-H-07` result). Submit to Authority Board for acceptance (SIG-3) — **acceptance is
   not a lock-lift** (`UCOS-G0-0005`).

## 7. Acceptance criteria (AT-P0-1 = PASS iff **all** true)

- [ ] SIG-1 independence affirmed; adjudicator distinct from all authoring parties.
- [ ] S-1 ∧ S-2 ∧ S-3 ∧ S-4 each recorded **ATTESTED** (M-2 = 4/4).
- [ ] M-1 = **PASS**; M-3 = **0**; M-4 = **0**.
- [ ] `REAL-C-05` (F-2) and `REAL-H-07` (F-3) of record, versioned, referenced in the traceability chain.
- [ ] Board acceptance (SIG-3) recorded append-only on `AUTH-012`.

## 8. Rejection criteria (AT-P0-1 = FAIL if **any** true)

| ID | Rejection trigger |
|----|-------------------|
| R-1 | Adjudicator is not independent (any authoring/restoration/self-attesting role) |
| R-2 | Any subject S-1..S-4 not ATTESTED (M-2 < 4/4) |
| R-3 | `REAL-H-07` returns FAIL (M-1 ≠ PASS) |
| R-4 | Self-attestation offered in lieu of independent evidence (M-3 ≠ 0) — prohibited (`UCOS-EP-0005 §2`) |
| R-5 | Chain gap present (M-4 > 0) or `AD-0021` disposition missing |
| R-6 | Any evidence item not of record / unversioned / mutated |

> On any rejection: **remain BLOCKED**; EA-B-P0-1 stays OPEN; re-run W1 attestation. No downstream package
> (W2/W3) may proceed.

---

## FORMS

### Form F-1 — Per-Subject Attestation Finding *(one row per subject)*

| Subject | Basis ref | Finding (`ATTESTED` / `NOT-ATTESTED`) | Note | Adjudicator initials |
|:--:|-----------|:-------------------------------------:|------|:--------------------:|
| S-1 chain | E-2/E-3 | `⟨____⟩` | `⟨____⟩` | `[ ]` |
| S-2 PI-8 | E-4 | `⟨____⟩` | `⟨____⟩` | `[ ]` |
| S-3 PI-9 | E-5/E-6 | `⟨____⟩` | `⟨____⟩` | `[ ]` |
| S-4 gate | E-7 | `⟨____⟩` | `⟨____⟩` | `[ ]` |

### Form F-2 — `REAL-C-05` Cover Sheet

```
REAL-C-05 INDEPENDENT ADJUDICATION REPORT — COVER
Adjudicator (independent): ⟨____⟩            Independence affirmed: [ ]
Corpus under review:       AUTH-012 v1.0.13 (AD-0001..0023); ONTO-RAT-001; MEM-RAT-003
Subjects attested:         S-1 [ ]  S-2 [ ]  S-3 [ ]  S-4 [ ]     (M-2 = ⟨n⟩/4)
Self-attestation reliance: ⟨0/≠0⟩ (M-3)      Chain gaps: ⟨count⟩ (M-4)
Overall finding:           ⟨ATTESTED / NOT-ATTESTED⟩
Signature (SIG-1): ____________________       Date: ⟨____⟩
```

### Form F-3 — `REAL-H-07` Gate Result

```
REAL-H-07 PRE-CONSTRUCTION ENROLLMENT GATE — RESULT
Input state ref: ⟨____⟩       Operator (SIG-2): ⟨____⟩
Result: ⟨PASS / FAIL⟩ (M-1)   Timestamp: ⟨____⟩   Log ref: ⟨path⟩
```

### Form F-4 — Board Acceptance of Evidence *(not a lock-lift)*

```
AUTHORITY BOARD — ACCEPTANCE OF REAL-C-05 EVIDENCE OF RECORD
Accepts F-2 + F-3 as of record on AUTH-012 (append-only): [ ]
NOTE: This acceptance records evidence only. It does NOT lift
UCOS-CONSTRUCTION-BLOCKED. The lift act is UCOS-W1-0005 / EWP-00-LIFT (A-1).
Board signatory (SIG-3): ____________________   Date: ⟨____⟩
```

---

## 9. Determination (package-level)

> This dossier is a **complete, blank preparation package** for the independent adjudication that produces
> `REAL-C-05`. It contains purpose, scope, required evidence, measurements, signatories, verifier instructions,
> acceptance and rejection criteria, and four forms (F-1..F-4). As issued it is **UNEXECUTED** — **no evidence
> exists, no subject is attested, AT-P0-1 remains FAIL.** Sufficiency for third-party execution: **YES**.

## 10. Scope discipline

No attestation performed, no signature gathered, no measurement taken, no lock lifted, no self-attestation made.
INV-1..13, `AUTH-012`, `AD-0014`, Article IX lock unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands.**

## 11. Traceability

- **Consumes:** `UCOS-G0-0001 §1`; `UCOS-G0-0002`; `UCOS-EA-0003 §2`; `UCOS-RA-0007 §1`; `UCOS-EP-0005 §1/§2`.
- **Feeds:** `UCOS-W1-0003` (evidence register), `UCOS-W1-0004` (cert grounding), `UCOS-W1-0005` (Board LE-1),
  `UCOS-W1-0006` (submission).
- **Owner (of the act):** Independent adjudicator (producer); UCOS Authority Board (acceptance authority).

**END `UCOS-W1-0001` — REAL-C-05 ATTESTATION DOSSIER · PURPOSE/SCOPE/EVIDENCE/MEASUREMENTS/SIGNATORIES/INSTRUCTIONS/ACCEPT/REJECT · FORMS F-1..F-4 · UNEXECUTED · AT-P0-1 = FAIL · NO SELF-ATTESTATION · NO LOCK LIFT · PREPARATION ARTIFACT ONLY.**
