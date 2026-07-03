# UCOS-IR-0006 — Implementation Sequencing Specification

**Artifact ID:** `UCOS-IR-0006`
**Program:** UCOS Phase 1 — Implementation Readiness Assessment
**Phase:** IR-6 — Implementation Sequencing
**Mode:** ASSESSMENT ONLY — no code, schema, architecture, or governance produced. Derives the realization order from the dependency graph (`UCOS-IR-0004`) and validates that no stage depends on a future stage. This is a *sequencing analysis of record*, not an authorization to build (construction remains `UCOS-CONSTRUCTION-BLOCKED`).
**Status:** ASSESSMENT BASELINE (v1.0.0)
**Inputs (read-only):** `UCOS-IR-0002/0003/0004/0005`, `UCOS-AUDIT-0001/0004`, `UCOS-AUTH-0001`, `UCOS-INV-0001`.
**Date:** 2026-07-03

---

## 1. Method

Stages are a topological ordering of the fabric DAG (`UCOS-IR-0004 §6`). Each stage lists its fabrics/actions,
its inbound dependencies (all in earlier stages), and its **current realization status** (DONE = realized of
record at 269/269; PENDING = governed forward step). A stage is valid iff **every dependency resolves to a
lower-numbered stage**. Stages 0–5 reflect what is already realized; stages 6+ are the forward frontier.

---

## 2. Stage sequence

### Stage 0 — Governance-integrity restoration (prerequisite; no build)
- **Actions:** close the two P0 governance-integrity items — independent evidentiary attestation of the
  reconciled `AUTH-012` chain and PI-8/PI-9 ratifications (`REAL-C-05`), program-state reproducibility
  (`REAL-M-03`), terminal-certification re-issue (`REAL-C-01`).
- **Depends on:** — (root).
- **Status:** PARTIAL — chain reconciled documentarily (`UCOS-AUTH-0001`); evidentiary attestation **PENDING**.
- **Gate:** nothing above certifies cleanly until this closes (`UCOS-AUDIT-0001 §4`).

### Stage 1 — Substrate (Meta-Core)
- **Fabrics:** FAB-REG, FAB-META, FAB-CFG, FAB-EXEC, FAB-EVT.
- **Depends on:** Stage 0 (genesis roots seeded).
- **Status:** DONE (PI-2/PI-3; AD-0016).

### Stage 2 — Control plane
- **Fabrics:** FAB-IDENT, FAB-TRUST, FAB-POL, FAB-SEC, FAB-AUTH.
- **Depends on:** Stage 1.
- **Status:** DONE (PI-4; AD-0017). *Caveat:* FAB-POL bounded vocabulary (GAP-M3, closed in Stage 6).

### Stage 3 — Governance core (commit + record)
- **Fabrics:** FAB-EVO, FAB-AUDIT, FAB-STATE, FAB-GOV.
- **Depends on:** Stage 2 (Authority); genesis bootstrap resolves CYC-1/2/3.
- **Status:** DONE (PI-6 Evolution / AD-0019; audit + lifecycle + gates present). *Caveat:* duplication
  (GAP-C1/M2), closed in Stage 6.

### Stage 4 — Federation
- **Fabrics:** FAB-FED.
- **Depends on:** Stage 2 (Identity/Trust/Authority), Stage 3 (Audit/Event).
- **Status:** DONE (PI-5; AD-0018).

### Stage 5 — Core data primitives
- **Fabrics:** FAB-KNOW, FAB-ONTO, FAB-MEM, FAB-OPS.
- **Depends on:** Stage 3 (Evolution/Governance).
- **Status:** DONE (PI-7 knowledge / AD-0020; PI-8 ontology / AD-0021; PI-9 memory / AD-0023; ops ADRs).
  *Caveat:* ontology not yet consumed as universal type system; PI-8/PI-9 attestation (Stage 0 residual).

> **Stages 0–5 constitute the realized Minimum Constitutional Runtime (`UCOS-IR-0005`)** — the correctness-
> complete single-node control kernel. Everything below is the forward frontier.

### Stage 6 — Primitive convergence & hardening (OPTIONAL debt)
- **Actions:** unify universal Authority (GAP-M1), universal Audit/Provenance (GAP-C1), universal
  Evolution/Lifecycle (GAP-M2); make policy predicate vocabulary registry/metadata-extensible (GAP-M3);
  persist memory authorities as metadata (GAP-M4).
- **Depends on:** Stages 2–5 (the fabrics being converged all EXIST).
- **Status:** PENDING (P1 soundness; `ROADMAP-ULT-001` U2.2–U2.5).

### Stage 7 — Constitutional enactment (invariant enrollment; no build)
- **Actions:** Board enrollment of revised INV-17/INV-18 (+C-EX9a/b) and F-CITE-1; INV-14 (+INV-16/19/20 as
  elected); **INV-CORE-12 Non-Actuation ahead of any AI authorization** (`UCOS-INV-0001` S-1..S-6).
- **Depends on:** Stage 0 (chain restoration is the enrollment precondition).
- **Status:** PENDING (analysis complete; enrollment reserved to Board).

### Stage 8 — Temporal realization
- **Fabrics:** FAB-TIME (bi-temporal model; frames-as-locality; crypto-agility; temporal governance).
- **Depends on:** Stage 3 (State/Evolution), Stage 4 (Federation for frames), Stage 5 (Ontology `O-15`),
  Stage 7 (INV-18/INV-19 for relativistic/cosmological).
- **Status:** PENDING (stated-of-record `UCOS-REQ-0005`; future scoped Article IX release).

### Stage 9 — Cognition (Intelligence)
- **Fabrics:** FAB-INTEL.
- **Depends on:** Stage 5 (Knowledge/Ontology/Memory), Stage 2 (Policy), Stage 3 (Evolution/Governance),
  **Stage 7 (INV-CORE-12 enrolled)** — hard precondition.
- **Status:** PENDING (PI-10 design-only; `AD-0024`+).

### Stage 10 — Projection (Simulation)
- **Fabrics:** FAB-SIM.
- **Depends on:** Stage 5 (Ontology), Stage 3 (State/Evolution/Governance); Stage 8 (temporal) for
  time-projection fidelity.
- **Status:** PENDING (PI-11 design-only; `AD-0022` conditional).

### Stage 11 — Economic fabric
- **Fabrics:** FAB-ECON.
- **Depends on:** Stage 3 (Evolution/Audit/Governance), Stage 5 (Registry/Metadata).
- **Status:** PENDING (`ECON-*` design-only; `AD-0014`-adjacent).

### Stage 12 — Civilization fabric
- **Fabrics:** FAB-CIV.
- **Depends on:** Stage 5 (Ontology), Stage 4 (Federation), Stage 3 (Governance), Stage 10 (Simulation for
  digital-twin), **`AD-0014` disposition**.
- **Status:** PENDING (`CIV-*` design-only; deferred `AD-0014`).

### Stage 13 — Platform-factory catalog & scale-out
- **Actions:** author explicit platform-class catalog (GAP-R29) over the INV-13 mechanism; build
  durable/distributed adapters for scale beyond ~10⁶.
- **Depends on:** Stage 1 (Meta-Core mechanism), Stage 11 (Economic for exchange classes), Stages 5–8 for
  full-fidelity classes.
- **Status:** PENDING.

### Stage N — Unknown-future admission (standing capability)
- **Actions:** operate the Unknown-Future Admission Protocol (RC-020≡048; `UR-ALIGN-06`) so RC-068..RC-100 and
  beyond enter by registration, never by re-authoring the baseline.
- **Depends on:** Stage 6 (governance hardening), Stage 7 (INV-20 umbrella if elected).
- **Status:** PENDING (stated-of-record; admission gate unbuilt).

---

## 3. Forward-dependency validation

Each stage's dependencies resolve **only to equal-or-lower stages**:

| Stage | Depends on | Max dependency stage | Forward dep? |
|:-----:|-----------|:--------------------:|:------------:|
| 0 | — | — | No |
| 1 | 0 | 0 | No |
| 2 | 1 | 1 | No |
| 3 | 2 (+genesis) | 2 | No |
| 4 | 2,3 | 3 | No |
| 5 | 3 | 3 | No |
| 6 | 2,3,4,5 | 5 | No |
| 7 | 0 | 0 | No |
| 8 | 3,4,5,7 | 7 | No |
| 9 | 2,3,5,7 | 7 | No |
| 10 | 3,5,8 | 8 | No |
| 11 | 3,5 | 5 | No |
| 12 | 3,4,5,10 | 10 | No |
| 13 | 1,5,8,11 | 11 | No |
| N | 6,7 | 7 | No |

> **Validation result: 0 forward dependencies.** No stage depends on a higher-numbered stage. The one
> non-obvious edge — Stage 9 (Intelligence) requiring Stage 7 (INV-CORE-12 enrollment) — is honored because
> Stage 7 precedes Stage 9. Stage 12 (Civilization) requiring Stage 10 (Simulation) is honored (10 < 12). The
> sequence is a valid topological order of the DAG.

---

## 4. Critical path & parallelism

- **Critical path to a sound kernel:** Stage 0 (attestation) → Stage 6 (convergence) → Stage 7 (enactment).
  Stages 1–5 are DONE; the binding forward constraint is **governance integrity + convergence + enactment**, not
  new substrate.
- **Parallelizable after Stage 5+7:** Stage 8 (Temporal), Stage 11 (Economic), and Stage 6 (convergence) have no
  mutual dependency and may proceed concurrently once their inbound stages close.
- **Serialized on enactment:** Stage 9 (Intelligence) is hard-gated on Stage 7 (Non-Actuation enrolled) — it
  must never precede it. Stage 12 (Civilization) is gated on Stage 10 (Simulation) and `AD-0014`.

---

## 5. Determination

> **A valid, forward-dependency-free implementation sequence exists** (Stages 0–13 + Stage N). Stages 0–5 —
> the Minimum Constitutional Runtime — are **realized of record**; the remaining stages are **governed forward
> steps** with **0 forward dependencies**, meaning the constitutional system can be realized to completion in a
> strictly ascending order with no ordering contradiction.

The sequence makes explicit that the **next real work is not more substrate** but (a) closing the Stage 0
governance-integrity residual, (b) Stage 6 primitive convergence, and (c) Stage 7 constitutional enactment —
after which the behavioral/temporal frontier (Stages 8–13) becomes buildable in order. Construction of any stage
remains reserved to the Authority Board; `UCOS-CONSTRUCTION-BLOCKED` stands.

> **Scope discipline.** No code, schema, architecture, or governance was produced. `INV-1..13`, `AUTH-012`,
> `AD-0014`, and the Article IX generation lock are unchanged.

## 6. Traceability

- **Refines:** `UCOS-IR-0004` (dependency tiers), `UCOS-IR-0005` (MCR = Stages 0–5).
- **Evidence:** `UCOS-AUDIT-0001 §4` (critical path), `UCOS-INV-0001 §5` (enrollment sequencing S-1..S-6), `UCOS-AUTH-0001` (Stage 0 residual), `ROADMAP-ULT-001` (U2 convergence).
- **Refined by:** `UCOS-IR-0007` (Risk Register), `UCOS-IR-0008` (Readiness).
- **Owner:** UCOS Authority Board.

**END `UCOS-IR-0006` — IMPLEMENTATION SEQUENCING · STAGES 0–13 + STAGE N · STAGES 0–5 REALIZED (MCR) · 0 FORWARD DEPENDENCIES · CONSTRUCTION RESERVED (BLOCKED) · ASSESSMENT ONLY.**
