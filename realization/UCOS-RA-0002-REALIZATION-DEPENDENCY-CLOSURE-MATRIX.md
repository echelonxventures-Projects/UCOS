# UCOS-RA-0002 — Realization Dependency Closure Matrix

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-RA-0002` |
| Program | **UCOS Phase 1.5 — Realization Closure Authority** |
| Phase | RA-2 — Realization Dependency Closure |
| Mode | **REALIZATION-AUTHORITY ANALYSIS ONLY** — no code, schema, architecture, requirement, RC class, invariant, or authorization produced or modified. Establishes prerequisites, dependencies, outputs, and acceptance criteria for every remaining realization item. |
| Status | REALIZATION BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Inputs (read-only) | `UCOS-RA-0001` (dispositioned register); `UCOS-IR-0004` (fabric dependency graph); `UCOS-IR-0006` (Stages 0–13+N; 0 forward deps); `UCOS-EA-0002` (blocker closure plan W1..W5); `UCOS-REQ-0005` (temporal deps) |
| Governing constraints | INV-1..13 unchanged; `AD-0014` intact; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. No new requirements/RC/invariants/authorization. |

---

## 0. Purpose & method

For every remaining realization item in `UCOS-RA-0001`, this matrix records four fields — **Prerequisites**
(what must be TRUE first), **Dependencies** (which other items/stages it consumes), **Outputs** (the artifact/
evidence produced), and **Acceptance Criteria** (the binary condition proving closure). Dependencies are drawn
from the ratified fabric DAG (`UCOS-IR-0004`) and the validated forward-dependency-free stage sequence
(`UCOS-IR-0006 §3`); no dependency is invented, and the **0-forward-dependency** property is preserved.

---

## 1. Mandatory items — execution gate G0 (evidentiary + one Board act)

| Item | Prerequisites | Dependencies | Outputs | Acceptance criteria (binary; TRUE ⇒ CLOSED) |
|------|---------------|--------------|---------|----------------------------------------------|
| **RR-1 / EA-B-P0-1** | Documentary chain restoration done (`AUTH-REST-004`, AUTH-012 v1.0.13, AD-0001..0023 enrolled) | — (root; Stage 0) | `REAL-C-05` independent adjudication report; `REAL-H-07` gate PASS | An independent party attests the `AUTH-012` chain **and** the PI-8/PI-9 ratifications; `REAL-H-07` returns PASS; self-attestation rejected |
| **RR-2 / EA-B-P0-2** | Recorded program state accessible; test corpus runnable | — (root; Stage 0) | `REAL-M-03` independent re-run log | Independent re-measurement reproduces **269/269**; `PROJECT-STATE §0W` (213/213, "Memory REJECTED") divergence reconciled; suite count (36 vs 40) resolved to one number of record |
| **EA-B-P1-7** | RR-1 attestation state known (chain + memory disposition) | RR-1, RR-2 | Re-issued `REAL-C-01` → `UCOM-ULTIMATE-CERT-002` | Terminal certificate re-issued: 269/269, memory ACCEPTED, chain state consistent with EA-B-P0-1; stale R14 superseded of record |
| **EA-B-P0-3 / C-6 / UCC-5** (pivot) | RR-1 ∧ RR-2 ∧ EA-B-P1-7 CLOSED | RR-1, RR-2, EA-B-P1-7 | Authority-Board authorization act; block-lift record; full Article IX release link | Board act on record cites P0-1, P0-2, P1-7 as PASS **and** lifts `UCOS-CONSTRUCTION-BLOCKED` for the authorized scope |

> **G0 = EA-B-P0-1 ∧ EA-B-P0-2 ∧ EA-B-P1-7 ∧ EA-B-P0-3.** The pivot (P0-3) is *strictly dependent* — it cannot
> close until the other three are TRUE. This is the only closure sequence with an ordering constraint inside the
> mandatory set: **W1 (P0-1 + P0-2) → W2 (P1-7) → W3 (P0-3)**. None requires software.

---

## 2. Production-mandatory items (gate READY → PRODUCTION only)

| Item | Prerequisites | Dependencies | Outputs | Acceptance criteria |
|------|---------------|--------------|---------|---------------------|
| **EA-B-P1-5** (scale-out) | G0 PASS (construction unblocked); MCR realized | Stage 1 (Meta-Core), Stage 13 | Durable SoR/cache externalization; distributed adapters behind existing ports | Durable/distributed adapters built behind unchanged ports; first-scale-break (~10⁶) relieved; INV-7 stateless preserved; 0 core-dir change |
| **UCC-4** (Operational Certification) | G0 PASS; ENV provisioning authorized (AD-0015 + AD-0009) | EA-B-P1-5; RA-1/RA-2 runbooks | `UCOS-P12-CERT-002`-class evidence: provisioned ENV-DEV/INT, executed pipeline, contract tests, DR drill, measured RPO/RTO/p99, immutable audit | G12-1/2/3 CLOSED with live evidence of record; measured NFRs meet `UCOS-ASR-NFR-001` floors |

---

## 3. Optional items — soundness / uniformity / catalog (Stage 6 / Stage 13)

| Item | Prerequisites | Dependencies | Outputs | Acceptance criteria |
|------|---------------|--------------|---------|---------------------|
| **RR-3 / EA-B-P1-1** | G0 PASS | Stages 2–5 (fabrics exist) | `AUDIT-UNIV-001` adopted (10th primitive) | All 6 audit implementations route through 1 primitive; uniform, offline-verifiable; 0 divergent audit paths |
| **RR-3 / EA-B-P1-2** | G0 PASS | Stages 2–5 | `AUTH-UNIV-001` universal primitive | Certification/ratification/revocation subsumed; per-fabric authority is config-only; 0 duplicated authority code |
| **RR-3 / EA-B-P1-3** | G0 PASS | Stages 3–5 | `LIFE-UNIV-001` single lifecycle | 4 state machines replaced; lifecycle profiles are data; 0 parallel lifecycle engines |
| **RR-4 / EA-B-P1-4** | G0 PASS | Stage 2 (FAB-POL) | Registry/metadata-extensible predicate vocabulary | New predicate = data registration, not code change (IP-04); 5-rule switch removed |
| **EA-B-P1-8** | G0 PASS | Stage 5 (FAB-MEM) | Memory authorities as metadata records | Authorities persisted via `MetadataPort`; federatable + uniform governance; 0 in-process Maps |
| **RR-5 / EA-B-P1-6** | Stages 5–8 for full-fidelity classes | Stage 1 mechanism; Stage 11 (exchange classes) | Governed platform-class catalog over INV-13 | Enumerated platform classes of record; "any platform" provable at catalog layer; 0 new core primitive |
| **UCC-6** | G0 PASS | RA-1 §004 | `PE-12` observability ADR | Observability product/contract decided by governed ADR |
| **UCC-7** | G0 PASS | RR-3/RR-5 | `REG-ABS-001` closure; `UCOM-P2..P5` enrollment | Registry-absolutism gaps closed; minimum primitive set enrolled; additive, 0 core-dir change |

---

## 4. Deferred items — behavioral / temporal / alignment / admission / existential

| Item | Prerequisites | Dependencies | Outputs | Acceptance criteria |
|------|---------------|--------------|---------|---------------------|
| **RR-7** (temporal, FAB-TIME) | G0 PASS; Stage 7 (INV-18/INV-19 disposition for relativistic/cosmological) | Stage 3 (State/Evolution), Stage 4 (Federation), Stage 5 (`O-15`), Stage 7 | Additive temporal constructs per `UCOS-RA-0003` (bi-temporal, frames-as-locality, crypto-agility, temporal governance) | UR-TIME-01..07 realized additively; INV-10/INV-5/INV-6 unweakened; 0 REDESIGN (see `UCOS-RA-0003`) |
| **RR-8** (alignment / INV-CORE-12) | Stage 7 enrollment (Non-Actuation) **before** Stage 9 | Stage 5, Stage 2, Stage 3, Stage 7 | INV-CORE-12 enrolled; PI-10 built + ratified with I1–I12 | Non-Actuation enrolled of record ahead of any AI actor; PI-10 adversarial suite green |
| **RR-6** (behavioral fabrics) | Scoped Article IX release per fabric; upstream stages DONE | Stages 9 (Intel), 10 (Sim), 11 (Econ), 12 (Civ) | Additive `src/control/*` builds under scoped AD | Each fabric built additively; baseline stays green; 0 core-dir change; deny-by-default/S1/S3/S4 preserved |
| **RR-9** (unknown-future admission) | Stage 6 (governance hardening); Stage 7 (INV-20 if elected) | Stage 6, Stage 7 | Governed requirements-admission gate | RC-068..RC-100+ enter by registration, not baseline re-authoring |
| **RR-10** (existential INV-14..20) | Board disposition of `AUTH-013-AMD-001`; resolve INV-17↔INV-5 / INV-18↔INV-6 | Stage 7; `EXIST-001` | Board enactment record; `EXIST-001` CRC enactment | Held under `AD-0014` until Board acts; **no enrollment in this program** |

---

## 5. Dependency-closure graph (item level)

```
Stage 0 (root, no build)
  ├─ RR-1/EA-B-P0-1 ─┐
  └─ RR-2/EA-B-P0-2 ─┼─→ EA-B-P1-7 ─→ EA-B-P0-3 / C-6 / UCC-5  [G0 PASS]
                     │                        │
                     │                        ├─→ EA-B-P1-5 ─→ UCC-4  [PRODUCTION]
                     │                        ├─→ Stage 6: RR-3(P1-1/2/3), RR-4(P1-4), P1-8, UCC-7  [OPTIONAL]
                     │                        └─→ Stage 7 (enactment) ─→ Stage 8 RR-7 (temporal)
                     │                                              └─→ Stage 9 RR-8/RR-6 (Intel, gated on INV-CORE-12)
                     │                                                    └─→ Stage 10 RR-6 (Sim) ─→ Stage 12 RR-6 (Civ, AD-0014)
                     │                                                    └─→ Stage 11 RR-6 (Econ)
                     └─────────────────────────────────────────────────→ Stage 13 RR-5 (catalog) · Stage N RR-9 (admission)
RR-10 (existential) — held under AD-0014; enters only via Stage 7 Board enactment.
```

**Forward-dependency check:** every edge points from a lower stage/prerequisite to a higher one; the sole
ordering constraint inside the mandatory set is W1→W2→W3. **0 forward dependencies** (consistent with
`UCOS-IR-0006 §3`). No item depends on an item it precedes; no cycle.

---

## 6. Determination

> **Every remaining realization item has a complete closure signature** — prerequisites, dependencies, outputs,
> and a binary acceptance criterion — with **0 forward dependencies** and **0 REDESIGN**. The critical path to
> READY is the three-wave evidentiary/authorization sequence **W1 (RR-1+RR-2) → W2 (EA-B-P1-7) → W3 (EA-B-P0-3
> pivot)**; the path to PRODUCTION adds **EA-B-P1-5 → UCC-4**; the Optional soundness set (Stage 6) and the
> Deferred frontier (Stages 7–13+N; `AD-0014`) are parallelizable behind G0 in strictly ascending stage order.

## 7. Scope discipline

No code, schema, requirement, RC class, invariant, or authorization was produced or modified. INV-1..13,
`AUTH-012`, `AD-0014`, and the Article IX lock are unchanged; `UCOS-CONSTRUCTION-BLOCKED` stands.

## 8. Traceability

- **Consumes:** `UCOS-RA-0001`; `UCOS-IR-0004` (DAG); `UCOS-IR-0006` (stages, 0 forward deps); `UCOS-EA-0002` (W1..W5); `UCOS-REQ-0005` (temporal deps).
- **Refined by:** `UCOS-RA-0003` (Temporal Spec) … `UCOS-RA-0008` (Final Determination).
- **Owner:** UCOS Authority Board.

**END `UCOS-RA-0002` — REALIZATION DEPENDENCY CLOSURE MATRIX · ALL ITEMS: PREREQS · DEPS · OUTPUTS · ACCEPTANCE · 0 FORWARD DEPS · 0 CYCLES · CRITICAL PATH W1→W2→W3 (+P1-5→UCC-4 FOR PRODUCTION) · 0 REDESIGN · ANALYSIS ONLY.**
