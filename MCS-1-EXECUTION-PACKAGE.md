# MCS-1 — Execution Package (Repository Durability Restoration)

## PHASE U12 — Operator-Ready RM-1..RM-8 Closure Instructions (Content-Preserving · Fail-Closed · No History Rewrite)

| Field | Value |
|-------|-------|
| Artifact | **MCS-1 — Execution Package** |
| Artifact ID | `MCS-1-EXECUTION-PACKAGE` |
| Phase | **U12 — Minimum Closure Sequence · Execution Package** |
| Layer | GOVERNANCE / ASSURANCE (execution instructions — prescribes exact operator steps; **executes nothing**) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **EXECUTION PACKAGE ONLY** — the complete operator-ready command set to move `REAL-M-07` FAIL → PASS from the accepted baseline. **This artifact performs no `git add`, commit, push, tag, branch, or config change; writes no code; changes no architecture, governance, certification, or authorization state.** Append-only. |
| Authoritative inputs (per mandate) | **`REAL-M-07-REPOSITORY-INTEGRITY-AND-DURABILITY-AUDIT`** (FAIL; RR-1..RR-8), **`REAL-M-07-REMEDIATION-PLAN`** (RM-1..RM-8; invariants O-1/O-2/O-3), **`CONST-READY-002`** (M-07 hard preventer), **`MCS-1-PRE-EXECUTION-BASELINE`** (S0 frozen; BASELINE ACCEPTED) |
| Frozen baseline (S0) | branch `phase-10-implementation-readiness` @ **`519aed95cef03b33afd16bf5ea43a8326ca13c57`**; upstream 0/0; tracked **347** · untracked **434** · modified **7** · deleted **0** · renamed **0** · staged **0**; src **0/138**; AD **0/8**; tags **3**; `main` +4 unpushed. Fingerprint: tracked-index `d0d60914…`, status `5e9112fa…`, untracked-set `8e6ca019…` |
| Governing discipline | **Preserve, never rewrite.** Only `add`/`commit`/`push`/`tag`. **Prohibited:** `reset --hard`, `commit --amend` on pushed history, `rebase`, `filter-branch`, `push --force`. Authorization-of-record commits **first and atomically** (Invariant O-1). |
| Governance status | INV-1..13 unchanged; INV-14..20 NOT enrolled; AD-0014 intact; Article IX generation lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. This package releases nothing and commits nothing. |
| **Determination** | **YES** — if RM-1..RM-8 are executed exactly against accepted baseline S0, `REAL-M-07` becomes **PASS**. (§ Required Determination.) |

> **What this package is and is not.** It is the exact, copy-pasteable command sequence + verification +
> rollback for each RM step. It is **not** an authorization to run them — **RM-1 (Board release of the
> `phase-10-implementation-readiness` DO-NOT-PUSH posture) is the governed precondition to every mutation**, and
> this artifact does not grant it. Nothing here is executed. Operator MUST confirm S0 fingerprint (§ Pre-Flight)
> before any command.

---

## 0. Environment & Conventions

```bash
# Set once per operator shell. Every command below assumes this working directory and branch.
export UCOS_ROOT="/Users/bipinkumar/Desktop/Projects/Active/UCOS"
export BR="phase-10-implementation-readiness"
cd "$UCOS_ROOT"
```

- **Invariant O-1 (no-split):** the ledger (`AUTH-012`) and all 8 AD records land in the **same** commit (RM-2). No selective stage that separates them.
- **Invariant O-2 (no-rewrite):** only `add`/`commit`/`push`/`tag`. Never `reset --hard`, `--amend` (on pushed), `rebase`, `filter-branch`, `push --force`.
- **Invariant O-3 (recoverable):** until RM-5 (push) everything is local and reversible via `git reset --soft` / `git restore --staged`. After RM-5, correction is forward-only (`git revert`).
- **Content preservation:** every commit copies **existing working-tree bytes** into history. No file content is edited by any step. The RM-2 ledger commit MUST be byte-identical to the working tree (verified).

### Pre-Flight — Confirm frozen baseline S0 (read-only; MUST match before RM-1)

```bash
git rev-parse HEAD                                             # expect 519aed95cef03b33afd16bf5ea43a8326ca13c57
git rev-parse --abbrev-ref HEAD                                # expect phase-10-implementation-readiness
git rev-list --left-right --count origin/$BR...$BR            # expect: 0	0
git ls-files | wc -l                                          # expect 347
git ls-files --others --exclude-standard | wc -l              # expect 434
git diff --name-only | wc -l                                  # expect 7
git ls-files | grep -c 'platform-runtime/src/'                # expect 0
git ls-files | grep -c '^AD-00'                               # expect 0
git ls-files -s | shasum -a 256 | cut -d' ' -f1               # expect d0d6091486e06e8c4d4181698913ecbb8a8f6deffa0efa84e026c497ed48af0a
git status --porcelain=v1 | shasum -a 256 | cut -d' ' -f1     # expect 5e9112fa77b8fe52c8b25ed42165898d6f29ef90c9ca74838b29ab944b7ebfe0
```

> **Fail-closed gate:** if any Pre-Flight value differs from S0, **STOP** — the baseline has drifted; re-run
> `MCS-1-PRE-EXECUTION-BASELINE` and re-accept before proceeding. Do not execute any RM step against a drifted base.

---

## 1. Execution Steps (RM-1 .. RM-8)

### RM-1 — Authorize the durability act (release the DO-NOT-PUSH posture)

1. **Objective:** Obtain the governed Authority-Board decision permitting commit/push/tag of the S0 corpus, lifting the standing `phase-10-implementation-readiness` DO-NOT-PUSH posture **for preservation scope only**.
2. **Preconditions:** Pre-Flight matches S0; `REAL-M-07`=FAIL of record; `MCS-1-PRE-EXECUTION-BASELINE`=ACCEPTED.
3. **Exact commands:** *None — this is a Board minute, not a shell act.* The minute's text becomes part of RM-2 content (appended to `AUTH-012` as the governing decision **before** RM-2 stages it; that append is a governance-process record of a decision already taken, not a content redesign).
4. **Files affected:** None by shell. (The decision is recorded in the `AUTH-012` working-tree file that RM-2 commits.)
5. **Expected repository state changes:** None (no `git` invoked).
6. **Expected durability impact:** None yet — unlocks RM-2..RM-8.
7. **Verification commands:** `grep -n "DO-NOT-PUSH" .claude/authority/AUTH-012-DECISION-LOG.md` (decision minute present, cites `REAL-M-07` FAIL + `REAL-M-03` C-9, scope = preservation only).
8. **Verification evidence:** Minute exists; scope limited to commit/push/tag preservation; **no** lock release, **no** new authorization, **no** certification.
9. **Failure conditions:** Minute absent, or scope exceeds preservation (e.g., attempts Article IX release). → **STOP**, fail-closed default is "do not commit."
10. **Rollback procedure:** N/A — if withheld, the sequence simply never starts (no mutation has occurred).
11. **Residual risks:** None (no state changed).
12. **Completion criteria:** Board decision minuted and scoped to preservation; **Approval-Required Operation granted** (AUTH-012 §8 / AD-0009).

---

### RM-2 — Commit the authorization-of-record (FIRST, atomic — Invariant O-1)

1. **Objective:** Make the canonical authorization chain durable in **one** commit so no AD is ever separated from its ledger enrollment.
2. **Preconditions:** RM-1 granted; index clean (`git diff --cached --name-only` empty).
3. **Exact commands:**
```bash
# Stage the modified authorization-of-record (byte-identical to working tree) ...
git add -- \
  .claude/authority/AUTH-012-DECISION-LOG.md \
  .claude/authority/AUTHORITY-INDEX.md \
  .claude/context/UCOS-ARTIFACT-REGISTRY.md \
  .claude/state/PROJECT-STATE.md

# ... together with the 8 AD records and the restoration/authorization-review chain (no-split, O-1)
git add -- \
  AD-0016-PI2-PI3-SUBSTRATE-CONSTRUCTION-AUTHORIZATION.md \
  AD-0017-PI4-CONTROL-FABRICS-CONSTRUCTION-AUTHORIZATION.md \
  AD-0018-PI5-FEDERATION-FABRIC-CONSTRUCTION-AUTHORIZATION.md \
  AD-0019-PI6-EVOLUTION-FABRIC-CONSTRUCTION-AUTHORIZATION.md \
  AD-0020-PI7-KNOWLEDGE-FABRIC-CONSTRUCTION-AUTHORIZATION.md \
  AD-0021-PI8-ONTOLOGY-FABRIC-CONSTRUCTION-AUTHORIZATION.md \
  AD-0022-PI11-SIMULATION-FABRIC-CONSTRUCTION-AUTHORIZATION.md \
  AD-0023-PI9-MEMORY-FABRIC-CONSTRUCTION-AUTHORIZATION.md \
  AUTH-REST-001-AUTHORITY-CHAIN-VERIFICATION.md \
  AUTH-REST-002-LEDGER-RECONCILIATION.md \
  AUTH-REST-003-CONFLICT-RESOLUTION.md \
  AUTH-REST-004-FINAL-AUTHORITY-STATE.md \
  AUTH-CONST-001-CONSTRUCTION-AUTHORIZATION-PROGRAM.md \
  GOV-REC-001-GOVERNANCE-RECONCILIATION.md \
  FGA-2-ARTICLE-IX-RELEASE-REVIEW.md \
  INT-AUTH-001-PI10-AUTHORIZATION-RECOMMENDATION.md \
  INT-AUTH-001-PI10-REAUTH-ONTOLOGY-MEMORY.md \
  INT-AUTH-002-PI10-REAUTH-PROVENANCE-FED-GOV-AUD.md \
  INT-AUTH-003-PI10-REAUTH-REMEDIATION-GATES.md \
  INT-AUTH-004-PI10-REAUTH-DETERMINATION.md \
  INT-AUTH-REV-001-DEPENDENCY-ANALYSIS.md \
  INT-AUTH-REV-002-THREAT-REVIEW.md \
  INT-AUTH-REV-003-CAPABILITY-VALIDATION.md \
  INT-AUTH-REV-004-AUTHORIZATION-DETERMINATION.md \
  ONTO-AUTH-REV-001-CONSISTENCY-REVIEW.md \
  ONTO-AUTH-REV-002-THREAT-REVIEW.md \
  ONTO-AUTH-REV-003-CONSTRAINT-CONFORMANCE-REVIEW.md \
  ONTO-AUTH-REV-004-READINESS-DETERMINATION.md

# Prove the ledger is byte-identical to the working tree BEFORE committing (content-preserving)
git diff --cached --numstat -- .claude/authority/AUTH-012-DECISION-LOG.md   # sanity: additions only vs stale committed rev

# Commit atomically
git commit -m "REAL-M-07 RM-2: durably commit authorization-of-record (AUTH-012 v1.0.13 + AD-0016..0023 + restoration/review chain), atomic no-split; content-preserving; per REAL-M-07-REMEDIATION-PLAN / MCS-1"

# Record the commit SHA for tagging (RM-6)
export RM2_SHA=$(git rev-parse HEAD); echo "RM2_SHA=$RM2_SHA"
```
4. **Files affected:** 4 modified-tracked (ledger, index, registry, state) + 8 AD records + 4 AUTH-REST + AUTH-CONST-001 + GOV-REC-001 + FGA-2 + 5 INT-AUTH + 4 INT-AUTH-REV + 4 ONTO-AUTH-REV = **one commit**.
5. **Expected repository state changes:** tracked +~30; modified 7→3 (`.gitignore`, EA doc, README remain for RM-3); untracked 434→~404; HEAD advances to `$RM2_SHA`.
6. **Expected durability impact:** RR-2 closed (ledger v1.0.13 + ADs in history); RR-8 closed (no-split enforced); contributes to RR-1. `REAL-H-07` E4→E5 satisfied for the AD corpus (pending push).
7. **Verification commands:**
```bash
git show --stat "$RM2_SHA" | grep -E 'AUTH-012|AD-0016|AD-0023'          # ledger AND ADs in same commit
git ls-files | grep -c '^AD-00'                                          # expect 8
git show "$RM2_SHA:.claude/authority/AUTH-012-DECISION-LOG.md" | grep -m1 -i 'v1.0.13'   # v1.0.13 present in history
git diff "$RM2_SHA" -- .claude/authority/AUTH-012-DECISION-LOG.md         # expect EMPTY (history == working tree)
```
8. **Verification evidence:** `git show --stat` lists `AUTH-012` **and** all 8 ADs; `grep -c '^AD-00'`→**8**; ledger diff empty (byte-identical).
9. **Failure conditions:** ADs and ledger in **different** commits (O-1 breach); `grep -c '^AD-00'`≠8; ledger diff non-empty (content drift). → rollback.
10. **Rollback procedure (local, non-destructive):**
```bash
git reset --soft HEAD~1        # un-commit, keep working tree + staging
git restore --staged .         # unstage all; working-tree bytes untouched. NO --hard.
```
11. **Residual risks:** None once verified; corpus still local until RM-5 (mitigated by RM-5).
12. **Completion criteria:** Single commit `$RM2_SHA` contains ledger v1.0.13 + AD-0016..0023 + review chain; ledger byte-identical; index otherwise unchanged.

---

### RM-3 — Commit the implementation

1. **Objective:** Make the PI-2..PI-9 substrate + architecture corpus durable and the 269/269 baseline reproducible from history.
2. **Preconditions:** RM-2 committed and verified.
3. **Exact commands:**
```bash
git add -- \
  packages/platform-runtime/src \
  packages/platform-runtime/test \
  packages/platform-runtime/bin \
  packages/platform-runtime/examples \
  packages/platform-runtime/package.json \
  packages/platform-runtime/tsconfig.json \
  packages/platform-runtime/README.md \
  architecture \
  docs/enterprise-architecture/UCOS-ENTERPRISE-ARCHITECTURE.md \
  .gitignore

git commit -m "REAL-M-07 RM-3: durably commit PI-2..PI-9 implementation (platform-runtime/**, 138 src) + architecture/** + EA baseline; content-preserving; reproduces 269/269 from history; per MCS-1"

export RM3_SHA=$(git rev-parse HEAD); echo "RM3_SHA=$RM3_SHA"
```
4. **Files affected:** `platform-runtime/{src(138),test,bin,examples,package.json,tsconfig.json,README.md}`, `architecture/**` (11 subtrees), EA doc, `.gitignore` (build/inventory housekeeping). `node_modules/`, `*.tsbuildinfo` remain correctly ignored.
5. **Expected repository state changes:** tracked += (138 src + tests + architecture tree + 3 modified); modified 3→0; untracked ~404→~(evidence corpus only); HEAD→`$RM3_SHA`.
6. **Expected durability impact:** RR-3 closed (impl in history); RR-5 (baseline reproducibility) advanced; contributes RR-1.
7. **Verification commands:**
```bash
git ls-files | grep -c 'platform-runtime/src/'     # expect 138
git status --porcelain | grep -c 'platform-runtime/src/'   # expect 0 (no longer untracked)
# History-reproducibility (fresh checkout, not just disk):
TMP=$(mktemp -d); git --work-tree="$TMP" checkout "$RM3_SHA" -- packages/platform-runtime 2>/dev/null; \
  ( cd "$TMP/packages/platform-runtime" && npm ci --silent && npx tsc --noEmit && node --test ) ; \
  echo "expect: tsc clean + 269/269"; rm -rf "$TMP"
```
8. **Verification evidence:** `grep -c platform-runtime/src/`→**138**; `tsc --noEmit` clean; `node --test`→**269/269** from a fresh checkout of `$RM3_SHA`.
9. **Failure conditions:** src count ≠138; tsc errors; tests ≠269/269 from history; source still untracked. → rollback.
10. **Rollback procedure:** `git reset --soft HEAD~1 && git restore --staged .` (non-destructive; no `--hard`).
11. **Residual risks:** Local until RM-5 (mitigated by RM-5).
12. **Completion criteria:** 138 src tracked; `git status` shows source tree no longer untracked; 269/269 reproducible from `$RM3_SHA`.

---

### RM-4 — Commit the evidence corpus

1. **Objective:** Preserve all certification-grade evidence, ratification proofs, U-phase audits, and the reconciliation chain.
2. **Preconditions:** RM-3 committed and verified.
3. **Exact commands:**
```bash
# All remaining untracked evidence documents (PI5*/PI6*/PI7*/ONTO-*/MEM-*/UCOM-*/REAL-*/CONST-READY-*/ULT-*/
# ROADMAP-ULT-001/REAL-001/OP-CERT-001/UA-*/EXIST-001/RA-1/RA-2/REG-*/AF-*/ARCH-GAP-*/AUDIT-UNIV-001/
# AUTH-UNIV-001/BEST-001/CIV-STRESS-001/EXT-001/INT-REM-*/INTEL-001/LIFE-UNIV-001/PHASE-* and this MCS-1 set)
git add -A

# Confirm nothing unexpected is staged (authorization/impl already committed in RM-2/RM-3)
git status --porcelain --untracked-files=all | grep -c '^??'   # expect 0

git commit -m "REAL-M-07 RM-4: durably commit evidence corpus (PI*/ONTO*/MEM* ratification, U-phase audits, UCOM-* certification instruments, REAL-*/CONST-READY-*, MCS-1 baseline+package); content-preserving; per MCS-1"

export RM4_SHA=$(git rev-parse HEAD); echo "RM4_SHA=$RM4_SHA"
```
4. **Files affected:** All remaining ~event/ratification/certification/U-phase documents (incl. `MCS-1-PRE-EXECUTION-BASELINE.md` and this `MCS-1-EXECUTION-PACKAGE.md`).
5. **Expected repository state changes:** untracked→**0**; modified→**0**; HEAD→`$RM4_SHA`.
6. **Expected durability impact:** RR-5 closed (evidence in history); RR-1 fully closed at commit level (push in RM-5).
7. **Verification commands:**
```bash
git status --porcelain | grep -vc '^!!'            # expect 0 (0 untracked excl-ignored, 0 modified)
git ls-files --others --exclude-standard | wc -l   # expect 0
git cat-file -e "$RM4_SHA:CONST-READY-002-FINAL-CONSTRUCTION-READINESS-DETERMINATION.md" && echo OK
```
8. **Verification evidence:** `git status` → 0 untracked (excl. ignored) · 0 modified; every `REAL-*`/`UCOM-*`/`ONTO-RAT-*`/`MEM-RAT-*` resolves via `git cat-file -e`.
9. **Failure conditions:** any untracked (excl. ignored) remains; any modified remains. → rollback.
10. **Rollback procedure:** `git reset --soft HEAD~1 && git restore --staged .` (non-destructive).
11. **Residual risks:** Local until RM-5.
12. **Completion criteria:** `git status` clean (0 untracked excl-ignored, 0 modified); ignored set still 118 (build noise only).

---

### RM-5 — Push the branch to origin (the durability event)

1. **Objective:** Move RM-2..RM-4 off the single working tree into `origin` — the actual durability event.
2. **Preconditions:** RM-2/3/4 committed & verified; `git status` clean; branch now N-ahead of upstream.
3. **Exact commands:**
```bash
git rev-list --left-right --count origin/$BR...$BR   # expect: 0	3  (0 behind / 3+ ahead) BEFORE push
git push origin "$BR"
```
4. **Files affected:** None new — transmits existing commits `$RM2_SHA..$RM4_SHA` to `origin/$BR`.
5. **Expected repository state changes:** `origin/$BR` advances to local HEAD (`$RM4_SHA`); ahead/behind → **0 0**.
6. **Expected durability impact:** **RR-1 closed** (corpus off-tree in remote), **RR-4 closed** (`REAL-H-07` E5 durability precondition met), **RR-7 reduced** (first off-machine copy).
7. **Verification commands:**
```bash
git rev-list --left-right --count origin/$BR...$BR   # expect: 0	0
git ls-remote origin "$BR"                            # head == $RM4_SHA
# Independent re-clone reproduces the corpus:
TMP=$(mktemp -d); git clone --branch "$BR" https://github.com/echelonxventures-Projects/UCOS.git "$TMP/clone"; \
  git -C "$TMP/clone" rev-parse HEAD; echo "expect: $RM4_SHA"; rm -rf "$TMP"
```
8. **Verification evidence:** ahead/behind **0 0**; `ls-remote` head == `$RM4_SHA`; fresh clone HEAD == `$RM4_SHA`.
9. **Failure conditions:** push rejected (non-fast-forward → **do NOT force**; investigate remote divergence), or remote head ≠ `$RM4_SHA`.
10. **Rollback procedure (forward-only, post-publish):** a bad push is corrected by a **new corrective commit + push**; if an unintended commit was pushed, `git revert <sha>` (adds inverse commit). **Never** `push --force`. Altering published refs requires explicit Board approval.
11. **Residual risks:** RR-7 (single remote) — mitigate optionally with a second remote/mirror (defense-in-depth, non-blocking).
12. **Completion criteria:** `origin/$BR` == local HEAD; fresh clone reproduces corpus; ahead/behind 0 0.

---

### RM-6 — Tag milestones and verify

1. **Objective:** Create immutable recovery points binding ratified states to durable refs.
2. **Preconditions:** RM-5 pushed; `$RM2_SHA` and `$RM3_SHA` recorded.
3. **Exact commands:**
```bash
git tag -a authority-restoration-v1.0.13 "$RM2_SHA" \
  -m "REAL-M-07 RM-6: authority-of-record durable (AUTH-012 v1.0.13 + AD-0016..0023) @ RM-2"
git tag -a pi2-pi9-implementation-v1.0.0 "$RM3_SHA" \
  -m "REAL-M-07 RM-6: PI-2..PI-9 implementation durable (269/269 reproducible) @ RM-3"
git push origin authority-restoration-v1.0.13 pi2-pi9-implementation-v1.0.0
```
4. **Files affected:** None (annotated tags on existing commits `$RM2_SHA`, `$RM3_SHA`).
5. **Expected repository state changes:** tags 3→**5**; both new tags pushed.
6. **Expected durability impact:** RR-4 recovery-point artifact created; RR-7 durable anchors added.
7. **Verification commands:**
```bash
git tag --list | grep -E 'authority-restoration-v1.0.13|pi2-pi9-implementation-v1.0.0'
git ls-remote --tags origin | grep -E 'authority-restoration-v1.0.13|pi2-pi9-implementation-v1.0.0'
git rev-list -n1 authority-restoration-v1.0.13   # expect $RM2_SHA
git rev-list -n1 pi2-pi9-implementation-v1.0.0   # expect $RM3_SHA
```
8. **Verification evidence:** both tags present locally and on `origin`; tag→commit mapping equals `$RM2_SHA`/`$RM3_SHA`.
9. **Failure conditions:** tag missing on remote; tag points to wrong commit.
10. **Rollback procedure:** tags not yet relied upon downstream — `git tag -d <t> && git push origin :refs/tags/<t>` then re-tag correctly (append-only recovery-point set; no history rewrite).
11. **Residual risks:** None material.
12. **Completion criteria:** authority + implementation tags exist, pushed, and map to the correct commits.

---

### RM-7 — Reconcile the stale `main` side-line

1. **Objective:** Remove branch-of-truth ambiguity (RR-6): `main` is +4 unpushed Phase-9 audit commits (`82213a2`, `7d03937`, `2006937`, `86ee636`).
2. **Preconditions:** RM-5 done (working branch is the durable source of truth). Independent of RM-8.
3. **Exact commands (choose ONE governed disposition):**
```bash
# Option A — PARK (default, non-destructive): document that main is historical, phase-10 branch is canonical.
git log --oneline origin/main..main          # record the 4 commits in the disposition note (no push)

# Option B — GOVERNED PUSH (only if Board decides main should carry these audits):
git push origin main                          # forward-only; NO force
```
4. **Files affected:** None in the working corpus; disposition of local `main`'s 4 commits only. **No implicit merge into `$BR`.**
5. **Expected repository state changes:** Option A: none (recorded note). Option B: `origin/main` advances +4.
6. **Expected durability impact:** RR-6 closed (canonical ref unambiguous).
7. **Verification commands:** `git log origin/main..main` outcome documented; recorded disposition note states which ref is canonical.
8. **Verification evidence:** Disposition note exists; no ambiguity about branch-of-truth.
9. **Failure conditions:** `main` merged into `$BR` implicitly; or disposition undocumented.
10. **Rollback procedure:** Parking changes nothing; a governed `main` push is forward-only and reversible via `git revert`. **No force-push.**
11. **Residual risks:** None once documented.
12. **Completion criteria:** Recorded governed disposition (park or push); canonical ref declared.

---

### RM-8 — Independent verification (REAL-C-05 attestation)

1. **Objective:** Close the self-attestation gap on durability: a **distinct actor** confirms pushed refs equal the ratified corpus.
2. **Preconditions:** RM-5/RM-6 done. Requires `REAL-C-05` operational (G1–G4) for a genuinely distinct-key attestation; if C-05 still PARTIAL, record attestation **flagged pending independent adjudication**.
3. **Exact commands (run by the distinct actor, on a separate machine/key):**
```bash
TMP=$(mktemp -d); git clone https://github.com/echelonxventures-Projects/UCOS.git "$TMP/verify"
cd "$TMP/verify" && git checkout phase-10-implementation-readiness
git rev-parse HEAD                                              # attest == $RM4_SHA
git rev-list -n1 authority-restoration-v1.0.13                 # attest == $RM2_SHA
git rev-list -n1 pi2-pi9-implementation-v1.0.0                 # attest == $RM3_SHA
git ls-files | grep -c 'platform-runtime/src/'                # attest 138
git ls-files | grep -c '^AD-00'                               # attest 8
git ls-files -s | shasum -a 256                               # attest tracked-index digest (S1)
( cd packages/platform-runtime && npm ci --silent && npx tsc --noEmit && node --test )   # attest 269/269
```
4. **Files affected:** None (produces an attestation record on the `REAL-C-05` attestation chain — see § E).
5. **Expected repository state changes:** None (read-only, separate clone).
6. **Expected durability impact:** Certification-grade confidence over RR-1..RR-7 closure; satisfies `REAL-C-05` independence for the durability claim.
7. **Verification commands:** the block in (3), executed by a distinct-actor key.
8. **Verification evidence:** distinct-actor attestation record (`REAL-C-05` SIG-4) stating pushed tags == ratified states; hash comparison matches S1 fingerprint.
9. **Failure conditions:** any hash/count mismatch, or attestation produced by the **same** key as the executor (not independent). → re-open the relevant RM step fail-closed.
10. **Rollback procedure:** N/A (an attestation); a failed verification re-opens the failing RM step.
11. **Residual risks:** If `REAL-C-05` is still PARTIAL, durability PASS stands on the mechanical evidence but the *independence* rider remains pending until C-05 G1–G4 close.
12. **Completion criteria:** Distinct-actor attestation recorded (or explicitly flagged pending C-05); pushed refs == ratified corpus.

---

## A. S0 → S1 State Transition Matrix

| Metric | S0 (frozen baseline) | S1 (post RM-1..RM-8) | Driven by |
|--------|:--------------------:|:--------------------:|-----------|
| Active branch | `phase-10-implementation-readiness` | unchanged | — |
| HEAD commit | `519aed9` | `$RM4_SHA` (advanced) | RM-2/3/4 |
| Upstream ahead/behind | 0 / 0 (nothing to push) | 0 / 0 (all pushed) | RM-5 |
| Tracked files | 347 | 347 + 434 + (7 modified retained) ≈ **781** | RM-2/3/4 |
| Untracked (excl. ignored) | 434 | **0** | RM-2/3/4 |
| Modified (uncommitted) | 7 | **0** | RM-2/3 |
| Deleted / Renamed / Staged | 0 / 0 / 0 | 0 / 0 / 0 | — |
| `platform-runtime/src/` tracked | 0 / 138 | **138 / 138** | RM-3 |
| AD records tracked | 0 / 8 | **8 / 8** | RM-2 |
| Ledger `AUTH-012` v1.0.13 in history | NO | **YES** | RM-2 |
| Tags | 3 | **5** (authority-restoration, pi2-pi9-implementation added) | RM-6 |
| `main` disposition | +4 unpushed, ambiguous | governed (parked or pushed) | RM-7 |
| Off-machine copy | NONE | `origin` (+ optional mirror) | RM-5 |
| Independent attestation | absent | recorded (or pending C-05) | RM-8 |
| Tracked-index digest | `d0d60914…` | **changed** (grows with corpus) | RM-2/3/4 |
| Working-status digest | `5e9112fa…` | **empty-status digest** (0 untracked/0 modified) | RM-4 |
| `REAL-M-07` verdict | **FAIL** | **PASS** | RM-1..RM-8 |

---

## B. RR-1..RR-8 Closure Matrix

| Risk | Description | Closed by | Residual after S1 |
|:----:|-------------|-----------|-------------------|
| **RR-1** | Total loss of post-PI-1 corpus | RM-2 + RM-3 + RM-4 + RM-5 | None (corpus in remote history) |
| **RR-2** | Ledger reverts to ≤ AD-0015 | RM-2 (ledger committed) + RM-5 | None |
| **RR-3** | Implementation unrecoverable | RM-3 + RM-5 | None |
| **RR-4** | `REAL-H-07` gate E5 durability FAIL | RM-5 + RM-6 (durable + tagged) | Cleared → unblocks `REAL-H-07` G-4 |
| **RR-5** | Cert/ratification evidence non-reproducible | RM-4 + RM-5 | None |
| **RR-6** | Stale `main` ambiguity | RM-7 | None (disposition recorded) |
| **RR-7** | Single-remote/single-tree concentration | RM-5 + RM-6 | Reduced; optional mirror for defense-in-depth |
| **RR-8** | Partial commit splits authorization from evidence | RM-2 atomicity (Invariant O-1) | None (no-split enforced) |

---

## C. REAL-M-07 PASS Criteria

`REAL-M-07` = **PASS** iff **all** hold (re-checked at execution time):

- [ ] `git status` → **0 untracked (excl. ignored) · 0 modified** (RM-2/3/4 complete).
- [ ] `git ls-files | grep -c 'platform-runtime/src/'` → **138** (implementation durable).
- [ ] `git ls-files | grep -c '^AD-00'` → **8** (authorizations durable).
- [ ] `git show $RM2_SHA` contains `AUTH-012` **and** AD-0016..0023 in the **same** commit (no-split proven).
- [ ] `git rev-list --left-right --count origin/$BR...$BR` → **0 0** (pushed).
- [ ] Fresh clone → `tsc --noEmit` clean + `node --test` **269/269** (history-reproducible baseline).
- [ ] `git ls-remote --tags origin` shows `authority-restoration-v1.0.13` **and** `pi2-pi9-implementation-v1.0.0`.
- [ ] Independent attestation (RM-8) recorded (or explicitly flagged pending `REAL-C-05`).
- [ ] Ledger `AUTH-012` v1.0.13 byte-identical between `$RM2_SHA` and the S0 working tree (content-preserving proven).

---

## D. Post-Execution Verification Checklist (operator sign-off)

```bash
# 1 — clean tree
git status --porcelain | grep -vc '^!!'                 # 0
# 2 — implementation durable
git ls-files | grep -c 'platform-runtime/src/'          # 138
# 3 — authorization durable
git ls-files | grep -c '^AD-00'                         # 8
# 4 — no-split proven
git show --stat "$RM2_SHA" | grep -E 'AUTH-012|AD-0023' # both present
# 5 — pushed
git rev-list --left-right --count origin/$BR...$BR      # 0	0
git ls-remote origin "$BR"                              # == $RM4_SHA
# 6 — tags durable
git ls-remote --tags origin | grep -cE 'authority-restoration-v1.0.13|pi2-pi9-implementation-v1.0.0'  # 2
# 7 — history-reproducible baseline (fresh clone)
#     tsc --noEmit clean AND node --test => 269/269
# 8 — main reconciled (disposition note present)
git log --oneline origin/main..main                     # documented (0 if pushed; else parked+recorded)
```
Sign-off requires items 1–7 PASS and item 8 documented. Item RM-8 attestation attached (or pending-C-05 flag recorded).

---

## E. Independent Attestation Inputs (for REAL-C-05 G3)

Provide these to the distinct-actor adjudicator; the attestation MUST be produced with a **key distinct** from the executor's:

| Input | Value / Source | Attestation assertion |
|-------|----------------|-----------------------|
| Canonical branch | `phase-10-implementation-readiness` on `origin` | ref exists on remote |
| Expected HEAD (S1) | `$RM4_SHA` (recorded at RM-4) | remote HEAD == `$RM4_SHA` |
| Authority tag | `authority-restoration-v1.0.13` → `$RM2_SHA` | tag maps to RM-2 commit |
| Implementation tag | `pi2-pi9-implementation-v1.0.0` → `$RM3_SHA` | tag maps to RM-3 commit |
| No-split proof | `git show $RM2_SHA` | `AUTH-012` + AD-0016..0023 in one commit |
| Implementation count | `git ls-files \| grep -c platform-runtime/src/` | == 138 |
| Authorization count | `git ls-files \| grep -c '^AD-00'` | == 8 |
| Tracked-index digest (S1) | `git ls-files -s \| shasum -a 256` (from fresh clone) | matches executor-published S1 digest |
| Test reproducibility | fresh clone → `npm ci && tsc --noEmit && node --test` | 269/269, tsc clean |
| S0 reference | `MCS-1-PRE-EXECUTION-BASELINE` fingerprints (`d0d60914…`, `5e9112fa…`, `8e6ca019…`) | S0→S1 delta consistent with RM-2..RM-6 |
| Content-preservation | `git diff $RM2_SHA -- .claude/authority/AUTH-012-DECISION-LOG.md` | empty (no content change) |
| Independence | executor key ≠ attester key | distinct-actor confirmed (`REAL-C-05` SIG-4) |

Attestation record feeds `REAL-C-05` **G3** and closes RM-8; if `REAL-C-05` is still PARTIAL, record it flagged *pending independent adjudication*.

---

## Required Determination

> ### IF RM-1..RM-8 ARE EXECUTED EXACTLY, USING THE ACCEPTED BASELINE, WILL REAL-M-07 BECOME PASS?
>
> # **YES**
>
> Executing RM-1 (authorize) → RM-2 (commit authorization-of-record, atomic no-split) → RM-3 (commit
> implementation) → RM-4 (commit evidence) → RM-5 (push) → RM-6 (tag+verify) → RM-7 (reconcile `main`) → RM-8
> (independent verify), exactly as specified against frozen baseline S0, drives every `REAL-M-07` PASS criterion
> (§ C) to satisfied: `git status` clean (0 untracked / 0 modified), 138/138 src tracked, 8/8 AD tracked,
> no-split proven in `$RM2_SHA`, branch pushed (0 0), 269/269 reproducible from a fresh clone, both milestone
> tags durable on `origin`, and a distinct-actor attestation recorded. This closes RR-1..RR-8 (§ B) and clears
> the `CONST-READY-002` durability hard-preventer. Because every step is **content-preserving and
> additive-to-history** (Invariants O-1/O-2/O-3), it changes **no architecture, no governance, no certification
> status, no authorization status, and no source semantics** — it only makes the existing S0 bytes durable.
> Therefore `REAL-M-07` transitions **FAIL → PASS**. (One rider: RM-8 *independence* is fully satisfied only when
> `REAL-C-05` is operational; if C-05 is still PARTIAL, durability PASS holds on the mechanical evidence with the
> independence attestation flagged pending — it does not reopen FAIL.)

---

## Governance / Non-Mutation Statement

No `git add`, commit, push, tag, branch, or config change was performed by this artifact; no source code,
infrastructure, or authorization was produced; no lock released; no invariant enrolled; no ratified/frozen
construct modified; no certification awarded or changed; no closure declared. This is an execution-instruction
artifact. Every step (RM-1..RM-8) is a future Approval-Required Operation (AUTH-012 §8 / AD-0009) reserved to
the UCOS Authority Board, and RM-1 (release of the DO-NOT-PUSH posture) is its governing precondition.
INV-1..13, `AUTH-012` substance (v1.0.13), AD-0014, the Article IX generation lock, and
`UCOS-CONSTRUCTION-BLOCKED` are unchanged.

## Traceability
- **Consumes (authoritative):** `REAL-M-07-REPOSITORY-INTEGRITY-AND-DURABILITY-AUDIT` (FAIL; RR-1..RR-8), `REAL-M-07-REMEDIATION-PLAN` (RM-1..RM-8; O-1/O-2/O-3), `CONST-READY-002` (M-07 hard preventer), `MCS-1-PRE-EXECUTION-BASELINE` (S0 frozen; ACCEPTED).
- **Realizes:** `REAL-001` REAL-M-07 (durable, committed/tagged certified corpus); `ROADMAP-ULT-001` U2.1/CW-1 durability leg; unblocks `REAL-H-07` PASS-gate **G-4** (E5 durability).
- **Coheres with:** `REAL-M-03` C-9 (governed commit/push), `REAL-H-07` R-1/R-3 (enroll-with-durability), `REAL-C-05` (independent verification RM-8 / § E), `GOV-REC-001`.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); independent adjudicator to be designated (`REAL-C-05`).

**END MCS-1-EXECUTION-PACKAGE — PHASE U12 · RM-1..RM-8 OPERATOR-READY · S0→S1 · RR-1..RR-8 CLOSURE · CONTENT-PRESERVING (O-1/O-2/O-3) · DETERMINATION: YES (REAL-M-07 FAIL → PASS) · NO COMMIT / NO PUSH / NO TAG / NO ADD / NO CODE / NO ARCHITECTURE / NO GOVERNANCE / NO CERTIFICATION / NO AUTHORIZATION / NO EXECUTION PERFORMED BY THIS ARTIFACT.**
