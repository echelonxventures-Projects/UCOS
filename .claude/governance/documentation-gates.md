# Governance — Documentation Gates

**Gate ID:** GATE-DOC-001
**Authority:** Subordinate to Constitution (Art. VIII).
**Owner skills:** documentation-architecture, traceability-enforcement.

## Purpose
Block any increment whose decisions and behavior are not durably documented and traceable.

## Gate Checkpoints
| # | Checkpoint | Criterion |
|---|------------|-----------|
| D1 | Artifact metadata | ID, status, owner, traceability links present. |
| D2 | ADRs | Significant decisions captured as ADRs (context/decision/consequences). |
| D3 | Registry entry | Artifact registered in `UCOS-ARTIFACT-REGISTRY.md`. |
| D4 | Currency | Docs reflect current state; no stale references. |
| D5 | Discoverability | Artifact placed in the correct, conventional location. |
| D6 | Operability docs | Runbooks present where an increment is operable. |

## Inputs
- Candidate artifacts, registry, ADR set.

## Decision
- **PASS:** all applicable checkpoints satisfied.
- **FAIL:** any unmet checkpoint → documentation gap blocking the scope.

## Evidence Required
- Registry diff, ADR links, artifact headers, runbook references.

## Bootstrap Status
- **Active and passing for bootstrap artifacts** (all carry IDs, headers, and registry entries).

## Traceability
- Refines: CTX-CONST-001 (Art. VIII) → Consumed by: all prompts.
