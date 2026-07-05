# PCAMG-RUNTIME-0005 — Construction Authorization Package

> **GOVERNANCE DECISION MATERIALS ONLY**
> This package prepares the materials the UCOS Authority Board requires to adjudicate preconditions **PC-1**,
> **PC-2**, and **PC-3** from `PCAMG-RUNTIME-0004`. It **does not release Article IX**, **does not authorize
> construction**, **does not enroll the corpus**, generates no code, and modifies no doctrine. It drafts
> motions, votes, and criteria for a future Board session; nothing herein is self-executing.

| Field | Value |
|-------|-------|
| Artifact ID | `PCAMG-RUNTIME-0005` |
| Name | PCAMG Constitutional Governance Runtime — Construction Authorization Package |
| Repository / Branch / Base commit | UCOS / `pcamg-runtime-certification` / `65deb4cec70e22427212396b32678750035b069c` |
| Date | 2026-07-05 |
| Mode | **DECISION-MATERIALS PREPARATION ONLY** — no release, no authorization, no enrollment, no code, no doctrine change |
| Decision body | **UCOS Authority Board** (terminal authority; AUTH-009 §3; `UCOS-CONST-001` Art. IX/XII) |
| Custodian | Chief Authority Architect (AUTH-009 §6.3) |
| Inputs (read-only) | `PCAMG-RUNTIME-0003` (CERTIFIED WITH CONDITIONS); `PCAMG-RUNTIME-0003A` (FINDINGS CLOSED); `PCAMG-RUNTIME-0004` (AUTHORIZED WITH PRECONDITIONS); `PCAMG-RUNTIME-0001` §9/§10; `AUTH-REST-004` (AUTH-012 CLOSED v1.0.13); `AUTHORITY-BOARD-DECISION-RECORD` (Motion D-6); `AD-0023` (scoped-release precedent); `AUTH-008/009/012`; `UCOS-CONST-001` Art. IX; `UCOS-ART9-REL-001` |
| **Recommendation** | **APPROVE CONSTRUCTION AUTHORIZATION** (reference/advisory posture; enrollment-to-supremacy deferred) |

---

## 0. Adjudication Frame

`PCAMG-RUNTIME-0004` determined the runtime **AUTHORIZED WITH PRECONDITIONS**, with three outstanding —
each an **Approval-Required Operation** reserved to the Authority Board (AUTH-009 §6.4):

| PC | Precondition | SEQ stage | Class (AUTH-009) |
|:--:|--------------|:---------:|------------------|
| **PC-1** | Scoped `AUTH-012` construction authorization (new scoped AD) | SEQ-4 | Authority modification (Board) |
| **PC-2** | Article IX scoped release for the constitutional-governance path | SEQ-4 | Constitution-level lock release (Board; Art. IX/XII) |
| **PC-3** | Enrollment authorization (operative-supreme vs. reference-only) | SEQ-2 | Authority/Constitution posture (Board) |

**Already satisfied (not re-adjudicated here):** PC-4 authority-chain reconciliation (`AUTH-REST-004`), PC-5
independent constitutional review (`-0003`/`-0003A`), PC-6 doctrine-tier design-level validation.

**Governing procedure (AUTH-009 §9 change procedure):** propose via `AUTH-012` decision record → obtain
Authority Board approval → increment ledger version → update `AUTHORITY-INDEX`/coverage → flag downstream.
Every act is append-only (INV-10), audited (IP-10), traceable (IP-08), and enforces separation of duties
(PRIN-009: **proposer ≠ certifier ≠ ratifier**). Non-waivable **S1/S3/S4** (AUTH-008) may never be reduced.

---

## A. Construction Authorization Dossier (PC-1)

**Purpose.** Give the Board a complete, self-contained basis to enroll a **scoped construction-authorization
decision** for the PCAMG Constitutional Governance Runtime on the canonical `AUTH-012` ledger — modeled on
the AD-0016..0023 scoped-release acts (precedent: `AD-0023`).

**A.1 Proposed decision instrument.** A new scoped AD (next available `AUTH-012` sequence number; note
`AD-0024` is referenced for the anticipated PI-10 release, so the PCAMG runtime takes the next free slot —
provisionally cited here as **`AD-00NN`**, the number assigned by the Board at enrollment).

**A.2 Authorized scope (drafted; effective only if approved).**

| # | Increment | Authorized target | Realizes |
|:-:|-----------|-------------------|----------|
| G-A | PCAMG-RT | New modules under the **disambiguated** root `packages/platform-runtime/src/control/constitutional-governance/*` (NG-1): 11 governance registries, authority-resolution / principle-validation / governance-compiler / traceability / compliance engines, governance graph, hash-chained audit | `PCAMG-RUNTIME-0001` §1–§9; `SPEC-*` |
| G-B | PCAMG-RT | Additive tests under `test/` for RG-1..8, VR-*, CR-1..12, T-1/2/3/5, A-1..5, four-stage proof, fail-closed ordering, adversarial | `PCAMG-RUNTIME-0002` §10 |

**Allowed namespaces:** `constitutional-governance:*` (reserved for this fabric), disjoint from the existing
`governance:*` UCOS Governance Fabric (GOV-001/002/003) — NG-2/NG-3.

**A.3 Binding construction constraints (carry from `-0004` §B, CC-1..CC-11).** Additive-only; zero
prohibited-core-dir change; disambiguated namespace; baseline non-regression **≥ 443/443**; append-only;
fail-closed; determinism; canonical `CR-1..12`/`CE-*` catalog (no `CE-UNRESOLVED`); no-silent-activation;
Evolution-routed mutation; **pre-enrollment advisory** (ratified prevails; `PCAMG-7000` CR-8); construction
strictly within the released scope.

**A.4 Dossier completeness checklist.**

| Item | State |
|------|:-----:|
| Design certified (30/30 VPs) | ✅ `-0003` |
| Findings closed (F-01..F-04) | ✅ `-0003A` |
| Authorizability determined | ✅ `-0004` |
| Additivity + namespace resolved | ✅ NG-1..NG-4 |
| Baseline floor established (443/443) | ✅ `-0003A` |
| Authority chain reconciled | ✅ `AUTH-REST-004` |
| Scope + prohibited-scope drafted | ✅ A.2 / E.3 |

**PC-1 decision fields** — see **§F, Row PC-1**.

---

## B. Article IX Release Review Package (PC-2)

**Purpose.** Provide the Board the evidence and drafted instrument to conclude the **D-6 lock-release review**
to a **scoped Article IX release** for the constitutional-governance construction path — the single most
consequential act in this package. Modeled on `UCOS-ART9-REL-001` + `AD-0023` scope discipline.

**B.1 Current lock status.** Article IX generation lock is **ACTIVE**. `AUTHORITY-BOARD-DECISION-RECORD`
Motion **D-6** authorized *conducting* the release review ("APPROVED TO CONDUCT … lock ACTIVE"), explicitly
**not** the release. This package supplies the merits for that review to conclude.

**B.2 Scope of release (drafted; narrow, additive, reversible).**

- **Released activity (and only this):** additive construction under
  `src/control/constitutional-governance/*` + additive tests, per §A.2, under CC-1..CC-11.
- **Remains LOCKED (unchanged):** all prohibited core dirs (`meta-core`, `registry-runtime`,
  `metadata-runtime`, `configuration-runtime`, `contracts`); existing `src/control/governance/*` UCOS
  Governance Fabric behavior; any activation/supremacy/enrollment operation; production deployment; any
  Ω∞ / INV-14..20 scope (**AD-0014 stands**); any generation beyond §A.2.

**B.3 Risk-owner acceptance (required for release; drafted).**

| Risk domain | Risk owner (role) | Acceptance basis |
|-------------|-------------------|------------------|
| Constitutional integrity | Chief Authority Architect | IM-1..IM-13 preserved (§E) |
| Security (S1/S3/S4) | Security authority (AUTH-008) | Non-waivable set preserved; deny-by-default |
| Substrate integrity | Platform authority | Zero prohibited-core-dir change; ≥443/443 |
| Evolution/audit | Evolution & Audit authority | Evolution-routed mutation; hash-chained audit |

**B.4 Release preconditions (all met before this review may conclude to release).**

| Ref | Precondition | State |
|-----|--------------|:-----:|
| D-6 | Release review authorized to convene | ✅ |
| PC-4 | Authority chain reconciled (AUTH-012 CLOSED) | ✅ |
| PC-5 | Independent constitutional review complete | ✅ |
| REL-scope | Explicit authorized/prohibited-activity scope drafted | ✅ (B.2) |
| REL-risk | Risk-owner acceptance recorded | ⧗ Board session (B.3) |
| REL-SoD | proposer ≠ certifier ≠ ratifier assigned | ⧗ Board session |

**B.5 Revocation clause (drafted).** `UCOS-ART9-REL-001` §6 applies: any construction outside §B.2 — any
core-dir modification, any change to the existing Governance Fabric behavior, any activation/supremacy act,
any custom cryptography, any Ω∞ scope — **voids the act and re-imposes the full lock**.

**PC-2 decision fields** — see **§F, Row PC-2**.

---

## C. Enrollment Readiness Assessment (PC-3)

**Purpose.** Frame the **enrollment posture decision**: whether the constructed runtime is built as an
**operative-supreme** governance layer (full enrollment; Program A-1/A-2/A-5) or as a **reference/advisory
framework** (construction proceeds; supremacy/activation deferred).

**C.1 Current status.** Corpus **PROPOSED / NOT ENROLLED**. No A-1..A-5 enrollment acts recorded. Ratified
`UCOS-CONST-001` prevails pre-enrollment (`PCAMG-7000` CR-8).

**C.2 Two admissible postures.**

| Posture | Meaning | Effect on construction | Activation/supremacy (C-10/C-11/C-13 in `-0004`) |
|---------|---------|------------------------|---------------------------------------------------|
| **P-REF (recommended)** | Build as **reference/advisory**, non-supreme; PCAMG governance advisory; ratified prevails | **Proceeds** additively under PC-1/PC-2 | Remain **NOT AUTHORIZED**; deferred to a later enrollment/ratification act |
| **P-SUP** | Enroll PCAMG as **operative-supreme** | Requires full A-1/A-2/A-5 + ratification **before** activation | Would require ratification (SEQ-3) before any activation |

**C.3 Readiness.** For **P-REF**, enrollment readiness is **NOT REQUIRED** for construction — the runtime is
built advisory and coexists (dual-read; ratified prevails). For **P-SUP**, readiness is **NOT MET** (no
enrollment/ratification acts; would be a separate, later decision chain). **Recommendation: adopt P-REF** so
construction may proceed while supremacy is deferred to a distinct future determination.

**C.4 Separability.** PC-3 as **P-REF** is a *posture declaration*, not an enrollment-to-supremacy act; it
does not enroll principles, confer sovereignty, or supersede ratified doctrine. It is compatible with "do not
enroll the corpus."

**PC-3 decision fields** — see **§F, Row PC-3**.

---

## D. Risk Assessment

| ID | Risk | Likelihood | Impact | Mitigation | Residual |
|----|------|:----------:|:------:|------------|:--------:|
| RK-1 | Premature construction ahead of a concluded release | Low | High | Fail-closed gating; construction only after PC-1+PC-2 enrolled; this package authorizes nothing | **Low** |
| RK-2 | Namespace/import collision with existing Governance Fabric | Low | Med | NG-1..NG-4 disambiguated root; no co-location; no bare `governance-registry.ts` reuse | **Very Low** |
| RK-3 | Baseline regression during construction | Low | Med | CC-3 non-regression ≥443/443; additive-only; core dirs frozen | **Low** |
| RK-4 | Premature supremacy / hierarchy inversion | Low | High | P-REF advisory posture; `PCAMG-7000` CR-8 (ratified prevails); activation NOT AUTHORIZED | **Low** |
| RK-5 | Silent activation of governance without proof | Very Low | High | A-5 no-silent-activation; activation confined to compliance runtime; CC-8 | **Very Low** |
| RK-6 | Compiler catalog drift re-emerging | Very Low | Med | CC-7 canonical `CR-1..12`/`CE-*` in force (F-01 closed) | **Very Low** |
| RK-7 | Article IX over-broad release | Low | High | B.2 narrow scope; B.5 void-on-breach revocation; risk-owner acceptance (B.3) | **Low** |
| RK-8 | Ω∞ / INV-14..20 scope creep | Very Low | High | AD-0014 stands; INV-14..20 remain unenrolled (IM-11) | **Very Low** |
| RK-9 | Enrollment-decision ambiguity | Med | Low | PC-3 resolved as explicit P-REF posture (C.2) | **Low** |

**Risk posture:** **LOW–CONTAINED.** All high-impact risks carry strong, pre-committed mitigations; the
dominant control is that no act in this package is self-executing.

---

## E. Constitutional Impact Assessment

**E.1 Immutable invariants (from `-0004` §C) — impact of approving PC-1/PC-2 under P-REF.**

| Invariant | Impact | Preserved? |
|-----------|--------|:----------:|
| IM-1 Principle supremacy | Advisory-only until enrollment; ratified prevails | ✅ |
| IM-2/3/4 Sovereignty origin / human terminal / no exec-AI-org sovereignty | Untouched | ✅ |
| IM-5 No absolute / circular authority | Acyclic runtime; no new absolute authority | ✅ |
| IM-6 Non-waivable S1/S3/S4 | Preserved; deny-by-default enforced | ✅ |
| IM-7 Append-only (INV-10) | Enforced by registries/audit | ✅ |
| IM-8 Tamper-evident audit | Hash-chained audit constructed | ✅ |
| IM-9 Determinism (INV-6) | Reproducible hashes | ✅ |
| IM-10 Single-owner / SoD | Enforced (PRIN-005/009) | ✅ |
| IM-11 INV-1..13 unchanged; INV-14..20 NOT enrolled; AD-0014 intact | No existential scope | ✅ |
| IM-12 Article IX released only by explicit scoped act | This package prepares; Board enacts | ✅ (prepared, not released) |
| IM-13 Ratified corpus unmodified; prevails pre-enrollment | Advisory coexistence | ✅ |

**E.2 Hierarchy & precedence (AUTH-009 §6.1/§6.2).** Approving construction under P-REF introduces a new,
lower-tier **advisory** control fabric; it does not reorder the Authority > Constitution > Architecture chain
and cannot override a higher tier. No precedence inversion.

**E.3 What approval does and does not do.**

| Approval of PC-1 + PC-2 (P-REF) **does** | Approval **does not** |
|------------------------------------------|-----------------------|
| Permit additive construction under a narrow scoped release | Enroll PCAMG or confer supremacy |
| Bind construction to CC-1..CC-11 | Activate any governance (A-5 gate holds) |
| Keep ratified corpus authoritative | Release Article IX beyond §B.2 |
| Preserve IM-1..IM-13, S1/S3/S4, AD-0014 | Touch prohibited core dirs or INV-14..20 |

**Constitutional impact: CONTAINED AND REVERSIBLE.** No immutable invariant is weakened; the release is
narrow and void-on-breach; supremacy remains deferred.

---

## F. Authority Decision Matrix

For each precondition: Current Status · Evidence · Required Authority · Required Vote · Required Motion ·
Approval Criteria · Rejection Criteria · Consequences.

### Row PC-1 — Scoped `AUTH-012` Construction Authorization

| Field | Content |
|-------|---------|
| **Current Status** | PENDING (no construction AD enrolled) |
| **Evidence** | `-0003` (certified), `-0003A` (findings closed), `-0004` (authorized w/ preconditions), `AUTH-REST-004` (AUTH-012 CLOSED), §A dossier |
| **Required Authority** | UCOS Authority Board (terminal; AUTH-009 §3/§6.4) — an Authority modification, Approval-Required |
| **Required Vote** | Authority Board **Constitutional-Majority quorum** (per `PROG-MIGRATION-AND-ADOPTION` P-4 / AUTH-009), with **SoD** (proposer ≠ certifier ≠ ratifier) |
| **Required Motion** | *"That the Authority Board enroll a scoped construction-authorization decision (`AD-00NN`) on the AUTH-012 ledger authorizing additive construction of the PCAMG Constitutional Governance Runtime under scope §A.2 and constraints CC-1..CC-11, conditional on PC-2."* |
| **Approval Criteria** | Scope §A.2 accepted; CC-1..CC-11 accepted as binding; namespace NG-1..NG-4 accepted; baseline floor 443/443 accepted; SoD roles assigned; conditional on PC-2 release |
| **Rejection Criteria** | Any prohibited-core-dir touch in scope; namespace not disambiguated; baseline floor not asserted; SoD unmet; unresolved F-01..F-04 (n/a — closed) |
| **Consequences** | **Approve →** AD enrolled; construction constructible once PC-2 concludes. **Reject →** runtime remains design-only (SEQ-1); no construction; corpus unaffected |

### Row PC-2 — Article IX Scoped Release Authorization

| Field | Content |
|-------|---------|
| **Current Status** | PENDING (lock ACTIVE; D-6 review authorized to convene, not concluded) |
| **Evidence** | `AUTHORITY-BOARD-DECISION-RECORD` D-6; `UCOS-CONST-001` Art. IX/XII; `UCOS-ART9-REL-001`; `AD-0023` precedent; §B package |
| **Required Authority** | UCOS Authority Board (terminal; Constitution Art. IX/XII) — Constitution-level lock release, Approval-Required (highest class) |
| **Required Vote** | Authority Board **Constitutional-Majority quorum** with **explicit authorized/prohibited-activity scope** + **risk-owner acceptance** (B.3) + **SoD**; conclusion of the D-6 review on the merits |
| **Required Motion** | *"That the Authority Board conclude the Condition C-6 / Motion D-6 review and enact a scoped Article IX release limited to additive construction under `src/control/constitutional-governance/*` per scope §B.2, with revocation clause §B.5; all other generation remains LOCKED and AD-0014 stands."* |
| **Approval Criteria** | Narrow scope §B.2 accepted; risk owners (B.3) accept; revocation §B.5 accepted; IM-1..IM-13 confirmed preserved; S1/S3/S4 preserved; SoD met |
| **Rejection Criteria** | Scope broader than §B.2; any risk owner declines; AD-0014/INV-14..20 implicated; S1/S3/S4 weakened; SoD unmet; core-dir modification in scope |
| **Consequences** | **Approve →** narrow lock release effective; construction may proceed (with PC-1). **Reject →** lock remains ACTIVE; runtime not constructible; design-only state persists |

### Row PC-3 — Enrollment Authorization (Posture)

| Field | Content |
|-------|---------|
| **Current Status** | PENDING (corpus PROPOSED / NOT ENROLLED) |
| **Evidence** | `PROG-MIGRATION-AND-ADOPTION` A-0..A-7; `-0003A` SEQ-1..SEQ-5; §C assessment |
| **Required Authority** | UCOS Authority Board (Authority/Constitution posture; AUTH-009 §6.4) |
| **Required Vote** | **P-REF (recommended):** Constitutional-Majority quorum — posture declaration only. **P-SUP:** Constitutional-Majority + full A-1/A-2/A-5 enrollment chain + later ratification (SEQ-3) |
| **Required Motion** | *"That the Authority Board declare the enrollment posture for the PCAMG runtime as **reference/advisory (P-REF)** — construction proceeds advisory, ratified corpus prevails, and enrollment-to-supremacy is deferred to a separate future determination."* |
| **Approval Criteria (P-REF)** | Advisory posture accepted; ratified prevails (`PCAMG-7000` CR-8); activation/supremacy explicitly deferred; no principle enrolled |
| **Rejection Criteria** | Board requires operative-supremacy before construction (elects P-SUP) → construction waits on full enrollment + ratification; or defers PC-3 entirely (blocks P-REF construction posture) |
| **Consequences** | **Approve P-REF →** construction proceeds advisory; supremacy deferred. **Elect P-SUP →** construction gated on enrollment+ratification. **Reject/defer →** construction posture undefined; PC-1/PC-2 held |

### Decision dependency

```
PC-3 (posture = P-REF)  ─┐
PC-1 (scoped construct AD) ─┼─▶ conditional on ─▶ PC-2 (Article IX scoped release)  ─▶ Construction (SEQ-5)
                          ─┘        (PC-1 is enrolled conditional on PC-2 concluding to RELEASE)
```

PC-2 is the gating act; PC-1 is enrolled conditional on it; PC-3 (as P-REF) sets the posture under which
construction proceeds. Activation/supremacy (C-10/C-11/C-13 in `-0004`) remain **NOT AUTHORIZED** under
P-REF and require a later, separate enrollment/ratification determination.

---

## Final Recommendation

The design is certified (`-0003`), remediated (`-0003A`), and determined authorizable with named,
achievable preconditions (`-0004`). The authority chain is reconciled and `AUTH-012` is CLOSED; the release
scope is narrow, additive, reversible, and void-on-breach; every immutable invariant (IM-1..IM-13), the
non-waivable S1/S3/S4 set, and the AD-0014 Ω∞ boundary are preserved; supremacy remains deferred under the
recommended reference/advisory posture. No design deficiency, constitutional violation, or invariant conflict
bars construction — only three Board acts do, and this package furnishes each.

> ## RECOMMENDATION: APPROVE CONSTRUCTION AUTHORIZATION

**Recommended Board disposition:**
1. **PC-3** — declare posture **P-REF** (reference/advisory; supremacy deferred).
2. **PC-1** — enroll scoped construction AD (`AD-00NN`) under scope §A.2 and constraints CC-1..CC-11,
   **conditional on PC-2**.
3. **PC-2** — conclude the D-6 review to a **narrow scoped Article IX release** per §B.2 with revocation §B.5.

Activation, supremacy, and enrollment-to-operative remain **reserved for a separate future determination**;
they are not recommended for approval in this session.

**Scope discipline of this package:** Article IX **not** released; construction **not** authorized; corpus
**not** enrolled. Governance decision materials prepared only; all acts remain for the Authority Board to
enact under AUTH-009 §9 with SoD and full audit.

---

## Package Provenance

| Item | Value |
|------|-------|
| Repository / Branch / Base commit | UCOS / `pcamg-runtime-certification` / `65deb4cec70e22427212396b32678750035b069c` |
| Preconditions prepared | PC-1 (dossier §A), PC-2 (release package §B), PC-3 (posture §C) |
| Preconditions already satisfied | PC-4 (`AUTH-REST-004`), PC-5 (`-0003`/`-0003A`), PC-6 (SEQ / doctrine tier) |
| Precedent instrument | `AD-0023` (scoped Article IX release) |
| Governing procedure | AUTH-009 §9; AUTH-012 ledger; PRIN-009 SoD; AUTH-008 S1/S3/S4 |
| Sections produced | A–F + Authority Decision Matrix (8 fields × 3 preconditions) |
| Recommendation | **APPROVE CONSTRUCTION AUTHORIZATION** (P-REF; supremacy deferred) |

**END PCAMG-RUNTIME-0005 — CONSTRUCTION AUTHORIZATION PACKAGE · DECISION MATERIALS ONLY · ARTICLE IX NOT RELEASED · CONSTRUCTION NOT AUTHORIZED · CORPUS NOT ENROLLED · APPEND-ONLY.**
