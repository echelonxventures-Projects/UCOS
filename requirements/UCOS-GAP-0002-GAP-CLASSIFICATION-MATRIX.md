# UCOS-GAP-0002 — Gap Classification Matrix

**Artifact ID:** `UCOS-GAP-0002`
**Phase:** Phase 0.5 — Constitutional Gap Closure & Ratification
**Mode:** GAP CLASSIFICATION ONLY — no code, schema, architecture, or remediation. Classifies each registered gap by type with evidence; enacts nothing.
**Status:** RATIFIED BASELINE (v1.0.0)
**Subordinate to:** `UCOS-GAP-0001`, `UCOS-AUDIT-0001..0003`, `UCOS-REQ-0001..0004`, the Authority Layer, and the Constitution.
**Date:** 2026-07-03

---

## 0. Classification taxonomy

Per the Phase 2 charter, every gap in `UCOS-GAP-0001` is assigned one **primary** classification (and, where
material, a **secondary**) from the seven types below. Each carries evidence drawn from the frozen baseline.

| Code | Type | Meaning | Closure mode |
|:----:|------|---------|--------------|
| **A** | Documentation Gap | Statement/cross-reference/consistency defect; no substantive change to requirement, code, or authority. | Documentation reconciliation (Trusted Operation). |
| **B** | Requirement Gap | A required requirement class is unstated / not first-class of record. | Author a governed requirement (this program: `UCOS-REQ-0005/0006`). |
| **C** | Governance Gap | A governance rule/process/gate is missing or not enforced uniformly. | Governance enactment (Board / gate). |
| **D** | Traceability Gap | Upstream/downstream lineage or registry cross-index missing or broken. | Registry/traceability enrollment. |
| **E** | Ratification Gap | A construct is implemented/proposed but not (independently) ratified/enrolled. | Ratification / independent attestation. |
| **F** | Architecture Gap | A capability requires an architectural construct not present (behavioral primitive, temporal model, etc.). **Additive only — 0 REDESIGN.** | Scoped additive design + release (out of this program). |
| **G** | Implementation Gap | A ratified/proposed construct is not built. | Scoped construction + validation (out of this program). |

> **Framing rule (from the baseline).** `ULT-TEST-001` records **0 `REDESIGN` verdicts** (FM-1..FM-12); every
> Architecture-Gap (F) row below is therefore an **additive specialization**, never a foundation redesign. This
> is preserved as a hard constraint of the classification.

---

## 1. P0 gap classification

| Gap ID | Primary | Secondary | Evidence |
|--------|:-------:|:---------:|----------|
| **GAP-C3** — authority chain off-ledger | **C (Governance)** | E (Ratification), D (Traceability) | `PHASE-21` F-REC-1..5: `AD-0016..0023` off the canonical `AUTH-012` ledger (§6/§9 violation); AD-0021 contested; missing full-release link; self-attested PI-8/PI-9 ratifications (`REAL-M-03` T-04/05/14). Governance-process defect (unrecorded decisions) with ratification + traceability sub-components. |
| **GAP-M5** — program-state divergence | **D (Traceability)** | A (Documentation), E (Ratification) | `UCOS-AUDIT-0001 §2.1`: `PROJECT-STATE §0W` (single source of truth) diverges from reproduced reality (213/213 & "Memory REJECTED" vs 269/269 + Memory/Ontology present). `REAL-M-03` X-1..X-8 resolve the divergence append-only; residual = independent attestation. |

---

## 2. P1 gap classification

| Gap ID | Primary | Secondary | Evidence |
|--------|:-------:|:---------:|----------|
| **GAP-C1** — universal Audit primitive | **F (Architecture)** | G (Implementation) | `ARCH-GAP-001` C1: auditability implemented 6× rather than as one primitive; `AUDIT-UNIV-001` designs the additive 6→1 reduction (not built). Additive, not redesign. |
| **GAP-M1** — universal Authority primitive | **F (Architecture)** | G (Implementation) | `ARCH-GAP-001` M1: certification/ratification/revocation duplicated per fabric; `AUTH-UNIV-001` (design). Additive convergence. |
| **GAP-M2** — universal Evolution/Lifecycle primitive | **F (Architecture)** | G (Implementation) | `ARCH-GAP-001` M2: four parallel state machines; `LIFE-UNIV-001` design; fabrics register lifecycle profiles as data. |
| **GAP-M3** — extensible policy vocabulary | **F (Architecture)** | G (Implementation) | `ARCH-GAP-001` M3: `policy-evaluator.ts` hard-coded switch over 5 rule types; registry/metadata-extensible predicate vocabulary required. |
| **GAP-M4** — Memory governance uniformity | **F (Architecture)** | G (Implementation) | `ARCH-GAP-001`: memory authorities in in-process `Map`s bypassing `MetadataPort`; persist as metadata records. |
| **GAP-R29** — platform-factory catalog | **B (Requirement)** | F (Architecture) | `UCOS-REQ-0002 §7`: composition mechanism (INV-13) EXPLICIT but no ratified platform-class factory *catalog*. Requirement-of-record + additive catalog artifact. |
| **GAP-INV6** — INV-6 label divergence | **A (Documentation)** | — | `UCOS-REQ-0003 §5`: INV-6 = event-driven propagation (ratified) vs "determinism" mis-citation (determinism = `INV-CORE-09`/EX1). Pure documentation-consistency defect; `EXIST-001 §2` F-CITE-1 corrects it. |

---

## 3. P2 gap classification

| Gap ID | Primary | Secondary | Evidence |
|--------|:-------:|:---------:|----------|
| **GAP-C2** — behavioral primitive & fabrics | **F (Architecture)** | G (Implementation) | `ARCH-GAP-001` C2: behavioral acts not reducible to the nine state primitives; additive Behavioral/Execution primitive OR reduction to execution-engine + Evolution records. |
| **GAP-R21** — new-reality neutrality | **C (Governance)** | F (Architecture) | INV-17↔INV-5 / INV-18↔INV-6 conflicts; `EXIST-001` resolves at constitutional level; enactment is a Board governance act. |
| **GAP-R31/32** — unboundedness / unknown domain | **C (Governance)** | B (Requirement) | INV-14..20 proposed not enrolled (`AUTH-013-AMD-001`, `AD-0014`); Board disposition = governance enactment. |
| **GAP-R11** — economic fabric | **G (Implementation)** | E (Ratification) | `ECON-*` design-only; `src/control/economic/*` absent (`REAL-M-03` R-2). |
| **GAP-R63/64** — cognition / ethics | **B (Requirement)** | G (Implementation) | `INT-GOV-001`/`CIV-GOV-001` design-only; enroll as governed requirements + build PI-10. |
| **GAP-R51** — first-class temporal model | **B (Requirement)** | F (Architecture) | `UCOS-REQ-0004 §7`: only append-only version order; temporal model unstated. Closed as requirement in `UCOS-REQ-0005`. |
| **GAP-R52** — relativistic time | **B (Requirement)** | F (Architecture) | `CIV-STRESS-001` BP-15 (INV-6-vs-latency WALL). Requirement authored in `UCOS-REQ-0005`; additive resolution via `EXIST-001` CRC. |
| **GAP-R53/54** — spatial-temporal & multi-frame | **B (Requirement)** | F (Architecture) | `O-15` spatial only; no multi-frame construct. Requirements authored in `UCOS-REQ-0005`. |
| **GAP-R57** — century-scale continuity | **B (Requirement)** | F (Architecture) | `ULT-TEST-001` RM-8/RM-9 (crypto-agility, ledger longevity absent). Requirement authored in `UCOS-REQ-0005`. |
| **GAP-R58** — temporal governance | **B (Requirement)** | C (Governance) | Effective-dates ad hoc in `AD-*`; no temporal-governance requirement. Authored in `UCOS-REQ-0005`; governance-validity sub-component. |
| **GAP-R65** — alignment | **B (Requirement)** | E (Ratification), C (Governance) | `INV-CORE-12` (Non-Actuation) DEFINED not enrolled; alignment design-only. Authored in `UCOS-REQ-0006`; enrollment is Board act. |
| **GAP-R20/48** — unknown-future admission protocol | **B (Requirement)** | C (Governance) | Entailed by INV-13/`O-16`/L14 but no requirements-layer admission gate. Authored in `UCOS-REQ-0006`. |
| **GAP-R55** — planetary/oceanic reality of record | **B (Requirement)** | — | Representationally demonstrable (`UNIV-ENTITY-001`) but no ratified requirement. Authored (optional-in-scope) in `UCOS-REQ-0005`. |

---

## 4. P3 gap classification

| Gap ID | Primary | Secondary | Evidence |
|--------|:-------:|:---------:|----------|
| **GAP-R50** — no requirements-registry; IP-01..17 not cross-indexed | **D (Traceability)** | A (Documentation) | `UCOS-AUDIT-0001 §2.6`; `UCOS-REQ-0003 §3` reconciliation note. Establish registry; cross-index 17 immutable principles. |
| **GAP-m1** — federation guards duplicated | **F (Architecture)** | G (Implementation) | `ARCH-GAP-001` minors; additive refactor. |
| **GAP-m2** — descriptor kinds fixed in code | **F (Architecture)** | G (Implementation) | `ARCH-GAP-001` minors; metadata-extensible descriptor kinds. |
| **GAP-m3** — config-layer validation gap | **G (Implementation)** | F (Architecture) | `ARCH-GAP-001` minors; additive validation. |
| **GAP-m4** — ontology not consumed as universal type system (RC-061) | **F (Architecture)** | B (Requirement) | `ARCH-GAP-001` m4; make ontology the consumed typing substrate. |
| **GAP-SUITE** — suite-count divergence (36 vs 40) | **A (Documentation)** | D (Traceability) | `REAL-M-03` T-02 / X-6: pass count 269 undisputed; suite count needs re-measurement. |

---

## 5. Missing-requirement-class classification (all Type B)

| RC | Class | Type | Closure |
|----|-------|:----:|---------|
| RC-020 (≡048) | Future Discovery admission protocol | **B** (+C) | `UCOS-REQ-0006` |
| RC-052 | Relativistic Time | **B** (+F) | `UCOS-REQ-0005` |
| RC-053 | Spatial-Temporal | **B** (+F) | `UCOS-REQ-0005` |
| RC-054 | Multi-Reference Frame | **B** (+F) | `UCOS-REQ-0005` |
| RC-055 | Planetary & Oceanic Reality | **B** | `UCOS-REQ-0005` |
| RC-057 | Time Continuity | **B** (+F) | `UCOS-REQ-0005` |
| RC-058 | Temporal Governance | **B** (+C) | `UCOS-REQ-0005` |
| RC-065 | Alignment | **B** (+E,+C) | `UCOS-REQ-0006` |

All eight MISSING classes are **Requirement Gaps (B)** at their core — they are unstated requirements of
record, closable by authoring governed requirement specifications (this program), **not** by architecture
redesign. Several carry a secondary **F** (an additive architectural construct will later realize them) or
**C/E** (enrollment is a Board governance/ratification act).

---

## 6. Missing-invariant classification

| Item | Type | Evidence |
|------|:----:|----------|
| INV-14, INV-15, INV-16, INV-19, INV-20 (existential) | **C (Governance)** + B | `AUTH-013-AMD-001` — proposed, not enrolled; enrollment = Board Constitutional-Majority act (`AD-0014`). |
| INV-17 ↔ INV-5 conflict | **C (Governance)** | `EXIST-001` R-17 resolved (Reality-Scoped Single-SoR); enactment reserved to Board. |
| INV-18 ↔ INV-6/EX1 conflict | **C (Governance)** + A | `EXIST-001` R-18 resolved (Computation-Realizer Contract); F-CITE-1 documentation correction (A). |
| INV-CORE-01..14 (canonical integrity) | **C (Governance)** + D | `UA-05` — DEFINED, not enrolled; restate/enforce INV-1..13. |
| INV-CORE-12 (Non-Actuation) | **C (Governance)** + E | DEFINED not enrolled; the alignment guarantee. Enrollment path in `UCOS-REQ-0006` + `UCOS-INV-0001`. |

---

## 7. Missing-ratification classification (all Type E, several +C)

| Item | Type | Evidence |
|------|:----:|----------|
| Full Article IX release link | **E** + C | `PHASE-21` F-REC-3; no `AUTH-012` record. |
| PI-8 Ontology ratification (`ONTO-RAT-001`) | **E** | `REAL-M-03` T-04 — self-attested, needs `REAL-C-05` adjudication. |
| PI-9 Memory ratification (`MEM-RAT-003`) | **E** | `REAL-M-03` T-05 — self-attested; supersedes REJECTED `MEM-RAT-001`. |
| AD-0021 adjudication | **C** + E | `AUTH-REST-003/004` — AD-0021 = PI-8 confirmed; `AD-0022 §0` superseded. |
| Retroactive AD-0016..0023 enrollment | **E** + D | `REAL-M-03` T-14 — enrolled append-only (v1.0.13); needs independent attestation. |
| Terminal certification instrument (R14) | **E** + A | `REAL-M-03` T-11 — STALE; re-issue via `REAL-C-01`. |

---

## 8. Authority-chain-defect classification

| Defect | Type | Evidence |
|--------|:----:|----------|
| F-REC-1 (off-ledger decisions) | **C (Governance)** | `PHASE-21`; `AUTH-012 §6/§9`. |
| F-REC-2 (AD-0021 contradiction) | **C** + E | `PHASE-21`; `AUTH-REST-003`. |
| F-REC-3 (missing full-release link) | **E** + C | `PHASE-21`. |
| F-REC-4 (version bookkeeping) | **D (Traceability)** | `PHASE-21`; index/registry vs log. |
| F-REC-5 (template nonconformance) | **A (Documentation)** | `PHASE-21`; `AUTH-012 §6` ten-field schema. |
| F-REC-6 (substantive continuity sound) | **— (positive finding)** | `PHASE-21`; not a defect. |

---

## 9. Completeness-test-failure classification

| Finding | Type | Evidence |
|---------|:----:|----------|
| CT-F2 (L-REAL PARTIAL) | **G (Implementation)** | Higher fabrics + adapters unbuilt (`UCOS-REQ-0002 §11`). |
| CT-F3 (L-ENACT PARTIAL) | **C (Governance)** | INV-14..20 not enrolled; chain restoration (`PHASE-21`). |
| CT-F4 (new realities/computation NOT ESTABLISHED) | **C (Governance)** + F | INV-17/18 conflicts; `EXIST-001` resolves, Board enacts. |
| CT-F5 (temporal FAIL) | **B (Requirement)** + F | Temporal cluster MISSING (`UCOS-REQ-0004 §7`); closed as requirements in `UCOS-REQ-0005`. |

---

## 10. Classification summary

| Type | Primary-classified gaps (count) | Dominant closure mode |
|------|:-------------------------------:|-----------------------|
| **A — Documentation** | 3 (GAP-INV6, GAP-SUITE, F-REC-5) | Trusted-Operation documentation reconciliation |
| **B — Requirement** | 11 (GAP-R29, R51, R52, R53/54, R55, R57, R58, R63/64, R65, R20/48 + 8 MISSING classes overlap) | Governed requirement authoring (this program) |
| **C — Governance** | 8 (GAP-C3, R21, R31/32, INV sets, F-REC-1/2, CT-F3/F4) | Board enactment / gate |
| **D — Traceability** | 3 (GAP-M5, R50, F-REC-4) | Registry / lineage enrollment |
| **E — Ratification** | 6 (missing-ratification family) | Independent attestation (`REAL-C-05`) |
| **F — Architecture** | 9 (GAP-C1, M1, M2, M3, M4, C2, m1, m2, m4) | Additive design + scoped release (0 REDESIGN) |
| **G — Implementation** | 4 (GAP-R11, m3, CT-F2, + build tails) | Scoped construction + validation |

> **Determination.** The gap surface is **dominated by Requirement (B), Governance (C), and Architecture (F/
> additive)** classes. **No gap is classified as a foundation redesign** — consistent with `ULT-TEST-001`'s 0
> `REDESIGN` verdicts. The two P0 gaps are **Governance (GAP-C3)** and **Traceability (GAP-M5)** — both closable
> by governed reconciliation (Phase 6), not by any change to `INV-1..13`, `AUTH-012` substance, or `AD-0014`.
> Every Requirement-Gap (B) among the MISSING classes is closed within this program by `UCOS-REQ-0005`
> (temporal) and `UCOS-REQ-0006` (alignment + admission); Architecture (F) and Implementation (G) gaps carry
> recorded, additive resolution paths that are **out of this constitutional-closure program's scope** (they
> require scoped Article IX releases).

---

## 11. Scope discipline

No code, schema, architecture, or remediation was implemented. Classification is analysis only. `INV-1..13`,
`AUTH-012`, `AD-0014`, and the Article IX generation lock are unchanged.

## 12. Traceability

- **Refines:** `UCOS-GAP-0001`; `UCOS-AUDIT-0001..0003`; `UCOS-REQ-0001..0004`.
- **Evidence:** `ARCH-GAP-001`, `PHASE-21`, `AUTH-REST-003/004`, `REAL-M-03`, `EXIST-001`, `AUTH-013-AMD-001`, `UA-05`, `ULT-TEST-001`, `CIV-STRESS-001`.
- **Refined by:** `UCOS-REQ-0005`, `UCOS-REQ-0006`, `UCOS-INV-0001`, `UCOS-AUTH-0001`, `UCOS-AUDIT-0004`.
- **Owner:** UCOS Authority Board.

**END `UCOS-GAP-0002` — GAP CLASSIFICATION MATRIX · A/B/C/D/E/F/G ASSIGNED · 0 REDESIGN · CLASSIFICATION ONLY.**
