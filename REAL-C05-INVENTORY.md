# REAL-C05-INVENTORY (WORKSTREAM 1)

> PHASE G.1 · REAL-C-05 Independent Attestation Closure Program · READ-ONLY GOVERNANCE ANALYSIS
> NO CODE · NO DESIGNATION · NO ATTESTATION · NO KEY REGISTRATION · NO LOCK RELEASE · NO REGISTRY MUTATION

| Field | Value |
|-------|-------|
| Artifact ID | `REAL-C05-INVENTORY` |
| Workstream | **1 — REAL-C-05 Inventory** |
| Phase | **G.1** |
| Version | 1.0.0 |
| Date | 2026-07-03 |
| Source of truth | `registry/program/*.json` (Constitutional Program Compiler) |
| Compiler verdict at entry | **NO_GO** (dashboard.json `computedAt` 2026-07-03T14:48:16Z) |
| Mode | Inventory only — restates definition, scope, criteria, dependencies, required evidence/approvals/attestations from the registry and the REAL-C-05 corpus. |

---

## 1. Definition

**REAL-C-05 — Independent Attestation Closure.** Independent attestation of the self-attested PI-8/PI-9 ratifications, the retroactive `AD-0016..0023` enrollment, and the R13/R14 certification ruling.

Registry sources:
- `closure-matrix.json` closure `REAL-C-05` (title "Independent Attestation Closure").
- `work-items.json` work item `REAL-C-05` (type `governance`, owner **Independent Adjudicator**, declaredStatus **IN_PROGRESS**, priority 61).

Root finding it exists to correct (`CONST-READY-001`): UCOS had **no genuinely independent adjudication** — every "independent" review, ratification, and certification was produced by a single authoring process, so all verdicts are **self-attested**.

## 2. Scope

**In scope (the closure must deliver):**
- A distinct-actor, key-separated, cryptographically verifiable Independent Adjudicator (IA) capability.
- Independent attestation (proposer ≠ attestor) of:
  - PI-8 (Ontology) ratification — `ONTO-RAT-001` (registry evidence `EV-PI8-RAT`, self-attested).
  - PI-9 (Memory) ratification — `MEM-RAT-003` (registry evidence `EV-PI9-RAT`, self-attested).
  - Authority-chain / retroactive `AD-0016..0023` enrollment on canonical `AUTH-012` (v1.0.13).
  - The R13/R14 certification ruling (reconciled through REAL-C-01).

**Out of scope (explicitly NOT REAL-C-05):**
- Article IX release, `UCOS-CONSTRUCTION-BLOCKED` lift, construction authorization, `AD-0024/0025/0026` issuance — these belong to REAL-C-03 (release), not REAL-C-05.
- Operational evidence G12-1/2/3 (REAL-C-03 dependency chain ACT-06..12).
- The IA attests evidence; it does not author, authorize, construct, or release.

## 3. Closure Criteria (authoritative — `closure-matrix.json`)

| # | Criterion | Registry text |
|:-:|-----------|---------------|
| C1 | Adjudicator model + registered keys | "independent adjudicator model established with registered keys" |
| C2 | Independent PI-8/PI-9 attestation | "PI-8/PI-9 ratifications independently attested (proposer != attestor)" |
| C3 | Retroactive AD enrollment confirmed | "retroactive AD enrollment confirmed on canonical AUTH-012 ledger" |
| C4 | R13/R14 reconciled | "R13/R14 ruling reconciled via REAL-C-01" |

Governance gate on the closure: **GATE-DOC-001**.

Operational realization (from the REAL-C-05 corpus establishment record §12) is the conversion gate **G1–G4**:
- **G1** Board enacts IA designation (distinct actor + KMS key custody disjoint) as an enrolled `AUTH-012` decision.
- **G2** Register the IA Ed25519 public key via `governance-registry.ts`.
- **G3** Produce + verify ≥1 signed attestation over reproduced evidence → attestation-chain genesis.
- **G4** Dual-witness (two distinct IAs) — **certification-time only** (terminal / Operational cert).

**Operational closure = G1 ∧ G2 ∧ G3 (+ durable enrollment). Certification closure adds G4.**

## 4. Dependencies (authoritative — `dependencies.json`)

| Edge | Meaning | State |
|------|---------|:-----:|
| `REAL-C-05` dependsOn `GOV-LEDGER-RESTORE` | Cannot be READY until ledger restoration COMPLETE | `GOV-LEDGER-RESTORE` = COMPLETE / `EV-AUTH-REST` = VERIFIED ✔ |
| `REAL-C-05` dependsOn `REAL-C-05` | Self-referential edge (registry artifact `PROG-DEP-001`) | **Governance defect flag** — a self-edge; acyclic-graph rule; recorded, non-actionable by this program |

Cross-program (from the corpus, not hard `dependencies.json` edges):
- **Complementary:** `REAL-M-07` (durability) — the RM-8 distinct-actor adjudicator = the C-05 IA; the RM-8 attestation can serve as the C-05 G3 genesis.
- **Reconciliation input for C4:** `REAL-C-01` (terminal cert re-issue) — currently IN_PROGRESS.

## 5. Required Evidence (authoritative — `evidence-registry.json`)

| Evidence ID | Work item | State | Artifact |
|-------------|-----------|:-----:|----------|
| `EV-REAL-C-05` | REAL-C-05 | **SUBMITTED** | `REAL-C-05-ATTESTATION-PACKAGE.md` (report `REAL-C-05-CLOSURE-REPORT.md`) |
| `EV-PI8-RAT` | PI-8 | **SUBMITTED** | `ONTO-RAT-001` — self-attested; independent attestation pending REAL-C-05 |
| `EV-PI9-RAT` | PI-9 | **SUBMITTED** | `MEM-RAT-003` — self-attested; independent attestation pending REAL-C-05 |
| `EV-AUTH-REST` | GOV-LEDGER-RESTORE | **VERIFIED** | `AUTH-REST-004-FINAL-AUTHORITY-STATE.md` (dependency, satisfied) |

No REAL-C-05 required evidence item is at VERIFIED or CERTIFIED. Minimum for VERIFIED is not met (all at SUBMITTED).

## 6. Required Approvals (Authority Board — Approval-Required Operations, AUTH-012 §8 / AD-0009)

| ID | Board act | Gate | State |
|----|-----------|:----:|:-----:|
| BA-1 | Enact IA designation (distinct actor + disjoint KMS key) | G1 | **ABSENT** |
| BA-2 | Approve IA public-key registration | G2 | **ABSENT** |
| BA-3 | Accept genesis attestation as evidence (not a lock lift) | G3-record | **ABSENT** |
| BA-4 | Approve durable enrollment of the G1 AD (REAL-M-07 wave) | durability | **ABSENT** |
| BA-5 | Accept dual-witness set | G4 (cert-time) | **N/A (cert-time)** |

## 7. Required Attestations (from `REAL-C-05-ATTESTATION-PACKAGE`)

| ID | Attestation | Gate | Required for closure? | State |
|----|-------------|:----:|:---------------------:|:-----:|
| ATT-SET-1 | Genesis attestation (≥1 signed Ed25519 over a real MIR target) | G3 | YES (minimum) | **UNEXECUTED** |
| ATT-SET-2 | Authority-chain re-attestation (`AUTH-012` v1.0.13, AD-0001..0023; AD-0021 disposition) | G3-class | YES (C3 independence) | **UNEXECUTED** |
| ATT-SET-3 | PI-8 ratification valid (`ONTO-RAT-001`) | G3-class | YES (C2) | **UNEXECUTED** |
| ATT-SET-4 | PI-9 ratification valid (`MEM-RAT-003`) | G3-class | YES (C2) | **UNEXECUTED** |
| ATT-SET-5 | `REAL-H-07` pre-construction gate PASS | G3-class | YES (independence) | **UNEXECUTED** |
| ATT-SET-6/7 | Terminal / Operational cert dual-witness | G4 | cert-time only | **UNEXECUTED** |

**Attestation-chain ledger state: EMPTY (0 attestations).**

---

## OUTPUT — Workstream 1

- **Definition:** Independent Attestation Closure — convert self-attested PI-8/PI-9 ratifications, retroactive AD enrollment, and the R13/R14 ruling to independently attested (proposer ≠ attestor).
- **Scope:** establish + use a distinct-actor IA capability; attest the four subjects; out of scope = release/construction/AD-0024.
- **Closure criteria:** C1–C4 (`closure-matrix.json`), realized via conversion gate G1–G4.
- **Dependencies:** `GOV-LEDGER-RESTORE` (satisfied); self-referential `REAL-C-05` edge (defect flag); complementary `REAL-M-07`; C4 reconciliation via `REAL-C-01` (IN_PROGRESS).
- **Required evidence:** `EV-REAL-C-05`, `EV-PI8-RAT`, `EV-PI9-RAT` — all **SUBMITTED** (none VERIFIED/CERTIFIED).
- **Required approvals:** BA-1..BA-4 all **ABSENT**; BA-5 cert-time.
- **Required attestations:** ATT-SET-1..5 mandatory for operational closure — **all UNEXECUTED; chain empty.**

**END REAL-C05-INVENTORY — WS1 · DEFINITION/SCOPE/CRITERIA/DEPS/EVIDENCE/APPROVALS/ATTESTATIONS INVENTORIED · NO MUTATION.**
