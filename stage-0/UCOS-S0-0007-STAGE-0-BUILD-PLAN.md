# UCOS-S0-0007 — Stage-0 Build Plan

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-S0-0007` |
| Program | **UCOS Stage 0 — Foundation Implementation Package** |
| Phase | S0-7 — Build Plan |
| Mode | **IMPLEMENTATION PLANNING ONLY** — renders the Stage-0 build order, tasks, dependencies, acceptance, and completion criteria. No build is authorized or performed; every build task is gated on **G0 = PASS** and reserved to the Authority Board. |
| Status | STAGE-0 SPECIFICATION (v1.0.0) |
| Date | 2026-07-03 |
| Operates under | `UCOS-EXEC-0001` (Part IV sequencing, Part V criteria); `UCOS-RA-0006` (Stage exits); `UCOS-EP-0001` (WBS); `UCOS-EP-0006` (Gate 0..N); `UCOS-EP-0007` (critical path); `UCOS-S0-0001..0006` |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; `AD-0014` intact; Article IX lock **ACTIVE**; **`UCOS-CONSTRUCTION-BLOCKED` stands**. 0 forward dependency; 0 REDESIGN; additive-only. |

---

## 0. Purpose & standing

Renders the **Stage-0 build plan**: the ordered work, dependencies, and acceptance/completion criteria to reach
an executable foundation. Per the frozen corpus the foundation runtime (**MCR**) is **realized of record**
(`UCOS-IR-0005 §9`; Stages 1–5 DONE in `UCOS-RA-0006`), and the corpus's **Stage 0 is the no-build governance
GATE (G0)** (`UCOS-EXEC-0001` Part IV). Therefore the Stage-0 build plan is dominated by a single mandatory
predecessor — **close G0** — after which the realized foundation is authorized for operation and forward waves
proceed. This plan authorizes nothing; it orders work (`UCOS-RA-0006 §0`).

---

## 1. Build order

```
TASK 0  ── GATE 0 (G0) ── governance-integrity + execution authorization   [NO BUILD; MANDATORY PREDECESSOR]
             W1: T0.1 REAL-C-05 independent attestation  ∥  T0.2 REAL-M-03 independent re-measurement (269/269)
             W2: T0.3 REAL-C-01 → UCOM-ULTIMATE-CERT-002 re-issued
             W3: T0.4 Authority-Board A-1 act → lift UCOS-CONSTRUCTION-BLOCKED   ⇒ G0 = PASS
   │
   ▼  (nothing below is authorized until G0 = PASS)
TASK 1  Foundation runtime authorization-to-operate   (realized MCR; UCOS-S0-0004)      [Gate 1 — DONE of record]
TASK 2  Registry population from frozen seed sets      (UCOS-S0-0002 / UCOS-S0-0003 §4)  [additive]
TASK 3  Datastore realization (logical → physical; migrations M0..M10)  (UCOS-S0-0003)   [additive; post-G0]
TASK 4  API contract activation (Internal/Registry/Authority/Config/Health)  (UCOS-S0-0005) [contract-first]
TASK 5  Acceptance suite execution + independent reproduction  (UCOS-S0-0006)            [fail-closed]
```

> Tasks 1–5 formalize/operationalize the **already-realized** foundation; they are **additive and introduce no
> redesign** (`UCOS-EXEC-0001` Commandment 4). Task 3 physical-schema authoring is the only genuinely new
> construction and is strictly gated on G0 and Board authorization.

---

## 2. Implementation tasks & dependencies

| Task | Description | Depends on | Class | Owner |
|:----:|-------------|:----------:|:-----:|-------|
| T0.1 | `REAL-C-05` independent attestation (authority chain + PI-8/PI-9) | — | GATE (evidence) | Independent adjudicator |
| T0.2 | `REAL-M-03` independent re-measurement (reproduce 269/269) | — | GATE (evidence) | Independent re-measurer |
| T0.3 | Re-issue terminal cert `UCOM-ULTIMATE-CERT-002` | T0.1, T0.2 | GATE (cert) | Certification authority |
| T0.4 | **Board A-1 act** — lift `UCOS-CONSTRUCTION-BLOCKED` + Article IX release | T0.1–T0.3 | GATE (authority) | **UCOS Authority Board (human)** |
| T1 | Authorize realized MCR to operate | **T0.4 (G0=PASS)** | BUILD-op | Implementation Program |
| T2 | Populate registries from frozen seed | T1 | BUILD (additive) | Implementation Program |
| T3 | Realize datastores; run migrations M0..M10 | T1, T2 | BUILD (additive) | Implementation Program |
| T4 | Activate API contracts (S1/S3/S4 armed) | T1, T2, T3 | BUILD (contract-first) | Implementation Program |
| T5 | Execute acceptance suite; obtain independent reproduction | T2, T3, T4 | VALIDATE | Implementation + Independent party |

**Dependency validation:** every task depends only on equal-or-lower tasks; **0 forward dependency**
(`UCOS-IR-0006 §3`; `UCOS-EP-0007`). T0.4 is the single pivot gating all build (`UCOS-EP-0007 §4`).

---

## 3. Acceptance criteria (per task; `UCOS-EXEC-0001 §V.1`)

| Task | ACCEPTED when |
|:----:|---------------|
| T0.1 | `REAL-C-05` of record; `REAL-H-07` PASS; independent (not self-attested) — **AT-P0-1 = TRUE** |
| T0.2 | 269/269 independently reproduced; §0W reconciled; suite-count resolved — **AT-P0-2 = TRUE** |
| T0.3 | `UCOM-ULTIMATE-CERT-002` issued grounded in T0.1/T0.2; R14 superseded — **AT-P1-7 = TRUE** |
| T0.4 | Board A-1 act on `AUTH-012`; LE-1∧LE-2∧LE-3 cited PASS; block lifted — **AT-P0-3 = TRUE** |
| T1 | MCR authorized-to-operate; baseline green; 0 core-dir change | 
| T2 | Registries populated verbatim from frozen seed; RT-1/RT-2 PASS |
| T3 | Migrations M0..M10 applied forward-only; IT-1..IT-7 PASS; 0 destructive change |
| T4 | Contracts activated; S1/S3/S4 enforced on every boundary; FT-1..FT-7 PASS |
| T5 | Full acceptance suite (30 assertions) PASS **and** independently reproduced |

Each criterion is **binary and fail-closed**: FALSE ⇒ task not accepted; no partial acceptance (`§V.4`).

---

## 4. Completion criteria (`UCOS-EXEC-0001 §V.2`)

| Level | COMPLETE when |
|-------|---------------|
| **Gate 0 (Stage-0 exit)** | **G0 = AT-P0-1 ∧ AT-P0-2 ∧ AT-P1-7 ∧ AT-P0-3 = PASS**; `UCOS-CONSTRUCTION-BLOCKED` lifted for the authorized scope (`UCOS-RA-0006` Stage 0 exit; `UCOS-EP-0006` Gate 0) |
| **Foundation build** | T1–T5 accepted; 30/30 acceptance assertions PASS with independent reproduction; baseline green; 0 forward-dependency violation; 0 prohibited-core-dir change; S1/S3/S4 enforced; traceability intact (0 orphans) |
| **Stage-0 program** | Gate 0 exited **and** foundation build complete — the executable foundation exists and is authorized to begin realization (opens Gate 1→ forward waves per `UCOS-EP-0006`) |

---

## 5. Current state & gating determination

| Element | State of record | Source |
|---------|:---------------:|--------|
| Foundation runtime (MCR) | **REALIZED** (269/269) | `UCOS-IR-0005 §9` |
| Repository / registries / datastores / runtime / APIs / tests | **SPECIFIED** (`UCOS-S0-0001..0006`) | this package |
| AT-P0-1 attestation | **FAIL** (pending independent) | `UCOS-G0-0006` |
| AT-P0-2 re-measurement | **FAIL** (pending independent) | `UCOS-G0-0006` |
| AT-P1-7 terminal cert | **FAIL** (stale R14) | `UCOS-G0-0006` |
| AT-P0-3 Board lift act | **FAIL** (block stands) | `UCOS-G0-0006` |
| **Gate 0 (G0)** | **FAIL (0/14 atomic evidence met)** | `UCOS-G0-0006` |

> **The build plan is complete and its predecessor is unmet.** Every downstream task (T1–T5) is gated on T0.4,
> which is gated on T0.1–T0.3 — none of which is of record. Tasks T0.1/T0.2/T0.3 require **no software** and are
> executable now; T0.4 is the single reserved Board act (`UCOS-EP-0007 §4`).

---

## 6. Determination

> **The Stage-0 build plan is fully rendered** — a single mandatory GATE-0 predecessor (four evidentiary/
> authority tasks W1→W2→W3) followed by five additive foundation tasks (authorize-to-operate, registry
> population, datastore realization, API activation, acceptance + independent reproduction), all with **0 forward
> dependency, 0 REDESIGN, 0 prohibited-core-dir change**. Acceptance is binary/fail-closed per `UCOS-EXEC-0001
> §V.1`; completion is defined at Gate-0, foundation-build, and program levels. **The plan's mandatory predecessor
> (G0 = PASS) is unmet (G0 = FAIL, 0/14 evidence);** therefore no build task is authorized and construction
> remains blocked. The plan authorizes nothing — it orders work reserved to the Authority Board.

## 7. Scope discipline
No code, schema, API, requirement, RC class, invariant, governance, or authority was produced or modified.
INV-1..13, `AUTH-012`, `AD-0014`, and the Article IX generation lock are unchanged;
**`UCOS-CONSTRUCTION-BLOCKED` stands.** Build planning only.

## 8. Traceability
- **Consumes:** `UCOS-EXEC-0001` (Part IV/V); `UCOS-RA-0006` (Stage 0 exit); `UCOS-EP-0001` (WBS); `UCOS-EP-0006` (Gate 0..N); `UCOS-EP-0007` (critical path); `UCOS-G0-0006` (G0=FAIL); `UCOS-S0-0001..0006`.
- **Refined by:** the Authority-Board Wave-0 authorization act (the only instrument that unblocks T1–T5).
- **Owner:** UCOS Authority Board.

**END `UCOS-S0-0007` — STAGE-0 BUILD PLAN · TASK 0 = GATE 0 (W1→W2→W3; NO BUILD) → T1–T5 ADDITIVE FOUNDATION · 0 FORWARD DEP · 0 REDESIGN · BINARY FAIL-CLOSED ACCEPTANCE · G0 = FAIL (0/14) ⇒ NO BUILD AUTHORIZED · PLANNING ONLY.**
