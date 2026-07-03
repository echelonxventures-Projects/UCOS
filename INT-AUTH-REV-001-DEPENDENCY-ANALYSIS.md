# INT-AUTH-REV-001 — PI-10 Intelligence Fabric Authorization Review · Dependency Analysis

| Field | Value |
|-------|-------|
| Artifact | **INT-AUTH-REV-001 — Intelligence Dependency Analysis** |
| Phase | PHASE 19.1 (PI-10 Intelligence Fabric Authorization Review) |
| Version | 1.0.0 |
| Mode | INDEPENDENT REVIEW ONLY — audit/validate/challenge; no design, no code, no authorization |
| Inputs (read-only) | `INT-GOV-001/002`, `INT-ARCH-001`, `INT-SEC-001`, `INT-FED-001`, `INT-AUD-001`, `INT-THREAT-001`, `INT-READINESS-001` (PHASE 19); `ONTO-*` (PI-8, PHASE 17); `MEM-*` (PI-9, PHASE 18); `AD-0016..0020`; `AD-0014` |
| Owner | UCOS Authority Board (review authority) |

> Determines the four mandated dependency axes for the Intelligence Fabric and classifies each as **SATISFIED**
> (predecessor authorized + implemented), **DESIGN-ONLY** (predecessor specified but not authorized/implemented),
> or **UNDER-SPECIFIED** (the Intelligence design does not yet formally bind the predecessor). Findings are the
> primary input to the authorization determination (`INT-AUTH-REV-004`).

---

## 1. Predecessor state of record (verified)

| PI | Fabric | Design | Authorization act | Implemented (`src/control/*`) | Tests |
|:--:|--------|:------:|:-----------------:|:-----------------------------:|:-----:|
| PI-2/3 | Substrate | ✅ | **AD-0016** | ✅ `meta-core`, `registry/metadata/configuration-runtime` | in 185 |
| PI-4 | Control (PEP/policy/identity/trust/gov/audit) | ✅ | **AD-0017** | ✅ `control/{governance,identity,policy,trust}`, `control-plane.ts`, `audit-log.ts` | in 185 |
| PI-5 | Federation | ✅ | **AD-0018** | ✅ `control/federation/*` | in 185 |
| PI-6 | Evolution | ✅ | **AD-0019** | ✅ `control/evolution/*` | in 185 |
| PI-7 | Knowledge | ✅ | **AD-0020** | ✅ `control/knowledge/*` | **185/185** |
| **PI-8** | **Ontology** (`ONTO-*`) | ✅ READY FOR RATIFICATION | ❌ **no AD-0021**; `ONTO-AUTH-REV-001/002` present, **no `ONTO-AUTH-001`** | ❌ **no `control/ontology/`** | — |
| **PI-9** | **Memory** (`MEM-*`) | ✅ `MEM-READINESS-001` = READY FOR AUTHORIZATION REVIEW | ❌ **no AD-0022**; no memory authorization review complete | ❌ **no `control/memory/`** | — |
| **PI-10** | **Intelligence** (`INT-*`) | ✅ `INT-READINESS-001` (this workstream) | ❌ (this review) | ❌ **no `control/intelligence/`** | — |

**Key fact:** PI-8 Ontology and PI-9 Memory are **design-ratifiable but NOT authorized and NOT implemented**.
Only PI-2..PI-7 are implemented (185/185 tests green).

## 2. Dependency Axis A — Intelligence ↔ Ontology (PI-8)

- **Nature.** Reasoning and Inference require **semantic grounding**: the meaning of goals, evidence,
  constraints, and conclusions is defined by the Ontology graph (`ONTO-ARCH-001` entities/relationships/
  taxonomy/semantic constraints). Constraint solving over typed concepts and inference validity checks are
  ontology-relative.
- **Current binding in the INT design.** `INT-ARCH-001`/`INT-GOV-001` reference knowledge/memory reads and the
  PI-4 policy engine but **do not formally bind `ONTO-*`**. Reasoning is specified against "evidence" without
  an explicit ontology-grounding contract.
- **Classification:** **DESIGN-ONLY predecessor + UNDER-SPECIFIED binding.**
- **Findings:** **F-1** (ontology unimplemented/unauthorized), **F-2** (INT design does not consume `ONTO-*`
  for semantic grounding).

## 3. Dependency Axis B — Intelligence ↔ Memory (PI-9)

- **Nature.** "Memory Utilization" (working/episodic/semantic recall) is a first-class Intelligence input
  (`INT-ARCH-001` §3; objective element). The canonical memory layer is the **PI-9 Memory Fabric** (`MEM-*`;
  6 tiers, 12 constructs, governed retention/reconciliation/forgetting, semantic memory co-ratified with
  Knowledge).
- **Current binding in the INT design.** `INT-GOV-001 §2.12` defines an **internal `Memory Scope` construct**
  and `INT-ARCH-001 §3` an internal memory store — i.e., the Intelligence design defines *its own* memory model
  rather than consuming the ratified PI-9 Memory Fabric. This is a **competing-source-of-truth** risk (violates
  single-SoR discipline) and duplicates governed retention/forgetting already owned by `MEM-GOV-002`.
- **Classification:** **DESIGN-ONLY predecessor + UNDER-SPECIFIED (in fact CONFLICTING) binding.**
- **Findings:** **F-3** (memory unimplemented/unauthorized), **F-4** (INT defines an independent Memory Scope
  that must be reconciled to consume `MEM-*` — remove/redefine `INT-GOV-C12` as a *view over* the Memory
  Fabric, not a store).

## 4. Dependency Axis C — Intelligence ↔ Knowledge (PI-7)

- **Nature.** Evidence for reasoning is read from the Knowledge Fabric (governed query/resolve, S4-classified).
- **Current binding.** `INT-ARCH-001` §3/§6 and `IGP-8` bind knowledge-utilization to the PI-7 Knowledge Fabric
  as **read-only**; governed knowledge mutation routes through Evolution (no back door). This is consistent with
  `AD-0020`.
- **Classification:** **SATISFIED** (predecessor authorized + implemented; binding correct).
- **Findings:** none (aligns with `KNOW-*`). Minor: ensure semantic memory ↔ knowledge co-ratification
  (`MEM-GOV-001 §2.4`) is honored once Memory lands.

## 5. Dependency Axis D — Intelligence ↔ Evolution (PI-6)

- **Nature.** The **sole** governed commit path for any decision/memory-of-record/model change is an Evolution
  Unit through the PI-6 Evolution Fabric.
- **Current binding.** `INT-GOV-002 §3` (pipeline) and `IGP-3/IGP-8` route all commits through Evolution; the
  Decision Engine holds no independent write path. Consistent with `AD-0019` (Evolution Governor, maxInFlight=1).
- **Classification:** **SATISFIED** (predecessor authorized + implemented; binding correct).
- **Findings:** none.

## 6. Dependency Summary

| Axis | Predecessor status | INT binding | Classification | Blocking findings |
|------|--------------------|-------------|:--------------:|-------------------|
| A Ontology (PI-8) | DESIGN-ONLY (no AD-0021, unimplemented) | not bound | **BLOCKED** | F-1, F-2 |
| B Memory (PI-9) | DESIGN-ONLY (no AD-0022, unimplemented) | internal store (conflict) | **BLOCKED** | F-3, F-4 |
| C Knowledge (PI-7) | SATISFIED (AD-0020, impl) | correct (read-only) | **OK** | — |
| D Evolution (PI-6) | SATISFIED (AD-0019, impl) | correct (sole commit) | **OK** | — |

**Two of four dependency axes are BLOCKED** on unimplemented, unauthorized predecessor fabrics (Ontology,
Memory), and both are additionally **under-specified/conflicting** in the current Intelligence design.

## 7. Traceability
- **Refines:** `INT-*` (PHASE 19), `ONTO-*` (PI-8), `MEM-*` (PI-9), `AD-0016..0020`, `AD-0014`.
- **Consumed by:** `INT-AUTH-REV-002/003/004`, `INT-AUTH-001`.
- **Owner:** UCOS Authority Board.

**END INT-AUTH-REV-001 — DEPENDENCY ANALYSIS · 2 OF 4 AXES BLOCKED (ONTOLOGY, MEMORY).**
