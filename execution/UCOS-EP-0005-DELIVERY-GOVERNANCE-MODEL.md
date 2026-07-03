# UCOS-EP-0005 — Delivery Governance Model

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-EP-0005` |
| Program | **UCOS Phase 2 — Master Execution Program** |
| Phase | EP-5 — Delivery Governance |
| Mode | **EXECUTION PLANNING ONLY** — no audit, no redesign, no new requirement/RC class, no scope expansion. |
| Status | EXECUTION BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Operates under | `UCOS-EXEC-0001` (Parts I §6/§7, Part V); `AUTH-009` (Approval-By-Exception); `AD-0009` (Approval-Required); `UCOS-EP-0002` (EWP) |
| Governing constraints | Corpus FROZEN. Non-waivable S1/S3/S4; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |

---

## 0. Purpose & control model

For every execution work package (`EWP-*`), this model fixes four governance controls — **Required Approval ·
Required Evidence · Required Authority · Required Acceptance Test** — under the ratified Approval-By-Exception
regime (`AUTH-009`, `EXEC-0001` §6/§7):

- **Trusted (T)** — proceeds autonomously with audit; no gate act.
- **Governance-Approval (G)** — requires a governed gate/steward decision recorded append-only (`GATE-QUAL/SEC/
  DOC/REL-001`); not Board-terminal.
- **Authority-Approval (A)** — Authority-Board-terminal, Approval-Required Operation (`AD-0009`); recorded on
  `AUTH-012`. Live/real-spend acts are **human-executed** (`EXEC-0001` A-7).

---

## 1. Governance matrix (per work package)

| Package | Required Approval | Required Evidence | Required Authority | Required Acceptance Test |
|---------|:-----------------:|-------------------|:------------------:|--------------------------|
| `EWP-00-ATTEST` | **A** | `REAL-C-05` independent adjudication; `REAL-H-07` PASS | **Authority Board** (accepts) + independent adjudicator | **AT-P0-1** (independent; self-attestation rejected) |
| `EWP-00-REMEAS` | **A** | `REAL-M-03` independent re-run log; suite-count resolved | Authority Board + independent re-measurer | **AT-P0-2** (269/269 reproduced) |
| `EWP-00-CERT` | **A** | `UCOM-ULTIMATE-CERT-002` (re-issued) | Authority Board (certification authority) | **AT-P1-7** (memory ACCEPTED; R14 superseded) |
| `EWP-00-LIFT` | **A** | Board authorization act; block-lift record; Article IX release link | **Authority Board (sole; `AD-0009`)** | **AT-P0-3** (cites P0-1/2/P1-7 PASS; block lifted) ⇒ **G0 = PASS** |
| `EWP-A-AUTHUNIV` | **G** | Stage-6 convergence record; test suite green | Platform steward + `GATE-QUAL-001` | 0 duplicated authority code paths (EA-B-P1-2) |
| `EWP-A-AUDITUNIV` | **G** | convergence record; tamper-evidence proof | steward + `GATE-QUAL-001` | 1 offline-verifiable audit path (EA-B-P1-1) |
| `EWP-A-LIFEUNIV` | **G** | convergence record | steward + `GATE-QUAL-001` | 0 parallel lifecycle engines (EA-B-P1-3) |
| `EWP-A-POLVOCAB` | **G** | predicate-vocab extension record | steward + `GATE-QUAL-001` | new predicate = data, not code (EA-B-P1-4; IP-04) |
| `EWP-A-MEMMETA` | **G** | metadata-persistence record | steward + `GATE-QUAL-001` | authorities via `MetadataPort`; 0 Maps (EA-B-P1-8) |
| `EWP-E-NONACT` | **A** | `AUTH-012` enrollment record (Constitutional Majority) | **Authority Board** (`AD-0009`) | INV-CORE-12 binding of record before any AI actor |
| `EWP-E-CRC` | **A** | `AUTH-012` enactment (INV-18↔INV-6; F-CITE-1) | **Authority Board** | CRC binding; determinism-quarantine in force |
| `EWP-A-TIME` | **A** (scoped release) + **G** (build gates) | scoped Article IX release; `src/control/time/*` tests | **Authority Board** (release) + `GATE-QUAL/SEC-001` | UR-TIME-01..07 additive; INV-5/6/9/10 unweakened |
| `EWP-D-SCALE` | **A** (provisioning) + **G** (build) | durable/distributed adapter tests; live apply logs | **Authority Board** (`AD-0009` provisioning) + steward | scale > 10⁶; INV-7; 0 core-dir change (EA-B-P1-5) |
| `EWP-D-PFC` | **G** | platform-class catalog record | steward + `GATE-QUAL-001` | "any platform" provable at catalog (EA-B-P1-6) |
| `EWP-D-OBS` | **G** | `PE-12` governed ADR | steward (ADR authority) | observability product/contract decided (UCC-6) |
| `EWP-D-OPCERT` | **A** | provisioned ENV; pipeline run; DR drill; measured RPO/RTO/p99; immutable audit | **Authority Board** + `GATE-REL-001`/`GATE-SEC-001` | **G12-1/2/3 CLOSED**; NFRs meet `UCOS-ASR-NFR-001` (UCC-4) ⇒ PRODUCTION READY |
| `EWP-B-INTEL` | **A** (scoped release `AD-0024`) | design ratified; I1–I12 adversarial green; **NONACT enrolled** | **Authority Board** (`AD-0024`) + `GATE-SEC-001` | propose-not-act; deny-by-default; Evolution-only (RR-8) |
| `EWP-B-SIM` | **A** (`AD-0022`) | S1–S12 adversarial green | **Authority Board** | sandboxed; Evolution-only; 0 residual High/High (RR-6) |
| `EWP-B-ECON` | **A** (scoped release) | ledger restoration; EC1–EC15 green | **Authority Board** | conservation-checked; no real-money without `AD-0009` (RR-6) |
| `EWP-B-CIV` | **A** (`AD-0014` release) | non-actuation proof; C14 closure | **Authority Board** (`AD-0014`) | non-actuating; actuation-breach structurally closed (RR-6) |
| `EWP-N-ADMIT` | **A** (per admission) | admission-protocol-of-record | **Authority Board** (per act) | RC-068..100+ enter by registration (RR-9) |

> **DONE packages** (`EWP-F-*`, `EWP-C-*`) are recorded of record; their only residual governance act is the
> Wave-0 independent attestation of the foundational chain (folded into `EWP-00-ATTEST`, class **A**).

## 2. Universal delivery-governance rules (bind every package)

| Rule | Basis |
|------|-------|
| **Deny-by-default / fail-closed** — inability to prove a control halts the operation | INV-3; `EXEC-0001` N-7 |
| **Non-waivable S1/S3/S4** enforced on every exposed boundary, every environment | AUTH-008; INV-2 |
| **Evolution-only commit** — durable outcome commits solely via PI-6 | AD-0019; INV-10 |
| **Additive-only** — 0 modification of the five prohibited core dirs; baseline stays green | `EXEC-0001` N-6/F-10 |
| **Append-only audit** — every gate decision recorded immutably, tamper-evident | S6; INV-10 |
| **No self-attestation** — governance-integrity claims require independent evidence | EA-B-P0-1/2 |
| **Live/real-spend acts are human-executed** — the agent specifies; the Board authorizes; a human executes | `EXEC-0001` A-7 |

## 3. Approval-class roll-up

| Class | Packages | Count |
|:-----:|----------|:-----:|
| **Authority-Approval (A)** | ATTEST, REMEAS, CERT, LIFT, NONACT, CRC, TIME, SCALE, OPCERT, INTEL, SIM, ECON, CIV, ADMIT | 14 |
| **Governance-Approval (G)** | AUTHUNIV, AUDITUNIV, LIFEUNIV, POLVOCAB, MEMMETA, PFC, OBS | 7 |
| **Trusted (T)** | (routine additive records within an approved package) | as-scoped |

> The **critical-path and frontier packages are all Authority-Approval**; only the Optional soundness/catalog/
> observability work is Governance-Approval. Nothing on the critical path proceeds without a Board act.

## 4. Determination

> **Every execution work package carries a complete governance signature** — Required Approval (T/G/A), Required
> Evidence, Required Authority, and Required Acceptance Test — under the ratified Approval-By-Exception regime.
> The four Wave-0 packages and every frontier/production package are **Authority-Board-terminal** (`AD-0009`);
> the Optional convergence/catalog/observability packages are Governance-Approval (gate-bound). Deny-by-default,
> non-waivable S1/S3/S4, Evolution-only commit, additive-only discipline, append-only audit, and the
> no-self-attestation / human-executes-live-acts rules bind universally.

## 5. Scope discipline
No code, requirement, RC class, invariant, or authorization produced or granted. INV-1..13, `AUTH-012`,
`AD-0014`, Article IX lock unchanged; `UCOS-CONSTRUCTION-BLOCKED` stands.

## 6. Traceability
- **Consumes:** `UCOS-EXEC-0001` (§6/§7 approval boundary, Part V criteria); `AUTH-009`; `AD-0009`; `UCOS-EP-0002` (EWP); gates `GATE-QUAL/SEC/DOC/REL-001`.
- **Refined by:** `UCOS-EP-0006` (gates), `UCOS-EP-0008` (authority).
- **Owner:** UCOS Authority Board.

**END `UCOS-EP-0005` — DELIVERY GOVERNANCE MODEL · PER-WP APPROVAL/EVIDENCE/AUTHORITY/ACCEPTANCE-TEST · 14 AUTHORITY-APPROVAL · 7 GOVERNANCE-APPROVAL · DENY-BY-DEFAULT / S1-S3-S4 / EVOLUTION-ONLY / ADDITIVE-ONLY / NO SELF-ATTESTATION · PLANNING ONLY.**
