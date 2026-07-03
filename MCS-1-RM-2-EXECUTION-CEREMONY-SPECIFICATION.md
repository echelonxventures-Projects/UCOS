# MCS-1 — RM-2 Execution Ceremony & Evidence Specification

## PHASE U29 — Exact Conduct, Observation, Recording, Evidence, Verification, and Handoff of RM-2 (Specification Only — No Execution)

| Field | Value |
|-------|-------|
| Artifact | **MCS-1 — RM-2 Execution Ceremony & Evidence Specification** |
| Artifact ID | `MCS-1-RM-2-EXECUTION-CEREMONY-SPECIFICATION` |
| Phase | **U29 — RM-2 Execution Ceremony & Evidence Specification** |
| Layer | GOVERNANCE / EXECUTION-ASSURANCE (execution specification — defines how RM-2 will be run; runs nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **EXECUTION SPECIFICATION ONLY** — define precisely how RM-2 execution will be conducted, observed, recorded, evidenced, verified, and handed off. **No activation, no execution, no signatures, no appointments, no `git` mutation, no repository change (beyond this additive governance `*.md`, permitted by the S0′ tolerance rule).** All record fields are **blank templates** to be completed *during* RM-2 by the named Executor. Append-only. |
| Authoritative inputs (per mandate) | `MCS-1-G-A-ACTIVATION-CONTROL-REGISTER` (event/participant/evidence/completion/failure/outcome/handover registers), `MCS-1-G-A-GOVERNANCE-ACTIVATION-DOSSIER` (HA-1..HA-7; ceremony; RM-2 preconditions), `MCS-1-RM-2-ACTIVATION-READINESS-CERTIFICATE` (machine determinants live), `MCS-1-RM-2-SUFFICIENCY-CERTIFICATION` (complete determinant set; CERTIFIED) |
| Anchors of record (immutable references) | HEAD `519aed95cef03b33afd16bf5ea43a8326ca13c57` · tree `28b819105339183edcad616668b78904b8e2d9db` · tracked-index `d0d6091486…af0a` · **RM-2 content anchor** `4416b3a776…ca7ca` · upstream 0/0 |
| Binding invariants | **O-1** authorization-of-record commits **first, atomically, no-split** · **O-2** **no** history rewrite (`reset --hard`, `--amend`-on-pushed, `rebase`, `filter-branch`, `push --force`) · **O-3** recoverable pre-push, forward-only after push |
| Governance status | INV-1..13 unchanged; AD-0014 intact; Article IX generation lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |
| **Determination** | **RM-2 EXECUTION SPECIFICATION READY** — RM-2 can be conducted, observed, recorded, evidenced, verified, and handed to RM-3 using this specification alone (§ Required Determination). |

> **How to use this specification.** This artifact is the **operating procedure** for RM-2. It presumes G-A is
> already CLOSED (HA-1..HA-7 complete, recorded in `MCS-1-G-A-ACTIVATION-CONTROL-REGISTER`) and that Pre-Flight
> PC-1..PC-8 will be re-verified at RM-2 time. It executes nothing: every record field below is a blank template
> the Executor completes **live** during RM-2. It defines the boundary at both ends — where RM-2 legally begins
> (RM-2 GO) and where it legally ends and hands to RM-3 (RM-2 COMPLETE).

---

## 1. RM-2 Mission Statement

**Mission.** Under the signed RM-1 preservation authorization, make the **authorization-of-record durable** by
enrolling the signed RM-1 minute append-only into `AUTH-012-DECISION-LOG.md` and committing it together with the
complete set of **32 authorization-of-record inputs** in **exactly one atomic commit** on branch
`phase-10-implementation-readiness`, with **no content edits**, **no split**, **no history rewrite**, and full
**pre-push recoverability** — producing a governed, auditable RM-2 commit that becomes the anchor point for the
`authority-restoration-v1.0.13` tag (applied later at RM-6) and the ordered predecessor of RM-3.

**Mission is accomplished when** a single commit whose parent is `519aed9` exists locally, carries the enrolled
minute as its first content plus the 32 inputs and nothing else, is verified against the pre-state evidence, is
**not pushed** (push is RM-5), and a signed RM-2 completion record + RM-3 handover token exist.

**Mission explicitly does NOT** commit implementation (RM-3), commit evidence (RM-4), push (RM-5), tag (RM-6),
reconcile `main` (RM-7), or perform independent verification (RM-8); nor does it release Article IX, lift
`UCOS-CONSTRUCTION-BLOCKED`, authorize CW-0/construction, award certification, or issue AD-0024/0025/0026.

---

## 2. RM-2 Execution Scope

### 2.1 Permitted Actions (closed list — nothing outside this list is authorized)

| # | Permitted action | Constraint |
|:-:|------------------|-----------|
| P-1 | Re-run **read-only** Pre-Flight verification (`rev-parse`, `rev-list --count`, `ls-files`, `status`, `diff`, `hash-object`, `shasum`) | No mutation; PC-1..PC-8 must all PASS |
| P-2 | **Append** the signed RM-1 minute into `AUTH-012-DECISION-LOG.md` (append-only, AUTH-012 §9 one-bump-one-record) as the **first content** of the RM-2 commit | Append-only; no rewrite of existing ledger lines; version bump recorded |
| P-3 | `git add` **exactly** the 32 authorization-of-record inputs (explicit path list) | No wildcard staging; no RM-3/RM-4 inputs; staged set == 32 exact paths |
| P-4 | `git commit` **once** — the atomic authorization-of-record commit (O-1) | Single commit; governed message; parent == `519aed9` |
| P-5 | Capture read-only post-commit evidence (`show --stat`, `rev-parse`, `cat-file`, `ls-tree`) | No mutation |
| P-6 | Non-destructive **pre-push** recovery if required (`git restore`, `git restore --staged`, path `checkout`, branch recreate to `519aed9`) | O-2/O-3 conformant; **never** `reset --hard`/`--amend`(pushed)/`rebase`/`filter-branch`/`push --force` |

### 2.2 Prohibited Actions (any occurrence → fail-closed; see § 5)

| # | Prohibited action | Rule |
|:-:|-------------------|------|
| X-1 | Editing the **content** of any of the 32 inputs (beyond the AUTH-012 append enrollment) | Preservation-only; SG-1 |
| X-2 | Splitting the authorization-of-record across more than one commit | **O-1 breach** |
| X-3 | Staging any file outside the 32 inputs (RM-3 implementation, RM-4 evidence, `.gitignore`, README, `src/**`, `architecture/**`) | Scope/no-split breach |
| X-4 | Any history rewrite: `reset --hard`, `--amend` on a pushed commit, `rebase`, `filter-branch`, `push --force` | **O-2 breach** |
| X-5 | **Pushing** during RM-2 (push is RM-5) | Out-of-sequence |
| X-6 | **Tagging** during RM-2 (tagging is RM-6; the `authority-restoration-v1.0.13` tag *targets* the RM-2 commit but is applied at RM-6) | Out-of-sequence |
| X-7 | Signing the minute in modified form / enrolling text ≠ adopted minute | **VOID**; SG-1/FC-1 |
| X-8 | Proceeding on any Pre-Flight FAIL or S0′/anchor drift | Fail-closed |
| X-9 | Scope expansion (Article IX release / BLOCKED lift / CW-0 / construction / certification / AD-0024/25/26) | **VOID**; SG-1 |

### 2.3 Expected Artifacts (produced by RM-2)

- **The RM-2 commit** — one atomic commit, parent `519aed9`, containing the enrolled minute + 32 inputs.
- **`AUTH-012-DECISION-LOG.md`** updated append-only (minute enrolled as first content; version-bumped per §9).
- **RM-2 evidence bundle** (RM2-EV-1..RM2-EV-9; § 4) — pre-state, enrollment, staged-set, commit, post-state.
- **RM-2 Completion Certificate** (§ 7) — signed by the named Executor.
- **RM-3 Handover Token** (§ 8) — RM-2 commit SHA + verified state + ordering gate.

### 2.4 Expected Outputs (state after RM-2 COMPLETE)

- Branch `phase-10-implementation-readiness` local HEAD advanced by **exactly one** commit (RM-2 commit); parent `519aed9`.
- Working tree: the 32 inputs committed; **modified** working set reduced accordingly; **no push performed** (origin unchanged; local ahead by 1).
- Gates: G-A/G-F/G-G remain CLOSED; O-1 satisfied (single atomic commit); O-2 preserved (no rewrite); O-3 satisfied (origin untouched ⇒ recoverable).
- Ready state for RM-3 (implementation commit) under its ordering gate.

---

## 3. RM-2 Ceremony Sequence (RM-2 GO → RM-2 COMPLETE)

> **Precondition to enter:** G-A CLOSED (HA-1..HA-7 recorded) and the RM-1 minute signed/enrolled-intent of
> record. The sequence is **strictly ordered**; a failed step halts the ceremony (fail-closed) and routes to § 5.

| Step | Ceremony act | Actor | Depends on | Boundary |
|:----:|--------------|-------|-----------|----------|
| **RM-2 GO** | Re-verify **Pre-Flight PC-1..PC-8** against S0′; on **all-PASS**, RM-2 is GO | Executor | G-A closed | **START** |
| **E-1** | Capture **pre-state evidence** (RM2-EV-1): HEAD/tree/branch/upstream, counts (347/0/7, src 0/138, AD 0/8), tracked-index digest `d0d60914…`, **`RM2-CONTENT-ANCHOR` recompute == `4416b3a7…`** | Executor | RM-2 GO | — |
| **E-2** | **Enroll** the signed RM-1 minute append-only into `AUTH-012-DECISION-LOG.md` (first content; §9 one-bump-one-record); capture enrollment evidence (RM2-EV-2) — minute text hash == adopted | Executor | E-1 | first content |
| **E-3** | `git add` **exactly** the 32 authorization-of-record inputs (explicit path list, incl. the just-updated `AUTH-012`); capture staged-set evidence (RM2-EV-3) | Executor | E-2 | — |
| **E-4** | **Verify staged set** == the 32 inputs, **no more, no less** (O-1 no-split guard); confirm nothing outside scope staged (RM2-EV-4) | Executor | E-3 | O-1 gate |
| **E-5** | **`git commit` once** — the atomic authorization-of-record commit (governed message; O-1); capture the RM-2 commit SHA (RM2-EV-5) | Executor | E-4 | atomic commit |
| **E-6** | Capture **post-commit evidence** (RM2-EV-6): `rev-parse HEAD` == RM-2 SHA; parent == `519aed9`; `show --stat` == 32 paths; tree/object integrity | Executor | E-5 | — |
| **E-7** | **Verify** the commit against pre-state: exactly +1 commit; parent correct; contents == enrolled minute + 32 inputs; **no push performed** (upstream/origin unchanged) (RM2-EV-7) | Executor | E-6 | verification gate |
| **E-8** | **Recoverability check** (RM2-EV-8): confirm origin still at pre-RM-2 state (ahead 1 / behind 0), so RM-2 is reversible pre-push via non-rewrite means only (O-3) | Executor | E-7 | O-3 gate |
| **E-9** | Complete the **RM-2 Completion Certificate** (§ 7) + emit **RM-3 Handover Token** (§ 8) (RM2-EV-9) | Executor | E-8 | — |
| **RM-2 COMPLETE** | All completion criteria (§ 4/§ 7) met; certificate signed; handover token issued | Executor | E-9 | **END** |

*(RM-2 performs no push and no tag. The `authority-restoration-v1.0.13` tag targets the RM-2 commit but is
applied at RM-6; the push occurs at RM-5.)*

```
RM-2 GO ──▶ E-1 pre-state ──▶ E-2 enroll minute ──▶ E-3 stage 32 ──▶ E-4 staged-set gate (O-1)
   │                                                                          │
   └── any FAIL ─▶ § 5 (PAUSE/ABORT/VOID/ROLLBACK, fail-closed)               ▼
                                                          E-5 atomic commit ──▶ E-6 post-state
                                                                          │
                                    RM-2 COMPLETE ◀── E-9 cert+handover ◀── E-8 O-3 ◀── E-7 verify
```

---

## 4. Evidence Capture Plan

For every RM-2 step: **Evidence Produced · Evidence Owner · Storage Location · Verification Method.** All fields
are blank templates completed live by the Executor. Evidence is **append-only** and stored as an untracked
governance record adjacent to this specification (permitted by the S0′ tolerance rule) until it is itself made
durable in RM-4 (evidence corpus).

| ID | Step | Evidence Produced | Evidence Owner | Storage Location | Verification Method |
|:--:|:----:|-------------------|----------------|------------------|---------------------|
| **RM2-EV-1** | E-1 | Pre-state snapshot: `rev-parse HEAD/tree`, branch, `rev-list --count @{u}..HEAD`+`HEAD..@{u}`, `ls-files \| wc`, staged/modified counts, tracked-index digest, `RM2-CONTENT-ANCHOR` recompute | Executor | `RM2-EV/` record (untracked gov `*.md`) → RM-4 durable | Compare to S0′ anchors: HEAD `519aed9`, tree `28b8191…`, digest `d0d60914…`, anchor `4416b3a7…`, 347/0/7, upstream 0/0 |
| **RM2-EV-2** | E-2 | Enrollment diff of `AUTH-012` (append-only lines) + enrolled-minute text hash + §9 version bump | Executor | `RM2-EV/` record | Minute text hash == adopted minute hash (HA-1); diff is **append-only** (no prior line changed) |
| **RM2-EV-3** | E-3 | `git status --porcelain` staged listing (the 32 paths) | Executor | `RM2-EV/` record | Staged paths == the 32 canonical input paths (set equality) |
| **RM2-EV-4** | E-4 | Staged-set completeness/exclusivity attestation | Executor | `RM2-EV/` record | `|staged| == 32`; ∅ outside the 32; O-1 no-split confirmed |
| **RM2-EV-5** | E-5 | RM-2 commit SHA + governed commit message | Executor | `RM2-EV/` record | Exactly one new commit; message conforms; `rev-list --count` +1 |
| **RM2-EV-6** | E-6 | `git show --stat`, `rev-parse HEAD`, `rev-parse HEAD^`, `ls-tree` of commit | Executor | `RM2-EV/` record | Parent == `519aed9`; changed paths == 32; tree resolvable |
| **RM2-EV-7** | E-7 | Verification report: delta vs pre-state; push-state (origin unchanged) | Executor | `RM2-EV/` record | +1 commit only; contents == minute+32; **no push**; upstream ahead 1 / behind 0 |
| **RM2-EV-8** | E-8 | Recoverability attestation (pre-push reversibility via non-rewrite means) | Executor | `RM2-EV/` record | Origin at pre-RM-2 state; recovery path uses only `restore`/`checkout`/branch-recreate (no O-2 op) |
| **RM2-EV-9** | E-9 | Signed RM-2 Completion Certificate + RM-3 Handover Token | Executor | `RM2-EV/` record | § 7 criteria all ✔; token carries RM-2 SHA + verified state |

**Custody & separation.** The Executor owns capture; the RM-8 Adjudicator (or *pending `REAL-C-05`*)
independently re-derives RM2-EV-1/5/6/7 post-push at RM-8 using the same read-only methods (SG-4: Adjudicator ≠
Executor). The Custodian retains oversight but does not execute.

---

## 5. Verification Framework

### 5.1 Success Criteria (RM-2 SUCCESS ⟺ all hold)

| ID | Success criterion |
|:--:|-------------------|
| S-1 | Pre-Flight PC-1..PC-8 all PASS at RM-2 GO (S0′ + `RM2-CONTENT-ANCHOR 4416b3a7…`) |
| S-2 | Signed minute enrolled append-only into `AUTH-012`; enrolled text hash == adopted minute (HA-1) |
| S-3 | Staged set == the 32 inputs exactly (O-1 no-split) |
| S-4 | Exactly **one** atomic commit created; parent == `519aed9`; contents == minute + 32 inputs and nothing else |
| S-5 | No push, no tag, no content edit beyond the append enrollment |
| S-6 | Post-commit verification (RM2-EV-6/7) matches expectation; +1 commit only |
| S-7 | O-1 ✔ (no-split), O-2 ✔ (no-rewrite), O-3 ✔ (origin unchanged ⇒ recoverable) |
| S-8 | RM-2 Completion Certificate signed + RM-3 Handover Token issued |

### 5.2 Failure Criteria (any → RM-2 FAILED / halt)

| ID | Failure criterion | Effect |
|:--:|-------------------|--------|
| F-1 | Any Pre-Flight PC fails at GO, or S0′/anchor drift detected | **NO-GO** (do not begin) |
| F-2 | Enrolled minute text ≠ adopted minute, or enrollment not append-only | **VOID** (re-open review) |
| F-3 | Staged set ≠ 32 (missing/extra), or split across commits | **ABORT** → correct → restage |
| F-4 | More than one commit created for the authorization-of-record | **O-1 breach → ROLLBACK** (pre-push) |
| F-5 | Any prohibited git op observed (X-4) | **VOID / O-2 breach** |
| F-6 | Push or tag performed during RM-2 | **out-of-sequence → halt + review** |

### 5.3 Abort Criteria (stop, correct, restart the affected step — recoverable)

- AB-1 Staged set incorrect **before** commit (F-3) — abort staging, `git restore --staged`, restage the 32.
- AB-2 Enrollment append malformed **before** commit — abort, `git restore AUTH-012-DECISION-LOG.md`, re-enroll.
- AB-3 Transient environment/tooling error before commit — abort step, re-verify pre-state (RM2-EV-1), resume.
- AB-4 Ambiguity about scope/authority discovered mid-step — abort, escalate to Custodian, do-not-proceed default.

### 5.4 Rollback Criteria (pre-push only; O-2/O-3 conformant)

- RB-1 **Trigger:** an incorrect commit was created (F-4) but **not pushed** (origin unchanged, RM-5 not run).
- RB-2 **Method (non-rewrite only):** recreate the branch pointer at `519aed9` via a governed non-destructive
  operation (e.g., `git switch -c` from `519aed9` / branch recreate; `git restore` working tree), **never**
  `reset --hard`, `--amend`(pushed), `rebase`, `filter-branch`, or `push --force`.
- RB-3 **Guarantee:** because RM-2 performs **no push**, the authoritative remote still holds the pre-RM-2 state;
  recovery therefore requires no history rewrite (O-2 preserved) and is complete (O-3 recoverable-pre-push).
- RB-4 **Post-push:** once RM-5 has pushed, RM-2 is **forward-only** (O-3) — errors are corrected by a new
  forward commit, never by rewriting the pushed RM-2 commit.
- RB-5 **After any rollback:** re-enter at **RM-2 GO** and re-run Pre-Flight (fail-closed) before retrying.

---

## 6. O-1 / O-2 Compliance Matrix

Demonstrates that the RM-2 ceremony is compliant with **No-Split (O-1)**, **No-Rewrite (O-2)**, and
**Recoverable-at-Every-Point (O-3)** at every step.

| Step | No-Split (O-1) | No-Rewrite (O-2) | Recoverable-at-Every-Point (O-3) |
|:----:|----------------|------------------|----------------------------------|
| RM-2 GO | Single-commit intent fixed; nothing staged | Read-only Pre-Flight; no mutating op | Nothing changed; trivially recoverable |
| E-1 | n/a (evidence only) | Read-only capture | State == pre-RM-2; recoverable |
| E-2 enroll | Enrollment is *content of the one commit*, not a separate commit | **Append-only** to `AUTH-012` (no line rewrite); no history op | Working-tree append reversible via `git restore` (no rewrite) |
| E-3 stage | Explicit 32-path stage; no partial/selective split | `git add` only (no rewrite) | `git restore --staged` reverses staging (no rewrite) |
| E-4 gate | **Verifies** staged set == 32 (the O-1 checkpoint) | Read-only verification | Un-stage restores prior state |
| E-5 commit | **Exactly one** atomic commit binds AD records **and** their `AUTH-012` enrollment together (closes RR-8) | `git commit` only — never `reset --hard`/`--amend`(pushed)/`rebase`/`filter-branch` | Pre-push: origin unchanged ⇒ commit reversible via non-rewrite branch recreate |
| E-6/E-7 verify | Confirms single commit, no split | Read-only inspection | Pre-push; fully recoverable |
| E-8 | n/a | No push (origin intact) | **O-3 explicitly attested**: recoverable because unpushed |
| E-9 / COMPLETE | One commit delivered | No rewrite performed anywhere in RM-2 | Recoverable until RM-5 push; forward-only thereafter |

**Compliance summary:** O-1 holds because the authorization-of-record (32 inputs incl. the minute-enrolled
`AUTH-012`) lands in a **single** commit with a pre-commit staged-set gate (E-4) forbidding split. O-2 holds
because RM-2 uses **only** `add`/`commit` (+ read-only verification and, if needed, non-destructive
`restore`/`checkout`/branch-recreate) — **zero** rewrite operations. O-3 holds because RM-2 performs **no push**;
the authoritative remote remains at the pre-RM-2 state throughout, so every point up to RM-2 COMPLETE is
recoverable without rewriting history, and the record becomes forward-only only after the RM-5 push.

---

## 7. RM-2 Completion Certificate Template

> **Blank template — completed and signed by the named Executor at RM-2 COMPLETE. This artifact does not sign it.**

```
────────────────────────────────────────────────────────────
        MCS-1 — RM-2 COMPLETION CERTIFICATE
────────────────────────────────────────────────────────────
Certificate ID ......... RM2-COMPLETE-________
RM-1 authorization ..... signed minute ref ________ (text hash ________ == adopted)
Executor (of record) ... ____________________ (single, accountable)
Custodian (oversight) .. ____________________ (≠ Executor)
RM-8 Adjudicator ....... ____________________ or  ☐ pending REAL-C-05  (≠ Executor, SG-4)
Date/time (UTC) ........ ____________________

── Pre-state (RM2-EV-1) ──────────────────────────────────────
HEAD (pre) ............. 519aed95cef03b33afd16bf5ea43a8326ca13c57   ☐ verified
tree (pre) ............. 28b819105339183edcad616668b78904b8e2d9db   ☐ verified
tracked-index digest ... d0d6091486…af0a                            ☐ verified
RM2-CONTENT-ANCHOR ..... 4416b3a776…ca7ca                           ☐ recomputed==match
branch / upstream ...... phase-10-implementation-readiness / 0-0    ☐ verified
counts ................. tracked 347 · staged 0 · modified 7 · src 0/138 · AD 0/8  ☐ verified

── RM-2 result ───────────────────────────────────────────────
Minute enrolled append-only into AUTH-012 (first content) .......... ☐  (RM2-EV-2)
Staged set == 32 authorization-of-record inputs (no split) ......... ☐  (RM2-EV-3/4)
Exactly ONE atomic commit created (O-1) ............................ ☐  (RM2-EV-5)
RM-2 commit SHA .................................................... ________________
Commit parent == 519aed9 ........................................... ☐  (RM2-EV-6)
Commit contents == enrolled minute + 32 inputs (and nothing else) .. ☐  (RM2-EV-6/7)
No push performed (push = RM-5) .................................... ☐
No tag performed (tag = RM-6; targets this commit) ................. ☐
No content edit beyond append enrollment (SG-1) .................... ☐

── Invariant attestation ─────────────────────────────────────
O-1 no-split ...... ☐   O-2 no-rewrite ...... ☐   O-3 recoverable-pre-push ...... ☐

── Outcome ───────────────────────────────────────────────────
Result: ☐ SUCCESS  ☐ ABORTED  ☐ ROLLED-BACK  ☐ VOID
Gates: G-A ☐closed  G-F ☐closed  G-G ☐closed  (unchanged by RM-2)
Evidence bundle RM2-EV-1..9 complete & append-only ................. ☐
Executor signature ................................................. ____________________
────────────────────────────────────────────────────────────
RM-2 is COMPLETE only when every box above is ✔ and Result == SUCCESS.
────────────────────────────────────────────────────────────
```

---

## 8. RM-2 Handover Specification (→ RM-3)

**Handover contract.** RM-2 hands to **RM-3 (COMMIT implementation — `platform-runtime/**` + `architecture/**`
+ EA/README)** only when RM-2 SUCCESS is certified. RM-3 is the next ordered commit; it must not begin before
RM-2 COMPLETE (the RM-3 ordering gate that, together with the clean-index check, prevents any O-1 pre-split).

### 8.1 Handover Token (emitted by E-9)

```
RM-3 HANDOVER TOKEN
  from ................. RM-2 COMPLETE (SUCCESS)
  RM-2 commit SHA ...... ________________  (parent 519aed9)
  branch ............... phase-10-implementation-readiness  (local ahead 1 / behind 0, UNPUSHED)
  invariants ........... O-1 ✔  O-2 ✔  O-3 ✔ (recoverable, unpushed)
  authorization ........ RM-1 signed minute enrolled in AUTH-012 (durable-in-commit)
  scope-next ........... RM-3 implementation commit ONLY (no push, no tag)
  executor ............. ____________________ (same accountable party, RM-2..RM-7)
```

### 8.2 Required Handover Evidence

- HE-1 Signed RM-2 Completion Certificate (§ 7) with Result == SUCCESS.
- HE-2 RM-2 commit SHA + verified parent (`519aed9`) + verified contents (32 inputs incl. enrolled minute).
- HE-3 Evidence bundle RM2-EV-1..9 (append-only), pre-state and post-state.
- HE-4 Push-state attestation: **no push performed** (origin unchanged; ready for RM-5, not now).
- HE-5 Invariant attestation (O-1/O-2/O-3) carried forward.

### 8.3 RM-3 Entry (Completion) Gates — all must hold before RM-3 begins

| Gate | Requirement |
|:----:|-------------|
| **HG-1** | RM-2 Result == SUCCESS; certificate signed (HE-1) |
| **HG-2** | RM-2 commit present, verified; HEAD == RM-2 SHA; parent == `519aed9` |
| **HG-3** | Index **clean** again (staged 0) after the RM-2 commit — the O-1 anti-split guard for RM-3 |
| **HG-4** | No push/tag occurred in RM-2 (sequence intact; RM-5/RM-6 still pending) |
| **HG-5** | Same named Executor; authorization not revoked (G-G live); O-2 commitment still binding |
| **HG-6** | RM-3 scope confirmed = implementation inputs only (`platform-runtime/**`, `architecture/**`, EA/README) — disjoint from the 32 RM-2 inputs |

**On all HG-1..HG-6 PASS → RM-3 GO.** Any gate failing → RM-3 NO-GO (fail-closed; do-not-begin). RM-3 then
follows its own ceremony (analogous to §§ 3–7), tagged conceptually by `pi2-pi9-implementation-v1.0.0` at its
commit (tag applied at RM-6).

---

## 9. Specification Certification

- **Conduct defined:** § 3 gives the exact ordered ceremony RM-2 GO → RM-2 COMPLETE with dependencies. ✔
- **Observation/recording defined:** § 4 assigns for every step the evidence produced, owner, storage, and verification method. ✔
- **Evidence defined:** RM2-EV-1..9 (§ 4) + Completion Certificate (§ 7) + Handover Token (§ 8). ✔
- **Verification defined:** § 5 gives success / failure / abort / rollback criteria, all fail-closed. ✔
- **Invariant compliance demonstrated:** § 6 matrix shows No-Split / No-Rewrite / Recoverable-at-Every-Point per step. ✔
- **Handoff defined:** § 8 specifies the RM-3 contract, evidence, and completion gates. ✔
- **Non-executing:** all record fields are blank templates; no activation, signature, appointment, execution, or `git` mutation performed. ✔

---

## Required Determination

> # **RM-2 EXECUTION SPECIFICATION READY**
>
> RM-2 can be **conducted, observed, recorded, evidenced, verified, and handed off to RM-3 using this
> specification alone.** It defines the mission (§ 1), the closed permitted/prohibited scope and expected
> artifacts/outputs (§ 2), the exact ceremony sequence RM-2 GO → RM-2 COMPLETE (§ 3), the per-step evidence
> capture plan with owners/storage/verification (§ 4), the success/failure/abort/rollback verification framework
> (§ 5), the O-1/O-2/O-3 compliance matrix demonstrating No-Split, No-Rewrite, and Recoverable-at-Every-Point
> (§ 6), the exact RM-2 Completion Certificate template (§ 7), and the RM-3 handover specification with required
> evidence and entry gates (§ 8).
>
> All machine anchors of record are fixed (HEAD `519aed9`, tree `28b8191…`, tracked-index `d0d6091486…af0a`,
> content anchor `4416b3a776…ca7ca`, upstream 0/0). RM-2 remains **not yet executed**: entry requires G-A
> CLOSED and Pre-Flight PC-1..PC-8 all-PASS at RM-2 time. The specification is fail-closed at every gate and
> preserves O-1/O-2/O-3 throughout.
>
> No activation, signature, appointment, execution, or mutation was performed by this artifact. The Article IX
> generation lock and `UCOS-CONSTRUCTION-BLOCKED` remain in force; `REAL-C-05` remains separate and
> non-blocking for the durability verdict.

---

## Governance / Non-Execution Statement

No RM step executed; no signature created; no participant appointed; no `git` mutation, commit, push, tag,
branch, or config change performed; no authorization activated; no lock released; no invariant enrolled; no
governance modified. This is an execution **specification** with blank record fields; the only repository effect
is this additive governance `*.md`, permitted by the S0′ tolerance rule and outside the `RM2-CONTENT-ANCHOR`
protected set. RM-1/RM-2 remain Approval-Required Operations (AUTH-012 §8 / AD-0009). INV-1..13, `AUTH-012`
substance (v1.0.13), AD-0014, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged.

## Traceability
- **Consumes (authoritative):** `MCS-1-G-A-ACTIVATION-CONTROL-REGISTER`, `MCS-1-G-A-GOVERNANCE-ACTIVATION-DOSSIER`, `MCS-1-RM-2-ACTIVATION-READINESS-CERTIFICATE`, `MCS-1-RM-2-SUFFICIENCY-CERTIFICATION`.
- **Produces:** the RM-2 execution ceremony & evidence specification (mission, scope, ceremony, evidence plan, verification framework, O-1/O-2/O-3 matrix, completion certificate template, RM-3 handover).
- **Feeds:** the live RM-2 execution (post-activation, post-Pre-Flight-GO) and the RM-2 → RM-3 handover gate.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); independent adjudicator to be designated (`REAL-C-05`).

**END MCS-1-RM-2-EXECUTION-CEREMONY-SPECIFICATION — PHASE U29 · MISSION / SCOPE / CEREMONY (GO→COMPLETE) /
EVIDENCE PLAN (RM2-EV-1..9) / VERIFICATION (SUCCESS·FAILURE·ABORT·ROLLBACK) / O-1·O-2·O-3 MATRIX / COMPLETION
CERTIFICATE TEMPLATE / RM-3 HANDOVER · ANCHORS OF RECORD FIXED (`d0d60914…` / `4416b3a7…`) · **RM-2 EXECUTION
SPECIFICATION READY** · NO EXECUTION / NO ACTIVATION / NO SIGNATURE / NO APPOINTMENT / NO MUTATION PERFORMED BY
THIS ARTIFACT.**
