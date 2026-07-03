# REAL-H-07 — Pre-Construction Enrollment Gate

## PHASE U8.4 — Fail-Closed Enrollment-Before-Progression Gate (Retroactive-Enrollment Defect Remediation)

| Field | Value |
|-------|-------|
| Artifact | **REAL-H-07 — Pre-Construction Enrollment Gate** |
| Artifact ID | `REAL-H-07-PRE-CONSTRUCTION-ENROLLMENT-GATE` |
| Phase | **U8.4 — Pre-Construction Enrollment Gate** |
| Layer | GOVERNANCE / ASSURANCE (authorization-integrity control — defines the gate; enacts nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **GATE DEFINITION ONLY** — specifies the enrollment lifecycle, preconditions, blocking/failure conditions, evidence, audit, enforcement logic, and retroactive-enrollment prevention rules. **Writes no code, wires no CI, changes no architecture, redesigns no governance, releases no lock, issues no AD, enrolls no invariant, and designates no reviewer.** Append-only. |
| Authoritative inputs (per mandate) | **`CONST-READY-001`**, **`REAL-C-05-ESTABLISHMENT-RECORD`**, **`REAL-M-03-RECONCILIATION-REPORT`**, **`REAL-C-01-CERTIFICATION-RECONCILIATION-REPORT`** |
| Reviewed (read-only) | `AUTH-012` (canonical Decision Log v1.0.13; Phase 21.1 retroactive-enrollment note), `AUTH-CONST-001` (A1..A7 Board act sequence; AD-0024/0025/0026 envelopes), `ROADMAP-ULT-001` (U2.1 universal predecessor; wave gates), `REAL-001` (REAL-H-07 seven-element unit; dependency order) |
| Governing discipline | **Enrollment precedes progression, always.** Absence of a durable canonical enrollment record = FAIL, never a pending pass. Fail-closed. No optimism. A gate on paper is necessary, not sufficient. |
| Reused primitives (no custom crypto) | Ed25519 detached signatures (`src/control/federation/assertions.ts`); hash-chained append-only audit primitive (PI-7 precedent); `governance-registry.ts` — **reuse-only citations** |
| Governance status | INV-1..13 unchanged; INV-14..20 NOT enrolled; AD-0014 intact; Article IX generation lock **ACTIVE**; `UCOS-CONSTRUCTION-BLOCKED` stands. This artifact releases nothing. |
| **Determination** | **PARTIAL** — the fail-closed gate is **fully and sufficiently defined**; it is **not yet operative** because (i) it is not wired to the CI/Board seam, (ii) the independent adjudicator it relies on is `REAL-C-05`-PARTIAL (0 attestations), and (iii) the canonical corpus is not durably committed (`REAL-M-07`; 151 files uncommitted incl. AD-0016..0023). Conversion gate PARTIAL → PASS is in §9. |

> **The defect this gate exists to prevent (reproduced, not assumed).** Per the `AUTH-012` Phase 21.1 note and
> `REAL-M-03` T-14 / `REAL-C-01` D-7: the eight scoped Article IX releases **AD-0016..AD-0023** were authored,
> made effective, and their **construction executed** while the canonical Decision Log had terminated at
> **AD-0015 / v1.0.5**. They were **enrolled append-only only later (Phase 21.1)** — *after* the construction
> they authorize. That is a **ledger-reality divergence**: the state-of-record (canonical ledger) trailed the
> executed reality (code on disk). Compounding it, `CONST-READY-001` GT-7 shows those same enrolled ADs remain
> **uncommitted/untracked** — the authorization-of-record for prior construction lives in a single working tree
> (a durability divergence, `REAL-M-07`). This gate makes the reverse order **structurally impossible** going
> forward.

---

## 0. Scope of the Ordering Defect — Every Location Where Order Can Break

The mandate requires identifying **every location** where Construction, Authorization, Enrollment, and
Ratification can occur out of order. Each is a distinct divergence class the gate must close.

| # | Out-of-order location | Wrong order that occurred / can occur | Source of record | Divergence class |
|:-:|-----------------------|---------------------------------------|------------------|------------------|
| **OO-1** | **AD issuance ↔ canonical enrollment** | AD authored + made effective as a standalone on-disk record while canonical `AUTH-012` still terminated at an earlier version (AD-0016..0023 vs v1.0.5) | `AUTH-012` Phase 21.1 note; `AUTH-CONST-001` A5→A6 | Ledger trails reality |
| **OO-2** | **Construction start ↔ enrollment** | Construction executed (38/65/… tests green on disk) **before** the authorizing AD was enrolled in the canonical ledger | `AUTH-012` AD-0016 "Consequences"; `REAL-M-03` T-14 | Ledger trails reality (root defect, `ULT-H-07`) |
| **OO-3** | **Article IX release (A5) ↔ independent authorization review (A3)** | A scoped release enacted before the independent constitutional review is of record (live risk for AD-0025 Economy, AD-0026 Civilization — A3 not yet performed) | `AUTH-CONST-001` §2 per-fabric delta; `CONST-READY-001` D-5/D-6 | Authorization precedes review |
| **OO-4** | **Ratification (A7) ↔ independent attestation (element 6)** | A fabric treated as RATIFIED on a self-produced determination with no distinct-actor attestation (PI-8 `ONTO-RAT-001`, PI-9 `MEM-RAT-003` are self-attested) | `REAL-C-05` §12 (PARTIAL); `REAL-M-03` T-04/T-05; `REAL-C-01` §6 RIA | Ratification without independent review |
| **OO-5** | **Certification ↔ reconciled + attested evidence** | Terminal certification issued on stale/self-attested facts (R14 @ 134/134, "chain DEFECTIVE", "Memory REJECTED") ahead of reconciliation and independent attestation | `REAL-C-01` §1/§8; `CONST-READY-001` §2.1 | Certification ahead of evidence |
| **OO-6** | **Canonical enrollment (A6) ↔ durability commit** | An AD enrolled in the canonical ledger on **one working tree only**, uncommitted/unpushed — "enrolled" but not durable (151 files incl. AD-0016..0023) | `CONST-READY-001` GT-7; `REAL-M-03` T-15; `REAL-M-07` | Enrollment not durable |
| **OO-7** | **Ledger version bump ↔ the enrollment record itself** | A version bump recorded without the corresponding append-only decision record (or the record appended without the bump) — internal ledger inconsistency | `AUTH-012` §9 (append-only sequential); `AUTH-REST-002` reconciliation | Ledger self-inconsistency |

**Canonical correct order (the invariant the gate enforces).** For any progression-bearing operation the chain
is, without exception:

```
prerequisites → independent authorization review → Approval-Required Board decision →
AD enacted → canonical append-only enrollment (+version bump) → durability commit →
CONSTRUCTION → independent ratification → certification
```

Every OO-* above is a violation of this single ordering. The gate refuses progression at each boundary until the
prior link is proven present, canonical, and durable.

---

## 1. Enrollment Lifecycle

The lifecycle is a **strictly ordered, append-only, fail-closed** state machine. A progression-bearing operation
may occupy a state only if **all prior states are CLOSED with admissible evidence** (§5). No state may be skipped,
reordered, or entered retroactively.

```
E0  PREREQUISITES-CONFIRMED     prerequisites of record (authority chain RESTORED, hard-dep fabrics
                                implemented, AD-0014 preserved, S1/S3/S4 designed)          [AUTH-CONST-001 A2]
      │
E1  AUTHORIZATION-REVIEWED      independent constitutional / authorization review of record  [A3 · REAL-C-05]
      │
E2  BOARD-DECIDED               Approval-Required decision minuted (AUTH-012 §8 / AD-0009)   [A4]
      │
E3  AD-ENACTED                  scoped Article IX release AD authored + made effective        [A5]
      │
E4  CANONICALLY-ENROLLED        AD appended append-only to canonical AUTH-012 + Authority
                                Index; ledger version bumped; no prior record mutated          [A6]
      │
E5  DURABLY-COMMITTED           enrollment committed + pushed + milestone-tagged to origin;
                                canonical ledger no longer single-working-tree                [REAL-M-07]
      │
E6  CONSTRUCTION-ADMITTED       code/provisioning for the AD's exact scope may begin — and
                                NOT ONE STATE EARLIER                                          [gate release point]
      │
E7  INDEPENDENTLY-RATIFIED      distinct-actor ratification attestation of the built scope    [A7 · REAL-C-05 §10]
      │
E8  CERTIFIABLE                 reconciled + independently attested evidence admits a
                                certification act (level change only here)                    [REAL-C-01 / OP-CERT]
```

- **LC-1** The **gate release point is E6.** Construction (`REAL-001` element 2/3) is inadmissible until
  `E0..E5` are all CLOSED. This single rule structurally forecloses OO-1, OO-2, and OO-6.
- **LC-2** `E4` (canonical enrollment) and `E5` (durability) are **distinct and both mandatory** — enrollment
  that is not durable does not satisfy the gate (closes OO-6).
- **LC-3** `E1` precedes `E3` (closes OO-3); `E7` requires a distinct-actor attestation (closes OO-4); `E8`
  requires reconciled + attested evidence (closes OO-5).
- **LC-4** Every transition is a discrete, timestamped, hash-chained append (§6). There is **no transition that
  writes into the past** — retroactive entry is undefined behavior and is rejected fail-closed (§8).
- **LC-5** The lifecycle produces *evidence and admissibility verdicts*; it enacts **no** governance act.
  Enactment of the AD, the release, the ratification, and the certification remain Authority Board
  Approval-Required Operations (AUTH-012 §8 / AD-0009).

---

## 2. Required Preconditions

For each of the five future operation classes named by the mandate, the gate requires the following predicates to
be **TRUE and evidenced** before progression. Each row is conjunctive (all must hold).

| Operation (future) | Required preconditions (all mandatory) | Lifecycle state that must be CLOSED |
|--------------------|----------------------------------------|-------------------------------------|
| **P-A · AD issuance** | Prerequisites confirmed (E0); independent authorization review of record (E1); Approval-Required Board decision minuted (E2) | E0 ∧ E1 ∧ E2 |
| **P-B · Article IX release** | The scoped release AD is enacted (E3), enrolled append-only in canonical `AUTH-012` + Authority Index with version bump (E4), and durably committed/pushed/tagged (E5) | E0..E5 |
| **P-C · Construction start** | The authorizing AD is **present in the canonical ledger** (E4) **and durable** (E5); scope matches the AD's declared `src/control/*` subtree + keyspace; baseline green precondition recorded | E0..E5 (**gate release point**) |
| **P-D · Ratification** | Construction complete for the exact enrolled scope (E6); success metrics (`AUTH-CONST-001` §*.7 G-*) reproduced; a **distinct-actor** ratification attestation exists (`REAL-C-05` IRQ/SoD/SIG) | E6, with E7 evidence produced |
| **P-E · Certification** | The certified facts are **reconciled** (`REAL-M-03`/`REAL-C-01`) and carry **independent attestation** (`REAL-C-05` IA-1..IA-4 / dual-witness §10); no superseded instrument cited as positive evidence | E7, with E8 evidence produced |

- **PC-1** The controlling test is `UCOS-CONSTRUCTION-BLOCKED` §1 (unchanged): the gate does not weaken it; it
  adds the enrollment-and-durability predicates (E4 ∧ E5) as **necessary conditions** of that test evaluating
  TRUE for any scope.
- **PC-2** "Present in the canonical ledger" means present in `AUTH-012` **as the canonical, durable record** —
  a standalone on-disk AD file that is not enrolled (the AD-0016..0023 pre-21.1 condition) does **not** satisfy
  E4 (directly closes OO-1/OO-2).
- **PC-3** Preconditions are re-evaluated at execution time (not cached): a ledger that has advanced or a corpus
  that has diverged since the last check re-opens the gate.

---

## 3. Blocking Conditions

A **blocking condition** halts progression fail-closed **without** voiding prior work — the operation is held at
its current lifecycle state until the block clears. (Contrast §4 failure conditions, which void.)

| ID | Blocking condition | Blocks | Clears when |
|----|--------------------|--------|-------------|
| **B-1** | Authorizing AD **not present** in canonical `AUTH-012` (E4 not CLOSED) | Construction start (P-C) | The AD is enrolled append-only with version bump |
| **B-2** | Enrollment present but **not durable** — uncommitted/unpushed/untagged (E5 not CLOSED) | Construction start (P-C), Certification (P-E) | Corpus committed + pushed + milestone-tagged (`REAL-M-07`) |
| **B-3** | Independent authorization review **not of record** (E1 not CLOSED) | AD issuance (P-A), Article IX release (P-B) | Distinct-actor review attested (`REAL-C-05`; AD-0025/AD-0026 A3) |
| **B-4** | No **distinct-actor** ratification attestation; ratification self-produced (E7 evidence absent) | Ratification (P-D) | `REAL-C-05` operational (G1–G4) and attestation produced |
| **B-5** | Certified fact is **stale or self-attested** (reconciliation or IA-1..IA-4 absent) | Certification (P-E) | Reconciled (`REAL-M-03`/`REAL-C-01`) + independently attested |
| **B-6** | **Scope mismatch** — construction touches a subtree/keyspace not in the enrolled AD's declared scope | Construction start (P-C) | Scope corrected to the enrolled envelope, or a new scoped AD enrolled |
| **B-7** | **Ledger self-inconsistency** — version bump without record, or record without bump (OO-7) | All progression | `AUTH-012` §9 append-only continuity restored (`AUTH-REST` discipline) |
| **B-8** | `REAL-C-05` is **PARTIAL** (0 operational attestations) | E1, E4-attestation, E7, E8 confidence | Bootstrapping designation enacted (G1) + first signed attestation (G3) |

- **BL-1** Blocks are **conjunctive gates**, not advisories: any single unmet block holds the operation below
  progression (inherits `CONST-READY-001` "a single unverified predicate holds its item below PASS").
- **BL-2** A block on a prior state cascades — B-1 blocking E6 also blocks E7/E8 for the same scope.

---

## 4. Failure Conditions

A **failure condition** is a violation of the ordering invariant itself. It does not merely hold — it **voids**
the offending act and re-imposes the fail-closed posture (mirrors `UCOS-ART9-REL-001` §6 / `REAL-C-05` REV).

| ID | Failure condition | Effect |
|----|-------------------|--------|
| **F-1** | **Retroactive enrollment** — an AD enrolled *after* the construction it authorizes has begun (the AD-0016..0023 pattern) | The construction is marked **UNAUTHORIZED-AT-EXECUTION**; the enrollment stands only as an append-only *reconciliation* record explicitly flagged as retroactive and requiring independent attestation. Future recurrence is a hard FAIL. |
| **F-2** | **Construction ahead of enrollment** — code/provisioning executed with the authorizing AD absent from the canonical ledger | Progression VOID; the scope returns to E0; nothing downstream (ratification/certification) may cite it until re-enrolled in-order. |
| **F-3** | **Release ahead of review** — Article IX release enacted without E1 (OO-3) | Release act VOID; full lock re-imposed for that scope (`UCOS-ART9-REL-001` §6). |
| **F-4** | **Self-attested ratification/certification relied upon as independent** (OO-4/OO-5) | The verdict is marked **NOT CERTIFICATION-GRADE**; any dependent act flagged for re-review (`REAL-C-05` REV-5 cascade). |
| **F-5** | **Durability loss after enrollment** — enrolled record exists on a single tree and that tree is lost | Total loss of authorization-of-record for the affected scope; the scope is treated as **NEVER ENROLLED** (fail-closed). Prevented, not remediated — hence E5 is mandatory. |
| **F-6** | **Backdated / out-of-sequence ledger append** — a transition timestamp earlier than the chain head | Append rejected; anti-backdating monotonicity violation logged (`REAL-C-05` §6 ATT timestamp rule). |

- **FL-1** Failure is **append-only**: voided acts and their voidance are both retained (INV-10); no ledger
  record is deleted.
- **FL-2** F-1 is the **specific defect** this gate remediates. The gate does not retroactively legitimize the
  historical AD-0016..0023 enrollment — that remains a recorded retroactive reconciliation pending independent
  attestation (`REAL-C-01` §6 IA-2). The gate guarantees F-1 **cannot recur** for any future operation.

---

## 5. Evidence Requirements

Each lifecycle transition CLOSES only on **admissible** evidence (adopts `REAL-C-05` §5 EAR, unchanged — no new
admissibility regime is created).

| State | Required evidence to CLOSE | Admissibility rule |
|-------|----------------------------|--------------------|
| E0 | Prerequisite confirmation minute citing authority chain state (`AUTH-REST-004`), hard-dep fabrics on disk, AD-0014 preserved | Reproduced against live tree, not asserted (EAR-1/EAR-3) |
| E1 | Independent authorization-review attestation (`*-AUTH-REV-*`), signed by a distinct-actor key | Distinct-actor key ≠ authoring key (SIG-5); reproduced evidence (EAR-1) |
| E2 | Approval-Required Board decision minute (AD-0009) | Attributable, timestamped (EAR-5) |
| E3 | The scoped Article IX release AD record (scope-restricted to one `src/control/*` subtree) | Content-hash referenced (EAR-2) |
| **E4** | The **canonical `AUTH-012` append-only entry** for the AD + Authority-Index entry + version bump, with prior records unaltered | Live re-read of canonical ledger header + record (EAR-3); ledger is the record of record |
| **E5** | Git commit hash + push confirmation + milestone tag over the enrolled corpus; tag matches ratified state | Independently verifiable (`REAL-M-07`; `REAL-C-05` "pushed tags match ratified states") |
| E6 | Baseline-green precondition capture (`node --test` totals) + scope-conformance record | Measured, reproduced (EAR-1) |
| E7 | Distinct-actor ratification attestation reproducing the `G-*` success metrics | Reproduced, not copied (EAR-1); dual-witness for terminal/operational cert (§10 WIT) |
| E8 | Reconciled evidentiary basis (`REAL-M-03` §2) + IA-1..IA-4 attestations | Superseded instruments inadmissible as positive evidence (EAR-6) |

- **EV-1 Completeness = pass-condition.** Absence of any required evidence item = the state stays OPEN = FAIL
  (never a pending pass).
- **EV-2 Ledger precedence.** Where a standalone AD file and the canonical ledger disagree, **the canonical
  ledger governs** for E4; where the canonical ledger and the live tree disagree, `GOV-REC-001` applies
  (executed act > analysis; recency) and the divergence is itself the finding.

---

## 6. Audit Requirements

- **AU-1 Hash-chained append-only.** Every lifecycle transition (E0→E8), block, and failure is recorded as a
  discrete append on the hash-chained audit primitive (PI-7 precedent; `REAL-C-05` §6 ATT-3 attestation-chain).
  No transition is unlogged (LC-4).
- **AU-2 Anti-backdating.** Transition timestamps are monotonic against the chain head; an earlier-than-head
  timestamp is rejected (F-6). This is the mechanical bar against retroactive entry.
- **AU-3 Tamper-evidence.** Each record references its target by content hash; a tampered evidence artifact
  fails signature verification and voids the associated transition (`REAL-C-05` SIG-4).
- **AU-4 Ledger-continuity audit.** The gate's audit trail must reconcile 1:1 with `AUTH-012` version bumps:
  every E4 append corresponds to exactly one enrolled AD and one version increment (closes OO-7 / B-7).
- **AU-5 Durability audit.** The E5 record binds the enrolled ledger version to a commit hash + tag; a periodic
  reconciliation confirms the canonical ledger head equals the pushed head (guards against silent OO-6 drift).
- **AU-6 Reproducibility.** The entire lifecycle for any AD is offline-reconstructable from the append-only
  chain alone (no reliance on volatile state).

---

## 7. Enforcement Logic

The gate is a **conjunctive, fail-closed predicate** evaluated at each progression boundary. Expressed as the
controlling decision (definition only — not wired here):

```
GATE( operation, scope ) → ADMIT | BLOCK | VOID

  ADMIT  ⇔  every required precondition for the operation class (§2) is CLOSED with
            admissible evidence (§5), AND no blocking condition (§3) holds,
            AND no failure condition (§4) is detected.

  For P-C (Construction start), ADMIT requires specifically:
        E0 ∧ E1 ∧ E2 ∧ E3 ∧ E4 ∧ E5   (enrollment present AND durable)
        ∧ scope(construction) ⊆ scope(enrolled AD)          (else B-6)
        ∧ baseline_green_precondition_recorded

  BLOCK  ⇔  a §3 condition holds and no §4 failure is detected → hold at current state,
            do not advance, do not void.

  VOID   ⇔  a §4 failure is detected → void the offending act, re-impose fail-closed
            posture, append the voidance (INV-10), cascade re-review (REV-5).

  DEFAULT = BLOCK.   Absence of evidence never ADMITs.   (non-optimism)
```

- **EN-1 Default-deny.** The gate's default output is **BLOCK**. Progression requires an affirmative,
  evidenced ADMIT; silence, missing evidence, or an unreachable ledger all yield BLOCK.
- **EN-2 Two enforcement seams (definition — the mechanism, not its wiring).**
  - **Procedural seam (Board):** step A6 of `AUTH-CONST-001` §2 is elevated from a recording step to a
    **gate**: the Board may not minute E6 (construction admission) for a scope whose E4∧E5 are not CLOSED.
  - **Automated seam (CI pre-flight):** a pre-construction check (as `REAL-001` REAL-H-07 element 2 anticipates,
    under `infra/delivery/**`) that **refuses a build** whose authorizing AD is absent from the canonical
    `AUTH-012` head or whose enrolled head is not the pushed head. Author-signed-as-reviewer attestations are
    rejected at this seam (`REAL-C-05` SIG-5).
- **EN-3 Idempotent re-evaluation.** The predicate is recomputed at execution time (PC-3); a previously ADMITted
  scope that later diverges (ledger advanced, corpus un-pushed) re-enters BLOCK.
- **EN-4 No self-satisfaction.** The gate cannot be satisfied by the same authoring process that produced the
  artifact under progression — the E1/E7 attestations must resolve to a distinct-actor key (`REAL-C-05`),
  otherwise the gate BLOCKs at B-4/B-8.

---

## 8. Retroactive Enrollment Prevention Rules

These are the invariant rules that make the OO-1/OO-2 defect **structurally impossible** for future operations.

| ID | Rule | Enforces against |
|----|------|------------------|
| **R-1 · Enroll-before-construct** | No construction (E6) for any scope may begin until its authorizing AD is CLOSED at E4 (canonical) **and** E5 (durable). Construction ahead of enrollment is F-2 (VOID). | OO-1, OO-2 |
| **R-2 · No backward writes** | Every ledger/lifecycle append is monotonic against the chain head; an append whose timestamp or sequence precedes the head is rejected (F-6). Enrollment cannot be inserted "into the past." | OO-1, retroactivity |
| **R-3 · Enrollment ⇒ durability, atomically gated** | An enrollment (E4) that is not committed/pushed/tagged (E5) does **not** satisfy the construction precondition. "Enrolled but on one tree" is treated as not-yet-enrolled for gate purposes. | OO-6 |
| **R-4 · Review-before-release** | A scoped Article IX release (E3/P-B) requires the independent authorization review (E1) of record first. | OO-3 |
| **R-5 · Independent-before-ratified** | A ratification (E7) is not gate-valid without a distinct-actor attestation; self-produced ratifications are recorded but flagged NOT-CERTIFICATION-GRADE (F-4). | OO-4 |
| **R-6 · Reconciled-before-certified** | A certification (E8) may cite only reconciled, independently attested facts; superseded instruments are inadmissible (EAR-6). | OO-5 |
| **R-7 · One-bump-one-record** | Each `AUTH-012` version increment corresponds to exactly one append-only enrolled decision, audited 1:1 (AU-4). | OO-7 |
| **R-8 · Retroactivity is a labeled exception, never a norm** | Any historical retroactive reconciliation (e.g., AD-0016..0023 Phase 21.1) is retained append-only, explicitly labeled retroactive, and carries a standing requirement for independent attestation (`REAL-C-01` IA-2). No future act may rely on the retroactive path as a legitimate ordering. | recurrence of F-1 |

- **RP-1** R-1 + R-2 + R-3 are the load-bearing trio: together they guarantee that for any future AD, the
  canonical durable enrollment **strictly precedes** construction, and cannot be inserted afterward.
- **RP-2** The rules bind the **future** only. They neither rewrite nor re-legitimize the historical
  retroactive enrollment (no ratified/append-only record is mutated); they ensure it is the **last** occurrence.

---

## 9. Required Determination — Can future authorization and construction proceed without another ledger-reality divergence?

> ### DETERMINATION: **PARTIAL**
>
> The fail-closed **Pre-Construction Enrollment Gate is fully and sufficiently defined** (§1–§8): a strictly
> ordered append-only lifecycle (E0→E8) with construction admitted only at E6 behind **canonical enrollment
> (E4) AND durability (E5)**; conjunctive preconditions for all five future operation classes (AD issuance,
> Article IX release, construction start, ratification, certification); blocking, failure, evidence, audit, and
> enforcement logic; and eight retroactive-enrollment prevention rules that make the AD-0016..0023 ordering
> (construction-before-enrollment) **structurally impossible** to repeat. It introduces **no new architecture,
> no governance redesign, no lock release, no authorization, and no code** — it reuses the ratified Ed25519 /
> hash-chain / registry primitives and elevates the existing `AUTH-CONST-001` A6 step from *recording* to
> *gating*.
>
> **It is not yet sufficient to guarantee divergence-free progression**, for three non-optimistic reasons, none
> of which this gate-definition phase may itself close:
> 1. **The gate is defined, not operative.** It is not wired to either enforcement seam (Board procedure or CI
>    pre-flight, `EN-2`); until enacted, it constrains nothing at execution time.
> 2. **Its independent-actor dependency is `REAL-C-05`-PARTIAL** — zero operational attestations exist, so E1
>    review-attestation and E7 ratification-attestation cannot yet resolve to a distinct-actor key (B-8). The
>    gate would correctly BLOCK, but genuine independence is unrealized until `REAL-C-05` G1–G4.
> 3. **The canonical corpus is not durable** — `CONST-READY-001` GT-7 / `REAL-M-07`: 151 files, **including
>    AD-0016..0023**, are uncommitted. E5 is currently FAIL for the existing corpus, so a live durability
>    divergence (OO-6 / F-5 exposure) stands until `REAL-M-07` commits/pushes/tags.
>
> **Conclusion.** Once the gate is enacted at both seams (EN-2), `REAL-C-05` reaches operational independence
> (G1–G4), and `REAL-M-07` makes the corpus durable, future authorization and construction **can proceed
> without creating another ledger-reality divergence** — the ordering invariant is then enforced fail-closed.
> Until those three closures, the honest verdict is **PARTIAL**: the mechanism is complete and correct by
> design, but prevention is realized by *enactment*, not by definition.
>
> **Conversion gate PARTIAL → PASS (all required):**
> - **G-1** The gate is wired at the **procedural seam** — `AUTH-CONST-001` A6 recorded as a hard E4∧E5
>   precondition of construction admission (Board-adopted).
> - **G-2** The gate is wired at the **automated seam** — a CI pre-flight (under `infra/delivery/**`) that
>   BLOCKs a build whose authorizing AD is absent from the canonical `AUTH-012` head or whose enrolled head ≠
>   pushed head; with the enforcement test (`REAL-001` REAL-H-07 element 4: unenrolled-AD build blocked;
>   enrolled-AD build proceeds).
> - **G-3** `REAL-C-05` operational (G1–G4) so E1/E7 attestations resolve to a distinct-actor key.
> - **G-4** `REAL-M-07` closed — the canonical corpus (incl. AD-0016..0023 and this gate) committed, pushed,
>   and milestone-tagged, so E5 is CLOSED for the standing corpus.
>
> No architecture change, no governance redesign, no lock release, no authorization performed by this artifact.
> INV-1..13, AD-0014, and the Article IX generation lock are unchanged; `UCOS-CONSTRUCTION-BLOCKED` stands.

### OUTPUT

**`REAL-H-07-PRE-CONSTRUCTION-ENROLLMENT-GATE` — FAIL-CLOSED ENROLLMENT-BEFORE-PROGRESSION GATE DEFINED · 7
OUT-OF-ORDER LOCATIONS IDENTIFIED (OO-1 AD↔ENROLL · OO-2 CONSTRUCT↔ENROLL [ROOT] · OO-3 RELEASE↔REVIEW · OO-4
RATIFY↔ATTEST · OO-5 CERTIFY↔EVIDENCE · OO-6 ENROLL↔DURABILITY · OO-7 BUMP↔RECORD) · 9-STATE LIFECYCLE
(E0→E8; CONSTRUCTION ADMITTED ONLY AT E6 BEHIND CANONICAL-ENROLLMENT E4 ∧ DURABILITY E5) · PRECONDITIONS
P-A..P-E · 8 BLOCKING · 6 FAILURE (F-1 RETROACTIVE-ENROLLMENT VOIDS) · EVIDENCE E0..E8 · HASH-CHAINED
ANTI-BACKDATING AUDIT · CONJUNCTIVE DEFAULT-DENY ENFORCEMENT (PROCEDURAL + CI SEAMS) · 8 RETROACTIVE-ENROLLMENT
PREVENTION RULES (R-1 ENROLL-BEFORE-CONSTRUCT · R-2 NO BACKWARD WRITES · R-3 ENROLL⇒DURABLE) · DETERMINATION:
PARTIAL (PASS-GATE G-1..G-4 DEFINED; PENDING WIRING + REAL-C-05 OPERATIONAL + REAL-M-07 DURABILITY) · NO NEW
ARCHITECTURE · NO GOVERNANCE REDESIGN · NO CODE · NO AUTHORIZATION · NO LOCK RELEASE.**

---

## 10. Governance / Non-Mutation Statement

No source code, infrastructure, or authorization was produced by this artifact; no lock released; no invariant
enrolled; no reviewer designated; no frozen or ratified construct modified. All references to
`assertions.ts` / `governance-registry.ts` / the PI-7 audit primitive and to `AUTH-CONST-001` A1..A7 are
**reuse-only** citations of existing ratified mechanisms (read-only). All filesystem and ledger inspections were
read-only. INV-1..13, `AUTH-012` substance (v1.0.13), AD-0014 (Ω∞ deferral), the Article IX generation lock, and
`UCOS-CONSTRUCTION-BLOCKED` are unchanged. Wiring the gate at the procedural seam (G-1), the automated CI seam
(G-2), operationalizing `REAL-C-05` (G-3), and committing the corpus (G-4) all remain Approval-Required
Operations (AUTH-012 §8 / AD-0009) reserved to the UCOS Authority Board.

## 11. Traceability
- **Consumes (authoritative):** `CONST-READY-001` (REAL-H-07 PARTIAL; GT-7 durability defect; D-1/D-7),
  `REAL-C-05-ESTABLISHMENT-RECORD` (independent-adjudication mechanism; IRQ/SoD/COI/EAR/ATT/SIG/LIFE/REV/WIT),
  `REAL-M-03-RECONCILIATION-REPORT` (T-14 retroactive enrollment; T-15 durability; canonical state §2),
  `REAL-C-01-CERTIFICATION-RECONCILIATION-REPORT` (D-7/UCC-1 supersession; IA-1..IA-4).
- **Reviews (read-only):** `AUTH-012` (v1.0.13; Phase 21.1 retroactive-enrollment note; §6/§8/§9),
  `AUTH-CONST-001` (A1..A7 act sequence; AD-0024/0025/0026 envelopes; §6 cross-fabric invariants),
  `ROADMAP-ULT-001` (U2.1 universal predecessor; UCC/CW wave gates), `REAL-001` (REAL-H-07 seven-element unit;
  §4 dependency order).
- **Realizes:** `REAL-001` REAL-H-07 element (1b) — the governance control making ledger enrollment a hard
  pre-construction gate; complements element (1a) retro-attestation recorded in the `REAL-C-05` chain.
- **Reuses (no custom crypto):** `src/control/federation/assertions.ts` (Ed25519);
  `src/control/governance/governance-registry.ts`; PI-7 hash-chained append-only audit primitive.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), `UCOS-ART9-REL-001` (release/void),
  `UCOS-ASR-NFR-001` (INV-1..13), Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Refined by:** the prospective Board acts wiring the gate (G-1/G-2), operationalizing `REAL-C-05` (G-3), and
  committing the corpus via `REAL-M-07` (G-4) — which convert this determination from PARTIAL to PASS.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); independent adjudicator to be
  designated (`REAL-C-05`).

**END REAL-H-07 — PRE-CONSTRUCTION ENROLLMENT GATE · PHASE U8.4 · FAIL-CLOSED ENROLLMENT-BEFORE-PROGRESSION ·
DETERMINATION: PARTIAL · GATE DEFINITION ONLY · NO NEW ARCHITECTURE / NO GOVERNANCE REDESIGN / NO LOCK RELEASE /
NO AUTHORIZATION.**
