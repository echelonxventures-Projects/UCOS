# UCOS-IR-0003 — Foundational Fabric Specification

**Artifact ID:** `UCOS-IR-0003`
**Program:** UCOS Phase 1 — Implementation Readiness Assessment
**Phase:** IR-3 — Foundational Fabric Analysis
**Mode:** ASSESSMENT ONLY — no code, schema, architecture, or governance produced. Determines the minimum set of fabrics that must exist before any higher-order capability can exist, and classifies every fabric FOUNDATIONAL / CORE / OPTIONAL / DEFERRED.
**Status:** ASSESSMENT BASELINE (v1.0.0)
**Inputs (read-only):** `UCOS-IR-0001/0002`, `UCOS-REQ-0001..0006`, `UCOS-AUDIT-0001..0004`, corpus fabric specs.
**Date:** 2026-07-03

---

## 1. Classification scheme

- **FOUNDATIONAL** — must exist before *any* higher-order capability can exist; realizes an invariant-bearing
  substrate/control/governance primitive on which all other fabrics depend. Removing it collapses the
  constitution (fail-closed impossible, no commit path, no identity, no authority, no record).
- **CORE** — required for the constitution to be *complete of record* (a ratified nine-primitive fabric or a
  first-class governed data fabric), but depends on the FOUNDATIONAL set and does not itself gate the existence
  of the substrate.
- **OPTIONAL** — strengthens or convenes existing capability (e.g., primitive-convergence unification,
  platform-factory catalog) but is not required for constitutional existence; its absence is debt, not a
  missing foundation.
- **DEFERRED** — a governed future fabric (behavioral / existential / economic / civilization / temporal
  realization) explicitly deferred (`AD-0014`) or gated behind a scoped Article IX release; not part of the
  minimum constitutional system.

**Foundational test (applied to each fabric):** *Can any other fabric be brought up, and can any governed
mutation be committed with a fail-closed guarantee, if this fabric is absent?* If **no**, the fabric is
FOUNDATIONAL.

---

## 2. Minimum foundational set (the "existence floor")

The following fabrics must **all** exist before a single governed record can be created, authorized, committed,
and audited. They are mutually load-bearing and constitute the existence floor.

| Fabric | Primitive | Why FOUNDATIONAL (existence dependency) | Realized? |
|--------|-----------|-----------------------------------------|:---------:|
| **FAB-REG** Registry | Registry | Nothing is addressable/discoverable without it; every construct is a registry record | EXISTS |
| **FAB-META** Metadata | Metadata | No construct can be described/typed/configured; behavior is metadata-driven (IP-04) | EXISTS |
| **FAB-CFG** Configuration | Configuration | Zero-hardcoding requires config as data before any behavior binds | EXISTS |
| **FAB-EXEC** Meta-Core / Execution | (execution) | No operation runs; deterministic execution engine is the reflexive kernel (RC-045/038) | EXISTS |
| **FAB-IDENT** Identity | Identity | No principal can be named; authz is impossible without identity (RC-005/023) | EXISTS |
| **FAB-AUTH** Authority | Authority | No decision can be authorized; supreme hierarchy gates all change (RC-002/033) | PARTIAL |
| **FAB-GOV** Governance | (gates + `AUTH-012`) | No change is admissible; deny-by-default + Approval-By-Exception (RC-004) | EXISTS |
| **FAB-POL** Policy | (policy eval) | No action is evaluable; deny-by-default authz requires policy evaluation (RC-060/014) | PARTIAL |
| **FAB-EVO** Evolution | Evolution | No durable mutation can be committed; sole append-only commit path (RC-013/INV-10) | EXISTS |
| **FAB-EVT** Event | (event catalog) | No propagation/observation; event-driven propagation is INV-6 | EXISTS |
| **FAB-STATE** State/Lifecycle | (lifecycle) | No construct can carry version/history; append-only lifecycle (RC-027) | PARTIAL |
| **FAB-AUDIT** Audit/Provenance | (audit log) | No fail-closed guarantee is verifiable; append-only hash-chained record (RC-037/S6) | PARTIAL |

**Twelve FOUNDATIONAL fabrics.** Note that four (**FAB-AUTH, FAB-POL, FAB-STATE, FAB-AUDIT**) are FOUNDATIONAL
**and** carry PARTIAL realization caveats (duplication / bounded vocabulary / attestation). They *exist* enough
to bootstrap the kernel — the caveat is uniformity/integrity debt, not absence.

> **Trust and Security note.** FAB-TRUST and FAB-SEC are placed at the boundary between FOUNDATIONAL and CORE.
> Trust (RC-006) is an attribute evaluated *by* Policy/Identity and is required for any multi-principal or
> federated operation; Security (RC-014) enforces the non-waivable S1/S3/S4 controls that make FOUNDATIONAL
> fabrics safe to expose. This assessment classifies both as **FOUNDATIONAL-adjacent CORE**: the kernel can
> bootstrap a single trusted local principal without them, but no *exposed* boundary is constitutional without
> them, so they must be present for any real runtime (see §3).

---

## 3. Core fabrics (required for constitutional completeness of record)

| Fabric | Primitive | Classification | Rationale | Realized? |
|--------|-----------|:--------------:|-----------|:---------:|
| FAB-TRUST | (trust eval) | CORE (foundational-adjacent) | Required for any exposed/multi-principal boundary (RC-006) | EXISTS |
| FAB-SEC | (S1..S20) | CORE (foundational-adjacent) | Non-waivable controls on every exposed boundary (RC-014) | EXISTS |
| FAB-FED | Federation | CORE | Contract-first composition + static-stability continuity (RC-007/035); one of nine primitives | EXISTS |
| FAB-KNOW | Knowledge | CORE | Ratified first-class primitive; versioned governed knowledge (RC-008) | EXISTS |
| FAB-ONTO | Ontology | CORE | Shared typing substrate; entity model (RC-010/022) — one of nine primitives | EXISTS |
| FAB-MEM | Memory | CORE | Ratified tiered memory primitive (RC-009) — one of nine primitives | EXISTS |
| FAB-OPS | Platform-Engineering/Ops | CORE | Production operability, tech-neutral infra (RC-015/042) | EXISTS |

**Seven CORE fabrics.** All EXISTS. Together with the twelve FOUNDATIONAL fabrics they constitute the **realized
constitutional control kernel** (PI-2..PI-9, 269/269 tests).

---

## 4. Optional fabrics (convergence / catalog — debt, not foundation)

| Fabric | Nature | Classification | Rationale | Gap |
|--------|--------|:--------------:|-----------|-----|
| Universal Authority (unify FAB-AUTH copies) | Convergence | OPTIONAL | Collapses 5/4/5 duplicated authorities to one primitive; behavior via config | GAP-M1 |
| Universal Audit/Provenance (unify FAB-AUDIT copies) | Convergence | OPTIONAL | Collapses 6× audit logs to one primitive (10th primitive candidate) | GAP-C1 |
| Universal Evolution/Lifecycle (unify FAB-STATE engines) | Convergence | OPTIONAL | Single lifecycle engine; fabrics register lifecycle profiles as data | GAP-M2 |
| Extensible policy vocabulary (harden FAB-POL) | Convergence | OPTIONAL | Registry/metadata-extensible predicates vs hard-coded switch | GAP-M3 |
| FAB-PFC Platform-Factory Catalog | Catalog | OPTIONAL | Explicit platform-class enumeration over the EXISTING INV-13 mechanism | GAP-R29 |
| Requirements-registry construct | Governance convenience | OPTIONAL | Standing requirements registry (meta-requirements) | GAP-R50 |

**Six OPTIONAL fabrics/convergences.** These are **soundness/uniformity improvements** (P1 debt for the first
four, completeness convenience for the last two). Their absence does **not** prevent constitutional existence —
the capabilities already EXIST in duplicated/entailment form — so they are OPTIONAL to *existence* while being
recommended for *soundness*.

---

## 5. Deferred fabrics (governed future; not part of the minimum system)

| Fabric | Layer | Classification | Deferral basis | Realized? |
|--------|-------|:--------------:|----------------|:---------:|
| FAB-INTEL Intelligence | L-BEH | DEFERRED | PI-10 design-only; alignment/Non-Actuation enrollment pending | Design-only |
| FAB-SIM Simulation | L-BEH | DEFERRED | PI-11 design-only; `AD-0022` conditional | Design-only |
| FAB-ECON Economic | L-BEH | DEFERRED | `ECON-*` design-only; `AD-0014`-adjacent | Design-only |
| FAB-CIV Civilization | L-BEH | DEFERRED | `CIV-*` design-only; deferred `AD-0014` | Design-only |
| FAB-TIME Temporal | L-TIME | DEFERRED | Stated-requirement (`UCOS-REQ-0005`); realization is future scoped release | Stated, unbuilt |

**Five DEFERRED fabrics.** These realize the **behavioral and temporal frontier**. They depend on the
FOUNDATIONAL+CORE set and, in several cases, on OPTIONAL convergence (e.g., Intelligence should not be
authorized before Non-Actuation is enrolled and the verifier gate exists). None is part of the minimum
constitutional system.

---

## 6. Foundational-fabric determination

| Class | Count | Fabrics | Realization |
|-------|:-----:|---------|-------------|
| **FOUNDATIONAL** | 12 | REG, META, CFG, EXEC, IDENT, AUTH, GOV, POL, EVO, EVT, STATE, AUDIT | 8 EXISTS + 4 PARTIAL (all present) |
| **CORE** | 7 | TRUST, SEC, FED, KNOW, ONTO, MEM, OPS | 7 EXISTS |
| **OPTIONAL** | 6 | Universal-Authority, Universal-Audit, Universal-Lifecycle, Policy-vocab, PFC, Req-registry | Debt / entailment |
| **DEFERRED** | 5 | INTEL, SIM, ECON, CIV, TIME | Design/stated, unbuilt |

**The minimum set of fabrics required before any higher-order capability can exist is the 12 FOUNDATIONAL
fabrics, safely exposable only with the 2 foundational-adjacent CORE fabrics (Trust, Security).** All 12
FOUNDATIONAL fabrics and all 7 CORE fabrics **exist of record** (implemented at 269/269). Therefore:

> **The existence floor is fully realized.** No higher-order (behavioral/temporal) capability is blocked by a
> *missing foundation* — every DEFERRED fabric depends only on fabrics that already EXIST, plus governed
> enactment (invariant enrollment) and OPTIONAL convergence recommended for soundness.

The four PARTIAL FOUNDATIONAL fabrics (Authority, Policy, State/Lifecycle, Audit) are the **highest-value
hardening targets**: they are load-bearing for every higher fabric, so their convergence debt (GAP-M1/M2/M3,
GAP-C1) and the authority-chain attestation (GAP-C3 residual) propagate risk upward. This is the input to the
dependency graph (`UCOS-IR-0004`) and the risk register (`UCOS-IR-0007`).

> **Scope discipline.** No code, schema, architecture, or governance was produced. `INV-1..13`, `AUTH-012`,
> `AD-0014`, and the Article IX generation lock are unchanged.

## 7. Traceability

- **Refines:** `UCOS-IR-0002` (fabric inventory & realization states).
- **Evidence:** `UCOS-REQ-0001` (RC primitives), `UCOS-AUDIT-0001` (GAP-M1/M2/M3/C1/C3/R29/R50), `UCOS-REQ-0003` (INV-1..13 / principles), corpus fabric specs (`architecture/*`).
- **Refined by:** `UCOS-IR-0004` (Dependency Graph), `UCOS-IR-0005` (Minimum Runtime).
- **Owner:** UCOS Authority Board.

**END `UCOS-IR-0003` — FOUNDATIONAL FABRIC SPECIFICATION · 12 FOUNDATIONAL · 7 CORE · 6 OPTIONAL · 5 DEFERRED · EXISTENCE FLOOR FULLY REALIZED · ASSESSMENT ONLY.**
