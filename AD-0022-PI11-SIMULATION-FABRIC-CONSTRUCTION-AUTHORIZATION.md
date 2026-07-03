# UCOS — AD-0022 · Scoped Article IX Release for PI-11 Simulation Fabric (Conditional)

## Authority Board Decision of Record — Narrow Generation-Lock Extension (PI-11 Simulation Fabric)

| Field | Value |
|-------|-------|
| Artifact | **AD-0022 — PI-11 Simulation Fabric Construction Authorization (Conditional)** |
| Artifact ID | `UCOS-AUTH-BOARD-AD-0022` |
| Decision-log entry | AUTH-012 **AD-0022** |
| Version | 1.0.0 |
| Decision body | **UCOS Authority Board** (terminal authority; AUTH-009; Constitution Art. IX / Art. XII) |
| Mode | **AUTHORIZATION ACT ONLY** — extends the AD-0016/0017/0018/0019/0020 releases to the PI-11 simulation fabric; modifies no ratified architecture, ADR, or frozen baseline |
| Inputs (read-only) | `SIM-GOV-001`, `SIM-GOV-002`, `SIM-ARCH-001`, `SIM-SEC-001`, `SIM-FED-001`, `SIM-AUD-001`, `SIM-THREAT-001`, `SIM-READINESS-001` (PHASE 20); `SIM-AUTH-REV-001..004`, `SIM-AUTH-001` (PHASE 20.1); `AD-0016..0020`; AD-0014 (Ω∞ disposition); `UCOS-SEC-ARCH-001` (S1/S3/S4); AUTH-003 (IP-01..17) |
| Effective | 2026-07-01T00:00:00Z |
| **Determination** | **RELEASE LOCK — PI-11 SIMULATION-FABRIC SCOPE ONLY (CONDITIONAL)** |

> Extends AD-0016 (substrate), AD-0017 (control), AD-0018 (federation), AD-0019 (evolution), AD-0020
> (knowledge), all preserved. For every scope beyond §2 the Article IX lock and the AD-0014 Ω∞ disposition
> remain fully in force.

---

## 0. Decision-log continuity note (AD-0021 unassigned)

The on-disk standalone authorization records run **AD-0016..AD-0020**; **AD-0021 is not assigned** (PI-8
Ontology, PI-9 Memory, and PI-10 Intelligence remain **design-only and unauthorized**). This act is recorded
as **AD-0022** per the PHASE 20.1 directive; **AD-0021 is therefore reserved/unassigned** and remains
available for a future PI-8/9/10 authorization act. This note preserves ledger auditability (no phantom
AD-0021 is implied). See `SIM-AUTH-001` §5.

## 1. Basis

PHASE 20 produced the ratifiable `SIM-*` specification set and a readiness determination (**PI-11 READY FOR
AUTHORIZATION REVIEW**) with a threat model (S1–S12) closed at **0 residual High/High**. PHASE 20.1
(`SIM-AUTH-REV-001..004`, `SIM-AUTH-001`) established the decisive facts:

- **Hard dependencies satisfied.** The Simulation Fabric's structural prerequisites (substrate, control/
  policy, evolution, federation) **and** its primary read surface (**Knowledge**, PI-7) are **implemented**.
- **PI-10 is not a prerequisite.** The sole Simulation↔Intelligence coupling is **advisory, verifier-gated,
  off-commit-path** predictive contribution; Ontology (PI-8) and Memory (PI-9) couplings are likewise **soft**
  and fail-closed-degradable.
- **Capabilities validated.** 7/7 mandated capabilities are design-complete; the Sandbox Architecture (the
  non-actuation guarantee) is fully buildable; only advisory enhancements are deferred.

The Simulation Fabric is a governed **what-if / projection** layer that runs bounded, deterministic-by-default
scenarios inside disposable, snapshot-isolated sandboxes, reads governed state via existing fabrics, and routes
all governed change through the ratified Evolution Fabric. It **projects and proposes, never autonomously
acts**. It is **not** an Ω∞ existential/self-directed system (AD-0014 stands); Civilization Simulation is a
bounded, conceptual, non-actuating class (SGP-9).

## 2. Authorized Scope (and only this)

| # | Increment | Authorized target | Realizes |
|:-:|-----------|-------------------|----------|
| S-A | **PI-11** | **New simulation modules** under `src/control/simulation/*` — sandbox manager, digital-twin manager, scenario engine, deterministic state-projection engine, impact analyzer, **predictive adapter interface** (+ deterministic models), constraint evaluator, simulation registry, revocation authority, federation guard, simulation audit (reuse/thin-wrap `FederatedAuditLog`), assembly, index; additive async interfaces in `src/control/simulation/types.ts` | `SIM-GOV-001/002`, `SIM-ARCH-001`, `SIM-SEC-001`, `SIM-FED-001`, `SIM-AUD-001` |
| S-B | **PI-11** | **Tests** under `test/` for sandbox isolation, scenario/projection, impact analysis, policy & knowledge simulation, digital-twin binding, federation, audit, and adversarial S1–S12 | `SIM-THREAT-001` |

**Allowed metadata namespaces:** `simulation:twin:*`, `simulation:scenario:*`, `simulation:model:*`,
`simulation:run:*`, `simulation:projection:*`, `simulation:impact:*`, `simulation:authority:*`,
`simulation:boundary:*`, `simulation:revoked:*`, `simulation:foreign:<nodeId>:*`, and the disposable sandbox
keyspace `simulation:sandbox:<runId>:*` (reserved for the fabric).
**Allowed authorities:** simulation, scenario, decision, revocation, and federated-simulation authorities
(enumerated powers; signed; revocable). **None hold a commit/actuate power.**

**Binding conditions (SIM-COND):**
- **SIM-COND-1 (Zero prohibited-core-dir change).** No modification of `src/meta-core`, `src/registry-runtime`,
  `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts` — **any such change voids this act (§5)**.
- **SIM-COND-2 (Additive only).** All existing implemented tests (**134/134** at PI-7) remain green; public
  seams only (`RegistryPort`, `MetadataPort`, `ConfigurationPort`, `MetaCoreKernel` public API; federation
  `assertions.ts`/`FederatedAuditLog`; the Knowledge and Evolution fabrics); **no custom cryptography**.
- **SIM-COND-3 (Non-actuation / sandbox).** All run writes confined to `simulation:sandbox:<runId>:*` behind a
  static keyspace write-guard; **all governed mutation routes through the Evolution Fabric**; deny-by-default;
  fail-closed; the fabric introduces no independent write/rollback path.
- **SIM-COND-4 (Determinism).** Only deterministic projection is commit-eligible; non-deterministic
  contributions remain **advisory and deterministic-verifier-gated** (SGP-3/INV-6).
- **SIM-COND-5 (S1/S3/S4).** Non-waivable controls preserved; secrets/keys/model-weights **by reference only**;
  classification inheritance enforced on projection/impact outputs.
- **SIM-COND-6 (No Ω∞).** Civilization Simulation bounded/conceptual (SGP-9); AD-0014 preserved; **no
  existential invariant (INV-14..20) enrolled or required**.
- **SIM-COND-7 (Approval-required acts).** Registering an authority, binding a twin to a target, authorizing a
  scenario, admitting a federated simulation authority, and any promotion remain **Approval-Required
  Operations** (AD-0009) requiring explicit human/Board approval at execution time.

**Forward-dependency gates (DEFERRED — each requires a separate authorization + adversarial tests before binding):**
- **FDG-INT (PI-10 Intelligence).** Binding an Intelligence-backed **non-deterministic** predictive model to
  the Predictive Model Registry (C5) is **deferred** until PI-10 is implemented and ratified; until then C5
  accepts **deterministic models only**. The adapter *interface* may be built now.
- **FDG-MEM (PI-9 Memory).** `memory:*` read enrichment is **deferred** until PI-9 is implemented; baselines
  use the pinned snapshot + Knowledge Fabric.
- **FDG-ONT (PI-8 Ontology).** `ontology:*`-typed semantic validation is **deferred** until PI-8 is
  implemented; scenarios/twins validate against declared Constraint Sets + Knowledge. A constraint referencing
  an absent `ontology:*` surface is **rejected (deny)**, never skipped.

## 3. Prohibited Scope (remains LOCKED)

- ❌ Modification of `src/meta-core/*`, `src/registry-runtime/*`, `src/metadata-runtime/*`,
  `src/configuration-runtime/*`, `src/contracts/*` — **any such change voids this act** (§5)
- ❌ Modification of `src/control/federation/*`, `src/control/evolution/*`, or `src/control/knowledge/*`
  behavior (reuse only)
- ❌ Binding any Intelligence-backed non-deterministic model (FDG-INT), Memory read (FDG-MEM), or Ontology
  semantic validation (FDG-ONT) ahead of the respective PI implementation + its own authorization
- ❌ Any independent commit/rollback path bypassing the Evolution Fabric
- ❌ Custom cryptography (must reuse `src/control/federation/assertions.ts`)
- ❌ Simulation-authority escalation (no implicit powers; SoD non-waivable; no commit power)
- ❌ Any domain/bounded-context/business logic
- ❌ Any Ω∞ existential / self-directed simulation scope — AD-0014 stands
- ❌ Production deployment / live infrastructure provisioning
- ❌ Mutation of frozen artifacts or enrollment of any existential invariant (INV-14..20 deferred)

## 4. Binding Controls

`IC-1..IC-8` remain binding. Non-waivable **S1/S3/S4** preserved. Concrete simulation acts — registering an
authority, binding a twin to a target, authorizing a scenario, admitting a federated simulation authority,
and any promotion of a projection/impact analysis to a governed change — remain **Approval-Required
Operations** (AD-0009) requiring explicit human/Board approval at execution time.

## 5. Revocation

`UCOS-ART9-REL-001` §6 applies. Any construction outside §2 — including **any** core-dir modification, any
change to federation/evolution/knowledge behavior, any premature binding across a forward-dependency gate
(FDG-INT/MEM/ONT), any independent commit path, custom cryptography, authority escalation, any domain/business
logic, or any Ω∞ scope — voids this act and re-imposes the full lock.

## 6. Determination

> ## RELEASE LOCK — PI-11 SIMULATION-FABRIC SCOPE ONLY (CONDITIONAL)
>
> The Authority Board authorizes construction of the PI-11 Simulation Fabric — new `src/control/simulation/*`
> modules and tests realizing `SIM-GOV-001/002`, `SIM-ARCH-001`, `SIM-SEC-001`, `SIM-FED-001`, `SIM-AUD-001`
> — built additively on the AD-0016..0020 fabrics with **no modification of any substrate core dir**, no
> change to federation/evolution/knowledge behavior, no custom cryptography, no authority escalation, no
> independent commit path, no domain/business logic, and **no Ω∞ scope**. The Intelligence (PI-10), Memory
> (PI-9), and Ontology (PI-8) couplings are **deferred** behind forward-dependency gates FDG-INT/MEM/ONT.
> **PI-10 is NOT a prerequisite.** All other generation remains LOCKED.

**Answers to the PHASE 20.1 decision questions:**
- **Can PI-11 be authorized?** **YES — conditionally (scoped).**
- **Must PI-10 be implemented first?** **NO.**
- **Can Simulation construction proceed conditionally?** **YES** — under §2 scope, SIM-COND-1..7, and
  FDG-INT/MEM/ONT.

## Traceability
- **Refines:** `SIM-GOV-001/002`, `SIM-ARCH-001`, `SIM-SEC-001`, `SIM-FED-001`, `SIM-AUD-001`,
  `SIM-THREAT-001`, `SIM-READINESS-001`, `SIM-AUTH-REV-001..004`, `SIM-AUTH-001`,
  `UCOS-AUTH-BOARD-AD-0016/0017/0018/0019/0020`, `UCOS-ART9-REL-001`, `UCOS-SEC-ARCH-001`, AD-0014,
  AUTH-003 (IP-01..17), `UCOS-CONST-001` (Art. IX/XII), `AUTH-008/009/012`.
- **Refined by:** the PI-11 simulation fabric under `packages/platform-runtime/src/control/simulation/`.
- **Owner:** UCOS Authority Board.

**END AD-0022 — RELEASE LOCK · PI-11 SIMULATION-FABRIC SCOPE ONLY (CONDITIONAL) · EFFECTIVE 2026-07-01 · CONSTRUCTION AUTHORIZED (SCOPED).**
