# Prompt 06 — Experience Generator

**Prompt ID:** PROMPT-06
**Status:** ACTIVE (executable)
**Phase:** Phase 6 — Experience Architecture
**Pipeline Position:** 6 of 12
**Generation Authority:** Experience surfaces, channels, interaction & UX architecture ONLY.

> This prompt designs the user-facing experience architecture: channels, surfaces, interaction
> flows, information architecture, and accessibility standards. It does NOT implement UI code,
> define service/API contracts, or design backend domains/data.

---

## 1. Mission

Design the UCOS experience architecture: the catalog of experience surfaces (storefront, admin,
operator console, partner portal), channels, interaction flows, navigation/information
architecture, accessibility and design-system standards — all driven by metadata and traceable
to capabilities and domains.

## 2. Scope

**In scope**
- Experience surface catalog and channel model (web, mobile, admin, API consumers, etc.).
- Interaction flows / journeys mapped to value streams (Prompt 02) and domains (Prompt 03).
- Information architecture, navigation, and design-system / UX standards.
- Accessibility standards (e.g., WCAG) and localization/variability via metadata (Prompt 04).
- Experience-level consumption needs that constrain contracts (handed to Prompt 07).

**Out of scope**
- UI/front-end implementation/code (Prompt 10 — apps).
- API/event contract definitions (Prompt 07).
- Domain, data, metadata, platform, security design.

## 3. Inputs

| Input | Source | Use |
|-------|--------|-----|
| Value streams + capabilities | Prompt 02 | Journeys to support |
| Bounded contexts + context map | Prompt 03 | Capability surfaces |
| Metadata/variability model | Prompt 04 | Configurable experiences/themes/locales |
| Data classification | Prompt 05 | What may be displayed/handled in UI |

## 4. Dependencies

- **Predecessor prompts that MUST be complete:** Prompts 01, 02, 03, 04, 05.
- **Future prompts that depend on this:** Prompt 07 (experience needs → contract requirements),
  Prompt 09 (UI threat surface), Prompt 10 (app implementations realize these surfaces).

## 5. Required Context

- `.claude/context/UCOS-CAPABILITY-CATALOG.md`, `UCOS-DOMAIN-CATALOG.md`
- `.claude/context/UCOS-ARCHITECTURE-BASELINE.md` (Experience layer)
- `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `UCOS-TRACEABILITY-MODEL.md`

## 6. Required Skills

- `ui-ux-architecture` — primary authority.
- `metadata-architecture` — configurable/variable experiences.
- `documentation-architecture`, `traceability-enforcement` (SKILL-012), `gap-detection` (SKILL-013).
- `constitutional-compliance` (SKILL-001).

## 7. Deliverables

1. **Experience Surface Catalog** (`UCOS-EXP-SURFACE-NNN`) — surfaces, channels, audiences.
2. **Interaction Flows / Journeys** mapped to value streams and capabilities.
3. **Information Architecture & Navigation** model.
4. **UX / Design-System Standards** including accessibility (WCAG) and localization.
5. **Experience Consumption Requirements** — data/operations needed (input to Prompt 07).
6. **Experience ADRs** (`UCOS-EXP-ADR-NNN`).

## 8. Output Locations

| Deliverable | Location |
|-------------|----------|
| Experience architecture | `architecture/experience/` |
| Experience ADRs | `architecture/experience/adr/UCOS-EXP-ADR-NNN.md` |
| Registry + State | `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `.claude/state/PROJECT-STATE.md` |

> Note: `apps/` remains EMPTY here — app code is generated only by Prompt 10.

## 9. Traceability Rules

- Every surface/journey traces to ≥1 capability and the domain(s) it exposes.
- Every consumption requirement traces to the data/domain it needs (and forward to Prompt 07).
- Configurable experiences trace to metadata constructs (Prompt 04).
- No orphan surfaces; no journey without a value-stream parent.

## 10. Artifact Registration Rules

- Register each surface, journey, IA model, standard, and ADR with unique IDs and bidirectional links.
- Consumption requirements registered as forward dependencies for Prompt 07.

## 11. Validation Requirements

- **Documentation gate (`GATE-DOC-001`):** PASS.
- **Accessibility standard:** WCAG (or stated equivalent) defined for every surface.
- **Traceability check:** zero orphan surfaces/journeys.
- **Gap scan:** capability/value-stream with no experience surface where one is expected → coverage gap.

## 12. Completion Criteria

- Surface catalog, journeys, IA, UX/accessibility standards, and consumption requirements authored and registered.
- Documentation + traceability PASS; accessibility standard set; zero blocking gaps.
- State advanced; Prompt 07 authorized.

## 13. State Update Rules

- Mark Prompt 06 ✅ Complete; Phase → "Phase 6 — Experience Architecture Ratified".
- Log gaps; set Next Step → "Run Prompt 07".

## 14. May Generate / May Not Generate

**MAY generate:** experience surface catalog, journeys, information architecture, UX/accessibility standards, experience ADRs, consumption requirements.

**MAY NOT generate:** UI/app code (Prompt 10), API/event contracts (Prompt 07), domain/data/
metadata models (Prompts 03–05), platform/security designs.

## Traceability
- Refines: Prompt 02 value streams, Prompt 03 domains, Prompt 04 metadata, Prompt 05 classification
- Refined by: Prompts 07, 09, 10.
