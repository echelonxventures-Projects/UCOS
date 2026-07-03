# REAL-M-07 — Repository Integrity and Durability Audit

## PHASE U8.5 — Zero-Trust Reproduction of Repository Durability (git working tree · branches · remote · history)

| Field | Value |
|-------|-------|
| Artifact | **REAL-M-07 — Repository Integrity and Durability Audit** |
| Artifact ID | `REAL-M-07-REPOSITORY-INTEGRITY-AND-DURABILITY-AUDIT` |
| Phase | **U8.5 — Repository Integrity & Durability Audit** |
| Layer | GOVERNANCE / ASSURANCE (durability determination — reproduces VCS state; changes nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **ZERO-TRUST DURABILITY AUDIT ONLY** — reproduce `git` state directly and determine what is durable. **No commit, no push, no tag, no add, no branch/config change, no code change, no architecture change, no governance redesign.** All `git` invocations were read-only (`status`, `branch`, `remote`, `log`, `tag`, `ls-files`, `rev-list`, `diff --name-only`). Append-only. |
| Authoritative inputs (per mandate) | **`CONST-READY-001`**, **`REAL-C-05`**, **`REAL-M-03`**, **`REAL-C-01`**, **`REAL-H-07`** |
| Governing discipline | **Durability is proven by presence in committed, pushed history — not by presence on disk.** A working-tree file is *not* durable. Absence of a commit = FAIL, never a pending pass. Fail-closed. Non-optimistic. |
| Governance status | INV-1..13 unchanged; INV-14..20 NOT enrolled; AD-0014 intact; Article IX generation lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. This audit releases nothing and commits nothing. |
| **Determination** | **FAIL** — the current program corpus (the entire PI-2..PI-9 implementation, all eight AD-0016..0023 authorizations, the restored `AUTH-012` v1.0.13 ledger content, and the whole U-phase governance/certification corpus) exists **only in the working tree**. **431 untracked files + 7 modified-uncommitted tracked files**; **0 of 138 `platform-runtime/src/` files are tracked**; **0 of 8 root AD records are tracked**. A single working-tree loss today would destroy the authorization-of-record and the implementation. |

> **Divergence from the prior estimate (recorded).** `CONST-READY-001` GT-7 / `REAL-M-03` T-15 reported "151
> files uncommitted." Direct reproduction this phase shows the exposure is **materially larger**: **431
> untracked + 7 modified** (438 uncommitted objects), including the entire source tree. The prior figure
> undercounted; the reproduced figure governs (`GOV-REC-001`: reproduced state > asserted state).

---

## 1. Reproduced Ground Truth (this phase — read-only `git`, not assumed)

| # | Probe | Command | Reproduced result |
|:-:|-------|---------|-------------------|
| G-1 | Working branch | `git status` / `git branch -vv` | `phase-10-implementation-readiness` @ **519aed9** |
| G-2 | Upstream tracking | `git branch -vv` | tracks `origin/phase-10-implementation-readiness` @ **519aed9** — **0 ahead / 0 behind** (tip is pushed) |
| G-3 | Remote | `git remote -v` | `origin` = `https://github.com/echelonxventures-Projects/UCOS.git` (fetch+push) |
| G-4 | HEAD commit | `git log --oneline -1` | **519aed9** "Add generated inventory files to gitignore" |
| G-5 | Prior commit / newest tag | `git log` / `git tag` | **5caaa95** = `tag: pi1-foundation-v1.0.1` (PI-1 Foundation) — the commit immediately before HEAD |
| G-6 | Tags | `git tag --list` | `governance-baseline-1.0.0` (e62b325), `pi1-foundation-v1.0.1` (5caaa95), `v1.0.0-pdata-ratified` |
| G-7 | Tracked files | `git ls-files \| wc -l` | **347** |
| G-8 | Untracked files (excl. ignored) | `git ls-files --others --exclude-standard \| wc -l` | **431** |
| G-9 | Modified tracked files | `git diff --name-only \| wc -l` | **7** |
| G-10 | Ignored files | `git ls-files --others --ignored --exclude-standard \| wc -l` | **118** (all `node_modules/**`, `*.tsbuildinfo`, `all-files.txt`, `markdown-files.txt` — **no governance artifact ignored**) |
| G-11 | Implementation source tracked | `git ls-files \| grep -c platform-runtime/src/` | **0 tracked** / **138 untracked** — the entire control substrate source is uncommitted |
| G-12 | Root AD authorization records tracked | `git ls-files \| grep '^AD-00'` | **0 tracked** — all of **AD-0016..0023** are untracked |
| G-13 | `main` vs `origin/main` | `git log origin/main..main` | `main` is **4 commits ahead, unpushed** (Phase 9.0A/9.0B/9.0C.1A/9.0C.1B audits) — a stale side-line, **not** the working branch |
| G-14 | `.gitignore` scope | `read` | ignores only build/inventory noise; **does not** exclude any authorization, governance, ratification, or certification artifact |

**Net reproduced durability state.** The pushed branch tip (**519aed9**) is essentially **PI-1 Foundation +
a `.gitignore` edit**. **Everything produced after PI-1 — the PI-2..PI-9 control substrate implementation (138
source files), all eight scoped Article IX authorizations (AD-0016..0023), the restored canonical `AUTH-012`
v1.0.13 ledger content, the Authority Index, the artifact registry, PROJECT-STATE, and the entire U-phase
audit/certification corpus (including this session's `REAL-*` set) — is outside repository history.** It is
either untracked (431 files) or present as an uncommitted modification to a tracked file (7 files). The
`git push` posture is a red herring: the branch is 0-ahead, so *pushing changes nothing* — the corpus was
never **committed** in the first place.

### 1.1 The 7 modified-but-uncommitted tracked files (the most dangerous class)

These are versioned files whose **current, load-bearing content is not in any commit**; a `git checkout .` or
disk loss reverts them to their stale committed revision.

| Modified tracked file | Why it is decisive |
|-----------------------|--------------------|
| `.claude/authority/AUTH-012-DECISION-LOG.md` | **The canonical authorization ledger.** Its committed revision predates v1.0.13; the AD-0016..0023 enrollment + Phase 21.1 reconciliation exist **only** as an uncommitted edit. Loss reverts the ledger to ≤ AD-0015 / v1.0.5. |
| `.claude/authority/AUTHORITY-INDEX.md` | Authority index reflecting the restored chain — uncommitted. |
| `.claude/context/UCOS-ARTIFACT-REGISTRY.md` | Canonical artifact registry (`CTX-REG-001`) — uncommitted. |
| `.claude/state/PROJECT-STATE.md` | State-of-record incl. the `REAL-M-03` C-1 reconciliation append — uncommitted. |
| `docs/enterprise-architecture/UCOS-ENTERPRISE-ARCHITECTURE.md` | EA baseline edits — uncommitted. |
| `packages/platform-runtime/README.md` | The **only** tracked file in the runtime package; its source siblings are all untracked. |
| `.gitignore` | Uncommitted (harmless content, but itself not durable). |

---

## 2. Required Determinations (Q1–Q5)

### Q1 — What authorization records exist only in a working tree?
**All of them.** Reproduced (G-12, G-1.1):
- **Scoped Article IX releases:** `AD-0016`, `AD-0017`, `AD-0018`, `AD-0019`, `AD-0020`, `AD-0021`, `AD-0022`, `AD-0023` — **8 untracked** root records.
- **Authority chain restoration:** `AUTH-REST-001..004` — untracked.
- **Authorization program / reviews:** `AUTH-CONST-001`, `INT-AUTH-001..004`, `INT-AUTH-REV-001..004`, `ONTO-AUTH-REV-001..004`, `FGA-2-ARTICLE-IX-RELEASE-REVIEW` — untracked.
- **The canonical ledger's authorizing content itself:** `AUTH-012` v1.0.13 (modified-uncommitted) + `AUTHORITY-INDEX` (modified-uncommitted).

> The authorization-of-record for **every** construction wave after PI-1 lives in exactly one place: this
> working tree. This is the precise condition `REAL-H-07` (§OO-6 / F-5) names as *enrollment-not-durable*.

### Q2 — What artifacts are not durable?
Everything not in a commit: **431 untracked + 7 modified = 438 objects**, spanning:
- The **entire implementation** — `packages/platform-runtime/src/**` (138 files), `test/**`, `bin/`, `examples/`, `package.json`, `tsconfig.json`.
- The **entire post-PI-1 architecture corpus** — `architecture/{autonomy,civilization,economic,ecosystem,existential,federation,governance,intelligence,memory,ontology,simulation}/**`.
- The **entire U-phase governance/audit/certification corpus** — `ULT-GAP-001`, `ROADMAP-ULT-001`, `REAL-001`, `OP-CERT-001`, `UCOM-*`, `CONST-READY-001`, and this session's `REAL-C-05` / `REAL-M-03` / `REAL-C-01` / `REAL-H-07` / `REAL-M-07`.
- All **fabric ratification evidence** — `PI5..PI7-*`, `ONTO-*`, `MEM-*` implementation/validation/security/audit/ratification reports.

### Q3 — What artifacts are not versioned?
The **431 untracked** files have **never entered version control** (no blob, no history, no recoverability).
The **7 modified** files are versioned but their **current revision is uncommitted** (recoverable only to a
stale prior state). Neither class is protected.

### Q4 — What governance records are not protected by repository history?
- **Canonical ledger `AUTH-012` (v1.0.13)** — modified, uncommitted (its restored content is not in history).
- **`AUTHORITY-INDEX`, `CTX-REG-001` registry, `PROJECT-STATE`** — modified, uncommitted.
- **All AD authorizations (AD-0016..0023), AUTH-REST-001..004, GOV-REC-001, EXIST-001, UA-05 invariants** — untracked.
- **All certification/closure instruments** — `UCOM-ULTIMATE-CERT-001`, `UCOM-SYN-001`, `UCOM-REMEDIATION-001`, `UA-10` — untracked.
- Positive finding: **no governance record is *silently ignored*** by `.gitignore` (G-14) — the exposure is non-commitment, not exclusion.

### Q5 — What evidence could be lost today?
**All of it, immediately.** A working-tree loss, an accidental `git checkout .`/`git reset --hard`, disk
failure, or clone-elsewhere **today** would:
- **Delete** 431 untracked files (entire implementation + entire post-PI-1 corpus, incl. this audit), and
- **Revert** 7 tracked files to their committed revisions — collapsing `AUTH-012` back to ≤ v1.0.5 (AD-0015),
  erasing the AD-0016..0023 enrollment, the Phase 21.1 reconciliation, and the `REAL-M-03` state append.

The surviving state would be **PI-1 Foundation (519aed9)** — no PI-2..PI-9 code, no post-PI-1 authorization,
no restored ledger. The program would lose ~1½ phases of realization **and** its entire authorization-of-record
in one event.

---

## 3. Durability Matrix

Grouped by artifact class (431+7 files cannot be enumerated individually; counts are reproduced, exact).

| Artifact (class) | Durability Status | Repository Status | Risk Level | Closure Action |
|------------------|-------------------|-------------------|:----------:|----------------|
| **Canonical ledger `AUTH-012` v1.0.13** | **NOT DURABLE** | Tracked, **modified-uncommitted** (committed rev ≤ v1.0.5) | **CRITICAL** | Commit the ledger revision; tag an authority milestone; push |
| Authority Index / `CTX-REG-001` registry / `PROJECT-STATE` | **NOT DURABLE** | Tracked, modified-uncommitted | **CRITICAL** | Commit + push in the same authority milestone |
| **AD-0016..0023** (8 scoped Article IX releases) | **NOT DURABLE** | **Untracked** (0/8 tracked) | **CRITICAL** | `git add` the 8 records; commit; tag; push |
| `AUTH-REST-001..004`, `AUTH-CONST-001`, auth reviews (`INT-AUTH-*`, `ONTO-AUTH-REV-*`, `FGA-2`) | **NOT DURABLE** | Untracked | **CRITICAL** | Commit + push with the AD corpus |
| **`platform-runtime/src/**`** (PI-2..PI-9 implementation, 138 files) | **NOT DURABLE** | Untracked (0/138 tracked) | **CRITICAL** | Commit the source tree; tag an implementation milestone; push |
| `platform-runtime/{test,bin,examples,package.json,tsconfig.json}` | **NOT DURABLE** | Untracked | **HIGH** | Commit with the source tree |
| `architecture/**` (11 fabric/domain subtrees) | **NOT DURABLE** | Untracked | **HIGH** | Commit + push |
| Fabric ratification evidence (`PI5..PI7-*`, `ONTO-*`, `MEM-*`) | **NOT DURABLE** | Untracked | **HIGH** | Commit + push (certification-grade evidence) |
| U-phase corpus (`ULT-GAP-001`, `ROADMAP-ULT-001`, `REAL-001`, `OP-CERT-001`, `CONST-READY-001`, `UCOM-*`, `UA-10`) | **NOT DURABLE** | Untracked | **HIGH** | Commit + push |
| This session's `REAL-C-05 / M-03 / C-01 / H-07 / M-07` | **NOT DURABLE** | Untracked | **HIGH** | Commit + push |
| `.claude/authority/AUTH-001..011`, `context/**`, `skills/**`, `prompts/**` (baseline) | **DURABLE** | Tracked, committed (part of the 347) | LOW | None — already in history |
| Frozen tags `governance-baseline-1.0.0`, `pi1-foundation-v1.0.1`, `v1.0.0-pdata-ratified` | **DURABLE** | Committed + pushed | LOW | None — but they predate all post-PI-1 work |
| `main` branch (+4 unpushed Phase-9 audits) | PARTIAL | Local commits ahead of `origin/main` | MEDIUM | Reconcile/park the stale side-line under a governed act |
| Build/inventory noise (`node_modules/`, `*.tsbuildinfo`, `*-files.txt`) | N/A (correctly ignored) | Ignored (118) | LOW | None — correctly excluded |

---

## 4. Evidence Preservation Matrix

Maps each evidentiary class to whether its proof survives a working-tree loss **today**.

| Evidence class | Survives WT loss today? | Preserved by | Gap |
|----------------|:-----------------------:|--------------|-----|
| PI-1 Foundation baseline | ✅ YES | commit 5caaa95 / tag `pi1-foundation-v1.0.1` | none |
| Governance baseline 1.0.0 | ✅ YES | commit e62b325 / tag `governance-baseline-1.0.0` | none |
| **PI-2..PI-9 implementation + test evidence** | ❌ **NO** | — (untracked) | entire substrate lost |
| **269/269 baseline reproducibility** | ❌ **NO** | test files untracked | cannot re-run from history |
| **AD-0016..0023 authorization-of-record** | ❌ **NO** | untracked + ledger modification uncommitted | authorization erased to ≤ AD-0015 |
| **Authority-chain restoration (`AUTH-REST-*`, v1.0.13)** | ❌ **NO** | untracked + modified-uncommitted | chain reverts to "defective" prior state |
| **PI-8/PI-9 ratification evidence (`ONTO-RAT-*`, `MEM-RAT-*`)** | ❌ **NO** | untracked | ratification proof lost |
| **Certification instruments (`UCOM-*`, `UA-10`, `OP-CERT-001`)** | ❌ **NO** | untracked | certification history lost |
| **This session's reconciliation chain (`REAL-*`, `CONST-READY-001`)** | ❌ **NO** | untracked | U8 audit trail lost |
| Hash-chained runtime audit logs (in-memory) | ❌ **NO** | not persisted + source untracked | double loss (runtime + VCS) |

**Preservation verdict:** only the **PI-1-and-earlier** evidentiary strata are preserved. **Every
evidence class produced during PI-2..PI-9 and the entire U-phase is unpreserved.**

---

## 5. Repository Risk Register

| ID | Risk | Likelihood | Impact | Level | Trigger |
|----|------|:----------:|:------:|:-----:|---------|
| **RR-1** | Total loss of post-PI-1 corpus (impl + authorization + governance) on WT loss | Medium | Catastrophic | **CRITICAL** | disk failure, `reset --hard`, `checkout .`, re-clone |
| **RR-2** | Ledger reverts to ≤ AD-0015 / v1.0.5; AD-0016..0023 authorization-of-record erased | Medium | Catastrophic | **CRITICAL** | any revert of the modified `AUTH-012` |
| **RR-3** | Implementation (138 src files) unrecoverable — no blob ever created | Medium | Catastrophic | **CRITICAL** | WT loss |
| **RR-4** | `REAL-H-07` gate cannot reach PASS — its G-4 durability precondition (E5) is FAIL for the standing corpus | High | High | **HIGH** | stands until commit/push |
| **RR-5** | Certification/ratification evidence non-reproducible from history | Medium | High | **HIGH** | WT loss |
| **RR-6** | Stale `main` side-line (+4 unpushed) creates branch-of-truth ambiguity | Low | Medium | **MEDIUM** | future push/merge confusion |
| **RR-7** | Single-remote, single-tree concentration (no mirror, no second custody) | Low | High | **MEDIUM** | remote/account loss |
| **RR-8** | Large uncommitted set risks partial/selective commit that splits authorization from its evidence | Medium | Medium | **MEDIUM** | ad-hoc `git add` |

**Positive controls confirmed (not at risk):** `origin` is configured (G-3); the branch tip is pushed (G-2);
`.gitignore` excludes no governance artifact (G-14); the frozen milestone tags are intact and pushed (G-6).

---

## 6. Required Remediation Sequence (specification only — NOT executed here)

Every step below is an **Approval-Required Operation** (AUTH-012 §8 / AD-0009) and is **governed by
`REAL-M-03` C-9 and `REAL-H-07` E5/G-4**; this audit performs none of them (the DO-NOT-PUSH branch posture is
released only by a Board act).

| Step | Action | Rationale | Gate satisfied |
|:----:|--------|-----------|----------------|
| **RM-1** | **Authorize the durability act** — Board release of the `phase-10-implementation-readiness` DO-NOT-PUSH posture (governed commit/push decision) | Committing/pushing the corpus is itself Approval-Required | `REAL-M-03` C-9 |
| **RM-2** | **Commit the authorization-of-record first, atomically** — stage `AUTH-012` (v1.0.13), `AUTHORITY-INDEX`, `CTX-REG-001`, `PROJECT-STATE`, **and** the 8 `AD-0016..0023` records together in one commit | Never split an AD from its ledger enrollment (RR-8; `REAL-H-07` R-7 one-bump-one-record) | `REAL-H-07` E4→E5 |
| **RM-3** | **Commit the implementation** — `platform-runtime/{src,test,bin,examples,package.json,tsconfig.json}` + `architecture/**` | Makes the built substrate durable and the 269/269 baseline reproducible from history | `REAL-M-07` durability |
| **RM-4** | **Commit the evidence corpus** — all `PI*/ONTO*/MEM*` ratification evidence, U-phase audits, `UCOM-*`, and this session's `REAL-*`/`CONST-READY-001` | Preserves certification-grade evidence (§4 gaps) | `REAL-C-01`/`REAL-C-05` evidence durability |
| **RM-5** | **Push** the branch to `origin` | Branch is 0-ahead now, so push is a no-op **until** RM-2..RM-4 commit; push only carries value after committing | `REAL-H-07` E5 |
| **RM-6** | **Tag milestones** — an authority-restoration tag (post-RM-2) and an implementation tag (post-RM-3); verify pushed tags match ratified states | Immutable recovery points; independent verification (`REAL-C-05`) | `REAL-M-07` cert artifact |
| **RM-7** | **Reconcile the stale `main` side-line** — park or merge the +4 unpushed Phase-9 audit commits under a governed decision | Removes branch-of-truth ambiguity (RR-6) | governance hygiene |
| **RM-8** | **Independent verification** — a distinct-actor attestation that pushed tags equal the ratified corpus (`REAL-C-05`) | Closes the self-attestation gap on durability | `REAL-C-05` IA |

**Ordering rule (fail-closed).** RM-2 (authorization-of-record) commits **before** RM-3/RM-4, so the ledger and
its ADs enter history **together and first** — enforcing the `REAL-H-07` enroll-before/with-durability
invariant rather than repeating the retroactive pattern.

---

## 7. Determination

> ### REAL-M-07 — **FAIL**
>
> On reproduced `git` evidence, repository durability **FAILS**. The pushed, durable state of record is
> **PI-1 Foundation (commit 519aed9 / tag `pi1-foundation-v1.0.1`)**. **Everything the program has produced
> since — the PI-2..PI-9 control-substrate implementation (0 of 138 source files tracked), all eight scoped
> Article IX authorizations `AD-0016..0023` (0 of 8 tracked), the restored canonical `AUTH-012` v1.0.13 ledger
> content (tracked but modified-uncommitted), the Authority Index, the artifact registry, PROJECT-STATE, and
> the entire U-phase governance/audit/certification corpus — exists only in this working tree**: **431
> untracked files + 7 modified-uncommitted tracked files**. The `git push` posture is immaterial: the branch is
> **0-ahead of its upstream**, so nothing can be pushed **because nothing has been committed**.
>
> This is not a partial defect. **A single working-tree loss today** — disk failure, `reset --hard`,
> `checkout .`, or re-clone — **would erase the entire implementation and the entire authorization-of-record**,
> reverting the canonical ledger to ≤ AD-0015 / v1.0.5 and leaving only the PI-1 baseline. The
> authorization-of-record for every post-PI-1 construction wave has **exactly one copy**. This is the exact
> *enrollment-not-durable* condition (`REAL-H-07` OO-6 / F-5 / gate E5) and it holds the `REAL-H-07` PASS-gate
> (G-4) open and the `CONST-READY-001` first-wave durability blocker unresolved.
>
> The verdict is **FAIL**, not PARTIAL, because durability is binary at the point of loss: uncommitted work is
> unrecoverable, and the load-bearing corpus is uncommitted. It is **remediable now** and cheaply — the
> §6 sequence (authorize → commit authorization-of-record first → commit implementation → commit evidence →
> push → tag → verify) converts FAIL to PASS without any architecture, governance, or code change. The
> mitigating facts (`origin` configured, tip pushed, no governance artifact ignored, frozen tags intact) reduce
> setup effort but do **not** lift the FAIL: they preserve only PI-1-and-earlier.
>
> Durability determination only — no commit, push, tag, add, code, architecture, or governance change performed.
> INV-1..13, AD-0014, and the Article IX generation lock are unchanged; `UCOS-CONSTRUCTION-BLOCKED` stands.

### OUTPUT

**`REAL-M-07-REPOSITORY-INTEGRITY-AND-DURABILITY-AUDIT` — COMPLETE · VERDICT: **FAIL** · REPRODUCED: BRANCH
`phase-10-implementation-readiness` @ 519aed9 (0 AHEAD / 0 BEHIND UPSTREAM; TIP = PI-1 + GITIGNORE) · **431
UNTRACKED + 7 MODIFIED-UNCOMMITTED** · **0/138 `platform-runtime/src` TRACKED** · **0/8 AD-0016..0023 TRACKED**
· CANONICAL `AUTH-012` v1.0.13 MODIFIED-UNCOMMITTED · NEWEST DURABLE STATE = `pi1-foundation-v1.0.1` · ALL
POST-PI-1 IMPLEMENTATION + AUTHORIZATION + GOVERNANCE EVIDENCE **NOT DURABLE** · CATASTROPHIC LOSS EXPOSURE
TODAY · `.gitignore` EXCLUDES NO GOVERNANCE ARTIFACT (POSITIVE) · 8-STEP REMEDIATION SEQUENCE SPECIFIED
(AUTHORIZE → COMMIT AUTHORIZATION-OF-RECORD FIRST → COMMIT IMPL → COMMIT EVIDENCE → PUSH → TAG → RECONCILE MAIN
→ INDEPENDENT VERIFY) · NO COMMIT / PUSH / TAG / CODE / ARCHITECTURE / GOVERNANCE CHANGE PERFORMED BY THIS
ARTIFACT.**

---

## 8. Governance / Non-Mutation Statement

No source code, infrastructure, or authorization was produced; no commit, push, tag, `git add`, branch, or
config change was made; no lock released; no invariant enrolled; no ratified/frozen construct modified. **All
`git` operations were strictly read-only** (`status`, `branch -vv`, `remote -v`, `log`, `tag`, `ls-files`,
`rev-list`, `diff --name-only`). INV-1..13, `AUTH-012` substance (v1.0.13), AD-0014, the Article IX generation
lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged. Every remediation step in §6 (commit/push/tag of the
corpus, release of the DO-NOT-PUSH branch posture, `main` reconciliation) remains an Approval-Required Operation
(AUTH-012 §8 / AD-0009) reserved to the UCOS Authority Board.

## 9. Traceability
- **Consumes (authoritative):** `CONST-READY-001` (GT-7 durability defect; REAL-M-07 PARTIAL), `REAL-C-05`
  (independent-verification requirement; IA), `REAL-M-03` (T-15 durability; C-9 governed commit/push),
  `REAL-C-01` (evidence-durability of the certification corpus), `REAL-H-07` (OO-6 enroll↔durability; F-5;
  gate state E5; PASS-gate G-4).
- **Reproduces (read-only):** live `git` working tree, branches, remote, tags, and history of the UCOS repo.
- **Applies:** `GOV-REC-001` (reproduced state > asserted state — supersedes the prior "151 files" estimate).
- **Realizes:** `REAL-001` REAL-M-07 (program committed/tagged to a remote — durability of the certified
  corpus); `ROADMAP-ULT-001` U2.1/CW-1 durability leg.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN),
  AD-0014.
- **Refined by:** the prospective Board acts RM-1..RM-8 (authorize → commit → push → tag → verify) that convert
  this determination from FAIL to PASS.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); independent adjudicator to be
  designated (`REAL-C-05`).

**END REAL-M-07 — REPOSITORY INTEGRITY AND DURABILITY AUDIT · PHASE U8.5 · ZERO-TRUST · REPRODUCED · VERDICT:
FAIL · DURABILITY DETERMINATION ONLY · NO COMMIT / NO PUSH / NO TAG / NO CODE / NO ARCHITECTURE / NO GOVERNANCE
CHANGE.**
