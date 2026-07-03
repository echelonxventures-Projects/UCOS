# G01 — UCOS M0 Authorization Decision Package

## PHASE G01 — Final Board Decision Package for the M0 Construction Authorization (Decision Preparation Only)

| Field | Value |
|-------|-------|
| Artifact | **G01 — UCOS M0 Authorization Decision Package** |
| Artifact ID | `G01-UCOS-M0-AUTHORIZATION-DECISION-PACKAGE` |
| Phase | **G01 — M0 Authorization Decision Package** |
| Layer | GOVERNANCE / AUTHORITY (decision package — prepares the Board decision; decides nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **DECISION PREPARATION ONLY** — produce the package placed before the Board for the M0 decision. **No authorization, no enactment, no designation, no execution, no `git` mutation, no new governance/architecture (beyond this additive governance `*.md`, permitted by the S0′ tolerance rule).** The draft resolution (§ 9) is a blank template. Append-only. |
| Authoritative inputs (per mandate) | `T04` (Board session checklist), `B04` (MCF construction master authority), `B05` (M0 authorization package; AUTHORIZE-WITH-CONDITIONS; C-0..C-6) |
| **Condition status carried forward** | **C-0 (resolve AF-B04) — CLOSED** by `B04` (the master authority now exists). This package reviews the remaining conditions **C-1..C-6**. |
| Governance posture | `UCOS-CONSTRUCTION-BLOCKED` + Article IX generation lock remain **ACTIVE**. M0 is a future Approval-Required Operation; this package neither issues nor pre-empts it. |
| **Determination** | **READY FOR BOARD DECISION** — the package is complete and delivers a defensible recommendation (**AUTHORIZE WITH CONDITIONS**); C-1..C-6 are enactable at/around the Board session (§ 3/§ 10). |

> **Purpose.** Give the Board everything needed to decide M0 in one sitting: the brief, the proposed scope, the
> condition review, the governance/durability/independence readiness assessments, the earliest safe scope, a
> recommendation, and a draft resolution. This document prepares the decision; it does not make it.

---

## 1. Executive Authorization Brief

- **Decision sought:** authorize **M0** — construction of the **MCF Genesis-Kernel sub-scope** (Wave 0: F-STO/F-IDN/F-SEC/F-REG), wave-gated, under **AD-0024-with-conditions**.
- **Why now:** the design→construction planning corpus is complete, consolidated, and adversarially confirmed with **no remaining design blockers** (T03); the master authority (`B04`) is consistent and closed; the only remaining items are reserved **human governance enactments** (T04 session + REAL-M-07 durability + REAL-C-05 designation), which the Board can enact/condition in the same session.
- **What M0 does NOT do:** no Article IX release; no `UCOS-CONSTRUCTION-BLOCKED` lift beyond the authorized MCF sub-scope; no AD-0025/0026; no technology selection; no Wave 2/3.
- **Bottom line:** **AUTHORIZE WITH CONDITIONS** — issue AD-0024 for the Genesis Kernel with C-1..C-6 tracked (some satisfied at-session, some milestone-gated); construction proceeds wave-gated M1→M2→M3→M4.

---

## 2. Scope Proposed For Authorization

| Class | Content |
|-------|---------|
| **Proposed authorized scope** | MCF **Genesis Kernel** (Wave 0: F-STO, F-IDN, F-SEC, F-REG) as the first authorized increment; Operating Spine (F-CFG/F-POL/F-EVT/F-GOV/F-EXE) authorized on **M1 exit**; MCF-complete at **M3**; independent certification at **M4** — all under the B04 master authority, wave-gated. |
| **Excluded** | Commerce/experience domains; technology/framework/datastore/cloud selection; infrastructure provisioning; anything not required for FC-1..FC-9. |
| **Deferred** | Wave 2 {F-OBS/WFL/INT/MEM/CMP}; Wave 3 {F-KNW/ONT + autonomy}. |
| **Reserved** | Article IX release; AD-0025/0026; certification upgrades; terminal/Operational cert. |

**Scope-lock (SG-1):** authorization is bounded to the MCF, kernel-first. Expansion → new governed authorization.

---

## 3. Conditions Review (C-1..C-6)

| # | Condition | Status | Enactment point | Note |
|:-:|-----------|:------:|-----------------|------|
| **C-1** | Enact the **T04 Board session** (G-A activation; HGA-1..HGA-5) | **PENDING** | **At session** (this decision is taken within it) | Satisfied by convening + working the T04 checklist |
| **C-2** | Execute **REAL-M-07** durability (RM-2..RM-7) | **PENDING** | **Milestone-gated (M1)** | Authorized by HGA-1 at session; durable-commit gated at M1 (G-DURABILITY); not a precondition to M0 issuance |
| **C-3** | Designate a **distinct-actor REAL-C-05 IA** (G1) | **PENDING** | **Designation at session (HGA-2/HGA-4); attestation at M4** | If no eligible IA, record *pending `REAL-C-05`* → M4 independence flagged pending (U32 CP-1) |
| **C-4** | Verify **separation-of-duty** (Executor ≠ IA ≠ Custodian) | **PENDING** | **At session** (T04 §6) | Satisfied once C-1/C-3 named |
| **C-5** | **Scope-lock** to MCF Genesis-Kernel-first | **SATISFIED** | Now (B04 §2 / B05 §1) | Authoritative scope fixed |
| **C-6** | **Construction gates** operative (B01 §6) | **PENDING (ready)** | **At M0** | Gates specified/derived; instantiated as milestone-gate events on M0 |

**Roll-up:** **C-5 Satisfied**; **C-1/C-4 satisfied at-session**; **C-3 designation at-session (attestation M4)**;
**C-2 milestone-gated (M1)**; **C-6 instantiated at M0**. **No condition is BLOCKED** (C-0 closed by B04). None
is a design gap (T03). All are enactable at/around the session — the definition of AUTHORIZE-WITH-CONDITIONS.

---

## 4. Governance Readiness Assessment

| Element | State | For M0 |
|---------|-------|:------:|
| AUTH-012 (decision authority; AD-0009) | In force | **Ready** |
| Construction gates (B01 §6, derived) | Specified | **Ready** (operative on M0) |
| T04 session package + checklist | Complete (blank templates) | **Ready to enact** (C-1) |
| B04 master authority | Complete, consistent | **Ready** |
| B05 authorization package | Complete (AUTHORIZE-WITH-CONDITIONS) | **Ready** |
| SoD framework (SG-4/SoD-3) | Defined | **Ready** (verify at session, C-4) |

**Assessment:** governance is **READY TO ENACT** — the framework, packages, and checklist are complete; the
session is the enactment vehicle. Governance-*enacted* status becomes true when the session runs (C-1).

---

## 5. Durability Readiness Assessment

| Element | State | For M0 |
|---------|-------|:------:|
| REAL-M-07 remediation plan (RM-1..RM-8) | FULLY SPECIFIED (U33) | **Ready** |
| Activation + Pre-Flight package (T04/U30) | Complete | **Ready** |
| Execution wave + closure specs (U29/U31/U32) | Complete | **Ready** |
| Current corpus durability | **FAIL** (uncommitted) | **Pending execution (C-2)** |
| Sequencing vs M0 | RM-1 authorized by HGA-1 (session); durable-commit gated at M1 | **Milestone-gated** |

**Assessment:** durability is **SPECIFIED AND EXECUTABLE**, not yet executed. It is authorized at the session
(HGA-1) and satisfied at **M1** (G-DURABILITY) — a **condition on M1**, not a precondition to M0 issuance. No
durability design gap (U33: FULLY SPECIFIED).

---

## 6. Independence Readiness Assessment

| Element | State | For M0 |
|---------|-------|:------:|
| REAL-C-05 mechanism (§1–§11) | Complete (C01) | **Ready** |
| IA designation (G1) | **Absent** (PARTIAL; 0 designations) | **Pending (C-3, at session)** |
| Key registration (G2) | Absent | Authorized at session; executed post-session |
| First attestation (G3) | Absent | **Milestone-gated (M4)** |
| Dual-witness (G4) | N/A for MCF | Reserved (terminal cert only) |

**Assessment:** independence is **MECHANISM-READY**; genuine independence requires the **distinct-actor IA
designation** (C-3) at the session and the **first attestation** at M4. If no eligible IA exists at session, the
Board may proceed with M4 independence **flagged pending** (U32 CP-1): the kernel/spine would be self-certified +
durable but not yet independently certified until the IA is designated and attests. **This is the single
external (human-resource) dependency** (T03 CH-3 / SoD-X) — not a design gap.

---

## 7. Earliest Safe Authorized Scope

**Maximum scope authorizable at this decision:** the **MCF Genesis Kernel (Wave 0: F-STO/F-IDN/F-SEC/F-REG)** as
the first authorized increment, wave-gated — with the Operating Spine authorized on **M1 exit** and MCF-complete
at **M3**.

- **Why kernel-first:** irreducible root, fully specified, self-contained acceptance (AC-1/AC-2); front-runs no later gate.
- **Not one-block full MCF:** authorizing all 9 domains in a single grant would pre-empt M1/M2 gate evidence; wave-gating (M0→M1→M2→M3→M4) is the safe maximum.
- **Independence caveat:** the kernel may reach **self-certified + durable (M3-equivalent for the kernel)** even if the IA (C-3) is pending; **independent certification (M4)** requires the distinct IA.

**Earliest safe authorized scope = Genesis Kernel (Wave 0), wave-gated, with C-2 (M1) and C-3-attestation (M4) as tracked conditions.**

---

## 8. Authorization Recommendation

> ## **AUTHORIZE WITH CONDITIONS**
>
> Recommend the Board **AUTHORIZE**, **with conditions**, construction of the **MCF Genesis-Kernel sub-scope**
> under **AD-0024-with-conditions**, wave-gated, subject to:
> - **C-1** hold the T04 session (this decision is within it) — *satisfied at-session*;
> - **C-4** verify SoD (Executor ≠ IA ≠ Custodian) — *satisfied at-session*;
> - **C-5** confirm scope-lock (Genesis Kernel first) — *satisfied now*;
> - **C-6** instantiate construction gates as milestone-gate events — *at M0*;
> - **C-3** designate the distinct-actor REAL-C-05 IA (or record *pending* → M4 independence pending) — *designation at-session*;
> - **C-2** execute REAL-M-07 durability; MCF/kernel durable-commit — *condition on M1 (G-DURABILITY)*.
>
> **Rationale:** T03 confirmed **NO REMAINING DESIGN BLOCKERS**; B04 is consistent and closes C-0; the only open
> items are governance enactments enactable at/around the session, handled as tracked conditions. Unconditional
> **AUTHORIZE** is not warranted (C-1..C-4/C-6 not yet enacted); **DO NOT AUTHORIZE** is not warranted (no design
> blocker; scope is bounded and safe). Hence **AUTHORIZE WITH CONDITIONS**.

---

## 9. Draft Board Resolution (Template — blank; not enacted)

```
────────────────────────────────────────────────────────────
        UCOS AUTHORITY BOARD — RESOLUTION (M0)
────────────────────────────────────────────────────────────
Resolution ID .......... M0-RES-________
Date (UTC) ............. ____________________
Presiding authority .... ____________________

WHEREAS the MCF construction program is fully specified and consolidated (B04), adversarially
  confirmed with no remaining design blockers (T03), and packaged for authorization (B05); and
WHEREAS construction is bounded to the Minimum Constructible Foundation, Genesis-Kernel-first,
  wave-gated, excluding Article IX release, AD-0025/0026, technology selection, and Wave 2/3;

NOW THEREFORE the Board RESOLVES:

1. G-A ACTIVATION (C-1): the RM-1 minute is signed and G-A/G-F/G-G closed per T04 HGA-1.       ☐
2. INDEPENDENT ADJUDICATOR (C-3): ____________________ is designated REAL-C-05 IA (distinct
   key custody), or ☐ recorded *pending REAL-C-05* (M4 independence flagged pending).           ☐
3. SEPARATION OF DUTY (C-4): Executor ____________ ≠ IA ____________ ≠ Custodian ____________.  ☐
4. SCOPE-LOCK (C-5): authorization is limited to the MCF Genesis Kernel (Wave 0), wave-gated.   ☐
5. CONSTRUCTION GATES (C-6): the construction gates (B01 §6) are instantiated as the M1..M4
   milestone-gate events.                                                                       ☐
6. DURABILITY CONDITION (C-2): REAL-M-07 (RM-2..RM-7) is authorized; kernel/MCF durable-commit
   is a condition of M1 (G-DURABILITY).                                                         ☐
7. AUTHORIZATION: the Board hereby ISSUES **AD-0024-with-conditions** authorizing M0 construction
   of the MCF Genesis Kernel, wave-gated M1→M2→M3→M4, subject to conditions 1–6 and the reserved
   /excluded scope above; INDEPENDENT CERTIFICATION at M4 (REAL-C-05) is required for MCF
   COMPLETE, or recorded pending per item 2.                                                    ☐
8. NON-OUTCOMES: no Article IX release; no BLOCKED lift beyond the authorized sub-scope; no
   AD-0025/0026; no technology selection.                                                       ☐

Board signature .......... ____________________     Custodian counter ...... ____________________
────────────────────────────────────────────────────────────
This resolution is a TEMPLATE. It is not enacted by G01. M0 takes effect only on Board signature.
────────────────────────────────────────────────────────────
```

---

## 10. Final Determination

> # **READY FOR BOARD DECISION**
>
> The M0 Authorization Decision Package is complete and placeable before the Board. It provides the executive
> brief (§ 1), proposed scope (§ 2), the C-1..C-6 condition review (§ 3), and the governance (§ 4), durability
> (§ 5), and independence (§ 6) readiness assessments; it identifies the earliest safe authorized scope (§ 7,
> Genesis Kernel wave-gated); it recommends **AUTHORIZE WITH CONDITIONS** (§ 8); and it supplies a draft Board
> resolution template (§ 9).
>
> **C-0 is CLOSED** (B04). **No condition is BLOCKED**; C-5 is satisfied; C-1/C-4 and the C-3 designation are
> satisfied at-session; C-6 instantiates at M0; C-2 and the C-3 attestation are milestone-gated (M1, M4). No
> design blocker remains (T03). The single external dependency is the availability of a distinct-actor IA
> (C-3) — handled either by designation at-session or by proceeding with M4 independence flagged pending.
>
> **M0 is NOT granted by this package.** M0 takes effect only upon Board signature of the resolution (§ 9). No
> authorization, enactment, designation, execution, or `git` mutation was performed. `UCOS-CONSTRUCTION-BLOCKED`
> and the Article IX generation lock remain **ACTIVE**.
>
> ### Next required phase
> Convene the Board (T04 session), work items 1–8 of the draft resolution, and — on signature — issue
> **AD-0024-with-conditions**; then begin construction per the B04 master to M1→M2→M3→M4.

---

## Governance / Non-Authorization Statement

No authorization issued; no resolution enacted; no adjudicator designated; no session held; no execution,
construction, or `git` mutation performed; no new governance or architecture created; no lock released; no
invariant enrolled; no technology selected. This is a decision-**preparation** package with a blank resolution
template; the sole repository effect is this additive governance `*.md`, permitted by the S0′ tolerance rule and
outside the `RM2-CONTENT-ANCHOR` protected set. M0 and all construction remain Approval-Required Operations
(AUTH-012 §8 / AD-0009). INV-1..13, `AUTH-012` (v1.0.13), AD-0014, AUTH-004/005/006 (FROZEN canon), the Article
IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged.

## Traceability
- **Consumes (authoritative):** `T04`, `B04`, `B05`.
- **Carries forward:** B05 conditions — **C-0 CLOSED** by B04; reviews **C-1..C-6**.
- **Produces:** the final M0 Board decision package (brief, scope, condition review, governance/durability/independence assessments, earliest-safe scope, recommendation, draft resolution).
- **Recommends:** **AUTHORIZE WITH CONDITIONS**; earliest-safe scope = MCF Genesis Kernel, wave-gated.
- **Feeds:** the Board M0 decision → (on signature) AD-0024-with-conditions → construction per B04 to M1..M4.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014; construction gated by `UCOS-CONSTRUCTION-BLOCKED`.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); Executor + Independent Adjudicator to be designated.

**END G01-UCOS-M0-AUTHORIZATION-DECISION-PACKAGE — PHASE G01 · EXEC BRIEF · PROPOSED SCOPE (GENESIS KERNEL,
WAVE-GATED) · CONDITIONS C-1..C-6 (C-5 SATISFIED · C-1/C-4/C-3-DESIGNATION AT-SESSION · C-2 M1 · C-3-ATTEST M4 ·
C-6 AT-M0 · NONE BLOCKED · C-0 CLOSED BY B04) · GOVERNANCE/DURABILITY/INDEPENDENCE READINESS · EARLIEST-SAFE =
GENESIS KERNEL · RECOMMENDATION: **AUTHORIZE WITH CONDITIONS** · DRAFT BOARD RESOLUTION (TEMPLATE) · **READY FOR
BOARD DECISION** · NO AUTHORIZATION / NO ENACTMENT / NO EXECUTION / NO MUTATION · CONSTRUCTION LOCK + ARTICLE IX
REMAIN ACTIVE.**
