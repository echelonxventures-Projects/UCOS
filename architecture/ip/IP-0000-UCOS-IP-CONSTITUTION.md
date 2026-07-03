# IP-0000 — UCOS Intellectual Property Constitution

**Program:** IP-0000 — Intellectual Property Governance Framework
**Artifact ID:** `IP-0000`
**Artifact family:** `IP-*`
**Location:** `architecture/ip/`
**Mode:** DESIGN ONLY — NO IMPLEMENTATION · NO CODE · NO REPOSITORY MUTATION (of ratified artifacts) · NO LOCK RELEASE · NO INVARIANT ENROLLMENT
**Status:** CREATED — DESIGN — READY FOR AUTHORITY BOARD REVIEW
**Doctrine:** **Patent-First · IP-First · Research-First · Trade-Secret-Aware**
**Relates to:** AUTH-002 (Constitution) · AUTH-008 (Security Canon; S1/S3/S4/S6) · AUTH-009 (Governance/Authority hierarchy) · AUTH-012 (Decision Log) · `AUDIT-UNIV-001` (Universal Audit primitive) · PI-6 Evolution (sole durable-commit path, AD-0019) · PI-4 Control Plane (deny-by-default)
**Companion deliverables:** `IP-0001` (Invention Taxonomy) · `IP-0002` (Patent Candidate Registry Spec) · `IP-0003` (Trade Secret Registry Spec) · `IP-0004` (Patentability Assessment Framework) · `IP-0005` (IP Governance Model)
**Date:** 2026-07-02

> **Governing disclaimer.** This is a governed **design/specification** artifact. It writes no source code,
> releases no lock, enrolls no invariant, mutates no ratified artifact, and confers no legal authority. Nothing
> here constitutes legal advice or a legal opinion; all patentability, freedom-to-operate, and trade-secret
> determinations described are **process designs** requiring qualified IP counsel to execute. This Constitution
> is subordinate to the UCOS Constitution (AUTH-002), the Security Canon (AUTH-008), and the Authority hierarchy
> (AUTH-009). Any durable governance action it describes is committed **only** through the Evolution Fabric
> (AD-0019). `UCOS-CONSTRUCTION-BLOCKED` and the Article IX generation lock are unchanged by this document.

---

## Preamble

UCOS is not merely software; it is an accumulating body of **invention**. Every fabric, every primitive, every
governance mechanism, every deterministic verifier, every registry-driven abstraction is a potential act of
creation with defensible, ownable value. This Constitution establishes that UCOS shall be built **Patent-First,
IP-First, Research-First, and Trade-Secret-Aware** — meaning intellectual-property consideration is not an
afterthought bolted on before a filing deadline, but a **first-class concern woven into the development lifecycle
itself**, governed with the same rigor, traceability, and immutability as security and architecture.

The purpose of this Constitution is to make UCOS's intellectual property **identifiable, capturable, assessable,
protectable, and defensible** — automatically, continuously, and by construction — while never accidentally
disclosing, forfeiting, or diluting it.

---

## 1. UCOS IP Vision

### 1.1 Vision statement

> *UCOS shall convert its own act of creation into a continuously-growing, defensible intellectual-property
> estate — such that every meaningful invention is captured at the moment of conception, assessed for
> patentability and secrecy value, protected against premature disclosure, and marshalled into patent families
> and trade-secret holdings that together form durable competitive moats.*

### 1.2 The four doctrines

| Doctrine | Meaning | Primary consequence |
|----------|---------|---------------------|
| **Patent-First** | When a novel, non-obvious, useful invention is detected, the **default posture is to preserve patentability** (file or protect-then-file) before any act that could bar it. | Disclosure gates precede publication; a novelty clock starts at conception. |
| **IP-First** | IP status is a **first-class attribute** of every artifact, decision, and capability — recorded, traced, and reviewed like security classification. | Every artifact carries an IP classification; the IP registry is authoritative. |
| **Research-First** | Invention is grounded in **documented research**: prior-art landscape, problem framing, and evidence of the inventive step are captured as they happen. | Prior-art governance and research provenance are mandatory inputs to any candidate. |
| **Trade-Secret-Aware** | Not everything should be patented; some inventions are more valuable **kept secret**. Every candidate is triaged patent-vs-secret **before** disclosure. | A secrecy-value assessment runs in parallel with patentability; deny-by-default on disclosure. |

### 1.3 Vision tenets

- **VT-1 — Capture at conception.** The right moment to capture an invention is when it is conceived, not when a
  deadline looms. Capture is cheap; reconstruction is expensive and lossy.
- **VT-2 — Protect before disclose.** No consequential disclosure (publication, external demo, open-source push,
  conference talk) occurs before the invention's IP posture has been adjudicated (deny-by-default).
- **VT-3 — Evidence, not assertion.** An invention's novelty, inventive step, and reduction-to-practice are
  established by **recorded evidence** (research, prior-art search, design rationale), never by claim alone.
- **VT-4 — Portfolio, not point solutions.** Individual inventions are marshalled into **patent families** and
  **trade-secret holdings** that reinforce one another to form moats.
- **VT-5 — Provable and immutable.** IP records are append-only, hash-chained, and independently auditable
  (reusing `AUDIT-UNIV-001`), so the invention date, inventor, and conception evidence are tamper-evident.
- **VT-6 — Counsel-in-the-loop.** All legally-operative determinations are made or ratified by qualified IP
  counsel; the framework **prepares** and **governs**, it does not substitute for legal judgment.

### 1.4 What success looks like

A UCOS in which: every commit-worthy invention has a captured **Invention Disclosure Record (IDR)**; every IDR is
triaged into *patent-track*, *secret-track*, *defensive-publication-track*, or *no-action* with recorded
rationale; no invention is ever lost to accidental disclosure; and the resulting estate is a navigable portfolio
of patent families and trade-secret holdings mapped to competitive moats. Section 20 defines the metrics.

---

## 2. Patent-First Development Model

### 2.1 Principle

**Patentability is preserved by default.** The development lifecycle is instrumented so that the *act of creating*
generates the *signal of invention*, and that signal is captured and protected **before** any disclosure event
can bar a patent. Patent-First does not mean "patent everything" — it means "never lose the *option* to patent by
accident."

### 2.2 The Patent-First loop (design)

```
   create ──▶ detect ──▶ capture ──▶ triage ──▶ protect ──▶ marshal
   (design/    (invention  (IDR)      (patent/   (file or    (family/
    build)      signal)                secret/    seal)        portfolio)
                                       publish/
                                       none)
        │                                              ▲
        └──────── disclosure gate (deny-by-default) ───┘
                  (no disclosure until triage + protect adjudicated)
```

Every arrow is auditable; the **disclosure gate** is the load-bearing control: nothing that could constitute a
public disclosure or a statutory bar proceeds until the invention has been triaged and its protection posture
decided.

### 2.3 Development-lifecycle integration points

| Lifecycle moment | IP action (design) | Control |
|------------------|--------------------|---------|
| Design proposal / spec authored | Auto-scan for invention signals (novel mechanism, non-obvious combination) | Invention detection (§3.3, IP-0001) |
| Design review | IP triage question mandatory ("is there an invention here?") | Innovation Review Board intake (§13) |
| Pre-publication / pre-open-source | **Disclosure gate**: block until IP posture adjudicated | Disclosure governance (§10), deny-by-default |
| External demo / talk / paper | Publication gate: confirm protection posture | Publication governance (§11) |
| Capability ratification | IP classification attached to the ratified capability | IP-First classification (§9) |

### 2.4 Default postures (deny-by-default)

- **DP-1.** Absent an adjudicated IP posture, an artifact is treated as **potentially patentable and
  confidential** — disclosure is denied.
- **DP-2.** Absent an explicit "publish/open-source" ratification, code and designs are **not** externally
  disclosed.
- **DP-3.** Absent an explicit secrecy waiver, invention evidence is **confidential** and access-controlled (S4).
- **DP-4.** A novelty-barring event (public use, sale, printed publication) is **never** initiated by an automated
  process; it requires an explicit, audited human authorization.

### 2.5 Relationship to Research-First

Patent-First rests on Research-First: a defensible patent requires documented novelty and inventive step.
Therefore prior-art governance (§7), novelty assessment (§8), and research provenance are **preconditions** to a
patent-track decision, not follow-ups.

---

## 3. Invention Lifecycle

### 3.1 Lifecycle states

```
 CONCEIVED ─▶ CAPTURED ─▶ ASSESSED ─▶ TRIAGED ─┬─▶ PATENT_TRACK ─▶ (see §4 Patent Candidate Lifecycle)
                                                ├─▶ SECRET_TRACK ─▶ (see §6 Trade Secret Governance)
                                                ├─▶ DEFENSIVE_PUBLICATION
                                                └─▶ NO_ACTION (with rationale)
        │                                                    │
        └────────── ABANDONED (with recorded rationale) ◀────┘
```

| State | Meaning | Entry condition |
|-------|---------|-----------------|
| **CONCEIVED** | An invention signal exists (human-flagged or auto-detected). | Detection event (§3.3). |
| **CAPTURED** | An Invention Disclosure Record (IDR) exists with minimum evidence. | IDR completeness (§3.4). |
| **ASSESSED** | Novelty + patentability + secrecy-value assessed. | §8, §6.4 assessments recorded. |
| **TRIAGED** | A protection posture is decided by the Review Board. | §13 decision recorded. |
| **PATENT_TRACK / SECRET_TRACK / DEFENSIVE_PUBLICATION / NO_ACTION** | Terminal routing states. | Board decision + rationale. |
| **ABANDONED** | Explicitly dropped, with recorded reason (never silent). | Board decision. |

### 3.2 Lifecycle invariants

- **IL-1.** No invention leaves `CONCEIVED` without a **capture** (no lost inventions).
- **IL-2.** No invention reaches a terminal track without a **recorded rationale** (no unexplained routing).
- **IL-3.** State transitions are **append-only events** in the IP audit ledger (reuse `AUDIT-UNIV-001`).
- **IL-4.** The **conception date** and **inventor(s)** are recorded at capture and are immutable thereafter
  (critical for priority).
- **IL-5.** Disclosure is **gated** across the entire lifecycle until triage completes (deny-by-default).

### 3.3 Invention detection (design)

Two complementary detection paths:

1. **Human-flagged.** Any contributor may raise an invention signal against an artifact (design, spec, module,
   verifier, mechanism). This is the primary, authoritative path.
2. **Assisted detection.** Design-level heuristics surface *candidate* signals for human confirmation — e.g. a
   novel combination of known primitives, a non-obvious algorithmic step, a first-of-kind governance mechanism,
   a novel deterministic-verification technique. Assisted detection **never auto-files and never auto-discloses**;
   it only proposes a signal for Board intake. (Taxonomy of signals: IP-0001.)

### 3.4 Invention Disclosure Record (IDR) — minimum evidence

An IDR is the capture artifact. Minimum fields (schema detailed in IP-0002):

- Title; problem addressed; the inventive idea in plain language.
- Inventor(s) and contributor(s); **conception date**; **reduction-to-practice** status/date.
- What is novel; why it is non-obvious; closest known art (initial pointers).
- Enabling description sufficient for a person skilled in the art.
- Related UCOS artifacts (traceability); classification (S4); provenance.

### 3.5 Lifecycle governance

The Invention Lifecycle is owned by the **Innovation Review Board** (§13). Every transition is a governance
consequence committed via Evolution (AD-0019) and audited. Legally-operative steps (filing, deliberate
disclosure, abandonment that forfeits rights) require IP counsel sign-off.

---

## 4. Patent Candidate Lifecycle

### 4.1 States

```
 CANDIDATE ─▶ PRIOR_ART_CLEARED ─▶ DRAFTING ─▶ READY_TO_FILE ─▶ FILED(provisional)
     ─▶ FILED(non-provisional/PCT) ─▶ PROSECUTION ─▶ GRANTED ─▶ MAINTAINED
                    │                                    │
                    ├─▶ ABANDONED (rationale)            └─▶ LAPSED (rationale)
                    └─▶ CONVERT_TO_SECRET (if disclosure-risk favors secrecy)
```

| State | Meaning |
|-------|---------|
| **CANDIDATE** | Routed to patent-track by the Board (from §3). |
| **PRIOR_ART_CLEARED** | Prior-art search + novelty assessment support patentability (§7, §8). |
| **DRAFTING** | Claims + specification drafted (with counsel). |
| **READY_TO_FILE** | Counsel-approved; filing authorized. |
| **FILED** | Provisional / non-provisional / PCT filed; priority date fixed. |
| **PROSECUTION** | Under examination; office actions handled. |
| **GRANTED / MAINTAINED** | Issued; maintenance fees tracked. |
| **ABANDONED / LAPSED / CONVERT_TO_SECRET** | Terminal, each with recorded rationale. |

### 4.2 Candidate invariants

- **PC-1.** No `FILED` without `PRIOR_ART_CLEARED` **and** counsel approval (deny-by-default).
- **PC-2.** The **priority date** is captured immutably at filing and linked to the IDR conception date.
- **PC-3.** Every state change is audited; deadline-bearing states (provisional→non-provisional 12-month clock,
  PCT national-phase, maintenance windows) carry **deadline records** with escalation (§19 risk).
- **PC-4.** A candidate may **convert to secret** only before any barring disclosure and with recorded rationale.
- **PC-5.** Abandonment/lapse is never silent; forfeiture of rights requires counsel-acknowledged rationale.

### 4.3 Deadlines & clocks (design)

Every patent candidate carries a **clock model**: conception date, first-disclosure date (if any), grace-period
window (jurisdiction-dependent), provisional filing date + 12-month conversion deadline, PCT 30/31-month national
phase, and maintenance-fee schedule. Clocks are data (registry-driven), monitored, and escalated (§19). Legal
interpretation of any clock is counsel's; the framework tracks and warns.

### 4.4 Registry

The Patent Candidate Registry (IP-0002) is the authoritative, append-only store of candidates, their states,
evidence, clocks, and family membership.

---

## 5. Patent Family Architecture

### 5.1 Purpose

Individual patents are weak; **families** are strong. A patent family groups related inventions (continuations,
divisionals, continuations-in-part, foreign counterparts, and thematically-linked filings) so that a competitive
capability is protected by **overlapping, mutually-reinforcing claims** rather than a single point of failure.

### 5.2 Family model (design)

```
Patent Family (theme / moat)
 ├─ Anchor filing (broadest independent claims)
 ├─ Continuation(s)      (pursue additional claim scope)
 ├─ Divisional(s)        (restriction-driven splits)
 ├─ CIP(s)               (new matter building on anchor)
 ├─ Foreign counterparts (PCT national phase; key jurisdictions)
 └─ Related candidates   (thematically linked, cross-cited)
```

| Family attribute | Description |
|------------------|-------------|
| `familyId` | Stable identifier for the family/theme. |
| `moatRef` | The competitive moat (§7 of IP-0005 / §5.4) this family defends. |
| `anchor` | The anchor candidate/patent. |
| `members[]` | Candidates/patents and their relationship (continuation/divisional/CIP/foreign/related). |
| `claimMap` | Which claims cover which UCOS capability/mechanism (traceability). |
| `jurisdictions[]` | Where protection is sought/held. |
| `strength` | Assessed defensive/offensive strength (metrics, §20). |

### 5.3 Family strategy principles

- **PF-1.** Group by **defended capability/moat**, not by filing convenience.
- **PF-2.** Maintain at least one **broad anchor** plus **narrow picket** claims where strategy warrants.
- **PF-3.** Map every family to specific UCOS capabilities (traceability to the capability catalog).
- **PF-4.** Track foreign filing decisions against a cost/benefit and jurisdiction-priority model.
- **PF-5.** Continuations keep families **alive** to capture later-emerging claim scope.

### 5.4 Moats

A **competitive moat** is a defended position that is hard for competitors to replicate or design around. UCOS
moats are enumerated and each is backed by a family (and/or trade-secret holding). Moat design is detailed in
IP-0005; the family architecture is the patent-side instrument that realizes a moat.

---

## 6. Trade Secret Governance

### 6.1 Principle (Trade-Secret-Aware)

Some inventions are worth **more kept secret** than patented — because patents disclose, expire, and can be
designed around, whereas a well-protected secret can endure indefinitely and reveals nothing. **Every invention
is triaged patent-vs-secret before any disclosure.** Deny-by-default: unclassified invention evidence is treated
as a trade secret and access-controlled.

### 6.2 Patent-vs-secret decision factors (design)

| Favors PATENT | Favors TRADE SECRET |
|---------------|---------------------|
| Detectable in a competitor's product (infringement is provable) | Not detectable / not reverse-engineerable from the product |
| Likely to be independently invented / published soon | Hard to independently invent; durable advantage |
| Value from exclusion + licensing | Value from secrecy + first-mover execution |
| Standards/interoperability leverage | Process/know-how that never ships externally |
| Finite useful life ≤ patent term | Useful life ≫ patent term |

The decision is recorded per invention with rationale (§13 Board).

### 6.3 Trade-secret protection requirements (design)

To qualify and remain a protectable trade secret, the framework requires **reasonable measures**:

- **TS-1.** **Identification & registration** in the Trade Secret Registry (IP-0003) — you cannot protect what you
  have not identified.
- **TS-2.** **Access control (need-to-know)** — least-privilege, enforced via S1/S4 classification; every access
  audited.
- **TS-3.** **Marking** — secret artifacts are labeled CONFIDENTIAL/TRADE SECRET at the classification layer.
- **TS-4.** **Confidentiality obligations** — contributors/partners bound by NDA/agreement (tracked as records).
- **TS-5.** **Egress control** — deny-by-default on export/publication of secret-classified material (§10, §12).
- **TS-6.** **Lifecycle** — periodic re-validation that the secret remains secret, valuable, and protected;
  compromise handling (§19).

### 6.4 Secrecy-value assessment

Runs in parallel with novelty/patentability (§8). Scores detectability, durability of advantage, independent-
invention risk, and cost of protection. Feeds the Board triage (§13).

### 6.5 Registry & audit

The Trade Secret Registry (IP-0003) is append-only and access-audited: it records existence, custodians, access
grants/revocations, marking, and protection-measure attestations — **without** storing the secret payload in the
clear beyond need (references + controlled vaulting; S3/S4).

---

## 7. Prior Art Governance

### 7.1 Purpose

Prior art determines novelty and non-obviousness. **Research-First** requires that prior art be searched,
recorded, and reasoned about **as invention happens**, not reconstructed under filing pressure.

### 7.2 Prior-art governance requirements (design)

- **PA-1.** Every patent candidate has a **prior-art search record**: sources searched, queries, results,
  closest references, and a reasoned distinction.
- **PA-2.** Prior art is stored in the **Prior Art Registry** (IP-0004 references it; registry design in §16),
  append-only and citable.
- **PA-3.** **Known art of our own** (prior UCOS publications, open-source, disclosures) is tracked because it can
  become a **self-bar** — a critical Patent-First hazard.
- **PA-4.** Prior-art relevance is classified (X/Y/A-style relevance) with rationale.
- **PA-5.** Searches are **reproducible**: queries and dates recorded so results can be re-run and audited.

### 7.3 Self-disclosure hazard (Patent-First critical)

Because UCOS produces prolific documentation, the single greatest patentability hazard is **our own prior
disclosure**. Prior-art governance therefore includes an **internal-disclosure ledger**: every publication,
open-source push, talk, and demo is recorded with date, so any candidate can be checked against our own
disclosure timeline before filing (ties to §10, §11).

### 7.4 Counsel role

Prior-art *interpretation* for legal sufficiency is counsel's; the framework ensures the *inputs* (searches,
references, distinctions, disclosure timeline) exist, are complete, and are auditable.

---

## 8. Novelty Assessment Framework

### 8.1 Purpose

A structured, repeatable, evidence-based assessment of whether an invention is **new** (novel) and **non-obvious**
(inventive step) relative to prior art — producing a defensible, recorded determination that feeds triage.

### 8.2 Assessment dimensions (design)

| Dimension | Question | Evidence |
|-----------|----------|----------|
| **Novelty** | Is the claimed combination absent from any single prior-art reference? | Prior-art search record (§7). |
| **Non-obviousness** | Would it be non-obvious to a person skilled in the art to combine the references? | Distinction rationale; secondary indicia. |
| **Utility** | Does it have a specific, substantial, credible use? | Enabling description; reduction to practice. |
| **Enablement** | Can a skilled person make/use it from the description? | IDR enabling detail. |
| **Subject-matter eligibility** | Is it eligible (not merely abstract/natural law)? | Technical-effect framing. |
| **Secondary indicia** | Long-felt need, unexpected results, commercial success, others' failure. | Recorded evidence. |

### 8.3 Scoring & thresholds

The framework (fully specified in IP-0004) produces a **patentability score** across the dimensions with recorded
rationale per dimension. Thresholds route candidates: strong → patent-track; weak-but-valuable → secret-track or
defensive publication; not-novel → no-action (with rationale). **Deny-by-default:** an incomplete assessment
never yields a "patentable" determination.

### 8.4 Determinism & reproducibility

Assessment inputs (references, queries, rationale) are recorded so the assessment is **reproducible** and
auditable. The score is a decision *aid*; the legally-operative determination is counsel's.

---

## 9. Invention Classification Framework

### 9.1 Purpose (IP-First)

IP status is a **first-class attribute** of every UCOS artifact. Classification makes IP posture explicit,
searchable, and enforceable — analogous to security classification (S4).

### 9.2 Classification axes (design)

| Axis | Values |
|------|--------|
| **IP posture** | `UNCLASSIFIED-PENDING` (default, treated as confidential+patentable) · `PATENT_TRACK` · `SECRET_TRACK` · `DEFENSIVE_PUBLICATION` · `PUBLIC_OSS` · `NO_ACTION` |
| **Confidentiality** | `PUBLIC` · `INTERNAL` · `CONFIDENTIAL` · `TRADE_SECRET` (aligns with S4) |
| **Invention type** | per IP-0001 taxonomy (mechanism, algorithm, architecture, protocol, data-structure, UX, model, process…) |
| **Moat linkage** | `moatRef` (which competitive moat, if any) |
| **Maturity** | `CONCEIVED` … `REDUCED_TO_PRACTICE` … `SHIPPED` |

### 9.3 Rules

- **CL-1.** Every artifact has an IP posture; absence defaults to `UNCLASSIFIED-PENDING` (deny disclosure).
- **CL-2.** Confidentiality classification is **monotonic** with S4: derived artifacts inherit the maximum
  confidentiality of their inputs.
- **CL-3.** Reclassification (e.g. `SECRET_TRACK` → `PUBLIC_OSS`) is a **governed, audited** decision (Board +
  Evolution commit); downgrades of confidentiality require explicit authorization.
- **CL-4.** Classification is **traceable** to the artifact registry and the IP registries.

### 9.4 Taxonomy

The invention-type taxonomy and its detection signals are specified in **IP-0001**.

---

## 10. Disclosure Governance

### 10.1 Principle

**Disclosure is the point of no return** for patentability and secrecy. Disclosure governance is the load-bearing
control of the entire framework: **deny-by-default**, gate every disclosure channel, and never disclose before
IP posture is adjudicated.

### 10.2 Disclosure channels (all gated)

Open-source publication · external repositories · academic papers/preprints · conference talks/slides · blog
posts · demos to external parties · marketing material · standards submissions · API/spec publication · sales
disclosures · investor materials.

### 10.3 Disclosure gate (design)

```
request-to-disclose(artifact, channel, audience)
   1. resolve IP posture(artifact)            → if UNCLASSIFIED-PENDING → DENY (must triage first)
   2. if posture ∈ {PATENT_TRACK not-yet-filed} → DENY unless counsel authorizes protective disclosure
   3. if confidentiality ∈ {CONFIDENTIAL, TRADE_SECRET} → DENY (egress control, §12)
   4. if posture ∈ {PUBLIC_OSS, DEFENSIVE_PUBLICATION, PATENT_TRACK-filed} → ALLOW under recorded conditions
   5. record disclosure in internal-disclosure ledger (§7.3) with date/audience/scope
   6. every decision (allow/deny) is audited (AUDIT-UNIV-001)
```

Default branch is **DENY**. No automated process initiates a barring disclosure (DP-4).

### 10.4 Invariants

- **DG-1.** No disclosure without an adjudicated posture.
- **DG-2.** Every disclosure is **recorded** (internal-disclosure ledger) — this record is itself a patentability
  input (§7.3) and a trade-secret-defense record (§6).
- **DG-3.** Disclosure of trade-secret material is denied absent an explicit, counsel-approved, audited waiver.
- **DG-4.** Accidental-disclosure attempts are logged and escalated (§19).

---

## 11. Publication Governance

### 11.1 Purpose

Publication (papers, OSS, talks) is a **specialized disclosure** with strategic upside (defensive publication,
recruiting, standards influence) and existential downside (self-bar, secret loss). Publication governance
provides the **authorization workflow** for deliberate, beneficial disclosure.

### 11.2 Publication decision (design)

| Publication intent | Precondition |
|--------------------|--------------|
| **Defensive publication** (block others from patenting) | Confirm we are not forgoing our own stronger patent; counsel + Board sign-off; recorded. |
| **Academic / research paper** | IP triage complete; any patent filed or intentionally waived; secrets scrubbed. |
| **Open-source release** | License chosen; no trade-secret leakage; patent posture decided (possible patent grant/defensive terms). |
| **Standards contribution** | IPR policy of the SDO reviewed; FRAND/patent-pledge implications assessed by counsel. |

### 11.3 Invariants

- **PB-1.** Publication is a **subset** of disclosure and passes the disclosure gate (§10).
- **PB-2.** Defensive publication is a **deliberate strategy**, chosen with rationale — never a fallback for
  missing a deadline.
- **PB-3.** Every publication updates the internal-disclosure ledger (§7.3) and the artifact's IP classification.
- **PB-4.** Open-source licensing and patent-grant terms are recorded and counsel-reviewed.

---

## 12. Confidentiality Governance

### 12.1 Purpose

Confidentiality is the **substrate** of trade-secret protection and pre-filing patent protection. It aligns IP
governance with the Security Canon (S1 authz, S3 key-by-reference, S4 classification/data-protection, S6 audit).

### 12.2 Requirements (design)

- **CF-1.** **Classification-driven access** — CONFIDENTIAL/TRADE_SECRET artifacts are need-to-know, enforced by
  the Control Plane (deny-by-default), every access audited (S1/S4/S6).
- **CF-2.** **Egress control** — deny-by-default on copy/export/publish of confidential material; overrides are
  audited and counsel-gated.
- **CF-3.** **Confidentiality agreements** — contributors, contractors, partners, and federated nodes operate
  under recorded confidentiality obligations; the framework tracks agreement existence/scope (not legal drafting).
- **CF-4.** **Marking discipline** — confidential artifacts are labeled; unmarked-but-sensitive material defaults
  to CONFIDENTIAL (deny-by-default).
- **CF-5.** **Federation-aware** — cross-node exchange (PI-5) never leaks confidential/secret material; export is
  denied unless the artifact posture and federation policy both permit.

### 12.3 Invariants

- **CG-1.** Confidentiality is monotonic (CL-2); derivations never silently lower it.
- **CG-2.** Every access to trade-secret material is audited (S6) — the access log is a trade-secret-defense
  record (reasonable-measures evidence, §6.3).

---

## 13. Innovation Review Board Model

### 13.1 Purpose

The **Innovation Review Board (IRB)** is the human governance body that owns invention triage and IP decisions —
the "independent adjudicator" for IP, analogous to the Authority Board for construction governance. It provides
**separation of duties** so that inventors do not unilaterally decide the fate (and disclosure) of their own
inventions.

### 13.2 Composition (design)

| Role | Responsibility |
|------|----------------|
| **Chair** | Convenes the Board; owns the decision record. |
| **IP Counsel** (qualified) | Legally-operative determinations: patentability opinion, filing authorization, disclosure/secrecy sign-off. |
| **Technical Assessor(s)** | Assess novelty/inventive-step from the art; independent of the inventor where possible. |
| **Portfolio Strategist** | Maps inventions to moats/families; portfolio strategy. |
| **Security/Confidentiality Officer** | Ensures S1/S4/S6 alignment; egress and marking. |

### 13.3 Board workflow (design)

```
intake(IDR) ─▶ completeness check ─▶ novelty+secrecy assessment ─▶ Board deliberation
   ─▶ decision {PATENT_TRACK | SECRET_TRACK | DEFENSIVE_PUBLICATION | NO_ACTION | ABANDON}
   ─▶ record rationale ─▶ commit (Evolution) ─▶ audit (AUDIT-UNIV-001)
```

### 13.4 Governance invariants

- **RB-1.** **Separation of duties** — the inventor does not solely decide disclosure/triage of their invention.
- **RB-2.** **Rationale mandatory** — every decision records a non-empty rationale (no unexplained triage).
- **RB-3.** **Counsel-gated legal steps** — filing, deliberate disclosure, and rights-forfeiting abandonment
  require IP counsel sign-off.
- **RB-4.** **Evolution-committed** — Board decisions are durable governance consequences committed via AD-0019.
- **RB-5.** **Audited & immutable** — every decision is an append-only, hash-chained record.

---

## 14. Patent Candidate Registry Architecture

### 14.1 Purpose

The authoritative, append-only, registry-driven store of every patent candidate: its IDR linkage, lifecycle
state (§4), prior-art clearance, assessment, clocks/deadlines, family membership, and filings. Full specification:
**IP-0002**.

### 14.2 Architectural commitments (design)

- **PCR-1.** **Registry-driven / no hard coding** — candidate types, lifecycle states, deadline classes, and
  jurisdictions are metadata records, not literals.
- **PCR-2.** **Event-sourced / append-only** — candidate state is a fold over an event stream; nothing is edited
  in place (immutable inventorship and priority evidence).
- **PCR-3.** **Immutable audit** — every transition emits an `IP_*` audit event (reuse `AUDIT-UNIV-001`).
- **PCR-4.** **Deadline-bearing** — clocks (provisional 12-month, PCT national phase, maintenance) are first-class
  records with escalation (§19).
- **PCR-5.** **Traceable** — candidates link to IDRs, UCOS capabilities, families, and prior-art records.
- **PCR-6.** **Deny-by-default** — a candidate cannot advance to `FILED`/`GRANTED` without the required evidence
  and counsel approval.

### 14.3 Deferral to IP-0002

Record schemas, keyspace, event families (`IP_CANDIDATE_*`), and storage strategy are specified in IP-0002 (this
Constitution defines only the constitutional requirements).

---

## 15. Trade Secret Registry Architecture

### 15.1 Purpose

The authoritative, access-audited, append-only store that **identifies** trade secrets, tracks **custodians**,
**access grants/revocations**, **marking**, **protection-measure attestations**, and **lifecycle/compromise**
events — the evidentiary backbone of "reasonable measures." Full specification: **IP-0003**.

### 15.2 Architectural commitments (design)

- **TSR-1.** **No plaintext hoarding** — the registry records *existence, metadata, and controls*, not the secret
  payload in the clear beyond need (references + controlled vaulting; S3/S4).
- **TSR-2.** **Access-audited** — every access/grant/revocation is an immutable `IP_SECRET_*` event (S6); the log
  is reasonable-measures evidence (§6.3).
- **TSR-3.** **Registry-driven / no hard coding** — secret categories, protection-measure classes, and custodian
  roles are metadata.
- **TSR-4.** **Deny-by-default access** — need-to-know enforced by the Control Plane (S1).
- **TSR-5.** **Lifecycle** — periodic re-validation and compromise handling are first-class (§19).
- **TSR-6.** **Egress-controlled** — export/publish denied by default (§10, §12).

### 15.3 Deferral to IP-0003

Schemas, keyspace, event families, vaulting/reference model, and access model are specified in IP-0003.

---

## 16. Prior Art Registry Architecture

### 16.1 Purpose

The append-only, citable store of prior-art references, searches (queries + dates for reproducibility), relevance
classifications, distinctions, and — critically — the **internal-disclosure ledger** (§7.3) that guards against
self-bar. Referenced by the assessment framework (IP-0004).

### 16.2 Architectural commitments (design)

- **PAR-1.** **Reproducible searches** — queries, sources, and dates recorded so a search can be re-run/audited.
- **PAR-2.** **Append-only / immutable** — references and search records are never rewritten.
- **PAR-3.** **Self-disclosure ledger** — every UCOS external disclosure is recorded with date (fed by §10/§11),
  enabling self-bar checks.
- **PAR-4.** **Registry-driven** — reference sources, relevance classes, and search templates are metadata.
- **PAR-5.** **Traceable** — references link to candidates and novelty assessments.

### 16.3 Placement

The Prior Art Registry design is carried within the assessment deliverable **IP-0004** (which consumes it) and
cross-referenced here; a standalone registry spec may be split out later if warranted.

---

## 17. IP Audit Model

### 17.1 Purpose

Make the entire IP estate **provable and tamper-evident**: who invented what, when; when it was captured,
assessed, triaged; every disclosure; every secret access; every filing and deadline. IP audit **reuses**
`AUDIT-UNIV-001` (hash-chained ledger) — no new audit primitive.

### 17.2 IP event families (design)

| Family | Concern |
|--------|---------|
| `IP_INVENTION_*` | IDR capture, invention lifecycle transitions (§3). |
| `IP_CANDIDATE_*` | Patent candidate lifecycle, filings, clocks (§4, §14). |
| `IP_SECRET_*` | Trade-secret registration, access, protection attestations (§6, §15). |
| `IP_PRIORART_*` | Prior-art searches, references, disclosure-ledger entries (§7, §16). |
| `IP_ASSESSMENT_*` | Novelty/patentability/secrecy assessments (§8). |
| `IP_DISCLOSURE_*` | Disclosure/publication gate decisions (§10, §11). |
| `IP_BOARD_*` | Innovation Review Board decisions (§13). |

### 17.3 Audit invariants

- **AU-1.** Every IP action — including denials and abandonments — emits an immutable, hash-chained event (no
  silent path; S6, reuse `AUDIT-UNIV-001`).
- **AU-2.** **Inventorship and dates are immutable** once recorded (priority integrity).
- **AU-3.** The audit trail is **independently verifiable** (offline hash-chain verification, per `AUDIT-UNIV-001`).
- **AU-4.** Trade-secret access logs constitute **reasonable-measures evidence** (§6.3).
- **AU-5.** Governed IP mutations are **Evolution-anchored** (AD-0019).

---

## 18. Patent Portfolio Management

### 18.1 Purpose

Manage the **whole estate** as a strategic asset: families (§5), candidates (§4), trade secrets (§6), and their
mapping to moats and to the product/capability roadmap.

### 18.2 Portfolio functions (design)

| Function | Description |
|----------|-------------|
| **Coverage mapping** | Which UCOS capabilities/moats are protected, by which families/secrets; find gaps. |
| **Prioritization** | Rank candidates by strategic value, detectability, cost, and moat contribution. |
| **Budget & cost** | Track filing/prosecution/maintenance/foreign costs against value. |
| **Prune & maintain** | Decide continuations vs abandonment vs let-lapse (with rationale). |
| **Landscape** | Track competitors' portfolios and white space. |
| **Licensing/assertion posture** | Defensive vs offensive stance per family (strategy, counsel-led). |

### 18.3 Invariants

- **PM-1.** Portfolio decisions are **recorded with rationale** and **Evolution-committed**.
- **PM-2.** Every family maps to at least one **capability** and, where applicable, a **moat** (traceability).
- **PM-3.** **Gap detection** is continuous: unprotected high-value capabilities surface as candidate signals.
- **PM-4.** Cost/value is tracked; maintenance-fee lapses are deliberate decisions, never oversights (§19).

---

## 19. IP Risk Management

### 19.1 Purpose

Identify, track, and mitigate the risks that erode the IP estate. Risks are first-class records with owners,
severity, likelihood, mitigation, and escalation.

### 19.2 Risk catalogue (design)

| Risk | Description | Primary control |
|------|-------------|-----------------|
| **R-1 Accidental disclosure / self-bar** | Publishing/OSS/talk before filing bars patentability. | Disclosure gate (§10), self-disclosure ledger (§7.3), deny-by-default. |
| **R-2 Missed deadline** | Provisional→non-provisional, PCT national phase, maintenance fees lapse. | Deadline records + escalation (§4.3, §14). |
| **R-3 Trade-secret compromise** | Secret leaks, is reverse-engineered, or loses protection. | Access control + egress control + audit (§6, §12, §15). |
| **R-4 Inventorship error** | Wrong/incomplete inventors → invalid patent. | Immutable inventorship capture + Board review (§3.4, §13). |
| **R-5 Prior-art surprise** | Undiscovered art invalidates a filing. | Prior-art governance + reproducible search (§7). |
| **R-6 Freedom-to-operate (FTO)** | UCOS infringes others' patents. | FTO review (counsel-led) tracked as records; landscape (§18). |
| **R-7 Ownership/assignment gaps** | Contributor rights not assigned to UCOS. | Confidentiality/assignment agreement tracking (§12.3). |
| **R-8 Federation leakage** | Cross-node exchange leaks confidential/secret IP. | Federation-aware egress deny-by-default (§12.2). |
| **R-9 Over-disclosure in filings** | Patent spec discloses a companion trade secret. | Coordinated patent-vs-secret triage before drafting (§6.2, §13). |

### 19.3 Risk-management invariants

- **RM-1.** Every risk has an **owner**, severity, and mitigation; escalation is audited.
- **RM-2.** Deadline and compromise risks trigger **automatic escalation** to the IRB (§13) with time-to-act.
- **RM-3.** FTO and ownership are **counsel-led**; the framework tracks records and surfaces gaps.
- **RM-4.** Risk decisions are recorded and Evolution-committed.

---

## 20. Success Metrics

### 20.1 Purpose

Make the framework's effectiveness measurable. Metrics are **design targets**, not asserted results; they are
instrumented once the framework is operational (which requires separate authorization).

### 20.2 Metric families (design)

| # | Metric | Definition | Direction |
|:-:|--------|------------|-----------|
| M-1 | **Invention capture rate** | Inventions captured (IDRs) ÷ inventions conceived (sampled/estimated). | ↑ toward 100% |
| M-2 | **Time-to-capture** | Median time from conception to CAPTURED. | ↓ |
| M-3 | **Triage latency** | Median time from CAPTURED to TRIAGED. | ↓ |
| M-4 | **Accidental-disclosure incidents** | Barring disclosures made before triage/protection. | **→ 0** |
| M-5 | **Patent-track conversion** | Candidates reaching FILED ÷ patent-track decisions. | context-dependent |
| M-6 | **Deadline adherence** | Deadlines met ÷ deadlines due. | **→ 100%** |
| M-7 | **Portfolio coverage** | High-value capabilities protected ÷ total high-value capabilities. | ↑ |
| M-8 | **Moat strength** | Families per moat × assessed strength; white-space gaps. | ↑ / gaps ↓ |
| M-9 | **Trade-secret integrity** | Secret-access anomalies; compromises. | **→ 0** |
| M-10 | **Prior-art coverage** | Candidates with reproducible prior-art searches ÷ all candidates. | **→ 100%** |
| M-11 | **Audit completeness** | IP actions with immutable audit records ÷ all IP actions. | **→ 100%** |
| M-12 | **Assessment reproducibility** | Assessments re-runnable from recorded inputs ÷ all assessments. | **→ 100%** |

### 20.3 Metric governance

Metrics are computed from the immutable IP audit ledger (§17) and the registries (§14–§16), so they are
themselves **provable**. Targets and thresholds are ratified by the IRB and reviewed periodically.

---

## Closing

This Constitution establishes IP as a first-class, governed dimension of UCOS: **Patent-First** (preserve
patentability by default), **IP-First** (IP posture is an attribute of everything), **Research-First** (evidence
before assertion), and **Trade-Secret-Aware** (triage patent-vs-secret before disclosure). It is realized by five
companion deliverables — invention taxonomy (IP-0001), patent-candidate registry (IP-0002), trade-secret registry
(IP-0003), patentability assessment (IP-0004), and the governance model (IP-0005) — and it reuses UCOS's existing
audit (`AUDIT-UNIV-001`), authorization (PI-4), and commit (PI-6 Evolution) discipline rather than inventing new
mechanisms.

*This document is design/specification only. It writes no code, releases no lock, enrolls no invariant, confers
no legal authority, and constitutes no legal advice. Legally-operative determinations require qualified IP
counsel. `UCOS-CONSTRUCTION-BLOCKED` and the Article IX generation lock are unchanged.*
