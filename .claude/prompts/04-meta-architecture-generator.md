# Prompt 04 — Meta Architecture Generator

**Prompt ID:** PROMPT-04
**Status:** ACTIVE (executable)
**Phase:** Phase 4 — Metadata & Configuration Architecture
**Pipeline Position:** 4 of 12
**Generation Authority:** Metadata / configuration / variability model ONLY.

> This prompt designs the configuration-driven variability model that lets one UCOS core serve
> many commerce models (B2C, B2B, marketplace, subscription, hybrid) WITHOUT code forks
> (Constitution Article V, Principle P3). It does NOT design data persistence, contracts, or code.

---

## 1. Mission

Design the UCOS metadata architecture: the authoritative model for configurable behavior,
tenant variability, feature composition, and extension points — expressing all cross-model
variability as governed metadata rather than branched code.

## 2. Scope

**In scope**
- Metadata taxonomy: configuration entities, schemas, scopes (global/tenant/channel), precedence.
- Variability model: feature flags, composition rules, policy/rule metadata, extension points.
- Configuration lifecycle: authoring, validation, versioning, promotion, defaulting/overrides.
- Per-context configuration surfaces aligned to the ratified domains (Prompt 03).

**Out of scope**
- Persisted data models / storage of metadata at rest (Prompt 05 owns data architecture).
- API/event contracts that expose configuration (Prompt 07).
- Domain models (Prompt 03), experiences (Prompt 06), platform/security/code.

## 3. Inputs

| Input | Source | Use |
|-------|--------|-----|
| Bounded contexts + context map | Prompt 03 | Where configuration applies |
| Capabilities + ASRs | Prompt 02 | Variability requirements |
| Architecture Baseline | `CTX-ARCHB-001` | Metadata-driven mandate |
| Constitution Art. V / Principle P3 | `CTX-CONST-001`, `CTX-PRIN-001` | Binding rule |

## 4. Dependencies

- **Predecessor prompts that MUST be complete:** Prompts 01, 02, 03.
- **Future prompts that depend on this:** Prompt 05 (persists metadata schemas), 06
  (experience consumes config), 07 (config-bearing contracts), 10 (implements config resolution).

## 5. Required Context

- `.claude/context/UCOS-ARCHITECTURE-BASELINE.md`
- `.claude/context/UCOS-DOMAIN-CATALOG.md`
- `.claude/context/UCOS-CAPABILITY-CATALOG.md`
- `.claude/context/UCOS-CONSTITUTION.md` (Article V)
- `.claude/context/UCOS-PRINCIPLES.md` (P3)
- `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `UCOS-TRACEABILITY-MODEL.md`

## 6. Required Skills

- `metadata-architecture` — primary authority.
- `data-modeling` — schema shape of configuration entities.
- `domain-driven-design` — align config surfaces to contexts.
- `documentation-architecture`, `traceability-enforcement` (SKILL-012), `gap-detection` (SKILL-013).

## 7. Deliverables

1. **Metadata Model** — configuration entities, schemas, scopes, precedence/resolution rules (`UCOS-META-MODEL-NNN`).
2. **Variability Map** — commerce-model variations mapped to metadata (no code forks).
3. **Configuration Lifecycle Spec** — authoring → validation → versioning → promotion.
4. **Extension-Point Catalog** — sanctioned extension/policy hooks per context.
5. **Metadata ADRs** (`UCOS-META-ADR-NNN`).

## 8. Output Locations

| Deliverable | Location |
|-------------|----------|
| Metadata architecture | `architecture/meta/` |
| Metadata ADRs | `architecture/meta/adr/UCOS-META-ADR-NNN.md` |
| Registry + State | `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `.claude/state/PROJECT-STATE.md` |

## 9. Traceability Rules

- Every metadata entity traces to the capability/domain whose variability it expresses.
- Every supported commerce-model variation traces to a metadata construct (no orphan variability).
- Extension points trace to the context that exposes them.

## 10. Artifact Registration Rules

- Register each metadata model, variability mapping, lifecycle spec, extension point, and ADR.
- Bidirectional links to owning domains (Prompt 03) recorded in the same change.

## 11. Validation Requirements

- **Documentation gate (`GATE-DOC-001`):** PASS.
- **Constitution Art. V check:** every variability case expressed as metadata, not code fork.
- **Traceability check:** zero orphan metadata entities.
- **Gap scan:** any required commerce-model variation without a metadata construct → coverage gap.

## 12. Completion Criteria

- Metadata model, variability map, lifecycle, and extension catalog authored and registered.
- Art. V conformance demonstrated; documentation + traceability PASS; zero blocking gaps.
- State advanced; Prompt 05 authorized.

## 13. State Update Rules

- Mark Prompt 04 ✅ Complete; Phase → "Phase 4 — Metadata Architecture Ratified".
- Log gaps; set Next Step → "Run Prompt 05".

## 14. May Generate / May Not Generate

**MAY generate:** metadata models, variability maps, configuration lifecycle, extension points, metadata ADRs.

**MAY NOT generate:** persisted data schemas (Prompt 05), contracts (Prompt 07), domain models
(Prompt 03), experiences (Prompt 06), platform/security/code.

## Traceability
- Refines: `CTX-ARCHB-001`, Prompt 03 domains, Prompt 02 capabilities, `CTX-CONST-001` (Art. V)
- Refined by: Prompts 05, 06, 07, 10.
