# Skill — Traceability Enforcement

**Skill ID:** SKILL-012
**Governs:** Lineage integrity across the program.
**Authority source:** `.claude/context/UCOS-TRACEABILITY-MODEL.md`, `UCOS-ARTIFACT-REGISTRY.md`

## Purpose
Verify that every artifact is correctly identified, linked, and registered.

## When to apply
At the end of every generator and as a precondition to every gate and certification.

## Standards & Rules
1. Validate the canonical chain: Vision → Principle → Capability → Domain → Spec → Contract →
   Service → Implementation → Test → Certification.
2. Enforce unique Artifact IDs and registry presence.
3. Enforce bidirectional links (refines / refined-by integrity).
4. Detect orphans (no upstream) and dangling realizations (no traced capability/domain).
5. On upstream change, flag all downstream artifacts for review.

## Inputs
- Artifact Registry, Traceability Model, candidate artifacts.

## Outputs
- Traceability report: pass/fail with the specific broken links and orphans.

## Definition of Done
- Zero orphans/dangling links in the evaluated scope, or each is logged as a gap.

## Anti-patterns
- Unregistered artifacts; one-directional links; "we'll trace it later".

## Traceability
- Refines: CTX-TRACE-001, CTX-REG-001
- Feeds: gap-detection, all gates, certification.
