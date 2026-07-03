# NVF-0004 — Research Gap Framework

**Parent:** NVF-0001 (Novelty Verification Fabric). **Mode:** DESIGN ONLY — no code.
**Keyspace:** `novelty:gap:*`, `novelty:research:*`, `novelty:patent:*`.

This framework defines how UCOS registers and tracks open research problems, maps subjects to the gaps
they address, and converts high-value subjects into **research opportunities** and **patent
opportunities**. It defines the **Research Potential Score (RPS)** and the **Patent Potential Score
(PPS)** in depth, and the disclosure/priority interlock between publishing and patenting.

---

## 1. Research-gap model

A **Research Gap** is an evidence-backed statement that a problem is open. Deny-by-default: a subject
earns open-problem credit only by linking to a *live* gap that cites corroborating literature — a
subject cannot assert its own novelty by declaring a gap unilaterally (the gap must be independently
evidenced and adjudicated).

**Gap types:**
| gapType | Meaning |
| --- | --- |
| `unsolved` | No known solution in the surveyed literature/art. |
| `partially-solved` | Solutions exist but with acknowledged limitations. |
| `assumption-limited` | Solved only under assumptions UCOS explicitly violates/relaxes. |

**Research-Gap Record (conceptual fields):**
```
gapId, statement, domain, gapType
evidenceRefs[]           (literature/art establishing the gap; ties to NVF-0002 prior art)
state ∈ { open, partially-addressed, addressed, closed, reopened }
addressedBySubjects[]    (subjectIds claiming to address it, with contribution notes)
severity ∈ {niche, notable, foundational}
openedBy, lastReviewedAt, provenance, signature
```

**Gap lifecycle:** `open → partially-addressed → addressed → closed`, with `reopened` reachable from
`addressed`/`closed` when new limitations or counter-evidence emerge. Closing a gap **reopens** the
verdicts of subjects whose RPS depended on it (feeds NVF-G7 freshness recomputation).

---

## 2. Research Potential Score (RPS) — definition

Contribution to knowledge. Sub-dimensions (0–4 anchored, evidence + confidence each):

| Sub-dimension | Weight | Question | Deny-by-default rule |
| --- | --- | --- | --- |
| **Open-problem relevance** | 0.25 | Does it address a live registered gap? | 0 unless linked to `open`/`partially-addressed` gap with evidence |
| **Theoretical contribution** | 0.20 | New theory/model/bounds/framework? | 0 without a stated contribution |
| **Empirical/experimental potential** | 0.15 | Can it be evaluated/measured convincingly? | needs an eval sketch |
| **Publishability / venue fit** | 0.15 | Does a credible venue class exist? | needs a target venue class |
| **Reproducibility** | 0.15 | Can others reproduce it? | needs reproducibility plan |
| **Expected impact** | 0.10 | Citation/influence potential | evidence-informed estimate |

`RPS = 100 × Σ(wᵢ·sᵢ/4)`. RPS raises the NVI weight `wRPS` under a research-oriented intent profile
(NVF-0001 §4.3). A high RPS routes the subject into the Research Review Workflow (NVF-0001 §16).

---

## 3. Research Opportunity Framework

For subjects with RPS above threshold, the Research Analyst produces a **Research-Opportunity Record**:

```
researchOppId, subjectId, subjectHash
contributionStatement            (the claimed advance, falsifiable)
addressedGaps[]                  (gapIds; must be live)
targetVenueClass                 (e.g., systems / security / DB / PL / ML venue class — not a specific venue)
evaluationPlanSketch             (datasets/benchmarks/baselines/metrics at a design level)
reproducibilityRequirements      (artifacts, seeds, environment capture)
disclosureRisk ∈ {none, low, high}   (does publishing bar patentability?)
recommendedDisposition ∈ { publish, build-first, dual-track, defer }
analyst, adjudication, ratification, signature
```

**Disposition semantics:**
- `publish` — knowledge contribution outweighs IP exposure; proceed after disclosure-safety gate.
- `build-first` — implement/validate internally before any disclosure.
- `dual-track` — pursue patent priority *and* publication (patent-first sequencing).
- `defer` — insufficient maturity/evidence.

---

## 4. Patent Potential Score (PPS) — definition

Patentability × claim value. Sub-dimensions (0–4 anchored, evidence + confidence each):

| Sub-dimension | Weight | Question |
| --- | --- | --- |
| **Novelty** (imported from NS) | 0.20 | Is it new vs prior art? (NVF-0002) |
| **Non-obviousness** | 0.20 | Non-obvious to a skilled practitioner? |
| **Utility / industrial applicability** | 0.10 | Concrete, useful application? |
| **Enablement / concreteness** | 0.15 | Can it be described specifically enough to enable? |
| **Claim-breadth potential** | 0.15 | Can meaningful independent claims be drawn? |
| **Design-around difficulty** | 0.10 | How hard to engineer around the claims? |
| **FTO clearance** | 0.10 | Freedom to operate (inverse of blocking-art risk). |

`PPS = 100 × Σ(wᵢ·sᵢ/4)`. **Fail-closed:** if the FTO screen finds blocking art (clearance sub-score
≤ 1), the `Weak Patent Candidate` archetype fires (NVF-0001 §4.4) regardless of other sub-scores.

PPS's IP-protectability reading is exported to the Commercial Defensibility Score (NVF-0003 §5), so
patent posture and moat durability move together.

---

## 5. Patent Opportunity Framework

For subjects in the Differentiated/Novel bands, the Patent Analyst (distinct from claimant) produces a
**Patent-Opportunity Record**:

```
opportunityId, subjectId, subjectHash
inventiveConcept                 (the core inventive idea, stated crisply — prose, not legal claims)
claimScaffold { independent[], dependent[] }   (structured prose scaffolds; NOT filed claims)
enablementNotes                  (what must be disclosed to enable; identifies gaps to close)
designAroundAnalysis             (plausible workarounds → design-around-difficulty sub-score)
ftoScreen { blockingArt[], clearance ∈ {clear, caution, blocked} }   (uses NVF-0002)
PPS
recommendedDisposition ∈ { file, provisional, defensive-publication, trade-secret, drop }
priorityDate?
state ∈ { identified, triaged, drafting, filed, granted, abandoned }
patentAnalyst, adjudication, ratification, signature
```

**Disposition guidance:**
| Disposition | When |
| --- | --- |
| `file` / `provisional` | High PPS, clear/caution FTO, defensible claim breadth |
| `defensive-publication` | Novel but low claim value or better as freedom-preserving disclosure |
| `trade-secret` | Valuable but hard to detect infringement / better kept secret |
| `drop` | Low PPS or blocked FTO with no viable design-around |

> **Legal disclaimer.** The fabric produces decision-support artifacts and scores. Claim scaffolds are
> engineering prose, not legal claims; filing decisions and actual claim drafting require qualified
> patent counsel. PPS estimates prosecution potential, not grant certainty.

---

## 6. Disclosure / priority interlock

Publishing can destroy patentability; patenting can delay publishing. The interlock (NVF-0001 §17)
sequences them safely:

```
if patent disposition ∈ {file, provisional} and state ∈ {identified, triaged, drafting}:
      public disclosure (research publish / defensive publication) is BLOCKED (NVF-G6)
      unless a signed waiver records an explicit publish-first decision (SoD + rationale)
else:
      disclosure proceeds after disclosure-safety gate clears
dual-track:
      secure priority (provisional/filing) THEN publish → both objectives preserved
```
This protects priority by default while still allowing a deliberate, recorded choice to publish first.

---

## 7. Registries (schemas summarized)

- **Research-Gap Registry** (`novelty:gap:*`) — §1 schema; gap lifecycle; RPS credit source.
- **Research-Opportunity Registry** (`novelty:research:*`) — §3 schema; disposition + disclosure risk.
- **Patent-Opportunity Registry** (`novelty:patent:*`) — §5 schema; disposition + FTO + priority state.

All records are signed, versioned, evolution-persisted, hash-chained in the novelty audit, and
tenant/domain-scoped. Gap closures and new prior art reopen dependent RPS/PPS verdicts.

---

## 8. Research/patent risks & controls

| Risk | Control |
| --- | --- |
| Self-declared gaps (novelty laundering) | Gaps require independent evidence + SoD adjudication; deny-by-default RPS credit |
| Premature disclosure destroying patent rights | Disclosure-safety gate NVF-G6 + priority interlock + waiver discipline |
| Overstated patent potential | FTO fail-closed on blocking art; independent Patent-Analyst + adjudicator; conservative anchors |
| Stale gap state (problem already solved) | Gap freshness review; new-art monitoring reopens; closing gap reopens dependent verdicts |
| Enablement shortfall | Enablement notes required; low concreteness caps PPS; routes back to remediation |
| Secret leakage in records | Inventive concepts stored with access controls; secret material excluded (references only) |
| Venue/impact optimism | Venue *class* (not named venue) + evidence-informed impact anchors + adjudication |

---

## 9. Research/patent success metrics

- Gap coverage: % of active research-oriented subjects linked to live gaps (target maximized).
- Gap freshness: % of gaps reviewed within policy (target ≥ 95%).
- RPS distribution: share of portfolio above research threshold (trend up).
- Patent funnel: identified → triaged → filed conversion; mean PPS of filed; grant rate (lagging).
- FTO safety: % of filed opportunities with `clear`/`caution` FTO (target maximized; `blocked` → 0 filed).
- Interlock integrity: disclosure-before-priority incidents (target 0); waiver rationale completeness (100%).
- Design-around difficulty: mean of filed opportunities (trend up).

---

## Traceability
NVF-0004 expands NVF-0001 §6 (Research Gap), §8 (Patent Opportunity), §9 (Research Opportunity), §16–17
(Research/Patent workflows), and defines RPS + PPS. Consumes NVF-0002 (prior art / FTO) and exports PPS
IP-protectability to NVF-0003 (CDS). Reserved `novelty:gap:*` / `novelty:research:*` / `novelty:patent:*`.
DESIGN ONLY — no code, no implementation.
