# MCS-1 — G-A Governance Activation Dossier

## PHASE U27 — Self-Contained Dossier for Human Activation of G-A (Preparation Only — No Activation)

| Field | Value |
|-------|-------|
| Artifact | **MCS-1 — G-A Governance Activation Dossier** |
| Artifact ID | `MCS-1-G-A-GOVERNANCE-ACTIVATION-DOSSIER` |
| Phase | **U27 — G-A Governance Activation Dossier** |
| Layer | GOVERNANCE / AUTHORITY (activation dossier — self-contained preparation; activates nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **DOSSIER PREPARATION ONLY** — a stand-alone pack usable by Board, Custodian, Executor, and RM-8 Adjudicator **without reference to any prior document**. **No activation, no signature, no operator appointment, no execution, no `git` mutation, no governance modification.** Append-only. |
| Governing instruments (restated) | AUTH-012 §8 (Approval-Required Operations) · §9 (append-only, one-bump-one-record) · AD-0009 · `REAL-M-03` C-9 (governed commit/push) · `REAL-H-07` E5/G-4 (enroll↔durability) |
| Governance status | INV-1..13 unchanged; AD-0014 intact; Article IX generation lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |
| **Determination** | **READY FOR HUMAN ACTIVATION** — the dossier is complete and self-contained; all machine determinants are satisfied (verified live in the preceding phase); only the seven human acts remain. |

---

## 0. Self-Contained Context (no prior document required)

**What is being decided.** Whether to activate **RM-1** — a **preservation-only** release of a standing
"DO-NOT-PUSH" posture on the git branch `phase-10-implementation-readiness` — so an operator may run the
approved **RM-2..RM-8** sequence that makes the working-tree corpus **durable** (commit + push + tag existing
bytes; no content edits).

**Why it matters.** Today the entire post-PI-1 program — the implementation (138 source files), all 8
authorization records (`AD-0016..0023`), the canonical decision ledger `AUTH-012` (v1.0.13), and the full
evidence corpus — exists **only in one working tree** (uncommitted). A single disk/tree loss would erase both
the implementation **and** the authorization-of-record. Making it durable is the `REAL-M-07` = FAIL → PASS fix.

**What activation does NOT do (express non-outcomes).** It does **not** release the Article IX generation lock,
**not** lift `UCOS-CONSTRUCTION-BLOCKED`, **not** authorize CW-0 or construction, **not** award certification,
**not** issue `AD-0024/AD-0025/AD-0026`, and **not** resolve `REAL-C-05` (independent adjudication).

**Frozen machine facts (verified live, immediately prior).**
- Branch `phase-10-implementation-readiness` @ HEAD `519aed95cef03b33afd16bf5ea43a8326ca13c57`; tree `28b819105339183edcad616668b78904b8e2d9db`; upstream **0 ahead / 0 behind**.
- Tracked 347 · staged 0 · modified 7 · runtime-src tracked 0/138 · AD tracked 0/8.
- Tracked-index digest `d0d6091486e06e8c4d4181698913ecbb8a8f6deffa0efa84e026c497ed48af0a`.
- **RM-2 content anchor** (sha256 over `git hash-object` of the 32 authorization-of-record inputs, ASCII order) = `4416b3a776d37d9b60639dfe13d773928445c80f16a2e89f273dc945878ca7ca`.

**Invariants binding execution.** O-1 (authorization-of-record commits **first, atomically, no-split**) · O-2
(**no** history rewrite / `--amend`-on-pushed / `rebase` / `filter-branch` / `push --force` / `reset --hard`) ·
O-3 (recoverable pre-push; forward-only after push).

---

## 1. Governance Activation Brief

- **Current state:** ACTIVATION READY. All machine determinants satisfied and re-verified live; the six governing instruments are mutually consistent; the sole open condition is **G-A** (the human governance act), which also holds G-F and G-G open.
- **Remaining obligations:** seven human acts (HA-1..HA-7): sign the minute, counter-record, name executor, name/pending adjudicator, ratify tag names, record date, record O-2 commitment.
- **Consequences of activation:** RM-2..RM-8 may execute → `REAL-M-07` FAIL → PASS; the authorization-of-record + implementation + evidence become durable (committed, pushed, tagged); unblocks `REAL-H-07` durability gate G-4; removes the first-wave durability preventer. Bounded, reversible-until-push, forward-only after.
- **Consequences of non-activation:** the catastrophic single-tree exposure persists indefinitely; one loss erases the implementation and the authorization-of-record (ledger reverts to ≤ AD-0015); `REAL-M-07` stays FAIL; evidence remains non-reproducible. No offsetting benefit.

---

## 2. Human Action Ledger

| HA | Actor | Action | Evidence Required | Completion Test |
|:--:|-------|--------|-------------------|-----------------|
| **HA-1** | Presiding UCOS Authority Board authority | Sign the **unmodified** RM-1 minute (§3 text) | Attributable, dated signature bound to exact minute text (hash or verbatim) | Signature of record present; minute byte-identical to §3 |
| **HA-2** | Custodian (Chief Authority Architect) | Counter-record the minute | Custodian identity + date | Dual-record complete |
| **HA-3** | Board | Name the **executor operator** | Operator name in minute + authorization record | Single unambiguous executor named |
| **HA-4** | Board | Name **RM-8 adjudicator** or record *pending `REAL-C-05`* | Adjudicator identity (distinct key) or explicit pending flag | Field populated; if named, key ≠ executor |
| **HA-5** | Board | Ratify the two tag names **verbatim** | `authority-restoration-v1.0.13` + `pi2-pi9-implementation-v1.0.0` recorded | Exact names, no variance |
| **HA-6** | Board | Record the **decision date** | Dated entry (AUTH-012 §9) | Date of record present |
| **HA-7** | Named executor | Record the **O-2 commitment** | Pledge: only `add`/`commit`/`push`/`tag`; none of `reset --hard`/`--amend`(pushed)/`rebase`/`filter-branch`/`push --force` | Commitment of record by the named executor |

**G-A ⟺ HA-1..HA-7 all pass their completion tests.**

---

## 3. Activation Ceremony Sequence (exact order, with dependencies)

> **RM-1 MINUTE (verbatim text to be signed).**
> *Decision:* The UCOS Authority Board ADOPTS RM-1 — a preservation-scoped release of the DO-NOT-PUSH posture on
> `phase-10-implementation-readiness`, authorizing execution of RM-2..RM-8. *Basis:* `REAL-M-07` FAIL;
> `REAL-M-03` C-9; AUTH-012 §8 / AD-0009. *Scope:* preservation only (commit authorization-of-record atomically;
> commit implementation; commit evidence; push; tag `authority-restoration-v1.0.13` @ the RM-2 commit and
> `pi2-pi9-implementation-v1.0.0` @ the RM-3 commit; reconcile `main` by PARK default; request independent
> verification). No content edits. *Safeguards (binding):* SG-1 scope-lock · SG-2 fail-closed Pre-Flight · SG-3
> invariant binding (O-1/O-2/O-3) · SG-4 executor≠adjudicator · SG-5 optional mirror · SG-6 named accountability
> · SG-7 forward-only post-push. *Express non-outcomes:* no Article IX release; no lift of
> `UCOS-CONSTRUCTION-BLOCKED`; no CW-0; no construction; no certification; no AD-0024/0025/0026; no `REAL-C-05`
> resolution. *Revocation:* void on S0′ drift, prohibited op, out-of-order staging, scope expansion, or unnamed
> operator.

| Step | Act | Depends on |
|:----:|-----|-----------|
| **1** | Board confirms the §3 minute text is unmodified | — |
| **2** | Confirm executor and adjudicator candidates; verify executor ≠ adjudicator (SG-4) | 1 |
| **3** | **HA-1** presiding authority signs; **HA-6** date recorded | 1 |
| **4** | **HA-2** custodian counter-records | 3 |
| **5** | **HA-3** name executor (minute + authorization record); **HA-4** name adjudicator or *pending* | 2,3 |
| **6** | **HA-5** ratify the two tag names verbatim | 3 |
| **7** | **HA-7** named executor records the O-2 commitment | 5 |
| **8** | Confirm authorization live / not revoked → **G-A, G-F, G-G CLOSED** | 3–7 |
| **9** | **Pre-Flight (§7)** re-verify machine determinants against S0′ | 8 |
| **Final** | On all-PASS → **RM-2 GO**; first RM-2 action = append signed minute into `AUTH-012` (append-only) + stage the 32 inputs for ONE atomic O-1 commit | 9 |

*(Steps 1–8 are the activation ceremony; Step 9/Final are the RM-2 boundary — not part of activation.)*

---

## 4. Governance Evidence Package (must exist after activation)

- **EV-1** Signed, dated RM-1 minute (HA-1/HA-2/HA-6) bound to the exact text.
- **EV-2** Named executor of record (HA-3), in minute + authorization record.
- **EV-3** Named RM-8 adjudicator, or recorded *pending `REAL-C-05`* (HA-4).
- **EV-4** Ratified tag-name record: `authority-restoration-v1.0.13`, `pi2-pi9-implementation-v1.0.0` (HA-5).
- **EV-5** Executor O-2 commitment of record (HA-7).
- **EV-6** Separation-of-duty attestation (executor ≠ adjudicator; custodian independent).
- **EV-7** Pre-Flight verification record (§7 results) captured at RM-2 time.
- **EV-8** (produced by RM-2, not activation) the minute enrolled append-only in `AUTH-012` as the first content of the atomic RM-2 commit.

---

## 5. Separation-of-Duty Register

| Constraint | Requirement | Required evidence |
|------------|-------------|-------------------|
| **Executor ≠ RM-8 Adjudicator** | The party executing RM-2..RM-7 MUST NOT be the party that independently verifies at RM-8 | Distinct identities/keys recorded (EV-2 vs EV-3); SG-4 attestation (EV-6) |
| **Custodian independence** | Custodian counter-records (HA-2) and provides oversight; is **not** the executor | Custodian identity distinct from executor (EV-1 vs EV-2) |
| **Single executor** | Exactly one accountable executor; no shared/ambiguous authority | Unambiguous name (EV-2) |
| **Adjudicator independence (if named)** | Distinct-actor key for RM-8; if `REAL-C-05` PARTIAL, recorded *pending* (non-blocking for durability verdict) | EV-3 + SG-4 |

**Verification:** the register is satisfied when EV-2, EV-3, EV-6 show three distinct roles with executor ≠ adjudicator and custodian ≠ executor.

---

## 6. Post-Activation State (expected)

| Cond | Before activation | After HA-1..HA-7 |
|:----:|:-----------------:|:----------------:|
| **G-A** | OPEN | **CLOSED** |
| **G-B** | PASS (machine; content anchor `4416b3a7…`) | **PASS** (re-verified at Pre-Flight) |
| **G-C** | PASS (staged 0) | **PASS** (re-verify) |
| **G-D** | PASS (branch/HEAD/upstream 0-0) | **PASS** (re-verify) |
| **G-E** | READY (32 inputs present, content-pinned) | **VERIFIED** |
| **G-F** | OPEN | **CLOSED** (⟸ HA-3 + HA-7) |
| **G-G** | OPEN | **CLOSED** (⟸ HA-1 + HA-2 + HA-6) |

**Expected result:** all of G-A..G-G PASS ⇒ **RM-2 GO** at Pre-Flight.

---

## 7. RM-2 GO Preconditions (re-verify immediately before RM-2)

- PC-1 HEAD == `519aed95cef03b33afd16bf5ea43a8326ca13c57`; tree == `28b819105339183edcad616668b78904b8e2d9db`.
- PC-2 Branch == `phase-10-implementation-readiness`; upstream ahead/behind == `0 0`.
- PC-3 Tracked == 347; staged == 0; modified == 7 (exact set); src 0/138; AD 0/8.
- PC-4 Tracked-index digest == `d0d6091486…af0a`.
- PC-5 **RM-2 content anchor recompute == `4416b3a776…ca7ca`** (any silent edit/add/remove among the 32 inputs → mismatch → NO-GO).
- PC-6 Additive untracked are governance `*.md` only (baseline tolerance).
- PC-7 Operative baseline is **S0′** (supersedes any earlier baseline text).
- PC-8 G-A closed (HA-1..HA-7); authorization not revoked.

*(Any precondition failing → immediate NO-GO; default is do-not-begin.)*

---

## 8. Activation Dossier Certification

- **Self-contained:** § 0 restates all facts, values, scope, non-outcomes, and invariants; no external document is required to act. ✔
- **Complete:** brief, human action ledger, ceremony sequence with dependencies, evidence package, SoD register, post-activation state, RM-2 preconditions all present. ✔
- **Consistent:** scope/non-outcomes/safeguards/invariants/anchors align with the certified determinant set; machine determinants verified live. ✔
- **Safe:** activation is preservation-only, invariant-preserving, reversible-until-push; fail-closed preconditions guard RM-2. ✔
- **No prohibited act performed:** no signature, appointment, execution, mutation, or governance change. ✔

---

## Required Determination

> # **READY FOR HUMAN ACTIVATION**
>
> This dossier is complete, self-contained, and sufficient for the Board, Custodian, Executor, and RM-8
> Adjudicator to perform G-A activation without reference to any prior document. All machine determinants for
> RM-2 GO are satisfied (verified live in the preceding phase): tracked-index `d0d6091486…af0a`; RM-2 content
> anchor `4416b3a776…ca7ca`; branch `phase-10-implementation-readiness` @ `519aed9`; upstream 0/0; clean index;
> counts intact. The **only** remaining activities are the seven human acts HA-1..HA-7 performed in the ceremony
> sequence of § 3, followed by the § 7 Pre-Flight re-verification — on all-PASS, RM-2 GO, and the first RM-2
> action (append the signed minute into `AUTH-012` + stage the 32 inputs for one atomic O-1 commit) becomes
> legal.
>
> No activation, signature, appointment, execution, or mutation was performed by this artifact. The Article IX
> generation lock and `UCOS-CONSTRUCTION-BLOCKED` remain in force; `REAL-C-05` remains separate and non-blocking
> for the durability verdict.

---

## Governance / Non-Activation Statement

No signature created; no operator appointed; no `git` mutation, commit, push, tag, branch, or config change
performed; no authorization activated; no lock released; no invariant enrolled; no governance modified. This is
a preparation dossier only. RM-1/RM-2 remain Approval-Required Operations (AUTH-012 §8 / AD-0009). INV-1..13,
`AUTH-012` substance (v1.0.13), AD-0014, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are
unchanged.

## Traceability
- **Consumes (authoritative):** `MCS-1-RM-2-ACTIVATION-READINESS-CERTIFICATE`, `MCS-1-RM-2-ACTIVATION-PACKAGE`, `MCS-1-RM-2-SUFFICIENCY-CERTIFICATION`, `MCS-1-RM-1-EXECUTION-AUTHORIZATION-RECORD`.
- **Produces:** the self-contained human-activation dossier (brief, HA ledger, ceremony, evidence, SoD, post-state, RM-2 preconditions).
- **Feeds:** the human governance activation (HA-1..HA-7) → G-A/G-F/G-G closure → Pre-Flight → RM-2 GO.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); independent adjudicator to be designated (`REAL-C-05`).

**END MCS-1-G-A-GOVERNANCE-ACTIVATION-DOSSIER — PHASE U27 · SELF-CONTAINED · HA-1..HA-7 LEDGER + CEREMONY +
SoD + EVIDENCE + RM-2 PRECONDITIONS · MACHINE DETERMINANTS SATISFIED (content-anchor `4416b3a7…`, tracked-index
`d0d60914…`) · **READY FOR HUMAN ACTIVATION** · NO ACTIVATION / NO SIGNATURE / NO APPOINTMENT / NO EXECUTION /
NO MUTATION / NO GOVERNANCE MODIFICATION PERFORMED BY THIS ARTIFACT.**
