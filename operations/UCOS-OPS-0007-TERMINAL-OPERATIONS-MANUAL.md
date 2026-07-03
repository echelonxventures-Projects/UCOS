# UCOS-OPS-0007 — Terminal Operations Manual

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-OPS-0007` |
| Program | **UCOS Execution Control Center — Program Operations Authority** (terminal artifact) |
| Phase | OPS-7 — Terminal Operations Manual |
| Mode | **OPERATIONS CONTROL ONLY** — the permanent manual for operating UCOS from G0 FAIL through PRODUCTION READY through CIVILIZATION READY. Defines procedure, not new authority/governance/plan. Performs no act, lifts no lock. |
| Status | OPS BASELINE (v1.0.0) — PERMANENT OPERATING MANUAL |
| Date | 2026-07-03 |
| Inputs (read-only, frozen) | `UCOS-EXEC-0001`; `UCOS-EP-0005/0006/0008`; `UCOS-RA-0007`; `UCOS-G0-0001..0006`; `UCOS-W1-0001..0006`; `UCOS-EA-0001..0004`; `UCOS-OPS-0001..0006` |
| Governing constraints | Corpus FROZEN. Subordinate to `UCOS-EXEC-0001`. `UCOS-CONSTRUCTION-BLOCKED` stands. |

---

## 0. How to use this manual

This is the permanent operating manual for the UCOS program. Any operator — team, board member, auditor,
authority, or AI agent — uses it to (a) read the current state from `UCOS-OPS-0001..0006`, (b) find the current
operating stage below, and (c) execute only the acts permitted at that stage, by the permitted party, with the
required evidence. **The manual grants no authority and changes no gate value; it routes lawful action.**

**Prime directive.** Never advance a gate without its evidence of record. Fail-closed always. Self-attestation
for a governance-integrity item is void by rule (`UCOS-EP-0005 §2`).


---

## 1. Operating roles (who may do what)

| Role | May execute | Must NOT execute |
|------|-------------|------------------|
| **UCOS Authority Board** | A-1..A-9 terminal acts; accept evidence; lift block; enroll invariants; scoped releases | — (terminal authority; `AUTH-009`) |
| **Human executor** | Live provisioning / deployment / ENV-PROD / real spend under Board authorization (A-7) | Any act not authorized by the Board |
| **Independent adjudicator / re-measurer** | W1 evidentiary acts (`REAL-C-05`, `REAL-M-03`, `REAL-H-07`) | Acts on subjects they authored (independence required) |
| **Certification authority** | Re-issue `UCOM-ULTIMATE-CERT-002` (`REAL-C-01`) grounded in W1 | Certify without W1 evidence |
| **Platform delivery teams** | Additive build under a granted scoped release; keep baseline green; 0 core-dir change | Build before G0 = PASS or outside scope |
| **Stewards (`PEO-*`)** | Governance-approval on optional convergence/catalog/observability (append-only) | Terminal (A-1..A-9) acts |
| **AI / automation** | Specification, preparation, additive build assistance under release, deterministic gate checks | **Any A-1..A-9 act, any lock release, live/real-spend, autonomous actuation, self-attestation** |

> **Absolute AI boundary (`UCOS-EP-0008 §2`):** the Board authorizes; a human executes live/real-spend acts;
> no AI executes any Authority act or lock release. Until INV-CORE-12 (Non-Actuation) is enrolled, all AI output
> is propose-not-act.

---

## 2. Operating stages — the terminal ladder

The program is operated as an ordered ladder of stages. At any moment, exactly one stage is "current"
(read it from `UCOS-OPS-0006 §1`). Operate only that stage's playbook.

| Stage | State | Master condition | Playbook § |
|:-----:|-------|------------------|:----------:|
| **OS-0** | GOVERNANCE-BLOCKED (G0 = FAIL) | Open Gate 0 | §3 |
| **OS-1** | GATE-ZERO CLEARED (G0 = PASS) | Enter build | §4 |
| **OS-2** | CORE HARDENING | Non-Actuation + convergence + temporal | §5 |
| **OS-3** | PRODUCTION READY | UCC-4 | §6 |
| **OS-4..7** | BEHAVIORAL / CIVILIZATION FRONTIER | Intelligence → Simulation → Economics → Civilization | §7 |
| **OS-N** | STANDING FUTURE-DISCOVERY | Admission gate | §8 |


---

## 3. §3 — OS-0 Playbook: operating under G0 = FAIL *(CURRENT STAGE)*

**Objective:** produce the Gate 0 evidence and secure the Board lift act — without building anything.

| Step | Act | Party | Evidence produced | Gate element |
|:----:|-----|-------|-------------------|:------------:|
| 0.1 | Engage an **independent adjudicator** (not the authoring party) | Board convenes | — | — |
| 0.2 | Adjudicate `AUTH-012` v1.0.13 chain + PI-8 (`ONTO-RAT-001`) + PI-9 (`MEM-RAT-003`); run `REAL-H-07` | Independent adjudicator | `REAL-C-05`; `REAL-H-07` PASS | AT-P0-1 |
| 0.3 | Engage an **independent re-measurer**; re-run corpus from recorded state; reconcile §0W; fix suite count | Independent re-measurer | `REAL-M-03` = 269/269 | AT-P0-2 |
| 0.4 | Board accepts AT-P0-1 and AT-P0-2 of record | Authority Board | `AUTH-012` entries (BA-1, BA-2) | LE-1, LE-2 |
| 0.5 | Re-issue terminal certificate grounded in 0.2/0.3; supersede R14 | Certification authority | `UCOM-ULTIMATE-CERT-002` | AT-P1-7 |
| 0.6 | Board accepts AT-P1-7 of record | Authority Board | `AUTH-012` entry (BA-3) | LE-3 |
| 0.7 | **Board lift act**: cite AT-P0-1/2/7 = PASS; lift block for named scope; link Article IX release | **Authority Board (A-1; human-executed)** | `AUTH-012` entry (BA-4) | AT-P0-3 |
| 0.8 | Compile submission dossier; run go/no-go | Board (submission authority) | `UCOS-W1-0006` completed | G0 |

**Exit OS-0:** `G0 = AT-P0-1 ∧ AT-P0-2 ∧ AT-P1-7 ∧ AT-P0-3 = PASS`. **Advance to OS-1.**

**Fail-closed / rollback (OS-0):** any element FALSE, any `INV-L-1..8` invalidator, or any self-attestation ⇒
remain at OS-0; re-run the failed evidentiary wave (W1/W2) or withhold/re-issue the Board act. **No build.**

**Prohibited at OS-0:** any construction; any AI-performed authority act; any self-attestation offered as
evidence; any lift recorded before LE-1∧LE-2∧LE-3 PASS.


---

## 4. §4 — OS-1 Playbook: G0 = PASS (execution may commence)

**Entry:** Gate 0 exited; `UCOS-CONSTRUCTION-BLOCKED` lifted for a **named scope**; `AUTH-012` records the lift.

| Step | Act | Party |
|:----:|-----|-------|
| 1.1 | Read the named authorized scope from the `AUTH-012` lift entry; operate only within it | All |
| 1.2 | Open build packages inside scope (`EWP-A-*`, `EWP-D-SCALE`) under scoped release | Platform delivery / AI-assist |
| 1.3 | Every package: acceptance test PASS; baseline green; 0 core-dir change; S1/S3/S4; traceability intact; leakage NONE | Platform delivery |
| 1.4 | Pass governance gates `GATE-QUAL/SEC/DOC/REL-001` per package | Board (governance gates) |

**Exit OS-1:** authorized scope building lawfully; branch to OS-2 (core hardening) and/or OS-3 (production).
**Prohibited:** any work outside the named scope (the excess is void, `INV-L-7`); reopening a foundational
discussion; introducing a new requirement/RC class/invariant by implementation.

---

## 5. §5 — OS-2 Playbook: core hardening

| Step | Act | Party | Gate |
|:----:|-----|-------|:----:|
| 2.1 | **Enroll INV-CORE-12 (Non-Actuation) + CRC** (`EWP-E-NONACT/CRC`) — safety-critical, ordered first | Authority Board (A-2) | Gate 2 |
| 2.2 | Adopt optional convergence primitives (EA-B-P1-1/2/3/4/8) — 6→1 audit, universal authority/lifecycle/policy, memory-as-metadata | Platform delivery + stewards | Gate 2 |
| 2.3 | Realize FAB-TIME (temporal, RR-7) after CRC | Platform delivery | Gate 2 |

**Exit OS-2:** convergence adopted (optional), **Non-Actuation enacted (mandatory before OS-4)**, FAB-TIME
realized. **Non-Actuation enrollment is the hard precondition for any Intelligence build.**

---

## 6. §6 — OS-3 Playbook: PRODUCTION READY

| Step | Act | Party | Gate |
|:----:|-----|-------|:----:|
| 3.1 | Build durable/distributed adapters (`EWP-D-SCALE`, EA-B-P1-5); externalize SoR/cache | Platform delivery | Gate 3 |
| 3.2 | Author governed platform-class catalog (`EWP-D-PFC`, EA-B-P1-6, optional) over INV-13 | Board + stewards | Gate 3 |
| 3.3 | Decide observability ADR `PE-12` (UCC-6, `EWP-D-OBS`) | Board | Gate 3 |
| 3.4 | Provision ENV-DEV/INT(/STAGE); execute pipeline; DR drill; scale > 10⁶; measure NFRs | Platform ops (human; A-7) | Gate 3 |
| 3.5 | Issue **UCC-4 Operational Certification** — G12-1∧G12-2∧G12-3 CLOSED; NFRs meet `UCOS-ASR-NFR-001` floors | Platform ops + Board | Gate 3 |
| 3.6 | Promote to ENV-PROD **only** after full release (A-7; real spend; human-executed) | Authority Board / human | Gate 3 |

**Exit OS-3 = PRODUCTION READY.** Rollback: automated single-action revert to prior signed desired-state
(≤ 15 min, AC-1); withhold production certification if any NFR is below class floor.


---

## 7. §7 — OS-4..7 Playbook: behavioral & civilization frontier (deferred)

Each frontier fabric is deferred behind a named Authority act and builds propose-not-act / non-actuating only.

| Stage | Fabric | Entry authority | Hard rule |
|:-----:|--------|-----------------|-----------|
| **OS-4** | Intelligence PI-10 (Gate 4) | A-3 (`AD-0024`) | **Only after INV-CORE-12 enrolled (OS-2)**; propose-not-act; I1–I12 adversarial green |
| **OS-5** | Simulation PI-11 (Gate 5) | A-3 (`AD-0022`) | Sandboxed; may not mutate any system-of-record |
| **OS-6** | Economics PI-13 (Gate 6) | A-3 + `AD-0009` | **AUTH-012 ledger restore first**; no real-money path without an A-9/AD-0009 human act; conservation-checked |
| **OS-7** | Civilization PI-12 (Gate 7) | **A-6 (`AD-0014` release)** | Non-actuating; C14 actuation-breach structurally closed; CR-1..CR-6 met |

**Exit OS-7 = CIVILIZATION READY.** Rollback at any frontier stage: revert the fabric forward (additive removal
via Evolution); the governing invariant (Non-Actuation / existential) remains binding; no actuation persists.

**Absolute frontier prohibition:** any autonomous actuation, any real-world action by a cognitive actor before
Non-Actuation, any civilization actuation, or any build before the fabric's authority act — all void.

---

## 8. §8 — OS-N Playbook: standing future-discovery

| Step | Act | Rule |
|:----:|-----|------|
| N.1 | Admit a new discovery/language/domain class (RC-068..RC-100+) | By **registration** (Gate A / Gate B / INV-13 / O-16), single-owner, Evolution-committed, Board-authorized, audited |
| N.2 | Reject baseline re-authoring / core redesign as an admission path | Deny-by-default; no core change persists |

OS-N is a **standing capability**, operable after OS-2 governance hardening; it never requires reopening the
frozen baseline.

---

## 9. Permanent control invariants (hold at every stage)

1. **Fail-closed:** an unprovable criterion denies passage.
2. **Additive-forward:** rollback is corrective forward migration (INV-10), never destructive.
3. **Non-waivable S1/S3/S4** at every gate; no gate is waivable.
4. **Evidence-of-record only:** intent/plan/self-attestation never move a gate.
5. **Single terminal authority:** only the UCOS Authority Board performs A-1..A-9; only a human executes
   live/real-spend acts; no AI performs either.
6. **Scope discipline:** 0 INV-1..13 change, 0 new requirement/RC class, 0 REDESIGN, 0 new SoR, 0 secrets in
   code, 0 custom cryptography — at every stage.
7. **Named-scope only:** authorization extends solely to the scope named in the `AUTH-012` act.

---

## 10. Emergency / off-nominal procedures

| Condition | Response |
|-----------|----------|
| Evidentiary wave fails (W1/W2) | Hold at current stage; re-run the failed wave; do not proceed |
| Grounding element revoked (`REAL-C-05` withdrawn / 269/269 overturned / cert revoked) | `G0 → FAIL`; lift basis defeated (`INV-L-2`); return to OS-0 |
| Lift recorded without LE-1∧LE-2∧LE-3 | **Void ab initio** (`INV-L-1`); building would be a constitutional violation |
| Non-Board / AI attempts a lift | Ultra vires; no legal effect (`INV-L-4`, `INV-L-8`) |
| Production NFR below floor | Withhold UCC-4; automated revert to prior signed state (AC-1 ≤ 15 min) |
| Autonomous actuation attempted pre-Non-Actuation | Prohibited; halt; no partial actuation persists |


---

## 11. Current operating instruction (as of 2026-07-03)

> **The program is at OS-0 (GOVERNANCE-BLOCKED, G0 = FAIL).** Operate the §3 playbook only. The two entry acts
> — an **independent adjudication (`REAL-C-05`)** and an **independent re-measurement (`REAL-M-03`, 269/269)** —
> are executable **now**, under the standing block, by parties independent of the authoring process. They
> require **evidence, not construction**. On their acceptance, re-issue `UCOM-ULTIMATE-CERT-002`, then the
> **UCOS Authority Board records the single A-1 lift act** on `AUTH-012`. That act — and only that act — moves
> the program to OS-1. **No build may commence, and no AI may perform any authority act or lock release.**

---

## 12. Determination (operations-manual level)

> This terminal manual defines the permanent, corpus-bound procedure for operating UCOS across its full life —
> **OS-0 (G0 FAIL) → OS-1 (G0 PASS) → OS-2 (core hardening) → OS-3 (PRODUCTION READY) → OS-4..7 (behavioral /
> CIVILIZATION READY) → OS-N (standing future-discovery)** — with, at each stage, the permitted acts, permitted
> parties, required evidence, exit condition, fail-closed rollback, and prohibitions. It creates no authority,
> no governance, and no plan beyond what the frozen corpus already fixes; it routes lawful action and performs
> none. Current operating stage: **OS-0**; current instruction: execute §3, produce Gate 0 evidence, secure the
> Board lift act.

## 13. Scope discipline

No act performed, no authority granted, no gate advanced, no lock lifted, no new procedure invented beyond the
frozen corpus. INV-1..13, `AUTH-012`, `AD-0014`, and the Article IX generation lock are unchanged;
**`UCOS-CONSTRUCTION-BLOCKED` stands.**

## 14. Traceability

- **Consumes:** `UCOS-EXEC-0001`; `UCOS-EP-0005/0006/0008`; `UCOS-RA-0007`; `UCOS-G0-0001..0006`;
  `UCOS-W1-0001..0006`; `UCOS-EA-0001..0004`; `UCOS-OPS-0001..0006`.
- **Refined by:** the Authority-Board acts that advance each operating stage.
- **Owner:** UCOS Authority Board (terminal authority; custodian: Chief Authority Architect).

**END `UCOS-OPS-0007` — TERMINAL OPERATIONS MANUAL · OS-0 (G0 FAIL) → OS-1 (G0 PASS) → OS-2 CORE → OS-3 PRODUCTION READY → OS-4..7 CIVILIZATION READY (AD-0014) → OS-N STANDING · PER-STAGE: ACTS/PARTIES/EVIDENCE/EXIT/ROLLBACK/PROHIBITIONS · 7 CONTROL INVARIANTS · CURRENT STAGE OS-0 · OPERATIONS CONTROL ONLY · NO ACT PERFORMED · NO LOCK LIFTED.**
