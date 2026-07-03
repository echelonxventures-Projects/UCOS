# UCOS-EXEC-0001 — Execution Constitution

## The Single Governing Document for All Future Implementation

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-EXEC-0001` |
| Program | **UCOS Phase Ω — Execution Constitution** |
| Version | 1.0.0 |
| Status | **GOVERNING — TERMINAL EXECUTION AUTHORITY** (subordinate only to the Authority Layer, Constitution, and Governance Baseline 1.0.0) |
| Mode | **GOVERNED CONSOLIDATION ONLY** — synthesizes the frozen `REQ / GAP / AUTH / INV / AUDIT / IR / EA / RA` corpora into one binding instrument. Creates no new requirement, RC class, invariant, ADR, or authorization; enrolls nothing; lifts no lock. |
| Date | 2026-07-03 |
| Consolidates | `UCOS-REQ-0001..0006`; `UCOS-GAP-0001/0002`; `UCOS-AUTH-0001`; `UCOS-INV-0001`; `UCOS-AUDIT-0001..0004`; `UCOS-IR-0001..0008`; `UCOS-EA-0001..0004`; `UCOS-RA-0001..0008` |
| Supreme references | Authority Layer `AUTH-001..012`; Constitution `UCOS-CONST-001` (Art. IX generation lock, Art. XII security); Governance Baseline 1.0.0 (FROZEN); `UCOS-ASR-NFR-001` v1.0.1 (INV-1..13); `AD-0014` |
| Governing constraints | INV-1..13 unchanged; INV-14..20 NOT enrolled; `AD-0014` intact; Article IX generation lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands until the Board lifts it. |

---

## 0. Preamble — purpose and supremacy

This is the **single governing document for all future UCOS implementation.** Every build, migration,
convergence, enactment, deployment, and certification action — from the next line of code to civilization-scale
realization — is governed by this instrument. It is a *consolidation*, not a new law: it restates, in executable
form, what the frozen constitutional, requirements, governance, authority, invariant, audit, implementation-
readiness, execution-authorization, and realization corpora already establish.

**Supremacy order (unchanged; `AUTH-009 §6.1`):**

```
Authority Layer (AUTH-001..012)
  > Constitution (UCOS-CONST-001)
    > Governance Baseline 1.0.0 (FROZEN) + INV-1..13 (UCOS-ASR-NFR-001)
      > UCOS-EXEC-0001 (this document)
        > Architecture / ADRs / Contracts
          > Implementation / Validation / Certification
```

Where this document and any subordinate artifact conflict, this document governs execution; where this document
and any superior artifact conflict, **the superior artifact prevails** and this document is read as a conformant
extension. Nothing here amends the Constitution, the invariant set, or the Authority Layer.

> **Sufficiency clause.** This document is authored to be **sufficient to govern all future implementation work
> without reopening any foundational discussion.** Foundational questions (what the platform is, what its
> invariants are, what is certified) are **closed**. Only realization questions (build, enroll, attest, deploy,
> certify) remain, and they are answered here.

---

# PART I — THE TEN GOVERNING DETERMINATIONS

## 1. What is FROZEN (immutable at the execution layer; change only by constitutional amendment)

| # | Frozen element | Source |
|:-:|----------------|--------|
| F-1 | The **Authority Layer** `AUTH-001..012` and its supremacy/hierarchy | `AUTH-001..012` |
| F-2 | The **Constitution** `UCOS-CONST-001` (incl. Article IX generation lock, Article XII security) | `UCOS-CONST-001` |
| F-3 | The **17 Immutable Principles** `IP-01..IP-17` (non-waivable absent amendment) | `AUTH-003` |
| F-4 | The **13 Foundation-Permanence Invariants** `INV-1..INV-13` (redesign-prohibited) | `UCOS-ASR-NFR-001` v1.0.1 |
| F-5 | The **Governance Baseline 1.0.0** — 80 governance domains, 365 entities, `PEA-001..007`, 36 matrices | Governance Baseline 1.0.0 (FROZEN) |
| F-6 | The **ratified design stack** — Enterprise → Domain → Capability → Information/Metadata → Conceptual/Logical/Physical Data (all AUTHORITATIVE) | `UCOS-*-ARCH` (ratified) |
| F-7 | The **ratified delivery-design conditions** C-1..C-5 (Experience, Service/API, Security, Technology ADRs, Platform) | PHASE 10.6 |
| F-8 | The **85 ratified contracts** (`UCOS-CONTRACT-CAT-001`) and the **ASR/NFR classes/tiers** (AC-1..4, T1..T4, RPO/RTO) | `UCOS-SVC-*`, `UCOS-ASR-NFR-001` |
| F-9 | The **realized Minimum Constitutional Runtime** (Stages 0–5: PI-2..PI-9) as the correctness-complete kernel of record | `UCOS-IR-0005`; `UCOS-RA-0004` |
| F-10 | The **five prohibited substrate core directories** — `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts` (additive-only; never modified by any fabric build) | AD-0016..0022 build discipline |

> **Frozen ⇒ redesign-prohibited.** Any change to F-1..F-10 that would force *redesign* (not extension) is a
> **constitutional matter**, rejected at the execution layer and escalated to the Authority Board.

## 2. What is CONFIGURABLE (varied by data, never by code fork — IP-04 / PEP-003)

| # | Configurable element | Mechanism |
|:-:|----------------------|-----------|
| CF-1 | Service behavior, feature flags, variability | Configuration records (`API-018`, hierarchical config); never a code fork |
| CF-2 | Concrete technology products (mesh, KMS, CI, datastore engine, observability `PE-12`) | **Within** the neutral ADR contract (`ADR-001..007`); change = new ADR version + AUTH-012 (migration-only) |
| CF-3 | Capacity along scale tiers **T1→T4** (users, req/s, events/s, storage) | Horizontal scale-out; add replicas/partitions/regions — no redesign (INV-7) |
| CF-4 | Numeric NFR targets (tighter latency, higher availability) | Governed upward revision (≥1.0.1); **never** loosened below a class floor |
| CF-5 | Policy predicate vocabulary, governance rules | Registry/metadata-extensible predicates (once RR-4 closed); data, not a code switch (IP-05) |
| CF-6 | Theming, locale, experience variability | Metadata-driven (`MC-13`/`MC-01`; IP-H) |

## 3. What is EXTENSIBLE (grown by registration/metadata/config/composition/federation — INV-13)

Per **INV-13 (Infinite Extensibility)**, the platform imposes **no architectural ceiling** on:
**Domains · Services · Workflows · Data Models · Events · Capabilities · AI Systems · Computational Engines ·
Organizational Structures · Deployment Topologies.** New capability enters via the **five mechanisms only**:

| # | Extension mechanism | Realized by |
|:-:|---------------------|-------------|
| EX-1 | **Registration** — register + discover at runtime | Registry `API-027` (`WP-PLT-06`) |
| EX-2 | **Metadata** — describe via open-class metadata records | Metadata `API-018` (`WP-PLT-11`) |
| EX-3 | **Configuration** — hierarchical config resolution | ConfigurationPort |
| EX-4 | **Composition** — acyclic dependency composition | Meta-Core composition engine |
| EX-5 | **Federation** — multi-cluster / multi-region | PI-5 federation (`AD-0018`) |

Every future architecture review MUST demonstrate **C-EX1..C-EX5** (no hard-coded ceilings; metadata-driven;
registry-discoverable; contract-first additive/migration-only; federation-compatible). A review that cannot is a
**foundation-redesign risk** and is escalated to the Authority Board.

## 4. What is DEFERRED (specified/admissible; not to be advanced now)

| # | Deferred element | Held by | Gate to advance |
|:-:|------------------|---------|-----------------|
| D-1 | **Temporal fabric** FAB-TIME (RC-051..058; `UCOS-RA-0003` T-1..T-7) | Realization frontier (RR-7) | G0 + Stage 7 (CRC for T-2/T-7) |
| D-2 | **Intelligence** FAB-INTEL / PI-10 | Realization frontier (RR-8) | **INV-CORE-12 enrolled first** + `AD-0024` |
| D-3 | **Simulation** FAB-SIM / PI-11 | `AD-0022` conditional (RR-6) | Scoped release; non-actuating |
| D-4 | **Economic** FAB-ECON / PI-13 | Realization frontier (RR-6) | Ledger restoration + scoped release; no real-money path without AD-0009 |
| D-5 | **Civilization** FAB-CIV / PI-12 | **`AD-0014`** (RR-6) | Board `AD-0014` disposition; non-actuating |
| D-6 | **Existential invariants** INV-14..20; Ω∞ | **`AD-0014`** (RR-10) | Board enactment (`AUTH-013-AMD-001`; `EXIST-001`) |
| D-7 | **Unknown-future admission gate** (RC-020≡048) | Standing capability (RR-9) | Stage N; INV-20 umbrella if elected |

> Deferral is a governed disposition, **not** a gap. Each deferred item has an additive closure path of record;
> **0 true coverage gaps** (`UCOS-UC-0006`).

## 5. What MUST NEVER be changed (absolute — no waiver, no exception, no dev-exempt posture)

| # | Never-change law | Basis |
|:-:|------------------|-------|
| N-1 | **INV-1..INV-13** (contract-first, S1/S3/S4 non-waivable, deny-by-default, zero-trust, single-SoR, event-driven, horizontal-first, neutrality, static stability, append-only, secrets-by-reference, gated delivery, infinite extensibility) | `UCOS-ASR-NFR-001` |
| N-2 | **Non-waivable S1 (authn/authz) / S3 (secrets) / S4 (data protection)** on every exposed boundary, every tier, every environment, from first commit | AUTH-008; Const. Art. XII; INV-2 |
| N-3 | **Append-only / migration-only** — no ratified construct is ever deleted or destructively rewritten | IP-14; INV-10 |
| N-4 | **Single accountable ownership** and the **Authority-Board terminal authority** | AUTH-005/009 |
| N-5 | **Evolution-Fabric-only commit** — durable state changes only via the governed commit path (PI-6); no fabric holds an independent commit/rollback path | AD-0019 |
| N-6 | **The five prohibited substrate core directories** are never modified by any downstream fabric build (additive-only) | F-10 |
| N-7 | **Deny-by-default / fail-closed** — inability to prove an invariant halts or denies the operation | INV-3; INV-CORE fail-closed |
| N-8 | **Determinism on the commit path** — non-deterministic computation is quarantined behind the `EXIST-001` verifier gate; it never reaches a governed decision | INV-CORE-09; EX1; `EXIST-001` CRC-2 |

## 6. What requires GOVERNANCE approval (Trusted-vs-Approval boundary; governed but not Board-terminal)

Governed under **Approval-By-Exception** (`AUTH-009`, `PEP-020`, `AD-0009`). **Trusted Operations** proceed
autonomously with audit; **Governance-Approval Operations** require a governed gate/steward decision recorded
append-only, but are not Authority-Board-terminal:

- Passing the delivery gates `GATE-QUAL-001` / `GATE-SEC-001` / `GATE-DOC-001` / `GATE-REL-001`.
- Additive services realizing already-ratified contracts (contract-first, migration-only).
- Additive metadata/registry/configuration records (the five extension mechanisms).
- Environment promotion **ENV-DEV → ENV-INT → ENV-STAGE** (gate-bound, one-directional).
- Optional convergence work (Stage 6: `AUDIT-UNIV-001` / `AUTH-UNIV-001` / `LIFE-UNIV-001`; predicate vocab).
- Routine operational evolution (runbooks, dashboards, tighter-target upward revisions ≥1.0.1).

## 7. What requires AUTHORITY approval (Authority-Board-terminal; Approval-Required Operations, `AD-0009`)

These may be authorized **only** by the UCOS Authority Board at the required majority, recorded on `AUTH-012`:

| # | Authority-Approval Operation |
|:-:|------------------------------|
| A-1 | **Lifting `UCOS-CONSTRUCTION-BLOCKED`** / any **Article IX generation-lock release** (scoped or full) |
| A-2 | **Enrolling any invariant** (INV-CORE-12; revised INV-17/18 + C-EX9a/b; INV-14/16/19/20) — Constitutional Majority |
| A-3 | **Any scoped fabric construction authorization** (`AD-00xx`: Temporal, Intelligence, Simulation, Economic, Civilization) |
| A-4 | **New/changed ADR version** for a technology product (`ADR-001..007`; migration-only) |
| A-5 | **Loosening a class floor** or any change touching an INV-1..13 invariant (⇒ constitutional matter) |
| A-6 | **`AD-0014` disposition** (existential / civilization actuation scope) |
| A-7 | **Live provisioning / deployment / vendor binding / external-account creation / ENV-PROD** (real spend) |
| A-8 | **Rotation of high-blast-radius keys**; any downtime-inducing maintenance on AC-1 |
| A-9 | **Authority/custodian succession** and any `AUTH-012` ledger amendment |

> **Terminal-authority rule.** No agent, steward, or subordinate process may perform an A-1..A-9 operation. The
> agent specifies and prepares; the **Authority Board authorizes**; a **human executes** live/real-spend acts.

## 8. What constitutes COMPLETION (per-stage and program-level)

- **Stage completion:** a stage is COMPLETE when its **Exit Criteria** (`UCOS-RA-0006`) are met — outputs of
  record, acceptance criteria PASS, baseline green, 0 forward-dependency violation, 0 prohibited-core-dir change.
- **MCR completion (achieved):** Stages 0–5 realized (PI-2..PI-9; 269/269) — recorded of record; residual =
  independent attestation of PI-8/PI-9 (RR-1).
- **Foundation completion:** MCR + Stage 6 convergence (universal Audit/Authority/Lifecycle primitives adopted;
  RR-3/RR-4/UCC-7 closed) + Stage 7 enactment (INV-CORE-12 + `EXIST-001` CRC).
- **Realization completion:** every Mandatory item CLOSED, every Deferred item either built under a scoped
  release or explicitly held under `AD-0014`, and the terminal certificate re-issued (`UCOM-ULTIMATE-CERT-002`).
- **Program completion (ULTIMATE):** all terminal certification conditions **UCC-1..UCC-7** CLOSED within the
  INV-1..13 envelope.

## 9. What constitutes PRODUCTION READINESS (`UCOS-RA-0005`; UCC-4)

Production readiness is achieved when **all** hold, with live evidence of record:

| # | Production readiness criterion |
|:-:|--------------------------------|
| PR-1 | Durable/distributed adapters behind unchanged ports (SoR/cache/audit externalized); single-node ceiling removed (EA-B-P1-5) |
| PR-2 | Horizontal replication of the stateless kernel; deterministic decisions across replicas; **AC-1..AC-4** availability floors met (measured) |
| PR-3 | Multi-node federation partitioning operational; partition-tolerant (fail-closed); cross-node audit reconciles |
| PR-4 | Backup/restore proven; **DR drill executed**; measured **RPO-A ≤ 1 min / RTO-A ≤ 30 min** (and class B/C) |
| PR-5 | Observability **`PE-12` ADR decided** (UCC-6); RED/USE metrics, tracing, SLO burn-rate alerting; immutable operational audit |
| PR-6 | Performance floors met at rated tier (API read p99 ≤ 200 ms; write p99 ≤ 500 ms; registry/config p99 ≤ 20 ms) |
| PR-7 | **Operational Certification (UCC-4)** issued — G12-1 ∧ G12-2 ∧ G12-3 CLOSED with live evidence |
| PR-8 | S1/S3/S4 enforced identically across all environments; ENV-PROD released only by Authority-Board act (A-1/A-7) |

**Current status:** **NOT ACHIEVED** — single-node/in-memory; G12-1/2/3 OPEN; UCC-4 unachieved.

## 10. What constitutes CIVILIZATION READINESS (deferred; `AD-0014`)

Civilization readiness is a **separate, deliberately-deferred determination**, out of scope for the current
program and achievable only through governed enactment:

| # | Civilization readiness criterion |
|:-:|----------------------------------|
| CR-1 | **INV-CORE-12 (Non-Actuation) enrolled** before any autonomous/AI actor is authorized (propose-not-act) |
| CR-2 | Intelligence (PI-10), Simulation (PI-11), Economic (PI-13) fabrics built, ratified, and threat-clean under scoped releases |
| CR-3 | Temporal fabric (FAB-TIME) realized for relativistic/multi-frame/planetary operation |
| CR-4 | Existential invariants (INV-14..20) **enacted by the Authority Board** (`AUTH-013-AMD-001`; `EXIST-001`; INV-17↔INV-5 / INV-18↔INV-6 resolutions binding) |
| CR-5 | Civilization fabric (FAB-CIV) modeled **non-actuating**; actuation-boundary breach structurally closed |
| CR-6 | **`AD-0014` released** by the Authority Board for the specific civilization/existential scope |

**Current status:** **DEFERRED under `AD-0014`** — Conceptual/Research/Reference only; not blocking any lower
readiness state.

---

# PART II — IMPLEMENTATION COMMANDMENTS (positive imperatives)

1. **Build only what is authorized.** No stage builds before its predecessor exits and the Authority Board has
   authorized the scope (Article IX). *(N-4; A-1)*
2. **Contract first, always.** Define the versioned contract before the implementation; integrate only via
   published contracts. *(INV-1; P2)*
3. **Configure, do not hard-code.** Express variability as registry/metadata/configuration records. *(IP-04; CF-1)*
4. **Extend, never redesign.** Grow via the five extension mechanisms; a redesign need is a constitutional
   escalation. *(INV-13; C-EX1..5)*
5. **Commit only through Evolution.** All durable change flows through the governed commit path; deny-by-default,
   fail-closed. *(N-5; N-7)*
6. **Enforce S1/S3/S4 from the first commit**, on every boundary, tier, and environment. *(N-2)*
7. **Preserve determinism.** Quarantine non-deterministic computation behind the verifier gate; never place it on
   the commit path. *(N-8)*
8. **Keep the foundation stateless and horizontally scalable.** State lives behind ports in the single SoR. *(INV-7; INV-5)*
9. **Add, never delete.** Evolve append-only / migration-only; correct forward. *(N-3)*
10. **Attest independently.** Governance-integrity and ratification claims require independent evidence, never
    self-attestation. *(EA-B-P0-1/P0-2)*
11. **Enroll Non-Actuation before cognition.** No AI/autonomous actor is built before INV-CORE-12 is binding. *(D-2; CR-1)*
12. **Trace everything.** Every artifact links up to intent and down to realization; every decision is auditable. *(P5; INV-CORE-03)*
13. **Leave the substrate core untouched.** All new work is additive; the five core directories are never modified. *(N-6; F-10)*
14. **Prove readiness; never assume it.** Production and completion are earned by measured evidence and gates. *(P10)*

---

# PART III — IMPLEMENTATION PROHIBITIONS (absolute)

1. **No construction while `UCOS-CONSTRUCTION-BLOCKED` stands** or before the relevant Article IX release. *(A-1)*
2. **No modification of any INV-1..13 invariant, IP-01..17 principle, or a frozen (F-1..F-10) element** without a
   constitutional amendment. *(F; N-1)*
3. **No new requirement, RC class, or invariant introduced by implementation.** Requirements are frozen; enrollment
   is a Board act. *(A-2)*
4. **No shared mutable model / no second system-of-record per domain.** *(INV-1; INV-5)*
5. **No secret material in code, config, or artifacts.** Secrets by reference only. *(INV-11)*
6. **No plaintext transport, no permissive/dev-exempt security mode, no temporary S1/S3/S4 waiver.** *(N-2; INV-4)*
7. **No destructive change / no rollback-by-deletion.** *(N-3)*
8. **No modification of the five substrate core directories** by any fabric build. *(N-6)*
9. **No independent commit/rollback path** in any fabric; Evolution-Fabric-only. *(N-5)*
10. **No autonomous actuation** by any intelligence/simulation/economic/civilization fabric — propose-not-act. *(CR-1; INV-CORE-12)*
11. **No custom cryptography** — reuse the ratified federation primitives (Ed25519, hash-chained audit). *(security discipline)*
12. **No live provisioning, deployment, vendor binding, external-account creation, or ENV-PROD** by any agent;
    these are human-executed Approval-Required acts. *(A-7)*
13. **No self-attestation** substituting for independent adjudication/re-measurement. *(EA-B-P0-1/2)*
14. **No advancing a Deferred item** (temporal/intelligence/simulation/economic/civilization/existential) without
    its named gate and Board authorization. *(Part I §4)*
15. **No reopening of a foundational discussion** — the constitutional, requirements, governance, authority,
    invariant, and coverage baselines are frozen. *(Preamble sufficiency clause)*

---

# PART IV — IMPLEMENTATION SEQUENCING (the only lawful order)

Adopts the ratified, forward-dependency-free stage topology (`UCOS-IR-0006`; `UCOS-RA-0006`). **0 forward
dependencies; 0 REDESIGN.**

```
Stage 0  GATE  Governance-integrity restoration + execution authorization (open G0)   [no build]
                W1 (REAL-C-05 attestation + REAL-M-03 re-measurement)
                → W2 (REAL-C-01 → UCOM-ULTIMATE-CERT-002)
                → W3 (Authority-Board act lifts UCOS-CONSTRUCTION-BLOCKED)   ⇒ G0 = PASS
Stage 1  DONE  Substrate (Meta-Core)                     PI-2/3  (AD-0016)
Stage 2  DONE  Control plane                             PI-4    (AD-0017)
Stage 3  DONE  Governance core (Evolution/Audit/State)   PI-6    (AD-0019)
Stage 4  DONE  Federation                                PI-5    (AD-0018)
Stage 5  DONE  Core data primitives (Knowledge/Ontology/Memory)  PI-7/8/9  (attestation pending)
── Minimum Constitutional Runtime realized above; frontier below opens only on G0 = PASS ──
Stage 6  BUILD Primitive convergence (AUDIT/AUTH/LIFE-UNIV; predicate vocab)   [optional soundness]
Stage 7  ENACT Constitutional enactment (INV-CORE-12 Non-Actuation; EXIST-001 CRC)   [no build]
Stage 8  BUILD Temporal (FAB-TIME, T-1..T-7)
Stage 9  BUILD Intelligence (PI-10)   ⟵ HARD-GATED on Stage 7 (INV-CORE-12)
Stage 10 BUILD Simulation (PI-11)
Stage 11 BUILD Economic (PI-13)   ⟵ ledger restoration first (value-bearing)
Stage 12 BUILD Civilization (PI-12)   ⟵ held under AD-0014
Stage 13 BUILD Platform-factory catalog + scale-out → Operational Certification (UCC-4)
Stage N  BUILD Unknown-future admission (standing capability)
```

**Ordering laws:** (a) no stage begins before its predecessors exit; (b) **Stage 9 never precedes Stage 7**;
(c) **Stage 12 is gated on Stage 10 and `AD-0014`**; (d) every BUILD stage is additive, keeps the baseline green,
and changes no prohibited core directory; (e) **Production** is reached at Stage 13 via `UCOS-RA-0005`.

---

# PART V — CRITERIA

## V.1 Acceptance criteria (per work item)
A work item is **ACCEPTED** when: its outputs exist of record; its binary acceptance criterion
(`UCOS-RA-0002`/`0003`/`0005`/`0006`/`0007`) is TRUE; the baseline (`tsc` clean + all tests green) is preserved;
0 prohibited-core-dir change; S1/S3/S4 enforced; traceability intact (0 orphans); implementation leakage NONE.

## V.2 Completion criteria (per stage / program)
A stage is **COMPLETE** when its Exit Criteria (Part IV / `UCOS-RA-0006`) are met and recorded. The **program**
is COMPLETE (foundation) at MCR + Stage 6 + Stage 7; **realization-complete** when all Mandatory items close and
`UCOM-ULTIMATE-CERT-002` is issued; **ULTIMATE** when UCC-1..UCC-7 close within INV-1..13.

## V.3 Success criteria (program-level)
Every remaining realization item identified (`UCOS-RA-0001`); every dependency closed with 0 forward deps
(`UCOS-RA-0002`); every deferred fabric dispositioned (`UCOS-RA-0004`); every authorization blocker mapped and
closable (`UCOS-RA-0007`); every stage and acceptance criterion defined (`UCOS-RA-0006`); **0 REDESIGN, 0
constitutional change, 0 new requirement, 0 true coverage gap.**

## V.4 Failure criteria (any one halts the offending action — fail-closed)
An action **FAILS** (and must be halted, reverted forward, and escalated) if it: builds under a standing block or
without Board authorization (A-1); modifies a frozen/never-change element (F/N); introduces a new
requirement/RC/invariant by implementation; creates a shared mutable model or a second SoR; embeds a secret or a
permissive security mode; performs a destructive change; modifies a prohibited core directory; establishes an
independent commit path; enables autonomous actuation before INV-CORE-12; substitutes self-attestation for
independent evidence; advances a Deferred item without its gate; or fails any acceptance criterion (V.1). Failure
is **fail-closed**: the operation is denied, not partially applied.

---

# PART VI — CURRENT EXECUTION STATE & THE SINGLE PATH FORWARD

| State | Determination (`UCOS-RA-0008`) |
|-------|-------------------------------|
| Constitutional | **CERTIFIED (CONDITIONAL)** — fully realizable; 0 true gaps; attestation (RR-1) pending |
| Implementation | **MCR REALIZED** (Stages 0–5); frontier specified, 0 forward deps, gated on G0 |
| Production | **NOT ACHIEVED** — single-node; G12-1/2/3 open; UCC-4 unachieved |
| Civilization | **DEFERRED** — held under `AD-0014` |
| Execution authorization | **BLOCKED now (G0 = FAIL)**; **READY FOR EXECUTION on G0 = PASS via W1→W2→W3** |

**The single lawful path to begin construction:** **W1** (independent attestation `REAL-C-05` + re-measurement
`REAL-M-03`) → **W2** (re-issue terminal certificate `REAL-C-01` → `UCOM-ULTIMATE-CERT-002`) → **W3**
(Authority-Board act lifting `UCOS-CONSTRUCTION-BLOCKED`). None requires software. On **G0 = PASS**, Stages
6–13+N build in the order of Part IV.

---

## Scope discipline
No source code, schema, requirement, RC class, invariant, ADR, or authorization was produced or modified; no
attestation, re-measurement, certificate re-issue, or lock release was performed. INV-1..13, INV-14..20 (not
enrolled), `AUTH-012`, `AD-0014`, and the Article IX generation lock are unchanged; **`UCOS-CONSTRUCTION-BLOCKED`
stands.** Enrollment, lock release, and live execution are reserved to the UCOS Authority Board.

## Traceability
- **Consolidates:** `UCOS-REQ-0001..0006`, `UCOS-GAP-0001/0002`, `UCOS-AUTH-0001`, `UCOS-INV-0001`,
  `UCOS-AUDIT-0001..0004`, `UCOS-IR-0001..0008`, `UCOS-EA-0001..0004`, `UCOS-RA-0001..0008`.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001`, Governance Baseline 1.0.0, `UCOS-ASR-NFR-001` v1.0.1, `AD-0014`.
- **Governs:** all future implementation, migration, convergence, enactment, deployment, and certification work.
- **Owner:** UCOS Authority Board (terminal authority; custodian: Chief Authority Architect).

**END `UCOS-EXEC-0001` — EXECUTION CONSTITUTION · 10 GOVERNING DETERMINATIONS · 14 COMMANDMENTS · 15 PROHIBITIONS · STAGE 0..N SEQUENCING · ACCEPTANCE/COMPLETION/SUCCESS/FAILURE CRITERIA · INV-1..13 FROZEN · 0 NEW REQUIREMENT · 0 CONSTITUTIONAL CHANGE · 0 REDESIGN · LOCK NOT LIFTED · SUFFICIENT TO GOVERN ALL FUTURE IMPLEMENTATION.**
