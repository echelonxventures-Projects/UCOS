# NVF-0002 — Prior Art Framework

**Parent:** NVF-0001 (Novelty Verification Fabric). **Mode:** DESIGN ONLY — no code.
**Keyspace:** `novelty:priorart:*`, `novelty:source:*`, `novelty:corpus:*`.

Prior art is the ground truth against which novelty is measured. This framework defines how UCOS
discovers, normalizes, indexes, retrieves, scores, and adjudicates prior art, and how it binds every
verdict to a reproducible corpus snapshot. It is deny-by-default and fail-closed: **absence of a search
is never evidence of novelty**.

---

## 1. Prior-art source model

Sources are registry records (`novelty:source:*`), never hardcoded. Each has a **source class**, a
connector reference, a **trust weight**, and a **freshness policy**.

| Source class | Examples of content | Primary signal | Default trust weight |
| --- | --- | --- | --- |
| `patent` | Granted patents, published applications | Legal prior art, claim language | 1.0 |
| `scholarly` | Papers, preprints, theses, technical reports | Research prior art, methods | 0.9 |
| `standard` | Standards, RFCs, specifications | Industry-accepted patterns | 0.9 |
| `oss` | Open-source repositories, package registries | Implemented mechanisms | 0.8 |
| `product` | Product docs, whitepapers, datasheets | Commercial state of the art | 0.7 |
| `grey` | Blogs, talks, forums, disclosures | Early/informal disclosure | 0.5 |
| `ucos-internal` | Knowledge fabric, prior UCOS decisions/canon | Self-overlap / re-invention | 1.0 |

**Source record (conceptual fields):** `sourceId, sourceClass, connectorRef, trustWeight,
freshnessPolicy{maxStalenessMs}, jurisdictionScope?, language[], lastSyncAt, status ∈ {active,
degraded, unreachable}, provenance`.

**Trust weighting.** Overlap contributions are weighted by source trust; a high-overlap hit from a
`grey` source raises a flag but cannot alone establish `Duplicate Architecture` (which requires a
higher-trust corroboration). This resists adversarial/forged prior art.

---

## 2. Discovery pipeline (conceptual)

```
[sources] ──sync──▶ [ingest] ──▶ [normalize] ──▶ Prior-Art Record ──▶ [index: structural + semantic]
                                                                       │
subject NSD ──build retrieval profile──▶ [retrieve candidates] ◀──────┘
   │                                          │ (k-NN over embeddings + structural pre-filters)
   ▼                                          ▼
[overlap scoring per candidate] ──▶ nearest-art set ──▶ [analyst adjudication] ──▶ Evidence Bundle
```

### 2.1 Ingest
Pull/subscribe from connectors; deduplicate by canonical identifiers (DOI, patent number, repo+commit,
URL hash). Record provenance and the owning source. Ingest is idempotent on canonical id.

### 2.2 Normalize
Map heterogeneous records into the common **Prior-Art Record** shape; extract:
- **Text features** — title, abstract, claims/method sections.
- **Structural features** — a normalized feature vector describing *what the art does and how*:
  component decomposition, mechanism verbs, inputs/outputs, guarantees, control constructs. Structural
  features are what enable **combinatorial** and **mechanism** overlap analysis (not just text match).

### 2.3 Index
Two complementary indexes:
- **Semantic index** — embedding of text + structural features for approximate nearest-neighbor recall.
- **Structural index** — filterable facets (component types, mechanism class, domain, source class,
  date, jurisdiction) for precise pre-filtering and for combinatorial matching.

### 2.4 Retrieve
A subject's **retrieval profile** (from its NSD + subject-type adapter) drives candidate recall:
semantic k-NN, widened by structural facet queries so that a lexically-different-but-structurally-same
art item is still surfaced. Recall favors sensitivity (few false negatives) because missing art is the
expensive error.

---

## 3. Prior-Art Record (registry schema — conceptual)

```
artId
sourceId, sourceClass
canonicalTitle
identifiers { doi?, patentNo?, url?, repoRef?, standardRef? }
publicationDate, jurisdiction?      (jurisdiction for patents)
abstractText
claimsOrMethodText?
structuralFeatures[]                (normalized: components, mechanismClass, io, guarantees, controls)
embeddingRef                        (vector handle; model+version recorded)
extractionConfidence ∈ {low,med,high}
provenance { ingestedAt, connectorRef, checksum }
corpusSnapshotIds[]                 (snapshots this record participates in)
status ∈ { active, superseded, retracted }
```
**Invariants:** immutable content per version (a changed source yields a new version, never an
in-place edit); `retracted` art is retained for audit but excluded from active overlap. Records are
signed by the ingesting authority; forged/unsigned art is inadmissible (deny-by-default).

---

## 4. Corpus snapshots (reproducibility backbone)

A **Corpus Snapshot** is an immutable, hash-identified manifest of exactly which art records (and
which embedding-model version + index version) were searchable at a point in time.

```
corpusSnapshotId, createdAt, asOfDate
sourceInclusion[] { sourceId, lastSyncAt, completeness ∈ {complete, partial, unreachable} }
artManifestHash                     (hash over the included artIds + versions)
embeddingModelRef, indexVersion
overallCompleteness ∈ {complete, incomplete}
```
Every verdict cites a `corpusSnapshotId`. **Reproducibility rule:** re-running retrieval + overlap on
the same snapshot + same subject hash yields the same nearest-art set and overlap values. This is what
makes a novelty verdict independently verifiable and defensible.

**Fail-closed completeness.** If any required source is `unreachable`/`partial` at snapshot time,
`overallCompleteness = incomplete`; this propagates the NS cap (≤ 59) and the `corpus-incomplete` flag
defined in NVF-0001 §4.

---

## 5. Overlap scoring model

Overlap between a subject and a candidate art item is a blended score in [0,1]:

```
overlap(subject, art) =
      wS · semanticSimilarity            (embedding cosine, normalized 0..1)
    + wM · mechanismMatch                (fraction of mechanism features shared)
    + wC · componentMatch                (fraction of components shared, arrangement-aware)
    + wG · guaranteeMatch                (shared guarantees/properties/invariants)
defaults: wS 0.35, wM 0.30, wC 0.20, wG 0.15   (weights are rubric data)
```

- **Subject-level overlap** = trust-weighted high-percentile (default: max) over the nearest-art set,
  with every contributing art item and its contributing features enumerated (explainability required).
- **Prior-art distance** used by NS = `1 − subjectOverlap`.
- **Combinatorial credit.** If no single art item exceeds a combination threshold but the subject's
  components are individually covered by *different* art items, the framework computes a **coverage
  fraction**; high coverage lowers combinatorial novelty even when per-item overlap is modest. This is
  how the fabric catches "known parts, re-arranged, but obvious" cases while still crediting genuinely
  non-obvious combinations (which the Non-obviousness sub-dimension rewards).

**Overlap bands (for triage):**
| overlap | interpretation |
| --- | --- |
| ≥ 0.85 | Near-duplicate of a single art item → `Duplicate Architecture` candidate |
| 0.70–0.84 | Strong overlap; if art is a named adopted pattern → `Known Industry Pattern` |
| 0.40–0.69 | Partial overlap; differentiation must carry novelty |
| < 0.40 | Low overlap; novelty plausible pending non-obviousness |

---

## 6. Analyst adjudication (human-in-the-loop, SoD)

Machine overlap is decision-support, not verdict. The **Prior-Art Analyst** (distinct from the
claimant) reviews the nearest-art set and:
- confirms or corrects each candidate's overlap and rationale;
- may add art the machine missed (manual discovery) or retract false hits;
- must record a written rationale for any override;
- signs the resulting **Prior-Art Evidence Bundle**.

Adjudication is **mandatory** when the subject's NVI would land within a configurable margin of a band
threshold (near-boundary cases), and whenever an archetype flag is triggered.

---

## 7. Prior-Art Evidence Bundle (schema — conceptual)

```
bundleId, subjectId, subjectHash
corpusSnapshotId, asOfDate
nearestArt[] { artId, overlap, trustWeightedOverlap, contributingFeatures[], analystRationale }
subjectOverlap, combinatorialCoverage
completenessFlag ∈ { complete, incomplete }
archetypeSignals[]        (duplicate / known-pattern indicators)
analyst, signature
expiresAt
```
Signed, corpus-snapshot-bound, evolution-persisted. The bundle is the sole admissible input to the
Novelty Score's prior-art-dependent sub-dimensions (prior-art distance, combinatorial novelty).

---

## 8. Continuous prior-art monitoring

Prior art is not static. Monitoring keeps verdicts honest:
- **New-art matching.** Newly ingested art is matched against active subjects' retrieval profiles; a
  match above a watch threshold **reopens** the affected verdicts (NVF-G7 freshness).
- **Watchlists.** High-value subjects (filed patents, flagship fabrics) get standing watch queries that
  alert on new near-art.
- **Verdict expiry.** Every bundle/verdict has an `expiresAt`; expired novelty must be re-established
  against a fresh snapshot before any release-as-novel claim.
- **Self-overlap sweeps.** Periodic sweeps over the `ucos-internal` source detect re-invention across
  UCOS's own fabrics/engines (prevents internal duplication).

---

## 9. Distributed / federated prior art

- Prior-art corpora and evidence bundles may be **federated** across nodes; inbound art/bundles are
  signature-verified, provenance-checked, and **trust-clamped** at the novelty boundary (deny-by-default
  on unknown issuers), mirroring the federation guard pattern used elsewhere in UCOS.
- **Sovereignty:** a foreign bundle cannot override a local, sealed prior-art verdict for the same
  subject; it can only add candidate art for re-adjudication.
- **Partition = fail-closed:** an unreachable federated source contributes `incomplete` completeness.

---

## 10. Prior-art risks & controls (framework-specific)

| Risk | Control |
| --- | --- |
| Corpus blind spot (missing language/jurisdiction/class) | Source-coverage KPI + gate; snapshot completeness flag; escalation when a required class is absent |
| Embedding false negative (missed near-art) | Structural facet widening; recall-favoring retrieval; standing watch queries; human discovery allowed |
| Adversarial/forged art | Signed art records; source trust weighting; high-trust corroboration required for hard archetype flags |
| Stale corpus | Freshness policy per source; snapshot `asOfDate`; verdict expiry; NVF-G7 |
| Non-reproducible verdict | Immutable snapshots + subject hash + recorded model/index versions |
| Over-claiming from grey sources | Trust-weighted overlap; grey-only hits cannot alone establish duplication |

---

## 11. Prior-art success metrics

- Source coverage: reachable+fresh required source classes / total required (target ≥ 95%).
- Recall proxy: analyst-added-art rate (art the machine missed) — trend down.
- Precision proxy: analyst-retracted-hit rate — trend down.
- Snapshot completeness: % of verdicts computed on `complete` corpora (target maximized).
- Reopen latency: time from new-art ingest to affected-verdict reopen (target minimized).
- Reproducibility: % of sampled bundles re-derivable on their cited snapshot (target 100%).

---

## Traceability
NVF-0002 expands NVF-0001 §3, §11, and the prior-art-dependent inputs to NS. Reuses (design intent) the
UCOS knowledge/ontology fabrics for corpus storage and the federation guard pattern for distributed
corpora. Reserved `novelty:priorart:*` / `novelty:source:*` / `novelty:corpus:*`. DESIGN ONLY.
