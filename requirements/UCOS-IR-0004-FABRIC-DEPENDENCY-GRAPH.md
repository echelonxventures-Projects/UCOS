# UCOS-IR-0004 — Fabric Dependency Graph

**Artifact ID:** `UCOS-IR-0004`
**Program:** UCOS Phase 1 — Implementation Readiness Assessment
**Phase:** IR-4 — Dependency Graph
**Mode:** ASSESSMENT ONLY — no code, schema, architecture, or governance produced. Constructs the realization dependency graph over the fabric set of `UCOS-IR-0002/0003`, records Requires / Enables / Blocks for each fabric, and detects cycles, contradictions, and missing dependencies.
**Status:** ASSESSMENT BASELINE (v1.0.0)
**Inputs (read-only):** `UCOS-IR-0002/0003`, `UCOS-REQ-0001..0006`, `UCOS-AUDIT-0001..0004`, `UCOS-AUTH-0001`.
**Date:** 2026-07-03

---

## 1. Method & notation

For each fabric the graph records:

- **Requires** — fabrics that must exist first (inbound dependency).
- **Enables** — fabrics/capabilities this fabric makes possible (outbound).
- **Blocks** — higher fabrics that cannot be realized until this fabric's caveat is closed.

Edges are derived from the constitution's invariants: contract-first (INV-1), single-SoR (INV-5), event-driven
propagation (INV-6), append-only Evolution-only commit (INV-10), deny-by-default (INV-3), and the reflexive
Meta-Core (RC-045). A **cycle** is any set of fabrics whose Requires edges form a loop; a **contradiction** is a
dependency that violates an invariant; a **missing dependency** is a Requires edge whose target is
MISSING/DEFERRED for a fabric expected to be realizable now.

---

## 2. Dependency table

| Fabric | Requires | Enables | Blocks (until caveat closed) |
|--------|----------|---------|------------------------------|
| FAB-REG Registry | — (genesis) | all addressing/discovery | — |
| FAB-META Metadata | REG | typing/description/config | — |
| FAB-CFG Configuration | REG, META | zero-hardcoding behavior | — |
| FAB-EXEC Meta-Core/Execution | REG, META, CFG | all operations; reflexive kernel | — |
| FAB-EVT Event | REG, META, EXEC | INV-6 propagation; observation | — |
| FAB-IDENT Identity | REG, META | principals; authz subject | — |
| FAB-TRUST Trust | IDENT, META | trust-clamped operations | — |
| FAB-POL Policy | IDENT, TRUST, META, CFG | deny-by-default authz eval | logic/alignment (bounded vocab, GAP-M3) |
| FAB-AUTH Authority | REG, META, EVO*(bootstrap)* | authorized decisions | all governed change (dup/attestation) |
| FAB-AUDIT Audit/Provenance | REG, EVT, EVO*(bootstrap)* | verifiable fail-closed record | century-continuity; unified provenance (6× dup) |
| FAB-STATE State/Lifecycle | REG, META, EVO | version/history/projection | universal lifecycle (4× engines) |
| FAB-EVO Evolution | REG, META, AUTH*(bootstrap)*, AUDIT | sole commit path; all durable mutation | every durable capability |
| FAB-GOV Governance | AUTH, POL, AUDIT, EVO | Approval-By-Exception; gates | layer certification (chain attestation) |
| FAB-SEC Security | IDENT, TRUST, POL | S1/S3/S4/S6 on exposed boundary | any exposed runtime |
| FAB-FED Federation | IDENT, TRUST, AUTH, EVT, AUDIT | multi-instance composition; continuity | multi-frame temporal (RC-054) |
| FAB-KNOW Knowledge | EVO, REG, META, GOV | governed knowledge records | intelligence (needs knowledge) |
| FAB-ONTO Ontology | REG, META, EVO, GOV | typing substrate; entity model | semantic typing consumption; reality context |
| FAB-MEM Memory | EVO, REG, META, GOV, AUDIT | tiered memory | intelligence (needs memory) |
| FAB-OPS Ops/Platform-Eng | EXEC, EVT, all substrate | production operability; scale | scale beyond ~10⁶ (single-node) |
| FAB-TIME Temporal | STATE, EVO, FED, ONTO | first-class time; frames; continuity | relativistic/civilization temporal correctness |
| FAB-PFC Platform-Factory Catalog | EXEC, REG, (ECON for exchanges) | platform-class instantiation | — |
| FAB-INTEL Intelligence | KNOW, MEM, ONTO, POL, GOV, EVO, **Non-Actuation enrolled** | governed cognition | (leaf) |
| FAB-SIM Simulation | ONTO, STATE, EVO, GOV | projection/what-if/digital-twin | RC-027 future projection; RC-056 alt-reality |
| FAB-ECON Economic | EVO, REG, META, GOV, AUDIT | value/marketplace/settlement | exchange platform classes (PFC) |
| FAB-CIV Civilization | ONTO, FED, GOV, SIM*(twin)*, **AD-0014 disposition** | civilization objects | (leaf) |

`*(bootstrap)*` denotes a genesis-ordering edge resolved by seeding (see §3).

---

## 3. Cycle detection

Three dependency loops appear at the governance core. All are **bootstrap cycles**, resolved by genesis seeding
under append-only rules — **none is a true circular blocker**.

| Cycle | Loop | Nature | Resolution of record |
|-------|------|--------|----------------------|
| **CYC-1** Authority ↔ Evolution | AUTH requires EVO to persist decisions; EVO requires AUTH to authorize commits | Bootstrap | **Genesis authority record**: the founding `AUTH-012` entry (AD-0001) is seeded append-only as the axiomatic root; thereafter AUTH commits via EVO and EVO is authorized by AUTH. Consistent with INV-10 append-only and the reconciled chain (`UCOS-AUTH-0001`, AD-0001..0023). |
| **CYC-2** Governance ↔ Evolution | GOV requires EVO (to record gate outcomes); EVO requires GOV (to admit change) | Bootstrap | Same genesis seeding: the governance baseline (`UCOS-GOVERNANCE-BASELINE-1.0`) is a ratified root artifact; gate machinery then routes through EVO. |
| **CYC-3** Audit ↔ Evolution | AUDIT requires EVO to persist; EVO requires AUDIT to be verifiable | Bootstrap | Audit log is append-only hash-chained from a genesis checkpoint; the first audit entry records its own genesis. INV-10 makes the chain self-anchoring. |

> **Determination on cycles:** **0 true cycles.** CYC-1/2/3 are the classic self-referential-bootstrap of a
> self-governing (reflexive Meta-Core, RC-045) system. Each is resolved by an axiomatic genesis record under
> append-only rules; this is exactly the mechanism the reconciled authority chain relies on (`UCOS-AUTH-0001`).
> The graph is therefore a **DAG once genesis roots are fixed**.

---

## 4. Contradiction detection

| ID | Candidate contradiction | Invariants in tension | Status |
|----|-------------------------|-----------------------|--------|
| CON-1 | Any-reality neutrality vs single-SoR | INV-17 (proposed) ↔ INV-5 | **RESOLVED** — Reality-Scoped Single-SoR (`EXIST-001` R-17): single-SoR per (domain, reality); no cross-reality shared mutable state. Enrollment reserved to Board. |
| CON-2 | Any-computation/relativistic time vs event-driven propagation & determinism | INV-18 (proposed) ↔ INV-6 / EX1 | **RESOLVED** — Computation-Realizer Contract (`EXIST-001` R-18): INV-6-conformant propagation adapter + determinism-quarantine verifier. INV-6/EX1 prevail. |
| CON-3 | Multi-reference-frame vs single global frame | RC-054 ↔ INV-5 | **RESOLVED (by design)** — frame-as-federation-locality; single-SoR per (domain, frame) (`UCOS-REQ-0005` §5). |
| CON-4 | Autonomous cognition vs deny-by-default/no-actuation | FAB-INTEL ↔ INV-3 / INV-CORE-12 | **RESOLVED (by requirement)** — UR-ALIGN-05: propose-not-act, verifier-gated, Non-Actuation enrolled before authorization (`UCOS-REQ-0006`). |

> **Determination on contradictions:** **0 unresolved contradictions.** The four candidate tensions are all
> discharged additively (the ratified invariant prevails in every case; the existential/behavioral requirement
> is re-expressed as a conformant specialization). This matches `UCOS-INV-0001` (0 unresolved conflicts) and
> `ULT-TEST-001` (0 REDESIGN).

---

## 5. Missing-dependency detection

A **missing dependency** is a Requires edge whose target is not realizable when the dependent fabric is expected
now. Because all FOUNDATIONAL+CORE fabrics EXIST (`UCOS-IR-0003`), **no realized fabric has a missing
dependency**. Missing/deferred targets appear only on the frontier:

| Dependent fabric | Requires (unrealized target) | Effect | Kind |
|------------------|------------------------------|--------|------|
| FAB-INTEL Intelligence | Non-Actuation invariant (INV-CORE-12) *enrolled* | Cannot be authorized until enrolled | Enactment dependency (not missing fabric) |
| FAB-TIME Temporal | Temporal realization (self) | Stated-of-record; realization is future scoped release | Deferred-realization |
| FAB-CIV Civilization | `AD-0014` disposition | Governed deferral | Enactment dependency |
| FAB-PFC Platform-Factory | FAB-ECON (for exchange classes) | Exchange platform classes wait on Economic | Deferred-realization chain |
| FAB-FED (multi-frame) | FAB-TIME | Multi-reference-frame temporal correctness waits on Temporal | Deferred-realization chain |

> **Determination on missing dependencies:** **0 missing dependencies among realized fabrics.** All unrealized
> targets are either **enactment dependencies** (a Board enrollment act, not a build) or **deferred-realization
> chains** on the behavioral/temporal frontier. No fabric that is expected to exist now is blocked by an absent
> prerequisite.

---

## 6. Realization frontier (topological view)

```
GENESIS ROOTS (seeded, append-only)
  AUTH-012 genesis · governance baseline · audit genesis checkpoint
        │
Tier 0  REG → META → CFG → EXEC → EVT                (substrate; EXISTS)
        │
Tier 1  IDENT → TRUST → POL ; SEC                    (control; EXISTS)
        │
Tier 2  AUTH ↔ EVO ↔ AUDIT ↔ GOV ↔ STATE            (governance core; EXISTS, PARTIAL caveats)
        │        (CYC-1/2/3 resolved by genesis)
        │
Tier 3  FED ; KNOW ; ONTO ; MEM ; OPS                (core primitives + ops; EXISTS)
        │
Tier 4  [convergence: Universal Authority/Audit/Lifecycle; policy vocab]   (OPTIONAL; debt)
        │
Tier 5  TIME (temporal realization)                  (DEFERRED; stated)
        │
Tier 6  INTEL (needs Non-Actuation enrolled) ; SIM   (DEFERRED)
        │
Tier 7  ECON ; CIV (needs AD-0014) ; PFC             (DEFERRED)
```

Each tier depends only on tiers at or below it once genesis roots are fixed. **No edge points upward** (no fabric
depends on a higher tier), confirming the graph is realizable in ascending tier order — the basis for the
sequencing in `UCOS-IR-0006`.

---

## 7. Determination

> **The fabric dependency graph is a well-formed DAG with 0 true cycles, 0 unresolved contradictions, and 0
> missing dependencies among realized fabrics.** The three governance-core loops (Authority/Governance/Audit ↔
> Evolution) are self-referential bootstraps resolved by axiomatic genesis seeding under append-only rules — the
> same mechanism the reconciled `AUTH-012` chain uses. The four candidate invariant contradictions
> (reality/computation/frames/cognition) are all **RESOLVED** as additive specializations with the ratified
> invariant prevailing.

The graph confirms the realization order: **substrate → control → governance-core → core primitives →
[convergence] → temporal → behavioral**. The only upward-propagating risks are the **PARTIAL caveats on the
governance-core fabrics** (Authority/Audit/State duplication + policy vocabulary + chain attestation), which sit
on the critical path for every higher fabric and are therefore carried as high-priority items in `UCOS-IR-0007`.

> **Scope discipline.** No code, schema, architecture, or governance was produced. `INV-1..13`, `AUTH-012`,
> `AD-0014`, and the Article IX generation lock are unchanged.

## 8. Traceability

- **Refines:** `UCOS-IR-0002/0003`.
- **Evidence:** `UCOS-INV-0001` (INV-17/18 resolution; 0 unresolved conflicts), `EXIST-001` (R-17/R-18 CRC), `UCOS-AUTH-0001` (genesis/append-only chain), `UCOS-REQ-0005/0006` (frame/alignment resolutions), `ULT-TEST-001` (0 REDESIGN).
- **Refined by:** `UCOS-IR-0005` (Minimum Runtime), `UCOS-IR-0006` (Sequencing).
- **Owner:** UCOS Authority Board.

**END `UCOS-IR-0004` — FABRIC DEPENDENCY GRAPH · DAG · 0 TRUE CYCLES (3 BOOTSTRAP RESOLVED) · 0 UNRESOLVED CONTRADICTIONS · 0 MISSING DEPENDENCIES AMONG REALIZED FABRICS · ASSESSMENT ONLY.**
