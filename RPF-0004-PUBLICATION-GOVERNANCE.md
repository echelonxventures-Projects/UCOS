# RPF-0004 — UCOS Publication & Citation Governance

| Field | Value |
|-------|-------|
| Artifact ID | `RPF-0004` |
| Family | `RPF-*` |
| Version | 1.0.0 · 2026-07-02 |
| Mode | **DESIGN ONLY — NO CODE** |
| Governs | The publication lifecycle gates, approval governance, citation governance, the SoD review workflow, and the Publication (`PUB-*`) / Citation (`CITE-*`) registry architecture. |
| Parent | `RPF-0001` §6 (Publication Lifecycle), §7 (Approval Governance), §8 (Citation Governance), §13/§15 (Registries) |
| Status | CREATED — DESIGN — READY FOR AUTHORITY REVIEW; Article IX unchanged |

> Publication governance imports the platform's own discipline: **event-sourced** state, **append-only**
> registries, **separation of duties**, **deny-by-default** gates, and **truth-conformance** to the ratified/
> reproduced state (RGP-1). Nothing here authorizes construction or releases any lock.

---

## 1. Publication lifecycle (P1..P8) with gates

| Stage | Action | Blocking gate(s) | Decision |
|:-----:|--------|------------------|:--------:|
| P1 Draft | Author manuscript + traceability appendix | — | Trusted |
| P2 Independent review | IRR reviews truth/reproducibility/disclosure | **G-TRUTH**, **G-ATTRIB** | Trusted (internal) |
| P3 Disclosure clearance | Classification + COI + responsible disclosure | **G-DISCLOSE** | **RD-3** |
| P4 Venue targeting | Rank venues (`RPF-0003`) | **G-VENUE** | Trusted |
| P5 Submission | Submit to external venue | **G-REPRO** (empirical), **G-SUBMIT** | **RD-4** |
| P6 Peer review / revision | Address reviewers; revise | — | Trusted |
| P7 Acceptance / camera-ready | Finalize accepted paper | re-run **G-TRUTH/G-DISCLOSE** on final text | Trusted |
| P8 Publication + dissemination | Register `PUB-*`, DOI, disseminate | **G-RELEASE** | **RD-5** |

**Fail-closed:** each gate defaults to *block*; there is no path from P4→P5 or P7→P8 that bypasses its gate.
Terminal branches: **Reject** (record + re-target from P4), **Withdraw**, **Retract/Correct** (append-only, §5).

## 2. Gate specifications

| Gate | Owner | Pass criteria | Fail action |
|------|-------|---------------|-------------|
| **G-TRUTH** | IRR | Every claim traces to a ratified artifact or reproduced measurement; platform status stated exactly (no overstatement of authorization/certification level) | Block; return to P1 with claim-defect list |
| **G-REPRO** | Reproducibility Steward | Empirical papers ship artifact + method + (lawful) verifier; result independently reproduced by a non-sole-author | Block submission; downgrade to non-empirical or remediate |
| **G-DISCLOSE** | Ethics & Disclosure Officer | No S4/secret/embargoed content; COI declared; responsible-disclosure timeline honored | Block; redact/embargo |
| **G-ATTRIB** | Research Owner | CRediT roles complete; no gift/ghost authorship; order agreed | Block; resolve authorship |
| **G-VENUE** | Standards Liaison / PI | Venue on the verified allow-list (JS-6); not predatory; no dual-submission | Block; re-target |
| **G-SUBMIT** | RAB | RD-4 recorded; all prior gates green | Block |
| **G-RELEASE** | RAB | RD-5 recorded; camera-ready re-passed G-TRUTH/G-DISCLOSE | Block public release |

## 3. Separation-of-duties review workflow

```
Author(s) ──manuscript──▶ Independent Research Reviewer (IRR)  [MUST NOT be an author]
                               │ truth + attribution review (G-TRUTH, G-ATTRIB)
                               ▼
Reproducibility Steward  [MUST NOT be sole author of the measured result]
                               │ reproduce empirical results (G-REPRO)
                               ▼
Ethics & Disclosure Officer  [independent of authors]
                               │ classification/COI/disclosure (G-DISCLOSE)
                               ▼
Research Authority Board ──RD-4──▶ external submission ──…peer review…──▶ RD-5 ──▶ publish + register PUB-*
```

**SoD invariant (PUB-SOD-1):** for any `PUB-*`, the sets {authors}, {IRR}, {disclosure officer} are pairwise
distinct; the reproducibility steward is not the sole author of the reproduced result. This mirrors the
platform's `PROOF-*` independent-review workflow and the `REAL-C-05` independent-adjudication norm. Violation ⇒
fail-closed (cannot reach RD-4).

## 4. Citation governance

| Rule | Control |
|------|---------|
| CG-1 strongest primary source | IRR checks each claim cites the primary, not a survey-of-a-survey |
| CG-2 no padding/coercion | Citation-count anomalies flagged; coercive-citation requests refused/reported |
| CG-3 self-citation declared | `CITE-SELF-*` ledger; justification mandatory |
| CG-4 explicit prior-art comparison | Every novelty claim carries a `PRIOR-*` comparison (RPF-0002 §3) |
| CG-5 flag preprints/retractions | Citation kind + status recorded; retracted sources purged/flagged |
| CG-6 versioned citations | DOI + accessed-date; immutable once published |

**Metric integrity:** aggregate citation metrics (PM-2/PM-3) are reported as **net-external** (self-citations
separated via `CITE-SELF-*`), preventing inflated impact (RGP-1).

## 5. Retraction & correction (append-only)

A published paper is **never silently altered**. Post-publication changes are:
- **Correction** — `PUB-*` gains a `correctionOf` link + errata record; original retained.
- **Retraction** — status → `retracted` with a `retractionReason`; the paper and its citations remain in the
  registry, flagged. Mirrors migration-only / audit-preserving discipline (INV-CORE-03 analog).

## 6. Publication Registry (`PUB-*`) schema

```
PUB-* {
  pubId, title, type(journal|conference|industry|whitepaper|standard),
  authors[{name, credit[]}], venueRef(JRN-*/CONF-*/STD-*), status(P1..P8|published|retracted),
  doi, topicRef(RT-*), gapRef(GAP-*), claimRefs[CLAIM-*], evidenceRefs[ratified/reproduced],
  reproPackageRef, classification, decisionRefs[RD-3/4/5], correctionOf?, retractionReason?,
  submittedAt?, publishedAt?, version   // append-only; supersession/correction only
}
```

## 7. Citation Registry (`CITE-*` / `CITE-SELF-*`) schema

```
CITE-* { citeId, fromPubRef(PUB-*), toReference{doi|url, title, accessedAt}, kind(support|contrast|method|dataset|self),
         justification, status(active|preprint|retracted), versioned }
CITE-SELF-* extends CITE-* with { toUcosPubRef(PUB-*), justification(required) }  // separated for net-external metrics
```

## 8. Research decision register (`RD-*` log)

Append-only log of RD-1..RD-6 (topic auth, methodology, disclosure, submission, release, standards). Each entry:
`{ decisionId, class(RD-1..6), subjectRef, decidedBy(RAB), outcome(approve|deny|conditions), conditions[],
at }`. This is the research analog of `AUTH-012`'s decision log; external submission (RD-4) and release (RD-5)
are always Approval-Required.

## 9. Governance conformance checks (pre-publication, all must pass)

C-PUB-1 SoD satisfied (PUB-SOD-1); C-PUB-2 all gates green for the reached stage; C-PUB-3 every claim has an
evidence edge in the RKG (RKG-INV-1); C-PUB-4 topic+gap ancestry present (RKG-INV-2); C-PUB-5 no orphan
citations (RKG-INV-3); C-PUB-6 classification clean (no S4); C-PUB-7 venue legitimacy verified. Any failure is
fail-closed.

## Traceability
- **Parent:** `RPF-0001` §6/§7/§8/§13/§15. **Uses:** `RPF-0002` (topics/gaps/claims), `RPF-0003` (venues/G-VENUE).
- **Feeds:** `RPF-0005` (each paper carries its gate/decision plan), program metrics (`RPF-0001` §17/§18).
- **Owner:** Research Authority Board. Design only; Article IX and `UCOS-CONSTRUCTION-BLOCKED` unchanged.

**END RPF-0004 — PUBLICATION & CITATION GOVERNANCE · P1..P8 GATED LIFECYCLE · SoD REVIEW · PUB-*/CITE-* REGISTRIES · RD-* DECISION LOG · DESIGN ONLY.**
