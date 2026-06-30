# Governance — Quality Gates

**Gate ID:** GATE-QUAL-001
**Authority:** Subordinate to Constitution (Art. VII) & Principles (P10).
**Owner skills:** testing-architecture, gap-detection, traceability-enforcement.

## Purpose
Block progression of any increment that does not meet defined quality bars.

## Gate Checkpoints
| # | Checkpoint | Criterion |
|---|------------|-----------|
| Q1 | Specification quality | Requirements/specs are clear, testable, traced. |
| Q2 | Design review | Design conforms to skills & architecture baseline. |
| Q3 | Test coverage | Every acceptance criterion has a verifying test; coverage policy met. |
| Q4 | Contract tests | Provider/consumer contract tests pass at each boundary. |
| Q5 | Defect threshold | No open critical/blocking defects in scope. |
| Q6 | Non-functional | Performance/resilience targets verified where applicable. |

## Inputs
- Specifications, designs, test results, traceability & gap reports.

## Decision
- **PASS:** all applicable checkpoints satisfied.
- **FAIL:** any unmet checkpoint → recorded as a gap (`UCOS-QA-GAP-NNN`) blocking the scope.

## Evidence Required
- Test reports, coverage report, review notes, linked acceptance criteria.

## Bootstrap Status
- **Not exercised.** No implementation exists. Gate defined and ready.

## Traceability
- Refines: CTX-CONST-001 (Art. VII) → Consumed by: Prompts 11–12.
