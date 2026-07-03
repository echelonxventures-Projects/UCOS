# UCOS-EP-0008 — Master Execution Authority

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-EP-0008` |
| Program | **UCOS Phase 2 — Master Execution Program** (terminal artifact) |
| Phase | EP-8 — Master Execution Authority |
| Mode | **EXECUTION PLANNING ONLY** — renders the final governing execution determination. No audit, no redesign, no new requirement/RC class, no scope expansion; no authorization granted, no lock lifted. |
| Status | GOVERNING — EXECUTION PROGRAM AUTHORITY (subordinate to `UCOS-EXEC-0001`) |
| Date | 2026-07-03 |
| Operates under | `UCOS-EXEC-0001`; `UCOS-EP-0001..0007`; `UCOS-RA-0008`; `UCOS-EA-0004` |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; `AD-0014` intact; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |

---

## 0. Purpose

This is the terminal governing document of the Master Execution Program. It fixes **who and what executes** —
teams, AI, automation — and **what requires Board / Authority approval, what is automated, what is prohibited,
and what constitutes success** — then renders the single execution determination from the frozen corpus:
**EXECUTION BLOCKED** or **EXECUTION MAY COMMENCE**. It grants no authorization and lifts no lock; it states the
lawful operating model and the current gate value.

---

## 1. What teams execute

| Team role | Executes | Boundary |
|-----------|----------|----------|
| **Platform delivery teams** | Additive build of BUILD packages under a granted scoped release (`EWP-A-*`, `EWP-D-SCALE`, `EWP-B-*`), keeping the baseline green and 0 core-dir change | Only after G0 = PASS and the package's scoped release; gate-bound (`GATE-QUAL/SEC/DOC/REL-001`) |
| **Platform operations (human operators)** | **Live provisioning / deployment / vendor binding / DR drills / ENV promotion** (`EWP-D-SCALE`, `EWP-D-OPCERT`) | Approval-Required (`AD-0009`); real spend; ENV-PROD only after full release |
| **Independent adjudicator / re-measurer** | Wave-0 evidentiary acts (`EWP-00-ATTEST`, `EWP-00-REMEAS`) | Must be independent of the authoring process; self-attestation rejected |
| **Stewards (per domain, `PEO-*`)** | Governance-Approval gate decisions for Optional convergence/catalog/observability | Not Board-terminal; recorded append-only |

## 2. What AI executes

| AI role | Executes | Boundary |
|---------|----------|----------|
| **Specification & preparation** | Authors execution artifacts, backlog packages, runbooks, contracts, tests, evidence templates (this EP series is an example) | Always permitted; produces no live effect |
| **Additive build assistance** | Generates additive `src/control/*` code and tests for a package under a granted scoped release | Only under a granted release; 0 prohibited-core-dir change; baseline stays green; contract-first |
| **Gate/verification computation** | Runs deterministic checks, test suites, traceability/leakage scans, audit reconstruction | Deterministic; on the commit path only via the verifier gate (INV-CORE-09) |
| **AI does NOT execute** | Any A-1..A-9 Authority act; any live provisioning/deployment/vendor binding/account creation/real spend; any autonomous actuation; any invariant enrollment; any lock release | Hard prohibition (`EXEC-0001` A-7, Prohibition 12) — **the Board authorizes; a human executes live/real-spend acts** |

> **Autonomous-actuation rule:** no AI/cognitive actor executes any real-world action until **INV-CORE-12
> (Non-Actuation)** is enrolled (`EWP-E-NONACT`); until then all AI output is propose-not-act.

## 3. What requires Board approval (governance gates; not Authority-terminal)

- Passing `GATE-QUAL-001` / `GATE-SEC-001` / `GATE-DOC-001` / `GATE-REL-001`.
- Optional convergence (`EWP-A-AUTHUNIV/AUDITUNIV/LIFEUNIV/POLVOCAB/MEMMETA`), catalog (`EWP-D-PFC`), and the
  `PE-12` observability ADR (`EWP-D-OBS`).
- Additive services realizing already-ratified contracts; ENV-DEV/INT/STAGE promotion.

## 4. What requires Authority approval (Authority-Board-terminal; `AD-0009`)

The Authority-Approval set (`EXEC-0001` A-1..A-9), recorded on `AUTH-012`:
- **A-1** lift `UCOS-CONSTRUCTION-BLOCKED` / any Article IX release (`EWP-00-LIFT`).
- **A-2** enroll any invariant — INV-CORE-12, revised INV-17/18, INV-14/16/19/20 (`EWP-E-NONACT/CRC`).
- **A-3** any scoped fabric construction authorization — `AD-0024` (Intelligence), `AD-0022` (Simulation),
  Economic release, Temporal release.
- **A-4** new/changed technology ADR version.
- **A-5** any change touching an INV-1..13 invariant or class floor (constitutional matter).
- **A-6** `AD-0014` disposition (Civilization / existential).
- **A-7** live provisioning / deployment / vendor binding / ENV-PROD (real spend).
- **A-8** high-blast-radius key rotation; AC-1 downtime maintenance.
- **A-9** `AUTH-012` ledger amendment; authority/custodian succession.

## 5. What is automated

- Deterministic gate checks, test-suite execution, `tsc`/build verification, traceability + leakage scans.
- Append-only audit capture (hash-chained, tamper-evident, offline-verifiable).
- Registry/metadata/configuration record propagation within an approved package (the five INV-13 mechanisms).
- Signed-artifact promotion through the gated pipeline (GitOps; ADR-007) — up to, but not including, ENV-PROD.
- Rollback to prior signed desired-state (corrective forward migration; ≤ 15 min AC-1).

## 6. What is prohibited (absolute; `EXEC-0001` Part III)

Building under the standing block or before a scoped release; modifying any INV-1..13 / IP-01..17 / frozen
element; introducing a new requirement/RC class/invariant by implementation; a shared mutable model or second
SoR; secrets in code; plaintext transport / permissive security / S1-S3-S4 waiver; destructive change;
modifying a prohibited core dir; an independent commit path; autonomous actuation before INV-CORE-12; custom
cryptography; **AI performing live provisioning/deployment/real-spend**; self-attestation for governance-
integrity; advancing a Deferred item without its gate; reopening a foundational discussion.

## 7. What constitutes success

| Level | Success criterion |
|-------|-------------------|
| **Work package** | Acceptance test PASS; baseline green; 0 core-dir change; S1/S3/S4 enforced; traceability intact; leakage NONE (`EXEC-0001` V.1) |
| **Gate** | Exit criteria met, fail-closed (`UCOS-EP-0006`) |
| **PRODUCTION READY** | Gate 3 exit — UCC-4 (G12-1/2/3) CLOSED; measured NFRs meet `UCOS-ASR-NFR-001` floors |
| **CIVILIZATION READY** | Gate 7 exit — CR-1..CR-6 met; INV-CORE-12 + existential invariants binding; `AD-0014` released |
| **Program** | Every Mandatory item CLOSED; every Deferred item built under a scoped release or held under `AD-0014`; `UCOM-ULTIMATE-CERT-002` issued; 0 REDESIGN, 0 constitutional change, 0 new requirement |

---

## 8. FINAL DETERMINATION

> # EXECUTION BLOCKED
>
> Operating solely on the frozen corpus, the UCOS Master Execution Program renders **EXECUTION BLOCKED.** The
> Final Execution Gate **G0 = EA-B-P0-1 ∧ EA-B-P0-2 ∧ EA-B-P1-7 ∧ EA-B-P0-3 = FAIL** (`UCOS-EA-0004`): the
> authority-chain / PI-8/PI-9 attestation is not yet independently produced, program-state reproducibility is
> not yet independently reproduced, the terminal certificate is stale, and **`UCOS-CONSTRUCTION-BLOCKED`
> stands** with construction reserved to the Authority Board. Because Wave 0 (`Gate 0`) has not exited, **no
> build wave may lawfully commence.**
>
> The block is **governance-integrity, not architectural**: the program of work is fully defined (WBS, backlog,
> waves, dependency authority, governance model, gates, critical path), **0 forward dependencies, 0 REDESIGN, 0
> true coverage gaps**, and the Minimum Constitutional Runtime is realized (269/269). Execution flips to
> **EXECUTION MAY COMMENCE** the moment **G0 = PASS**, achieved by the four Wave-0 packages —
> `EWP-00-ATTEST` ∥ `EWP-00-REMEAS` → `EWP-00-CERT` → `EWP-00-LIFT` — **none of which requires software**. On
> that Board act, the program is authorized to proceed along the master critical path (`UCOS-EP-0007`):
> **G0 → SCALE → OPCERT = PRODUCTION READY** (6 packages), and **G0 → NONACT → INTEL → SIM → CIV = CIVILIZATION
> READY** (held at the terminal `AD-0014` gate).

### 8.1 Determination summary

| Question | Determination |
|----------|---------------|
| Is the program of work fully defined? | **YES** — WBS + 26 packages + waves + DAG + governance + gates + critical path |
| Are there forward dependencies / cycles / redesign? | **NO** — 0 / 0 / 0 |
| Is the Minimum Constitutional Runtime realized? | **YES** — Stages 0–5, 269/269 |
| Is the Final Execution Gate satisfied? | **NO** — G0 = FAIL |
| Does `UCOS-CONSTRUCTION-BLOCKED` stand? | **YES** |
| **May execution commence now?** | **NO — EXECUTION BLOCKED** |
| Path to reversal | Wave 0: `ATTEST` ∥ `REMEAS` → `CERT` → `LIFT` ⇒ **G0 = PASS ⇒ EXECUTION MAY COMMENCE** |

---

## 9. Scope discipline
No code, requirement, RC class, invariant, or authorization was produced or granted; no attestation,
re-measurement, certificate re-issue, or lock release was performed. INV-1..13, `AUTH-012`, `AD-0014`, and the
Article IX generation lock are unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands.** Lifting the block is reserved
to the UCOS Authority Board.

## 10. Traceability
- **Consumes:** `UCOS-EXEC-0001`; `UCOS-EP-0001..0007`; `UCOS-RA-0008`; `UCOS-EA-0004` (G0=FAIL); `AUTH-009`; `AD-0009`.
- **Refined by:** the Authority-Board Wave-0 authorization act (G0 closure).
- **Owner:** UCOS Authority Board (terminal authority; custodian: Chief Authority Architect).

**END `UCOS-EP-0008` — MASTER EXECUTION AUTHORITY · TEAMS/AI/BOARD/AUTHORITY/AUTOMATED/PROHIBITED/SUCCESS DEFINED · FINAL DETERMINATION: EXECUTION BLOCKED (G0 = FAIL; `UCOS-CONSTRUCTION-BLOCKED` STANDS) · REVERSIBLE VIA WAVE 0 (EVIDENCE + ONE BOARD ACT; NO BUILD) ⇒ EXECUTION MAY COMMENCE ON G0 = PASS · 0 REDESIGN · 0 NEW REQUIREMENT · PLANNING ONLY.**
