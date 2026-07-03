# RPF-0003 — UCOS Journal & Venue Strategy

| Field | Value |
|-------|-------|
| Artifact ID | `RPF-0003` |
| Family | `RPF-*` |
| Version | 1.0.0 · 2026-07-02 |
| Mode | **DESIGN ONLY — NO CODE** |
| Governs | Venue selection, the target-journal ladder, conference strategy, and the venue registry (`JRN-*` / `CONF-*` / `STD-*`). |
| Parent | `RPF-0001` §10 (Journal Selection), §11 (Conference Strategy), §16 (Journal Registry Architecture) |
| Status | CREATED — DESIGN — READY FOR AUTHORITY REVIEW; Article IX unchanged |

> Venue names below are candidate targets grouped by community and tier for planning. Exact fit, current
> indexing status, tier, and open-access terms MUST be re-verified at submission time (JS-6 legitimacy check);
> this registry records the intended ladder, not a guarantee of acceptance. Predatory/unindexed venues are
> **prohibited** (allow-list discipline).

---

## 1. Venue selection framework (deterministic scoring)

Selection score per candidate venue = weighted sum (weights are configuration):

| Criterion | Definition | Weight (default) |
|-----------|------------|:----------------:|
| JS-1 Topical fit | Alignment of the paper's `RT-*`/`GAP-*` with venue scope | 0.30 |
| JS-2 Tier / impact | Q1/Q2 (journals); CORE A*/A (conferences) | 0.20 |
| JS-3 Audience | Reaches the community that can cite/adopt (systems, SE, security, distributed, governance) | 0.15 |
| JS-4 Openness | OA policy + **artifact evaluation** availability (reinforces G-R4) | 0.15 |
| JS-5 Turnaround | Time-to-decision vs roadmap window | 0.10 |
| JS-6 Legitimacy | Indexed (Scopus/DBLP/DOAJ), non-predatory; else **prohibited** (hard gate) | 0.10 (veto) |

JS-6 is a **veto**: a venue failing legitimacy is prohibited regardless of score. Output per paper = a ranked
primary target + a fallback ladder (≥ 2 fallbacks), recorded in `RPF-0005`.

## 2. Target journal ladder (by community)

| Tier | Software Engineering | Systems / Middleware | Security & Privacy | Distributed / Cloud | Governance / IS |
|:----:|----------------------|----------------------|--------------------|---------------------|-----------------|
| **T1 (flagship, Q1 / A*)** | IEEE TSE; ACM TOSEM | ACM TOCS; IEEE TC | IEEE TDSC; ACM TOPS; IEEE TIFS | IEEE TPDS; IEEE TCC | MIS Quarterly; ACM TMIS |
| **T2 (strong, Q1/Q2 / A)** | Empirical Software Engineering (EMSE); JSS; IST | ACM TAAS; FGCS | Computers & Security; IEEE Security & Privacy (mag) | JPDC; IEEE Internet Computing | Government Information Quarterly |
| **T3 (specialist / OA)** | Journal of Software: Evolution & Process; SoftwareX (artifacts) | SPE (Softw. Pract. Exp.) | Journal of Cybersecurity (OA) | Journal of Cloud Computing (OA) | Data & Policy (OA) |

## 3. Conference ladder (by community; CORE guidance)

| Tier | SE | Systems | Security | Distributed / Cloud |
|:----:|----|---------|----------|---------------------|
| **A*** | ICSE; FSE/ESEC | OSDI; SOSP; EuroSys | IEEE S&P; USENIX Security; CCS; NDSS | — |
| **A** | ASE; ISSTA; ICSA (architecture) | Middleware; USENIX ATC; DSN | ESORICS; ACSAC | ICDCS; CCGrid; IEEE CLOUD |
| **Workshop / Industry** | ICSE-SEIP; SANER; ECSA | HotOS; HotCloud | (venue security workshops) | (cloud/edge workshops) |

Artifact-evaluation-bearing venues (ICSE/FSE/OSDI/USENIX/DSN AEC, SoftwareX) are **preferred** for empirical
papers to earn reproducibility badges (G-R4 / PM-5).

## 4. Standards bodies (`STD-*`)

| ID | Body / WG | Contribution area (UCOS topic) |
|----|-----------|-------------------------------|
| STD-01 | Supply-chain provenance / attestation (e.g., in-toto/SLSA-adjacent communities) | RT-04/RT-14 proof & attestation exchange |
| STD-02 | Software bill-of-materials & transparency logs | RT-03 universal provenance primitive |
| STD-03 | Federated identity / trust frameworks | RT-05 fail-closed federation trust |
| STD-04 | Data governance / policy interchange | RT-02 governance-as-code |

Standards contributions require RD-6 approval and a Standards Liaison owner (`RPF-0001` §2, §12).

## 5. Per-paper primary target + fallback (summary; detail in `RPF-0005`)

| Paper | Topic | Primary | Fallback-1 | Fallback-2 | Conference precursor |
|:-----:|-------|---------|-----------|-----------|----------------------|
| P1 | Behavior-from-data architecture | IEEE TSE | ACM TOSEM | JSS | ICSA |
| P2 | Governance-as-code / Article IX | ACM TOSEM | TSE | Data & Policy | ICSE-SEIP |
| P3 | Universal audit/provenance primitive | ACM TOPS | IEEE TDSC | Computers & Security | USENIX Security |
| P4 | Independent Proof Fabric | IEEE S&P (journal/mag) → TDSC | ACM TOPS | J. Cybersecurity (OA) | IEEE S&P / CCS |
| P5 | Fail-closed federation | IEEE TDSC | TPDS | ESORICS (conf) | DSN |
| P6 | Migration-only evolution | IEEE TSE | J. Softw. Evol. Process | EMSE | SANER |
| P7 | Governed cognition (propose-not-act) | ACM TAAS | IEEE TDSC | IST | AAMAS/SEAMS (conf) |
| P8 | Ontology semantic integrity | IEEE TKDE | JSS | SoftwareX | ISWC (conf) |
| P9 | Audit-preserving memory | ACM TOPS | J. Cybersecurity | FGCS | DSN |
| P10 | Scale breakpoints INV-5/INV-6 | IEEE TPDS | ACM TOCS | JPDC | ICDCS |
| P11 | Scalable governance tiers/lanes | ACM TMIS | Government Info Quarterly | Data & Policy | ICSA |
| P12 | Deterministic composition kernel | ACM TOSEM | TSE | SPE | Middleware |
| P13 | Reference model synthesis | ACM Computing Surveys | IEEE TSE | JSS | ICSA (keynote/industry) |
| P14 | Cross-org proof exchange (standard) | STD-01 + IEEE S&P mag | ACM TOPS | J. Cybersecurity | CCS |
| P15 | Conservation-safe economic fabric | IEEE TSC (Services) | FGCS | JPDC | IEEE CLOUD |

## 6. Venue registry (`JRN-*` / `CONF-*` schema)

`{ venueId, name, kind(journal|conference|standard), tier, indexed[Scopus/DBLP/DOAJ], scope[], oaPolicy,
artifactEval(bool), avgTurnaround, legitimacy(verified|watch|prohibited), fitTopics[RT-*] }`. Populated at
submission time; `legitimacy=prohibited` encodes the anti-predatory allow-list (JS-6 veto).

## 7. Anti-predatory & integrity controls

- No submission to venues absent from Scopus/DBLP/DOAJ without explicit RAB waiver.
- No simultaneous submission (dual-submission prohibited); conference→journal extension declared per venue policy.
- No paper-mill, citation-cartel, or coercive-citation behavior (CG-2, RGP-5).
- OA/APC decisions recorded; predatory-OA solicitations rejected.

## Traceability
- **Parent:** `RPF-0001` §10/§11/§16. **Feeds:** `RPF-0005` (per-paper venue ladder), `RPF-0004` (G-VENUE gate).
- **Owner:** Standards Liaison + PI, under Research Authority Board. Design only; Article IX unchanged.

**END RPF-0003 — JOURNAL & VENUE STRATEGY · TIERED LADDER · CONFERENCE + STANDARDS STRATEGY · PER-PAPER TARGETS · DESIGN ONLY.**
