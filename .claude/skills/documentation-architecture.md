# Skill — Documentation Architecture

**Skill ID:** SKILL-011
**Governs:** Documentation discipline, `docs/`, and `.claude/governance/documentation-gates.md`.

## Purpose
Ensure architecture and decisions are captured as durable, discoverable, traceable artifacts.

## When to apply
Alongside every artifact; no increment is complete without its documentation.

## Standards & Rules
1. Every significant decision is an ADR with context, decision, consequences.
2. Documentation is versioned, owned, and registered in the Artifact Registry.
3. Each artifact states its ID, status, owner, and traceability links.
4. Diagrams accompany structural/behavioral descriptions where useful.
5. Documentation is kept current; stale docs are defects.
6. Audience-appropriate layering: overview → reference → runbook.

## Inputs
- Any produced artifact and its decisions.

## Outputs
- ADRs, architecture docs, runbooks, READMEs, registry entries.

## Definition of Done
- Artifact documented, traced, and discoverable; decisions captured as ADRs.

## Anti-patterns
- Tribal knowledge; undocumented decisions; orphan docs; out-of-date references.

## Traceability
- Refines: CTX-CONST-001 (Art. VIII)
- Feeds: documentation-gates, certification.
