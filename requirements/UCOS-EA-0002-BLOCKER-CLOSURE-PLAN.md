# UCOS-EA-0002 — Blocker Closure Plan

**Artifact ID:** `UCOS-EA-0002`
**Program:** UCOS Phase 1.1 — Execution Authorization Audit (PARTIAL → READY blocker elimination)
**Phase:** EA-2 — Closure Criteria & Closure Sequence
**Mode:** ASSESSMENT ONLY — no code, schema, architecture, requirement, governance, or authority is produced or modified. Defines, for every blocker in `UCOS-EA-0001`, the **exact closure criterion** (what proves it closed) and the **exact closure sequence** (the order in which closures must occur, honoring all dependencies).
**Status:** ASSESSMENT BASELINE (v1.0.0)
**Inputs (read-only):** `UCOS-EA-0001`, `UCOS-IR-0004/0005/0006/0007/0008`, `UCOS-AUTH-0001`, `UCOS-INV-0001`.
**Date:** 2026-07-03

---

## 1. Purpose

`UCOS-EA-0001` registered 11 open blockers (3 P0, 8 P1) with a closure type each. This plan converts each into
a **binary, independently checkable closure criterion** and orders them into a **single valid closure sequence**
with **0 forward dependencies** (consistent with `UCOS-IR-0006`). A blocker is CLOSED only when its criterion is
satisfied *and* the evidence is of record; documentary intent does not close an Evidentiary blocker.

---

## 2. Exact closure criteria

Each criterion is stated as a proposition that is either TRUE (closed) or FALSE (open). "Of record" means the
evidence artifact exists, is versioned, and is referenced from the traceability chain.

### 2.1 P0 closure criteria

| Blocker | Type | Exact closure criterion (TRUE ⇒ CLOSED) | Closing instrument |
|---------|:----:|------------------------------------------|--------------------|
| **EA-B-P0-1** | Evidentiary | An **independent** adjudication attests the reconciled `AUTH-012` chain (AD-0001..0023 @ v1.0.13) **and** the PI-8/PI-9 ratifications, with the attestation report of record and passing the `REAL-H-07` gate. Self-attestation is explicitly insufficient. | `REAL-C-05` |
| **EA-B-P0-2** | Evidentiary | An **independent re-measurement** reproduces **269/269** from the recorded program state, reconciles the `PROJECT-STATE §0W` divergence (213/213 & "Memory REJECTED"), and resolves the suite-count discrepancy (36 vs 40) to a single number of record. | `REAL-M-03` (independent re-run) |
| **EA-B-P0-3** | Governance | The Authority Board issues an **authorization act** that (a) records EA-B-P0-1 and EA-B-P0-2 as CLOSED, (b) records `REAL-C-01` re-issued (EA-B-P1-7), and (c) **lifts `UCOS-CONSTRUCTION-BLOCKED`** for the authorized scope under the Article IX lock. | Board authorization act |

> **EA-B-P0-3 is strictly dependent:** it cannot be satisfied until EA-B-P0-1, EA-B-P0-2, and EA-B-P1-7 are
> CLOSED. It is the *last* P0 to close and the pivot for execution authorization.

### 2.2 P1 closure criteria

| Blocker | Type | Exact closure criterion (TRUE ⇒ CLOSED) | Closing instrument |
|---------|:----:|------------------------------------------|--------------------|
| **EA-B-P1-7** | Evidentiary | `REAL-C-01` re-issued as `UCOM-ULTIMATE-CERT-002` reflecting 269/269, memory ACCEPTED, and chain state consistent with the EA-B-P0-1 attestation; the stale R14 instrument is superseded of record. | `REAL-C-01` re-issue |
| **EA-B-P1-1** | Architectural | A single universal Audit/Provenance primitive (`AUDIT-UNIV-001`) is adopted; all **6** prior audit implementations route through it (6→1); tamper-evidence is uniform and offline-verifiable. | GAP-C1 convergence (Stage 6) |
| **EA-B-P1-2** | Architectural | A single universal Authority primitive (`AUTH-UNIV-001`) subsumes certification/ratification/revocation; per-fabric authority behavior is expressed **as config**, not duplicated code. | GAP-M1 convergence (Stage 6) |
| **EA-B-P1-3** | Architectural | A single Evolution/Lifecycle primitive (`LIFE-UNIV-001`) replaces the 4 parallel state machines; lifecycle **profiles are data**. | GAP-M2 convergence (Stage 6) |
| **EA-B-P1-4** | Architectural | The policy predicate vocabulary is **registry/metadata-extensible**; adding a predicate requires **no code change** (zero-hardcoding, IP-04 satisfied). | GAP-M3 convergence (Stage 6) |
| **EA-B-P1-8** | Architectural | Memory authorities are **persisted as metadata records** via `MetadataPort` (no in-process Maps); memory governance is federatable and uniform. | GAP-M4 convergence (Stage 6) |
| **EA-B-P1-5** | Operational | State is externalized to a **durable** System-of-Record/cache and **distributed adapters** exist; a scale test demonstrates operation **beyond ~10⁶** without invariant loss (INV-5/INV-7/INV-10 hold under distribution). | Durable/distributed adapters (Stage 13) |
| **EA-B-P1-6** | Governance | A **governed platform-class catalog** is authored over the INV-13 composition mechanism, enumerating platform classes such that "any platform" is demonstrable at the catalog layer (RC-029 satisfied). | GAP-R29 catalog (Stage 13) |

---

## 3. Closure dependency analysis

Closure edges (X → Y means "Y cannot close until X is closed"):

- **EA-B-P0-1 → EA-B-P1-7** — the re-issued terminal cert must reflect the attested chain state.
- **EA-B-P0-1, EA-B-P0-2, EA-B-P1-7 → EA-B-P0-3** — the Board act records all three before lifting the block.
- **EA-B-P0-3 → {EA-B-P1-1, -2, -3, -4, -8}** — Stage 6 convergence is a *build*; no build may proceed while
  `UCOS-CONSTRUCTION-BLOCKED` stands (RISK-P0-3). Convergence therefore closes **after** the block is lifted.
- **EA-B-P0-3 → {EA-B-P1-5, EA-B-P1-6}** — Stage 13 durable/distributed adapters and platform catalog are
  builds; likewise gated behind the lifted block.
- **{EA-B-P1-1..4, -8} (Stage 6) → {EA-B-P1-5, -6} (Stage 13)** — scale-out and catalog build on converged
  FOUNDATIONAL primitives; convergence precedes Stage 13.

No cycles exist. The graph is a DAG, consistent with `UCOS-IR-0004/0006`.

---

## 4. Exact closure sequence

The sequence is the topological order of §3. Each wave closes fully before the next begins; items **within** a
wave may close in parallel.

| Wave | Closes | Type | Stage (`UCOS-IR-0006`) | Precondition |
|:----:|--------|:----:|:----------------------:|--------------|
| **W1** | **EA-B-P0-1** (chain attestation) · **EA-B-P0-2** (state reproducibility) | Evidentiary | Stage 0 | none (root) |
| **W2** | **EA-B-P1-7** (terminal cert re-issue) | Evidentiary | Stage 0 | W1 (EA-B-P0-1) |
| **W3** | **EA-B-P0-3** (Board lifts `UCOS-CONSTRUCTION-BLOCKED`) | Governance | Stage 0 → gate | W1 + W2 |
| **W4** | **EA-B-P1-1, -2, -3, -4, -8** (universal Audit/Authority/Lifecycle; extensible policy vocab; memory-as-metadata) | Architectural | Stage 6 | W3 |
| **W5** | **EA-B-P1-6** (platform-class catalog) · **EA-B-P1-5** (durable/distributed adapters, scale > 10⁶) | Governance / Operational | Stage 13 | W4 |

> **Critical path:** W1 → W2 → W3 → W4 → W5. The single hard pivot is **W3**: until the Board lifts the block,
> **no architectural or operational closure (W4/W5) may begin**, because every such closure is a build and
> `UCOS-CONSTRUCTION-BLOCKED` forbids builds. W1/W2 are evidentiary and require **no build** — they are the only
> work executable *right now* under the standing block.

### 4.1 Parallelism notes
- **Within W1:** EA-B-P0-1 and EA-B-P0-2 are independent and may run concurrently.
- **Within W4:** the five convergence items share Stage 6 and target distinct fabrics; they may proceed
  concurrently but must all close to clear the wave.
- **Within W5:** catalog (EA-B-P1-6) and scale adapters (EA-B-P1-5) are independent.

---

## 5. Readiness-axis effect of each wave

| Wave completes | Axis moved (`UCOS-IR-0008`) | New axis state |
|:--------------:|-----------------------------|----------------|
| W1 + W2 | Constitutional (READY-conditional → **READY**) | Evidentiary residual discharged |
| W3 | Implementation (construction gate) | Construction **UNBLOCKED** for authorized scope |
| W4 | Architectural (PARTIAL → **READY**) | Primitive convergence complete; 0 duplication debt |
| W5 | Runtime (PARTIAL/NOT-READY(scale) → **READY**) | Durable/distributed + catalog; production scale proven |

> When **W1–W4 are CLOSED**, the **Minimum Constitutional Runtime** is READY on the Constitutional,
> Architectural, and Implementation axes. **W5** is required only to assert **production-scale** Runtime
> readiness; MCR (single-node) correctness readiness is achieved at W4.

---

## 6. Determination (plan-level)

> A **single, cycle-free closure sequence exists**: W1 (evidentiary attestation + reproducibility) → W2
> (terminal-cert re-issue) → W3 (Board lifts the construction block) → W4 (FOUNDATIONAL primitive convergence)
> → W5 (durable/distributed adapters + platform catalog). Every blocker has a binary closure criterion and a
> mitigation of record; **0 REDESIGN** is required. The **only work authorized under the standing block is W1
> and W2** (evidentiary, non-build); all remaining closures are gated on the **W3 Board act**.

> **Scope discipline.** No source code, schema, database, migration, API, service, infrastructure, requirement,
> governance, or authority was produced or modified. `INV-1..13`, `AUTH-012` (v1.0.13), `AD-0014`, and the
> Article IX generation lock are unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands.**

## 7. Traceability

- **Consumes:** `UCOS-EA-0001` (blocker register), `UCOS-IR-0006` (stage sequence & 0-forward-dep validation),
  `UCOS-IR-0004` (DAG), `UCOS-AUTH-0001` (attestation residual).
- **Refined by:** `UCOS-EA-0003` (Authorization Criteria & acceptance tests), `UCOS-EA-0004` (Final
  Determination).
- **Owner:** UCOS Authority Board (disposition).

**END `UCOS-EA-0002` — BLOCKER CLOSURE PLAN · 11 CRITERIA · 5 CLOSURE WAVES (W1→W5) · CRITICAL PIVOT = W3 BOARD ACT · W1/W2 ONLY WORK EXECUTABLE UNDER STANDING BLOCK · 0 FORWARD DEPENDENCIES · 0 REDESIGN · ASSESSMENT ONLY.**
