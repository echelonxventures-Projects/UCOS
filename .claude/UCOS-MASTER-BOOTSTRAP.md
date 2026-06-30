# UCOS — Master Bootstrap

**Artifact ID:** MASTER-001
**Status:** Baseline (governing entry point)
**Authority:** Operational charter of the UCOS Architecture Program. Read this first.

> This document is the **single entry point** that binds the context package, skills, prompts,
> governance gates, and state into one coherent execution framework. It governs HOW UCOS is
> built. It does NOT design the platform.

---

## 1. Project Identity

| Field | Value |
|-------|-------|
| Program | Universal Commerce Operating System (UCOS) |
| Nature | Domain-driven, metadata-configurable, contract-first commerce platform |
| Phase | Phase 0 — Bootstrap (framework establishment) |
| Role of this repo | Permanent project memory, governance, traceability, execution framework |
| Generation policy | Platform/domain/service/code generation is **LOCKED** until their prompts run |

## 2. Constitutional Principles (binding summary)

Authoritative source: `.claude/context/UCOS-CONSTITUTION.md` and `UCOS-PRINCIPLES.md`.

1. **Primacy & precedence** — Constitution → Principles → Baseline → Gates → Specs → Impl.
2. **Traceability** — every artifact has an ID, registry entry, and bidirectional links.
3. **Domain-driven boundaries** — bounded contexts; contracts at every seam.
4. **Contract-first** — define versioned contracts before implementation.
5. **Configuration over customization** — variability is metadata, not code forks.
6. **Security & trust by default** — zero-trust, least-privilege, no embedded secrets.
7. **Quality & production-readiness** — gates pass before "done".
8. **Documentation** — undocumented behavior is a defect.
9. **Governed generation** — only designated prompts produce platform/domain/service/code.
10. **Gap discipline** — gaps are first-class; open gaps block certification.

## 3. Architecture Baseline (binding summary)

Authoritative source: `.claude/context/UCOS-ARCHITECTURE-BASELINE.md`.

- Style: DDD + composable + contract-first + metadata-driven + event-aware.
- Layers: Experience → Service → Domain → Platform → Data → Metadata → Security.
- Boundary rule: cross-context only via published, versioned contracts; no shared mutable models.
- Cross-cutting (mandatory): identity/tenancy, configuration, observability, security, resilience, audit.
- Technology: deliberately unspecified at bootstrap; chosen via ADRs in Prompt 08.

## 4. Artifact Registry Rules

Authoritative source: `.claude/context/UCOS-ARTIFACT-REGISTRY.md`.

1. Every artifact gets a unique Artifact ID (`UCOS-<LAYER>-<TYPE>-<NNN>` or assigned short ID).
2. Register on creation; record upstream (refines) and downstream (refined-by) links.
3. Never delete rows — deprecate and link the superseding artifact.
4. Registry updates happen in the same change that creates/modifies the artifact.

## 5. Traceability Rules

Authoritative source: `.claude/context/UCOS-TRACEABILITY-MODEL.md`.

- Canonical chain: Vision → Principle → Capability → Domain → Spec → Contract → Service →
  Implementation → Test → Certification.
- No orphans (every non-Vision artifact has ≥1 upstream link).
- No dangling realization (every contract/service traces to a capability + domain).
- Bidirectional integrity is mandatory; upstream changes flag downstream for review.

## 6. Validation Rules

Authoritative source: `.claude/governance/` gates + skills (testing, traceability, gap, readiness).

1. Each increment is evaluated against Quality (GATE-QUAL-001), Security (GATE-SEC-001),
   and Documentation (GATE-DOC-001) gates.
2. Validation verifies behavior against specifications and acceptance criteria.
3. Any unmet checkpoint becomes a recorded gap that blocks the affected scope.
4. Traceability and gap reports are mandatory inputs to validation.

## 7. Certification Rules

Authoritative source: `.claude/governance/completion-criteria.md` + release-gates.

- **DONE** = traceable + specified + contracted + Quality/Security/Documentation gates PASS +
  readiness ready + zero blocking gaps.
- **CERTIFIED** = DONE + Release gate (GATE-REL-001) PASS + recorded certification artifact.
- Certification with open blocking gaps is prohibited.

## 8. Execution Order (prompt pipeline)

```
01 Constitution → 02 Enterprise → 03 Domain → 04 Meta → 05 Data → 06 Experience
   → 07 Service/API → 08 Platform → 09 Security → 10 Implementation
   → 11 Validation → 12 Certification
```

Each prompt: loads context + relevant skills → applies gates → updates the registry and
`PROJECT-STATE.md`. **Do not skip stages.**

## 9. How to Use This Framework
1. Read this file, then the Constitution, Principles, and Architecture Baseline.
2. Check `PROJECT-STATE.md` for the current phase and next step.
3. Execute only the next authorized prompt; honor the generation lock.
4. Register artifacts, run gates, record gaps, update state.

## Traceability
- Refines: CTX-VISION-001, CTX-CONST-001, CTX-PRIN-001, CTX-ARCHB-001, CTX-TRACE-001, CTX-REG-001.
- Refined by: every prompt, gate, and state update.
