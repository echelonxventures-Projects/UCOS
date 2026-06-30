# Prompt 01 — Constitution Generator

**Prompt ID:** PROMPT-01
**Status:** ACTIVE (executable)
**Phase:** Phase 1 — Governance Foundation
**Pipeline Position:** 1 of 12 (entry point; no predecessor)
**Generation Authority:** Governance artifacts ONLY. Platform/Domain/Service/Code generation remains LOCKED.

> This prompt ratifies the supreme governing law of UCOS. It converts the bootstrap
> Constitution baseline (`CTX-CONST-001`) into the full, ratified Constitution plus the
> constitutional ADRs that bind every downstream prompt. It designs no system.

---

## 1. Mission

Ratify the complete, authoritative UCOS Constitution and its foundational governance decisions
(ADRs), establishing the binding legal framework — precedence, traceability, gates, gap
discipline, and the generation lock — that every subsequent prompt (02–12) must obey.

## 2. Scope

**In scope**
- Expand the bootstrap Constitution baseline into a fully ratified Constitution.
- Author constitutional ADRs (decisions about precedence, amendment, enforcement).
- Define the amendment process and the enforcement model used by all gates.
- Confirm and freeze the precedence order and the governed-generation lock.

**Out of scope**
- Any enterprise, domain, metadata, data, experience, service, platform, or security design.
- Any capability ratification (that is Prompt 02) or domain ratification (Prompt 03).
- Any implementation, contract, or technology selection.

## 3. Inputs

| Input | Source | Use |
|-------|--------|-----|
| Vision | `CTX-VISION-001` | Source of intent the Constitution must serve |
| Constitution baseline | `CTX-CONST-001` | The articles to ratify and expand |
| Principles | `CTX-PRIN-001` | Subordinate rules the Constitution governs |
| Master Bootstrap | `MASTER-001` | Operating charter and precedence summary |
| Governance gates | `GATE-DOC-001`, `GATE-DONE-001` | Gate definitions the Constitution must anchor |

## 4. Dependencies

- **Predecessor prompts that MUST be complete:** None. This is the pipeline entry point.
- **Prerequisite state:** `PROJECT-STATE.md` shows Bootstrap COMPLETE.
- **Future prompts that depend on this:** ALL prompts 02–12. No prompt may run until the
  Constitution is ratified, because every gate and traceability rule derives its authority here.

## 5. Required Context

- `.claude/context/UCOS-VISION.md`
- `.claude/context/UCOS-CONSTITUTION.md`
- `.claude/context/UCOS-PRINCIPLES.md`
- `.claude/context/UCOS-ARTIFACT-REGISTRY.md`
- `.claude/context/UCOS-TRACEABILITY-MODEL.md`
- `.claude/UCOS-MASTER-BOOTSTRAP.md`

## 6. Required Skills

- `constitutional-compliance` (SKILL-001) — primary authority for ratification.
- `documentation-architecture` — ADR structure and durable documentation.
- `traceability-enforcement` (SKILL-012) — registry linkage and lineage integrity.
- `gap-detection` (SKILL-013) — record any unresolved governance question as a gap.

## 7. Deliverables

1. **Ratified Constitution** — full expansion of all Articles I–X with enforcement clauses,
   amendment procedure, and conflict-resolution rules. Status promoted `Baseline → Ratified`.
2. **Constitutional ADRs** — one ADR per significant governance decision
   (`UCOS-CTX-ADR-NNN`): precedence ordering, amendment process, enforcement model,
   generation-lock policy.
3. **Amendment Procedure** — documented, repeatable process for future constitutional change.
4. **Compliance checklist result** — pass/fail per Article, recorded with the artifact.

## 8. Output Locations

| Deliverable | Location |
|-------------|----------|
| Ratified Constitution | `.claude/context/UCOS-CONSTITUTION.md` (in place, status → Ratified) |
| Constitutional ADRs | `architecture/governance/adr/UCOS-CTX-ADR-NNN.md` |
| Registry updates | `.claude/context/UCOS-ARTIFACT-REGISTRY.md` |
| State update | `.claude/state/PROJECT-STATE.md` |

## 9. Traceability Rules

- The ratified Constitution refines `CTX-VISION-001` and is refined-by `CTX-PRIN-001` and all gates.
- Every ADR MUST declare upstream `CTX-CONST-001` and be refined-by the prompts it governs.
- No orphan ADRs; each ADR links to the Article or principle it decides.
- Bidirectional links MUST be recorded in the registry in the same change.

## 10. Artifact Registration Rules

- Register each ADR with a unique ID (`UCOS-CTX-ADR-NNN`), path, layer `CTX`, type `ADR`.
- Update the Constitution registry row: status `Baseline → Ratified`, add ADR downstream links.
- Never delete rows; supersede via new ADRs and link both directions.

## 11. Validation Requirements

- **Documentation gate (`GATE-DOC-001`):** D1–D5 MUST PASS (metadata, ADRs, registry, currency, placement).
- **Constitutional-compliance check:** every Article I–X explicitly evaluated PASS.
- **Traceability check:** zero orphans; Constitution and ADRs fully linked.
- Quality, Security, and Release gates are NOT exercised (no implementation in scope).

## 12. Completion Criteria

- Constitution status = Ratified; all Articles expanded with enforcement + amendment clauses.
- All governance ADRs authored, registered, and bidirectionally linked.
- Documentation gate PASS; compliance checklist PASS; zero blocking governance gaps.
- `PROJECT-STATE.md` advanced to reflect Constitution ratified, Prompt 02 authorized next.

## 13. State Update Rules

- Mark Prompt 01 ✅ Complete in the Completed Prompts table.
- Set Current Phase → "Phase 1 — Constitution Ratified"; Next Step → "Run Prompt 02".
- Record any open governance gaps in the Open Gaps table with owner and severity.
- Update the artifact counts and the registry verification note.

## 14. May Generate / May Not Generate

**MAY generate:** ratified Constitution, governance ADRs, amendment procedure, registry/state updates.

**MAY NOT generate:** capabilities, domains, metadata models, data models, experiences,
contracts, services, platform/technology decisions, security designs, or code. Violating this
breaches Constitution Article IX and MUST be rejected.

## Traceability
- Refines: `CTX-VISION-001`, `CTX-CONST-001` → Refined by: Prompts 02–12 (all).
