# ONTO-RAT-SEC-002 — Semantic Constraint Validation (Independent)

| Field | Value |
|-------|-------|
| Artifact ID | `ONTO-RAT-SEC-002` |
| Phase | PHASE 17.3 · PI-8 Ontology Fabric — Independent Validation |
| Method | Source inspection of `semantic-constraint-engine.ts` + adversarial-test reproduction |
| Verdict | **PASS** (SI-1..SI-7 implemented & fail-closed) with one non-blocking finding (F-1) |

## Claim under test
> SI-1 .. SI-7 semantic integrity implemented and enforced (fail-closed, pre-commit + atomic apply).

## Independent evidence — SI-1..SI-7 present in the engine and gated

| Rule | Engine (semantic-constraint-engine.ts) | Reproduced adversarial test |
|------|----------------------------------------|-----------------------------|
| **SI-1** Referential integrity | documented + implemented | dangling relationship range **blocked** (`semantic-integrity gate failed`) |
| **SI-2** Taxonomy acyclicity (DAG) | implemented; `TaxonomyModel.detectCycle` pure DAG check | classification cycle **rejected**; `detectCycle` unit test |
| **SI-3** Domain/range + inverseOf reciprocity | implemented | non-reciprocal `inverseOf` **blocked** |
| **SI-4** Attribute conformance (unique, declarative) | implemented | duplicate attribute name **blocked** |
| **SI-5** Cardinality well-formedness (4 legal forms) | implemented | exercised by well-formed graph (N:M/N:1/1:N) pass; illegal forms rejected by the gate |
| **SI-6** Disjointness / non-contradiction | implemented | co-classification under two disjoint types **blocked** |
| **SI-7** Authority-neutrality (meaning ≠ authority) | implemented | a constraint targeting a non-waivable S1/S3/S4 control **blocked** |

- The gate runs **fail-closed at commit** (a blocked commit is audited `ONTO_INTEGRITY … BLOCKED` and
  **never persisted** — reproduced test) and a well-formed graph passes with 0 `block` violations.

## Findings
- **F-1 (Low, non-blocking) — threat-label traceability mismatch.** The adversarial suite's O-labels
  do **not** align 1:1 with the ONTO-THREAT-001 canonical numbering: e.g., replay is labeled `O2` in
  tests but is canonical `O3`; silent-mutation is labeled `O11` but is canonical `O10`; trust-clamping
  is labeled `O7` but is canonical `O2`; local-sovereignty is labeled `O6` but maps to canonical
  `O12/O9`. The **threat surface is fully covered** (see ONTO-RAT-SEC-001 mapping); only the
  numbering/traceability is inconsistent. Recommend a documentation-only relabel in a future Trusted
  Operation to restore 1:1 traceability. **Not a security gap; not blocking.**

## Determination
SI-1..SI-7 implemented, fail-closed, and adversarially verified. **PASS** (with non-blocking F-1).
