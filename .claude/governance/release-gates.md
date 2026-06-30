# Governance — Release Gates

**Gate ID:** GATE-REL-001
**Authority:** Subordinate to Constitution (Art. VII) & Principles (P9, P10).
**Owner skills:** platform-engineering, production-readiness, traceability-enforcement.

## Purpose
Block any release that is not certified, reversible, and operable.

## Gate Checkpoints
| # | Checkpoint | Criterion |
|---|------------|-----------|
| R1 | Upstream gates | Quality, security, and documentation gates all PASS. |
| R2 | Certification | A valid certification record exists for the scope. |
| R3 | Versioning | Semantic versioning applied; changelog present. |
| R4 | Rollback | Tested rollback/rollforward strategy documented. |
| R5 | Migration | Data/contract migrations defined and reversible. |
| R6 | Observability | Dashboards, alerts, and SLOs in place pre-release. |
| R7 | Capacity | Capacity/scaling plan validated for expected load. |

## Inputs
- Certification record, gate results, release plan, rollback plan, observability config.

## Decision
- **PASS:** all checkpoints satisfied → release authorized.
- **FAIL:** any unmet checkpoint → release blocked; recorded as a gap.

## Evidence Required
- Certification ID, gate pass records, changelog, rollback runbook, dashboards.

## Bootstrap Status
- **Not exercised.** Nothing to release. Gate defined and ready.

## Traceability
- Refines: CTX-CONST-001 (Art. VII) → Consumed by: Prompt 12.
