# IP-0004 — Patentability Assessment Framework

**Program:** IP-0000 — Intellectual Property Governance Framework · Deliverable **IP-0004**
**Artifact ID:** `IP-0004`
**Artifact family:** `IP-*`
**Location:** `architecture/ip/`
**Mode:** DESIGN ONLY — NO IMPLEMENTATION · NO CODE · NO REPOSITORY MUTATION (of ratified artifacts) · NO LEGAL ADVICE
**Status:** CREATED — DESIGN — READY FOR INNOVATION REVIEW BOARD REVIEW
**Parent:** `IP-0000` (§7 Prior Art Governance · §8 Novelty Assessment · §16 Prior Art Registry Architecture · §17 IP Audit)
**Consumes:** `IP-0001` (Invention Taxonomy) · **Feeds:** `IP-0002` (Patent Candidate Registry `assessmentRef`) · `IP-0003` (secrecy-value triage) · `IP-0005` (IP Governance Model)
**Reuses:** `AUDIT-UNIV-001` (hash-chained audit) · PI-4 Control Plane (deny-by-default) · PI-6 Evolution (sole commit path, AD-0019) · PI-2/3 Substrate · `canonicalize`/`sha256` (reproducibility; no custom crypto)
**Date:** 2026-07-02

> **Governing disclaimer.** Design/specification only. Writes no code, releases no lock, enrolls no invariant,
> mutates no ratified artifact, constitutes no legal advice. The patentability **score** produced here is a
> **decision aid** to structure and record analysis; the legally-operative patentability, subject-matter-
> eligibility, and freedom-to-operate determinations are made by **qualified IP counsel** (IP-0000 §8.3, §13).
> `UCOS-CONSTRUCTION-BLOCKED` and the Article IX generation lock are unchanged.

---

## 1. Purpose & scope

This deliverable specifies **how UCOS assesses whether an invention is patentable** — a structured, repeatable,
evidence-based, reproducible framework producing a recorded determination that feeds Board triage (IP-0000 §13)
and the Patent Candidate Registry (IP-0002). It also carries the **Prior Art Registry** design (IP-0000 §16),
because prior art is the substrate of novelty and the self-bar hazard is UCOS's single greatest patentability
risk (IP-0000 §7.3).

Scope: assessment principles (§2), the six assessment dimensions and their rubrics (§3), the scoring &
thresholds model (§4), the prior-art registry (§5), the self-disclosure ledger (§6), the assessment record and
`IP_ASSESSMENT_*`/`IP_PRIORART_*` event models (§7), reproducibility (§8), API surface (§9), and governance (§10).

Out of scope: patent drafting, filing (IP-0002), trade-secret storage (IP-0003), and any legal opinion.

---

## 2. Assessment principles

| # | Principle | Realization |
|:-:|-----------|-------------|
| AS-1 | **Evidence before assertion (Research-First).** | Every dimension score is backed by recorded evidence (prior-art references, distinctions, indicia); an unbacked score is inadmissible. |
| AS-2 | **Reproducible.** | Search queries, sources, dates, and rationale are recorded; the assessment is re-runnable and yields a stable `assessmentDigest` (`sha256(canonicalize(...))`). |
| AS-3 | **Deny-by-default.** | An incomplete assessment never yields a "patentable" determination; missing evidence ⇒ `INDETERMINATE`. |
| AS-4 | **Registry-driven / no hard coding.** | Dimensions, rubrics, weights, thresholds, and relevance classes are `ip:*` metadata records — tunable without code change. |
| AS-5 | **Aid, not authority.** | The score structures analysis; counsel makes the legally-operative call (AS-1, IP-0000 §8.3). |
| AS-6 | **Append-only & audited.** | Assessments and prior-art records are immutable, hash-chained events (`AUDIT-UNIV-001`). |
| AS-7 | **Self-bar aware.** | The self-disclosure ledger (§6) is a mandatory input; our own prior disclosure can defeat patentability. |

---

## 3. Assessment dimensions

Six dimensions (aligned with IP-0000 §8.2). Each has a **rubric** (registry-driven `ip:assessment-rubric:*`) with
ordered levels and required evidence.

### 3.1 D1 — Novelty

*Is the claimed combination absent from any single prior-art reference?*

| Level | Criterion | Required evidence |
|-------|-----------|-------------------|
| `NOVEL` | No single reference discloses all elements. | Prior-art search record + element-mapping distinction. |
| `PARTIAL` | Some elements disclosed; combination unclear. | Reference set + gap analysis. |
| `ANTICIPATED` | A single reference discloses all elements. | The anticipating reference. |
| `INDETERMINATE` | Search insufficient. | (default; deny-by-default) |

### 3.2 D2 — Non-obviousness (inventive step)

*Would combining the references be non-obvious to a person skilled in the art?*

| Level | Criterion | Required evidence |
|-------|-----------|-------------------|
| `STRONG` | No motivation to combine; unexpected result; teaching-away. | Distinction rationale + secondary indicia (§3.6). |
| `MODERATE` | Some inventive step; arguable. | Rationale. |
| `WEAK` | Obvious combination of known elements. | Rationale. |
| `INDETERMINATE` | Insufficient analysis. | (default) |

### 3.3 D3 — Utility

*Specific, substantial, credible use?* Levels: `CLEAR` / `ARGUABLE` / `LACKING` / `INDETERMINATE`; evidence =
enabling description + use case + (ideally) reduction-to-practice reference.

### 3.4 D4 — Enablement / written description

*Can a skilled person make and use it from the description?* Levels: `ENABLED` / `PARTIAL` / `NOT_ENABLED` /
`INDETERMINATE`; evidence = IDR enabling detail, diagrams, algorithms.

### 3.5 D5 — Subject-matter eligibility

*Is it eligible (not merely an abstract idea, natural law, or mental process)?* Levels: `ELIGIBLE_LIKELY` /
`ELIGIBLE_ARGUABLE` / `ELIGIBILITY_RISK` / `INDETERMINATE`; evidence = a **technical-effect framing** (what
concrete technical problem is solved, what improvement to the functioning of a system results). **Counsel-led**;
this is the dimension most sensitive to jurisdiction and case law.

### 3.6 D6 — Secondary indicia

*Objective indicators of non-obviousness.* Recorded (not scored in isolation), each with evidence: long-felt
unmet need, failure of others, unexpected results, commercial success/adoption, skepticism of experts, copying.
These **strengthen** D2.

---

## 4. Scoring & thresholds

### 4.1 Composite score (design)

Each dimension yields a level → a normalized sub-score via its rubric; the composite is a **weighted, recorded**
combination. Weights and thresholds are registry records (`ip:assessment-weights:*`, `ip:assessment-threshold:*`),
so they are tunable and versioned — **no magic numbers in code** (AS-4).

```
levelScore(dimension) = rubric(dimension).levelValue(assessedLevel)     // 0..1, registry-defined
composite = Σ weight(dimension) × levelScore(dimension)                 // weights sum to 1, registry-defined
```

### 4.2 Gating rules (deny-by-default)

- **G-1.** Any dimension at `INDETERMINATE` ⇒ overall determination `INDETERMINATE` (assessment incomplete;
  cannot be "patentable") — AS-3.
- **G-2.** D1 `ANTICIPATED` ⇒ overall `NOT_PATENTABLE` regardless of composite (novelty is a hard gate).
- **G-3.** D5 `ELIGIBILITY_RISK` ⇒ overall capped at `NEEDS_COUNSEL` (eligibility cannot be waved through by a
  high composite).
- **G-4.** A self-disclosure hit within a barring window (§6) ⇒ overall flagged `SELF_BAR_RISK` and routed to
  counsel before any patent-track decision.

### 4.3 Determination bands (design; counsel-authoritative)

| Determination | Meaning | Typical routing (IP-0000 §13) |
|---------------|---------|-------------------------------|
| `STRONG_PATENTABLE` | High composite, no gates tripped. | → PATENT_TRACK (counsel-confirmed) |
| `PATENTABLE_ARGUABLE` | Moderate; defensible with effort. | → PATENT_TRACK or DEFENSIVE_PUBLICATION |
| `NEEDS_COUNSEL` | Eligibility/other risk needs legal judgment. | → counsel review |
| `SELF_BAR_RISK` | Our own disclosure may bar. | → counsel + expedite (IP-0000 §19 R-1) |
| `BETTER_AS_SECRET` | Low detectability, durable advantage (from IP-0001/§3). | → SECRET_TRACK (IP-0003) |
| `NOT_PATENTABLE` | Anticipated / obvious / ineligible. | → DEFENSIVE_PUBLICATION or NO_ACTION |
| `INDETERMINATE` | Assessment incomplete. | → complete evidence, re-assess |

### 4.4 Secrecy-value cross-check

In parallel, a **secrecy-value score** (detectability × durability × independent-invention-risk × protection-
cost, from IP-0000 §6.4) is recorded. A low patentability + high secrecy-value ⇒ `BETTER_AS_SECRET`. This makes
the **patent-vs-secret** decision (IP-0000 §6.2) evidence-based and auditable.

---

## 5. Prior Art Registry (IP-0000 §16)

### 5.1 Purpose

Append-only, citable, **reproducible** store of prior-art references, searches, relevance classifications, and
distinctions — the evidentiary substrate for D1/D2.

### 5.2 Records (design specification)

```ts
// SPECIFICATION — not committed code.

/** A prior-art reference. */
export interface PriorArtReference {
  refId: string;
  source: string;                     // ip:priorart-source:* (patent DB, literature, product, our-own-disclosure)
  citation: string;                   // human-citable identifier (patent no., DOI, URL, internal-disclosure id)
  publicationDate?: number;
  relevanceClass: "X" | "Y" | "A";    // ip:priorart-relevance:* (X: alone; Y: in combination; A: background)
  relevanceRationale: string;         // mandatory
  digest: string;                     // sha256(canonicalize(...))
}

/** A reproducible search record. */
export interface PriorArtSearch {
  searchId: string;
  candidateRef?: string;              // linked patent candidate (IP-0002)
  queries: Array<{ engineRef: string; query: string; ranAt: number }>; // reproducibility (AS-2)
  sourcesSearched: string[];          // ip:priorart-source:*
  resultsRefIds: string[];            // PriorArtReference ids
  closestRefs: string[];              // the X/Y references
  distinction: string;                // why the invention is distinct (feeds D1/D2)
  searchedBy: string;
  at: number;
  digest: string;
}
```

### 5.3 Registry rules

- **PA-1.** Searches are **reproducible**: queries, engines, and dates are recorded so a search can be re-run and
  audited (AS-2; IP-0000 §7.2 PA-5).
- **PA-2.** References and searches are **append-only** and hash-chained (immutable).
- **PA-3.** Relevance classes and sources are `ip:*` registry records (no hard coding).
- **PA-4.** Every patent candidate links a search record before `PRIOR_ART_CLEARED` (IP-0002 gate; deny-by-default).
- **PA-5.** **Our-own-disclosure** is a first-class source (`ip:priorart-source:internal`) — see §6.

---

## 6. Self-disclosure ledger (self-bar guard)

### 6.1 Rationale

UCOS's prolific documentation and open-source posture make **our own prior disclosure** the single greatest
patentability hazard (IP-0000 §7.3). The self-disclosure ledger records **every** UCOS external disclosure with
its date so any candidate can be checked against our own timeline before filing.

### 6.2 Design

- **SD-1.** The disclosure gate and publication governance (IP-0000 §10, §11) **feed** the ledger: every
  allowed disclosure emits an `IP_PRIORART_SELF_DISCLOSURE` entry `{ artifactRef, channel, audience, scope, at }`.
- **SD-2.** Assessment D1/D2 **must** query the ledger for the candidate's subject matter; a hit within a
  jurisdiction's barring/grace window trips gate G-4 (`SELF_BAR_RISK`).
- **SD-3.** The ledger is append-only, immutable, and auditable (it is prior-art evidence and a defense record).
- **SD-4.** Grace-period interpretation is **counsel's**; the framework surfaces the dates and the hit.

---

## 7. Assessment record & event models

### 7.1 Assessment record (design)

```ts
// SPECIFICATION — folded from IP_ASSESSMENT_* events; append-only history.
export interface PatentabilityAssessment {
  assessmentId: string;
  subjectRef: string;                 // IDR / candidate (IP-0002)
  dimensionScores: Record<"D1"|"D2"|"D3"|"D4"|"D5"|"D6", {
    level: string; subScore: number; evidenceRefs: string[]; rationale: string;
  }>;
  secondaryIndicia: string[];         // D6 recorded indicators
  composite: number;                  // weighted (weights version-pinned)
  determination: "STRONG_PATENTABLE"|"PATENTABLE_ARGUABLE"|"NEEDS_COUNSEL"
               | "SELF_BAR_RISK"|"BETTER_AS_SECRET"|"NOT_PATENTABLE"|"INDETERMINATE";
  secrecyValueScore?: number;         // parallel patent-vs-secret cross-check (§4.4)
  weightsRef: string;                 // ip:assessment-weights:*@version (reproducibility)
  thresholdRef: string;               // ip:assessment-threshold:*@version
  priorArtSearchRefs: string[];       // §5
  selfDisclosureHits: string[];       // §6
  assessedBy: string;                 // technical assessor (SoD from inventor where possible)
  counselReviewRef?: string;          // counsel sign-off (for operative determinations)
  assessmentDigest: string;           // sha256(canonicalize(inputs+scores)) — reproducibility anchor (AS-2)
  at: number;
}
```

### 7.2 `IP_ASSESSMENT_*` events

| Event | Purpose | Key rule |
|-------|---------|----------|
| `IP_ASSESSMENT_STARTED` | Open an assessment for a subject. | Links IDR/candidate. |
| `IP_ASSESSMENT_DIMENSION_SCORED` | Record a dimension level + evidence + rationale. | Rationale + evidence mandatory (AS-1). |
| `IP_ASSESSMENT_COMPLETED` | Record composite + determination. | Gating rules applied (§4.2); `INDETERMINATE` if incomplete. |
| `IP_ASSESSMENT_COUNSEL_REVIEWED` | Counsel confirms/overrides for operative use. | Counsel-gated (AS-5). |
| `IP_ASSESSMENT_REASSESSED` | New assessment supersedes (evidence changed). | Prior remains (append-only). |

### 7.3 `IP_PRIORART_*` events

| Event | Purpose |
|-------|---------|
| `IP_PRIORART_SEARCH_RECORDED` | A reproducible search is stored (§5.2). |
| `IP_PRIORART_REFERENCE_ADDED` | A reference is catalogued with relevance + rationale. |
| `IP_PRIORART_SELF_DISCLOSURE` | A UCOS external disclosure is recorded (§6). |
| `IP_PRIORART_SELF_BAR_FLAGGED` | A self-bar hit is raised against a candidate (G-4). |

**Event rules.** All immutable, hash-chained, anchored in `AUDIT-UNIV-001` (`domain:"ip"`); envelope carries
`correlationId`/`causationId`, version-pinned `policyRefs`, provenance, actor; governed mutations Evolution-
committed; replay recomputes composite/determination from recorded scores + pinned weights (never trusts the
recorded band).

---

## 8. Reproducibility

- **RP-1.** The `assessmentDigest = sha256(canonicalize({dimensionScores, weightsRef, thresholdRef,
  priorArtSearchRefs, selfDisclosureHits}))` binds a determination to its exact inputs and pinned weights.
- **RP-2.** Recomputing the composite from recorded sub-scores + pinned weights **must** reproduce the recorded
  `composite` and `determination`; a mismatch is an integrity alarm (fail-closed).
- **RP-3.** Prior-art searches are re-runnable from recorded queries/engines/dates (PA-1); results can be
  compared over time (landscape drift).
- **RP-4.** Because weights/thresholds are version-pinned, historical determinations remain interpretable even
  after the rubric is retuned (mirrors registry versioning discipline).

---

## 9. API surface (contract-first; design)

```ts
// SPECIFICATION — deny-by-default, audited, Evolution-committed mutations.
export interface PatentabilityAssessmentService {
  start(cmd: StartAssessmentCmd, ctx: IpContext): Promise<PatentabilityAssessment>;
  scoreDimension(cmd: ScoreDimensionCmd, ctx: IpContext): Promise<void>;          // evidence+rationale mandatory
  complete(cmd: CompleteAssessmentCmd, ctx: IpContext): Promise<PatentabilityAssessment>; // applies gates
  counselReview(cmd: CounselReviewCmd, ctx: IpContext): Promise<void>;            // operative sign-off
  reassess(cmd: ReassessCmd, ctx: IpContext): Promise<PatentabilityAssessment>;

  // Prior art
  recordSearch(cmd: RecordSearchCmd, ctx: IpContext): Promise<PriorArtSearch>;    // reproducible
  addReference(cmd: AddReferenceCmd, ctx: IpContext): Promise<PriorArtReference>;
  recordSelfDisclosure(cmd: SelfDisclosureCmd, ctx: IpContext): Promise<void>;    // fed by disclosure gate
  checkSelfBar(subjectRef: string, ctx: IpContext): Promise<{ hits: string[] }>;  // G-4 support

  // Queries (read-only; confidentiality-filtered)
  get(assessmentId: string, ctx: IpContext): Promise<PatentabilityAssessment>;
  reproduce(assessmentId: string, ctx: IpContext): Promise<{ matches: boolean }>; // RP-2 verification
}
```

- **API-1.** Every command deny-by-default authorized (S1) and audited (S6); mutations Evolution-committed.
- **API-2.** `complete` enforces gating rules (§4.2); it cannot return "patentable" on an incomplete assessment.
- **API-3.** `reproduce` re-verifies `assessmentDigest`/composite (RP-2) — assessments are provably reproducible.
- **API-4.** Results feed IP-0002 (`assessmentRef`), IP-0003 (secrecy cross-check), and Board triage (IP-0000
  §13).

---

## 10. Governance

- **GV-1.** Assessments are performed by technical assessors with SoD from the inventor where possible; operative
  determinations are **counsel-reviewed** (AS-5; IP-0000 §13 RB-3).
- **GV-2.** Rubrics, weights, thresholds, sources, and relevance classes are **registry-driven** and Evolution-
  committed (AS-4; AD-0019).
- **GV-3.** Every assessment and prior-art action emits an immutable `IP_ASSESSMENT_*`/`IP_PRIORART_*` audit
  event (IP-0000 §17); reproducibility is provable (§8; IP-0000 §20 M-10, M-12).
- **GV-4.** Self-bar risk auto-escalates to counsel (G-4; IP-0000 §19 R-1) before any patent-track decision.
- **GV-5.** The framework is an **aid**; it structures, records, and proves the analysis — it does not replace
  legal judgment (governing disclaimer).

---

*This document is design/specification only. It writes no code, releases no lock, enrolls no invariant, confers
no legal authority, and constitutes no legal advice. `UCOS-CONSTRUCTION-BLOCKED` and the Article IX generation
lock are unchanged.*
