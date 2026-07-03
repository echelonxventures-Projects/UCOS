# REAL-M-07 — Remediation Plan (Repository Preservation & Durability Execution Sequence)

## PHASE U8.6 — Exact Preservation Sequence to Close RR-1..RR-8 (Content-Preserving · Fail-Closed · Additive-to-History)

| Field | Value |
|-------|-------|
| Artifact | **REAL-M-07 — Remediation Plan** |
| Artifact ID | `REAL-M-07-REMEDIATION-PLAN` |
| Phase | **U8.6 — Repository Durability Remediation Planning** |
| Layer | GOVERNANCE / ASSURANCE (execution planning — prescribes the durability sequence; executes nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **REMEDIATION PLAN ONLY** — defines the exact ordered commit/push/tag/verify sequence. **Performs no `git add`, commit, push, tag, branch, or config change; writes no code; alters no architecture, governance, or certification state.** Append-only. Every step is a future Approval-Required Operation. |
| Authoritative input (per mandate) | **`REAL-M-07-REPOSITORY-INTEGRITY-AND-DURABILITY-AUDIT`** (VERDICT: FAIL; 431 untracked + 7 modified-uncommitted; 0/138 src tracked; 0/8 AD tracked; RR-1..RR-8) |
| Governing discipline | **Preserve, never rewrite.** Every operation is *additive to history* and *content-preserving* — it copies existing working-tree bytes into durable history without changing them. **No history rewrite, no force-push, no `reset --hard`.** Fail-closed ordering: authorization-of-record commits first. |
| Governance status | INV-1..13 unchanged; INV-14..20 NOT enrolled; AD-0014 intact; Article IX generation lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. This plan releases nothing and commits nothing. |
| **Determination** | **YES** — repository durability can be restored **without** altering architecture, governance, or certification state, because every step preserves existing bytes into history (a copy operation), changes no artifact content, enrolls no invariant, releases no lock, and awards no certification. (Reasoning in §7.) |

> **What this plan is and is not.** It is the execution sequence that converts `REAL-M-07` from **FAIL** to
> **PASS** by making the working-tree corpus durable. It is **not** an authorization to run the steps — each
> commit/push/tag remains an Approval-Required Operation (AUTH-012 §8 / AD-0009), and releasing the
> `phase-10-implementation-readiness` DO-NOT-PUSH posture is itself the first governed act (RM-1). Nothing in
> §1 is executed by this artifact.

---

## 0. Preservation Ordering (the fail-closed spine)

The sequence is ordered so that **authorization-of-record enters history first and atomically with its ledger**,
so durability is restored *without* re-creating the `REAL-H-07` retroactive-enrollment pattern (an AD durable
before/with its enrollment, never after its construction becomes the only durable copy).

```
RM-1  AUTHORIZE (release DO-NOT-PUSH posture)                     [Board act — gate]
   │
RM-2  COMMIT authorization-of-record   (ledger + index + registry + state + AD-0016..0023 + AUTH-REST/CONST/GOV-REC)   [atomic, FIRST]
   │
RM-3  COMMIT implementation            (platform-runtime/** + architecture/** + EA/README)
   │
RM-4  COMMIT evidence corpus           (PI*/ONTO*/MEM* ratification + U-phase + UCOM-* + REAL-*/CONST-READY)
   │
RM-5  PUSH branch to origin            (carries RM-2..RM-4 — value only after commits exist)
   │
RM-6  TAG milestones + verify          (authority-restoration tag @ RM-2; implementation tag @ RM-3)
   │
RM-7  RECONCILE stale `main` side-line (+4 unpushed Phase-9 audits)               [governed]
   │
RM-8  INDEPENDENT VERIFY               (distinct-actor attestation: pushed tags == ratified corpus)   [REAL-C-05]
```

**Invariant O-1 (no-split).** An AD and its `AUTH-012` enrollment **must** land in the *same* commit (RM-2);
selective staging that separates them is prohibited (closes RR-8).
**Invariant O-2 (no-rewrite).** Only `add`/`commit`/`push`/`tag` are used — **never** `reset --hard`, `commit
--amend` on pushed history, `rebase`, `filter-branch`, or `push --force`. History is only extended.
**Invariant O-3 (recoverable-at-every-point).** Until RM-5, all work is local and reversible with
non-destructive commands (§ per-step Rollback). After RM-5, correction is forward-only (a new commit).

---

## 1. Remediation Steps (RM-1..RM-8)

### RM-1 — Authorize the durability act (release the DO-NOT-PUSH posture)
- **Objective:** Obtain the governed Authority-Board decision that permits committing/pushing the
  `phase-10-implementation-readiness` corpus, lifting the standing DO-NOT-PUSH branch posture for this scope only.
- **Files Affected:** None (a Board decision minute; enrolled append-only in `AUTH-012` as the governing act — that enrollment is part of RM-2's content, not a separate mutation here).
- **Risk Addressed:** Precondition for all others; without it every commit is an unauthorized act. Governs RR-1..RR-8 collectively.
- **Ordering Constraints:** **Must precede RM-2..RM-8.** No commit occurs before this decision is minuted.
- **Verification Method:** Decision minute exists and cites `REAL-M-07` FAIL + `REAL-M-03` C-9; scope limited to preservation (no lock release, no new authorization).
- **Rollback Method:** N/A (a decision; if withheld, the sequence simply does not start — fail-closed default is "do not commit").
- **Required Approval:** **UCOS Authority Board — Approval-Required Operation (AUTH-012 §8 / AD-0009).**

---

### RM-2 — Commit the authorization-of-record (FIRST, atomic)
- **Objective:** Make the canonical authorization chain durable in a single commit so no AD is ever separated from its ledger enrollment.
- **Files Affected (one commit):**
  - Modified-tracked: `.claude/authority/AUTH-012-DECISION-LOG.md` (v1.0.13), `.claude/authority/AUTHORITY-INDEX.md`, `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `.claude/state/PROJECT-STATE.md`
  - Untracked authorizations: `AD-0016..0023` (8 records), `AUTH-REST-001..004`, `AUTH-CONST-001`, `GOV-REC-001`
  - Untracked authorization reviews: `INT-AUTH-001..004`, `INT-AUTH-REV-001..004`, `ONTO-AUTH-REV-001..004`, `FGA-2-ARTICLE-IX-RELEASE-REVIEW`
- **Risk Addressed:** **RR-2** (ledger reverts to ≤ v1.0.5 / AD-0015 erased), **RR-8** (authorization split from evidence), contributes to **RR-1**.
- **Ordering Constraints:** After RM-1; **before RM-3/RM-4**. Invariant O-1 (no-split) binds: ledger + AD records staged and committed together; no partial stage.
- **Verification Method:** `git show --stat <commit>` lists `AUTH-012` **and** all 8 AD records in the same commit; `git ls-files | grep '^AD-00'` returns 8; `git show <commit>:.claude/authority/AUTH-012-DECISION-LOG.md` header reads `v1.0.13`; content byte-identical to working tree (`git diff <commit> -- <ledger>` empty).
- **Rollback Method (local, non-destructive):** `git reset --soft HEAD~1` (un-commits, retains working tree); `git restore --staged <paths>` to unstage. No `--hard`. Working-tree bytes untouched throughout.
- **Required Approval:** Board (AD-0009) — carried by RM-1.

---

### RM-3 — Commit the implementation
- **Objective:** Make the built PI-2..PI-9 substrate and architecture corpus durable and the 269/269 baseline reproducible from history.
- **Files Affected:** `packages/platform-runtime/{src,test,bin,examples,package.json,tsconfig.json}` (src = 138 files), `architecture/**` (11 fabric/domain subtrees), modified `docs/enterprise-architecture/UCOS-ENTERPRISE-ARCHITECTURE.md`, modified `packages/platform-runtime/README.md`. (`node_modules/`, `*.tsbuildinfo` remain correctly ignored.)
- **Risk Addressed:** **RR-3** (implementation unrecoverable), **RR-5** (test-baseline reproducibility), contributes to **RR-1**.
- **Ordering Constraints:** After RM-2 (authorization-of-record precedes the code it authorizes). Before RM-5.
- **Verification Method:** `git ls-files | grep -c platform-runtime/src/` → **138**; `tsc --noEmit` clean and `node --test` → **269/269** re-run **from a fresh checkout** of the commit (proves history-reproducibility, not just disk); `git status` shows the source tree no longer untracked.
- **Rollback Method (local):** `git reset --soft HEAD~1`; `git restore --staged`. Non-destructive; no `--hard`.
- **Required Approval:** Board (AD-0009) — carried by RM-1.

---

### RM-4 — Commit the evidence corpus
- **Objective:** Preserve all certification-grade evidence, U-phase audits, and the current reconciliation chain.
- **Files Affected:** `PI5..PI7-*`, `ONTO-*`, `MEM-*` (implementation/validation/security/audit/ratification reports); `ULT-GAP-001`, `ROADMAP-ULT-001`, `REAL-001`, `OP-CERT-001`, `UCOM-*`, `UA-10`, `EXIST-001`, `UA-05-CANONICAL-INVARIANTS`; this session's `CONST-READY-001`, `REAL-C-05`, `REAL-M-03`, `REAL-C-01`, `REAL-H-07`, `REAL-M-07`, and this `REAL-M-07-REMEDIATION-PLAN`; `RA-1`/`RA-2`, remaining untracked governance records.
- **Risk Addressed:** **RR-5** (certification/ratification evidence non-reproducible), contributes to **RR-1**.
- **Ordering Constraints:** After RM-3. Before RM-5. (May be one commit or thematic commits; each self-contained.)
- **Verification Method:** `git status` reports **0 untracked** (excl. ignored) and **0 modified**; `git ls-files | wc -l` increased by the committed count; every `REAL-*`/`UCOM-*`/`ONTO-RAT-*`/`MEM-RAT-*` resolves via `git cat-file -e <commit>:<path>`.
- **Rollback Method (local):** `git reset --soft HEAD~1`; `git restore --staged`. Non-destructive.
- **Required Approval:** Board (AD-0009) — carried by RM-1.

---

### RM-5 — Push the branch to origin
- **Objective:** Move RM-2..RM-4 off the single working tree into the remote — the actual durability event.
- **Files Affected:** None new (transmits existing commits). Branch `phase-10-implementation-readiness` → `origin`.
- **Risk Addressed:** **RR-1** (single-tree total-loss), **RR-4** (`REAL-H-07` gate E5 durability precondition), **RR-7** (single-custody concentration — first off-machine copy).
- **Ordering Constraints:** **After RM-2..RM-4 commits exist** (pre-audit the branch was 0-ahead; push is a no-op until commits are created). No force-push.
- **Verification Method:** `git rev-list --left-right --count origin/<branch>...<branch>` → **0 0** (remote == local); `git ls-remote origin <branch>` head == local HEAD; independent re-clone reproduces the corpus.
- **Rollback Method (forward-only, post-publish):** a bad push is corrected by a **new corrective commit + push**; **never** `push --force`. If an unintended commit was pushed, `git revert <sha>` (adds an inverse commit, preserves history). Requires explicit Board approval to alter published refs.
- **Required Approval:** Board (AD-0009) — the push/tag release specifically named in `REAL-M-03` C-9.

---

### RM-6 — Tag milestones and verify
- **Objective:** Create immutable recovery points binding ratified states to durable refs.
- **Files Affected:** None (annotated tags on existing commits): an **authority-restoration** tag on the RM-2 commit and an **implementation** tag on the RM-3 commit; then push tags.
- **Risk Addressed:** **RR-4** (`REAL-M-07` certification artifact / recovery points), **RR-7** (durable recovery anchors).
- **Ordering Constraints:** After RM-5. Tags reference already-pushed commits.
- **Verification Method:** `git tag --list` shows the new tags; `git ls-remote --tags origin` confirms they are pushed; `git tag --verify`/`git show <tag>` content matches the ratified corpus (feeds RM-8).
- **Rollback Method:** tags are not yet relied upon downstream — a mistagged ref is corrected by `git tag -d <t>` + re-tag + push the corrected tag (append-only recovery point set); no history rewrite.
- **Required Approval:** Board (AD-0009) — carried by RM-1/RM-5.

---

### RM-7 — Reconcile the stale `main` side-line
- **Objective:** Remove branch-of-truth ambiguity between the working branch and the older `main` (+4 unpushed Phase-9 audit commits ahead of `origin/main`).
- **Files Affected:** None in the working corpus; disposition of local `main`'s 4 commits (park, document, or governed merge — **not** an implicit merge into the working branch).
- **Risk Addressed:** **RR-6** (branch-of-truth ambiguity).
- **Ordering Constraints:** After RM-5 (working branch is the durable source of truth first). Independent of RM-8.
- **Verification Method:** A recorded disposition note; `git log origin/main..main` outcome documented (pushed under a governed decision, or explicitly parked as historical); no ambiguity about which ref is canonical.
- **Rollback Method:** Non-destructive — parking changes nothing; a governed push of `main` is forward-only and reversible by revert. No force-push.
- **Required Approval:** Board (AD-0009) — governance-hygiene decision.

---

### RM-8 — Independent verification
- **Objective:** Close the self-attestation gap on durability: a distinct actor confirms the pushed refs equal the ratified corpus.
- **Files Affected:** None (produces an attestation record on the `REAL-C-05` attestation chain).
- **Risk Addressed:** Certification-grade confidence over **RR-1..RR-7** closure; satisfies `REAL-C-05` independence for the durability claim.
- **Ordering Constraints:** After RM-5/RM-6. Requires `REAL-C-05` operational (G1–G4) for a genuinely independent (distinct-key) attestation; if C-05 is still PARTIAL, the attestation is recorded but flagged *pending independent adjudication*.
- **Verification Method:** Independent re-clone + `git verify-tag`/hash comparison by a distinct-actor key (`REAL-C-05` SIG-4); attestation states pushed tags == ratified states.
- **Rollback Method:** N/A (an attestation; a failed verification re-opens the relevant RM step fail-closed).
- **Required Approval:** Independent Adjudicator designation (Board-recorded, `REAL-C-05` G1).

---

## 2. Risk → Step Closure Map

| Risk (from `REAL-M-07` §5) | Closed by | Residual after sequence |
|----------------------------|-----------|-------------------------|
| **RR-1** total loss of post-PI-1 corpus | RM-2 + RM-3 + RM-4 + RM-5 | None (corpus in remote history) |
| **RR-2** ledger reverts to ≤ AD-0015 | RM-2 (ledger committed) + RM-5 | None |
| **RR-3** implementation unrecoverable | RM-3 + RM-5 | None |
| **RR-4** `REAL-H-07` gate E5 FAIL | RM-5 + RM-6 (durable + tagged) | Cleared once pushed/tagged (unblocks `REAL-H-07` G-4) |
| **RR-5** cert/ratification evidence non-reproducible | RM-4 + RM-5 | None |
| **RR-6** stale `main` ambiguity | RM-7 | None (disposition recorded) |
| **RR-7** single-remote/single-tree concentration | RM-5 + RM-6 (+ optional mirror) | Reduced; optional second remote/mirror for defense-in-depth |
| **RR-8** partial commit splits authorization from evidence | RM-2 atomicity (Invariant O-1) | None (enforced by no-split rule) |

---

## 3. Consolidated Verification Checklist (post-sequence gate)

Durability is PASS only when **all** hold, re-checked at execution time:
- [ ] `git status` → **0 untracked (excl. ignored) · 0 modified** (RM-2/3/4 complete).
- [ ] `git ls-files | grep -c platform-runtime/src/` → **138** (impl durable).
- [ ] `git ls-files | grep -c '^AD-00'` → **8** (authorizations durable).
- [ ] `git show <RM-2 commit>` contains `AUTH-012` **and** AD-0016..0023 (no-split proven).
- [ ] `git rev-list --left-right --count origin/<branch>...<branch>` → **0 0** (pushed).
- [ ] Fresh clone → `tsc --noEmit` clean + `node --test` **269/269** (history-reproducible baseline).
- [ ] `git ls-remote --tags origin` shows the authority + implementation tags.
- [ ] Independent attestation (RM-8) recorded (or flagged pending C-05).

---

## 4. Required Determination

> ### CAN REPOSITORY DURABILITY BE RESTORED WITHOUT ALTERING ARCHITECTURE, GOVERNANCE, OR CERTIFICATION STATE?
>
> ## **YES**
>
> Every step is **content-preserving and additive-to-history**: `git add`/`commit`/`push`/`tag` copy the
> *existing* working-tree bytes into durable history **without modifying a single artifact's content**. The
> sequence:
> - **alters no architecture** — it changes no `src/**` semantics, no design, no invariant; it merely records the code that already exists;
> - **alters no governance** — it enrolls no AD, releases no lock, redesigns nothing; `AUTH-012` v1.0.13 is *preserved as-is* (the commit's ledger bytes are byte-identical to the working tree, verified in RM-2), and the DO-NOT-PUSH release (RM-1) is a governed *process* act, not a change to governance *content* or *structure*;
> - **alters no certification state** — it awards, upgrades, and revokes nothing; the level remains CONDITIONALLY CERTIFIED; it only makes the existing certification evidence durable.
>
> The no-rewrite invariants (O-2: no `reset --hard`/amend/rebase/force-push) guarantee the operation cannot
> mutate or lose existing history, and the no-split invariant (O-1) guarantees authorization and its ledger
> move together, avoiding a repeat of the `REAL-H-07` retroactive pattern. The only constraint is procedural:
> the commit/push/tag acts are Approval-Required (AD-0009) and gated on RM-1 — a governance *permission*, not a
> governance *change*.
>
> Therefore durability (`REAL-M-07` FAIL → PASS) is fully restorable within the frozen architecture, governance,
> and certification envelope. Plan only — no `git` mutation performed. INV-1..13, AD-0014, and the Article IX
> lock are unchanged; `UCOS-CONSTRUCTION-BLOCKED` stands.

### OUTPUT

**`REAL-M-07-REMEDIATION-PLAN` — COMPLETE · 8-STEP CONTENT-PRESERVING SEQUENCE (RM-1 AUTHORIZE → RM-2 COMMIT
AUTHORIZATION-OF-RECORD [ATOMIC, FIRST] → RM-3 COMMIT IMPL → RM-4 COMMIT EVIDENCE → RM-5 PUSH → RM-6 TAG+VERIFY
→ RM-7 RECONCILE MAIN → RM-8 INDEPENDENT VERIFY) · EACH WITH OBJECTIVE / FILES / RISK / ORDERING / VERIFICATION
/ ROLLBACK / APPROVAL · RR-1..RR-8 ALL MAPPED TO CLOSURE · INVARIANTS: NO-SPLIT (O-1) · NO-REWRITE / NO
FORCE-PUSH / NO RESET-HARD (O-2) · RECOVERABLE-AT-EVERY-POINT (O-3) · DETERMINATION: **YES** — DURABILITY
RESTORABLE WITHOUT ARCHITECTURE / GOVERNANCE / CERTIFICATION CHANGE · NO COMMIT / PUSH / TAG / ADD / CODE
PERFORMED BY THIS ARTIFACT.**

---

## 5. Governance / Non-Mutation Statement

No `git add`, commit, push, tag, branch, or config change was performed; no source code, infrastructure, or
authorization was produced; no lock released; no invariant enrolled; no ratified/frozen construct modified; no
certification awarded or changed. This is a planning artifact. Every step (RM-1..RM-8) is a future
Approval-Required Operation (AUTH-012 §8 / AD-0009) reserved to the UCOS Authority Board, and RM-1 (release of
the DO-NOT-PUSH posture) is its governing precondition. INV-1..13, `AUTH-012` substance (v1.0.13), AD-0014, the
Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged.

## 6. Traceability
- **Consumes (authoritative):** `REAL-M-07-REPOSITORY-INTEGRITY-AND-DURABILITY-AUDIT` (FAIL; RR-1..RR-8; §6 RM-1..RM-8 outline).
- **Realizes:** `REAL-001` REAL-M-07 (durable, committed/tagged certified corpus); `ROADMAP-ULT-001` U2.1/CW-1 durability leg; unblocks `REAL-H-07` PASS-gate **G-4** (E5 durability) and removes the `CONST-READY-001` first-wave durability blocker.
- **Coheres with:** `REAL-M-03` C-9 (governed commit/push), `REAL-H-07` R-1/R-3 (enroll-with-durability, no retroactivity), `REAL-C-05` (independent verification RM-8), `GOV-REC-001` (reproduced state governs).
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Refined by:** the prospective Board acts RM-1..RM-8, which convert `REAL-M-07` from FAIL to PASS.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); independent adjudicator to be designated (`REAL-C-05`).

**END REAL-M-07-REMEDIATION-PLAN — PHASE U8.6 · CONTENT-PRESERVING DURABILITY SEQUENCE · DETERMINATION: YES ·
PLAN ONLY · NO COMMIT / NO PUSH / NO TAG / NO CODE / NO ARCHITECTURE / NO GOVERNANCE / NO CERTIFICATION CHANGE.**
