# NVF-0001 — Novelty Verification Fabric

**Program:** NVF-0001 (Novelty Verification Fabric)
**Mode:** DESIGN ONLY — no code, no implementation.
**Fabric position:** Additive governance/control fabric over the ratified substrate (PI-2/PI-3) +
control (PI-4) + federation (PI-5) + evolution (PI-6) + knowledge (PI-7) + ontology (PI-8). It modifies
no core dir and changes no ratified fabric behavior (reuse only). Reserved metadata namespace:
`novelty:`.

**Purpose.** A continuously operating fabric that evaluates every UCOS construct — Fabric, Engine,
Registry, Policy, Algorithm, Governance Mechanism — for **Patent Potential, Research Potential,
Differentiation, Prior-Art Overlap, and Commercial Uniqueness**, and refuses to let UCOS drift into
**commodity, duplicate, known-pattern, or weak-patent** territory.

**Deliverable set.**
- `NVF-0001-NOVELTY-VERIFICATION-FABRIC.md` (this document) — the fabric, its 20 sections, the five
  scores, and the universal evaluation framework.
- `NVF-0002-PRIOR-ART-FRAMEWORK.md` — prior-art discovery, overlap scoring, and registry.
- `NVF-0003-DIFFERENTIATION-MODEL.md` — differentiation, competitive analysis, commercial defensibility.
- `NVF-0004-RESEARCH-GAP-FRAMEWORK.md` — research gaps, research opportunity, patent opportunity.

> **Scope discipline.** This document is a design. It defines models, schemas (as conceptual field
> lists), state machines, workflows, gates, and formulas. It does not prescribe an implementation and
> emits no code.

---

## Cross-cutting principles (inherited from the UCOS canon)

The fabric is bound by the same non-negotiables as every other UCOS control fabric:

- **Registry-driven** — every source, rubric, weight, threshold, evaluator authority, and gate is
  runtime data under `novelty:` (never hardcoded).
- **Deny-by-default** — a subject is presumed **NOT novel and NOT defensible** until evidence proves
  otherwise. Absence of evidence is never treated as novelty.
- **Fail-closed** — if a prior-art source is unreachable, stale beyond its freshness policy, or a
  required evaluation is missing, the affected score is capped and certification is withheld.
- **Separation of duties (SoD)** — claimant, evidence gatherer, scorer, adjudicator, and ratifier are
  pairwise-distinct principals. No self-certification of novelty.
- **Tamper-evident** — every claim, score, adjudication, and gate decision is hash-chained in an
  append-only audit and bound to a content hash of the evaluated subject descriptor.
- **Evolution-backed persistence** — durable novelty artifacts are versioned and persisted only through
  the Evolution Fabric (snapshot → atomic apply → audited → rollback-capable). No direct writes.
- **No custom crypto** — signed artifacts reuse the federation Ed25519 primitives.
- **Multi-tenant + distributed** — subjects are tenant/domain-scoped; prior-art corpora and verdicts
  can be federated and reconciled across nodes.

---

## 1. Novelty Vision

**Vision statement.** UCOS must remain a *defensible, original* architecture — a system whose fabrics,
engines, registries, policies, algorithms, and governance mechanisms are demonstrably distinct from
prior art, contribute to the state of the art, and are protectable as intellectual property and as
commercial moat. Novelty is treated as a **first-class, continuously verified property** of the system,
not a one-time claim made at invention time.

**What the fabric guarantees.**
1. **Continuous evaluation** — novelty is re-verified on every material change to a subject (new
   version, new prior art discovered, competitive landscape shift), not only at creation.
2. **Evidence-bound verdicts** — every novelty claim is backed by discoverable prior-art evidence,
   differentiation evidence, and (where relevant) research-gap evidence; unsupported claims fail closed.
3. **Anti-commoditization pressure** — the fabric actively detects and blocks four failure archetypes
   (Section 19) and forces remediation or explicit, recorded waiver.
4. **Auditable defensibility** — every score and gate decision is reproducible and independently
   verifiable, suitable for patent prosecution support and investor/technical due diligence.

**What the fabric is NOT.**
- It is not a patent office and does not issue legal opinions; it produces **decision-support evidence
  and scores** with confidence bands and human adjudication.
- It does not replace domain experts; it structures, scores, and audits their judgments.
- It does not guarantee patent grant; it estimates **Patent Potential** and preserves the evidence
  trail that improves prosecution odds.

**Design tenets.**
- *Novelty is relative and time-bound.* A verdict is valid only against a stated corpus snapshot and
  as-of date; verdicts carry an expiry and are re-opened when the corpus or landscape changes.
- *Distance, not keywords.* Overlap is measured by semantic and structural distance from nearest art,
  not string matching.
- *Combination counts.* A novel arrangement of known components is a valid novelty basis and is scored
  explicitly (combinatorial novelty).
- *Falsifiability.* Every novelty claim must be stated so that discovered prior art can refute it.

---

## 2. Novelty Governance Model

### 2.1 Roles (SoD-enforced, deny-by-default powers)

| Role | Power | Constraint |
| --- | --- | --- |
| **Claimant** | Registers a Novelty Subject + Novelty Claim | May not score or adjudicate its own claim |
| **Prior-Art Analyst** | Gathers/curates prior-art evidence | Distinct from claimant |
| **Novelty Scorer** | Applies rubrics → produces scores | Distinct from claimant + adjudicator |
| **Differentiation Analyst** | Produces competitive/differentiation evidence | Distinct from claimant |
| **Research Analyst** | Produces research-gap + research-opportunity evidence | Distinct from claimant |
| **Patent Analyst** | Produces patent-opportunity + FTO evidence | Distinct from claimant |
| **Novelty Adjudicator** | Confirms/overrides scores with rationale | Distinct from scorer + claimant |
| **Novelty Ratifier** | Terminal sign-off; binds verdict to gates | Distinct from all above; quorum ≥ 1 |
| **Novelty Auditor** | Read + reconcile; cannot mutate verdicts | Independent |

Powers are enumerated per authority record (no implicit powers). All roles are principals resolved via
the Control/Identity fabric; authorities are registry records with `keyRef` (public key by reference).

### 2.2 Authority & boundary model

- **Novelty Authority** — an entity holding one or more enumerated powers, scoped to a tenant/domain.
- **Novelty Boundary** — a deny-by-default trust boundary that clamps conferred novelty trust and
  defines which authorities' verdicts are accepted (for federated verdict exchange).
- **Evaluation Rubric Authority** — the only authority permitted to publish or amend scoring rubrics,
  weights, and thresholds (governance-setup, Approval-Required, versioned via Evolution).

### 2.3 Governance artifacts (all signed, versioned, hash-chained)

Novelty Claim · Prior-Art Evidence Bundle · Differentiation Assessment · Research-Gap Assessment ·
Patent-Opportunity Assessment · Novelty Score Card · Adjudication · Ratification · Gate Decision ·
Waiver.

### 2.4 Waivers

A subject that fails a gate may proceed only with a **Waiver**: an explicit, signed, time-boxed
exception carrying (a) the failing score(s), (b) business/technical rationale, (c) a remediation
deadline, and (d) the ratifier's signature under SoD. Waivers are audited and expire; an expired waiver
re-blocks the subject. Waivers can never be self-granted by the claimant.

---

## 3. Prior Art Discovery Architecture

(Full detail in `NVF-0002`. Summary here.)

**Source classes (registry-driven connectors):** patent corpora, academic/scholarly corpora, standards
bodies, open-source repositories, product/industry documentation, internal UCOS knowledge fabric, and
prior UCOS decisions/architecture canon (self-overlap detection).

**Pipeline (conceptual):**
```
sources → ingest → normalize → Prior-Art Record → structural + semantic indexing
        → candidate retrieval (k-NN over embeddings + structural filters)
        → overlap scoring (per candidate) → nearest-art set → analyst adjudication
        → Prior-Art Evidence Bundle (signed, corpus-snapshot-bound)
```

**Fail-closed freshness.** Each source carries a freshness policy (max staleness). If a source is
unreachable or stale, retrieval marks the corpus **incomplete**; any Novelty Score computed against an
incomplete corpus is **capped** and flagged `corpus-incomplete`, and cannot reach the highest band.

**Corpus snapshot binding.** Every verdict references a `corpusSnapshotId` + `asOfDate`. A verdict is
only meaningful relative to what was searchable at evaluation time; later art can reopen the verdict.

**Overlap output.** `PriorArtOverlap` ∈ [0,1] per candidate; the subject-level overlap is the max (or a
configured high-percentile) over the nearest-art set, with the contributing art enumerated.

---

## 4. Novelty Scoring Framework

### 4.1 Universal scoring mechanics

- Every sub-dimension is scored on an anchored **0–4 rubric** (0 = none, 1 = marginal, 2 = moderate,
  3 = strong, 4 = exceptional), with a written anchor per level (rubrics are registry data).
- A dimension score is `100 × Σ(wᵢ · sᵢ/4)` over its sub-dimensions, where weights `wᵢ` sum to 1.
- Every sub-dimension score carries an **evidence reference** and a **confidence** ∈ {low, med, high}.
  Missing evidence ⇒ sub-dimension = 0 and dimension flagged `evidence-gap` (deny-by-default).
- Scores are **capped** by data-quality flags (e.g., `corpus-incomplete` caps Novelty ≤ 59).

### 4.2 The five scores

Each score is 0–100. Definitions, sub-dimensions, and default weights below; all weights are rubric
data and may be re-versioned only by the Rubric Authority.

#### Novelty Score (NS) — how new is the subject relative to known art?
| Sub-dimension | Default weight | Meaning |
| --- | --- | --- |
| Conceptual originality | 0.25 | Is the core idea new (not merely a re-label)? |
| Mechanism originality | 0.20 | Is the *how* (mechanism/method) new? |
| Combinatorial novelty | 0.20 | Novel arrangement/integration of known parts. |
| Prior-art distance | 0.20 | Semantic+structural distance from nearest art (= `1 − overlap`). |
| Non-obviousness | 0.15 | Would a skilled practitioner find it non-obvious? |

`NS = 100 × (0.25·c + 0.20·m + 0.20·k + 0.20·d + 0.15·o)/4`. **Cap:** `corpus-incomplete` ⇒ NS ≤ 59.

#### Differentiation Score (DS) — how distinct vs industry/competitive alternatives? (detail in NVF-0003)
| Sub-dimension | Default weight |
| --- | --- |
| Functional differentiation | 0.25 |
| Architectural differentiation | 0.25 |
| Capability/performance delta | 0.20 |
| Category posture (incremental → category-creating) | 0.15 |
| Substitution difficulty | 0.15 |

#### Patent Potential Score (PPS) — patentability × claim value? (detail in NVF-0004)
| Sub-dimension | Default weight |
| --- | --- |
| Novelty (imported from NS) | 0.20 |
| Non-obviousness | 0.20 |
| Utility / industrial applicability | 0.10 |
| Enablement / concreteness | 0.15 |
| Claim-breadth potential | 0.15 |
| Design-around difficulty | 0.10 |
| Freedom-to-operate clearance (inverse of blocking-art risk) | 0.10 |

#### Research Potential Score (RPS) — contribution to knowledge? (detail in NVF-0004)
| Sub-dimension | Default weight |
| --- | --- |
| Open-problem relevance (addresses a registered research gap) | 0.25 |
| Theoretical contribution | 0.20 |
| Empirical/experimental potential | 0.15 |
| Publishability / venue fit | 0.15 |
| Reproducibility | 0.15 |
| Expected impact / citation potential | 0.10 |

#### Commercial Defensibility Score (CDS) — moat durability? (detail in NVF-0003)
| Sub-dimension | Default weight |
| --- | --- |
| Value-proposition uniqueness | 0.20 |
| Replication barrier height | 0.20 |
| IP protectability (from PPS) | 0.15 |
| Data/network effects | 0.15 |
| Time-to-replicate by a capable competitor | 0.15 |
| Strategic control points (standards, integration, switching cost) | 0.15 |

### 4.3 Composite: Novelty Verification Index (NVI)

```
NVI = wNS·NS + wDS·DS + wPPS·PPS + wRPS·RPS + wCDS·CDS
default weights: wNS 0.30, wDS 0.25, wCDS 0.20, wPPS 0.15, wRPS 0.10
```
Weights are **profile-selectable** by subject intent (e.g., a research-oriented subject raises `wRPS`;
a moat-oriented subject raises `wCDS`). The active profile is recorded on the verdict.

### 4.4 Bands, thresholds, and archetype detection

| NVI band | Label | Disposition |
| --- | --- | --- |
| 0–39 | **Commodity risk** | **BLOCK.** Route to remediation; no gate pass without waiver. |
| 40–59 | Weak / derivative | Conditional; remediation plan required; no patent filing. |
| 60–79 | Differentiated | Pass with conditions; patent triage; research triage. |
| 80–100 | Novel & defensible | Pass; strong patent candidate; research candidate. |

**Archetype flags (independent of band, any ⇒ escalate):**
- **Commodity Architecture** — DS < 40 **and** CDS < 40.
- **Duplicate Architecture** — `PriorArtOverlap ≥ 0.85` against a single dominant art item.
- **Known Industry Pattern** — nearest art is a named, widely-adopted pattern with overlap ≥ 0.7.
- **Weak Patent Candidate** — PPS < 50 **or** FTO-clearance sub-score ≤ 1 (blocking art present).

### 4.5 Confidence & recomputation

- Verdict **confidence** = min over contributing evidence confidences, adjusted down by data-quality
  flags. Low-confidence verdicts cannot enter the top band.
- **Recomputation triggers:** new subject version, newly ingested prior art matching the subject's
  retrieval profile, competitive-landscape change, rubric re-version, or verdict expiry.

---

## 5. Differentiation Framework

(Full detail in `NVF-0003`.) Differentiation answers "how is this distinct from what the industry
already ships or standardizes?" It compares the subject against a **Comparator Set** (named competitors,
standards, reference architectures, and OSS baselines) across functional, architectural, capability,
category, and substitution axes, producing the Differentiation Score and a **Differentiation Assessment**
record enumerating each comparator, the delta, and the evidence.

Key constructs: Comparator Record, Differentiation Axis rubric, Delta Evidence, Category Posture
(sustaining vs disruptive vs category-creating), and Substitution Analysis (how easily a buyer replaces
the subject with an alternative).

---

## 6. Research Gap Analysis Framework

(Full detail in `NVF-0004`.) A **Research Gap** is a registered, evidence-backed statement that a
problem is open (unsolved, partially solved, or solved only under assumptions UCOS violates). Subjects
are mapped to the gaps they address; RPS credits open-problem relevance only when a subject links to a
live, non-closed gap with corroborating literature evidence. Gaps have lifecycle states (open →
partially-addressed → addressed → closed → reopened) and are themselves audited artifacts.

---

## 7. Competitive Analysis Framework

(Full detail in `NVF-0003`.) Maintains the **Comparator Registry** — competitors, products, standards,
and reference architectures — each as a versioned record with capability profiles, claims, and evidence
provenance. Competitive analysis feeds both DS (differentiation deltas) and CDS (replication barriers,
time-to-replicate, control points). Landscape changes (new entrant, competitor release, standard
revision) are ingested as events that trigger recomputation of affected verdicts.

---

## 8. Patent Opportunity Framework

(Full detail in `NVF-0004`.) For subjects scoring in the Differentiated/Novel bands, the Patent Analyst
produces a **Patent-Opportunity Assessment**: inventive concept statement, candidate independent/dependent
claim scaffolds (as prose, not legal claims), enablement notes, design-around analysis, and a
**Freedom-to-Operate** screen against blocking prior art. Output feeds PPS and, on ratification, creates
a Patent-Opportunity Registry entry with a recommended disposition (file / provisional / defensive
publication / trade-secret / drop).

---

## 9. Research Opportunity Framework

(Full detail in `NVF-0004`.) Complements patent opportunity for subjects with high RPS. Produces a
**Research-Opportunity Record**: contribution statement, target venue class, experiment/eval plan
sketch, reproducibility requirements, and a build-vs-publish-vs-both recommendation. Distinguishes
disclosures that strengthen research standing from those that would jeopardize patentability (timing
interlock with Section 17).

---

## 10. Novelty Registry Architecture

**Reserved keyspace:** `novelty:*`. All registries are tenant/domain-partitioned and evolution-persisted.

**Novelty Subject Descriptor (NSD)** — the universal, subject-type-agnostic record evaluated by the
fabric (see Section “Universal Evaluation Framework”). Conceptual fields:
`subjectId, subjectType ∈ {fabric, engine, registry, policy, algorithm, governance-mechanism},
title, abstract, claimBasis, componentDecomposition[], mechanismStatement, inputsOutputs,
priorUcosLinks[], intentProfile, version, tenant/domain, provenance`.

**Novelty Verdict Record** — `subjectId, subjectHash, corpusSnapshotId, asOfDate, profile,
scores{NS,DS,PPS,RPS,CDS,NVI}, band, archetypeFlags[], confidence, dataQualityFlags[], evidenceRefs[],
adjudicationRef, ratificationRef, expiresAt, state`.

**Verdict lifecycle:** `draft → evidence-gathered → scored → adjudicated → ratified → active →
(superseded | expired | reopened | revoked)`. Guarded transitions; each transition signed + audited;
`active` binds to gates.

**Registry invariants:** append-only versions (supersede-not-overwrite); a subject always resolves to
its latest non-revoked ratified verdict; revoked/expired verdicts fail closed at gate-check time.

---

## 11. Prior Art Registry Architecture

**Keyspace:** `novelty:priorart:*`. (Full schema in `NVF-0002`.)

**Prior-Art Record** — `artId, sourceClass, sourceRef, canonicalTitle, identifiers{doi, patentNo, url,
repoRef}, publicationDate, jurisdiction (if patent), abstractText, structuralFeatures[], embeddingRef,
provenance, corpusSnapshotIds[]`.

**Prior-Art Evidence Bundle** — `bundleId, subjectId, subjectHash, corpusSnapshotId, asOfDate,
nearestArt[]{artId, overlap, rationale, contributingFeatures[]}, subjectOverlap, completenessFlag,
analyst, signature`.

**Invariants:** immutable art records (new versions on source change); bundles are corpus-snapshot-bound
and signed; `completenessFlag = incomplete` propagates the fail-closed cap to NS.

---

## 12. Differentiation Registry Architecture

**Keyspace:** `novelty:diff:*` and `novelty:comparator:*`. (Full schema in `NVF-0003`.)

**Comparator Record** — `comparatorId, kind ∈ {competitor, product, standard, reference-arch, oss},
name, capabilityProfile[], claims[], evidenceRefs[], lastReviewedAt, provenance`.

**Differentiation Assessment** — `assessmentId, subjectId, subjectHash, comparatorSet[],
axisScores{functional, architectural, capability, category, substitution}, deltas[]{comparatorId, axis,
delta, evidenceRef}, DS, categoryPosture, analyst, signature`.

---

## 13. Research Gap Registry Architecture

**Keyspace:** `novelty:gap:*`. (Full schema in `NVF-0004`.)

**Research-Gap Record** — `gapId, statement, domain, gapType ∈ {unsolved, partially-solved,
assumption-limited}, evidenceRefs[], state ∈ {open, partially-addressed, addressed, closed, reopened},
addressedBySubjects[], openedBy, lastReviewedAt, provenance`.

**Invariants:** RPS open-problem credit requires a link to a `open`/`partially-addressed` gap with
corroborating literature; closing a gap reopens dependent verdicts for recomputation.

---

## 14. Patent Opportunity Registry Architecture

**Keyspace:** `novelty:patent:*`. (Full schema in `NVF-0004`.)

**Patent-Opportunity Record** — `opportunityId, subjectId, subjectHash, inventiveConcept,
claimScaffold{independent[], dependent[]}, enablementNotes, designAroundAnalysis, ftoScreen{blockingArt[],
clearance}, PPS, recommendedDisposition ∈ {file, provisional, defensive-publication, trade-secret, drop},
priorityDate?, state ∈ {identified, triaged, drafting, filed, granted, abandoned}, patentAnalyst,
ratification, signature`.

**Interlock:** disposition `defensive-publication` and any research disclosure are gated by the Patent
Review Workflow (Section 17) to protect priority.

---

## 15. Novelty Review Workflow

```
Claimant registers NSD + Novelty Claim
      │  (deny-by-default: subject presumed non-novel)
      ▼
Prior-Art Analyst gathers evidence → Prior-Art Evidence Bundle (corpus-snapshot-bound)
      ▼
Differentiation Analyst → Differentiation Assessment
      ▼
Novelty Scorer applies rubrics → Novelty Score Card {NS, DS, ... NVI, band, archetypeFlags}
      ▼
Novelty Adjudicator confirms/overrides with rationale (SoD: ≠ scorer, ≠ claimant)
      ▼
Novelty Ratifier signs terminal verdict (SoD: quorum) → Verdict = active → binds to Gates
      ▼
(continuous) recomputation triggers reopen the verdict as needed
```
Every step is signed, hash-chained, and evolution-persisted. Any missing prerequisite ⇒ the workflow
stalls fail-closed (cannot reach `ratified`).

---

## 16. Research Review Workflow

```
Trigger: subject with RPS ≥ threshold OR explicit research nomination
      ▼
Research Analyst maps subject → Research-Gap Record(s) (must be open/partially-addressed)
      ▼
Research-Opportunity Record drafted (contribution, venue class, eval plan, reproducibility)
      ▼
Patentability interlock check (Section 17) — disclosure timing vs patent priority
      ▼
Adjudication → Ratification → disposition {publish, build-first, dual-track, defer}
```
Fail-closed: no research disclosure recommendation is ratified until the patent interlock clears.

---

## 17. Patent Review Workflow

```
Trigger: subject in Differentiated/Novel band OR explicit patent nomination
      ▼
Patent Analyst → inventive concept + claim scaffold + enablement notes
      ▼
Freedom-to-Operate screen against blocking prior art (fail-closed on blocking art)
      ▼
Design-around analysis → design-around-difficulty sub-score
      ▼
PPS computed → Adjudication (SoD) → Ratification
      ▼
Disposition {file | provisional | defensive-publication | trade-secret | drop} + priority handling
      │
      └── Disclosure interlock: if research disclosure is pending, patent priority takes precedence
          unless a signed waiver records an explicit publish-first decision.
```

**Priority interlock rule.** Public disclosure (research or otherwise) that could bar patentability may
not be ratified while a patent disposition of `file`/`provisional` is `identified`/`triaged`/`drafting`
for the same subject, except by signed waiver with recorded rationale.

---

## 18. Governance Gates

Gates bind novelty verdicts to the lifecycle of **any** UCOS artifact. They are expressed as policy
(deny-by-default) and evaluated by the Control Plane at defined checkpoints. Default gate set:

| Gate | Checkpoint | Rule (default) | On fail |
| --- | --- | --- | --- |
| **NVF-G1 Registration** | Subject registered | NSD complete + falsifiable claim present | Reject registration |
| **NVF-G2 Prior-Art Clearance** | Before scoring | Prior-Art Evidence Bundle present + corpus complete | Cap NS; block advance |
| **NVF-G3 Novelty Floor** | Construction authorization of a fabric/engine/etc. | `NVI ≥ 60` **and** no unresolved archetype flag | Block or require waiver |
| **NVF-G4 Duplicate Block** | Any advance | No `Duplicate Architecture` / `Known Industry Pattern` flag | Hard block (waiver ineligible without exec sign-off) |
| **NVF-G5 Patent Triage** | Differentiated/Novel band | Patent-Opportunity disposition recorded | Block release-as-novel claim |
| **NVF-G6 Disclosure Safety** | Any public disclosure | Patent priority interlock cleared | Block disclosure |
| **NVF-G7 Verdict Freshness** | Periodic + pre-release | Active verdict not expired; recomputed after landscape change | Reopen verdict; block release |
| **NVF-G8 Waiver Integrity** | Whenever a waiver is used | Waiver signed under SoD, unexpired, rationale present | Void waiver; re-block |

Gates are additive to (not replacements for) existing construction/quality/security/release gates.
`NVF-G3`/`NVF-G4` integrate with the existing Construction Authorization program: **no new Fabric,
Engine, Registry, Policy, Algorithm, or Governance Mechanism is construction-authorized without a
passing (or explicitly waived) novelty verdict.**

---

## 19. Risk Management

| Risk | Description | Mitigation |
| --- | --- | --- |
| **False novelty** | Subject scored novel due to blind spots in the corpus | Fail-closed `corpus-incomplete` cap; multi-source coverage KPIs; periodic re-scan; verdict expiry |
| **Prior-art blind spot** | Missing source class (e.g., non-English, grey literature, OSS) | Registry-driven source coverage targets; coverage KPI in Section 20; escalation when a class is absent |
| **Evaluator bias / gaming** | Claimant influences score; inflated self-assessment | Strict SoD; independent adjudication; audit of override rationales; anomaly detection on score distributions |
| **Semantic-distance error** | Embedding model misjudges overlap | Human adjudication mandatory in bands near thresholds; confidence gating; contributing-feature explanations required |
| **Landscape staleness** | Competitor/standard changes not reflected | Event-driven recomputation; freshness gate NVF-G7 |
| **IP leakage** | Sensitive inventive concepts exposed via disclosure | Disclosure-safety gate NVF-G6; priority interlock; secret-material excluded from records (references only) |
| **Adversarial prior art** | Injected/forged art to defeat a claim | Provenance + signatures on art records; source-class trust weighting; boundary-scoped verdict acceptance |
| **Rubric drift** | Weights tuned to force passes | Rubric changes are Approval-Required, versioned via Evolution, SoD-signed, fully audited |
| **Over-blocking** | Legitimate incremental work stalled | Waiver mechanism with rationale + deadline; band-appropriate dispositions |
| **Reproducibility loss** | Verdict cannot be re-derived | Corpus-snapshot binding + evidence refs + hash-chained audit make every verdict reproducible |

---

## 20. Success Metrics

**Coverage & quality**
- Novelty coverage: % of live subjects (fabrics/engines/registries/policies/algorithms/governance
  mechanisms) with an active, non-expired ratified verdict. Target: 100% of construction-authorized
  subjects.
- Prior-art source coverage: % of required source classes reachable + fresh at evaluation. Target ≥ 95%.
- Verdict reproducibility: % of sampled verdicts independently re-derivable from stored evidence.
  Target: 100%.

**Outcome**
- Mean NVI of the active portfolio; % of portfolio in Novel/Differentiated bands (trend up).
- Archetype-flag incidence (commodity/duplicate/known-pattern/weak-patent) — trend down.
- Patent throughput: opportunities identified → triaged → filed; grant rate of filed (lagging).
- Research throughput: gaps addressed; disclosures ratified; publications from ratified opportunities.

**Process health**
- Time-to-verdict (registration → ratification); time-to-recompute after a landscape event.
- Waiver rate and mean waiver age; expired-waiver re-block count (should trend to zero).
- SoD-violation attempts blocked (should be > 0 detections with 0 successes).
- Adjudicator override rate + override-with-rationale completeness (100% rationale required).

**Defensibility**
- Mean Commercial Defensibility Score of shipped subjects; mean design-around difficulty of filed
  patent opportunities.

---

## Universal Evaluation Framework (evaluates every future subject)

The fabric evaluates **any** UCOS construct through one uniform pipeline by normalizing it into a
**Novelty Subject Descriptor (NSD)** and selecting a **subject-type adapter** that supplies type-specific
rubric anchors and comparator profiles.

### Subject-type adapters
| subjectType | What "novelty" primarily means | Type-specific anchors (examples) |
| --- | --- | --- |
| **Fabric** | New control surface / new governance capability | new invariants enforced; new lifecycle; new cross-fabric composition |
| **Engine** | New mechanism/algorithmic behavior | new computational method; new guarantees; new complexity/perf envelope |
| **Registry** | New addressing/governance-of-data model | new keyspace semantics; new integrity/lineage model |
| **Policy** | New decision logic / enforcement model | new rule class; new evaluation semantics; new deny-by-default construct |
| **Algorithm** | New method or novel combination | new procedure; novel arrangement; new bounds/properties |
| **Governance Mechanism** | New assurance/verification/attestation construct | new SoD topology; new tamper-evidence; new gate class |

### Uniform pipeline (applies to all types)
```
1. Normalize    → NSD (decompose into components + mechanism + claim basis + prior UCOS links)
2. Retrieve     → nearest prior art (adapter-tuned retrieval profile) → PriorArtOverlap
3. Compare      → comparator set (adapter-tuned) → differentiation deltas
4. Map          → research gaps (if any) → open-problem relevance
5. Assess IP    → inventive concept + FTO screen → patent sub-scores
6. Score        → NS, DS, PPS, RPS, CDS → NVI + band + archetype flags (with caps + confidence)
7. Adjudicate   → SoD human confirmation/override with rationale
8. Ratify       → terminal signed verdict → bind to Gates NVF-G1..G8
9. Monitor      → recomputation triggers keep the verdict live
```

### Determinism & auditability
Given the same NSD hash, corpus snapshot, comparator set, rubric version, and profile, the computed
scores are **reproducible**. Human adjudication is recorded as a signed delta over the computed scores
with mandatory rationale, so the final verdict remains fully explainable and independently verifiable.

---

## Traceability

- **Program:** NVF-0001. **Deliverables:** NVF-0001..0004.
- **Reused ratified fabrics (design intent):** substrate (AD-0016), control (AD-0017), federation
  (AD-0018), evolution (AD-0019), knowledge (AD-0020), ontology (AD-0021).
- **Additivity guarantee:** reserved `novelty:` namespace; no core dir modified; gates are additive to
  existing construction/quality/security/release gates.
- **Mode:** DESIGN ONLY — no code, no implementation emitted.
