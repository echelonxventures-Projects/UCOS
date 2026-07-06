# AGP-D6 — INTEGRITY / DRIFT FINDINGS SET

**Deliverable:** D-6 (S-6) · attest-only, append-only, fail-closed, **non-coercive**.
**Rule (CTL-4):** detect drift / duplication / divergence; **withhold conformance** where found. The
program **reports and withholds only** — it never corrects, executes, or mutates the governed artifact.
**Source (INV-5):** D-1…D-5 · `UCOS-CAPABILITY-INVENTORY` §findings.

| ID | Finding | UCAP | Severity | Conformance |
|---|---|---|:--:|:--:|
| **DRIFT-1** | **Implemented capability outside governance** — fabrics exist in code, are exported from `control/index.ts`, and contribute to the 356-test baseline, yet **no work item governs them**. Most severe drift class. | 26, 30, 31, 32 | CRITICAL | **WITHHELD** |
| **DRIFT-2** | **Architected without governance** — design specs exist (7 for Autonomy, 7 for Ecosystem; plus Workflow/Event/Economic/Civilization/UI) with no work item. | 12,13,14,20,25,33,34 | HIGH | **WITHHELD** |
| **DRIFT-3** | **Ratification-quality divergence** — governed capabilities whose ratification is contested / self-attested / pending / gated. | 06 (contested), 07 (self-attested), 18 (pending), 17 (gated) | HIGH | **WITHHELD** |
| **DRIFT-4** | **Potential duplication** — UCAP-26 Observability Fabric and UCAP-30 Operations/Observability(impl.) occupy the same locus (`control/operations`); risk of duplicate/overlapping capability (violates P1 Composability). | 26 ⟷ 30 | MEDIUM | **WITHHELD (pending disambiguation)** |
| **DRIFT-5** | **Ungoverned sub-component within a governed capability** — UCAP-28 Governance Runtime carries a readiness fabric that is itself UNGOVERNED. | 28 | MEDIUM | **WITHHELD (sub-scope)** |
| **DRIFT-6** | **Self-attestation of the governance corpus** — all UCOS ratifications (incl. this program's outputs) are self-attested; independent adjudication (`REAL-C-05`) has 0 attestations. | corpus-wide | MEDIUM | **DISCLOSED (not withheld — a standing condition, not a per-capability drift)** |

## Non-coercion attestation

- The program has taken **no** corrective action on any governed artifact. It has **withheld conformance**
  for DRIFT-1…DRIFT-5 (an *absence* of a positive verdict) and **disclosed** DRIFT-6. No execution,
  mutation, rollback, or override was performed. (INV-CORE Non-Actuation preserved.)

## Withheld-conformance set (forwarded to Verification/Certification, not resolved here)

`{26, 30, 31, 32}` CRITICAL · `{12,13,14,20,25,33,34}` HIGH · `{06,07,17,18}` HIGH ·
`{26⟷30, 28}` MEDIUM.

**D-6 STATUS: COMPLETE — 6 findings recorded; conformance withheld for 5 drift classes (non-coercively);
corpus self-attestation disclosed. Drift is denied standing, not corrected by force.**
