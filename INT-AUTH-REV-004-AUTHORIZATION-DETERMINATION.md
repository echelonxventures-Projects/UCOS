# INT-AUTH-REV-004 — PI-10 Intelligence Fabric Authorization Review · Authorization Determination

| Field | Value |
|-------|-------|
| Artifact | **INT-AUTH-REV-004 — Intelligence Authorization Determination** |
| Phase | PHASE 19.1 (PI-10 Intelligence Fabric Authorization Review) |
| Version | 1.0.0 |
| Mode | INDEPENDENT REVIEW ONLY — determine authorizability, prerequisites, and sequencing; recommend, do not authorize |
| Inputs (read-only) | `INT-AUTH-REV-001` (deps), `INT-AUTH-REV-002` (threats), `INT-AUTH-REV-003` (capabilities); `INT-*`; `ONTO-*`, `MEM-*`; `AD-0016..0020`; `AD-0014`; `UCOS-UEA-0013` §5 (sequencing rules); `UCOS-CONSTRUCTION-BLOCKED` |
| Owner | UCOS Authority Board |

> Synthesizes the three preceding reviews into an authorizability determination and answers the three questions
> posed by the objective: **Can PI-10 be authorized? · What prerequisites must exist? · Can any construction
> begin before PI-9 implementation?**

---

## 1. Evidence synthesis

| Review | Result |
|--------|--------|
| `INT-AUTH-REV-001` Dependencies | Knowledge (PI-7) ✅ + Evolution (PI-6) ✅ SATISFIED; **Ontology (PI-8) BLOCKED** (unimplemented, no AD-0021, not bound by INT); **Memory (PI-9) BLOCKED** (unimplemented, no AD-0022, INT defines a *competing* internal store) |
| `INT-AUTH-REV-002` Threats | Design-level **0 residual High/High** confirmed; **I2, I3 operationally conditional** on PI-8/PI-9; I4 (Ω∞ escape) structurally closed |
| `INT-AUTH-REV-003` Capabilities | 8/8 design-complete; only **Policy Evaluation + Constraint Solving** fully constructible now; **Reasoning/Inference/Planning/Decision-rationale/Goal-semantics BLOCKED** on PI-8/PI-9 |

## 2. Q1 — Can PI-10 be authorized (now)?

**NO — not for construction.** The Intelligence design is *ratifiable* (`INT-READINESS-001`: 10/10), but PI-10
**construction cannot be authorized today** because:
1. Two of four dependency axes (Ontology, Memory) are **unimplemented and unauthorized** — a PI-10 build would
   have **dangling upward dependencies**, violating the program's additive / dependency-gated / "no fabric on a
   non-existent substrate" discipline (mirrors AD-0018/0019/0020, each built on *implemented* predecessors with
   all tests green; and `UCOS-UEA-0013` §5 "dependency-gated" / "lock-gated").
2. The Intelligence design has **two binding defects** vs. the ratified predecessors: it does not consume the
   PI-8 Ontology fabric for semantic grounding (F-2), and it defines a **competing** internal Memory Scope
   instead of consuming the PI-9 Memory fabric (F-4) — a single-source-of-truth violation that must be
   corrected *before* authorization.
3. Full operational threat closure (I2, I3) is not achievable until PI-8/PI-9 exist.

**Design ratification** of the `INT-*` set (accepting the specifications as the target) *may* proceed; a
**construction authorization act (a prospective AD-0023)** may **not**.

## 3. Q2 — Prerequisites that must exist before PI-10 construction authorization

| # | Prerequisite | Owner | Status |
|:-:|--------------|-------|:------:|
| **P-1** | **PI-8 Ontology authorized + implemented + validated** — complete `ONTO-AUTH-001`, Board issues **AD-0021**, build `src/control/ontology/*`, tests green | Authority Board / impl | ❌ OPEN (design-only; `ONTO-AUTH-REV-001/002` done, no `ONTO-AUTH-001`/AD-0021) |
| **P-2** | **PI-9 Memory authorized + implemented + validated** — complete Memory authorization review, Board issues **AD-0022**, build `src/control/memory/*`, tests green | Authority Board / impl | ❌ OPEN (`MEM-READINESS-001` = READY FOR AUTH REVIEW; no AD-0022) |
| **P-3** | **INT design revision (binding fixes)** — `INT-ARCH-001`/`INT-GOV-001` revised to (a) consume `ONTO-*` for semantic grounding of Reasoning/Inference/Goal/Constraint; (b) redefine `INT-GOV-C12` Memory Scope as a **view over the PI-9 Memory Fabric** (remove competing store); knowledge/evolution bindings already correct | Intelligence design | ❌ OPEN (F-2, F-4) |
| **P-4** | **Re-run PI-10 authorization review** after P-1..P-3, confirming all four axes SATISFIED and I2/I3 operationally closed; then Board issues **AD-0023** scoped to `src/control/intelligence/*` | Authority Board | ❌ OPEN |
| **P-5** | **Standing invariants preserved** — S1/S3/S4 non-waivable; deny-by-default; propose-not-act; Evolution-only commit; no custom crypto; AD-0014 Ω∞ boundary; INV-1..13; Article IX | Authority Board | ✅ carried (design honors all) |

## 4. Q3 — Can any construction begin before PI-9 implementation?

**NO (recommended).** Two layers of answer:

- **Cognition core (Reasoning, semantic Inference, typed/stateful Planning, rationale-complete Decision, goal
  semantics, Memory Utilization):** **cannot** begin before PI-9 (Memory) — and PI-8 (Ontology) —
  implementation; they consume those fabrics directly (`INT-AUTH-REV-003`). Even if PI-8 alone were implemented,
  the memory-dependent parts still require PI-9. So **no cognition-core construction before PI-9 implementation.**
- **Ontology/Memory-independent subset (Policy Evaluation binding to PI-4, Constraint-solver core, Decision
  pipeline *scaffolding* to PI-6 Evolution, Federated advisory *guard* to PI-5, governance/authority records):**
  *technically* constructible now on the implemented PI-2..7 stack. **However, the review recommends against
  starting it**, because: (a) it would create an Intelligence fabric with **dangling dependencies** on
  unimplemented PI-8/PI-9 (violating the additive-only invariant honored by every prior AD act); (b) it risks
  entrenching the F-4 competing-memory defect before the P-3 revision; and (c) it provides no usable capability
  in isolation (a decision pipeline with no grounded reasoning to feed it). The disciplined path is **strict
  dependency order: PI-8 → PI-9 → (revise INT) → PI-10.**

> **If** the Authority Board explicitly elects staged construction, the *only* defensible early scope would be a
> narrowly-bounded, clearly-labelled **"intelligence-governance-scaffolding"** increment (records + policy
> binding + constraint-solver core + audit), authorized under its own AD act, with a hard prohibition on
> building any Reasoning/Inference/Memory-Utilization path until PI-8/PI-9 are implemented. This review does not
> recommend that path; it recommends **defer**.

## 5. Determination

> **PI-10 CONSTRUCTION AUTHORIZATION: DEFERRED (NOT YET AUTHORIZABLE).** The Intelligence design is
> **ratifiable** and the threat posture is **design-sound (0 residual High/High)**, but PI-10 sits atop the
> **unimplemented Ontology (PI-8) and Memory (PI-9)** fabrics and carries two binding defects (F-2 ontology not
> consumed; F-4 competing memory store). Authorization is **conditional on P-1..P-4**. Recommended sequencing:
> **PI-8 (Ontology) → PI-9 (Memory) → revise INT-* (P-3) → re-review → AD-0023 (PI-10)**. No construction —
> including any Ontology/Memory-independent subset — should begin before PI-9 implementation. The Constitution
> **Article IX generation lock REMAINS ACTIVE**; `UCOS-CONSTRUCTION-BLOCKED` is unchanged; **AD-0014** stands.

## 6. Traceability
- **Refines:** `INT-AUTH-REV-001/002/003`, `INT-*`, `ONTO-*`, `MEM-*`, `AD-0016..0020`, `AD-0014`,
  `UCOS-UEA-0013` §5, `UCOS-CONSTRUCTION-BLOCKED`, AUTH-009/012, Constitution Art. IX/XII.
- **Consumed by:** `INT-AUTH-001` (consolidated recommendation); a prospective Authority Board PI-10 act.
- **Owner:** UCOS Authority Board.

**END INT-AUTH-REV-004 — AUTHORIZATION DEFERRED · PREREQUISITES P-1..P-4 · NO CONSTRUCTION BEFORE PI-9 IMPLEMENTATION.**
