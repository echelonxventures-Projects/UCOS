# Prompt 03 — Domain Architecture Generator

**Prompt ID:** PROMPT-03
**Status:** ACTIVE (executable)
**Phase:** Phase 3 — Domain Architecture
**Pipeline Position:** 3 of 12
**Generation Authority:** Bounded-context design + context map + domain models ONLY.

> This prompt ratifies the bounded contexts of UCOS, the context map, the ubiquitous language
> per context, and the domain models (aggregates, entities, domain events). It does NOT define
> external contracts, data persistence schemas, metadata, experiences, platform, or code.

---

## 1. Mission

Ratify the UCOS domain architecture: convert provisional domain candidates into bounded
contexts with explicit boundaries, a context map with integration patterns, ubiquitous
language, and domain models that realize the ratified capabilities.

## 2. Scope

**In scope**
- Ratify bounded contexts (permanent Domain IDs) from `CTX-DOM-001` candidates.
- Author the context map: relationships (partnership, customer-supplier, conformist, ACL,
  shared kernel) and integration patterns (sync/async, events).
- Define per-context ubiquitous language, aggregates, entities, value objects, domain events.
- Allocate capabilities (from Prompt 02) to domains; expand the Glossary.

**Out of scope**
- External/published API or event **contracts** (Prompt 07 owns contract artifacts).
- Persistence/data schema design (Prompt 05) and metadata/config model (Prompt 04).
- Experience, platform, security design, and any implementation.

## 3. Inputs

| Input | Source | Use |
|-------|--------|-----|
| Ratified capabilities | Prompt 02 outputs / `CTX-CAP-001` | Domains MUST realize these |
| Domain Catalog | `CTX-DOM-001` | Provisional candidates to ratify |
| Glossary | `CTX-GLOSS-001` | Ubiquitous language base |
| Architecture Baseline | `CTX-ARCHB-001` | Boundary & integration rules |

## 4. Dependencies

- **Predecessor prompts that MUST be complete:** Prompt 01 and Prompt 02.
- **Future prompts that depend on this:** Prompt 04 (metadata per context), 05 (data per
  context), 06 (experience surfaces), 07 (contracts at seams), 09 (per-context threat model),
  10 (implementation). The context map is the backbone of all subsequent work.

## 5. Required Context

- `.claude/context/UCOS-DOMAIN-CATALOG.md`
- `.claude/context/UCOS-CAPABILITY-CATALOG.md`
- `.claude/context/UCOS-GLOSSARY.md`
- `.claude/context/UCOS-ARCHITECTURE-BASELINE.md`
- `.claude/context/UCOS-ARTIFACT-REGISTRY.md`
- `.claude/context/UCOS-TRACEABILITY-MODEL.md`

## 6. Required Skills

- `domain-driven-design` — primary authority (bounded contexts, aggregates, context map).
- `data-modeling` — domain model shape (not persistence).
- `documentation-architecture`, `traceability-enforcement` (SKILL-012), `gap-detection` (SKILL-013).
- `constitutional-compliance` (SKILL-001).

## 7. Deliverables

1. **Ratified Bounded Contexts** — permanent Domain IDs (`UCOS-DOM-NNN`), responsibility,
   owned capabilities, language.
2. **Context Map** — relationship types + integration patterns between all contexts.
3. **Domain Models** — aggregates, entities, value objects, invariants, domain events per context.
4. **Expanded Glossary** — per-context ubiquitous language merged into `CTX-GLOSS-001`.
5. **Domain ADRs** (`UCOS-DOM-ADR-NNN`) — boundary decisions, ACL placements.

## 8. Output Locations

| Deliverable | Location |
|-------------|----------|
| Domain architecture + models | `architecture/domains/<domain>/` |
| Context map | `architecture/domains/context-map.md` |
| Domain ADRs | `architecture/domains/adr/UCOS-DOM-ADR-NNN.md` |
| Domain Catalog + Glossary updates | `.claude/context/UCOS-DOMAIN-CATALOG.md`, `UCOS-GLOSSARY.md` |
| Registry + State | `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `.claude/state/PROJECT-STATE.md` |

## 9. Traceability Rules

- Every bounded context MUST trace upstream to ≥1 ratified capability (no dangling domains).
- Every domain event/aggregate traces to its owning context.
- Candidate IDs (`DOM-CAND-NN`) mapped to permanent Domain IDs; mapping recorded.
- Context-map edges are themselves traceable artifacts.

## 10. Artifact Registration Rules

- Register each bounded context, domain model, context-map edge, and ADR with unique IDs.
- Promote `CTX-DOM-001` status from "Baseline scaffold" to "Ratified".
- Preserve candidate rows; mark superseded-by permanent Domain IDs.

## 11. Validation Requirements

- **Documentation gate (`GATE-DOC-001`):** PASS.
- **Traceability check:** zero orphan domains; every capability realized by ≥1 domain.
- **Gap scan:** capabilities with no owning domain → coverage gap; shared mutable models → consistency gap.
- **DDD review:** no shared mutable models across contexts; cross-context only via planned contracts.

## 12. Completion Criteria

- All bounded contexts ratified with permanent IDs and capability linkage.
- Context map complete with relationship + integration patterns for every seam.
- Domain models authored; glossary expanded; documentation + traceability PASS; zero blocking gaps.
- State advanced; Prompt 04 authorized.

## 13. State Update Rules

- Mark Prompt 03 ✅ Complete; Phase → "Phase 3 — Domain Architecture Ratified".
- Record ratified domain count and candidate→permanent mapping.
- Log gaps; set Next Step → "Run Prompt 04".

## 14. May Generate / May Not Generate

**MAY generate:** bounded contexts, context map, domain models, domain events, glossary expansion, domain ADRs.

**MAY NOT generate:** published API/event contracts (Prompt 07), persistence schemas
(Prompt 05), metadata/config models (Prompt 04), experience surfaces (Prompt 06), platform/
technology (Prompt 08), security controls (Prompt 09), or code (Prompt 10).

## Traceability
- Refines: `CTX-DOM-001`, `CTX-CAP-001`, `CTX-ARCHB-001`, `CTX-GLOSS-001`
- Refined by: Prompts 04, 05, 06, 07, 09, 10.
