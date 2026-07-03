# NVF-0003 — Differentiation Model

**Parent:** NVF-0001 (Novelty Verification Fabric). **Mode:** DESIGN ONLY — no code.
**Keyspace:** `novelty:diff:*`, `novelty:comparator:*`.

Prior art (NVF-0002) answers "is this new?"; differentiation answers "is this **distinct from what the
industry actually ships or standardizes**, and can that distinction be **defended commercially**?" This
document defines the Differentiation Score (DS), the Competitive Analysis Framework, and the Commercial
Defensibility Score (CDS).

---

## 1. Comparator model (Competitive Analysis Framework)

Differentiation is measured against a **Comparator Set** drawn from the **Comparator Registry**
(`novelty:comparator:*`). Comparators are versioned, evidence-backed records — never anecdotes.

**Comparator kinds:** `competitor` (a company/platform), `product` (a specific offering), `standard`
(an accepted spec/pattern), `reference-arch` (a canonical published architecture), `oss` (an
open-source baseline).

**Comparator Record (conceptual fields):**
```
comparatorId, kind, name, vendorOrBody?
capabilityProfile[]  { capabilityId, presence ∈ {absent, partial, full}, evidenceRef, confidence }
claims[]             { claimText, evidenceRef }        (what the comparator publicly asserts)
mechanismProfile[]   { mechanismClass, notes, evidenceRef }
lastReviewedAt, freshnessPolicy
provenance
```
**Selection rule.** The comparator set for a subject is chosen by the subject-type adapter + domain
(e.g., an Engine is compared against engines/algorithms occupying the same functional niche). The set
is recorded on the assessment so the DS is reproducible and auditable.

**Landscape freshness.** Comparator records expire per freshness policy; competitor releases, new
entrants, and standard revisions arrive as events that **reopen** affected differentiation assessments
(feeds NVF-G7).

---

## 2. Differentiation axes (DS)

Each axis is scored 0–4 against the comparator set (anchored rubric), with evidence and confidence.

| Axis | Weight | Question | Anchor 0 → 4 |
| --- | --- | --- | --- |
| **Functional** | 0.25 | Does it do things comparators cannot? | identical feature set → unique capabilities absent everywhere else |
| **Architectural** | 0.25 | Is the structure/approach distinct? | same reference arch → fundamentally different structure/invariants |
| **Capability/performance delta** | 0.20 | Is there a measurable superiority? | parity → order-of-magnitude or qualitatively new guarantee |
| **Category posture** | 0.15 | Incremental vs category-defining? | me-too → creates a new category |
| **Substitution difficulty** | 0.15 | How hard to swap out for an alternative? | trivially substitutable → no viable substitute |

`DS = 100 × (0.25·fn + 0.25·arch + 0.20·cap + 0.15·cat + 0.15·sub)/4`.

**Delta evidence.** For each axis, the Differentiation Analyst records explicit **deltas**: `{comparatorId,
axis, delta description, direction (advantage/parity/deficit), evidenceRef}`. A claimed advantage with no
evidence scores 0 for that axis (deny-by-default).

---

## 3. Category posture (sustaining → disruptive → category-creating)

| Posture | Meaning | Typical DS category-axis anchor |
| --- | --- | --- |
| **Sustaining** | Incremental improvement within an existing category | 0–1 |
| **Low-end / new-market disruptive** | Reframes an existing category on new dimensions | 2–3 |
| **Category-creating** | Establishes a category that did not previously exist | 4 |

Category-creating posture must be justified against the comparator set (no comparator occupies the
category) **and** against prior art (NVF-0002) — a category is only "new" if neither competitors nor
art already define it.

---

## 4. Substitution analysis

Substitution difficulty measures how easily a buyer/operator could replace the subject with an
alternative and get "good enough" results. Inputs: functional coverage of the best substitute,
switching cost (integration, data migration, retraining), and any hard dependency the subject uniquely
satisfies. High substitution difficulty is a differentiation *and* a defensibility signal (feeds CDS).

---

## 5. Commercial Defensibility Score (CDS)

CDS answers "once differentiated, how durable is the moat?" Sub-dimensions (0–4 each):

| Sub-dimension | Weight | Question |
| --- | --- | --- |
| **Value-proposition uniqueness** | 0.20 | Is the value delivered unavailable elsewhere? |
| **Replication-barrier height** | 0.20 | How hard is it to rebuild (know-how, complexity, integration)? |
| **IP protectability** | 0.15 | Imported from PPS (patent/trade-secret protectability). |
| **Data/network effects** | 0.15 | Does usage compound advantage (data, ecosystem, integrations)? |
| **Time-to-replicate** | 0.15 | Estimated competitor lead-time to parity (longer = higher score). |
| **Strategic control points** | 0.15 | Standards position, integration lock-in, switching cost, distribution. |

`CDS = 100 × Σ(wᵢ·sᵢ/4)`. **Interlock:** CDS's IP-protectability sub-dimension is sourced from the
Patent Potential Score (NVF-0004), so a weak patent posture directly lowers commercial defensibility.

**Time-to-replicate estimation.** Estimated from replication-barrier height, comparator capability
proximity, and public availability of the enabling know-how (art + OSS). Recorded with an explicit
assumption set so the estimate is auditable.

---

## 6. Differentiation Assessment (schema — conceptual)

```
assessmentId, subjectId, subjectHash
comparatorSet[]        (comparatorId + version, recorded for reproducibility)
axisScores { functional, architectural, capability, category, substitution }
deltas[]               { comparatorId, axis, description, direction, evidenceRef, confidence }
DS
categoryPosture ∈ { sustaining, disruptive, category-creating }
substitutionAnalysis { bestSubstitute, coverage, switchingCost, difficulty }
analyst, signature, expiresAt
state ∈ { draft, evidenced, scored, adjudicated, ratified, active, superseded, reopened }
```
Signed, versioned, evolution-persisted; corpus/comparator-set-bound for reproducibility.

---

## 7. Commercial Uniqueness output

"Commercial Uniqueness" (an NVF-0001 mission item) is the joint reading of **DS × CDS**:

| DS \ CDS | Low CDS (<40) | Mid CDS (40–69) | High CDS (≥70) |
| --- | --- | --- | --- |
| **Low DS (<40)** | Commodity (block) | Fragile niche | Defensible-but-undifferentiated (investigate) |
| **Mid DS (40–69)** | Differentiated-but-copyable | Viable | Strong |
| **High DS (≥70)** | Novel-but-exposed (protect fast) | Strong | Category leader |

The `Commodity Architecture` archetype (NVF-0001 §4.4) fires precisely in the top-left quadrant
(DS < 40 and CDS < 40) and hard-routes to remediation.

---

## 8. Competitive monitoring & events

Landscape events keep DS/CDS live:
- `competitor.release`, `competitor.entry`, `standard.revision`, `oss.baseline.change` →
  reopen affected assessments and recompute DS/CDS; potential archetype re-flagging.
- Comparator freshness expiry → assessment marked stale; blocks release-as-differentiated until refreshed.
- Erosion alerts: when a comparator closes a previously-claimed delta, the advantage is downgraded with
  an audit trail (prevents stale "we're unique" claims).

---

## 9. Differentiation risks & controls

| Risk | Control |
| --- | --- |
| Cherry-picked comparators | Comparator set selected by adapter+domain rules, recorded, adjudicated under SoD |
| Unevidenced advantage claims | Deny-by-default: no evidence ⇒ axis score 0; mandatory delta evidence refs |
| Stale landscape | Comparator freshness policy + event-driven reopen + NVF-G7 |
| Optimistic time-to-replicate | Explicit assumption set; adjudicator review; conservative default anchors |
| Category inflation | Category-creating posture cross-checked against both comparators and prior art |
| Moat overstatement | CDS IP sub-score bound to PPS; independent adjudication of replication barriers |

---

## 10. Differentiation success metrics

- Mean DS and mean CDS of the active portfolio (trend up).
- Commercial-uniqueness quadrant distribution (share in Strong/Category-leader quadrants, trend up).
- Comparator freshness: % of comparators within freshness policy (target ≥ 95%).
- Delta-evidence completeness: % of scored axes with evidence refs (target 100%).
- Advantage-erosion detection latency: time from competitor change to assessment reopen (minimize).
- Archetype `Commodity Architecture` incidence (trend to zero).

---

## Traceability
NVF-0003 expands NVF-0001 §5 (Differentiation), §7 (Competitive Analysis), and the CDS definition; it
supplies DS + CDS inputs to the NVI and the `Commodity Architecture` archetype. CDS IP sub-score is
sourced from NVF-0004 (PPS). Reserved `novelty:diff:*` / `novelty:comparator:*`. DESIGN ONLY.
