# UCOS — Traceability Model

**Artifact ID:** CTX-TRACE-001
**Status:** Baseline (bootstrap) — binding on all artifacts.
**Purpose:** Define how lineage is established, recorded, and verified across UCOS.

---

## 1. Traceability Chain (canonical)

```
Vision
  └─> Principle / Constitution
        └─> Capability
              └─> Domain (Bounded Context)
                    └─> Specification (requirement / capability spec)
                          └─> Contract (API / event / data)
                                └─> Service / Component
                                      └─> Implementation
                                            └─> Test / Acceptance
                                                  └─> Certification
```

Every artifact occupies a node in this chain and MUST declare its **upstream** (parent)
and **downstream** (children) links.

## 2. Artifact Identifier Scheme

`UCOS-<LAYER>-<TYPE>-<NNN>`

| Segment | Meaning | Examples |
|---------|---------|----------|
| LAYER | Architectural layer | CTX, ENT, DOM, DATA, META, EXP, SVC, API, PLAT, SEC, QA, REL |
| TYPE | Artifact type | VISION, CONST, PRIN, CAP, SPEC, CONTRACT, ADR, MODEL, GATE, GAP |
| NNN | Zero-padded sequence | 001, 002, ... |

> Bootstrap context artifacts use the short `CTX-*` IDs already assigned in each file.
> Generators assign full IDs and MUST register them.

## 3. Required Metadata Per Artifact
- Artifact ID
- Status (Baseline / Draft / Ratified / Deprecated)
- Upstream links (refines)
- Downstream links (refined by)
- Owner
- Gate status (where applicable)

## 4. Traceability Rules
1. **No orphans:** every artifact (except Vision) MUST have at least one upstream link.
2. **No dangling realization:** every contract/service MUST trace to a capability + domain.
3. **Bidirectional integrity:** if A refines B, then B must list A as refined-by.
4. **Registry authority:** the Artifact Registry is the single source of truth for links.
5. **Change propagation:** modifying an upstream artifact flags all downstream artifacts for review.

## 5. Verification
- The **traceability-enforcement** skill defines automated/manual checks.
- The **gap-detection** skill identifies orphans, dangling links, and missing coverage.
- Certification (Prompt 12) MUST confirm full traceability for the certified scope.

## Traceability
- Refines: `UCOS-CONSTITUTION.md` (Article II)
- Enforced by: `.claude/skills/traceability-enforcement.md`, `.claude/skills/gap-detection.md`
- Recorded in: `UCOS-ARTIFACT-REGISTRY.md`
