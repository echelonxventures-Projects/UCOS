# UCOS-G0-0005 — Gate Zero Lift Authority Specification

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-G0-0005` |
| Program | **UCOS Gate Zero Authority — Final G0 Dossier** |
| Phase | G0-5 — Lift Authority |
| Mode | **LIFT-AUTHORITY SPECIFICATION ONLY** — defines who may lift `UCOS-CONSTRUCTION-BLOCKED`, what evidence must exist, and what invalidates lifting. Grants no authorization and lifts no lock. |
| Status | G0 DOSSIER BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Inputs (read-only, frozen) | `UCOS-G0-0001` (P0-3.a..d); `UCOS-G0-0002/0003/0004`; `UCOS-EA-0002/0003/0004`; `UCOS-RA-0007 §4`; `UCOS-EXEC-0001` §7 (A-1..A-9; Terminal-authority rule); `UCOS-EP-0005 §1/§2`; `UCOS-EP-0006` (Gate 0); `UCOS-EP-0008 §4`; `AD-0009`; `AUTH-009`; `AUTH-012`; `UCOS-CONST-001` Article IX |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; `AD-0014` intact; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |

---

## 0. Purpose & scope

This artifact specifies the **lift act** that discharges **EA-B-P0-3** — the governance pivot of the Final
Execution Gate (atomic requirements `P0-3.a..d` of `UCOS-G0-0001`). It fixes **(1) who may lift**, **(2) what
evidence must exist before lifting**, and **(3) what invalidates a lift**. It binds production package
`EWP-00-LIFT` (approval class **A**, `UCOS-EP-0005 §1`), Wave **W3**, and corresponds to Authority operation
**A-1** (`UCOS-EXEC-0001 §7`). This is the **only** G0 act that is *not* executable under the standing block —
it *is* the act that lifts the block.

---

## 1. Who may lift

| Question | Answer | Basis |
|----------|--------|-------|
| **Who holds the authority** | The **UCOS Authority Board** — **sole** terminal authority | `UCOS-EXEC-0001 §7` A-1; `UCOS-EP-0008 §4`; `AUTH-009` |
| **Under what class** | **Authority-Approval (A)** — Approval-Required Operation | `AD-0009`; `UCOS-EP-0005 §1` (`EWP-00-LIFT`) |
| **At what majority** | The required Board majority, recorded on `AUTH-012` | `UCOS-EXEC-0001 §7` |
| **Who may NOT lift** | No agent, steward, subordinate process, or AI may perform an A-1 act | `UCOS-EXEC-0001 §7` Terminal-authority rule; `UCOS-EP-0008 §2` ("AI does NOT execute … any lock release") |
| **Who executes** | The Board **authorizes**; a **human executes** the act (live/governance act) | `UCOS-EXEC-0001` A-7; `UCOS-EP-0008 §0/§2` |
| **Scope of a lift** | Scoped or full Article IX generation-lock release, for a **named authorized scope** | `UCOS-EXEC-0001 §7` A-1; `UCOS-EP-0006` Gate 0 exit |

> **Single-authority rule.** Lifting `UCOS-CONSTRUCTION-BLOCKED` is reserved absolutely to the Authority Board.
> This dossier, its author, and any automation are structurally incapable of performing it (`UCOS-EP-0008 §6`
> prohibition: "Building under the standing block … any lock release").

---

## 2. What evidence must exist (preconditions to a lawful lift)

The lift act (AT-P0-3) is lawful **only** when it cites all three prior gate elements as PASS of record and then
records the block-lift:

| # | Required evidence | Source package | Atomic req. |
|:--:|-------------------|----------------|:-----------:|
| **LE-1** | **AT-P0-1 = PASS** — independent chain + PI-8/PI-9 attestation (`REAL-C-05`; `REAL-H-07` PASS) | `UCOS-G0-0002` | P0-3.a |
| **LE-2** | **AT-P0-2 = PASS** — independent re-measurement reproduces 269/269 (`REAL-M-03`) | `UCOS-G0-0003` | P0-3.b |
| **LE-3** | **AT-P1-7 = PASS** — `UCOM-ULTIMATE-CERT-002` re-issued; R14 superseded | `UCOS-G0-0004` | P0-3.c |
| **LE-4** | **The lift act itself** — Board authorization act + block-lift record + full Article IX release link, for a named scope, recorded on `AUTH-012` | this package (`EWP-00-LIFT`) | P0-3.d |

> **Ordering (non-negotiable).** LE-1 ∧ LE-2 must exist (W1) → LE-3 (W2) → LE-4 (W3). `UCOS-RA-0007 §4`:
> EA-B-P0-3 "cannot close until EA-B-P0-1, EA-B-P0-2, and EA-B-P1-7 are CLOSED." A lift recorded without LE-1..3
> of record is **void** (see §4).

### 2.1 The lift act — required content (LE-4)

The Board authorization act must, of record:
1. **Cite** AT-P0-1, AT-P0-2, AT-P1-7 as **PASS**, referencing `REAL-C-05`, `REAL-M-03`, `UCOM-ULTIMATE-CERT-002`.
2. **Lift** `UCOS-CONSTRUCTION-BLOCKED` for a **named authorized scope** (the C-6 / UCC-5 full-release act).
3. **Link** the full Article IX generation-lock release.
4. Be **recorded on `AUTH-012`**, append-only, at the required majority.
5. Preserve scope discipline: **0** invariant change, **0** new requirement, **0** redesign.

---

## 3. Effect of a lawful lift

| On lift (AT-P0-3 = PASS) | Consequence | Basis |
|--------------------------|-------------|-------|
| `G0 = AT-P0-1 ∧ AT-P0-2 ∧ AT-P1-7 ∧ AT-P0-3` | **G0 = PASS** | `UCOS-EA-0003 §6` |
| `UCOS-CONSTRUCTION-BLOCKED` | **LIFTED** for the authorized scope | `UCOS-EP-0006` Gate 0 exit |
| Execution status | **BLOCKED → MAY COMMENCE** for the authorized scope | `UCOS-EP-0008 §8` |
| Forward frontier | Stage 6 convergence (Wave W4) and onward become buildable in order | `UCOS-EA-0002 §4`; `UCOS-EP-0006` |

> The lift authorizes only the **named scope**. Anything outside it (behavioral/temporal frontier, Stage 9
> Intelligence, `AD-0014` civilization) remains gated by its own Authority act (`UCOS-EP-0006` Gates 4–7;
> `UCOS-EXEC-0001` A-2/A-3/A-6).

---

## 4. What invalidates lifting (a lift is void / defeated if)

| # | Invalidator | Effect |
|:--:|-------------|--------|
| **INV-L-1** | Lift recorded **before** LE-1 ∧ LE-2 ∧ LE-3 are all PASS of record | Void ab initio — building would be a constitutional violation (Article IX) |
| **INV-L-2** | Any grounding element later **revoked** — `REAL-C-05` withdrawn (P0-1), 269/269 overturned (P0-2), or `UCOM-ULTIMATE-CERT-002` revoked (P1-7, `UCOS-G0-0004 §4`) | G0 → FAIL; the lift's basis is defeated |
| **INV-L-3** | **Self-attestation** offered in lieu of independent evidence for P0-1/P0-2 | Prohibited (`UCOS-EP-0005 §2`; `UCOS-EXEC-0001` Prohibition 12); lift unlawful |
| **INV-L-4** | Lift performed by a **non-Board party** (agent/steward/AI/automation) | Ultra vires; no legal effect (`UCOS-EXEC-0001 §7`; `UCOS-EP-0008 §2/§6`) |
| **INV-L-5** | Lift carries an **invariant change / new requirement / redesign** | Violates scope discipline & `ULT-TEST-001` (0 REDESIGN); void |
| **INV-L-6** | Act **not recorded on `AUTH-012`** / not at required majority / not append-only | Not of record; AT-P0-3 = FAIL |
| **INV-L-7** | Lift exceeds the **named authorized scope** (blanket/implied lift) | Only the named scope is authorized; the excess is void |
| **INV-L-8** | Live act **executed by AI** rather than a human under Board authorization | Prohibited (`UCOS-EXEC-0001` A-7); void |

> **Fail-closed rule (`UCOS-EP-0006` Gate 0 failure/rollback).** If any invalidator is present, the system
> **remains BLOCKED**; the remedy is to re-run the failed evidentiary wave (W1/W2) or withhold/re-issue the
> Board act. Rollback is corrective-forward, never destructive (INV-10).

---

## 5. Verification chain

```
LE-1 AT-P0-1 PASS (REAL-C-05, REAL-H-07)  ─┐
LE-2 AT-P0-2 PASS (REAL-M-03, 269/269)     ├─►  LE-3 AT-P1-7 PASS (UCOM-ULTIMATE-CERT-002)
                                            │            │
                                            └────────────┴─►  [UCOS Authority Board]  (sole; A-1; AD-0009)
                                                                      │  authorizes; human executes
                                                                      ▼
                                        LE-4  Board act + block-lift + Article IX release  ── recorded on AUTH-012
                                                                      │
                                                                      ▼
                              AT-P0-3 = PASS  ⇒  G0 = PASS  ⇒  CONSTRUCTION UNBLOCKED (named scope)
```

---

## 6. Acceptance condition

> **AT-P0-3 = PASS** iff LE-1 ∧ LE-2 ∧ LE-3 are PASS of record, LE-4 (the Board lift act) is recorded on
> `AUTH-012` with the §2.1 content, no INV-L-1..8 invalidator is present, and the act stays within scope
> discipline. Otherwise **AT-P0-3 = FAIL** and `UCOS-CONSTRUCTION-BLOCKED` stands.

### 6.1 Current reading (as of 2026-07-03)

| Element | State | Basis |
|---------|:-----:|-------|
| LE-1 (AT-P0-1) | **FAIL** | `UCOS-G0-0002 §7.1` |
| LE-2 (AT-P0-2) | **FAIL** | `UCOS-G0-0003 §6.1` |
| LE-3 (AT-P1-7) | **FAIL** | `UCOS-G0-0004 §6.1` |
| LE-4 (Board lift act) | **ABSENT** | no Board act; `UCOS-CONSTRUCTION-BLOCKED` stands (`UCOS-EA-0004 §5`) |
| **AT-P0-3** | **FAIL** | preconditions unmet; block standing |

---

## 7. Determination (lift-authority-level)

> The lift act for EA-B-P0-3 is **fully specified**: the **sole** authority is the **UCOS Authority Board**
> (A-1, `AD-0009`, human-executed, recorded on `AUTH-012`); the **required evidence** is LE-1 ∧ LE-2 ∧ LE-3
> (all three prior gate elements PASS of record) plus the LE-4 scoped lift act; and **eight invalidators**
> (INV-L-1..8) void any premature, self-attested, out-of-scope, unrecorded, or non-Board lift. As of this
> dossier LE-1..LE-3 are FAIL and LE-4 is ABSENT ⇒ **AT-P0-3 = FAIL** and the block stands. Nothing here
> authorizes a lift; it specifies the conditions under which one would be lawful.

## 8. Scope discipline

No authorization was granted, no block lifted, no `AUTH-012` entry made. INV-1..13, `AUTH-012`, `AD-0014`, and
the Article IX generation lock are unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands.** Lifting the block is
reserved to the UCOS Authority Board.

## 9. Traceability

- **Consumes:** `UCOS-G0-0001` (P0-3.a..d); `UCOS-G0-0002/0003/0004`; `UCOS-EA-0002/0003/0004`;
  `UCOS-RA-0007 §4`; `UCOS-EXEC-0001 §7`; `UCOS-EP-0005/0006/0008`; `AD-0009`; `AUTH-009`; `AUTH-012`.
- **Feeds:** `UCOS-G0-0006` (final determination).
- **Owner:** UCOS Authority Board (terminal authority; custodian: Chief Authority Architect).

**END `UCOS-G0-0005` — LIFT AUTHORITY SPECIFICATION · WHO: AUTHORITY BOARD (SOLE; A-1; AD-0009; HUMAN-EXECUTED) · EVIDENCE: LE-1 ∧ LE-2 ∧ LE-3 + SCOPED LE-4 ACT ON AUTH-012 · 8 INVALIDATORS (INV-L-1..8) · FAIL-CLOSED · CURRENTLY AT-P0-3 = FAIL (BLOCK STANDS) · SPECIFICATION ONLY.**
