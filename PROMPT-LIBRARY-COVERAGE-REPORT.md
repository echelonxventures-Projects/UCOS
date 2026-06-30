# UCOS — Prompt Library Coverage Report

**Artifact ID:** DOC-EXEC-PROMPTLIB-001
**Status:** Final (Phase 0.5 — Prompt Library Authoring)
**Date:** 2026-06-29
**Authority:** Verifies the permanent 12-prompt execution library for completeness, exclusivity,
and lifecycle coverage. Subordinate to the Constitution and Master Bootstrap.

> This report attests that the 12 master prompts in `.claude/prompts/` form a complete,
> non-overlapping, conflict-free execution library spanning the full UCOS lifecycle. It
> generates no architecture, domains, services, or code.

---

## 1. Library Inventory

| # | Prompt | Phase | Status | Generation Authority |
|---|--------|-------|--------|----------------------|
| 01 | Constitution Generator | Governance Foundation | ACTIVE | Governance / Constitution + ADRs |
| 02 | Enterprise Architecture Generator | Enterprise Architecture | ACTIVE | Capabilities, value streams, ASRs |
| 03 | Domain Architecture Generator | Domain Architecture | ACTIVE | Bounded contexts, context map, domain models |
| 04 | Meta Architecture Generator | Metadata & Configuration | ACTIVE | Metadata/variability/config model |
| 05 | Data Architecture Generator | Data Architecture | ACTIVE | Canonical data models, data contracts |
| 06 | Experience Generator | Experience Architecture | ACTIVE | Experience surfaces, journeys, UX |
| 07 | Service & API Generator | Service & API Contracts | ACTIVE | Service boundaries, versioned contracts |
| 08 | Platform Engineering Generator | Platform Engineering | ACTIVE | Technology ADRs, platform services, infra design |
| 09 | Security Generator | Security Architecture | ACTIVE | Threat models, controls, security policy |
| 10 | Implementation Factory | Implementation | ACTIVE | Code: services, apps, packages + tests |
| 11 | Validation Factory | Validation | ACTIVE | Validation results, gate verdicts, gaps |
| 12 | Certification Factory | Certification & Release | ACTIVE | Certification + release authorization |

All 12 prompt bodies authored to the standard template: Mission, Scope, Inputs, Dependencies,
Required Context, Required Skills, Deliverables, Output Locations, Traceability Rules, Artifact
Registration Rules, Validation Requirements, Completion Criteria, State Update Rules, and an
explicit May/May-Not Generate section with predecessor/successor declarations.

## 2. Exclusive Ownership Matrix (no overlap, no conflict)

Each architectural concern has exactly ONE owning prompt. No concern is owned by two prompts.

| Concern / Artifact Type | Sole Owner | Explicitly Excluded From |
|-------------------------|------------|--------------------------|
| Constitution, governance ADRs, amendment process | 01 | 02–12 |
| Capabilities, value streams, ASRs/quality attributes | 02 | 01, 03–12 |
| Bounded contexts, context map, domain models, glossary | 03 | 02 (capabilities only), 04–12 |
| Metadata/variability/config lifecycle, extension points | 04 | 03 (domain semantics), 05 (persistence) |
| Canonical data models, ownership, classification, data contracts | 05 | 03 (domain models), 08 (physical store) |
| Experience surfaces, journeys, IA, UX/accessibility | 06 | 07 (contracts), 10 (app code) |
| Service boundaries, API/event/data contracts, contract-test specs | 07 | 03 (domain), 10 (impl), 08 (runtime) |
| Technology selection ADRs, platform services, topology, CI/CD, IaC design | 08 | 07 (contracts), 09 (controls), 10 (code) |
| Threat models, control mapping, authn/authz, secrets, audit design | 09 | 08 (substrate only), 10 (control code) |
| Code: services/apps/packages, unit + contract tests, runbooks | 10 | 02–09 (no new design), 11–12 (verdicts) |
| Validation reports, gate verdicts, gap records | 11 | 10 (no fixes), 12 (certification) |
| Certification records, release authorization, changelog | 12 | 10/11 (no code/verdict authoring) |

**Boundary clarifications that prevent conflict:**
- **Domain model (03) vs Data model (05):** 03 owns business semantics/aggregates; 05 owns
  logical persistence schemas realizing them. 05 selects no physical store — that is 08.
- **Metadata (04) vs Data (05):** 04 defines the variability/config model; 05 persists it logically.
- **Experience (06) vs Contracts (07):** 06 emits consumption *requirements*; 07 authors the contracts.
- **Platform (08) vs Security (09):** 08 provides the identity/secrets *substrate*; 09 authors the
  threat model, control mapping, and security *design* realized on that substrate.
- **Contracts (07) vs Implementation (10):** 07 defines the surface; 10 implements strictly to it.
- **Implementation (10) vs Validation (11) vs Certification (12):** 10 builds, 11 judges, 12 attests.
  No single prompt both builds and certifies its own output.

## 3. No Duplicate Outputs

Output locations are partitioned with no collisions:

| Location | Owning Prompt(s) | Notes |
|----------|------------------|-------|
| `.claude/context/` (Constitution) | 01 | Ratifies in place |
| `architecture/enterprise/` | 02 | Capabilities/ASRs/ADRs |
| `architecture/domains/` | 03 | Contexts, context map |
| `architecture/meta/` | 04 | Metadata model |
| `architecture/data/` | 05 | Data models/schemas |
| `architecture/experience/` | 06 | Surfaces/journeys |
| `architecture/services/` + `specifications/contracts/` | 07 | Boundaries + contracts |
| `architecture/platform/` + `infra/` (design) | 08 | Platform/tech/infra design |
| `architecture/security/` + `security/` | 09 | Security design/policy |
| `services/`, `apps/`, `packages/` | 10 | Code only |
| `quality/` | 11 | Validation/gaps |
| `release/` | 12 | Certification/release |

Each prompt also updates the shared `UCOS-ARTIFACT-REGISTRY.md` and `PROJECT-STATE.md`, but only
appends/updates its own rows — a coordinated, non-conflicting shared index, not a duplicate output.

## 4. Lifecycle Coverage (UCOS traceability chain)

The library covers every node of the canonical chain (`CTX-TRACE-001`):

| Chain Node | Covered By | Status |
|------------|------------|--------|
| Vision / Principle / Constitution | 01 (ratifies governance) | ✅ |
| Capability | 02 | ✅ |
| Domain (Bounded Context) | 03 | ✅ |
| Specification (capability/config/data/experience) | 02, 04, 05, 06 | ✅ |
| Contract (API/event/data) | 07 (+ data contracts seeded by 05) | ✅ |
| Service / Component | 07 (boundary) → 10 (realization) | ✅ |
| Implementation | 10 | ✅ |
| Test / Acceptance | 10 (authoring) → 11 (execution/verdict) | ✅ |
| Certification | 12 | ✅ |

**Cross-cutting concerns** (Baseline §4): identity/tenancy, configuration, observability,
resilience, audit, security — all owned: configuration → 04; identity/observability/resilience/
audit substrate → 08; security design → 09; metadata-driven variability → 04.

## 5. Verification Findings

| Check | Result | Evidence |
|-------|--------|----------|
| No overlapping responsibilities | ✅ PASS | Ownership matrix §2 — one owner per concern |
| No duplicate outputs | ✅ PASS | Output partition §3 — disjoint locations |
| No conflicting ownership | ✅ PASS | Boundary clarifications §2 resolve all adjacencies |
| No missing architectural concerns | ✅ PASS | Lifecycle + cross-cutting coverage §4 |
| Full UCOS lifecycle coverage | ✅ PASS | All chain nodes mapped §4 |
| Sequential dependency integrity | ✅ PASS | Each prompt declares predecessors/successors; chain 01→12 unbroken |
| Generation lock honored | ✅ PASS | Code only at 10; 01–09 forbid code; bootstrap lock intact |
| Gate assignment complete | ✅ PASS | DOC all phases; QUAL/SEC at 10–11; REL at 12; DONE at 12 |

## 6. Dependency Chain (predecessor → successor)

```
01 ─> 02 ─> 03 ─> 04 ─> 05 ─> 06 ─> 07 ─> 08 ─> 09 ─> 10 ─> 11 ─> 12
                                                          ^           │
                                                          └──(fail)───┘
```
- 01–09 are strictly sequential design/governance phases (each requires all priors).
- 10 requires ALL of 01–09 (code lock releases only here).
- 11 requires 10; 12 requires 11 (and 08 release-readiness). On gate FAIL, 12/11 route back to 10.

## 7. Gate Coverage Map

| Gate | Designed/Prepared By | Executed (PASS/FAIL verdict) By |
|------|----------------------|---------------------------------|
| Documentation `GATE-DOC-001` | every prompt | every prompt (on its own artifacts) |
| Quality `GATE-QUAL-001` | 07 (contract-test specs), 10 (tests) | 10 (per-increment), 11 |
| Security `GATE-SEC-001` | 09 (design) | 10 (per-increment), 11 |
| Release `GATE-REL-001` | 08 (rollback/obs/capacity) | 12 |
| Completion `GATE-DONE-001` | aggregates above | 12 |

## 8. Conclusion

The permanent 12-prompt UCOS execution library is **COMPLETE, EXCLUSIVE, and CONFLICT-FREE**,
with full lifecycle coverage from constitutional governance to certified release. No overlapping
responsibilities, no duplicate outputs, no conflicting ownership, and no missing architectural
concerns were found. The library is ready to drive Phase 1 (Prompt 01) when generation is authorized.

## Traceability
- Refines: `MASTER-001`, `CTX-TRACE-001`, `PROMPT-01..12`
- Refined by: `STATE-001` (Phase 0.5 advancement)
