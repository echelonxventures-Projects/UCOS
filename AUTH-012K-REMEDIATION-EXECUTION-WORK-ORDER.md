# AUTH-012K — Remediation Execution Work Order (AD-0024 / AD-0025)

> **STATUS: CREATED — REMEDIATION EXECUTION WORK ORDER — NOT A GOVERNANCE ACT**
> EXECUTION WORK ORDER ONLY · NOT A VOTE · NOT A RATIFICATION · NOT AN ENROLLMENT · NOT AN AMENDMENT · NOT AN AUTHORITY CREATION · NOT A GOVERNANCE DECISION
> THIS DOCUMENT **SPECIFIES** REPOSITORY ACTIONS FOR A TRUSTED OPERATOR — IT PERFORMS NONE OF THEM
> DOES NOT EDIT `PCAMG-0002/0007` · DOES NOT CREATE THE C-9 LEDGER · DOES NOT AMEND `AUTH-009` · DOES NOT RECORD ANY `AD-` · DOES NOT SET C-5 · DOES NOT RELEASE ARTICLE IX
> APPEND-ONLY (INV-10) · IMPLEMENTS THE `AUTH-012I` SPECIFICATION · ENABLES (DOES NOT PERFORM) `G-C10` VERIFICATION IN `AUTH-012L`

| Field | Value |
|-------|-------|
| Artifact ID | `AUTH-012K` |
| Name | Remediation Execution Work Order (AD-0024 / AD-0025) |
| Layer | AUTHORITY (companion to `AUTH-012A..J`, `AUTH-012` Decision Log) |
| Classification | **EXECUTION WORK ORDER — NON-BINDING SPECIFICATION** |
| Mode | **WORK ORDER ONLY** — specifies the repository actions a trusted operator must perform to satisfy **P1/P2/P4** and enable **`G-C10 = TRUE`**; performs none |
| Scope | The exact operator actions — files, locations, verbatim text, and verification criteria — for P1 (addenda + C-8), P2 (C-9 dual-run ledger), and P4 (staged `AUTH-009` v1.1.0 amendment with M-1 forward-reference) |
| Implements | `AUTH-012I` §1 (C-8), §2 (C-9), §3 (C-10 predicates); verbatim addenda from `AUTH-012B` §1–§2 |
| Explicitly out of scope | Casting/recording a vote · **amending `AUTH-009`** (staged only) · enrolling `PCAMG-0002/0007` · setting C-5 (Board vote input) · running an actual compliance engine · Article IX release |
| Executing actor | **Trusted Operator** in the Trusted Architecture Zone (`architecture/**`) + Trusted Document Zone (`docs/**`), per `AUTH-009` §6.5 — all actions are **Trusted Operations** (documentation/staging), full audit + traceability required |
| Ledger / target state (verified) | `AUTH-012` **v1.0.13**; `AUTH-009` **v1.0.0**; `PCAMG-0002/0007` **PROPOSED — NOT ENROLLED**, no addenda, no markers; **no C-9 ledger exists** |
| Owner | UCOS Authority Board (custodian: Chief Authority Architect); executed by the assigned Trusted Operator |
| Date | 2026-07-05 |

---

## 0. Framing — Work Order Discipline

`AUTH-012J` determined the ratification vote **NOT AUTHORIZED (yet)** for one reason only: the `AUTH-012I`
remediation is **specified but unexecuted**, so `P1/P2/P4 = NOT YET VERIFIED` and `G-C10 = FALSE`. This work
order converts that specification into **concrete, auditable operator actions** so the repository can move from
**NOT YET VERIFIED** to **VERIFIABLE** (at which point `AUTH-012L` performs the actual `G-C10` verification).

**Three invariants bind every action below:**

1. **Staging ≠ enactment.** Every artifact the operator produces is marked **`PENDING RATIFICATION —
   INOPERATIVE UNTIL AD-0024/AD-0025`**. Authoring the addenda, opening the ledger, and drafting the amendment
   **confer no authority and change no status**. `PCAMG-0002/0007` remain **PROPOSED**; `AUTH-009` remains
   **v1.0.0**. Effect is granted only by a later Board vote.
2. **"No amendment" is honored by staging.** P4 does **not** edit `AUTH-009`. The operator authors a **separate
   draft** amendment file; the real v1.0.0 → v1.1.0 increment is `AD-0024`'s effect, performed elsewhere.
3. **Append-only (INV-10).** No original text is deleted or reworded. C-8 markers **wrap** retained clauses
   byte-for-byte; addenda are **appended**. Every action is reversible (Section 5.4 rollback).

**Predicate scope reminder (`AUTH-012I` §3.2).** This work order covers **P1, P2, P4** — the operator-executable
predicates. **P3 (C-5)** is an Authority Board vote input for `AD-0025` and is **explicitly excluded**; the C-9
ledger schema carries an empty `validating_authority` slot for the Board to populate at the vote.

---

## SECTION 1 — P1 Execution Package (Addenda + C-8 Markers)

**Predicate satisfied:** P1 — R-2a..d authored verbatim on `PCAMG-0002` and R-7a..d on `PCAMG-0007`, each
retained clause C-8-marked (`AUTH-012I` §3.2). **Closes** O-C1 / O-Op2.

### 1.1 Required addenda

| Target | Addenda (verbatim source) |
|--------|---------------------------|
| `PCAMG-0002` | **R-2a, R-2b, R-2c, R-2d** — verbatim replacement text from `AUTH-012B` §1 |
| `PCAMG-0007` | **R-7a, R-7b, R-7c, R-7d** — verbatim replacement text from `AUTH-012B` §2 |

### 1.2 Target files

- `architecture/pcamg/PCAMG-0002-UNIVERSAL-PRINCIPLE-REGISTRY.md`
- `architecture/pcamg/PCAMG-0007-COMPLIANCE-ENGINE.md`

### 1.3 Insertion locations (C-8 marker wrap, in place) + addendum append

**PCAMG-0002** — wrap each retained clause with the `AUTH-012I` §1.1 marker (open token
`⟦SUPERSEDED-INOPERATIVE :: per=AD-0024 :: authority=<R-ID> :: effect=NONE⟧`, close `⟦/SUPERSEDED-INOPERATIVE⟧`),
preceded by the precedence note; then append the operative R-2 addendum in a new **§7 Enrollment Addendum
(PENDING)** section.

| Retained clause (exact anchor) | Wrap with authority | Operative addendum |
|--------------------------------|:-------------------:|--------------------|
| **§4** "…the **principle prevails**; …This rule is the Layer-0 supremacy clause of `PCAMG-0008`." | R-2a | R-2a replacement (`AUTH-012B` §1 R-2a) |
| **§2** "Each record maps *down to* the existing operational principles it subsumes; it does not replace them." | R-2b | R-2b replacement |
| **Header** "Governs (if enrolled) \| All governance artifacts…" **and Traceability** "Governs (if enrolled): all governance artifacts (Layer 0 of `PCAMG-0008`)." | R-2c | R-2c replacement |
| **§2** namespacing line + **§6** confirmation rows (verification-only; no wrap needed) | — (R-2d) | R-2d confirmation (append to §7) |

**PCAMG-0007** — same pattern (`per=AD-0025`); append the operative R-7 addendum in a new **§9 Enrollment
Addendum (PENDING)** section.

| Retained clause (exact anchor) | Wrap with authority | Operative addendum |
|--------------------------------|:-------------------:|--------------------|
| **Header** "Derives authority from \| `PCAMG-0002`, `PCAMG-0003`" **and §3** Constitutional row "`PCAMG-0003`, `PCAMG-0005`" **and Traceability** "Derives authority from: `PCAMG-0002`, `PCAMG-0003`." | R-7a | R-7a replacement (`AUTH-012B` §2 R-7a) |
| **§7** "The Compliance Engine **subsumes and orchestrates** the existing governance gates…" **and §8** "Existing gates subsumed as evidence sources…" **and Traceability** "Orchestrates: …" | R-7b | R-7b replacement |
| **§1** "no artifact is deployable without a compliance proof" **and §4** Fail-closed row **and §6** "NOT deployable" | R-7c | R-7c replacement |
| **§4** Non-waivable core row + **§8** confirmation (verification-only; no wrap) | — (R-7d) | R-7d confirmation (append to §9) |

### 1.4 Required text

- **Marker + precedence note:** exactly as `AUTH-012I` §1.1/§1.3 (precedence note line, then open token, retained
  clause verbatim unchanged, close token).
- **Operative addenda:** the **verbatim "Replacement language" blocks** of `AUTH-012B` R-2a..d / R-7a..d,
  reproduced character-for-character into the new §7 (0002) / §9 (0007) "Enrollment Addendum (PENDING)" section.
- **Section preamble (both targets):** `> PENDING RATIFICATION — INOPERATIVE UNTIL AD-0024/AD-0025. Authored`
  `append-only (INV-10) per AUTH-012K. Confers no authority; artifact status remains PROPOSED.`
- **No status change:** do **not** alter the STATUS banner, `Classification`, or the `PROPOSED (NOT ENROLLED)`
  END line.

### 1.5 Verification criteria (operator self-check; formal audit is `AUTH-012L`)

| Check | Pass |
|-------|:----:|
| A-8.1 Coverage — all §1.3 clauses wrapped | 0 enumerated clauses unmarked |
| A-8.2 Append-only — wrapped bytes identical to pre-edit source | byte-identical |
| A-8.3 Pairing — balanced open/close, no nesting | 0 unbalanced |
| A-8.4 Precedence note present per block | all present |
| A-8.5 Operative R-addenda present outside markers (§7/§9) | all present, verbatim vs `AUTH-012B` |
| A-8.6 No `PCAMG-PRIN-###` record wrapped | 0 |
| Status untouched | `PROPOSED — NOT ENROLLED` intact on both |

---

## SECTION 2 — P2 Execution Package (C-9 Dual-Run Evidence Ledger)

**Predicate satisfied:** P2 — the C-9 non-authoritative / non-certifying guard implemented on the dual-run
evidence-ledger artifact (`AUTH-012I` §3.2). **Closes** O-C2 / O-Cert1(a).

### 2.1 C-9 ledger artifact

A new **governance documentation artifact** (not engine code — Article IX remains locked; no runtime is
authorized). It defines the schema, opens the append-only hash chain at GENESIS, and declares read-isolation.

### 2.2 Required file & location

- **`architecture/pcamg/dual-run/PCAMG-0007-DUAL-RUN-EVIDENCE-LEDGER.md`** (new directory `dual-run/`).
- Marked `PENDING RATIFICATION — INOPERATIVE UNTIL AD-0025`; the ledger accepts **no verdict records** until
  `PCAMG-0007` is enrolled (it opens empty, at GENESIS).

### 2.3 Required schema (verbatim from `AUTH-012I` §2.3)

The artifact MUST contain the full verdict-record schema, including the mandatory literal
`"marker": "NON-BINDING · NON-CERTIFYING · OBSERVATION-ONLY"` and the fields `binding=NON-BINDING`,
`authorization_effect=NONE`, `article_ix=NOT-RELEASED`, `certification_effect=NON-CERTIFYING`,
`sod_class=OBSERVATION-ONLY`, `ingest_prohibition=NO-GATE-NO-CERT-CONSUME`, `producer`,
`validating_authority` (**empty slot — Board sets at AD-0025 vote, C-5(b)**), `evidence_refs`, `prev_hash`,
`timestamp`.

### 2.4 Required records (at open)

| Record | Content |
|--------|---------|
| **GENESIS** | `record_id=GENESIS`, `prev_hash=GENESIS`, no verdict, carries the §2.3 markers, `validating_authority="<UNSET — pending C-5(b)>"`, timestamp. Establishes the hash-chain root. |
| **Read-isolation declaration** | Explicit statement: no `GATE-QUAL/SEC/DOC/REL-001`, Constitutional Lock Engine, or certification artifact may read this ledger as input; the boundary is one-way (engine consumes gate outputs, nothing consumes engine verdicts). |
| **Non-waivable FN note** | Records FN tolerance = **0** against the C-5(a) coverage denominator **to be set at the vote**. |

### 2.5 Required locations for the AUTH-009 §7 consume-only note

The consume-only relationship note (R-7b / M-3) is **staged** in the P4 amendment draft (Section 3), **not**
written into `AUTH-009` here. The ledger artifact cross-references it as `pending AD-0024/AD-0025`.

### 2.6 Verification criteria (operator self-check)

| Check | Pass |
|-------|:----:|
| A-9.1 Marker presence — schema + GENESIS carry the literal marker and all §2.1/§2.2 fields | present |
| A-9.2 Hash chain — GENESIS root well-formed (`prev_hash=GENESIS`) | valid |
| A-9.3 Read-isolation — declaration present; 0 inbound references from gates/cert | 0 |
| A-9.4 No authorization path — no verdict field wired to deploy/generate | 0 |
| A-9.5 SoD slot — `validating_authority` present as explicit UNSET slot | present |
| Ledger opens empty (no verdicts) and marked PENDING | confirmed |

---

## SECTION 3 — P4 Execution Package (Staged AUTH-009 v1.1.0 Amendment + M-1 Annotation)

**Predicate satisfied:** P4 — the `AUTH-009` v1.1.0 **M-1** registration of `PCAMG-0007` annotated
*forward-reference pending AD-0025* (`AUTH-012I` §3.2). Satisfied by presence of the annotation **in the
amendment text** (and later in `AD-0024`), **not** by amending `AUTH-009`. **Closes** O-A1.

### 3.1 AUTH-009 changes — STAGED ONLY (not applied)

> **Constraint.** `AUTH-009` is an Authority artifact in the Trusted Agent Zone; **all writes to it are
> Approval-Required and enacted only by `AD-0024`.** This work order therefore produces a **draft**, not an
> edit. `AUTH-009` remains **v1.0.0** until the Board votes.

- **File to create:** `AUTH-009-V1.1.0-AMENDMENT-DRAFT.md` (repo root; marked `DRAFT — PENDING AD-0024 — NOT
  APPLIED — AUTH-009 REMAINS v1.0.0`).
- **Contents (draft text for the Board to enact):**
  - **M-1 (§5 Controlled Artifacts):** register `PCAMG-0002` and `PCAMG-0007` as **subordinate governance
    artifacts** deriving authority from `AUTH-002/003/008/009`, at the **ARCHITECTURE** tier.
  - **M-2 (Subordination Clause):** re-roots/inverts nothing; on conflict **Authority prevails** (Art. XI /
    `AUTHORITY-INDEX` §2).
  - **M-3 (§7 report-only / consume-only note):** `PCAMG-0007` is **report-only / non-binding** and **consumes**
    gate outputs as read-only evidence (does not subsume/orchestrate/govern them).
  - **§11 version row (draft):** `1.1.0 | <pending> | Authority Board | … | AD-0024`.

### 3.2 M-1 annotation (the P4 deliverable)

Within the draft M-1, the registration of `PCAMG-0007` MUST carry the exact annotation:

> `PCAMG-0007 — registered as a subordinate governance artifact by FORWARD REFERENCE, PENDING its enrollment`
> `decision AD-0025. This registration is NOT a pre-commitment to AD-0025; PCAMG-0007 is enrolled only if and`
> `when AD-0025 is separately ratified (0002-before-0007, C-3).`

### 3.3 Registration references

- The draft cross-references: `AUTH-012B` (R-2a..d/R-7a..d), `AUTH-012E` §7/§8 (draft ADs), `AUTH-012I`
  (C-8/C-9/C-10), this work order (`AUTH-012K`), and the C-9 ledger artifact (Section 2).
- It notes the **recommended** items P-C1..P-C4 (`AUTH-012B` §5.2) as optional, Board-discretion additions.

### 3.4 Verification criteria (operator self-check)

| Check | Pass |
|-------|:----:|
| Draft file exists, marked `NOT APPLIED — AUTH-009 REMAINS v1.0.0` | confirmed |
| M-1 registers both artifacts as subordinate / ARCHITECTURE tier | present |
| **M-1 `PCAMG-0007` forward-reference annotation present verbatim** | present |
| M-2 subordination clause + M-3 report-only/consume note present | present |
| `AUTH-009` on disk unchanged (still v1.0.0, no new rows) | verified unchanged |

---

## SECTION 4 — G-C10 Verification Plan

Defines how the completed work is checked so `AUTH-012L` can confirm `G-C10`. **This section plans the
verification; `AUTH-012L` performs it.**

### 4.1 Verification procedure

1. **P1:** run A-8.1..A-8.6 (Section 1.5) against `PCAMG-0002` and `PCAMG-0007` → `P1 = TRUE` iff all PASS.
2. **P2:** run A-9.1..A-9.5 (Section 2.6) against the dual-run ledger artifact → `P2 = TRUE` iff all PASS.
3. **P4:** confirm the staged amendment draft carries the M-1 forward-reference annotation and `AUTH-009` on
   disk is unchanged (Section 3.4) → `P4 = TRUE` iff both hold.
4. **P3:** **not evaluated here** — `P3 = C-5`, a Board vote input for `AD-0025` (remains `PENDING`).
5. Compute: `G-C10(0024) = P1 ∧ P4`; `G-C10(0025)_pre-vote = P1 ∧ P2 ∧ P4` (P3 supplied at the vote).

### 4.2 Evidence required

- Marker-coverage report + byte-identity diff for each wrapped clause (A-8.2).
- Balanced-token scan output (A-8.3); precedence-note and operative-addendum presence list (A-8.4/A-8.5).
- Ledger artifact with GENESIS record, read-isolation declaration, inbound-reference scan = 0 (A-9.*).
- Amendment-draft file + a clean `git diff` showing `AUTH-009` and the `AUTH-012` ledger **unchanged**.
- A single **evidence manifest** (Section 6.2) listing each artifact, its hash, and the check results.

### 4.3 Pass criteria

- `P1 = P2 = P4 = TRUE`; targets still `PROPOSED`; `AUTH-009` still `v1.0.0`; `AUTH-012` still `v1.0.13`.
- `G-C10(0024) = TRUE` and `G-C10(0025)` **TRUE-pending-P3** (i.e., everything but the Board's C-5 input).

### 4.4 Failure criteria

- Any A-8.* or A-9.* check fails → the owning predicate is FALSE → `G-C10 = FALSE`; return to the relevant
  section and re-execute.
- Any status flipped, any original byte deleted, or `AUTH-009`/ledger mutated → **hard fail** (INV-10 / scope
  breach); execute rollback (Section 5.4).

---

## SECTION 5 — Operator Checklist

### 5.1 Step-by-step execution sequence

| # | Step | Zone / class | Output |
|---|------|--------------|--------|
| S1 | Create working branch; snapshot pre-edit hashes of `PCAMG-0002`, `PCAMG-0007`, `AUTH-009`, `AUTH-012` | Trusted Ops | baseline hash record |
| S2 | **P1a** — wrap PCAMG-0002 §4/§2/header/Traceability clauses with C-8 markers + precedence notes (Section 1.3) | Trusted Architecture | edited PCAMG-0002 |
| S3 | **P1b** — append PCAMG-0002 **§7 Enrollment Addendum (PENDING)** with verbatim R-2a..d | Trusted Architecture | edited PCAMG-0002 |
| S4 | **P1c** — wrap PCAMG-0007 header/§3/§7/§8/§1/§4/§6/Traceability clauses; append **§9 Enrollment Addendum (PENDING)** with verbatim R-7a..d | Trusted Architecture | edited PCAMG-0007 |
| S5 | **P2** — create `architecture/pcamg/dual-run/PCAMG-0007-DUAL-RUN-EVIDENCE-LEDGER.md` with schema + GENESIS + read-isolation + FN=0 note (Section 2) | Trusted Architecture | new ledger artifact |
| S6 | **P4** — create `AUTH-009-V1.1.0-AMENDMENT-DRAFT.md` with M-1 (+ forward-ref annotation), M-2, M-3, draft §11 row (Section 3) | Trusted Document | new amendment draft |
| S7 | Run A-8.* and A-9.* self-checks; confirm `AUTH-009` + `AUTH-012` unchanged | Trusted Ops | self-check log |
| S8 | Produce the **evidence manifest** (Section 6.2); record audit trail | Trusted Ops | manifest + audit record |
| S9 | Hand off to `AUTH-012L` (G-C10 Verification Review) | — | ready-for-verification |

### 5.2 Expected outputs

- `PCAMG-0002` and `PCAMG-0007`: C-8-marked retained clauses + PENDING enrollment-addendum sections; **status
  still PROPOSED**.
- New dual-run evidence-ledger artifact (empty, GENESIS-rooted, PENDING).
- New `AUTH-009-V1.1.0-AMENDMENT-DRAFT.md` (NOT applied).
- Self-check log + evidence manifest; unchanged `AUTH-009` (v1.0.0) and `AUTH-012` (v1.0.13).

### 5.3 Required evidence

Pre/post hashes for every touched file; byte-identity diffs for wrapped clauses; balanced-token scan; ledger
GENESIS + read-isolation scan; `git diff` proving `AUTH-009`/`AUTH-012` untouched; full Trusted-Operation audit
record (actor, timestamp, files, INV-10 attestation).

### 5.4 Rollback procedure

- All steps are additive/wrapping and confined to the working branch. **Rollback = discard the branch** (or
  `git revert` the staging commits) → repository returns to the exact pre-S1 state (targets PROPOSED with no
  markers/addenda; no ledger; no amendment draft).
- Rollback is a Trusted Operation, non-destructive to any ratified artifact (none was touched). No `AD-`,
  no version, no status was changed, so there is nothing to un-enact.

---

## SECTION 6 — Completion Determination

**Question:** what evidence must exist before `AUTH-012L` (G-C10 Verification Review) may begin?

### 6.1 Completion gate (all must hold)

| # | Required evidence for `AUTH-012L` start | Predicate |
|---|------------------------------------------|:---------:|
| G1 | `PCAMG-0002` carries C-8-marked §4/§2/header/Traceability clauses + a PENDING §7 with verbatim R-2a..d; status PROPOSED | P1 |
| G2 | `PCAMG-0007` carries C-8-marked header/§3/§7/§8/§1/§4/§6/Traceability clauses + a PENDING §9 with verbatim R-7a..d; status PROPOSED | P1 |
| G3 | Dual-run evidence-ledger artifact exists — schema + markers + GENESIS + read-isolation + FN=0 note; empty; PENDING | P2 |
| G4 | `AUTH-009-V1.1.0-AMENDMENT-DRAFT.md` exists with M-1 forward-reference annotation, M-2, M-3; `AUTH-009` on disk unchanged (v1.0.0) | P4 |
| G5 | Evidence manifest present: per-artifact hash + A-8.*/A-9.* self-check results + `AUTH-009`/`AUTH-012` unchanged proof | P1/P2/P4 |
| G6 | Audit record present (actor, timestamps, INV-10 attestation, rollback point) | all |

### 6.2 Evidence manifest (required deliverable)

A single `docs/governance/AUTH-012K-EXECUTION-MANIFEST.md` listing, per produced/edited artifact: path,
pre-hash, post-hash, the checks run, and their results — plus explicit `UNCHANGED` lines for `AUTH-009` and the
`AUTH-012` ledger. This manifest is the object `AUTH-012L` audits.

### 6.3 Determination

> ## **`AUTH-012L` MAY BEGIN once G1–G6 hold.**
>
> On completion of Sections 1–3 and production of the Section 6.2 manifest, the repository transitions from
> **NOT YET VERIFIED** to **VERIFIABLE**: P1/P2/P4 become **verifiable against physical evidence**, and
> `AUTH-012L` can render `G-C10(0024) = TRUE` and `G-C10(0025) = TRUE-pending-P3`. **P3 (C-5) is not part of this
> work order** and remains the Board's vote input for `AD-0025`.
>
> Until G1–G6 hold, the repository remains **NOT YET VERIFIED** and `AUTH-012L` must not begin.

**This work order specifies operator actions only. It performs no edit, casts no vote, enrolls nothing, amends
nothing (the `AUTH-009` change is staged as a draft), and creates no authority. Executing it is a set of Trusted
Operations; verifying it is `AUTH-012L`; ratifying is a later Authority Board act.**

---

## SUCCESS CRITERIA — Confirmation

| Criterion | Result |
|-----------|:------:|
| Section 1 — P1 package (addenda · target files · insertion locations · required text · verification) | ✅ |
| Section 2 — P2 package (C-9 ledger artifact · schema · records · locations · verification) | ✅ |
| Section 3 — P4 package (AUTH-009 changes STAGED · M-1 annotation · registration refs · verification) | ✅ |
| Section 4 — G-C10 verification plan (procedure · evidence · pass · failure) | ✅ |
| Section 5 — Operator checklist (sequence · outputs · evidence · rollback) | ✅ |
| Section 6 — Completion determination (evidence required before `AUTH-012L`) | ✅ |
| Transitions repository NOT YET VERIFIED → VERIFIABLE | ✅ (on G1–G6) |
| **No vote · No enrollment · No amendment (staged only) · No authority creation · No governance decision** | ✅ |

## Traceability
- **Implements:** `AUTH-012I` §1 (C-8), §2 (C-9), §3 (C-10 predicates P1/P2/P4); verbatim addenda from `AUTH-012B` §1–§2.
- **Consumes:** `AUTH-012H` (readiness), `AUTH-012J` (authorization — NOT AUTHORIZED pending execution); target structures of `PCAMG-0002`, `PCAMG-0007`, `AUTH-009`.
- **Produces (operator, on execution — not by this document):** C-8-marked addenda on `PCAMG-0002/0007` (PENDING); dual-run evidence ledger (PENDING); `AUTH-009` v1.1.0 amendment **draft**; execution manifest.
- **Enables (does not perform):** `AUTH-012L` G-C10 verification → `G-C10(0024)=TRUE`, `G-C10(0025)=TRUE-pending-P3`.
- **Excludes:** C-5 (Board vote input); any `AUTH-009` edit; any `AD-` record; any enrollment; Article IX release.
- **Governed by:** `AUTH-002` (Art. IX/XI/XII), `AUTH-008` (S1/S3/S4), `AUTH-009` (§5/§6/§7/§8; Trusted Ops / zones), `AUTH-012` (§3/§6/§8/§9), `AUTHORITY-INDEX` (§1/§2).
- **Preserves:** Article IX, INV-1..13, `INV-CORE-001`, non-waivable S1/S3/S4, `AD-0014`, ratified hierarchy/precedence, `AUTH-012` continuity (v1.0.13), `AUTH-009` v1.0.0; F-1/F-2/F-3/F-4 remain in force.
- **Defers:** `PCAMG-0001/0003/0004/0005/0006/0008`, supremacy/re-rooting, binding-enforcement promotion, Constitutional Majority.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); executed by the assigned Trusted Operator.

**END AUTH-012K · REMEDIATION EXECUTION WORK ORDER · P1 (ADDENDA + C-8) / P2 (C-9 DUAL-RUN LEDGER) / P4 (STAGED AUTH-009 v1.1.0 DRAFT + M-1 ANNOTATION) SPECIFIED · TARGET: NOT YET VERIFIED → VERIFIABLE · G-C10 VERIFICATION DEFERRED TO AUTH-012L · P3/C-5 EXCLUDED (BOARD VOTE INPUT) · NO VOTE · NO ENROLLMENT · NO AMENDMENT (STAGED ONLY) · NO AUTHORITY CREATION · NO GOVERNANCE DECISION · APPEND-ONLY · LEDGER UNCHANGED (v1.0.13) · AUTH-009 UNCHANGED (v1.0.0).**
