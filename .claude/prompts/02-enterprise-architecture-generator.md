# Prompt 02 — Enterprise Architecture Generator

**Prompt ID:** PROMPT-02
**Status:** ACTIVE (executable)
**Phase:** Phase 2 — Enterprise Architecture
**Pipeline Position:** 2 of 12
**Generation Authority:** Enterprise-level architecture + capability ratification ONLY.

> This prompt converts provisional capability candidates into a ratified enterprise
> architecture: the capability map, value streams, architecturally significant requirements
> (ASRs), and the enterprise-level decisions that frame all domain work. It does NOT design
> domains, services, data, or technology.

---

## 1. Mission

Ratify the UCOS enterprise architecture — the authoritative capability map, value streams,
quality attributes (ASRs), and enterprise ADRs — that decomposes the Vision into governed,
traceable business capabilities and frames the domain architecture that follows.

## 2. Scope

**In scope**
- Ratify capabilities from `CTX-CAP-001` candidates (assign permanent Capability IDs).
- Define the enterprise capability map, capability dependencies, and value streams.
- Quantify architecturally significant requirements / quality attributes (availability,
  scalability, security, evolvability, observability, performance, interoperability).
- Author enterprise ADRs and define capability-to-domain allocation intent (not the domains).

**Out of scope**
- Designing bounded contexts / context maps (Prompt 03).
- Metadata, data, experience, contract, platform, or security design.
- Any technology selection or implementation.

## 3. Inputs

| Input | Source | Use |
|-------|--------|-----|
| Ratified Constitution | `CTX-CONST-001` (Ratified) | Governing authority |
| Principles | `CTX-PRIN-001` | Binding design rules |
| Architecture Baseline | `CTX-ARCHB-001` | Layer model + quality attributes |
| Capability Catalog | `CTX-CAP-001` | Provisional candidates to ratify |
| Vision | `CTX-VISION-001` | Strategic goals to satisfy |

## 4. Dependencies

- **Predecessor prompts that MUST be complete:** Prompt 01 (Constitution ratified).
- **Future prompts that depend on this:** Prompt 03 (domains realize ratified capabilities),
  and transitively 04–12. Every domain MUST trace to a capability ratified here.

## 5. Required Context

- `.claude/context/UCOS-VISION.md`
- `.claude/context/UCOS-CONSTITUTION.md`
- `.claude/context/UCOS-PRINCIPLES.md`
- `.claude/context/UCOS-ARCHITECTURE-BASELINE.md`
- `.claude/context/UCOS-CAPABILITY-CATALOG.md`
- `.claude/context/UCOS-ARTIFACT-REGISTRY.md`
- `.claude/context/UCOS-TRACEABILITY-MODEL.md`

## 6. Required Skills

- `domain-driven-design` — capability/value-stream framing.
- `documentation-architecture` — ADRs and capability specifications.
- `traceability-enforcement` (SKILL-012), `gap-detection` (SKILL-013).
- `constitutional-compliance` (SKILL-001) — entry/exit compliance check.

## 7. Deliverables

1. **Ratified Capability Map** — permanent Capability IDs (`UCOS-ENT-CAP-NNN`), outcomes,
   maturity, owning-domain intent, dependencies, KPIs/SLAs.
2. **Value Streams** — end-to-end commerce flows mapped to capabilities.
3. **ASR / Quality Attribute Specification** — quantified targets per attribute.
4. **Enterprise ADRs** (`UCOS-ENT-ADR-NNN`) — capability boundaries, prioritization, allocation policy.
5. **Updated Capability Catalog** — `CTX-CAP-001` promoted from scaffold to ratified.

## 8. Output Locations

| Deliverable | Location |
|-------------|----------|
| Enterprise architecture docs | `architecture/enterprise/` |
| Capability specifications | `specifications/capabilities/` |
| Enterprise ADRs | `architecture/enterprise/adr/UCOS-ENT-ADR-NNN.md` |
| Capability Catalog update | `.claude/context/UCOS-CAPABILITY-CATALOG.md` |
| Registry + State | `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `.claude/state/PROJECT-STATE.md` |

## 9. Traceability Rules

- Every ratified capability MUST refine `CTX-VISION-001` and a Principle, and be refined-by
  one or more domains (recorded as the domains are ratified in Prompt 03).
- No capability without a value-stream linkage; no orphan ASRs.
- Candidate IDs (`CAP-CAND-NN`) MUST be mapped to permanent IDs and the mapping recorded.

## 10. Artifact Registration Rules

- Register each capability, ASR, value stream, and ADR with unique IDs and bidirectional links.
- Promote `CTX-CAP-001` registry status from "Baseline scaffold" to "Ratified".
- Preserve candidate rows; mark them superseded-by the ratified capability IDs.

## 11. Validation Requirements

- **Documentation gate (`GATE-DOC-001`):** PASS for all enterprise artifacts.
- **Traceability check:** every capability traces up to Vision/Principle; zero orphans.
- **Gap scan:** any unrealized strategic goal or unquantified ASR recorded as a coverage gap.
- Quality/Security/Release gates not exercised (no implementation).

## 12. Completion Criteria

- All capabilities ratified with permanent IDs, KPIs, and dependencies.
- Value streams and quantified ASRs authored and registered.
- Documentation + traceability checks PASS; zero blocking gaps.
- State advanced; Prompt 03 authorized as next step.

## 13. State Update Rules

- Mark Prompt 02 ✅ Complete; set Phase → "Phase 2 — Enterprise Architecture Ratified".
- Record ratified capability count and candidate→permanent ID mapping summary.
- Log open coverage gaps; set Next Step → "Run Prompt 03".

## 14. May Generate / May Not Generate

**MAY generate:** ratified capabilities, capability map, value streams, ASRs, enterprise ADRs.

**MAY NOT generate:** bounded contexts/context maps (Prompt 03), metadata/data/experience
models, contracts, services, platform/technology choices, security designs, or code.

## Traceability
- Refines: `CTX-VISION-001`, `CTX-CONST-001`, `CTX-ARCHB-001`, `CTX-CAP-001`
- Refined by: Prompt 03 (and transitively 04–12).
