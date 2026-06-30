# Prompt 05 — Data Architecture Generator

**Prompt ID:** PROMPT-05
**Status:** ACTIVE (executable)
**Phase:** Phase 5 — Data Architecture
**Pipeline Position:** 5 of 12
**Generation Authority:** Canonical data models, ownership, persistence strategy, data contracts ONLY.

> This prompt designs the canonical data models, data ownership per bounded context,
> persistence and lifecycle strategy, and the data-level contracts (schemas) — without
> selecting concrete datastore technology (that is Prompt 08) or writing code (Prompt 10).

---

## 1. Mission

Design the UCOS data architecture: per-context canonical data models, data ownership and
sovereignty rules, persistence/lifecycle strategy, data classification, and versioned data
schemas/contracts that realize the domain models without violating context boundaries.

## 2. Scope

**In scope**
- Canonical data models per bounded context (logical schemas, keys, relationships).
- Data ownership map (which context owns which data) and replication/projection rules.
- Data classification (PII, financial, sensitivity) feeding security (Prompt 09).
- Data lifecycle: retention, archival, versioning, migration strategy.
- Persistence of metadata schemas defined in Prompt 04 (logical, not physical).

**Out of scope**
- Physical datastore technology selection (Prompt 08 ADRs).
- API/event contract surfaces (Prompt 07) — though data schemas feed them.
- Domain model semantics (Prompt 03), code (Prompt 10).

## 3. Inputs

| Input | Source | Use |
|-------|--------|-----|
| Domain models + context map | Prompt 03 | Source of canonical entities |
| Metadata model | Prompt 04 | Configuration data to persist logically |
| Capabilities + ASRs | Prompt 02 | Scale/availability data targets |
| Architecture Baseline | `CTX-ARCHB-001` | No shared mutable models rule |

## 4. Dependencies

- **Predecessor prompts that MUST be complete:** Prompts 01, 02, 03, 04.
- **Future prompts that depend on this:** Prompt 07 (data schemas inform contracts), 08
  (datastore selection realizes this), 09 (data classification → controls), 10 (persistence impl).

## 5. Required Context

- `.claude/context/UCOS-ARCHITECTURE-BASELINE.md`
- `.claude/context/UCOS-DOMAIN-CATALOG.md`
- `.claude/context/UCOS-CONSTITUTION.md` (Art. III, VI)
- `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `UCOS-TRACEABILITY-MODEL.md`

## 6. Required Skills

- `data-modeling` — primary authority.
- `domain-driven-design` — boundary-respecting ownership.
- `security-architecture` — data classification feed.
- `documentation-architecture`, `traceability-enforcement` (SKILL-012), `gap-detection` (SKILL-013).

## 7. Deliverables

1. **Canonical Data Models** per context (`UCOS-DATA-MODEL-NNN`) — logical schemas, keys, relationships.
2. **Data Ownership Map** — owning context per data entity; projection/replication rules.
3. **Data Classification** — PII/financial/sensitivity tags per entity (feeds Prompt 09).
4. **Data Lifecycle Spec** — retention, archival, versioning, migration strategy.
5. **Data Schemas/Contracts** (`UCOS-DATA-CONTRACT-NNN`) — versioned logical schemas.
6. **Data ADRs** (`UCOS-DATA-ADR-NNN`).

## 8. Output Locations

| Deliverable | Location |
|-------------|----------|
| Data architecture + models | `architecture/data/` |
| Data schemas | `architecture/data/schemas/` |
| Data ADRs | `architecture/data/adr/UCOS-DATA-ADR-NNN.md` |
| Registry + State | `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `.claude/state/PROJECT-STATE.md` |

## 9. Traceability Rules

- Every data model traces to the domain model/aggregate it realizes (Prompt 03).
- Every data entity has exactly one owning context (no shared mutable ownership).
- Every classified-sensitive entity flagged for Prompt 09 control mapping.
- Persisted metadata schemas trace to Prompt 04 metadata entities.

## 10. Artifact Registration Rules

- Register each data model, schema, ownership entry, classification record, and ADR with unique IDs.
- Bidirectional links to domains (Prompt 03) and metadata (Prompt 04) recorded in the same change.

## 11. Validation Requirements

- **Documentation gate (`GATE-DOC-001`):** PASS.
- **Security pre-check:** all PII/financial data classified (S4 readiness for Prompt 09).
- **Traceability check:** zero orphan data models; single-owner rule enforced.
- **Gap scan:** domain aggregate without a data model → coverage gap; multi-owner data → consistency gap.

## 12. Completion Criteria

- Canonical models, ownership map, classification, lifecycle, and schemas authored and registered.
- Single-owner and no-shared-mutable rules verified; documentation + traceability PASS; zero blocking gaps.
- State advanced; Prompt 06 authorized.

## 13. State Update Rules

- Mark Prompt 05 ✅ Complete; Phase → "Phase 5 — Data Architecture Ratified".
- Log gaps; set Next Step → "Run Prompt 06".

## 14. May Generate / May Not Generate

**MAY generate:** canonical/logical data models, ownership map, classification, lifecycle, logical data schemas, data ADRs.

**MAY NOT generate:** physical datastore/technology choices (Prompt 08), API/event contracts
(Prompt 07), domain semantics (Prompt 03), experiences (Prompt 06), security controls
(Prompt 09), or code (Prompt 10).

## Traceability
- Refines: Prompt 03 domains, Prompt 04 metadata, `CTX-ARCHB-001`
- Refined by: Prompts 07, 08, 09, 10.
