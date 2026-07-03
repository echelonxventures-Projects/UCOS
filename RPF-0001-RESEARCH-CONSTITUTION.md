# RPF-0001 — UCOS Research & Publication Constitution

| Field | Value |
|-------|-------|
| Artifact ID | `RPF-0001` |
| Artifact family | `RPF-*` (Research & Publication Framework) |
| Title | UCOS Research & Publication Constitution |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **DESIGN ONLY — NO CODE, NO IMPLEMENTATION** |
| Status | CREATED — DESIGN — READY FOR AUTHORITY REVIEW |
| Governance | Subordinate to `AUTH-001..012`, `UCOS-CONST-001`, `AUTH-010` (Traceability), `AUTH-008` (Security/S4 classification), `AUTH-012` (Decision authority). Governs no code; releases no lock; enrolls no invariant. Article IX generation lock and `UCOS-CONSTRUCTION-BLOCKED` are **unchanged**. |
| Companions | `RPF-0002` (Research Topic Registry) · `RPF-0003` (Journal Strategy) · `RPF-0004` (Publication Governance) · `RPF-0005` (Academic Roadmap — 15 papers) |
| Targets | ≥ 15 international journal papers · ≥ 50 industry publications · ≥ 10 conference papers (5-year horizon) |

> **Nature of this document.** The constitutional charter for how UCOS conducts, governs, and publishes research.
> It defines the *institution* (vision, governance, lifecycle, registries, metrics, roadmap); it produces no
> claims of academic authorship by itself, mandates independent peer review, and forbids fabrication or
> misrepresentation of the platform's actual state (see §2 and §8). All research artifacts about UCOS MUST
> describe the system **as ratified and as reproduced**, not as aspirational — mirroring the program's
> `REAL-M-03` truth-reconciliation discipline.

---

## 1. Research Vision

### 1.1 Vision statement

> **UCOS will be recognized as the reference body of knowledge for governed, registry-driven, cryptographically
> provable, self-evolving software platforms** — publishing peer-reviewed evidence that constitutional
> software governance, deterministic composition, and independent verifiability are not merely implementable but
> measurable, reproducible, and generalizable.

### 1.2 Research thesis

UCOS embodies a small number of genuinely novel, defensible ideas that are under-represented in the literature.
The research program's job is to isolate each, state it as a falsifiable claim, evaluate it empirically or
formally, and publish it where the relevant community reads:

- **RT-THESIS-1 — Behavior-from-data.** A platform whose behavior is defined entirely by registry + metadata +
  configuration (zero hard-coded business logic) can achieve infinite extensibility without redeployment while
  preserving determinism and audit.
- **RT-THESIS-2 — Constitutional governance-as-code.** A machine-enforced authority hierarchy, immutable
  invariants, and an "approval-by-exception" generation lock can make an autonomous/agentic build process safe,
  traceable, and non-actuating.
- **RT-THESIS-3 — Independent provability.** Every consequential platform claim can be reduced to an
  append-only hash chain + detached multi-signatures + a pure deterministic verifier, enabling offline,
  adversarial, third-party verification (the Independent Proof Fabric, `PROOF-*`).
- **RT-THESIS-4 — Composable integrity.** A single universal audit/provenance primitive
  (`AUDIT-UNIV-001`) can serve every fabric, so integrity *composes* rather than being re-implemented per
  subsystem.
- **RT-THESIS-5 — Fail-closed federation.** Locally-sovereign, deny-by-default, clamped-trust,
  namespace-isolated federation with cryptographic assertions is a safe scaling substrate whose worst case is
  "no new capability," never "silent compromise."
- **RT-THESIS-6 — Migration-only evolution.** Making an Evolution Fabric the sole durable-commit path
  (backward-compatible, migration-only) yields a platform that changes without breaking and whose every change
  is provable.
- **RT-THESIS-7 — Governed cognition.** "Propose-not-act" intelligence with a determinism quarantine bounds the
  blast radius of non-deterministic inference to rejected proposals and audit noise.

### 1.3 Strategic goals (G-R1..G-R6)

| ID | Goal | 5-yr measure |
|----|------|--------------|
| G-R1 | Establish UCOS as a citable architecture reference | ≥ 15 journal papers; ≥ 500 aggregate citations |
| G-R2 | Influence standards on software governance & provenance | ≥ 3 standards contributions (e.g., provenance, SBOM/attestation, governance) |
| G-R3 | Bridge academia ↔ industry | ≥ 50 industry publications; ≥ 5 active research collaborations |
| G-R4 | Reproducibility as a first-class norm | 100% of empirical papers ship a reproducibility package (artifacts + verifier) |
| G-R5 | Train the field | ≥ 10 conference papers/tutorials; ≥ 2 open datasets/benchmarks |
| G-R6 | Truthful representation | 0 published claims contradicting the ratified/reproduced platform state |

### 1.4 Non-goals

Marketing disguised as research; publication of unratified or unreproduced results as fact; disclosure of S4
sensitive material; any claim implying construction/authorization beyond what the Authority Board has granted;
existential/Ω∞ speculation presented as engineering results (bounded per AD-0014).

---

## 2. Research Governance Model

### 2.1 Principles (RGP-1..RGP-10)

| ID | Principle |
|----|-----------|
| RGP-1 | **Truth over narrative.** Every empirical/architectural claim traces to a ratified artifact or a reproduced measurement (`AUTH-010`; `REAL-M-03`). |
| RGP-2 | **Independent review before publication.** No paper is submitted without an independent internal review distinct from all authors (separation of duties; mirrors `PROOF-*` review workflow). |
| RGP-3 | **Reproducibility by default.** Empirical papers ship data, method, and (where lawful) a verifier enabling third-party reproduction. |
| RGP-4 | **Classification-aware disclosure.** No S4-classified data, keys, secrets, or embargoed material is published (`AUTH-008`). |
| RGP-5 | **Attribution integrity.** Authorship, contribution, and citation follow ICMJE/CRediT-style norms; no gift/ghost authorship. |
| RGP-6 | **No self-certification as external validation.** Internal ratification is disclosed as internal; peer review is the external gate. |
| RGP-7 | **Conflict-of-interest disclosure.** Funding, affiliations, and competing interests are declared on every submission. |
| RGP-8 | **Ethics & responsible disclosure.** Security findings follow coordinated disclosure; human-subject/industry data follows applicable ethics review. |
| RGP-9 | **Single accountable owner per artifact.** Each research artifact has one accountable Research Owner (traceability). |
| RGP-10 | **Registry-driven research.** Topics, gaps, publications, citations, and venues are governed as registry records, not ad-hoc lists. |

### 2.2 Roles & bodies

| Role / Body | Mandate |
|-------------|---------|
| **Research Authority Board (RAB)** | Terminal research-governance authority; approves topics, embargoes, and submission gates; subordinate to the UCOS Authority Board. |
| **Research Owner** | Single accountable owner of a topic/paper through its lifecycle. |
| **Principal Investigator (PI)** | Leads methodology and authorship for a paper. |
| **Independent Research Reviewer (IRR)** | Reviews a paper for truth, reproducibility, and disclosure; MUST be distinct from all authors (RGP-2). |
| **Reproducibility Steward** | Owns the artifact/verifier package and confirms independent reproduction. |
| **Standards Liaison** | Owns standards-body engagement and contribution submissions. |
| **Ethics & Disclosure Officer** | Owns COI, ethics, embargo, and responsible-disclosure decisions. |

### 2.3 Decision classes (RD-1..RD-6, all Approval-Required)

RD-1 Topic authorization · RD-2 Methodology approval · RD-3 Data-disclosure/classification clearance · RD-4
Submission approval (external venue) · RD-5 Public release/embargo lift · RD-6 Standards contribution
submission. Each is an Approval-Required Operation logged in the research decision register (`RPF-0004`).

### 2.4 Separation of duties (research SoD)

Author ≠ Independent Reviewer ≠ Disclosure Officer for the same artifact. Reproducibility must be confirmed by a
steward who is not the sole author of the measured result. This structurally imports the platform's
`REAL-C-05` independent-adjudication norm into publishing.

---

## 3. Research Lifecycle

Ten governed stages, each with entry/exit criteria and a decision gate. State is a projection over an
append-only research event log (event-sourced, mirroring platform discipline).

| # | Stage | Entry | Exit / Gate |
|:-:|-------|-------|-------------|
| L1 | **Discovery** | Signal from Topic Discovery Engine (§4) | Candidate topic recorded (`RT-*`) |
| L2 | **Gap validation** | Candidate topic | Confirmed gap (`GAP-*`, §5); RD-1 topic authorization |
| L3 | **Framing** | Authorized topic | Problem statement + falsifiable claim + success criteria |
| L4 | **Methodology design** | Framed claim | Approved method (formal/empirical/mixed); RD-2 |
| L5 | **Evidence generation** | Approved method | Reproducible results + artifact package (RGP-3) |
| L6 | **Drafting** | Results | Complete manuscript + traceability appendix |
| L7 | **Independent review** | Manuscript | IRR sign-off (truth/reproducibility/disclosure); RD-3 |
| L8 | **Venue selection & submission** | Reviewed manuscript | Target venue chosen (`RPF-0003`); RD-4 submission approval |
| L9 | **Peer review & revision** | Submitted | Accept / revise / resubmit / withdraw; camera-ready |
| L10 | **Publication & dissemination** | Accepted | RD-5 release; registered in Publication Registry; metrics tracked (§18) |

Post-publication: **L11 Impact tracking** (continuous; §19) and **L12 Retraction/Correction** (migration-only,
append-only correction record — a paper is never silently altered post-publication).

---

## 4. Research Topic Discovery Engine

### 4.1 Purpose

A registry-driven engine that continuously surfaces candidate research topics from the UCOS corpus and the
external literature, scores them, and feeds authorized topics into the lifecycle. **Design-only**: this section
specifies the model; instances live in `RPF-0002`.

### 4.2 Signal sources

| Source | Signal |
|--------|--------|
| Ratified architecture corpus | Novel constructs (fabrics, primitives, invariants) not yet published |
| Gap/audit artifacts (`ARCH-GAP-*`, `AF-*`, `CIV-STRESS-*`) | Open problems, limits, breakpoints (e.g., INV-5/INV-6 vs latency) |
| Decision log (`AUTH-012`) | Governance innovations (Article IX lock, approval-by-exception) |
| Reproduced measurements (PI-4 §11B, test baselines) | Empirical results ready to formalize |
| External literature scan | White space vs prior art (registry of `PRIOR-*`) |
| Standards landscape | Contribution opportunities (provenance, attestation, SBOM, governance) |

### 4.3 Topic scoring model (TS-1..TS-6)

Score = weighted sum of: **TS-1 Novelty** (vs prior art), **TS-2 Evidence readiness** (formal proof or
reproduced data available), **TS-3 Community fit** (a venue exists), **TS-4 Strategic alignment** (G-R1..6),
**TS-5 Reproducibility feasibility**, **TS-6 Disclosure safety** (no S4 leakage). Topics ≥ threshold advance to
gap validation. Weights are configuration, not hard-coded (RGP-10).

### 4.4 Topic record schema (`RT-*`)

`{ topicId, title, thesis, signalSources[], noveltyClaim, priorArtRefs[], candidateVenues[], score{TS1..6},
owner, status(candidate|authorized|active|published|retired) }`. Instances in `RPF-0002`.

---

## 5. Research Gap Identification Framework

### 5.1 Gap taxonomy

| Class | Definition | UCOS exemplar |
|-------|------------|---------------|
| **G-THEORY** | No formal model exists for a phenomenon | Formal semantics of "approval-by-exception" generation locks |
| **G-EMPIRICAL** | Claimed but unmeasured | Extensibility-without-redeploy throughput/latency of registry-driven composition |
| **G-METHOD** | No accepted method to evaluate | How to independently verify a governed autonomous build offline |
| **G-INTEGRATION** | Concepts exist separately, not composed | Audit + provenance unified as one primitive |
| **G-SCALE** | Known to break at scale, unquantified | INV-5 single-SoR / INV-6 determinism vs inter-node latency (`CIV-STRESS-001`) |
| **G-STANDARD** | No standard governs it | Cross-org proof/attestation exchange format |

### 5.2 Gap validation criteria (must all hold to authorize)

GV-1 prior-art search shows the gap is real (documented `PRIOR-*` set); GV-2 the gap is *falsifiable* (a result
could refute the thesis); GV-3 UCOS holds distinctive evidence to address it; GV-4 a target community/venue
exists; GV-5 disclosure is safe. Output: a `GAP-*` record linked to its `RT-*` topic (see `RPF-0002`).

---

## 6. Publication Lifecycle

A publication is the externalization of a research result. Its lifecycle (P1..P8) runs inside lifecycle stages
L6–L10 and is event-sourced:

P1 Draft → P2 Internal independent review (IRR) → P3 Disclosure/classification clearance → P4 Venue targeting →
P5 Submission → P6 Peer review / revision → P7 Acceptance & camera-ready → P8 Publication + registry entry +
dissemination. Terminal branches: **Reject** (record + re-target), **Withdraw**, **Retract/Correct** (append-only
correction). Each publication is a `PUB-*` record (schema in `RPF-0004`).

## 7. Publication Approval Governance

### 7.1 Gate model (mirrors platform gates)

| Gate | Checks | Owner |
|------|--------|-------|
| **G-TRUTH** | Every claim traces to a ratified artifact or reproduced measurement; no overstatement of platform status | IRR |
| **G-REPRO** | Artifact/verifier package present; independent reproduction confirmed (empirical papers) | Reproducibility Steward |
| **G-DISCLOSE** | No S4/secret/embargoed material; COI declared; responsible disclosure honored | Ethics & Disclosure Officer |
| **G-ATTRIB** | Authorship/contribution/citation integrity (CRediT); no gift/ghost authorship | Research Owner |
| **G-VENUE** | Target venue legitimate (no predatory venues; `RPF-0003` allow-list) | Standards Liaison / PI |
| **G-SUBMIT** | RD-4 approval recorded before submission | RAB |

**Fail-closed:** any unmet gate blocks submission; there is no implicit "submit anyway" path.

### 7.2 Approval-by-exception

Routine (Trusted) operations — internal drafts, literature scans, preprints to a governed preprint server after
G-TRUTH/G-DISCLOSE — proceed under standing authority; **external submission (RD-4)** and **public release (RD-5)**
are Approval-Required (RAB), logged in the research decision register.

## 8. Citation Governance

### 8.1 Principles

CG-1 Cite the strongest primary source; CG-2 no citation padding or coercive self-citation; CG-3 self-citation is
declared and justified; CG-4 every UCOS claim of novelty carries an explicit prior-art comparison; CG-5
retractable/preprint sources are flagged; CG-6 citations are versioned (DOI + accessed-date) and stored in the
Citation Registry (§15).

### 8.2 Self-citation discipline

A dedicated `CITE-SELF-*` ledger records intra-UCOS citations with justification, so aggregate metrics (§18) can
report *net* external impact separately from self-citation — protecting metric integrity (RGP-1).

## 9. Research Knowledge Graph (RKG)

### 9.1 Model

A governed graph linking **Topics (`RT-*`) → Gaps (`GAP-*`) → Claims → Evidence (ratified artifact / reproduced
measurement) → Publications (`PUB-*`) → Citations (`CITE-*`) → Venues (`JRN-*`/`CONF-*`) → Metrics**. Nodes are
registry records; edges are typed (addresses, evidences, cites, supersedes, contributes-to-standard). The RKG is
the single traceability spine for the entire research program (`AUTH-010` analog).

### 9.2 Invariants

RKG-INV-1 every published claim has ≥ 1 evidence edge to a ratified/reproduced source; RKG-INV-2 no publication
without a topic and gap ancestor; RKG-INV-3 no orphan citations; RKG-INV-4 supersession is append-only (a
retracted paper is marked, never deleted). Realizable atop the platform's Knowledge/Ontology fabrics
(design-only note; no code here).

## 10. Journal Selection Framework

Selection is a deterministic scoring over venue records (`JRN-*`, detailed in `RPF-0003`): **JS-1 topical fit**,
**JS-2 tier/impact** (Q1/Q2; CORE A*/A for conferences), **JS-3 audience** (systems, SE, security, distributed,
governance), **JS-4 openness** (OA policy, artifact evaluation), **JS-5 turnaround**, **JS-6 legitimacy**
(indexed; non-predatory allow-list; DBLP/Scopus/DOAJ presence). Output: a ranked target set + fallback ladder
per paper (see `RPF-0005`). Tiers and named venues live in `RPF-0003`.

## 11. Conference Strategy

Conferences are used for **early dissemination, artifact evaluation, and community building** ahead of journal
extension. Strategy: (a) target CORE A*/A systems/SE/security venues for flagship results; (b) use workshops and
industry tracks for the 50+ industry publications; (c) pursue **artifact-evaluation badges** to reinforce
reproducibility (G-R4); (d) convert accepted conference papers into extended journal versions (declared, no
duplicate-publication violation). Named venue ladder in `RPF-0003`.

## 12. Collaboration Framework

| Mode | Instrument | Governance |
|------|-----------|------------|
| **Academic** | Joint papers, co-supervision, visiting research | Collaboration agreement + COI (RGP-7); IP/authorship terms up front |
| **Industry** | Case studies, industry publications, benchmarks | Data-use + disclosure clearance (G-DISCLOSE); anonymization where required |
| **Standards** | Working-group participation, contributions | Standards Liaison; RD-6 approval |
| **Open community** | Datasets, benchmarks, reference verifier | License selection; reproducibility package |

Each collaboration is a `COLLAB-*` record (owner, parties, scope, IP terms, outputs) with a single accountable
Research Owner (RGP-9).

## 13. Publication Registry Architecture

Authoritative registry of publications (`PUB-*`), design-only. Record: `{ pubId, title, type(journal|conference|
industry|whitepaper|standard), authors[+CRediT roles], venueRef, status(P1..P8|published|retracted), doi,
topicRef, gapRef, claimRefs[], evidenceRefs[], reproPackageRef, classification, decisionRefs[RD-*], version }`.
Append-only; supersession/correction only (mirrors `CTX-REG-001` discipline). Detailed schema in `RPF-0004`.

## 14. Research Registry Architecture

Authoritative registry of topics/gaps/claims (`RT-*`, `GAP-*`, `CLAIM-*`) and their scores, owners, and status —
the input side of the RKG. Detailed instances in `RPF-0002`. Records are registry-driven and configuration-scored
(RGP-10); nothing is hard-coded.

## 15. Citation Registry Architecture

Authoritative registry of citations (`CITE-*`) and self-citations (`CITE-SELF-*`): `{ citeId, fromPubRef,
toReference(DOI/URL+accessed), kind(support|contrast|method|dataset|self), justification, versioned }`. Enables
citation-graph metrics with self-citation separated (§8.2). Append-only.

## 16. Journal Registry Architecture

Authoritative registry of venues (`JRN-*` journals, `CONF-*` conferences, `STD-*` standards bodies): `{ venueId,
name, kind, tier, indexed[Scopus/DBLP/DOAJ], scope[], oaPolicy, artifactEval(bool), avgTurnaround,
legitimacy(verified|watch|prohibited), fitTopics[] }`. The **prohibited** set encodes the anti-predatory
allow-list (JS-6). Named venues in `RPF-0003`.

## 17. Research Metrics

| Metric | Definition |
|--------|------------|
| RM-1 Topic pipeline health | # candidate/authorized/active topics; conversion rates across L1→L10 |
| RM-2 Gap closure rate | # `GAP-*` addressed by ≥ 1 published claim |
| RM-3 Reproducibility rate | % empirical papers with independently reproduced results |
| RM-4 Time-to-publish | Median L3→L10 duration per paper type |
| RM-5 Truth conformance | # claims flagged in G-TRUTH review / total (target → 0) |
| RM-6 Collaboration index | # active `COLLAB-*`; # joint outputs |

## 18. Publication Metrics

| Metric | Definition |
|--------|------------|
| PM-1 Volume | Journal / conference / industry / whitepaper / standards counts vs targets (15/10/50/…) |
| PM-2 Citations | Total and **net-external** citations (self-citation separated, §8.2) |
| PM-3 h-index / i10 (program-level) | Standard bibliometrics, reported with self-citation caveats |
| PM-4 Venue tier mix | % Q1/Q2; CORE A*/A share |
| PM-5 Artifact-badge rate | % papers earning artifact-evaluation badges |
| PM-6 Acceptance rate | Accept/submit ratio per venue tier |
| PM-7 Altmetrics | Downloads, standards-adoption references, industry citations |

## 19. Academic Impact Model

Impact is modeled at three horizons: **AI-1 Scholarly** (citations, h-index, replications by third parties),
**AI-2 Standards/Practice** (contributions adopted; patterns referenced in other systems/standards), **AI-3
Field-shaping** (a UCOS construct becomes a named, taught concept — e.g., "behavior-from-data governance,"
"independent proof fabric," "approval-by-exception generation lock"). Each publication declares a **target impact
tier** and is tracked against it (L11). The model explicitly separates *measured* impact from *aspirational*
targets (RGP-1).

## 20. Five-Year Research Roadmap

| Year | Focus | Journal | Conf. | Industry | Milestones |
|:----:|-------|:-------:|:-----:|:--------:|-----------|
| **Y1** | Foundations: registry-driven architecture, governance-as-code, audit/provenance primitive | 3 | 2 | 8 | Papers 1–3 (see `RPF-0005`); first artifact badges; 1 standards liaison established |
| **Y2** | Verifiability & federation: proof fabric, fail-closed federation, evolution/migration | 3 | 2 | 10 | Papers 4–6; open reference verifier; 1 standards contribution submitted |
| **Y3** | Cognition & knowledge: governed intelligence, knowledge/ontology, memory | 3 | 2 | 10 | Papers 7–9; 2 active academic collaborations |
| **Y4** | Scale & limits: breakpoint analysis, scalable governance, deterministic composition at scale | 3 | 2 | 12 | Papers 10–12; benchmark/dataset release |
| **Y5** | Synthesis & standards: reference model, cross-org proof exchange, economic/simulation fabrics | 3 | 2 | 10 | Papers 13–15; ≥ 3 standards contributions; program synthesis paper |
| **Σ** | | **15** | **10** | **50** | Targets met |

Detailed per-paper roadmap (Papers 1–15) is the mandatory output of `RPF-0005`.

---

## Governance / Non-Construction Statement

Design only. No code, implementation, technology selection, authorization, execution, or `git` mutation beyond
this additive `*.md`. No lock released; no invariant enrolled; no canon modified. Article IX generation lock and
`UCOS-CONSTRUCTION-BLOCKED` remain **ACTIVE**. All external submissions and public releases are Approval-Required
Operations under the Research Authority Board.

## Traceability
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001`, `AUTH-010` (traceability), `AUTH-008` (classification), `AUTH-012` (decisions).
- **Draws research evidence from:** ratified UCOS corpus (architecture, fabrics, invariants, audit/proof, federation, evolution, `ARCH-GAP-*`, `CIV-STRESS-*`).
- **Feeds:** `RPF-0002` (topics/gaps), `RPF-0003` (venues), `RPF-0004` (publication/citation governance), `RPF-0005` (15-paper roadmap).
- **Owner:** Research Authority Board (subordinate to the UCOS Authority Board).

**END RPF-0001 — UCOS RESEARCH & PUBLICATION CONSTITUTION · 20 SECTIONS · DESIGN ONLY · NO CODE · ARTICLE IX UNCHANGED.**
