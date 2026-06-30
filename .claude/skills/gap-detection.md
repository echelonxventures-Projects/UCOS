# Skill — Gap Detection

**Skill ID:** SKILL-013
**Governs:** Identification and recording of gaps across the program.

## Purpose
Systematically find absences and inconsistencies before they reach production.

## When to apply
After each generator, before each gate, and during certification.

## Gap Taxonomy
- **Coverage gap** — a capability/domain with no specification or realization.
- **Traceability gap** — orphan or dangling artifact.
- **Contract gap** — boundary without a versioned contract.
- **Security gap** — exposed boundary without authn/authz or unmapped threat.
- **Quality gap** — acceptance criterion without a verifying test.
- **Documentation gap** — decision/behavior without an artifact.
- **Consistency gap** — artifact contradicting a higher-precedence artifact.

## Standards & Rules
1. Each detected gap becomes a registered artifact: `UCOS-QA-GAP-NNN` with owner & severity.
2. Open gaps block certification of the affected scope.
3. Gaps move through: Detected → Owned → In-progress → Resolved (with evidence).
4. Resolved gaps are retained for audit, never deleted.

## Inputs
- All artifacts, the registry, gate results, traceability reports.

## Outputs
- Gap entries recorded in `PROJECT-STATE.md` (Open/Resolved Gaps) and the registry.

## Definition of Done
- Evaluated scope has all gaps detected and recorded with owner and severity.

## Anti-patterns
- Silent gaps; unowned gaps; closing gaps without evidence.

## Traceability
- Refines: SKILL-012, CTX-CONST-001 (Art. X)
- Feeds: all gates, certification, PROJECT-STATE.
