# MCS-1 — REAL-M-07 Execution Wave Specification (RM-2 → RM-7)

## PHASE U31 — Integrated Execution-Wave Specification Governing RM-2..RM-7 as One Program (Specification Only — No Execution)

| Field | Value |
|-------|-------|
| Artifact | **MCS-1 — REAL-M-07 Execution Wave Specification** |
| Artifact ID | `MCS-1-REAL-M-07-EXECUTION-WAVE-SPECIFICATION` |
| Phase | **U31 — REAL-M-07 Execution Wave Specification** |
| Layer | GOVERNANCE / EXECUTION-ASSURANCE (execution-wave specification — defines how RM-2..RM-7 run as one program; runs nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **EXECUTION-WAVE SPECIFICATION ONLY** — specify the complete integrated program RM-2..RM-7 (mission, dependency graph, per-RM sequence register, evidence chain, checkpoints, rollback/recovery). **No activation, no execution, no `git` mutation, no signatures (beyond this additive governance `*.md`, permitted by the S0′ tolerance rule).** All record fields are **blank templates** completed live by the named Executor. Append-only. |
| Authoritative inputs (per mandate) | `MCS-1-RM-2-ACTIVATION-AND-PREFLIGHT-PACKAGE` (activation + PF-1..PF-8 + GO/NO-GO), `MCS-1-RM-2-EXECUTION-CEREMONY-SPECIFICATION` (RM-2 conduct/evidence), `MCS-1-G-A-ACTIVATION-CONTROL-REGISTER` (registers), `MCS-1-RM-2-SUFFICIENCY-CERTIFICATION` (complete determinant set) |
| Wave source-of-truth | `REAL-M-07-REMEDIATION-PLAN` (RM-1..RM-8 content-preserving sequence; RR-1..RR-8 closure map) |
| Anchors of record (immutable references) | HEAD `519aed95cef03b33afd16bf5ea43a8326ca13c57` · tree `28b819105339183edcad616668b78904b8e2d9db` · tracked-index `d0d6091486…af0a` · **RM-2 content anchor** `4416b3a776…ca7ca` · upstream 0/0 · tracked 347 · src 0/138 · AD 0/8 |
| Canonical tags | `authority-restoration-v1.0.13` (@ RM-2 commit) · `pi2-pi9-implementation-v1.0.0` (@ RM-3 commit) |
| Binding invariants | **O-1** authorization-of-record commits first, atomically, no-split · **O-2** no history rewrite (`reset --hard`, `--amend`-on-pushed, `rebase`, `filter-branch`, `push --force`) · **O-3** recoverable pre-push (non-destructive `reset --soft`/`restore`), forward-only after push |
| Governance status | INV-1..13 unchanged; AD-0014 intact; Article IX generation lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |
| **Determination** | **EXECUTION WAVE READY** — RM-2..RM-7 is fully specified as one executable, checkpointed, recoverable program (§ Required Determination). |

> **Scope boundary.** This wave covers **RM-2 (commit authorization-of-record) → RM-7 (reconcile `main`)**.
> **RM-1** (Board authorization / G-A) is a precondition governed by the U30 package and is presumed CLOSED at
> entry. **RM-8** (independent verification) is downstream of this wave (post-push, distinct-actor; `REAL-C-05`)
> and is the wave's handoff target, not a wave step. The wave executes nothing — all fields are blank templates.

---

## 1. Execution Wave Mission

**Mission.** Under the signed RM-1 preservation authorization, execute RM-2..RM-7 as **one ordered,
content-preserving, fail-closed program** that converts `REAL-M-07` from **FAIL → PASS** by making the entire
post-PI-1 corpus durable — **without editing any content, without splitting authorization from its ledger, and
without rewriting history** — and leaves the branch-of-truth unambiguous.

**The wave, in one line:** commit the authorization-of-record atomically first (RM-2), then the implementation
(RM-3), then the evidence corpus (RM-4), push all three off-machine (RM-5), create immutable recovery tags
(RM-6), and reconcile the stale `main` side-line (RM-7) — closing RR-1..RR-8.

**Mission accomplished when** the working tree is clean (0 untracked-excl-ignored / 0 modified), all commits are
on `origin` (`0 0`), both canonical tags are pushed and verify, `main` disposition is recorded, and the wave
completion certificate + RM-8 handoff token are issued — all under O-1/O-2/O-3.

**Mission explicitly does NOT** release Article IX, lift `UCOS-CONSTRUCTION-BLOCKED`, authorize
CW-0/construction, award/upgrade/revoke certification, or issue AD-0024/0025/0026. It is preservation only.

---

## 2. RM-2 → RM-7 Dependency Graph

```
              [ RM-1 AUTHORIZE / G-A CLOSED — precondition, U30 package ]
                                     │  (RM-2 GO on Pre-Flight PC/PF all-PASS)
                                     ▼
        ┌──────────────────── LOCAL / PRE-PUSH (O-3: fully recoverable) ────────────────────┐
        │                                                                                    │
  RM-2 COMMIT authorization-of-record (32 inputs, ATOMIC, O-1)                               │
        │  ▸ Checkpoint A                                                                     │
        ▼                                                                                     │
  RM-3 COMMIT implementation (platform-runtime/** + architecture/** + EA/README)             │
        │  ▸ Checkpoint B                                                                     │
        ▼                                                                                     │
  RM-4 COMMIT evidence corpus (PI*/ONTO*/MEM*/U-phase/UCOM-*/REAL-*/CONST-READY)             │
        │  ▸ Checkpoint C  ← LAST fully-reversible point (pre-push)                            │
        └────────────────────────────────────────────────────────────────────────────────────┘
                                     │
        ┌──────────────────── PUBLISHED / POST-PUSH (O-3: forward-only) ─────────────────────┐
        ▼                                                                                     │
  RM-5 PUSH branch to origin  (carries RM-2..RM-4 — the durability event)                    │
        │                                                                                     │
        ▼                                                                                     │
  RM-6 TAG milestones + verify  (authority-restoration@RM-2 ; pi2-pi9-impl@RM-3 ; push tags) │
        │  ▸ Checkpoint D                                                                     │
        ▼                                                                                     │
  RM-7 RECONCILE stale `main` side-line (+4 unpushed Phase-9 audits; PARK default)           │
        │  ▸ Checkpoint E                                                                     │
        └────────────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
                    [ RM-8 INDEPENDENT VERIFY — downstream handoff (out of wave) ]
```

**Hard ordering rules:** RM-2 ≺ RM-3 ≺ RM-4 (authorization precedes the code/evidence it authorizes; O-1 no-split
at RM-2). RM-5 requires RM-2..RM-4 commits to exist. RM-6 requires RM-5 (tags reference pushed commits). RM-7 is
after RM-5 (working branch is the durable source of truth first); independent of RM-8. **The O-3 pre-push/​
post-push boundary falls between RM-4 (Checkpoint C) and RM-5.**

---

## 3. Execution Sequence Register (per-RM: Mission · Inputs · Outputs · Success · Failure · Abort)

### RM-2 — Commit the authorization-of-record (FIRST, atomic)
- **Mission:** Enroll the signed RM-1 minute append-only into `AUTH-012` and commit it with the 32 authorization-of-record inputs in **one** atomic commit (O-1).
- **Inputs:** Signed RM-1 minute; the 32 inputs — modified-tracked `AUTH-012-DECISION-LOG.md` (v1.0.13), `AUTHORITY-INDEX.md`, `UCOS-ARTIFACT-REGISTRY.md`, `PROJECT-STATE.md`; untracked `AD-0016..0023`, `AUTH-REST-001..004`, `AUTH-CONST-001`, `GOV-REC-001`, `INT-AUTH-001..004`, `INT-AUTH-REV-001..004`, `ONTO-AUTH-REV-001..004`, `FGA-2-ARTICLE-IX-RELEASE-REVIEW`; Pre-Flight all-PASS.
- **Outputs:** One RM-2 commit (parent `519aed9`); `AUTH-012` updated append-only; RM-2 commit SHA recorded.
- **Success:** `git show --stat` lists `AUTH-012` **and** all 8 AD records in the same commit; `ls-files | grep -c '^AD-00'` → 8; ledger header `v1.0.13`; content byte-identical to working tree; exactly +1 commit.
- **Failure:** enrolled minute ≠ adopted text; split across commits (O-1 breach); staged set ≠ 32; any content edit beyond the append; any prohibited op (O-2).
- **Abort:** staged-set incorrect **before** commit → `git restore --staged` + restage; malformed enrollment → `git restore AUTH-012-DECISION-LOG.md` + re-enroll.

### RM-3 — Commit the implementation
- **Mission:** Make the PI-2..PI-9 substrate + architecture durable and the 269/269 baseline history-reproducible.
- **Inputs:** RM-2 COMPLETE (Checkpoint A); `packages/platform-runtime/{src(138),test,bin,examples,package.json,tsconfig.json}`; `architecture/**`; modified `docs/enterprise-architecture/UCOS-ENTERPRISE-ARCHITECTURE.md`; modified `packages/platform-runtime/README.md`. (`node_modules/`, `*.tsbuildinfo` stay ignored.)
- **Outputs:** RM-3 commit (parent = RM-2); source tree no longer untracked; RM-3 commit SHA recorded.
- **Success:** `ls-files | grep -c platform-runtime/src/` → **138**; from a **fresh checkout** of the commit, `tsc --noEmit` clean and `node --test` → **269/269**; `git status` shows source no longer untracked.
- **Failure:** src count ≠ 138; build/test not reproducible from history; implementation split incorrectly; RM-2 not first.
- **Abort:** wrong staged set before commit → `git reset --soft HEAD~1` (if committed) / `git restore --staged` + restage; non-destructive only.

### RM-4 — Commit the evidence corpus
- **Mission:** Preserve all certification-grade evidence, U-phase audits, and reconciliation chain durable.
- **Inputs:** RM-3 COMPLETE (Checkpoint B); `PI5..PI7-*`, `ONTO-*`, `MEM-*`, `ULT-GAP-001`, `ROADMAP-ULT-001`, `REAL-*`, `OP-CERT-001`, `UCOM-*`, `UA-05/UA-10`, `EXIST-001`, `CONST-READY-*`, `RA-1/RA-2`, remaining untracked governance records (incl. U23..U31 governance `*.md`).
- **Outputs:** RM-4 commit(s) (parent = RM-3); working tree clean; SHA(s) recorded.
- **Success:** `git status` → **0 untracked (excl. ignored) · 0 modified**; `ls-files | wc -l` increased by committed count; every `REAL-*`/`UCOM-*`/`ONTO-RAT-*`/`MEM-RAT-*` resolves via `git cat-file -e <commit>:<path>`.
- **Failure:** residual untracked/modified remain; an evidence artifact missing from history.
- **Abort:** miscomposed thematic commit before push → `git reset --soft` + recompose; non-destructive.

### RM-5 — Push the branch to origin (the durability event)
- **Mission:** Move RM-2..RM-4 off the single working tree into `origin` — first off-machine copy.
- **Inputs:** RM-4 COMPLETE (Checkpoint C); commits RM-2..RM-4 present; branch `phase-10-implementation-readiness`.
- **Outputs:** `origin/phase-10-implementation-readiness` == local HEAD; no new files.
- **Success:** `git rev-list --left-right --count origin/<branch>...<branch>` → **0 0**; `git ls-remote origin <branch>` head == local HEAD; independent re-clone reproduces the corpus.
- **Failure:** push rejected/partial; remote ≠ local; **any** `push --force` (O-2 breach).
- **Abort:** pre-push authorization/scope doubt → do-not-push (fail-closed). **Post-push there is no abort — only forward-only correction** (`git revert` + push under Board approval).

### RM-6 — Tag milestones and verify
- **Mission:** Create immutable recovery points binding ratified states to durable refs.
- **Inputs:** RM-5 COMPLETE; ratified tag names (HA-5): `authority-restoration-v1.0.13` (@ RM-2 commit), `pi2-pi9-implementation-v1.0.0` (@ RM-3 commit).
- **Outputs:** Two annotated tags created and pushed.
- **Success:** `git tag --list` shows both; `git ls-remote --tags origin` confirms pushed; `git show <tag>`/`verify` content matches the ratified corpus (feeds RM-8).
- **Failure:** tag on wrong commit; name variance from ratified names; tag not pushed.
- **Abort:** mistagged ref (pre-reliance) → `git tag -d <t>` + re-tag + push corrected tag (append-only recovery-point set); **no history rewrite**.

### RM-7 — Reconcile the stale `main` side-line
- **Mission:** Remove branch-of-truth ambiguity vs `main` (+4 unpushed Phase-9 audit commits ahead of `origin/main`).
- **Inputs:** RM-5 COMPLETE (working branch is durable source of truth); local `main` disposition decision (PARK default / document / governed merge — never implicit merge into the working branch).
- **Outputs:** Recorded disposition note; `git log origin/main..main` outcome documented; canonical ref unambiguous.
- **Success:** disposition recorded; no ambiguity about which ref is canonical; no force-push.
- **Failure:** implicit/unauthorized merge; ambiguity left unresolved; force-push.
- **Abort:** disposition contested → PARK (non-destructive default) + escalate; parking changes nothing.

---

## 4. Evidence Chain Specification (RM-2 → RM-7)

All evidence is **append-only**, captured by the Executor with read-only commands, chained so each RM's output
is verifiable independently and the whole wave is reconstructable. (Consistent with RM-2's RM2-EV-1..9 in U29.)

| ID | Produced at | Evidence | Verification method | Feeds |
|:--:|:-----------:|----------|---------------------|:-----:|
| **WV-E1** | RM-2 | Pre-state snapshot + enrollment diff + staged-set + RM-2 commit SHA (RM2-EV-1..7) | anchors match `d0d60914…`/`4416b3a7…`; `show --stat` == 32; parent `519aed9` | Checkpoint A |
| **WV-E2** | RM-3 | RM-3 commit SHA; `ls-files` src count; fresh-checkout build/test log | `grep -c platform-runtime/src/` → 138; `tsc --noEmit` clean; `node --test` 269/269 | Checkpoint B |
| **WV-E3** | RM-4 | RM-4 commit SHA(s); clean-status proof; evidence-presence map | `git status` 0/0; `cat-file -e` per artifact | Checkpoint C |
| **WV-E4** | RM-5 | Push receipt; remote-head equality; re-clone reproduction log | `rev-list --left-right --count` → `0 0`; `ls-remote` head == HEAD | Checkpoint D |
| **WV-E5** | RM-6 | Tag list; pushed-tag proof; tag-content verification | `git tag --list`; `ls-remote --tags`; `git verify-tag`/`show` | Checkpoint D |
| **WV-E6** | RM-7 | `main` disposition note; `origin/main..main` outcome | recorded decision; canonical-ref statement | Checkpoint E |
| **WV-E7** | wave end | Consolidated verification checklist result (REAL-M-07 §3) | all boxes ✔ | RM-8 handoff |
| **WV-E8** | wave end | Signed Execution Wave Completion Certificate (§ 7) + RM-8 handoff token | § 7 criteria all ✔ | RM-8 |

**Chain integrity:** WV-E1→WV-E8 form an ordered chain; each cites the prior commit SHA as parent, so an auditor
(RM-8 Adjudicator, distinct-key per SG-4) can walk RM-2→RM-7 from the pushed refs and re-derive every result.

---

## 5. Checkpoint Register (A–E, with handoff criteria)

| CP | After | State asserted | Handoff (gate to next) — all must PASS | O-3 status |
|:--:|:-----:|----------------|----------------------------------------|-----------|
| **A** | RM-2 | Authorization-of-record durable **locally**; one atomic commit; O-1 proven (AUTH-012 + AD-0016..0023 together) | HEAD == RM-2 SHA; parent `519aed9`; index clean (staged 0); no push/tag; WV-E1 complete → **RM-3 GO** | **Recoverable** (pre-push) |
| **B** | RM-3 | Implementation durable **locally**; 138 src; baseline reproducible from history | RM-2 present; src count 138; fresh-checkout 269/269; index clean; no push; WV-E2 complete → **RM-4 GO** | **Recoverable** (pre-push) |
| **C** | RM-4 | Evidence durable **locally**; working tree clean (0/0) | RM-2/3 present; `git status` 0 untracked-excl-ignored / 0 modified; WV-E3 complete → **RM-5 GO**. **LAST fully-reversible point.** | **Recoverable** (pre-push) — final |
| **D** | RM-5+RM-6 | Corpus **off-machine** (origin `0 0`); recovery **tags** pushed & verified | remote head == local; both tags pushed; `verify-tag` OK; WV-E4/E5 complete → **RM-7 GO** | **Forward-only** (post-push) |
| **E** | RM-7 | Branch-of-truth **unambiguous**; `main` disposition recorded | canonical ref stated; disposition note present; WV-E6 complete → **wave COMPLETE → RM-8 handoff** | **Forward-only** |

**Rule:** a checkpoint's handoff gate is fail-closed — any unmet criterion halts the wave at that checkpoint
(no next RM begins). Checkpoint C is the O-3 boundary: before it the wave is fully reversible locally; from RM-5
onward correction is forward-only.

---

## 6. Rollback & Recovery Framework (O-1 / O-2 / O-3 compliance)

### 6.1 Per-phase recovery method

| Phase | Situation | Recovery (permitted ops only) | Prohibited (O-2) |
|-------|-----------|-------------------------------|------------------|
| **Pre-push (RM-2/3/4, CP A–C)** | Wrong commit/stage before push | `git reset --soft HEAD~1` (un-commit, keep working tree) · `git restore --staged <paths>` · `git restore <path>` · branch recreate at `519aed9` | `reset --hard`, `--amend`(pushed), `rebase`, `filter-branch`, `push --force` |
| **Push (RM-5, CP→D)** | Bad/partial push | **Forward-only:** `git revert <sha>` (inverse commit) + push, under Board approval | `push --force`, ref rewrite |
| **Tag (RM-6, CP D)** | Mistagged ref (pre-reliance) | `git tag -d <t>` + re-tag correct commit + push corrected tag (append-only recovery-point set) | rewriting a relied-upon tag |
| **Reconcile (RM-7, CP E)** | Disposition contested | PARK (non-destructive default) + escalate; governed `main` push is forward-only, reversible by `revert` | force-push, implicit merge |

### 6.2 Invariant compliance across the wave

| Invariant | How the wave complies | Evidence |
|:---------:|-----------------------|----------|
| **O-1 (no-split)** | RM-2 binds AUTH-012 + AD-0016..0023 in **one** commit; a pre-commit staged-set gate (32 exact paths) forbids split; RM-3/RM-4 are separate *by design* (distinct scopes), not a split of the authorization-of-record | WV-E1 `show --stat`; Checkpoint A |
| **O-2 (no-rewrite)** | Only `add`/`commit`/`push`/`tag` (+ non-destructive `reset --soft`/`restore` pre-push, `revert` post-push); **zero** `reset --hard`/`--amend`(pushed)/`rebase`/`filter-branch`/`push --force` anywhere | WV-E1..E6; § 6.1 |
| **O-3 (recoverable-at-every-point)** | Pre-push (CP A–C) fully reversible locally without rewrite; the O-3 boundary is CP C→RM-5; post-push (CP D–E) forward-only via `revert` — history is only extended, never lost | Checkpoint Register; § 6.1 |

**Compliance summary:** the wave is content-preserving and additive-to-history end-to-end. O-1 is enforced at
RM-2 (atomic, gated). O-2 holds because no rewrite operation appears in any permitted path. O-3 holds because
every point up to RM-5 is locally reversible and every point after RM-5 is corrected forward-only — so the
authoritative record is never rewritten or lost (RR-1..RR-8 closed per REAL-M-07 §2).

---

## 7. Execution Wave Completion Certificate (Template)

> **Blank template — completed and signed by the named Executor at wave completion. This artifact does not sign it.**

```
────────────────────────────────────────────────────────────
     MCS-1 — REAL-M-07 EXECUTION WAVE COMPLETION CERTIFICATE
────────────────────────────────────────────────────────────
Wave ID ................ RMWAVE-________
Authorization .......... RM-1 signed minute ref ________ (G-A closed)
Executor ............... ____________________ (single, accountable, RM-2..RM-7)
RM-8 Adjudicator ....... ____________________ or ☐ pending REAL-C-05 (≠ Executor, SG-4)
Date/time (UTC) ........ ____________________

── Commit results ────────────────────────────────────────────
RM-2 authorization-of-record SHA .. ________  parent 519aed9 ☐  (AUTH-012+AD-0016..0023 same commit ☐ O-1)
RM-3 implementation SHA ........... ________  src==138 ☐  fresh-checkout 269/269 ☐
RM-4 evidence SHA(s) .............. ________  git status 0/0 ☐

── Publish & tag results ─────────────────────────────────────
RM-5 pushed: origin...local == 0 0 ☐   re-clone reproduces corpus ☐
RM-6 tags:  authority-restoration-v1.0.13 @RM-2 ☐   pi2-pi9-implementation-v1.0.0 @RM-3 ☐   tags pushed+verify ☐

── Reconcile ─────────────────────────────────────────────────
RM-7 main disposition recorded (PARK/doc/governed-merge) ☐   canonical ref unambiguous ☐

── Checkpoints ───────────────────────────────────────────────
A ☐   B ☐   C ☐ (pre-push boundary)   D ☐ (forward-only)   E ☐

── Consolidated durability gate (REAL-M-07 §3) ──────────────
0 untracked/0 modified ☐ · src 138 ☐ · AD 8 ☐ · RM-2 no-split ☐ · pushed 0 0 ☐ · fresh-clone 269/269 ☐ · tags pushed ☐

── Invariant attestation ─────────────────────────────────────
O-1 no-split ☐   O-2 no-rewrite ☐   O-3 recoverable/forward-only ☐

── Outcome ───────────────────────────────────────────────────
Result: ☐ WAVE COMPLETE (REAL-M-07 FAIL→PASS)  ☐ HALTED @ CP ___  ☐ ROLLED-BACK (pre-push)
Evidence chain WV-E1..E8 complete & append-only ☐
RM-8 handoff token issued ☐
Executor signature ................................ ____________________
────────────────────────────────────────────────────────────
Wave is COMPLETE only when every box is ✔ and Result == WAVE COMPLETE.
────────────────────────────────────────────────────────────
```

---

## 8. Execution Wave Certification

- **Mission defined:** § 1 states the integrated preservation mission and its accomplishment test. ✔
- **Dependencies defined:** § 2 gives the RM-2→RM-7 graph with hard ordering and the O-3 pre/post-push boundary. ✔
- **Per-RM specified:** § 3 gives Mission / Inputs / Outputs / Success / Failure / Abort for RM-2..RM-7. ✔
- **Evidence chained:** § 4 specifies WV-E1..E8 with verification methods and checkpoint feeds. ✔
- **Checkpointed:** § 5 defines Checkpoints A–E with fail-closed handoff criteria. ✔
- **Recoverable & invariant-compliant:** § 6 demonstrates O-1/O-2/O-3 compliance and per-phase recovery. ✔
- **Completion & handoff:** § 7 gives the blank Wave Completion Certificate; RM-8 handoff defined. ✔
- **Non-executing:** all fields blank templates; no activation, execution, mutation, or signature performed. ✔

---

## Required Determination

> # **EXECUTION WAVE READY**
>
> RM-2..RM-7 is **fully specified as one executable program**. The wave mission (§ 1), the RM-2→RM-7 dependency
> graph with the O-3 pre-push/post-push boundary (§ 2), the per-RM sequence register with mission/inputs/outputs/
> success/failure/abort (§ 3), the WV-E1..E8 evidence chain (§ 4), the Checkpoint A–E register with fail-closed
> handoffs (§ 5), the rollback/recovery framework proving O-1/O-2/O-3 compliance (§ 6), and the blank Execution
> Wave Completion Certificate (§ 7) are all present and mutually consistent with `REAL-M-07-REMEDIATION-PLAN`
> (RR-1..RR-8 closure).
>
> Entry requires RM-1/G-A CLOSED and RM-2 GO (Pre-Flight PC/PF all-PASS per the U30 package). The wave is
> content-preserving and additive-to-history: O-1 enforced at RM-2, O-2 (no rewrite) across all steps, O-3
> (recoverable pre-push at Checkpoints A–C; forward-only after RM-5). RM-8 (independent verification) is the
> downstream handoff, not a wave step. On completion, `REAL-M-07` goes **FAIL → PASS**.
>
> No activation, signature, appointment, execution, or mutation was performed by this artifact. The Article IX
> generation lock and `UCOS-CONSTRUCTION-BLOCKED` remain in force; `REAL-C-05` remains separate and non-blocking
> for the durability verdict.

---

## Governance / Non-Execution Statement

No RM step executed; no `git add`, commit, push, tag, branch, or config change performed; no signature created;
no participant appointed; no authorization activated; no lock released; no invariant enrolled; no governance
modified. This is an execution-wave **specification** with blank record fields; the only repository effect is
this additive governance `*.md`, permitted by the S0′ tolerance rule and outside the `RM2-CONTENT-ANCHOR`
protected set. RM-1..RM-8 remain Approval-Required Operations (AUTH-012 §8 / AD-0009). INV-1..13, `AUTH-012`
substance (v1.0.13), AD-0014, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged.

## Traceability
- **Consumes (authoritative):** `MCS-1-RM-2-ACTIVATION-AND-PREFLIGHT-PACKAGE`, `MCS-1-RM-2-EXECUTION-CEREMONY-SPECIFICATION`, `MCS-1-G-A-ACTIVATION-CONTROL-REGISTER`, `MCS-1-RM-2-SUFFICIENCY-CERTIFICATION`.
- **Grounded in:** `REAL-M-07-REMEDIATION-PLAN` (RM-1..RM-8 content-preserving sequence; RR-1..RR-8 closure map; O-1/O-2/O-3).
- **Produces:** the integrated RM-2..RM-7 execution-wave specification (mission, dependency graph, per-RM register, evidence chain, checkpoints A–E, rollback/recovery, completion certificate).
- **Feeds:** the live execution wave (post-activation, post-RM-2-GO) and the RM-8 independent-verification handoff.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); independent adjudicator to be designated (`REAL-C-05`).

**END MCS-1-REAL-M-07-EXECUTION-WAVE-SPECIFICATION — PHASE U31 · MISSION / RM-2→RM-7 DEPENDENCY GRAPH /
PER-RM SEQUENCE REGISTER (MISSION·INPUTS·OUTPUTS·SUCCESS·FAILURE·ABORT) / EVIDENCE CHAIN (WV-E1..E8) /
CHECKPOINTS A–E / ROLLBACK-RECOVERY (O-1·O-2·O-3) / WAVE COMPLETION CERTIFICATE · ANCHORS FIXED (`d0d60914…` /
`4416b3a7…`) · RR-1..RR-8 CLOSURE · **EXECUTION WAVE READY** · NO ACTIVATION / NO EXECUTION / NO MUTATION / NO
SIGNATURE PERFORMED BY THIS ARTIFACT.**
