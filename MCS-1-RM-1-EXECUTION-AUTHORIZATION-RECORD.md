# MCS-1 — RM-1 Execution Authorization Record

## PHASE U18 — Formal Execution Authorization to Initiate the Approved RM-2..RM-8 Sequence (Records Only — Executes Nothing)

| Field | Value |
|-------|-------|
| Artifact | **MCS-1 — RM-1 Execution Authorization Record** |
| Artifact ID | `MCS-1-RM-1-EXECUTION-AUTHORIZATION-RECORD` |
| Phase | **U18 — RM-1 Execution Authorization Record** |
| Layer | GOVERNANCE / AUTHORITY (execution-authorization instrument — records the adopted decision; executes nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **EXECUTION AUTHORIZATION RECORDING ONLY** — memorialize the adopted RM-1 Board decision as the instrument that authorizes the approved RM-2..RM-8 sequence and defines the exact conditions under which RM-2 may begin. **This phase does NOT execute RM-2..RM-8, mutate the repository, perform remediation, take certification action, or redesign governance.** Append-only. |
| Authoritative input (per mandate) | **`MCS-1-RM-1-BOARD-DECISION`** (Determination: **ADOPT RM-1**; final minute ready for signature & recording) |
| Governing instruments | AUTH-012 §8 (Approval-Required Operations), AD-0009, `REAL-M-03` C-9, `REAL-H-07` E5/G-4 |
| Governance status | INV-1..13 unchanged; INV-14..20 NOT enrolled; AD-0014 intact; Article IX generation lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |
| **Determination** | **YES** — RM-1 is now an **executable authorization of record**. RM-2 may begin **only** when the exact gating conditions (§ RM-2 Start Conditions) all hold; any unmet condition bars execution fail-closed. |

> **Nature of this record.** This instrument operationalizes the ADOPTED RM-1 decision. It is the authorization
> under which the named operator may execute the certified RM-2..RM-8. It does not itself run any `git`
> command; the ledger enrollment of the RM-1 minute is performed append-only **as the first content of the RM-2
> commit**. Until the § RM-2 Start Conditions are all satisfied at execution time, **no** RM step may run.

---

## 1. Adopted Board Decision

- **Decision of record:** **ADOPT RM-1** — preservation-scoped release of the `phase-10-implementation-readiness` DO-NOT-PUSH posture (per `MCS-1-RM-1-BOARD-DECISION`, PHASE U17).
- **Basis cited:** `REAL-M-07` = FAIL; catastrophic single-working-tree exposure; certified zero-condition package (`MCS-1-ZERO-CONDITION-CERTIFICATION`).
- **Standing controls retained:** Article IX generation lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands; INV-1..13 and AD-0014 unchanged.
- **Minute status:** final minute produced, **ready for signature & recording**; signature/operator/date/adjudicator fields to be completed at the recording moment (see § RM-2 Start Conditions G-A).

## 2. Authorized Scope

Preservation only — copy existing S0 bytes into durable history; **no artifact content edited**:
- **RM-2** atomic authorization-of-record commit (O-1 no-split) · **RM-3** implementation commit · **RM-4** evidence-corpus commit (allowlist guard) · **RM-5** push branch to `origin` · **RM-6** annotated tags `authority-restoration-v1.0.13` (RM-2 commit) and `pi2-pi9-implementation-v1.0.0` (RM-3 commit) + push tags · **RM-7** governed `main` disposition (default PARK) · **RM-8** independent verification.

**Excluded (unauthorized):** Article IX release · lifting `UCOS-CONSTRUCTION-BLOCKED` · CW-0 · construction · certification · AD-0024/AD-0025/AD-0026 · resolution of `REAL-C-05` · any content edit · any history rewrite / force-push.

## 3. Authorized Operators

- **Primary executor:** **[OPERATOR NAME]** — designated by the Board minute; sole party authorized to run RM-2..RM-7. Accountable under SG-6.
- **Independent adjudicator (RM-8):** **[ADJUDICATOR NAME / *pending `REAL-C-05` designation*]** — distinct key from the executor (SG-4).
- **Custodian (oversight):** Chief Authority Architect.
- No party other than the designated executor may initiate or perform any RM git operation under this authorization.

## 4. Authorized Sequence (strict order)

```
RM-2 (atomic authorization-of-record)  →  RM-3 (implementation)  →  RM-4 (evidence)
   →  RM-5 (push)  →  RM-6 (tag + push tags)  →  RM-7 (reconcile main)  →  RM-8 (independent verify)
```
Ordering is fail-closed: RM-3 is barred unless the RM-2 commit exists containing `AUTH-012` + AD-0016..0023 (O-1 gate). No step may be skipped or reordered.

## 5. Required Safeguards (binding; violation voids authorization)

SG-1 scope lock · SG-2 fail-closed Pre-Flight S0 re-confirm · SG-3 invariant binding (O-1/O-2/O-3) · SG-4 independence (attester ≠ executor) · SG-5 optional mirror (defense-in-depth) · SG-6 named accountability · SG-7 forward-only post-push (no revert of corpus commits; no force-push).

## 6. Verification Obligations

- **Pre-Flight (before RM-2):** re-confirm S0 fingerprint — HEAD `519aed95cef03b33afd16bf5ea43a8326ca13c57`; tracked-index `d0d6091486…af0a`; status `5e9112fa…fe0`; tracked 347 · untracked 434 · modified 7 · src 0/138 · AD 0/8. Any drift → STOP.
- **Per-step:** run each RM step's corrected verification (`MCS-1-EXECUTION-PACKAGE` as amended by `MCS-1-ZERO-CONDITION-CERTIFICATION`) — object-hash/content-reproducibility (no live-index mutation), allowlist guard, deterministic SHA derivation.
- **PASS criteria:** all **9** `REAL-M-07` PASS criteria satisfied (U14 § 6).
- **Post-execution:** complete and sign the § D checklist.

## 7. Reporting Obligations

- Record each RM step's outcome + verification evidence (commit SHAs derived via markers, tree hashes, ahead/behind, tag refs).
- On completion, report `REAL-M-07` durability closure to the Board; explicitly note that **`REAL-C-05` and construction remain separately gated**.
- Log any Pre-Flight drift, guard abort, or revocation event immediately to the custodian.

## 8. Attestation Obligations

- **RM-8:** distinct-actor attestation that pushed refs == ratified corpus (tree-hash + count comparison from an independent clone), key ≠ executor (SG-4).
- If `REAL-C-05` is PARTIAL, record the attestation **flagged pending independent adjudication** — non-blocking for the durability verdict but required for full independence closure under `REAL-C-05` G3.
- Record resolved dependency versions as **informational** validation evidence (`REAL-C-01`), not a `REAL-M-07` predicate.

## 9. Revocation Conditions (any triggers immediate void; fail-closed)

- S0 fingerprint drift at execution (Pre-Flight fail).
- Any prohibited operation attempted: `reset --hard`, `--amend` on pushed history, `rebase`, `filter-branch`, `push --force`.
- Staging out of O-1 order (RM-3 before a valid RM-2 commit).
- Scope exceeded beyond preservation (e.g., content edit, lock release attempt).
- Operator unnamed, or a party other than the designated executor acts.
- On revocation: no further RM step proceeds; completed **pre-push** work is rolled back non-destructively (`git reset --soft` / `git restore --staged`); **post-push** state is left intact and corrected only forward-only under a fresh Board act.

## 10. Completion Conditions

RM-1 authorization is **discharged as COMPLETE** when all hold:
- `git status` clean (0 untracked excl-ignored · 0 modified); src 138 tracked; AD 8 tracked.
- RM-2 commit proves O-1 no-split; branch pushed (ahead/behind 0 0); both milestone tags durable on `origin`.
- Content-reproducibility criterion met from a fresh clone; § D checklist signed.
- RM-7 `main` disposition recorded; RM-8 attestation recorded (or flagged pending `REAL-C-05`).
- **Result:** `REAL-M-07` = **PASS**; `REAL-H-07` G-4 unblocked; `CONST-READY-002` durability preventer removed. Article IX lock and `UCOS-CONSTRUCTION-BLOCKED` remain in force.

---

## Required Determination

> ### HAS RM-1 NOW BECOME AN EXECUTABLE AUTHORIZATION?
>
> # **YES**
>
> With the Board decision **ADOPTED** (`MCS-1-RM-1-BOARD-DECISION`) and memorialized in this record — scope,
> operators, sequence, safeguards, verification/reporting/attestation obligations, revocation and completion
> conditions all defined — RM-1 is now an **executable authorization of record**. It authorizes the named
> operator to perform the certified RM-2..RM-8 preservation sequence, and nothing more. Execution has **not**
> occurred and is **not** performed by this artifact.

### Exact conditions under which RM-2 may begin (all must hold; fail-closed)

- **G-A — Minute recorded:** the final RM-1 minute is signed by the Board and the operator is named (SG-6); this instrument's [OPERATOR NAME] field is completed.
- **G-B — Pre-Flight S0 match:** the S0 fingerprint re-confirms exactly (HEAD `519aed9`; tracked-index `d0d60914…`; status `5e9112fa…`; tracked 347 / untracked 434 / modified 7 / src 0/138 / AD 0/8). Any deviation → STOP + re-baseline.
- **G-C — Clean index:** `git diff --cached --name-only` is empty (nothing pre-staged).
- **G-D — Correct branch:** active branch is `phase-10-implementation-readiness` @ `519aed9`, upstream 0/0.
- **G-E — Invariant tooling ready:** RM-2 staging uses the enumerated authorization-of-record set (O-1 no-split), committed atomically in one commit.
- **G-F — No prohibited op:** the operator commits to `add`/`commit`/`push`/`tag` only (SG-3/O-2).
- **G-G — Authorization live:** this record is in force and not revoked.

When **G-A..G-G** all hold, RM-2 may begin — starting with the append-only enrollment of the RM-1 minute into `AUTH-012` as the first content of the atomic RM-2 commit. If any of G-A..G-G fails, RM-2 is barred.

---

## Governance / Non-Execution Statement

No `git` operation, commit, push, tag, branch, or config change was performed; no remediation executed; no lock
released; no invariant enrolled; no ratified/frozen construct modified; no certification awarded or changed; no
governance redesign. This artifact records an execution authorization only. The RM-1 minute's ledger enrollment
occurs append-only as the first content of the RM-2 commit (not performed here). INV-1..13, `AUTH-012`
substance (v1.0.13), AD-0014, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged.

## Traceability
- **Consumes (authoritative):** `MCS-1-RM-1-BOARD-DECISION` (ADOPT RM-1).
- **Records:** the executable RM-1 authorization + RM-2 start conditions (G-A..G-G).
- **Authorizes (on G-A..G-G):** the named operator to execute certified RM-2..RM-8 → `REAL-M-07` FAIL → PASS.
- **Does not affect:** `REAL-C-05` (separate blocker), Article IX lock, `UCOS-CONSTRUCTION-BLOCKED`, construction, AD-0024/0025/0026.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); independent adjudicator to be designated (`REAL-C-05`).

**END MCS-1-RM-1-EXECUTION-AUTHORIZATION-RECORD — PHASE U18 · RM-1 EXECUTABLE = **YES** · SCOPE / OPERATORS /
SEQUENCE / SAFEGUARDS / VERIFICATION / REPORTING / ATTESTATION / REVOCATION / COMPLETION RECORDED · RM-2 START
GATED ON G-A..G-G · NO EXECUTION / NO MUTATION / NO REMEDIATION / NO CERTIFICATION ACTION / NO GOVERNANCE
REDESIGN PERFORMED BY THIS ARTIFACT.**
